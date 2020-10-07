/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.cat.dto.CatPartnerDTO;
import com.viettel.coms.bo.ContructionLandHandoverPlanBO;
import com.viettel.coms.dto.*;
import com.viettel.coms.utils.ValidateUtils;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("contructionLandHandoverPlanDAO")
public class ContructionLandHandoverPlanDAO extends BaseFWDAOImpl<ContructionLandHandoverPlanBO, Long> {

    public ContructionLandHandoverPlanDAO() {
        this.model = new ContructionLandHandoverPlanBO();
    }

    public ContructionLandHandoverPlanDAO(Session session) {
        this.session = session;
    }

    public List<CatStationDTO> getCatStation(CatStationDTO obj, List<String> groupId) {
        String sql = "SELECT " + " ST.CAT_STATION_ID id" + " ,ST.ADDRESS address" + " ,ST.NAME name" + " ,ST.CODE code"
                + " FROM CTCT_CAT_OWNER.CAT_STATION ST" + " WHERE ST.STATUS=1 and ST.CAT_PROVINCE_ID in :groupId ";

        StringBuilder stringBuilder = new StringBuilder(sql);

        stringBuilder.append(" AND ROWNUM <=10 ");
        if (StringUtils.isNotEmpty(obj.getCode())) {
            stringBuilder.append(" AND upper(ST.CODE) LIKE upper(:code) ");
        }
        if (StringUtils.isNotEmpty(obj.getType())) {
            stringBuilder.append(" AND ST.TYPE =:type ");
        }

        stringBuilder.append(" ORDER BY ST.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("id", new LongType());
        query.addScalar("address", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(CatStationDTO.class));

        if (StringUtils.isNotEmpty(obj.getCode())) {
            query.setParameter("code", "%" + ValidateUtils.validateKeySearch(obj.getCode()) + "%");
        }
        if (StringUtils.isNotEmpty(obj.getType())) {
            query.setParameter("type", obj.getType());
        }

        query.setParameterList("groupId", groupId);
        return query.list();
    }

    public List<ConstructionDTO> getLstConstruction(String code) {
        String sql = "SELECT c.CONSTRUCTION_ID as constructionId,c.CODE as code FROM CONSTRUCTION c "
                + "INNER JOIN CAT_STATION ca ON c.CAT_STATION_ID=ca.CAT_STATION_ID " + "WHERE ca.CODE = :code ";

        StringBuilder stringBuilder = new StringBuilder(sql);

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));
        query.setParameter("code", code);

