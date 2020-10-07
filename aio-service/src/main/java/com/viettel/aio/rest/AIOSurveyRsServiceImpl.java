package com.viettel.aio.rest;

import com.viettel.aio.business.AIOSurveyBusiness;
import com.viettel.aio.business.AIOSurveyCustomerBusiness;
import com.viettel.aio.business.AIOSurveyQuestionBusiness;
import com.viettel.aio.business.CommonServiceAio;
import com.viettel.aio.dto.AIOQuestionDTO;
import com.viettel.aio.dto.AIOSurveyCustomerDTO;
import com.viettel.aio.dto.AIOSurveyDTO;
import com.viettel.aio.dto.AIOSurveyQuestionDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import javax.activation.DataHandler;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import java.io.InputStream;
import java.util.*;

public class AIOSurveyRsServiceImpl implements AIOSurveyRsService {

    protected final Logger log = Logger.getLogger(AIOSurveyRsServiceImpl.class);
    @Context
    private HttpServletRequest request;

    @Autowired
    AIOSurveyBusiness aioSurveyBusiness;

    @Autowired
    AIOSurveyQuestionBusiness aioSurveyQuestionBusiness;

    @Autowired
    AIOSurveyCustomerBusiness aioSurveyCustomerBusiness;

    @Autowired
    CommonServiceAio commonServiceAio;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${folder_upload}")
    private String folderTemp;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    private Logger logger = Logger.getLogger(AIOSurveyRsServiceImpl.class);

    @Override
    public Response doSearch(AIOSurveyDTO obj) {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        if (objUser == null) {
            DataListDTO dataListDTO = new DataListDTO();
            dataListDTO.setData(new ArrayList());
            dataListDTO.setTotal(obj.getTotalRecord());
            dataListDTO.setSize(obj.getPageSize());
            dataListDTO.setStart(1);
            return Response.ok(dataListDTO).build();
        }
        DataListDTO data = aioSurveyBusiness.doSearch(obj, objUser.getSysUserId());
        return Response.ok(data).build();
    }

    @Override
    public Response remove(AIOSurveyDTO obj) {
        try {
            AIOSurveyDTO chkObj = (AIOSurveyDTO) aioSurveyBusiness.getOneById(obj.getSurveyId());
            if (chkObj == null) {
                return this.buildErrorResponse("Bản ghi không tồn tại");
            }
            if (chkObj.getStatus().equals(AIOSurveyDTO.STATUS_INACTIVE)) {
                return this.buildErrorResponse("Bản ghi đã bị thay đổi.");
            }
            aioSurveyBusiness.doDelete(chkObj);
            return Response.ok(Response.Status.OK).build();
        } catch (BusinessException e) {
            log.error(e);
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            log.error(e);
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public Response createOrUpdate(AIOSurveyDTO dto) {
        try {
            if (dto.getQuestionIds() == null || dto.getQuestionIds().size() == 0) {
                return this.buildErrorResponse("Cần nhập thêm câu hỏi");
            }
            KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long sysUserId = objUser.getSysUserId();

            if (dto.getSurveyId() != null) {
                AIOSurveyDTO chkDto = (AIOSurveyDTO) aioSurveyBusiness.getOneById(dto.getSurveyId());
                if (chkDto == null) {
                    return this.buildErrorResponse("Bản ghi không tồn tại");
                }
                if (AIOSurveyDTO.STATUS_INACTIVE.equals(chkDto.getStatus())) {
                    return this.buildErrorResponse("Bản ghi đã bị ");
                }

                List<AIOSurveyCustomerDTO> performers = aioSurveyBusiness.getPerformers(dto.getSurveyId());
                Optional<AIOSurveyCustomerDTO> performer = performers.stream().filter(i -> sysUserId.equals(i.getPerformerId())).findFirst();
                if (!performer.isPresent() && !sysUserId.equals(chkDto.getCreatedUser())) {
                    return this.buildErrorResponse("Không có quyền thay đổi bản ghi này.");
                }
                if (chkDto.getStartDate().before(new Date())) {
                    return this.buildErrorResponse("Đợt khảo sát đã triển khai. Không thể thay đổi dữ liệu.");
                }
                dto.setUpdatedDate(new Date());
                dto.setUpdatedUser(objUser.getSysUserId());
                aioSurveyBusiness.update(dto);

                aioSurveyBusiness.removeQuestions(dto.getSurveyId());
                aioSurveyBusiness.removeSurveyCustomer(dto.getSurveyId());
            } else {
                dto.setCreatedDate(new Date());
                dto.setCreatedUser(objUser.getSysUserId());
                dto.setCreatedUserName(objUser.getFullName());
                dto.setStatus(AIOSurveyDTO.STATUS_ACTIVE);
                dto.setSurveyId(aioSurveyBusiness.save(dto));
            }
            List<AIOSurveyQuestionDTO> surveyQuestionDtos = new ArrayList<>();
            for (Long questionId : dto.getQuestionIds()) {
                AIOSurveyQuestionDTO surveyQuestionDto = new AIOSurveyQuestionDTO();
                surveyQuestionDto.setSurveyId(dto.getSurveyId());
                surveyQuestionDto.setQuestionId(questionId);
                surveyQuestionDtos.add(surveyQuestionDto);
            }
            aioSurveyQuestionBusiness.saveList(surveyQuestionDtos);

            if (!dto.getSurveyCustomers().isEmpty()) {
                List<AIOSurveyCustomerDTO> surveyCustomerDtos = new ArrayList<>();
                 dto.getSurveyCustomers().forEach(s -> {
                     s.setSurveyId(dto.getSurveyId());
                     s.setStatus(AIOSurveyCustomerDTO.STATUS_ACTIVE);
                 });

                for (int i = 0; i < dto.getNumberCustomerSurvey(); i++) {
                    surveyCustomerDtos.addAll(dto.getSurveyCustomers());
                }
                aioSurveyCustomerBusiness.saveList(surveyCustomerDtos);
            }


            return Response.ok(Response.Status.OK).build();
        } catch (BusinessException e) {
            logger.error(e);
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            logger.error(e);
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public List<AIOQuestionDTO> getQuestions(Long surveyId) {
        return aioSurveyBusiness.getQuestions(surveyId);
    }

    @Override
    public Response checkPerformers(Attachment attachment) {
        try {
            MultivaluedMap<String, String> map = attachment.getHeaders();
            String fileName = UFile.getFileName(map);

            if (!UString.isExtendAllowSave(fileName, allowFileExt)) {
                throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
            }
            DataHandler dataHandler = attachment.getDataHandler();
            InputStream inputStream = dataHandler.getInputStream();
            AIOSurveyDTO dto = aioSurveyBusiness.checkPerformers(inputStream);
            return Response.ok(dto).build();
        } catch (BusinessException e) {
            logger.error(e);
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            logger.error(e);
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }

    }

}
