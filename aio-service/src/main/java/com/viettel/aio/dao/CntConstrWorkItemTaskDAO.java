package com.viettel.aio.dao;

import com.viettel.aio.bo.CntConstrWorkItemTaskBO;
import com.viettel.aio.dto.CntAppendixJobDTO;
import com.viettel.aio.dto.CntConstrWorkItemTaskDTO;
import com.viettel.aio.dto.CntContractDTO;
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
 * @author hailh10
 */
@Repository("cntConstrWorkItemTaskDAO")
public class CntConstrWorkItemTaskDAO extends BaseFWDAOImpl<CntConstrWorkItemTaskBO, Long> {

    public CntConstrWorkItemTaskDAO() {
        this.model = new CntConstrWorkItemTaskBO();
    }

    public CntConstrWorkItemTaskDAO(Session session) {
        this.session = session;
    }	

    @SuppressWarnings("unchecked")
	public List<CntConstrWorkItemTaskDTO> doSearchForTab(CntConstrWorkItemTaskDTO criteria) {
    	StringBuilder stringBuilder = getSelectAllQuery();
    	stringBuilder.append("WHERE 1=1 AND T1.STATUS = 1 ");


		if (null != criteria.getCntContractId()) {
			stringBuilder.append("AND T1.CNT_CONTRACT_ID = :cntContractId ");
		}

		stringBuilder.append("ORDER BY CNT_CONSTR_WORK_ITEM_TASK_ID ");

		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");


		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("constructionId", new LongType());
//		query.addScalar("constructionName", new StringType());
		query.addScalar("updatedGroupId", new LongType());
//		query.addScalar("updatedGroupName", new StringType());
		query.addScalar("updatedUserId", new LongType());
//		query.addScalar("updatedUserName", new StringType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("createdGroupId", new LongType());
//		query.addScalar("createdGroupName", new StringType());
		query.addScalar("createdUserId", new LongType());
//		query.addScalar("createdUserName", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("status", new LongType());
		query.addScalar("description", new StringType());
		query.addScalar("price", new DoubleType());
		query.addScalar("unitPrice", new DoubleType());
		query.addScalar("quantity", new LongType());
		query.addScalar("catUnitId", new LongType());
//		query.addScalar("catUnitName", new StringType());
		query.addScalar("catTaskId", new LongType());
//		query.addScalar("catTaskName", new StringType());
		query.addScalar("workItemId", new LongType());
//		query.addScalar("workItemName", new StringType());
		query.addScalar("cntContractId", new LongType());
//		query.addScalar("cntContractName", new StringType());
		query.addScalar("cntConstrWorkItemTaskId", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("constructionName", new StringType());
		query.addScalar("workItemName", new StringType());
		query.addScalar("catUnitName", new StringType());
		query.addScalar("catTaskName", new StringType());
		query.addScalar("catStationCode", new StringType());

		if (null != criteria.getCntContractId()) {
			query.setParameter("cntContractId", criteria.getCntContractId());
			queryCount.setParameter("cntContractId", criteria.getCntContractId());
		}

		query.setResultTransformer(Transformers
				.aliasToBean(CntConstrWorkItemTaskDTO.class));
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1)
					* criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}

    @SuppressWarnings("unchecked")
	public List<CntConstrWorkItemTaskDTO> doSearch(CntConstrWorkItemTaskDTO criteria) {
    	StringBuilder stringBuilder = getSelectAllQuery();
    	stringBuilder.append("WHERE 1=1 AND T1.STATUS = 1 ");
    	if(null != criteria.getKeySearch()) {
    		stringBuilder.append(" AND (UPPER(T2.NAME) like UPPER(:key) OR UPPER(T2.CODE) like UPPER(:key) ");
    		stringBuilder.append(" OR UPPER(T3.CODE) like UPPER(:key) OR UPPER(T3.NAME) like UPPER(:key) escape '&')");
    	}
		if (null != criteria.getCntContractId()) {
			stringBuilder.append("AND T1.CNT_CONTRACT_ID = :cntContractId ");
		}
		stringBuilder.append("ORDER BY CNT_CONSTR_WORK_ITEM_TASK_ID ");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("constructionId", new LongType());
//		query.addScalar("constructionName", new StringType());
		query.addScalar("updatedGroupId", new LongType());
//		query.addScalar("updatedGroupName", new StringType());
		query.addScalar("updatedUserId", new LongType());
//		query.addScalar("updatedUserName", new StringType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("createdGroupId", new LongType());
//		query.addScalar("createdGroupName", new StringType());
		query.addScalar("createdUserId", new LongType());
//		query.addScalar("createdUserName", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("status", new LongType());
		query.addScalar("description", new StringType());
		query.addScalar("price", new DoubleType());
		query.addScalar("unitPrice", new DoubleType());
		query.addScalar("quantity", new LongType());
		query.addScalar("catUnitId", new LongType());
//		query.addScalar("catUnitName", new StringType());
		query.addScalar("catTaskId", new LongType());
//		query.addScalar("catTaskName", new StringType());
		query.addScalar("workItemId", new LongType());
//		query.addScalar("workItemName", new StringType());
		query.addScalar("cntContractId", new LongType());
//		query.addScalar("cntContractName", new StringType());
		query.addScalar("cntConstrWorkItemTaskId", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("constructionName", new StringType());
		query.addScalar("workItemName", new StringType());
		query.addScalar("workItemCode", new StringType());
		query.addScalar("catUnitName", new StringType());
		query.addScalar("catTaskName", new StringType());
		query.addScalar("catTaskCode", new StringType());
		query.addScalar("catStationCode", new StringType());
		//hienvd: START 9/9/2019
		query.addScalar("stationHTCT", new StringType());
		//hienvd: END 9/9/2019

		if (null != criteria.getCntContractId()) {
			query.setParameter("cntContractId", criteria.getCntContractId());
			queryCount.setParameter("cntContractId", criteria.getCntContractId());
		}

		if (null != criteria.getKeySearch()) {
			query.setParameter("key", "%" + criteria.getKeySearch() + "%");
			queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
		}

		query.setResultTransformer(Transformers
				.aliasToBean(CntConstrWorkItemTaskDTO.class));
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1)
					* criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}

