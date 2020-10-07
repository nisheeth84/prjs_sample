package com.viettel.aio.business;

import com.viettel.aio.bo.AIOSysUserBO;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.config.AIOSaleChannel;
import com.viettel.aio.dao.AIOSysUserDAO;
import com.viettel.aio.dto.AIOBaseRequest;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOSysGroupDTO;
import com.viettel.aio.dto.AIOSysUserDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.utils.CryptoUtils;
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
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

//VietNT_20190917_created
@Service("aioCollaboratorBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOCollaboratorBusinessImpl extends BaseFWBusinessImpl<AIOSysUserDAO, AIOSysUserDTO, AIOSysUserBO> {

    static Logger LOGGER = LoggerFactory.getLogger(AIOCollaboratorBusinessImpl.class);

    @Autowired
    public AIOCollaboratorBusinessImpl(AIOSysUserDAO sysUserDAO) {
        this.sysUserDAO = sysUserDAO;
    }

    private AIOSysUserDAO sysUserDAO;

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

    private static final String LOGIN_NAME = "Số điện thoại";
    private static final String FULL_NAME = "Họ tên";
    private static final String PASSWORD = "Mật khẩu";
    private static final String EMAIL = "Email";
    private static final String PHONE_NUMBER = "Số điện thoại";
    private static final String SYS_GROUP = "Đơn vị";
    private static final String TYPE = "Loại tài khoản";
    private static final String TAX_CODE = "CMT/MST";

    private static final String BASE_PATH = "/166571";
    private static final String DIVIDER = "/";
    private static final String PATTERN_LIKE = "%";

    public void registerCTV(AIOContractMobileRequest rq) {
        AIOSysUserDTO dto = rq.getSysUserDTO();
        this.validateRegister(dto);

        AIOSysUserDTO existUser = sysUserDAO.getSysUserByTaxCodeAndPhoneNum(dto.getTaxCode(), dto.getPhoneNumber());
        if (existUser != null) {
            if (existUser.getTaxCode() != null && existUser.getTaxCode().equals(dto.getTaxCode())) {
                throw new BusinessException("Người dùng với CMT/MST đã tồn tại");
            }
            if (existUser.getPhoneNumber() != null && existUser.getPhoneNumber().equals(dto.getPhoneNumber())) {
                throw new BusinessException("Người dùng với SĐT đã tồn tại");
            }
        }

        dto.setStatus(2L);
        dto.setSaleChannel(AIOSaleChannel.VCC.code);
        dto.setLoginName(dto.getPhoneNumber());
        dto.setPassword(CryptoUtils.hashPassword(dto.getPassword()));

        Long result = sysUserDAO.saveObject(dto.toModel());
        if (result < 1) {
            throw new BusinessException(AIOErrorType.SAVE_ERROR.msg);
        }
    }

    private void validateRegister(AIOSysUserDTO dto) {
        if (dto == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
//        if (StringUtils.isEmpty(dto.getLoginName())) {
//            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + StringUtils.SPACE + LOGIN_NAME);
//        }
        if (StringUtils.isEmpty(dto.getFullName())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + StringUtils.SPACE + FULL_NAME);
        }
        if (StringUtils.isEmpty(dto.getPassword())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + StringUtils.SPACE + PASSWORD);
        }
        if (StringUtils.isEmpty(dto.getEmail())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + StringUtils.SPACE + EMAIL);
        }
        if (StringUtils.isEmpty(dto.getPhoneNumber())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + StringUtils.SPACE + PHONE_NUMBER);
        }
        if (dto.getSysGroupId() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + StringUtils.SPACE + SYS_GROUP);
        }
        if (dto.getTypeUser() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + StringUtils.SPACE + TYPE);
        }
        if (StringUtils.isEmpty(dto.getTaxCode())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + StringUtils.SPACE + TAX_CODE);
        }
    }

    public List<AIOSysGroupDTO> getSysGroupTree(AIOContractMobileRequest rq) {
        AIOSysGroupDTO dto = rq.getSysGroupDTO();
        if (dto == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        StringBuilder queryPath = new StringBuilder(BASE_PATH);
        List<Long> groupLv = Arrays.asList(1L, 2L);
        if (dto.getSysGroupId() != null) {
            queryPath.append(DIVIDER).append(dto.getSysGroupId()).append(PATTERN_LIKE);
            groupLv = Collections.singletonList(3L);
        } else {
            queryPath.append(DIVIDER).append(PATTERN_LIKE);
        }

        return sysUserDAO.getGroupTree(queryPath.toString(), groupLv);
    }

    public void changePassword(AIOContractMobileRequest rq) {
        AIOSysUserDTO dto = rq.getSysUserDTO();
        if (dto == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        if (StringUtils.isEmpty(dto.getEmployeeCode())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + StringUtils.SPACE + "Mã nhân viên");
        }
        if (StringUtils.isEmpty(dto.getPasswordNew())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + StringUtils.SPACE + "Mật khẩu mới");
        }

        AIOSysUserDTO user = sysUserDAO.getUserCTV(dto.getEmployeeCode());
        if (user == null) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.USER.getName());
        }
        if (!CryptoUtils.checkStringEqual(dto.getPassword(), user.getPassword())) {
            throw new BusinessException("Sai mật khẩu đăng nhập");
        }
        if (CryptoUtils.checkStringEqual(dto.getPasswordNew(), user.getPassword())) {
            throw new BusinessException("Nhập mật khẩu khác mật khẩu cũ");
        }

        int result = sysUserDAO.updateNewPassword(user.getSysUserId(), CryptoUtils.hashPassword(dto.getPasswordNew()));
        if (result < 1) {
            throw new BusinessException(AIOErrorType.SAVE_ERROR.msg);
        }
    }

    public String test(AIOBaseRequest<AIOContractMobileRequest> rq) throws Exception {
        return "";
    }
}
