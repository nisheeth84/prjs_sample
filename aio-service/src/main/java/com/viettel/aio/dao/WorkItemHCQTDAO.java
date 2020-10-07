package com.viettel.aio.dao;

import com.viettel.aio.bo.WorkItemHCQTBO;
import com.viettel.aio.dto.WorkItemHCQTDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author HIENVD
 */
@Repository("workItemHCQTDAO")
public class WorkItemHCQTDAO extends BaseFWDAOImpl<WorkItemHCQTBO, Long> {

    public WorkItemHCQTDAO() {
        this.model = new WorkItemHCQTBO();
    }

    public WorkItemHCQTDAO(Session session) {
        this.session = session;
    }

    public StringBuilder getSelectAllQuery() {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append("T1.WORK_ITEM_ID workItemId ");
        stringBuilder.append(",T1.WORK_ITEM_CODE workItemCode ");
        stringBuilder.append(",T1.WORK_ITEM_NAME workItemName ");
        stringBuilder.append(",T1.STATUS status ");
        stringBuilder.append("FROM WORK_ITEM_HCQT T1 ");
        return stringBuilder;
    }


    @SuppressWarnings("unchecked")
    public List<WorkItemHCQTDTO> doSearch(WorkItemHCQTDTO criteria) {
        StringBuilder stringBuilder = getSelectAllQuery();
        stringBuilder.append("WHERE 1=1 AND STATUS = 1 ");
        if (null != criteria.getWorkItemTypeId()) {
            stringBuilder.append(" AND T1.WORK_ITEM_TYPE_ID = :workItemTypeId ");
        }
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            stringBuilder
                    .append(" AND (UPPER(T1.WORK_ITEM_CODE) like UPPER(:key) OR UPPER(T1.WORK_ITEM_NAME) like UPPER(:key) escape '&')");
        }
        stringBuilder.append(" ORDER BY T1.WORK_ITEM_ID desc");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(stringBuilder.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        query.addScalar("workItemId", new LongType());
        query.addScalar("workItemCode", new StringType());
        query.addScalar("workItemName", new StringType());
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("key", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
        }
        query.setResultTransformer(Transformers.aliasToBean(WorkItemHCQTDTO.class));
        if (null != criteria.getWorkItemTypeId()) {
            query.setParameter("workItemTypeId", criteria.getWorkItemTypeId());
            queryCount.setParameter("workItemTypeId", criteria.getWorkItemTypeId());
        }
        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1)
                    * criteria.getPageSize().intValue());
            query.setMaxResults(criteria.getPageSize().intValue());
        }
        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<WorkItemHCQTDTO> getForAutoComplete(WorkItemHCQTDTO obj) {
        StringBuilder stringBuilder = getSelectAllQuery();
        stringBuilder.append(" Where STATUS != 0");
        stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=10" : "");
        if (null != obj.getWorkItemTypeId()) {
            stringBuilder.append(" AND T1.WORK_ITEM_TYPE_ID = :workItemTypeId ");
        }
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            stringBuilder
                    .append(" AND (UPPER(T1.WORK_ITEM_CODE) like UPPER(:key) OR UPPER(T1.WORK_ITEM_NAME) like UPPER(:key) escape '&')");
        }
        stringBuilder.append(" ORDER BY T1.WORK_ITEM_ID");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("workItemId", new LongType());
        query.addScalar("workItemCode", new StringType());
        query.addScalar("workItemName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(WorkItemHCQTDTO.class));
        if (null != obj.getWorkItemTypeId()) {
            query.setParameter("workItemTypeId", obj.getWorkItemTypeId());
        }
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("key", "%" + obj.getKeySearch() + "%");
        }
        query.setMaxResults(20);
        return query.list();

    }

	public List<WorkItemHCQTDTO> doSearchWorkItem(WorkItemHCQTDTO obj){
    	StringBuilder sql = new StringBuilder(" select ");
    	sql.append(" wih.WORK_ITEM_ID workItemId, ")
    	.append(" wih.WORK_ITEM_CODE workItemCode, ")
    	.append(" wih.WORK_ITEM_NAME workItemName, ")
    	.append(" wih.WORK_ITEM_TYPE_ID workItemTypeId, ")
    	.append(" wih.STATUS status, ")
    	.append(" withs.WORK_ITEM_TYPE_CODE workItemTypeCode, ")
    	.append(" withs.WORK_ITEM_TYPE_NAME workItemTypeName ")
    	.append(" from WORK_ITEM_HCQT wih ")
    	.append(" left join WORK_ITEM_TYPE_HCQT withs on wih.WORK_ITEM_TYPE_ID = withs.WORK_ITEM_TYPE_ID ")
    	.append(" where 1=1 ");

    	if(StringUtils.isNotBlank(obj.getKeySearch())) {
    		sql.append(" AND (UPPER(wih.WORK_ITEM_CODE) like (:keySearch) "
    				+ " OR UPPER(wih.WORK_ITEM_NAME) LIKE (:keySearch) "
    				+ " OR UPPER(withs.WORK_ITEM_TYPE_NAME) LIKE (:keySearch) escape '&') ");
    	}

    	if(obj.getStatus()!=null) {
    		sql.append(" AND wih.status = :status ");
    	}
    	sql.append(" ORDER BY wih.WORK_ITEM_ID DESC ");
    	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");

		SQLQuery query= getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());

    	query.addScalar("workItemId", new LongType());
    	query.addScalar("workItemCode", new StringType());
    	query.addScalar("workItemName", new StringType());
    	query.addScalar("workItemTypeId", new LongType());
    	query.addScalar("status", new LongType());
    	query.addScalar("workItemTypeCode", new StringType());
    	query.addScalar("workItemTypeName", new StringType());
    	query.setResultTransformer(Transformers.aliasToBean(WorkItemHCQTDTO.class));

    	if(StringUtils.isNotBlank(obj.getKeySearch())) {
    		query.setParameter("keySearch", "%" + obj.getKeySearch().toUpperCase() + "%");
    		queryCount.setParameter("keySearch", "%" + obj.getKeySearch().toUpperCase() + "%");
    	}

    	if(obj.getStatus()!=null) {
    		query.setParameter("status", obj.getStatus());
    		queryCount.setParameter("status", obj.getStatus());
    	}

    	if (obj.getPage() != null && obj.getPageSize() != null) {
    		query.setFirstResult((obj.getPage().intValue()-1)*obj.getPageSize().intValue());
    		query.setMaxResults(obj.getPageSize().intValue());
    	}
    	obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

    	return query.list();
    }
