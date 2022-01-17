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

import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {PageProvider} from 'data-engine-js-components-web';
import React from 'react';

import Options from '../../../src/main/resources/META-INF/resources/Options/Options.es';

const DEFAULT_OPTION_NAME_REGEX = /^Option[0-9]{8}$/;

let liferayLanguageSpy;

const spritemap = 'icons.svg';

const OptionsWithProvider = (props) => (
	<PageProvider value={{editingLanguageId: themeDisplay.getLanguageId()}}>
		<Options {...props} />
	</PageProvider>
);

const optionsValue = {
	[themeDisplay.getLanguageId()]: [
		{
			id: 'option1',
			label: 'Option 1',
			reference: 'Option1',
			value: 'Option1',
		},
		{
			id: 'option2',
			label: 'Option 2',
			reference: 'Option2',
			value: 'Option2',
		},
	],
};

const mockLiferayLanguage = () => {
	liferayLanguageSpy = jest.spyOn(Liferay.Language, 'get');

	liferayLanguageSpy.mockImplementation((key) => {
		if (key === 'option') {
			return 'Option';
		}

		return key;
	});
};

const unmockLiferayLanguage = () => {
	liferayLanguageSpy.mockRestore();
};

describe('Options', () => {
	// eslint-disable-next-line no-console
	const originalWarn = console.warn;

	beforeAll(() => {
		// eslint-disable-next-line no-console
		console.warn = (...args) => {
			if (/DataProvider: Trying/.test(args[0])) {
				return;
			}
			originalWarn.call(console, ...args);
		};
	});

	afterAll(() => {
		// eslint-disable-next-line no-console
		console.warn = originalWarn;
	});

	beforeEach(() => {
		jest.useFakeTimers();
		fetch.mockResponseOnce(JSON.stringify({}));
	});

	it('shows the options', () => {
		mockLiferayLanguage();

		const {container} = render(
			<OptionsWithProvider
				name="options"
				showKeyword={true}
				spritemap={spritemap}
				value={optionsValue}
			/>
		);

		const referenceInputs = document.querySelectorAll(
			'.key-value-reference-input'
		);

		expect(referenceInputs[2].value).toEqual(
			expect.stringMatching(DEFAULT_OPTION_NAME_REGEX)
		);

		referenceInputs[2].setAttribute('value', 'Any<String>');

		const valueInputs = document.querySelectorAll('.key-value-input');

		expect(valueInputs[2].value).toEqual(
			expect.stringMatching(DEFAULT_OPTION_NAME_REGEX)
		);

		valueInputs[2].setAttribute('value', 'Any<String>');

		expect(container).toMatchSnapshot();

		unmockLiferayLanguage();
	});

	it('shows the options with not editable value', () => {
		mockLiferayLanguage();

		render(
			<OptionsWithProvider
				keywordReadOnly={true}
				name="options"
				showKeyword={true}
				spritemap={spritemap}
				value={{
					[themeDisplay.getLanguageId()]: [
						{
							id: 'option1',
							label: 'Option 1',
							value: 'Option1',
						},
					],
				}}
			/>
		);

		const valueInputs = document.querySelectorAll('.key-value-input');

		expect(valueInputs[0].readOnly).toBeTruthy();
		expect(valueInputs[0].value).toEqual('Option1');

		unmockLiferayLanguage();
	});

	it('shows the options with editable value', () => {
		mockLiferayLanguage();

		render(
			<OptionsWithProvider
				keywordReadOnly={false}
				name="options"
				onChange={jest.fn()}
				showKeyword={true}
				spritemap={spritemap}
				value={{
					[themeDisplay.getLanguageId()]: [
						{
							id: 'option1',
							label: 'Option 1',
							reference: 'Reference1',
							value: 'Option1',
						},
					],
				}}
			/>
		);

		userEvent.type(screen.getByDisplayValue('Option1'), 'Option2');

		const valueInputs = document.querySelectorAll('.key-value-input');

		expect(valueInputs[0].readOnly).toBeFalsy();
		expect(valueInputs[0].value).toEqual('Option2');

		unmockLiferayLanguage();
	});

	it('shows an empty option when value is an array of size 1', () => {
		mockLiferayLanguage();

		render(
			<OptionsWithProvider
				name="options"
				onChange={jest.fn()}
				showKeyword={true}
				spritemap={spritemap}
				value={{
					[themeDisplay.getLanguageId()]: [
						{
							id: 'option',
							label: 'Option',
							value: 'Option',
						},
					],
				}}
			/>
		);

		const labelInputs = document.querySelectorAll('.ddm-field-text');

		expect(labelInputs.length).toEqual(2);
		expect(labelInputs[0].value).toEqual('Option');
		expect(labelInputs[1].value).toEqual('');

		const valueInputs = document.querySelectorAll('.key-value-input');

		expect(valueInputs.length).toEqual(2);
		expect(valueInputs[0].value).toEqual('Option');
		expect(valueInputs[1].value).toEqual(
			expect.stringMatching(DEFAULT_OPTION_NAME_REGEX)
		);

		unmockLiferayLanguage();
	});

	it('does show an empty option when translating', () => {
		render(
			<OptionsWithProvider
				defaultLanguageId={themeDisplay.getLanguageId()}
				editingLanguageId="pt_BR"
				name="options"
				onChange={jest.fn()}
				spritemap={spritemap}
				value={{
					[themeDisplay.getLanguageId()]: [
						{
							id: 'option',
							label: 'Option',
							value: 'Option',
						},
					],
					pt_BR: [
						{
							id: 'option',
							label: 'Option',
							value: 'Option',
						},
					],
				}}
			/>
		);

		const labelInputs = document.querySelectorAll('.ddm-field-text');

		expect(labelInputs.length).toEqual(2);
	});

	it('does not changes the option value when the option label changes', () => {
		mockLiferayLanguage();

		render(
			<OptionsWithProvider
				name="options"
				onChange={jest.fn()}
				showKeyword={true}
				spritemap={spritemap}
				value={{
					[themeDisplay.getLanguageId()]: [
						{
							id: 'option1',
							label: 'Option 1',
							value: 'Option1',
						},
					],
				}}
			/>
		);

		userEvent.type(screen.getByDisplayValue('Option 1'), 'Option 2');

		const labelInputs = document.querySelectorAll('.ddm-field-text');
		expect(labelInputs[0].value).toEqual('Option 2');

		const valueInputs = document.querySelectorAll('.key-value-input');
		expect(valueInputs[0].value).toEqual('Option1');

		unmockLiferayLanguage();
	});

	it('edits the value of an option based on the label', () => {
		render(
			<OptionsWithProvider
				name="options"
				onChange={jest.fn()}
				showKeyword={true}
				spritemap={spritemap}
				value={{
					[themeDisplay.getLanguageId()]: [
						{
							id: 'option',
							label: 'Option',
							value: 'Option',
						},
					],
				}}
			/>
		);

		const labelInputs = document.querySelectorAll('.ddm-field-text');

		userEvent.type(labelInputs[0], 'Hello');

		const valueInputs = document.querySelectorAll('.key-value-input');

		expect(valueInputs[0].value).toEqual('Option');
	});

	it('inserts a new empty option when editing the last option', () => {
		render(
			<OptionsWithProvider
				name="options"
				onChange={jest.fn()}
				showKeyword={true}
				spritemap={spritemap}
				value={{
					[themeDisplay.getLanguageId()]: [
						{
							id: 'option',
							label: 'Option',
							value: 'Option',
						},
					],
				}}
			/>
		);

		const labelInputs = document.querySelectorAll('.ddm-field-text');

		userEvent.type(labelInputs[1], 'Hello');

		const valueInputs = document.querySelectorAll('.key-value-input');

		expect(valueInputs.length).toEqual(labelInputs.length + 1);
	});

	it('does not insert a new empty option automatically if translating', () => {
		render(
			<OptionsWithProvider
				defaultLanguageId={themeDisplay.getLanguageId()}
				editingLanguageId="pt_BR"
				name="options"
				onChange={jest.fn()}
				showKeyword={true}
				spritemap={spritemap}
				value={{
					[themeDisplay.getLanguageId()]: [
						{
							id: 'option',
							label: 'Option',
							value: 'Option',
						},
					],
					pt_BR: [
						{
							id: 'option',
							label: 'Option',
							value: 'Option',
						},
					],
				}}
			/>
		);

		const labelInputs = document.querySelectorAll('.ddm-field-text');

		userEvent.type(labelInputs[0], 'Hello');

		const valueInputs = document.querySelectorAll('.key-value-input');

		expect(valueInputs.length).toEqual(labelInputs.length);
	});

	it('deduplication of value when adding a new option', () => {
		mockLiferayLanguage();

		render(
			<OptionsWithProvider
				name="options"
				onChange={jest.fn()}
				showKeyword={true}
				spritemap={spritemap}
				value={{
					[themeDisplay.getLanguageId()]: [
						{
							id: 'foo',
							label: 'Foo',
							value: 'Foo',
						},
					],
				}}
			/>
		);

		const labelInputs = document.querySelectorAll('.ddm-field-text');

		userEvent.type(labelInputs[1], 'Foo');

		const valueInputs = document.querySelectorAll('.key-value-input');

		expect(valueInputs[1].value).toEqual(
			expect.stringMatching(DEFAULT_OPTION_NAME_REGEX)
		);

		unmockLiferayLanguage();
	});

	it('deduplication of the value when editing the value', () => {
		render(
			<OptionsWithProvider
				name="options"
				onChange={jest.fn()}
				showKeyword={true}
				spritemap={spritemap}
				value={{
					[themeDisplay.getLanguageId()]: [
						{
							id: 'bar',
							label: 'Bar',
							value: 'Bar',
						},
						{
							id: 'foo',
							label: 'Foo',
							value: 'Foo',
						},
					],
				}}
			/>
		);

		const labelInputs = document.querySelectorAll('.ddm-field-text');

		userEvent.type(labelInputs[1], 'Bar');

		const valueInputs = document.querySelectorAll('.key-value-input');

		expect(valueInputs[1].value).toEqual('Foo');
	});

	it('adds a value to the value property when the label is empty', () => {
		render(
			<OptionsWithProvider
				name="options"
				onChange={jest.fn()}
				showKeyword={true}
				spritemap={spritemap}
				value={{
					[themeDisplay.getLanguageId()]: [
						{
							id: 'bar',
							label: 'Bar',
							value: 'Bar',
						},
					],
				}}
			/>
		);

		const labelInput = document.querySelector('.ddm-field-text');

		fireEvent.input(labelInput, {target: {value: ''}});

		const valueInput = document.querySelector('.key-value-input');

		expect(valueInput.value).toBe('Bar');
	});

	it('removes an option when click on remove button', () => {
		render(
			<OptionsWithProvider
				defaultLanguageId={themeDisplay.getLanguageId()}
				editingLanguageId="pt_BR"
				name="options"
				onChange={jest.fn()}
				spritemap={spritemap}
				value={{
					...optionsValue,
					pt_BR: [
						{
							id: 'option1',
							label: 'Option 1',
							reference: 'Option1',
							value: 'Option1',
						},
						{
							id: 'option2',
							label: 'Option 2',
							reference: 'Option2',
							value: 'Option2',
						},
					],
				}}
			/>
		);

		let options = document.querySelectorAll('.ddm-field-options');

		expect(options.length).toEqual(3);

		const removeOptionButton = document.querySelector(
			'.ddm-option-entry .close'
		);

		fireEvent.click(removeOptionButton);

		options = document.querySelectorAll('.ddm-field-options');

		expect(options.length).toEqual(2);
	});

	it('checks if the initial value of the option reference matches the option value', () => {
		mockLiferayLanguage();

		render(
			<OptionsWithProvider
				name="options"
				showKeyword={true}
				spritemap={spritemap}
				value={optionsValue}
			/>
		);

		const referenceInputs = document.querySelectorAll(
			'.key-value-reference-input'
		);

		expect(referenceInputs[2].value).toEqual(
			expect.stringMatching(DEFAULT_OPTION_NAME_REGEX)
		);

		const valueInputs = document.querySelectorAll('.key-value-input');

		expect(referenceInputs[2].value).toBe(valueInputs[2].value);

		unmockLiferayLanguage();
	});

	describe('Normalize option reference during the onBlur event', () => {
		it('changes to the option value when the reference is duplicated', () => {
			mockLiferayLanguage();

			render(
				<OptionsWithProvider
					name="options"
					onChange={jest.fn()}
					spritemap={spritemap}
					value={{
						[themeDisplay.getLanguageId()]: [
							{
								id: 'option1',
								label: 'Option 1',
								reference: 'Reference1',
								value: 'Option1',
							},
							{
								id: 'option2',
								label: 'Option 2',
								reference: 'Reference2',
								value: 'Option2',
							},
						],
					}}
				/>
			);

			const referenceInputs = document.querySelectorAll(
				'.key-value-reference-input'
			);

			expect(referenceInputs[0].value).toBe('Reference1');
			expect(referenceInputs[1].value).toBe('Reference2');

			userEvent.type(referenceInputs[0], 'Reference2');

			fireEvent.blur(referenceInputs[0]);

			expect(referenceInputs[0].value).toBe('Option1');
			expect(referenceInputs[1].value).toBe('Reference2');

			unmockLiferayLanguage();
		});

		it('changes to the option value when the reference is empty', () => {
			mockLiferayLanguage();

			render(
				<OptionsWithProvider
					name="options"
					onChange={jest.fn()}
					spritemap={spritemap}
					value={{
						[themeDisplay.getLanguageId()]: [
							{
								id: 'id',
								label: 'Label',
								reference: 'Reference',
								value: 'Value',
							},
						],
					}}
				/>
			);

			const referenceInput = document.querySelector(
				'.key-value-reference-input'
			);

			expect(referenceInput.value).toBe('Reference');

			fireEvent.input(referenceInput, {target: {value: ''}});

			fireEvent.blur(referenceInput);

			expect(referenceInput.value).toEqual('Value');

			unmockLiferayLanguage();
		});
	});
});
