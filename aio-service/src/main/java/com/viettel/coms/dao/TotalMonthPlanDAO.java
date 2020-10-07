/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.coms.bo.TotalMonthPlanBO;
import com.viettel.coms.dto.*;
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

//import com.viettel.coms.dto.YearPlanSimpleDTO;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("totalMonthPlanDAO")
public class TotalMonthPlanDAO extends BaseFWDAOImpl<TotalMonthPlanBO, Long> {

    public TotalMonthPlanDAO() {
        this.model = new TotalMonthPlanBO();
    }

    public TotalMonthPlanDAO(Session session) {
        this.session = session;
    }

    public List<TotalMonthPlanDTO> doSearch(TotalMonthPlanSimpleDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT total_month_plan_id totalMonthPlanId," + "conclution conclution,"
                + "  YEAR year ," + " MONTH month ," + " CREATED_DATE createdDate ,"
                + " Created_user_id createdUserId, " + " Created_group_id createdGroupId ," + " CODE code ,"
                + " NAME name ," + " Sign_state signState ," + " STATUS status , " + " DESCRIPTION description"
                + " FROM TOTAL_MONTH_PLAN WHERE 1=1 ");

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(CODE) LIKE upper(:keySearch) OR  upper(YEAR) LIKE upper(:keySearch) OR upper(NAME) LIKE upper(:keySearch) escape '&')");
        }
        if (StringUtils.isNotEmpty(obj.getStatus())) {
            sql.append(" AND STATUS = :status");

        }
        if (obj.getSignStateList() != null && !obj.getSignStateList().isEmpty()) {
            sql.append(" AND Sign_state  in :signStateList");
        }
        if (obj.getMonthList() != null && !obj.getMonthList().isEmpty()) {
            sql.append(" AND MONTH  in :monthList");
        }
        if (obj.getYearList() != null && !obj.getYearList().isEmpty()) {
            sql.append(" AND YEAR  in :yearList");
        }

        sql.append(" ORDER BY total_month_plan_id DESC");
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
        String testStatus = obj.getStatus();

        query.addScalar("totalMonthPlanId", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("signState", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("conclution", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(TotalMonthPlanDTO.class));
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public boolean checkMonthYear(Long month, Long year, Long totalMonthId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT COUNT(TOTAL_MONTH_PLAN_ID) FROM TOTAL_MONTH_PLAN where 1=1 and month=:month and year=:year and status = 1 ");
        if (totalMonthId != null) {
            sql.append(" AND TOTAL_MONTH_PLAN_ID != :totalMonthId ");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("year", year);
        query.setParameter("month", month);
        if (totalMonthId != null) {
            query.setParameter("totalMonthId", totalMonthId);
        }
        return ((BigDecimal) query.uniqueResult()).intValue() > 0;
    }

    public Long getSequence() {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("Select TOTAL_MONTH_PLAN_SEQ.nextVal FROM DUAL");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        return ((BigDecimal) query.uniqueResult()).longValue();
    }

    public void remove(Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "UPDATE TOTAL_MONTH_PLAN set status = 0  where TOTAL_MONTH_PLAN_ID = :totalMonthPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("totalMonthPlanId", totalMonthPlanId);
        query.executeUpdate();
    }
//    hungtd_20181213_start
    public void updateRegistry(Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "UPDATE TOTAL_MONTH_PLAN set SIGN_STATE = '3'  where TOTAL_MONTH_PLAN_ID = :totalMonthPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("totalMonthPlanId", totalMonthPlanId);
        query.executeUpdate();
    }
//    hungtd_20181213_end

    public TotalMonthPlanSimpleDTO getById(Long id) {
        StringBuilder sql = new StringBuilder("SELECT total_month_plan_id totalMonthPlanId," + "  year year,"
                + "  month month," + " CREATED_DATE createdDate," + " Created_user_id createdUserId,"
                + " Created_group_id createdGroupId," + " CODE code," + " NAME name," + " Sign_state signState,"
                + " STATUS status, " + " DESCRIPTION description," + " CONCLUTION conclution, "
                + " TARGET_NOTE targetNote, " + " SOURCE_NOTE sourceNote, " + " FINANCE_NOTE financeNote, "
                + " CONTRACT_NOTE contractNote, " + " MATERIAL_NOTE materialNote, " + " LINE_NOTE lineNote, "
                + " BTS_NOTE btsNote, " + " MAINTAIN_NOTE maintainNote "
                + " FROM TOTAL_MONTH_PLAN WHERE 1=1 and total_month_plan_id =:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("totalMonthPlanId", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("signState", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("conclution", new StringType());
        query.addScalar("targetNote", new StringType());
        query.addScalar("sourceNote", new StringType());
        query.addScalar("financeNote", new StringType());
        query.addScalar("contractNote", new StringType());
        query.addScalar("materialNote", new StringType());
        query.addScalar("lineNote", new StringType());
        query.addScalar("btsNote", new StringType());
        query.addScalar("maintainNote", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TotalMonthPlanSimpleDTO.class));
        return (TotalMonthPlanSimpleDTO) query.uniqueResult();
    }

    public TmpnTargetDTO getTmpnTargetDTOListChoseByParent(Long month, Long year, Long sysGroupId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(" ");
        sql.append(" SELECT ");
        // chinhpxn20180629start
        sql.append("   (SELECT SUM(work.quantity) ");
        sql.append("   FROM WORK_ITEM WORK, CONSTRUCTION cons ");
        sql.append("   WHERE work.CONSTRUCTION_ID                  =cons.CONSTRUCTION_ID AND cons.STATUS != 0 ");
        sql.append("   AND cons.CAT_CONSTRUCTION_TYPE_ID != 2 ");
        sql.append("   AND work.CONSTRUCTOR_ID                  =:sysGroupId ");
        sql.append("   AND EXTRACT(MONTH FROM work.complete_date)>=1 ");
        sql.append("   AND EXTRACT(MONTH FROM work.complete_date) <:month ");
        sql.append("   AND EXTRACT(YEAR FROM work.complete_date)  =:year ");
        sql.append("   ) quantityLk, ");
        // chinhpxn20180629end
        sql.append("   (SELECT SUM(cons.complete_value) ");
        sql.append("   FROM CONSTRUCTION cons inner join CONSTRUCTION_TASK b ");
        sql.append("   on cons.construction_id        =b.construction_id ");
        sql.append("   WHERE cons.SYS_GROUP_ID                            =:sysGroupId ");
        sql.append("     AND b.type                         =2 ");
        sql.append("   AND b.status                       =4 ");
        sql.append("   AND (cons.status                  =5 ");
        sql.append("   OR (cons.status                   =4 ");
        sql.append("   AND cons.is_obstructed            =1 ");
        sql.append("   AND cons.obstructed_state         =2)) ");
        sql.append("   AND EXTRACT(MONTH FROM b.end_date)>=1 ");
        sql.append("   AND EXTRACT(MONTH FROM b.end_date) <:month ");
        sql.append("   AND EXTRACT(YEAR FROM b.end_date)  =:year ");
        sql.append("   ) completeLk, ");
        // chinhpxn20180629start
//				sql.append("   (SELECT SUM(consH.approve_revenue_value) ");
//				sql.append("   FROM CONSTRUCTION consH ");
//				sql.append("   WHERE consH.SYS_GROUP_ID                           =:sysGroupId ");
//				sql.append("   AND EXTRACT(MONTH FROM consH.approve_revenue_date)>=1 ");
//				sql.append("   AND EXTRACT(MONTH FROM consH.approve_revenue_date) <:month ");
//				sql.append("   AND EXTRACT(YEAR FROM consH.approve_revenue_date)  =:year ");
//				sql.append("   ) revenueLk, ");
        sql.append(" (SELECT SUM(consH.approve_revenue_value) ");
        sql.append("  FROM CONSTRUCTION consH ");
        sql.append("  INNER JOIN CNT_CONSTR_WORK_ITEM_TASK constrTask ");
        sql.append("  ON constrTask.CONSTRUCTION_ID = consH.CONSTRUCTION_ID ");
        sql.append("  INNER JOIN CNT_CONTRACT cntContract ");
        sql.append("  ON cntContract.CNT_CONTRACT_ID = constrTask.CNT_CONTRACT_ID ");
        sql.append("  INNER JOIN SYS_GROUP SYS ");
        sql.append("  ON cntContract.SYS_GROUP_ID = sys.SYS_GROUP_ID ");
        sql.append("  WHERE :sysGroupId  = ( ");
        sql.append("    CASE sys.GROUP_LEVEL ");
        sql.append("      WHEN '1' ");
        sql.append("      THEN ");
        sql.append("        (SELECT s.SYS_GROUP_ID ");
        sql.append("        FROM SYS_GROUP s, ");
        sql.append("          APP_PARAM a ");
        sql.append("        WHERE s.CODE   = a.CODE ");
        sql.append("        AND a.PAR_TYPE = 'SYS_GROUP_REVENUE' ");
        sql.append("        ) ");
        sql.append("      ELSE cntContract.SYS_GROUP_ID ");
        sql.append("    END ) ");
        sql.append("  AND cntContract.CONTRACT_TYPE                      = 0 ");
        sql.append("  AND consH.status                                  !=0 ");
        sql.append("  AND constrTask.status                             !=0 ");
        sql.append("  AND cntContract.status                            !=0 ");
        sql.append("  AND EXTRACT(MONTH FROM consH.approve_revenue_date)>=1 ");
        sql.append("  AND EXTRACT(MONTH FROM consH.approve_revenue_date) <:month ");
        sql.append("  AND EXTRACT(YEAR FROM consH.approve_revenue_date)  =:year ");
        sql.append("  ) revenueLk, ");
        // chinhpxn20180629end
        sql.append("   (SELECT SUM(yq.quantity) ");
        sql.append("   FROM YEAR_PLAN_DETAIL yq ");
        sql.append("   LEFT JOIN YEAR_PLAN y ");
        sql.append("   ON y.year_plan_id     = yq.year_plan_id ");
        sql.append("   WHERE yq.SYS_GROUP_ID =:sysGroupId ");
        sql.append("   AND yq.year           = :year ");
        sql.append("   AND y.status          = 1 ");
        sql.append("   ) quantityInYear, ");
        sql.append("   (SELECT SUM(yq.complete) ");
        sql.append("   FROM YEAR_PLAN_DETAIL yq ");
        sql.append("   LEFT JOIN YEAR_PLAN y ");
        sql.append("   ON y.year_plan_id     = yq.year_plan_id ");
        sql.append("   WHERE yq.SYS_GROUP_ID = :sysGroupId ");
        sql.append("   AND yq.year           = :year ");
        sql.append("   AND y.status          = 1 ");
        sql.append("   ) completeInYear, ");
        sql.append("   (SELECT SUM(yq.revenue) ");
        sql.append("   FROM YEAR_PLAN_DETAIL yq ");
        sql.append("   LEFT JOIN YEAR_PLAN y ");
        sql.append("   ON y.year_plan_id     = yq.year_plan_id ");
        sql.append("   WHERE yq.SYS_GROUP_ID = :sysGroupId ");
        sql.append("   AND yq.year           = :year ");
        sql.append("   AND y.status          = 1 ");
        sql.append("   ) revenueInYear ");
        sql.append(" FROM dual  ");

//		sql.append(" and ypd.SYS_GROUP_ID          =:sysGroupId and ypd.month=:month and ypd.year=:year  ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("month", month);
        query.setParameter("year", year);
        query.setParameter("sysGroupId", sysGroupId);

        query.addScalar("quantityLk", new DoubleType());
        query.addScalar("revenueLk", new DoubleType());
        query.addScalar("completeLk", new DoubleType());
        query.addScalar("revenueInYear", new DoubleType());
        query.addScalar("completeInYear", new DoubleType());
        query.addScalar("quantityInYear", new DoubleType());

        query.setResultTransformer(Transformers.aliasToBean(TmpnTargetDTO.class));
        List<TmpnTargetDTO> res = query.list();
        TmpnTargetDTO data = new TmpnTargetDTO();
        if (res != null && !res.isEmpty())
            data = res.get(0);
        return data;
    }

    public List<TmpnTargetDTO> getTmpnTargetDTOListByParent(Long id) {
        // TODO Auto-generated method stub
        if (id == null)
            return new ArrayList<TmpnTargetDTO>();
        StringBuilder sql = new StringBuilder(" ");
        sql.append("SELECT ypd.Total_month_plan_id totalMonthPlanId, ");
        sql.append("  ypd.TMPN_TARGET_ID tmpnTargetId, ");
        sql.append("  ypd.SYS_GROUP_ID sysGroupId, ");
        sql.append("  ypd.MONTH MONTH, ");
        sql.append("  ypd.YEAR YEAR, ");
        sql.append("  ypd.QUANTITY quantity, ");
        sql.append("  ypd.COMPLETE complete, ");
        sql.append("  ypd.REVENUE revenue, ");
        sql.append("  sg.NAME sysGroupName, ");
        // chinhpxn20180626
//		sql.append("  SUM ( ");
//		sql.append("  (SELECT SUM(work.quantity) ");
//		sql.append("  FROM WORK_ITEM WORK ");
//		sql.append("  WHERE work.CONSTRUCTOR_ID                  =ypd.SYS_GROUP_ID ");
//		sql.append("  AND EXTRACT(MONTH FROM work.complete_date)>=1 ");
//		sql.append("  AND EXTRACT(MONTH FROM work.complete_date) <ypd.month ");
//		sql.append("  AND EXTRACT(YEAR FROM work.complete_date)  =ypd.year ");
//		sql.append("  )) quantityLk, ");
        sql.append("  ( ");
        sql.append("  (SELECT SUM(work.quantity) ");
        sql.append("  FROM WORK_ITEM work, CONSTRUCTION cons ");
        sql.append("  WHERE work.CONSTRUCTION_ID         =cons.CONSTRUCTION_ID and cons.status !=0 ");
        sql.append("  AND work.CONSTRUCTOR_ID = ypd.SYS_GROUP_ID ");
        sql.append("  AND cons.CAT_CONSTRUCTION_TYPE_ID != 2 ");
        sql.append("  AND EXTRACT(MONTH FROM work.complete_date)>=1 ");
        sql.append("  AND EXTRACT(MONTH FROM work.complete_date)<ypd.month ");
        sql.append("  AND EXTRACT(YEAR FROM work.complete_date)=ypd.year ");
        sql.append("  ) ");
        sql.append("  + ");
        sql.append("  NVL((SELECT SUM(consTaskDaily.QUANTITY) ");
        sql.append("  FROM CONSTRUCTION_TASK_DAILY consTaskDaily ");
        sql.append("  WHERE consTaskDaily.SYS_GROUP_ID = ypd.SYS_GROUP_ID ");
        sql.append("  AND EXTRACT(MONTH FROM consTaskDaily.APPROVE_DATE)>=1 ");
        sql.append("  AND EXTRACT(MONTH FROM consTaskDaily.APPROVE_DATE)<ypd.month ");
        sql.append("  AND EXTRACT(YEAR FROM consTaskDaily.APPROVE_DATE)=ypd.year ");
        sql.append("  AND consTaskDaily.CONFIRM = '1'),0) ");
        sql.append("  ) quantityLk, ");
        // chinhpxn20180626
        sql.append("  SUM( ");
        sql.append("  (SELECT SUM(consH.complete_value) ");
        sql.append("  FROM CONSTRUCTION consH, ");
        sql.append("    CONSTRUCTION_TASK b ");
        sql.append("  WHERE consH.construction_id        =b.construction_id ");
        sql.append("  AND b.type                         =2 ");
        sql.append("  AND b.status                       =4 ");
//		hoanm1_20180614_start
        sql.append("  AND (consH.status                  in(5,6,7,8) ");
//		hoanm1_20180614_end
        sql.append("  OR (consH.status                   =4 ");
        sql.append("  AND consH.is_obstructed            =1 ");
        sql.append("  AND consH.obstructed_state         =2)) ");
        sql.append("  AND consH.SYS_GROUP_ID             =ypd.SYS_GROUP_ID ");
        sql.append("  AND EXTRACT(MONTH FROM b.end_date)>=1 ");
        sql.append("  AND EXTRACT(MONTH FROM b.end_date) <ypd.month ");
        sql.append("  AND EXTRACT(YEAR FROM b.end_date)  = ypd.year ");
        sql.append("  )) completeLk, ");
        // chinhpxn20180626
//		sql.append("  SUM( ");
//		sql.append("  (SELECT SUM(consH.approve_revenue_value) ");
//		sql.append("  FROM CONSTRUCTION consH ");
//		sql.append("  WHERE consH.SYS_GROUP_ID                           =ypd.SYS_GROUP_ID ");
//		sql.append("  AND EXTRACT(MONTH FROM consH.approve_revenue_date)>=1 ");
//		sql.append("  AND EXTRACT(MONTH FROM consH.approve_revenue_date) <ypd.month ");
//		sql.append("  AND EXTRACT(YEAR FROM consH.approve_revenue_date)  =ypd.year ");
//		sql.append("  )) revenueLk, ");
        sql.append("   SUM( ");
        sql.append("  (SELECT SUM(consH.approve_revenue_value) ");
        sql.append("  FROM CONSTRUCTION consH ");
        sql.append("  inner JOIN CNT_CONSTR_WORK_ITEM_TASK constrTask ");
        sql.append("  ON constrTask.CONSTRUCTION_ID = consH.CONSTRUCTION_ID ");
        sql.append("  inner JOIN CNT_CONTRACT cntContract ");
        sql.append("  ON cntContract.CNT_CONTRACT_ID                    = constrTask.CNT_CONTRACT_ID ");
        sql.append("  inner JOIN SYS_GROUP sys ");
        sql.append("  ON cntContract.SYS_GROUP_ID = sys.SYS_GROUP_ID ");
        sql.append("  WHERE ypd.SYS_GROUP_ID = (CASE sys.GROUP_LEVEL    ");
        sql.append("    WHEN '1' THEN (select s.SYS_GROUP_ID from SYS_GROUP s, APP_PARAM a where ");
        sql.append("                    s.CODE= a.CODE and a.PAR_TYPE = 'SYS_GROUP_REVENUE') ");
        sql.append("    ELSE cntContract.SYS_GROUP_ID ");
        sql.append("    END ");
        sql.append("  ) ");
        sql.append("  AND cntContract.CONTRACT_TYPE                     = 0 ");
        sql.append("  AND consH.status !=0 and  constrTask.status !=0 and cntContract.status !=0 ");
        sql.append("  AND EXTRACT(MONTH FROM consH.approve_revenue_date)>=1 ");
        sql.append("  AND EXTRACT(MONTH FROM consH.approve_revenue_date) <ypd.month ");
        sql.append("  AND EXTRACT(YEAR FROM consH.approve_revenue_date)  =ypd.year ");
        sql.append("  )) revenueLk, ");
        // chinhpxn20180626
        sql.append("  SUM( ");
        sql.append("  (SELECT SUM(yq.quantity) ");
        sql.append("  FROM YEAR_PLAN_DETAIL yq ");
        sql.append("  INNER JOIN year_plan y ");
        sql.append("  ON y.year_Plan_id     = yq.year_Plan_id ");
        sql.append("  AND y.status          = 1 ");
        sql.append("  WHERE yq.SYS_GROUP_ID = ypd.SYS_GROUP_ID ");
        sql.append("  AND yq.year           = ypd.year ");
        sql.append("  )) quantityInYear, ");
        sql.append("  SUM( ");
        sql.append("  (SELECT SUM(yq.complete) ");
        sql.append("  FROM YEAR_PLAN_DETAIL yq ");
        sql.append("  INNER JOIN year_plan y ");
        sql.append("  ON y.year_Plan_id     = yq.year_Plan_id  AND y.status          = 1 ");
        sql.append("  WHERE yq.SYS_GROUP_ID = ypd.SYS_GROUP_ID ");
        sql.append("  AND yq.year           = ypd.year ");
        sql.append("  ");
        sql.append("  )) completeInYear, ");
        sql.append("  SUM( ");
        sql.append("  (SELECT SUM(yq.revenue) ");
        sql.append("  FROM YEAR_PLAN_DETAIL yq ");
        sql.append("  INNER JOIN year_plan y ");
        sql.append("  ON y.year_Plan_id     = yq.year_Plan_id ");
        sql.append("  WHERE yq.SYS_GROUP_ID = ypd.SYS_GROUP_ID ");
        sql.append("  AND yq.year           = ypd.year ");
        sql.append("  AND y.status          = 1 ");
        sql.append("  )) revenueInYear ");
        sql.append("FROM TMPN_TARGET ypd ");
        sql.append("LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ");
        sql.append("ON ypd.SYS_GROUP_ID          =sg.SYS_GROUP_ID ");
        sql.append("WHERE ypd.Total_month_plan_id=:id ");
        sql.append("group by ypd.Total_month_plan_id, ");
        sql.append("  ypd.TMPN_TARGET_ID, ");
        sql.append("  ypd.SYS_GROUP_ID, ");
        sql.append("  ypd.MONTH , ");
        sql.append("  ypd.YEAR, ");
        sql.append("  ypd.QUANTITY , ");
        sql.append("  ypd.COMPLETE, ");
        sql.append("  ypd.REVENUE, ");
        sql.append("  sg.NAME  ");
        sql.append("ORDER BY sg.NAME ASC, ");
        sql.append("  ypd.month ASC  ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
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

    public List<TmpnSourceDTO> getTmpnSourceDTOListByParent(Long id) {
        // TODO Auto-generated method stub
        if (id == null)
            return new ArrayList<TmpnSourceDTO>();
        StringBuilder sql = new StringBuilder("SELECT ypd.Total_month_plan_id totalMonthPlanId,"
                + "ypd.TMPN_SOURCE_ID tmpnSourceId," + "ypd.SYS_GROUP_ID sysGroupId," + "ypd.MONTH month,"
                + "ypd.YEAR year," + "ypd.source source," + "ypd.DIFFERENCE difference," + "ypd.QUANTITY quantity,"
                + "sg.NAME sysGroupName,ypd.Description description " + " FROM TMPN_SOURCE  ypd");
        sql.append(" LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ON ypd.SYS_GROUP_ID =sg.SYS_GROUP_ID  ");
        sql.append("WHERE ypd.Total_month_plan_id=:id");
        sql.append(" ORDER BY sg.NAME ASC,ypd.month ASC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("tmpnSourceId", new LongType());
        query.addScalar("totalMonthPlanId", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("source", new DoubleType());
        query.addScalar("difference", new DoubleType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("description", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnSourceDTO.class));
        return query.list();
    }

    public List<TmpnForceMaintainDTO> getTmpnForceMaintainDTOListByParent(Long id) {
        // TODO Auto-generated method stub
        if (id == null)
            return new ArrayList<TmpnForceMaintainDTO>();
        StringBuilder sql = new StringBuilder("SELECT ypd.Total_month_plan_id totalMonthPlanId,"
                + "ypd.TMPN_FORCE_MAINTAIN_id tmpnForceMaintainId," + "ypd.SYS_GROUP_ID sysGroupId,"
                + "ypd.MONTH month," + "ypd.YEAR year," + "ypd.Build_plan buildPlan," + "ypd.Install_plan installPlan,"
                + "ypd.Replace_plan replacePlan," + "ypd.Team_build_avaiable teamBuildAvaiable,"
                + "ypd.Team_build_require teamBuildRequire," + "ypd.Team_install_require teamInstallRequire,"
                + "ypd.Team_install_avaiable teamInstallAvaiable," + "sg.NAME sysGroupName,ypd.Description description "
                + " FROM TMPN_FORCE_MAINTAIN   ypd");
        sql.append(" LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ON ypd.SYS_GROUP_ID =sg.SYS_GROUP_ID  ");
        sql.append("WHERE ypd.Total_month_plan_id=:id");
        sql.append(" ORDER BY sg.NAME ASC,ypd.month ASC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("tmpnForceMaintainId", new LongType());
        query.addScalar("totalMonthPlanId", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("buildPlan", new LongType());
        query.addScalar("installPlan", new LongType());
        query.addScalar("replacePlan", new LongType());
        query.addScalar("teamBuildRequire", new LongType());
        query.addScalar("teamBuildAvaiable", new LongType());
        query.addScalar("teamInstallRequire", new LongType());
        query.addScalar("teamInstallAvaiable", new LongType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("description", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnForceMaintainDTO.class));
        return query.list();
    }

    public List<TmpnForceNewBtsDTO> getTmpnForceNewBtsDTOListByParent(Long id) {
        // TODO Auto-generated method stub
        if (id == null)
            return new ArrayList<TmpnForceNewBtsDTO>();
        StringBuilder sql = new StringBuilder("SELECT ypd.Total_month_plan_id totalMonthPlanId,"
                + "ypd.TMPN_FORCE_NEW_BTS_ID tmpnForceNewBtsId," + "ypd.SYS_GROUP_ID sysGroupId," + "ypd.MONTH month,"
                + "ypd.YEAR year,"

                + "ypd.Station_number stationNumber," + "ypd.Team_build_require teamBuildRequire,"
                + "ypd.Team_build_avaiable teamBuildAvaiable," + "ypd.Self_implement_percent selfImplementPercent,"
                + "sg.NAME sysGroupName,ypd.Description description " + " FROM TMPN_FORCE_NEW_BTS   ypd");
        sql.append(" LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ON ypd.SYS_GROUP_ID =sg.SYS_GROUP_ID  ");
        sql.append("WHERE ypd.Total_month_plan_id=:id");
        sql.append(" ORDER BY sg.NAME ASC,ypd.month ASC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("tmpnForceNewBtsId", new LongType());
        query.addScalar("totalMonthPlanId", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("stationNumber", new LongType());
        query.addScalar("teamBuildRequire", new LongType());
        query.addScalar("teamBuildAvaiable", new LongType());
        query.addScalar("selfImplementPercent", new DoubleType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("description", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnForceNewBtsDTO.class));
        return query.list();
    }

    public List<TmpnForceNewLineDTO> getTmpnForceNewLineDTOListByParent(Long id) {
        // TODO Auto-generated method stub
        if (id == null)
            return new ArrayList<TmpnForceNewLineDTO>();
        StringBuilder sql = new StringBuilder(
                "SELECT ypd.Total_month_plan_id totalMonthPlanId," + "ypd.TMPN_FORCE_NEW_LINE_ID tmpnForceNewLineId,"
                        + "ypd.SYS_GROUP_ID sysGroupId," + "ypd.MONTH month," + "ypd.YEAR year,"

                        + "ypd.Station_number stationNumber," + "ypd.Current_have_license currentHaveLicense,"
                        + "ypd.Current_quantity currentQuantity," + "ypd.Curent_station_complete curentStationComplete,"
                        + "ypd.Remain_have_license remainHaveLicense," + "ypd.Remain_quantity remainQuantity,"
                        + "ypd.Remain_station_complete remainStationComplete,"
                        + "sg.NAME sysGroupName,ypd.Description description " + " FROM TMPN_FORCE_NEW_LINE   ypd");
        sql.append(" LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ON ypd.SYS_GROUP_ID =sg.SYS_GROUP_ID  ");
        sql.append("WHERE ypd.Total_month_plan_id=:id");
        sql.append(" ORDER BY sg.NAME ASC,ypd.month ASC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("tmpnForceNewLineId", new LongType());
        query.addScalar("totalMonthPlanId", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("stationNumber", new DoubleType());
        query.addScalar("currentHaveLicense", new DoubleType());
        query.addScalar("currentQuantity", new DoubleType());
        query.addScalar("curentStationComplete", new DoubleType());
        query.addScalar("remainHaveLicense", new DoubleType());
        query.addScalar("remainQuantity", new DoubleType());
        query.addScalar("remainStationComplete", new DoubleType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("description", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnForceNewLineDTO.class));
        return query.list();
    }

    public List<TmpnMaterialDTO> getTmpnMaterialDTOListByParent(Long id) {
        // TODO Auto-generated method stub
        if (id == null)
            return new ArrayList<TmpnMaterialDTO>();
        StringBuilder sql = new StringBuilder("SELECT ypd.Total_month_plan_id totalMonthPlanId,"
                + "ypd.TMPN_MATERIAL_ID tmpnMaterialId," + "ypd.SYS_GROUP_ID sysGroupId," + "ypd.MONTH month,"
                + "ypd.YEAR year," + "ypd.Cat_construction_deploy_id catConstructionDeployId,"
                + "ypd.Cat_construction_type_id catConstructionTypeId," + "ccd.name catConstructionDeployName,"
                + "cct.name catConstructionTypeName," + "sg.NAME sysGroupName,ypd.Description description "
                + " FROM TMPN_MATERIAL   ypd");
        sql.append(" LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ON ypd.SYS_GROUP_ID =sg.SYS_GROUP_ID  ");
        sql.append(
                " LEFT JOIN CTCT_CAT_OWNER.Cat_construction_deploy ccd ON ypd.Cat_construction_deploy_id =ccd.Cat_construction_deploy_id  ");
        sql.append(
                " LEFT JOIN CTCT_CAT_OWNER.CAT_CONSTRUCTION_TYPE cct ON ypd.Cat_construction_type_id =cct.Cat_construction_type_id  ");
        sql.append("WHERE ypd.Total_month_plan_id=:id");
        sql.append(" ORDER BY sg.NAME ASC,ypd.month ASC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("tmpnMaterialId", new LongType());
        query.addScalar("totalMonthPlanId", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("catConstructionDeployId", new LongType());
        query.addScalar("catConstructionTypeId", new LongType());
        query.addScalar("catConstructionDeployName", new StringType());
        query.addScalar("catConstructionTypeName", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("description", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnMaterialDTO.class));
        return query.list();
    }

    public List<TmpnFinanceDTO> getTmpnFinanceDTOListByParent(Long id) {
        // TODO Auto-generated method stub
        if (id == null)
            return new ArrayList<TmpnFinanceDTO>();
        StringBuilder sql = new StringBuilder("SELECT ypd.Total_month_plan_id totalMonthPlanId,"
                + "ypd.TMPN_FINANCE_ID tmpnFinanceId," + "ypd.SYS_GROUP_ID sysGroupId," + "ypd.MONTH month,"
                + "ypd.YEAR year," + "ypd.First_times firstTimes," + "ypd.Second_times secondTimes,"
                + "ypd.Three_times threeTimes," + "sg.NAME sysGroupName,ypd.Description description "
                + " FROM TMPN_FINANCE   ypd");
        sql.append(" LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ON ypd.SYS_GROUP_ID =sg.SYS_GROUP_ID  ");
        sql.append("WHERE ypd.Total_month_plan_id=:id");
        sql.append(" ORDER BY sg.NAME ASC,ypd.month ASC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("tmpnFinanceId", new LongType());
        query.addScalar("totalMonthPlanId", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("firstTimes", new DoubleType());
        query.addScalar("secondTimes", new DoubleType());
        query.addScalar("threeTimes", new DoubleType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("description", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnFinanceDTO.class));
        return query.list();
    }

    public List<TmpnContractDTO> getTmpnContractDTOListByParent(Long id) {
        // TODO Auto-generated method stub
        if (id == null)
            return new ArrayList<TmpnContractDTO>();
        StringBuilder sql = new StringBuilder("SELECT ypd.Total_month_plan_id totalMonthPlanId,"
                + "ypd.TMPN_CONTRACT_ID tmpnContractId," + "ypd.SYS_GROUP_ID sysGroupId," + "ypd.MONTH month,"
                + "ypd.YEAR year," + "ypd.Complete complete," + "ypd.Enough_condition enoughCondition,"
                + "ypd.No_enough_condition noEnoughCondition," + "sg.NAME sysGroupName,ypd.Description description "
                + " FROM TMPN_CONTRACT   ypd");
        sql.append(" LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ON ypd.SYS_GROUP_ID =sg.SYS_GROUP_ID  ");
        sql.append("WHERE ypd.Total_month_plan_id=:id");
        sql.append(" ORDER BY sg.NAME ASC,ypd.month ASC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("tmpnContractId", new LongType());
        query.addScalar("totalMonthPlanId", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("complete", new DoubleType());
        query.addScalar("enoughCondition", new DoubleType());
        query.addScalar("noEnoughCondition", new DoubleType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("description", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnContractDTO.class));
        return query.list();
    }

    public List<TotalMonthPlanSimpleDTO> fillterAllActiveCatConstructionType(TotalMonthPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("SELECT CAT_CONSTRUCTION_TYPE_ID catConstructionTypeId,"
                + "NAME catConstructionTypeName" + " FROM CTCT_CAT_OWNER.CAT_CONSTRUCTION_TYPE WHERE 1=1 ");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (upper(CODE) LIKE upper(:keySearch) OR upper(NAME) LIKE upper(:keySearch) escape '&')");
        }
        sql.append(" AND STATUS = 1");

        sql.append(" ORDER BY CREATED_DATE");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("catConstructionTypeId", new LongType());
        query.addScalar("catConstructionTypeName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TotalMonthPlanSimpleDTO.class));
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
        }
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        return query.list();
    }

    public List<TotalMonthPlanSimpleDTO> fillterAllActiveCatConstructionDeploy(TotalMonthPlanSimpleDTO obj) {
        if (obj.getCatConstructionTypeId() == null)
            return new ArrayList<TotalMonthPlanSimpleDTO>();
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("SELECT CAT_CONSTRUCTION_DEPLOY_ID catConstructionDeployId,"
                + "NAME catConstructionDeployName" + " FROM CTCT_CAT_OWNER.CAT_CONSTRUCTION_DEPLOY WHERE 1=1 ");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (upper(CODE) LIKE upper(:keySearch) OR upper(NAME) LIKE upper(:keySearch) escape '&')");
        }
        if (obj.getCatConstructionTypeId() != null) {
            sql.append(" and CAT_CONSTRUCTION_TYPE_ID = :catConstructionTypeId");
        }
        sql.append(" AND STATUS = 1");

        sql.append(" ORDER BY CREATED_DATE");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("catConstructionDeployId", new LongType());
        query.addScalar("catConstructionDeployName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TotalMonthPlanSimpleDTO.class));
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
        }
        if (obj.getCatConstructionTypeId() != null) {
            query.setParameter("catConstructionTypeId", obj.getCatConstructionTypeId());
        }
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        return query.list();
    }

    public List<TotalMonthPlanSimpleDTO> getAllConstructionType() {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(

                "SELECT CCD.CAT_CONSTRUCTION_DEPLOY_ID catConstructionDeployId," + "CCD.NAME catConstructionDeployName,"
                        + "CCT.NAME catConstructionTypeName," + "CCT.CAT_CONSTRUCTION_TYPE_ID catConstructionTypeId"
                        + " FROM CTCT_CAT_OWNER.CAT_CONSTRUCTION_DEPLOY CCD "
                        + "LEFT JOIN CTCT_CAT_OWNER.CAT_CONSTRUCTION_TYPE CCT ON CCT.CAT_CONSTRUCTION_TYPE_ID =CCD.CAT_CONSTRUCTION_TYPE_ID"
                        + " WHERE 1=1 ");
        sql.append(" AND CCD.STATUS = 1");

        sql.append(" ORDER BY CCT.CAT_CONSTRUCTION_TYPE_ID, CCD.CAT_CONSTRUCTION_DEPLOY_ID ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("catConstructionTypeId", new LongType());
        query.addScalar("catConstructionTypeName", new StringType());
        query.addScalar("catConstructionDeployId", new LongType());
        query.addScalar("catConstructionDeployName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TotalMonthPlanSimpleDTO.class));
        return query.list();
    }

    /*
     * public List<TotalMonthPlanSimpleDTO> getAllConstructionDeploy() { // TODO
     * Auto-generated method stub StringBuilder sql = new StringBuilder(
     * "SELECT CAT_CONSTRUCTION_DEPLOY_ID catConstructionDeployId, " +
     * "NAME catConstructionDeployName" +
     * " FROM CTCT_CAT_OWNER.CAT_CONSTRUCTION_DEPLOY WHERE 1=1 ");
     * sql.append(" AND STATUS = 1");
     *
     * sql.append(" ORDER BY CREATED_DATE"); SQLQuery query =
     * getSession().createSQLQuery(sql.toString());
     *
     * query.addScalar("catConstructionDeployId", new LongType());
     * query.addScalar("catConstructionDeployName", new StringType());
     * query.setResultTransformer(Transformers
     * .aliasToBean(TotalMonthPlanSimpleDTO.class)); return query.list(); }
     */

    public TotalMonthPlanSimpleDTO getConstructionTypeByCode(String constructionType) {
        TotalMonthPlanSimpleDTO rs = new TotalMonthPlanSimpleDTO();
        // TODO Auto-generated method stub
        if (StringUtils.isNotEmpty(constructionType)) {
            StringBuilder sql = new StringBuilder("SELECT CAT_CONSTRUCTION_TYPE_ID catConstructionTypeId,"
                    + "NAME catConstructionTypeName" + " FROM CTCT_CAT_OWNER.CAT_CONSTRUCTION_TYPE WHERE 1 = 1 "
                    + " AND STATUS = 1 and CAT_CONSTRUCTION_TYPE_ID=:constructionType ");

            SQLQuery query = getSession().createSQLQuery(sql.toString());
            query.setParameter("constructionType", constructionType);
            query.addScalar("catConstructionTypeId", new LongType());
            query.addScalar("catConstructionTypeName", new StringType());
            query.setResultTransformer(Transformers.aliasToBean(TotalMonthPlanSimpleDTO.class));
            List<TotalMonthPlanSimpleDTO> ls = query.list();
            if (ls != null && !ls.isEmpty()) {
                rs = ls.get(0);
            }
        }
        return rs;
    }

    public TotalMonthPlanSimpleDTO getConstructionDeployById(String id) {
        TotalMonthPlanSimpleDTO rs = new TotalMonthPlanSimpleDTO();
        // TODO Auto-generated method stub
        if (StringUtils.isNotEmpty(id)) {
            StringBuilder sql = new StringBuilder(
                    "SELECT CAT_CONSTRUCTION_DEPLOY_ID catConstructionDeployId, " + "NAME catConstructionDeployName"
                            + " FROM CTCT_CAT_OWNER.CAT_CONSTRUCTION_DEPLOY where CAT_CONSTRUCTION_DEPLOY_ID=:id");
            SQLQuery query = getSession().createSQLQuery(sql.toString());
            query.setParameter("id", id);
            query.addScalar("catConstructionDeployId", new LongType());
            query.addScalar("catConstructionDeployName", new StringType());
            query.setResultTransformer(Transformers.aliasToBean(TotalMonthPlanSimpleDTO.class));
            List<TotalMonthPlanSimpleDTO> ls = query.list();
            if (ls != null && !ls.isEmpty()) {
                rs = ls.get(0);
            }
        }
        return rs;
    }

    public YearPlanDetailDTO getYearPlanDetail(TotalMonthPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("SELECT   sum(ypd.SOURCE) source,  sum(ypd.QUANTITY) quantity, "
                + " sum(ypd.COMPLETE) complete,  sum(ypd.REVENUE) revenue,  sg.NAME sysGroupName "
                + " FROM YEAR_PLAN_DETAIL ypd LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg "
                + " ON ypd.SYS_GROUP_ID =sg.SYS_GROUP_ID "
                + " left join year_plan yp on yp.YEAR_PLAN_ID = ypd.YEAR_PLAN_ID " + " WHERE ypd.month     =:month "
                + " AND ypd.year        = :year and ypd.SYS_GROUP_ID = :sysGroupId and rownum = 1  and yp.status = 1 group by sg.NAME order by sg.NAME ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("month", obj.getMonth());
        query.setParameter("year", obj.getYear());
        query.setParameter("sysGroupId", obj.getSysGroupId());
        query.addScalar("source", new DoubleType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("complete", new DoubleType());
        query.addScalar("revenue", new DoubleType());
        query.addScalar("sysGroupName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(YearPlanDetailDTO.class));
        return (YearPlanDetailDTO) query.uniqueResult();
    }

    public List<TmpnTargetDTO> getTargetForExport(Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(" WITH parent AS ");
        sql.append("  (SELECT SUM(ypd.QUANTITY) quantity, ");
        sql.append("    SUM(ypd.COMPLETE) complete, ");
        sql.append("    NULL sysGroupName, ");
        sql.append("    SUM((SELECT SUM(work.quantity) ");
        sql.append("    FROM WORK_ITEM WORK ");
        sql.append("    WHERE work.CONSTRUCTOR_ID  =ypd.SYS_GROUP_ID ");
        sql.append("    AND EXTRACT(MONTH FROM work.complete_date)>=1 ");
        sql.append("    AND EXTRACT(MONTH FROM work.complete_date) <ypd.month ");
        sql.append("    AND EXTRACT(YEAR FROM work.complete_date)  =ypd.year ");
        sql.append("    )) quantityLk,SUM( ");
        sql.append("    (SELECT SUM(consH.complete_value) ");
        sql.append("    FROM CONSTRUCTION consH, ");
        sql.append("      CONSTRUCTION_TASK b ");
        sql.append("    WHERE consH.construction_id        =b.construction_id ");
        sql.append("    AND b.type                         =2 ");
        sql.append("    AND b.status                       =4 ");
        sql.append("    AND (consH.status                  =5 ");
        sql.append("    OR (consH.status                   =4 ");
        sql.append("    AND consH.is_obstructed            =1 ");
        sql.append("    AND consH.obstructed_state         =2)) ");
        sql.append("    AND consH.SYS_GROUP_ID             =ypd.SYS_GROUP_ID ");
        sql.append("    AND EXTRACT(MONTH FROM b.end_date)>=1 ");
        sql.append("    AND EXTRACT(MONTH FROM b.end_date) <ypd.month ");
        sql.append("    AND EXTRACT(YEAR FROM b.end_date)  = ypd.year ");
        sql.append("    )) completeLk,SUM( ");
        sql.append("    (SELECT SUM(yq.quantity) ");
        sql.append("    FROM YEAR_PLAN_DETAIL yq INNER JOIN year_plan y ");
        sql.append("  ON y.year_Plan_id     = yq.year_Plan_id and y.status=1 ");
        sql.append("    WHERE yq.SYS_GROUP_ID = ypd.SYS_GROUP_ID ");
        sql.append("    AND yq.year           = ypd.year ");
        sql.append("    )) quantityInYear, SUM( ");
        sql.append("    (SELECT SUM(yq.complete) ");
        sql.append("    FROM YEAR_PLAN_DETAIL yq INNER JOIN year_plan y ");
        sql.append("  ON y.year_Plan_id     = yq.year_Plan_id and y.status=1 ");
        sql.append("    WHERE yq.SYS_GROUP_ID = ypd.SYS_GROUP_ID ");
        sql.append("    AND yq.year           = ypd.year ");
        sql.append("    )) completeInYear,0 stt ");
        sql.append("  FROM TMPN_TARGET ypd ");
        sql.append("  INNER JOIN TOTAL_MONTH_PLAN tmpn ");
        sql.append("  ON ypd.Total_month_plan_id   = tmpn.Total_month_plan_id ");
        sql.append("  AND tmpn.status              =1 ");
        sql.append("  WHERE ypd.Total_month_plan_id=:id ");
        sql.append("  ) , child AS ");
        sql.append("  (SELECT ypd.QUANTITY quantity, ");
        sql.append("    ypd.COMPLETE complete, ");
        sql.append("    sg.NAME sysGroupName, ");
        sql.append("    (SELECT SUM(work.quantity) ");
        sql.append("    FROM WORK_ITEM WORK ");
        sql.append("    WHERE work.CONSTRUCTOR_ID                  =ypd.SYS_GROUP_ID ");
        sql.append("    AND EXTRACT(MONTH FROM work.complete_date)>=1 ");
        sql.append("    AND EXTRACT(MONTH FROM work.complete_date) <ypd.month ");
        sql.append("    AND EXTRACT(YEAR FROM work.complete_date)  =ypd.year ");
        sql.append("    ) quantityLk,(SELECT SUM(consH.complete_value) ");
        sql.append("    FROM CONSTRUCTION consH, CONSTRUCTION_TASK b ");
        sql.append("    WHERE consH.SYS_GROUP_ID           =ypd.SYS_GROUP_ID ");
        sql.append("    AND consH.construction_id          =b.construction_id ");
        sql.append("    AND b.type                         =2 ");
        sql.append("    AND b.status                       =4 ");
        sql.append("    AND (consH.status                  =5 ");
        sql.append("    OR (consH.status                   =4 ");
        sql.append("    AND consH.is_obstructed            =1 ");
        sql.append("    AND consH.obstructed_state         =2)) ");
        sql.append("    AND EXTRACT(MONTH FROM b.end_date)>=1 ");
        sql.append("    AND EXTRACT(MONTH FROM b.end_date) <ypd.month ");
        sql.append("    AND EXTRACT(YEAR FROM b.end_date)  =ypd.year ");
        sql.append("    ) completeLk, ");
        sql.append("    (SELECT SUM(yq.quantity) ");
        sql.append("    FROM YEAR_PLAN_DETAIL yq INNER JOIN year_plan y ");
        sql.append("  ON y.year_Plan_id     = yq.year_Plan_id and y.status=1 ");
        sql.append("    WHERE yq.SYS_GROUP_ID = ypd.SYS_GROUP_ID ");
        sql.append("    AND yq.year           = ypd.year ");
        sql.append("    ) quantityInYear, ");
        sql.append("    (SELECT SUM(yq.complete) ");
        sql.append("    FROM YEAR_PLAN_DETAIL yq INNER JOIN year_plan y ");
        sql.append("  ON y.year_Plan_id     = yq.year_Plan_id and y.status=1 ");
        sql.append("    WHERE yq.SYS_GROUP_ID = ypd.SYS_GROUP_ID ");
        sql.append("    AND yq.year           = ypd.year ");
        sql.append("    ) completeInYear, 1 stt ");
        sql.append("  FROM TMPN_TARGET ypd ");
        sql.append("  LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ");
        sql.append("  ON ypd.SYS_GROUP_ID =sg.SYS_GROUP_ID ");
        sql.append("  INNER JOIN TOTAL_MONTH_PLAN tmpn ");
        sql.append("  ON ypd.Total_month_plan_id   = tmpn.Total_month_plan_id ");
        sql.append("  AND tmpn.status              =1 ");
        sql.append("  WHERE ypd.Total_month_plan_id=:id ");
        sql.append("  ORDER BY sg.NAME ASC ), ");
        sql.append("  records AS ( SELECT * FROM child ");
        sql.append("  UNION ALL SELECT * FROM parent ) ");
        sql.append("SELECT * FROM records ORDER BY stt ASC,sysGroupName ASC ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", totalMonthPlanId);
        query.addScalar("quantity", new DoubleType());
        query.addScalar("complete", new DoubleType());
        query.addScalar("quantityLk", new DoubleType());
        query.addScalar("completeLk", new DoubleType());
        query.addScalar("completeInYear", new DoubleType());
        query.addScalar("quantityInYear", new DoubleType());
        query.addScalar("sysGroupName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnTargetDTO.class));
        return query.list();
    }

    public List<TmpnSourceDTO> getSourceForExport(Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " with parent as(SELECT sum(ypd.source) source,sum(ypd.DIFFERENCE) difference, sum(ypd.quantity)  quantity , null sysGroupName, null description,0 stt FROM TMPN_SOURCE ypd ");
        sql.append(" LEFT JOIN SYS_GROUP sg ON ypd.SYS_GROUP_ID          =sg.SYS_GROUP_ID ");
        sql.append(" WHERE ypd.Total_month_plan_id=:id group by ypd.Total_month_plan_id ),child as( ");
        sql.append(
                " SELECT ypd.source source, ypd.DIFFERENCE difference, ypd.quantity quantity,   sg.NAME sysGroupName, ");
        sql.append(" ypd.Description description, 1 stt FROM TMPN_SOURCE ypd ");
        sql.append(" LEFT JOIN SYS_GROUP sg ON ypd.SYS_GROUP_ID          =sg.SYS_GROUP_ID ");
        sql.append(" WHERE ypd.Total_month_plan_id=:id ");
        sql.append(
                " ORDER BY sg.NAME ASC),  record as(select * from parent union all select * from child  ) select * from record ORDER BY stt ASC,sysGroupName ASC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", totalMonthPlanId);
        query.addScalar("source", new DoubleType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("difference", new DoubleType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("description", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnSourceDTO.class));
        return query.list();
    }

    public List<TmpnForceMaintainDTO> getForceMaintainForExport(Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " with parent as(select sum(ypd.Build_plan) buildPlan , sum(ypd.Install_plan) installPlan, sum(ypd.Replace_plan) replacePlan, sum(ypd.Team_build_avaiable) teamBuildAvaiable,  ");
        sql.append(
                " sum(ypd.Team_build_require) teamBuildRequire, sum(ypd.Team_install_require) teamInstallRequire, sum(ypd.Team_install_avaiable) teamInstallAvaiable,null sysGroupName,null description, 0 stt   ");
        sql.append(
                " FROM TMPN_FORCE_MAINTAIN ypd WHERE ypd.Total_month_plan_id=:id), child as(SELECT  ypd.Build_plan buildPlan,  ypd.Install_plan installPlan, ");
        sql.append(
                " ypd.Replace_plan replacePlan,  ypd.Team_build_avaiable teamBuildAvaiable,  ypd.Team_build_require teamBuildRequire, ");
        sql.append(
                " ypd.Team_install_require teamInstallRequire,  ypd.Team_install_avaiable teamInstallAvaiable,  sg.NAME sysGroupName, ");
        sql.append(
                " ypd.Description description,1 stt FROM TMPN_FORCE_MAINTAIN ypd LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ");
        sql.append(
                " ON ypd.SYS_GROUP_ID          =sg.SYS_GROUP_ID WHERE ypd.Total_month_plan_id=:id ORDER BY sg.NAME ASC, ");
        sql.append(
                "   ypd.month ASC ), record as  (select * from parent union all select * from child) select * from record ORDER BY stt ASC,sysGroupName ASC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", totalMonthPlanId);
        query.addScalar("buildPlan", new LongType());
        query.addScalar("installPlan", new LongType());
        query.addScalar("replacePlan", new LongType());
        query.addScalar("teamBuildRequire", new LongType());
        query.addScalar("teamBuildAvaiable", new LongType());
        query.addScalar("teamInstallRequire", new LongType());
        query.addScalar("teamInstallAvaiable", new LongType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("description", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnForceMaintainDTO.class));
        return query.list();
    }

    public List<TmpnForceNewBtsDTO> getBTSForExport(Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " with parent as( select sum(ypd.Station_number) stationNumber, sum(ypd.Team_build_require) teamBuildRequire,sum(ypd.Team_build_avaiable) teamBuildAvaiable, ");
        sql.append(
                " AVG(ypd.Self_implement_percent)selfImplementPercent, null sysGroupName,null description, 0 stt  FROM TMPN_FORCE_NEW_BTS ypd WHERE ypd.Total_month_plan_id=:id), ");
        sql.append(
                " child as(SELECT   ypd.Station_number stationNumber,  ypd.Team_build_require teamBuildRequire,  ypd.Team_build_avaiable teamBuildAvaiable, ");
        sql.append(
                " ypd.Self_implement_percent selfImplementPercent,  sg.NAME sysGroupName,  ypd.Description description, 1 stt FROM TMPN_FORCE_NEW_BTS ypd ");
        sql.append(
                " LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ON ypd.SYS_GROUP_ID          =sg.SYS_GROUP_ID WHERE ypd.Total_month_plan_id=:id ");
        sql.append(
                " ORDER BY sg.NAME ASC ), record as( select * from parent union all select * from child) select * from record ORDER BY stt ASC,sysGroupName ASC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", totalMonthPlanId);
        query.addScalar("stationNumber", new LongType());
        query.addScalar("teamBuildRequire", new LongType());
        query.addScalar("teamBuildAvaiable", new LongType());
        query.addScalar("selfImplementPercent", new DoubleType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("description", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnForceNewBtsDTO.class));
        return query.list();
    }

    public List<TmpnForceNewLineDTO> getNewLineForExport(Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " with parent as (select sum(ypd.Station_number) stationNumber, sum(ypd.Current_have_license) currentHaveLicense, sum(ypd.Current_quantity) currentQuantity, ");
        sql.append(
                " sum(ypd.Curent_station_complete) curentStationComplete,sum(ypd.Remain_have_license) remainHaveLicense, sum(ypd.Remain_quantity) remainQuantity, sum( ypd.Remain_station_complete) remainStationComplete, ");
        sql.append(
                " null sysGroupName, null description, 0 stt FROM TMPN_FORCE_NEW_LINE ypd WHERE ypd.Total_month_plan_id=:id ");
        sql.append(
                " ),child as(SELECT  ypd.Station_number stationNumber,  ypd.Current_have_license currentHaveLicense, ");
        sql.append(
                " ypd.Current_quantity currentQuantity,  ypd.Curent_station_complete curentStationComplete,  ypd.Remain_have_license remainHaveLicense, ");
        sql.append(
                " ypd.Remain_quantity remainQuantity,  ypd.Remain_station_complete remainStationComplete,  sg.NAME sysGroupName, ");
        sql.append(
                " ypd.Description description, 1 stt FROM TMPN_FORCE_NEW_LINE ypd LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ");
        sql.append(
                " ON ypd.SYS_GROUP_ID          =sg.SYS_GROUP_ID WHERE ypd.Total_month_plan_id=:id ORDER BY sg.NAME ASC, ");
        sql.append(
                "   ypd.month ASC), record as (select * from parent union all select * from child) select * from record ORDER BY stt ASC,sysGroupName ASC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", totalMonthPlanId);
        query.addScalar("stationNumber", new DoubleType());
        query.addScalar("currentHaveLicense", new DoubleType());
        query.addScalar("currentQuantity", new DoubleType());
        query.addScalar("curentStationComplete", new DoubleType());
        query.addScalar("remainHaveLicense", new DoubleType());
        query.addScalar("remainQuantity", new DoubleType());
        query.addScalar("remainStationComplete", new DoubleType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("description", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnForceNewLineDTO.class));
        return query.list();
    }

    public List<TmpnMaterialDTO> getMaterialForExport(Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("SELECT ypd.Total_month_plan_id totalMonthPlanId,"
                + "ypd.TMPN_MATERIAL_ID tmpnMaterialId," + "ypd.SYS_GROUP_ID sysGroupId," + "ypd.MONTH month,"
                + "ypd.YEAR year," + "ypd.Cat_construction_deploy_id catConstructionDeployId,"
                + "ypd.Cat_construction_type_id catConstructionTypeId," + "ccd.name catConstructionDeployName,"
                + "cct.name catConstructionTypeName," + "sg.NAME sysGroupName,ypd.Description description "
                + " FROM TMPN_MATERIAL   ypd");
        sql.append(" LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ON ypd.SYS_GROUP_ID =sg.SYS_GROUP_ID  ");
        sql.append(
                " LEFT JOIN CTCT_CAT_OWNER.Cat_construction_deploy ccd ON ypd.Cat_construction_deploy_id =ccd.Cat_construction_deploy_id  ");
        sql.append(
                " LEFT JOIN CTCT_CAT_OWNER.CAT_CONSTRUCTION_TYPE cct ON ypd.Cat_construction_type_id =cct.Cat_construction_type_id  ");
        sql.append("WHERE ypd.Total_month_plan_id=:id");
        sql.append(" ORDER BY sg.NAME ASC,ypd.month ASC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", totalMonthPlanId);
        query.addScalar("tmpnMaterialId", new LongType());
        query.addScalar("totalMonthPlanId", new LongType());
        query.addScalar("year", new LongType());
        query.addScalar("month", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("catConstructionDeployId", new LongType());
        query.addScalar("catConstructionTypeId", new LongType());
        query.addScalar("catConstructionDeployName", new StringType());
        query.addScalar("catConstructionTypeName", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("description", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnMaterialDTO.class));
        return query.list();
    }

    public List<TmpnFinanceDTO> getFinanceForExport(Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " with parent as(select sum(ypd.First_times)+sum(ypd.Second_times)+ sum(ypd.Three_times) firstTimes , null sysGroupName, null description, 0 stt FROM TMPN_FINANCE ypd WHERE ypd.Total_month_plan_id=:id), ");
        sql.append(" child as(SELECT   sum(ypd.First_times)+sum(ypd.Second_times)+ sum(ypd.Three_times) firstTimes, ");
        sql.append(" sg.NAME sysGroupName,  ypd.Description description, 1 stt FROM TMPN_FINANCE ypd ");
        sql.append(" LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg ON ypd.SYS_GROUP_ID          =sg.SYS_GROUP_ID ");
        sql.append(" WHERE ypd.Total_month_plan_id=:id group by sg.NAME   ,ypd.Description), ");
        sql.append(
                " record as( select * from parent union all select * from child) select * from record ORDER BY stt ASC,sysGroupName ASC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", totalMonthPlanId);
        query.addScalar("firstTimes", new DoubleType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("description", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnFinanceDTO.class));
        return query.list();
    }

    public List<TmpnContractDTO> setContractForExport(Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " WITH parent AS  (SELECT SUM(ypd.Complete) complete,    SUM(ypd.Enough_condition) enoughCondition, ");
        sql.append(
                "   SUM(ypd.No_enough_condition) noEnoughCondition,    NULL sysGroupName,    NULL description,    0 stt");
        sql.append(" FROM TMPN_CONTRACT ypd  WHERE ypd.Total_month_plan_id=:id  ),  child AS ");
        sql.append(
                " (SELECT ypd.Complete complete,    ypd.Enough_condition enoughCondition,    ypd.No_enough_condition noEnoughCondition, ");
        sql.append(" sg.NAME sysGroupName,    ypd.Description description,    1 stt  FROM TMPN_CONTRACT ypd ");
        sql.append(
                " LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sg  ON ypd.SYS_GROUP_ID          =sg.SYS_GROUP_ID  WHERE ypd.Total_month_plan_id=:id ");
        sql.append(
                " ORDER BY sg.NAME ASC,    ypd.month ASC  ),  record AS  ( SELECT * FROM parent  UNION ALL  SELECT * FROM child  )SELECT * FROM record ORDER BY stt ASC,sysGroupName ASC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", totalMonthPlanId);
        query.addScalar("complete", new DoubleType());
        query.addScalar("enoughCondition", new DoubleType());
        query.addScalar("noEnoughCondition", new DoubleType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("description", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(TmpnContractDTO.class));
        return query.list();
    }

    public List<TmpnTargetDTO> getLKBySysList(Long month, Long year, List<Long> sysGroupIdList) {

        StringBuilder sql = new StringBuilder(" SELECT ypd.SYS_GROUP_ID sysGroupId, ");
        sql.append("   ypd.NAME sysGroupName, ");
        // chinhpxn20180629start
//		sql.append("   (SELECT SUM(work.quantity) ");
//		sql.append("   FROM WORK_ITEM WORK ");
//		sql.append("   WHERE work.CONSTRUCTOR_ID                  =ypd.SYS_GROUP_ID ");
//		sql.append("   AND EXTRACT(MONTH FROM work.complete_date)>=1 ");
//		sql.append("   AND EXTRACT(MONTH FROM work.complete_date) <:month ");
//		sql.append("   AND EXTRACT(YEAR FROM work.complete_date)  =:year ");
//		sql.append("   ) quantityLk, ");
        sql.append("  ( ");
        sql.append("  (SELECT SUM(work.quantity) ");
        sql.append("  FROM WORK_ITEM work, CONSTRUCTION cons ");
        sql.append("  WHERE work.CONSTRUCTION_ID         =cons.CONSTRUCTION_ID and cons.status !=0 ");
        sql.append("  AND work.CONSTRUCTOR_ID = ypd.SYS_GROUP_ID ");
        sql.append("  AND cons.CAT_CONSTRUCTION_TYPE_ID != 2 ");
        sql.append("  AND EXTRACT(MONTH FROM work.complete_date)>=1 ");
        sql.append("  AND EXTRACT(MONTH FROM work.complete_date) < :month ");
        sql.append("  AND EXTRACT(YEAR FROM work.complete_date) = :year ");
        sql.append("  ) ");
        sql.append("  + ");
        sql.append("  NVL((SELECT SUM(consTaskDaily.QUANTITY) ");
        sql.append("  FROM CONSTRUCTION_TASK_DAILY consTaskDaily ");
        sql.append("  WHERE consTaskDaily.SYS_GROUP_ID = ypd.SYS_GROUP_ID ");
        sql.append("  AND EXTRACT(MONTH FROM consTaskDaily.APPROVE_DATE) >= 1 ");
        sql.append("  AND EXTRACT(MONTH FROM consTaskDaily.APPROVE_DATE) < :month ");
        sql.append("  AND EXTRACT(YEAR FROM consTaskDaily.APPROVE_DATE) = :year ");
        sql.append("  AND consTaskDaily.CONFIRM = '1'),0) ");
        sql.append("  ) quantityLk, ");
        // chinhpxn20180629end
        sql.append("  (SELECT SUM(cons.complete_value) ");
        sql.append("   FROM CONSTRUCTION cons inner join CONSTRUCTION_TASK b ");
        sql.append("   on cons.construction_id        =b.construction_id ");
        sql.append("   WHERE cons.SYS_GROUP_ID                            = ypd.SYS_GROUP_ID ");
        sql.append("     AND b.type                         =2 ");
        sql.append("   AND b.status                       =4 ");
        sql.append("   AND (cons.status                  =5 ");
        sql.append("   OR (cons.status                   =4 ");
        sql.append("   AND cons.is_obstructed            =1 ");
        sql.append("   AND cons.obstructed_state         =2)) ");
        sql.append("   AND EXTRACT(MONTH FROM b.end_date)>=1 ");
        sql.append("   AND EXTRACT(MONTH FROM b.end_date) <:month ");
        sql.append("   AND EXTRACT(YEAR FROM b.end_date)  =:year ");
        sql.append("   ) completeLk, ");
        // chinhpxn20180629start
//		sql.append("   (SELECT SUM(consH.approve_revenue_value) ");
//		sql.append("   FROM CONSTRUCTION consH ");
//		sql.append("   WHERE consH.SYS_GROUP_ID                           =ypd.SYS_GROUP_ID ");
//		sql.append("   AND EXTRACT(MONTH FROM consH.approve_revenue_date)>=1 ");
//		sql.append("   AND EXTRACT(MONTH FROM consH.approve_revenue_date) <:month ");
//		sql.append("   AND EXTRACT(YEAR FROM consH.approve_revenue_date)  =:year ");
//		sql.append("   ) revenueLk, ");
        sql.append("  (SELECT SUM(consH.approve_revenue_value) ");
        sql.append("  FROM CONSTRUCTION consH ");
        sql.append("  inner JOIN CNT_CONSTR_WORK_ITEM_TASK constrTask ");
        sql.append("  ON constrTask.CONSTRUCTION_ID = consH.CONSTRUCTION_ID ");
        sql.append("  inner JOIN CNT_CONTRACT cntContract ");
        sql.append("  ON cntContract.CNT_CONTRACT_ID                    = constrTask.CNT_CONTRACT_ID ");
        sql.append("  inner JOIN SYS_GROUP sys ");
        sql.append("  ON cntContract.SYS_GROUP_ID = sys.SYS_GROUP_ID ");
        sql.append("  WHERE ypd.SYS_GROUP_ID = (CASE sys.GROUP_LEVEL    ");
        sql.append("    WHEN '1' THEN (select s.SYS_GROUP_ID from SYS_GROUP s, APP_PARAM a where ");
        sql.append("                    s.CODE= a.CODE and a.PAR_TYPE = 'SYS_GROUP_REVENUE') ");
        sql.append("    ELSE cntContract.SYS_GROUP_ID ");
        sql.append("    END ");
        sql.append("  ) ");
        sql.append("  AND cntContract.CONTRACT_TYPE                     = 0 ");
        sql.append("  AND consH.status !=0 and  constrTask.status !=0 and cntContract.status !=0 ");
        sql.append("  AND EXTRACT(MONTH FROM consH.approve_revenue_date) >=1 ");
        sql.append("  AND EXTRACT(MONTH FROM consH.approve_revenue_date) < :month ");
        sql.append("  AND EXTRACT(YEAR FROM consH.approve_revenue_date)  = :year ");
        sql.append("  ) revenueLk, ");
        // chinhpxn20180629end
        sql.append("   (SELECT SUM(yq.quantity) ");
        sql.append("   FROM YEAR_PLAN_DETAIL yq ");
        sql.append("   INNER JOIN YEAR_PLAN yp ");
        sql.append("   ON yq.YEAR_PLAN_ID    = yp.YEAR_PLAN_ID ");
        sql.append("   AND yp.status         =1 ");
        sql.append("   WHERE yq.SYS_GROUP_ID = ypd.SYS_GROUP_ID ");
        sql.append("   AND yq.year           = :year ");
        sql.append("   ) quantityInYear, ");
        sql.append("   (SELECT SUM(yq.complete) ");
        sql.append("   FROM YEAR_PLAN_DETAIL yq ");
        sql.append("   INNER JOIN YEAR_PLAN yp ");
        sql.append("   ON yq.YEAR_PLAN_ID    = yp.YEAR_PLAN_ID ");
        sql.append("   AND yp.status         =1 ");
        sql.append("   WHERE yq.SYS_GROUP_ID = ypd.SYS_GROUP_ID ");
        sql.append("   AND yq.year           = :year ");
        sql.append("   ) completeInYear, ");
        sql.append("   (SELECT SUM(yq.revenue) ");
        sql.append("   FROM YEAR_PLAN_DETAIL yq ");
        sql.append("   INNER JOIN YEAR_PLAN yp ");
        sql.append("   ON yq.YEAR_PLAN_ID    = yp.YEAR_PLAN_ID ");
        sql.append("   AND yp.status         =1 ");
        sql.append("   WHERE yq.SYS_GROUP_ID = ypd.SYS_GROUP_ID ");
        sql.append("   AND yq.year           = :year ");
        sql.append("   ) revenueInYear ");
        sql.append(" FROM SYS_GROUP ypd ");
        sql.append(" WHERE ypd.SYS_GROUP_ID IN :sysIdList  ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("month", month);
        query.setParameter("year", year);
        query.setParameterList("sysIdList", sysGroupIdList);
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("quantityLk", new DoubleType());
        query.addScalar("revenueLk", new DoubleType());
        query.addScalar("completeLk", new DoubleType());
        query.addScalar("revenueInYear", new DoubleType());
        query.addScalar("completeInYear", new DoubleType());
        query.addScalar("quantityInYear", new DoubleType());
        query.addScalar("sysGroupId", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(TmpnTargetDTO.class));
        return query.list();
    }

    public void updateTargetNote(String targetNote, Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " update TOTAL_MONTH_PLAN set TARGET_NOTE =:note where TOTAL_MONTH_PLAN_ID = :totalMonthPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("note", targetNote);
        query.setParameter("totalMonthPlanId", totalMonthPlanId);
        query.executeUpdate();
    }

    public void updateSourceNote(String sourceNote, Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " update TOTAL_MONTH_PLAN set SOURCE_NOTE =:note where TOTAL_MONTH_PLAN_ID = :totalMonthPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("note", sourceNote);
        query.setParameter("totalMonthPlanId", totalMonthPlanId);
        query.executeUpdate();
    }

    public void updateContractNote(String contractNote, Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " update TOTAL_MONTH_PLAN set CONTRACT_NOTE =:note where TOTAL_MONTH_PLAN_ID = :totalMonthPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("note", contractNote);
        query.setParameter("totalMonthPlanId", totalMonthPlanId);
        query.executeUpdate();
    }

    public void updateFinanceNote(String financeNote, Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " update TOTAL_MONTH_PLAN set FINANCE_NOTE =:note where TOTAL_MONTH_PLAN_ID = :totalMonthPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("note", financeNote);
        query.setParameter("totalMonthPlanId", totalMonthPlanId);
        query.executeUpdate();
    }

    public void updateMaterialNote(String materialNote, Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " update TOTAL_MONTH_PLAN set MATERIAL_NOTE =:note where TOTAL_MONTH_PLAN_ID = :totalMonthPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("note", materialNote);
        query.setParameter("totalMonthPlanId", totalMonthPlanId);
        query.executeUpdate();
    }

    public void updateBTSNote(String btsNote, Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " update TOTAL_MONTH_PLAN set BTS_NOTE =:note where TOTAL_MONTH_PLAN_ID = :totalMonthPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("note", btsNote);
        query.setParameter("totalMonthPlanId", totalMonthPlanId);
        query.executeUpdate();
    }

    public void updateLineNote(String lineNote, Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " update TOTAL_MONTH_PLAN set LINE_NOTE =:note where TOTAL_MONTH_PLAN_ID = :totalMonthPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("note", lineNote);
        query.setParameter("totalMonthPlanId", totalMonthPlanId);
        query.executeUpdate();
    }

    public void updateMaintainNote(String maintainNote, Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " update TOTAL_MONTH_PLAN set MAINTAIN_NOTE =:note where TOTAL_MONTH_PLAN_ID = :totalMonthPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("note", maintainNote);
        query.setParameter("totalMonthPlanId", totalMonthPlanId);
        query.executeUpdate();
    }

    public List<AppParamDTO> getFileAppendixParam() {
        String sql = "SELECT " + " ST.NAME name" + " ,ST.CODE code" + " FROM APP_PARAM ST" + " WHERE ST.STATUS=1 "
                + " AND ST.PAR_TYPE = 'APPENDIX_MONTH_PLAN'";
        StringBuilder stringBuilder = new StringBuilder(sql);
        stringBuilder.append(" ORDER BY ST.CODE");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));

        return query.list();
    }

}
