package com.viettel.aio.business;

import com.viettel.aio.bo.AIOConfigTimeGoodsOrderBO;
import com.viettel.aio.dao.AIOConfigTimeGoodsOrderDAO;
import com.viettel.aio.dto.AIOConfigTimeGoodsOrderDTO;
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
import java.util.*;

//VietNT_20190604_created
@Service("aioConfigTimeGoodsOrderBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOConfigTimeGoodsOrderBusinessImpl extends BaseFWBusinessImpl<AIOConfigTimeGoodsOrderDAO, AIOConfigTimeGoodsOrderDTO, AIOConfigTimeGoodsOrderBO> implements AIOConfigTimeGoodsOrderBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIOConfigTimeGoodsOrderBusinessImpl.class);

    @Autowired
    private AIOConfigTimeGoodsOrderDAO aioConfigTimeGoodsOrderDao;

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

    private final String DEFAULT_CODE = "TCT/DH/DOT0";
    private final String VALIDATE_ERROR = "Không đủ dữ liệu";

    public DataListDTO doSearch(AIOConfigTimeGoodsOrderDTO criteria) {
        List<AIOConfigTimeGoodsOrderDTO> dtos = aioConfigTimeGoodsOrderDao.doSearch(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public void saveConfig(AIOConfigTimeGoodsOrderDTO dto) {
        Long result;
        this.validateData(dto);

        if (dto.getConfigTimeGoodsOrderId() == null) {
            result = this.addNew(dto);
        } else {
            result = (long) aioConfigTimeGoodsOrderDao.updateConfig(dto);
        }

        if (result < 1) {
            throw new BusinessException("Lưu cấu hình thất bại");
        }
    }

    private Long addNew(AIOConfigTimeGoodsOrderDTO dto) {
        String code = aioConfigTimeGoodsOrderDao.getLastestCode();
        if (StringUtils.isEmpty(code)) {
            code = DEFAULT_CODE;
        }

        int divider = code.lastIndexOf("DOT") + 3;
        String preFix = code.substring(0, divider);
        int numberPart = Integer.parseInt(code.substring(divider)) + 1;

        do {
            code = preFix + numberPart;
            numberPart++;
        } while (aioConfigTimeGoodsOrderDao.checkExist(code));

        dto.setCode(code);
        return aioConfigTimeGoodsOrderDao.saveObject(dto.toModel());
    }

    private void validateData(AIOConfigTimeGoodsOrderDTO dto) {
        if (StringUtils.isEmpty(dto.getContent()) || dto.getStartDate() == null || dto.getEndDate() == null
                || dto.getStartDate().after(dto.getEndDate())) {
            throw new BusinessException(VALIDATE_ERROR);
        }
    }

    public void deleteConfig(Long id) {
        int result = aioConfigTimeGoodsOrderDao.deleteById(id);
        if (result < 1) {
            throw new BusinessException("Xóa thất bại");
        }
    }

    public String getTempCode() {
        String code = aioConfigTimeGoodsOrderDao.getLastestCode();
        if (StringUtils.isEmpty(code)) {
            code = DEFAULT_CODE;
        }

        int divider = code.lastIndexOf("DOT") + 3;
        String preFix = code.substring(0, divider);
        int numberPart = Integer.parseInt(code.substring(divider)) + 1;

        return (preFix + numberPart);
    }
}
