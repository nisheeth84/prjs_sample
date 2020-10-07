/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.coms.bo.ConstructionTaskDailyBO;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.ConstructionTaskDTOUpdateRequest;
import com.viettel.coms.dto.ConstructionTaskDailyDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

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
import java.util.List;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("constructionTaskDailyDAO")
public class ConstructionTaskDailyDAO extends BaseFWDAOImpl<ConstructionTaskDailyBO, Long> {

    public ConstructionTaskDailyDAO() {
        this.model = new ConstructionTaskDailyBO();
    }

    public ConstructionTaskDailyDAO(Session session) {
        this.session = session;
    }

    public void deleteTaskDaily(Long id) {
        String sql = new String(
                " delete from CONSTRUCTION_TASK_DAILY a where a.CONSTRUCTION_TASK_ID=:id and confirm =0 AND TO_CHAR(a.CREATED_DATE,'dd/mm/YYYY') = TO_CHAR(sysdate,'dd/mm/YYYY')");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("id", id);
        query.executeUpdate();
    }

    public Double getTotal(ConstructionTaskDTOUpdateRequest request) {
        /*
         * String sql = new String(
         * " SELECT nvl(SUM(a.AMOUNT),0) amount FROM CONSTRUCTION_TASK_DAILY a where a.confirm in (0,1) and a.CONSTRUCTION_TASK_ID ='"
         * +id+"' ");
         */

        // CuongNV2 mod start
        Long worItemId = request.getConstructionTaskDTO().getWorkItemId();
        Long catTaskId = request.getConstructionTaskDTO().getCatTaskId();
        String sql = new String(
                " SELECT nvl(SUM(a.AMOUNT),0) amount FROM CONSTRUCTION_TASK_DAILY a where a.confirm in (0,1) and a.WORK_ITEM_ID ='"
                        + worItemId + "' and a.cat_task_id ='" + catTaskId + "' ");
        // CuongNV2 mod end

        SQLQuery query = getSession().createSQLQuery(sql);
        BigDecimal result = (BigDecimal) query.uniqueResult();
        return result.doubleValue();
    }

    public Double getAmountPreview(Long worItemId, Long catTaskId) {
        // String sql = new
        // String(" SELECT nvl(SUM(a.AMOUNT),0) amount FROM CONSTRUCTION_TASK_DAILY a
        // where a.confirm in (0,1) and a.CONSTRUCTION_TASK_ID ='"+id+"' and
        // trunc(CREATED_DATE)< trunc(sysdate)");
        String sql = new String(
                " SELECT nvl(SUM(a.AMOUNT),0) amount FROM CONSTRUCTION_TASK_DAILY a where a.confirm in (0,1) and a.WORK_ITEM_ID ='"
                        + worItemId + "' and a.cat_task_id ='" + catTaskId
                        + "' and trunc(CREATED_DATE)< trunc(sysdate)");
        SQLQuery query = getSession().createSQLQuery(sql);
        BigDecimal result = (BigDecimal) query.uniqueResult();
        return result.doubleValue();
    }

    public int getListConfirmDaily(Long id) {
        String sql = new String(
                " SELECT CONSTRUCTION_TASK_DAILY_id FROM CONSTRUCTION_TASK_DAILY a where a.confirm in (1) and a.CONSTRUCTION_TASK_ID ='"
                        + id + "' and trunc(CREATED_DATE)= trunc(sysdate)");
        SQLQuery query = getSession().createSQLQuery(sql);
        List<Long> lt = query.list();
        if (lt.size() > 0) {
            return 1;
        } else {
            return 0;
        }
    }

