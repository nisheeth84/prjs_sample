package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOOrderRequestBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

//VietNT_20190820_create
@EnableTransactionManagement
@Transactional
@Repository("aioOrderRequestDAO")
public class AIOOrderRequestDAO extends BaseFWDAOImpl<AIOOrderRequestBO, Long> {

    public AIOOrderRequestDAO() {
        this.model = new AIOOrderRequestBO();
    }

    public AIOOrderRequestDAO(Session session) {
        log.info(session);
        this.session = session;
    }
}
