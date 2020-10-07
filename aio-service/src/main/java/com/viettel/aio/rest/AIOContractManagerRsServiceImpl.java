package com.viettel.aio.rest;

import com.viettel.aio.business.AIOApprovePayTypeContractBusinessImpl;
import com.viettel.aio.business.AIOContractManagerBusinessImpl;
import com.viettel.aio.business.AIOWoGoodsBusinessImpl;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.dto.*;
import com.viettel.coms.dto.DepartmentDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

//VietNT_20190313_create
public class AIOContractManagerRsServiceImpl implements AIOContractManagerRsService {

    protected final Logger log = Logger.getLogger(AIOContractManagerRsServiceImpl.class);

    @Autowired
    public AIOContractManagerRsServiceImpl(AIOContractManagerBusinessImpl contractManagerBusiness,
                                           UserRoleBusinessImpl userRoleBusiness,
                                           AIOApprovePayTypeContractBusinessImpl approvePayTypeContractBusiness,
                                           AIOWoGoodsBusinessImpl woGoodsBusiness) {
        this.contractManagerBusiness = contractManagerBusiness;
        this.userRoleBusiness = userRoleBusiness;
        this.approvePayTypeContractBusiness = approvePayTypeContractBusiness;
        this.woGoodsBusiness = woGoodsBusiness;
    }

