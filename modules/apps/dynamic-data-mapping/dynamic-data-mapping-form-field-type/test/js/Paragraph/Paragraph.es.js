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

import Paragraph from '../../../src/main/resources/META-INF/resources/Paragraph/Paragraph.es';

const defaultParagraphConfig = {
	name: 'textField',
};

describe('Field Paragraph', () => {
	it('is readOnly', () => {
		const {container} = render(
			<Paragraph {...defaultParagraphConfig} readOnly />
		);

		expect(container).toMatchSnapshot();
	});

	it('has an id', () => {
		const {container} = render(
			<Paragraph {...defaultParagraphConfig} id="Id" />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a label', () => {
		const {container} = render(
			<Paragraph {...defaultParagraphConfig} label="label" />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a placeholder', () => {
		const {container} = render(
			<Paragraph {...defaultParagraphConfig} placeholder="Placeholder" />
		);

		expect(container).toMatchSnapshot();
	});

	it('is not required', () => {
		const {container} = render(
			<Paragraph {...defaultParagraphConfig} required={false} />
		);

		expect(container).toMatchSnapshot();
	});

	it('renders Label if showLabel is true', () => {
		const {container} = render(
			<Paragraph {...defaultParagraphConfig} label="text" showLabel />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a value', () => {
		const {container} = render(
			<Paragraph {...defaultParagraphConfig} value="value" />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a key', () => {
		const {container} = render(
			<Paragraph {...defaultParagraphConfig} key="key" />
		);

		expect(container).toMatchSnapshot();
	});
});
