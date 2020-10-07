package com.viettel.aio.business;

import com.viettel.aio.bo.AIORequestBHSCBO;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.dao.AIORequestBHSCDAO;
import com.viettel.aio.dao.AIORequestBHSCDetailDAO;
import com.viettel.aio.dto.*;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

//VietNT_20190913_created
@Service("aioRequestBhscBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIORequestBHSCBusinessImpl extends BaseFWBusinessImpl<AIORequestBHSCDAO, AIORequestBHSCDTO, AIORequestBHSCBO> {

    static Logger LOGGER = LoggerFactory.getLogger(AIORequestBHSCBusinessImpl.class);

    @Autowired
    public AIORequestBHSCBusinessImpl(AIORequestBHSCDAO aioRequestBHSCDAO, CommonServiceAio commonService,
                                      AIORequestBHSCDetailDAO aioRequestBHSCDetailDAO) {
        this.aioRequestBHSCDAO = aioRequestBHSCDAO;
        this.commonService = commonService;
        this.aioRequestBHSCDetailDAO = aioRequestBHSCDetailDAO;
    }

    private AIORequestBHSCDAO aioRequestBHSCDAO;
    private CommonServiceAio commonService;
    private AIORequestBHSCDetailDAO aioRequestBHSCDetailDAO;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Context
    HttpServletRequest request;

    private static final Long STATUS_WAIT = 1L;
    private static final Long STATUS_DOING = 2L;
    private static final Long STATUS_FINISH = 3L;
    // status approve
    private static final Long STATUS_APPROVED_WAIT = 1L;
    private static final Long STATUS_APPROVED_OK = 2L;
    private static final Long STATUS_APPROVED_REJECTED = 3L;
    private static final String UTIL_ATTACHMENT_TYPE = "102";
    private static final String UTIL_ATTACHMENT_DESC = "File ảnh BHSC";

    public DataListDTO doSearch(AIORequestBHSCDTO criteria) {
        List<AIORequestBHSCDTO> dtos = aioRequestBHSCDAO.doSearch(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    private void validateRequestApproveStatus(AIORequestBHSCDTO obj) {
        AIORequestBHSCDTO chkObj = this.getRequestWarrantyById(obj.getAioRequestBhscId());
        if (chkObj == null) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.REQUEST_BHSC.getName());
        }
        if (!chkObj.getStatus().equals(STATUS_DOING) || !chkObj.getStatusApproved().equals(STATUS_APPROVED_WAIT)) {
            throw new BusinessException(AIOErrorType.WRONG_STATUS.msg + AIOObjectType.REQUEST_BHSC.getName());
        }
    }

    public void approve(AIORequestBHSCDTO obj) {
        this.validateRequestApproveStatus(obj);
        obj.setStatusApproved(STATUS_APPROVED_WAIT);
        aioRequestBHSCDAO.udpateStatusApproved(obj.getAioRequestBhscId(), obj.getStatusApproved(), obj.getUpdatedUser());
    }

    public void deny(AIORequestBHSCDTO obj) {
        this.validateRequestApproveStatus(obj);
        obj.setStatusApproved(STATUS_APPROVED_REJECTED);
        aioRequestBHSCDAO.udpateStatusApproved(obj.getAioRequestBhscId(), obj.getStatusApproved(), obj.getUpdatedUser());
    }

    public DataListDTO getListPerformer(AIOLocationUserDTO criteria, Long sysUserId) {
        Long sysGroupLv2 = commonService.getSysGroupLevelByUserId(sysUserId, 2);
        List<AIOLocationUserDTO> dtos = aioRequestBHSCDAO.getListSysUser(criteria, sysGroupLv2);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    private void validateChoosePerformer(List<Long> requestBhscIds) {
        List<AIORequestBHSCDTO> statuses = aioRequestBHSCDAO.getStatusRequestBHSC(requestBhscIds);
        for (AIORequestBHSCDTO dto : statuses) {
            if (dto.getStatus() == null || dto.getAioRequestBhscId() == null) {
                throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.REQUEST_BHSC.getName());
            }
            if (!dto.getStatus().equals(STATUS_WAIT) && !dto.getStatus().equals(STATUS_DOING)) {
                throw new BusinessException(AIOErrorType.WRONG_STATUS.msg + AIOObjectType.REQUEST_BHSC.getName());
            }
        }
    }

    public void choosePerformer(Long performerId, List<Long> requestBhscIds, Long sysUserId) {
        this.validateChoosePerformer(requestBhscIds);
        aioRequestBHSCDAO.choosePerformer(performerId, requestBhscIds, sysUserId);
    }

    public List<AIORequestBHSCDetailDTO> getDetailByRequestId(Long requestId) {
        return aioRequestBHSCDAO.getByRequestId(requestId);
    }

    public List<UtilAttachDocumentDTO> getListImages(Long requestId) {
        return commonService.getListImagesByIdAndType(Collections.singletonList(requestId), UTIL_ATTACHMENT_TYPE);
    }

    public Long createRequestWarranty(AIORequestBHSCDTO dto) {

        // get area info
        Long performerId = aioRequestBHSCDAO.getPerformerIdByContract(dto.getContractId());
        dto.setPerformerId(performerId);
        dto.setPerformerGroupId(commonService.getSysGroupLevelByUserId(performerId, 2));
        dto.setStatus(STATUS_WAIT);
        dto.setCreatedDate(new Date());

        return aioRequestBHSCDAO.saveObject(dto.toModel());
    }

    public AIORequestBHSCDTO getRequestWarrantyById(Long requestId) {
        return aioRequestBHSCDAO.getRequestWarrantyById(requestId);
    }

    // mobi
    public void createRequest(AIOContractMobileRequest rq) {
        AIORequestBHSCDTO dto = rq.getRequestBHSCDTO();
        if (dto == null || rq.getSysUserRequest() == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        if (dto.getCustomerId() == null || StringUtils.isEmpty(dto.getCustomerCode())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " khách hàng");
        }
        if (dto.getServiceType() == null || (dto.getServiceType() != 1L && dto.getServiceType() != 2L)) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " loại dịch vụ");
        }

        dto.setStatus(STATUS_WAIT);
        dto.setCreatedUser(rq.getSysUserRequest().getSysUserId());
        dto.setCreatedDate(new Date());

        AIOAreaDTO defaultPerformer = aioRequestBHSCDAO.getDefaultPerformerByCustomerId(dto.getCustomerId());
        if (defaultPerformer == null) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + " người thực hiện");
        }

        if (dto.getServiceType() == 1L) {
            dto.setPerformerId(defaultPerformer.getSysUserId());
        } else {
            dto.setPerformerId(defaultPerformer.getSaleSysUserId());
        }

        Long groupLv2 = commonService.getSysGroupLevelByUserId(dto.getPerformerId(), 2);
        dto.setPerformerGroupId(groupLv2);

        Long id = aioRequestBHSCDAO.saveObject(dto.toModel());
        commonService.validateIdCreated(id, AIOObjectType.REQUEST_BHSC);
    }

    private void validateRequest(AIOContractMobileRequest rq) {
        AIORequestBHSCDTO dto = rq.getRequestBHSCDTO();
        if (dto == null || rq.getSysUserRequest() == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        if (dto.getAioRequestBhscId() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.REQUEST_BHSC.getName());
        }
    }

    public AIORequestBHSCDTO getListRequestBHSC(AIOContractMobileRequest rq) {
        if (rq.getSysUserRequest() == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        List<AIORequestBHSCDTO> data = aioRequestBHSCDAO.getListRequestBHSC(rq.getSysUserRequest().getSysUserId());
        AIORequestBHSCDTO res = new AIORequestBHSCDTO();
        res.setListRequest(data);
        return res;
    }

    public AIORequestBHSCDTO getDetailRequestBHSC(AIOContractMobileRequest rq) {
        this.validateRequest(rq);
        AIORequestBHSCDTO dto = rq.getRequestBHSCDTO();

        AIORequestBHSCDTO requestBHSCDTO = aioRequestBHSCDAO.getRequestBHSCById(dto.getAioRequestBhscId());
        List<AIORequestBHSCDetailDTO> data;
        List<UtilAttachDocumentDTO> listImages = new ArrayList<>();
        if (requestBHSCDTO.getStatus().equals(STATUS_WAIT)) {
            data = aioRequestBHSCDAO.getCustomerGoodsUsed(requestBHSCDTO.getCustomerId());
        } else {
            data = aioRequestBHSCDAO.getDetailRequestBHSC(dto.getAioRequestBhscId());
            listImages = commonService.getListImagesByIdAndType(Collections.singletonList(dto.getAioRequestBhscId()), UTIL_ATTACHMENT_TYPE);
        }

        AIORequestBHSCDTO res = new AIORequestBHSCDTO();
        res.setState(requestBHSCDTO.getState());
        res.setWarrantyForm(requestBHSCDTO.getWarrantyForm());
        res.setStatus(requestBHSCDTO.getStatus());
        res.setStatusApproved(requestBHSCDTO.getStatusApproved());
        res.setListRequestDetail(data);
        res.setListImage(listImages);
        return res;
    }

    public void save(AIOContractMobileRequest rq) {
        this.validateRequest(rq);
        this.validateSave(rq.getRequestBHSCDTO());
        AIORequestBHSCDTO dto = rq.getRequestBHSCDTO();
        AIORequestBHSCDTO statusObj = aioRequestBHSCDAO.getStatusRequestBHSC(dto.getAioRequestBhscId());
        if (statusObj.getStatus() != 1) {
            throw new BusinessException(AIOErrorType.WRONG_STATUS.msg + AIOObjectType.REQUEST_BHSC.getName());
        }

        // save detail
        for (AIORequestBHSCDetailDTO detail : dto.getListRequestDetail()) {
            detail.setAioRequestBhscId(dto.getAioRequestBhscId());
            Long id = aioRequestBHSCDetailDAO.saveObject(detail.toModel());
            commonService.validateIdCreated(id, AIOObjectType.ORDER_REQUEST_DETAIL);
        }

        // save image
        commonService.saveImages(dto.getListImage(), dto.getAioRequestBhscId(), UTIL_ATTACHMENT_TYPE, UTIL_ATTACHMENT_DESC,
                rq.getSysUserRequest().getSysUserId(), rq.getSysUserRequest().getName());

        // update status = 2 và STATUS_APPROVED = 1, update_user, update_date, WARRANTY_FORM, STATE
        int result = aioRequestBHSCDAO.updateSaveRequestBHSC(dto.getAioRequestBhscId(), rq.getSysUserRequest().getSysUserId(), dto.getWarrantyForm(), dto.getState());
        commonService.validateIdCreated(result, AIOErrorType.ACTION_FAILED.msg);
    }

    private void validateSave(AIORequestBHSCDTO dto) {
        if (dto.getWarrantyForm() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " Thông tin bảo hành");
        }
        if (dto.getListImage() == null || dto.getListImage().isEmpty()) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " Ảnh vật tư");
        }
        if (dto.getListRequestDetail() == null || dto.getListRequestDetail().isEmpty()) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.REQUEST_BHSC_DETAIL.getName());
        }
    }

    public void close(AIOContractMobileRequest rq) {
        this.validateRequest(rq);
        this.validateClose(rq.getRequestBHSCDTO());
        AIORequestBHSCDTO dto = rq.getRequestBHSCDTO();

        // check status
        AIORequestBHSCDTO statusObj = aioRequestBHSCDAO.getStatusRequestBHSC(dto.getAioRequestBhscId());
        if (statusObj.getStatus() != 1) {
            throw new BusinessException(AIOErrorType.WRONG_STATUS.msg + AIOObjectType.REQUEST_BHSC.getName());
        }

        // save image
        commonService.saveImages(dto.getListImage(), dto.getAioRequestBhscId(), UTIL_ATTACHMENT_TYPE, UTIL_ATTACHMENT_DESC,
                rq.getSysUserRequest().getSysUserId(), rq.getSysUserRequest().getName());

        int result = aioRequestBHSCDAO.updateCloseRequestBHSC(dto.getAioRequestBhscId(), rq.getSysUserRequest().getSysUserId(), dto.getDescriptionStatus());
        commonService.validateIdCreated(result, AIOErrorType.ACTION_FAILED.msg);
    }

    private void validateClose(AIORequestBHSCDTO dto) {
        if (StringUtils.isEmpty(dto.getDescriptionStatus())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " Lý do đóng");
        }
        if (dto.getListImage() == null || dto.getListImage().isEmpty()) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " Ảnh vật tư");
        }
    }

    public void finish(AIOContractMobileRequest rq) {
        this.validateRequest(rq);
        this.validateFinish(rq.getRequestBHSCDTO());
        AIORequestBHSCDTO dto = rq.getRequestBHSCDTO();

        // check status
        AIORequestBHSCDTO statusObj = aioRequestBHSCDAO.getStatusRequestBHSC(dto.getAioRequestBhscId());
        if (statusObj.getStatus() != 2) {
            throw new BusinessException(AIOErrorType.WRONG_STATUS.msg + AIOObjectType.REQUEST_BHSC.getName());
        }
        if (statusObj.getStatusApproved() != 2) {
            throw new BusinessException(AIOErrorType.WRONG_STATUS.msg + ": phê duyệt");
        }

        // save img
        commonService.saveImages(dto.getListImage(), dto.getAioRequestBhscId(), UTIL_ATTACHMENT_TYPE, UTIL_ATTACHMENT_DESC,
                rq.getSysUserRequest().getSysUserId(), rq.getSysUserRequest().getName());

        // update finish
        int result = aioRequestBHSCDAO.updateFinishRequestBHSC(dto.getAioRequestBhscId(), rq.getSysUserRequest().getSysUserId());
        commonService.validateIdCreated(result, AIOErrorType.ACTION_FAILED.msg);
    }

    private void validateFinish(AIORequestBHSCDTO dto) {
        if (dto.getListImage() == null || dto.getListImage().isEmpty()) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " Ảnh vật tư");
        }
    }
}
