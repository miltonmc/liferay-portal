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
import {FormProvider} from 'data-engine-js-components-web';
import React from 'react';

import Numeric from '../../../src/main/resources/META-INF/resources/Numeric/Numeric';

describe('Field Numeric', () => {
	it('renders the default markup', () => {
		const {container} = render(<Numeric />);

		expect(container).toMatchSnapshot();
	});

	it('has a name', () => {
		render(<Numeric name="numericField" />);

		expect(screen.queryByRole('textbox')).toHaveAttribute(
			'name',
			'numericField'
		);
	});

	it('enables input whenever readOnly is omitted', () => {
		render(<Numeric />);

		expect(screen.queryByRole('textbox')).toBeEnabled();
	});

	it('disables input whenever readOnly is set', () => {
		render(<Numeric readOnly />);

		expect(screen.queryByRole('textbox')).toBeDisabled();
	});

	it('has a helptext', () => {
		render(<Numeric tip="Type something" />);

		expect(screen.getAllByText('Type something')[0]).toBeInTheDocument();
	});

	it('has an id', () => {
		render(<Numeric id="ID" />);

		expect(screen.queryByRole('textbox')).toHaveAttribute('id', 'ID');
	});

	it('has a label', () => {
		render(<Numeric label="label" />);

		expect(screen.getByText(/label/)).toBeInTheDocument();
	});

	it('has a placeholder', () => {
		render(<Numeric placeholder="Placeholder" />);

		expect(screen.queryByRole('textbox')).toHaveAttribute(
			'placeholder',
			'Placeholder'
		);
	});

	it('is required', () => {
		render(<Numeric required />);

		expect(screen.getByText(/required/)).toBeInTheDocument();
	});

	it('renders Label if showLabel is true', () => {
		render(<Numeric label="Numeric Field" showLabel />);

		expect(screen.getByText(/Numeric Field/)).toHaveClass('ddm-label');
	});

	it('has a value', () => {
		render(<Numeric value="123" />);

		expect(screen.queryByRole('textbox')).toHaveValue('123');
	});

	it('fills with an input number', () => {
		const onChange = jest.fn();
		render(<Numeric onChange={onChange} />);

		const input = screen.queryByRole('textbox');
		userEvent.type(input, '2');

		expect(onChange).toHaveBeenCalledWith({target: {value: '2'}});
	});

	it('changes the mask type', () => {
		render(<Numeric dataType="double" value="22.22" />);

		expect(screen.queryByRole('textbox')).toHaveValue('22.22');
	});

	it('filters the non numeric characters when set to integer', () => {
		const onChange = jest.fn();
		render(<Numeric onChange={onChange} />);

		const input = screen.queryByRole('textbox');
		userEvent.type(input, '3.0');

		expect(onChange).toHaveBeenLastCalledWith({
			target: {value: '30'},
		});
	});

	it('check field value is the same without decimal symbol when fieldType is integer but it receives a double', () => {
		render(<Numeric value="3.8" />);

		expect(screen.queryByRole('textbox')).toHaveValue('38');
	});

	it('remove decimal symbol from value when changing from decimal to integer when symbol of language is comma', () => {
		render(
			<Numeric
				dataType="integer"
				symbols={{decimalSymbol: ','}}
				value="22,82"
			/>
		);

		expect(screen.queryByRole('textbox')).toHaveValue('2282');
	});

	it('updates decimal symbol using the current value of symbols', () => {
		render(
			<Numeric
				dataType="double"
				symbols={{decimalSymbol: ','}}
				value="-1.2"
			/>
		);

		expect(screen.queryByRole('textbox')).toHaveValue('-1,2');
	});

	it('updates decimal symbol using the localizedSymbols based on current editing language', () => {
		render(
			<FormProvider initialState={{editingLanguageId: 'pt_BR'}}>
				<Numeric
					dataType="double"
					localizedSymbols={{
						en_US: {
							decimalSymbol: '.',
						},
						pt_BR: {
							decimalSymbol: ',',
						},
					}}
					value="1.2"
				/>
			</FormProvider>
		);

		expect(screen.queryByRole('textbox')).toHaveValue('1,2');
	});

	describe('Confirmation Field', () => {
		it('renders the confirmation field with the same data type as the original field', () => {
			render(
				<Numeric
					confirmationValue="22.82"
					dataType="double"
					name="numericField"
					requireConfirmation
				/>
			);

			expect(
				document.getElementById('numericFieldconfirmationField')
			).toHaveValue('22.82');
		});

		it('remove decimal symbol of the confirmation value if the data type is Integer', () => {
			render(
				<Numeric
					confirmationValue="22.82"
					name="numericField"
					requireConfirmation
				/>
			);

			expect(
				document.getElementById('numericFieldconfirmationField')
			).toHaveValue('2282');
		});
	});

	describe('Integer Input Mask toggle', () => {
		it('has an inputMaskFormat', () => {
			const {container} = render(
				<Numeric
					inputMask
					inputMaskFormat="+99 (99) 9999-9999"
					name="numericField"
					value="123456789012"
				/>
			);

			expect(container).toMatchSnapshot();
		});

		it('applies mask to value', () => {
			render(
				<Numeric
					inputMask
					inputMaskFormat="+99 (99) 9999-9999"
					value="123456789012"
				/>
			);

			expect(screen.queryByRole('textbox')).toHaveValue(
				'+12 (34) 5678-9012'
			);
		});

		it('applies mask to predefined value', () => {
			render(
				<Numeric
					inputMask
					inputMaskFormat="+99 (99) 9999-9999"
					predefinedValue="123456789012"
				/>
			);

			expect(screen.queryByRole('textbox')).toHaveValue(
				'+12 (34) 5678-9012'
			);
		});

		it('truncates values over mask digit limit', () => {
			render(
				<Numeric
					inputMask
					inputMaskFormat="+99 (099) 9999-9999"
					value="12345678901234"
				/>
			);

			expect(screen.queryByRole('textbox')).toHaveValue(
				'+12 (345) 6789-0123'
			);
		});

		it('ignores optional digits whenever input is less than mandatory', () => {
			render(
				<Numeric
					inputMask
					inputMaskFormat="+09 (099) 9999-9999"
					value="12345"
				/>
			);

			expect(screen.queryByRole('textbox')).toHaveValue('+1 (23) 45');
		});

		it('sends unmasked value though onChange event', () => {
			const onChange = jest.fn();
			render(
				<Numeric
					inputMask
					inputMaskFormat="E.g +99 (99) 9999-9999"
					onChange={onChange}
				/>
			);

			userEvent.type(
				screen.queryByRole('textbox'),
				'E.g +55 (81) 2121-6000'
			);

			expect(onChange).toHaveBeenLastCalledWith({
				target: {value: '558121216000'},
			});
		});

		it('limits predefined value size according to the mask', () => {
			render(
				<Numeric
					inputMask
					inputMaskFormat="99-99"
					name="LPS-134259"
					predefinedValue="12345"
				/>
			);

			expect(
				document.querySelector('input[name="LPS-134259"]')
			).toHaveValue('1234');
		});

		it('allows input mask format to have only numbers', () => {
			render(<Numeric inputMask inputMaskFormat={99} value="1234" />);

			expect(screen.queryByRole('textbox')).toHaveValue('12');
		});

		/**
		 * This test was skipped due to an issue on userEvent.type() that not
		 * allows simulate backspace key pressing (with the current
		 * @testing-library/use-event)
		 */
		it.skip('it allows to delete non numeric characters from mask', () => {
			render(
				<Numeric
					inputMask
					inputMaskFormat="99-99"
					onChange={() => {}}
					predefinedValue="12"
				/>
			);

			const input = screen.queryByRole('textbox');

			userEvent.click(input);
			userEvent.type(input, '{backspace}');

			expect(input).toHaveValue('1');
		});
	});

	describe('Decimal Input Mask toggle', () => {
		it('renders a suffix', () => {
			render(
				<Numeric
					append="$"
					appendType="suffix"
					dataType="double"
					inputMask
					name="numericField"
					value="123"
				/>
			);

			expect(screen.queryByRole('textbox')).toHaveValue('123');
			expect(screen.getByText('$')).toHaveClass('input-group-text');
		});

		it('renders a prefix', () => {
			render(
				<Numeric
					append="$"
					appendType="prefix"
					dataType="double"
					inputMask
					name="numericField"
					value="123"
				/>
			);

			expect(screen.getByText('$')).toHaveClass('input-group-text');
			expect(screen.queryByRole('textbox')).toHaveValue('123');
		});

		it('renders the thousand separator', () => {
			render(
				<Numeric
					dataType="double"
					inputMask
					name="numericField"
					symbols={{decimalSymbol: '.', thousandsSeparator: ','}}
					value="1234"
				/>
			);

			expect(screen.queryByRole('textbox')).toHaveValue('1,234');
		});

		it('hides the thousand separator if it is set to `none`', () => {
			render(
				<Numeric
					dataType="double"
					inputMask
					name="numericField"
					symbols={{decimalSymbol: '.', thousandsSeparator: 'none'}}
					value="1234"
				/>
			);

			expect(screen.queryByRole('textbox')).toHaveValue('1234');
		});

		it('allows user to input a decimal separator', () => {
			const onChange = jest.fn();
			render(
				<Numeric
					dataType="double"
					inputMask
					name="numericField"
					onChange={onChange}
					symbols={{decimalSymbol: ','}}
				/>
			);

			userEvent.type(screen.queryByRole('textbox'), '1,234');

			expect(onChange).toHaveBeenLastCalledWith({
				target: {value: '1,23'},
			});
		});

		it('generates a placeholder', () => {
			render(
				<Numeric
					dataType="double"
					decimalPlaces="2"
					inputMask
					name="numericField"
					symbols={{decimalSymbol: ','}}
				/>
			);

			expect(screen.queryByRole('textbox')).toHaveAttribute(
				'placeholder',
				'0,00'
			);
		});

		it('allows user to input only the decimal quantity defined by decimal places field', () => {
			const onChange = jest.fn();
			render(
				<Numeric
					dataType="double"
					decimalPlaces={3}
					inputMask
					name="numericField"
					onChange={onChange}
					symbols={{decimalSymbol: ','}}
				/>
			);

			userEvent.type(screen.queryByRole('textbox'), '1,2345678');

			expect(onChange).toHaveBeenLastCalledWith({
				target: {value: '1,234'},
			});
		});

		/**
		 * LPS-136519 / LPS-136523
		 */
		it('ignores non decimal input', () => {
			const onChange = jest.fn();
			render(
				<Numeric
					append="999"
					appendType="suffix"
					dataType="double"
					inputMask
					name="numericField"
					onChange={onChange}
					symbols={{decimalSymbol: ','}}
				/>
			);

			userEvent.type(screen.queryByRole('textbox'), 'a# @e');

			expect(onChange).not.toHaveBeenCalled();
		});

		/**
		 * LPS-141862
		 */
		it('does not allow typing zeroes not followed by decimal symbol', () => {
			const onChange = jest.fn();
			render(
				<Numeric
					dataType="double"
					decimalPlaces={3}
					inputMask
					name="numericField"
					onChange={onChange}
					symbols={{decimalSymbol: ','}}
				/>
			);

			userEvent.type(screen.queryByRole('textbox'), '0083,5');

			expect(onChange).toHaveBeenLastCalledWith({
				target: {value: '83,5'},
			});
		});

		it('does not allow typing sequence of zeroes', () => {
			const onChange = jest.fn();
			render(
				<Numeric
					dataType="double"
					decimalPlaces={3}
					inputMask
					name="numericField"
					onChange={onChange}
					symbols={{decimalSymbol: ','}}
				/>
			);

			userEvent.type(screen.queryByRole('textbox'), '00,083');

			expect(onChange).toHaveBeenLastCalledWith({
				target: {value: '0,083'},
			});
		});
	});
});
