package com.viettel.coms.business;

import com.viettel.cat.dto.IssueHistoryDetailDTO;
import com.viettel.coms.bo.IssueBO;
import com.viettel.coms.bo.IssueDiscussBO;
import com.viettel.coms.bo.IssueHistoryBO;
import com.viettel.coms.dao.IssueDAO;
import com.viettel.coms.dao.IssueDiscussDAO;
import com.viettel.coms.dao.IssueHistoryDAO;
import com.viettel.coms.dto.IssueDTO;
import com.viettel.coms.dto.IssueDetailDTO;
import com.viettel.coms.dto.IssueDiscussDTO;
import com.viettel.coms.utils.PermissionUtils;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service("issueBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class IssueBusinessImpl extends BaseFWBusinessImpl<IssueDAO, IssueDTO, IssueBO> implements IssueBusiness {

    private static final String ROLECODE_CHECKED = "1";
    @Autowired
    IssueDAO issueItemDAO;

    @Autowired
    private IssueHistoryDAO issueHistoryDAO;
    @Autowired
    private IssueDiscussDAO issueDiscussDAO;
    @Autowired
    private IssueDAO issueDAO;

    public IssueBusinessImpl() {
        tModel = new IssueBO();
        tDAO = issueItemDAO;
    }

    @Override
    public IssueDAO gettDAO() {
        return issueItemDAO;
    }

    public DataListDTO doSearch(IssueDetailDTO obj, HttpServletRequest request) {
        // TODO Auto-generated method stub
        List<IssueDetailDTO> list = new ArrayList<IssueDetailDTO>();
        obj.setTotalRecord(0);
        List<String> groupIdList = PermissionUtils.getListIdInDomainData(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.DATA, request);
        if (groupIdList != null && !groupIdList.isEmpty())
            list = issueItemDAO.doSearch(obj, groupIdList);
        DataListDTO data = new DataListDTO();
        data.setData(list);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

    public Long save(IssueDetailDTO obj, HttpServletRequest request) {
        // TODO Auto-generated method stub
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        obj.setUpdatedUserId(objUser.getVpsUserInfo().getSysUserId());

        if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.PROCESS, Constant.AdResourceKey.FEEDBACK,
                request)) {
            throw new IllegalArgumentException("Bạn không có quyền chỉnh sửa phản ánh");
        }
        if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.VIEW, Constant.AdResourceKey.DATA,
                issueItemDAO.getProvinceIdByIssue(obj.getIssueId()), request)) {
            throw new IllegalArgumentException("Bạn không có quyền chỉnh sửa phản ánh cho công trình này");
        }
        Long i = (long) issueItemDAO.updateIssue(obj);
        // tao issuse history noi dung
        Date date = new Date();
        if (StringUtils.isNotEmpty(obj.getProcessContent())) {
            IssueHistoryBO hisBoContent = initIssueHistoryBO(obj, "3", date);
            String nd = issueHistoryDAO.GetListHistory(obj.getIssueId());
            hisBoContent.setNewValue(obj.getProcessContent());
            hisBoContent.setOldValue(nd);
            issueHistoryDAO.save(hisBoContent);
        }

        if (obj.getCurrentHandingUserIdNew() != null) {
            IssueHistoryBO hisBoNguoiXuly = initIssueHistoryBO(obj, "2", date);
            issueHistoryDAO.save(hisBoNguoiXuly);

            Long newValue = Long.parseLong(hisBoNguoiXuly.getNewValue());
            issueDAO.updateCurentHandingUser(obj.getIssueId(), newValue);

        }
        if (StringUtils.isNotEmpty(obj.getStatus())) {
            if (!obj.getStatus().equalsIgnoreCase(obj.getOldStatus())) {
                IssueHistoryBO hisBoTrangThai = initIssueHistoryBO(obj, "1", date);
                issueHistoryDAO.save(hisBoTrangThai);
            }
        }
        if (StringUtils.isNotEmpty(obj.getDiscussContent())) {
            IssueHistoryBO hisBoThaoLuan = initIssueHistoryBO(obj, "4", date);
            String lt = issueHistoryDAO.GetListHistory(obj.getIssueId());
            hisBoThaoLuan.setNewValue(obj.getDiscussContent());
            hisBoThaoLuan.setOldValue(lt);
            issueHistoryDAO.save(hisBoThaoLuan);
            IssueDiscussBO dis = new IssueDiscussBO();
            dis.setCreatedDate(new Date());
            dis.setCreatedUserId(obj.getUpdatedUserId());
            dis.setContent(obj.getDiscussContent());
            dis.setIssueId(obj.getIssueId());
            issueDiscussDAO.save(dis);
        }
        return i;
    }

    private IssueHistoryBO initIssueHistoryBO(IssueDetailDTO obj, String type, Date date) {
        // TODO Auto-generated method stub
        IssueHistoryBO hisBo = new IssueHistoryBO();
        hisBo.setCreatedDate(date);
        hisBo.setCreatedUserId(obj.getUpdatedUserId());
        hisBo.setIssueId(obj.getIssueId());
        hisBo.setType(type);
        switch (type) {
            case "4":
                hisBo.setNewValue(obj.getDiscussContent());
//			hisBo.setOldValue(obj.getContentHanding());
                break;
            case "3":
                hisBo.setNewValue(obj.getProcessContent());
                hisBo.setOldValue(obj.getContentHanding());
                break;
            case "2":
                hisBo.setNewValue(
                        obj.getCurrentHandingUserIdNew() != null ? obj.getCurrentHandingUserIdNew().toString() : "");
                hisBo.setOldValue(obj.getCurrentHandingUserId() != null ? obj.getCurrentHandingUserId().toString() : "");
                break;
            case "1":
                hisBo.setNewValue(obj.getStatus());
                hisBo.setOldValue(obj.getOldStatus());
                break;
        }
        return hisBo;
    }

    public List<IssueDiscussDTO> getIssueDiscuss(IssueDetailDTO obj) {
        // TODO Auto-generated method stub
        return issueItemDAO.getIssueDiscuss(obj);
    }

    public List<IssueHistoryDetailDTO> getIssueHistory(IssueDetailDTO obj) {
        // TODO Auto-generated method stub
        List<IssueHistoryDetailDTO> data = issueItemDAO.getIssueHistory(obj);
        if (data != null && !data.isEmpty()) {
            for (IssueHistoryDetailDTO dto : data) {
                dto.setDetailList(issueItemDAO.getIssueHistoryGroup(dto));
            }
        }
        return data;
    }

}
