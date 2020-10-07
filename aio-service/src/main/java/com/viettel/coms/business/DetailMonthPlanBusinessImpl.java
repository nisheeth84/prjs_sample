package com.viettel.coms.business;

import com.viettel.coms.bo.ConstructionTaskBO;
import com.viettel.coms.bo.DetailMonthPlanBO;
import com.viettel.coms.dao.*;
import com.viettel.coms.dto.*;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;
import com.viettel.wms.utils.ValidateUtils;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import viettel.passport.client.UserToken;

import javax.servlet.http.HttpServletRequest;

import java.io.*;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Service("detailMonthPlanBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class DetailMonthPlanBusinessImpl
        extends BaseFWBusinessImpl<DetailMonthPlanDAO, DetailMonthPlanDTO, DetailMonthPlanBO>
        implements DetailMonthPlanBusiness {

    @Autowired
    private DetailMonthPlanDAO detailMonthPlanDAO;
    @Autowired
    private ConstructionTaskDAO constructionTaskDAO;
    @Autowired
    private ConstructionDAO constructionDAO;
    @Autowired
    private WorkItemDAO workItemDAO;
    @Autowired
    private DmpnOrderDAO dmpnOrderDAO;
    @Autowired
    private DepartmentDAO departmentDAO;
    @Autowired
    private SysUserCOMSDAO sysUserCOMSDAO;
    @Autowired
    private ConstructionTaskBusinessImpl constructionTaskBusinessImpl;

    private List<ConstructionDetailDTO> listConstruction = new ArrayList<ConstructionDetailDTO>();
    // List<CatStationDTO> listCatStation = constructionDAO.getCatStation(null);
    private List<DepartmentDTO> listSys = new ArrayList<DepartmentDTO>();
    private String DONG_TIEN = "Import_dongtien_thang_chitiet.xlsx";
    private String YEU_CAU_VAT_TU = "Import_vattu_thang_chitiet.xlsx";
    @Value("${folder_upload2}")
    private String folder2Upload;
    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    // List<CatStationDTO> listCatStation = constructionDAO.getCatStation(null);
    // private List<DepartmentDTO> listSys = departmentDAO.getAll();

    // private List<ConstructionDetailDTO> listConstruction = new
    // ArrayList<ConstructionDetailDTO>();
    // List<CatStationDTO> listCatStation = constructionDAO.getCatStation(null);
    // private List<DepartmentDTO> listSys =new ArrayList<DepartmentDTO>();

    public DetailMonthPlanBusinessImpl() {
        tModel = new DetailMonthPlanBO();
        tDAO = detailMonthPlanDAO;
    }

    @Override
    public DetailMonthPlanDAO gettDAO() {
        return detailMonthPlanDAO;
    }

    @Override
    public long count() {
        return detailMonthPlanDAO.count("DetailMonthPlanBO", null);
    }

    public DataListDTO doSearch(DetailMonthPlanSimpleDTO obj, HttpServletRequest request) {
        List<DetailMonthPlaningDTO> ls = new ArrayList<DetailMonthPlaningDTO>();
        obj.setTotalRecord(0);
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        if (groupIdList != null && !groupIdList.isEmpty())
            ls = detailMonthPlanDAO.doSearch(obj, groupIdList);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

    public Long checkPermissionsAdd(Long sysGroupId, HttpServletRequest request) {

        if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE,
                Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request)) {
            throw new IllegalArgumentException("Bạn không có quyền tạo mới kế hoạch tháng chi tiết");
        }
//		hoanm1_20180607_start
//		if (!VpsPermissionChecker.checkPermissionOnDomainData(
//				Constant.OperationKey.CREATE,
//				Constant.AdResourceKey.MONTHLY_DETAIL_PLAN,
//				sysGroupId, request)) {
//			throw new IllegalArgumentException(
//					"Bạn không có quyền tạo kế hoạch tháng chi tiết cho đơn vị này");
//		}
//		hoanm1_20180607_end
        try {
            return 0l;
        } catch (Exception e) {
            return 1l;
        }
    }

    public Long checkPermissionsCopy(Long sysGroupId, HttpServletRequest request) {

        if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE,
                Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request)) {
            throw new IllegalArgumentException("Bạn không có quyền sao chép kế hoạch tháng chi tiết");
        }
//		hoanm1_20180607_start
//		if (!VpsPermissionChecker.checkPermissionOnDomainData(
//				Constant.OperationKey.CREATE,
//				Constant.AdResourceKey.MONTHLY_DETAIL_PLAN,
//				sysGroupId, request)) {
//			throw new IllegalArgumentException(
//					"Bạn không có quyền sao chép kế hoạch tháng chi tiết cho đơn vị này");
//		}
//		hoanm1_20180607_end
        try {
            return 0l;
        } catch (Exception e) {
            return 1l;
        }
    }

    public Long checkPermissionsUpdate(Long sysGroupId, HttpServletRequest request, DetailMonthPlanSimpleDTO obj) {
        if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE,
                Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request)) {
            return 2L;
        }
//		hoanm1_20180607_start
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE,
                Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        if (!groupIdList.contains(obj.getSysGroupId().toString())) {
            return 2L;
        }
//		hoanm1_20180607_end
        try {
            return 0l;
        } catch (Exception e) {
            return 1l;
        }
    }

    public Long checkPermissionsDelete(Long sysGroupId, HttpServletRequest request, DetailMonthPlanSimpleDTO obj) {

        if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE,
                Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request)) {
            throw new IllegalArgumentException("Bạn không có quyền xóa kế hoạch tháng chi tiết");
        }
//		hoanm1_20180607_start
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE,
                Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        if (!groupIdList.contains(obj.getSysGroupId().toString())) {
            throw new IllegalArgumentException("Bạn không có quyền xóa kế hoạch tháng chi tiết cho đơn vị này");
        }
//		hoanm1_20180607_end
        try {
            return 0l;
        } catch (Exception e) {
            return 1l;
        }
    }

    public Long checkPermissionsRegistry(Long sysGroupId, HttpServletRequest request) {

        if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE,
                Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request)) {
            throw new IllegalArgumentException("Bạn không có quyền trình kí kế hoạch tháng chi tiết");
        }
