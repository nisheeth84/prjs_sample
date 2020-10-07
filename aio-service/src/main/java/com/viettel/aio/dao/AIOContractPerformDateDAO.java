package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOContractPerformDateBO;
import com.viettel.aio.dto.AIOContractPerformDateDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

//VietNT_20190927_create
@EnableTransactionManagement
@Transactional
@Repository("aioContractPerformDateDAO")
public class AIOContractPerformDateDAO extends BaseFWDAOImpl<AIOContractPerformDateBO, Long> {

    public AIOContractPerformDateDAO() {
        this.model = new AIOContractPerformDateBO();
    }

    public AIOContractPerformDateDAO(Session session) {
        this.session = session;
    }


    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOContractPerformDateDTO> getListByContractId(Long contractId) {
        String sql = "SELECT " +
                "CONTRACT_PERFORM_DATE_ID contractPerformDateId, " +
                "CONTRACT_ID contractId, " +
                "START_DATE startDate, " +
                "END_DATE endDate " +
                "FROM AIO_CONTRACT_PERFORM_DATE " +
                "where contract_id = " + contractId;

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOContractPerformDateDTO.class));
        query.addScalar("contractPerformDateId", new LongType());
        query.addScalar("contractId", new LongType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());

        return query.list();
    }

    public Long getNullEndDateByContractId(Long contractId) {
        String sql = "SELECT CONTRACT_PERFORM_DATE_ID contractPerformDateId FROM AIO_CONTRACT_PERFORM_DATE " +
                "where end_date is null and contract_id = " + contractId;

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("contractPerformDateId", new LongType());
        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (Long) list.get(0);
        }
        return null;
    }

    public List<AIOContractPerformDateDTO> getListPerformDate(Long contractId) {
        String sql = "SELECT " +
                "CONTRACT_PERFORM_DATE_ID contractPerformDateId, " +
                "START_DATE startDate, " +
                "END_DATE endDate " +
                "FROM AIO_CONTRACT_PERFORM_DATE " +
                "where contract_id = :contractId " +
                " order by start_date ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOContractPerformDateDTO.class));
        query.addScalar("contractPerformDateId", new LongType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.setParameter("contractId", contractId);

        return query.list();
    }

    public int deletePerformDateInvalid(Long id) {
        String sql = "delete FROM AIO_CONTRACT_PERFORM_DATE " +
                "where CONTRACT_PERFORM_DATE_ID = :id ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", id);

        return query.executeUpdate();
    }

    public int updateEndDate(Long id, Date date) {
        String sql = "update AIO_CONTRACT_PERFORM_DATE set " +
                "end_date = :date " +
                "where CONTRACT_PERFORM_DATE_ID = :id ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", id);
        query.setParameter("date", date);

        return query.executeUpdate();
    }

    public int updateStartDate(Long id, Date date) {
        String sql = "update AIO_CONTRACT_PERFORM_DATE set " +
                "start_date = :date " +
                "where CONTRACT_PERFORM_DATE_ID = :id ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", id);
        query.setParameter("date", date);

        return query.executeUpdate();
    }
}
