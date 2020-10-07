package com.viettel.wms.business;

import com.viettel.wms.dto.AttachmentDTO;
import com.viettel.wms.dto.ShipmentGoodsDetailDTO;

import java.util.List;

public interface ShipmentGoodsDetailBusiness {

    long count();

    List<ShipmentGoodsDetailDTO> getGoodsInfoByCode(String code);

    List<ShipmentGoodsDetailDTO> getGoodsDetail(ShipmentGoodsDetailDTO obj);

    List<AttachmentDTO> getGoodsFile(AttachmentDTO obj);
}
