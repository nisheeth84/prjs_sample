package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOContractPauseBO;
import com.viettel.aio.dto.AIOContractPauseDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

//VietNT_20190927_create
@EnableTransactionManagement
@Transactional
@Repository("aioContractPauseDAO")
public class AIOContractPauseDAO extends BaseFWDAOImpl<AIOContractPauseBO, Long> {

    public AIOContractPauseDAO() {
        this.model = new AIOContractPauseBO();
    }

    public AIOContractPauseDAO(Session session) {
        this.session = session;
    }


    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOContractPauseDTO> getListByContractId(Long contractId) {
        String sql = "SELECT " +
                "CONTRACT_PAUSE_ID contractPauseId, " +
                "CONTRACT_ID contractId, " +
                "CREATED_DATE createdDate, " +
                "APPOINTMENT_DATE appointmentDate, " +
                "STATUS status " +
//                "CREATED_USER createdUser, " +
//                "UPDATED_USER updatedUser, " +
                "FROM AIO_CONTRACT_PAUSE " +
                "where contract_id = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOContractPauseDTO.class));
        query.addScalar("contractPauseId", new LongType());
        query.addScalar("contractId", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("appointmentDate", new DateType());
        query.addScalar("status", new LongType());
        query.setParameter("id", contractId);

        return query.list();
    }

    public int updateStatus(Long id, Long status, Long userId) {
        String sql = "update AIO_CONTRACT_PAUSE " +
                "set status = :status, " +
                "UPDATED_USER = :userId " +
                "where CONTRACT_PAUSE_ID = :id ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("status", status);
        query.setParameter("userId", userId);
        query.setParameter("id", id);

        return query.executeUpdate();
    }
}
