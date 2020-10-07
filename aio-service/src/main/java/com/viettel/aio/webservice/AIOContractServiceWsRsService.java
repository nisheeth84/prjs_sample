package com.viettel.aio.webservice;

import com.viettel.aio.business.AIOContractManagerBusinessImpl;
import com.viettel.aio.business.AIOWoGoodsBusinessImpl;
import com.viettel.asset.business.AuthenticateWsBusiness;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.cat.dto.CatProvinceDTO;
import com.viettel.aio.business.AIOContractServiceMobileBusinessImpl;
import com.viettel.aio.dto.*;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.ktts2.common.BusinessException;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * @author HOANM1
 * @version 1.0
 * @since 2019-03-10
 */
@Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Path("/service")
//@EnableTransactionManagement
//@Transactional
public class AIOContractServiceWsRsService {

    private Logger LOGGER = Logger.getLogger(AIOContractServiceWsRsService.class);

    @Autowired
    public AIOContractServiceWsRsService(AIOContractServiceMobileBusinessImpl aioContractBusiness,
                                         AIOContractManagerBusinessImpl contractManagerBusiness,
                                         AIOWoGoodsBusinessImpl woGoodsBusiness) {
        this.aioContractBusiness = aioContractBusiness;
        this.contractManagerBusiness = contractManagerBusiness;
        this.woGoodsBusiness = woGoodsBusiness;
    }

    private AIOContractServiceMobileBusinessImpl aioContractBusiness;
    private AIOContractManagerBusinessImpl contractManagerBusiness;
    private AIOWoGoodsBusinessImpl woGoodsBusiness;

