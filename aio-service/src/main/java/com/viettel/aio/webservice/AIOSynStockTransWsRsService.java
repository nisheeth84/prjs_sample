package com.viettel.aio.webservice;

import com.viettel.aio.business.AIOSynStockTransBusinessImpl;
import com.viettel.aio.dao.AIOSynStockTransDAO;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOContractMobileResponse;
import com.viettel.aio.dto.AIOCountConstructionTaskDTO;
import com.viettel.aio.dto.AIOMerEntityDTO;
import com.viettel.aio.dto.AIOStockTransRequest;
import com.viettel.aio.dto.AIOStockTransResponse;
import com.viettel.aio.dto.AIOSynStockTransDTO;
import com.viettel.aio.dto.AIOSynStockTransDetailDTO;
import com.viettel.aio.dto.AIOSysGroupDTO;
import com.viettel.aio.dto.AIOSysUserDTO;
import com.viettel.aio.dto.SysUserRequest;
import com.viettel.asset.business.AuthenticateWsBusiness;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.ktts2.common.BusinessException;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;

/**
 * @author HOANM1
 * @version 1.0
 * @since 2019-03-10
 */
@Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Path("/service")
public class AIOSynStockTransWsRsService {

    private Logger LOGGER = Logger.getLogger(AIOSynStockTransWsRsService.class);
    @Autowired
    AIOSynStockTransBusinessImpl synStockTransBusiness;

    @Autowired
    AuthenticateWsBusiness authenticateWsBusiness;

    @Autowired
    private AIOSynStockTransDAO synStockTransDAO;

