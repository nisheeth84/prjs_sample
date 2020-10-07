package com.viettel.aio.dao;

import com.viettel.aio.dto.WorkItemDTO;
import com.viettel.coms.bo.WorkItemBO;
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


@Repository("AIOworkItemDAO")
public class WorkItemDAO extends BaseFWDAOImpl<WorkItemBO, Long> {

    public WorkItemDAO() {
        this.model = new WorkItemBO();
    }

    public WorkItemDAO(Session session) {
        this.session = session;
    }	
    
    @SuppressWarnings("unchecked")
	public List<WorkItemDTO> doSearch(WorkItemDTO criteria) {
    	StringBuilder stringBuilder = getSelectAllQuery();
		stringBuilder
		.append(" where STATUS != 0");
    	if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			stringBuilder
					.append(" AND (UPPER(NAME) like UPPER(:key) OR UPPER(CODE) like UPPER(:key) escape '&')");
		}
    	if (criteria.getConstructionId() != null) {
			stringBuilder
					.append(" AND CONSTRUCTION_ID = :constructionId");
		}


    	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		query.addScalar("workItemId", new LongType());
		query.addScalar("constructionId", new LongType());
		query.addScalar("catWorkItemTypeId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("isInternal", new StringType());
		query.addScalar("constructorId", new LongType());
		query.addScalar("supervisorId", new LongType());
		query.addScalar("startingDate", new DateType());
		query.addScalar("completeDate", new DateType());
		query.addScalar("status", new StringType());
		query.addScalar("quantity", new DoubleType());
		query.addScalar("approveQuantity", new DoubleType());
		query.addScalar("approveState", new StringType());
		query.addScalar("approveDate", new DateType());
		query.addScalar("approveUserId", new LongType());
		query.addScalar("approveDescription", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());


		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			query.setParameter("key", "%" + criteria.getKeySearch() + "%");
			queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
		}
		if (criteria.getConstructionId() != null) {
			query.setParameter("constructionId", criteria.getConstructionId());
			queryCount.setParameter("constructionId", criteria.getConstructionId());
		}

		query.setResultTransformer(Transformers
				.aliasToBean(WorkItemDTO.class));
		List ls = query.list();
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1)
					* criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return ls;
	}

    public void addWorkItem(WorkItemDTO workItemDTO) {
		Session ss = getSession();
		ss.save(workItemDTO.toModel());
	}
