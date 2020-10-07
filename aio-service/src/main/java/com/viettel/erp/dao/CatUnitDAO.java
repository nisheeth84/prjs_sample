/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.erp.dao;

import com.viettel.aio.dto.CatUnitDTO;
import com.viettel.erp.bo.CatUnitBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("AIOcatUnitDAO")
public class CatUnitDAO extends BaseFWDAOImpl<CatUnitBO, Long> {

    public CatUnitDAO() {
        this.model = new CatUnitBO();
    }

    public CatUnitDAO(Session session) {
        this.session = session;
    }

}
