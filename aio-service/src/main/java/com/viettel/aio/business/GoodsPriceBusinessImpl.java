package com.viettel.aio.business;

import com.viettel.aio.bo.GoodsPriceBO;
import com.viettel.aio.dao.GoodsPriceDAO;
import com.viettel.aio.dto.GoodsPriceDTO;
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
import java.util.List;

//VietNT_20190104_created
@Service("goodPriceBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class GoodsPriceBusinessImpl extends BaseFWBusinessImpl<GoodsPriceDAO, GoodsPriceDTO, GoodsPriceBO> implements GoodsPriceBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(GoodsPriceBusinessImpl.class);

    @Autowired
    private GoodsPriceDAO goodsPriceDAO;

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

    private final String EMPTY_REQUEST = "Không có dữ liệu";
    private final String SAVE_ERROR = "Lưu đơn giá thất bại!";
    private final String NOT_FOUND = "Không tìm thấy đơn giá!";
    private final String DUPLICATE = "Trùng mã vật tư";


    public DataListDTO doSearch(GoodsPriceDTO criteria) {
        List<GoodsPriceDTO> dtos = goodsPriceDAO.doSearch(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public void addNew(GoodsPriceDTO rq) {
        if (rq == null || rq.getGoodsPriceDTOS() == null || rq.getGoodsPriceDTOS().isEmpty() || rq.getStatus() == null) {
            throw new BusinessException(EMPTY_REQUEST);
        }

        List<GoodsPriceDTO> goodsPriceDTOS = rq.getGoodsPriceDTOS();
        for (GoodsPriceDTO dto : goodsPriceDTOS) {
            dto.setStatus(rq.getStatus());

            Long id = goodsPriceDAO.saveObject(dto.toModel());
            if (id == null || id == 0) {
                throw new BusinessException(SAVE_ERROR);
            }
        }
    }

    public void deleteGoodsPrice(Long id) {
        if (id == null) {
            throw new BusinessException(EMPTY_REQUEST);
        }

        GoodsPriceDTO dto = this.getGpById(id);
        if (dto == null) {
            throw new BusinessException(NOT_FOUND);
        }

        if (dto.getStatus() == 0) {
            return;
        }

        dto.setStatus(0L);
        goodsPriceDAO.updateObject(dto.toModel());
    }

    public GoodsPriceDTO getGpById(Long id) {
        GoodsPriceDTO criteria = new GoodsPriceDTO();
        criteria.setGoodsPriceId(id);

        List<GoodsPriceDTO> list = goodsPriceDAO.doSearch(criteria);
        if (list == null || list.isEmpty()) {
            return null;
        }
        return list.get(0);
    }

    public void submitEdit(GoodsPriceDTO dto) {
        if (dto == null) {
            throw new BusinessException(EMPTY_REQUEST);
        }

        // update status => hiệu lực, check goods already exist
        if (dto.getStatus() == 1) {
            GoodsPriceDTO criteria = new GoodsPriceDTO();
            criteria.setGoodsCode(dto.getGoodsCode());
            criteria.setStatus(1L);
            List<GoodsPriceDTO> list = goodsPriceDAO.doSearch(criteria);
            if (list != null && !list.isEmpty()) {
                throw new BusinessException(DUPLICATE);
            }
        }

        Long resultUpdate = goodsPriceDAO.updateObject(dto.toModel());
        if (resultUpdate == null || resultUpdate == 0) {
            throw new BusinessException(SAVE_ERROR);
        }
    }
}
