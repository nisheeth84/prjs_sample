package com.viettel.aio.dao;

import com.viettel.aio.dto.AIORevenueAndRemainDTO;
import com.viettel.aio.dto.AIOSysGroupDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

//VietNT_20191101_create
@EnableTransactionManagement
@Transactional
@Repository("aioRevenueAndContractRemainDAO")
public class AIORevenueAndContractRemainDAO extends BaseFWDAOImpl<BaseFWModelImpl, Long> {

    public AIORevenueAndContractRemainDAO() {
    }

    public AIORevenueAndContractRemainDAO(Session session) {
        this.session = session;
    }

    public List<AIORevenueAndRemainDTO> getContractDashboardInfo(String subQuery, List<String> sysGroupIds) {
        String sql = "WITH contract AS (SELECT CONTRACT_ID, CREATED_DATE, PERFORMER_GROUP_ID, PERFORMER_ID " +
                "FROM AIO_CONTRACT WHERE STATUS != 3 AND STATUS != 4) " +
                "SELECT " +
                "nvl(COUNT(CONTRACT_ID), 0) count, " +
                "(CASE WHEN CREATED_DATE + 3 >= SYSDATE THEN 1 WHEN CREATED_DATE + 3 < SYSDATE THEN 2 END) flag " +
                "FROM CONTRACT " +
                "WHERE 1=1 " +
                subQuery +
                "GROUP BY (CASE WHEN CREATED_DATE + 3 >= SYSDATE THEN 1 WHEN CREATED_DATE + 3 < SYSDATE THEN 2 END) " +
                "ORDER BY (CASE WHEN CREATED_DATE + 3 >= SYSDATE THEN 1 WHEN CREATED_DATE + 3 < SYSDATE THEN 2 END) ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIORevenueAndRemainDTO.class));
        query.setParameterList("sysGroupIds", sysGroupIds);
        query.addScalar("count", new LongType());
        query.addScalar("flag", new IntegerType());

        return query.list();
    }

    public Long getRevenueDashboardInfo(String subQuery, List<String> sysGroupIds) {
        String sql = "WITH a AS (SELECT contract_id, sum(amount) amount, max(end_date) end_date " +
                "FROM AIO_ACCEPTANCE_RECORDS GROUP BY CONTRACT_ID) " +
                "SELECT nvl(sum(a.amount), 0) / 1.1 amount " +
                "FROM AIO_CONTRACT c " +
                "LEFT JOIN a ON c.CONTRACT_ID = a.contract_id " +
                "WHERE TRUNC(a.END_DATE) = trunc(sysdate) " +
//                "WHERE trunc(END_DATE) = '29-OCT-19' " +
                "AND c.STATUS = 3 " + subQuery;

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("amount", new LongType());
        query.setParameterList("sysGroupIds", sysGroupIds);
        return (Long) query.uniqueResult();
    }

    public Long getRevenueTotalGraphInfo(String subQuery, List<String> sysGroupIds) {
        String sql = subQuery +
                "where md.SYS_GROUP_ID in (:sysGroupIds) " +
                "and m.MONTH = TO_CHAR(SYSDATE, 'MM') and m.YEAR = TO_CHAR(SYSDATE, 'YYYY') ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("amount", new LongType());
        query.setParameterList("sysGroupIds", sysGroupIds);
        return (Long) query.uniqueResult();
    }

    public Long getRevenuePerformGraphInfo(String subQuery, List<String> sysGroupIds) {
        String sql = "WITH a AS (SELECT contract_id, sum(amount) amount, max(end_date) end_date " +
                "FROM AIO_ACCEPTANCE_RECORDS GROUP BY CONTRACT_ID) " +
                "SELECT nvl(sum(a.amount), 0) amount " +
                "FROM AIO_CONTRACT c " +
                "LEFT JOIN a ON c.CONTRACT_ID = a.contract_id " +
                "WHERE TO_CHAR(a.END_DATE, 'mm-yyyy') = TO_CHAR(SYSDATE, 'mm-yyyy') " +
//                "WHERE TO_CHAR(a.END_DATE, 'mm-yyyy') = '08-2019' " +
                "AND c.STATUS = 3 " + subQuery;

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("amount", new LongType());
        query.setParameterList("sysGroupIds", sysGroupIds);

        return (Long) query.uniqueResult();
    }

