package com.viettel.aio.business;

import com.google.common.collect.Lists;
import com.viettel.aio.bo.BiddingPackageBO;
import com.viettel.aio.dao.BiddingPackageDAO;
import com.viettel.aio.dto.BiddingPackageDTO;
import com.viettel.aio.dto.ExcelErrorDTO;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import java.io.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Service("biddingPackageBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class BiddingPackageBusinessImpl
        extends
        BaseFWBusinessImpl<BiddingPackageDAO, BiddingPackageDTO, BiddingPackageBO>
        implements BiddingPackageBusiness {
    static Logger LOGGER = LoggerFactory
            .getLogger(BiddingPackageBusinessImpl.class);
    @Value("${folder_upload}")
    private String folder2Upload;

    @Autowired
    private BiddingPackageDAO biddingPackageDAO;

    @Context
    HttpServletRequest request;
    @Autowired
    private UserRoleBusinessImpl userRoleBusinessImpl;

    //cột cần bắt validate trong file excel
    int[] validateCol = {1, 2, 3, 6};

    HashMap<Integer, String> colName = new HashMap();

    {
        colName.put(1, "Mã gói thầu");
        colName.put(2, "Tên gói thầu");
        colName.put(3, "Hình thức đấu thầu");
        colName.put(4, "Loại chủ đầu tư");
        colName.put(5, "Ngày ký");
        colName.put(6, "Giá trị");
        colName.put(7, "Nội dung");
    }

    HashMap<Integer, String> colAlias = new HashMap();

    {
        colAlias.put(1, "B");
        colAlias.put(2, "C");
        colAlias.put(3, "D");
        colAlias.put(4, "E");
        colAlias.put(5, "F");
        colAlias.put(6, "G");
        colAlias.put(7, "H");
        colAlias.put(8, "I");
        colAlias.put(9, "J");
        colAlias.put(10, "K");
        colAlias.put(11, "L");
        colAlias.put(12, "M");
        colAlias.put(13, "N");
    }

    public BiddingPackageBusinessImpl() {
        tModel = new BiddingPackageBO();
        tDAO = biddingPackageDAO;
    }

    @Override
    public BiddingPackageDAO gettDAO() {
        return biddingPackageDAO;
    }

    @Override
    public long getTotal() {
        return biddingPackageDAO.count("AdClientBO", null);
    }

    public DataListDTO doSearch(BiddingPackageDTO obj) {
        List<BiddingPackageDTO> ls = biddingPackageDAO.doSearch(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

    public Boolean checkCode(String code, Long appParamId) {
        BiddingPackageDTO obj = biddingPackageDAO.getByCode(code);

        if (appParamId == null) {
            if (obj == null) {
                return true;
            } else {
                return false;
            }
        } else {
            if (obj == null) {
                return true;
            } else if (obj != null && obj.getBiddingPackageId().toString().equalsIgnoreCase(appParamId.toString())) {
                return true;
            } else {
                return false;
            }
        }

    }

    public Long updateAppParam(BiddingPackageDTO obj, KttsUserSession objUser)
            throws Exception {
//		if (objUser.getSysUserId() != null) {
//			if (!objUser.getSysUserId().equals(obj.getCreatedUserId())) {
//				throw new IllegalArgumentException(
//						"Người dùng hiện tại không có quyền sửa bản ghi này!");
//			}
//		}

//		boolean check = checkCode(obj.getCode(), obj.getBiddingPackageId());
//		if (!check) {
//			throw new IllegalArgumentException(
//					"Mã gói thầu đã tồn tại trong hệ thống!");
//		}
        return biddingPackageDAO.updateObject(obj.toModel());
    }

    public Long createAppParam(BiddingPackageDTO obj) throws Exception {

        boolean check = checkCode(obj.getCode(), null);
        if (!check) {
            throw new IllegalArgumentException(
                    "Mã gói thầu đã tồn tại trong hệ thống!");
        }
        return biddingPackageDAO.saveObject(obj.toModel());
    }

    public Long deleteAppParam(BiddingPackageDTO obj) {

        return biddingPackageDAO.updateObject(obj.toModel());
    }

    public DataListDTO getAllObject() {
        List<BiddingPackageDTO> ls = biddingPackageDAO.getAll();
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setStart(1);
        return data;
    }

    public List<BiddingPackageDTO> getForAutoComplete(BiddingPackageDTO obj) {
        return biddingPackageDAO.getForAutoComplete(obj);
    }
    //
    // public List<AppParamDTO> getForComboBox(AppParamDTO obj) {
    // return biddingPackageDAO.getForComboBox(obj);
    // }
    // public List<AppParamDTO> getForComboBox1(AppParamDTO obj) {
    // return biddingPackageDAO.getForComboBox1(obj);
    // }

    @Override
    public List<BiddingPackageDTO> getFileDrop() {
        // Hieunn
        // get list filedrop form APP_PARAM with PAR_TYPE =
        // 'SHIPMENT_DOCUMENT_TYPE' and Status=1
        // return biddingPackageDAO.getFileDrop();
        return null;
    }

    // Khong thay AppParamRsServiceIml goi den
    // public String getCode(String tableName,String param){
    // return biddingPackageDAO.getCode(tableName, param);
    // }

    public String exportExcelTemplate(String fileName) throws Exception {
        ClassLoader classloader = Thread.currentThread()
                .getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template")
                .getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath
                + fileName + ".xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        file.close();
        File out = new File(folder2Upload + File.separatorChar + fileName
                + ".xlsx");

        FileOutputStream outFile = new FileOutputStream(out);
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        String path = UEncrypt.encryptFileUploadPath(fileName + ".xlsx");
        return path;
    }


    @Override
    public List<BiddingPackageDTO> importBiddingPackage(String fileInput) throws Exception {


        List<BiddingPackageDTO> workLst = Lists.newArrayList();
        List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();
        try {

            List<BiddingPackageDTO> bidList = biddingPackageDAO.getAllCode();
            HashMap<String, String> bidSpace = new HashMap();
            for (BiddingPackageDTO bid : bidList) {
                bidSpace.put(bid.getCode(), bid.getCode());
            }

            File f = new File(fileInput);
            XSSFWorkbook workbook = new XSSFWorkbook(f);
            XSSFSheet sheet = workbook.getSheetAt(0);

            DataFormatter formatter = new DataFormatter();
            int count = 0;

            for (Row row : sheet) {
                count++;
                if (count >= 3 && checkIfRowIsEmpty(row)) continue;
                BiddingPackageDTO obj = new BiddingPackageDTO();

                if (count >= 3) {
                    String code = formatter.formatCellValue(row.getCell(1));
                    String name = formatter.formatCellValue(row.getCell(2));
                    String procurementFormsIdStr = formatter.formatCellValue(row.getCell(3));
                    String investmentOwnerTypeStr = formatter.formatCellValue(row.getCell(4));
                    String signDate = formatter.formatCellValue(row.getCell(5));
                    String price = formatter.formatCellValue(row.getCell(6));
                    String content = formatter.formatCellValue(row.getCell(7));
                    Long procurementFormsId = 0l;
                    Long investmentOwnerType = 1l;
                    validateRequiredCell(row, errorList); // kiểm tra các ô bắt buộc nhập đã dc nhập chưa

                    //validate code
                    if (validateString(code))
                        if (!isCodeExist(code, bidSpace)) {
                            obj.setCode(code);
                        } else {
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(1), colName.get(1) + " đã tồn tại");
                            errorList.add(errorDTO);
                        }

                    //validate name
//					if(validateString(name))
//						if(!isNameExist(name)){
//							obj.setName(name);
//						}
//						else{
//							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(2), colName.get(2)+ " đã tồn tại");
//							errorList.add(errorDTO);
//						}
                    if (name.trim().length() > 0) {
                        obj.setName(name);
                    } else {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(2), colName.get(2) + " không được để trống");
                        errorList.add(errorDTO);
                    }
                    //validate procurement form
                    if (validateString(procurementFormsIdStr)) {
                        if (procurementFormsIdStr.toUpperCase().trim().equals("CHỈ ĐỊNH THẦU") || procurementFormsIdStr.equals("0"))
                            procurementFormsId = 0l;
                        else if (procurementFormsIdStr.toUpperCase().trim().equals("CHÀO HÀNG CẠNH TRANH RÚT GỌN") || procurementFormsIdStr.equals("1"))
                            procurementFormsId = 1l;
                        else if (procurementFormsIdStr.toUpperCase().trim().equals("ĐẤU THẦU RỘNG RÃI TRONG NƯỚC") || procurementFormsIdStr.equals("2"))
                            procurementFormsId = 2l;
                        else if (procurementFormsIdStr.toUpperCase().trim().equals("MUA SẮM NHỎ LẺ") || procurementFormsIdStr.equals("3"))
                            procurementFormsId = 3l;
                        else if (procurementFormsIdStr.toUpperCase().trim().equals("LỰA CHỌN THẦU PHỤ THEO HỒ SƠ CHÀO GIÁ") || procurementFormsIdStr.equals("4"))
                            procurementFormsId = 4l;
                        else if (procurementFormsIdStr.toUpperCase().trim().equals("TỰ ĐẤU THẦU") || procurementFormsIdStr.equals("5"))
                            procurementFormsId = 5l;
                        else {
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3), colName.get(3) + " không hợp lệ");
                            errorList.add(errorDTO);
                        }
                        obj.setProcurementFormsId(procurementFormsId);
                    }

                    //validate investmentowner
                    if (validateString(investmentOwnerTypeStr)) {
                        if (investmentOwnerTypeStr.toUpperCase().trim().equals("ĐỐI TÁC TRONG VIETTEL") || investmentOwnerTypeStr.equals("0"))
                            investmentOwnerType = 0l;
                        else if (investmentOwnerTypeStr.toUpperCase().trim().equals("ĐỐI TÁC NGOÀI VIETTEL") || investmentOwnerTypeStr.equals("1"))
                            investmentOwnerType = 1l;
                        else {
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(4), colName.get(4) + " không hợp lệ");
                            errorList.add(errorDTO);
                        }
                        obj.setInvestmentOwnerType(investmentOwnerType);
                    }

                    //validate ngay
                    if (validateString(signDate)) {
                        SimpleDateFormat fmt = new SimpleDateFormat(
                                "dd/MM/yyyy");
                        fmt.setLenient(false);
                        try {
                            Date date = fmt.parse(signDate);
                            int year = date.getYear() + 1900;
                            if (year >= 1900 && year <= 2099)
                                obj.setSignDate(date);
                            else {
                                ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5), colName.get(5) + " không hợp lệ");
                                errorList.add(errorDTO);
                            }
                        } catch (ParseException e) {
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5), colName.get(5) + " không hợp lệ");
                            errorList.add(errorDTO);
                            e.printStackTrace();
                        }
                    }

                    //validate giá trị số
                    if (validateString(price))
                        price = price.replace(",", "");
                    if (price.length() <= 15) {
                        try {
                            if (Double.parseDouble(price) < 0) {
                                ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6), colName.get(6) + " nhỏ hơn 0");
                                errorList.add(errorDTO);
                            } else
                                obj.setPrice(Double.parseDouble(price));
                        } catch (Exception e) {
                            ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6), colName.get(6) + " không hợp lệ");
                            errorList.add(errorDTO);
                        }
                    } else {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6), colName.get(6) + " có độ dài quá giới hạn");
                        errorList.add(errorDTO);
                    }

                    if (content.trim().length() <= 2000)
                        obj.setContent(content.trim());
                    else {
                        ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(7), colName.get(7) + " có độ dài quá giới hạn");
                        errorList.add(errorDTO);
                    }

                    if (errorList.size() == 0) {
                        workLst.add(obj);
                    }
                }
            }

            if (errorList.size() > 0) {
                String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
                List<BiddingPackageDTO> emptyArray = Lists.newArrayList();
                workLst = emptyArray;
                BiddingPackageDTO errorContainer = new BiddingPackageDTO();
                errorContainer.setErrorList(errorList);
                errorContainer.setMessageColumn(8); // cột dùng để in ra lỗi
                errorContainer.setFilePathError(filePathError);
                workLst.add(errorContainer);
            }

            workbook.close();
            return workLst;

        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ExcelErrorDTO errorDTO = createError(0, "", e.toString());
            errorList.add(errorDTO);
            String filePathError = null;
            try {
                filePathError = UEncrypt.encryptFileUploadPath(fileInput);
            } catch (Exception ex) {
                LOGGER.error(e.getMessage(), e);
                errorDTO = createError(0, "", ex.toString());
                errorList.add(errorDTO);
            }
            List<BiddingPackageDTO> emptyArray = Lists.newArrayList();
            workLst = emptyArray;
            BiddingPackageDTO errorContainer = new BiddingPackageDTO();
            errorContainer.setErrorList(errorList);
            errorContainer.setMessageColumn(8); // cột dùng để in ra lỗi
            errorContainer.setFilePathError(filePathError);
            workLst.add(errorContainer);
            return workLst;
        }
    }

    public BiddingPackageDTO getByCodeForImport(BiddingPackageDTO obj) {
        return biddingPackageDAO.getByCodeForImport(obj);
    }

    public Boolean isCodeExist(String code, HashMap<String, String> bidSpace) {
        String obj = bidSpace.get(code);
        if (obj != null) {
            return true;
        } else {
            return false;
        }
    }

    public Boolean isNameExist(String name) {
        BiddingPackageDTO obj = biddingPackageDAO.getByName(name);
        if (obj != null) {
            return true;
        } else {
            return false;
        }
    }

    private ExcelErrorDTO createError(int row, String column, String detail) {
        ExcelErrorDTO err = new ExcelErrorDTO();
        err.setColumnError(column);
        err.setLineError(String.valueOf(row));
        err.setDetailError(detail);
        return err;
    }

    @SuppressWarnings("deprecation")
    private boolean checkIfRowIsEmpty(Row row) {
        if (row == null) {
            return true;
        }
        if (row.getLastCellNum() <= 0) {
            return true;
        }
        for (int cellNum = row.getFirstCellNum(); cellNum < row.getLastCellNum(); cellNum++) {
            Cell cell = row.getCell(cellNum);
            if (cell != null && cell.getCellType() != Cell.CELL_TYPE_BLANK && StringUtils.isNotBlank(cell.toString())) {
                return false;
            }
        }
        return true;
    }

    public boolean validateRequiredCell(Row row, List<ExcelErrorDTO> errorList) {
        DataFormatter formatter = new DataFormatter();
        boolean result = true;
        for (int colIndex : validateCol) {
            if (!validateString(formatter.formatCellValue(row.getCell(colIndex)))) {

                ExcelErrorDTO errorDTO = new ExcelErrorDTO();
                errorDTO.setColumnError(colAlias.get(colIndex));
                errorDTO.setLineError(String.valueOf(row.getRowNum() + 1));
                errorDTO.setDetailError(colName.get(colIndex) + " chưa nhập");
                errorList.add(errorDTO);
                result = false;
            }
        }
        return result;
    }

    /**
     * @param str
     * @overview return true if string is not null and not empty
     */
    public boolean validateString(String str) {
        return (str != null && str.length() > 0);
    }
}