//
//    //tatph - start
//    @SuppressWarnings("unchecked")
//	public List<CatWorkItemTypeHTCTDTO> doSearchWorkItemHTCT(CatWorkItemTypeHTCTDTO criteria) {
//    	StringBuilder stringBuilder = getSelectAllQueryWorkItemTypeHTCT();
//		stringBuilder
//		.append(" where STATUS != 0");
//    	if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//			stringBuilder
//					.append(" AND (UPPER(NAME) like UPPER(:keySearch) OR UPPER(CODE) like UPPER(:keySearch) escape '&')");
//		}
//
//
//
//    	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
//		sqlCount.append(stringBuilder.toString());
//		sqlCount.append(")");
//
//		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
//		query.addScalar("name", new StringType());
//		query.addScalar("code", new StringType());
//		query.addScalar("catWorkItemTypeId", new LongType());
//
//
//		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//			query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
//			queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
//		}
//
//		query.setResultTransformer(Transformers
//				.aliasToBean(CatWorkItemTypeHTCTDTO.class));
//		List ls = query.list();
//		if (criteria.getPage() != null && criteria.getPageSize() != null) {
//			query.setFirstResult((criteria.getPage().intValue() - 1)
//					* criteria.getPageSize().intValue());
//			query.setMaxResults(criteria.getPageSize().intValue());
//		}
//		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
//		return ls;
//	}
//
//    @SuppressWarnings("unchecked")
//	public List<CatTaskHTCTDTO> doSearchTaskHTCT(CatTaskHTCTDTO criteria) {
//    	StringBuilder stringBuilder = getSelectAllQueryCatTaskHTCT();
//		stringBuilder
//		.append(" where STATUS != 0");
//    	if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//			stringBuilder
//					.append(" AND (UPPER(NAME) like UPPER(:keySearch) OR UPPER(CODE) like UPPER(:keySearch) escape '&')");
//		}
//
//    	if (criteria.getCatWorkItemTypeId() != null ) {
//			stringBuilder
//					.append(" AND CAT_WORK_ITEM_TYPE_ID = :catWorkItemTypeId ");
//		}
//
//
//
//    	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
//		sqlCount.append(stringBuilder.toString());
//		sqlCount.append(")");
//
//		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
//		query.addScalar("name", new StringType());
//		query.addScalar("code", new StringType());
//		query.addScalar("catWorkItemTypeId", new LongType());
//
//
//		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//			query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
//			queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
//		}
//		if(criteria.getCatWorkItemTypeId() != null){
//			query.setParameter("catWorkItemTypeId",criteria.getCatWorkItemTypeId());
//			queryCount.setParameter("catWorkItemTypeId", criteria.getCatWorkItemTypeId());
//		}
//		query.setResultTransformer(Transformers
//				.aliasToBean(CatTaskHTCTDTO.class));
//		List ls = query.list();
//		if (criteria.getPage() != null && criteria.getPageSize() != null) {
//			query.setFirstResult((criteria.getPage().intValue() - 1)
//					* criteria.getPageSize().intValue());
//			query.setMaxResults(criteria.getPageSize().intValue());
//		}
//		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
//		return ls;
//	}
//    @SuppressWarnings("unchecked")
//   	public WorkItemDTO getWorkItembyName(String criteria) {
//    	StringBuilder stringBuilder =  getSelectAllQueryWorkItemTypeHTCT();
//  		stringBuilder
//  		.append(" where STATUS != 0");
//      	if (StringUtils.isNotEmpty(criteria)) {
//  			stringBuilder
//  					.append(" AND (UPPER(NAME) like UPPER(:keySearch) OR UPPER(CODE) = UPPER(:keySearch) )");
//  		}
//
//		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("name", new StringType());
//  		query.addScalar("code", new StringType());
//  		query.addScalar("catWorkItemTypeId", new LongType());
//
//		query.setResultTransformer(Transformers.aliasToBean(WorkItemDTO.class));
//		if (StringUtils.isNotEmpty(criteria)) {
//			query.setParameter("keySearch", criteria);
//		}
//		query.setMaxResults(20);
//		return (WorkItemDTO) query.uniqueResult();
//   	}
//    @SuppressWarnings("unchecked")
//   	public List<CatTaskHTCTDTO> doSearchTaskHTCTbyWorkItem(WorkItemDTO criteria) {
//       	StringBuilder stringBuilder = getSelectAllQueryCatTaskHTCT();
//   		stringBuilder
//   		.append(" where STATUS != 0");
//       	if (null != criteria.getCatWorkItemTypeId()) {
//   			stringBuilder
//   					.append(" AND (UPPER(CAT_WORK_ITEM_TYPE_ID) = UPPER(:keySearch))");
//   		}
//
//       	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//       	query.addScalar("createdUser", new LongType());
//		query.addScalar("updatedDate", new DateType());
//		query.addScalar("createdDate", new DateType());
//		query.addScalar("status", new StringType());
//		query.addScalar("code", new StringType());
//		query.addScalar("description", new StringType());
//		query.addScalar("name", new StringType());
//		query.addScalar("catWorkItemTypeId", new LongType());
//		query.addScalar("catUnitId", new LongType());
//		query.addScalar("catTaskId", new LongType());
//		query.addScalar("updatedUser", new LongType());
//
//		query.setResultTransformer(Transformers.aliasToBean(CatTaskHTCTDTO.class));
//		if (null != criteria.getCatWorkItemTypeId()) {
//			query.setParameter("keySearch", criteria.getCatWorkItemTypeId());
//		}
//		query.setMaxResults(20);
//		return query.list();
//   	}
//
//    @SuppressWarnings("unchecked")
//  	public List<CatTaskHTCTDTO> doSearchProvince(CatTaskHTCTDTO criteria) {
//      	StringBuilder stringBuilder =  new StringBuilder("SELECT ");
//		stringBuilder.append("T1.NAME name ");
//		stringBuilder.append(",T1.CODE code ");
//		stringBuilder.append(",T1.CAT_PROVINCE_ID catProvinceId ");
//
//    	stringBuilder.append("FROM CAT_PROVINCE T1 ");
//  		stringBuilder
//  		.append(" where STATUS != 0");
//      	if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//  			stringBuilder
//  					.append(" AND (UPPER(NAME) like UPPER(:keySearch) OR UPPER(CODE) like UPPER(:keySearch) escape '&')");
//  		}
//
//
//
//
//      	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
//  		sqlCount.append(stringBuilder.toString());
//  		sqlCount.append(")");
//
//  		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//  		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
//  		query.addScalar("name", new StringType());
//  		query.addScalar("code", new StringType());
//  		query.addScalar("catProvinceId", new LongType());
//
//
//  		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//  			query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
//  			queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
//  		}
//  		query.setResultTransformer(Transformers
//  				.aliasToBean(CatTaskHTCTDTO.class));
//  		List ls = query.list();
//  		if (criteria.getPage() != null && criteria.getPageSize() != null) {
//  			query.setFirstResult((criteria.getPage().intValue() - 1)
//  					* criteria.getPageSize().intValue());
//  			query.setMaxResults(criteria.getPageSize().intValue());
//  		}
//  		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
//  		return ls;
//  	}
//    public List<CatTaskHTCTDTO> getForAutoCompleteProvince(CatTaskHTCTDTO obj) {
//    	StringBuilder stringBuilder =  new StringBuilder("SELECT ");
//		stringBuilder.append("T1.NAME name ");
//		stringBuilder.append(",T1.CODE code ");
//		stringBuilder.append(",T1.CAT_PROVINCE_ID catProvinceId ");
//
//    	stringBuilder.append("FROM CAT_PROVINCE T1 ");
//  		stringBuilder
//  		.append(" where STATUS != 0");
//      	if (StringUtils.isNotEmpty(obj.getKeySearch())) {
//  			stringBuilder
//  					.append(" AND (UPPER(NAME) like UPPER(:keySearch) OR UPPER(CODE) like UPPER(:keySearch) escape '&')");
//  		}
//
//		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("name", new StringType());
//  		query.addScalar("code", new StringType());
//  		query.addScalar("catProvinceId", new LongType());
//
//		query.setResultTransformer(Transformers.aliasToBean(CatTaskHTCTDTO.class));
//		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
//			query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
//		}
//		query.setMaxResults(20);
//		return query.list();
//	}
//
//
//    @SuppressWarnings("unchecked")
//  	public List<ConstructionProjectDTO> doSearchProjectHTCT(ProjectEstimatesDTO criteria) {
//      	StringBuilder stringBuilder =  new StringBuilder("SELECT ");
//      	stringBuilder.append(" T1.PROJECT_ID projectId ");
//		stringBuilder.append(",T1.PROJECT_NAME name ");
//		stringBuilder.append(",T1.PROJECT_CODE code ");
//		stringBuilder.append(",T1.CONSTRUCTION_INVESTOR constructionInvestor ");
//		stringBuilder.append(",T1.SOURCE_FINANCE_CAPITAL sourceFinanceCapital ");
//		stringBuilder.append(",T1.PROJECT_BENEFICIARY projectBeneficiary ");
//		stringBuilder.append(",T1.START_DATE startDate ");
//		stringBuilder.append(",T1.END_DATE endDate ");
//		stringBuilder.append(",T1.UNIT_EXCUTE unitExcute ");
//		stringBuilder.append(",T1.CREATED_DATE createdDate ");
//		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
//		stringBuilder.append(",T1.STATUS status ");
//		stringBuilder.append(",T1.CREATED_USER createdUser ");
//		stringBuilder.append(",T1.UPDATED_USER updatedUser ");
//		stringBuilder.append(",T1.PROVINCE province ");
//		stringBuilder.append(",T1.TOTAL_INVESTMENT_PROJECT totalInvesmentProject ");
//		stringBuilder.append(",T1.NUMBER_WORKS numberWorks ");
//		stringBuilder.append(",T1.APPROVAL_NUMBER approvalNumber ");
//
//
//    	stringBuilder.append("FROM CONSTRUCTION_PROJECT T1 ");
//  		stringBuilder
//  		.append(" where 1 = 1 ");
//      	if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//  			stringBuilder
//  					.append(" AND (UPPER(T1.PROJECT_NAME) like UPPER(:keySearch) OR UPPER(T1.PROJECT_CODE) like UPPER(:keySearch) escape '&')");
//  		}
//
//
//
//
//      	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
//  		sqlCount.append(stringBuilder.toString());
//  		sqlCount.append(")");
//
//  		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//  		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
//  		query.addScalar("projectId", new LongType());
//		query.addScalar("name", new StringType());
//		query.addScalar("code", new StringType());
//		query.addScalar("constructionInvestor", new StringType());
//		query.addScalar("projectBeneficiary", new StringType());
//		query.addScalar("sourceFinanceCapital", new StringType());
//		query.addScalar("startDate", new DateType());
//		query.addScalar("endDate", new DateType());
//		query.addScalar("unitExcute", new StringType());
//		query.addScalar("createdDate", new DateType());
//		query.addScalar("updatedDate", new DateType());
//		query.addScalar("status", new LongType());
//		query.addScalar("createdUser", new StringType());
//		query.addScalar("updatedUser", new StringType());
//		query.addScalar("province", new StringType());
//		query.addScalar("totalInvesmentProject", new LongType());
//		query.addScalar("numberWorks", new LongType());
//		query.addScalar("approvalNumber", new StringType());
//
//
//  		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//  			query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
//  			queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
//  		}
//  		query.setResultTransformer(Transformers
//  				.aliasToBean(ConstructionProjectDTO.class));
//  		List ls = query.list();
//  		if (criteria.getPage() != null && criteria.getPageSize() != null) {
//  			query.setFirstResult((criteria.getPage().intValue() - 1)
//  					* criteria.getPageSize().intValue());
//  			query.setMaxResults(criteria.getPageSize().intValue());
//  		}
//  		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
//  		return ls;
//  	}
//    public List<ConstructionProjectDTO> getForAutoCompleteProjectHTCT(ProjectEstimatesDTO obj) {
//    	StringBuilder stringBuilder =  new StringBuilder("SELECT ");
//    	stringBuilder.append(" T1.PROJECT_ID projectId ");
//		stringBuilder.append(",T1.PROJECT_NAME name ");
//		stringBuilder.append(",T1.PROJECT_CODE code ");
//		stringBuilder.append(",T1.CONSTRUCTION_INVESTOR constructionInvestor ");
//		stringBuilder.append(",T1.SOURCE_FINANCE_CAPITAL sourceFinanceCapital ");
//		stringBuilder.append(",T1.PROJECT_BENEFICIARY projectBeneficiary ");
//		stringBuilder.append(",T1.START_DATE startDate ");
//		stringBuilder.append(",T1.END_DATE endDate ");
//		stringBuilder.append(",T1.UNIT_EXCUTE unitExcute ");
//		stringBuilder.append(",T1.CREATED_DATE createdDate ");
//		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
//		stringBuilder.append(",T1.STATUS status ");
//		stringBuilder.append(",T1.CREATED_USER createdUser ");
//		stringBuilder.append(",T1.UPDATED_USER updatedUser ");
//		stringBuilder.append(",T1.PROVINCE province ");
//		stringBuilder.append(",T1.TOTAL_INVESTMENT_PROJECT totalInvesmentProject ");
//		stringBuilder.append(",T1.NUMBER_WORKS numberWorks ");
//		stringBuilder.append(",T1.APPROVAL_NUMBER approvalNumber ");
//
//    	stringBuilder.append("FROM CONSTRUCTION_PROJECT T1 ");
//  		stringBuilder
//  		.append(" where 1 =1 ");
//      	if (StringUtils.isNotEmpty(obj.getKeySearch())) {
//  			stringBuilder
//  					.append(" AND (UPPER(T1.PROJECT_NAME) like UPPER(:keySearch) OR UPPER(T1.PROJECT_CODE) like UPPER(:keySearch) escape '&')");
//  		}
//
//		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("projectId", new LongType());
//		query.addScalar("name", new StringType());
//		query.addScalar("code", new StringType());
//		query.addScalar("constructionInvestor", new StringType());
//		query.addScalar("projectBeneficiary", new StringType());
//		query.addScalar("sourceFinanceCapital", new StringType());
//		query.addScalar("startDate", new DateType());
//		query.addScalar("endDate", new DateType());
//		query.addScalar("unitExcute", new StringType());
//		query.addScalar("createdDate", new DateType());
//		query.addScalar("updatedDate", new DateType());
//		query.addScalar("status", new LongType());
//		query.addScalar("createdUser", new StringType());
//		query.addScalar("updatedUser", new StringType());
//		query.addScalar("province", new StringType());
//		query.addScalar("totalInvesmentProject", new LongType());
//		query.addScalar("numberWorks", new LongType());
//		query.addScalar("approvalNumber", new StringType());
//
//		query.setResultTransformer(Transformers.aliasToBean(ConstructionProjectDTO.class));
//		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
//			query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
//		}
//		query.setMaxResults(20);
//		return query.list();
//	}
//
//    @SuppressWarnings("unchecked")
//  	public List<ProjectEstimatesDTO> doSearchConstrHTCT(ProjectEstimatesDTO criteria) {
//      	StringBuilder stringBuilder =  new StringBuilder("SELECT ");
//		stringBuilder.append("T1.PROJECT_NAME name ");
//		stringBuilder.append(",T1.PROJECT_CODE code ");
//		stringBuilder.append(",T1.PROJECT_ID projectId ");
//
//    	stringBuilder.append("FROM CONSTRUCTION_PROJECT T1 ");
//  		stringBuilder
//  		.append(" where 1 = 1 ");
//      	if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//  			stringBuilder
//  					.append(" AND (UPPER(T1.PROJECT_NAME) like UPPER(:keySearch) OR UPPER(T1.PROJECT_CODE) like UPPER(:keySearch) escape '&')");
//  		}
//
//
//
//
//      	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
//  		sqlCount.append(stringBuilder.toString());
//  		sqlCount.append(")");
//
//  		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//  		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
//  		query.addScalar("name", new StringType());
//  		query.addScalar("code", new StringType());
//  		query.addScalar("projectId", new LongType());
//
//
//  		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//  			query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
//  			queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
//  		}
//  		query.setResultTransformer(Transformers
//  				.aliasToBean(ProjectEstimatesDTO.class));
//  		List ls = query.list();
//  		if (criteria.getPage() != null && criteria.getPageSize() != null) {
//  			query.setFirstResult((criteria.getPage().intValue() - 1)
//  					* criteria.getPageSize().intValue());
//  			query.setMaxResults(criteria.getPageSize().intValue());
//  		}
//  		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
//  		return ls;
//  	}
//    public List<ProjectEstimatesDTO> getForAutoCompleteConstrHTCT(ProjectEstimatesDTO obj) {
//    	StringBuilder stringBuilder =  new StringBuilder("SELECT ");
//    	stringBuilder.append("T1.PROJECT_NAME name ");
//		stringBuilder.append(",T1.PROJECT_CODE code ");
//		stringBuilder.append(",T1.PROJECT_ID projectId ");
//
//    	stringBuilder.append("FROM CONSTRUCTION_PROJECT T1 ");
//  		stringBuilder
//  		.append(" where 1 =1 ");
//      	if (StringUtils.isNotEmpty(obj.getKeySearch())) {
//  			stringBuilder
//  					.append(" AND (UPPER(T1.PROJECT_NAME) like UPPER(:keySearch) OR UPPER(T1.PROJECT_CODE) like UPPER(:keySearch) escape '&')");
//  		}
//
//		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("name", new StringType());
//  		query.addScalar("code", new StringType());
//  		query.addScalar("projectId", new LongType());
//
//		query.setResultTransformer(Transformers.aliasToBean(ProjectEstimatesDTO.class));
//		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
//			query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
//		}
//		query.setMaxResults(20);
//		return query.list();
//	}
//
//    //tatph - end
//
//
//
//
//	public WorkItemDTO findByCode(String value) {
//		StringBuilder stringBuilder = new StringBuilder("SELECT ");
//		stringBuilder.append("T1.WORK_ITEM_ID workItemId ");
//		stringBuilder.append(",T1.CONSTRUCTION_ID constructionId ");
//		stringBuilder.append(",T1.CAT_WORK_ITEM_TYPE_ID catWorkItemTypeId ");
//		stringBuilder.append(",T1.CODE code ");
//		stringBuilder.append(",T1.NAME name ");
//		stringBuilder.append(",T1.IS_INTERNAL isInternal ");
//		stringBuilder.append(",T1.CONSTRUCTOR_ID constructorId ");
//		stringBuilder.append(",T1.SUPERVISOR_ID supervisorId ");
//		stringBuilder.append(",T1.STARTING_DATE startingDate ");
//		stringBuilder.append(",T1.COMPLETE_DATE completeDate ");
//		stringBuilder.append(",T1.STATUS status ");
//		stringBuilder.append(",T1.QUANTITY quantity ");
//		stringBuilder.append(",T1.APPROVE_QUANTITY approveQuantity ");
//		stringBuilder.append(",T1.APPROVE_STATE approveState ");
//		stringBuilder.append(",T1.APPROVE_DATE approveDate ");
//		stringBuilder.append(",T1.APPROVE_USER_ID approveUserId ");
//		stringBuilder.append(",T1.APPROVE_DESCRIPTION approveDescription ");
//		stringBuilder.append(",T1.CREATED_DATE createdDate ");
//		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
//		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
//		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
//		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
//		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
//
//    	stringBuilder.append("FROM WORK_ITEM T1 ");
//    	stringBuilder.append("WHERE STATUS = 1 AND upper(T1.CODE) = upper(:value)");
//
//    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("workItemId", new LongType());
//		query.addScalar("constructionId", new LongType());
//		query.addScalar("catWorkItemTypeId", new LongType());
//		query.addScalar("code", new StringType());
//		query.addScalar("name", new StringType());
//		query.addScalar("isInternal", new StringType());
//		query.addScalar("constructorId", new LongType());
//		query.addScalar("supervisorId", new LongType());
//		query.addScalar("startingDate", new DateType());
//		query.addScalar("completeDate", new DateType());
//		query.addScalar("status", new StringType());
//		query.addScalar("quantity", new DoubleType());
//		query.addScalar("approveQuantity", new DoubleType());
//		query.addScalar("approveState", new StringType());
//		query.addScalar("approveDate", new DateType());
//		query.addScalar("approveUserId", new LongType());
//		query.addScalar("approveDescription", new StringType());
//		query.addScalar("createdDate", new DateType());
//		query.addScalar("createdUserId", new LongType());
//		query.addScalar("createdGroupId", new LongType());
//		query.addScalar("updatedDate", new DateType());
//		query.addScalar("updatedUserId", new LongType());
//		query.addScalar("updatedGroupId", new LongType());
//
//		query.setParameter("value", value);
//		query.setResultTransformer(Transformers.aliasToBean(WorkItemDTO.class));
//
//		return (WorkItemDTO) query.uniqueResult();
//	}
//
	public List<WorkItemDTO> getForAutoComplete(WorkItemDTO obj) {
		StringBuilder stringBuilder = getSelectAllQuery();

		stringBuilder.append(" Where STATUS != 0");
		stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=10" : "");
		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			stringBuilder
					.append(" AND (UPPER(NAME) like UPPER(:key) OR UPPER(CODE) like UPPER(:key))");
		}

		if (obj.getConstructionId() != null) {
			stringBuilder
					.append(" AND CONSTRUCTION_ID = :constructionId");
		}

		stringBuilder.append(" ORDER BY NAME");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("workItemId", new LongType());
		query.addScalar("constructionId", new LongType());
		query.addScalar("catWorkItemTypeId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("isInternal", new StringType());
		query.addScalar("constructorId", new LongType());
		query.addScalar("supervisorId", new LongType());
		query.addScalar("startingDate", new DateType());
		query.addScalar("completeDate", new DateType());
		query.addScalar("status", new StringType());
		query.addScalar("quantity", new DoubleType());
		query.addScalar("approveQuantity", new DoubleType());
		query.addScalar("approveState", new StringType());
		query.addScalar("approveDate", new DateType());
		query.addScalar("approveUserId", new LongType());
		query.addScalar("approveDescription", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());

		query.setResultTransformer(Transformers.aliasToBean(WorkItemDTO.class));
		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			query.setParameter("key", "%" + obj.getKeySearch() + "%");
		}
		if (obj.getConstructionId() != null) {
			query.setParameter("constructionId", obj.getConstructionId());
		}

		query.setMaxResults(20);
		return query.list();
	}
