package com.viettel.aio.dao;

import com.viettel.aio.bo.CntContractBO;
import com.viettel.aio.dto.*;
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
@Repository("AIOcntContractDAO")
public class CntContractDAO extends BaseFWDAOImpl<CntContractBO, Long> {

    public CntContractDAO() {
        this.model = new CntContractBO();
    }

    public CntContractDAO(Session session) {
        this.session = session;
    }	
    
    @SuppressWarnings("unchecked")
	public List<CntContractDTO> doSearchXNXD(CntContractDTO criteria) {
    	StringBuilder stringBuilder = getSelectAllQueryXNXD();
    	
    	stringBuilder.append("WHERE 1=1 and T1.contract_type=9 AND T1.STATUS  != 0 ");
    	
//    	if(StringUtils.isNotEmpty(criteria.getCheckOS())){
//    		stringBuilder.append(" AND T1.CONTRACT_TYPE_O IS NOT NULL ");
//    	} else {
//    		stringBuilder.append(" AND T1.CONTRACT_TYPE_O IS NULL ");
//    	}
//    	if(criteria.getContractTypeO() != null){
//    		stringBuilder.append(" AND T1.CONTRACT_TYPE_O =:contractTypeO ");
//    	}
    	
    	if(StringUtils.isNotEmpty(criteria.getKeySearch())){
    		stringBuilder.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
		
		if (StringUtils.isNotEmpty(criteria.getContractCodeKtts())) {
			stringBuilder.append("AND UPPER(T1.CONTRACT_CODE_KTTS) LIKE UPPER(:contractCodeKtts) ESCAPE '\\' ");
		}
		
		if (null != criteria.getStatusLst() && criteria.getStatusLst().size()>0) {
			stringBuilder.append("AND T1.STATUS in (:statusLst) ");
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
		/*hungtd_20180311_strat*/
		if (null != criteria.getCreatedDateFrom()) {
			stringBuilder.append("AND T1.CREATED_DATE >= :createdDateFrom ");
		}
		if (null != criteria.getCreatedDateTo()) {
			stringBuilder.append("AND T1.CREATED_DATE <= :createdDateTo ");
		}
		/*hungtd_20180311_end*/
	
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
			stringBuilder.append("AND T1.CONTRACT_TYPE in :contractType ");
		}
//		hoanm1_20180312_start
		if (null != criteria.getState()) {
			stringBuilder.append("AND T1.STATE = :state ");
		}
//		hoanm1_20180312_end
		
//		chinhpxn_20180502_start
		if (null != criteria.getSynState()) {
			stringBuilder.append("AND T1.SYN_STATE = :synState ");
		}
//		chinhpxn_20180502_end 
		
		//Huypq-20190917-start
		if(criteria.getListTypeHtct()!=null && criteria.getListTypeHtct().size()>0) {
			stringBuilder.append(" AND T1.TYPE_HTCT in (:listTypeHtct) ");
		}
		//huy-end
		
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
		query.addScalar("createdName", new StringType()); //HuyPQ-add
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("state", new LongType());	
		query.addScalar("description", new StringType());
		query.addScalar("createdGroupName", new StringType());
		query.addScalar("numDay", new DoubleType());
		query.addScalar("moneyType", new IntegerType());
		query.addScalar("frameParentId", new LongType());
		query.addScalar("frameParentCode", new StringType());
		query.addScalar("projectContractCode", new StringType());
		/**hoangnh start 28012019**/
		query.addScalar("contractTypeO", new LongType());
		query.addScalar("contractTypeOsName", new StringType());
		//hienvd: START 7/9/2019
		query.addScalar("typeHTCT", new LongType());
		query.addScalar("priceHTCT", new DoubleType());
		query.addScalar("monthHTCT", new LongType());
		//hienvd: END 7/9/2019
		
		//tatph start 8/10/2019
		query.addScalar("isXNXD", new LongType());
		query.addScalar("constructionForm", new LongType());
		query.addScalar("currentProgess", new StringType());
		query.addScalar("handoverUseDate", new DateType());
		query.addScalar("warrantyExpiredDate", new DateType());
		query.addScalar("structureFilter", new LongType());
		query.addScalar("descriptionXNXD", new StringType());
		query.addScalar("extensionDays", new LongType());
		query.addScalar("paymentExpried", new LongType());
		
		query.addScalar("projectId", new LongType());
		query.addScalar("projectName", new StringType());
		query.addScalar("projectCode", new StringType());
		query.addScalar("warningMess", new StringType());
		
		//tatph end 8/10/2019
		
		//Huypq-20191023-start
		query.addScalar("coefficient", new DoubleType());
		//huy-end
		
		if(criteria.getContractTypeO() != null){
			query.setParameter("contractTypeO", criteria.getContractTypeO());
			queryCount.setParameter("contractTypeO", criteria.getContractTypeO());
    	}
		/**hoangnh start 28012019**/

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
		/*hungtd_20180311_start*/
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
		/*hungtd_20181103_end*/
		
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
		
//		chinhpxn_20180502_start
		if (null != criteria.getSynState()) {
			query.setParameter("synState", criteria.getSynState());
			queryCount.setParameter("synState", criteria.getSynState());
		}
//		chinhpxn_20180502_end 
		
		//Huypq-20190917-start
		if(criteria.getListTypeHtct()!=null && criteria.getListTypeHtct().size()>0) {
			query.setParameterList("listTypeHtct", criteria.getListTypeHtct());
			queryCount.setParameterList("listTypeHtct", criteria.getListTypeHtct());
		}
		//huy-end
		
		query.setResultTransformer(Transformers.aliasToBean(CntContractDTO.class));
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1)
					* criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}  
    @SuppressWarnings("unchecked")
	public List<CntContractDTO> doSearch(CntContractDTO criteria) {
    	StringBuilder stringBuilder = getSelectAllQuery();
    	
    	stringBuilder.append("WHERE 1=1 AND T1.CONTRACT_TYPE = 10 AND T1.CONTRACT_TYPE_O IS NULL ");
    	
    	/**Hoangnh start 28012019**/
//    	if(StringUtils.isNotEmpty(criteria.getCheckOS())){
//    		stringBuilder.append(" AND T1.CONTRACT_TYPE_O IS NOT NULL ");
//    	} else {
//    		stringBuilder.append(" AND T1.CONTRACT_TYPE_O IS NULL ");
//    	}
    	if(criteria.getContractTypeO() != null){
    		stringBuilder.append(" AND T1.CONTRACT_TYPE_O =:contractTypeO ");
    	}
    	/**Hoangnh end 28012019**/
    	
    	if(StringUtils.isNotEmpty(criteria.getKeySearch())){
    		stringBuilder.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
		
		if (StringUtils.isNotEmpty(criteria.getContractCodeKtts())) {
			stringBuilder.append("AND UPPER(T1.CONTRACT_CODE_KTTS) LIKE UPPER(:contractCodeKtts) ESCAPE '\\' ");
		}
		
		if (null != criteria.getStatusLst() && criteria.getStatusLst().size()>0) {
			stringBuilder.append("AND T1.STATUS in (:statusLst) ");
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
		/*hungtd_20180311_strat*/
		if (null != criteria.getCreatedDateFrom()) {
			stringBuilder.append("AND T1.CREATED_DATE >= :createdDateFrom ");
		}
		if (null != criteria.getCreatedDateTo()) {
			stringBuilder.append("AND T1.CREATED_DATE <= :createdDateTo ");
		}
		/*hungtd_20180311_end*/
	
		if (null != criteria.getCatPartnerId()) {
			stringBuilder.append("AND T1.CAT_PARTNER_ID = :catPartnerId ");
		}
	
		if (null != criteria.getSysGroupId()) {
			stringBuilder.append("AND T1.SYS_GROUP_ID = :sysGroupId ");
		}
		
		if (null != criteria.getStatus()) {
			stringBuilder.append("AND T1.STATUS = :status ");
		}
	
//		if (null != criteria.getContractType()) {
//			stringBuilder.append("AND T1.CONTRACT_TYPE in :contractType ");
//		}
//		hoanm1_20180312_start
		if (null != criteria.getState()) {
			stringBuilder.append("AND T1.STATE = :state ");
		}
//		hoanm1_20180312_end
		
//		chinhpxn_20180502_start
		if (null != criteria.getSynState()) {
			stringBuilder.append("AND T1.SYN_STATE = :synState ");
		}
//		chinhpxn_20180502_end 
		
		//Huypq-20190917-start
		if(criteria.getListTypeHtct()!=null && criteria.getListTypeHtct().size()>0) {
			stringBuilder.append(" AND T1.TYPE_HTCT in (:listTypeHtct) ");
		}
		//huy-end
		
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
		query.addScalar("createdName", new StringType()); //HuyPQ-add
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("state", new LongType());	
		query.addScalar("description", new StringType());
		query.addScalar("createdGroupName", new StringType());
		query.addScalar("numDay", new DoubleType());
		query.addScalar("moneyType", new IntegerType());
		query.addScalar("frameParentId", new LongType());
		query.addScalar("frameParentCode", new StringType());
		query.addScalar("projectContractCode", new StringType());
		/**hoangnh start 28012019**/
		query.addScalar("contractTypeO", new LongType());
		query.addScalar("contractTypeOsName", new StringType());
		//hienvd: START 7/9/2019
		query.addScalar("typeHTCT", new LongType());
		query.addScalar("priceHTCT", new DoubleType());
		query.addScalar("monthHTCT", new LongType());
		//hienvd: END 7/9/2019
		
		//tatph start 8/10/2019
		query.addScalar("isXNXD", new LongType());
		query.addScalar("constructionForm", new LongType());
		query.addScalar("currentProgess", new StringType());
		query.addScalar("handoverUseDate", new DateType());
		query.addScalar("warrantyExpiredDate", new DateType());
		query.addScalar("structureFilter", new LongType());
		query.addScalar("descriptionXNXD", new StringType());
		query.addScalar("extensionDays", new LongType());
		query.addScalar("paymentExpried", new LongType());
		
		query.addScalar("projectId", new LongType());
		query.addScalar("projectName", new StringType());
		query.addScalar("projectCode", new StringType());
		
		//tatph end 8/10/2019
		
		//Huypq-20191023-start
		query.addScalar("coefficient", new DoubleType());
		//huy-end
		
		if(criteria.getContractTypeO() != null){
			query.setParameter("contractTypeO", criteria.getContractTypeO());
			queryCount.setParameter("contractTypeO", criteria.getContractTypeO());
    	}
		/**hoangnh start 28012019**/

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
		/*hungtd_20180311_start*/
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
		/*hungtd_20181103_end*/
		
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
//		if (null != criteria.getContractType()) {
//			query.setParameter("contractType", criteria.getContractType());
//			queryCount.setParameter("contractType", criteria.getContractType());
//		}
//		hoanm1_20180312_start
		if (null != criteria.getState()) {
			query.setParameter("state", criteria.getState());
			queryCount.setParameter("state", criteria.getState());
		}
//		hoanm1_20180312_end
		
//		chinhpxn_20180502_start
		if (null != criteria.getSynState()) {
			query.setParameter("synState", criteria.getSynState());
			queryCount.setParameter("synState", criteria.getSynState());
		}
//		chinhpxn_20180502_end 
		
		//Huypq-20190917-start
		if(criteria.getListTypeHtct()!=null && criteria.getListTypeHtct().size()>0) {
			query.setParameterList("listTypeHtct", criteria.getListTypeHtct());
			queryCount.setParameterList("listTypeHtct", criteria.getListTypeHtct());
		}
		//huy-end
		
		query.setResultTransformer(Transformers.aliasToBean(CntContractDTO.class));
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1)
					* criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}  
//    chinhpxn20180712_start
    @SuppressWarnings("unchecked")
	public List<CntContractReportDTO> doSearchForReport(CntContractReportDTO criteria) {
    	StringBuilder stringBuilder = new StringBuilder();
    	
    	stringBuilder.append(" WITH TBL AS ");
    	stringBuilder.append(" (SELECT cntContract.CODE code, cntContract.PRICE price, cntContract.SIGN_DATE signDate, cntContract.NUM_DAY numDay, cntContract.START_TIME startTime, cntContract.END_TIME endTime,  ");
    	stringBuilder.append(" cntContract.STATUS status, cntContract.STATE state, cntContract.NUM_STATION numStation, ");
    	stringBuilder.append(" (CASE  ");
    	stringBuilder.append("   WHEN (SELECT con.CONSTRUCTION_ID  ");
    	stringBuilder.append("   FROM CONSTRUCTION con   ");
    	stringBuilder.append("   inner JOIN CNT_CONSTR_WORK_ITEM_TASK constr ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID and constr.status=1 ");
    	stringBuilder.append("   WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID ");
    	stringBuilder.append("     AND ((con.status = 1 or con.status = 2 or con.status = 3 or con.status = 4) or ");
    	stringBuilder.append("     (con.STATUS = 5 AND con.COMPLETE_VALUE IS NULL)) ");
    	stringBuilder.append("    AND ROWNUM = 1) IS NOT NULL THEN '0' ");
    	stringBuilder.append("   ELSE '1' ");
    	stringBuilder.append(" END) statusTC, ");
    	stringBuilder.append(" (CASE  ");
    	stringBuilder.append("   WHEN (SELECT con.CONSTRUCTION_ID  ");
    	stringBuilder.append("   FROM CONSTRUCTION con   ");
    	stringBuilder.append("   inner JOIN CNT_CONSTR_WORK_ITEM_TASK constr ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID and constr.status=1 ");
    	stringBuilder.append("   WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID ");
    	stringBuilder.append("   AND con.STATUS in(5,6,7,8) ");
    	stringBuilder.append("   AND con.APPROVE_COMPLETE_VALUE IS NULL AND ROWNUM = 1) IS NOT NULL THEN '0' ");
    	stringBuilder.append("   ELSE '1' ");
    	stringBuilder.append(" END) statusHSHC, ");
    	stringBuilder.append(" (CASE  ");
    	stringBuilder.append("   WHEN (SELECT con.CONSTRUCTION_ID  ");
    	stringBuilder.append("   FROM CONSTRUCTION con   ");
    	stringBuilder.append("   inner JOIN CNT_CONSTR_WORK_ITEM_TASK constr ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID and constr.status=1");
    	stringBuilder.append("   WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID ");
    	stringBuilder.append("   AND con.STATUS in(5,6,7,8) ");
    	stringBuilder.append("   AND con.APPROVE_REVENUE_VALUE IS NULL AND ROWNUM = 1) IS NOT NULL THEN '0' ");
    	stringBuilder.append("   ELSE '1' ");
    	stringBuilder.append(" END) statusDT, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT COUNT(DISTINCT constr.CONSTRUCTION_ID) ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" inner JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID and constr.status=1 ");
    	stringBuilder.append(" AND con.STATUS in (1,2) ");
    	stringBuilder.append(" ),0) quantityChuaTC, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT SUM(constr.PRICE) ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" inner JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID and constr.status=1 ");
    	stringBuilder.append(" AND con.STATUS in (1,2) ");
    	stringBuilder.append(" ),0) priceChuaTC, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT COUNT(DISTINCT constr.CONSTRUCTION_ID) ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" inner JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID and constr.status=1 ");
    	stringBuilder.append(" AND con.STATUS in (3,4) ");
    	stringBuilder.append(" ),0) quantityTCdodang, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT SUM(constr.PRICE) ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" inner JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID and constr.status=1 ");
    	stringBuilder.append(" AND con.STATUS in (3,4) ");
    	stringBuilder.append(" ),0) priceTCdodang, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT COUNT(DISTINCT constr.CONSTRUCTION_ID) ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" inner JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID and constr.status=1 ");
    	stringBuilder.append(" AND con.STATUS in(5,6,7,8) ");
    	stringBuilder.append(" ),0) quantityTCxong, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT SUM(constr.PRICE) ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" inner JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID and constr.status=1 ");
    	stringBuilder.append(" AND con.STATUS in(5,6,7,8) ");
    	stringBuilder.append(" ),0) priceTCxong, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT COUNT(DISTINCT constr.CONSTRUCTION_ID) ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" inner JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID and constr.status=1 ");
    	stringBuilder.append(" AND con.STATUS = 0 ");
    	stringBuilder.append(" ),0) quantityHuy, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT SUM(constr.PRICE) ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" inner JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID and constr.status=1 ");
    	stringBuilder.append(" AND con.STATUS = 0 ");
    	stringBuilder.append(" ),0) priceHuy, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" (NVL((SELECT SUM(constr.PRICE) ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" inner JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID and constr.status=1 ");
    	stringBuilder.append(" AND con.STATUS in (3,4)),0) ");
    	stringBuilder.append(" + ");
    	stringBuilder.append(" NVL((SELECT SUM(constr.PRICE) ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" inner JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID and constr.status=1 ");
    	stringBuilder.append(" AND con.STATUS in(5,6,7,8) ");
    	stringBuilder.append(" ),0)) totalPriceSL, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT COUNT(DISTINCT constr.CONSTRUCTION_ID) ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" inner JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID and constr.status=1 ");
    	stringBuilder.append(" AND con.STATUS !=0 ");
    	stringBuilder.append(" AND con.COMPLETE_VALUE IS NOT NULL ");
    	stringBuilder.append(" AND con.APPROVE_COMPLETE_VALUE IS NOT NULL ");
    	stringBuilder.append(" ),0) quantityCoHSHC, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT SUM(con.APPROVE_COMPLETE_VALUE) ");
    	stringBuilder.append(" FROM CONSTRUCTION con ");
    	stringBuilder.append(" WHERE con.CONSTRUCTION_ID IN  ");
    	stringBuilder.append(" (SELECT DISTINCT constr.CONSTRUCTION_ID FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID AND constr.status =1) ");
    	stringBuilder.append(" AND con.STATUS !=0 ");
    	stringBuilder.append(" AND con.COMPLETE_VALUE IS NOT NULL ");
    	stringBuilder.append(" AND con.APPROVE_COMPLETE_VALUE IS NOT NULL ");
    	stringBuilder.append(" ),0) priceCoHSHC, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT COUNT(DISTINCT constr.CONSTRUCTION_ID) ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" inner JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID and constr.status=1 ");
    	stringBuilder.append(" AND con.STATUS !=0 ");
    	stringBuilder.append(" AND con.COMPLETE_VALUE IS NOT NULL ");
    	stringBuilder.append(" AND con.APPROVE_COMPLETE_VALUE IS  NULL ");
    	stringBuilder.append(" ),0) quantityChuaCoHSHC, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT SUM(con.COMPLETE_VALUE) ");
    	stringBuilder.append(" FROM CONSTRUCTION con ");
    	stringBuilder.append(" WHERE con.CONSTRUCTION_ID IN  ");
    	stringBuilder.append(" (SELECT DISTINCT constr.CONSTRUCTION_ID FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID  AND constr.status =1) ");
    	stringBuilder.append(" AND con.STATUS !=0 ");
    	stringBuilder.append(" AND con.COMPLETE_VALUE IS NOT NULL ");
    	stringBuilder.append(" AND con.APPROVE_COMPLETE_VALUE IS NULL ");
    	stringBuilder.append(" ),0) priceChuaCoHSHC, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT COUNT(DISTINCT constr.CONSTRUCTION_ID) ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" inner JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID and constr.status=1 ");
    	stringBuilder.append(" AND con.STATUS !=0 ");
    	stringBuilder.append(" AND con.APPROVE_COMPLETE_VALUE IS NOT NULL ");
    	stringBuilder.append(" AND con.approve_settlement_value IS NOT NULL ");
    	stringBuilder.append(" ),0) quantityDaQT, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT SUM(con.approve_settlement_value) ");
    	stringBuilder.append(" FROM CONSTRUCTION con ");
    	stringBuilder.append(" WHERE con.CONSTRUCTION_ID IN  ");
    	stringBuilder.append(" (SELECT DISTINCT constr.CONSTRUCTION_ID FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID  AND constr.status =1) ");
    	stringBuilder.append(" AND con.STATUS !=0 ");
    	stringBuilder.append(" AND con.APPROVE_COMPLETE_VALUE IS NOT NULL ");
    	stringBuilder.append(" AND con.approve_settlement_value IS NOT NULL ");
    	stringBuilder.append(" ),0) priceDaQT, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT COUNT(DISTINCT constr.CONSTRUCTION_ID) ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" inner JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID and constr.status=1 ");
    	stringBuilder.append(" AND con.STATUS !=0 ");
    	stringBuilder.append(" AND con.APPROVE_COMPLETE_VALUE IS NOT NULL ");
    	stringBuilder.append(" AND con.approve_settlement_value IS NULL ");
    	stringBuilder.append(" ),0) quantityChuaQT, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT SUM(con.APPROVE_COMPLETE_VALUE) ");
    	stringBuilder.append(" FROM CONSTRUCTION con ");
    	stringBuilder.append(" WHERE con.CONSTRUCTION_ID IN  ");
    	stringBuilder.append(" (SELECT DISTINCT constr.CONSTRUCTION_ID FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID  AND constr.status =1) ");
    	stringBuilder.append(" AND con.STATUS !=0 ");
    	stringBuilder.append(" AND con.APPROVE_COMPLETE_VALUE IS NOT NULL ");
    	stringBuilder.append(" AND con.approve_settlement_value IS NULL ");
    	stringBuilder.append(" ),0) priceChuaQT, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT COUNT(DISTINCT constr.CONSTRUCTION_ID) ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" inner JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID and constr.status=1 ");
    	stringBuilder.append(" AND con.STATUS !=0 ");
    	stringBuilder.append(" AND con.approve_settlement_value IS NOT NULL ");
    	stringBuilder.append(" AND con.APPROVE_REVENUE_VALUE IS NOT NULL ");
    	stringBuilder.append(" ),0) quantityLDT, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT SUM(con.APPROVE_REVENUE_VALUE) ");
    	stringBuilder.append(" FROM CONSTRUCTION con ");
    	stringBuilder.append(" WHERE con.CONSTRUCTION_ID IN  ");
    	stringBuilder.append(" (SELECT DISTINCT constr.CONSTRUCTION_ID FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID  AND constr.status =1) ");
    	stringBuilder.append(" AND con.STATUS !=0 ");
    	stringBuilder.append(" AND con.approve_settlement_value IS NOT NULL ");
    	stringBuilder.append(" AND con.APPROVE_REVENUE_VALUE IS NOT NULL ");
    	stringBuilder.append(" ),0) priceLDT, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT COUNT(DISTINCT constr.CONSTRUCTION_ID) ");
    	stringBuilder.append(" FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" inner JOIN CONSTRUCTION con ON con.CONSTRUCTION_ID = constr.CONSTRUCTION_ID ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID and constr.status=1 ");
    	stringBuilder.append(" AND con.STATUS !=0 ");
    	stringBuilder.append(" AND con.approve_settlement_value IS NOT NULL ");
    	stringBuilder.append(" AND con.APPROVE_REVENUE_VALUE IS NULL ");
    	stringBuilder.append(" ),0) quantityChuaLDT, ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" NVL((SELECT SUM(con.approve_settlement_value) ");
    	stringBuilder.append(" FROM CONSTRUCTION con ");
    	stringBuilder.append(" WHERE con.CONSTRUCTION_ID IN  ");
    	stringBuilder.append(" (SELECT DISTINCT constr.CONSTRUCTION_ID FROM CNT_CONSTR_WORK_ITEM_TASK constr ");
    	stringBuilder.append(" WHERE constr.CNT_CONTRACT_ID = cntContract.CNT_CONTRACT_ID  AND constr.status =1) ");
    	stringBuilder.append(" AND con.STATUS !=0 ");
    	stringBuilder.append(" AND con.approve_settlement_value IS NOT NULL ");
    	stringBuilder.append(" AND con.APPROVE_REVENUE_VALUE IS NULL ");
    	stringBuilder.append(" ),0) priceChuaLDT ");
    	stringBuilder.append("  ");
    	stringBuilder.append(" FROM CNT_CONTRACT cntContract ");
    	stringBuilder.append(" WHERE cntContract.CONTRACT_TYPE = 0 and cntContract.status !=0 ");
    	if(StringUtils.isNotEmpty(criteria.getKeySearch())){
    		stringBuilder.append(" AND (UPPER(cntContract.CODE) like UPPER(:key) escape '&') ");
		}
    	if (null != criteria.getSignDateFrom()) {
			stringBuilder.append("AND cntContract.SIGN_DATE >= :signDateFrom ");
		}
		if (null != criteria.getSignDateTo()) {
			stringBuilder.append("AND cntContract.SIGN_DATE <= :signDateTo ");
		}
		if (null != criteria.getStatusLst() && criteria.getStatusLst().size()>0) {
			stringBuilder.append("AND cntContract.STATUS in (:statusLst) ");
		}
    	stringBuilder.append(" ) SELECT code, price, signDate, numDay, startTime, endTime,  ");
    	stringBuilder.append(" status, state, numStation,statusTC, statusHSHC, statusDT, quantityChuaTC, priceChuaTC, quantityTCdodang, priceTCdodang, quantityTCxong,  ");
    	stringBuilder.append(" priceTCxong, quantityHuy, priceHuy, totalPriceSL, quantityCoHSHC, priceCoHSHC, quantityChuaCoHSHC,  ");
    	stringBuilder.append(" priceChuaCoHSHC, quantityDaQT, priceDaQT, quantityChuaQT, priceChuaQT, quantityLDT, priceLDT, quantityChuaLDT, priceChuaLDT, ");
    	stringBuilder.append(" (priceTCdodang + priceChuaCoHSHC + priceChuaQT + priceChuaLDT) slDoDang,  ");
    	stringBuilder.append(" (CASE ");
    	stringBuilder.append("   WHEN priceLDT IS NOT NULL THEN priceLDT ");
    	stringBuilder.append("   ELSE CASE  ");
    	stringBuilder.append("     WHEN priceDaQT IS NOT NULL THEN priceDaQT ");
    	stringBuilder.append("     ELSE CASE  ");
    	stringBuilder.append("           WHEN priceCoHSHC IS NOT NULL THEN priceCoHSHC ");
    	stringBuilder.append("           ELSE totalPriceSL ");
    	stringBuilder.append("           END ");
    	stringBuilder.append("         END ");
    	stringBuilder.append("   END ");
    	stringBuilder.append("       ) priceSLdieuchinh ");
    	stringBuilder.append(" FROM TBL ");
	
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());
		
		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			query.setParameter("key", "%" + criteria.getKeySearch() + "%");
			queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
		}
		if (null != criteria.getSignDateTo()) {
			query.setTimestamp("signDateTo", criteria.getSignDateTo());
			queryCount.setTimestamp("signDateTo", criteria.getSignDateTo());
		}
		if (null != criteria.getSignDateFrom()) {
			query.setTimestamp("signDateFrom", criteria.getSignDateFrom());
			queryCount.setTimestamp("signDateFrom", criteria.getSignDateFrom());
		}
		if (null != criteria.getStatusLst() && !criteria.getStatusLst().isEmpty()) {
			query.setParameterList("statusLst", criteria.getStatusLst());
			queryCount.setParameterList("statusLst", criteria.getStatusLst());
		}
		
		query.addScalar("code", new StringType());
		query.addScalar("price", new DoubleType());
		query.addScalar("signDate", new DateType());
		query.addScalar("numDay", new DoubleType());
		query.addScalar("startTime", new DateType());
		query.addScalar("endTime", new DateType());
		query.addScalar("status", new LongType());
		query.addScalar("state", new LongType());
		query.addScalar("numStation", new DoubleType());
		query.addScalar("statusTC", new LongType());
		query.addScalar("statusHSHC", new LongType());
		query.addScalar("statusDT", new LongType());
		query.addScalar("quantityChuaTC", new DoubleType());
		query.addScalar("priceChuaTC", new DoubleType());
		query.addScalar("quantityTCdodang", new DoubleType());
		query.addScalar("priceTCdodang", new DoubleType());
		query.addScalar("quantityTCxong", new DoubleType());
		query.addScalar("priceTCxong", new DoubleType());
		query.addScalar("quantityHuy", new DoubleType());
		query.addScalar("priceHuy", new DoubleType());
		query.addScalar("totalPriceSL", new DoubleType());
		query.addScalar("quantityCoHSHC", new DoubleType());
		query.addScalar("priceCoHSHC", new DoubleType());
		query.addScalar("quantityChuaCoHSHC", new DoubleType());
		query.addScalar("priceChuaCoHSHC", new DoubleType());
		query.addScalar("quantityDaQT", new DoubleType());
		query.addScalar("priceDaQT", new DoubleType());
		query.addScalar("quantityChuaQT", new DoubleType());
		query.addScalar("priceChuaQT", new DoubleType());
		query.addScalar("quantityLDT", new DoubleType());
		query.addScalar("priceLDT", new DoubleType());
		query.addScalar("quantityChuaLDT", new DoubleType());
		query.addScalar("priceChuaLDT", new DoubleType());
		query.addScalar("priceSLdieuchinh", new DoubleType());
		query.addScalar("slDoDang", new DoubleType());
		
		
		query.setResultTransformer(Transformers.aliasToBean(CntContractReportDTO.class));
//		if(criteria.getIsExport() == null) {
			if (criteria.getPage() != null && criteria.getPageSize() != null) {
				query.setFirstResult((criteria.getPage().intValue() - 1)
						* criteria.getPageSize().intValue());
				query.setMaxResults(criteria.getPageSize().intValue());
			}
//		}
		
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}  
    
//    chinhpxn20180712_end
	
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
    	stringBuilder.append("WHERE upper(T1.CODE) = upper(:code) AND T1.STATUS != 0");	
    	stringBuilder.append(" AND T1.CONTRACT_TYPE = :contractType");
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
    	stringBuilder.append("WHERE T1.CNT_CONTRACT_ID = :cntContractId ");
    	
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
    	
		query.addScalar("cntContractId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
//		query.addScalar("contractCodeKtts", new StringType());
//		query.addScalar("content", new StringType());
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
//		query.addScalar("supervisor", new StringType());
		query.addScalar("status", new LongType());
//		query.addScalar("formal", new DoubleType());
		query.addScalar("contractType", new LongType());
		query.addScalar("cntContractParentId", new DoubleType());
		query.addScalar("cntContractParentCode", new StringType());
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
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.FORMAL formal ");
		stringBuilder.append(",T1.CONTRACT_TYPE contractType ");
		stringBuilder.append(",T1.CNT_CONTRACT_PARENT_ID cntContractParentId ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T1.NUM_DAY numDay ");
		stringBuilder.append(",T1.FRAME_PARENT_ID frameParentId ");
		stringBuilder.append(",T1.MONEY_TYPE moneyType ");
		/**hoangnh start 28012019**/
		stringBuilder.append(",T1.CONTRACT_TYPE_O contractTypeO ");
		stringBuilder.append(",T1.CONTRACT_TYPE_OS_NAME contractTypeOsName ");
		/**hoangnh end 28012019**/

		//tatph 8/10/2019
				stringBuilder.append(",T1.IS_XNXD isXNXD ");
				stringBuilder.append(",T1.CONSTRUCTION_FORM constructionForm ");
				stringBuilder.append(",T1.CURRENT_PROGRESS currentProgess ");
				stringBuilder.append(",T1.HANDOVER_USE_DATE handoverUseDate ");
				stringBuilder.append(",T1.WARRANTY_EXPIRED_DATE warrantyExpiredDate ");
				stringBuilder.append(",T1.STRUCTURE_FILTER structureFilter ");
				stringBuilder.append(",T1.DESCRIPTION_XNXD descriptionXNXD ");
				stringBuilder.append(",T1.PROJECT_ID projectId ");
				stringBuilder.append(",T1.PROJECT_CODE projectCode ");
				stringBuilder.append(",T1.PROJECT_NAME projectName ");
				stringBuilder.append(",T1.EXTENSION_DAYS extensionDays ");
				stringBuilder.append(",T1.PAYMENT_EXPRIED paymentExpried ");
				
				//end tatph
		
		//hienvd: START 7/9/2019
		stringBuilder.append(",T1.TYPE_HTCT typeHTCT ");
		stringBuilder.append(",T1.PRICE_HTCT priceHTCT ");
		stringBuilder.append(",T1.MONTH_HTCT monthHTCT ");
		//hienvd: END 7/9/2019

		stringBuilder.append(",T9.CODE projectContractCode ");
		stringBuilder.append(",(SELECT T8.CODE FROM CNT_CONTRACT T8 WHERE T8.CNT_CONTRACT_ID = T1.FRAME_PARENT_ID) frameParentCode ");
		stringBuilder.append(",T2.NAME catPartnerName ");
		stringBuilder.append(",T3.NAME sysGroupName ");
		stringBuilder.append(",T4.NAME biddingPackageName ");
		stringBuilder.append(",T5.FULL_NAME signerGroupName ");
		stringBuilder.append(",(SELECT T6.CODE FROM CNT_CONTRACT T6 WHERE T6.CNT_CONTRACT_ID = T1.CNT_CONTRACT_PARENT_ID) cntContractParentCode ");
		stringBuilder.append(",T1.STATE state ");
		stringBuilder.append(",T7.NAME createdGroupName ");
		// HuyPQ-createdName-start
		stringBuilder.append(",(CASE WHEN T6.EMAIL IS NULL THEN T6.FULL_NAME ELSE T6.FULL_NAME||'('||T6.EMAIL||')' END) createdName ");
		// HuyPQ-createdName-end
		
		
		//Huypq-20191023-start
		stringBuilder.append(",T1.COEFFICIENT coefficient ");
		//Huy-end
    	stringBuilder.append("FROM CNT_CONTRACT T1 ");    
    	stringBuilder.append("LEFT JOIN CTCT_CAT_OWNER.CAT_PARTNER T2 ON T1.CAT_PARTNER_ID = T2.CAT_PARTNER_ID ");
    	stringBuilder.append("LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP T3 ON T1.SYS_GROUP_ID = T3.SYS_GROUP_ID ");
    	stringBuilder.append("LEFT JOIN BIDDING_PACKAGE T4 ON T1.BIDDING_PACKAGE_ID = T4.BIDDING_PACKAGE_ID ");
    	stringBuilder.append("LEFT JOIN CTCT_VPS_OWNER.SYS_USER T5 ON T1.SIGNER_GROUP = T5.SYS_USER_ID ");
    	stringBuilder.append("LEFT JOIN CTCT_VPS_OWNER.SYS_USER T6 ON T1.CREATED_USER_ID = T6.SYS_USER_ID ");
    	stringBuilder.append("LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP T7 ON T1.CREATED_GROUP_ID = T7.SYS_GROUP_ID ");
    	stringBuilder.append("LEFT JOIN PROJECT_CONTRACT T9 ON T1.PROJECT_CONTRACT_ID = T9.PROJECT_CONTRACT_ID ");
    	return stringBuilder;
	}
	public StringBuilder getSelectAllQueryXNXD(){
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
		stringBuilder.append(",T1.DESCRIPTION description ");
		stringBuilder.append(",T1.FORMAL formal ");
		stringBuilder.append(",T1.CONTRACT_TYPE contractType ");
		stringBuilder.append(",T1.CNT_CONTRACT_PARENT_ID cntContractParentId ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T1.NUM_DAY numDay ");
		stringBuilder.append(",T1.FRAME_PARENT_ID frameParentId ");
		stringBuilder.append(",T1.MONEY_TYPE moneyType ");
		/**hoangnh start 28012019**/
		stringBuilder.append(",T1.CONTRACT_TYPE_O contractTypeO ");
		stringBuilder.append(",T1.CONTRACT_TYPE_OS_NAME contractTypeOsName ");
		/**hoangnh end 28012019**/

		//tatph 8/10/2019
				stringBuilder.append(",T1.IS_XNXD isXNXD ");
				stringBuilder.append(",T1.CONSTRUCTION_FORM constructionForm ");
				stringBuilder.append(",T1.CURRENT_PROGRESS currentProgess ");
				stringBuilder.append(",T1.HANDOVER_USE_DATE handoverUseDate ");
				stringBuilder.append(",T1.WARRANTY_EXPIRED_DATE warrantyExpiredDate ");
				stringBuilder.append(",T1.STRUCTURE_FILTER structureFilter ");
				stringBuilder.append(",T1.DESCRIPTION_XNXD descriptionXNXD ");
				stringBuilder.append(",T1.PROJECT_ID projectId ");
				stringBuilder.append(",T1.PROJECT_CODE projectCode ");
				stringBuilder.append(",T1.PROJECT_NAME projectName ");
				stringBuilder.append(",T1.EXTENSION_DAYS extensionDays ");
				stringBuilder.append(",T1.PAYMENT_EXPRIED paymentExpried ");
				stringBuilder.append(",case when PAYMENT_EXPRIED = 1 then null when WARRANTY_EXPIRED_DATE - (sysdate) <30 and PAYMENT_EXPRIED = 0 then 'Cảnh báo hết hạn bảo hành' else null end  warningMess");
				
				//end tatph
		
		//hienvd: START 7/9/2019
		stringBuilder.append(",T1.TYPE_HTCT typeHTCT ");
		stringBuilder.append(",T1.PRICE_HTCT priceHTCT ");
		stringBuilder.append(",T1.MONTH_HTCT monthHTCT ");
		//hienvd: END 7/9/2019

		stringBuilder.append(",T9.CODE projectContractCode ");
		stringBuilder.append(",(SELECT T8.CODE FROM CNT_CONTRACT T8 WHERE T8.CNT_CONTRACT_ID = T1.FRAME_PARENT_ID) frameParentCode ");
		stringBuilder.append(",T2.NAME catPartnerName ");
		stringBuilder.append(",T3.NAME sysGroupName ");
		stringBuilder.append(",T4.NAME biddingPackageName ");
		stringBuilder.append(",T5.FULL_NAME signerGroupName ");
		stringBuilder.append(",(SELECT T6.CODE FROM CNT_CONTRACT T6 WHERE T6.CNT_CONTRACT_ID = T1.CNT_CONTRACT_PARENT_ID) cntContractParentCode ");
		stringBuilder.append(",T1.STATE state ");
		stringBuilder.append(",T7.NAME createdGroupName ");
		// HuyPQ-createdName-start
		stringBuilder.append(",(CASE WHEN T6.EMAIL IS NULL THEN T6.FULL_NAME ELSE T6.FULL_NAME||'('||T6.EMAIL||')' END) createdName ");
		// HuyPQ-createdName-end
		
		
		//Huypq-20191023-start
		stringBuilder.append(",T1.COEFFICIENT coefficient ");
		//Huy-end
    	stringBuilder.append("FROM CNT_CONTRACT T1 ");    
    	stringBuilder.append("LEFT JOIN CTCT_CAT_OWNER.CAT_PARTNER T2 ON T1.CAT_PARTNER_ID = T2.CAT_PARTNER_ID ");
    	stringBuilder.append("LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP T3 ON T1.SYS_GROUP_ID = T3.SYS_GROUP_ID ");
    	stringBuilder.append("LEFT JOIN BIDDING_PACKAGE T4 ON T1.BIDDING_PACKAGE_ID = T4.BIDDING_PACKAGE_ID ");
    	stringBuilder.append("LEFT JOIN CTCT_VPS_OWNER.SYS_USER T5 ON T1.SIGNER_GROUP = T5.SYS_USER_ID ");
    	stringBuilder.append("LEFT JOIN CTCT_VPS_OWNER.SYS_USER T6 ON T1.CREATED_USER_ID = T6.SYS_USER_ID ");
    	stringBuilder.append("LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP T7 ON T1.CREATED_GROUP_ID = T7.SYS_GROUP_ID ");
    	stringBuilder.append("LEFT JOIN PROJECT_CONTRACT T9 ON T1.PROJECT_CONTRACT_ID = T9.PROJECT_CONTRACT_ID ");
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
		stringBuilder.append(",T1.CNT_CONTRACT_PARENT_ID cntContractParentId ");
		stringBuilder.append(",T1.CREATED_DATE createdDate ");
		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
		stringBuilder.append(",T2.NAME catPartnerName ");
		stringBuilder.append(",T3.NAME sysGroupName "); //HuyPQ-edit
		stringBuilder.append("FROM CNT_CONTRACT T1 ");
		stringBuilder.append(" LEFT JOIN CTCT_CAT_OWNER.CAT_PARTNER T2 ON T1.CAT_PARTNER_ID = T2.CAT_PARTNER_ID ");
		stringBuilder.append(" LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP T3 ON T1.SYS_GROUP_ID = T3.SYS_GROUP_ID "); //HuyPQ-edit
		return stringBuilder;
	}

	public StringBuilder getSelectQueryContractKTTS() {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.cnt_contract_id cntContractId ");
		stringBuilder.append(",T1.CONTRACT_CODE_KTTS contractCodeKtts");
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
		stringBuilder.append(",T2.NAME createdGroupName ");
		stringBuilder.append("FROM CNT_CONTRACT T1 ");
		stringBuilder.append("LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP T2 ON T1.CREATED_GROUP_ID = T2.SYS_GROUP_ID ");
		stringBuilder.append(" WHERE T1.SYN_STATE = 2 ");
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
		List ls = query.list();
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1)
					* criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult())
				.intValue());
		return ls;
		// return query.list();

	}

	@SuppressWarnings("unchecked")
	public List<CntContractDTO> getListContractKTTS(CntContractDTO criteria) {
		StringBuilder stringBuilder = getSelectQueryContractKTTS();
		
		/**Hoangnh start 30012019**/
		stringBuilder.append(" AND T1.STATUS != 0  ");
		/**Hoangnh end 30012019**/
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
		query.addScalar("contractCodeKtts", new StringType());
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
		query.addScalar("createdGroupName", new StringType());

		query.setResultTransformer(Transformers
				.aliasToBean(CntContractDTO.class));

		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			query.setParameter("key", "%" + criteria.getKeySearch() + "%");
			queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
		}
		query.setResultTransformer(Transformers
				.aliasToBean(CntContractDTO.class));
		List ls = query.list();
//		if (criteria.getPage() != null && criteria.getPageSize() != null) {
//			query.setFirstResult((criteria.getPage().intValue() - 1)
//					* criteria.getPageSize().intValue());
//			query.setMaxResults(criteria.getPageSize().intValue());
//		}
//		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult())
//				.intValue());
		return ls;
	}

	public List<CntContractDTO> getForAutoCompleteMap(CntContractDTO obj) {
		StringBuilder stringBuilder = getSelectQueryContract();

		stringBuilder.append(" Where T1.STATUS != 0 and contract_type=0");
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
		query.addScalar("sysGroupName", new StringType()); //Huypq-edit
		query.addScalar("catPartnerName", new StringType()); //Huypq-edit

		
		query.setResultTransformer(Transformers
				.aliasToBean(CntContractDTO.class));

		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			query.setParameter("key", "%" + obj.getKeySearch() + "%");
		}

		return query.list();
	}

	public List<CntContractDTO> getForAutoCompleteKTTS(CntContractDTO obj) {
		StringBuilder stringBuilder = getSelectQueryContractKTTS();
		/**hoangnh start 07012019**/
		stringBuilder.append(" AND T1.STATUS != 0 ");
		/**hoangnh end 07012019**/
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
		// query.addScalar("contractType", new LongType());
		query.addScalar("cntContractParentId", new DoubleType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("createdGroupName", new StringType());

		query.setResultTransformer(Transformers
				.aliasToBean(CntContractDTO.class));

		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			query.setParameter("key", "%" + obj.getKeySearch() + "%");
		}

		return query.list();
	}

	public CntContractDTO findByCodeKTTS(String value) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.cnt_contract_id cntContractId ");
		stringBuilder.append(",T1.CONTRACT_CODE_KTTS contractCodeKtts");
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

		stringBuilder.append("FROM CNT_CONTRACT T1 ");
		stringBuilder.append("WHERE syn_state = 2 and status = 1 and upper(T1.CODE) = upper(:code)");

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
	
	public ContractInformationDTO getCntInformation(Long contractId){
		StringBuilder stringBuilder = new StringBuilder("select count(*) constructionTotalNum,"
				+ "count(case when STATUS=6 then 1 else null end) liquidateConstrNum, "
				+ "count(case when STATUS=3 then 1 else null end) onGoingConstrNum, "
				+ "count(case when STATUS in(1,2) then 1 else null end) notConstructedNum, "
				+ "count(case when STATUS =8 then 1 else null end) paidConstrNum, "
				+ "count(case when construction_state =1 then 1 else null end) onScheduleConstrNum, "
				+ "count(case when construction_state =2 then 1 else null end) lateConstrNum, "
				+ "count(case when IS_OBSTRUCTED =1 then 1 else null end) pausedConstrNum "
				+ "from  "
				+ "(select distinct cnt_contract_id,construction_id from CNT_CONSTR_WORK_ITEM_TASK a where a.cnt_contract_id = :cntContractId and a.status =1) a, "
				+ "construction b where a.construction_id = b.construction_id and b.status !=0 ");
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		query.addScalar("constructionTotalNum", new LongType());
		query.addScalar("liquidateConstrNum", new LongType());
		query.addScalar("onGoingConstrNum", new LongType());
		query.addScalar("notConstructedNum", new LongType());
		query.addScalar("paidConstrNum", new LongType());
		query.addScalar("onScheduleConstrNum", new LongType());
		query.addScalar("lateConstrNum", new LongType());
		query.addScalar("pausedConstrNum", new LongType());
		
		query.setParameter("cntContractId", contractId);
		query.setResultTransformer(Transformers
				.aliasToBean(ContractInformationDTO.class));
		ContractInformationDTO cntInF = (ContractInformationDTO) query.uniqueResult();
		return cntInF;
	}
	
	//HuyPQ-20181114-start
	@SuppressWarnings("unchecked")
	public List<CntContractDTO> getForAutoCompleteContract(CntContractDTO obj){
		StringBuilder sql = new StringBuilder(" SELECT "
				+ " T1.CNT_CONTRACT_ID cntContractId, "
				+ " T1.CODE code,"
				+ " T1.NAME name,"
				+ " T3.name sysGroupName,"
				+ " T2.name catPartnerName "
				+ " FROM CNT_CONTRACT T1 "
				+ " LEFT JOIN CTCT_CAT_OWNER.CAT_PARTNER T2 ON T1.CAT_PARTNER_ID = T2.CAT_PARTNER_ID "
				+ " LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP T3 ON T1.SYS_GROUP_ID = T3.SYS_GROUP_ID "
				+ " WHERE T1.STATUS != 0 and contract_type=:contractType ");
		
		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			sql.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}

		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");

		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		
		query.addScalar("cntContractId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("sysGroupName", new StringType());
		query.addScalar("catPartnerName", new StringType());
		query.setResultTransformer(Transformers
				.aliasToBean(CntContractDTO.class));
		
		query.setParameter("contractType", obj.getContractType());
		queryCount.setParameter("contractType", obj.getContractType());
		
		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			query.setParameter("key", "%" + obj.getKeySearch() + "%");
			queryCount.setParameter("key", "%" + obj.getKeySearch() + "%");
		}
		
		if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1)
					* obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		
		return query.list();
	}
	
	@SuppressWarnings("unchecked")
	public List<CntContractDTO> doSearchContractOut(CntContractDTO obj){
		StringBuilder sql = new StringBuilder(" SELECT "
				+ " T1.CNT_CONTRACT_ID cntContractId, "
				+ " T1.CODE code,"
				+ " T1.NAME name,"
				+ " T3.name sysGroupName,"
				+ " T2.name catPartnerName "
				+ " FROM CNT_CONTRACT T1 "
				+ " LEFT JOIN CTCT_CAT_OWNER.CAT_PARTNER T2 ON T1.CAT_PARTNER_ID = T2.CAT_PARTNER_ID "
				+ " LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP T3 ON T1.SYS_GROUP_ID = T3.SYS_GROUP_ID "
				+ " WHERE T1.STATUS != 0 and contract_type=0 ");
		
		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			sql.append(" AND (UPPER(T1.NAME) like UPPER(:key) OR UPPER(T1.CODE) like UPPER(:key) escape '&')");
		}
		
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");

		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("sysGroupName", new StringType());
		query.addScalar("catPartnerName", new StringType());
		query.setResultTransformer(Transformers
				.aliasToBean(CntContractDTO.class));
		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			query.setParameter("key", "%" + obj.getKeySearch() + "%");
			queryCount.setParameter("key", "%" + obj.getKeySearch() + "%");
		}
		if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1)
					* obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}
	//HuyPQ-20181114-end
	
	/**hoangnh start 03012019**/
	public CntContractDTO getIdConstract(String code){
		StringBuilder sql = new StringBuilder("SELECT CNT_CONTRACT_ID cntContractId,"
				+ "CODE code,"
				+ "CONTRACT_CODE_KTTS contractCodeKtts "
				+ "FROM CNT_CONTRACT WHERE CODE =:code ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("contractCodeKtts", new StringType());
		
		query.setParameter("code", code);
		query.setResultTransformer(Transformers.aliasToBean(CntContractDTO.class));
		return (CntContractDTO) query.uniqueResult();
	}
	
	@SuppressWarnings("unchecked")
	public List<CntConstrWorkItemTaskDTO> getDetailById(Long id){
		StringBuilder sql = new StringBuilder("SELECT CNT_CONTRACT_ID cntContractId,"
				+ "WORK_ITEM_ID workItemId,"
				+ "CAT_TASK_ID catTaskId,"
				+ "CAT_UNIT_ID catUnitId,"
				+ "QUANTITY quantity,"
				+ "UNIT_PRICE unitPrice,"
				+ "PRICE price,"
				+ "DESCRIPTION description,"
				+ "STATUS status,"
				+ "CREATED_DATE createdDate,"
				+ "CREATED_USER_ID createdUserId,"
				+ "CREATED_GROUP_ID createdGroupId,"
				+ "UPDATED_DATE updatedDate,"
				+ "UPDATED_USER_ID updatedUserId,"
				+ "UPDATED_GROUP_ID updatedGroupId,"
				+ "CONSTRUCTION_ID constructionId "
				+ "FROM CNT_CONSTR_WORK_ITEM_TASK WHERE CNT_CONTRACT_ID =:id ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("workItemId", new LongType());
		query.addScalar("catTaskId", new LongType());
		query.addScalar("catUnitId", new LongType());
		query.addScalar("quantity", new LongType());
		query.addScalar("unitPrice", new DoubleType());
		query.addScalar("price", new DoubleType());
		query.addScalar("description", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("createdUserId", new LongType());
		query.addScalar("createdGroupId", new LongType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("updatedUserId", new LongType());
		query.addScalar("updatedGroupId", new LongType());
		query.addScalar("constructionId", new LongType());
		
		query.setParameter("id", id);
		query.setResultTransformer(Transformers.aliasToBean(CntConstrWorkItemTaskDTO.class));
		return query.list();
	}
	
	public String updateCodeKtts(CntContractDTO obj){
		StringBuilder sql = new StringBuilder("UPDATE CNT_CONTRACT SET CONTRACT_CODE_KTTS =:codeKtts WHERE CODE=:code ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("code", obj.getCode());
		query.setParameter("codeKtts", obj.getCodeKtts());
		int result = query.executeUpdate();
		return result != 0 ? "Success" : "Fail";
	}
	
	public String updateCodeCnt(CntContractDTO obj){
		StringBuilder sql = new StringBuilder("UPDATE CNT_CONTRACT SET STATUS = 0 WHERE CODE=:codeKtts ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("codeKtts", obj.getCodeKtts());
		int result = query.executeUpdate();
		return result != 0 ? "Success" : "Fail";
	}
	
	public String removeTask(Long id){
		StringBuilder sql = new StringBuilder("DELETE CNT_CONSTR_WORK_ITEM_TASK where SYN_STATUS=1 AND CNT_CONTRACT_ID=:id ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("id", id);
		int result = query.executeUpdate();
		return result != 0 ? "Success" : "Fail";
	}
	
	public String updateStatusKtts(String code){
		StringBuilder sql = new StringBuilder("UPDATE CNT_CONTRACT SET STATUS = 1 WHERE CODE=:code ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("code", code);
		int result = query.executeUpdate();
		return result != 0 ? "Success" : "Fail";
	}
	/**hoangnh end 03012019**/
	
}
