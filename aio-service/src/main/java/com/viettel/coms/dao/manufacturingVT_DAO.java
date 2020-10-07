package com.viettel.coms.dao;

import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import com.viettel.coms.bo.manufacturingVTBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

@Repository("manufacturingVT_DAO")
public class manufacturingVT_DAO extends BaseFWDAOImpl<manufacturingVTBO, Long> {
	public manufacturingVT_DAO() {
        this.model = new manufacturingVTBO();
    }

    public manufacturingVT_DAO(Session session) {
        this.session = session;
    }
}
