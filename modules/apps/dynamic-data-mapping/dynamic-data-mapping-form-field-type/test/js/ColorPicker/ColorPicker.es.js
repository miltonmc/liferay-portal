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

import ColorPicker from '../../../src/main/resources/META-INF/resources/ColorPicker/ColorPicker.es';

describe('Field Color Picker', () => {
	it('renders field disabled', () => {
		const {container} = render(<ColorPicker name="colorPicker" readOnly />);

		expect(container).toMatchSnapshot();
	});

	it('renders field with help text', () => {
		const {container} = render(
			<ColorPicker name="colorPicker" tip="Helptext" />
		);

		expect(container).toMatchSnapshot();
	});

	it('renders field with label', () => {
		const {container} = render(
			<ColorPicker label="label" name="colorPicker" tip="Helptext" />
		);

		expect(container).toMatchSnapshot();
	});

	it('renders with basic color', () => {
		render(<ColorPicker readOnly value="#FF67AA" />);

		expect(screen.getByRole('textbox')).toHaveValue('FF67AA');
	});

	it('calls the onChange callback on the field change', () => {
		const handleFieldEdited = jest.fn();

		render(<ColorPicker onChange={handleFieldEdited} />);

		const input = screen.getByRole('textbox');

		userEvent.type(input, 'ffffff');

		expect(handleFieldEdited).toHaveBeenCalled();
		expect(input).toHaveValue('ffffff');
	});
});
