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

import KeyValue from '../../../src/main/resources/META-INF/resources/KeyValue/KeyValue.es';

describe('KeyValue', () => {
	it('is not editable', () => {
		const {container} = render(<KeyValue name="keyValue" readOnly />);

		expect(container).toMatchSnapshot();
	});

	it('has a helptext', () => {
		const {container} = render(
			<KeyValue name="keyValue" tip="Type something" />
		);

		expect(container).toMatchSnapshot();
	});

	it('has an id', () => {
		const {container} = render(<KeyValue id="Id" name="keyValue" />);

		expect(container).toMatchSnapshot();
	});

	it('has a label', () => {
		const {container} = render(<KeyValue label="label" name="keyValue" />);

		expect(container).toMatchSnapshot();
	});

	it('has a predefined Value', () => {
		const {container} = render(
			<KeyValue name="keyValue" placeholder="Option 1" />
		);

		expect(container).toMatchSnapshot();
	});

	it('hides keyword input', () => {
		render(<KeyValue name="keyValue" readOnly />);

		const keyValueInput = document.querySelectorAll('.key-value-input');

		expect(keyValueInput.length).toBe(0);
	});

	it('is not required', () => {
		const {container} = render(
			<KeyValue name="keyValue" required={false} />
		);

		expect(container).toMatchSnapshot();
	});

	it('renders Label if showLabel is true', () => {
		const {container} = render(
			<KeyValue label="text" name="keyValue" showLabel />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a value', () => {
		const {container} = render(<KeyValue name="keyValue" value="value" />);

		expect(container).toMatchSnapshot();
	});

	it('renders component with a key', () => {
		const {container} = render(<KeyValue keyword="key" name="keyValue" />);

		expect(container).toMatchSnapshot();
	});

	it('shows keyword input', () => {
		render(<KeyValue name="keyValue" readOnly showKeyword />);

		const keyValueInput = document.querySelectorAll('.key-value-input');

		expect(keyValueInput.length).toBe(1);
	});
});
