package com.viettel.aio.business;

import com.viettel.aio.bo.AIOErrorBO;
import com.viettel.aio.dto.AIOBaseResponse;
import com.viettel.aio.dto.AIOCommonMistakeRequest;
import com.viettel.aio.dto.AIOErrorDTO;
import com.viettel.aio.dto.AIOErrorDetailDTO;
import com.viettel.aio.dto.AIORequestGetErrorDetailDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Response;
import java.util.List;

public interface AIOErrorBussiness {

    public List<AIORequestGetErrorDetailDTO> getItemAIOError(Long id);
    public AIOBaseResponse updateStatusAioError(AIOErrorDTO aioErrorDTO, Long sysUserId);
    public void saveAioError(AIOErrorDTO aioErrorDTO, List<AIOErrorDetailDTO> listErrorDetail, Long sysUserId, String userName);
    public List<AIOErrorDTO> getListByIdConfigService(AIOCommonMistakeRequest aioCommonMistakeRequest);
}
