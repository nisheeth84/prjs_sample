package com.viettel.coms.webservice;

import com.viettel.asset.dto.ResultInfo;
import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.business.ConstructionMerchandiseBusinessImpl;
import com.viettel.coms.dto.ConstructionMerchandiseDTORequest;
import com.viettel.coms.dto.ConstructionMerchandiseDTOResponse;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * @author CuongNV2
 * @version 1.0 (Mobile)
 * @since 2018-06-10
 */
@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Path("/service")

public class ConstructionMerchandiseWsRsService {

    private Logger LOGGER = Logger.getLogger(HandOverHistoryWsRsService.class);

    @Autowired
    ConstructionMerchandiseBusinessImpl constructionMerchandiseBusinessImpl;
    private static final long VT = 0;
    private static final long TB = 1;

    /**
     * Khởi tạo màn hình hạng mục
     *
     * @return response
     */
    @POST
    @Path("/getValueToInitConstructionMerchandisePages/")
    public ConstructionMerchandiseDTOResponse getValueToInitConstructionMerchandisePages(ConstructionMerchandiseDTORequest request) {
        ConstructionMerchandiseDTOResponse response = new ConstructionMerchandiseDTOResponse();
        try {
            response.setListConstructionMerchandisePagesDTO(constructionMerchandiseBusinessImpl.getValueToInitConstructionMerchandisePages(request));
//			response.setListStTransactionReceivePagesDTO(constructionMerchandiseBusinessImpl.getValueToInitHandOverHistoryPages(request,0));

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
     * Khởi tạo màn hình hạng mục
     *
     * @return response
     */
    @POST
    @Path("/getValueToInitConstructionMerchandiseWorkItemsPages/")
    public ConstructionMerchandiseDTOResponse getValueToInitConstructionMerchandiseWorkItemsPages(ConstructionMerchandiseDTORequest request) {
        ConstructionMerchandiseDTOResponse response = new ConstructionMerchandiseDTOResponse();
        try {
            response.setListConstructionMerchandiseWorkItemPagesDTO(constructionMerchandiseBusinessImpl.getValueToInitConstructionMerchandiseWorkItemsPages(request));
//			response.setListStTransactionReceivePagesDTO(constructionMerchandiseBusinessImpl.getValueToInitHandOverHistoryPages(request,0));

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
     * Khởi tạo màn hình  chi tiết VT xem chi tiet
     *
     * @return response
     * @author CuongNV2
     */
    @POST
    @Path("/getValueToInitConstructionMerchandiseDetailVTPages/")
    public ConstructionMerchandiseDTOResponse getValueToInitConstructionMerchandiseDetailVTPages(ConstructionMerchandiseDTORequest request) {
        ConstructionMerchandiseDTOResponse response = new ConstructionMerchandiseDTOResponse();
        try {
            if (request.getConstructionMerchandiseDetailDTO().getStatusComplete().equals("1")) {
                response.setListConstructionMerchandiseVT(constructionMerchandiseBusinessImpl.getValueToInitConstructionMerchandiseVT(request, VT));

            } else
                response.setListConstructionMerchandiseVT(constructionMerchandiseBusinessImpl.getValueToInitConstructionMerchandiseVT(request, VT));

//			response.setListConstructionMerchandiseTB(constructionMerchandiseBusinessImpl.getValueToInitConstructionMerchandiseTB(request));

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
     * Khởi tạo màn hình TB
     *
     * @return response
     * @author CuongNV2
     */
    @POST
    @Path("/getValueToInitConstructionMerchandiseDetailTBPages/")
    public ConstructionMerchandiseDTOResponse getValueToInitConstructionMerchandiseDetailTBPages(ConstructionMerchandiseDTORequest request) {
        ConstructionMerchandiseDTOResponse response = new ConstructionMerchandiseDTOResponse();
        try {
            if (request.getConstructionMerchandiseDetailDTO().getStatusComplete().equals("1")) {
                response.setListConstructionMerchandiseTB(constructionMerchandiseBusinessImpl.getValueToInitConstructionMerchandiseTB(request, TB));

            } else
                response.setListConstructionMerchandiseTB(constructionMerchandiseBusinessImpl.getValueToInitConstructionMerchandiseTB(request, TB));

//			response.setListConstructionMerchandiseTB(constructionMerchandiseBusinessImpl.getValueToInitConstructionMerchandiseTB(request));

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
     * get list image
     *
     * @param request
     * @return
     */
    @POST
    @Path("/getListImageReturn/")
    public ConstructionMerchandiseDTOResponse getListImageReturn(ConstructionMerchandiseDTORequest request) {
        ConstructionMerchandiseDTOResponse response = new ConstructionMerchandiseDTOResponse();
        try {
            List<ConstructionImageInfo> dataImg = constructionMerchandiseBusinessImpl.getListImageReturn(request.getConstructionMerchandiseDetailDTO().getWorkItemId());
            if (dataImg != null) {
                response.setListImage(dataImg);
            }
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
     * update vttb vào bảng constructionMerchandise
     *
     * @return response
     * @author CuongNV2
     */
    @POST
    @Path("/updateVTTBConstructionReturn/")
    public ConstructionMerchandiseDTOResponse updateVTTBConstructionMerchandise(ConstructionMerchandiseDTORequest request) throws Exception {
        ConstructionMerchandiseDTOResponse response = new ConstructionMerchandiseDTOResponse();
        try {
            int result = constructionMerchandiseBusinessImpl.updateConstructionReturn(request);
            if (result == 1) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_OK);
                response.setResultInfo(resultInfo);
            } else {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                response.setResultInfo(resultInfo);
            }


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
     * delete vttb vào bảng constructionMerchandise
     *
     * @return response
     * @author CuongNV2
     */
    @POST
    @Path("/deleteVTTBConstructionReturn/")
    public ConstructionMerchandiseDTOResponse deleteVTTBConstructionMerchandise(ConstructionMerchandiseDTORequest request) {
        ConstructionMerchandiseDTOResponse response = new ConstructionMerchandiseDTOResponse();
        try {
            int result = constructionMerchandiseBusinessImpl.deleteVTTBConstructionReturn(request);
            if (result == 1) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_OK);
                response.setResultInfo(resultInfo);
            } else {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                response.setResultInfo(resultInfo);
            }


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
     * Khởi tạo màn hình biều đồ hoàn trả
     *
     * @return response
     * @author CuongNV2
     */
    @POST
    @Path("/getValueToInitConstructionReturnRatePages/")
    public ConstructionMerchandiseDTOResponse getValueToInitConstructionReturnRatePages(ConstructionMerchandiseDTORequest request) {
        ConstructionMerchandiseDTOResponse response = new ConstructionMerchandiseDTOResponse();
        try {
            long numberConstructionReturn = constructionMerchandiseBusinessImpl.getValueToInitConstructionReturn(request);
            long numberNoConstructionReturn = constructionMerchandiseBusinessImpl.getValueToInitConstructionNoReturn(request);

            response.setNumberConstructionReturn(numberConstructionReturn);
            response.setNumberNoConstructionReturn(numberNoConstructionReturn);

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
