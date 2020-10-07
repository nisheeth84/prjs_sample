/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.bo.WorkItemBO;
import com.viettel.coms.business.ConstructionTaskBusinessImpl;
import com.viettel.coms.dto.*;
import com.viettel.coms.utils.ValidateUtils;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("workItemDAO")
public class WorkItemDAO extends BaseFWDAOImpl<WorkItemBO, Long> {

    @Autowired
    private ConstructionTaskDAO constructionTaskDao;

    @Autowired
    private ConstructionTaskBusinessImpl constructionTaskBusiness;

    @Autowired
    private UtilAttachDocumentDAO utilAttachDocumentDao;
    @Autowired
    private QuantityConstructionDAO quantityConstructionDAO;

    public WorkItemDAO() {
        this.model = new WorkItemBO();
    }

    public WorkItemDAO(Session session) {
        this.session = session;
    }

    public void approveQuantityWorkItem(WorkItemDetailDTO obj) {
        StringBuilder sbquery = new StringBuilder();
        sbquery.append(" UPDATE ");
        sbquery.append(" WORK_ITEM work");
        sbquery.append(" SET ");
        sbquery.append(" work.QUANTITY = :quantity   ");
//        sbquery.append(" work.complete_date = sysdate   ");
        sbquery.append(" WHERE ");
        sbquery.append(" work.WORK_ITEM_ID = :workItemId ");
        SQLQuery query = getSession().createSQLQuery(sbquery.toString());
        query.setParameter("quantity", obj.getQuantity());

        query.setParameter("workItemId", obj.getWorkItemId());
        query.executeUpdate();
    }

    public void approveWorkItem(WorkItemDetailDTO obj) {
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

    public void saveCancelConfirmStatusConstructionPopup(WorkItemDetailDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append("UPDATE CONSTRUCTION con ");
        sql.append(" SET con.STATUS= 3");
        sql.append(" 	WHERE con.CONSTRUCTION_ID=:constructionId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", obj.getConstructionId());
        query.executeUpdate();
    }

    public void approveStatusWorkItem(WorkItemDetailDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append("UPDATE CONSTRUCTION con ");
        sql.append(" SET con.COMPLETE_VALUE= ");
        sql.append(" 	(SELECT SUM(quantity) ");
        sql.append(" 	 FROM work_item WORK ");
        sql.append(" 	 	INNER JOIN CONSTRUCTION con ");
        sql.append(" 	    ON WORK.CONSTRUCTION_ID=con.CONSTRUCTION_ID ");
        sql.append(" 	 WHERE con.CONSTRUCTION_ID= :constructionId ");
        sql.append(" 	) ");
        sql.append(" 	,con.APPROVE_COMPLETE_VALUE= ");
        sql.append(" 	(SELECT SUM(quantity) ");
        sql.append(" 	 FROM work_item WORK ");
        sql.append(" 	 	INNER JOIN CONSTRUCTION con ");
        sql.append(" 	    ON WORK.CONSTRUCTION_ID=con.CONSTRUCTION_ID ");
        sql.append(" 	 WHERE con.CONSTRUCTION_ID= :constructionId ");
        sql.append(" 	) ");
        sql.append(" 	WHERE con.CONSTRUCTION_ID=:constructionId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", obj.getConstructionId());
        query.executeUpdate();
    }

    public void saveCancelConfirmPopup(WorkItemDetailDTO obj) {
        String queryStr = editworkItemQuery(obj);
        SQLQuery query = getSession().createSQLQuery(queryStr);
        query.setParameter("workItemId", obj.getWorkItemId());
        query.setParameter("approveDescription", obj.getApproveDescription());

        query.executeUpdate();

    }

    private String editworkItemQuery(WorkItemDetailDTO obj) {
        StringBuilder sbquery = new StringBuilder();

        sbquery.append(" UPDATE ");

        sbquery.append(" WORK_ITEM work");
        sbquery.append(" SET ");
        sbquery.append(" work.QUANTITY = null ,work.STATUS=2,work.approve_description=:approveDescription  ");
        sbquery.append(" WHERE ");
        sbquery.append(" work.WORK_ITEM_ID = :workItemId ");

        return sbquery.toString();

    }

    public WorkItemDetailDTO getWorkItemById(WorkItemDetailDTO obj) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
//				hungnx 20180704 start
                quantityConstructionDAO.buildQuerySumByMonth2()
//				hungnx 20180704 end
                        + " SELECT distinct " + " case "
                        + " when ctd.work_item_id is not null then (SELECT sum(cc.quantity) FROM CONSTRUCTION_TASK_DAILY cc where to_char(cc.created_date, 'MM/yyyy') = ctd.created_date and cc.work_item_id = ctd.work_item_id and cc.confirm = 1)/1000000 "
                        + " else a.QUANTITY/1000000 end quantity, " + "(SELECT full_name " + "FROM "
                        + "(SELECT su.FULL_NAME " + "FROM CONSTRUCTION_TASK ct, " + "DETAIL_MONTH_PLAN dmp, "
                        + "SYS_USER su " + "WHERE ct.WORK_ITEM_ID        =a.WORK_ITEM_ID "
                        + "AND ct.DETAIL_MONTH_PLAN_ID  = dmp.DETAIL_MONTH_PLAN_ID "
                        + "AND dmp.SIGN_STATE           = 3 " + "AND dmp.status               = 1 "
                        + "AND ct.LEVEL_ID              = 3 " + "AND ct.type                  =1 "
                        + " AND ct.performer_work_item_id=su.SYS_USER_ID " + "ORDER BY ct.DETAIL_MONTH_PLAN_ID DESC "
                        + ") " + " WHERE ROWNUM <2 " + ")performerName, " + "(SELECT full_name " + "FROM "
                        + " (SELECT su.FULL_NAME " + "FROM CONSTRUCTION_TASK ct, " + " DETAIL_MONTH_PLAN dmp, "
                        + "SYS_USER su " + " WHERE ct.CONSTRUCTION_ID    =a.CONSTRUCTION_ID "
                        + "AND ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID " + "AND dmp.SIGN_STATE          = 3 "
                        + " AND dmp.status              = 1 " + "AND ct.LEVEL_ID             = 3 "
                        + "AND ct.type                 =1 " + " AND ct.SUPERVISOR_ID        =su.SYS_USER_ID "
                        + "ORDER BY ct.DETAIL_MONTH_PLAN_ID DESC " + ") " + " WHERE ROWNUM <2 " + " )supervisorName, "
                        + "(SELECT MIN(ct.START_DATE) " + "FROM CONSTRUCTION_TASK ct, " + " DETAIL_MONTH_PLAN dmp "
                        + " WHERE ct.WORK_ITEM_ID       =a.WORK_ITEM_ID "
                        + "AND ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
                        + " AND dmp.SIGN_STATE          = 3 " + "AND dmp.status              = 1 "
                        + "AND ct.LEVEL_ID             = 3 " + "AND ct.type                 =1 " + ") startingDate, "
                        + "(SELECT MAX(ct.END_DATE) " + "FROM CONSTRUCTION_TASK ct, " + " DETAIL_MONTH_PLAN dmp "
                        + " WHERE ct.WORK_ITEM_ID       =a.WORK_ITEM_ID "
                        + " AND ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
                        + " AND dmp.SIGN_STATE          = 3 " + " AND dmp.status              = 1 "
                        + "AND ct.LEVEL_ID             = 3 " + "AND ct.type                 =1 " + ") completeDate, "
                        + " CASE " + " WHEN a.IS_INTERNAL=1 " + " THEN '1' " + " ELSE '2' " + " END isInternal, "
                        + "CASE " + "WHEN (SELECT DISTINCT b.sys_group_id "
                        + "FROM CNT_CONSTR_WORK_ITEM_TASK cnt_task, " + "CNT_CONTRACT b "
                        + "WHERE cnt_task.CONSTRUCTION_ID=a.CONSTRUCTION_ID "
                        + "AND cnt_task.CNT_CONTRACT_ID  =b.CNT_CONTRACT_ID " + " AND b.CONTRACT_TYPE           = 0 "
                        + " AND b.status                 !=0) IN(166571) " + "THEN '1' " + "ELSE '2' "
                        + "END groupLevel, " + "a.approve_description approveDescription,a.WORK_ITEM_ID workItemId  "
//						hoanm1_20180815_start
                        + ", (select name from cat_partner where cat_partner_id=constructor_id and status=1) sysGroupName "
//						hoanm1_20180815_end
                        + "FROM WORK_ITEM a "
//						hungnx 20180704 start
                        + " left join tblTaskDaily ctd on CTD.WORK_ITEM_ID = A.WORK_ITEM_ID and ctd.created_date = :createDate"
//				hungnx 20180704 end
                        + " WHERE "
                        // + "a.status=3 "
                        // +" AND cat.TYPE =1 "
                        + " a.WORK_ITEM_ID=:workItemId "
                // +" AND cat.STATUS =1AND cat.STATUS =1 "

        );

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("workItemId", obj.getWorkItemId());

        if (obj.getDateComplete() == null)
            query.setParameter("createDate", "");
        else
            query.setParameter("createDate", obj.getDateComplete());
        // query.addScalar("code", new StringType());
        // query.addScalar("name", new StringType());
        // query.addScalar("constructorName", new StringType());
        // query.addScalar("cntContractCode", new StringType());
        // query.addScalar("catProvinceCode", new StringType());
        //
        //
        //
        //
        //
        // query.addScalar("constructionCode", new StringType());
        // query.addScalar("catstationCode", new StringType());
        // query.addScalar("sysGroupName1", new StringType());
        // query.addScalar("status", new StringType());
        // query.addScalar("constructionStatus", new StringType());
        //
        // query.addScalar("year", new LongType());
        // query.addScalar("month", new LongType());

        query.addScalar("workItemId", new LongType());

        query.addScalar("quantity", new DoubleType());
        query.addScalar("performerName", new StringType());
        query.addScalar("supervisorName", new StringType());
        query.addScalar("approveDescription", new StringType());
        query.addScalar("completeDate", new DateType());
        query.addScalar("startingDate", new DateType());

        query.addScalar("groupLevel", new StringType());
        query.addScalar("isInternal", new StringType());
//		hoanm1_20180815_start
        query.addScalar("sysGroupName", new StringType());
//		hoanm1_20180815_end

        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        WorkItemDetailDTO rs = (WorkItemDetailDTO) query.uniqueResult();
//		hungnx 20180703 start
//		List<WorkItemDetailDTO> lst = new ArrayList<WorkItemDetailDTO>();
//		lst.add(rs);
//		checkCatTask(lst);
//		hungnx 20180703 end
        return rs;
        // return (WorkItemDetailDTO) query.list().get(0);
    }

    public List<WorkItemDetailDTO> doSearchQuantity(WorkItemDetailDTO obj, List<String> groupIdList) {
    	StringBuilder sql = new StringBuilder("select to_char(starting_date,'dd/MM/yyyy') dateComplete,complete_date completeDate,performer_Id performerId,performer_Name performerName,sysGroupName constructorName, "
    						+ " catstationCode, constructionCode,workItemName name,quantity,status,statusConstruction,cntContractCode,catProvinceCode,workItemId,catProvinceId,constructionId, "
    						+ " approveCompleteValue,approveCompleteDate,price,quantityByDate,obstructedState,SYS_GROUP_ID sysGroupIdSMS,partnerName constructorName1 from rp_quantity where 1=1 ");
    	if (obj.getDateFrom() != null) {
			sql.append(" and starting_date >= :monthYearFrom ");
		}
		if (obj.getDateTo() != null) {
			sql.append(" and starting_date <= :monthYearTo ");
		}
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (upper(cntContractCode) LIKE upper(:keySearch) OR  upper(constructionCode) LIKE upper(:keySearch) OR upper(catstationCode) LIKE upper(:keySearch) escape '&')");
        }

        if (obj.getSysGroupId() != null) {
            sql.append(" AND SYS_GROUP_ID  = :sysGroupId");
        }
        if (groupIdList != null && !groupIdList.isEmpty()) {
            sql.append(" and catProvinceId in :groupIdList ");
        }
        if (obj.getCatProvinceId() != null) {
            sql.append(" AND catProvinceId = :catProvinceId ");
        }
        sql.append(" ORDER BY starting_date DESC,sysGroupName");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
