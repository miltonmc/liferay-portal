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

import ClayAlert from '@clayui/alert';
import {
	Card,
	FormCustomSelect,
	Input,
	InputLocalized,
	SidePanelForm,
	closeSidePanel,
	invalidateRequired,
	openToast,
	useForm,
} from '@liferay/object-js-components-web';
import React, {useState} from 'react';

import {updateRelationship} from '../../utils/api';
import {
	availableLocales,
	defaultLanguageId,
	defaultLocale,
} from '../../utils/locale';
import {firstLetterUppercase} from '../../utils/string';
import {RELATIONSHIP_TYPES} from './constants';

export default function EditObjectRelationship({
	deletionTypes,
	hasUpdateObjectDefinitionPermission,
	isReverse,
	objectRelationship: initialValues,
}: IProps) {
	const [selectedLocale, setSelectedLocale] = useState(
		defaultLocale as {
			label: string;
			symbol: string;
		}
	);

	const selectedType = RELATIONSHIP_TYPES.find(
		(relationshipType) => relationshipType.value === initialValues.type
	);

	const onSubmit = async (objectRelationship: ObjectRelationship) => {
		try {
			await updateRelationship(objectRelationship);
			closeSidePanel();

			openToast({
				message: Liferay.Language.get(
					'the-object-relationship-was-updated-successfully'
				),
			});
		}
		catch ({message}) {
			openToast({message: message as string, type: 'danger'});
		}
	};

	const validate = (value: ObjectRelationship) => {
		const errors: {deletionType?: string; label?: string} = {};

		if (invalidateRequired(value.label[defaultLanguageId])) {
			errors.label = Liferay.Language.get('required');
		}

		return errors;
	};

	const {errors, handleSubmit, setValues, values} = useForm({
		initialValues,
		onSubmit,
		validate,
	});

	const readOnly = !hasUpdateObjectDefinitionPermission || isReverse;

	return (
		<SidePanelForm
			onSubmit={handleSubmit}
			readOnly={readOnly}
			title={Liferay.Language.get('relationship')}
		>
			<Card title={Liferay.Language.get('basic-info')}>
				{isReverse && (
					<ClayAlert
						displayType="warning"
						title={`${Liferay.Language.get('warning')}:`}
					>
						{Liferay.Language.get(
							'reverse-object-relationships-cannot-be-updated'
						)}
					</ClayAlert>
				)}

				<InputLocalized
					defaultLanguageId={defaultLanguageId}
					disabled={readOnly}
					error={errors.label}
					label={Liferay.Language.get('label')}
					locales={availableLocales}
					onSelectedLocaleChange={setSelectedLocale}
					onTranslationsChange={(label) => setValues({label})}
					required
					selectedLocale={selectedLocale}
					translations={values.label}
				/>

				<Input
					disabled
					label={Liferay.Language.get('name')}
					required
					value={initialValues.name}
				/>

				<FormCustomSelect
					disabled
					label={Liferay.Language.get('type')}
					options={RELATIONSHIP_TYPES}
					required
					value={selectedType?.label}
				/>

				<FormCustomSelect
					disabled
					label={Liferay.Language.get('object')}
					options={[]}
					required
					value={initialValues.objectDefinitionName2}
				/>

				<FormCustomSelect
					disabled={readOnly}
					label={Liferay.Language.get('deletion-type')}
					onChange={(deletionType) =>
						setValues({deletionType: deletionType.value})
					}
					options={deletionTypes}
					required
					value={firstLetterUppercase(values.deletionType)}
				/>
			</Card>
		</SidePanelForm>
	);
}

interface IProps {
	deletionTypes: TDeletionType[];
	hasUpdateObjectDefinitionPermission: boolean;
	isReverse: boolean;
	objectRelationship: ObjectRelationship;
}

type TDeletionType = {
	label: string;
	value: string;
};
