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

package com.liferay.headless.form.resource.v1_0.test;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.liferay.headless.form.dto.v1_0.Creator;
import com.liferay.headless.form.dto.v1_0.FormPages;
import com.liferay.headless.form.dto.v1_0.FormStructure;
import com.liferay.headless.form.dto.v1_0.SuccessPage;
import com.liferay.petra.function.UnsafeSupplier;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.test.util.GroupTestUtil;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.vulcan.pagination.Pagination;

import io.restassured.RestAssured;
import io.restassured.parsing.Parser;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

import java.net.URL;

import java.util.Date;

import javax.annotation.Generated;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

/**
 * @author Javier Gamarra
 * @generated
 */
@Generated("")
public abstract class BaseFormStructureResourceTestCase {

	@BeforeClass
	public static void setUpClass() {
		RestAssured.defaultParser = Parser.JSON;
	}

	@Before
	public void setUp() throws Exception {
		testGroup = GroupTestUtil.addGroup();

		_resourceURL = new URL("http://localhost:8080/o/headless-form/v1.0");
	}

	@After
	public void tearDown() throws Exception {
		GroupTestUtil.deleteGroup(testGroup);
	}

	@Test
	public void testGetContentSpaceFormStructuresPage() throws Exception {
			Assert.assertTrue(true);
	}
	@Test
	public void testGetFormStructure() throws Exception {
			Assert.assertTrue(true);
	}

	protected Response invokeGetContentSpaceFormStructuresPage( Long contentSpaceId , Pagination pagination ) throws Exception {
		RequestSpecification requestSpecification = _createRequestSpecification();

			return requestSpecification.when(
			).get(
				_resourceURL + "/content-spaces/{content-space-id}/form-structures",
				contentSpaceId 
			);

	}
	protected Response invokeGetFormStructure( Long formStructureId ) throws Exception {
		RequestSpecification requestSpecification = _createRequestSpecification();

			return requestSpecification.when(
			).get(
				_resourceURL + "/form-structures/{form-structure-id}",
				formStructureId
			);

	}

	protected FormStructure randomFormStructure() {
		return new FormStructureImpl() {
			{
contentSpace = RandomTestUtil.randomLong();
dateCreated = RandomTestUtil.nextDate();
dateModified = RandomTestUtil.nextDate();
description = RandomTestUtil.randomString();
id = RandomTestUtil.randomLong();
name = RandomTestUtil.randomString();			}
		};
	}

	protected Group testGroup;

	protected class FormStructureImpl implements FormStructure {

	public String[] getAvailableLanguages() {
				return availableLanguages;
	}

	public void setAvailableLanguages(String[] availableLanguages) {
				this.availableLanguages = availableLanguages;
	}

	@JsonIgnore
	public void setAvailableLanguages(UnsafeSupplier<String[], Throwable> availableLanguagesUnsafeSupplier) {
				try {
					availableLanguages = availableLanguagesUnsafeSupplier.get();
	}
				catch (Throwable t) {
					throw new RuntimeException(t);
	}
	}

	@JsonProperty
	protected String[] availableLanguages;
	public Long getContentSpace() {
				return contentSpace;
	}

	public void setContentSpace(Long contentSpace) {
				this.contentSpace = contentSpace;
	}

	@JsonIgnore
	public void setContentSpace(UnsafeSupplier<Long, Throwable> contentSpaceUnsafeSupplier) {
				try {
					contentSpace = contentSpaceUnsafeSupplier.get();
	}
				catch (Throwable t) {
					throw new RuntimeException(t);
	}
	}

	@JsonProperty
	protected Long contentSpace;
	public Creator getCreator() {
				return creator;
	}

	public void setCreator(Creator creator) {
				this.creator = creator;
	}

	@JsonIgnore
	public void setCreator(UnsafeSupplier<Creator, Throwable> creatorUnsafeSupplier) {
				try {
					creator = creatorUnsafeSupplier.get();
	}
				catch (Throwable t) {
					throw new RuntimeException(t);
	}
	}