//		hoanm1_20180607_start
//		if (!VpsPermissionChecker.checkPermissionOnDomainData(
//				Constant.OperationKey.CREATE,
//				Constant.AdResourceKey.MONTHLY_DETAIL_PLAN,
//				sysGroupId, request)) {
//			throw new IllegalArgumentException(
//					"Bạn không có quyền trình kí kế hoạch tháng chi tiết cho đơn vị này");
//		}
//		hoanm1_20180607_end
        try {
            return 0l;
        } catch (Exception e) {
            return 1l;
        }
    }

    public Long add(DetailMonthPlanSimpleDTO obj, HttpServletRequest request) {
        // chinhpxn20180723_start
        KttsUserSession user = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        // chinhpxn20180723_end
        checkMonthYearSys(obj.getMonth(), obj.getYear(), obj.getSysGroupId(), null);
        Long detailMonthPlanId = detailMonthPlanDAO.saveObject(obj.toModel());
        HashMap<String, Long> checkDupMapWorkItem = new HashMap<String, Long>();

        Long i = 0L;
        if (obj.getListTC() != null) {
//          hoanm1_20181101_start
            HashMap<Long, String> sysGroupMap = new HashMap<Long, String>();
            List<DepartmentDTO> lstGroup = constructionTaskDAO.getListGroup();
            for(DepartmentDTO sys: lstGroup){
            	sysGroupMap.put(sys.getDepartmentId(),sys.getName());
            }
            Long checkGroupLevel1= constructionTaskDAO.getLevel1SysGroupId(obj.getSysGroupId(),"1",detailMonthPlanId);
            HashMap<Long,Long> constructionTaskSysGroupMap = new HashMap<Long,Long>();
            constructionTaskSysGroupMap.put(detailMonthPlanId, checkGroupLevel1);
            HashMap<String,Long> constructionCodeMap = new HashMap<String,Long>();
            List<ConstructionTaskDetailDTO> lstConstructionCode = constructionTaskDAO.getLevel2ConstructionCode("1",2L,detailMonthPlanId,obj.getSysGroupId());
            for(ConstructionTaskDetailDTO code: lstConstructionCode){
            	constructionCodeMap.put(code.getConstructionCode(),code.getConstructionTaskId());
            }
//            hoanm1_20181101_end
            for (ConstructionTaskDetailDTO dto : obj.getListTC()) {
//                WorkItemDetailDTO work = workItemDAO.getWorkItemByCodeNew(dto.getWorkItemName(),
//                        dto.getConstructionCode());
//                String key = dto.getConstructionCode() + "|" + work.getWorkItemId() + "|" + dto.getPerformerId();
//                if (checkDupMapWorkItem.get(key) == null) {
//                    checkDupMapWorkItem.put(key, i++);
//                } else {
//                    continue;
//                }
                String key = dto.getConstructionId() + "|" + dto.getWorkItemId() + "|" + dto.getPerformerId();
                if (checkDupMapWorkItem.get(key) == null) {
                	checkDupMapWorkItem.put(key, i++);
                } else {
                    continue;
                }
                dto.setLevelId(3L);
                dto.setMonth(obj.getMonth());
                dto.setSysGroupId(obj.getSysGroupId());
                dto.setYear(obj.getYear());
                dto.setType("1");
                dto.setDetailMonthPlanId(detailMonthPlanId);
                dto.setCreatedUserId(obj.getCreatedUserId());
                dto.setCreatedDate(new Date());
                dto.setCreatedGroupId(obj.getCreatedGroupId());
//                hoanm1_20181101_start
//                if (dto.getSupervisorId() == null)
//                    dto.setSupervisorId(
//                            Double.parseDouble(constructionTaskDAO.getSuperVisorId(dto.getConstructionCode())));
//                if (dto.getDirectorId() == null)
//                    dto.setDirectorId(Double.parseDouble(constructionTaskDAO.getDirectorId(dto.getConstructionCode())));
                dto.setSysGroupName(sysGroupMap.get(obj.getSysGroupId()));
//              hoanm1_20181101_end
                getParentTaskForThiCong(dto, "1", detailMonthPlanId, obj.getSysGroupId(),constructionCodeMap,constructionTaskSysGroupMap);

                dto.setPerformerWorkItemId(dto.getPerformerId());
//				WorkItemDetailDTO work = workItemDAO.getWorkItemByCode(dto
//						.getWorkItemCode());
                dto.setTaskName(dto.getWorkItemName());
                dto.setWorkItemId(dto.getWorkItemId());
                dto.setBaselineStartDate(dto.getStartDate());
                dto.setBaselineEndDate(dto.getEndDate());
                dto.setStatus("1");
                dto.setCompleteState("1");
                dto.setPerformerWorkItemId(dto.getPerformerId());
                ConstructionTaskBO bo = dto.toModel();
                Long id = constructionTaskDAO.saveObject(bo);
                detailMonthPlanDAO.updatePerforment(dto.getPerformerId(), dto.getWorkItemId());
                constructionTaskDAO.getSession().flush();
                bo.setPath(dto.getPath() + id + "/");
                dto.setPath(dto.getPath() + id + "/");
                dto.setConstructionTaskId(id);
                constructionTaskDAO.updateObject(bo);
                
             // hoanm1_20181001_start
                constructionTaskBusinessImpl.createSendSmsEmail(dto, user);
//                hoanm1_20181001_end
                
                if (dto.getWorkItemId() != null)
                    insertTaskByWorkItem("1", dto.getWorkItemId(), dto);

            }

            // hoanm1_20181001_start_comment
//            Long count = -1L;
//            HashMap<String, Long> taskCountMap = new HashMap<String, Long>();
//            for (ConstructionTaskDetailDTO dto : obj.getListTC()) {
//                count = taskCountMap.get(dto.getPerformerId().toString());
//                if (count != null && count != -1L) {
//                    count++;
//                    taskCountMap.put(dto.getPerformerId().toString(), count);
//                } else {
//                    taskCountMap.put(dto.getPerformerId().toString(), 1L);
//                }
//            }
//            HashMap<String, Long> checkDupMap = new HashMap<String, Long>();
//            List<ConstructionTaskDetailDTO> smsLst = new ArrayList<ConstructionTaskDetailDTO>();
//            for (ConstructionTaskDetailDTO dto : obj.getListTC()) {
//                String key = dto.getPerformerId().toString();
//                if (checkDupMap.get(key) == null) {
//                    checkDupMap.put(key, taskCountMap.get(key));
//                    ConstructionTaskDetailDTO newObj = new ConstructionTaskDetailDTO();
//                    newObj.setPerformerId(dto.getPerformerId());
//                    newObj.setTaskCount(taskCountMap.get(key));
//                    newObj.setType(dto.getType());
//                    smsLst.add(newObj);
//                } else {
//                    continue;
//                }
//            }
//            for (ConstructionTaskDetailDTO smsObj : smsLst) {
//                detailMonthPlanDAO.createSendSmsEmail(smsObj, user);
//            }
            // hoanm1_20181001_end_comment

        }
        if (obj.getListHSHC() != null) {
            ConstructionTaskDetailDTO parent = new ConstructionTaskDetailDTO();
            getParentTask(parent, "1", detailMonthPlanId, obj.getSysGroupId(), obj);
            for (ConstructionTaskDetailDTO dto : obj.getListHSHC()) {
                // dto.setPerformerId(getSysId(listSys,dto.getPerformerName()));
                dto.setMonth(obj.getMonth());
                dto.setSysGroupId(obj.getSysGroupId());
                dto.setYear(obj.getYear());
                dto.setType("2");
                dto.setDetailMonthPlanId(detailMonthPlanId);
                dto.setLevelId(4L);
                dto.setTaskName("Làm HSHC cho công trình " + dto.getConstructionCode());
                dto.setParentId(parent.getConstructionTaskId());
                dto.setCreatedUserId(obj.getCreatedUserId());
                dto.setCreatedDate(new Date());
                dto.setCreatedGroupId(obj.getCreatedGroupId());
                dto.setBaselineStartDate(dto.getStartDate());
                dto.setBaselineEndDate(dto.getEndDate());
                dto.setStatus("1");
                dto.setCompleteState("1");
                if (dto.getSupervisorId() == null)
                    dto.setSupervisorId(
                            Double.parseDouble(constructionTaskDAO.getSuperVisorId(dto.getConstructionCode())));
                if (dto.getDirectorId() == null)
                    dto.setDirectorId(Double.parseDouble(constructionTaskDAO.getDirectorId(dto.getConstructionCode())));
                dto.setPerformerWorkItemId(dto.getPerformerId());
                ConstructionTaskBO bo = dto.toModel();
                Long id = constructionTaskDAO.saveObject(bo);
                bo.setPath(parent.getPath() + id + "/");
                constructionTaskDAO.updateObject(bo);
                // hoanm1_20181001_start
                constructionTaskBusinessImpl.createSendSmsEmail(dto, user);
//                hoanm1_20181001_end
            }

            // hoanm1_20181001_start_comment
//            Long count = -1L;
//            HashMap<String, Long> taskCountMap = new HashMap<String, Long>();
//            for (ConstructionTaskDetailDTO dto : obj.getListHSHC()) {
//                count = taskCountMap.get(dto.getPerformerId().toString());
//                if (count != null && count != -1L) {
//                    count++;
//                    taskCountMap.put(dto.getPerformerId().toString(), count);
//                } else {
//                    taskCountMap.put(dto.getPerformerId().toString(), 1L);
//                }
//            }
//            HashMap<String, Long> checkDupMap = new HashMap<String, Long>();
//            List<ConstructionTaskDetailDTO> smsLst = new ArrayList<ConstructionTaskDetailDTO>();
//            for (ConstructionTaskDetailDTO dto : obj.getListHSHC()) {
//                String key = dto.getPerformerId().toString();
//                if (checkDupMap.get(key) == null) {
//                    checkDupMap.put(key, taskCountMap.get(key));
//                    ConstructionTaskDetailDTO newObj = new ConstructionTaskDetailDTO();
//                    newObj.setPerformerId(dto.getPerformerId());
//                    newObj.setTaskCount(taskCountMap.get(key));
//                    newObj.setType(dto.getType());
//                    smsLst.add(newObj);
//                } else {
//                    continue;
//                }
//            }
//            for (ConstructionTaskDetailDTO smsObj : smsLst) {
//                detailMonthPlanDAO.createSendSmsEmail(smsObj, user);
//            }
            // hoanm1_20181001_end_comment
        }
        if (obj.getListLDT() != null) {
            ConstructionTaskDetailDTO parent = new ConstructionTaskDetailDTO();
            getParentTask(parent, "1", detailMonthPlanId, obj.getSysGroupId(), obj);
            for (ConstructionTaskDetailDTO dto : obj.getListLDT()) {
                // dto.setPerformerId(getSysId(listSys,dto.getPerformerName()));
                dto.setMonth(obj.getMonth());
                dto.setSysGroupId(obj.getSysGroupId());
                dto.setYear(obj.getYear());
                dto.setType("3");
                dto.setDetailMonthPlanId(detailMonthPlanId);
                dto.setLevelId(4L);
//				chinhpxn20180711_start
//				dto.setTaskName("Lên doanh thu cho công trình "
//						+ dto.getConstructionCode());
                if (dto.getTaskOrder().equalsIgnoreCase("2")) {
                    dto.setTaskName("Lên doanh thu cho công trình " + dto.getConstructionCode());
                } else {
                    dto.setTaskName("Tạo đề nghị quyết toán cho công trình " + dto.getConstructionCode());
                }
                // chinhpxn20180711_end
                dto.setParentId(parent.getConstructionTaskId());
                dto.setCreatedUserId(obj.getCreatedUserId());
                dto.setCreatedDate(new Date());
                dto.setCreatedGroupId(obj.getCreatedGroupId());
                dto.setBaselineStartDate(dto.getStartDate());
                dto.setBaselineEndDate(dto.getEndDate());
                dto.setStatus("1");
                dto.setCompleteState("1");
                if (dto.getSupervisorId() == null)
                    dto.setSupervisorId(
                            Double.parseDouble(constructionTaskDAO.getSuperVisorId(dto.getConstructionCode())));
                if (dto.getDirectorId() == null)
                    dto.setDirectorId(Double.parseDouble(constructionTaskDAO.getDirectorId(dto.getConstructionCode())));
                dto.setPerformerWorkItemId(dto.getPerformerId());
                ConstructionTaskBO bo = dto.toModel();
                Long id = constructionTaskDAO.saveObject(bo);
                bo.setPath(parent.getPath() + id + "/");
                constructionTaskDAO.updateObject(bo);
                // hoanm1_20181001_start
                constructionTaskBusinessImpl.createSendSmsEmail(dto, user);
//                hoanm1_20181001_end
            }
            // hoanm1_20181001_start_comment
//            Long count = -1L;
//            HashMap<String, Long> taskCountMap = new HashMap<String, Long>();
//            for (ConstructionTaskDetailDTO dto : obj.getListLDT()) {
//                count = taskCountMap.get(dto.getPerformerId().toString());
//                if (count != null && count != -1L) {
//                    count++;
//                    taskCountMap.put(dto.getPerformerId().toString(), count);
//                } else {
//                    taskCountMap.put(dto.getPerformerId().toString(), 1L);
//                }
//            }
//            HashMap<String, Long> checkDupMap = new HashMap<String, Long>();
//            List<ConstructionTaskDetailDTO> smsLst = new ArrayList<ConstructionTaskDetailDTO>();
//            for (ConstructionTaskDetailDTO dto : obj.getListLDT()) {
//                String key = dto.getPerformerId().toString();
//                if (checkDupMap.get(key) == null) {
//                    checkDupMap.put(key, taskCountMap.get(key));
//                    ConstructionTaskDetailDTO newObj = new ConstructionTaskDetailDTO();
//                    newObj.setPerformerId(dto.getPerformerId());
//                    newObj.setTaskCount(taskCountMap.get(key));
//                    newObj.setType(dto.getType());
//                    smsLst.add(newObj);
//                } else {
//                    continue;
//                }
//            }
//            for (ConstructionTaskDetailDTO smsObj : smsLst) {
//                detailMonthPlanDAO.createSendSmsEmail(smsObj, user);
//            }
            // hoanm1_20181001_end_comment
        }
        if (obj.getListDT() != null) {
            for (ConstructionTaskDetailDTO dto : obj.getListDT()) {

                // dto.setPerformerId(getSysId(listSys,dto.getPerformerName()));
                dto.setMonth(obj.getMonth());
                dto.setSysGroupId(obj.getSysGroupId());
                dto.setYear(obj.getYear());
                dto.setType("5");
                dto.setDetailMonthPlanId(detailMonthPlanId);
                dto.setCreatedUserId(obj.getCreatedUserId());
                dto.setCreatedDate(new Date());
                dto.setCreatedGroupId(obj.getCreatedGroupId());
                constructionTaskDAO.saveObject(dto.toModel());
            }
        }
        if (obj.getListCVK() != null) {
            for (ConstructionTaskDetailDTO dto : obj.getListCVK()) {
                //
                // dto.setPerformerId(getSysId(listSys,dto.getPerformerName()));
                getParentTaskForCVK(dto, "1", detailMonthPlanId, obj.getSysGroupId());
                dto.setMonth(obj.getMonth());
                dto.setSysGroupId(obj.getSysGroupId());
                dto.setYear(obj.getYear());
                dto.setType("6");
                dto.setLevelId(4L);
                dto.setDetailMonthPlanId(detailMonthPlanId);
                dto.setCreatedUserId(obj.getCreatedUserId());
                dto.setCreatedDate(new Date());
                dto.setCreatedGroupId(obj.getCreatedGroupId());
                dto.setBaselineStartDate(dto.getStartDate());
                dto.setBaselineEndDate(dto.getEndDate());
                ConstructionTaskBO bo = dto.toModel();
                dto.setStatus("1");
                dto.setCompleteState("1");
                Long id = constructionTaskDAO.saveObject(bo);
                bo.setPath(dto.getPath() + id + "/");
                constructionTaskDAO.updateObject(bo);
                // hoanm1_20181001_start
                constructionTaskBusinessImpl.createSendSmsEmail(dto, user);
//                hoanm1_20181001_end
            }
            // hoanm1_20181001_start_comment
//            Long count = -1L;
//            HashMap<String, Long> taskCountMap = new HashMap<String, Long>();
//            for (ConstructionTaskDetailDTO dto : obj.getListCVK()) {
//                count = taskCountMap.get(dto.getPerformerId().toString());
//                if (count != null && count != -1L) {
//                    count++;
//                    taskCountMap.put(dto.getPerformerId().toString(), count);
//                } else {
//                    taskCountMap.put(dto.getPerformerId().toString(), 1L);
//                }
//            }
//            HashMap<String, Long> checkDupMap = new HashMap<String, Long>();
//            List<ConstructionTaskDetailDTO> smsLst = new ArrayList<ConstructionTaskDetailDTO>();
//            for (ConstructionTaskDetailDTO dto : obj.getListCVK()) {
//                String key = dto.getPerformerId().toString();
//                if (checkDupMap.get(key) == null) {
//                    checkDupMap.put(key, taskCountMap.get(key));
//                    ConstructionTaskDetailDTO newObj = new ConstructionTaskDetailDTO();
//                    newObj.setPerformerId(dto.getPerformerId());
//                    newObj.setTaskCount(taskCountMap.get(key));
//                    newObj.setType(dto.getType());
//                    smsLst.add(newObj);
//                } else {
//                    continue;
//                }
//            }
//            for (ConstructionTaskDetailDTO smsObj : smsLst) {
//                detailMonthPlanDAO.createSendSmsEmail(smsObj, user);
//            }
            // hoanm1_20181001_end_comment
        }
        if (obj.getListDmpnOrder() != null) {
            for (DmpnOrderDTO dto : obj.getListDmpnOrder()) {
                dto.setDetailMonthPlanId(detailMonthPlanId);
                dto.setCreatedUserId(obj.getCreatedUserId());
                dto.setCreatedDate(new Date());
                dto.setCreatedGroupId(obj.getCreatedGroupId());
                dmpnOrderDAO.saveObject(dto.toModel());
            }
        }
        return detailMonthPlanId;
    }

    // private Long getSysId(List<DepartmentDTO> listSys,String name){
    // for (DepartmentDTO departmentDTO : listSys) {
    // if (departmentDTO.getName().equals(name)) {
    // return departmentDTO.getDepartmentId();
    // }
    // }
    // return 0L;
    // }
    // private Long getConstructionId(List<ConstructionDetailDTO>
    // listConstruction,String code){
    // for (ConstructionDetailDTO constructionDetailDTO : listConstruction) {
    // if (constructionDetailDTO.getCode().equals(code)) {
    // return constructionDetailDTO.getConstructionId();
    // }
    // }
    // return 0L;
    // }

    // private List<ConstructionDetailDTO> listConstruction(){
    // ConstructionDetailDTO consdto = new ConstructionDetailDTO();
    // consdto.setPage(5L);
    // consdto.setPageSize(10);
    // List<ConstructionDetailDTO> listConstruction =
    // constructionDAO.doSearch(consdto);
    // return listConstruction;
    // }

    public void checkMonthYearSys(Long month, Long year, Long sysGroupId, Long detailMonthId) {
        boolean isExist = detailMonthPlanDAO.checkMonthYearSys(month, year, sysGroupId, detailMonthId);
        if (isExist)
            throw new IllegalArgumentException("Kế hoạch chi tiết của đơn vị đã tồn tại!");
    }

    public Long updateMonth(DetailMonthPlanSimpleDTO obj, HttpServletRequest request) {
        if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE,
                Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request)) {
            throw new IllegalArgumentException("Bạn không có quyền chỉnh sửa kế hoạch tháng chi tiết");
        }
        if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.CREATE,
                Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, obj.getSysGroupId(), request)) {
            throw new IllegalArgumentException("Bạn không có quyền chỉnh sửa kế hoạch tháng chi tiết cho đơn vị này");
        }
        checkMonthYearSys(obj.getMonth(), obj.getYear(), obj.getSysGroupId(), obj.getDetailMonthPlanId());
        detailMonthPlanDAO.updateObject(obj.toModel());
        return obj.getDetailMonthPlanId();
    }

    public DetailMonthPlanSimpleDTO getById(Long id) {
        DetailMonthPlanSimpleDTO dto = detailMonthPlanDAO.getById(id);
        return dto;
    }

    public void updateListTC(DetailMonthPlanSimpleDTO obj, KttsUserSession user) {
        Long detailMonthPlanId = obj.getDetailMonthPlanId();
        if ("1".equalsIgnoreCase(obj.getIsTCImport())) {
            // neu import tu file thi delete all trong db tru level = 1( dung
            // cho hshc,len doanh thu, cvkhac) va them moi all truyen
            // ve
            constructionTaskDAO.deleteConstructionTaskByType("1", detailMonthPlanId);
            constructionTaskDAO.getSession().flush();
            HashMap<String, Long> checkDupMapWorkItem = new HashMap<String, Long>();
            Long i = 0L;
            if (obj.getListTC() != null && !obj.getListTC().isEmpty()) {
//              hoanm1_20181101_start
                HashMap<Long, String> sysGroupMap = new HashMap<Long, String>();
                List<DepartmentDTO> lstGroup = constructionTaskDAO.getListGroup();
                for(DepartmentDTO sys: lstGroup){
                	sysGroupMap.put(sys.getDepartmentId(),sys.getName());
                }
                Long checkGroupLevel1= constructionTaskDAO.getLevel1SysGroupId(obj.getSysGroupId(),"1",detailMonthPlanId);
                HashMap<Long,Long> constructionTaskSysGroupMap = new HashMap<Long,Long>();
                constructionTaskSysGroupMap.put(detailMonthPlanId, checkGroupLevel1);
                HashMap<String,Long> constructionCodeMap = new HashMap<String,Long>();
                List<ConstructionTaskDetailDTO> lstConstructionCode = constructionTaskDAO.getLevel2ConstructionCode("1",2L,detailMonthPlanId,obj.getSysGroupId());
                for(ConstructionTaskDetailDTO code: lstConstructionCode){
                	constructionCodeMap.put(code.getConstructionCode(),code.getConstructionTaskId());
                }
//                hoanm1_20181101_end
                for (ConstructionTaskDetailDTO dto : obj.getListTC()) {
//                    WorkItemDetailDTO work = workItemDAO.getWorkItemByCodeNew(dto.getWorkItemName(),
//                            dto.getConstructionCode());
//                    String key = dto.getConstructionCode() + "|" + work.getWorkItemId() + "|" + dto.getPerformerId();
//                    if (checkDupMapWorkItem.get(key) == null) {
//                        checkDupMapWorkItem.put(key, i++);
//                    } else {
//                        continue;
//                    }
                    String key = dto.getConstructionId() + "|" + dto.getWorkItemId() + "|" + dto.getPerformerId();
                    if (checkDupMapWorkItem.get(key) == null) {
                    	checkDupMapWorkItem.put(key, i++);
                    } else {
                        continue;
                    }
                    dto.setLevelId(3L);
                    dto.setMonth(obj.getMonth());
                    dto.setSysGroupId(obj.getSysGroupId());
                    dto.setYear(obj.getYear());
                    dto.setType("1");
                    dto.setDetailMonthPlanId(detailMonthPlanId);
                    dto.setSysGroupName(sysGroupMap.get(obj.getSysGroupId()));
                    getParentTaskForThiCong(dto, "1", detailMonthPlanId, obj.getSysGroupId(),constructionCodeMap,constructionTaskSysGroupMap);
                    dto.setPerformerWorkItemId(dto.getPerformerId());
//					WorkItemDetailDTO work = workItemDAO.getWorkItemByCode(dto
//							.getWorkItemCode());

                    dto.setTaskName(dto.getWorkItemName());
                    dto.setWorkItemId(dto.getWorkItemId());
                    dto.setBaselineStartDate(dto.getStartDate());
                    dto.setBaselineEndDate(dto.getEndDate());
                    dto.setStatus("1");
                    dto.setCompleteState("1");
                    dto.setPerformerWorkItemId(dto.getPerformerId());
//                    if (dto.getSupervisorId() == null)
//                        dto.setSupervisorId(
//                                Double.parseDouble(constructionTaskDAO.getSuperVisorId(dto.getConstructionCode())));
//                    if (dto.getDirectorId() == null)
//                        dto.setDirectorId(
//                                Double.parseDouble(constructionTaskDAO.getDirectorId(dto.getConstructionCode())));
                    dto.setCreatedDate(new Date());
                    dto.setCreatedUserId(user.getVpsUserInfo().getSysUserId());
                    dto.setCreatedGroupId(user.getVpsUserInfo().getSysGroupId());

                    ConstructionTaskBO bo = dto.toModel();
                    Long id = constructionTaskDAO.saveObject(bo);
                    detailMonthPlanDAO.updatePerforment(dto.getPerformerId(), dto.getWorkItemId());
                    bo.setPath(dto.getPath() + id + "/");
                    dto.setPath(dto.getPath() + id + "/");
                    dto.setConstructionTaskId(id);
                    constructionTaskDAO.updateObject(bo);

                    // chinhpxn20180718_start
                    constructionTaskBusinessImpl.createSendSmsEmail(dto, user);
                    // chinhpxn20180718_end

                    if (dto.getWorkItemId() != null)
                        insertTaskByWorkItem("1", dto.getWorkItemId(), dto);

                }
                // hoanm1_20181001_start_commit
//                Long count = -1L;
//                HashMap<String, Long> taskCountMap = new HashMap<String, Long>();
//                for (ConstructionTaskDetailDTO dto : obj.getListTC()) {
//                    count = taskCountMap.get(dto.getPerformerId().toString());
//                    if (count != null && count != -1L) {
//                        count++;
//                        taskCountMap.put(dto.getPerformerId().toString(), count);
//                    } else {
//                        taskCountMap.put(dto.getPerformerId().toString(), 1L);
//                    }
//                }
//                HashMap<String, Long> checkDupMap = new HashMap<String, Long>();
//                List<ConstructionTaskDetailDTO> smsLst = new ArrayList<ConstructionTaskDetailDTO>();
//                for (ConstructionTaskDetailDTO dto : obj.getListTC()) {
//                    String key = dto.getPerformerId().toString();
//                    if (checkDupMap.get(key) == null) {
//                        checkDupMap.put(key, taskCountMap.get(key));
//                        ConstructionTaskDetailDTO newObj = new ConstructionTaskDetailDTO();
//                        newObj.setPerformerId(dto.getPerformerId());
//                        newObj.setTaskCount(taskCountMap.get(key));
//                        newObj.setType(dto.getType());
//                        smsLst.add(newObj);
//                    } else {
//                        continue;
//                    }
//                }
//                for (ConstructionTaskDetailDTO smsObj : smsLst) {
//                    detailMonthPlanDAO.createSendSmsEmail(smsObj, user);
//                }

                // hoanm1_20181001_end_commit
            }

        } else {
            // neu khong thi xoa nhung ban ghi duoc chon va sua toi da 10 record
            if (obj.getListConstrTaskIdDelete() != null && obj.getListConstrTaskIdDelete().size() > 0) {
                // constructionTaskDAO.removeByListId(obj
                // .getListConstrTaskIdDelete());
                for (String id : obj.getListConstrTaskIdDelete()) {
                    constructionTaskDAO.deleteByParentId(id);
                    constructionTaskDAO.deleteParentAndChild(id);
                    constructionTaskDAO.getSession().flush();
                }

            }
            
            if (obj.getListTC() != null && !obj.getListTC().isEmpty()) {
                HashMap<String, Long> checkDupMapWorkItem = new HashMap<String, Long>();
                Long i = 0L;
//              hoanm1_20181101_start
                HashMap<Long, String> sysGroupMap = new HashMap<Long, String>();
                List<DepartmentDTO> lstGroup = constructionTaskDAO.getListGroup();
                for(DepartmentDTO sys: lstGroup){
                	sysGroupMap.put(sys.getDepartmentId(),sys.getName());
                }
                Long checkGroupLevel1= constructionTaskDAO.getLevel1SysGroupId(obj.getSysGroupId(),"1",detailMonthPlanId);
                HashMap<Long,Long> constructionTaskSysGroupMap = new HashMap<Long,Long>();
                constructionTaskSysGroupMap.put(detailMonthPlanId, checkGroupLevel1);
                HashMap<String,Long> constructionCodeMap = new HashMap<String,Long>();
                List<ConstructionTaskDetailDTO> lstConstructionCode = constructionTaskDAO.getLevel2ConstructionCode("1",2L,detailMonthPlanId,obj.getSysGroupId());
                for(ConstructionTaskDetailDTO code: lstConstructionCode){
                	constructionCodeMap.put(code.getConstructionCode(),code.getConstructionTaskId());
                }
//                hoanm1_20181101_end
                for (ConstructionTaskDetailDTO dto : obj.getListTC()) {
                    if (dto.getConstructionTaskId() == null) {
//                        WorkItemDetailDTO work = workItemDAO.getWorkItemByCodeNew(dto.getWorkItemName(),
//                                dto.getConstructionCode());
//                        String key = dto.getConstructionCode() + "|" + work.getWorkItemId() + "|"
//                                + dto.getPerformerId();
//                        if (checkDupMapWorkItem.get(key) == null) {
//                            checkDupMapWorkItem.put(key, i++);
//                        } else {
//                            continue;
//                        }
                        String key = dto.getConstructionId() + "|" + dto.getWorkItemId() + "|" + dto.getPerformerId();
                        if (checkDupMapWorkItem.get(key) == null) {
                        	checkDupMapWorkItem.put(key, i++);
                        } else {
                            continue;
                        }
                        dto.setLevelId(3L);
                        dto.setMonth(obj.getMonth());
                        dto.setSysGroupId(obj.getSysGroupId());
                        dto.setYear(obj.getYear());
                        dto.setType("1");
                        dto.setDetailMonthPlanId(detailMonthPlanId);
                        dto.setSysGroupName(sysGroupMap.get(obj.getSysGroupId()));
                        getParentTaskForThiCong(dto, "1", detailMonthPlanId, obj.getSysGroupId(),constructionCodeMap,constructionTaskSysGroupMap);
                        dto.setCreatedDate(new Date());
                        dto.setCreatedUserId(user.getVpsUserInfo().getSysUserId());
                        dto.setCreatedGroupId(user.getVpsUserInfo().getSysGroupId());
                        dto.setPerformerWorkItemId(dto.getPerformerId());
                        /*
                         * WorkItemDetailDTO work = workItemDAO
                         * .getWorkItemByCodeNew(dto.getWorkItemName(),dto.getConstructionCode());
                         */
                        dto.setTaskName(dto.getWorkItemName());
                        dto.setWorkItemId(dto.getWorkItemId());
                        ConstructionTaskBO bo = dto.toModel();
                        Long id = constructionTaskDAO.saveObject(bo);
                        detailMonthPlanDAO.updatePerforment(dto.getPerformerId(), dto.getWorkItemId());
                        bo.setPath(dto.getPath() + id + "/");
                        dto.setPath(dto.getPath() + id + "/");
                        dto.setConstructionTaskId(id);
                        constructionTaskDAO.updateObject(bo);
                        if (dto.getWorkItemId() != null)
                            insertTaskByWorkItem("1", dto.getWorkItemId(), dto);

                    } else {
                        dto.setLevelId(3L);
                        dto.setMonth(obj.getMonth());
                        dto.setSysGroupId(obj.getSysGroupId());
                        dto.setYear(obj.getYear());
                        dto.setType("1");
                        dto.setDetailMonthPlanId(detailMonthPlanId);
                        dto.setPerformerWorkItemId(dto.getPerformerId());
                        dto.setUpdatedDate(new Date());
                        dto.setUpdatedUserId(user.getVpsUserInfo().getSysUserId());
                        dto.setUpdatedGroupId(user.getVpsUserInfo().getSysGroupId());
                        constructionTaskDAO.updateObject(dto.toModel());
                        detailMonthPlanDAO.updatePerforment(dto.getPerformerId(), dto.getWorkItemId());

                    }
                }
            }
        }
    }

    public void updateListHSHC(DetailMonthPlanSimpleDTO obj, KttsUserSession user) {
        Long detailMonthPlanId = obj.getDetailMonthPlanId();
        if ("1".equalsIgnoreCase(obj.getIsHSHCImport())) {
            // neu import thi xoa het ban ghi type 2 vao them moi
            constructionTaskDAO.deleteConstructionTaskByType("2", detailMonthPlanId);
            constructionTaskDAO.getSession().flush();
            if (obj.getListHSHC() != null && !obj.getListHSHC().isEmpty()) {
                ConstructionTaskDetailDTO parent = new ConstructionTaskDetailDTO();
                getParentTask(parent, "1", detailMonthPlanId, obj.getSysGroupId(), obj);
                for (ConstructionTaskDetailDTO dto : obj.getListHSHC()) {
                    // dto.setPerformerId(getSysId(listSys,dto.getPerformerName()));
                    dto.setMonth(obj.getMonth());
                    dto.setSysGroupId(obj.getSysGroupId());
                    dto.setYear(obj.getYear());
                    dto.setType("2");
                    dto.setDetailMonthPlanId(detailMonthPlanId);
                    dto.setLevelId(4L);
                    dto.setTaskName("Làm HSHC cho công trình " + dto.getConstructionCode());
                    dto.setParentId(parent.getConstructionTaskId());
                    dto.setCreatedDate(new Date());
                    dto.setCreatedUserId(user.getVpsUserInfo().getSysUserId());
                    dto.setCreatedGroupId(user.getVpsUserInfo().getSysGroupId());
                    dto.setBaselineStartDate(dto.getStartDate());
                    dto.setBaselineEndDate(dto.getEndDate());
                    dto.setStatus("1");
                    dto.setCompleteState("1");
//                    if (dto.getSupervisorId() == null)
//                        dto.setSupervisorId(
//                                Double.parseDouble(constructionTaskDAO.getSuperVisorId(dto.getConstructionCode())));
//                    if (dto.getDirectorId() == null)
//                        dto.setDirectorId(
//                                Double.parseDouble(constructionTaskDAO.getDirectorId(dto.getConstructionCode())));
                    dto.setPerformerWorkItemId(dto.getPerformerId());
                    ConstructionTaskBO bo = dto.toModel();
                    Long id = constructionTaskDAO.saveObject(bo);
                    bo.setPath(parent.getPath() + id + "/");
                    constructionTaskDAO.updateObject(bo);
                    // chinhpxn20180718_start
                    constructionTaskBusinessImpl.createSendSmsEmail(dto, user);
                    // chinhpxn20180718_end
                }

                // hoanm1_20181001_start_comment
//                Long count = -1L;
//                HashMap<String, Long> taskCountMap = new HashMap<String, Long>();
//                for (ConstructionTaskDetailDTO dto : obj.getListHSHC()) {
//                    count = taskCountMap.get(dto.getPerformerId().toString());
//                    if (count != null && count != -1L) {
//                        count++;
//                        taskCountMap.put(dto.getPerformerId().toString(), count);
//                    } else {
//                        taskCountMap.put(dto.getPerformerId().toString(), 1L);
//                    }
//                }
//                HashMap<String, Long> checkDupMap = new HashMap<String, Long>();
//                List<ConstructionTaskDetailDTO> smsLst = new ArrayList<ConstructionTaskDetailDTO>();
//                for (ConstructionTaskDetailDTO dto : obj.getListHSHC()) {
//                    String key = dto.getPerformerId().toString();
//                    if (checkDupMap.get(key) == null) {
//                        checkDupMap.put(key, taskCountMap.get(key));
//                        ConstructionTaskDetailDTO newObj = new ConstructionTaskDetailDTO();
//                        newObj.setPerformerId(dto.getPerformerId());
//                        newObj.setTaskCount(taskCountMap.get(key));
//                        newObj.setType(dto.getType());
//                        smsLst.add(newObj);
//                    } else {
//                        continue;
//                    }
//                }
//                for (ConstructionTaskDetailDTO smsObj : smsLst) {
//                    detailMonthPlanDAO.createSendSmsEmail(smsObj, user);
//                }

                // hoanm1_20181001_end_comment

            }
        } else {
            if (obj.getListConstrTaskIdDelete() != null && obj.getListConstrTaskIdDelete().size() > 0) {
                for (String id : obj.getListConstrTaskIdDelete()) {
                    constructionTaskDAO.deleteParentAndChild(id);
                    constructionTaskDAO.getSession().flush();
                }

            }
            if (obj.getListHSHC() != null && !obj.getListHSHC().isEmpty()) {
                ConstructionTaskDetailDTO parent = new ConstructionTaskDetailDTO();
                getParentTask(parent, "1", detailMonthPlanId, obj.getSysGroupId(), obj);
                for (ConstructionTaskDetailDTO dto : obj.getListHSHC()) {
                    if (dto.getConstructionTaskId() == null) {
                        dto.setMonth(obj.getMonth());
                        dto.setSysGroupId(obj.getSysGroupId());
                        dto.setYear(obj.getYear());
                        dto.setType("2");
                        dto.setDetailMonthPlanId(detailMonthPlanId);
                        dto.setLevelId(4L);
                        dto.setTaskName("Làm HSHC cho công trình " + dto.getConstructionCode());
                        dto.setParentId(parent.getConstructionTaskId());
                        dto.setCreatedDate(new Date());
                        dto.setCreatedUserId(user.getVpsUserInfo().getSysUserId());
                        dto.setCreatedGroupId(user.getVpsUserInfo().getSysGroupId());
                        dto.setBaselineStartDate(dto.getStartDate());
                        dto.setBaselineEndDate(dto.getEndDate());
                        dto.setStatus("1");
                        dto.setCompleteState("1");
//                        if (dto.getSupervisorId() == null)
//                            dto.setSupervisorId(
//                                    Double.parseDouble(constructionTaskDAO.getSuperVisorId(dto.getConstructionCode())));
//                        if (dto.getDirectorId() == null)
//                            dto.setDirectorId(
//                                    Double.parseDouble(constructionTaskDAO.getDirectorId(dto.getConstructionCode())));
                        dto.setPerformerWorkItemId(dto.getPerformerId());
                        ConstructionTaskBO bo = dto.toModel();
                        Long id = constructionTaskDAO.saveObject(bo);
                        bo.setPath(parent.getPath() + id + "/");
                        constructionTaskDAO.updateObject(bo);
                    } else {
                        dto.setMonth(obj.getMonth());
                        dto.setSysGroupId(obj.getSysGroupId());
                        dto.setYear(obj.getYear());
                        dto.setType("2");
                        dto.setDetailMonthPlanId(detailMonthPlanId);
                        dto.setLevelId(4L);
                        dto.setUpdatedDate(new Date());
                        dto.setUpdatedUserId(user.getVpsUserInfo().getSysUserId());
                        dto.setUpdatedGroupId(user.getVpsUserInfo().getSysGroupId());
                        constructionTaskDAO.updateObject(dto.toModel());
                    }
                }

            }
        }
    }

    public void updateListLDT(DetailMonthPlanSimpleDTO obj, KttsUserSession user) {
        // List<ConstructionDetailDTO> listConstruction = listConstruction();
        Long detailMonthPlanId = obj.getDetailMonthPlanId();
        if ("1".equalsIgnoreCase(obj.getIsLDTImport())) {
            constructionTaskDAO.deleteConstructionTaskByType("3", detailMonthPlanId);
            constructionTaskDAO.getSession().flush();
            if (obj.getListLDT() != null && !obj.getListLDT().isEmpty()) {
                ConstructionTaskDetailDTO parent = new ConstructionTaskDetailDTO();
                getParentTask(parent, "1", detailMonthPlanId, obj.getSysGroupId(), obj);
                for (ConstructionTaskDetailDTO dto : obj.getListLDT()) {
                    dto.setMonth(obj.getMonth());
                    dto.setSysGroupId(obj.getSysGroupId());
                    dto.setYear(obj.getYear());
                    dto.setType("3");
                    dto.setDetailMonthPlanId(detailMonthPlanId);
                    dto.setLevelId(4L);
                    // chinhpxn20180621
                    if (dto.getTaskOrder().equalsIgnoreCase("2")) {
                        dto.setTaskName("Lên doanh thu cho công trình " + dto.getConstructionCode());
                    } else {
                        dto.setTaskName("Tạo đề nghị quyết toán cho công trình " + dto.getConstructionCode());
                    }
                    // chinhpxn20180621
                    dto.setParentId(parent.getConstructionTaskId());
                    dto.setCreatedDate(new Date());
                    dto.setCreatedUserId(user.getVpsUserInfo().getSysUserId());
                    dto.setCreatedGroupId(user.getVpsUserInfo().getSysGroupId());
                    dto.setBaselineStartDate(dto.getStartDate());
                    dto.setBaselineEndDate(dto.getEndDate());
                    dto.setStatus("1");
                    dto.setCompleteState("1");
//                    if (dto.getSupervisorId() == null)
//                        dto.setSupervisorId(
//                                Double.parseDouble(constructionTaskDAO.getSuperVisorId(dto.getConstructionCode())));
//                    if (dto.getDirectorId() == null)
//                        dto.setDirectorId(
//                                Double.parseDouble(constructionTaskDAO.getDirectorId(dto.getConstructionCode())));
                    dto.setPerformerWorkItemId(dto.getPerformerId());
                    ConstructionTaskBO bo = dto.toModel();
                    Long id = constructionTaskDAO.saveObject(bo);
                    bo.setPath(parent.getPath() + id + "/");
                    constructionTaskDAO.updateObject(bo);
                    // chinhpxn20180718_start
                    constructionTaskBusinessImpl.createSendSmsEmail(dto, user);
                    // chinhpxn20180718_end
                }

               // hoanm1_20181001_start_comment
//                Long count = -1L;
//                HashMap<String, Long> taskCountMap = new HashMap<String, Long>();
//                for (ConstructionTaskDetailDTO dto : obj.getListLDT()) {
//                    count = taskCountMap.get(dto.getPerformerId().toString());
//                    if (count != null && count != -1L) {
//                        count++;
//                        taskCountMap.put(dto.getPerformerId().toString(), count);
//                    } else {
//                        taskCountMap.put(dto.getPerformerId().toString(), 1L);
//                    }
//                }
//                HashMap<String, Long> checkDupMap = new HashMap<String, Long>();
//                List<ConstructionTaskDetailDTO> smsLst = new ArrayList<ConstructionTaskDetailDTO>();
//                for (ConstructionTaskDetailDTO dto : obj.getListLDT()) {
//                    String key = dto.getPerformerId().toString();
//                    if (checkDupMap.get(key) == null) {
//                        checkDupMap.put(key, taskCountMap.get(key));
//                        ConstructionTaskDetailDTO newObj = new ConstructionTaskDetailDTO();
//                        newObj.setPerformerId(dto.getPerformerId());
//                        newObj.setTaskCount(taskCountMap.get(key));
//                        newObj.setType(dto.getType());
//                        smsLst.add(newObj);
//                    } else {
//                        continue;
//                    }
//                }
//                for (ConstructionTaskDetailDTO smsObj : smsLst) {
//                    detailMonthPlanDAO.createSendSmsEmail(smsObj, user);
//                }

                // hoanm1_20181001_end_comment
            }
        } else {
            if (obj.getListConstrTaskIdDelete() != null && obj.getListConstrTaskIdDelete().size() > 0) {
                for (String id : obj.getListConstrTaskIdDelete()) {
                    constructionTaskDAO.deleteParentAndChild(id);
                    constructionTaskDAO.getSession().flush();
                }

            }
            if (obj.getListLDT() != null && !obj.getListLDT().isEmpty()) {
                ConstructionTaskDetailDTO parent = new ConstructionTaskDetailDTO();
                getParentTask(parent, "3", detailMonthPlanId, obj.getSysGroupId(), obj);
                for (ConstructionTaskDetailDTO dto : obj.getListLDT()) {
                    if (dto.getConstructionTaskId() == null) {
                        // dto.setPerformerId(getSysId(listSys,dto.getPerformerName()));
                        dto.setMonth(obj.getMonth());
                        dto.setSysGroupId(obj.getSysGroupId());
                        dto.setYear(obj.getYear());
                        dto.setType("3");
                        dto.setDetailMonthPlanId(detailMonthPlanId);
                        dto.setLevelId(4L);
                        dto.setTaskName("Lên doanh thu cho công trình " + dto.getConstructionCode());
                        dto.setParentId(parent.getConstructionTaskId());
                        dto.setCreatedDate(new Date());
                        dto.setCreatedUserId(user.getVpsUserInfo().getSysUserId());
                        dto.setCreatedGroupId(user.getVpsUserInfo().getSysGroupId());
                        ConstructionTaskBO bo = dto.toModel();
                        dto.setBaselineStartDate(dto.getStartDate());
                        dto.setBaselineEndDate(dto.getEndDate());
//                        if (dto.getSupervisorId() == null)
//                            dto.setSupervisorId(
//                                    Double.parseDouble(constructionTaskDAO.getSuperVisorId(dto.getConstructionCode())));
//                        if (dto.getDirectorId() == null)
//                            dto.setDirectorId(
//                                    Double.parseDouble(constructionTaskDAO.getDirectorId(dto.getConstructionCode())));
                        dto.setPerformerWorkItemId(dto.getPerformerId());
                        Long id = constructionTaskDAO.saveObject(bo);
                        bo.setPath(parent.getPath() + id + "/");
                        constructionTaskDAO.updateObject(bo);
                    } else {
                        dto.setMonth(obj.getMonth());
                        dto.setSysGroupId(obj.getSysGroupId());
                        dto.setYear(obj.getYear());
                        dto.setType("3");
                        dto.setUpdatedDate(new Date());
                        dto.setUpdatedUserId(user.getVpsUserInfo().getSysUserId());
                        dto.setUpdatedGroupId(user.getVpsUserInfo().getSysGroupId());
                        constructionTaskDAO.update(dto.toModel());
                    }
                }
            }
        }
    }

    public void updateListDT(DetailMonthPlanSimpleDTO obj, KttsUserSession user) {
        Long detailMonthPlanId = obj.getDetailMonthPlanId();
        if ("1".equalsIgnoreCase(obj.getIsDTImport())) {
            constructionTaskDAO.deleteConstructionTaskByType("5", detailMonthPlanId);
            for (ConstructionTaskDetailDTO dto : obj.getListDT()) {
                dto.setMonth(obj.getMonth());
                dto.setSysGroupId(obj.getSysGroupId());
                dto.setYear(obj.getYear());
                dto.setType("5");
                dto.setDetailMonthPlanId(detailMonthPlanId);
                dto.setCreatedDate(new Date());
                dto.setCreatedUserId(user.getVpsUserInfo().getSysUserId());
                dto.setCreatedGroupId(user.getVpsUserInfo().getSysGroupId());
                constructionTaskDAO.saveObject(dto.toModel());
            }
        } else {
//			chinhpxn_20180710_start
            if (obj.getConstructionIdLst() != null && obj.getConstructionIdLst().size() > 0) {
                constructionTaskDAO.removeConstrTaskDT(obj.getConstructionIdLst(), obj.getDetailMonthPlanId());
            }
//			chinhpxn_20180710_end
//			if (obj.getListConstrTaskIdDelete() != null
//					&& obj.getListConstrTaskIdDelete().size() > 0) {
//				constructionTaskDAO.removeByListId(obj
//						.getListConstrTaskIdDelete());
//			}
            // List<ConstructionDetailDTO> listConstruction =
            // listConstruction();
            // for (ConstructionTaskDetailDTO dto : obj.getListDT()) {
            // if (dto.getConstructionTaskId() == null) {
            // dto.setMonth(obj.getMonth());
            // dto.setSysGroupId(obj.getSysGroupId());
            // dto.setYear(obj.getYear());
            // dto.setType("5");
            // dto.setDetailMonthPlanId(detailMonthPlanId);
            // constructionTaskDAO.saveObject(dto.toModel());
            // } else {
            // dto.setMonth(obj.getMonth());
            // dto.setSysGroupId(obj.getSysGroupId());
            // dto.setYear(obj.getYear());
            // dto.setType("5");
            // dto.setDetailMonthPlanId(detailMonthPlanId);
            // constructionTaskDAO.update(dto.toModel());
            // }
            // }
        }
    }

    public void updateListCVK(DetailMonthPlanSimpleDTO obj, KttsUserSession user) {
        Long detailMonthPlanId = obj.getDetailMonthPlanId();
        if ("1".equalsIgnoreCase(obj.getIsCVKImport())) {
            constructionTaskDAO.deleteConstructionTaskByType("6", detailMonthPlanId);
            if (obj.getListCVK() != null && !obj.getListCVK().isEmpty()) {
                ConstructionTaskDetailDTO parent = new ConstructionTaskDetailDTO();
                getParentTaskForCVK(parent, "1", detailMonthPlanId, obj.getSysGroupId());
                for (ConstructionTaskDetailDTO dto : obj.getListCVK()) {
                    dto.setMonth(obj.getMonth());
                    dto.setSysGroupId(obj.getSysGroupId());
                    dto.setYear(obj.getYear());
                    dto.setType("6");
                    dto.setLevelId(4L);
                    dto.setDetailMonthPlanId(detailMonthPlanId);
                    dto.setParentId(parent.getConstructionTaskId());
                    dto.setCreatedDate(new Date());
                    dto.setCreatedUserId(user.getVpsUserInfo().getSysUserId());
                    dto.setCreatedGroupId(user.getVpsUserInfo().getSysGroupId());
                    dto.setBaselineStartDate(dto.getStartDate());
                    dto.setBaselineEndDate(dto.getEndDate());
                    dto.setStatus("1");
                    dto.setCompleteState("1");
                    ConstructionTaskBO bo = dto.toModel();
                    Long id = constructionTaskDAO.saveObject(bo);
                    bo.setPath(parent.getPath() + id + "/");
                    constructionTaskDAO.updateObject(bo);
                    // chinhpxn20180718_start
                    constructionTaskBusinessImpl.createSendSmsEmail(dto, user);
                    // chinhpxn20180718_end
                }

                // hoanm1_20181001_start_comment
//                Long count = -1L;
//                HashMap<String, Long> taskCountMap = new HashMap<String, Long>();
//                for (ConstructionTaskDetailDTO dto : obj.getListCVK()) {
//                    count = taskCountMap.get(dto.getPerformerId().toString());
//                    if (count != null && count != -1L) {
//                        count++;
//                        taskCountMap.put(dto.getPerformerId().toString(), count);
//                    } else {
//                        taskCountMap.put(dto.getPerformerId().toString(), 1L);
//                    }
//                }
//                HashMap<String, Long> checkDupMap = new HashMap<String, Long>();
//                List<ConstructionTaskDetailDTO> smsLst = new ArrayList<ConstructionTaskDetailDTO>();
//                for (ConstructionTaskDetailDTO dto : obj.getListCVK()) {
//                    String key = dto.getPerformerId().toString();
//                    if (checkDupMap.get(key) == null) {
//                        checkDupMap.put(key, taskCountMap.get(key));
//                        ConstructionTaskDetailDTO newObj = new ConstructionTaskDetailDTO();
//                        newObj.setPerformerId(dto.getPerformerId());
//                        newObj.setTaskCount(taskCountMap.get(key));
//                        newObj.setType(dto.getType());
//                        smsLst.add(newObj);
//                    } else {
//                        continue;
//                    }
//                }
//                for (ConstructionTaskDetailDTO smsObj : smsLst) {
//                    detailMonthPlanDAO.createSendSmsEmail(smsObj, user);
//                }

//                hoanm1_20181001_end_comment
            }
        } else {
            if (obj.getListConstrTaskIdDelete() != null && obj.getListConstrTaskIdDelete().size() > 0) {
                for (String id : obj.getListConstrTaskIdDelete()) {
                    constructionTaskDAO.deleteParentAndChild(id);
                    constructionTaskDAO.getSession().flush();
                }
            }
            // if (obj.getListCVK() != null && !obj.getListCVK().isEmpty()) {
            // ConstructionTaskDetailDTO parent = new
            // ConstructionTaskDetailDTO();
            // getParentTaskForCVK(parent, detailMonthPlanId,
            // obj.getSysGroupId());
            // for (ConstructionTaskDetailDTO dto : obj.getListCVK()) {
            // if (dto.getConstructionTaskId() == null) {
            // dto.setMonth(obj.getMonth());
            // dto.setSysGroupId(obj.getSysGroupId());
            // dto.setYear(obj.getYear());
            // dto.setType("6");
            // dto.setLevelId(2L);
            // dto.setDetailMonthPlanId(detailMonthPlanId);
            // dto.setParentId(parent.getConstructionTaskId());
            // ConstructionTaskBO bo = dto.toModel();
            // Long id = constructionTaskDAO.saveObject(bo);
            // bo.setPath(parent.getPath() + id + "/");
            // constructionTaskDAO.updateObject(bo);
            // } else {
            // dto.setMonth(obj.getMonth());
            // dto.setSysGroupId(obj.getSysGroupId());
            // dto.setYear(obj.getYear());
            // dto.setType("6");
            // dto.setLevelId(2L);
            // constructionTaskDAO.update(dto.toModel());
            // }
            // }
            //
            // }
        }
    }

    public void remove(DetailMonthPlanSimpleDTO obj) {
        detailMonthPlanDAO.remove(obj.getDetailMonthPlanId());

    }
