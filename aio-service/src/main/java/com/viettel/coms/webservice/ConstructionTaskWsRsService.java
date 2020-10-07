
package com.viettel.coms.webservice;

import com.viettel.asset.business.AuthenticateWsBusiness;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.business.ConstructionTaskBusinessImpl;
import com.viettel.coms.dao.ConstructionTaskDAO;
import com.viettel.coms.dto.*;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import java.util.List;

@Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Path("/service")
public class ConstructionTaskWsRsService {
    private Logger LOGGER = Logger.getLogger(ConstructionTaskWsRsService.class);

    @Autowired
    ConstructionTaskBusinessImpl constructionTaskBusiness;
    @Autowired
    AuthenticateWsBusiness authenticateWsBusiness;
    @Autowired
    ConstructionTaskDAO construcitonTaskDao;


    /**
     * getConstructionTask
     *
     * @param request
     * @return ConstructionTaskDTOResponse
     */
    @POST
    @Path("/getConstructionTaskById/")
    public ConstructionTaskDTOResponse getConstructionTask(SysUserRequest request) {
        ConstructionTaskDTOResponse response = new ConstructionTaskDTOResponse();
        try {
            authenticateWsBusiness.validateRequest(request);
            List<ConstructionTaskDTO> data = constructionTaskBusiness.getAllConstructionTask(request);
            response.setLstConstrucitonTask(data);
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
    @Path("/getCompleteStateConstructionTask/")
    public CountConstructionTaskDTOResponse getCountRecordFromUser(SysUserRequest request) {
        CountConstructionTaskDTOResponse response = new CountConstructionTaskDTOResponse();

        try {
            authenticateWsBusiness.validateRequest(request);
            CountConstructionTaskDTO data = constructionTaskBusiness.getCountRecordfromUserRequest(request);
            response.setCountConstructionTask(data);
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
    @Path("/getConstructionTaskByPerformerSupervisor/")
    public CountConstructionTaskDTOResponse getConstructionTaskByPerformerSupervisor(SysUserRequest request) {
        CountConstructionTaskDTOResponse response = new CountConstructionTaskDTOResponse();

        try {
            authenticateWsBusiness.validateRequest(request);
            CountConstructionTaskDTO data = constructionTaskBusiness.getCountPerformerSupvisor(request);
            response.setCountConstructionTask(data);
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
    @Path("/insertCompleteRevenueTaskOther/")
    public ConstructionTaskDTOResponse insertCompleteRevenueTaskOther(ConstructionTaskDetailDTOUpdateRequest request) {
        ConstructionTaskDTOResponse response = new ConstructionTaskDTOResponse();
        try {
            authenticateWsBusiness.validateRequest(request.getSysUserRequest()); //request.getConstructionTaskDTO(), request.getFlag()
//			hoanm1_20180602_start
//			request.getSysUserRequest().setSysGroupId(construcitonTaskDao.getSysGroupId(request.getSysUserRequest().getAuthenticationInfo().getUsername()));
//			request.getSysUserRequest().setDepartmentId(Long.parseLong(construcitonTaskDao.getSysGroupId(request.getSysUserRequest().getAuthenticationInfo().getUsername())));
            request.getSysUserRequest().setSysGroupId(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserRequest().getSysUserId()));
            request.getSysUserRequest().setDepartmentId(Long.parseLong(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserRequest().getSysUserId())));
//			hoanm1_20180602_end

//			hoanm1_20180718_start_lay mien don vi
            Long sysGroupId = -1L;
            List<DomainDTO> isViewWorkProgress = construcitonTaskDao.getByAdResource(request.getSysUserRequest().getSysUserId(), "VIEW WORK_PROGRESS");
            if (isViewWorkProgress.size() == 1) {
                sysGroupId = isViewWorkProgress.get(0).getDataId();
            } else {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                resultInfo.setMessage("Không thể tạo công việc do người dùng chưa được phân quyền miền dữ liệu");
                response.setResultInfo(resultInfo);
                return response;
            }
//			hoanm1_20180718_end_lay mien don vi

            Long result = constructionTaskBusiness.insertCompleteRevenueTaskOther(request.getConstructionTaskDetail(), request.getSysUserRequest(), sysGroupId);
            if (result == -1L) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                resultInfo.setMessage("Không thể tạo công việc do chưa tồn tại kế hoạch tháng!");
                response.setResultInfo(resultInfo);

            } else if (result == -5L) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                resultInfo.setMessage("Không thể tạo thêm công việc cho hạng mục đã hoàn thành");
                response.setResultInfo(resultInfo);
            } else if (result == -2L) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                resultInfo.setMessage("Công việc gán cho người thực hiện đã tồn tại");
                response.setResultInfo(resultInfo);
            } else if (result == -3L) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                resultInfo.setMessage("Công việc làm HSHC/Doanh thu cho công trình đã tồn tại");
                response.setResultInfo(resultInfo);
            } else if (result == -4L) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                resultInfo.setMessage("Công việc khác đã tồn tại");
                response.setResultInfo(resultInfo);
            }
//			hoanm1_20180412_start
            else if (result == -7L) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                resultInfo.setMessage("Ngày bắt đầu của công việc phải lớn hơn hoặc bằng ngày khởi công của công trình");
                response.setResultInfo(resultInfo);
            } else if (result == -8L) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                resultInfo.setMessage("Ngày kết thúc của công việc phải nhỏ hơn hoặc bằng ngày kết thúc của công trình");
                response.setResultInfo(resultInfo);
            }
