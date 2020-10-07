package com.viettel.aio.business;

import com.viettel.aio.bo.AIOSysUserBO;
import com.viettel.aio.dao.AIOSysUserDAO;
import com.viettel.aio.dto.AIOSysUserDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import java.util.List;

@Service("aioSysUserBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOSysUserBusinessImpl extends BaseFWBusinessImpl<AIOSysUserDAO, AIOSysUserDTO, AIOSysUserBO> implements AIOSysUserBusiness {

    @Autowired
    private AIOSysUserDAO aioSysUserDAO;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Autowired
    public AIOSysUserBusinessImpl(AIOSysUserDAO aioSysUserDAO) {
        tDAO = aioSysUserDAO;
        tModel = new AIOSysUserBO();
    }

    @Context
    HttpServletRequest request;

    @Override
    public DataListDTO doSearch(AIOSysUserDTO criteria) {
        List<AIOSysUserDTO> dtos = aioSysUserDAO.doSearch(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    @Override
    public DataListDTO searchParentUsers(AIOSysUserDTO criteria) {
        List<AIOSysUserDTO> dtos = aioSysUserDAO.searchParentUsers(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    @Override
    public void doApproveAccount(AIOSysUserDTO obj) {
        aioSysUserDAO.doUpdateStatus(obj);
        aioSysUserDAO.updateNewEmployeeCode(obj.getSysUserId());
    }

    @Override
    public void doDeleteAccount(AIOSysUserDTO obj) {
        aioSysUserDAO.doUpdateStatus(obj);
    }

    @Override
    public void doRejectAccount(AIOSysUserDTO obj) {
        aioSysUserDAO.doUpdateStatus(obj);
    }

    @Override
    public void doResetPassword(AIOSysUserDTO obj) {
        aioSysUserDAO.doUpdatePassword(obj);
    }

}
