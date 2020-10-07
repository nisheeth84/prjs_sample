package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOPackageDetailPriceBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

//VietNT_20190420_create
@EnableTransactionManagement
@Transactional
@Repository("aioPackageDetailPriceDAO")
public class AIOPackageDetailPriceDAO extends BaseFWDAOImpl<AIOPackageDetailPriceBO, Long> {

    public AIOPackageDetailPriceDAO() {
        this.model = new AIOPackageDetailPriceBO();
    }

    public AIOPackageDetailPriceDAO(Session session) {
        this.session = session;
    }
}
