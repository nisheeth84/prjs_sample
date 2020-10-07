/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.asset.dto.BaseWsRequest;
import com.viettel.coms.bo.SysUserCOMSBO;
import com.viettel.coms.dto.DomainDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.coms.dto.SysUserDetailCOMSDTO;
import com.viettel.coms.dto.SysUserRequest;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.wms.utils.ValidateUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("sysUserwmsDAO")
public class SysUserCOMSDAO extends BaseFWDAOImpl<SysUserCOMSBO, Long> {

    @Autowired
    ConstructionTaskDAO constructionTaskDao;

    public SysUserCOMSDAO() {
        this.model = new SysUserCOMSBO();
    }

    public SysUserCOMSDAO(Session session) {
        this.session = session;
    }

    @SuppressWarnings("unchecked")
    public List<SysUserCOMSDTO> users(SysUserCOMSDTO obj) {

        StringBuilder sql = new StringBuilder("SELECT o.LOGIN_NAME loginName, " + "o.EMPLOYEE_CODE employeeCode, "
                + "o.FULL_NAME fullName, " + "o.EMAIL email, " + "o.SYS_USER_ID sysUserId, " + "s.NAME sysGroupName, "
                + "o.PHONE_NUMBER phoneNumber " + "FROM CTCT_VPS_OWNER.\"SYS_USER\" o "
                + "LEFT JOIN SYS_GROUP s ON s.SYS_GROUP_ID = o.SYS_GROUP_ID");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));

        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<SysUserCOMSDTO> usersFillter(List<String> sysGroupId) {
        if (sysGroupId == null)
            return new ArrayList<SysUserCOMSDTO>();
        StringBuilder sql = new StringBuilder("SELECT o.LOGIN_NAME loginName, " + "o.EMPLOYEE_CODE employeeCode, "
                + "o.FULL_NAME fullName, " + "o.EMAIL email, " + "o.SYS_USER_ID sysUserId, " + "s.NAME sysGroupName, "
                + "o.PHONE_NUMBER phoneNumber " + "FROM CTCT_VPS_OWNER.\"SYS_USER\" o "
                + "INNER JOIN SYS_GROUP s ON s.SYS_GROUP_ID = o.SYS_GROUP_ID "
                + " where (case when s.group_level=4 then (select sys_group_id from sys_group b where b.sys_group_id= "
                + " (select parent_id from sys_group c where c.sys_group_id=s.parent_id)) "
                + " when s.group_level=3 then (select sys_group_id from sys_group b where b.sys_group_id=s.parent_id) "
                + " else s.sys_group_id end) in :sysGroupId");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        query.setParameterList("sysGroupId", sysGroupId);

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(SysUserDetailCOMSDTO.class));

        return query.list();
    }

    public List<SysUserCOMSDTO> usersDropdown(SysUserCOMSDTO obj) {

        StringBuilder sql = new StringBuilder("SELECT o.LOGIN_NAME loginName, " + "o.EMPLOYEE_CODE employeeCode, "
                + "o.FULL_NAME fullName, " + "o.EMAIL email, " + "o.SYS_USER_ID sysUserId, "
                + "o.PHONE_NUMBER phoneNumber " + "FROM CTCT_VPS_OWNER.\"SYS_USER\" o ");

        StringBuilder stringBuilder = new StringBuilder(sql);

        if (StringUtils.isNotEmpty(obj.getName())) {
            stringBuilder.append(" WHERE upper(o.LOGIN_NAME) LIKE upper(:name) escape '&'");
        }

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));

        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
        }
        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<SysUserCOMSDTO> getSuppervisorAutoComplete(SysUserCOMSDTO obj) {
        String sql = "SELECT distinct su.SYS_USER_ID sysUserId " + " ,su.LOGIN_NAME loginName "
                + " ,su.EMPLOYEE_CODE employeeCode, "
                + " (CASE WHEN  su.PHONE_NUMBER is null THEN su.FULL_NAME ELSE su.FULL_NAME ||'-'|| su.PHONE_NUMBER END) fullName "
                + " FROM CTCT_VPS_OWNER.SYS_USER su , " + " CTCT_VPS_OWNER.USER_ROLE b, "
                + "CTCT_VPS_OWNER.SYS_ROLE c, " + "CTCT_VPS_OWNER.USER_ROLE_DATA d, " + "CTCT_VPS_OWNER.DOMAIN_DATA e, "
                + " CTCT_VPS_OWNER.DOMAIN_TYPE g " + " WHERE su.STATUS=1  " + "AND su.SYS_USER_ID =b.SYS_USER_ID "
                + "AND b.SYS_ROLE_ID   =c.SYS_ROLE_ID " + " AND c.CODE          ='COMS_GOVERNOR' "
                + "AND b.USER_ROLE_ID  =d.USER_ROLE_ID " + " AND d.DOMAIN_DATA_ID=e.DOMAIN_DATA_ID "
                + " AND e.DOMAIN_TYPE_ID=g.DOMAIN_TYPE_ID " + "AND g.code          ='KTTS_LIST_PROVINCE'";

        StringBuilder stringBuilder = new StringBuilder(sql);
        stringBuilder.append(" AND ROWNUM <=10 ");
        if (StringUtils.isNotEmpty(obj.getFullName())) {
            stringBuilder.append(
                    " AND upper(su.FULL_NAME) LIKE upper(:fullName) escape '&' OR upper(su.EMPLOYEE_CODE) LIKE upper(:value) escape '&')");
        }
        if (StringUtils.isNotEmpty(obj.getName())) {
            stringBuilder.append(
                    " AND (upper(su.FULL_NAME) LIKE upper(:name) escape '&' OR upper(su.EMPLOYEE_CODE) LIKE upper(:name) escape '&')");
        }

        stringBuilder.append(" ORDER BY su.EMPLOYEE_CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("fullName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
        }
        if (StringUtils.isNotEmpty(obj.getFullName())) {
            query.setParameter("fullName", "%" + ValidateUtils.validateKeySearch(obj.getFullName()) + "%");
        }

        return query.list();
    }

    // tìm kiếm autoComple PGD chuyên trách
    @SuppressWarnings("unchecked")
    public List<SysUserCOMSDTO> getDirectorAutoComplete(SysUserCOMSDTO obj) {
        String sql = "SELECT distinct su.SYS_USER_ID sysUserId " + " ,su.LOGIN_NAME loginName "
                + " ,su.EMPLOYEE_CODE employeeCode, "
                + " (CASE WHEN  su.PHONE_NUMBER is null THEN su.FULL_NAME ELSE su.FULL_NAME ||'-'|| su.PHONE_NUMBER END) fullName "
                + " FROM CTCT_VPS_OWNER.SYS_USER su , " + " CTCT_VPS_OWNER.USER_ROLE b, "
                + "CTCT_VPS_OWNER.SYS_ROLE c, " + "CTCT_VPS_OWNER.USER_ROLE_DATA d, " + "CTCT_VPS_OWNER.DOMAIN_DATA e, "
                + " CTCT_VPS_OWNER.DOMAIN_TYPE g " + " WHERE su.STATUS=1  " + "AND su.SYS_USER_ID =b.SYS_USER_ID "
                + "AND b.SYS_ROLE_ID   =c.SYS_ROLE_ID " + " AND c.CODE          ='COMS_GOVERNOR' "
                + "AND b.USER_ROLE_ID  =d.USER_ROLE_ID " + " AND d.DOMAIN_DATA_ID=e.DOMAIN_DATA_ID "
                + " AND e.DOMAIN_TYPE_ID=g.DOMAIN_TYPE_ID " + "AND g.code          ='KTTS_LIST_PROVINCE'";

        StringBuilder stringBuilder = new StringBuilder(sql);
        stringBuilder.append(" AND ROWNUM <=10 ");
        if (StringUtils.isNotEmpty(obj.getFullName())) {
            stringBuilder.append(
                    " AND upper(su.FULL_NAME) LIKE upper(:fullName) escape '&' OR upper(su.EMPLOYEE_CODE) LIKE upper(:value) escape '&')");
        }
        if (StringUtils.isNotEmpty(obj.getName())) {
            stringBuilder.append(
                    " AND (upper(su.FULL_NAME) LIKE upper(:name) escape '&' OR upper(su.EMPLOYEE_CODE) LIKE upper(:name) escape '&')");
        }

        stringBuilder.append(" ORDER BY su.EMPLOYEE_CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("fullName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
        }
        if (StringUtils.isNotEmpty(obj.getFullName())) {
            query.setParameter("fullName", "%" + ValidateUtils.validateKeySearch(obj.getFullName()) + "%");
        }

        return query.list();
    }

    // tim kiem autoComplete tỉnh trưởng
    @SuppressWarnings("unchecked")
    public List<SysUserCOMSDTO> getForAutoComplete(SysUserCOMSDTO obj) {
        String sql = "SELECT su.SYS_USER_ID sysUserId" + " ,su.LOGIN_NAME loginName"
                + " ,su.EMPLOYEE_CODE employeeCode,"
                + " (CASE WHEN  su.PHONE_NUMBER is null THEN su.FULL_NAME ELSE su.FULL_NAME ||'-'|| su.PHONE_NUMBER END) fullName"
                + " FROM CTCT_VPS_OWNER.SYS_USER su" + " WHERE su.STATUS=1 ";

        StringBuilder stringBuilder = new StringBuilder(sql);
        stringBuilder.append(" AND ROWNUM <=10 ");
        if (StringUtils.isNotEmpty(obj.getFullName())) {
            stringBuilder.append(
                    " AND upper(su.FULL_NAME) LIKE upper(:fullName) escape '&' OR upper(su.EMPLOYEE_CODE) LIKE upper(:value) escape '&')");
        }
        if (StringUtils.isNotEmpty(obj.getName())) {
            stringBuilder.append(
                    " AND (upper(su.FULL_NAME) LIKE upper(:name) escape '&' OR upper(su.EMPLOYEE_CODE) LIKE upper(:name) escape '&')");
        }

        stringBuilder.append(" ORDER BY su.EMPLOYEE_CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("fullName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
        }
        if (StringUtils.isNotEmpty(obj.getFullName())) {
            query.setParameter("fullName", "%" + ValidateUtils.validateKeySearch(obj.getFullName()) + "%");
        }

        return query.list();
    }

    //		Tìm kiếm người dùng trong popup
    @SuppressWarnings("unchecked")
    public List<SysUserCOMSDTO> doSearchUserInPopup(SysUserCOMSDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT o.LOGIN_NAME loginName, " + "o.EMPLOYEE_CODE employeeCode, "
                + "o.FULL_NAME fullName, " + "o.EMAIL email, " + "o.SYS_USER_ID sysUserId, "
                + "o.PHONE_NUMBER phoneNumber " + "FROM SYS_USER o ");

        if (StringUtils.isNotEmpty(obj.getName())) {
            sql.append(
                    " WHERE upper(o.FULL_NAME) LIKE upper(:name) escape '&' OR upper(o.EMPLOYEE_CODE) LIKE upper(:name) escape '&' " +
                            //VietNT_20190102_start
                            "OR upper(o.EMAIL) like upper(:name) escape '&' ");
                            //VietNT_end
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
            queryCount.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
        }
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    //		Tìm kiếm tỉnh trưởng trong popup
    @SuppressWarnings("unchecked")
    public List<SysUserCOMSDTO> doSearchSuppervisorInPopup(SysUserCOMSDTO obj) {
        if (StringUtils.isEmpty(obj.getConstructionCode())) {
            return new ArrayList<SysUserCOMSDTO>();
        }
        StringBuilder sql = new StringBuilder("SELECT o.LOGIN_NAME loginName, " + "o.EMPLOYEE_CODE employeeCode, "
                + "o.FULL_NAME fullName, " + "o.EMAIL email, " + "o.SYS_USER_ID sysUserId, "
                + "o.PHONE_NUMBER phoneNumber "
                + "FROM CTCT_VPS_OWNER.SYS_USER o , CTCT_VPS_OWNER.USER_ROLE b, CTCT_VPS_OWNER.SYS_ROLE c,CTCT_VPS_OWNER.USER_ROLE_DATA d,CTCT_VPS_OWNER.DOMAIN_DATA e,CTCT_VPS_OWNER.DOMAIN_TYPE g "
                + "WHERE o.SYS_USER_ID =b.SYS_USER_ID " + "AND b.SYS_ROLE_ID   =c.SYS_ROLE_ID "
                + "AND c.CODE          ='COMS_GOVERNOR' " + "AND b.USER_ROLE_ID  =d.USER_ROLE_ID "
                + "AND d.DOMAIN_DATA_ID=e.DOMAIN_DATA_ID " + "AND e.DOMAIN_TYPE_ID=g.DOMAIN_TYPE_ID "
                + "AND g.code          ='KTTS_LIST_PROVINCE' " + "AND e.data_code	  in( "
                + " select catP.code from  CAT_PROVINCE catP LEFT JOIN CAT_STATION catS ON catS.CAT_PROVINCE_ID = catP.CAT_PROVINCE_ID"
                + " LEFT JOIN CONSTRUCTION cons on cons.Cat_station_id = catS.Cat_station_id where cons.code = :constructionCode) ");

//			if(StringUtils.isNotEmpty(obj.getCatProvinceCode())){
//				sql.append( "AND e.data_code =:catProvinceCode ");
//			}

        if (StringUtils.isNotEmpty(obj.getName())) {
            sql.append(" AND upper(o.FULL_NAME) LIKE upper(:name)  OR upper(o.EMPLOYEE_CODE) LIKE upper(:name) ");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        query.setParameter("constructionCode", obj.getConstructionCode());
        queryCount.setParameter("constructionCode", obj.getConstructionCode().trim());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));

