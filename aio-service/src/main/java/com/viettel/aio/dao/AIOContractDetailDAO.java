package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOContractDetailBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

//VietNT_20190313_create
@EnableTransactionManagement
@Transactional
@Repository("aioContractDetailDAO")
public class AIOContractDetailDAO extends BaseFWDAOImpl<AIOContractDetailBO, Long> {

    public AIOContractDetailDAO() {
        this.model = new AIOContractDetailBO();
    }

    public AIOContractDetailDAO(Session session) {
        this.session = session;
    }
}
