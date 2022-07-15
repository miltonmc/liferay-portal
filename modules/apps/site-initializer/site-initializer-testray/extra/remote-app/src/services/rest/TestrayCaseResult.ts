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

import {APIResponse, TestrayCaseResult} from '../../graphql/queries';

const caseResultResource =
	'/caseresults?nestedFields=case,component.team,build.productVersion,build.routine,run,user&nestedFieldsDepth=3';

const normalizeCaseResultResponse = (caseResult: TestrayCaseResult) => ({
	...caseResult,
	build: caseResult.r_buildToCaseResult_c_build
		? {
				...caseResult.r_buildToCaseResult_c_build,
				productVersion:
					caseResult.r_buildToCaseResult_c_build
						.r_productVersionToBuilds_c_productVersion,
				routine:
					caseResult.r_buildToCaseResult_c_build
						.r_routineToBuilds_c_routine,
		  }
		: null,
	case: caseResult.r_caseToCaseResult_c_case
		? {
				...caseResult.r_caseToCaseResult_c_case,
				caseType:
					caseResult.r_caseToCaseResult_c_case
						.r_caseTypeToCases_c_caseType,
				component:
					caseResult.r_caseToCaseResult_c_case
						.r_componentToCases_c_component,
		  }
		: null,
	component: caseResult.r_componentToCaseResult_c_component
		? {
				...caseResult.r_componentToCaseResult_c_component,
				team:
					caseResult.r_componentToCaseResult_c_component
						.r_teamToComponents_c_team,
		  }
		: null,
	run: caseResult.r_runToCaseResult_c_run,
	user: caseResult.r_userToCaseResults_user,
});

const getCaseResultTransformData = (
	response: APIResponse<TestrayCaseResult>
) => ({
	...response,
	items: response?.items?.map(normalizeCaseResultResponse),
});

export {caseResultResource, getCaseResultTransformData};
