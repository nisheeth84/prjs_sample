package com.viettel.coms.dao;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import com.viettel.coms.bo.ConstructionTaskBO;
import com.viettel.coms.dto.ConstructionTaskDetailDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.utils.StringUtils;

@EnableTransactionManagement
@Transactional
@Repository("rpHSHCDAO")
public class RpHSHCDAO extends BaseFWDAOImpl<ConstructionTaskBO, Long> {

	public RpHSHCDAO() {
		this.model = new ConstructionTaskBO();
	}

	public RpHSHCDAO(Session session) {
		this.session = session;
	}

	public List<ConstructionTaskDetailDTO> doSearchForConsManager(
			ConstructionTaskDetailDTO obj, List<String> groupIdList) {
		StringBuilder sql = new StringBuilder(" select to_char(dateComplete,'dd/MM/yyyy')dateComplete,sysGroupName,catStationCode,catProvinceId,receiveRecordsDate,cntContractCode cntContract,completeValue,workItemCode,"
   			 + " status,catProvinceCode,performerName,supervisorName,directorName,startDate,endDate,description,constructionId,constructionCode,CATSTATIONHOUSECODE catStationHouseCode,APPROVE_COMPLETE_DESCRIPTION approceCompleteDescription from rp_HSHC where 1=1 ");

		if (!StringUtils.isNullOrEmpty(obj.getKeySearch())) {
			sql.append(" AND (upper(a.CODE) LIKE upper(:keySearch) OR  upper(cat.CODE) LIKE upper(:keySearch) "
					// + "OR upper(b.CODE) LIKE upper(:keySearch) escape '&')");
					+ " escape '&')");
		}
		if (obj.getSysGroupId() != null) {
			sql.append(" AND sysGroupId = :sysGroupId ");
		}
//		if (obj.getApproveCompleteState() != null) {
//			sql.append(" AND a.APPROVE_COMPLETE_STATE = :approveCompleteState ");
//		}
		if (obj.getDateFrom() != null) {
			sql.append("AND trunc(dateComplete) >= :monthYearFrom ");
		}
		if (obj.getDateTo() != null) {
			sql.append("AND trunc(dateComplete) <= :monthYearTo ");
		}
		if (groupIdList != null && !groupIdList.isEmpty()) {
			sql.append(" and catProvinceId in :groupIdList ");
		}
		// tuannt_15/08/2018_start
		if (obj.getCatProvinceId() != null) {
			sql.append(" AND catProvinceId = :catProvinceId ");
		}
		// tuannt_15/08/2018_start
		sql.append(" ORDER BY dateComplete DESc,sysGroupName ");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		// hoanm1_20180906_start
		StringBuilder sqlTotalQuantity = new StringBuilder(
				"SELECT NVL(sum(completeValue), 0) FROM (");
		sqlTotalQuantity.append(sql);
		sqlTotalQuantity.append(")");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		SQLQuery queryQuantity = getSession().createSQLQuery(
				sqlTotalQuantity.toString());
		if (groupIdList != null && !groupIdList.isEmpty()) {
			query.setParameterList("groupIdList", groupIdList);
			queryCount.setParameterList("groupIdList", groupIdList);
			queryQuantity.setParameterList("groupIdList", groupIdList);
		}
		if (!StringUtils.isNullOrEmpty(obj.getKeySearch())) {
			query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
			queryCount
					.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
			queryQuantity.setParameter("keySearch", "%" + obj.getKeySearch()
					+ "%");
		}
		if (obj.getSysGroupId() != null) {
			query.setParameter("sysGroupId", obj.getSysGroupId());
			queryCount.setParameter("sysGroupId", obj.getSysGroupId());
			queryQuantity.setParameter("sysGroupId", obj.getSysGroupId());
		}
		if (obj.getApproveCompleteState() != null) {
			query.setParameter("approveCompleteState",
					obj.getApproveCompleteState());
			queryCount.setParameter("approveCompleteState",
					obj.getApproveCompleteState());
			queryQuantity.setParameter("approveCompleteState",
					obj.getApproveCompleteState());
		}
//		if (obj.getMonthYear() != null) {
//			LocalDate localDate = obj.getMonthYear().toInstant()
//					.atZone(ZoneId.systemDefault()).toLocalDate();
//			int month = localDate.getMonthValue();
//			int year = localDate.getYear();
//			query.setParameter("month", month);
//			queryCount.setParameter("month", month);
//			queryQuantity.setParameter("month", month);
//			query.setParameter("year", year);
//			queryCount.setParameter("year", year);
//			queryQuantity.setParameter("year", year);
//		}
		// tuannt_15/08/2018_start
		if (obj.getCatProvinceId() != null) {
			query.setParameter("catProvinceId", obj.getCatProvinceId());
			queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
			queryQuantity.setParameter("catProvinceId", obj.getCatProvinceId());
		}
		// tuannt_15/08/2018_start
		if (obj.getDateFrom() != null) {
			query.setParameter("monthYearFrom", obj.getDateFrom());
			queryCount.setParameter("monthYearFrom", obj.getDateFrom());
			queryQuantity.setParameter("monthYearFrom", obj.getDateFrom());

		}
		if (obj.getDateTo() != null) {
			query.setParameter("monthYearTo", obj.getDateTo());
			queryCount.setParameter("monthYearTo", obj.getDateTo());
			queryQuantity.setParameter("monthYearTo", obj.getDateTo());
		}

		query.addScalar("constructionId", new LongType());
		query.addScalar("description", new StringType());
		query.addScalar("status", new StringType());
		query.addScalar("sysGroupName", new StringType());
		query.addScalar("performerName", new StringType());
		query.addScalar("supervisorName", new StringType());
		query.addScalar("catStationCode", new StringType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("cntContract", new StringType());
		query.addScalar("completeValue", new StringType());
		query.addScalar("status", new StringType());
		query.addScalar("catProvinceCode", new StringType());
		query.addScalar("catProvinceId", new LongType());
		query.addScalar("receiveRecordsDate", new DateType());
		query.addScalar("directorName", new StringType());
		query.addScalar("dateComplete", new StringType());
		query.addScalar("startDate", new DateType());
		query.addScalar("endDate", new DateType());
		query.addScalar("workItemCode", new StringType());
//      hoanm1_20181203_start
		query.addScalar("catStationHouseCode", new StringType());
		query.addScalar("approceCompleteDescription", new StringType());
//      hoanm1_20181203_end
		query.setResultTransformer(Transformers
				.aliasToBean(ConstructionTaskDetailDTO.class));
		if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1)
					* obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

		List<ConstructionTaskDetailDTO> lst = query.list();
		if (lst.size() > 0) {
			BigDecimal totalQuantity = (BigDecimal) queryQuantity
					.uniqueResult();
			lst.get(0).setTotalQuantity(totalQuantity.doubleValue());
		}
		return lst;

	}

