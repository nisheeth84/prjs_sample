package com.viettel.aio.dao;

import com.viettel.aio.bo.ConstructionBO;;
import com.viettel.aio.dto.CntConstrWorkItemTaskDTO;
import com.viettel.aio.dto.CntContractDTO;
import com.viettel.aio.dto.ConstructionDTO;
import com.viettel.cat.dto.CatTaskDTO;
import com.viettel.coms.dto.WorkItemDTO;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @author hailh10
 */
@Repository("AIOconstructionDAO")
public class ConstructionDAO extends BaseFWDAOImpl<ConstructionBO, Long> {

    public ConstructionDAO() {
        this.model = new ConstructionBO();
    }

    public ConstructionDAO(Session session) {
        this.session = session;
    }	
    
    @SuppressWarnings("unchecked")
	public List<ConstructionDTO> doSearch(ConstructionDTO criteria) {
    	StringBuilder stringBuilder = getSelectAllQuery();
    	stringBuilder.append("WHERE 1=1 ");
    	
    	if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			stringBuilder
					.append(" AND (UPPER(NAME) like UPPER(:key) OR UPPER(CODE) like UPPER(:key) escape '&')");
		}

    	
		if (StringUtils.isNotEmpty(criteria.getStatus())) {
			stringBuilder.append("AND UPPER(T1.STATUS) LIKE UPPER(:status) ");
		} else {
			stringBuilder.append("AND T1.STATUS != '0' ");
		}
		
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");
		
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
    	
		query.addScalar("constructionId", new LongType());
		query.addScalar("approveRevenueState", new StringType());
		query.addScalar("approveCompleteState", new StringType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("month", new LongType());
		query.addScalar("year", new LongType());
		query.addScalar("sysGroupId", new StringType());
//		query.addScalar("sysGroupName", new StringType());
		query.addScalar("catPartnerId", new StringType());
//		query.addScalar("catPartnerName", new StringType());
		query.addScalar("handoverDate", new DateType());
		query.addScalar("handoverNote", new StringType());
		query.addScalar("startingDate", new DateType());
		query.addScalar("excpectedCompleteDate", new DateType());
		query.addScalar("completeDate", new DateType());
		query.addScalar("startingNote", new StringType());
		query.addScalar("isObstructed", new StringType());
		query.addScalar("obstructedState", new StringType());
		query.addScalar("obstructedContent", new StringType());
		query.addScalar("broadcastingDate", new DateType());
		query.addScalar("description", new StringType());
		query.addScalar("isReturn", new StringType());
		query.addScalar("completeValue", new StringType());
		query.addScalar("approveCompleteValue", new DoubleType());
		query.addScalar("approveCompleteDate", new DateType());
		query.addScalar("approveCompleteUserId", new LongType());
//		query.addScalar("approveCompleteUserName", new StringType());
		query.addScalar("approveCompleteDescription", new StringType());
		query.addScalar("approveRevenueValue", new DoubleType());
		query.addScalar("approveRevenueDate", new DateType());
		query.addScalar("approveRevenueUserId", new LongType());
//		query.addScalar("approveRevenueUserName", new StringType());
		query.addScalar("approveRevenueDescription", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
//		query.addScalar("createdUserName", new StringType());
		query.addScalar("createdGroupId", new LongType());
//		query.addScalar("createdGroupName", new StringType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
//		query.addScalar("updatedUserName", new StringType());
		query.addScalar("updatedGroupId", new LongType());
//		query.addScalar("updatedGroupName", new StringType());
		query.addScalar("catConstructionTypeId", new LongType());
//		query.addScalar("catConstructionTypeName", new StringType());
		query.addScalar("status", new StringType());
		query.addScalar("catConstructionDeployId", new LongType());
//		query.addScalar("catConstructionDeployName", new StringType());
		query.addScalar("region", new LongType());
		query.addScalar("catStationId", new LongType());
//		query.addScalar("catStationName", new StringType());
		query.addScalar("returner", new StringType());
		query.addScalar("returnDate", new DateType());
		
		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			query.setParameter("key", "%" + criteria.getKeySearch() + "%");
			queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
		}
		
		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			query.setParameter("key", "%" + criteria.getKeySearch() + "%");
			queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
		}
		
		if (null != criteria.getStatus()) {
			query.setParameter("status", criteria.getStatus());
			queryCount.setParameter("status", criteria.getStatus());
		}
    	