//			hoanm1_20180412_end
//			hoanm1_20180522_start
            else if (result == -10L) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                resultInfo.setMessage("Hạng mục chưa được định nghĩa đơn giá");
                response.setResultInfo(resultInfo);
            }
//			hoanm1_20180522_end
//			hoanm1_20180614_start
            else if (result == -11L) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                resultInfo.setMessage("Hạng mục đã tồn tại trong kế hoạch tháng của đơn vị");
                response.setResultInfo(resultInfo);
            }
//			hoanm1_20180614_end
            else {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_OK);
                response.setResultInfo(resultInfo);
            }
        } catch (Exception e) {
            // Tạm thời set resultINFO là OK check sau
            LOGGER.error(e.getMessage(), e);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            response.setResultInfo(resultInfo);
        }

        return response;
    }

    @POST
    @Path("/updateStopConstructionTask/")
    public ConstructionTaskDTOResponse updateStopConstructionTask(ConstructionTaskDTOUpdateRequest request) {
        ConstructionTaskDTOResponse response = new ConstructionTaskDTOResponse();
        try {
            authenticateWsBusiness.validateRequest(request.getSysUserRequest()); //request.getConstructionTaskDTO(), request.getFlag()
//			hoanm1_20180602_start
            //request.getSysUserRequest().setSysGroupId(construcitonTaskDao.getSysGroupId(request.getSysUserRequest().getAuthenticationInfo().getUsername()));
            //request.getSysUserRequest().setDepartmentId(Long.parseLong(construcitonTaskDao.getSysGroupId(request.getSysUserRequest().getAuthenticationInfo().getUsername())));
            request.getSysUserRequest().setSysGroupId(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserRequest().getSysUserId()));
            request.getSysUserRequest().setDepartmentId(Long.parseLong(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserRequest().getSysUserId())));
//			hoanm1_20180602_end
            int result = constructionTaskBusiness.updateStopReasonConstructionTask(request);
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
            response.setResultInfo(resultInfo);
        }
        return response;
    }

    //phuc update San luong theo ngay
    @POST
    @Path("/updatePercentConstructionTask/")
    public ConstructionTaskDTOResponse updatePercentConstructionTask(ConstructionTaskDTOUpdateRequest request) {
        ConstructionTaskDTOResponse response = new ConstructionTaskDTOResponse();
//		hoanm1_20180602_start
//		request.getSysUserRequest().setSysGroupId(construcitonTaskDao.getSysGroupId(request.getSysUserRequest().getAuthenticationInfo().getUsername()));
//		request.getSysUserRequest().setDepartmentId(Long.parseLong(construcitonTaskDao.getSysGroupId(request.getSysUserRequest().getAuthenticationInfo().getUsername())));
        request.getSysUserRequest().setSysGroupId(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserRequest().getSysUserId()));
        request.getSysUserRequest().setDepartmentId(Long.parseLong(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserRequest().getSysUserId())));
