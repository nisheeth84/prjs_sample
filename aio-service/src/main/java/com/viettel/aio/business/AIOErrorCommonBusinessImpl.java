package com.viettel.aio.business;

import com.viettel.aio.bo.AIOErrorBO;
import com.viettel.aio.config.AIOAttachmentType;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.dao.AIOConfigServiceDAO;
import com.viettel.aio.dao.AIOErrorCommonDAO;
import com.viettel.aio.dao.AIOErrorCommonDetailDAO;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOErrorDTO;
import com.viettel.aio.dto.AIOErrorDetailDTO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ImageUtil;
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
import javax.ws.rs.core.Response;
import java.io.InputStream;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;

//StephenTrung__20191206_created
@Service("aioErrorCommonBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOErrorCommonBusinessImpl extends BaseFWBusinessImpl<AIOErrorCommonDAO, AIOErrorDTO, AIOErrorBO> implements AIOErrorCommonBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIOErrorCommonBusinessImpl.class);

    @Autowired
    public AIOErrorCommonBusinessImpl(AIOErrorCommonDAO aioErrorCommonDAO, AIOErrorCommonDetailDAO aioErrorCommonDetailDAO, AIOConfigServiceDAO aioConfigServiceDAO, UtilAttachDocumentDAO utilAttachDocumentDAO, CommonServiceAio commonService) {
        this.aioErrorCommonDAO = aioErrorCommonDAO;
        this.aioErrorCommonDetailDAO = aioErrorCommonDetailDAO;
        this.aioConfigServiceDAO = aioConfigServiceDAO;
        this.utilAttachDocumentDAO = utilAttachDocumentDAO;
        this.commonService = commonService;
    }

    private AIOErrorCommonDAO aioErrorCommonDAO;
    private AIOErrorCommonDetailDAO aioErrorCommonDetailDAO;
    private AIOConfigServiceDAO aioConfigServiceDAO;
    private UtilAttachDocumentDAO utilAttachDocumentDAO;
    private CommonServiceAio commonService;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Value("${input_image_sub_folder_upload}")
    private String input_image_sub_folder_upload;

    public DataListDTO doSearch(AIOErrorDTO criteria) {
        List<AIOErrorDTO> dtos = aioErrorCommonDAO.doSearch(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public AIOErrorDTO getErrorCommonById(Long id) {
        AIOErrorDTO dto = new AIOErrorDTO();
        dto.setAioErrorId(id);
        List<AIOErrorDetailDTO> listDetail = aioErrorCommonDAO.getListDetailByErrorId(id);
        dto.setListErrorDetailDTO(listDetail);
        return dto;
    }


    public void saveErrorCommon(AIOErrorDTO dto, SysUserCOMSDTO sysUserDto) {
        this.validateRequest(dto, sysUserDto);
        dto.setStatus(2L);
        dto.setCreateUser(sysUserDto.getSysUserId());
        dto.setCreateDate(new Date());
//        dto.setCode(this.generateCategoryProductCode());
        Long errorId = aioErrorCommonDAO.saveObject(dto.toModel());
        commonService.validateIdCreated(errorId, AIOObjectType.COMMON_ERROR);

        Long idDetail;
        for (AIOErrorDetailDTO dtoDetail : dto.getListErrorDetailDTO()) {
            dtoDetail.setAioErrorId(errorId);
            idDetail = aioErrorCommonDetailDAO.saveObject(dtoDetail.toModel());
            commonService.validateIdCreated(idDetail, AIOObjectType.ATTACH_IMAGE);
            commonService.saveImages(Collections.singletonList(dtoDetail.getImage()), idDetail,
                    AIOAttachmentType.AIO_ERROR_ATTACHMENT.code, "Ảnh bước thực hiện",
                    sysUserDto.getSysUserId(), sysUserDto.getFullName());
        }
    }

    private void validateRequest(AIOErrorDTO dto, SysUserCOMSDTO sysUserDto) {
        if (sysUserDto.getSysUserId() == null || StringUtils.isEmpty(sysUserDto.getFullName())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.USER.getName());
        }

        if (StringUtils.isEmpty(dto.getContentError())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.GROUP_ERROR.getName());
        }

        if (dto.getListErrorDetailDTO() == null || dto.getListErrorDetailDTO().isEmpty()) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " các bước thực hiện");
        }
    }

    private int updateImages(UtilAttachDocumentDTO dto, Long categoryProductId, Long sysUserId, String userName) {
        int idResult;
        try {
            InputStream inputStream = ImageUtil.convertBase64ToInputStream(dto.getBase64String());
            String imagePath = UFile.writeToFileServerATTT2(inputStream, dto.getName(),
                    input_image_sub_folder_upload, folderUpload);
            dto.setFilePath(imagePath);

            dto.setObjectId(categoryProductId);
            dto.setType("106");
            dto.setDescription("Ảnh thông tin sản phẩm");
            dto.setStatus("1");
            dto.setCreatedDate(new Date());
            dto.setCreatedUserId(sysUserId);
            dto.setCreatedUserName(userName);
            idResult = aioErrorCommonDAO.updateImage(dto);
            commonService.validateIdCreated(idResult, AIOObjectType.ATTACH_IMAGE.getName());
            return 1;
        } catch (Exception e) {
            e.printStackTrace();

        }
        return 0;
    }

    public void update(AIOErrorDTO obj, SysUserCOMSDTO sysUserDto) {
//        obj.setCreateUser(sysUserId);

        if (obj == null
                || obj.getContentError() == null || StringUtils.isEmpty(obj.getContentError())
                || obj.getListErrorDetailDTO() == null
        ) {
            throw new BusinessException("Không có dữ liệu!");
        }

        int result1 = aioErrorCommonDAO.updateErrorCommon(obj);
        int result2 = updateDetail(obj, sysUserDto);
        int result3 = 1;
//        if (StringUtils.isEmpty(obj.getListImage().get(0).getFilePath())) {
//            result3 = this.updateImages(obj.getListImage(), obj.getErrorId(), sysUserDto.getSysUserId(), sysUserDto.getFullName());
//        }

        if (result1 < 1 || result2 < 1 || result3 < 1) {
            throw new BusinessException("Lưu dữ liệu thất bại!");
        }

    }

    private int updateDetail(AIOErrorDTO obj, SysUserCOMSDTO sysUserDto) {
        aioErrorCommonDAO.deleteDetail(obj.getAioErrorId());
        int count = 0;
        for (AIOErrorDetailDTO dto : obj.getListErrorDetailDTO()) {
            dto.setAioErrorId(obj.getAioErrorId());
            int result = 1;
            if (StringUtils.isEmpty(dto.getImage().getFilePath())) {
                result = this.updateImages(dto.getImage(), obj.getAioErrorId(), sysUserDto.getSysUserId(), sysUserDto.getFullName());
            }
            if (result < 1) {
                throw new BusinessException("Lưu dữ liệu thất bại!");
            }
            aioErrorCommonDetailDAO.saveObject(dto.toModel());
            count++;
        }
        return count;
    }

    public void remove(AIOErrorDTO obj, HttpServletRequest request) {
        this.hasPermissionManageError(request);
        obj.setStatus(0L);
        aioErrorCommonDAO.removeErrorCommon(obj);
    }

    public void approve(AIOErrorDTO obj, HttpServletRequest request) {
        this.hasPermissionManageError(request);
        aioErrorCommonDAO.approveErrorCommon(obj);
    }

    public void checkDuplicateContent(String content) {
        int result = aioErrorCommonDAO.checkDuplicateContent(content);
        if (result > 0) {
            throw new BusinessException(AIOErrorType.DUPLICATE.msg + " trường hợp lỗi");
        }
    }

    private final String SEQ_NAME = "AIO_ERROR_SEQ";

    private String generateCategoryProductCode() {
        Long id = commonService.getLatestSeqNumber(SEQ_NAME);
        if (id == null) {
            id = 1L;
        }
        String nextId = String.format((Locale) null, "%07d", id);

        return "DM" + nextId;
    }

    public List<AIOConfigServiceDTO> getForAutoCompleteConfigService(AIOConfigServiceDTO obj) {
        return aioConfigServiceDAO.getForAutoCompleteConfigService(obj);
    }

    public List<AIOConfigServiceDTO> getDropDownData() {
        return aioConfigServiceDAO.getDropDownData();
    }

    public void hasPermissionManageError(HttpServletRequest request) {
        if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.APPROVED, Constant.AdResourceKey.ERROR, request)) {
            throw new BusinessException(AIOErrorType.NOT_AUTHORIZE.msg + " phê duyệt lỗi thường gặp!");
        }
    }

}
