package com.viettel.aio.dao;

import com.viettel.aio.dto.report.AIOReportDTO;
import com.viettel.aio.dto.report.AIORpImplementDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;

@EnableTransactionManagement
@Transactional
@Repository("aioRpImplementDAO")
public class AIORpImplementDAO extends BaseFWDAOImpl<BaseFWModelImpl, Long> {

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIORpImplementDTO> implementByProvince(AIORpImplementDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" with ");
        sql.append(" vung as (select cp.AREA_ID, cp.AREA_CODE, cp.CAT_PROVINCE_ID, cp.CODE, s.SYS_GROUP_ID, cp.NAME from SYS_GROUP s");
        sql.append(" LEFT join CAT_PROVINCE cp on s.PROVINCE_ID = cp.CAT_PROVINCE_ID");
        sql.append(" where s.GROUP_LEVEL = 2 and s.CODE like '%TTKT%'),");
        sql.append(" tbl as(");
        sql.append(" select");
        sql.append(" s.AREA_CODE, s.PROVINCE_CODE, cp.NAME,");
        sql.append(" sum(case when  c.status !=4 then 1 else 0 end) KHT, ");
        sql.append(" sum(case when c.status = 3 and ((cp.END_DATE - cp.START_DATE)*24) <=24 then 1 else 0 end) thuchien_TONG_1ngay, ");
        sql.append(" sum(case when c.status = 3 and ((cp.END_DATE - cp.START_DATE)*24) <=48 then 1 else 0 end) thuchien_TONG_2ngay, ");
        sql.append(" sum(case when c.status = 3 and ((cp.END_DATE - cp.START_DATE)*24) <=72 then 1 else 0 end) thuchien_TONG_3ngay, ");
        sql.append(" ");
        sql.append(" sum(case when c.type = 2 and c.status !=4 then 1 else 0 end) KH_TM, ");
        sql.append(" sum(case when c.status = 3 and c.type = 2 and ((cp.END_DATE - cp.START_DATE)*24) <=24 then 1 else 0 end) thuchien_TM_1ngay, ");
        sql.append(" sum(case when c.status = 3 and c.type = 2 and ((cp.END_DATE - cp.START_DATE)*24) <=48 then 1 else 0 end) thuchien_TM_2ngay, ");
        sql.append(" sum(case when c.status = 3 and c.type = 2 and ((cp.END_DATE - cp.START_DATE)*24) <=72 then 1 else 0 end) thuchien_TM_3ngay, ");
        sql.append(" ");
        sql.append(" sum(case when c.type = 1 and c.status !=4 then 1 else 0 end) KH_DV, ");
        sql.append(" sum(case when c.status = 3 and c.type = 1 and ((cp.END_DATE - cp.START_DATE)*24) <=24 then 1 else 0 end) thuchien_DV_1ngay, ");
        sql.append(" sum(case when c.status = 3 and c.type = 1 and ((cp.END_DATE - cp.START_DATE)*24) <=48 then 1 else 0 end) thuchien_DV_2ngay, ");
        sql.append(" sum(case when c.status = 3 and c.type = 1 and ((cp.END_DATE - cp.START_DATE)*24) <=72 then 1 else 0 end) thuchien_DV_3ngay ");
        sql.append(" from AIO_CONTRACT c ");
        sql.append(" left join AIO_CONTRACT_PERFORM_DATE cp on c.CONTRACT_ID = cp.CONTRACT_ID ");
        sql.append(" left join SYS_GROUP s on c.PERFORMER_GROUP_ID = s.SYS_GROUP_ID ");
        sql.append(" left join CAT_PROVINCE cp on cp.CAT_PROVINCE_ID = s.PROVINCE_ID ");
        sql.append(" where 1 =1 ");
        if (obj.getStartDate() != null) {
            sql.append(" and trunc(c.CREATED_DATE) >= trunc(:startDate) ");
        }
        if (obj.getEndDate() != null) {
            sql.append(" and trunc(c.CREATED_DATE) <= trunc(:endDate) ");
        }
        sql.append(" group by s.AREA_CODE, s.PROVINCE_CODE, cp.NAME ");
        sql.append(" ) ");
        sql.append(" select areaCode, provinceName, provinceCode, ");
        sql.append(" tyleTONG1, soTT1, tyleTM1, soTTM1, tyleDV1, soTDV1,");
        sql.append(" case when soTT1 is null then null else RANK() OVER (ORDER BY soTT1) end rankTT1, ");
        sql.append(" tyleTONG2, soTT2, tyleTM2, soTTM2, tyleDV2, soTDV2,");
        sql.append(" case when soTT2 is null then null else RANK() OVER (ORDER BY soTT2) end rankTT2, ");
        sql.append(" tyleTONG3, soTT3, tyleTM3, soTTM3, tyleDV3, soTDV3,");
        sql.append(" case when soTT3 is null then null else RANK() OVER (ORDER BY soTT3) end rankTT3 ");
        sql.append(" from (");
        sql.append(" select ");
        sql.append(" v.AREA_CODE areaCode, v.NAME provinceName, v.CODE provinceCode, v.SYS_GROUP_ID,");
        sql.append(" round(decode(tbl.KHT,0,0,100*tbl.thuchien_TONG_1ngay/tbl.KHT),2) tyleTONG1, ");
        sql.append(" 100 * (round(((80 -round(decode(tbl.KHT,0,0,100*tbl.thuchien_TONG_1ngay/tbl.KHT),2))/20),2)) soTT1, ");
        sql.append(" ");
        sql.append(" round(decode(tbl.KH_TM,0,0,100*tbl.thuchien_TM_1ngay/tbl.KH_TM),2) tyleTM1, ");
        sql.append(" 100 * (round(((80 -round(decode(tbl.KH_TM,0,0,100*tbl.thuchien_TM_1ngay/tbl.KH_TM),2))/20),2)) soTTM1, ");
        sql.append(" ");
        sql.append(" round(decode(tbl.KH_DV,0,0,100*tbl.thuchien_DV_1ngay/tbl.KH_DV),2) tyleDV1, ");
        sql.append(" 100 * (round(((80 -round(decode(tbl.KH_DV,0,0,100*tbl.thuchien_DV_1ngay/tbl.KH_DV),2))/20),2)) soTDV1, ");
        sql.append(" ");
        sql.append(" round(decode(tbl.KHT,0,0,100*tbl.thuchien_TONG_2ngay/tbl.KHT),2) tyleTONG2, ");
        sql.append(" 100 * (round(((95 -round(decode(tbl.KHT,0,0,100*tbl.thuchien_TONG_2ngay/tbl.KHT),2))/5),2)) soTT2, ");
        sql.append(" ");
        sql.append(" round(decode(tbl.KH_TM,0,0,100*tbl.thuchien_TM_2ngay/tbl.KH_TM),2) tyleTM2, ");
        sql.append(" 100 * (round(((95 -round(decode(tbl.KH_TM,0,0,100*tbl.thuchien_TM_2ngay/tbl.KH_TM),2))/5),2)) soTTM2, ");
        sql.append(" ");
        sql.append(" round(decode(tbl.KH_DV,0,0,100*tbl.thuchien_DV_2ngay/tbl.KH_DV),2) tyleDV2, ");
        sql.append(" 100 * (round(((95 -round(decode(tbl.KH_DV,0,0,100*tbl.thuchien_DV_2ngay/tbl.KH_DV),2))/5),2)) soTDV2, ");
        sql.append(" ");
        sql.append(" round(decode(tbl.KHT,0,0,100*tbl.thuchien_TONG_3ngay/tbl.KHT),2) tyleTONG3, ");
        sql.append(" 100- round(decode(tbl.KHT,0,0,100*tbl.thuchien_TONG_3ngay/tbl.KHT),2) soTT3, ");
        sql.append(" ");
        sql.append(" round(decode(tbl.KH_TM,0,0,100*tbl.thuchien_TM_3ngay/tbl.KH_TM),2) tyleTM3, ");
        sql.append(" 100 - round(decode(tbl.KH_TM,0,0,100*tbl.thuchien_TM_3ngay/tbl.KH_TM),2) soTTM3, ");
        sql.append(" ");
        sql.append(" round(decode(tbl.KH_DV,0,0,100*tbl.thuchien_DV_3ngay/tbl.KH_DV),2) tyleDV3, ");
        sql.append(" 100 - round(decode(tbl.KH_DV,0,0,100*tbl.thuchien_DV_3ngay/tbl.KH_DV),2) soTDV3 ");
        sql.append(" from vung v ");
        sql.append("  left join  tbl on v.CODE = tbl.PROVINCE_CODE ");
        sql.append(" ) ");
        sql.append(" where 1 = 1 ");
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            sql.append(" and areaCode IN (:areaCodes) ");
        }
        if (obj.getGroupIds() != null && !obj.getGroupIds().isEmpty()) {
            sql.append(" and SYS_GROUP_ID IN (:groupIds) ");
        }
        sql.append("ORDER BY areaCode, provinceName");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
        if (obj.getStartDate() != null) {
            query.setParameter("startDate", obj.getStartDate());
            queryCount.setParameter("startDate", obj.getStartDate());

        }
        if (obj.getEndDate() != null) {
            query.setParameter("endDate", obj.getEndDate());
            queryCount.setParameter("endDate", obj.getEndDate());
        }
        if (obj.getGroupIds() != null && !obj.getGroupIds().isEmpty()) {
            query.setParameterList("groupIds", obj.getGroupIds());
            queryCount.setParameterList("groupIds", obj.getGroupIds());

        }
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            query.setParameterList("areaCodes", obj.getAreaCodes());
            queryCount.setParameterList("areaCodes", obj.getAreaCodes());

        }
        query.setResultTransformer(Transformers.aliasToBean(AIORpImplementDTO.class));
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("provinceName", new StringType());
        query.addScalar("tyleTONG1", new DoubleType());
        query.addScalar("soTT1", new DoubleType());
        query.addScalar("rankTT1", new IntegerType());
        query.addScalar("tyleTM1", new DoubleType());
        query.addScalar("soTTM1", new DoubleType());
        query.addScalar("tyleDV1", new DoubleType());
        query.addScalar("soTDV1", new DoubleType());
        query.addScalar("tyleTONG2", new DoubleType());
        query.addScalar("soTT2", new DoubleType());
        query.addScalar("rankTT2", new IntegerType());
        query.addScalar("tyleTM2", new DoubleType());
        query.addScalar("soTTM2", new DoubleType());
        query.addScalar("tyleDV2", new DoubleType());
        query.addScalar("soTDV2", new DoubleType());
        query.addScalar("tyleTONG3", new DoubleType());
        query.addScalar("soTT3", new DoubleType());
        query.addScalar("rankTT3", new IntegerType());
        query.addScalar("tyleTM3", new DoubleType());
        query.addScalar("soTTM3", new DoubleType());
        query.addScalar("tyleDV3", new DoubleType());
        query.addScalar("soTDV3", new DoubleType());
        this.setPageSize(obj, query, queryCount);
        return query.list();
    }

    public List<AIORpImplementDTO> implementByGroup(AIORpImplementDTO obj) {
        StringBuilder coditions = new StringBuilder();
        coditions.append(" Where 1=1 ");

        StringBuilder sql = new StringBuilder();
        sql.append(" with ");
        sql.append(" vung as (select cp.AREA_ID, cp.AREA_CODE, cp.CAT_PROVINCE_ID, cp.CODE, s.SYS_GROUP_ID, cp.NAME, s.NAME cum, s.PARENT_ID from SYS_GROUP s ");
        sql.append(" LEFT join CAT_PROVINCE cp on s.PROVINCE_ID = cp.CAT_PROVINCE_ID ");
        sql.append(" where s.GROUP_LEVEL = 3 and s.CODE like '%TTKT%' and s.status = 1), ");
        sql.append(" tbl as( ");
        sql.append(" select ");
        sql.append(" s.AREA_CODE, s.PROVINCE_CODE, cp.NAME, s.NAME cum, s.SYS_GROUP_ID, ");
        sql.append(" sum(case when  c.status !=4 then 1 else 0 end) KHT, ");
        sql.append(" sum(case when c.status = 3 and ((cp.END_DATE - cp.START_DATE)*24) <=24 then 1 else 0 end) thuchien_TONG_1ngay, ");
        sql.append(" sum(case when c.status = 3 and ((cp.END_DATE - cp.START_DATE)*24) <=48 then 1 else 0 end) thuchien_TONG_2ngay, ");
        sql.append(" sum(case when c.status = 3 and ((cp.END_DATE - cp.START_DATE)*24) <=72 then 1 else 0 end) thuchien_TONG_3ngay, ");
        sql.append(" ");
        sql.append(" sum(case when c.type = 2 and c.status !=4 then 1 else 0 end) KH_TM, ");
        sql.append(" sum(case when c.status = 3 and c.type = 2 and ((cp.END_DATE - cp.START_DATE)*24) <=24 then 1 else 0 end) thuchien_TM_1ngay, ");
        sql.append(" sum(case when c.status = 3 and c.type = 2 and ((cp.END_DATE - cp.START_DATE)*24) <=48 then 1 else 0 end) thuchien_TM_2ngay, ");
        sql.append(" sum(case when c.status = 3 and c.type = 2 and ((cp.END_DATE - cp.START_DATE)*24) <=72 then 1 else 0 end) thuchien_TM_3ngay, ");
        sql.append(" ");
        sql.append(" sum(case when c.type = 1 and c.status !=4 then 1 else 0 end) KH_DV, ");
        sql.append(" sum(case when c.status = 3 and c.type = 1 and ((cp.END_DATE - cp.START_DATE)*24) <=24 then 1 else 0 end) thuchien_DV_1ngay, ");
        sql.append(" sum(case when c.status = 3 and c.type = 1 and ((cp.END_DATE - cp.START_DATE)*24) <=48 then 1 else 0 end) thuchien_DV_2ngay, ");
        sql.append(" sum(case when c.status = 3 and c.type = 1 and ((cp.END_DATE - cp.START_DATE)*24) <=72 then 1 else 0 end) thuchien_DV_3ngay ");
        sql.append(" from AIO_CONTRACT c ");
        sql.append(" left join AIO_CONTRACT_PERFORM_DATE cp on c.CONTRACT_ID = cp.CONTRACT_ID ");
        sql.append(" left join SYS_USER su on su.SYS_USER_ID = c.PERFORMER_ID ");
        sql.append(" left join SYS_GROUP s on su.SYS_GROUP_ID = s.SYS_GROUP_ID ");
        sql.append(" left join CAT_PROVINCE cp on cp.CAT_PROVINCE_ID = s.PROVINCE_ID ");
        sql.append(" ");
        sql.append(" where 1 = 1 ");
        if (obj.getStartDate() != null) {
            sql.append(" and trunc(c.CREATED_DATE)>= trunc(:startDate) ");
        }
        if (obj.getEndDate() != null) {
            sql.append(" and trunc(c.CREATED_DATE)<= trunc(:endDate) ");
        }
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            sql.append(" and s.AREA_CODE IN (:areaCodes) ");
        }
        if (obj.getGroupIds() != null && !obj.getGroupIds().isEmpty()) {
            sql.append(" and c.PERFORMER_GROUP_ID IN (:groupIds) ");
        }
        sql.append(" group by s.AREA_CODE, s.PROVINCE_CODE, cp.NAME, s.NAME, s.SYS_GROUP_ID ");
        sql.append(" ) ");
        sql.append(" select areaCode, provinceName, provinceCode, groupName, ");
        sql.append(" tyleTONG1, soTT1, tyleTM1, soTTM1, tyleDV1, soTDV1,");
        sql.append(" case when soTT1 is null then null else RANK() OVER (ORDER BY soTT1) end rankTT1, ");
        sql.append(" tyleTONG2, soTT2, tyleTM2, soTTM2, tyleDV2, soTDV2,");
        sql.append(" case when soTT2 is null then null else RANK() OVER (ORDER BY soTT2) end rankTT2, ");
        sql.append(" tyleTONG3, soTT3, tyleTM3, soTTM3, tyleDV3, soTDV3,");
        sql.append(" case when soTT3 is null then null else RANK() OVER (ORDER BY soTT3) end rankTT3 ");
        sql.append(" from (");
        sql.append(" select ");
        sql.append(" v.AREA_CODE areaCode, v.NAME provinceName, v.CODE provinceCode, v.cum groupName, v.SYS_GROUP_ID, ");
        sql.append(" round(decode(tbl.KHT,0,0,100*tbl.thuchien_TONG_1ngay/tbl.KHT),2) tyleTONG1, ");
        sql.append(" 100 * (round(((80 -round(decode(tbl.KHT,0,0,100*tbl.thuchien_TONG_1ngay/tbl.KHT),2))/20),2)) soTT1, ");
        sql.append(" ");
        sql.append(" round(decode(tbl.KH_TM,0,0,100*tbl.thuchien_TM_1ngay/tbl.KH_TM),2) tyleTM1, ");
        sql.append(" 100 * (round(((80 -round(decode(tbl.KH_TM,0,0,100*tbl.thuchien_TM_1ngay/tbl.KH_TM),2))/20),2)) soTTM1, ");
        sql.append(" ");
        sql.append(" round(decode(tbl.KH_DV,0,0,100*tbl.thuchien_DV_1ngay/tbl.KH_DV),2) tyleDV1, ");
        sql.append(" 100 * (round(((80 -round(decode(tbl.KH_DV,0,0,100*tbl.thuchien_DV_1ngay/tbl.KH_DV),2))/20),2)) soTDV1, ");
        sql.append(" ");
        sql.append(" round(decode(tbl.KHT,0,0,100*tbl.thuchien_TONG_2ngay/tbl.KHT),2) tyleTONG2, ");
        sql.append(" 100 * (round(((95 -round(decode(tbl.KHT,0,0,100*tbl.thuchien_TONG_2ngay/tbl.KHT),2))/5),2)) soTT2, ");
        sql.append(" ");
        sql.append(" round(decode(tbl.KH_TM,0,0,100*tbl.thuchien_TM_2ngay/tbl.KH_TM),2) tyleTM2, ");
        sql.append(" 100 * (round(((95 -round(decode(tbl.KH_TM,0,0,100*tbl.thuchien_TM_2ngay/tbl.KH_TM),2))/5),2)) soTTM2, ");
        sql.append(" ");
        sql.append(" round(decode(tbl.KH_DV,0,0,100*tbl.thuchien_DV_2ngay/tbl.KH_DV),2) tyleDV2, ");
        sql.append(" 100 * (round(((95 -round(decode(tbl.KH_DV,0,0,100*tbl.thuchien_DV_2ngay/tbl.KH_DV),2))/5),2)) soTDV2, ");
        sql.append(" ");
        sql.append(" round(decode(tbl.KHT,0,0,100*tbl.thuchien_TONG_3ngay/tbl.KHT),2) tyleTONG3, ");
        sql.append(" 100- round(decode(tbl.KHT,0,0,100*tbl.thuchien_TONG_3ngay/tbl.KHT),2) soTT3, ");
        sql.append(" ");
        sql.append(" round(decode(tbl.KH_TM,0,0,100*tbl.thuchien_TM_3ngay/tbl.KH_TM),2) tyleTM3, ");
        sql.append(" 100 - round(decode(tbl.KH_TM,0,0,100*tbl.thuchien_TM_3ngay/tbl.KH_TM),2) soTTM3, ");
        sql.append(" ");
        sql.append(" round(decode(tbl.KH_DV,0,0,100*tbl.thuchien_DV_3ngay/tbl.KH_DV),2) tyleDV3, ");
        sql.append(" 100 - round(decode(tbl.KH_DV,0,0,100*tbl.thuchien_DV_3ngay/tbl.KH_DV),2) soTDV3 ");
        sql.append(" from ");
        sql.append(" vung v ");
        sql.append("  left join  tbl on v.SYS_GROUP_ID = tbl.SYS_GROUP_ID ");
        sql.append(" where 1 = 1 ");
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            sql.append(" and v.AREA_CODE IN (:areaCodes) ");
        }
        if (obj.getGroupIds() != null && !obj.getGroupIds().isEmpty()) {
            sql.append(" and ( v.SYS_GROUP_ID IN (:groupIds) ");
            sql.append(" or v.PARENT_ID IN (:groupIds) )");
        }
        sql.append("  ORDER BY v.AREA_CODE, v.NAME, v.CODE,v.cum) ");
        sql.append("ORDER BY areaCode, provinceName, provinceCode, groupName");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
        if (obj.getStartDate() != null) {
            query.setParameter("startDate", obj.getStartDate());
            queryCount.setParameter("startDate", obj.getStartDate());

        }
        if (obj.getEndDate() != null) {
            query.setParameter("endDate", obj.getEndDate());
            queryCount.setParameter("endDate", obj.getEndDate());
        }
        if (obj.getGroupIds() != null && !obj.getGroupIds().isEmpty()) {
            query.setParameterList("groupIds", obj.getGroupIds());
            queryCount.setParameterList("groupIds", obj.getGroupIds());

        }
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            query.setParameterList("areaCodes", obj.getAreaCodes());
            queryCount.setParameterList("areaCodes", obj.getAreaCodes());

        }
        query.setResultTransformer(Transformers.aliasToBean(AIORpImplementDTO.class));
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("provinceName", new StringType());
        query.addScalar("groupName", new StringType());
        query.addScalar("tyleTONG1", new DoubleType());
        query.addScalar("soTT1", new DoubleType());
        query.addScalar("rankTT1", new IntegerType());
        query.addScalar("tyleTM1", new DoubleType());
        query.addScalar("soTTM1", new DoubleType());
        query.addScalar("tyleDV1", new DoubleType());
        query.addScalar("soTDV1", new DoubleType());
        query.addScalar("tyleTONG2", new DoubleType());
        query.addScalar("soTT2", new DoubleType());
        query.addScalar("rankTT2", new IntegerType());
        query.addScalar("tyleTM2", new DoubleType());
        query.addScalar("soTTM2", new DoubleType());
        query.addScalar("tyleDV2", new DoubleType());
        query.addScalar("soTDV2", new DoubleType());
        query.addScalar("tyleTONG3", new DoubleType());
        query.addScalar("soTT3", new DoubleType());
        query.addScalar("rankTT3", new IntegerType());
        query.addScalar("tyleTM3", new DoubleType());
        query.addScalar("soTTM3", new DoubleType());
        query.addScalar("tyleDV3", new DoubleType());
        query.addScalar("soTDV3", new DoubleType());
        this.setPageSize(obj, query, queryCount);
        return query.list();
    }

    public List<AIORpImplementDTO> implementByArea(AIORpImplementDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" with ");
        sql.append(" vung as (select cp.AREA_ID, cp.AREA_CODE, cp.CAT_PROVINCE_ID, cp.CODE, s.SYS_GROUP_ID, cp.NAME from SYS_GROUP s");
        sql.append(" LEFT join CAT_PROVINCE cp on s.PROVINCE_ID = cp.CAT_PROVINCE_ID");
        sql.append(" where s.GROUP_LEVEL = 2 and s.CODE like '%TTKT%'),");
        sql.append(" tbl as(");
        sql.append(" select");
        sql.append(" s.AREA_CODE, s.PROVINCE_CODE, cp.NAME,");
        sql.append(" sum(case when  c.status !=4 then 1 else 0 end) KHT, ");
        sql.append(" sum(case when c.status = 3 and ((cp.END_DATE - cp.START_DATE)*24) <=24 then 1 else 0 end) thuchien_TONG_1ngay, ");
        sql.append(" sum(case when c.status = 3 and ((cp.END_DATE - cp.START_DATE)*24) <=48 then 1 else 0 end) thuchien_TONG_2ngay, ");
        sql.append(" sum(case when c.status = 3 and ((cp.END_DATE - cp.START_DATE)*24) <=72 then 1 else 0 end) thuchien_TONG_3ngay, ");
        sql.append(" ");
        sql.append(" sum(case when c.type = 2 and c.status !=4 then 1 else 0 end) KH_TM, ");
        sql.append(" sum(case when c.status = 3 and c.type = 2 and ((cp.END_DATE - cp.START_DATE)*24) <=24 then 1 else 0 end) thuchien_TM_1ngay, ");
        sql.append(" sum(case when c.status = 3 and c.type = 2 and ((cp.END_DATE - cp.START_DATE)*24) <=48 then 1 else 0 end) thuchien_TM_2ngay, ");
        sql.append(" sum(case when c.status = 3 and c.type = 2 and ((cp.END_DATE - cp.START_DATE)*24) <=72 then 1 else 0 end) thuchien_TM_3ngay, ");
        sql.append(" ");
        sql.append(" sum(case when c.type = 1 and c.status !=4 then 1 else 0 end) KH_DV, ");
        sql.append(" sum(case when c.status = 3 and c.type = 1 and ((cp.END_DATE - cp.START_DATE)*24) <=24 then 1 else 0 end) thuchien_DV_1ngay, ");
        sql.append(" sum(case when c.status = 3 and c.type = 1 and ((cp.END_DATE - cp.START_DATE)*24) <=48 then 1 else 0 end) thuchien_DV_2ngay, ");
        sql.append(" sum(case when c.status = 3 and c.type = 1 and ((cp.END_DATE - cp.START_DATE)*24) <=72 then 1 else 0 end) thuchien_DV_3ngay ");
        sql.append(" from AIO_CONTRACT c ");
        sql.append(" left join AIO_CONTRACT_PERFORM_DATE cp on c.CONTRACT_ID = cp.CONTRACT_ID ");
        sql.append(" left join SYS_GROUP s on c.PERFORMER_GROUP_ID = s.SYS_GROUP_ID ");
        sql.append(" left join CAT_PROVINCE cp on cp.CAT_PROVINCE_ID = s.PROVINCE_ID ");
        sql.append(" where 1 =1 ");
        if (obj.getStartDate() != null) {
            sql.append(" and trunc(c.CREATED_DATE) >= trunc(:startDate) ");
        }
        if (obj.getEndDate() != null) {
            sql.append(" and trunc(c.CREATED_DATE) <= trunc(:endDate) ");
        }
        sql.append(" group by s.AREA_CODE, s.PROVINCE_CODE, cp.NAME ");
        sql.append(" ) ");
        sql.append(" select areaCode, provinceName, provinceCode, ");
        sql.append(" tyleTONG1, soTT1, tyleTM1, soTTM1, tyleDV1, soTDV1,");
        sql.append(" case when soTT1 is null then null else RANK() OVER (ORDER BY soTT1) end rankTT1, ");
        sql.append(" tyleTONG2, soTT2, tyleTM2, soTTM2, tyleDV2, soTDV2,");
        sql.append(" case when soTT2 is null then null else RANK() OVER (ORDER BY soTT2) end rankTT2, ");
        sql.append(" tyleTONG3, soTT3, tyleTM3, soTTM3, tyleDV3, soTDV3,");
        sql.append(" case when soTT3 is null then null else RANK() OVER (ORDER BY soTT3) end rankTT3 ");
        sql.append(" from (");
        sql.append(" select ");
        sql.append(" v.AREA_CODE areaCode, count(v.code) || ' tỉnh' provinceName, v.AREA_CODE provinceCode, ");
        sql.append(" round(decode(sum(tbl.KHT),0,0,100*sum(tbl.thuchien_TONG_1ngay)/sum(tbl.KHT)),2) tyleTONG1, ");
        sql.append(" round(((85 -round(decode(sum(tbl.KHT),0,0,100*sum(tbl.thuchien_TONG_1ngay)/sum(tbl.KHT)),2))/15),2) soTT1, ");
        sql.append(" ");
        sql.append(" round(decode(sum(tbl.KH_TM),0,0,100*sum(tbl.thuchien_TM_1ngay)/sum(tbl.KH_TM)),2) tyleTM1, ");
        sql.append(" round(((85 -round(decode(sum(tbl.KH_TM),0,0,100*sum(tbl.thuchien_TM_1ngay)/sum(tbl.KH_TM)),2))/15),2) soTTM1, ");
        sql.append(" ");
        sql.append(" round(decode(sum(tbl.KH_DV),0,0,100*sum(tbl.thuchien_DV_1ngay)/sum(tbl.KH_DV)),2) tyleDV1, ");
        sql.append(" round(((85 -round(decode(sum(tbl.KH_DV),0,0,100*sum(tbl.thuchien_DV_1ngay)/sum(tbl.KH_DV)),2))/15),2) soTDV1, ");
        sql.append(" ");
        sql.append(" round(decode(sum(tbl.KHT),0,0,100*sum(tbl.thuchien_TONG_2ngay)/sum(tbl.KHT)),2) tyleTONG2, ");
        sql.append(" round(((90 -round(decode(sum(tbl.KHT),0,0,100*sum(tbl.thuchien_TONG_2ngay)/sum(tbl.KHT)),2))/10),2) soTT2, ");
        sql.append(" ");
        sql.append(" round(decode(sum(tbl.KH_TM),0,0,100*sum(tbl.thuchien_TM_2ngay)/sum(tbl.KH_TM)),2) tyleTM2, ");
        sql.append(" round(((90 -round(decode(sum(tbl.KH_TM),0,0,100*sum(tbl.thuchien_TM_2ngay)/sum(tbl.KH_TM)),2))/10),2) soTTM2, ");
        sql.append(" ");
        sql.append(" round(decode(sum(tbl.KH_DV),0,0,100*sum(tbl.thuchien_DV_2ngay)/sum(tbl.KH_DV)),2) tyleDV2, ");
        sql.append(" round(((90 -round(decode(sum(tbl.KH_DV),0,0,100*sum(tbl.thuchien_DV_2ngay)/sum(tbl.KH_DV)),2))/10),2) soTDV2, ");
        sql.append(" ");
        sql.append(" round(decode(sum(tbl.KHT),0,0,100*sum(tbl.thuchien_TONG_3ngay)/sum(tbl.KHT)),2) tyleTONG3, ");
        sql.append(" 100- round(decode(sum(tbl.KHT),0,0,100*sum(tbl.thuchien_TONG_3ngay)/sum(tbl.KHT)),2) soTT3, ");
        sql.append(" ");
        sql.append(" round(decode(sum(tbl.KH_TM),0,0,100*sum(tbl.thuchien_TM_3ngay)/sum(tbl.KH_TM)),2) tyleTM3, ");
        sql.append(" 100 - round(decode(sum(tbl.KH_TM),0,0,100*sum(tbl.thuchien_TM_3ngay)/sum(tbl.KH_TM)),2) soTTM3, ");
        sql.append(" ");
        sql.append(" round(decode(sum(tbl.KH_DV),0,0,100*sum(tbl.thuchien_DV_3ngay)/sum(tbl.KH_DV)),2) tyleDV3, ");
        sql.append(" 100 - round(decode(sum(tbl.KH_DV),0,0,100*sum(tbl.thuchien_DV_3ngay)/sum(tbl.KH_DV)),2) soTDV3 ");
        sql.append(" from vung v ");
        sql.append("  left join  tbl on v.CODE = tbl.PROVINCE_CODE ");
        sql.append(" group by v.AREA_CODE");
        sql.append(" ) ");
        sql.append(" order by areaCode ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        if (obj.getStartDate() != null) {
            query.setParameter("startDate", obj.getStartDate());
        }
        if (obj.getEndDate() != null) {
            query.setParameter("endDate", obj.getEndDate());
        }
        query.setResultTransformer(Transformers.aliasToBean(AIORpImplementDTO.class));
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("provinceName", new StringType());
        query.addScalar("tyleTONG1", new DoubleType());
        query.addScalar("soTT1", new DoubleType());
        query.addScalar("rankTT1", new IntegerType());
        query.addScalar("tyleTM1", new DoubleType());
        query.addScalar("soTTM1", new DoubleType());
        query.addScalar("tyleDV1", new DoubleType());
        query.addScalar("soTDV1", new DoubleType());
        query.addScalar("tyleTONG2", new DoubleType());
        query.addScalar("soTT2", new DoubleType());
        query.addScalar("rankTT2", new IntegerType());
        query.addScalar("tyleTM2", new DoubleType());
        query.addScalar("soTTM2", new DoubleType());
        query.addScalar("tyleDV2", new DoubleType());
        query.addScalar("soTDV2", new DoubleType());
        query.addScalar("tyleTONG3", new DoubleType());
        query.addScalar("soTT3", new DoubleType());
        query.addScalar("rankTT3", new IntegerType());
        query.addScalar("tyleTM3", new DoubleType());
        query.addScalar("soTTM3", new DoubleType());
        query.addScalar("tyleDV3", new DoubleType());
        query.addScalar("soTDV3", new DoubleType());

        return query.list();
    }

    public AIORpImplementDTO implementTotal(AIORpImplementDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" with ");
        sql.append(" vung as (select cp.AREA_ID, cp.AREA_CODE, cp.CAT_PROVINCE_ID, cp.CODE, s.SYS_GROUP_ID, cp.NAME from SYS_GROUP s");
        sql.append(" LEFT join CAT_PROVINCE cp on s.PROVINCE_ID = cp.CAT_PROVINCE_ID");
        sql.append(" where s.GROUP_LEVEL = 2 and s.CODE like '%TTKT%'),");
        sql.append(" tbl as(");
        sql.append(" select");
        sql.append(" s.AREA_CODE, s.PROVINCE_CODE, cp.NAME,");
        sql.append(" sum(case when  c.status !=4 then 1 else 0 end) KHT, ");
        sql.append(" sum(case when c.status = 3 and ((cp.END_DATE - cp.START_DATE)*24) <=24 then 1 else 0 end) thuchien_TONG_1ngay, ");
        sql.append(" sum(case when c.status = 3 and ((cp.END_DATE - cp.START_DATE)*24) <=48 then 1 else 0 end) thuchien_TONG_2ngay, ");
        sql.append(" sum(case when c.status = 3 and ((cp.END_DATE - cp.START_DATE)*24) <=72 then 1 else 0 end) thuchien_TONG_3ngay, ");
        sql.append(" ");
        sql.append(" sum(case when c.type = 2 and c.status !=4 then 1 else 0 end) KH_TM, ");
        sql.append(" sum(case when c.status = 3 and c.type = 2 and ((cp.END_DATE - cp.START_DATE)*24) <=24 then 1 else 0 end) thuchien_TM_1ngay, ");
        sql.append(" sum(case when c.status = 3 and c.type = 2 and ((cp.END_DATE - cp.START_DATE)*24) <=48 then 1 else 0 end) thuchien_TM_2ngay, ");
        sql.append(" sum(case when c.status = 3 and c.type = 2 and ((cp.END_DATE - cp.START_DATE)*24) <=72 then 1 else 0 end) thuchien_TM_3ngay, ");
        sql.append(" ");
        sql.append(" sum(case when c.type = 1 and c.status !=4 then 1 else 0 end) KH_DV, ");
        sql.append(" sum(case when c.status = 3 and c.type = 1 and ((cp.END_DATE - cp.START_DATE)*24) <=24 then 1 else 0 end) thuchien_DV_1ngay, ");
        sql.append(" sum(case when c.status = 3 and c.type = 1 and ((cp.END_DATE - cp.START_DATE)*24) <=48 then 1 else 0 end) thuchien_DV_2ngay, ");
        sql.append(" sum(case when c.status = 3 and c.type = 1 and ((cp.END_DATE - cp.START_DATE)*24) <=72 then 1 else 0 end) thuchien_DV_3ngay ");
        sql.append(" from AIO_CONTRACT c ");
        sql.append(" left join AIO_CONTRACT_PERFORM_DATE cp on c.CONTRACT_ID = cp.CONTRACT_ID ");
        sql.append(" left join SYS_GROUP s on c.PERFORMER_GROUP_ID = s.SYS_GROUP_ID ");
        sql.append(" left join CAT_PROVINCE cp on cp.CAT_PROVINCE_ID = s.PROVINCE_ID ");
        sql.append(" where 1 =1 ");
        if (obj.getStartDate() != null) {
            sql.append(" and trunc(c.CREATED_DATE) >= trunc(:startDate) ");
        }
        if (obj.getEndDate() != null) {
            sql.append(" and trunc(c.CREATED_DATE) <= trunc(:endDate) ");
        }
        sql.append(" group by s.AREA_CODE, s.PROVINCE_CODE, cp.NAME ");
        sql.append(" ) ");
        sql.append(" select areaCode, provinceName, provinceCode, ");
        sql.append(" tyleTONG1, soTT1, tyleTM1, soTTM1, tyleDV1, soTDV1,");
        sql.append(" tyleTONG2, soTT2, tyleTM2, soTTM2, tyleDV2, soTDV2,");
        sql.append(" tyleTONG3, soTT3, tyleTM3, soTTM3, tyleDV3, soTDV3");
        sql.append(" from (");
        sql.append(" select ");
        sql.append(" 'TQ' areaCode, count(v.code) || ' tỉnh' provinceName, 'TQ' provinceCode, ");
        sql.append(" round(decode(sum(tbl.KHT),0,0,100*sum(tbl.thuchien_TONG_1ngay)/sum(tbl.KHT)),2) tyleTONG1, ");
        sql.append(" round(((85 -round(decode(sum(tbl.KHT),0,0,100*sum(tbl.thuchien_TONG_1ngay)/sum(tbl.KHT)),2))/15),2) soTT1, ");
        sql.append(" ");
        sql.append(" round(decode(sum(tbl.KH_TM),0,0,100*sum(tbl.thuchien_TM_1ngay)/sum(tbl.KH_TM)),2) tyleTM1, ");
        sql.append(" round(((85 -round(decode(sum(tbl.KH_TM),0,0,100*sum(tbl.thuchien_TM_1ngay)/sum(tbl.KH_TM)),2))/15),2) soTTM1, ");
        sql.append(" ");
        sql.append(" round(decode(sum(tbl.KH_DV),0,0,100*sum(tbl.thuchien_DV_1ngay)/sum(tbl.KH_DV)),2) tyleDV1, ");
        sql.append(" round(((85 -round(decode(sum(tbl.KH_DV),0,0,100*sum(tbl.thuchien_DV_1ngay)/sum(tbl.KH_DV)),2))/15),2) soTDV1, ");
        sql.append(" ");
        sql.append(" round(decode(sum(tbl.KHT),0,0,100*sum(tbl.thuchien_TONG_2ngay)/sum(tbl.KHT)),2) tyleTONG2, ");
        sql.append(" round(((90 -round(decode(sum(tbl.KHT),0,0,100*sum(tbl.thuchien_TONG_2ngay)/sum(tbl.KHT)),2))/10),2) soTT2, ");
        sql.append(" ");
        sql.append(" round(decode(sum(tbl.KH_TM),0,0,100*sum(tbl.thuchien_TM_2ngay)/sum(tbl.KH_TM)),2) tyleTM2, ");
        sql.append(" round(((90 -round(decode(sum(tbl.KH_TM),0,0,100*sum(tbl.thuchien_TM_2ngay)/sum(tbl.KH_TM)),2))/10),2) soTTM2, ");
        sql.append(" ");
        sql.append(" round(decode(sum(tbl.KH_DV),0,0,100*sum(tbl.thuchien_DV_2ngay)/sum(tbl.KH_DV)),2) tyleDV2, ");
        sql.append(" round(((90 -round(decode(sum(tbl.KH_DV),0,0,100*sum(tbl.thuchien_DV_2ngay)/sum(tbl.KH_DV)),2))/10),2) soTDV2, ");
        sql.append(" ");
        sql.append(" round(decode(sum(tbl.KHT),0,0,100*sum(tbl.thuchien_TONG_3ngay)/sum(tbl.KHT)),2) tyleTONG3, ");
        sql.append(" 100- round(decode(sum(tbl.KHT),0,0,100*sum(tbl.thuchien_TONG_3ngay)/sum(tbl.KHT)),2) soTT3, ");
        sql.append(" ");
        sql.append(" round(decode(sum(tbl.KH_TM),0,0,100*sum(tbl.thuchien_TM_3ngay)/sum(tbl.KH_TM)),2) tyleTM3, ");
        sql.append(" 100 - round(decode(sum(tbl.KH_TM),0,0,100*sum(tbl.thuchien_TM_3ngay)/sum(tbl.KH_TM)),2) soTTM3, ");
        sql.append(" ");
        sql.append(" round(decode(sum(tbl.KH_DV),0,0,100*sum(tbl.thuchien_DV_3ngay)/sum(tbl.KH_DV)),2) tyleDV3, ");
        sql.append(" 100 - round(decode(sum(tbl.KH_DV),0,0,100*sum(tbl.thuchien_DV_3ngay)/sum(tbl.KH_DV)),2) soTDV3 ");
        sql.append(" from vung v ");
        sql.append("  left join  tbl on v.CODE = tbl.PROVINCE_CODE ");
        sql.append(" ) ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());

        if (obj.getStartDate() != null) {
            query.setParameter("startDate", obj.getStartDate());

        }
        if (obj.getEndDate() != null) {
            query.setParameter("endDate", obj.getEndDate());
        }
        query.setResultTransformer(Transformers.aliasToBean(AIORpImplementDTO.class));
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("provinceName", new StringType());
        query.addScalar("tyleTONG1", new DoubleType());
        query.addScalar("soTT1", new DoubleType());
        query.addScalar("tyleTM1", new DoubleType());
        query.addScalar("soTTM1", new DoubleType());
        query.addScalar("tyleDV1", new DoubleType());
        query.addScalar("soTDV1", new DoubleType());
        query.addScalar("tyleTONG2", new DoubleType());
        query.addScalar("soTT2", new DoubleType());
        query.addScalar("tyleTM2", new DoubleType());
        query.addScalar("soTTM2", new DoubleType());
        query.addScalar("tyleDV2", new DoubleType());
        query.addScalar("soTDV2", new DoubleType());
        query.addScalar("tyleTONG3", new DoubleType());
        query.addScalar("soTT3", new DoubleType());
        query.addScalar("tyleTM3", new DoubleType());
        query.addScalar("soTTM3", new DoubleType());
        query.addScalar("tyleDV3", new DoubleType());
        query.addScalar("soTDV3", new DoubleType());

        Object ret = query.uniqueResult();
        if (ret != null)
            return (AIORpImplementDTO) ret;
        return new AIORpImplementDTO();
    }
}
