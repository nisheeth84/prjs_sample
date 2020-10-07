package com.viettel.aio.dao;

import com.viettel.aio.dto.AIORpSynthesisPaySaleFeeDTO;
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
@Repository("aioRpSynthesisPaySaleFeeDAO")
public class AIORpSynthesisPaySaleFeeDAO extends BaseFWDAOImpl<BaseFWModelImpl, Long> {
    @SuppressWarnings("unchecked")
    public List<AIORpSynthesisPaySaleFeeDTO> doSearch(AIORpSynthesisPaySaleFeeDTO criteria) {
//        String groupBy = "group by " +
//                "tbl.PROVINCE_CODE, tbl.AREA_CODE, ql.EMPLOYEE_CODE,ql.FULL_NAME, " +
//                "ql.PHONE_NUMBER , ql.EMAIL, tbl.EMPLOYEE_CODE, tbl.FULL_NAME,  " +
//                "tbl.TAX_CODE, dt.amount, dt.salary ";
        String groupBy = "group by " +
                "dt.PROVINCE_CODE, dt.AREA_CODE, ql.EMPLOYEE_CODE,ql.FULL_NAME, " +
                "ql.PHONE_NUMBER , ql.EMAIL, dt.EMPLOYEE_CODE, dt.FULL_NAME,  " +
                "dt.TAX_CODE, dt.amount, dt.salary ";

        StringBuilder sql = new StringBuilder();
        sql.append("with ");
        sql.append("ql as (");
        sql.append("select SYS_USER_ID,EMPLOYEE_CODE,FULL_NAME, PHONE_NUMBER, EMAIL from SYS_USER where STATUS = 1), ");
//        sql.append("tbl as ");
//        sql.append("(select ");
//        sql.append("s.PARENT_USER_ID,sg.PROVINCE_CODE, sg.NAME, s.EMPLOYEE_CODE, s.FULL_NAME,  s.TAX_CODE, s.SYS_USER_ID, sg.AREA_CODE ");
//        sql.append("from SYS_USER s ");
//        sql.append("LEFT join SYS_GROUP sg on s.SYS_GROUP_ID  =  sg.SYS_GROUP_ID ");
//        sql.append("where s.TYPE_USER in (1,2) and s.STATUS = 1 ");
//        if (criteria.getAreaId() != null) {
//            sql.append("and sg.AREA_ID = :areaId ");
//        }
//        if (criteria.getSysGroupId() != null) {
//            sql.append("and sg.PATH like '%'||:sysGroupId||'%' ");
//        }
//        sql.append("),");
        sql.append("dt as (");
//        sql.append("select c.SELLER_ID,sum(ar.AMOUNT) amount, sum(cp.SALARY) salary  from AIO_CONTRACT c ");
        sql.append("select s.PARENT_USER_ID, sg.AREA_CODE, sg.PROVINCE_CODE, s.EMPLOYEE_CODE, s.FULL_NAME, s.TAX_CODE, c.SELLER_ID,sum(ar.AMOUNT) amount, sum(cp.SALARY) salary ")
                .append("from AIO_CONTRACT c ")
                .append("LEFT join AIO_ACCEPTANCE_RECORDS ar on c.CONTRACT_ID = ar.CONTRACT_ID ")
                .append("LEFT join AIO_CONTRACT_PERFORM_DATE pd on c.CONTRACT_ID = pd.CONTRACT_ID ")
                .append("LEFT join AIO_CONTRACT_PAYROLL cp on ar.CONTRACT_DETAIL_ID = cp.CONTRACT_DETAIL_ID and c.SELLER_CODE = cp.SYS_USER_CODE ")
                .append("LEFT join SYS_USER s on s.SYS_USER_ID = c.SELLER_ID ")
                .append("LEFT join SYS_GROUP sg on s.SYS_GROUP_ID = sg.SYS_GROUP_ID ")
                .append("where c.STATUS = 3 ");
//        sql.append("LEFT join AIO_ACCEPTANCE_RECORDS ar on c.CONTRACT_ID = ar.CONTRACT_ID ");
//        sql.append("LEFT join AIO_CONTRACT_PAYROLL cp on ar.CONTRACT_DETAIL_ID = cp.CONTRACT_DETAIL_ID and c.SELLER_CODE = cp.SYS_USER_CODE ");
//        sql.append("LEFT join SYS_USER s on s.SYS_USER_ID = c.SELLER_ID ");
//        sql.append("where c.STATUS = 3 ");
        if (criteria.getAreaId() != null) {
            sql.append("and sg.AREA_ID = :areaId ");
        }
        if (criteria.getSysGroupId() != null) {
            sql.append("and sg.PATH like '%'||:sysGroupId||'%' ");
        }
        if (criteria.getDateFrom() != null) {
            sql.append("and trunc(ar.END_DATE)>= :dateFrom ");
        }
        if (criteria.getDateTo() != null) {
            sql.append("and trunc(ar.END_DATE)<= :dateTo ");
        }
//        sql.append("and cp.TYPE in (1,5) ");
        sql.append("and s.TYPE_USER in (1,2) ")
//        sql.append("group by c.SELLER_ID ");
                .append("group by s.PARENT_USER_ID, sg.AREA_CODE, sg.PROVINCE_CODE, s.EMPLOYEE_CODE, s.FULL_NAME,  s.TAX_CODE, c.SELLER_ID ")
                .append(") ");
        sql.append("select ");
//        sql.append("tbl.AREA_CODE areaCode, " +
//                "tbl.PROVINCE_CODE provinceCode, " +
//                "ql.EMPLOYEE_CODE employeeCode, " +
//                "ql.FULL_NAME sysUserName, " +
//                "ql.PHONE_NUMBER sysUserPhone, " +
//                "ql.EMAIL emailQL, " +
//                "tbl.EMPLOYEE_CODE employeeCodeCTV, " +
//                "tbl.FULL_NAME nameCTV, " +
//                "tbl.TAX_CODE taxCodeCTV, " +
//                "NVL(ROUND(dt.amount / 1.1, 0), 0) amount, " +
//                "NVL(dt.salary,0) salary, " +
//                "NVL(0.1*dt.salary,0) taxSalary, " +
//                "NVL(0.9*dt.salary,0) realSalary, ");
        sql.append("dt.AREA_CODE areaCode, " +
                "dt.PROVINCE_CODE provinceCode, " +
                "ql.EMPLOYEE_CODE employeeCode, " +
                "ql.FULL_NAME sysUserName, " +
                "ql.PHONE_NUMBER sysUserPhone, " +
                "ql.EMAIL emailQL, " +
                "dt.EMPLOYEE_CODE employeeCodeCTV, " +
                "dt.FULL_NAME nameCTV, " +
                "dt.TAX_CODE taxCodeCTV, " +
                "NVL(round(dt.amount/1.1,0), 0) amount, " +
                "NVL(dt.salary, 0) salary, " +
                "NVL(0.1*dt.salary, 0) taxSalary, " +
                "NVL(0.9*dt.salary, 0) realSalary ");
//        sql.append("from tbl ");
        sql.append("from dt ");
        sql.append("LEFT join ql on ql.SYS_USER_ID = dt.PARENT_USER_ID ");
//        sql.append("LEFT join dt on dt.SELLER_ID = tbl.SYS_USER_ID ");

        sql.append(groupBy);
//        sql.append("order by tbl.PROVINCE_CODE ");
        sql.append("order by dt.PROVINCE_CODE ");

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

        query.setResultTransformer(Transformers.aliasToBean(AIORpSynthesisPaySaleFeeDTO.class));

        query.addScalar("provinceCode", new StringType());
        query.addScalar("areaCode", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("sysUserPhone", new StringType());
        query.addScalar("emailQL", new StringType());
        query.addScalar("employeeCodeCTV", new StringType());
        query.addScalar("nameCTV", new StringType());
        query.addScalar("taxCodeCTV", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("salary", new DoubleType());
        query.addScalar("taxSalary", new DoubleType());
        query.addScalar("realSalary", new DoubleType());

        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize());
            query.setMaxResults(criteria.getPageSize());
        }

        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();

    }
}
