package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOAcceptanceRecordsBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

//VietNT_20190313_create
@EnableTransactionManagement
@Transactional
@Repository("aioAcceptanceRecordsDAO")
public class AIOAcceptanceRecordsDAO extends BaseFWDAOImpl<AIOAcceptanceRecordsBO, Long> {

    public AIOAcceptanceRecordsDAO() {
        this.model = new AIOAcceptanceRecordsBO();
    }

    public AIOAcceptanceRecordsDAO(Session session) {
        this.session = session;
    }
}
