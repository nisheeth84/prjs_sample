package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOProductPriceBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

//VietNT_20190701_create
@EnableTransactionManagement
@Transactional
@Repository("aioProductPriceDAO")
public class AIOProductPriceDAO extends BaseFWDAOImpl<AIOProductPriceBO, Long> {

    public AIOProductPriceDAO() {
        this.model = new AIOProductPriceBO();
    }

    public AIOProductPriceDAO(Session session) {
        this.session = session;
    }
}
