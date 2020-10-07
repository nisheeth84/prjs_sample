/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.coms.bo.TmpnTargetBO;
import com.viettel.coms.dto.ReportPlanDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
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
@Repository("tmpnTargetDAO")
public class TmpnTargetDAO extends BaseFWDAOImpl<TmpnTargetBO, Long> {

    public TmpnTargetDAO() {
        this.model = new TmpnTargetBO();
    }

    public TmpnTargetDAO(Session session) {
        this.session = session;
    }

    public void deleteTarget(List<Long> deleteList) {
        // TODO Auto-generated method stub
        if (deleteList != null) {
            StringBuilder sql = new StringBuilder("Delete TMPN_TARGET where TMPN_TARGET_ID in :deleteList");
            SQLQuery query = getSession().createSQLQuery(sql.toString());
            query.setParameterList("deleteList", deleteList);
            query.executeUpdate();
        }

    }

    public List<Long> getTargetInDB(Long totalMonthPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT TMPN_TARGET_ID tmpnTargetId from TMPN_TARGET where TOTAL_MONTH_PLAN_ID = :totalMonthPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("totalMonthPlanId", totalMonthPlanId);
        query.addScalar("tmpnTargetId", new LongType());
        List<Long> val = query.list();
        return val;
    }

    public List<ReportPlanDTO> reportProgress(ReportPlanDTO obj) {
    	StringBuilder sql = new StringBuilder("SELECT B.YEAR ,B.sysGroupName ,B.quantity ,NVL(B.currentQuantity,0) currentQuantity ,"
    			  + " nvl(ROUND(DECODE(B.quantity,0,0,100* B.currentQuantity/(B.quantity/1000000)),2),0)progressQuantity,"
    			  + " B.complete ,NVL(B.currentComplete,0) currentComplete,"
    			  + " nvl(ROUND(DECODE(B.COMPLETE,0,0,100* B.CURRENTCOMPLETE/(B.COMPLETE/1000000)),2),0)progressComplete,"
    			  + " B.revenue , b.month, round(NVL(B.currentRevenue/1000000,0),2) currentRevenueMonth,"
//    			  + " nvl(ROUND(DECODE(B.revenue,0,0,100* (B.currentRevenue/1000000)/(B.revenue/1000000)),2),0)progressRevenueMonth "
    			  + " nvl(ROUND(DECODE(B.revenueMonth,0,0,100* (B.currentRevenue/1000000)/(B.revenueMonth/1000000)),2),0)progressRevenueMonth "
//    			  hoanm1_20181211_start
    			  + " , round(NVL(B.completePlan/1000000,0),2) completePlanMonth,"
    			  + " nvl(ROUND(DECODE(B.COMPLETE,0,0,100* (B.completePlan/1000000)/(B.COMPLETE/1000000)),2),0)progressCompletePlanMonth,"
    			  + " B.countStationPlan,B.countStation "
//    			  hoanm1_20181211_end
    			  + " FROM "
    			  + " (SELECT a.MONTH MONTH, a.YEAR YEAR,(SELECT name FROM sys_group SYS WHERE sys.sys_group_id=a.sys_group_id)sysGroupName,"
    			  + " SUM(a.QUANTITY)quantity,"
    			  + " (select sum(quantity) from rp_quantity rp where rp.sys_group_id =a.sys_group_id and to_char(starting_date,'MM/yyyy')= (CASE WHEN a.MONTH <10 THEN 0 ||a.Month ELSE TO_CHAR(a.Month) "
    			  + " END ) ||'/'||a.YEAR )currentQuantity,"
    			  + " SUM(a.COMPLETE)complete,"
    			  + " (select sum(completeValue/1000000) from rp_hshc rp where rp.sysGroupId =a.sys_group_id and rp.COMPLETESTATE=2 and to_char(dateComplete,'MM/yyyy')= (CASE WHEN a.MONTH <10 THEN 0 ||a.Month ELSE TO_CHAR(a.Month) "
    			  + " END ) ||'/'||a.YEAR )currentComplete, SUM(a.REVENUE)revenue, SUM(a.REVENUE)revenueMonth,"
    			  + " (select sum(decode(consAppRevenueValueDB,0,completeValue,consAppRevenueValueDB)) from rp_revenue rp where rp.sysGroupId =a.sys_group_id and to_char(dateComplete,'MM/yyyy')= (CASE WHEN a.MONTH <10 THEN 0 ||a.Month ELSE TO_CHAR(a.Month) "
    			  + " END ) ||'/'||a.YEAR )currentRevenue "
//    			  hoanm1_20181211_start
//    			  + " ,(SELECT SUM(COMPLETEVALUE_PLAN/1000000) FROM rp_hshc rp WHERE rp.sysGroupId=a.sys_group_id "
    			  + " ,(SELECT SUM(COMPLETEVALUE_PLAN) FROM rp_hshc rp WHERE rp.sysGroupId=a.sys_group_id "
    			  + " AND TO_CHAR(dateComplete,'MM/yyyy')= (CASE WHEN a.MONTH <10 THEN 0 ||a.Month ELSE TO_CHAR(a.Month) END ) ||'/' ||a.YEAR )completePlan, "
    			  + " (SELECT count(*) FROM rp_hshc rp WHERE rp.sysGroupId=a.sys_group_id "
    			  + " AND TO_CHAR(dateComplete,'MM/yyyy')= (CASE WHEN a.MONTH <10 THEN 0 ||a.Month ELSE TO_CHAR(a.Month) END )||'/' ||a.YEAR )countStationPlan,"
    			  + " (SELECT count(*) FROM rp_hshc rp WHERE rp.COMPLETESTATE=2 and rp.sysGroupId=a.sys_group_id "
    			  + " AND TO_CHAR(dateComplete,'MM/yyyy')= (CASE WHEN a.MONTH <10 THEN 0 ||a.Month ELSE TO_CHAR(a.Month) END )||'/' ||a.YEAR )countStation"
//    			  hoanm1_20181211_end
    			  + " FROM tmpn_target a ,TOTAL_MONTH_PLAN b WHERE a.TOTAL_MONTH_PLAN_ID=b.TOTAL_MONTH_PLAN_ID  AND b.STATUS =1 ");
//    			  + " and a.sys_group_id in(166656,260629,260657,166617,166635,"
//    			  + " 270162,270266,270251,270203) ");
        if (obj.getYear() != null && obj.getMonth() != null) {
            sql.append(" and a.month = :month and a.year = :year");
        }
        if (obj.getSysGroupId() != null) {
            sql.append(" AND a.SYS_GROUP_ID =:sysGroupId ");
        }
        sql.append(" group by a.MONTH,a.YEAR,a.SYS_GROUP_ID ) b");
        sql.append("  ");

        sql.append("  order by month,sysGroupName ");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        StringBuilder sqlQuerySum = new StringBuilder("SELECT sum(quantity)/1000000 quantityTotal, sum(currentQuantity)currentQuantityTotal,"
        		+ " round(decode(sum(quantity),0,0,100* sum(currentQuantity)/sum(quantity/1000000)),2)progressQuantityTotal,"
        		+ " sum(complete)/1000000 completeTotal,sum(currentComplete)currentCompleteTotal,"
        		+ " round(decode(sum(COMPLETE),0,0,100* sum(CURRENTCOMPLETE)/sum(COMPLETE/1000000)),2)progressCompleteTotal,"
        		+ " sum(revenue)/1000000 revenueTotal,sum(currentRevenueMonth)currentRevenueTotal,"
        		+ " round(decode(sum(revenue),0,0,100* sum(currentRevenueMonth)/sum(revenue/1000000)),2)progressRevenueTotal "
//        		hoanm1_20181211_start
        		+ " ,sum(completePlanMonth)completePlanTotal,round(decode(sum(COMPLETE),0,0,100* sum(completePlanMonth)/sum(COMPLETE/1000000)),2)progressCompletePlanTotal,"
        		+ " sum(countStationPlan) countStationPlanTotal,sum(countStation)countStationTotal "
//        		hoanm1_20181211_end
        		+ "  FROM (");
        sqlQuerySum.append(sql);
        sqlQuerySum.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        SQLQuery querySum = getSession().createSQLQuery(sqlQuerySum.toString());

        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
            querySum.setParameter("sysGroupId", obj.getSysGroupId());
        }
        if (obj.getMonth() != null) {
            query.setParameter("month", obj.getMonth());
            queryCount.setParameter("month", obj.getMonth());
            querySum.setParameter("month", obj.getMonth());
        }
        if (obj.getYear() != null) {
            query.setParameter("year", obj.getYear());
            queryCount.setParameter("year", obj.getYear());
            querySum.setParameter("year", obj.getYear());
        }