//	  		if (StringUtils.isNotEmpty(obj.getCatProvinceCode())) {
//				query.setParameter("catProvinceCode", obj.getCatProvinceCode().trim());
//				queryCount.setParameter("catProvinceCode",obj.getCatProvinceCode().trim());
//			}
        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
            queryCount.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
        }
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    //		Tìm kiếm PGD chuyên trách trong popup
    @SuppressWarnings("unchecked")
    public List<SysUserCOMSDTO> doSearchDirectorInPopup(SysUserCOMSDTO obj) {
        if (StringUtils.isEmpty(obj.getConstructionCode())) {
            return new ArrayList<SysUserCOMSDTO>();
        }
        StringBuilder sql = new StringBuilder("SELECT o.LOGIN_NAME loginName, " + "o.EMPLOYEE_CODE employeeCode, "
                + "o.FULL_NAME fullName, " + "o.EMAIL email, " + "o.SYS_USER_ID sysUserId, "
                + "o.PHONE_NUMBER phoneNumber "
                + "FROM CTCT_VPS_OWNER.SYS_USER o , CTCT_VPS_OWNER.USER_ROLE b, CTCT_VPS_OWNER.SYS_ROLE c,CTCT_VPS_OWNER.USER_ROLE_DATA d,CTCT_VPS_OWNER.DOMAIN_DATA e,CTCT_VPS_OWNER.DOMAIN_TYPE g "
                + "WHERE o.SYS_USER_ID =b.SYS_USER_ID " + "AND b.SYS_ROLE_ID   =c.SYS_ROLE_ID "
                + "AND c.CODE          ='COMS_PGDCT' " + "AND b.USER_ROLE_ID  =d.USER_ROLE_ID "
                + "AND d.DOMAIN_DATA_ID=e.DOMAIN_DATA_ID " + "AND e.DOMAIN_TYPE_ID=g.DOMAIN_TYPE_ID "
                + "AND g.code          ='KTTS_LIST_PROVINCE' " + "AND e.data_code	   in( "
                + " select catP.code from  CAT_PROVINCE catP LEFT JOIN CAT_STATION catS ON catS.CAT_PROVINCE_ID = catP.CAT_PROVINCE_ID"
                + " LEFT JOIN CONSTRUCTION cons on cons.Cat_station_id = catS.Cat_station_id where cons.code = :constructionCode) ");

//			if(StringUtils.isNotEmpty(obj.getCatProvinceCode())){
//				sql.append( "AND e.data_code =:catProvinceCode ");
//			}

        if (StringUtils.isNotEmpty(obj.getName())) {
            sql.append(
                    " AND upper(o.FULL_NAME) LIKE upper(:name) escape '&' OR upper(o.EMPLOYEE_CODE) LIKE upper(:name) escape '&'");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        query.setParameter("constructionCode", obj.getConstructionCode());
        queryCount.setParameter("constructionCode", obj.getConstructionCode().trim());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));

