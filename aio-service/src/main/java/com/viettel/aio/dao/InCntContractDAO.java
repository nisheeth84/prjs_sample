package com.viettel.aio.dao;

import com.viettel.aio.bo.CntContractBO;
import com.viettel.aio.dto.CntContractDTO;
import com.viettel.aio.dto.PurchaseOrderDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
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
@Repository("InCntContractDAO")
public class InCntContractDAO extends BaseFWDAOImpl<CntContractBO, Long> {

    public InCntContractDAO() {
        this.model = new CntContractBO();
    }

    public InCntContractDAO(Session session) {
        this.session = session;
    }	
    
    @SuppressWarnings("unchecked")
	public List<CntContractDTO> doSearch(CntContractDTO criteria) {
    	StringBuilder stringBuilder = getSelectAllQuery();
    	stringBuilder.append("WHERE 1=1 ");
    	
    	if(StringUtils.isNotEmpty(criteria.getKeySearch())){
    		stringBuilder.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
    	
    	if (null != criteria.getStatusLst() && criteria.getStatusLst().size()>0) {
			stringBuilder.append("AND T1.STATUS in (:statusLst) ");
		}
		
		if (StringUtils.isNotEmpty(criteria.getContractCodeKtts())) {
			stringBuilder.append("AND UPPER(T1.CONTRACT_CODE_KTTS) LIKE UPPER(:contractCodeKtts) ESCAPE '\\' ");
		}
		
		if (null != criteria.getSignDate()) {
			stringBuilder.append("AND T1.SIGN_DATE = :signDate ");
		}
		if (null != criteria.getSignDateFrom()) {
			stringBuilder.append("AND T1.SIGN_DATE >= :signDateFrom ");
		}
		if (null != criteria.getSignDateTo()) {
			stringBuilder.append("AND T1.SIGN_DATE <= :signDateTo ");
		}
		/*hungtd_2018_0511_start*/
		if (null != criteria.getCreatedDate()) {
			stringBuilder.append("AND T1.CREATED_DATE = :createdDate ");
		}
		if (null != criteria.getCreatedDateFrom()) {
			stringBuilder.append("AND T1.CREATED_DATE >= :createdDateFrom ");
		}
		if (null != criteria.getCreatedDateTo()) {
			stringBuilder.append("AND T1.CREATED_DATE <= :createdDateTo ");
		}
		/*hungtd_20180511_end*/
		if (null != criteria.getCatPartnerId()) {
			stringBuilder.append("AND T1.CAT_PARTNER_ID = :catPartnerId ");
		}
	
		if (null != criteria.getSysGroupId()) {
			stringBuilder.append("AND T1.SYS_GROUP_ID = :sysGroupId ");
		}
		
		if (null != criteria.getStatus()) {
			stringBuilder.append("AND T1.STATUS = :status ");
		}
	
		if (null != criteria.getContractType()) {
			stringBuilder.append("AND T1.CONTRACT_TYPE = :contractType ");
		}
//		hoanm1_20180312_start
		if (null != criteria.getState()) {
			stringBuilder.append("AND T1.STATE = :state ");
		}
//		hoanm1_20180312_end
		
		//Huypq-20190924-start
		if (null != criteria.getTypeHTCT()) {
			stringBuilder.append(" AND T1.TYPE_HTCT = :typeHTCT ");
		}
		//Huy-end
		stringBuilder.append("ORDER BY T1.CNT_CONTRACT_ID DESC");
	
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());
		
		query.addScalar("cntContractId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("contractCodeKtts", new StringType());
		query.addScalar("content", new StringType());
		query.addScalar("signDate", new DateType());
		query.addScalar("startTime", new DateType());
		query.addScalar("endTime", new DateType());
		query.addScalar("price", new DoubleType());
		query.addScalar("appendixContract", new DoubleType());
		query.addScalar("numStation", new DoubleType());
		query.addScalar("biddingPackageId", new LongType());
//		query.addScalar("biddingPackageName", new StringType());
		query.addScalar("catPartnerId", new LongType());
		query.addScalar("catPartnerName", new StringType());
		query.addScalar("signerPartner", new StringType());
		query.addScalar("sysGroupId", new LongType());
		query.addScalar("sysGroupName", new StringType());
		query.addScalar("signerGroup", new LongType());
		query.addScalar("signerGroupName", new StringType());
		query.addScalar("supervisor", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("formal", new DoubleType());
		query.addScalar("contractType", new LongType());
		query.addScalar("cntContractParentId", new DoubleType());
		query.addScalar("cntContractParentCode", new StringType());
		query.addScalar("cntContractParentName", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("state", new LongType());
		query.addScalar("numDay", new DoubleType());
		query.addScalar("moneyType", new IntegerType());
		query.addScalar("frameParentId", new LongType());
		query.addScalar("frameParentCode", new StringType());
		//Huypq-20190921-start
		query.addScalar("typeHTCT", new LongType());
		query.addScalar("priceHTCT", new DoubleType());
		query.addScalar("monthHTCT", new LongType());
		//Huy-end
		query.addScalar("projectId", new LongType());
		query.addScalar("projectName", new StringType());
		query.addScalar("projectCode", new StringType());
		
		if (null != criteria.getStatusLst() && !criteria.getStatusLst().isEmpty()) {
			query.setParameterList("statusLst", criteria.getStatusLst());
			queryCount.setParameterList("statusLst", criteria.getStatusLst());
		}
		
		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			query.setParameter("key", "%" + criteria.getKeySearch() + "%");
			queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
		}
		if (null != criteria.getSignDate()) {
			query.setParameter("signDate", criteria.getSignDate());
		}
		if (null != criteria.getSignDateFrom()) {
			query.setTimestamp("signDateFrom", criteria.getSignDateFrom());
			queryCount.setTimestamp("signDateFrom", criteria.getSignDateFrom());
		}
		if (null != criteria.getSignDateTo()) {
			query.setTimestamp("signDateTo", criteria.getSignDateTo());
			queryCount.setTimestamp("signDateTo", criteria.getSignDateTo());
		}
		/*hungtd_20180511_start*/
		if (null != criteria.getCreatedDate()) {
			query.setParameter("createdDate", criteria.getCreatedDate());
		}
		if (null != criteria.getCreatedDateFrom()) {
			query.setTimestamp("createdDateFrom", criteria.getCreatedDateFrom());
			queryCount.setTimestamp("createdDateFrom", criteria.getCreatedDateFrom());
		}
		if (null != criteria.getCreatedDateTo()) {
			query.setTimestamp("createdDateTo", criteria.getCreatedDateTo());
			queryCount.setTimestamp("createdDateTo", criteria.getCreatedDateTo());
		}
		/*hungtd_20180511_end*/
		if (null != criteria.getCatPartnerId()) {
			query.setParameter("catPartnerId", criteria.getCatPartnerId());
			queryCount.setParameter("catPartnerId", criteria.getCatPartnerId());
		}
	
		if (null != criteria.getSysGroupId()) {
			query.setParameter("sysGroupId", criteria.getSysGroupId());
			queryCount.setParameter("sysGroupId", criteria.getSysGroupId());
		}
		
		if (null != criteria.getStatus()) {
			query.setParameter("status", criteria.getStatus());
			queryCount.setParameter("status", criteria.getStatus());
		}
		if (null != criteria.getFormal()) {
			query.setParameter("formal", criteria.getFormal());
			queryCount.setParameter("formal", criteria.getFormal());
		}
		if (null != criteria.getContractType()) {
			query.setParameter("contractType", criteria.getContractType());
			queryCount.setParameter("contractType", criteria.getContractType());
		}
//		hoanm1_20180312_start
		if (null != criteria.getState()) {
			query.setParameter("state", criteria.getState());
			queryCount.setParameter("state", criteria.getState());
		}
//		hoanm1_20180312_end
		
		//Huypq-20190924-start
		if (null != criteria.getTypeHTCT()) {
			query.setParameter("typeHTCT", criteria.getTypeHTCT());
			queryCount.setParameter("typeHTCT", criteria.getTypeHTCT());
		}
		//huy-end
		query.setResultTransformer(Transformers.aliasToBean(CntContractDTO.class));
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1)
					* criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return  query.list();
	}  
	
	public CntContractDTO findByCode(CntContractDTO obj) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",T1.CODE code ");
		stringBuilder.append(",T1.NAME name ");
		stringBuilder.append(",T1.CONTRACT_CODE_KTTS contractCodeKtts ");
		stringBuilder.append(",T1.CONTENT content ");
		stringBuilder.append(",T1.SIGN_DATE signDate ");
		stringBuilder.append(",T1.START_TIME startTime ");
		stringBuilder.append(",T1.END_TIME endTime ");
		stringBuilder.append(",T1.PRICE price ");
		stringBuilder.append(",T1.APPENDIX_CONTRACT appendixContract ");
		stringBuilder.append(",T1.NUM_STATION numStation ");
		stringBuilder.append(",T1.BIDDING_PACKAGE_ID biddingPackageId ");
		stringBuilder.append(",T1.CAT_PARTNER_ID catPartnerId ");
		stringBuilder.append(",T1.SIGNER_PARTNER signerPartner ");
		stringBuilder.append(",T1.SYS_GROUP_ID sysGroupId ");
		stringBuilder.append(",T1.SIGNER_GROUP signerGroup ");
		stringBuilder.append(",T1.SUPERVISOR supervisor ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.STATE state ");
		stringBuilder.append(",T1.FORMAL formal ");
		stringBuilder.append(",T1.CONTRACT_TYPE contractType ");
		stringBuilder.append(",T1.CNT_CONTRACT_PARENT_ID cntContractParentId ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
    	
    	stringBuilder.append("FROM CNT_CONTRACT T1 ");    	
    	stringBuilder.append("WHERE  upper(T1.CODE) = upper(:code) AND T1.STATUS != 0");	
    	stringBuilder.append(" AND T1.CONTRACT_TYPE = :contractType");
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
		query.addScalar("cntContractId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("contractCodeKtts", new StringType());
		query.addScalar("content", new StringType());
		query.addScalar("signDate", new DateType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("startTime", new DateType());
		query.addScalar("endTime", new DateType());
		query.addScalar("price", new DoubleType());
		query.addScalar("appendixContract", new DoubleType());
		query.addScalar("numStation", new DoubleType());
		query.addScalar("biddingPackageId", new LongType());
		query.addScalar("catPartnerId", new LongType());
		query.addScalar("signerPartner", new StringType());
		query.addScalar("sysGroupId", new LongType());
		query.addScalar("signerGroup", new LongType());
		query.addScalar("supervisor", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("state", new LongType());
		query.addScalar("formal", new DoubleType());
		query.addScalar("contractType", new LongType());
		query.addScalar("cntContractParentId", new DoubleType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
    	
		query.setParameter("code", obj.getCode());
		query.setParameter("contractType", obj.getContractType());
		query.setResultTransformer(Transformers.aliasToBean(CntContractDTO.class));    	

		return (CntContractDTO) query.uniqueResult();
	}

	public List<CntContractDTO> getForAutoComplete(CntContractDTO obj) {
		StringBuilder stringBuilder = getSelectAllQuery();
		
		stringBuilder.append(" Where STATUS = 1");
		stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=10" : "");
		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			stringBuilder.append(" AND (UPPER(NAME) like UPPER(:key) OR UPPER(CODE) like UPPER(:key) escape '&')");
		}
		
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		
		query.addScalar("cntContractId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("contractCodeKtts", new StringType());
		query.addScalar("content", new StringType());
		query.addScalar("signDate", new DateType());
		query.addScalar("startTime", new DateType());
		query.addScalar("endTime", new DateType());
		query.addScalar("price", new DoubleType());
		query.addScalar("appendixContract", new DoubleType());
		query.addScalar("numStation", new DoubleType());
		query.addScalar("biddingPackageId", new LongType());
		query.addScalar("biddingPackageName", new StringType());
		query.addScalar("catPartnerId", new LongType());
		query.addScalar("signerPartner", new StringType());
		query.addScalar("sysGroupId", new LongType());
		query.addScalar("signerGroup", new LongType());
		query.addScalar("signerGroupName", new StringType());
		query.addScalar("supervisor", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("formal", new DoubleType());
		query.addScalar("contractType", new LongType());
		query.addScalar("cntContractParentId", new DoubleType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
	
		query.setResultTransformer(Transformers.aliasToBean(CntContractDTO.class));

		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			query.setParameter("key","%"+ obj.getKeySearch()+"%");
		}

		query.setMaxResults(20);
		return query.list();
	}
	
	@SuppressWarnings("unchecked")
	public CntContractDTO getById(Long id) {
    	StringBuilder stringBuilder = getSelectAllQuery();
    	stringBuilder.append("WHERE T1.IS_DELETED = 'N' AND T1.CNT_CONTRACT_ID = :cntContractId ");
    	
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
		query.addScalar("cntContractId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("contractCodeKtts", new StringType());
		query.addScalar("content", new StringType());
		query.addScalar("signDate", new DateType());
		query.addScalar("startTime", new DateType());
		query.addScalar("endTime", new DateType());
		query.addScalar("price", new DoubleType());
		query.addScalar("appendixContract", new DoubleType());
		query.addScalar("numStation", new DoubleType());
		query.addScalar("biddingPackageId", new LongType());
		query.addScalar("biddingPackageName", new StringType());
		query.addScalar("catPartnerId", new LongType());
		query.addScalar("catPartnerName", new StringType());
		query.addScalar("signerPartner", new StringType());
		query.addScalar("sysGroupId", new LongType());
		query.addScalar("sysGroupName", new StringType());
		query.addScalar("signerGroup", new LongType());
		query.addScalar("signerGroupName", new StringType());
		query.addScalar("supervisor", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("formal", new DoubleType());
		query.addScalar("contractType", new LongType());
		query.addScalar("cntContractParentId", new DoubleType());
		query.addScalar("cntContractParentCode", new StringType());
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
    	
		query.setParameter("cntContractId", id);
		query.setResultTransformer(Transformers.aliasToBean(CntContractDTO.class));
    	
		return (CntContractDTO) query.uniqueResult();
	}
	
	public StringBuilder getSelectAllQuery(){
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",T1.CODE code ");
		stringBuilder.append(",T1.NAME name ");
		stringBuilder.append(",T1.CONTRACT_CODE_KTTS contractCodeKtts ");
		stringBuilder.append(",T1.CONTENT content ");
		stringBuilder.append(",T1.SIGN_DATE signDate ");
		stringBuilder.append(",T1.START_TIME startTime ");
		stringBuilder.append(",T1.END_TIME endTime ");
		stringBuilder.append(",T1.PRICE price ");
		stringBuilder.append(",T1.APPENDIX_CONTRACT appendixContract ");
		stringBuilder.append(",T1.NUM_STATION numStation ");
		stringBuilder.append(",T1.BIDDING_PACKAGE_ID biddingPackageId ");
		stringBuilder.append(",T1.CAT_PARTNER_ID catPartnerId ");
		stringBuilder.append(",T1.SIGNER_PARTNER signerPartner ");
		stringBuilder.append(",T1.SYS_GROUP_ID sysGroupId ");
		stringBuilder.append(",T1.SIGNER_GROUP signerGroup ");
		stringBuilder.append(",T1.SUPERVISOR supervisor ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.FORMAL formal ");
		stringBuilder.append(",T1.CONTRACT_TYPE contractType ");
		stringBuilder.append(", (select LISTAGG(cnt_contract_id, ',')WITHIN GROUP (ORDER BY cnt_contract_id) " );
		stringBuilder.append(" from cnt_contract cnt_out where cnt_out.contract_type=0 and cnt_out.status !=0 and cnt_out.cnt_contract_id in( "); 
		stringBuilder.append(" (select CNT_CONSTRACT_out_ID from cnt_contract_map cnt_map where cnt_map.CNT_CONSTRACT_IN_ID=T1.cnt_contract_id))) cntContractParentName");
		stringBuilder.append(",T1.CNT_CONTRACT_PARENT_ID cntContractParentId ");
		stringBuilder.append(", (select LISTAGG(code, ',')WITHIN GROUP (ORDER BY code) " );
		stringBuilder.append(" from cnt_contract cnt_out where cnt_out.contract_type=0 and cnt_out.status !=0 and cnt_out.cnt_contract_id in( "); 
		stringBuilder.append(" (select CNT_CONSTRACT_out_ID from cnt_contract_map cnt_map where cnt_map.CNT_CONSTRACT_IN_ID=T1.cnt_contract_id))) cntContractParentCode");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T1.NUM_DAY numDay ");
		stringBuilder.append(",T1.FRAME_PARENT_ID frameParentId ");
		stringBuilder.append(",T1.MONEY_TYPE moneyType ");
		stringBuilder.append(",(SELECT T8.CODE FROM CNT_CONTRACT T8 WHERE T8.CNT_CONTRACT_ID = T1.FRAME_PARENT_ID) frameParentCode ");
		stringBuilder.append(",T2.NAME catPartnerName ");
		stringBuilder.append(",T3.NAME sysGroupName ");
//		stringBuilder.append(",T4.NAME biddingPackageName ");
//		stringBuilder.append(",T4.NAME biddingPackageName ");
		stringBuilder.append(",T5.FULL_NAME signerGroupName ");
		stringBuilder.append(",T1.STATE state ");
		//Huypq-20190921-start
		stringBuilder.append(" ,T1.type_HTCT typeHTCT ");
		stringBuilder.append(" ,T1.price_HTCT priceHTCT ");
		stringBuilder.append(" ,T1.month_HTCT monthHTCT ");
		//Huy-end
		
		//tatph - start
		stringBuilder.append(" ,T1.PROJECT_ID projectId ");
		stringBuilder.append(" ,T1.PROJECT_CODE projectCode ");
		stringBuilder.append(" ,T1.PROJECT_NAME projectName ");
		//tatph-end
		
    	stringBuilder.append("FROM CNT_CONTRACT T1 ");    
    	stringBuilder.append("LEFT JOIN CTCT_CAT_OWNER.CAT_PARTNER T2 ON T1.CAT_PARTNER_ID = T2.CAT_PARTNER_ID ");
    	stringBuilder.append("LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP T3 ON T1.SYS_GROUP_ID = T3.SYS_GROUP_ID ");
//    	stringBuilder.append("JOIN BIDDING_PACKAGE T4 ON T1.BIDDING_PACKAGE_ID = T4.BIDDING_PACKAGE_ID ");
    	stringBuilder.append("LEFT JOIN CTCT_VPS_OWNER.SYS_USER T5 ON T1.SIGNER_GROUP = T5.SYS_USER_ID ");
    	return stringBuilder;
	}
	
	public List<PurchaseOrderDTO> getOrder(Long contractId){
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.PURCHASE_ORDER_ID purchaseOrderId ");
		stringBuilder.append(",T1.CODE code ");
		stringBuilder.append(",T1.NAME name ");
		stringBuilder.append(",T1.CAT_PARTNER_ID catPartnerId ");
		stringBuilder.append(",T1.SIGNER_PARTNER signerPartner ");
		stringBuilder.append(",T1.SYS_GROUP_ID sysGroupId ");
		stringBuilder.append(",T1.SIGNER_GROUP_NAME signerGroupName ");
		stringBuilder.append(",T1.SIGNER_GROUP_ID signerGroupId ");
		stringBuilder.append(",T1.SIGN_DATE signDate ");
		stringBuilder.append(",T1.PRICE price ");
		stringBuilder.append(",T1.EXPENSE expense ");
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		
		stringBuilder.append("FROM PURCHASE_ORDER T1 ");
		stringBuilder.append("Where T1.PURCHASE_ORDER_ID IN("
				+ "SELECT T2.PURCHASE_ORDER_ID FROM CNT_CONTRACT_ORDER T2 WHERE T2.CNT_CONTRACT_ID = :cntContractId"
				+ ") ");
		
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		
		query.addScalar("purchaseOrderId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("catPartnerId", new LongType());
	
		query.addScalar("signerPartner", new StringType());
		query.addScalar("sysGroupId", new LongType());

		query.addScalar("signerGroupId", new LongType());
		query.addScalar("signDate", new DateType());
		query.addScalar("price", new DoubleType());
		query.addScalar("expense", new StringType());
		query.addScalar("description", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());

		query.addScalar("createdGroupId", new LongType());

		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		
		query.setParameter("cntContractId", contractId);
		query.setResultTransformer(Transformers.aliasToBean(PurchaseOrderDTO.class));
		
		return query.list();
	}

	// hoanm1_20180305_start
	public StringBuilder getSelectQueryContract() {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",T1.CODE code ");
		stringBuilder.append(",T1.NAME name ");
		stringBuilder.append(",T1.CONTRACT_CODE_KTTS contractCodeKtts ");
		stringBuilder.append(",T1.CONTENT content ");
		stringBuilder.append(",T1.SIGN_DATE signDate ");
		stringBuilder.append(",T1.START_TIME startTime ");
		stringBuilder.append(",T1.END_TIME endTime ");
		stringBuilder.append(",T1.PRICE price ");
		stringBuilder.append(",T1.APPENDIX_CONTRACT appendixContract ");
		stringBuilder.append(",T1.NUM_STATION numStation ");
		stringBuilder.append(",T1.BIDDING_PACKAGE_ID biddingPackageId ");
		stringBuilder.append(",T1.CAT_PARTNER_ID catPartnerId ");
		stringBuilder.append(",T1.SIGNER_PARTNER signerPartner ");
		stringBuilder.append(",T1.SYS_GROUP_ID sysGroupId ");
		stringBuilder.append(",T1.SIGNER_GROUP signerGroup ");
		stringBuilder.append(",T1.SUPERVISOR supervisor ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.FORMAL formal ");
		stringBuilder.append(",T1.CONTRACT_TYPE contractType ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractParentId ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T2.NAME catPartnerName ");
		stringBuilder.append("FROM CNT_CONTRACT T1 ");
		stringBuilder.append("LEFT JOIN CTCT_CAT_OWNER.CAT_PARTNER T2 ON T1.CAT_PARTNER_ID = T2.CAT_PARTNER_ID ");
		return stringBuilder;
	}

	public StringBuilder getSelectQueryContractKTTS() {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.cnt_contract_ktts_id cntContractId ");
		stringBuilder.append(",T1.CODE code ");
		stringBuilder.append(",T1.NAME name ");
		stringBuilder.append(",T1.CONTENT content ");
		stringBuilder.append(",T1.SIGN_DATE signDate ");
		stringBuilder.append(",T1.START_TIME startTime ");
		stringBuilder.append(",T1.END_TIME endTime ");
		stringBuilder.append(",T1.PRICE price ");
		stringBuilder.append(",T1.APPENDIX_CONTRACT appendixContract ");
		stringBuilder.append(",T1.NUM_STATION numStation ");
		stringBuilder.append(",T1.BIDDING_PACKAGE_ID biddingPackageId ");
		stringBuilder.append(",T1.CAT_PARTNER_ID catPartnerId ");
		stringBuilder.append(",T1.SIGNER_PARTNER signerPartner ");
		stringBuilder.append(",T1.SYS_GROUP_ID sysGroupId ");
		stringBuilder.append(",T1.SIGNER_GROUP signerGroup ");
		stringBuilder.append(",T1.SUPERVISOR supervisor ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.FORMAL formal ");
		stringBuilder.append(",T1.CNT_CONTRACT_PARENT_ID cntContractParentId ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append("FROM CNT_CONTRACT_KTTS T1 ");
		return stringBuilder;
	}

	@SuppressWarnings("unchecked")
	public List<CntContractDTO> getListContract(CntContractDTO criteria) {
		StringBuilder stringBuilder = getSelectQueryContract();

		stringBuilder.append(" Where T1.STATUS != 0 and contract_type=0  ");

		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			stringBuilder
					.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("cntContractId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("contractCodeKtts", new StringType());
		query.addScalar("content", new StringType());
		query.addScalar("signDate", new DateType());
		query.addScalar("startTime", new DateType());
		query.addScalar("endTime", new DateType());
		query.addScalar("price", new DoubleType());
		query.addScalar("appendixContract", new DoubleType());
		query.addScalar("numStation", new DoubleType());
		query.addScalar("biddingPackageId", new LongType());
		query.addScalar("catPartnerId", new LongType());
		query.addScalar("catPartnerName", new StringType());
		query.addScalar("signerPartner", new StringType());
		query.addScalar("sysGroupId", new LongType());
		query.addScalar("signerGroup", new LongType());
		query.addScalar("supervisor", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("formal", new DoubleType());
		query.addScalar("contractType", new LongType());
		query.addScalar("cntContractParentId", new DoubleType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());

		query.setResultTransformer(Transformers
				.aliasToBean(CntContractDTO.class));

		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			query.setParameter("key", "%" + criteria.getKeySearch() + "%");
			queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
		}
		query.setResultTransformer(Transformers
				.aliasToBean(CntContractDTO.class));
		
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1)
					* criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult())
				.intValue());
		List ls = query.list();
		return ls;
		// return query.list();

	}

	@SuppressWarnings("unchecked")
	public List<CntContractDTO> getListContractKTTS(CntContractDTO criteria) {
		StringBuilder stringBuilder = getSelectQueryContractKTTS();

		stringBuilder.append(" Where STATUS = 1  ");
		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			stringBuilder
					.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("cntContractId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("content", new StringType());
		query.addScalar("signDate", new DateType());
		query.addScalar("startTime", new DateType());
		query.addScalar("endTime", new DateType());
		query.addScalar("price", new DoubleType());
		query.addScalar("appendixContract", new DoubleType());
		query.addScalar("numStation", new DoubleType());
		query.addScalar("biddingPackageId", new LongType());
		// query.addScalar("biddingPackageName", new StringType());
		query.addScalar("catPartnerId", new LongType());
		query.addScalar("signerPartner", new StringType());
		query.addScalar("sysGroupId", new LongType());
		query.addScalar("signerGroup", new LongType());
		// query.addScalar("signerGroupName", new StringType());
		query.addScalar("supervisor", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("formal", new DoubleType());
		// query.addScalar("contractType", new LongType());
		query.addScalar("cntContractParentId", new DoubleType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());

		query.setResultTransformer(Transformers
				.aliasToBean(CntContractDTO.class));

		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			query.setParameter("key", "%" + criteria.getKeySearch() + "%");
			queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
		}
		query.setResultTransformer(Transformers
				.aliasToBean(CntContractDTO.class));
		List ls = query.list();
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1)
					* criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult())
				.intValue());
		return ls;
	}

	public List<CntContractDTO> getForAutoCompleteMap(CntContractDTO obj) {
		StringBuilder stringBuilder = getSelectQueryContract();

		stringBuilder.append(" Where T1.STATUS = 1 and contract_type=0");
		stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=10" : "");
		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			stringBuilder
					.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("cntContractId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("contractCodeKtts", new StringType());
		query.addScalar("content", new StringType());
		query.addScalar("signDate", new DateType());
		query.addScalar("startTime", new DateType());
		query.addScalar("endTime", new DateType());
		query.addScalar("price", new DoubleType());
		query.addScalar("appendixContract", new DoubleType());
		query.addScalar("numStation", new DoubleType());
		query.addScalar("biddingPackageId", new LongType());
		// query.addScalar("biddingPackageName", new StringType());
		query.addScalar("catPartnerId", new LongType());
		query.addScalar("signerPartner", new StringType());
		query.addScalar("sysGroupId", new LongType());
		query.addScalar("signerGroup", new LongType());
		// query.addScalar("signerGroupName", new StringType());
		query.addScalar("supervisor", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("formal", new DoubleType());
		query.addScalar("contractType", new LongType());
		query.addScalar("cntContractParentId", new DoubleType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());

		query.setResultTransformer(Transformers
				.aliasToBean(CntContractDTO.class));

		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			query.setParameter("key", "%" + obj.getKeySearch() + "%");
		}

		return query.list();
	}

	public List<CntContractDTO> getForAutoCompleteKTTS(CntContractDTO obj) {
		StringBuilder stringBuilder = getSelectQueryContractKTTS();

		stringBuilder.append(" Where T1.STATUS = 1");
		stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=10" : "");
		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			stringBuilder
					.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("cntContractId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		// query.addScalar("contractCodeKtts", new StringType());
		query.addScalar("content", new StringType());
		query.addScalar("signDate", new DateType());
		query.addScalar("startTime", new DateType());
		query.addScalar("endTime", new DateType());
		query.addScalar("price", new DoubleType());
		query.addScalar("appendixContract", new DoubleType());
		query.addScalar("numStation", new DoubleType());
		query.addScalar("biddingPackageId", new LongType());
		// query.addScalar("biddingPackageName", new StringType());
		query.addScalar("catPartnerId", new LongType());
		query.addScalar("signerPartner", new StringType());
		query.addScalar("sysGroupId", new LongType());
		query.addScalar("signerGroup", new LongType());
		// query.addScalar("signerGroupName", new StringType());
		query.addScalar("supervisor", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("formal", new DoubleType());
		// query.addScalar("contractType", new LongType());
		query.addScalar("cntContractParentId", new DoubleType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());

		query.setResultTransformer(Transformers
				.aliasToBean(CntContractDTO.class));

		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			query.setParameter("key", "%" + obj.getKeySearch() + "%");
		}

		return query.list();
	}

	public CntContractDTO findByCodeKTTS(String value) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.cnt_contract_ktts_id cntContractId ");
		stringBuilder.append(",T1.CODE code ");
		stringBuilder.append(",T1.NAME name ");
		stringBuilder.append(",T1.CONTENT content ");
		stringBuilder.append(",T1.SIGN_DATE signDate ");
		stringBuilder.append(",T1.START_TIME startTime ");
		stringBuilder.append(",T1.END_TIME endTime ");
		stringBuilder.append(",T1.PRICE price ");
		stringBuilder.append(",T1.APPENDIX_CONTRACT appendixContract ");
		stringBuilder.append(",T1.NUM_STATION numStation ");
		stringBuilder.append(",T1.BIDDING_PACKAGE_ID biddingPackageId ");
		stringBuilder.append(",T1.CAT_PARTNER_ID catPartnerId ");
		stringBuilder.append(",T1.SIGNER_PARTNER signerPartner ");
		stringBuilder.append(",T1.SYS_GROUP_ID sysGroupId ");
		stringBuilder.append(",T1.SIGNER_GROUP signerGroup ");
		stringBuilder.append(",T1.SUPERVISOR supervisor ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.FORMAL formal ");
		stringBuilder.append(",T1.CNT_CONTRACT_PARENT_ID cntContractParentId ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");

		stringBuilder.append("FROM CNT_CONTRACT_KTTS T1 ");
		stringBuilder.append("WHERE  upper(T1.CODE) = upper(:code)");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("cntContractId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("content", new StringType());
		query.addScalar("signDate", new DateType());
		query.addScalar("startTime", new DateType());
		query.addScalar("endTime", new DateType());
		query.addScalar("price", new DoubleType());
		query.addScalar("appendixContract", new DoubleType());
		query.addScalar("numStation", new DoubleType());
		query.addScalar("biddingPackageId", new LongType());
		query.addScalar("catPartnerId", new LongType());
		query.addScalar("signerPartner", new StringType());
		query.addScalar("sysGroupId", new LongType());
		query.addScalar("signerGroup", new LongType());
		query.addScalar("supervisor", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("formal", new DoubleType());
		query.addScalar("cntContractParentId", new DoubleType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());

		query.setParameter("code", value);
		query.setResultTransformer(Transformers
				.aliasToBean(CntContractDTO.class));

		return (CntContractDTO) query.uniqueResult();
	}
	// hoanm1_20180305_start
	//
	public Long deleteContract(List<Long> cntContractMapLst) {
    	try {
    	StringBuilder sql = new StringBuilder(" delete from  cnt_contract_map ccm "
    			+ " where ccm.CNT_CONTRACT_MAP_ID in (:cntContractMapLst)");
    	SQLQuery query = getSession().createSQLQuery(sql.toString());
    	query.setParameterList("cntContractMapLst", cntContractMapLst);
    	query.executeUpdate();
    	return 1L;
    	} catch(Exception e) {
    		e.getMessage();
    		return 0L;
    	}
    	
    }
	
	@SuppressWarnings("unchecked")
	public List<CntContractDTO> findByCodeOut(Long value) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.cnt_contract_map_id cntContractMapId ");
		stringBuilder.append(" FROM CNT_CONTRACT_MAP T1 ");
		stringBuilder.append(" WHERE T1.cnt_constract_in_id=:cntContractId");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("cntContractMapId", new LongType());
		query.setParameter("cntContractId", value);
		query.setResultTransformer(Transformers
				.aliasToBean(CntContractDTO.class));

		return query.list();
	}
	//
	
	@SuppressWarnings("unchecked")
	public List<CntContractDTO> getContract(Long contractId){
		
		StringBuilder sql = new StringBuilder(" SELECT\r\n" + 
				"    t1.cnt_contract_id cntContractId,\r\n" +
				"    ccm.cnt_contract_map_id cntContractMapId,\r\n" +
				"    t1.code code,\r\n" + 
				"    t1.name name,\r\n" + 
				"    t1.price price,\r\n" + 
				"    t2.name catPartnerName,\r\n" + 
				"    t3.name sysGroupName\r\n" + 
				"FROM\r\n" + 
				"    cnt_contract t1\r\n" + 
				"    left join cnt_contract_map ccm on t1.CNT_CONTRACT_ID=ccm.CNT_CONSTRACT_OUT_ID\r\n" + 
				"    LEFT JOIN ctct_cat_owner.cat_partner t2 ON t1.cat_partner_id = t2.cat_partner_id\r\n" + 
				"    LEFT JOIN ctct_cat_owner.sys_group t3 ON t1.sys_group_id = t3.sys_group_id\r\n" + 
				"    where ccm.CNT_CONTRACT_MAP_ID in (select ccm.CNT_CONTRACT_MAP_ID \r\n" + 
				"    from cnt_contract_map ccm " + 
				"    where ccm.CNT_CONSTRACT_IN_ID = :cntContractId) ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("cntContractMapId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("price", new DoubleType());
		query.addScalar("catPartnerName", new StringType());
		query.addScalar("sysGroupName", new StringType());
		query.setParameter("cntContractId", contractId);
		query.setResultTransformer(Transformers
				.aliasToBean(CntContractDTO.class));
		return query.list();
		
	}
	
	/**hoangnh start 03012019**/
	public CntContractDTO checkMapConstract(String code){
		StringBuilder sql = new StringBuilder("SELECT CNT_CONTRACT_ID cntContractId,"
				+ "CONTRACT_CODE_KTTS contractCodeKtts "
				+ "FROM CNT_CONTRACT WHERE CODE =:code ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("contractCodeKtts", new StringType());
		query.setParameter("code", code);
		query.setResultTransformer(Transformers.aliasToBean(CntContractDTO.class));
		return (CntContractDTO) query.uniqueResult();
	}
	/**hoangnh end 03012019**/
}