        query.addScalar("revenue", new DoubleType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("complete", new DoubleType());
        query.addScalar("currentComplete", new DoubleType());
        query.addScalar("progressComplete", new DoubleType());
        query.addScalar("currentRevenueMonth", new DoubleType());
        query.addScalar("progressRevenueMonth", new DoubleType());
        query.addScalar("progressQuantity", new DoubleType());
        query.addScalar("currentQuantity", new DoubleType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("year", new LongType());
        query.addScalar("month", new LongType());
//        hoanm1_20181211_start
        query.addScalar("completePlanMonth", new DoubleType());
        query.addScalar("progressCompletePlanMonth", new DoubleType());
        query.addScalar("countStationPlan", new LongType());
        query.addScalar("countStation", new LongType());        
//        hoanm1_20181211_end       
        
        querySum.addScalar("quantityTotal", new DoubleType());
        querySum.addScalar("currentQuantityTotal", new DoubleType());
        querySum.addScalar("progressQuantityTotal", new DoubleType());
        querySum.addScalar("completeTotal", new DoubleType());
        querySum.addScalar("currentCompleteTotal", new DoubleType());
        querySum.addScalar("progressCompleteTotal", new DoubleType());
        querySum.addScalar("revenueTotal", new DoubleType());
        querySum.addScalar("currentRevenueTotal", new DoubleType());
        querySum.addScalar("progressRevenueTotal", new DoubleType());
        
        querySum.addScalar("completePlanTotal", new DoubleType());
        querySum.addScalar("progressCompletePlanTotal", new DoubleType());
        querySum.addScalar("countStationPlanTotal", new LongType());
        querySum.addScalar("countStationTotal", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(ReportPlanDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        List<ReportPlanDTO> lst = query.list();

        if (lst.size() > 0) {
        	List<Object[]> rs = querySum.list();
        	for (Object[] objects : rs) {
        		lst.get(0).setQuantityTotal((Double) objects[0]);
        		lst.get(0).setCurrentQuantityTotal((Double) objects[1]);
            	lst.get(0).setProgressQuantityTotal((Double) objects[2]);
            	lst.get(0).setCompleteTotal((Double) objects[3]);
            	lst.get(0).setCurrentCompleteTotal((Double) objects[4]);
            	lst.get(0).setProgressCompleteTotal((Double) objects[5]);
            	lst.get(0).setRevenueTotal((Double) objects[6]);
            	lst.get(0).setCurrentRevenueTotal((Double) objects[7]);
            	lst.get(0).setProgressRevenueTotal((Double) objects[8]);
            	
            	lst.get(0).setCompletePlanTotal((Double) objects[9]);
            	lst.get(0).setProgressCompletePlanTotal((Double) objects[10]);
            	lst.get(0).setCountStationPlanTotal((Long) objects[11]);
            	lst.get(0).setCountStationTotal((Long) objects[12]);
        	}
        }
//		hungnx 20180713 end
        return lst;

//        return query.list();
    }

    public String getSysGroupNameByUserName(String userName) {
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
}
