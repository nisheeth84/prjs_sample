package com.viettel.aio.dao;

import com.viettel.aio.dto.ComsBaseFWDTO;
import com.viettel.aio.dto.report.AIORpBacklogContractDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@EnableTransactionManagement
@Transactional
@Repository("aioRpBacklogContractDAO")
public class AIORpBacklogContractDAO extends BaseFWDAOImpl<BaseFWModelImpl, Long> {

    public List<AIORpBacklogContractDTO> rpBacklogContractByArea(AIORpBacklogContractDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" with ");
        sql.append(" vung as (select cp.AREA_ID, cp.AREA_CODE, cp.CAT_PROVINCE_ID, cp.CODE, s.SYS_GROUP_ID, cp.NAME from SYS_GROUP s ");
        sql.append(" LEFT join CAT_PROVINCE cp on s.PROVINCE_ID = cp.CAT_PROVINCE_ID ");
        sql.append(" where s.GROUP_LEVEL = 2 and s.CODE like '%TTKT%'), ");
        sql.append(" hdt as( ");
        sql.append(" select ");
        sql.append(" s.AREA_ID, s.AREA_CODE , cp.NAME,  s.PROVINCE_CODE, ");
        sql.append(" sum(case when  c.status in(1,2,5,6) then 1 else 0 end) Tongton, ");
        sql.append(" sum(case when c.status in(1,2,5,6) and ((sysdate - c.CREATED_DATE)*24) <=24 then 1 else 0 end) Ton_1ngay, ");
        sql.append(" sum(case when c.status in(1,2,5,6) and ((sysdate - c.CREATED_DATE)*24) >24 and ((sysdate - c.CREATED_DATE)*24) <=48 then 1 else 0 end) Ton_2ngay, ");
        sql.append(" sum(case when c.status in(1,2,5,6) and ((sysdate - c.CREATED_DATE)*24) >48 and ((sysdate - c.CREATED_DATE)*24) <=72 then 1 else 0 end) Ton_3ngay, ");
        sql.append(" sum(case when c.status in(1,2,5,6) and ((sysdate - c.CREATED_DATE)*24) >72  then 1 else 0 end) Ton_qua3ngay, ");
        sql.append(" sum(case when c.status in(6)  then 1 else 0 end) Chohuy, ");
        sql.append(" sum(case when trunc(c.CREATED_DATE) = trunc(sysdate) then 1 else 0 end) HDM_trongngay, ");
        sql.append(" sum(case when c.STATUS= 3 and trunc(ar.END_DATE) = trunc(sysdate) then 1 else 0 end) HDNT_trongngay ");
        sql.append(" from AIO_CONTRACT c ");
        sql.append(" left join AIO_ACCEPTANCE_RECORDS ar on c.CONTRACT_ID = ar.CONTRACT_ID ");
        sql.append(" LEFT join SYS_GROUP s  on c.PERFORMER_GROUP_ID = s.SYS_GROUP_ID ");
        sql.append(" left join CAT_PROVINCE cp on cp.CAT_PROVINCE_ID = s.PROVINCE_ID ");
        sql.append(" group by s.AREA_ID,s.AREA_CODE , cp.NAME,  s.PROVINCE_CODE ");
        sql.append(" ) ");
        sql.append(" select v.AREA_CODE areaCode ");
        sql.append(" , nvl(sum(hdt.Tongton),0) tongTon, nvl(sum(hdt.Ton_1ngay),0) ton1Ngay, nvl(sum(hdt.Ton_2ngay),0) ton2Ngay, nvl(sum(hdt.Ton_3ngay),0) ton3Ngay");
        sql.append(" , nvl(sum(hdt.Ton_qua3ngay),0) tonQua3Ngay, nvl(sum(hdt.Chohuy),0) choHuy, nvl(sum(hdt.HDM_trongngay),0) hdmTrongNgay, nvl(sum(hdt.HDNT_trongngay),0) hdntTrongNgay");
        sql.append(" from vung v ");
        sql.append(" left join hdt on v.CODE = hdt.PROVINCE_CODE ");
        sql.append(" group by v.AREA_CODE");
        sql.append(" ORDER BY v.AREA_CODE");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        query.setResultTransformer(Transformers.aliasToBean(AIORpBacklogContractDTO.class));
        query.addScalar("areaCode", new StringType());
        query.addScalar("tongTon", new LongType());
        query.addScalar("ton1Ngay", new LongType());
        query.addScalar("ton2Ngay", new LongType());
        query.addScalar("ton3Ngay", new LongType());
        query.addScalar("tonQua3Ngay", new LongType());
        query.addScalar("choHuy", new LongType());
        query.addScalar("hdmTrongNgay", new LongType());
        query.addScalar("hdntTrongNgay", new LongType());

        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public List<AIORpBacklogContractDTO> rpBacklogContractByProvince(AIORpBacklogContractDTO obj) {

        StringBuilder sql = new StringBuilder();
        sql.append(" with ");
        sql.append(" vung as (select cp.AREA_ID, cp.AREA_CODE, cp.CAT_PROVINCE_ID, cp.CODE, s.SYS_GROUP_ID, cp.NAME from SYS_GROUP s ");
        sql.append(" LEFT join CAT_PROVINCE cp on s.PROVINCE_ID = cp.CAT_PROVINCE_ID ");
        sql.append(" where s.GROUP_LEVEL = 2 and s.CODE like '%TTKT%'), ");
        sql.append(" hdt as( ");
        sql.append(" select ");
        sql.append(" s.AREA_ID, s.AREA_CODE , cp.NAME,  s.PROVINCE_CODE, ");
        sql.append(" sum(case when  c.status in(1,2,5,6) then 1 else 0 end) Tongton, ");
        sql.append(" sum(case when c.status in(1,2,5,6) and ((sysdate - c.CREATED_DATE)*24) <=24 then 1 else 0 end) Ton_1ngay, ");
        sql.append(" sum(case when c.status in(1,2,5,6) and ((sysdate - c.CREATED_DATE)*24) >24 and ((sysdate - c.CREATED_DATE)*24) <=48 then 1 else 0 end) Ton_2ngay, ");
        sql.append(" sum(case when c.status in(1,2,5,6) and ((sysdate - c.CREATED_DATE)*24) >48 and ((sysdate - c.CREATED_DATE)*24) <=72 then 1 else 0 end) Ton_3ngay, ");
        sql.append(" sum(case when c.status in(1,2,5,6) and ((sysdate - c.CREATED_DATE)*24) >72  then 1 else 0 end) Ton_qua3ngay, ");
        sql.append(" sum(case when c.status in(6)  then 1 else 0 end) Chohuy, ");
        sql.append(" sum(case when trunc(c.CREATED_DATE) = trunc(sysdate) then 1 else 0 end) HDM_trongngay, ");
        sql.append(" sum(case when c.STATUS= 3 and trunc(ar.END_DATE) = trunc(sysdate) then 1 else 0 end) HDNT_trongngay ");
        sql.append(" from AIO_CONTRACT c ");
        sql.append(" left join AIO_ACCEPTANCE_RECORDS ar on c.CONTRACT_ID = ar.CONTRACT_ID ");
        sql.append(" LEFT join SYS_GROUP s  on c.PERFORMER_GROUP_ID = s.SYS_GROUP_ID ");
        sql.append(" left join CAT_PROVINCE cp on cp.CAT_PROVINCE_ID = s.PROVINCE_ID ");
        sql.append(" where 1 = 1");
        if (obj.getGroupIds() != null && !obj.getGroupIds().isEmpty()) {
            sql.append(" and c.PERFORMER_GROUP_ID in(:groupIds) ");
        }
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            sql.append(" and s.AREA_CODE in (:areaCodes) ");
        }
        sql.append(" group by s.AREA_ID,s.AREA_CODE , cp.NAME,  s.PROVINCE_CODE ");
        sql.append(" ) ");
        sql.append(" select v.AREA_CODE areaCode, v.NAME provinceName,  v.CODE provinceCode");
        sql.append(" , nvl(hdt.Tongton,0) tongTon, nvl(hdt.Ton_1ngay,0) ton1Ngay, nvl(hdt.Ton_2ngay,0) ton2Ngay, nvl(hdt.Ton_3ngay,0) ton3Ngay");
        sql.append(" , nvl(hdt.Ton_qua3ngay,0) tonQua3Ngay, nvl(hdt.Chohuy,0) choHuy, nvl(hdt.HDM_trongngay,0) hdmTrongNgay, nvl(hdt.HDNT_trongngay,0) hdntTrongNgay");
        sql.append(" from vung v ");
        sql.append(" left join hdt on v.CODE = hdt.PROVINCE_CODE ");
        sql.append(" where 1 =1");
        if (obj.getGroupIds() != null && !obj.getGroupIds().isEmpty()) {
            sql.append(" and v.SYS_GROUP_ID in(:groupIds) ");
        }
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            sql.append(" and v.AREA_CODE in (:areaCodes) ");
        }
        sql.append(" ORDER BY v.AREA_CODE , v.NAME,  v.CODE ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (obj.getGroupIds() != null && !obj.getGroupIds().isEmpty()) {
            query.setParameterList("groupIds", obj.getGroupIds());
            queryCount.setParameterList("groupIds", obj.getGroupIds());

        }
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            query.setParameterList("areaCodes", obj.getAreaCodes());
            queryCount.setParameterList("areaCodes", obj.getAreaCodes());

        }
        query.setResultTransformer(Transformers.aliasToBean(AIORpBacklogContractDTO.class));
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("provinceName", new StringType());
        query.addScalar("tongTon", new LongType());
        query.addScalar("ton1Ngay", new LongType());
        query.addScalar("ton2Ngay", new LongType());
        query.addScalar("ton3Ngay", new LongType());
        query.addScalar("tonQua3Ngay", new LongType());
        query.addScalar("choHuy", new LongType());
        query.addScalar("hdmTrongNgay", new LongType());
        query.addScalar("hdntTrongNgay", new LongType());

        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();

    }

    public List<AIORpBacklogContractDTO> rpBacklogContractByGroup(AIORpBacklogContractDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" with ");
        sql.append(" vung as (select cp.AREA_ID, cp.AREA_CODE, cp.CAT_PROVINCE_ID, cp.CODE, s.SYS_GROUP_ID, cp.NAME, s.NAME cum, s.PARENT_ID from SYS_GROUP s ");
        sql.append(" LEFT join CAT_PROVINCE cp on s.PROVINCE_ID = cp.CAT_PROVINCE_ID ");
        sql.append(" where s.GROUP_LEVEL = 3 and s.CODE like '%TTKT%' and s.status = 1), ");
        sql.append(" ");
        sql.append(" hdt as( ");
        sql.append(" select ");
        sql.append(" s.AREA_ID, s.AREA_CODE Khuvuc , cp.NAME TenTinh,  s.PROVINCE_CODE Matinh,s.NAME Tencum,s.SYS_GROUP_ID, ");
        sql.append(" sum(case when  c.status in(1,2,5,6) then 1 else 0 end) Tongton, ");
        sql.append(" sum(case when c.status in(1,2,5,6) and ((sysdate - c.CREATED_DATE)*24) <=24 then 1 else 0 end) Ton_1ngay, ");
        sql.append(" sum(case when c.status in(1,2,5,6) and ((sysdate - c.CREATED_DATE)*24) >24 and ((sysdate - c.CREATED_DATE)*24) <=48 then 1 else 0 end) Ton_2ngay, ");
        sql.append(" sum(case when c.status in(1,2,5,6) and ((sysdate - c.CREATED_DATE)*24) >48 and ((sysdate - c.CREATED_DATE)*24) <=72 then 1 else 0 end) Ton_3ngay, ");
        sql.append(" sum(case when c.status in(1,2,5,6) and ((sysdate - c.CREATED_DATE)*24) >72  then 1 else 0 end) Ton_qua3ngay, ");
        sql.append(" sum(case when c.status in(6)  then 1 else 0 end) Chohuy, ");
        sql.append(" sum(case when trunc(c.CREATED_DATE) = trunc(sysdate) then 1 else 0 end) HDM_trongngay, ");
        sql.append(" sum(case when c.STATUS= 3 and trunc(ar.END_DATE) = trunc(sysdate) then 1 else 0 end) HDNT_trongngay ");
        sql.append(" from AIO_CONTRACT c ");
        sql.append(" left join AIO_ACCEPTANCE_RECORDS ar on c.CONTRACT_ID = ar.CONTRACT_ID ");
        sql.append(" LEFT join SYS_USER su  on c.PERFORMER_ID = su.SYS_USER_ID ");
        sql.append(" LEFT join SYS_GROUP s  on su.SYS_GROUP_ID = s.SYS_GROUP_ID ");
        sql.append(" left join CAT_PROVINCE cp on cp.CAT_PROVINCE_ID = s.PROVINCE_ID ");
        sql.append(" where 1 = 1");
        if (obj.getGroupIds() != null && !obj.getGroupIds().isEmpty()) {
            sql.append(" and c.PERFORMER_GROUP_ID in(:groupIds) ");
        }
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            sql.append(" and s.AREA_CODE in (:areaCodes) ");
        }
        sql.append(" group by s.AREA_ID, s.AREA_CODE , cp.NAME,  s.PROVINCE_CODE,s.NAME,s.SYS_GROUP_ID ");
        sql.append(" ) ");
        sql.append(" select v.AREA_CODE areaCode, v.NAME provinceName,  v.CODE provinceCode, v.cum groupName");
        sql.append(" , nvl(hdt.Tongton,0) tongTon, nvl(hdt.Ton_1ngay,0) ton1Ngay, nvl(hdt.Ton_2ngay,0) ton2Ngay, nvl(hdt.Ton_3ngay,0) ton3Ngay");
        sql.append(" , nvl(hdt.Ton_qua3ngay,0) tonQua3Ngay, nvl(hdt.Chohuy,0) choHuy, nvl(hdt.HDM_trongngay,0) hdmTrongNgay, nvl(hdt.HDNT_trongngay,0) hdntTrongNgay");
        sql.append(" from vung v ");
        sql.append(" LEFT join hdt on v.SYS_GROUP_ID= hdt.SYS_GROUP_ID ");
        sql.append(" where 1 =1");
        if (obj.getGroupIds() != null && !obj.getGroupIds().isEmpty()) {
            sql.append(" and (v.SYS_GROUP_ID in (:groupIds) or v.PARENT_ID in (:groupIds)) ");
        }
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            sql.append(" and v.AREA_CODE in (:areaCodes) ");
        }
        sql.append(" ORDER BY v.AREA_CODE , v.NAME,  v.CODE, v.cum ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (obj.getGroupIds() != null && !obj.getGroupIds().isEmpty()) {
            query.setParameterList("groupIds", obj.getGroupIds());
            queryCount.setParameterList("groupIds", obj.getGroupIds());

        }
        if (obj.getAreaCodes() != null && !obj.getAreaCodes().isEmpty()) {
            query.setParameterList("areaCodes", obj.getAreaCodes());
            queryCount.setParameterList("areaCodes", obj.getAreaCodes());

        }
        query.setResultTransformer(Transformers.aliasToBean(AIORpBacklogContractDTO.class));
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("provinceName", new StringType());
        query.addScalar("groupName", new StringType());
        query.addScalar("tongTon", new LongType());
        query.addScalar("ton1Ngay", new LongType());
        query.addScalar("ton2Ngay", new LongType());
        query.addScalar("ton3Ngay", new LongType());
        query.addScalar("tonQua3Ngay", new LongType());
        query.addScalar("choHuy", new LongType());
        query.addScalar("hdmTrongNgay", new LongType());
        query.addScalar("hdntTrongNgay", new LongType());

        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();

    }

    public AIORpBacklogContractDTO rpBacklogContractTotal(AIORpBacklogContractDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" with ");
        sql.append(" vung as (select cp.AREA_ID, cp.AREA_CODE, cp.CAT_PROVINCE_ID, cp.CODE, s.SYS_GROUP_ID, cp.NAME from SYS_GROUP s ");
        sql.append(" LEFT join CAT_PROVINCE cp on s.PROVINCE_ID = cp.CAT_PROVINCE_ID ");
        sql.append(" where s.GROUP_LEVEL = 2 and s.CODE like '%TTKT%'), ");
        sql.append(" hdt as( ");
        sql.append(" select ");
        sql.append(" s.AREA_ID, s.AREA_CODE , cp.NAME,  s.PROVINCE_CODE, ");
        sql.append(" sum(case when  c.status in(1,2,5,6) then 1 else 0 end) Tongton, ");
        sql.append(" sum(case when c.status in(1,2,5,6) and ((sysdate - c.CREATED_DATE)*24) <=24 then 1 else 0 end) Ton_1ngay, ");
        sql.append(" sum(case when c.status in(1,2,5,6) and ((sysdate - c.CREATED_DATE)*24) >24 and ((sysdate - c.CREATED_DATE)*24) <=48 then 1 else 0 end) Ton_2ngay, ");
        sql.append(" sum(case when c.status in(1,2,5,6) and ((sysdate - c.CREATED_DATE)*24) >48 and ((sysdate - c.CREATED_DATE)*24) <=72 then 1 else 0 end) Ton_3ngay, ");
        sql.append(" sum(case when c.status in(1,2,5,6) and ((sysdate - c.CREATED_DATE)*24) >72  then 1 else 0 end) Ton_qua3ngay, ");
        sql.append(" sum(case when c.status in(6)  then 1 else 0 end) Chohuy, ");
        sql.append(" sum(case when trunc(c.CREATED_DATE) = trunc(sysdate) then 1 else 0 end) HDM_trongngay, ");
        sql.append(" sum(case when c.STATUS= 3 and trunc(ar.END_DATE) = trunc(sysdate) then 1 else 0 end) HDNT_trongngay ");
        sql.append(" from AIO_CONTRACT c ");
        sql.append(" left join AIO_ACCEPTANCE_RECORDS ar on c.CONTRACT_ID = ar.CONTRACT_ID ");
        sql.append(" LEFT join SYS_GROUP s  on c.PERFORMER_GROUP_ID = s.SYS_GROUP_ID ");
        sql.append(" left join CAT_PROVINCE cp on cp.CAT_PROVINCE_ID = s.PROVINCE_ID ");
        sql.append(" group by s.AREA_ID,s.AREA_CODE , cp.NAME,  s.PROVINCE_CODE ");
        sql.append(" ) ");
        sql.append(" select ");
        sql.append(" nvl(sum(hdt.Tongton),0) tongTon, nvl(sum(hdt.Ton_1ngay),0) ton1Ngay, nvl(sum(hdt.Ton_2ngay),0) ton2Ngay, nvl(sum(hdt.Ton_3ngay),0) ton3Ngay");
        sql.append(" , nvl(sum(hdt.Ton_qua3ngay),0) tonQua3Ngay, nvl(sum(hdt.Chohuy),0) choHuy, nvl(sum(hdt.HDM_trongngay),0) hdmTrongNgay, nvl(sum(hdt.HDNT_trongngay),0) hdntTrongNgay");
        sql.append(" from vung v ");
        sql.append(" left join hdt on v.CODE = hdt.PROVINCE_CODE ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());

        query.setResultTransformer(Transformers.aliasToBean(AIORpBacklogContractDTO.class));
        query.addScalar("tongTon", new LongType());
        query.addScalar("ton1Ngay", new LongType());
        query.addScalar("ton2Ngay", new LongType());
        query.addScalar("ton3Ngay", new LongType());
        query.addScalar("tonQua3Ngay", new LongType());
        query.addScalar("choHuy", new LongType());
        query.addScalar("hdmTrongNgay", new LongType());
        query.addScalar("hdntTrongNgay", new LongType());

        Object ret = query.uniqueResult();
        if (ret != null) return (AIORpBacklogContractDTO) ret;
        return new AIORpBacklogContractDTO();
    }
}
