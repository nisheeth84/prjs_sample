package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOOrderRequestDetailBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

//VietNT_20190820_create
@EnableTransactionManagement
@Transactional
@Repository("aioOrderRequestDetailDAO")
public class AIOOrderRequestDetailDAO extends BaseFWDAOImpl<AIOOrderRequestDetailBO, Long> {

    public AIOOrderRequestDetailDAO() {
        this.model = new AIOOrderRequestDetailBO();
    }

    public AIOOrderRequestDetailDAO(Session session) {
        log.info(session);
        this.session = session;
    }
}