    /**
     * getConstructionTask
     *
     * @param request
     * @return StockTransResponse
     */
    /**
     * getListSysStockTransDTO
     *
     * @param request
     * @return StockTransResponse
     */
    @POST
    @Path("/getListSynStockTransDTO/")
    public AIOStockTransResponse getListSysStockTransDTO(AIOStockTransRequest request) {
        AIOStockTransResponse response = new AIOStockTransResponse();
        try {

            authenticateWsBusiness.validateRequest(request.getSysUserRequest());
            List<AIOSynStockTransDTO> data = synStockTransBusiness.getListSysStockTransDTO(request);
            response.setLstSynStockTransDto(data);
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
     * getListSynStockTransDetail
     *
     * @param request
     * @return StockTransResponse
     */
    @POST
    @Path("/getListSynStockTransDetailDTO/")
    public AIOStockTransResponse getListSynStockTransDetail(AIOStockTransRequest request) {
        AIOStockTransResponse response = new AIOStockTransResponse();
        try {

            authenticateWsBusiness.validateRequest(request.getSysUserRequest());
            List<AIOSynStockTransDetailDTO> data = synStockTransBusiness.getListSynStockTransDetail(request.getSynStockTransDto());
            response.setLstSynStockTransDetail(data);
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
     * getListMerEntityDto
     *
     * @param request
     * @return StockTransResponse
     */
    @POST
    @Path("/getListMerEntityDTO/")
    public AIOStockTransResponse getListMerEntityDto(AIOStockTransRequest request) {
        AIOStockTransResponse response = new AIOStockTransResponse();
        try {

            authenticateWsBusiness.validateRequest(request.getSysUserRequest());
            List<AIOMerEntityDTO> data = synStockTransBusiness.getListMerEntityDto(request);
            response.setLstMerEntity(data);
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

    @POST
    @Path("/getListDetailSerialDTO/")
    public AIOStockTransResponse getListDetailSerialDTO(AIOStockTransRequest request) {
        AIOStockTransResponse response = new AIOStockTransResponse();
        try {

            authenticateWsBusiness.validateRequest(request.getSysUserRequest());
            List<AIOMerEntityDTO> data = synStockTransBusiness.getListDetailSerialDTO(request);
            response.setLstMerEntity(data);
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
     * DeliveryMaterials
     *
     * @param request
     * @return StockTransResponse
     */
    @POST
    @Path("/DeliveryMaterials/")
    public AIOStockTransResponse DeliveryMaterials(AIOStockTransRequest request) {
        AIOStockTransResponse response = new AIOStockTransResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            synStockTransBusiness.DeliveryMaterials(request, resultInfo);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setResultInfo(resultInfo);
        } catch (BusinessException e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra!");
        }
        response.setResultInfo(resultInfo);
        return response;
    }

    @POST
    @Path("/totalDelivery/")
    public AIOStockTransResponse totalDelivery(SysUserRequest request) {
        AIOStockTransResponse response = new AIOStockTransResponse();
        try {
            ResultInfo resultInfo = new ResultInfo();
            AIOCountConstructionTaskDTO result = synStockTransBusiness.countMaterials(request);
            response.setCountStockTrans(result);
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

    //    aio_20190315_start
    @POST
    @Path("/getListStock/")
    public AIOStockTransResponse getListStock(SysUserRequest request) {
        AIOStockTransResponse response = new AIOStockTransResponse();
        try {
            List<AIOSynStockTransDTO> data = synStockTransBusiness.getListStock(request);
            response.setLstSynStockTransDto(data);
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

    @POST
    @Path("/getListGood/")
    public AIOStockTransResponse getListGood(SysUserRequest request) {
        AIOStockTransResponse response = new AIOStockTransResponse();
        try {
            List<AIOSynStockTransDetailDTO> data = synStockTransBusiness.getListGood(request);
            response.setLstSynStockTransDetail(data);
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

    @POST
    @Path("/getListPersonWarehouse/")
    public AIOStockTransResponse getListPersonWarehouse(AIOStockTransRequest request) {
        AIOStockTransResponse response = new AIOStockTransResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            List<AIOSynStockTransDetailDTO> data = synStockTransBusiness.getListPersonWarehouse(request);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setLstSynStockTransDetail(data);
            response.setResultInfo(resultInfo);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
            response.setResultInfo(resultInfo);
        }
        return response;
    }

    @POST
    @Path("/getListGroup/")
    public AIOContractMobileResponse getListGroup(AIOContractMobileRequest rq) {
        AIOContractMobileResponse res = new AIOContractMobileResponse();
        List<AIOSysGroupDTO> list = new ArrayList<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            list = synStockTransBusiness.getListGroup(rq);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        }
        res.setListGroup(list);
        res.setResultInfo(resultInfo);
        return res;
    }

    @POST
    @Path("/getListUserInGroup/")
    public AIOContractMobileResponse getListUserInGroup(AIOContractMobileRequest rq) {
        AIOContractMobileResponse res = new AIOContractMobileResponse();
        List<AIOSysUserDTO> list = new ArrayList<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            list = synStockTransBusiness.getListUserInGroup(rq);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        }
        res.setListUser(list);
        res.setResultInfo(resultInfo);
        return res;
    }

//    @POST
//    @Path("/getListPersonWarehouse/")
//    public AIOStockTransResponse getListPersonWarehouse(SysUserRequest request) {
//        AIOStockTransResponse response = new AIOStockTransResponse();
//        try {
//            List<AIOSynStockTransDetailDTO> data = synStockTransBusiness.getListPersonWarehouse(request);
//            response.setLstSynStockTransDetail(data);
//            ResultInfo resultInfo = new ResultInfo();
//            resultInfo.setStatus(ResultInfo.RESULT_OK);
//            response.setResultInfo(resultInfo);
//        } catch (Exception e) {
//            LOGGER.error(e.getMessage(), e);
//            ResultInfo resultInfo = new ResultInfo();
//            resultInfo.setStatus(ResultInfo.RESULT_NOK);
//            resultInfo.setMessage(e.getMessage());
//            response.setResultInfo(resultInfo);
//        }
//        return response;
//    }

//    @POST
//    @Path("/getCountRevenue/")
//    public AIOStockTransResponse getCountRevenue(SysUserRequest request) {
//    	AIOStockTransResponse response = new AIOStockTransResponse();
//        try {
////        	AIORevenueDTO data = synStockTransBusiness.getCountRevenue(request);
////        	List<AIORevenueDTO> dataLst = synStockTransBusiness.getListRevenue(request);
////            response.setRevenueDTO(data);
////            response.setLstRevenueDTO(dataLst);
//            response = synStockTransBusiness.getUserRevenue(request);
//            ResultInfo resultInfo = new ResultInfo();
//            resultInfo.setStatus(ResultInfo.RESULT_OK);
//            response.setResultInfo(resultInfo);
//        } catch (Exception e) {
//            LOGGER.error(e.getMessage(), e);
//            ResultInfo resultInfo = new ResultInfo();
//            resultInfo.setStatus(ResultInfo.RESULT_NOK);
//            resultInfo.setMessage(e.getMessage());
//            response.setResultInfo(resultInfo);
//        }
//        return response;
//    }

    @POST
    @Path("/getCountRevenue/")
    public AIOStockTransResponse getCountRevenue(AIOContractMobileRequest rq) {
        AIOStockTransResponse response = new AIOStockTransResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            response = synStockTransBusiness.getUserRevenue(rq);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        }
        response.setResultInfo(resultInfo);
        return response;
    }

    @POST
    @Path("/addDeliveryBill/")
    public AIOStockTransResponse addEntangle(AIOStockTransRequest request) throws Exception {
        AIOStockTransResponse response = new AIOStockTransResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            synStockTransBusiness.insertDeliveryBill(request);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
        } catch (BusinessException e) {
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        response.setResultInfo(resultInfo);
        return response;
    }
    @POST
    @Path("/getListStockTransCreated/")
    public AIOStockTransResponse getListStockTransCreated(AIOStockTransRequest request) {
        AIOStockTransResponse response = new AIOStockTransResponse();
        try {

            authenticateWsBusiness.validateRequest(request.getSysUserRequest());
            List<AIOSynStockTransDTO> data = synStockTransBusiness.getListStockTransCreated(request);
            response.setLstSynStockTransDto(data);
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

    //    aio_20190315_end
//    hoanm1_20190420_start
    @POST
    @Path("/getStockExport/")
    public AIOStockTransResponse getStockExport(SysUserRequest request) {
        AIOStockTransResponse response = new AIOStockTransResponse();
        try {
            AIOSynStockTransDTO data = synStockTransBusiness.getStockExport(request);
            response.setSynStockTransDto(data);
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

    @POST
    @Path("/getListUserStock/")
    public AIOStockTransResponse getListUserStock(SysUserRequest request) {
        AIOStockTransResponse response = new AIOStockTransResponse();
        try {
            List<AIOSynStockTransDTO> data = synStockTransBusiness.getListUserStock(request);
            response.setLstSynStockTransDto(data);
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

    @POST
    @Path("/getListVTTBExport/")
    public AIOStockTransResponse getListVTTBExport(AIOStockTransRequest request) {
        AIOStockTransResponse response = new AIOStockTransResponse();
        try {
            List<AIOSynStockTransDetailDTO> data = synStockTransBusiness.getListVTTBExport(request);
            response.setLstSynStockTransDetail(data);
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

    @POST
    @Path("/addDeliveryBillStaff/")
    public AIOStockTransResponse addDeliveryBillStaff(AIOStockTransRequest request) throws Exception {
    	AIOStockTransResponse response = new AIOStockTransResponse();
        ResultInfo resultInfo = new ResultInfo();
        response.setResultInfo(resultInfo);
        try {
            synStockTransBusiness.insertDeliveryBillStaff(request);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
        } catch (BusinessException e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        return response;
    }
//    hoanm1_20190420_end
}
