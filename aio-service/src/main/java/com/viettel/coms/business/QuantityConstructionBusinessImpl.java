package com.viettel.coms.business;

import com.viettel.coms.bo.WorkItemBO;
import com.viettel.coms.dao.*;
import com.viettel.coms.dto.*;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.coms.utils.PermissionUtils;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ImageUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFCreationHelper;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

/**
 * @author hungnx
 * @since 20180627
 */
@Service("quantityConstructionBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class QuantityConstructionBusinessImpl extends
        BaseFWBusinessImpl<QuantityConstructionDAO, WorkItemDTO, WorkItemBO> implements QuantityConstructionBusiness {

    @Autowired
    QuantityConstructionDAO quantityConstructionDAO;
    @Autowired
    UtilAttachDocumentDAO utilAttachDocumentDAO;
    @Autowired
    WorkItemDAO workItemDAO;
    @Autowired
    ConstructionTaskDAO constructionTaskDAO;
    @Autowired
    ConstructionTaskDailyDAO constructionTaskDailyDAO;
    protected final Logger log = Logger.getLogger(QuantityConstructionBusinessImpl.class);

    public QuantityConstructionBusinessImpl() {
        tModel = new WorkItemBO();
        tDAO = quantityConstructionDAO;
    }

    @Value("${folder_upload2}")
    private String folder2Upload;
    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Override
    public QuantityConstructionDAO gettDAO() {
        return quantityConstructionDAO;
    }

    @Override
    public long count() {
        return quantityConstructionDAO.count("WorkItemBO", null);
    }

    public DataListDTO doSearch(WorkItemDetailDTO obj, HttpServletRequest request) {
        List<WorkItemDetailDTO> ls = new ArrayList<WorkItemDetailDTO>();
        List<String> groupIdList = PermissionUtils.getListIdInDomainData(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.VIEW_QUANTITY_DAILY, request);
        if (groupIdList != null && !groupIdList.isEmpty()) {
            ls = quantityConstructionDAO.doSearchQuantity(obj, groupIdList);
            for (int i = 0; i < ls.size(); i++) {
                WorkItemDetailDTO objTask = new WorkItemDetailDTO();
                objTask.setConstructionTaskId(ls.get(i).getConstructionTaskId());
                objTask.setDateDo(ls.get(i).getDateDo());
                objTask.setConfirm(ls.get(i).getConfirm());
                List<ConstructionTaskDailyDTO> lsDaily = quantityConstructionDAO.getConstructionTaskDaily(objTask);
                ls.get(i).setConstructionTaskDailyLst(lsDaily);
            }
        }
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

    public void approveQuantityByDay(WorkItemDetailDTO obj, HttpServletRequest request) {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        Long userId = objUser.getVpsUserInfo().getSysUserId();
        obj.setUpdatedUserId(userId);
        List<ConstructionTaskDailyDTO> taskDailyLst = obj.getConstructionTaskDailyLst();
        for (int i = 0; i < taskDailyLst.size(); i++) {
            taskDailyLst.get(i).setApproveUserId(userId);
            taskDailyLst.get(i).setPrice(obj.getPrice());
            taskDailyLst.get(i).setConfirm("1");
            quantityConstructionDAO.updateConstructionTaskDaily(taskDailyLst.get(i), true);
        }
//		if ("3".equalsIgnoreCase(obj.getStatusConstruction()) || "5".equalsIgnoreCase(obj.getStatusConstruction())) {
//			ct dang thuc hien & da hoan thanh
//			hang muc da hoan thanh
        if ("3".equalsIgnoreCase(obj.getStatus())) {
            reCalculateValueWorkItemAndConstruction(obj);
        }
//		} else if ("4".equalsIgnoreCase(obj.getStatusConstruction()) && "2".equalsIgnoreCase(obj.getObstructedState())) {
////			ct vuong
//			reCalculateValueWorkItemAndConstruction(obj);
//		}
        updateCompletePercentTask(obj);
    }

    public void cancelApproveQuantityByDay(WorkItemDetailDTO obj, HttpServletRequest request) {
//		KttsUserSession objUser = (KttsUserSession) request.getSession()
//				.getAttribute("kttsUserSession");
//		Long userId = objUser.getVpsUserInfo().getSysUserId();
        List<ConstructionTaskDailyDTO> taskDailyLst = obj.getConstructionTaskDailyLst();
        for (int i = 0; i < taskDailyLst.size(); i++) {
            taskDailyLst.get(i).setConfirm("2");
            quantityConstructionDAO.updateConstructionTaskDaily(taskDailyLst.get(i), false);
        }
//		if ("3".equalsIgnoreCase(obj.getStatusConstruction()) || "5".equalsIgnoreCase(obj.getStatusConstruction())) {
        if ("3".equalsIgnoreCase(obj.getStatus())) {
            reCalculateValueWorkItemAndConstruction(obj);
        }
//		} else if ("4".equalsIgnoreCase(obj.getStatusConstruction()) && "2".equalsIgnoreCase(obj.getObstructedState())) {
////			ct vuong
//			reCalculateValueWorkItemAndConstruction(obj);
//		}
        updateCompletePercentTask(obj);
    }

    private void reCalculateValueWorkItemAndConstruction(WorkItemDetailDTO obj) {
        quantityConstructionDAO.approveQuantityWorkItem(obj);
        quantityConstructionDAO.recalculateValueConstruction(obj);
    }

    public String exportConstructionTaskDaily(WorkItemDetailDTO obj, HttpServletRequest request) throws Exception {
        obj.setPage(1L);
        obj.setPageSize(null);
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Export_sanluong_ngay.xlsx"));
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
                udir.getAbsolutePath() + File.separator + "Export_sanluong_ngay.xlsx");
        List<String> provinceListId = PermissionUtils.getListIdInDomainData(Constant.OperationKey.VIEW,
                Constant.AdResourceKey.VIEW_QUANTITY_DAILY, request);
        List<WorkItemDetailDTO> data = new ArrayList<WorkItemDetailDTO>();
        if (provinceListId != null && !provinceListId.isEmpty())
            data = quantityConstructionDAO.doSearchQuantity(obj, provinceListId);
        XSSFSheet sheet = workbook.getSheetAt(0);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MMM-dd");
        if (data != null && !data.isEmpty()) {
            XSSFCellStyle style = ExcelUtils.styleText(sheet);
            // HuyPQ-17/08/2018-edit-start
            XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
            styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));

            XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
            XSSFCreationHelper createHelper = workbook.getCreationHelper();
            styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
            // HuyPQ-17/08/2018-edit-end

            styleNumber.setAlignment(HorizontalAlignment.RIGHT);
            styleDate.setAlignment(HorizontalAlignment.CENTER);
            int i = 2;
            for (WorkItemDetailDTO dto : data) {
//				String dateComplete = "";
//				if (dto.getDateDo() != null)
//					dateComplete = sdf.format(dto.getDateDo());
                Row row = sheet.createRow(i++);
                Cell cell = row.createCell(0, CellType.STRING);
                cell.setCellValue("" + (i - 2));
                cell.setCellStyle(styleNumber);
                cell = row.createCell(1, CellType.STRING);
                cell.setCellValue((dto.getDateDo() != null) ? dto.getDateDo() : null);
                cell.setCellStyle(styleDate);
                cell = row.createCell(2, CellType.STRING);
                cell.setCellValue((dto.getSysGroupName() != null) ? dto.getSysGroupName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(3, CellType.STRING);
                cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : "");
                cell.setCellStyle(style);

                cell = row.createCell(4, CellType.STRING);
                cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
                cell.setCellStyle(style);

                cell = row.createCell(5, CellType.STRING);
                cell.setCellValue((dto.getWorkItemName() != null) ? dto.getWorkItemName() : "");
                cell.setCellStyle(style);

                cell = row.createCell(6, CellType.STRING);
                cell.setCellValue((dto.getTaskName() != null) ? dto.getTaskName() : "");
                cell.setCellStyle(style);
                cell = row.createCell(7, CellType.STRING);
                cell.setCellValue((dto.getUserName() != null) ? dto.getUserName() : "");
                cell.setCellStyle(style);
                // HuyPQ-17/08/2018-edit-start
                cell = row.createCell(8, CellType.NUMERIC);
                cell.setCellValue((dto.getAmount() != null) ? dto.getAmount() : 0);
                cell.setCellStyle(styleNumber);

                cell = row.createCell(9, CellType.NUMERIC);
                cell.setCellValue((dto.getQuantity() != null) ? dto.getQuantity() : 0);
                cell.setCellStyle(styleNumber);
                // HuyPQ-17/08/2018-edit-end
                cell = row.createCell(10, CellType.STRING);
                cell.setCellValue(getStringForStatus(dto.getConfirm()));
                cell.setCellStyle(style);
            }
        }
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Export_sanluong_ngay.xlsx");
        return path;
    }

    private String getStringForStatus(String status) {
        // TODO Auto-generated method stub
        if ("1".equals(status)) {
            return "Đã xác nhận";
        } else if ("2".equals(status)) {
            return "Đã từ chối";
        } else if ("0".equals(status)) {
            return "Chưa xác nhận";
        }
        return null;
    }

    private String numberFormat(double value) {
        DecimalFormat myFormatter = new DecimalFormat("###,###.####");
        // NumberFormat numEN = NumberFormat.getPercentInstance();
        String percentageEN = myFormatter.format(value);

        return percentageEN;
    }

    public Long checkPermissionsApproved(WorkItemDetailDTO obj, Long sysGroupId, HttpServletRequest request) {
        if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.APPROVED,
                Constant.AdResourceKey.VIEW_QUANTITY_DAILY, request)) {
            throw new IllegalArgumentException("Bạn không có quyền xác nhận");
        }
        if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.APPROVED,
                Constant.AdResourceKey.VIEW_QUANTITY_DAILY, obj.getCatProvinceId(), request)) {
            throw new IllegalArgumentException("Bạn không có quyền xác nhận cho trạm/tuyến này");
        }
        try {
            return 0l;
        } catch (Exception e) {
            return 1l;
        }
    }

    public Long checkPermissionsCancelConfirm(WorkItemDetailDTO obj, Long sysGroupId, HttpServletRequest request) {

        if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.UNDO, Constant.AdResourceKey.VIEW_QUANTITY_DAILY,
                request)) {
            throw new IllegalArgumentException("Bạn không có quyền hủy xác nhận");
        }
        if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.UNDO,
                Constant.AdResourceKey.VIEW_QUANTITY_DAILY, obj.getCatProvinceId(), request)) {
            throw new IllegalArgumentException("Bạn không có quyền hủy xác nhận cho trạm/tuyến này");
        }
        try {
            return 0l;
        } catch (Exception e) {
            return 1l;
        }
    }

    public Object getListImage(WorkItemDetailDTO obj) throws Exception {
        if (obj.getConstructionTaskId() != null) {
            UtilAttachDocumentDTO file = new UtilAttachDocumentDTO();
            file.setCreatedDate(obj.getDateDo());
            file.setType("44");
            file.setObjectId(obj.getConstructionTaskId());
//			file.setConfirm(obj.getConfirm());
            List<UtilAttachDocumentDTO> listImage = utilAttachDocumentDAO.doSearch(file);
            if (listImage != null && !listImage.isEmpty()) {
                for (UtilAttachDocumentDTO dto : listImage) {
                    dto.setBase64String(ImageUtil.convertImageToBase64(folder2Upload + (dto.getFilePath())));
                    dto.setFilePath(UEncrypt.encryptFileUploadPath(dto.getFilePath()));
                }
            }
            obj.setListImage(listImage);
        }
        return obj;
    }

    public void rejectQuantityByDay(WorkItemDetailDTO obj, HttpServletRequest request) {
        List<ConstructionTaskDailyDTO> taskDailyLst = obj.getConstructionTaskDailyLst();
        for (int i = 0; i < taskDailyLst.size(); i++) {
            taskDailyLst.get(i).setConfirm("2");
            quantityConstructionDAO.updateConstructionTaskDaily(taskDailyLst.get(i), false);
        }
        updateCompletePercentTask(obj);
    }

    private void updateCompletePercentTask(WorkItemDetailDTO obj) {
        ConstructionTaskDTO criteria = new ConstructionTaskDTO();
        criteria.setStatus(obj.getStatusConstructionTask());
        criteria.setConstructionTaskId(obj.getConstructionTaskId());
        criteria.setAmount(obj.getAmountConstruction());
        criteria.setCatTaskId(obj.getCatTaskId());
        criteria.setWorkItemId(obj.getWorkItemId());
        criteria.setPath(obj.getPath());
        int sttUpdate = constructionTaskDAO.updateConstructionTask(criteria);
        log.info("hnx complete percent contruction task: " + constructionTaskDAO.getCompletePercent());
        if (constructionTaskDAO.getCompletePercent() < 100 && sttUpdate != 0) {
//			case wi hoan thanh
            if (StringUtils.isNotEmpty(obj.getStatus()) && "3".equals(obj.getStatus())) {
                obj.setStatus("2");
                sttUpdate = workItemDAO.updateStatusWorkItem(obj);
            }
            if ("5".equals(obj.getStatusConstruction())) {
                obj.setStatusConstruction("3");
                workItemDAO.updateStatusConstruction(obj.getConstructionId(), obj.getStatusConstruction());
            }
        }
    }

    public void validPriceConstruction(WorkItemDetailDTO obj) {
        if (obj.getPrice() == null) {
            throw new IllegalArgumentException("Công trình chưa nhập đơn giá, vui lòng nhập đơn giá");
        }
        if (obj.getAmountConstruction() == null) {
            throw new IllegalArgumentException("Công trình chưa nhập độ dài tuyến");
        }
        List<ConstructionTaskDailyDTO> taskDailyLst = obj.getConstructionTaskDailyLst();
        double totalAmount = 0;
        Double totalAmountOld = quantityConstructionDAO.sumAmountConstructionTask(taskDailyLst,
                obj.getConstructionId());
        if (totalAmountOld != null && totalAmountOld.doubleValue() > 0) {
            totalAmount += totalAmountOld;
        }
        for (ConstructionTaskDailyDTO item : taskDailyLst) {
            if (item.getAmount() != null)
                totalAmount += item.getAmount();
        }
        if (totalAmount > obj.getAmountConstruction()) {
            throw new IllegalArgumentException("Giá trị bạn vừa nhập vượt quá độ dài tuyến");
        }
    }

    public List<ConstructionTaskDailyDTO> getDetailTaskDaily(WorkItemDetailDTO obj) {
        List<ConstructionTaskDailyDTO> lsDaily = quantityConstructionDAO.getConstructionTaskDaily(obj);
        return lsDaily;
    }
}
