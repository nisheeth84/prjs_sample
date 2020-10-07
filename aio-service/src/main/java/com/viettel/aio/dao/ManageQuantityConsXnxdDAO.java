package com.viettel.aio.dao;

import com.viettel.aio.bo.ManageQuantityConsXnxdBO;
import com.viettel.aio.dto.CntContractTaskXNXDDTO;
import com.viettel.aio.dto.ManageQuantityConsXnxdDTO;
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

@Repository("manageQuantityConsXnxdDAO")
public class ManageQuantityConsXnxdDAO extends BaseFWDAOImpl<ManageQuantityConsXnxdBO, Long> {

	public ManageQuantityConsXnxdDAO() {
        this.model = new ManageQuantityConsXnxdBO();
    }

    public ManageQuantityConsXnxdDAO(Session session) {
        this.session = session;
    }	
    
    public List<ManageQuantityConsXnxdDTO> doSearchContractXNXD(ManageQuantityConsXnxdDTO obj){
    	StringBuilder sql = new StringBuilder(" with tbl as (SELECT    " + 
    			"  cc.CNT_CONTRACT_ID cntContractId,    "  + 
    			"  cc.code cntContractCode,   "  + 
    			"  cc.CONTENT content,   "  + 
    			"  cc.CAT_PARTNER_ID catPartnerId,   "  + 
    			"  cp.NAME catPartnerName,   "  + 
    			"  cc.PRICE cntContractPrice,   "  + 
    			"  case when cc.STRUCTURE_FILTER =1 then 'Thi công xây dựng trạm' when cc.STRUCTURE_FILTER =2 then 'Cáp quang, ngầm hóa' "
    			+ " when cc.STRUCTURE_FILTER =3 then 'Thương mại, dịch vụ' when cc.STRUCTURE_FILTER =4 then 'Xây dựng cơ bản' end  structureFilter,   "  + 
    			"  cc.COEFFICIENT coefficient, "  + 
    			"  cc.DESCRIPTION_XNXD descriptionXnxd, "  + 
    			"  (select sum(mq.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD mq "  + 
    			"    where mq.year<:year and mq.cnt_contract_id=cc.cnt_contract_id ) accumulateYearAgo, "  + 
    			"  (select sum(mqc.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD mqc "  + 
    			"    where mqc.cnt_contract_id = cc.cnt_contract_id "  + 
    			"    and mqc.YEAR=:year "  + 
    			"    and mqc.month=1 "  + 
    			"  ) valueQuantityMonth1, "  + 
    			"  (select sum(mqc.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD mqc "  + 
    			"    where mqc.cnt_contract_id = cc.cnt_contract_id "  + 
    			"    and mqc.YEAR=:year "  + 
    			"    and mqc.month=2 "  + 
    			"  ) valueQuantityMonth2, "  + 
    			"  (select sum(mqc.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD mqc "  + 
    			"    where mqc.cnt_contract_id = cc.cnt_contract_id "  + 
    			"    and mqc.YEAR=:year "  + 
    			"    and mqc.month=3 "  + 
    			"  ) valueQuantityMonth3, "  + 
    			"  (select sum(mqc.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD mqc "  + 
    			"    where mqc.cnt_contract_id = cc.cnt_contract_id "  + 
    			"    and mqc.YEAR=:year "  + 
    			"    and mqc.month=4 "  + 
    			"  ) valueQuantityMonth4, "  + 
    			"  (select sum(mqc.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD mqc "  + 
    			"    where mqc.cnt_contract_id = cc.cnt_contract_id "  + 
    			"    and mqc.YEAR=:year "  + 
    			"    and mqc.month=5 "  + 
    			"  ) valueQuantityMonth5, "  + 
    			"  (select sum(mqc.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD mqc "  + 
    			"    where mqc.cnt_contract_id = cc.cnt_contract_id "  + 
    			"    and mqc.YEAR=:year "  + 
    			"    and mqc.month=6 "  + 
    			"  ) valueQuantityMonth6, "  + 
    			"  (select sum(mqc.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD mqc "  + 
    			"    where mqc.cnt_contract_id = cc.cnt_contract_id "  + 
    			"    and mqc.YEAR=:year "  + 
    			"    and mqc.month=7 "  + 
    			"  ) valueQuantityMonth7, "  + 
    			"  (select sum(mqc.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD mqc "  + 
    			"    where mqc.cnt_contract_id = cc.cnt_contract_id "  + 
    			"    and mqc.YEAR=:year "  + 
    			"    and mqc.month=8 "  + 
    			"  ) valueQuantityMonth8, "  + 
    			"  (select sum(mqc.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD mqc "  + 
    			"    where mqc.cnt_contract_id = cc.cnt_contract_id "  + 
    			"    and mqc.YEAR=:year "  + 
    			"    and mqc.month=9 "  + 
    			"  ) valueQuantityMonth9, "  + 
    			"  (select sum(mqc.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD mqc "  + 
    			"    where mqc.cnt_contract_id = cc.cnt_contract_id "  + 
    			"    and mqc.YEAR=:year "  + 
    			"    and mqc.month=10 "  + 
    			"  ) valueQuantityMonth10, "  + 
    			"  (select sum(mqc.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD mqc "  + 
    			"    where mqc.cnt_contract_id = cc.cnt_contract_id "  + 
    			"    and mqc.YEAR=:year "  + 
    			"    and mqc.month=11 "  + 
    			"  ) valueQuantityMonth11, "  + 
    			"  (select sum(mqc.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD mqc "  + 
    			"    where mqc.cnt_contract_id = cc.cnt_contract_id "  + 
    			"    and mqc.YEAR=:year "  + 
    			"    and mqc.month=12 "  + 
    			"  ) valueQuantityMonth12, "  + 
    			"  (select sum(mqcx.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD mqcx "  + 
    			"  where mqcx.year=:year "  + 
    			"  and mqcx.cnt_contract_id = cc.cnt_contract_id) totalQuantityYear "  + 
    			"  FROM CNT_CONTRACT cc   "  + 
    			"  left join CTCT_CAT_OWNER.CAT_PARTNER cp   "  + 
    			"  on cc.CAT_PARTNER_ID = cp.CAT_PARTNER_ID   "  + 
    			"  where cc.status != 0 and cc.contract_type=9 ");
    			if(StringUtils.isNotBlank(obj.getKeySearch())) {
    				sql.append(" AND upper(cc.code) like upper(:cntContractCode) escape '&' ");
    			}
    			if(obj.getListStructure()!=null && obj.getListStructure().size()>0) {
    				sql.append(" and cc.STRUCTURE_FILTER in (:listStructure) ");
    			}
    			if(obj.getCatPartnerId()!=null) {
    				sql.append(" and cc.CAT_PARTNER_ID=:partnerId ");
    			}
    			sql.append(" ) select cntContractId, "  + 
    			" cntContractCode, "  + 
    			" content, "  + 
    			" catPartnerId, "  + 
    			" catPartnerName, "  + 
    			" cntContractPrice, "  + 
    			" structureFilter, "  + 
    			" accumulateYearAgo, "  + 
    			" coefficient, "  + 
    			" descriptionXnxd, "  + 
    			" ((nvl(cntContractPrice,0) - nvl(accumulateYearAgo,0)) * nvl(coefficient,0)) sourceQuantityYearNow, "  + 
    			" valueQuantityMonth1, "  + 
    			" valueQuantityMonth2, "  + 
    			" valueQuantityMonth3, "  + 
    			" valueQuantityMonth4, "  + 
    			" valueQuantityMonth5, "  + 
    			" valueQuantityMonth6, "  + 
    			" valueQuantityMonth7, "  + 
    			" valueQuantityMonth8, "  + 
    			" valueQuantityMonth9, "  + 
    			" valueQuantityMonth10, "  + 
    			" valueQuantityMonth11, "  + 
    			" valueQuantityMonth12, "  + 
    			" totalQuantityYear, "  + 
    			" (nvl(totalQuantityYear,0) + nvl(accumulateYearAgo,0)) accumulateQuantity, "  + 
    			" (nvl(cntContractPrice,0) - (nvl(totalQuantityYear,0) + nvl(accumulateYearAgo,0))) valueQuantityRest "  + 
    			" from tbl order by cntContractCode desc" );
    	
    	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		
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
    	query.addScalar("descriptionXnxd", new StringType());
    	query.addScalar("accumulateYearAgo", new LongType());
    	query.addScalar("sourceQuantityYearNow", new LongType());
    	query.addScalar("valueQuantityMonth1", new LongType());
    	query.addScalar("valueQuantityMonth2", new LongType());
    	query.addScalar("valueQuantityMonth3", new LongType());
    	query.addScalar("valueQuantityMonth4", new LongType());
    	query.addScalar("valueQuantityMonth5", new LongType());
    	query.addScalar("valueQuantityMonth6", new LongType());
    	query.addScalar("valueQuantityMonth7", new LongType());
    	query.addScalar("valueQuantityMonth8", new LongType());
    	query.addScalar("valueQuantityMonth9", new LongType());
    	query.addScalar("valueQuantityMonth10", new LongType());
    	query.addScalar("valueQuantityMonth11", new LongType());
    	query.addScalar("valueQuantityMonth12", new LongType());
    	query.addScalar("totalQuantityYear", new LongType());
    	query.addScalar("accumulateQuantity", new LongType());
    	query.addScalar("valueQuantityRest", new LongType());
    	
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
    	
    	query.setResultTransformer(Transformers.aliasToBean(ManageQuantityConsXnxdDTO.class));
    	
    	if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1)
					* obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
    	obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    	
    	return query.list();
    }
    
    //Lấy all danh sách phụ lục công việc theo hợp đồng
    public List<CntContractTaskXNXDDTO> getDataContractTaskXNXD(ManageQuantityConsXnxdDTO obj){
    	StringBuilder sql = new StringBuilder(" select CNT_CONTRACT_TASK_XNXD_ID cntContractTaskXNXDId," + 
    			"CNT_CONTRACT_ID cntContractId, " + 
    			"CAT_TASK_NAME catTaskName, " + 
    			"CAT_UNIT_NAME catUnitName, " + 
    			"TASK_MASS taskMass, " + 
    			"TASK_PRICE taskPrice, " + 
    			"TOTAL_MONEY totalMoney " + 
    			"from CNT_CONTRACT_TASK_XNXD " + 
    			"where CNT_CONTRACT_ID=:cntContractId " +
    			"ORDER BY CNT_CONTRACT_TASK_XNXD_ID DESC "
    			);

    	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
    	
    	query.addScalar("cntContractTaskXNXDId", new LongType());
    	query.addScalar("cntContractId", new LongType());
    	query.addScalar("catTaskName", new StringType());
    	query.addScalar("catUnitName", new StringType());
    	query.addScalar("taskMass", new DoubleType());
    	query.addScalar("taskPrice", new LongType());
    	query.addScalar("totalMoney", new LongType());
    	
    	query.setParameter("cntContractId", obj.getCntContractId());
    	queryCount.setParameter("cntContractId", obj.getCntContractId());
    	
    	query.setResultTransformer(Transformers.aliasToBean(CntContractTaskXNXDDTO.class));
    	
    	if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1)
					* obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
    	obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    	
    	return query.list();
    }
    
    //Lấy danh sách phụ lục công việc theo tuần tháng năm
    public List<ManageQuantityConsXnxdDTO> getDataQuantityByDate(ManageQuantityConsXnxdDTO obj){
    	StringBuilder sql = new StringBuilder(" select MANAGE_QUANTITY_CONS_XNXD_ID manageQuantityConsXnxdId, " + 
    			"CNT_CONTRACT_CODE cntContractCode, " + 
    			"TASK_ID taskId, " + 
    			"TASK_NAME taskName, " + 
    			"TASK_MASS_NOW taskMassNow, " + 
    			"TASK_PRICE taskPrice, " + 
    			"TOTAL_PRICE_NOW totalPriceNow, " + 
    			"YEAR year, " + 
    			"MONTH month, " + 
    			"WEEK week, " + 
    			"CNT_CONTRACT_ID cntContractId " + 
    			"from MANAGE_QUANTITY_CONS_XNXD " + 
    			"where WEEK=:week " + 
    			"and month=:month " + 
    			"and year=:year " + 
    			"and CNT_CONTRACT_ID=:cntContractId ");
    	SQLQuery query = getSession().createSQLQuery(sql.toString());
    	
    	query.addScalar("manageQuantityConsXnxdId", new LongType());
    	query.addScalar("cntContractCode", new StringType());
    	query.addScalar("taskId", new LongType());
    	query.addScalar("taskName", new StringType());
    	query.addScalar("taskMassNow", new DoubleType());
    	query.addScalar("taskPrice", new LongType());
    	query.addScalar("totalPriceNow", new LongType());
    	query.addScalar("year", new LongType());
    	query.addScalar("month", new LongType());
    	query.addScalar("week", new LongType());
    	
    	query.setParameter("week", obj.getWeek());
    	query.setParameter("month", obj.getMonth());
    	query.setParameter("year", obj.getYear());
    	query.setParameter("cntContractId", obj.getCntContractId());
    	
    	query.setResultTransformer(Transformers.aliasToBean(ManageQuantityConsXnxdDTO.class));
    	
    	return query.list();
    }
    
    public void deleteTaskByDate(ManageQuantityConsXnxdDTO obj) {
    	StringBuilder sql1 = new StringBuilder("DELETE FROM MANAGE_QUANTITY_CONS_XNXD"
    			+ " WHERE WEEK=:week"
    			+ " AND MONTH=:month"
    			+ " AND YEAR=:year"
    			+ " AND CNT_CONTRACT_ID=:cntContractId ");
    	
    	StringBuilder sql2 = new StringBuilder("update CNT_CONTRACT set COEFFICIENT=:coefficient ");
    	if(StringUtils.isNotBlank(obj.getDescriptionXnxd())) {
    		sql2.append(",DESCRIPTION_XNXD=:descriptionXnxd ");
    	}
    	sql2.append(" where CNT_CONTRACT_ID=:cntContractId ");
    	
    	SQLQuery query1 = getSession().createSQLQuery(sql1.toString());
    	SQLQuery query2 = getSession().createSQLQuery(sql2.toString());
    	
    	query1.setParameter("week", obj.getWeek());
    	query1.setParameter("month", obj.getMonth());
    	query1.setParameter("year", obj.getYear());
    	query1.setParameter("cntContractId", obj.getCntContractId());
    	
    	query2.setParameter("coefficient", obj.getCoefficient());
    	query2.setParameter("cntContractId", obj.getCntContractId());
    	if(StringUtils.isNotBlank(obj.getDescriptionXnxd())) {
    		query2.setParameter("descriptionXnxd", obj.getDescriptionXnxd());
    	}
    	
    	query1.executeUpdate();
    	query2.executeUpdate();
    }
    
    public List<ManageQuantityConsXnxdDTO> doSearchReportQuantity(ManageQuantityConsXnxdDTO obj){
    	StringBuilder sql = new StringBuilder(" with tbl as (select CASE WHEN cc.structure_filter = 1  THEN 'Thi công xây dựng trạm' WHEN cc.structure_filter = 2  THEN 'Cáp quang, ngầm hóa' " 
		 + "WHEN cc.structure_filter = 3  THEN 'Thương mại, dịch vụ' WHEN cc.structure_filter = 4  THEN 'Xây dựng cơ bản' END structureFilter, " + 
    			"sum(cc.PRICE) cntContractPrice, " + 
    			"max(cc.COEFFICIENT) coefficient, " + 
    			"sum((select sum(a.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD a where a.year<:year and a.CNT_CONTRACT_ID=cc.CNT_CONTRACT_ID)) accumulateYearAgo, " + 
    			"sum((select sum(a.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD a where a.year=:year and a.CNT_CONTRACT_ID=cc.CNT_CONTRACT_ID)) totalQuantityYear " + 
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
    			"select " + 
    			"structureFilter, " + 
    			"cntContractPrice, " + 
    			"accumulateYearAgo, " + 
    			"((nvl(cntContractPrice,0) - nvl(accumulateYearAgo,0))* coefficient) sourceQuantityYearNow, " + 
    			"totalQuantityYear, " + 
    			"(nvl(accumulateYearAgo,0) + nvl(totalQuantityYear,0)) accumulateQuantity, " + 
    			"(nvl(cntContractPrice,0) - (nvl(accumulateYearAgo,0) + nvl(totalQuantityYear,0))) valueQuantityRest " + 
    			" from tbl ");
    	StringBuilder sqlCount = new StringBuilder("select count(*) from (" + sql.toString() + ")");
    	
    	SQLQuery query = getSession().createSQLQuery(sql.toString());
    	SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
    	
    	query.addScalar("structureFilter", new StringType());
    	query.addScalar("cntContractPrice", new LongType());
    	query.addScalar("accumulateYearAgo", new LongType());
    	query.addScalar("totalQuantityYear", new LongType());
    	query.addScalar("accumulateQuantity", new LongType());
    	query.addScalar("valueQuantityRest", new LongType());
    	query.addScalar("sourceQuantityYearNow", new LongType());
    	
    	query.setResultTransformer(Transformers.aliasToBean(ManageQuantityConsXnxdDTO.class));
    	
    	query.setParameter("year", obj.getYear());
    	queryCount.setParameter("year", obj.getYear());
    	
    	if(obj.getCatPartnerId()!=null) {
    		query.setParameter("partnerId", obj.getCatPartnerId());
        	queryCount.setParameter("partnerId", obj.getCatPartnerId());
    	}
    	
    	if(obj.getListStructure()!=null && obj.getListStructure().size()>0) {
    		query.setParameterList("listStructure", obj.getListStructure());
        	queryCount.setParameterList("listStructure", obj.getListStructure());
    	}
    	
    	if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1)
					* obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
    	obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    	
    	return query.list();
    }
    
    public List<ManageQuantityConsXnxdDTO> doSearchQuantityRevenue(ManageQuantityConsXnxdDTO obj){
    	StringBuilder sql = new StringBuilder(" with tbl as (select cc.content content, " + 
    			"part.name partnerName, " + 
    			"cc.code contractCode, " + 
    			"sum(cc.price) cntContractPrice, " + 
    			" CASE WHEN cc.structure_filter = 1  THEN 'Thi công xây dựng trạm' WHEN cc.structure_filter = 2  THEN 'Cáp quang, ngầm hóa' " 
		 + " WHEN cc.structure_filter = 3  THEN 'Thương mại, dịch vụ' WHEN cc.structure_filter = 4  THEN 'Xây dựng cơ bản' END structureFilter, " +
    			"sum((select sum(a.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD a where a.year<:year and a.CNT_CONTRACT_ID=cc.CNT_CONTRACT_ID)) accumulateYearAgo, " + 
    			"sum((select sum(a.TOTAL_PRICE_NOW) from MANAGE_QUANTITY_CONS_XNXD a where a.year=:year and a.CNT_CONTRACT_ID=cc.CNT_CONTRACT_ID)) totalQuantityYear, " + 
    			"sum((select sum(nvl(mrc.MONTH_1,0) + nvl(mrc.MONTH_2,0) + nvl(mrc.MONTH_3,0)  " + 
    			"+ nvl(mrc.MONTH_4,0) + nvl(mrc.MONTH_5,0) + nvl(mrc.MONTH_6,0) + nvl(mrc.MONTH_7,0) " + 
    			"+ nvl(mrc.MONTH_8,0) + nvl(mrc.MONTH_9,0) + nvl(mrc.MONTH_10,0) + nvl(mrc.MONTH_11,0)  " + 
    			"+ nvl(mrc.MONTH_12,0)) from MANAGE_REVENUE_CONS_XNXD mrc where mrc.year < :year and mrc.CNT_CONTRACT_ID=cc.CNT_CONTRACT_ID)) accumulateYearAgoDt, " + 
    			"sum((select sum(nvl(mrc.MONTH_1,0) + nvl(mrc.MONTH_2,0) + nvl(mrc.MONTH_3,0)  " + 
    			"+ nvl(mrc.MONTH_4,0) + nvl(mrc.MONTH_5,0) + nvl(mrc.MONTH_6,0) + nvl(mrc.MONTH_7,0) " + 
    			"+ nvl(mrc.MONTH_8,0) + nvl(mrc.MONTH_9,0) + nvl(mrc.MONTH_10,0) + nvl(mrc.MONTH_11,0)  " + 
    			"+ nvl(mrc.MONTH_12,0)) from MANAGE_REVENUE_CONS_XNXD mrc where mrc.year = :year and mrc.CNT_CONTRACT_ID=cc.CNT_CONTRACT_ID)) totalQuantityYearDt " + 
    			"from CNT_CONTRACT cc " + 
    			"left join cat_partner part on cc.cat_partner_id=part.cat_partner_id " + 
    			"where  " + 
    			" cc.status!=0 " + 
    			"and cc.contract_type=9 ");
    	if(StringUtils.isNotBlank(obj.getKeySearch())) {
    		sql.append(" and upper(cc.code) like upper(:code) escape '&' ");
    	}
    	if(obj.getListStructure()!=null && obj.getListStructure().size()>0) {
    		sql.append(" and cc.STRUCTURE_FILTER in (:listStructure) ");
    	}
    	
    	if(obj.getCatPartnerId()!=null) {
    		sql.append(" and cc.CAT_PARTNER_ID=:partnerId ");
    	}
    	
    	sql.append(" group by cc.content,part.name,cc.code,cc.price,cc.STRUCTURE_FILTER " + 
    			") " + 
    			"select content, " + 
    			"partnerName catPartnerName, " + 
    			"contractCode cntContractCode, " + 
    			"cntContractPrice, " + 
    			"structureFilter, "+
    			"totalQuantityYear, " + 
    			"(nvl(accumulateYearAgo,0) + nvl(totalQuantityYear,0)) accumulateQuantity, " + 
    			"totalQuantityYearDt, " + 
    			"(nvl(accumulateYearAgoDt,0) + nvl(totalQuantityYearDt,0)) accumulateRevenue, " + 
    			"(nvl(cntContractPrice,0) - (nvl(accumulateYearAgo,0) + nvl(totalQuantityYear,0))) valueQuantityRest, " + 
    			"((nvl(accumulateYearAgo,0) + nvl(totalQuantityYear,0)) - (nvl(accumulateYearAgoDt,0) + nvl(totalQuantityYearDt,0))) valueQuantityNotRevenue, " + 
    			"(nvl(cntContractPrice,0) - (nvl(accumulateYearAgoDt,0) + nvl(totalQuantityYearDt,0))) valueRevenueRest " + 
    			"from tbl ");
    	StringBuilder sqlCount = new StringBuilder("select count(*) from (" + sql.toString() + ")");
    	
    	SQLQuery query = getSession().createSQLQuery(sql.toString());
    	SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
    	
    	query.addScalar("content", new StringType());
    	query.addScalar("catPartnerName", new StringType());
    	query.addScalar("cntContractCode", new StringType());
    	query.addScalar("cntContractPrice", new LongType());
    	query.addScalar("totalQuantityYear", new LongType());
    	query.addScalar("accumulateQuantity", new LongType());
    	query.addScalar("totalQuantityYearDt", new LongType());
    	query.addScalar("accumulateRevenue", new LongType());
    	query.addScalar("valueQuantityNotRevenue", new LongType());
    	query.addScalar("valueRevenueRest", new LongType());
    	query.addScalar("valueQuantityRest", new LongType());
    	query.addScalar("structureFilter", new StringType());
    	
    	query.setResultTransformer(Transformers.aliasToBean(ManageQuantityConsXnxdDTO.class));
    	
    	query.setParameter("year", obj.getYear());
    	queryCount.setParameter("year", obj.getYear());
    	
    	if(StringUtils.isNotBlank(obj.getKeySearch())) {
    		query.setParameter("code", "%" + obj.getKeySearch() + "%");
        	queryCount.setParameter("code", "%" + obj.getKeySearch() + "%");
    	}
    	
    	if(obj.getListStructure()!=null && obj.getListStructure().size()>0) {
    		query.setParameterList("listStructure", obj.getListStructure());
        	queryCount.setParameterList("listStructure", obj.getListStructure());
    	}
    	
    	if(obj.getCatPartnerId()!=null) {
    		query.setParameter("partnerId", obj.getCatPartnerId());
        	queryCount.setParameter("partnerId", obj.getCatPartnerId());
    	}
    	
    	if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1)
					* obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
    	obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    	
    	return query.list();
    }

    
}
