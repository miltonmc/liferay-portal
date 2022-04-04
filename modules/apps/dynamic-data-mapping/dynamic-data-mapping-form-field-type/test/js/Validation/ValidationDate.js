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
import {FormProvider} from 'data-engine-js-components-web';
import React from 'react';

import ValidationDate from '../../../src/main/resources/META-INF/resources/Validation/ValidationDate';

const validations = [
	{
		checked: false,
		label: 'Future Dates',
		name: 'futureDates',
		parameterMessage: '',
		template: 'futureDates({name}, "{parameter}")',
		value: 'futureDates',
	},
	{
		checked: false,
		label: 'Past Dates',
		name: 'pastDates',
		parameterMessage: '',
		template: 'pastDates({name}, "{parameter}")',
		value: 'pastDates',
	},
	{
		checked: false,
		label: 'Range',
		name: 'dateRange',
		parameterMessage: '',
		template: 'dateRange({name}, "{parameter}")',
		value: 'dateRange',
	},
];

const generateParameter = () => ({
	en_US: {
		endsOn: {
			date: 'responseDate',
			dateFieldName: 'Date1234',
			quantity: 1,
			type: 'customDate',
			unit: 'days',
		},
		startsFrom: {
			date: 'responseDate',
			dateFieldName: 'Date1234',
			quantity: 1,
			type: 'customDate',
			unit: 'days',
		},
	},
});

const parameters = generateParameter();

const localizedValue = jest.fn(() => parameters['en_US']);

const ValidationDateProvider = ({
	formBuilder = {pages: []},
	state,
	...props
}) => (
	<FormProvider initialState={{formBuilder}} value={state}>
		<ValidationDate {...props} />
	</FormProvider>
);

