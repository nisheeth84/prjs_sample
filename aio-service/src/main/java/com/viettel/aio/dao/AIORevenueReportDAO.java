package com.viettel.aio.dao;

import com.viettel.aio.dto.AIORevenueDailyDTO;
import com.viettel.aio.dto.AIORevenueReportDTO;
import com.viettel.aio.dto.AIORevenueReportSearchDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@EnableTransactionManagement
@Transactional
@Repository("aioRevenueReportDAO")
public class AIORevenueReportDAO extends BaseFWDAOImpl<BaseFWModelImpl, Long> {
    public List<AIORevenueReportDTO> revenueByArea(AIORevenueReportSearchDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" with ");
        sql.append(" vung as (select AREA_ID, AREA_CODE, PROVINCE_ID, PROVINCE_CODE, SYS_GROUP_ID, NAME from SYS_GROUP where GROUP_LEVEL = 2 and CODE like '%TTKT%') ");
        sql.append(" , ");
        sql.append(" tbl as ( ");
        sql.append(" select s.AREA_CODE, s.PROVINCE_CODE, s.NAME,  mpd.TARGETS_AMOUNT, mpd.TARGETS_AMOUNT_DV, 0 THT,0 THTM,0 THDV,0 DT,0 DL,0 DGD,0 TBNL,0 TBNN,0 DV  from AIO_MONTH_PLAN mp ");
        sql.append("   inner join AIO_MONTH_PLAN_DETAIL mpd on mp.AIO_MONTH_PLAN_ID = mpd.MONTH_PLAN_ID ");
        sql.append("   LEFT join SYS_GROUP s on mpd.SYS_GROUP_ID = s.SYS_GROUP_ID ");
        sql.append("   where mp.status=1 ");
        if (StringUtils.isNotEmpty(obj.getMonth())) {
            sql.append("   and mp.MONTH||'/'|| mp.YEAR = :month ");
        }
        sql.append(" union all ");
        sql.append("   select s.AREA_CODE, s.PROVINCE_CODE, s.NAME, 0 TARGETS_AMOUNT_TM, 0 TARGETS_AMOUNT_DV, ");
        sql.append("   (ar.AMOUNT) THT, ");
        sql.append(" (case when ar.TYPE = 2 then ar.AMOUNT else 0 end) THTM, ");
        sql.append(" (case when ar.TYPE = 1 then ar.AMOUNT else 0 end) THDV, ");
        sql.append(" (case when cs.INDUSTRY_ID = 1 then ar.AMOUNT else 0 end) DT, ");
        sql.append(" (case when cs.INDUSTRY_ID = 2 then ar.AMOUNT else 0 end) DL, ");
        sql.append(" (case when cs.INDUSTRY_ID = 3 then ar.AMOUNT else 0 end) DGD, ");
        sql.append(" (case when cs.INDUSTRY_ID = 4 then ar.AMOUNT else 0 end) TBNL, ");
        sql.append(" (case when cs.INDUSTRY_ID = 5 then ar.AMOUNT else 0 end) TBNN, ");
        sql.append(" (case when cs.INDUSTRY_ID = 6 then ar.AMOUNT else 0 end) DV ");
        sql.append("   from AIO_CONTRACT c ");
        sql.append("   left join AIO_ACCEPTANCE_RECORDS ar on c.CONTRACT_ID = ar.CONTRACT_ID ");
        sql.append("   left join AIO_PACKAGE p on ar.PACKAGE_ID = p.AIO_PACKAGE_ID ");
        sql.append("   left join AIO_CONFIG_SERVICE cs on cs.AIO_CONFIG_SERVICE_ID = p.SERVICE_ID ");
        sql.append("   left join SYS_GROUP s on s.SYS_GROUP_ID = c.PERFORMER_GROUP_ID ");
        sql.append("   where c.status = 3 ");
        if (obj.getFromDate() != null) {
            sql.append("   and trunc(ar.end_date) >= trunc(:fromDate) ");
        }
        if (obj.getToDate() != null) {
            sql.append("   and trunc(ar.end_date) <= trunc(:toDate) ");
        }
        sql.append("  ) ");
        sql.append(" select areaCode, RANK() OVER ( ORDER BY TLT desc, THT desc) rank, ");
        sql.append("     THT, KHT, TLT, khTM, THTM, TLTM, khdv, THDV, TLDV, DT, DL, DGD, TBNL, TBNN, DV ");
        sql.append("  from ( ");
        sql.append("   select v.AREA_CODE areaCode, ");
        sql.append("   nvl(sum(tbl.TARGETS_AMOUNT)+sum(tbl.TARGETS_AMOUNT_DV), 0) KHT, nvl(sum(tbl.THT), 0) THT, ");
        sql.append("   nvl(decode(sum(tbl.TARGETS_AMOUNT)+sum(tbl.TARGETS_AMOUNT_DV), 0, 0,round(sum(tbl.THT)/(sum(tbl.TARGETS_AMOUNT)+sum(tbl.TARGETS_AMOUNT_DV))*100, 2)), 0)  TLT, ");
        sql.append("   nvl(sum(tbl.TARGETS_AMOUNT), 0) khTM , nvl(sum(tbl.THTM), 0) THTM, ");
        sql.append("   nvl(decode(sum(tbl.TARGETS_AMOUNT), 0, 0, round(sum(tbl.THTM)/sum(tbl.TARGETS_AMOUNT)*100, 2)), 0) TLTM, ");
        sql.append("   nvl(sum(tbl.TARGETS_AMOUNT_DV), 0) khdv, nvl(sum(tbl.THDV), 0) THDV, ");
        sql.append("   nvl(decode(sum(tbl.TARGETS_AMOUNT_DV), 0, 0, round(sum(tbl.THDV)/sum(tbl.TARGETS_AMOUNT_DV)*100, 2)), 0) TLDV, ");
        sql.append("   nvl(sum(tbl.DT), 0) DT, nvl(sum(tbl.DL), 0) DL, nvl(sum(tbl.DGD), 0) DGD, nvl(sum(tbl.TBNL), 0) TBNL, nvl(sum(tbl.TBNN), 0) TBNN, nvl(sum(tbl.DV), 0) DV ");
        sql.append("   from ");
        sql.append("  vung v ");
        sql.append("  left join  tbl on v.PROVINCE_CODE = tbl.PROVINCE_CODE ");
        sql.append("   group by v.AREA_CODE ) ");
        sql.append("   order by areaCode ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        if (StringUtils.isNotEmpty(obj.getMonth())) {
            query.setParameter("month", obj.getMonth());
        }
        if (obj.getFromDate() != null) {
            query.setParameter("fromDate", obj.getFromDate());
        }
        if (obj.getToDate() != null) {
            query.setParameter("toDate", obj.getToDate());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORevenueReportDTO.class));

        query.addScalar("areaCode", new StringType());
        query.addScalar("rank", new IntegerType());
        query.addScalar("kht", new DoubleType());
        query.addScalar("tht", new DoubleType());
        query.addScalar("tlt", new DoubleType());
        query.addScalar("khtm", new DoubleType());
        query.addScalar("thtm", new DoubleType());
        query.addScalar("tltm", new DoubleType());
        query.addScalar("khdv", new DoubleType());
        query.addScalar("thdv", new DoubleType());
        query.addScalar("tldv", new DoubleType());
        query.addScalar("dt", new DoubleType());
        query.addScalar("dl", new DoubleType());
        query.addScalar("dgd", new DoubleType());
        query.addScalar("tbnl", new DoubleType());
        query.addScalar("tbnn", new DoubleType());
        query.addScalar("dv", new DoubleType());

        return query.list();
    }

    public List<AIORevenueReportDTO> revenueByProvince(AIORevenueReportSearchDTO obj) {

        StringBuilder sql2 = new StringBuilder();
        sql2.append("with " +
                "vung as (select AREA_ID, AREA_CODE, PROVINCE_ID, PROVINCE_CODE, SYS_GROUP_ID, NAME from SYS_GROUP where GROUP_LEVEL = 2 and CODE like '%TTKT%')," +
                "tbl as (" +
                "select s.AREA_CODE, s.PROVINCE_CODE, s.NAME,  mpd.TARGETS_ME, mpd.TARGETS_SH, mpd.TARGETS_NLMT,mpd.TARGETS_ICT,mpd.TARGETS_MS, 0 THT,0 THME,0 THSH,0 THNLMT,0 THICT,0 THMS " +
                "from AIO_MONTH_PLAN mp" +
                "  inner join AIO_MONTH_PLAN_DETAIL mpd on mp.AIO_MONTH_PLAN_ID = mpd.MONTH_PLAN_ID" +
                "  LEFT join SYS_GROUP s on mpd.SYS_GROUP_ID = s.SYS_GROUP_ID" +
                "  where mp.status=1  ");
        if (obj.getMonth() != null) {
            sql2.append(" and mp.MONTH||'/'|| mp.YEAR = :month ");
        }
        sql2.append(
                "union all" +
                        "  select s.AREA_CODE, s.PROVINCE_CODE, s.NAME, 0 TARGETS_ME, 0 TARGETS_SH, 0 TARGETS_NLMT, 0 TARGETS_ICT, 0 TARGETS_MS," +
                        "  round(ar.AMOUNT/1.1,0) THT, " +
                        "(case when cs.INDUSTRY_ID = 2 then round(ar.AMOUNT/1.1,0) else 0 end) THME," +
                        "(case when cs.INDUSTRY_ID = 9 then round(ar.AMOUNT/1.1,0) else 0 end) THSH," +
                        "(case when cs.INDUSTRY_ID = 4 then round(ar.AMOUNT/1.1,0) else 0 end) THNLMT," +
                        "(case when cs.INDUSTRY_ID = 7 then round(ar.AMOUNT/1.1,0) else 0 end) THICT," +
                        "(case when cs.INDUSTRY_ID = 6 then round(ar.AMOUNT/1.1,0) else 0 end) THMS" +
                        "  from AIO_CONTRACT c" +
                        "  left join AIO_ACCEPTANCE_RECORDS ar on c.CONTRACT_ID = ar.CONTRACT_ID" +
                        "  left join AIO_CONTRACT_PERFORM_DATE cp on c.CONTRACT_ID = cp.CONTRACT_ID" +
                        "  left join AIO_PACKAGE p on ar.PACKAGE_ID = p.AIO_PACKAGE_ID" +
                        "  left join AIO_CONFIG_SERVICE cs on cs.AIO_CONFIG_SERVICE_ID = p.SERVICE_ID" +
                        "  left join SYS_GROUP s on s.SYS_GROUP_ID = c.PERFORMER_GROUP_ID" +
                        "  where c.status = 3 ");
        if (obj.getFromDate() != null) {
            sql2.append(" and trunc(cp.end_date) >= trunc(:fromDate) ");
        }
        if (obj.getToDate() != null) {
            sql2.append(" and trunc(cp.end_date) <= trunc(:toDate) ");
        }
        sql2.append(" )" +
                " select areaCode,provinceCode,name,tlt,tlme ,tlsh ,tlms,tlict,tlnlmt, kht,tht,khme,thme,khsh,thsh,khnlmt,thnlmt,khict,thict,khms,thms,RANK() OVER ( ORDER BY TLT desc, THT desc) rank,sysGroupId  from (select v.AREA_CODE areaCode,v.PROVINCE_CODE provinceCode,v.NAME name,v.SYS_GROUP_ID sysGroupId,    " +
                "  sum(nvl(tbl.TARGETS_ME,0) + nvl(tbl.TARGETS_SH,0)+ nvl(tbl.TARGETS_NLMT,0) +nvl(tbl.TARGETS_ICT,0) +nvl(tbl.TARGETS_MS,0)) KHT, sum(nvl(tbl.THT,0)) THT,    " +
                "  sum(nvl(tbl.TARGETS_ME,0)) KHME ,   sum(nvl(tbl.THME,0)) THME,    " +
                "  sum(nvl(tbl.TARGETS_SH,0)) KHSH ,   sum(nvl(tbl.THSH,0)) THSH,    " +
                "  sum(nvl(tbl.TARGETS_NLMT,0)) KHNLMT ,   sum(nvl(tbl.THNLMT,0)) THNLMT,    " +
                "  sum(nvl(tbl.TARGETS_ICT,0)) KHICT,   sum(nvl(tbl.THICT,0)) THICT,    " +
                "  sum(nvl(tbl.TARGETS_MS,0)) KHMS ,   sum(nvl(tbl.THMS,0)) THMS ,    " +
                "  decode( sum(nvl(tbl.TARGETS_ME,0) + nvl(tbl.TARGETS_SH,0)+ nvl(tbl.TARGETS_NLMT,0) +nvl(tbl.TARGETS_ICT,0) +nvl(tbl.TARGETS_MS,0)) , 0 , 100 ,  round(sum(nvl(tbl.THT,0))/sum(nvl(tbl.TARGETS_ME,0) + nvl(tbl.TARGETS_SH,0)+ nvl(tbl.TARGETS_NLMT,0) +nvl(tbl.TARGETS_ICT,0) +nvl(tbl.TARGETS_MS,0))* 100,2)) tlt,    " +
                "  decode( sum(nvl(tbl.TARGETS_ME,0)) , 0 , 100 ,  round(sum(nvl(tbl.THME,0))/sum(nvl(tbl.TARGETS_ME,0))* 100,3)) tlme ,    " +
                "  decode( sum(nvl(tbl.TARGETS_NLMT,0)) , 0 , 100 ,  round(sum(nvl(tbl.THNLMT,0))/sum(nvl(tbl.TARGETS_NLMT,0))* 100,3)) tlnlmt,    " +
                "  decode( sum(nvl(tbl.TARGETS_ICT,0)) , 0 , 100 ,  round(sum(nvl(tbl.THICT,0))/sum(nvl(tbl.TARGETS_ICT,0))* 100,3)) tlict,    " +
                "  decode( sum(nvl(tbl.TARGETS_MS,0)) , 0 , 100 ,  round(sum(nvl(tbl.THMS,0))/sum(nvl(tbl.TARGETS_MS,0))* 100,3)) tlms ,    " +
                "  decode( sum(nvl(tbl.TARGETS_SH,0)) , 0 , 100 ,  round(sum(nvl(tbl.THSH,0))/sum(nvl(tbl.TARGETS_SH,0))* 100,3)) tlsh    " +
                "    " +
                "  from  vung v    " +
                "  left join  tbl on v.PROVINCE_CODE = tbl.PROVINCE_CODE    " +
                "  group by v.AREA_CODE,v.PROVINCE_CODE,v.NAME,v.SYS_GROUP_ID) where 1 = 1 ");
        if (obj.getSysGroupId() != null) {
            sql2.append(" and sysGroupId = :sysGroupId ");
        }
        if (obj.getAreaCodes().size() > 0) {
            sql2.append(" and areaCode in :areaCodes ");
        }
        sql2.append(" order by areaCode , provinceCode  asc ");
        SQLQuery query = getSession().createSQLQuery(sql2.toString());
        SQLQuery queryCount = getSession().createSQLQuery("Select count(*) from (" + sql2.toString() + ")");

        if (obj.getMonth() != null) {
            query.setParameter("month", obj.getMonth());
            queryCount.setParameter("month", obj.getMonth());
        }
        if (obj.getFromDate() != null) {
            query.setParameter("fromDate", obj.getFromDate());
            queryCount.setParameter("fromDate", obj.getFromDate());
        }
        if (obj.getToDate() != null) {
            query.setParameter("toDate", obj.getToDate());
            queryCount.setParameter("toDate", obj.getToDate());
        }
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
        }
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            query.setParameterList("areaCodes", obj.getAreaCodes());
            queryCount.setParameterList("areaCodes", obj.getAreaCodes());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORevenueReportDTO.class));

        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("rank", new IntegerType());
        query.addScalar("kht", new DoubleType());
        query.addScalar("tht", new DoubleType());
        query.addScalar("khme", new DoubleType());
        query.addScalar("thme", new DoubleType());
        query.addScalar("khsh", new DoubleType());
        query.addScalar("thsh", new DoubleType());
        query.addScalar("khnlmt", new DoubleType());
        query.addScalar("thnlmt", new DoubleType());
        query.addScalar("khict", new DoubleType());
        query.addScalar("thict", new DoubleType());
        query.addScalar("khms", new DoubleType());
        query.addScalar("thms", new DoubleType());

        query.addScalar("tlt", new DoubleType());
        query.addScalar("tlms", new DoubleType());
        query.addScalar("tlsh", new DoubleType());
        query.addScalar("tlnlmt", new DoubleType());
        query.addScalar("tlict", new DoubleType());
        query.addScalar("tlme", new DoubleType());

        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1)
                    * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<AIORevenueReportDTO> revenueByGroup(AIORevenueReportSearchDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append("with   " +
                "vung as (select AREA_ID, AREA_CODE, PROVINCE_ID, PROVINCE_CODE, SYS_GROUP_ID, NAME from SYS_GROUP where GROUP_LEVEL = 3 and CODE like '%TTKT%' and status = 1),  " +
                "tbl as (  " +
                "select s.AREA_CODE, s.PROVINCE_CODE, s.NAME,s.SYS_GROUP_ID,  spd.TARGETS_ME, spd.TARGETS_SH, spd.TARGETS_NLMT,spd.TARGETS_ICT,spd.TARGETS_MS, 0 THT,0 THME,0 THSH,0 THNLMT,0 THICT,0 THMS  " +
                "from AIO_STAFF_PLAN sp  " +
                "  inner join AIO_STAFF_PLAN_DETAIL spd on sp.STAFF_PLAN_ID= spd.AIO_STAFF_PLAN_ID  " +
                "  LEFT join SYS_GROUP s on spd.SYS_GROUP_ID = s.SYS_GROUP_ID  " +
                "  where sp.status=1 ");
        if (obj.getMonth() != null) {
            sql.append(" and sp.MONTH||'/'|| sp.YEAR = :month ");
        }

        sql.append("union all  " +
                "  select s.AREA_CODE, s.PROVINCE_CODE, s.NAME, s.SYS_GROUP_ID, 0 TARGETS_ME, 0 TARGETS_SH, 0 TARGETS_NLMT, 0 TARGETS_ICT,0 TARGETS_MS,  " +
                "  round(ar.AMOUNT/1.1,0) THT,   " +
                "(case when cs.INDUSTRY_ID = 2 then round(ar.AMOUNT/1.1,0) else 0 end) THME,  " +
                "(case when cs.INDUSTRY_ID = 9 then round(ar.AMOUNT/1.1,0) else 0 end) THSH,  " +
                "(case when cs.INDUSTRY_ID = 4 then round(ar.AMOUNT/1.1,0) else 0 end) THNLMT,  " +
                "(case when cs.INDUSTRY_ID = 7 then round(ar.AMOUNT/1.1,0) else 0 end) THICT,  " +
                "(case when cs.INDUSTRY_ID = 6 then round(ar.AMOUNT/1.1,0) else 0 end) THMS  " +
                "  from AIO_CONTRACT c  " +
                "  left join AIO_ACCEPTANCE_RECORDS ar on c.CONTRACT_ID = ar.CONTRACT_ID  " +
                "  left join AIO_CONTRACT_PERFORM_DATE cp on c.CONTRACT_ID = cp.CONTRACT_ID  " +
                "  left join AIO_PACKAGE p on ar.PACKAGE_ID = p.AIO_PACKAGE_ID  " +
                "  left join AIO_CONFIG_SERVICE cs on cs.AIO_CONFIG_SERVICE_ID = p.SERVICE_ID  " +
                "  left join SYS_USER su on c.PERFORMER_ID = su.SYS_USER_ID  " +
                "  left join SYS_GROUP s on s.SYS_GROUP_ID = su.SYS_GROUP_ID  " +
                "  where c.status = 3 ");
        if (obj.getFromDate() != null) {
            sql.append(" and trunc(cp.end_date) >= trunc (:fromDate) ");
        }
        if (obj.getToDate() != null) {
            sql.append(" and trunc(cp.end_date) <=trunc (:toDate) ");
        }
        sql.append(" )  " +
                "  select areaCode , provinceCode , name,tlt,tlme,tlnlmt,tlict,tlsh,tlms ,kht,tht , khme,thme,khnlmt,thnlmt , khsh,thsh,khict,thict,khms,thms,RANK() OVER ( ORDER BY TLT desc, THT desc) rank , sysGroupId from (select v.AREA_CODE areaCode,v.PROVINCE_CODE provinceCode,v.NAME name, v.SYS_GROUP_ID sysGroupId,     " +
                "  sum(nvl(tbl.TARGETS_ME,0) + nvl(tbl.TARGETS_SH,0)+ nvl(tbl.TARGETS_NLMT,0) +nvl(tbl.TARGETS_ICT,0) +nvl(tbl.TARGETS_MS,0)) KHT, sum(nvl(tbl.THT,0)) THT,    " +
                "  sum(nvl(tbl.TARGETS_ME,0)) KHME ,   sum(nvl(tbl.THME,0)) THME,    " +
                "  sum(nvl(tbl.TARGETS_SH,0)) KHSH ,   sum(nvl(tbl.THSH,0)) THSH,    " +
                "  sum(nvl(tbl.TARGETS_NLMT,0)) KHNLMT ,   sum(nvl(tbl.THNLMT,0)) THNLMT,    " +
                "  sum(nvl(tbl.TARGETS_ICT,0)) KHICT,   sum(nvl(tbl.THICT,0)) THICT,    " +
                "  sum(nvl(tbl.TARGETS_MS,0)) KHMS ,   sum(nvl(tbl.THMS,0)) THMS,    " +
                "  decode( sum(nvl(tbl.TARGETS_ME,0) + nvl(tbl.TARGETS_SH,0)+ nvl(tbl.TARGETS_NLMT,0) +nvl(tbl.TARGETS_ICT,0) +nvl(tbl.TARGETS_MS,0)) , 0 , 100 ,  round(sum(nvl(tbl.THT,0))/sum(nvl(tbl.TARGETS_ME,0) + nvl(tbl.TARGETS_SH,0)+ nvl(tbl.TARGETS_NLMT,0) +nvl(tbl.TARGETS_ICT,0) +nvl(tbl.TARGETS_MS,0))* 100,2)) tlt,    " +
                "  decode( sum(nvl(tbl.TARGETS_ME,0)) , 0 , 100 ,  round(sum(nvl(tbl.THME,0))/sum(nvl(tbl.TARGETS_ME,0))* 100,3)) tlme ,    " +
                "  decode( sum(nvl(tbl.TARGETS_NLMT,0)) , 0 , 100 ,  round(sum(nvl(tbl.THNLMT,0))/sum(nvl(tbl.TARGETS_NLMT,0))* 100,3)) tlnlmt,    " +
                "  decode( sum(nvl(tbl.TARGETS_ICT,0)) , 0 , 100 ,  round(sum(nvl(tbl.THICT,0))/sum(nvl(tbl.TARGETS_ICT,0))* 100,3)) tlict,    " +
                "  decode( sum(nvl(tbl.TARGETS_MS,0)) , 0 , 100 ,  round(sum(nvl(tbl.THMS,0))/sum(nvl(tbl.TARGETS_MS,0))* 100,3)) tlms ,    " +
                "  decode( sum(nvl(tbl.TARGETS_SH,0)) , 0 , 100 ,  round(sum(nvl(tbl.THSH,0))/sum(nvl(tbl.TARGETS_SH,0))* 100,3)) tlsh    " +
                "  from     " +
                "  vung v    " +
                "  left join  tbl on v.SYS_GROUP_ID = tbl.SYS_GROUP_ID    " +
                "  group by v.AREA_CODE,v.PROVINCE_CODE,v.NAME , v.SYS_GROUP_ID    " +
                "  ORDER BY v.AREA_CODE,v.PROVINCE_CODE,v.NAME) where 1 = 1 ");
        if (obj.getSysGroupId() != null) {
            sql.append(" and sysGroupId = :sysGroupId ");
        }
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            sql.append(" and areaCode in :areaCodes ");
        }
        sql.append(" order by areaCode , provinceCode  asc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("Select count(*) from (" + sql.toString() + ")");
        if (obj.getFromDate() != null) {
            query.setParameter("fromDate", obj.getFromDate());
            queryCount.setParameter("fromDate", obj.getFromDate());
        }
        if (obj.getToDate() != null) {
            query.setParameter("toDate", obj.getToDate());
            queryCount.setParameter("toDate", obj.getToDate());
        }
        if (obj.getMonth() != null) {
            query.setParameter("month", obj.getMonth());
            queryCount.setParameter("month", obj.getMonth());
        }
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
        }
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            query.setParameterList("areaCodes", obj.getAreaCodes());
            queryCount.setParameterList("areaCodes", obj.getAreaCodes());
        }
        query.setResultTransformer(Transformers.aliasToBean(AIORevenueReportDTO.class));

        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("rank", new IntegerType());
        query.addScalar("kht", new DoubleType());
        query.addScalar("tht", new DoubleType());
        query.addScalar("khme", new DoubleType());
        query.addScalar("thme", new DoubleType());
        query.addScalar("khsh", new DoubleType());
        query.addScalar("thsh", new DoubleType());
        query.addScalar("khnlmt", new DoubleType());
        query.addScalar("thnlmt", new DoubleType());
        query.addScalar("khict", new DoubleType());
        query.addScalar("thict", new DoubleType());
        query.addScalar("khms", new DoubleType());
        query.addScalar("thms", new DoubleType());

        query.addScalar("tlt", new DoubleType());
        query.addScalar("tlms", new DoubleType());
        query.addScalar("tlsh", new DoubleType());
        query.addScalar("tlnlmt", new DoubleType());
        query.addScalar("tlict", new DoubleType());
        query.addScalar("tlme", new DoubleType());

        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1)
                    * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<AIORevenueReportDTO> revenueByStaff(AIORevenueReportSearchDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append("  with    " +
                "  vung as (select sg.AREA_ID, sg.AREA_CODE, sg.PROVINCE_ID, sg.PROVINCE_CODE, sg.SYS_GROUP_ID, sg.NAME,su.SYS_USER_ID, su.FULL_NAME     " +
                "  from SYS_GROUP sg, SYS_USER su     " +
                "  where sg.SYS_GROUP_ID = su.SYS_GROUP_ID and su.STATUS = 1 and sg.STATUS = 1),    " +
                "  tbl as (    " +
                "  select s.AREA_CODE, s.PROVINCE_CODE, s.NAME, su.SYS_USER_ID, su.FULL_NAME,  spd.TARGETS_ME, spd.TARGETS_SH, spd.TARGETS_NLMT,spd.TARGETS_ICT,spd.TARGETS_MS, 0 THT,0 THME,0 THSH,0 THNLMT,0 THICT,0 THMS    " +
                "  from AIO_STAFF_PLAN sp    " +
                "  inner join AIO_STAFF_PLAN_DETAIL spd on sp.STAFF_PLAN_ID= spd.AIO_STAFF_PLAN_ID    " +
                "  LEFT join SYS_GROUP s on spd.SYS_GROUP_ID = s.SYS_GROUP_ID    " +
                "  LEFT join SYS_USER su on su.SYS_GROUP_ID = s.SYS_GROUP_ID    " +
                "  where sp.status=1  ");
        if (obj.getMonth() != null) {
            sql.append(" and sp.MONTH||'/'|| sp.YEAR = :month ");
        }
        sql.append("union all    " +
                "  select s.AREA_CODE, s.PROVINCE_CODE, s.NAME, su.SYS_USER_ID,su.FULL_NAME, 0 TARGETS_ME, 0 TARGETS_SH, 0 TARGETS_NLMT,0 TARGETS_ICT,0 TARGETS_MS,    " +
                "  round(ar.AMOUNT/1.1,0) THT,     " +
                "  (case when cs.INDUSTRY_ID = 2 then round(ar.AMOUNT/1.1,0) else 0 end) THME,    " +
                "  (case when cs.INDUSTRY_ID = 9 then round(ar.AMOUNT/1.1,0) else 0 end) THSH,    " +
                "  (case when cs.INDUSTRY_ID = 4 then round(ar.AMOUNT/1.1,0) else 0 end) THNLMT,    " +
                "  (case when cs.INDUSTRY_ID = 7 then round(ar.AMOUNT/1.1,0) else 0 end) THICT,    " +
                "  (case when cs.INDUSTRY_ID = 6 then round(ar.AMOUNT/1.1,0) else 0 end) THMS    " +
                "    " +
                "  from AIO_CONTRACT c    " +
                "  left join AIO_ACCEPTANCE_RECORDS ar on c.CONTRACT_ID = ar.CONTRACT_ID    " +
                "  left join AIO_CONTRACT_PERFORM_DATE cp on c.CONTRACT_ID = cp.CONTRACT_ID    " +
                "  left join AIO_PACKAGE p on ar.PACKAGE_ID = p.AIO_PACKAGE_ID    " +
                "  left join AIO_CONFIG_SERVICE cs on cs.AIO_CONFIG_SERVICE_ID = p.SERVICE_ID    " +
                "  left join SYS_USER su on c.PERFORMER_ID = su.SYS_USER_ID    " +
                "  left join SYS_GROUP s on s.SYS_GROUP_ID = su.SYS_GROUP_ID    " +
                "  where c.status = 3 ");
        if (obj.getFromDate() != null) {
            sql.append(" and trunc(cp.end_date) >= trunc (:fromDate) ");
        }
        if (obj.getToDate() != null) {
            sql.append(" and trunc(cp.end_date) <=trunc (:toDate) ");
        }
        sql.append(" )    " +
                "  select areaCode , provinceCode , name ,tlt,tlme,tlnlmt,tlict,tlsh,tlms , staffName , kht,tht , khme,thme,khsh,thsh,khnlmt,thnlmt,khict,thict,khms,thms,RANK() OVER ( ORDER BY TLT desc, THT desc) rank ,sysGroupId from (select v.AREA_CODE areaCode,v.PROVINCE_CODE provinceCode,v.NAME name,v.FULL_NAME staffName, v.SYS_GROUP_ID sysGroupId,    " +
                "  sum(nvl(tbl.TARGETS_ME,0) + nvl(tbl.TARGETS_SH,0)+ nvl(tbl.TARGETS_NLMT,0) +nvl(tbl.TARGETS_ICT,0) +nvl(tbl.TARGETS_MS,0)) KHT, sum(nvl(tbl.THT,0)) THT,    " +
                "  sum(nvl(tbl.TARGETS_ME,0)) KHME ,   sum(nvl(tbl.THME,0)) THME,    " +
                "  sum(nvl(tbl.TARGETS_SH,0)) KHSH ,   sum(nvl(tbl.THSH,0)) THSH,    " +
                "  sum(nvl(tbl.TARGETS_NLMT,0)) KHNLMT ,   sum(nvl(tbl.THNLMT,0)) THNLMT,    " +
                "  sum(nvl(tbl.TARGETS_ICT,0)) KHICT,   sum(nvl(tbl.THICT,0)) THICT,    " +
                "  sum(nvl(tbl.TARGETS_MS,0)) KHMS ,   sum(nvl(tbl.THMS,0)) THMS,    " +
                "  decode( sum(nvl(tbl.TARGETS_ME,0) + nvl(tbl.TARGETS_SH,0)+ nvl(tbl.TARGETS_NLMT,0) +nvl(tbl.TARGETS_ICT,0) +nvl(tbl.TARGETS_MS,0)) , 0 , 100 ,  round(sum(nvl(tbl.THT,0))/sum(nvl(tbl.TARGETS_ME,0) + nvl(tbl.TARGETS_SH,0)+ nvl(tbl.TARGETS_NLMT,0) +nvl(tbl.TARGETS_ICT,0) +nvl(tbl.TARGETS_MS,0))* 100,2)) tlt,    " +
                "  decode( sum(nvl(tbl.TARGETS_ME,0)) , 0 , 100 ,  round(sum(nvl(tbl.THME,0))/sum(nvl(tbl.TARGETS_ME,0))* 100,3)) tlme ,    " +
                "  decode( sum(nvl(tbl.TARGETS_NLMT,0)) , 0 , 100 ,  round(sum(nvl(tbl.THNLMT,0))/sum(nvl(tbl.TARGETS_NLMT,0))* 100,3)) tlnlmt,    " +
                "  decode( sum(nvl(tbl.TARGETS_ICT,0)) , 0 , 100 ,  round(sum(nvl(tbl.THICT,0))/sum(nvl(tbl.TARGETS_ICT,0))* 100,3)) tlict,    " +
                "  decode( sum(nvl(tbl.TARGETS_MS,0)) , 0 , 100 ,  round(sum(nvl(tbl.THMS,0))/sum(nvl(tbl.TARGETS_MS,0))* 100,3)) tlms ,    " +
                "  decode( sum(nvl(tbl.TARGETS_SH,0)) , 0 , 100 ,  round(sum(nvl(tbl.THSH,0))/sum(nvl(tbl.TARGETS_SH,0))* 100,3)) tlsh    " +
                "  from     " +
                "  vung v LEFT join tbl on v.SYS_USER_Id = tbl.SYS_USER_ID    " +
                "  group by v.AREA_CODE,v.PROVINCE_CODE,v.NAME,v.FULL_NAME,v.SYS_GROUP_ID) where 1 = 1 ");
        if (obj.getSysGroupId() != null) {
            sql.append(" and sysGroupId = :sysGroupId ");
        }
        if (obj.getAreaCodes().size() > 0) {
            sql.append(" and areaCode in :areaCodes ");
        }
        sql.append(" order by areaCode , provinceCode   asc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("Select count(*) from (" + sql.toString() + ")");

        if (StringUtils.isNotEmpty(obj.getMonth())) {
            query.setParameter("month", obj.getMonth());
            queryCount.setParameter("month", obj.getMonth());
        }
        if (obj.getFromDate() != null) {
            query.setParameter("fromDate", obj.getFromDate());
            queryCount.setParameter("fromDate", obj.getFromDate());
        }
        if (obj.getToDate() != null) {
            query.setParameter("toDate", obj.getToDate());
            queryCount.setParameter("toDate", obj.getToDate());
        }
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
        }
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            query.setParameterList("areaCodes", obj.getAreaCodes());
            queryCount.setParameterList("areaCodes", obj.getAreaCodes());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORevenueReportDTO.class));

        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("staffName", new StringType());
        query.addScalar("rank", new IntegerType());
        query.addScalar("kht", new DoubleType());
        query.addScalar("tht", new DoubleType());
        query.addScalar("khme", new DoubleType());
        query.addScalar("thme", new DoubleType());
        query.addScalar("khsh", new DoubleType());
        query.addScalar("thsh", new DoubleType());
        query.addScalar("khnlmt", new DoubleType());
        query.addScalar("thnlmt", new DoubleType());
        query.addScalar("khict", new DoubleType());
        query.addScalar("thict", new DoubleType());
        query.addScalar("khms", new DoubleType());
        query.addScalar("thms", new DoubleType());

        query.addScalar("tlt", new DoubleType());
        query.addScalar("tlms", new DoubleType());
        query.addScalar("tlsh", new DoubleType());
        query.addScalar("tlnlmt", new DoubleType());
        query.addScalar("tlict", new DoubleType());
        query.addScalar("tlme", new DoubleType());

        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1)
                    * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<AIORevenueDailyDTO> revenueDaily(AIORevenueReportSearchDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" with ");
        sql.append(" Vung ");
        sql.append(" as ");
        sql.append(" (select s.AREA_ID, s.AREA_CODE, s.PROVINCE_ID, s.PROVINCE_CODE,s.SYS_GROUP_ID, c.NAME from SYS_GROUP s ");
        sql.append(" left join CAT_PROVINCE c on c.CAT_PROVINCE_ID = s.PROVINCE_ID ");
        sql.append(" where s.GROUP_LEVEL = 2 and s.CODe like '%TTKT%' ");
        if (obj.getSysGroupIds() != null && !obj.getSysGroupIds().isEmpty()) {
            sql.append("and s.sys_group_id in (:sysGroupIds) ");
        }
        sql.append(" ), ");
        sql.append(" ");
        sql.append(" Thuc_hien ");
        sql.append(" as ( ");
        sql.append("   select  round(sum(ar.AMOUNT)/1.1, 0) AMOUNT , trunc(ar.end_date) end_date, c.PERFORMER_GROUP_ID ");
        sql.append("   from AIO_CONTRACT c ");
        sql.append("   left join AIO_ACCEPTANCE_RECORDS ar on c.CONTRACT_ID = ar.CONTRACT_ID ");
        sql.append(" ");
        sql.append("    where c.STATUS = 3 ");