//		hungnx 20180713 start
        StringBuilder countDateComplete = new StringBuilder("SELECT DISTINCT dateComplete FROM (");
        countDateComplete.append(sql);
        countDateComplete.append(")");
        StringBuilder countCatstationCode = new StringBuilder("SELECT DISTINCT catstationCode FROM (");
        countCatstationCode.append(sql);
        countCatstationCode.append(")");
        SQLQuery queryStation = getSession().createSQLQuery(countCatstationCode.toString());
        StringBuilder countConstrCode = new StringBuilder("SELECT DISTINCT constructionCode FROM (");
        countConstrCode.append(sql);
        countConstrCode.append(")");
        SQLQuery queryConstr = getSession().createSQLQuery(countConstrCode.toString());
        StringBuilder sqlTotalQuantity = new StringBuilder("SELECT NVL(sum(quantity), 0) FROM (");
        sqlTotalQuantity.append(sql);
        sqlTotalQuantity.append(")");
        SQLQuery queryQuantity = getSession().createSQLQuery(sqlTotalQuantity.toString());
        SQLQuery queryDC = getSession().createSQLQuery(countDateComplete.toString());
//		hungnx 20180713 end
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        if (groupIdList != null && !groupIdList.isEmpty()) {
            query.setParameterList("groupIdList", groupIdList);
            queryCount.setParameterList("groupIdList", groupIdList);
            queryDC.setParameterList("groupIdList", groupIdList);
            queryStation.setParameterList("groupIdList", groupIdList);
            queryConstr.setParameterList("groupIdList", groupIdList);
            queryQuantity.setParameterList("groupIdList", groupIdList);
        }
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryDC.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryStation.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryConstr.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryQuantity.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }

        if (obj.getMonthList() != null && !obj.getMonthList().isEmpty()) {
            query.setParameterList("monthList", obj.getMonthList());
            queryCount.setParameterList("monthList", obj.getMonthList());
        }
        if (obj.getMonthYear() != null && !obj.getMonthYear().isEmpty()) {
            query.setParameter("monthYear", obj.getMonthYear());
            queryCount.setParameter("monthYear", obj.getMonthYear());
        }

        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
            queryDC.setParameter("sysGroupId", obj.getSysGroupId());
            queryStation.setParameter("sysGroupId", obj.getSysGroupId());
            queryConstr.setParameter("sysGroupId", obj.getSysGroupId());
            queryQuantity.setParameter("sysGroupId", obj.getSysGroupId());
        }
//		hungnx 20170703 start
        if (obj.getDateFrom() != null) {
            query.setParameter("monthYearFrom", obj.getDateFrom());
            queryCount.setParameter("monthYearFrom", obj.getDateFrom());
            queryConstr.setParameter("monthYearFrom", obj.getDateFrom());
            queryDC.setParameter("monthYearFrom", obj.getDateFrom());
            queryQuantity.setParameter("monthYearFrom", obj.getDateFrom());
            queryStation.setParameter("monthYearFrom", obj.getDateFrom());
        }
        if (obj.getDateTo() != null) {
            query.setParameter("monthYearTo", obj.getDateTo());
            queryCount.setParameter("monthYearTo", obj.getDateTo());
            queryConstr.setParameter("monthYearTo", obj.getDateTo());
            queryDC.setParameter("monthYearTo", obj.getDateTo());
            queryQuantity.setParameter("monthYearTo", obj.getDateTo());
            queryStation.setParameter("monthYearTo", obj.getDateTo());
        }