//	  		if (StringUtils.isNotEmpty(obj.getCatProvinceCode())) {
//				query.setParameter("catProvinceCode", obj.getCatProvinceCode().trim());
//				queryCount.setParameter("catProvinceCode",obj.getCatProvinceCode().trim());
//			}
        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
            queryCount.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
        }
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public SysUserCOMSDTO getUserInfoByLoginName(String loginName) {
        StringBuilder sql = new StringBuilder("SELECT " + "SU.SYS_USER_ID sysUserId" + ",SU.LOGIN_NAME loginName"
                + ",SU.FULL_NAME fullName" + ",SU.PASSWORD password" + ",SU.EMPLOYEE_CODE employeeCode"
                + ",SU.EMAIL email" + ",SU.PHONE_NUMBER phoneNumber" + ",SU.STATUS status" + ",DEP.GROUP_NAME_LEVEL3 groupNameLevel3"
                + ",SU.SYS_GROUP_ID sysGroupId" + ",DEP.NAME departmentName" + ",DEP.GROUP_LEVEL groupLevel" + ",DEP.PATH path"
                //VietNT_25/06/2019_start
                + ", su.SALE_CHANNEL saleChannel "
                //VietNT_end
//					hoanm1_20180305_start
                + " FROM SYS_USER SU" + " LEFT JOIN SYS_GROUP DEP ON DEP.SYS_GROUP_ID=SU.SYS_GROUP_ID"
                + " WHERE SU.LOGIN_NAME=:loginName");
//			         hoanm1_20180305_end
        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("password", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("groupNameLevel3", new StringType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("departmentName", new StringType());
        query.addScalar("groupLevel", new StringType());
        query.addScalar("path", new StringType());
        //VietNT_25/06/2019_start
        query.addScalar("saleChannel", new StringType());
        //VietNT_end

        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));
        query.setParameter("loginName", loginName);
        return (SysUserCOMSDTO) query.uniqueResult();
    }

    public Object getForAutoCompleteInSign(SysUserCOMSDTO obj) {
        String sql = "SELECT distinct su.SYS_USER_ID sysUserId," + "su.FULL_NAME fullName,"
                + "su.EMPLOYEE_CODE employeeCode," + "su.EMAIL email" + " FROM CTCT_VPS_OWNER.SYS_USER su"
                + " WHERE 1=1 ";

        StringBuilder stringBuilder = new StringBuilder(sql);

        stringBuilder.append(" AND ROWNUM <=10 ");
        if (StringUtils.isNotEmpty(obj.getFullName())) {
            stringBuilder.append(
                    " AND (upper(su.FULL_NAME) LIKE upper(:fullName) escape '&' OR upper(su.EMPLOYEE_CODE) LIKE upper(:fullName) escape '&' OR upper(su.EMAIL) LIKE upper(:fullName) escape '&')");
        }

        stringBuilder.append(" ORDER BY su.EMPLOYEE_CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("fullName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("email", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));

        if (StringUtils.isNotEmpty(obj.getFullName())) {
            query.setParameter("fullName", "%" + ValidateUtils.validateKeySearch(obj.getFullName()) + "%");
        }

        return query.list();
    }

    // Service Mobile

    public List<SysUserCOMSDTO> getListUser(SysUserRequest request) {
        StringBuilder sql = new StringBuilder(
                "SELECT " + "SU.SYS_USER_ID sysUserId " + ",SU.LOGIN_NAME loginName " + ",SU.FULL_NAME fullName "
                        + ",SU.PASSWORD password " + ",SU.EMPLOYEE_CODE employeeCode " + ",SU.EMAIL email "
                        + ",SU.PHONE_NUMBER phoneNumber " + ",SU.STATUS status " + ",SU.SYS_GROUP_ID departmentId "
                        + " FROM SYS_USER SU inner join sys_group b on SU.SYS_GROUP_ID=b.SYS_GROUP_ID "
                        + " where (case when b.group_level=4 then "
                        + " (select a.sys_group_id from sys_group a where a.sys_group_id= "
                        + " (select a.parent_id from sys_group a where a.sys_group_id=b.parent_id)) "
                        + " when b.group_level=3 then "
                        + " (select a.sys_group_id from sys_group a where a.sys_group_id=b.parent_id) "
                        + " else b.sys_group_id end)= :departmentId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("password", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("departmentId", new LongType());

//	  		hoanm1_20180602_start
//	  		query.setParameter("departmentId", constructionTaskDao.getSysGroupId(request.getAuthenticationInfo().getUsername()));
        query.setParameter("departmentId", constructionTaskDao.getSysGroupIdUserId(request.getSysUserId()));
//	  		hoanm1_20180602_end
        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));

        return query.list();
    }

    public List<SysUserCOMSDTO> getListUserByManagePlan(SysUserRequest request, List<DomainDTO> isManage) {

        StringBuilder domain = new StringBuilder();
        if (isManage.size() > 0) {
            for (int i = 0; i < isManage.size(); i++) {
                domain.append(isManage.get(i).getDataId().toString());
                while (i != isManage.size() - 1) {
                    domain.append(" , ");
                    break;
                }
            }
        }

        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT SU.SYS_USER_ID sysUserId, ");
        sql.append("  SU.LOGIN_NAME    AS loginName, ");
        sql.append("  SU.FULL_NAME     AS fullName, ");
        sql.append("  SU.PASSWORD      AS password, ");
        sql.append("  SU.EMPLOYEE_CODE AS employeeCode, ");
        sql.append("  SU.EMAIL         AS email, ");
        sql.append("  SU.PHONE_NUMBER  AS phoneNumber, ");
        sql.append("  SU.STATUS        AS status, ");
        sql.append("  SU.SYS_GROUP_ID  AS departmentId ");
        sql.append("FROM SYS_USER SU ");
        sql.append("INNER JOIN sys_group b ");
        sql.append("ON SU.SYS_GROUP_ID=b.SYS_GROUP_ID ");
        sql.append("WHERE ( ");
        sql.append("  CASE ");
        sql.append("    WHEN b.group_level=4 ");
        sql.append("    THEN ");
        sql.append("      (SELECT a.sys_group_id ");
        sql.append("      FROM sys_group a ");
        sql.append("      WHERE a.sys_group_id= ");
        sql.append("        (SELECT a.parent_id FROM sys_group a WHERE a.sys_group_id=b.parent_id ");
        sql.append("        ) ");
        sql.append("      ) ");
        sql.append("    WHEN b.group_level=3 ");
        sql.append("    THEN ");
        sql.append("      (SELECT a.sys_group_id FROM sys_group a WHERE a.sys_group_id=b.parent_id ");
        sql.append("      ) ");
        sql.append("    ELSE b.sys_group_id ");
        sql.append("  END) IN (" + domain + ") ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("password", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("departmentId", new LongType());

        // query.setParameter("departmentId",
        // constructionTaskDao.getSysGroupId(request.getAuthenticationInfo().getUsername()));
        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));

        return query.list();
    }

    public int Login(BaseWsRequest request) {
        StringBuilder sql = new StringBuilder(
                " SELECT COUNT(*) FROM SYS_USER " + "WHERE LOGIN_NAME = :username AND PASSWORD = :password ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("username", request.getAuthenticationInfo().getUsername());
        query.setParameter("password", request.getAuthenticationInfo().getPassword());

        return ((BigDecimal) query.uniqueResult()).intValue();
    }

    public List<SysUserCOMSDTO> getUserByUsernamePassword(BaseWsRequest request) {
        StringBuilder sql = new StringBuilder(
                "SELECT " + "SU.SYS_USER_ID sysUserId " + ",SU.LOGIN_NAME loginName " + ",SU.FULL_NAME fullName "
                        + ",SU.PASSWORD password " + ",SU.EMPLOYEE_CODE employeeCode " + ",SU.EMAIL email "
                        + ",SU.PHONE_NUMBER phoneNumber " + ",SU.STATUS status " + ",SU.SYS_GROUP_ID departmentId "
                        + " FROM SYS_USER SU " + "WHERE SU.LOGIN_NAME = :username AND SU.PASSWORD = :password ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("password", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("departmentId", new LongType());

        query.setParameter("username", request.getAuthenticationInfo().getUsername());
        query.setParameter("password", request.getAuthenticationInfo().getPassword());
        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));

        return query.list();
    }

    public SysUserCOMSDTO getSysUserByEmployeeCode(String employeeCode) {

        StringBuilder sql = new StringBuilder(
                "SELECT " + "SU.SYS_USER_ID sysUserId " + ",SU.LOGIN_NAME loginName " + ",SU.FULL_NAME fullName "
                        + ",SU.PASSWORD password " + ",SU.EMPLOYEE_CODE employeeCode " + ",SU.EMAIL email "
                        + ",SU.PHONE_NUMBER phoneNumber " + ",SU.STATUS status " + ",SU.SYS_GROUP_ID departmentId "
                        // Cuongnv2 start
                        + ",SY.NAME sysGroupName "
                        // Cuongnv2 end
                        //VietNT_25/06/2019_start
                        + ", su.sale_channel saleChannel "
                        //VietNT_end
                        + " FROM SYS_USER SU "
                        // Cuongnv2 start
                        + "LEFT JOIN sys_group SY " + "ON SU.SYS_GROUP_ID = SY.SYS_GROUP_ID "
                        // Cuongnv2 end
                        + "WHERE SU.EMPLOYEE_CODE = :employeeCode ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("password", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("departmentId", new LongType());
        query.addScalar("sysGroupName", new StringType());
        //VietNT_25/06/2019_start
        query.addScalar("saleChannel", new StringType());
        //VietNT_end

        query.setParameter("employeeCode", employeeCode.toString());

        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));

        return (SysUserCOMSDTO) query.list().get(0);

    }

    public int RegisterLoginTime(SysUserCOMSDTO userDto) throws ParseException {
        StringBuilder sql = new StringBuilder();
        sql.append("INSERT INTO KPI_LOG_MOBILE_AIO ");
        sql.append(
                "(KPI_LOG_MOBILE_ID, SYSUSERID, LOGINNAME, PASSWORD,  EMAIL, FULLNAME, EMPLOYEECODE, PHONENUMBER, SYSGROUPNAME, SYSGROUPID, TIME_DATE,FUNCTION_CODE,DESCRIPTION) ");
        sql.append("VALUES( ");
        /* Long id=KPI_LOG_MOBILE_seq.nextval; */
        sql.append("KPI_LOG_MOBILE_AIO_seq.nextval , ");

        sql.append("'" + userDto.getSysUserId() + "', ");
        sql.append("'" + userDto.getLoginName() + "', ");
        sql.append("'" + userDto.getPassword() + "', ");
        sql.append("'" + userDto.getEmail() + "', ");
        sql.append("'" + userDto.getFullName() + "', ");
        sql.append("'" + userDto.getEmployeeCode() + "', ");
        sql.append("'" + userDto.getPhoneNumber() + "', ");
        sql.append("'" + userDto.getSysGroupName() + "', ");
        sql.append("'" + userDto.getDepartmentId() + "', ");

        Date now = new Date();
        // Tue May 22 13:56:18 GMT+07:00 2018
        String dateNow = now.toString();
        SimpleDateFormat dt = new SimpleDateFormat("EEE MMM d HH:mm:ss zzz yyyy");
        Date dateString = dt.parse(dateNow);
        SimpleDateFormat formater = new SimpleDateFormat("dd-MMMM-yy");
//        SimpleDateFormat formater = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
//        String formatedDate = formater.format(dateString);
        sql.append("sysdate ,");
//        sql.append("'" + dateString + "', ");
//			hoanm1_20180718_start
        String functionCode = "LOGIN";
        String description = "Đăng nhập mobile AIO";
        sql.append("'" + functionCode + "', ");
        sql.append("'" + description + "' ");
//			hoanm1_20180718_end
        sql.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        return query.executeUpdate();
    }