//        sql.append("    and (c.is_internal IS NULL OR c.is_internal != 1) ");
        if (obj.getSysGroupIds() != null && !obj.getSysGroupIds().isEmpty()) {
            sql.append("and c.performer_group_id in (:sysGroupIds) ");
        }

        if (obj.getFromDate() != null) {
            sql.append(" and trunc(ar.end_date) >= trunc(:fromDate) ");
        }
        if (obj.getToDate() != null) {
            sql.append(" and trunc(ar.end_date) <= trunc(:toDate)");
        }
        sql.append("   group by trunc(ar.end_date), c.PERFORMER_GROUP_ID ");
        sql.append(" ) ");
        sql.append(" select * from ( ");
        sql.append(" SELECT  v.AREA_CODE areaCode, v.NAME name,v.PROVINCE_CODE provinceCode, th.end_date endDate, ");
        sql.append(" th.AMOUNT tht, v.SYS_GROUP_ID");
        sql.append(" FROM ");
        sql.append(" Vung v ");
        sql.append(" LEFT JOIN Thuc_hien th ON v.SYS_GROUP_ID = th.PERFORMER_GROUP_ID ");
        sql.append("  order by v.AREA_CODE, v.PROVINCE_CODE, v.NAME ) ");
        sql.append(" where 1 = 1 ");
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            sql.append("   and AREA_CODE in (:areaCodes) ");
        }
        if (obj.getSysGroupIds() != null && !obj.getSysGroupIds().isEmpty()) {
            sql.append("   and SYS_GROUP_ID in(:sysGroupIds) ");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        if (obj.getFromDate() != null) {
            query.setParameter("fromDate", obj.getFromDate());
        }
        if (obj.getToDate() != null) {
            query.setParameter("toDate", obj.getToDate());
        }
        if (obj.getSysGroupIds() != null && !obj.getSysGroupIds().isEmpty()) {
            query.setParameterList("sysGroupIds", obj.getSysGroupIds());
        }
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            query.setParameterList("areaCodes", obj.getAreaCodes());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORevenueDailyDTO.class));

        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("endDate", new DateType());
        query.addScalar("tht", new DoubleType());

        return query.list();
    }

    public List<AIORevenueReportSearchDTO> searchAreas(AIORevenueReportSearchDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" select AREA_CODE areaCode, AREA_ID areaId");
        sql.append(" from SYS_GROUP ");
        sql.append(" where AREA_ID is not null ");
        if (StringUtils.isNotEmpty(obj.getAreaCode())) {
            sql.append(" and upper(AREA_CODE) like upper(:keySearch) escape '\\'");
        }
        sql.append(" group by AREA_ID, AREA_CODE ");
        sql.append(" order by AREA_CODE ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("select count(*) from (" + sql.toString() + ")");

        if (StringUtils.isNotEmpty(obj.getAreaCode())) {
            query.setParameter("keySearch", '%' + obj.getAreaCode() + '%');
            queryCount.setParameter("keySearch", '%' + obj.getAreaCode() + '%');
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORevenueReportSearchDTO.class));
        query.addScalar("areaCode", new StringType());
        query.addScalar("areaId", new LongType());

        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<AIORevenueDailyDTO> revenueDailyByArea(AIORevenueReportSearchDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" with ");
        sql.append(" Vung as ");
        sql.append("     (select s.AREA_ID, s.AREA_CODE, s.PROVINCE_ID, s.PROVINCE_CODE,s.SYS_GROUP_ID, c.NAME from SYS_GROUP s ");
        sql.append("     left join CAT_PROVINCE c on c.CAT_PROVINCE_ID = s.PROVINCE_ID ");
        sql.append(" ), ");
        sql.append(" Thuc_hien as ( ");
        sql.append("   select  ar.AMOUNT , ar.end_date,   c.PERFORMER_GROUP_ID ");
        sql.append("   from AIO_CONTRACT c ");
        sql.append("   left join AIO_ACCEPTANCE_RECORDS ar on c.CONTRACT_ID = ar.CONTRACT_ID ");
        sql.append("    where c.STATUS = 3 ");
        sql.append(" ) ");
        sql.append(" SELECT ");
        sql.append("   v.AREA_CODE areaCode, trunc(th.end_date) endDate, ");
        sql.append("     sum(th.AMOUNT) THT ");
        sql.append(" FROM Vung v ");
        sql.append(" LEFT JOIN Thuc_hien th ");
        sql.append("     ON v.SYS_GROUP_ID = th.PERFORMER_GROUP_ID ");
        sql.append(" WHERE 1 = 1 ");
        sql.append("   and v.AREA_CODE is not null ");
        if (obj.getFromDate() != null) {
            sql.append(" and trunc(th.end_date) >= trunc(:fromDate) ");
        }
        if (obj.getToDate() != null) {
            sql.append(" and trunc(th.end_date) <= trunc(:toDate)");
        }

        sql.append(" group by  v.AREA_CODE, trunc(th.end_date) ");
        sql.append(" ORDER BY trunc(th.end_date) ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("Select count(*) from (" + sql.toString() + ")");

        if (obj.getFromDate() != null) {
            query.setParameter("fromDate", obj.getFromDate());
            queryCount.setParameter("fromDate", obj.getFromDate());
        }
        if (obj.getToDate() != null) {
            query.setParameter("toDate", obj.getToDate());
            queryCount.setParameter("toDate", obj.getToDate());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORevenueDailyDTO.class));

        query.addScalar("areaCode", new StringType());
        query.addScalar("endDate", new DateType());
        query.addScalar("tht", new DoubleType());

        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1)
                    * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }
}
