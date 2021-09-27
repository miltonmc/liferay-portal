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

import {PagesVisitor} from '../../../src/main/resources/META-INF/resources/js/utils/visitors.es';
import mockPages from '../__mock__/mockPages.es';

const createNewPage = () => {
	const field = {
		fieldName: 'A',
		nestedFields: [{fieldName: 'B'}],
	};
	const pages = [{rows: [{columns: [{fields: [field]}]}]}];

	return {field, pages};
};

describe('PagesVisitor', () => {
	let visitor;

	beforeEach(() => {
		nestedField = {fieldName: 'B'};
		field = {fieldName: 'A', nestedFields: [nestedField]};
		pages = [{rows: [{columns: [{fields: [field]}]}]}];
		visitor.setPages(pages);
	});

	afterEach(() => {
		if (visitor) {
			visitor.dispose();
	describe('visitFields(evaluateField)', () => {
		it('visits each field and stops on first occurrence', () => {
			const visitedFieldNames = [];

			const visitor = new PagesVisitor([
				{
					rows: [
						{
							columns: [
								{
										{fieldName: 'A'},
										{
											fieldName: 'B',
											nestedFields: [{fieldName: 'C'}],
										},
									],
								},
								{fields: [{fieldName: 'D'}]},
							],
						},
						{columns: [{fields: [{fieldName: 'E'}]}]},
					],
				},
				{rows: [{columns: [{fields: [{fieldName: 'F'}]}]}]},
			]);

			visitor.visitFields(({fieldName}) => {
				visitedFieldNames.push(fieldName);

				return fieldName === 'C';
			});

			expect(visitedFieldNames).toEqual(['A', 'B', 'C']);
		});
	});

	describe('mapFields(callback, merge, includeNestedField)', () => {
		let oldField;
		let oldPages;

		beforeEach(() => {
			const {field, pages} = createNewPage();
			oldField = field;
			oldPages = pages;
			visitor = new PagesVisitor(pages);
		});

		it('updates field property', () => {
			expect(
				visitor.mapFields((field, index) => ({
					fieldName: `field${index}`,
				}))
			).toEqual([
				{
					rows: [
						{
							columns: [
								{
									fields: [
										{
											fieldName: 'field0',
											nestedFields: [{fieldName: 'B'}],
										},
									],
								},
							],
						},
					],
				},
			]);
		});

		it('does not mutate the the original pages', () => {
			const newPages = visitor.mapFields((field) => field);

			expect(oldPages).not.toBe(newPages);
			expect(oldPages).toEqual(newPages);
		});

		it('does not mutate the the original field', () => {
			visitor = new PagesVisitor(oldPages);
			const newPages = visitor.mapFields((field) => field);
			const [
				{
					rows: [
						{
							columns: [
								{
									fields: [newField],
								},
							],
						},
					],
				},
			] = newPages;

			expect(oldField).not.toBe(newField);
			expect(oldField).toEqual(newField);
		});

		it('overrides the original nested field if iterating over the nested fields', () => {
			const pages = visitor.mapFields(
				() => ({nestedFields: [{fieldName: 'C'}], visited: true}),
				true,
				true
			);

			const [
				{
					rows: [
						{
							columns: [
								{
									fields: [field],
								},
							],
						},
					],
				},
			] = pages;

			expect(field).toEqual({
				fieldName: 'A',
				nestedFields: [
					{
						fieldName: 'B',
						nestedFields: [{fieldName: 'C'}],
						visited: true,
					},
				],
				visited: true,
			});
		});

		it('merges new and old properties from a field including its nested fields', () => {
			const pages = visitor.mapFields(
				() => ({visited: true}),
				true,
				true
			);

			const [
				{
					rows: [
						{
							columns: [
								{
									fields: [field],
								},
							],
						},
					],
				},
			] = pages;

			// check if we want to keep the empty `nestedField` was created into the field

			expect(field).toEqual({
				fieldName: 'A',
				nestedFields: [
					{fieldName: 'B', nestedFields: [], visited: true},
				],
				visited: true,
			});
		});

		it('merges new and old properties from a field not iterating over the nested fields', () => {
			const pages = visitor.mapFields(
				() => ({visited: true}),
				true,
				false
			);

			const [
				{
					rows: [
						{
							columns: [
								{
									fields: [field],
								},
							],
						},
					],
				},
			] = pages;

			expect(field).toEqual({
				fieldName: 'A',
				nestedFields: [{fieldName: 'B'}],
				visited: true,
			});
		});

		it('keeps only new properties from a field ignoring the old nested fields', () => {
			const pages = visitor.mapFields(
				() => ({visited: true}),
				false,
				true
			);

			const [
				{
					rows: [
						{
							columns: [
								{
									fields: [field],
								},
							],
						},
					],
				},
			] = pages;

			expect(field).toEqual({visited: true});
		});

		it('keeps only new properties from a field not iterating over the nested fields', () => {
			const pages = visitor.mapFields(
				() => ({visited: true}),
				false,
				false
			);

			const [
				{
					rows: [
						{
							columns: [
								{
									fields: [field],
								},
							],
						},
					],
				},
			] = pages;

			expect(field).toEqual({visited: true});
		});
	});
});
