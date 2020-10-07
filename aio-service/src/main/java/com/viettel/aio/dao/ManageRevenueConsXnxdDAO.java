package com.viettel.aio.dao;

import com.viettel.aio.bo.ManageRevenueConsXnxdBO;
import com.viettel.aio.dto.ManageRevenueConsXnxdDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository("manageRevenueConsXnxdDAO" )
public class ManageRevenueConsXnxdDAO extends BaseFWDAOImpl<ManageRevenueConsXnxdBO, Long>{

	public ManageRevenueConsXnxdDAO() {
        this.model = new ManageRevenueConsXnxdBO();
    }

    public ManageRevenueConsXnxdDAO(Session session) {
        this.session = session;
    }	
     
    public List<ManageRevenueConsXnxdDTO> doSearchRevenueXnxd(ManageRevenueConsXnxdDTO obj){
 	StringBuilder sql = new StringBuilder(" with tbl as (SELECT cc.CNT_CONTRACT_ID cntContractId, " + 
 			" cc.code cntContractCode, " + 
 			" cc.CONTENT content, " + 
 			" cc.CAT_PARTNER_ID catPartnerId, " + 
 			" cp.NAME catPartnerName, " + 
 			" cc.PRICE cntContractPrice, " + 
 			" case when cc.STRUCTURE_FILTER =1 then 'Thi công xây dựng trạm' when cc.STRUCTURE_FILTER =2 then 'Cáp quang, ngầm hóa' " +
			" when cc.STRUCTURE_FILTER =3 then 'Thương mại, dịch vụ' when cc.STRUCTURE_FILTER =4 then 'Xây dựng cơ bản' end  structureFilter, "+
 			" cc.COEFFICIENT_REVENUE coefficient, " + 
 			" cc.DESCRIPTION_REVENUE description, " + 
 			" cc.PROFIT_RATE profitRate, " + 
 			" :year year, " + 
 			" ( SELECT mar.manage_revenue_cons_xnxd_id FROM manage_revenue_cons_xnxd mar WHERE mar.year = :year AND mar.cnt_contract_id = cc.cnt_contract_id) manageRevenueConsXnxdId, " +
 			" (SELECT sum(nvl(mrc.MONTH_1,0) + nvl(mrc.MONTH_2,0) + nvl(mrc.MONTH_3,0) + " + 
 			"    nvl(mrc.MONTH_4,0) + nvl(mrc.MONTH_5,0) + nvl(mrc.MONTH_6,0) + nvl(mrc.MONTH_7,0) + " + 
 			"    nvl(mrc.MONTH_8,0) + nvl(mrc.MONTH_9,0) + nvl(mrc.MONTH_10,0) + nvl(mrc.MONTH_11,0) + nvl(mrc.MONTH_12,0))  " + 
 			"  from MANAGE_REVENUE_CONS_XNXD mrc   " + 
 			"  where mrc.year<:year and mrc.cnt_contract_id=cc.cnt_contract_id) accumulateYearAgo, " + 
 			" (select mar.MONTH_1 from MANAGE_REVENUE_CONS_XNXD mar where mar.year=:year and mar.cnt_contract_id=cc.cnt_contract_id) month1, " + 
 			" (select mar.MONTH_2 from MANAGE_REVENUE_CONS_XNXD mar where mar.year=:year and mar.cnt_contract_id=cc.cnt_contract_id) month2, " + 
 			" (select mar.MONTH_3 from MANAGE_REVENUE_CONS_XNXD mar where mar.year=:year and mar.cnt_contract_id=cc.cnt_contract_id) month3, " + 
 			" (select mar.MONTH_4 from MANAGE_REVENUE_CONS_XNXD mar where mar.year=:year and mar.cnt_contract_id=cc.cnt_contract_id) month4, " + 
 			" (select mar.MONTH_5 from MANAGE_REVENUE_CONS_XNXD mar where mar.year=:year and mar.cnt_contract_id=cc.cnt_contract_id) month5, " + 
 			" (select mar.MONTH_6 from MANAGE_REVENUE_CONS_XNXD mar where mar.year=:year and mar.cnt_contract_id=cc.cnt_contract_id) month6, " + 
 			" (select mar.MONTH_7 from MANAGE_REVENUE_CONS_XNXD mar where mar.year=:year and mar.cnt_contract_id=cc.cnt_contract_id) month7, " + 
 			" (select mar.MONTH_8 from MANAGE_REVENUE_CONS_XNXD mar where mar.year=:year and mar.cnt_contract_id=cc.cnt_contract_id) month8, " + 
 			" (select mar.MONTH_9 from MANAGE_REVENUE_CONS_XNXD mar where mar.year=:year and mar.cnt_contract_id=cc.cnt_contract_id) month9, " + 
 			" (select mar.MONTH_10 from MANAGE_REVENUE_CONS_XNXD mar where mar.year=:year and mar.cnt_contract_id=cc.cnt_contract_id) month10, " + 
 			" (select mar.MONTH_11 from MANAGE_REVENUE_CONS_XNXD mar where mar.year=:year and mar.cnt_contract_id=cc.cnt_contract_id) month11, " + 
 			" (select mar.MONTH_12 from MANAGE_REVENUE_CONS_XNXD mar where mar.year=:year and mar.cnt_contract_id=cc.cnt_contract_id) month12, " + 
 			" ((select nvl(sum(mqcx.TOTAL_PRICE_NOW),0) from MANAGE_QUANTITY_CONS_XNXD mqcx  " + 
 			"   where mqcx.year=:year  " + 
 			"   and mqcx.cnt_contract_id = cc.cnt_contract_id) " + 
 			"    + (select nvl(sum(mq.TOTAL_PRICE_NOW),0) from MANAGE_QUANTITY_CONS_XNXD mq " + 
 			"        where mq.year<:year and mq.cnt_contract_id=cc.cnt_contract_id )) accumulateQuantity " + 
 			" FROM CNT_CONTRACT cc " + 
 			" LEFT JOIN CAT_PARTNER cp " + 
 			" ON cc.CAT_PARTNER_ID = cp.CAT_PARTNER_ID " + 
 			" WHERE cc.status        != 0 AND cc.contract_type=9 " );
 			if(StringUtils.isNotBlank(obj.getKeySearch())) {
 				sql.append(" AND upper(cc.code) like upper(:cntContractCode) escape '&' ");
 			}
 			if(obj.getListStructure()!=null && obj.getListStructure().size()>0) {
				sql.append(" and cc.STRUCTURE_FILTER in (:listStructure) ");
			}
			if(obj.getCatPartnerId()!=null) {
				sql.append(" and cc.CAT_PARTNER_ID=:partnerId ");
			}
 			sql.append(" )  " + 
 			" select cntContractId, " + 
 			" cntContractCode, " + 
 			" content, " + 
 			" catPartnerId, " + 
 			" catPartnerName, " + 
 			" cntContractPrice, " + 
 			" structureFilter, " + 
 			" coefficient, " + 
 			" description, " + 
 			" profitRate, " + 
 			" year, " +
 			" manageRevenueConsXnxdId, " +
 			" accumulateYearAgo, " + 
 			" ((nvl(cntContractPrice,0) - nvl(accumulateYearAgo,0)) * nvl(coefficient,0)) sourceRevenueRest, " + 
 			" month1 month1, " + 
 			" month2 month2, " + 
 			" month3 month3, " + 
 			" month4 month4, " + 
 			" month5 month5, " + 
 			" month6 month6, " + 
 			" month7 month7, " + 
 			" month8 month8, " + 
 			" month9 month9, " + 
 			" month10 month10, " + 
 			" month11 month11, " + 
 			" month12 month12, " + 
 			" accumulateQuantity, " +
 			" (nvl(month1,0) + nvl(month2,0) + nvl(month3,0) + nvl(month4,0) + nvl(month5,0) + nvl(month6,0) + nvl(month7,0) + nvl(month8,0) + nvl(month9,0) + nvl(month10,0) + nvl(month11,0) + nvl(month12,0)) totalQuantityYear, " + 
 			" (nvl(month1,0) + nvl(month2,0) + nvl(month3,0) + nvl(month4,0) + nvl(month5,0) + nvl(month6,0) + nvl(month7,0) + nvl(month8,0) + nvl(month9,0) + nvl(month10,0) + nvl(month11,0) + nvl(month12,0) + nvl(accumulateYearAgo,0)) accumulateRevenue, " + 
 			" nvl(accumulatequantity,0)- (nvl(month1,0) + nvl(month2,0) + nvl(month3,0) + nvl(month4,0) + nvl(month5,0) + nvl(month6,0) + nvl(month7,0) + nvl(month8,0) + nvl(month9,0) + nvl(month10,0) + nvl(month11,0) + nvl(month12,0) + nvl(accumulateYearAgo,0)) valueQuantityNotRevenue, " + 
 			" ((nvl(month1,0) + nvl(month2,0) + nvl(month3,0) + nvl(month4,0) + nvl(month5,0) + nvl(month6,0) + nvl(month7,0) + nvl(month8,0) + nvl(month9,0) + nvl(month10,0) + nvl(month11,0) + nvl(month12,0)) * nvl(profitRate,0)) profit " +
 			" from tbl order by cntContractCode desc" );
 	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (" + sql.toString() + ")");
 	
 	SQLQuery query = getSession().createSQLQuery(sql.toString());
 	SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
 	
 	query.addScalar("cntContractId", new LongType());
 	query.addScalar("cntContractCode", new StringType());
 	query.addScalar("content", new StringType());
 	query.addScalar("catPartnerId", new LongType());
 	query.addScalar("catPartnerName", new StringType());
 	query.addScalar("cntContractPrice", new LongType());
 	query.addScalar("structureFilter", new StringType());
 	query.addScalar("coefficient", new DoubleType());
 	query.addScalar("description", new StringType());
 	query.addScalar("profitRate", new DoubleType());
 	query.addScalar("accumulateYearAgo", new LongType());
 	query.addScalar("sourceRevenueRest", new LongType());
 	query.addScalar("month1", new LongType());
 	query.addScalar("month2", new LongType());
 	query.addScalar("month3", new LongType());
 	query.addScalar("month4", new LongType());
 	query.addScalar("month5", new LongType());
 	query.addScalar("month6", new LongType());
 	query.addScalar("month7", new LongType());
 	query.addScalar("month8", new LongType());
 	query.addScalar("month9", new LongType());
 	query.addScalar("month10", new LongType());
 	query.addScalar("month11", new LongType());
 	query.addScalar("month12", new LongType());
 	query.addScalar("totalQuantityYear", new LongType());
 	query.addScalar("accumulateRevenue", new LongType());
 	query.addScalar("valueQuantityNotRevenue", new LongType());
 	query.addScalar("profit", new LongType());
 	query.addScalar("year", new LongType());
 	query.addScalar("manageRevenueConsXnxdId", new LongType());

 	query.setParameter("year", obj.getYear());
 	queryCount.setParameter("year", obj.getYear());
 	
 	if(StringUtils.isNotBlank(obj.getKeySearch())) {
		query.setParameter("cntContractCode", "%" + obj.getKeySearch() + "%");
		queryCount.setParameter("cntContractCode", "%" + obj.getKeySearch() + "%");
	}
 	
 	if(obj.getListStructure()!=null && obj.getListStructure().size()>0) {
		query.setParameterList("listStructure", obj.getListStructure());
    	queryCount.setParameterList("listStructure", obj.getListStructure());
	}
	
	if(obj.getCatPartnerId()!=null) {
		query.setParameter("partnerId", obj.getCatPartnerId());
    	queryCount.setParameter("partnerId", obj.getCatPartnerId());
	}
 	
 	query.setResultTransformer(Transformers.aliasToBean(ManageRevenueConsXnxdDTO.class));
 	
 	if (obj.getPage() != null && obj.getPageSize() != null) {
		query.setFirstResult((obj.getPage().intValue() - 1)
				* obj.getPageSize().intValue());
		query.setMaxResults(obj.getPageSize().intValue());
	}
	obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
	
	return query.list();
 	
    }
    
