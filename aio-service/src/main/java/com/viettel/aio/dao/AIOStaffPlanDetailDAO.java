package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOStaffPlanDetailBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

@EnableTransactionManagement
@Transactional
@Repository("aioStaffPlanDetailDAO")
public class AIOStaffPlanDetailDAO extends BaseFWDAOImpl<AIOStaffPlanDetailBO, Long>{

	public AIOStaffPlanDetailDAO() {
        this.model = new AIOStaffPlanDetailBO();
    }

    public AIOStaffPlanDetailDAO(Session session) {
        this.session = session;
    }


}
