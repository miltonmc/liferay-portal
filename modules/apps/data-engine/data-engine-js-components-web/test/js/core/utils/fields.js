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

import {
	generateFieldName,
	getFieldProperty,
	updateField,
} from '../../../../src/main/resources/META-INF/resources/js/core/utils/fields';
import mockPages from '../../__mock__/mockPages.es';

describe('core/utils/fields', () => {
	describe('generateFieldName(pages, desiredName, currentName)', () => {
		it('generates a name based on the desired name', () => {
			const name = generateFieldName(
				mockPages,
				'New  Name!',
				undefined,
				undefined,
				true
			);
			expect(name).toEqual('NewName');
		});

		it('generates an incremental name when desired name is already being used', () => {
			const name = generateFieldName(
				mockPages,
				'radio',
				undefined,
				undefined,
				true
			);
			expect(name).toEqual('radio1');
		});

		it('generates an incremental name when changing desired name to an already used one', () => {
			const name = generateFieldName(
				mockPages,
				'radio!!',
				undefined,
				undefined,
				true
			);
			expect(name).toEqual('radio1');
		});

		it('fallbacks to currentName when generated name is invalid', () => {
			const name = generateFieldName(
				mockPages,
				'radio!',
				'radio',
				undefined,
				true
			);
			expect(name).toEqual('radio');
		});
	});

	describe('updateField(state, field, propertyName, propertyValue)', () => {
		let field;
		let state;

		beforeEach(() => {
			field = {
				fieldName: 'oldFieldName',
				label: 'Old Field Label',
				settingsContext: {
					pages: [
						{
							rows: [
								{
									columns: [
										{
											fields: [
												{
													fieldName: 'name',
													value: 'oldFieldName',
												},
												{
													fieldName: 'label',
													value: 'Old Field Label',
												},
												{
													fieldName: 'readOnly',
													value: false,
												},
												{
													fieldName: 'dataType',
													value: 'oldDataType',
												},
												{
													fieldName:
														'predefinedValue',
													value: [
														{
															label: 'Predefined',
															value: 'Predefined',
														},
													],
												},
												{
													fieldName: 'validation',
													validation: {
														dataType: 'oldDataType',
														fieldName:
															'oldFieldName',
													},
													value: {
														expression: {
															value:
																'isEmailAddress(oldFieldName)',
														},
													},
												},
											],
										},
									],
								},
							],
						},
					],
				},
			};

			state = {
				editingLanguageId: 'en_US',
				fieldNameGenerator: (value) => value.replaceAll(' ', ''),
			};
		});

		it('updates the desired property', () => {
			const {readOnly} = updateField(state, field, 'readOnly', true);

			expect(readOnly).toEqual(true);
		});

		describe('propertyName = "dataType"', () => {
			it('updates the field "dataType" property', () => {
				const {dataType} = updateField(
					state,
					field,
					'dataType',
					'newDataType'
				);

				expect(dataType).toEqual('newDataType');
			});

			it('updates the settingsContext of the field with the new dataType', () => {
				const {
					settingsContext: {pages},
				} = updateField(state, field, 'dataType', 'newDataType');

				expect(getFieldProperty(pages, 'dataType', 'value')).toEqual(
					'newDataType'
				);
			});

			it('updates the validation expression of the validation field of the settingsContext with the new dataType', () => {
				const {
					settingsContext: {pages},
				} = updateField(state, field, 'dataType', 'newDataType');

				expect(
					getFieldProperty(pages, 'validation', 'validation').dataType
				).toEqual('newDataType');
			});
		});

		describe('propertyName = "label"', () => {
			it('updates the field "label" property', () => {
				const updatedField = updateField(
					state,
					field,
					'label',
					'New Label'
				);

				expect(updatedField.label).toEqual('New Label');
			});

			it('updates the settingsContext of the field with the new field label', () => {
				const updatedField = updateField(
					state,
					field,
					'label',
					'New Label'
				);

				expect(
					getFieldProperty(
						updatedField.settingsContext.pages,
						'label',
						'value'
					)
				).toEqual('New Label');
			});

			it('automaticallys update the field name if it was auto generated from its label', () => {
				const updatedField = updateField(
					{
						...state,
						defaultLanguageId: 'en_US',
						generateFieldNameUsingFieldLabel: true,
					},
					field,
					'label',
					'New Label'
				);

				expect(updatedField.fieldName).toEqual('NewLabel');
				expect(
					getFieldProperty(
						updatedField.settingsContext.pages,
						'name',
						'value'
					)
				).toEqual('NewLabel');
			});

			it('does not automatically update the field name if it was not auto generated from its label', () => {
				const updatedField = updateField(
					state,
					field,
					'label',
					'New Label'
				);

				expect(updatedField.fieldName).toEqual('oldFieldName');
				expect(
					getFieldProperty(
						updatedField.settingsContext.pages,
						'name',
						'value'
					)
				).toEqual('oldFieldName');
			});
		});

		describe('propertyName = "name"', () => {
			it('updates the field "fieldName" property', () => {
				const {fieldName} = updateField(
					state,
					field,
					'name',
					'newName'
				);

				expect(fieldName).toEqual('newName');
			});

			it('updates the settingsContext of the field with the new field name', () => {
				const {
					settingsContext: {pages},
				} = updateField(state, field, 'name', 'newName');

				expect(getFieldProperty(pages, 'name', 'value')).toEqual(
					'newName'
				);
			});

			it('updates the validation expression of the validation field of the settingsContext with the new field name', () => {
				const {
					settingsContext: {pages},
				} = updateField(state, field, 'name', 'newName');

				expect(
					getFieldProperty(pages, 'validation', 'value').expression
						.value
				).toEqual('isEmailAddress(newName)');
				expect(
					getFieldProperty(pages, 'validation', 'validation')
						.fieldName
				).toEqual('newName');
			});

			it('falls back to the previous valid name when trying to change to an invalid one', () => {
				const {
					settingsContext: {pages},
				} = updateField(state, field, 'name', 'oldName');

				expect(getFieldProperty(pages, 'name', 'value')).toEqual(
					'oldName'
				);
			});
		});

		describe('propertyName = "options"', () => {
			it('updates the field "options" property', () => {
				const value = {
					en_US: [{label: 'New Label', value: 'NewLabel'}],
				};

				const {options} = updateField(state, field, 'options', value);

				expect(options).toEqual(value.en_US);
			});
		});
	});
});
