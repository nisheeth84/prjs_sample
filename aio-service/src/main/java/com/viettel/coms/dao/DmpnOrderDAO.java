/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.coms.bo.DmpnOrderBO;
import com.viettel.coms.dto.ConstructionTaskDetailDTO;
import com.viettel.coms.dto.DmpnOrderDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.wms.utils.ValidateUtils;
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
import java.util.ArrayList;
import java.util.List;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("dmpnOrderDAO")
public class DmpnOrderDAO extends BaseFWDAOImpl<DmpnOrderBO, Long> {

    public DmpnOrderDAO() {
        this.model = new DmpnOrderBO();
    }

    public DmpnOrderDAO(Session session) {
        this.session = session;
    }

    public List<DmpnOrderDTO> doSearchForDetailMonth(ConstructionTaskDetailDTO obj) {
        // TODO Auto-generated method stub
        if (obj.getDetailMonthPlanId() == null) {
            return new ArrayList<DmpnOrderDTO>();
        }
        StringBuilder sql = new StringBuilder(
                "SELECT dmpn_order_id dmpnOrderId, goods_code goodsCode, goods_name goodsName, unit_name unitName, quantity quantity, ");
        sql.append(" created_user_Id createdUserId,created_group_id createdGroupId, created_date createdDate, ");
        sql.append("DESCRIPTION description");
        sql.append(" FROM dmpn_order where DETAIL_MONTH_PLAN_ID = :id ");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(goods_code) LIKE upper(:keySearch) OR  upper(goods_name) LIKE upper(:keySearch) OR upper(quantity) LIKE upper(:keySearch) escape '&')");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
            queryCount.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
        }
        query.addScalar("goodsCode", new StringType());
        query.addScalar("dmpnOrderId", new LongType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("unitName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("description", new StringType());
        query.setParameter("id", obj.getDetailMonthPlanId());
        queryCount.setParameter("id", obj.getDetailMonthPlanId());
        query.setResultTransformer(Transformers.aliasToBean(DmpnOrderDTO.class));
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<DmpnOrderDTO> getDataForYCVT() {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT code goodsCode, name goodsName FROM goods where 1=1 and status = 1");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(DmpnOrderDTO.class));
        return query.list();
    }

    public DmpnOrderDTO getOrderByCode(String goodsCode) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT goods_id goodsId, code goodsCode, name goodsName FROM goods where 1=1 and status = 1 and code = :code");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("code", goodsCode);
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsId", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(DmpnOrderDTO.class));
        DmpnOrderDTO dto = new DmpnOrderDTO();
        List<DmpnOrderDTO> res = query.list();
        if (res != null && !res.isEmpty()) {
            dto = res.get(0);
        }
        return dto;
    }

    public DmpnOrderDTO getCatUnitByName(String unitName) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT CAT_UNIT_ID catUnitId, name unitName FROM CAT_UNIT where 1=1 and status = 1 and name = :unitName");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("unitName", unitName);
        query.addScalar("unitName", new StringType());
        query.addScalar("catUnitId", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(DmpnOrderDTO.class));
        DmpnOrderDTO dto = new DmpnOrderDTO();
        List<DmpnOrderDTO> res = query.list();
        if (res != null && !res.isEmpty()) {
            dto = res.get(0);
        }
        return dto;
    }

    public void removeByListId(List<String> listConstrTaskIdDelete) {
        StringBuilder sql = new StringBuilder("DELETE FROM dmpn_order  where dmpn_order_id in :listConstrTaskIdDelete");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameterList("listConstrTaskIdDelete", listConstrTaskIdDelete);
        query.executeUpdate();

    }

    public void removeByDetailPlanId(Long detailMonthPlanId) {
        StringBuilder sql = new StringBuilder(
                "DELETE FROM dmpn_order  where DETAIL_MONTH_PLAN_ID = :detailMonthPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.executeUpdate();

    }

    public List<DmpnOrderDTO> getDVTForYCVT() {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "Select code unitCode, name unitName FROM CAT_UNIT where 1=1 and status = 1 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("unitName", new StringType());
        query.addScalar("unitCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(DmpnOrderDTO.class));
        return query.list();
    }

    public DmpnOrderDTO getCatUnitByCode(String code) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT CAT_UNIT_ID catUnitId, name unitName FROM CAT_UNIT where 1=1 and status = 1 and code = :code");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("code", code);
        query.addScalar("unitName", new StringType());
        query.addScalar("catUnitId", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(DmpnOrderDTO.class));
        DmpnOrderDTO dto = new DmpnOrderDTO();
        List<DmpnOrderDTO> res = query.list();
        if (res != null && !res.isEmpty()) {
            dto = res.get(0);
        }
        return dto;
    }
}
