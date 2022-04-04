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
import {fireEvent, render, screen} from '@testing-library/react';
import React from 'react';

import {FieldBase} from '../../../src/main/resources/META-INF/resources/FieldBase/ReactFieldBase.es';

describe('ReactFieldBase', () => {
	it('renders the default markup', () => {
		const {container} = render(<FieldBase />);

		expect(container).toMatchSnapshot();
	});

	it('renders the FieldBase with required', () => {
		const {container} = render(<FieldBase required />);

		expect(container).toMatchSnapshot();
	});

	it('renders the FieldBase with id', () => {
		const {container} = render(<FieldBase id="Id" />);

		expect(container).toMatchSnapshot();
	});

	it('renders the FieldBase with help text', () => {
		const {container} = render(<FieldBase tip="Type something!" />);

		expect(container).toMatchSnapshot();
	});

	it('renders the FieldBase with label', () => {
		const {container} = render(<FieldBase label="Text" />);

		expect(container).toMatchSnapshot();
	});

	it('renders the FieldBase with tooltip', () => {
		render(<FieldBase tooltip="Tooltip" />);

		expect(document.querySelector('.ddm-tooltip')).toBeInTheDocument();
	});

	it('does not render the label if showLabel is false', () => {
		const {container} = render(
			<FieldBase label="Text" showLabel={false} />
		);

		expect(container).toMatchSnapshot();
	});

	it('renders the FieldBase with contentRenderer', () => {
		const {container} = render(
			<FieldBase>
				<div>
					<h1>Foo bar</h1>
				</div>
			</FieldBase>
		);

		expect(container).toMatchSnapshot();
	});

	it('renders the add button when repeatable is true', () => {
		const {container} = render(
			<FieldBase label="Text" repeatable showLabel={false} />
		);

		expect(container).toMatchSnapshot();
	});

	it('does not render the add button when repeatable is true and the maximum limit of repetions is reached', () => {
		const {container} = render(
			<FieldBase
				label="Text"
				overMaximumRepetitionsLimit
				repeatable
				showLabel={false}
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('shows the popover for Format field when hovering over the tooltip icon', () => {
		render(
			<FieldBase
				fieldName="inputMaskFormat"
				tooltip="Tooltip Description"
			/>
		);

		const tooltipIcon = document.querySelector('.ddm-tooltip');

		/* TODO: replace by userEvent.hover() after bump @testing-library/user-event */
		fireEvent.mouseOver(tooltipIcon);

		const clayPopover = screen.getByTestId('clayPopover');

		expect(clayPopover.style).toHaveProperty('maxWidth', '256px');

		expect(screen.getByRole('img')).toHaveAttribute('height', '170');
		expect(screen.getByRole('img')).toHaveAttribute(
			'src',
			'http://localhost:8080/forms/input_mask_format.png'
		);
		expect(screen.getByRole('img')).toHaveAttribute('width', '232');

		expect(screen.getByText('input-mask-format')).toBeInTheDocument();
		expect(screen.getByText('Tooltip Description')).toBeInTheDocument();
	});

	describe('Hide Field', () => {
		it('renders the FieldBase with hideField markup', () => {
			render(<FieldBase hideField label="Text" />);

			expect(screen.getByText('hidden')).toBeInTheDocument();
			expect(screen.getByText('Text')).toBeInTheDocument();

			expect(screen.getByText('hidden').parentNode).toHaveAttribute(
				'class',
				'label ml-1 label-secondary'
			);
			expect(screen.getByText('Text')).toHaveAttribute(
				'class',
				'text-secondary'
			);
		});

		it('renders the FieldBase with hideField markup when the label is empty', () => {
			render(<FieldBase hideField label="" />);

			expect(screen.getByText('hidden')).toBeInTheDocument();

			expect(screen.getByText('hidden').parentNode).toHaveAttribute(
				'class',
				'label ml-1 label-secondary'
			);
		});
	});
});
