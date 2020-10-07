package com.viettel.coms.business;

import com.viettel.coms.bo.IssueHistoryBO;
import com.viettel.coms.dao.IssueHistoryDAO;
import com.viettel.coms.dto.IssueHistoryDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("issueHistoryBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class IssueHistoryBusinessImpl extends BaseFWBusinessImpl<IssueHistoryDAO, IssueHistoryDTO, IssueHistoryBO>
        implements IssueHistoryBusiness {

    @Autowired
    private IssueHistoryDAO issueHistoryDAO;

    public IssueHistoryBusinessImpl() {
        tModel = new IssueHistoryBO();
        tDAO = issueHistoryDAO;
    }

    @Override
    public IssueHistoryDAO gettDAO() {
        return issueHistoryDAO;
    }

    @Override
    public long count() {
        return issueHistoryDAO.count("IssueHistoryBO", null);
    }

}
