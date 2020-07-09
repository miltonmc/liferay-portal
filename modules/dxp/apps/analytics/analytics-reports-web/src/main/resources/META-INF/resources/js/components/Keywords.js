/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import ClayButton from '@clayui/button';
import ClayDropDown from '@clayui/drop-down';
import {ClaySelect} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayList from '@clayui/list';
import {ClayTooltipProvider} from '@clayui/tooltip';
import PropTypes from 'prop-types';
import React, {useContext, useMemo, useState} from 'react';

import {StoreContext} from '../context/store';
import {numberFormat} from '../utils/numberFormat';
import Hint from './Hint';

const KEYWORD_VALUE_TYPE = [
	{label: Liferay.Language.get('traffic'), name: 'traffic'},
	{label: Liferay.Language.get('search-volume'), name: 'volume'},
	{label: Liferay.Language.get('position'), name: 'position'},
];

export default function Keywords({currentPage, languageTag}) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const [keywordValueType, setKeywordValueType] = useState(
		KEYWORD_VALUE_TYPE.find((keywordValueType) => {
			return keywordValueType.name === 'traffic';
		})
	);

	const [{publishedToday}] = useContext(StoreContext);

	const keywordsData = useMemo(() => {
		const dataKeys = new Set();

		const countries = currentPage.data.countryKeywords.reduce(
			(acc, {countryCode, countryName}) => {
				if (dataKeys.has(countryCode)) {
					return acc;
				}

				dataKeys.add(countryCode);

				return acc.concat({countryCode, countryName});
			},
			[]
		);

		return {countries};
	}, [currentPage.data.countryKeywords]);

	const {countries} = keywordsData;

	const [currentCountry, setCurrentCountry] = useState(
		countries[0].countryCode
	);

	const countryKeywords = useMemo(() => {
		const country =
			currentCountry &&
			currentPage.data.countryKeywords.find((c) => {
				return c.countryCode === currentCountry;
			});

		return country?.keywords ?? [];
	}, [currentPage.data.countryKeywords, currentCountry]);

	const handleCountrySelection = (event) => {
		const country = event.target.value;
		setCurrentCountry(country);
	};

	return (
		<>
			<h5 className="mt-3 sheet-subtitle">
				{Liferay.Language.get('best-keywords')}
			</h5>

			<div className="mb-3 text-secondary">
				{Liferay.Language.get('best-keywords-description')}
			</div>

			<div className="form-group">
				<label htmlFor="countrySelect">
					{Liferay.Language.get('select-country')}
				</label>
				<ClaySelect
					aria-label={Liferay.Language.get('select-country')}
					className="bg-white"
					defaultValue={currentCountry}
					id="countrySelect"
					onChange={handleCountrySelection}
				>
					{countries.map((item) => (
						<ClaySelect.Option
							key={item.countryCode}
							label={item.countryName}
							value={item.countryCode}
						/>
					))}
				</ClaySelect>
			</div>

			<ClayList className="list-group-keywords-list">
				<ClayList.Item flex>
					<ClayList.ItemField expand>
						<ClayList.ItemTitle className="text-truncate-inline">
							<span className="text-truncate">
								{Liferay.Language.get('best-keyword')}
								<span className="text-secondary">
									<Hint
										message={Liferay.Language.get(
											'best-keyword-help'
										)}
										title={Liferay.Language.get(
											'best-keyword'
										)}
									/>
								</span>
							</span>
						</ClayList.ItemTitle>
					</ClayList.ItemField>
					<ClayList.ItemField>
						<ClayDropDown
							active={isDropdownOpen}
							onActiveChange={(isActive) =>
								setIsDropdownOpen(isActive)
							}
							trigger={
								<ClayButton
									className="px-0 text-body"
									displayType="link"
									small
								>
									<span className="font-weight-semi-bold">
										<span className="pr-2">
											{keywordValueType.label}
										</span>
										<ClayIcon symbol="caret-bottom" />
									</span>
								</ClayButton>
							}
						>
							<ClayDropDown.ItemList>
								{KEYWORD_VALUE_TYPE.map((valueType, index) => (
									<ClayDropDown.Item
										active={
											valueType.name ===
											keywordValueType.name
										}
										key={index}
										onClick={() => {
											setKeywordValueType(
												KEYWORD_VALUE_TYPE.find(
													(keywordValueType) => {
														return (
															keywordValueType.name ===
															valueType.name
														);
													}
												)
											);
											setIsDropdownOpen(false);
										}}
									>
										{valueType.label}
									</ClayDropDown.Item>
								))}
							</ClayDropDown.ItemList>
						</ClayDropDown>
					</ClayList.ItemField>
				</ClayList.Item>
				{!publishedToday &&
					countryKeywords.length > 0 &&
					countryKeywords.map((k) => {
						return (
							<ClayList.Item flex key={k.keyword}>
								<ClayList.ItemField expand>
									<ClayList.ItemText>
										<ClayTooltipProvider>
											<span
												className="text-truncate-inline"
												data-tooltip-align="top"
												title={k.keyword}
											>
												<span className="text-truncate">
													{k.keyword}
												</span>
											</span>
										</ClayTooltipProvider>
									</ClayList.ItemText>
								</ClayList.ItemField>
								<ClayList.ItemField expand>
									<span className="align-self-end">
										{numberFormat(
											languageTag,
											keywordValueType.name === 'traffic'
												? k.traffic
												: keywordValueType.name ===
												  'volume'
												? k.searchVolume
												: k.position
										)}
									</span>
								</ClayList.ItemField>
							</ClayList.Item>
						);
					})}
				{(publishedToday || countryKeywords.length === 0) && (
					<ClayList.Item flex>
						<ClayList.ItemField expand>
							<ClayList.ItemText>
								<span className="text-secondary">
									{Liferay.Language.get(
										'there-are-no-best-keywords-yet'
									)}
								</span>
							</ClayList.ItemText>
						</ClayList.ItemField>
					</ClayList.Item>
				)}
			</ClayList>
		</>
	);
}

Keywords.proptypes = {
	currentPage: PropTypes.object.isRequired,
	languageTag: PropTypes.string.isRequired,
};