    @POST
    @Path("/totalContractService/")
    public AIOContractMobileResponse totalDelivery(SysUserRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            ResultInfo resultInfo = new ResultInfo();
            AIOContractDTO result = aioContractBusiness.countContractService(request);
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
    @Path("/getListContractServiceTask/")
    public AIOContractMobileResponse getListContractServiceTask(SysUserRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            List<AIOContractDTO> data = aioContractBusiness.getListContractServiceTask(request);
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
    @Path("/getListContractServiceTaskDetail/")
    public AIOContractMobileResponse getListContractServiceTaskDetail(AIOContractMobileRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            List<AIOContractDTO> data = aioContractBusiness.getListContractServiceTaskDetail(request);
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
    @Path("/getListPackageGood/")
    public AIOContractMobileResponse getListPackageGood(AIOContractMobileRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            List<AIOContractDTO> data = aioContractBusiness.getListPackageGood(request);
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
    @Path("/getListPackageGoodAdd/")
    public AIOContractMobileResponse getListPackageGoodAdd(AIOContractMobileRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            List<AIOContractDTO> data = aioContractBusiness.getListPackageGoodAdd(request);
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
    @Path("/getListPackageGoodAddFull/")
    public AIOContractMobileResponse getListPackageGoodAddFull(AIOContractMobileRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            List<AIOContractDTO> data = aioContractBusiness.getListPackageGoodAddFull(request);
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
    @Path("/getListGoodPriceOther/")
    public AIOContractMobileResponse getListGoodPriceOther(AIOContractMobileRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            List<AIOContractDTO> data = aioContractBusiness.getListGoodPriceOther(request);
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
    @Path("/getListGoodPriceOtherFull/")
    public AIOContractMobileResponse getListGoodPriceOtherFull(AIOContractMobileRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            List<AIOContractDTO> data = aioContractBusiness.getListGoodPriceOtherFull(request);
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
    @Path("/getListGoodUsed/")
    public AIOContractMobileResponse getListGoodUsed(AIOContractMobileRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            List<AIOContractDTO> data = aioContractBusiness.getListGoodUsed(request);
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
    @Path("/getListGoodUsedAdd/")
    public AIOContractMobileResponse getListGoodUsedAdd(AIOContractMobileRequest request) {
    	AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            List<AIOContractDTO> data = aioContractBusiness.getListGoodUsedAdd(request);
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
    @Path("/updateLocationUser/")
    public AIOContractMobileResponse updateLocationUser(AIOContractMobileRequest request) throws Exception {
  	  AIOContractMobileResponse response = new AIOContractMobileResponse();
        try {
            Long result = aioContractBusiness.updateLocationUser(request);
            if (result != 0) {
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
          }else if (result == -3L) {              
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
  @Path("/endContractService/")
//  @Transactional
  public AIOContractMobileResponse endContractService(AIOContractMobileRequest request) {
	  AIOContractMobileResponse response = new AIOContractMobileResponse();
      ResultInfo resultInfo = new ResultInfo();
      try {
          Long result = aioContractBusiness.endContract(request);
          resultInfo.setStatus(ResultInfo.RESULT_OK);

          if (result == 1) {
              response.setAioContractMobileDTO(new AIOContractDTO());
              response.getAioContractMobileDTO().setDone(1);
          }
          //VietNT_18/06/2019_start
//          if (result == -3L) {
//              resultInfo.setStatus(ResultInfo.RESULT_NOK);
//              resultInfo.setMessage("Tồn tại hợp đồng chưa nộp tiền nên không thể kết thúc hợp đồng!");
//          } else
//          //VietNT_end
//          //VietNT_01/07/2019_start
//          if (result == -5L) {
//              resultInfo.setStatus(ResultInfo.RESULT_NOK);
//              resultInfo.setMessage("Hợp đồng đã hết hiệu lực hoặc bị xóa!");
//          } else
//          //VietNT_end
//		  //VietNT_26/06/2019_start
//          if (result == -4L) {
//              resultInfo.setStatus(ResultInfo.RESULT_NOK);
//              resultInfo.setMessage(AIOErrorType.DETAIL_MISMATCH.msg);
//          } else
//          //VietNT_end
//          if (result == -1L) {
//              resultInfo.setStatus(ResultInfo.RESULT_NOK1);
//              resultInfo.setMessage("Hàng hóa không tồn tại trong kho xuất của người dùng");
//          } else if (result == -2L) {
//              resultInfo.setStatus(ResultInfo.RESULT_NOK2);
//              resultInfo.setMessage("Số lượng hàng tồn kho không đủ");
//          } else if (result == 1L) {
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
//    		  ResultInfo resultInfo = new ResultInfo();
          resultInfo.setStatus(ResultInfo.RESULT_NOK);
          resultInfo.setMessage("Có lỗi xảy ra");
//    		  response.setResultInfo(resultInfo);
      }
      response.setResultInfo(resultInfo);
      return response;
  }
  @POST
  @Path("/getImagesServicePakage/")
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
  @POST
  @Path("/getAppAIOVersion/")
  public AIOContractMobileResponse getAppAIOVersion() {
	  AIOContractMobileResponse response = new AIOContractMobileResponse();
      try {
          List<AIOContractDTO> data = aioContractBusiness.getAppAIOVersion();
          AIOContractDTO dataDetail = data.get(0);
          response.setAioContractMobileDTO(dataDetail);
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
  
  //HuyPQ-20190503-start
  //Lấy mã dịch vụ
  @POST
  @Path("/getCodeAioConfigService/")
  public AIOContractMobileResponse getCodeAioConfigService(AIOContractMobileRequest aioContractMobileRequest) {
	  AIOContractMobileResponse response = new AIOContractMobileResponse();
      try {
          response = aioContractBusiness.getCodeAioConfigService(aioContractMobileRequest);
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
  
//Lấy chủng loại
  @POST
  @Path("/getSpeciesAppParam/")
  public AIOContractMobileResponse getSpeciesAppParam() {
	  AIOContractMobileResponse response = new AIOContractMobileResponse();
      try {
          List<AppParamDTO> data = aioContractBusiness.getSpeciesAppParam();
          response.setAppParamSpeciesMobileDTO(data);
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
  
//Lấy khu vực
  @POST
  @Path("/getAreaAppParam/")
  public AIOContractMobileResponse getAreaAppParam() {
	  AIOContractMobileResponse response = new AIOContractMobileResponse();
      try {
          List<AppParamDTO> data = aioContractBusiness.getAreaAppParam();
          response.setAppParamAreaMobileDTO(data);
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
  
//Lấy list tỉnh theo mã kv
  @POST
  @Path("/getListProvinceByAreaCode/")
  public AIOContractMobileResponse getListProvinceByAreaCode(AIOContractMobileRequest request) {
	  AIOContractMobileResponse response = new AIOContractMobileResponse();
      try {
          List<CatProvinceDTO> data = aioContractBusiness.getListProvinceByAreaCode(request.getCatProvinceDTO());
          response.setCatProvinceMobileDTO(data);
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
//Lấy tỉnh/thành phố
  @POST
  @Path("/getDataProvinceCity/")
  public AIOContractMobileResponse getDataProvinceCity() {
	  AIOContractMobileResponse response = new AIOContractMobileResponse();
      try {
          List<AIOAreaDTO> data = aioContractBusiness.getDataProvinceCity();
          response.setAreaProvinceCity(data);
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
  
  //Lấy quận/huyện
  @POST
  @Path("/getDataDistrict/")
  public AIOContractMobileResponse getDataDistrict(AIOContractMobileRequest request) {
	  AIOContractMobileResponse response = new AIOContractMobileResponse();
      try {
          List<AIOAreaDTO> data = aioContractBusiness.getDataDistrict(request.getAioAreaDTO());
          response.setAreaDistrict(data);
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
  
//Lấy xã/phường
  @POST
  @Path("/getDataWard/")
  public AIOContractMobileResponse getDataWard(AIOContractMobileRequest request) {
	  AIOContractMobileResponse response = new AIOContractMobileResponse();
      try {
          List<AIOAreaDTO> data = aioContractBusiness.getDataWard(request.getAioAreaDTO());
          response.setAreaWard(data);
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
  
//Lấy dữ liệu gói
  @POST
  @Path("/getDataPackageDetail/")
  public AIOContractMobileResponse getDataPackageDetail(AIOContractMobileRequest request) {
	  AIOContractMobileResponse response = new AIOContractMobileResponse();
      try {
          AIOContractDTO performer = aioContractBusiness.getDefaultPerformer(request.getAioAreaDTO());
          response.setAioContractMobileDTO(performer);
          List<AIOPackageDetailDTO> data = aioContractBusiness.getDataPackageDetail(request.getAioAreaDTO());
          response.setPackageDetailDTO(data);
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
  
  //Lấy data khách hàng
  @POST
  @Path("/getDataCustomer/")
  public AIOContractMobileResponse getDataCustomer(AIOContractMobileRequest request) {
	  AIOContractMobileResponse response = new AIOContractMobileResponse();
      try {
          List<AIOCustomerDTO> data = aioContractBusiness.getDataCustomer(request.getAioCustomerDTO());
          response.setDataCustomer(data);
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
  @Path("/saveNewContract/")
  public AIOContractMobileResponse saveNewContract(AIOContractMobileRequest request) {
	  AIOContractMobileResponse response = new AIOContractMobileResponse();
      ResultInfo resultInfo = new ResultInfo();
      try {
          aioContractBusiness.saveNewContract(request);
          resultInfo.setStatus(ResultInfo.RESULT_OK);
          response.setResultInfo(resultInfo);
      } catch (BusinessException e) {
          e.printStackTrace();
          String message = e.getMessage();
          List<Object> params = e.getLstParam();
          if (params != null) {
              AIOContractDTO contractDTO = (AIOContractDTO) params.get(0);
              @SuppressWarnings("unchecked")
              List<AIOPackageGoodsDTO> listGoodsToCreateOrder = (List<AIOPackageGoodsDTO>) params.get(1);
              String code = woGoodsBusiness.createWorkOrderGoods(contractDTO, listGoodsToCreateOrder);
              message += code;
          }
          resultInfo.setStatus(ResultInfo.RESULT_NOK);
          resultInfo.setMessage(message);
          response.setResultInfo(resultInfo);
      } catch (Exception e) {
          LOGGER.error(e.getMessage(), e);
          resultInfo.setStatus(ResultInfo.RESULT_NOK);
          resultInfo.setMessage(e.getMessage());
          response.setResultInfo(resultInfo);
      }
      return response;
  }
  //Huy-end

    //VietNT_17/06/2019_start

    @POST
    @Path("/listUnpaid")
    @Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
    public AIOContractMobileResponse listUnpaid(AIOContractMobileRequest rq) {
        AIOContractMobileResponse res = new AIOContractMobileResponse();
        List<AIOContractDTO> list = new ArrayList<>();
        ResultInfo resultInfo = new ResultInfo();
        try {
            list = aioContractBusiness.getContractsUnpaid(rq);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        }
        res.setLstAIOContractMobileDTO(list);
        res.setResultInfo(resultInfo);
        return res;
    }

    @POST
    @Path("/updatePayTypeContract")
    @Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
    public AIOContractMobileResponse updatePayTypeContract(AIOContractMobileRequest rq) {
        AIOContractMobileResponse res = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            aioContractBusiness.updatePayTypeContract(rq);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        }
        res.setResultInfo(resultInfo);
        return res;
    }
    //VietNT_end

    @POST
    @Path("/updateContractHold")
    @Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
    public AIOContractMobileResponse updateContractHold(AIOContractMobileRequest rq) {
        AIOContractMobileResponse res = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            aioContractBusiness.updateContractHold(rq);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
        } catch (BusinessException e) {
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        res.setResultInfo(resultInfo);
        return res;
    }

    @GET
    @Path("/getReasonOutOfDate")
    @Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
    public AIOContractMobileResponse getReasonOutOfDate() {
        AIOContractMobileResponse res = new AIOContractMobileResponse();
        ResultInfo resultInfo = new ResultInfo();
        try {
            List<String> reasons = aioContractBusiness.getReasonAppParam();
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            res.setReasons(reasons);
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        }
        res.setResultInfo(resultInfo);
        return res;
    }

    @POST
    @Path("/getFullContractInfo")
    public AIOBaseResponse<AIOContractDTO> getFullContractInfo(AIOBaseRequest<Long> rq) {
        AIOBaseResponse<AIOContractDTO> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        res.setResultInfo(resultInfo);
        try {
            AIOContractManagerDTO aioContractManagerDTO = contractManagerBusiness.getFullContractInfo(rq.getData());
            AIOContractDTO data = aioContractManagerDTO.getContractDTO();
            data.setCustomerDTO(aioContractManagerDTO.getCustomerDTOS());
            data.setDetailDTOS(aioContractManagerDTO.getDetailDTOS());
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            res.setData(data);
        } catch (BusinessException e) {
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        return res;
    }

    @POST
    @Path("/edit")
    public AIOBaseResponse edit(AIOBaseRequest<AIOContractDTO> rq) {
        AIOBaseResponse res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        res.setResultInfo(resultInfo);
        try {
            contractManagerBusiness.submitEditMobile(rq.getData(), rq.getSysUserRequest().getSysUserId(),
                    rq.getSysUserRequest().getDepartmentId());
            resultInfo.setStatus(ResultInfo.RESULT_OK);
        } catch (BusinessException e) {
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        return res;
    }
}
