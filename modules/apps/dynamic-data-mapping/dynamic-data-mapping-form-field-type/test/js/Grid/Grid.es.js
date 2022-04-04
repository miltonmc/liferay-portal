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

import {fireEvent, render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import Grid from '../../../src/main/resources/META-INF/resources/Grid/Grid.es';

describe('Grid', () => {
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
		fetch.mockResponseOnce(JSON.stringify({}));
	});

	it('renders columns', () => {
		const {container} = render(
			<Grid
				columns={[
					{
						label: 'col1',
						value: 'fieldId',
					},
					{
						label: 'col2',
						value: 'fieldId',
					},
				]}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('renders no columns when columns comes empty', () => {
		const {container} = render(<Grid columns={[]} />);

		expect(container).toMatchSnapshot();
	});

	it('is not editable', () => {
		const {container} = render(<Grid readOnly />);

		expect(container).toMatchSnapshot();
	});

	it('has a tip', () => {
		const {container} = render(<Grid tip="Type something" />);

		expect(container).toMatchSnapshot();
	});

	it('has an id', () => {
		const {container} = render(<Grid id="Id" />);

		expect(container).toMatchSnapshot();
	});

	it('has a label', () => {
		const {container} = render(<Grid label="label" />);

		expect(container).toMatchSnapshot();
	});

	it('is not required', () => {
		const {container} = render(<Grid required={false} />);

		expect(container).toMatchSnapshot();
	});

	it('renders rows', () => {
		const {container} = render(
			<Grid
				rows={[
					{
						label: 'row1',
						value: 'fieldId',
					},
					{
						label: 'row2',
						value: 'fieldId',
					},
				]}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('renders no rows when row comes empty', () => {
		const {container} = render(<Grid rows={[]} />);

		expect(container).toMatchSnapshot();
	});

	it('renders Label if showLabel is true', () => {
		const {container} = render(<Grid label="text" showLabel />);

		expect(container).toMatchSnapshot();
	});

	it('emits a fieldBlurred event when blurring the radio input', () => {
		const handleFieldBlurred = jest.fn();

		render(
			<Grid
				columns={[
					{
						label: 'col1',
						value: 'colFieldId1',
					},
					{
						label: 'col2',
						value: 'colFieldId2',
					},
				]}
				name="name"
				onBlur={handleFieldBlurred}
				readOnly={false}
				rows={[
					{
						label: 'row1',
						value: 'rowFieldId1',
					},
					{
						label: 'row2',
						value: 'rowFieldId2',
					},
				]}
			/>
		);

		const radioInputElement = document.querySelector(
			'input[value][type="radio"][name="name_rowFieldId1"]:not([value="colFieldId2"])'
		);

		fireEvent.blur(radioInputElement);

		expect(handleFieldBlurred).toHaveBeenCalled();
	});

	it('emits a fieldEdited event when changing the state of radio input', () => {
		const handleFieldEdited = jest.fn();

		render(
			<Grid
				columns={[
					{
						label: 'col1',
						value: 'colFieldId1',
					},
					{
						label: 'col2',
						value: 'colFieldId2',
					},
				]}
				name="name"
				onChange={handleFieldEdited}
				readOnly={false}
				rows={[
					{
						label: 'row1',
						value: 'rowFieldId1',
					},
					{
						label: 'row2',
						value: 'rowFieldId2',
					},
				]}
			/>
		);

		const radioInputElement = document.querySelector(
			'input[value][type="radio"][name="name_rowFieldId1"]:not([value="colFieldId2"])'
		);

		userEvent.click(radioInputElement);

		expect(handleFieldEdited).toHaveBeenCalled();
	});

	it('emits a fieldFocused event when focusing a radio input', () => {
		const handleFieldFocused = jest.fn();

		render(
			<Grid
				columns={[
					{
						label: 'col1',
						value: 'colFieldId1',
					},
					{
						label: 'col2',
						value: 'colFieldId2',
					},
				]}
				name="name"
				onFocus={handleFieldFocused}
				readOnly={false}
				rows={[
					{
						label: 'row1',
						value: 'rowFieldId1',
					},
					{
						label: 'row2',
						value: 'rowFieldId2',
					},
				]}
			/>
		);

		const radioInputElement = document.querySelector(
			'input[value][type="radio"][name="name_rowFieldId1"]:not([value="colFieldId2"])'
		);

		fireEvent.focus(radioInputElement);

		expect(handleFieldFocused).toHaveBeenCalled();
	});
});
