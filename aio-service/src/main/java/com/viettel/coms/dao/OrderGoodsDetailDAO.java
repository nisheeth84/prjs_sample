/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import com.viettel.coms.bo.OrderGoodsDetailBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("orderGoodsDetailDAO")
public class OrderGoodsDetailDAO extends BaseFWDAOImpl<OrderGoodsDetailBO, Long> {

	public OrderGoodsDetailDAO() {
		this.model = new OrderGoodsDetailBO();
	}

	public OrderGoodsDetailDAO(Session session) {
		this.session = session;
	}

	public void updateQuantityOrderGoodsDetail(Long merentityId, double quantity) {
		StringBuilder sql = new StringBuilder("");
		sql.append(" UPDATE ORDER_GOODS_DETAIL ogd ");
		sql.append(" SET ");
		sql.append(" ogd.QUANTITY =:quantity ");
		sql.append(" WHERE ogd.MER_ENTITY_ID =:merentityId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.setParameter("merentityId", merentityId);
		query.setParameter("quantity", quantity);
		query.executeUpdate();
	}

}
