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

import React from 'react';
import './AutoComplete.scss';
export default function AutoComplete<T>({
	children,
	className,
	contentRight,
	emptyStateMessage,
	error,
	feedbackMessage,
	id,
	items,
	label,
	onChangeQuery,
	onSelectItem,
	query,
	required,
	value,
}: IProps<T>): JSX.Element;
interface IProps<T> {
	children: (item: T) => React.ReactNode;
	className?: string;
	contentRight?: React.ReactNode;
	emptyStateMessage: string;
	error?: string;
	feedbackMessage?: string;
	id?: string;
	items: T[];
	label: string;
	onChangeQuery: (value: string) => void;
	onSelectItem: (item: T) => void;
	query: string;
	required?: boolean;
	value?: string;
}
export {};
