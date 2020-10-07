/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.asset.dto.SysGroupDto;
import com.viettel.cat.dto.CatPartnerDTO;
import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.bo.ConstructionBO;
import com.viettel.coms.bo.UtilAttachDocumentBO;
import com.viettel.coms.dto.*;
import com.viettel.coms.utils.ValidateUtils;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.utils.ImageUtil;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@EnableTransactionManagement
@Transactional
@Repository("constructionDAO")
public class ConstructionDAO extends BaseFWDAOImpl<ConstructionBO, Long> {
	@Autowired
	private UtilAttachDocumentDAO utilAttachDocumentDAO;

	@Value("${folder_upload2}")
	private String folderUpload;

	@Value("${input_image_sub_folder_upload}")
	private String input_image_sub_folder_upload;
	@Value("${folder_upload2}")
	private String folder2Upload;
	@Value("${default_sub_folder_upload}")
	private String defaultSubFolderUpload;

    private Query setParameter;

    public ConstructionDAO() {
        this.model = new ConstructionBO();
    }

    public ConstructionDAO(Session session) {
        this.session = session;
    }

    public List<CatConstructionTypeDTO> getCatConstructionType() {
        String sql = "SELECT " + " ST.CAT_CONSTRUCTION_TYPE_ID id" + " ,ST.NAME name" + " ,ST.CODE code"
                + " FROM CTCT_CAT_OWNER.CAT_CONSTRUCTION_TYPE ST" + " WHERE ST.STATUS=1 ";

        StringBuilder stringBuilder = new StringBuilder(sql);
        stringBuilder.append(" ORDER BY ST.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("id", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(CatConstructionTypeDTO.class));

        return query.list();
    }

    // chinhpxn 20180605 start

    public SysGroupDto getSysGroupInfo(Long id) {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append("(CASE WHEN SYS.GROUP_LEVEL=4 THEN ");
        stringBuilder.append("(SELECT SYS_GROUP_ID FROM SYS_GROUP A WHERE A.SYS_GROUP_ID= ");
        stringBuilder.append("(SELECT PARENT_ID FROM SYS_GROUP A WHERE A.SYS_GROUP_ID=SYS.PARENT_ID)) ");
        stringBuilder.append("WHEN SYS.GROUP_LEVEL=3 THEN ");
        stringBuilder.append("(SELECT SYS_GROUP_ID FROM SYS_GROUP A WHERE A.SYS_GROUP_ID=SYS.PARENT_ID) ");
        stringBuilder.append("ELSE SYS.SYS_GROUP_ID END ) GroupId, ");
        stringBuilder.append("(CASE WHEN SYS.GROUP_LEVEL=4 THEN ");
        stringBuilder.append("(SELECT NAME FROM SYS_GROUP A WHERE A.SYS_GROUP_ID= ");
        stringBuilder.append("(SELECT PARENT_ID FROM SYS_GROUP A WHERE A.SYS_GROUP_ID=SYS.PARENT_ID)) ");
        stringBuilder.append("WHEN SYS.GROUP_LEVEL=3 THEN ");
        stringBuilder.append("(SELECT NAME FROM SYS_GROUP A WHERE A.SYS_GROUP_ID=SYS.PARENT_ID) ");
        stringBuilder.append("ELSE SYS.NAME END ) Name ");
        stringBuilder.append("FROM SYS_USER US,SYS_GROUP SYS WHERE US.SYS_GROUP_ID=SYS.SYS_GROUP_ID AND ");
        if (null != id) {
            stringBuilder.append("US.SYS_USER_ID = :id ");
        }

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("GroupId", new LongType());
        query.addScalar("Name", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(SysGroupDto.class));
        if (null != id) {
            query.setParameter("id", id);
        }
        return (SysGroupDto) query.uniqueResult();
    }

    public Long updateDayHshc(ConstructionDetailDTO obj) {
        try {

            String sql2 = "update CONSTRUCTION set RECEIVE_RECORDS_DATE=:receiveRecordsDate where CODE =:constructionCode ";
            SQLQuery query2 = getSession().createSQLQuery(sql2);
            Date x = obj.getReceiveRecordsDate();
            String a = obj.getConstructionCode();
            SimpleDateFormat date_format = new SimpleDateFormat("dd/MM/yyyy");

            query2.setParameter("receiveRecordsDate", obj.getReceiveRecordsDate());
            query2.setParameter("constructionCode", obj.getConstructionCode());
            query2.executeUpdate();
            return 1L;
        } catch (Exception e) {
            e.getMessage();
            return 0L;
        }
    }

    public List<ConstructionDetailDTO> getCatConstructionTypeForImport() {
        String sql = "SELECT CAT_CONSTRUCTION_TYPE_ID catConstructionTypeId, NAME name, CODE code FROM CAT_CONSTRUCTION_TYPE WHERE STATUS = 1";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("catConstructionTypeId", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
        return query.list();
    }

    public List<CatStationDTO> getCatStationForImport(List<String> ls) {
        String sql = "SELECT " + " ST.CAT_STATION_ID id" + " ,ST.Type type" + " ,ST.ADDRESS address" + " ,ST.NAME name"
                + " ,ST.CODE code" + " FROM CTCT_CAT_OWNER.CAT_STATION ST"
                + " WHERE ST.STATUS=1  AND ST.CAT_PROVINCE_ID in :ls " + " AND (ST.TYPE = 1 OR ST.TYPE = 2)";

        StringBuilder stringBuilder = new StringBuilder(sql);

        stringBuilder.append(" ORDER BY ST.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("id", new LongType());
        query.addScalar("address", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("type", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(CatStationDTO.class));
        query.setParameterList("ls", ls);

        return query.list();
    }

    public List<DepartmentDTO> getDepartmentForImport() {
        String sql = "SELECT " + " ST.SYS_GROUP_ID id" + ",(ST.CODE ||'-' || ST.NAME) text" + " ,ST.NAME name"
                + " ,ST.CODE code" + " FROM CTCT_CAT_OWNER.SYS_GROUP ST" + " WHERE ST.STATUS=1 ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("id", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("text", new StringType());
        query.addScalar("code", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));

        return query.list();
    }

    // chinhpxn 20180605 end

    public List<CatStationDTO> getCatStation(CatStationDTO obj, List<String> ls) {
        String sql = "SELECT " + " ST.CAT_STATION_ID id" + " ,ST.ADDRESS address" + " ,ST.NAME name" + " ,ST.CODE code"
                + " FROM CTCT_CAT_OWNER.CAT_STATION ST" + " WHERE ST.STATUS=1  AND ST.CAT_PROVINCE_ID in :ls ";

        StringBuilder stringBuilder = new StringBuilder(sql);

        stringBuilder.append(" AND ROWNUM <=10 ");
        if (StringUtils.isNotEmpty(obj.getName())) {
            stringBuilder.append(" AND upper(ST.CODE) LIKE upper(:name) escape '&'");
        }
        if (StringUtils.isNotEmpty(obj.getType())) {
            stringBuilder.append(" AND ST.TYPE =:type");
        }

        stringBuilder.append(" ORDER BY ST.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("id", new LongType());
        query.addScalar("address", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(CatStationDTO.class));
        query.setParameterList("ls", ls);
        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
        }
        if (StringUtils.isNotEmpty(obj.getType())) {
            query.setParameter("type", obj.getType());
        }

        return query.list();
    }

    public List<ConstructionDetailDTO> doSearchData(ConstructionDetailDTO obj, List<String> sysGroupId) {
        StringBuilder sql = new StringBuilder("SELECT distinct cons.CONSTRUCTION_ID constructionId,"
                + " cons.NAME name," + "cons.CODE code," + "cons.COMPLETE_DATE completeDate," + "cons.STATUS status, "
                + "cons.SYS_GROUP_ID sysGroupId, " + "cons.STARTING_DATE startingDate, "
                + "cons.EXCPECTED_COMPLETE_DATE excpectedCompleteDate, " + " consType.NAME catContructionTypeName,"
                + " consType.CAT_CONSTRUCTION_TYPE_ID catContructionTypeId, " + " ST.SYS_GROUP_ID receiveGroupId, "
                + " ST.NAME receiveGroupName, " + " catStation.CODE catStationCode, "
                + " catPro.CAT_PROVINCE_ID catProvinceId " + " From CONSTRUCTION cons "
                + " LEFT JOIN CAT_CONSTRUCTION_TYPE consType ON cons.CAT_CONSTRUCTION_TYPE_ID = consType.CAT_CONSTRUCTION_TYPE_ID "
                + " LEFT JOIN CAT_STATION catStation  ON cons.CAT_STATION_ID = catStation.CAT_STATION_ID "
                + " LEFT JOIN cat_province catPro ON catPro.CAT_PROVINCE_ID   = catStation.CAT_PROVINCE_ID "
                + " LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP ST ON  ST.SYS_GROUP_ID       =cons.SYS_GROUP_ID "
                + " LEFT JOIN CNT_CONSTR_WORK_ITEM_TASK cntConstrWorkitemTask"
                + " ON cntConstrWorkitemTask.CONSTRUCTION_ID=cons.CONSTRUCTION_ID"
                + " AND cntConstrWorkitemTask.STATUS        =1" + " LEFT JOIN CNT_CONTRACT cntContract"
                + " ON cntContract.CNT_CONTRACT_ID=cntConstrWorkitemTask.CNT_CONTRACT_ID"
                + " AND cntContract.CONTRACT_TYPE =0" + " WHERE 1=1 ");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (upper(cons.CODE) LIKE upper(:keySearch) " + "OR upper(cons.NAME) LIKE upper(:keySearch)  "
                    + "OR upper(catStation.CODE) LIKE upper(:keySearch) "
                    + "OR upper(catPro.CODE) LIKE upper(:keySearch)"
                    + "OR upper(cntContract.CODE) LIKE upper(:keySearch)" + ")");
        }
        if (StringUtils.isNotEmpty(obj.getStatuVuong())) {
            sql.append(" And cons.Obstructed_state =  :statuVuong ");
        }
        if (obj.getListStatus() != null && !obj.getListStatus().isEmpty()) {
            sql.append(" AND cons.STATUS in :listStatus");
        } else {
            sql.append(" AND cons.STATUS > -1 ");
        }
        if (obj.getObstructedStateList() != null && !obj.getObstructedStateList().isEmpty()) {
            sql.append(" AND cons.OBSTRUCTED_STATE  in :obstructedStateList");
        }
        if (obj.getListCatConstructionType() != null && !obj.getListCatConstructionType().isEmpty()) {
            sql.append(" AND cons.CAT_CONSTRUCTION_TYPE_ID  in :listCatConstructionType");
        }
        if (obj.getSysGroupId() != null) {
            sql.append(" and cons.SYS_GROUP_ID = :sysGroupId");
        }
        if (obj.getCatProvinceId() != null) {
            sql.append(" AND catPro.CAT_PROVINCE_ID = :catProvinceId ");
        }
        sql.append(" ORDER BY cons.CONSTRUCTION_ID DESC");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("completeDate", new DateType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("catContructionTypeName", new StringType());
        query.addScalar("catContructionTypeId", new LongType());
        query.addScalar("receiveGroupId", new LongType());
        query.addScalar("receiveGroupName", new StringType());
        query.addScalar("excpectedCompleteDate", new DateType());
        query.addScalar("startingDate", new DateType());
        query.addScalar("catProvinceId", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        if (StringUtils.isNotEmpty(obj.getStatuVuong())) {
            query.setParameter("statuVuong", obj.getStatuVuong());
            queryCount.setParameter("statuVuong", obj.getStatuVuong());
        }
        if (obj.getCatProvinceId() != null) {
            query.setParameter("catProvinceId", obj.getCatProvinceId());
            queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
        }
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", Long.parseLong(obj.getSysGroupId()));
            queryCount.setParameter("sysGroupId", Long.parseLong(obj.getSysGroupId()));
        }
        if (obj.getListStatus() != null && !obj.getListStatus().isEmpty()) {
            query.setParameterList("listStatus", obj.getListStatus());
            queryCount.setParameterList("listStatus", obj.getListStatus());
        }
        if (obj.getListCatConstructionType() != null && !obj.getListCatConstructionType().isEmpty()) {
            query.setParameterList("listCatConstructionType", obj.getListCatConstructionType());
            queryCount.setParameterList("listCatConstructionType", obj.getListCatConstructionType());
        }
        if (obj.getObstructedStateList() != null && !obj.getObstructedStateList().isEmpty()) {
            query.setParameterList("obstructedStateList", obj.getObstructedStateList());
            queryCount.setParameterList("obstructedStateList", obj.getObstructedStateList());
        }
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    // hoanm1_20180810_start
    public List<ConstructionDetailDTO> doSearchDataConstruction(ConstructionDetailDTO obj, List<String> provinceCode) {
        StringBuilder sql = new StringBuilder("SELECT distinct cons.CONSTRUCTION_ID constructionId,"
                + " cons.NAME name," + "cons.IS_BUILDING_PERMIT isBuildingPermit," + "cons.CODE code," + "cons.COMPLETE_DATE completeDate," + "cons.STATUS status, "  //Huypq-thêm trường isBuildingPermit
                + "cons.SYS_GROUP_ID sysGroupId, " + "cons.STARTING_DATE startingDate, "
                + "cons.EXCPECTED_COMPLETE_DATE excpectedCompleteDate, " + " consType.NAME catContructionTypeName,"
                + " consType.CAT_CONSTRUCTION_TYPE_ID catContructionTypeId, " + " ST.SYS_GROUP_ID receiveGroupId, "
                + " ST.NAME receiveGroupName, " + " catStation.CODE catStationCode, "
                + " catPro.CAT_PROVINCE_ID catProvinceId, "
                + " catPro.NAME provinceName "
                + " From CONSTRUCTION cons "
                + " LEFT JOIN CAT_CONSTRUCTION_TYPE consType ON cons.CAT_CONSTRUCTION_TYPE_ID = consType.CAT_CONSTRUCTION_TYPE_ID "
                + " LEFT JOIN CAT_STATION catStation  ON cons.CAT_STATION_ID = catStation.CAT_STATION_ID "
                + " LEFT JOIN cat_province catPro ON catPro.CAT_PROVINCE_ID   = catStation.CAT_PROVINCE_ID "
                + " LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP ST ON  ST.SYS_GROUP_ID       =cons.SYS_GROUP_ID "
                + " LEFT JOIN CNT_CONSTR_WORK_ITEM_TASK cntConstrWorkitemTask"
                + " ON cntConstrWorkitemTask.CONSTRUCTION_ID=cons.CONSTRUCTION_ID"
                + " AND cntConstrWorkitemTask.STATUS        =1"
                + " LEFT JOIN CNT_CONTRACT cntContract"
                + " ON cntContract.CNT_CONTRACT_ID=cntConstrWorkitemTask.CNT_CONTRACT_ID"
                + " AND cntContract.CONTRACT_TYPE =0"
                + " WHERE 1=1 ");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (upper(cons.CODE) LIKE upper(:keySearch) " + "OR upper(cons.NAME) LIKE upper(:keySearch)  "
                    + "OR upper(catStation.CODE) LIKE upper(:keySearch) "
                    + "OR upper(catPro.CODE) LIKE upper(:keySearch)"
                    + "OR upper(cntContract.CODE) LIKE upper(:keySearch)" + ")");
        }
        if (StringUtils.isNotEmpty(obj.getStatuVuong())) {
            sql.append(" And cons.Obstructed_state =  :statuVuong ");
        }
        if (obj.getListStatus() != null && !obj.getListStatus().isEmpty()) {
            sql.append(" AND cons.STATUS in :listStatus");
        } else {
            sql.append(" AND cons.STATUS > -1 ");
        }
        if (obj.getObstructedStateList() != null && !obj.getObstructedStateList().isEmpty()) {
            sql.append(" AND cons.OBSTRUCTED_STATE  in :obstructedStateList");
        }
        if (obj.getListCatConstructionType() != null && !obj.getListCatConstructionType().isEmpty()) {
            sql.append(" AND cons.CAT_CONSTRUCTION_TYPE_ID  in :listCatConstructionType");
        }
        if (obj.getSysGroupId() != null) {
            sql.append(" and cons.SYS_GROUP_ID = :sysGroupId");
        }
        if (provinceCode != null) {
            sql.append(" AND catPro.CAT_PROVINCE_ID in :listCatProvinceId ");
        }
        if (obj.getCatProvinceId() != null) {
            sql.append(" AND catPro.CAT_PROVINCE_ID = :catProvinceId ");
        }
        sql.append(" ORDER BY cons.CONSTRUCTION_ID DESC");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("isBuildingPermit", new StringType()); //Huypq-thêm trường isBuildingPermit
        query.addScalar("completeDate", new DateType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("catContructionTypeName", new StringType());
        query.addScalar("catContructionTypeId", new LongType());
        query.addScalar("receiveGroupId", new LongType());
        query.addScalar("receiveGroupName", new StringType());
        query.addScalar("excpectedCompleteDate", new DateType());
        query.addScalar("startingDate", new DateType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("provinceName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        if (StringUtils.isNotEmpty(obj.getStatuVuong())) {
            query.setParameter("statuVuong", obj.getStatuVuong());
            queryCount.setParameter("statuVuong", obj.getStatuVuong());
        }
        if (provinceCode != null) {
            query.setParameterList("listCatProvinceId", provinceCode);
            queryCount.setParameterList("listCatProvinceId", provinceCode);
        }
        if (obj.getCatProvinceId() != null) {
            query.setParameter("catProvinceId", obj.getCatProvinceId());
            queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
        }
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", Long.parseLong(obj.getSysGroupId()));
            queryCount.setParameter("sysGroupId", Long.parseLong(obj.getSysGroupId()));
        }
        if (obj.getListStatus() != null && !obj.getListStatus().isEmpty()) {
            query.setParameterList("listStatus", obj.getListStatus());
            queryCount.setParameterList("listStatus", obj.getListStatus());
        }
        if (obj.getListCatConstructionType() != null && !obj.getListCatConstructionType().isEmpty()) {
            query.setParameterList("listCatConstructionType", obj.getListCatConstructionType());
            queryCount.setParameterList("listCatConstructionType", obj.getListCatConstructionType());
        }
        if (obj.getObstructedStateList() != null && !obj.getObstructedStateList().isEmpty()) {
            query.setParameterList("obstructedStateList", obj.getObstructedStateList());
            queryCount.setParameterList("obstructedStateList", obj.getObstructedStateList());
        }
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    // hoanm1_20180810_end

    // chinhxpn20180706_start
    public List<ConstructionDetailDTO> getConstructionForImportTask() {
        StringBuilder stringBuilder = new StringBuilder(" SELECT cons.CONSTRUCTION_ID constructionId, ");
        stringBuilder.append("   cons.CODE code ");
//        hoanm1_20181023_start
//        stringBuilder.append("   consType.CAT_CONSTRUCTION_TYPE_ID catContructionTypeId ");
        stringBuilder.append(" FROM CONSTRUCTION cons ");
//        stringBuilder.append(" LEFT JOIN CAT_CONSTRUCTION_TYPE consType ");
//        stringBuilder.append(" ON cons.CAT_CONSTRUCTION_TYPE_ID = consType.CAT_CONSTRUCTION_TYPE_ID ");
//        stringBuilder.append(" LEFT JOIN CNT_CONSTR_WORK_ITEM_TASK cntConstrWorkitemTask ");
//        stringBuilder.append(" ON cntConstrWorkitemTask.CONSTRUCTION_ID=cons.CONSTRUCTION_ID ");
//        stringBuilder.append(" AND cntConstrWorkitemTask.STATUS        =1 ");
//        stringBuilder.append(" LEFT JOIN CNT_CONTRACT cntContract ");
//        stringBuilder.append(" ON cntContract.CNT_CONTRACT_ID=cntConstrWorkitemTask.CNT_CONTRACT_ID ");
//        stringBuilder.append(" AND cntContract.CONTRACT_TYPE =0 ");
        stringBuilder.append(" WHERE 1                       =1 ");
        stringBuilder.append(" AND cons.STATUS               != 0 ");
//        stringBuilder.append(" ORDER BY cons.CONSTRUCTION_ID DESC ");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
//        query.addScalar("catContructionTypeId", new LongType());
//        hoanm1_20181023_end
        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));

        return query.list();
    }

    public List<ConstructionDetailDTO> getConstructionForImport() {
        StringBuilder stringBuilder = new StringBuilder(" SELECT cons.CONSTRUCTION_ID constructionId, ");
        stringBuilder.append("   cons.CODE code, ");
        stringBuilder.append("   consType.CAT_CONSTRUCTION_TYPE_ID catContructionTypeId ");
        stringBuilder.append(" FROM CONSTRUCTION cons ");
        stringBuilder.append(" LEFT JOIN CAT_CONSTRUCTION_TYPE consType ");
        stringBuilder.append(" ON cons.CAT_CONSTRUCTION_TYPE_ID = consType.CAT_CONSTRUCTION_TYPE_ID ");
//        stringBuilder.append(" LEFT JOIN CNT_CONSTR_WORK_ITEM_TASK cntConstrWorkitemTask ");
//        stringBuilder.append(" ON cntConstrWorkitemTask.CONSTRUCTION_ID=cons.CONSTRUCTION_ID ");
//        stringBuilder.append(" AND cntConstrWorkitemTask.STATUS        =1 ");
//        stringBuilder.append(" LEFT JOIN CNT_CONTRACT cntContract ");
//        stringBuilder.append(" ON cntContract.CNT_CONTRACT_ID=cntConstrWorkitemTask.CNT_CONTRACT_ID ");
//        stringBuilder.append(" AND cntContract.CONTRACT_TYPE =0 ");
        stringBuilder.append(" WHERE 1                       =1 ");
        stringBuilder.append(" AND cons.STATUS               > -1 ");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("catContructionTypeId", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));

        return query.list();
    }
    // chinhpxn20180706_end

    // chinhpxn 20180607 start
    public List<WorkItemDetailDTO> getCatWorkItemType() {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT T1.CAT_WORK_ITEM_TYPE_ID catWorkItemTypeId, ");
        sql.append("T1.NAME name, ");
        sql.append("T1.CODE code, ");
        sql.append("T1.CAT_WORK_ITEM_GROUP_ID catWorkItemGroupId, ");
        sql.append("T1.CAT_CONSTRUCTION_TYPE_ID catConstructionTypeId, ");
        sql.append("T2.NAME catConstructionTypeName ");
        sql.append("FROM CAT_WORK_ITEM_TYPE T1 ");
        sql.append(
                "LEFT JOIN CAT_CONSTRUCTION_TYPE T2 ON T1.CAT_CONSTRUCTION_TYPE_ID = T2.CAT_CONSTRUCTION_TYPE_ID WHERE T1.STATUS = 1");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
 
        query.addScalar("catWorkItemTypeId", new LongType());
        query.addScalar("catWorkItemGroupId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("catConstructionTypeId", new LongType());
        query.addScalar("catConstructionTypeName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));

        return query.list();
    }

    public List<WorkItemDetailDTO> getWorkItem() {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT WORK_ITEM_ID workItemId, CODE code, CONSTRUCTION_ID constructionId ");
        sql.append("FROM WORK_ITEM");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("workItemId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("constructionId", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        return query.list();
    }

    public List<SysGroupDto> getSysGroupForImport() {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT SYS_GROUP_ID groupId, ");
        sql.append("Code groupCode, ");
        sql.append("NAME name, ");
        sql.append("GROUP_NAME_LEVEL1 groupNameLevel1, ");
        sql.append("GROUP_NAME_LEVEL2 groupNameLevel2, ");
        sql.append("GROUP_NAME_LEVEL3 groupNameLevel3 ");
        sql.append("FROM SYS_GROUP WHERE GROUP_LEVEL IN (1,2) AND STATUS=1 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("groupId", new LongType());
        query.addScalar("groupCode", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("groupNameLevel1", new StringType());
        query.addScalar("groupNameLevel2", new StringType());
        query.addScalar("groupNameLevel3", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(SysGroupDto.class));
        return query.list();
    }

    public List<CatPartnerDTO> getCatPartnerForImport() {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT CAT_PARTNER_ID catPartnerId, Code code, Name name FROM CAT_PARTNER WHERE STATUS=1");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("catPartnerId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(CatPartnerDTO.class));
        return query.list();
    }

    // chinhpxn 20180607 end

    public List<ConstructionDetailDTO> doSearch(ConstructionDetailDTO obj, List<String> sysGroupId) {
        StringBuilder sql = new StringBuilder("SELECT distinct cons.CONSTRUCTION_ID constructionId,"
                + " cons.NAME name," + "cons.CODE code," + "cons.COMPLETE_DATE completeDate," + "cons.STATUS status, "
                + "cons.SYS_GROUP_ID sysGroupId, " + "cons.STARTING_DATE startingDate, "
                + "cons.EXCPECTED_COMPLETE_DATE excpectedCompleteDate, " + " consType.NAME catContructionTypeName,"
                + " consType.CAT_CONSTRUCTION_TYPE_ID catContructionTypeId, " + " ST.SYS_GROUP_ID receiveGroupId, "
                + " ST.NAME receiveGroupName, " + "catStation.CODE catStationCode " + " From CONSTRUCTION cons "
                + " LEFT JOIN CAT_CONSTRUCTION_TYPE consType ON cons.CAT_CONSTRUCTION_TYPE_ID = consType.CAT_CONSTRUCTION_TYPE_ID "
                + " LEFT JOIN CAT_STATION catStation  ON cons.CAT_STATION_ID = catStation.CAT_STATION_ID "
                + " LEFT JOIN cat_province catPro ON catPro.CAT_PROVINCE_ID   = catStation.CAT_PROVINCE_ID "
                + " LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP ST ON  ST.SYS_GROUP_ID       =cons.SYS_GROUP_ID "
                + " LEFT JOIN CNT_CONSTR_WORK_ITEM_TASK cntConstrWorkitemTask"
                + " ON cntConstrWorkitemTask.CONSTRUCTION_ID=cons.CONSTRUCTION_ID"
                + " AND cntConstrWorkitemTask.STATUS        =1" + " LEFT JOIN CNT_CONTRACT cntContract"
                + " ON cntContract.CNT_CONTRACT_ID=cntConstrWorkitemTask.CNT_CONTRACT_ID"
                + " AND cntContract.CONTRACT_TYPE =0" + " WHERE 1=1 ");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (upper(cons.CODE) LIKE upper(:keySearch) " + "OR upper(cons.NAME) LIKE upper(:keySearch)  "
                    + "OR upper(catStation.CODE) LIKE upper(:keySearch) "
                    + "OR upper(catPro.CODE) LIKE upper(:keySearch)"
                    + "OR upper(cntContract.CODE) LIKE upper(:keySearch)" + ")");
        }
        if (StringUtils.isNotEmpty(obj.getStatuVuong())) {
            sql.append(" And cons.Obstructed_state =  :statuVuong ");
        }

        if (obj.getListStatus() != null && !obj.getListStatus().isEmpty()) {
            sql.append(" AND cons.STATUS in :listStatus");
        } else {
            sql.append(" AND cons.STATUS > 0 ");
        }

        if (obj.getObstructedStateList() != null && !obj.getObstructedStateList().isEmpty()) {
            sql.append(" AND cons.OBSTRUCTED_STATE  in :obstructedStateList");
        }
        if (obj.getListCatConstructionType() != null && !obj.getListCatConstructionType().isEmpty()) {
            sql.append(" AND cons.CAT_CONSTRUCTION_TYPE_ID  in :listCatConstructionType");
        }
        if (sysGroupId != null) {
            sql.append(" AND cons.SYS_GROUP_ID  in :sysGroupId ");
        }
        if (obj.getCatProvinceId() != null) {
            sql.append(" AND catStation.cat_province_id  =:provinceId ");
        }

        sql.append(" ORDER BY cons.CONSTRUCTION_ID DESC");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("completeDate", new DateType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("catContructionTypeName", new StringType());
        query.addScalar("catContructionTypeId", new LongType());
        query.addScalar("receiveGroupId", new LongType());
        query.addScalar("receiveGroupName", new StringType());
        query.addScalar("excpectedCompleteDate", new DateType());
        query.addScalar("startingDate", new DateType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
        // if (groupIdList != null && !groupIdList.isEmpty()) {
        // query.setParameterList("groupIdList", groupIdList);
        // queryCount.setParameterList("groupIdList", groupIdList);
        // }
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        if (StringUtils.isNotEmpty(obj.getStatuVuong())) {
            query.setParameter("statuVuong", obj.getStatuVuong());
            queryCount.setParameter("statuVuong", obj.getStatuVuong());
        }
        if (sysGroupId != null) {
            query.setParameterList("sysGroupId", sysGroupId);
            queryCount.setParameterList("sysGroupId", sysGroupId);
        }

        if (obj.getListStatus() != null && !obj.getListStatus().isEmpty()) {
            query.setParameterList("listStatus", obj.getListStatus());
            queryCount.setParameterList("listStatus", obj.getListStatus());
        }
        if (obj.getListCatConstructionType() != null && !obj.getListCatConstructionType().isEmpty()) {
            query.setParameterList("listCatConstructionType", obj.getListCatConstructionType());
            queryCount.setParameterList("listCatConstructionType", obj.getListCatConstructionType());
        }
        if (obj.getObstructedStateList() != null && !obj.getObstructedStateList().isEmpty()) {
            query.setParameterList("obstructedStateList", obj.getObstructedStateList());
            queryCount.setParameterList("obstructedStateList", obj.getObstructedStateList());
        }
        if (obj.getCatProvinceId() != null) {
        	 query.setParameter("provinceId", obj.getCatProvinceId());
             queryCount.setParameter("provinceId", obj.getCatProvinceId());
        }
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public List<ConstructionDetailDTO> rpDailyTaskConstruction(ConstructionDetailDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT distinct cons.CONSTRUCTION_ID constructionId,"
                + " cons.NAME name," + "cons.CODE code," + "cons.DESCRIPTION description,"
                + "cons.COMPLETE_DATE completeDate," + "cons.STATUS status, " + "cons.SYS_GROUP_ID sysGroupId, "
                + "cons.STARTING_DATE startingDate, " + "cons.EXCPECTED_COMPLETE_DATE excpectedCompleteDate, "
                + " consType.NAME catContructionTypeName," + " consType.CAT_CONSTRUCTION_TYPE_ID catContructionTypeId, "
                + " ST.SYS_GROUP_ID receiveGroupId, " + " ST.NAME receiveGroupName, "
                + "catStation.CODE catStationCode " + " From CONSTRUCTION cons "
                + " LEFT JOIN CAT_CONSTRUCTION_TYPE consType ON cons.CAT_CONSTRUCTION_TYPE_ID = consType.CAT_CONSTRUCTION_TYPE_ID "
                + " LEFT JOIN CAT_STATION catStation  ON cons.CAT_STATION_ID = catStation.CAT_STATION_ID "
                + " LEFT JOIN cat_province catPro ON catPro.CAT_PROVINCE_ID   = catStation.CAT_PROVINCE_ID "
                + " LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP ST ON  ST.SYS_GROUP_ID       =cons.SYS_GROUP_ID "
                + " LEFT JOIN CNT_CONSTR_WORK_ITEM_TASK cntConstrWorkitemTask"
                + " ON cntConstrWorkitemTask.CONSTRUCTION_ID=cons.CONSTRUCTION_ID"
                + " AND cntConstrWorkitemTask.STATUS        =1" + " LEFT JOIN CNT_CONTRACT cntContract"
                + " ON cntContract.CNT_CONTRACT_ID=cntConstrWorkitemTask.CNT_CONTRACT_ID"
                + " AND cntContract.CONTRACT_TYPE =0" + " WHERE 1=1 ");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (upper(cons.CODE) LIKE upper(:keySearch) " + "OR upper(cons.NAME) LIKE upper(:keySearch)  "
                    + "OR upper(catStation.CODE) LIKE upper(:keySearch) "
                    + "OR upper(catPro.CODE) LIKE upper(:keySearch)"
                    + "OR upper(cntContract.CODE) LIKE upper(:keySearch)" + ")");
        }
        if (StringUtils.isNotEmpty(obj.getStatuVuong())) {
            sql.append(" And cons.Obstructed_state =  :statuVuong ");
        }
        if (obj.getListStatus() != null && !obj.getListStatus().isEmpty()) {
            sql.append(" AND cons.STATUS in :listStatus");
        } else {
            sql.append(" AND cons.STATUS > 0 ");
        }
        if (obj.getObstructedStateList() != null && !obj.getObstructedStateList().isEmpty()) {
            sql.append(" AND cons.OBSTRUCTED_STATE  in :obstructedStateList");
        }
        if (obj.getListCatConstructionType() != null && !obj.getListCatConstructionType().isEmpty()) {
            sql.append(" AND cons.CAT_CONSTRUCTION_TYPE_ID  in :listCatConstructionType");
        }
        if (obj.getCatConstructionTypeId() != null) {
            sql.append(" And consType.CAT_CONSTRUCTION_TYPE_ID =  :catContructionTypeId ");
        }
        sql.append(" ORDER BY cons.CONSTRUCTION_ID DESC");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("completeDate", new DateType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("catContructionTypeName", new StringType());
        query.addScalar("catContructionTypeId", new LongType());
        query.addScalar("receiveGroupId", new LongType());
        query.addScalar("receiveGroupName", new StringType());
        query.addScalar("excpectedCompleteDate", new DateType());
        query.addScalar("startingDate", new DateType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        if (StringUtils.isNotEmpty(obj.getStatuVuong())) {
            query.setParameter("statuVuong", obj.getStatuVuong());
            queryCount.setParameter("statuVuong", obj.getStatuVuong());
        }
        if (obj.getListStatus() != null && !obj.getListStatus().isEmpty()) {
            query.setParameterList("listStatus", obj.getListStatus());
            queryCount.setParameterList("listStatus", obj.getListStatus());
        }
        if (obj.getListCatConstructionType() != null && !obj.getListCatConstructionType().isEmpty()) {
            query.setParameterList("listCatConstructionType", obj.getListCatConstructionType());
            queryCount.setParameterList("listCatConstructionType", obj.getListCatConstructionType());
        }
        if (obj.getObstructedStateList() != null && !obj.getObstructedStateList().isEmpty()) {
            query.setParameterList("obstructedStateList", obj.getObstructedStateList());
            queryCount.setParameterList("obstructedStateList", obj.getObstructedStateList());
        }
        if (obj.getCatConstructionTypeId() != null) {
            query.setParameter("catContructionTypeId", obj.getCatConstructionTypeId());
            queryCount.setParameter("catContructionTypeId", obj.getCatConstructionTypeId());
        }
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<ConstructionDetailDTO> doSearchDSTH(ConstructionDetailDTO obj, List<String> sysGroupId) {
        StringBuilder sql = new StringBuilder("SELECT distinct cons.CONSTRUCTION_ID constructionId,"
                + " cons.NAME name," + "cons.CODE code," + "cons.COMPLETE_DATE completeDate," + "cons.STATUS status, "
                + "cons.SYS_GROUP_ID sysGroupId, " + "cons.STARTING_DATE startingDate, "
                + "cons.EXCPECTED_COMPLETE_DATE excpectedCompleteDate, " + " consType.NAME catContructionTypeName,"
                + " consType.CAT_CONSTRUCTION_TYPE_ID catContructionTypeId, " + " ST.SYS_GROUP_ID receiveGroupId, "
                + " ST.NAME receiveGroupName, " + "catStation.CAT_STATION_ID catStationId, " + "catStation.CODE catStationCode " + " From CONSTRUCTION cons "
                + " LEFT JOIN CAT_CONSTRUCTION_TYPE consType ON cons.CAT_CONSTRUCTION_TYPE_ID = consType.CAT_CONSTRUCTION_TYPE_ID "
                + " LEFT JOIN CAT_STATION catStation  ON cons.CAT_STATION_ID = catStation.CAT_STATION_ID "
                + " LEFT JOIN cat_province catPro ON catPro.CAT_PROVINCE_ID   = catStation.CAT_PROVINCE_ID "
                + " LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP ST ON  ST.SYS_GROUP_ID       =cons.SYS_GROUP_ID "
                // +
                // " LEFT JOIN CNT_CONSTR_WORK_ITEM_TASK cntConstrWorkitemTask"
                // +
                // " ON cntConstrWorkitemTask.CONSTRUCTION_ID=cons.CONSTRUCTION_ID"
                // + " AND cntConstrWorkitemTask.STATUS =1"
                // + " LEFT JOIN CNT_CONTRACT cntContract"
                // +
                // " ON cntContract.CNT_CONTRACT_ID=cntConstrWorkitemTask.CNT_CONTRACT_ID"
                // + " AND cntContract.CONTRACT_TYPE =0"
                + " WHERE 1=1 ");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (upper(cons.CODE) LIKE upper(:keySearch) " + "OR upper(cons.NAME) LIKE upper(:keySearch)  "
                    + "OR upper(catStation.CODE) LIKE upper(:keySearch) "
                    + "OR upper(catPro.CODE) LIKE upper(:keySearch)"
                    // + "OR upper(cntContract.CODE) LIKE upper(:keySearch)"
                    + ")");
        }
        // if (StringUtils.isNotEmpty(obj.getStatuVuong())) {
        // sql.append(" And cons.Obstructed_state = :statuVuong ");
        // }

        // if (obj.getListStatus() != null && !obj.getListStatus().isEmpty()) {
        // sql.append(" AND cons.STATUS in :listStatus");
        // } else {
        // sql.append(" AND cons.STATUS > 0");
        // }

        // if (obj.getObstructedStateList() != null
        // && !obj.getObstructedStateList().isEmpty()) {
        // sql.append(" AND cons.OBSTRUCTED_STATE in :obstructedStateList");
        // }
        // if (obj.getListCatConstructionType() != null
        // && !obj.getListCatConstructionType().isEmpty()) {
        // sql.append(" AND cons.CAT_CONSTRUCTION_TYPE_ID in :listCatConstructionType");
        // }
        if (sysGroupId != null) {
            sql.append(" AND catPro.CAT_PROVINCE_ID in :sysGroupId ");
        }

        sql.append(" ORDER BY cons.CONSTRUCTION_ID DESC");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("completeDate", new DateType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("catStationId", new LongType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("catContructionTypeName", new StringType());
        query.addScalar("catContructionTypeId", new LongType());
        query.addScalar("receiveGroupId", new LongType());
        query.addScalar("receiveGroupName", new StringType());
        query.addScalar("excpectedCompleteDate", new DateType());
        query.addScalar("startingDate", new DateType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
        // if (groupIdList != null && !groupIdList.isEmpty()) {
        // query.setParameterList("groupIdList", groupIdList);
        // queryCount.setParameterList("groupIdList", groupIdList);
        // }
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        // if (StringUtils.isNotEmpty(obj.getStatuVuong())) {
        // query.setParameter("statuVuong", obj.getStatuVuong());
        // queryCount.setParameter("statuVuong", obj.getStatuVuong());
        // }
        if (sysGroupId != null) {
            query.setParameterList("sysGroupId", sysGroupId);
            queryCount.setParameterList("sysGroupId", sysGroupId);
        }

        // if (obj.getListStatus() != null && !obj.getListStatus().isEmpty()) {
        // query.setParameterList("listStatus", obj.getListStatus());
        // queryCount.setParameterList("listStatus", obj.getListStatus());
        // }
        // if (obj.getListCatConstructionType() != null
        // && !obj.getListCatConstructionType().isEmpty()) {
        // query.setParameterList("listCatConstructionType",
        // obj.getListCatConstructionType());
        // queryCount.setParameterList("listCatConstructionType",
        // obj.getListCatConstructionType());
        // }
        // if (obj.getObstructedStateList() != null
        // && !obj.getObstructedStateList().isEmpty()) {
        // query.setParameterList("obstructedStateList",
        // obj.getObstructedStateList());
        // queryCount.setParameterList("obstructedStateList",
        // obj.getObstructedStateList());
        // }
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public List<ConstructionDetailDTO> doSearch1(ConstructionDetailDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT cons.CONSTRUCTION_ID constructionId," + " cons.NAME name,"
                + "cons.CODE code," + "cons.COMPLETE_DATE completeDate," + "cons.STATUS status, "
                + "cons.SYS_GROUP_ID sysGroupId, " + " consType.NAME catContructionTypeName,"
                + " consType.CAT_CONSTRUCTION_TYPE_ID catContructionTypeId," + "catStation.CODE catStationCode "
                + " From CONSTRUCTION cons "
                + " LEFT JOIN CAT_CONSTRUCTION_TYPE consType ON cons.CAT_CONSTRUCTION_TYPE_ID = consType.CAT_CONSTRUCTION_TYPE_ID "
                + " LEFT JOIN CAT_STATION catStation  ON cons.CAT_STATION_ID = catStation.CAT_STATION_ID "
                + " LEFT JOIN cat_province catPro ON catPro.CAT_PROVINCE_ID   = catStation.CAT_PROVINCE_ID"
                + " WHERE 1=1 ");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(cons.CODE) LIKE upper(:keySearch) OR upper(cons.NAME) LIKE upper(:keySearch)  OR upper(catStation.CODE) LIKE upper(:keySearch) )");
        }
        if (StringUtils.isNotEmpty(obj.getStatuVuong())) {
            sql.append(" And cons.Obstructed_state =  :statuVuong ");
        }
        if (StringUtils.isNotEmpty(obj.getSysGroupId())) {
            sql.append(" AND cons.SYS_GROUP_ID = :sysGroupId");
        }

        if (obj.getListStatus() != null && !obj.getListStatus().isEmpty()) {
            sql.append(" AND cons.STATUS in :listStatus");
        } else {
            sql.append(" AND cons.STATUS > 0");
        }

        if (obj.getObstructedStateList() != null && !obj.getObstructedStateList().isEmpty()) {
            sql.append(" AND cons.OBSTRUCTED_STATE  in :obstructedStateList");
        }
        if (obj.getListCatConstructionType() != null && !obj.getListCatConstructionType().isEmpty()) {
            sql.append(" AND cons.CAT_CONSTRUCTION_TYPE_ID  in :listCatConstructionType");
        }

        sql.append(" ORDER BY cons.CONSTRUCTION_ID DESC");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("completeDate", new DateType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("sysGroupId", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("catContructionTypeName", new StringType());
        query.addScalar("catContructionTypeId", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        if (StringUtils.isNotEmpty(obj.getStatuVuong())) {
            query.setParameter("statuVuong", obj.getStatuVuong());
            queryCount.setParameter("statuVuong", obj.getStatuVuong());
        }
        if (StringUtils.isNotEmpty(obj.getSysGroupId())) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
        }

        if (obj.getListStatus() != null && !obj.getListStatus().isEmpty()) {
            query.setParameterList("listStatus", obj.getListStatus());
            queryCount.setParameterList("listStatus", obj.getListStatus());
        }
        if (obj.getListCatConstructionType() != null && !obj.getListCatConstructionType().isEmpty()) {
            query.setParameterList("listCatConstructionType", obj.getListCatConstructionType());
            queryCount.setParameterList("listCatConstructionType", obj.getListCatConstructionType());
        }
        if (obj.getObstructedStateList() != null && !obj.getObstructedStateList().isEmpty()) {
            query.setParameterList("obstructedStateList", obj.getObstructedStateList());
            queryCount.setParameterList("obstructedStateList", obj.getObstructedStateList());
        }
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public List<ConstructionMerchandiseDTO> searchMerchandise(ConstructionDetailDTO obj) {
        StringBuilder sql = new StringBuilder("");
        // chinhpxn20180620
        // sql.append(" SELECT ");
        // sql.append(" CONSTRUCTION_MERCHANDISE.MER_ENTITY_ID AS merEntityId, ");
        // sql.append(" CONSTRUCTION_MERCHANDISE.QUANTITY AS quantity, ");
        // sql.append(" CONSTRUCTION_MERCHANDISE.REMAIN_COUNT AS remainCount, ");
        // sql.append(" CONSTRUCTION_MERCHANDISE.GOODS_NAME AS goodsName, ");
        // sql.append(" CONSTRUCTION_MERCHANDISE.GOODS_CODE AS goodsCode, ");
        // sql.append(" CONSTRUCTION_MERCHANDISE.GOODS_UNIT_NAME AS goodsUnitName, ");
        // sql.append(" CONSTRUCTION_MERCHANDISE.SERIAL AS serial, ");
        // sql.append(" CONSTRUCTION_MERCHANDISE.GOODS_IS_SERIAL AS goodsIsSerial ");
        // sql.append(" FROM ");
        // sql.append(" CONSTRUCTION_MERCHANDISE ");
        // sql.append(" WHERE CONSTRUCTION_MERCHANDISE.TYPE=1 AND
        // CONSTRUCTION_MERCHANDISE.REMAIN_COUNT >0 AND
        // CONSTRUCTION_MERCHANDISE.CONSTRUCTION_ID = :constructionId ");
        sql.append(" SELECT * FROM ( ");
        sql.append(
                " select synDetail.GOODS_CODE goodsCode, synDetail.GOODS_NAME goodsName, synDetail.GOODS_UNIT_NAME goodsUnitName, synDetail.GOODS_IS_SERIAL goodsIsSerial, ");
        sql.append(" synDetailSerial.SERIAL serial, sum(nvl(synDetailSerial.AMOUNT,0) - ");
        sql.append(" nvl((select AMOUNT from ");
        sql.append(" SYN_STOCK_TRANS a, ");
        sql.append(" SYN_STOCK_TRANS_DETAIL_SERIAL b where ");
        sql.append(" a.SYN_STOCK_TRANS_ID=b.SYN_STOCK_TRANS_ID and a.type=1 and a.status=2 and ");
        sql.append(" b.MER_ENTITY_ID=synDetailSerial.MER_ENTITY_ID and a.CONSTRUCTION_CODE = :constructionCode ");
        sql.append(" ),0) - ");
        sql.append(" nvl(( ");
        sql.append(" select cst_mer.QUANTITY from construction_merchandise cst_mer where cst_mer.type=1 and ");
        sql.append(" cst_mer.MER_ENTITY_ID=synDetailSerial.MER_ENTITY_ID and cst_mer.CONSTRUCTION_ID= ");
        sql.append(" :id ");
        sql.append(" ),0) - ");
        sql.append(
                " nvl((select quantity from CONSTRUCTION_RETURN cstr where cstr.MER_ENTITY_ID=synDetailSerial.MER_ENTITY_ID and cstr.CONSTRUCTION_ID= ");
        sql.append(" :id) ,0)) ");
        sql.append(" slConLai ");
        sql.append(" from ");
        sql.append(" SYN_STOCK_TRANS syn ");
        sql.append(
                " left join SYN_STOCK_TRANS_DETAIL synDetail on syn.SYN_STOCK_TRANS_ID = synDetail.SYN_STOCK_TRANS_ID ");
        sql.append(
                " LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL synDetailSerial  ON synDetailSerial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID  ");
        sql.append(" and syn.TYPE=2 and syn.STATUS=2 and syn.CONFIRM=1 ");
        sql.append(" and syn.CONSTRUCTION_CODE = :constructionCode ");
        sql.append(
                " group by synDetail.GOODS_CODE,synDetail.GOODS_NAME, synDetail.GOODS_UNIT_NAME, synDetail.GOODS_IS_SERIAL, synDetailSerial.SERIAL ");
        sql.append("  ) ");
        sql.append("  WHERE SLCONLAI > 0 AND nvl(serial,'0') NOT IN ");
        sql.append("  (SELECT serial.SERIAL ");
        sql.append("  FROM SYN_STOCK_TRANS s ");
        sql.append("  LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
        sql.append("  ON s.SYN_STOCK_TRANS_ID   = serial.SYN_STOCK_TRANS_ID ");
        sql.append("  WHERE s.construction_code = :constructionCode ");
        sql.append("  AND s.TYPE                  = 1 ");
        sql.append("  AND s.status            = 2 ");
        sql.append("  AND serial.SERIAL IS NOT NULL) ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("slConLai", new DoubleType());
        query.addScalar("serial", new StringType());
        query.addScalar("goodsIsSerial", new StringType());
        // chinhpxn20180620
        query.setResultTransformer(Transformers.aliasToBean(ConstructionMerchandiseDTO.class));
        query.setParameter("constructionCode", obj.getCode());
        query.setParameter("id", obj.getConstructionId());
        return query.list();
    }

    // chinhpxn20180620
    public List<ConstructionMerchandiseDTO> searchMerchandiseForSave(ConstructionDetailDTO obj) {
        StringBuilder sql = new StringBuilder("");

        sql.append(
                " select synDetail.GOODS_CODE goodsCode, synDetail.GOODS_NAME goodsName, synDetail.GOODS_ID goodsId, synDetail.GOODS_UNIT_NAME goodsUnitName, synDetailSerial.MER_ENTITY_ID merEntityId, ");
        sql.append(" synDetailSerial.SERIAL serial, ");
        sql.append(" sum(nvl(synDetailSerial.AMOUNT,0) - ");
        sql.append(" nvl((select AMOUNT from ");
        sql.append(" SYN_STOCK_TRANS a, ");
        sql.append(" SYN_STOCK_TRANS_DETAIL_SERIAL b where ");
        sql.append(" a.SYN_STOCK_TRANS_ID=b.SYN_STOCK_TRANS_ID and a.type=1 and a.status=2 and ");
        sql.append(
                " b.MER_ENTITY_ID=synDetailSerial.MER_ENTITY_ID and b.CONSTRUCTION_CODE=synDetailSerial.CONSTRUCTION_CODE ");
        sql.append(" ),0) - ");
        sql.append(" nvl(( ");
        sql.append(" select cst_mer.QUANTITY from construction_merchandise cst_mer where cst_mer.type=1 and ");
        sql.append(" cst_mer.MER_ENTITY_ID=synDetailSerial.MER_ENTITY_ID and cst_mer.CONSTRUCTION_ID= ");
        sql.append(" :id ");
        sql.append(" ),0) - ");
        sql.append(
                " nvl((select quantity from CONSTRUCTION_RETURN cstr where cstr.MER_ENTITY_ID=synDetailSerial.MER_ENTITY_ID and cstr.CONSTRUCTION_ID= ");
        sql.append(" :id) ,0)) ");
        sql.append(" slConLai ");
        sql.append(" from ");
        sql.append(" SYN_STOCK_TRANS syn ");
        sql.append(
                " left join SYN_STOCK_TRANS_DETAIL synDetail on syn.SYN_STOCK_TRANS_ID = synDetail.SYN_STOCK_TRANS_ID ");
        sql.append(
                " LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL synDetailSerial  ON synDetailSerial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID  ");
        sql.append(" and syn.TYPE=2 and syn.STATUS=2 and syn.CONFIRM=1 ");
        sql.append(" and syn.CONSTRUCTION_CODE = :constructionCode ");
        sql.append(
                " group by synDetail.GOODS_CODE,synDetail.GOODS_NAME, synDetail.GOODS_UNIT_NAME, synDetail.GOODS_IS_SERIAL, synDetailSerial.MER_ENTITY_ID, synDetailSerial.SERIAL, synDetail.GOODS_ID ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("slConLai", new DoubleType());
        query.addScalar("merEntityId", new LongType());
        query.addScalar("serial", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionMerchandiseDTO.class));
        query.setParameter("constructionCode", obj.getCode());
        query.setParameter("id", obj.getConstructionId());
        return query.list();
    }

    // chinhpxn20180620

    public List<WorkItemDetailDTO> doSearchWorkItem(ConstructionDetailDTO obj) {
        StringBuilder sql = new StringBuilder("");
        sql.append(" SELECT  ");
        sql.append(" 	WORK_ITEM.WORK_ITEM_ID AS workItemId, ");
        sql.append(" 	WORK_ITEM.NAME AS name, ");
        sql.append(" 	WORK_ITEM.CODE AS code, ");
        sql.append(" 	WORK_ITEM.IS_INTERNAL AS isInternal, ");
        sql.append(" 	WORK_ITEM.CAT_WORK_ITEM_TYPE_ID AS catWorkItemTypeId, ");
        sql.append(" 	WORK_ITEM.SUPERVISOR_ID AS supervisorId, ");
        sql.append(" 	WORK_ITEM.CONSTRUCTOR_ID AS contructorId, ");
        sql.append(" 	WORK_ITEM.STATUS AS status, ");
        sql.append(" 	supervi.NAME AS supervisorName, ");
        sql.append(" 	constr1.NAME AS contructorName1, ");
        sql.append(" 	constr2.NAME AS contructorName2 ");
        sql.append(" FROM ");
        sql.append(" 	WORK_ITEM ");
        sql.append(" 	LEFT JOIN SYS_GROUP supervi ");
        sql.append("		ON supervi.SYS_GROUP_ID = WORK_ITEM.SUPERVISOR_ID  ");
        sql.append(" 	LEFT JOIN SYS_GROUP constr1 ");
        sql.append(" 		ON constr1.SYS_GROUP_ID = WORK_ITEM.CONSTRUCTOR_ID ");
        sql.append(" 	LEFT JOIN CAT_PARTNER constr2 ");
        sql.append(" 		ON constr2.CAT_PARTNER_ID = WORK_ITEM.CONSTRUCTOR_ID ");
        sql.append(" WHERE ");
        sql.append(" 	WORK_ITEM.CONSTRUCTION_ID = :constructionId ");

        if (StringUtils.isNotEmpty(obj.getWorkItemCodeorType())) {
            sql.append(" AND (WORK_ITEM.CODE like :workItemCodeorType)");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("workItemId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("contructorId", new StringType());
        query.addScalar("contructorName1", new StringType());
        query.addScalar("contructorName2", new StringType());
        query.addScalar("supervisorId", new StringType());
        query.addScalar("supervisorName", new StringType());
        query.addScalar("price", new StringType());
        query.addScalar("workday", new StringType());
        query.addScalar("isInternal", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));

        query.setParameter("constructionId", obj.getConstructionId());
        if (StringUtils.isNotEmpty(obj.getWorkItemCodeorType())) {
            query.setParameter("workItemCodeorType", obj.getWorkItemCodeorType());
        }

        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public void remove(ConstructionDetailDTO obj) {
        StringBuilder sql = new StringBuilder(
                "UPDATE CONSTRUCTION set status = 0" + ",UPDATED_DATE = sysDate" + ",UPDATED_USER_ID = :userId"
                        + ",UPDATED_GROUP_ID = :groupId" + "  where CONSTRUCTION_ID = :constructionId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", obj.getConstructionId());
        query.setParameter("userId", obj.getUpdatedUserId());
        query.setParameter("groupId", obj.getUpdatedGroupId());
        query.executeUpdate();

    }

    public boolean checkNameCode(String code, Long constructionId) {
        StringBuilder sql = new StringBuilder(
                "SELECT COUNT(CONSTRUCTION_ID) FROM CONSTRUCTION where 1=1 AND (upper(code) LIKE upper(:code)) ");
        if (constructionId != null) {
            sql.append(" AND CONSTRUCTION_ID != :constructionId ");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("code", code);
        if (constructionId != null) {
            query.setParameter("constructionId", constructionId);
        }
        return ((BigDecimal) query.uniqueResult()).intValue() > 0;
    }

    public Long getProvinceIdByCatStation(Long catStationId) {
        if (catStationId == null) {
            return -1L;
        }
        StringBuilder sql = new StringBuilder(
                "SELECT catPro.CAT_PROVINCE_ID catProvinceId FROM CAT_PROVINCE catPro LEFT JOIN CAT_STATION catStation on catPro.CAT_PROVINCE_ID = catStation.CAT_PROVINCE_ID"
                        + " where catStation.CAT_STATION_ID =:catStationId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("catStationId", catStationId);
        query.addScalar("catProvinceId", new LongType());
        List<Long> list = query.list();
        if (list != null && !list.isEmpty()) {
            return list.get(0);
        }
        return -1L;
    }

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

    public ConstructionDetailDTO getConstructionById(Long id) {
        StringBuilder sql = new StringBuilder(
                "SELECT distinct cons.CONSTRUCTION_ID constructionId, catStation.CAT_STATION_ID catStationId,catProvince.CAT_PROVINCE_ID catProvinceId, "
                        + " cons.NAME name, " + " catProvince.CODE catProvince, " + "cons.CODE code, "
                        + "cons.STATUS status, " + " consType.CAT_CONSTRUCTION_TYPE_ID catConstructionTypeId, "
                        + "catStation.CODE catStationCode, " + "cons.REGION region, "
                        + " cons.STARTING_DATE startingDate, " + "cons.DESCRIPTION description, "
                        + "cons.CAT_CONSTRUCTION_DEPLOY_ID catConstructionDeployId, "
                        + "cons.obstructed_Content obstructedContent, " + "cons.obstructed_State obstructedState, "
                        + "cons.IS_OBSTRUCTED isObstructed, " + "CNT_CONSTR_WORK_ITEM_TASK.CODE cntContract, "
                        + "cons.starting_Note startingNote, " + "cons.BROADCASTING_DATE broadcastingDate, "
                        + "cons.excpected_Complete_Date excpectedCompleteDate, " + "cons.returner returner, "
                        + "cons.return_Date returnDate, " + "cons.handover_Note handoverNote, "
                        + "cons.handover_Date handoverDate, " + "cons.complete_Date completeDate, "
                        + "cons.DEPLOY_TYPE deployType, " + "cons.SYS_GROUP_ID sysGroupId, "
                        + "cons.Handover_date_build handoverDateBuild, " + "cons.HANDOVER_NOTE_BUILD handoverNoteBuild, "
                        + "cons.HANDOVER_DATE_ELECTRIC handoverDateElectric, " + "cons.HANDOVER_NOTE_ELECTRIC handoverNoteElectric, "
                        + "cons.BLUEPRINT_DATE blueprintDate, " + "cons.IS_BUILDING_PERMIT isBuildingPermit, "
                        + "cons.BUILDING_PERMIT_DATE buildingPermitDate, "
                        //hoangnh 171218 start
                        + "cons.AMOUNT_CABLE_RENT amountCableRent,"
                        + "cons.AMOUNT_CABLE_LIVE amountCableLive,"
                        + "cons.TOTAL_AMOUNT_CHEST totalAmountChest,"
                        + "cons.PRICE_CHEST priceChest,"
                        + "cons.TOTAL_AMOUNT_GATE totalAmountGate,"
                        + "cons.PRICE_GATE priceGate,"
                       //hoangnh 171218 end
                        // hungnx 20180621 start
                        + "cons.AMOUNT amount, " + "cons.PRICE price, " + "cons.MONEY_TYPE moneyType,"
                        + " (SELECT CTD.confirm FROM CONSTRUCTION c, WORK_ITEM w, CONSTRUCTION_TASK_DAILY ctd "
                        + " where C.CONSTRUCTION_ID = W.CONSTRUCTION_ID and CTD.WORK_ITEM_ID = W.WORK_ITEM_ID and "
                        + " C.CONSTRUCTION_ID = Cons.CONSTRUCTION_ID and rownum = 1) quantityByDate,"
                        + " (SELECT count(CTD.CONFIRM) FROM CONSTRUCTION c, WORK_ITEM w, CONSTRUCTION_TASK_DAILY ctd"
                        + " where C.CONSTRUCTION_ID = W.CONSTRUCTION_ID and CTD.WORK_ITEM_ID = W.WORK_ITEM_ID and"
                        + " C.CONSTRUCTION_ID = Cons.CONSTRUCTION_ID and ctd.confirm = 1) countTaskDailyConfirmed, "
                        // hungnx 20180621 end
                        + "(SELECT  LISTAGG(convert(sys.FULL_NAME, 'UTF8', 'AL16UTF16'),'-' )  WITHIN GROUP (ORDER BY sys.FULL_NAME ) "
                        + "FROM (SELECT distinct  sys.full_name from sys_user sys left join construction_task consTask on sys.sys_user_id = consTask.SUPERVISOR_ID "
                        + "left join CONSTRUCTION constr on consTask.CONSTRUCTION_ID  = constr.CONSTRUCTION_ID "
                        + "WHERE  constr.CONSTRUCTION_ID=:id) sys) supervisorName, "
                        + "(SELECT  LISTAGG(convert(sys.FULL_NAME, 'UTF8', 'AL16UTF16'),'-' )  WITHIN GROUP (ORDER BY sys.FULL_NAME ) "
                        + "FROM (SELECT distinct  sys.full_name from sys_user sys left join construction_task consTask on sys.sys_user_id = consTask.DIRECTOR_ID "
                        + "left join CONSTRUCTION constr on consTask.CONSTRUCTION_ID  = constr.CONSTRUCTION_ID "
                        + "WHERE  constr.CONSTRUCTION_ID= :id) sys) directorName, " + "sys.NAME sysGroupName, "
                        + "cons.EXCPECTED_STARTING_DATE excpectedStartingDate " + " From CONSTRUCTION cons "
                        + " LEFT JOIN CAT_CONSTRUCTION_TYPE consType ON cons.CAT_CONSTRUCTION_TYPE_ID = consType.CAT_CONSTRUCTION_TYPE_ID "
                        + " LEFT JOIN CAT_STATION catStation  ON cons.CAT_STATION_ID = catStation.CAT_STATION_ID ");
        sql.append(" LEFT JOIN CAT_PROVINCE catProvince ON catStation.CAT_PROVINCE_ID = catProvince.CAT_PROVINCE_ID ");
        sql.append(
                " LEFT JOIN (select distinct cntContract.code,cnt.CONSTRUCTION_ID from  CNT_CONSTR_WORK_ITEM_TASK cnt INNER JOIN CNT_CONTRACT cntContract ON cntContract.CNT_CONTRACT_ID = cnt.CNT_CONTRACT_ID AND cntContract.contract_type  = 0 AND cntContract.status!=0) CNT_CONSTR_WORK_ITEM_TASK  ON cons.CONSTRUCTION_ID =CNT_CONSTR_WORK_ITEM_TASK.CONSTRUCTION_ID ");
        sql.append(" LEFT JOIN SYS_GROUP sys ON sys.SYS_GROUP_ID = cons.SYS_GROUP_ID ");
        sql.append(" LEFT JOIN SYS_GROUP sys ");
        sql.append(" ON sys.SYS_GROUP_ID = cons.SYS_GROUP_ID ");
        sql.append(" WHERE cons.CONSTRUCTION_ID=:id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("constructionId", new LongType());
        query.addScalar("catStationId", new LongType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("catConstructionTypeId", new LongType());
        query.addScalar("sysGroupId", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("deployType", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("region", new LongType());
        query.addScalar("cntContract", new StringType());
        query.addScalar("startingDate", new DateType());
        query.addScalar("broadcastingDate", new DateType());
        query.addScalar("description", new StringType());
        query.addScalar("obstructedContent", new StringType());
        query.addScalar("startingNote", new StringType());
        query.addScalar("handoverNote", new StringType());
        query.addScalar("returner", new StringType());
        query.addScalar("returnDate", new DateType());
        query.addScalar("obstructedState", new StringType());
        query.addScalar("catProvince", new StringType());
        query.addScalar("supervisorName", new StringType());
        query.addScalar("directorName", new StringType());
        query.addScalar("excpectedCompleteDate", new DateType());
        query.addScalar("handoverDate", new DateType());
        query.addScalar("completeDate", new DateType());
        query.addScalar("catConstructionDeployId", new LongType());
        query.addScalar("excpectedStartingDate", new DateType());
        query.addScalar("isObstructed", new StringType());
        // hungnx 20180621 start
        query.addScalar("amount", new DoubleType());
        query.addScalar("price", new DoubleType());
        query.addScalar("moneyType", new IntegerType());
        query.addScalar("quantityByDate", new StringType());
        query.addScalar("countTaskDailyConfirmed", new IntegerType());
        
        query.addScalar("blueprintDate", new DateType());
        query.addScalar("buildingPermitDate", new DateType());
        query.addScalar("isBuildingPermit", new StringType());
        query.addScalar("handoverNoteElectric", new StringType());
        query.addScalar("handoverDateElectric", new DateType());
        query.addScalar("handoverDateBuild", new DateType());
        query.addScalar("handoverNoteBuild", new StringType());
        // hungnx 20180621 end
        //hoanngh 171218 start
        query.addScalar("amountCableRent", new DoubleType());
        query.addScalar("amountCableLive", new DoubleType());
        query.addScalar("totalAmountChest", new DoubleType());
        query.addScalar("priceChest", new DoubleType());
        query.addScalar("totalAmountGate", new DoubleType());
        query.addScalar("priceGate", new DoubleType());
        //hoanngh 171218 end
        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
        query.list();
        return (ConstructionDetailDTO) query.list().get(0);
    }

    public ConstructionDetailDTO getConstructionByCode(String code) {
        StringBuilder sql = new StringBuilder("SELECT cons.CONSTRUCTION_ID constructionId," + " cons.NAME name,"
                + "cons.CODE code," + "consType.NAME catContructionTypeName," + "cons.IS_OBSTRUCTED isObstructed,"
                + " station.CODE catStationCode," + " catProvine.CODE catProvince," + " catProvine.name provinceName"
                //VietNT_20181225_start
                + ", consType.CAT_CONSTRUCTION_TYPE_ID catContructionTypeId "
                //VietNT_end
                + " From CONSTRUCTION cons "
                + " LEFT JOIN CTCT_CAT_OWNER.CAT_CONSTRUCTION_TYPE consType ON cons.CAT_CONSTRUCTION_TYPE_ID = consType.CAT_CONSTRUCTION_TYPE_ID "
                + " LEFT JOIN CTCT_CAT_OWNER.CAT_STATION station ON cons.CAT_STATION_ID = station.CAT_STATION_ID "
                + " LEFT JOIN CTCT_CAT_OWNER.CAT_PROVINCE catProvine ON catProvine.CAT_PROVINCE_ID = station.CAT_PROVINCE_ID ");
        sql.append(" WHERE cons.CODE LIKE :code");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("code", code.trim());
        query.addScalar("constructionId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("isObstructed", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("catProvince", new StringType());
        query.addScalar("provinceName", new StringType());
        query.addScalar("catContructionTypeName", new StringType());
        //VietNT_20181225_start
        query.addScalar("catContructionTypeId", new LongType());
        //VietNT_end
        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
        return (ConstructionDetailDTO) query.uniqueResult();
    }

    public List<AppParamDTO> getAppParamByType(String type) {
        String sql = "SELECT " + " ST.APP_PARAM_ID appParamId" + " ,ST.NAME name" + " ,ST.CODE code"
                + " FROM CTCT_CAT_OWNER.APP_PARAM ST" + " WHERE ST.STATUS=1 " + " AND ST.PAR_TYPE like :type";
        StringBuilder stringBuilder = new StringBuilder(sql);
        stringBuilder.append(" ORDER BY ST.CODE");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.setParameter("type", type);
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        // chinhpxn_20180614_start
        query.addScalar("appParamId", new LongType());
        // chinhpxn_20180614_end
        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));

        return query.list();
    }

    public List<CatConstructionTypeDTO> getCatConstructionDeploy() {
        String sql = "SELECT " + " ST.CAT_CONSTRUCTION_DEPLOY_ID id" + " ,ST.NAME name" + " ,ST.CODE code"
                + " FROM CTCT_CAT_OWNER.CAT_CONSTRUCTION_DEPLOY ST" + " WHERE ST.STATUS=1 "
                + " AND ST.CAT_CONSTRUCTION_TYPE_ID =1 ";

        StringBuilder stringBuilder = new StringBuilder(sql);
        stringBuilder.append(" ORDER BY ST.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("id", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(CatConstructionTypeDTO.class));

        return query.list();
    }

    // chinhpxn 20180606 start
    public void updateVuongTask(ObstructedDetailDTO obj) {
        String HET_VUONG = "0";
        // String VUONG_CHUA_XN = "1";
        // String VUONG_CO_XN = "2";

        if (obj.getObstructedState().equals(HET_VUONG)) {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append(
                    "UPDATE CONSTRUCTION_TASK SET STATUS=2 WHERE nvl(COMPLETE_PERCENT,0) !=0 AND CONSTRUCTION_TASK_ID IN( ");
            stringBuilder.append("SELECT CONSTRUCTION_TASK_ID FROM CONSTRUCTION_TASK A,DETAIL_MONTH_PLAN B WHERE ");
            stringBuilder
                    .append("A.DETAIL_MONTH_PLAN_ID=B.DETAIL_MONTH_PLAN_ID AND B.SIGN_STATE=3 AND B.STATUS=1 AND ");
            stringBuilder.append(
                    "LPAD(A.MONTH,2,0) = TO_CHAR(SYSDATE,'MM') AND A.YEAR = TO_CHAR(SYSDATE,'YYYY') AND A.TYPE=1 AND LEVEL_ID=4 AND A.STATUS !=4 ");
            stringBuilder.append("START WITH A.CONSTRUCTION_ID = :constructionId ");
            stringBuilder.append("CONNECT BY PRIOR A.CONSTRUCTION_TASK_ID = A.PARENT_ID) ");

            SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

            StringBuilder stringBuilder2 = new StringBuilder();
            stringBuilder2.append(
                    "UPDATE CONSTRUCTION_TASK SET STATUS=1 WHERE nvl(COMPLETE_PERCENT,0) =0 AND CONSTRUCTION_TASK_ID IN( ");
            stringBuilder2.append("SELECT CONSTRUCTION_TASK_ID FROM CONSTRUCTION_TASK A,DETAIL_MONTH_PLAN B WHERE ");
            stringBuilder2
                    .append("A.DETAIL_MONTH_PLAN_ID=B.DETAIL_MONTH_PLAN_ID AND B.SIGN_STATE=3 AND B.STATUS=1 AND ");
            stringBuilder2.append(
                    "LPAD(A.MONTH,2,0) = TO_CHAR(SYSDATE,'MM') AND A.YEAR = TO_CHAR(SYSDATE,'YYYY') AND A.TYPE=1 AND LEVEL_ID=4 AND A.STATUS !=4 ");
            stringBuilder2.append("START WITH A.CONSTRUCTION_ID = :constructionId ");
            stringBuilder2.append("CONNECT BY PRIOR A.CONSTRUCTION_TASK_ID=A.PARENT_ID) ");

            SQLQuery query2 = getSession().createSQLQuery(stringBuilder2.toString());

            query.setParameter("constructionId", obj.getConstructionId());
            query2.setParameter("constructionId", obj.getConstructionId());

            query.executeUpdate();
            query2.executeUpdate();
            getSession().flush();
        } else {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append("UPDATE CONSTRUCTION_TASK SET STATUS=3 WHERE CONSTRUCTION_TASK_ID IN( ");
            stringBuilder.append("SELECT CONSTRUCTION_TASK_ID FROM CONSTRUCTION_TASK A,DETAIL_MONTH_PLAN B WHERE ");
            stringBuilder
                    .append("A.DETAIL_MONTH_PLAN_ID=B.DETAIL_MONTH_PLAN_ID AND B.SIGN_STATE=3 AND B.STATUS=1 AND ");
            stringBuilder.append(
                    "LPAD(A.MONTH,2,0) = TO_CHAR(SYSDATE,'MM') AND A.YEAR = TO_CHAR(SYSDATE,'YYYY') AND A.TYPE=1 AND LEVEL_ID=4 AND A.STATUS !=4 ");
            stringBuilder.append("START WITH A.CONSTRUCTION_ID = :constructionId ");
            stringBuilder.append("CONNECT BY PRIOR A.CONSTRUCTION_TASK_ID=A.PARENT_ID) ");

            SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
            query.setParameter("constructionId", obj.getConstructionId());
            query.executeUpdate();
        }
    }

    // chinhpxn 20180606 end

    public void updateVuongItem(ObstructedDetailDTO obj) {
        int count2 = countObstructedByState(obj.getConstructionId(), 2L);
        int count1 = countObstructedByState(obj.getConstructionId(), 1L);
        String HET_VUONG = "0";
        String VUONG_CHUA_XN = "1";
        String VUONG_CO_XN = "2";
        StringBuilder sql = new StringBuilder("Update CONSTRUCTION  set ");
        if (StringUtils.isNotEmpty(obj.getObstructedState())) {
            if (HET_VUONG.equals(obj.getObstructedState())) {
                sql.append("is_obstructed  =0,status = 3,COMPLETE_DATE  = null,COMPLETE_VALUE =null ");
            } else {
                sql.append(
                        " status = 4,is_obstructed  =1,COMPLETE_DATE  = sysDate,COMPLETE_VALUE =(select sum(work.quantity) from work_item work left join construction cons on cons.construction_id = work.construction_id and work.status =3 and work.CONSTRUCTION_ID = :constructionId) ");
                if (VUONG_CO_XN.equals(obj.getObstructedState()))
                    sql.append(", obstructed_state = 2 ");
            }
        }
        sql.append(" where CONSTRUCTION_ID = :constructionId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", obj.getConstructionId());
        query.executeUpdate();
        getSession().flush();
        // thay doi thiet ke ngay 10/04/2018
        if (count2 > 0) {
            sql = new StringBuilder("Update CONSTRUCTION  set obstructed_state = 2,is_obstructed  =1 ");
            sql.append(" where CONSTRUCTION_ID = :constructionId ");
            query = getSession().createSQLQuery(sql.toString());
            query.setParameter("constructionId", obj.getConstructionId());
            query.executeUpdate();

        } else if (count1 > 0) {
            sql = new StringBuilder("Update CONSTRUCTION  set obstructed_state = 1,is_obstructed  =1  ");
            sql.append(" where CONSTRUCTION_ID = :constructionId ");
            query = getSession().createSQLQuery(sql.toString());
            query.setParameter("constructionId", obj.getConstructionId());
            query.executeUpdate();
        } else {
            sql = new StringBuilder(
                    "Update CONSTRUCTION  set obstructed_state = 0, is_obstructed  =1, status = 3,COMPLETE_DATE = null,COMPLETE_VALUE = null");
            sql.append(" where CONSTRUCTION_ID = :constructionId ");
            query = getSession().createSQLQuery(sql.toString());
            query.setParameter("constructionId", obj.getConstructionId());
            query.executeUpdate();
        }

    }

    private int countObstructedByState(Long constructionId, Long state) {
        // TODO Auto-generated method stub
        String sql = new String(
                "select count(CONSTRUCTION_ID) from obstructed where obstructed_state  = :state and CONSTRUCTION_ID = :constructionId");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("constructionId", constructionId);
        query.setParameter("state", state);
        return ((BigDecimal) query.uniqueResult()).intValue();
    }

    /*
     * public List<CatCommonDTO> getWorkItemType() { String sql = "SELECT " +
     * " ST.CAT_WORK_ITEM_TYPE_ID id" + " ,ST.NAME name" + " ,ST.CODE code" +
     * " FROM CTCT_CAT_OWNER.CAT_WORK_ITEM_TYPE ST" +
     * " WHERE ST.STATUS=1 ST.CAT_CONSTRUCTION_TYPE_ID =:catContructionTypeId ";
     *
     * StringBuilder stringBuilder = new StringBuilder(sql);
     * stringBuilder.append(" ORDER BY ST.CODE");
     *
     * SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
     * query.addScalar("id", new LongType()); query.addScalar("name", new
     * StringType()); query.addScalar("code", new StringType());
     *
     * query.setResultTransformer(Transformers.aliasToBean(CatCommonDTO.class));
     *
     * return query.list(); }
     */

    public List<ConstructionDetailDTO> getConstructionForHSHC(Long sysGroupId) {
        if (sysGroupId == null) {
            return new ArrayList<ConstructionDetailDTO>();
        }
        StringBuilder sql = new StringBuilder("SELECT distinct cons.CONSTRUCTION_ID constructionId,"
                + " pro.CODE provinceCode, " + " cons.IS_OBSTRUCTED isObstructed," + "cons.CODE code,"
                + " cons.COMPLETE_DATE completeDate," + "cnt.CODE cntContract," + " catStation.CODE catStationCode,"
                + "catConstructionType.NAME catContructionTypeName," + " (SELECT SUM(workQuota.price) "
                + " FROM WORK_ITEM_QUOTA workQuota  WHERE cons.cat_construction_type_id=workQuota.cat_construction_type_id and workQuota.sys_group_id=cons.sys_group_id "
                + " AND workQuota.quota_type = 1) quantity" + " From CONSTRUCTION cons "
                + " inner join CAT_STATION cat on cat.CAT_STATION_ID = cons.CAT_STATION_ID    "
                + "  inner join CAT_PROVINCE pro on pro.CAT_PROVINCE_ID = cat.CAT_PROVINCE_ID   "
                + " LEFT JOIN CAT_CONSTRUCTION_TYPE catConstructionType ON catConstructionType.CAT_CONSTRUCTION_TYPE_ID =cons.CAT_CONSTRUCTION_TYPE_ID  "
                + " LEFT JOIN (SELECT DISTINCT cntContract.code,  cnt.CONSTRUCTION_ID FROM CNT_CONSTR_WORK_ITEM_TASK cnt INNER JOIN CNT_CONTRACT cntContract ON cntContract.CNT_CONTRACT_ID = cnt.CNT_CONTRACT_ID AND cntContract.contract_type  = 0 AND cntContract.status!=0) cnt  ON cnt.CONSTRUCTION_ID = cons.CONSTRUCTION_ID "
                + " LEFT JOIN CAT_STATION catStation ON catStation.CAT_STATION_ID =cons.CAT_STATION_ID ");
        sql.append(
                " left join CONSTRUCTION_TASK consTask ON consTask.CONSTRUCTION_ID = cons.CONSTRUCTION_ID and consTask.level_id = 4 ");
        sql.append(
                " WHERE (cons.status =5 or (cons.status=4 AND cons.is_obstructed=1 AND cons.Obstructed_state=2)) and ((consTask.type =2 and consTask.status!=4) ");
        sql.append(
                "  or(cons.CONSTRUCTION_ID not in (select construction_id from CONSTRUCTION_TASK where CONSTRUCTION_TASK.type=2))) ");
        sql.append(" AND cons.SYS_GROUP_ID =:sysId  ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("sysId", sysGroupId);
        query.addScalar("constructionId", new LongType());
        query.addScalar("isObstructed", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("catContructionTypeName", new StringType());
        query.addScalar("completeDate", new DateType());
        query.addScalar("cntContract", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
        return query.list();
    }

    public void updateBGMBItem(ConstructionDetailDTO obj) {
        StringBuilder sql = new StringBuilder("Update CONSTRUCTION set  ");
        if ("1".equalsIgnoreCase(obj.getStatus())) {
            sql.append(" status   = 2,  ");
        }
        sql.append(" handover_Date  = :handoverDate , ");
        if ("1".equals(obj.getCustomField())){
        	sql.append(" handover_Date_build   = :handoverDate , ");
        	sql.append(" handover_Date_electric   = null  ");
        }
        else{
        	sql.append(" handover_Date_build   = null ,");
        	sql.append(" handover_Date_electric   = :handoverDate  ");
        }
        sql.append(" ,handover_Note   = :handoverNote  ");
        if (StringUtils.isNotEmpty(obj.getHandoverNote()) && "1".equals(obj.getCustomField())){
            sql.append(" ,handover_Note_electric   = :handoverNote  ");
            sql.append(" ,handover_Note_build   = null  ");
        }
        else if (StringUtils.isNotEmpty(obj.getHandoverNote()) && "2".equals(obj.getCustomField())){
            sql.append(" ,handover_Note_build   = :handoverNote  ");
            sql.append(" ,handover_Note_electric   = null  ");
        }
        
        sql.append(" where CONSTRUCTION_ID = :constructionId ");
        
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", obj.getConstructionId());
        query.setParameter("handoverDate", obj.getHandoverDate());
        
        if (StringUtils.isNotEmpty(obj.getHandoverNote()))
            query.setParameter("handoverNote", obj.getHandoverNote());
        query.executeUpdate();

    }

    //nhantv 25092018 begin
    public void updateConstrLicence(ConstructionDetailDTO obj) {
        StringBuilder sql = new StringBuilder("Update CONSTRUCTION set  ");
        
    	sql.append(" Building_permit_date   = :buildingPermitDate,  ");
    	sql.append(" updated_date   = :updatedDate  ");
        
        sql.append(" where CONSTRUCTION_ID = :constructionId ");
        
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("buildingPermitDate", obj.getBuildingPermitDate());
        query.setParameter("updatedDate", new Date());
        query.setParameter("constructionId", obj.getConstructionId());
      
        query.executeUpdate();
    }
    
    public void updateConstrDesign(ConstructionDetailDTO obj) {
        StringBuilder sql = new StringBuilder("Update CONSTRUCTION set  ");
        
    	sql.append(" Blueprint_date  = :blueprintDate,  ");
    	sql.append(" updated_date   = :updatedDate  ");
        
        sql.append(" where CONSTRUCTION_ID = :constructionId ");
        
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("blueprintDate", obj.getBlueprintDate());
        query.setParameter("updatedDate", new Date());
        query.setParameter("constructionId", obj.getConstructionId());
      
        query.executeUpdate();
    }
    //nhantv 25092018 end
    public void updateStartItem(ConstructionDetailDTO obj) {
        StringBuilder sql = new StringBuilder("Update CONSTRUCTION set ");
        if ("2".equalsIgnoreCase(obj.getStatus())) {
            sql.append(" status   = 3,  ");
        }
        sql.append(" starting_Date   = :startingDate  ");
        sql.append(" ,excpected_Complete_Date   = :excpectedCompleteDate  ");
        if (StringUtils.isNotEmpty(obj.getStartingNote()))
            sql.append(" ,starting_Note   = :startingNote  ");
        sql.append(" where CONSTRUCTION_ID = :constructionId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", obj.getConstructionId());
        query.setParameter("startingDate", obj.getStartingDate());
        query.setParameter("excpectedCompleteDate", obj.getExcpectedCompleteDate());
        if (StringUtils.isNotEmpty(obj.getStartingNote()))
            query.setParameter("startingNote", obj.getHandoverNote());
        query.executeUpdate();
    }

    public void updateHSHCItem(ConstructionDetailDTO obj) {
        StringBuilder sql = new StringBuilder("Update CONSTRUCTION set ");
        sql.append(" APPROVE_COMPLETE_VALUE  = null,  ");
        sql.append(" APPROVE_COMPLETE_DATE   = null  ");
        sql.append(" WHERE CONSTRUCTION_ID = :id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obj.getConstructionId());
        query.executeUpdate();
    }

    public void updateDTItem(ConstructionDetailDTO obj, Long sysUserId) {
        StringBuilder sql = new StringBuilder();
        sql.append(" UPDATE CONSTRUCTION");
        sql.append(" 	SET APPROVE_REVENUE_STATE = 3, ");
        sql.append(" 	 	APPROVE_REVENUE_VALUE = 0, ");
        sql.append(" 		APPROVE_REVENUE_USER_ID =:sysUserId, ");
        sql.append(" 		APPROVE_REVENUE_DESCRIPTION = :approveRevenueDescription, ");
        sql.append(" 		APPROVE_REVENUE_DATE =:date ");
        sql.append(" WHERE  CONSTRUCTION_ID = :id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obj.getConstructionId());
        query.setParameter("sysUserId", sysUserId);
        query.setParameter("date", new Date());
        query.setParameter("approveRevenueDescription", obj.getApproveRevenueDescription());
        query.executeUpdate();
    }

    public void updateDTItemApprover(ConstructionDetailDTO obj, Long sysUserId) {
        StringBuilder sql = new StringBuilder();
        sql.append(" UPDATE CONSTRUCTION");
        sql.append(" 	SET APPROVE_REVENUE_STATE =2, ");
        sql.append(" 	 	APPROVE_REVENUE_VALUE =:consAppRevenueValue, ");
        sql.append(" 		APPROVE_REVENUE_USER_ID =:sysUserId, ");
//        hoanm1_20181015_start_comment
//        sql.append(" 		APPROVE_REVENUE_DATE =:date ");
        sql.append(" APPROVE_REVENUE_UPDATED_DATE = :date ");
//        hoanm1_20181015_end_comment
        sql.append(" WHERE  CONSTRUCTION_ID = :id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obj.getConstructionId());
        query.setParameter("sysUserId", sysUserId);
        query.setParameter("date", new Date());
        // hoanm1_20180615_start
        if (obj.getConsAppRevenueValue() != null) {
            query.setParameter("consAppRevenueValue", obj.getConsAppRevenueValue());
        } else {
            query.setParameter("consAppRevenueValue", 0);
        }
        // hoanm1_20180615_end
        query.executeUpdate();
    }

    public void updateMerchandiseItem(ConstructionDetailDTO obj) {
        StringBuilder sql = new StringBuilder("Update CONSTRUCTION set  ");
        sql.append(" returner   = :returner  ");
        sql.append(" ,IS_RETURN   = '1'  ");
        sql.append(" ,STATUS   = :status  ");
        sql.append(" ,return_Date   = :returnDate  ");
        sql.append(" where CONSTRUCTION_ID = :constructionId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", obj.getConstructionId());
        query.setParameter("returner", obj.getReturner());
        query.setParameter("returnDate", obj.getReturnDate());
        query.setParameter("status", obj.getStatus());
        query.executeUpdate();

    }

    public List<ConstructionDetailDTO> getConstructionForLDT(Long sysGroupId) {
        if (sysGroupId == null) {
            return new ArrayList<ConstructionDetailDTO>();
        }
        StringBuilder sql = new StringBuilder("SELECT cons.CONSTRUCTION_ID constructionId,"
                + " cons.IS_OBSTRUCTED isObstructed," + "cons.CODE code," + " cons.approve_complete_date completeDate,"
                + "cnt.CODE cntContract," + " catStation.CODE catStationCode,"
                + "catConstructionType.NAME catContructionTypeName," + "catProvince.CODE catProvince,"
                + " (SELECT SUM(workQuota.price) "
                + " FROM WORK_ITEM_QUOTA workQuota  WHERE cons.cat_construction_type_id=workQuota.cat_construction_type_id and workQuota.sys_group_id=cons.sys_group_id "
                + " AND workQuota.quota_type = 1) quantity" + " From CONSTRUCTION cons "
                + " LEFT JOIN CAT_CONSTRUCTION_TYPE catConstructionType ON catConstructionType.CAT_CONSTRUCTION_TYPE_ID =cons.CAT_CONSTRUCTION_TYPE_ID  "
                + " LEFT JOIN (SELECT DISTINCT cntContract.code,  cnt.CONSTRUCTION_ID FROM CNT_CONSTR_WORK_ITEM_TASK cnt INNER JOIN CNT_CONTRACT cntContract ON cntContract.CNT_CONTRACT_ID = cnt.CNT_CONTRACT_ID AND cntContract.contract_type  = 0 AND cntContract.status!=0) cnt  ON cnt.CONSTRUCTION_ID = cons.CONSTRUCTION_ID "
                + " LEFT JOIN CTCT_CAT_OWNER.CAT_STATION catStation ON catStation.CAT_STATION_ID =cons.CAT_STATION_ID "
                + "left join CAT_PROVINCE catProvince on catStation.CAT_PROVINCE_ID=catProvince.CAT_PROVINCE_ID");
        sql.append(" WHERE cons.approve_complete_date is not null and cons.approve_revenue_date is null");
        sql.append(" AND cons.SYS_GROUP_ID =:sysId  ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("sysId", sysGroupId);
        query.addScalar("constructionId", new LongType());
        query.addScalar("isObstructed", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("cntContract", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("catContructionTypeName", new StringType());
        query.addScalar("completeDate", new DateType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("catProvince", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
        return query.list();
    }

    public List<ConstructionDetailDTO> getConstructionForDT(Long sysGroupId) {
        StringBuilder sql = new StringBuilder(
                "SELECT work.WORK_ITEM_ID workItemId, work.NAME workItemName,work.CODE workItemCode,province.code provinceCode,  catStation.code catStationCode,  catConstructionType.code catConstructionTypeCode,catConstructionType.name catContructionTypeName, "
                        + "  cntItem.code cntContractCode,  cons.code code,  (SELECT SUM(workQuota.price) "
                        + "  FROM WORK_ITEM_QUOTA workQuota  WHERE  work.cat_work_item_type_id=workQuota.cat_work_item_type_id and workQuota.sys_group_id=cons.sys_group_id  "
                        + " AND workQuota.quota_type =2   ) quantity From WORK_ITEM work  "
                        + " inner join CONSTRUCTION cons ON cons.CONSTRUCTION_ID = work.CONSTRUCTION_ID  "
                        + " LEFT JOIN CAT_CONSTRUCTION_TYPE catConstructionType   "
                        + " ON catConstructionType.CAT_CONSTRUCTION_TYPE_ID =cons.CAT_CONSTRUCTION_TYPE_ID ");
        sql.append(" LEFT JOIN CAT_STATION catStation ON catStation.CAT_STATION_ID =cons.CAT_STATION_ID ");
        sql.append(" LEFT JOIN CAT_PROVINCE province ON province.CAT_PROVINCE_ID = catStation.CAT_PROVINCE_ID ");
        sql.append(
                " LEFT JOIN (SELECT DISTINCT cntContract.code,  cnt.CONSTRUCTION_ID FROM CNT_CONSTR_WORK_ITEM_TASK cnt INNER JOIN CNT_CONTRACT cntContract ON cntContract.CNT_CONTRACT_ID = cnt.CNT_CONTRACT_ID AND cntContract.contract_type  = 0 AND cntContract.status!=0) cntItem ON cntItem.CONSTRUCTION_ID = cons.CONSTRUCTION_ID ");
        sql.append(" WHERE cons.status          IN(1,2,3) AND cons.SYS_GROUP_ID       = :sysGroupId  ");
        sql.append(" and work.status in(1,2) ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("sysGroupId", sysGroupId);
        query.addScalar("provinceCode", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("catConstructionTypeCode", new StringType());
        query.addScalar("catContructionTypeName", new StringType());
        query.addScalar("cntContractCode", new StringType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("workItemCode", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
        return query.list();
    }

    public List<StockTransGeneralDTO> getSynStockTrans(Long id) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT * FROM ");
        sql.append(" (SELECT DISTINCT synDetailSerial.GOODS_CODE goodsCode, ");
        sql.append(" synDetailSerial.GOODS_NAME goodsName, synDetailSerial.MER_ENTITY_ID merEntityId , ");
        sql.append(" synDetailSerial.GOODS_ID goodsId, ");
        sql.append("   synDetailSerial.SERIAL serial, ");
        sql.append(" synDetail.GOODS_IS_SERIAL goodsIsSerial, ");
        sql.append(" synDetailSerial.SYN_STOCK_TRANS_DETAIL_SER_ID detailSerial, ");
        sql.append(" synDetail.GOODS_UNIT_NAME goodsUnitName, ");
        sql.append(" con.construction_id constructionId, ");
        // chinhpxn20180618
        // sql.append(" (SELECT CASE WHEN conMer.quantity =1 AND conMer.remain_count = 0
        // ");
        sql.append(" (SELECT  CASE WHEN conMer.quantity != 0 ");
        // chinhpxn20180618
        sql.append(" THEN 1  ELSE 0 END from  CONSTRUCTION_MERCHANDISE conMer   ");
        sql.append(" where conMer.CONSTRUCTION_ID  =:id  ");
        sql.append(" AND conMer.GOODS_ID        = synDetail.GOODS_ID AND conMer.SERIAL=synDetailSerial.SERIAL  ");
        sql.append(" AND conMer.GOODS_IS_SERIAL = 1  ");
        sql.append(" and conMer.TYPE =1   and rownum =1) employ ");
        sql.append(" FROM SYN_STOCK_TRANS syn inner join CONSTRUCTION con on con.code = syn.CONSTRUCTION_CODE ");
        sql.append(" LEFT JOIN SYN_STOCK_TRANS_DETAIL synDetail ");
        sql.append(" ON syn.SYN_STOCK_TRANS_ID = synDetail.SYN_STOCK_TRANS_ID ");
        sql.append(" LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL synDetailSerial ");
        sql.append(" ON synDetailSerial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
        sql.append(" left join CONSTRUCTION_MERCHANDISE  conMer on conMer.GOODS_ID = synDetailSerial.GOODS_ID ");
        sql.append("  and conMer.CONSTRUCTION_ID = :id ");
        sql.append(" WHERE syn.SYN_TRANS_TYPE =1 ");
        sql.append(" AND synDetail.GOODS_IS_SERIAL = 1 ");
        sql.append(" AND syn.CONFIRM          =1 ");
        sql.append(" AND syn.TYPE             =2 ");
        sql.append(" AND con.CONSTRUCTION_ID  =:id and synDetailSerial.amount>0 ");
        sql.append("  ) ");
        sql.append("  WHERE merEntityId NOT IN ");
        sql.append("  (SELECT MER_ENTITY_ID ");
        sql.append("  FROM SYN_STOCK_TRANS s ");
        sql.append("  LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
        sql.append("  ON s.SYN_STOCK_TRANS_ID   = serial.SYN_STOCK_TRANS_ID ");
        sql.append("  WHERE s.construction_code = (SELECT CODE FROM CONSTRUCTION WHERE CONSTRUCTION_ID = :id) ");
        sql.append("  AND s.TYPE                  = 1 ");
        sql.append("  AND s.status            = 2 ");
        sql.append("  AND serial.SERIAL IS NOT NULL) ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("serial", new StringType());
        query.addScalar("merEntityId", new LongType());
        query.addScalar("goodsIsSerial", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("employ", new LongType());
        query.addScalar("detailSerial", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(StockTransGeneralDTO.class));
        return query.list();
    }

    public ConstructionAcceptanceCertDTO getCertDTO(Long id) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT cert.IMPORTER importer, ");
        sql.append(" 		cert.STARTING_DATE startingDate, ");
        sql.append("        cert.COMPLETE_DATE completeDate");
        sql.append(" FROM  CONSTRUCTION_ACCEPTANCE_CERT cert ");
        sql.append(" WHERE cert.CONSTRUCTION_ID =:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("importer", new StringType());
        query.addScalar("startingDate", new DateType());
        query.addScalar("completeDate", new DateType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionAcceptanceCertDTO.class));
        return (ConstructionAcceptanceCertDTO) query.uniqueResult();
    }

    public List<StockTransGeneralDTO> getStockTrans(Long id) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT DISTINCT s.CONSTRUCTION_ID constructionId, ");
        sql.append(" m.mer_entity_id merEntityId, m.GOODS_CODE goodsCode, ");
        sql.append(" m.GOODS_ID goodsId,  m.GOODS_NAME goodsName, ");
        sql.append(" m.CAT_UNIT_NAME goodsUnitName, ss.SERIAL serial, ");
        sql.append(" sd.GOODS_IS_SERIAL goodsIsSerial , ");
        // chinhpxn20180618
        // sql.append(" (SELECT CASE WHEN conMer.quantity =1 AND conMer.remain_count = 0
        // ");
        sql.append(" (SELECT  CASE WHEN conMer.quantity != 0");
        // chinhpxn20180618
        sql.append(" THEN 1  ELSE 0 END from  CONSTRUCTION_MERCHANDISE conMer ");
        sql.append(" where conMer.CONSTRUCTION_ID  = s.CONSTRUCTION_ID ");
        sql.append(" AND conMer.GOODS_ID        = sd.GOODS_ID ");
        sql.append(" AND conMer.GOODS_IS_SERIAL = 1 ");
        sql.append(" and conMer.TYPE =2 and conMer.SERIAL =  ss.SERIAL  and rownum =1) employ ");
        sql.append(" FROM stock_trans s ");
        sql.append(" INNER JOIN STOCK_TRANS_DETAIL sd ");
        sql.append(" ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID ");
        sql.append(" AND s.CONFIRM  = 1 AND s.TYPE = 2 AND s.STATUS = 2 AND sd.GOODS_IS_SERIAL =1 ");
        sql.append(" INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss ");
        sql.append(" ON ss.STOCK_TRANS_ID         = s.STOCK_TRANS_ID ");
        sql.append(" AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID ");
        sql.append(" AND sd.GOODS_IS_SERIAL       = 1 ");
        sql.append(" INNER JOIN MER_ENTITY m ");
        sql.append(" ON m.MER_ENTITY_ID=ss.MER_ENTITY_ID ");
        sql.append(" LEFT JOIN CONSTRUCTION_MERCHANDISE conMer ");
        sql.append(" ON conMer.CONSTRUCTION_ID = s.CONSTRUCTION_ID ");
        sql.append(" AND conMer.GOODS_ID       = sd.GOODS_ID and conMer.GOODS_IS_SERIAL = 1 ");
        sql.append(" WHERE m.MER_ENTITY_ID not in ");
        sql.append(" (SELECT ae.MER_ENTITY_ID ");
        sql.append(" FROM ASSET_MANAGEMENT_REQUEST a ");
        sql.append("  INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ");
        sql.append(" ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID and a.STATUS in(1,2,3) ");
        sql.append(" INNER JOIN MER_ENTITY m ");
        sql.append(" ON m.MER_ENTITY_ID     =ae.MER_ENTITY_ID ");
        sql.append(" WHERE ae.GOODS_CODE    =sd.GOODS_CODE ");
        sql.append(" AND a.CONSTRUCTION_ID  =s.CONSTRUCTION_ID ");
        sql.append(" AND ae.QUANTITY        !=0 ");
        sql.append(" AND ae.GOODS_IS_SERIAL = 1 ) ");
        sql.append(" AND s.CONSTRUCTION_ID =:id ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("merEntityId", new LongType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("goodsIsSerial", new StringType());
        query.addScalar("serial", new StringType());
        query.addScalar("employ", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(StockTransGeneralDTO.class));
        return query.list();
    }

    // START SERVICE MOBILE

    public List<ConstructionStationWorkItemDTO> getListConstructionByIdSysGroupId(SysUserRequest request,
                                                                                  List<DomainDTO> isViewWorkProgress) {

        StringBuilder domain = new StringBuilder();
        if (isViewWorkProgress != null && isViewWorkProgress.size() > 0) {
            for (int i = 0; i < isViewWorkProgress.size(); i++) {
                domain.append(isViewWorkProgress.get(i).getDataId().toString());
                while (i != isViewWorkProgress.size() - 1) {
                    domain.append(" , ");
                    break;
                }
            }
        }

        StringBuilder strSql = new StringBuilder("");
        strSql.append(" SELECT ");
        strSql.append(" ct.CONSTRUCTION_ID constructionId ,ct.NAME name , ct.CODE  constructionCode ");
        strSql.append(" From CONSTRUCTION ct  ");
        // need to fix
        if (domain.length() > 0) {
            strSql.append(" WHERE ct.SYS_GROUP_ID IN (" + domain + ")  ORDER BY ct.CODE ");
        } else {
            strSql.append(" WHERE ct.SYS_GROUP_ID = :sysGroupId  ORDER BY ct.CODE ");
        }

        SQLQuery query = getSession().createSQLQuery(strSql.toString());

        if (!(domain.length() > 0)) {
            query.setParameter("sysGroupId", Long.parseLong(request.getSysGroupId()));
        }
        query.addScalar("name", new StringType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionStationWorkItemDTO.class));
        return query.list();

    }

    public void confirmPkx(SynStockTransDTO obj, Date dateNow) {
        String queryStr = editConfirm(obj);
        SQLQuery query = getSession().createSQLQuery(queryStr);
        // query.setParameter("confirm", obj.getConfirm());
        query.setParameter("synStockTransId", obj.getSynStockTransId());
        query.setParameter("idLogin", obj.getUserLogin());
        query.setParameter("dateNow", dateNow);
        query.executeUpdate();
    }

    private String editConfirm(SynStockTransDTO obj) {
        StringBuilder sbquery = new StringBuilder();
        sbquery.append(" UPDATE ");
        if (obj.getTypeExport() == 1) {
            sbquery.append(" SYN_STOCK_TRANS syn ");
        } else {
            sbquery.append(" STOCK_TRANS syn ");
        }
        sbquery.append(" SET syn.CONFIRM = 1 , ");
        sbquery.append(" syn.LAST_SHIPPER_ID =:idLogin ,syn.UPDATED_DATE =:dateNow , ");
        sbquery.append(" syn.UPDATED_BY =:idLogin  ");
        if (obj.getTypeExport() == 1) {
            sbquery.append(" WHERE syn.SYN_STOCK_TRANS_ID =:synStockTransId  ");
        } else {
            sbquery.append(" WHERE syn.STOCK_TRANS_ID =:synStockTransId  ");
        }
        return sbquery.toString();
    }

    public List<SynStockTransDTO> detaillPhieu(SynStockTransDTO obj) {
        // TODO Auto-generated method stub
        return null;
    }

    // END SERVICE MOBILE
    public Long updateConstruction(ConstructionBO model) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " update construction set CAT_CONSTRUCTION_TYPE_ID = :catConstructionTypeId ");
        sql.append(", UPDATED_USER_ID =:updatedUserId, UPDATED_DATE=:updatedDate, UPDATED_GROUP_ID=:updatedGroupId ");
        if (StringUtils.isNotEmpty(model.getCode())) {
            sql.append(" ,code = :code");
        }
        if (StringUtils.isNotEmpty(model.getDescription())) {
            sql.append(" ,description = :description");
        }
        if (StringUtils.isNotEmpty(model.getName())) {
            sql.append(",name = :name ");
        }
        if (model.getCatStationId() != null) {
            sql.append(" ,CAT_STATION_ID = :catStationId");
        }
        if (model.getRegion() != null) {
            sql.append(",region = :region ");
        }
        if (model.getExcpectedStartingDate() != null) {
            sql.append(", EXCPECTED_STARTING_DATE = :excpectedStartingDate ");
        }
        if (model.getCatConstructionDeployId() != null) {
            sql.append(",CAT_CONSTRUCTION_DEPLOY_ID = :catConstructionDeployId");
        }
        if (model.getDeployType() != null) {
            sql.append(",DEPLOY_TYPE = :deployType");
        }
        if (model.getSysGroupId() != null) {
            sql.append(",SYS_GROUP_ID = :sysGroupId");
        }
        // hungnx 20180621 start
        // if (model.getAmount() != null) {
        sql.append(",AMOUNT = :amount");
        // }
        // if (model.getPrice() != null) {
        sql.append(",PRICE = :price");
        // }
        // if (model.getMoneyType() != null) {
        sql.append(",MONEY_TYPE = :moneyType");
        // }
        sql.append(",IS_BUILDING_PERMIT = :isBuildingPermit "); //Huypq-update isBuildingPermit
        // hungnx 20180621
        sql.append(" where CONSTRUCTION_ID = :constructionId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", model.getConstructionId());
        query.setParameter("catConstructionTypeId", model.getCatConstructionTypeId());
        query.setParameter("updatedUserId", model.getUpdatedUserId());
        query.setParameter("updatedDate", model.getUpdatedDate());
        query.setParameter("updatedGroupId", model.getUpdatedGroupId());
        query.setParameter("isBuildingPermit", model.getIsBuildingPermit());//Huypq-update isBuildingPermit
        if (StringUtils.isNotEmpty(model.getCode())) {
            query.setParameter("code", model.getCode());
        }
        if (StringUtils.isNotEmpty(model.getDescription())) {
            query.setParameter("description", model.getDescription());
        }
        if (StringUtils.isNotEmpty(model.getName())) {
            query.setParameter("name", model.getName());
        }
        if (model.getCatStationId() != null) {
            query.setParameter("catStationId", model.getCatStationId());
        }
        if (model.getRegion() != null) {
            query.setParameter("region", model.getRegion());
        }
        if (model.getExcpectedStartingDate() != null) {
            query.setParameter("excpectedStartingDate", model.getExcpectedStartingDate());
        }
        if (model.getCatConstructionDeployId() != null) {
            query.setParameter("catConstructionDeployId", model.getCatConstructionDeployId());
        }
        if (model.getDeployType() != null) {
            query.setParameter("deployType", model.getDeployType());
        }
        if (model.getSysGroupId() != null) {
            query.setParameter("sysGroupId", model.getSysGroupId());
        }
        // hungnx 20180621 start
        if (model.getAmount() != null) {
            query.setParameter("amount", model.getAmount());
        } else {
            query.setParameter("amount", "");
        }
        if (model.getPrice() != null) {
            query.setParameter("price", model.getPrice());
        } else {
            query.setParameter("price", "");
        }
        if (model.getMoneyType() != null) {
            query.setParameter("moneyType", model.getMoneyType());
        } else {
            query.setParameter("moneyType", "");
        }
        // hungnx 20180621
        return (long) query.executeUpdate();
    }

    public List<SignVOfficeDetailDTO> getDataSign(Long synStockId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "select si.order_name orderName, su.full_name fullName, su.email email, su.phone_number phoneNumber,si.role_name roleName from SIGN_VOFFICE_DETAIL si, SYS_USER su ");
        sql.append(" where si.sys_user_Id = su.sys_user_id  ");
        sql.append(" and buss_type_id = 4 and object_id = :id order by si.ODRER_TYPE ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", synStockId);
        query.addScalar("orderName", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("roleName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(SignVOfficeDetailDTO.class));
        return query.list();
    }

    public List<CatCommonDTO> getWorkItemType(Long ida) {
        String sql = "SELECT " + " ST.CAT_WORK_ITEM_TYPE_ID id" + " ,ST.NAME name" + " ,ST.CODE code"
        		+ " ,ST.CAT_WORK_ITEM_GROUP_ID catWorkItemGroupId"
                + " FROM CTCT_CAT_OWNER.CAT_WORK_ITEM_TYPE ST"
                + " WHERE ST.STATUS=1 AND ST.CAT_CONSTRUCTION_TYPE_ID =:ida "
                // chinhpxn 20180605 start
                + " ORDER BY ST.ITEM_ORDER ";
        // chinhpxn 20180605 end

        StringBuilder stringBuilder = new StringBuilder(sql);
        // stringBuilder.append(" ORDER BY ST.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.setParameter("ida", ida);
        query.addScalar("id", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        //nhantv 27092018 begin
        query.addScalar("catWorkItemGroupId", new LongType());
      //nhantv 27092018 end
        query.setResultTransformer(Transformers.aliasToBean(CatCommonDTO.class));
        return query.list();
    }

    public List<stockListDTO> NoSynStockTransDetaill(Long objectId, Long synType) {
        StringBuilder sql = new StringBuilder("SELECT sd.GOODS_NAME  goodsName, ");
        sql.append(" sd.GOODS_CODE goodsCode ,  ");
        sql.append("  sd.GOODS_UNIT_NAME goodsUnitName, ");
        sql.append("  ss.SERIAL serial,  ");
        sql.append("  sd.AMOUNT_REAL amountReal,  ");
        if (synType == 1) {
            sql.append("   ss.UNIT_PRICE unitPrice , ");
            sql.append(" (sd.AMOUNT_REAL * ss.UNIT_PRICE) total1   ");
            sql.append("  FROM SYN_STOCK_TRANS_DETAIL sd ");
            sql.append(" LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL ss  ");
            sql.append("  ON sd.SYN_STOCK_TRANS_DETAIL_ID = ss.SYN_STOCK_TRANS_DETAIL_ID ");
            sql.append(" WHERE sd.SYN_STOCK_TRANS_ID =:id AND sd.GOODS_IS_SERIAL='0' ");
        } else {
            sql.append("   ss.PRICE unitPrice , ");
            sql.append(" (sd.AMOUNT_REAL * ss.PRICE) total1   ");
            sql.append("  FROM STOCK_TRANS_DETAIL sd ");
            sql.append(" LEFT JOIN STOCK_TRANS_DETAIL_SERIAL ss  ");
            sql.append("  ON sd.STOCK_TRANS_DETAIL_ID = ss.STOCK_TRANS_DETAIL_ID ");
            sql.append(" WHERE sd.STOCK_TRANS_ID =:id AND sd.GOODS_IS_SERIAL='0' ");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", objectId);
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("serial", new StringType());
        query.addScalar("amountReal", new DoubleType());
        query.addScalar("unitPrice", new DoubleType());
        query.addScalar("total1", new DoubleType());
        query.setResultTransformer(Transformers.aliasToBean(stockListDTO.class));
        return query.list();
    }

    public List<stockListDTO> YesSynStockTransDetaill(Long objectId, Long synType) {
        StringBuilder sql = new StringBuilder("SELECT sd.GOODS_NAME  goodsName, ");
        sql.append(" sd.GOODS_CODE goodsCode ,  ");
        sql.append("  sd.GOODS_UNIT_NAME goodsUnitName, ");
        sql.append("  ss.SERIAL serial,  ");
        sql.append("  sd.AMOUNT_REAL amountReal,  ");
        if (synType == 1) {
            sql.append("   ss.UNIT_PRICE unitPrice , ");
            sql.append(" (sd.AMOUNT_REAL * ss.UNIT_PRICE) total1   ");
            sql.append("  FROM SYN_STOCK_TRANS_DETAIL sd ");
            sql.append(" LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL ss  ");
            sql.append("  ON sd.SYN_STOCK_TRANS_DETAIL_ID = ss.SYN_STOCK_TRANS_DETAIL_ID ");
            sql.append(" WHERE sd.SYN_STOCK_TRANS_ID =:id AND sd.GOODS_IS_SERIAL='1'");
        } else {
            sql.append("   ss.PRICE unitPrice , ");
            sql.append(" (sd.AMOUNT_REAL * ss.PRICE) total1   ");
            sql.append("  FROM STOCK_TRANS_DETAIL sd ");
            sql.append(" LEFT JOIN STOCK_TRANS_DETAIL_SERIAL ss  ");
            sql.append("  ON sd.STOCK_TRANS_DETAIL_ID = ss.STOCK_TRANS_DETAIL_ID ");
            sql.append(" WHERE sd.STOCK_TRANS_ID =:id AND sd.GOODS_IS_SERIAL='1' ");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", objectId);
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("serial", new StringType());
        query.addScalar("amountReal", new DoubleType());
        query.addScalar("unitPrice", new DoubleType());
        query.addScalar("total1", new DoubleType());
        query.setResultTransformer(Transformers.aliasToBean(stockListDTO.class));
        return query.list();
    }

    public List<WorkItemDetailDTO> doSearchCatTask(WorkItemDetailDTO obj) {
        if (obj.getCatWorkItemTypeId() == null)
            return new ArrayList<WorkItemDetailDTO>();
        StringBuilder sql = new StringBuilder("");
        sql.append(" SELECT  ");
        sql.append(" 	c.CAT_TASK_ID AS workItemId, ");
        sql.append(" 	c.NAME AS name, ");
        sql.append(" 	c.CODE AS code, ");
        sql.append(" 	c.STATUS AS status, ");
        sql.append(" 	workItem.NAME AS catWorkItemType ");
        sql.append(" FROM ");
        sql.append(" 	CAT_TASK c ");
        sql.append(
                " 	LEFT JOIN CTCT_CAT_OWNER.CAT_WORK_ITEM_TYPE workItem ON c.CAT_WORK_ITEM_TYPE_ID = workItem.CAT_WORK_ITEM_TYPE_ID ");
        sql.append(" WHERE ");
        sql.append(" 	c.CAT_WORK_ITEM_TYPE_ID = :catWorkItemTypeId and c.status =1 ");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(c.NAME) LIKE upper(:keySearch) OR upper(c.CODE) LIKE upper(:keySearch)   escape '&')");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("workItemId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("catWorkItemType", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));

        queryCount.setParameter("catWorkItemTypeId", obj.getCatWorkItemTypeId());
        query.setParameter("catWorkItemTypeId", obj.getCatWorkItemTypeId());
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
            queryCount.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
        }

        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<SysUserDetailCOMSDTO> doSearchPerformer(SysUserDetailCOMSDTO obj, List<String> sysGroupId) {

        // tienth_20180329 START
        StringBuilder sql = new StringBuilder("");
        sql.append(" SELECT  ");

        sql.append(" 	SU.SYS_USER_ID  sysUserId, ");
        sql.append(" 	SU.LOGIN_NAME AS loginName, ");
        sql.append(" 	SU.FULL_NAME AS fullName, ");
        sql.append(" 	SU.EMPLOYEE_CODE AS employeeCode, ");
        sql.append(" 	SU.EMAIL AS email, ");
        sql.append(" 	SU.PHONE_NUMBER AS phoneNumber "
                + " FROM SYS_USER SU inner join sys_group b on SU.SYS_GROUP_ID=b.SYS_GROUP_ID "
                + " where (case when b.group_level=4 then "
                + " (select a.sys_group_id from sys_group a where a.sys_group_id= "
                + " (select a.parent_id from sys_group a where a.sys_group_id=b.parent_id)) "
                + " when b.group_level=3 then "
                + " (select a.sys_group_id from sys_group a where a.sys_group_id=b.parent_id) "
                + " else b.sys_group_id end) in (:sysGroupId) ");
        // tienth_20180329 END

        // sql.append(" FROM ");
        // sql.append(" SYS_USER sys ");
        // sql.append(" WHERE ");
        // sql.append(" sys.STATUS = 1 AND sys.SYS_GROUP_ID =:sysGroupId ");

        // sql.append(" sys.SYS_USER_ID sysUserId, ");
        // sql.append(" sys.LOGIN_NAME AS loginName, ");
        // sql.append(" sys.FULL_NAME AS fullName, ");
        // sql.append(" sys.EMPLOYEE_CODE AS employeeCode, ");
        // sql.append(" sys.EMAIL AS email, ");
        // sql.append(" sys.PHONE_NUMBER AS phoneNumber ");
        // sql.append(" FROM ");
        // sql.append(" SYS_USER sys ");
        // sql.append(" WHERE ");
        // sql.append(" sys.STATUS = 1 ");
        // if(obj.getSysGroupId()!=null){
        // sql.append(" AND sys.SYS_GROUP_ID =:sysGroupId ");
        // }

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
            queryCount.setParameterList("sysGroupId", sysGroupId);
            query.setParameterList("sysGroupId", sysGroupId);
        }

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
            queryCount.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
        }
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public void updateStatusNT(Long constructionId) {
        StringBuilder sql = new StringBuilder(
                "UPDATE CONSTRUCTION set status = 6  where CONSTRUCTION_ID = :constructionId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", constructionId);
        query.executeUpdate();

    }

    public List<Long> getListIdConstruction() {
        StringBuilder sql = new StringBuilder("");
        sql.append(
                " select a.CONSTRUCTION_ID constructionId from CONSTRUCTION_ACCEPTANCE_CERT a group by a.CONSTRUCTION_ID  ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("constructionId", new LongType());
        // query.setResultTransformer(Transformers.aliasToBean(ConstructionAcceptanceCertDTO.class));
        return query.list();
    }

    public void updateAcceptancert(ConstructionAcceptanceCertDTO certDTO) {
        StringBuilder sql = new StringBuilder("");
        sql.append(" UPDATE CONSTRUCTION_ACCEPTANCE_CERT a  ");
        sql.append(" SET a.IMPORTER          =:importer , ");
        sql.append(" a.STARTING_DATE       =:dateBD   ");
        if (certDTO.getCompleteDate() != null) {
            sql.append(" , a.COMPLETE_DATE       =:dateKT  ");
        }
        sql.append(" WHERE a.CONSTRUCTION_ID =:id  ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", certDTO.getConstructionId());
        query.setParameter("dateBD", certDTO.getCompleteDate());
        if (certDTO.getCompleteDate() != null) {
            query.setParameter("dateKT", certDTO.getCompleteDate());
        }
        query.setParameter("importer", certDTO.getImporter());
        // query.setResultTransformer(Transformers.aliasToBean(ConstructionAcceptanceCertDTO.class));
        query.executeUpdate();

    }

    public List<StockTransGeneralDTO> getDSVT(Long id) {

        StringBuilder sql = new StringBuilder();

        // chinhpxn20180618
        // sql.append(" WITH record AS ");
        // sql.append(" (SELECT synDetail.GOODS_CODE goodsCode, ");
        // sql.append(" synDetail.GOODS_NAME goodsName, ");
        // sql.append(" synDetail.GOODS_UNIT_NAME goodsUnitName, ");
        // sql.append(" SUM( ");
        // sql.append(" (SELECT SUM(serial.amount) ");
        // sql.append(" FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
        // sql.append(" WHERE serial.SYN_STOCK_TRANS_DETAIL_ID =
        // synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
        // sql.append(" AND syn.TYPE =2 ");
        // sql.append(" )) numberXuat, ");
        // sql.append(" SUM( ");
        // sql.append(" (SELECT SUM(serial.amount) ");
        // sql.append(" FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
        // sql.append(" WHERE serial.SYN_STOCK_TRANS_DETAIL_ID =
        // synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
        // sql.append(" AND syn.TYPE =1 ");
        // sql.append(" AND syn.status =2 ");
        // sql.append(" )) numberThuhoi, ");
        // sql.append(" con.CONSTRUCTION_ID constructionId , ");
        // sql.append(" synDetailSerial.GOODS_ID goodsId, ");
        // sql.append(" conMer.QUANTITY conMerquantity ");
        // sql.append(" FROM SYN_STOCK_TRANS syn inner join CONSTRUCTION con on con.code
        // = syn.CONSTRUCTION_CODE ");
        // sql.append(" LEFT JOIN SYN_STOCK_TRANS_DETAIL synDetail ");
        // sql.append(" ON syn.SYN_STOCK_TRANS_ID = synDetail.SYN_STOCK_TRANS_ID ");
        // sql.append(" AND synDetail.GOODS_IS_SERIAL = 0 ");
        // sql.append(" LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL synDetailSerial ");
        // sql.append(" ON synDetailSerial.SYN_STOCK_TRANS_DETAIL_ID =
        // synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
        // sql.append(" LEFT JOIN CONSTRUCTION_MERCHANDISE conMer ");
        // sql.append(" ON conMer.GOODS_ID = synDetailSerial.GOODS_ID ");
        // sql.append(" AND conMer.CONSTRUCTION_ID = :id AND conMer.GOODS_IS_SERIAL = 0
        // AND conMer.TYPE = 1 ");
        // sql.append(" WHERE syn.SYN_TRANS_TYPE =1 ");
        // sql.append(" AND syn.CONFIRM =1 ");
        // sql.append(" AND con.CONSTRUCTION_ID =:id and synDetailSerial.amount>0 ");
        // sql.append(" GROUP BY synDetail.GOODS_CODE, ");
        // sql.append(" synDetail.GOODS_NAME,synDetail.GOODS_UNIT_NAME
        // ,conMer.CONSTRUCTION_MERCHANDISE_ID, ");
        // sql.append(" con.CONSTRUCTION_ID,synDetailSerial.GOODS_ID,conMer.quantity )
        // ");
        // sql.append(" SELECT re.*, CASE WHEN re.conMerquantity IS NULL ");
        // sql.append(" THEN (NVL(re.numberXuat, 0)-NVL(re.numberThuhoi, 0)) ");
        // sql.append(" ELSE re.conMerquantity ");
        // sql.append(" END quantity FROM record re ");

        // lay quantity tu bang construction_merchandise, group by goods_code

        // sql.append(" WITH record AS ");
        // sql.append(" (SELECT synDetail.GOODS_CODE goodsCode, synDetail.GOODS_NAME
        // goodsName, ");
        // sql.append(" synDetail.GOODS_UNIT_NAME goodsUnitName, ");
        // sql.append(" SUM( (SELECT SUM(serial.amount) ");
        // sql.append(" FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
        // sql.append(" WHERE serial.SYN_STOCK_TRANS_DETAIL_ID =
        // synDetail.SYN_STOCK_TRANS_DETAIL_ID AND syn.TYPE =2 )) numberXuat, ");
        // sql.append(" SUM( (SELECT SUM(serial.amount) FROM
        // SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
        // sql.append(" WHERE serial.SYN_STOCK_TRANS_DETAIL_ID =
        // synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
        // sql.append(" AND syn.TYPE =1 AND syn.status =2 )) numberThuhoi, ");
        // sql.append(" SUM((SELECT SUM(conMer.QUANTITY) FROM CONSTRUCTION_MERCHANDISE
        // conMer ");
        // sql.append(" WHERE conMer.GOODS_ID = synDetail.GOODS_ID AND
        // conMer.CONSTRUCTION_ID = :id AND conMer.TYPE = 1 AND conMer.GOODS_IS_SERIAL =
        // 0 ");
        // sql.append(" GROUP BY conMer.GOODS_CODE)) conMerquantity, ");
        // sql.append(" con.CONSTRUCTION_ID constructionId , ");
        // sql.append(" synDetailSerial.GOODS_ID goodsId ");
        // sql.append(" FROM SYN_STOCK_TRANS syn inner join CONSTRUCTION con on con.code
        // = syn.CONSTRUCTION_CODE ");
        // sql.append(" LEFT JOIN SYN_STOCK_TRANS_DETAIL synDetail ON
        // syn.SYN_STOCK_TRANS_ID = synDetail.SYN_STOCK_TRANS_ID ");
        // sql.append(" AND synDetail.GOODS_IS_SERIAL = 0 ");
        // sql.append(" LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL synDetailSerial ON
        // synDetailSerial.SYN_STOCK_TRANS_DETAIL_ID =
        // synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
        // sql.append(" WHERE syn.SYN_TRANS_TYPE =1 AND syn.CONFIRM =1 AND
        // con.CONSTRUCTION_ID = :id and synDetailSerial.amount>0 ");
        // sql.append(" GROUP BY synDetail.GOODS_CODE,
        // synDetail.GOODS_NAME,synDetail.GOODS_UNIT_NAME ,
        // con.CONSTRUCTION_ID,synDetailSerial.GOODS_ID ) ");
        // sql.append(" SELECT re.*, ");
        // sql.append(" nvl(re.conMerquantity,0) quantity FROM record re ");
        // chinhpxn20180618

        // chinhpxn20180621
        sql.append(
                " WITH record AS  (SELECT synDetail.GOODS_CODE goodsCode,  synDetail.GOODS_NAME goodsName,   synDetail.GOODS_UNIT_NAME goodsUnitName,    synDetail.GOODS_ID goodsId , ");
        sql.append(" sum(nvl(synDetailSerial.AMOUNT,0)) numberXuat,  ");
        sql.append(" sum(nvl((select AMOUNT ");
        sql.append(" from  SYN_STOCK_TRANS a, SYN_STOCK_TRANS_DETAIL_SERIAL b ");
        sql.append(" where  a.SYN_STOCK_TRANS_ID=b.SYN_STOCK_TRANS_ID and a.type=1 and a.status=2 and ");
        sql.append(
                " b.MER_ENTITY_ID=synDetailSerial.MER_ENTITY_ID and a.CONSTRUCTION_CODE = (select code from construction where construction_id = :id)  ),0)) numberThuHoi,  ");
        sql.append(" SUM(nvl(( ");
        sql.append(" select cst_mer.QUANTITY from construction_merchandise cst_mer where cst_mer.type=1 and ");
        sql.append(" cst_mer.MER_ENTITY_ID=synDetailSerial.MER_ENTITY_ID and cst_mer.CONSTRUCTION_ID=:id ");
        sql.append(" ),0)) conMerquantity ");
        sql.append(" from ");
        sql.append(" SYN_STOCK_TRANS syn ");
        sql.append(
                " left join SYN_STOCK_TRANS_DETAIL synDetail on syn.SYN_STOCK_TRANS_ID = synDetail.SYN_STOCK_TRANS_ID ");
        sql.append(
                " LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL synDetailSerial  ON synDetailSerial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID  ");
        sql.append(" and syn.TYPE=2 and syn.STATUS=2 and syn.CONFIRM=1 ");
        sql.append(
                " where syn.CONSTRUCTION_CODE = (select code from construction where construction_id = :id) AND synDetail.GOODS_IS_SERIAL = 0 ");
        sql.append(
                " GROUP BY synDetail.GOODS_CODE,  synDetail.GOODS_NAME,synDetail.GOODS_UNIT_NAME, syn.CONSTRUCTION_CODE, ");
        sql.append(" synDetail.GOODS_ID )   SELECT re.*,  nvl(re.conMerquantity,0) quantity FROM record re ");
        // chinhpxn20180621

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("numberXuat", new DoubleType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("conMerquantity", new DoubleType());
        query.addScalar("numberThuhoi", new DoubleType());

        query.addScalar("goodsId", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(StockTransGeneralDTO.class));
        return query.list();
    }

    public void updateDSVTBA(StockTransGeneralDTO a) {
        StringBuilder sql = new StringBuilder("");
        sql.append(" UPDATE CONSTRUCTION_MERCHANDISE mer SET ");
        sql.append("  mer.GOODS_ID=:id ");
        if (a.getQuantity() != null) {
            sql.append(" , mer.QUANTITY                       =:quantity  ");
        }
        if (a.getRemainQuantity() != null) {
            sql.append(" ,  mer.REMAIN_COUNT                   =:remainCount ");
        }
        sql.append(" WHERE mer.GOODS_ID=:id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", a.getGoodsId());
        if (a.getRemainQuantity() != null) {
            query.setParameter("remainCount", a.getRemainQuantity());
        }
        if (a.getQuantity() != null) {
            query.setParameter("quantity", a.getQuantity());
        }
        query.executeUpdate();
    }

    public void updateDSTBBA(StockTransGeneralDTO dto) {
        StringBuilder sql = new StringBuilder(" ");
        sql.append(" UPDATE CONSTRUCTION_MERCHANDISE mer SET");
        sql.append(" mer.QUANTITY                       = 1 , ");
        sql.append("  mer.REMAIN_COUNT                   = 0 ");
        sql.append(" WHERE mer.GOODS_ID=:id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", dto.getGoodsId());
        query.executeUpdate();
    }

    public void updateDSTBBANoEmploy(StockTransGeneralDTO dto) {
        StringBuilder sql = new StringBuilder(" ");
        sql.append(" UPDATE CONSTRUCTION_MERCHANDISE mer SET");
        sql.append(" mer.QUANTITY                       = 0 , ");
        sql.append("  mer.REMAIN_COUNT                   = 1 ");
        sql.append(" WHERE mer.GOODS_ID=:id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", dto.getGoodsId());
        query.executeUpdate();
    }

    public Long getconstructionStatus(Long id) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("select status status from construction where construction_id = :id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("status", new LongType());
        List<Long> listId = query.list();
        return listId.get(0);
    }

    public List<StockTransGeneralDTO> getListVTBB(Long id) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT s.CONSTRUCTION_ID constructionId, ");
        sql.append(" m.GOODS_CODE goodsCode, ");
        sql.append(" m.GOODS_ID goodsId, ");
        sql.append(" m.GOODS_NAME goodsName, ");
        sql.append(" m.CAT_UNIT_NAME goodsUnitName, ");
        sql.append(" SUM(ss.QUANTITY) numberXuat, ");
        sql.append(" SUM((SELECT SUM(ae.quantity) ");
        sql.append(" FROM ASSET_MANAGEMENT_REQUEST a ");
        sql.append(" INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ");
        sql.append("  ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID ");
        sql.append(" WHERE m.goods_code    =ae.GOODS_CODE ");
        sql.append(" AND a.CONSTRUCTION_ID =s.CONSTRUCTION_ID ");
        sql.append(" AND ae.MER_ENTITY_ID  =m.MER_ENTITY_ID AND a.STATUS IN(1,2,3) ");
        sql.append(" )) numberThuhoi, ");
        sql.append(" (SELECT SUM(cm.QUANTITY) ");
        sql.append(" FROM CONSTRUCTION_MERCHANDISE cm ");
        sql.append(" WHERE cm.TYPE         =2 ");
        sql.append(" AND m.GOODS_CODE      = cm.GOODS_CODE ");
        sql.append(" AND s.CONSTRUCTION_ID = cm.CONSTRUCTION_ID  AND cm.GOODS_IS_SERIAL = 0 ");
        sql.append("  ) numberSuDung ");
        sql.append(" FROM stock_trans s ");
        sql.append(" INNER JOIN STOCK_TRANS_DETAIL sd ");
        sql.append(" ON s.STOCK_TRANS_ID   = sd.STOCK_TRANS_ID ");
        sql.append(" INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss ");
        sql.append("  ON ss.STOCK_TRANS_ID         = s.STOCK_TRANS_ID ");
        sql.append("  AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID ");
        sql.append(" INNER JOIN MER_ENTITY m ");
        sql.append(" ON ss.MER_ENTITY_ID   =m.MER_ENTITY_ID ");
        sql.append(" AND s.CONFIRM         = 1 ");
        sql.append(" AND s.TYPE            = 2 ");
        sql.append(" AND s.STATUS          = 2 ");
        sql.append(" AND M.SERIAL         IS NULL ");
        sql.append(" AND sd.GOODS_IS_SERIAL=0 ");
        sql.append(" AND s.CONSTRUCTION_ID =:id ");
        sql.append(" GROUP BY s.CONSTRUCTION_ID,  ");
        sql.append(" m.GOODS_CODE, m.GOODS_ID, m.GOODS_NAME, m.CAT_UNIT_NAME  ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("numberXuat", new DoubleType());
        // query.addScalar("quantity", new DoubleType());
        // query.addScalar("conMerquantity", new DoubleType());
        query.addScalar("numberThuhoi", new DoubleType());
        query.addScalar("numberSuDung", new DoubleType());
        // query.addScalar("constructionMerchadiseId", new LongType());
        query.addScalar("constructionId", new LongType());
        // query.addScalar("merEntityId", new LongType());
        query.addScalar("goodsId", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(StockTransGeneralDTO.class));
        return query.list();
    }

    public List<StockTransGeneralDTO> getListVTBB1(Long id, Long assetManagementRequestId) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT s.CONSTRUCTION_ID constructionId, ");
        sql.append(" m.GOODS_CODE goodsCode, ");
        sql.append(" m.GOODS_ID goodsId, ");
        sql.append(" m.GOODS_NAME goodsName, ");
        sql.append(" m.CAT_UNIT_NAME goodsUnitName, ");
        sql.append(" SUM(ss.QUANTITY) numberXuat, ");
        sql.append(" SUM((SELECT SUM(ae.quantity) ");
        sql.append(" FROM ASSET_MANAGEMENT_REQUEST a ");
        sql.append(" INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ");
        sql.append("  ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID ");
        sql.append(" WHERE m.goods_code    =ae.GOODS_CODE ");
        sql.append(" AND a.CONSTRUCTION_ID =s.CONSTRUCTION_ID ");
        sql.append(
                " AND ae.MER_ENTITY_ID  =m.MER_ENTITY_ID AND a.STATUS IN(1,2,3) AND  a.ASSET_MANAGEMENT_REQUEST_ID =:assetManagementRequestId ");
        sql.append(" )) numberThuhoi, ");
        sql.append(" (SELECT SUM(cm.QUANTITY) ");
        sql.append(" FROM CONSTRUCTION_MERCHANDISE cm ");
        sql.append(" WHERE cm.TYPE         =2 ");
        sql.append(" AND m.GOODS_CODE      = cm.GOODS_CODE ");
        sql.append(" AND s.CONSTRUCTION_ID = cm.CONSTRUCTION_ID  AND cm.GOODS_IS_SERIAL = 0 ");
        sql.append("  ) numberSuDung ");
        sql.append(" FROM stock_trans s ");
        sql.append(" INNER JOIN STOCK_TRANS_DETAIL sd ");
        sql.append(" ON s.STOCK_TRANS_ID   = sd.STOCK_TRANS_ID ");
        sql.append(" INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss ");
        sql.append("  ON ss.STOCK_TRANS_ID         = s.STOCK_TRANS_ID ");
        sql.append("  AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID ");
        sql.append(" INNER JOIN MER_ENTITY m ");
        sql.append(" ON ss.MER_ENTITY_ID   =m.MER_ENTITY_ID ");
        sql.append(" AND s.CONFIRM         = 1 ");
        sql.append(" AND s.TYPE            = 2 ");
        sql.append(" AND s.STATUS          = 2 ");
        sql.append(" AND M.SERIAL         IS NULL ");
        sql.append(" AND sd.GOODS_IS_SERIAL=0 ");
        sql.append(" AND s.CONSTRUCTION_ID =:id ");
        sql.append(" GROUP BY s.CONSTRUCTION_ID,  ");
        sql.append(" m.GOODS_CODE, m.GOODS_ID, m.GOODS_NAME, m.CAT_UNIT_NAME  ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.setParameter("assetManagementRequestId", assetManagementRequestId);
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("numberXuat", new DoubleType());
        // query.addScalar("quantity", new DoubleType());
        // query.addScalar("conMerquantity", new DoubleType());
        query.addScalar("numberThuhoi", new DoubleType());
        query.addScalar("numberSuDung", new DoubleType());
        // query.addScalar("constructionMerchadiseId", new LongType());
        query.addScalar("constructionId", new LongType());
        // query.addScalar("merEntityId", new LongType());
        query.addScalar("goodsId", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(StockTransGeneralDTO.class));
        return query.list();
    }

    public void UpdateIsReturn(SynStockTransDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" update CONSTRUCTION a set a.IS_RETURN =0 where a.CONSTRUCTION_ID=:id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obj.getConstructionId());
        query.executeUpdate();
    }

    // Hungnx_05062018_start
    public List<ConstructionDetailDTO> reportConstruction(ConstructionDetailDTO criteria) {
        StringBuilder stringBuilder = buildQueryReportConstruction();
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            stringBuilder.append(" AND UPPER(T1.CODE) LIKE UPPER(:keySearch)");
        }
        if (StringUtils.isNotEmpty(criteria.getCntContractCode())) {
            stringBuilder.append(" AND T6.CODE = :contractCode");
        }
        if (null != criteria.getListCatConstructionType() && criteria.getListCatConstructionType().size() > 0) {
            stringBuilder.append(" AND T1.CAT_CONSTRUCTION_TYPE_ID in (:listCatConstructionType)");
        }
        if (null != criteria.getListStatus()) {
            stringBuilder.append(" AND T1.STATUS IN (:listStatus)");
        }
        if (null != criteria.getStartingDateFrom()) {
            stringBuilder.append(" AND T1.STARTING_DATE >= :startingDateFrom");
        }
        if (null != criteria.getStartingDateTo()) {
            stringBuilder.append(" AND T1.STARTING_DATE <= :startingDateTo");
        }
        if (null != criteria.getCompleteDateFrom()) {
            stringBuilder.append(" AND T1.COMPLETE_DATE >= :completeDateFrom");
        }
        if (null != criteria.getCompleteDateTo()) {
            stringBuilder.append(" AND T1.COMPLETE_DATE <= :completeDateTo");
        }
        if (null != criteria.getStationCodeLst() && criteria.getStationCodeLst().size() > 0) {
            stringBuilder.append(" AND T2.CODE IN (:stationCodeLst)");
        }
        // tuannt_15/08/2018_start
        if (criteria.getCatProvinceId() != null) {
            stringBuilder.append(" AND catp.CAT_PROVINCE_ID = :catProvinceId ");
        }
        // tuannt_15/08/2018_start
        stringBuilder.append(" ORDER BY T1.CODE");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(stringBuilder.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("code", new StringType());
        query.addScalar("completeDate", new DateType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("catContructionTypeName", new StringType());
        query.addScalar("startingDate", new DateType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("catStationHouseCode", new StringType());
        query.addScalar("cntContractCode", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("groundPlanDate", new DateType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("catProvinceName", new StringType());
        query.addScalar("handoverDate", new DateType());
//        hoanm1_20181220_start
//        query.addScalar("dateComplete", new StringType());
        query.addScalar("valueComplete", new StringType());
//        hoanm1_20181220_end
        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }

        if (criteria.getListStatus() != null && !criteria.getListStatus().isEmpty()) {
            query.setParameterList("listStatus", criteria.getListStatus());
            queryCount.setParameterList("listStatus", criteria.getListStatus());
        }
        if (null != criteria.getStartingDateFrom()) {
            query.setParameter("startingDateFrom", criteria.getStartingDateFrom());
            queryCount.setParameter("startingDateFrom", criteria.getStartingDateFrom());
        }
        if (null != criteria.getStartingDateTo()) {
            query.setParameter("startingDateTo", criteria.getStartingDateTo());
            queryCount.setParameter("startingDateTo", criteria.getStartingDateTo());
        }
        if (null != criteria.getCompleteDateFrom()) {
            query.setParameter("completeDateFrom", criteria.getCompleteDateFrom());
            queryCount.setParameter("completeDateFrom", criteria.getCompleteDateFrom());
        }
        if (null != criteria.getCompleteDateTo()) {
            query.setParameter("completeDateTo", criteria.getCompleteDateTo());
            queryCount.setParameter("completeDateTo", criteria.getCompleteDateTo());
        }
        if (criteria.getListCatConstructionType() != null && !criteria.getListCatConstructionType().isEmpty()) {
            query.setParameterList("listCatConstructionType", criteria.getListCatConstructionType());
            queryCount.setParameterList("listCatConstructionType", criteria.getListCatConstructionType());
        }
        if (null != criteria.getStationCodeLst() && criteria.getStationCodeLst().size() > 0) {
            query.setParameterList("stationCodeLst", criteria.getStationCodeLst());
            queryCount.setParameterList("stationCodeLst", criteria.getStationCodeLst());
        }
        if (StringUtils.isNotEmpty(criteria.getCntContractCode())) {
            query.setParameter("contractCode", criteria.getCntContractCode());
            queryCount.setParameter("contractCode", criteria.getCntContractCode());
        }
        // tuannt_15/08/2018_start
        if (criteria.getCatProvinceId() != null) {
            query.setParameter("catProvinceId", criteria.getCatProvinceId());
            queryCount.setParameter("catProvinceId", criteria.getCatProvinceId());
        }
        // tuannt_15/08/2018_start
        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize().intValue());
            query.setMaxResults(criteria.getPageSize().intValue());
        }
        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    private StringBuilder buildQueryReportConstruction() {
        StringBuilder stringBuilder = new StringBuilder("SELECT T1.CODE CODE, T1.NAME NAME, T2.CODE catStationCode, "
//                + "  T1.COMPLETE_DATE completeDate,"
                + " T1.STATUS status, T1.STARTING_DATE startingDate, T1.CONSTRUCTION_ID constructionId, "
                + " (SELECT T3.code FROM CAT_STATION_HOUSE T3 where T2.CAT_STATION_HOUSE_ID = T3.CAT_STATION_HOUSE_ID) catStationHouseCode,"
                + " T4.NAME catContructionTypeName," + " T6.CODE cntContractCode," + " T7.NAME sysGroupName,"
                + " T8.GROUND_PLAN_DATE groundPlanDate," + " catp.CAT_PROVINCE_ID catProvinceId," + " catp.CODE catProvinceCode," + " catp.NAME catProvinceName," + " T1.HANDOVER_DATE handoverDate"
                + " ,case when T1.status=5 then T1.complete_date when T1.status=7 then T1.APPROVE_COMPLETE_DATE when T1.status=8 then T1.APPROVE_REVENUE_DATE end completeDate, "
                + " case when T1.status=5 then nvl(to_number(T1.complete_value),0) when T1.status=7 then nvl(T1.APPROVE_COMPLETE_value,T1.COMPLETE_APPROVED_VALUE_PLAN) when T1.status=8 "
                + " then nvl(T1.APPROVE_REVENUE_value,T1.APPROVE_REVENUE_value_plan) end valueComplete "
                + " FROM CONSTRUCTION T1"
//				hoanm1_20180824_start
                + " LEFT JOIN CAT_STATION T2 ON T1.CAT_STATION_ID = T2.CAT_STATION_ID"
                + " LEFT JOIN CAT_PROVINCE catp ON catp.CAT_PROVINCE_ID = T2.CAT_PROVINCE_ID"
//				hoanm1_20180824_end
                + " LEFT JOIN CAT_CONSTRUCTION_TYPE T4 ON T1.CAT_CONSTRUCTION_TYPE_ID = T4.CAT_CONSTRUCTION_TYPE_ID"
                + " LEFT JOIN ( SELECT DISTINCT CONSTRUCTION_ID,CODE from CNT_CONSTR_WORK_ITEM_TASK T5 ,CNT_CONTRACT T6 where T6.CNT_CONTRACT_ID = T5.CNT_CONTRACT_ID"
                + " AND T6.CONTRACT_TYPE = 0 and T6.status !=0)T6 ON T1.CONSTRUCTION_ID = T6.CONSTRUCTION_ID "
                + " LEFT JOIN SYS_GROUP T7 ON T7.SYS_GROUP_ID = T1.SYS_GROUP_ID"
                + " LEFT JOIN CONTRUCTION_LAND_HANDOVER_PLAN T8 on T8.CONSTRUCTION_ID = T1.CONSTRUCTION_ID"
                + " WHERE 1=1 ");
        return stringBuilder;
    }

    // Hungnx_07062018_end

    public int getByAdResourceCon(SysUserRequest request, String createTask) {
        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT e.data_code dataCode, e.DATA_ID dataId, ");
        sql.append("  op.code ");
        sql.append("  ||' ' ");
        sql.append("  ||ad.code adResource ");
        sql.append("FROM SYS_USER a, ");
        sql.append("  USER_ROLE b, ");
        sql.append("  SYS_ROLE c, ");
        sql.append("  USER_ROLE_DATA d, ");
        sql.append("  DOMAIN_DATA e, ");
        sql.append("  ROLE_PERMISSION role_per, ");
        sql.append("  permission pe, ");
        sql.append("  OPERATION op, ");
        sql.append("  AD_RESOURCE ad ");
        sql.append("WHERE a.SYS_USER_ID       =b.SYS_USER_ID ");
        sql.append("AND b.SYS_ROLE_ID         =c.SYS_ROLE_ID ");
        sql.append("AND b.USER_ROLE_ID        =d.USER_ROLE_ID ");
        sql.append("AND d.DOMAIN_DATA_ID      =e.DOMAIN_DATA_ID ");
        sql.append("AND c.SYS_ROLE_ID         =role_per.SYS_ROLE_ID ");
        sql.append("AND role_per.permission_id=pe.permission_id ");
        sql.append("AND pe.OPERATION_id       =op.OPERATION_id ");
        sql.append("AND pe.AD_RESOURCE_ID     =ad.AD_RESOURCE_ID ");
        sql.append("AND a.SYS_USER_ID         = '" + request.getSysUserId() + "' ");
        sql.append("AND upper(op.code ");
        sql.append("  ||' ' ");
        sql.append("  ||ad.code) LIKE '%" + createTask + "%' ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("dataCode", new StringType());
        query.addScalar("adResource", new StringType());
        query.addScalar("dataId", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionScheduleWorkItemDTO.class));
        List<ConstructionScheduleWorkItemDTO> lt = query.list();
        if (lt.isEmpty()) {
            return (int) 1;
        } else {
            return (int) 0;
        }
    }

    public List<ConstructionStationWorkItemDTO> getListConstructionByIdSysGroupIdCreate_task(SysUserRequest request) {
        StringBuilder strSql = new StringBuilder(
                " SELECT " + " ct.CONSTRUCTION_ID constructionId ,ct.NAME name , ct.CODE  constructionCode "
                        + " From CONSTRUCTION ct  " + " WHERE ct.status in (3,4,5,6,7) ORDER BY ct.CODE ");
        SQLQuery query = getSession().createSQLQuery(strSql.toString());
        query.addScalar("name", new StringType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionStationWorkItemDTO.class));
        return query.list();
    }

    public List<AppParamDTO> getAmountSLTN(Long id) {
        StringBuilder sql = new StringBuilder(" ");
        sql.append(
                " select a.AMOUNT amount , a.TYPE code , a.CONFIRM confirm,CONSTRUCTION_TASK_DAILY_ID constructionTaskDailyId from CONSTRUCTION_TASK_DAILY a  where a.CONSTRUCTION_TASK_ID =:id AND a.confirm in (0,1) AND TO_CHAR(a.CREATED_DATE,'dd/mm/YYYY') = TO_CHAR(sysdate,'dd/mm/YYYY') ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("amount", new DoubleType());
        query.addScalar("code", new StringType());
        query.addScalar("confirm", new StringType());
        // hoanm1_20180703_start
        query.addScalar("constructionTaskDailyId", new LongType());
        // hoanm1_20180703_end
        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));
        return query.list();
    }

    public String getName(String code) {
        StringBuilder sql = new StringBuilder(" ");
        sql.append(
                " select app.NAME name from APP_PARAM app WHERE app.PAR_TYPE='CONSTRUCTION_TYPE_DAILY' and app.code=:code ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("code", code);
        query.addScalar("name", new StringType());
        List<String> lt = query.list();
        return lt.get(0);
    }

    //nhantv tim kiem cong trinh khi chuyen nguoi
    public List<ConstructionDTO> getForChangePerformer(ConstructionTaskDTO obj) {
    	 StringBuilder sql = new StringBuilder("select construction_id constructionId"
                 + " , name name "
                 + " ,code code "
                 + " ,status status"
                 + " ,(select name from CAT_CONSTRUCTION_TYPE where CAT_CONSTRUCTION_TYPE_ID = construction.CAT_CONSTRUCTION_TYPE_ID) catContructionTypeName "
                 + " from construction"
                 + " where construction_id in "
                 + " (select construction_id from construction_task task,detail_month_plan dmp where task.year= :year and task.month =:month "
                 + " and task.sys_group_id = :sysGroupId and task.level_id = 3 "
                 + " and task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status =1  ");
        if (obj.getPerformerId() != null)
            sql.append("and PERFORMER_ID = :performerId");
        sql.append(")");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" and (upper(code) like upper(:keySearch) or upper(name) like upper(:keySearch) ) ");
        }
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.setParameter("year", obj.getYear());
        query.setParameter("month", obj.getMonth());
        query.setParameter("sysGroupId", obj.getSysGroupId());
        queryCount.setParameter("year", obj.getYear());
        queryCount.setParameter("month", obj.getMonth());
        queryCount.setParameter("sysGroupId", obj.getSysGroupId());
        if (obj.getPerformerId() != null) {
            query.setParameter("performerId", obj.getPerformerId());
            queryCount.setParameter("performerId", obj.getPerformerId());
        }
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }

        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("catContructionTypeName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }
  //nhantv tim kiem cong trinh khi chuyen nguoi
    public List<ConstructionDTO> getForChangePerformerAutocomplete(ConstructionTaskDTO obj) {
        StringBuilder sql = new StringBuilder("select construction_id constructionId"
                + " , name name "
                + " ,code code "
                + " ,status status"
                + " ,(select name from CAT_CONSTRUCTION_TYPE where CAT_CONSTRUCTION_TYPE_ID = construction.CAT_CONSTRUCTION_TYPE_ID) catContructionTypeName "
                + " from construction"
                + " where construction_id in "
                + " (select construction_id from construction_task task,detail_month_plan dmp where task.year= :year and task.month =:month "
                + " and task.sys_group_id = :sysGroupId and task.level_id = 3 "
                + " and task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status =1  ");
        if (obj.getPerformerId() != null)
            sql.append("and PERFORMER_ID = :performerId");
        sql.append(") ");
        if (StringUtils.isNotEmpty(obj.getKeySearch()))
            sql.append(" and (upper(code) like upper(:keySearch) or upper(name) like upper(:keySearch) ) ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.setParameter("year", obj.getYear());
        query.setParameter("month", obj.getMonth());
        query.setParameter("sysGroupId", obj.getSysGroupId());
        if (obj.getPerformerId() != null)
            query.setParameter("performerId", obj.getPerformerId());
        if (StringUtils.isNotEmpty(obj.getKeySearch()))
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");

        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("catContructionTypeName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        return query.list();
    }
//    kepv_20181010_start
    /***
	 * Created by PVKE - 28-09-2018 Láº¥y cÃ¡c thÃ´ng tin bÃ n giao, cáº¥p gpxd, thiáº¿t káº¿
	 * theo cÃ´ng trÃ¬nh ID
	 * 
	 * @param constructionID
	 * @return
	 */
	public ConstructionExtraDTO getConstructionExtraDTOByID(long constructionID) {
		ConstructionExtraDTO result = null;
		try {
			StringBuilder stringBuilder = new StringBuilder();
			stringBuilder.append("SELECT ");
			stringBuilder.append("CONSTRUCTION_ID, HANDOVER_DATE_BUILD, HANDOVER_NOTE_BUILD, HANDOVER_DATE_ELECTRIC, ");
			stringBuilder.append("HANDOVER_NOTE_ELECTRIC, BUILDING_PERMIT_DATE, IS_BUILDING_PERMIT, STARTING_DATE, ");
			stringBuilder.append("STATUS, BLUEPRINT_DATE, UPDATED_DATE, UPDATED_USER_ID, UPDATED_GROUP_ID ");
			stringBuilder.append("FROM CONSTRUCTION ");
			stringBuilder.append("WHERE CONSTRUCTION_ID = :constructionid");

			SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
			query.setParameter("constructionid", constructionID);
			query.addScalar("construction_id", new LongType());
			query.addScalar("handover_date_build", new DateType());
			query.addScalar("handover_note_build", new StringType());
			query.addScalar("handover_date_electric", new DateType());
			query.addScalar("handover_note_electric", new StringType());
			query.addScalar("is_building_permit", new StringType());
			query.addScalar("building_permit_date", new DateType());
			query.addScalar("blueprint_date", new DateType());
			query.addScalar("status", new StringType());
			query.addScalar("updated_date", new DateType());
			query.addScalar("updated_user_id", new LongType());
			query.addScalar("updated_group_id", new LongType());
			query.addScalar("starting_date", new DateType());

			query.setResultTransformer(Transformers.aliasToBean(ConstructionExtraDTO.class));
			@SuppressWarnings("unchecked")
			List<ConstructionExtraDTO> data = query.list();
			if (data != null && data.size() > 0) {
				result = (ConstructionExtraDTO) data.get(0);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;

	}
	/***
	 * Created by: KePVE - 28-09-2018 Cáº­p nháº­t thÃ´ng tin cÃ´ng trÃ¬nh: BÃ n giao, cáº¥p
	 * gpxd vÃ  thiáº¿t káº¿
	 * 
	 * @param obj
	 * @return
	 */
	public boolean updateConstructionExtra(ConstructionExtraDTORequest obj) {
		boolean result = false;
		try {
			
			Date buildingPermitDate = null;
			StringBuilder sql = new StringBuilder();
			sql.append("Update CONSTRUCTION SET");
			sql.append(" STARTING_DATE = :STARTING_DATE, ");
			sql.append(" HANDOVER_DATE_BUILD = :HANDOVER_DATE_BUILD, ");
			sql.append(" HANDOVER_NOTE_BUILD = :HANDOVER_NOTE_BUILD, ");
			sql.append(" HANDOVER_DATE_ELECTRIC = :HANDOVER_DATE_ELECTRIC, ");
			sql.append(" HANDOVER_NOTE_ELECTRIC = :HANDOVER_NOTE_ELECTRIC, ");

			if (obj.getIs_building_permit() != null && obj.getIs_building_permit().equals("1")) {
				// Báº±ng 1 má»›i cho phÃ©p update ngÃ y cáº¥p giáº¥y phÃ©p xÃ¢y dá»±ng
				sql.append(" BUILDING_PERMIT_DATE = :BUILDING_PERMIT_DATE, ");
				buildingPermitDate = obj.getBuilding_permit_date();
			}

			if (obj.getStatus() != null && obj.getStatus().equals("1")) {
				sql.append(" STATUS = '2', ");// 2 - chá» khá»Ÿi cÃ´ng				
			}

			sql.append(" BLUEPRINT_DATE = :BLUEPRINT_DATE, ");
			sql.append(" UPDATED_DATE = sysDate, ");
			sql.append(" UPDATED_USER_ID = :UPDATED_USER_ID, ");
			sql.append(" UPDATED_GROUP_ID = :UPDATED_GROUP_ID ");
			sql.append(" WHERE CONSTRUCTION_ID = :CONSTRUCTION_ID ");

			SQLQuery query = getSession().createSQLQuery(sql.toString());

			query.setParameter("STARTING_DATE", obj.getStarting_date(), new DateType());
			query.setParameter("HANDOVER_DATE_BUILD", obj.getHandover_date_build(), new DateType());
			query.setParameter("HANDOVER_NOTE_BUILD", obj.getHandover_note_build(), new StringType());
			query.setParameter("HANDOVER_DATE_ELECTRIC", obj.getHandover_date_electric(), new DateType());
			query.setParameter("HANDOVER_NOTE_ELECTRIC", obj.getHandover_note_electric(), new StringType());

			query.setParameter("BLUEPRINT_DATE", obj.getBlueprint_date(), new DateType());
			query.setParameter("UPDATED_USER_ID", obj.getUpdated_user_id(), new LongType());
			query.setParameter("UPDATED_GROUP_ID", obj.getUpdated_group_id(), new LongType());
			query.setParameter("CONSTRUCTION_ID", obj.getConstruction_id(), new LongType());

//			if (status.length() > 0) {
//				query.setParameter("STATUS", status, new StringType());
//			}
			if (buildingPermitDate != null) {
				query.setParameter("BUILDING_PERMIT_DATE", buildingPermitDate, new DateType());
			}

			int affectRow = query.executeUpdate();
			if (affectRow > 0) {
				try {
					// Update áº£nh

					//
					saveImagePathsDao(obj.getLstHandOverBuildingImages(), obj.getConstruction_id(),
							obj.getUserRequest(), "41");

					//
					saveImagePathsDao(obj.getLstHandOverElectricityImages(), obj.getConstruction_id(),
							obj.getUserRequest(), "53");

					// GPXD
					saveImagePathsDao(obj.getLstLicenseImages(), obj.getConstruction_id(), obj.getUserRequest(), "54");

					//
					saveImagePathsDao(obj.getLstDesignImages(), obj.getConstruction_id(), obj.getUserRequest(), "55");

				} catch (Exception e) {
					e.printStackTrace();
				}
				result = true;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	public void saveImagePathsDao(List<ConstructionImageInfo> lstConstructionImages, long constructionID,
			SysUserRequest request, String type) {

		if (lstConstructionImages == null) {
			return;
		}
		lstConstructionImages = saveConstructionImages(lstConstructionImages);
		String strDescription = "Cập nhật thông tin công trình";
		switch (type) {
		case "41":
			strDescription = "41: Công trình bàn giao mặt bằng xây dựng";
			break;
		case "53":
			strDescription = "53: Công trình bàn giao mặt bằng điện";
			break;			
		case "54":
			strDescription = "54: Công trình giấy phép xây dựng";
			break;
		case "55":
			strDescription = "55: Công trình thiết kế xây dựng";
			break;		
		}

		for (ConstructionImageInfo constructionImage : lstConstructionImages) {

			UtilAttachDocumentBO utilAttachDocumentBO = new UtilAttachDocumentBO();
			utilAttachDocumentBO.setObjectId(constructionID);
			utilAttachDocumentBO.setName(constructionImage.getImageName());
			utilAttachDocumentBO.setType(type);
			utilAttachDocumentBO.setDescription(strDescription);
			utilAttachDocumentBO.setStatus("1");
			utilAttachDocumentBO.setFilePath(constructionImage.getImagePath());
			utilAttachDocumentBO.setCreatedDate(new Date());
			utilAttachDocumentBO.setCreatedUserId(request.getSysUserId());
			utilAttachDocumentBO.setCreatedUserName(request.getName());

			long ret = utilAttachDocumentDAO.saveObject(utilAttachDocumentBO);

			System.out.println("ret " + ret);
		}
	}

	public List<ConstructionImageInfo> saveConstructionImages(List<ConstructionImageInfo> lstConstructionImages) {
		List<ConstructionImageInfo> result = new ArrayList<>();
		for (ConstructionImageInfo constructionImage : lstConstructionImages) {
			if (constructionImage.getStatus() == 0) {
				ConstructionImageInfo obj = new ConstructionImageInfo();
				obj.setImageName(constructionImage.getImageName());
				obj.setLatitude(constructionImage.getLatitude());
				obj.setLongtitude(constructionImage.getLongtitude());
				InputStream inputStream = ImageUtil.convertBase64ToInputStream(constructionImage.getBase64String());
				try {
					String imagePath = UFile.writeToFileServerATTT2(inputStream, constructionImage.getImageName(),
							input_image_sub_folder_upload, folder2Upload);

					obj.setImagePath(imagePath);
				} catch (Exception e) {
					// return result;
					// throw new BusinessException("Loi khi save file", e);
					continue;
				}
				result.add(obj);
			}

			if (constructionImage.getStatus() == -1 && constructionImage.getImagePath() != "") {
//				ImageUtil.deleteFile(constructionImage.getImagePath());
				utilAttachDocumentDAO.updateUtilAttachDocumentById(constructionImage.getUtilAttachDocumentId());
			}
		}

		return result;
	}
//	kepv_20181010_end
 //-----Huypq_20181010-start------
    public List<ConstructionDetailDTO> getCheckCodeList(ConstructionDetailDTO obj) {
    	StringBuilder sql = new StringBuilder( "SELECT CODE code FROM CONSTRUCTION WHERE STATUS != 0"
    			+ " AND upper(CODE) LIKE upper(:name) escape '&' ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("code", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
        query.setParameter("name", obj.getCode());
        return query.list();
    }
    
    //Tungtt_24/1/2019 start
    public ConstructionDTO getDataUpdate(ConstructionDTO obj) {
    	StringBuilder sql = new StringBuilder( "SELECT cfu.sys_user_id sysUserId,su.full_name sysUserName " + 
    			"FROM config_user_province cfu " + 
    			"LEFT JOIN sys_user su " + 
    			"ON cfu.sys_user_id = su.sys_user_id " + 
    			"WHERE cfu.sys_group_id  =:sysGroupId  " + 
    			"AND cfu.cat_province_id = " + 
    			"  (SELECT cs.cat_province_id " + 
    			"  FROM construction t " + 
    			"  LEFT JOIN cat_station cs " + 
    			"  ON cs.cat_station_id = t.cat_station_id " + 
    			"  WHERE t.construction_id =:constructionId) ");
    	SQLQuery query = getSession().createSQLQuery(sql.toString());
    	 query.addScalar("sysUserId", new LongType());
         query.addScalar("sysUserName", new StringType());
		 query.setParameter("constructionId", obj.getConstructionId());
		 query.setParameter("sysGroupId", obj.getSysGroupId());
         query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));
         return (ConstructionDTO) query.uniqueResult();
    }
    
    public void updateUnitConstruction(long sysUserId, String sysUserName, long constructionId) {
		// TODO Auto-generated method stub
    	StringBuilder sql = new StringBuilder(" UPDATE syn_stock_trans sst "
    			+ "SET sst.confirm = 0, sst.confirm_description = null, " 
    			+ "sst.shipper_id =:sysUserId , "
    			+ "sst.last_shipper_id =:sysUserId, " 
    			+ "sst.shipper_name =:sysUserName "
    			+ " WHERE sst.confirm != 1"
    			+ " AND sst.TYPE = 2"
    			+ " AND sst.BUSSINESS_TYPE = 1"
    			+ " AND sst.construction_id =:constructionId");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("sysUserId",sysUserId);
		query.setParameter("sysUserName",sysUserName);
		query.setParameter("constructionId",constructionId);
		query.executeUpdate();
	}
    
   
  
  //Tungtt_24/1/2019 end
    //Huypq-update isBuildingPermit=1 for construction file import
    public Long updateIsBuildingPermit(ConstructionDetailDTO obj) {
        StringBuilder sql = new StringBuilder("UPDATE CONSTRUCTION "
        		+ " set IS_BUILDING_PERMIT = 1"
        		+ " WHERE CODE IN (:constructionCodeLst)");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameterList("constructionCodeLst", obj.getConstructionCodeLst());
        int values=query.executeUpdate();
        return (long)values;
    }
    
  //-----Huypq-end------
    public Map<String, ConstructionDetailDTO> getCodeAndIdForValidate(){
    	try{
    	 StringBuilder sql = new StringBuilder("SELECT cons.CONSTRUCTION_ID constructionId," + " cons.NAME name,"
                 + "cons.CODE code"
                 + " From CONSTRUCTION cons "
                 + " where cons.status != 0");
			SQLQuery query = getSession().createSQLQuery(sql.toString());
			query.setResultTransformer(Transformers
					.aliasToBean(ConstructionDetailDTO.class));
			query.addScalar("constructionId", new LongType());
			query.addScalar("name", new StringType());
			query.addScalar("code", new StringType());
			List<ConstructionDetailDTO> constructionSpace = query.list();

			Map<String, ConstructionDetailDTO> constructionMap = new HashMap<String, ConstructionDetailDTO>();
			for (ConstructionDetailDTO obj : constructionSpace) {
				constructionMap.put(obj.getCode(), obj);
			}
			return constructionMap;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
    }
  //tanqn start 20181102 
    public void updateConstructionDto(ConstructionDTO obj) {
//        	StringBuilder sql = new StringBuilder("UPDATE RP_HSHC HC "
//        			+ "SET HC.COMPLETEVALUE=0," 
//        			+ "HC.COMPLETESTATE=3,"
//        			+ "HC.COMPLETE_UPDATE_DATE=SYSDATE, "
//        			+ "HC.STATUS='0'  "
//        			+ " WHERE  HC.CONSTRUCTIONID =:CONSTRUCTIONID");
//    	StringBuilder sql = new StringBuilder("update construction set approve_complete_state = 3,approve_complete_value=0, "
//    			+ " approve_complete_description =:approveCompleteDescription where construction_id =:constructionId");
    	StringBuilder sql = new StringBuilder("UPDATE RP_HSHC "
    			+ " set COMPLETEVALUE=0,"
    			+ " COMPLETESTATE=3,"
    			+ " COMPLETE_UPDATE_DATE=SYSDATE,"
    			+ " APPROVE_COMPLETE_DESCRIPTION=:approveDescription,"
    			+ " COMPLETE_USER_UPDATE=:sysUserId "
    			+ " where CONSTRUCTIONID =:CONSTRUCTIONID ");
    	SQLQuery query= getSession().createSQLQuery(sql.toString());
//    	query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));
    	query.setParameter("CONSTRUCTIONID", obj.getConstructionId());
    	query.setParameter("sysUserId", obj.getSysUserId());
    	query.setParameter("approveDescription", obj.getApproveDescription());
    	query.executeUpdate();
    }
  	public void updateListConstructionDTO(ConstructionDTO obj) throws ParseException{
  		StringBuilder sql=new StringBuilder("update construction_task set status=2,COMPLETE_PERCENT = 0 where construction_task_id in("
  				+ "select task.construction_task_id constructionTaskID from construction_task task,detail_month_plan dmp where " + 
  				"task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1 " + 
  				"and task.type=2 and task.level_id = 4 " + 
  				"and task.construction_id =:constructionId " + 
  				"and task.sys_group_id =:sysGroupId " 
  				+ "and task.month = to_char(:dateComplete,'MM') "+ 
  				"and task.year= to_char(:dateComplete,'yyyy')"
  				+" )");
  		DateFormat dateFormatMonth = new SimpleDateFormat("dd/MM/yyyy");
  		Date dateMonth=dateFormatMonth.parse(obj.getDateComplete());
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.setParameter("constructionId", obj.getConstructionId());
  		query.setParameter("sysGroupId", obj.getSysGroupId());
  		query.setParameter("dateComplete", dateMonth);  		
  		query.executeUpdate();
  		
  	}
    //tanqn end 20181102

    //VietNT_20181201_start
    public List<ConstructionDTO> findConstructionByCodes() {
        StringBuilder sql = new StringBuilder("SELECT CODE code " +
        		"FROM CONSTRUCTION " +
                "WHERE CODE IN " +
                "(SELECT CONSTRUCTIONCODE FROM RP_HSHC WHERE COMPLETESTATE = 1)");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("code", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));

        return query.list();
    }
//hoanm1_20181218_start
    public void updateConstructionHSHC(ConstructionDTO dto) {
        StringBuilder sql = new StringBuilder(
                "UPDATE CONSTRUCTION SET " +
                        "COMPLETE_APPROVED_UPDATE_DATE = :updateDate," +
                        "COMPLETE_APPROVED_USER_ID = :updateUserId," +
                        "APPROVE_COMPLETE_DESCRIPTION = :approveCompleteDescription "
                        + ",DATE_COMPLETE_TC = :dateCompleteTC,RECEIVE_RECORDS_DATE=sysdate "
        );

        boolean approve;
        if (dto.getCompleteApprovedState() != null && dto.getCompleteApprovedState() == 2) {
        	approve = true;
        } else {
        	approve = false;
        }

        if (approve) {
            sql.append(
                    ", " +
                    "APPROVE_COMPLETE_VALUE = :completeValue," +
                    "APPROVE_COMPLETE_STATE = :completeState ");
        }
        sql.append("WHERE CODE = :code");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("code", dto.getCode());
        query.setParameter("updateDate", dto.getCompleteApprovedUpdateDate());
        query.setParameter("updateUserId", dto.getCompleteApprovedUserId());
        query.setParameter("approveCompleteDescription", dto.getApproveCompleteDescription());
        query.setParameter("dateCompleteTC", dto.getDateCompleteTC());
//        hoanm1_20181218_end
        if (approve) {
            query.setParameter("completeValue", dto.getCompleteApprovedValue());
            query.setParameter("completeState", dto.getCompleteApprovedState());
        }

        query.executeUpdate();
    }
    //VietNT_end
    //VietNT_20181207_start

    /**
     * Get construction list query by construction_code, filter by cat_station_id or sys_group_id if exist
     * Get all result with construction_code, cat_station_code, cat_station_house_code != null
     * @param obj   field keySearch, catStationId & sysGroupId
     * @return List ConstructionDTO
     */
    public List<ConstructionDetailDTO> getConstructionByStationId(ConstructionDTO obj) {
//        StringBuilder sql = new StringBuilder("SELECT " +
//                "t.construction_id constructionId, t.code code, t.name name " +
//                "FROM CONSTRUCTION t " +
//                "left join assign_handover a on t.code = a.construction_code " +
//                "WHERE 1=1 " +
//                "AND a.construction_code is null " +
//                "");
        StringBuilder sql = new StringBuilder("SELECT " +
                "ct.construction_id constructionId, " +
                "ct.code code, " +
                "ct.name name, " +
                "pr.cat_province_id catProvinceId, " +
                "pr.code catProvinceCode, " +
                "ch.code catStationHouseCode, " +
                "ch.cat_station_house_id catStationHouseId, " +
                "cs.cat_station_id catStationId, " +
                "cs.code catStationCode " +
                "FROM " +
                "construction ct " +
                "left join assign_handover a on ct.code = a.construction_code and a.status = 1 " +
                "LEFT JOIN cat_station cs ON cs.cat_station_id = ct.cat_station_id " +
                "LEFT JOIN cat_station_house ch ON ch.cat_station_house_id = cs.cat_station_house_id " +
                "LEFT JOIN cat_province pr ON pr.cat_province_id = cs.cat_province_id " +
                "WHERE 1=1 " +
                "AND a.construction_code is null " +
                "AND cs.code IS NOT NULL " +
                "AND ct.code IS NOT NULL " +
                "AND ch.code IS NOT NULL " +
                "AND pr.code IS NOT NULL ");

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append("AND" +
                    "(upper(ct.code) like upper(:keySearch) escape '&') ");
        }
        if (null != obj.getCatStationId()) {
            sql.append("AND ct.cat_station_id = :catStationId ");
        }
//        sql.append(" ORDER BY t.code");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("catStationHouseId", new LongType());
        query.addScalar("catStationHouseCode", new StringType());
        query.addScalar("catStationId", new LongType());
        query.addScalar("catStationCode", new StringType());

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        if (null != obj.getCatStationId()) {
            query.setParameter("catStationId", obj.getCatStationId());
            queryCount.setParameter("catStationId", obj.getCatStationId());
        }
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }
    //VietNT_end

//	hungth_20181207_start
	public void updateConstructionDto1(ConstructionDTO obj) {
		StringBuilder sql = new StringBuilder(" UPDATE CONSTRUCTION "
				+ "	set COMPLETE_APPROVED_UPDATE_DATE=SYSDATE, "
				+ " APPROVE_COMPLETE_DESCRIPTION=:approveDescription,"
//				hoanm1_20181219_start
				+ "	COMPLETE_APPROVED_USER_ID=:sysUserId,APPROVE_COMPLETE_STATE = 3 "
//				hoanm1_20181219_end
				+ " where CONSTRUCTION_ID =:consId");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("consId", obj.getConstructionId());
		query.setParameter("sysUserId", obj.getSysUserId());
		query.setParameter("approveDescription", obj.getApproveDescription());
		query.executeUpdate();
	}
  	
  	public void updateRPHSHC(ConstructionDTO obj) {
	StringBuilder sql = new StringBuilder("UPDATE RP_HSHC "
			+ " set COMPLETEVALUE=0,"
			+ " COMPLETESTATE=3,"
			+ " COMPLETE_UPDATE_DATE=SYSDATE,"
			+ " APPROVE_COMPLETE_DESCRIPTION=:approveDescription,"
			+ " COMPLETE_USER_UPDATE=:sysUserId "
			+ " where CONSTRUCTIONID in(:listContractionId) ");
	SQLQuery query= getSession().createSQLQuery(sql.toString());
//	query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));
	query.setParameter("sysUserId", obj.getSysUserId());
	query.setParameter("approveDescription", obj.getApproveDescription());
	query.setParameterList("listContractionId", obj.getListContractionId());
	query.executeUpdate();
}
  	
  	public void updateListConstruction(ConstructionDTO obj) {
		StringBuilder sql = new StringBuilder(" UPDATE CONSTRUCTION "
				+ "	set COMPLETE_APPROVED_UPDATE_DATE=SYSDATE, "
				+ " APPROVE_COMPLETE_DESCRIPTION=:approveDescription,"
//				hoanm1_20181219_start
				+ "	COMPLETE_APPROVED_USER_ID=:sysUserId,APPROVE_COMPLETE_STATE = 3  "
//				hoanm1_20181219_end
				+ " where CONSTRUCTION_ID in(:listContractionId) ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("sysUserId", obj.getSysUserId());
		query.setParameter("approveDescription", obj.getApproveDescription());
		query.setParameterList("listContractionId", obj.getListContractionId());
		query.executeUpdate();
	}
//	hungth_20181207_end
  	
  	/**hoangnh 251218 start**/
  	public String updateHandoverFull(AssignHandoverDTO request) {
        StringBuilder sql = new StringBuilder("UPDATE ASSIGN_HANDOVER AH SET "
        		+ "AH.NUMBER_CO =:numberCo,"
        		+ "AH.STATION_TYPE =:stationType");
        		if(request.getHouseTypeId() > 0){
        			sql.append(",AH.HOUSE_TYPE_ID =:houseTypeId ");
        		}
        		if(request.getHouseTypeName() != null){
        			sql.append(",AH.HOUSE_TYPE_NAME =:houseTypeName ");
        		}
        		if(request.getGroundingTypeId() > 0){
        			sql.append(",AH.GROUNDING_TYPE_ID =:groundingTypeId ");
        		}
        		if(request.getGroundingTypeName() != null){
        			sql.append(",AH.GROUNDING_TYPE_NAME =:groundingTypeName ");
        		}
        		if(StringUtils.isNotBlank(request.getHaveWorkItemName())){
        			sql.append(",AH.HAVE_WORK_ITEM_NAME=:haveWorkItemName ");
        		}
        		if(StringUtils.isNotBlank(request.getIsFenceStr())){
        			sql.append(",AH.IS_FENCE=:isFence ");
        		}
        		/**Chỉ chọn vướng**/
        		if("1".equals(request.getIsReceivedObstructStr()) && "0".equals(request.getIsReceivedGoodsStr())){
        			sql.append(",AH.RECEIVED_OBSTRUCT_CONTENT =:receivedObstructContent "
        					+ ",AH.RECEIVED_OBSTRUCT_DATE = SYSDATE "
        					+ ",AH.RECEIVED_STATUS=3 ");
        		}
        		/**Chỉ chọn có vật tư may đo**/
        		if("0".equals(request.getIsReceivedObstructStr()) && "1".equals(request.getIsReceivedGoodsStr())){
        			sql.append(",AH.RECEIVED_GOODS_CONTENT =:receivedGoodsContent "
			        		+ ",AH.RECEIVED_GOODS_DATE = SYSDATE "
			        		+ ",AH.RECEIVED_STATUS=5 ");
        		}
        		/**Chọn cả vướng + vật tư may đo**/
        		if("1".equals(request.getIsReceivedObstructStr()) && "1".equals(request.getIsReceivedGoodsStr())){
        			sql.append(",AH.RECEIVED_OBSTRUCT_CONTENT =:receivedObstructContent "
			        		+ ",AH.RECEIVED_OBSTRUCT_DATE = SYSDATE "
			        		+ ",AH.RECEIVED_GOODS_CONTENT =:receivedGoodsContent "
			        		+ ",AH.RECEIVED_GOODS_DATE = SYSDATE "
			        		+ ",AH.RECEIVED_STATUS=4 ");
        		}
        		/**Không chọn vướng + vật tư may đo**/
        		if("0".equals(request.getIsReceivedObstructStr()) && "0".equals(request.getIsReceivedGoodsStr())){
        			sql.append(",AH.RECEIVED_DATE = SYSDATE "
        					+ ", AH.RECEIVED_STATUS=2 ");
        		}
        		sql.append(",AH.COLUMN_HEIGHT =:columnHeight ");
        		sql.append(" WHERE AH.ASSIGN_HANDOVER_ID =:assignHandoverId");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("assignHandoverId", request.getAssignHandoverId());
        query.setParameter("numberCo", request.getNumberCo());
        query.setParameter("stationType", request.getStationType());
        query.setParameter("columnHeight", request.getColumnHeight());
        if(request.getHouseTypeId() > 0){
        	query.setParameter("houseTypeId", request.getHouseTypeId());
		}
		if(request.getHouseTypeName() != null){
			query.setParameter("houseTypeName", request.getHouseTypeName());
		}
		if(request.getGroundingTypeId() > 0){
			query.setParameter("groundingTypeId", request.getGroundingTypeId());
		}
		if(request.getGroundingTypeName() != null){
			query.setParameter("groundingTypeName", request.getGroundingTypeName());
		}
		if(StringUtils.isNotBlank(request.getHaveWorkItemName())){
			query.setParameter("haveWorkItemName", request.getHaveWorkItemName());
		}
		if(StringUtils.isNotBlank(request.getIsFenceStr())){
			query.setParameter("isFence", request.getIsFenceStr());
		}
		if("1".equals(request.getIsReceivedObstructStr()) && "0".equals(request.getIsReceivedGoodsStr())){
			query.setParameter("receivedObstructContent", request.getReceivedObstructContent());
		}
		if("0".equals(request.getIsReceivedObstructStr()) && "1".equals(request.getIsReceivedGoodsStr())){
			query.setParameter("receivedGoodsContent", request.getReceivedGoodsContent());
		}
		if("1".equals(request.getIsReceivedObstructStr()) && "1".equals(request.getIsReceivedGoodsStr())){
			query.setParameter("receivedObstructContent", request.getReceivedObstructContent());
	        query.setParameter("receivedGoodsContent", request.getReceivedGoodsContent());
		}
         int result = query.executeUpdate();
         return result !=0 ? "Succes" : "Fail";
    }
  	
  	public String updateHandoverGroundTH1(AssignHandoverDTO request) {
        StringBuilder sql = new StringBuilder("UPDATE ASSIGN_HANDOVER AH SET "
        		+ "AH.RECEIVED_OBSTRUCT_CONTENT =:receivedObstructContent,"
        		+ "AH.RECEIVED_OBSTRUCT_DATE = SYSDATE,"
        		+ "AH.RECEIVED_STATUS=3 "
        		+ "WHERE AH.ASSIGN_HANDOVER_ID =:assignHandoverId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("receivedObstructContent", request.getReceivedObstructContent());
        query.setParameter("assignHandoverId", request.getAssignHandoverId());

         int result = query.executeUpdate();
         return result !=0 ? "Succes" : "Fail";
    }
  	
  	public String updateHandoverGroundTH2(AssignHandoverDTO request) {
        StringBuilder sql = new StringBuilder("UPDATE ASSIGN_HANDOVER AH SET "
        		+ "AH.RECEIVED_GOODS_CONTENT =:receivedGoodsContent,"
        		+ "AH.RECEIVED_GOODS_DATE = SYSDATE,"
        		+ "AH.RECEIVED_STATUS=5 "
        		+ "WHERE AH.ASSIGN_HANDOVER_ID =:assignHandoverId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("receivedGoodsContent", request.getReceivedGoodsContent());
        query.setParameter("assignHandoverId", request.getAssignHandoverId());

        int result = query.executeUpdate();
        return result !=0 ? "Succes" : "Fail";
    }
  	
  	public String updateHandoverGroundTH3(AssignHandoverDTO request) {
        StringBuilder sql = new StringBuilder("UPDATE ASSIGN_HANDOVER AH SET "
        		+ "AH.RECEIVED_OBSTRUCT_CONTENT =:receivedObstructContent,"
        		+ "AH.RECEIVED_OBSTRUCT_DATE = SYSDATE,"
        		+ "AH.RECEIVED_GOODS_CONTENT =:receivedGoodsContent,"
        		+ "AH.RECEIVED_GOODS_DATE = SYSDATE,"
        		+ "AH.RECEIVED_STATUS=4 "
        		+ "WHERE AH.ASSIGN_HANDOVER_ID =:assignHandoverId");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        
        query.setParameter("receivedObstructContent", request.getReceivedObstructContent());
        query.setParameter("receivedGoodsContent", request.getReceivedGoodsContent());
        query.setParameter("assignHandoverId", request.getAssignHandoverId());

        int result = query.executeUpdate();
        return result !=0 ? "Succes" : "Fail";
        
    }
  	
  	public String updateHandoverGroundTH4(AssignHandoverDTO request) {
        StringBuilder sql = new StringBuilder("UPDATE ASSIGN_HANDOVER AH SET "
        		+ "AH.RECEIVED_DATE = SYSDATE,"
        		+ "AH.RECEIVED_STATUS=2 "
        		+ "WHERE AH.ASSIGN_HANDOVER_ID =:assignHandoverId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("assignHandoverId", request.getAssignHandoverId());

        int result =  query.executeUpdate();
        return result !=0 ? "Succes" : "Fail";
    }
  	
  	public String updateBuild(AssignHandoverDTO request) {
        StringBuilder sql = new StringBuilder("UPDATE CONSTRUCTION CO SET CO.HANDOVER_DATE_BUILD = SYSDATE "
        		+ "WHERE CO.CONSTRUCTION_ID =:constructionId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", request.getConstructionId());

        int result = query.executeUpdate();
        return result !=0 ? "Succes" : "Fail";
    }
  	
  	public String updateRP(AssignHandoverDTO request, String checkRP) {
        StringBuilder sql = new StringBuilder("UPDATE RP_STATION_COMPLETE RP SET RP.NUMBER_CO =:numberCo "
        		+ ",RP.STATION_TYPE =:stationType "
        		+ ",RP.COLUMN_HEIGHT =:columnHeight ");
        		if(checkRP != null){
        			sql.append(",RP.HANDOVER_DATE_BUILD = SYSDATE");
        		}
        		if(StringUtils.isNotBlank(request.getHouseTypeName())){
        			sql.append(",RP.HOUSE_TYPE_NAME =:houseTypeName ");
        		}
        		sql.append(" WHERE RP.CNT_CONTRACT_ID =:cntContractId ");
        		sql.append("AND RP.CAT_STATION_HOUSE_ID =:catStationHouseId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("numberCo", request.getNumberCo());
        query.setParameter("stationType", request.getStationType());
        query.setParameter("columnHeight", request.getColumnHeight());
        if(StringUtils.isNotBlank(request.getHouseTypeName())){
        	query.setParameter("houseTypeName", request.getHouseTypeName());
        }
        query.setParameter("cntContractId", request.getCntContractId());
        query.setParameter("catStationHouseId", request.getCatStationHouseId());

        int result = query.executeUpdate();
        return result !=0 ? "Succes" : "Fail";
    }
  	
  	public String updateCons(AssignHandoverDTO request) {
        StringBuilder sql = new StringBuilder("UPDATE CONSTRUCTION CS SET CS.IS_OBSTRUCTED = 1,"
        		+ "CS.OBSTRUCTED_STATE = 1,CS.STATUS = 4,"
        		+ "CS.OBSTRUCTED_CONTENT =:receivedObstructContent "
        		+ "WHERE CS.CONSTRUCTION_ID =:constructionId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("receivedObstructContent", request.getReceivedObstructContent());
        query.setParameter("constructionId", request.getConstructionId());

        int result = query.executeUpdate();
        return result !=0 ? "Succes" : "Fail";
    }
  	
  	public SysUserCOMSDTO getListUser(Long sysUserId){
  		StringBuilder str = new StringBuilder("SELECT SG.NAME sysGroupName,"
  				+ "SG.SYS_GROUP_ID sysGroupId,"
  				+ "SU.LOGIN_NAME loginName,"
  				+ "SU.FULL_NAME fullName "
  				+ "FROM SYS_USER SU INNER JOIN SYS_GROUP SG ON SU.SYS_GROUP_ID = SG.SYS_GROUP_ID "
  				+ "AND SU.SYS_USER_ID =:sysUserId ");
  		SQLQuery query = getSession().createSQLQuery(str.toString());
  		query.setParameter("sysUserId", sysUserId);
  		query.addScalar("sysGroupName", new StringType());
  		query.addScalar("sysGroupId", new LongType());
  		query.addScalar("loginName", new StringType());
  		query.addScalar("fullName", new StringType());
  		query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));
  		return (SysUserCOMSDTO) query.uniqueResult();
  	}
  	
  	@SuppressWarnings("unchecked")
	public List<CatWorkItemTypeDTO> getWorkItemByType (String type){
  		StringBuilder sql = new StringBuilder("SELECT CAT_WORK_ITEM_TYPE_ID catWorkItemTypeId,"
  				+ "NAME name,"
  				+ "CODE code,"
  				+ "STATUS status,"
  				+ "DESCRIPTION description,"
  				+ "CAT_CONSTRUCTION_TYPE_ID catConstructionTypeId,"
  				+ "CREATED_DATE createdDate,"
  				+ "UPDATED_DATE updateDate,"
  				+ "CREATED_USER createdUser,"
  				+ "UPDATED_USER updateUser,"
  				+ "ITEM_ORDER itemOrder,"
  				+ "TAB tab,"
  				+ "QUANTITY_BY_DATE quantityByDate,"
  				+ "CAT_WORK_ITEM_GROUP_ID catWorkItemGroupId,"
  				+ "TYPE type "
  				+ "FROM CAT_WORK_ITEM_TYPE WHERE 1=1 AND TYPE=:type AND STATUS=1 ");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.setParameter("type", type);
  		query.addScalar("catWorkItemTypeId", new LongType());
  		query.addScalar("name", new StringType());
  		query.addScalar("code", new StringType());
  		query.addScalar("status", new StringType());
  		query.addScalar("description", new StringType());
  		query.addScalar("catConstructionTypeId", new LongType());
  		query.addScalar("createdDate", new DateType());
  		query.addScalar("updateDate", new DateType());
  		query.addScalar("createdUser", new StringType());
  		query.addScalar("updateUser", new StringType());
  		query.addScalar("itemOrder", new StringType());
  		query.addScalar("tab", new StringType());
  		query.addScalar("quantityByDate", new DateType());
  		query.addScalar("catWorkItemGroupId", new LongType());
  		query.addScalar("type", new StringType());
  		query.setResultTransformer(Transformers.aliasToBean(CatWorkItemTypeDTO.class));
  		return query.list();
  	}
  	
	public AssignHandoverResponse doSearchNotReceived(AssignHandoverRequest req){
  		StringBuilder sql = new StringBuilder("select count(*) totalRecordNotReceived from ASSIGN_HANDOVER where RECEIVED_STATUS=1 "
  				+ "AND CREATE_DATE <= sysdate and CREATE_DATE >= sysdate -365 AND PERFORMENT_ID =:sysUserId ");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		
  		query.addScalar("totalRecordNotReceived", new DoubleType());
  		query.setParameter("sysUserId", req.getSysUserId());
  		query.setResultTransformer(Transformers.aliasToBean(AssignHandoverResponse.class));
  		return (AssignHandoverResponse) query.uniqueResult();
  	}
	
	public AssignHandoverResponse doSearchReceived(AssignHandoverRequest req){
  		StringBuilder sql = new StringBuilder("select count(*) totalRecordReceived from ASSIGN_HANDOVER where RECEIVED_STATUS != 1 "
  				+ "AND CREATE_DATE <= sysdate and CREATE_DATE >= sysdate -365 AND PERFORMENT_ID =:sysUserId ");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		
  		query.addScalar("totalRecordReceived", new DoubleType());
  		query.setParameter("sysUserId", req.getSysUserId());
  		query.setResultTransformer(Transformers.aliasToBean(AssignHandoverResponse.class));
  		return (AssignHandoverResponse) query.uniqueResult();
  	}
  	
  	@SuppressWarnings("unchecked")
	public List<AssignHandoverDTO> doSearchAssign(AssignHandoverRequest req){
  		StringBuilder sql = new StringBuilder("SELECT ASSIGN_HANDOVER_ID assignHandoverId,"
  				+ "SYS_GROUP_ID sysGroupId,"
  				+ "SYS_GROUP_CODE sysGroupCode,"
  				+ "SYS_GROUP_NAME sysGroupName,"
//  				+ "CAT_PROVINCE_ID catProvinceId,"
//  				+ "CAT_PROVINCE_CODE catProvinceCode,"
  				+ "CAT_STATION_HOUSE_ID catStationHouseId,"
//  				+ "CAT_STATTION_HOUSE_CODE catStationHouseCode,"
//  				+ "CAT_STATTION_ID catStattionId,"
//  				+ "CAT_STATTION_CODE catStattionCode,"
  				+ "CONSTRUCTION_ID constructionId,"
  				+ "CONSTRUCTION_CODE constructionCode,"
  				+ "CNT_CONTRACT_ID cntContractId,"
  				+ "CNT_CONTRACT_CODE cntContractCode,"
  				+ "IS_DESIGN isDesign,"
  				+ "COMPANY_ASSIGN_DATE companyAssignDate,"
//  				+ "CREATE_DATE createDate,"
//  				+ "CREATE_USER_ID createdUserId,"
//  				+ "UPDATE_DATE updateDate,"
//  				+ "UPDATE_USER_ID updateUserId,"
  				+ "STATUS status,"
  				+ "PERFORMENT_ID performentId,"
//  				+ "EMAIL email,"
  				+ "DEPARTMENT_ASSIGN_DATE departmentAssignDate,"
  				+ "RECEIVED_STATUS receivedStatus,"
  				+ "OUT_OF_DATE_RECEIVED outOfDateReceived,"
  				+ "OUT_OF_DATE_START_DATE outOfDateStartDate,"
  				+ "RECEIVED_OBSTRUCT_DATE receivedObstructDate,"
  				+ "RECEIVED_OBSTRUCT_CONTENT receivedObstructContent,"
  				+ "RECEIVED_GOODS_DATE receivedGoodsDate,"
  				+ "RECEIVED_GOODS_CONTENT receivedGoodsContent,"
  				+ "RECEIVED_DATE receivedDate,"
  				+ "DELIVERY_CONSTRUCTION_DATE deliveryConstructionDate,"
  				+ "PERFORMENT_CONSTRUCTION_ID performentConstructionId,"
  				+ "PERFORMENT_CONSTRUCTION_NAME performentConstructionName,"
  				+ "SUPERVISOR_CONSTRUCTION_ID supervisorConstructionId,"
  				+ "SUPERVISOR_CONSTRUCTION_NAME supervisorConstructionName,"
  				+ "STARTING_DATE startingDate,"
  				+ "CONSTRUCTION_STATUS constructionStatus,"
  				+ "COLUMN_HEIGHT columnHeight,"
  				+ "STATION_TYPE stationType,"
  				+ "NUMBER_CO numberCo,"
  				+ "HOUSE_TYPE_ID houseTypeId,"
  				+ "HOUSE_TYPE_NAME houseTypeName,"
  				+ "GROUNDING_TYPE_ID groundingTypeId,"
  				+ "GROUNDING_TYPE_NAME groundingTypeName,"
  				+ "HAVE_WORK_ITEM_NAME haveWorkItemName,"
  				+ "IS_FENCE isFence "
  				+ "FROM ASSIGN_HANDOVER WHERE 1=1 AND CREATE_DATE <= sysdate AND CREATE_DATE >= sysdate -365 ");
  		if(req.getAssignHandoverId() != null){
  			sql.append("AND ASSIGN_HANDOVER_ID=:assignHandoverId ");
  		}
  		if(req.getSysUserId() != null){
  			sql.append("AND PERFORMENT_ID =:sysUserId ");
  		}
  		if(StringUtils.isNotEmpty(req.getRowNum())){
  			sql.append(" AND ROWNUM <=:rowNum ");
  		}
  		if(StringUtils.isNotEmpty(req.getKeySearch())) {
            sql.append(" AND (upper(CONSTRUCTION_CODE) LIKE upper(:keySearch) " 
            		+ "OR upper(RECEIVED_OBSTRUCT_DATE) LIKE upper(:keySearch)  "
            		+ "OR upper(RECEIVED_GOODS_DATE) LIKE upper(:keySearch)  "
                    + "OR upper(RECEIVED_DATE) LIKE upper(:keySearch)" + ")");
        }
  		if(req.getStatus() != null && !req.getStatus().equals("0")){
  			sql.append(" AND STATUS =:status ");
  		}
  		sql.append(" ORDER BY DEPARTMENT_ASSIGN_DATE DESC ");
  		
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		
  		query.addScalar("assignHandoverId", new LongType());
  		query.addScalar("sysGroupId", new LongType());
  		query.addScalar("sysGroupCode", new StringType());
  		query.addScalar("sysGroupName", new StringType());
//  		query.addScalar("catProvinceId", new LongType());
//  		query.addScalar("catProvinceCode", new StringType());
  		query.addScalar("catStationHouseId", new LongType());
//  		query.addScalar("catStationHouseCode", new StringType());
//  		query.addScalar("catStattionId", new LongType());
//  		query.addScalar("catStattionCode", new StringType());
  		query.addScalar("constructionId", new LongType());
  		query.addScalar("constructionCode", new StringType());
  		query.addScalar("cntContractId", new LongType());
  		query.addScalar("cntContractCode", new StringType());
  		query.addScalar("isDesign", new LongType());
  		query.addScalar("companyAssignDate", new DateType());
//  		query.addScalar("createDate", new DateType());
//  		query.addScalar("createdUserId", new LongType());
//  		query.addScalar("updateDate", new DateType());
//  		query.addScalar("updateUserId", new LongType());
  		query.addScalar("status", new LongType());
  		query.addScalar("performentId", new LongType());
//  		query.addScalar("email", new StringType());
  		query.addScalar("departmentAssignDate", new DateType());
  		query.addScalar("receivedStatus", new LongType());
  		query.addScalar("outOfDateReceived", new LongType());
  		query.addScalar("outOfDateStartDate", new LongType());
  		query.addScalar("receivedObstructDate", new DateType());
  		query.addScalar("receivedObstructContent", new StringType());
  		query.addScalar("receivedGoodsDate", new DateType());
  		query.addScalar("receivedGoodsContent", new StringType());
  		query.addScalar("receivedDate", new DateType());
  		query.addScalar("deliveryConstructionDate", new DateType());
  		query.addScalar("performentConstructionId", new LongType());
  		query.addScalar("performentConstructionName", new StringType());
  		query.addScalar("supervisorConstructionId", new LongType());
  		query.addScalar("supervisorConstructionName", new StringType());
  		query.addScalar("startingDate", new DateType());
  		query.addScalar("constructionStatus", new LongType());
  		query.addScalar("columnHeight", new LongType());
  		query.addScalar("stationType", new LongType());
  		query.addScalar("numberCo", new LongType());
  		query.addScalar("houseTypeId", new LongType());
  		query.addScalar("houseTypeName", new StringType());
  		query.addScalar("groundingTypeId", new LongType());
  		query.addScalar("groundingTypeName", new StringType());
  		query.addScalar("haveWorkItemName", new StringType());
  		query.addScalar("isFence", new LongType());
  		
  		if(req.getAssignHandoverId() != null){
  			query.setParameter("assignHandoverId", req.getAssignHandoverId());
  		}
  		if(req.getSysUserId() != null){
  			query.setParameter("sysUserId", req.getSysUserId());
  		}
  		if(StringUtils.isNotEmpty(req.getRowNum())){
  			query.setParameter("rowNum", req.getRowNum());
  		}
  		if(req.getStatus() != null && !req.getStatus().equals("0")){
  			query.setParameter("status", req.getStatus());
  		}
  		if(StringUtils.isNotEmpty(req.getKeySearch())) {
  			query.setParameter("keySearch", "%" + req.getKeySearch() + "%");
  		}
  		query.setResultTransformer(Transformers.aliasToBean(AssignHandoverDTO.class));
  		return query.list();
  	}
  	
  	@SuppressWarnings("unchecked")
	public List<WorkItemDTO> getWorkItemByCode(String code){
  		StringBuilder sql = new StringBuilder("SELECT WORK_ITEM_ID workItemId, CODE code FROM WORK_ITEM WHERE 1=1 ");
  		if(code != null){
  			sql.append("AND CODE =:code ");
  		}
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.addScalar("workItemId", new LongType());
  		query.addScalar("code", new StringType());
  		
  		if(code != null){
  			query.setParameter("code", code);
  		}
  		query.setResultTransformer(Transformers.aliasToBean(WorkItemDTO.class));
  		return query.list();
  	}
  	/**hoangnh 251218 end**/
	@SuppressWarnings("unchecked")
	public List<ConstructionImageInfo> getListDocument(Long assignHandoverId){
  		StringBuilder sql = new StringBuilder("SELECT UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId,"
//  				+ "TYPE type,"
//  				+ "CODE code,"
  				+ "NAME imageName,"
  				+ "1 status ,"
  				+ "LATITUDE latitude,"
  				+ "FILE_PATH imagePath  FROM UTIL_ATTACH_DOCUMENT WHERE TYPE='56' AND OBJECT_ID =:assignHandoverId ");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.addScalar("utilAttachDocumentId", new LongType());
//  		query.addScalar("type", new StringType());
//  		query.addScalar("code", new StringType());
  		query.addScalar("imageName", new StringType());
  		query.addScalar("status", new LongType());
  		query.addScalar("imagePath", new StringType());
  		query.addScalar("latitude", new DoubleType());
  		
  		query.setParameter("assignHandoverId", assignHandoverId);
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionImageInfo.class));
  		
  		return query.list();
  	}
  	
  	public void saveImagePathsDBDao(List<ConstructionImageInfo> lstConstructionImages, Long assignHandoverId,AssignHandoverRequest req) {
			if (lstConstructionImages == null) {
				return;
			}
			
			for (ConstructionImageInfo constructionImage : lstConstructionImages) {
			
			UtilAttachDocumentBO utilAttachDocumentBO = new UtilAttachDocumentBO();
			utilAttachDocumentBO.setObjectId(assignHandoverId);
			utilAttachDocumentBO.setName(constructionImage.getImageName());
			utilAttachDocumentBO.setType("56");
			utilAttachDocumentBO.setDescription("file ảnh bàn giao mặt bằng");
			utilAttachDocumentBO.setStatus("1");
			utilAttachDocumentBO.setFilePath(constructionImage.getImagePath());
			utilAttachDocumentBO.setCreatedDate(new Date());
			utilAttachDocumentBO.setCreatedUserId(req.getSysUserId());
			utilAttachDocumentBO.setCreatedUserName(req.getFullName());
			// hoanm1_20180718_start
			if (constructionImage.getLongtitude() != null) {
			utilAttachDocumentBO.setLongtitude(constructionImage.getLongtitude());
			}
			if (constructionImage.getLatitude() != null) {
			utilAttachDocumentBO.setLatitude(constructionImage.getLatitude());
			}
			// hoanm1_20180718_end
			long ret = utilAttachDocumentDAO.saveObject(utilAttachDocumentBO);
			
			}
  		}
  	
  	public String updateIsFence(String isFence, Long assignHandoverId) {
        StringBuilder sql = new StringBuilder("UPDATE ASSIGN_HANDOVER SET IS_FENCE=:isFence WHERE ASSIGN_HANDOVER_ID=:assignHandoverId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("isFence", isFence);
        query.setLong("assignHandoverId", assignHandoverId);

        int result = query.executeUpdate();
        return result !=0 ? "Succes" : "Fail";
    }
  	
  	public String updateHaveName(String haveWorkItemName, Long assignHandoverId) {
        StringBuilder sql = new StringBuilder("UPDATE ASSIGN_HANDOVER SET HAVE_WORK_ITEM_NAME=:haveWorkItemName WHERE ASSIGN_HANDOVER_ID=:assignHandoverId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("haveWorkItemName", haveWorkItemName);
        query.setLong("assignHandoverId", assignHandoverId);

        int result = query.executeUpdate();
        return result !=0 ? "Succes" : "Fail";
    }
  	
  	public String updateHandoverDate(Long id) {
        StringBuilder sql = new StringBuilder("UPDATE CONSTRUCTION SET HANDOVER_DATE_BUILD_TEMP=SYSDATE WHERE CONSTRUCTION_ID=:id");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setLong("id", id);

        int result = query.executeUpdate();
        return result !=0 ? "Succes" : "Fail";
    }
  	
  	@SuppressWarnings("unchecked")
	public List<AppParamDTO> getHouseType(){
  		StringBuilder sql = new StringBuilder("SELECT APP_PARAM_ID appParamId,"
  				+ "CODE code,"
  				+ "NAME name FROM APP_PARAM WHERE PAR_TYPE='HOUSE_TYPE' AND STATUS=1 ");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.addScalar("appParamId", new LongType());
  		query.addScalar("code", new StringType());
  		query.addScalar("name", new StringType());
  		query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));
  		return query.list();
  	}
  	
  	@SuppressWarnings("unchecked")
	public List<AppParamDTO> getGroundingType(){
  		StringBuilder sql = new StringBuilder("SELECT APP_PARAM_ID appParamId,"
  				+ "CODE code,"
  				+ "NAME name FROM APP_PARAM WHERE PAR_TYPE='GROUNDING_TYPE' AND STATUS=1 ");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.addScalar("appParamId", new LongType());
  		query.addScalar("code", new StringType());
  		query.addScalar("name", new StringType());
  		query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));
  		return query.list();
  	}
	public String updateStatusCons(AssignHandoverDTO request) {
        StringBuilder sql = new StringBuilder("UPDATE CONSTRUCTION CS SET CS.STATUS = 4 WHERE CS.CONSTRUCTION_ID =:constructionId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", request.getConstructionId());

        int result = query.executeUpdate();
        return result !=0 ? "Succes" : "Fail";
    }
  	/**hoangnh 251218 end**/
	//  	hoanm1_20181229_start
  	public Map<String, ConstructionDetailDTO> getConstructionCntContract(){
    	try{
    	 StringBuilder sql = new StringBuilder("select distinct cst.code constructionCode,c.code cntContractCode from construction cst,CNT_CONSTR_WORK_ITEM_TASK b,cnt_contract c where "
                 + " cst.construction_id=b.construction_id and b.cnt_contract_id=c.cnt_contract_id and "
                 + " cst.status !=0 and b.status !=0 and c.status !=0 and c.contract_type=0 ");
			SQLQuery query = getSession().createSQLQuery(sql.toString());
			query.setResultTransformer(Transformers
					.aliasToBean(ConstructionDetailDTO.class));
			query.addScalar("cntContractCode", new StringType());
			query.addScalar("constructionCode", new StringType());
			List<ConstructionDetailDTO> constructionContract = query.list();

			Map<String, ConstructionDetailDTO> constructionMap = new HashMap<String, ConstructionDetailDTO>();
			for (ConstructionDetailDTO obj : constructionContract) {
//				hoanm1_20190104_start
//				constructionMap.put(obj.getConstructionCode() + "|" +  obj.getCntContractCode(), obj);
				constructionMap.put(obj.getConstructionCode(), obj);
//				hoanm1_20190104_end
			}
			return constructionMap;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
    }
//  	hoanm1_20181229_end
  	
  	//HuyPQ-start
  	@SuppressWarnings("unchecked")
	public List<ConstructionDetailDTO> doSearchAcceptance(ConstructionDetailDTO obj, List<String> groupIdLst){
  		StringBuilder sql = new StringBuilder("SELECT cs.code catStationCode," + 
  				"  cons.code constructionCode," + 
  				"  cons.APPROVED_ACCEPTANCE approvedAcceptance, " +
  				" (sg.CODE ||'-' || sg.NAME) text,"+
  				"  sg.NAME sysGroupName, " +
  				"  cons.CAT_STATION_ID catStationId, "+
  				"  cons.CONSTRUCTION_ID constructionId, "+
  				"  cons.SYS_GROUP_ID sysGroupId, "+
  				"  cntContract.code cntContractCode, "+
  				"  cons.ACCEPTANCE_DATE acceptanceDate "+
  				"  FROM CONSTRUCTION cons " + 
  				"  LEFT JOIN CTCT_CAT_OWNER.CAT_STATION cs ON cs.CAT_STATION_ID = cons.CAT_STATION_ID " +
  				"  LEFT JOIN cat_province catPro" + 
  				"  ON catPro.CAT_PROVINCE_ID = cs.CAT_PROVINCE_ID "+
  				"  LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ON sg.SYS_GROUP_ID = cons.SYS_GROUP_ID "+
  				"  LEFT JOIN CNT_CONSTR_WORK_ITEM_TASK cntConstrWorkitemTask ON cntConstrWorkitemTask.CONSTRUCTION_ID=cons.CONSTRUCTION_ID " + 
  				"  AND cntConstrWorkitemTask.STATUS=1 "+
  				"  LEFT JOIN CNT_CONTRACT cntContract" + 
  				"  ON cntContract.CNT_CONTRACT_ID=cntConstrWorkitemTask.CNT_CONTRACT_ID" + 
  				"  AND cntContract.CONTRACT_TYPE =0 "+
  				"  WHERE 1=1 "+
  				"  AND cons.APPROVED_ACCEPTANCE in (1,2)");
//  		if(groupIdLst.size()<2) {
  			sql.append("  AND cons.SYS_GROUP_ID in (:groupIdLst)");
//  		}
  		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (UPPER(cs.code) LIKE UPPER(:keySearch) OR UPPER(cons.code) LIKE UPPER(:keySearch) OR UPPER(cntContract.code) LIKE UPPER(:keySearch) escape '&')");
        }
  		if(null!=obj.getSysGroupId()) {
  			sql.append(" AND cons.SYS_GROUP_ID=:sysGroupId");
  		}
  		if(null!=obj.getCatProvinceId()) {
  			sql.append(" AND catPro.CAT_PROVINCE_ID=:catProvinceId");
  		}
  		if(null!=obj.getApprovedAcceptanceLst()) {
  			sql.append(" AND cons.APPROVED_ACCEPTANCE in (:approvedAcceptanceLst)");
  		}
  		if(null!=obj.getDateFrom()) {
  			sql.append(" AND cons.ACCEPTANCE_DATE >= :dateFrom");
  		}
  		if(null!=obj.getDateTo()) {
  			sql.append("AND cons.ACCEPTANCE_DATE <= :dateTo");
  		}
  		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        
        query.addScalar("catStationId", new LongType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("sysGroupId", new StringType());
  		query.addScalar("catStationCode", new StringType());
  		query.addScalar("constructionCode", new StringType());
  		query.addScalar("approvedAcceptance", new StringType());
  		query.addScalar("sysGroupName", new StringType());
  		query.addScalar("cntContractCode", new StringType());
  		query.addScalar("acceptanceDate", new DateType());
  		query.addScalar("text", new StringType());
  		
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
  		
//  		if(groupIdLst.size()<2) {
  			query.setParameterList("groupIdLst", groupIdLst);
  			queryCount.setParameterList("groupIdLst", groupIdLst);
//  		}
  		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
  		if(null!=obj.getSysGroupId()) {
  			query.setParameter("sysGroupId", obj.getSysGroupId());
  			queryCount.setParameter("sysGroupId", obj.getSysGroupId());
  		}
  		if(null!=obj.getCatProvinceId()) {
  			query.setParameter("catProvinceId", obj.getCatProvinceId());
  			queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
  		}
  		if(null!=obj.getApprovedAcceptanceLst()) {
  			query.setParameterList("approvedAcceptanceLst", obj.getApprovedAcceptanceLst());
  			queryCount.setParameterList("approvedAcceptanceLst", obj.getApprovedAcceptanceLst());
  		}
  		if(null!=obj.getDateFrom()) {
  			query.setParameter("dateFrom", obj.getDateFrom());
  			queryCount.setParameter("dateFrom", obj.getDateFrom());
  		}
  		if(null!=obj.getDateTo()) {
  			query.setParameter("dateTo", obj.getDateTo());
  			queryCount.setParameter("dateTo", obj.getDateTo());
  		}
  		if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
  		return query.list();
  	}
  	
  	//Lấy data vật tư a cấp
  	public List<ConstructionDetailDTO> getDataVTA(ConstructionDetailDTO obj){
  		StringBuilder sql = new StringBuilder("with acceptance as(SELECT synDetail.GOODS_ID goodsId,\r\n" + 
  				"  synDetail.GOODS_CODE maVttb ,\r\n" + 
  				"  synDetail.GOODS_NAME tenVttb,\r\n" + 
  				"  synDetail.GOODS_UNIT_NAME donViTinh,\r\n" + 
  				"  NVL(synDetail.GOODS_IS_SERIAL,0) goodsIsSerial,\r\n" + 
  				"  NVL(SUM(\r\n" + 
  				"  (SELECT SUM(serial.amount)\r\n" + 
  				"  FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial\r\n" + 
  				"  WHERE serial.SYN_STOCK_TRANS_DETAIL_SER_ID = synDetailSerial.SYN_STOCK_TRANS_DETAIL_SER_ID\r\n" + 
  				"  AND syn.TYPE                               =2\r\n" + 
  				"  AND syn.CONFIRM                            =1\r\n" + 
  				"  AND syn.BUSSINESS_TYPE                     = 1\r\n" + 
  				"  )),0) slXuat,\r\n" + 
  				"  NVL(MAX(\r\n" + 
  				"  (SELECT DISTINCT SUM(conMer.quantity)\r\n" + 
  				"  FROM CONSTRUCTION_MERCHANDISE conMer\r\n" + 
  				"  WHERE conMer.GOODS_ID      = synDetailSerial.GOODS_ID\r\n" + 
  				"  AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID\r\n" + 
  				"  AND conMer.TYPE            = 1\r\n" + 
  				"  AND conMer.GOODS_IS_SERIAL = NVL(synDetail.GOODS_IS_SERIAL,0)\r\n" + 
  				"  )),0) slNghiemThu,\r\n"
  				+ " NVL(MAX(\r\n" + 
  				"  (SELECT DISTINCT SUM(conMer.quantity)\r\n" + 
  				"  FROM CONSTRUCTION_MERCHANDISE conMer\r\n" + 
  				"  WHERE conMer.GOODS_ID      = synDetailSerial.GOODS_ID\r\n" + 
  				"  AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID\r\n" + 
  				"  AND conMer.GOODS_IS_SERIAL = NVL(synDetail.GOODS_IS_SERIAL,0)\r\n" + 
  				"  )),0) tongSlNghiemThu," + 
  				"  NVL(SUM(\r\n" + 
  				"  (SELECT SUM(serial.amount)\r\n" + 
  				"  FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial\r\n" + 
  				"  WHERE serial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID\r\n" + 
  				"  AND syn.TYPE                           =1\r\n" + 
  				"  AND syn.status                         =2\r\n" + 
  				"  AND syn.BUSSINESS_TYPE                 = 4\r\n" + 
  				"  )),0) slThuHoi\r\n" + 
  				"FROM SYN_STOCK_TRANS syn\r\n" + 
  				"INNER JOIN CONSTRUCTION con\r\n" + 
  				"ON con.code = syn.CONSTRUCTION_CODE\r\n" + 
  				"LEFT JOIN SYN_STOCK_TRANS_DETAIL synDetail\r\n" + 
  				"ON syn.SYN_STOCK_TRANS_ID = synDetail.SYN_STOCK_TRANS_ID\r\n" + 
  				"  AND nvl(synDetail.GOODS_IS_SERIAL,0) = 0\r\n" + 
  				"LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL synDetailSerial\r\n" + 
  				"ON synDetailSerial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID\r\n" + 
  				"WHERE syn.SYN_TRANS_TYPE                     =1\r\n" + 
  				"AND con.CONSTRUCTION_ID                      =:constructionId\r\n"
  				+ " and synDetail.GOODS_ID is not null " + 
  				"GROUP BY synDetail.GOODS_ID ,\r\n" + 
  				"  synDetail.GOODS_CODE ,\r\n" + 
  				"  synDetail.GOODS_NAME ,\r\n" + 
  				"  synDetail.GOODS_UNIT_NAME ,\r\n" + 
  				"  NVL(synDetail.GOODS_IS_SERIAL,0))\r\n" + 
  				"select acceptance.goodsId,acceptance.maVttb,\r\n" + 
  				"      acceptance.tenVttb,\r\n" + 
  				"      acceptance.donViTinh,\r\n" + 
  				"      nvl(acceptance.slXuat,0) slXuat,\r\n" + 
  				"      nvl(acceptance.slNghiemThu,0) slNghiemThu,\r\n" + 
  				"      nvl(acceptance.tongSlNghiemThu,0) tongSlNghiemThu,\r\n" + 
  				"      nvl(acceptance.slThuHoi,0) slThuHoi,\r\n" + 
  				"      (nvl(acceptance.slXuat,0) - nvl(acceptance.slnghiemthu,0) - nvl(acceptance.slThuHoi,0)) slConLai\r\n" + 
  				"from acceptance acceptance");
  		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
  		
  		query.addScalar("goodsId", new LongType());
  		query.addScalar("maVttb", new StringType());
  		query.addScalar("tenVttb", new StringType());
  		query.addScalar("donViTinh", new StringType());
  		query.addScalar("slXuat", new DoubleType());
  		query.addScalar("slNghiemThu", new DoubleType());
  		query.addScalar("slThuHoi", new DoubleType());
  		query.addScalar("slConLai", new DoubleType());
  		query.addScalar("tongSlNghiemThu", new DoubleType());
  		
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
//  		query.setParameter("constructionCode", obj.getConstructionCode());
  		query.setParameter("constructionId", obj.getConstructionId());
//  		queryCount.setParameter("constructionCode", obj.getConstructionCode());
  		queryCount.setParameter("constructionId", obj.getConstructionId());
  		
  		if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
  		return query.list();
  	}
  	
  	//Lấy data thiết bị A cấp
  	public List<ConstructionDetailDTO> getDataTBA(ConstructionDetailDTO obj){
  		StringBuilder sql = new StringBuilder("SELECT sst.SYN_STOCK_TRANS_ID synStockTransId,"
  				+ "sstd.SYN_STOCK_TRANS_DETAIL_ID synStockTransDetailId,sstd.GOODS_ID goodsId," + 
  				" sstd.GOODS_CODE maVttb,sstds.MER_ENTITY_ID merEntityId, " + 
  				" sstd.GOODS_NAME tenVttb, " + 
  				" sstd.GOODS_UNIT_NAME donViTinh, " + 
  				" sstds.SERIAL serial " + 
  				" FROM SYN_STOCK_TRANS sst " + 
  				" LEFT JOIN SYN_STOCK_TRANS_DETAIL sstd on sst.SYN_STOCK_TRANS_ID = sstd.SYN_STOCK_TRANS_ID " + 
  				" LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL sstds  ON sstds.SYN_STOCK_TRANS_DETAIL_ID = sstd.SYN_STOCK_TRANS_DETAIL_ID " + 
  				" where sst.CONSTRUCTION_CODE=:constructionCode " + 
  				" and sst.BUSSINESS_TYPE=1 " + 
  				" and sst.TYPE=2 " + 
  				" and sst.CONFIRM=1 " + 
  				" and sstd.GOODS_IS_SERIAL=1");
  		
  		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
  		query.addScalar("synStockTransId", new LongType());
  		query.addScalar("synStockTransDetailId", new LongType());
  		query.addScalar("maVttb", new StringType());
  		query.addScalar("tenVttb", new StringType());
  		query.addScalar("donViTinh", new StringType());
  		query.addScalar("serial", new StringType());
  		query.addScalar("goodsId", new LongType());
  		query.addScalar("merEntityId", new LongType());
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
  		query.setParameter("constructionCode", obj.getConstructionCode());
  		queryCount.setParameter("constructionCode", obj.getConstructionCode());
  		
  		if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        
  		return query.list();
  	}
  	
  //Lấy data vật tư B cấp
  	public List<ConstructionDetailDTO> getDataVTB(ConstructionDetailDTO obj){
  		StringBuilder sql = new StringBuilder("with acceptance as(SELECT\r\n" + 
  				"        synDetail.GOODS_ID goodsId,\r\n" + 
  				"        synDetail.GOODS_CODE maVttb ,\r\n" + 
  				"        synDetail.GOODS_NAME tenVttb,\r\n" + 
  				"        synDetail.GOODS_UNIT_NAME donViTinh,\r\n" + 
  				"        NVL(synDetail.GOODS_IS_SERIAL,\r\n" + 
  				"        0) goodsIsSerial,\r\n" + 
  				"        NVL(SUM((SELECT\r\n" + 
  				"            SUM(synDetail.amount_real)    \r\n" + 
  				"        FROM\r\n" + 
  				"            STOCK_TRANS_DETAIL_SERIAL serial    \r\n" + 
  				"        WHERE\r\n" + 
  				"            syn.TYPE                               =2    \r\n" + 
  				"            AND syn.CONFIRM                            =1    \r\n" + 
  				"            AND syn.BUSINESS_TYPE                     =2    )),\r\n" + 
  				"        0) slXuat,\r\n" + 
  				"        \r\n" + 
  				"        NVL(MAX((SELECT\r\n" + 
  				"            DISTINCT SUM(conMer.quantity)    \r\n" + 
  				"        FROM\r\n" + 
  				"            CONSTRUCTION_MERCHANDISE conMer    \r\n" + 
  				"        WHERE\r\n" + 
  				"            conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID    \r\n" + 
  				"            AND conMer.TYPE            = 2    \r\n" + 
  				"            AND conMer.GOODS_IS_SERIAL = NVL(synDetail.GOODS_IS_SERIAL,0)    )),\r\n" + 
  				"        0) slNghiemThu,\r\n" + 
  				"        \r\n" + 
  				"        NVL(MAX((SELECT\r\n" + 
  				"            DISTINCT SUM(conMer.quantity)    \r\n" + 
  				"        FROM\r\n" + 
  				"            CONSTRUCTION_MERCHANDISE conMer    \r\n" + 
  				"        WHERE\r\n" + 
  				"            conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID\r\n" + 
  				"            AND conMer.TYPE            = 2\r\n" + 
  				"            AND conMer.GOODS_IS_SERIAL = NVL(synDetail.GOODS_IS_SERIAL,0)    )),\r\n" + 
  				"        0) tongSlNghiemThu,\r\n" + 
  				"        \r\n" + 
  				"        NVL(SUM((SELECT\r\n" + 
  				"            SUM(synDetail.amount_real)    \r\n" + 
  				"        FROM\r\n" + 
  				"            STOCK_TRANS_DETAIL_SERIAL serial    \r\n" + 
  				"        WHERE\r\n" + 
  				"            serial.STOCK_TRANS_DETAIL_ID = synDetail.STOCK_TRANS_DETAIL_ID    \r\n" + 
  				"            AND syn.TYPE                           =1    \r\n" + 
  				"            AND syn.status                         =2    \r\n" + 
  				"            AND syn.BUSINESS_TYPE                 = 4    )),\r\n" + 
  				"        0) slThuHoi\r\n" + 
  				"        \r\n" + 
  				"    FROM\r\n" + 
  				"        STOCK_TRANS syn  \r\n" + 
  				"    INNER JOIN\r\n" + 
  				"        CONSTRUCTION con  \r\n" + 
  				"            ON con.code = syn.CONSTRUCTION_CODE  \r\n" + 
  				"    LEFT JOIN\r\n" + 
  				"        STOCK_TRANS_DETAIL synDetail  \r\n" + 
  				"            ON syn.STOCK_TRANS_ID = synDetail.STOCK_TRANS_ID  \r\n" + 
  				"            AND nvl(synDetail.GOODS_IS_SERIAL,\r\n" + 
  				"        0) = 0  \r\n" + 
  				"    LEFT JOIN\r\n" + 
  				"        STOCK_TRANS_DETAIL_SERIAL synDetailSerial  \r\n" + 
  				"            ON synDetailSerial.STOCK_TRANS_DETAIL_ID = synDetail.STOCK_TRANS_DETAIL_ID  \r\n" + 
  				"    WHERE\r\n" + 
  				"        con.CONSTRUCTION_ID                      =:constructionId   \r\n" + 
  				"        and synDetail.GOODS_ID is not null \r\n" + 
  				"    GROUP BY\r\n" + 
  				"        synDetail.GOODS_ID ,\r\n" + 
  				"        synDetail.GOODS_CODE ,\r\n" + 
  				"        synDetail.GOODS_NAME ,\r\n" + 
  				"        synDetail.GOODS_UNIT_NAME ,\r\n" + 
  				"        NVL(synDetail.GOODS_IS_SERIAL,\r\n" + 
  				"        0))  select\r\n" + 
  				"            acceptance.goodsId,\r\n" + 
  				"            acceptance.maVttb,\r\n" + 
  				"            acceptance.tenVttb,\r\n" + 
  				"            acceptance.donViTinh,\r\n" + 
  				"            nvl(acceptance.slXuat,\r\n" + 
  				"            0) slXuat,\r\n" + 
  				"            nvl(acceptance.slNghiemThu,\r\n" + 
  				"            0) slNghiemThu,\r\n" + 
  				"            nvl(acceptance.tongSlNghiemThu,\r\n" + 
  				"            0) tongSlNghiemThu,\r\n" + 
  				"            nvl(acceptance.slThuHoi,\r\n" + 
  				"            0) slThuHoi,\r\n" + 
  				"            (nvl(acceptance.slXuat,\r\n" + 
  				"            0) - nvl(acceptance.slnghiemthu,\r\n" + 
  				"            0) - nvl(acceptance.slThuHoi,\r\n" + 
  				"            0)) slConLai  \r\n" + 
  				"        from\r\n" + 
  				"            acceptance acceptance");
  		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
  		
  		query.addScalar("goodsId", new LongType());
  		query.addScalar("maVttb", new StringType());
  		query.addScalar("tenVttb", new StringType());
  		query.addScalar("donViTinh", new StringType());
  		query.addScalar("slXuat", new DoubleType());
  		query.addScalar("slNghiemThu", new DoubleType());
  		query.addScalar("slThuHoi", new DoubleType());
  		query.addScalar("slConLai", new DoubleType());
  		query.addScalar("tongSlNghiemThu", new DoubleType());
  		
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
//  		query.setParameter("constructionCode", obj.getConstructionCode());
  		query.setParameter("constructionId", obj.getConstructionId());
//  		queryCount.setParameter("constructionCode", obj.getConstructionCode());
  		queryCount.setParameter("constructionId", obj.getConstructionId());
  		
  		if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
  		return query.list();
  	}
  	
  //Lấy data thiết bị B cấp
  	public List<ConstructionDetailDTO> getDataTBB(ConstructionDetailDTO obj){
  		StringBuilder sql = new StringBuilder("SELECT std.GOODS_ID goodsId,std.GOODS_CODE maVttb,\r\n" + 
  				"std.GOODS_NAME tenVttb,\r\n" + 
  				"std.GOODS_UNIT_NAME donViTinh,\r\n" + 
  				"stds.SERIAL serial,\r\n" + 
  				"stds.MER_ENTITY_ID merEntityId \r\n" +
  				"FROM CTCT_WMS_OWNER.STOCK_TRANS st\r\n" + 
  				"left join CTCT_WMS_OWNER.STOCK_TRANS_DETAIL std\r\n" + 
  				"on st.STOCK_TRANS_ID = std.STOCK_TRANS_ID\r\n" + 
  				"left join CTCT_WMS_OWNER.STOCK_TRANS_DETAIL_SERIAL stds on stds.STOCK_TRANS_DETAIL_ID = std.STOCK_TRANS_DETAIL_ID\r\n" + 
  				"where st.CONSTRUCTION_CODE=:constructionCode\r\n" + 
  				"and st.BUSINESS_TYPE='2'\r\n" + 
  				"and st.type='2'\r\n" + 
  				"and st.CONFIRM = '1'\r\n" + 
  				"and std.GOODS_IS_SERIAL='1'");
  		
  		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
  		
  		query.addScalar("maVttb", new StringType());
  		query.addScalar("tenVttb", new StringType());
  		query.addScalar("donViTinh", new StringType());
  		query.addScalar("serial", new StringType());
  		query.addScalar("goodsId", new LongType());
  		query.addScalar("merEntityId", new LongType());
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
  		query.setParameter("constructionCode", obj.getConstructionCode());
  		queryCount.setParameter("constructionCode", obj.getConstructionCode());
  		
  		if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        
  		return query.list();
  	}
  	
  	@SuppressWarnings("unchecked")
	public List<ConstructionDetailDTO> getWorkItemByMerchandise(ConstructionDetailDTO obj){
  		StringBuilder sql = new StringBuilder("SELECT cm.CONSTRUCTION_MERCHANDISE_ID constructionMerchandiseId,wi.NAME workItemName,"
  				+ "wi.WORK_ITEM_ID workItemId,cm.QUANTITY merchandiseQuantity,cm.GOODS_NAME goodsName,"
  				+ "cm.GOODS_CODE goodsCode,cm.TYPE merchanType,cm.GOODS_ID goodsId,cm.mer_entity_id merEntityId,cm.GOODS_UNIT_NAME goodsUnitName, "
  				+ "cm.REMAIN_COUNT remainCount, cm.GOODS_IS_SERIAL goodsIsSerial,cm.CONSTRUCTION_ID constructionId,cm.SERIAL serialMerchan "
  				+ " from WORK_ITEM wi " + 
  				" left join CONSTRUCTION_MERCHANDISE cm " + 
  				" on wi.WORK_ITEM_ID = cm.WORK_ITEM_ID " + 
  				" where cm.type=1 and cm.CONSTRUCTION_ID=:constructionId and cm.goods_id=:goodsId");

  		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
  		
  		query.addScalar("workItemName", new StringType());
  		query.addScalar("merchandiseQuantity", new DoubleType());
  		query.addScalar("workItemId", new LongType());
  		query.addScalar("constructionMerchandiseId", new LongType());
  		query.addScalar("goodsName", new StringType());
  		query.addScalar("goodsCode", new StringType());
  		query.addScalar("goodsUnitName", new StringType());
  		query.addScalar("merchanType", new StringType());
  		query.addScalar("goodsId", new LongType());
  		query.addScalar("merEntityId", new LongType());
  		query.addScalar("remainCount", new DoubleType());
  		query.addScalar("goodsIsSerial", new StringType());
  		query.addScalar("constructionId", new LongType());
  		query.addScalar("serialMerchan", new StringType());
  		
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
  		query.setParameter("constructionId", obj.getConstructionId());
  		queryCount.setParameter("constructionId", obj.getConstructionId());
  		query.setParameter("goodsId", obj.getGoodsId());
  		queryCount.setParameter("goodsId", obj.getGoodsId());
  		if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
  		return query.list();
  	}
  	
  	@SuppressWarnings("unchecked")
	public List<ConstructionDetailDTO> getWorkItemByMerchandiseB(ConstructionDetailDTO obj){
  		StringBuilder sql = new StringBuilder("SELECT cm.CONSTRUCTION_MERCHANDISE_ID constructionMerchandiseId,wi.NAME workItemName,"
  				+ "wi.WORK_ITEM_ID workItemId,cm.QUANTITY merchandiseQuantity,cm.GOODS_NAME goodsName,"
  				+ "cm.GOODS_CODE goodsCode,cm.TYPE merchanType,cm.GOODS_ID goodsId,cm.mer_entity_id merEntityId,cm.GOODS_UNIT_NAME goodsUnitName, "
  				+ "cm.REMAIN_COUNT remainCount, cm.GOODS_IS_SERIAL goodsIsSerial,cm.CONSTRUCTION_ID constructionId,cm.SERIAL serialMerchan "
  				+ " from WORK_ITEM wi " + 
  				" left join CONSTRUCTION_MERCHANDISE cm " + 
  				" on wi.WORK_ITEM_ID = cm.WORK_ITEM_ID " + 
  				" where cm.type=2 and cm.CONSTRUCTION_ID=:constructionId and cm.goods_id=:goodsId");

  		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
  		
  		query.addScalar("workItemName", new StringType());
  		query.addScalar("merchandiseQuantity", new DoubleType());
  		query.addScalar("workItemId", new LongType());
  		query.addScalar("constructionMerchandiseId", new LongType());
  		query.addScalar("goodsName", new StringType());
  		query.addScalar("goodsCode", new StringType());
  		query.addScalar("goodsUnitName", new StringType());
  		query.addScalar("merchanType", new StringType());
  		query.addScalar("goodsId", new LongType());
  		query.addScalar("merEntityId", new LongType());
  		query.addScalar("remainCount", new DoubleType());
  		query.addScalar("goodsIsSerial", new StringType());
  		query.addScalar("constructionId", new LongType());
  		query.addScalar("serialMerchan", new StringType());
  		
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
  		query.setParameter("constructionId", obj.getConstructionId());
  		queryCount.setParameter("constructionId", obj.getConstructionId());
  		query.setParameter("goodsId", obj.getGoodsId());
  		queryCount.setParameter("goodsId", obj.getGoodsId());
  		if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
  		return query.list();
  	}
  	
  	public List<ConstructionDetailDTO> getDataNotIn(ConstructionDetailDTO obj,List<Long> listWorkItemId){
  		StringBuilder sql = new StringBuilder("SELECT cons.CONSTRUCTION_ID constructionId,wi.NAME workItemName, "
  				+ " wi.WORK_ITEM_ID workItemId, "
  				+ " cons.CODE constructionCode "
  				+ " FROM WORK_ITEM wi "
  				+ " LEFT JOIN CONSTRUCTION cons on wi.CONSTRUCTION_ID=cons.CONSTRUCTION_ID "
  				+ " WHERE cons.CONSTRUCTION_ID=:constructionId ");
  		if(obj.getListWorkItem().size()!=0) {
  			sql.append(" AND wi.WORK_ITEM_ID NOT IN (:listWorkItem) ");
  		}
  		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (UPPER(cons.CODE) LIKE UPPER(:keySearch) OR UPPER(wi.NAME) LIKE UPPER(:keySearch) escape '&')");
        }
  		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
  		query.addScalar("constructionId", new LongType());
  		query.addScalar("workItemName", new StringType());
  		query.addScalar("constructionCode", new StringType());
  		query.addScalar("workItemId", new LongType());
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
  		
  		query.setParameter("constructionId", obj.getConstructionId());
		queryCount.setParameter("constructionId", obj.getConstructionId());
		
  		if(obj.getListWorkItem().size()!=0) {
  			query.setParameterList("listWorkItem", listWorkItemId);
  			queryCount.setParameterList("listWorkItem", listWorkItemId);
  		}
  		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
  		if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
  	}
  	
  	public Long updateConstructionAcceptance(ConstructionDetailDTO obj, Long sysUserId) {
  		StringBuilder sql = new StringBuilder("UPDATE CONSTRUCTION SET Approved_acceptance='2',"
  				+ "Approved_acceptance_date=sysdate,"
  				+ "Approved_acceptance_user_id=:sysUserId"
  				+ " where construction_id=:constructionId");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.setParameter("sysUserId",sysUserId);
  		query.setParameter("constructionId", obj.getConstructionId());
  		return (long)query.executeUpdate();
  	}
  	
  	public void deleteConstructionMerchanse(ConstructionDetailDTO obj) {
  		StringBuilder sql = new StringBuilder("DELETE FROM CONSTRUCTION_MERCHANDISE WHERE CONSTRUCTION_MERCHANDISE_ID =:lstId");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.setParameter("lstId", obj.getConstructionMerchandiseId());
  		query.executeUpdate();
  	}
  	
  	public List<ConstructionDetailDTO> getSynStockTransBySerial(ConstructionDetailDTO obj){
  		StringBuilder sql = new StringBuilder("select sstds.construction_code constructionCode,sstds.SERIAL serial from SYN_STOCK_TRANS sst\r\n" + 
  				"left join SYN_STOCK_TRANS_DETAIL sstd on sst.SYN_STOCK_TRANS_ID = sstd.SYN_STOCK_TRANS_ID\r\n" + 
  				"left join SYN_STOCK_TRANS_DETAIL_SERIAL sstds on sstd.SYN_STOCK_TRANS_DETAIL_ID = sstds.SYN_STOCK_TRANS_DETAIL_ID\r\n" + 
  				"and sst.SYN_STOCK_TRANS_ID = sstds.SYN_STOCK_TRANS_ID\r\n" + 
  				"where sst.BUSSINESS_TYPE='4' and sst.CONSTRUCTION_CODE=:constructionCode \r\n" + 
  				"and sst.type='1'\r\n" + 
  				"and sstd.GOODS_IS_SERIAL='1'");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.addScalar("serial", new StringType());
  		query.addScalar("constructionCode", new StringType());
  		
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
  		query.setParameter("constructionCode", obj.getConstructionCode());
  		return query.list();
  	}
  	
  	public List<ConstructionDetailDTO> getWorkItemByConsId(ConstructionDetailDTO obj){
  		StringBuilder sql = new StringBuilder("select work_item_id workItemId,"
  				+ " code workItemCode,"
  				+ " name workItemName "
  				+ " from work_item where CONSTRUCTION_ID=:constructionId");
  		
  		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (UPPER(CODE) LIKE UPPER(:keySearch) OR UPPER(NAME) LIKE UPPER(:keySearch) escape '&')");
        }
  		
  		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
  		
  		query.addScalar("workItemId", new LongType());
  		query.addScalar("workItemCode", new StringType());
  		query.addScalar("workItemName", new StringType());
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
  		
  		query.setParameter("constructionId", obj.getConstructionId());
  		queryCount.setParameter("constructionId", obj.getConstructionId());
  		
  		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
  		
  		if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
  	}
  	
  	public List<ConstructionDetailDTO> getConstructionAcceptanceByConsId(ConstructionDetailDTO obj){
  		StringBuilder sql = new StringBuilder("select serial serialMerchan,construction_id constructionId,work_item_id workItemId,CONSTRUCTION_MERCHANDISE_ID constructionMerchandiseId "
  				+ " from construction_merchandise"
  				+ " where construction_id=:constructionId"
  				+ " and type=1 and serial is not null");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.addScalar("serialMerchan", new StringType());
  		query.addScalar("constructionId", new LongType());
  		query.addScalar("workItemId", new LongType());
  		query.addScalar("constructionMerchandiseId", new LongType());
  		
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
  		query.setParameter("constructionId", obj.getConstructionId());
  		return query.list();
  	}
  	
  	public List<ConstructionDetailDTO> getConstructionAcceptanceByConsIdCheck(ConstructionDetailDTO obj){
  		StringBuilder sql = new StringBuilder("select serial serialMerchan,construction_id constructionId,work_item_id workItemId,CONSTRUCTION_MERCHANDISE_ID constructionMerchandiseId "
  				+ " from construction_merchandise"
  				+ " where construction_id=:constructionId"
  				+ " and serial=:serial "
  				+ " and type=1 and serial is not null");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.addScalar("serialMerchan", new StringType());
  		query.addScalar("constructionId", new LongType());
  		query.addScalar("workItemId", new LongType());
  		query.addScalar("constructionMerchandiseId", new LongType());
  		
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
  		query.setParameter("constructionId", obj.getConstructionId());
  		query.setParameter("serial", obj.getSerial());
  		
  		return query.list();
  	}
  	
  	public List<WorkItemDTO> getLstWorkItemById(Long constructionMerchandiseId){
  		StringBuilder sql = new StringBuilder("select wi.work_item_id workItemId,"
  				+ " wi.code code,"
  				+ " wi.name name "
  				+ " from work_item wi "
  				+ " left join construction_merchandise cm on wi.work_item_id = cm.work_item_id "
  				+ " where cm.construction_merchandise_id=:constructionMerchandiseId");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.addScalar("workItemId", new LongType());
  		query.addScalar("code", new StringType());
  		query.addScalar("name", new StringType());
  		query.setResultTransformer(Transformers.aliasToBean(WorkItemDTO.class));
  		query.setParameter("constructionMerchandiseId", constructionMerchandiseId);
  		return query.list();
  	}
  	
  	public List<ConstructionDetailDTO> getConstructionAcceptanceByConsIdTBB(ConstructionDetailDTO obj){
  		StringBuilder sql = new StringBuilder("select serial serialMerchan,construction_id constructionId,work_item_id workItemId,CONSTRUCTION_MERCHANDISE_ID constructionMerchandiseId "
  				+ " from construction_merchandise"
  				+ " where construction_id=:constructionId"
  				+ " and type=2");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.addScalar("serialMerchan", new StringType());
  		query.addScalar("constructionId", new LongType());
  		query.addScalar("workItemId", new LongType());
  		query.addScalar("constructionMerchandiseId", new LongType());
  		
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
  		query.setParameter("constructionId", obj.getConstructionId());
  		return query.list();
  	}
	
	public List<ConstructionDetailDTO> getDataMerByGoodsId(ConstructionDetailDTO obj){
  		StringBuilder sql = new StringBuilder("select work_item_id workItemId,goods_id goodsId "
  				+ " from construction_merchandise"
  				+ " where construction_id =:constructionId"
  				+ " and goods_id =:goodsId"
  				+ " and goods_is_serial = 1"
  				+ " and type = 1 ");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.addScalar("workItemId", new LongType());
  		query.addScalar("goodsId", new LongType());
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
  		query.setParameter("constructionId", obj.getConstructionId());
  		query.setParameter("goodsId", obj.getGoodsId());
  		return query.list();
  	}
  	//HuyPQ-end
  	
  	/**Hoangnh start 14022019**/
  	public void saveImagePathConstructionTaskDaily(List<ConstructionImageInfo> lstConstructionImages,ConstructionTaskDailyDTO req, Long id) {
		if (lstConstructionImages == null || lstConstructionImages.size() == 0) {
			return;
		}
		for (ConstructionImageInfo constructionImage : lstConstructionImages) {
			UtilAttachDocumentBO utilAttachDocumentBO = new UtilAttachDocumentBO();
			utilAttachDocumentBO.setObjectId(id);//
			utilAttachDocumentBO.setName(constructionImage.getImageName());
			utilAttachDocumentBO.setType("44");
			utilAttachDocumentBO.setDescription("file ảnh chi tiết công việc");
			utilAttachDocumentBO.setStatus("1");
			utilAttachDocumentBO.setFilePath(constructionImage.getImagePath());
			utilAttachDocumentBO.setCreatedDate(new Date());
			utilAttachDocumentBO.setCreatedUserId(req.getCreatedUserId());
			SysUserCOMSDTO dto = getFullName(req.getCreatedUserId());
			utilAttachDocumentBO.setCreatedUserName(dto.getFullName());
			if (constructionImage.getLongtitude() != null) {
				utilAttachDocumentBO.setLongtitude(constructionImage.getLongtitude());
			}
			if (constructionImage.getLatitude() != null) {
				utilAttachDocumentBO.setLatitude(constructionImage.getLatitude());
			}
			long ret = utilAttachDocumentDAO.saveObject(utilAttachDocumentBO);
		}
  	}
  	public SysUserCOMSDTO getFullName(Long sysUserId){
  		StringBuilder sql = new StringBuilder("SELECT FULL_NAME fullName FROM SYS_USER WHERE SYS_USER_ID=:sysUserId ");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.addScalar("fullName", new StringType());
  		query.setParameter("sysUserId", sysUserId);
  		query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));
  		return (SysUserCOMSDTO) query.uniqueResult();
  	}
  	
	public ConstructionTaskDailyDTO checkExits(ConstructionTaskDailyDTO req){
  		StringBuilder sql = new StringBuilder("SELECT CONSTRUCTION_TASK_DAILY_ID constructionTaskDailyId,"
  				+ "SYS_GROUP_ID sysGroupId,"
  				+ "AMOUNT amount,"
  				+ "CREATED_DATE createdDate,"
  				+ "CREATED_USER_ID createdUserId,"
  				+ "CREATED_GROUP_ID createdGroupId,"
  				+ "CONFIRM confirm "
  				+ "FROM CONSTRUCTION_TASK_DAILY WHERE CONFIRM=0 AND TRUNC(CREATED_DATE) = TRUNC(SYSDATE) "
  				+ "AND CONSTRUCTION_TASK_ID=:constructionTask ");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.addScalar("constructionTaskDailyId", new LongType());
  		query.addScalar("sysGroupId", new LongType());
  		query.addScalar("createdDate", new DateType());
  		query.addScalar("createdUserId", new LongType());
  		query.addScalar("createdGroupId", new LongType());
  		query.addScalar("amount", new DoubleType());
  		query.addScalar("confirm", new StringType());
  		query.setParameter("constructionTask", req.getConstructionTaskId());
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDailyDTO.class));
  		return (ConstructionTaskDailyDTO) query.uniqueResult();
  	}
	
	@SuppressWarnings("unchecked")
	public List<UtilAttachDocumentDTO> checkDocs(Long objectId, String type){
  		StringBuilder sql = new StringBuilder("select UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId,"
  				+ "OBJECT_ID objectId,"
  				+ "TYPE type from CTCT_CAT_OWNER.UTIL_ATTACH_DOCUMENT "
  				+ "where type=:type and OBJECT_ID =:objectId ");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.addScalar("utilAttachDocumentId", new LongType());
  		query.addScalar("objectId", new LongType());
  		query.addScalar("type", new StringType());
  		query.setLong("objectId", objectId);
  		query.setParameter("type", type);
  		query.setResultTransformer(Transformers.aliasToBean(UtilAttachDocumentDTO.class));
  		return query.list();
  	}
	
	public void removeDocs(Long utilAttachDocumentId){
  		StringBuilder sql = new StringBuilder("DELETE UTIL_ATTACH_DOCUMENT WHERE UTIL_ATTACH_DOCUMENT_ID=:utilAttachDocumentId");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.setParameter("utilAttachDocumentId", utilAttachDocumentId);
  		query.executeUpdate();
  	}
	
	/**hoangnh 251218 end**/
	@SuppressWarnings("unchecked")
	public List<ConstructionImageInfo> imageConstructionTaskDaily(Long constructionTaskDailyId){
  		StringBuilder sql = new StringBuilder("SELECT UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId,"
  				+ "NAME imageName,"
  				+ "STATUS status ,"
  				+ "LATITUDE latitude,"
  				+ "FILE_PATH imagePath  FROM UTIL_ATTACH_DOCUMENT WHERE TYPE='44' AND OBJECT_ID =:constructionTaskDailyId ");
  		SQLQuery query = getSession().createSQLQuery(sql.toString());
  		query.addScalar("utilAttachDocumentId", new LongType());
  		query.addScalar("imageName", new StringType());
  		query.addScalar("status", new LongType());
  		query.addScalar("imagePath", new StringType());
  		query.addScalar("latitude", new DoubleType());
  		
  		query.setParameter("constructionTaskDailyId", constructionTaskDailyId);
  		query.setResultTransformer(Transformers.aliasToBean(ConstructionImageInfo.class));
  		
  		return query.list();
  	}
  	/**Hoangnh end 14022019**/
}
