package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOMonthPlanBO;
import com.viettel.aio.dto.AIOMonthPlanDTO;
import com.viettel.aio.dto.AIOMonthPlanDetailDTO;
import com.viettel.aio.dto.report.AIOReportDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.utils.ValidateUtils;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.utils.DateTimeUtils;
import fr.opensagres.xdocreport.utils.StringUtils;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@EnableTransactionManagement
@Transactional
@Repository("aioMonthPlanDAO")
public class AIOMonthPlanDAO extends BaseFWDAOImpl<AIOMonthPlanBO, Long> {

    public AIOMonthPlanDAO() {
        this.model = new AIOMonthPlanBO();
    }

    public AIOMonthPlanDAO(Session session) {
        this.session = session;
    }

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    @SuppressWarnings("unchecked")
    public List<AIOMonthPlanDTO> doSearch(AIOMonthPlanDTO obj) {
        StringBuilder sql = new StringBuilder("select mp.AIO_MONTH_PLAN_ID aioMonthPlanId, " +
                " mp.DESCRIPTION description, " +
                " mp.MONTH month, " +
                " mp.STATUS status, " +
                " mp.YEAR year " +
                " from AIO_MONTH_PLAN mp" +
                " WHERE 1=1 ");
        if (StringUtils.isNotEmpty(obj.getStatus())) {
            sql.append(" AND mp.STATUS=:status ");
        }
        if (StringUtils.isNotEmpty(obj.getMonth())) {
            sql.append(" AND mp.MONTH=:month ");
        }
        if (StringUtils.isNotEmpty(obj.getYear())) {
            sql.append(" AND mp.YEAR=:year ");
        }
        sql.append(" ORDER BY mp.AIO_MONTH_PLAN_ID DESC ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        query.addScalar("aioMonthPlanId", new LongType());
        query.addScalar("description", new StringType());
        query.addScalar("month", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("year", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AIOMonthPlanDTO.class));

        if (StringUtils.isNotEmpty(obj.getStatus())) {
            query.setParameter("status", obj.getStatus());
            queryCount.setParameter("status", obj.getStatus());
        }
        if (StringUtils.isNotEmpty(obj.getMonth())) {
            query.setParameter("month", obj.getMonth());
            queryCount.setParameter("month", obj.getMonth());
        }
        if (StringUtils.isNotEmpty(obj.getYear())) {
            query.setParameter("year", obj.getYear());
            queryCount.setParameter("year", obj.getYear());
        }

        this.setPageSize(obj, query, queryCount);

        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<AIOMonthPlanDetailDTO> getAllSysGroup() {
        StringBuilder sql = new StringBuilder("select sys_group_id sysGroupId,"
                + " code sysGroupCode,"
                + " name sysGroupName "
                + " from CTCT_CAT_OWNER.SYS_GROUP "
                + " where status=1 and GROUP_LEVEL in (1,2) "
                + " order by sys_group_id asc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupCode", new StringType());
        query.addScalar("sysGroupName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AIOMonthPlanDetailDTO.class));

        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<AIOMonthPlanDetailDTO> getAllDomainData() {
        StringBuilder sql = new StringBuilder("SELECT sg.SYS_GROUP_ID sysGroupId, " +
                "sg.code sysGroupCode, " +
                "sg.name sysGroupName " +
                "FROM CTCT_CAT_OWNER.SYS_GROUP sg " +
                "left join CTCT_VPS_OWNER.DOMAIN_DATA dd " +
                "on sg.SYS_GROUP_ID=dd.DATA_ID " +
                "left join CTCT_VPS_OWNER.DOMAIN_TYPE dt " +
                "on dd.DOMAIN_TYPE_ID = dt.DOMAIN_TYPE_ID " +
                "where dt.code='KTTS_LIST_AREA'");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupCode", new StringType());
        query.addScalar("sysGroupName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AIOMonthPlanDetailDTO.class));

        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<AIOMonthPlanDetailDTO> getDetailByMonthPlanId(AIOMonthPlanDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT ");
        sql.append("mpd.AIO_MONTH_PLAN_DETAIL_ID aioMonthPlanDetailId, ")
                .append("mpd.AREA_CODE areaCode, ")
                .append("mpd.MONTH_PLAN_ID monthPlanId, ")
                .append("mpd.SYS_GROUP_CODE sysGroupCode, ")
                .append("mpd.SYS_GROUP_ID sysGroupId, ")
                .append("mpd.SYS_GROUP_NAME sysGroupName, ")
                .append("mpd.TARGETS_AMOUNT targetsAmount ")
                .append(",mpd.TARGETS_AMOUNT_DV targetsAmountDv ")
                //tatph-start-25/12/2019
                .append(",mpd.TARGETS_ME targetsMe ")
                .append(",mpd.TARGETS_SH targetsSh ")
                .append(",mpd.TARGETS_NLMT targetsNlmt ")
                .append(",mpd.TARGETS_ICT targetsIct ")
                .append(",mpd.TARGETS_MS targetsMs ")
                //tatph-end-25/12/2019
                .append("From AIO_MONTH_PLAN_DETAIL mpd ")
                .append("left join AIO_MONTH_PLAN mp on mp.AIO_MONTH_PLAN_ID = mpd.MONTH_PLAN_ID ")
                .append("where mpd.MONTH_PLAN_ID=:id and mp.status='1' ")
                .append("order by mpd.AIO_MONTH_PLAN_DETAIL_ID ASC ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        query.addScalar("aioMonthPlanDetailId", new LongType());
        query.addScalar("areaCode", new StringType());
        query.addScalar("monthPlanId", new LongType());
        query.addScalar("sysGroupCode", new StringType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("targetsAmount", new LongType());
        query.addScalar("targetsAmountDv", new LongType());

        //tatph-start-25/12/2019
        query.addScalar("targetsMe", new LongType());
        query.addScalar("targetsSh", new LongType());
        query.addScalar("targetsNlmt", new LongType());
        query.addScalar("targetsIct", new LongType());
        query.addScalar("targetsMs", new LongType());
        //tatph-end-25/12/2019

        query.setResultTransformer(Transformers.aliasToBean(AIOMonthPlanDetailDTO.class));

        query.setParameter("id", obj.getAioMonthPlanId());
        queryCount.setParameter("id", obj.getAioMonthPlanId());

        this.setPageSize(obj, query, queryCount);

        return query.list();
    }

    public void deleteMonthPlanDetail(Long id) {
        StringBuilder sql = new StringBuilder("DELETE FROM AIO_MONTH_PLAN_DETAIL where MONTH_PLAN_ID=:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.executeUpdate();
    }

    @SuppressWarnings("unchecked")
    public List<AIOMonthPlanDetailDTO> getAllSysGroupByName(AIOMonthPlanDetailDTO obj) {
        StringBuilder sql = new StringBuilder("select sys_group_id sysGroupId,code sysGroupCode,"
                + " name sysGroupName "
                + " from CTCT_CAT_OWNER.SYS_GROUP "
                + " where status=1 and GROUP_LEVEL in (1,2) ");
        if (StringUtils.isNotEmpty(obj.getSysGroupName())) {
            sql.append(" AND (upper(name) LIKE upper(:name) escape '&' OR upper(code) LIKE upper(:name) escape '&')");
        }
        sql.append(" order by sys_group_id asc ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupCode", new StringType());
        query.addScalar("sysGroupName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AIOMonthPlanDetailDTO.class));

        if (StringUtils.isNotEmpty(obj.getSysGroupName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getSysGroupName()) + "%");
            queryCount.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getSysGroupName()) + "%");
        }

        this.setPageSize(obj, query, queryCount);

        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<AIOMonthPlanDetailDTO> getAllDomainDataByCode(AIOMonthPlanDetailDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT sg.SYS_GROUP_ID sysGroupId, " +
                "sg.code sysGroupCode, " +
                "sg.name sysGroupName " +
                "FROM CTCT_CAT_OWNER.SYS_GROUP sg " +
                "left join CTCT_VPS_OWNER.DOMAIN_DATA dd " +
                "on sg.SYS_GROUP_ID=dd.DATA_ID " +
                "left join CTCT_VPS_OWNER.DOMAIN_TYPE dt " +
                "on dd.DOMAIN_TYPE_ID = dt.DOMAIN_TYPE_ID " +
                "where dt.code='KTTS_LIST_AREA'");

        if (StringUtils.isNotEmpty(obj.getAreaCode())) {
            sql.append(" AND (upper(sg.code) LIKE upper(:code) escape '&')");
        }

        sql.append(" order by sg.SYS_GROUP_ID asc ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupCode", new StringType());
        query.addScalar("sysGroupName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AIOMonthPlanDetailDTO.class));

        if (StringUtils.isNotEmpty(obj.getAreaCode())) {
            query.setParameter("code", "%" + ValidateUtils.validateKeySearch(obj.getAreaCode()) + "%");
            queryCount.setParameter("code", "%" + ValidateUtils.validateKeySearch(obj.getAreaCode()) + "%");
        }

        this.setPageSize(obj, query, queryCount);

        return query.list();
    }

    public AIOMonthPlanDTO checkDataMonthPlan(AIOMonthPlanDTO obj) {
        StringBuilder sql = new StringBuilder("select aio_Month_Plan_Id aioMonthPlanId"
                + " from aio_Month_Plan "
                + " where month=:month"
                + " and year=:year "
                + " and status = '1' ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("aioMonthPlanId", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(AIOMonthPlanDTO.class));
        query.setParameter("month", obj.getMonth());
        query.setParameter("year", obj.getYear());

        @SuppressWarnings("unchecked")
        List<AIOMonthPlanDTO> lst = query.list();
        if (lst.size() > 0) {
            return lst.get(0);
        }
        return null;
    }

    public List<AIOMonthPlanDetailDTO> doSearchChart(AIOMonthPlanDetailDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT 'Thực hiện' titleName, round(sum(ar.AMOUNT)/1.1, 0) totalAmount " +
                " FROM AIO_CONTRACT ac " +
                " inner join AIO_ACCEPTANCE_RECORDS ar " +
                " on ac.CONTRACT_ID = ar.CONTRACT_ID " +
                " WHERE 1=1 " +
                " and (ac.is_internal IS NULL OR ac.is_internal != 1) ");
        if (obj.getSysGroupId() != null) {
            sql.append(" and ac.PERFORMER_GROUP_ID=:id ");
        }
        if (StringUtils.isNotEmpty(obj.getMonth())) {
            sql.append(" and to_char(ar.END_DATE,'MM')=:month ");
        }
        if (StringUtils.isNotEmpty(obj.getYear())) {
            sql.append(" and to_char(ar.END_DATE,'yyyy')=:year ");
        }
        sql.append(" union all " +
                " SELECT " +
                "'Còn phải TH' titleName, " +
                "sum(ampd.TARGETS_ICT + ampd.TARGETS_ME + ampd.TARGETS_MS + ampd.TARGETS_NLMT + ampd.TARGETS_SH) totalAmount " +
                " FROM AIO_MONTH_PLAN amp " +
                " inner join AIO_MONTH_PLAN_DETAIL ampd " +
                " on amp.AIO_MONTH_PLAN_ID = ampd.MONTH_PLAN_ID " +
                " where 1=1 and amp.status=1");
        if (obj.getSysGroupId() != null) {
            sql.append(" and ampd.SYS_GROUP_ID=:id ");
        }
        if (StringUtils.isNotEmpty(obj.getMonth())) {
            sql.append(" and amp.MONTH=:month ");
        }
        if (StringUtils.isNotEmpty(obj.getYear())) {
            sql.append(" and amp.YEAR=:year ");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("titleName", new StringType());
        query.addScalar("totalAmount", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(AIOMonthPlanDetailDTO.class));

        if (obj.getSysGroupId() != null) {
            query.setParameter("id", obj.getSysGroupId());
        }
        if (StringUtils.isNotEmpty(obj.getMonth())) {
            query.setParameter("month", obj.getMonth());
        }
        if (StringUtils.isNotEmpty(obj.getYear())) {
            query.setParameter("year", obj.getYear());
        }
        return query.list();
    }

    public List<AIOMonthPlanDetailDTO> getAutoCompleteSysGroupLevel(AIOMonthPlanDetailDTO obj) {
        String sql = "SELECT " + " ST.SYS_GROUP_ID sysGroupId" + ",(ST.CODE ||'-' || ST.NAME) text" + " ,ST.NAME sysGroupName"
                + " ,ST.CODE sysGroupCode" + " FROM CTCT_CAT_OWNER.SYS_GROUP ST" + " WHERE ST.STATUS=1 and ST.GROUP_LEVEL in (1,2)";

        StringBuilder stringBuilder = new StringBuilder(sql);

        stringBuilder.append(" AND ROWNUM <=10 ");
        if (StringUtils.isNotEmpty(obj.getSysGroupName())) {
            stringBuilder.append(
                    " AND (upper(ST.NAME) LIKE upper(:name) escape '&' OR upper(ST.CODE) LIKE upper(:name) escape '&')");
        }

        stringBuilder.append(" ORDER BY ST.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("text", new StringType());
        query.addScalar("sysGroupCode", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AIOMonthPlanDetailDTO.class));

        if (StringUtils.isNotEmpty(obj.getSysGroupName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getSysGroupName()) + "%");
        }

        return query.list();
    }

    public List<AIOMonthPlanDetailDTO> getListDateInMonth(String date) {
        StringBuilder sql = new StringBuilder("select to_date(:date,'MM/yyyy')+level-1 dateMonth" +
                " from dual  " +
                " connect by level <= TO_CHAR(LAST_DAY(to_date(:date,'MM/yyyy')),'dd')");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("dateMonth", new DateType());
        query.setResultTransformer(Transformers.aliasToBean(AIOMonthPlanDetailDTO.class));
        query.setParameter("date", date);
        return query.list();
    }

    public AIOMonthPlanDetailDTO getTotalAmountByDay(AIOMonthPlanDetailDTO obj, int numberMonth) {
        StringBuilder sql = new StringBuilder("SELECT " +
                " NVL((SUM(ampd.TARGETS_ICT + ampd.TARGETS_ME + ampd.TARGETS_MS + ampd.TARGETS_NLMT + ampd.TARGETS_SH)),0)/(:numberMonth) planValue" +
                " FROM AIO_MONTH_PLAN amp " +
                " INNER JOIN AIO_MONTH_PLAN_DETAIL ampd " +
                " ON amp.AIO_MONTH_PLAN_ID = ampd.MONTH_PLAN_ID " +
                " WHERE 1                  =1 and amp.status = 1 ");
        if (StringUtils.isNotEmpty(obj.getMonth())) {
            sql.append(" AND amp.month=:month ");
        }
        if (StringUtils.isNotEmpty(obj.getYear())) {
            sql.append(" AND amp.year=:year ");
        }
        if (obj.getSysGroupId() != null) {
            sql.append(" AND ampd.sys_group_id=:id ");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("planValue", new DoubleType());
        query.setResultTransformer(Transformers.aliasToBean(AIOMonthPlanDetailDTO.class));
        query.setParameter("numberMonth", numberMonth);
        if (obj.getSysGroupId() != null) {
            query.setParameter("id", obj.getSysGroupId());
        }
        if (StringUtils.isNotEmpty(obj.getMonth())) {
            query.setParameter("month", obj.getMonth());
        }
        if (StringUtils.isNotEmpty(obj.getYear())) {
            query.setParameter("year", obj.getYear());
        }
        @SuppressWarnings("unchecked")
        List<AIOMonthPlanDetailDTO> lst = query.list();
        if (lst.size() > 0) {
            return lst.get(0);
        }
        return null;
    }

    public AIOMonthPlanDetailDTO getPerformValueByDay(AIOMonthPlanDetailDTO obj) {
        StringBuilder sql = new StringBuilder("SELECt  " +
                "  Round(NVL(SUM(ar.AMOUNT),0)/1.1, 0) performValue " +
                "FROM AIO_CONTRACT ac " +
                "INNER JOIN AIO_ACCEPTANCE_RECORDS ar " +
                "ON ac.CONTRACT_ID = ar.CONTRACT_ID " +
                "WHERE 1 =1 " +
                "and (ac.is_internal IS NULL OR ac.is_internal != 1) " +
                "and TRUNC(ar.END_DATE)=:date ");
        if (obj.getSysGroupId() != null) {
            sql.append("and ac.PERFORMER_GROUP_ID=:id ");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("performValue", new DoubleType());
        query.setResultTransformer(Transformers.aliasToBean(AIOMonthPlanDetailDTO.class));
        query.setParameter("date", obj.getDateMonth());
        if (obj.getSysGroupId() != null) {
            query.setParameter("id", obj.getSysGroupId());
        }
        @SuppressWarnings("unchecked")
        List<AIOMonthPlanDetailDTO> lst = query.list();
        if (lst.size() > 0) {
            return lst.get(0);
        }
        return null;
    }

    public AIOMonthPlanDTO getAioMonthPlanDTO(Long id) {
        StringBuilder sql = new StringBuilder("select MONTH month, YEAR year from AIO_MONTH_PLAN where AIO_MONTH_PLAN_ID=:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("month", new StringType());
        query.addScalar("year", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOMonthPlanDTO.class));

        query.setParameter("id", id);

        @SuppressWarnings("unchecked")
        List<AIOMonthPlanDTO> lst = query.list();
        if (lst.size() > 0) {
            return lst.get(0);
        }
        return null;
    }

    /*
    //HuyPQ-20190930-start
    public List<AIOMonthPlanDTO> doSearchChartColumnFailProvince(AIOMonthPlanDTO obj){
    	StringBuilder sql = new StringBuilder(" WITH tbl AS " + 
    			"  (SELECT s.CODE ma_dv, " + 
    			"    SUM( " + 
    			"    CASE " + 
    			"      WHEN c.status !=4 " + 
    			"      THEN 1 " + 
    			"      ELSE 0 " + 
    			"    END) KH, " + 
    			"    SUM( " + 
    			"    CASE " + 
    			"      WHEN c.status                           = 3 " + 
    			"      AND ((cp.END_DATE - cp.START_DATE)*24) <=24 " + 
    			"      THEN 1 " + 
    			"      ELSE 0 " + 
    			"    END) thuchien_1ngay, " + 
    			"     " + 
    			"    SUM( " + 
    			"    CASE " + 
    			"      WHEN c.status                           = 3 " + 
    			"      AND ((cp.END_DATE - cp.START_DATE)*24) <=48 " + 
    			"      THEN 1 " + 
    			"      ELSE 0 " + 
    			"    END) thuchien_2ngay, " + 
    			"     " + 
    			"    SUM( " + 
    			"    CASE " + 
    			"      WHEN c.status                           = 3 " + 
    			"      AND ((cp.END_DATE - cp.START_DATE)*24) <=72 " + 
    			"      THEN 1 " + 
    			"      ELSE 0 " + 
    			"    END) thuchien_3ngay " + 
    			"     " + 
    			"  FROM AIO_CONTRACT c " + 
    			"  LEFT JOIN AIO_CONTRACT_PERFORM_DATE cp " + 
    			"  ON c.CONTRACT_ID = cp.CONTRACT_ID " + 
    			"  LEFT JOIN SYS_GROUP s " + 
    			"  ON c.PERFORMER_GROUP_ID     = s.SYS_GROUP_ID " + 
    			"  WHERE 1=1 " +
//    			"  TRUNC(c.CREATED_DATE)>= to_date (:dateFrom,'dd/MM/yyyy') " +
//    			"  AND TRUNC(c.CREATED_DATE)  <= to_date (:dateTo,'dd/MM/yyyy') " +
//    			"    and " + 
//    			"    c.PERFORMER_GROUP_ID in( 270488) " + 
				"  and c.CREATED_DATE >= :dateFrom " +
				"  and c.CREATED_DATE <= :dateTo " +
    			"  GROUP BY s.CODE " + 
				"  order by thuchien_1ngay, thuchien_2ngay, thuchien_3ngay asc "+
    			"  ) " + 
    			"  SELECT ma_dv sysGroupName, " + 
    			"  ROUND(DECODE(KH,0,0,100*thuchien_1ngay/KH),2) thucHien1Ngay, " + 
    			"  ROUND(DECODE(KH,0,0,100*thuchien_2ngay/KH),2) thucHien2Ngay, " + 
    			"  ROUND(DECODE(KH,0,0,100*thuchien_3ngay/KH),2) thucHien3Ngay " + 
    			"  FROM tbl "+
    			"  where ROWNUM<=3 "+
    			" order by ma_dv asc ");
    	SQLQuery query = getSession().createSQLQuery(sql.toString());
    	query.addScalar("sysGroupName", new StringType());
    	query.addScalar("thucHien1Ngay", new DoubleType());
    	query.addScalar("thucHien2Ngay", new DoubleType());
    	query.addScalar("thucHien3Ngay", new DoubleType());
    	
    	query.setParameter("dateFrom", obj.getDateFrom());
    	query.setParameter("dateTo", obj.getDateTo());
    	
    	query.setResultTransformer(Transformers.aliasToBean(AIOMonthPlanDTO.class));
    	
    	return query.list();
    }
    //Huy-end
    */

    public List<AIOMonthPlanDTO> doSearchChartColumnFailProvince(AIOMonthPlanDTO obj) {
        String sql = "with tbl as( " +
                "select s.PROVINCE_CODE ma_dv, " +
                "sum(case when c.status !=4 then 1 else 0 end) KH, " +
                "sum(case when c.status = 3  and ((cp.END_DATE - cp.START_DATE)*24) <=24 then 1 else 0 end) thuchien_1ngay, " +
                "sum(case when c.status = 3 and ((cp.END_DATE - cp.START_DATE)*24) <=48 then 1 else 0 end) thuchien_2ngay, " +
                "sum(case when c.status = 3  and ((cp.END_DATE - cp.START_DATE)*24) <=72 then 1 else 0 end) thuchien_3ngay " +
                "from AIO_CONTRACT c " +
                "left join AIO_CONTRACT_PERFORM_DATE cp on c.CONTRACT_ID = cp.CONTRACT_ID  " +
                "left join SYS_GROUP s on c.PERFORMER_GROUP_ID = s.SYS_GROUP_ID " +
                "where  " +
                "trunc(c.CREATED_DATE)>= trunc(:dateFrom) and " +
                "trunc(c.CREATED_DATE)<= trunc(:dateTo) " +
                "and c.status != 4 " +
                "group by s.PROVINCE_CODE) " +

                "select ma_dv sysGroupName, " +
                "round(decode(KH,0,0,100*thuchien_1ngay/KH),2) thucHien1Ngay, " +
                "round(decode(KH,0,0,100*thuchien_2ngay/KH),2) thucHien2Ngay, " +
                "round(decode(KH,0,0,100*thuchien_3ngay/KH),2) thucHien3Ngay " +
                "from tbl ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("thucHien1Ngay", new DoubleType());
        query.addScalar("thucHien2Ngay", new DoubleType());
        query.addScalar("thucHien3Ngay", new DoubleType());

        query.setParameter("dateFrom", obj.getDateFrom());
        query.setParameter("dateTo", obj.getDateTo());

        query.setResultTransformer(Transformers.aliasToBean(AIOMonthPlanDTO.class));

        return query.list();
    }

    //tatph-start 18/12/2019
    private String getSearchDate(AIOReportDTO dto, boolean isStartDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DateTimeUtils.DATE_DD_MM_YYYY);
        LocalDate date = LocalDate.of(dto.getYear(), dto.getMonth(), 1);

        return isStartDate ? date.format(formatter) : date.withDayOfMonth(date.lengthOfMonth()).format(formatter);
    }

    public List<AIOMonthPlanDTO> doSearchChartColumnFailGroup(AIOReportDTO obj) {
//        String startDate = getSearchDate(obj, true);
//        String endDate = getSearchDate(obj, false);
        String conditionMonthYear = "and to_char(c.CREATED_DATE,'MM') = :month AND to_char(c.CREATED_DATE,'YYYY') = :year ";

        StringBuilder sql = new StringBuilder();
        sql.append("with th as( ")
                .append(" select " +
                        "s.SYS_GROUP_ID ma_dv, " +
                        "c.CONTRACT_ID, " +
                        " sum ((cp.END_DATE - cp.START_DATE)*24) sogio_th")
                .append(" from AIO_CONTRACT c ")
                .append(" left join AIO_CONTRACT_PERFORM_DATE cp on c.CONTRACT_ID = cp.CONTRACT_ID   ")
                .append(" left join SYS_USER su on c.PERFORMER_ID = su.SYS_USER_ID ")
                .append(" left join SYS_GROUP s on su.SYS_GROUP_ID = s.SYS_GROUP_ID ")
                .append(" where 1 = 1 ");
        sql.append(conditionMonthYear);
//        if (startDate != null) {
//            sql.append(" and trunc(c.CREATED_DATE)>= to_date (:dateFrom,'dd/mm/yyyy') ");
//        }
//        if (endDate != null) {
//            sql.append(" and trunc(c.CREATED_DATE)<= to_date (:dateTo,'dd/mm/yyyy')  ");
//        }
        sql.append(" and c.status = 3 ");
        if (obj.getPerformerGroupId() != null) {
            sql.append(" and c.PERFORMER_GROUP_ID = :performerGroupId ");
        }
        sql.append("group by  s.SYS_GROUP_ID ,c.contract_id ")
                .append(" ), ")
                .append(" kh as( ")
                .append(" select s.SYS_GROUP_ID ma_dv, s.SHORTCUT_NAME  tendv, count(*) tonghd ")
                .append(" from AIO_CONTRACT c ")
                .append(" left join SYS_USER su on c.PERFORMER_ID = su.SYS_USER_ID ")
                .append(" left join SYS_GROUP s on su.SYS_GROUP_ID = s.SYS_GROUP_ID ")
                .append(" where  1 = 1 ");
        sql.append(conditionMonthYear);
//        if (startDate != null) {
//            sql.append(" and trunc(c.CREATED_DATE)>= to_date (:dateFrom,'dd/mm/yyyy') ");
//        }
//        if (endDate != null) {
//            sql.append(" and trunc(c.CREATED_DATE)<= to_date (:dateTo,'dd/mm/yyyy')  ");
//        }
        sql.append(" and c.status != 4 ");
        if (obj.getPerformerGroupId() != null) {
            sql.append("and c.PERFORMER_GROUP_ID = :performerGroupId ");
        }
        sql.append(" group by s.SYS_GROUP_ID, s.SHORTCUT_NAME  ")
                .append(" ), ")
                .append(" tonghop as( ")
                .append(" select kh.tendv, kh.tonghd, ")
                .append(" sum(case when th.sogio_th <=24 then 1 else 0 end) thuchien_1ngay, ")
                .append(" sum(case when  th.sogio_th <=48 then 1 else 0 end) thuchien_2ngay, ")
                .append(" sum(case when th.sogio_th <=72 then 1 else 0 end) thuchien_3ngay ")
                .append(" from kh  ")
                .append(" left join th on kh.ma_dv = th.ma_dv   ")
                .append(" group by kh.tendv, kh.tonghd)   ")
                .append(" select tonghop.tendv sysGroupName,   ")
                .append(" round(decode(tonghop.tonghd,0,0,100*thuchien_1ngay/tonghop.tonghd),2) thucHien1Ngay,   ")
                .append(" round(decode(tonghop.tonghd,0,0,100*thuchien_2ngay/tonghop.tonghd),2) thucHien2Ngay,   ")
                .append(" round(decode(tonghop.tonghd,0,0,100*thuchien_3ngay/tonghop.tonghd),2) thucHien3Ngay   ")
                .append(" from tonghop   ");


        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("thucHien1Ngay", new DoubleType());
        query.addScalar("thucHien2Ngay", new DoubleType());
        query.addScalar("thucHien3Ngay", new DoubleType());
//        if (startDate != null) {
//            query.setParameter("dateFrom", startDate);
//        }
//        if (endDate != null) {
//            query.setParameter("dateTo", endDate);
//        }
        query.setParameter("month", obj.getMonth());
        query.setParameter("year", obj.getYear());
        if (obj.getPerformerGroupId() != null) {
            query.setParameter("performerGroupId", obj.getPerformerGroupId());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOMonthPlanDTO.class));

        return query.list();
    }

    //tatph - end - 18/12/2019
}
