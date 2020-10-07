package com.viettel.aio.dao;

import com.viettel.aio.dto.report.AIORpIncidentDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.utils.ValidateUtils;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Created by HaiND on 9/26/2019 9:33 PM.
 */
@EnableTransactionManagement
@Transactional
@Repository("aioRpIncidentDAO")
public class AIORpIncidentDAO extends BaseFWDAOImpl<BaseFWModelImpl, Long> {

    public List<AIORpIncidentDTO> doSearchArea(AIORpIncidentDTO dto) {
        StringBuilder sql = new StringBuilder()
                .append("with tbl as (select distinct AREA_CODE, AREA_ID ")
                .append("from SYS_GROUP ")
                .append("where AREA_CODE is not null and AREA_ID is not null ");
        if (StringUtils.isNotEmpty(dto.getAreaCode())) {
            sql.append("and upper(AREA_CODE) LIKE upper(:keySearch) escape '&' ");
        }
        sql.append("order by AREA_CODE) ");
        sql.append("select AREA_CODE text, AREA_ID areaId ")
                .append("from tbl ")
                .append("where ROWNUM <=10 ");


        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (StringUtils.isNotEmpty(dto.getAreaCode())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(dto.getAreaCode()) + "%");
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORpIncidentDTO.class));
        query.addScalar("text", new StringType());
        query.addScalar("areaId", new LongType());

        return query.list();
    }

    public List<AIORpIncidentDTO> doSearchGroup(AIORpIncidentDTO dto) {
        StringBuilder sql = new StringBuilder()
                .append("SELECT ST.SYS_GROUP_ID groupId, ST.NAME text, ST.CODE groupCode ")
                .append("from CTCT_CAT_OWNER.SYS_GROUP ST ")
                .append("where ST.STATUS=1 and ROWNUM <=10 ");
        if (StringUtils.isNotEmpty(dto.getGroupName())) {
            sql.append("AND (upper(ST.NAME) LIKE upper(:groupName) escape '&' OR upper(ST.CODE) LIKE upper(:groupName) escape '&') ");
        }
        if (dto.getAreaId() != null) {
            sql.append("AND ST.AREA_ID = :areaId ");
        }
        sql.append("order by ST.CODE");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (StringUtils.isNotEmpty(dto.getGroupName())) {
            query.setParameter("groupName", "%" + ValidateUtils.validateKeySearch(dto.getGroupName()) + "%");
        }
        if (dto.getAreaId() != null) {
            query.setParameter("areaId", dto.getAreaId());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORpIncidentDTO.class));
        query.addScalar("groupId", new LongType());
        query.addScalar("text", new StringType());
        query.addScalar("groupCode", new StringType());

        return query.list();
    }

    public List<AIORpIncidentDTO> doSearchProvince(AIORpIncidentDTO dto) {
        StringBuilder sql = new StringBuilder();
        sql.append(" with ");
        sql.append(" vung as (select cp.AREA_ID, cp.AREA_CODE, cp.CAT_PROVINCE_ID, cp.CODE, s.SYS_GROUP_ID, cp.NAME from SYS_GROUP s ");
        sql.append(" LEFT join CAT_PROVINCE cp on s.PROVINCE_ID = cp.CAT_PROVINCE_ID ");
        sql.append(" where s.GROUP_LEVEL = 2 and s.CODE like '%TTKT%'), ");
        sql.append(" tbl as ");
        sql.append(" (select ");
        sql.append(" s.AREA_CODE, s.PROVINCE_CODE, cp.NAME, ");
        sql.append(" sum(case when  ard.status !=3 then 1 else 0 end) KHT, ");
        sql.append(" sum(case when ard.status = 4 and ((ard.ACTUAL_END_DATE - ar.SUPPORT_DATE)*24) <=12 then 1 else 0 end) thuchien_12h, ");
        sql.append(" sum(case when ard.status = 4 and ((ard.ACTUAL_END_DATE - ar.SUPPORT_DATE)*24) <=24 then 1 else 0 end) thuchien_24h, ");
        sql.append(" sum(case when ard.status = 4 and ((ard.ACTUAL_END_DATE - ar.SUPPORT_DATE)*24) <=48 then 1 else 0 end) thuchien_48h, ");
        sql.append(" max((select count(*) from AIO_CUSTOMER ac,AIO_AREA aa where ac.AIO_AREA_ID = aa.AREA_ID and aa.PROVINCE_ID = s.PROVINCE_ID))soKH ");
        sql.append(" from AIO_REGLECT_DETAIL ard ");
        sql.append(" left join AIO_REGLECT ar on ar.AIO_REGLECT_ID = ard.AIO_REGLECT_ID ");
        sql.append(" left join SYS_GROUP s on ar.PERFORMER_GROUP_ID = s.SYS_GROUP_ID ");
        sql.append(" left join CAT_PROVINCE cp on cp.CAT_PROVINCE_ID = s.PROVINCE_ID ");
        sql.append(" where 1 = 1 ");
        if (dto.getStartDate() != null) {
            sql.append(" and trunc(ar.CREATED_DATE)>= trunc(:startDate) ");
        }
        if (dto.getEndDate() != null) {
            sql.append(" and trunc(ar.CREATED_DATE)<= trunc(:endDate) ");
        }
        if (dto.getAreaId() != null) {
            sql.append(" and s.AREA_ID in (:areaId)");
        }
        if (dto.getGroupId() != null) {
            sql.append(" and ar.PERFORMER_GROUP_ID in (:groupId)");
        }
        sql.append(" group by s.AREA_CODE, s.PROVINCE_CODE, cp.NAME) ");
        sql.append(" select * from (");
        sql.append(" select areaCode, provinceCode, provinceName, incidentNo, ");
        sql.append(" perform12h, soTarget12h, perform24h, soTarget24h, perform48h, soTarget48h, ");
        sql.append(" case when soTarget12h is null then null else RANK() OVER (ORDER BY soTarget12h, perform12h) end rank12h, ");
        sql.append(" case when soTarget24h is null then null else RANK() OVER (ORDER BY soTarget24h, perform24h) end rank24h, ");
        sql.append(" case when soTarget48h is null then null else RANK() OVER (ORDER BY soTarget48h, perform48h) end rank48h ");
        sql.append(" from (");
        sql.append(" select v.AREA_CODE areaCode, v.CODE provinceCode, v.NAME provinceName, ");
        sql.append(" round(decode(soKH,0,0,(KHT*1000)/soKH),2) incidentNo, ");
        sql.append(" round(decode(KHT,0,0,100*thuchien_12h/KHT),2) perform12h, ");
        sql.append(" round(((55 -round(decode(KHT,0,0,100*thuchien_12h/KHT),2))/45),2) soTarget12h, ");
        sql.append(" round(decode(KHT,0,0,100*thuchien_24h/KHT),2) perform24h, ");
        sql.append(" round(((85 -round(decode(KHT,0,0,100*thuchien_24h/KHT),2))/15),2) soTarget24h, ");
        sql.append(" round(decode(KHT,0,0,100*thuchien_48h/KHT),2) perform48h, ");
        sql.append(" 100 - round(decode(KHT,0,0,100*thuchien_48h/KHT),2) soTarget48h ");
        sql.append(" from vung v ");
        sql.append(" LEFT join tbl on v.CODE = tbl.PROVINCE_CODE ");
        sql.append(" where 1 = 1 ");
        if (dto.getAreaId() != null) {
            sql.append(" and v.AREA_ID in (:areaId)");
        }
        if (dto.getGroupId() != null) {
            sql.append(" and v.SYS_GROUP_ID in (:groupId)");
        }
        sql.append(" ORDER BY v.AREA_CODE, v.CODE, v.NAME ))");
        sql.append(" ORDER BY areaCode, provinceCode, provinceName");


        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (dto.getStartDate() != null) {
            query.setParameter("startDate", dto.getStartDate());
            queryCount.setParameter("startDate", dto.getStartDate());
        }
        if (dto.getEndDate() != null) {
            query.setParameter("endDate", dto.getEndDate());
            queryCount.setParameter("endDate", dto.getEndDate());
        }
        if (dto.getAreaId() != null) {
            query.setParameter("areaId", dto.getAreaId());
            queryCount.setParameter("areaId", dto.getAreaId());
        }
        if (dto.getGroupId() != null) {
            query.setParameter("groupId", dto.getGroupId());
            queryCount.setParameter("groupId", dto.getGroupId());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORpIncidentDTO.class));
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("provinceName", new StringType());
        query.addScalar("incidentNo", new LongType());
        query.addScalar("rank12h", new LongType());
        query.addScalar("rank24h", new LongType());
        query.addScalar("rank48h", new LongType());
        query.addScalar("perform12h", new DoubleType());
        query.addScalar("perform24h", new DoubleType());
        query.addScalar("perform48h", new DoubleType());
        query.addScalar("soTarget12h", new DoubleType());
        query.addScalar("soTarget24h", new DoubleType());
        query.addScalar("soTarget48h", new DoubleType());

        this.setPageSize(dto, query, queryCount);

        return query.list();
    }

    public List<AIORpIncidentDTO> doSearchCluster(AIORpIncidentDTO dto) {
        StringBuilder sql = new StringBuilder();
        sql.append(" with");
        sql.append(" vung as (select cp.AREA_ID, cp.AREA_CODE, cp.CAT_PROVINCE_ID, cp.CODE, s.SYS_GROUP_ID, cp.NAME, s.NAME cum, s.PARENT_ID from SYS_GROUP s ");
        sql.append(" LEFT join CAT_PROVINCE cp on s.PROVINCE_ID = cp.CAT_PROVINCE_ID ");
        sql.append(" where s.GROUP_LEVEL = 3 and s.CODE like '%TTKT%' and s.status = 1), ");
        sql.append(" tbl as ");
        sql.append(" (select ");
        sql.append(" s.AREA_CODE, s.PROVINCE_CODE, cp.NAME, s.NAME cum,s.SYS_GROUP_ID, ");
        sql.append(" sum(case when  ard.status !=3 then 1 else 0 end) KHT, ");
        sql.append(" sum(case when ard.status = 4 and ((ard.ACTUAL_END_DATE - ar.SUPPORT_DATE)*24) <=12 then 1 else 0 end) thuchien_12h, ");
        sql.append(" sum(case when ard.status = 4 and ((ard.ACTUAL_END_DATE - ar.SUPPORT_DATE)*24) <=24 then 1 else 0 end) thuchien_24h, ");
        sql.append(" sum(case when ard.status = 4 and ((ard.ACTUAL_END_DATE - ar.SUPPORT_DATE)*24) <=48 then 1 else 0 end) thuchien_48h, ");
        sql.append(" max((select count(*) from AIO_CUSTOMER ac,AIO_AREA aa where ac.AIO_AREA_ID = aa.AREA_ID and aa.SYS_GROUP_LEVEL3 = s.SYS_GROUP_ID))soKH ");
        sql.append(" from AIO_REGLECT_DETAIL ard ");
        sql.append(" left join AIO_REGLECT ar on ar.AIO_REGLECT_ID = ard.AIO_REGLECT_ID ");
        sql.append(" left join SYS_USER su on su.SYS_USER_ID = ard.PERFORMER_ID ");
        sql.append(" left join SYS_GROUP s on su.SYS_GROUP_ID = s.SYS_GROUP_ID ");
        sql.append(" left join CAT_PROVINCE cp on cp.CAT_PROVINCE_ID = s.PROVINCE_ID ");
        sql.append(" where 1 = 1");
        if (dto.getStartDate() != null) {
            sql.append(" and trunc(ar.CREATED_DATE)>= trunc(:startDate) ");
        }
        if (dto.getEndDate() != null) {
            sql.append(" and trunc(ar.CREATED_DATE) <= trunc(:endDate) ");
        }
        if (dto.getAreaId() != null) {
            sql.append(" and s.AREA_ID in (:areaId)");
        }
        if (dto.getGroupId() != null) {
            sql.append(" and ar.PERFORMER_GROUP_ID in (:groupId)");
        }
        sql.append(" group by s.AREA_CODE, s.PROVINCE_CODE, cp.NAME,  s.NAME, s.SYS_GROUP_ID ) ");
        sql.append(" select * from (");
        sql.append(" select areaCode, provinceCode, provinceName, clusterName, incidentNo, ");
        sql.append(" perform12h, soTarget12h, perform24h, soTarget24h, perform48h, soTarget48h, ");
        sql.append(" case when soTarget12h is null then null else RANK() OVER (ORDER BY soTarget12h, perform12h) end rank12h, ");
        sql.append(" case when soTarget24h is null then null else RANK() OVER (ORDER BY soTarget24h, perform24h) end rank24h, ");
        sql.append(" case when soTarget48h is null then null else RANK() OVER (ORDER BY soTarget48h, perform48h) end rank48h ");
        sql.append(" from (");
        sql.append(" select v.AREA_CODE areaCode, v.CODE provinceCode, v.NAME provinceName, v.cum clusterName, ");
        sql.append(" round(decode(soKH,0,0,(KHT*1000)/soKH),2) incidentNo, ");
        sql.append(" round(decode(KHT,0,0,100*thuchien_12h/KHT),2) perform12h, ");
        sql.append(" round(((55 -round(decode(KHT,0,0,100*thuchien_12h/KHT),2))/45),2) soTarget12h, ");
        sql.append(" round(decode(KHT,0,0,100*thuchien_24h/KHT),2) perform24h, ");
        sql.append(" round(((85 -round(decode(KHT,0,0,100*thuchien_24h/KHT),2))/15),2) soTarget24h, ");
        sql.append(" round(decode(KHT,0,0,100*thuchien_48h/KHT),2) perform48h, ");
        sql.append(" 100 - round(decode(KHT,0,0,100*thuchien_48h/KHT),2) soTarget48h ");
        sql.append(" from vung v ");
        sql.append(" LEFT join tbl on v.SYS_GROUP_ID = tbl.SYS_GROUP_ID ");
        sql.append(" where 1 = 1 ");
        if (dto.getAreaId() != null) {
            sql.append(" and v.AREA_ID in (:areaId)");
        }
        if (dto.getGroupId() != null) {
            sql.append(" and (v.SYS_GROUP_ID in (:groupId) or v.PARENT_ID in (:groupId))");
        }
        sql.append(" ORDER BY v.AREA_CODE, v.CODE, v.NAME, v.cum))");
        sql.append(" ORDER BY areaCode, provinceCode, provinceName, clusterName");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
        if (dto.getStartDate() != null) {
            query.setParameter("startDate", dto.getStartDate());
            queryCount.setParameter("startDate", dto.getStartDate());
        }
        if (dto.getEndDate() != null) {
            query.setParameter("endDate", dto.getEndDate());
            queryCount.setParameter("endDate", dto.getEndDate());
        }
        if (dto.getAreaId() != null) {
            query.setParameter("areaId", dto.getAreaId());
            queryCount.setParameter("areaId", dto.getAreaId());
        }
        if (dto.getGroupId() != null) {
            query.setParameter("groupId", dto.getGroupId());
            queryCount.setParameter("groupId", dto.getGroupId());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORpIncidentDTO.class));
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("provinceName", new StringType());
        query.addScalar("clusterName", new StringType());
        query.addScalar("incidentNo", new LongType());
        query.addScalar("perform12h", new DoubleType());
        query.addScalar("perform24h", new DoubleType());
        query.addScalar("perform48h", new DoubleType());
        query.addScalar("soTarget12h", new DoubleType());
        query.addScalar("soTarget24h", new DoubleType());
        query.addScalar("soTarget48h", new DoubleType());
        query.addScalar("rank12h", new LongType());
        query.addScalar("rank24h", new LongType());
        query.addScalar("rank48h", new LongType());

        this.setPageSize(dto, query, queryCount);

        return query.list();
    }

    public List<AIORpIncidentDTO> doSearchIncidentByArea(AIORpIncidentDTO dto) {
        StringBuilder sql = new StringBuilder();
        sql.append(" with ");
        sql.append(" vung as (select cp.AREA_ID, cp.AREA_CODE, cp.CAT_PROVINCE_ID, cp.CODE, s.SYS_GROUP_ID, cp.NAME from SYS_GROUP s ");
        sql.append(" LEFT join CAT_PROVINCE cp on s.PROVINCE_ID = cp.CAT_PROVINCE_ID ");
        sql.append(" where s.GROUP_LEVEL = 2 and s.CODE like '%TTKT%'), ");
        sql.append(" tbl as ");
        sql.append(" (select ");
        sql.append(" s.AREA_CODE, s.PROVINCE_CODE, cp.NAME, ");
        sql.append(" sum(case when  ard.status !=3 then 1 else 0 end) KHT, ");
        sql.append(" sum(case when ard.status = 4 and ((ard.ACTUAL_END_DATE - ar.SUPPORT_DATE)*24) <=12 then 1 else 0 end) thuchien_12h, ");
        sql.append(" sum(case when ard.status = 4 and ((ard.ACTUAL_END_DATE - ar.SUPPORT_DATE)*24) <=24 then 1 else 0 end) thuchien_24h, ");
        sql.append(" sum(case when ard.status = 4 and ((ard.ACTUAL_END_DATE - ar.SUPPORT_DATE)*24) <=48 then 1 else 0 end) thuchien_48h, ");
        sql.append(" max((select count(*) from AIO_CUSTOMER ac,AIO_AREA aa where ac.AIO_AREA_ID = aa.AREA_ID and aa.PROVINCE_ID = s.PROVINCE_ID))soKH ");
        sql.append(" from AIO_REGLECT_DETAIL ard ");
        sql.append(" left join AIO_REGLECT ar on ar.AIO_REGLECT_ID = ard.AIO_REGLECT_ID ");
        sql.append(" left join SYS_GROUP s on ar.PERFORMER_GROUP_ID = s.SYS_GROUP_ID ");
        sql.append(" left join CAT_PROVINCE cp on cp.CAT_PROVINCE_ID = s.PROVINCE_ID ");
        sql.append(" where 1 = 1 ");
        if (dto.getStartDate() != null) {
            sql.append(" and trunc(ar.CREATED_DATE)>= trunc(:startDate) ");
        }
        if (dto.getEndDate() != null) {
            sql.append(" and trunc(ar.CREATED_DATE)<= trunc(:endDate) ");
        }
        sql.append(" group by s.AREA_CODE, s.PROVINCE_CODE, cp.NAME) ");
        sql.append(" select * from (");
        sql.append(" select areaCode, provinceName, provinceCode, incidentNo, ");
        sql.append(" perform12h, soTarget12h, perform24h, soTarget24h, perform48h, soTarget48h, ");
        sql.append(" case when soTarget12h is null then null else RANK() OVER (ORDER BY soTarget12h, perform12h) end rank12h, ");
        sql.append(" case when soTarget24h is null then null else RANK() OVER (ORDER BY soTarget24h, perform24h) end rank24h, ");
        sql.append(" case when soTarget48h is null then null else RANK() OVER (ORDER BY soTarget48h, perform48h) end rank48h ");
        sql.append(" from (");
        sql.append(" select v.AREA_CODE areaCode, count(v.CODE) || ' tỉnh' provinceName, v.AREA_CODE provinceCode, ");
        sql.append(" round(decode(sum(soKH),0,0,(sum(KHT)*1000)/sum(soKH)),2) incidentNo, ");
        sql.append(" round(decode(sum(KHT),0,0,100*sum(thuchien_12h)/sum(KHT)),2) perform12h, ");
        sql.append(" round(((55 -round(decode(sum(KHT),0,0,100*sum(thuchien_12h)/sum(KHT)),2))/45),2) soTarget12h, ");
        sql.append(" round(decode(sum(KHT),0,0,100*sum(thuchien_24h)/sum(KHT)),2) perform24h, ");
        sql.append(" round(((85 -round(decode(sum(KHT),0,0,100*sum(thuchien_24h)/sum(KHT)),2))/15),2) soTarget24h, ");
        sql.append(" round(decode(sum(KHT),0,0,100*sum(thuchien_48h)/sum(KHT)),2) perform48h, ");
        sql.append(" 100 - round(decode(sum(KHT),0,0,100*sum(thuchien_48h)/sum(KHT)),2) soTarget48h ");
        sql.append(" from vung v ");
        sql.append(" LEFT join tbl on v.CODE = tbl.PROVINCE_CODE ");
        sql.append(" group by v.AREA_CODE");
        sql.append(" ORDER BY v.AREA_CODE ))");
        sql.append(" ORDER BY areaCode ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());

        if (dto.getStartDate() != null) {
            query.setParameter("startDate", dto.getStartDate());
        }
        if (dto.getEndDate() != null) {
            query.setParameter("endDate", dto.getEndDate());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORpIncidentDTO.class));
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("provinceName", new StringType());
        query.addScalar("incidentNo", new LongType());
        query.addScalar("rank12h", new LongType());
        query.addScalar("rank24h", new LongType());
        query.addScalar("rank48h", new LongType());
        query.addScalar("perform12h", new DoubleType());
        query.addScalar("perform24h", new DoubleType());
        query.addScalar("perform48h", new DoubleType());
        query.addScalar("soTarget12h", new DoubleType());
        query.addScalar("soTarget24h", new DoubleType());
        query.addScalar("soTarget48h", new DoubleType());

        return query.list();
    }

    public AIORpIncidentDTO doSearchIncidentTotal(AIORpIncidentDTO dto) {
        StringBuilder sql = new StringBuilder();
        sql.append(" with ");
        sql.append(" vung as (select cp.AREA_ID, cp.AREA_CODE, cp.CAT_PROVINCE_ID, cp.CODE, s.SYS_GROUP_ID, cp.NAME from SYS_GROUP s ");
        sql.append(" LEFT join CAT_PROVINCE cp on s.PROVINCE_ID = cp.CAT_PROVINCE_ID ");
        sql.append(" where s.GROUP_LEVEL = 2 and s.CODE like '%TTKT%'), ");
        sql.append(" tbl as ");
        sql.append(" (select ");
        sql.append(" s.AREA_CODE, s.PROVINCE_CODE, cp.NAME, ");
        sql.append(" sum(case when  ard.status !=3 then 1 else 0 end) KHT, ");
        sql.append(" sum(case when ard.status = 4 and ((ard.ACTUAL_END_DATE - ar.SUPPORT_DATE)*24) <=12 then 1 else 0 end) thuchien_12h, ");
        sql.append(" sum(case when ard.status = 4 and ((ard.ACTUAL_END_DATE - ar.SUPPORT_DATE)*24) <=24 then 1 else 0 end) thuchien_24h, ");
        sql.append(" sum(case when ard.status = 4 and ((ard.ACTUAL_END_DATE - ar.SUPPORT_DATE)*24) <=48 then 1 else 0 end) thuchien_48h, ");
        sql.append(" max((select count(*) from AIO_CUSTOMER ac,AIO_AREA aa where ac.AIO_AREA_ID = aa.AREA_ID and aa.PROVINCE_ID = s.PROVINCE_ID))soKH ");
        sql.append(" from AIO_REGLECT_DETAIL ard ");
        sql.append(" left join AIO_REGLECT ar on ar.AIO_REGLECT_ID = ard.AIO_REGLECT_ID ");
        sql.append(" left join SYS_GROUP s on ar.PERFORMER_GROUP_ID = s.SYS_GROUP_ID ");
        sql.append(" left join CAT_PROVINCE cp on cp.CAT_PROVINCE_ID = s.PROVINCE_ID ");
        sql.append(" where 1 = 1 ");
        if (dto.getStartDate() != null) {
            sql.append(" and trunc(ar.CREATED_DATE)>= trunc(:startDate) ");
        }
        if (dto.getEndDate() != null) {
            sql.append(" and trunc(ar.CREATED_DATE)<= trunc(:endDate) ");
        }
        sql.append(" group by s.AREA_CODE, s.PROVINCE_CODE, cp.NAME) ");
        sql.append(" select areaCode, provinceCode, provinceName, incidentNo, ");
        sql.append(" perform12h, soTarget12h, perform24h, soTarget24h, perform48h, soTarget48h ");
        sql.append(" from (");
        sql.append(" select 'TQ' areaCode, 'TQ' provinceCode, (count(v.CODE) || 'Tỉnh') provinceName,");
        sql.append(" round(decode(sum(soKH),0,0,(sum(KHT)*1000)/sum(soKH)),2) incidentNo, ");
        sql.append(" round(decode(sum(KHT),0,0,100*sum(thuchien_12h)/sum(KHT)),2) perform12h, ");
        sql.append(" round(((55 -round(decode(sum(KHT),0,0,100*sum(thuchien_12h)/sum(KHT)),2))/45),2) soTarget12h, ");
        sql.append(" round(decode(sum(KHT),0,0,100*sum(thuchien_24h)/sum(KHT)),2) perform24h, ");
        sql.append(" round(((85 -round(decode(sum(KHT),0,0,100*sum(thuchien_24h)/sum(KHT)),2))/15),2) soTarget24h, ");
        sql.append(" round(decode(sum(KHT),0,0,100*sum(thuchien_48h)/sum(KHT)),2) perform48h, ");
        sql.append(" 100 - round(decode(sum(KHT),0,0,100*sum(thuchien_48h)/sum(KHT)),2) soTarget48h ");
        sql.append(" from vung v ");
        sql.append(" LEFT join tbl on v.CODE = tbl.PROVINCE_CODE) ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());

        if (dto.getStartDate() != null) {
            query.setParameter("startDate", dto.getStartDate());
        }
        if (dto.getEndDate() != null) {
            query.setParameter("endDate", dto.getEndDate());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORpIncidentDTO.class));
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("provinceName", new StringType());
        query.addScalar("incidentNo", new LongType());
        query.addScalar("perform12h", new DoubleType());
        query.addScalar("perform24h", new DoubleType());
        query.addScalar("perform48h", new DoubleType());
        query.addScalar("soTarget12h", new DoubleType());
        query.addScalar("soTarget24h", new DoubleType());
        query.addScalar("soTarget48h", new DoubleType());

        return (AIORpIncidentDTO)query.uniqueResult();
    }

    private <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }
}
