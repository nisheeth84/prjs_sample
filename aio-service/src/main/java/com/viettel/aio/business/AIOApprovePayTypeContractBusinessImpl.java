package com.viettel.aio.business;

import com.viettel.aio.config.AIOAttachmentType;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.dao.AIOContractDAO;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.ConvertData;
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
import java.util.*;

//VietNT_20190729_created
@Service("aioApprovePayTypeContractBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOApprovePayTypeContractBusinessImpl {

    static Logger LOGGER = LoggerFactory.getLogger(AIOApprovePayTypeContractBusinessImpl.class);

    @Autowired
    public AIOApprovePayTypeContractBusinessImpl(AIOContractDAO contractDAO, CommonServiceAio commonService) {
        this.contractDAO = contractDAO;
        this.commonService = commonService;
    }

    private AIOContractDAO contractDAO;
    private CommonServiceAio commonService;

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

    public DataListDTO doSearchApproveContract(AIOContractDTO criteria, String sysGroupIdList) {
        List<String> groupIdList = ConvertData.convertStringToList(sysGroupIdList, ",");
        List<AIOContractDTO> dtos = contractDAO.doSearchApproveContract(criteria, groupIdList);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public AIOContractDTO getApproveContractInfo(Long id) {
        AIOContractDTO contractDTO = this.getById(id);
        if (contractDTO == null) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.CONTRACT.getName());
        }

        List<UtilAttachDocumentDTO> imageList = commonService.getListImagesByIdAndType(
                Collections.singletonList(id), AIOAttachmentType.CONTRACT_ATTACHMENT.code);

        contractDTO.setListFile(imageList);
        return contractDTO;
    }

    private AIOContractDTO getById(Long id) {
        AIOContractDTO criteria = new AIOContractDTO();
        criteria.setContractId(id);
        List<AIOContractDTO> dtos = contractDAO.doSearchApproveContract(criteria, new ArrayList<>());
        if (dtos != null && !dtos.isEmpty()) {
            return dtos.get(0);
        }
        return null;
    }

    public void confirmAction(AIOContractDTO dto, SysUserCOMSDTO user) {
        commonService.validateUserLogin(user);
        if (dto.getContractId() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.CONTRACT.getName());
        }
        AIOContractDTO contractDTO = this.getById(dto.getContractId());
        this.validateAction(dto, contractDTO);

        int resultUpdate;
        if (dto.getAction().equalsIgnoreCase("approve")) {
            resultUpdate = contractDAO.updateApprovePayAction(dto.getContractId(), dto.getNumberPay());
        } else {
            resultUpdate = contractDAO.updateDeniedPayAction(dto.getContractId(), dto.getApprovedDescription());
        }

        commonService.validateIdCreated(resultUpdate, "Thao tác thất bại");
    }

    private void validateAction(AIOContractDTO dto, AIOContractDTO contractDTO) {
        if (contractDTO == null) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.CONTRACT.getName());
        }
        if (StringUtils.isEmpty(dto.getAction())) {
            throw new BusinessException(AIOErrorType.NOT_VALID.msg);
        }
        if ((dto.getAction().equalsIgnoreCase("approve") && dto.getNumberPay() == null)) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": Ngày thanh toán");
        }
        if ((dto.getAction().equalsIgnoreCase("denied") && StringUtils.isEmpty(dto.getApprovedDescription()))) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": Lý do từ chối");
        }
        if (contractDTO.getPayType() != 2) {
            throw new BusinessException(AIOErrorType.NOT_VALID.msg + ": Hình thức thanh toán");
        }
        if (contractDTO.getApprovedPay() != null && contractDTO.getApprovedPay() != 0) {
            throw new BusinessException("HĐ đã được xét duyệt!");
        }
    }

    public void confirmPayment(AIOContractDTO dto, SysUserCOMSDTO user) {
        commonService.validateUserLogin(user);
        if (dto.getContractId() != null) {
            AIOContractDTO contractDTO = this.getById(dto.getContractId());
            if (contractDTO == null) {
                throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.CONTRACT.getName());
            }
            if (contractDTO.getStatus() != 3) {
                throw new BusinessException("Không thể thực hiện với hợp đông chưa nghiệm thu!");
            }
            if (contractDTO.getIsPay() != null && contractDTO.getIsPay() == 1) {
                throw new BusinessException("Hợp đồng đã được thanh toán");
            }
        } else {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.CONTRACT.getName());
        }
        int resultUpdate = contractDAO.updateConfirmPayment(dto.getContractId());
        commonService.validateIdCreated(resultUpdate, "Thao tác thất bại");
    }
}
