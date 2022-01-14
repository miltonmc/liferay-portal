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

import {render} from '@testing-library/react';
import {PageProvider} from 'data-engine-js-components-web';
import React from 'react';

import Radio from '../../../src/main/resources/META-INF/resources/Radio/Radio.es';

const spritemap = 'icons.svg';

const defaultRadioConfig = {
	name: 'radioField',
	spritemap,
};

const RadioWithProvider = (props) => (
	<PageProvider value={{editingLanguageId: 'en_US'}}>
		<Radio {...props} />
	</PageProvider>
);

describe('Field Radio', () => {
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

	it('is not editable', () => {
		const {container} = render(
			<RadioWithProvider {...defaultRadioConfig} readOnly />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a helptext', () => {
		const {container} = render(
			<RadioWithProvider {...defaultRadioConfig} tip="Type something" />
		);

		expect(container).toMatchSnapshot();
	});

	it('renders options', () => {
		const {container} = render(
			<RadioWithProvider
				{...defaultRadioConfig}
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
					{
						checked: false,
						disabled: false,
						id: 'id',
						inline: false,
						label: 'label2',
						name: 'name',
						showLabel: true,
						value: 'item2',
					},
				]}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('renders no options when options is empty', () => {
		const {container} = render(
			<RadioWithProvider {...defaultRadioConfig} options={[]} />
		);

		expect(container).toMatchSnapshot();
	});

	it('has an id', () => {
		const {container} = render(
			<RadioWithProvider {...defaultRadioConfig} id="Id" />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a label', () => {
		const {container} = render(
			<RadioWithProvider {...defaultRadioConfig} label="label" />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a placeholder', () => {
		const {container} = render(
			<RadioWithProvider {...defaultRadioConfig} placeholder="Option 1" />
		);

		expect(container).toMatchSnapshot();
	});

	it('is not required', () => {
		const {container} = render(
			<RadioWithProvider {...defaultRadioConfig} required={false} />
		);

		expect(container).toMatchSnapshot();
	});

	it('renders Label if showLabel is true', () => {
		const {container} = render(
			<RadioWithProvider {...defaultRadioConfig} label="text" showLabel />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a value', () => {
		const {container} = render(
			<RadioWithProvider {...defaultRadioConfig} value="value" />
		);

		expect(container).toMatchSnapshot();
	});
});