//		hungnx 20170703 end

        // tuannt_15/08/2018_start
        if (obj.getCatProvinceId() != null) {
            query.setParameter("catProvinceId", obj.getCatProvinceId());
            queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
            queryConstr.setParameter("catProvinceId", obj.getCatProvinceId());
            queryDC.setParameter("catProvinceId", obj.getCatProvinceId());
            queryQuantity.setParameter("catProvinceId", obj.getCatProvinceId());
            queryStation.setParameter("catProvinceId", obj.getCatProvinceId());
        }
        // tuannt_15/08/2018_start

        query.addScalar("dateComplete", new StringType());
        query.addScalar("completeDate", new DateType());
        query.addScalar("performerId", new LongType());
        query.addScalar("performerName", new StringType());
        query.addScalar("constructorName", new StringType());
        query.addScalar("catstationCode", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("status", new StringType());
        query.addScalar("statusConstruction", new StringType());
        query.addScalar("cntContractCode", new StringType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("constructionId", new LongType());

        query.addScalar("approveCompleteValue", new DoubleType());
        query.addScalar("approveCompleteDate", new DateType());
        query.addScalar("price", new DoubleType());
        query.addScalar("quantityByDate", new StringType());
        query.addScalar("obstructedState", new StringType());

        queryDC.addScalar("dateComplete", new StringType());
        queryStation.addScalar("catstationCode", new StringType());
        queryConstr.addScalar("constructionCode", new StringType());
//		hoanm1_20180724_start
        query.addScalar("sysGroupIdSMS", new LongType());
        query.addScalar("constructorName1", new StringType());
//		hoanm1_20180724_end
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

//		hungnx 20180628 start
        List<WorkItemDetailDTO> lst = query.list();

        if (lst.size() > 0) {
            int countDC = queryDC.list().size();
            int countStation = queryStation.list().size();
            int countConstr = queryConstr.list().size();
            lst.get(0).setCountDateComplete(countDC);
            lst.get(0).setCountCatstationCode(countStation);
            lst.get(0).setCountConstructionCode(countConstr);
            lst.get(0).setCountWorkItemName(((BigDecimal) queryCount.uniqueResult()).intValue());
            BigDecimal totalQuantity = (BigDecimal) queryQuantity.uniqueResult();
            lst.get(0).setTotalQuantity(totalQuantity.doubleValue());
        }
//		hungnx 20180713 end
        return lst;
    }

    public List<WorkItemDetailDTO> doSearchCompleteDate(WorkItemDetailDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT  "
                + " DISTINCT  EXTRACT(MONTH FROM work.COMPLETE_DATE) monthComplete,EXTRACT(YEAR FROM work.COMPLETE_DATE) yearComplete, "
                + "   to_char(work.complete_date,'MM/yyyy') AS dateComplete  " + " FROM  " + " WORK_ITEM work "
                + " WHERE " + "work.status=3 ");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("monthComplete", new StringType());
        query.addScalar("yearComplete", new StringType());
        query.addScalar("dateComplete", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public List<WorkItemDetailDTO> doSearchComplete(WorkItemDetailDTO obj) {
        StringBuilder sql = new StringBuilder("select work.CONSTRUCTION_ID constructionId, "
                + " work.COMPLETE_DATE completeDate , " + " work.STATUS status , " + "work.CODE code , "
                + "cwt.NAME catWorkItemTypeName, " + "sys2.NAME supervisorName , " + "sys1.NAME constructorName "
                + "FROM " + "WORK_ITEM work " + "left join CONSTRUCTION con "
                + "ON work.CONSTRUCTION_ID=con.CONSTRUCTION_ID " + "left join CAT_WORK_ITEM_TYPE cwt "
                + "ON cwt.CAT_WORK_ITEM_TYPE_ID=work.CAT_WORK_ITEM_TYPE_ID "
                + "LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sys2 ON work.SUPERVISOR_ID = sys2.SYS_GROUP_ID "
                + "LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sys1 ON work.CONSTRUCTOR_ID = sys1.SYS_GROUP_ID "

                + " WHERE work.CONSTRUCTION_ID = :constructionId ");

        sql.append(" ORDER BY work.CONSTRUCTION_ID DESC");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("constructorName", new StringType());
        query.addScalar("supervisorName", new StringType());
        query.addScalar("completeDate", new DateType());
        query.addScalar("catWorkItemTypeName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        query.setParameter("constructionId", obj.getConstructionId());
        queryCount.setParameter("constructionId", obj.getConstructionId());

        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public List<WorkItemDetailDTO> doSearch(WorkItemDetailDTO obj) {
        if (obj.getConstructionId() == null)
            return new ArrayList<WorkItemDetailDTO>();
        StringBuilder sql = new StringBuilder("SELECT work.CONSTRUCTION_ID constructionId,"
                + " work.CODE code,work.NAME name," + " work.STATUS status, " + "catPartner.NAME constructorName2, "
                + " workItem.NAME catWorkItemType," + "sys1.NAME constructorName1, " + "sys2.NAME supervisorName, "
                + " work.IS_INTERNAL isInternal, work.WORK_ITEM_ID workItemId, work.CAT_WORK_ITEM_TYPE_ID catWorkItemTypeId, "
                + " case work.IS_INTERNAL when '2' then catPartner.NAME else sys1.NAME end  constructorName,"
                + " work.CONSTRUCTOR_ID  constructorId," + " work.EXPECT_QUANTITY price,"
//						+ " workQuota.WORK_DAY  workDay,"
                + " per.FULL_NAME  performerName," + " work.PERFORMER_ID  performerId" + " From WORK_ITEM work "
                + " Left join sys_user per on per.sys_user_id = work.PERFORMER_ID "
                + " LEFT JOIN SYS_GROUP sys1 ON work.CONSTRUCTOR_ID = sys1.SYS_GROUP_ID "
                + " LEFT JOIN CAT_WORK_ITEM_TYPE workItem ON work.CAT_WORK_ITEM_TYPE_ID = workItem.CAT_WORK_ITEM_TYPE_ID "
                + " LEFT JOIN SYS_GROUP sys2 ON work.SUPERVISOR_ID = sys2.SYS_GROUP_ID "
                + " LEFT JOIN CAT_PARTNER catPartner ON work.CONSTRUCTOR_ID = catPartner.CAT_PARTNER_ID "
//						+ "  LEFT JOIN WORK_ITEM_QUOTA workQuota  ON workQuota.CAT_WORK_ITEM_TYPE_ID = work.CAT_WORK_ITEM_TYPE_ID AND workQuota.QUOTA_TYPE = 1 AND workQuota.SYS_GROUP_ID =:sysGroup "
                + " WHERE work.CONSTRUCTION_ID = :constructionId  ");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(work.CODE) LIKE upper(:keySearch) OR upper(workItem.NAME) LIKE upper(:keySearch) escape '&')");
        }
        if (obj.getListStatus() != null) {
            sql.append(" and work.status in :listStatus ");
        }
//		sql.append(" ORDER BY work.CONSTRUCTION_ID DESC");
        sql.append(" ORDER BY workItem.item_order");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("workItemId", new LongType());
        query.addScalar("constructorId", new LongType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("catWorkItemTypeId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("catWorkItemType", new StringType());
        query.addScalar("constructorName1", new StringType());
        query.addScalar("constructorName", new StringType());
        query.addScalar("constructorName2", new StringType());
        query.addScalar("supervisorName", new StringType());
        query.addScalar("isInternal", new StringType());
        query.addScalar("price", new DoubleType());
//		query.addScalar("workDay", new DoubleType());
        query.addScalar("performerName", new StringType());
        query.addScalar("performerId", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        query.setParameter("constructionId", obj.getConstructionId());
        queryCount.setParameter("constructionId", obj.getConstructionId());
//		query.setParameter("sysGroup", obj.getSysGroupId());
//		queryCount.setParameter("sysGroup", obj.getSysGroupId());
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
            queryCount.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
        }
        if (obj.getListStatus() != null) {
            query.setParameterList("listStatus", obj.getListStatus());
            queryCount.setParameterList("listStatus", obj.getListStatus());
        }

        if (obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public List<WorkItemDetailDTO> rpDailyTaskWorkItems(WorkItemDetailDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT work.CONSTRUCTION_ID constructionId,"
                + " work.CODE code,work.NAME name," + " work.STATUS status, " + "catPartner.NAME constructorName2, "
                + " workItem.NAME catWorkItemType," + "sys1.NAME constructorName1, " + "sys2.NAME supervisorName, "
                + " work.IS_INTERNAL isInternal, work.WORK_ITEM_ID workItemId, work.CAT_WORK_ITEM_TYPE_ID catWorkItemTypeId, "
                + " case work.IS_INTERNAL when '2' then catPartner.NAME else sys1.NAME end  constructorName,"
                + " work.CONSTRUCTOR_ID  constructorId," + " work.EXPECT_QUANTITY price,"
                + " per.FULL_NAME  performerName," + " work.PERFORMER_ID  performerId" + " From WORK_ITEM work "
                + " Left join sys_user per on per.sys_user_id = work.PERFORMER_ID "
                + " LEFT JOIN SYS_GROUP sys1 ON work.CONSTRUCTOR_ID = sys1.SYS_GROUP_ID "
                + " LEFT JOIN CAT_WORK_ITEM_TYPE workItem ON work.CAT_WORK_ITEM_TYPE_ID = workItem.CAT_WORK_ITEM_TYPE_ID "
                + " LEFT JOIN SYS_GROUP sys2 ON work.SUPERVISOR_ID = sys2.SYS_GROUP_ID "
                + " LEFT JOIN CAT_PARTNER catPartner ON work.CONSTRUCTOR_ID = catPartner.CAT_PARTNER_ID WHERE 1=1 ");
        if (obj.getConstructionId() != null) {
            sql.append(" AND work.CONSTRUCTION_ID = :constructionId ");
        }
        if (obj.getListStatus() != null) {
            sql.append(" and work.status in :listStatus ");
        }
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (upper(work.CODE) LIKE upper(:keySearch) " + "OR upper(work.NAME) LIKE upper(:keySearch)  " + ") ");
        }
        sql.append(" ORDER BY work.CONSTRUCTION_ID DESC ");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("workItemId", new LongType());
        query.addScalar("constructorId", new LongType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("catWorkItemTypeId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("catWorkItemType", new StringType());
        query.addScalar("constructorName1", new StringType());
        query.addScalar("constructorName", new StringType());
        query.addScalar("constructorName2", new StringType());
        query.addScalar("supervisorName", new StringType());
        query.addScalar("isInternal", new StringType());
        query.addScalar("price", new DoubleType());
        query.addScalar("performerName", new StringType());
        query.addScalar("performerId", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));

        if (obj.getConstructionId() != null) {
            query.setParameter("constructionId", obj.getConstructionId());
            queryCount.setParameter("constructionId", obj.getConstructionId());
        }
        if (obj.getListStatus() != null) {
            query.setParameterList("listStatus", obj.getListStatus());
            queryCount.setParameterList("listStatus", obj.getListStatus());
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

    public WorkItemDetailDTO getWorkItemByCode(String code) {
        StringBuilder sql = new StringBuilder("SELECT work.WORK_ITEM_ID workItemId," + " work.NAME name,"
                + "work.CODE code," + "cons.CODE constructionCode" + " From WORK_ITEM work "
                + " LEFT JOIN CONSTRUCTION cons ON cons.CONSTRUCTION_ID = work.CONSTRUCTION_ID ");
        sql.append(" WHERE work.NAME LIKE :code");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("code", code.trim());
        query.addScalar("workItemId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        return (WorkItemDetailDTO) query.uniqueResult();
    }

    public List<WorkItemDetailDTO> getWorkForTC(Long sysGroupId) {
        if (sysGroupId == null)
            return new ArrayList<WorkItemDetailDTO>();
        StringBuilder sql = new StringBuilder("SELECT work.WORK_ITEM_ID workItemId," + " work.NAME name,"
                + "work.CODE code," + "catProvine.CODE provinceCode," + " cons.CODE constructionCode, "
                + " cnt.CODE cntContract, " + "catStation.CODE catStationCode, "
                + " case cons.CAT_CONSTRUCTION_TYPE_ID when 1 then " + " (SELECT SUM(workQuota.price) "
                + " FROM WORK_ITEM_QUOTA workQuota  WHERE work.cat_work_item_type_id=workQuota.cat_work_item_type_id and workQuota.sys_group_id=cons.sys_group_id "
                + " AND workQuota.quota_type = 1 and  workQuota.type= cons.region) " + " else  "
                + " (SELECT SUM(workQuota.price) "
                + " FROM WORK_ITEM_QUOTA workQuota  WHERE work.cat_work_item_type_id=workQuota.cat_work_item_type_id and workQuota.sys_group_id=cons.sys_group_id "
                + " AND workQuota.quota_type = 1 and workQuota.type=1) end quantity" + " From WORK_ITEM work "
                + " inner JOIN CONSTRUCTION cons ON cons.CONSTRUCTION_ID = work.CONSTRUCTION_ID "
                + " LEFT JOIN CAT_CONSTRUCTION_TYPE consType ON cons.CAT_CONSTRUCTION_TYPE_ID = consType.CAT_CONSTRUCTION_TYPE_ID "
                + " LEFT JOIN CAT_STATION catStation  ON cons.CAT_STATION_ID = catStation.CAT_STATION_ID "
                + " LEFT JOIN (SELECT DISTINCT cntContract.code,  cnt.CONSTRUCTION_ID FROM CNT_CONSTR_WORK_ITEM_TASK cnt INNER JOIN CNT_CONTRACT cntContract ON cntContract.CNT_CONTRACT_ID = cnt.CNT_CONTRACT_ID AND cntContract.contract_type  = 0 AND cntContract.status!=0) cnt  ON cnt.CONSTRUCTION_ID = cons.CONSTRUCTION_ID "
                + " LEFT JOIN CTCT_CAT_OWNER.CAT_PROVINCE catProvine ON catProvine.CAT_PROVINCE_ID = catStation.CAT_PROVINCE_ID ");
        sql.append(" WHERE work.STATUS in (1,2) AND cons.STATUS in (1,2,3) ");
        sql.append(" AND cons.SYS_GROUP_ID =:sysId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("sysId", sysGroupId);
        query.addScalar("workItemId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("cntContract", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        return query.list();
    }

    public boolean checkCode(String code, Long id) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(WORK_ITEM_ID) FROM WORK_ITEM where 1=1 and code=:code ");
        if (id != null) {
            sql.append(" AND WORK_ITEM_ID != :id ");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("code", code);
        if (id != null) {
            query.setParameter("id", id);
        }
        return ((BigDecimal) query.uniqueResult()).intValue() > 0;

    }

    public List<CNTContractDTO> doSearchCovenant(CNTContractDTO obj) {
        StringBuilder sql = new StringBuilder(" SELECT cnt.code code, cnt.name name,"
                + " catPart.name partnerName,  sysG.name sysGroupName, cnt.sign_date signDate, cnt.price/1000000 price ,"
                + " pur.name orderName, cnt.status status " + " from CONSTRUCTION cons "
                + " LEFT JOIN (select distinct CONSTRUCTION_ID,CNT_CONTRACT_ID from CNT_CONSTR_WORK_ITEM_TASK where status=1) WORK "
                + " ON cons.CONSTRUCTION_ID = work.CONSTRUCTION_ID "
                + " LEFT JOIN cnt_contract cnt on work.CNT_CONTRACT_ID = cnt.CNT_CONTRACT_ID "
                + " LEFT JOIN CTCT_CAT_OWNER.CAT_PARTNER catPart  ON catPart.CAT_PARTNER_ID = cnt.CAT_PARTNER_ID  "
                + " LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sysG  ON sysG.SYS_GROUP_ID = cnt.SYS_GROUP_ID "
                + " LEFT JOIN CNT_CONTRACT_ORDER orde  ON orde.CNT_CONTRACT_ID = cnt.CNT_CONTRACT_ID  "
                + " LEFT JOIN PURCHASE_ORDER pur  ON pur.PURCHASE_ORDER_ID = orde.PURCHASE_ORDER_ID  "
                + " where cons.CONSTRUCTION_ID = :constructionId and cnt.contract_type= :type");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("orderName", new StringType());
        query.addScalar("partnerName", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("price", new DoubleType());
        query.addScalar("status", new LongType());
        query.addScalar("signDate", new DateType());

        query.setResultTransformer(Transformers.aliasToBean(CNTContractDTO.class));
        query.setParameter("constructionId", obj.getConstructionId());
        queryCount.setParameter("constructionId", obj.getConstructionId());
        query.setParameter("type", obj.getType());
        queryCount.setParameter("type", obj.getType());
        if (obj.getPageSize() != null && obj.getPage() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<CNTContractDTO> doSearchContractInput(CNTContractDTO obj) {
        StringBuilder sql = new StringBuilder(" SELECT cnt.code code, cnt.name name, sysG.name sysGroupName, "
                + "catPart.name partnerName,  cnt.sign_date signDate, cnt.price/1000000 price , "
                + " (select name from cnt_contract cnt_out where cnt_out.cnt_contract_id=cnt.cnt_contract_parent_id and cnt_out.contract_type=0 and cnt_out.status !=0) outContract, "
                + " cnt.status status " + " from CONSTRUCTION cons  "
                + " LEFT JOIN (select distinct CONSTRUCTION_ID,CNT_CONTRACT_ID from CNT_CONSTR_WORK_ITEM_TASK where status=1) WORK "
                + " ON cons.CONSTRUCTION_ID = work.CONSTRUCTION_ID "
                + " LEFT JOIN cnt_contract cnt on work.CNT_CONTRACT_ID = cnt.CNT_CONTRACT_ID "
                + " LEFT JOIN CTCT_CAT_OWNER.CAT_PARTNER catPart  ON catPart.CAT_PARTNER_ID = cnt.CAT_PARTNER_ID  "
                + " LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sysG  ON sysG.SYS_GROUP_ID = cnt.SYS_GROUP_ID  "
                + " where cons.CONSTRUCTION_ID = :constructionId and cnt.contract_type= :type");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("partnerName", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("price", new DoubleType());
        query.addScalar("status", new LongType());
        query.addScalar("signDate", new DateType());
        query.addScalar("outContract", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(CNTContractDTO.class));
        query.setParameter("constructionId", obj.getConstructionId());
        queryCount.setParameter("constructionId", obj.getConstructionId());
        query.setParameter("type", obj.getType());
        queryCount.setParameter("type", obj.getType());
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<SynStockTransDTO> doSearchDeliveryBill(SynStockTransDTO obj) {
        StringBuilder sql = new StringBuilder(
                " WITH syn_stock AS  (SELECT syn.ORDER_CODE as orderCode, con.CONSTRUCTION_ID constructionId, syn.SIGN_STATE signState, null as isSyn , syn.code code,   syn.STOCK_CODE stockName,    syn.SYN_STOCK_TRANS_ID synStockTransId , ");
        sql.append(
                " syn.CREATED_BY_NAME createdByName ,    syn.REAL_IE_TRANS_DATE realIeTransDate,    syn.STATUS status,    syn.CONFIRM confirm, ");
        sql.append(
                " syn.DESCRIPTION description,    syn.SHIPPER_NAME shipperName,    syn.CREATED_DATE createdDate,    syn.CREATED_DEPT_NAME createdDeptName, syn.BUSSINESS_TYPE_NAME buss , syn.DEPT_RECEIVE_NAME deptReceiveName ,  ");
        sql.append(
                " syn.CANCEL_BY_NAME cancelByName,    syn.CANCEL_DATE cancelDate,    syn.CANCEL_REASON_NAME cancelReasonName,    syn.CANCEL_DESCRIPTION cancelDescription, syn.SHIPPER_ID shipperId, ");
        sql.append(
                " 1 synType  FROM SYN_STOCK_TRANS syn  LEFT JOIN CONSTRUCTION con  ON con.CODE    = syn.CONSTRUCTION_CODE left join CAT_STOCK cs on syn.stock_id = cs.cat_stock_id  WHERE con.CONSTRUCTION_ID =:constructionId AND syn.TYPE =2 AND syn.STATUS =2 ");
        sql.append(
                " ),  stock AS  (SELECT syn.ORDER_CODE orderCode, con.CONSTRUCTION_ID constructionId, syn.SIGN_STATE signState, TO_NCHAR(syn.IS_SYN) isSyn  ,  syn.CODE code,   cs.NAME stockName,    syn.STOCK_TRANS_ID synStockTransId , ");
        sql.append(
                " syn.CREATED_BY_NAME createdByName ,    syn.REAL_IE_TRANS_DATE realIeTransDate,    syn.STATUS status,    syn.CONFIRM confirm,");
        sql.append(
                " syn.DESCRIPTION description,    syn.SHIPPER_NAME shipperName,    syn.CREATED_DATE createdDate,    syn.CREATED_DEPT_NAME createdDeptName, syn.BUSINESS_TYPE_NAME buss , syn.DEPT_RECEIVE_NAME deptReceiveName , ");
        sql.append(
                " syn.CANCEL_BY_NAME cancelByName,    syn.CANCEL_DATE cancelDate,    syn.CANCEL_REASON_NAME cancelReasonName,    syn.CANCEL_DESCRIPTION cancelDescription, syn.SHIPPER_ID shipperId, ");
        sql.append(
                " 2 synType  FROM STOCK_TRANS syn  LEFT JOIN CONSTRUCTION con  ON con.CONSTRUCTION_ID    = syn.CONSTRUCTION_ID left join CAT_STOCK cs on syn.stock_id = cs.cat_stock_id WHERE con.CONSTRUCTION_ID =:constructionId AND syn.TYPE =2 AND syn.STATUS =2 ");
        sql.append(" ),  record AS  ( SELECT * FROM stock  UNION ALL  SELECT * FROM syn_stock  )SELECT * ");
        sql.append(" FROM record WHERE 1=1");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {

            sql.append(
                    " AND (upper(record.orderCode) LIKE upper(:keySearch) OR upper(record.CODE) LIKE upper(:keySearch) ");
            sql.append(
                    " OR upper(record.stockName) LIKE upper(:keySearch) OR upper(record.createdByName) LIKE upper(:keySearch) ESCAPE '&' )  ");
        }

        if (obj.getTypeExport() != null) {
            sql.append(" and record.synType = :type ");
        }
        if (obj.getOrderCode() != null) {
            sql.append(" and syn.ORDER_CODE = :orderCode");
        }
        if (obj.getStockName() != null) {
            sql.append(" and syn.STOCK_CODE = :stockName");
        }
        if (obj.getCode() != null) {
            sql.append(" and syn.code = :code");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        query.addScalar("orderCode", new StringType());
        query.addScalar("synStockTransId", new LongType());
        query.addScalar("shipperId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("createdByName", new StringType());
        query.addScalar("stockName", new StringType());
        query.addScalar("confirm", new StringType());
        query.addScalar("realIeTransDate", new DateType());
        query.addScalar("status", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("shipperName", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdDeptName", new StringType());
        query.addScalar("cancelByName", new StringType());
        query.addScalar("cancelDate", new DateType());
        query.addScalar("cancelReasonName", new StringType());
        query.addScalar("cancelDescription", new StringType());
        query.addScalar("buss", new StringType());
        query.addScalar("deptReceiveName", new StringType());
        query.addScalar("signState", new StringType());
        query.addScalar("isSyn", new StringType());
        query.addScalar("synType", new LongType());
        query.addScalar("constructionId", new LongType());
        if (obj.getTypeExport() != null) {
            query.setParameter("type", obj.getTypeExport());
            queryCount.setParameter("type", obj.getTypeExport());
        }
        if (obj.getOrderCode() != null) {
            query.setParameter("orderCode", obj.getOrderCode());
            queryCount.setParameter("orderCode", obj.getOrderCode());
        }
        if (obj.getStockName() != null) {
            query.setParameter("stockName", obj.getStockName());
            queryCount.setParameter("stockName", obj.getStockName());
        }
        if (obj.getCode() != null) {
            query.setParameter("code", obj.getCode());
            queryCount.setParameter("code", obj.getCode());
        }

        query.setResultTransformer(Transformers.aliasToBean(SynStockTransDTO.class));
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

    // chinhpxn 20180605 start
    public List<WorkItemDetailDTO> doSearchForAutoAdd(String tab, Long catConstructionTypeId) {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("SELECT T1.CAT_WORK_ITEM_TYPE_ID catWorkItemTypeId, ");
        stringBuilder.append("T1.NAME name, ");
        stringBuilder.append("T1.CODE code, ");
        stringBuilder.append("T1.STATUS status ");
        stringBuilder.append("FROM CAT_WORK_ITEM_TYPE T1 ");
        stringBuilder.append("WHERE 1=1 ");
        stringBuilder.append("AND T1.STATUS = 1 ");
        if (null != catConstructionTypeId) {
            stringBuilder.append("AND T1.CAT_CONSTRUCTION_TYPE_ID = :catConstructionTypeId ");
        }

        if (tab.equalsIgnoreCase("CB")) {
            stringBuilder.append("AND T1.TAB like '%CB%' ");
        } else {
            stringBuilder.append("AND T1.TAB like '%TC%'");
        }

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("catWorkItemTypeId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("status", new StringType());
        if (null != catConstructionTypeId) {
            query.setParameter("catConstructionTypeId", catConstructionTypeId);
        }

        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));

        return query.list();
    }
    // chinhpxn 20180605 end

    public List<WorkItemDetailDTO> doSearchForReport(WorkItemDetailDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" select sys_group_id,sysGroupName,sum(QUANTITY)quantity");
        sql.append(" from ");
        sql.append(
                " (select (select sys.sys_group_id from sys_group sys,CONSTRUCTION cst where cst.CONSTRUCTION_id= a.CONSTRUCTION_id and cst.STATUS !=0 ");
        sql.append(" and sys.sys_group_id=cst.sys_group_id) sys_group_id, ");
        sql.append(
                " (select sys.name from sys_group sys,CONSTRUCTION cst where cst.CONSTRUCTION_id= a.CONSTRUCTION_id and cst.STATUS !=0 ");
        sql.append(" and sys.sys_group_id=cst.sys_group_id)sysGroupName, ");
        sql.append(
                " (select cat.CODE from CAT_STATION cat,CONSTRUCTION cst where cst.CONSTRUCTION_id= a.CONSTRUCTION_id ");
        sql.append(" and cat.CAT_STATION_ID=cst.CAT_STATION_ID and cst.STATUS !=0 )catStationCode, ");
        sql.append(" (select prov.CODE from CAT_STATION cat,CAT_PROVINCE prov,CONSTRUCTION cst where  ");
        sql.append(" cst.CONSTRUCTION_id= a.CONSTRUCTION_id  and cat.CAT_STATION_ID=cst.CAT_STATION_ID ");
        sql.append(" and cat.CAT_PROVINCE_ID=prov.CAT_PROVINCE_ID  and cst.STATUS !=0   ");
        sql.append(" )provinceCode, ");
        sql.append(
                " (select code from CONSTRUCTION cst where cst.CONSTRUCTION_id= a.CONSTRUCTION_id and cst.STATUS !=0) constructionCode, ");
        sql.append(" a.name workItemName, ");
        sql.append("  case when c.cat_construction_type_id != 1 then a.QUANTITY/1000000 "
                + "when c.cat_construction_type_id = 1 then CTD.QUANTITY/1000000 end as quantity ");
        sql.append(" from work_item a " + "left join construction_task_daily ctd on a.work_item_id  = ctd.work_item_id"
                + " left join construction c on a.construction_id = c.construction_id" + " where  ");

        sql.append("(  (c.cat_construction_type_id != 1 and a.COMPLETE_DATE >=:startDate ");

        if (obj.getDateKT() != null) {
            sql.append(" 	and a.COMPLETE_DATE<=:endDate ");
        }
        sql.append(") or ( c.cat_construction_type_id = 1 and ctd.confirm = 1 and ctd.approve_date  >=:startDate");

        if (obj.getDateKT() != null) {
            sql.append(" 	and ctd.approve_date<=:endDate ");
        }
        sql.append(" 	) ");
        sql.append(" 	) ");
        if (obj.getSysGroupId() != null) {
            sql.append(
                    " and (select sys.sys_group_id from sys_group sys,CONSTRUCTION cst where cst.CONSTRUCTION_id= a.CONSTRUCTION_id and cst.STATUS !=0");
            sql.append(" 	AND sys.sys_group_id=cst.sys_group_id )=:sysGroupId ");
        }
        sql.append(") group by sys_group_id,sysGroupName ");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("sysGroupName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(CNTContractDTO.class));
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
        }
        if (obj.getDateBD() != null) {
            query.setParameter("startDate", obj.getDateBD());
            queryCount.setParameter("startDate", obj.getDateBD());
        } else {
            query.setParameter("startDate", "");
            queryCount.setParameter("startDate", "");
        }
        if (obj.getDateKT() != null) {
            query.setParameter("endDate", obj.getDateKT());
            queryCount.setParameter("endDate", obj.getDateKT());
        }
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<ObstructedDetailDTO> doSearchEntangled(ObstructedDetailDTO obj) {
        StringBuilder sql = new StringBuilder(
                "SELECT obs.OBSTRUCTED_ID obstructedId, obs.OBSTRUCTED_CONTENT obstructedContent,  obs.CREATED_DATE createdDate,  con.CODE constructionCode ,  obs.OBSTRUCTED_STATE obstructedState,"
                        + " obs.CLOSED_DATE closedDate,  createPerson.full_name createdUserName "
                        + ",obs.CREATED_USER_ID createdUserId,obs.CREATED_GROUP_ID createdGroupId "
                        + "FROM OBSTRUCTED obs "
                        + " LEFT JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID    = obs.CONSTRUCTION_ID "
                        + " left join sys_user createPerson on createPerson.SYS_USER_ID = obs.CREATED_USER_ID "
                        + " WHERE con.CONSTRUCTION_ID = :constructionId  ");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(obs.OBSTRUCTED_CONTENT) LIKE upper(:keySearch) or UPPER(createPerson.full_name) LIKE upper(:keySearch)) ");
        }
        if (StringUtils.isNotEmpty(obj.getObstructedState())) {
            sql.append(" and obs.OBSTRUCTED_STATE = :obstructedState ");
        }
        if (obj.getCreatedFrom() != null) {
            sql.append(" and  obs.CREATED_DATE>= :createFrom");
        }
        if (obj.getCreatedTo() != null) {
            sql.append(" and  obs.CREATED_DATE<= :createTo");
        }
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("obstructedContent", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("closedDate", new DateType());
        query.addScalar("obstructedState", new StringType());
        query.addScalar("createdUserName", new StringType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("obstructedId", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(ObstructedDetailDTO.class));
        query.setParameter("constructionId", obj.getConstructionId());
        queryCount.setParameter("constructionId", obj.getConstructionId());
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
            queryCount.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
        }
        if (StringUtils.isNotEmpty(obj.getObstructedState())) {
            query.setParameter("obstructedState", obj.getObstructedState());
            queryCount.setParameter("obstructedState", obj.getObstructedState());
        }
        if (obj.getCreatedFrom() != null) {
            query.setParameter("createFrom", obj.getCreatedFrom());
            queryCount.setParameter("createFrom", obj.getCreatedFrom());
        }
        if (obj.getCreatedTo() != null) {
            query.setParameter("createTo", obj.getCreatedTo());
            queryCount.setParameter("createTo", obj.getCreatedTo());
        }
        if (obj.getPage() != null & obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<WorkItemDetailDTO> doSearchDetailForReport(WorkItemDetailDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" select ");
        sql.append(
                " (select sys.name from sys_group sys,CONSTRUCTION cst where cst.CONSTRUCTION_id= a.CONSTRUCTION_id and cst.STATUS !=0 ");
        sql.append("  and sys.sys_group_id=cst.sys_group_id)sysGroupName, ");
        sql.append(
                " (select cat.CODE from CAT_STATION cat,CONSTRUCTION cst where cst.CONSTRUCTION_id= a.CONSTRUCTION_id ");
        sql.append(" and cat.CAT_STATION_ID=cst.CAT_STATION_ID and cst.STATUS !=0 )catStationCode, ");
        sql.append(" (select prov.CODE from CAT_STATION cat,CAT_PROVINCE prov,CONSTRUCTION cst where ");
        sql.append(" cst.CONSTRUCTION_id= a.CONSTRUCTION_id  and cat.CAT_STATION_ID=cst.CAT_STATION_ID ");
        sql.append(" and cat.CAT_PROVINCE_ID=prov.CAT_PROVINCE_ID  and cst.STATUS !=0 ");
        sql.append(" )provinceCode, ");
        sql.append(
                " (select code from CONSTRUCTION cst where cst.CONSTRUCTION_id= a.CONSTRUCTION_id and cst.STATUS !=0) constructionCode, ");
        sql.append(" a.name name, ");
        sql.append("  case when c.cat_construction_type_id != 1 then a.QUANTITY/1000000 "
                + "when c.cat_construction_type_id = 1 then CTD.QUANTITY/1000000 " + "end as  approveQuantity ");
        sql.append(" from work_item a left join " + "construction_task_daily ctd "
                + "on a.work_item_id  = ctd.work_item_id " + "left join construction c "
                + "on a.construction_id = c.construction_id  where a.complete_date is not null and ");

        sql.append(" ( (  c.cat_construction_type_id != 1 ");
        if (obj.getDateBD() != null) {
            sql.append(" 	and a.COMPLETE_DATE >=:dateBD ");
        }
        if (obj.getDateKT() != null) {
            sql.append(" 	and a.COMPLETE_DATE<=:dateKT ");
        }
        sql.append(" ) or (  c.cat_construction_type_id = 1 and ctd.confirm = 1 ");
        if (obj.getDateBD() != null) {
            sql.append(" 	and ctd.approve_date  >=:dateBD ");
        }
        if (obj.getDateKT() != null) {
            sql.append(" 	and ctd.approve_date <=:dateKT ");
        }
        sql.append(" ) ) ");

        if (obj.getSysGroupId() != null) {
            sql.append(
                    " and (select sys.sys_group_id from sys_group sys,CONSTRUCTION cst where cst.CONSTRUCTION_id= a.CONSTRUCTION_id and cst.STATUS !=0 ");
            sql.append(" 	AND sys.sys_group_id=cst.sys_group_id) =:sysGroupId ");
        }
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        query.addScalar("approveQuantity", new DoubleType());
        query.addScalar("name", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(CNTContractDTO.class));
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
        }
        if (obj.getDateBD() != null) {
            query.setParameter("dateBD", obj.getDateBD());
            queryCount.setParameter("dateBD", obj.getDateBD());
        }
        if (obj.getDateKT() != null) {
            query.setParameter("dateKT", obj.getDateKT());
            queryCount.setParameter("dateKT", obj.getDateKT());
        }
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        if (obj.getPage() != null & obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<WorkItemDetailDTO> reportCompleteProgress(WorkItemDetailDTO obj) {
        StringBuilder sql = new StringBuilder("select work.CONSTRUCTION_ID constructionId, "
                + " work.COMPLETE_DATE completeDate , " + " work.STATUS status , " + "work.CODE code , "
                + "cwt.NAME catWorkItemTypeName, " + "sys2.NAME supervisorName , " + "sys1.NAME constructorName "
                + "FROM " + "WORK_ITEM work " + "left join CONSTRUCTION con "
                + "ON work.CONSTRUCTION_ID=con.CONSTRUCTION_ID " + "left join CAT_WORK_ITEM_TYPE cwt "
                + "ON cwt.CAT_WORK_ITEM_TYPE_ID=work.CAT_WORK_ITEM_TYPE_ID "
                + "LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sys2 ON work.SUPERVISOR_ID = sys2.SYS_GROUP_ID "
                + "LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP sys1 ON work.CONSTRUCTOR_ID = sys1.SYS_GROUP_ID "

                + " WHERE 1=1  AND work.CONSTRUCTION_ID = :constructionId ");

        sql.append(" ORDER BY work.CONSTRUCTION_ID DESC");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("constructorName", new StringType());
        query.addScalar("supervisorName", new StringType());
        query.addScalar("completeDate", new DateType());
        query.addScalar("catWorkItemTypeName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        query.setParameter("constructionId", obj.getConstructionId());
        queryCount.setParameter("constructionId", obj.getConstructionId());

        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    // START SERVICE MOBILE
    public List<ConstructionStationWorkItemDTO> getNameWorkItem(ConstructionStationWorkItemDTO request) {
        StringBuilder sql = new StringBuilder(
                "SELECT wi.NAME name , wi.WORK_ITEM_ID workItemId, wi.code workItemCode FROM WORK_ITEM wi "
                        + " WHERE wi.CONSTRUCTION_ID = :constructionId order by name");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", request.getConstructionId());
        query.addScalar("name", new StringType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("workItemCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionStationWorkItemDTO.class));
        return query.list();
    }

    public List<ConstructionStationWorkItemDTO> getNameCatTask(ConstructionStationWorkItemDTO request) {
        StringBuilder sql = new StringBuilder(
                "SELECT ct.name name , ct.CAT_TASK_ID catTaskId , ct.CODE catTaskCode " + " from work_item wi "
                        + "inner join cat_task ct " + "on ct.CAT_WORK_ITEM_TYPE_ID = wi.CAT_WORK_ITEM_TYPE_ID "
                        + "WHERE wi.WORK_ITEM_ID = :workItemId AND ct.status = 1 order by name");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("workItemId", request.getWorkItemId());
        query.addScalar("name", new StringType());
        query.addScalar("catTaskId", new LongType());
        query.addScalar("catTaskCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionStationWorkItemDTO.class));
        return query.list();
    }

    public List<WorkItemDetailDTO> getListWorkItemByUser(SysUserRequest request) {

        long month = constructionTaskDao.getCurrentTimeStampMonth(new Date());
        long year = constructionTaskDao.getCurrentTimeStampYear(new Date());

        String sql = new String(
//				hoanm1_20180522_start
                " select distinct a.construction_id constructionId, "
                        + " nvl((select sum(quantity) from CONSTRUCTION_TASK_DAILY task_daily where task_daily.work_item_id=b.work_item_id "
                        + " and task_daily.confirm in(0,1)),b.quantity) quantity, "
//				hoanm1_20180522_end
                        + "  a.work_item_id workItemId,  " + " a.CAT_WORK_ITEM_TYPE_ID catWorkItemTypeId , "
                        + " b.sys_group_id sysGroupId, "
                        + " (select code from construction cs where cs.construction_id=a.construction_id) constructionCode, a.name name, "
                        + " (select to_date(to_char(MIN(start_date),'dd/MM/yyyy'),'dd/MM/yyyy') startingDate from CONSTRUCTION_TASK task where level_id=4 and type=1 "
                        + " start with task.parent_id = b.construction_task_id connect by prior task.construction_task_id = task.parent_id "
                        + " ) startingDate, "
                        + " (select to_date(to_char(MAX(end_date),'dd/MM/yyyy'),'dd/MM/yyyy') end_date from CONSTRUCTION_TASK task where level_id=4 and type=1 "
                        + " start with task.parent_id = b.construction_task_id "
                        + " connect by prior task.construction_task_id = task.parent_id " + " ) endingDate, "
                        + " a.status status ,a.approve_description approveDescription,a.COMPLETE_DATE  "
                        + " from work_item a,construction_task b,DETAIL_MONTH_PLAN c where a.work_item_id=b.work_item_id and "
                        + " b.DETAIL_MONTH_PLAN_ID=c.DETAIL_MONTH_PLAN_ID and c.SIGN_STATE=3 and c.status = 1  and b.level_id=3 and b.COMPLETE_PERCENT=100 "
                        + " and b.performer_id= :sysUserId and  ((b.MONTH = :month  AND b.YEAR = :year) or (b.MONTH = :monthMinus  AND b.YEAR = :yearMinus)) "
                        + " and (a.status=3 or (a.status=2 and "
                        + " (select avg(status) from construction_task tsk where a.work_item_id=tsk.work_item_id "
                        + " and tsk.DETAIL_MONTH_PLAN_ID=c.DETAIL_MONTH_PLAN_ID and level_id=4 and type=1 "
                        + " and b.performer_id= :sysUserId )=4)) order by a.status,a.COMPLETE_DATE desc");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
//		hoanm1_20180522_start
        query.addScalar("quantity", new DoubleType());
//		hoanm1_20180522_end
        query.addScalar("constructionId", new LongType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("catWorkItemTypeId", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("startingDate", new DateType());
//        hoanm1_20180905_start
//        query.addScalar("completeDate", new DateType());
        query.addScalar("endingDate", new DateType());
//        hoanm1_20180905_end
        query.addScalar("status", new StringType());
        query.addScalar("approveDescription", new StringType());
        query.setParameter("sysUserId", request.getSysUserId());
        query.setParameter("month", month);
        query.setParameter("year", year);
        if (month > 1 && month <= 12) {
            query.setParameter("monthMinus", month - 1);
            query.setParameter("yearMinus", year);
        } else {
            query.setParameter("monthMinus", 12);
            query.setParameter("yearMinus", year - 1);
        }
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));

        return query.list();
    }

    public Double avgStatus(Long constructionId) {
        String sql = new String("select nvl(round(AVG(b.status),2),0) status "
                + " from construction a, work_item b where a.CONSTRUCTION_ID=b.CONSTRUCTION_ID " + " and a.status !=0  "
                + " and a.construction_id = :constructionId ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("status", new DoubleType());
        query.setParameter("constructionId", constructionId);
        List<Double> lstDoub = query.list();
        if (lstDoub != null && lstDoub.size() > 0) {
            return lstDoub.get(0);
        }
        return 0D;
    }
//    hoanm1_20181012_start
    public Double avgStatusWorkItem(Long workItemId) {
    	 long month = constructionTaskDao.getCurrentTimeStampMonth(new Date());
         long year = constructionTaskDao.getCurrentTimeStampYear(new Date());
        String sql = new String("select nvl(round(AVG(status),2),0)status from construction_task where work_item_id = :workItemId and level_id=4 and month = :month and year = :year ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("status", new DoubleType());
        query.setParameter("workItemId", workItemId);
        query.setParameter("month", month);
        query.setParameter("year", year);
        List<Double> lstDoub = query.list();
        if (lstDoub != null && lstDoub.size() > 0) {
            return lstDoub.get(0);
        }
        return 0D;
    }
//    hoanm1_20181012_end
    public int updateConstructionComplete(Long constructionId) {
        String sql = new String("update construction set status=5,complete_date=sysdate,"
                + " COMPLETE_VALUE= (select sum(QUANTITY) from work_item where construction_id = :constructionId) "
                + " where construction_id = :constructionId ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("constructionId", constructionId);
        return query.executeUpdate();

    }

    public int updateWorkItem(WorkItemDetailDTORequest request) {

        StringBuilder sql = new StringBuilder("UPDATE WORK_ITEM SET UPDATED_GROUP_ID = :updateGroupID "
                + "  , UPDATED_USER_ID = :updatedUserId , UPDATED_DATE = :updatedDate"
                + "  , STATUS = '3', COMPLETE_DATE = :completeDate , APPROVE_DESCRIPTION = :description, starting_date = :startingDate , "
                + " QUANTITY = :quantity  "
                + "  where WORK_ITEM_ID = :workItemId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("workItemId", request.getWorkItemDetailDto().getWorkItemId());
        query.setParameter("description", request.getWorkItemDetailDto().getApproveDescription());
        query.setParameter("startingDate", request.getWorkItemDetailDto().getStartingDate());
        query.setParameter("completeDate", new Date());
        query.setParameter("updateGroupID", request.getSysUserRequest().getSysGroupId());
        query.setParameter("updatedUserId", request.getSysUserRequest().getSysUserId());
        query.setParameter("updatedDate", new Date());
        query.setParameter("quantity", request.getWorkItemDetailDto().getQuantity());
        return query.executeUpdate();
    }

    public List<ConstructionImageInfo> getImageByWorkItem(WorkItemDetailDTORequest request) {
        List<ConstructionImageInfo> listImage = utilAttachDocumentDao.getListImageByWorkItem(request);
        List<ConstructionImageInfo> listImageRes = constructionTaskBusiness.getConstructionImages(listImage);
        return listImageRes;
    }

    // END SERVICE MOBILE

    public List<SynStockTransDetailDTO> GoodsListTable(SynStockTransDetailDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT sd.GOODS_CODE goodsCode ,");
        sql.append(" sd.GOODS_NAME goodsName , ");
        sql.append(" sd.GOODS_UNIT_NAME goodsUnitName, ");
        sql.append(" sd.AMOUNT_REAL amountReal , ");
        sql.append(" sd.GOODS_STATE goodsState, ");
        if (obj.getTypeExport() == 1) {
            sql.append(" sd.SYN_STOCK_TRANS_DETAIL_ID synStockTransDetailId FROM SYN_STOCK_TRANS_DETAIL sd ");
            sql.append(" LEFT JOIN SYN_STOCK_TRANS sys ");
            sql.append(" ON sd.SYN_STOCK_TRANS_ID = sys.SYN_STOCK_TRANS_ID ");
            sql.append(" WHERE sd.SYN_STOCK_TRANS_ID =:idTable ");
        } else {
            sql.append(" sd.STOCK_TRANS_DETAIL_ID synStockTransDetailId FROM STOCK_TRANS_DETAIL sd ");
            sql.append(" LEFT JOIN STOCK_TRANS sys ");
            sql.append(" ON sd.STOCK_TRANS_ID = sys.STOCK_TRANS_ID ");
            sql.append(" WHERE sd.STOCK_TRANS_ID =:idTable ");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("amountReal", new DoubleType());
        query.addScalar("goodsState", new StringType());
        query.addScalar("synStockTransDetailId", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(SynStockTransDetailDTO.class));
        query.setParameter("idTable", obj.getIdTable());
        queryCount.setParameter("idTable", obj.getIdTable());
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<SynStockTransDetailSerialDTO> GoodsListDetail(SynStockTransDetailSerialDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ss.SERIAL serial , ");
        sql.append("  syn.CONTRACT_CODE contractCode ,");
        if (obj.getTypeExport() == 1) {
            sql.append(" ss.PART_NUMBER  partNumber,  ");
            sql.append(" ss.CAT_PRODUCING_COUNTRY_NAME  nameCountry, ");
            sql.append(" ss.CAT_MANUFACTURER_NAME nameMan ");
            sql.append(" FROM SYN_STOCK_TRANS_DETAIL_SERIAL ss ");
            sql.append(" LEFT JOIN SYN_STOCK_TRANS syn ");
            sql.append(" ON syn.SYN_STOCK_TRANS_ID = ss.SYN_STOCK_TRANS_ID ");
            sql.append(" WHERE ss.SYN_STOCK_TRANS_DETAIL_ID =:idDetail");
        } else {
            sql.append(" cou.NAME nameCountry, ");
            sql.append(" mer.PART_NUMBER  partNumber,  ");
            sql.append("  man.NAME nameMan ");
            sql.append(" FROM STOCK_TRANS_DETAIL_SERIAL ss ");
            sql.append(" LEFT JOIN STOCK_TRANS syn ");
            sql.append(" ON syn.STOCK_TRANS_ID = ss.STOCK_TRANS_ID ");
            sql.append(" LEFT JOIN MER_ENTITY mer ");
            sql.append(" ON mer.MER_ENTITY_ID = ss.MER_ENTITY_ID ");
            sql.append(" LEFT JOIN CAT_PRODUCING_COUNTRY cou");
            sql.append(" ON cou.CAT_PRODUCING_COUNTRY_ID = mer.CAT_PRODUCING_COUNTRY_ID ");
            sql.append(" LEFT JOIN CAT_MANUFACTURER man");
            sql.append(" ON man.CAT_MANUFACTURER_ID = mer.CAT_MANUFACTURER_ID");
            sql.append(" WHERE ss.STOCK_TRANS_DETAIL_ID =:idDetail");
        }
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        query.addScalar("serial", new StringType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("partNumber", new StringType());
        query.addScalar("nameCountry", new StringType());
        query.addScalar("nameMan", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(SynStockTransDetailSerialDTO.class));
        query.setParameter("idDetail", obj.getIdDetail());
        queryCount.setParameter("idDetail", obj.getIdDetail());
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        List<SynStockTransDetailSerialDTO> lt = query.list();
        return lt;

    }

    public Long updateInConstruction(WorkItemDetailDTO obj) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("update work_item set is_Internal =:isInternal ");
        if (obj.getConstructorId() != null) {
            sql.append(",constructor_Id = :constructorId");
        }
        if (obj.getSupervisorId() != null) {
            sql.append(",supervisor_id = :supervisorId");
        }
        if (obj.getPerformerId() != null) {
            sql.append(",PERFORMER_ID = :performerId");
        }
        if (obj.getPrice() == null) {
            sql.append(" ,EXPECT_QUANTITY = 0 ");
        } else if (obj.getPrice() != null) {
            sql.append(" ,EXPECT_QUANTITY = :price ");
        }
        sql.append(
                " ,updated_Date = sysDate,updated_User_Id=:updatedUserId, updated_Group_Id=:updatedGroupId where work_item_id =:workItemId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (obj.getConstructorId() != null) {
            query.setParameter("constructorId", obj.getConstructorId());
        }
        if (obj.getSupervisorId() != null) {
            query.setParameter("supervisorId", obj.getSupervisorId());
        }
        if (obj.getPerformerId() != null) {
            query.setParameter("performerId", obj.getPerformerId());
        }
        if (obj.getPrice() != null) {
            query.setParameter("price", obj.getPrice());
        }
        query.setParameter("isInternal", obj.getIsInternal());
        query.setParameter("updatedUserId", obj.getUpdatedUserId());
        query.setParameter("updatedGroupId", obj.getUpdatedGroupId());
        query.setParameter("workItemId", obj.getWorkItemId());
        return (long) query.executeUpdate();
    }

    public void removeFillterWorkItemByListId(List<String> workItemDetailList, String approveDescription) {
        StringBuilder sql = new StringBuilder();
        sql.append(" UPDATE WORK_ITEM work");
        sql.append(" SET");
        sql.append("  work.QUANTITY = null,work.STATUS=2,work.approve_description=:approveDescription ");
        sql.append(" WHERE   work.WORK_ITEM_ID in :workItemDetailList");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameterList("workItemDetailList", workItemDetailList);
        query.setParameter("approveDescription", approveDescription);

        query.executeUpdate();

    }

    public List<WorkItemDetailDTO> getListWorkItemByConsId(Long constructionId) {
        StringBuilder sql = new StringBuilder();
        sql.append(" Select a.CODE code,");
        sql.append(
                " 		(select name from CAT_WORK_ITEM_TYPE cat where cat.CAT_WORK_ITEM_TYPE_ID=a.CAT_WORK_ITEM_TYPE_ID) name,");
        sql.append(" 		a.QUANTITY/1000000 quantity,");
        sql.append(" 		a.STATUS status ");
        sql.append(" From WORK_ITEM a ");
        sql.append(" WHERE   a.CONSTRUCTION_ID = :id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("status", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        query.setParameter("id", constructionId);
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

    public List<Long> getListConstructionTask(Long id, String tableName) {
        StringBuilder sql = null;
        if (tableName == "KPI_LOG_MOBILE") {
            sql = new StringBuilder(
                    "select CONSTRUCTIONTASKID constructionTaskId from KPI_LOG_MOBILE where work_item_id = :id and level_id = 4 and type = 1 ");
        } else {
            sql = new StringBuilder(
                    "select CONSTRUCTION_TASK_ID constructionTaskId from CONSTRUCTION_TASK where work_item_id = :id and level_id = 4 and type = 1 ");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("constructionTaskId", new LongType());
        query.setParameter("id", id);
        return query.list();
    }

    public List<WorkItemDetailDTO> doSearchForTask(WorkItemDetailDTO obj) {
        if (obj.getConstructionId() == null)
            return new ArrayList<WorkItemDetailDTO>();
        StringBuilder sql = new StringBuilder("SELECT work.CONSTRUCTION_ID constructionId,"
                + " work.CODE code,work.NAME name," + " work.STATUS status, " + "catPartner.NAME constructorName2, "
                + " workItem.NAME catWorkItemType," + "sys1.NAME constructorName1, " + "sys2.NAME supervisorName, "
                + " work.IS_INTERNAL isInternal, work.WORK_ITEM_ID workItemId, work.CAT_WORK_ITEM_TYPE_ID catWorkItemTypeId, "
                + " case work.IS_INTERNAL when '2' then catPartner.NAME else sys1.NAME end  constructorName,"
                + " work.CONSTRUCTOR_ID  constructorId " + " From WORK_ITEM work "
                + " LEFT JOIN SYS_GROUP sys1 ON work.CONSTRUCTOR_ID = sys1.SYS_GROUP_ID "
                + " LEFT JOIN CAT_WORK_ITEM_TYPE workItem ON work.CAT_WORK_ITEM_TYPE_ID = workItem.CAT_WORK_ITEM_TYPE_ID "
                + " LEFT JOIN SYS_GROUP sys2 ON work.SUPERVISOR_ID = sys2.SYS_GROUP_ID "
                + " LEFT JOIN CAT_PARTNER catPartner ON work.CONSTRUCTOR_ID = catPartner.CAT_PARTNER_ID "
                + " WHERE work.CONSTRUCTION_ID = :constructionId and(work.status = 2 or work.status = 1) ");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(work.CODE) LIKE upper(:keySearch) OR upper(workItem.NAME) LIKE upper(:keySearch) escape '&')");
        }

        sql.append(" ORDER BY workItem.ITEM_ORDER");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("workItemId", new LongType());
        query.addScalar("constructorId", new LongType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("catWorkItemTypeId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("catWorkItemType", new StringType());
        query.addScalar("constructorName1", new StringType());
        query.addScalar("constructorName", new StringType());
        query.addScalar("constructorName2", new StringType());
        query.addScalar("supervisorName", new StringType());
        query.addScalar("isInternal", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        query.setParameter("constructionId", obj.getConstructionId());
        queryCount.setParameter("constructionId", obj.getConstructionId());
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }

        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public List<WorkItemDTO> GetListData() {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT DISTINCT ct.Name name, w.NAME code ");
        sql.append(" FROM WORK_ITEM w ");
        sql.append(" LEFT JOIN CONSTRUCTION con ");
        sql.append(" ON w.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        sql.append(" LEFT JOIN CAT_CONSTRUCTION_TYPE ct ");
        sql.append(" ON con.CAT_CONSTRUCTION_TYPE_ID = CT.CAT_CONSTRUCTION_TYPE_ID and ct.STATUS =1 ");
        sql.append(" ORDER by ct.Name ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDTO.class));
        return query.list();
    }

    public WorkItemDetailDTO getWorkItemByCodeNew(String workItemName, String conStructionCode) {
        StringBuilder sql = new StringBuilder("SELECT work.WORK_ITEM_ID workItemId," + " work.NAME name,"
                + "work.CODE code," + "work.STATUS status," + "cons.CODE constructionCode" + " From WORK_ITEM work "
                + " LEFT JOIN CONSTRUCTION cons ON cons.CONSTRUCTION_ID = work.CONSTRUCTION_ID ");
//		chinhpxn20180717_start
        sql.append(" WHERE upper(work.NAME) = upper(:workItemName) and upper(cons.code) = upper(:conStructionCode)");
//		chinhpxn20180717_end
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("workItemName", workItemName);
        query.setParameter("conStructionCode", conStructionCode);
        query.addScalar("workItemId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        return (WorkItemDetailDTO) query.uniqueResult();
    }

    // chinhpxn20180716_start
    public List<WorkItemDetailDTO> getWorkItemByName(Long month, Long year) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT work.WORK_ITEM_ID workItemId, ");
        sql.append(" 						 work.NAME name, ");
        sql.append(" 						 work.CODE code, ");
        sql.append(" 						 work.STATUS status, ");
        sql.append(" 						 cons.CODE constructionCode ");
        sql.append(" 						  From WORK_ITEM work  ");
        sql.append(
                " 						  LEFT JOIN CONSTRUCTION cons ON cons.CONSTRUCTION_ID = work.CONSTRUCTION_ID ");
//        hoanm1_20181023_start_comment
//        sql.append(" where work.WORK_ITEM_ID in (select work_item_id from construction_task task where task.level_id=3 and task.detail_month_plan_id in ");
//        sql.append(" (select detail_month_plan_id from detail_month_plan dmp where dmp.sign_state=3 and dmp.status=1 and dmp.month=:month and dmp.year=:year)) ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
//        query.setParameter("month", month);
//        query.setParameter("year", year);
//        hoanm1_20181023_end_comment
        query.addScalar("workItemId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        return query.list();
    }
    // chinhpxn20180716_end

    //	hungnx 20180705 start
    public int updateStatusWorkItem(WorkItemDetailDTO criteria) {
        StringBuilder stringBuilder = new StringBuilder("UPDATE WORK_ITEM w set W.STATUS = :status");
        stringBuilder.append(" where W.WORK_ITEM_ID = :workItemId");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.setParameter("status", criteria.getStatus());
        query.setParameter("workItemId", criteria.getWorkItemId());
        return query.executeUpdate();
    }

    public int updateStatusConstruction(Long constructionId, String status) {
        String sql = new String(
                "update construction set status= :status" + " where construction_id = :constructionId ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("constructionId", constructionId);
        query.setParameter("status", status);
        return query.executeUpdate();

    }

    //	hungnx 20180705 end
    public long findSignState(long workItemId) {
        StringBuilder sql = new StringBuilder(
                "SELECT de.STATUS status" + " FROM CONSTRUCTION_TASK consTask INNER JOIN DETAIL_MONTH_PLAN de "
                        + " ON de.DETAIL_MONTH_PLAN_ID   = consTask.DETAIL_MONTH_PLAN_ID ");
        sql.append(" WHERE consTask.WORK_ITEM_ID = :workItemId");
        sql.append(" AND de.SIGN_STATE = 3 ");
        sql.append(" AND de.STATUS     =1 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("workItemId", workItemId);
        query.addScalar("status", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        List<Long> fs = query.list();
        if (!fs.isEmpty()) {
            return 0;
        }
        return -1;
    }

    //	chinhpxn20180719_start
    public List<WorkItemDetailDTO> getWorkItemLstFromIdLst(List<String> workItemIdLst) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT wi.WORK_ITEM_ID workItemId, ");
        sql.append("   wi.NAME name, ");
        sql.append("   con.CODE constructionCode,wi.quantity,con.sys_group_id sysGroupIdSMS  ");
        sql.append(" FROM WORK_ITEM wi ");
        sql.append(" LEFT JOIN CONSTRUCTION con ");
        sql.append(" ON wi.CONSTRUCTION_ID  = con.CONSTRUCTION_ID ");
        sql.append(" WHERE wi.work_item_id IN (:workItemIdLst) ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("workItemId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("constructionCode", new StringType());
//        hoanm1_20181116_start
        query.addScalar("quantity", new DoubleType());
        query.addScalar("sysGroupIdSMS", new LongType());
//        hoanm1_20181116_end
        query.setParameterList("workItemIdLst", workItemIdLst);

        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        return query.list();
    }

    public int createSendSmsEmail(WorkItemDetailDTO request, KttsUserSession user, Long isApprove) {
        SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");// dd/MM/yyyy
        String sql = new String(" SELECT SEND_SMS_EMAIL_SEQ.nextval FROM DUAL ");
        SQLQuery query = getSession().createSQLQuery(sql);
        int sendSmsEmailId = ((BigDecimal) query.uniqueResult()).intValue();
        StringBuilder sqlSendSmsEmail = new StringBuilder("INSERT INTO SEND_SMS_EMAIL (" + "   SEND_SMS_EMAIL_ID "
                + " , TYPE" + " , RECEIVE_PHONE_NUMBER " + " , RECEIVE_EMAIL" + " , CREATED_DATE "
                + " , CREATED_USER_ID" + " , CREATED_GROUP_ID" + " , SUBJECT" + " , CONTENT,status " + " ) VALUES ( "
                + " :sendSmsEmailId" + " , 1 " + " , :phoneNumber " + " , :email" + " , :createdDate"
                + " , :createUserId" + " , :createGroupId" + " , :subject " + " , :content,0  " + ")");
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
                " SELECT ap.NAME name from APP_PARAM ap where ap.par_type = 'CONTENT_SMS_VALUE' and ap.code = :isApprove ");
        SQLQuery queryGetNameCatTask = getSession().createSQLQuery(sqlGetNameCatTask);
        queryGetNameCatTask.addScalar("name", new StringType());
        queryGetNameCatTask.setParameter("isApprove", isApprove);
        List<String> nameListCatTask = queryGetNameCatTask.list();
        if (!nameListCatTask.isEmpty()) {
            nameCatTask = nameListCatTask.get(0);
        }

        StringBuilder strContent = new StringBuilder(nameCatTask);

        if (isApprove == 1l) {
            int i = strContent.indexOf("Y");
            strContent.replace(i, i + 1, String.valueOf(request.getQuantity() / 1000000));
        }

        String name = request.getName() + " cho công trình " + request.getConstructionCode();
        int i = strContent.indexOf("X");
        strContent.replace(i, i + 1, name);
        String email = "";
        String phoneNumber = "";
        SQLQuery querySms = getSession().createSQLQuery(sqlSendSmsEmail.toString());
        String sqlUser = new String(
                "SELECT EMAIL email, PHONE_NUMBER mobile FROM SYS_USER WHERE SYS_USER_ID in (SELECT UNIQUE PERFORMER_ID FROM CONSTRUCTION_TASK"
                        + " WHERE WORK_ITEM_ID = :workItemId AND LEVEL_ID = 3) and rownum=1");
        SQLQuery queryGetSysUser = getSession().createSQLQuery(sqlUser);
        queryGetSysUser.addScalar("email", new StringType());
        queryGetSysUser.addScalar("mobile", new StringType());
        queryGetSysUser.setParameter("workItemId", request.getWorkItemId());
        queryGetSysUser.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
        SysUserDTO userDTO = (SysUserDTO) queryGetSysUser.uniqueResult();
        if (userDTO != null) {
            email = userDTO.getEmail();
            phoneNumber = userDTO.getMobile();
        }

        querySms.setParameter("phoneNumber", phoneNumber);
        querySms.setParameter("email", email);
        querySms.setParameter("createUserId", user.getVpsUserInfo().getSysUserId());
        querySms.setParameter("createGroupId", user.getVpsUserInfo().getSysGroupId());
        querySms.setParameter("sendSmsEmailId", sendSmsEmailId);
        querySms.setParameter("createdDate", new Date());
        querySms.setParameter("content", strContent.toString());
        querySms.setParameter("subject", nameSubject);
        return querySms.executeUpdate();
    }

    public int createSendSmsEmailToOperator(WorkItemDetailDTO request, KttsUserSession user, Long isApprove) {
        String sqlUser = new String("select e.email,e.PHONE_NUMBER phone "
                + " from domain_data a,user_role_data b,user_role c,sys_role d,sys_user e"
                + " where a.domain_data_id = b.DOMAIN_DATA_ID and c.USER_ROLE_ID = b.USER_ROLE_ID"
                + " and c.SYS_ROLE_ID = d.SYS_ROLE_ID and c.SYS_USER_ID=e.SYS_USER_ID and d.code = 'OPERATOR_SMS' "
                + " and a.DATA_ID = :sysGroupId ");
        SQLQuery queryGetSysUser = getSession().createSQLQuery(sqlUser);
        queryGetSysUser.addScalar("email", new StringType());
        queryGetSysUser.addScalar("phone", new StringType());
        queryGetSysUser.setParameter("sysGroupId", request.getSysGroupIdSMS());
        queryGetSysUser.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
        List<SysUserDTO> lstUser = queryGetSysUser.list();

        for (SysUserDTO userDTO : lstUser) {

            String sql = new String(" SELECT SEND_SMS_EMAIL_SEQ.nextval FROM DUAL ");
            SQLQuery query = getSession().createSQLQuery(sql);
            int sendSmsEmailId = ((BigDecimal) query.uniqueResult()).intValue();
            StringBuilder sqlSendSmsEmail = new StringBuilder("INSERT INTO SEND_SMS_EMAIL (" + "   SEND_SMS_EMAIL_ID "
                    + " , TYPE" + " , RECEIVE_PHONE_NUMBER " + " , RECEIVE_EMAIL" + " , CREATED_DATE "
                    + " , CREATED_USER_ID" + " , CREATED_GROUP_ID" + " , SUBJECT" + " , CONTENT,status " + " ) VALUES ( "
                    + " :sendSmsEmailId" + " , 1 " + " , :phoneNumber " + " , :email" + " , :createdDate"
                    + " , :createUserId" + " , :createGroupId" + " , :subject " + " , :content,0 " + ")");
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
                    " SELECT ap.NAME name from APP_PARAM ap where ap.par_type = 'CONTENT_SMS_VALUE' and ap.code = :isApprove ");
            SQLQuery queryGetNameCatTask = getSession().createSQLQuery(sqlGetNameCatTask);
            queryGetNameCatTask.addScalar("name", new StringType());
            queryGetNameCatTask.setParameter("isApprove", isApprove);
            List<String> nameListCatTask = queryGetNameCatTask.list();
            if (!nameListCatTask.isEmpty()) {
                nameCatTask = nameListCatTask.get(0);
            }

            StringBuilder strContent = new StringBuilder(nameCatTask);

            if (isApprove == 1l) {
                int i = strContent.indexOf("Y");
                strContent.replace(i, i + 1, String.valueOf(request.getQuantity() / 1000000));
            }

            String name = request.getName() + " cho công trình " + request.getConstructionCode();
            int i = strContent.indexOf("X");
            strContent.replace(i, i + 1, name);
//            if (isApprove == 0l) {
//            	int j=strContent.indexOf("Z");
//            	strContent.replace(i, i + 1, approveDescription);
//            }

            SQLQuery querySms = getSession().createSQLQuery(sqlSendSmsEmail.toString());
            querySms.setParameter("phoneNumber", userDTO.getPhone());
            querySms.setParameter("email", userDTO.getEmail());
            querySms.setParameter("createUserId", user.getVpsUserInfo().getSysUserId());
            querySms.setParameter("createGroupId", user.getVpsUserInfo().getSysGroupId());
            querySms.setParameter("sendSmsEmailId", sendSmsEmailId);
            querySms.setParameter("createdDate", new Date());
            querySms.setParameter("content", strContent.toString());
            querySms.setParameter("subject", nameSubject);
            querySms.executeUpdate();
        }
        return 1;

    }

    public int createSendSmsEmailForMobile(WorkItemDetailDTO request, Long sysUserId, String sysGroupId) {
        String sqlUser = new String("select e.email,e.PHONE_NUMBER phone "
                + " from domain_data a,user_role_data b,user_role c,sys_role d,sys_user e"
                + " where a.domain_data_id = b.DOMAIN_DATA_ID and c.USER_ROLE_ID = b.USER_ROLE_ID"
                + " and c.SYS_ROLE_ID = d.SYS_ROLE_ID and c.SYS_USER_ID=e.SYS_USER_ID and d.code = 'OPERATOR_SMS' "
                + " and a.DATA_ID = :sysGroupId ");
        SQLQuery queryGetSysUser = getSession().createSQLQuery(sqlUser);
        queryGetSysUser.addScalar("email", new StringType());
        queryGetSysUser.addScalar("phone", new StringType());
//        queryGetSysUser.setParameter("sysGroupId", request.getSysGroupId());
        queryGetSysUser.setParameter("sysGroupId", Long.parseLong(sysGroupId));
        queryGetSysUser.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
        List<SysUserDTO> lstUser = queryGetSysUser.list();

        for (SysUserDTO userDTO : lstUser) {
            String sql = new String(" SELECT SEND_SMS_EMAIL_SEQ.nextval FROM DUAL ");
            SQLQuery query = getSession().createSQLQuery(sql);
            int sendSmsEmailId = ((BigDecimal) query.uniqueResult()).intValue();
            StringBuilder sqlSendSmsEmail = new StringBuilder("INSERT INTO SEND_SMS_EMAIL (" + "   SEND_SMS_EMAIL_ID "
                    + " , TYPE" + " , RECEIVE_PHONE_NUMBER " + " , RECEIVE_EMAIL" + " , CREATED_DATE "
                    + " , CREATED_USER_ID" + " , CREATED_GROUP_ID" + " , SUBJECT" + " , CONTENT,status " + " ) VALUES ( "
                    + " :sendSmsEmailId" + " , 1 " + " , :phoneNumber " + " , :email" + " , :createdDate"
                    + " , :createUserId" + " , :createGroupId" + " , :subject " + " , :content,0 " + ")");
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
                    " SELECT ap.NAME name from APP_PARAM ap where ap.par_type = 'CONTENT_SMS_ACCEPT' ");
            SQLQuery queryGetNameCatTask = getSession().createSQLQuery(sqlGetNameCatTask);
            queryGetNameCatTask.addScalar("name", new StringType());
            List<String> nameListCatTask = queryGetNameCatTask.list();
            if (!nameListCatTask.isEmpty()) {
                nameCatTask = nameListCatTask.get(0);
            }

            StringBuilder strContent = new StringBuilder(nameCatTask);

            String name = request.getName() + " cho công trình " + request.getConstructionCode();
            int i = strContent.indexOf("X");
            strContent.replace(i, i + 1, name);

            SQLQuery querySms = getSession().createSQLQuery(sqlSendSmsEmail.toString());
            querySms.setParameter("phoneNumber", userDTO.getPhone());
            querySms.setParameter("email", userDTO.getEmail());
            querySms.setParameter("createUserId", sysUserId);
            querySms.setParameter("createGroupId", sysGroupId);
            querySms.setParameter("sendSmsEmailId", sendSmsEmailId);
            querySms.setParameter("createdDate", new Date());
            querySms.setParameter("content", strContent.toString());
            querySms.setParameter("subject", nameSubject);
            querySms.executeUpdate();
        }
        return 1;
    }

//	chinhpxn20180719_end

    //nhantv 20180820 begin
    public List<WorkItemDTO> getWorkItemForAddingTask(WorkItemDetailDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT T1.WORK_ITEM_ID workItemId, ");
        sql.append("T1.NAME name, ");
        sql.append("T1.CODE code, ");
        sql.append("T1.CONSTRUCTION_ID constructionId, ");
        sql.append("T1.NAME catConstructionTypeName ");
//        hoanm1_20181015_start
        sql.append(",(select name from cat_partner cat where cat.cat_partner_id=T1.CONSTRUCTOR_ID and cat.status=1)partnerName ");
//        hoanm1_20181015_end
        
        sql.append("FROM WORK_ITEM T1 ");
        //VietNT_20190122_start
//        sql.append("WHERE (T1.STATUS = 1 or T1.STATUS = 2)");
        sql.append(" WHERE T1.STATUS != 3 ");
        //VietNT_end
        sql.append(" and T1.CONSTRUCTION_ID = :constructionId ");
        sql.append(" and  work_item_id not in"
                + " (select work_item_id from construction_task a,detail_month_plan b "
                + "where a.DETAIL_MONTH_PLAN_ID=b.DETAIL_MONTH_PLAN_ID and b.status=1 and "
                + "b.sign_state=3 and a.month= :month and a.year= :year and a.construction_id = :constructionId and level_id = 3)");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("workItemId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("constructionId", new LongType());
		query.addScalar("partnerName", new StringType());
        if (obj.getConstructionId() != null)
            query.setParameter("constructionId", obj.getConstructionId());
        else {
            query.setParameter("constructionId", -1L);
        }
        query.setParameter("month", obj.getMonth());
        query.setParameter("year", obj.getYear());

        query.setResultTransformer(Transformers.aliasToBean(WorkItemDTO.class));

        return query.list();
    }
    
    //HuyPQ-20181102-start
    public List<WorkItemDetailDTO> getDataSheetTwoExcel(WorkItemDetailDTO obj, List<String> groupIdList) {
    	StringBuilder sql = new StringBuilder(" with tbl as (select rp.sysgroupname, rp.catprovincecode,rp.WORKITEMNAME,"
    				+ " sum(case when rp.starting_date=trunc(sysdate) and rp.partnername is not null then 1 else 0 end) hm_doitac_ngay,"
    				+ " sum(case when rp.starting_date=trunc(sysdate) and rp.partnername is not null then rp.quantity else 0 end )quantity_doitac_ngay,"
    				+ " sum(case when rp.starting_date=trunc(sysdate) and rp.partnername is null then 1 else 0 end) hm_donvi_ngay,"
    				+ " sum(case when rp.starting_date=trunc(sysdate) and rp.partnername is null then rp.quantity else 0 end )quantity_donvi_ngay,"
    				+ " sum(case when rp.partnername is not null then 1 else 0 end) hm_doitac_thang,"
    				+ " sum(case when rp.partnername is not null then rp.quantity else 0 end )quantity_doitac_thang,"
    				+ " sum(case when rp.partnername is null then 1 else 0 end) hm_donvi_thang,"
    				+ " sum(case when rp.partnername is null then rp.quantity else 0 end )quantity_donvi_thang"
    				+ " from rp_quantity rp" 
    				+ " where 1=1" );
    				if (obj.getDateFrom() != null) {
    					sql.append(" and starting_date >= :monthYearFrom ");
    				}
    				if (obj.getDateTo() != null) {
    					sql.append(" and starting_date <= :monthYearTo ");
    				}
    		        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
    		            sql.append(" AND (upper(cntContractCode) LIKE upper(:keySearch) OR  upper(constructionCode) LIKE upper(:keySearch) OR upper(catstationCode) LIKE upper(:keySearch) escape '&')");
    		        }

    		        if (obj.getSysGroupId() != null) {
    		            sql.append(" AND SYS_GROUP_ID  = :sysGroupId");
    		        }
    		        if (groupIdList != null && !groupIdList.isEmpty()) {
    		            sql.append(" and catProvinceId in :groupIdList ");
    		        }
    		        if (obj.getCatProvinceId() != null) {
    		            sql.append(" AND catProvinceId = :catProvinceId ");
    		        }
    		        sql.append( " group by rp.sysgroupname,rp.catprovincecode,rp.WORKITEMNAME),"
    				+ " tbl1 as(select 2 type,sysgroupname,''loctinh, catprovincecode,WORKITEMNAME,hm_doitac_ngay,quantity_doitac_ngay,hm_donvi_ngay,quantity_donvi_ngay,"
    				+ " hm_doitac_ngay + hm_donvi_ngay hm_tong_ngay,quantity_doitac_ngay + quantity_donvi_ngay quantity_tong_ngay,"
    				+ " hm_doitac_thang,quantity_doitac_thang,hm_donvi_thang,quantity_donvi_thang,"
    				+ " hm_doitac_thang + hm_donvi_thang hm_tong_thang,quantity_doitac_thang+quantity_donvi_thang quantity_tong_thang"
    				+ " from tbl"
    				+ " union all"
    				+ " select 1 type,sysgroupname,catprovincecode loctinh, catprovincecode,catprovincecode WORKITEMNAME,sum(hm_doitac_ngay)hm_doitac_ngay,sum(quantity_doitac_ngay)quantity_doitac_ngay,"
    				+ " sum(hm_donvi_ngay)hm_donvi_ngay,sum(quantity_donvi_ngay)quantity_donvi_ngay,"
    				+ " sum(hm_doitac_ngay) + sum(hm_donvi_ngay) hm_tong_ngay,sum(quantity_doitac_ngay) + sum(quantity_donvi_ngay) quantity_tong_ngay,"
    				+ " sum(hm_doitac_thang)hm_doitac_thang,"
    				+ " sum(quantity_doitac_thang)quantity_doitac_thang,sum(hm_donvi_thang)hm_donvi_thang,sum(quantity_donvi_thang)quantity_donvi_thang,"
    				+ " sum(hm_doitac_thang) + sum(hm_donvi_thang) hm_tong_thang,sum(quantity_doitac_thang) + sum(quantity_donvi_thang) quantity_tong_thang"
    				+ " from tbl group by sysgroupname,catprovincecode"
    				+ " union all"
    				+ " select 0 type,''sysgroupname,'All tỉnh' loctinh, '' catprovincecode,'' WORKITEMNAME,sum(hm_doitac_ngay)hm_doitac_ngay,sum(quantity_doitac_ngay)quantity_doitac_ngay,"
    				+ " sum(hm_donvi_ngay)hm_donvi_ngay,sum(quantity_donvi_ngay)quantity_donvi_ngay,"
    				+ " sum(hm_doitac_ngay) + sum(hm_donvi_ngay) hm_tong_ngay,sum(quantity_doitac_ngay) + sum(quantity_donvi_ngay) quantity_tong_ngay,"
    				+ " sum(hm_doitac_thang)hm_doitac_thang,"
    				+ " sum(quantity_doitac_thang)quantity_doitac_thang,sum(hm_donvi_thang)hm_donvi_thang,sum(quantity_donvi_thang)quantity_donvi_thang,"
    				+ " sum(hm_doitac_thang) + sum(hm_donvi_thang) hm_tong_thang,sum(quantity_doitac_thang) + sum(quantity_donvi_thang) quantity_tong_thang"
    				+ " from tbl )"
    				+ " select type deployType,sysgroupname sysGroupName,loctinh fillCatProvince,catprovincecode catProvinceCode,WORKITEMNAME workItemName,"
    				+ " hm_doitac_ngay workItemPartDay,quantity_doitac_ngay quantityPartDay,hm_donvi_ngay workItemConsDay,quantity_donvi_ngay quantityConsDay,hm_tong_ngay workItemSumDay,quantity_tong_ngay quantitySumDay,"
    				+ " hm_doitac_thang workItemPartMonth,quantity_doitac_thang quantityPartMonth,hm_donvi_thang workItemConsMonth,quantity_donvi_thang quantityConsMonth,hm_tong_thang workItemSumMonth,quantity_tong_thang quantitySumMonth"
    				+ " from tbl1 order by sysgroupname,catprovincecode,type ");
    	SQLQuery query=getSession().createSQLQuery(sql.toString());
    	 if (groupIdList != null && !groupIdList.isEmpty()) {
             query.setParameterList("groupIdList", groupIdList);
         }
         if (StringUtils.isNotEmpty(obj.getKeySearch())) {
             query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
         }
         if (obj.getSysGroupId() != null) {
             query.setParameter("sysGroupId", obj.getSysGroupId());
         }
         if (obj.getDateFrom() != null) {
             query.setParameter("monthYearFrom", obj.getDateFrom());
         }
         if (obj.getDateTo() != null) {
             query.setParameter("monthYearTo", obj.getDateTo());
         }
         if (obj.getCatProvinceId() != null) {
             query.setParameter("catProvinceId", obj.getCatProvinceId());
         }
    	query.addScalar("deployType", new StringType());
    	query.addScalar("sysGroupName", new StringType());
    	query.addScalar("fillCatProvince", new StringType());
    	query.addScalar("catProvinceCode", new StringType());
    	query.addScalar("workItemName", new StringType());
    	query.addScalar("workItemPartDay", new LongType());
    	query.addScalar("quantityPartDay", new DoubleType());
    	query.addScalar("workItemConsDay", new LongType());
    	query.addScalar("quantityConsDay", new DoubleType());
    	query.addScalar("workItemSumDay", new LongType());
    	query.addScalar("quantitySumDay", new DoubleType());
    	query.addScalar("workItemPartMonth", new LongType());
    	query.addScalar("quantityPartMonth", new DoubleType());
    	query.addScalar("workItemConsMonth", new LongType());
    	query.addScalar("quantityConsMonth", new DoubleType());
    	query.addScalar("workItemSumMonth", new LongType());
    	query.addScalar("quantitySumMonth", new DoubleType());
    	query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
    	return query.list();
    }
    //HuyPQ-20181102-end
//    hoanm1_20181113_start
    public void approveRpQuantity(WorkItemDetailDTO obj) {
        StringBuilder sbquery = new StringBuilder();
        sbquery.append(" UPDATE ");
        sbquery.append(" rp_quantity");
        sbquery.append(" SET ");
        sbquery.append(" QUANTITY = :quantity   ");
        sbquery.append(" WHERE ");
        sbquery.append(" workItemId = :workItemId and to_char(starting_date,'dd/MM/yyyy') =:startDate ");
        SQLQuery query = getSession().createSQLQuery(sbquery.toString());
        query.setParameter("quantity", obj.getQuantity()/1000000);
        query.setParameter("workItemId", obj.getWorkItemId());
        query.setParameter("startDate", obj.getDateComplete());
        query.executeUpdate();
    }
    public void rejectRpQuantity(WorkItemDetailDTO obj) {
        StringBuilder sbquery = new StringBuilder();
        sbquery.append(" UPDATE ");
        sbquery.append(" rp_quantity");
        sbquery.append(" SET ");
        sbquery.append(" QUANTITY = null,status=2   ");
        sbquery.append(" WHERE ");
        sbquery.append(" workItemId = :workItemId and to_char(starting_date,'dd/MM/yyyy') =:startDate ");
        SQLQuery query = getSession().createSQLQuery(sbquery.toString());
        query.setParameter("workItemId", obj.getWorkItemId());
        query.setParameter("startDate", obj.getDateComplete());
        query.executeUpdate();
    }
    public void rejectListRpQuantity(List<String> workItemDetailList) {
        StringBuilder sbquery = new StringBuilder();
        sbquery.append(" UPDATE ");
        sbquery.append(" rp_quantity");
        sbquery.append(" SET ");
        sbquery.append(" QUANTITY = null,status=2   ");
        sbquery.append(" WHERE ");
        sbquery.append(" workItemId in :workItemId ");
        SQLQuery query = getSession().createSQLQuery(sbquery.toString());
        query.setParameterList("workItemId", workItemDetailList);
        query.executeUpdate();
    }
//    hoanm1_20181113_end
}
