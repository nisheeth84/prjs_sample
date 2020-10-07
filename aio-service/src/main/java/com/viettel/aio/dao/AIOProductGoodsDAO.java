package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOProductGoodsBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

//VietNT_20190724_create
@EnableTransactionManagement
@Transactional
@Repository("aioProductGoodsDAO")
public class AIOProductGoodsDAO extends BaseFWDAOImpl<AIOProductGoodsBO, Long> {

    public AIOProductGoodsDAO() {
        this.model = new AIOProductGoodsBO();
    }

    public AIOProductGoodsDAO(Session session) {
        this.session = session;
    }

}
