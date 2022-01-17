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

import ColorPicker from '../../../src/main/resources/META-INF/resources/ColorPicker/ColorPicker.es';

const name = 'colorPicker';
const spritemap = 'icons.svg';

const ColorPickerWithProvider = (props) => (
	<PageProvider value={{editingLanguageId: 'en_US'}}>
		<ColorPicker {...props} />
	</PageProvider>
);

describe('Field Color Picker', () => {
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

	it('renders field disabled', () => {
		const {container} = render(
			<ColorPickerWithProvider
				name={name}
				readOnly={true}
				spritemap={spritemap}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('renders field with helptext', () => {
		const {container} = render(
			<ColorPickerWithProvider
				name={name}
				spritemap={spritemap}
				tip="Helptext"
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('renders field with label', () => {
		const {container} = render(
			<ColorPickerWithProvider
				label="label"
				name={name}
				spritemap={spritemap}
				tip="Helptext"
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('renders with basic color', () => {
		const color = '#FF67AA';

		render(
			<ColorPickerWithProvider
				name={name}
				readOnly
				spritemap={spritemap}
				value={color}
			/>
		);

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
