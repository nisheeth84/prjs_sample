package com.viettel.aio.dao;

import com.viettel.aio.dto.AIOOrdersDTO;
import com.viettel.aio.dto.AIORpSynthesisGenCodeForChannelDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@EnableTransactionManagement
@Transactional
@Repository("AIORpRequestNOKDAO")
public class AIORpRequestNOKDAO extends BaseFWDAOImpl<BaseFWModelImpl, Long> {

    @SuppressWarnings("unchecked")
    public List<AIOOrdersDTO> doSearch(AIOOrdersDTO criteria) {
        StringBuilder sql = new StringBuilder()
                .append("with ")
                .append("tbl as( select ")
                .append("s.AREA_CODE , s.PROVINCE_CODE , ")
                .append("count(o.AIO_ORDERS_ID) tong, ")
                .append("sum(case when o.status = 3 then 1 else 0 end) NOK ")
                .append("from AIO_ORDERS o ")
                .append("left join SYS_USER su on o.PERFORMER_ID = su.SYS_USER_ID ")
                .append("left join SYS_GROUP s on su.SYS_GROUP_ID = s.SYS_GROUP_ID ")
                .append("where ");
        if (criteria.getDateFrom() != null) {
            sql.append("trunc(o.CREATED_DATE)>= :dateFrom ");
        }
        if (criteria.getDateTo() != null) {
            sql.append("and trunc(o.CREATED_DATE)<= :dateTo ");
        }
        if (criteria.getAreaId() != null) {
            sql.append("and s.AREA_ID = :areaId ");
        }
        if (criteria.getSysGroupId() != null) {
            sql.append("and s.PATH  like '%'||:sysGroupId||'%' ");
        }
        ;

        sql.append("group by s.AREA_CODE, s.PROVINCE_CODE ");
        sql.append(") ")
                .append("select ")
                .append("AREA_CODE areaCode, PROVINCE_CODE provinceCode, tong tong, NOK nok, round(100*NOK/tong,2) percent ")
                .append("from tbl ")
                .append("ORDER BY AREA_CODE, PROVINCE_CODE, tong, NOK ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (criteria.getAreaId() != null) {
            query.setParameter("areaId", criteria.getAreaId());
            queryCount.setParameter("areaId", criteria.getAreaId());
        }
        if (criteria.getSysGroupId() != null) {
            query.setParameter("sysGroupId", criteria.getSysGroupId());
            queryCount.setParameter("sysGroupId", criteria.getSysGroupId());
        }
        if (criteria.getDateFrom() != null) {
            query.setParameter("dateFrom", criteria.getDateFrom());
            queryCount.setParameter("dateFrom", criteria.getDateFrom());
        }
        if (criteria.getDateTo() != null) {
            query.setParameter("dateTo", criteria.getDateTo());
            queryCount.setParameter("dateTo", criteria.getDateTo());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOOrdersDTO.class));

        query.addScalar("provinceCode", new StringType());
        query.addScalar("areaCode", new StringType());
        query.addScalar("tong", new DoubleType());
        query.addScalar("nok", new DoubleType());
        query.addScalar("percent", new DoubleType());

        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize());
            query.setMaxResults(criteria.getPageSize());
        }

        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<AIOOrdersDTO> doSearchDetail(AIOOrdersDTO criteria) {
        String groupBy = "group by " +
                "s.AREA_CODE, s.PROVINCE_CODE";

        StringBuilder sql = new StringBuilder()
                .append("select ")
                .append("s.AREA_CODE areaCode, s.PROVINCE_CODE provinceCode, o.CUSTOMER_NAME customerName, o.CUSTOMER_PHONE customerPhone,  ")
                .append("o.CUSTOMER_ADDRESS customerAddress, o.ORDER_CODE orderCode, o.SERVICE_NAME serviceName, o.REASON_NAME reasonName, o.DESCRIPTION description ")
                .append("from AIO_ORDERS o ")
                .append("left join SYS_USER su on o.PERFORMER_ID = su.SYS_USER_ID ")
                .append("inner join SYS_GROUP s on su.SYS_GROUP_ID = s.SYS_GROUP_ID ")
                .append("where o.STATUS = 3 ");
        if (criteria.getDateFrom() != null) {
            sql.append("and trunc(o.CREATED_DATE)>= :dateFrom ");
        }
        if (criteria.getDateTo() != null) {
            sql.append("and trunc(o.CREATED_DATE)<= :dateTo ");
        }
        if (criteria.getAreaId() != null) {
            sql.append("and s.AREA_ID = :areaId ");
        }
        if (criteria.getSysGroupId() != null) {
            sql.append("and s.PATH like '%'||:sysGroupId||'%' ");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (criteria.getAreaId() != null) {
            query.setParameter("areaId", criteria.getAreaId());
            queryCount.setParameter("areaId", criteria.getAreaId());
        }
        if (criteria.getSysGroupId() != null) {
            query.setParameter("sysGroupId", criteria.getSysGroupId());
            queryCount.setParameter("sysGroupId", criteria.getSysGroupId());
        }
        if (criteria.getDateFrom() != null) {
            query.setParameter("dateFrom", criteria.getDateFrom());
            queryCount.setParameter("dateFrom", criteria.getDateFrom());
        }
        if (criteria.getDateTo() != null) {
            query.setParameter("dateTo", criteria.getDateTo());
            queryCount.setParameter("dateTo", criteria.getDateTo());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOOrdersDTO.class));

        query.addScalar("provinceCode", new StringType());
        query.addScalar("areaCode", new StringType());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("orderCode", new StringType());
        query.addScalar("serviceName", new StringType());
        query.addScalar("reasonName", new StringType());
        query.addScalar("description", new StringType());

        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize());
            query.setMaxResults(criteria.getPageSize());
        }

        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

}

