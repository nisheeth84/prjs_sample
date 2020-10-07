/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.coms.bo.IssueHistoryBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("issueHistoryDAO")
public class IssueHistoryDAO extends BaseFWDAOImpl<IssueHistoryBO, Long> {

    public IssueHistoryDAO() {
        this.model = new IssueHistoryBO();
    }

    public IssueHistoryDAO(Session session) {
        this.session = session;
    }

    public String GetListHistory(Long issueId) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT Ih.NEW_VALUE newValue  ");
        sql.append(" from ISSUE_HISTORY Ih where Ih.ISSUE_ID =:id ORDER BY Ih.CREATED_DATE DESC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("newValue", new StringType());
        query.setParameter("id", issueId);
        List<String> l = query.list();
        if (!l.isEmpty()) {
            return l.get(0);
        } else {
            return null;
        }
    }
}
