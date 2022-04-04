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
import ReactDOM from 'react-dom';

import Select from '../../../src/main/resources/META-INF/resources/Select/Select.es';

const createOptions = (length) => {
	const options = [];

	for (let counter = 1; counter <= length; counter++) {
		options.push({
			label: 'label' + counter,
			name: 'name' + counter,
			value: 'item' + counter,
		});
	}

	return options;
};

describe('Select', () => {
	beforeAll(() => {
		ReactDOM.createPortal = jest.fn((element) => {
			return element;
		});
	});

	it('does not render and empty option', () => {
		const option = {
			checked: false,
			disabled: false,
			id: 'id',
			inline: false,
			label: 'label',
			name: 'name',
			showLabel: true,
			value: 'item',
		};

		render(<Select options={[option]} showEmptyOption={false} />);

		const dropDownItem = document.querySelector(
			'.dropdown-menu .dropdown-item'
		);

		expect(dropDownItem.innerHTML).toBe(option.label);
	});

	it('does not show an empty option when the search input is available', () => {
		const handleFieldEdited = jest.fn();

		render(
			<Select
				dataSourceType="manual"
				multiple={false}
				onChange={handleFieldEdited}
				options={createOptions(12)}
				showEmptyOption={false}
			/>
		);

		const dropdownTrigger = document.querySelector(
			'.form-builder-select-field.input-group-container'
		);

		userEvent.click(dropdownTrigger);

		const emptyOption = document.querySelector('[label=choose-an-option]');

		expect(emptyOption).toBeNull();
	});

	it('is not editable', () => {
		render(<Select readOnly />);

		expect(document.querySelector('.select-field-trigger')).toHaveClass(
			'disabled'
		);
	});

	it('has a help text', () => {
		const {container} = render(<Select tip="Type something" />);

		expect(container).toMatchSnapshot();
	});

	it('has an id', () => {
		const {container} = render(<Select id="Id" />);

		expect(container).toMatchSnapshot();
	});

	it('renders an empty option', () => {
		render(
			<Select
				options={[
					{
						checked: false,
						disabled: false,
						id: 'id',
						inline: false,
						label: 'label',
						name: 'name',
						showLabel: true,
						value: 'item',
					},
				]}
				showEmptyOption
			/>
		);

		const dropDownItem = document.querySelector(
			'.dropdown-menu .dropdown-item'
		);

		expect(dropDownItem.innerHTML).toBe('choose-an-option');
	});

	it('renders options', () => {
		const {container} = render(
			<Select
				options={[
					{
						checked: false,
						disabled: false,
						id: 'id',
						inline: false,
						label: 'label',
						name: 'name',
						showLabel: true,
						value: 'item',
					},
				]}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('renders fixed options', () => {
		render(
			<Select
				fixedOptions={[
					{
						dataType: 'user',
						label: 'User',
						name: 'user',
						value: 'user',
					},
				]}
				showEmptyOption={false}
			/>
		);

		expect(screen.getByText('User')).toBeInTheDocument();
	});

	it('renders no options when options come empty', () => {
		const {container} = render(<Select options={[]} />);

		expect(container).toMatchSnapshot();
	});

	it('has a label', () => {
		const {container} = render(<Select label="label" />);

		expect(container).toMatchSnapshot();
	});

	it('is closed by default', () => {
		const {container} = render(<Select open={false} />);

		expect(container).toMatchSnapshot();
	});

	it("has class dropdown-opened when it's opened", () => {
		const {container} = render(<Select open />);

		expect(container).toMatchSnapshot();
	});

	it('has a placeholder', () => {
		const {container} = render(<Select placeholder="Placeholder" />);

		expect(container).toMatchSnapshot();
	});

	it('has a predefinedValue', () => {
		const {container} = render(<Select predefinedValue={['Select']} />);

		expect(container).toMatchSnapshot();
	});

	it('is not required', () => {
		const {container} = render(<Select required={false} />);

		expect(container).toMatchSnapshot();
	});

	it('puts an asterisk when field is required', () => {
		const {container} = render(
			<Select label="This is the label" required />
		);

		expect(container).toMatchSnapshot();
	});

	it('renders Label if showLabel is true', () => {
		const {container} = render(<Select label="text" showLabel />);

		expect(container).toMatchSnapshot();
	});

	it('has a value', () => {
		const {container} = render(<Select value={['value']} />);

		expect(container).toMatchSnapshot();
	});

	it('has a key', () => {
		const {container} = render(<Select key="key" />);

		expect(container).toMatchSnapshot();
	});

	it('calls onChange callback when an item is selected', () => {
		const handleFieldEdited = jest.fn();

		render(
			<Select
				dataSourceType="manual"
				onChange={handleFieldEdited}
				options={createOptions(2)}
			/>
		);

		userEvent.click(
			document.querySelector(
				'.form-builder-select-field.input-group-container'
			)
		);

		const dropdownItem = screen.getByTestId('dropdownItem-0');

		userEvent.click(dropdownItem);

		expect(handleFieldEdited).toHaveBeenCalled();
	});

	it('calls onChange callback when an item is selected using multiselect', () => {
		const handleFieldEdited = jest.fn();

		const {container} = render(
			<Select
				dataSourceType="manual"
				multiple
				onChange={handleFieldEdited}
				options={createOptions(7)}
			/>
		);

		const dropdownTrigger = document.querySelector(
			'.form-builder-select-field.input-group-container'
		);

		userEvent.click(dropdownTrigger);

		const labelItem = screen.getByTestId('labelItem-item7');

		userEvent.click(labelItem);

		expect(handleFieldEdited).toHaveBeenCalledWith(expect.any(Object), [
			'item7',
		]);
		expect(container).toMatchSnapshot();
	});

	it('shows an empty option when the search input is available', () => {
		const handleFieldEdited = jest.fn();

		render(
			<Select
				dataSourceType="manual"
				multiple={false}
				onChange={handleFieldEdited}
				options={createOptions(12)}
				showEmptyOption
			/>
		);

		userEvent.click(
			document.querySelector(
				'.form-builder-select-field.input-group-container'
			)
		);

		const emptyOption = document.querySelector('[label=choose-an-option]');

		expect(emptyOption).not.toBeNull();
	});

	it('shows a search input when the number of options is more than the maximum allowed', () => {
		const {container} = render(
			<Select
				dataSourceType="manual"
				multiple
				options={createOptions(12)}
			/>
		);

		const dropdownTrigger = document.querySelector(
			'.form-builder-select-field.input-group-container'
		);

		userEvent.click(dropdownTrigger);

		expect(container).toMatchSnapshot();
	});

	it('filters according to the input and calls onChange callback when an item is selected using search', () => {
		const handleFieldEdited = jest.fn();

		const {container} = render(
			<Select
				dataSourceType="manual"
				multiple
				onChange={handleFieldEdited}
				options={createOptions(12)}
			/>
		);

		userEvent.click(
			document.querySelector(
				'.form-builder-select-field.input-group-container'
			)
		);

		userEvent.type(screen.getByRole('textbox'), 'label1');

		expect(container).toMatchSnapshot();

		const labelItem = screen.getByTestId('labelItem-item11');

		userEvent.click(labelItem);

		expect(handleFieldEdited).toHaveBeenCalledWith(expect.any(Object), [
			'item11',
		]);
	});

	it('shows the options value if there are values', () => {
		render(
			<Select
				dataSourceType="manual"
				multiple
				options={createOptions(12)}
				predefinedValue={['item1', 'item2']}
				value={['item3']}
			/>
		);

		expect(
			document.querySelector('span[value="item1"]')
		).not.toBeInTheDocument();
		expect(
			document.querySelector('span[value="item2"]')
		).not.toBeInTheDocument();
		expect(
			document.querySelector('span[value="item3"]')
		).toBeInTheDocument();
	});

	it('shows the predefinedValues if there is no value', () => {
		render(
			<Select
				dataSourceType="manual"
				multiple
				options={createOptions(12)}
				predefinedValue={['item1', 'item2']}
				value={[]}
			/>
		);

		expect(
			document.querySelector('span[value="item1"]')
		).toBeInTheDocument();
		expect(
			document.querySelector('span[value="item2"]')
		).toBeInTheDocument();
	});

	it('clear all values if the user has edited the field to clear the predefinedValue', () => {
		render(
			<Select
				dataSourceType="manual"
				localizedValueEdited={{en_US: true}}
				multiple
				options={createOptions(12)}
				predefinedValue={['item1', 'item2']}
				value={[]}
			/>
		);

		expect(
			document.querySelector('span[value="item1"]')
		).not.toBeInTheDocument();
		expect(
			document.querySelector('span[value="item2"]')
		).not.toBeInTheDocument();
	});
});
