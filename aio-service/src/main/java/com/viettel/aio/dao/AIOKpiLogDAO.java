package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOKpiLogBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

//VietNT_20200213_create
@EnableTransactionManagement
@Transactional
@Repository("aioKpiLogDAO")
public class AIOKpiLogDAO extends BaseFWDAOImpl<AIOKpiLogBO, Long> {

    public AIOKpiLogDAO() {
        this.model = new AIOKpiLogBO();
    }

    public AIOKpiLogDAO(Session session) {
        this.session = session;
    }
}