	public CntConstrWorkItemTaskDTO findByIdentityKey(CntConstrWorkItemTaskDTO criteria) {
		StringBuilder stringBuilder = getSelectAllQuery();
    	stringBuilder.append("WHERE T1.STATUS = 1");
//    	hoanm1_20180318_start

    	if (null != criteria.getCntContractId()) {
    		stringBuilder.append(" AND T1.CNT_CONTRACT_ID = :cntContractId ");
    	}
//    	hoanm1_20180318_end\
    	if (null != criteria.getConstructionId()) {
    		stringBuilder.append(" AND T1.CONSTRUCTION_ID = :constructionId");
    	}

    	if (null != criteria.getWorkItemId())
    		stringBuilder.append(" AND T1.WORK_ITEM_ID = :workItemId");
    	else
    		stringBuilder.append(" AND T1.WORK_ITEM_ID is null");
    	if (null != criteria.getCatTaskId())
    		stringBuilder.append(" AND T1.CAT_TASK_ID = :catTaskId");
		else
    		stringBuilder.append(" AND T1.CAT_TASK_ID is null");

    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("constructionId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("status", new LongType());
		query.addScalar("description", new StringType());
		query.addScalar("price", new DoubleType());
		query.addScalar("unitPrice", new DoubleType());
		query.addScalar("quantity", new LongType());
		query.addScalar("catUnitId", new LongType());
		query.addScalar("catTaskId", new LongType());
		query.addScalar("workItemId", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("cntConstrWorkItemTaskId", new LongType());
//    	hoanm1_20180318_start
		if (null != criteria.getCntContractId()) {
			query.setParameter("cntContractId", criteria.getCntContractId());
		}
//		hoanm1_20180318_end
		if (null != criteria.getConstructionId()) {
			query.setParameter("constructionId", criteria.getConstructionId());
		}
		if (null != criteria.getWorkItemId()){
			query.setParameter("workItemId", criteria.getWorkItemId());
		}

		if (null != criteria.getCatTaskId()) {
			query.setParameter("catTaskId", criteria.getCatTaskId());
		}

		query.setResultTransformer(Transformers.aliasToBean(CntConstrWorkItemTaskDTO.class));

		return (CntConstrWorkItemTaskDTO) query.uniqueResult();
	}

	public CntConstrWorkItemTaskDTO getIdForCntContractOut(CntConstrWorkItemTaskDTO obj) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("UNIQUE T1.CONSTRUCTION_ID constructionId ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append("FROM CNT_CONSTR_WORK_ITEM_TASK T1, CNT_CONTRACT B ");
		stringBuilder.append("WHERE T1.CNT_CONTRACT_ID = B.CNT_CONTRACT_ID ");
		stringBuilder.append("AND B.STATUS !=0 AND B.CONTRACT_TYPE=0 AND T1.STATUS=1 ");
		if(null != obj.getConstructionId()) {
			stringBuilder.append("AND T1.CONSTRUCTION_ID = :constructionId");
		}

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("constructionId", new LongType());
		query.addScalar("cntContractId", new LongType());

		if(null != obj.getConstructionId()) {
			query.setParameter("constructionId", obj.getConstructionId());
		}

		query.setResultTransformer(Transformers.aliasToBean(CntConstrWorkItemTaskDTO.class));

		return (CntConstrWorkItemTaskDTO) query.setMaxResults(1).uniqueResult();
	}

	public List<CntConstrWorkItemTaskDTO> checkConstructionIdForImport(CntConstrWorkItemTaskDTO obj) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("DISTINCT T1.CONSTRUCTION_ID constructionId ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId  ");
		stringBuilder.append("FROM CNT_CONSTR_WORK_ITEM_TASK T1, CNT_CONTRACT B ");
		stringBuilder.append("WHERE T1.CNT_CONTRACT_ID = B.CNT_CONTRACT_ID ");
		stringBuilder.append("AND B.STATUS !=0 AND B.CONTRACT_TYPE=0 AND T1.STATUS=1 ");


		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("constructionId", new LongType());
		query.addScalar("cntContractId", new LongType());



		query.setResultTransformer(Transformers.aliasToBean(CntConstrWorkItemTaskDTO.class));

		return query.list();
	}

	public CntConstrWorkItemTaskDTO findByIdentityKeyForCntContractOut(CntConstrWorkItemTaskDTO criteria) {
		StringBuilder stringBuilder = getSelectAllQuery();
    	stringBuilder.append("WHERE T1.STATUS = 1");
//    	hoanm1_20180318_start

//    	hoanm1_20180318_end\
    	if (null != criteria.getConstructionId()) {
    		stringBuilder.append(" AND T1.CONSTRUCTION_ID = :constructionId");
    	}

    	if (null != criteria.getWorkItemId())
    		stringBuilder.append(" AND T1.WORK_ITEM_ID = :workItemId");
    	else
    		stringBuilder.append(" AND T1.WORK_ITEM_ID is null");
    	if (null != criteria.getCatTaskId())
    		stringBuilder.append(" AND T1.CAT_TASK_ID = :catTaskId");
		else
    		stringBuilder.append(" AND T1.CAT_TASK_ID is null");



    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("constructionId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("status", new LongType());
		query.addScalar("description", new StringType());
		query.addScalar("price", new DoubleType());
		query.addScalar("unitPrice", new DoubleType());
		query.addScalar("quantity", new LongType());
		query.addScalar("catUnitId", new LongType());
		query.addScalar("catTaskId", new LongType());
		query.addScalar("workItemId", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("cntConstrWorkItemTaskId", new LongType());
//    	hoanm1_20180318_start
		if (null != criteria.getCntContractId()) {
			query.setParameter("cntContractId", criteria.getCntContractId());
		}
//		hoanm1_20180318_end
		if (null != criteria.getConstructionId()) {
			query.setParameter("constructionId", criteria.getConstructionId());
		}
		if (null != criteria.getWorkItemId()){
			query.setParameter("workItemId", criteria.getWorkItemId());
		}

		if (null != criteria.getCatTaskId()) {
			query.setParameter("catTaskId", criteria.getCatTaskId());
		}

		query.setResultTransformer(Transformers.aliasToBean(CntConstrWorkItemTaskDTO.class));

		return (CntConstrWorkItemTaskDTO) query.uniqueResult();
	}


	public CntConstrWorkItemTaskDTO findByIdentityKeyForMap(Long cntContractId, CntConstrWorkItemTaskDTO criteria) {
		StringBuilder stringBuilder = getSelectAllQuery();
    	stringBuilder.append("WHERE T1.STATUS = 1");
//    	hoanm1_20180318_start
    	if (null != criteria.getCntContractId()) {
    		stringBuilder.append(" AND T1.CNT_CONTRACT_ID = :cntContractId ");
    	}
//    	hoanm1_20180318_end\
    	if (null != criteria.getConstructionId()) {
    		stringBuilder.append(" AND T1.CONSTRUCTION_ID = :constructionId");
    	}

    	if (null != criteria.getWorkItemId())
    		stringBuilder.append(" AND T1.WORK_ITEM_ID = :workItemId");
    	else
    		stringBuilder.append(" AND T1.WORK_ITEM_ID is null");
    	if (null != criteria.getCatTaskId())
    		stringBuilder.append(" AND T1.CAT_TASK_ID = :catTaskId");
		else
    		stringBuilder.append(" AND T1.CAT_TASK_ID is null");



    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("constructionId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("status", new LongType());
		query.addScalar("description", new StringType());
		query.addScalar("price", new DoubleType());
		query.addScalar("unitPrice", new DoubleType());
		query.addScalar("quantity", new LongType());
		query.addScalar("catUnitId", new LongType());
		query.addScalar("catTaskId", new LongType());
		query.addScalar("workItemId", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("cntConstrWorkItemTaskId", new LongType());


			query.setParameter("cntContractId", cntContractId);

		if (null != criteria.getConstructionId()) {
			query.setParameter("constructionId", criteria.getConstructionId());
		}
		if (null != criteria.getWorkItemId()){
			query.setParameter("workItemId", criteria.getWorkItemId());
		}

		if (null != criteria.getCatTaskId()) {
			query.setParameter("catTaskId", criteria.getCatTaskId());
		}

		query.setResultTransformer(Transformers.aliasToBean(CntConstrWorkItemTaskDTO.class));

		return (CntConstrWorkItemTaskDTO) query.uniqueResult();
	}

	public List<CntConstrWorkItemTaskDTO> getForAutoComplete(CntConstrWorkItemTaskDTO obj) {
		StringBuilder stringBuilder =getSelectAllQuery();

		stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=10" : "");
		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			stringBuilder.append(" AND (UPPER(NAME) like UPPER(:key) OR UPPER(CODE) like UPPER(:key) escape '&')");
		}
		stringBuilder.append(" ORDER BY NAME");
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("cntConstrWorkItemTaskId", new LongType());
		query.addScalar("name", new StringType());
		query.addScalar("value", new StringType());

		query.setResultTransformer(Transformers.aliasToBean(CntConstrWorkItemTaskDTO.class));


		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			query.setParameter("key","%"+ obj.getKeySearch()+"%");
		}
		query.setMaxResults(20);
		return query.list();
	}

	@SuppressWarnings("unchecked")
	public CntConstrWorkItemTaskDTO getById(Long id) {
    	StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CONSTRUCTION_ID constructionId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CONSTRUCTION WHERE CONSTRUCTION_ID = T1.CONSTRUCTION_ID) constructionName  ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM UPDATED_GROUP WHERE UPDATED_GROUP_ID = T1.UPDATED_GROUP_ID) updatedGroupName  ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM UPDATED_USER WHERE UPDATED_USER_ID = T1.UPDATED_USER_ID) updatedUserName  ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CREATED_GROUP WHERE CREATED_GROUP_ID = T1.CREATED_GROUP_ID) createdGroupName  ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CREATED_USER WHERE CREATED_USER_ID = T1.CREATED_USER_ID) createdUserName  ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.PRICE price ");
		stringBuilder.append(",T1.UNIT_PRICE unitPrice ");
		stringBuilder.append(",T1.QUANTITY quantity ");
		stringBuilder.append(",T1.CAT_UNIT_ID catUnitId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CAT_UNIT WHERE CAT_UNIT_ID = T1.CAT_UNIT_ID) catUnitName  ");
		stringBuilder.append(",T1.CAT_TASK_ID catTaskId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CAT_TASK WHERE CAT_TASK_ID = T1.CAT_TASK_ID) catTaskName  ");
		stringBuilder.append(",T1.WORK_ITEM_ID workItemId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM WORK_ITEM WHERE WORK_ITEM_ID = T1.WORK_ITEM_ID) workItemName  ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CNT_CONTRACT WHERE CNT_CONTRACT_ID = T1.CNT_CONTRACT_ID) cntContractName  ");
		stringBuilder.append(",T1.CNT_CONSTR_WORK_ITEM_TASK_ID cntConstrWorkItemTaskId ");

    	stringBuilder.append("FROM CNT_CONSTR_WORK_ITEM_TASK T1 ");
    	stringBuilder.append("WHERE T1.IS_DELETED = 'N' AND T1.CNT_CONSTR_WORK_ITEM_TASK_ID = :cntConstrWorkItemTaskId ");

    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("constructionId", new LongType());
		query.addScalar("constructionName", new StringType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("updatedGroupName", new StringType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedUserName", new StringType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("createdGroupName", new StringType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdUserName", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("status", new LongType());
		query.addScalar("description", new StringType());
		query.addScalar("price", new DoubleType());
		query.addScalar("unitPrice", new DoubleType());
		query.addScalar("quantity", new LongType());
		query.addScalar("catUnitId", new LongType());
		query.addScalar("catUnitName", new StringType());
		query.addScalar("catTaskId", new LongType());
		query.addScalar("catTaskName", new StringType());
		query.addScalar("workItemId", new LongType());
		query.addScalar("workItemName", new StringType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("cntContractName", new StringType());
		query.addScalar("cntConstrWorkItemTaskId", new LongType());
		query.setParameter("cntConstrWorkItemTaskId", id);
		query.setResultTransformer(Transformers.aliasToBean(CntConstrWorkItemTaskDTO.class));
		return (CntConstrWorkItemTaskDTO) query.uniqueResult();
	}
	public StringBuilder getSelectAllQuery(){
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CONSTRUCTION_ID constructionId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.PRICE price ");
		stringBuilder.append(",T1.UNIT_PRICE unitPrice ");
		stringBuilder.append(",T1.QUANTITY quantity ");
		stringBuilder.append(",T1.CAT_UNIT_ID catUnitId ");
		stringBuilder.append(",T1.CAT_TASK_ID catTaskId ");
		stringBuilder.append(",T1.WORK_ITEM_ID workItemId ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",T1.CNT_CONSTR_WORK_ITEM_TASK_ID cntConstrWorkItemTaskId ");
		stringBuilder.append(",T2.CODE constructionCode ");
		stringBuilder.append(",T2.NAME constructionName ");
		stringBuilder.append(",T3.NAME workItemName ");
		stringBuilder.append(",T3.CODE workItemCode ");
		stringBuilder.append(",T4.NAME catTaskName ");
		stringBuilder.append(",T4.CODE catTaskCode ");
		stringBuilder.append(",T5.NAME catUnitName ");
		stringBuilder.append(",T6.CODE catStationCode ");
		//hienvd: START 9/9/2019
		stringBuilder.append(",T1.STATION_HTCT stationHTCT ");
		//hienvd: END 9/9/2019


    	stringBuilder.append("FROM CNT_CONSTR_WORK_ITEM_TASK T1 ");
    	stringBuilder.append("LEFT JOIN CTCT_COMS_OWNER.CONSTRUCTION T2 ON T1.CONSTRUCTION_ID = T2.CONSTRUCTION_ID  ");
    	stringBuilder.append("LEFT JOIN CTCT_COMS_OWNER.WORK_ITEM T3 ON T1.WORK_ITEM_ID = T3.WORK_ITEM_ID  ");
    	stringBuilder.append("LEFT JOIN CTCT_CAT_OWNER.CAT_TASK T4 ON T1.CAT_TASK_ID = T4.CAT_TASK_ID  ");
    	stringBuilder.append("LEFT JOIN CTCT_CAT_OWNER.CAT_UNIT T5 ON T1.CAT_UNIT_ID = T5.CAT_UNIT_ID  ");
    	stringBuilder.append("LEFT JOIN CTCT_CAT_OWNER.CAT_STATION T6 ON T2.CAT_STATION_ID = T6.CAT_STATION_ID  ");
    	return stringBuilder;
	}

	public int updateConstrWorkItemTask(Long cntContractId, CntConstrWorkItemTaskDTO obj) {
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append("UPDATE CNT_CONSTR_WORK_ITEM_TASK ");
		stringBuilder.append("SET PRICE = :price ");
		stringBuilder.append("WHERE CNT_CONTRACT_ID = :cntContractId ");
		stringBuilder.append("AND CONSTRUCTION_ID = :constructionId ");
		stringBuilder.append("AND status = 1 ");
		stringBuilder.append("and WORK_ITEM_ID is null and CAT_TASK_ID is null");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.setParameter("price", obj.getPrice(), DoubleType.INSTANCE);
		query.setParameter("cntContractId", cntContractId);
		query.setParameter("constructionId", obj.getConstructionId());
		return query.executeUpdate();
	}

	public int insertConstrWorkItemTask(Long cntContractId, CntConstrWorkItemTaskDTO obj) {
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append("INSERT INTO CNT_CONSTR_WORK_ITEM_TASK ");
		stringBuilder.append("(CNT_CONSTR_WORK_ITEM_TASK_id, cnt_contract_id, construction_id, price, status)");
		stringBuilder.append("VALUES (");
		stringBuilder.append("CNT_CONSTR_WORK_ITEM_TASK_SEQ.NEXTVAL, :cntContractId, :constructionId, :price, 1)");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		query.setParameter("price", obj.getPrice(), DoubleType.INSTANCE);
		query.setParameter("cntContractId", cntContractId);
		query.setParameter("constructionId", obj.getConstructionId());

		return query.executeUpdate();
	}

	public List<CntConstrWorkItemTaskDTO> getByContractId(Long cntContractId) {

		StringBuilder sql = getSelectAllQuery();
		StringBuilder stringBuilder = new StringBuilder(sql);

		stringBuilder.append("WHERE CNT_CONTRACT_ID = :cntContractId ");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("constructionId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("status", new LongType());
		query.addScalar("description", new StringType());
		query.addScalar("price", new DoubleType());
		query.addScalar("unitPrice", new DoubleType());
		query.addScalar("quantity", new LongType());
		query.addScalar("catUnitId", new LongType());
		query.addScalar("catTaskId", new LongType());
		query.addScalar("workItemId", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("cntConstrWorkItemTaskId", new LongType());

		query.setParameter("cntContractId", cntContractId);
		query.setResultTransformer(Transformers.aliasToBean(CntConstrWorkItemTaskDTO.class));

		return query.list();
	}

	public List<CntConstrWorkItemTaskDTO> getConstructionTask(CntConstrWorkItemTaskDTO criteria){
		StringBuilder stringBuilder = buildQueryConstructionTask();
		String n = "with tbl as (select a.cnt_contract_id,"
				+ "c.construction_id,"
				+ "c.code,"
				+ "c.name name,"
				+ "c.status ,"
				+ "(select avg(complete_percent)complete_percent "
				+ "from CONSTRUCTION_TASK a  "
				+ "INNER JOIN DETAIL_MONTH_PLAN dmp ON a.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID and dmp.SIGN_STATE = 3 AND dmp.status = 1 "
				+ "where level_id=4 and type=1 "
				+ "start with a.parent_id  in (select construction_task_id from construction_task a "
				+ "INNER JOIN DETAIL_MONTH_PLAN dmp ON a.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID and dmp.SIGN_STATE = 3 AND dmp.status = 1 "
				+ "where a.CONSTRUCTION_ID=c.CONSTRUCTION_ID and type=1 and level_id=2) "
				+ "connect by prior a.construction_task_id = a.parent_id "
				+ ") complete_percent, "
				+ "c.STARTING_DATE start_date, "
				+ "nvl(c.COMPLETE_DATE,c.EXCPECTED_COMPLETE_DATE) end_date "
				+ "from "
				+ "(select distinct cnt_contract_id,construction_id from CNT_CONSTR_WORK_ITEM_TASK a where a.cnt_contract_id = :cntContractId) "
				+ "a,construction c where a.construction_id = c.construction_id )"
				+ "Select cnt_contract_id,construction_id,code,name,start_date,end_date,round(complete_percent,2)complete_percent, status"
				+ "case when status =1 then 'Chờ bàn giao mặt bằng' "
				+ "when status =2 then 'Chờ khởi công' "
				+ "when status =3 then 'Đang thực hiện' "
				+ "when status =4 then 'Đã tạm dừng' "
				+ "when status =5 then 'Đã hoàn thành' "
				+ "when status =6 then 'Đã nghiệm thu' "
				+ "when status =7 then 'Đã hoàn công' "
				+ "when status =8 then 'Đã quyết toán' "
				+ "when status =0 then 'Đã hủy' end status  from tbl order by name ;";
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("constructionCode", new StringType());
		query.addScalar("constructionId", new LongType());
		query.addScalar("constructionName", new StringType());
		query.addScalar("completeValue", new DoubleType());
		query.addScalar("status", new LongType());
		query.addScalar("completeDate", new DateType());
		query.addScalar("startingDate", new DateType());


		if (null != criteria.getCntContractId()) {
			query.setParameter("cntContractId", criteria.getCntContractId());
			queryCount.setParameter("cntContractId", criteria.getCntContractId());
		}

		query.setResultTransformer(Transformers
				.aliasToBean(CntConstrWorkItemTaskDTO.class));
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1)
					* criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}

	private StringBuilder buildQueryConstructionTask() {
		StringBuilder stringBuilder = new StringBuilder(
							" select "
							+ "b.cnt_contract_id cntContractId,a.construction_id constructionId,a.code constructionCode,a.name constructionName,a.status, "
							+ "round(avg(c.complete_percent),2) completeValue, "
							+ "a.STARTING_DATE startingDate, "
							+ "nvl(a.COMPLETE_DATE,a.EXCPECTED_COMPLETE_DATE) completeDate "
							+ "from construction a, "
							+ "(select distinct cnt_contract_id,construction_id from CNT_CONSTR_WORK_ITEM_TASK a where a.status=1 and a.cnt_contract_id = :cntContractId) b, "
							+ "(with tbl as(select b.construction_id ,b.work_item_id , "
							+ "b.name, b.code,b.status, "
							+ "(select start_date from (select ct.start_date from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
							+ "where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
							+ "and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) startingDate, "
							+ "(select end_date from (select ct.end_date from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
							+ "where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
							+ "and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) completeDate, "
							+ "(select nvl(complete_percent,0) from (select ct.complete_percent from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
							+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
							+ "and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) completeValue "
							+ " from cat_task a,WORK_ITEM b where a.CAT_WORK_ITEM_TYPE_ID=b.CAT_WORK_ITEM_TYPE_ID"
							+ " and a.STATUS=1 ) "
							+ "select construction_id"
							+ ",construction_id construction_code,"
							+ " work_item_id ,"
							+ "code,"
							+ "name,"
							+ "min(startingDate)start_date,"
							+ "max(completeDate)end_date,"
							+ "round(avg(completeValue),2)complete_percent, status "
							+ "from tbl group by construction_id,work_item_id,code,name,status) c "
							+ "where a.construction_id=b.construction_id and a.construction_id=c.construction_id "
							+ "group by b.cnt_contract_id,a.construction_id,a.code,a.name,a.status,a.STARTING_DATE,nvl(a.COMPLETE_DATE,a.EXCPECTED_COMPLETE_DATE) "
							+ "order by a.name");


		String n = " select "
				+ "b.cnt_contract_id ,a.construction_id constructorId,a.code constructionCode,a.name constructionName,a.status, "
				+ "round(avg(c.complete_percent),2) completeValue, "
				+ "a.STARTING_DATE startingDate, "
				+ "nvl(a.COMPLETE_DATE,a.EXCPECTED_COMPLETE_DATE) completeDate "
				+ "from construction a, "
				+ "(select distinct cnt_contract_id,construction_id from CNT_CONSTR_WORK_ITEM_TASK a where a.status=1 and a.cnt_contract_id = ?) b, "
				+ "(with tbl as(select b.construction_id ,b.work_item_id , "
				+ "b.name, b.code,b.status, "
				+ "(select start_date from (select ct.start_date from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
				+ "where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ "and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) startingDate, "
				+ "(select end_date from (select ct.end_date from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
				+ "where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ "and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) completeDate, "
				+ "(select nvl(complete_percent,0) from (select ct.complete_percent from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ "and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) completeValue "
				+ " from cat_task a,WORK_ITEM b where a.CAT_WORK_ITEM_TYPE_ID=b.CAT_WORK_ITEM_TYPE_ID"
				+ " and a.STATUS=1 ) "
				+ "select construction_id"
				+ ",construction_id construction_code,"
				+ " work_item_id ,"
				+ "code,"
				+ "name,"
				+ "min(startingDate)start_date,"
				+ "max(completeDate)end_date,"
				+ "round(avg(completeValue),2)complete_percent, "
				+ "case when status =1 then 'Chưa thực hiện' "
				+ "when status = 2 then 'Ðang thực hiện'  "
				+ "when status = 3 then 'Ðã hoàn thành' end status "
				+ "from tbl group by construction_id,work_item_id,code,name,status) c "
				+ "where a.construction_id=b.construction_id and a.construction_id=c.construction_id "
				+ "group by b.cnt_contract_id,a.construction_id,a.code,a.name,a.status,a.STARTING_DATE,nvl(a.COMPLETE_DATE,a.EXCPECTED_COMPLETE_DATE) "
				+ "order by a.name;";
		return stringBuilder;
	}
	private StringBuilder buildQueryConstructionWorkItem() {
		StringBuilder stringBuilder = new StringBuilder( "with tbl as(select b.construction_id ,b.work_item_id , "
				+ "b.name, b.code,b.status,b.complete_Date completeDate_work, "
				+ "(select start_date from (select ct.start_date from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
				+ "where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and "
				+ "ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ "and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc)"
				+ " where ROWNUM <2) startingDate, "
				+ "(select end_date from (select ct.end_date from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
				+ "where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and"
				+ " ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ "and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) completeDate, "
				+ "(select nvl(complete_percent,0) from (select ct.complete_percent from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
				+ "where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ "and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) completeValue "
				+ " from cat_task a,WORK_ITEM b where a.CAT_WORK_ITEM_TYPE_ID=b.CAT_WORK_ITEM_TYPE_ID "
				+ "and a.STATUS=1 and b.construction_id=:constructionId) "

				+ "select construction_id constructionId,construction_id constructionCode, work_item_id workItemId,"
				+ "code workItemCode,name workItemName,min(startingDate) startingDate,"
				+ "max(nvl(completeDate_work,completeDate)) completeDate,round(avg(completeValue),2)completeValue, status "
				+ "from tbl group by construction_id,work_item_id,code,name,status order by name");

		String n = "with tbl as(select b.construction_id ,b.work_item_id , "
				+ "b.name, b.code,b.status,b.complete_Date completeDate_work, "
				+ "(select start_date from (select ct.start_date from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
				+ "where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and "
				+ "ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ "and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc)"
				+ " where ROWNUM <2) startingDate, "
				+ "(select end_date from (select ct.end_date from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp"
				+ "where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and"
				+ " ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ "and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) completeDate, "
				+ "(select nvl(complete_percent,0) from (select ct.complete_percent from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
				+ "where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ "and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) completeValue "
				+ " from cat_task a,WORK_ITEM b where a.CAT_WORK_ITEM_TYPE_ID=b.CAT_WORK_ITEM_TYPE_ID "
				+ "and a.STATUS=1 and b.construction_id=?) "

				+ "select construction_id constructionId,construction_id constructionCode, work_item_id workItemId,"
				+ "code workItemCode,name workItemName,min(startingDate)start_date startingDate,"
				+ "max(nvl(completeDate_work,completeDate))end_date completeDate,round(avg(completeValue),2)completeValue,"
				+ "case when status =1 then 'Chưa thực hiện' "
				+ "when status = 2 then 'Ðang thực hiện' "
				+ "when status = 3 then 'Ðã hoàn thành' end status "
				+ "from tbl group by construction_id,work_item_id,code,name,status order by name;";
		return stringBuilder;
	}

	public List<CntConstrWorkItemTaskDTO> getConstructionWorkItem(CntConstrWorkItemTaskDTO criteria){
		StringBuilder stringBuilder = buildQueryConstructionWorkItem();
		String n ="with tbl as (select " +
				"( select construction_id from CONSTRUCTION_TASK where CONSTRUCTION_TASK_ID=a.parent_id) construction_id," +
				"( select task_name from CONSTRUCTION_TASK where CONSTRUCTION_TASK_ID=a.parent_id) construction_code," +
				"a.work_item_id,b.code, a.task_name name ," +
				"(select avg(complete_percent)complete_percent " +
				"from CONSTRUCTION_TASK task " +
				"INNER JOIN DETAIL_MONTH_PLAN dmp ON task.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID and dmp.SIGN_STATE = 3 AND dmp.status = 1" +
				"where task.level_id=4 and task.type=1 " +
				"start with task.parent_id = a.construction_task_id " +
				"connect by prior task.construction_task_id = task.parent_id ) complete_percent, " +
				"(select min(start_date)start_date from CONSTRUCTION_TASK task " +
				"INNER JOIN DETAIL_MONTH_PLAN dmp ON task.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID and dmp.SIGN_STATE = 3 AND dmp.status = 1 " +
				"where task.level_id=4 and task.type=1 start with task.parent_id = a.construction_task_id " +
				"connect by prior task.construction_task_id = task.parent_id ) start_date," +
				"(select max(end_date)end_date " +
				"from CONSTRUCTION_TASK task " +
				"INNER JOIN DETAIL_MONTH_PLAN dmp ON task.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID and dmp.SIGN_STATE = 3 AND dmp.status = 1 " +
				"where task.level_id=4 and task.type=1 " +
				"start with task.parent_id = a.construction_task_id " +
				"connect by prior task.construction_task_id = task.parent_id ) end_date " +
				"from CONSTRUCTION_TASK a," +
				"work_item b,DETAIL_MONTH_PLAN dmp " +
				"where a.level_id=3 and a.work_item_id=b.work_item_id " +
				"and a.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID and dmp.SIGN_STATE = 3 AND dmp.status = 1 " +
				"and a.parent_id in(select construction_task_id from CONSTRUCTION_TASK a " +
				"INNER JOIN DETAIL_MONTH_PLAN dmp ON a.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID and dmp.SIGN_STATE = 3 AND dmp.status = 1 " +
				"where a.construction_id=:constructionId and a.type=1 and a.level_id=2) ) " +
				"select distinct construction_id,construction_code,work_item_id,code,name,start_date,end_date,round(complete_percent,2)complete_percent, " +
				"case when complete_percent =0 then 'Chưa thực hiện' " +
				"when complete_percent > 0 and complete_percent < 100 then 'Đang thực hiện' " +
				"when complete_percent = 100 then 'Đã hoàn thành' end status " +
				"from tbl order by name";
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("constructionCode", new StringType());
		query.addScalar("workItemCode", new StringType());
		query.addScalar("workItemName", new StringType());
		query.addScalar("completeValue", new DoubleType());
		query.addScalar("workItemId", new LongType());
		query.addScalar("constructionId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("completeDate", new DateType());
		query.addScalar("startingDate", new DateType());


		if (null != criteria.getConstructionId()) {
			query.setParameter("constructionId", criteria.getConstructionId());
			queryCount.setParameter("constructionId", criteria.getConstructionId());
		}

		query.setResultTransformer(Transformers.aliasToBean(CntConstrWorkItemTaskDTO.class));
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1)
					* criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}

	public List<CntConstrWorkItemTaskDTO> getTaskProgress(CntConstrWorkItemTaskDTO criteria){
		StringBuilder stringBuilder = new StringBuilder("select b.construction_id constructionId,b.name workItemCode,b.work_item_id workItemId,a.name catTaskName ,"
				+ " (select start_date from (select ct.start_date from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and "
				+ " ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) startingDate,"
				+ " (select end_date from (select ct.end_date from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp"
				+ "	where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID"
				+ "	and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) completeDate,"
				+ " (select complete_percent from (select ct.complete_percent from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp"
				+ "	where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID"
				+ "	and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) completeValue,"
				+ " (select status from (select ct.status from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) status, "
				+ " (select complete_state from (select ct.complete_state from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) complateState, "
				+ " (select email from (select u.email from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp,SYS_USER u "
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 and ct.performer_id=u.sys_user_id order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) email, "
				+ " (select full_name from (select u.full_name from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp,SYS_USER u "
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 and ct.performer_id=u.sys_user_id order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) fullName,"
				+ " (select name from (select g.name from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp,SYS_USER u,sys_group g "
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 and ct.performer_id=u.sys_user_id and u.sys_group_id=g.sys_group_id(+) order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) sysGroupName"
				+ " from cat_task a,WORK_ITEM b where a.CAT_WORK_ITEM_TYPE_ID=b.CAT_WORK_ITEM_TYPE_ID "
				+ " and a.STATUS=1 and b.WORK_ITEM_ID = :workItemId and b.construction_id=:constructionId"
				+ " order by a.name");

		String n = "select b.construction_id constructionId,b.name workItemCode,b.work_item_id workItemId,a.name catTaskName ,"
				+ " (select start_date from (select ct.start_date from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and "
				+ " ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) startingDate,"
				+ " (select end_date from (select ct.end_date from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp"
				+ "	where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID"
				+ "	and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) completeDate,"
				+ " (select complete_percent from (select ct.complete_percent from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp"
				+ "	where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID"
				+ "	and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) completeValue,"
				+ " (select status from (select ct.status from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) status, "
				+ " (select complete_state from (select ct.complete_state from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) complateState, "
				+ " (select email from (select u.email from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp,SYS_USER u "
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 and ct.performer_id=u.sys_user_id order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) email, "
				+ " (select full_name from (select u.full_name from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp,SYS_USER u "
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 and ct.performer_id=u.sys_user_id order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) fullName,"
				+ " select name from (select g.name from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp,SYS_USER u,sys_group g "
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 and ct.performer_id=u.sys_user_id and u.sys_group_id=g.sys_group_id(+) order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) sysGroupName"
				+ " from cat_task a,WORK_ITEM b where a.CAT_WORK_ITEM_TYPE_ID=b.CAT_WORK_ITEM_TYPE_ID "
				+ " and a.STATUS=1 and b.WORK_ITEM_ID = ? and b.construction_id=?"
				+ " order by a.name;";
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("constructionId", new LongType());
//		query.addScalar("taskCode", new StringType());
		query.addScalar("catTaskName", new StringType());
		query.addScalar("completeValue", new DoubleType());
		query.addScalar("workItemId", new LongType());
