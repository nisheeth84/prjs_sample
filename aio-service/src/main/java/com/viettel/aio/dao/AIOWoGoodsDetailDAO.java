package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOWoGoodsDetailBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

//VietNT_20200130_create
@EnableTransactionManagement
@Transactional
@Repository("aioWoGoodsDetailDAO")
public class AIOWoGoodsDetailDAO extends BaseFWDAOImpl<AIOWoGoodsDetailBO, Long> {

    public AIOWoGoodsDetailDAO() {
        this.model = new AIOWoGoodsDetailBO();
    }

    public AIOWoGoodsDetailDAO(Session session) {
        this.session = session;
    }
}
