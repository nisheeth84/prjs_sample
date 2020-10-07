package com.viettel.coms.dao;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.module.SimpleAbstractTypeResolver;
import com.viettel.cat.utils.ValidateUtils;
import com.viettel.coms.bo.WorkItemBO;
import com.viettel.coms.dto.RpConstructionDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;
import com.viettel.coms.dto.couponExportDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

@Repository("rpQuantityDAO")
public class RpQuantityDAO extends BaseFWDAOImpl<WorkItemBO, Long>  {

	@Autowired
    private QuantityConstructionDAO quantityConstructionDAO;
	
	public RpQuantityDAO() {
        this.model = new WorkItemBO();
    }

    public RpQuantityDAO(Session session) {
        this.session = session;
    }
	
	public List<WorkItemDetailDTO> doSearchQuantity(WorkItemDetailDTO obj, List<String> groupIdList) {
//       	StringBuilder sql = new StringBuilder(
////				hungnx 20180703 start
//				"select * from (" + quantityConstructionDAO.buildQuerySumByMonth(obj) + " SELECT DISTINCT "
//						+ " ctd.CREATED_DATE dateComplete," + " a.COMPLETE_DATE completeDate,"
//						+ " a.PERFORMER_ID performerId," + " sysu.FULL_NAME performerName,"
//						+ " (SELECT name FROM sys_group SYS WHERE sys.SYS_GROUP_ID=b.SYS_GROUP_ID) constructorName,b.SYS_GROUP_ID sysGroupIdSMS,"
//						+ " cat.CODE catstationCode, " + "b.CODE constructionCode, " + " a.NAME name, "
//						+ " (SELECT sum(cc.quantity) FROM CONSTRUCTION_TASK_DAILY cc where to_char(cc.created_date, 'dd/MM/yyyy') = ctd.CREATED_DATE and cc.work_item_id = ctd.work_item_id and cc.confirm = 1)/1000000 quantity,"
//						+ " (select 1 from dual) quantityByDate," + "a.STATUS status, " + " '' cntContractCode, "
//						+ " catPro.CODE catProvinceCode,  "
//						+ " a.WORK_ITEM_ID workItemId, " + "b.CONSTRUCTION_ID constructionId, "
//						+ "b.status statusConstruction, " + "b.approve_complete_value  approveCompleteValue , "
//						+ "catPro.CAT_PROVINCE_ID catProvinceId, " + "b.price price, "
//						+ " b.OBSTRUCTED_STATE obstructedState , "
//						+ "b.approve_complete_date  approveCompleteDate  "
//						+ " FROM  " + "WORK_ITEM a " + " LEFT JOIN SYS_USER sysu on sysu.SYS_USER_ID = a.PERFORMER_ID "
//						+ " JOIN CONSTRUCTION b  on A.CONSTRUCTION_ID = B.CONSTRUCTION_ID"
//						+ " JOIN tblTaskDaily ctd on CTD.WORK_ITEM_ID = A.WORK_ITEM_ID "
//						+ "LEFT JOIN CAT_STATION cat ON b.CAT_STATION_ID =cat.CAT_STATION_ID "
//						+ " left join cat_province catPro on catPro.CAT_PROVINCE_ID = cat.CAT_PROVINCE_ID " + " UNION"
//						+ " SELECT DISTINCT CASE "
//						+ " WHEN a.STATUS= 3 " + "THEN TO_CHAR(a.complete_date,'dd/MM/yyyy') " + "WHEN a.STATUS=2 "
//						+ "THEN TO_CHAR(b.complete_date,'dd/MM/yyyy') " + "END dateComplete, "
//						+ " a.COMPLETE_DATE completeDate," + " a.PERFORMER_ID performerId,"
//						+ " sysu.FULL_NAME performerName,"
//						+ "(SELECT name FROM sys_group SYS WHERE sys.SYS_GROUP_ID=b.SYS_GROUP_ID) constructorName,b.SYS_GROUP_ID sysGroupIdSMS,"
//						+ "cat.CODE catstationCode, " + "b.CODE constructionCode, " + " a.NAME name, "
//						+ "a.QUANTITY/1000000 quantity, " + " (select 0 from dual) quantityByDate,"
//						+ "a.STATUS status, " + " '' cntContractCode, " 
//						+ "catPro.CODE catProvinceCode, "
//						+ " a.WORK_ITEM_ID workItemId, " + "b.CONSTRUCTION_ID constructionId, "
//						+ "b.status statusConstruction, " + "b.approve_complete_value  approveCompleteValue , "
//						+ "catPro.CAT_PROVINCE_ID catProvinceId, "
//						+ "b.price price, "
//						+ " b.OBSTRUCTED_STATE obstructedState , "
//						+ "b.approve_complete_date  approveCompleteDate  "
//
//						+ " FROM  " + "WORK_ITEM a " + " LEFT JOIN SYS_USER sysu on sysu.SYS_USER_ID = a.PERFORMER_ID "
//						+ " JOIN CONSTRUCTION b  on A.CONSTRUCTION_ID = B.CONSTRUCTION_ID "
//						+ "LEFT JOIN CAT_STATION cat ON b.CAT_STATION_ID =cat.CAT_STATION_ID "
//						+ " left join cat_province catPro on catPro.CAT_PROVINCE_ID = cat.CAT_PROVINCE_ID "
//						+ "WHERE 1=1 " + " AND (a.STATUS          = 3 " + "OR (a.STATUS           =2 "
//						+ "AND b.STATUS           =4 " + "AND b.OBSTRUCTED_STATE =2) " + " )"
//						+ " and not exists (SELECT CTD.WORK_ITEM_ID FROM CONSTRUCTION_TASK_DAILY ctd where CTD.WORK_ITEM_ID = A.WORK_ITEM_ID)");
//		if (obj.getDateFrom() != null) {
//			sql.append(
//					"AND trunc( CASE WHEN a.STATUS= 3 THEN a.complete_date  WHEN a.STATUS=2 THEN b.complete_date END ) >= :monthYearFrom ");
//		}
//		if (obj.getDateTo() != null) {
//			sql.append(
//					"AND trunc( CASE WHEN a.STATUS= 3 THEN a.complete_date  WHEN a.STATUS=2 THEN b.complete_date END ) <= :monthYearTo ");
//		}
//        sql.append(" ) a" + " where 1=1");
		StringBuilder sql = new StringBuilder("select to_char(starting_date,'dd/MM/yyyy') dateComplete,complete_date completeDate,performer_Id performerId,performer_Name performerName,sysGroupName constructorName, "
				+ " catstationCode, constructionCode,workItemName name,quantity,status,statusConstruction,cntContractCode,catProvinceCode,workItemId,catProvinceId,constructionId, "
				+ " approveCompleteValue,approveCompleteDate,price,quantityByDate,obstructedState,SYS_GROUP_ID sysGroupIdSMS,partnerName constructorName1 from rp_quantity where 1=1 ");
		if (obj.getDateFrom() != null) {
			sql.append(" and starting_date >= :monthYearFrom ");
		}
		if (obj.getDateTo() != null) {
			sql.append(" and starting_date <= :monthYearTo ");
		}
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (upper(cntContractCode) LIKE upper(:keySearch) OR  upper(constructionCode) LIKE upper(:keySearch) OR upper(catstationCode) LIKE upper(:keySearch) escape '&')");
        }
        if (obj.getSysGroupId() != null) {
            sql.append(" AND SYS_GROUP_ID  = :sysGroupId");
        }
        if (groupIdList != null && !groupIdList.isEmpty()) {
            sql.append(" and catProvinceId in :groupIdList ");
        }
        if (obj.getCatProvinceId() != null) {
            sql.append(" AND catProvinceId = :catProvinceId ");
        }
        sql.append(" ORDER BY starting_date DESC,sysGroupName");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        StringBuilder countDateComplete = new StringBuilder("SELECT DISTINCT dateComplete FROM (");
        countDateComplete.append(sql);
        countDateComplete.append(")");
        StringBuilder countCatstationCode = new StringBuilder("SELECT DISTINCT catstationCode FROM (");
        countCatstationCode.append(sql);
        countCatstationCode.append(")");
        SQLQuery queryStation = getSession().createSQLQuery(countCatstationCode.toString());
        StringBuilder countConstrCode = new StringBuilder("SELECT DISTINCT constructionCode FROM (");
        countConstrCode.append(sql);
        countConstrCode.append(")");
        SQLQuery queryConstr = getSession().createSQLQuery(countConstrCode.toString());
        StringBuilder sqlTotalQuantity = new StringBuilder("SELECT NVL(sum(quantity), 0) FROM (");
        sqlTotalQuantity.append(sql);
        sqlTotalQuantity.append(")");
        SQLQuery queryQuantity = getSession().createSQLQuery(sqlTotalQuantity.toString());
        SQLQuery queryDC = getSession().createSQLQuery(countDateComplete.toString());
//		hungnx 20180713 end
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        if (groupIdList != null && !groupIdList.isEmpty()) {
            query.setParameterList("groupIdList", groupIdList);
            queryCount.setParameterList("groupIdList", groupIdList);
            queryDC.setParameterList("groupIdList", groupIdList);
            queryStation.setParameterList("groupIdList", groupIdList);
            queryConstr.setParameterList("groupIdList", groupIdList);
            queryQuantity.setParameterList("groupIdList", groupIdList);
        }
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryDC.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryStation.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryConstr.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryQuantity.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }

        if (obj.getMonthList() != null && !obj.getMonthList().isEmpty()) {
            query.setParameterList("monthList", obj.getMonthList());
            queryCount.setParameterList("monthList", obj.getMonthList());
        }
        if (obj.getMonthYear() != null && !obj.getMonthYear().isEmpty()) {
            query.setParameter("monthYear", obj.getMonthYear());
            queryCount.setParameter("monthYear", obj.getMonthYear());
        }

        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
            queryDC.setParameter("sysGroupId", obj.getSysGroupId());
            queryStation.setParameter("sysGroupId", obj.getSysGroupId());
            queryConstr.setParameter("sysGroupId", obj.getSysGroupId());
            queryQuantity.setParameter("sysGroupId", obj.getSysGroupId());
        }