//    hungtd_20181213_start
    public void updateRegistry(DetailMonthPlanSimpleDTO obj) {
        detailMonthPlanDAO.updateRegistry(obj.getDetailMonthPlanId());

    }
//    hungtd_20181213_end

    public Long getSequence() {
        // TODO Auto-generated method stub
        return detailMonthPlanDAO.getSequence();
    }

    public String exportTemplateListTC(Long sysGroupId, HttpServletRequest request) throws Exception {
        String folderParam = defaultSubFolderUpload;
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Import_thicong_thang_chitiet.xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE,
                Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        file.close();
        Calendar cal = Calendar.getInstance();
        String uploadPath = folder2Upload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
                + File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
                + File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
                + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
                + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        File udir = new File(uploadPath);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        OutputStream outFile = new FileOutputStream(
                udir.getAbsolutePath() + File.separator + "Import_thicong_thang_chitiet.xlsx");

//		chinhpxn20180705_start
//		List<WorkItemDetailDTO> listWorkItems = workItemDAO.getWorkForTC(sysGroupId);
//		chinhpxn20180705_end
        List<SysUserCOMSDTO> listUser = sysUserCOMSDAO.usersFillter(groupIdList);
        List<WorkItemDTO> listSheet3 = workItemDAO.GetListData();
        XSSFSheet sheet = workbook.getSheetAt(0);
//		chinhpxn20180705_start
//		fillSheet1(sheet, listWorkItems);
//		chinhpxn20180705_end
        sheet = workbook.getSheetAt(1);
        fillSheet2(sheet, listUser);
        sheet = workbook.getSheetAt(2);
        fillSheet3(sheet, listSheet3);
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        String path = UEncrypt
                .encryptFileUploadPath(uploadPathReturn + File.separator + "Import_thicong_thang_chitiet.xlsx");
        return path;
    }

    private void fillSheet3(XSSFSheet sheet, List<WorkItemDTO> listSheet3) {
        if (listSheet3 != null && !listSheet3.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            int i = 1;
            for (WorkItemDTO dto : listSheet3) {
                Row row = sheet.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (i - 1));
                cell.setCellStyle(style);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getName()) ? dto.getName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getCode()) ? dto.getCode() : "");
                cell.setCellStyle(style);
            }
        }
    }

    private void fillSheet1(XSSFSheet sheet, List<WorkItemDetailDTO> listWorkItems) {
        if (listWorkItems != null && !listWorkItems.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            XSSFCellStyle styleCurrency = ExcelUtils.styleCurrency(sheet);
            int i = 3;
            for (WorkItemDetailDTO dto : listWorkItems) {
                Row row = sheet.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (i - 3));
                cell.setCellStyle(style);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getProvinceCode()) ? dto.getProvinceCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getCatStationCode()) ? dto.getCatStationCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(3, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getConstructionCode()) ? dto.getConstructionCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(4, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getName()) ? dto.getName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(5, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getCntContract()) ? dto.getCntContract() : "");
                cell.setCellStyle(style);
                cell = row.createCell(6, CellType.NUMERIC);
                cell.setCellValue(dto.getQuantity() != null ? dto.getQuantity() : 0);
                cell.setCellStyle(styleCurrency);
                for (int j = 7; j < 15; j++) {
                    cell = row.createCell(j, CellType.STRING);
                    cell.setCellValue("");
                    cell.setCellStyle(style);
                }

            }
        }
    }

    private void fillSheet2(XSSFSheet sheet, List<SysUserCOMSDTO> listUser) {
        if (listUser != null && !listUser.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            int i = 1;
            for (SysUserCOMSDTO dto : listUser) {
                Row row = sheet.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (i - 1));
                cell.setCellStyle(style);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getEmployeeCode()) ? dto.getEmployeeCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getLoginName()) ? dto.getLoginName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(3, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getFullName()) ? dto.getFullName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(4, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getEmail()) ? dto.getEmail() : "");
                cell.setCellStyle(style);
                cell = row.createCell(5, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getSysGroupName()) ? dto.getSysGroupName() : "");
                cell.setCellStyle(style);

            }
        }
    }

    public List<ConstructionTaskDetailDTO> importTC(String fileInput, String filePath) throws Exception {
    	
        List<ConstructionTaskDetailDTO> workLst = new ArrayList<ConstructionTaskDetailDTO>();
        File f = new File(fileInput);
        XSSFWorkbook workbook = new XSSFWorkbook(f);
        XSSFSheet sheet = workbook.getSheetAt(0);
        DataFormatter formatter = new DataFormatter();
        DecimalFormat df = new DecimalFormat("#.###");
        DecimalFormat longf = new DecimalFormat("#");
        boolean isExistError = false;
        int count = 0;
        for (Row row : sheet) {
            count++;
            if (count > 3 && !ValidateUtils.checkIfRowIsEmpty(row)) {
                boolean checkColumn3 = true;
                boolean checkColumn4 = true;
                boolean checkColumn6 = true;
                boolean checkColumn11 = true;
                boolean checkColumn12 = true;
                boolean checkColumn13 = true;
                boolean checkColumn14 = true;
                boolean checkLength = true;
                StringBuilder errorMesg = new StringBuilder();
                DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
                String constructionCode = "";
                ConstructionTaskDetailDTO newObj = new ConstructionTaskDetailDTO();
                for (int i = 0; i < 15; i++) {
                    Cell cell = row.getCell(i);
                    if (cell != null) {
                        if (cell.getColumnIndex() == 3) {
                            try {
                                constructionCode = formatter.formatCellValue(row.getCell(3)).trim();
                                ConstructionDetailDTO obj = constructionDAO.getConstructionByCode(constructionCode);
                                if (obj.getConstructionId() == null) {
                                    checkColumn3 = false;
                                }
                                newObj.setConstructionCode(obj.getCode());
                                newObj.setConstructionId(obj.getConstructionId());
                                newObj.setCatStationCode(obj.getCatStationCode());
                                newObj.setCatProvinceCode(obj.getCatProvince());
                                newObj.setConstructionName(obj.getName());
                                newObj.setProvinceName(obj.getProvinceName());
                            } catch (Exception e) {
                                checkColumn3 = false;
                            }
                            if (!checkColumn3) {
                                isExistError = true;
                                errorMesg.append("Mã công trình không hợp lệ!");
                            }

                        } else if (cell.getColumnIndex() == 4) {
                            try {
                                String name = formatter.formatCellValue(row.getCell(4));
                                WorkItemDetailDTO obj = workItemDAO.getWorkItemByCodeNew(name, constructionCode);
                                if (obj.getConstructionCode().equals(constructionCode)) {
//                                	hoanm1_20190102_start
                                	if(obj.getStatus().equals("3")){
                                		checkColumn4 = false;
                                        isExistError = true;
                                        errorMesg.append("\nHạng mục đã được hoàn thành trong các tháng trước!");
                                	}else{
                                    newObj.setWorkItemId(obj.getWorkItemId());
                                    newObj.setWorkItemName(obj.getName());
                                    newObj.setWorkItemCode(obj.getCode());
                                	}
//                                	hoanm1_20190102_end
                                } else {
                                    checkColumn4 = false;
                                    isExistError = true;
                                    errorMesg.append("\nHạng mục không thuộc công trình!");
                                }
                            } catch (Exception e) {
                                checkColumn4 = false;
                            }
                            if (!checkColumn4) {
                                isExistError = true;
                                errorMesg.append("\nChưa nhập hạng mục hoặc tên hạng mục không tồn tại!");
                            }

                        } else if (cell.getColumnIndex() == 7) {
                            if (row.getCell(7) != null) {
                                newObj.setSourceType("1");
                            } else {
                                newObj.setSourceType("2");
                            }

                        } else if (cell.getColumnIndex() == 9) {
                            if (row.getCell(9) != null) {
                                newObj.setDeployType("1");
                            } else {
                                newObj.setDeployType("2");
                            }

                        } else if (cell.getColumnIndex() == 6) {
                            try {
                                Double quantity = new Double(cell.getNumericCellValue() * 1000000);
                                newObj.setQuantity(quantity);
                            } catch (Exception e) {
                                checkColumn6 = false;
                            }
                            if (!checkColumn6) {
                                isExistError = true;
                                errorMesg.append("\nGiá trị không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 11) {
                            try {
                                String name = formatter.formatCellValue(row.getCell(11)).trim();
                                DepartmentDTO obj = detailMonthPlanDAO.getSysUser(name);
                                newObj.setPerformerId(obj.getDepartmentId());
                                newObj.setPerformerName(obj.getName());
                            } catch (Exception e) {
                                checkColumn11 = false;
                            }
                            if (!checkColumn11) {
                                isExistError = true;
                                errorMesg.append("\nNgười thực hiện không tồn tại!");
                            }

                        } else if (cell.getColumnIndex() == 12) {
                            try {

                                Date startDate = dateFormat.parse(formatter.formatCellValue(row.getCell(12)));
                                if(validateDate(formatter.formatCellValue(row.getCell(12)))){
                                	newObj.setStartDate(startDate);
                                }else{ 
                                	checkColumn12 = false;
                                }                                
                            } catch (Exception e) {
                                checkColumn12 = false;
                            }
                            if (!checkColumn12) {
                                isExistError = true;
                                errorMesg.append("\nNgày bắt đầu không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 13) {
                            try {
                                Date endDate = dateFormat.parse(formatter.formatCellValue(row.getCell(13)));
                                if(validateDate(formatter.formatCellValue(row.getCell(13)))){
                                	newObj.setEndDate(endDate);
                                }else{ 
                                	checkColumn13 = false;
                                }  
                            } catch (Exception e) {
                                checkColumn13 = false;
                            }
                            if (!checkColumn13) {
                                isExistError = true;
                                errorMesg.append("\nNgày kết thúc không hợp lệ!");
                            }

                        } else if (cell.getColumnIndex() == 14) {
                            try {
                                String descriptionTC = formatter.formatCellValue(cell).trim();
                                if (descriptionTC.length() <= 1000) {
                                    newObj.setDescription(descriptionTC);
                                } else {
                                    checkColumn14 = false;
                                    isExistError = true;
                                }

                            } catch (Exception e) {
                                checkColumn14 = false;
                            }
                            if (!checkColumn14) {
                                isExistError = true;
                                errorMesg.append("\nGhi chú vượt quá 1000 ký tự!");
                            }
                            Cell cell1 = row.createCell(15);
                            cell1.setCellValue(errorMesg.toString());
                        }
                        Cell cell1 = row.createCell(15);
                        cell1.setCellValue(errorMesg.toString());
                    }
                }
                if (!isExistError) {
                    newObj.setSourceType(formatter.formatCellValue(row.getCell(7)).equals("1") ? "1" : "2");
                    newObj.setDeployType(formatter.formatCellValue(row.getCell(9)).equals("1") ? "1" : "2");
                    newObj.setCntContract(formatter.formatCellValue(row.getCell(5)) != null
                            ? formatter.formatCellValue(row.getCell(5))
                            : "");
                    detailMonthPlanDAO.updatePerforment(newObj.getPerformerId(), newObj.getWorkItemId());
                    workLst.add(newObj);
                }

            }
        }
        if (isExistError) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            style.setAlignment(HorizontalAlignment.CENTER);
            style.setVerticalAlignment(VerticalAlignment.CENTER);
           
            Cell cell = sheet.getRow(1).createCell(15);
            cell.setCellValue("Cột lỗi");
            cell.setCellStyle(style);
            cell = sheet.getRow(2).createCell(15);
            cell.setCellStyle(style);
//          sheet.addMergedRegion(new CellRangeAddress(1, 2, 15, 15));
            ConstructionTaskDetailDTO objErr = new ConstructionTaskDetailDTO();
            OutputStream out = new FileOutputStream(f, true);
            workbook.write(out);
            out.close();
            objErr.setErrorFilePath(UEncrypt.encryptFileUploadPath(filePath));
            workLst.add(objErr);
        }
        workbook.close();
        return workLst;
    }

    public List<TmpnTargetDetailDTO> getYearPlanDetailTarget(DetailMonthPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
        return detailMonthPlanDAO.getYearPlanDetailTarget(obj);

    }

    public List<WorkItemDetailDTO> getWorkItemDetail(DetailMonthPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
        return detailMonthPlanDAO.getWorkItemDetail(obj);

    }

    public String exportTemplateListHSHC(Long sysGroupId, HttpServletRequest request) throws Exception {
        String folderParam = defaultSubFolderUpload;
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Import_HSHC_thang_chitiet.xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        file.close();
        Calendar cal = Calendar.getInstance();
        String uploadPath = folder2Upload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
                + File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
                + File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
                + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
                + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        File udir = new File(uploadPath);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        OutputStream outFile = new FileOutputStream(
                udir.getAbsolutePath() + File.separator + "Import_HSHC_thang_chitiet.xlsx");
//		chinhpxn20180705_start
//		List<ConstructionDetailDTO> listConstr = constructionDAO
//		chinhpxn20180705_end
//				.getConstructionForHSHC(sysGroupId);
        XSSFSheet sheet = workbook.getSheetAt(0);
//		chinhpxn20180705_start
//		fillSheetHSHC(sheet, listConstr);
//		chinhpxn20180705_end
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.CREATE,
                Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        List<SysUserCOMSDTO> listUser = sysUserCOMSDAO.usersFillter(groupIdList);
        sheet = workbook.getSheetAt(1);
        fillSheet2(sheet, listUser);
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        String path = UEncrypt
                .encryptFileUploadPath(uploadPathReturn + File.separator + "Import_HSHC_thang_chitiet.xlsx");
        return path;
    }

    private void fillSheetHSHC(XSSFSheet sheet, List<ConstructionDetailDTO> listConstr) {
        DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        if (listConstr != null && !listConstr.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            XSSFCellStyle styleCurrency = ExcelUtils.styleCurrency(sheet);
            XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
            int i = 2;
            for (ConstructionDetailDTO dto : listConstr) {
                Row row = sheet.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (i - 2));
                cell.setCellStyle(style);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getProvinceCode()) ? dto.getProvinceCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getCatStationCode()) ? dto.getCatStationCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(3, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getCode()) ? dto.getCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(4, CellType.STRING);
                cell.setCellValue(
                        StringUtils.isNotEmpty(dto.getCatContructionTypeName()) ? dto.getCatContructionTypeName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(5, CellType.STRING);
                cell.setCellValue((dto.getIsObstructed() != null && dto.getIsObstructed().equals("1")) ? "Có" : "");
                cell.setCellStyle(style);
                cell = row.createCell(6, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getCntContract()) ? dto.getCntContract() : "");
                cell.setCellStyle(style);
                cell = row.createCell(7, CellType.NUMERIC);
                cell.setCellValue((dto.getQuantity() != null) ? dto.getQuantity() : 0);
                cell.setCellStyle(styleCurrency);
                cell = row.createCell(8, CellType.STRING);
                cell.setCellValue((dto.getCompleteDate() != null) ? dateFormat.format(dto.getCompleteDate()) : "");
                cell.setCellStyle(styleDate);
                for (int j = 9; j < 13; j++) {
                    cell = row.createCell(j, CellType.STRING);
                    cell.setCellValue("");
                    cell.setCellStyle(style);
                }
            }
        }
    }

    public List<ConstructionTaskDetailDTO> importHSHC(String fileInput, String filePath) throws Exception {
        List<ConstructionTaskDetailDTO> workLst = new ArrayList<ConstructionTaskDetailDTO>();
        File f = new File(fileInput);
        XSSFWorkbook workbook = new XSSFWorkbook(f);
        XSSFSheet sheet = workbook.getSheetAt(0);
        DataFormatter formatter = new DataFormatter();
        DecimalFormat df = new DecimalFormat("#.###");
        DecimalFormat longf = new DecimalFormat("#");
        boolean isExistError = false;
        int count = 0;
        ArrayList<ConstructionTaskDetailDTO> constructionCodeMaps = new ArrayList<ConstructionTaskDetailDTO>(); //Huypq-20190211-add
        for (Row row : sheet) {
            count++;
            if (count > 2 && !ValidateUtils.checkIfRowIsEmpty(row)) {
                boolean checkColumn2 = true;
                boolean checkColumn6 = true;
                boolean checkColumn8 = true;
                boolean checkColumn9 = true;
                boolean checkColumn10 = true;
                boolean checkColumn11 = true;
                boolean checkColumn12 = true;
//                hoanm1_20181229_start
                boolean checkColumn5 = true;
                boolean checkContract = true;
                StringBuilder errorMesg = new StringBuilder();
                DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
                ConstructionTaskDetailDTO newObj = new ConstructionTaskDetailDTO();
                String code="";
                Map<String, ConstructionDetailDTO> constructionCntContractMap = constructionDAO.getConstructionCntContract();
//                hoanm1_20181229_end
                for (int i = 0; i < 13; i++) {
                    Cell cell = row.getCell(i);
                    if (cell != null) {
                        if (cell.getColumnIndex() == 3) {
                            try {
                                code = formatter.formatCellValue(row.getCell(3)).trim();
                                ConstructionDetailDTO obj = constructionDAO.getConstructionByCode(code);
                                newObj.setProvinceName(obj.getProvinceName());
                                newObj.setConstructionCode(obj.getCode());
                                newObj.setConstructionName(obj.getName());
                                newObj.setCatStationCode(obj.getCatStationCode());
                                newObj.setConstructionId(obj.getConstructionId());
                                newObj.setConstructionType(obj.getCatContructionTypeName());
                                newObj.setIsObstructedName("1".equals(obj.getIsObstructed()) ? "Có" : "");
                                constructionCodeMaps.add(newObj); //huypq-20190211-add
                            } catch (Exception e) {
                                checkColumn2 = false;
                            }
                            if (!checkColumn2) {
                                isExistError = true;
                                errorMesg.append("\nChưa nhập mã công trình hoặc bị sai");
                            }
                            //Huypq-20190211-start
                            if(constructionCodeMaps.size()>=2) {
                            	for(int k=0;k<constructionCodeMaps.size();k++) {
                                	for(int h=k+1;h<constructionCodeMaps.size();h++) {
                                		if((constructionCodeMaps.get(k).getConstructionCode().trim()).equals(constructionCodeMaps.get(h).getConstructionCode().trim())) {
                                			isExistError = true;
                                            errorMesg.append("\nMã công trình đã tồn tại trong file import");
                                		}
                                	}
                                }
                            }
                            //Huypq-end
                        } 
//                      hoanm1_20181229_start
                      else if (cell.getColumnIndex() == 5) {
                          try {
                          	if(!formatter.formatCellValue(cell).trim().isEmpty()){
                          		newObj.setWorkItemNameHSHC(formatter.formatCellValue(cell).trim());
                          	}else{
                          		checkColumn5 = false;
                          	}
                          } catch (Exception e) {
                        	  checkColumn5 = false;
                          }
							if (!checkColumn5) {
								isExistError = true;
								errorMesg
										.append("Hạng mục hoàn công không được để trống");
							}
                      }  
//                        hoanm1_20190109_start
//                      else if (cell.getColumnIndex() == 6) {
//                          try {
//                            		ConstructionDetailDTO obj = constructionCntContractMap.get(code);
//                            		if (obj == null) {
//                            			checkContract = false;	
//                            		}
//                            } catch (Exception e) {
//                            	checkContract = false;
//                            }
//  							if (!checkContract) {
//  								isExistError = true;
//  								errorMesg
//  										.append("Công trình chưa được gán hợp đồng");
//  							}
//                        } 
//                        hoanm1_20190109_end
                        else if (cell.getColumnIndex() == 7) {
                            try {
                                Double quantity = new Double(cell.getNumericCellValue() * 1000000);
                                newObj.setQuantity(quantity);
                            } catch (Exception e) {
                                checkColumn6 = false;
                            }
                            if (!checkColumn6) {
                                isExistError = true;
                                errorMesg.append("\nGiá trị không hợp lệ!");
                            }
                        } 
                        else if (cell.getColumnIndex() == 9) {
                            try {
                                String name = formatter.formatCellValue(cell).trim();
                                DepartmentDTO obj = detailMonthPlanDAO.getSysUser(name);
                                newObj.setPerformerId(obj.getDepartmentId());
                                newObj.setPerformerName(obj.getName());
                            } catch (Exception e) {
                                checkColumn9 = false;
                            }
                            if (!checkColumn9) {
                                isExistError = true;
                                errorMesg.append("\nSai tên đăng nhập!");
                            }

                        } else if (cell.getColumnIndex() == 10) {
                            try {
                             Date startDate = dateFormat.parse(formatter.formatCellValue(cell));
                             if(validateDate(formatter.formatCellValue(cell)))
                                	newObj.setStartDate(startDate);
                             else
                                	checkColumn10 = false;
                                
                            } catch (Exception e) {
                                checkColumn10 = false;
                            }
                            if (!checkColumn10) {
                                isExistError = true;
                                errorMesg.append("\nNgày bắt đầu không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 11) {
                            try {                                
                                Date endDate = dateFormat.parse(formatter.formatCellValue(cell));
                                if(validateDate(formatter.formatCellValue(cell)))
                                	newObj.setEndDate(endDate);
                                else
                                	checkColumn11 = false;
                            } catch (Exception e) {
                                checkColumn11 = false;
                            }
                            if (!checkColumn11) {
                                isExistError = true;
                                errorMesg.append("\nNgày kết thúc không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 12) {
                            try {
                                String descriptionHSHC = formatter.formatCellValue(cell).trim();
                                if (descriptionHSHC.length() <= 1000) {
                                    newObj.setDescription(descriptionHSHC);
                                } else {
                                    checkColumn12 = false;
                                    isExistError = true;
                                }

                            } catch (Exception e) {
                                checkColumn12 = false;
                            }
                            if (!checkColumn12) {
                                isExistError = true;
                                errorMesg.append("\nGhi chú vượt quá 1000 ký tự!");
                            }
                            Cell cell1 = row.createCell(13);
                            cell1.setCellValue(errorMesg.toString());

                        }
//                        hoanm1_20180912_start
                        Cell cell1 = row.createCell(13);
                        cell1.setCellValue(errorMesg.toString());
//                        hoanm1_20180912_end
                    }
                }
                if (!isExistError) {
                    newObj.setCntContract(formatter.formatCellValue(row.getCell(6)) != null
                            ? formatter.formatCellValue(row.getCell(6))
                            : "");
                    workLst.add(newObj);
                }

            }
        }
        if (isExistError) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            style.setAlignment(HorizontalAlignment.CENTER);
            style.setVerticalAlignment(VerticalAlignment.CENTER);
            Cell cell = sheet.getRow(1).createCell(13);
            cell.setCellValue("Cột lỗi");
            cell.setCellStyle(style);
            ConstructionTaskDetailDTO objErr = new ConstructionTaskDetailDTO();
            OutputStream out = new FileOutputStream(f, true);
            workbook.write(out);
            out.close();
            objErr.setErrorFilePath(UEncrypt.encryptFileUploadPath(filePath));
            workLst.add(objErr);
        }
        workbook.close();
        return workLst;
    }

    public String exportTemplateListLDT(Long sysGroupId, HttpServletRequest request) throws Exception {
        String folderParam = defaultSubFolderUpload;
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(
                new FileInputStream(filePath + "Import_doanhthu_thang_chitiet.xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        file.close();
        Calendar cal = Calendar.getInstance();
        DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        String uploadPath = folder2Upload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
                + File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
                + File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
                + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
                + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        File udir = new File(uploadPath);
        if (!udir.exists()) {
            udir.mkdirs();
        }

        OutputStream outFile = new FileOutputStream(
                udir.getAbsolutePath() + File.separator + "Import_doanhthu_thang_chitiet.xlsx");
//		chinhpxn20180705_start
//		List<ConstructionDetailDTO> listConstr = constructionDAO
//				.getConstructionForLDT(sysGroupId);
        XSSFSheet sheet = workbook.getSheetAt(0);
//		fillSheetLDT(sheet, listConstr);
//		chinhpxn20180705_end
        SysUserCOMSDTO obj = new SysUserCOMSDTO();
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        List<SysUserCOMSDTO> listUser = sysUserCOMSDAO.usersFillter(groupIdList);
        sheet = workbook.getSheetAt(1);
        fillSheet2(sheet, listUser);
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        String path = UEncrypt
                .encryptFileUploadPath(uploadPathReturn + File.separator + "Import_doanhthu_thang_chitiet.xlsx");
        return path;
    }

    private void fillSheetLDT(XSSFSheet sheet, List<ConstructionDetailDTO> listConstr) {
        DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        if (listConstr != null && !listConstr.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            XSSFCellStyle styleCurrency = ExcelUtils.styleCurrency(sheet);
            XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
            int i = 2;
            for (ConstructionDetailDTO dto : listConstr) {
                Row row = sheet.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (i - 2));
                cell.setCellStyle(style);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getCatProvince()) ? dto.getCatProvince() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getCatStationCode()) ? dto.getCatStationCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(3, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getCode()) ? dto.getCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(4, CellType.STRING);
                cell.setCellValue(
                        StringUtils.isNotEmpty(dto.getCatContructionTypeName()) ? dto.getCatContructionTypeName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(5, CellType.STRING);
                cell.setCellValue(StringUtils.isNotEmpty(dto.getCntContract()) ? dto.getCntContract() : "");
                cell.setCellStyle(style);
                cell = row.createCell(6, CellType.NUMERIC);
                cell.setCellValue((dto.getQuantity() != null) ? dto.getQuantity() : 0);
                cell.setCellStyle(styleCurrency);
                cell = row.createCell(7, CellType.STRING);
                cell.setCellValue((dto.getCompleteDate() != null) ? dateFormat.format(dto.getCompleteDate()) : "");
                cell.setCellStyle(styleDate);
                for (int j = 8; j < 12; j++) {
                    cell = row.createCell(j, CellType.STRING);
                    cell.setCellValue("");
                    cell.setCellStyle(style);
                }
            }
        }
    }

    public List<ConstructionTaskDetailDTO> importLDT(String fileInput, String filePath) throws Exception {
        List<ConstructionTaskDetailDTO> workLst = new ArrayList<ConstructionTaskDetailDTO>();
        File f = new File(fileInput);
        XSSFWorkbook workbook = new XSSFWorkbook(f);
        XSSFSheet sheet = workbook.getSheetAt(0);
        DataFormatter formatter = new DataFormatter();
        DecimalFormat df = new DecimalFormat("#.###");
        DecimalFormat longf = new DecimalFormat("#");
        boolean isExistError = false;
        int count = 0;
        for (Row row : sheet) {
            count++;
            if (count > 2 && !ValidateUtils.checkIfRowIsEmpty(row)) {
                boolean checkColumn3 = true;
                boolean checkColumn6 = true;
                boolean checkColumn8 = true;
                boolean checkColumn9 = true;
                boolean checkColumn10 = true;
                boolean checkColumn11 = true;
                boolean checkColumn12 = true;
                StringBuilder errorMesg = new StringBuilder();
                DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
                ConstructionTaskDetailDTO newObj = new ConstructionTaskDetailDTO();
                for (int i = 0; i < 13; i++) {
                    Cell cell = row.getCell(i);
                    if (cell != null) {
                        if (cell.getColumnIndex() == 3) {
                            try {
                                String code = formatter.formatCellValue(cell).trim();
                                ConstructionDetailDTO obj = constructionDAO.getConstructionByCode(code);
                                newObj.setProvinceName(obj.getProvinceName());
                                newObj.setConstructionCode(obj.getCode());
                                newObj.setCatStationCode(obj.getCatStationCode());
                                newObj.setConstructionName(obj.getName());
                                newObj.setConstructionId(obj.getConstructionId());
                                newObj.setConstructionType(obj.getCatContructionTypeName());
                            } catch (Exception e) {
                                checkColumn3 = false;
                            }
                            if (!checkColumn3) {
                                isExistError = true;
                                errorMesg.append("\nChưa nhập mã công trình hoặc mã công trình không tồn tại");
                            }

                        } else if (cell.getColumnIndex() == 5) {
                            newObj.setCntContract(
                                    formatter.formatCellValue(cell) != null ? formatter.formatCellValue(cell) : "");
                        } else if (cell.getColumnIndex() == 6) {
                            try {
                                // chinhpxn 20180606 start - delete * 1000000
                                Double quantity = new Double(cell.getNumericCellValue());
                                // chinhpxn 20180606 end
                                newObj.setQuantity(quantity);
                            } catch (Exception e) {
                                checkColumn6 = false;
                            }
                            if (!checkColumn6) {
                                isExistError = true;
                                errorMesg.append("\nGiá trị không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 8) {
                            try {
                                String name = formatter.formatCellValue(cell).trim();
                                DepartmentDTO obj = detailMonthPlanDAO.getSysUser(name);
                                newObj.setPerformerId(obj.getDepartmentId());
                                newObj.setPerformerName(obj.getName());
                            } catch (Exception e) {
                                checkColumn8 = false;
                            }
                            if (!checkColumn8) {
                                isExistError = true;
                                errorMesg.append("\nSai tên đăng nhập!");
                            }

                        } else if (cell.getColumnIndex() == 9) {
                            try {                               
                                Date startDate = dateFormat.parse(formatter.formatCellValue(cell));
                                if(validateDate(formatter.formatCellValue(cell)))
                                	newObj.setStartDate(startDate);
                                else
                                	checkColumn9 = false;
                                
                            } catch (Exception e) {
                                checkColumn9 = false;
                            }
                            if (!checkColumn9) {
                                isExistError = true;
                                errorMesg.append("\nNgày bắt đầu không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 10) {
                            try {                                
                                Date endDate = dateFormat.parse(formatter.formatCellValue(cell));
                                if(validateDate(formatter.formatCellValue(cell)))
                                	newObj.setEndDate(endDate);
                                else
                                	checkColumn10 = false;
                                
                            } catch (Exception e) {
                                checkColumn10 = false;
                            }
                            if (!checkColumn10) {
                                isExistError = true;
                                errorMesg.append("\nNgày kết thúc không hợp lệ!");
                            }
                            // chinhpxn20180621
                        } else if (cell.getColumnIndex() == 11) {
                            try {
                                String taskOrder = formatter.formatCellValue(cell).trim();
                                if (taskOrder.equalsIgnoreCase("1")) {
                                    newObj.setTaskOrder("1");
                                    newObj.setTaskName(
                                            "Tạo đề nghị quyết toán cho công trình " + newObj.getConstructionCode());
                                } else if (taskOrder.equalsIgnoreCase("2")) {
                                    newObj.setTaskOrder("2");
                                    newObj.setTaskName("Lên doanh thu cho công trình " + newObj.getConstructionCode());
                                } else {
                                    checkColumn11 = false;
                                }
                            } catch (Exception e) {
                                checkColumn11 = false;
                            }
                            if (!checkColumn11) {
                                isExistError = true;
                                errorMesg.append("\nQuyết toán/ Doanh thu không hợp lệ");
                            }
                            Cell cell1 = row.createCell(13);
                            cell1.setCellValue(errorMesg.toString());

                        } else if (cell.getColumnIndex() == 12) {
                            try {
                                String descriptionHSHC = formatter.formatCellValue(cell).trim();
                                if (descriptionHSHC.length() <= 1000) {
                                    newObj.setDescription(descriptionHSHC);
                                } else {
                                    checkColumn12 = false;
                                    isExistError = true;
                                }

                            } catch (Exception e) {
                                checkColumn12 = false;
                            }
                            if (!checkColumn12) {
                                isExistError = true;
                                errorMesg.append("\nGhi chú vượt quá 1000 ký tự!");
                            }
                            Cell cell1 = row.createCell(13);
                            cell1.setCellValue(errorMesg.toString());

                        }
                        // chinhpxn20180621
                    }
                }
                if (!isExistError) {
                    workLst.add(newObj);
                }

            }
        }
        if (isExistError) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            style.setAlignment(HorizontalAlignment.CENTER);
            style.setVerticalAlignment(VerticalAlignment.CENTER);
            // chinhpxn20180621
            Cell cell = sheet.getRow(1).createCell(13);
            // chinhpxn20180621
            cell.setCellValue("Cột lỗi");
            cell.setCellStyle(style);
            ConstructionTaskDetailDTO objErr = new ConstructionTaskDetailDTO();
            OutputStream out = new FileOutputStream(f, true);
            workbook.write(out);
            out.close();
            objErr.setErrorFilePath(UEncrypt.encryptFileUploadPath(filePath));
            workLst.add(objErr);
        }
        workbook.close();
        return workLst;
    }

    public String exportTemplateListCVK(Long sysGroupId, HttpServletRequest request) throws Exception {
        String folderParam = defaultSubFolderUpload;
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(
                new FileInputStream(filePath + "Import_congvieckhac_thang_chitiet.xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        file.close();
        Calendar cal = Calendar.getInstance();
        String uploadPath = folder2Upload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
                + File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
                + File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
                + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
                + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        File udir = new File(uploadPath);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        OutputStream outFile = new FileOutputStream(
                udir.getAbsolutePath() + File.separator + "Import_congvieckhac_thang_chitiet.xlsx");
        // List<WorkItemDetailDTO> listWorkItems = workItemDAO
        // .getWorkForTC(sysGroupId);
        // SysUserDetailCOMSDTO obj = new SysUserDetailCOMSDTO();
        String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.MONTHLY_DETAIL_PLAN, request);
        List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
        List<SysUserCOMSDTO> listUser = sysUserCOMSDAO.usersFillter(groupIdList);
        XSSFSheet sheet = workbook.getSheetAt(0);
        // fillSheet1(sheet, listWorkItems);
        sheet = workbook.getSheetAt(1);
        fillSheet2(sheet, listUser);
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        String path = UEncrypt
                .encryptFileUploadPath(uploadPathReturn + File.separator + "Import_congvieckhac_thang_chitiet.xlsx");
        return path;
    }

    public List<ConstructionTaskDetailDTO> importCVK(String fileInput, String filePath) throws Exception {
        List<ConstructionTaskDetailDTO> workLst = new ArrayList<ConstructionTaskDetailDTO>();
        File f = new File(fileInput);
        XSSFWorkbook workbook = new XSSFWorkbook(f);
        XSSFSheet sheet = workbook.getSheetAt(0);
        DataFormatter formatter = new DataFormatter();
        DecimalFormat df = new DecimalFormat("#.###");
        DecimalFormat longf = new DecimalFormat("#");
        boolean isExistError = false;
        int count = 0;
        for (Row row : sheet) {
            count++;
            if (count > 2 && !ValidateUtils.checkIfRowIsEmpty(row)) {
                boolean checkColumn2 = true;
                boolean checkColumn3 = true;
                boolean checkColumn4 = true;
                boolean checkColumn5 = true;
                StringBuilder errorMesg = new StringBuilder();
                DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
                ConstructionTaskDetailDTO newObj = new ConstructionTaskDetailDTO();
                for (int i = 0; i < 6; i++) {
                    Cell cell = row.getCell(i);
                    if (cell != null) {
                        if (cell.getColumnIndex() == 1) {
                            // chinhpxn20180704_start
                            if (formatter.formatCellValue(cell).trim().length() > 2000) {
                                isExistError = true;
                                errorMesg.append("\nTên công việc vượt quá 2000 ký tự!");
                            } else {
                                // chinhpxn20180704_end
                                newObj.setTaskName(formatter.formatCellValue(cell).trim());
                            }

                        } else if (cell.getColumnIndex() == 2) {
                            try {
                                String name = formatter.formatCellValue(row.getCell(2)).trim();
                                DepartmentDTO obj = detailMonthPlanDAO.getSysUser(name);
                                newObj.setPerformerId(obj.getDepartmentId());
                                newObj.setPerformerName(obj.getName());
                            } catch (Exception e) {
                                checkColumn2 = false;
                            }
                            if (!checkColumn2) {
                                isExistError = true;
                                errorMesg.append("\nNgười thực hiện không tồn tại!");
                            }

                        } else if (cell.getColumnIndex() == 3) {
                            try {

                                Date startDate = dateFormat.parse(formatter.formatCellValue(row.getCell(3)));
                                newObj.setStartDate(startDate);
                            } catch (Exception e) {
                                checkColumn3 = false;
                            }
                            if (!checkColumn3) {
                                isExistError = true;
                                errorMesg.append("\nNgày bắt đầu không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 4) {
                            try {
                                Date endDate = dateFormat.parse(formatter.formatCellValue(row.getCell(4)));
                                newObj.setEndDate(endDate);
                            } catch (Exception e) {
                                checkColumn4 = false;
                            }
                            if (!checkColumn4) {
                                isExistError = true;
                                errorMesg.append("\nNgày kết thúc không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 5) {
                            try {
                                String descriptionHSHC = formatter.formatCellValue(cell).trim();
                                if (descriptionHSHC.length() <= 1000) {
                                    newObj.setDescription(descriptionHSHC);
                                } else {
                                    checkColumn5 = false;
                                    isExistError = true;
                                }

                            } catch (Exception e) {
                                checkColumn5 = false;
                            }
                            if (!checkColumn5) {
                                isExistError = true;
                                errorMesg.append("\nGhi chú vượt quá 100 ký tự!");
                            }
                            Cell cell1 = row.createCell(6);
                            cell1.setCellValue(errorMesg.toString());

                        }

                    }
                }
                if (checkColumn2 && checkColumn3 && checkColumn4) {
                    workLst.add(newObj);
                }

            }
        }
        if (isExistError) {
            ConstructionTaskDetailDTO objErr = new ConstructionTaskDetailDTO();
            OutputStream out = new FileOutputStream(f, true);
            workbook.write(out);
            out.close();
            objErr.setErrorFilePath(UEncrypt.encryptFileUploadPath(filePath));
            workLst.add(objErr);
        }
        workbook.close();
        return workLst;
    }

    public String exportExcelTemplate(String fileName, Long sysGroupId) throws Exception {
        // TODO Auto-generated method stub
        String folderParam = defaultSubFolderUpload;
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + fileName));
        // String filePath1 = UFile.writeToFileServerATTT2(file,
        // "Import_KeHoachNam.xlsx", folderParam, folder2Upload);
        XSSFWorkbook workbook = new XSSFWorkbook(file);

        file.close();
        Calendar cal = Calendar.getInstance();
        String uploadPath = folder2Upload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
                + File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
                + File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
                + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
                + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        File udir = new File(uploadPath);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + fileName);
//		chinhpxn20180710_start
//		if (DONG_TIEN.equals(fileName)) {
//			List<ConstructionDetailDTO> listConstr = constructionDAO
//					.getConstructionForDT(sysGroupId);
//			XSSFSheet sheet = workbook.getSheetAt(0);
//			if (listConstr != null && !listConstr.isEmpty()) {
//				XSSFCellStyle style = ExcelUtils.styleText(sheet);
//				XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
//				XSSFCellStyle styleCurrency = ExcelUtils.styleNumber(sheet);
//				int i = 2;
//				int j = 1;
//				for (ConstructionDetailDTO dto : listConstr) {
//					Row row = sheet.createRow(i++);
//					Cell cell = row.createCell(0, CellType.STRING);
//					cell.setCellValue(j++);
//					cell.setCellStyle(style);
//					cell = row.createCell(1, CellType.STRING);
//					cell.setCellValue(StringUtils.isNotEmpty(dto
//							.getProvinceCode()) ? dto.getProvinceCode() : "");
//					cell.setCellStyle(style);
//					cell = row.createCell(2, CellType.STRING);
//					cell.setCellValue(StringUtils.isNotEmpty(dto
//							.getCatStationCode()) ? dto.getCatStationCode()
//							: "");
//					cell.setCellStyle(style);
//					cell = row.createCell(3, CellType.STRING);
//					cell.setCellValue(StringUtils.isNotEmpty(dto.getCode()) ? dto
//							.getCode() : "");
//					cell.setCellStyle(style);
//					cell = row.createCell(4, CellType.STRING);
//					cell.setCellValue(StringUtils.isNotEmpty(dto
//							.getCatContructionTypeName()) ? dto
//							.getCatContructionTypeName() : "");
//					cell.setCellStyle(style);
//					cell = row.createCell(5, CellType.STRING);
//					cell.setCellValue(StringUtils.isNotEmpty(dto
//							.getWorkItemName()) ? dto.getWorkItemName() : "");
//					cell.setCellStyle(style);
//					cell = row.createCell(6, CellType.STRING);
//					cell.setCellValue(StringUtils.isNotEmpty(dto
//							.getCntContractCode()) ? dto.getCntContractCode()
//							: "");
//					cell.setCellStyle(style);
//					cell = row.createCell(7, CellType.NUMERIC);
//					cell.setCellValue((dto.getQuantity() != null ? dto
//							.getQuantity() : 0));
//					cell.setCellStyle(styleCurrency);
//					cell = row.createCell(8, CellType.NUMERIC);
//					cell.setCellStyle(styleCurrency);
//					cell = row.createCell(9, CellType.STRING);
//					cell.setCellStyle(style);
//				}
//			}
//		} else 
//		chinhpxn20180710_end
        if (YEU_CAU_VAT_TU.equals(fileName)) {
            List<DmpnOrderDTO> data = dmpnOrderDAO.getDataForYCVT();
            if (data != null && !data.isEmpty()) {
                XSSFSheet sheet = workbook.getSheetAt(1);
                XSSFCellStyle style = ExcelUtils.styleText(sheet);
                int i = 1;
                for (DmpnOrderDTO dto : data) {
                    Row row = sheet.createRow(i++);
                    Cell cell = row.createCell(0, CellType.STRING);
                    cell.setCellValue(StringUtils.isNotEmpty(dto.getGoodsCode()) ? dto.getGoodsCode() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(1, CellType.STRING);
                    cell.setCellValue(StringUtils.isNotEmpty(dto.getGoodsName()) ? dto.getGoodsName() : "");
                    cell.setCellStyle(style);
                }
            }
            List<DmpnOrderDTO> dvt = dmpnOrderDAO.getDVTForYCVT();
            if (dvt != null & !dvt.isEmpty()) {

                XSSFSheet sheet = workbook.getSheetAt(2);
                XSSFCellStyle style = ExcelUtils.styleText(sheet);
                int i = 1;
                for (DmpnOrderDTO dto : dvt) {
                    Row row = sheet.createRow(i++);
                    Cell cell = row.createCell(0, CellType.STRING);
                    cell.setCellValue(StringUtils.isNotEmpty(dto.getUnitCode()) ? dto.getUnitCode() : "");
                    cell.setCellStyle(style);
                    cell = row.createCell(1, CellType.STRING);
                    cell.setCellValue(StringUtils.isNotEmpty(dto.getUnitName()) ? dto.getUnitName() : "");
                    cell.setCellStyle(style);
                }

            }

        }
        /*
         * List<WorkItemDTO> listSheet3 = workItemDAO.GetListData(); XSSFSheet sheet1 =
         * workbook.getSheetAt(1); fillSheet3(sheet1, listSheet3);
         * workbook.write(outFile); workbook.close(); outFile.close();
         */
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + fileName);
        return path;
    }

    public List<ConstructionTaskDetailDTO> importDT(String fileInput, String filePath) throws Exception {
        List<ConstructionTaskDetailDTO> workLst = new ArrayList<ConstructionTaskDetailDTO>();
        File f = new File(fileInput);
        XSSFWorkbook workbook = new XSSFWorkbook(f);
        XSSFSheet sheet = workbook.getSheetAt(0);
        DataFormatter formatter = new DataFormatter();
        DecimalFormat df = new DecimalFormat("#.###");
        DecimalFormat longf = new DecimalFormat("#");
        boolean isExistError = false;
        int count = 0;
        for (Row row : sheet) {
            count++;
            if (count > 2 && !ValidateUtils.checkIfRowIsEmpty(row)) {
                boolean checkColumn3 = true;
                boolean checkColumn6 = true;
                boolean checkColumn7 = true;
                boolean checkColumn8 = true;
                boolean checkColumn5 = true;
                boolean checkColumn9 = true;
                StringBuilder errorMesg = new StringBuilder();
                String constructionCode = "";
                DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
                ConstructionTaskDetailDTO newObj = new ConstructionTaskDetailDTO();
                // chinhpxn20180704_start
                for (int i = 0; i < 10; i++) {
                    // chinhpxn20180704_end
                    Cell cell = row.getCell(i);
                    if (cell != null) {
                        if (cell.getColumnIndex() == 2) {
                            newObj.setCatStationCode(formatter.formatCellValue(cell));
                        } else if (cell.getColumnIndex() == 3) {
                            try {
                                constructionCode = formatter.formatCellValue(row.getCell(3)).trim();
                                ConstructionDetailDTO obj = constructionDAO
                                        .getConstructionByCode(formatter.formatCellValue(cell));
                                newObj.setConstructionCode(obj.getCode());
                                newObj.setConstructionId(obj.getConstructionId());
                                if (obj.getConstructionId() == null)
                                    checkColumn3 = false;
                            } catch (Exception e) {
                                checkColumn3 = false;
                            }
                            if (!checkColumn3) {
                                isExistError = true;
                                errorMesg.append("Mã công trình không hợp lệ!");
                            }

                        } else if (cell.getColumnIndex() == 4) {

                            newObj.setConstructionType(formatter.formatCellValue(cell));
                        } else if (cell.getColumnIndex() == 5) {
                            try {
                                String code = formatter.formatCellValue(cell).trim();
                                WorkItemDetailDTO obj = workItemDAO.getWorkItemByCodeNew(code, constructionCode);
                                if (obj.getConstructionCode().equals(constructionCode)) {
                                    newObj.setWorkItemId(obj.getWorkItemId());
                                    newObj.setWorkItemName(obj.getName());
                                    newObj.setWorkItemCode(obj.getCode());
                                } else {
                                    checkColumn5 = false;
                                    isExistError = true;
                                    errorMesg.append("\nHạng mục không thuộc công trình!");
                                }
                            } catch (Exception e) {
                                checkColumn5 = false;
                            }
                            if (!checkColumn5) {
                                isExistError = true;
                                errorMesg.append("\nChưa nhập hạng hoặc tên hạng mục không tồn tại!");
                            }

                        } else if (cell.getColumnIndex() == 6) {
                            newObj.setCntContract(formatter.formatCellValue(cell));
                        } else if (cell.getColumnIndex() == 7) {
                            try {
                                // chinhpxn 20180606 start
                                newObj.setQuantity(new Double(cell.getNumericCellValue()));
                                // chinhpxn 20180606 end
                            } catch (Exception e) {
                                checkColumn7 = false;
                            }
                            if (!checkColumn7) {
                                isExistError = true;
                                errorMesg.append("Tổng cộng không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 8) {
                            try {
                                // chinhpxn 20180606 start
                                newObj.setVat(new Double(cell.getNumericCellValue()));
                                // chinhpxn 20180606 end
                            } catch (Exception e) {
                                checkColumn8 = false;
                            }
                            if (!checkColumn8) {
                                isExistError = true;
                                errorMesg.append("VAT không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 9) {
                            try {
                                String descriptionHSHC = formatter.formatCellValue(cell).trim();
                                if (descriptionHSHC.length() <= 1000) {
                                    newObj.setDescription(descriptionHSHC);
                                } else {
                                    checkColumn9 = false;
                                    isExistError = true;
                                }

                            } catch (Exception e) {
                                checkColumn9 = false;
                            }
                            if (!checkColumn9) {
                                isExistError = true;
                                errorMesg.append("\nGhi chú vượt quá 1000 ký tự!");
                            }
                            Cell cell1 = row.createCell(10);
                            cell1.setCellValue(errorMesg.toString());
                        } /*
                         * else if (cell.getColumnIndex() == 9) {
                         * newObj.setDescription(formatter.formatCellValue(row .getCell(9)).trim()); }
                         * Cell cell1 = row.createCell(10); cell1.setCellValue(errorMesg.toString());
                         */
                    }
                }
                if (checkColumn3 && checkColumn5 && checkColumn7 && checkColumn8 && checkColumn9) {

                    workLst.add(newObj);
                }

            }
        }
        if (isExistError) {
            ConstructionTaskDetailDTO objErr = new ConstructionTaskDetailDTO();
            OutputStream out = new FileOutputStream(f, true);
            workbook.write(out);
            out.close();
            objErr.setErrorFilePath(UEncrypt.encryptFileUploadPath(filePath));
            workLst.add(objErr);
        }
        workbook.close();
        return workLst;
    }

    public DetailMonthPlanExportDTO getDataSignForSignVOffice(CommonDTO dto) {
        // TODO Auto-generated method stub
        DetailMonthPlanExportDTO data = new DetailMonthPlanExportDTO();
        data.setSummaryList(detailMonthPlanDAO.getTmpnTargetForExport(dto.getObjectId(), dto.getMonth(), dto.getYear(),
                dto.getSysGroupId()));
        List<ConstructionTaskDetailDTO> pl1List = detailMonthPlanDAO.getPh12ForExportDoc(dto.getObjectId(), "1");
        if (pl1List != null && !pl1List.isEmpty()) {
            int i = 1;
            for (ConstructionTaskDetailDTO pl : pl1List) {
                pl.setTt((i++) + "");
            }
        }
        data.setPl1List(pl1List);
        List<ConstructionTaskDetailDTO> pl2List = detailMonthPlanDAO.getPh12ForExportDoc(dto.getObjectId(), "2");
        if (pl2List != null && !pl2List.isEmpty()) {
            int i = 1;
            for (ConstructionTaskDetailDTO pl : pl2List) {
                pl.setTt((i++) + "");
            }
        }
        data.setPl2List(pl2List);
        List<ConstructionTaskDetailDTO> pl3List = detailMonthPlanDAO.getPl3ForExportDoc(dto.getObjectId());
        if (pl3List != null && !pl3List.isEmpty()) {
            int i = 1;
            for (ConstructionTaskDetailDTO pl : pl3List) {
                pl.setTt((i++) + "");
            }
        }
        data.setPl3List(pl3List);
        return data;
    }

    public List<DmpnOrderDetailDTO> importYCVT(String fileInput, String filePath) throws Exception {
        List<DmpnOrderDetailDTO> workLst = new ArrayList<DmpnOrderDetailDTO>();
        File f = new File(fileInput);
        XSSFWorkbook workbook = new XSSFWorkbook(f);
        XSSFSheet sheet = workbook.getSheetAt(0);
        DataFormatter formatter = new DataFormatter();
        DecimalFormat df = new DecimalFormat("#.###");
        DecimalFormat longf = new DecimalFormat("#");
        boolean isExistError = false;
        int count = 0;
        for (Row row : sheet) {
            count++;
            if (count > 2 && !ValidateUtils.checkIfRowIsEmpty(row)) {
                boolean checkColumn1 = true;
                boolean checkColumn2 = true;
                boolean checkColumn3 = true;
                boolean checkColumn4 = true;
                StringBuilder errorMesg = new StringBuilder();
                DmpnOrderDetailDTO newObj = new DmpnOrderDetailDTO();
                for (int i = 0; i < 5; i++) {
                    Cell cell = row.getCell(i);
                    if (cell != null) {
                        if (cell.getColumnIndex() == 1) {
                            try {
                                String code = formatter.formatCellValue(row.getCell(1)).trim();
                                DmpnOrderDTO obj = dmpnOrderDAO
                                        .getOrderByCode(formatter.formatCellValue(row.getCell(1)).trim());
                                newObj.setGoodsId(obj.getGoodsId());
                                newObj.setGoodsCode(obj.getGoodsCode().trim());
                                newObj.setGoodsName(obj.getGoodsName().trim());

                                if (obj.getGoodsId() == null)
                                    checkColumn1 = false;
                            } catch (Exception e) {
                                checkColumn1 = false;
                            }
                            if (!checkColumn1) {
                                isExistError = true;
                                errorMesg.append("Mã hàng hóa không hợp lệ!");
                            }

                        } else if (cell.getColumnIndex() == 2) {
                            try {
                                DmpnOrderDTO obj = dmpnOrderDAO
                                        .getCatUnitByCode(formatter.formatCellValue(cell).trim());
                                newObj.setUnitName(obj.getUnitName());
                                newObj.setCatUnitId(obj.getCatUnitId());
                                if (obj.getCatUnitId() == null)
                                    checkColumn2 = false;
                            } catch (Exception e) {
                                checkColumn2 = false;
                            }
                            if (!checkColumn2) {
                                isExistError = true;
                                errorMesg.append("Đơn vị tính không hợp lệ!");
                            }
                        } else if (cell.getColumnIndex() == 3) {
                            try {
                                newObj.setQuantity(Double.parseDouble(formatter.formatCellValue(cell)));
                            } catch (Exception e) {
                                checkColumn3 = false;
                            }
                            if (!checkColumn3) {
                                isExistError = true;
                                errorMesg.append("Số lượng hợp lệ!");
                            }

                        } else if (cell.getColumnIndex() == 4) {
                            try {
                                String descriptionHSHC = formatter.formatCellValue(cell).trim();
                                if (descriptionHSHC.length() <= 1000) {
                                    newObj.setDescription(descriptionHSHC);
                                } else {
                                    checkColumn4 = false;
                                    isExistError = true;
                                }

                            } catch (Exception e) {
                                checkColumn4 = false;
                            }
                            if (!checkColumn4) {
                                isExistError = true;
                                errorMesg.append("\nGhi chú vượt quá 1000 ký tự!");
                            }
                            Cell cell1 = row.createCell(5);
                            cell1.setCellValue(errorMesg.toString());

                        }
                        Cell cell1 = row.createCell(5);
                        cell1.setCellValue(errorMesg.toString());

                    }
                }
                if (checkColumn1 && checkColumn2 && checkColumn3) {
                    workLst.add(newObj);
                }

            }
        }
        if (isExistError) {
            DmpnOrderDetailDTO objErr = new DmpnOrderDetailDTO();
            OutputStream out = new FileOutputStream(f, true);
            workbook.write(out);
            out.close();
            objErr.setErrorFilePath(UEncrypt.encryptFileUploadPath(filePath));
            workLst.add(objErr);
        }
        workbook.close();
        return workLst;
    }

    public void updateListDmpnOrder(DetailMonthPlanSimpleDTO obj, UserToken objUser) {
        Long detailMonthPlanId = obj.getDetailMonthPlanId();
        if ("1".equalsIgnoreCase(obj.getIsYCVTImport())) {
            dmpnOrderDAO.removeByDetailPlanId(detailMonthPlanId);
            for (DmpnOrderDetailDTO dto : obj.getListDmpnOrder()) {
                dto.setMonth(obj.getMonth());
                dto.setSysGroupId(obj.getSysGroupId());
                dto.setYear(obj.getYear());
                dto.setDetailMonthPlanId(detailMonthPlanId);
                dto.setCreatedDate(new Date());
                dto.setCreatedGroupId(objUser.getDeptId());
                dto.setCreatedUserId(objUser.getUserID());
                dmpnOrderDAO.saveObject(dto.toModel());

            }
        } else {
            if (obj.getListConstrTaskIdDelete() != null && obj.getListConstrTaskIdDelete().size() > 0) {
                dmpnOrderDAO.removeByListId(obj.getListConstrTaskIdDelete());
            }

            // for (DmpnOrderDetailDTO dto : obj.getListDmpnOrder()) {
            // if (dto.getDmpnOrderId() == null) {
            // dto.setMonth(obj.getMonth());
            // dto.setSysGroupId(obj.getSysGroupId());
            // dto.setYear(obj.getYear());
            // dto.setDetailMonthPlanId(detailMonthPlanId);
            // dto.setCreatedDate(new Date());
            // dto.setCreatedGroupId(objUser.getDeptId());
            // dto.setCreatedUserId(objUser.getUserID());
            // dmpnOrderDAO.saveObject(dto.toModel());
            // } else {
            // dto.setMonth(obj.getMonth());
            // dto.setSysGroupId(obj.getSysGroupId());
            // dto.setYear(obj.getYear());
            // dto.setUpdatedDate(new Date());
            // dto.setUpdatedGroupId(objUser.getDeptId());
            // dto.setUpdatedUserId(objUser.getUserID());
            // dmpnOrderDAO.update(dto.toModel());
            // }
            //
            // }
        }
    }

    private void getParentTaskForThiCong(ConstructionTaskDetailDTO dto, String type, Long detailMonthPlanId,
                                         Long sysGroupId,HashMap<String,Long> constructionCodeMap,HashMap<Long,Long> constructionTaskSysGroupMap) {
        // TODO Auto-generated method stub
        ConstructionTaskDetailDTO provinceLevel = new ConstructionTaskDetailDTO();
        ConstructionTaskDetailDTO constructionLevel = new ConstructionTaskDetailDTO();
        if (sysGroupId != null) {
        		Long provinceLevelId=constructionTaskSysGroupMap.get(detailMonthPlanId);
        		if (provinceLevelId == 0L || provinceLevelId == null) {
                provinceLevel.setType(type);
                provinceLevel.setTaskName(dto.getSysGroupName());
                provinceLevel.setLevelId(1L);
                provinceLevel.setSysGroupId(sysGroupId);
                provinceLevel.setDetailMonthPlanId(detailMonthPlanId);
                provinceLevel.setMonth(dto.getMonth());
                provinceLevel.setYear(dto.getYear());
                provinceLevel.setStatus("1");
                provinceLevel.setCompleteState("1");
                ConstructionTaskBO bo = provinceLevel.toModel();
                provinceLevelId = constructionTaskDAO.saveObject(bo);
                bo.setPath("/" + provinceLevelId + "/");
                bo.setConstructionTaskId(provinceLevelId);
                constructionTaskDAO.update(bo);
                constructionTaskDAO.getSession().flush();
                dto.setConstructionTaskId(provinceLevelId);
                constructionTaskSysGroupMap.put(detailMonthPlanId,provinceLevelId);
//                constructionTaskDAO.updateChildRecord(bo, detailMonthPlanId);

            }
            if (StringUtils.isNotEmpty(dto.getConstructionCode())) {
//                constructionLevel = constructionTaskDAO.getConstructionTaskByConstructionCode(dto.getConstructionCode(),
//                        type, 2L, detailMonthPlanId);
//                Long constructionLevelId = constructionLevel.getConstructionTaskId();
            	 Long constructionLevelId=0L;
                 constructionLevelId=constructionCodeMap.get(dto.getConstructionCode());
//                if (constructionLevel.getConstructionTaskId() == null) {
                 if (constructionLevelId == null) {
                    constructionLevel.setType(type);
                    constructionLevel.setTaskName(dto.getConstructionCode());
                    constructionLevel.setLevelId(2L);
                    constructionLevel.setDetailMonthPlanId(detailMonthPlanId);
                    constructionLevel.setParentId(provinceLevelId);
                    constructionLevel.setMonth(dto.getMonth());
                    constructionLevel.setYear(dto.getYear());
                    constructionLevel.setConstructionId(dto.getConstructionId());
                    constructionLevel.setSysGroupId(sysGroupId);
                    constructionLevel.setStatus("1");
                    constructionLevel.setSupervisorId(dto.getSupervisorId());
                    constructionLevel.setDirectorId(dto.getDirectorId());
                    constructionLevel.setCompleteState("1");
                    ConstructionTaskBO bo = constructionLevel.toModel();
                    constructionLevelId = constructionTaskDAO.saveObject(bo);
                    bo.setConstructionTaskId(constructionLevelId);
                    bo.setPath("/" + provinceLevelId + "/" + constructionLevelId + "/");
                    constructionTaskDAO.updateObject(bo);
                    constructionTaskDAO.getSession().flush();
                    constructionCodeMap.put(dto.getConstructionCode(),constructionLevelId);
                }
                dto.setParentId(constructionLevelId);
                dto.setPath("/" + provinceLevelId + "/" + constructionLevelId + "/");
            }
        }

    }

    private void insertTaskByWorkItem(String type, Long workItemId, ConstructionTaskDetailDTO parent) {
        // TODO Auto-generated method stub
        List<ConstructionTaskDTO> list = constructionTaskDAO.getTaskByWorkItem(workItemId);
        if (list != null && !list.isEmpty()) {
            for (ConstructionTaskDTO dto : list) {
                dto.setLevelId(4L);
                dto.setMonth(parent.getMonth());
                dto.setSysGroupId(parent.getSysGroupId());
                dto.setYear(parent.getYear());
                dto.setType(type);
                dto.setWorkItemId(workItemId);
                dto.setStartDate(parent.getStartDate());
                dto.setEndDate(parent.getEndDate());
                dto.setBaselineStartDate(parent.getStartDate());
                dto.setBaselineEndDate(parent.getEndDate());
                dto.setPerformerWorkItemId(parent.getPerformerId());
                dto.setPerformerId(parent.getPerformerId());
                dto.setDetailMonthPlanId(parent.getDetailMonthPlanId());
                dto.setParentId(parent.getConstructionTaskId());
//                dto.setSupervisorId(
//                        Double.parseDouble(constructionTaskDAO.getSuperVisorId(parent.getConstructionCode())));
//                dto.setDirectorId(Double.parseDouble(constructionTaskDAO.getDirectorId(parent.getConstructionCode())));
                dto.setCompleteState("1");
                dto.setStatus("1");
                dto.setConstructionId(parent.getConstructionId());
                ConstructionTaskBO bo = dto.toModel();
                Long id = constructionTaskDAO.saveObject(bo);
                bo.setPath(parent.getPath() + id + "/");
                bo.setConstructionTaskId(id);
                constructionTaskDAO.updateObject(bo);
            }
        }

    }

    private void getParentTask(ConstructionTaskDetailDTO dto, String type, Long detailMonthPlanId, Long sysGroupId,
                               DetailMonthPlanSimpleDTO obj) {
        // TODO Auto-generated method stub
        ConstructionTaskDetailDTO provinceLevel = new ConstructionTaskDetailDTO();
        if (sysGroupId != null) {
            provinceLevel = constructionTaskDAO.getLevel1BySysGroupId(sysGroupId, type, detailMonthPlanId);
            Long provinceLevelId = provinceLevel.getConstructionTaskId();
            if (provinceLevelId == null) {
                constructionTaskDAO.deleteConstructionTask(type, 1L, detailMonthPlanId);
                provinceLevel.setType(type);
                provinceLevel.setTaskName(constructionTaskDAO.getDivisionCodeSysGroupId(sysGroupId));
                provinceLevel.setLevelId(1L);
                provinceLevel.setSysGroupId(sysGroupId);
                provinceLevel.setDetailMonthPlanId(detailMonthPlanId);
                provinceLevel.setMonth(obj.getMonth());
                provinceLevel.setYear(obj.getYear());
                ConstructionTaskBO bo = provinceLevel.toModel();
                provinceLevelId = constructionTaskDAO.saveObject(bo);
                bo.setPath("/" + provinceLevelId + "/");
                bo.setConstructionTaskId(provinceLevelId);
                constructionTaskDAO.update(bo);
                constructionTaskDAO.getSession().flush();
                constructionTaskDAO.updateChildRecord(bo, detailMonthPlanId);
            }
            dto.setPath("/" + provinceLevelId + "/");
            dto.setConstructionTaskId(provinceLevelId);
        }
    }

    public String exportDetailMonthPlan(DetailMonthPlanSimpleDTO obj) throws Exception {

        obj.setPage(1L);
        obj.setPageSize(100);
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + "KeHoachThangChiTiet.xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        file.close();
        Calendar cal = Calendar.getInstance();
        String uploadPath = folder2Upload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
                + File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
                + File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
                + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
                + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
        File udir = new File(uploadPath);
        if (!udir.exists()) {
            udir.mkdirs();
        }
        OutputStream outFile = new FileOutputStream(
                udir.getAbsolutePath() + File.separator + "KeHoachThangChiTiet.xlsx");
        List<DetailMonthPlaningDTO> data = detailMonthPlanDAO.exportDetailMonthPlan(obj);
        DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        XSSFSheet sheet = workbook.getSheetAt(0);
        if (data != null && !data.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
            styleNumber.setAlignment(HorizontalAlignment.RIGHT);
            int i = 2;
            for (DetailMonthPlaningDTO dto : data) {
                Row row = sheet.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (i - 2));
                cell.setCellStyle(styleNumber);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue((dto.getCode() != null) ? dto.getCode() : "");
                cell.setCellStyle(style);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue((dto.getName() != null) ? dto.getName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(3, CellType.STRING);
                cell.setCellValue((dto.getSysName() != null) ? dto.getSysName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(4, CellType.STRING);
                cell.setCellValue(
                        (dto.getYear() != null && dto.getMonth() != null) ? dto.getMonth() + "/" + dto.getYear() : "");
                cell.setCellStyle(styleNumber);
                cell = row.createCell(5, CellType.STRING);
                cell.setCellValue(getStringForSignState(dto.getSignState()));
                cell.setCellStyle(style);
                cell = row.createCell(6, CellType.STRING);
                cell.setCellValue(getStringForStatus(dto.getStatus()));
                cell.setCellStyle(style);

                // thiếu quantity

            }
        }
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "KeHoachThangChiTiet.xlsx");
        return path;
    }

    private String numberFormat(double value) {
        DecimalFormat myFormatter = new DecimalFormat("###.###");
        String output = myFormatter.format(value);
        return output;
    }

    private String getStringForStatus(String status) {
        // TODO Auto-generated method stub
        if ("0".equals(status)) {
            return "Hết hiệu lực";
        } else if ("1".equals(status)) {
            return "Hiệu lực";
        }
        return null;
    }

    private String getStringForSignState(String signState) {
        // TODO Auto-generated method stub
        if ("1".equals(signState)) {
            return "Chưa trình ký";
        } else if ("2".equals(signState)) {
            return "Đã trình ký";
        } else if ("3".equals(signState)) {
            return "Đã ký duyệt";
        } else if ("4".equals(signState)) {
            return "Từ chối ký duyệt";
        }
        return null;
    }

    private void getParentTaskForCVK(ConstructionTaskDetailDTO dto, String type, Long detailMonthPlanId,
                                     Long sysGroupId) {
        ConstructionTaskDetailDTO provinceLevel = new ConstructionTaskDetailDTO();
        if (sysGroupId != null) {
            provinceLevel = constructionTaskDAO.getLevel1BySysGroupId(sysGroupId, type, detailMonthPlanId);
            Long provinceLevelId = provinceLevel.getConstructionTaskId();
            if (provinceLevel.getConstructionTaskId() == null) {
                constructionTaskDAO.deleteConstructionTask(type, 1L, detailMonthPlanId);
                provinceLevel.setType(type);
                provinceLevel.setSysGroupId(sysGroupId);
                provinceLevel.setTaskName(constructionTaskDAO.getDivisionCodeSysGroupId(sysGroupId));
                provinceLevel.setLevelId(1L);
                provinceLevel.setDetailMonthPlanId(detailMonthPlanId);
                ConstructionTaskBO bo = provinceLevel.toModel();
                provinceLevelId = constructionTaskDAO.saveObject(bo);
                bo.setPath("/" + provinceLevelId + "/");
                bo.setConstructionTaskId(provinceLevelId);
                constructionTaskDAO.update(bo);
                constructionTaskDAO.getSession().flush();
                constructionTaskDAO.updateChildRecord(bo, detailMonthPlanId);

            }
            dto.setParentId(provinceLevelId);
            dto.setConstructionTaskId(provinceLevelId);
            dto.setPath("/" + provinceLevelId + "/");
        }
    }

    public DetailMonthPlanExportDTO getDataAttachForSignVOffice(CommonDTO dto) {
        // TODO Auto-generated method stub
        DetailMonthPlanExportDTO data = new DetailMonthPlanExportDTO();
        data.setPl1ExcelList(detailMonthPlanDAO.getPl1ForExportExcel(dto.getObjectId()));
        data.setPl4ExcelList(detailMonthPlanDAO.getPl4ExcelList(dto.getObjectId()));
        data.setPl6ExcelList(detailMonthPlanDAO.getPl6ForExportExcel(dto.getObjectId()));
        data.setListWorkItemTypeBTS(detailMonthPlanDAO.getListWorkItemTypeByName("Công trình BTS"));
        data.setListWorkItemTypeGPON(detailMonthPlanDAO.getListWorkItemTypeByName("Công trình GPON"));
        data.setListWorkItemTypeTuyen(detailMonthPlanDAO.getListWorkItemTypeByName("Công trình tuyến"));
        data.setListWorkItemTypeLe(detailMonthPlanDAO.getListWorkItemTypeByName("Công trình lẻ"));
        List<ConstructionTaskDetailDTO> pl2 = new ArrayList<ConstructionTaskDetailDTO>();
        pl2 = detailMonthPlanDAO.getPl235ForExportExcel(dto.getObjectId(), 2L);
        if (pl2 != null && !pl2.isEmpty()) {
            for (ConstructionTaskDetailDTO con : pl2) {
                if (con.getConstructionId() != null) {
                    con.setListWorkItemForExport(
                            detailMonthPlanDAO.getWorkItemDetailByConstructionId(con.getConstructionId()));
                }
            }
        }
        data.setPl2ExcelList(pl2);
        List<ConstructionTaskDetailDTO> pl3 = new ArrayList<ConstructionTaskDetailDTO>();
        pl3 = detailMonthPlanDAO.getPl235ForExportExcel(dto.getObjectId(), 3L);
        if (pl3 != null && !pl3.isEmpty()) {
            for (ConstructionTaskDetailDTO con : pl3) {
                if (con.getConstructionId() != null) {
                    con.setListWorkItemForExport(
                            detailMonthPlanDAO.getWorkItemDetailByConstructionId(con.getConstructionId()));
                }
            }
        }
        data.setPl3ExcelList(pl3);
        List<ConstructionTaskDetailDTO> pl5 = new ArrayList<ConstructionTaskDetailDTO>();
        pl5 = detailMonthPlanDAO.getPl235ForExportExcel(dto.getObjectId(), 5L);
        if (pl5 != null && !pl5.isEmpty()) {
            for (ConstructionTaskDetailDTO con : pl5) {
                if (con.getConstructionId() != null) {
                    con.setListWorkItemForExport(
                            detailMonthPlanDAO.getWorkItemDetailByConstructionId(con.getConstructionId()));
                }
            }
        }
        data.setPl5ExcelList(pl5);
        return data;
    }
    boolean validateDate(String date){
    	String dateBreaking[] = date.split("/");
    	if(Integer.parseInt(dateBreaking[1])>12){
    		return false;
    	}
    	if( Integer.parseInt(dateBreaking[2]) < (new Date()).getYear()+1900 ){
    		return false;
    	}
    	if(Integer.parseInt(dateBreaking[0])>31){
    		return false;
    	}
    	SimpleDateFormat sdfrmt = new SimpleDateFormat("dd/MM/yyyy");
	    sdfrmt.setLenient(false);
	    try
	    {
	        Date javaDate = sdfrmt.parse(date); 
	    }
	    catch (Exception e)
	    {
	        return false;
	    }
    	return true;
    }
	//tanqn start 20181108
    public void removeRow(ConstructionTaskDTO obj) {
        detailMonthPlanDAO.removeRow(obj.getConstructionTaskId());
    }
    //tanqn end 20181108
}
