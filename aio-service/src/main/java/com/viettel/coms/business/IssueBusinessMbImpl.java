package com.viettel.coms.business;

import com.viettel.coms.bo.IssueBO;
import com.viettel.coms.dao.IssueMbDAO;
import com.viettel.coms.dto.DomainDTO;
import com.viettel.coms.dto.IssueDTO;
import com.viettel.coms.dto.IssueRequest;
import com.viettel.coms.dto.IssueWorkItemDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.List;

/**
 * @author CuongNV2
 * @version 1.0
 * @since 2018-05-23
 */
@Service("issueBusinessMbImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class IssueBusinessMbImpl extends BaseFWBusinessImpl<IssueMbDAO, IssueDTO, IssueBO> {

    private static final String IS_TRANSFER_OPERATOR = "02";
    private static final String IS_OPEN_ISSUE = "01";
    private static final String IS_CLOSE_ISSUE = "00";
    private static final String ROLECODE_CHECKED = "1";
    private static final Long IS_GOVERNOR = 1l;
    @Autowired
    IssueMbDAO issueItemDAO;

    /**
     * update issue history
     *
     * @param request
     * @return sqlState
     * @throws ParseException
     */
    private int updateIssueHistory(IssueRequest request, IssueDTO currentHandingUserIdByContruction,
                                   Long changeSysRoleCodeNo) throws ParseException {
        return issueItemDAO.updateIssueHistoryHandingUserId(request,
                currentHandingUserIdByContruction.getCurrentHandingUserId(), changeSysRoleCodeNo);
    }

    /**
     * get list issue
     *
     * @param request
     * @return List<IssueWorkItemDTO>
     */
    public List<IssueWorkItemDTO> getIssueItem(IssueRequest req, boolean isGorvenor, boolean isProcessFeedback) {
        if (isProcessFeedback) {
            // list issue by Gorvenor
            List<IssueWorkItemDTO> lst = issueItemDAO.getIssueItemByProcessFeedback(req);
            return lst;
        } else if (isGorvenor) {
            // list issue by Gorvenor
            List<IssueWorkItemDTO> lst = issueItemDAO.getIssueItem(req);
            return lst;
        } else {
            // list issue by not Gorvenor
            List<IssueWorkItemDTO> lst = issueItemDAO.getIssueItemByStaff(req);
            return lst;
        }
    }

    /**
     * update issue by staff or governor
     *
     * @param req
     * @return sqlState
     * @throws Exception
     */
    public int updateIssueItem(IssueRequest req) throws Exception {
        List<IssueDTO> currentHandingUserIdByContruction = issueItemDAO.getGovernorIdByContructionId(req);
        if (currentHandingUserIdByContruction.size() == 0) {
            return -1;
        }

        int result = 0;
        Long changeSysRoleCodeNo = req.getIssueDetail().getChangeSysRoleCode();

        if (changeSysRoleCodeNo.compareTo(2l) == 0) {
            // chuyển bộ phận điều hành
            result = issueItemDAO.updateIssueItemToProcessFeedBack(req, currentHandingUserIdByContruction.get(0));
        } else if (changeSysRoleCodeNo.compareTo(0l) == 0) {
            // đóng phản ánh
            result = issueItemDAO.updateIssueItemByClose(req);
        } else if (changeSysRoleCodeNo.compareTo(1l) == 0) {
            // mở phản ánh
            result = issueItemDAO.updateIssueItemByOpen(req);
        }

        result = result + updateIssueHistory(req, currentHandingUserIdByContruction.get(0), changeSysRoleCodeNo);
        return result;
    }

    /**
     * getGovernorBySysUerId
     *
     * @param req
     * @return
     */
    public List<IssueWorkItemDTO> checkGovernor(IssueRequest request) {
        return issueItemDAO.checkGovernor(request);
    }

    /**
     * getGovernorBySysUerId
     *
     * @param req
     * @return
     */
    public List<DomainDTO> checkProcessFeedback(IssueRequest request) {
        return issueItemDAO.checkProcessFeedback(request);
    }

    /**
     * register issue
     *
     * @param request
     * @return sqlState
     * @throws ParseException
     */
    public int registerIssueItemDetail(IssueRequest request) throws ParseException {
        return issueItemDAO.registerIssueItemDetail(request);
    }
}
