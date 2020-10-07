package com.viettel.aio.rest;

import com.viettel.aio.business.AIOOrderGoodsManageBusinessImpl;
import com.viettel.aio.dto.*;
import com.viettel.coms.dto.GoodsDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

//VietNT_20190820_create
public class AIOOrderRequestManagerRsServiceImpl implements AIOOrderRequestManagerRsService {

    protected final Logger log = Logger.getLogger(AIOOrderRequestManagerRsServiceImpl.class);

    @Autowired
    private AIOOrderGoodsManageBusinessImpl aioOrderGoodsManageBusiness;

    @Autowired
    private UserRoleBusinessImpl userRoleBusiness;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearchOrderRequestNV(AIOOrderRequestDTO obj) {
        String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW, Constant.AdResourceKey.ORDER_GOODS, request);
        DataListDTO data = new DataListDTO();
//        if (StringUtils.isNotEmpty(sysGroupIdStr)) {
            data = aioOrderGoodsManageBusiness.doSearchOrderRequestNV(obj, sysGroupIdStr);
//        } else {
//            data.setData(new ArrayList());
//            data.setSize(0);
//            data.setTotal(0);
//            data.setStart(1);
//        }
        return Response.ok(data).build();
    }

    @Override
    public Response getDetails(Long id) {
        try {
            List<AIOOrderRequestDetailDTO> dto = aioOrderGoodsManageBusiness.getDetails(id);
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
    public Response updateStatusOrder(AIOOrderRequestDTO obj) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            Long sysUserId = session.getVpsUserInfo().getSysUserId();
            obj.setCreateBy(sysUserId);
            aioOrderGoodsManageBusiness.updateStatusOrder(obj);
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
    public Response exportExcel(AIOOrderRequestDTO dto) {
        String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW, Constant.AdResourceKey.ORDER_GOODS, request);
        try {
            String filePath = aioOrderGoodsManageBusiness.exportExcel(dto, sysGroupIdStr);
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

    @Override
    public Response doSearchOrderBranch(AIOOrderBranchDTO obj) {
        DataListDTO data = aioOrderGoodsManageBusiness.doSearchOrderBranch(obj, request);
        return Response.ok(data).build();
    }

    @Override
    public Response getDataForAddView(int type) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            Long sysUserId = session.getVpsUserInfo().getSysUserId();
            AIOOrderRequestDTO dto = aioOrderGoodsManageBusiness.getDataForAddView(sysUserId, type);
            dto.setSysUserName(session.getVpsUserInfo().getEmployeeCode() + "-" + session.getVpsUserInfo().getFullName());
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
    public Response getRequestApprovedGoodsList(AIOOrderRequestDTO obj) {
        DataListDTO data = aioOrderGoodsManageBusiness.getRequestApprovedGoodsList(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response submitAddOrderBranch(AIOOrderBranchDTO obj) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO user = session.getVpsUserInfo();
            aioOrderGoodsManageBusiness.submitAddOrderBranch(obj, user);
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
    public Response getListSupplier() {
        return Response.ok(aioOrderGoodsManageBusiness.getListSupplier()).build();
    }

    @Override
    public Response getDetailOrderBranch(Long id) {
        try {
            AIOOrderBranchDTO dto = aioOrderGoodsManageBusiness.getDetailOrderBranch(id);
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
    public Response updateBranchOrderDate(AIOOrderBranchDTO obj) {
        try {
            aioOrderGoodsManageBusiness.updateBranchOrderDate(obj);
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
    public Response doSearchOrderRequestBranch(AIOOrderBranchDTO obj) {
        String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW, Constant.AdResourceKey.ORDER_GOODS, request);
        DataListDTO data = new DataListDTO();
//        if (StringUtils.isNotEmpty(sysGroupIdStr)) {
        data = aioOrderGoodsManageBusiness.doSearchOrderRequestBranch(obj, sysGroupIdStr);
//        } else {
//            data.setData(new ArrayList());
//            data.setSize(0);
//            data.setTotal(0);
//            data.setStart(1);
//        }
        return Response.ok(data).build();
    }

    @Override
    public Response getBranchDetails(Long id) {
        try {
            List<AIOOrderBranchDetailDTO> dto = aioOrderGoodsManageBusiness.getBranchDetails(id);
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
    public Response updateStatusOrderBranch(AIOOrderBranchDTO obj) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            Long sysUserId = session.getVpsUserInfo().getSysUserId();
            obj.setCreatedId(sysUserId);
            aioOrderGoodsManageBusiness.updateStatusOrderBranch(obj);
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
    public Response exportExcelOrderBranch(AIOOrderBranchDTO dto) {
        String sysGroupIdStr = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW, Constant.AdResourceKey.ORDER_GOODS, request);
        try {
            String filePath = aioOrderGoodsManageBusiness.exportExcelOrderBranch(dto, sysGroupIdStr);
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

    @Override
    public Response getBranchApprovedGoodsList(AIOOrderCompanyDTO dto) {
        DataListDTO data = aioOrderGoodsManageBusiness.getBranchApprovedGoodsList(dto);
        return Response.ok(data).build();
    }

    @Override
    public Response doSearchOrderCompany(AIOOrderCompanyDTO obj) {
        DataListDTO data = aioOrderGoodsManageBusiness.doSearchOrderCompany(obj, "");
        return Response.ok(data).build();
    }

    @Override
    public Response submitAddOrderCompany(AIOOrderCompanyDTO obj) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO user = session.getVpsUserInfo();
            aioOrderGoodsManageBusiness.submitAddOrderCompany(obj, user);
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
    public Response getDetailOrderCompany(Long id) {
        try {
            AIOOrderCompanyDTO dto = aioOrderGoodsManageBusiness.getDetailOrderCompany(id);
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
    public Response updateCompanyOrderDate(AIOOrderCompanyDTO obj) {
        try {
            aioOrderGoodsManageBusiness.updateCompanyOrderDate(obj);
            return Response.ok(Response.Status.OK).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }
    
    //Huypq-20190922-start
    @Override
    public Response getDataGoodsOrderBranch(GoodsDTO obj) {
        DataListDTO data = aioOrderGoodsManageBusiness.getDataGoodsOrderBranch(obj);
        return Response.ok(data).build();
    }
    
    @Override
    public Response getDataRequestOrder(AIOOrderBranchDetailDTO obj) {
        DataListDTO data = aioOrderGoodsManageBusiness.getDataRequestOrder(obj);
        return Response.ok(data).build();
    }
    
    @Override
	public Response getDataBranchWhenEdit(Long id) {
		// TODO Auto-generated method stub
		return Response.ok(aioOrderGoodsManageBusiness.getDataBranchWhenEdit(id)).build();
	}
    
    @Override
    public Response updateOrderBranch(AIOOrderBranchDTO obj) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO user = session.getVpsUserInfo();
            aioOrderGoodsManageBusiness.updateOrderBranch(obj, user);
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
	public Response checkRoleCreate() {
		// TODO Auto-generated method stub
		return Response.ok(aioOrderGoodsManageBusiness.checkRoleCreate(request)).build();
	}
	
	@Override
    public Response getDataCompanyGoods(AIOOrderBranchDetailDTO obj) {
        DataListDTO data = aioOrderGoodsManageBusiness.getDataCompanyGoods(obj);
        return Response.ok(data).build();
    }
	
	@Override
    public Response getDataForAddViewNew(int type) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            Long sysUserId = session.getVpsUserInfo().getSysUserId();
            AIOOrderRequestDTO dto = aioOrderGoodsManageBusiness.getDataForAddViewNew(sysUserId, type);
            dto.setSysUserName(session.getVpsUserInfo().getEmployeeCode() + "-" + session.getVpsUserInfo().getFullName());
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
    public Response updateOrderCompany(AIOOrderCompanyDTO obj) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO user = session.getVpsUserInfo();
            aioOrderGoodsManageBusiness.updateOrderCompany(obj, user);
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
	public Response getDataCompanyWhenEdit(Long id) {
		// TODO Auto-generated method stub
		return Response.ok(aioOrderGoodsManageBusiness.getDataCompanyWhenEdit(id)).build();
	}
    //huy-end

	@Override
	public Response groupDataCountGoods(List<AIOOrderBranchDetailDTO> listData) {
		// TODO Auto-generated method stub
		return Response.ok(aioOrderGoodsManageBusiness.groupDataCountGoods(listData)).build();
	}

}