//		query.addScalar("catTaskId", new LongType());
		query.addScalar("workItemCode", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("startingDate", new DateType());
		query.addScalar("completeDate", new DateType());
//		query.addScalar("", new DateType());

//		hoanm1_20180312_start
		query.addScalar("complateState", new StringType());
		query.addScalar("email", new StringType());
		query.addScalar("fullName", new StringType());
		query.addScalar("sysGroupName", new StringType());
//		hoanm1_20180312_end

		if (null != criteria.getWorkItemId()) {
			query.setParameter("workItemId", criteria.getWorkItemId());
			queryCount.setParameter("workItemId", criteria.getWorkItemId());
		}
		if (null != criteria.getConstructionId()) {
			query.setParameter("constructionId", criteria.getConstructionId());
			queryCount.setParameter("constructionId", criteria.getConstructionId());
		}

		query.setResultTransformer(Transformers
				.aliasToBean(CntConstrWorkItemTaskDTO.class));
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1)
					* criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}
//	hnx report contract progress general
	public List<CntConstrWorkItemTaskDTO> doSearchContractProgress(
			CntContractDTO criteria) {
		StringBuilder stringBuilder = buildQueryReportContract();
		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			stringBuilder.append(" AND UPPER(cnt.code) like UPPER(:key) escape '&' ");
		}
		if (null != criteria.getSignDate()) {
			stringBuilder.append(" AND cnt.SIGN_DATE = :signDate ");
		}
		if (null != criteria.getSignDateFrom()) {
			stringBuilder.append(" AND cnt.SIGN_DATE >= :signDateFrom ");
		}
		if (null != criteria.getSignDateTo()) {
			stringBuilder.append(" AND cnt.SIGN_DATE <= :signDateTo ");
		}
		if (null != criteria.getStatusLst() && criteria.getStatusLst().size()>0) {
			stringBuilder.append(" AND cnt.STATUS in (:statusLst) ");
		}
		stringBuilder.append(" group by cnt.code,a.code,a.status,a.CAT_STATION_ID"
				+ " order by cnt.code");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		query.addScalar("cntContractCode", new StringType());
		query.addScalar("catStationCode", new StringType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("completeValue", new DoubleType());
		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			query.setParameter("key", "%"+criteria.getKeySearch()+"%");
			queryCount.setParameter("key", "%"+criteria.getKeySearch()+"%");
		}
		if (null != criteria.getSignDate()) {
			query.setParameter("signDate", criteria.getSignDate());
			queryCount.setParameter("signDate", criteria.getSignDate());
		}
		if (null != criteria.getSignDateFrom()) {
			query.setParameter("signDateFrom", criteria.getSignDateFrom());
			queryCount.setParameter("signDateFrom", criteria.getSignDateFrom());
		}
		if (null != criteria.getSignDateTo()) {
			query.setParameter("signDateTo", criteria.getSignDateTo());
			queryCount.setParameter("signDateTo", criteria.getSignDateTo());
		}
		if (null != criteria.getStatusLst() && criteria.getStatusLst().size()>0) {
			query.setParameterList("statusLst", criteria.getStatusLst());
			queryCount.setParameterList("statusLst", criteria.getStatusLst());
		}
		query.setResultTransformer(Transformers.aliasToBean(CntConstrWorkItemTaskDTO.class));
