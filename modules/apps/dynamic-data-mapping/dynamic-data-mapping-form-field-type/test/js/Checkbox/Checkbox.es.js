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

import Checkbox from '../../../src/main/resources/META-INF/resources/Checkbox/Checkbox';

describe('Field Checkbox', () => {
	it('is not editable', () => {
		const {container} = render(<Checkbox readOnly />);

		expect(container).toMatchSnapshot();
	});

	it('has a helptext', () => {
		const {container} = render(<Checkbox tip="Type something" />);

		expect(container).toMatchSnapshot();
	});

	it('has an id', () => {
		const {container} = render(<Checkbox id="ID" />);

		expect(container).toMatchSnapshot();
	});

	it('has a label', () => {
		const {container} = render(<Checkbox label="label" />);

		expect(container).toMatchSnapshot();
	});

	it('has a predefined Value', () => {
		const {container} = render(<Checkbox placeholder="Option 1" />);

		expect(container).toMatchSnapshot();
	});

	it('is not required', () => {
		const {container} = render(<Checkbox required={false} />);

		expect(container).toMatchSnapshot();
	});

	it('is shown as a switcher', () => {
		const {container} = render(<Checkbox showAsSwitcher />);

		expect(container).toMatchSnapshot();
	});

	it('is shown as checkbox', () => {
		const {container} = render(<Checkbox showAsSwitcher={false} />);

		expect(container).toMatchSnapshot();
	});

	it('renders Label if showLabel is true', () => {
		const {container} = render(<Checkbox label showLabel />);

		expect(container).toMatchSnapshot();
	});

	it('has a value', () => {
		const {container} = render(<Checkbox value />);

		expect(container).toMatchSnapshot();
	});

	it('has a key', () => {
		const {container} = render(<Checkbox key="key" value />);

		expect(container).toMatchSnapshot();
	});

	it('call the onChange callback on the field change', () => {
		const handleFieldEdited = jest.fn();

		render(<Checkbox onChange={handleFieldEdited} />);

		userEvent.click(screen.getByRole('checkbox'));

		expect(handleFieldEdited).toHaveBeenCalled();
	});

	describe('Maximum Repetitions Info', () => {
		it('does not show the maximum repetitions info', () => {
			render(<Checkbox value />);

			expect(document.querySelector('.ddm-info')).not.toBeInTheDocument();
		});

		it('does not show the maximum repetitions info if the value is false', () => {
			render(<Checkbox showMaximumRepetitionsInfo value={false} />);

			expect(document.querySelector('.ddm-info')).not.toBeInTheDocument();
		});

		it('shows the maximum repetitions info', () => {
			render(<Checkbox showMaximumRepetitionsInfo value />);

			expect(document.querySelector('.ddm-info')).toBeInTheDocument();
		});
	});

	describe('Boolean Field', () => {
		it('check if the boolean field is not checked if he has predefinedValue false', () => {
			render(<Checkbox label="Boolean" predefinedValue={['false']} />);

			expect(screen.getByLabelText('Boolean')).not.toBeChecked();
		});

		it('check if the boolean field is checked if he has predefinedValue true', () => {
			render(<Checkbox label="Boolean" predefinedValue={['true']} />);

			expect(screen.getByLabelText('Boolean')).toBeChecked();
		});

		it('check that with false predefinedValue the boolean field is checked when we enable it', () => {
			const onChange = jest.fn();

			render(
				<Checkbox
					label="Boolean"
					onChange={onChange}
					predefinedValue={['false']}
				/>
			);

			userEvent.click(screen.getByLabelText('Boolean'));

			expect(onChange).toHaveBeenLastCalledWith({target: {value: true}});
		});

		it('check that with true predefinedValue the boolean field is not checked when we disabled it', () => {
			const onChange = jest.fn();
			render(
				<Checkbox
					label="Boolean"
					onChange={onChange}
					predefinedValue={['true']}
				/>
			);

			userEvent.click(screen.getByLabelText('Boolean'));

			expect(onChange).toHaveBeenLastCalledWith({target: {value: false}});
		});

		it('check it shows the label when we set it up', () => {
			render(<Checkbox label="Boolean" showLabel />);

			expect(screen.getByLabelText('Boolean')).toBeInTheDocument();
		});

		it('check if the required icon appears when the field is required', () => {
			render(<Checkbox required />);

			expect(
				document.querySelector('.lexicon-icon-asterisk')
			).toBeInTheDocument();
		});

		it('check if the required icon do not appears when the field is not required', () => {
			render(<Checkbox />);

			expect(
				document.querySelector('.lexicon-icon-asterisk')
			).not.toBeInTheDocument();
		});

		it('verify if the switcher do not appears when he is disabled in boolean field', () => {
			render(<Checkbox showAsSwitcher={false} />);

			expect(
				document.querySelector('.toggle-switch-handle')
			).not.toBeInTheDocument();
		});

		it('verify if the switcher appears when he is enabled in boolean field', () => {
			render(<Checkbox />);

			expect(
				document.querySelector('.toggle-switch-handle')
			).toBeInTheDocument();
		});
	});
});