//
//
//
//	@SuppressWarnings("unchecked")
//	public WorkItemDTO getById(Long id) {
//    	StringBuilder stringBuilder = new StringBuilder("SELECT ");
//		stringBuilder.append("T1.WORK_ITEM_ID workItemId ");
//		stringBuilder.append(",T1.CONSTRUCTION_ID constructionId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CONSTRUCTION WHERE CONSTRUCTION_ID = T1.CONSTRUCTION_ID) constructionName  ");
//		stringBuilder.append(",T1.CAT_WORK_ITEM_TYPE_ID catWorkItemTypeId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CAT_WORK_ITEM_TYPE WHERE CAT_WORK_ITEM_TYPE_ID = T1.CAT_WORK_ITEM_TYPE_ID) catWorkItemTypeName  ");
//		stringBuilder.append(",T1.CODE code ");
//		stringBuilder.append(",T1.NAME name ");
//		stringBuilder.append(",T1.IS_INTERNAL isInternal ");
//		stringBuilder.append(",T1.CONSTRUCTOR_ID constructorId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CONSTRUCTOR WHERE CONSTRUCTOR_ID = T1.CONSTRUCTOR_ID) constructorName  ");
//		stringBuilder.append(",T1.SUPERVISOR_ID supervisorId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM SUPERVISOR WHERE SUPERVISOR_ID = T1.SUPERVISOR_ID) supervisorName  ");
//		stringBuilder.append(",T1.STARTING_DATE startingDate ");
//		stringBuilder.append(",T1.COMPLETE_DATE completeDate ");
//		stringBuilder.append(",T1.STATUS status ");
//		stringBuilder.append(",T1.QUANTITY quantity ");
//		stringBuilder.append(",T1.APPROVE_QUANTITY approveQuantity ");
//		stringBuilder.append(",T1.APPROVE_STATE approveState ");
//		stringBuilder.append(",T1.APPROVE_DATE approveDate ");
//		stringBuilder.append(",T1.APPROVE_USER_ID approveUserId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM APPROVE_USER WHERE APPROVE_USER_ID = T1.APPROVE_USER_ID) approveUserName  ");
//		stringBuilder.append(",T1.APPROVE_DESCRIPTION approveDescription ");
//		stringBuilder.append(",T1.CREATED_DATE createdDate ");
//		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CREATED_USER WHERE CREATED_USER_ID = T1.CREATED_USER_ID) createdUserName  ");
//		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CREATED_GROUP WHERE CREATED_GROUP_ID = T1.CREATED_GROUP_ID) createdGroupName  ");
//		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
//		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM UPDATED_USER WHERE UPDATED_USER_ID = T1.UPDATED_USER_ID) updatedUserName  ");
//		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM UPDATED_GROUP WHERE UPDATED_GROUP_ID = T1.UPDATED_GROUP_ID) updatedGroupName  ");
//
//    	stringBuilder.append("FROM WORK_ITEM T1 ");
//    	stringBuilder.append("WHERE T1.IS_DELETED = 'N' AND T1.WORK_ITEM_ID = :workItemId ");
//
//    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("workItemId", new LongType());
//		query.addScalar("constructionId", new LongType());
//		query.addScalar("constructionName", new StringType());
//		query.addScalar("catWorkItemTypeId", new LongType());
//		query.addScalar("catWorkItemTypeName", new StringType());
//		query.addScalar("code", new StringType());
//		query.addScalar("name", new StringType());
//		query.addScalar("isInternal", new StringType());
//		query.addScalar("constructorId", new LongType());
//		query.addScalar("constructorName", new StringType());
//		query.addScalar("supervisorId", new LongType());
//		query.addScalar("supervisorName", new StringType());
//		query.addScalar("startingDate", new DateType());
//		query.addScalar("completeDate", new DateType());
//		query.addScalar("status", new StringType());
//		query.addScalar("quantity", new DoubleType());
//		query.addScalar("approveQuantity", new DoubleType());
//		query.addScalar("approveState", new StringType());
//		query.addScalar("approveDate", new DateType());
//		query.addScalar("approveUserId", new LongType());
//		query.addScalar("approveUserName", new StringType());
//		query.addScalar("approveDescription", new StringType());
//		query.addScalar("createdDate", new DateType());
//		query.addScalar("createdUserId", new LongType());
//		query.addScalar("createdUserName", new StringType());
//		query.addScalar("createdGroupId", new LongType());
//		query.addScalar("createdGroupName", new StringType());
//		query.addScalar("updatedDate", new DateType());
//		query.addScalar("updatedUserId", new LongType());
//		query.addScalar("updatedUserName", new StringType());
//		query.addScalar("updatedGroupId", new LongType());
//		query.addScalar("updatedGroupName", new StringType());
//
//		query.setParameter("workItemId", id);
//		query.setResultTransformer(Transformers.aliasToBean(WorkItemDTO.class));
//
//		return (WorkItemDTO) query.uniqueResult();
//	}
	public StringBuilder getSelectAllQuery(){
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.WORK_ITEM_ID workItemId ");
		stringBuilder.append(",T1.CONSTRUCTION_ID constructionId ");
		stringBuilder.append(",T1.CAT_WORK_ITEM_TYPE_ID catWorkItemTypeId ");
		stringBuilder.append(",T1.CODE code ");
		stringBuilder.append(",T1.NAME name ");
		stringBuilder.append(",T1.IS_INTERNAL isInternal ");
		stringBuilder.append(",T1.CONSTRUCTOR_ID constructorId ");
		stringBuilder.append(",T1.SUPERVISOR_ID supervisorId ");
		stringBuilder.append(",T1.STARTING_DATE startingDate ");
		stringBuilder.append(",T1.COMPLETE_DATE completeDate ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.QUANTITY quantity ");
		stringBuilder.append(",T1.APPROVE_QUANTITY approveQuantity ");
		stringBuilder.append(",T1.APPROVE_STATE approveState ");
		stringBuilder.append(",T1.APPROVE_DATE approveDate ");
		stringBuilder.append(",T1.APPROVE_USER_ID approveUserId ");
		stringBuilder.append(",T1.APPROVE_DESCRIPTION approveDescription ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");

    	stringBuilder.append("FROM WORK_ITEM T1 ");
    	return stringBuilder;
	}
