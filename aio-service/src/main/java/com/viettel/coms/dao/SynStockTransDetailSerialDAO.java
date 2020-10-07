/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.coms.bo.SynStockTransDetailSerialBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("synStockTransDetailSerialDAO")
public class SynStockTransDetailSerialDAO extends BaseFWDAOImpl<SynStockTransDetailSerialBO, Long> {

    public SynStockTransDetailSerialDAO() {
        this.model = new SynStockTransDetailSerialBO();
    }

    public SynStockTransDetailSerialDAO(Session session) {
        this.session = session;
    }
}
