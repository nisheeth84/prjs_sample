package com.viettel.coms.dao;

import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import com.viettel.coms.bo.GoodsPlanDetailBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

@Repository("manufacturingDetailDAO")
public class manufacturingDetailDAO extends BaseFWDAOImpl<GoodsPlanDetailBO, Long> {
	public manufacturingDetailDAO() {
        this.model = new GoodsPlanDetailBO();
    }

    public manufacturingDetailDAO(Session session) {
        this.session = session;
    }
}
