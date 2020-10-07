package com.viettel.aio.dao;

import com.viettel.aio.bo.CntContractPaymentBO;
import com.viettel.aio.dto.CntConstrWorkItemTaskDTO;
import com.viettel.aio.dto.CntContractPaymentDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.aio.dto.ShipmentDTO;
import com.viettel.wms.dto.StockTransDTO;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.*;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author hailh10
 */
@Repository("cntContractPaymentDAO")
public class CntContractPaymentDAO extends BaseFWDAOImpl<CntContractPaymentBO, Long> {

    public CntContractPaymentDAO() {
        this.model = new CntContractPaymentBO();
    }

    public CntContractPaymentDAO(Session session) {
        this.session = session;
    }	
    
    @SuppressWarnings("unchecked")
	public List<CntContractPaymentDTO> doSearch(CntContractPaymentDTO criteria) {
    	StringBuilder stringBuilder = getSelectAllQuery();
    	stringBuilder.append("WHERE STATUS = 1 ");
    	
		
		if (null != criteria.getCntContractId()) {
			stringBuilder.append("AND T1.CNT_CONTRACT_ID = :cntContractId ");
		}
		
		stringBuilder.append(" ORDER BY T1.CNT_CONTRACT_PAYMENT_ID DESC ");
	
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");
    	

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());
    
		query.addScalar("cntContractPaymentId", new LongType());
		query.addScalar("paymentPhase", new StringType());
		query.addScalar("paymentPrice", new DoubleType());
		query.addScalar("paymentDate", new DateType());
		query.addScalar("paymentMode", new StringType());
		query.addScalar("description", new StringType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("moneyType", new IntegerType());
		query.addScalar("paymentPlanPrice", new DoubleType());
    	
		query.addScalar("paymentDateTo", new DateType());
		
		if (null != criteria.getCntContractId()) {
			query.setParameter("cntContractId", criteria.getCntContractId());
			queryCount.setParameter("cntContractId", criteria.getCntContractId());
		}
		
		query.setResultTransformer(Transformers.aliasToBean(CntContractPaymentDTO.class));    	
		
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		List ls = query.list();
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return ls;
	}  
	