    private AIOContractManagerBusinessImpl contractManagerBusiness;
    private UserRoleBusinessImpl userRoleBusiness;
    private AIOApprovePayTypeContractBusinessImpl approvePayTypeContractBusiness;
    private AIOWoGoodsBusinessImpl woGoodsBusiness;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(AIOContractDTO obj) {
        String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE, Constant.AdResourceKey.CONTRACT, request);
        DataListDTO data = new DataListDTO();
        if (StringUtils.isNotEmpty(sysGroupIdStr)) {
            data = contractManagerBusiness.doSearch(obj, sysGroupIdStr);
        } else {
            data.setData(new ArrayList());
            data.setSize(0);
            data.setTotal(0);
            data.setStart(1);
        }
        return Response.ok(data).build();
    }

    @Override
    public Response getDropDownData() {
        AIOContractManagerDTO data = contractManagerBusiness.getDropDownData();
        return Response.ok(data).build();
    }

    @Override
    public Response getContractDetailByContractId(Long id) {
        List<AIOContractDetailDTO> detailDTOS = contractManagerBusiness.getContractDetailByContractId(id);
        return Response.ok(detailDTOS).build();
    }

    @Override
    public Response doSearchCustomer(AIOCustomerDTO obj) {
        DataListDTO data = contractManagerBusiness.doSearchCustomer(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchService(AIOConfigServiceDTO obj) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            String saleChannelCode = session.getVpsUserInfo().getSaleChannel();
            obj.setName(saleChannelCode);
            DataListDTO data = contractManagerBusiness.doSearchService(obj);
            return Response.ok(data).build();
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public Response submitAdd(AIOContractDTO obj) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO user = session.getVpsUserInfo();
            contractManagerBusiness.submitAdd(obj, user);
            return Response.ok(Response.Status.OK).build();
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
            return this.buildErrorResponse(message);
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public Response getUsersInRange(AIOContractDTO obj) {
        List<AIOLocationUserDTO> users = contractManagerBusiness.getUsersInRange(obj);
        return Response.ok(users).build();
    }

    @Override
    public Response submitDeploy(List<AIOContractDTO> list) {
        try {
            if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.DEPLOY, Constant.AdResourceKey.CONTRACT, request)) {
                throw new BusinessException(AIOErrorType.NOT_AUTHORIZE.msg + AIOObjectType.DEPLOY.getName());
            }
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            Long sysUserId = session.getVpsUserInfo().getSysUserId();
            Long sysGroupId = session.getVpsUserInfo().getSysGroupId();
            contractManagerBusiness.submitDeploy(list, sysUserId, sysGroupId);
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
    public Response getFullContractInfo(Long id) {
        try {
            AIOContractManagerDTO dto = contractManagerBusiness.getFullContractInfo(id);
            return Response.ok(dto).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public Response getListPerformer(AIOLocationUserDTO criteria) {
        KttsUserSession session = userRoleBusiness.getUserSession(request);
        Long sysUserId = session.getVpsUserInfo().getSysUserId();
        DataListDTO data = contractManagerBusiness.getListPerformer(criteria, sysUserId);
        return Response.ok(data).build();
    }

    @Override
    public Response exportExcel(AIOContractDTO dto) {
        String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE, Constant.AdResourceKey.CONTRACT, request);
        try {
            String filePath = contractManagerBusiness.exportExcel(dto, sysGroupIdStr);
            return Response.ok(Collections.singletonMap("fileName", filePath)).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (IOException e) {
            e.printStackTrace();
            return this.buildErrorResponse("Không tìm thấy file biểu mẫu!");
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    public Response disableContract(Long id) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            Long sysUserId = session.getVpsUserInfo().getSysUserId();
            Long sysGroupId = session.getVpsUserInfo().getSysGroupId();
            contractManagerBusiness.disableContract(id, sysUserId, sysGroupId);

            return Response.ok(Response.Status.OK).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    public Response submitEdit(AIOContractDTO dto) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            Long sysUserId = session.getVpsUserInfo().getSysUserId();
            Long sysGroupId = session.getVpsUserInfo().getSysGroupId();
            contractManagerBusiness.submitEdit(dto, sysUserId, sysGroupId);

            return Response.ok(Response.Status.OK).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    public Response getListAreaForDropDown(AIOAreaDTO criteria) {
        return Response.ok(contractManagerBusiness.getListAreaForDropDown(criteria)).build();
    }

    //VietNT_20190527_start
    public Response hasDeletePermission() {
        if (VpsPermissionChecker.hasPermission(Constant.OperationKey.DELETE, Constant.AdResourceKey.CONTRACT, request)) {
            return Response.ok(HttpStatus.OK).build();
        }
        return Response.ok(HttpStatus.NOT_ACCEPTABLE).build();
    }

    public Response canDeleteContract(Long contractId) {
        if (contractManagerBusiness.canDeleteContract(contractId)) {
            return Response.ok(HttpStatus.OK).build();
        }
        return Response.ok(HttpStatus.NOT_ACCEPTABLE).build();
    }
    //VietNT_end

    //HuyPQ-20190508-start
    @Override
    public Response reportInvestoryProvince(AIOMerEntityDTO obj) {
        DataListDTO data = contractManagerBusiness.reportInvestoryProvince(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response exportPDF(AIOMerEntityDTO criteria) throws Exception {
        String strReturn = contractManagerBusiness.exportPDF(criteria);
        if (strReturn == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        }
    }

    @Override
    public Response reportInvestoryDetail(AIOMerEntityDTO obj) {
        DataListDTO data = contractManagerBusiness.reportInvestoryDetail(obj);
        return Response.ok(data).build();
    }

    //Huy-end
    //VietNT_10/07/2019_start
    public Response getUserSysGroupInfo() {
        KttsUserSession session = userRoleBusiness.getUserSession(request);
        Long sysGroupId = session.getVpsUserInfo().getSysGroupId();
        DepartmentDTO dto = contractManagerBusiness.getSysGroupById(sysGroupId);
        return Response.ok(dto).build();
    }

    //VietNT_end
    //VietNT_12/07/2019_start
    public Response hasUpdatePermission() {
        if (VpsPermissionChecker.hasPermission(Constant.OperationKey.UPDATE, Constant.AdResourceKey.CONTRACT, request)) {
            return Response.ok(HttpStatus.OK).build();
        }
        return Response.ok(HttpStatus.NOT_ACCEPTABLE).build();
    }

    public Response submitEditSeller(AIOContractDTO dto) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            Long sysUserId = session.getVpsUserInfo().getSysUserId();
            Long sysGroupId = session.getVpsUserInfo().getSysGroupId();
            contractManagerBusiness.submitEditSeller(dto, sysUserId, sysGroupId);

            return Response.ok(Response.Status.OK).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }
    //VietNT_end
    //VietNT_24/07/2019_start
    @Override
    public Response userHasContractUnpaidVTPost() {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            Long sysUserId = session.getVpsUserInfo().getSysUserId();
            if (!contractManagerBusiness.userHasContractUnpaidVTPost(sysUserId)) {
                return Response.ok(Response.Status.OK).build();
            } else {
                return Response.ok(HttpStatus.NOT_ACCEPTABLE).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Response.ok(HttpStatus.NOT_ACCEPTABLE).build();
        }
    }
    //VietNT_end
    //VietNT_29/07/2019_start
    @Override
    public Response doSearchApproveContract(AIOContractDTO criteria) {
        // TODO: 29-Jul-19 sua quyen
        String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.APPROVED_CONTRACT, request);
        DataListDTO data = new DataListDTO();
        if (StringUtils.isNotEmpty(sysGroupIdStr)) {
            data = approvePayTypeContractBusiness.doSearchApproveContract(criteria, sysGroupIdStr);
        } else {
            data.setData(new ArrayList());
            data.setSize(0);
            data.setTotal(0);
            data.setStart(1);
        }
        return Response.ok(data).build();
    }

    @Override
    public Response getApproveContractInfo(Long id) {
        try {
            AIOContractDTO dto = approvePayTypeContractBusiness.getApproveContractInfo(id);
            return Response.ok(dto).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public Response confirmAction(AIOContractDTO dto) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO user = session.getVpsUserInfo();
            approvePayTypeContractBusiness.confirmAction(dto, user);
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
    public Response confirmPayment(AIOContractDTO dto) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO user = session.getVpsUserInfo();
            approvePayTypeContractBusiness.confirmPayment(dto, user);
            return Response.ok(Response.Status.OK).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }
    //VietNT_end

    @Override
    public Response approvedPauseContract(AIOContractPauseDTO pauseDTO) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO user = session.getVpsUserInfo();
            contractManagerBusiness.approvedPauseContract(pauseDTO, user);
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
    public Response updateReasonOutOfDate(AIOContractDTO dto) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO user = session.getVpsUserInfo();
            contractManagerBusiness.updateReasonOutOfDate(dto, user);
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
    public Response approveCancel(AIOContractDTO dto) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO user = session.getVpsUserInfo();
            contractManagerBusiness.approveCancel(dto, user);
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
    public Response getListUserAC(AIOSysUserDTO criteria) {
        KttsUserSession session = userRoleBusiness.getUserSession(request);
        Long sysUserId = session.getVpsUserInfo().getSysUserId();
        List<AIOSysUserDTO> list = contractManagerBusiness.getListUserAC(criteria, sysUserId);
        return Response.ok(list).build();
    }
}