        return query.list();
    }

    public List<CatPartnerDTO> doSearchPartner(CatPartnerDTO obj) {

        StringBuilder sql = new StringBuilder("SELECT cp.CAT_PARTNER_ID catPartnerId," + " cp.NAME name,"
                + "cp.CODE code," + "cp.PARTNER_TYPE partnerType,"
                + " DECODE (CP.PARTNER_TYPE, 0, 'Đối tác ngoài Viettel',1, 'Đối tác trong Viettel',  '') as partnerTypeName,"
                + " DECODE (cp.STATUS , 0, 'Hết hiệu lực',1, 'Hiệu lực',  '') as statusName " + " From CAT_PARTNER cp "
                + " WHERE 1=1 ");
        if (obj.getStatus() != null) {
            sql.append(" AND cp.STATUS = :status");
        } else {
            sql.append(" AND cp.STATUS >= 0");
        }
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (upper(cp.NAME) LIKE upper(:keySearch)  OR upper(cp.CODE) LIKE upper(:keySearch) )");
        }
        if (obj.getCatPartnerId() != null) {
            sql.append(" AND cp.CAT_PARTNER_ID  = :catPartnerId");
        }

        if (obj.getName() != null && !obj.getName().isEmpty()) {
            sql.append(" AND cp.NAME  = :name");
        }
        if (obj.getCode() != null && !obj.getCode().isEmpty()) {
            sql.append(" AND cp.CODE  = :code");
        }
        if (obj.getPartnerType() != null) {
            sql.append(" and cp.PARTNER_TYPE = :partnerType ");
        } else {
            sql.append(" AND cp.PARTNER_TYPE >= 0");
        }

        sql.append(" ORDER BY cp.CAT_PARTNER_ID DESC");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("catPartnerId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("statusName", new StringType());
        query.addScalar("partnerType", new LongType());
        query.addScalar("partnerTypeName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(CatPartnerDTO.class));
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        if (obj.getCatPartnerId() != null) {
            query.setParameter("catPartnerId", obj.getCatPartnerId());
            queryCount.setParameter("catPartnerId", obj.getCatPartnerId());
        }
        if (obj.getCode() != null && !obj.getCode().isEmpty()) {
            query.setParameter("code", obj.getCode());
            queryCount.setParameter("code", obj.getCode());
        }
        if (obj.getName() != null && !obj.getName().isEmpty()) {
            query.setParameter("name", obj.getName());
            queryCount.setParameter("name", obj.getName());
        }
        if (obj.getStatus() != null) {
            query.setParameter("status", obj.getStatus());
            queryCount.setParameter("status", obj.getStatus());
        }
        if (obj.getPartnerType() != null) {
            query.setParameter("partnerType", obj.getPartnerType());
            queryCount.setParameter("partnerType", obj.getPartnerType());
        }
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();

    }

    public Long getProvinceIdByCatStation(Long constructionId) {
        if (constructionId == null) {
            return -1L;
        }
        StringBuilder sql = new StringBuilder("SELECT catPro.CAT_PROVINCE_ID catProvinceId"
                + " FROM CAT_PROVINCE catPro " + " LEFT JOIN CAT_STATION catStation "
                + " ON catPro.CAT_PROVINCE_ID       = catStation.CAT_PROVINCE_ID " + " LEFT JOIN CONSTRUCTION con "
                + " ON catStation.CAT_STATION_ID = con.CAT_STATION_ID "
                + " WHERE con.CONSTRUCTION_ID =:constructionId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", constructionId);
        query.addScalar("catProvinceId", new LongType());
        List<Long> list = query.list();
        if (list != null && !list.isEmpty()) {
            return list.get(0);
        }
        return -1L;
    }

    /*
     * public boolean checkNameCode(String code, Long contructionLandHanPlanId) {
     * StringBuilder sql = new StringBuilder(
     * "SELECT COUNT(CONTRUCTION_LAND_HAN_PLAN_ID) FROM CONTRUCTION_LAND_HANDOVER_PLAN where 1=1 and name=:name "
     * ); if (contructionLandHanPlanId != null) {
     * sql.append(" AND CONTRUCTION_LAND_HAN_PLAN_ID != :contructionLandHanPlanId "
     * ); } SQLQuery query = getSession().createSQLQuery(sql.toString()); //
     * query.setParameter("code", code); if (contructionLandHanPlanId != null) {
     * query.setParameter("contructionLandHanPlanId", contructionLandHanPlanId); }
     * return ((BigDecimal) query.uniqueResult()).intValue() > 0; }
     */
    public Long getProvinceIdByConstructionId(Long constructionId) {
        if (constructionId == null) {
            return -1L;
        }
        StringBuilder sql = new StringBuilder("SELECT catPro.CAT_PROVINCE_ID catProvinceId"
                + " FROM CAT_PROVINCE catPro " + " LEFT JOIN CAT_STATION catStation "
                + " ON catPro.CAT_PROVINCE_ID       = catStation.CAT_PROVINCE_ID " + " LEFT JOIN CONSTRUCTION con "
                + " ON catStation.CAT_STATION_ID = con.CAT_STATION_ID "
                + " WHERE con.CONSTRUCTION_ID =:constructionId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", constructionId);
        query.addScalar("catProvinceId", new LongType());
        List<Long> list = query.list();
        if (list != null && !list.isEmpty()) {
            return list.get(0);
        }
        return -1L;
    }

    public List<ContructionLandHandoverPlanDtoSearch> doSearch(ContructionLandHandoverPlanDtoSearch obj,
                                                               List<String> groupId) {
        Date date = new Date();

        DateFormat df = new SimpleDateFormat("dd/MM/yyyy");

        String htdate = df.format(date);
        obj.setHtDate(htdate);

        StringBuilder sql = new StringBuilder("SELECT cons.CONTRUCTION_LAND_HAN_PLAN_ID contructionLandHanPlanId,"
                + " cons.NAME name," + "cons.MONTH month," + "cons.YEAR year,"
                + "cons.GROUND_PLAN_DATE groundPlanDate, " + "cons.SYS_GROUP_ID sysGroupId, "
                + "cons.CAT_PARTNER_ID catPartnerId, " + "cons.DESCRIPTION description, sys.NAME sysGroupName, "
                + " catPro.CAT_PROVINCE_ID catProvinceId, " + " catPro.CODE catProvinceCode, " + " catPro.NAME catProvinceName, " + " catStation.CODE catStationCode, "
                + " construction.CODE contructionCode, " + " construction.CONSTRUCTION_ID constructionId, "
                + " catPartner.CODE catPartnerCode " + " From CONTRUCTION_LAND_HANDOVER_PLAN cons "
                + " LEFT JOIN CONSTRUCTION construction ON cons.CONSTRUCTION_ID = construction.CONSTRUCTION_ID"
                + " LEFT JOIN SYS_GROUP sys ON cons.SYS_GROUP_ID=sys.SYS_GROUP_ID"
                + " LEFT JOIN CAT_PARTNER catPartner ON cons.CAT_PARTNER_ID = catPartner.CAT_PARTNER_ID "
                + " LEFT JOIN CAT_STATION catStation  ON construction.CAT_STATION_ID = catStation.CAT_STATION_ID "
                + " LEFT JOIN cat_province catPro ON catStation.CAT_PROVINCE_ID = catPro.CAT_PROVINCE_ID"
                + " WHERE 1=1 ");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(cons.NAME) LIKE upper(:keySearch)  OR upper(catStation.CODE) LIKE upper(:keySearch) ) ");

        }
        if (obj.getName() != null) {
            sql.append(" AND cons.NAME = :name");
        }
        if (obj.getFromDate() != null && !"".equals(obj.getFromDate()) && obj.getToDate() != null
                && !"".equals(obj.getToDate())) {
            sql.append(
                    " AND cons.GROUND_PLAN_DATE between to_date(:fromDate,'dd/MM/yyyy') AND to_date(:toDate,'dd/MM/yyyy')");
        }
        if (obj.getFromDate() != null && !"".equals(obj.getFromDate()) && obj.getHtDate() != null
                && !"".equals(obj.getHtDate())) {
            sql.append(
                    " AND cons.GROUND_PLAN_DATE between to_date(:fromDate,'dd/MM/yyyy') AND to_date(:htDate,'dd/MM/yyyy')");
        }
        if (obj.getMonth() != null && !"".equals(obj.getMonth())) {
            sql.append(" AND lower(cons.NAME) like lower(:month)");
        }
        if (obj.getYear() != null && !"".equals(obj.getYear())) {
            sql.append(" AND lower(cons.NAME) like lower(:year)");
        }
        if (groupId != null) {
            sql.append(" and catPro.CAT_PROVINCE_ID in :groupId");
        }
        // tuannt_15/08/2018_start
        if (obj.getCatProvinceId() != null) {
            sql.append(" AND catPro.CAT_PROVINCE_ID = :catProvinceId ");
        }
        // tuannt_15/08/2018_start
        sql.append(" ORDER BY cons.CONTRUCTION_LAND_HAN_PLAN_ID DESC");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("contructionLandHanPlanId", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("groundPlanDate", new DateType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("contructionCode", new StringType());
        query.addScalar("catPartnerCode", new StringType());
        query.addScalar("catPartnerId", new LongType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("catProvinceName", new StringType());

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
            queryCount.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
        }
        if (obj.getName() != null) {
            query.setParameter("name", obj.getName());
            queryCount.setParameter("name", obj.getName());

        }
        if (obj.getFromDate() != null && !"".equals(obj.getFromDate()) && obj.getToDate() != null
                && !"".equals(obj.getToDate())) {
            query.setParameter("fromDate", obj.getFromDate());
            query.setParameter("toDate", obj.getToDate());
            queryCount.setParameter("fromDate", obj.getFromDate());
            queryCount.setParameter("toDate", obj.getToDate());
        }
        if (groupId != null) {
            query.setParameterList("groupId", groupId);
            queryCount.setParameterList("groupId", groupId);
        }
        if (obj.getFromDate() != null && !"".equals(obj.getFromDate()) && obj.getHtDate() != null
                && !"".equals(obj.getHtDate())) {
            query.setParameter("fromDate", obj.getFromDate());
            query.setParameter("htDate", obj.getHtDate());
            queryCount.setParameter("fromDate", obj.getFromDate());
            queryCount.setParameter("htDate", obj.getHtDate());
        }
        if (obj.getMonth() != null && !"".equals(obj.getMonth())) {
            query.setParameter("month", "tháng " + obj.getMonth() + "%");
            queryCount.setParameter("month", "tháng " + obj.getMonth() + "%");
        }
        if (obj.getYear() != null && !"".equals(obj.getYear())) {
            query.setParameter("year", "%/" + obj.getYear());
            queryCount.setParameter("year", "%/" + obj.getYear());
        }
        // tuannt_15/08/2018_start
        if (obj.getCatProvinceId() != null) {
            query.setParameter("catProvinceId", obj.getCatProvinceId());
            queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
        }
        // tuannt_15/08/2018_start
        query.setResultTransformer(Transformers.aliasToBean(ContructionLandHandoverPlanDtoSearch.class));
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public ContructionLandHandoverPlanDTO getConstructionById(Long id) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("SELECT cons.CONTRUCTION_LAND_HAN_PLAN_ID contructionLandHanPlanId,"
                + " cons.NAME name," + "cons.MONTH month," + "cons.YEAR year,"
                + "cons.GROUND_PLAN_DATE groundPlanDate, " + "cons.SYS_GROUP_ID sysGroupId, "
                + "cons.CAT_PARTNER_ID catPartnerId, " + "cons.DESCRIPTION description, sys.NAME sysGroupName, "
                + " catStation.CODE catStationCode, " + " catStation.CAT_STATION_ID catStationId, "
                + " construction.CODE contructionCode, " + " construction.CONSTRUCTION_ID constructionId, "
                + " catPartner.CODE catPartnerCode "
                + " From CONTRUCTION_LAND_HANDOVER_PLAN cons LEFT JOIN SYS_GROUP sys ON cons.SYS_GROUP_ID=sys.SYS_GROUP_ID"
                + " LEFT JOIN CAT_PARTNER catPartner ON cons.CAT_PARTNER_ID = catPartner.CAT_PARTNER_ID "
                + " LEFT JOIN CAT_STATION catStation  ON cons.CAT_STATION_ID = catStation.CAT_STATION_ID "
                // +
                // " LEFT JOIN cat_province catPro ON catPro.CAT_PROVINCE_ID =
                // cons.CAT_PROVINCE_ID"
                + " LEFT JOIN CONSTRUCTION construction ON cons.CONSTRUCTION_ID   = construction.CONSTRUCTION_ID"
                + " WHERE cons.CONTRUCTION_LAND_HAN_PLAN_ID=:id ");
        sql.append(" ORDER BY cons.CONTRUCTION_LAND_HAN_PLAN_ID DESC");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("contructionLandHanPlanId", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("groundPlanDate", new DateType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("contructionCode", new StringType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("catStationId", new LongType());
        query.addScalar("catPartnerCode", new StringType());
        query.addScalar("catPartnerId", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(ContructionLandHandoverPlanDtoSearch.class));
        query.setParameter("id", id);
        return (ContructionLandHandoverPlanDTO) query.uniqueResult();
    }

    public Long updateConstruction(ContructionLandHandoverPlanBO model) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " update CONTRUCTION_LAND_HANDOVER_PLAN set CONTRUCTION_LAND_HAN_PLAN_ID = :contructionLandHanPlanId ");
        if (model.getName() != null && model.getName() != " ") {
            sql.append(" ,NAME = :name");
        }
        if (model.getMonth() != null) {
            sql.append(" ,MONTH = :month");
        }
        if (model.getYear() != null) {
            sql.append(",YEAR = :year ");
        }
        if (model.getDescription() != null) {
            sql.append(" ,DESCRIPTION = :description");
        }
        if (model.getGroundPlanDate() != null) {
            sql.append(",GROUND_PLAN_DATE = :groundPlanDate ");
        }
        if (model.getCatStationId() != null) {
            sql.append(",CAT_STATION_ID = :catStationId");
        }
        if (model.getConstructionId() != null) {
            sql.append(",CONSTRUCTION_ID = :constructionId");
        }
        if (model.getCatPartnerId() != null) {
            sql.append(",CAT_PARTNER_ID = :catPartnerId");
        }
        if (model.getSysGroupId() != null) {
            sql.append(",SYS_GROUP_ID = :sysGroupId");
        }
        if (model.getUpdateUser() != null) {
            sql.append(",UPDATE_USER = :updateUser");
        }
        if (model.getUpdateDate() != null) {
            sql.append(",UPDATE_DATE = :updateDate");
        }
        sql.append(" where CONTRUCTION_LAND_HAN_PLAN_ID = :contructionLandHanPlanId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("contructionLandHanPlanId", model.getContructionLandHanPlanId());
        if (model.getName() != null && model.getName() != " ") {
            query.setParameter("name", model.getName());
        }
        if (model.getMonth() != null) {
            query.setParameter("month", model.getMonth());
        }
        if (model.getYear() != null) {
            query.setParameter("year", model.getYear());
        }
        if (model.getDescription() != null) {
            query.setParameter("description", model.getDescription());
        }
        if (model.getGroundPlanDate() != null) {
            query.setParameter("groundPlanDate", model.getGroundPlanDate());
        }
        if (model.getCatStationId() != null) {
            query.setParameter("catStationId", model.getCatStationId());
        }
        if (model.getConstructionId() != null) {
            query.setParameter("constructionId", model.getConstructionId());
        }
        if (model.getCatPartnerId() != null) {
            query.setParameter("catPartnerId", model.getCatPartnerId());
        }
        if (model.getSysGroupId() != null) {
            query.setParameter("sysGroupId", model.getSysGroupId());
        }
        if (model.getUpdateUser() != null) {
            query.setParameter("updateUser", model.getUpdateUser());
        }
        if (model.getUpdateDate() != null) {
            query.setParameter("updateDate", model.getUpdateDate());
        }
        return (long) query.executeUpdate();
    }

    public void remove(Long contructionLandHanPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "DELETE FROM CONTRUCTION_LAND_HANDOVER_PLAN  where CONTRUCTION_LAND_HAN_PLAN_ID = :contructionLandHanPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("contructionLandHanPlanId", contructionLandHanPlanId);
        query.executeUpdate();
    }

    public List<DepartmentDTO> getAllLevel12() {
        String sql = "SELECT " + " ST.SYS_GROUP_ID id" + ",(ST.CODE ||'-' || ST.NAME) text" + " ,ST.NAME name"
                + " ,ST.CODE code," + "ST.GROUP_NAME_LEVEL1 groupNameLevel1," + "ST.GROUP_NAME_LEVEL2 groupNameLevel2,"
                + "ST.GROUP_NAME_LEVEL3 groupNameLevel3 " + " FROM SYS_GROUP ST"
                + " WHERE ST.STATUS=1 and (ST.GROUP_LEVEL =1 or ST.GROUP_LEVEL =2)";

        StringBuilder stringBuilder = new StringBuilder(sql);
        stringBuilder.append(" ORDER BY ST.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("id", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("text", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("groupNameLevel1", new StringType());
        query.addScalar("groupNameLevel2", new StringType());
        query.addScalar("groupNameLevel3", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));
        return query.list();
    }

    public List<ContructionLandHandoverPlanDtoSearch> exportHanPlan(ContructionLandHandoverPlanDtoSearch obj) {
        StringBuilder sql = new StringBuilder("SELECT cons.CONTRUCTION_LAND_HAN_PLAN_ID contructionLandHanPlanId,"
                + " cons.NAME name," + "cons.MONTH month," + "cons.YEAR year,"
                + "cons.GROUND_PLAN_DATE groundPlanDate, " + "cons.SYS_GROUP_ID sysGroupId, "
                + "cons.CAT_PARTNER_ID catPartnerId, " + "cons.DESCRIPTION description, sys.NAME sysGroupName, "
                + " catStation.CODE catStationCode, " + " construction.CODE contructionCode, "
                + " catPartner.CODE catPartnerCode "
                + " From CONTRUCTION_LAND_HANDOVER_PLAN cons LEFT JOIN SYS_GROUP sys ON cons.SYS_GROUP_ID=sys.SYS_GROUP_ID"
                + " LEFT JOIN CAT_PARTNER catPartner ON cons.CAT_PARTNER_ID = catPartner.CAT_PARTNER_ID "
                + " LEFT JOIN CAT_STATION catStation  ON cons.CAT_STATION_ID = catStation.CAT_STATION_ID "
                + " LEFT JOIN cat_province catPro ON catPro.CAT_PROVINCE_ID   = catStation.CAT_PROVINCE_ID"
                + " LEFT JOIN CONSTRUCTION construction ON cons.CONSTRUCTION_ID   = construction.CONSTRUCTION_ID"
                + " WHERE 1=1 ");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(cons.NAME) LIKE upper(:keySearch)  OR upper(catStation.CODE) LIKE upper(:keySearch) ) ");

        }
        if (obj.getName() != null) {
            sql.append(" AND cons.NAME = :name");
        }
        if (obj.getFromDate() != null && !"".equals(obj.getFromDate()) && obj.getToDate() != null
                && !"".equals(obj.getToDate())) {
            sql.append(
                    " AND cons.GROUND_PLAN_DATE between to_date(:fromDate,'dd/MM/yyyy') AND to_date(:toDate,'dd/MM/yyyy')");
        }
        if (obj.getMonth() != null && !"".equals(obj.getMonth())) {
            sql.append(" AND lower(cons.NAME) like lower(:month)");
        }
        if (obj.getYear() != null && !"".equals(obj.getYear())) {
            sql.append(" AND lower(cons.NAME) like lower(:year)");
        }
        if (obj.getSysGroupId() != null && !"".equals(obj.getSysGroupId())) {
            sql.append(" and cons.SYS_GROUP_ID = :sysGroupId");
        }
        sql.append(" ORDER BY cons.CONTRUCTION_LAND_HAN_PLAN_ID DESC");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("contructionLandHanPlanId", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("groundPlanDate", new DateType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("contructionCode", new StringType());
        query.addScalar("catPartnerCode", new StringType());
        query.addScalar("catPartnerId", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(ContructionLandHandoverPlanDtoSearch.class));
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        /*
         * if (StringUtils.isNotEmpty(obj.getKeySearch())) {
         * query.setParameter("keySearch", "%" + obj.getKeySearch() + "%"); queryCount
         * .setParameter("keySearch", "%" + obj.getKeySearch() + "%"); }
         */
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
            queryCount.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
        }
        if (obj.getName() != null) {
            query.setParameter("name", obj.getName());
            queryCount.setParameter("name", obj.getName());

        }
        // if (obj.getGroundPlanDate() != null) {
        // query.setParameter("groundPlanDate", obj.getGroundPlanDate());
        // queryCount.setParameter("groundPlanDate", obj.getGroundPlanDate());
        // }
        if (obj.getFromDate() != null && !"".equals(obj.getFromDate()) && obj.getToDate() != null
                && !"".equals(obj.getToDate())) {
            query.setParameter("fromDate", obj.getFromDate());
            query.setParameter("toDate", obj.getToDate());
            queryCount.setParameter("fromDate", obj.getFromDate());
            queryCount.setParameter("toDate", obj.getToDate());
        }
        if (obj.getMonth() != null && !"".equals(obj.getMonth())) {
            query.setParameter("month", "tháng " + obj.getMonth() + "%");
            queryCount.setParameter("month", "tháng " + obj.getMonth() + "%");
        }
        if (obj.getYear() != null && !"".equals(obj.getYear())) {
            query.setParameter("year", "%/" + obj.getYear());
            queryCount.setParameter("year", "%/" + obj.getName());
        }
        if (obj.getSysGroupId() != null && !"".equals(obj.getSysGroupId())) {
            query.setParameter("sysGroupId", (obj.getSysGroupId()));
            queryCount.setParameter("sysGroupId", (obj.getSysGroupId()));
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public boolean getSysGroupData(ContructionLandHandoverPlanDtoSearch newObj, String sysGroupCode) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT name name, sys_GROUP_ID id from CTCT_CAT_OWNER.SYS_GROUP where upper(code) = :code ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("name", new StringType());
        query.addScalar("id", new LongType());
        query.setParameter("code", sysGroupCode.toUpperCase());
        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));
        List<DepartmentDTO> re = query.list();
        if (!re.isEmpty()) {
            newObj.setSysGroupName(re.get(0).getName());
            return true;
        }
        return false;
    }

    public boolean getCatstationData(ContructionLandHandoverPlanDtoSearch newObj, String catStationCode) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT CAT_STATION_ID id from CTCT_CAT_OWNER.CAT_STATION where upper(code) = :code ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("id", new LongType());
        query.setParameter("code", catStationCode.toUpperCase());
        query.setResultTransformer(Transformers.aliasToBean(ContructionLandHandoverPlanDtoSearch.class));
        List<ContructionLandHandoverPlanDtoSearch> re = query.list();
        if (!re.isEmpty()) {
            return true;
        }
        return false;
    }

    public boolean getCatpartnerData(ContructionLandHandoverPlanDtoSearch newObj, String catPartnerCode) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT name name, CAT_PARTNER_ID id from CTCT_CAT_OWNER.CAT_PARTNER where upper(code) = :code ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("name", new StringType());
        query.addScalar("id", new LongType());
        query.setParameter("code", catPartnerCode.toUpperCase());
        query.setResultTransformer(Transformers.aliasToBean(ContructionLandHandoverPlanDtoSearch.class));
        List<ContructionLandHandoverPlanDtoSearch> re = query.list();
        if (!re.isEmpty()) {
            return true;
        }
        return false;
    }

    public boolean getContructionData(String maTram, String maCT) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(" SELECT c.CONSTRUCTION_ID AS constructionId, " + " c.CODE AS code "
                + " FROM CONSTRUCTION c " + " INNER JOIN CAT_STATION ca " + " ON c.CAT_STATION_ID=ca.CAT_STATION_ID "
                + " WHERE ca.CODE =:maTram and c.code=(SELECT " + " cons.CODE FROM CAT_STATION cStation "
                + " LEFT JOIN CONSTRUCTION cons " + " ON cStation.CAT_STATION_ID = cons.CAT_STATION_ID "
                + " WHERE cStation.STATUS      =1 " + " AND cons.CODE =:maCT) " + "  ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("code", new StringType());
        query.addScalar("constructionId", new LongType());
        query.setParameter("maTram", maTram);
        query.setParameter("maCT", maCT);
//		query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));
        List<ConstructionDTO> re = query.list();
        if (!re.isEmpty()) {
            return true;
        } else {
            return false;
        }

    }

    public ContructionLandHandoverPlanDtoSearch getDtoId(ContructionLandHandoverPlanDtoSearch obj) {
        StringBuilder sql = new StringBuilder(
                "SELECT name name, sys_GROUP_ID id from CTCT_CAT_OWNER.SYS_GROUP where upper(code) = :code ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("name", new StringType());
        query.addScalar("id", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(ContructionLandHandoverPlanDtoSearch.class));
        return (ContructionLandHandoverPlanDtoSearch) query.uniqueResult();
    }

    public Long getIdMaTram(String catStationCode) {
        StringBuilder sql = new StringBuilder(
                "SELECT CAT_STATION_ID id from CTCT_CAT_OWNER.CAT_STATION where upper(code) = :code ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("id", new LongType());
        query.setParameter("code", catStationCode.toUpperCase());
        return (Long) query.uniqueResult();
    }

    public Long getIdMaCongTrinh(String contructionCode) {
        StringBuilder sql = new StringBuilder("SELECT CONSTRUCTION_ID id from CONSTRUCTION where upper(code) = :code ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("id", new LongType());
        query.setParameter("code", contructionCode.toUpperCase());
        return (Long) query.uniqueResult();
    }

    public Long getIdMaDoiTac(String catPartnerCode) {
        StringBuilder sql = new StringBuilder(
                "SELECT CAT_PARTNER_ID id from CTCT_CAT_OWNER.CAT_PARTNER where upper(code) = :code ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("id", new LongType());
        query.setParameter("code", catPartnerCode.toUpperCase());
        return (Long) query.uniqueResult();
    }

    public Long getIdDonvi(String sysGroupCode) {
        StringBuilder sql = new StringBuilder(
                "SELECT SYS_GROUP_ID id from CTCT_CAT_OWNER.SYS_GROUP where upper(code) = :code ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("id", new LongType());
        query.setParameter("code", sysGroupCode.toUpperCase());
        List<Long> listId = query.list();
        return listId.get(0);
    }

    public boolean checkMonthYear(Long month, Long year, Long catStationId, Long constructionId,
                                  Long contructionLandHanPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT COUNT(CONTRUCTION_LAND_HAN_PLAN_ID) FROM CONTRUCTION_LAND_HANDOVER_PLAN where 1=1 and month =:month and year =:year "
                        + " and CAT_STATION_ID =:catStationId and CONSTRUCTION_ID =:constructionId ");
        if (contructionLandHanPlanId != null) {
            sql.append(" AND CONTRUCTION_LAND_HAN_PLAN_ID != :contructionLandHanPlanId ");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("month", month);
        query.setParameter("year", year);
        query.setParameter("catStationId", catStationId);
        query.setParameter("constructionId", constructionId);
        if (contructionLandHanPlanId != null) {
            query.setParameter("contructionLandHanPlanId", contructionLandHanPlanId);
        }
        return ((BigDecimal) query.uniqueResult()).intValue() > 0;
    }

    public boolean checkImport(Long month, Long year, Long catStationId, Long constructionId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT COUNT(CONSTRUCTION_ID) FROM CONTRUCTION_LAND_HANDOVER_PLAN where 1=1 and month =:month and year =:year "
                        + " and CAT_STATION_ID =:catStationId and CONSTRUCTION_ID =:constructionId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("month", month);
        query.setParameter("year", year);
        query.setParameter("catStationId", catStationId);
        query.setParameter("constructionId", constructionId);
        return ((BigDecimal) query.uniqueResult()).intValue() > 0;
    }

    public String getConstructionCode(Long constructionId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "select code constructionCode from CONSTRUCTION con where CONSTRUCTION_ID=:constructionId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", constructionId);
        query.addScalar("constructionCode", new StringType());
        return (String) query.uniqueResult();
    }

}