describe('ValidationDate', () => {
	it('shows future dates validation', () => {
		const {container} = render(
			<ValidationDateProvider
				defaultLanguageId="en_US"
				editingLanguageId="en_US"
				localizedValue={localizedValue}
				name="validationDate"
				parameter={parameters}
				selectedValidation={{
					label: '',
					name: 'futureDates',
					parameterMessage: '',
					template: 'futureDates({name}, "{parameter}")',
				}}
				validations={validations}
				visible
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('shows past dates validation', () => {
		const {container} = render(
			<ValidationDateProvider
				defaultLanguageId="en_US"
				editingLanguageId="en_US"
				localizedValue={localizedValue}
				name="validationDate"
				parameter={parameters}
				selectedValidation={{
					label: '',
					name: 'pastDates',
					parameterMessage: '',
					template: 'pastDates({name}, "{parameter}")',
				}}
				validations={validations}
				visible
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('shows date range validation', () => {
		const {container} = render(
			<ValidationDateProvider
				defaultLanguageId="en_US"
				editingLanguageId="en_US"
				formBuilder={{pages: []}}
				localizedValue={localizedValue}
				name="validationDate"
				parameter={parameters}
				selectedValidation={{
					label: '',
					name: 'dateRange',
					parameterMessage: '',
					template: 'dateRange({name}, "{parameter}")',
				}}
				validations={validations}
				visible
			/>
		);

		expect(container).toMatchSnapshot();
	});

	it('shows custom date fields for Future dates', () => {
		const parameter = {
			en_US: {
				startsFrom: {
					date: 'responseDate',
					quantity: 1,
					type: 'customDate',
					unit: 'days',
				},
			},
		};

		const localizedValue = jest.fn(() => parameter['en_US']);
		render(
			<ValidationDateProvider
				defaultLanguageId="en_US"
				editingLanguageId="en_US"
				localizedValue={localizedValue}
				parameter={parameter}
				selectedValidation={{
					label: '',
					name: 'futureDates',
					parameterMessage: '',
					template: 'futureDates({name}, "{parameter}")',
				}}
				validations={validations}
				visible
			/>
		);

		expect(
			screen.getByText('accepted-date').querySelector('input')
		).toHaveValue('futureDates');
		expect(
			screen.getByText('operation').querySelector('input')
		).toHaveValue('plus');
		expect(screen.getByText('quantity').querySelector('input')).toHaveValue(
			1
		);
		expect(screen.getByText('unit').querySelector('input')).toHaveValue(
			'days'
		);
	});

	it('shows custom date fields for Past dates and operation minus when quantity is negative', () => {
		const parameter = {
			en_US: {
				endsOn: {
					date: 'responseDate',
					quantity: -1,
					type: 'customDate',
					unit: 'days',
				},
			},
		};

		const localizedValue = jest.fn(() => parameter['en_US']);
		render(
			<ValidationDateProvider
				defaultLanguageId="en_US"
				editingLanguageId="en_US"
				localizedValue={localizedValue}
				parameter={parameter}
				selectedValidation={{
					label: '',
					name: 'pastDates',
					parameterMessage: '',
					template: 'pastDates({name}, "{parameter}")',
				}}
				validations={validations}
				visible
			/>
		);

		expect(
			screen.getByText('accepted-date').querySelector('input')
		).toHaveValue('pastDates');
		expect(
			screen.getByText('operation').querySelector('input')
		).toHaveValue('minus');
		expect(screen.getByText('quantity').querySelector('input')).toHaveValue(
			1
		);
		expect(screen.getByText('unit').querySelector('input')).toHaveValue(
			'days'
		);
	});

	it('shows date field', () => {
		const formBuilder = {
			pages: [
				{
					rows: [
						{
							columns: [
								{
									fields: [
										{
											fieldName: 'Date12345678',
											label: 'Date A',
											type: 'date',
										},
									],
									size: 12,
								},
							],
						},
					],
				},
			],
		};

		const parameter = {
			en_US: {
				endsOn: {
					date: 'responseDate',
					quantity: -1,
					type: 'responseDate',
					unit: 'days',
				},
			},
		};

		const localizedValue = jest.fn(() => parameter['en_US']);

		render(
			<ValidationDateProvider
				defaultLanguageId="en_US"
				editingLanguageId="en_US"
				formBuilder={formBuilder}
				localizedValue={localizedValue}
				parameters={parameters}
				selectedValidation={{
					label: '',
					name: 'pastDates',
					parameterMessage: '',
					template: 'pastDates({name}, "{parameter}")',
				}}
				validations={validations}
				visible
			/>
		);

		expect(
			screen.getByRole('button', {name: 'Date A'})
		).toBeInTheDocument();
	});

	it('hides date field if it is repeatable', () => {
		const formBuilder = {
			pages: [
				{
					rows: [
						{
							columns: [
								{
									fields: [
										{
											fieldName: 'Date12345678',
											label: 'Date A',
											repeatable: true,
											type: 'date',
										},
									],
									size: 12,
								},
							],
						},
					],
				},
			],
		};

		const parameter = {
			en_US: {
				endsOn: {
					date: 'responseDate',
					quantity: -1,
					type: 'responseDate',
					unit: 'days',
				},
			},
		};

		const localizedValue = jest.fn(() => parameter['en_US']);

		render(
			<ValidationDateProvider
				defaultLanguageId="en_US"
				editingLanguageId="en_US"
				formBuilder={formBuilder}
				localizedValue={localizedValue}
				parameters={parameters}
				selectedValidation={{
					label: '',
					name: 'pastDates',
					parameterMessage: '',
					template: 'pastDates({name}, "{parameter}")',
				}}
				validations={validations}
				visible
			/>
		);

		expect(screen.queryByText('Date A')).not.toBeInTheDocument();
	});

	it('shows date field from a field group', () => {
		const formBuilder = {
			pages: [
				{
					rows: [
						{
							columns: [
								{
									fields: [
										{
											nestedFields: [
												{
													fieldName: 'childDate',
													type: 'date',
												},
											],
											type: 'fieldGroup',
										},
									],
									size: 12,
								},
							],
						},
					],
				},
			],
		};

		const parameter = {
			en_US: {
				endsOn: {
					date: 'responseDate',
					quantity: -1,
					type: 'responseDate',
					unit: 'days',
				},
			},
		};

		const localizedValue = jest.fn(() => parameter['en_US']);

		render(
			<ValidationDateProvider
				defaultLanguageId="en_US"
				editingLanguageId="en_US"
				formBuilder={formBuilder}
				localizedValue={localizedValue}
				parameters={parameters}
				selectedValidation={{
					label: '',
					name: 'pastDates',
					parameterMessage: '',
					template: 'pastDates({name}, "{parameter}")',
				}}
				validations={validations}
				visible
			/>
		);

		const lastOption = [...screen.getAllByRole('button')].pop();

		expect(lastOption).toHaveValue('childDate');
	});

	it('hides date field if from a repeatable field group', () => {
		const formBuilder = {
			pages: [
				{
					rows: [
						{
							columns: [
								{
									fields: [
										{
											nestedFields: [
												{
													fieldName: 'childDate',
													type: 'date',
												},
											],
											repeatable: true,
											type: 'fieldGroup',
										},
									],
									size: 12,
								},
							],
						},
					],
				},
			],
		};

		const parameter = {
			en_US: {
				endsOn: {
					date: 'responseDate',
					quantity: -1,
					type: 'responseDate',
					unit: 'days',
				},
			},
		};

		render(
			<ValidationDateProvider
				defaultLanguageId="en_US"
				editingLanguageId="en_US"
				formBuilder={formBuilder}
				localizedValue={jest.fn(() => parameter['en_US'])}
				parameters={parameters}
				selectedValidation={{
					label: '',
					name: 'pastDates',
					parameterMessage: '',
					template: 'pastDates({name}, "{parameter}")',
				}}
				validations={validations}
				visible
			/>
		);

		const lastOption = [...screen.getAllByRole('button')].pop();

		expect(lastOption).not.toHaveValue('childDate');
	});

	it('shows date fields inside custom date fields for Past dates and operation minus when quantity is negative', () => {
		const formBuilder = {
			pages: [
				{
					rows: [
						{
							columns: [
								{
									fields: [
										{
											fieldName: 'Date12345678',
											label: 'Date A',
											type: 'date',
										},
									],
									size: 12,
								},
							],
						},
					],
				},
			],
		};

		const parameter = {
			en_US: {
				endsOn: {
					date: 'dateField',
					quantity: -10,
					type: 'customDate',
					unit: 'days',
				},
			},
		};

		render(
			<ValidationDateProvider
				defaultLanguageId="en_US"
				editingLanguageId="en_US"
				formBuilder={formBuilder}
				localizedValue={jest.fn(() => parameter['en_US'])}
				parameter={parameter}
				selectedValidation={{
					label: '',
					name: 'pastDates',
					parameterMessage: '',
					template: 'pastDates({name}, "{parameter}")',
				}}
				validations={validations}
				visible
			/>
		);

		expect(
			screen.getAllByRole('button', {name: 'Date A'})[1]
		).toBeInTheDocument();
		expect(
			screen.getByText('accepted-date').querySelector('input')
		).toHaveValue('pastDates');
		expect(
			screen.getByText('operation').querySelector('input')
		).toHaveValue('minus');
		expect(screen.getByText('quantity').querySelector('input')).toHaveValue(
			10
		);
		expect(screen.getByText('unit').querySelector('input')).toHaveValue(
			'days'
		);
	});
});
