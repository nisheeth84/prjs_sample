/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import com.viettel.coms.bo.AssetManageRequestEntityBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("assetManageRequestEntityDAO")
public class AssetManageRequestEntityDAO extends BaseFWDAOImpl<AssetManageRequestEntityBO, Long> {

	public AssetManageRequestEntityDAO() {
		this.model = new AssetManageRequestEntityBO();
	}

	public AssetManageRequestEntityDAO(Session session) {
		this.session = session;
	}

	public void updateMerentityById(Long merentityId, Long amreId) {
		StringBuilder sql = new StringBuilder("");
		sql.append(" UPDATE ASSET_MANAGE_REQUEST_ENTITY amre ");
		sql.append(" SET ");
		sql.append(" amre.MER_ENTITY_ID =:merentityId ");
		sql.append(" WHERE amre.ASSET_MANAGE_REQUEST_ENTITY_ID =:amreId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("merentityId", merentityId);
		query.setParameter("amreId", amreId);
		query.executeUpdate();
	}

}
