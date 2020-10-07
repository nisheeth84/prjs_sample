package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOPackageGoodsAddBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

//VietNT_20190308_create
@EnableTransactionManagement
@Transactional
@Repository("aioPackageGoodsAddDAO")
public class AIOPackageGoodsAddDAO extends BaseFWDAOImpl<AIOPackageGoodsAddBO, Long> {

    public AIOPackageGoodsAddDAO() {
        this.model = new AIOPackageGoodsAddBO();
    }

    public AIOPackageGoodsAddDAO(Session session) {
        this.session = session;
    }
}
