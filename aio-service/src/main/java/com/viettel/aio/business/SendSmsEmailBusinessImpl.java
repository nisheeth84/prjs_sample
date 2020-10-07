package com.viettel.aio.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import com.viettel.aio.bo.SendSmsEmailBO;
import com.viettel.aio.dao.SendSmsEmailDAO;
import com.viettel.aio.dto.SendSmsEmailDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;

@Service("sendSmsEmailBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class SendSmsEmailBusinessImpl  extends BaseFWBusinessImpl<SendSmsEmailDAO, SendSmsEmailDTO, SendSmsEmailBO> implements SendSmsEmailBusiness{
	@Autowired
	private SendSmsEmailDAO sendSmsEmailDAO;
	
	public SendSmsEmailBusinessImpl() {
		tModel = new SendSmsEmailBO();
		tDAO = sendSmsEmailDAO;
	}

	@Override
	public SendSmsEmailDAO gettDAO() {
		return sendSmsEmailDAO;
	}
}
