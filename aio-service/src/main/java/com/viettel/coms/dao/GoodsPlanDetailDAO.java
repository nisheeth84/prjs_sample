package com.viettel.coms.dao;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import com.viettel.coms.bo.GoodsPlanDetailBO;
import com.viettel.coms.dto.GoodsPlanDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

@Repository("goodsPlanDetailDAO")
public class GoodsPlanDetailDAO extends BaseFWDAOImpl<GoodsPlanDetailBO, Long> {
	public GoodsPlanDetailDAO() {
		this.model = new GoodsPlanDetailBO();
	}

	public GoodsPlanDetailDAO(Session session) {
		this.session = session;
	}
	
	public void removeGoodsPlanDetail(GoodsPlanDTO obj){
		StringBuilder sql = new StringBuilder("DELETE GOODS_PLAN_DETAIL WHERE GOODS_PLAN_ID=:goodsPlanId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("goodsPlanId", obj.getGoodsPlanId());
		query.executeUpdate();
	}
}
