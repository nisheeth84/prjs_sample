package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOReglectDetailBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

//VietNT_20190909_create
@EnableTransactionManagement
@Transactional
@Repository("aioReglectDetailDAO")
public class AIOReglectDetailDAO extends BaseFWDAOImpl<AIOReglectDetailBO, Long> {

    public AIOReglectDetailDAO() {
        this.model = new AIOReglectDetailBO();
    }

    public AIOReglectDetailDAO(Session session) {
        this.session = session;
    }
}
