/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.wms.dao;

import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.wms.bo.AppParamBO;
import com.viettel.wms.dto.AppParamDTO;
import com.viettel.wms.utils.ValidateUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
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
@Repository("appParamDAO")
public class AppParamDAO extends BaseFWDAOImpl<AppParamBO, Long> {

    public AppParamDAO() {
        this.model = new AppParamBO();
    }

    public AppParamDAO(Session session) {
        this.session = session;
    }


    @SuppressWarnings("unchecked")
    public List<AppParamDTO> doSearch(AppParamDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT APP_PARAM_ID appParamId,"
                + "CREATED_BY createdBy,"
                + "CREATED_DATE createdDate,"
                + "CODE code,"
                + "NAME name,"
                + "PAR_TYPE parType,"
                + "PAR_ORDER parOrder,"
                + "STATUS status, "
                + " DESCRIPTION description"
                + " FROM CAT_OWNER.APP_PARAM WHERE 1=1 AND CODE NOT IN  ('20')");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (upper(CODE) LIKE upper(:keySearch) OR upper(NAME) LIKE upper(:keySearch) escape '&')");
        }

        if (StringUtils.isNotEmpty(obj.getStatus()) && !"2".equals(obj.getStatus())) {
            sql.append(" AND STATUS = :status");
        }

        if (StringUtils.isNotEmpty(obj.getParType())) {
            sql.append(" AND upper(PAR_TYPE)  like upper(:parType)");
        }

        sql.append(" ORDER BY PAR_TYPE");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("appParamId", new LongType());
        query.addScalar("createdBy", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("parType", new StringType());
        query.addScalar("parOrder", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("description", new StringType());


        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
            queryCount.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
        }
        if (StringUtils.isNotEmpty(obj.getStatus()) && !"2".equals(obj.getStatus())) {
            query.setParameter("status", obj.getStatus());
            queryCount.setParameter("status", obj.getStatus());
        }

        if (StringUtils.isNotEmpty(obj.getParType())) {
            query.setParameter("parType", "%" + obj.getParType() + "%");
            queryCount.setParameter("parType", "%" + obj.getParType() + "%");
        }

        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }


    public AppParamDTO getbycodeAndParType(String code, String parType) {
        StringBuilder sql = new StringBuilder("SELECT APP_PARAM_ID appParamId,"
                + "CODE code,"
                + "NAME name,"
                + "PAR_TYPE parType,"
                + "PAR_ORDER parOrder,"
                + "STATUS status "
                + " FROM CAT_OWNER.APP_PARAM WHERE STATUS=1 and upper(CODE)=upper(:code) and upper(PAR_TYPE)=upper(:parType)");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("appParamId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("parType", new StringType());
        query.addScalar("parOrder", new StringType());
        query.addScalar("status", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));

        query.setParameter("code", code);
        query.setParameter("parType", parType);

        return (AppParamDTO) query.uniqueResult();
    }


    @SuppressWarnings("unchecked")
    public List<AppParamDTO> getAll(String status) {
        StringBuilder sql = new StringBuilder("SELECT APP_PARAM_ID appParamId,"
                + "CODE code,"
                + "NAME name,"
                + "PAR_TYPE parType,"
                + "PAR_ORDER parOrder,"
                + "STATUS status "
                + " FROM CAT_OWNER.APP_PARAM WHERE upper(STATUS)=upper(:status)");
        SQLQuery query = getSession().createSQLQuery(sql.toString());


        query.addScalar("appParamId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("parType", new StringType());
        query.addScalar("parOrder", new StringType());
        query.addScalar("status", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));

        query.setParameter("status", status);

        return query.list();
    }


    @SuppressWarnings("unchecked")
    public List<AppParamDTO> getForComboBox(AppParamDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT COA.APP_PARAM_ID appParamId,"
                + "COA.CODE code, "
                + "COA.NAME name, "
                + "COA.PAR_TYPE parType, "
                + "COA.PAR_ORDER parOrder "
                + "FROM CAT_OWNER.APP_PARAM COA WHERE 1=1 AND COA.CODE NOT IN  ('20')");
        if (StringUtils.isNotEmpty(obj.getStatus())) {
            sql.append(" AND STATUS = :status ");
        }

        if (StringUtils.isNotEmpty(obj.getParType())) {
            sql.append(" AND upper(COA.PAR_TYPE)=upper(:parType) ");
        }
        sql.append(" ORDER BY COA.PAR_ORDER ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("appParamId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("parType", new StringType());
        query.addScalar("parOrder", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));

        if (StringUtils.isNotEmpty(obj.getStatus())) {
            query.setParameter("status", obj.getStatus());
        }

        if (StringUtils.isNotEmpty(obj.getParType())) {
            query.setParameter("parType", obj.getParType());
        }

        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<AppParamDTO> getForComboBox1(AppParamDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT COA.APP_PARAM_ID appParamId,"
                + "COA.CODE code, "
                + "COA.NAME name, "
                + "COA.PAR_TYPE parType, "
                + "COA.PAR_ORDER parOrder "
                + "FROM CAT_OWNER.APP_PARAM COA WHERE STATUS=1 AND COA.PAR_TYPE='STOCK_TYPE'");

        sql.append(" ORDER BY COA.PAR_TYPE ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("appParamId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("parType", new StringType());
        query.addScalar("parOrder", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));


        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<AppParamDTO> getForAutoComplete(AppParamDTO obj) {
        String sql = "SELECT SC.APP_PARAM_ID appParamId"
                + " ,SC.NAME name"
                + " ,SC.CODE code"
                + " FROM CAT_OWNER.APP_PARAM SC"
                + " WHERE 1=1  ";

        StringBuilder stringBuilder = new StringBuilder(sql);


        if (obj.getIsSize()) {
            stringBuilder.append(" AND ROWNUM <=10 ");
            if (StringUtils.isNotEmpty(obj.getName())) {
                stringBuilder.append(" AND (upper(SC.NAME) LIKE upper(:name) escape '&' OR upper(SC.CODE) LIKE upper(:value) escape '&')");
            }
        } else {
            if (StringUtils.isNotEmpty(obj.getName())) {
                stringBuilder.append(" AND upper(SC.NAME) LIKE upper(:name) escape '&'");
            }
            if (StringUtils.isNotEmpty(obj.getCode())) {
                stringBuilder.append(" AND upper(SC.CODE) LIKE upper(:value) escape '&'");
            }
        }

        stringBuilder.append(" ORDER BY SC.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("appParamId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
        }
        if (StringUtils.isNotEmpty(obj.getCode())) {
            query.setParameter("value", "%" + ValidateUtils.validateKeySearch(obj.getCode()) + "%");
        }

        return query.list();
    }


    @SuppressWarnings("unchecked")
    public List<AppParamDTO> getFileDrop() {
        //Hieunn
        //get list filedrop form APP_PARAM with PAR_TYPE = 'SHIPMENT_DOCUMENT_TYPE' and Status=1
        String sql = "SELECT ap.APP_PARAM_ID appParamId"
                + " ,ap.NAME name"
                + " ,ap.CODE code"
                + " FROM CAT_OWNER.APP_PARAM ap"
                + " WHERE ap.STATUS = 1 AND ap.PAR_TYPE = 'SHIPMENT_DOCUMENT_TYPE' ";

        StringBuilder stringBuilder = new StringBuilder(sql);

        stringBuilder.append(" ORDER BY ap.APP_PARAM_ID");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("appParamId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));
        return query.list();
    }

    public String getCode(String tableName, String param) {
        return "";

    }


}