    public ManageRevenueConsXnxdDTO checkDuplicateYear(Long year, Long cntContractId) {
    	StringBuilder sql = new StringBuilder(" SELECT MANAGE_REVENUE_CONS_XNXD_ID manageRevenueConsXnxdId FROM MANAGE_REVENUE_CONS_XNXD WHERE YEAR=:year and CNT_CONTRACT_ID=:cntContractId ");
    	SQLQuery query = getSession().createSQLQuery(sql.toString());
    	query.addScalar("manageRevenueConsXnxdId", new LongType());
    	
    	query.setParameter("year", year);
    	query.setParameter("cntContractId", cntContractId);
    	
    	query.setResultTransformer(Transformers.aliasToBean(ManageRevenueConsXnxdDTO.class));
    	
    	@SuppressWarnings("unchecked")
		List<ManageRevenueConsXnxdDTO> ls = query.list();
    	if(ls.size()>0) {
    		return ls.get(0);
    	}
    	return null;
    }
    
    public List<ManageRevenueConsXnxdDTO> doSearchReportRevenue(ManageRevenueConsXnxdDTO obj){
    	StringBuilder sql = new StringBuilder(" with tbl as (select CASE WHEN cc.structure_filter = 1  THEN 'Thi công xây dựng trạm' WHEN cc.structure_filter = 2  THEN 'Cáp quang, ngầm hóa' " 
		 + " WHEN cc.structure_filter = 3  THEN 'Thương mại, dịch vụ' WHEN cc.structure_filter = 4  THEN 'Xây dựng cơ bản' END structureFilter, " + 
    			"sum(cc.PRICE) cntContractPrice, " + 
    			"MAX(cc.COEFFICIENT_REVENUE) coefficient, " + 
    			"MAX(cc.PROFIT_RATE) PROFIT_RATE, " + 
    			"sum((select sum(nvl(mrc.MONTH_1,0) + nvl(mrc.MONTH_2,0) + nvl(mrc.MONTH_3,0)  " + 
    			"+ nvl(mrc.MONTH_4,0) + nvl(mrc.MONTH_5,0) + nvl(mrc.MONTH_6,0) + nvl(mrc.MONTH_7,0) " + 
    			"+ nvl(mrc.MONTH_8,0) + nvl(mrc.MONTH_9,0) + nvl(mrc.MONTH_10,0) + nvl(mrc.MONTH_11,0)  " + 
    			"+ nvl(mrc.MONTH_12,0)) from MANAGE_REVENUE_CONS_XNXD mrc where mrc.year < :year and mrc.CNT_CONTRACT_ID=cc.CNT_CONTRACT_ID)) accumulateYearAgo, " + 
    			"sum((select sum(nvl(mrc.MONTH_1,0) + nvl(mrc.MONTH_2,0) + nvl(mrc.MONTH_3,0)  " + 
    			"+ nvl(mrc.MONTH_4,0) + nvl(mrc.MONTH_5,0) + nvl(mrc.MONTH_6,0) + nvl(mrc.MONTH_7,0) " + 
    			"+ nvl(mrc.MONTH_8,0) + nvl(mrc.MONTH_9,0) + nvl(mrc.MONTH_10,0) + nvl(mrc.MONTH_11,0)  " + 
    			"+ nvl(mrc.MONTH_12,0)) from MANAGE_REVENUE_CONS_XNXD mrc where mrc.year = :year and mrc.CNT_CONTRACT_ID=cc.CNT_CONTRACT_ID)) totalQuantityYear, " + 
    			"sum((select sum(a.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD a where a.year<:year and a.CNT_CONTRACT_ID=cc.CNT_CONTRACT_ID)) accumulateYearAgoSL, " + 
    			"sum((select sum(a.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD a where a.year=:year and a.CNT_CONTRACT_ID=cc.CNT_CONTRACT_ID)) totalQuantityYearSL " + 
    			"from CNT_CONTRACT cc " + 
    			"where cc.status!=0 " + 
    			"and cc.contract_type=9 ");
    	if(obj.getListStructure()!=null && obj.getListStructure().size()>0) {
    		sql.append(" and cc.STRUCTURE_FILTER in (:listStructure) ");
    	}
    	
    	if(obj.getCatPartnerId()!=null) {
    		sql.append(" and cc.CAT_PARTNER_ID=:partnerId ");
    	}
    	
    	sql.append(" group by cc.STRUCTURE_FILTER " + 
    			") " + 
    			"select  " + 
    			"structureFilter, " + 
    			"cntContractPrice, " + 
    			"accumulateYearAgo, " + 
    			"((nvl(cntContractPrice,0) - nvl(accumulateYearAgo,0))* coefficient) sourceRevenueRest, " + 
    			"totalQuantityYear, " + 
    			"(nvl(accumulateYearAgo,0) + nvl(totalQuantityYear,0)) accumulateRevenue, " + 
    			"((nvl(accumulateYearAgoSL,0) + nvl(totalQuantityYearSL,0))- (nvl(accumulateYearAgo,0) + nvl(totalQuantityYear,0))) valueQuantityNotRevenue, " + 
    			"(totalQuantityYear * PROFIT_RATE) profit " + 
    			"from tbl ");
    	StringBuilder sqlCount = new StringBuilder("select count(*) from (" + sql.toString() + ")");
    	
    	SQLQuery query = getSession().createSQLQuery(sql.toString());
    	SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
    	
    	query.addScalar("structureFilter", new StringType());
    	query.addScalar("cntContractPrice", new LongType());
    	query.addScalar("accumulateYearAgo", new LongType());
    	query.addScalar("totalQuantityYear", new LongType());
    	query.addScalar("accumulateRevenue", new LongType());
    	query.addScalar("valueQuantityNotRevenue", new LongType());
    	query.addScalar("profit", new LongType());
    	query.addScalar("sourceRevenueRest", new LongType());
    	
    	query.setParameter("year", obj.getYear());
    	queryCount.setParameter("year", obj.getYear());
    	
    	if(obj.getListStructure()!=null && obj.getListStructure().size()>0) {
    		query.setParameterList("listStructure", obj.getListStructure());
        	queryCount.setParameterList("listStructure", obj.getListStructure());
    	}
    	
    	if(obj.getCatPartnerId()!=null) {
    		query.setParameter("partnerId", obj.getCatPartnerId());
        	queryCount.setParameter("partnerId", obj.getCatPartnerId());
    	}
    	
    	query.setResultTransformer(Transformers.aliasToBean(ManageRevenueConsXnxdDTO.class));
    	
    	if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1)
					* obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
    	obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    	
    	return query.list();
    }
    public void UpdateContractRevuenue(ManageRevenueConsXnxdDTO obj) {
    	StringBuilder sql2 = new StringBuilder("update CNT_CONTRACT set COEFFICIENT_REVENUE= :coefficientRevenue,PROFIT_RATE= :profitRate ");
    	if(StringUtils.isNotBlank(obj.getDescription())) {
    		sql2.append(",DESCRIPTION_REVENUE=:descriptionRevenue ");
    	}
    	sql2.append(" where CNT_CONTRACT_ID=:cntContractId ");
    	SQLQuery query2 = getSession().createSQLQuery(sql2.toString());
    	query2.setParameter("coefficientRevenue", obj.getCoefficient());
    	query2.setParameter("profitRate", obj.getProfitRate());
    	query2.setParameter("cntContractId", obj.getCntContractId());
    	if(StringUtils.isNotBlank(obj.getDescription())) {
    		query2.setParameter("descriptionRevenue", obj.getDescription());
    	}
    	query2.executeUpdate();
    }
}