		query.setResultTransformer(Transformers
				.aliasToBean(ConstructionDTO.class));
		
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1)
					* criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}  
	
    
    
    
	public ConstructionDTO findByCode(String value) {
		StringBuilder stringBuilder = getSelectAllQuery();
    	stringBuilder.append("WHERE status != '0' AND upper(T1.CODE) = upper(:value)");	
    	
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
		query.addScalar("constructionId", new LongType());
		query.addScalar("approveRevenueState", new StringType());
		query.addScalar("approveCompleteState", new StringType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("month", new LongType());
		query.addScalar("year", new LongType());
		query.addScalar("sysGroupId", new StringType());
		query.addScalar("catPartnerId", new StringType());
		query.addScalar("handoverDate", new DateType());
		query.addScalar("handoverNote", new StringType());
		query.addScalar("startingDate", new DateType());
		query.addScalar("excpectedCompleteDate", new DateType());
		query.addScalar("completeDate", new DateType());
		query.addScalar("startingNote", new StringType());
		query.addScalar("isObstructed", new StringType());
		query.addScalar("obstructedState", new StringType());
		query.addScalar("obstructedContent", new StringType());
		query.addScalar("broadcastingDate", new DateType());
		query.addScalar("description", new StringType());
		query.addScalar("isReturn", new StringType());
		query.addScalar("completeValue", new StringType());
		query.addScalar("approveCompleteValue", new DoubleType());
		query.addScalar("approveCompleteDate", new DateType());
		query.addScalar("approveCompleteUserId", new LongType());
		query.addScalar("approveCompleteDescription", new StringType());
		query.addScalar("approveRevenueValue", new DoubleType());
		query.addScalar("approveRevenueDate", new DateType());
		query.addScalar("approveRevenueUserId", new LongType());
		query.addScalar("approveRevenueDescription", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("catConstructionTypeId", new LongType());
		query.addScalar("status", new StringType());
		query.addScalar("catConstructionDeployId", new LongType());
		query.addScalar("region", new LongType());
		query.addScalar("catStationId", new LongType());
		query.addScalar("returner", new StringType());
		query.addScalar("returnDate", new DateType());
    	
		query.setParameter("value", value);    	
		query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));    	

		return (ConstructionDTO) query.uniqueResult();
	}
	

	public List<ConstructionDTO> doSearchForImport(ConstructionDTO obj) {
		StringBuilder stringBuilder = getSelectAllQuery();
		stringBuilder.append(" Where STATUS != 0");
		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			stringBuilder.append(" AND (UPPER(NAME) like UPPER(:key) OR UPPER(CODE) like UPPER(:key) escape '&')");
		}
		stringBuilder.append(" ORDER BY NAME");
		
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		
		query.addScalar("constructionId", new LongType());
		query.addScalar("approveRevenueState", new StringType());
		query.addScalar("approveCompleteState", new StringType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("month", new LongType());
		query.addScalar("year", new LongType());
		query.addScalar("sysGroupId", new StringType());
		query.addScalar("catPartnerId", new StringType());
		query.addScalar("handoverDate", new DateType());
		query.addScalar("handoverNote", new StringType());
		query.addScalar("startingDate", new DateType());
		query.addScalar("excpectedCompleteDate", new DateType());
		query.addScalar("completeDate", new DateType());
		query.addScalar("startingNote", new StringType());
		query.addScalar("isObstructed", new StringType());
		query.addScalar("obstructedState", new StringType());
		query.addScalar("obstructedContent", new StringType());
		query.addScalar("broadcastingDate", new DateType());
		query.addScalar("description", new StringType());
		query.addScalar("isReturn", new StringType());
		query.addScalar("completeValue", new StringType());
		query.addScalar("approveCompleteValue", new DoubleType());
		query.addScalar("approveCompleteDate", new DateType());
		query.addScalar("approveCompleteUserId", new LongType());
		query.addScalar("approveCompleteDescription", new StringType());
		query.addScalar("approveRevenueValue", new DoubleType());
		query.addScalar("approveRevenueDate", new DateType());
		query.addScalar("approveRevenueUserId", new LongType());
		query.addScalar("approveRevenueDescription", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("catConstructionTypeId", new LongType());
		query.addScalar("status", new StringType());
		query.addScalar("catConstructionDeployId", new LongType());
		query.addScalar("region", new LongType());
		query.addScalar("catStationId", new LongType());
		query.addScalar("returner", new StringType());
		query.addScalar("returnDate", new DateType());
	
		query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));

		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			query.setParameter("key","%"+ obj.getKeySearch()+"%");
		}

		return query.list();
	}
	

	public List<ConstructionDTO> getForAutoComplete(ConstructionDTO obj) {
		StringBuilder stringBuilder = getSelectAllQuery();
		stringBuilder.append(" Where STATUS != 0");
		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			stringBuilder.append(" AND (UPPER(NAME) like UPPER(:key) OR UPPER(CODE) like UPPER(:key) escape '&')");
		}
		stringBuilder.append(" ORDER BY NAME");
		
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		
		query.addScalar("constructionId", new LongType());
		query.addScalar("approveRevenueState", new StringType());
		query.addScalar("approveCompleteState", new StringType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("month", new LongType());
		query.addScalar("year", new LongType());
		query.addScalar("sysGroupId", new StringType());
		query.addScalar("catPartnerId", new StringType());
		query.addScalar("handoverDate", new DateType());
		query.addScalar("handoverNote", new StringType());
		query.addScalar("startingDate", new DateType());
		query.addScalar("excpectedCompleteDate", new DateType());
		query.addScalar("completeDate", new DateType());
		query.addScalar("startingNote", new StringType());
		query.addScalar("isObstructed", new StringType());
		query.addScalar("obstructedState", new StringType());
		query.addScalar("obstructedContent", new StringType());
		query.addScalar("broadcastingDate", new DateType());
		query.addScalar("description", new StringType());
		query.addScalar("isReturn", new StringType());
		query.addScalar("completeValue", new StringType());
		query.addScalar("approveCompleteValue", new DoubleType());
		query.addScalar("approveCompleteDate", new DateType());
		query.addScalar("approveCompleteUserId", new LongType());
		query.addScalar("approveCompleteDescription", new StringType());
		query.addScalar("approveRevenueValue", new DoubleType());
		query.addScalar("approveRevenueDate", new DateType());
		query.addScalar("approveRevenueUserId", new LongType());
		query.addScalar("approveRevenueDescription", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("catConstructionTypeId", new LongType());
		query.addScalar("status", new StringType());
		query.addScalar("catConstructionDeployId", new LongType());
		query.addScalar("region", new LongType());
		query.addScalar("catStationId", new LongType());
		query.addScalar("returner", new StringType());
		query.addScalar("returnDate", new DateType());
	
		query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));

		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			query.setParameter("key","%"+ obj.getKeySearch()+"%");
		}

		query.setMaxResults(20);
		return query.list();
	}
	
	public List<ConstructionDTO> getForAutoCompleteHTCT(ConstructionDTO obj) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CONSTRUCTION_ID constructionId ");
		stringBuilder.append(",T1.CODE code ");
		stringBuilder.append(",T1.NAME name ");
    	
    	stringBuilder.append("FROM CONSTRUCTION T1 ");    	
		stringBuilder.append(" Where T1.STATUS != 0 AND T1.CHECK_HTCT =1");
		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			stringBuilder.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
		stringBuilder.append(" ORDER BY NAME");
		
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		
		query.addScalar("constructionId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));
		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			query.setParameter("key","%"+ obj.getKeySearch()+"%");
		}
		query.setMaxResults(20);
		return query.list();
	}
	
	@SuppressWarnings("unchecked")
	public ConstructionDTO getById(Long id) {
    	StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CONSTRUCTION_ID constructionId ");
		stringBuilder.append(",T1.APPROVE_REVENUE_STATE approveRevenueState ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_STATE approveCompleteState ");
		stringBuilder.append(",T1.CODE code ");
		stringBuilder.append(",T1.NAME name ");
		stringBuilder.append(",T1.MONTH month ");
		stringBuilder.append(",T1.YEAR year ");
		stringBuilder.append(",T1.SYS_GROUP_ID sysGroupId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM SYS_GROUP WHERE SYS_GROUP_ID = T1.SYS_GROUP_ID) sysGroupName  ");
		stringBuilder.append(",T1.CAT_PARTNER_ID catPartnerId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CAT_PARTNER WHERE CAT_PARTNER_ID = T1.CAT_PARTNER_ID) catPartnerName  ");
		stringBuilder.append(",T1.HANDOVER_DATE handoverDate ");
		stringBuilder.append(",T1.HANDOVER_NOTE handoverNote ");
		stringBuilder.append(",T1.STARTING_DATE startingDate ");
		stringBuilder.append(",T1.EXCPECTED_COMPLETE_DATE excpectedCompleteDate ");
		stringBuilder.append(",T1.COMPLETE_DATE completeDate ");
		stringBuilder.append(",T1.STARTING_NOTE startingNote ");
		stringBuilder.append(",T1.IS_OBSTRUCTED isObstructed ");
		stringBuilder.append(",T1.OBSTRUCTED_STATE obstructedState ");
		stringBuilder.append(",T1.OBSTRUCTED_CONTENT obstructedContent ");
		stringBuilder.append(",T1.BROADCASTING_DATE broadcastingDate ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.IS_RETURN isReturn ");
		stringBuilder.append(",T1.COMPLETE_VALUE completeValue ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_VALUE approveCompleteValue ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_DATE approveCompleteDate ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_USER_ID approveCompleteUserId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM APPROVE_COMPLETE_USER WHERE APPROVE_COMPLETE_USER_ID = T1.APPROVE_COMPLETE_USER_ID) approveCompleteUserName  ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_DESCRIPTION approveCompleteDescription ");
		stringBuilder.append(",T1.APPROVE_REVENUE_VALUE approveRevenueValue ");
		stringBuilder.append(",T1.APPROVE_REVENUE_DATE approveRevenueDate ");
		stringBuilder.append(",T1.APPROVE_REVENUE_USER_ID approveRevenueUserId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM APPROVE_REVENUE_USER WHERE APPROVE_REVENUE_USER_ID = T1.APPROVE_REVENUE_USER_ID) approveRevenueUserName  ");
		stringBuilder.append(",T1.APPROVE_REVENUE_DESCRIPTION approveRevenueDescription ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CREATED_USER WHERE CREATED_USER_ID = T1.CREATED_USER_ID) createdUserName  ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CREATED_GROUP WHERE CREATED_GROUP_ID = T1.CREATED_GROUP_ID) createdGroupName  ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM UPDATED_USER WHERE UPDATED_USER_ID = T1.UPDATED_USER_ID) updatedUserName  ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM UPDATED_GROUP WHERE UPDATED_GROUP_ID = T1.UPDATED_GROUP_ID) updatedGroupName  ");
		stringBuilder.append(",T1.CAT_CONSTRUCTION_TYPE_ID catConstructionTypeId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CAT_CONSTRUCTION_TYPE WHERE CAT_CONSTRUCTION_TYPE_ID = T1.CAT_CONSTRUCTION_TYPE_ID) catConstructionTypeName  ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.CAT_CONSTRUCTION_DEPLOY_ID catConstructionDeployId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CAT_CONSTRUCTION_DEPLOY WHERE CAT_CONSTRUCTION_DEPLOY_ID = T1.CAT_CONSTRUCTION_DEPLOY_ID) catConstructionDeployName  ");
		stringBuilder.append(",T1.REGION region ");
		stringBuilder.append(",T1.CAT_STATION_ID catStationId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CAT_STATION WHERE CAT_STATION_ID = T1.CAT_STATION_ID) catStationName  ");
		stringBuilder.append(",T1.RETURNER returner ");
		stringBuilder.append(",T1.RETURN_DATE returnDate ");

    	stringBuilder.append("FROM CONSTRUCTION T1 ");    	
    	stringBuilder.append("WHERE T1.IS_DELETED = 'N' AND T1.CONSTRUCTION_ID = :constructionId ");
    	
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
		query.addScalar("constructionId", new LongType());
		query.addScalar("approveRevenueState", new StringType());
		query.addScalar("approveCompleteState", new StringType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("month", new LongType());
		query.addScalar("year", new LongType());
		query.addScalar("sysGroupId", new StringType());
		query.addScalar("sysGroupName", new StringType());
		query.addScalar("catPartnerId", new StringType());
		query.addScalar("catPartnerName", new StringType());
		query.addScalar("handoverDate", new DateType());
		query.addScalar("handoverNote", new StringType());
		query.addScalar("startingDate", new DateType());
		query.addScalar("excpectedCompleteDate", new DateType());
		query.addScalar("completeDate", new DateType());
		query.addScalar("startingNote", new StringType());
		query.addScalar("isObstructed", new StringType());
		query.addScalar("obstructedState", new StringType());
		query.addScalar("obstructedContent", new StringType());
		query.addScalar("broadcastingDate", new DateType());
		query.addScalar("description", new StringType());
		query.addScalar("isReturn", new StringType());
		query.addScalar("completeValue", new StringType());
		query.addScalar("approveCompleteValue", new DoubleType());
		query.addScalar("approveCompleteDate", new DateType());
		query.addScalar("approveCompleteUserId", new LongType());
		query.addScalar("approveCompleteUserName", new StringType());
		query.addScalar("approveCompleteDescription", new StringType());
		query.addScalar("approveRevenueValue", new DoubleType());
		query.addScalar("approveRevenueDate", new DateType());
		query.addScalar("approveRevenueUserId", new LongType());
		query.addScalar("approveRevenueUserName", new StringType());
		query.addScalar("approveRevenueDescription", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdUserName", new StringType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("createdGroupName", new StringType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedUserName", new StringType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("updatedGroupName", new StringType());
		query.addScalar("catConstructionTypeId", new LongType());
		query.addScalar("catConstructionTypeName", new StringType());
		query.addScalar("status", new StringType());
		query.addScalar("catConstructionDeployId", new LongType());
		query.addScalar("catConstructionDeployName", new StringType());
		query.addScalar("region", new LongType());
		query.addScalar("catStationId", new LongType());
		query.addScalar("catStationName", new StringType());
		query.addScalar("returner", new StringType());
		query.addScalar("returnDate", new DateType());
    	
		query.setParameter("constructionId", id);
		query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));
    	
		return (ConstructionDTO) query.uniqueResult();
	}
	
	public List<ConstructionDTO> getForAutoCompleteIn(ConstructionDTO obj) {
		StringBuilder stringBuilder = getSelectAllQuery();
		stringBuilder.append(",CNT_CONSTR_WORK_ITEM_TASK T2, CNT_CONTRACT T3 ");
		stringBuilder.append("WHERE T1.STATUS != '0' ");
		stringBuilder.append("AND T1.CONSTRUCTION_ID = T2.CONSTRUCTION_ID ");
		stringBuilder.append("AND T2.CNT_CONTRACT_ID = T3.CNT_CONTRACT_ID ");
		stringBuilder.append("AND T2.STATUS = 1 AND T1.STATUS != 0 ");
		stringBuilder.append("AND T3.CONTRACT_TYPE = 0 AND T3.STATUS != 0 ");
		if(null != obj.getCntContractMapId() && !obj.getCntContractMapId().equals("-1")) {
//			stringBuilder.append("AND T3.CNT_CONTRACT_ID = :cntContractMapId ");
			stringBuilder.append("AND T3.CNT_CONTRACT_ID in :lstContractId ");
		}
		
		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			stringBuilder.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
		stringBuilder.append(" ORDER BY NAME");
		StringBuilder sql = new StringBuilder("SELECT DISTINCT * FROM (");
		sql.append(stringBuilder);
		sql.append(")");
		
		
//		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
//		sqlCount.append(sql.toString());
//		sqlCount.append(")");
//		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		
		query.addScalar("constructionId", new LongType());
		query.addScalar("approveRevenueState", new StringType());
		query.addScalar("approveCompleteState", new StringType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("month", new LongType());
		query.addScalar("year", new LongType());
		query.addScalar("sysGroupId", new StringType());
		query.addScalar("catPartnerId", new StringType());
		query.addScalar("handoverDate", new DateType());
		query.addScalar("handoverNote", new StringType());
		query.addScalar("startingDate", new DateType());
		query.addScalar("excpectedCompleteDate", new DateType());
		query.addScalar("completeDate", new DateType());
		query.addScalar("startingNote", new StringType());
		query.addScalar("isObstructed", new StringType());
		query.addScalar("obstructedState", new StringType());
		query.addScalar("obstructedContent", new StringType());
		query.addScalar("broadcastingDate", new DateType());
		query.addScalar("description", new StringType());
		query.addScalar("isReturn", new StringType());
		query.addScalar("completeValue", new StringType());
		query.addScalar("approveCompleteValue", new DoubleType());
		query.addScalar("approveCompleteDate", new DateType());
		query.addScalar("approveCompleteUserId", new LongType());
		query.addScalar("approveCompleteDescription", new StringType());
		query.addScalar("approveRevenueValue", new DoubleType());
		query.addScalar("approveRevenueDate", new DateType());
		query.addScalar("approveRevenueUserId", new LongType());
		query.addScalar("approveRevenueDescription", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("catConstructionTypeId", new LongType());
		query.addScalar("status", new StringType());
		query.addScalar("catConstructionDeployId", new LongType());
		query.addScalar("region", new LongType());
		query.addScalar("catStationId", new LongType());
		query.addScalar("returner", new StringType());
		query.addScalar("returnDate", new DateType());
		
	
		query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));

		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			query.setParameter("key","%"+ obj.getKeySearch()+"%");
//			queryCount.setParameter("key","%"+ obj.getKeySearch()+"%");
		}
		
