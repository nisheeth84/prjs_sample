package com.viettel.aio.dao;

import com.viettel.aio.bo.CntContractAppendixBO;
import com.viettel.aio.dto.CntContractAppendixDTO;
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
 * @author hailh10
 */
@Repository("cntContractAppendixDAO")
public class CntContractAppendixDAO extends BaseFWDAOImpl<CntContractAppendixBO, Long> {

    public CntContractAppendixDAO() {
        this.model = new CntContractAppendixBO();
    }

    public CntContractAppendixDAO(Session session) {
        this.session = session;
    }	
    
    @SuppressWarnings("unchecked")
	public List<CntContractAppendixDTO> doSearch(CntContractAppendixDTO criteria) {
    	StringBuilder stringBuilder =getSelectAllQuery();    	
    	stringBuilder.append("WHERE STATUS = 1 ");
    	
		
		if (null != criteria.getCntContractId()) {
			stringBuilder.append("AND T1.CNT_CONTRACT_ID = :cntContractId ");
		}
		
		stringBuilder.append(" ORDER BY T1.CNT_CONTRACT_Appendix_ID DESC ");
		
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");
    	

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());
    	
		query.addScalar("cntContractAppendixId", new LongType());

		query.addScalar("price", new DoubleType());
		query.addScalar("description", new StringType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("createdDate", new DateType());
		
    	
		if (null != criteria.getCntContractId()) {
			query.setParameter("cntContractId", criteria.getCntContractId());
			queryCount.setParameter("cntContractId", criteria.getCntContractId());
		}
		
		query.setResultTransformer(Transformers.aliasToBean(CntContractAppendixDTO.class));    	
		
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		List ls = query.list();
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return ls;
	}  
	
//	public CntContractAppendixDTO findByValue(String value) {
//		StringBuilder stringBuilder = new StringBuilder("SELECT ");
//		stringBuilder.append("T1.CNT_CONTRACT_Appendix_ID cntContractAppendixId ");
//
//		stringBuilder.append(",T1.PRICE price ");
//		stringBuilder.append(",T1.DESCRIPTION description ");
//		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
//		stringBuilder.append(",T1.STATUS status ");
//		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
//		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
//		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
//		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
//		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
//
//    	stringBuilder.append("FROM CNT_CONTRACT_Appendix T1 ");
//    	stringBuilder.append("WHERE T1.IS_DELETED = 'N' AND upper(T1.VALUE) = upper(:value)");
//
//    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("cntContractAppendixId", new LongType());
//
//		query.addScalar("price", new DoubleType());
//		query.addScalar("description", new StringType());
//		query.addScalar("cntContractId", new LongType());
//		query.addScalar("status", new LongType());
//		query.addScalar("createdUserId", new LongType());
//		query.addScalar("createdGroupId", new LongType());
//		query.addScalar("updatedDate", new DateType());
//		query.addScalar("updatedUserId", new LongType());
//		query.addScalar("updatedGroupId", new LongType());
//
//		query.setParameter("value", value);
//		query.setResultTransformer(Transformers.aliasToBean(CntContractAppendixDTO.class));
//
//		return (CntContractAppendixDTO) query.uniqueResult();
//	}
//
	public List<CntContractAppendixDTO> getForAutoComplete(CntContractAppendixDTO obj) {
		StringBuilder stringBuilder = getSelectAllQuery();

		stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=10" : "");
//		stringBuilder.append(StringUtils.isNotEmpty(obj.getName()) ? " AND (upper(NAME) LIKE upper(:name) ESCAPE '\\'" + (StringUtils.isNotEmpty(obj.getValue()) ? " OR upper(VALUE) LIKE upper(:value) ESCAPE '\\'" : "") + ")" : (StringUtils.isNotEmpty(obj.getValue()) ? "AND upper(VALUE) LIKE upper(:value) ESCAPE '\\'" : ""));
		stringBuilder.append(" ORDER BY NAME");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("cntContractAppendixId", new LongType());
		query.addScalar("name", new StringType());
		query.addScalar("value", new StringType());

		query.setResultTransformer(Transformers.aliasToBean(CntContractAppendixDTO.class));

//		if (StringUtils.isNotEmpty(obj.getName())) {
//			query.setParameter("name", "%" + com.viettel.service.base.utils.StringUtils.replaceSpecialKeySearch(obj.getName()) + "%");
//		}
//
//		if (StringUtils.isNotEmpty(obj.getValue())) {
//			query.setParameter("value", "%" + com.viettel.service.base.utils.StringUtils.replaceSpecialKeySearch(obj.getValue()) + "%");
//		}
		query.setMaxResults(20);
		return query.list();
	}
//
//	@SuppressWarnings("unchecked")
//	public CntContractAppendixDTO getById(Long id) {
//    	StringBuilder stringBuilder = getSelectAllQuery();
//    	stringBuilder.append("WHERE STATUS = 1 AND T1.CNT_CONTRACT_Appendix_ID = :cntContractAppendixId ");
//
//    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("cntContractAppendixId", new LongType());
//		query.addScalar("price", new DoubleType());
//		query.addScalar("description", new StringType());
//		query.addScalar("cntContractId", new LongType());
//		query.addScalar("cntContractName", new StringType());
//		query.addScalar("status", new LongType());
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
//		query.setParameter("cntContractAppendixId", id);
//		query.setResultTransformer(Transformers.aliasToBean(CntContractAppendixDTO.class));
//
//		return (CntContractAppendixDTO) query.uniqueResult();
//	}
//
	public StringBuilder getSelectAllQuery(){
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CNT_CONTRACT_Appendix_ID cntContractAppendixId ");
		stringBuilder.append(",T1.PRICE price ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");

		stringBuilder.append("FROM CNT_CONTRACT_Appendix T1 ");

		return stringBuilder;
	}
}
