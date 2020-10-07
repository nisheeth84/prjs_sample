package com.viettel.coms.dao;

import com.viettel.coms.bo.RpHSHCBO;
import com.viettel.coms.dto.ConstructionTaskDetailDTO;
import com.viettel.coms.dto.RpHSHCDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

//VietNT_20181130_start
@Repository("rpConstructionHSHCDAO")
public class RpConstructionHSHCDAO extends BaseFWDAOImpl<RpHSHCBO, Long> {

    public RpConstructionHSHCDAO() {
        this.model = new RpHSHCBO();
    }

    public RpConstructionHSHCDAO(Session session) {
        this.session = session;

    }

    public List<RpHSHCDTO> doSearchHSHCForImport(ConstructionTaskDetailDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT " +
                "RP_HSHC_ID hshcId, " +
                "DATECOMPLETE dateComplete, " +
                "SYSGROUPID sysGroupId, " +
                "SYSGROUPNAME sysGroupName, " +
                "CATSTATIONCODE catStationCode, " +
                "CONSTRUCTIONCODE constructionCode, " +
                "RECEIVERECORDSDATE receiveRecordsDate, " +
                "CNTCONTRACTCODE cntContractCode, " +
//                "COMPLETEVALUE completeValue, " +
                "WORKITEMCODE workItemCode, " +
                "STATUS status, " +
                "CATPROVINCEID catProvinceId, " +
                "CATPROVINCECODE catProvinceCode, " +
                "PERFORMERNAME performerName, " +
                "SUPERVISORNAME supervisorName, " +
                "DIRECTORNAME directorName, " +
                "STARTDATE startDate, " +
                "ENDDATE endDate, " +
                "DESCRIPTION description, " +
                "CONSTRUCTIONID constructionId, " +
                "INSERT_TIME insertTime, " +
                "PROCESS_DATE processDate, " +
                "COMPLETESTATE completeState, " +
                "COMPLETE_UPDATE_DATE completeUpdateDate, " +
                "COMPLETE_USER_UPDATE completeUserUpdate, " +
                "COMPLETEVALUE_PLAN completeValuePlan, " +
                " round(case when COMPLETEVALUE is null or COMPLETEVALUE=0 then COMPLETEVALUE_PLAN/1000000 else COMPLETEVALUE/1000000 end,2) completeValue " +
                " ,CATSTATIONHOUSECODE catStationHouseCode " +
                "FROM RP_HSHC " +
                "WHERE COMPLETESTATE = 1 ");

        if (null != criteria.getKeySearch()) {
            sql.append("AND (upper(CATSTATIONCODE) LIKE upper(:keySearch) " +
                    "OR upper(CONSTRUCTIONCODE) LIKE upper(:keySearch) " +
                    "OR upper(CNTCONTRACTCODE) LIKE upper(:keySearch) escape '&') ");
        }
        if (null != criteria.getCatProvinceCode()) {
            sql.append("AND upper(CATPROVINCECODE) LIKE upper(:province) ");
        }
        if (null != criteria.getMonthYear()) {
//            sql.append("AND TRUNC(DATECOMPLETE) >= :searchDate ");
            sql.append(" AND EXTRACT(MONTH FROM TO_DATE(dateComplete, 'DD-MON-RR')) = :month ");
            sql.append(" AND EXTRACT(YEAR FROM TO_DATE(dateComplete, 'DD-MON-RR')) = :year ");
        }
        if (null != criteria.getSysGroupId()) {
            sql.append("AND SYSGROUPID LIKE :groupId");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (null != criteria.getKeySearch()) {
        	query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
//            query.setParameter("keySearch", criteria.getKeySearch());
        }
        if (null != criteria.getCatProvinceCode()) {
            query.setParameter("province", criteria.getCatProvinceCode());
        }
        if (null != criteria.getMonthYear()) {
//            Calendar c = new GregorianCalendar();
//            c.setTime(criteria.getMonthYear());
//            c.set(Calendar.DAY_OF_MONTH, 1);
//            c.set(Calendar.HOUR_OF_DAY, 0);
//            c.set(Calendar.MINUTE, 0);
//            c.set(Calendar.SECOND, 0);
//            query.setParameter("searchDate", c);
        	 LocalDate localDate = criteria.getMonthYear().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
             int month = localDate.getMonthValue();
             int year = localDate.getYear();
             query.setParameter("month", month);
             query.setParameter("year", year);
        }
        if (null != criteria.getSysGroupId()) {
            query.setParameter("groupId", criteria.getSysGroupId());
        }

        query.addScalar("hshcId", new LongType());
        query.addScalar("dateComplete", new DateType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("receiveRecordsDate", new DateType());
        query.addScalar("cntContractCode", new StringType());
        query.addScalar("completeValue", new LongType());
        query.addScalar("workItemCode", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("supervisorName", new StringType());
        query.addScalar("directorName", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("description", new StringType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("insertTime", new DateType());
        query.addScalar("processDate", new StringType());
        query.addScalar("completeState", new LongType());
        query.addScalar("completeUpdateDate", new DateType());
        query.addScalar("completeUserUpdate", new LongType());
        query.addScalar("completeValuePlan", new LongType());
        query.addScalar("completeValue", new LongType());
//        hoanm1_20181219_start
        query.addScalar("catStationHouseCode", new StringType());
//        hoanm1_20181219_end
        query.setResultTransformer(Transformers.aliasToBean(RpHSHCDTO.class));

        return query.list();
    }

    public long sumCompleteValueByConsCode(String code) {
        StringBuilder sql = new StringBuilder("SELECT nvl(SUM(COMPLETEVALUE),0) " +
                "FROM RP_HSHC " +
                "WHERE completestate = 2 and upper(CONSTRUCTIONCODE) = upper(:code)");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("code", code);

        return ((BigDecimal) query.uniqueResult()).longValue();
    }
}
//VietNT_end
