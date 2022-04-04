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
import React from 'react';

import Text from '../../../src/main/resources/META-INF/resources/Text/Text.es';

describe('Field Text', () => {
	it('renders the default markup', () => {
		const {container} = render(<Text />);

		expect(container).toMatchSnapshot();
	});

	it('has a name', () => {
		render(<Text name="textField" />);

		expect(screen.queryByRole('textbox')).toHaveAttribute(
			'name',
			'textField'
		);
	});

	it('enables input whenever readOnly is omitted', () => {
		render(<Text />);
		expect(screen.queryByRole('textbox')).toBeEnabled();
	});

	it('disables input whenever readOnly is set', () => {
		render(<Text readOnly />);
		expect(screen.queryByRole('textbox')).not.toBeEnabled();
	});

	it('has a help text', () => {
		render(<Text tip="Type something" />);
		expect(screen.getAllByText('Type something')[0]).toBeInTheDocument();
	});

	it('has an id', () => {
		render(<Text id="ID" />);
		expect(screen.queryByRole('textbox')).toHaveAttribute('id', 'ID');
	});

	it('has a label', () => {
		render(<Text label="label" />);
		expect(screen.getByText(/label/)).toBeInTheDocument();
	});

	it('has a placeholder', () => {
		render(<Text name="textField" placeholder="Placeholder" />);
		expect(screen.queryByRole('textbox')).toHaveAttribute(
			'placeholder',
			'Placeholder'
		);
	});

	it('hides autocomplete dropdown menu when container layout is hidden', () => {
		render(
			<div className="ddm-page-container-layout hide">
				<Text
					autocomplete
					options={[
						{label: 'Option 1', value: 'Option1'},
						{label: 'Option 2', value: 'Option2'},
					]}
					value="Option"
				/>
			</div>
		);

		expect(
			document.querySelector('.autocomplete-dropdown-menu')
		).not.toHaveClass('show');
	});

	it('is required', () => {
		render(<Text name="textField" required />);

		expect(screen.getByText(/required/)).toBeInTheDocument();
	});

	it('renders autocomplete dropdown menu', () => {
		render(
			<div className="ddm-page-container-layout">
				<Text
					autocomplete
					key="input"
					onChange={jest.fn()}
					options={[
						{label: 'Option 1', value: 'Option1'},
						{label: 'Option 2', value: 'Option2'},
					]}
					value=""
				/>
			</div>
		);

		userEvent.type(screen.queryByRole('textbox'), 'Option');

		expect(
			document.querySelector('.autocomplete-dropdown-menu')
		).toHaveClass('show');
	});

	it('hides autocomplete dropdown menu when input is empty', () => {
		render(
			<div className="ddm-page-container-layout">
				<Text
					autocomplete
					key="input"
					onChange={jest.fn()}
					options={[
						{label: 'Option 1', value: 'Option1'},
						{label: 'Option 2', value: 'Option2'},
					]}
					value="Option"
				/>
			</div>
		);

		userEvent.type(screen.queryByRole('textbox'), '');

		expect(
			document.querySelector('.autocomplete-dropdown-menu')
		).not.toHaveClass('show');
	});

	it('hides autocomplete dropdown menu when focus is changed', () => {
		render(
			<div className="ddm-page-container-layout">
				<Text
					autocomplete
					key="input"
					onChange={jest.fn()}
					options={[
						{label: 'Option 1', value: 'Option1'},
						{label: 'Option 2', value: 'Option2'},
					]}
					value=""
				/>
			</div>
		);

		userEvent.type(screen.queryByRole('textbox'), 'Option');
		const autocompleteDropdownMenu = document.querySelector(
			'.autocomplete-dropdown-menu'
		);

		expect(autocompleteDropdownMenu).toHaveClass('show');

		userEvent.click(document.body);
		expect(autocompleteDropdownMenu).not.toHaveClass('show');
	});

	it('renders Label if showLabel is set', () => {
		const {container} = render(
			<Text label="text" name="textField" showLabel />
		);
		expect(container).toMatchSnapshot();
	});

	it('has a value', () => {
		render(<Text value="value" />);
		expect(screen.queryByRole('textbox')).toHaveValue('value');
	});

	it('emits a field edit with correct parameters', () => {
		const onChange = jest.fn();

		render(<Text key="input" onChange={onChange} />);

		userEvent.type(screen.queryByRole('textbox'), 'test');
		expect(onChange).toHaveBeenCalled();
	});

	it('normalizes the field if it contains invalid characters', () => {
		render(<Text key="input" normalizeField onChange={jest.fn()} />);

		const input = screen.queryByRole('textbox');

		userEvent.type(input, 'Field¿êReference');
		expect(input).toHaveValue('FieldReference');
	});

	it('normalizes the value of the field if it contains invalid characters', () => {
		render(
			<Text invalidCharacters="[1-8]" key="input" onChange={jest.fn()} />
		);

		const input = screen.queryByRole('textbox');

		userEvent.type(input, '+9 (129) 993-9999');
		expect(input).toHaveValue('+9 (9) 99-9999');
	});

	it('renders a counter when show counter is true, there is a maxLength and value is empty', () => {
		render(<Text maxLength={10} showCounter valid value="" />);

		expect(screen.getByText('0/10 characters')).toBeInTheDocument();
	});

	it('renders a counter when show counter is true, there is a maxLength and value is different from empty', () => {
		render(<Text maxLength={10} showCounter valid value="test" />);

		expect(screen.getByText('4/10 characters')).toBeInTheDocument();
	});

	it('does not render a counter when show counter is false, there is a maxLength and value is different from empty', () => {
		render(<Text maxLength={10} value="test" />);

		expect(screen.queryByText('4/10 characters')).not.toBeInTheDocument();
	});

	it('renders a counter when show counter is true, there is a maxLength and value length is greater than the maximum length', () => {
		render(<Text maxLength={2} showCounter valid value="test" />);
		const [error] = screen.queryAllByText('4/2 characters');
		expect(error).toHaveClass('form-feedback-item');
	});

	describe('Confirmation Field', () => {
		it('does not show the confirmation field', () => {
			render(<Text name="textField" />);

			expect(
				document.getElementById('textFieldconfirmationField')
			).not.toBeInTheDocument();
		});

		it('shows the confirmation field if the requireConfirmation property is enabled', () => {
			render(
				<Text
					direction="horizontal"
					name="textField"
					requireConfirmation
				/>
			);

			expect(
				document.getElementById('textFieldconfirmationField')
			).toBeInTheDocument();
			expect(document.querySelector('.row')).toBeInTheDocument();
			expect(document.querySelector('.col-md-6')).toBeInTheDocument();
		});

		it('shows the confirmation field in vertical mode', () => {
			render(<Text direction="vertical" requireConfirmation />);

			expect(document.querySelector('.col-md-12')).toBeInTheDocument();
		});
	});
});
