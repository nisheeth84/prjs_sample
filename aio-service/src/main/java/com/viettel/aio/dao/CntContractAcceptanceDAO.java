package com.viettel.aio.dao;

import com.viettel.aio.bo.CntContractAcceptanceBO;
import com.viettel.aio.dto.CntConstrWorkItemTaskDTO;
import com.viettel.aio.dto.CntContractAcceptanceDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.aio.dto.ShipmentDTO;
import com.viettel.wms.dto.StockTransDTO;
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
@Repository("cntContractAcceptanceDAO")
public class CntContractAcceptanceDAO extends BaseFWDAOImpl<CntContractAcceptanceBO, Long> {

    public CntContractAcceptanceDAO() {
        this.model = new CntContractAcceptanceBO();
    }

    public CntContractAcceptanceDAO(Session session) {
        this.session = session;
    }	
    
    @SuppressWarnings("unchecked")
	public List<CntContractAcceptanceDTO> doSearch(CntContractAcceptanceDTO criteria) {
    	StringBuilder stringBuilder = getSelectAllQuery();
    	
    	stringBuilder.append("WHERE STATUS = 1 ");
		
		if (null != criteria.getCntContractId()) {
			stringBuilder.append("AND T1.CNT_CONTRACT_ID = :cntContractId");
		}
		stringBuilder.append(" ORDER BY T1.CNT_CONTRACT_ACCEPTANCE_ID DESC ");
		
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());
    
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("description", new StringType());
		query.addScalar("acceptanceResult", new StringType());
		query.addScalar("acceptanceDate", new DateType());
		query.addScalar("acceptanceSigner", new StringType());
		query.addScalar("cntContractAcceptanceId", new LongType());
		query.addScalar("createdDate", new DateType());
    	
	
		if (null != criteria.getCntContractId()) {
			query.setParameter("cntContractId", criteria.getCntContractId());
			queryCount.setParameter("cntContractId", criteria.getCntContractId());
		}
		
