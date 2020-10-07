package com.viettel.aio.rest;

import com.viettel.aio.business.AIOKpiLogBusiness;
import com.viettel.aio.business.AIOMonthPlanBusinessImpl;
import com.viettel.aio.config.FunctionCodeLog;
import com.viettel.aio.dto.AIOMonthPlanDTO;
import com.viettel.aio.dto.AIOMonthPlanDetailDTO;
import com.viettel.aio.dto.report.AIOReportDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
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
import java.text.ParseException;
import java.util.Collections;

public class AIOMonthPlanRsServiceImpl implements AIOMonthPlanRsService {

    protected final Logger log = Logger.getLogger(AIOMonthPlanRsServiceImpl.class);

    @Autowired
    public AIOMonthPlanRsServiceImpl(AIOMonthPlanBusinessImpl aioMonthPlanBusinessImpl, AIOKpiLogBusiness aioKpiLogBusiness) {
        this.aioMonthPlanBusinessImpl = aioMonthPlanBusinessImpl;
        this.aioKpiLogBusiness = aioKpiLogBusiness;
    }

    private AIOMonthPlanBusinessImpl aioMonthPlanBusinessImpl;
    private AIOKpiLogBusiness aioKpiLogBusiness;

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

    @Context
    private HttpServletRequest request;

    @Override
    public Response doSearch(AIOMonthPlanDTO obj) {
        DataListDTO data = new DataListDTO();
        data = aioMonthPlanBusinessImpl.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response getDetailByMonthPlanId(AIOMonthPlanDTO obj) {
        DataListDTO data = new DataListDTO();
        data = aioMonthPlanBusinessImpl.getDetailByMonthPlanId(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response exportFileBM(AIOMonthPlanDTO obj) throws Exception {
        try {
            String strReturn = aioMonthPlanBusinessImpl.exportFileBM(obj);
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            log.error(e);
        }
        return null;
    }

    private boolean isFolderAllowFolderSave(String folderDir) {
        return UString.isFolderAllowFolderSave(folderDir, allowFolderDir);

    }

    private boolean isExtendAllowSave(String fileName) {
        return UString.isExtendAllowSave(fileName, allowFileExt);
    }

    @Override
    public Response importExcel(Attachment attachments, HttpServletRequest request) throws Exception {
        String folderParam = UString.getSafeFileName(request.getParameter("folder"));
        String filePathReturn;
        String filePath;
        if (UString.isNullOrWhitespace(folderParam)) {
            folderParam = defaultSubFolderUpload;
        } else {
            if (!isFolderAllowFolderSave(folderParam)) {
                throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
            }
        }

        DataHandler dataHandler = attachments.getDataHandler();

        // get filename to be uploaded
        MultivaluedMap<String, String> multivaluedMap = attachments.getHeaders();
        String fileName = UFile.getFileName(multivaluedMap);

        if (!isExtendAllowSave(fileName)) {
            throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
        }
        // write & upload file to server
        try (InputStream inputStream = dataHandler.getInputStream();) {
            filePath = UFile.writeToFileServerATTT2(inputStream, fileName, folderParam, folderUpload);
            filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
        } catch (Exception ex) {
            throw new BusinessException("Loi khi save file", ex);
        }

        try {

            try {

                return Response.ok(aioMonthPlanBusinessImpl.doImportExcel(folderUpload + filePath)).build();
            } catch (Exception e) {
                return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
            }

        } catch (IllegalArgumentException e) {
            return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
        }
    }

    @Override
    public Response insertMonthPlan(AIOMonthPlanDTO obj) {
        Long id = aioMonthPlanBusinessImpl.insertMonthPlan(obj);
        if (id == 0L) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response updateMonthPlan(AIOMonthPlanDTO obj) {
        Long id = aioMonthPlanBusinessImpl.updateMonthPlan(obj);
        if (id == 0L) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response getAllSysGroupByName(AIOMonthPlanDetailDTO obj) {
        // TODO Auto-generated method stub
        return Response.ok(aioMonthPlanBusinessImpl.getAllSysGroupByName(obj)).build();
    }

    @Override
    public Response getAllDomainDataByCode(AIOMonthPlanDetailDTO obj) {
        // TODO Auto-generated method stub
        return Response.ok(aioMonthPlanBusinessImpl.getAllDomainDataByCode(obj)).build();
    }

    @Override
    public void removerMonthPlan(AIOMonthPlanDTO obj) {
        // TODO Auto-generated method stub
        aioMonthPlanBusinessImpl.removerMonthPlan(obj);
    }

    @Override
    public Response checkDataMonthPlan(AIOMonthPlanDTO obj) {
        // TODO Auto-generated method stub
        return Response.ok(aioMonthPlanBusinessImpl.checkDataMonthPlan(obj)).build();
    }

    @Override
    public Response doSearchChart(AIOMonthPlanDetailDTO obj) {
        // save log use function
        if (obj.getSysGroupId() != null) {
            KttsUserSession session = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
            aioKpiLogBusiness.createGenericLog(FunctionCodeLog.DASHBOARD_SYSGROUPID, session.getVpsUserInfo(), obj.getSysGroupId());
        }
        return Response.ok(aioMonthPlanBusinessImpl.doSearchChart(obj)).build();
    }

    @Override
    public Response getAutoCompleteSysGroupLevel(AIOMonthPlanDetailDTO obj) {
        // TODO Auto-generated method stub
        return Response.ok(aioMonthPlanBusinessImpl.getAutoCompleteSysGroupLevel(obj)).build();
    }

    @Override
    public Response doSearchChartLine(AIOMonthPlanDetailDTO obj) {
        // TODO Auto-generated method stub
        return Response.ok(aioMonthPlanBusinessImpl.doSearchChartLine(obj)).build();
    }

    @Override
    public Response getAioMonthPlanDTO(Long id) {
        // TODO Auto-generated method stub
        return Response.ok(aioMonthPlanBusinessImpl.getAioMonthPlanDTO(id)).build();
    }

    //huypq-20190930-start
    @Override
    public Response doSearchChartColumnFailProvince(AIOMonthPlanDTO obj) throws ParseException {
        // TODO Auto-generated method stub
        return Response.ok(aioMonthPlanBusinessImpl.doSearchChartColumnFailProvince(obj)).build();
    }

    //huypq-20190930-end
    //tatph-start-16/12/2019
    @Override
    public Response doSearchChartColumnFailGroup(AIOReportDTO obj) throws ParseException {
        // TODO Auto-generated method stub
        return Response.ok(aioMonthPlanBusinessImpl.doSearchChartColumnFailGroup(obj)).build();
    }
    //tatph-end-16/12/2019
}
