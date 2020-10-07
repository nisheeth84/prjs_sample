package com.viettel.aio.rest;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.viettel.aio.dto.AIOOrderBranchDTO;
import com.viettel.aio.dto.AIOOrderBranchDetailDTO;
import com.viettel.aio.dto.AIOOrderCompanyDTO;
import com.viettel.aio.dto.AIOOrderRequestDTO;
import com.viettel.coms.dto.GoodsDTO;

//VietNT_20190820_created
public interface AIOOrderRequestManagerRsService {

    @POST
    @Path("/doSearchOrderRequestNV")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchOrderRequestNV(AIOOrderRequestDTO obj);

    @POST
    @Path("/getDetails")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDetails(Long id);

    @POST
    @Path("/updateStatusOrder")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response updateStatusOrder(AIOOrderRequestDTO obj);

    @POST
    @Path("/exportExcel")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportExcel(AIOOrderRequestDTO dto);

    @POST
    @Path("/doSearchOrderBranch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchOrderBranch(AIOOrderBranchDTO obj);

    @POST
    @Path("/getDataForAddView")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDataForAddView(int type);

    @POST
    @Path("/getRequestApprovedGoodsList")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getRequestApprovedGoodsList(AIOOrderRequestDTO obj);

    @POST
    @Path("/submitAddOrderBranch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response submitAddOrderBranch(AIOOrderBranchDTO obj);

    @GET
    @Path("/getListSupplier")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getListSupplier();

    @POST
    @Path("/getDetailOrderBranch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDetailOrderBranch(Long id);

    @POST
    @Path("/updateBranchOrderDate")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response updateBranchOrderDate(AIOOrderBranchDTO obj);

    @POST
    @Path("/doSearchOrderRequestBranch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchOrderRequestBranch(AIOOrderBranchDTO obj);

    @POST
    @Path("/getBranchDetails")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getBranchDetails(Long id);

    @POST
    @Path("/updateStatusOrderBranch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response updateStatusOrderBranch(AIOOrderBranchDTO obj);

    @POST
    @Path("/exportExcelOrderBranch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response exportExcelOrderBranch(AIOOrderBranchDTO dto);

    @POST
    @Path("/getBranchApprovedGoodsList")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getBranchApprovedGoodsList(AIOOrderCompanyDTO dto);

    @POST
    @Path("/doSearchOrderCompany")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearchOrderCompany(AIOOrderCompanyDTO obj);

    @POST
    @Path("/submitAddOrderCompany")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response submitAddOrderCompany(AIOOrderCompanyDTO obj);

    @POST
    @Path("/getDetailOrderCompany")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDetailOrderCompany(Long id);

    @POST
    @Path("/updateCompanyOrderDate")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response updateCompanyOrderDate(AIOOrderCompanyDTO obj);
    
    //Huypq-20190922-start
    @POST
    @Path("/getDataGoodsOrderBranch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDataGoodsOrderBranch(GoodsDTO obj);
    
    @POST
    @Path("/getDataRequestOrder")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDataRequestOrder(AIOOrderBranchDetailDTO obj);
    
    @POST
    @Path("/getDataBranchWhenEdit")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDataBranchWhenEdit(Long id);
    
    @POST
    @Path("/updateOrderBranch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response updateOrderBranch(AIOOrderBranchDTO obj);
    
    @POST
    @Path("/checkRoleCreate")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response checkRoleCreate();
    
    @POST
    @Path("/getDataCompanyGoods")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDataCompanyGoods(AIOOrderBranchDetailDTO obj);
    
    @POST
    @Path("/getDataForAddViewNew")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDataForAddViewNew(int type);
    
    @POST
    @Path("/updateOrderCompany")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response updateOrderCompany(AIOOrderCompanyDTO obj);
    
    @POST
    @Path("/getDataCompanyWhenEdit")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response getDataCompanyWhenEdit(Long id);
    
    @POST
    @Path("/groupDataCountGoods")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response groupDataCountGoods(List<AIOOrderBranchDetailDTO> listData);
    //Huy-end
}