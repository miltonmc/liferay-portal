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

window.themeDisplay = {
	...window.themeDisplay,
	getDefaultLanguageId: () => 'en_US',
	getLanguageId: () => 'en_US',
	getPathThemeImages: () => 'http://localhost:8080',
	isSignedIn: () => true,
};

function sub(key, ...params) {
	let text = key;
	params.forEach((param, index) => {
		text = text.replace(`{${index}}`, param);
	});

	return text;
}

const languageMap = {
	'x-of-x-characters': '{0}/{1} characters',
};

window.Liferay = {
	Language: {
		direction: {en_US: 'rtl'},
		get: (key) => languageMap[key] ?? key,
	},
	ThemeDisplay: window.themeDisplay,
	Util: {
		escape: (data) => data,
		sub,
	},
};
