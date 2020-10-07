/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import com.viettel.coms.bo.OrderGoodsBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("orderGoodsDAO")
public class OrderGoodsDAO extends BaseFWDAOImpl<OrderGoodsBO, Long> {

	public OrderGoodsDAO() {
		this.model = new OrderGoodsBO();
	}

	public OrderGoodsDAO(Session session) {
		this.session = session;
	}

	public void updateTotalPrice(Long orderGoodsId, double amount, double totalPrice) {
		StringBuilder sql = new StringBuilder("");
		sql.append(" UPDATE ORDER_GOODS og ");
		sql.append(" SET ");
		sql.append(" og.AMOUNT =:amount, ");
		sql.append(" og.TOTAL_PRICE =:totalPrice ");
		sql.append(" WHERE og.ORDER_GOODS_ID =:orderGoodsId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("orderGoodsId", orderGoodsId);
		query.setParameter("amount", amount);
		query.setParameter("totalPrice", totalPrice);
		query.executeUpdate();
	}

}
