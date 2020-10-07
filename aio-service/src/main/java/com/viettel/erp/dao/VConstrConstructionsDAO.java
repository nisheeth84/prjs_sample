/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.erp.dao;

import com.google.common.base.Joiner;
import com.viettel.erp.bo.VConstrConstructionsBO;
import com.viettel.erp.dto.VConstrConstructionsSearchDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("vConstrConstructionsDAO")
public class VConstrConstructionsDAO extends BaseFWDAOImpl<VConstrConstructionsBO, Long> {

    public VConstrConstructionsDAO() {
        this.model = new VConstrConstructionsBO();
    }

    public VConstrConstructionsDAO(Session session) {
        this.session = session;
    }

    public List<VConstrConstructionsBO> getAllandSearch(VConstrConstructionsSearchDTO dto) {

        Query q = getSession().createQuery(Joiner.on(" ").join("from v_constructions_hcqt p where 1=1 ",
                // StringUtils.isNotEmpty(dto.getContractNo()) ? " and
                // p.batchName like :batchName" : "",
                StringUtils.isNotEmpty(dto.getConstrtCode()) ? " and p.constrtCode like :constrtCode" : ""));

        if (StringUtils.isNotEmpty(dto.getConstrtCode())) {
            q.setParameter("constrtCode", "%" + dto.getConstrtCode() + "%");
        }
        q.setMaxResults(200);
        return q.setCacheable(true).list();
    }


}
