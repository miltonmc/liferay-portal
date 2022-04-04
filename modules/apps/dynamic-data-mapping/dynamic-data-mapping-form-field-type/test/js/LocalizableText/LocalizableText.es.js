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

import '@testing-library/jest-dom/extend-expect';
import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ReactDOM from 'react-dom';

import LocalizableText from '../../../src/main/resources/META-INF/resources/LocalizableText/LocalizableText.es';

const defaultLocalizableTextConfig = {
	availableLocales: [
		{
			displayName: 'English (United States)',
			icon: 'en-us',
			localeId: 'en_US',
		},
		{displayName: 'العربية (السعودية)', icon: 'ar-sa', localeId: 'ar_SA'},
		{displayName: 'català (Espanya)', icon: 'ca-es', localeId: 'ca_ES'},
		{displayName: '中文 (中国)', icon: 'zh-cn', localeId: 'zh_CN'},
		{
			displayName: 'Nederlands (Nederland)',
			icon: 'nl-nl',
			localeId: 'nl_NL',
		},
		{displayName: 'suomi (Suomi)', icon: 'fi-fi', localeId: 'fi_FI'},
		{displayName: 'français (France)', icon: 'fr-fr', localeId: 'fr_FR'},
		{
			displayName: 'Deutsch (Deutschland)',
			icon: 'de-de',
			localeId: 'de_DE',
		},
		{
			displayName: 'magyar (Magyarország)',
			icon: 'hu-hu',
			localeId: 'hu_HU',
		},
		{displayName: '日本語 (日本)', icon: 'ja-jp', localeId: 'ja_JP'},
		{displayName: 'português (Brasil)', icon: 'pt-br', localeId: 'pt_BR'},
		{displayName: 'español (España)', icon: 'es-es', localeId: 'es_ES'},
		{displayName: 'svenska (Sverige)', icon: 'sv-se', localeId: 'sv_SE'},
	],
	defaultLocale: {
		displayName: 'English (United States)',
		icon: 'en-us',
		localeId: 'en_US',
	},
	name:
		'_com_liferay_configuration_admin_web_portlet_SystemSettingsPortlet_ddm$$emailArticleAddedSubject$uoeJR4Me$0$$en_US',
};

