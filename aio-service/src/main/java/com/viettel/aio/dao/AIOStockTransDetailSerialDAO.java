/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.aio.dao;

import com.viettel.aio.bo.StockTransDetailSerialBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 * @author HOANM1
 * @version 1.0
 * @since 2019-03-10
 */
@Repository("aioStockTransDetailSerialDAO")
public class AIOStockTransDetailSerialDAO extends BaseFWDAOImpl<StockTransDetailSerialBO, Long> {

    public AIOStockTransDetailSerialDAO() {
        this.model = new StockTransDetailSerialBO();
    }

    public AIOStockTransDetailSerialDAO(Session session) {
        this.session = session;
    }
}