//		if(null != obj.getCntContractMapId()) {
//			query.setParameter("cntContractMapId", obj.getCntContractMapId());
//		}
		
		if(null != obj.getCntContractMapId() && !obj.getCntContractMapId().equals("-1")) {
			List<String> lstCntContractId=new ArrayList<String>();
			if(obj.getCntContractMapId().contains(",")){
				lstCntContractId.addAll(Arrays.asList(obj.getCntContractMapId().split(",")));
			}else{
				lstCntContractId.add(obj.getCntContractMapId());
			}
			query.setParameterList("lstContractId", lstCntContractId);
		}
		
//		if (obj.getPage() != null && obj.getPageSize() != null) {
//			query.setFirstResult((obj.getPage().intValue() - 1)
//					* obj.getPageSize().intValue());
//			query.setMaxResults(obj.getPageSize().intValue());
//		}
		query.setMaxResults(20);
		List<ConstructionDTO> lst = query.list();
		obj.setTotalRecord(lst.size());
		return lst;
	}
	
	public List<ConstructionDTO> doSearchIn(ConstructionDTO obj) {
		StringBuilder stringBuilder = getSelectAllQuery();
		stringBuilder.append(",CNT_CONSTR_WORK_ITEM_TASK T2, CNT_CONTRACT T3 ");
		stringBuilder.append("WHERE T1.STATUS != '0' ");
		stringBuilder.append("AND T1.CONSTRUCTION_ID = T2.CONSTRUCTION_ID ");
		stringBuilder.append("AND T2.CNT_CONTRACT_ID = T3.CNT_CONTRACT_ID ");
		stringBuilder.append("AND T2.STATUS = 1 AND T1.STATUS != 0 ");
		stringBuilder.append("AND T3.CONTRACT_TYPE = 0 AND T3.STATUS != 0 ");
		if(null != obj.getCntContractMapId()) {
			stringBuilder.append("AND T3.CNT_CONTRACT_ID in :lstContractId ");
		}
		
		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			stringBuilder.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
		stringBuilder.append(" ORDER BY NAME");
		StringBuilder sql = new StringBuilder("SELECT DISTINCT * FROM (");
		sql.append(stringBuilder);
		sql.append(")");
		
		
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		
		query.addScalar("constructionId", new LongType());
		query.addScalar("approveRevenueState", new StringType());
		query.addScalar("approveCompleteState", new StringType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("month", new LongType());
		query.addScalar("year", new LongType());
		query.addScalar("sysGroupId", new StringType());
		query.addScalar("catPartnerId", new StringType());
		query.addScalar("handoverDate", new DateType());
		query.addScalar("handoverNote", new StringType());
		query.addScalar("startingDate", new DateType());
		query.addScalar("excpectedCompleteDate", new DateType());
		query.addScalar("completeDate", new DateType());
		query.addScalar("startingNote", new StringType());
		query.addScalar("isObstructed", new StringType());
		query.addScalar("obstructedState", new StringType());
		query.addScalar("obstructedContent", new StringType());
		query.addScalar("broadcastingDate", new DateType());
		query.addScalar("description", new StringType());
		query.addScalar("isReturn", new StringType());
		query.addScalar("completeValue", new StringType());
		query.addScalar("approveCompleteValue", new DoubleType());
		query.addScalar("approveCompleteDate", new DateType());
		query.addScalar("approveCompleteUserId", new LongType());
		query.addScalar("approveCompleteDescription", new StringType());
		query.addScalar("approveRevenueValue", new DoubleType());
		query.addScalar("approveRevenueDate", new DateType());
		query.addScalar("approveRevenueUserId", new LongType());
		query.addScalar("approveRevenueDescription", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("catConstructionTypeId", new LongType());
		query.addScalar("status", new StringType());
		query.addScalar("catConstructionDeployId", new LongType());
		query.addScalar("region", new LongType());
		query.addScalar("catStationId", new LongType());
		query.addScalar("returner", new StringType());
		query.addScalar("returnDate", new DateType());
		
	
		query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));

		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			query.setParameter("key","%"+ obj.getKeySearch()+"%");
			queryCount.setParameter("key","%"+ obj.getKeySearch()+"%");
		}
		
		if(null != obj.getCntContractMapId()) {
			List<String> lstCntContractId=new ArrayList<String>();
			if(obj.getCntContractMapId().contains(",")){
				lstCntContractId.addAll(Arrays.asList(obj.getCntContractMapId().split(",")));
			}else{
				lstCntContractId.add(obj.getCntContractMapId());
			}
			query.setParameterList("lstContractId", lstCntContractId);
			queryCount.setParameterList("lstContractId", lstCntContractId);
		}
		
		if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1)
					* obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}
	
	public List<ConstructionDTO> checkForImport(ConstructionDTO obj) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CONSTRUCTION_ID constructionId ");
		stringBuilder.append(",T1.APPROVE_REVENUE_STATE approveRevenueState ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_STATE approveCompleteState ");
		stringBuilder.append(",T1.CODE code ");
		stringBuilder.append(",T1.NAME name ");
		stringBuilder.append(",T1.MONTH month ");
		stringBuilder.append(",T1.YEAR year ");
		stringBuilder.append(",T1.SYS_GROUP_ID sysGroupId ");
		stringBuilder.append(",T1.CAT_PARTNER_ID catPartnerId ");
		stringBuilder.append(",T1.HANDOVER_DATE handoverDate ");
		stringBuilder.append(",T1.HANDOVER_NOTE handoverNote ");
		stringBuilder.append(",T1.STARTING_DATE startingDate ");
		stringBuilder.append(",T1.EXCPECTED_COMPLETE_DATE excpectedCompleteDate ");
		stringBuilder.append(",T1.COMPLETE_DATE completeDate ");
		stringBuilder.append(",T1.STARTING_NOTE startingNote ");
		stringBuilder.append(",T1.IS_OBSTRUCTED isObstructed ");
		stringBuilder.append(",T1.OBSTRUCTED_STATE obstructedState ");
		stringBuilder.append(",T1.OBSTRUCTED_CONTENT obstructedContent ");
		stringBuilder.append(",T1.BROADCASTING_DATE broadcastingDate ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.IS_RETURN isReturn ");
		stringBuilder.append(",T1.COMPLETE_VALUE completeValue ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_VALUE approveCompleteValue ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_DATE approveCompleteDate ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_USER_ID approveCompleteUserId ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_DESCRIPTION approveCompleteDescription ");
		stringBuilder.append(",T1.APPROVE_REVENUE_VALUE approveRevenueValue ");
		stringBuilder.append(",T1.APPROVE_REVENUE_DATE approveRevenueDate ");
		stringBuilder.append(",T1.APPROVE_REVENUE_USER_ID approveRevenueUserId ");
		stringBuilder.append(",T1.APPROVE_REVENUE_DESCRIPTION approveRevenueDescription ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T1.CAT_CONSTRUCTION_TYPE_ID catConstructionTypeId ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.CAT_CONSTRUCTION_DEPLOY_ID catConstructionDeployId ");
		stringBuilder.append(",T1.REGION region ");
		stringBuilder.append(",T1.CAT_STATION_ID catStationId ");
		stringBuilder.append(",T1.RETURNER returner ");
		stringBuilder.append(",T1.RETURN_DATE returnDate ");
		stringBuilder.append(",T2.CNT_CONTRACT_ID cntContractMapId ");
		
    	
    	stringBuilder.append("FROM CONSTRUCTION T1 ");    	
		stringBuilder.append(",CNT_CONSTR_WORK_ITEM_TASK T2, CNT_CONTRACT T3 ");
		stringBuilder.append("WHERE T1.STATUS != '0' ");
		stringBuilder.append("AND T1.CONSTRUCTION_ID = T2.CONSTRUCTION_ID ");
		stringBuilder.append("AND T2.CNT_CONTRACT_ID = T3.CNT_CONTRACT_ID ");
		stringBuilder.append("AND T2.STATUS = 1 AND T1.STATUS != 0 ");
		stringBuilder.append("AND T3.CONTRACT_TYPE = 0 AND T3.STATUS != 0 ");
		if(null != obj.getCntContractMapId()) {
			stringBuilder.append("AND T3.CNT_CONTRACT_ID = :cntContractMapId ");
		}
		
		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			stringBuilder.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
		stringBuilder.append(" ORDER BY NAME");
		StringBuilder sql = new StringBuilder("SELECT DISTINCT * FROM (");
		sql.append(stringBuilder);
		sql.append(")");
		
		
