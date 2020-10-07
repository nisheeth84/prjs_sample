package com.viettel.aio.dao;

import com.viettel.aio.bo.CntContractLiquidateBO;
import com.viettel.aio.dto.CntContractLiquidateDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author hailh10
 */
@Repository("cntContractLiquidateDAO")
public class CntContractLiquidateDAO extends BaseFWDAOImpl<CntContractLiquidateBO, Long> {

    public CntContractLiquidateDAO() {
        this.model = new CntContractLiquidateBO();
    }

    public CntContractLiquidateDAO(Session session) {
        this.session = session;
    }	
    
    @SuppressWarnings("unchecked")
	public List<CntContractLiquidateDTO> doSearch(CntContractLiquidateDTO criteria) {
    	StringBuilder stringBuilder = getSelectedAllQuery();  	
    	stringBuilder.append("WHERE STATUS = 1 ");
    	
	
		if (null != criteria.getCntContractId()) {
			stringBuilder.append("AND T1.CNT_CONTRACT_ID = :cntContractId ");
		}
		
		stringBuilder.append(" ORDER BY T1.CNT_CONTRACT_LIQUIDATE_ID DESC ");
		
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());
    	
		query.addScalar("createdDate", new DateType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("description", new StringType());
		query.addScalar("paymentMode", new StringType());
		query.addScalar("liquidateDate", new DateType());
		query.addScalar("cntContractLiquidateId", new LongType());

    	
		if (null != criteria.getCntContractId()) {
			query.setParameter("cntContractId", criteria.getCntContractId());
			queryCount.setParameter("cntContractId", criteria.getCntContractId());
		}
		
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		query.setResultTransformer(Transformers.aliasToBean(CntContractLiquidateDTO.class)); 
		if(criteria.getPage() != null && criteria.getPageSize() != null){
			query.setFirstResult((criteria.getPage().intValue()-1)*criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		List ls = query.list();
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return ls;
	}  
	
	public CntContractLiquidateDTO findByValue(String value) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.PAYMENT_MODE paymentMode ");
		stringBuilder.append(",T1.LIQUIDATE_DATE liquidateDate ");
		stringBuilder.append(",T1.CNT_CONTRACT_LIQUIDATE_ID cntContractLiquidateId ");
    	
    	stringBuilder.append("FROM CNT_CONTRACT_LIQUIDATE T1 ");    	
    	stringBuilder.append("WHERE T1.IS_DELETED = 'N' AND upper(T1.VALUE) = upper(:value)");	
    	
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
		query.addScalar("createdDate", new DateType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("description", new StringType());
		query.addScalar("paymentMode", new StringType());
		query.addScalar("liquidateDate", new DateType());
		query.addScalar("cntContractLiquidateId", new LongType());
    	
		query.setParameter("value", value);    	
		query.setResultTransformer(Transformers.aliasToBean(CntContractLiquidateDTO.class));    	

		return (CntContractLiquidateDTO) query.uniqueResult();
	}

	public List<CntContractLiquidateDTO> getForAutoComplete(CntContractLiquidateDTO obj) {
		String sql = "SELECT CNT_CONTRACT_LIQUIDATE_ID cntContractLiquidateId"	
			+" ,NAME name"			
			+" ,VALUE value"
			+" FROM CNT_CONTRACT_LIQUIDATE"
			+" WHERE IS_DELETED = 'N' AND ISACTIVE = 'Y'";			
		
		StringBuilder stringBuilder = new StringBuilder(sql);
		
		stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=10" : "");
//		stringBuilder.append(StringUtils.isNotEmpty(obj.getName()) ? " AND (upper(NAME) LIKE upper(:name) ESCAPE '\\'" + (StringUtils.isNotEmpty(obj.getValue()) ? " OR upper(VALUE) LIKE upper(:value) ESCAPE '\\'" : "") + ")" : (StringUtils.isNotEmpty(obj.getValue()) ? "AND upper(VALUE) LIKE upper(:value) ESCAPE '\\'" : ""));
		stringBuilder.append(" ORDER BY NAME");
		
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		
		query.addScalar("cntContractLiquidateId", new LongType());
		query.addScalar("name", new StringType());
		query.addScalar("value", new StringType());
	
		query.setResultTransformer(Transformers.aliasToBean(CntContractLiquidateDTO.class));
//
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
	
	@SuppressWarnings("unchecked")
	public CntContractLiquidateDTO getById(Long id) {
    	StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM UPDATED_GROUP WHERE UPDATED_GROUP_ID = T1.UPDATED_GROUP_ID) updatedGroupName  ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM UPDATED_USER WHERE UPDATED_USER_ID = T1.UPDATED_USER_ID) updatedUserName  ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CREATED_GROUP WHERE CREATED_GROUP_ID = T1.CREATED_GROUP_ID) createdGroupName  ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CREATED_USER WHERE CREATED_USER_ID = T1.CREATED_USER_ID) createdUserName  ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CNT_CONTRACT WHERE CNT_CONTRACT_ID = T1.CNT_CONTRACT_ID) cntContractName  ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.PAYMENT_MODE paymentMode ");
		stringBuilder.append(",T1.LIQUIDATE_DATE liquidateDate ");
		stringBuilder.append(",T1.CNT_CONTRACT_LIQUIDATE_ID cntContractLiquidateId ");

    	stringBuilder.append("FROM CNT_CONTRACT_LIQUIDATE T1 ");    	
    	stringBuilder.append("WHERE T1.IS_DELETED = 'N' AND T1.CNT_CONTRACT_LIQUIDATE_ID = :cntContractLiquidateId ");
    	
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
		query.addScalar("createdDate", new DateType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("updatedGroupName", new StringType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedUserName", new StringType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("createdGroupName", new StringType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdUserName", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("cntContractName", new StringType());
		query.addScalar("description", new StringType());
		query.addScalar("paymentMode", new StringType());
		query.addScalar("liquidateDate", new DateType());
		query.addScalar("cntContractLiquidateId", new LongType());
    	
		query.setParameter("cntContractLiquidateId", id);
		query.setResultTransformer(Transformers.aliasToBean(CntContractLiquidateDTO.class));
    	
		return (CntContractLiquidateDTO) query.uniqueResult();
	}
	
	public StringBuilder getSelectedAllQuery(){
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.PAYMENT_MODE paymentMode ");
		stringBuilder.append(",T1.LIQUIDATE_DATE liquidateDate ");
		stringBuilder.append(",T1.CNT_CONTRACT_LIQUIDATE_ID cntContractLiquidateId ");

    	
    	stringBuilder.append("FROM CNT_CONTRACT_LIQUIDATE T1 ");    	
    	return stringBuilder;
	}
}
