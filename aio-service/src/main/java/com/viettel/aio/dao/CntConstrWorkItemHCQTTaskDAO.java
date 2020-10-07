package com.viettel.aio.dao;

import com.viettel.aio.bo.CntAppendixJobBO;
import com.viettel.aio.dto.*;
import com.viettel.service.base.dao.BaseFWDAOImpl;
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
 * @author HIENVD
 */
@Repository("cntConstrWorkItemHCQTTaskDAO")
public class CntConstrWorkItemHCQTTaskDAO extends BaseFWDAOImpl<CntAppendixJobBO, Long> {

    public CntConstrWorkItemHCQTTaskDAO() {
        this.model = new CntAppendixJobBO();
    }

    public CntConstrWorkItemHCQTTaskDAO(Session session) {
        this.session = session;
    }


    public List<CntAppendixJobDTO> doSearch() {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append("T1.CAT_UNIT_ID catUnitId ");
        stringBuilder.append(",T1.CAT_TASK_ID catTaskId ");
        stringBuilder.append(",T1.WORK_ITEM_TYPE_ID workItemTypeId ");
        stringBuilder.append(",T1.WORK_ITEM_ID workItemId ");
        stringBuilder.append(",T1.STATUS status ");
        stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
        stringBuilder.append(",T1.CNT_CONSTR_WORK_ITEM_TASK_HCQT_ID cntWorkItemTaskHSQTId ");
        stringBuilder.append(",T1.CAT_TASK_NAME catTaskName ");
        stringBuilder.append("FROM CNT_CONSTR_WORK_ITEM_TASK_HCQT T1 ");
        stringBuilder.append("WHERE 1=1 AND T1.STATUS != 0 ");
        stringBuilder.append("ORDER BY CNT_CONSTR_WORK_ITEM_TASK_HCQT_ID DESC");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("catUnitId", new LongType());
        query.addScalar("catTaskId", new LongType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("workItemTypeId", new LongType());
        query.addScalar("status", new LongType());
        query.addScalar("cntContractId", new LongType());
        query.addScalar("cntWorkItemTaskHSQTId", new LongType());
        query.addScalar("catTaskName", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(CntAppendixJobDTO.class));
        return query.list();
    }

    public List<CntAppendixJobDTO> doSearchAppendixJob(CntAppendixJobDTO criteria) {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append("T1.STATUS status ");
        stringBuilder.append(",T1.DESCRIPTION description ");
        stringBuilder.append(",T1.PRICE price ");
        stringBuilder.append(",T1.QUANTITY quantity ");
        stringBuilder.append(",T1.CAT_UNIT_ID catUnitId ");
        stringBuilder.append(",T1.CAT_TASK_ID catTaskId ");
        stringBuilder.append(",T1.WORK_ITEM_ID workItemId ");
        stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
        stringBuilder.append(",T1.CNT_CONSTR_WORK_ITEM_TASK_HCQT_ID cntWorkItemTaskHSQTId ");
        stringBuilder.append(",T1.WORK_ITEM_NAME workItemName ");
        stringBuilder.append(",T1.WORK_ITEM_CODE workItemCode ");
        stringBuilder.append(",T1.WORK_ITEM_TYPE_NAME workItemTypeName ");
        stringBuilder.append(",T1.WORK_ITEM_TYPE_ID workItemTypeId ");
        stringBuilder.append(",T1.CAT_TASK_NAME catTaskName ");
        stringBuilder.append(",T1.CAT_TASK_CODE catTaskCode ");
        stringBuilder.append(",T1.CREATED_DATE createdDate ");
        stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
        stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
        stringBuilder.append(",T1.CAT_UNIT_NAME catUnitName ");
        stringBuilder.append("FROM CNT_CONSTR_WORK_ITEM_TASK_HCQT T1 ");

        stringBuilder.append("WHERE 1=1 AND T1.STATUS != 0 ");
        if (null != criteria.getKeySearch()) {
            stringBuilder.append(" AND (UPPER(T1.WORK_ITEM_TYPE_NAME) like UPPER(:key) ");
            stringBuilder.append(" OR UPPER(T1.WORK_ITEM_NAME) like UPPER(:key) OR UPPER(T1.CAT_TASK_NAME) like UPPER(:key) escape '&')");
        }
        if (null != criteria.getCntContractId()) {
            stringBuilder.append("AND T1.CNT_CONTRACT_ID = :cntContractId ");
        }

        stringBuilder.append("ORDER BY CNT_CONSTR_WORK_ITEM_TASK_HCQT_ID DESC");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(stringBuilder.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("status", new LongType());
        query.addScalar("description", new StringType());
        query.addScalar("price", new DoubleType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("catUnitId", new LongType());
        query.addScalar("catTaskId", new LongType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("cntContractId", new LongType());
        query.addScalar("cntWorkItemTaskHSQTId", new LongType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("workItemCode", new StringType());
        query.addScalar("catUnitName", new StringType());
        query.addScalar("catTaskName", new StringType());
        query.addScalar("catTaskCode", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("workItemTypeName", new StringType());
        query.addScalar("workItemTypeId", new LongType());
        if (null != criteria.getCntContractId()) {
            query.setParameter("cntContractId", criteria.getCntContractId());
            queryCount.setParameter("cntContractId", criteria.getCntContractId());
        }

        if (null != criteria.getKeySearch()) {
            query.setParameter("key", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
        }

        query.setResultTransformer(Transformers
                .aliasToBean(CntAppendixJobDTO.class));
        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1)
                    * criteria.getPageSize().intValue());
            query.setMaxResults(criteria.getPageSize().intValue());
        }
        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<CntAppendixJobDTO> checkValidateHCQT(CntAppendixJobDTO criteria) {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append("T1.WORK_ITEM_TYPE_ID workItemTypeId ");
        stringBuilder.append("FROM CNT_CONSTR_WORK_ITEM_TASK_HCQT T1 ");
        stringBuilder.append("WHERE 1=1 AND T1.STATUS != 0 ");
        if (null != criteria.getCntContractId()) {
            stringBuilder.append("AND T1.CNT_CONTRACT_ID = :cntContractId ");
        }

        //loai hang muc
        if (null != criteria.getWorkItemTypeId()) {
            stringBuilder.append("AND T1.WORK_ITEM_TYPE_ID = :workItemTypeId ");
        }
        //hang muc
        if (null != criteria.getWorkItemId()) {
            stringBuilder.append("AND T1.WORK_ITEM_ID = :workItemId ");
        }
        //cong viec
        if (null != criteria.getCatTaskId()) {
            stringBuilder.append("AND T1.CAT_TASK_ID = :catTaskId ");
        }
        stringBuilder.append("ORDER BY CNT_CONSTR_WORK_ITEM_TASK_HCQT_ID");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("workItemTypeId", new LongType());

        if (null != criteria.getCntContractId()) {  //id hop dong
            query.setParameter("cntContractId", criteria.getCntContractId());
        }
        if (null != criteria.getWorkItemTypeId()) {    //id loai hang muc
            query.setParameter("workItemTypeId", criteria.getWorkItemTypeId());
        }
        if (null != criteria.getWorkItemId()) { //id hang muc
            query.setParameter("workItemId", criteria.getWorkItemId());
        }
        if (null != criteria.getCatTaskId()) { //id cong viec
            query.setParameter("catTaskId", criteria.getCatTaskId());
        }
        query.setResultTransformer(Transformers.aliasToBean(CntAppendixJobDTO.class));
        return query.list();
    }


    //hienvd: check va lay gia gia tri ten ma hang muc id ma hang muc tu ten loai hang muc
//	public WorkItemTypeHCQTDTO checkExitInWorkItemType(CntAppendixJobDTO obj) {
//		StringBuilder sql = new StringBuilder("Select "
//				+ "T1.WORK_ITEM_TYPE_NAME workItemTypeName, "
//				+ "T1.WORK_ITEM_TYPE_ID workItemTypeId "
//				+ " FROM WORK_ITEM_TYPE_HCQT T1");
//		sql.append(" WHERE UPPER(T1.WORK_ITEM_TYPE_NAME) = UPPER(:workItemTypeName) AND T1.STATUS != 0" );
//		SQLQuery query= getSession().createSQLQuery(sql.toString());
//		query.addScalar("workItemTypeName", new StringType());
//		query.addScalar("workItemTypeId", new LongType());
//		query.setParameter("workItemTypeName", obj.getWorkItemTypeName());
//		query.setResultTransformer(Transformers.aliasToBean(WorkItemTypeHCQTDTO.class));
//		return (WorkItemTypeHCQTDTO) query.uniqueResult();
//	}
//	//hienvd: check va lay gia gia tri ten ma hang muc, id ma hang muc, ma hang muc tu ten hang muc
//	public WorkItemHCQTDTO checkExitInWorkItem(CntAppendixJobDTO obj) {
//		StringBuilder sql = new StringBuilder("Select "
//				+ "T1.WORK_ITEM_ID workItemId, "
//				+ "T1.WORK_ITEM_NAME workItemName, "
//				+ "T1.WORK_ITEM_CODE workItemCode "
//				+ " FROM WORK_ITEM_HCQT T1");
//		sql.append(" WHERE UPPER(T1.WORK_ITEM_NAME) = UPPER(:workItemName) AND T1.STATUS != 0" );
//		sql.append(" AND T1.WORK_ITEM_TYPE_ID = :workItemTypeId " );
//		SQLQuery query= getSession().createSQLQuery(sql.toString());
//		query.addScalar("workItemCode", new StringType());
//		query.addScalar("workItemId", new LongType());
//		query.addScalar("workItemName", new StringType());
//		query.setParameter("workItemName", obj.getWorkItemName());
//		query.setParameter("workItemTypeId", obj.getWorkItemTypeId());
//		query.setResultTransformer(Transformers.aliasToBean(WorkItemHCQTDTO.class));
//		return (WorkItemHCQTDTO) query.uniqueResult();
//	}
//
//	//hienvd: check va lay gia gia tri ten cong viec, id cong viec, ma cong viec tu ten cong viec
//	public CatTaskHCQTDTO checkExitInCatTask(CntAppendixJobDTO obj) {
//		StringBuilder sql = new StringBuilder("Select "
//				+ "T1.CAT_TASK_CODE catTaskCode, "
//				+ "T1.CAT_TASK_ID catTaskId, "
//				+ "T1.CAT_TASK_NAME catTaskName "
//				+ " FROM CAT_TASK_HCQT T1");
//		sql.append(" WHERE UPPER(T1.CAT_TASK_NAME) = UPPER(:catTaskName) AND T1.STATUS != 0" );
//		sql.append(" AND T1.WORK_ITEM_ID = :workItemId" );
//		SQLQuery query= getSession().createSQLQuery(sql.toString());
//		query.addScalar("catTaskCode", new StringType());
//		query.addScalar("catTaskId", new LongType());
//		query.addScalar("catTaskName", new StringType());
//		query.setParameter("catTaskName", obj.getCatTaskName());
//		query.setParameter("workItemId", obj.getWorkItemId());
//
//		query.setResultTransformer(Transformers.aliasToBean(CatTaskHCQTDTO.class));
//		return (CatTaskHCQTDTO) query.uniqueResult();
//	}
//
    public CntContractDTO getInfoContract(CntAppendixJobDTO obj) {
        StringBuilder sql = new StringBuilder("Select "
                + "code code "
                + " FROM CNT_CONTRACT T1");
        sql.append(" WHERE UPPER(T1.CNT_CONTRACT_ID) = UPPER(:cntContractId) AND T1.STATUS != 0");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("code", new StringType());
        query.setParameter("cntContractId", obj.getCntContractId());
        query.setResultTransformer(Transformers.aliasToBean(CntContractDTO.class));
        return (CntContractDTO) query.uniqueResult();
    }

    public List<WorkItemHCQTDTO> checkValidateWorkInWorkType() {
        StringBuilder sql = new StringBuilder("select b.WORK_ITEM_Id workItemId, a.WORK_ITEM_TYPE_NAME||'/'||b.WORK_ITEM_NAME workItemName "
                + " FROM WORK_ITEM_TYPE_HCQT a, WORK_ITEM_HCQT b ");
        sql.append(" WHERE a.WORK_ITEM_TYPE_ID = b.WORK_ITEM_TYPE_ID");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("workItemId", new LongType());
        query.addScalar("workItemName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(WorkItemHCQTDTO.class));
        return query.list();

    }

    public List<CatTaskHCQTDTO> checkValidateCatInWorkItem() {
        StringBuilder sql = new StringBuilder("select a.CAT_TASK_ID catTaskId, b.WORK_ITEM_NAME||'/'||a.CAT_TASK_NAME catTaskName "
                + " FROM CAT_TASK_HCQT a, WORK_ITEM_HCQT b ");
        sql.append(" WHERE a.WORK_ITEM_ID = b.WORK_ITEM_ID");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("catTaskId", new LongType());
        query.addScalar("catTaskName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(CatTaskHCQTDTO.class));
        return query.list();
    }

    //	//Huypq-20190827-start
    public List<CntAppendixJobDTO> getDataExportFileTemplate() {
        StringBuilder sql = new StringBuilder("select wit.WORK_ITEM_TYPE_NAME workItemTypeName, " +
                " wi.WORK_ITEM_NAME workItemName, " +
                " task.CAT_TASK_NAME catTaskName " +
                " from WORK_ITEM_TYPE_HCQT wit " +
                " left join WORK_ITEM_HCQT wi on wit.WORK_ITEM_TYPE_ID = wi.WORK_ITEM_TYPE_ID " +
                " left join CAT_TASK_HCQT task on task.WORK_ITEM_ID = wi.WORK_ITEM_ID " +
                " where wit.STATUS=1 " +
                " and wi.STATUS=1 " +
                " and task.STATUS=1 " +
                " order by wit.WORK_ITEM_TYPE_NAME asc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("workItemTypeName", new StringType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("catTaskName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(CntAppendixJobDTO.class));

        return query.list();
    }

    public List<CatUnitDTO> getAllCatUnit() {
        StringBuilder sql = new StringBuilder("select CODE code," +
                "NAME name " +
                " from CTCT_CAT_OWNER.CAT_UNIT where status=1");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(CatUnitDTO.class));

        return query.list();
    }
    //huy-end
}