//		hoanm1_20180602_end
        try {
            authenticateWsBusiness.validateRequest(request.getSysUserRequest());
//            hoanm1_20180905_start
            if(request.getConstructionTaskDTO().getObstructedState() !=null && !"0".equals(request.getConstructionTaskDTO().getObstructedState())){
            	//xu ly het vuong
            	try{
            	construcitonTaskDao.updateEntagle(request);
            	construcitonTaskDao.updateConstruction(request.getConstructionTaskDTO().getConstructionId());
            	construcitonTaskDao.updateVuongTask(request.getConstructionTaskDTO().getConstructionId());
//              hoanm1_20190122_start
                List<DomainDTO> lstReceiveHandover = construcitonTaskDao.getReceiveHandover(request.getConstructionTaskDTO().getConstructionId());
                if(lstReceiveHandover.size() >0){
                	construcitonTaskDao.updateHandoverStation(request.getConstructionTaskDTO().getConstructionId(),
              		lstReceiveHandover.get(0).getCatStationHouseId(),lstReceiveHandover.get(0).getCntContractId());
                }
//              hoanm1_20190122_end
            	ResultInfo resultInfo = new ResultInfo();
            	resultInfo.setStatus(ResultInfo.RESULT_OK);
                response.setResultInfo(resultInfo);
            	}catch(Exception e){
            	ResultInfo resultInfo = new ResultInfo();
            	resultInfo.setStatus(ResultInfo.RESULT_NOK);
                response.setResultInfo(resultInfo);
            	}
//            	hoanm1_20180905_end
            }else{
            int result = constructionTaskBusiness.updatePercentConstructionTask(request);
            if (result != 0) {            	
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_OK);
                response.setResultInfo(resultInfo);
            } else {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                response.setResultInfo(resultInfo);
            }
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            response.setResultInfo(resultInfo);
        }

        return response;
    }


    /**
     * insertConstructionTask
     *
     * @param request
     * @return ConstructionTaskDTOResponse
     */
    @POST
    @Path("/insertConstructionTask/")
    public ConstructionTaskDTOResponse insertConstructionTask(ConstructionTaskDTOUpdateRequest request) {
        ConstructionTaskDTOResponse response = new ConstructionTaskDTOResponse();
        try {
            authenticateWsBusiness.validateRequest(request.getSysUserRequest());
            int result = constructionTaskBusiness.insertConstruction(request);
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
            response.setResultInfo(resultInfo);
        }

        return response;
    }