describe('Field LocalizableText', () => {
	beforeAll(() => {
		ReactDOM.createPortal = jest.fn((element) => {
			return element;
		});
	});

	beforeEach(() => {
		Liferay.component = jest.fn();
	});

	it('is not readOnly', () => {
		const {container} = render(
			<LocalizableText
				{...defaultLocalizableTextConfig}
				value={{
					ca_ES: 'Teste ES',
					en_US: 'Test EUA',
					pt_BR: 'Teste BR',
				}}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('has a label', () => {
		const {container} = render(
			<LocalizableText
				{...defaultLocalizableTextConfig}
				label="label"
				value={{
					ca_ES: 'Teste ES',
					en_US: 'Test EUA',
					pt_BR: 'Teste BR',
				}}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('has a placeholder', () => {
		const {container} = render(
			<LocalizableText
				{...defaultLocalizableTextConfig}
				placeholder="Placeholder"
				value={{
					ca_ES: 'Teste ES',
					en_US: 'Test EUA',
					pt_BR: 'Teste BR',
				}}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('is not required', () => {
		const {container} = render(
			<LocalizableText
				{...defaultLocalizableTextConfig}
				value={{
					ca_ES: 'Teste ES',
					en_US: 'Test EUA',
					pt_BR: 'Teste BR',
				}}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('renders values', () => {
		const {container} = render(
			<LocalizableText
				{...defaultLocalizableTextConfig}
				value={{
					ca_ES: 'Teste ES',
					en_US: 'Test EUA',
					pt_BR: 'Teste BR',
				}}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('renders no values when values come empty', () => {
		const {container} = render(
			<LocalizableText {...defaultLocalizableTextConfig} value={{}} />
		);

		expect(container).toMatchSnapshot();
	});

	it('shows default language value when no other language is selected', () => {
		const {container} = render(
			<LocalizableText
				{...defaultLocalizableTextConfig}
				value={{
					ca_ES: 'Teste ES',
					en_US: 'Test EUA',
					pt_BR: 'Teste BR',
				}}
			/>
		);

		const triggerElement = screen.getByTestId('triggerText');

		expect(triggerElement.textContent).toEqual('en-us');

		expect(container).toMatchSnapshot();
	});

	it('emits field edit event on field change', () => {
		const EXPECTED_VALUE =
			'{"ca_ES":"Teste ES","en_US":"Test 2 EUA","pt_BR":"Teste BR"}';

		const handleFieldEdited = jest.fn();

		const {container} = render(
			<LocalizableText
				{...defaultLocalizableTextConfig}
				onChange={handleFieldEdited}
				value={{
					ca_ES: 'Teste ES',
					en_US: 'Test EUA',
					pt_BR: 'Teste BR',
				}}
			/>
		);

		const inputComponent = screen.getByTestId('visibleChangeInput');

		userEvent.type(inputComponent, 'Test 2 EUA');

		expect(handleFieldEdited).toHaveBeenCalledWith(
			expect.any(Object),
			EXPECTED_VALUE
		);

		expect(container).toMatchSnapshot();
	});

	it('fills with the selected language value when the selected language is translated', () => {
		const {container} = render(
			<LocalizableText
				{...defaultLocalizableTextConfig}
				onChange={jest.fn()}
				value={{
					ca_ES: 'Teste ES',
					en_US: 'Test EUA',
					pt_BR: 'Teste BR',
				}}
			/>
		);

		const triggerButton = screen.getByTestId('triggerButton');

		userEvent.click(triggerButton);

		const dropdownItem = screen.getByTestId(
			'availableLocalesDropdownca_ES'
		);

		userEvent.click(dropdownItem);

		const inputElement = screen.getByTestId('visibleChangeInput');

		expect(inputElement.value).toEqual('Teste ES');

		expect(triggerButton.textContent).toEqual('ca-es');

		expect(container).toMatchSnapshot();
	});

	it('fills with the default language value when the selected language is not translated', () => {
		const {container} = render(
			<LocalizableText
				{...defaultLocalizableTextConfig}
				onChange={jest.fn()}
				value={{
					ca_ES: 'Teste ES',
					en_US: 'Test EUA',
					pt_BR: 'Teste BR',
				}}
			/>
		);

		const triggerElement = screen.getByTestId('triggerText');

		expect(triggerElement.textContent).toEqual('en-us');

		userEvent.click(triggerElement);

		const dropdownItem = screen.getByTestId(
			'availableLocalesDropdownja_JP'
		);

		userEvent.click(dropdownItem);

		expect(triggerElement).toHaveProperty('textContent', 'ja-jp');

		expect(screen.getByTestId('visibleChangeInput')).toHaveValue(
			'Test EUA'
		);

		expect(container).toMatchSnapshot();
	});

	it('adds a new translation for an untranslated item', () => {
		const {container} = render(
			<LocalizableText
				{...defaultLocalizableTextConfig}
				onChange={jest.fn()}
				value={{
					ca_ES: 'Teste ES',
					en_US: 'Test EUA',
					pt_BR: 'Teste BR',
				}}
			/>
		);

		const triggerElement = screen.getByTestId('triggerText');

		expect(triggerElement.textContent).toEqual('en-us');

		userEvent.click(triggerElement);

		const dropdownItem = screen.getByTestId(
			'availableLocalesDropdownja_JP'
		);

		userEvent.click(dropdownItem);

		const inputComponent = screen.getByTestId('visibleChangeInput');

		expect(inputComponent.textContent).toEqual('');

		userEvent.type(inputComponent, 'Test JP');

		expect(inputComponent.value).toEqual('Test JP');

		expect(container).toMatchSnapshot();
	});

	it('removes the translation of an item already translated', () => {
		const {container} = render(
			<LocalizableText
				{...defaultLocalizableTextConfig}
				onChange={jest.fn()}
				value={{
					ca_ES: 'Teste ES',
					en_US: 'Test EUA',
					pt_BR: 'Teste BR',
				}}
			/>
		);

		const triggerElement = screen.getByTestId('triggerText');

		userEvent.click(triggerElement);

		const dropdownItem = screen.getByTestId(
			'availableLocalesDropdownpt_BR'
		);

		userEvent.click(dropdownItem);

		const inputComponent = screen.getByTestId('visibleChangeInput');

		expect(inputComponent.value).toEqual('Teste BR');

		fireEvent.change(inputComponent, {
			target: {
				value: '',
			},
		});

		expect(inputComponent.value).toEqual('');

		expect(container).toMatchSnapshot();
	});

	describe('Submit Button Label', () => {
		it('changes the placeholder according to the current editing locale', () => {
			render(
				<LocalizableText
					{...defaultLocalizableTextConfig}
					fieldName="submitLabel"
					onChange={jest.fn()}
					placeholdersSubmitLabel={[
						{localeId: 'de_DE', placeholderSubmitLabel: 'Senden'},
						{localeId: 'en_US', placeholderSubmitLabel: 'Submit'},
						{localeId: 'es_ES', placeholderSubmitLabel: 'Enviar'},
					]}
				/>
			);

			const triggerButton = screen.getByTestId('triggerButton');

			userEvent.click(triggerButton);

			const dropdownItem = screen.getByTestId(
				'availableLocalesDropdownde_DE'
			);

			userEvent.click(dropdownItem);

			const inputComponent = screen.getByTestId('visibleChangeInput');

			expect(inputComponent.placeholder).toBe('Senden');
		});

		it('does not have the maxLength property equal to 25', () => {
			render(<LocalizableText {...defaultLocalizableTextConfig} />);

			expect(screen.getByTestId('visibleChangeInput')).not.toHaveProperty(
				'maxLength',
				25
			);
		});

		it('has by default the dropdown description equal to translated/not-translated for non-default locales', () => {
			render(
				<LocalizableText
					{...defaultLocalizableTextConfig}
					value={{
						de_DE: 'Test DE',
						es_ES: 'Test ES',
					}}
				/>
			);

			expect(screen.queryAllByText('default')).toHaveLength(1);

			const {availableLocales} = defaultLocalizableTextConfig;

			expect(screen.queryAllByText('not-translated')).toHaveLength(
				availableLocales.length - 3
			);
			expect(screen.queryAllByText('translated')).toHaveLength(2);
		});

		it('has by default the placeholder of the default locale', () => {
			render(
				<LocalizableText
					{...defaultLocalizableTextConfig}
					fieldName="submitLabel"
					placeholdersSubmitLabel={[
						{localeId: 'de_DE', placeholderSubmitLabel: 'Senden'},
						{localeId: 'en_US', placeholderSubmitLabel: 'Submit'},
						{localeId: 'es_ES', placeholderSubmitLabel: 'Enviar'},
					]}
				/>
			);

			const inputComponent = screen.getByTestId('visibleChangeInput');

			expect(inputComponent.placeholder).toBe('Submit');
		});

		it('has the dropdown description equal to customized/not-customized for the Submit Button Label input', () => {
			render(
				<LocalizableText
					{...defaultLocalizableTextConfig}
					fieldName="submitLabel"
					placeholdersSubmitLabel={[
						{localeId: 'de_DE', placeholderSubmitLabel: 'Senden'},
						{localeId: 'en_US', placeholderSubmitLabel: 'Submit'},
						{localeId: 'es_ES', placeholderSubmitLabel: 'Enviar'},
					]}
					value={{
						de_DE: 'Test DE',
						es_ES: 'Test ES',
					}}
				/>
			);

			expect(screen.queryAllByText('customized')).toHaveLength(2);

			const {availableLocales} = defaultLocalizableTextConfig;

			expect(screen.queryAllByText('not-customized')).toHaveLength(
				availableLocales.length - 2
			);
		});

		it('has the maxLength property equal to 25 for the Submit Button Label input', () => {
			render(
				<LocalizableText
					{...defaultLocalizableTextConfig}
					fieldName="submitLabel"
					placeholdersSubmitLabel={[
						{localeId: 'de_DE', placeholderSubmitLabel: 'Senden'},
						{localeId: 'en_US', placeholderSubmitLabel: 'Submit'},
						{localeId: 'es_ES', placeholderSubmitLabel: 'Enviar'},
					]}
				/>
			);

			expect(screen.getByTestId('visibleChangeInput')).toHaveProperty(
				'maxLength',
				25
			);
		});
	});
});