	public List<ConstructionTaskDetailDTO> doSearchForConsManager1(
			ConstructionTaskDetailDTO obj, List<String> groupIdList) {
		StringBuilder sql = new StringBuilder(
				"SELECT "
						+ " TO_CHAR(a.APPROVE_COMPLETE_DATE,'dd/MM/yyyy') dateComplete, "
						+ "(SELECT name FROM sys_group SYS WHERE sys.SYS_GROUP_ID=a.SYS_GROUP_ID "
						+ " )sysGroupName, "
						+ "(SELECT CODE FROM CAT_STATION cat WHERE cat.CAT_STATION_ID=a.CAT_STATION_ID "
						+ ")catStationCode, "
						+ "(select cat.cat_province_id from CAT_STATION cat where cat.CAT_STATION_ID=a.CAT_STATION_ID)catProvinceId,"
						+ "a.CODE constructionCode,a.RECEIVE_RECORDS_DATE receiveRecordsDate, "
						+ "b.code cntContract, "
						// hoanm1_20180823_start
						// + "a.APPROVE_COMPLETE_VALUE completeValue,"
						+ " nvl(a.APPROVE_COMPLETE_VALUE, (SELECT QUANTITY "
						+ " FROM (SELECT ct.QUANTITY FROM CONSTRUCTION_TASK ct,DETAIL_MONTH_PLAN dmp "
						+ " WHERE ct.CONSTRUCTION_ID    =a.CONSTRUCTION_ID "
						+ " AND ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
						+ " AND dmp.SIGN_STATE          = 3 "
						+ " AND dmp.status              = 1 "
						+ " AND ct.LEVEL_ID             = 4 "
						+ " AND ct.type                 =2 "
						+ " ORDER BY ct.DETAIL_MONTH_PLAN_ID DESC "
						+ " ) WHERE ROWNUM <2))completeValue,"
						// hoanm1_20180823_end
						+ " a.STATUS status, "
						+ "(SELECT prov.CODE "
						+ " FROM CAT_STATION cat, "
						+ "CAT_PROVINCE prov "
						+ " WHERE cat.CAT_STATION_ID=a.CAT_STATION_ID  "
						+ "AND cat.CAT_PROVINCE_ID =prov.CAT_PROVINCE_ID "
						+ ")catProvinceCode, "
						+ "(SELECT full_name "
						+ " FROM "
						+ "(SELECT su.FULL_NAME "
						+ "FROM CONSTRUCTION_TASK ct, "
						+ " DETAIL_MONTH_PLAN dmp, "
						+ " SYS_USER su "
						+ "WHERE ct.CONSTRUCTION_ID    =a.CONSTRUCTION_ID "
						+ "AND ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
						+ " AND dmp.SIGN_STATE          = 3 "
						+ "AND dmp.status              = 1 "
						+ " AND ct.LEVEL_ID             = 4 "
						+ " AND ct.type                 =2 "
						+ "AND ct.PERFORMER_ID         =su.SYS_USER_ID "
						+ " ORDER BY ct.DETAIL_MONTH_PLAN_ID DESC "
						+ ") "
						+ " WHERE ROWNUM <2 "
						+ ")performerName, "
						+ "(SELECT full_name"
						+ " FROM "
						+ "(SELECT su.FULL_NAME "
						+ "FROM CONSTRUCTION_TASK ct, "
						+ " DETAIL_MONTH_PLAN dmp, "
						+ "SYS_USER su "
						+ " WHERE ct.CONSTRUCTION_ID    =a.CONSTRUCTION_ID "
						+ "AND ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
						+ "AND dmp.SIGN_STATE          = 3 "
						+ "AND dmp.status              = 1 "
						+ "AND ct.LEVEL_ID             = 4 "
						+ " AND ct.type                 =2 "
						+ "AND ct.SUPERVISOR_ID        =su.SYS_USER_ID "
						+ " ORDER BY ct.DETAIL_MONTH_PLAN_ID DESC "
						+ ") "
						+ " WHERE ROWNUM <2 "
						+ ")supervisorName, "
						+ "(SELECT full_name "
						+ "FROM "
						+ "(SELECT su.FULL_NAME "
						+ "FROM CONSTRUCTION_TASK ct, "
						+ "DETAIL_MONTH_PLAN dmp, "
						+ "SYS_USER su "
						+ "WHERE ct.CONSTRUCTION_ID    =a.CONSTRUCTION_ID "
						+ "AND ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
						+ "AND dmp.SIGN_STATE          = 3 "
						+ "AND dmp.status              = 1 "
						+ "AND ct.LEVEL_ID             = 4 "
						+ "AND ct.type                 =2 "
						+ "AND ct.DIRECTOR_ID          =su.SYS_USER_ID "
						+ " ORDER BY ct.DETAIL_MONTH_PLAN_ID DESC "
						+ ") "
						+ " WHERE ROWNUM <2 "
						+ ")directorName, "
						+ "(SELECT MIN(ct.START_DATE) "
						+ "FROM CONSTRUCTION_TASK ct, "
						+ "DETAIL_MONTH_PLAN dmp "
						+ " WHERE ct.CONSTRUCTION_ID    =a.CONSTRUCTION_ID "
						+ " AND ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
						+ "AND dmp.SIGN_STATE          = 3 "
						+ " AND dmp.status              = 1 "
						+ "AND ct.LEVEL_ID             = 4 "
						+ " AND ct.type                 =2 "
						+ ") startDate, "
						+ " (SELECT MAX(ct.END_DATE) "
						+ " FROM CONSTRUCTION_TASK ct, "
						+ " DETAIL_MONTH_PLAN dmp "
						+ " WHERE ct.CONSTRUCTION_ID    =a.CONSTRUCTION_ID "
						+ "AND ct.DETAIL_MONTH_PLAN_ID = dmp.DETAIL_MONTH_PLAN_ID "
						+ " AND dmp.SIGN_STATE          = 3 "
						+ " AND dmp.status              = 1 "
						+ " AND ct.LEVEL_ID             = 4 "
						+ " AND ct.type                 =2 "
						+ ") endDate, "
						+ " a.DESCRIPTION description, "
						+ " a.CONSTRUCTION_ID constructionId "
						+ "FROM CONSTRUCTION a "
						+ "LEFT JOIN "
						+ "(SELECT DISTINCT CONSTRUCTION_ID, "
						+ "b.code "
						+ " FROM CNT_CONSTR_WORK_ITEM_TASK a, "
						+ " CNT_CONTRACT b "
						+ " WHERE a.CNT_CONTRACT_ID=b.CNT_CONTRACT_ID "
						+ " AND b.CONTRACT_TYPE    = 0 "
						+ " AND b.status          !=0 "
						+ " ) b "
						+ "ON a.CONSTRUCTION_ID       =b.CONSTRUCTION_ID "
						+ " LEFT JOIN CAT_STATION cat ON a.CAT_STATION_ID =cat.CAT_STATION_ID "
						+ " left join cat_province catPro on catPro.CAT_PROVINCE_ID = cat.CAT_PROVINCE_ID "
						+ "WHERE (a.status            = 5 OR a.status = 6 OR a.status = 7 OR a.status = 8 "
						+ "OR (a.status               = 4 "
						+ "AND a.obstructed_state     =2 ))"
						+ "AND APPROVE_COMPLETE_DATE IS NOT NULL ");

		if (!StringUtils.isNullOrEmpty(obj.getKeySearch())) {
			sql.append(" AND (upper(a.CODE) LIKE upper(:keySearch) OR  upper(cat.CODE) LIKE upper(:keySearch) "
					+ "OR upper(b.CODE) LIKE upper(:keySearch) escape '&')");
		}
		if (obj.getSysGroupId() != null) {
			sql.append(" AND a.SYS_GROUP_ID =:sysGroupId");
		}
		if (obj.getApproveCompleteState() != null) {
			sql.append(" AND a.APPROVE_COMPLETE_STATE = :approveCompleteState");
		}

		// if (obj.getMonthYear() != null) {
		// sql.append(" AND EXTRACT(MONTH FROM TO_DATE(a.APPROVE_COMPLETE_DATE, 'DD-MON-RR')) = :month ");
		// sql.append(" AND EXTRACT(YEAR FROM TO_DATE(a.APPROVE_COMPLETE_DATE, 'DD-MON-RR')) = :year ");
		// }
		if (obj.getDateFrom() != null) {
			sql.append("AND a.APPROVE_COMPLETE_DATE >= :monthYearFrom ");
		}
		if (obj.getDateTo() != null) {
			sql.append("AND a.APPROVE_COMPLETE_DATE <= :monthYearTo ");
		}

		if (groupIdList != null && !groupIdList.isEmpty()) {
			sql.append(" and catPro.CAT_PROVINCE_ID in :groupIdList ");
		}
		// tuannt_15/08/2018_start
		if (obj.getCatProvinceId() != null) {
			sql.append(" AND catPro.CAT_PROVINCE_ID = :catProvinceId ");
		}
		// tuannt_15/08/2018_start
		sql.append(" ORDER BY a.CONSTRUCTION_id DESc ");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		if (groupIdList != null && !groupIdList.isEmpty()) {
			query.setParameterList("groupIdList", groupIdList);
			queryCount.setParameterList("groupIdList", groupIdList);
		}
		if (!StringUtils.isNullOrEmpty(obj.getKeySearch())) {
			query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
			queryCount
					.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
		}

		if (obj.getSysGroupId() != null) {
			query.setParameter("sysGroupId", obj.getSysGroupId());
			queryCount.setParameter("sysGroupId", obj.getSysGroupId());
		}
		if (obj.getApproveCompleteState() != null) {
			query.setParameter("approveCompleteState",
					obj.getApproveCompleteState());
			queryCount.setParameter("approveCompleteState",
					obj.getApproveCompleteState());
		}
		// if (obj.getMonthYear() != null) {
		// LocalDate localDate =
		// obj.getMonthYear().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		// int month = localDate.getMonthValue();
		// int year = localDate.getYear();
		// query.setParameter("month", month);
		// queryCount.setParameter("month", month);
		// query.setParameter("year", year);
		// queryCount.setParameter("year", year);
		// }
		// tuannt_15/08/2018_start
		if (obj.getCatProvinceId() != null) {
			query.setParameter("catProvinceId", obj.getCatProvinceId());
			queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
		}
		// tuannt_15/08/2018_start
		if (obj.getDateFrom() != null) {
			query.setParameter("monthYearFrom", obj.getDateFrom());
			queryCount.setParameter("monthYearFrom", obj.getDateFrom());

		}
		if (obj.getDateTo() != null) {
			query.setParameter("monthYearTo", obj.getDateTo());
			queryCount.setParameter("monthYearTo", obj.getDateTo());

		}

		query.addScalar("constructionId", new LongType());
		query.addScalar("description", new StringType());
		query.addScalar("status", new StringType());
		query.addScalar("sysGroupName", new StringType());
		query.addScalar("performerName", new StringType());
		query.addScalar("supervisorName", new StringType());
		query.addScalar("catStationCode", new StringType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("cntContract", new StringType());
		query.addScalar("completeValue", new StringType());
		query.addScalar("status", new StringType());
		query.addScalar("catProvinceCode", new StringType());
		query.addScalar("catProvinceId", new LongType());
		query.addScalar("receiveRecordsDate", new DateType());
		query.addScalar("directorName", new StringType());
		query.addScalar("dateComplete", new StringType());
		query.addScalar("startDate", new DateType());
		query.addScalar("endDate", new DateType());
		query.setResultTransformer(Transformers
				.aliasToBean(ConstructionTaskDetailDTO.class));
		if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1)
					* obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

		return query.list();

	}
}
