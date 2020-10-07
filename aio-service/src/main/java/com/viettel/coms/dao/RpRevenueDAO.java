package com.viettel.coms.dao;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import com.viettel.coms.bo.ConstructionTaskBO;
import com.viettel.coms.dto.ConstructionTaskDetailDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.utils.StringUtils;

@EnableTransactionManagement
@Transactional
@Repository("rpRevenueDAO")
public class RpRevenueDAO extends BaseFWDAOImpl<ConstructionTaskBO, Long> {
	
	public RpRevenueDAO() {
        this.model = new ConstructionTaskBO();
    }

    public RpRevenueDAO(Session session) {
        this.session = session;
    }

	public List<ConstructionTaskDetailDTO> doSearchForRevenue(ConstructionTaskDetailDTO obj, List<String> groupIdList) {
//        StringBuilder sql = new StringBuilder("SELECT " + "TO_CHAR(a.APPROVE_REVENUE_DATE,'dd/MM/yyyy') dateComplete, "
//                + " sys.name sysGroupName, "
//                + " cat.CODE catStationCode, "
//                + " a.CODE constructionCode, " 
//                + "(SELECT max(b.code) FROM CNT_CONSTR_WORK_ITEM_TASK cnt_task,"
//                + " CNT_CONTRACT b WHERE cnt_task.CNT_CONTRACT_ID=b.CNT_CONTRACT_ID AND b.CONTRACT_TYPE = 0" 
//                + " AND b.status !=0 and cnt_task.CONSTRUCTION_ID=a.CONSTRUCTION_ID) cntContract, "
//                // hoanm1_20180612_start
//                + "a.APPROVE_REVENUE_VALUE_PLAN completeValue , " + "a.APPROVE_REVENUE_VALUE_PLAN consAppRevenueValue, "
//                + "a.APPROVE_REVENUE_VALUE consAppRevenueValueDB, "
//                // hoanm1_20180612_end
//                + "a.STATUS status, " + "su.full_name approveUserName, "
//                + " nvl(a.Approve_revenue_state,1) consAppRevenueState, "
//                + " catPro.cat_province_id catProvinceId,"
//                + " catPro.CODE catProvinceCode, '' performerName, "
//                + " '' supervisorName, "
//                + " '' directorName, "
//                + " null startDate, " + " null endDate, "
//                + "a.APPROVE_REVENUE_DESCRIPTION approveRevenueDescription, " + "a.DESCRIPTION description, "
//                + "a.CONSTRUCTION_ID constructionId " + " FROM CONSTRUCTION a " 
//				+ " inner join construction_task cst_task on a.CONSTRUCTION_id=cst_task.CONSTRUCTION_id and cst_task.type=3 and cst_task.status=4"
//				+ " inner join detail_month_plan dmp on cst_task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1"
//                + " LEFT JOIN CAT_STATION cat ON a.CAT_STATION_ID =cat.CAT_STATION_ID "
//                + " left join SYS_USER su on su.SYS_USER_ID = a.Approve_revenue_user_id "
//                + " left join cat_province catPro on catPro.CAT_PROVINCE_ID = cat.CAT_PROVINCE_ID "
//                + " left join sys_group sys on sys.SYS_GROUP_ID=cst_task.SYS_GROUP_ID "
//                + "WHERE "
//                + " APPROVE_REVENUE_DATE IS NOT NULL ");
		StringBuilder sql = new StringBuilder(" select to_char(dateComplete,'dd/MM/yyyy')dateComplete,sysGroupName,catStationCode,constructionCode,cntContractCode cntContract,completeValue,"
    			+ " case when CONSAPPREVENUESTATE =1 then CONSAPPREVENUEVALUE else CONSAPPREVENUEVALUEDB end consAppRevenueValue,consAppRevenueValueDB,"
    			  + " status, approveUserName,consAppRevenueState,catProvinceId,catProvinceCode,performerName,supervisorName,directorName,startDate,endDate,approveRevenueDescription,description,constructionId "
    			  + " from rp_revenue a where 1=1 ");
        if (!StringUtils.isNullOrEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(a.constructionCode) LIKE upper(:keySearch) OR  upper(a.catStationCode) LIKE upper(:keySearch) escape '&')");
        }
        if (obj.getSysGroupId() != null) {
            sql.append(" AND a.sysGroupId =:sysGroupId");
        }
        if (obj.getApproveCompleteState() != null) {
            sql.append(" AND a.APPROVE_COMPLETE_STATE = :approveCompleteState");
        }
        if (obj.getListAppRevenueState() != null && obj.getListAppRevenueState().size() > 0) {
            sql.append(" AND a.consAppRevenueState IN (:listAppRevenueState)");
        }
        if (groupIdList != null && !groupIdList.isEmpty()) {
            sql.append(" and a.catProvinceId in :groupIdList ");
        }
        if (obj.getDateFrom() != null) {
			sql.append(
					"AND trunc(a.dateComplete) >= :monthYearFrom ");
		}
		if (obj.getDateTo() != null) {
			sql.append(
					"AND trunc(a.dateComplete) <= :monthYearTo ");
		}
        // tuannt_15/08/2018_start
        if (obj.getCatProvinceId() != null) {
            sql.append(" AND a.catProvinceId = :catProvinceId ");
        }
        // tuannt_15/08/2018_start
        sql.append(" ORDER BY a.dateComplete desc,sysGroupName");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
//      hoanm1_20181001_start
      StringBuilder sqlQuerySum = new StringBuilder("SELECT sum(completeValue) completeValueTotal, sum(consAppRevenueValue) consAppRevenueValueTotal, "
      		+ " sum(consAppRevenueValueDB )consAppRevenueValueDBTotal "
      		+ "  FROM (");
      sqlQuerySum.append(sql);
      sqlQuerySum.append(")");
//      hoanm1_20181001_end
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        SQLQuery querySum = getSession().createSQLQuery(sqlQuerySum.toString());
        if (groupIdList != null && !groupIdList.isEmpty()) {
            query.setParameterList("groupIdList", groupIdList);
            queryCount.setParameterList("groupIdList", groupIdList);
            querySum.setParameterList("groupIdList", groupIdList);
        }
        if (!StringUtils.isNullOrEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            querySum.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
            querySum.setParameter("sysGroupId", obj.getSysGroupId());
        }
        if (obj.getApproveCompleteState() != null) {
            query.setParameter("approveCompleteState", obj.getApproveCompleteState());
            queryCount.setParameter("approveCompleteState", obj.getApproveCompleteState());
            querySum.setParameter("approveCompleteState", obj.getApproveCompleteState());
        }
        if (obj.getListAppRevenueState() != null && obj.getListAppRevenueState().size() > 0) {
            query.setParameterList("listAppRevenueState", obj.getListAppRevenueState());
            queryCount.setParameterList("listAppRevenueState", obj.getListAppRevenueState());
            querySum.setParameterList("listAppRevenueState", obj.getListAppRevenueState());
        }
        // tuannt_15/08/2018_start
        if (obj.getCatProvinceId() != null) {
            query.setParameter("catProvinceId", obj.getCatProvinceId());
            queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
            querySum.setParameter("catProvinceId", obj.getCatProvinceId());
        }
        // tuannt_15/08/2018_start
        if (obj.getDateFrom() != null) {
            query.setParameter("monthYearFrom", obj.getDateFrom());
            queryCount.setParameter("monthYearFrom", obj.getDateFrom());
            querySum.setParameter("monthYearFrom", obj.getDateFrom());
            
        }
        if (obj.getDateTo() != null) {
            query.setParameter("monthYearTo", obj.getDateTo());
            queryCount.setParameter("monthYearTo", obj.getDateTo());
            querySum.setParameter("monthYearTo", obj.getDateTo());
            
        }
        query.addScalar("dateComplete", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("approveUserName", new StringType());
        query.addScalar("cntContract", new StringType());
        query.addScalar("completeValue", new StringType());
        query.addScalar("consAppRevenueValue", new DoubleType());
        query.addScalar("status", new StringType());
        query.addScalar("consAppRevenueState", new StringType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("performerName", new StringType());
        query.addScalar("supervisorName", new StringType());
        query.addScalar("directorName", new StringType());
        query.addScalar("consAppRevenueValueDB", new DoubleType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("approveRevenueDescription", new StringType());
        query.addScalar("description", new StringType());
        querySum.addScalar("completeValueTotal", new DoubleType());
        querySum.addScalar("consAppRevenueValueTotal", new DoubleType());
        querySum.addScalar("consAppRevenueValueDBTotal", new DoubleType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDetailDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

//        return query.list();
        List<ConstructionTaskDetailDTO> lst = query.list();

        if (lst.size() > 0) {
        	List<Object[]> rs = querySum.list();
        	for (Object[] objects : rs) {
        		lst.get(0).setCompleteValueTotal((Double) objects[0]);
        		lst.get(0).setConsAppRevenueValueTotal((Double) objects[1]);
            	lst.get(0).setConsAppRevenueValueDBTotal((Double) objects[2]);
        	}
        }
//		hungnx 20180713 end
        return lst;
    }
}