	public CntContractPaymentDTO findByPaymentPhase(CntContractPaymentDTO value) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CNT_CONTRACT_PAYMENT_ID cntContractPaymentId ");
		stringBuilder.append(",T1.PAYMENT_PHASE paymentPhase ");
		stringBuilder.append(",T1.PAYMENT_PRICE paymentPrice ");
		stringBuilder.append(",T1.PAYMENT_DATE paymentDate ");
		stringBuilder.append(",T1.PAYMENT_MODE paymentMode ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
    	
    	stringBuilder.append("FROM CNT_CONTRACT_PAYMENT T1 ");    	
    	stringBuilder.append("WHERE T1.STATUS = 1 AND T1.PAYMENT_PHASE = :paymentPhase and T1.CNT_CONTRACT_ID = :cntContractId");	
    	
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
		query.addScalar("cntContractPaymentId", new LongType());
		query.addScalar("paymentPhase", new StringType());
		query.addScalar("paymentPrice", new DoubleType());
		query.addScalar("paymentDate", new DateType());
		query.addScalar("paymentMode", new StringType());
		query.addScalar("description", new StringType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
    	
	
		query.setParameter("cntContractId", value.getCntContractId());
		query.setParameter("paymentPhase", value.getPaymentPhase());
		
		query.setResultTransformer(Transformers.aliasToBean(CntContractPaymentDTO.class));    	

		return (CntContractPaymentDTO) query.uniqueResult();
	}

	public List<CntContractPaymentDTO> getForAutoComplete(CntContractPaymentDTO obj) {
		String sql = "SELECT CNT_CONTRACT_PAYMENT_ID cntContractPaymentId"	
			+" ,NAME name"			
			+" ,VALUE value"
			+" FROM CNT_CONTRACT_PAYMENT"
			+" WHERE IS_DELETED = 'N' AND ISACTIVE = 'Y'";			
		
		StringBuilder stringBuilder = new StringBuilder(sql);
		
		stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=10" : "");
//		stringBuilder.append(StringUtils.isNotEmpty(obj.getName()) ? " AND (upper(NAME) LIKE upper(:name) ESCAPE '\\'" + (StringUtils.isNotEmpty(obj.getValue()) ? " OR upper(VALUE) LIKE upper(:value) ESCAPE '\\'" : "") + ")" : (StringUtils.isNotEmpty(obj.getValue()) ? "AND upper(VALUE) LIKE upper(:value) ESCAPE '\\'" : ""));
		stringBuilder.append(" ORDER BY NAME");
		
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		
		query.addScalar("cntContractPaymentId", new LongType());
		query.addScalar("name", new StringType());
		query.addScalar("value", new StringType());
	
		query.setResultTransformer(Transformers.aliasToBean(CntContractPaymentDTO.class));

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
	public CntContractPaymentDTO getById(Long id) {
    	StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CNT_CONTRACT_PAYMENT_ID cntContractPaymentId ");
		stringBuilder.append(",T1.PAYMENT_PHASE paymentPhase ");
		stringBuilder.append(",T1.PAYMENT_PRICE paymentPrice ");
		stringBuilder.append(",T1.PAYMENT_DATE paymentDate ");
		stringBuilder.append(",T1.PAYMENT_MODE paymentMode ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CNT_CONTRACT WHERE CNT_CONTRACT_ID = T1.CNT_CONTRACT_ID) cntContractName  ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CREATED_USER WHERE CREATED_USER_ID = T1.CREATED_USER_ID) createdUserName  ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CREATED_GROUP WHERE CREATED_GROUP_ID = T1.CREATED_GROUP_ID) createdGroupName  ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM UPDATED_USER WHERE UPDATED_USER_ID = T1.UPDATED_USER_ID) updatedUserName  ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM UPDATED_GROUP WHERE UPDATED_GROUP_ID = T1.UPDATED_GROUP_ID) updatedGroupName  ");

    	stringBuilder.append("FROM CNT_CONTRACT_PAYMENT T1 ");    	
    	stringBuilder.append("WHERE T1.IS_DELETED = 'N' AND T1.CNT_CONTRACT_PAYMENT_ID = :cntContractPaymentId ");
    	
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
		query.addScalar("cntContractPaymentId", new LongType());
		query.addScalar("paymentPhase", new StringType());
		query.addScalar("paymentPrice", new DoubleType());
		query.addScalar("paymentDate", new DateType());
		query.addScalar("paymentMode", new StringType());
		query.addScalar("description", new StringType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("cntContractName", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdUserName", new StringType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("createdGroupName", new StringType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedUserName", new StringType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("updatedGroupName", new StringType());
    	
		query.setParameter("cntContractPaymentId", id);
		query.setResultTransformer(Transformers.aliasToBean(CntContractPaymentDTO.class));
    	
		return (CntContractPaymentDTO) query.uniqueResult();
	}
	
	public StringBuilder getSelectAllQuery(){
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CNT_CONTRACT_PAYMENT_ID cntContractPaymentId ");
		stringBuilder.append(",T1.PAYMENT_PHASE paymentPhase ");
		stringBuilder.append(",T1.PAYMENT_PRICE paymentPrice ");
		stringBuilder.append(",T1.PAYMENT_DATE paymentDate ");
		stringBuilder.append(",T1.PAYMENT_MODE paymentMode ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T1.MONEY_TYPE moneyType ");
		stringBuilder.append(",T1.PAYMENT_PLAN_PRICE paymentPlanPrice ");
		stringBuilder.append(",T1.PAYMENT_DATE_TO paymentDateTo ");
    	stringBuilder.append("FROM CNT_CONTRACT_PAYMENT T1 ");    	
    	return stringBuilder;
	}

	public List<CntConstrWorkItemTaskDTO> getConstructionByPaymentId(CntContractPaymentDTO criteria) {
		StringBuilder stringBuilder = new StringBuilder("SELECT T1.CONSTRUCTION_ID constructionId, T1.CODE constructionCode, T1.NAME constructionName, T1.STATUS status FROM CONSTRUCTION T1"
				+ " JOIN CNT_CONTRACT_PAYMENT_CST T3 on T3.CONSTRUCTION_ID = T1.CONSTRUCTION_ID"
				+ " WHERE T3.CNT_CONTRACT_PAYMENT_ID = :PaymentId");
		if(StringUtils.isNotEmpty(criteria.getKeySearch())){
			stringBuilder.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		query.addScalar("constructionId", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("constructionName", new StringType());
		query.addScalar("status", new LongType());
		query.setParameter("PaymentId", criteria.getCntContractPaymentId());
		if(StringUtils.isNotEmpty(criteria.getKeySearch())){
			query.setParameter("key", "%"+criteria.getKeySearch()+"%");
		}
		query.setResultTransformer(Transformers
				.aliasToBean(CntConstrWorkItemTaskDTO.class));
		List<CntConstrWorkItemTaskDTO> list = query.list();
		return list;
	}
	public List<ShipmentDTO> getGoodsByPaymentId(CntContractPaymentDTO criteria) {
		StringBuilder stringBuilder = new StringBuilder("SELECT T1.SHIPMENT_GOODS_ID shipmentGoodsId, T1.goods_code goodsCode"
				+ ", T1.goods_name goodsName, T1.unit_type_name unitTypeName,T1.apply_total_money applyTotalMoney"
				+ ",T1.apply_price applyPrice, T1.amount amount  FROM SHIPMENT_GOODS T1"
				+ " JOIN SHIPMENT T2 on T2.SHIPMENT_ID = T1.SHIPMENT_ID "
				+ " JOIN CNT_CONTRACT_PAYMENT_CST T3 on T3.SHIPMENT_GOODS_ID = T1.SHIPMENT_GOODS_ID"
				+ " WHERE T3.CNT_CONTRACT_PAYMENT_ID = :acceptanceId");
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
		
		query.setParameter("acceptanceId", criteria.getCntContractPaymentId());
		if(StringUtils.isNotEmpty(criteria.getKeySearch())){
			query.setParameter("key", "%"+criteria.getKeySearch()+"%");
		}
		query.setResultTransformer(Transformers
				.aliasToBean(ShipmentDTO.class));
		List<ShipmentDTO> list = query.list();
		return list;
	}
	
	public List<StockTransDTO> getStockTransByPaymentId(CntContractPaymentDTO criteria) {
		StringBuilder stringBuilder = new StringBuilder("SELECT"
				+ " T2.STOCK_TRANS_DETAIL_ID stockTransDetailId, T2.GOODS_CODE goodsCode, T2.GOODS_NAME goodsName, T2.GOODS_STATE_NAME goodsStateName"
				+ ", T2.GOODS_UNIT_NAME goodsUnitName, T2.AMOUNT_ORDER amountOrder, T2.AMOUNT_REAL amountReal"
				+ " FROM STOCK_TRANS T JOIN STOCK_TRANS_DETAIL T2 on T.STOCK_TRANS_ID = T2.STOCK_TRANS_ID"
				+ " JOIN CNT_CONTRACT_Payment_CST T3 on T3.STOCK_TRANS_DETAIL_ID = T2.STOCK_TRANS_DETAIL_ID"
				+ " WHERE T3.CNT_CONTRACT_PAYMENT_ID = :PaymentId"
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
		
		query.setParameter("PaymentId", criteria.getCntContractPaymentId());
		if(StringUtils.isNotEmpty(criteria.getKeySearch())){
			query.setParameter("key", "%"+criteria.getKeySearch()+"%");
		}
		query.setResultTransformer(Transformers
				.aliasToBean(StockTransDTO.class));
		List<StockTransDTO> list = query.list();
		return list;
	}
}
