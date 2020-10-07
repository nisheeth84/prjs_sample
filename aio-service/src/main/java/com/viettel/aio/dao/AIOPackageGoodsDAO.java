package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOPackageGoodsBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

//VietNT_20190308_create
@EnableTransactionManagement
@Transactional
@Repository("aioPackageGoodsDAO")
public class AIOPackageGoodsDAO extends BaseFWDAOImpl<AIOPackageGoodsBO, Long> {

    public AIOPackageGoodsDAO() {
        this.model = new AIOPackageGoodsBO();
    }

    public AIOPackageGoodsDAO(Session session) {
        this.session = session;
    }
}
