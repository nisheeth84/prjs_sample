package com.viettel.aio.dao;

import java.math.BigDecimal;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import com.viettel.aio.bo.AIOOrderBranchBO;
import com.viettel.aio.bo.AIOOrderBranchDetailRequestBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

@EnableTransactionManagement
@Transactional
@Repository("aioOrderBranchDetailRequestDAO")
public class AIOOrderBranchDetailRequestDAO extends BaseFWDAOImpl<AIOOrderBranchDetailRequestBO, Long> {

	public AIOOrderBranchDetailRequestDAO() {
        this.model = new AIOOrderBranchDetailRequestBO();
    }

    public AIOOrderBranchDetailRequestDAO(Session session) {
        this.session = session;
    }


    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }
}