    public List<AIORevenueAndRemainDTO> getListContract(String subQuery, List<String> sysGroupIds) {
        String sql = "SELECT " +
                "c.CONTRACT_ID contractId, " +
                "c.contract_code contractCode, " +
                "c.customer_name customerName, " +
                "c.created_date createdDate, " +
                "TO_CHAR(c.CREATED_DATE, 'HH:mm DD/mm/yyyy') createdDateStr, " +
                "GREATEST(0, ROUND(((c.CREATED_DATE + 3) - SYSDATE) * 24, 0)) timeRemain, " +
                "c.performer_code || '-' || c.performer_name performerName, " +
                "su.PHONE_number performerPhone, " +
                "(select code || '-' || name from sys_group where sys_group_id = su.sys_group_id) groupName " +
                "FROM AIO_CONTRACT c " +
                "LEFT JOIN sys_user su ON su.sys_user_id = c.PERFORMER_ID " +
                "WHERE c.STATUS != 3 AND c.STATUS != 4 " +
                subQuery +
                "order by c.CONTRACT_ID desc ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIORevenueAndRemainDTO.class));
        query.addScalar("contractId", new LongType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("customerName", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdDateStr", new StringType());
        query.addScalar("timeRemain", new LongType());
        query.addScalar("performerName", new StringType());
        query.addScalar("performerPhone", new StringType());
        query.addScalar("groupName", new StringType());
        query.setParameterList("sysGroupIds", sysGroupIds);

        return query.list();
    }

    public List<AIORevenueAndRemainDTO> getListRevenue(String subQuery, List<String> sysGroupIds) {
        String sql = "WITH a AS (SELECT contract_id, sum(amount) amount, max(end_date) end_date, PERFORMER_ID performerId, " +
                "CASE WHEN trunc(max(end_date)) = trunc(sysdate) THEN nvl(sum(amount), 0) ELSE 0 END amount_daily " +
                "FROM AIO_ACCEPTANCE_RECORDS " +
                "WHERE TO_CHAR(END_DATE, 'mm-yyyy') = TO_CHAR(SYSDATE, 'mm-yyyy') " +
                "GROUP BY CONTRACT_ID, PERFORMER_ID) " +

                "SELECT DISTINCT " +
                "nvl(sum(a.amount) OVER (PARTITION BY c.PERFORMER_NAME), 0) revenuePerformMonth, " +
                "nvl(sum(a.amount_daily) OVER (PARTITION BY c.PERFORMER_NAME), 0) revenuePerformDaily, " +
                "c.performer_code || '-' || c.PERFORMER_NAME performerName " +
                "FROM AIO_CONTRACT c " +
                "LEFT JOIN a ON c.CONTRACT_ID = a.contract_id " +
//                "WHERE TRUNC(a.END_DATE) = trunc(sysdate) " +
//                "WHERE trunc(END_DATE) = '29-OCT-19' " +
                "where 1=1 " +
                "AND c.STATUS = 3 " +
                subQuery +
//                "GROUP BY c.performer_code || '-' || c.PERFORMER_NAME, c.PERFORMER_NAME " +
                "order by revenuePerformMonth desc, revenuePerformDaily desc ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIORevenueAndRemainDTO.class));
        query.addScalar("revenuePerformMonth", new LongType());
        query.addScalar("revenuePerformDaily", new LongType());
        query.addScalar("performerName", new StringType());
        query.setParameterList("sysGroupIds", sysGroupIds);
        return query.list();
    }

    public List<AIOSysGroupDTO> getListGroup(Long id) {
        String sql = "select sys_group_id sysGroupId, code, name " +
                "from sys_group " +
                "where status = 1 " +
                "and parent_id = (select parent_id from sys_group where sys_group_id = :sysGroupId) " +
                "and group_level = 3 ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOSysGroupDTO.class));
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.setParameter("sysGroupId", id);

        return query.list();
    }
}
