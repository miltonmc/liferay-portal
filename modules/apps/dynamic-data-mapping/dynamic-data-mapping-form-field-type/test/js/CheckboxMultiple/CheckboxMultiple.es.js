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

import CheckboxMultiple from '../../../src/main/resources/META-INF/resources/CheckboxMultiple/CheckboxMultiple.es';

describe('Field Checkbox Multiple', () => {
	it('is not editable', () => {
		const {container} = render(<CheckboxMultiple readOnly />);

		expect(container).toMatchSnapshot();
	});

	it('has a helptext', () => {
		const {container} = render(<CheckboxMultiple tip="Type something" />);

		expect(container).toMatchSnapshot();
	});

	it('has an id', () => {
		const {container} = render(<CheckboxMultiple id="ID" />);

		expect(container).toMatchSnapshot();
	});

	it('has a label', () => {
		const {container} = render(<CheckboxMultiple label="label" />);

		expect(container).toMatchSnapshot();
	});

	it('has a predefined Value', () => {
		const {container} = render(<CheckboxMultiple placeholder="Option 1" />);

		expect(container).toMatchSnapshot();
	});

	it('is not required', () => {
		const {container} = render(<CheckboxMultiple required={false} />);

		expect(container).toMatchSnapshot();
	});

	it('is shown as a switcher', () => {
		const {container} = render(<CheckboxMultiple showAsSwitcher />);

		expect(container).toMatchSnapshot();
	});

	it('is shown as checkbox', () => {
		const {container} = render(<CheckboxMultiple showAsSwitcher={false} />);

		expect(container).toMatchSnapshot();
	});

	it('renders Label if showLabel is true', () => {
		const {container} = render(<CheckboxMultiple label="text" showLabel />);

		expect(container).toMatchSnapshot();
	});

	it('has a value', () => {
		const {container} = render(<CheckboxMultiple value />);

		expect(container).toMatchSnapshot();
	});

	it('has a key', () => {
		const {container} = render(<CheckboxMultiple key="key" />);

		expect(container).toMatchSnapshot();
	});

	it('call the onChange callback on the field change', () => {
		const handleFieldEdited = jest.fn();

		render(<CheckboxMultiple onChange={handleFieldEdited} />);

		userEvent.click(screen.getByRole('checkbox', {name: 'Option 1'}));

		expect(handleFieldEdited).toHaveBeenCalled();
	});

	it('checks the value if there is a value', () => {
		render(
			<CheckboxMultiple
				options={[
					{
						label: 'Option 1',
						value: 'option1',
					},
					{
						label: 'Option 2',
						value: 'option2',
					},
					{
						label: 'Option 3',
						value: 'option3',
					},
				]}
				predefinedValue={['option1', 'option2']}
				value={['option3']}
			/>
		);

		expect(screen.getByLabelText('Option 1')).not.toBeChecked();
		expect(screen.getByLabelText('Option 2')).not.toBeChecked();
		expect(screen.getByLabelText('Option 3')).toBeChecked();
	});

	it('checks the predefinedValue if there is no value', () => {
		render(
			<CheckboxMultiple
				options={[
					{
						label: 'Option 1',
						value: 'option1',
					},
					{
						label: 'Option 2',
						value: 'option2',
					},
					{
						label: 'Option 3',
						value: 'option3',
					},
				]}
				predefinedValue={['option1', 'option2']}
				value={[]}
			/>
		);

		expect(screen.getByLabelText('Option 1')).toBeChecked();
		expect(screen.getByLabelText('Option 2')).toBeChecked();
		expect(screen.getByLabelText('Option 3')).not.toBeChecked();
	});

	it('uncheck all values if the user has edited the field to clear the predefinedValue', () => {
		render(
			<CheckboxMultiple
				localizedValueEdited={{en_US: true}}
				options={[
					{
						label: 'Option 1',
						value: 'option1',
					},
					{
						label: 'Option 2',
						value: 'option2',
					},
					{
						label: 'Option 3',
						value: 'option3',
					},
				]}
				predefinedValue={['option1', 'option2']}
				value={[]}
			/>
		);

		expect(screen.getByLabelText('Option 1')).not.toBeChecked();
		expect(screen.getByLabelText('Option 2')).not.toBeChecked();
		expect(screen.getByLabelText('Option 3')).not.toBeChecked();
	});
});
