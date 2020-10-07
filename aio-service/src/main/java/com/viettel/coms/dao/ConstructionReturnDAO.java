/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.coms.bo.ConstructionReturnBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 * @author chinhpxn
 * @version 1.0
 * @since 20180620
 */
@Repository("constructionReturnDAO")
public class ConstructionReturnDAO extends BaseFWDAOImpl<ConstructionReturnBO, Long> {

    public ConstructionReturnDAO() {
        this.model = new ConstructionReturnBO();
    }

    public ConstructionReturnDAO(Session session) {
        this.session = session;
    }

}
