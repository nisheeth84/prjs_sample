package com.viettel.coms.webservice;

import com.viettel.asset.dto.ResultInfo;
import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.business.ConstructionAcceptanceCertBusinessImpl;
import com.viettel.coms.dto.ConstructionAcceptanceDTORequest;
import com.viettel.coms.dto.ConstructionAcceptanceDTOResponse;
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
 * @since 2018-06-12
 */
@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Path("/service")
public class ConstructionAcceptanceWsRsService {
    private static final long VTA = 0;
    private static final long TBA = 1;
    private static final long VTB = 0;
    private static final long TBB = 1;

    private Logger LOGGER = Logger.getLogger(HandOverHistoryWsRsService.class);

    //	@Autowired
//	ConstructionAcceptanceBusinessImpl constructionAcceptanceBusinessImpl;
    @Autowired
    ConstructionAcceptanceCertBusinessImpl constructionAcceptanceCertBusinessImpl;

    /**
     * Khởi tạo màn hình biều đồ nghiệm thu
     *
     * @return response
     * @author CuongNV2
     */
    @POST
    @Path("/getValueToInitConstructionAcceptanceRatePages/")
    public ConstructionAcceptanceDTOResponse getValueToInitConstructionAcceptanceRatePages(ConstructionAcceptanceDTORequest request) {
        ConstructionAcceptanceDTOResponse response = new ConstructionAcceptanceDTOResponse();
        try {
            long totalConstructionAcceptance = constructionAcceptanceCertBusinessImpl.getValueToInitConstructionNoAcceptance(request);
            long numberConstructionAcceptance = constructionAcceptanceCertBusinessImpl.getValueToInitConstructionAcceptance(request);

            response.setNumberConstructionAcceptance(numberConstructionAcceptance);
            response.setTotalConstructionAcceptance(totalConstructionAcceptance);//so ban ghi nghiem thu cua hang muc
            response.setNumberNoConstructionAcceptance(totalConstructionAcceptance - numberConstructionAcceptance);

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
     * Khởi tạo màn hình công trình nghiệm thu
     *
     * @return response
     * @author CuongNV2
     */
    @POST
    @Path("/getValueToInitConstructionAcceptancePages/")
    public ConstructionAcceptanceDTOResponse getValueToInitConstructionMerchandisePages(ConstructionAcceptanceDTORequest request) {
        ConstructionAcceptanceDTOResponse response = new ConstructionAcceptanceDTOResponse();
        try {
            response.setListConstructionAcceptanceCertPagesDTO(constructionAcceptanceCertBusinessImpl.getValueToInitConstructionAcceptancePages(request));
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
     * Khởi tạo màn hình hạng mục nghiệm thu
     *
     * @return response
     * @author CuongNV2
     */
    @POST
    @Path("/getValueToInitConstructionAcceptanceWorkItemsPages/")
    public ConstructionAcceptanceDTOResponse getValueToInitConstructionAcceptanceWorkItemsPages(ConstructionAcceptanceDTORequest request) {
        ConstructionAcceptanceDTOResponse response = new ConstructionAcceptanceDTOResponse();
        try {

            response.setListConstructionAcceptanceCertWorkItemsPagesDTO(constructionAcceptanceCertBusinessImpl.getValueToInitConstructionAcceptanceWorkItemsPages(request));

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
     * Khởi tạo màn hình nghiệm thu  chi tiết VTA
     *
     * @return response
     * @author CuongNV2
     */
    @POST
    @Path("/getValueToInitConstructionAcceptanceDTODetailVTAPages/")
    public ConstructionAcceptanceDTOResponse getValueToInitConstructionAcceptanceDTODetailVTAPages(ConstructionAcceptanceDTORequest request) {
        ConstructionAcceptanceDTOResponse response = new ConstructionAcceptanceDTOResponse();
        try {
            if (request.getConstructionAcceptanceCertDetailDTO().getStatusAcceptance().equals("1")) {
                response.setListConstructionAcceptanceCertDetailVTAPagesDTO(constructionAcceptanceCertBusinessImpl.getValueToInitConstructionAcceptanceDetailVTAPages(request, VTA));

            } else {

                response.setListConstructionAcceptanceCertDetailVTAPagesDTO(constructionAcceptanceCertBusinessImpl.getValueToInitConstructionAcceptanceDetailVTATPages(request, VTA));
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
     * Khởi tạo màn hình nghiệm thu  chi tiết TBA
     *
     * @return response
     * @author CuongNV2
     */
    @POST
    @Path("/getValueToInitConstructionAcceptanceDTODetailTBAPages/")
    public ConstructionAcceptanceDTOResponse getValueToInitConstructionAcceptanceDTODetailTBAPages(ConstructionAcceptanceDTORequest request) {
        ConstructionAcceptanceDTOResponse response = new ConstructionAcceptanceDTOResponse();
        try {
            if (request.getConstructionAcceptanceCertDetailDTO().getStatusAcceptance().equals("1")) {

                response.setListConstructionAcceptanceCertDetailTBAPagesDTO(constructionAcceptanceCertBusinessImpl.getValueToInitConstructionAcceptanceDetailTBAPages(request, TBA));


            } else {
                response.setListConstructionAcceptanceCertDetailTBAPagesDTO(constructionAcceptanceCertBusinessImpl.getValueToInitConstructionAcceptanceDetailTBATPages(request, TBA));

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
     * Khởi tạo màn hình nghiệm thu  chi tiết VTB
     *
     * @return response
     * @author CuongNV2
     */
    @POST
    @Path("/getValueToInitConstructionAcceptanceDTODetailVTBPages/")
    public ConstructionAcceptanceDTOResponse getValueToInitConstructionAcceptanceDTODetailVTBPages(ConstructionAcceptanceDTORequest request) {
        ConstructionAcceptanceDTOResponse response = new ConstructionAcceptanceDTOResponse();
        try {
            if (request.getConstructionAcceptanceCertDetailDTO().getStatusAcceptance().equals("1")) {
                response.setListConstructionAcceptanceCertDetailVTBPagesDTO(constructionAcceptanceCertBusinessImpl.getValueToInitConstructionAcceptanceDetailVTBPages(request, VTB));

            } else {
                response.setListConstructionAcceptanceCertDetailVTBPagesDTO(constructionAcceptanceCertBusinessImpl.getValueToInitConstructionAcceptanceDetailVTBTPages(request, VTB));

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
     * Khởi tạo màn hình nghiệm thu  chi tiết TBB
     *
     * @return response
     * @author CuongNV2
     */
    @POST
    @Path("/getValueToInitConstructionAcceptanceDTODetailTBBPages/")
    public ConstructionAcceptanceDTOResponse getValueToInitConstructionAcceptanceDTODetailTBBPages(ConstructionAcceptanceDTORequest request) {
        ConstructionAcceptanceDTOResponse response = new ConstructionAcceptanceDTOResponse();
        try {
            if (request.getConstructionAcceptanceCertDetailDTO().getStatusAcceptance().equals("1")) {
                response.setListConstructionAcceptanceCertDetailTBBPagesDTO(constructionAcceptanceCertBusinessImpl.getValueToInitConstructionAcceptanceDetailTBBPages(request, TBB));

            } else {
                response.setListConstructionAcceptanceCertDetailTBBPagesDTO(constructionAcceptanceCertBusinessImpl.getValueToInitConstructionAcceptanceDetailTBBPages(request, TBB));

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
    @Path("/updateVTTBConstructionMerchandise/")
    public ConstructionAcceptanceDTOResponse updateVTTBConstructionMerchandise(ConstructionAcceptanceDTORequest request) throws Exception {
        ConstructionAcceptanceDTOResponse response = new ConstructionAcceptanceDTOResponse();
        try {
            int result = constructionAcceptanceCertBusinessImpl.updateConstructionMerchandise(request);
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
    @Path("/deleteVTTBConstructionMerchandise/")
    public ConstructionAcceptanceDTOResponse deleteVTTBConstructionMerchandise(ConstructionAcceptanceDTORequest request) {
        ConstructionAcceptanceDTOResponse response = new ConstructionAcceptanceDTOResponse();
        try {
            int result = constructionAcceptanceCertBusinessImpl.deleteVTTBConstructionMerchandise(request);
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
     * get list image
     *
     * @param request
     * @return
     */
    @POST
    @Path("/getListImageAcceptance/")
    public ConstructionAcceptanceDTOResponse getListImageEntagle(ConstructionAcceptanceDTORequest request) {
        ConstructionAcceptanceDTOResponse response = new ConstructionAcceptanceDTOResponse();
        try {
            List<ConstructionImageInfo> dataImg = constructionAcceptanceCertBusinessImpl.getListImageAcceptance(request.getConstructionAcceptanceCertDetailDTO().getWorkItemId());
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
}
