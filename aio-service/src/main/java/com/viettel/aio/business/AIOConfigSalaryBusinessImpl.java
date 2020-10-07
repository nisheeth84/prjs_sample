package com.viettel.aio.business;

import com.viettel.aio.bo.AIOConfigSalaryBO;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.dao.AIOConfigSalaryDAO;
import com.viettel.aio.dto.AIOConfigSalaryDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
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

//VietNT_20191105_created
@Service("aioConfigSalaryBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOConfigSalaryBusinessImpl extends BaseFWBusinessImpl<AIOConfigSalaryDAO, AIOConfigSalaryDTO, AIOConfigSalaryBO> {

    static Logger LOGGER = LoggerFactory.getLogger(AIOConfigSalaryBusinessImpl.class);

    @Autowired
    private AIOConfigSalaryDAO aioConfigSalaryDao;

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

    public DataListDTO doSearch(AIOConfigSalaryDTO criteria) {
        List<AIOConfigSalaryDTO> dtos = aioConfigSalaryDao.doSearch(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public void submitAdd(AIOConfigSalaryDTO obj, SysUserCOMSDTO user) {
        if (obj == null || obj.getConfigs() == null || obj.getConfigs().isEmpty()) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }

        List<String> keys = new ArrayList<>();
        Date today = new Date();
        for (AIOConfigSalaryDTO cfg : obj.getConfigs()) {
            this.validateConfigSalary(cfg);
            String key = this.createKeyCheckUnique(cfg);
            if (keys.contains(key)) {
                throw new BusinessException(AIOErrorType.DUPLICATE.msg + AIOObjectType.CONFIG_SALARY.getName());
            } else {
                keys.add(key);
            }

            cfg.setStatus(1L);
            cfg.setCreatedDate(today);
            cfg.setCreatedUser(user.getSysUserId());
            aioConfigSalaryDao.saveObject(cfg.toModel());
        }

        Long countDuplicate = aioConfigSalaryDao.countByKey(keys);
        if (countDuplicate > 0) {
            throw new BusinessException(AIOErrorType.DUPLICATE.msg + AIOObjectType.CONFIG_SALARY.getName());
        }
    }

    private void validateConfigSalary(AIOConfigSalaryDTO cfg) {
        if (cfg.getManagerChannels() == null || cfg.getManagerChannels() < 0 || cfg.getManagerChannels() > 100
                || cfg.getSale() == null || cfg.getSale() < 0 || cfg.getSale() > 100
                || cfg.getPerformer() == null || cfg.getPerformer() < 0 || cfg.getPerformer() > 100
                || cfg.getStaffAio() == null || cfg.getStaffAio() < 0 || cfg.getStaffAio() > 100
                || cfg.getManager() == null || cfg.getManager() < 0 || cfg.getManager() > 100) {
            throw new BusinessException(AIOErrorType.NOT_VALID.msg + AIOObjectType.CONFIG_SALARY.getName());
        }
        if (cfg.getManagerChannels() + cfg.getSale() + cfg.getPerformer() + cfg.getStaffAio() + cfg.getManager() != 100) {
            throw new BusinessException("Tổng tỉ lệ không bằng 100%");
        }
    }

    private String createKeyCheckUnique(AIOConfigSalaryDTO cfg) {
        String s = new StringJoiner("_")
                .add(cfg.getType().toString())
                .add(cfg.getObjectType().toString())
                .add(cfg.getManagerChannels().toString())
                .add(cfg.getSale().toString())
                .add(cfg.getPerformer().toString())
                .add(cfg.getStaffAio().toString())
                .add(cfg.getManager().toString())
                .toString();
        return s.contains(".")
                ? s.replaceAll("(0*_|0*$)","_").replaceAll("\\._+","_").replaceAll("_$", "")
                : s;
    }

    public void deleteConfig(Long id, SysUserCOMSDTO user) {
        int result = aioConfigSalaryDao.disableConfig(id, user.getSysUserId());
        if (result < 1) {
            throw new BusinessException(AIOErrorType.ACTION_FAILED.msg);
        }
    }

    public List<AIOConfigSalaryDTO> getListConfigSalary(AIOConfigSalaryDTO dto) {
        return aioConfigSalaryDao.getListConfigSalary(dto);
    }
}
