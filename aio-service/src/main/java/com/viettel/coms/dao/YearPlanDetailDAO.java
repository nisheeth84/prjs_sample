/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.coms.bo.YearPlanDetailBO;
import com.viettel.coms.dto.DepartmentDTO;
import com.viettel.coms.dto.ReportPlanDTO;
import com.viettel.coms.dto.YearPlanDetailDTO;
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
@Repository("yearPlanDetailDAO")
public class YearPlanDetailDAO extends BaseFWDAOImpl<YearPlanDetailBO, Long> {

    public YearPlanDetailDAO() {
        this.model = new YearPlanDetailBO();
    }

    public YearPlanDetailDAO(Session session) {
        this.session = session;
    }

    public boolean getSysGroupData(YearPlanDetailDTO newObj, String sysGroupCode) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT name name, sys_GROUP_ID id from CTCT_CAT_OWNER.SYS_GROUP where upper(code) = upper(:code) ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("name", new StringType());
        query.addScalar("id", new LongType());
        query.setParameter("code", sysGroupCode.toUpperCase());
        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));
        List<DepartmentDTO> re = query.list();
        if (!re.isEmpty()) {
            newObj.setSysGroupId(re.get(0).getId());
            newObj.setSysGroupName(re.get(0).getName());
            return true;
        }
        return false;
    }

    public List<ReportPlanDTO> reportProgress(ReportPlanDTO obj) {
        StringBuilder sql = new StringBuilder(
                " SELECT B.YEAR ,B.sysGroupName , "
                +" round(B.quantity,0)quantity ,"
                +" round(NVL(B.currentQuantity,0),2) currentQuantity , "
                +" ROUND(NVL(DECODE(B.quantity,0,0,100* B.currentQuantity/(B.quantity/1000000)),0),2)progressQuantity, "
                +" round(B.complete,0) complete, "
                +" round(NVL(B.currentComplete,0),2) currentComplete, "
                +" ROUND(NVL(DECODE(B.COMPLETE,0,0,100* B.CURRENTCOMPLETE/(B.COMPLETE/1000000)),0),2)progressComplete, "
                +" round(B.revenue ,0)revenue, "
                +" round(NVL(B.currentRevenue,0),2) currentRevenue, "
                +" ROUND(NVL(DECODE(B.revenue,0,0,100* B.currentRevenue/(B.revenue/1000000)),0),2) progressRevenue "
                +" FROM "
                +" (SELECT a.YEAR YEAR,a.SYS_GROUP_ID, "
                +" (SELECT name FROM sys_group SYS WHERE sys.sys_group_id=a.sys_group_id)sysGroupName, "
                +" SUM(a.QUANTITY)  quantity, "
                +" (SELECT SUM(cst.COMPLETE_VALUE)/1000000 "
                +" FROM CONSTRUCTION cst "
                +" WHERE cst.sys_group_id =a.sys_group_id "
                +" and cst.COMPLETE_VALUE is not null "
                +" AND TO_CHAR(cst.complete_date,'yyyy')=a.YEAR "
                +"  )currentQuantity, "
                +" SUM(a.COMPLETE) complete, "
                +" (SELECT SUM(cst.APPROVE_COMPLETE_VALUE)/1000000 "
                +" FROM CONSTRUCTION cst "
                +" WHERE cst.sys_group_id=a.sys_group_id "
                +" and cst.APPROVE_COMPLETE_VALUE is not null "
                +" AND TO_CHAR(cst.APPROVE_COMPLETE_DATE,'yyyy')=a.YEAR "
                +" )currentComplete, "
                +" SUM(a.REVENUE) revenue, "
                +" (SELECT SUM(cst.APPROVE_REVENUE_VALUE)/1000000 "
                +" FROM CONSTRUCTION cst "
                +" WHERE cst.sys_group_id =a.sys_group_id "
                +" and cst.APPROVE_REVENUE_VALUE is not null "
                +"  AND TO_CHAR(cst.APPROVE_REVENUE_DATE,'yyyy')=a.YEAR "
                +" )currentRevenue "
                +" FROM YEAR_PLAN_DETAIL a, "
                +"  YEAR_PLAN b "
                +" WHERE a.YEAR_PLAN_ID=b.YEAR_PLAN_ID "
                +" AND b.STATUS        =1 ");
        if (obj.getSysGroupId() != null) {
            sql.append(" AND a.SYS_GROUP_ID =:sysGroupId ");
        }
        if (obj.getListYear() != null && obj.getListYear().size() > 0) {
            sql.append(" AND a.YEAR in :listYear ");
        } else {
            sql.append(" AND a.YEAR = to_char(sysdate, 'YYYY') ");
        }
        sql.append("group by a.YEAR,a.SYS_GROUP_ID) b");
        if (obj.getProgress() != null && !obj.getProgress().isEmpty()) {
            sql.append(
                    "  where (case when (progressQuantity > 100 and progressComplete >100 and progressRevenue >100 ) then 1 else 0 end)=:progress");
        }
        sql.append(" order by YEAR,sysGroupName");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
        }
        if (obj.getListYear() != null && obj.getListYear().size() > 0) {
            query.setParameterList("listYear", obj.getListYear());
            queryCount.setParameterList("listYear", obj.getListYear());
        }
        if (obj.getProgress() != null) {
            query.setParameter("progress", obj.getProgress());
            queryCount.setParameter("progress", obj.getProgress());
        }

        query.addScalar("revenue", new DoubleType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("complete", new DoubleType());
        query.addScalar("currentComplete", new DoubleType());
        query.addScalar("currentRevenue", new DoubleType());
        query.addScalar("currentQuantity", new DoubleType());
        query.addScalar("progressQuantity", new DoubleType());
        query.addScalar("progressComplete", new DoubleType());
        query.addScalar("progressRevenue", new DoubleType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("year", new LongType());
//		query.addScalar("tiendo", new DoubleType());
        if (obj.getPage() != null && obj.getPageSize() != null) {

            query.setMaxResults(obj.getPageSize().intValue());
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        }
        query.setResultTransformer(Transformers.aliasToBean(ReportPlanDTO.class));
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
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
