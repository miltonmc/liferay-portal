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
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {PageProvider} from 'data-engine-js-components-web';
import React from 'react';

import Text from '../../../src/main/resources/META-INF/resources/Text/Text.es';

const spritemap = 'icons.svg';

const defaultTextConfig = {
	name: 'textField',
	spritemap,
};

const TextWithProvider = (props) => (
	<PageProvider value={{editingLanguageId: 'en_US'}}>
		<Text {...props} />
	</PageProvider>
);

describe('Field Text', () => {
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

	it('is not readOnly', () => {
		const {container} = render(
			<TextWithProvider {...defaultTextConfig} readOnly={false} />
		);

		expect(container).toMatchSnapshot();
	});

	it('is readOnly', () => {
		const {container} = render(
			<TextWithProvider {...defaultTextConfig} readOnly={true} />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a helptext', () => {
		const {container} = render(
			<TextWithProvider {...defaultTextConfig} tip="Type something" />
		);

		expect(container).toMatchSnapshot();
	});

	it('has an id', () => {
		const {container} = render(
			<TextWithProvider {...defaultTextConfig} id="Id" />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a label', () => {
		const {container} = render(
			<TextWithProvider {...defaultTextConfig} label="label" />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a placeholder', () => {
		const {container} = render(
			<TextWithProvider
				{...defaultTextConfig}
				placeholder="Placeholder"
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('hides autocomplete dropdown menu when container layout is hidden', () => {
		const props = {
			autocomplete: true,
			options: [
				{label: 'Option 1', value: 'Option1'},
				{label: 'Option 2', value: 'Option2'},
			],
			value: 'Option',
			...defaultTextConfig,
		};

		render(
			<div className="ddm-page-container-layout hide">
				<TextWithProvider {...props} />
			</div>
		);

		const autocompleteDropdownMenu = document.body.querySelector(
			'.autocomplete-dropdown-menu'
		);

		const classList = autocompleteDropdownMenu.classList;

		expect(classList.contains('show')).toBeFalsy();
	});

	it('is not required', () => {
		const {container} = render(
			<TextWithProvider {...defaultTextConfig} required={false} />
		);

		expect(container).toMatchSnapshot();
	});

	it('renders autocomplete dropdown menu', () => {
		const onChange = jest.fn();

		const props = {
			autocomplete: true,
			options: [
				{label: 'Option 1', value: 'Option1'},
				{label: 'Option 2', value: 'Option2'},
			],
			value: '',
			...defaultTextConfig,
		};

		render(
			<div className="ddm-page-container-layout">
				<TextWithProvider {...props} key="input" onChange={onChange} />
			</div>
		);

		const input = document.querySelector('input');

		userEvent.type(input, 'Option');

		const autocompleteDropdownMenu = document.querySelector(
			'.autocomplete-dropdown-menu'
		);

		expect(
			autocompleteDropdownMenu.classList.contains('show')
		).toBeTruthy();
	});

	it('hides autocomplete dropdown menu when input is empty', () => {
		const onChange = jest.fn();

		const props = {
			autocomplete: true,
			options: [
				{label: 'Option 1', value: 'Option1'},
				{label: 'Option 2', value: 'Option2'},
			],
			value: 'Option',
			...defaultTextConfig,
		};

		render(
			<div className="ddm-page-container-layout">
				<TextWithProvider {...props} key="input" onChange={onChange} />
			</div>
		);

		const input = document.querySelector('input');

		userEvent.type(input, '');

		const autocompleteDropdownMenu = document.querySelector(
			'.autocomplete-dropdown-menu'
		);

		expect(autocompleteDropdownMenu.classList.contains('show')).toBeFalsy();
	});

	it('hides autocomplete dropdown menu when focus is changed', () => {
		const onChange = jest.fn();

		const props = {
			autocomplete: true,
			options: [
				{label: 'Option 1', value: 'Option1'},
				{label: 'Option 2', value: 'Option2'},
			],
			value: '',
			...defaultTextConfig,
		};

		render(
			<div className="ddm-page-container-layout">
				<TextWithProvider {...props} key="input" onChange={onChange} />
			</div>
		);

		const input = document.querySelector('input');

		userEvent.type(input, 'Option');

		const autocompleteDropdownMenu = document.querySelector(
			'.autocomplete-dropdown-menu'
		);

		expect(
			autocompleteDropdownMenu.classList.contains('show')
		).toBeTruthy();

		const body = document.body;

		userEvent.click(body);

		expect(autocompleteDropdownMenu.classList.contains('show')).toBeFalsy();
	});

	it('renders Label if showLabel is true', () => {
		const {container} = render(
			<TextWithProvider {...defaultTextConfig} label="text" showLabel />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a value', () => {
		const {container} = render(
			<TextWithProvider {...defaultTextConfig} value="value" />
		);

		expect(container).toMatchSnapshot();
	});

	it('emits a field edit with correct parameters', () => {
		const onChange = jest.fn();

		render(
			<TextWithProvider
				{...defaultTextConfig}
				key="input"
				onChange={onChange}
			/>
		);

		const input = document.querySelector('input');

		userEvent.type(input, 'test');

		expect(onChange).toHaveBeenCalled();
	});

	it('normalizes the field if it contains invalid characters', () => {
		const onChange = jest.fn();

		render(
			<TextWithProvider
				{...defaultTextConfig}
				key="input"
				normalizeField={true}
				onChange={onChange}
			/>
		);

		const input = document.querySelector('input');

		userEvent.type(input, 'Field¿êReference');

		expect(input.value).toEqual('FieldReference');
	});

	it('normalizes the value of the field if it contains invalid characters', () => {
		const onChange = jest.fn();

		render(
			<TextWithProvider
				{...defaultTextConfig}
				invalidCharacters="[1-8]"
				key="input"
				onChange={onChange}
			/>
		);

		const input = document.querySelector('input');

		userEvent.type(input, '+9 (129) 993-9999');

		expect(input.value).toEqual('+9 (9) 99-9999');
	});

	it('renders a counter when show counter is true, there is a maxLength and value is empty', () => {
		const {getByText} = render(
			<TextWithProvider
				{...defaultTextConfig}
				maxLength={10}
				showCounter={true}
				valid={true}
				value=""
			/>
		);

		expect(getByText('0/10 characters')).toBeInTheDocument();
	});

	it('renders a counter when show counter is true, there is a maxLength and value is different from empty', () => {
		const {getByText} = render(
			<TextWithProvider
				{...defaultTextConfig}
				maxLength={10}
				showCounter={true}
				valid={true}
				value="test"
			/>
		);

		expect(getByText('4/10 characters')).toBeInTheDocument();
	});

	it('does not render a counter when show counter is false, there is a maxLength and value is different from empty', () => {
		const {queryByText} = render(
			<TextWithProvider
				{...defaultTextConfig}
				maxLength={10}
				value="test"
			/>
		);

		expect(queryByText('4/10 characters')).not.toBeInTheDocument();
	});

	it('renders a counter when show counter is true, there is a maxLength and value length is greater than the maximum lenght', () => {
		render(
			<TextWithProvider
				{...defaultTextConfig}
				maxLength={2}
				showCounter={true}
				valid={true}
				value="test"
			/>
		);
		const error = screen.queryAllByText('4/2 characters')[0];
		expect(error).toHaveClass('form-feedback-item');
	});

	describe('Confirmation Field', () => {
		it('does not show the confirmation field', () => {
			render(<TextWithProvider {...defaultTextConfig} />);

			const confirmationField = document.getElementById(
				'textFieldconfirmationField_fieldDetails'
			);

			expect(confirmationField).toBeNull();
		});

		it('shows the confirmation field if the requireConfirmation property is enabled', () => {
			render(
				<TextWithProvider
					{...defaultTextConfig}
					direction="horizontal"
					requireConfirmation={true}
				/>
			);

			const confirmationField = document.getElementById(
				'textFieldconfirmationField'
			);

			expect(confirmationField).not.toBeNull();
			expect(
				document.getElementsByClassName('row')[0]
			).toBeInTheDocument();
			expect(document.querySelector('.col-md-6')).not.toBeNull();
		});

		it('shows the confirmation field in vertical mode', () => {
			render(
				<TextWithProvider
					{...defaultTextConfig}
					direction="vertical"
					requireConfirmation={true}
				/>
			);

			expect(document.querySelector('.col-md-12')).not.toBeNull();
		});
	});
});
