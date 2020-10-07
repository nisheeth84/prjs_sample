package com.viettel.aio.business;

import com.viettel.aio.config.AIOAttachmentType;
import com.viettel.aio.dao.AIOConfigServiceDAO;
import com.viettel.aio.dao.AIOErrorDAO;
import com.viettel.aio.dao.AIOErrorDetailDAO;
import com.viettel.aio.dto.AIOBaseResponse;
import com.viettel.aio.dto.AIOCommonMistakeRequest;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOErrorDTO;
import com.viettel.aio.dto.AIOErrorDetailDTO;
import com.viettel.aio.dto.AIORequestGetErrorDetailDTO;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.utils.Constant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.List;

@Service("aioErrorBussinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOErrorBussinessImpl implements AIOErrorBussiness {

    @Autowired
    public AIOErrorBussinessImpl( AIOErrorDetailDAO aioErrorDetailDAO,
                                 AIOConfigServiceDAO aioConfigServiceDAO,
                                 AIOConfigServiceBusinessImpl aioConfigServiceBusiness,
                                 CommonServiceAio commonServiceAio
                                  ) {

        this.aioErrorDetailDAO = aioErrorDetailDAO;
        this.aioConfigServiceDAO = aioConfigServiceDAO;
        this.aioConfigServiceBusiness = aioConfigServiceBusiness;
        this.commonServiceAio = commonServiceAio;
        this.aioErrorDAO = aioErrorDAO;
    }
    @Autowired
    AIOErrorDAO aioErrorDAO;

    private CommonServiceAio commonServiceAio;
    private AIOConfigServiceBusinessImpl aioConfigServiceBusiness;
    private AIOConfigServiceDAO aioConfigServiceDAO;
    private AIOErrorDetailDAO aioErrorDetailDAO;


    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${input_image_sub_folder_upload}")
    private String input_image_sub_folder_upload;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    public List<AIOConfigServiceDTO> lstAIOConfigService() {
        return aioConfigServiceBusiness.lstAIOConfigService();
    }

    @Override
    public List<AIOErrorDTO> getListByIdConfigService(AIOCommonMistakeRequest aioCommonMistakeRequest) {
        return aioErrorDAO.findErrorListByIdConfigService(aioCommonMistakeRequest);
    }

    @Override
    public List<AIORequestGetErrorDetailDTO> getItemAIOError(Long id) {
        return aioErrorDAO.getItemAIOError(id);
    }

    @Override
    public AIOBaseResponse updateStatusAioError(AIOErrorDTO aioErrorDTO, Long sysUserId) {
        AIOBaseResponse response = new AIOBaseResponse();
        ResultInfo res = new ResultInfo();
        if (!commonServiceAio.getDomainDataOfUserPermission(Constant.OperationKey.APPROVED, Constant.AdResourceKey.ERROR, sysUserId).isEmpty()) {
            aioErrorDAO.updateStatusErrorList(aioErrorDTO);
            res.setStatus(ResultInfo.RESULT_OK);
            res.setMessage("Cập nhật trạng thái thành công");
            response.setResultInfo(res);
            return response;

        }
        res.setStatus(ResultInfo.RESULT_NOK);
        res.setMessage("Bạn không có quyền thay đổi trạng thái");
        response.setResultInfo(res);
        return response;
    }

    @Override
    public void saveAioError(AIOErrorDTO aioErrorDTO, List<AIOErrorDetailDTO> listErrorDetail, Long sysUserId, String userName) {
        aioErrorDTO.setStatus(2L);
        Long idAioErrorDAO = aioErrorDAO.createAIOError(aioErrorDTO);
        try {
            for (AIOErrorDetailDTO i : listErrorDetail) {
                i.setAioErrorId(idAioErrorDAO);
                Long idAioErrorDetail = aioErrorDetailDAO.createAIOErrorDetail(i);

                commonServiceAio.saveImages(i.getListImageError(), idAioErrorDetail, AIOAttachmentType.AIO_ERROR_ATTACHMENT.code, "Ảnh lỗi thường gặp", sysUserId, userName);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }

    }
}
