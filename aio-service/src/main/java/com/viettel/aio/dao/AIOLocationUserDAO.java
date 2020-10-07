package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOLocationUserBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;


//VietNT_20190318_create
@EnableTransactionManagement
@Transactional
@Repository("aioLocationUserDAO")
public class AIOLocationUserDAO extends BaseFWDAOImpl<AIOLocationUserBO, Long> {

    public AIOLocationUserDAO() {
        this.model = new AIOLocationUserBO();
    }

    public AIOLocationUserDAO(Session session) {
        this.session = session;
    }
}