//		List<CntConstrWorkItemTaskDTO> lstConstrWorkItem = new ArrayList<CntConstrWorkItemTaskDTO>();
//		List<CntContractDTO> lstContractDTO = getListContractOut(criteria);
////		int count = 0;
//		for (int i = 0; i < lstContractDTO.size(); i++) {
//			if (null != lstContractDTO.get(i).getCntContractId()) {
//				List<CntConstrWorkItemTaskDTO> lstTemp  = getListConstruction(lstContractDTO.get(i).getCntContractId());
//				if (lstTemp.size() > 0) {
//					String code = lstContractDTO.get(i).getCode();
//					for (int j = 0; j < lstTemp.size(); j++) {
//						lstTemp.get(j).setCntContractCode(code);
//					}
//					lstConstrWorkItem.addAll(lstTemp);
//				} else {
//					CntConstrWorkItemTaskDTO itemEmpty = new CntConstrWorkItemTaskDTO();
//					itemEmpty.setCntContractId(lstContractDTO.get(i).getCntContractId());
//					itemEmpty.setCntContractCode(lstContractDTO.get(i).getCode());
//					lstConstrWorkItem.add(itemEmpty);
//				}
//			}
//		}
		if (query != null) {
			if (criteria.getPage() != null && criteria.getPageSize() != null) {
				query.setFirstResult((criteria.getPage().intValue() - 1)
						* criteria.getPageSize().intValue());
				query.setMaxResults(criteria.getPageSize().intValue());
			}
		}
		criteria.setTotalRecord( ((BigDecimal)queryCount.uniqueResult()).intValue() );
		return query.list();
	}
	public List<CntConstrWorkItemTaskDTO> doSearchContractProgressDetail(
			CntContractDTO criteria) {
		StringBuilder stringBuilder = buildQueryReportContractDetail();
		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			stringBuilder.append(" AND UPPER(cnt.code) like UPPER(:key) escape '&' ");
		}
		if (null != criteria.getSignDate()) {
			stringBuilder.append(" AND cnt.SIGN_DATE = :signDate ");
		}
		if (null != criteria.getSignDateFrom()) {
			stringBuilder.append(" AND cnt.SIGN_DATE >= :signDateFrom ");
		}
		if (null != criteria.getSignDateTo()) {
			stringBuilder.append(" AND cnt.SIGN_DATE <= :signDateTo ");
		}
		if (null != criteria.getStatusLst() && criteria.getStatusLst().size()>0) {
			stringBuilder.append(" AND cnt.STATUS in (:statusLst) ");
		}
		stringBuilder.append(" group by cnt.code,a.code,a.status,a.CAT_STATION_ID,c.name,c.sysGroupName,c.work_item_id"
				+ " order by cnt.code");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		query.addScalar("cntContractCode", new StringType());
		query.addScalar("catStationCode", new StringType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("workItemName", new StringType());
		query.addScalar("sysGroupName", new StringType());
		query.addScalar("listContractIn", new StringType());
		query.addScalar("completeValueWorkItem", new DoubleType());
		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			query.setParameter("key", "%"+criteria.getKeySearch()+"%");
			queryCount.setParameter("key", "%"+criteria.getKeySearch()+"%");
		}
		if (null != criteria.getSignDate()) {
			query.setParameter("signDate", criteria.getSignDate());
			queryCount.setParameter("signDate", criteria.getSignDate());
		}
		if (null != criteria.getSignDateFrom()) {
			query.setParameter("signDateFrom", criteria.getSignDateFrom());
			queryCount.setParameter("signDateFrom", criteria.getSignDateFrom());
		}
		if (null != criteria.getSignDateTo()) {
			query.setParameter("signDateTo", criteria.getSignDateTo());
			queryCount.setParameter("signDateFrom", criteria.getSignDateFrom());
		}
		if (null != criteria.getStatusLst() && criteria.getStatusLst().size()>0) {
			query.setParameterList("statusLst", criteria.getStatusLst());
			queryCount.setParameterList("statusLst", criteria.getStatusLst());
		}
		query.setResultTransformer(Transformers.aliasToBean(CntConstrWorkItemTaskDTO.class));
		if (query != null) {
			if (criteria.getPage() != null && criteria.getPageSize() != null) {
				query.setFirstResult((criteria.getPage().intValue() - 1)
						* criteria.getPageSize().intValue());
				query.setMaxResults(criteria.getPageSize().intValue());
			}
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}

	private StringBuilder buildQueryReportContract() {
		StringBuilder stringBuilder = new StringBuilder("with tbl as(select b.construction_id ,b.work_item_id ,"
				+ " b.name, b.code,b.status, b.Constructor_id sysGroupId,"
				+ " case when Is_internal=1 then (select name from sys_group sys where sys.sys_group_id=b.Constructor_id)"
				+ " when Is_internal=2 then (select name from CAT_PARTNER cat where cat.CAT_PARTNER_id=b.Constructor_id) end sysGroupName,"
				+ " (select start_date from (select ct.start_date from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp"
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) startingDate, "
				+ " (select end_date from (select ct.end_date from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp"
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID"
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) completeDate, "
				+ " (select nvl(complete_percent,0) from (select ct.complete_percent from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp"
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID"
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) completeValue"
				+ "	from cat_task a,WORK_ITEM b where a.CAT_WORK_ITEM_TYPE_ID=b.CAT_WORK_ITEM_TYPE_ID"
				+ " and a.STATUS=1 ),"
				+ " tbl2 as("
				+ "	select construction_id,construction_id construction_code, work_item_id ,code,name,min(startingDate)start_date,max(completeDate)end_date,round(avg(completeValue),2)complete_percent,"
				+ " status,sysGroupId,sysGroupName"
				+ " from tbl group by construction_id,work_item_id,code,name,status,sysGroupId,sysGroupName)"
				+ " "
				+ " select"
				+ " cnt.code cntContractCode,"
				+ " (select code from CAT_STATION cat where cat.CAT_STATION_ID= a.CAT_STATION_ID and cat.status=1) catStationCode,"
				+ " a.code constructionCode,a.status,"
				+ " round(avg(c.complete_percent),2) completeValue"
				+ " from cnt_contract cnt, construction a,"
				+ " (select distinct cnt_contract_id,construction_id from CNT_CONSTR_WORK_ITEM_TASK a where a.status=1 ) b,"
				+ " tbl2 c"
				+ " where cnt.cnt_contract_id=b.cnt_contract_id and cnt.contract_type=0 and cnt.STATUS !=0 and a.construction_id=b.construction_id and a.construction_id=c.construction_id"
				);
		return stringBuilder;
	}
	private StringBuilder buildQueryReportContractDetail() {
		StringBuilder stringBuilder = new StringBuilder("with tbl as(select b.construction_id ,b.work_item_id ,"
				+ " b.name, b.code,b.status, b.Constructor_id sysGroupId,"
				+ " case when Is_internal=1 then (select name from sys_group sys where sys.sys_group_id=b.Constructor_id)"
				+ " when Is_internal=2 then (select name from CAT_PARTNER cat where cat.CAT_PARTNER_id=b.Constructor_id) end sysGroupName,"
				+ " (select start_date from (select ct.start_date from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp"
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) startingDate, "
				+ " (select end_date from (select ct.end_date from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp"
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID"
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) completeDate, "
				+ " (select nvl(complete_percent,0) from (select ct.complete_percent from CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp"
				+ " where ct.task_name=a.name and ct.level_id=4 and ct.type=1 and ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID"
				+ " and dmp.SIGN_STATE = 3 AND dmp.status = 1 order by ct.DETAIL_MONTH_PLAN_ID desc) where ROWNUM <2) completeValue"
				+ "	from cat_task a,WORK_ITEM b where a.CAT_WORK_ITEM_TYPE_ID=b.CAT_WORK_ITEM_TYPE_ID"
				+ " and a.STATUS=1 ),"
				+ " tbl2 as("
				+ "	select construction_id,construction_id construction_code, work_item_id ,code,name,min(startingDate)start_date,max(completeDate)end_date,round(avg(completeValue),2)complete_percent,"
				+ " status,sysGroupId,sysGroupName"
				+ " from tbl group by construction_id,work_item_id,code,name,status,sysGroupId,sysGroupName)"
				+ " "
				+ " select"
				+ " cnt.code cntContractCode,"
				+ " (select code from CAT_STATION cat where cat.CAT_STATION_ID= a.CAT_STATION_ID and cat.status=1) catStationCode,"
				+ " a.code constructionCode,a.status,c.name workItemName,c.sysGroupName,"
				+ " round(avg(c.complete_percent),2) completeValueWorkItem,"
				+ " (select distinct name from cnt_contract cnt_in,CNT_CONSTR_WORK_ITEM_TASK task where cnt_in.cnt_contract_id=task.cnt_contract_id and cnt_in.contract_type=1"
				+ " and c.work_item_id=task.work_item_id"
				+ " ) listContractIn"
				+ " from cnt_contract cnt, construction a,"
				+ " (select distinct cnt_contract_id,construction_id from CNT_CONSTR_WORK_ITEM_TASK a where a.status=1 ) b,"
				+ " tbl2 c"
				+ " where cnt.cnt_contract_id=b.cnt_contract_id and cnt.contract_type=0 and cnt.STATUS !=0 and a.construction_id=b.construction_id and a.construction_id=c.construction_id"
				);
		return stringBuilder;
	}
	public List<CntConstrWorkItemTaskDTO> getConstructionByContractId(CntConstrWorkItemTaskDTO criteria) {
		StringBuilder stringBuilder = new StringBuilder("SELECT DISTINCT(T1.CONSTRUCTION_ID) constructionId, T1.CODE constructionCode, T1.NAME constructionName, T1.STATUS status FROM CONSTRUCTION T1"
				+ " JOIN CNT_CONSTR_WORK_ITEM_TASK T2 on T1.CONSTRUCTION_ID = T2.CONSTRUCTION_ID"
				+ " WHERE T2.CNT_CONTRACT_ID = :cntContractId AND T2.STATUS = 1");
		if(StringUtils.isNotEmpty(criteria.getKeySearch())){
			stringBuilder.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		query.addScalar("constructionId", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("constructionName", new StringType());
		query.addScalar("status", new LongType());
		query.setParameter("cntContractId", criteria.getCntContractId());
		if(StringUtils.isNotEmpty(criteria.getKeySearch())){
			query.setParameter("key", "%"+criteria.getKeySearch()+"%");
		}
		query.setResultTransformer(Transformers
				.aliasToBean(CntConstrWorkItemTaskDTO.class));
		List<CntConstrWorkItemTaskDTO> list = query.list();
		criteria.setTotalRecord(list.size());
		return list;
	}


	//hienvd: Start 8/7/2019
	public List<CntAppendixJobDTO> doSearchAppendixJob(CntAppendixJobDTO criteria) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CONSTRUCTION_ID constructionId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.PRICE price ");
		stringBuilder.append(",T1.QUANTITY quantity ");
		stringBuilder.append(",T1.CAT_UNIT_ID catUnitId ");
		stringBuilder.append(",T1.CAT_TASK_ID catTaskId ");
		stringBuilder.append(",T1.WORK_ITEM_ID workItemId ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",T1.CNT_CONSTR_WORK_ITEM_TASK_HCQT_ID cntWorkItemTaskHSQTId ");
		stringBuilder.append(",T2.CODE constructionCode ");
		stringBuilder.append(",T2.NAME constructionName ");
		stringBuilder.append(",T3.WORK_ITEM_NAME workItemName ");
		stringBuilder.append(",T6.WORK_ITEM_TYPE_NAME workItemTypeName ");
		stringBuilder.append(",T4.CAT_TASK_NAME catTaskName ");
		stringBuilder.append(",T4.CAT_TASK_CODE catTaskCode ");
		stringBuilder.append(",T5.NAME catUnitName ");

		stringBuilder.append("FROM CNT_CONSTR_WORK_ITEM_TASK_HCQT T1 ");
		stringBuilder.append("LEFT JOIN CTCT_COMS_OWNER.CONSTRUCTION T2 ON T1.CONSTRUCTION_ID = T2.CONSTRUCTION_ID  ");
		stringBuilder.append("LEFT JOIN CTCT_IMS_OWNER.WORK_ITEM_HCQT T3 ON T1.WORK_ITEM_ID = T3.WORK_ITEM_ID  ");
		stringBuilder.append("LEFT JOIN CTCT_IMS_OWNER.WORK_ITEM_TYPE_HCQT T6 ON T3.WORK_ITEM_TYPE_ID = T6.WORK_ITEM_TYPE_ID  ");
		stringBuilder.append("LEFT JOIN CTCT_IMS_OWNER.CAT_TASK_HCQT T4 ON T1.CAT_TASK_ID = T4.CAT_TASK_ID  ");
		stringBuilder.append("LEFT JOIN CTCT_CAT_OWNER.CAT_UNIT T5 ON T1.CAT_UNIT_ID = T5.CAT_UNIT_ID  ");

		stringBuilder.append("WHERE 1=1 AND T1.STATUS = 1 ");
		if(null != criteria.getKeySearch()) {
			stringBuilder.append(" AND (UPPER(T2.NAME) like UPPER(:key) OR UPPER(T2.CODE) like UPPER(:key) ");
			stringBuilder.append(" OR UPPER(T6.WORK_ITEM_TYPE_NAME) like UPPER(:key) OR UPPER(T3.WORK_ITEM_NAME) like UPPER(:key) OR UPPER(T4.CAT_TASK_NAME) like UPPER(:key) escape '&')");
		}
		if (null != criteria.getCntContractId()) {
			stringBuilder.append("AND T1.CNT_CONTRACT_ID = :cntContractId ");
		}

		stringBuilder.append("ORDER BY CNT_CONSTR_WORK_ITEM_TASK_HCQT_ID ");

		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("constructionId", new LongType());
//		query.addScalar("updatedGroupId", new LongType());
//		query.addScalar("updatedUserId", new LongType());
//		query.addScalar("updatedDate", new DateType());
//		query.addScalar("createdGroupId", new LongType());
//		query.addScalar("createdUserId", new LongType());
//		query.addScalar("createdDate", new DateType());
		query.addScalar("status", new LongType());
		query.addScalar("description", new StringType());
		query.addScalar("price", new DoubleType());
		query.addScalar("quantity", new LongType());
		query.addScalar("catUnitId", new LongType());
		query.addScalar("catTaskId", new LongType());
		query.addScalar("workItemId", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("cntWorkItemTaskHSQTId", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("constructionName", new StringType());
		query.addScalar("workItemName", new StringType());
		query.addScalar("catUnitName", new StringType());
		query.addScalar("catTaskName", new StringType());
		query.addScalar("workItemTypeName", new StringType());
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

	//hienvd: End

	//Huypq-20190919-start Báo cáo hạ tầng cho thuê
	public List<CntConstrWorkItemTaskDTO> doSearchReportHTCT(CntConstrWorkItemTaskDTO obj) {
		StringBuilder sql = new StringBuilder(" SELECT cat.code catStationCodeCtct, " +
				"  cntTask.STATION_HTCT catStationCodeViettel, " +
				"  cat.ADDRESS address, " +
				"  prov.name catProvinceName, " +
				"  prov.code catProvinceCode, " +
				"  cat.LONGITUDE longitude, " +
				"  cat.LATITUDE latitude, " +
				"  cst.code constructionCode, " +
				"  CASE " +
				"    WHEN cst.LOCATION_HTCT=1 " +
				"    THEN 'Trên mái' " +
				"    WHEN cst.LOCATION_HTCT=2 " +
				"    THEN 'Dưới đất' " +
				"  END location, " +
				"  cst.HIGH_HTCT highHtct, " +
				"  cst.CAPEX_HTCT capexHtct, " +
				"  partner.name partnerName, " +
				"  cnt.code cntContractCode, " +
				"  cntTask.STATION_HTCT stationHtct, " +
				"  cnt.price price, " +
				"  TO_CHAR(cnt.START_TIME,'dd/MM/yyyy') contractHlDate, " +
				"  TO_CHAR(payment.payment_date,'dd/MM/yyyy')paymentFrom, " +
				"  TO_CHAR(payment.payment_date_to,'dd/MM/yyyy') paymentTo, " +
				"  payment.PAYMENT_PRICE paymentPrice, " +
				"  TO_CHAR( " +
				"  (SELECT MIN(PAYMENT_DATE) " +
				"  FROM CNT_CONTRACT_PAYMENT b " +
				"  WHERE payment.CNT_CONTRACT_id=b.CNT_CONTRACT_id " +
				"  AND b.PAYMENT_DATE           > payment.PAYMENT_DATE " +
				"  ),'dd/MM/yyyy') paymentContinue " +
				" ,case when cnt.TYPE_HTCT=1 then 'Hợp đồng cho thuê hạ tầng'  when cnt.TYPE_HTCT=2 then 'Hợp đồng thuê mặt bằng' "
				+ " when cnt.TYPE_HTCT=3 then 'Hợp đồng tư vấn' when cnt.TYPE_HTCT=4 then 'Hợp đồng xây lắp' when cnt.TYPE_HTCT=5 then 'Hợp đồng khác' end contractType   " +
				" ,catType.name projectType " +
				"FROM CNT_CONTRACT cnt " +
				"LEFT JOIN CNT_CONSTR_WORK_ITEM_TASK cntTask " +
				"ON cnt.CNT_CONTRACT_id=cntTask.CNT_CONTRACT_id " +
				"LEFT JOIN CONSTRUCTION cst " +
				"ON cst.CONSTRUCTION_id=cntTask.CONSTRUCTION_id " +
				"LEFT JOIN CAT_STATION cat " +
				"ON cat.CAT_STATION_ID=cst.CAT_STATION_ID " +
				"LEFT JOIN cat_province prov " +
				"ON cat.cat_province_id=prov.cat_province_id " +
				"LEFT JOIN CAT_PARTNER partner " +
				"ON cnt.CAT_PARTNER_id=partner.CAT_PARTNER_id " +
				"LEFT JOIN CNT_CONTRACT_PAYMENT payment " +
				"ON cnt.CNT_CONTRACT_id    =payment.CNT_CONTRACT_id " +
				"AND payment.status        =1 "
				+ " LEFT JOIN CTCT_CAT_OWNER.CAT_STATION_TYPE catType on cat.CAT_STATION_TYPE_id=catType.CAT_STATION_TYPE_id and cst.CHECK_HTCT=1 " +
				"WHERE cnt.TYPE_HTCT      IN(1,2,3,4,5)  " +
//				"AND cntTask.STATION_HTCT IS NOT NULL " +
				"AND cnt.status           !=0 ");
				//Huypq-20190926-start
				sql.append(" AND nvl(cst.status,1) != 0 and nvl(cntTask.STATUS,1) != 0 ");
				//Huy-end

		if(StringUtils.isNotBlank(obj.getKeySearch())) {
			sql.append(" and (upper(cnt.code) like upper(:keySearch) escape '&' "
					+ " OR upper(cat.code) like upper(:keySearch) escape '&' "
					+ " OR upper(cst.code) like upper(:keySearch) escape '&' "
					+ " OR upper(cntTask.STATION_HTCT) like upper(:keySearch) escape '&' "
					+ ")");
		}

		if(obj.getContractTypeLst()!=null && obj.getContractTypeLst().size()>0) {
			sql.append(" and cnt.TYPE_HTCT in (:contractTypeLst) ");
		}

		sql.append(" order by cat.code asc ");

		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("catStationCodeCtct", new StringType());
		query.addScalar("catStationCodeViettel", new StringType());
		query.addScalar("address", new StringType());
		query.addScalar("catProvinceName", new StringType());
		query.addScalar("catProvinceCode", new StringType());
		query.addScalar("longitude", new StringType());
		query.addScalar("latitude", new StringType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("location", new StringType());
		query.addScalar("highHtct", new StringType());
		query.addScalar("capexHtct", new StringType());
		query.addScalar("partnerName", new StringType());
		query.addScalar("cntContractCode", new StringType());
		query.addScalar("stationHtct", new StringType());
		query.addScalar("price", new DoubleType());
		query.addScalar("contractHlDate", new StringType());
		query.addScalar("paymentFrom", new StringType());
		query.addScalar("paymentTo", new StringType());
		query.addScalar("paymentPrice", new StringType());
		query.addScalar("paymentContinue", new StringType());
		query.addScalar("contractType", new StringType());
		query.addScalar("projectType", new StringType());

		query.setResultTransformer(Transformers.aliasToBean(CntConstrWorkItemTaskDTO.class));

		if(org.apache.commons.lang3.StringUtils.isNotBlank(obj.getKeySearch())) {
			query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
			queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
		}

		if(obj.getContractTypeLst()!=null && obj.getContractTypeLst().size()>0) {
			query.setParameterList("contractTypeLst", obj.getContractTypeLst());
			queryCount.setParameterList("contractTypeLst", obj.getContractTypeLst());
		}

		if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1)
					* obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}

	public CntConstrWorkItemTaskDTO getIdForCntContractOutHTCT(CntConstrWorkItemTaskDTO obj) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("UNIQUE T1.CONSTRUCTION_ID constructionId ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append("FROM CNT_CONSTR_WORK_ITEM_TASK T1, CNT_CONTRACT B ");
		stringBuilder.append("WHERE T1.CNT_CONTRACT_ID = B.CNT_CONTRACT_ID ");
		stringBuilder.append("AND B.STATUS !=0 AND T1.STATUS=1 ");
		if(null != obj.getConstructionId()) {
			stringBuilder.append("AND T1.CONSTRUCTION_ID = :constructionId");
		}

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("constructionId", new LongType());
		query.addScalar("cntContractId", new LongType());

		if(null != obj.getConstructionId()) {
			query.setParameter("constructionId", obj.getConstructionId());
		}

		query.setResultTransformer(Transformers.aliasToBean(CntConstrWorkItemTaskDTO.class));

		return (CntConstrWorkItemTaskDTO) query.setMaxResults(1).uniqueResult();
	}
	//Huy-end
}
