package com.viettel.aio.dao;

import com.viettel.aio.dto.AIORpContractPayrollDTO;
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
import java.util.List;

@EnableTransactionManagement
@Transactional
@Repository("aioRpContractPayrollDAO")
public class AIORpContractPayrollDAO extends BaseFWDAOImpl<BaseFWModelImpl, Long> {

    @SuppressWarnings("unchecked")
    public List<AIORpContractPayrollDTO> doSearch(AIORpContractPayrollDTO criteria) {
        String groupBy = "group by " +
                " tbl.FULL_NAME , tbl.ACCOUNT_NUMBER , tbl.nganhang, dt.salary ";
        StringBuilder sql = new StringBuilder()
                .append("with tbl as")
                .append("(select ")
                .append("s.EMPLOYEE_CODE, s.FULL_NAME,  s.TAX_CODE, s.SYS_USER_ID, s.ACCOUNT_NUMBER, s.BANK || ' - ' || s.BANK_BRANCH  nganhang ")
                .append("from SYS_USER s ")
                .append("LEFT join SYS_GROUP sg on s.SYS_GROUP_ID  =  sg.SYS_GROUP_ID ")
                .append("where s.TYPE_USER in (1,2) and s.STATUS = 1 ");
                if (criteria.getAreaId() != null) {
                    sql.append("and sg.AREA_ID = :areaId ");
                }
                if (criteria.getSysGroupId() != null) {
                    sql.append("and sg.PATH  like '%'||:sysGroupId||'%' ");
                }
                sql.append("), dt as ")
                .append("(select c.SELLER_ID, sum(cp.SALARY) salary  from AIO_CONTRACT c ")
                .append("LEFT join AIO_ACCEPTANCE_RECORDS ar on c.CONTRACT_ID = ar.CONTRACT_ID ")
                .append("LEFT join AIO_CONTRACT_PAYROLL cp on c.CONTRACT_ID = cp.CONTRACT_ID ")
                .append("LEFT join SYS_USER s on s.EMPLOYEE_CODE = cp.SYS_USER_CODE ")
                .append("where c.STATUS = 3 ");
        if (criteria.getDateFrom() != null) {
                sql.append("and trunc(ar.END_DATE)>= :dateFrom ");
        }
        if (criteria.getDateTo() != null) {
                 sql.append("and trunc(ar.END_DATE)<= :dateTo ");
        }
        sql.append("and cp.TYPE in (1,5) ")
                .append("and s.TYPE_USER in (1,2) ")
                .append("group by c.SELLER_ID ")
                .append(") ")
                .append("select ")
                .append("tbl.FULL_NAME sysUserName, tbl.ACCOUNT_NUMBER accountName, tbl.nganhang bank, dt.salary * 0.9 salary ")
                .append("from dt ")
                .append("INNER  JOIN tbl ON dt.SELLER_ID = tbl.SYS_USER_ID ");

        sql.append(groupBy);
        sql.append("order by tbl.FULL_NAME ");

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

        query.setResultTransformer(Transformers.aliasToBean(AIORpContractPayrollDTO.class));


        query.addScalar("sysUserName", new StringType());
        query.addScalar("accountName", new StringType());
        query.addScalar("bank", new StringType());
        query.addScalar("salary", new LongType());


        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize());
            query.setMaxResults(criteria.getPageSize());
        }

        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }
}
