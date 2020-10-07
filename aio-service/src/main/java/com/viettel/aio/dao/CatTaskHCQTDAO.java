package com.viettel.aio.dao;

import com.viettel.aio.bo.CatTaskHCQTBO;
import com.viettel.aio.dto.CatTaskHCQTDTO;
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
@Repository("catTaskHCQTDAO")
public class CatTaskHCQTDAO extends BaseFWDAOImpl<CatTaskHCQTBO, Long> {

    public CatTaskHCQTDAO() {
        this.model = new CatTaskHCQTBO();
    }

    public CatTaskHCQTDAO(Session session) {
        this.session = session;
    }

	public StringBuilder getSelectAllQuery(){
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CAT_TASK_ID catTaskId ");
		stringBuilder.append(",T1.CAT_TASK_CODE catTaskCode ");
		stringBuilder.append(",T1.CAT_TASK_NAME catTaskName ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.PRIORITY_TASK priorityTask ");  //Huypq-20190815-add
		stringBuilder.append("FROM CAT_TASK_HCQT T1 ");
		return stringBuilder;
	}

	public List<CatTaskHCQTDTO> getForAutoComplete(CatTaskHCQTDTO obj) {
		StringBuilder stringBuilder = getSelectAllQuery();
		stringBuilder.append(" Where STATUS != 0");

		if (null != obj.getWorkItemId()) {
			stringBuilder.append(" AND T1.WORK_ITEM_ID = :workItemId ");
		}

		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			stringBuilder
					.append(" AND (UPPER(T1.CAT_TASK_CODE) like UPPER(:key) OR UPPER(T1.CAT_TASK_NAME) like UPPER(:key) escape '&')");
		}
		stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=10" : "");

		stringBuilder.append(" ORDER BY T1.CAT_TASK_ID");
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		query.addScalar("catTaskId", new LongType());
		query.addScalar("catTaskCode", new StringType());
		query.addScalar("catTaskName", new StringType());
		query.setResultTransformer(Transformers.aliasToBean(CatTaskHCQTDTO.class));

		if (null != obj.getWorkItemId()) {
			query.setParameter("workItemId", obj.getWorkItemId());
		}
		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			query.setParameter("key", "%" + obj.getKeySearch() + "%");
		}
		query.setMaxResults(20);
		return query.list();
	}

	public List<CatTaskHCQTDTO> doSearch(CatTaskHCQTDTO criteria) {
		StringBuilder stringBuilder = getSelectAllQuery();
		stringBuilder.append("WHERE 1=1 AND STATUS = 1 ");
		if (null != criteria.getWorkItemId()) {
			stringBuilder.append(" AND T1.WORK_ITEM_ID = :workItemId ");
		}

		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			stringBuilder
					.append(" AND (UPPER(T1.CAT_TASK_CODE) like UPPER(:key) OR UPPER(T1.CAT_TASK_NAME) like UPPER(:key) escape '&')");
		}
		stringBuilder.append(" ORDER BY T1.CAT_TASK_ID desc");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		query.addScalar("catTaskId", new LongType());
		query.addScalar("catTaskCode", new StringType());
		query.addScalar("catTaskName", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("priorityTask", new StringType());  //Huypq-20190815-add
		
		if (null != criteria.getWorkItemId()) {
			query.setParameter("workItemId", criteria.getWorkItemId());
			queryCount.setParameter("workItemId", criteria.getWorkItemId());
		}
		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			query.setParameter("key", "%" + criteria.getKeySearch() + "%");
			queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
		}
		query.setResultTransformer(Transformers.aliasToBean(CatTaskHCQTDTO.class));

		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1)
					* criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}
	
	public List<CatTaskHCQTDTO> doSearchCatTask(CatTaskHCQTDTO obj){
    	StringBuilder sql = new StringBuilder(" Select ");
    	sql.append(" cth.CAT_TASK_ID catTaskId, ")
    		.append(" cth.CAT_TASK_CODE catTaskCode, ")
    		.append(" cth.CAT_TASK_NAME catTaskName, ")
    		.append(" cth.WORK_ITEM_ID workItemId, ")
    		.append(" cth.STATUS status, ")
    		.append(" cth.PRIORITY_TASK priorityTask, ") //Huypq-20190815-add
    		.append(" wih.WORK_ITEM_NAME workItemName ")
    		.append(" FROM CAT_TASK_HCQT cth left join WORK_ITEM_HCQT wih ")
    		.append(" ON cth.WORK_ITEM_ID = wih.WORK_ITEM_ID ")
    		.append(" Where 1=1 ");
    	if(StringUtils.isNotBlank(obj.getKeySearch())) {
    		sql.append(" AND (UPPER(cth.CAT_TASK_CODE) LIKE (:keySearch) ");
    		sql.append(" OR UPPER(cth.CAT_TASK_NAME) LIKE (:keySearch) ");
    		sql.append(" OR UPPER(wih.WORK_ITEM_NAME) LIKE (:keySearch) escape '&') ");
    	}
    	if(obj.getStatus()!=null) {
    		sql.append(" AND cth.status = :status ");
    	}
    	sql.append(" ORDER BY cth.CAT_TASK_ID DESC ");
    	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		
		SQLQuery query= getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());
		
		query.addScalar("catTaskId", new LongType());
		query.addScalar("catTaskCode", new StringType());
		query.addScalar("catTaskName", new StringType());
		query.addScalar("workItemId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("workItemName", new StringType());
		query.addScalar("priorityTask", new StringType()); //Huypq-20190815-add
		
		query.setResultTransformer(Transformers.aliasToBean(CatTaskHCQTDTO.class));
    	
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

    public List<CatTaskHCQTDTO> checkCatTaskExit(CatTaskHCQTDTO obj) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CAT_TASK_ID catTaskId ");
		stringBuilder.append("FROM CAT_TASK_HCQT T1 WHERE T1.STATUS != 0 ");
		if(StringUtils.isNotEmpty(obj.getCatTaskCode())){
			stringBuilder.append(" AND CAT_TASK_CODE = :catTaskCode");
		}
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		query.addScalar("catTaskId", new LongType());
		query.setResultTransformer(Transformers
				.aliasToBean(CatTaskHCQTDTO.class));
		if(StringUtils.isNotEmpty(obj.getCatTaskCode())){
			query.setParameter("catTaskCode", obj.getCatTaskCode());
		}
		return query.list();

    }
}
