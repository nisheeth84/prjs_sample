package com.viettel.aio.rest;

import com.viettel.aio.business.AIOAreaBusinessImpl;
import com.viettel.aio.business.CommonServiceAio;
import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.activation.DataHandler;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;

//VietNT_20190506_create
public class AIOAreaRsServiceImpl implements AIOAreaRsService {

    protected final Logger log = Logger.getLogger(AIOAreaRsServiceImpl.class);

    @Autowired
    private AIOAreaBusinessImpl aioAreaBusiness;

    @Autowired
    private UserRoleBusinessImpl userRoleBusiness;

    @Autowired
    private CommonServiceAio commonServiceAio;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(AIOAreaDTO obj) {
        DataListDTO data = aioAreaBusiness.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchTree(AIOAreaDTO obj) {
        DataListDTO data = aioAreaBusiness.doSearchTree(obj);
        return Response.ok(data).build();
    }

     @Override
     public Response updatePerformer(AIOAreaDTO dto) {
         try {
             aioAreaBusiness.updatePerformer(dto);
             return Response.ok(Response.Status.OK).build();
         } catch (BusinessException e) {
             e.printStackTrace();
             return this.buildErrorResponse(e.getMessage());
         } catch (Exception e) {
             e.printStackTrace();
             return this.buildErrorResponse("Có lỗi xảy ra!");
         }
     }

    @Override
    public Response importExcel(Attachment attachments, HttpServletRequest request) {
        String filePath = commonServiceAio.uploadToServer(attachments, request);
        try {
            List<AIOAreaDTO> result = aioAreaBusiness.doImportExcel(filePath);
            if (result != null && !result.isEmpty() && (result.get(0).getErrorList() == null
                    || result.get(0).getErrorList().size() == 0)) {
                aioAreaBusiness.updateListPerformer(result);
                return Response.ok(result).build();
            } else if (result == null || result.isEmpty()) {
                return Response.ok().entity(Response.Status.NO_CONTENT).build();
            } else {
                return Response.ok(result).build();
            }
        } catch (Exception e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response downloadTemplate(AIOAreaDTO obj) {
        try {
            String filePath = aioAreaBusiness.downloadTemplate(obj);
            return Response.ok(Collections.singletonMap("fileName", filePath)).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            log.error(e);
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }
}
