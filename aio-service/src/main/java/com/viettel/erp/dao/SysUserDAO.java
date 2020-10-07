/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.erp.dao;

import com.viettel.coms.dto.ConstructionTaskDTO;
import com.viettel.coms.dto.SysUserDetailCOMSDTO;
import com.viettel.coms.utils.ValidateUtils;
import com.viettel.erp.bo.SysUserBO;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
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
@Repository("sysUserDAO")
public class SysUserDAO extends BaseFWDAOImpl<SysUserBO, Long> {

    public SysUserDAO() {
        this.model = new SysUserBO();
    }

    public SysUserDAO(Session session) {
        this.session = session;
    }

    public List<SysUserDTO> getForAutoComplete(SysUserDTO obj) {
        String sql = "SELECT USER_ID userId"
                + " ,LOGIN_NAME loginName"
                + " ,FULL_NAME fullName"
                + " FROM SYS_USER"
                + " WHERE STATUS = '1' ";

        StringBuilder stringBuilder = new StringBuilder(sql);
        obj.setIsSize(true);
        stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=10" : "");
//		System.out.println("TEST + "+ obj +" = "+ obj.getName() + "  " + obj.getAddress());
        stringBuilder.append(StringUtils.isNotEmpty(obj.getName()) ? " AND (upper(LOGIN_NAME) LIKE upper(:loginName)" + (StringUtils.isNotEmpty(obj.getFullName()) ? " OR upper(FULL_NAME) LIKE upper(:fullName)" : "") + ")" : (StringUtils.isNotEmpty(obj.getFullName()) ? "AND upper(FULL_NAME) LIKE upper(:fullName)" : ""));
        stringBuilder.append(" ORDER BY LOGIN_NAME");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("userId", LongType.INSTANCE);
        query.addScalar("loginName", StringType.INSTANCE);
        query.addScalar("fullName", StringType.INSTANCE);

        query.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("loginName", "%" + obj.getName() + "%");
        }

        if (StringUtils.isNotEmpty(obj.getFullName())) {
            query.setParameter("fullName", "%" + obj.getFullName() + "%");
        }

        return query.list();
    }

    public List<SysUserDTO> getForChangePerformerAutocomplete(ConstructionTaskDTO obj, List<String> sysGroupId) {
        StringBuilder sql = new StringBuilder("");
        sql.append(" SELECT  ");
        sql.append(" 	SU.SYS_USER_ID  sysUserId, ");
        sql.append(" 	SU.LOGIN_NAME AS loginName, ");
        sql.append(" 	SU.FULL_NAME AS fullName, ");
        sql.append(" 	SU.EMPLOYEE_CODE AS employeeCode, ");
        sql.append(" 	SU.EMAIL AS email, ");
        sql.append(" 	SU.PHONE_NUMBER AS phoneNumber "
                + " FROM SYS_USER SU"
                + " where  SU.SYS_USER_ID in ( select distinct  task.performer_id  from construction_task task inner join "
                + " detail_month_plan dmp on task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status =1 " 
                + " where task.year = :year and task.month = :month and task.sys_group_id = :sysGroupId and task.type=1 ");
        if (obj.getConstructionId() != null) {
            sql.append(" and construction_id = :constructionId ");
        }

        sql.append(" )");

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(SU.FULL_NAME) LIKE upper(:keySearch) OR upper(SU.LOGIN_NAME) LIKE upper(:keySearch) OR upper(SU.EMAIL) LIKE upper(:keySearch) escape '&')");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(SysUserDetailCOMSDTO.class));
        if (sysGroupId != null) {
            query.setParameter("sysGroupId", sysGroupId.get(0));
        }
        query.setParameter("year", obj.getYear());
        query.setParameter("month", obj.getMonth());
        if (obj.getConstructionId() != null)
            query.setParameter("constructionId", obj.getConstructionId());

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
        }
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        return query.list();
    }

    public List<SysUserDTO> getPerformerForChanging(ConstructionTaskDTO obj, List<String> sysGroupId) {
        // tienth_20180329 START
    	 StringBuilder sql = new StringBuilder("");
         sql.append(" SELECT  ");
         sql.append(" 	SU.SYS_USER_ID  sysUserId, ");
         sql.append(" 	SU.LOGIN_NAME AS loginName, ");
         sql.append(" 	SU.FULL_NAME AS fullName, ");
         sql.append(" 	SU.EMPLOYEE_CODE AS employeeCode, ");
         sql.append(" 	SU.EMAIL AS email, ");
         sql.append(" 	SU.PHONE_NUMBER AS phoneNumber "
                 + " FROM SYS_USER SU "
                 + " where  SU.SYS_USER_ID in ( select distinct  task.performer_id  from construction_task task inner join "
                 + " detail_month_plan dmp on task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status =1 " 
                 + " where task.year = :year and task.month = :month and task.sys_group_id = :sysGroupId and task.type=1 ");
        if (obj.getConstructionId() != null) {
            sql.append(" and construction_id = :constructionId ");
        }

        sql.append(" )");

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(SU.FULL_NAME) LIKE upper(:keySearch) OR upper(SU.LOGIN_NAME) LIKE upper(:keySearch) OR upper(SU.EMAIL) LIKE upper(:keySearch) escape '&')");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(SysUserDetailCOMSDTO.class));
        if (sysGroupId != null) {
            queryCount.setParameter("sysGroupId", sysGroupId.get(0));
            query.setParameter("sysGroupId", sysGroupId.get(0));
        }
        query.setParameter("year", obj.getYear());
        query.setParameter("month", obj.getMonth());
        if (obj.getConstructionId() != null) {
            query.setParameter("constructionId", obj.getConstructionId());
            queryCount.setParameter("constructionId", obj.getConstructionId());
        }

        queryCount.setParameter("year", obj.getYear());
        queryCount.setParameter("month", obj.getMonth());


        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
            queryCount.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
        }
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

}
