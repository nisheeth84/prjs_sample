package com.viettel.aio.dao;

import com.viettel.aio.bo.ProjectContractBO;
import com.viettel.aio.dto.ProjectContractDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 
 * @author hungnx
 *
 */
@Repository("projectContractDAO")
public class ProjectContractDAO extends BaseFWDAOImpl<ProjectContractBO, Long> {

	public ProjectContractDAO() {
        this.model = new ProjectContractBO();
    }

    public ProjectContractDAO(Session session) {
        this.session = session;
    }
//    public List<ProjectContractDTO> doSearch(ProjectContractDTO criteria) {
//    	StringBuilder stringBuilder = getSelectAllQuery();
//
//    	if(StringUtils.isNotEmpty(criteria.getKeySearch())){
//    		stringBuilder.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
//		}
//    	if (null != criteria.getStatus()) {
//			stringBuilder.append("AND T1.STATUS = :status ");
//		}
//    	stringBuilder.append(" ORDER BY T1.PROJECT_CONTRACT_ID DESC");
//    	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
//		sqlCount.append(stringBuilder.toString());
//		sqlCount.append(")");
//
//		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());
//
//		query.addScalar("projectContractId", new LongType());
//		query.addScalar("code", new StringType());
//		query.addScalar("name", new StringType());
//		query.addScalar("startDate", new DateType());
//		query.addScalar("endDate", new DateType());
//		query.addScalar("status", new LongType());
//		query.addScalar("description", new StringType());
//		query.addScalar("createdDate", new DateType());
//		query.addScalar("createdUserId", new LongType());
//		query.addScalar("createdGroupId", new LongType());
//		query.addScalar("updatedDate", new DateType());
//		query.addScalar("updatedUserId", new LongType());
//		query.addScalar("updatedGroupId", new LongType());
//		if(StringUtils.isNotEmpty(criteria.getKeySearch())){
//    		query.setParameter("key", "%"+criteria.getKeySearch()+"%");
//    		queryCount.setParameter("key", "%"+criteria.getKeySearch()+"%");
//		}
//    	if (null != criteria.getStatus()) {
//    		query.setParameter("status", criteria.getStatus());
//    		queryCount.setParameter("status", criteria.getStatus());
//		}
//    	query.setResultTransformer(Transformers.aliasToBean(ProjectContractDTO.class));
//		if (criteria.getPage() != null && criteria.getPageSize() != null) {
//			query.setFirstResult((criteria.getPage().intValue() - 1)
//					* criteria.getPageSize().intValue());
//			query.setMaxResults(criteria.getPageSize().intValue());
//		}
//		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
//		return query.list();
//	}
//    public ProjectContractDTO findByCode(String value) {
//    	StringBuilder stringBuilder = getSelectAllQuery();
//    	if(StringUtils.isNotEmpty(value)){
//    		stringBuilder.append(" AND upper(T1.CODE) = upper(:code) AND T1.STATUS != 0");
//    	}
//    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//    	query.addScalar("projectContractId", new LongType());
//		query.addScalar("code", new StringType());
//		query.addScalar("name", new StringType());
//		query.addScalar("startDate", new DateType());
//		query.addScalar("endDate", new DateType());
//		query.addScalar("status", new LongType());
//		query.addScalar("description", new StringType());
//		if(StringUtils.isNotEmpty(value)){
//			query.setParameter("code", value);
//		}
//		query.setResultTransformer(Transformers.aliasToBean(ProjectContractDTO.class));
//
//		return (ProjectContractDTO) query.uniqueResult();
//
//    }
    public List<ProjectContractDTO> getForAutoComplete(ProjectContractDTO obj) {
		StringBuilder stringBuilder = getSelectAllQuery();
		
		stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=10" : "");
		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			stringBuilder.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
		stringBuilder.append(" AND T1.STATUS != 0");
		stringBuilder.append(" ORDER BY T1.PROJECT_CONTRACT_ID DESC");
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		
		query.addScalar("projectContractId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("startDate", new DateType());
		query.addScalar("endDate", new DateType());
		query.addScalar("status", new LongType());
		query.addScalar("description", new StringType());
	
		query.setResultTransformer(Transformers.aliasToBean(ProjectContractDTO.class));

		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			query.setParameter("key","%"+ obj.getKeySearch()+"%");
		}
		query.setMaxResults(20);
		return query.list();
	}
	private StringBuilder getSelectAllQuery() {
		StringBuilder stringBuilder = new StringBuilder("SELECT T1.PROJECT_CONTRACT_ID projectContractId, T1.CODE code, T1.NAME name"
				+ ", T1.START_DATE startDate, T1.END_DATE endDate, T1.DESCRIPTION description, T1.STATUS status ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(" FROM PROJECT_CONTRACT T1");
		stringBuilder.append(" WHERE 1=1");
		return stringBuilder;
	}
}
