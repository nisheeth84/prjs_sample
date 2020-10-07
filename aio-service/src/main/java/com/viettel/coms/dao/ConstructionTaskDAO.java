/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.impl.STTabJcImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.datetime.DateFormatter;
import org.springframework.jdbc.object.SqlQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.ConstructionProgressDTO;
import com.viettel.coms.bo.ConstructionTaskBO;
import com.viettel.coms.bo.UtilAttachDocumentBO;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.ConstructionDetailDTO;
import com.viettel.coms.dto.ConstructionTaskAssignmentsGranttDTO;
import com.viettel.coms.dto.ConstructionTaskDTO;
import com.viettel.coms.dto.ConstructionTaskDTOUpdateRequest;
import com.viettel.coms.dto.ConstructionTaskDetailDTO;
import com.viettel.coms.dto.ConstructionTaskGranttDTO;
import com.viettel.coms.dto.ConstructionTaskResourcesGranttDTO;
import com.viettel.coms.dto.ConstructionTaskSlowDTO;
import com.viettel.coms.dto.CountConstructionTaskDTO;
import com.viettel.coms.dto.DepartmentDTO;
import com.viettel.coms.dto.DetailMonthPlanDTO;
import com.viettel.coms.dto.DomainDTO;
import com.viettel.coms.dto.EntangleManageDTO;
import com.viettel.coms.dto.GranttDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.coms.dto.SysUserRequest;
import com.viettel.coms.dto.WorkItemDetailDTO;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.utils.StringUtils;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@EnableTransactionManagement
@Transactional
@Repository("constructionTaskDAO")
public class ConstructionTaskDAO extends BaseFWDAOImpl<ConstructionTaskBO, Long> {

    private static final Long signState = 3L;
    // hungnx 20180705 start
    private double completePercent;
    // hungnx 20180705 end
//	hoanm1_20180820_start
    @Autowired
    private ObstructedDAO obstructedDAO;
    @Autowired
    private EntangleManageDAO entangleManageDAO;
    @Autowired
    private ConstructionDAO constructionDAO;
    //	hoanm1_20180820_end
    @Autowired
    private UtilAttachDocumentDAO utilAttachDocumentDAO;

    public ConstructionTaskDAO() {
        this.model = new ConstructionTaskBO();
    }

    public ConstructionTaskDAO(Session session) {
        this.session = session;
    }

