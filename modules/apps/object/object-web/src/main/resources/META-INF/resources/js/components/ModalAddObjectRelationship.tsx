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
import ClayButton from '@clayui/button';
import ClayForm from '@clayui/form';
import ClayModal, {ClayModalProvider, useModal} from '@clayui/modal';
import {
	FormCustomSelect,
	Input,
	Select,
	useForm,
} from '@liferay/object-js-components-web';
import React, {useEffect, useState} from 'react';

import {getObjectDefinitions, save} from '../utils/api';
import {defaultLanguageId} from '../utils/locale';
import {objectRelationshipTypes} from '../utils/objectRelationshipTypes';
import {toCamelCase} from '../utils/string';

const ModalAddObjectRelationship: React.FC<IProps> = ({
	apiURL,
	ffOneToOneRelationshipConfigurationEnabled,
	objectDefinitionId,
	observer,
	onClose,
	system,
}) => {
	const [error, setError] = useState<string>('');

	const [objectDefinitions, setObjectDefinitions] = useState<
		ObjectDefinition[]
	>([]);

	const [
		manyToManyObjectDefinitions,
		setManyToManyObjectDefinitions,
	] = useState<ObjectDefinition[]>([]);

	const [manyToMany, setManyToMany] = useState(false);

	const initialValues: TInitialValues = {
		label: '',
		name: undefined,
		objectDefinitionId2: 0,
		type: {label: '', value: ''},
	};

	const filteredObjectRelationshipTypes = objectRelationshipTypes.filter(
		({value}) => {
			if (!system && !ffOneToOneRelationshipConfigurationEnabled) {
				return value !== 'oneToOne';
			}

			return value === 'oneToMany' || value === 'manyToMany';
		}
	);

	const onSubmit = async ({
		label,
		name,
		objectDefinitionId2,
		type,
	}: TInitialValues) => {
		try {
			await save(
				apiURL,
				{
					label: {[defaultLanguageId]: label},
					name: name || toCamelCase(label),
					objectDefinitionId2,
					type: type.value,
				},
				'POST'
			);

			onClose();
			window.location.reload();
		}
		catch ({message}) {
			setError(message as string);
		}
	};

	const validate = (values: TInitialValues) => {
		const errors: any = {};

		if (!values.label) {
			errors.label = Liferay.Language.get('required');
		}

		if (!(values.name ?? values.label)) {
			errors.name = Liferay.Language.get('required');
		}

		if (!values.type.label || !values.type.value) {
			errors.type = Liferay.Language.get('required');
		}

		if (!values.objectDefinitionId2) {
			errors.objectDefinitionId2 = Liferay.Language.get('required');
		}

		return errors;
	};

	const {errors, handleChange, handleSubmit, setValues, values} = useForm({
		initialValues,
		onSubmit,
		validate,
	});

	useEffect(() => {
		const makeRequest = async () => {
			const items = await getObjectDefinitions();

			const currentObjectDefinition = items.find(
				({id}) => Number(objectDefinitionId) === id
			)!;

			const objectDefinitions = Liferay.FeatureFlags['LPS-135430']
				? items.filter(({storageType}) => storageType === 'default')
				: items;

			let manyToManyObjectDefinitions = objectDefinitions.filter(
				(objectDefinition) =>
					objectDefinition.id !== Number(objectDefinitionId)
			);

			if (currentObjectDefinition.system) {
				manyToManyObjectDefinitions = objectDefinitions.filter(
					(objectDefinition) => !objectDefinition.system
				);
			}

			setManyToManyObjectDefinitions(manyToManyObjectDefinitions);

			const definitions = currentObjectDefinition.system
				? objectDefinitions.filter(({system}) => !system)
				: objectDefinitions;

			setObjectDefinitions(definitions);
		};

		makeRequest();
	}, [objectDefinitionId]);

	return (
		<ClayModal observer={observer}>
			<ClayForm onSubmit={handleSubmit}>
				<ClayModal.Header>
					{Liferay.Language.get('new-relationship')}
				</ClayModal.Header>

				<ClayModal.Body>
					{error && (
						<ClayAlert displayType="danger">{error}</ClayAlert>
					)}

					<Input
						error={errors.label}
						id="objectRelationshipLabel"
						label={Liferay.Language.get('label')}
						name="label"
						onChange={handleChange}
						required
						value={values.label}
					/>

					<Input
						error={errors.name}
						id="objectRelationshipName"
						label={Liferay.Language.get('name')}
						name="name"
						onChange={handleChange}
						required
						value={values.name ?? toCamelCase(values.label)}
					/>

					<FormCustomSelect
						error={errors.type}
						label={Liferay.Language.get('type')}
						onChange={(type) => {
							setValues({type});
							setManyToMany(type.value === 'manyToMany');
						}}
						options={filteredObjectRelationshipTypes}
						required
						value={values.type.label}
					/>

					<Select
						error={errors.objectDefinitionId2}
						id="objectDefinitionId2"
						label={Liferay.Language.get('object')}
						onChange={({target: {value}}: any) => {
							const {id} = manyToMany
								? manyToManyObjectDefinitions[Number(value)]
								: objectDefinitions[Number(value)];

							setValues({objectDefinitionId2: Number(id)});
						}}
						options={
							manyToMany
								? manyToManyObjectDefinitions.map(
										({name}) => name
								  )
								: objectDefinitions.map(({name}) => name)
						}
						required
					/>
				</ClayModal.Body>

				<ClayModal.Footer
					last={
						<ClayButton.Group key={1} spaced>
							<ClayButton
								displayType="secondary"
								onClick={() => onClose()}
							>
								{Liferay.Language.get('cancel')}
							</ClayButton>

							<ClayButton displayType="primary" type="submit">
								{Liferay.Language.get('save')}
							</ClayButton>
						</ClayButton.Group>
					}
				/>
			</ClayForm>
		</ClayModal>
	);
};

interface IProps extends React.HTMLAttributes<HTMLElement> {
	apiURL: string;
	ffOneToManyRelationshipCustomAndNativeObjects: boolean;
	ffOneToOneRelationshipConfigurationEnabled: boolean;
	objectDefinitionId: number;
	observer: any;
	onClose: () => void;
	system: boolean;
}

type TInitialValues = {
	label: string;
	name?: string;
	objectDefinitionId2: number;
	type: {
		label: string;
		value: string;
	};
};

const ModalWithProvider: React.FC<IProps> = ({
	apiURL,
	ffOneToManyRelationshipCustomAndNativeObjects,
	ffOneToOneRelationshipConfigurationEnabled,
	objectDefinitionId,
	system,
}) => {
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const {observer, onClose} = useModal({
		onClose: () => setVisibleModal(false),
	});

	useEffect(() => {
		Liferay.on('addObjectRelationship', () => setVisibleModal(true));

		return () => {
			Liferay.detach('addObjectRelationship');
		};
	}, []);

	return (
		<ClayModalProvider>
			{visibleModal && (
				<ModalAddObjectRelationship
					apiURL={apiURL}
					ffOneToManyRelationshipCustomAndNativeObjects={
						ffOneToManyRelationshipCustomAndNativeObjects
					}
					ffOneToOneRelationshipConfigurationEnabled={
						ffOneToOneRelationshipConfigurationEnabled
					}
					objectDefinitionId={objectDefinitionId}
					observer={observer}
					onClose={onClose}
					system={system}
				/>
			)}
		</ClayModalProvider>
	);
};

export default ModalWithProvider;