//
//    public List<WorkItemHCQTDTO> getAutoCompleteWorkItem(WorkItemHCQTDTO obj){
//    	StringBuilder sql = new StringBuilder(" select ");
//    	sql.append(" wih.WORK_ITEM_ID workItemId, ")
//    	.append(" wih.WORK_ITEM_CODE workItemCode, ")
//    	.append(" wih.WORK_ITEM_NAME workItemName, ")
//    	.append(" wih.WORK_ITEM_TYPE_ID workItemTypeId, ")
//    	.append(" wih.STATUS status, ")
//    	.append(" withs.WORK_ITEM_TYPE_CODE workItemTypeCode, ")
//    	.append(" withs.WORK_ITEM_TYPE_NAME workItemTypeName ")
//    	.append(" from WORK_ITEM_HCQT wih ")
//    	.append(" left join WORK_ITEM_TYPE_HCQT withs on wih.WORK_ITEM_TYPE_ID = withs.WORK_ITEM_TYPE_ID ")
//    	.append(" where 1=1 ");
//
//    	if(StringUtils.isNotBlank(obj.getKeySearch())) {
//    		sql.append(" AND (UPPER(wih.WORK_ITEM_CODE) like (:keySearch) "
//    				+ " OR UPPER(wih.WORK_ITEM_NAME) LIKE (:keySearch) "
//    				+ " OR UPPER(withs.WORK_ITEM_TYPE_NAME) LIKE (:keySearch) escape '&') ");
//    	}
//
//    	sql.append(" AND wih.status = 1 ");
//    	sql.append(" AND ROWNUM <= 10");
//    	sql.append(" ORDER BY wih.WORK_ITEM_ID DESC ");
//
//		SQLQuery query= getSession().createSQLQuery(sql.toString());
//
//    	query.addScalar("workItemId", new LongType());
//    	query.addScalar("workItemCode", new StringType());
//    	query.addScalar("workItemName", new StringType());
//    	query.addScalar("workItemTypeId", new LongType());
//    	query.addScalar("status", new LongType());
//    	query.addScalar("workItemTypeCode", new StringType());
//    	query.addScalar("workItemTypeName", new StringType());
//    	query.setResultTransformer(Transformers.aliasToBean(WorkItemHCQTDTO.class));
//
//    	if(StringUtils.isNotBlank(obj.getKeySearch())) {
//    		query.setParameter("keySearch", "%" + obj.getKeySearch().toUpperCase() + "%");
//    	}
//
//    	return query.list();
//    }
//
//    public List<WorkItemHCQTDTO> checkWorkItemExit(WorkItemHCQTDTO obj) {
//
//		StringBuilder stringBuilder = new StringBuilder("SELECT ");
//		stringBuilder.append("T1.WORK_ITEM_ID workItemId ");
//		stringBuilder.append("FROM WORK_ITEM_HCQT T1 ");
//
//		if(StringUtils.isNotBlank(obj.getWorkItemCode())) {
//			stringBuilder.append(" WHERE T1.STATUS != 0 AND T1.WORK_ITEM_CODE = :workItemCode");
//		}
//
//		SQLQuery query= getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("workItemId", new LongType());
//
//		if(StringUtils.isNotBlank(obj.getWorkItemCode())) {
//			query.setParameter("workItemCode", obj.getWorkItemCode());
//		}
//
//		return query.list();
//    }
}
