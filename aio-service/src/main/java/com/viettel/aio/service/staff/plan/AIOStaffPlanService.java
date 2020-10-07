package com.viettel.aio.service.staff.plan;

import com.viettel.aio.bo.AIOStaffPlanBO;
import com.viettel.aio.bo.AIOStaffPlanDetailBO;
import com.viettel.aio.bo.AIOSysGroupBO;
import com.viettel.aio.bo.AIOSysUserBO;
import com.viettel.aio.business.CommonServiceAio;
import com.viettel.aio.dao.AIOStaffPlanDAO;
import com.viettel.aio.dao.AIOStaffPlanDetailDAO;
import com.viettel.aio.dao.AIOSysGroupDAO;
import com.viettel.aio.dao.AIOSysUserDAO;
import com.viettel.aio.dto.AIOStaffPlanDTO;
import com.viettel.aio.request.RequestMsg;
import com.viettel.aio.request.staff.plan.RequestStaffPlan;
import com.viettel.aio.response.ResponseMsg;
import com.viettel.aio.service.AIOServiceBase;
import com.viettel.ktts2.common.UEncrypt;
import org.apache.poi.hssf.util.CellReference;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service("aioStaffPlanService")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOStaffPlanService implements AIOServiceBase {

    @Autowired
    AIOSysGroupDAO aioSysGroupDAO;

    @Autowired
    CommonServiceAio commonService;

    @Autowired
    AIOSysUserDAO aioSysUserDAO;

    @Autowired
    AIOStaffPlanDAO aioStaffPlanDAO;

    @Autowired
    AIOStaffPlanDetailDAO aioStaffPlanDetailDAO;

    @Override
    public ResponseMsg doAction(RequestMsg requestMsg) throws Exception {

        switch (requestMsg.getServiceCode()){
            case "STAFF_PLAN_TEMPLACE":{
                return exportTemplace(requestMsg);
            }
            case "STAFF_PLAN_IMPORT_EXCELL": {
                return importExcell(requestMsg);
            }case "CREATE_STAFF_PLAN_MONTH":{
                return createStaffPlan(requestMsg);
            }case "LST_STAFF_PLAN":{
                return getLstStaffPlan(requestMsg);
            }
        }
        return null;
    }

    private ResponseMsg exportTemplace(RequestMsg requestMsg) throws Exception{
        String sheetName="Cum_doi";
        String fileName="staff_plan_templace.xlsx";

        ResponseMsg responseMsg=new ResponseMsg();

        RequestStaffPlan requestStaffPlan=(RequestStaffPlan) requestMsg.getData();

        List<AIOSysGroupBO> aioSysGroupBOS=aioSysGroupDAO.getListSysGroup(requestStaffPlan.getSysGroupId());

        if(aioSysGroupBOS==null||aioSysGroupBOS.isEmpty()){
            responseMsg.setStatus(500);
            responseMsg.setMessage("Không có dữ liệu cụm đội");
        }else {
//            XSSFWorkbook workbook = commonService.createWorkbook(fileName);
            XSSFWorkbook workbook=new XSSFWorkbook();
            XSSFSheet sheet = workbook.createSheet(sheetName);
            XSSFRow row;
            int range=0;
            for (int i=0;i<aioSysGroupBOS.size();i++){
                row=sheet.createRow(i);
                AIOSysGroupBO aioSysGroupBO=aioSysGroupBOS.get(i);
                XSSFCell cell=commonService.createExcelCell(row, 0, null);
                cell.setCellValue(aioSysGroupBO.getGroupNameLevel3());
                range=i;
            }

            Name namedRange;
            namedRange = workbook.createName();
            namedRange.setNameName("Categories");

            String reference=sheetName+"!$A$1:$A$"+(range+1);
            namedRange.setRefersToFormula(reference);

            //tao sheet import
            XSSFSheet sheetStaffPlan = workbook.createSheet("plan");
            String[] headers={"STT","Cụm/đội","Mã nhân viên","Chỉ tiêu thương mại","Chỉ tiêu dịch vụ"};
            row=sheetStaffPlan.createRow(0);
            for (int i=0;i<headers.length;i++){
                XSSFCell cell=commonService.createExcelCell(row, i, null);
                cell.setCellValue(headers[i]);
            }

            row=sheetStaffPlan.createRow(1);
            XSSFCell cell=commonService.createExcelCell(row, 0, null);
            cell.setCellValue(1);
            cell=commonService.createExcelCell(row, 2, null);
            cell.setCellValue("abc");

            cell=commonService.createExcelCell(row, 3, null);
            cell.setCellValue(0);

            cell=commonService.createExcelCell(row, 4, null);
            cell.setCellValue(0);

            cell=commonService.createExcelCell(row, 1, null);
            cell.setAsActiveCell();

            //data validations
            DataValidationHelper dvHelper = sheetStaffPlan.getDataValidationHelper();
            //data validation for categories in A2:
            DataValidationConstraint dvConstraint = dvHelper.createFormulaListConstraint("Categories");
            CellRangeAddressList addressList = new CellRangeAddressList(1, 1, 1, 1);
            DataValidation validation = dvHelper.createValidation(dvConstraint, addressList);
            sheetStaffPlan.addValidationData(validation);

            //data validation for items of the selected category in B2:
//            dvConstraint = dvHelper.createFormulaListConstraint("INDIRECT($A$1)");
//            addressList = new CellRangeAddressList(1, 1, 1, 1);
//            validation = dvHelper.createValidation(dvConstraint, addressList);
//            sheet.addValidationData(validation);

            workbook.setActiveSheet(1);


            String path = commonService.writeToFileOnServer(workbook, fileName);

            responseMsg.setMessage("success");
            responseMsg.setStatus(200);
            responseMsg.setData(UEncrypt.decryptFileUploadPath(path));
        }

        return responseMsg;
    }

    private ResponseMsg importExcell(RequestMsg requestMsg) throws Exception{

        RequestStaffPlan requestStaffPlan=(RequestStaffPlan)requestMsg.getData();

        File f = new File(requestStaffPlan.getPathFile());
        XSSFWorkbook workbook = new XSSFWorkbook(f);
        XSSFSheet sheet=workbook.getSheet("plan");

        DataFormatter formatter = new DataFormatter();

        AIOStaffPlanDTO aioStaffPlanDTO=null;

        List<AIOStaffPlanDTO> aioStaffPlanDTOS=new ArrayList<>();
        int countRow=0;
        for (Row row : sheet) {
            if(countRow>0){
                aioStaffPlanDTO=new AIOStaffPlanDTO();
                aioStaffPlanDTO.setNumberOrder(Integer.parseInt( formatter.formatCellValue(row.getCell(0))));
                aioStaffPlanDTO.setDeptname(row.getCell(1).getStringCellValue());
                aioStaffPlanDTO.setEmployeeCode(row.getCell(2).getStringCellValue());
                aioStaffPlanDTO.setCommercialTarget(Long.parseLong( formatter.formatCellValue(row.getCell(3))));
                aioStaffPlanDTO.setServiceTarget(Long.parseLong( formatter.formatCellValue(row.getCell(4))));

                aioStaffPlanDTOS.add(aioStaffPlanDTO);
            }
            countRow++;
        }

        ResponseMsg responseMsg=new ResponseMsg();
        responseMsg.setMessage("success");
        responseMsg.setStatus(200);
        responseMsg.setData(aioStaffPlanDTOS);

        return responseMsg;
    }

    @Transactional
    ResponseMsg createStaffPlan(RequestMsg requestMsg) throws  Exception{

        ResponseMsg responseMsg=new ResponseMsg();


        RequestStaffPlan requestStaffPlan=(RequestStaffPlan)requestMsg.getData();

        long totalTarget =0;

        AIOSysGroupBO aioSysGroupBO=aioSysGroupDAO.findItemId(requestStaffPlan.getSysGroupId());

        AIOStaffPlanBO staffPlanBO=new AIOStaffPlanBO();

        staffPlanBO.setSysGroupId(aioSysGroupBO.getSysGroupId());
        staffPlanBO.setSysGroupCode(aioSysGroupBO.getCode());
        staffPlanBO.setSysGroupName(aioSysGroupBO.getName());
        staffPlanBO.setMonth(requestStaffPlan.getAioStaffPlanInfoDTO().getMonth());
        staffPlanBO.setYear(requestStaffPlan.getAioStaffPlanInfoDTO().getYear());
        staffPlanBO.setStatus((long)1);
        staffPlanBO.setDescription(requestStaffPlan.getAioStaffPlanInfoDTO().getNote());

        AIOStaffPlanDetailBO staffPlanDetailBO=null;

        List<AIOStaffPlanDetailBO> aioStaffPlanDetailBOS=new ArrayList<>();

        for (AIOStaffPlanDTO aioStaffPlanDTO:requestStaffPlan.getAioStaffPlanInfoDTO().getAioStaffPlanDTOS()){
            staffPlanDetailBO=new AIOStaffPlanDetailBO();
            //check don vi
            AIOSysGroupBO sysGroupBO= aioSysGroupDAO.findItem(aioStaffPlanDTO.getDeptname());
            if(sysGroupBO==null){
                responseMsg.setStatus(500);
                responseMsg.setMessage("Không tồn tại cụm đội "+aioStaffPlanDTO.getDeptname());
                return  responseMsg;
            }

            //check nhan vien
            AIOSysUserBO aioSysUserBO= aioSysUserDAO.findItem(aioStaffPlanDTO.getEmployeeCode());
            if(aioSysUserBO==null){
                responseMsg.setStatus(500);
                responseMsg.setMessage("Không tồn tại nhân viên "+aioStaffPlanDTO.getEmployeeCode());
                return  responseMsg;
            }

            staffPlanDetailBO.setSysUserCode(aioSysUserBO.getEmployeeCode());
            staffPlanDetailBO.setSysUserId(aioSysUserBO.getSysUserId());
            staffPlanDetailBO.setSysUserName(aioSysUserBO.getFullName());
            staffPlanDetailBO.setSysGroupId(sysGroupBO.getSysGroupId());
            staffPlanDetailBO.setTargetsAmountTM(aioStaffPlanDTO.getCommercialTarget());
            staffPlanDetailBO.setTargetsAmountDV(aioStaffPlanDTO.getServiceTarget());

            totalTarget=totalTarget+aioStaffPlanDTO.getCommercialTarget()+aioStaffPlanDTO.getServiceTarget();

            aioStaffPlanDetailBOS.add(staffPlanDetailBO);
        }

        //check sum total target with target plan month
        Long targetMonth=aioStaffPlanDAO.getSumTargetPlanOfMonth(staffPlanBO.getYear(),staffPlanBO.getMonth(),staffPlanBO.getSysGroupId());
        if(totalTarget> targetMonth){
            responseMsg.setStatus(500);
            responseMsg.setMessage("Tổng chỉ tiêu nhân viên lớn hơn chỉ tiêu tháng của tỉnh ["+totalTarget+">"+targetMonth+"]");
            return  responseMsg;
        }

        //save info staff plan
        Long id=aioStaffPlanDAO.saveObject(staffPlanBO);
        if (id==0){
            responseMsg.setStatus(500);
            responseMsg.setMessage("Lỗi khi lưu thông tin ");
            return  responseMsg;
        }

        for(AIOStaffPlanDetailBO planDetailBO: aioStaffPlanDetailBOS){
            planDetailBO.setAioStaffPlanId(id);
            Long detailId=aioStaffPlanDetailDAO.saveObject(planDetailBO);
            if (detailId==0){
                responseMsg.setStatus(500);
                responseMsg.setMessage("Lỗi khi lưu thông tin ");
                return  responseMsg;
            }
        }



        responseMsg.setStatus(200);
        responseMsg.setMessage("success");

        return responseMsg;
    }

    private ResponseMsg getLstStaffPlan(RequestMsg requestMsg) throws  Exception{
        RequestStaffPlan requestStaffPlan=(RequestStaffPlan) requestMsg.getData();
        ResponseMsg responseMsg=new ResponseMsg();
        responseMsg.setMessage("success");
        responseMsg.setStatus(200);
        responseMsg.setData(aioStaffPlanDAO.findStaffPlan(requestStaffPlan.getSysGroupId(),requestStaffPlan.getYear()
                ,requestStaffPlan.getMonth(),(long)requestStaffPlan.getStatus(),requestStaffPlan.getPageSize(),requestStaffPlan.getPage()));

        return  responseMsg;
    }

}