//		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
//		sqlCount.append(sql.toString());
//		sqlCount.append(")");
//		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		
		query.addScalar("constructionId", new LongType());
		query.addScalar("cntContractMapId", new StringType());
		query.addScalar("approveRevenueState", new StringType());
		query.addScalar("approveCompleteState", new StringType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("month", new LongType());
		query.addScalar("year", new LongType());
		query.addScalar("sysGroupId", new StringType());
		query.addScalar("catPartnerId", new StringType());
		query.addScalar("handoverDate", new DateType());
		query.addScalar("handoverNote", new StringType());
		query.addScalar("startingDate", new DateType());
		query.addScalar("excpectedCompleteDate", new DateType());
		query.addScalar("completeDate", new DateType());
		query.addScalar("startingNote", new StringType());
		query.addScalar("isObstructed", new StringType());
		query.addScalar("obstructedState", new StringType());
		query.addScalar("obstructedContent", new StringType());
		query.addScalar("broadcastingDate", new DateType());
		query.addScalar("description", new StringType());
		query.addScalar("isReturn", new StringType());
		query.addScalar("completeValue", new StringType());
		query.addScalar("approveCompleteValue", new DoubleType());
		query.addScalar("approveCompleteDate", new DateType());
		query.addScalar("approveCompleteUserId", new LongType());
		query.addScalar("approveCompleteDescription", new StringType());
		query.addScalar("approveRevenueValue", new DoubleType());
		query.addScalar("approveRevenueDate", new DateType());
		query.addScalar("approveRevenueUserId", new LongType());
		query.addScalar("approveRevenueDescription", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("catConstructionTypeId", new LongType());
		query.addScalar("status", new StringType());
		query.addScalar("catConstructionDeployId", new LongType());
		query.addScalar("region", new LongType());
		query.addScalar("catStationId", new LongType());
		query.addScalar("returner", new StringType());
		query.addScalar("returnDate", new DateType());
		
	
		query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));

		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			query.setParameter("key","%"+ obj.getKeySearch()+"%");