		query.setResultTransformer(Transformers.aliasToBean(CntContractAcceptanceDTO.class));    	
		
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		List ls = query.list();
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return ls;
	}  
	
	public CntContractAcceptanceDTO findByValue(String value) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.ACCEPTANCE_RESULT acceptanceResult ");
		stringBuilder.append(",T1.ACCEPTANCE_DATE acceptanceDate ");
		stringBuilder.append(",T1.ACCEPTANCE_SIGNER acceptanceSigner ");
		stringBuilder.append(",T1.CNT_CONTRACT_ACCEPTANCE_ID cntContractAcceptanceId ");
    	
    	stringBuilder.append("FROM CNT_CONTRACT_ACCEPTANCE T1 ");    	
    	stringBuilder.append("WHERE T1.IS_DELETED = 'N' AND upper(T1.VALUE) = upper(:value)");	
    	
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("description", new StringType());
		query.addScalar("acceptanceResult", new StringType());
		query.addScalar("acceptanceDate", new DateType());
		query.addScalar("acceptanceSigner", new StringType());
		query.addScalar("cntContractAcceptanceId", new LongType());
    	
		query.setParameter("value", value);    	
		query.setResultTransformer(Transformers.aliasToBean(CntContractAcceptanceDTO.class));    	

		return (CntContractAcceptanceDTO) query.uniqueResult();
	}

	public List<CntContractAcceptanceDTO> getForAutoComplete(CntContractAcceptanceDTO obj) {
		StringBuilder stringBuilder = getSelectAllQuery();
		
		stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=10" : "");
//		stringBuilder.append(StringUtils.isNotEmpty(obj.getName()) ? " AND (upper(NAME) LIKE upper(:name) ESCAPE '\\'" + (StringUtils.isNotEmpty(obj.getValue()) ? " OR upper(VALUE) LIKE upper(:value) ESCAPE '\\'" : "") + ")" : (StringUtils.isNotEmpty(obj.getValue()) ? "AND upper(VALUE) LIKE upper(:value) ESCAPE '\\'" : ""));
		stringBuilder.append(" ORDER BY NAME");
		
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("description", new StringType());
		query.addScalar("acceptanceResult", new StringType());
		query.addScalar("acceptanceDate", new DateType());
		query.addScalar("acceptanceSigner", new StringType());
		query.addScalar("cntContractAcceptanceId", new LongType());
	
		query.setResultTransformer(Transformers.aliasToBean(CntContractAcceptanceDTO.class));

		
		query.setMaxResults(20);
		return query.list();
	}
	
	@SuppressWarnings("unchecked")
	public CntContractAcceptanceDTO getById(Long id) {
    	StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.UPDATED_GROUP_ID updatedGroupId ");
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
		stringBuilder.append(",T1.ACCEPTANCE_RESULT acceptanceResult ");
		stringBuilder.append(",T1.ACCEPTANCE_DATE acceptanceDate ");
		stringBuilder.append(",T1.ACCEPTANCE_SIGNER acceptanceSigner ");
		stringBuilder.append(",T1.CNT_CONTRACT_ACCEPTANCE_ID cntContractAcceptanceId ");

    	stringBuilder.append("FROM CNT_CONTRACT_ACCEPTANCE T1 ");    	
    	stringBuilder.append("WHERE T1.IS_DELETED = 'N' AND T1.CNT_CONTRACT_ACCEPTANCE_ID = :cntContractAcceptanceId ");
    	
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
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
		query.addScalar("acceptanceResult", new StringType());
		query.addScalar("acceptanceDate", new DateType());
		query.addScalar("acceptanceSigner", new StringType());
		query.addScalar("cntContractAcceptanceId", new LongType());
    	
		query.setParameter("cntContractAcceptanceId", id);
		query.setResultTransformer(Transformers.aliasToBean(CntContractAcceptanceDTO.class));
    	
		return (CntContractAcceptanceDTO) query.uniqueResult();
	}
	
	public StringBuilder getSelectAllQuery(){
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.ACCEPTANCE_RESULT acceptanceResult ");
		stringBuilder.append(",T1.ACCEPTANCE_DATE acceptanceDate ");
		stringBuilder.append(",T1.ACCEPTANCE_SIGNER acceptanceSigner ");
		stringBuilder.append(",T1.CNT_CONTRACT_ACCEPTANCE_ID cntContractAcceptanceId ");
    	
    	stringBuilder.append("FROM CNT_CONTRACT_ACCEPTANCE T1 ");    	
    	
    	return stringBuilder;
	}
	public List<CntConstrWorkItemTaskDTO> getConstructionByAcceptanceId(CntContractAcceptanceDTO criteria) {
		StringBuilder stringBuilder = new StringBuilder("SELECT T1.CONSTRUCTION_ID constructionId, T1.CODE constructionCode, T1.NAME constructionName, T1.STATUS status FROM CONSTRUCTION T1"
				+ " JOIN CNT_CONTRACT_ACCEPTANCE_CST T3 on T3.CONSTRUCTION_ID = T1.CONSTRUCTION_ID"
				+ " WHERE T3.CNT_CONTRACT_ACCEPTANCE_ID = :acceptanceId");
		if(StringUtils.isNotEmpty(criteria.getKeySearch())){
			stringBuilder.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		query.addScalar("constructionId", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("constructionName", new StringType());
		query.addScalar("status", new LongType());
		query.setParameter("acceptanceId", criteria.getCntContractAcceptanceId());
		if(StringUtils.isNotEmpty(criteria.getKeySearch())){
			query.setParameter("key", "%"+criteria.getKeySearch()+"%");
		}
		query.setResultTransformer(Transformers
				.aliasToBean(CntConstrWorkItemTaskDTO.class));
		List<CntConstrWorkItemTaskDTO> list = query.list();
		return list;
	}
	public List<ShipmentDTO> getGoodsByAcceptanceId(CntContractAcceptanceDTO criteria) {
		StringBuilder stringBuilder = new StringBuilder("SELECT T1.SHIPMENT_GOODS_ID shipmentGoodsId, T1.goods_code goodsCode"
				+ ", T1.goods_name goodsName, T1.unit_type_name unitTypeName,T1.apply_total_money applyTotalMoney"
				+ ",T1.apply_price applyPrice, T1.amount amount  FROM SHIPMENT_GOODS T1"
				+ " JOIN SHIPMENT T2 on T2.SHIPMENT_ID = T1.SHIPMENT_ID "
				+ " JOIN CNT_CONTRACT_ACCEPTANCE_CST T3 on T3.SHIPMENT_GOODS_ID = T1.SHIPMENT_GOODS_ID"
				+ " WHERE T3.CNT_CONTRACT_ACCEPTANCE_ID = :acceptanceId");
		if(StringUtils.isNotEmpty(criteria.getKeySearch())){
			stringBuilder.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		query.addScalar("shipmentGoodsId", new LongType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("unitTypeName", new StringType());
		query.addScalar("amount", new LongType());
		query.addScalar("applyTotalMoney", new LongType());
		query.addScalar("applyPrice", new LongType());
		
		query.setParameter("acceptanceId", criteria.getCntContractAcceptanceId());
		if(StringUtils.isNotEmpty(criteria.getKeySearch())){
			query.setParameter("key", "%"+criteria.getKeySearch()+"%");
		}
		query.setResultTransformer(Transformers
				.aliasToBean(ShipmentDTO.class));
		List<ShipmentDTO> list = query.list();
		return list;
	}
	public List<StockTransDTO> getStockTransByAcceptanceId(CntContractAcceptanceDTO criteria) {
		StringBuilder stringBuilder = new StringBuilder("SELECT"
				+ " T2.STOCK_TRANS_DETAIL_ID stockTransDetailId, T2.GOODS_CODE goodsCode, T2.GOODS_NAME goodsName, T2.GOODS_STATE_NAME goodsStateName"
				+ ", T2.GOODS_UNIT_NAME goodsUnitName, T2.AMOUNT_ORDER amountOrder, T2.AMOUNT_REAL amountReal"
				+ " FROM STOCK_TRANS T JOIN STOCK_TRANS_DETAIL T2 on T.STOCK_TRANS_ID = T2.STOCK_TRANS_ID"
				+ " JOIN CNT_CONTRACT_ACCEPTANCE_CST T3 on T3.STOCK_TRANS_DETAIL_ID = T2.STOCK_TRANS_DETAIL_ID"
				+ " WHERE T3.CNT_CONTRACT_ACCEPTANCE_ID = :acceptanceId"
				+ " AND T.TYPE=2 AND T.STATUS=2 AND T.BUSINESS_TYPE=10");
		if(StringUtils.isNotEmpty(criteria.getKeySearch())){
			stringBuilder.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		query.addScalar("stockTransDetailId", new LongType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsStateName", new StringType());
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("amountOrder", new DoubleType());
		query.addScalar("amountReal", new DoubleType());
		
		query.setParameter("acceptanceId", criteria.getCntContractAcceptanceId());
		if(StringUtils.isNotEmpty(criteria.getKeySearch())){
			query.setParameter("key", "%"+criteria.getKeySearch()+"%");
		}
		query.setResultTransformer(Transformers
				.aliasToBean(StockTransDTO.class));
		List<StockTransDTO> list = query.list();
		return list;
	}
}
