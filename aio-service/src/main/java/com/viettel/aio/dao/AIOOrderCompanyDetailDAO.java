package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOOrderCompanyDetailBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

//VietNT_20190903_create
@EnableTransactionManagement
@Transactional
@Repository("aioOrderCompanyDetailDAO")
public class AIOOrderCompanyDetailDAO extends BaseFWDAOImpl<AIOOrderCompanyDetailBO, Long> {

    public AIOOrderCompanyDetailDAO() {
        this.model = new AIOOrderCompanyDetailBO();
    }

    public AIOOrderCompanyDetailDAO(Session session) {
        this.session = session;
    }
}
