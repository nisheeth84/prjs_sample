package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOOrderBranchDetailBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

//VietNT_20190824_create
@EnableTransactionManagement
@Transactional
@Repository("aioOrderBranchDetailDAO")
public class AIOOrderBranchDetailDAO extends BaseFWDAOImpl<AIOOrderBranchDetailBO, Long> {

    public AIOOrderBranchDetailDAO() {
        this.model = new AIOOrderBranchDetailBO();
    }

    public AIOOrderBranchDetailDAO(Session session) {
        this.session = session;
    }
}
