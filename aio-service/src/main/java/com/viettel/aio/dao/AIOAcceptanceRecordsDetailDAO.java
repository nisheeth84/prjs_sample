package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOAcceptanceRecordsDetailBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import javax.transaction.Transactional;

//VietNT_20190313_create
@Transactional
@Repository("aioAcceptanceRecordsDetailDAO")
public class AIOAcceptanceRecordsDetailDAO extends BaseFWDAOImpl<AIOAcceptanceRecordsDetailBO, Long> {

    public AIOAcceptanceRecordsDetailDAO() {
        this.model = new AIOAcceptanceRecordsDetailBO();
    }

    public AIOAcceptanceRecordsDetailDAO(Session session) {
        this.session = session;
    }
}
