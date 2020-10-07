/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.coms.bo.ConfigGroupProvinceBO;
import com.viettel.coms.dto.ConfigGroupProvinceDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
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
@Repository("configGroupProvinceDAO")
public class ConfigGroupProvinceDAO extends BaseFWDAOImpl<ConfigGroupProvinceBO, Long> {

    public ConfigGroupProvinceDAO() {
        this.model = new ConfigGroupProvinceBO();
    }

    public ConfigGroupProvinceDAO(Session session) {
        this.session = session;
    }

    public List<ConfigGroupProvinceDTO> getCatProvince() {
        StringBuilder sql = new StringBuilder();
        sql.append(
                " select cat.code catProvinceCode ,cat.NAME catProvinceName, cat.CAT_PROVINCE_ID catProvinceId from CAT_PROVINCE cat where cat.STATUS = 1 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("catProvinceName", new StringType());
        query.addScalar("catProvinceId", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(ConfigGroupProvinceDTO.class));
        return query.list();
    }

    public List<ConfigGroupProvinceDTO> doSearchCatprovince(ConfigGroupProvinceDTO obj) {
        StringBuilder sql = new StringBuilder("");
        sql.append(
                " SELECT a.SYS_GROUP_ID sysGroupId , a.SYS_GROUP_NAME sysGroupName , LISTAGG(a.CAT_PROVINCE_CODE,' , ') WITHIN GROUP (ORDER BY a.SYS_GROUP_ID) catProvinceCode  ");
        sql.append(" 	FROM CONFIG_GROUP_PROVINCE a ");
        sql.append(" 	where 1=1 ");
        if (obj.getSysGroupId() != null) {
            sql.append(" AND a.SYS_GROUP_ID =:sysGroupId ");
        }
        sql.append(" 	GROUP BY (a.SYS_GROUP_ID ,a.SYS_GROUP_NAME) ");

        /*
         * if (StringUtils.isNotEmpty(obj.getWorkItemCodeorType())) {
         * sql.append(" AND (WORK_ITEM.CODE like :workItemCodeorType)"); }
         */

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("sysGroupId", new LongType());
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
        }
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));

        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public void DeleteCon(Long sysGroupId) {
        StringBuilder sql = new StringBuilder("DELETE FROM CONFIG_GROUP_PROVINCE  con WHERE con.SYS_GROUP_ID =:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", sysGroupId);
        query.executeUpdate();
    }

    public List<ConfigGroupProvinceDTO> getListCode(Long id) {
        StringBuilder sql = new StringBuilder(
                " SELECT con.CAT_PROVINCE_CODE catProvinceCode,con.CAT_PROVINCE_ID catProvinceId ,con.CAT_PROVINCE_NAME catProvinceName  FROM CONFIG_GROUP_PROVINCE con where con.SYS_GROUP_ID=:id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("catProvinceName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConfigGroupProvinceDTO.class));
        return query.list();
    }

}