//			queryCount.setParameter("key","%"+ obj.getKeySearch()+"%");
		}
		
		if(null != obj.getCntContractMapId()) {
			query.setParameter("cntContractMapId", obj.getCntContractMapId());
//			queryCount.setParameter("cntContractMapId", obj.getCntContractMapId());
		}
		
//		if (obj.getPage() != null && obj.getPageSize() != null) {
//			query.setFirstResult((obj.getPage().intValue() - 1)
//					* obj.getPageSize().intValue());
//			query.setMaxResults(obj.getPageSize().intValue());
//		}
		List<ConstructionDTO> lst = query.list();
		return lst;
	}
	
	public StringBuilder getSelectAllQuery(){
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CONSTRUCTION_ID constructionId ");
		stringBuilder.append(",T1.APPROVE_REVENUE_STATE approveRevenueState ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_STATE approveCompleteState ");
		stringBuilder.append(",T1.CODE code ");
		stringBuilder.append(",T1.NAME name ");
		stringBuilder.append(",T1.MONTH month ");
		stringBuilder.append(",T1.YEAR year ");
		stringBuilder.append(",T1.SYS_GROUP_ID sysGroupId ");
		stringBuilder.append(",T1.CAT_PARTNER_ID catPartnerId ");
		stringBuilder.append(",T1.HANDOVER_DATE handoverDate ");
		stringBuilder.append(",T1.HANDOVER_NOTE handoverNote ");
		stringBuilder.append(",T1.STARTING_DATE startingDate ");
		stringBuilder.append(",T1.EXCPECTED_COMPLETE_DATE excpectedCompleteDate ");
		stringBuilder.append(",T1.COMPLETE_DATE completeDate ");
		stringBuilder.append(",T1.STARTING_NOTE startingNote ");
		stringBuilder.append(",T1.IS_OBSTRUCTED isObstructed ");
		stringBuilder.append(",T1.OBSTRUCTED_STATE obstructedState ");
		stringBuilder.append(",T1.OBSTRUCTED_CONTENT obstructedContent ");
		stringBuilder.append(",T1.BROADCASTING_DATE broadcastingDate ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.IS_RETURN isReturn ");
		stringBuilder.append(",T1.COMPLETE_VALUE completeValue ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_VALUE approveCompleteValue ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_DATE approveCompleteDate ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_USER_ID approveCompleteUserId ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_DESCRIPTION approveCompleteDescription ");
		stringBuilder.append(",T1.APPROVE_REVENUE_VALUE approveRevenueValue ");
		stringBuilder.append(",T1.APPROVE_REVENUE_DATE approveRevenueDate ");
		stringBuilder.append(",T1.APPROVE_REVENUE_USER_ID approveRevenueUserId ");
		stringBuilder.append(",T1.APPROVE_REVENUE_DESCRIPTION approveRevenueDescription ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T1.CAT_CONSTRUCTION_TYPE_ID catConstructionTypeId ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.CAT_CONSTRUCTION_DEPLOY_ID catConstructionDeployId ");
		stringBuilder.append(",T1.REGION region ");
		stringBuilder.append(",T1.CAT_STATION_ID catStationId ");
		stringBuilder.append(",T1.RETURNER returner ");
		stringBuilder.append(",T1.RETURN_DATE returnDate ");
    	
    	stringBuilder.append("FROM CONSTRUCTION T1 ");    	
    	return stringBuilder;
	}
	
	//Huypq-20190916-start
	public List<ConstructionDTO> getDataConstructionImport(){
		StringBuilder sql = new StringBuilder("select construction_id constructionId, code code from construction where status!=0 and construction_id not in ("
				+ " select construction_id from CNT_CONSTR_WORK_ITEM_TASK a where a.status !=0 ) ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("constructionId", new LongType());
		query.addScalar("code", new StringType());
		query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));
		return query.list();
	}
	
	public List<CntContractDTO> getDataContractImport(CntContractDTO obj){
		StringBuilder sql = new StringBuilder("select CNT_CONTRACT_ID cntContractId,code code,CONTRACT_TYPE contractType from CNT_CONTRACT where status!='0' and CONTRACT_TYPE in(0,1) ");
		if(StringUtils.isNotEmpty(obj.getCheckOS())) {
			sql.append(" AND T1.CONTRACT_TYPE_O IS NOT NULL");
		}
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("contractType", new LongType());
		query.setResultTransformer(Transformers.aliasToBean(CntContractDTO.class));
		return query.list();
	}
	
	public List<CntConstrWorkItemTaskDTO> getDataCntConstrWorkItemTask() {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append(" T1.CONSTRUCTION_ID constructionId ");
		stringBuilder.append(",T1.CAT_TASK_ID catTaskId ");
		stringBuilder.append(",T1.WORK_ITEM_ID workItemId ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",T1.CNT_CONSTR_WORK_ITEM_TASK_ID cntConstrWorkItemTaskId ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK T1 where T1.STATUS = 1 ");  
    	
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
    	query.addScalar("constructionId", new LongType());
		query.addScalar("catTaskId", new LongType());
		query.addScalar("workItemId", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("cntConstrWorkItemTaskId", new LongType());
		
		query.setResultTransformer(Transformers.aliasToBean(CntConstrWorkItemTaskDTO.class));
		
		return query.list();
	}
	
	public List<WorkItemDTO> getDataWorkItem() {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.WORK_ITEM_ID workItemId ");
		stringBuilder.append(",T1.CONSTRUCTION_ID constructionId ");
		stringBuilder.append(",T1.CAT_WORK_ITEM_TYPE_ID catWorkItemTypeId ");
		stringBuilder.append(",T1.NAME name ");
    	stringBuilder.append("FROM WORK_ITEM T1 where STATUS != 0 ");    	
    	
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
    	query.addScalar("workItemId", new LongType());
		query.addScalar("constructionId", new LongType());
		query.addScalar("catWorkItemTypeId", new LongType());
		query.addScalar("name", new StringType());
		
		query.setResultTransformer(Transformers.aliasToBean(WorkItemDTO.class));
		
		return query.list();
	}
	
	public List<CatTaskDTO> getDataCatTask() {
		StringBuilder stringBuilder = new StringBuilder("select ");
		stringBuilder.append(" T1.NAME name ");
		stringBuilder.append(",T1.CAT_WORK_ITEM_TYPE_ID catWorkItemTypeId ");
		stringBuilder.append(",T1.CAT_TASK_ID catTaskId ");
    	stringBuilder.append(" FROM CAT_TASK T1 ");
    	
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
		query.addScalar("name", new StringType());
		query.addScalar("catWorkItemTypeId", new LongType());
		query.addScalar("catTaskId", new LongType());
		
		query.setResultTransformer(Transformers.aliasToBean(CatTaskDTO.class));
		
		return query.list();
	}
	
	public List<CntContractDTO> getDataContractImportHTCT(CntContractDTO obj){
		StringBuilder sql = new StringBuilder("select CNT_CONTRACT_ID cntContractId,code code,CONTRACT_TYPE contractType from CNT_CONTRACT where status!='0' and CONTRACT_TYPE in(7,8) ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("contractType", new LongType());
		query.setResultTransformer(Transformers.aliasToBean(CntContractDTO.class));
		return query.list();
	}
	
	public List<ConstructionDTO> checkForImportHTCT(ConstructionDTO obj) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CONSTRUCTION_ID constructionId ");
		stringBuilder.append(",T1.APPROVE_REVENUE_STATE approveRevenueState ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_STATE approveCompleteState ");
		stringBuilder.append(",T1.CODE code ");
		stringBuilder.append(",T1.NAME name ");
		stringBuilder.append(",T1.MONTH month ");
		stringBuilder.append(",T1.YEAR year ");
		stringBuilder.append(",T1.SYS_GROUP_ID sysGroupId ");
		stringBuilder.append(",T1.CAT_PARTNER_ID catPartnerId ");
		stringBuilder.append(",T1.HANDOVER_DATE handoverDate ");
		stringBuilder.append(",T1.HANDOVER_NOTE handoverNote ");
		stringBuilder.append(",T1.STARTING_DATE startingDate ");
		stringBuilder.append(",T1.EXCPECTED_COMPLETE_DATE excpectedCompleteDate ");
		stringBuilder.append(",T1.COMPLETE_DATE completeDate ");
		stringBuilder.append(",T1.STARTING_NOTE startingNote ");
		stringBuilder.append(",T1.IS_OBSTRUCTED isObstructed ");
		stringBuilder.append(",T1.OBSTRUCTED_STATE obstructedState ");
		stringBuilder.append(",T1.OBSTRUCTED_CONTENT obstructedContent ");
		stringBuilder.append(",T1.BROADCASTING_DATE broadcastingDate ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.IS_RETURN isReturn ");
		stringBuilder.append(",T1.COMPLETE_VALUE completeValue ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_VALUE approveCompleteValue ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_DATE approveCompleteDate ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_USER_ID approveCompleteUserId ");
		stringBuilder.append(",T1.APPROVE_COMPLETE_DESCRIPTION approveCompleteDescription ");
		stringBuilder.append(",T1.APPROVE_REVENUE_VALUE approveRevenueValue ");
		stringBuilder.append(",T1.APPROVE_REVENUE_DATE approveRevenueDate ");
		stringBuilder.append(",T1.APPROVE_REVENUE_USER_ID approveRevenueUserId ");
		stringBuilder.append(",T1.APPROVE_REVENUE_DESCRIPTION approveRevenueDescription ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T1.CAT_CONSTRUCTION_TYPE_ID catConstructionTypeId ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.CAT_CONSTRUCTION_DEPLOY_ID catConstructionDeployId ");
		stringBuilder.append(",T1.REGION region ");
		stringBuilder.append(",T1.CAT_STATION_ID catStationId ");
		stringBuilder.append(",T1.RETURNER returner ");
		stringBuilder.append(",T1.RETURN_DATE returnDate ");
		stringBuilder.append(",T2.CNT_CONTRACT_ID cntContractMapId ");
		
    	
    	stringBuilder.append("FROM CONSTRUCTION T1 ");    	
		stringBuilder.append(",CNT_CONSTR_WORK_ITEM_TASK T2, CNT_CONTRACT T3 ");
		stringBuilder.append("WHERE T1.STATUS != '0' ");
		stringBuilder.append("AND T1.CONSTRUCTION_ID = T2.CONSTRUCTION_ID ");
		stringBuilder.append("AND T2.CNT_CONTRACT_ID = T3.CNT_CONTRACT_ID ");
		stringBuilder.append("AND T2.STATUS = 1 AND T1.STATUS != 0 ");
		stringBuilder.append("AND T3.CONTRACT_TYPE = 7 AND T3.STATUS != 0 ");
		if(null != obj.getCntContractMapId()) {
			stringBuilder.append("AND T3.CNT_CONTRACT_ID = :cntContractMapId ");
		}
		
		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			stringBuilder.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
		stringBuilder.append(" ORDER BY NAME");
		StringBuilder sql = new StringBuilder("SELECT DISTINCT * FROM (");
		sql.append(stringBuilder);
		sql.append(")");
		
		
//		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
//		sqlCount.append(sql.toString());
//		sqlCount.append(")");
//		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		
		query.addScalar("constructionId", new LongType());
		query.addScalar("cntContractMapId", new StringType());
		query.addScalar("approveRevenueState", new StringType());
		query.addScalar("approveCompleteState", new StringType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("month", new LongType());
		query.addScalar("year", new LongType());
		query.addScalar("sysGroupId", new StringType());
		query.addScalar("catPartnerId", new StringType());
		query.addScalar("handoverDate", new DateType());
		query.addScalar("handoverNote", new StringType());
		query.addScalar("startingDate", new DateType());
		query.addScalar("excpectedCompleteDate", new DateType());
		query.addScalar("completeDate", new DateType());
		query.addScalar("startingNote", new StringType());
		query.addScalar("isObstructed", new StringType());
		query.addScalar("obstructedState", new StringType());
		query.addScalar("obstructedContent", new StringType());
		query.addScalar("broadcastingDate", new DateType());
		query.addScalar("description", new StringType());
		query.addScalar("isReturn", new StringType());
		query.addScalar("completeValue", new StringType());
		query.addScalar("approveCompleteValue", new DoubleType());
		query.addScalar("approveCompleteDate", new DateType());
		query.addScalar("approveCompleteUserId", new LongType());
		query.addScalar("approveCompleteDescription", new StringType());
		query.addScalar("approveRevenueValue", new DoubleType());
		query.addScalar("approveRevenueDate", new DateType());
		query.addScalar("approveRevenueUserId", new LongType());
		query.addScalar("approveRevenueDescription", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("catConstructionTypeId", new LongType());
		query.addScalar("status", new StringType());
		query.addScalar("catConstructionDeployId", new LongType());
		query.addScalar("region", new LongType());
		query.addScalar("catStationId", new LongType());
		query.addScalar("returner", new StringType());
		query.addScalar("returnDate", new DateType());
		
	
		query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));

		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			query.setParameter("key","%"+ obj.getKeySearch()+"%");
//			queryCount.setParameter("key","%"+ obj.getKeySearch()+"%");
		}
		
		if(null != obj.getCntContractMapId()) {
			query.setParameter("cntContractMapId", obj.getCntContractMapId());
//			queryCount.setParameter("cntContractMapId", obj.getCntContractMapId());
		}
		
//		if (obj.getPage() != null && obj.getPageSize() != null) {
//			query.setFirstResult((obj.getPage().intValue() - 1)
//					* obj.getPageSize().intValue());
//			query.setMaxResults(obj.getPageSize().intValue());
//		}
		List<ConstructionDTO> lst = query.list();
		return lst;
	}
	
	public List<ConstructionDTO> doSearchInHTCT(ConstructionDTO obj) {
		StringBuilder stringBuilder = new StringBuilder("select construction_id constructionId, code code, name name from construction ");
		stringBuilder.append("WHERE STATUS != '0' ");
		
		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			stringBuilder.append(" AND (UPPER(NAME) like UPPER(:key) OR UPPER(CODE) like UPPER(:key) escape '&')");
		}
		stringBuilder.append(" ORDER BY NAME");
		
		StringBuilder sql = new StringBuilder("SELECT DISTINCT * FROM (");
		sql.append(stringBuilder);
		sql.append(")");
		
		
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		
		query.addScalar("constructionId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
	
		query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));

		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			query.setParameter("key","%"+ obj.getKeySearch()+"%");
			queryCount.setParameter("key","%"+ obj.getKeySearch()+"%");
		}
		
		if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1)
					* obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}
	
	public List<ConstructionDTO> doSearchHTCT(ConstructionDTO obj) {
		StringBuilder stringBuilder = new StringBuilder("select construction_id constructionId, code code, name name from construction ");
		stringBuilder.append("WHERE STATUS != '0' AND CHECK_HTCT = 1  ");
		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			stringBuilder.append(" AND (UPPER(NAME) like UPPER(:key) OR UPPER(CODE) like UPPER(:key) escape '&')");
		}
		stringBuilder.append(" ORDER BY NAME");
		
		StringBuilder sql = new StringBuilder("SELECT DISTINCT * FROM (");
		sql.append(stringBuilder);
		sql.append(")");
		
		
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		
		query.addScalar("constructionId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
	
		query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));

		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			query.setParameter("key","%"+ obj.getKeySearch()+"%");
			queryCount.setParameter("key","%"+ obj.getKeySearch()+"%");
		}
		
		if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1)
					* obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}
	
	public List<ConstructionDTO> getForAutoCompleteInHTCT(ConstructionDTO obj) {
		StringBuilder stringBuilder = new StringBuilder("select construction_id constructionId, code code, name name from construction ");
		stringBuilder.append("WHERE STATUS != '0' ");
		
		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			stringBuilder.append(" AND (UPPER(NAME) like UPPER(:key) OR UPPER(CODE) like UPPER(:key) escape '&')");
		}
		stringBuilder.append(" ORDER BY NAME");
		StringBuilder sql = new StringBuilder("SELECT DISTINCT * FROM (");
		sql.append(stringBuilder);
		sql.append(")");
		
		
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		
		query.addScalar("constructionId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
	
		query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));

		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			query.setParameter("key","%"+ obj.getKeySearch()+"%");
		}
		
		query.setMaxResults(10);
		List<ConstructionDTO> lst = query.list();
		obj.setTotalRecord(lst.size());
		return lst;
	}
	//huy-end
}