    public List<ConstructionTaskDetailDTO> getConstructionTaskById(Long id, String type) {
        StringBuilder sql = new StringBuilder("SELECT ct.Detail_month_plan_id detailMonthPlanId,"
                + "CAT_STATION.CODE catStationCode," + "ct.CONSTRUCTION_TASK_ID constructionTaskId, "
                + "CONSTRUCTION.CODE constructionCode," + "WORK_ITEM.NAME workItemName," + "sg.NAME performerName,"
                + "ct.TASK_NAME taskName," + "ct.COMPLETE_PERCENT completePercent,"
                + "CONSTRUCTION.IS_OBSTRUCTED isObstructed," + "CAT_CONSTRUCTION_TYPE.NAME constructionType,"
                // + "ct.QUANTITY completeDate," +
                // "ct.COMPLETE completionTime," +
                // "ct.QUANTITY themImplementPercent,"
                // + "ct.COMPLETE completionTime," +
                // "CNT_CONTRACT.CODE cntContract,"
                + "ct.END_DATE endDate, " + "ct.START_DATE startDate " + " FROM CONSTRUCTION_TASK ct");
        sql.append(" LEFT JOIN CONSTRUCTION ON ct.CONSTRUCTION_ID =CONSTRUCTION.CONSTRUCTION_ID  ");
        sql.append(
                " LEFT JOIN CAT_CONSTRUCTION_TYPE ON CONSTRUCTION.CAT_CONSTRUCTION_TYPE_ID =CAT_CONSTRUCTION_TYPE.CAT_CONSTRUCTION_TYPE_ID  ");
        sql.append(" LEFT JOIN CAT_STATION ON CONSTRUCTION.CAT_STATION_ID =CAT_STATION.CAT_STATION_ID  ");
        sql.append(" LEFT JOIN WORK_ITEM ON ct.WORK_ITEM_ID =WORK_ITEM.WORK_ITEM_ID  ");
        // sql.append(" LEFT JOIN CTCT_CAT_OWNER.CNT_CONSTR_WORK_ITEM_TASK ON
        // ct.CONSTRUCTION_ID =CNT_CONSTR_WORK_ITEM_TASK.CONSTRUCTION_ID ");
        // sql.append(" LEFT JOIN CTCT_CAT_OWNER.CNT_CONTRACT ON
        // CNT_CONSTR_WORK_ITEM_TASK.CNT_CONTRACT_ID
        // =CNT_CONTRACT.CNT_CONTRACT_ID ");
        sql.append(" LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ON ct.PERFORMER_ID =sg.SYS_GROUP_ID  ");
        // sql.append(" LEFT JOIN CNT_CONSTR_WORK_ITEM_TASK ON
        // ct.CONSTRUCTION_ID
        // =CNT_CONSTR_WORK_ITEM_TASK.CONSTRUCTION_ID ");
        // sql.append(" LEFT JOIN CNT_CONTRACT ON
        // CNT_CONSTR_WORK_ITEM_TASK.CNT_CONTRACT_ID
        // =CNT_CONTRACT.CNT_CONTRACT_ID ");
        sql.append(" LEFT JOIN SYS_GROUP sg ON ct.PERFORMER_ID =sg.SYS_GROUP_ID  ");
        sql.append(" WHERE ct.Detail_month_plan_id=:id ");
        sql.append(" AND ct.TYPE =:type ");
        sql.append(" ORDER BY CAT_STATION.NAME ASC");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.setParameter("type", type);
        query.addScalar("detailMonthPlanId", new LongType());
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("endDate", new DateType());
        query.addScalar("startDate", new DateType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("constructionType", new StringType());
        query.addScalar("isObstructed", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("completePercent", new DoubleType());
        query.addScalar("taskName", new StringType());
        query.addScalar("workItemName", new StringType());
        // query.addScalar("cntContract", new StringType());
        query.addScalar("performerName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        return query.list();
    }

    public List<ConstructionProgressDTO> getConstructionTaskData() {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT  ");
        sql.append("   CONSTRUCTION_TASK.CONSTRUCTION_TASK_ID AS id,  ");
        sql.append("   CONSTRUCTION_TASK.TASK_NAME AS title,  ");
        sql.append("   CONSTRUCTION_TASK.START_DATE AS startDate,  ");
        sql.append("   CONSTRUCTION_TASK.END_DATE as endDate, ");
        sql.append(
                "   to_date(CONSTRUCTION_TASK.END_DATE,'DD-MM-YY') - to_date(CONSTRUCTION_TASK.START_DATE,'DD-MM-YY') AS thoiGian , ");
        sql.append("   CONSTRUCTION_TASK.COMPLETE_PERCENT  AS percentComplete ");
        sql.append(" FROM  ");
        sql.append("   CONSTRUCTION_TASK  ");
        sql.append("   WHERE  ");
        sql.append(
                "   to_date(CONSTRUCTION_TASK.END_DATE,'DD-MM-YY') - to_date(CONSTRUCTION_TASK.START_DATE,'DD-MM-YY') > 0  ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("id", StringType.INSTANCE);
        query.addScalar("title", StringType.INSTANCE);
        query.addScalar("startDate", DateType.INSTANCE);
        query.addScalar("endDate", DateType.INSTANCE);
        query.addScalar("thoiGian", LongType.INSTANCE);
        query.addScalar("percentComplete", LongType.INSTANCE);
        query.setResultTransformer(Transformers.aliasToBean(ConstructionProgressDTO.class));
        return query.list();
    }

    public void removeByListId(List<String> listConstrTaskIdDelete) {
        StringBuilder sql = new StringBuilder(
                "DELETE FROM CONSTRUCTION_TASK  where CONSTRUCTION_TASK_ID in :listConstrTaskIdDelete");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameterList("listConstrTaskIdDelete", listConstrTaskIdDelete);
        query.executeUpdate();

    }

    // chinhpxn20180710_start
    public void removeConstrTaskDT(List<String> constructionIdLst, Long detailMonthPlanId) {
        StringBuilder sql = new StringBuilder(
                "DELETE FROM CONSTRUCTION_TASK WHERE DETAIL_MONTH_PLAN_ID = :detailMonthPlanId AND CONSTRUCTION_ID IN (:constructionIdLst)");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.setParameterList("constructionIdLst", constructionIdLst);
        query.executeUpdate();
    }

    // chinhpxn20180710_end
    public List<ConstructionTaskDetailDTO> doSearchForDT(ConstructionTaskDetailDTO obj) {
        if (obj.getDetailMonthPlanId() == null || obj.getType() == null) {
            return new ArrayList<ConstructionTaskDetailDTO>();
        }
        StringBuilder sql = new StringBuilder("SELECT" + " ct.DETAIL_MONTH_PLAN_ID detailMonthPlanId,"
                + " CONSTRUCTION.CONSTRUCTION_ID constructionId, " + " CAT_STATION.CODE catStationCode, "
                + " CONSTRUCTION.CODE constructionCode, " + " sum(ct.QUANTITY) quantity, "
                + " CAT_CONSTRUCTION_TYPE.NAME constructionType, " + " CNT_CONSTR_WORK_ITEM_TASK.CODE cntContract, "
                + " sum(ct.VAT) vat, " + " cp.CODE catProvinceCode " + " FROM CONSTRUCTION_TASK ct");
        sql.append(" LEFT JOIN CONSTRUCTION ON ct.CONSTRUCTION_ID =CONSTRUCTION.CONSTRUCTION_ID  ");
        sql.append(
                " LEFT JOIN CAT_CONSTRUCTION_TYPE ON CONSTRUCTION.CAT_CONSTRUCTION_TYPE_ID =CAT_CONSTRUCTION_TYPE.CAT_CONSTRUCTION_TYPE_ID  ");
        sql.append(" LEFT JOIN CAT_STATION ON CONSTRUCTION.CAT_STATION_ID =CAT_STATION.CAT_STATION_ID  ");
        sql.append(" LEFT JOIN WORK_ITEM ON ct.WORK_ITEM_ID =WORK_ITEM.WORK_ITEM_ID  ");
        sql.append(
                " LEFT JOIN (select distinct cntContract.code,cnt.CONSTRUCTION_ID from CNT_CONSTR_WORK_ITEM_TASK cnt INNER JOIN CNT_CONTRACT cntContract ON cntContract.CNT_CONTRACT_ID = cnt.CNT_CONTRACT_ID AND cntContract.contract_type  = 0 AND cntContract.status!=0) CNT_CONSTR_WORK_ITEM_TASK  ON ct.CONSTRUCTION_ID =CNT_CONSTR_WORK_ITEM_TASK.CONSTRUCTION_ID ");
        sql.append(" LEFT JOIN SYS_USER su ON ct.PERFORMER_ID =su.SYS_USER_ID  ");
        sql.append(" LEFT JOIN SYS_USER sup ON ct.SUPERVISOR_ID =sup.SYS_USER_ID ");
        sql.append(" LEFT JOIN SYS_USER sud ON ct.DIRECTOR_ID  =sud.SYS_USER_ID  ");
        sql.append(" LEFT JOIN CAT_PROVINCE cp ON cp.CAT_PROVINCE_ID=CAT_STATION.CAT_PROVINCE_ID  ");
        sql.append(" WHERE ct.Detail_month_plan_id=:id ");
        sql.append(" AND ct.TYPE =:type ");
        if (!StringUtils.isNullOrEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(CONSTRUCTION.CODE) LIKE upper(:keySearch) OR  upper(WORK_ITEM.NAME) LIKE upper(:keySearch) "
                            + "OR upper(CAT_CONSTRUCTION_TYPE.NAME) LIKE upper(:keySearch) OR upper(ct.TASK_NAME) LIKE upper(:keySearch) "
                            + " OR upper(CNT_CONSTR_WORK_ITEM_TASK.CODE) LIKE upper(:keySearch) OR upper(ct.QUANTITY) LIKE upper(:keySearch) OR upper(su.FULL_NAME) LIKE upper(:keySearch) "
                            + " OR upper(ct.END_DATE) LIKE upper(:keySearch) OR upper(ct.START_DATE) LIKE upper(:keySearch) escape '&')");
        }
        sql.append(
                "group by CAT_STATION.CODE,CONSTRUCTION.CODE,CAT_CONSTRUCTION_TYPE.NAME,CNT_CONSTR_WORK_ITEM_TASK.CODE ,cp.CODE, ct.DETAIL_MONTH_PLAN_ID, CONSTRUCTION.CONSTRUCTION_ID");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        if (!StringUtils.isNullOrEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        query.addScalar("catStationCode", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("detailMonthPlanId", new LongType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("constructionType", new StringType());
        query.addScalar("cntContract", new StringType());
        query.addScalar("vat", new DoubleType());
        query.addScalar("catProvinceCode", new StringType());
        query.setParameter("id", obj.getDetailMonthPlanId());
        queryCount.setParameter("id", obj.getDetailMonthPlanId());
        queryCount.setParameter("type", obj.getType());
        query.setParameter("type", obj.getType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public List<ConstructionTaskDetailDTO> doSearch(ConstructionTaskDetailDTO obj) {
        if (obj.getDetailMonthPlanId() == null || obj.getType() == null) {
            return new ArrayList<ConstructionTaskDetailDTO>();
        }
        StringBuilder sql = new StringBuilder("SELECT ct.Detail_month_plan_id detailMonthPlanId,"
                + "CAT_STATION.CODE catStationCode," + "ct.CONSTRUCTION_TASK_ID constructionTaskId, "
                + "CONSTRUCTION.CODE constructionCode," + "WORK_ITEM.NAME workItemName,"
                + "WORK_ITEM.Code workItemCode," + "su.FULL_NAME performerName," + "sup.FULL_NAME supervisorName,"
                + "sud.FULL_NAME directorName," + "ct.TASK_NAME taskName," + "ct.COMPLETE_PERCENT completePercent,"
                + "ct.QUANTITY quantity," + "CONSTRUCTION.IS_OBSTRUCTED isObstructed,"
                + "CAT_CONSTRUCTION_TYPE.NAME constructionType,"
                // + "ct.QUANTITY completeDate," +
                // "ct.COMPLETE completionTime,"
                + "CNT_CONSTR_WORK_ITEM_TASK.CODE cntContract," + "ct.SOURCE_TYPE sourceType,"
                + "ct.DEPLOY_TYPE deployType," + "ct.PERFORMER_ID performerId," + "ct.SUPERVISOR_ID supervisorId,"
                + "ct.SUPERVISOR_ID directorId, " + "ct.CONSTRUCTION_ID constructionId," + "ct.WORK_ITEM_ID workItemId,"
                + "ct.END_DATE endDate, " + "ct.START_DATE startDate, " + "ct.VAT vat, " + "ct.type type, "
                + "ct.PARENT_ID parentId, " + "ct.LEVEL_ID levelId, " + "ct.PATH path,  "
                + "ct.BASELINE_END_DATE baselineEndDate,  " + "ct.BASELINE_START_DATE baselineStartDate,  "
                + "ct.STATUS status,  " + "ct.COMPLETE_STATE completeState,  "
                + "CONSTRUCTION.COMPLETE_DATE completeDate, "
                + "CONSTRUCTION.APPROVE_COMPLETE_DATE approveCompleteDate ," + "ct.month month,  " + "ct.year year,  "
                + "cp.CODE catProvinceCode  ," + "ct.DESCRIPTION description," + "ct.CREATED_DATE createdDate,"
                + "ct.CREATED_USER_ID createdUserId," + "ct.CREATED_GROUP_ID createdGroupId "
//                hoanm1_20181229_start
                + ", ct.WORK_ITEM_NAME_HSHC workItemNameHSHC "
//                hoanm1_20181229_end
                + " FROM CONSTRUCTION_TASK ct");
        sql.append(" LEFT JOIN CONSTRUCTION ON ct.CONSTRUCTION_ID =CONSTRUCTION.CONSTRUCTION_ID  ");
        sql.append(
                " LEFT JOIN CAT_CONSTRUCTION_TYPE ON CONSTRUCTION.CAT_CONSTRUCTION_TYPE_ID =CAT_CONSTRUCTION_TYPE.CAT_CONSTRUCTION_TYPE_ID  ");
        sql.append(" LEFT JOIN CAT_STATION ON CONSTRUCTION.CAT_STATION_ID =CAT_STATION.CAT_STATION_ID  ");
        sql.append(" LEFT JOIN WORK_ITEM ON ct.WORK_ITEM_ID =WORK_ITEM.WORK_ITEM_ID  ");
        sql.append(
                " LEFT JOIN (select distinct cntContract.code,cnt.CONSTRUCTION_ID from  CNT_CONSTR_WORK_ITEM_TASK cnt INNER JOIN CNT_CONTRACT cntContract ON cntContract.CNT_CONTRACT_ID = cnt.CNT_CONTRACT_ID AND cntContract.contract_type  = 0 AND cntContract.status!=0) CNT_CONSTR_WORK_ITEM_TASK  ON ct.CONSTRUCTION_ID =CNT_CONSTR_WORK_ITEM_TASK.CONSTRUCTION_ID ");
        sql.append(" LEFT JOIN SYS_USER su ON ct.PERFORMER_ID =su.SYS_USER_ID  ");
        sql.append(" LEFT JOIN SYS_USER sup ON ct.SUPERVISOR_ID =sup.SYS_USER_ID ");
        sql.append(" LEFT JOIN SYS_USER sud ON ct.DIRECTOR_ID  =sud.SYS_USER_ID  ");
        sql.append(" LEFT JOIN CAT_PROVINCE cp ON cp.CAT_PROVINCE_ID=CAT_STATION.CAT_PROVINCE_ID  ");

        sql.append(" WHERE ct.Detail_month_plan_id=:id ");
        sql.append(" AND ct.TYPE =:type ");
        if ("1".equals(obj.getType())) {
            sql.append(" AND ct.LEVEL_ID =3 ");
        } else if ("2".equals(obj.getType()) || "3".equals(obj.getType()) || "6".equalsIgnoreCase(obj.getType())) {
            sql.append(" AND ct.LEVEL_ID =4 ");
        }
        if (!StringUtils.isNullOrEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(CONSTRUCTION.CODE) LIKE upper(:keySearch) OR  upper(WORK_ITEM.NAME) LIKE upper(:keySearch) "
                            + "OR upper(CAT_CONSTRUCTION_TYPE.NAME) LIKE upper(:keySearch) OR upper(ct.TASK_NAME) LIKE upper(:keySearch) "
                            + " OR upper(CNT_CONSTR_WORK_ITEM_TASK.CODE) LIKE upper(:keySearch) OR upper(ct.QUANTITY) LIKE upper(:keySearch) OR upper(su.FULL_NAME) LIKE upper(:keySearch) "
                            + " OR upper(ct.END_DATE) LIKE upper(:keySearch) OR upper(ct.START_DATE) LIKE upper(:keySearch) escape '&')");
        }
        sql.append(" ORDER BY CAT_STATION.NAME ASC");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        if (!StringUtils.isNullOrEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        query.setParameter("id", obj.getDetailMonthPlanId());
        query.setParameter("type", obj.getType());
        queryCount.setParameter("id", obj.getDetailMonthPlanId());
        queryCount.setParameter("type", obj.getType());
        query.addScalar("detailMonthPlanId", new LongType());
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("performerId", new LongType());
        query.addScalar("supervisorId", new DoubleType());
        query.addScalar("directorId", new DoubleType());

        query.addScalar("quantity", new DoubleType());
        query.addScalar("completeDate", new DateType());
        query.addScalar("approveCompleteDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("startDate", new DateType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("constructionType", new StringType());
        query.addScalar("isObstructed", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("completePercent", new DoubleType());
        query.addScalar("vat", new DoubleType());
        query.addScalar("taskName", new StringType());
        query.addScalar("sourceType", new StringType());
        query.addScalar("deployType", new StringType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("workItemCode", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("supervisorName", new StringType());
        query.addScalar("directorName", new StringType());

        query.addScalar("type", new StringType());
        query.addScalar("path", new StringType());
        query.addScalar("levelId", new LongType());
        query.addScalar("parentId", new LongType());
        query.addScalar("baselineEndDate", new DateType());
        query.addScalar("baselineStartDate", new DateType());
        query.addScalar("month", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("status", new StringType());
        query.addScalar("completeState", new StringType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("cntContract", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdGroupId", new LongType());
//        hoanm1_20181229_start
        query.addScalar("workItemNameHSHC", new StringType());
//        hoanm1_20181229_end
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    // Lay SYS_GROUP_ID theo SYS_GROUP_ID con

    public String getSysGroupId(String loginName) {

        String sql = new String(" select " + " case when sys.group_level=4 then "
                + " (select sys_group_id from sys_group a where a.sys_group_id= "
                + " (select parent_id from sys_group a where a.sys_group_id=sys.parent_id)) "
                + " when sys.group_level=3 then "
                + " (select sys_group_id from sys_group a where a.sys_group_id=sys.parent_id) " + " else sys_group_id  "
                + " end sys_group_id " + " from sys_group sys "
                + "  where sys_group_id = (select sys_group_id from sys_user where login_name= :loginName) ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("loginName", loginName);
        query.addScalar("sys_group_id", new StringType());

        List<String> lstLong = query.list();
        if (lstLong != null || lstLong.size() > 0) {
            return lstLong.get(0);
        }
        return "";
    }

    // hoanm1_20180602_start
    public String getSysGroupIdUserId(Long sysUserId) {

        String sql = new String(" select " + " case when sys.group_level=4 then "
                + " (select sys_group_id from sys_group a where a.sys_group_id= "
                + " (select parent_id from sys_group a where a.sys_group_id=sys.parent_id)) "
                + " when sys.group_level=3 then "
                + " (select sys_group_id from sys_group a where a.sys_group_id=sys.parent_id) " + " else sys_group_id  "
                + " end sys_group_id " + " from sys_group sys "
                + "  where sys_group_id = (select sys_group_id from sys_user where sys_user_id= :sysUserId) ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("sysUserId", sysUserId);
        query.addScalar("sys_group_id", new StringType());

        List<String> lstLong = query.list();
        if (lstLong != null || lstLong.size() > 0) {
            return lstLong.get(0);
        }
        return "";
    }

    // hoanm1_20180602_end

    public List<ConstructionTaskDTO> getAllConstrucionTaskDTO(SysUserRequest request) {
        // ct.DMPN_QUANTITY_ID dmpnQuantityId,
        String strMonth = getCurrentTimeStampMonth();
        long month = Long.parseLong(strMonth);

        String strYear = getCurrentTimeStampYear();
        long year = Long.parseLong(strYear);

        // ten cong trinh
        // ten hang muc

        StringBuilder sql = new StringBuilder(" SELECT  ct.PATH path, "
                // phucxv_28/06
                + " (case when con.amount is null then 0 else con.amount END) amount , "
                + "(case when con.price is null then 0 else con.price END) price , "
                // phuc end
                + " ct.CONSTRUCTION_TASK_ID constructionTaskId , catT.QUANTITY_BY_DATE quantityByDate , ct.SYS_GROUP_ID sysGroupId, ct.MONTH month, ct.YEAR year, ct.TASK_NAME taskName, "
                + " ct.START_DATE startDate, ct.END_DATE endDate, ct.BASELINE_START_DATE baselineStartDate, ct.BASELINE_END_DATE baselineEndDate, ct.CONSTRUCTION_ID constructionId, "
                + " ct.WORK_ITEM_ID workItemId, ct.CAT_TASK_ID catTaskId, ct.PERFORMER_ID performerId, "
                + " (select full_name from sys_user a where a.sys_user_id= ct.PERFORMER_ID) performerName,  "
                + " ct.QUANTITY quantity, ct.COMPLETE_PERCENT completePercent, "
                + " ct.DESCRIPTION description, ct.STATUS status, ct.SOURCE_TYPE sourceType, ct.DEPLOY_TYPE deployType, ct.VAT vat,  "
                + " ct.DETAIL_MONTH_PLAN_ID detailMonthPlanId, ct.CREATED_DATE createdDate, ct.CREATED_USER_ID createdUserId, ct.CREATED_GROUP_ID createdGroupId, ct.UPDATED_DATE updatedDate, "
                + " ct.UPDATED_USER_ID updatedUserId, ct.UPDATED_GROUP_ID updatedGroupId , "
                + " ct.COMPLETE_STATE completeState, ct.type type ,"
                + " case when ct.type=1 then (select code from construction where construction_id = (select construction_id from construction_task tsk where tsk.construction_task_id=  "
                + " (select parent_id from construction_task tsk where tsk.construction_task_id=ct.parent_id)))  "
                + "  when ct.type in(2,3,6) then (select code from construction where construction_id = ct.construction_id) "
                + "  end constructionCode,  "
                + " case when ct.type=1 then (select task_name from construction_task tsk where tsk.construction_task_id=ct.parent_id) end workItemName  "
//						hoanm1_20180626_start
                + " ,ct.task_order taskOrder,ct.QUANTITY quantityRevenue"
//						hoanm1_20180626_end
//                hoanm1_20190124_start
                + " ,nvl(con.OBSTRUCTED_STATE,0) obstructedState "
//                hoanm1_20190124_end
                + " FROM CONSTRUCTION_TASK ct left join CAT_TASK catT on catT.CAT_TASK_ID = ct.CAT_TASK_ID "
                // phuc_28/06
                + " inner join CONSTRUCTION con on ct.CONSTRUCTION_ID = con.CONSTRUCTION_ID "
                // phuc_End
                + " INNER JOIN DETAIL_MONTH_PLAN dmp  " + " ON ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
                // hoanm1_20180807_start
                + " left join WORK_ITEM wi on ct.WORK_ITEM_ID = wi.WORK_ITEM_ID "
                + " left join CAT_WORK_ITEM_TYPE catWorkItem on wi.CAT_WORK_ITEM_TYPE_ID = catWorkItem.CAT_WORK_ITEM_TYPE_ID and catWorkItem.status = 1"
                // hoanm1_20180807_end
                + " WHERE 1 = 1 AND dmp.SIGN_STATE = 3 AND dmp.status = 1 AND ct.LEVEL_ID = 4 "
                + " AND ct.COMPLETE_STATE is not null AND ct.MONTH = :month AND ct.YEAR = :year and ct.type in(2,3,6)  ");

        if (request.getFlag() == 1) {
            sql.append(" AND ct.PERFORMER_ID = :sysUserId ORDER BY con.code,catWorkItem.item_order,catT.TASK_ORDER ");
        } 
//        hoanm1_20181102_start
//        else {
//            sql.append("  AND ct.SUPERVISOR_ID = :sysUserId ORDER BY con.code,catWorkItem.item_order,catT.TASK_ORDER ");
//        }
//        hoanm1_20181102_end
        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("path", new StringType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("taskName", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("baselineStartDate", new DateType());
        query.addScalar("baselineEndDate", new DateType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("catTaskId", new LongType());
        query.addScalar("performerId", new LongType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("completePercent", new DoubleType());
        query.addScalar("description", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("sourceType", new StringType());
        query.addScalar("deployType", new StringType());
        query.addScalar("vat", new DoubleType());
        query.addScalar("detailMonthPlanId", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("updatedUserId", new LongType());
        query.addScalar("updatedGroupId", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("completeState", new StringType());
        query.addScalar("type", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("quantityByDate", new StringType());
        // phucvx_26/06
        query.addScalar("amount", new DoubleType());
        query.addScalar("price", new DoubleType());
        // phuc_end
        // hoanm1_20180626_start
        query.addScalar("taskOrder", new StringType());
        // hoanm1_20180626_end
        // hoanm1_20180626_start
        query.addScalar("quantityRevenue", new DoubleType());
        // hoanm1_20180626_end
//        hoanm1_20190124_start
        query.addScalar("obstructedState", new StringType());
//        hoanm1_20190124_end
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDTO.class));
//        hoanm1_20181229_start
        if (request.getFlag() == 1) {
        	query.setParameter("sysUserId", request.getSysUserId());
        }
//        hoanm1_20181229_end
        query.setParameter("month", month);
        query.setParameter("year", year);
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDTO.class));
        return query.list();

    }

    public static String getCurrentTimeStampMonth() {
        SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");// dd/MM/yyyy
        Date now = new Date();
        String strDate = sdfDate.format(now);

        String res = strDate.substring(5, 7);
        return res;
    }

    public static String getCurrentTimeStampYear() {
        SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");// dd/MM/yyyy
        Date now = new Date();
        String strDate = sdfDate.format(now);
        String res = strDate.substring(0, 4);
        return res;
    }

    public CountConstructionTaskDTO getCountPermissionSupervisior(SysUserRequest request) {
        String strMonth = getCurrentTimeStampMonth();
        long month = Long.parseLong(strMonth);

        String strYear = getCurrentTimeStampYear();
        long year = Long.parseLong(strYear);

        CountConstructionTaskDTO countConstructionTask = new CountConstructionTaskDTO();

        String sqlQuery = new String(" SELECT count(0)  "
                + " FROM CONSTRUCTION_TASK ct INNER JOIN CONSTRUCTION con ON ct.CONSTRUCTION_ID = con.CONSTRUCTION_ID INNER JOIN DETAIL_MONTH_PLAN dmp ON ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID  "
                + " WHERE 1 = 1 AND dmp.SIGN_STATE = 3 AND dmp.status = 1  "
                + " AND ct.COMPLETE_STATE is not null AND ct.MONTH = :month AND ct.YEAR = :year AND ct.LEVEL_ID = 4 and ct.type in(2,3,6)");

        StringBuilder sqlGetTotalPer = new StringBuilder(sqlQuery).append(" AND ct.PERFORMER_ID = :sysUserId ");
        StringBuilder sqlPerDidnPerform = new StringBuilder(sqlQuery)
                .append(" AND ct.STATUS = 1 AND ct.PERFORMER_ID = :sysUserId");
        StringBuilder sqlPerExcutable = new StringBuilder(sqlQuery)
                .append(" AND ct.STATUS = 2 AND ct.PERFORMER_ID = :sysUserId");
        StringBuilder sqlPerComplition = new StringBuilder(sqlQuery)
                .append(" AND ct.STATUS = 4 AND ct.PERFORMER_ID = :sysUserId");
        StringBuilder sqlPerStop = new StringBuilder(sqlQuery)
                .append(" AND ct.STATUS = 3 AND ct.PERFORMER_ID = :sysUserId");

        StringBuilder sqlGetTotalSup = new StringBuilder(sqlQuery).append(" AND ct.SUPERVISOR_ID = :sysUserId ");
        StringBuilder sqlSupDidnPerform = new StringBuilder(sqlQuery)
                .append(" AND ct.STATUS = 1 AND ct.SUPERVISOR_ID = :sysUserId ");
        StringBuilder sqlSupExcutable = new StringBuilder(sqlQuery)
                .append(" AND ct.STATUS = 2  AND ct.SUPERVISOR_ID = :sysUserId ");
        StringBuilder sqlSupComplition = new StringBuilder(sqlQuery)
                .append(" AND ct.STATUS = 4  AND ct.SUPERVISOR_ID = :sysUserId ");
        StringBuilder sqlSupStop = new StringBuilder(sqlQuery)
                .append(" AND ct.STATUS = 3  AND ct.SUPERVISOR_ID = :sysUserId ");

        SQLQuery queryGetTotalPer = getSession().createSQLQuery(sqlGetTotalPer.toString());
        queryGetTotalPer.setParameter("sysUserId", request.getSysUserId());
        queryGetTotalPer.setParameter("month", month);
        queryGetTotalPer.setParameter("year", year);

        SQLQuery queryPerDidnPerform = getSession().createSQLQuery(sqlPerDidnPerform.toString());
        queryPerDidnPerform.setParameter("sysUserId", request.getSysUserId());
        queryPerDidnPerform.setParameter("month", month);
        queryPerDidnPerform.setParameter("year", year);

        SQLQuery queryPerExcutable = getSession().createSQLQuery(sqlPerExcutable.toString());
        queryPerExcutable.setParameter("sysUserId", request.getSysUserId());
        queryPerExcutable.setParameter("month", month);
        queryPerExcutable.setParameter("year", year);

        SQLQuery queryPerComplition = getSession().createSQLQuery(sqlPerComplition.toString());
        queryPerComplition.setParameter("sysUserId", request.getSysUserId());
        queryPerComplition.setParameter("month", month);
        queryPerComplition.setParameter("year", year);

        SQLQuery queryPerStop = getSession().createSQLQuery(sqlPerStop.toString());
        queryPerStop.setParameter("sysUserId", request.getSysUserId());
        queryPerStop.setParameter("month", month);
        queryPerStop.setParameter("year", year);

        SQLQuery queryGetTotalSup = getSession().createSQLQuery(sqlGetTotalSup.toString());
        queryGetTotalSup.setParameter("sysUserId", request.getSysUserId());
        queryGetTotalSup.setParameter("month", month);
        queryGetTotalSup.setParameter("year", year);

        SQLQuery querySupDidnPerform = getSession().createSQLQuery(sqlSupDidnPerform.toString());
        querySupDidnPerform.setParameter("sysUserId", request.getSysUserId());
        querySupDidnPerform.setParameter("month", month);
        querySupDidnPerform.setParameter("year", year);

        SQLQuery querySupExcutable = getSession().createSQLQuery(sqlSupExcutable.toString());
        querySupExcutable.setParameter("sysUserId", request.getSysUserId());
        querySupExcutable.setParameter("month", month);
        querySupExcutable.setParameter("year", year);

        SQLQuery querySupComplition = getSession().createSQLQuery(sqlSupComplition.toString());
        querySupComplition.setParameter("sysUserId", request.getSysUserId());
        querySupComplition.setParameter("month", month);
        querySupComplition.setParameter("year", year);

        SQLQuery querySupStop = getSession().createSQLQuery(sqlSupStop.toString());
        querySupStop.setParameter("sysUserId", request.getSysUserId());
        querySupStop.setParameter("month", month);
        querySupStop.setParameter("year", year);

        countConstructionTask.setPer_total(((BigDecimal) queryGetTotalPer.uniqueResult()).intValue());
        countConstructionTask.setPer_didn_perform(((BigDecimal) queryPerDidnPerform.uniqueResult()).intValue());
        countConstructionTask.setPer_executable(((BigDecimal) queryPerExcutable.uniqueResult()).intValue());
        countConstructionTask.setPer_complition(((BigDecimal) queryPerComplition.uniqueResult()).intValue());
        countConstructionTask.setPer_stop(((BigDecimal) queryPerStop.uniqueResult()).intValue());

        countConstructionTask.setSup_total(((BigDecimal) queryGetTotalSup.uniqueResult()).intValue());
        countConstructionTask.setSup_didn_perform(((BigDecimal) querySupDidnPerform.uniqueResult()).intValue());
        countConstructionTask.setSup_executable(((BigDecimal) querySupExcutable.uniqueResult()).intValue());
        countConstructionTask.setSup_complition(((BigDecimal) querySupComplition.uniqueResult()).intValue());
        countConstructionTask.setSup_stop(((BigDecimal) querySupStop.uniqueResult()).intValue());
        return countConstructionTask;
    }

    public CountConstructionTaskDTO getCount(SysUserRequest request) {
        String strMonth = getCurrentTimeStampMonth();
        long month = Long.parseLong(strMonth);

        String strYear = getCurrentTimeStampYear();
        long year = Long.parseLong(strYear);

        CountConstructionTaskDTO countConstructionTask = new CountConstructionTaskDTO();

        String sqlQuery = new String(" SELECT count(0)  "
                + " FROM CONSTRUCTION_TASK ct INNER JOIN CONSTRUCTION con ON ct.CONSTRUCTION_ID = con.CONSTRUCTION_ID INNER JOIN DETAIL_MONTH_PLAN dmp ON ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
                + " WHERE 1 = 1 AND dmp.SIGN_STATE = 3 AND dmp.status = 1 "
                + " AND ct.MONTH = :month AND ct.YEAR = :year AND ct.LEVEL_ID = 4 and ct.type in(2,3,6) ");
        StringBuilder sqlGetfastProcess = new StringBuilder(sqlQuery)
                .append(" AND ct.COMPLETE_STATE = 1 AND ct.PERFORMER_ID = :sysUserId");
        StringBuilder sqlGetSlowProcess = new StringBuilder(sqlQuery)
                .append(" AND ct.COMPLETE_STATE = 2 AND ct.PERFORMER_ID = :sysUserId");

        SQLQuery queryGetfastProcess = getSession().createSQLQuery(sqlGetfastProcess.toString());
        queryGetfastProcess.setParameter("sysUserId", request.getSysUserId());
        queryGetfastProcess.setParameter("month", month);
        queryGetfastProcess.setParameter("year", year);

        SQLQuery queryGetSlowProcess = getSession().createSQLQuery(sqlGetSlowProcess.toString());
        queryGetSlowProcess.setParameter("sysUserId", request.getSysUserId());
        queryGetSlowProcess.setParameter("month", month);
        queryGetSlowProcess.setParameter("year", year);
        countConstructionTask.setFastProcess(((BigDecimal) queryGetfastProcess.uniqueResult()).intValue());
        countConstructionTask.setSlowProcess(((BigDecimal) queryGetSlowProcess.uniqueResult()).intValue());

        return countConstructionTask;
    }

    public int updateStopConstruction(ConstructionTaskDTOUpdateRequest request) {
//		hoanm1_20180820_start
        if (request.getConstructionTaskDTO().getCheckEntangle() == 1L) {
            EntangleManageDTO enta = new EntangleManageDTO();
            long sysG = Integer.parseInt(request.getSysUserRequest().getSysGroupId());
            enta.setObstructedState("1");
            enta.setObstructedContent(request.getConstructionTaskDTO().getReasonStop());
            enta.setConstructionId(request.getConstructionTaskDTO().getConstructionId());
            enta.setWorkItemId(request.getConstructionTaskDTO().getWorkItemId());
            enta.setCreatedDate(new Date());
            enta.setCreatedUserId(request.getSysUserRequest().getSysUserId());
            enta.setCreatedGroupId(sysG);
            long id = obstructedDAO.saveObject(enta.toModel());
            entangleManageDAO.updateCon(request.getConstructionTaskDTO().getConstructionId(), "1");
            updateVuongTask(request);
//            hoanm1_20180830_start
            updateStopWorkItem(request.getConstructionTaskDTO().getConstructionId());
//            hoanm1_20180830_end
        }
//		hoanm1_20180820_end
        String sql = new String(" UPDATE CONSTRUCTION_TASK SET UPDATED_GROUP_ID = :updateGroupID,"
                + " UPDATED_USER_ID = :udatedUserId , UPDATED_DATE = :updatedDate ,"
                + " REASON_STOP = :reasonStop , STATUS = '3' "
                + " WHERE CONSTRUCTION_TASK_ID = :constructionTaskId AND LEVEL_ID = 4 ");

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("updateGroupID", request.getSysUserRequest().getSysGroupId());
        query.setParameter("udatedUserId", request.getSysUserRequest().getSysUserId());
        query.setParameter("updatedDate", new Date());
        query.setParameter("reasonStop", request.getConstructionTaskDTO().getReasonStop());
        query.setParameter("constructionTaskId", request.getConstructionTaskDTO().getConstructionTaskId());

        return query.executeUpdate();
    }

    //	hoanm1_20180820_start
    public void updateVuongTask(ConstructionTaskDTOUpdateRequest obj) {
        String HET_VUONG = "0";
        // String VUONG_CHUA_XN = "1";
        // String VUONG_CO_XN = "2";
//
//		if (obj.getObstructedState().equals(HET_VUONG)) {
//			StringBuilder stringBuilder = new StringBuilder();
//			stringBuilder.append(
//					"UPDATE CONSTRUCTION_TASK SET STATUS=2 WHERE nvl(COMPLETE_PERCENT,0) !=0 AND CONSTRUCTION_TASK_ID IN( ");
//			stringBuilder.append("SELECT CONSTRUCTION_TASK_ID FROM CONSTRUCTION_TASK A,DETAIL_MONTH_PLAN B WHERE ");
//			stringBuilder
//					.append("A.DETAIL_MONTH_PLAN_ID=B.DETAIL_MONTH_PLAN_ID AND B.SIGN_STATE=3 AND B.STATUS=1 AND ");
//			stringBuilder.append(
//					"LPAD(A.MONTH,2,0) = TO_CHAR(SYSDATE,'MM') AND A.YEAR = TO_CHAR(SYSDATE,'YYYY') AND A.TYPE=1 AND LEVEL_ID=4 AND A.STATUS !=4 ");
//			stringBuilder.append("START WITH A.CONSTRUCTION_ID = :constructionId ");
//			stringBuilder.append("CONNECT BY PRIOR A.CONSTRUCTION_TASK_ID = A.PARENT_ID) ");
//
//			SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//			StringBuilder stringBuilder2 = new StringBuilder();
//			stringBuilder2.append(
//					"UPDATE CONSTRUCTION_TASK SET STATUS=1 WHERE nvl(COMPLETE_PERCENT,0) =0 AND CONSTRUCTION_TASK_ID IN( ");
//			stringBuilder2.append("SELECT CONSTRUCTION_TASK_ID FROM CONSTRUCTION_TASK A,DETAIL_MONTH_PLAN B WHERE ");
//			stringBuilder2
//					.append("A.DETAIL_MONTH_PLAN_ID=B.DETAIL_MONTH_PLAN_ID AND B.SIGN_STATE=3 AND B.STATUS=1 AND ");
//			stringBuilder2.append(
//					"LPAD(A.MONTH,2,0) = TO_CHAR(SYSDATE,'MM') AND A.YEAR = TO_CHAR(SYSDATE,'YYYY') AND A.TYPE=1 AND LEVEL_ID=4 AND A.STATUS !=4 ");
//			stringBuilder2.append("START WITH A.CONSTRUCTION_ID = :constructionId ");
//			stringBuilder2.append("CONNECT BY PRIOR A.CONSTRUCTION_TASK_ID=A.PARENT_ID) ");
//
//			SQLQuery query2 = getSession().createSQLQuery(stringBuilder2.toString());
//
//			query.setParameter("constructionId", obj.getConstructionId());
//			query2.setParameter("constructionId", obj.getConstructionId());
//
//			query.executeUpdate();
//			query2.executeUpdate();
//			getSession().flush();
//		} else {
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
        query.setParameter("constructionId", obj.getConstructionTaskDTO().getConstructionId());
        query.executeUpdate();
//		}
    }
    
    public void updateStopWorkItem(Long constructionId) {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("UPDATE work_item SET STATUS=4 WHERE  status !=3 and construction_id = :constructionId ");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.setParameter("constructionId", constructionId);
        query.executeUpdate();
    }
//	hoanm1_20180820_end

    public void saveImagePathsDao(List<ConstructionImageInfo> lstConstructionImages, long constructionTaskId,
                                  SysUserRequest request) {

        if (lstConstructionImages == null) {
            return;
        }

        for (ConstructionImageInfo constructionImage : lstConstructionImages) {

            UtilAttachDocumentBO utilAttachDocumentBO = new UtilAttachDocumentBO();
            utilAttachDocumentBO.setObjectId(constructionTaskId);
            utilAttachDocumentBO.setName(constructionImage.getImageName());
            utilAttachDocumentBO.setType("44");
            utilAttachDocumentBO.setDescription("file ảnh thực hiện công việc");
            utilAttachDocumentBO.setStatus("1");
            utilAttachDocumentBO.setFilePath(constructionImage.getImagePath());
            utilAttachDocumentBO.setCreatedDate(new Date());
            utilAttachDocumentBO.setCreatedUserId(request.getSysUserId());
            utilAttachDocumentBO.setCreatedUserName(request.getName());
            // hoanm1_20180718_start
            if (constructionImage.getLongtitude() != null) {
                utilAttachDocumentBO.setLongtitude(constructionImage.getLongtitude());
            }
            if (constructionImage.getLatitude() != null) {
                utilAttachDocumentBO.setLatitude(constructionImage.getLatitude());
            }
            // hoanm1_20180718_end
            long ret = utilAttachDocumentDAO.saveObject(utilAttachDocumentBO);

            System.out.println("ret " + ret);
        }
    }

    public int updatePercentConstruction(ConstructionTaskDTOUpdateRequest request) {

        Long completePercent = 0L;
        StringBuilder sql = new StringBuilder(" UPDATE CONSTRUCTION_TASK SET UPDATED_GROUP_ID = :updateGroupID"
                + " , UPDATED_USER_ID = :udatedUserId , UPDATED_DATE = :updatedDate ");
        // hoanm1_20180704_start
        if ("1".equals(request.getConstructionTaskDTO().getQuantityByDate())) {
            Double totalDaily = getTotalAmount(request.getConstructionTaskDTO().getWorkItemId(),
                    request.getConstructionTaskDTO().getCatTaskId());
            completePercent = Math.round(100 * (totalDaily / request.getConstructionTaskDTO().getAmount()));
            if (completePercent == 100) {
                sql.append(" ,STATUS = '4' ");
            } else {
                sql.append(" ,STATUS = '2' ");
            }
        } else {
        	if (request.getConstructionTaskDTO().getCompletePercent() == 0.0) {
                sql.append(" ,STATUS = '1' ");
            }else if (request.getConstructionTaskDTO().getCompletePercent() == 100.0) {
                sql.append(" ,STATUS = '4' ");
            } else {
                sql.append(" ,STATUS = '2' ");
            }
        }
        // hoanm1_20180704_end
        sql.append(" , COMPLETE_PERCENT = :completePercent ");
        sql.append(" , DESCRIPTION = :description ");
        sql.append(" , PERFORMER_ID = :performerId ");
        sql.append(" WHERE CONSTRUCTION_TASK_ID = :constructionTaskId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        // hoanm1_20180704_start
        if ("1".equals(request.getConstructionTaskDTO().getQuantityByDate())) {
            query.setParameter("completePercent", completePercent);
        } else {
            query.setParameter("completePercent", request.getConstructionTaskDTO().getCompletePercent());
        }
        // hoanm1_20180704_end
        query.setParameter("description", request.getConstructionTaskDTO().getDescription());
        query.setParameter("updateGroupID", request.getSysUserRequest().getSysGroupId());
        query.setParameter("udatedUserId", request.getSysUserRequest().getSysUserId());
        query.setParameter("updatedDate", new Date());
        query.setParameter("performerId", request.getConstructionTaskDTO().getPerformerId());
        query.setParameter("constructionTaskId", request.getConstructionTaskDTO().getConstructionTaskId());

        int result = query.executeUpdate();
        // hoanm1_20180412_start
        String[] lstPath = request.getConstructionTaskDTO().getPath().split("/");
        String sysGroupId = lstPath[1];
        if (request.getConstructionTaskDTO().getType().equals("1")) {
            String constructionId = lstPath[2];
            String workItemId = lstPath[3];
            updateWorkItemConstructionTask(workItemId, constructionId);
        }
        updateSysGroupTask(sysGroupId);
//      hoanm1_20180808_start
        SysUserCOMSDTO userDto = getSysUserBySysUserId(request.getSysUserRequest().getSysUserId());
        ConstructionTaskDTOUpdateRequest stationProvinceDTO = getStationProvince(request);
        insertLogUpdate(userDto, request, stationProvinceDTO);
//		hoanm1_20190108_start
        if(request.getConstructionTaskDTO().getType().equals("1") && request.getConstructionTaskDTO().getStartingDateTK() == null ){
        	 StringBuilder sqlCst = new StringBuilder(" update construction set starting_date=sysdate,status=3 where construction_id = :constructionId ");
             SQLQuery queryWorkItem = getSession().createSQLQuery(sqlCst.toString());
             queryWorkItem.setParameter("constructionId", request.getConstructionTaskDTO().getConstructionId());
             queryWorkItem.executeUpdate();
        }
//        hoanm1_20190108_end
//      hoanm1_20180808_end
        // update status=2 vao work_item
        StringBuilder sqlWorkItem = new StringBuilder(" update work_item set status=2 where work_item_id in  "
                + " (select work_item_id from construction_task where construction_task_id= :constructionTaskId )");
        SQLQuery queryWorkItem = getSession().createSQLQuery(sqlWorkItem.toString());
        queryWorkItem.setParameter("constructionTaskId", request.getConstructionTaskDTO().getConstructionTaskId());
        queryWorkItem.executeUpdate();
        // cap nhat HSHC cong trinh
//        hoanm1_20180910_start
        if (request.getConstructionTaskDTO().getType().equals("2")
                && request.getConstructionTaskDTO().getCompletePercent() == 100.0) {
            StringBuilder sqlConstruction = new StringBuilder(
//            hoanm1_20181219_start
            		" update construction set COMPLETE_APPROVED_VALUE_PLAN = :quantity,APPROVE_COMPLETE_STATE=1,  "
                            + " APPROVE_COMPLETE_DATE = :completeDate where construction_id= :constructionId");
//            hoanm1_20181219_end
            SQLQuery queryConstruction = getSession().createSQLQuery(sqlConstruction.toString());
            queryConstruction.setParameter("constructionId", request.getConstructionTaskDTO().getConstructionId());
            queryConstruction.setParameter("completeDate", new Date());
            queryConstruction.setParameter("quantity",request.getConstructionTaskDTO().getQuantity() * 1000000 * 1000000);
            queryConstruction.executeUpdate();
        }
//        hoanm1_20180910_end
        // cap nhat doanh thu cong trinh
        // hoanm1_20180626_start
        if (request.getConstructionTaskDTO().getType().equals("3")
                && request.getConstructionTaskDTO().getCompletePercent() == 100.0
                && request.getConstructionTaskDTO().getTaskOrder().equals("2")) {
            // hoanm1_20180626_end
            StringBuilder sqlConstruction = new StringBuilder(" update construction set  "
                    + " APPROVE_REVENUE_DATE = :completeDate,APPROVE_REVENUE_STATE = 1,APPROVE_REVENUE_VALUE_PLAN = :quantity where construction_id= :constructionId");
            SQLQuery queryConstruction = getSession().createSQLQuery(sqlConstruction.toString());
            queryConstruction.setParameter("constructionId", request.getConstructionTaskDTO().getConstructionId());
            queryConstruction.setParameter("completeDate", new Date());
            // hoanm1_20180612_start
            queryConstruction.setParameter("quantity",
                    request.getConstructionTaskDTO().getQuantity() * 1000000 * 1000000);
            // hoanm1_20180612_end
            queryConstruction.executeUpdate();
        }
        // hoanm1_20180714_start_cap nhat de nghi quyet toan doanh thu cong
        // trinh
        if (request.getConstructionTaskDTO().getType().equals("3")
                && request.getConstructionTaskDTO().getCompletePercent() == 100.0
                && request.getConstructionTaskDTO().getTaskOrder().equals("1")) {
            StringBuilder sqlConstruction = new StringBuilder(" update construction set  "
                    + " APPROVE_SETTLEMENT_VALUE = :quantity where construction_id= :constructionId");
            SQLQuery queryConstruction = getSession().createSQLQuery(sqlConstruction.toString());
            queryConstruction.setParameter("constructionId", request.getConstructionTaskDTO().getConstructionId());
            queryConstruction.setParameter("quantity",
                    request.getConstructionTaskDTO().getQuantity() * 1000000 * 1000000);
            queryConstruction.executeUpdate();
        }
        // hoanm1_20180714_end

        // insert du lieu vao bang SEND_SMS_EMAIL neu chuyen nguoi khac
        if (result > 0 && request.getFlag() == 1) {
            return insertSendSmsEmail(request);
        }
        // }
        int a = result;
        return (int) a;
    }

    // hoanm1_20180718_start
    public SysUserCOMSDTO getSysUserBySysUserId(Long sysUserId) {

        StringBuilder sql = new StringBuilder(
                "SELECT " + "SU.SYS_USER_ID sysUserId " + ",SU.LOGIN_NAME loginName " + ",SU.FULL_NAME fullName "
                        + ",SU.PASSWORD password " + ",SU.EMPLOYEE_CODE employeeCode " + ",SU.EMAIL email "
                        + ",SU.PHONE_NUMBER phoneNumber " + ",SU.STATUS status " + ",SU.SYS_GROUP_ID departmentId "
                        + ",SY.NAME sysGroupName " + " FROM SYS_USER SU " + "LEFT JOIN sys_group SY "
                        + "ON SU.SYS_GROUP_ID = SY.SYS_GROUP_ID " + "WHERE SU.SYS_USER_ID = :sysUserId ");

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

        query.setParameter("sysUserId", sysUserId);

        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));

        return (SysUserCOMSDTO) query.list().get(0);

    }

    public void insertLogUpdate(SysUserCOMSDTO userDto, ConstructionTaskDTOUpdateRequest requestDTO,
                                ConstructionTaskDTOUpdateRequest stationProvinceDTO) {
        StringBuilder sqlWorkItemTask = new StringBuilder(
                " INSERT INTO KPI_LOG_MOBILE (KPI_LOG_MOBILE_ID, SYSUSERID, LOGINNAME, PASSWORD,  EMAIL, FULLNAME, "
                        + " EMPLOYEECODE, PHONENUMBER, SYSGROUPNAME, SYSGROUPID, TIME_DATE,update_time,FUNCTION_CODE,DESCRIPTION, "
                        + " cat_task_id,cat_task_name,work_item_id,work_item_name,construction_id,construction_code,"
                        + " status,completePercent,start_Date,end_date,constructionTaskId,stationCode,provinceCode,constructionTypeName,CAT_CONSTRUCTION_TYPE_ID,type)"
                        + " VALUES (KPI_LOG_MOBILE_seq.nextval,:SYSUSERID,:LOGINNAME,:PASSWORD,:EMAIL,:FULLNAME,"
                        + " :EMPLOYEECODE,:PHONENUMBER,:SYSGROUPNAME,:SYSGROUPID,sysdate,trunc(sysdate),:functionCode,:description, "
                        + "  :catTaskId,:catTaskName,:workItemId,:workItemName,:constructionId,:constructionCode,"
                        + " :status,:completePercent,:startDate,:endDate,:constructionTaskId,:stationCode,:provinceCode,:constructionTypeName,:catConstructionTypeId,:type) ");
        SQLQuery queryWorkItemTask = getSession().createSQLQuery(sqlWorkItemTask.toString());

        queryWorkItemTask.setParameter("SYSUSERID", userDto.getSysUserId());
        queryWorkItemTask.setParameter("LOGINNAME", userDto.getLoginName());
        queryWorkItemTask.setParameter("PASSWORD", userDto.getPassword());
        queryWorkItemTask.setParameter("EMAIL", userDto.getEmail());
        queryWorkItemTask.setParameter("FULLNAME", userDto.getFullName());
        queryWorkItemTask.setParameter("EMPLOYEECODE", userDto.getEmployeeCode());
        queryWorkItemTask.setParameter("PHONENUMBER", userDto.getPhoneNumber());
        queryWorkItemTask.setParameter("SYSGROUPNAME", userDto.getSysGroupName());
        queryWorkItemTask.setParameter("SYSGROUPID", userDto.getDepartmentId());
        queryWorkItemTask.setParameter("functionCode", "UPDATE");
        queryWorkItemTask.setParameter("description", "Cập nhật tiến độ công việc");
        queryWorkItemTask.setParameter("catTaskId", requestDTO.getConstructionTaskDTO().getCatTaskId());
        queryWorkItemTask.setParameter("catTaskName", requestDTO.getConstructionTaskDTO().getTaskName());
        queryWorkItemTask.setParameter("workItemId", requestDTO.getConstructionTaskDTO().getWorkItemId());
        queryWorkItemTask.setParameter("workItemName", requestDTO.getConstructionTaskDTO().getWorkItemName());
        queryWorkItemTask.setParameter("constructionId", requestDTO.getConstructionTaskDTO().getConstructionId());
        queryWorkItemTask.setParameter("constructionCode", requestDTO.getConstructionTaskDTO().getConstructionCode());
        queryWorkItemTask.setParameter("status", requestDTO.getConstructionTaskDTO().getStatus());
        queryWorkItemTask.setParameter("completePercent", requestDTO.getConstructionTaskDTO().getCompletePercent());
        queryWorkItemTask.setParameter("startDate", requestDTO.getConstructionTaskDTO().getStartDate());
        queryWorkItemTask.setParameter("endDate", requestDTO.getConstructionTaskDTO().getEndDate());
        queryWorkItemTask.setParameter("constructionTaskId",
                requestDTO.getConstructionTaskDTO().getConstructionTaskId());
        if(stationProvinceDTO !=null){
        queryWorkItemTask.setParameter("stationCode", stationProvinceDTO.getStationCode());
        queryWorkItemTask.setParameter("provinceCode", stationProvinceDTO.getProvinceCode());
        queryWorkItemTask.setParameter("constructionTypeName", stationProvinceDTO.getConstructionTypeName());
        queryWorkItemTask.setParameter("catConstructionTypeId", stationProvinceDTO.getConstructionTypeId());
        }else{
        	 queryWorkItemTask.setParameter("stationCode", 1);
             queryWorkItemTask.setParameter("provinceCode", 1);
             queryWorkItemTask.setParameter("constructionTypeName", 1);
             queryWorkItemTask.setParameter("catConstructionTypeId", 1);
        }
        queryWorkItemTask.setParameter("type", requestDTO.getConstructionTaskDTO().getType());

        queryWorkItemTask.executeUpdate();

    }

    public List<DomainDTO> getByAdResource(long sysUserId, String adResource) {
        // long sysUserId = request.getSysUserRequest().getSysUserId();
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
        sql.append("AND a.SYS_USER_ID         = '" + sysUserId + "' ");
        sql.append("AND upper(op.code ");
        sql.append("  ||' ' ");
        sql.append("  ||ad.code) LIKE '%" + adResource + "%' ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("dataCode", new StringType());
        query.addScalar("dataId", new LongType());
        query.addScalar("adResource", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(DomainDTO.class));
        return query.list();
    }

    //	hoanm1_20180718_end
//	hoanm1_20180808_start
    public ConstructionTaskDTOUpdateRequest getStationProvince(ConstructionTaskDTOUpdateRequest req) {

        StringBuilder sql = new StringBuilder(
                "select b.code stationCode, c.code provinceCode, d.name constructionTypeName,d.cat_construction_type_id constructionTypeId "
                        + " from construction a,cat_station b,cat_province c,cat_construction_type d where a.CAT_STATION_ID=b.CAT_STATION_ID "
                        + " and b.cat_province_id=c.cat_province_id and a.cat_construction_type_id=d.cat_construction_type_id "
                        + " and a.construction_id = :constructionId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("stationCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("constructionTypeName", new StringType());
        query.addScalar("constructionTypeId", new LongType());

        query.setParameter("constructionId", req.getConstructionTaskDTO().getConstructionId());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDTOUpdateRequest.class));
        if(query.list().size()>0){
        	return (ConstructionTaskDTOUpdateRequest) query.list().get(0);
        }else{
        	return null;
        }
    }

    //	hoanm1_20180808_end
    public Double getTotal(Long id) {
        String sql = new String(
                " SELECT SUM(a.AMOUNT) amount FROM CONSTRUCTION_TASK_DAILY a where a.confirm in(0,1) and a.CONSTRUCTION_TASK_ID ='"
                        + id + "' ");
        SQLQuery query = getSession().createSQLQuery(sql);
        BigDecimal result = (BigDecimal) query.uniqueResult();
        // hungnx 20180706 start
        if (result == null)
            return (double) 0l;
        // hungnx 20180706 end
        return result.doubleValue();
    }

    public Double getTotalAmount(Long worItemId, Long catTaskId) {
        String sql = new String(
                " SELECT nvl(SUM(a.AMOUNT),0) amount FROM CONSTRUCTION_TASK_DAILY a where a.confirm in (0,1) and a.WORK_ITEM_ID ='"
                        + worItemId + "' and a.cat_task_id ='" + catTaskId + "' ");
        SQLQuery query = getSession().createSQLQuery(sql);
        BigDecimal result = (BigDecimal) query.uniqueResult();
        return result.doubleValue();
    }

    public List<ConstructionTaskDTO> getListConstructionTaskOnDay(SysUserRequest request) {

        String sql = new String(
                " select a.type type, a.complete_State completeState ,a.complete_percent completePercent, a.construction_task_id constructionTaskId ,a.detail_month_plan_id detailMonthPlanId ,a.task_name taskName, "
                        + " case when type=1 then (select work_item_id from construction_task tsk where tsk.construction_task_id=a.parent_id) end workItemId,  "
                        + " case when type=1 then (select task_name from construction_task tsk where tsk.construction_task_id=a.parent_id) end workItemName,  "
                        + " case when type=1 then (select construction_id from construction_task tsk where tsk.construction_task_id=  "
                        + " (select parent_id from construction_task tsk where tsk.construction_task_id=a.parent_id)) "
                        + " when type in(2,3,6) then a.construction_id end constructionId,  "
                        + " case when type=1 then (select code from construction where construction_id = (select construction_id from construction_task tsk where tsk.construction_task_id=  "
                        + "  (select parent_id from construction_task tsk where tsk.construction_task_id=a.parent_id))) "
                        + " when type in(2,3,6) then (select code from construction where construction_id = a.construction_id) end constructionCode, "
                        + " case when type=1 then (select task_name from construction_task tsk where tsk.construction_task_id=  "
                        + " (select parent_id from construction_task tsk where tsk.construction_task_id=a.parent_id))  "
                        + "  when type in(2,3,6) then (select name from construction where construction_id = a.construction_id) end constructionName,  "
                        + " a.start_date startDate ,a.end_date endDate ,a.status status ,a.performer_id performerId,a.description description,  "
                        + " a.PATH path,a.MONTH month, a.YEAR year, (select full_name from sys_user sys where sys.sys_user_id= a.PERFORMER_ID) performerName "
                        // hoanm1_20180626_start
                        + " ,a.task_order taskOrder,a.quantity, nvl(con.amount,0) amount,nvl(con.price,0) price,catT.QUANTITY_BY_DATE quantityByDate,a.cat_task_id catTaskId,a.SYS_GROUP_ID sysGroupId "
                        // hoanm1_20180626_end
                        + " FROM construction_task a,detail_month_plan b ,CAT_TASK catT,CONSTRUCTION con  "
                        // hoanm1_20180807_start
                        + " ,WORK_ITEM wi,CAT_WORK_ITEM_TYPE catWorkItem "
                        + "  WHERE a.detail_month_plan_id=b.detail_month_plan_id AND a.level_id=4 AND a.status !=4  "
                        + " and catT.CAT_TASK_ID = a.CAT_TASK_ID and a.CONSTRUCTION_ID = con.CONSTRUCTION_ID and con.status !=0 and catT.status !=0 "
                        + " and a.WORK_ITEM_ID = wi.WORK_ITEM_ID(+)"
                        + " and catWorkItem.CAT_WORK_ITEM_TYPE_ID = wi.CAT_WORK_ITEM_TYPE_ID and catWorkItem.status = 1 "
                        // hoanm1_20180807_end
                        + " AND b.sign_state=3 and b.status=1 AND a.start_date <= trunc(sysdate) AND a.end_date >= trunc(sysdate)  "

                        + "  and a.COMPLETE_STATE is not null  " + " AND a.PERFORMER_ID= :sysUserId "
                        + "  ORDER BY con.code,catWorkItem.item_order,catT.TASK_ORDER  ");

        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("type", new StringType());
        query.addScalar("completeState", new StringType());
        query.addScalar("completePercent", new DoubleType());
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("detailMonthPlanId", new LongType());
        query.addScalar("taskName", new StringType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("constructionName", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("status", new StringType());
        query.addScalar("performerId", new LongType());
        query.addScalar("description", new StringType());
        query.addScalar("path", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("month", new LongType());
        query.addScalar("year", new LongType());
        // hoanm1_20180626_start
        query.addScalar("taskOrder", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("quantityByDate", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("price", new DoubleType());
        query.addScalar("catTaskId", new LongType());
        query.addScalar("sysGroupId", new LongType());
        // hoanm1_20180626_end
        query.setParameter("sysUserId", request.getSysUserId());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDTO.class));

        return query.list();
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

    // chinhpxn20180718_start
    public int createSendSmsEmailToOperator(ConstructionTaskDTO request, KttsUserSession user) {
        String sqlUser = new String("select e.email,e.PHONE_NUMBER phone "
                + " from domain_data a,user_role_data b,user_role c,sys_role d,sys_user e"
                + " where a.domain_data_id = b.DOMAIN_DATA_ID and c.USER_ROLE_ID = b.USER_ROLE_ID"
                + " and c.SYS_ROLE_ID = d.SYS_ROLE_ID and c.SYS_USER_ID=e.SYS_USER_ID and d.code = 'OPERATOR_SMS' "
                + " and a.DATA_ID = :sysGroupId ");
        SQLQuery queryGetSysUser = getSession().createSQLQuery(sqlUser);
        queryGetSysUser.addScalar("email", new StringType());
        queryGetSysUser.addScalar("phone", new StringType());
        queryGetSysUser.setParameter("sysGroupId", request.getSysGroupId());
        queryGetSysUser.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
        List<SysUserDTO> lstUser = queryGetSysUser.list();

        // for (; index < length; index++) {
        for (SysUserDTO userDTO : lstUser) {
            String sql = new String(" SELECT SEND_SMS_EMAIL_SEQ.nextval FROM DUAL ");
            SQLQuery query = getSession().createSQLQuery(sql);
            int sendSmsEmailId = ((BigDecimal) query.uniqueResult()).intValue();
            StringBuilder sqlSendSmsEmail = new StringBuilder("INSERT INTO SEND_SMS_EMAIL (" + "   SEND_SMS_EMAIL_ID "
                    + " , TYPE" + " , RECEIVE_PHONE_NUMBER " + " , RECEIVE_EMAIL" + " , CREATED_DATE "
                    + " , CREATED_USER_ID" + " , CREATED_GROUP_ID" + " , SUBJECT" + " , CONTENT,status,WORK_ITEM_ID " + " ) VALUES ( "
                    + " :sendSmsEmailId" + " , 1 " + " , :phoneNumber " + " , :email" + " , :createdDate"
                    + " , :createUserId" + " , :createGroupId" + " , :subject " + " , :content,0, :workItemId " + ")");
            //

            String nameSubject = "";
            String sqlSubject = new String(" SELECT ap.NAME from APP_PARAM ap where ap.par_type = 'SUBJECT_SMS'");
            SQLQuery querySubject = getSession().createSQLQuery(sqlSubject);
            querySubject.addScalar("name", new StringType());
            List<String> ListSubject = querySubject.list();
            if (!ListSubject.isEmpty()) {
                nameSubject = ListSubject.get(0);
            }

            String nameCatTask = "";
            String sqlGetNameCatTask = new String(
                    " SELECT ap.NAME name from APP_PARAM ap where ap.par_type = 'CONTENT_SMS_OPERATOR'");
            SQLQuery queryGetNameCatTask = getSession().createSQLQuery(sqlGetNameCatTask);
            queryGetNameCatTask.addScalar("name", new StringType());
            List<String> nameListCatTask = queryGetNameCatTask.list();
            if (!nameListCatTask.isEmpty()) {
                nameCatTask = nameListCatTask.get(0);
            }

            StringBuilder strContent = new StringBuilder(nameCatTask);
            int i = strContent.indexOf("X");

            String name = request.getTaskName();
            if (request.getType().equals("1")) {
                String constructionTaskSQL = "SELECT TASK_NAME taskName FROM CONSTRUCTION_TASK WHERE CONSTRUCTION_TASK_ID = :constructionTaskId ";
                SQLQuery queryConstructionTask = getSession().createSQLQuery(constructionTaskSQL);
                queryConstructionTask.addScalar("taskName", new StringType());
                queryConstructionTask.setParameter("constructionTaskId", request.getParentId());
                List<String> ctName = queryConstructionTask.list();
                if (!ctName.isEmpty()) {
                    strContent.append(" cho công trình: " + ctName.get(0));
                }
            }
//          hoanm1_20180929_start// can xem lại chuyen nguoi thoi gian dang bi null
            SimpleDateFormat sdfDate = new SimpleDateFormat("dd/MM/yyyy");// dd/MM/yyyy
            strContent.append(", thời gian thực hiện từ " +sdfDate.format(request.getStartDate()) + " đến " + sdfDate.format(request.getEndDate()) );
//            hoanm1_20180929_end
            strContent.replace(i, i + 1, name);

            String sqlPerformer = new String("SELECT EMAIL email FROM SYS_USER WHERE SYS_USER_ID = :oldPerformerId ");
            SQLQuery queryGetPerformer = getSession().createSQLQuery(sqlPerformer);
            queryGetPerformer.addScalar("email", new StringType());
            queryGetPerformer.setParameter("oldPerformerId", request.getOldPerformerId());
            queryGetPerformer.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
            List<SysUserDTO> perFormerLst = queryGetPerformer.list();
            String emailA = perFormerLst.get(0).getEmail();
            if (emailA != null) {
                emailA = emailA.substring(0, emailA.indexOf("@"));
            } else {
                emailA = "[EMAIL_IS_NULL]";
            }

            String sqlNewPerformer = new String("SELECT EMAIL email FROM SYS_USER WHERE SYS_USER_ID =  :perFormerId ");
            SQLQuery queryGetNewPerformer = getSession().createSQLQuery(sqlNewPerformer);
            queryGetNewPerformer.addScalar("email", new StringType());
            queryGetNewPerformer.setParameter("perFormerId", request.getPerformerId());
            queryGetNewPerformer.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
            List<SysUserDTO> newPerformerLst = queryGetNewPerformer.list();
            String emailB;
            emailB = newPerformerLst.get(0).getEmail();
            if (emailB != null) {
                emailB = emailB.substring(0, emailB.indexOf("@"));
            } else {
                emailB = "[EMAIL_IS_NULL]";
            }

            int j = strContent.indexOf("A");
            strContent.replace(j, j + 1, emailA);
            int k = strContent.indexOf("B");
            strContent.replace(k, k + 1, emailB);

            // String email = "";
            // String phoneNumber = "";
            //
            // String sqlUser = new String(
            // "SELECT EMAIL email, PHONE_NUMBER mobile FROM SYS_USER WHERE LOGIN_NAME =
            // :loginName ");
            // SQLQuery queryGetSysUser = getSession().createSQLQuery(
            // sqlUser);
            // queryGetSysUser.addScalar("email", new StringType());
            // queryGetSysUser.addScalar("mobile", new StringType());
            // queryGetSysUser.setParameter("loginName",
            // loginNameLst.get(index));
            // queryGetSysUser.setResultTransformer(Transformers
            // .aliasToBean(SysUserDTO.class));
            // SysUserDTO userDTO = (SysUserDTO) queryGetSysUser.uniqueResult();
            //
            // email = userDTO.getEmail();
            // phoneNumber = userDTO.getMobile();

            SQLQuery querySms = getSession().createSQLQuery(sqlSendSmsEmail.toString());
            querySms.setParameter("phoneNumber", userDTO.getPhone());
            querySms.setParameter("email", userDTO.getEmail());
            querySms.setParameter("createUserId", user.getVpsUserInfo().getSysUserId());
            querySms.setParameter("createGroupId", user.getVpsUserInfo().getSysGroupId());
            querySms.setParameter("sendSmsEmailId", sendSmsEmailId);
            querySms.setParameter("createdDate", new Date());
            querySms.setParameter("content", strContent.toString());
            querySms.setParameter("subject", nameSubject);
//          hoanm1_20181022_start
            if(request.getWorkItemId() !=null){
            	querySms.setParameter("workItemId", request.getWorkItemId());
            }else{
            	querySms.setParameter("workItemId", 0L);
            }
//            hoanm1_20181022_end
            querySms.executeUpdate();
        }
        return 1;

    }

    public int createSendSmsEmailToConvert(ConstructionTaskDTO request, KttsUserSession user) {
        SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");// dd/MM/yyyy
        String sql = new String(" SELECT SEND_SMS_EMAIL_SEQ.nextval FROM DUAL ");
        SQLQuery query = getSession().createSQLQuery(sql);
        int sendSmsEmailId = ((BigDecimal) query.uniqueResult()).intValue();
        StringBuilder sqlSendSmsEmail = new StringBuilder("INSERT INTO SEND_SMS_EMAIL (" + "   SEND_SMS_EMAIL_ID "
                + " , TYPE" + " , RECEIVE_PHONE_NUMBER " + " , RECEIVE_EMAIL" + " , CREATED_DATE "
                + " , CREATED_USER_ID" + " , CREATED_GROUP_ID" + " , SUBJECT" + " , CONTENT,status,WORK_ITEM_ID " + " ) VALUES ( "
                + " :sendSmsEmailId" + " , 1 " + " , :phoneNumber " + " , :email" + " , :createdDate"
                + " , :createUserId" + " , :createGroupId" + " , :subject " + " , :content,0, :workItemId  " + ")");
        //

        String nameSubject = "";
        String sqlSubject = new String(" SELECT ap.NAME from APP_PARAM ap where ap.par_type = 'SUBJECT_SMS'");
        SQLQuery querySubject = getSession().createSQLQuery(sqlSubject);
        querySubject.addScalar("name", new StringType());
        List<String> ListSubject = querySubject.list();
        if (!ListSubject.isEmpty()) {
            nameSubject = ListSubject.get(0);
        }

        String nameCatTask = "";
        String sqlGetNameCatTask = new String(
                " SELECT ap.NAME name from APP_PARAM ap where ap.par_type = 'CONTENT_SMS_CONVERT'");
        SQLQuery queryGetNameCatTask = getSession().createSQLQuery(sqlGetNameCatTask);
        queryGetNameCatTask.addScalar("name", new StringType());
        List<String> nameListCatTask = queryGetNameCatTask.list();
        if (!nameListCatTask.isEmpty()) {
            nameCatTask = nameListCatTask.get(0);
        }

        StringBuilder strContent = new StringBuilder(nameCatTask);
        int i = strContent.indexOf("X");
        String name = request.getTaskName();
        if (request.getType().equals("1")) {
            String constructionTaskSQL = "SELECT TASK_NAME taskName FROM CONSTRUCTION_TASK WHERE CONSTRUCTION_TASK_ID = :constructionTaskId ";
            SQLQuery queryConstructionTask = getSession().createSQLQuery(constructionTaskSQL);
            queryConstructionTask.addScalar("taskName", new StringType());
            queryConstructionTask.setParameter("constructionTaskId", request.getParentId());
            List<String> ctName = queryConstructionTask.list();
            if (!ctName.isEmpty()) {
                strContent.append(" cho công trình: " + ctName.get(0));
            }
        }
        strContent.replace(i, i + 1, name);

        String email = "";
        String phoneNumber = "";
        SQLQuery querySms = getSession().createSQLQuery(sqlSendSmsEmail.toString());
        String sqlUser = new String(
                "SELECT EMAIL email, PHONE_NUMBER mobile FROM SYS_USER WHERE SYS_USER_ID = :sysUserId ");
        SQLQuery queryGetSysUser = getSession().createSQLQuery(sqlUser);
        queryGetSysUser.addScalar("email", new StringType());
        queryGetSysUser.addScalar("mobile", new StringType());
        queryGetSysUser.setParameter("sysUserId", request.getOldPerformerId());
        queryGetSysUser.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
        SysUserDTO userDTO = (SysUserDTO) queryGetSysUser.uniqueResult();

        email = userDTO.getEmail();
        phoneNumber = userDTO.getMobile();

        querySms.setParameter("phoneNumber", phoneNumber);
        querySms.setParameter("email", email);
        querySms.setParameter("createUserId", user.getVpsUserInfo().getSysUserId());
        querySms.setParameter("createGroupId", user.getVpsUserInfo().getSysGroupId());
        querySms.setParameter("sendSmsEmailId", sendSmsEmailId);
        querySms.setParameter("createdDate", new Date());
        querySms.setParameter("content", strContent.toString());
        querySms.setParameter("subject", nameSubject);
//      hoanm1_20181022_start
      if(request.getWorkItemId() !=null){
      	querySms.setParameter("workItemId", request.getWorkItemId());
      }else{
      	querySms.setParameter("workItemId", 0L);
      }
//      hoanm1_20181022_end
        return querySms.executeUpdate();
    }

    public int createSendSmsEmail(ConstructionTaskDTO request, KttsUserSession user) {
        SimpleDateFormat sdfDate = new SimpleDateFormat("dd/MM/yyyy");// dd/MM/yyyy
        String sql = new String(" SELECT SEND_SMS_EMAIL_SEQ.nextval FROM DUAL ");
        SQLQuery query = getSession().createSQLQuery(sql);
        int sendSmsEmailId = ((BigDecimal) query.uniqueResult()).intValue();
        StringBuilder sqlSendSmsEmail = new StringBuilder("INSERT INTO SEND_SMS_EMAIL (" + "   SEND_SMS_EMAIL_ID "
                + " , TYPE" + " , RECEIVE_PHONE_NUMBER " + " , RECEIVE_EMAIL" + " , CREATED_DATE "
                + " , CREATED_USER_ID" + " , CREATED_GROUP_ID" + " , SUBJECT" + " , CONTENT,status,WORK_ITEM_ID " + " ) VALUES ( "
                + " :sendSmsEmailId" + " , 1 " + " , :phoneNumber " + " , :email" + " , :createdDate"
                + " , :createUserId" + " , :createGroupId" + " , :subject " + " , :content,0, :workItemId  " + ")");
        //

        String nameSubject = "";
        String sqlSubject = new String(" SELECT ap.NAME from APP_PARAM ap where ap.par_type = 'SUBJECT_SMS'");
        SQLQuery querySubject = getSession().createSQLQuery(sqlSubject);
        querySubject.addScalar("name", new StringType());
        List<String> ListSubject = querySubject.list();
        if (!ListSubject.isEmpty()) {
            nameSubject = ListSubject.get(0);
        }

        String nameCatTask = "";
        String sqlGetNameCatTask = new String(
                " SELECT ap.NAME name from APP_PARAM ap where ap.par_type = 'CONTENT_SMS_RECEIVE'");
        SQLQuery queryGetNameCatTask = getSession().createSQLQuery(sqlGetNameCatTask);
        queryGetNameCatTask.addScalar("name", new StringType());
        List<String> nameListCatTask = queryGetNameCatTask.list();
        if (!nameListCatTask.isEmpty()) {
            nameCatTask = nameListCatTask.get(0);
        }

        StringBuilder strContent = new StringBuilder(nameCatTask);
        int i = strContent.indexOf("X");
        String name = request.getTaskName();
        if (request.getType().equals("1")) {
            String constructionTaskSQL = "SELECT TASK_NAME taskName FROM CONSTRUCTION_TASK WHERE CONSTRUCTION_TASK_ID = :constructionTaskId ";
            SQLQuery queryConstructionTask = getSession().createSQLQuery(constructionTaskSQL);
            queryConstructionTask.addScalar("taskName", new StringType());
            queryConstructionTask.setParameter("constructionTaskId", request.getParentId());
            List<String> ctName = queryConstructionTask.list();
            if (!ctName.isEmpty()) {
                strContent.append(" cho công trình: " + ctName.get(0));
            }
        }
//        hoanm1_20180929_start// can xem lại chuyen nguoi thoi gian dang bi null
        strContent.append(", thời gian thực hiện từ " +sdfDate.format(request.getStartDate()) + " đến " + sdfDate.format(request.getEndDate()) );
//        hoanm1_20180929_end
        strContent.replace(i, i + 1, name);

        String email = "";
        String phoneNumber = "";
        SQLQuery querySms = getSession().createSQLQuery(sqlSendSmsEmail.toString());
        String sqlUser = new String(
                "SELECT EMAIL email, PHONE_NUMBER mobile FROM SYS_USER WHERE SYS_USER_ID = :sysUserId ");
        SQLQuery queryGetSysUser = getSession().createSQLQuery(sqlUser);
        queryGetSysUser.addScalar("email", new StringType());
        queryGetSysUser.addScalar("mobile", new StringType());
        queryGetSysUser.setParameter("sysUserId", request.getPerformerId());
        queryGetSysUser.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
        SysUserDTO userDTO = (SysUserDTO) queryGetSysUser.uniqueResult();

        email = userDTO.getEmail();
        phoneNumber = userDTO.getMobile();

        querySms.setParameter("phoneNumber", phoneNumber);
        querySms.setParameter("email", email);
        querySms.setParameter("createUserId", user.getVpsUserInfo().getSysUserId());
        querySms.setParameter("createGroupId", user.getVpsUserInfo().getSysGroupId());
        querySms.setParameter("sendSmsEmailId", sendSmsEmailId);
        querySms.setParameter("createdDate", new Date());
        querySms.setParameter("content", strContent.toString());
        querySms.setParameter("subject", nameSubject);
//        hoanm1_20181022_start
        if(request.getWorkItemId() !=null){
        	querySms.setParameter("workItemId", request.getWorkItemId());
        }else{
        	querySms.setParameter("workItemId", 0L);
        }
//        hoanm1_20181022_end
        return querySms.executeUpdate();
    }

    // chinhpxn20180718_end

    public int insertSendSmsEmail(ConstructionTaskDTOUpdateRequest request) {
        SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");// dd/MM/yyyy

        String sql = new String(" SELECT SEND_SMS_EMAIL_SEQ.nextval FROM DUAL ");
        SQLQuery query = getSession().createSQLQuery(sql);
        int sendSmsEmailId = ((BigDecimal) query.uniqueResult()).intValue();
        String sqlSeq = new String(" SELECT CONSTRUCTION_TASK_SEQ.nextval FROM DUAL ");
        SQLQuery querySeq = getSession().createSQLQuery(sqlSeq);
        int constructionTaskId = ((BigDecimal) querySeq.uniqueResult()).intValue();
        StringBuilder sqlSendSmsEmail = new StringBuilder("INSERT INTO SEND_SMS_EMAIL (" + "   SEND_SMS_EMAIL_ID "
                + " , TYPE" + " , RECEIVE_PHONE_NUMBER " + " , RECEIVE_EMAIL" + " , CREATED_DATE "
                + " , CREATED_USER_ID" + " , CREATED_GROUP_ID" + " , SUBJECT" + " , CONTENT,status,WORK_ITEM_ID  " + " ) VALUES ( "
                + " :sendSmsEmailId" + " , 1 " + " , :phoneNumber " + " , :email" + " , :createdDate"
                + " , :createUserId" + " , :createGroupId" + " , :subject " + " , :content,0, :workItemId  " + ")");
        //

        String nameSubject = new String("");
        String sqlSubject = new String(" SELECT ap.NAME from APP_PARAM ap where ap.par_type = 'SUBJECT_SMS'");
        SQLQuery querySubject = getSession().createSQLQuery(sqlSubject);
        querySubject.addScalar("name", new StringType());
        List<String> ListSubject = querySubject.list();
        if (!ListSubject.isEmpty()) {
            nameSubject = ListSubject.get(0);
        }

        // String nameContent = new String("");
        // String sqlGetName = new
        // String(" SELECT ct.name name from cat_task ct where ct.cat_task_ID =
        // :catTaskId ");
        // SQLQuery queryGetName = getSession().createSQLQuery(sqlGetName);
        // queryGetName.setParameter("catTaskId",
        // request.getConstructionTaskDTO().getCatTaskId());
        // queryGetName.addScalar("name", new StringType());
        // List<String> nameList= queryGetName.list();
        // if(nameList.size() > 0){
        // nameContent = nameList.get(0);
        // }

        String nameCatTask = new String("");
        String sqlGetNameCatTask = new String(
                " SELECT ap.NAME name from APP_PARAM ap where ap.par_type = 'CONTENT_SMS'");
        SQLQuery queryGetNameCatTask = getSession().createSQLQuery(sqlGetNameCatTask);
        queryGetNameCatTask.addScalar("name", new StringType());
        List<String> nameListCatTask = queryGetNameCatTask.list();
        if (!nameListCatTask.isEmpty()) {
            nameCatTask = nameListCatTask.get(0);
        }

        StringBuilder strContent = new StringBuilder(nameCatTask);
        strContent.append(": " + request.getConstructionTaskDTO().getTaskName());
        strContent.append(", thực hiện từ ngày : " + sdfDate.format(request.getConstructionTaskDTO().getStartDate())
                + " đến ngày " + sdfDate.format(request.getConstructionTaskDTO().getEndDate()));

        SQLQuery querySms = getSession().createSQLQuery(sqlSendSmsEmail.toString());
        querySms.setParameter("phoneNumber", request.getSysUserDto().getPhoneNumber());
        querySms.setParameter("email", request.getSysUserDto().getEmail());
        querySms.setParameter("createdDate", new Date());
        querySms.setParameter("createUserId", request.getSysUserRequest().getSysUserId());
        querySms.setParameter("createGroupId", request.getSysUserRequest().getSysGroupId());
        querySms.setParameter("sendSmsEmailId", sendSmsEmailId);
        querySms.setParameter("content", strContent.toString());
        querySms.setParameter("subject", nameSubject);
//      hoanm1_20181022_start
      if(request.getConstructionTaskDTO().getWorkItemId() !=null){
      	querySms.setParameter("workItemId", request.getConstructionTaskDTO().getWorkItemId());
      }else{
      	querySms.setParameter("workItemId", 0L);
      }
//      hoanm1_20181022_end
        return querySms.executeUpdate();
    }

    public int inserConstructionTask(ConstructionTaskDTOUpdateRequest request) {

        if (request.getFlag() == 1) {
            if (checkThiCong(request.getConstructionTaskDTO())) {
                return 0;
            }
        }

        if (request.getFlag() == 2) {
            if (check(request.getConstructionTaskDTO())) {
                return 0;
            }
        }

        String sqlSeq = new String(" SELECT CONSTRUCTION_TASK_SEQ.nextval FROM DUAL ");
        SQLQuery querySeq = getSession().createSQLQuery(sqlSeq);
        int constructionTaskId = ((BigDecimal) querySeq.uniqueResult()).intValue();
        StringBuilder sql = new StringBuilder(
                "INSERT INTO CONSTRUCTION_TASK" + " ( CONSTRUCTION_ID  " + " , CONSTRUCTION_TASK_ID" + " , TASK_NAME");
        if (request.getFlag() == 1) {
            sql.append(" , WORK_ITEM_ID ");
        }
        sql.append(" , PERFORMER_ID" + " , START_DATE" + " , END_DATE " + ", CREATED_DATE " + ", CREATED_USER_ID "
                + ", COMPLETE_STATE " + ")");
        sql.append(" VALUES ( " + "  :constructionId , " + constructionTaskId + " ,:taksName");
        if (request.getFlag() == 1) {
            sql.append(" ,:workItemId");
        }
        sql.append(
                " ,:performerId" + " ,:startDate" + " ,:endDate" + " ,:createDate" + " ,:createUserId" + ", 1 " + ")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.setParameter("constructionId", request.getConstructionTaskDTO().getConstructionId());
        query.setParameter("taksName", request.getConstructionTaskDTO().getTaskName());
        if (request.getFlag() == 1) {
            query.setParameter("workItemId", request.getConstructionTaskDTO().getWorkItemId());
        }
        query.setParameter("performerId", request.getConstructionTaskDTO().getPerformerId());
        query.setParameter("startDate", request.getConstructionTaskDTO().getStartDate());
        query.setParameter("endDate", request.getConstructionTaskDTO().getEndDate());
        query.setParameter("createDate", new Date());
        query.setParameter("createUserId", request.getSysUserRequest().getSysUserId());
        return query.executeUpdate();

    }

    public boolean check(ConstructionTaskDTO dto) {
        StringBuilder sql = new StringBuilder("Select count(0) From Construction_Task where"
                + "  construction_id = :constructionId " + " AND performer_id = :performerId " + " AND type = :type ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", dto.getConstructionId());
        query.setParameter("type", dto.getType());
        query.setParameter("performerId", dto.getPerformerId());

        return ((BigDecimal) query.uniqueResult()).intValue() > 0;
    }

    public boolean checkThiCong(ConstructionTaskDTO dto) {
        StringBuilder sql = new StringBuilder(
                "Select count(0) From Construction_Task where" + "  construction_id = :constructionId "
                        + " AND work_item_id = :workItemId" + " AND construction_task_id = :constructionTaskId"
                        + " AND detail_month_plan_id = :detailMonthPlanId" + " AND performer_id = :performerId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", dto.getConstructionId());
        query.setParameter("constructionTaskId", dto.getConstructionTaskId());
        query.setParameter("workItemId", dto.getWorkItemId());
        query.setParameter("detailMonthPlanId", dto.getDetailMonthPlanId());
        query.setParameter("performerId", dto.getPerformerId());
        int a = ((BigDecimal) query.uniqueResult()).intValue();
        return ((BigDecimal) query.uniqueResult()).intValue() > 0;
    }

    public List<ConstructionTaskDetailDTO> doSearchForReport(ConstructionTaskDetailDTO obj) {
        StringBuilder sql = new StringBuilder("select " + " ct.month month,ct.year year,ct.task_name taskName, "
                + " (select full_name from sys_user sys where sys.sys_user_id=ct.PERFORMER_ID) performerName, "
                + " ct.START_DATE startDate,ct.END_DATE endDate, " + " case when ct.type=1 then  "
                + " (select cst.code from CONSTRUCTION_TASK a,construction cst where level_id=2 and a.construction_id=cst.construction_id and cst.STATUS !=0 "
                + " start with a.construction_task_id =ct.construction_task_id "
                + " connect by prior a.parent_id=a.construction_task_id) "
                + " else (select code from construction cst where cst.construction_id=ct.construction_id and cst.STATUS !=0) end "
                + "constructionCode,"
                // anhnn20180810 start
                + " (select receive_records_date from construction cst where cst.construction_id=ct.construction_id and cst.STATUS !=0) "
                + " receiveRecordsDate ,"
                // anhnn201810 end
                + " (select name from sys_group sys where sys.SYS_GROUP_ID=ct.SYS_GROUP_ID) sysGroupName, "
                + " ct.status, ct.COMPLETE_PERCENT completePercent, "
                + " catp.CAT_PROVINCE_ID catProvinceId, "
                + " catp.CODE catProvinceCode, "
                + " catp.NAME catProvinceName, "
                + " ct.COMPLETE_STATE completeState "
                + " from CONSTRUCTION_TASK ct "
                + " LEFT JOIN DETAIL_MONTH_PLAN dmp ON ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
                + " LEFT JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = ct.CONSTRUCTION_ID "
                + " LEFT JOIN CAT_STATION cats ON cats.CAT_STATION_ID = con.CAT_STATION_ID "
                + " LEFT JOIN CAT_PROVINCE catp ON catp.CAT_PROVINCE_ID = cats.CAT_PROVINCE_ID "
                + " where 1=1 and dmp.SIGN_STATE = 3 "
                + " AND dmp.status = 1 AND ct.LEVEL_ID = 4 ");

        if (obj.getYear() != null && obj.getMonth() != null) {
            sql.append(" and ct.month = :month and ct.year = :year");
        }
        if (!StringUtils.isNullOrEmpty(obj.getKeySearch())) {
            sql.append(" AND (upper(case when ct.type=1 then "
                    + " (select cst.code from CONSTRUCTION_TASK a,construction cst where level_id=2 and a.construction_id=cst.construction_id and cst.STATUS !=0 "
                    + " start with a.construction_task_id =ct.construction_task_id "
                    + " connect by prior a.parent_id=a.construction_task_id) "
                    + " else (select code from construction cst where cst.construction_id=ct.construction_id and cst.STATUS !=0) end) LIKE upper(:keySearch) OR  upper((select full_name from sys_user sys where sys.sys_user_id=ct.PERFORMER_ID)) LIKE upper(:keySearch) "
                    + " OR upper(ct.TASK_NAME) LIKE upper(:keySearch) escape '&')");
        }
        if (obj.getSysGroupId() != null) {
            sql.append(
                    " AND (select sys_group_id from sys_group sys where sys.SYS_GROUP_ID=ct.SYS_GROUP_ID) = :sysGroupId");
        }
        if (obj.getListStatus() != null && obj.getListStatus().size() > 0) {
            sql.append(" AND ct.STATUS in ( :listStatus)");
        }
        if (obj.getListCompleteState() != null && obj.getListCompleteState().size() > 0) {
            sql.append(" AND ct.COMPLETE_STATE in ( :listCompleteState)");
        }
        // tuannt_15/08/2018_start
        if (obj.getCatProvinceId() != null) {
            sql.append(" AND catp.CAT_PROVINCE_ID = :catProvinceId ");
        }
        // tuannt_15/08/2018_start
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        if (!StringUtils.isNullOrEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
        }
        if (obj.getListStatus() != null && obj.getListStatus().size() > 0) {
            query.setParameterList("listStatus", obj.getListStatus());
            queryCount.setParameterList("listStatus", obj.getListStatus());
        }
        if (obj.getMonth() != null) {
            query.setParameter("month", obj.getMonth());
            queryCount.setParameter("month", obj.getMonth());
        }
        if (obj.getYear() != null) {
            query.setParameter("year", obj.getYear());
            queryCount.setParameter("year", obj.getYear());
        }
        if (obj.getListCompleteState() != null && obj.getListCompleteState().size() > 0) {
            query.setParameterList("listCompleteState", obj.getListCompleteState());
            queryCount.setParameterList("listCompleteState", obj.getListCompleteState());
        }
        // tuannt_15/08/2018_start
        if (obj.getCatProvinceId() != null) {
            query.setParameter("catProvinceId", obj.getCatProvinceId());
            queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
        }
        // tuannt_15/08/2018_start

        query.addScalar("endDate", new DateType());
        query.addScalar("startDate", new DateType());
        query.addScalar("constructionCode", new StringType());
        // anhnn20180810 start
        query.addScalar("receiveRecordsDate", new DateType());
        // anhnn20180810 end
        query.addScalar("completePercent", new DoubleType());
        query.addScalar("taskName", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("catProvinceName", new StringType());
        query.addScalar("completeState", new StringType());
        query.addScalar("month", new LongType());
        query.addScalar("year", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    // ###################################################################################

    public List<ConstructionTaskGranttDTO> getDataForGrant(GranttDTO granttSearch, List<String> sysGroupId,String groupIdTC,String groupIdHSHC) {
        List<ConstructionTaskGranttDTO> lstDto = new ArrayList<ConstructionTaskGranttDTO>();
        StringBuilder select = new StringBuilder();
        select.append(" consTask.CONSTRUCTION_TASK_ID taskID");
        // hoanm1_20180714_start
        // select.append(" ,consTask.TASK_NAME taskName,consTask.PARENT_ID
        // taskParentID,case when consTask.level_id= 2 then cons.STARTING_DATE else
        // consTask.START_DATE end startDate,");
        // select.append(" case when consTask.level_id= 2 then
        // cons.EXCPECTED_COMPLETE_DATE else consTask.END_DATE end
        // endDate,consTask.COMPLETE_PERCENT comPlete");
        select.append(" ,consTask.TASK_NAME taskName,consTask.PARENT_ID taskParentID, consTask.START_DATE  startDate,");
        select.append(" consTask.END_DATE endDate,consTask.COMPLETE_PERCENT comPlete");
        // hoanm1_20180714_end
        select.append(" ,consTask.LEVEL_ID levelId");
        select.append(" ,consTask.STATUS status");
        select.append(" ,sysuser.FULL_NAME fullname");
        select.append(" ,consTask.PERFORMER_ID performerId ");
        select.append(" ,consTask.complete_state checkProgress ");
        select.append(" ,consTask.Work_Item_id workItemId ");
        // hoanm1_20180612_start
        select.append(" ,consTask.type type,consTask.CONSTRUCTION_ID constructionId,consTask.quantity quantity ");
        select.append(" ,consTask.task_order taskOrder");
        // hoanm1_20180612_end
        // chinhpxn20180720_start
        select.append(" ,wi.STATUS workItemStatus,consTask.sys_group_id sysGroupId ");
        // chinhpxn20180720_end
        select.append(" ,cons.CAT_CONSTRUCTION_TYPE_ID catContructionTypeId ");
        select.append(" ,catPro.CAT_PROVINCE_ID catProvinceId");
        select.append(" ,cons.code constructionCode,catPro.code provinceCode ");
        select.append(" ,catPro.NAME catProvinceName, wi.IS_INTERNAL isInteral,consTask.COMPLETE_STATE completeState ");
//        hoanm1_20181208_start
        select.append(" ,case when check_stock=1 then 'Có' when (check_stock=0 or check_stock is null) and level_id=3 then 'Không' else ' ' end checkStock");
//        hoanm1_20181208_end
        select.append(" from CONSTRUCTION_TASK consTask ");
        select.append(" inner join DETAIL_MONTH_PLAN monthPlan on consTask.DETAIL_MONTH_PLAN_ID = monthPlan.DETAIL_MONTH_PLAN_ID");
        select.append(" left join CONSTRUCTION cons on consTask.CONSTRUCTION_ID = cons.CONSTRUCTION_ID and cons.STATUS != 0 ");
        select.append(" left join CAT_STATION cat on cat.CAT_STATION_ID = cons.CAT_STATION_ID ");
        select.append(" left join CAT_PROVINCE catPro on catPro.CAT_PROVINCE_ID = cat.CAT_PROVINCE_ID ");
        select.append(" left join SYS_USER sysuser on consTask.PERFORMER_ID = sysuser.SYS_USER_ID");
        select.append(" left join WORK_ITEM wi on consTask.WORK_ITEM_ID = wi.WORK_ITEM_ID");
        select.append(" where consTask.LEVEL_ID IS NOT NULL ");
//        hoanm1_20180905_start
        if(!groupIdTC.isEmpty()){
        	select.append(" and consTask.TYPE =1  ");
        } 
        if(!groupIdHSHC.isEmpty()){
            select.append(" and (consTask.TYPE =2 or(consTask.type=1 and consTask.level_id=1))  ");
        }
        if(groupIdTC.isEmpty() && groupIdHSHC.isEmpty()){
            select.append(" and (consTask.TYPE =1 OR consTask.TYPE =2 OR consTask.TYPE =3 OR consTask.TYPE =6) ");
        }
//        hoanm1_20180905_end
        select.append(" and monthPlan.MONTH=:month and monthPlan.YEAR=:year and monthPlan.status = 1 ");
        select.append(" and monthPlan.SIGN_STATE=:signState");
        if (sysGroupId != null) {
            select.append(" and monthPlan.sys_group_id in :sysGroupId ");
        }
        StringBuilder sql = new StringBuilder();

        if (!StringUtils.isNullOrEmpty(granttSearch.getKeySearch()) && StringUtils.isNullOrEmpty(granttSearch.getCatProvinceCode())) {
            sql.append("  with parent as (select DISTINCT ");
            sql.append(select.toString());
            sql.append(" start with ((UPPER(consTask.TASK_NAME) LIKE :keysearch OR UPPER(sysuser.FULL_NAME) LIKE :keysearch OR UPPER(sysuser.EMAIL) LIKE :keysearch))");
            if (granttSearch.getComplete_state() != null || granttSearch.getStatus() != null) {
                if (granttSearch.getStatus() != null && (granttSearch.getStatus() == 1 || granttSearch.getStatus() == 3)) {
                    sql.append("  and consTask.status= :status");
                }
                if (granttSearch.getComplete_state() != null && granttSearch.getComplete_state() == 2) {
                    sql.append(" and consTask.COMPLETE_STATE= :complete_state");
                }
            }
            sql.append(" connect by prior consTask.PARENT_ID= consTask.CONSTRUCTION_TASK_ID ),");
            sql.append(" child as (select ");
            sql.append(select.toString());
            sql.append(" start with ((UPPER(consTask.TASK_NAME) LIKE :keysearch OR UPPER(sysuser.FULL_NAME) LIKE :keysearch OR UPPER(sysuser.EMAIL) LIKE :keysearch))");
            if (granttSearch.getComplete_state() != null || granttSearch.getStatus() != null) {
                if (granttSearch.getStatus() != null && (granttSearch.getStatus() == 1 || granttSearch.getStatus() == 3)) {
                    sql.append("  and consTask.status= :status");
                }
                if (granttSearch.getComplete_state() != null && granttSearch.getComplete_state() == 2) {
                    sql.append(" and consTask.COMPLETE_STATE= :complete_state");
                }
            }
            sql.append(" connect by prior consTask.CONSTRUCTION_TASK_ID= consTask.PARENT_ID )");
            sql.append("  select * from parent union select * from child ");
        } else if (StringUtils.isNullOrEmpty(granttSearch.getKeySearch()) && !StringUtils.isNullOrEmpty(granttSearch.getCatProvinceCode())) {
            // TODO
            sql.append("  with parent as (select DISTINCT ");
            sql.append(select.toString());
            sql.append(" start with ( upper(catPro.NAME) LIKE upper(:catProvinceCode) OR upper(catPro.CODE) LIKE upper(:catProvinceCode) )");
            if (granttSearch.getComplete_state() != null || granttSearch.getStatus() != null) {
                if (granttSearch.getStatus() != null && (granttSearch.getStatus() == 1 || granttSearch.getStatus() == 3)) {
                    sql.append("  and consTask.status= :status");
                }
                if (granttSearch.getComplete_state() != null && granttSearch.getComplete_state() == 2) {
                    sql.append(" and consTask.COMPLETE_STATE= :complete_state");
                }
            }
            sql.append(" connect by prior consTask.PARENT_ID= consTask.CONSTRUCTION_TASK_ID ),");
            sql.append(" child as (select ");
            sql.append(select.toString());
            sql.append(" start with ( upper(catPro.NAME) LIKE upper(:catProvinceCode) OR upper(catPro.CODE) LIKE upper(:catProvinceCode) )");
            if (granttSearch.getComplete_state() != null || granttSearch.getStatus() != null) {
                if (granttSearch.getStatus() != null && (granttSearch.getStatus() == 1 || granttSearch.getStatus() == 3)) {
                    sql.append("  and consTask.status= :status");
                }
                if (granttSearch.getComplete_state() != null && granttSearch.getComplete_state() == 2) {
                    sql.append(" and consTask.COMPLETE_STATE= :complete_state");
                }
            }
            sql.append(" connect by prior consTask.CONSTRUCTION_TASK_ID= consTask.PARENT_ID )");
            sql.append("  select * from parent union select * from child ");
        } else if (!StringUtils.isNullOrEmpty(granttSearch.getKeySearch()) && !StringUtils.isNullOrEmpty(granttSearch.getCatProvinceCode())) {
            // TODO
            sql.append("  with parent as (select DISTINCT ");
            sql.append(select.toString());
            sql.append(" start with ((UPPER(consTask.TASK_NAME) LIKE :keysearch OR UPPER(sysuser.FULL_NAME) LIKE :keysearch OR UPPER(sysuser.EMAIL) LIKE :keysearch )) ");
            sql.append(" AND ( upper(catPro.NAME) LIKE upper(:catProvinceCode) OR upper(catPro.CODE) LIKE upper(:catProvinceCode) ) ");
            if (granttSearch.getComplete_state() != null || granttSearch.getStatus() != null) {
                if (granttSearch.getStatus() != null && (granttSearch.getStatus() == 1 || granttSearch.getStatus() == 3)) {
                    sql.append("  and consTask.status= :status");
                }
                if (granttSearch.getComplete_state() != null && granttSearch.getComplete_state() == 2) {
                    sql.append(" and consTask.COMPLETE_STATE= :complete_state");
                }
            }
            sql.append(" connect by prior consTask.PARENT_ID= consTask.CONSTRUCTION_TASK_ID ),");
            sql.append(" child as (select ");
            sql.append(select.toString());
            sql.append(" start with ((UPPER(consTask.TASK_NAME) LIKE :keysearch OR UPPER(sysuser.FULL_NAME) LIKE :keysearch OR UPPER(sysuser.EMAIL) LIKE :keysearch )) ");
            sql.append(" AND ( upper(catPro.NAME) LIKE upper(:catProvinceCode) OR upper(catPro.CODE) LIKE upper(:catProvinceCode) ) ");
            if (granttSearch.getComplete_state() != null || granttSearch.getStatus() != null) {
                if (granttSearch.getStatus() != null && (granttSearch.getStatus() == 1 || granttSearch.getStatus() == 3)) {
                    sql.append("  and consTask.status= :status");
                }
                if (granttSearch.getComplete_state() != null && granttSearch.getComplete_state() == 2) {
                    sql.append(" and consTask.COMPLETE_STATE= :complete_state");
                }
            }
            sql.append(" connect by prior consTask.CONSTRUCTION_TASK_ID= consTask.PARENT_ID )");
            sql.append("  select * from parent union select * from child ");
        } else {
            sql.append("with tbl as (select distinct ");
            sql.append(select.toString());
            if (granttSearch.getComplete_state() != null || granttSearch.getStatus() != null) {
                sql.append(" START WITH level_id=4 ");
                if (granttSearch.getStatus() != null
                        && (granttSearch.getStatus() == 1 || granttSearch.getStatus() == 3)) {
                    sql.append("  and consTask.status= :status");
                }
                if (granttSearch.getComplete_state() != null && granttSearch.getComplete_state() == 2) {
                    sql.append(" and consTask.COMPLETE_STATE= :complete_state");
                }
                sql.append(" CONNECT BY prior consTask.parent_id= consTask.CONSTRUCTION_TASK_ID)");
            } else {
                sql.append(" start with consTask.parent_id is null  connect by prior consTask.CONSTRUCTION_TASK_ID= consTask.parent_id)");
            }
            // chinhpxn20180703_start
            // sql.append(" select * from tbl ORDER BY TYPE, startDate");
            /*sql.append(" select * from tbl ORDER BY TYPE,provinceCode,constructionCode,levelid, taskparentid desc,  startDate");*/
            sql.append(" select * from tbl ORDER BY TYPE,levelid,provinceCode,constructionCode, taskparentid desc");
            // chinhpxn20180703_end
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString())
                .addScalar("taskID", LongType.INSTANCE)
                .addScalar("taskName", StringType.INSTANCE)
                .addScalar("taskParentID", LongType.INSTANCE)
                .addScalar("startDate", DateType.INSTANCE)
                .addScalar("endDate", DateType.INSTANCE)
                .addScalar("comPlete", DoubleType.INSTANCE)
                .addScalar("levelId", LongType.INSTANCE)
                .addScalar("status", StringType.INSTANCE)
                .addScalar("fullname", StringType.INSTANCE)
                .addScalar("performerId", LongType.INSTANCE)
                .addScalar("checkProgress", LongType.INSTANCE)
                .addScalar("workItemId", LongType.INSTANCE)
                .addScalar("type", StringType.INSTANCE)
                .addScalar("constructionId", LongType.INSTANCE)
                .addScalar("quantity", DoubleType.INSTANCE)
                .addScalar("taskOrder", StringType.INSTANCE)
                .addScalar("workItemStatus", LongType.INSTANCE)
                .addScalar("sysGroupId", LongType.INSTANCE)
                .addScalar("catContructionTypeId", LongType.INSTANCE)
                .addScalar("catProvinceId", LongType.INSTANCE)
                .addScalar("provinceCode", StringType.INSTANCE)
                .addScalar("catProvinceName", StringType.INSTANCE)
                .addScalar("isInteral", StringType.INSTANCE)
                 .addScalar("completeState", StringType.INSTANCE)
                 //                hoanm1_20181208_start
                .addScalar("checkStock", StringType.INSTANCE);
//                hoanm1_20181208_end;

        query.setParameter("signState", signState);
        query.setParameter("month", granttSearch.getMonth());
        query.setParameter("year", granttSearch.getYear());
        if (granttSearch.getStatus() != null) {
            query.setParameter("status", granttSearch.getStatus());
        }
        if (granttSearch.getComplete_state() != null) {
            query.setParameter("complete_state", granttSearch.getComplete_state());
        }
        if (sysGroupId != null) {
            query.setParameterList("sysGroupId", sysGroupId);
        }
        if (!com.viettel.service.base.utils.StringUtils.isNullOrEmpty(granttSearch.getKeySearch())) {
            query.setParameter("keysearch", "%" + granttSearch.getKeySearch().toUpperCase().trim() + "%");
        }
        if (!StringUtils.isNullOrEmpty(granttSearch.getCatProvinceCode())) {
            query.setParameter("catProvinceCode", "%" + granttSearch.getCatProvinceCode().toUpperCase().trim() + "%");
        }

        List<Object[]> rs = query.list();

        if (rs.size() > 0) {
            Long i = 0L;
            for (Object[] objects : rs) {
                ConstructionTaskGranttDTO dto = new ConstructionTaskGranttDTO();
                dto.setOrderID(i);
                if (objects[0] != null)
                    dto.setId((Long) objects[0]);
                if (objects[1] != null)
                    dto.setTitle(objects[1].toString());
                else
                    dto.setTitle("");
                if (objects[2] != null)
                    dto.setParentID((Long) objects[2]);
                if (objects[3] != null)
                    dto.setStart((Date) objects[3]);
                if (objects[4] != null)
                    dto.setEnd((Date) objects[4]);
                if (objects[5] != null)
                    dto.setPercentComplete((Double) objects[5]);
                else
                    dto.setPercentComplete(0.0);
                if (objects[6] != null)
                    dto.setLevelId((Long) objects[6]);
                if (objects[7] != null)
                    dto.setStatus(Long.parseLong(objects[7].toString()));
                if (objects[8] != null)
                    dto.setFullname(objects[8].toString());
                else
                    dto.setFullname("");
                if (objects[9] != null)
                    dto.setPerformerId((Long) objects[9]);
                if (objects[10] != null)
                    dto.setCheckProgress((Long) objects[10]);
                if (objects[11] != null)
                    dto.setWorkItemId((Long) objects[11]);
                if (objects[12] != null)
                    dto.setType(objects[12].toString());
                if (objects[13] != null)
                    dto.setConstructionId((Long) objects[13]);
                if (objects[14] != null)
                    dto.setQuantity((Double) objects[14]);
                if (objects[15] != null)
                    dto.setTaskOrder(objects[15].toString());
                else
                    dto.setTaskOrder("");
                if (objects[16] != null)
                    dto.setWorkItemStatus(Long.parseLong(objects[16].toString()));
                if (objects[17] != null)
                    dto.setSysGroupId((Long) objects[17]);
                if (objects[18] != null)
                    dto.setCatContructionTypeId((Long) objects[18]);
                if (objects[19] != null) {
                    dto.setCatProvinceId((Long) objects[19]);
                }
                if (objects[20] != null) {
                    dto.setCatProvinceCode(objects[20].toString());
                }
                if (objects[21] != null) {
                    dto.setCatProvinceName(objects[21].toString());
                }
                if (objects[22] != null) {
                    dto.setIsInteral(objects[22].toString());
                }
                if (objects[23] != null) {
                    dto.setCompleteState(objects[23].toString());
                }
//                hoanm1_20181208_start
                if (objects[24] != null) {
                    dto.setCheckStock(objects[24].toString());
                }
//                hoanm1_20181208_end
                dto.setSummary(true);
                dto.setExpanded(true);
                lstDto.add(dto);
                i++;
            }
        }
        return lstDto;
    }

    public List<ConstructionTaskResourcesGranttDTO> getDataResources() {

        List<ConstructionTaskResourcesGranttDTO> lstDto = new ArrayList<ConstructionTaskResourcesGranttDTO>();

        StringBuilder sql = new StringBuilder("select sysUser.SYS_USER_ID userId,sysUser.FULL_NAME fullName");
        sql.append(" from SYS_USER sysUser");
        sql.append(" where sysUser.STATUS = 1");

        SQLQuery query = getSession().createSQLQuery(sql.toString()).addScalar("userId", LongType.INSTANCE)
                .addScalar("fullName", StringType.INSTANCE);

        List<Object[]> rs = query.list();
        if (rs.size() > 0) {
            for (Object[] objects : rs) {
                ConstructionTaskResourcesGranttDTO dto = new ConstructionTaskResourcesGranttDTO();
                if (objects[0] != null)
                    dto.setId((Long) objects[0]);
                if (objects[1] != null)
                    dto.setName(objects[1].toString());
                dto.setColor("#f44336");
                lstDto.add(dto);
            }

        }

        return lstDto;
    }

    public List<ConstructionTaskAssignmentsGranttDTO> getDataAssignments(GranttDTO granttSearch) {

        List<ConstructionTaskAssignmentsGranttDTO> lstDto = new ArrayList<ConstructionTaskAssignmentsGranttDTO>();

        StringBuilder sql = new StringBuilder(
                " select consTask.CONSTRUCTION_TASK_ID taskId,sysUser.SYS_USER_ID userId,consTask.COMPLETE_PERCENT completePercent");
        sql.append(" from CONSTRUCTION_TASK consTask");
        sql.append(
                " inner join DETAIL_MONTH_PLAN monthPlan on consTask.DETAIL_MONTH_PLAN_ID = monthPlan.DETAIL_MONTH_PLAN_ID");
        sql.append(" inner join SYS_USER sysUser on consTask.PERFORMER_ID = sysUser.SYS_USER_ID");
        sql.append(" where consTask.TYPE=1 and monthPlan.MONTH=:month and monthPlan.YEAR=:year");
        sql.append(" and monthPlan.SIGN_STATE=:signState");

        SQLQuery query = getSession().createSQLQuery(sql.toString()).addScalar("taskId", LongType.INSTANCE)
                .addScalar("userId", LongType.INSTANCE).addScalar("completePercent", DoubleType.INSTANCE);

        query.setParameter("month", granttSearch.getMonth());
        query.setParameter("year", granttSearch.getYear());
        query.setParameter("signState", signState);

        List<Object[]> rs = query.list();

        if (rs.size() > 0) {
            Long i = 1L;
            for (Object[] objects : rs) {
                ConstructionTaskAssignmentsGranttDTO dto = new ConstructionTaskAssignmentsGranttDTO();
                dto.setId(i);
                if (objects[0] != null)
                    dto.setTaskId((Long) objects[0]);
                if (objects[1] != null)
                    dto.setResourceId((Long) objects[1]);
                if (objects[2] != null)
                    dto.setUnits((Double) objects[2]);
                i++;

                lstDto.add(dto);
            }
        }

        return lstDto;
    }

    public int updateCompletePercent(ConstructionTaskGranttDTO dto, KttsUserSession objUser) {
        int i = 1;

        if (dto.getLevelId() == 4) {
            StringBuilder sql = new StringBuilder("update CONSTRUCTION_TASK set TASK_NAME=:taskName ");
            sql.append(" ,START_DATE=:startDate");
            sql.append(" ,END_DATE=:endDate");
            sql.append(" ,COMPLETE_PERCENT=:completePercent, status = :status");
            sql.append(",UPDATED_DATE =sysDate ");
            sql.append(",UPDATED_USER_ID =:userId ");
            sql.append(",UPDATED_GROUP_ID =:groupId ");
            sql.append(" where CONSTRUCTION_TASK_ID=:taskId");

            SQLQuery query = getSession().createSQLQuery(sql.toString());
            query.setParameter("taskName", dto.getTitle());
            if (dto.getStart() != null) {
                query.setParameter("startDate", dto.getStart());
            } else {
                Date time = new Date();
                query.setParameter("startDate", time);
            }
            if (dto.getEnd() != null) {
                query.setParameter("endDate", dto.getEnd());
            } else {
                Date time = new Date();
                query.setParameter("endDate", time);
            }
            query.setParameter("completePercent", dto.getPercentComplete());
            query.setParameter("taskId", dto.getId());
            query.setParameter("groupId", objUser.getVpsUserInfo().getSysGroupId());
            query.setParameter("userId", objUser.getVpsUserInfo().getSysUserId());
            if (dto.getPercentComplete().intValue() == 100)
                query.setParameter("status", 4);
            else
                query.setParameter("status", 2);
            i = query.executeUpdate();
            // hoanm1_20180612_start
            // cap nhat HSHC cong trinh
            if (dto.getType().equals("2") && dto.getPercentComplete().intValue() == 100) {
//            	hoanm1_20180925_start
                StringBuilder sqlConstruction = new StringBuilder(
//                		hoanm1_20181227_start
                        " update construction set COMPLETE_APPROVED_VALUE_PLAN = :quantity,APPROVE_COMPLETE_STATE=1,"
//                		hoanm1_20181227_end
                                + " APPROVE_COMPLETE_DATE = :completeDate where construction_id= :constructionId");
                SQLQuery queryConstruction = getSession().createSQLQuery(sqlConstruction.toString());
                queryConstruction.setParameter("constructionId", dto.getConstructionId());
                queryConstruction.setParameter("completeDate", new Date());
                queryConstruction.setParameter("quantity", dto.getQuantity());
//                hoanm1_20180925_end
                queryConstruction.executeUpdate();
            }
            // cap nhat doanh thu cong trinh
            // hoanm1_20180626_start
            if (dto.getType().equals("3") && dto.getPercentComplete().intValue() == 100
                    && dto.getTaskOrder().equals("2")) {
                // hoanm1_20180626_end
                StringBuilder sqlConstruction = new StringBuilder(" update construction set  "
                        + " APPROVE_REVENUE_DATE = :completeDate,APPROVE_REVENUE_STATE = 1,APPROVE_REVENUE_VALUE_PLAN = :quantity where construction_id= :constructionId");
                SQLQuery queryConstruction = getSession().createSQLQuery(sqlConstruction.toString());
                queryConstruction.setParameter("constructionId", dto.getConstructionId());
                queryConstruction.setParameter("completeDate", new Date());
                queryConstruction.setParameter("quantity", dto.getQuantity());
                queryConstruction.executeUpdate();
            }
            // hoanm1_20180612_end

            // hoanm1_20180714_start_cap nhat de nghi quyet toan doanh thu cong
            // trinh
            if (dto.getType().equals("3") && dto.getPercentComplete().intValue() == 100
                    && dto.getTaskOrder().equals("1")) {
                StringBuilder sqlConstruction = new StringBuilder(" update construction set  "
                        + " APPROVE_SETTLEMENT_VALUE = :quantity where construction_id= :constructionId");
                SQLQuery queryConstruction = getSession().createSQLQuery(sqlConstruction.toString());
                queryConstruction.setParameter("constructionId", dto.getConstructionId());
                queryConstruction.setParameter("quantity", dto.getQuantity());
                queryConstruction.executeUpdate();
            }
            // hoanm1_20180714_end

            sql = new StringBuilder(
                    "Select WORK_ITEM_ID workItemId from CONSTRUCTION_TASK where CONSTRUCTION_TASK_ID=:taskId");
            query = getSession().createSQLQuery(sql.toString());
            query.setParameter("taskId", dto.getId());
            query.addScalar("workItemId", new LongType());
            List<Long> listId = query.list();
            Long workItemId = null;
            if (listId != null && !listId.isEmpty())
                workItemId = listId.get(0);
            if (workItemId != null) {
                sql = new StringBuilder("update WORK_ITEM set status = :status where WORK_ITEM_ID = :workItemId");
                query = getSession().createSQLQuery(sql.toString());
                query.setParameter("workItemId", workItemId);
                query.setParameter("status", 2);
                query.executeUpdate();
                this.getSession().flush();
                // hoanm1_20180612_start
                // sql = new StringBuilder(
                // "Select CONSTRUCTION_ID constructionId from WORK_ITEM where WORK_ITEM_ID =
                // :workItemId");
                // query = getSession().createSQLQuery(sql.toString());
                // query.setParameter("workItemId", workItemId);
                // query.addScalar("constructionId", new LongType());
                // listId = query.list();
                // Long constructionId = null;
                // if (listId != null && !listId.isEmpty())
                // constructionId = listId.get(0);
                // if (constructionId != null) {
                // sql = new StringBuilder(
                // "UPDATE construction SET status = 5 WHERE construction_id = :constructionId
                // AND (SELECT NVL(AVG(NVL(status,0)),0)");
                // sql.append(" FROM WORK_ITEM WHERE construction_id = :constructionId) =3 ");
                // query = getSession().createSQLQuery(sql.toString());
                // query.setParameter("constructionId", constructionId);
                // query.executeUpdate();
                // }
                // hoanm1_20180612_end
            }
        }
        return i;
        // };

    }

    public int deleteGrantt(ConstructionTaskGranttDTO dto) {
        StringBuilder sql = new StringBuilder("Delete CONSTRUCTION_TASK where CONSTRUCTION_TASK_ID=:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", dto.getId());
        return query.executeUpdate();
    }

    public int createTask(ConstructionTaskGranttDTO dto) {
        StringBuilder sql = new StringBuilder("insert into CONSTRUCTION_TASK(CONSTRUCTION_TASK_ID,");
        sql.append("TASK_NAME,START_DATE,END_DATE,CONSTRUCTION_ID,WORK_ITEM_ID,PERFORMER_ID,");
        sql.append("COMPLETE_PERCENT,STATUS,TYPE,DETAIL_MONTH_PLAN_ID,PARENT_ID,");
        sql.append("LEVEL_ID");
        sql.append(" )");

        sql.append(" VALUES(CONSTRUCTION_TASK_SEQ.nextval,:taskName,:startDate,:endDate,:constructionId");
        sql.append(",:workItemId,:performerId,:completePercent,:status");
        sql.append(",:type,:detailMonthPlandId,:parentId,:levelId");
        sql.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.setParameter("taskName", dto.getTitle());
        query.setParameter("startDate", dto.getStart());
        query.setParameter("endDate", dto.getEnd());

        query.setParameter("constructionId", 1);
        query.setParameter("workItemId", 1);
        query.setParameter("performerId", 1);

        query.setParameter("completePercent", dto.getPercentComplete());
        query.setParameter("status", 2);

        query.setParameter("type", 1);
        query.setParameter("detailMonthPlandId", 100000000);
        query.setParameter("parentId", dto.getParentID());
        query.setParameter("levelId", 4);

        return query.executeUpdate();
    }

    // ###################################################################################

    public ConstructionTaskDetailDTO getConstructionTaskByProvinceCode(String catProvinceCode, String type,
                                                                       Long detailMonthPlanId) {
        // TODO Auto-generated method stub
        ConstructionTaskDetailDTO data = new ConstructionTaskDetailDTO();
        StringBuilder sql = new StringBuilder(
                " SELECT consTask.CONSTRUCTION_TASK_ID constructionTaskId, consTask.path path FROM construction_task consTask ");
        sql.append(" LEFT JOIN CAT_PROVINCE province ON province.NAME      = consTask.TASK_NAME ");
        sql.append(
                " WHERE consTask.type   = :type AND consTask.LEVEL_ID = 1 AND province.CODE     = :catProvinceCode and consTask.detail_month_plan_id = :detailMonthPlanId");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("catProvinceCode", catProvinceCode);
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.setParameter("type", type);
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("path", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        List<ConstructionTaskDetailDTO> res = query.list();
        if (res != null && !res.isEmpty())
            data = res.get(0);
        return data;
    }

    public ConstructionTaskDetailDTO getConstructionTaskByConstructionCode(String constructionCode, String type,
                                                                           Long levelId, Long detailMonthPlanId) {
        // TODO Auto-generated method stub
        ConstructionTaskDetailDTO data = new ConstructionTaskDetailDTO();
        StringBuilder sql = new StringBuilder(
                " SELECT consTask.CONSTRUCTION_TASK_ID constructionTaskId, consTask.path path FROM construction_task consTask ");
        // chinhpxn20180717_start
        sql.append(
                " WHERE consTask.type   = :type AND consTask.LEVEL_ID = :levelId AND upper(consTask.TASK_NAME)      = upper(:constructionCode) and consTask.detail_month_plan_id = :detailMonthPlanId");
        // chinhpxn20180717_end
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionCode", constructionCode);
        query.setParameter("type", type);
        query.setParameter("levelId", levelId);
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("path", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        List<ConstructionTaskDetailDTO> res = query.list();
        if (res != null && !res.isEmpty())
            data = res.get(0);
        return data;
    }

    public ConstructionTaskDetailDTO getConstructionTaskByWorkItemName(String workItemName, String type) {
        // TODO Auto-generated method stub
        ConstructionTaskDetailDTO data = new ConstructionTaskDetailDTO();
        StringBuilder sql = new StringBuilder(
                " SELECT consTask.CONSTRUCTION_TASK_ID constructionTaskId, consTask.path path FROM construction_task consTask ");
        sql.append(" LEFT JOIN WORK_ITEM work ON work.NAME      = consTask.TASK_NAME ");
        sql.append(" WHERE consTask.type   = :type AND consTask.LEVEL_ID = 3 AND work.name     = :workItemName ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("workItemName", workItemName);
        query.setParameter("type", type);
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("path", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        List<ConstructionTaskDetailDTO> res = query.list();
        if (res != null && !res.isEmpty())
            data = res.get(0);
        return data;
    }

    public List<ConstructionTaskDTO> getTaskByWorkItem(Long workItemId) {
        // TODO Auto-generated method stub
        // hoanm1_20180608_start
        StringBuilder sql = new StringBuilder(
                " SELECT catTask.cat_task_id catTaskId ,catTask.name taskName FROM cat_task catTask LEFT JOIN CAT_WORK_ITEM_TYPE catWorkItem ");
        sql.append(
                " ON catWorkItem.CAT_WORK_ITEM_TYPE_ID = catTask.CAT_WORK_ITEM_TYPE_ID LEFT JOIN work_item workItem ");
        // hoanm1_20180620_start
        sql.append(
                " ON workItem.CAT_WORK_ITEM_TYPE_ID =catWorkItem.CAT_WORK_ITEM_TYPE_ID where catTask.status=1 and workItem.WORK_ITEM_ID  =:id ");
        // hoanm1_20180620_end
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", workItemId);
        query.addScalar("taskName", new StringType());
        query.addScalar("catTaskId", new LongType());
        // hoanm1_20180608_end
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDTO.class));
        return query.list();
    }

    public void deleteByParentId(String id) {
        StringBuilder sql = new StringBuilder("DELETE FROM CONSTRUCTION_TASK  where parent_ID = :id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.executeUpdate();

    }

    public List<ConstructionTaskDetailDTO> doSearchForConsManager(ConstructionTaskDetailDTO obj,
                                                                  List<String> groupIdList) {
    	//tungtt20181129_start
    	StringBuilder sql = new StringBuilder(" select rp_hshc_id rpHshcId,to_char(dateComplete,'dd/MM/yyyy')dateComplete,sysGroupName,catStationCode,catProvinceId,receiveRecordsDate,cntContractCode cntContract,"
    			+ " round(case when completeValue is null then COMPLETEVALUE_PLAN/1000000 else completeValue/1000000 end,2) completeValue,workItemCode,"
    			 + " completeState status,catProvinceCode,performerName,supervisorName,directorName,startDate,endDate,description,constructionId,constructionCode,sysgroupid sysGroupId,round(COMPLETEVALUE_PLAN/1000000,2) completeValuePlan,COMPLETE_USER_UPDATE completeUserUpdate,"
				 + " CATSTATIONHOUSECODE catStationHouseCode, APPROVE_COMPLETE_DESCRIPTION approceCompleteDescription,DATE_COMPLETE_TC dateCompleteTC from rp_HSHC where 1=1 ");
        //tungtt20181129_end
    	 if (obj.getMonthYear() != null) {
             sql.append(" AND EXTRACT(MONTH FROM TO_DATE(dateComplete, 'DD-MON-RR')) = :month ");
             sql.append(" AND EXTRACT(YEAR FROM TO_DATE(dateComplete, 'DD-MON-RR')) = :year ");
         }
        if (!StringUtils.isNullOrEmpty(obj.getKeySearch())) {
            sql.append(" AND (upper(constructionCode) LIKE upper(:keySearch) OR  upper(catStationCode) LIKE upper(:keySearch) "
            		  + " escape '&')");
        }
        if (obj.getSysGroupId() != null) {
            sql.append(" AND sysGroupId =:sysGroupId");
        }
        if (groupIdList != null && !groupIdList.isEmpty()) {
            sql.append(" and catProvinceId in :groupIdList ");
        }
        // tuannt_15/08/2018_start
        if (obj.getCatProvinceId() != null) {
            sql.append(" AND catProvinceId = :catProvinceId ");
        }
        // tuannt_15/08/2018_start
        sql.append(" ORDER BY dateComplete DESc,sysGroupName ");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
//        hoanm1_20180906_start
        StringBuilder sqlTotalQuantity = new StringBuilder("SELECT NVL(sum(completeValue), 0) FROM (");
        sqlTotalQuantity.append(sql);
        sqlTotalQuantity.append(")");
//        hoanm1_20181218_start
        StringBuilder sqlTotalQuantityPlan = new StringBuilder("SELECT NVL(sum(completeValuePlan), 0) FROM (");
        sqlTotalQuantityPlan.append(sql);
        sqlTotalQuantityPlan.append(")");
//        hoanm1_20181218_end
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        SQLQuery queryQuantity = getSession().createSQLQuery(sqlTotalQuantity.toString());
//        hoanm1_20181218_start
        SQLQuery queryQuantityPlan = getSession().createSQLQuery(sqlTotalQuantityPlan.toString());
//        hoanm1_20181218_end
        if (groupIdList != null && !groupIdList.isEmpty()) {
            query.setParameterList("groupIdList", groupIdList);
            queryCount.setParameterList("groupIdList", groupIdList);
            queryQuantity.setParameterList("groupIdList", groupIdList);
            queryQuantityPlan.setParameterList("groupIdList", groupIdList);
        }
        if (!StringUtils.isNullOrEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryQuantity.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryQuantityPlan.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
            queryQuantity.setParameter("sysGroupId", obj.getSysGroupId());
            queryQuantityPlan.setParameter("sysGroupId", obj.getSysGroupId());
        }
        if (obj.getApproveCompleteState() != null) {
            query.setParameter("approveCompleteState", obj.getApproveCompleteState());
            queryCount.setParameter("approveCompleteState", obj.getApproveCompleteState());
            queryQuantity.setParameter("approveCompleteState", obj.getApproveCompleteState());
            queryQuantityPlan.setParameter("approveCompleteState", obj.getApproveCompleteState());
        }
        if (obj.getMonthYear() != null) {
            LocalDate localDate = obj.getMonthYear().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            int month = localDate.getMonthValue();
            int year = localDate.getYear();
            query.setParameter("month", month);
            queryCount.setParameter("month", month);
            queryQuantity.setParameter("month", month);
            queryQuantityPlan.setParameter("month", month);
            query.setParameter("year", year);
            queryCount.setParameter("year", year);
            queryQuantity.setParameter("year", year);
            queryQuantityPlan.setParameter("year", year);
        }
        // tuannt_15/08/2018_start
        if (obj.getCatProvinceId() != null) {
            query.setParameter("catProvinceId", obj.getCatProvinceId());
            queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
            queryQuantity.setParameter("catProvinceId", obj.getCatProvinceId());
            queryQuantityPlan.setParameter("catProvinceId", obj.getCatProvinceId());
        }
        // tuannt_15/08/2018_start
        query.addScalar("rpHshcId", new LongType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("description", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("supervisorName", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("cntContract", new StringType());
        query.addScalar("completeValue", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("receiveRecordsDate", new DateType());
        query.addScalar("directorName", new StringType());
        query.addScalar("dateComplete", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("workItemCode", new StringType());
        query.addScalar("sysGroupId", new LongType());
//        hoanm1_20181203_start
        query.addScalar("catStationHouseCode", new StringType());
        query.addScalar("approceCompleteDescription", new StringType());
		query.addScalar("completeValuePlan", new StringType());
        query.addScalar("completeUserUpdate", new LongType());
        query.addScalar("dateCompleteTC", new StringType());
//        hoanm1_20181203_end
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        List<ConstructionTaskDetailDTO> lst = query.list();
        if (lst.size() > 0) {
            BigDecimal totalQuantity = (BigDecimal) queryQuantity.uniqueResult();
            lst.get(0).setTotalQuantity(totalQuantity.doubleValue());
            BigDecimal totalQuantityPlan = (BigDecimal) queryQuantityPlan.uniqueResult();
            lst.get(0).setTotalPlanQuantity(totalQuantityPlan.doubleValue());
        }
        return lst;

    }

    public List<ConstructionTaskDetailDTO> doSearchForRevenue(ConstructionTaskDetailDTO obj, List<String> groupIdList) {
//        StringBuilder sql = new StringBuilder("SELECT " + "TO_CHAR(a.APPROVE_REVENUE_DATE,'dd/MM/yyyy') dateComplete, "
//                + " (SELECT name FROM sys_group SYS WHERE sys.SYS_GROUP_ID=a.SYS_GROUP_ID " + ")sysGroupName, "
//                + " cat.CODE catStationCode, "
//                + " a.CODE constructionCode, " 
//                + "(SELECT max(b.code) FROM CNT_CONSTR_WORK_ITEM_TASK cnt_task,"
//                + " CNT_CONTRACT b WHERE cnt_task.CNT_CONTRACT_ID=b.CNT_CONTRACT_ID AND b.CONTRACT_TYPE = 0" 
//                + " AND b.status !=0 and cnt_task.CONSTRUCTION_ID=a.CONSTRUCTION_ID) cntContract, "
//                + "a.APPROVE_REVENUE_VALUE_PLAN completeValue , " + "a.APPROVE_REVENUE_VALUE_PLAN consAppRevenueValue, "
//                + "a.APPROVE_REVENUE_VALUE consAppRevenueValueDB, "
//                + "a.STATUS status, " + "su.full_name approveUserName, "
//                + " nvl(a.Approve_revenue_state,1) consAppRevenueState, "
//                + " catPro.cat_province_id catProvinceId,"
//                + " catPro.CODE catProvinceCode, " + "(SELECT full_name " + " FROM " + "(SELECT su.FULL_NAME "
//                + "FROM CONSTRUCTION_TASK ct, " + "DETAIL_MONTH_PLAN dmp, " + " SYS_USER su "
//                + "WHERE ct.CONSTRUCTION_ID    =a.CONSTRUCTION_ID "
//                + "AND ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID " + "AND dmp.SIGN_STATE          = 3 "
//                + " AND dmp.status              = 1 " + " AND ct.LEVEL_ID             = 4 "
//                + " AND ct.type                 =3 " + " AND ct.PERFORMER_ID         =su.SYS_USER_ID "
//                + " ORDER BY ct.DETAIL_MONTH_PLAN_ID DESC " + " ) " + "WHERE ROWNUM <2 " + ")performerName, "
//                + "(SELECT full_name " + " FROM " + "(SELECT su.FULL_NAME " + "FROM CONSTRUCTION_TASK ct, "
//                + "DETAIL_MONTH_PLAN dmp, " + "SYS_USER su " + "WHERE ct.CONSTRUCTION_ID    =a.CONSTRUCTION_ID "
//                + " AND ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID " + "AND dmp.SIGN_STATE          = 3 "
//                + " AND dmp.status              = 1 " + " AND ct.LEVEL_ID             = 4 "
//                + "AND ct.type                 =3 " + "AND ct.SUPERVISOR_ID        =su.SYS_USER_ID "
//                + "ORDER BY ct.DETAIL_MONTH_PLAN_ID DESC " + ") " + " WHERE ROWNUM <2 " + ")supervisorName, "
//                + "(SELECT full_name " + " FROM " + "(SELECT su.FULL_NAME " + " FROM CONSTRUCTION_TASK ct, "
//                + " DETAIL_MONTH_PLAN dmp, " + "SYS_USER su " + "WHERE ct.CONSTRUCTION_ID    =a.CONSTRUCTION_ID "
//                + "AND ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID " + "AND dmp.SIGN_STATE          = 3 "
//                + "AND dmp.status              = 1 " + "AND ct.LEVEL_ID             = 4 "
//                + "AND ct.type                 =3 " + "AND ct.DIRECTOR_ID          =su.SYS_USER_ID "
//                + "ORDER BY ct.DETAIL_MONTH_PLAN_ID DESC " + ") " + "WHERE ROWNUM <2 " + ")directorName, "
//                + "(SELECT MIN(ct.START_DATE) " + " FROM CONSTRUCTION_TASK ct, " + "DETAIL_MONTH_PLAN dmp "
//                + " WHERE ct.CONSTRUCTION_ID    =a.CONSTRUCTION_ID "
//                + "AND ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID " + "AND dmp.SIGN_STATE          = 3 "
//                + " AND dmp.status             = 1 " + "AND ct.LEVEL_ID             = 4 "
//                + "AND ct.type                 =3 " + ") startDate, " + "(SELECT MAX(ct.END_DATE) "
//                + "FROM CONSTRUCTION_TASK ct, " + "DETAIL_MONTH_PLAN dmp "
//                + "WHERE ct.CONSTRUCTION_ID    =a.CONSTRUCTION_ID "
//                + "AND ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID " + "AND dmp.SIGN_STATE = 3 "
//                + "AND dmp.status              = 1 " + "AND ct.LEVEL_ID             = 4 "
//                + " AND ct.type                 =3 " + ") endDate, "
//                + "a.APPROVE_REVENUE_DESCRIPTION approveRevenueDescription, " + "a.DESCRIPTION description, "
//                + "a.CONSTRUCTION_ID constructionId " + " FROM CONSTRUCTION a " 
//                + " LEFT JOIN CAT_STATION cat ON a.CAT_STATION_ID =cat.CAT_STATION_ID "
//                + " left join SYS_USER su on su.SYS_USER_ID = a.Approve_revenue_user_id "
//                + " left join cat_province catPro on catPro.CAT_PROVINCE_ID = cat.CAT_PROVINCE_ID "
//                + "WHERE "
//                + " APPROVE_REVENUE_DATE IS NOT NULL ");
    	StringBuilder sql = new StringBuilder(" select to_char(dateComplete,'dd/MM/yyyy')dateComplete,sysGroupName,catStationCode,constructionCode,cntContractCode cntContract,completeValue,"
    			+ " case when CONSAPPREVENUESTATE =1 then CONSAPPREVENUEVALUE else CONSAPPREVENUEVALUEDB end consAppRevenueValue,consAppRevenueValueDB,"
    			  + " status, approveUserName,consAppRevenueState,catProvinceId,catProvinceCode,performerName,supervisorName,directorName,startDate,endDate,approveRevenueDescription,description,constructionId "
    			  + " from rp_revenue a where 1=1 ");
        if (!StringUtils.isNullOrEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(a.constructionCode) LIKE upper(:keySearch) OR  upper(a.catStationCode) LIKE upper(:keySearch) escape '&')");
        }
        if (obj.getSysGroupId() != null) {
            sql.append(" AND sysGroupId =:sysGroupId");
        }
        if (obj.getApproveCompleteState() != null) {
            sql.append(" AND a.consAppRevenueState = :approveCompleteState");
        }
        if (obj.getMonthYear() != null) {
            sql.append(" AND EXTRACT(MONTH FROM TO_DATE(a.dateComplete, 'DD-MON-RR')) = :month ");
            sql.append(" AND EXTRACT(YEAR FROM TO_DATE(a.dateComplete, 'DD-MON-RR')) = :year ");
        }
        if (obj.getListAppRevenueState() != null && obj.getListAppRevenueState().size() > 0) {
            sql.append(" AND a.consAppRevenueState IN (:listAppRevenueState)");
        }
        if (groupIdList != null && !groupIdList.isEmpty()) {
            sql.append(" and a.catProvinceId in :groupIdList ");
        }
        // tuannt_15/08/2018_start
        if (obj.getCatProvinceId() != null) {
            sql.append(" AND a.catProvinceId = :catProvinceId ");
        }
        // tuannt_15/08/2018_start
        sql.append(" ORDER BY a.dateComplete desc,sysGroupName");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
//        hoanm1_20181001_start
        StringBuilder sqlQuerySum = new StringBuilder("SELECT sum(completeValue) completeValueTotal, sum(consAppRevenueValue) consAppRevenueValueTotal, "
        		+ " sum(consAppRevenueValueDB )consAppRevenueValueDBTotal "
        		+ "  FROM (");
        sqlQuerySum.append(sql);
        sqlQuerySum.append(")");
//        hoanm1_20181001_end
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        SQLQuery querySum = getSession().createSQLQuery(sqlQuerySum.toString());
        if (groupIdList != null && !groupIdList.isEmpty()) {
            query.setParameterList("groupIdList", groupIdList);
            queryCount.setParameterList("groupIdList", groupIdList);
            querySum.setParameterList("groupIdList", groupIdList);
        }
        if (!StringUtils.isNullOrEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            querySum.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
            querySum.setParameter("sysGroupId", obj.getSysGroupId());
        }
        if (obj.getApproveCompleteState() != null) {
            query.setParameter("approveCompleteState", obj.getApproveCompleteState());
            queryCount.setParameter("approveCompleteState", obj.getApproveCompleteState());
            querySum.setParameter("approveCompleteState", obj.getApproveCompleteState());
        }
        if (obj.getMonthYear() != null) {
            LocalDate localDate = obj.getMonthYear().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            int month = localDate.getMonthValue();
            int year = localDate.getYear();
            query.setParameter("month", month);
            queryCount.setParameter("month", month);
            querySum.setParameter("month", month);
            query.setParameter("year", year);
            queryCount.setParameter("year", year);
            querySum.setParameter("year", year);
        }
        if (obj.getListAppRevenueState() != null && obj.getListAppRevenueState().size() > 0) {
            query.setParameterList("listAppRevenueState", obj.getListAppRevenueState());
            queryCount.setParameterList("listAppRevenueState", obj.getListAppRevenueState());
            querySum.setParameterList("listAppRevenueState", obj.getListAppRevenueState());
        }
        // tuannt_15/08/2018_start
        if (obj.getCatProvinceId() != null) {
            query.setParameter("catProvinceId", obj.getCatProvinceId());
            queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
            querySum.setParameter("catProvinceId", obj.getCatProvinceId());
        }
        // tuannt_15/08/2018_start
        query.addScalar("dateComplete", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("approveUserName", new StringType());
        query.addScalar("cntContract", new StringType());
        query.addScalar("completeValue", new StringType());
        query.addScalar("consAppRevenueValue", new DoubleType());
        query.addScalar("status", new StringType());
        query.addScalar("consAppRevenueState", new StringType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("performerName", new StringType());
        query.addScalar("supervisorName", new StringType());
        query.addScalar("directorName", new StringType());
        query.addScalar("consAppRevenueValueDB", new DoubleType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("approveRevenueDescription", new StringType());
        query.addScalar("description", new StringType());
        
        querySum.addScalar("completeValueTotal", new DoubleType());
        querySum.addScalar("consAppRevenueValueTotal", new DoubleType());
        querySum.addScalar("consAppRevenueValueDBTotal", new DoubleType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        List<ConstructionTaskDetailDTO> lst = query.list();

        if (lst.size() > 0) {
        	List<Object[]> rs = querySum.list();
        	for (Object[] objects : rs) {
        		lst.get(0).setCompleteValueTotal((Double) objects[0]);
        		lst.get(0).setConsAppRevenueValueTotal((Double) objects[1]);
            	lst.get(0).setConsAppRevenueValueDBTotal((Double) objects[2]);
        	}
        }
//		hungnx 20180713 end
        return lst;

//        return query.list();
    }

    public Long insertCompleteRevenueTaskOther(ConstructionTaskDetailDTO obj,

                                               SysUserRequest request, Long sysGroupIdCheck) {

        ConstructionTaskDetailDTO dto = new ConstructionTaskDetailDTO();
        Long month = getCurrentTimeStampMonth(obj.getStartDate());
        Long year = getCurrentTimeStampYear(obj.getStartDate());
        obj.setMonth(month);
        obj.setYear(year);
        // chinhpxn_20180711_start
        Long detailMonthPlanId = getDetailMonthPlan(month, year, sysGroupIdCheck);
        // chinhpxn_20180711_end
        if (detailMonthPlanId < 0) {
            return -1L;
        }
        // hoanm1_20180714_start_comment lai
        // if (obj.getType().equals("1")) {
        // Long getTimeConstruction = getTimeConstruction(obj, request);
        // if (getTimeConstruction < 0) {
        // return getTimeConstruction;
        // }
        // }
        // hoanm1_20180714_end_comment lai
        Long getCountConstructionId = 0L;
        // if (obj.getType().equals("1")) {
        // //chinhpxn20180711_start
        // getCountConstructionId = checkConstructionWorkItemTaskId(obj,
        // detailMonthPlanId, request, sysGroupIdCheck);
        // //chinhpxn20180711_end
        // }
        //
        // if (getCountConstructionId < 0) {
        // return -2L;
        // }
        if (obj.getType().equals("1")) {
            getCountConstructionId = checkWorkItemComplete(obj, request);
        }
        if (getCountConstructionId < 0) {
            return -5L;
        }

        // chinhpxn20180711_start
        if (obj.getType().equals("2") || obj.getType().equals("3")) {
            getCountConstructionId = checkConstructionId(obj, detailMonthPlanId, request, sysGroupIdCheck);
        }
        // chinhpxn20180711_end
        if (getCountConstructionId < 0) {
            return -3L;
        }
        if (obj.getType().equals("6")) {
            // chinhpxn20180711_start
            getCountConstructionId = checkOtherTaskId(obj, detailMonthPlanId, request, sysGroupIdCheck);
            // chinhpxn20180711_end
        }
        if (getCountConstructionId < 0) {
            return -4L;
        }
        // chinhpxn20180711_start
        getParentTask(obj, obj.getType(), detailMonthPlanId, request, sysGroupIdCheck);
        if (obj.getType().equals("6")) {
            insertTaskOtherExcute(obj, obj.getType(), detailMonthPlanId, request, sysGroupIdCheck, null);
        } else {
            insertConstructionExcute(obj, obj.getType(), detailMonthPlanId, request, sysGroupIdCheck, null);
        }
        // chinhpxn20180711_end
        if (obj.getType().equals("1")) {
            // hoanm1_20180714_start
            ConstructionTaskDetailDTO itemWorkItemLevel = new ConstructionTaskDetailDTO();
            itemWorkItemLevel = getWorkItemMobile(obj, obj.getType(), 3L, detailMonthPlanId, request, sysGroupIdCheck);
            if (itemWorkItemLevel.getConstructionTaskId() != null) {
                return -11L;
            }
            insertWorkItemExcute(obj, obj.getType(), detailMonthPlanId, request, sysGroupIdCheck, null);
            List<ConstructionTaskDetailDTO> listEntity = getListConstruction(obj);
            for (ConstructionTaskDetailDTO objTask : listEntity) {
                insertTaskExcuteTC(obj, objTask, obj.getType(), detailMonthPlanId, request, sysGroupIdCheck);
            }
            // hoanm1_20180714_end

        }
        // hoanm1_20180412_start
        String[] listPath = obj.getPath().split("/");
        String sysGroupId = listPath[1];
        if (obj.getType().equals("1")) {
            String constructionId = listPath[2];
            String workItemId = listPath[3];
            updateWorkItemConstructionTask(workItemId, constructionId);
        }
        updateSysGroupTask(sysGroupId);
        // hoanm1_20180412_end

        return 1L;
    }

    public Long insertCompleteRevenueTaskOtherTC(ConstructionTaskDetailDTO obj,

                                                 SysUserRequest request, Long sysGroupIdCheck, KttsUserSession objUser) {

        ConstructionTaskDetailDTO dto = new ConstructionTaskDetailDTO();
        Long month = getCurrentTimeStampMonth(obj.getStartDate());
        Long year = getCurrentTimeStampYear(obj.getStartDate());
        obj.setMonth(month);
        obj.setYear(year);
        Long detailMonthPlanId = getDetailMonthPlan(month, year, sysGroupIdCheck);
        if (detailMonthPlanId < 0) {
            return -1L;
        }
        Long getCountConstructionId = 0L;
//        hoanm1_20181023_start_comment
//        if (obj.getType().equals("1")) {
//            getCountConstructionId = checkWorkItemComplete(obj, request);
//        }
//        if (getCountConstructionId < 0) {
//            return -5L;
//        }
//        hoanm1_20181023_end_comment
        if (obj.getType().equals("2") || obj.getType().equals("3")) {
            getCountConstructionId = checkConstructionId(obj, detailMonthPlanId, request, sysGroupIdCheck);
        }
        if (getCountConstructionId < 0) {
            return -3L;
        }
        if (obj.getType().equals("6")) {
            getCountConstructionId = checkOtherTaskId(obj, detailMonthPlanId, request, sysGroupIdCheck);
        }
        if (getCountConstructionId < 0) {
            return -4L;
        }
//        hoanm1_20181023_start_comment
    	Double superVisorId=Double.parseDouble(getSuperVisorId(dto.getConstructionCode()));
    	Double directorId=Double.parseDouble(getDirectorId(dto.getConstructionCode()));
    	obj.setSupervisorId(superVisorId);
    	obj.setDirectorId(directorId);
//    	hoanm1_20181023_end_comment
        getParentTask(obj, obj.getType(), detailMonthPlanId, request, sysGroupIdCheck);
        if (obj.getType().equals("6")) {
            insertTaskOtherExcute(obj, obj.getType(), detailMonthPlanId, request, sysGroupIdCheck, objUser);
        } else {
            insertConstructionExcute(obj, obj.getType(), detailMonthPlanId, request, sysGroupIdCheck, objUser);
        }

        if (obj.getType().equals("1")) {
//        	hoanm1_20181023_start_comment
//            ConstructionTaskDetailDTO itemWorkItemLevel = new ConstructionTaskDetailDTO();
//            itemWorkItemLevel = getWorkItemMobile(obj, obj.getType(), 3L, detailMonthPlanId, request, sysGroupIdCheck);
//            if (itemWorkItemLevel.getConstructionTaskId() != null) {
//                return -11L;
//            }
//        	hoanm1_20181023_end_comment
            insertWorkItemExcute(obj, obj.getType(), detailMonthPlanId, request, sysGroupIdCheck, objUser);
            List<ConstructionTaskDetailDTO> listEntity = getListConstruction(obj);
            for (ConstructionTaskDetailDTO objTask : listEntity) {
                insertTaskExcuteTC(obj, objTask, obj.getType(), detailMonthPlanId, request, sysGroupIdCheck);
            }
        }
        // hoanm1_20181012_start_comment
//        String[] listPath = obj.getPath().split("/");
//        String sysGroupId = listPath[1];
//        if (obj.getType().equals("1")) {
//            String constructionId = listPath[2];
//            String workItemId = listPath[3];
//            updateWorkItemConstructionTask(workItemId, constructionId);
//        }
//        updateSysGroupTask(sysGroupId);
        // hoanm1_20181012_end_comment

        return 1L;
    }

    // hoanm1_20180412_start
    public void updateWorkItemConstructionTask(String workItemId, String constructionId) {
        // update lai hang muc trong bang construction_task
        StringBuilder sqlWorkItemTask = new StringBuilder(" UPDATE CONSTRUCTION_TASK c1 SET "
                + " c1.COMPLETE_PERCENT = ROUND((SELECT AVG(nvl(c2.COMPLETE_PERCENT,0)) FROM CONSTRUCTION_TASK c2 WHERE c2.PARENT_ID = :parentId),2),"
                + " c1.START_DATE =( SELECT min(c3.START_DATE) From CONSTRUCTION_TASK c3 WHERE c3.PARENT_ID = :parentId),"
                + " c1.END_DATE =( SELECT max(c4.END_DATE) From CONSTRUCTION_TASK c4 WHERE c4.PARENT_ID = :parentId)"
                + " Where c1.CONSTRUCTION_TASK_ID = :parentId ");
        SQLQuery queryWorkItemTask = getSession().createSQLQuery(sqlWorkItemTask.toString());
        queryWorkItemTask.setParameter("parentId", Long.parseLong(workItemId));
        queryWorkItemTask.executeUpdate();
        // update lai cong trinh trong bang construction_task
        StringBuilder sqlConstructionTask = new StringBuilder(" UPDATE CONSTRUCTION_TASK c1 SET "
                + " c1.COMPLETE_PERCENT = ROUND((SELECT AVG(nvl(c2.COMPLETE_PERCENT,0)) FROM CONSTRUCTION_TASK c2 WHERE c2.PARENT_ID = :parentId),2),"
                + " c1.START_DATE =( SELECT min(c3.START_DATE) From CONSTRUCTION_TASK c3 WHERE c3.PARENT_ID = :parentId),"
                + " c1.END_DATE =( SELECT max(c4.END_DATE) From CONSTRUCTION_TASK c4 WHERE c4.PARENT_ID = :parentId)"
                + " Where c1.CONSTRUCTION_TASK_ID = :parentId ");
        SQLQuery queryConstructionTask = getSession().createSQLQuery(sqlConstructionTask.toString());
        queryConstructionTask.setParameter("parentId", Long.parseLong(constructionId));
        queryConstructionTask.executeUpdate();

    }

    public void updateSysGroupTask(String sysGroupId) {
        // update lai chi nhanh trong bang construction_task
        StringBuilder sqlUnitTask = new StringBuilder(" UPDATE CONSTRUCTION_TASK c1 SET "
                + " c1.COMPLETE_PERCENT = ROUND((SELECT AVG(nvl(c2.COMPLETE_PERCENT,0)) FROM CONSTRUCTION_TASK c2 WHERE c2.PARENT_ID = :parentId),2),"
                + " c1.START_DATE =( SELECT min(c3.START_DATE) From CONSTRUCTION_TASK c3 WHERE c3.PARENT_ID = :parentId),"
                + " c1.END_DATE =( SELECT max(c4.END_DATE) From CONSTRUCTION_TASK c4 WHERE c4.PARENT_ID = :parentId)"
                + " Where c1.CONSTRUCTION_TASK_ID = :parentId ");
        SQLQuery queryUnitTask = getSession().createSQLQuery(sqlUnitTask.toString());
        queryUnitTask.setParameter("parentId", Long.parseLong(sysGroupId));
        queryUnitTask.executeUpdate();

    }

    // hoanm1_20180412_end

    public String getSuperVisorId(String constructionCode) {
        String sql = new String(" select a.sys_user_id superVisorId "
                + " from SYS_USER a,USER_ROLE b,SYS_ROLE  c,USER_ROLE_DATA d, DOMAIN_DATA  e, DOMAIN_TYPE g "
                + " where a.SYS_USER_ID=b.SYS_USER_ID " + " and b.SYS_ROLE_ID=c.SYS_ROLE_ID "
                + " and c.CODE='COMS_GOVERNOR'" + " and b.USER_ROLE_ID=d.USER_ROLE_ID "
                + " and d.DOMAIN_DATA_ID=e.DOMAIN_DATA_ID " + " and e.DOMAIN_TYPE_ID=g.DOMAIN_TYPE_ID "
                + " and g.code='KTTS_LIST_PROVINCE' " + " and e.data_code in( "
                + " select catP.code from  CAT_PROVINCE catP LEFT JOIN CAT_STATION catS ON catS.CAT_PROVINCE_ID = catP.CAT_PROVINCE_ID"
                // chinhpxn20180717_start
                + " LEFT JOIN CONSTRUCTION cons on cons.Cat_station_id = catS.Cat_station_id where upper(cons.code) = upper(:constructionCode)) ");
        // chinhpxn20180717_end

        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("superVisorId", new StringType());
        query.setParameter("constructionCode", constructionCode);
        List<String> lstSysUserId = query.list();
        if (lstSysUserId.size() > 0) {
            return lstSysUserId.get(0);
        }
        return "0";
    }

    public String getDirectorId(String constructionCode) {

        String sql = new String(" select a.sys_user_id directorId "
                + " from SYS_USER a,USER_ROLE b,SYS_ROLE  c,USER_ROLE_DATA d, DOMAIN_DATA  e, DOMAIN_TYPE g "
                + " where a.SYS_USER_ID=b.SYS_USER_ID " + " and b.SYS_ROLE_ID=c.SYS_ROLE_ID "
                + " and c.CODE='COMS_PGDCT' " + " and b.USER_ROLE_ID=d.USER_ROLE_ID "
                + " and d.DOMAIN_DATA_ID=e.DOMAIN_DATA_ID " + " and e.DOMAIN_TYPE_ID=g.DOMAIN_TYPE_ID "
                + " and g.code='KTTS_LIST_PROVINCE'" + " and e.data_code in( "
                + " select catP.code from  CAT_PROVINCE catP LEFT JOIN CAT_STATION catS ON catS.CAT_PROVINCE_ID = catP.CAT_PROVINCE_ID"
                // chinhpxn20180717_start
                + " LEFT JOIN CONSTRUCTION cons on cons.Cat_station_id = catS.Cat_station_id where upper(cons.code) = upper(:constructionCode)) ");
        // chinhpxn20180717_end

        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("directorId", new StringType());
        query.setParameter("constructionCode", constructionCode);
        List<String> lstSysUserId = query.list();
        if (lstSysUserId.size() > 0) {
            return lstSysUserId.get(0);
        }
        return "0";
    }

    private Long checkConstructionId(ConstructionTaskDetailDTO obj, Long detailMonthPlanId, SysUserRequest request,
                                     Long sysGroupId) {
        StringBuilder sql = new StringBuilder("select count(0) from construction_task ct ");
        sql.append(" where ct.construction_id = :constructionId and type= :type ");
        sql.append(" and ct.DETAIL_MONTH_PLAN_ID = :detailMonthPlanId ");
        sql.append(" and ct.sys_group_id = :sysGroupId and ct.PERFORMER_ID= :performerId ");
        // chinhpxn20180622_start
        if (obj.getTaskOrder() != null && obj.getType().equals("3")) {
            sql.append(" and ct.TASK_ORDER = :taskOrder ");
        }
        // chinhpxn20180622_end
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", obj.getConstructionId());
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.setParameter("type", obj.getType());
        // chinhpxn20180711_start
        // query.setParameter("sysGroupId", request.getSysGroupId());
        query.setParameter("sysGroupId", sysGroupId);
        // chinhpxn20180711_end
        query.setParameter("performerId", obj.getPerformerIdDetail());
        // chinhpxn20180622_start
        if (obj.getTaskOrder() != null && obj.getType().equals("3")) {
            query.setParameter("taskOrder", obj.getTaskOrder());
        }
        // chinhpxn20180622_end
        int result = ((BigDecimal) query.uniqueResult()).intValue();
        if (result == 0) {
            return 1L;
        }
        return -2L;
    }

    private Long checkOtherTaskId(ConstructionTaskDetailDTO obj, Long detailMonthPlanId, SysUserRequest request,
                                  Long sysGroupIdCheck) {
        String sql = new String(
                "select count(0) from construction_task ct " + "where ct.task_name = :taskName and type= :type "
                        + "and ct.DETAIL_MONTH_PLAN_ID = :detailMonthPlanId "
                        + "and ct.sys_group_id = :sysGroupId and ct.PERFORMER_ID= :performerId ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("taskName", obj.getTaskName());
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.setParameter("type", obj.getType());
        // chinhpxn20180711_start
        // query.setParameter("sysGroupId", request.getSysGroupId());
        query.setParameter("sysGroupId", sysGroupIdCheck);
        // chinhpxn20180711_end
        query.setParameter("performerId", obj.getPerformerIdDetail());
        int result = ((BigDecimal) query.uniqueResult()).intValue();
        if (result == 0) {
            return 1L;
        }
        return -2L;
    }

    private Long checkConstructionWorkItemTaskId(ConstructionTaskDetailDTO obj, Long detailMonthPlanId,
                                                 SysUserRequest request, Long sysGroupIdCheck) {
        String sql = new String(
                "select CONSTRUCTION_TASK_id constructionTaskId from CONSTRUCTION_TASK a  where a.Detail_month_plan_id = :detailMonthPlanId "
                        + " and a.sys_group_id= :sysGroupId and a.performer_id= :performerId and a.type=1 and a.work_item_id = :workItemId "
                        + " and a.LEVEL_ID =4 and a.task_name=(select name from cat_task where cat_task_id= :catTaskId)");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        // chinhpxn20180711_start
        // query.setParameter("sysGroupId", request.getSysGroupId());
        query.setParameter("sysGroupId", sysGroupIdCheck);
        // chinhpxn20180711_end
        query.setParameter("performerId", obj.getPerformerIdDetail());
        query.setParameter("catTaskId", obj.getCatTaskId());
        query.setParameter("workItemId", obj.getWorkItemId());

        query.addScalar("constructionTaskId", new LongType());
        List<Long> lstLog = query.list();
        if (lstLog != null && lstLog.size() > 0) {
            return -2L;
        }
        // int result = ((BigDecimal) query.uniqueResult()).intValue();
        // if (result == 0) {
        // return 1L;
        // }
        return 1L;
    }

    private Long checkConstructionWorkItemTaskIdTC(ConstructionTaskDetailDTO obj, ConstructionTaskDetailDTO taskName,
                                                   Long detailMonthPlanId, SysUserRequest request, Long sysGroupId) {
        String sql = new String(
                "select CONSTRUCTION_TASK_id constructionTaskId from CONSTRUCTION_TASK a  where a.Detail_month_plan_id = :detailMonthPlanId "
                        + " and a.sys_group_id= :sysGroupId and a.performer_id= :performerId and a.type=1 and a.work_item_id = :workItemId "
                        + " and a.LEVEL_ID =4 and a.task_name= :taskName");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        // query.setParameter("sysGroupId", request.getSysGroupId());
        query.setParameter("sysGroupId", sysGroupId);
        query.setParameter("performerId", obj.getPerformerIdDetail());
        query.setParameter("taskName", taskName.getTaskName());
        query.setParameter("workItemId", obj.getWorkItemId());

        query.addScalar("constructionTaskId", new LongType());
        List<Long> lstLog = query.list();
        if (lstLog != null && lstLog.size() > 0) {
            return -2L;
        }
        return 1L;
    }

    private Long checkWorkItemComplete(ConstructionTaskDetailDTO obj, SysUserRequest request) {
        String sql = new String(
                "select work_item_id workItemId from work_item where  status=3 and work_item_id = :workItemId ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("workItemId", obj.getWorkItemId());
        query.addScalar("workItemId", new LongType());
        List<Long> lstLog = query.list();
        if (lstLog != null && lstLog.size() > 0) {
            return -5L;
        }
        return 1L;
    }

    public void getParentTask(ConstructionTaskDetailDTO dto, String type, Long detailMonthPlanId,
                               SysUserRequest request, Long sysGroupId) {
        ConstructionTaskDetailDTO provinceLevel = new ConstructionTaskDetailDTO();
        if (!StringUtils.isNullOrEmpty(dto.getConstructionCode()) || !StringUtils.isNullOrEmpty(dto.getTaskName())) {
            provinceLevel = getLevel1ByConstructionCodeMobile(dto, type, 1L, detailMonthPlanId, request, sysGroupId);
            Long provinceLevelId = provinceLevel.getConstructionTaskId();
            if (provinceLevel.getConstructionTaskId() == null) {
                // provinceLevel.setType(type);
                provinceLevel.setType("1");
                provinceLevel.setTaskName(getDivisionNameBySysGroupId(sysGroupId));
                provinceLevel.setLevelId(1L);
                provinceLevel.setMonth(dto.getMonth());
                provinceLevel.setYear(dto.getYear());
                provinceLevel.setSysGroupId(sysGroupId);
                provinceLevel.setStartDate(dto.getStartDate());
                provinceLevel.setEndDate(dto.getEndDate());
                provinceLevel.setBaselineStartDate(dto.getStartDate());
                provinceLevel.setBaselineEndDate(dto.getEndDate());
                if (!type.equals("6")) {
                    provinceLevel.setConstructionId(dto.getConstructionId());
                }
                provinceLevel.setPerformerId(dto.getPerformerIdDetail());
                provinceLevel.setPerformerWorkItemId(dto.getPerformerIdDetail());
                provinceLevel.setStatus("1");
                provinceLevel.setCreatedDate(new Date());
                provinceLevel.setCreatedUserId(request.getSysUserId());
                provinceLevel.setCreatedGroupId(Long.parseLong(request.getSysGroupId()));
                provinceLevel.setDetailMonthPlanId(detailMonthPlanId);
                if (!type.equals("6")) {
//                  hoanm1_20181023_start
//                  provinceLevel.setSupervisorId(Double.parseDouble(getSuperVisorId(dto.getConstructionCode())));
//                  provinceLevel.setDirectorId(Double.parseDouble(getDirectorId(dto.getConstructionCode())));
                    provinceLevel.setSupervisorId(dto.getSupervisorId());
                    provinceLevel.setDirectorId(dto.getDirectorId());
//               	 hoanm1_20181023_end
                }
                provinceLevel.setCompleteState("1");
                ConstructionTaskBO bo = provinceLevel.toModel();
                // if (!getSession().getTransaction()
                // .isActive())
                // getSession().beginTransaction();
                provinceLevelId = this.saveObject(bo);
                // dto.setConstructionTaskId(provinceLevelId);
                dto.setParentId(provinceLevelId);
                dto.setPath("/" + provinceLevelId + "/");
                bo.setPath("/" + provinceLevelId + "/");
                bo.setConstructionTaskId(provinceLevelId);
                this.update(bo);
                this.getSession().flush();
                // if (!this.getSession().getTransaction()
                // .wasCommitted())
                // this.getSession().getTransaction().commit();
            } else {
                dto.setParentId(provinceLevelId);
                dto.setPath("/" + provinceLevelId + "/");
            }
        }
    }

    public List<ConstructionTaskDetailDTO> getListConstruction(ConstructionTaskDetailDTO obj) {

        String sql = " SELECT catTask.cat_task_id catTaskId ,catTask.name taskName FROM cat_task catTask LEFT JOIN CAT_WORK_ITEM_TYPE catWorkItem "
                + " ON catWorkItem.CAT_WORK_ITEM_TYPE_ID = catTask.CAT_WORK_ITEM_TYPE_ID LEFT JOIN work_item workItem "
                + " ON workItem.CAT_WORK_ITEM_TYPE_ID =catWorkItem.CAT_WORK_ITEM_TYPE_ID where catTask.status=1 and workItem.WORK_ITEM_ID  =:workItemId ";
        // hoanm1_20180620_start
        // hoanm1_20180608_end
        StringBuilder stringBuilder = new StringBuilder(sql);

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("taskName", new StringType());
        // hoanm1_20180608_start
        query.addScalar("catTaskId", new LongType());
        // hoanm1_20180608_end
        query.setParameter("workItemId", obj.getWorkItemId());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));

        return query.list();
    }

    public void insertConstructionExcute(ConstructionTaskDetailDTO dto, String type, Long detailMonthPlanId,
                                          SysUserRequest request, Long sysGroupId, KttsUserSession objUser) {
        ConstructionTaskDetailDTO itemConstructionLevel = new ConstructionTaskDetailDTO();
        if (!StringUtils.isNullOrEmpty(dto.getConstructionCode())) {
            itemConstructionLevel = getConstructionMobile(dto, type, 2L, detailMonthPlanId, request, sysGroupId);
            Long itemConstructionLevelId = itemConstructionLevel.getConstructionTaskId();
            if (itemConstructionLevel.getConstructionTaskId() == null) {
                itemConstructionLevel.setType(type);
                itemConstructionLevel.setConstructionId(dto.getConstructionId());
                if (type.equals("1")) {
                    itemConstructionLevel.setLevelId(2L);
                    itemConstructionLevel.setTaskName(dto.getConstructionCode());
                } else {
                    itemConstructionLevel.setLevelId(4L);
                    itemConstructionLevel.setTaskName(dto.getTaskName());
                }
//                nhantv9_20180829_start
                if (type.equals("2")) {
                    itemConstructionLevel.setQuantity(dto.getQuantity()* 1000000);
                }
//                nhantv9_20180829_end

                // chinhpxn20180622
                if (type.equals("3")) {
                    itemConstructionLevel.setTaskOrder(dto.getTaskOrder());
                    // itemConstructionLevel.setQuantity(dto.getQuantityRevenue()/1000000);
                    itemConstructionLevel.setQuantity(dto.getQuantity());
                }
                // chinhpxn20180622
//                hoanm1_20181229_start
                itemConstructionLevel.setWorkItemNameHSHC(dto.getWorkItemNameHSHC());
//                hoanm1_20181229_end
                itemConstructionLevel.setMonth(dto.getMonth());
                itemConstructionLevel.setYear(dto.getYear());
                itemConstructionLevel.setSysGroupId(sysGroupId);
                itemConstructionLevel.setStartDate(dto.getStartDate());
                itemConstructionLevel.setEndDate(dto.getEndDate());
                itemConstructionLevel.setBaselineStartDate(dto.getStartDate());
                itemConstructionLevel.setBaselineEndDate(dto.getEndDate());
                itemConstructionLevel.setPerformerId(dto.getPerformerIdDetail());
                itemConstructionLevel.setPerformerWorkItemId(dto.getPerformerIdDetail());
                itemConstructionLevel.setStatus("1");
                itemConstructionLevel.setCreatedDate(new Date());
                itemConstructionLevel.setCreatedUserId(request.getSysUserId());
                itemConstructionLevel.setCreatedGroupId(Long.parseLong(request.getSysGroupId()));
                itemConstructionLevel.setDetailMonthPlanId(detailMonthPlanId);
//              hoanm1_20181023_start
//              itemConstructionLevel.setSupervisorId(Double.parseDouble(getSuperVisorId(dto.getConstructionCode())));
//              itemConstructionLevel.setDirectorId(Double.parseDouble(getDirectorId(dto.getConstructionCode())));
                itemConstructionLevel.setSupervisorId(dto.getSupervisorId());
                itemConstructionLevel.setDirectorId(dto.getDirectorId());
//           	 hoanm1_20181023_end
                itemConstructionLevel.setParentId(dto.getParentId());
                itemConstructionLevel.setCompleteState("1");

                ConstructionTaskBO bo = itemConstructionLevel.toModel();
                // if (!getSession().getTransaction()
                // .isActive())
                // getSession().beginTransaction();
                itemConstructionLevelId = this.saveObject(bo);
                bo.setPath(dto.getPath() + itemConstructionLevelId + "/");
                dto.setParentId(itemConstructionLevelId);
                dto.setPath(bo.getPath());
                this.update(bo);
                // chinhpxn20180718_start
                if (objUser != null && !type.equals("1")) {
                    createSendSmsEmail(itemConstructionLevel, objUser);
                }
                // chinhpxn20180718_end
                this.getSession().flush();
                // if (!this.getSession().getTransaction()
                // .wasCommitted())
                // this.getSession().getTransaction().commit();
            } else {
                dto.setParentId(itemConstructionLevel.getConstructionTaskId());
                dto.setPath(itemConstructionLevel.getPath());
            }
        }
    }

    private void insertTaskOtherExcute(ConstructionTaskDetailDTO dto, String type, Long detailMonthPlanId,
                                       SysUserRequest request, Long sysGroupId, KttsUserSession objUser) {
        ConstructionTaskDetailDTO itemTaskOtherLevel = new ConstructionTaskDetailDTO();
        if (!StringUtils.isNullOrEmpty(dto.getTaskName())) {
            itemTaskOtherLevel.setType(type);
            if (dto.getConstructionId() != null) {
                itemTaskOtherLevel.setConstructionId(dto.getConstructionId());
                // chinhpxn20180711_start
                itemTaskOtherLevel.setLevelId(4L);
                // chinhpxn20180711_end
            } else {
                itemTaskOtherLevel.setLevelId(4L);
            }

            itemTaskOtherLevel.setTaskName(dto.getTaskName());

            itemTaskOtherLevel.setMonth(dto.getMonth());
            itemTaskOtherLevel.setYear(dto.getYear());
            itemTaskOtherLevel.setSysGroupId(sysGroupId);
            itemTaskOtherLevel.setStartDate(dto.getStartDate());
            itemTaskOtherLevel.setEndDate(dto.getEndDate());
            itemTaskOtherLevel.setBaselineStartDate(dto.getStartDate());
            itemTaskOtherLevel.setBaselineEndDate(dto.getEndDate());
            itemTaskOtherLevel.setPerformerId(dto.getPerformerIdDetail());
            itemTaskOtherLevel.setPerformerWorkItemId(dto.getPerformerIdDetail());
            itemTaskOtherLevel.setStatus("1");
            itemTaskOtherLevel.setCreatedDate(new Date());
            itemTaskOtherLevel.setCreatedUserId(request.getSysUserId());
            itemTaskOtherLevel.setCreatedGroupId(Long.parseLong(request.getSysGroupId()));
            itemTaskOtherLevel.setDetailMonthPlanId(detailMonthPlanId);
//          hoanm1_20181023_start
//          itemTaskLevel.setSupervisorId(Double.parseDouble(getSuperVisorId(dto.getConstructionCode())));
//          itemTaskLevel.setDirectorId(Double.parseDouble(getDirectorId(dto.getConstructionCode())));
            itemTaskOtherLevel.setSupervisorId(dto.getSupervisorId());
            itemTaskOtherLevel.setDirectorId(dto.getDirectorId());
//       	 hoanm1_20181023_end
            itemTaskOtherLevel.setParentId(dto.getParentId());
            itemTaskOtherLevel.setCompleteState("1");

            ConstructionTaskBO bo = itemTaskOtherLevel.toModel();
            // if (!getSession().getTransaction()
            // .isActive())
            // getSession().beginTransaction();
            Long itemTaskOtherLevelId = this.saveObject(bo);
            bo.setPath(dto.getPath() + itemTaskOtherLevelId + "/");
            dto.setParentId(itemTaskOtherLevelId);
            dto.setPath(bo.getPath());
            this.update(bo);
            // chinhpxn20180718_start
            if (objUser != null) {
                createSendSmsEmail(itemTaskOtherLevel, objUser);
            }
            // chinhpxn20180718_end

            this.getSession().flush();
            // if (!this.getSession().getTransaction()
            // .wasCommitted())
            // this.getSession().getTransaction().commit();
        }
    }

    private void insertWorkItemExcute(ConstructionTaskDetailDTO dto, String type, Long detailMonthPlanId,
                                      SysUserRequest request, Long sysGroupId, KttsUserSession objUser) {
        ConstructionTaskDetailDTO itemWorkItemLevel = new ConstructionTaskDetailDTO();
        if (!StringUtils.isNullOrEmpty(dto.getWorkItemName())) {
//        	hoanm1_20181023_start_comment
//            itemWorkItemLevel = getWorkItemMobile(dto, type, 3L, detailMonthPlanId, request, sysGroupId);
//            Long itemWorkItemLevelId = itemWorkItemLevel.getConstructionTaskId();
//            if (itemWorkItemLevel.getConstructionTaskId() == null) {
//        	hoanm1_20181023_end_comment
                itemWorkItemLevel.setType(type);
                itemWorkItemLevel.setConstructionId(dto.getConstructionId());
                itemWorkItemLevel.setWorkItemId(dto.getWorkItemId());
                itemWorkItemLevel.setTaskName(dto.getWorkItemName());
                itemWorkItemLevel.setLevelId(3L);
                itemWorkItemLevel.setMonth(dto.getMonth());
                itemWorkItemLevel.setYear(dto.getYear());
                itemWorkItemLevel.setQuantity(dto.getQuantity() * 1000000);
                itemWorkItemLevel.setSysGroupId(sysGroupId);
                itemWorkItemLevel.setStartDate(dto.getStartDate());
                itemWorkItemLevel.setEndDate(dto.getEndDate());
                itemWorkItemLevel.setBaselineStartDate(dto.getStartDate());
                itemWorkItemLevel.setBaselineEndDate(dto.getEndDate());
                itemWorkItemLevel.setPerformerId(dto.getPerformerIdDetail());
                itemWorkItemLevel.setPerformerWorkItemId(dto.getPerformerIdDetail());
                //VietNT_20190117_start
//              itemWorkItemLevel.setStatus("1");
                // công trình có Received_status  = 3, 
                // set construction_task.level_id = 3 (Hang muc - workitem) => status = 4
//                hoanm1_20190124_update_start
                if(dto.getReceivedStatus() !=null){
                	if(dto.getReceivedStatus() == 3){
                		itemWorkItemLevel.setStatus("3");
                	}
                }else{
                	itemWorkItemLevel.setStatus("1");
                }
//                hoanm1_20190124_update_end
//                itemWorkItemLevel.setStatus((dto.getReceivedStatus() != null && dto.getReceivedStatus() == 3) ? "3" : "1");
                //VietNT_end
                itemWorkItemLevel.setCreatedDate(new Date());
                itemWorkItemLevel.setCreatedUserId(request.getSysUserId());
                itemWorkItemLevel.setCreatedGroupId(Long.parseLong(request.getSysGroupId()));
                itemWorkItemLevel.setDetailMonthPlanId(detailMonthPlanId);
//                hoanm1_20181023_start
//                itemWorkItemLevel.setSupervisorId(Double.parseDouble(getSuperVisorId(dto.getConstructionCode())));
//                itemWorkItemLevel.setDirectorId(Double.parseDouble(getDirectorId(dto.getConstructionCode())));
                itemWorkItemLevel.setSupervisorId(dto.getSupervisorId());
                itemWorkItemLevel.setDirectorId(dto.getDirectorId());
//                hoanm1_20181023_end
                itemWorkItemLevel.setParentId(dto.getParentId());
                itemWorkItemLevel.setCompleteState("1");

                ConstructionTaskBO bo = itemWorkItemLevel.toModel();
                Long itemWorkItemLevelId = this.saveObject(bo);
                bo.setPath(dto.getPath() + itemWorkItemLevelId + "/");
                dto.setParentId(itemWorkItemLevelId);
                dto.setPath(bo.getPath());
                this.update(bo);
                // chinhpxn20180718_start
                if (objUser != null) {
                    createSendSmsEmail(itemWorkItemLevel, objUser);
                }
                // chinhpxn20180718_end
                this.getSession().flush();
                // update performerId vao WorkItem
                String sql = new String(
                        "update work_item set PERFORMER_ID = :perFormerId where work_item_id = :workItemId ");
                SQLQuery query = getSession().createSQLQuery(sql);
                query.setParameter("perFormerId", dto.getPerformerIdDetail());
                query.setParameter("workItemId", dto.getWorkItemId());
                query.executeUpdate();
//                hoanm1_20181023_start_comment
//            } else {
//                dto.setParentId(itemWorkItemLevel.getConstructionTaskId());
//                dto.setPath(itemWorkItemLevel.getPath());
//                dto.setPerformerWorkItemId(itemWorkItemLevel.getPerformerWorkItemId());
//            }
//                hoanm1_20181023_end_comment
        }
    }

    private void insertTaskExcute(ConstructionTaskDetailDTO dto, String type, Long detailMonthPlanId,
                                  SysUserRequest request, Long sysGroupId) {
        ConstructionTaskDetailDTO itemTaskLevel = new ConstructionTaskDetailDTO();
        if (!StringUtils.isNullOrEmpty(dto.getTaskName())) {
            itemTaskLevel.setType(type);
            itemTaskLevel.setWorkItemId(dto.getWorkItemId());
            // hoanm1_20180608_start
            itemTaskLevel.setCatTaskId(dto.getCatTaskId());
            // hoanm1_20180608_end
            itemTaskLevel.setTaskName(dto.getTaskName());
            // hoanm1_20180620_start
            itemTaskLevel.setCatTaskId(dto.getCatTaskId());
            // hoanm1_20180620_end
            itemTaskLevel.setLevelId(4L);
            itemTaskLevel.setMonth(dto.getMonth());
            itemTaskLevel.setYear(dto.getYear());
            itemTaskLevel.setSysGroupId(sysGroupId);
            itemTaskLevel.setStartDate(dto.getStartDate());
            itemTaskLevel.setEndDate(dto.getEndDate());
            itemTaskLevel.setBaselineStartDate(dto.getStartDate());
            itemTaskLevel.setBaselineEndDate(dto.getEndDate());
            itemTaskLevel.setPerformerId(dto.getPerformerIdDetail());
            itemTaskLevel.setPerformerWorkItemId(dto.getPerformerWorkItemId());
            itemTaskLevel.setCompletePercent(0D);
            itemTaskLevel.setStatus("1");
            itemTaskLevel.setCreatedDate(new Date());
            itemTaskLevel.setCreatedUserId(request.getSysUserId());
            itemTaskLevel.setCreatedGroupId(Long.parseLong(request.getSysGroupId()));
            itemTaskLevel.setDetailMonthPlanId(detailMonthPlanId);
            itemTaskLevel.setSupervisorId(Double.parseDouble(getSuperVisorId(dto.getConstructionCode())));
            itemTaskLevel.setDirectorId(Double.parseDouble(getDirectorId(dto.getConstructionCode())));
            itemTaskLevel.setParentId(dto.getParentId());
            itemTaskLevel.setCompleteState("1");
            itemTaskLevel.setConstructionId(dto.getConstructionId());
            ConstructionTaskBO bo = itemTaskLevel.toModel();
            Long itemTaskLevelId = this.saveObject(bo);
            bo.setPath(dto.getPath() + itemTaskLevelId + "/");
            // hoanm1_20180412_start
            dto.setPath(bo.getPath());
            // hoanm1_20180412_end
            this.update(bo);
            this.getSession().flush();
        }
    }

    private void insertTaskExcuteTC(ConstructionTaskDetailDTO dto, ConstructionTaskDetailDTO taskName, String type,
                                    Long detailMonthPlanId, SysUserRequest request, Long sysGroupId) {
        ConstructionTaskDetailDTO itemTaskLevel = new ConstructionTaskDetailDTO();
        if (!StringUtils.isNullOrEmpty(taskName.getTaskName())) {
//          hoanm1_20181023_start_comment
//            Long itemTaskLevelExist = checkConstructionWorkItemTaskIdTC(dto, taskName, detailMonthPlanId, request,
//                    sysGroupId);
//            if (itemTaskLevelExist == 1L) {
//        	hoanm1_20181023_end_comment
                itemTaskLevel.setType(type);
                itemTaskLevel.setWorkItemId(dto.getWorkItemId());
                // hoanm1_20180608_start
                itemTaskLevel.setCatTaskId(taskName.getCatTaskId());
                // hoanm1_20180608_end
                itemTaskLevel.setTaskName(taskName.getTaskName());
                itemTaskLevel.setLevelId(4L);
                itemTaskLevel.setMonth(dto.getMonth());
                itemTaskLevel.setYear(dto.getYear());
                itemTaskLevel.setSysGroupId(sysGroupId);
                itemTaskLevel.setStartDate(dto.getStartDate());
                itemTaskLevel.setEndDate(dto.getEndDate());
                itemTaskLevel.setBaselineStartDate(dto.getStartDate());
                itemTaskLevel.setBaselineEndDate(dto.getEndDate());
                itemTaskLevel.setPerformerId(dto.getPerformerIdDetail());
                itemTaskLevel.setPerformerWorkItemId(dto.getPerformerIdDetail());
                itemTaskLevel.setCompletePercent(0D);
                //VietNT_20190117_start
//              itemTaskLevel.setStatus("1");
                // công trình có Received_status  = 3, 
                // set construction_task.level_id = 4(Cong viec - taslk) => status = 3
//              hoanm1_20190124_update_start
                if(dto.getReceivedStatus() !=null){
                	if(dto.getReceivedStatus() == 3){
                		itemTaskLevel.setStatus("3");
                	}
                }else{
                	itemTaskLevel.setStatus("1");
                }
//              hoanm1_20190124_update_end
//                itemTaskLevel.setStatus((dto.getReceivedStatus() != null && dto.getReceivedStatus() == 3) ? "3" : "1");
                //VietNT_end
                // với mức công việc của công trình construction_task.level_id = 4 thì cập nhật status = 3
                itemTaskLevel.setCreatedDate(new Date());
                itemTaskLevel.setCreatedUserId(request.getSysUserId());
                itemTaskLevel.setCreatedGroupId(Long.parseLong(request.getSysGroupId()));
                itemTaskLevel.setDetailMonthPlanId(detailMonthPlanId);
//              hoanm1_20181023_start
//                itemTaskLevel.setSupervisorId(Double.parseDouble(getSuperVisorId(dto.getConstructionCode())));
//                itemTaskLevel.setDirectorId(Double.parseDouble(getDirectorId(dto.getConstructionCode())));
                itemTaskLevel.setSupervisorId(dto.getSupervisorId());
                itemTaskLevel.setDirectorId(dto.getDirectorId());
//              hoanm1_20181023_end
                itemTaskLevel.setParentId(dto.getParentId());
                itemTaskLevel.setCompleteState("1");
                itemTaskLevel.setConstructionId(dto.getConstructionId());
                ConstructionTaskBO bo = itemTaskLevel.toModel();
                Long itemTaskLevelId = this.saveObject(bo);
                bo.setPath(dto.getPath() + itemTaskLevelId + "/");
                this.update(bo);
                this.getSession().flush();
//            }
        }
    }

    public static Long getCurrentTimeStampMonth(Date date) {
        SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");// dd/MM/yyyy
        String strDate = sdfDate.format(date);
        String res = strDate.substring(5, 7);
        return Long.parseLong(res);
    }

    public static Long getCurrentTimeStampYear(Date date) {
        SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");// dd/MM/yyyy
        String strDate = sdfDate.format(date);
        String res = strDate.substring(0, 4);
        return Long.parseLong(res);
    }

    public long getDetailMonthPlan(Long month, Long year, Long sysGroupId) {
        String sql = new String("SELECT dtmp.Detail_month_plan_id detailMonthPlanId FROM detail_month_plan dtmp "
                + "where dtmp.Month = :month and dtmp.Year = :year and sign_state = 3 and status = 1 and SYS_GROUP_ID = :sysGroupId ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("month", month);
        query.setParameter("year", year);
        // chinhpxn20180711_start
        query.setParameter("sysGroupId", sysGroupId);
        // chinhpxn20180711_end
        query.addScalar("detailMonthPlanId", new LongType());
        List<Long> lstDetailMonthPlanId = query.list();

        if (lstDetailMonthPlanId != null && lstDetailMonthPlanId.size() > 0) {
            return lstDetailMonthPlanId.get(0);
        }

        return -1;
    }

    // hoanm1_20180412_start
    public long getTimeConstruction(ConstructionTaskDetailDTO obj, SysUserRequest request) {
        String sql = new String(
                " select a.STARTING_DATE startDate,a.EXCPECTED_COMPLETE_DATE endDate from CONSTRUCTION a where status != 0 and code = :constructionCode ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("constructionCode", obj.getConstructionCode());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        List<ConstructionTaskDetailDTO> lstTimeConstruction = query.list();

        if (lstTimeConstruction != null && lstTimeConstruction.size() > 0) {
            if (lstTimeConstruction.get(0).getStartDate() != null) {
                if (obj.getStartDate().compareTo(lstTimeConstruction.get(0).getStartDate()) < 0) {
                    return -7;
                }
            }
            if (lstTimeConstruction.get(0).getEndDate() != null) {
                if (obj.getEndDate().compareTo(lstTimeConstruction.get(0).getEndDate()) > 0) {
                    return -8;
                }
            }
        }

        return 1;
    }

    // hoanm1_20180412_end
    // hoanm1_20180522_start
    public long getQuantityItem(ConstructionTaskDetailDTO dto, String type, Long detailMonthPlanId,
                                SysUserRequest request) {
        ConstructionTaskDetailDTO itemWorkItemLevel = new ConstructionTaskDetailDTO();
        if (!StringUtils.isNullOrEmpty(dto.getWorkItemName())) {
            itemWorkItemLevel = getWorkItemMobile(dto, type, 3L, detailMonthPlanId, request,
                    Long.parseLong(request.getSysGroupId()));
            if (itemWorkItemLevel.getConstructionTaskId() == null) {
                String sql = new String(" select EXPECT_QUANTITY from work_item a where work_item_id = :workItemId ");
                SQLQuery query = getSession().createSQLQuery(sql);
                query.setParameter("workItemId", dto.getWorkItemId());
                List<Double> lstQuantity = query.list();
                // if (lstQuantity.get(0) == null || lstQuantity.get(0) == 0) {
                if (lstQuantity.get(0) == null) {
                    return -10L;
                }
            }
        }

        return 1;
    }

    // hoanm1_20180522_end

    public ConstructionTaskDetailDTO getLevel1ByConstructionCode(String constructionCode, String type, Long levelId,
                                                                 Long detailMonthPlanId) {
        // TODO Auto-generated method stub
        ConstructionTaskDetailDTO data = new ConstructionTaskDetailDTO();
        StringBuilder sql = new StringBuilder(
                " SELECT consTask.CONSTRUCTION_TASK_ID constructionTaskId,  consTask.path path FROM construction_task consTask where consTask.TYPE                =:type ");
        sql.append(
                " AND consTask.DETAIL_MONTH_PLAN_ID = :detailMonthPlanId AND consTask.LEVEL_ID            = :levelId and consTask.TASK_NAME = (  ");
        sql.append(
                " SELECT cgp.SYS_GROUP_NAME sysGroupName FROM CONFIG_GROUP_PROVINCE cgp left join CAT_PROVINCE catP on catP.CAT_PROVINCE_ID = cgp.CAT_PROVINCE_ID LEFT JOIN CAT_STATION catS ON catS.CAT_PROVINCE_ID = catP.CAT_PROVINCE_ID LEFT JOIN CONSTRUCTION cons on cons.Cat_station_id = catS.Cat_station_id where cons.code = :constructionCode)");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionCode", constructionCode);
        query.setParameter("type", type);
        query.setParameter("levelId", levelId);
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("path", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        List<ConstructionTaskDetailDTO> res = query.list();
        if (res != null && !res.isEmpty())
            data = res.get(0);
        return data;
    }

    // chinhpxn20180711_start
    public ConstructionTaskDetailDTO getLevel1ByConstructionCodeMobile(ConstructionTaskDetailDTO dto, String type,
                                                                       Long levelId, Long detailMonthPlanId, SysUserRequest request, Long sysGroupId) {
        // TODO Auto-generated method stub
        // chinhpxn20180711_end
        ConstructionTaskDetailDTO data = new ConstructionTaskDetailDTO();
        StringBuilder sql = new StringBuilder(
                " SELECT consTask.CONSTRUCTION_TASK_ID constructionTaskId,  consTask.path path FROM construction_task consTask where ");
        sql.append(
                " consTask.DETAIL_MONTH_PLAN_ID = :detailMonthPlanId AND consTask.LEVEL_ID = :levelId and consTask.TASK_NAME = (  ");
        sql.append(" select name from sys_group where sys_group_id= :sysGroupId)");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        // chinhpxn20180711_start
        query.setParameter("sysGroupId", sysGroupId);
        // chinhpxn20180711_end
        // query.setParameter("performerId", dto.getPerformerIdDetail());
        // query.setParameter("type", type);
        query.setParameter("levelId", levelId);
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("path", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        List<ConstructionTaskDetailDTO> res = query.list();
        if (res != null && !res.isEmpty())
            data = res.get(0);
        return data;
    }

    public ConstructionTaskDetailDTO getConstructionMobile(ConstructionTaskDetailDTO dto, String type, Long levelId,
                                                           Long detailMonthPlanId, SysUserRequest request, Long sysGroupId) {
        ConstructionTaskDetailDTO data = new ConstructionTaskDetailDTO();
        StringBuilder sql = new StringBuilder(
                " SELECT consTask.CONSTRUCTION_TASK_ID constructionTaskId,  consTask.path path FROM construction_task consTask where consTask.TYPE = :type ");
        sql.append(
                " AND consTask.DETAIL_MONTH_PLAN_ID = :detailMonthPlanId AND consTask.LEVEL_ID = :levelId and consTask.CONSTRUCTION_ID = :constructionId ");
        if (!type.equals("1")) {
            sql.append(" and consTask.sys_group_id = :sysGroupId and consTask.PERFORMER_ID= :performerId ");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", dto.getConstructionId());
        query.setParameter("type", type);
        query.setParameter("levelId", levelId);
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        if (!type.equals("1")) {
            // query.setParameter("sysGroupId", request.getSysGroupId());
            // chinhpxn20180711_start
            query.setParameter("sysGroupId", sysGroupId);
            // chinhpxn20180711_end
            query.setParameter("performerId", dto.getPerformerIdDetail());
        }
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("path", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        List<ConstructionTaskDetailDTO> res = query.list();
        if (res != null && !res.isEmpty())
            data = res.get(0);
        return data;
    }

    public ConstructionTaskDetailDTO getWorkItemMobile(ConstructionTaskDetailDTO dto, String type, Long levelId,
                                                       Long detailMonthPlanId, SysUserRequest request, Long sysGroupId) {
        // TODO Auto-generated method stub
        ConstructionTaskDetailDTO data = new ConstructionTaskDetailDTO();
        StringBuilder sql = new StringBuilder(
                " SELECT consTask.CONSTRUCTION_TASK_ID constructionTaskId,  consTask.path path,consTask.PERFORMER_WORK_ITEM_ID performerWorkItemId FROM construction_task consTask where consTask.TYPE = :type ");
        sql.append(
                " AND consTask.DETAIL_MONTH_PLAN_ID = :detailMonthPlanId AND consTask.LEVEL_ID = :levelId and consTask.WORK_ITEM_ID = :workItemId ");
        sql.append(" and consTask.sys_group_id = :sysGroupId ");
        // + "and consTask.PERFORMER_WORK_ITEM_ID= :performerId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("workItemId", dto.getWorkItemId());
        query.setParameter("sysGroupId", sysGroupId);
        // query.setParameter("performerId", dto.getPerformerIdDetail());
        query.setParameter("type", type);
        query.setParameter("levelId", levelId);
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("path", new StringType());
        // hoanm1_20180619_start
        query.addScalar("performerWorkItemId", new LongType());
        // hoanm1_20180619_end
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        List<ConstructionTaskDetailDTO> res = query.list();
        if (res != null && !res.isEmpty())
            data = res.get(0);
        return data;
    }

    public String getDivisionCodeByConstructionCode(String constructionCode) {
        // TODO Auto-generated method stub
        String re = null;
        StringBuilder sql = new StringBuilder(
                "SELECT cgp.SYS_GROUP_NAME sysGroupName FROM CONFIG_GROUP_PROVINCE cgp left join CAT_PROVINCE pro on pro.CAT_PROVINCE_ID = cgp.CAT_PROVINCE_ID");
        sql.append(
                " LEFT JOIN CAT_STATION catS ON pro.CAT_PROVINCE_ID =catS.CAT_PROVINCE_ID LEFT JOIN CONSTRUCTION cons ");
        sql.append(" ON cons.CAT_STATION_ID = catS.CAT_STATION_ID WHERE cons.code        = :constructionCode ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionCode", constructionCode);
        query.addScalar("sysGroupName", new StringType());
        List<String> res = query.list();
        if (res != null && !res.isEmpty())
            re = res.get(0);
        return re;
    }

    public String getDivisionNameBySysGroupId(Long sysGroupId) {
        // TODO Auto-generated method stub
        String re = null;
        StringBuilder sql = new StringBuilder(
                "select name sysGroupName from sys_group where sys_group_id= :sysGroupId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("sysGroupId", sysGroupId);
        query.addScalar("sysGroupName", new StringType());
        List<String> res = query.list();
        if (res != null && !res.isEmpty())
            re = res.get(0);
        return re;
    }

    public String getDivisionNameByProvinceCode(String catProvinceCode) {
        // TODO Auto-generated method stub
        String re = null;
        StringBuilder sql = new StringBuilder(
                " select cgp.SYS_GROUP_NAME sysGroupName from config_group_province cgp left join CAT_PROVINCE cp on cp.CAT_PROVINCE_ID = cgp.CAT_PROVINCE_ID where cp.CODE = :code ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("code", catProvinceCode);
        query.addScalar("sysGroupName", new StringType());
        List<String> res = query.list();
        if (res != null && !res.isEmpty())
            re = res.get(0);
        return re;
    }

    // ########################Thi cong############################

    public List<ConstructionTaskGranttDTO> getDataConstructionGrantt(GranttDTO granttSearch) {

        List<ConstructionTaskGranttDTO> lstDto = new ArrayList<ConstructionTaskGranttDTO>();
        StringBuilder select = new StringBuilder();
        select.append(" consTask.CONSTRUCTION_TASK_ID taskID");
        // hoanm1_20180114_start
        // select.append(" ,consTask.TASK_NAME taskName,consTask.PARENT_ID
        // taskParentID,case when consTask.level_id= 2 then cons.STARTING_DATE else
        // consTask.START_DATE end startDate,");
        // select.append(" case when consTask.level_id= 2 then
        // cons.EXCPECTED_COMPLETE_DATE else consTask.END_DATE end
        // endDate,consTask.COMPLETE_PERCENT comPlete");
        select.append(" ,consTask.TASK_NAME taskName,consTask.PARENT_ID taskParentID,consTask.START_DATE startDate,");
        select.append(" consTask.END_DATE endDate,consTask.COMPLETE_PERCENT comPlete");
        // hoanm1_20180114_end
        select.append(" ,consTask.LEVEL_ID levelId");
        select.append(" ,sysuser.FULL_NAME fullname");
        select.append(" ,consTask.complete_state checkProgress ");
        // hoanm1_20180612_start
        select.append(" ,consTask.Work_Item_id workItemId ");
        select.append(" ,consTask.type type,consTask.CONSTRUCTION_ID constructionId,consTask.quantity quantity ");
        select.append(" ,consTask.task_order taskOrder");
        // chinhpxn20180719_start
        select.append(" ,consTask.PERFORMER_ID performerId");
        select.append(" ,wi.STATUS workItemStatus ");
        // chinhpxn20180719_end
        // hoanm1_20180612_end
        select.append(" from CONSTRUCTION_TASK consTask ");
        select.append(
                " inner join detail_month_plan dt on consTask.detail_month_plan_id=dt.detail_month_plan_id and dt.status=1 and dt.sign_state=3 ");
        select.append(" left join CONSTRUCTION cons on consTask.CONSTRUCTION_ID = cons.CONSTRUCTION_ID ");
        select.append(" left join SYS_USER sysuser on consTask.PERFORMER_ID = sysuser.SYS_USER_ID ");
        select.append(" left join WORK_ITEM wi on consTask.WORK_ITEM_ID = wi.WORK_ITEM_ID ");
        select.append(" where consTask.TYPE in  (1,2,3,6) and  consTask.level_id!=1  ");
        if (granttSearch.getId() != null) {
            select.append(" and cons.CONSTRUCTION_ID=:id ");
        }
        StringBuilder sql = new StringBuilder("");

        if (!StringUtils.isNullOrEmpty(granttSearch.getKeySearch())) {
            sql.append("with parent as(select DISTINCT ");
            sql.append(select.toString());
            sql.append(
                    " start with ((UPPER(consTask.TASK_NAME) LIKE :keySearch OR UPPER(sysuser.FULL_NAME) LIKE :keySearch OR UPPER(sysuser.EMAIL) LIKE :keysearch escape '&') )");
            if ((granttSearch.getComplete_state() != null || granttSearch.getStatus() != null)
                    && (granttSearch.getComplete_state() == 2) || granttSearch.getStatus() == 1
                    || granttSearch.getStatus() == 3) {
                if (granttSearch.getStatus() != null
                        && (granttSearch.getStatus() == 1 || granttSearch.getStatus() == 3)) {
                    sql.append("  and consTask.status= :status");
                }

                if (granttSearch.getComplete_state() != null && granttSearch.getComplete_state() == 2) {
                    sql.append(" and consTask.COMPLETE_STATE= :complete_state");
                }

            }
            sql.append(" connect by prior consTask.PARENT_ID= consTask.CONSTRUCTION_TASK_ID), ");
            sql.append(" child as( select ");
            sql.append(select.toString());
            sql.append(
                    " start with ((UPPER(consTask.TASK_NAME) LIKE :keySearch OR UPPER(sysuser.FULL_NAME) LIKE :keySearch OR UPPER(sysuser.EMAIL) LIKE :keysearch escape '&') )");
            if (granttSearch.getComplete_state() != null || granttSearch.getStatus() != null) {
                if (granttSearch.getStatus() != null
                        && (granttSearch.getStatus() == 1 || granttSearch.getStatus() == 3)) {
                    sql.append("  and consTask.status= :status");
                }

                if (granttSearch.getComplete_state() != null && granttSearch.getComplete_state() == 2) {
                    sql.append(" and consTask.COMPLETE_STATE= :complete_state");
                }

            }
            sql.append(" connect by prior consTask.CONSTRUCTION_TASK_ID= consTask.PARENT_ID) ");
            sql.append(" select * from parent union select * from child ");

        } else {
            sql.append("with tbl as (select distinct ");
            sql.append(select.toString());

            if (granttSearch.getComplete_state() != null || granttSearch.getStatus() != null) {
                sql.append(" START WITH level_id=4 ");
                if (granttSearch.getStatus() != null
                        && (granttSearch.getStatus() == 1 || granttSearch.getStatus() == 3)) {
                    sql.append("  and consTask.status= :status");
                }

                if (granttSearch.getComplete_state() != null && granttSearch.getComplete_state() == 2) {
                    sql.append(" and consTask.COMPLETE_STATE= :complete_state");
                }

                sql.append(" CONNECT BY prior consTask.parent_id= consTask.CONSTRUCTION_TASK_ID)");
            } else {
                sql.append(
                        " start with consTask.parent_id is null  connect by prior consTask.CONSTRUCTION_TASK_ID= consTask.parent_id)");
            }

            sql.append(" select * from tbl ORDER BY TYPE, startDate");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString()).addScalar("taskID", LongType.INSTANCE)
                .addScalar("taskName", StringType.INSTANCE).addScalar("taskParentID", LongType.INSTANCE)
                .addScalar("startDate", DateType.INSTANCE).addScalar("endDate", DateType.INSTANCE)
                .addScalar("comPlete", DoubleType.INSTANCE).addScalar("levelId", LongType.INSTANCE)
                .addScalar("fullname", StringType.INSTANCE).addScalar("checkProgress", LongType.INSTANCE)
                // hoanm1_20180612_start
                .addScalar("workItemId", LongType.INSTANCE).addScalar("type", StringType.INSTANCE)
                .addScalar("constructionId", LongType.INSTANCE).addScalar("quantity", DoubleType.INSTANCE)
                .addScalar("taskOrder", StringType.INSTANCE)
                // hoanm1_20180612_end;
                // chinhpxn20180719_start
                .addScalar("performerId", LongType.INSTANCE).addScalar("workItemStatus", LongType.INSTANCE);
        // chinhpxn20180719_end
        if (granttSearch.getId() != null) {
            query.setParameter("id", granttSearch.getId());
        }
        if (granttSearch.getStatus() != null) {
            query.setParameter("status", granttSearch.getStatus());
        }
        if (granttSearch.getComplete_state() != null) {
            query.setParameter("complete_state", granttSearch.getComplete_state());
        }
        if (!com.viettel.service.base.utils.StringUtils.isNullOrEmpty(granttSearch.getKeySearch()))
            query.setParameter("keySearch", "%" + granttSearch.getKeySearch().toUpperCase().trim() + "%");

        List<Object[]> rs = query.list();

        if (rs.size() > 0) {
            Long i = 0L;
            for (Object[] objects : rs) {
                ConstructionTaskGranttDTO dto = new ConstructionTaskGranttDTO();
                dto.setOrderID(i);
                if (objects[0] != null)
                    dto.setId((Long) objects[0]);
                if (objects[1] != null)
                    dto.setTitle(objects[1].toString());
                else
                    dto.setTitle("");
                if (objects[2] != null)
                    dto.setParentID((Long) objects[2]);
                if (objects[3] != null)
                    dto.setStart((Date) objects[3]);
                if (objects[4] != null)
                    dto.setEnd((Date) objects[4]);
                if (objects[5] != null)
                    dto.setPercentComplete((Double) objects[5]);
                else
                    dto.setPercentComplete(0d);
                if (objects[6] != null)
                    dto.setLevelId((Long) objects[6]);
                if (objects[7] != null)
                    dto.setFullname(objects[7].toString());
                else
                    dto.setFullname("");
                if (objects[8] != null)
                    dto.setCheckProgress((Long) objects[8]);

                // hoanm1_20180612_start
                if (objects[9] != null)
                    dto.setWorkItemId((Long) objects[9]);
                if (objects[10] != null)
                    dto.setType(objects[10].toString());
                if (objects[11] != null)
                    dto.setConstructionId((Long) objects[11]);
                if (objects[12] != null)
                    dto.setQuantity((Double) objects[12]);
                if (objects[13] != null)
                    dto.setTaskOrder(objects[13].toString());
                // chinhpxn20180719_start
                if (objects[14] != null) {
                    dto.setPerformerId((Long) objects[14]);
                }
                if (objects[15] != null) {
                    dto.setWorkItemStatus((Long) objects[15]);
                }
                // chinhpxn20180719_end
                else
                    dto.setTaskOrder("");
                // hoanm1_20180612_end
                dto.setSummary(true);
                dto.setExpanded(true);
                lstDto.add(dto);
                i++;
            }
        }

        return lstDto;
    }

    // ############################################################
    public ConstructionTaskDetailDTO getLevel1BySysGroupId(Long sysGroupId, String type, Long detailMonthPlanId) {
        // TODO Auto-generated method stub
        ConstructionTaskDetailDTO data = new ConstructionTaskDetailDTO();
        StringBuilder sql = new StringBuilder(
                " SELECT consTask.CONSTRUCTION_TASK_ID constructionTaskId,  consTask.path path FROM construction_task consTask where consTask.TYPE                =:type ");
        sql.append(
                " AND consTask.DETAIL_MONTH_PLAN_ID = :detailMonthPlanId AND consTask.LEVEL_ID            = 1 and consTask.SYS_GROUP_ID =:id  ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("type", type);
        query.setParameter("id", sysGroupId);
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("path", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        List<ConstructionTaskDetailDTO> res = query.list();
        if (res != null && !res.isEmpty())
            data = res.get(0);
        return data;
    }

    public String getDivisionCodeSysGroupId(Long sysGroupId) {
        // TODO Auto-generated method stub
        String re = null;
        StringBuilder sql = new StringBuilder(
                " SELECT sys.name sysGroupName FROM SYS_GROUP sys where  sys.SYS_GROUP_ID = :sysGroupId  ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("sysGroupId", sysGroupId);
        query.addScalar("sysGroupName", new StringType());
        List<String> res = query.list();
        if (res != null && !res.isEmpty())
            re = res.get(0);
        return re;
    }

    public void deleteConstructionTask(String type, Long levelId, Long detailMonthPlanId) {
        StringBuilder sql = new StringBuilder(
                " delete CONSTRUCTION_TASK where   type=:type and DETAIL_MONTH_PLAN_ID =:detailMonthPlanId and level_id  =:levelId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("type", type);
        query.setParameter("levelId", levelId);
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.executeUpdate();

    }

    public void deleteConstructionTaskByType(String type, Long detailMonthPlanId) {
        StringBuilder sql = new StringBuilder(
                // chinhpxn20180711_start
                " delete from CONSTRUCTION_TASK where   type=:type and DETAIL_MONTH_PLAN_ID =:detailMonthPlanId and nvl(level_id,0) !=1 ");
        // chinhpxn20180711_end
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("type", type);
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.executeUpdate();

    }

    public void deleteParentAndChild(String id) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "select parent_ID parentId from CONSTRUCTION_TASK where CONSTRUCTION_TASK_id=:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("parentId", new LongType());
        List<Long> parList = query.list();
        Long parentId = null;
        if (parList != null && !parList.isEmpty())
            parentId = parList.get(0);
        sql = new StringBuilder("delete from CONSTRUCTION_TASK where CONSTRUCTION_TASK_id=:id ");
        query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.executeUpdate();
        if (parentId != null) {
            sql = new StringBuilder("select parent_ID parentId from CONSTRUCTION_TASK where CONSTRUCTION_TASK_id=:id");
            query = getSession().createSQLQuery(sql.toString());
            query.setParameter("id", parentId);
            query.addScalar("parentId", new LongType());
            parList = query.list();
            Long parentOfParId = null;
            if (parList != null && !parList.isEmpty())
                parentOfParId = parList.get(0);
            if (parentOfParId != null) {
                sql = new StringBuilder(
                        "DELETE FROM CONSTRUCTION_TASK WHERE  CONSTRUCTION_TASK_id  = :id and not EXISTS (select CONSTRUCTION_TASK_id from CONSTRUCTION_TASK where parent_ID= :id and CONSTRUCTION_TASK_id!=:childId) ");
                query = getSession().createSQLQuery(sql.toString());
                query.setParameter("childId", parentId);
                query.setParameter("id", parentOfParId);
                query.executeUpdate();
            }

            sql = new StringBuilder(
                    "DELETE FROM CONSTRUCTION_TASK WHERE  CONSTRUCTION_TASK_id  = :id and not EXISTS (select CONSTRUCTION_TASK_id from CONSTRUCTION_TASK where parent_ID= :id and CONSTRUCTION_TASK_id!=:childId) ");
            query = getSession().createSQLQuery(sql.toString());
            query.setParameter("childId", id);
            query.setParameter("id", parentId);
            query.executeUpdate();

        }

    }

    // public void removeCompleteByListId(List<Long> listTaskId) {
    // StringBuilder sql = new StringBuilder();
    // sql.append(" UPDATE CONSTRUCTION_TASK");
    // sql.append(" SET COMPLETE_PERCENT = 0,");
    // sql.append(" STATUS = 2");
    // sql.append(" WHERE CONSTRUCTION_TASK_ID in :listId");
    // SQLQuery query = getSession().createSQLQuery(sql.toString());
    // query.setParameterList("listId", listTaskId);
    // query.executeUpdate();
    // }

    public void removeCompleteConstructionListId(List<String> listCode,Long sysUserId) {
        StringBuilder sql = new StringBuilder();
        sql.append(" UPDATE CONSTRUCTION");
        sql.append(" 	SET COMPLETE_APPROVED_UPDATE_DATE=SYSDATE,");
//        sql.append(" 		HC.APPROVE_COMPLETE_DESCRIPTION=:approveDescription, ");
        sql.append(" 	COMPLETE_APPROVED_USER_ID=:sysUserId ");
        sql.append(" WHERE  CONSTRUCTION_ID in :listCode");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameterList("listCode", listCode);
        query.setParameter("sysUserId", sysUserId);
//        query.setParameter("approveDescription", approveDescription);
        query.executeUpdate();
    }
    //hungtd_20181103_start
    public void removeCompleteRpHSHCListId(List<String> listCode,Long sysUserId) {
        StringBuilder sql = new StringBuilder();
        sql.append(" UPDATE RP_HSHC HC");
        sql.append(" 	SET HC.COMPLETEVALUE=0, ");
        sql.append(" 		HC.COMPLETESTATE=3, ");
        sql.append(" 		HC.COMPLETE_USER_UPDATE=:sysUserId, ");
//        sql.append(" 		HC.APPROVE_COMPLETE_DESCRIPTION=:approveDescription, ");
        sql.append(" 		HC.COMPLETE_UPDATE_DATE=SYSDATE ");
        sql.append(" WHERE  HC.CONSTRUCTIONID in :listCode");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameterList("listCode", listCode);
        query.setParameter("sysUserId", sysUserId);
//        query.setParameter("approveDescription", approveDescription);
        query.executeUpdate();
    }
  //hungtd_20181103_end
    public void removeHSHC(ConstructionDetailDTO dto) {
        StringBuilder sql = new StringBuilder();
        sql.append(" UPDATE CONSTRUCTION");
        sql.append(" 	SET APPROVE_COMPLETE_VALUE = null,");
//        hoanm1_20181015_start
//        sql.append(" 	    APPROVE_COMPLETE_DATE = null");
        sql.append(" 	 APPROVE_COMPLETE_UPDATED_DATE = :date ");
//        hoanm1_20181015_end
        sql.append(" WHERE  CONSTRUCTION_ID = :id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", dto.getConstructionId());
        query.setParameter("date", new Date());
        query.executeUpdate();
    }

    public void approveRevenue(ConstructionTaskDetailDTO dto, Long deptId) {
        StringBuilder sql = new StringBuilder();
        sql.append(" UPDATE CONSTRUCTION");
        sql.append(" 	SET APPROVE_REVENUE_STATE =2, ");
        sql.append(" 	 	APPROVE_REVENUE_VALUE =:consAppRevenueValue, ");
        sql.append(" 		APPROVE_REVENUE_USER_ID =:deptId, ");
//        hoanm1_20190115_start
//        sql.append(" 		APPROVE_REVENUE_DATE =:date ");
        sql.append(" APPROVE_REVENUE_UPDATED_DATE = :date ");
//        hoanm1_20190115_end
        sql.append(" WHERE  CONSTRUCTION_ID = :id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", dto.getConstructionId());
        query.setParameter("deptId", deptId);
        query.setParameter("date", new Date());
        query.setParameter("consAppRevenueValue", dto.getConsAppRevenueValue());
        query.executeUpdate();
    }
    //dang sua
    public void approveWorkItem(ConstructionTaskDetailDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append("UPDATE CONSTRUCTION con ");
        sql.append(" SET con.COMPLETE_VALUE= ");
        sql.append(" 	(SELECT SUM(quantity) ");
        sql.append(" 	 FROM work_item WORK ");
        sql.append(" 	 	INNER JOIN CONSTRUCTION con ");
        sql.append(" 	    ON WORK.CONSTRUCTION_ID=con.CONSTRUCTION_ID ");
        sql.append(" 	 WHERE con.CONSTRUCTION_ID= :constructionId ");
        sql.append(" 	)");
        sql.append(" 	WHERE con.CONSTRUCTION_ID=:constructionId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", obj.getConstructionId());
        query.executeUpdate();
    }

    public void callbackConstrRevenue(ConstructionDetailDTO dto) {
        StringBuilder sql = new StringBuilder();
        sql.append(" UPDATE CONSTRUCTION");
        sql.append(" 	SET APPROVE_REVENUE_STATE =1, ");
        sql.append(" 	 	APPROVE_REVENUE_VALUE =null, ");
//        hoanm1_20181015_start
         sql.append(" APPROVE_REVENUE_UPDATED_DATE = :date, ");
//         hoanm1_20181015_end
        sql.append(" 	 	APPROVE_REVENUE_USER_ID =null, ");
        sql.append(" 	 	APPROVE_REVENUE_DESCRIPTION =null ");
        sql.append(" WHERE  CONSTRUCTION_ID = :id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", dto.getConstructionId());
        query.setParameter("date", new Date());
        query.executeUpdate();
    }

    public void rejectionRevenue(ConstructionTaskDetailDTO dto, Long deptId) {
        StringBuilder sql = new StringBuilder();
        sql.append(" UPDATE CONSTRUCTION");
        sql.append(" 	SET APPROVE_REVENUE_STATE = 3, ");
        sql.append(" 	 	APPROVE_REVENUE_VALUE = 0, ");
        sql.append(" 		APPROVE_REVENUE_USER_ID =:deptId, ");
        sql.append(" 		APPROVE_REVENUE_DESCRIPTION = :approveRevenueDescription, ");
        sql.append(" 		APPROVE_REVENUE_DATE =:date ");
        sql.append(" WHERE  CONSTRUCTION_ID = :id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", dto.getConstructionId());
        query.setParameter("deptId", deptId);
        query.setParameter("date", new Date());
        query.setParameter("approveRevenueDescription", dto.getApproveRevenueDescription());
        query.executeUpdate();
    }

    public void removeCompleteById(Long constructionTaskId) {
        StringBuilder sql = new StringBuilder();
        sql.append(" UPDATE CONSTRUCTION_TASK");
        sql.append(" 	SET COMPLETE_PERCENT = 0");
        sql.append(" WHERE  CONSTRUCTION_TASK_ID = :Id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("Id", constructionTaskId);
        query.executeUpdate();

    }

    public void updatePerfomer(ConstructionTaskDTO obj) {
        StringBuilder sql = new StringBuilder();
        if (obj.getLevelId() == 4) {
            sql.append(" UPDATE CONSTRUCTION_TASK");
            sql.append(" 	SET PERFORMER_ID =:performerId");
            sql.append(" WHERE  CONSTRUCTION_TASK_ID = :id");
        } else if (obj.getLevelId() == 3) {
            sql.append(" UPDATE CONSTRUCTION_TASK");
            sql.append(" SET PERFORMER_ID =:performerId,PERFORMER_WORK_ITEM_ID =:performerId ");
            sql.append(" WHERE  parent_id = :id or construction_task_id=:id");
        }
        if (obj.getLevelId() == 3) {
            StringBuilder sqlWorkItem = new StringBuilder();
            sqlWorkItem.append(" update work_item set PERFORMER_ID = :perId where work_item_id = :workId ");
            SQLQuery queryWorkItem = getSession().createSQLQuery(sqlWorkItem.toString());
            queryWorkItem.setParameter("perId", obj.getPerformerId());
            queryWorkItem.setParameter("workId", obj.getWorkItemId());
            queryWorkItem.executeUpdate();
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("performerId", obj.getPerformerId());
        query.setParameter("id", obj.getId());
        query.executeUpdate();

    }

    public void updateTaskParent(Long parentId) {
        StringBuilder sql = new StringBuilder();
        sql.append(" UPDATE CONSTRUCTION_TASK c1");
        sql.append("   	SET ");
        sql.append(
                "     c1.COMPLETE_PERCENT = ROUND((SELECT AVG(c2.COMPLETE_PERCENT) FROM CONSTRUCTION_TASK c2 WHERE c2.PARENT_ID = :parentId),2), ");
        sql.append(
                "     c1.START_DATE =( SELECT min(c3.START_DATE) From CONSTRUCTION_TASK c3 WHERE c3.PARENT_ID = :parentId), ");
        sql.append(
                "     c1.END_DATE =( SELECT max(c4.END_DATE) From CONSTRUCTION_TASK c4 WHERE c4.PARENT_ID = :parentId) ");
        sql.append(" Where c1.CONSTRUCTION_TASK_ID = :parentId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("parentId", parentId);
        query.executeUpdate();
    }

    public Long getParentId(Long id) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT PARENT_ID parentId");
        sql.append(" FROM CONSTRUCTION_TASK");
        sql.append(" Where CONSTRUCTION_TASK_ID = :id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("parentId", new LongType());
        return (Long) query.uniqueResult();
    }

    public String getDataSysGroupNameByUserName(String userName) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT sys.NAME sysName");
        sql.append(" FROM SYS_USER u ");
        sql.append(" LEFT JOIN SYS_GROUP sys ");
        sql.append(" ON u.SYS_GROUP_ID  = sys.SYS_GROUP_ID ");
        sql.append(" WHERE u.LOGIN_NAME =:userName ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("sysName", new StringType());
        query.setParameter("userName", userName);
        return (String) query.uniqueResult();
    }

    public void updateChildRecord(ConstructionTaskBO provinceLevel, Long detailMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("update construction_task a set parent_id = :parentId "
                + " where detail_month_plan_id = :detailMonthPlanId and ((level_id = 4 and type !=1 ) or level_id =2) ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("parentId", provinceLevel.getConstructionTaskId());
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.executeUpdate();
        this.getSession().flush();
        sql = new StringBuilder(
                "UPDATE construction_task a SET path =  (SELECT path    ||a.construction_task_id    ||'/'  FROM construction_task  WHERE construction_task_id = a.parent_id");
        sql.append(")WHERE detail_month_plan_id = :detailMonthPlanId AND level_id              !=1 and level_id = 2 ");
        query = getSession().createSQLQuery(sql.toString());
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.executeUpdate();
        this.getSession().flush();
        sql = new StringBuilder(
                "UPDATE construction_task a SET path =  (SELECT path    ||a.construction_task_id    ||'/'  FROM construction_task  WHERE construction_task_id = a.parent_id");
        sql.append(")WHERE detail_month_plan_id = :detailMonthPlanId AND level_id              !=1 and level_id = 3 ");
        query = getSession().createSQLQuery(sql.toString());
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.executeUpdate();
        this.getSession().flush();
        sql = new StringBuilder(
                "UPDATE construction_task a SET path =  (SELECT path    ||a.construction_task_id    ||'/'  FROM construction_task  WHERE construction_task_id = a.parent_id");
        sql.append(")WHERE detail_month_plan_id = :detailMonthPlanId AND level_id              !=1 and level_id = 4 ");
        query = getSession().createSQLQuery(sql.toString());
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.executeUpdate();
        this.getSession().flush();

    }

    public boolean inValidEndDate(ConstructionTaskGranttDTO dto) {
        // TODO Auto-generated method stub
        Long constructionId = null;
        StringBuilder sql = new StringBuilder("SELECT construction_id constructionId FROM CONSTRUCTION_TASK consTask ");
        sql.append("WHERE consTask.CONSTRUCTION_TASK_ID = :id  ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("constructionId", new LongType());
        query.setParameter("id", dto.getId());
        List<Long> listId = query.list();
        if (listId != null && !listId.isEmpty())
            constructionId = listId.get(0);
        if (constructionId == null)
            return false;
        sql = new StringBuilder(
                "select count(cons.construction_id) from construction cons where cons.EXCPECTED_COMPLETE_DATE < :end and cons.construction_id=:id");
        query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", constructionId);
        query.setParameter("end", dto.getEnd());
        return ((BigDecimal) query.uniqueResult()).intValue() > 0;
    }

    public boolean inValidStartDate(ConstructionTaskGranttDTO dto) {
        // TODO Auto-generated method stub
        Long constructionId = null;
        StringBuilder sql = new StringBuilder("SELECT construction_id constructionId FROM CONSTRUCTION_TASK consTask ");
        sql.append("WHERE consTask.CONSTRUCTION_TASK_ID = :id  ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("constructionId", new LongType());
        query.setParameter("id", dto.getId());
        List<Long> listId = query.list();
        if (listId != null && !listId.isEmpty())
            constructionId = listId.get(0);
        if (constructionId == null)
            return false;
        sql = new StringBuilder(
                "select count(cons.construction_id) from construction cons where cons.STARTING_DATE > :start and cons.construction_id=:id");
        query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", constructionId);
        query.setParameter("start", dto.getStart());
        return ((BigDecimal) query.uniqueResult()).intValue() > 0;
    }

    public ConstructionTaskGranttDTO getCountConstruction(GranttDTO obj, List<String> sysGroupId) {
        ConstructionTaskGranttDTO data = new ConstructionTaskGranttDTO();
        // TODO Auto-generated method stub
        // tat ca cong viec
        StringBuilder sql = new StringBuilder(
                "select count (distinct a.parent_id) from DETAIL_MONTH_PLAN b,CONSTRUCTION_TASK a ");
        //sql.append(" inner join CONSTRUCTION cons on a.CONSTRUCTION_ID = cons.CONSTRUCTION_ID and cons.status!=0 ");
        //sql.append(" left join CAT_STATION cat on cat.CAT_STATION_ID = cons.CAT_STATION_ID ");
       // sql.append(" left join CAT_PROVINCE catPro on catPro.CAT_PROVINCE_ID = cat.CAT_PROVINCE_ID ");
        sql.append("where a.DETAIL_MONTH_PLAN_ID=b.DETAIL_MONTH_PLAN_ID and b.SIGN_STATE=3 and b.STATUS=1");
        sql.append(" and a.LEVEL_ID=4 AND a.type in (1,2,3,6)  and a.month=:month and a.YEAR=:year");
        // if(groupIdList!=null&&!groupIdList.isEmpty())
        // sql.append(" and catPro.CAT_PROVINCE_ID in :groupIdList ");
        if (sysGroupId != null)
            sql.append(" and b.sys_group_id in :sysGroupId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("month", obj.getMonth());
        query.setParameter("year", obj.getYear());
        if (sysGroupId != null)
            query.setParameterList("sysGroupId", sysGroupId);
        data.setTaskAll(((BigDecimal) query.uniqueResult()).longValue());
        // công việc chưa thực hiện
//        sql = new StringBuilder("select count (CONSTRUCTION_TASK_ID) from DETAIL_MONTH_PLAN b,CONSTRUCTION_TASK a");
//        sql.append(" inner join CONSTRUCTION cons on a.CONSTRUCTION_ID = cons.CONSTRUCTION_ID  and cons.status!=0 ");
//        sql.append(" left join CAT_STATION cat on cat.CAT_STATION_ID = cons.CAT_STATION_ID ");
//        sql.append(" left join CAT_PROVINCE catPro on catPro.CAT_PROVINCE_ID = cat.CAT_PROVINCE_ID ");
//        sql.append(" where a.DETAIL_MONTH_PLAN_ID=b.DETAIL_MONTH_PLAN_ID and b.SIGN_STATE=3 and b.STATUS=1 ");
//        sql.append(" and a.LEVEL_ID=4 AND a.type in (1,2,3,6) and a.status=1 and a.month=:month and a.YEAR=:year");
//        // if(groupIdList!=null&&!groupIdList.isEmpty())
//        // sql.append(" and catPro.CAT_PROVINCE_ID in :groupIdList ");
//        if (sysGroupId != null)
//            sql.append(" and b.sys_group_id in :sysGroupId ");
//        query = getSession().createSQLQuery(sql.toString());
//        query.setParameter("month", obj.getMonth());
//        query.setParameter("year", obj.getYear());
//        if (sysGroupId != null)
//            query.setParameterList("sysGroupId", sysGroupId);
//        data.setTaskUnfulfilled(((BigDecimal) query.uniqueResult()).longValue());
        // công việc chậm tiến độ
        sql = new StringBuilder("select count (distinct a.parent_id) from DETAIL_MONTH_PLAN b,CONSTRUCTION_TASK a ");
        //sql.append(" inner join CONSTRUCTION cons on a.CONSTRUCTION_ID = cons.CONSTRUCTION_ID and cons.status!=0 ");
        //sql.append(" left join CAT_STATION cat on cat.CAT_STATION_ID = cons.CAT_STATION_ID ");
       // sql.append(" left join CAT_PROVINCE catPro on catPro.CAT_PROVINCE_ID = cat.CAT_PROVINCE_ID ");
        sql.append(" where a.DETAIL_MONTH_PLAN_ID=b.DETAIL_MONTH_PLAN_ID and b.SIGN_STATE=3 and b.STATUS=1");
        sql.append(
                " and a.LEVEL_ID=4 AND a.type in (1,2,3,6) and a.COMPLETE_STATE !=1 and a.month=:month and a.YEAR=:year");
        // if(groupIdList!=null&&!groupIdList.isEmpty())
        // sql.append(" and catPro.CAT_PROVINCE_ID in :groupIdList ");
        if (sysGroupId != null)
            sql.append(" and b.sys_group_id in :sysGroupId ");
        query = getSession().createSQLQuery(sql.toString());
        query.setParameter("month", obj.getMonth());
        query.setParameter("year", obj.getYear());
        if (sysGroupId != null)
            query.setParameterList("sysGroupId", sysGroupId);
        data.setTaskSlow(((BigDecimal) query.uniqueResult()).longValue());
        // công việc tạm dừng
//        sql = new StringBuilder("select count (CONSTRUCTION_TASK_ID) from DETAIL_MONTH_PLAN b,CONSTRUCTION_TASK a");
//        sql.append(" inner join CONSTRUCTION cons on a.CONSTRUCTION_ID = cons.CONSTRUCTION_ID and cons.status!=0 ");
//        sql.append(" left join CAT_STATION cat on cat.CAT_STATION_ID = cons.CAT_STATION_ID ");
//        sql.append(" left join CAT_PROVINCE catPro on catPro.CAT_PROVINCE_ID = cat.CAT_PROVINCE_ID ");
//        sql.append(" where a.DETAIL_MONTH_PLAN_ID=b.DETAIL_MONTH_PLAN_ID and b.SIGN_STATE=3 and b.STATUS=1");
//        sql.append(" and a.LEVEL_ID=4 AND a.type in (1,2,3,6) and a.status=3 and a.month=:month and a.YEAR=:year");
//        if (sysGroupId != null)
//            sql.append(" and b.sys_group_id in :sysGroupId ");
//        query = getSession().createSQLQuery(sql.toString());
//        query.setParameter("month", obj.getMonth());
//        query.setParameter("year", obj.getYear());
//        if (sysGroupId != null)
//            query.setParameterList("sysGroupId", sysGroupId);
//        data.setTaskPause(((BigDecimal) query.uniqueResult()).longValue());
        return data;
    }

    public ConstructionTaskGranttDTO getCountConstructionForTc(GranttDTO obj) {
        ConstructionTaskGranttDTO data = new ConstructionTaskGranttDTO();
        // TODO Auto-generated method stub
        // tat ca cong viec
        StringBuilder sql = new StringBuilder(
                "select count (CONSTRUCTION_TASK_ID) from CONSTRUCTION_TASK a,DETAIL_MONTH_PLAN b"
                        + " where a.DETAIL_MONTH_PLAN_ID=b.DETAIL_MONTH_PLAN_ID and b.SIGN_STATE=3 and b.STATUS=1"
                        + " and a.LEVEL_ID=4 and a.type =1 and a.CONSTRUCTION_ID=:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obj.getId());
        data.setTaskAll(((BigDecimal) query.uniqueResult()).longValue());
        // công việc chưa thực hiện
        sql = new StringBuilder("select count (CONSTRUCTION_TASK_ID) from CONSTRUCTION_TASK a,DETAIL_MONTH_PLAN b"
                + " where a.DETAIL_MONTH_PLAN_ID=b.DETAIL_MONTH_PLAN_ID and b.SIGN_STATE=3 and b.STATUS=1"
                + " and a.LEVEL_ID=4 and a.type =1 and a.status=1 and  a.CONSTRUCTION_ID=:id");
        query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obj.getId());
        data.setTaskUnfulfilled(((BigDecimal) query.uniqueResult()).longValue());
        // công việc chậm tiến độ
        sql = new StringBuilder("select count (CONSTRUCTION_TASK_ID) from CONSTRUCTION_TASK a,DETAIL_MONTH_PLAN b"
                + " where a.DETAIL_MONTH_PLAN_ID=b.DETAIL_MONTH_PLAN_ID and b.SIGN_STATE=3 and b.STATUS=1"
                + " and a.LEVEL_ID=4 and a.type =1 and a.COMPLETE_STATE !=1 and a.CONSTRUCTION_ID=:id");
        query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obj.getId());
        data.setTaskSlow(((BigDecimal) query.uniqueResult()).longValue());
        // công việc tạm dừng
        sql = new StringBuilder("select count (CONSTRUCTION_TASK_ID) from CONSTRUCTION_TASK a,DETAIL_MONTH_PLAN b"
                + " where a.DETAIL_MONTH_PLAN_ID=b.DETAIL_MONTH_PLAN_ID and b.SIGN_STATE=3 and b.STATUS=1"
                + " and a.LEVEL_ID=4 and a.type =1 and a.status=3 and a.CONSTRUCTION_ID=:id");
        query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obj.getId());
        data.setTaskPause(((BigDecimal) query.uniqueResult()).longValue());
        return data;
    }

    // CuongNV2 added start
    public List<ConstructionTaskDTO> getAllConstructionScheduleTask(SysUserRequest request) {
        String strMonth = getCurrentTimeStampMonth();
        long month = Long.parseLong(strMonth);

        String strYear = getCurrentTimeStampYear();
        long year = Long.parseLong(strYear);

        // ten cong trinh
        // ten hang muc

        StringBuilder sql = new StringBuilder(" SELECT  ct.PATH path, "
                + " ct.CONSTRUCTION_TASK_ID constructionTaskId , ct.SYS_GROUP_ID sysGroupId, ct.MONTH month, ct.YEAR year, ct.TASK_NAME taskName, "
                + " ct.START_DATE startDate, ct.END_DATE endDate, ct.BASELINE_START_DATE baselineStartDate, ct.BASELINE_END_DATE baselineEndDate, ct.CONSTRUCTION_ID constructionId, "
                + " ct.WORK_ITEM_ID workItemId, ct.CAT_TASK_ID catTaskId, ct.PERFORMER_ID performerId, "
                + " (select full_name from sys_user a where a.sys_user_id= ct.PERFORMER_ID) performerName,  "
                + "ct.QUANTITY quantity, ct.COMPLETE_PERCENT completePercent, "
                + " ct.DESCRIPTION description, ct.STATUS status, ct.SOURCE_TYPE sourceType, ct.DEPLOY_TYPE deployType, ct.VAT vat,  "
                + " ct.DETAIL_MONTH_PLAN_ID detailMonthPlanId, ct.CREATED_DATE createdDate, ct.CREATED_USER_ID createdUserId, ct.CREATED_GROUP_ID createdGroupId, ct.UPDATED_DATE updatedDate, "
                + " ct.UPDATED_USER_ID updatedUserId, ct.UPDATED_GROUP_ID updatedGroupId , "
                + " ct.COMPLETE_STATE completeState, ct.type type ,"
                + " case when type=1 then (select code from construction where construction_id = (select construction_id from construction_task tsk where tsk.construction_task_id=  "
                + " (select parent_id from construction_task tsk where tsk.construction_task_id=ct.parent_id)))  "
                + "  when type in(2,3,6) then (select code from construction where construction_id = ct.construction_id) "
                + "  end constructionCode,  "
                + " case when type=1 then (select task_name from construction_task tsk where tsk.construction_task_id=ct.parent_id) end workItemName  "
                + " FROM CONSTRUCTION_TASK ct " + " INNER JOIN DETAIL_MONTH_PLAN dmp  "
                + " ON ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
                + " WHERE 1 = 1 AND dmp.SIGN_STATE = 3 AND dmp.status = 1 AND ct.LEVEL_ID = 4 "
                + " AND ct.COMPLETE_STATE is not null AND ct.MONTH = :month AND ct.YEAR = :year  ");

        if (request.getFlag() == 1) {
            sql.append(" AND ct.PERFORMER_ID = :sysUserId ORDER BY ct.END_DATE ");
        } else {
            sql.append("  AND ct.SUPERVISOR_ID = :sysUserId ORDER BY ct.END_DATE ");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("path", new StringType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("taskName", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("baselineStartDate", new DateType());
        query.addScalar("baselineEndDate", new DateType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("catTaskId", new LongType());
        query.addScalar("performerId", new LongType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("completePercent", new DoubleType());
        query.addScalar("description", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("sourceType", new StringType());
        query.addScalar("deployType", new StringType());
        query.addScalar("vat", new DoubleType());
        query.addScalar("detailMonthPlanId", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("updatedUserId", new LongType());
        query.addScalar("updatedGroupId", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("completeState", new StringType());
        query.addScalar("type", new StringType());
        query.addScalar("performerName", new StringType());
        // request.getSysUserId()
        // query.setParameter("sysUserId", request.getSysUserId());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDTO.class));

        query.setParameter("sysUserId", request.getSysUserId());
        query.setParameter("month", month);
        query.setParameter("year", year);
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDTO.class));
        return query.list();

    }

    // CuongNV2 added end

    public List<AppParamDTO> getHTTC(SysUserRequest request) {
        StringBuilder sql = new StringBuilder(" ");
        sql.append(
                " select app.CODE code , app.NAME name from APP_PARAM app WHERE PAR_TYPE='CONSTRUCTION_TYPE_DAILY' ORDER BY app.PAR_ORDER ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));
        return query.list();
    }

    // hungnx 20180705 start
    public int updateConstructionTask(ConstructionTaskDTO criteria) {
        // complete percent cv
        StringBuilder stringBuilder = new StringBuilder("UPDATE CONSTRUCTION_TASK CT set ");
        double percent = 0;
        stringBuilder.append(" CT.STATUS = :status");
        if (criteria.getAmount() != null) {
            stringBuilder.append(", CT.COMPLETE_PERCENT = :completePercent");
            double amountDaily = getTotalAmountDaily(criteria);
            if (null != criteria.getAmount()) {
                percent = amountDaily / criteria.getAmount() * 100;
                setCompletePercent(percent);
            }
        }
        stringBuilder.append(" where CT.CONSTRUCTION_TASK_ID = :constructionTaskId");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        if (criteria.getAmount() != null) {
            query.setParameter("completePercent", percent);
        }
        if (percent < 100) {
            query.setParameter("status", "2");
        } else {
            query.setParameter("status", "4");
        }
        query.setParameter("constructionTaskId", criteria.getConstructionTaskId());
        int rs = query.executeUpdate();
        if (criteria.getAmount() != null) {
            String[] lstPath = criteria.getPath().split("/");
            String sysGroupId = lstPath[1];
            String constructionId = lstPath[2];
            String workItemId = lstPath[3];
            updateWorkItemConstructionTask(workItemId, constructionId);
            updateSysGroupTask(sysGroupId);
        }
        // hoanm1_20180412_end
        return rs;
    }

    public double getCompletePercent() {
        return completePercent;
    }

    public void setCompletePercent(double completePercent) {
        this.completePercent = completePercent;
    }

    public Double getTotalAmountDaily(ConstructionTaskDTO criteria) {
        StringBuilder sql = new StringBuilder(
                " SELECT nvl(SUM(a.AMOUNT), 0) amount FROM CONSTRUCTION_TASK_DAILY a where a.confirm in(0,1)");
        if (null != criteria.getCatTaskId()) {
            sql.append(" and a.CAT_TASK_ID = :catTaskId");
        }
        if (null != criteria.getWorkItemId()) {
            sql.append(" and a.WORK_ITEM_ID = :workItemId");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (null != criteria.getCatTaskId()) {
            query.setParameter("catTaskId", criteria.getCatTaskId());
        }
        if (null != criteria.getWorkItemId()) {
            query.setParameter("workItemId", criteria.getWorkItemId());
        }
        BigDecimal result = (BigDecimal) query.uniqueResult();
        return result.doubleValue();
    }

    // hungnx 20180705 end

    // chinhpxn20180716_start
    public List<ConstructionTaskDetailDTO> getConstructionTaskByDMP(Long month, Long year, Long levelId,
                                                                    Long actionType, Long sysGroupId) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT conTask.CONSTRUCTION_TASK_ID constructionTaskId, ");
        sql.append("   conTask.CONSTRUCTION_ID constructionId, ");
        sql.append("   conTask.TASK_NAME taskName, ");
        sql.append("   conTask.TYPE type, ");
        sql.append("   conTask.PARENT_ID parentId, ");
        sql.append("   conTask.WORK_ITEM_ID workItemId, ");
        sql.append("   conTask.PERFORMER_ID performerId ");
//        sql.append("   ,con.CODE constructionCode, ");
//        sql.append("   wi.NAME workItemName ");
        sql.append(" FROM CONSTRUCTION_TASK conTask ");
//        sql.append(" LEFT JOIN CONSTRUCTION con ON conTask.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
//        sql.append(" LEFT JOIN WORK_ITEM wi ON conTask.WORK_ITEM_ID = wi.WORK_ITEM_ID ");
        sql.append(" WHERE DETAIL_MONTH_PLAN_ID IN ");
        sql.append("   (SELECT DETAIL_MONTH_PLAN_ID ");
        sql.append("   FROM DETAIL_MONTH_PLAN dmp ");
        sql.append("   WHERE dmp.sign_state=3 and dmp.status=1 and MONTH= :month ");
        sql.append("   AND YEAR   = :year ");
        sql.append("   AND SYS_GROUP_ID   = :sysGroupId )");
        sql.append("   AND LEVEL_ID = :levelId");
//        if (actionType == 0) {
//            sql.append("   AND wi.STATUS != 3");
//        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("workItemId", new LongType());
//        query.addScalar("constructionCode", new StringType());
//        query.addScalar("workItemName", new StringType());
        query.addScalar("taskName", new StringType());
        query.addScalar("type", new StringType());
        query.addScalar("parentId", new LongType());
        query.addScalar("performerId", new LongType());

        query.setParameter("month", month);
        query.setParameter("year", year);
        query.setParameter("levelId", levelId);
        query.setParameter("sysGroupId", sysGroupId);

        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        return query.list();
    }

    @SuppressWarnings("deprecation")
    public void updateConstructionTaskPerformerId(ConstructionTaskDetailDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append("UPDATE CONSTRUCTION_TASK ");
        sql.append(
                "SET PERFORMER_ID = :performerId, START_DATE = TO_DATE(:startDate,'YYYY-MM-DD'), END_DATE = TO_DATE(:endDate,'YYYY-MM-DD') ");
        sql.append("WHERE CONSTRUCTION_TASK_ID = :constructionTaskId OR PARENT_ID = :constructionTaskId ");

        DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("performerId", obj.getPerformerId());
        query.setParameter("startDate", (obj.getStartDate().getYear() + 1900) + "-"
                + (obj.getStartDate().getMonth() + 1) + "-" + obj.getStartDate().getDate());
        query.setParameter("endDate", (obj.getEndDate().getYear() + 1900) + "-" + (obj.getEndDate().getMonth() + 1)
                + "-" + obj.getEndDate().getDate());
        query.setParameter("constructionTaskId", obj.getConstructionTaskId());

        query.executeUpdate();
    }

    public void updateWorkItemPerformerId(ConstructionTaskDetailDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" UPDATE WORK_ITEM ");
        sql.append(" SET PERFORMER_ID = :performerId ");
        sql.append(" WHERE WORK_ITEM_ID IN ");
        sql.append(
                " (SELECT WORK_ITEM_ID FROM CONSTRUCTION_TASK WHERE CONSTRUCTION_TASK_ID = :constructionTaskId OR PARENT_ID = :constructionTaskId) ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("performerId", obj.getPerformerId());
        query.setParameter("constructionTaskId", obj.getConstructionTaskId());

        query.executeUpdate();
    }

    //nhantv9_20180824_start
    public void updateTransPerfomer(ConstructionTaskDetailDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" UPDATE CONSTRUCTION_TASK");
        sql.append(" SET PERFORMER_ID =:performerId,PERFORMER_WORK_ITEM_ID =:performerId, "
                + " start_Date = :startDate, end_Date = :endDate, quantity = :quantity ");
        sql.append(" WHERE  parent_id = :id or construction_task_id=:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("startDate", obj.getStartDate());
        query.setParameter("endDate", obj.getEndDate());
        query.setParameter("quantity", obj.getQuantity() * 1000000);
        query.setParameter("performerId", obj.getPerformerId());
        query.setParameter("id", obj.getConstructionTaskId());
        query.executeUpdate();

    }
//	nhantv9_20180824_end

    public DetailMonthPlanDTO getDetailMonthPlanId(Long month, Long year, Long sysGroupId) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT DETAIL_MONTH_PLAN_ID detailMonthPlanId FROM DETAIL_MONTH_PLAN ");
        sql.append(" WHERE MONTH = :month ");
        sql.append(" AND YEAR = :year ");
        sql.append(" AND SYS_GROUP_ID = :sysGroupId ");
        sql.append(" AND sign_state = 3 and status = 1  ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("detailMonthPlanId", new LongType());

        query.setParameter("month", month);
        query.setParameter("year", year);
        query.setParameter("sysGroupId", sysGroupId);

        query.setResultTransformer(Transformers.aliasToBean(DetailMonthPlanDTO.class));
        return (DetailMonthPlanDTO) query.uniqueResult();
    }

    // chinhpxn20180716_end

    public List<Long> getListConstructionTask(Long id) {
        StringBuilder sql = new StringBuilder(
                "select construction_task_id constructionTaskId from construction_task where PARENT_ID = :id and level_id = 4 and type = 1 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("constructionTaskId", new LongType());
        query.setParameter("id", id);
        return query.list();
    }

    public List<ConstructionTaskDTO> rpSumTask(ConstructionTaskDTO obj, List<String> groupIdList) {
        StringBuilder sql = new StringBuilder("select  " + "sysu.full_name fullName, " + "cont.code contractCode, "
                + "prov.code provinceCode, " + "sta.code stationCode, " + "cst.code constructionCode, "
                + "cst.DESCRIPTION description, " + "cst_type.name constructionTypeName, "
//				hoanm1_20180815_bo chia 1 trieu_start
                + "task.task_name workItemName, " + "task.quantity quantity, "
//				hoanm1_20180815_bo chia 1 trieu_end
                + "case when wi.IS_INTERNAL=1 then 1 else null end TCTT, "
                + "case when wi.IS_INTERNAL=2 then 1 else null end giam_sat, " + "task.end_date ketthuc_trienkhai, "
                + "case when wi.status=3 then 1 else null end thicong_xong, "
                + "case when wi.status=2 then 1 else null end dang_thicong, "
//				+ "(case when wi.status=2 and nvl(cst.IS_OBSTRUCTED,2) !=1 then (SELECT LISTAGG(TASK_NAME, '; ') WITHIN GROUP (ORDER BY TASK_NAME DESC) FROM construction_task where parent_id=task.construction_task_id and status=4 ) end ) luy_ke, "
                + "(case when wi.status=2 then "
                + " 'Hoàn thành:'|| ''|| (select count(*) from construction_task a where a.parent_id=task.construction_task_id and "
                + " a.WORK_ITEM_ID=task.WORK_ITEM_ID and a.COMPLETE_PERCENT=100) ||'/'||(select count(*) from construction_task a where "
                + " a.parent_id=task.construction_task_id and a.WORK_ITEM_ID=task.WORK_ITEM_ID ) end ) luy_ke, "

                + "case when wi.status=1 then 1 else null end chua_thicong, "
                + "case when wi.status=4 then 1 else null end vuong, "
                + "(select min(updated_date) from construction_task a where a.parent_id=task.construction_task_id) batdau_thicong, "
                + "wi.COMPLETE_DATE ketthuc_thicong, " + "task.construction_task_id constructionTaskId, "
                + "task.work_item_id workItemId,sg.name sysGroupName  " + "from  " + "construction_task task, " + "DETAIL_MONTH_PLAN dmp, "
                + "(select distinct b.construction_id, " + "a.code from cnt_contract a, "
                + "cnt_constr_work_item_task b  " + "where a.cnt_contract_id=b.cnt_contract_id "
                + "and a.contract_type=0  " + "and a.status !=0  " + "and b.status !=0) cont, " + "construction cst, "
                + "work_item wi, " + "cat_station sta, " + "cat_province prov, " + "cat_construction_type cst_type, "
                + "sys_user sysu,sys_group sg " + "where task.DETAIL_MONTH_PLAN_ID=dmp.DETAIL_MONTH_PLAN_ID  "
                + "and dmp.SIGN_STATE=3  " + "and dmp.status=1 " + "and task.type=1  " + "and task.level_id=3 "
                + "and task.construction_id=cont.construction_id(+) " + "and task.construction_id=cst.construction_id(+) "
                + "and task.work_item_id=wi.work_item_id(+) " + "and cst.cat_station_id=sta.cat_station_id "
                + "and sta.cat_province_id=prov.cat_province_id "
                + "and cst.cat_construction_type_id=cst_type.cat_construction_type_id "
                + "and task.performer_id=sysu.sys_user_id and task.sys_group_id=sg.sys_group_id ");

        if (obj.getKetthuc_trienkhai_den() != null && obj.getKetthuc_trienkhai_tu() != null) {
            sql.append(" and task.end_date >= :ketthuc_trienkhai_tu and task.end_date <= :ketthuc_trienkhai_den ");
        }
        if (obj.getSysUserId() != null) {
            sql.append(" and task.PERFORMER_ID= :sysUserId ");
        }
        if (!StringUtils.isNullOrEmpty(obj.getProvinceCode())) {
            sql.append(" and prov.code= :provinceCode ");
        }
//		hoanm1_20180815_start
        if (groupIdList != null && !groupIdList.isEmpty()) {
            sql.append(" and prov.CAT_PROVINCE_ID in :groupIdList ");
        }
//		hoanm1_20180815_end
        if (obj.getCatConstructionTypeId() != null) {
            sql.append(" and cst_type.CAT_CONSTRUCTION_TYPE_ID= :catConstructionTypeId ");
        }
        if (obj.getConstructionId() != null) {
            sql.append(" and task.CONSTRUCTION_ID= :constructionId ");
        }
        if (obj.getWorkItemId() != null) {
            sql.append(" and task.work_item_id= :workItemId ");
        }
        if (obj.getStationId() != null) {
            sql.append(" and sta.CAT_STATION_ID = :stationId ");
        }
        if (obj.getSysGroupId() != null) {
            sql.append(" and task.sys_group_id = :sysGroupId ");
        }
        sql.append("order by sysu.full_name,cst.code,wi.name,task.end_date ");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("fullName", new StringType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("stationCode", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("constructionTypeName", new StringType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("TCTT", new StringType());
        query.addScalar("giam_sat", new StringType());
        query.addScalar("ketthuc_trienkhai", new DateType());
        query.addScalar("thicong_xong", new StringType());
        query.addScalar("dang_thicong", new StringType());
        query.addScalar("luy_ke", new StringType());
        query.addScalar("chua_thicong", new StringType());
        query.addScalar("vuong", new StringType());
        query.addScalar("batdau_thicong", new DateType());
        query.addScalar("ketthuc_thicong", new DateType());
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("sysGroupName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDTO.class));

        if (obj.getKetthuc_trienkhai_den() != null) {
            query.setDate("ketthuc_trienkhai_den", obj.getKetthuc_trienkhai_den());
            queryCount.setDate("ketthuc_trienkhai_den", obj.getKetthuc_trienkhai_den());
        }
        if (obj.getKetthuc_trienkhai_tu() != null) {
            query.setDate("ketthuc_trienkhai_tu", obj.getKetthuc_trienkhai_tu());
            queryCount.setDate("ketthuc_trienkhai_tu", obj.getKetthuc_trienkhai_tu());
        }
        if (obj.getSysUserId() != null) {
            query.setParameter("sysUserId", obj.getSysUserId());
            queryCount.setParameter("sysUserId", obj.getSysUserId());
        }
        if (!StringUtils.isNullOrEmpty(obj.getProvinceCode())) {
            query.setParameter("provinceCode", obj.getProvinceCode());
            queryCount.setParameter("provinceCode", obj.getProvinceCode());
        }
//		hoanm1_20180815_start
        if (groupIdList != null && !groupIdList.isEmpty()) {
            query.setParameterList("groupIdList", groupIdList);
            queryCount.setParameterList("groupIdList", groupIdList);
        }
//			hoanm1_20180815_end
        if (obj.getCatConstructionTypeId() != null) {
            query.setParameter("catConstructionTypeId", obj.getCatConstructionTypeId());
            queryCount.setParameter("catConstructionTypeId", obj.getCatConstructionTypeId());
        }
        if (obj.getConstructionId() != null) {
            query.setParameter("constructionId", obj.getConstructionId());
            queryCount.setParameter("constructionId", obj.getConstructionId());
        }
        if (obj.getWorkItemId() != null) {
            query.setParameter("workItemId", obj.getWorkItemId());
            queryCount.setParameter("workItemId", obj.getWorkItemId());
        }
        if (obj.getStationId() != null) {
            query.setParameter("stationId", obj.getStationId());
            queryCount.setParameter("stationId", obj.getStationId());
        }
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
        }
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    //	nhantv9 20180823 start
    public List<WorkItemDetailDTO> getWorkItemForAssign(WorkItemDetailDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT T1.CAT_WORK_ITEM_TYPE_ID catWorkItemTypeId, ");
        sql.append("T1.CAT_WORK_ITEM_TYPE_ID id, ");
        sql.append("T1.NAME name, ");
        sql.append("T1.CODE code, ");
        sql.append("T1.CAT_CONSTRUCTION_TYPE_ID catConstructionTypeId, "
        		+ " T1.CAT_WORK_ITEM_GROUP_ID catWorkItemGroupId, ");
        
        sql.append(" T2.NAME catConstructionTypeName ");
        sql.append(" FROM CAT_WORK_ITEM_TYPE T1 ");
        sql.append(
                "LEFT JOIN CAT_CONSTRUCTION_TYPE T2 ON T1.CAT_CONSTRUCTION_TYPE_ID = T2.CAT_CONSTRUCTION_TYPE_ID "
                        + "WHERE T1.STATUS = 1");
        sql.append(" and T1.CAT_CONSTRUCTION_TYPE_ID = :constructionTypeId ");
        sql.append(" and T1.CAT_WORK_ITEM_TYPE_ID not in ");
        sql.append(" (select CAT_WORK_ITEM_TYPE_ID from work_item where construction_id = :id "
                + "and CAT_WORK_ITEM_TYPE_ID is not null)  ORDER BY T1.ITEM_ORDER");
        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("catWorkItemTypeId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("catConstructionTypeId", new LongType());
        query.addScalar("id", new LongType());
        query.addScalar("catConstructionTypeName", new StringType());
        //nhantv 27092018
        query.addScalar("catWorkItemGroupId", new LongType());

        query.setParameter("constructionTypeId", obj.getCatConstructionTypeId());
        query.setParameter("id", obj.getId());

        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));

        return query.list();
    }

    public List<ConstructionTaskDTO> findForChangePerformer(ConstructionTaskDTO obj) {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append("T1.TASK_ORDER taskOrder ");
//		stringBuilder.append(",T1.TASK_NAME_BK taskNameBk ");
		stringBuilder.append(",T1.COMPLETE_PERCENT completePercent ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.SOURCE_TYPE sourceType ");
		stringBuilder.append(",T1.DEPLOY_TYPE deployType ");
		stringBuilder.append(",T1.TYPE type ");
		stringBuilder.append(",T1.VAT vat ");
		stringBuilder.append(",T1.DETAIL_MONTH_PLAN_ID detailMonthPlanId ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T1.COMPLETE_STATE completeState ");
		stringBuilder.append(",T1.PERFORMER_WORK_ITEM_ID performerWorkItemId ");
		stringBuilder.append(",T1.SUPERVISOR_ID supervisorId ");
		stringBuilder.append(",T1.DIRECTOR_ID directorId ");
		stringBuilder.append(",T1.PARENT_ID parentId ");
		stringBuilder.append(",T1.LEVEL_ID levelId ");
		stringBuilder.append(",T1.PATH path ");
		stringBuilder.append(",T1.REASON_STOP reasonStop ");
		stringBuilder.append(",T1.PERFORMER_ID performerId ");
		stringBuilder.append(",T1.QUANTITY quantity ");
		stringBuilder.append(",T1.CONSTRUCTION_TASK_ID constructionTaskId ");
		stringBuilder.append(",T1.SYS_GROUP_ID sysGroupId ");
		stringBuilder.append(",T1.MONTH month ");
		stringBuilder.append(",T1.YEAR year ");
		stringBuilder.append(",T1.TASK_NAME taskName ");
		stringBuilder.append(",T1.START_DATE startDate ");
		stringBuilder.append(",T1.END_DATE endDate ");
		stringBuilder.append(",T1.BASELINE_START_DATE baselineStartDate ");
		stringBuilder.append(",T1.BASELINE_END_DATE baselineEndDate ");
		stringBuilder.append(",T1.CONSTRUCTION_ID constructionId ");
		stringBuilder.append(",T1.WORK_ITEM_ID workItemId ");
		stringBuilder.append(",(select name from work_item where work_item_id = T1.WORK_ITEM_ID) workItemName ");
		stringBuilder.append(",T1.CAT_TASK_ID catTaskId ");
//		hoanm1_20181015_start
		stringBuilder.append(",(select cat.name from cat_partner cat,work_item wi where wi.work_item_id=T1.work_item_id and cat.cat_partner_id=wi.CONSTRUCTOR_ID and cat.status=1 )partnerName ");
//		hoanm1_20181015_end
    	stringBuilder.append("FROM CONSTRUCTION_TASK T1 ");    	
    	stringBuilder.append("WHERE nvl(complete_percent,0) < 100 and level_id = 3");
    	stringBuilder.append(" and T1.construction_Id = :constructionId ");	
    	stringBuilder.append(" and T1.performer_Id = :performerId ");
    	stringBuilder.append(" AND T1.MONTH = :month AND T1.YEAR = :year  ");
    	
    	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");
		
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
		query.addScalar("taskOrder", new StringType());
//		query.addScalar("taskNameBk", new StringType());
        query.addScalar("completePercent", new DoubleType());
        query.addScalar("description", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("sourceType", new StringType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("deployType", new StringType());
        query.addScalar("type", new StringType());
        query.addScalar("vat", new DoubleType());
        query.addScalar("detailMonthPlanId", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("updatedUserId", new LongType());
        query.addScalar("updatedGroupId", new LongType());
        query.addScalar("completeState", new StringType());
        query.addScalar("performerWorkItemId", new LongType());
        query.addScalar("supervisorId", new DoubleType());
        query.addScalar("directorId", new DoubleType());
        query.addScalar("parentId", new LongType());
        query.addScalar("levelId", new LongType());
        query.addScalar("path", new StringType());
        query.addScalar("reasonStop", new StringType());
        query.addScalar("performerId", new LongType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("taskName", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("baselineStartDate", new DateType());
        query.addScalar("baselineEndDate", new DateType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("catTaskId", new LongType());
        query.addScalar("partnerName", new StringType());

        query.setParameter("constructionId", obj.getConstructionId());
        query.setParameter("performerId", obj.getPerformerId());
        query.setParameter("month", obj.getMonth());
        query.setParameter("year", obj.getYear());

        queryCount.setParameter("constructionId", obj.getConstructionId());
        queryCount.setParameter("performerId", obj.getPerformerId());
        queryCount.setParameter("month", obj.getMonth());
        queryCount.setParameter("year", obj.getYear());
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDTO.class));

        return (List<ConstructionTaskDTO>) query.list();
    }
    //nhantb9 20180823 end
//    hoanm1_20180905_start
    public void updateEntagle(ConstructionTaskDTOUpdateRequest request)
            throws ParseException {
        StringBuilder sql = new StringBuilder(" ");
        sql.append(" UPDATE OBSTRUCTED a ");
        sql.append(" SET a.OBSTRUCTED_STATE = 0  ");
        sql.append(" ,a.UPDATED_USER_ID      =:idUser  ");
        sql.append(" ,a.UPDATED_GROUP_ID     = :groupId ");
        sql.append(" ,a.UPDATED_DATE         = sysdate ");
        sql.append(" ,a.CLOSED_DATE     =sysdate ");
        sql.append(" where a.construction_Id = :constructionId and OBSTRUCTED_STATE !=0 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("idUser", request.getSysUserRequest().getSysUserId());
        query.setParameter("groupId", request.getSysUserRequest().getSysGroupId());
        query.setParameter("constructionId", request.getConstructionTaskDTO().getConstructionId());
        query.executeUpdate();
    }
    public void updateConstruction(Long constructionId) {
      StringBuilder sql = new StringBuilder("Update CONSTRUCTION  set ");
              sql.append(" status = 3,COMPLETE_DATE  = null,COMPLETE_VALUE =null,obstructed_state = 0,is_obstructed  =1 ");
      sql.append(" where CONSTRUCTION_ID = :constructionId ");
      SQLQuery query = getSession().createSQLQuery(sql.toString());
      query.setParameter("constructionId", constructionId);
      query.executeUpdate();
      getSession().flush();
  	
    }

    public void updateVuongTask(Long constructionId) {
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
            
            StringBuilder workUnImplemented = new StringBuilder();
            workUnImplemented.append(" update work_item set status=1 where status !=3 and  CONSTRUCTION_ID in( ");
            workUnImplemented.append(" SELECT CONSTRUCTION_ID FROM CONSTRUCTION_TASK A,DETAIL_MONTH_PLAN B WHERE ");
            workUnImplemented.append(" A.DETAIL_MONTH_PLAN_ID=B.DETAIL_MONTH_PLAN_ID AND B.SIGN_STATE=3 AND B.STATUS=1 AND ");
            workUnImplemented.append(" LPAD(A.MONTH,2,0) = TO_CHAR(SYSDATE,'MM') AND A.YEAR = TO_CHAR(SYSDATE,'YYYY') AND A.TYPE=1 AND LEVEL_ID=2 ");
            workUnImplemented.append(" and nvl(A.COMPLETE_PERCENT,0) =0 and A.CONSTRUCTION_ID = :constructionId) ");
            SQLQuery queryWorkUnImplemented = getSession().createSQLQuery(workUnImplemented.toString());
            
            StringBuilder workImplemented = new StringBuilder();
            workImplemented.append(" update work_item set status=2 where status !=3 and CONSTRUCTION_ID in( ");
            workImplemented.append(" SELECT CONSTRUCTION_ID FROM CONSTRUCTION_TASK A,DETAIL_MONTH_PLAN B WHERE ");
            workImplemented.append(" A.DETAIL_MONTH_PLAN_ID=B.DETAIL_MONTH_PLAN_ID AND B.SIGN_STATE=3 AND B.STATUS=1 AND ");
            workImplemented.append(" LPAD(A.MONTH,2,0) = TO_CHAR(SYSDATE,'MM') AND A.YEAR = TO_CHAR(SYSDATE,'YYYY') AND A.TYPE=1 AND LEVEL_ID=2 ");
            workImplemented.append(" and nvl(A.COMPLETE_PERCENT,0) !=0 and A.CONSTRUCTION_ID = :constructionId) ");
            SQLQuery queryWorkImplemented = getSession().createSQLQuery(workImplemented.toString());
            queryWorkUnImplemented.setParameter("constructionId", constructionId);
            queryWorkImplemented.setParameter("constructionId", constructionId);
            
            query.setParameter("constructionId", constructionId);
            query2.setParameter("constructionId", constructionId);

            query.executeUpdate();
            query2.executeUpdate();
            queryWorkUnImplemented.executeUpdate();
            queryWorkImplemented.executeUpdate();
            getSession().flush();
    }
    
    //Huypq-20181017-start-ConstructionSlow
    public List<ConstructionTaskSlowDTO> getConstructionTaskSlow(GranttDTO granttSearch, List<String> sysGroupId){
    	List<ConstructionTaskSlowDTO> lstDto = new ArrayList<ConstructionTaskSlowDTO>();
        StringBuilder select = new StringBuilder();
        select.append(" consTask.month ||'/'|| consTask.year timeReport,");
		select.append(" (select name from sys_group sg where sg.sys_group_id= consTask.sys_group_id and sg.status=1) sysGroupName,");
        select.append(" cons.code constructionCode,wi.name workItemName, consTask.TASK_NAME taskName,");
		select.append(" sysuser.FULL_NAME fullname,sysuser.email,sysuser.phone_Number phoneNumber,");
		select.append(" consTask.START_DATE startDate,consTask.END_DATE endDate,");
        select.append(" catPro.code provinceCode,(select name from cat_partner catP where catP.cat_partner_id=wi.CONSTRUCTOR_ID and catP.status=1) partnerName ");
        select.append(" from CONSTRUCTION_TASK consTask ");
        select.append(" inner join DETAIL_MONTH_PLAN monthPlan on consTask.DETAIL_MONTH_PLAN_ID = monthPlan.DETAIL_MONTH_PLAN_ID");
        select.append(" left join CONSTRUCTION cons on consTask.CONSTRUCTION_ID = cons.CONSTRUCTION_ID and cons.STATUS != 0 ");
        select.append(" left join CAT_STATION cat on cat.CAT_STATION_ID = cons.CAT_STATION_ID ");
        select.append(" left join CAT_PROVINCE catPro on catPro.CAT_PROVINCE_ID = cat.CAT_PROVINCE_ID ");
        select.append(" left join SYS_USER sysuser on consTask.PERFORMER_ID = sysuser.SYS_USER_ID");
        select.append(" left join WORK_ITEM wi on consTask.WORK_ITEM_ID = wi.WORK_ITEM_ID");
        select.append(" where consTask.LEVEL_ID =4 and consTask.TYPE =1 and consTask.COMPLETE_STATE=2 ");
        select.append(" and monthPlan.MONTH=:month and monthPlan.YEAR=:year and monthPlan.status = 1 ");
        select.append(" and monthPlan.SIGN_STATE=:signState");
        if (sysGroupId != null) {
            select.append(" and monthPlan.sys_group_id in :sysGroupId ");
        }
        StringBuilder sql = new StringBuilder();

        if (!StringUtils.isNullOrEmpty(granttSearch.getKeySearch()) && StringUtils.isNullOrEmpty(granttSearch.getCatProvinceCode())) {
            sql.append("  with parent as (select DISTINCT ");
            sql.append(select.toString());
            sql.append(" start with ((UPPER(consTask.TASK_NAME) LIKE :keysearch OR UPPER(sysuser.FULL_NAME) LIKE :keysearch OR UPPER(sysuser.EMAIL) LIKE :keysearch))");
            sql.append(" connect by prior consTask.PARENT_ID= consTask.CONSTRUCTION_TASK_ID ),");
            sql.append(" child as (select ");
            sql.append(select.toString());
            sql.append(" start with ((UPPER(consTask.TASK_NAME) LIKE :keysearch OR UPPER(sysuser.FULL_NAME) LIKE :keysearch OR UPPER(sysuser.EMAIL) LIKE :keysearch))");
            sql.append(" connect by prior consTask.CONSTRUCTION_TASK_ID= consTask.PARENT_ID )");
            sql.append("  select * from parent union select * from child ");
        } else if (StringUtils.isNullOrEmpty(granttSearch.getKeySearch()) && !StringUtils.isNullOrEmpty(granttSearch.getCatProvinceCode())) {
            sql.append("  with parent as (select DISTINCT ");
            sql.append(select.toString());
            sql.append(" start with ( upper(catPro.NAME) LIKE upper(:catProvinceCode) OR upper(catPro.CODE) LIKE upper(:catProvinceCode) )");
            sql.append(" connect by prior consTask.PARENT_ID= consTask.CONSTRUCTION_TASK_ID ),");
            sql.append(" child as (select ");
            sql.append(select.toString());
            sql.append(" start with ( upper(catPro.NAME) LIKE upper(:catProvinceCode) OR upper(catPro.CODE) LIKE upper(:catProvinceCode) )");
            sql.append(" connect by prior consTask.CONSTRUCTION_TASK_ID= consTask.PARENT_ID )");
            sql.append("  select * from parent union select * from child ");
        } else if (!StringUtils.isNullOrEmpty(granttSearch.getKeySearch()) && !StringUtils.isNullOrEmpty(granttSearch.getCatProvinceCode())) {
            sql.append("  with parent as (select DISTINCT ");
            sql.append(select.toString());
            sql.append(" start with ((UPPER(consTask.TASK_NAME) LIKE :keysearch OR UPPER(sysuser.FULL_NAME) LIKE :keysearch OR UPPER(sysuser.EMAIL) LIKE :keysearch )) ");
            sql.append(" AND ( upper(catPro.NAME) LIKE upper(:catProvinceCode) OR upper(catPro.CODE) LIKE upper(:catProvinceCode) ) ");
            sql.append(" connect by prior consTask.PARENT_ID= consTask.CONSTRUCTION_TASK_ID ),");
            sql.append(" child as (select ");
            sql.append(select.toString());
            sql.append(" start with ((UPPER(consTask.TASK_NAME) LIKE :keysearch OR UPPER(sysuser.FULL_NAME) LIKE :keysearch OR UPPER(sysuser.EMAIL) LIKE :keysearch )) ");
            sql.append(" AND ( upper(catPro.NAME) LIKE upper(:catProvinceCode) OR upper(catPro.CODE) LIKE upper(:catProvinceCode) ) ");
            sql.append(" connect by prior consTask.CONSTRUCTION_TASK_ID= consTask.PARENT_ID )");
            sql.append("  select * from parent union select * from child ");
        } else {
            sql.append("with tbl as (select distinct ");
            sql.append(select.toString());
            if (granttSearch.getComplete_state() != null || granttSearch.getStatus() != null) {
                sql.append(" START WITH level_id=4 ");
                sql.append(" CONNECT BY prior consTask.parent_id= consTask.CONSTRUCTION_TASK_ID)");
            } else {
                sql.append(" start with consTask.parent_id is null  connect by prior consTask.CONSTRUCTION_TASK_ID= consTask.parent_id)");
            }
            sql.append(" select * from tbl ORDER BY provinceCode,constructionCode");
            
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        
        query.addScalar("timeReport", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("taskName", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("partnerName", new StringType());
        
        query.setParameter("signState", signState);
        query.setParameter("month", granttSearch.getMonth());
        query.setParameter("year", granttSearch.getYear());
        if (sysGroupId != null) {
            query.setParameterList("sysGroupId", sysGroupId);
        }
        if (!com.viettel.service.base.utils.StringUtils.isNullOrEmpty(granttSearch.getKeySearch())) {
            query.setParameter("keysearch", "%" + granttSearch.getKeySearch().toUpperCase().trim() + "%");
        }
        if (!StringUtils.isNullOrEmpty(granttSearch.getCatProvinceCode())) {
            query.setParameter("catProvinceCode", "%" + granttSearch.getCatProvinceCode().toUpperCase().trim() + "%");
        }
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskSlowDTO.class));
		return query.list();
    }
    //Huypq-20181017-end
//    hoanm1_20180905_end
    
    public Set<String> getConstructionTaskMap(String type, long month, long year,long sysGroupId){
    	StringBuilder sql = new StringBuilder("select c.code constructionCode from construction_task ct ");
        sql.append(" join construction c on c.construction_id = ct.construction_id ");
        sql.append(" inner join detail_month_plan dmp on ct.detail_month_plan_id = dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1 ");
        sql.append(" where ct.type = :type and  ");
        sql.append("  ct.month = :month and ct.year = :year and ct.sys_group_id= :sysGroupId ");
        
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("month", month);
        query.setParameter("year", year);
        query.setParameter("type", type);
        query.setParameter("sysGroupId", sysGroupId);
        query.addScalar("constructionCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        Set<String>constructionSet = new HashSet<String>();
        List<ConstructionTaskDetailDTO> listCode = query.list();
        for(ConstructionTaskDetailDTO obj : listCode){
        	constructionSet.add(obj.getConstructionCode());
        }
    	return constructionSet;
    }
//  hoanm1_20181023_start
  public List<SysUserDTO> getListUser() {
      StringBuilder sql = new StringBuilder();
      sql.append(" SELECT SYS_USER_ID userId, ");
      sql.append(" UPPER(LOGIN_NAME) loginName, ");
      sql.append(" UPPER(REPLACE(EMAIL,'@viettel.com.vn','')) email ");
      sql.append(" From SYS_USER sys where status=1  ");
      SQLQuery query = getSession().createSQLQuery(sql.toString());
      query.addScalar("userId", new LongType());
      query.addScalar("loginName", new StringType());
      query.addScalar("email", new StringType());
      query.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
      return query.list();
  }

  public void insertConstructionTaskTaskName(List<ConstructionTaskDTO> list ) {
	  try{
	  if (list != null && !list.isEmpty()) {
		  String sql = new String(" insert into construction_task(construction_task_id,sys_group_id,task_name,construction_id,work_item_id,cat_task_id) values (?, ?, ?, ?, ?, ?) ");
	      PreparedStatement pstmt = null;
	      Connection con = null;
	      con=(Connection) getSession();
	      pstmt = con.prepareStatement(sql.toString());
		  int count = 0;
          int size = list.size();
          int group = 0;
      for (ConstructionTaskDTO dto : list) {
          group++;
          count++;
      Long constructionTaskId=getSequence();
      pstmt.setLong(1, constructionTaskId);
      pstmt.setLong(2, dto.getSysGroupId());
      pstmt.setString(3, dto.getTaskName());
      pstmt.setLong(4, dto.getConstructionId());
      pstmt.setLong(5, dto.getWorkItemId());
      pstmt.setLong(6, dto.getCatTaskId());
      pstmt.addBatch();
      if (group == 20) {
          group = 0;
          pstmt.executeBatch();
          con.setAutoCommit(false);
          this.getSession().flush();
      }
      if (group < 20 && count == size) {
          pstmt.executeBatch();
          con.setAutoCommit(false);
          this.getSession().flush();
      }
          }
	  }
	  }catch(Exception ex){
		  ex.getMessage();
	  }
  }
  public Long getSequence() {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("Select construction_task_SEQ.nextVal FROM DUAL");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		return ((BigDecimal) query.uniqueResult()).longValue();
	}
  public List<DepartmentDTO> getListGroup() {
      StringBuilder sql = new StringBuilder();
      sql.append(" select sys_group_id departmentId,code,name from sys_group where status=1 ");
      SQLQuery query = getSession().createSQLQuery(sql.toString());
      query.addScalar("departmentId", new LongType());
      query.addScalar("code", new StringType());
      query.addScalar("name", new StringType());
      query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));
      return query.list();
  }
  public Long getLevel1SysGroupId(Long sysGroupId, String type, Long detailMonthPlanId) {
      Long data = 0L;
      StringBuilder sql = new StringBuilder(
              " SELECT consTask.CONSTRUCTION_TASK_ID constructionTaskId FROM construction_task consTask where consTask.TYPE                =:type ");
      sql.append(
              " AND consTask.DETAIL_MONTH_PLAN_ID = :detailMonthPlanId AND consTask.LEVEL_ID = 1 and consTask.SYS_GROUP_ID =:id  ");
      SQLQuery query = getSession().createSQLQuery(sql.toString());
      query.setParameter("type", type);
      query.setParameter("id", sysGroupId);
      query.setParameter("detailMonthPlanId", detailMonthPlanId);
      query.addScalar("constructionTaskId", new LongType());
      List<Long> res = query.list();
      if (res != null && !res.isEmpty())
          data = res.get(0);
      return data;
  }
  
  public List<ConstructionTaskDetailDTO> getLevel2ConstructionCode( String type,
          Long levelId, Long detailMonthPlanId,Long sysGroupId) {
	  StringBuilder sql = new StringBuilder(
			  " SELECT consTask.CONSTRUCTION_TASK_ID constructionTaskId,upper(consTask.TASK_NAME) constructionCode FROM construction_task consTask ");
	  		sql.append(
	  			" WHERE consTask.type   = :type AND consTask.LEVEL_ID = :levelId and consTask.detail_month_plan_id = :detailMonthPlanId and consTask.SYS_GROUP_ID =:id");
	  	SQLQuery query = getSession().createSQLQuery(sql.toString());
	  	query.setParameter("type", type);
	  	query.setParameter("levelId", levelId);
	  	query.setParameter("detailMonthPlanId", detailMonthPlanId);
	  	query.setParameter("id", sysGroupId);
	  	query.addScalar("constructionTaskId", new LongType());
	  	query.addScalar("constructionCode", new StringType());
	  	query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
	  	return query.list();
  	}
  
//  hoanm1_20181023_end
  
  //Huypq_20181025-start-chart
  @SuppressWarnings("unchecked")
public List<ConstructionTaskDTO> getDataChart(ConstructionTaskDTO obj){
	  StringBuilder sql= new StringBuilder(" SELECT " + 	
	  		"    TO_CHAR(end_date,'dd') startDateChart, " + 
	  		"    type_name typeName, " + 
	  		"    quantity quantityChart " + 
	  		" FROM " + 
	  		"    chart_quantity_complete " + 
	  		" WHERE 1=1 ");
	  if (obj.getDateFrom() != null) {
			sql.append(" and end_date >= :dateFrom ");
		}
	  if (obj.getDateTo() != null) {
			sql.append(" and end_date <= :dateTo ");
		}
      if (obj.getSysGroupId() != null) {
          sql.append(" AND SYS_GROUP_ID  = :sysGroupId");
      } else {
    	  sql.append(" AND SYS_GROUP_ID  = 1");
      }
	  sql.append(" order by TO_CHAR(end_date,'dd') ");
	  SQLQuery query = getSession().createSQLQuery(sql.toString());
	  query.addScalar("startDateChart", new StringType());
	  query.addScalar("quantityChart", new StringType());
	  query.addScalar("typeName", new StringType());
	  
	  if (obj.getDateFrom() != null) {
			query.setParameter("dateFrom", obj.getDateFrom());
		}
	  if (obj.getDateTo() != null) {
		  query.setParameter("dateTo", obj.getDateTo());
		}
	  if (obj.getSysGroupId() != null) {
		  query.setParameter("sysGroupId", obj.getSysGroupId());
	  }
	  
	  query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDTO.class));

	  return query.list();  
  }
  
  
  public List<ConstructionTaskDTO> listDay(ConstructionTaskDTO obj){
	  StringBuilder sql = new StringBuilder("select distinct TO_CHAR(end_date,'dd') startDateChart from chart_quantity_complete where 1=1 ");
	  
	  if (obj.getDateFrom() != null) {
			sql.append(" and end_date >= :dateFrom ");
		}
	  if (obj.getDateTo() != null) {
			sql.append(" and end_date <= :dateTo ");
		}
	    if (obj.getSysGroupId() != null) {
	        sql.append(" AND SYS_GROUP_ID  = :sysGroupId");
	    } else {
	  	  sql.append(" AND SYS_GROUP_ID  = 1");
	    }
	    sql.append(" order by TO_CHAR(end_date,'dd') ");
	    SQLQuery query = getSession().createSQLQuery(sql.toString());
		
		  query.addScalar("startDateChart", new StringType());
		
		  if (obj.getDateFrom() != null) {
				query.setParameter("dateFrom", obj.getDateFrom());
			}
		  if (obj.getDateTo() != null) {
			  query.setParameter("dateTo", obj.getDateTo());
			}
		  if (obj.getSysGroupId() != null) {
			  query.setParameter("sysGroupId", obj.getSysGroupId());
		  }
		  
		  query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDTO.class));

		  return query.list();  
  }
  
  public List<ConstructionTaskDTO> listDayAcc(ConstructionTaskDTO obj){
	  StringBuilder sql = new StringBuilder("select distinct TO_CHAR(end_date,'dd') startDateChart from chart_quantity_complete_acc where 1=1 ");
	  
	  if (obj.getDateFrom() != null) {
			sql.append(" and end_date >= :dateFrom ");
		}
	  if (obj.getDateTo() != null) {
			sql.append(" and end_date <= :dateTo ");
		}
	    if (obj.getSysGroupId() != null) {
	        sql.append(" AND SYS_GROUP_ID  = :sysGroupId");
	    } else {
	  	  sql.append(" AND SYS_GROUP_ID  = 1");
	    }
	    sql.append(" order by startDateChart ");
	    SQLQuery query = getSession().createSQLQuery(sql.toString());
		
		  query.addScalar("startDateChart", new StringType());
		
		  if (obj.getDateFrom() != null) {
				query.setParameter("dateFrom", obj.getDateFrom());
			}
		  if (obj.getDateTo() != null) {
			  query.setParameter("dateTo", obj.getDateTo());
			}
		  if (obj.getSysGroupId() != null) {
			  query.setParameter("sysGroupId", obj.getSysGroupId());
		  }
		  
		  query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDTO.class));

		  return query.list();  
  }
  @SuppressWarnings("unchecked")
  public List<ConstructionTaskDTO> getDataChartAcc(ConstructionTaskDTO obj){
  	  StringBuilder sql= new StringBuilder(" SELECT " + 
  	  		"    TO_CHAR(end_date,'dd') startDateChart, " + 
  	  		"    type_name typeName, " + 
  	  		"    quantity quantityChart " + 
  	  		" FROM " + 
  	  		"    chart_quantity_complete_acc " + 
  	  		" WHERE 1=1 ");
  	  if (obj.getDateFrom() != null) {
  			sql.append(" and end_date >= :dateFrom ");
  		}
  	  if (obj.getDateTo() != null) {
  			sql.append(" and end_date <= :dateTo ");
  		}
        if (obj.getSysGroupId() != null) {
            sql.append(" AND SYS_GROUP_ID  = :sysGroupId");
        } else {
      	  sql.append(" AND SYS_GROUP_ID  = 1");
        }
  	  sql.append(" order by startDateChart ");
  	  SQLQuery query = getSession().createSQLQuery(sql.toString());
  	  query.addScalar("startDateChart", new StringType());
  	  query.addScalar("quantityChart", new StringType());
  	  query.addScalar("typeName", new StringType());
  	  
  	  if (obj.getDateFrom() != null) {
  			query.setParameter("dateFrom", obj.getDateFrom());
  		}
  	  if (obj.getDateTo() != null) {
  		  query.setParameter("dateTo", obj.getDateTo());
  		}
  	  if (obj.getSysGroupId() != null) {
  		  query.setParameter("sysGroupId", obj.getSysGroupId());
  	  }
  	  
  	  query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDTO.class));

  	  return query.list();  
    }
  //Huypq_20181025-end-chart
  
//HuyPQ-20181102-start
  public List<ConstructionTaskDTO> getDataSheetTwoExcel(ConstructionTaskDTO obj,List<String> groupIdList) {
  	StringBuilder sql = new StringBuilder("with tbl as (SELECT "
  			+ " sg.name sysGroupName,"
  			+ " prov.code provinceCode,"
  			+ " task.task_name workItemName,"
  			+ " sum(CASE WHEN wi.status =3 and wi.IS_INTERNAL=2 THEN 1 else 0 END) HMDT_thicongxong,"
  			+ " sum(CASE WHEN wi.status =3 and wi.IS_INTERNAL=2 THEN wi.quantity/1000000 else 0 END) GTDT_thicongxong,"
  			+ " sum(CASE WHEN wi.status =3 and wi.IS_INTERNAL=1 THEN 1 else 0 END) HMDV_thicongxong,"
  			+ " sum(CASE WHEN wi.status =3 and wi.IS_INTERNAL=1 THEN wi.quantity/1000000 else 0 END) GTDV_thicongxong,"
  			+ " sum(CASE WHEN wi.status =2 and wi.IS_INTERNAL=2 THEN 1 else 0 END) HMDT_dangthicong,"
  			+ " sum(CASE WHEN wi.status =2 and wi.IS_INTERNAL=2 THEN task.quantity/1000000 else 0 END) GTDT_dangthicong," 
  			+ " sum(CASE WHEN wi.status =2 and wi.IS_INTERNAL=1 THEN 1 else 0 END) HMDV_dangthicong,"
  			+ " sum(CASE WHEN wi.status =2 and wi.IS_INTERNAL=1 THEN task.quantity/1000000 else 0 END) GTDV_dangthicong,"
  			+ " sum(CASE WHEN wi.status =1 and wi.IS_INTERNAL=2 THEN 1 else 0 END) HMDT_chuathicong,"
  			+ " sum(CASE WHEN wi.status =1 and wi.IS_INTERNAL=2 THEN task.quantity/1000000 else 0 END) GTDT_chuathicong,"
  			+ " sum(CASE WHEN wi.status =1 and wi.IS_INTERNAL=1 THEN 1 else 0 END) HMDV_chuathicong,"
  			+ " sum(CASE WHEN wi.status =1 and wi.IS_INTERNAL=1 THEN task.quantity/1000000 else 0 END) GTDV_chuathicong,"
  			+ " sum(CASE WHEN wi.status =4 and wi.IS_INTERNAL=2 THEN 1 else 0 END) HMDT_vuong,"
  			+ " sum(CASE WHEN wi.status =4 and wi.IS_INTERNAL=2 THEN task.quantity/1000000 else 0 END) GTDT_vuong,"
  			+ " sum(CASE WHEN wi.status =4 and wi.IS_INTERNAL=1 THEN 1 else 0 END) HMDV_vuong,"
  			+ " sum(CASE WHEN wi.status =4 and wi.IS_INTERNAL=1 THEN task.quantity/1000000 else 0 END) GTDV_vuong"
  			+ " FROM construction_task task,DETAIL_MONTH_PLAN dmp, construction cst, work_item wi, cat_station sta,"
  			+ " cat_province prov,cat_construction_type cst_type,sys_user sysu,sys_group sg"
  			+ " WHERE task.DETAIL_MONTH_PLAN_ID =dmp.DETAIL_MONTH_PLAN_ID AND dmp.SIGN_STATE=3"
  			+ " AND dmp.status=1 AND task.type =1 AND task.level_id =3 AND task.construction_id =cst.construction_id(+)"
  			+ " AND task.work_item_id=wi.work_item_id(+) AND cst.cat_station_id =sta.cat_station_id"
  			+ " AND sta.cat_province_id =prov.cat_province_id AND cst.cat_construction_type_id=cst_type.cat_construction_type_id"
  			+ " AND task.performer_id =sysu.sys_user_id AND task.sys_group_id =sg.sys_group_id");
  			if (obj.getKetthuc_trienkhai_den() != null && obj.getKetthuc_trienkhai_tu() != null) {
  		         sql.append(" and task.end_date >= :ketthuc_trienkhai_tu and task.end_date <= :ketthuc_trienkhai_den ");
  		     }
  		     if (obj.getSysUserId() != null) {
  		         sql.append(" and task.PERFORMER_ID= :sysUserId ");
  		     }
  		     if (!StringUtils.isNullOrEmpty(obj.getProvinceCode())) {
  		         sql.append(" and prov.code= :provinceCode ");
  		     }
//  				hoanm1_20180815_start
  		     if (groupIdList != null && !groupIdList.isEmpty()) {
  		         sql.append(" and prov.CAT_PROVINCE_ID in :groupIdList ");
  		     }
//  				hoanm1_20180815_end
  		     if (obj.getCatConstructionTypeId() != null) {
  		         sql.append(" and cst_type.CAT_CONSTRUCTION_TYPE_ID= :catConstructionTypeId ");
  		     }
  		     if (obj.getConstructionId() != null) {
  		         sql.append(" and task.CONSTRUCTION_ID= :constructionId ");
  		     }
  		     if (obj.getWorkItemId() != null) {
  		         sql.append(" and task.work_item_id= :workItemId ");
  		     }
  		     if (obj.getStationId() != null) {
  		         sql.append(" and sta.CAT_STATION_ID = :stationId ");
  		     }
  		     if (obj.getSysGroupId() != null) {
  		         sql.append(" and task.sys_group_id = :sysGroupId ");
  		     }
  		   sql.append( " group by sg.name,prov.code,task.task_name),"
  			+ " tbl1 as("
  			+ " select 2 type,to_char(sysgroupname)sysgroupname,''loctinh,to_char(provinceCode)provinceCode,to_char(workItemName)workItemName,"
  			+ " HMDT_thicongxong,GTDT_thicongxong,HMDV_thicongxong,GTDV_thicongxong,"
  			+ " (HMDT_thicongxong + HMDV_thicongxong) HMTong_thicongxong,(GTDT_thicongxong + GTDV_thicongxong)GTTong_thicongxong,"
  			+ " HMDT_dangthicong,GTDT_dangthicong,HMDV_dangthicong,GTDV_dangthicong,"
  			+ " (HMDT_dangthicong + HMDV_dangthicong) HMTong_dangthicong,(GTDT_dangthicong+ GTDV_dangthicong)GTTong_dangthicong,"
  			+ " HMDT_chuathicong,GTDT_chuathicong,HMDV_chuathicong,GTDV_chuathicong,"
  			+ " (HMDT_chuathicong+HMDV_chuathicong)HMTong_chuathicong,(GTDT_chuathicong+GTDV_chuathicong)GTTongchuathicong,"
  			+ " HMDT_vuong,GTDT_vuong,HMDV_vuong,GTDV_vuong,"
  			+ " (HMDT_vuong+HMDV_vuong)HMTong_vuong,(GTDT_vuong + GTDV_vuong)GTTong_vuong"
  			+ " from tbl union all"
  			+ " select 1 type,to_char(sysgroupname),to_char(provinceCode) loctinh,to_char(provinceCode),to_char(provinceCode) workItemName,"
  			+ " sum(HMDT_thicongxong),sum(GTDT_thicongxong),sum(HMDV_thicongxong),sum(GTDV_thicongxong),"
  			+ " sum(HMDT_thicongxong + HMDV_thicongxong) HMTong_thicongxong,sum(GTDT_thicongxong + GTDV_thicongxong)GTTong_thicongxong,"
  			+ " sum(HMDT_dangthicong),sum(GTDT_dangthicong),sum(HMDV_dangthicong),sum(GTDV_dangthicong),"
  			+ " sum(HMDT_dangthicong + HMDV_dangthicong) HMTong_dangthicong,sum(GTDT_dangthicong+ GTDV_dangthicong)GTTong_dangthicong,"
  			+ " sum(HMDT_chuathicong),sum(GTDT_chuathicong),sum(HMDV_chuathicong),sum(GTDV_chuathicong),"
  			+ " sum(HMDT_chuathicong+HMDV_chuathicong)HMTong_chuathicong,sum(GTDT_chuathicong+GTDV_chuathicong)GTTongchuathicong,"
  			+ " sum(HMDT_vuong),sum(GTDT_vuong),sum(HMDV_vuong),sum(GTDV_vuong),"
  			+ " sum(HMDT_vuong+HMDV_vuong)HMTong_vuong,sum(GTDT_vuong + GTDV_vuong)GTTong_vuong"
  			+ " from tbl group by sysGroupName,provinceCode"
  			+ " union all select" 
  			+ " 0 type,''sysgroupname,'All tỉnh' loctinh, '' provinceCode,'' WORKITEMNAME,"
  			+ " sum(HMDT_thicongxong),sum(GTDT_thicongxong),sum(HMDV_thicongxong),sum(GTDV_thicongxong),"
  			+ " sum(HMDT_thicongxong + HMDV_thicongxong) HMTong_thicongxong,sum(GTDT_thicongxong + GTDV_thicongxong)GTTong_thicongxong,"
  			+ " sum(HMDT_dangthicong),sum(GTDT_dangthicong),sum(HMDV_dangthicong),sum(GTDV_dangthicong),"
  			+ " sum(HMDT_dangthicong + HMDV_dangthicong) HMTong_dangthicong,sum(GTDT_dangthicong+ GTDV_dangthicong)GTTong_dangthicong,"
  			+ " sum(HMDT_chuathicong),sum(GTDT_chuathicong),sum(HMDV_chuathicong),sum(GTDV_chuathicong),"
  			+ " sum(HMDT_chuathicong+HMDV_chuathicong)HMTong_chuathicong,sum(GTDT_chuathicong+GTDV_chuathicong)GTTongchuathicong,"
  			+ " sum(HMDT_vuong),sum(GTDT_vuong),sum(HMDV_vuong),sum(GTDV_vuong),"
  			+ " sum(HMDT_vuong+HMDV_vuong)HMTong_vuong,sum(GTDT_vuong + GTDV_vuong)GTTong_vuong"
  			+ " from tbl)"
  			+ " select  type deployType,sysgroupname,loctinh fillCatProvince,provinceCode catProvinceCode,workItemName,"
  			+ " HMDT_thicongxong workItemPartFinish,GTDT_thicongxong quantityPartFinish,HMDV_thicongxong workItemConsFinish,GTDV_thicongxong quantityConsFinish,"
  			+ " HMTong_thicongxong workItemSumFinish,GTTong_thicongxong quantitySumFinish,"
  			+ " HMDT_dangthicong workItemPartConstructing,GTDT_dangthicong quantityPartConstructing,HMDV_dangthicong workItemConsConstructing,GTDV_dangthicong quantityConsConstructing,"
  			+ " HMTong_dangthicong workItemSumConstructing,GTTong_dangthicong quantitySumConstructing,"
  			+ " HMDT_chuathicong workItemPartNonConstruction,GTDT_chuathicong quantityPartNonConstruction,HMDV_chuathicong workItemConsNonConstruction,GTDV_chuathicong quantityConsNonConstruction,"
  			+ " HMTong_chuathicong workItemSumNonConstruction,GTTongchuathicong quantitySumNonConstruction,"
  			+ " HMDT_vuong workItemPartStuck,GTDT_vuong quantityPartStuck,HMDV_vuong workItemConsStuck,GTDV_vuong quantityConsStuck,"
  			+ " HMTong_vuong workItemSumStuck,GTTong_vuong quantitySumStuck"
  			+ " from tbl1 order by sysgroupname,provinceCode,type ");
  	SQLQuery query=getSession().createSQLQuery(sql.toString());
  	 
  	query.addScalar("deployType", new StringType());
  	query.addScalar("sysGroupName", new StringType());
  	query.addScalar("fillCatProvince", new StringType());
  	query.addScalar("catProvinceCode", new StringType());
  	query.addScalar("workItemName", new StringType());
  	query.addScalar("workItemPartFinish", new LongType());
  	query.addScalar("quantityConsFinish", new DoubleType());
  	query.addScalar("workItemConsFinish", new LongType());
  	query.addScalar("quantityPartFinish", new DoubleType());
  	query.addScalar("workItemSumFinish", new LongType());
  	query.addScalar("quantitySumFinish", new DoubleType());
  	query.addScalar("workItemPartConstructing", new LongType());
  	query.addScalar("quantityPartConstructing", new DoubleType());
  	query.addScalar("workItemConsConstructing", new LongType());
  	query.addScalar("quantityConsConstructing", new DoubleType());
  	query.addScalar("workItemSumConstructing", new LongType());
  	query.addScalar("quantitySumConstructing", new DoubleType());
  	query.addScalar("workItemPartNonConstruction", new LongType());
  	query.addScalar("quantityPartNonConstruction", new DoubleType());
  	query.addScalar("workItemConsNonConstruction", new LongType());
  	query.addScalar("quantityConsNonConstruction", new DoubleType());
  	query.addScalar("workItemSumNonConstruction", new LongType());
  	query.addScalar("quantitySumNonConstruction", new DoubleType());
  	query.addScalar("workItemPartStuck", new LongType());
  	query.addScalar("quantityPartStuck", new DoubleType());
  	query.addScalar("workItemConsStuck", new LongType());
  	query.addScalar("quantityConsStuck", new DoubleType());
  	query.addScalar("workItemSumStuck", new LongType());
  	query.addScalar("quantitySumStuck", new DoubleType());
  	query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDTO.class));
  	if (obj.getKetthuc_trienkhai_den() != null) {
        query.setDate("ketthuc_trienkhai_den", obj.getKetthuc_trienkhai_den());
    }
    if (obj.getKetthuc_trienkhai_tu() != null) {
        query.setDate("ketthuc_trienkhai_tu", obj.getKetthuc_trienkhai_tu());
    }
    if (obj.getSysUserId() != null) {
        query.setParameter("sysUserId", obj.getSysUserId());
    }
    if (!StringUtils.isNullOrEmpty(obj.getProvinceCode())) {
        query.setParameter("provinceCode", obj.getProvinceCode());
    }
//	hoanm1_20180815_start
    if (groupIdList != null && !groupIdList.isEmpty()) {
        query.setParameterList("groupIdList", groupIdList);
    }
//		hoanm1_20180815_end
    if (obj.getCatConstructionTypeId() != null) {
        query.setParameter("catConstructionTypeId", obj.getCatConstructionTypeId());
    }
    if (obj.getConstructionId() != null) {
        query.setParameter("constructionId", obj.getConstructionId());
    }
    if (obj.getWorkItemId() != null) {
        query.setParameter("workItemId", obj.getWorkItemId());
    }
    if (obj.getStationId() != null) {
        query.setParameter("stationId", obj.getStationId());
    }
    if (obj.getSysGroupId() != null) {
        query.setParameter("sysGroupId", obj.getSysGroupId());
    }
  	return query.list();
  }
  //HuyPQ-20181102-end
    public List<DepartmentDTO> getListGroupByIds(List<Long> ids) {
      StringBuilder sql = new StringBuilder();
      sql.append(" select sys_group_id departmentId,name from sys_group where sys_group_id in (:idList) ");
      SQLQuery query = getSession().createSQLQuery(sql.toString());
      query.setParameterList("idList", ids);
      query.addScalar("departmentId", new LongType());
      query.addScalar("name", new StringType());
      query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));
      return query.list();
  }
//TungTT_20182911_start chưa sửa

public void approveRp_HSHC(ConstructionDetailDTO obj) {
	// TODO Auto-generated method stub
	
	StringBuilder sql = new StringBuilder();
    sql.append("UPDATE rp_hshc hshc ");
//    hoanm1_20181215_start
//    sql.append(" SET  hshc.completevalue = hshc.completevalue_plan");
    sql.append(" SET  hshc.completevalue = :completeValue *1000000");
    sql.append(",hshc.completestate = 2 ");
    sql.append(",hshc.RECEIVERECORDSDATE = sysdate, COMPLETE_UPDATE_DATE=sysdate");
    sql.append(", hshc.complete_user_update = :SysUserId ");
    sql.append(" 	WHERE hshc.RP_HSHC_ID = :rpHSHCId ");


    SQLQuery query = getSession().createSQLQuery(sql.toString());
    query.setParameter("SysUserId", obj.getSysUserId());
    query.setParameter("rpHSHCId", obj.getRpHshcId());
    query.setParameter("completeValue", obj.getCompleteValue());
    query.executeUpdate();
//    hoanm1_20181215_end
    

}

public void updateUndoHSHC(ConstructionDetailDTO obj) {
	// TODO Auto-generated method stub
	
	StringBuilder sql = new StringBuilder();
    sql.append("UPDATE rp_hshc hshc ");
    sql.append(" SET hshc.completevalue = '0',");
    sql.append(" hshc.completestate = 1 ");
    sql.append(",hshc.COMPLETE_UPDATE_DATE = sysdate");
    sql.append(", hshc.complete_user_update = :SysUserId,APPROVE_COMPLETE_DESCRIPTION=null ");
    sql.append(" 	WHERE hshc.RP_HSHC_ID = :rpHSHCId ");


    SQLQuery query = getSession().createSQLQuery(sql.toString());
    query.setParameter("SysUserId", obj.getSysUserId());
    query.setParameter("rpHSHCId", obj.getRpHshcId());
    query.executeUpdate();
}

public Long approveHSHCConstruction(ConstructionDetailDTO obj) {
	// TODO Auto-generated method stub
//	hoanm1_20181219_start
	StringBuilder sql = new StringBuilder();
	sql.append("UPDATE CONSTRUCTION con ");
    sql.append(" SET con.APPROVE_COMPLETE_VALUE = ");
    sql.append(" 	(SELECT SUM(completevalue ) ");
    sql.append(" 	 FROM rp_hshc hshc");
    sql.append(" 	 WHERE hshc.CONSTRUCTIONID= :constructionId and hshc.completestate =2 ) ");
    sql.append(",con.APPROVE_COMPLETE_STATE = 2 ,RECEIVE_RECORDS_DATE=sysdate ");
//    hoanm1_20181219_end
    sql.append(",con.complete_approved_update_date = sysdate");
    sql.append(", con.COMPLETE_APPROVED_USER_ID= :SysUserId ");
    sql.append(" 	WHERE con.CONSTRUCTION_ID=:constructionId");


    SQLQuery query = getSession().createSQLQuery(sql.toString());
    query.setParameter("SysUserId", obj.getSysUserId());
    query.setParameter("constructionId", obj.getConstructionId());
    return (long)query.executeUpdate();
	
}

public Long updateUndoHSHCConstruction(ConstructionDetailDTO obj) {
	// TODO Auto-generated method stub
//	hoanm1_20181219_start
	StringBuilder sql = new StringBuilder();
	sql.append("UPDATE CONSTRUCTION con ");
    sql.append(" SET con.APPROVE_COMPLETE_VALUE = ");
    sql.append(" 	(SELECT SUM(completevalue ) ");
    sql.append(" 	 FROM rp_hshc hshc");
    sql.append(" 	 WHERE hshc.CONSTRUCTIONID= :constructionId and hshc.completestate =2 ) ");
    sql.append(" 	 , APPROVE_COMPLETE_STATE=1,APPROVE_COMPLETE_DESCRIPTION=null ");
//    hoanm1_20181219_end
    sql.append(" 	WHERE con.CONSTRUCTION_ID=:constructionId");
    SQLQuery query = getSession().createSQLQuery(sql.toString());
    query.setParameter("constructionId", obj.getConstructionId());
    return (long)query.executeUpdate();
	
}


public ConstructionDetailDTO getUserUpdate(Long rpHshcId) {
	StringBuilder str = new StringBuilder("SELECT COMPLETE_USER_UPDATE completeUserUpdate FROM RP_HSHC WHERE 1=1 ");
	if(rpHshcId != null) {
		str.append("AND RP_HSHC_ID=:rpHshcId ");
	}
	SQLQuery query=getSession().createSQLQuery(str.toString());
	query.addScalar("completeUserUpdate", new LongType());
	query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
	if(rpHshcId != null) {
		query.setParameter("rpHshcId", rpHshcId);
	}
	return (ConstructionDetailDTO) query.uniqueResult();
}

//TungTT_20182911_end
	//	hoanm1_20190122_start
	public List<DomainDTO> getReceiveHandover(Long constructionId) {
		StringBuilder sql = new StringBuilder("");
		sql.append(" select CAT_STATION_HOUSE_ID catStationHouseId,CNT_CONTRACT_ID cntContractId,Received_goods_date receivedGoodsDate from ASSIGN_HANDOVER where construction_id =:constructionId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("catStationHouseId", new StringType());
		query.addScalar("cntContractId", new StringType());
		query.addScalar("receivedGoodsDate", new StringType());
		query.setParameter("constructionId", constructionId);
		query.setResultTransformer(Transformers.aliasToBean(DomainDTO.class));
		return query.list();
	}

	public void updateHandoverStation(Long constructionId,String catStationHouseId,String cntContractId) {
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append("UPDATE Assign_Handover SET Received_date=sysdate,Received_status=2 WHERE construction_id =:constructionId ");
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		query.setParameter("constructionId",constructionId);
      
		StringBuilder stringBuilderStation = new StringBuilder();
		stringBuilderStation.append("UPDATE Rp_station_complete SET Handover_date_build=sysdate WHERE CAT_STATION_HOUSE_ID =:catStationHouseId and CNT_CONTRACT_ID =:cntContractId ");
		SQLQuery queryStation = getSession().createSQLQuery(stringBuilderStation.toString());
		queryStation.setParameter("catStationHouseId", Long.parseLong(catStationHouseId));
		queryStation.setParameter("cntContractId", Long.parseLong(cntContractId));
      
		StringBuilder stringBuilderCst = new StringBuilder();
		stringBuilderCst.append("UPDATE construction SET Handover_date_build=sysdate WHERE construction_id =:constructionId ");
		SQLQuery queryCst = getSession().createSQLQuery(stringBuilderCst.toString());
		queryCst.setParameter("constructionId",constructionId);
		
		query.executeUpdate();
		queryStation.executeUpdate();
		queryCst.executeUpdate();
		getSession().flush();
	}
	//	hoanm1_20190122_end
}