//		hungnx 20170703 start
        if (obj.getDateFrom() != null) {
            query.setParameter("monthYearFrom", obj.getDateFrom());
            queryCount.setParameter("monthYearFrom", obj.getDateFrom());
            queryConstr.setParameter("monthYearFrom", obj.getDateFrom());
            queryDC.setParameter("monthYearFrom", obj.getDateFrom());
            queryQuantity.setParameter("monthYearFrom", obj.getDateFrom());
            queryStation.setParameter("monthYearFrom", obj.getDateFrom());
        }
        if (obj.getDateTo() != null) {
            query.setParameter("monthYearTo", obj.getDateTo());
            queryCount.setParameter("monthYearTo", obj.getDateTo());
            queryConstr.setParameter("monthYearTo", obj.getDateTo());
            queryDC.setParameter("monthYearTo", obj.getDateTo());
            queryQuantity.setParameter("monthYearTo", obj.getDateTo());
            queryStation.setParameter("monthYearTo", obj.getDateTo());
        }
//		hungnx 20170703 end

        // tuannt_15/08/2018_start
        if (obj.getCatProvinceId() != null) {
            query.setParameter("catProvinceId", obj.getCatProvinceId());
            queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
            queryConstr.setParameter("catProvinceId", obj.getCatProvinceId());
            queryDC.setParameter("catProvinceId", obj.getCatProvinceId());
            queryQuantity.setParameter("catProvinceId", obj.getCatProvinceId());
            queryStation.setParameter("catProvinceId", obj.getCatProvinceId());
        }
        // tuannt_15/08/2018_start

        query.addScalar("dateComplete", new StringType());
        query.addScalar("completeDate", new DateType());
        query.addScalar("performerId", new LongType());
        query.addScalar("performerName", new StringType());
        query.addScalar("constructorName", new StringType());
        query.addScalar("catstationCode", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("status", new StringType());
        query.addScalar("statusConstruction", new StringType());
        query.addScalar("cntContractCode", new StringType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("constructionId", new LongType());

        query.addScalar("approveCompleteValue", new DoubleType());
        query.addScalar("approveCompleteDate", new DateType());
        query.addScalar("price", new DoubleType());
        query.addScalar("quantityByDate", new StringType());
        query.addScalar("obstructedState", new StringType());

        queryDC.addScalar("dateComplete", new StringType());
        queryStation.addScalar("catstationCode", new StringType());
        queryConstr.addScalar("constructionCode", new StringType());
//		hoanm1_20180724_start
        query.addScalar("sysGroupIdSMS", new LongType());
        query.addScalar("constructorName1", new StringType());
//		hoanm1_20180724_end
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

//		hungnx 20180628 start
        List<WorkItemDetailDTO> lst = query.list();

        if (lst.size() > 0) {
            int countDC = queryDC.list().size();
            int countStation = queryStation.list().size();
            int countConstr = queryConstr.list().size();
            lst.get(0).setCountDateComplete(countDC);
            lst.get(0).setCountCatstationCode(countStation);
            lst.get(0).setCountConstructionCode(countConstr);
            lst.get(0).setCountWorkItemName(((BigDecimal) queryCount.uniqueResult()).intValue());
            BigDecimal totalQuantity = (BigDecimal) queryQuantity.uniqueResult();
            lst.get(0).setTotalQuantity(totalQuantity.doubleValue());
        }
//		hungnx 20180713 end
        return lst;
    }
//	hungtd_20181217_start
	public List<RpConstructionDTO> doSearch(RpConstructionDTO obj) {
		StringBuilder sql = new StringBuilder("select T.ASSIGN_HANDOVER_ID asSignHadoverId,"
				+ " T.SYS_GROUP_NAME sysgroupname,"
				+ " T.CAT_PROVINCE_CODE Catprovincecode,"
				+ " T.CAT_STATION_HOUSE_CODE Catstattionhousecode,"
				+ " T.CNT_CONTRACT_CODE cntContractCodeBGMB,"
				+ " to_char(T.COMPANY_ASSIGN_DATE,'dd/MM/yyyy') Companyassigndate,"
				+ " trunc(SYSDATE) - trunc(T.COMPANY_ASSIGN_DATE) outOfdate, "
				+ " case when Out_of_date_received is not null then 1 else null end outofdatereceivedBGMB,"
				+ " T.DESCRIPTION description"
				+ " from ASSIGN_HANDOVER T WHERE 1=1 and Received_status = 1 and T.status !=0 ");
		
		/*hungtd_20180311_strat*/
		if (obj.getDateFrom() != null) {
			sql.append(" and trunc(T.COMPANY_ASSIGN_DATE) >= :monthYearFrom ");
		}
		if (obj.getDateTo() != null) {
			sql.append(" and trunc(T.COMPANY_ASSIGN_DATE) <= :monthYearTo ");
		}
		/*hungtd_20180311_end*/
		if (obj.getSysGroupId() != null) {
			sql.append(" AND SYS_GROUP_ID  = :sysGroupId ");
		}
		if (obj.getCatProvinceId() != null) {
			sql.append(" AND T.CAT_PROVINCE_ID=:catProvinceId ");
		}
		if (obj.getStationCode() != null) {
			sql.append(" AND (upper(T.CAT_STATION_HOUSE_CODE) LIKE upper(:stationCode) OR upper(T.CAT_STATION_HOUSE_CODE) LIKE upper(:stationCode) escape '&')");
		}
		if (obj.getCntContractCode() != null) {
			sql.append(" AND T.CNT_CONTRACT_CODE =:cntContractCode ");
		}
		if (obj.getReceivedStatus() != null) {
			sql.append(" AND (case when Out_of_date_received is not null then 1 else 0 end) =:receivedStatus ");
		}
		
		
		sql.append(" ORDER BY T.COMPANY_ASSIGN_DATE DESC,SYS_GROUP_NAME,CAT_PROVINCE_CODE ");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		if (obj.getDateFrom() != null) {
            query.setParameter("monthYearFrom", obj.getDateFrom());
            queryCount.setParameter("monthYearFrom", obj.getDateFrom());
            
        }
        if (obj.getDateTo() != null) {
            query.setParameter("monthYearTo", obj.getDateTo());
            queryCount.setParameter("monthYearTo", obj.getDateTo());
            
        }
		if (obj.getSysGroupId() != null) {
			query.setParameter("sysGroupId", obj.getSysGroupId());
			queryCount.setParameter("sysGroupId", obj.getSysGroupId());
		}
		if (obj.getReceivedStatus() != null) {
			query.setParameter("receivedStatus", obj.getReceivedStatus());
			queryCount.setParameter("receivedStatus", obj.getReceivedStatus());
		}
		if (obj.getCatProvinceId() != null) {
			query.setParameter("catProvinceId",obj.getCatProvinceId());
			queryCount.setParameter("catProvinceId",obj.getCatProvinceId());
		}

		if (obj.getStationCode() != null) {
			query.setParameter("stationCode", obj.getStationCode());
			queryCount.setParameter("stationCode", obj.getStationCode());
		}
		if (obj.getCntContractCode() != null) {
			query.setParameter("cntContractCode",obj.getCntContractCode());
			queryCount.setParameter("cntContractCode", obj.getCntContractCode());
		}
		
        query.addScalar("asSignHadoverId", new LongType());
		query.addScalar("sysgroupname", new StringType());
		query.addScalar("Catprovincecode", new StringType());
		query.addScalar("Catstattionhousecode", new StringType());
		query.addScalar("cntContractCodeBGMB", new StringType());
		query.addScalar("Companyassigndate", new StringType());
		query.addScalar("outOfdate", new LongType());
		query.addScalar("outofdatereceivedBGMB", new StringType());
		query.addScalar("description", new StringType());
		query.setResultTransformer(Transformers.aliasToBean(RpConstructionDTO.class));
		if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
		List ls = query.list();
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return ls;
	}
	//NHAN_BGMB
	public List<RpConstructionDTO> doSearchNHAN(RpConstructionDTO obj) {
		StringBuilder sql = new StringBuilder("select T.ASSIGN_HANDOVER_ID asSignHadoverId,"
				+ " T.SYS_GROUP_NAME sysgroupname,"
				+ " T.CAT_PROVINCE_CODE Catprovincecode,"
				+ " T.CAT_STATION_HOUSE_CODE Catstattionhousecode,"
				+ " T.CNT_CONTRACT_CODE cntContractCodeBGMB,"
				+ " TO_CHAR(greatest(nvl(Received_obstruct_date,sysdate-365),nvl(Received_goods_date,sysdate-365),nvl(Received_date,sysdate-365)),'dd/MM/yyyy') Companyassigndate,"
				+ " case when Station_type=2 then T.COLUMN_HEIGHT end HeightTM,"
				+ " case when Station_type=2 then T.NUMBER_CO end numberCoTM,"
				+ " case when Station_type=2 then T.HOUSE_TYPE_NAME end houseTypeNameTM,"
				+ " case when Station_type=1 then T.COLUMN_HEIGHT end HeightDD,"
				+ " case when Station_type=1 then T.NUMBER_CO end numberCoDD,"
				+ " case when Station_type=1 then T.HOUSE_TYPE_NAME end houseTypeNameDD,"
				+ " T.GROUNDING_TYPE_NAME groundingTypeName,"
				+ " T.DESCRIPTION description"
				+ " from ASSIGN_HANDOVER T WHERE 1=1 AND T.RECEIVED_STATUS!=1 ");
		
		if (obj.getDateFrom() != null) {
			sql.append(" and trunc(greatest(nvl(Received_obstruct_date,sysdate-365),nvl(Received_goods_date,sysdate-365),nvl(Received_date,sysdate-365))) >= :monthYearFrom ");
		}
		if (obj.getDateTo() != null) {
			sql.append(" and trunc(greatest(nvl(Received_obstruct_date,sysdate-365),nvl(Received_goods_date,sysdate-365),nvl(Received_date,sysdate-365))) <= :monthYearTo ");
		}
		if (obj.getSysGroupId() != null) {
			sql.append(" AND SYS_GROUP_ID  = :sysGroupId ");
		}
		if (obj.getCatProvinceId() != null) {
			sql.append(" AND T.CAT_PROVINCE_ID=:catProvinceId ");
		}
		if (obj.getStationCode() != null) {
			sql.append(" AND (upper(T.CAT_STATION_HOUSE_CODE) LIKE upper(:stationCode) OR upper(T.CAT_STATION_HOUSE_CODE) LIKE upper(:stationCode) escape '&')");
		}
		if (obj.getCntContractCode() != null) {
			sql.append(" AND T.CNT_CONTRACT_CODE =:cntContractCode ");
		}
		
		sql.append(" ORDER BY greatest(nvl(Received_obstruct_date,sysdate-365),nvl(Received_goods_date,sysdate-365),nvl(Received_date,sysdate-365)) DESC,SYS_GROUP_NAME,CAT_PROVINCE_CODE ");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		if (obj.getDateFrom() != null) {
            query.setParameter("monthYearFrom", obj.getDateFrom());
            queryCount.setParameter("monthYearFrom", obj.getDateFrom());
            
        }
        if (obj.getDateTo() != null) {
            query.setParameter("monthYearTo", obj.getDateTo());
            queryCount.setParameter("monthYearTo", obj.getDateTo());
            
        }
		if (obj.getSysGroupId() != null) {
			query.setParameter("sysGroupId", obj.getSysGroupId());
			queryCount.setParameter("sysGroupId", obj.getSysGroupId());
		}
		if (obj.getCatProvinceId() != null) {
			query.setParameter("catProvinceId",obj.getCatProvinceId());
			queryCount.setParameter("catProvinceId",obj.getCatProvinceId());
		}

		if (obj.getStationCode() != null) {
			query.setParameter("stationCode", obj.getStationCode());
			queryCount.setParameter("stationCode", obj.getStationCode());
		}
		if (obj.getCntContractCode() != null) {
			query.setParameter("cntContractCode",obj.getCntContractCode());
			queryCount.setParameter("cntContractCode", obj.getCntContractCode());
		}
		
		query.addScalar("sysgroupname", new StringType());
		query.addScalar("Catprovincecode", new StringType());
		query.addScalar("Catstattionhousecode", new StringType());
		query.addScalar("cntContractCodeBGMB", new StringType());
		query.addScalar("Companyassigndate", new StringType());
		query.addScalar("HeightTM", new LongType());
		query.addScalar("numberCoTM", new LongType());
		query.addScalar("houseTypeNameTM", new StringType());
		query.addScalar("HeightDD", new LongType());
		query.addScalar("numberCoDD", new LongType());
		query.addScalar("houseTypeNameDD", new StringType());
		query.addScalar("groundingTypeName", new StringType());
		query.addScalar("description", new StringType());		
		query.setResultTransformer(Transformers.aliasToBean(RpConstructionDTO.class));
		if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
		List ls = query.list();
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return ls;
	}
	//KC
		public List<RpConstructionDTO> doSearchKC(RpConstructionDTO obj) {
			StringBuilder sql = new StringBuilder("select T.ASSIGN_HANDOVER_ID asSignHadoverId,"
					+ " T.SYS_GROUP_NAME sysgroupname,"
					+ " T.CAT_PROVINCE_CODE Catprovincecode,"
					+ " T.CAT_STATION_HOUSE_CODE Catstattionhousecode,"
					+ " T.CNT_CONTRACT_CODE cntContractCodeBGMB,"
					+ " to_char(T.Received_date,'dd/MM/yyyy') Companyassigndate,"
					+ " trunc(SYSDATE) - trunc(T.Received_date) outOfdate, "
					+ " case when Out_of_date_start_date is not null then 1 end outofdatereceivedBGMB,"
					+ " T.DESCRIPTION description"
					+ " from ASSIGN_HANDOVER T WHERE 1=1 AND T.STARTING_DATE is null AND T.RECEIVED_DATE is not null");
			if (obj.getDateFrom() != null) {
				sql.append(" and Received_date >= :monthYearFrom ");
			}
			if (obj.getDateTo() != null) {
				sql.append(" and Received_date <= :monthYearTo ");
			}
			if (obj.getSysGroupId() != null) {
				sql.append(" AND SYS_GROUP_ID  = :sysGroupId ");
			}
			if (obj.getCatProvinceId() != null) {
				sql.append(" AND T.CAT_PROVINCE_ID=:catProvinceId ");
			}
			if (obj.getStationCode() != null) {
				sql.append(" AND (upper(T.CAT_STATION_HOUSE_CODE) LIKE upper(:stationCode) OR upper(T.CAT_STATION_HOUSE_CODE) LIKE upper(:stationCode) escape '&')");
			}
			if (obj.getCntContractCode() != null) {
				sql.append(" AND T.CNT_CONTRACT_CODE =:cntContractCode ");
			}
			sql.append(" ORDER BY Received_date DESC,SYS_GROUP_NAME,CAT_PROVINCE_CODE ");
			StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
			sqlCount.append(sql.toString());
			sqlCount.append(")");
			SQLQuery query = getSession().createSQLQuery(sql.toString());
			SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
			if (obj.getDateFrom() != null) {
	            query.setParameter("monthYearFrom", obj.getDateFrom());
	            queryCount.setParameter("monthYearFrom", obj.getDateFrom());
	            
	        }
	        if (obj.getDateTo() != null) {
	            query.setParameter("monthYearTo", obj.getDateTo());
	            queryCount.setParameter("monthYearTo", obj.getDateTo());
	            
	        }
			if (obj.getSysGroupId() != null) {
				query.setParameter("sysGroupId", obj.getSysGroupId());
				queryCount.setParameter("sysGroupId", obj.getSysGroupId());
			}
			if (obj.getCatProvinceId() != null) {
				query.setParameter("catProvinceId",obj.getCatProvinceId());
				queryCount.setParameter("catProvinceId",obj.getCatProvinceId());
			}

			if (obj.getStationCode() != null) {
				query.setParameter("stationCode", obj.getStationCode());
				queryCount.setParameter("stationCode", obj.getStationCode());
			}
			if (obj.getCntContractCode() != null) {
				query.setParameter("cntContractCode",obj.getCntContractCode());
				queryCount.setParameter("cntContractCode", obj.getCntContractCode());
			}
			query.addScalar("sysgroupname", new StringType());
			query.addScalar("Catprovincecode", new StringType());
			query.addScalar("Catstattionhousecode", new StringType());
			query.addScalar("cntContractCodeBGMB", new StringType());
			query.addScalar("Companyassigndate", new StringType());
			query.addScalar("outOfdate", new LongType());
			query.addScalar("outofdatereceivedBGMB", new StringType());
			query.addScalar("description", new StringType());
			query.setResultTransformer(Transformers.aliasToBean(RpConstructionDTO.class));
			if (obj.getPage() != null && obj.getPageSize() != null) {
				query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
				query.setMaxResults(obj.getPageSize().intValue());
			}
			List ls = query.list();
			obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
			return ls;
		}
		//TONTHICONG
		public List<RpConstructionDTO> doSearchTONTC(RpConstructionDTO obj) {
			StringBuilder sql = new StringBuilder("select T.RP_STATION_COMPLETE_ID spStationCompleteId,"
					+ " T.SYS_GROUP_NAME sysGroupCode,"
					+ " T.CAT_PROVINCE_CODE Catprovincecode,"
					+ " T.CAT_STATION_HOUSE_CODE Catstattionhousecode,"
					+ " T.Cnt_contract_code cntContractCodeBGMB,"
					+ " to_char(T.STARTING_DATE,'dd/MM/yyyy') companyassigndate,"
					+ " trunc(SYSDATE) -trunc(T.STARTING_DATE) outOfdate,"
					+ " case when Station_type =1 and (trunc(SYSDATE) -trunc(T.STARTING_DATE)-45) >0 then 1 "
					+ " when Station_type =2 and (trunc(SYSDATE) -trunc(T.STARTING_DATE)-30) >0 then 1 end outofdatereceivedBGMB, "
					+ " WORK_ITEM_OUTSTANDING workItemOutStanding,"
					+ " T.DESCRIPTION description"
					+ " from RP_STATION_COMPLETE T WHERE 1=1 AND T.Handover_date_build is not null AND Complete_date is null");
			
			if (obj.getSysGroupId() != null) {
				sql.append(" AND SYS_GROUP_ID  = :sysGroupId ");
			}
			if (obj.getCatProvinceId() != null) {
				sql.append(" AND T.CAT_PROVINCE_ID=:catProvinceId ");
			}
			if (obj.getStationCode() != null) {
				sql.append(" AND (upper(T.CAT_STATION_HOUSE_CODE) LIKE upper(:stationCode) OR upper(T.CAT_STATION_HOUSE_CODE) LIKE upper(:stationCode) escape '&')");
			}
			if (obj.getCntContractCode() != null) {
				sql.append(" AND T.CNT_CONTRACT_CODE =:cntContractCode ");
			}
			if (obj.getReceivedStatus() != null) {
				sql.append(" AND (case when Construction_state =1 then 1 else 0 end) =:receivedStatus ");
			}
			
			sql.append(" ORDER BY SYS_GROUP_CODE,CAT_PROVINCE_CODE,CAT_STATION_HOUSE_CODE,Cnt_contract_code ");
			StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
			sqlCount.append(sql.toString());
			sqlCount.append(")");
			SQLQuery query = getSession().createSQLQuery(sql.toString());
			SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
			
			if (obj.getSysGroupId() != null) {
				query.setParameter("sysGroupId", obj.getSysGroupId());
				queryCount.setParameter("sysGroupId", obj.getSysGroupId());
			}
			if (obj.getCatProvinceId() != null) {
				query.setParameter("catProvinceId",obj.getCatProvinceId());
				queryCount.setParameter("catProvinceId",obj.getCatProvinceId());
			}

			if (obj.getStationCode() != null) {
				query.setParameter("stationCode", obj.getStationCode());
				queryCount.setParameter("stationCode", obj.getStationCode());
			}
			if (obj.getCntContractCode() != null) {
				query.setParameter("cntContractCode",obj.getCntContractCode());
				queryCount.setParameter("cntContractCode", obj.getCntContractCode());
			}
			if (obj.getReceivedStatus() != null) {
				query.setParameter("receivedStatus", obj.getReceivedStatus());
				queryCount.setParameter("receivedStatus", obj.getReceivedStatus());
			}

			query.addScalar("sysGroupCode", new StringType());
			query.addScalar("Catprovincecode", new StringType());
			query.addScalar("Catstattionhousecode", new StringType());
			query.addScalar("cntContractCodeBGMB", new StringType());
			query.addScalar("companyassigndate", new StringType());
			query.addScalar("outOfdate", new LongType());
			query.addScalar("outofdatereceivedBGMB", new StringType());
			query.addScalar("workItemOutStanding", new StringType());
			query.addScalar("description", new StringType());
			query.setResultTransformer(Transformers.aliasToBean(RpConstructionDTO.class));
			if (obj.getPage() != null && obj.getPageSize() != null) {
				query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
				query.setMaxResults(obj.getPageSize().intValue());
			}
			List ls = query.list();
			obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
			return ls;
		}
//		HSHC
		public List<RpConstructionDTO> doSearchHSHC(RpConstructionDTO obj) {
			StringBuilder sql = new StringBuilder("select T.RP_STATION_COMPLETE_ID spStationCompleteId,"
					+ " T.SYS_GROUP_NAME sysGroupCode,"
					+ " T.CAT_PROVINCE_CODE Catprovincecode,"
					+ " T.CAT_STATION_HOUSE_CODE Catstattionhousecode,"
					+ " T.CNT_CONTRACT_CODE cntContractCodeBGMB,"
					+ " to_char(T.COMPLETE_DATE,'dd/MM/yyyy') companyassigndate,"
					+ " to_char(T.Approved_complete_date,'dd/MM/yyyy') approvedCompleteDate,"
					+ " completion_record_state completionRecordState, Total_value totalQuantity,"
					+ " T.DESCRIPTION description"
					+ " from RP_STATION_COMPLETE T WHERE 1=1 AND Complete_completion_record is null ");
			if (obj.getDateFrom() != null) {
				sql.append(" and trunc(Complete_date ) >= :monthYearFrom ");
			}
			if (obj.getDateTo() != null) {
				sql.append(" and trunc(Complete_date ) <= :monthYearTo ");
			}
			if (obj.getSysGroupId() != null) {
				sql.append(" AND SYS_GROUP_ID  = :sysGroupId ");
			}
			if (obj.getCatProvinceId() != null) {
				sql.append(" AND T.CAT_PROVINCE_ID=:catProvinceId ");
			}
			if (obj.getStationCode() != null) {
				sql.append(" AND (upper(T.CAT_STATION_HOUSE_CODE) LIKE upper(:stationCode) OR upper(T.CAT_STATION_HOUSE_CODE) LIKE upper(:stationCode) escape '&')");
			}
			if (obj.getCntContractCode() != null) {
				sql.append(" AND T.CNT_CONTRACT_CODE =:cntContractCode ");
			}
			if (obj.getReceivedStatus() != null) {
				sql.append(" AND nvl(completion_record_state,0) =:receivedStatus ");
			}
			
			sql.append(" ORDER BY T.COMPLETE_DATE DESC,SYS_GROUP_NAME,CAT_PROVINCE_CODE ");
			StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
			sqlCount.append(sql.toString());
			sqlCount.append(")");
			SQLQuery query = getSession().createSQLQuery(sql.toString());
			SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
			
			if (obj.getDateFrom() != null) {
	            query.setParameter("monthYearFrom", obj.getDateFrom());
	            queryCount.setParameter("monthYearFrom", obj.getDateFrom());
	            
	        }
	        if (obj.getDateTo() != null) {
	            query.setParameter("monthYearTo", obj.getDateTo());
	            queryCount.setParameter("monthYearTo", obj.getDateTo());
	            
	        }
			if (obj.getSysGroupId() != null) {
				query.setParameter("sysGroupId", obj.getSysGroupId());
				queryCount.setParameter("sysGroupId", obj.getSysGroupId());
			}
			if (obj.getCatProvinceId() != null) {
				query.setParameter("catProvinceId",obj.getCatProvinceId());
				queryCount.setParameter("catProvinceId",obj.getCatProvinceId());
			}

			if (obj.getStationCode() != null) {
				query.setParameter("stationCode", obj.getStationCode());
				queryCount.setParameter("stationCode", obj.getStationCode());
			}
			if (obj.getCntContractCode() != null) {
				query.setParameter("cntContractCode",obj.getCntContractCode());
				queryCount.setParameter("cntContractCode", obj.getCntContractCode());
			}
			if (obj.getReceivedStatus() != null) {
				query.setParameter("receivedStatus", obj.getReceivedStatus());
				queryCount.setParameter("receivedStatus", obj.getReceivedStatus());
			}

			query.addScalar("sysGroupCode", new StringType());
			query.addScalar("Catprovincecode", new StringType());
			query.addScalar("Catstattionhousecode", new StringType());
			query.addScalar("cntContractCodeBGMB", new StringType());
			query.addScalar("companyassigndate", new StringType());
			query.addScalar("approvedCompleteDate", new StringType());
			query.addScalar("completionRecordState", new LongType());
			query.addScalar("totalQuantity", new DoubleType());
			query.addScalar("description", new StringType());
			
			query.setResultTransformer(Transformers.aliasToBean(RpConstructionDTO.class));
			if (obj.getPage() != null && obj.getPageSize() != null) {
				query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
				query.setMaxResults(obj.getPageSize().intValue());
			}
			
			List ls = query.list();
			obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
			return ls;
		}
//	hungtd_20181217_end
		
//		hungtd_20192101_start
		public List<couponExportDTO> doSearchCoupon(couponExportDTO obj) {
			StringBuilder sql = new StringBuilder("SELECT distinct s.STOCK_CODE stockCode,"
					+ " s.CODE code,"
					+ " s.REAL_IE_TRANS_DATE realIeTransDate,"
					+ " s.CONSTRUCTION_CODE constructionCode,"
					+ " nvl(s.CONFIRM,0) comfirm,"
					+ " sg.NAME name,"
					+ " sg.SYS_GROUP_ID sysGroupId,"
					+ " su.LOGIN_NAME loginName,"
					+ " su.EMPLOYEE_CODE employeeCode,"
					+ " su.FULL_NAME fullName,"
					+ " su.EMAIL email,"
					+ " h.CODE codeParam,"
					+ " (sysdate  - cast(s.REAL_IE_TRANS_DATE as date)) realDate,"
					+ " su.PHONE_NUMBER phoneNumber,"
//					+ " b.CODE cntContractCode,"
					+ " a.CODE catStationCode, case when nvl(s.CONFIRM,0)=0 then 'Chờ phê duyệt' when nvl(s.CONFIRM,0)=1 then 'Đã phê duyệt' when nvl(s.CONFIRM,0)=2 then 'Đã từ chối' end comfirmExcel "
					+ " FROM SYN_STOCK_TRANS s,SYS_GROUP sg,APP_PARAM h,SYS_USER su,CONSTRUCTION c,CAT_STATION a,"
					+ " (select distinct a.CONSTRUCTION_ID,b.code from CNT_CONSTR_WORK_ITEM_TASK a,CNT_CONTRACT b where a.CNT_CONTRACT_id = b.CNT_CONTRACT_id and\r\n" + 
					"  a.status !=0 and b.status !=0 and b.contract_type=0)b"
					
					+ " WHERE s.type= 2 AND s.BUSSINESS_TYPE in(1,2) AND s.CONSTRUCTION_ID=c.CONSTRUCTION_ID(+) AND c.SYS_GROUP_ID= sg.SYS_GROUP_ID(+) AND s.LAST_SHIPPER_ID= su.SYS_USER_ID(+) AND c.CONSTRUCTION_ID=b.CONSTRUCTION_ID(+) AND c.CAT_STATION_ID=a.CAT_STATION_ID(+) AND h.PAR_TYPE ='NUMBER_RECEIVE' AND (sysdate  - cast(s.REAL_IE_TRANS_DATE as date)) > cast(h.CODE as int)");
			if (obj.getDateFrom() != null) {
				sql.append(" and REAL_IE_TRANS_DATE >= :monthYearFrom ");
			}
			if (obj.getDateTo() != null) {
				sql.append(" and REAL_IE_TRANS_DATE <= :monthYearTo ");
			}
			if (obj.getEmployeeCode() != null) {
				sql.append(" AND su.EMPLOYEE_CODE =:employeeCode ");
			}
			if (StringUtils.isNotEmpty(obj.getKeySearch())) {
				sql.append(" AND (upper(s.CONSTRUCTION_CODE) LIKE upper(:keySearch) or upper(A.CODE) LIKE upper(:keySearch) or upper(B.CODE) LIKE upper(:keySearch) escape '&') ");
			}
			if (obj.getName() != null) {
				sql.append(" AND (upper(sg.NAME) LIKE upper(:name) escape '&')");
			}
			if (obj.getEmail() != null) {
				sql.append(" AND (upper(su.EMAIL) LIKE upper(:email) escape '&')");
			}
			if (obj.getSysGroupId() != null) {
				sql.append(" AND sg.SYS_GROUP_ID =:sysGroupId ");
			}
//			hoanm1_20190214_start
			if (obj.getListConfirm() != null && obj.getListConfirm().size() > 0) {
		        sql.append(" AND nvl(S.CONFIRM,0) in :lstConfirm ");
		    }
//			hoanm1_20190214_end
			sql.append(" ORDER BY s.CODE DESC");
			StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
			sqlCount.append(sql.toString());
			sqlCount.append(")");
			SQLQuery query = getSession().createSQLQuery(sql.toString());
			SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
			
			query.addScalar("stockCode", new StringType());
			query.addScalar("code", new StringType());
			query.addScalar("codeParam", new StringType());
			query.addScalar("comfirm", new StringType());
			query.addScalar("realDate", new StringType());
			query.addScalar("catStationCode", new StringType());
//			query.addScalar("cntContractCode", new StringType());
			query.addScalar("realIeTransDate", new DateType());
			query.addScalar("constructionCode", new StringType());
			query.addScalar("name", new StringType());
			query.addScalar("email", new StringType());
			query.addScalar("fullName", new StringType());
			query.addScalar("sysGroupId", new LongType());
			query.addScalar("phoneNumber", new StringType());
			query.addScalar("employeeCode", new StringType());
			query.addScalar("comfirmExcel", new StringType());
			
			
			if (obj.getSysGroupId() != null) {
				query.setParameter("sysGroupId", obj.getSysGroupId());
				queryCount.setParameter("sysGroupId", obj.getSysGroupId());
			}
			if (obj.getEmail() != null) {
				query.setParameter("email", obj.getEmail());
				queryCount.setParameter("email", obj.getEmail());
			}
			if (obj.getDateFrom() != null) {
	            query.setParameter("monthYearFrom", obj.getDateFrom());
	            queryCount.setParameter("monthYearFrom", obj.getDateFrom());
	            
	        }
	        if (obj.getDateTo() != null) {
	            query.setParameter("monthYearTo", obj.getDateTo());
	            queryCount.setParameter("monthYearTo", obj.getDateTo());
	            
	        }

			if (StringUtils.isNotEmpty(obj.getKeySearch())) {
	            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
	            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
	        }
			if (obj.getEmployeeCode() != null) {
				query.setParameter("employeeCode", obj.getEmployeeCode());
				queryCount.setParameter("employeeCode", obj.getEmployeeCode());
			}
			if (StringUtils.isNotEmpty(obj.getName())) {
	            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
	            queryCount.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
	        }
//			hoanm1_20190214_start
			if (obj.getListConfirm() != null && obj.getListConfirm().size() > 0) {
	            query.setParameterList("lstConfirm", obj.getListConfirm());
	            queryCount.setParameterList("lstConfirm", obj.getListConfirm());
	        }
//			hoanm1_20190214_end
			query.setResultTransformer(Transformers.aliasToBean(couponExportDTO.class));
			if (obj.getPage() != null && obj.getPageSize() != null) {
				query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
				query.setMaxResults(obj.getPageSize().intValue());
			}
			
			List ls = query.list();
			obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
			return ls;
		}
		public List<couponExportDTO> doSearchPopup(couponExportDTO obj) {
			StringBuilder sql = new StringBuilder("SELECT H.SYS_USER_ID sysUserId,"
					+ " H.LOGIN_NAME loginName,"
					+ " H.EMPLOYEE_CODE employeeCode,"
					+ " H.EMAIL email,"
					+ " H.PHONE_NUMBER phoneNumber,"
					+ " H.FULL_NAME fullName"
					+ " FROM SYS_USER H"
					+ " WHERE 1=1 AND H.STATUS=1");
			
			if (StringUtils.isNotEmpty(obj.getEmail())) {
				sql.append(" AND (upper(H.EMPLOYEE_CODE) LIKE upper(:email) escape '&')");
				sql.append(" or (upper(H.EMAIL) LIKE upper(:email) escape '&')");
				sql.append(" or (upper(H.FULL_NAME) LIKE upper(:email) escape '&')");
			}
			if (StringUtils.isNotEmpty(obj.getEmployeeCode())) {
				sql.append(" AND (upper(H.EMPLOYEE_CODE) LIKE upper(:employeeCode) escape '&')");
				sql.append(" or (upper(H.FULL_NAME) LIKE upper(:employeeCode) escape '&')");
			}
			
				
			
			
			sql.append(" ORDER BY H.SYS_USER_ID ASC");
			StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
			sqlCount.append(sql.toString());
			sqlCount.append(")");
			SQLQuery query = getSession().createSQLQuery(sql.toString());
			SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
			
			query.addScalar("employeeCode", new StringType());
			query.addScalar("loginName", new StringType());
			query.addScalar("email", new StringType());
			query.addScalar("fullName", new StringType());
			query.addScalar("phoneNumber", new StringType());
			query.addScalar("sysUserId", new LongType());
//			query.addScalar("status", new StringType());
			
			if (StringUtils.isNotEmpty(obj.getEmployeeCode())) {
	            query.setParameter("employeeCode", "%" + ValidateUtils.validateKeySearch(obj.getEmployeeCode()) + "%");
	            queryCount.setParameter("employeeCode", "%" + ValidateUtils.validateKeySearch(obj.getEmployeeCode()) + "%");
	        }
			
			if (StringUtils.isNotEmpty(obj.getFullName())) {
	            query.setParameter("fullName", "%" + ValidateUtils.validateKeySearch(obj.getFullName()) + "%");
	            queryCount.setParameter("fullName", "%" + ValidateUtils.validateKeySearch(obj.getFullName()) + "%");
	        }
			if (StringUtils.isNotEmpty(obj.getEmail())) {
	            query.setParameter("email", "%" + ValidateUtils.validateKeySearch(obj.getEmail()) + "%");
	            queryCount.setParameter("email", "%" + ValidateUtils.validateKeySearch(obj.getEmail()) + "%");
	        }
			if (obj.getSysUserId() != null) {
				query.setParameter("sysUserId", obj.getSysUserId());
				queryCount.setParameter("sysUserId", obj.getSysUserId());
			}
			if (obj.getLoginName() != null) {
				query.setParameter("loginName", obj.getLoginName());
				queryCount.setParameter("loginName", obj.getLoginName());
			}
			
			query.setResultTransformer(Transformers.aliasToBean(couponExportDTO.class));
			if (obj.getPage() != null && obj.getPageSize() != null) {
				query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
				query.setMaxResults(obj.getPageSize().intValue());
			}
			
			List ls = query.list();
			obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
			return ls;
		}
//		hungtd_20192101_end
}
