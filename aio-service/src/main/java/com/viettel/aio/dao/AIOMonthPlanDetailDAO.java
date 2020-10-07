package com.viettel.aio.dao;

import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import com.viettel.aio.bo.AIOMonthPlanBO;
import com.viettel.aio.bo.AIOMonthPlanDetailBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

@EnableTransactionManagement
@Transactional
@Repository("aioMonthPlanDetailDAO")
public class AIOMonthPlanDetailDAO extends BaseFWDAOImpl<AIOMonthPlanDetailBO, Long>{

	public AIOMonthPlanDetailDAO() {
        this.model = new AIOMonthPlanDetailBO();
    }

    public AIOMonthPlanDetailDAO(Session session) {
        this.session = session;
    }
}
