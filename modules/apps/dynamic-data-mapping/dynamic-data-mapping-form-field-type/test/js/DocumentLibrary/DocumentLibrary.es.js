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
import React from 'react';

import DocumentLibrary from '../../../src/main/resources/META-INF/resources/DocumentLibrary/DocumentLibrary.es';

describe('Field DocumentLibrary', () => {
	it('is not readOnly', () => {
		const {container} = render(
			<DocumentLibrary name="uploadField" readOnly={false} />
		);

		expect(container).toMatchSnapshot();
	});

	it('is readOnly', () => {
		render(<DocumentLibrary readOnly />);

		expect(screen.getByRole('textbox')).toBeDisabled();
		expect(screen.getByRole('button')).toBeDisabled();
	});

	it('is readOnly when allowed for guest users', () => {
		const mockIsSignedIn = jest.fn();

		Liferay.ThemeDisplay.isSignedIn = mockIsSignedIn;

		render(<DocumentLibrary allowGuestUsers name="uploadField" readOnly />);

		expect(
			document.getElementById('uploadFieldinputFileGuestUpload')
		).toBeDisabled();
		expect(screen.getByText('select')).toHaveClass('disabled');
	});

	it('has a helptext', () => {
		const {container} = render(
			<DocumentLibrary name="uploadField" tip="Type something" />
		);

		expect(container).toMatchSnapshot();
	});

	it('has an id', () => {
		const {container} = render(
			<DocumentLibrary id="ID" name="uploadField" />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a label', () => {
		const {container} = render(
			<DocumentLibrary label="label" name="uploadField" />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a placeholder', () => {
		const {container} = render(
			<DocumentLibrary name="uploadField" placeholder="Placeholder" />
		);

		expect(container).toMatchSnapshot();
	});

	it('is not required', () => {
		const {container} = render(
			<DocumentLibrary name="uploadField" required={false} />
		);

		expect(container).toMatchSnapshot();
	});

	it('renders Label if showLabel is true', () => {
		const {container} = render(
			<DocumentLibrary label="text" name="uploadField" showLabel />
		);

		expect(container).toMatchSnapshot();
	});

	it('has a value', () => {
		const {container} = render(
			<DocumentLibrary name="uploadField" value='{"id":"123"}' />
		);

		expect(container).toMatchSnapshot();
	});

	it('shows guest upload field if allowGuestUsers property is enabled', () => {
		const mockIsSignedIn = jest.fn();

		Liferay.ThemeDisplay.isSignedIn = mockIsSignedIn;

		render(
			<DocumentLibrary
				allowGuestUsers
				name="uploadField"
				value='{"id":"123"}'
			/>
		);

		expect(
			document.getElementById('uploadFieldinputFileGuestUpload')
		).toBeInTheDocument();
	});

	it('hide guest upload field if allowGuestUsers property is disabled', () => {
		const mockIsSignedIn = jest.fn();

		Liferay.ThemeDisplay.isSignedIn = mockIsSignedIn;

		render(
			<DocumentLibrary
				allowGuestUsers={false}
				name="uploadField"
				value='{"id":"123"}'
			/>
		);

		expect(
			document.getElementById('uploadFieldinputFileGuestUpload')
		).not.toBeInTheDocument();
	});

	it('disables guest upload field if maximumSubmissionLimitReached property is true', () => {
		const mockIsSignedIn = jest.fn();

		Liferay.ThemeDisplay.isSignedIn = mockIsSignedIn;

		render(
			<DocumentLibrary
				allowGuestUsers
				maximumSubmissionLimitReached
				name="uploadField"
			/>
		);

		expect(
			document.getElementById('uploadFieldinputFileGuestUpload')
		).toBeDisabled();

		expect(screen.getByText('select')).toHaveClass('disabled');
	});
});
