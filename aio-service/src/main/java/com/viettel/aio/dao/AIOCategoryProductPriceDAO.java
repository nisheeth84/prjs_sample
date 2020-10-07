package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOCategoryProductPriceBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

//StephenTrung__20191106_create
@EnableTransactionManagement
@Transactional
@Repository("aioCategoryProductPriceDAO")
public class AIOCategoryProductPriceDAO extends BaseFWDAOImpl<AIOCategoryProductPriceBO, Long> {

    public AIOCategoryProductPriceDAO() {
        this.model = new AIOCategoryProductPriceBO();
    }

    public AIOCategoryProductPriceDAO(Session session) {
        this.session = session;
    }
}