	@JsonProperty
	protected Creator creator;
	public Date getDateCreated() {
				return dateCreated;
	}

	public void setDateCreated(Date dateCreated) {
				this.dateCreated = dateCreated;
	}

	@JsonIgnore
	public void setDateCreated(UnsafeSupplier<Date, Throwable> dateCreatedUnsafeSupplier) {
				try {
					dateCreated = dateCreatedUnsafeSupplier.get();
	}
				catch (Throwable t) {
					throw new RuntimeException(t);
	}
	}

	@JsonProperty
	protected Date dateCreated;
	public Date getDateModified() {
				return dateModified;
	}

	public void setDateModified(Date dateModified) {
				this.dateModified = dateModified;
	}

	@JsonIgnore
	public void setDateModified(UnsafeSupplier<Date, Throwable> dateModifiedUnsafeSupplier) {
				try {
					dateModified = dateModifiedUnsafeSupplier.get();
	}
				catch (Throwable t) {
					throw new RuntimeException(t);
	}
	}

	@JsonProperty
	protected Date dateModified;
	public String getDescription() {
				return description;
	}

	public void setDescription(String description) {
				this.description = description;
	}

	@JsonIgnore
	public void setDescription(UnsafeSupplier<String, Throwable> descriptionUnsafeSupplier) {
				try {
					description = descriptionUnsafeSupplier.get();
	}
				catch (Throwable t) {
					throw new RuntimeException(t);
	}
	}

	@JsonProperty
	protected String description;
	public FormPages[] getFormPages() {
				return formPages;
	}

	public void setFormPages(FormPages[] formPages) {
				this.formPages = formPages;
	}

	@JsonIgnore
	public void setFormPages(UnsafeSupplier<FormPages[], Throwable> formPagesUnsafeSupplier) {
				try {
					formPages = formPagesUnsafeSupplier.get();
	}
				catch (Throwable t) {
					throw new RuntimeException(t);
	}
	}

	@JsonProperty
	protected FormPages[] formPages;
	public Long getId() {
				return id;
	}

	public void setId(Long id) {
				this.id = id;
	}

	@JsonIgnore
	public void setId(UnsafeSupplier<Long, Throwable> idUnsafeSupplier) {
				try {
					id = idUnsafeSupplier.get();
	}
				catch (Throwable t) {
					throw new RuntimeException(t);
	}
	}

	@JsonProperty
	protected Long id;
	public String getName() {
				return name;
	}

	public void setName(String name) {
				this.name = name;
	}

	@JsonIgnore
	public void setName(UnsafeSupplier<String, Throwable> nameUnsafeSupplier) {
				try {
					name = nameUnsafeSupplier.get();
	}
				catch (Throwable t) {
					throw new RuntimeException(t);
	}
	}

	@JsonProperty
	protected String name;
	public SuccessPage getSuccessPage() {
				return successPage;
	}

	public void setSuccessPage(SuccessPage successPage) {
				this.successPage = successPage;
	}

	@JsonIgnore
	public void setSuccessPage(UnsafeSupplier<SuccessPage, Throwable> successPageUnsafeSupplier) {
				try {
					successPage = successPageUnsafeSupplier.get();
	}
				catch (Throwable t) {
					throw new RuntimeException(t);
	}
	}

	@JsonProperty
	protected SuccessPage successPage;

	}

	private RequestSpecification _createRequestSpecification() {
		return RestAssured.given(
		).auth(
		).preemptive(
		).basic(
			"test@liferay.com", "test"
		).header(
			"Accept", "application/json"
		).header(
			"Content-Type", "application/json"
		);
	}

	private final static ObjectMapper _inputObjectMapper = new ObjectMapper() {
		{
			setSerializationInclusion(JsonInclude.Include.NON_NULL);
	}
	};
	private final static ObjectMapper _outputObjectMapper = new ObjectMapper();

	private URL _resourceURL;

}