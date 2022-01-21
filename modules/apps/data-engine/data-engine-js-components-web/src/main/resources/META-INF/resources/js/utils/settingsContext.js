/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import {getDefaultFieldName} from './fieldSupport';
import {normalizeFieldName} from './fields.es';
import {PagesVisitor} from './visitors.es';

export function getSettingsContextProperty(
	settingsContext,
	propertyName,
	propertyType = 'value'
) {
	let propertyValue;
	const visitor = new PagesVisitor(settingsContext.pages);

	visitor.mapFields((field) => {
		if (propertyName === field.fieldName) {
			propertyValue = field[propertyType];
		}
	});

	return propertyValue;
}

function setFieldReferenceErrorMessage(
	settingsContext,
	propertyName,
	displayErrors = true,
	shouldUpdateValue = false
) {
	const visitor = new PagesVisitor(settingsContext.pages);

	return {
		...settingsContext,
		pages: visitor.mapFields((field) => {
			if (propertyName === field.fieldName) {
				field = {
					...field,
					displayErrors,
					errorMessage: Liferay.Language.get(
						'this-reference-is-already-being-used'
					),
					shouldUpdateValue,
					valid: !displayErrors,
				};
			}

			return field;
		}),
	};
}

export function updateSettingsContextProperty(
	editingLanguageId,
	settingsContext,
	propertyName,
	propertyValue,
	parentFieldName
) {
	const visitor = new PagesVisitor(settingsContext.pages);

	return {
		...settingsContext,
		pages: visitor.mapFields((field) => {
			const {fieldName, localizable, localizedValue} = field;

			if (fieldName === 'validation') {
				return updateFieldValidationProperty(
					field,
					propertyName,
					propertyValue,
					parentFieldName
				);
			}

			if (propertyName !== fieldName) {
				return field;
			}

			const updatedField = {
				...field,

				/* TODO: remove from localizable fields after properly sync value with the sidebar */
				value: propertyValue,
			};

			if (localizable) {
				updatedField.localizedValue = {
					...localizedValue,
					[editingLanguageId]: propertyValue,
				};
			}

			return updatedField;
		}),
	};
}

function updateFieldValidationProperty(
	field,
	propertyName,
	propertyValue,
	parentFieldName
) {
	const {validation, value} = field;

	if (!parentFieldName || !value) {
		return field;
	}

	const expression = value.expression;

	if (expression?.value && propertyName === 'name') {
		expression.value = expression.value.replaceAll(
			parentFieldName,
			propertyValue
		);
	}

	const validationKey = propertyName === 'name' ? 'fieldName' : propertyName;

	return {
		...field,
		validation: {
			...validation,
			[validationKey]: propertyValue,
		},
		value: {
			...field.value,
			expression,
		},
	};
}

function updateFieldName(editingLanguageId, fieldNameGenerator, field, value) {
	const normalizedFieldName = normalizeFieldName(value);

	const newFieldName = fieldNameGenerator(
		normalizedFieldName === '' ? getDefaultFieldName() : value,
		field.fieldName
	);

	if (!newFieldName) {
		return field;
	}

	return {
		...field,
		fieldName: newFieldName,
		name: newFieldName,
		settingsContext: updateSettingsContextProperty(
			editingLanguageId,
			field.settingsContext,
			'name',
			newFieldName,
			field.fieldName
		),
	};
}

export function updateFieldReference(
	field,
	invalid = false,
	shouldUpdateValue = false
) {
	const {settingsContext} = field;

	return {
		...field,
		settingsContext: setFieldReferenceErrorMessage(
			settingsContext,
			'fieldReference',
			invalid,
			shouldUpdateValue
		),
	};
}

function updateFieldLabel(
	defaultLanguageId,
	editingLanguageId,
	fieldNameGenerator,
	field,
	generateFieldNameUsingFieldLabel,
	value
) {
	let {fieldName, settingsContext} = field;
	let label = value;

	if (
		generateFieldNameUsingFieldLabel &&
		defaultLanguageId === editingLanguageId
	) {
		const updates = updateFieldName(
			editingLanguageId,
			fieldNameGenerator,
			field,
			value
		);

		fieldName = updates.fieldName;
		settingsContext = updates.settingsContext;
	}

	if (typeof value === 'object') {
		label = value[editingLanguageId] || value[defaultLanguageId];
	}

	return {
		...field,
		fieldName,
		label,
		settingsContext: updateSettingsContextProperty(
			editingLanguageId,
			settingsContext,
			'label',
			value
		),
	};
}

const isLocalizedObjectValue = ({localizable, value}) => {
	return typeof value === 'object' && localizable;
};

const getValueLocalized = (
	localizable,
	value,
	defaultLanguageId,
	editingLanguageId
) => {
	if (
		isLocalizedObjectValue({localizable, value}) &&
		value[editingLanguageId] !== undefined
	) {
		return value[editingLanguageId];
	}
	else if (
		isLocalizedObjectValue({localizable, value}) &&
		value[defaultLanguageId]
	) {
		return value[defaultLanguageId];
	}

	return value;
};

export function updateField(
	{
		defaultLanguageId,
		editingLanguageId,
		fieldNameGenerator,
		generateFieldNameUsingFieldLabel,
	},
	field,
	propertyName,
	propertyValue
) {
	switch (propertyName) {
		case 'dataType': {
			return {
				...field,
				dataType: propertyValue,
				settingsContext: updateSettingsContextProperty(
					editingLanguageId,
					field.settingsContext,
					'dataType',
					propertyValue,
					field.fieldName
				),
			};
		}
		case 'label': {
			return updateFieldLabel(
				defaultLanguageId,
				editingLanguageId,
				fieldNameGenerator,
				field,
				generateFieldNameUsingFieldLabel,
				propertyValue
			);
		}
		case 'name': {
			return updateFieldName(
				editingLanguageId,
				fieldNameGenerator,
				field,
				propertyValue
			);
		}
		case 'numericInputMask': {
			return {
				...field,
				...propertyValue,
			};
		}
		case 'options':
			return {
				...field,
				options: propertyValue[editingLanguageId],
				settingsContext: updateSettingsContextProperty(
					editingLanguageId,
					field.settingsContext,
					'options',
					propertyValue
				),
			};
		default:
			return {
				...field,
				[propertyName]: getValueLocalized(
					field.localizable,
					propertyValue,
					defaultLanguageId,
					editingLanguageId
				),
				settingsContext: updateSettingsContextProperty(
					editingLanguageId,
					field.settingsContext,
					propertyName,
					propertyValue
				),
			};
	}
}
