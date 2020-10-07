package com.viettel.aio.dao;

import com.viettel.aio.bo.CatUnitBO;
import com.viettel.aio.dto.CatUnitDTO;
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
//import com.viettel.erp.utils.FilterUtilities;

/**
 * @author hailh10
 */
@Repository("catUnitDAO")
public class CatUnitDAO extends BaseFWDAOImpl<CatUnitBO, Long> {

    public CatUnitDAO() {
        this.model = new CatUnitBO();
    }

    public CatUnitDAO(Session session) {
        this.session = session;
    }	
    
    @SuppressWarnings("unchecked")
	public List<CatUnitDTO> doSearch(CatUnitDTO criteria) {
    	StringBuilder stringBuilder = new StringBuilder("SELECT T1.CAT_UNIT_ID catUnitId,"
 				+ "T1.CODE code,"
 				+ "T1.NAME name,"
 				+ "T1.STATUS status "
 				+ " FROM CTCT_CAT_OWNER.CAT_UNIT T1 where 1=1 ");
   
		if (null != criteria.getKeySearch()) {
			stringBuilder.append("AND (upper(T1.CODE) like upper(:key) or upper(T1.NAME) like upper(:key))");
		}
		if (null != criteria.getStatus()) {
			stringBuilder.append("AND T1.STATUS = :status");
		}
//		setParameterGroup(query, criteria.getListAction(), criteria.getCurrentActionIndex(), CatUnitDTO.class.getDeclaredFields(), criteria.getCurrencyColumn());
	
	
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());
		
	 	
		query.addScalar("catUnitId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("status", new StringType());
		
		if (null != criteria.getKeySearch()) {
			query.setParameter("key","%" + criteria.getKeySearch() +"%");
			queryCount.setParameter("key","%" + criteria.getKeySearch() +"%");
		}
		
		if (null != criteria.getStatus()) {
			query.setParameter("status", criteria.getStatus());
			queryCount.setParameter("status", criteria.getStatus());
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		query.setResultTransformer(Transformers.aliasToBean(CatUnitDTO.class)); 
		if(criteria.getPage() != null && criteria.getPageSize() != null){
			query.setFirstResult((criteria.getPage().intValue()-1)*criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		List ls = query.list();
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return ls;
	}  
	
	public CatUnitDTO findByCode(String code) {
		StringBuilder stringBuilder = new StringBuilder("Select T1.CAT_UNIT_ID catUnitId,"
				+ "T1.CODE code, "
				+ "T1.NAME name, "
				+ "T1.STATUS status "
				+ "FROM CTCT_CAT_OWNER.CAT_UNIT T1 "
				+ "WHERE 1=1 AND upper(T1.CODE) = upper(:code)");
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
		query.addScalar("catUnitId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("status", new StringType());
    	
		query.setParameter("code", code);    	
		query.setResultTransformer(Transformers.aliasToBean(CatUnitDTO.class));    	

		return (CatUnitDTO) query.uniqueResult();
	}

	public List<CatUnitDTO> getForAutoComplete(CatUnitDTO obj) {
		String sql = "SELECT CAT_UNIT_ID catUnitId"	
			+" ,NAME name"			
			+" ,CODE code"
			+" FROM CTCT_CAT_OWNER.CAT_UNIT"
			+" WHERE 1=1";			
		
		StringBuilder stringBuilder = new StringBuilder(sql);
		
		if (obj.getIsSize()){
			stringBuilder.append(" AND ROWNUM <=10 ");
			if(StringUtils.isNotEmpty(obj.getName())){
			stringBuilder.append(" AND (upper(NAME) LIKE upper(:name) escape '&' OR upper(CODE) LIKE upper(:name) escape '&')");
			}
		}
		else{
			if(StringUtils.isNotEmpty(obj.getName())){
				stringBuilder.append( " AND (upper(NAME) LIKE upper(:name) escape '&' OR upper(CODE) LIKE upper(:name) escape '&')");
			}
			if(StringUtils.isNotEmpty(obj.getCode())){
				stringBuilder.append( " AND upper(CODE) LIKE upper(:name) escape '&'");
			}
		}
		stringBuilder.append(" ORDER BY NAME");
		
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		
		query.addScalar("catUnitId", new LongType());
		query.addScalar("name", new StringType());
		query.addScalar("code", new StringType());
	
		query.setResultTransformer(Transformers.aliasToBean(CatUnitDTO.class));

		if (StringUtils.isNotEmpty(obj.getName())) {
			query.setParameter("name", "%" + obj.getName() + "%");
		}
		
		if (StringUtils.isNotEmpty(obj.getCode())) {
			query.setParameter("code", "%" + obj.getName() + "%");
		}
		query.setMaxResults(20);
		return query.list();
	}
	
	

	@SuppressWarnings("unchecked")
	public List<CatUnitDTO> getForComboBox(CatUnitDTO obj){
		String sqlStr = "SELECT CAT_UNIT_ID catUnitId"	
				+" ,NAME name"			
				+" ,CODE code"
				+" FROM CTCT_CAT_OWNER.CAT_UNIT"
				+" WHERE 1=1";			
			
			StringBuilder sql = new StringBuilder(sqlStr);
		if(StringUtils.isNotEmpty(obj.getStatus())){
			sql.append(" AND STATUS = :status ");
		}
		
		if(StringUtils.isNotEmpty(obj.getCode())){
			sql.append(" AND upper(CODE)=upper(:code) ");
		}
		
		sql.append(" ORDER BY CODE ");
		
		SQLQuery query= getSession().createSQLQuery(sql.toString());
		query.addScalar("catUnitId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		
		query.setResultTransformer(Transformers.aliasToBean(CatUnitDTO.class));
		
		if(StringUtils.isNotEmpty(obj.getStatus())){
			query.setParameter("status", obj.getStatus());
		}
		
		if(StringUtils.isNotEmpty(obj.getCode())){
			query.setParameter("code", obj.getCode());
		}
		
		return query.list();
	}
	
	@SuppressWarnings("unchecked")
	public CatUnitDTO getById(Long id) {
    	StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CAT_UNIT_ID catUnitId ");
		stringBuilder.append(",T1.CODE code ");
		stringBuilder.append(",T1.NAME name ");
		stringBuilder.append(",T1.STATUS status ");

    	stringBuilder.append("FROM CTCT_CAT_OWNER.CAT_UNIT T1 ");    	
    	stringBuilder.append("WHERE T1.IS_DELETED = 'N' AND T1.CAT_UNIT_ID = :catUnitId ");
    	
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
		query.addScalar("catUnitId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("status", new StringType());
    	
		query.setParameter("catUnitId", id);
		query.setResultTransformer(Transformers.aliasToBean(CatUnitDTO.class));
    	
		return (CatUnitDTO) query.uniqueResult();
	}
}