//	@POST
//	@Path("/updateLoadImage/")
//	public ConstructionTaskDTOResponse updateLoadImage(SysUserRequest request) {
//		ConstructionTaskDTOResponse response = new ConstructionTaskDTOResponse();
//		try {
//			
//			authenticateWsBusiness.validateRequest(request);
//			boolean result = convertStringtoImage(request.getDataImage(), request.getNameImage());
//			
//			if (result){
//				ResultInfo resultInfo = new ResultInfo();
//				resultInfo.setStatus(ResultInfo.RESULT_OK);
//				response.setResultInfo(resultInfo);
//			}else {
//				ResultInfo resultInfo = new ResultInfo();
//				resultInfo.setStatus(ResultInfo.RESULT_NOK);
//				response.setResultInfo(resultInfo);
//			}
//		}catch(Exception e){
//			LOGGER.error(e.getMessage(),e);
//			ResultInfo resultInfo = new ResultInfo();
//			resultInfo.setStatus(ResultInfo.RESULT_NOK);
//			response.setResultInfo(resultInfo);
//		}
//		
//		return response;
//	}

    @POST
    @Path("/saveConstructionInfo/")
    public ConstructionTaskDTOResponse saveConstructionInfo(ConstructionInfoContainerDTO request) {
        ConstructionTaskDTOResponse response = new ConstructionTaskDTOResponse();

        List<ConstructionInfoDTO> lstConstructionInfo = request.getLstConstructionInfo();

        boolean result = constructionTaskBusiness.saveConstructionInfo(lstConstructionInfo);

        if (result) {
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
    @Path("/getImagesByConstructionTaskId/")
    public ConstructionTaskDTOResponse getListImages(ConstructionTaskDTOUpdateRequest request) {
        ConstructionTaskDTOResponse response = new ConstructionTaskDTOResponse();

        List<ConstructionImageInfo> listImage = constructionTaskBusiness.getImageByConstructionTaskId(request.getConstructionTaskDTO().getConstructionTaskId());
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
    @Path("/getConstructionTaskByOnDay/")
    public ConstructionTaskDTOResponse getConstructionTaskByOnDay(SysUserRequest request) {
        ConstructionTaskDTOResponse response = new ConstructionTaskDTOResponse();
        try {
            authenticateWsBusiness.validateRequest(request);
            List<ConstructionTaskDTO> data = constructionTaskBusiness.getListConstructionTaskOnDay(request);
            response.setLstConstrucitonTask(data);
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
    @Path("/getHTTC/")
    public AppParamManageDto getHTTC(ConstructionTaskDTOUpdateRequest request) {
        AppParamManageDto response = new AppParamManageDto();
        try {
            List<AppParamDTO> data = construcitonTaskDao.getHTTC(request.getSysUserRequest());
            List<AppParamDTO> lt = constructionTaskBusiness.getAmountSLTN(request.getConstructionTaskDTO().getConstructionTaskId());
            Double process = constructionTaskBusiness.getProcess(request);
            Double amountPreview = constructionTaskBusiness.getAmountPreview(request);
            int confirmDaily = constructionTaskBusiness.getListConfirmDaily(request);
            response.setListDetail(lt);
            response.setListAppParam(data);
            response.setProscess(process);
            response.setAmountPreview(amountPreview);
            response.setConfirmDaily(confirmDaily);
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

    //phuc start
    @POST
    @Path("/getNameConstruction/")

    public ConstructionStationWorkItemDTOResponse getNameConstruction(SysUserRequest request) {
        ConstructionStationWorkItemDTOResponse response = new ConstructionStationWorkItemDTOResponse();
        try {
            request.setSysGroupId(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserId()));
            request.setDepartmentId(Long.parseLong(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserId())));
            authenticateWsBusiness.validateRequest(request);
            List<ConstructionStationWorkItemDTO> data = constructionTaskBusiness.getNameConstruction(request);
            response.setListConstructionStationWorkItem(data);
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
    //phuc end

//	@POST
//	@Path("/getConstructionInfo/")
//	public List<ConstructionInfoDTO> getConstructionInfo(ConstructionInfoDTO request) {
//		List<ConstructionInfoDTO> response = new ArrayList<>();
//		
//		//TODO: Truy van thong tin cong trinh tu DB theo ma cong trinh request.getConstructionId()
//		List<ConstructionInfoDTO> lstConstructionInfo = new ArrayList<>();
//		
//		ConstructionInfoDTO testItem = new ConstructionInfoDTO();
//		testItem.setFilePath("D:/upload/default/2018/3/16/477/base64.png");
//		lstConstructionInfo.add(testItem);
//		
//		testItem = new ConstructionInfoDTO();
//		testItem.setFilePath("D:/upload/default/2018/3/16/618/java.png");
//		lstConstructionInfo.add(testItem);
//		
//		
//		for (ConstructionInfoDTO item : lstConstructionInfo) {
//			String base64 = ImageUtil.convertImageToBase64(item.getFilePath());
//			item.setBase64Image(base64);
//			
//			response.add(item);
//		}
//
//		return response;
//	}
//	
//	public static boolean convertStringtoImage(String encodedImageStr, String fileName) {
//		
//		if (encodedImageStr == null || encodedImageStr.isEmpty()) {
//			return true;
//		}
//
//		try {
//			// Decode String using Base64 Class
//			byte[] imageByteArray = Base64.decodeBase64(encodedImageStr); 
//
//			// Write Image into File system - Make sure you update the path
//			FileOutputStream imageOutFile = new FileOutputStream("D:/temp/" + fileName);
//			imageOutFile.write(imageByteArray);
//
//			imageOutFile.close();
//			
//			System.out.println("Image Successfully Stored");
//			return true;
//		} catch (FileNotFoundException fnfe) {
//			System.out.println("Image Path not found" + fnfe);
//			return false;
//		} catch (IOException ioe) {
//			System.out.println("Exception while converting the Image " + ioe);
//			return false;
//		}
//
//	}
}

