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

import {updateField} from '../../../src/main/resources/META-INF/resources/js/utils/settingsContext';
import {camelize} from '../../../src/main/resources/META-INF/resources/js/utils/strings';

const generateField = (...settingsContextFields) => ({
	fieldName: 'oldFieldName',
	label: 'Old Field Label',
	readonly: false,
	settingsContext: {
		pages: [{rows: [{columns: [{fields: [...settingsContextFields]}]}]}],
	},
});

const getSettingsContextField = ({
	settingsContext: {
		pages: [
			{
				rows: [
					{
						columns: [
							{
								fields: [settingsContextField],
							},
						],
					},
				],
			},
		],
	},
}) => settingsContextField;

const fieldNameGenerator = jest.fn((propertyValue) => camelize(propertyValue));

describe('utils/settingsContext/updateField()', () => {
	describe('Update Field Label', () => {
		it('updates the field property', () => {
			const field = generateField();

			const {label} = updateField({}, field, 'label', 'New Label');

			expect(label).toEqual('New Label');
		});

		it('updates the settingsContext', () => {
			const field = generateField({
				fieldName: 'label',
				value: 'Old Field Label',
			});

			const updatedField = updateField({}, field, 'label', 'New Label');

			const {fieldName, value} = getSettingsContextField(updatedField);
			expect(fieldName).toEqual('label');
			expect(value).toEqual('New Label');
		});

		it('not updates field name by default', () => {
			const field = generateField({
				fieldName: 'name',
				value: 'oldFieldName',
			});

			const updatedField = updateField({}, field, 'label', 'New Label');

			expect(updatedField.fieldName).toEqual('oldFieldName');

			const {value} = getSettingsContextField(updatedField);
			expect(value).toEqual('oldFieldName');
		});

		it('updates the field name based on the label if "generateFieldNameUsingFieldLabel" is true', () => {
			const field = generateField({
				fieldName: 'name',
				value: 'oldFieldName',
			});

			const updatedField = updateField(
				{
					fieldNameGenerator,
					generateFieldNameUsingFieldLabel: true,
				},
				field,
				'label',
				'New Label'
			);

			expect(updatedField.fieldName).toEqual('NewLabel');

			const {value} = getSettingsContextField(updatedField);
			expect(value).toEqual('NewLabel');
		});
	});

	describe('Update Field Name', () => {
		it('updates the field property', () => {
			const field = generateField();

			const {fieldName} = updateField(
				{fieldNameGenerator},
				field,
				'name',
				'newName'
			);

			expect(fieldName).toEqual('newName');
		});

		it('updates the settingsContext', () => {
			const field = generateField({
				fieldName: 'name',
				value: 'oldFieldName',
			});
			const updatedField = updateField(
				{fieldNameGenerator},
				field,
				'name',
				'newName'
			);

			const {fieldName, value} = getSettingsContextField(updatedField);
			expect(fieldName).toEqual('name');
			expect(value).toEqual('newName');
		});

		it('updates the validation into the settingsContext', () => {
			const field = generateField({
				fieldName: 'validation',
				validation: {
					dataType: 'oldDataType',
					fieldName: 'oldFieldName',
				},
				value: {
					expression: 'isEmailAddress(oldFieldName)',
				},
			});
			const updatedField = updateField(
				{fieldNameGenerator},
				field,
				'name',
				'newName'
			);

			const {
				validation: {fieldName},
				value: {expression},
			} = getSettingsContextField(updatedField);
			expect(fieldName).toEqual('newName');
			expect(expression).toEqual('isEmailAddress(newName)');
		});

		it('not updates field property if name is invalid', () => {
			const field = generateField();

			const updatedField = updateField(
				{fieldNameGenerator},
				field,
				'name',
				'newName'
			);

			expect(updatedField.fieldName).toEqual('oldName');

			const {value} = getSettingsContextField(updatedField);
			expect(value).toEqual('oldName');
		});
	});

	describe('Update Field DataType', () => {
		it('updates the field property', () => {
			const field = generateField();

			const {dataType} = updateField(
				{},
				field,
				'dataType',
				'newDataType'
			);

			expect(dataType).toEqual('newDataType');
		});

		it('updates the settingsContext', () => {
			const field = generateField({
				fieldName: 'dataType',
				value: 'oldDataType',
			});

			const updatedField = updateField(
				{},
				field,
				'dataType',
				'newDataType'
			);

			const {fieldName, value} = getSettingsContextField(updatedField);
			expect(fieldName).toEqual('dataType');
			expect(value).toEqual('newDataType');
		});

		it('updates the validation into the settingsContext', () => {
			const field = generateField({
				fieldName: 'validation',
				validation: {
					dataType: 'oldDataType',
					fieldName: 'oldFieldName',
				},
				value: {
					expression: 'isEmailAddress(oldFieldName)',
				},
			});

			const updatedField = updateField(
				{},
				field,
				'dataType',
				'newDataType'
			);

			const {
				validation: {dataType},
			} = getSettingsContextField(updatedField);
			expect(dataType).toEqual('newDataType');
		});
	});

	describe('Update Field Options', () => {
		it('updates the field property', () => {
			const field = generateField();
			const newOptions = {en_US: {label: 'New Label', value: 'NewLabel'}};

			const {options} = updateField(
				{editingLanguageId: 'en_US'},
				field,
				'options',
				newOptions
			);

			expect(options).toEqual(newOptions['en_US']);
		});
	});

	describe('default field update', () => {
		it('updates the property', () => {
			const field = generateField();

			const {readOnly} = updateField({}, field, 'readOnly', true);

			expect(readOnly).toEqual(true);
		});
	});
});
