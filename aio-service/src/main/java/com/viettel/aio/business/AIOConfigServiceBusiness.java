package com.viettel.aio.business;

import com.viettel.aio.bo.AIOConfigServiceBO;
import com.viettel.aio.bo.AIOErrorBO;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOErrorDTO;
import com.viettel.aio.dto.AIORequestGetErrorDetailDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;

import java.util.List;

public interface AIOConfigServiceBusiness {
    public List<AIOConfigServiceDTO> lstAIOConfigService();
}
