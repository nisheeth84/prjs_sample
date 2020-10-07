package com.viettel.aio.business;

import com.viettel.aio.dao.AIORpContractPayrollDAO;
import com.viettel.aio.dto.AIORpContractPayrollDTO;
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
import java.util.List;

//StephenTrung__20191112_created
@Service("aioRpContractPayrollBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIORpContractPayrollBusinessImpl implements AIORpContractPayrollBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIORpContractPayrollBusinessImpl.class);

    @Autowired
    private AIORpContractPayrollDAO aioRpContractPayrollDAO;

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

    @Override
    public DataListDTO doSearch(AIORpContractPayrollDTO criteria) {
        List<AIORpContractPayrollDTO> dtos = aioRpContractPayrollDAO.doSearch(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }
}
