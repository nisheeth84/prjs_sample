/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.coms.bo.OrdersBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("ordersDAO")
public class OrdersDAO extends BaseFWDAOImpl<OrdersBO, Long> {

    public OrdersDAO() {
        this.model = new OrdersBO();
    }

    public OrdersDAO(Session session) {
        this.session = session;
    }
}
