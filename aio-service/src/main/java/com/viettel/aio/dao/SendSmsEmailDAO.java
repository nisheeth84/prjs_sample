package com.viettel.aio.dao;

import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import com.viettel.aio.bo.SendSmsEmailBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

@Repository("sendSmsEmailDAO")
public class SendSmsEmailDAO extends BaseFWDAOImpl<SendSmsEmailBO, Long>{
	public SendSmsEmailDAO() {
		this.model = new SendSmsEmailBO();
	}

	public SendSmsEmailDAO(Session session) {
		this.session = session;
	}
}
