package com.viettel.coms.webservice;

import com.viettel.asset.dto.ResultInfo;
import com.viettel.coms.business.HandOverHistoryBusiness;
import com.viettel.coms.dto.HandOverHistoryDTORequest;
import com.viettel.coms.dto.HandOverHistoryDTOResponse;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 * @author CuongNV2
 * @version 1.0 (Mobile)
 * @since 2018-06-05
 */
@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Path("/service")
public class HandOverHistoryWsRsService {
    private Logger LOGGER = Logger.getLogger(HandOverHistoryWsRsService.class);

    @Autowired
    HandOverHistoryBusiness handOverHistoryBusiness;

    /**
     * Khởi tạo màn hình Lịch Sử Bàn Giao
     *
     * @return response
     */
    @POST
    @Path("/getValueToInitHandOverHistoryPages/")
    public HandOverHistoryDTOResponse getValueToInitHandOverHistoryPages(HandOverHistoryDTORequest request) {
        HandOverHistoryDTOResponse response = new HandOverHistoryDTOResponse();
        try {
            response.setListStTransactionHandoverPagesDTO(handOverHistoryBusiness.getValueToInitHandOverHistoryPages(request, 1));
            response.setListStTransactionReceivePagesDTO(handOverHistoryBusiness.getValueToInitHandOverHistoryPages(request, 0));

            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setResultInfo(resultInfo);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
            response.setResultInfo(resultInfo);
        }
        return response;

    }

    /**
     * Tra ve man hinh VTTB
     *
     * @param request
     * @return response
     * @author CuongNV2 AntSoft
     */
    @POST
    @Path("/getValueToInitHandOverHistoryVTTBPages/")
    public HandOverHistoryDTOResponse getValueToInitHandOverHistoryVTTBPages(HandOverHistoryDTORequest request) {
        HandOverHistoryDTOResponse response = new HandOverHistoryDTOResponse();
        try {
            response.setListStTransactionVTTBDTO(handOverHistoryBusiness.getValueToInitHandOverHistoryVTTB(request));
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setResultInfo(resultInfo);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
            response.setResultInfo(resultInfo);
        }
        return response;
    }

    /**
     * Tra ve man hinh VTTB chi tiet
     *
     * @param request
     * @return response
     * @author CuongNV2 AntSoft
     */
    @POST
    @Path("/getValueToInitHandOverHistoryVTTBDetail/")
    public HandOverHistoryDTOResponse getValueToInitHandOverHistoryVTTBDetail(HandOverHistoryDTORequest request) {
        HandOverHistoryDTOResponse response = new HandOverHistoryDTOResponse();
        try {
            response.setListStTransactionVTTBDetailDTO(handOverHistoryBusiness.getValueToInitHandOverHistoryVTTBDetail(request));
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setResultInfo(resultInfo);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
            response.setResultInfo(resultInfo);
        }
        return response;
    }
}
