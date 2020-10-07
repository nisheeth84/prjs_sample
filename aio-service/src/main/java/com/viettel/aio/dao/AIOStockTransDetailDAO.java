/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.aio.dao;

import com.viettel.aio.bo.StockTransDetailBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 * @author HOANM1
 * @version 1.0
 * @since 2019-03-10
 */
@Repository("aioStockTransDetailDAO")
public class AIOStockTransDetailDAO extends BaseFWDAOImpl<StockTransDetailBO, Long> {

    public AIOStockTransDetailDAO() {
        this.model = new StockTransDetailBO();
    }

    public AIOStockTransDetailDAO(Session session) {
        this.session = session;
    }
}
