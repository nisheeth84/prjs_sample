package com.viettel.aio.dao;

import com.viettel.aio.dto.AIOOrdersDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@EnableTransactionManagement
@Transactional
@Repository("AIORpExpiredJobDAO")
public class AIORpExpiredJobDAO extends BaseFWDAOImpl<BaseFWModelImpl, Long> {

    @SuppressWarnings("unchecked")
    public List<AIOOrdersDTO> doSearch(AIOOrdersDTO criteria) {
        StringBuilder sql = new StringBuilder()
                .append("with tbl as( ")
                .append("select s.AREA_CODE kv, s.PROVINCE_CODE tinh, ")
                .append("sum(case when o.status !=0 then 1 else 0 end) SLYC, ")
                .append("sum(case when (o.END_DATE > o.APPROVED_DATE and o.status in (2,3,4)) or (o.status = 1 and sysdate > o.END_DATE) then 1 else 0 end) quahan ")
                .append("from AIO_ORDERS o ")
                .append("left join SYS_USER su on o.PERFORMER_ID = su.SYS_USER_ID ")
                .append("left join SYS_GROUP s on su.SYS_GROUP_ID = s.SYS_GROUP_ID ")
                .append("where 1=1 ");

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
            sql.append("and s.PATH  like '%'||:sysGroupId||'%' ");
        }

        sql.append("group by s.AREA_CODE, s.PROVINCE_CODE) ")
                .append("select kv areaCode, tinh provinceCode, ")
                .append("SLYC slyc,quahan quahan, ")
                .append("round(decode(SLYC,0,0,100*quahan/SLYC),2) tyleqh ")
                .append("from tbl ");

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

        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("slyc", new DoubleType());
        query.addScalar("quahan", new DoubleType());
        query.addScalar("tyleqh", new DoubleType());

        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize());
            query.setMaxResults(criteria.getPageSize());
        }

        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<AIOOrdersDTO> doSearchDetail(AIOOrdersDTO criteria) {
        StringBuilder sql = new StringBuilder()
                .append("select s.AREA_CODE areaCode, s.PROVINCE_CODE provinceCode, o.CUSTOMER_NAME customerName, o.CUSTOMER_PHONE customerPhone, o.CUSTOMER_ADDRESS customerAddress, o.ORDER_CODE orderCode, o.SERVICE_NAME serviceName, o.QUANTITY quantity, o.DESCRIPTION description ")
                .append("from AIO_ORDERS o ")
                .append("left join SYS_USER su on o.PERFORMER_ID = su.SYS_USER_ID ")
                .append("inner join SYS_GROUP s on su.SYS_GROUP_ID = s.SYS_GROUP_ID ")
                .append("where ")
                .append("(o.END_DATE > o.APPROVED_DATE and o.status in (2,3,4)) or (o.status = 1 and sysdate > o.END_DATE) ");
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
        query.addScalar("quantity", new DoubleType());
        query.addScalar("description", new StringType());

        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize());
            query.setMaxResults(criteria.getPageSize());
        }

        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

}

