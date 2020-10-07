package com.viettel.aio.business;

import com.viettel.aio.dao.AIORpPersonalInventoryDAO;
import com.viettel.aio.dao.CommonDAO;
import com.viettel.aio.dto.AIOSynStockTransDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.dto.StockDTO;
import com.viettel.wms.dto.StockTransDTO;
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

//VietNT_20190524_created
@Service("aioRpGoodsTransferringBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIORpGoodsTransferringBusinessImpl {

    static Logger LOGGER = LoggerFactory.getLogger(AIORpGoodsTransferringBusinessImpl.class);

    @Autowired
    private CommonDAO commonDAO;

    @Autowired
    private AIORpPersonalInventoryDAO aioRpPersonalInventoryDAO;

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

    public DataListDTO doSearch(AIOSynStockTransDTO criteria) {
        List<AIOSynStockTransDTO> dtos = aioRpPersonalInventoryDAO.doSearchGoodsTransferring(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public List<StockDTO> getStockForAutoComplete(StockDTO obj) {
        return commonDAO.getStockForAutoComplete(obj);
    }
}
