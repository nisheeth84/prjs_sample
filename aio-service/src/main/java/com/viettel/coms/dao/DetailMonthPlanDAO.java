/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.coms.bo.DetailMonthPlanBO;
import com.viettel.coms.dto.*;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.ktts2.dto.KttsUserSession;
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
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("detailMonthPlanDAO")
public class DetailMonthPlanDAO extends BaseFWDAOImpl<DetailMonthPlanBO, Long> {

    public DetailMonthPlanDAO() {
        this.model = new DetailMonthPlanBO();
    }

    public DetailMonthPlanDAO(Session session) {
        this.session = session;
    }

    public List<DetailMonthPlaningDTO> doSearch(DetailMonthPlanSimpleDTO obj, List<String> groupIdList) {
        StringBuilder sql = new StringBuilder("SELECT DMP.DETAIL_MONTH_PLAN_ID detailMonthPlanId," + " DMP.YEAR year ,"
                + " DMP.sys_group_id sysGroupId ," + " DMP.MONTH month ," + " DMP.CREATED_DATE createdDate ,"
                + " DMP.Created_user_id createdUserId, " + " DMP.Created_group_id createdGroupId ," + " DMP.CODE code ,"
                + " DMP.NAME name ," + " DMP.Sign_state signState ," + " DMP.STATUS status , "
                + " DMP.DESCRIPTION description ," + " SYSG.NAME sysName, " + " SYSG.Code sysGroupCode "
                + " FROM DETAIL_MONTH_PLAN DMP LEFT JOIN sys_group SYSG ON DMP.sys_group_id=SYSG.sys_group_id"
                + " WHERE 1=1 ");

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(DMP.CODE) LIKE upper(:keySearch) OR  upper(DMP.YEAR) LIKE upper(:keySearch) OR upper(DMP.NAME) LIKE upper(:keySearch) escape '&')");
        }
        if (StringUtils.isNotEmpty(obj.getStatus())) {
            sql.append(" AND DMP.STATUS = :status");

        }
        if (obj.getSignStateList() != null && !obj.getSignStateList().isEmpty()) {
            sql.append(" AND DMP.Sign_state  in :signStateList");
        }
        if (obj.getMonthList() != null && !obj.getMonthList().isEmpty()) {
            sql.append(" AND DMP.MONTH  in :monthList");
        }
        if (obj.getYearList() != null && !obj.getYearList().isEmpty()) {
            sql.append(" AND DMP.YEAR  in :yearList");
        }

        if (obj.getSysGroupId() != null) {
            sql.append(" AND SYSG.SYS_GROUP_ID  = :sysGroupId");
        }
        if (groupIdList != null && !groupIdList.isEmpty()) {
            sql.append(" AND DMP.sys_group_id  in :groupIdList");
        }
        sql.append(" ORDER BY DMP.DETAIL_MONTH_PLAN_ID DESC");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        if (groupIdList != null && !groupIdList.isEmpty()) {
            query.setParameterList("groupIdList", groupIdList);
            queryCount.setParameterList("groupIdList", groupIdList);
        }
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
            queryCount.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
        }

        if (StringUtils.isNotEmpty(obj.getStatus()) && !"2".equals(obj.getStatus())) {
            query.setParameter("status", obj.getStatus());
            queryCount.setParameter("status", obj.getStatus());
        }

        if (obj.getSignStateList() != null && !obj.getSignStateList().isEmpty()) {
            query.setParameterList("signStateList", obj.getSignStateList());
            queryCount.setParameterList("signStateList", obj.getSignStateList());
        }
        if (obj.getMonthList() != null && !obj.getMonthList().isEmpty()) {
            query.setParameterList("monthList", obj.getMonthList());
            queryCount.setParameterList("monthList", obj.getMonthList());
        }
        if (obj.getYearList() != null && !obj.getYearList().isEmpty()) {
            query.setParameterList("yearList", obj.getYearList());
            queryCount.setParameterList("yearList", obj.getYearList());
        }
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
        }

        query.addScalar("detailMonthPlanId", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("signState", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("sysName", new StringType());
        query.addScalar("sysGroupCode", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(DetailMonthPlaningDTO.class));
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public boolean checkMonthYearSys(Long month, Long year, Long sysGroupId, Long detailMonthId) {
        StringBuilder sql = new StringBuilder(
                "SELECT COUNT(DETAIL_MONTH_PLAN_ID) FROM DETAIL_MONTH_PLAN where 1=1 and status = 1 and month=:month and year=:year and sys_group_id = :sysGroupId");
        if (detailMonthId != null) {
            sql.append(" AND DETAIL_MONTH_PLAN_ID != :detailMonthId ");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("year", year);
        query.setParameter("month", month);
        query.setParameter("sysGroupId", sysGroupId);
        if (detailMonthId != null) {
            query.setParameter("detailMonthId", detailMonthId);
        }
        return ((BigDecimal) query.uniqueResult()).intValue() > 0;
    }

    public DetailMonthPlanSimpleDTO getById(Long id) {
        StringBuilder sql = new StringBuilder("SELECT detailMonth.detail_month_plan_id detailMonthPlanId,"
                + " detailMonth.YEAR year ," + " detailMonth.MONTH month ," + " detailMonth.SYS_GROUP_ID sysGroupId ,"
                + " detailMonth.CREATED_DATE createdDate ," + " detailMonth.Created_user_id createdUserId, "
                + " detailMonth.Created_group_id createdGroupId ," + " detailMonth.CODE code ,"
                + " detailMonth.NAME name ," + " detailMonth.Sign_state signState ," + " detailMonth.STATUS status , "
                + " sg.NAME sysGroupName , " + " sg.Code sysGroupCode , " + " detailMonth.DESCRIPTION description"
                + " FROM DETAIL_MONTH_PLAN detailMonth"
                + " LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ON detailMonth.SYS_GROUP_ID =sg.SYS_GROUP_ID"
                + " WHERE DETAIL_MONTH_PLAN_ID =:id ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("detailMonthPlanId", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("signState", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("sysGroupCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(DetailMonthPlanSimpleDTO.class));
        return (DetailMonthPlanSimpleDTO) query.uniqueResult();
    }

    public void remove(Long detailMonthPlanId) {
        StringBuilder sql = new StringBuilder(
                "UPDATE DETAIL_MONTH_PLAN set status = 0  where DETAIL_MONTH_PLAN_ID = :detailMonthPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.executeUpdate();

    }
//    hungtd_20181213_start
    public void updateRegistry(Long detailMonthPlanId) {
        StringBuilder sql = new StringBuilder(
                "UPDATE DETAIL_MONTH_PLAN set SIGN_STATE = '3'  where DETAIL_MONTH_PLAN_ID = :detailMonthPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("detailMonthPlanId", detailMonthPlanId);
        query.executeUpdate();

    }
//    hungtd_20181213_end

    public List<TmpnTargetDetailDTO> getYearPlanDetailTarget(DetailMonthPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT   sum(ypd.QUANTITY) quantity,   sum(ypd.COMPLETE) complete,(select SUM(yps.SOURCE/1000000) from TMPN_SOURCE yps WHERE yps.year  =:year AND yps.month             = :month AND yps.SYS_GROUP_ID      = :sysGroupId )source, "
                        + " sum(ypd.REVENUE) revenue,  sg.NAME sysGroupName FROM TMPN_TARGET ypd "
                        + " LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ON ypd.SYS_GROUP_ID  =sg.SYS_GROUP_ID "
                        + " WHERE ypd.year       =:year AND ypd.month        = :month AND ypd.SYS_GROUP_ID = :sysGroupId "
                        + " group by sg.NAME ORDER BY sg.NAME ASC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("year", obj.getYear());
        query.setParameter("month", obj.getMonth());
        query.setParameter("sysGroupId", obj.getSysGroupId());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("complete", new DoubleType());
        query.addScalar("revenue", new DoubleType());
        query.addScalar("source", new DoubleType());

        query.addScalar("sysGroupName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnTargetDetailDTO.class));
        return query.list();
    }

    public List<WorkItemDetailDTO> getWorkItemDetail(DetailMonthPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
//		chinhpxn20180710_start
//		StringBuilder sql = new StringBuilder(
//				"SELECT   wi.CODE code,wi.NAME name,cwi.NAME catWorkItemTypeName ,wi.STATUS status,wi.QUANTITY/1000000 quantity "
//						+ " FROM WORK_ITEM wi left join CONSTRUCTION ct on wi.CONSTRUCTION_ID=ct.CONSTRUCTION_ID "
//						+ "left join CTCT_CAT_OWNER.CAT_WORK_ITEM_TYPE cwi on wi.CAT_WORK_ITEM_TYPE_ID=cwi.CAT_WORK_ITEM_TYPE_ID   "
//						+ "WHERE  ct.CODE= :constructionCode");
        StringBuilder sql = new StringBuilder("WITH re AS ");
        sql.append("   (SELECT wi.code code, ");
        sql.append("     wi.status status, ");
        sql.append("     cwi.name catWorkItemTypeName, ");
        sql.append("     wi.work_item_id ");
        sql.append("   FROM work_item wi ");
        sql.append("   LEFT JOIN cat_work_item_type cwi ");
        sql.append("   ON wi.cat_work_item_type_id = cwi.cat_work_item_type_id ");
        sql.append("   WHERE wi.work_item_id      IN ");
        sql.append("     (SELECT WORK_ITEM_ID ");
        sql.append("     FROM construction_task ");
        sql.append("     WHERE type         =5 ");
        sql.append(
                "     AND construction_id= (select construction_id from construction where code = :constructionCode) ");
        sql.append("     AND DETAIL_MONTH_PLAN_ID          =:detailMonthPlanId ");
        sql.append("     ) ");
        sql.append("   ) ");
        sql.append(" SELECT re.code code, ");
        sql.append("   catWorkItemTypeName, ");
        sql.append("   re.status status, ");
        sql.append("   quantity ");
        sql.append(" FROM construction_task ct ");
        sql.append(" INNER JOIN re ");
        sql.append(" ON ct.work_item_id = re.work_item_id ");
        sql.append(" WHERE type         =5 ");
        sql.append(" AND construction_id= (select construction_id from construction where code = :constructionCode) ");
        sql.append(" AND DETAIL_MONTH_PLAN_ID          =:detailMonthPlanId ");
//		chinhpxn20180710_end
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionCode", obj.getConstructionCode());
        query.setParameter("detailMonthPlanId", obj.getDetailMonthPlanId());
        query.addScalar("code", new StringType());
        query.addScalar("catWorkItemTypeName", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        return query.list();
    }

    public DepartmentDTO getSysUser(String loginName) {
        StringBuilder sql = new StringBuilder(
                "SELECT SYS_USER_ID departmentId," + " FULL_NAME name " + " FROM SYS_USER "
                        // chinhpxn 20180607 start
                        + " WHERE UPPER(LOGIN_NAME) = UPPER(:LOGINNAME) OR UPPER(REPLACE(EMAIL,'@viettel.com.vn','')) = UPPER(:LOGINNAME) ");
        // chinh-xn20180607 end
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("LOGINNAME", loginName.trim());
        query.addScalar("departmentId", new LongType());
        query.addScalar("name", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));
        List<DepartmentDTO> list = query.list();
        DepartmentDTO data = new DepartmentDTO();
        if (list != null)
            data = list.get(0);
        return data;
    }

    public void updatePerforment(Long performentId, Long workItemId) {
        String sql = new String("update work_item set PERFORMER_ID = :perFormerId where work_item_id = :workItemId ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("perFormerId", performentId);
        query.setParameter("workItemId", workItemId);
        query.executeUpdate();
    }

    public Long getSequence() {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("Select DETAIL_MONTH_PLAN_SEQ.nextVal FROM DUAL");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        return ((BigDecimal) query.uniqueResult()).longValue();
    }

    public List<TmpnTargetDTO> getTmpnTargetForExport(Long detailMonthPlanId, Long month, Long year,
                                                      String sysGroupId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("SELECT ypd.Total_month_plan_id totalMonthPlanId,"
                + "ypd.TMPN_TARGET_ID tmpnTargetId," + "ypd.SYS_GROUP_ID sysGroupId," + "ypd.MONTH month,"
                + "ypd.YEAR year," + "ypd.QUANTITY quantity," + "ypd.COMPLETE complete," + "ypd.REVENUE revenue, "
                + "sg.NAME sysGroupName, "
                + " (select sum(work.quantity) from WORK_ITEM work where work.CONSTRUCTOR_ID=ypd.SYS_GROUP_ID and EXTRACT(month FROM work.complete_date)>=1 and EXTRACT(month FROM work.complete_date)<ypd.month) quantityLk, "
                + " (select consH.complete_value from CONSTRUCTION consH,CONSTRUCTION_TASK b  where consH.SYS_GROUP_ID=ypd.SYS_GROUP_ID "
                + " and consH.construction_id=b.construction_id and b.type=2 and b.status =4 and (consH.status=5 or (consH.status =4 and consH.is_obstructed=1 and consH.obstructed_state=2)) "
                + " and EXTRACT(month FROM consH.approve_complete_date)>=1 and EXTRACT(month FROM consH.approve_complete_date)<ypd.month) completeLk, "
                + " (select sum(consH.approve_revenue_value) from CONSTRUCTION consH where consH.SYS_GROUP_ID=ypd.SYS_GROUP_ID and EXTRACT(month FROM consH.approve_revenue_date)>=1 and EXTRACT(month FROM consH.approve_revenue_date)<ypd.month) revenueLk, "
                + " (select sum(yq.quantity) from YEAR_PLAN_DETAIL  yq where yq.SYS_GROUP_ID = ypd.SYS_GROUP_ID) quantityInYear, "
                + " (select sum(yq.complete) from YEAR_PLAN_DETAIL  yq where yq.SYS_GROUP_ID = ypd.SYS_GROUP_ID) completeInYear, "
                + " (select sum(yq.revenue) from YEAR_PLAN_DETAIL  yq where yq.SYS_GROUP_ID = ypd.SYS_GROUP_ID) revenueInYear "
                + " FROM TMPN_TARGET ypd");
        sql.append(" LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ON ypd.SYS_GROUP_ID =sg.SYS_GROUP_ID  ");
        sql.append(
                "WHERE ypd.Total_month_plan_id=:id and ypd.SYS_GROUP_ID =:sysGroupId and ypd.month = :month and ypd.year = :year ");
        sql.append(" ORDER BY sg.NAME ASC,ypd.month ASC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", detailMonthPlanId);
        query.setParameter("month", month);
        query.setParameter("year", year);
        query.setParameter("sysGroupId", sysGroupId);
        query.addScalar("tmpnTargetId", new LongType());
        query.addScalar("totalMonthPlanId", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("complete", new DoubleType());
        query.addScalar("revenue", new DoubleType());
        query.addScalar("quantityLk", new DoubleType());
        query.addScalar("revenueLk", new DoubleType());
        query.addScalar("completeLk", new DoubleType());
        query.addScalar("revenueInYear", new DoubleType());
        query.addScalar("completeInYear", new DoubleType());
        query.addScalar("quantityInYear", new DoubleType());
        query.addScalar("sysGroupName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnTargetDTO.class));
        return query.list();
    }

    public List<ConstructionTaskDetailDTO> getPh12ForExportDoc(Long detailMonthPlanId, String type) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " with btsCount as( select count(CONSTRUCTION_TASK_ID) btsCount,province.cat_province_id catProvinceId,sum(ct.quantity) btsSum,ct.DIRECTOR_ID,ct.SUPERVISOR_ID FROM CONSTRUCTION_TASK ct ");
        sql.append(" LEFT JOIN CONSTRUCTION cons LEFT JOIN CAT_STATION cs ON cons.CAT_STATION_ID =cs.CAT_STATION_ID ");
        sql.append(" ON ct.CONSTRUCTION_ID =cons.CONSTRUCTION_ID LEFT JOIN cat_province province ");
        sql.append(
                " ON province.cat_province_id   = cs.cat_province_id  left join cat_construction_type cct on cct.cat_construction_type_id = cons.cat_construction_type_id  ");
        sql.append(" WHERE ct.DETAIL_MONTH_PLAN_ID = :id and cct.name Like 'Công trình BTS' AND ct.type = :type");
        if ("1".equalsIgnoreCase(type)) {
            sql.append(" and ct.level_id = 3 ");
        } else if ("2".equalsIgnoreCase(type)) {
            sql.append(" and ct.level_id = 4 ");
        }
        sql.append("  group by province.cat_province_id,ct.DIRECTOR_ID,ct.SUPERVISOR_ID), ");
        sql.append(
                " tuyenCount as( select count(CONSTRUCTION_TASK_ID) tuyenCount,province.cat_province_id catProvinceId,sum(ct.quantity) tuyenSum,ct.DIRECTOR_ID,ct.SUPERVISOR_ID   FROM CONSTRUCTION_TASK ct LEFT JOIN CONSTRUCTION cons LEFT JOIN CAT_STATION cs ");
        sql.append(
                " ON cons.CAT_STATION_ID =cs.CAT_STATION_ID ON ct.CONSTRUCTION_ID =cons.CONSTRUCTION_ID LEFT JOIN cat_province province ");
        sql.append(
                " ON province.cat_province_id   = cs.cat_province_id  left join cat_construction_type cct on cct.cat_construction_type_id = cons.cat_construction_type_id  ");
        sql.append(
                " WHERE ct.DETAIL_MONTH_PLAN_ID = :id and cct.name like 'Công trình tuyến' AND ct.type = :type and ct.level_id = 2 ");
        if ("1".equalsIgnoreCase(type)) {
            sql.append(" and ct.level_id = 3 ");
        } else if ("2".equalsIgnoreCase(type)) {
            sql.append(" and ct.level_id = 4 ");
        }
        sql.append("group by province.cat_province_id, ct.DIRECTOR_ID,ct.SUPERVISOR_ID), ");
        sql.append(
                "  gponCount as( select count(CONSTRUCTION_TASK_ID) gponCount,province.cat_province_id catProvinceId,sum(ct.quantity) gponSum,ct.DIRECTOR_ID,ct.SUPERVISOR_ID  FROM CONSTRUCTION_TASK ct LEFT JOIN CONSTRUCTION cons LEFT JOIN CAT_STATION cs ");
        sql.append(
                " ON cons.CAT_STATION_ID =cs.CAT_STATION_ID ON ct.CONSTRUCTION_ID =cons.CONSTRUCTION_ID LEFT JOIN cat_province province ");
        sql.append(
                " ON province.cat_province_id   = cs.cat_province_id  left join cat_construction_type cct on cct.cat_construction_type_id = cons.cat_construction_type_id  ");
        sql.append(
                " WHERE ct.DETAIL_MONTH_PLAN_ID = :id and cct.name like 'Công trình GPON' AND ct.type = :type and ct.level_id = 2 ");
        if ("1".equalsIgnoreCase(type)) {
            sql.append(" and ct.level_id = 3 ");
        } else if ("2".equalsIgnoreCase(type)) {
            sql.append(" and ct.level_id = 4 ");
        }
        sql.append("group by province.cat_province_id,ct.DIRECTOR_ID,ct.SUPERVISOR_ID), ");
        sql.append(
                "  leCount as( select count(CONSTRUCTION_TASK_ID) leCount,province.cat_province_id catProvinceId,sum(ct.quantity) leSum,ct.DIRECTOR_ID,ct.SUPERVISOR_ID  FROM CONSTRUCTION_TASK ct LEFT JOIN CONSTRUCTION cons LEFT JOIN CAT_STATION cs ");
        sql.append(
                " ON cons.CAT_STATION_ID =cs.CAT_STATION_ID ON ct.CONSTRUCTION_ID =cons.CONSTRUCTION_ID LEFT JOIN cat_province province ");
        sql.append(
                " ON province.cat_province_id   = cs.cat_province_id  left join cat_construction_type cct on cct.cat_construction_type_id = cons.cat_construction_type_id  ");
        sql.append(
                " WHERE ct.DETAIL_MONTH_PLAN_ID = :id and cct.name like 'Công trình lẻ' AND ct.type = :type and ct.level_id = 2 ");
        if ("1".equalsIgnoreCase(type)) {
            sql.append(" and ct.level_id = 3 ");
        } else if ("2".equalsIgnoreCase(type)) {
            sql.append(" and ct.level_id = 4 ");
        }
        sql.append("group by province.cat_province_id,ct.DIRECTOR_ID,ct.SUPERVISOR_ID), ");
        sql.append(
                "  child as( SELECT ct.DIRECTOR_ID,ct.SUPERVISOR_ID,province.code catProvinceCode, province.cat_province_id catProvinceId,  captain.FULL_NAME supervisorName,  direct.FULL_NAME directorName , ");
        sql.append(
                " sum(ct.quantity) quantitySum FROM CONSTRUCTION_TASK ct LEFT JOIN SYS_USER captain ON captain.SYS_USER_id = ct.SUPERVISOR_ID LEFT JOIN SYS_USER direct ");
        sql.append(
                " ON direct.SYS_USER_id = ct.DIRECTOR_ID LEFT JOIN CONSTRUCTION cons ON ct.CONSTRUCTION_ID =cons.CONSTRUCTION_ID LEFT JOIN CAT_STATION cs ");
        sql.append(
                " ON cons.CAT_STATION_ID =cs.CAT_STATION_ID LEFT JOIN cat_province province ON province.cat_province_id   = cs.cat_province_id WHERE ct.DETAIL_MONTH_PLAN_ID = :id ");
        sql.append(" AND ct.type                      = :type");
        if ("1".equalsIgnoreCase(type)) {
            sql.append(" and ct.level_id = 3 ");
        } else if ("2".equalsIgnoreCase(type)) {
            sql.append(" and ct.level_id = 4 ");
        }
        sql.append(
                " group by province.code, captain.FULL_NAME ,  direct.FULL_NAME,province.cat_province_id,ct.DIRECTOR_ID,ct.SUPERVISOR_ID ) ");
        sql.append(
                " select child.*,(select gponCount.gponCount from gponCount where gponCount.catProvinceId = child.catProvinceId and gponCount.DIRECTOR_ID= child.DIRECTOR_ID and gponCount.SUPERVISOR_ID= child.SUPERVISOR_ID) gponCount,  ");
        sql.append(
                " (select gponCount.gponSum from gponCount where gponCount.catProvinceId = child.catProvinceId and gponCount.DIRECTOR_ID= child.DIRECTOR_ID and gponCount.SUPERVISOR_ID= child.SUPERVISOR_ID) gponSum , ");
        sql.append(
                " (select leCount.leCount from leCount where leCount.catProvinceId = child.catProvinceId and leCount.DIRECTOR_ID= child.DIRECTOR_ID and leCount.SUPERVISOR_ID= child.SUPERVISOR_ID) leCount,  ");
        sql.append(
                " (select leCount.leSum from leCount where leCount.catProvinceId = child.catProvinceId and leCount.DIRECTOR_ID= child.DIRECTOR_ID and leCount.SUPERVISOR_ID= child.SUPERVISOR_ID) leSum , ");
        sql.append(
                " (select btsCount.btsCount from btsCount where btsCount.catProvinceId = child.catProvinceId and btsCount.DIRECTOR_ID= child.DIRECTOR_ID and btsCount.SUPERVISOR_ID= child.SUPERVISOR_ID) btsCount,  ");
        sql.append(
                " (select btsCount.btsSum from btsCount where btsCount.catProvinceId = child.catProvinceId and btsCount.DIRECTOR_ID= child.DIRECTOR_ID and btsCount.SUPERVISOR_ID= child.SUPERVISOR_ID) btsSum , ");
        sql.append(
                " (select tuyenCount.tuyenCount from tuyenCount where tuyenCount.catProvinceId = child.catProvinceId and tuyenCount.DIRECTOR_ID= child.DIRECTOR_ID and tuyenCount.SUPERVISOR_ID= child.SUPERVISOR_ID) tuyenCount, ");
        sql.append(
                " (select tuyenCount.tuyenSum from tuyenCount where tuyenCount.catProvinceId = child.catProvinceId and tuyenCount.DIRECTOR_ID= child.DIRECTOR_ID and tuyenCount.SUPERVISOR_ID= child.SUPERVISOR_ID) tuyenSum  ");
        sql.append(" from child child ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", detailMonthPlanId);
        query.setParameter("type", type);
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("supervisorName", new StringType());
        query.addScalar("directorName", new StringType());
        query.addScalar("quantitySum", new LongType());
        query.addScalar("gponCount", new LongType());
        query.addScalar("gponSum", new LongType());
        query.addScalar("leCount", new LongType());
        query.addScalar("leSum", new LongType());
        query.addScalar("tuyenCount", new LongType());
        query.addScalar("tuyenSum", new LongType());
        query.addScalar("btsSum", new LongType());
        query.addScalar("btsCount", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        return query.list();
    }

    public List<ConstructionTaskDetailDTO> getPl3ForExportDoc(Long detailMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " SELECT province.code catProvinceCode,  cntWork.code cntContract,  sum(consTask.quantity) quantity,consTask.description description FROM CONSTRUCTION_TASK consTask ");
        sql.append(
                " LEFT JOIN  (select distinct cnt.code, cntWork.CONSTRUCTION_ID from CNT_CONSTR_WORK_ITEM_TASK cntWork inner join CNT_CONTRACT cnt ON cnt.CNT_CONTRACT_ID = cntWork.CNT_CONTRACT_ID  and cnt.CONTRACT_TYPE = 0 and cnt.status!=0) cntWork ON cntWork.CONSTRUCTION_ID=  consTask.CONSTRUCTION_ID ");
        sql.append(" LEFT JOIN CONSTRUCTION cons on cons.CONSTRUCTION_ID = cntWork.CONSTRUCTION_ID ");
        sql.append(" LEFT JOIN CAT_STATION cs ON cons.CAT_STATION_ID =cs.CAT_STATION_ID ");
        sql.append(" LEFT JOIN cat_province province ON province.cat_province_id   = cs.cat_province_id  ");
        sql.append(
                " where consTask.DETAIL_MONTH_PLAN_ID = :id and consTask.type = 3 and consTask.level_id = 4 group by province.code,cntWork.code,consTask.description");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("cntContract", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.setParameter("id", detailMonthPlanId);
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        return query.list();
    }

    public List<ConstructionTaskDetailDTO> getPl1ForExportExcel(Long detailMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " SELECT province.code catProvinceCode,  cs.code catStationCode,  cons.Code constructionCode,  cntWork.code cntContract, ");
        sql.append(
                " consTask.task_name workItemName,  consTask.quantity quantity,  consTask.source_type sourceType,  consTask.deploy_type deployType, ");
        sql.append(
                " captain.full_Name supervisorName,  direct.full_name directorName,  perform.Full_name performerName,  consTask.END_DATE endDate, ");
        sql.append(
                " consTask.START_DATE startDate,  consTask.DESCRIPTION description FROM CONSTRUCTION_TASK consTask ");
        sql.append(" left join SYS_USER captain on captain.SYS_USER_ID = consTask.SUPERVISOR_ID ");
        sql.append(" left join SYS_USER direct on direct.SYS_USER_ID = consTask.DIRECTOR_ID ");
        sql.append(" left join SYS_USER perform on perform.SYS_USER_ID = consTask.PERFORMER_ID ");
        sql.append(
                " LEFT JOIN (select distinct cnt.code, cntWork.CONSTRUCTION_ID from CNT_CONSTR_WORK_ITEM_TASK cntWork inner JOIN CNT_CONTRACT cnt ON cnt.CNT_CONTRACT_ID =cntWork.CNT_CONTRACT_ID AND cnt.CONTRACT_TYPE               = 0 and cnt.status!=0) cntWork ON cntWork.CONSTRUCTION_ID= consTask.CONSTRUCTION_ID ");
        sql.append(
                " LEFT JOIN CONSTRUCTION cons ON cons.CONSTRUCTION_ID = consTask.CONSTRUCTION_ID LEFT JOIN CAT_STATION cs ");
        sql.append(
                " ON cons.CAT_STATION_ID =cs.CAT_STATION_ID LEFT JOIN cat_province province ON province.cat_province_id = cs.cat_province_id ");
        sql.append(
                " WHERE consTask.DETAIL_MONTH_PLAN_ID = :id AND consTask.type                   = 1 and consTask.level_id = 3 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("cntContract", new StringType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("sourceType", new StringType());
        query.addScalar("deployType", new StringType());
        query.addScalar("supervisorName", new StringType());
        query.addScalar("directorName", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.setParameter("id", detailMonthPlanId);
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        return query.list();
    }

    public List<DmpnOrderDTO> getPl4ExcelList(Long detailMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT goods_code goodsCode, goods_name goodsName, unit_name unitName, quantity quantity FROM dmpn_order where DETAIL_MONTH_PLAN_ID = :id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("unitName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.setParameter("id", detailMonthPlanId);
        query.setResultTransformer(Transformers.aliasToBean(DmpnOrderDTO.class));
        return query.list();
    }

    public List<ConstructionTaskDetailDTO> getPl6ForExportExcel(Long detailMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT consTask.task_name taskName,  per.full_name performerName,  TO_CHAR(consTask.start_date,'dd/MM/yyyy') startDateStr, ");
        sql.append("  TO_CHAR(consTask.end_date,'dd/MM/yyyy') endDateStr,  consTask.DESCRIPTION description ");
        sql.append(
                " FROM construction_task consTask left join sys_user per on per.SYS_USER_ID = consTask.PERFORMER_ID ");
        sql.append(" where consTask.DETAIL_MONTH_PLAN_ID = :id and consTask.type = 6 and consTask.level_id = 4");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("taskName", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("startDateStr", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("endDateStr", new StringType());
        query.setParameter("id", detailMonthPlanId);
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        return query.list();
    }

    public List<DetailMonthPlaningDTO> exportDetailMonthPlan(DetailMonthPlanSimpleDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT DMP.DETAIL_MONTH_PLAN_ID detailMonthPlanId," + " DMP.YEAR year ,"
                + " DMP.sys_group_id sysGroupId ," + " DMP.MONTH month ," + " DMP.CREATED_DATE createdDate ,"
                + " DMP.Created_user_id createdUserId, " + " DMP.Created_group_id createdGroupId ," + " DMP.CODE code ,"
                + " DMP.NAME name ," + " DMP.Sign_state signState ," + " DMP.STATUS status , "
                + " DMP.DESCRIPTION description ," + " SYSG.NAME sysName, " + " SYSG.Code sysGroupCode "
                + " FROM DETAIL_MONTH_PLAN DMP LEFT JOIN ctct_cat_owner.sys_group SYSG ON DMP.sys_group_id=SYSG.sys_group_id"
                + " WHERE 1=1 ");

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(DMP.CODE) LIKE upper(:keySearch) OR  upper(DMP.YEAR) LIKE upper(:keySearch) OR upper(DMP.NAME) LIKE upper(:keySearch) escape '&')");
        }
        if (StringUtils.isNotEmpty(obj.getStatus())) {
            sql.append(" AND DMP.STATUS = :status");

        }
        if (obj.getSignStateList() != null && !obj.getSignStateList().isEmpty()) {
            sql.append(" AND DMP.Sign_state  in :signStateList");
        }
        if (obj.getMonthList() != null && !obj.getMonthList().isEmpty()) {
            sql.append(" AND DMP.MONTH  in :monthList");
        }
        if (obj.getYearList() != null && !obj.getYearList().isEmpty()) {
            sql.append(" AND DMP.YEAR  in :yearList");
        }

        if (obj.getSysGroupId() != null) {
            sql.append(" AND SYSG.SYS_GROUP_ID  = :sysGroupId");
        }
        sql.append(" ORDER BY DMP.DETAIL_MONTH_PLAN_ID DESC");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
            queryCount.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
        }

        if (StringUtils.isNotEmpty(obj.getStatus()) && !"2".equals(obj.getStatus())) {
            query.setParameter("status", obj.getStatus());
            queryCount.setParameter("status", obj.getStatus());
        }

        if (obj.getSignStateList() != null && !obj.getSignStateList().isEmpty()) {
            query.setParameterList("signStateList", obj.getSignStateList());
            queryCount.setParameterList("signStateList", obj.getSignStateList());
        }
        if (obj.getMonthList() != null && !obj.getMonthList().isEmpty()) {
            query.setParameterList("monthList", obj.getMonthList());
            queryCount.setParameterList("monthList", obj.getMonthList());
        }
        if (obj.getYearList() != null && !obj.getYearList().isEmpty()) {
            query.setParameterList("yearList", obj.getYearList());
            queryCount.setParameterList("yearList", obj.getYearList());
        }
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
        }

        query.addScalar("detailMonthPlanId", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("signState", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("sysName", new StringType());
        query.addScalar("sysGroupCode", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(DetailMonthPlaningDTO.class));
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public List<ConstructionTaskDetailDTO> getPl235ForExportExcel(Long detailMonthPlanId, Long type) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " SELECT province.code catProvinceCode,  cs.code catStationCode,  cons.Code constructionCode,  cntWork.code cntContract, ");
        sql.append(
                " consTask.task_name workItemName,  consTask.quantity quantity, consTask.vat vat, consTask.source_type sourceType,  consTask.deploy_type deployType, ");
        sql.append(
                " captain.full_Name supervisorName,  direct.full_name directorName,  perform.Full_name performerName,  consTask.END_DATE endDate, ");
        sql.append(
                " consTask.START_DATE startDate,  consTask.DESCRIPTION description,catType.CAT_CONSTRUCTION_TYPE_ID catConstructionTypeId, catType.name catConstructionTypeName,consTask.CONSTRUCTION_ID constructionId "
                        + "FROM CONSTRUCTION_TASK consTask ");
        sql.append(" left join SYS_USER captain on captain.SYS_USER_ID = consTask.SUPERVISOR_ID ");
        sql.append(" left join SYS_USER direct on direct.SYS_USER_ID = consTask.DIRECTOR_ID ");
        sql.append(" left join SYS_USER perform on perform.SYS_USER_ID = consTask.PERFORMER_ID ");
        sql.append(
                " LEFT JOIN (select distinct cnt.code, cntWork.CONSTRUCTION_ID from CNT_CONSTR_WORK_ITEM_TASK cntWork inner JOIN CNT_CONTRACT cnt ON cnt.CNT_CONTRACT_ID =cntWork.CNT_CONTRACT_ID AND cnt.CONTRACT_TYPE               = 0 and cnt.status!=0) cntWork ON cntWork.CONSTRUCTION_ID= consTask.CONSTRUCTION_ID ");
        sql.append(
                " LEFT JOIN CONSTRUCTION cons ON cons.CONSTRUCTION_ID = consTask.CONSTRUCTION_ID LEFT JOIN CAT_STATION cs ");
        sql.append(
                " ON cons.CAT_STATION_ID =cs.CAT_STATION_ID LEFT JOIN cat_province province ON province.cat_province_id = cs.cat_province_id ");
        sql.append(
                " LEFT JOIN CAT_CONSTRUCTION_TYPE catType on catType.CAT_CONSTRUCTION_TYPE_ID = cons.CAT_CONSTRUCTION_TYPE_ID ");
        sql.append(" WHERE consTask.DETAIL_MONTH_PLAN_ID = :id AND consTask.type                   = :type ");
        if (type != 5)
            sql.append(" and consTask.level_id = 4 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("cntContract", new StringType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("sourceType", new StringType());
        query.addScalar("deployType", new StringType());
        query.addScalar("supervisorName", new StringType());
        query.addScalar("directorName", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("vat", new DoubleType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("catConstructionTypeName", new StringType());
        query.addScalar("catConstructionTypeId", new LongType());
        query.addScalar("constructionId", new LongType());
        query.setParameter("id", detailMonthPlanId);
        query.setParameter("type", type);
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        return query.list();
    }

    public List<WorkItemDetailDTO> getWorkItemDetailByConstructionId(Long constructionId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT   wi.CODE code,wi.NAME name ,catWorkType.name catWorkItemTypeName, wi.QUANTITY/1000000 quantity"
                        + " FROM WORK_ITEM wi left join CAT_WORK_ITEM_TYPE catWorkType on catWorkType.CAT_WORK_ITEM_TYPE_ID = wi.CAT_WORK_ITEM_TYPE_ID "
                        + "WHERE  wi.CONSTRUCTION_ID = :constructionId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", constructionId);
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("catWorkItemTypeName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        return query.list();
    }

    public List<CatCommonDTO> getListWorkItemTypeByName(String name) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("Select catWorkType.name name from CAT_WORK_ITEM_TYPE catWorkType ");
        sql.append(
                " LEFT JOIN CAT_CONSTRUCTION_TYPE consType on consType.CAT_CONSTRUCTION_TYPE_ID = catWorkType.CAT_CONSTRUCTION_TYPE_ID where consType.name =:name");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("name", name);
        query.addScalar("name", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(CatCommonDTO.class));
        return query.list();
    }

    // chinhpxn20180723_start
    public int createSendSmsEmail(ConstructionTaskDetailDTO request, KttsUserSession user) {
        SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");// dd/MM/yyyy
        String sql = new String(" SELECT SEND_SMS_EMAIL_SEQ.nextval FROM DUAL ");
        SQLQuery query = getSession().createSQLQuery(sql);
        int sendSmsEmailId = ((BigDecimal) query.uniqueResult()).intValue();
        StringBuilder sqlSendSmsEmail = new StringBuilder("INSERT INTO SEND_SMS_EMAIL (" + "   SEND_SMS_EMAIL_ID "
                + " , TYPE" + " , RECEIVE_PHONE_NUMBER " + " , RECEIVE_EMAIL" + " , CREATED_DATE "
                + " , CREATED_USER_ID" + " , CREATED_GROUP_ID" + " , SUBJECT" + " , CONTENT,status,WORK_ITEM_ID " + " ) VALUES ( "
                + " :sendSmsEmailId" + " , 1 " + " , :phoneNumber " + " , :email" + " , :createdDate"
                + " , :createUserId" + " , :createGroupId" + " , :subject " + " , :content,0, :workItemId  " + ")");

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
        String name = "";
        if (request.getType().equals("1")) {
            name = request.getTaskCount() + " hạng mục";
        } else if (request.getType().equals("2")) {
            name = request.getTaskCount() + " việc làm HSHC";
        } else if (request.getType().equals("3")) {
            name = request.getTaskCount() + " việc làm lên doanh thu";
        } else if (request.getType().equals("6")) {
            name = request.getTaskCount() + " công việc khác";
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
//      hoanm1_20181022_start
      if(request.getWorkItemId() !=null){
      	querySms.setParameter("workItemId", request.getWorkItemId());
      }else{
      	querySms.setParameter("workItemId", 0L);
      }
//      hoanm1_20181022_end
        return querySms.executeUpdate();
    }
    // chinhpxn20180723_end
    
    public void getUserForMap(Map<String, SysUserDTO> mapByCode, Map<String, SysUserDTO> mapByEmail) {
    	try{
	        StringBuilder sql = new StringBuilder(
	                "SELECT SYS_USER_ID userId, FULL_NAME fullName, login_name loginName, (REPLACE(EMAIL,'@viettel.com.vn','')) email " 
	                		+ " FROM SYS_USER "
	                        + " WHERE status = 1 ");
	        SQLQuery query = getSession().createSQLQuery(sql.toString());
	        query.addScalar("userId", new LongType());
	        query.addScalar("fullName", new StringType());
	        query.addScalar("loginName", new StringType());
	        query.addScalar("email", new StringType());
	        query.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
	        List<SysUserDTO> listUser = query.list();
	        for(SysUserDTO obj : listUser){
	        	mapByCode.put(obj.getLoginName().toUpperCase(), obj);
	        	if(obj.getEmail() != null && !obj.getEmail().isEmpty())
	        		mapByEmail.put(obj.getEmail().toUpperCase(), obj);
	        }
    	} catch (Exception e){
    		e.printStackTrace();
    	}
    }
    //tanqn start 20181108
    public void removeRow(Long constructionTaskId) {
        StringBuilder sql = new StringBuilder(
                "delete from construction_task where construction_task_id=:constructionTaskId or parent_id= :constructionTaskId  ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionTaskId", constructionTaskId);
        query.executeUpdate();

    }
    //tanqn end 20181108
}