//    hoanm1_20180916_start
    public int RegisterLoginWeb(SysUserCOMSDTO userDto) throws ParseException {
        StringBuilder sql = new StringBuilder();
        sql.append("INSERT INTO KPI_LOG_LOGIN ");
        sql.append(
                "(KPI_LOG_LOGIN_ID, SYSUSERID, LOGINNAME, PASSWORD,  EMAIL, FULLNAME, EMPLOYEECODE, PHONENUMBER, SYSGROUPNAME, SYSGROUPID, TIME_DATE,FUNCTION_CODE,DESCRIPTION) ");
        sql.append("VALUES( ");
        sql.append("KPI_LOG_LOGIN_SEQ.nextval , ");

        sql.append("'" + userDto.getSysUserId() + "', ");
        sql.append("'" + userDto.getLoginName() + "', ");
        sql.append("'" + userDto.getPassword() + "', ");
        sql.append("'" + userDto.getEmail() + "', ");
        sql.append("'" + userDto.getFullName() + "', ");
        sql.append("'" + userDto.getEmployeeCode() + "', ");
        sql.append("'" + userDto.getPhoneNumber() + "', ");
        sql.append("'" + userDto.getSysGroupName() + "', ");
        sql.append("'" + userDto.getSysGroupId() + "', ");
        sql.append("sysdate,");
        String functionCode = "LOGIN_WEB_COMS";
        String description = "Đăng nhập web coms"; 
        sql.append("'" + functionCode + "', ");
        sql.append("'" + description + "' ");
        sql.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        return query.executeUpdate();
    }
