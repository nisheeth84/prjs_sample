package com.viettel.aio.webservice;

import com.viettel.aio.config.AIOErrorType;
import com.viettel.asset.business.AuthenticateWsBusiness;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.aio.business.AIOContractSellMobileBusinessImpl;
import com.viettel.aio.business.AIOSynStockTransBusinessImpl;
import com.viettel.aio.dto.*;

import com.viettel.ktts2.common.BusinessException;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import java.util.List;

/**
 * @author HOANM1
 * @version 1.0
 * @since 2019-03-10
 */
@Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Path("/service")
public class AIOContractSellWsRsService {

    private Logger LOGGER = Logger.getLogger(AIOContractSellWsRsService.class);
    @Autowired
    AIOContractSellMobileBusinessImpl aioContractBusiness;

    @Autowired
    AuthenticateWsBusiness authenticateWsBusiness;
    @POST
    @Path("/totalContractSell/")
    public AIOContractMobileResponse totalContractSell(SysUserRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            ResultInfo resultInfo = new ResultInfo();
            AIOContractDTO result = aioContractBusiness.countContractSell(request);
            response.setAioContractMobileDTO(result);
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
    @Path("/getListContractSellTask/")
    public AIOContractMobileResponse getListContractSellTask(SysUserRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            List<AIOContractDTO> data = aioContractBusiness.getListContractSellTask(request);
            response.setLstAIOContractMobileDTO(data);
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
    @Path("/getListContractSellTaskDetail/")
    public AIOContractMobileResponse getListContractServiceTaskDetail(AIOContractMobileRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            List<AIOContractDTO> data = aioContractBusiness.getListContractSellTaskDetail(request);
            response.setLstAIOContractMobileDTO(data);
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
  @Path("/startContractService/")
  public AIOContractMobileResponse startContractService(AIOContractMobileRequest request) throws Exception {
	  AIOContractMobileResponse response = new AIOContractMobileResponse();
      try {
          Long result = aioContractBusiness.startContract(request);
          if (result == 1L) {
              ResultInfo resultInfo = new ResultInfo();
              resultInfo.setStatus(ResultInfo.RESULT_OK);
              response.setResultInfo(resultInfo);
          } else if (result == -3L) {
              ResultInfo resultInfo = new ResultInfo();
              resultInfo.setStatus(ResultInfo.RESULT_NOK3);
              resultInfo.setMessage("Nhân viên vẫn còn tồn công việc, cần kết thúc trước khi bắt đầu công việc mới");
              response.setResultInfo(resultInfo);
          } 
          else {
              ResultInfo resultInfo = new ResultInfo();
              resultInfo.setStatus(ResultInfo.RESULT_NOK);
              resultInfo.setMessage("Có lỗi xảy ra");
              response.setResultInfo(resultInfo);
          }
      } catch (Exception e) {
          LOGGER.error(e.getMessage(), e);
          ResultInfo resultInfo = new ResultInfo();
          resultInfo.setStatus(ResultInfo.RESULT_NOK);
          resultInfo.setMessage("Có lỗi xảy ra");
          response.setResultInfo(resultInfo);
      }
      return response;
  }
  @POST
  @Path("/endContractSell/")
  public AIOContractMobileResponse endContractSell(AIOContractMobileRequest request) throws Exception {
	  AIOContractMobileResponse response = new AIOContractMobileResponse();
      ResultInfo resultInfo = new ResultInfo();
      try {
          Long result = aioContractBusiness.endContract(request);
          resultInfo.setStatus(ResultInfo.RESULT_OK);

          if (result == 1) {
              response.setAioContractMobileDTO(new AIOContractDTO());
              response.getAioContractMobileDTO().setDone(1);
          }
          //VietNT_12/08/2019_start
          /*
          //VietNT_26/06/2019_start
          if (result == -3L) {
              resultInfo.setStatus(ResultInfo.RESULT_NOK);
              resultInfo.setMessage("Tồn tại hợp đồng chưa nộp tiền nên không thể kết thúc hợp đồng!");
          } else
          //VietNT_end
          //VietNT_01/07/2019_start
          if (result == -5L) {
              resultInfo.setStatus(ResultInfo.RESULT_NOK);
              resultInfo.setMessage("Hợp đồng đã hết hiệu lực hoặc bị xóa!");
          } else
          //VietNT_end
		  //VietNT_26/06/2019_start
          if (result == -4L) {
              resultInfo.setStatus(ResultInfo.RESULT_NOK);
              resultInfo.setMessage(AIOErrorType.DETAIL_MISMATCH.msg);
          } else
              //VietNT_end
          if (result == -1L) {
              resultInfo.setStatus(ResultInfo.RESULT_NOK1);
              resultInfo.setMessage("Hàng hóa không tồn tại trong kho xuất của người dùng");
          } else  if (result == -2L) {
              resultInfo.setStatus(ResultInfo.RESULT_NOK2);
              resultInfo.setMessage("Số lượng hàng tồn kho không đủ");
          }
          else
          */
          //VietNT_end
//          if (result == 1L) {
//              resultInfo.setStatus(ResultInfo.RESULT_OK);
//          } else {
//              resultInfo.setStatus(ResultInfo.RESULT_NOK);
//              resultInfo.setMessage("Có lỗi xảy ra");
//          }
      } catch (BusinessException e) {
          resultInfo.setStatus(ResultInfo.RESULT_NOK);
          resultInfo.setMessage(e.getMessage());
      } catch (Exception e) {
          LOGGER.error(e.getMessage(), e);
          resultInfo.setStatus(ResultInfo.RESULT_NOK);
          resultInfo.setMessage("Có lỗi xảy ra");
      }
      response.setResultInfo(resultInfo);
      return response;
  }
  @POST
  @Path("/getImagesSellPakage/")
  public AIOContractMobileResponse getListImages(AIOContractMobileRequest request) {
	  AIOContractMobileResponse response = new AIOContractMobileResponse();

      List<ConstructionImageInfo> listImage = aioContractBusiness.getImagesByPackageDetailId(request);
      if (listImage != null) {
          response.setListImage(listImage);
          ResultInfo resultInfo = new ResultInfo();
          resultInfo.setStatus(ResultInfo.RESULT_OK);
          response.setResultInfo(resultInfo);

      } else {
          ResultInfo resultInfo = new ResultInfo();
          resultInfo.setStatus(ResultInfo.RESULT_NOK);
          response.setResultInfo(resultInfo);
      }

      return response;
  }
}
