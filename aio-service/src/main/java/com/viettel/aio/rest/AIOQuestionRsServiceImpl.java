package com.viettel.aio.rest;

import com.viettel.aio.business.AIOQuestionBusiness;
import com.viettel.aio.business.CommonServiceAio;
import com.viettel.aio.dto.AIOQuestionDTO;
import com.viettel.aio.dto.AIOResponseForCkeditorDTO;
import com.viettel.coms.business.UtilAttachDocumentBusinessImpl;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.erp.dto.DataListDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.utils.ImageUtil;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.commons.lang3.StringUtils;
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

public class AIOQuestionRsServiceImpl implements AIOQuestionRsService {

    protected final Logger log = Logger.getLogger(AIOQuestionRsServiceImpl.class);
    private static final String ATTACHMENT_QUESTION_TYPE = "103";
    private static final String BASE64_PREFFIX = "data:image/jpeg;base64,";

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${input_image_sub_folder_upload}")
    private String input_image_sub_folder_upload;

    @Autowired
    private AIOQuestionBusiness aioQuestionBusiness;

    @Autowired
    private UtilAttachDocumentBusinessImpl attachmentBusiness;

    @Autowired
    private CommonServiceAio commonService;

    @Autowired
    private UserRoleBusinessImpl userRoleBusiness;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(AIOQuestionDTO obj) {
        DataListDTO data = new DataListDTO();
        data.setData(aioQuestionBusiness.doSearch(obj));
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return Response.ok(data).build();
    }

    @Override
    public Response remove(AIOQuestionDTO obj) {
        try {

            AIOQuestionDTO chkObj = (AIOQuestionDTO) aioQuestionBusiness.getOneById(obj.getQuestionId());
            if (chkObj == null) {
                return this.buildErrorResponse("Bản ghi không tồn tại");
            }
            if (chkObj.getStatus().equals(AIOQuestionDTO.STATUS_DELETED)) {
                return this.buildErrorResponse("Bản ghi đã bị thay đổi.");
            }

            KttsUserSession userSession = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            aioQuestionBusiness.remove(obj.getQuestionId(), userSession.getSysUserId());
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
    public Response insertOrUpdate(AIOQuestionDTO obj) {
        try {
            KttsUserSession userSession = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            Long questionId = obj.getQuestionId();
            if (questionId != null) {
                AIOQuestionDTO chkObj = (AIOQuestionDTO) aioQuestionBusiness.getOneById(questionId);
                if (chkObj == null) {
                    return this.buildErrorResponse("Bản ghi không tồn tại");
                }
                if (chkObj.getStatus().equals(AIOQuestionDTO.STATUS_DELETED)) {
                    return this.buildErrorResponse("Bản ghi đã bị thay đổi.");
                }

                obj.setUpdatedUser(userSession.getSysUserId());
                obj.setUpdatedDate(new Date());
                aioQuestionBusiness.update(obj);

            } else {
                obj.setStatus(AIOQuestionDTO.STATUS_ACTICE);
                obj.setCreatedUser(userSession.getSysUserId());
                obj.setCreatedDate(new Date());
                questionId = aioQuestionBusiness.save(obj);
            }
            for (UtilAttachDocumentDTO img : obj.getImages()) {
                UtilAttachDocumentDTO ckImg = (UtilAttachDocumentDTO) attachmentBusiness.getOneById(img.getUtilAttachDocumentId());
                ckImg.setObjectId(questionId);
                attachmentBusiness.update(ckImg);
            }
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
    public Response uploadImage(Attachment attachment) {
        AIOResponseForCkeditorDTO res = new AIOResponseForCkeditorDTO();
        try {
            KttsUserSession userSession = userRoleBusiness.getUserSession(request);

            MultivaluedMap<String, String> map = attachment.getHeaders();
            String fileName = UFile.getFileName(map);
            if (StringUtils.isEmpty(fileName)) {
                HashMap<String, String> err = new HashMap<>();
                err.put("message", "File bị lỗi");
                res.setError(err);
                res.setUploaded(0);
                return Response.ok(res).build();
            }

            DataHandler dataHandler = attachment.getDataHandler();

            if (!UString.isExtendAllowSave(fileName, allowFileExt)) {
                throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
            }

            InputStream inputStream = dataHandler.getInputStream();
            String filePath = UFile.writeToFileServerATTT2(inputStream, fileName, input_image_sub_folder_upload, folderUpload);

            UtilAttachDocumentDTO attachmentDTO = new UtilAttachDocumentDTO();
            attachmentDTO.setCreatedDate(new Date());
            attachmentDTO.setCreatedUserId(userSession.getSysUserId());
            attachmentDTO.setCreatedUserName(userSession.getFullName());
            attachmentDTO.setType(ATTACHMENT_QUESTION_TYPE);
            attachmentDTO.setFilePath(filePath);
            attachmentDTO.setName(fileName);
            String base64Image = ImageUtil.convertImageToBase64(folderUpload + filePath);
            attachmentDTO.setBase64String(base64Image);
            res.setAttachmentId(attachmentBusiness.save(attachmentDTO));
            res.setUrl(BASE64_PREFFIX + base64Image);
            res.setFileName(fileName);
            res.setUploaded(1);
            return Response.ok(res).build();
        } catch (Exception e) {
            HashMap<String, String> err = new HashMap<>();
            err.put("message", e.getMessage());
            res.setError(err);
            res.setUploaded(0);
            return Response.ok(res).build();
        }
    }

    @Override
    public Response getImages(Long questionId) {
        try {
            List<UtilAttachDocumentDTO> dtos = commonService.getListAttachmentByIdAndType(questionId, ATTACHMENT_QUESTION_TYPE);
            for (UtilAttachDocumentDTO dto : dtos) {
                String base64Image = ImageUtil.convertImageToBase64(UEncrypt.decryptFileUploadPath(dto.getFilePath()));
                dto.setBase64String(BASE64_PREFFIX + base64Image);
            }
            return Response.ok(dtos).build();
        } catch (Exception e) {
            log.error(e);
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public Response importExcel(Attachment attachment) {
        try {
            String filePath =  commonService.uploadToServer(attachment, request);

            List<AIOQuestionDTO> result = aioQuestionBusiness.doImportExcel(filePath);
            if (result != null && !result.isEmpty()
                    && (result.get(0).getErrorList() == null
                    || result.get(0).getErrorList().size() == 0)) {
                aioQuestionBusiness.saveList(result);
                return Response.ok(result).build();
            } else if (result == null || result.isEmpty()) {
                return Response.ok().entity(Response.Status.NO_CONTENT).build();
            } else {
                return Response.ok(result).build();
            }
        } catch (BusinessException e) {
           log.error(e);
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            log.error(e);
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }
}
