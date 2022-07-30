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

package com.liferay.commerce.tax.engine.fixed.service.base;

import com.liferay.commerce.tax.engine.fixed.model.CommerceTaxFixedRateAddressRel;
import com.liferay.commerce.tax.engine.fixed.service.CommerceTaxFixedRateAddressRelService;
import com.liferay.commerce.tax.engine.fixed.service.CommerceTaxFixedRateAddressRelServiceUtil;
import com.liferay.commerce.tax.engine.fixed.service.persistence.CommerceTaxFixedRateAddressRelFinder;
import com.liferay.commerce.tax.engine.fixed.service.persistence.CommerceTaxFixedRateAddressRelPersistence;
import com.liferay.commerce.tax.engine.fixed.service.persistence.CommerceTaxFixedRatePersistence;
import com.liferay.portal.aop.AopService;
import com.liferay.portal.kernel.dao.db.DB;
import com.liferay.portal.kernel.dao.db.DBManagerUtil;
import com.liferay.portal.kernel.dao.jdbc.SqlUpdate;
import com.liferay.portal.kernel.dao.jdbc.SqlUpdateFactoryUtil;
import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.kernel.module.framework.service.IdentifiableOSGiService;
import com.liferay.portal.kernel.service.BaseServiceImpl;
import com.liferay.portal.kernel.util.PortalUtil;

import java.lang.reflect.Field;

import javax.sql.DataSource;

import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;

/**
 * Provides the base implementation for the commerce tax fixed rate address rel remote service.
 *
 * <p>
 * This implementation exists only as a container for the default service methods generated by ServiceBuilder. All custom service methods should be put in {@link com.liferay.commerce.tax.engine.fixed.service.impl.CommerceTaxFixedRateAddressRelServiceImpl}.
 * </p>
 *
 * @author Alessio Antonio Rendina
 * @see com.liferay.commerce.tax.engine.fixed.service.impl.CommerceTaxFixedRateAddressRelServiceImpl
 * @generated
 */
public abstract class CommerceTaxFixedRateAddressRelServiceBaseImpl
	extends BaseServiceImpl
	implements AopService, CommerceTaxFixedRateAddressRelService,
			   IdentifiableOSGiService {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify or reference this class directly. Use <code>CommerceTaxFixedRateAddressRelService</code> via injection or a <code>org.osgi.util.tracker.ServiceTracker</code> or use <code>CommerceTaxFixedRateAddressRelServiceUtil</code>.
	 */
	@Deactivate
	protected void deactivate() {
		_setServiceUtilService(null);
	}

	@Override
	public Class<?>[] getAopInterfaces() {
		return new Class<?>[] {
			CommerceTaxFixedRateAddressRelService.class,
			IdentifiableOSGiService.class
		};
	}

	@Override
	public void setAopProxy(Object aopProxy) {
		commerceTaxFixedRateAddressRelService =
			(CommerceTaxFixedRateAddressRelService)aopProxy;

		_setServiceUtilService(commerceTaxFixedRateAddressRelService);
	}

	/**
	 * Returns the OSGi service identifier.
	 *
	 * @return the OSGi service identifier
	 */
	@Override
	public String getOSGiServiceIdentifier() {
		return CommerceTaxFixedRateAddressRelService.class.getName();
	}

	protected Class<?> getModelClass() {
		return CommerceTaxFixedRateAddressRel.class;
	}

	protected String getModelClassName() {
		return CommerceTaxFixedRateAddressRel.class.getName();
	}

	/**
	 * Performs a SQL query.
	 *
	 * @param sql the sql query
	 */
	protected void runSQL(String sql) {
		try {
			DataSource dataSource =
				commerceTaxFixedRateAddressRelPersistence.getDataSource();

			DB db = DBManagerUtil.getDB();

			sql = db.buildSQL(sql);
			sql = PortalUtil.transformSQL(sql);

			SqlUpdate sqlUpdate = SqlUpdateFactoryUtil.getSqlUpdate(
				dataSource, sql);

			sqlUpdate.update();
		}
		catch (Exception exception) {
			throw new SystemException(exception);
		}
	}

	private void _setServiceUtilService(
		CommerceTaxFixedRateAddressRelService
			commerceTaxFixedRateAddressRelService) {

		try {
			Field field =
				CommerceTaxFixedRateAddressRelServiceUtil.class.
					getDeclaredField("_service");

			field.setAccessible(true);

			field.set(null, commerceTaxFixedRateAddressRelService);
		}
		catch (ReflectiveOperationException reflectiveOperationException) {
			throw new RuntimeException(reflectiveOperationException);
		}
	}

	@Reference
	protected CommerceTaxFixedRatePersistence commerceTaxFixedRatePersistence;

	@Reference
	protected com.liferay.commerce.tax.engine.fixed.service.
		CommerceTaxFixedRateAddressRelLocalService
			commerceTaxFixedRateAddressRelLocalService;

	protected CommerceTaxFixedRateAddressRelService
		commerceTaxFixedRateAddressRelService;

	@Reference
	protected CommerceTaxFixedRateAddressRelPersistence
		commerceTaxFixedRateAddressRelPersistence;

	@Reference
	protected CommerceTaxFixedRateAddressRelFinder
		commerceTaxFixedRateAddressRelFinder;

	@Reference
	protected com.liferay.counter.kernel.service.CounterLocalService
		counterLocalService;

	@Reference
	protected com.liferay.portal.kernel.service.ClassNameLocalService
		classNameLocalService;

	@Reference
	protected com.liferay.portal.kernel.service.ClassNameService
		classNameService;

	@Reference
	protected com.liferay.portal.kernel.service.ResourceLocalService
		resourceLocalService;

	@Reference
	protected com.liferay.portal.kernel.service.UserLocalService
		userLocalService;

	@Reference
	protected com.liferay.portal.kernel.service.UserService userService;

}