//    hoanm1_20180916_end

    //VietNT_16/09/2019_start
    public SysUserCOMSDTO getUserCTV(String username) {

        StringBuilder sql = new StringBuilder(
                "SELECT " + "SU.SYS_USER_ID sysUserId " + ",SU.LOGIN_NAME loginName " + ",SU.FULL_NAME fullName "
                        + ",SU.PASSWORD password " + ",SU.EMPLOYEE_CODE employeeCode " + ",SU.EMAIL email "
                        + ",SU.PHONE_NUMBER phoneNumber " + ",SU.STATUS status " + ",SU.SYS_GROUP_ID departmentId "
                        + ",SY.NAME sysGroupName "
                        + ", su.sale_channel saleChannel "
                        + ", su.type_user typeUser, su.tax_code taxCode "
                        + " FROM SYS_USER SU "
                        + "LEFT JOIN sys_group SY " + "ON SU.SYS_GROUP_ID = SY.SYS_GROUP_ID "
                        + "WHERE (su.login_name = :username or su.EMPLOYEE_CODE = :username or su.PHONE_NUMBER = :username) " +
                        "and su.type_user is NOT NULL and su.type_user in (1, 2) ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("password", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("departmentId", new LongType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("saleChannel", new StringType());
        query.addScalar("typeUser", new LongType());
        query.addScalar("taxCode", new StringType());

        query.setParameter("username", username);

        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));

        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (SysUserCOMSDTO) query.list().get(0);
        }
        return null;
    }
    //VietNT_end
}
