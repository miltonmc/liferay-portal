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

import {FIELD_TYPE_FIELDSET} from './constants';
import {PagesVisitor} from './visitors.es';

export function checkValidFieldNameCharacter(character) {
	return /[A-Za-z0-9_]/g.test(character);
}

export function generateInstanceId(isNumbersOnly) {
	return Math.random()
		.toString(isNumbersOnly ? 10 : 36)
		.substr(2, 8);
}

export function getDefaultFieldName(isOptionField = false, fieldType = '') {
	const defaultFieldName = fieldType?.label
		? normalizeFieldName(fieldType.label)
		: isOptionField
		? Liferay.Language.get('option')
		: Liferay.Language.get('field');

	return defaultFieldName + generateInstanceId(true);
}

export function getFields(pages) {
	const fields = [];
	const visitor = new PagesVisitor(pages);

	visitor.visitFields((field) => {
		fields.push(field);
	});

	return fields;
}

export function hasFieldSet(field) {
	return field?.type === FIELD_TYPE_FIELDSET && field.ddmStructureId;
}

export function normalizeFieldName(fieldName) {
	let nextUpperCase = false;
	let normalizedFieldName = '';

	fieldName = fieldName.trim();

	for (let i = 0; i < fieldName.length; i++) {
		let item = fieldName[i];

		if (item === ' ') {
			nextUpperCase = true;

			continue;
		}
		else if (!checkValidFieldNameCharacter(item)) {
			continue;
		}

		if (nextUpperCase) {
			item = item.toUpperCase();

			nextUpperCase = false;
		}

		normalizedFieldName += item;
	}

	if (/^\d/.test(normalizedFieldName)) {
		normalizedFieldName = `_${normalizedFieldName}`;
	}

	return normalizedFieldName;
}