    public void updateQuantityWorkItem(Long id, Double quantity) {
        StringBuilder sql = new StringBuilder(" ");
        sql.append(" UPDATE WORK_ITEM a ");
        sql.append(" SET a.QUANTITY        =:quantity ");
        sql.append(" WHERE a.WORK_ITEM_ID IN ");
        sql.append(" (SELECT work_item_id FROM construction_task WHERE construction_task_id= :id) ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.setParameter("quantity", quantity);
        query.executeUpdate();
    }

    // hoanm1_20180703_start
    public void updateCompletePercentTask(Long id, Double completePercent) {
        // StringBuilder sql = new StringBuilder(" ");
        // sql.append(" UPDATE CONSTRUCTION_TASK a ");
        // sql.append(" SET a.COMPLETE_PERCENT =:completePercent ");
        // sql.append(" WHERE a.CONSTRUCTION_TASK_ID =:id");
        // SQLQuery query = getSession().createSQLQuery(sql.toString());
        // query.setParameter("id", id);
        // query.setParameter("completePercent", completePercent);
        // query.executeUpdate();
        String sql = new String("UPDATE CONSTRUCTION_TASK a " + " SET a.COMPLETE_PERCENT =:completePercent "
                + " WHERE a.CONSTRUCTION_TASK_ID =:id");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("id", id);
        query.setParameter("completePercent", Math.round(completePercent));
        query.executeUpdate();
    }

    // hoanm1_20180703_end

    public boolean checkInsert(String code, Long id) {
        StringBuilder sql = new StringBuilder(" ");
        sql.append(" SELECT COUNT(a.CONSTRUCTION_TASK_DAILY_ID ) ");
        sql.append(" FROM CONSTRUCTION_TASK_DAILY a ");
        sql.append(" WHERE a.CONSTRUCTION_TASK_ID       =:id ");
        sql.append(" AND a.TYPE    =:code ");
        sql.append(" AND TO_CHAR(a.CREATED_DATE,'dd/mm/YYYY') = TO_CHAR(sysdate,'dd/mm/YYYY') ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.setParameter("code", code);
        BigDecimal result = (BigDecimal) query.uniqueResult();
        if (result.intValue() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public void updateNewConstructionTaskDaily(AppParamDTO dto, ConstructionTaskDTOUpdateRequest request) {
        Double quantity = request.getConstructionTaskDTO().getPrice() * dto.getAmount();
        StringBuilder sql = new StringBuilder(" ");
        sql.append(" UPDATE CONSTRUCTION_TASK_DAILY a ");
        sql.append(" SET a.AMOUNT                   = '" + dto.getAmount() + "', ");
        sql.append(" a.QUANTITY                     = '" + quantity + "', ");
        sql.append(" a.UPDATED_USER_ID              = '" + request.getSysUserRequest().getSysUserId() + "', ");
        sql.append(" a.UPDATED_DATE                 = sysdate, ");
        sql.append(" a.UPDATED_GROUP_ID             = '" + request.getSysUserRequest().getSysGroupId() + "' ");
        // sql.append(" WHERE a.CONSTRUCTION_TASK_ID = '" +
        // request.getConstructionTaskDTO().getConstructionTaskId() + "' ");
        // sql.append(" AND a.TYPE = '" + dto.getCode() +
        // "' ");
        // hoanm1_20180703_start
        sql.append(" where CONSTRUCTION_TASK_DAILY_ID = '" + dto.getConstructionTaskDailyId() + "' ");
        // hoanm1_20180703_end
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.executeUpdate();
    }

    // hungnx 20180710 start
    public List<ConstructionTaskDailyDTO> doSearchInPast(ConstructionTaskDailyDTO criteria) {
        StringBuilder stringBuilder = new StringBuilder(
                "SELECT CTD.CONSTRUCTION_TASK_DAILY_ID constructionTaskDailyId, CTD.AMOUNT amount, CTD.CAT_TASK_ID catTaskId"
                        + ", CTD.CONFIRM confirm, CTD.CONSTRUCTION_TASK_ID constructionTaskId, CTD.WORK_ITEM_ID workItemId "
                        + ", CT.STATUS statusConstructionTask, C.AMOUNT amountConstruction"
                        + " FROM CONSTRUCTION_TASK_DAILY ctd ,CONSTRUCTION_TASK ct, CONSTRUCTION c  "
                        + " where TO_CHAR(ctd.created_date, 'MM/yyyy') < to_char(sysdate, 'MM/yyyy')"
                        + " and CTD.CONSTRUCTION_TASK_ID = CT.CONSTRUCTION_TASK_ID and C.CONSTRUCTION_ID = CT.CONSTRUCTION_ID");
        if (StringUtils.isNotEmpty(criteria.getConfirm())) {
            stringBuilder.append(" and CTD.CONFIRM = :confirm");
        }
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        if (StringUtils.isNotEmpty(criteria.getConfirm())) {
            query.setParameter("confirm", criteria.getConfirm());
        }
        query.addScalar("workItemId", new LongType());
        query.addScalar("constructionTaskDailyId", new LongType());
        query.addScalar("catTaskId", new LongType());
        query.addScalar("confirm", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("amountConstruction", new DoubleType());
        query.addScalar("statusConstructionTask", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDailyDTO.class));
        return query.list();
    }

    public int updateConfirm(ConstructionTaskDailyDTO criteria) {
        StringBuilder stringBuilder = new StringBuilder(
                "UPDATE CONSTRUCTION_TASK_DAILY ctd set CTD.CONFIRM = :confirm");
        stringBuilder.append(" where ctd.CONSTRUCTION_TASK_DAILY_ID = :dailyId");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.setParameter("confirm", criteria.getConfirm());
        query.setParameter("dailyId", criteria.getConstructionTaskDailyId());
        return query.executeUpdate();
    }
    // hungnx 20180710 end
    
    /**Hoangnh start 18022019**/
    @SuppressWarnings("unchecked")
	public List<ConstructionTaskDailyDTO> doSearch(ConstructionTaskDailyDTO obj){
    	StringBuilder sql = new StringBuilder("SELECT CD.CONSTRUCTION_TASK_DAILY_ID constructionTaskDailyId,"
    			+ "CD.SYS_GROUP_ID sysGroupId,"
    			+ "CD.AMOUNT amount,"
    			+ "CD.TYPE type,"
    			+ "CD.CONFIRM confirm,"
    			+ "CD.CREATED_DATE createdDate,"
    			+ "CD.CREATED_USER_ID createdUserId,"
    			+ "CD.CREATED_GROUP_ID createdGroupId,"
    			+ "CD.CONSTRUCTION_TASK_ID constructionTaskId,"
    			+ "CD.APPROVE_DATE approveDate,"
    			+ "CD.APPROVE_USER_ID approveUserId,"
    			+ "CD.QUANTITY quantity,"
    			+ "CD.WORK_ITEM_ID workItemId,"
    			+ "WI.NAME workItemName,"
    			+ "CO.CODE constructionCode,"
    			+ "CO.CAT_STATION_ID catStationId,"
    			+ "CS.CODE catStationCode,"
    			+ "CD.CAT_TASK_ID catTaskId,"
    			+ "CT.START_DATE startDate,"
    			+ "CT.END_DATE endDate,"
    			+ "SY.NAME sysGroupName,"
    			+ "CT.TASK_NAME taskName FROM CONSTRUCTION_TASK_DAILY CD "
    			+ "LEFT JOIN WORK_ITEM WI ON WI.WORK_ITEM_ID = CD.WORK_ITEM_ID "
    			+ "INNER JOIN CONSTRUCTION_TASK CT ON CT.CONSTRUCTION_TASK_ID = CD.CONSTRUCTION_TASK_ID "
    			+ "LEFT JOIN CONSTRUCTION CO ON CO.CONSTRUCTION_ID = CT.CONSTRUCTION_ID "
    			+ "LEFT JOIN CAT_STATION CS ON CO.CAT_STATION_ID = CS.CAT_STATION_ID "
    			+ "LEFT JOIN SYS_GROUP SY ON SY.SYS_GROUP_ID = CD.SYS_GROUP_ID "
    			+ "WHERE 1=1 ");
    	if (StringUtils.isNotEmpty(obj.getKeySearch())) {
    		sql.append(" AND (upper(CS.CODE) like upper(:keySearch) or upper(CO.CODE) like upper(:keySearch)) ");
        }
    	if(obj.getConfirmLst() != null){
        	sql.append(" AND CD.CONFIRM IN (:confirmLst) ");
    	}
    	if(StringUtils.isNotBlank(obj.getType())){
    		sql.append(" AND CD.TYPE =:type ");
    	}
    	if(obj.getStartDate() != null){
    		sql.append(" AND TRUNC(CD.CREATED_DATE) >= :startDate ");
    	}
    	if(obj.getEndDate() != null){
    		sql.append(" AND TRUNC(CD.CREATED_DATE) <= :endDate ");
    	}
    	if(obj.getCreatedUserId() != null){
    		sql.append(" AND CD.CREATED_USER_ID =:createdUserId ");
    	}
    	if(obj.getSysGroupId() != null){
    		sql.append(" AND CT.SYS_GROUP_ID=:sysGroupId ");
    	}
    	SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
        
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
        	query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        	queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        if(obj.getConfirmLst() != null){
    		query.setParameterList("confirmLst", obj.getConfirmLst());
        	queryCount.setParameter("confirmLst", obj.getConfirmLst());
    	}
    	if(StringUtils.isNotBlank(obj.getType())){
    		query.setParameter("type", obj.getType());
        	queryCount.setParameter("type", obj.getType());
    	}
    	if(obj.getStartDate() != null){
    		query.setParameter("startDate", obj.getStartDate());
        	queryCount.setParameter("startDate", obj.getStartDate());
    	}
    	if(obj.getEndDate() != null){
    		query.setParameter("endDate", obj.getEndDate());
        	queryCount.setParameter("endDate", obj.getEndDate());
    	}
    	if(obj.getCreatedUserId() != null){
    		query.setParameter("createdUserId", obj.getCreatedUserId());
        	queryCount.setParameter("createdUserId", obj.getCreatedUserId());
    	}
    	if(obj.getSysGroupId() != null){
    		query.setParameter("sysGroupId", obj.getSysGroupId());
        	queryCount.setParameter("sysGroupId", obj.getSysGroupId());
    	}
    	
    	query.addScalar("constructionTaskDailyId", new LongType());
    	query.addScalar("sysGroupId", new LongType());
    	query.addScalar("amount", new DoubleType());
    	query.addScalar("type", new StringType());
    	query.addScalar("confirm", new StringType());
    	query.addScalar("createdDate", new DateType());
    	query.addScalar("createdUserId", new LongType());
    	query.addScalar("createdGroupId", new LongType());
    	query.addScalar("constructionTaskId", new LongType());
    	query.addScalar("approveDate", new DateType());
    	query.addScalar("approveUserId", new LongType());
    	query.addScalar("quantity", new DoubleType());
    	query.addScalar("workItemId", new LongType());
    	query.addScalar("workItemName", new StringType());
    	query.addScalar("constructionCode", new StringType());
    	query.addScalar("catStationId", new LongType());
    	query.addScalar("catStationCode", new StringType());
    	query.addScalar("catTaskId", new LongType());
    	query.addScalar("taskName", new StringType());
    	query.addScalar("startDate", new DateType());
    	query.addScalar("endDate", new DateType());
    	query.addScalar("sysGroupName", new StringType());
        
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDailyDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }
    /**Hoangnh start 18022019**/
}