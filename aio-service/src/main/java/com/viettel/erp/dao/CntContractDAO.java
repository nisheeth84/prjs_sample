/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.erp.dao;

import com.viettel.erp.bo.CntContractBO;
import com.viettel.erp.dto.CntContractDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("cntContractDAO")
public class CntContractDAO extends BaseFWDAOImpl<CntContractBO, Long> {

    public CntContractDAO() {
        this.model = new CntContractBO();
    }

    public CntContractDAO(Session session) {
        this.session = session;
    }

    //  Hungnx 130618 start
    public List<CntContractDTO> doSearch(CntContractDTO criteria) {
        StringBuilder stringBuilder = getSelectAllQuery();

        stringBuilder.append(" Where STATUS != 0");
        stringBuilder.append(criteria.getIsSize() ? " AND ROWNUM <=10" : "");
        if (StringUtils.isNotEmpty(criteria.getCode())) {
            stringBuilder.append(" AND (UPPER(CODE) like UPPER(:code) escape '&')");
        }
        if (criteria.getContractType() != null) {
            stringBuilder.append(" AND T1.CONTRACT_TYPE = :contractType");
        }
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(stringBuilder.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("cntContractId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("signDate", new DateType());
        query.addScalar("price", new DoubleType());

        query.setResultTransformer(Transformers.aliasToBean(CntContractDTO.class));

        if (StringUtils.isNotEmpty(criteria.getCode())) {
            query.setParameter("code", "%" + criteria.getCode() + "%");
            queryCount.setParameter("code", "%" + criteria.getCode() + "%");
        }
        if (criteria.getContractType() != null) {
            stringBuilder.append(" AND T1.CONTRACT_TYPE = :contractType");
            query.setParameter("contractType", criteria.getContractType());
            queryCount.setParameter("contractType", criteria.getContractType());
        }
        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1)
                    * criteria.getPageSize().intValue());
            query.setMaxResults(criteria.getPageSize().intValue());
        }
        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public StringBuilder getSelectAllQuery() {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append("T1.CNT_CONTRACT_ID cntContractId ");
        stringBuilder.append(",T1.CODE code ");
        stringBuilder.append(",T1.SIGN_DATE signDate ");
        stringBuilder.append(",T1.PRICE price ");
        stringBuilder.append("FROM CNT_CONTRACT T1 ");
        return stringBuilder;
    }
//  Hungnx 130618 end
}