//
//
//	//tatph - start 17/10/2019
//	public StringBuilder getSelectAllQueryWorkItemTypeHTCT(){
//		StringBuilder stringBuilder = new StringBuilder("SELECT ");
//		stringBuilder.append("T1.NAME name ");
//		stringBuilder.append(",T1.CODE code ");
//		stringBuilder.append(",T1.CAT_WORK_ITEM_TYPE_ID catWorkItemTypeId ");
//
//
//    	stringBuilder.append("FROM CAT_WORK_ITEM_TYPE_HTCT T1 ");
//    	return stringBuilder;
//	}
//	public List<CatWorkItemTypeHTCTDTO> getForAutoCompleteWorkItemHTCT(CatWorkItemTypeHTCTDTO obj) {
//		StringBuilder stringBuilder = getSelectAllQueryWorkItemTypeHTCT();
//
//		stringBuilder.append(" Where T1.STATUS != 0");
//		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
//			stringBuilder
//					.append(" AND (UPPER(T1.NAME) like UPPER(:keySearch) OR UPPER(T1.CODE) like UPPER(:keySearch))");
//		}
//		stringBuilder.append(" ORDER BY T1.NAME");
//
//		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("name", new StringType());
//		query.addScalar("code", new StringType());
//		query.addScalar("catWorkItemTypeId", new LongType());
//
//		query.setResultTransformer(Transformers.aliasToBean(CatWorkItemTypeHTCTDTO.class));
//		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
//			query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
//		}
//
//		query.setMaxResults(20);
//		return query.list();
//	}
//
//	public List<CatTaskHTCTDTO> getForAutoCompleteCatTaskHTCT(CatTaskHTCTDTO obj) {
//		StringBuilder stringBuilder = getSelectAllQueryCatTaskHTCT();
//		stringBuilder.append(" where STATUS != 0 ");
//		stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=10" : "");
//		if(StringUtils.isNotEmpty(obj.getKeySearch())){
//			stringBuilder.append(" AND (UPPER(NAME) like UPPER(:keySearch) OR UPPER(CODE) like UPPER(:keySearch) )");
//		}
//		if (obj.getCatWorkItemTypeId() != null) {
//			stringBuilder
//					.append(" AND CAT_WORK_ITEM_TYPE_ID = :catWorkItemTypeId ");
//		}
//		stringBuilder.append(" ORDER BY NAME");
//
//		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("createdUser", new LongType());
//		query.addScalar("updatedDate", new DateType());
//		query.addScalar("createdDate", new DateType());
//		query.addScalar("status", new StringType());
//		query.addScalar("code", new StringType());
//		query.addScalar("description", new StringType());
//		query.addScalar("name", new StringType());
//		query.addScalar("catWorkItemTypeId", new LongType());
//		query.addScalar("catUnitId", new LongType());
//		query.addScalar("catTaskId", new LongType());
//		query.addScalar("updatedUser", new LongType());
//
//		query.setResultTransformer(Transformers.aliasToBean(CatTaskHTCTDTO.class));
//
//		if(StringUtils.isNotEmpty(obj.getKeySearch())){
//			query.setParameter("keySearch","%"+ obj.getKeySearch()+"%");
//		}
//		if(obj.getCatWorkItemTypeId() != null){
//			query.setParameter("catWorkItemTypeId",obj.getCatWorkItemTypeId());
//		}
//		query.setMaxResults(20);
//		return query.list();
//	}
//
//	public StringBuilder getSelectAllQueryCatTaskHTCT(){
//		StringBuilder stringBuilder = new StringBuilder("select ");
//		stringBuilder.append("T1.CREATED_USER createdUser ");
//		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
//		stringBuilder.append(",T1.CREATED_DATE createdDate ");
//		stringBuilder.append(",T1.STATUS status ");
//		stringBuilder.append(",T1.CODE code ");
//		stringBuilder.append(",T1.DESCRIPTION description ");
//		stringBuilder.append(",T1.NAME name ");
//		stringBuilder.append(",T1.CAT_WORK_ITEM_TYPE_ID catWorkItemTypeId ");
//		stringBuilder.append(",T1.CAT_UNIT_ID catUnitId ");
//		stringBuilder.append(",T1.CAT_TASK_ID catTaskId ");
//		stringBuilder.append(",T1.UPDATED_USER updatedUser ");
//    	stringBuilder.append("FROM CAT_TASK_HTCT T1 ");
//    	return stringBuilder;
//	}
//
//	@SuppressWarnings("unchecked")
//	public List<ProjectEstimatesDTO> getFileDrop() {
//		// Hieunn
//		// get list filedrop form APP_PARAM with PAR_TYPE =
//		// 'SHIPMENT_DOCUMENT_TYPE' and Status=1
//		String sql = "SELECT ap.ATTACH_TYPE code , ap.CONTENT name from PROJECT_ATTACH_FILE_TYPE ap"  ;
//
//		StringBuilder stringBuilder = new StringBuilder(sql);
//
//		stringBuilder.append(" ORDER BY ap.ID");
//
//		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("name", new StringType());
//		query.addScalar("code", new StringType());
//
//		query.setResultTransformer(Transformers.aliasToBean(ProjectEstimatesDTO.class));
//		return query.list();
//	}
}
