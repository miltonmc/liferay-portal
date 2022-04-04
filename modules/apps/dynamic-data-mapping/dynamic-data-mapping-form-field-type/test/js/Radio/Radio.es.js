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
import React from 'react';

import Radio from '../../../src/main/resources/META-INF/resources/Radio/Radio.es';

describe('Field Radio', () => {
	it('is not editable', () => {
		const {container} = render(<Radio name="radioField" readOnly />);

		expect(container).toMatchSnapshot();
	});

	it('has a helptext', () => {
		const {container} = render(
			<Radio name="radioField" tip="Type something" />
		);

		expect(container).toMatchSnapshot();
	});

	it('renders options', () => {
		const {container} = render(
			<Radio
				name="radioField"
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
		const {container} = render(<Radio name="radioField" options={[]} />);

		expect(container).toMatchSnapshot();
	});

	it('has an id', () => {
		const {container} = render(<Radio id="Id" name="radioField" />);

		expect(container).toMatchSnapshot();
	});

	it('has a label', () => {
		const {container} = render(<Radio label="label" name="radioField" />);

		expect(container).toMatchSnapshot();
	});

	it('has a placeholder', () => {
		const {container} = render(
			<Radio name="radioField" placeholder="Option 1" />
		);

		expect(container).toMatchSnapshot();
	});

	it('is not required', () => {
		const {container} = render(
			<Radio name="radioField" required={false} />
		);

		expect(container).toMatchSnapshot();
	});

	it('renders Label if showLabel is true', () => {
		const {container} = render(
			<Radio label="text" name="radioField" showLabel />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a value', () => {
		const {container} = render(<Radio name="radioField" value="value" />);

		expect(container).toMatchSnapshot();
	});
});
