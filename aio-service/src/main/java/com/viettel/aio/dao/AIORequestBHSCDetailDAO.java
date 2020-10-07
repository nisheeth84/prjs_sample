package com.viettel.aio.dao;

import com.viettel.aio.bo.AIORequestBHSCDetailBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

//VietNT_20190916_create
@EnableTransactionManagement
@Transactional
@Repository("aioRequestBhscDetailDAO")
public class AIORequestBHSCDetailDAO extends BaseFWDAOImpl<AIORequestBHSCDetailBO, Long> {

    public AIORequestBHSCDetailDAO() {
        this.model = new AIORequestBHSCDetailBO();
    }

    public AIORequestBHSCDetailDAO(Session session) {
        this.session = session;
    }
}
