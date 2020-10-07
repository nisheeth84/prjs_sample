package com.viettel.coms.business;

import com.viettel.coms.bo.IssueDiscussBO;
import com.viettel.coms.dao.IssueDiscussDAO;
import com.viettel.coms.dto.IssueDiscussDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("issueDiscussBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class IssueDiscussBusinessImpl extends BaseFWBusinessImpl<IssueDiscussDAO, IssueDiscussDTO, IssueDiscussBO>
        implements IssueDiscussBusiness {

    @Autowired
    private IssueDiscussDAO issueDiscussDAO;

    public IssueDiscussBusinessImpl() {
        tModel = new IssueDiscussBO();
        tDAO = issueDiscussDAO;
    }

    @Override
    public IssueDiscussDAO gettDAO() {
        return issueDiscussDAO;
    }

    @Override
    public long count() {
        return issueDiscussDAO.count("IssueDiscussBO", null);
    }

}
