/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.wms.dao;

import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.wms.bo.ObjectReferenceDetailBO;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("objectReferenceDetailDAO")
public class ObjectReferenceDetailDAO extends BaseFWDAOImpl<ObjectReferenceDetailBO, Long> {

    public ObjectReferenceDetailDAO() {
        this.model = new ObjectReferenceDetailBO();
    }

    public ObjectReferenceDetailDAO(Session session) {
        this.session = session;
    }


}
