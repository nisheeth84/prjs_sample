package com.viettel.coms.business;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Calendar;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFCreationHelper;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import com.viettel.coms.bo.SynStockDailyImportExportBO;
import com.viettel.coms.dao.ConstructionTaskDAO;
import com.viettel.coms.dao.SynStockDailyImportExportDAO;
import com.viettel.coms.dto.ConstructionDTO;
import com.viettel.coms.dto.GoodsDTO;
import com.viettel.coms.dto.SynStockDailyImportExportDTO;
import com.viettel.coms.dto.SynStockDailyImportExportRequest;
import com.viettel.coms.dto.SynStockDailyRemainDTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.DateTimeUtils;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;
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
import java.text.SimpleDateFormat;
import java.util.*;

//VietNT_20190104_created
@Service("synStockDailyImportExportBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class SynStockDailyImportExportBusinessImpl extends BaseFWBusinessImpl<SynStockDailyImportExportDAO, SynStockDailyImportExportDTO, SynStockDailyImportExportBO> implements SynStockDailyImportExportBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(SynStockDailyImportExportBusinessImpl.class);

    @Autowired
    private SynStockDailyImportExportDAO synStockDailyImportExportDAO;
    @Autowired
	private ConstructionTaskDAO constructionTaskDAO;
    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;
    
    @Context
    HttpServletRequest request;

    private final String GOODS_DEBT_CONFIRM_DETAIL_REPORT = "Mau_BCCT_dau_vao.xlsx";
    private final String GOODS_DEBT_CONFIRM_GENERAL_REPORT = "Mau_BCTH_dau_vao.xlsx";
    private final String CONTRACT_PERFORMANCE_REPORT = "Tien_do_thi_cong_theo_hop_dong.xlsx";
    private final String IER_GOODS_BY_CONSTRUCTION = "Bao_cao_chi_tiet_nhap_xuat_ton_vat_tu_A_cap_theo_cong_trinh.xlsx";
    public DataListDTO doSearchDebt(SynStockDailyRemainDTO obj){
    	List<SynStockDailyRemainDTO> ls = synStockDailyImportExportDAO.doSearchDebt(obj);
    	/*
    	for(SynStockDailyRemainDTO a : ls) {
    		a.setText(a.getSysGroupCode() + "-" + a.getSysGroupName());
    		a.setNumberTonCuoiKy(a.getNumberTonDauKy() + a.getNumberNhapTrongKy() - a.getNumberNghiemThuDoiSoat4A() - a.getNumberTraDenBu());
    		a.setTotalMoneyTonCuoiKy(a.getTotalMoneyTonDauKy() + a.getTotalMoneyNhapTrongKy() - a.getTotalMoneyNghiemThuDoiSoat4A() - a.getTotalMoneyTraDenBu());
    	}
    	*/
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
    }
    
    public DataListDTO doSearchImportExportTonACap(SynStockDailyRemainDTO obj){
    	List<SynStockDailyRemainDTO> ls = synStockDailyImportExportDAO.doSearchImportExportTonACap(obj);
    	/*
    	for(SynStockDailyRemainDTO a : ls) {
    		a.setNumberTonCuoiKy(a.getNumberTonDauKy() + a.getNumberNhapTrongKy() - a.getNumberNghiemThuDoiSoat4A() - a.getNumberTraDenBu());
    		a.setTotalMoneyTonCuoiKy(a.getTotalMoneyTonDauKy() + a.getTotalMoneyNhapTrongKy() - a.getTotalMoneyNghiemThuDoiSoat4A() - a.getTotalMoneyTraDenBu());
    	}
    	*/
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
    }
    
    public DataListDTO doSearchCompareReport(SynStockDailyRemainDTO obj){
    	List<SynStockDailyRemainDTO> ls = synStockDailyImportExportDAO.doSearchCompareReport(obj);
    	for(SynStockDailyRemainDTO a : ls) {
    		a.setNumberChuaThuHoi(a.getNumberXuatKho() - a.getNumberThucTeThiCong() - a.getNumberThuHoi());
    		a.setTotalMoneyChuaThuHoi(a.getTotalMoneyXuatKho() - a.getTotalMoneyThucTeThiCong() - a.getTotalMoneyThuHoi());
    	}
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
    }
    //Export excel tổng hợp công nợ a cấp
    public String exportExcelDebt(SynStockDailyRemainDTO obj, HttpServletRequest request,String userName) throws Exception {
    	obj.setPage(1L);
		obj.setPageSize(null);
		String sysGroupName = constructionTaskDAO.getDataSysGroupNameByUserName(userName);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Bao_cao_TongHop_CongNo_ACap.xlsx"));
		XSSFWorkbook workbook = new XSSFWorkbook(file);
		file.close();
		Calendar cal = Calendar.getInstance();
		String uploadPath = folderUpload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
				+ File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
				+ File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
				+ cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
				+ cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		File udir = new File(uploadPath);
		if (!udir.exists()) {
			udir.mkdirs();
		}
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "Bao_cao_TongHop_CongNo_ACap.xlsx");
		List<SynStockDailyRemainDTO> data  = synStockDailyImportExportDAO.doSearchDebt(obj);
		XSSFSheet sheet = workbook.getSheetAt(0);
		XSSFCellStyle stt = ExcelUtils.styleText(sheet);
		stt.setAlignment(HorizontalAlignment.CENTER);
		
		XSSFCellStyle sttNoBorder = ExcelUtils.styleBold(sheet);
		sttNoBorder.setAlignment(HorizontalAlignment.CENTER);
		sttNoBorder.setVerticalAlignment(VerticalAlignment.CENTER);
		sttNoBorder.setAlignment(XSSFCellStyle.ALIGN_CENTER);
		sttNoBorder.setBorderLeft(XSSFCellStyle.BORDER_NONE);
		sttNoBorder.setBorderTop(XSSFCellStyle.BORDER_NONE);
		sttNoBorder.setBorderRight(XSSFCellStyle.BORDER_NONE);
		sttNoBorder.setBorderRight(XSSFCellStyle.BORDER_NONE);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			// HuyPQ-17/08/2018-edit-start
			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			// HuyPQ-17/08/2018-edit-end
			// HuyPQ-22/08/2018-edit-start
			XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			styleDate.setAlignment(HorizontalAlignment.CENTER);
			
//			XSSFCellStyle styleBold = ExcelUtils.styleBold(sheet);
//			XSSFCellStyle styleTotal = ExcelUtils.styleBold(sheet);
//			styleTotal.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			
//			Row rowS2 = sheet.createRow(4);
//			Cell cellS2 = rowS2.createCell(0, CellType.STRING);
//			cellS2.setCellValue("Tháng  " + (DateTimeUtils.convertDateToString(obj.getDateFrom(), "MM/yyyy")));
//			cellS2.setCellStyle(stt);
			
			Row rowS12 = sheet.createRow(5);
			Cell cellS12 = rowS12.createCell(0, CellType.STRING);
			cellS12.setCellValue("Từ ngày  " + (DateTimeUtils.convertDateToString(obj.getDateFrom(), "dd/MM/yyyy")) + " đến " + (DateTimeUtils.convertDateToString(obj.getDateTo(), "dd/MM/yyyy")));
			cellS12.setCellStyle(sttNoBorder);
			int i = 9;
			int rowNum = i;
			double countNumberTonDauKy = 0;
			double countTotalMoneyTonDauKy= 0;
			double countNumberNhapTrongKy= 0;
			double countTotalMoneyNhapTrongKy= 0;
			double countNumberNghiemThuDoiSoat4A= 0;
			double countTotalMoneyNghiemThuDoiSoat4A= 0;
			double countNumberTraDenBu= 0;
			double countTotalMoneyTraDenBu= 0;
			double countNumberTonCuoiKy= 0;
			double countTotalMoneyTonCuoiKy= 0;
			SynStockDailyRemainDTO objCount = null;
			/*
			for (SynStockDailyRemainDTO dto : data) {
				dto.setText(dto.getSysGroupCode() + "-" + dto.getSysGroupName());
				dto.setNumberTonCuoiKy(dto.getNumberTonDauKy() + dto.getNumberNhapTrongKy() - dto.getNumberNghiemThuDoiSoat4A() - dto.getNumberTraDenBu());
				dto.setTotalMoneyTonCuoiKy(dto.getTotalMoneyTonDauKy() + dto.getTotalMoneyNhapTrongKy() - dto.getTotalMoneyNghiemThuDoiSoat4A() - dto.getTotalMoneyTraDenBu());
			}
			*/
			for (SynStockDailyRemainDTO dto : data) {
				countNumberTonDauKy += dto.getNumberTonDauKy();
				countTotalMoneyTonDauKy += dto.getTotalMoneyTonDauKy();
				countNumberNhapTrongKy += dto.getNumberNhapTrongKy();
				countTotalMoneyNhapTrongKy += dto.getTotalMoneyNhapTrongKy();
				countNumberNghiemThuDoiSoat4A += dto.getNumberNghiemThuDoiSoat4A();
				countTotalMoneyNghiemThuDoiSoat4A += dto.getTotalMoneyNghiemThuDoiSoat4A();
				countNumberTraDenBu += dto.getNumberTraDenBu();
				countTotalMoneyTraDenBu += dto.getTotalMoneyTraDenBu();
				countNumberTonCuoiKy += dto.getNumberTonCuoiKy();
				countTotalMoneyTonCuoiKy += dto.getTotalMoneyTonCuoiKy();
			}
			for (SynStockDailyRemainDTO dto : data) {
				rowNum++;
				if (i == 9) {
					objCount = dto;
					objCount.setCountNumberTonDauKy(countNumberTonDauKy);
					objCount.setCountTotalMoneyTonDauKy(countTotalMoneyTonDauKy);
					objCount.setCountNumberNhapTrongKy(countNumberNhapTrongKy);
					objCount.setCountTotalMoneyNhapTrongKy(countTotalMoneyNhapTrongKy);
					objCount.setCountNumberNghiemThuDoiSoat4A(countNumberNghiemThuDoiSoat4A);
					objCount.setCountTotalMoneyNghiemThuDoiSoat4A(countTotalMoneyNghiemThuDoiSoat4A);
					objCount.setCountNumberTraDenBu(countNumberTraDenBu);
					objCount.setCountTotalMoneyTraDenBu(countTotalMoneyTraDenBu);
					objCount.setCountNumberTonCuoiKy(countNumberTonCuoiKy);
					objCount.setCountTotalMoneyTonCuoiKy(countTotalMoneyTonCuoiKy);
				}
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 9));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getText() != null) ? dto.getText() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue(dto.getNumberTonDauKy());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue(dto.getTotalMoneyTonDauKy());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue(dto.getNumberNhapTrongKy());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue(dto.getTotalMoneyNhapTrongKy());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue(dto.getNumberNghiemThuDoiSoat4A());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue(dto.getTotalMoneyNghiemThuDoiSoat4A());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue(dto.getNumberTraDenBu());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue(dto.getTotalMoneyTraDenBu());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue(dto.getNumberTonCuoiKy());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue(dto.getTotalMoneyTonCuoiKy());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(12, CellType.STRING);
//				cell.setCellValue(dto.getDescription() : "");
				cell.setCellStyle(style);
			}
			
			Row row = sheet.createRow(i++);
			Cell cell0 = row.createCell(0, CellType.STRING);
			cell0.setCellValue("");
			cell0.setCellStyle(style);
			Cell cell1 = row.createCell(1, CellType.STRING);
			cell1.setCellValue("Tổng");
			cell1.setCellStyle(style);
			Cell cell = row.createCell(2, CellType.STRING);
			cell.setCellValue(objCount == null ? 0F : objCount.getCountNumberTonDauKy());
			cell.setCellStyle(styleNumber);
			Cell cellmdk = row.createCell(3, CellType.STRING);
			cellmdk.setCellValue(objCount == null ? 0F : objCount.getCountTotalMoneyTonDauKy());
			cellmdk.setCellStyle(styleNumber);
			Cell cellntk = row.createCell(4, CellType.STRING);
			cellntk.setCellValue(objCount == null ? 0F : objCount.getCountNumberNhapTrongKy());
			cellntk.setCellStyle(styleNumber);
			Cell cellWI = row.createCell(5, CellType.STRING);
			cellWI.setCellValue(objCount == null ? 0F : objCount.getCountTotalMoneyNhapTrongKy());
			cellWI.setCellStyle(styleNumber);
			Cell cellQ = row.createCell(6, CellType.STRING);
			cellQ.setCellValue(objCount == null ? 0F : objCount.getCountNumberNghiemThuDoiSoat4A());
			cellQ.setCellStyle(styleNumber);
			Cell cellds = row.createCell(7, CellType.STRING);
			cellds.setCellValue(objCount == null ? 0F : objCount.getCountTotalMoneyNghiemThuDoiSoat4A());
			cellds.setCellStyle(styleNumber);
			Cell celldb = row.createCell(8, CellType.STRING);
			celldb.setCellValue(objCount == null ? 0F : objCount.getCountNumberTraDenBu());
			celldb.setCellStyle(styleNumber);
			Cell cellmdb = row.createCell(9, CellType.STRING);
			cellmdb.setCellValue(objCount == null ? 0F : objCount.getCountTotalMoneyTraDenBu());
			cellmdb.setCellStyle(styleNumber);
			Cell celltck = row.createCell(10, CellType.STRING);
			celltck.setCellValue(objCount == null ? 0F : objCount.getCountNumberTonCuoiKy());
			celltck.setCellStyle(styleNumber);
			Cell cellmck = row.createCell(11, CellType.STRING);
			cellmck.setCellValue(objCount == null ? 0F : objCount.getCountTotalMoneyTonCuoiKy());
			cellmck.setCellStyle(styleNumber);
			Cell cell12 = row.createCell(12, CellType.STRING);
			cell12.setCellValue("");
			cell12.setCellStyle(style);
			
//			CellRangeAddress cellMergeDV = new CellRangeAddress(rowNum+2, rowNum+2,1,4);
//			CellRangeAddress cellMergeTCT = new CellRangeAddress(rowNum+2, rowNum+2,7,12);
//			CellRangeAddress cellMerge1 = new CellRangeAddress(rowNum+3, rowNum+3,3,4);
//			CellRangeAddress cellMerge2 = new CellRangeAddress(rowNum+3, rowNum+3,7,9);
//			CellRangeAddress cellMerge3 = new CellRangeAddress(rowNum+3, rowNum+3,10,12);
//			sheet.addMergedRegion(cellMergeDV);
//			sheet.addMergedRegion(cellMergeTCT);
//			sheet.addMergedRegion(cellMerge1);
//			sheet.addMergedRegion(cellMerge2);
//			sheet.addMergedRegion(cellMerge3);
//			
//			Row rowText1 = sheet.createRow(rowNum +2);
//			Cell cellText1 = rowText1.createCell(1, CellType.STRING);
//			cellText1.setCellValue(sysGroupName == null? "" : sysGroupName);
//			cellText1.setCellStyle(sttNoBorder);
//			
//			Row rowText2 = sheet.getRow(rowNum +2);
//			Cell cellText2 = rowText2.createCell(7, CellType.STRING);
//			cellText2.setCellValue("TỔNG CÔNG TY CP CÔNG TRÌNH VIETTEL");
//			cellText2.setCellStyle(sttNoBorder);
//			
//			Row rowText3 = sheet.createRow(rowNum +3);
//			Cell cellText3 = rowText3.createCell(1, CellType.STRING);
//			cellText3.setCellValue("NHÂN VIÊN ĐỐI SOÁT");
//			cellText3.setCellStyle(sttNoBorder);
//			
//			Row rowText4 = sheet.getRow(rowNum +3);
//			Cell cellText4 = rowText4.createCell(3, CellType.STRING);
//			cellText4.setCellValue("THỦ TRƯỞNG ĐƠN VỊ");
//			cellText4.setCellStyle(sttNoBorder);
//			
//			Row rowText5 = sheet.getRow(rowNum +3);
//			Cell cellText5 = rowText5.createCell(7, CellType.STRING);
//			cellText5.setCellValue("PHÒNG QUẢN LÝ TÀI SẢN");
//			cellText5.setCellStyle(sttNoBorder);
//			
//			Row rowText6 = sheet.getRow(rowNum +3);
//			Cell cellText6 = rowText6.createCell(10, CellType.STRING);
//			cellText6.setCellValue("P.TỔNG GIÁM ĐỐC PHỤ TRÁCH");
//			cellText6.setCellStyle(sttNoBorder);
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();
		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "Bao_cao_TongHop_CongNo_ACap.xlsx");
		return path;
	}
    //Export excel nhap-xuat-ton a cap
    public String exportExcelImportExportTonACap(SynStockDailyRemainDTO obj, HttpServletRequest request,String userName) throws Exception {
    	obj.setPage(1L);
		obj.setPageSize(null);
		String sysGroupName = constructionTaskDAO.getDataSysGroupNameByUserName(userName);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "BaoCaoNhapXuatTonACap.xlsx"));
		XSSFWorkbook workbook = new XSSFWorkbook(file);
		file.close();
		Calendar cal = Calendar.getInstance();
		String uploadPath = folderUpload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
				+ File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
				+ File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
				+ cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
				+ cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		File udir = new File(uploadPath);
		if (!udir.exists()) {
			udir.mkdirs();
		}
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "BaoCaoNhapXuatTonACap.xlsx");
		List<SynStockDailyRemainDTO> data  = synStockDailyImportExportDAO.doSearchImportExportTonACap(obj);
		XSSFSheet sheet = workbook.getSheetAt(0);
		XSSFCellStyle stt = ExcelUtils.styleText(sheet);
		stt.setAlignment(HorizontalAlignment.CENTER);
		
		XSSFCellStyle sttNoBorder = ExcelUtils.styleBold(sheet);
		sttNoBorder.setAlignment(HorizontalAlignment.CENTER);
		sttNoBorder.setVerticalAlignment(VerticalAlignment.CENTER);
		sttNoBorder.setAlignment(XSSFCellStyle.ALIGN_CENTER);
		sttNoBorder.setBorderLeft(XSSFCellStyle.BORDER_NONE);
		sttNoBorder.setBorderTop(XSSFCellStyle.BORDER_NONE);
		sttNoBorder.setBorderRight(XSSFCellStyle.BORDER_NONE);
		sttNoBorder.setBorderRight(XSSFCellStyle.BORDER_NONE);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			// HuyPQ-17/08/2018-edit-start
			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			// HuyPQ-17/08/2018-edit-end
			// HuyPQ-22/08/2018-edit-start
			XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			styleDate.setAlignment(HorizontalAlignment.CENTER);
			
//			XSSFCellStyle styleBold = ExcelUtils.styleBold(sheet);
//			XSSFCellStyle styleTotal = ExcelUtils.styleBold(sheet);
//			styleTotal.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			
//			Row rowS2 = sheet.createRow(4);
//			Cell cellS2 = rowS2.createCell(0, CellType.STRING);
//			cellS2.setCellValue("Tháng  " + (DateTimeUtils.convertDateToString(obj.getDateFrom(), "MM/yyyy")));
//			cellS2.setCellStyle(stt);
			
			Row rowS12 = sheet.createRow(4);
			Cell cellS12 = rowS12.createCell(0, CellType.STRING);
			cellS12.setCellValue("Từ ngày  " + (DateTimeUtils.convertDateToString(obj.getDateFrom(), "dd/MM/yyyy")) + " đến " + (DateTimeUtils.convertDateToString(obj.getDateTo(), "dd/MM/yyyy")));
			cellS12.setCellStyle(sttNoBorder);
			int i = 8;
			int rowNum = i;
			double countNumberTonDauKy = 0F;
			double countTotalMoneyTonDauKy= 0F;
			double countNumberNhapTrongKy= 0F;
			double countTotalMoneyNhapTrongKy= 0F;
			double countNumberNghiemThuDoiSoat4A= 0F;
			double countTotalMoneyNghiemThuDoiSoat4A= 0F;
			double countNumberTraDenBu= 0F;
			double countTotalMoneyTraDenBu= 0F;
			double countNumberTonCuoiKy= 0F;
			double countTotalMoneyTonCuoiKy= 0F;
			SynStockDailyRemainDTO objCount = null;
			/*
			for (SynStockDailyRemainDTO dto : data) {
				dto.setText(dto.getSysGroupCode() + "-" + dto.getSysGroupName());
				dto.setNumberTonCuoiKy(dto.getNumberTonDauKy() + dto.getNumberNhapTrongKy() - dto.getNumberNghiemThuDoiSoat4A() - dto.getNumberTraDenBu());
				dto.setTotalMoneyTonCuoiKy(dto.getTotalMoneyTonDauKy() + dto.getTotalMoneyNhapTrongKy() - dto.getTotalMoneyNghiemThuDoiSoat4A() - dto.getTotalMoneyTraDenBu());
			}
			*/
			for (SynStockDailyRemainDTO dto : data) {
				countNumberTonDauKy += dto.getNumberTonDauKy();
				countTotalMoneyTonDauKy += dto.getTotalMoneyTonDauKy();
				countNumberNhapTrongKy += dto.getNumberNhapTrongKy();
				countTotalMoneyNhapTrongKy += dto.getTotalMoneyNhapTrongKy();
				countNumberNghiemThuDoiSoat4A += dto.getNumberNghiemThuDoiSoat4A();
				countTotalMoneyNghiemThuDoiSoat4A += dto.getTotalMoneyNghiemThuDoiSoat4A();
				countNumberTraDenBu += dto.getNumberTraDenBu();
				countTotalMoneyTraDenBu += dto.getTotalMoneyTraDenBu();
				countNumberTonCuoiKy += dto.getNumberTonCuoiKy();
				countTotalMoneyTonCuoiKy += dto.getTotalMoneyTonCuoiKy();
			}
			for (SynStockDailyRemainDTO dto : data) {
				rowNum++;
				if (i == 8) {
					objCount = dto;
					objCount.setCountNumberTonDauKy(countNumberTonDauKy);
					objCount.setCountTotalMoneyTonDauKy(countTotalMoneyTonDauKy);
					objCount.setCountNumberNhapTrongKy(countNumberNhapTrongKy);
					objCount.setCountTotalMoneyNhapTrongKy(countTotalMoneyNhapTrongKy);
					objCount.setCountNumberNghiemThuDoiSoat4A(countNumberNghiemThuDoiSoat4A);
					objCount.setCountTotalMoneyNghiemThuDoiSoat4A(countTotalMoneyNghiemThuDoiSoat4A);
					objCount.setCountNumberTraDenBu(countNumberTraDenBu);
					objCount.setCountTotalMoneyTraDenBu(countTotalMoneyTraDenBu);
					objCount.setCountNumberTonCuoiKy(countNumberTonCuoiKy);
					objCount.setCountTotalMoneyTonCuoiKy(countTotalMoneyTonCuoiKy);
				}
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 8));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getGoodsName() != null) ? dto.getGoodsName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getGoodsCode() != null) ? dto.getGoodsCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getGoodsUnitName() != null) ? dto.getGoodsUnitName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue(dto.getNumberTonDauKy());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue(dto.getTotalMoneyTonDauKy());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue(dto.getNumberNhapTrongKy());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue(dto.getTotalMoneyNhapTrongKy());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue(dto.getNumberNghiemThuDoiSoat4A());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue(dto.getTotalMoneyNghiemThuDoiSoat4A());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue(dto.getNumberTraDenBu());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(12, CellType.STRING);
				cell.setCellValue(dto.getTotalMoneyTraDenBu());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(13, CellType.STRING);
				cell.setCellValue(dto.getNumberTonCuoiKy());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(14, CellType.STRING);
				cell.setCellValue(dto.getTotalMoneyTonCuoiKy());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(15, CellType.STRING);
//				cell.setCellValue((dto.getDescription() != null) ? dto.getDescription() : "");
				cell.setCellStyle(style);
			}
			
			Row row = sheet.createRow(i++);
			Cell cell0 = row.createCell(0, CellType.STRING);
			cell0.setCellValue("");
			cell0.setCellStyle(style);
			Cell cell1 = row.createCell(1, CellType.STRING);
			cell1.setCellValue("Tổng");
			cell1.setCellStyle(style);
			Cell cell2 = row.createCell(2, CellType.STRING);
			cell2.setCellValue("");
			cell2.setCellStyle(style);
			Cell cell3 = row.createCell(3, CellType.STRING);
			cell3.setCellValue("");
			cell3.setCellStyle(style);
			Cell cell = row.createCell(5, CellType.STRING);
			cell.setCellValue(objCount == null ? 0F : objCount.getCountNumberTonDauKy());
			cell.setCellStyle(styleNumber);
			Cell cellmdk = row.createCell(6, CellType.STRING);
			cellmdk.setCellValue(objCount == null ? 0F : objCount.getCountTotalMoneyTonDauKy());
			cellmdk.setCellStyle(styleNumber);
			Cell cellntk = row.createCell(7, CellType.STRING);
			cellntk.setCellValue(objCount == null ? 0F : objCount.getCountNumberNhapTrongKy());
			cellntk.setCellStyle(styleNumber);
			Cell cellWI = row.createCell(8, CellType.STRING);
			cellWI.setCellValue(objCount == null ? 0F : objCount.getCountTotalMoneyNhapTrongKy());
			cellWI.setCellStyle(styleNumber);
			Cell cellQ = row.createCell(9, CellType.STRING);
			cellQ.setCellValue(objCount == null ? 0F : objCount.getCountNumberNghiemThuDoiSoat4A());
			cellQ.setCellStyle(styleNumber);
			Cell cellds = row.createCell(10, CellType.STRING);
			cellds.setCellValue(objCount == null ? 0F : objCount.getCountTotalMoneyNghiemThuDoiSoat4A());
			cellds.setCellStyle(styleNumber);
			Cell celldb = row.createCell(11, CellType.STRING);
			celldb.setCellValue(objCount == null ? 0F : objCount.getCountNumberTraDenBu());
			celldb.setCellStyle(styleNumber);
			Cell cellmdb = row.createCell(12, CellType.STRING);
			cellmdb.setCellValue(objCount == null ? 0F : objCount.getCountTotalMoneyTraDenBu());
			cellmdb.setCellStyle(styleNumber);
			Cell celltck = row.createCell(13, CellType.STRING);
			celltck.setCellValue(objCount == null ? 0F : objCount.getCountNumberTonCuoiKy());
			celltck.setCellStyle(styleNumber);
			Cell cellmck = row.createCell(14, CellType.STRING);
			cellmck.setCellValue(objCount == null ? 0F : objCount.getCountTotalMoneyTonCuoiKy());
			cellmck.setCellStyle(styleNumber);
			Cell cell15 = row.createCell(15, CellType.STRING);
			cell15.setCellValue("");
			cell15.setCellStyle(style);
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();
		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "BaoCaoNhapXuatTonACap.xlsx");
		return path;
	}
    //Export excel BBDC
    public String exportExcelCompare(SynStockDailyRemainDTO obj, HttpServletRequest request,String userName) throws Exception {
    	obj.setPage(1L);
		obj.setPageSize(null);
		String sysGroupName = constructionTaskDAO.getDataSysGroupNameByUserName(userName);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "BienBanDoiChieu4A.xlsx"));
		XSSFWorkbook workbook = new XSSFWorkbook(file);
		file.close();
		Calendar cal = Calendar.getInstance();
		String uploadPath = folderUpload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
				+ File.separator + cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1)
				+ File.separator + cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		String uploadPathReturn = File.separator + UFile.getSafeFileName(defaultSubFolderUpload) + File.separator
				+ cal.get(Calendar.YEAR) + File.separator + (cal.get(Calendar.MONTH) + 1) + File.separator
				+ cal.get(Calendar.DATE) + File.separator + cal.get(Calendar.MILLISECOND);
		File udir = new File(uploadPath);
		if (!udir.exists()) {
			udir.mkdirs();
		}
		OutputStream outFile = new FileOutputStream(udir.getAbsolutePath() + File.separator + "BienBanDoiChieu4A.xlsx");
		List<SynStockDailyRemainDTO> data  = synStockDailyImportExportDAO.doSearchCompareReport(obj);
		XSSFSheet sheet = workbook.getSheetAt(0);
		XSSFCellStyle stt = ExcelUtils.styleText(sheet);
		stt.setAlignment(HorizontalAlignment.CENTER);
		
		XSSFCellStyle sttNoBorder = ExcelUtils.styleBold(sheet);
		sttNoBorder.setAlignment(HorizontalAlignment.CENTER);
		sttNoBorder.setVerticalAlignment(VerticalAlignment.CENTER);
		sttNoBorder.setAlignment(XSSFCellStyle.ALIGN_CENTER);
		sttNoBorder.setBorderLeft(XSSFCellStyle.BORDER_NONE);
		sttNoBorder.setBorderTop(XSSFCellStyle.BORDER_NONE);
		sttNoBorder.setBorderRight(XSSFCellStyle.BORDER_NONE);
		sttNoBorder.setBorderRight(XSSFCellStyle.BORDER_NONE);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			// HuyPQ-17/08/2018-edit-start
			XSSFCellStyle styleNumber = ExcelUtils.styleNumber(sheet);
			styleNumber.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			
//			XSSFCellStyle styleBold = ExcelUtils.styleBold(sheet);
//			XSSFCellStyle styleTotal = ExcelUtils.styleBold(sheet);
//			styleTotal.setDataFormat(workbook.createDataFormat().getFormat("#,##0.000"));
			
			// HuyPQ-17/08/2018-edit-end
			// HuyPQ-22/08/2018-edit-start
			XSSFCellStyle styleDate = ExcelUtils.styleDate(sheet);
			XSSFCreationHelper createHelper = workbook.getCreationHelper();
			styleDate.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));
			// HuyPQ-end
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			styleDate.setAlignment(HorizontalAlignment.CENTER);
			
//			Row rowS1 = sheet.createRow(7);
//			Cell cellS1 = rowS1.createCell(6, CellType.STRING);
//			cellS1.setCellValue("Đơn vị thi công: ");
//			cellS1.setCellStyle(sttNoBorder);
//			
//			Row rowS2 = sheet.createRow(8);
//			Cell cellS2 = rowS2.createCell(6, CellType.STRING);
//			cellS2.setCellValue("Hợp đồng: ");
//			cellS2.setCellStyle(sttNoBorder);
//			
//			Row rowS12 = sheet.createRow(9);
//			Cell cellS12 = rowS12.createCell(0, CellType.STRING);
//			cellS12.setCellValue("Từ ngày  " + (DateTimeUtils.convertDateToString(obj.getDateFrom(), "dd/MM/yyyy")) + " đến " + (DateTimeUtils.convertDateToString(obj.getDateTo(), "dd/MM/yyyy")));
//			cellS12.setCellStyle(stt);
			int i = 14;
			int rowNum = i;
			double countNumberXuatKho = 0;
			double countTotalMoneyXuatKho= 0;
			double countNumberThucTeThiCong= 0;
			double countTotalMoneyThucTeThiCong= 0;
			double countNumberThuHoi= 0;
			double countTotalMoneyThuHoi= 0;
			double countNumberChuaThuHoi= 0;
			double countTotalMoneyChuaThuHoi= 0;
		
			SynStockDailyRemainDTO objCount = null;
			for (SynStockDailyRemainDTO dto : data) {
				dto.setNumberChuaThuHoi(dto.getNumberXuatKho() - dto.getNumberThucTeThiCong() - dto.getNumberThuHoi());
				dto.setTotalMoneyChuaThuHoi(dto.getTotalMoneyXuatKho() - dto.getTotalMoneyThucTeThiCong() - dto.getTotalMoneyThuHoi());
			}
			for (SynStockDailyRemainDTO dto : data) {
				countNumberXuatKho += dto.getNumberXuatKho();
				countTotalMoneyXuatKho += dto.getTotalMoneyXuatKho();
				countNumberThucTeThiCong += dto.getNumberThucTeThiCong();
				countTotalMoneyThucTeThiCong += dto.getTotalMoneyThucTeThiCong();
				countNumberThuHoi += dto.getNumberThuHoi();
				countTotalMoneyThuHoi += dto.getTotalMoneyThuHoi();
				countNumberChuaThuHoi += dto.getNumberChuaThuHoi();
				countTotalMoneyChuaThuHoi += dto.getTotalMoneyChuaThuHoi();
			}
			for (SynStockDailyRemainDTO dto : data) {
				rowNum++;
				if (i == 14) {
					objCount = dto;
					objCount.setCountNumberXuatKho(countNumberXuatKho);
					objCount.setCountTotalMoneyXuatKho(countTotalMoneyXuatKho);
					objCount.setCountNumberThucTeThiCong(countNumberThucTeThiCong);
					objCount.setCountTotalMoneyThucTeThiCong(countTotalMoneyThucTeThiCong);
					objCount.setCountNumberThuHoi(countNumberThuHoi);
					objCount.setCountTotalMoneyThuHoi(countTotalMoneyThuHoi);
					objCount.setCountNumberChuaThuHoi(countNumberChuaThuHoi);
					objCount.setCountTotalMoneyChuaThuHoi(countTotalMoneyChuaThuHoi);
				}
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 14));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getSynStockTransCode() != null) ? dto.getSynStockTransCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getRealIeTransDate() != null) ? dto.getRealIeTransDate() : null);
				cell.setCellStyle(styleDate);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getGoodsName() != null) ? dto.getGoodsName() : null);
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getGoodsCode() != null) ? dto.getGoodsCode() : null);
				cell.setCellStyle(style);
				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getGoodsUnitName() != null) ? dto.getGoodsUnitName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(7, CellType.STRING);
				cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(8, CellType.STRING);
				cell.setCellValue(dto.getNumberXuatKho());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(9, CellType.STRING);
				cell.setCellValue(dto.getTotalMoneyXuatKho());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(10, CellType.STRING);
				cell.setCellValue(dto.getNumberThucTeThiCong());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(11, CellType.STRING);
				cell.setCellValue(dto.getTotalMoneyThucTeThiCong());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(12, CellType.STRING);
				cell.setCellValue(dto.getNumberThuHoi());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(13, CellType.STRING);
				cell.setCellValue(dto.getTotalMoneyThuHoi());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(14, CellType.STRING);
				cell.setCellValue(dto.getNumberChuaThuHoi());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(15, CellType.STRING);
				cell.setCellValue(dto.getTotalMoneyChuaThuHoi());
				cell.setCellStyle(styleNumber);
				cell = row.createCell(18, CellType.STRING);
				cell.setCellValue((dto.getFromSynStockTransCode() != null) ? dto.getFromSynStockTransCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(19, CellType.STRING);
//				cell.setCellValue((dto.getDescription() != null) ? dto.getDescription() : "");
				cell.setCellStyle(style);
			}
			
			Row row = sheet.createRow(i++);
			Cell cell0 = row.createCell(0, CellType.STRING);
			cell0.setCellValue("");
			cell0.setCellStyle(style);
			Cell cell1 = row.createCell(1, CellType.STRING);
			cell1.setCellValue("Tổng");
			cell1.setCellStyle(style);
			Cell cell2 = row.createCell(2, CellType.STRING);
			cell2.setCellValue("");
			cell2.setCellStyle(style);
			Cell cell3 = row.createCell(3, CellType.STRING);
			cell3.setCellValue("");
			cell3.setCellStyle(style);
			Cell cell4 = row.createCell(4, CellType.STRING);
			cell4.setCellValue("");
			cell4.setCellStyle(style);
			Cell cell5 = row.createCell(5, CellType.STRING);
			cell5.setCellValue("");
			cell5.setCellStyle(style);
			Cell cell6 = row.createCell(6, CellType.STRING);
			cell6.setCellValue("");
			cell6.setCellStyle(style);
			Cell cell7 = row.createCell(7, CellType.STRING);
			cell7.setCellValue("");
			cell7.setCellStyle(style);
			Cell cell = row.createCell(8, CellType.STRING);
			cell.setCellValue(objCount == null ? 0F : objCount.getCountNumberXuatKho());
			cell.setCellStyle(styleNumber);
			Cell cellmdk = row.createCell(9, CellType.STRING);
			cellmdk.setCellValue(objCount == null ? 0F : objCount.getCountTotalMoneyXuatKho());
			cellmdk.setCellStyle(styleNumber);
			Cell cellntk = row.createCell(10, CellType.STRING);
			cellntk.setCellValue(objCount == null ? 0F : objCount.getCountNumberThucTeThiCong());
			cellntk.setCellStyle(styleNumber);
			Cell cellWI = row.createCell(11, CellType.STRING);
			cellWI.setCellValue(objCount == null ? 0F : objCount.getCountTotalMoneyThucTeThiCong());
			cellWI.setCellStyle(styleNumber);
			Cell cellQ = row.createCell(12, CellType.STRING);
			cellQ.setCellValue(objCount == null ? 0F : objCount.getCountNumberThuHoi());
			cellQ.setCellStyle(styleNumber);
			Cell cellds = row.createCell(13, CellType.STRING);
			cellds.setCellValue(objCount == null ? 0F : objCount.getCountTotalMoneyThuHoi());
			cellds.setCellStyle(styleNumber);
			Cell celldb = row.createCell(14, CellType.STRING);
			celldb.setCellValue(objCount == null ? 0F : objCount.getCountNumberChuaThuHoi());
			celldb.setCellStyle(styleNumber);
			Cell cellmdb = row.createCell(15, CellType.STRING);
			cellmdb.setCellValue(objCount == null ? 0F : objCount.getCountTotalMoneyChuaThuHoi());
			cellmdb.setCellStyle(styleNumber);
			Cell cell18 = row.createCell(18, CellType.STRING);
			cell18.setCellValue("");
			cell18.setCellStyle(style);
			Cell cell19 = row.createCell(19, CellType.STRING);
			cell19.setCellValue("");
			cell19.setCellStyle(style);
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();
		String path = UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + "BienBanDoiChieu4A.xlsx");
		return path;
	}
    public DataListDTO doSearchGoods(SynStockDailyRemainDTO obj){
    	List<SynStockDailyRemainDTO> ls = synStockDailyImportExportDAO.doSearchGoods(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
    }
    
    public List<GoodsDTO> getForCompleteGoods(GoodsDTO obj){
    	return synStockDailyImportExportDAO.getForCompleteGoods(obj);
    }
    
    public List<ConstructionDTO> getForCompleteConstruction(ConstructionDTO obj){
    	return synStockDailyImportExportDAO.getForCompleteConstruction(obj);
    }
	
	    public DataListDTO doSearchGoodsDebtConfirmDetail(SynStockDailyImportExportDTO criteria) {
        List<SynStockDailyImportExportDTO> dtos = synStockDailyImportExportDAO.doSearchGoodsDebtConfirmDetail(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public DataListDTO doSearchGoodsDebtConfirmGeneral(SynStockDailyImportExportDTO criteria) {
        List<SynStockDailyImportExportDTO> dtos = synStockDailyImportExportDAO.doSearchGoodsDebtConfirmGeneral(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public DataListDTO doSearchRpDetailIERByConstructionCode(SynStockDailyImportExportDTO criteria) {
        List<SynStockDailyRemainDTO> dtos = synStockDailyImportExportDAO.doSearchRpDetailIERByConstructionCode(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }
    
    public List<GoodsDTO> getGoodsForAutoComplete(GoodsDTO dto) {
    	return synStockDailyImportExportDAO.getGoodsForAutoComplete(dto);
    }

    /**
     * dosearch contract performance report
     */
    public DataListDTO doSearchContractPerformance(SynStockDailyImportExportDTO criteria) {
        List<SynStockDailyImportExportDTO> dtos = synStockDailyImportExportDAO.doSearchContractPerformance(criteria);
        List<SynStockDailyImportExportDTO> results = this.addSumToResults(dtos);

        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(results);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    private List<SynStockDailyImportExportDTO> addSumToResults(List<SynStockDailyImportExportDTO> dtos) {
        List<SynStockDailyImportExportDTO> results = new ArrayList<>();

        for (SynStockDailyImportExportDTO dto : dtos) {
            if (dto.getConstructionState() == null) {
                continue;
            }

            SynStockDailyImportExportDTO data = results
                    .stream()
                    .filter(temp -> temp.getProvinceName().equals(dto.getProvinceName()))
                    .filter(temp -> temp.getContractCode().equals(dto.getContractCode()))
                    .findFirst().orElse(null);

            // (0: đã hủy, 1: chưa thi công, 2 : đang thu công, 3: thi công xong)
            if (data == null) {
                long[] countConstruction = new long[] {0, 0, 0, 0};
                countConstruction[dto.getConstructionState().intValue()] = dto.getCountTotal();
                dto.setCountConstruction(countConstruction);

                double[] sumMoney = new double[] {0, 0, 0, 0};
                sumMoney[dto.getConstructionState().intValue()] = dto.getTotalMoney();
                dto.setSumMoney(sumMoney);

                results.add(dto);
            } else {
                data.getCountConstruction()[dto.getConstructionState().intValue()] += dto.getCountTotal();
                data.setCountTotal(data.getCountTotal() + dto.getCountTotal());

                data.getSumMoney()[dto.getConstructionState().intValue()] += dto.getTotalMoney();
            }
        }

        for (SynStockDailyImportExportDTO dto : results) {
            long[] countConstruction = dto.getCountConstruction();
            dto.setCountCancel(countConstruction[0]);
            dto.setCountPending(countConstruction[1]);
            dto.setCountConstructing(countConstruction[2]);
            dto.setCountDone(countConstruction[3]);

            double[] sumMoney = dto.getSumMoney();
            dto.setSumCancel(sumMoney[0]);
            dto.setSumPending(sumMoney[1]);
            dto.setSumConstructing(sumMoney[2]);
            dto.setSumDone(sumMoney[3]);
        }

        return results;
    }

    private XSSFWorkbook createWorkbook(String fileName) throws Exception {
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + fileName));
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        file.close();
        return workbook;
    }

    private String writeToFileOnServer(XSSFWorkbook workbook, String fileName) throws Exception {
        Calendar cal = Calendar.getInstance();
        String uploadPath = folderUpload + File.separator + UFile.getSafeFileName(defaultSubFolderUpload)
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
        workbook.write(outFile);
        workbook.close();
        outFile.close();

        return UEncrypt.encryptFileUploadPath(uploadPathReturn + File.separator + fileName);
    }

    public String exportExcelContractPerformance(SynStockDailyImportExportDTO criteria) throws Exception {
        List<SynStockDailyImportExportDTO> dtos = synStockDailyImportExportDAO.doSearchContractPerformance(criteria);
        List<SynStockDailyImportExportDTO> results = this.addSumToResults(dtos);
        if (results == null || results.isEmpty()) {
        	return StringUtils.EMPTY;
        }

        Map<String, List<SynStockDailyImportExportDTO>> contractByProvince = new TreeMap<>();
        for (SynStockDailyImportExportDTO dto : results) {
            if (contractByProvince.containsKey(dto.getProvinceName())) {
                contractByProvince.get(dto.getProvinceName()).add(dto);
            } else {
                contractByProvince.put(dto.getProvinceName(), new ArrayList<>(Collections.singletonList(dto)));
            }
        }

        XSSFWorkbook workbook = this.createWorkbook(CONTRACT_PERFORMANCE_REPORT);
        XSSFSheet sheet = workbook.getSheetAt(0);
        sheet.setDisplayGridlines(false);

        List<CellStyle> styles = this.prepareCellStylesContractPerformance(workbook, sheet);

        // start from
        int rowNo = 6;
        long[] countConsTotal = new long[] {0, 0, 0, 0};
        long[] sumMoneyTotal = new long[] {0, 0, 0, 0};
        int countStateTotal = 0;

        XSSFRow row = sheet.createRow(5);
        row.setHeightInPoints(30);
        this.createContractPerformanceSumRow(row, styles.get(0));
        for (Map.Entry<String, List<SynStockDailyImportExportDTO>> provinceEntry : contractByProvince.entrySet()) {
            row = sheet.createRow(rowNo);
            row.setHeightInPoints(30);
            int rowTotalProvince = rowNo;
            this.createProvinceGroupRow(provinceEntry.getKey(), row, styles.get(1));
            rowNo++;

            long[] countConstructionProvince = new long[] {0, 0, 0, 0};
            long[] sumMoneyProvince = new long[] {0, 0, 0, 0};
            int ordinal = 1;
            for (SynStockDailyImportExportDTO dto : provinceEntry.getValue()) {
                row = sheet.createRow(rowNo);
                row.setHeightInPoints(30);
                this.createContractPerformanceRowData(dto, row, styles, ordinal);
                for (int i = 0; i < countConstructionProvince.length; i++) {
                    countConstructionProvince[i] += dto.getCountConstruction()[i];
                    sumMoneyProvince[i] += dto.getSumMoney()[i];

                    countConsTotal[i] += dto.getCountConstruction()[i];
                    sumMoneyTotal[i] += dto.getSumMoney()[i];
                }
                ordinal++;
                rowNo++;
            }

            row = sheet.getRow(rowTotalProvince);
            this.updateProvinceGroupRow(row, styles, countConstructionProvince, sumMoneyProvince, (rowNo - 1) - rowTotalProvince);
            countStateTotal += ((rowNo - 1) - rowTotalProvince);
        }

        // update value row sum top
        row = sheet.getRow(5);
        this.updateProvinceGroupRow(row, styles, countConsTotal, sumMoneyTotal, countStateTotal);

        // create row sum bottom
        row = sheet.createRow(rowNo);
        this.createContractPerformanceSumRowBottom(row, styles.get(0));
        this.updateProvinceGroupRow(row, styles, countConsTotal, sumMoneyTotal, countStateTotal);

        CellStyle style = ExcelUtils.styleBold(sheet);
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/YYYY");
        row = sheet.getRow(1);
        this.createDateRow(row, 1, style, criteria.getDateFrom(), criteria.getDateTo(), sdf, "Từ ngày: %s  Đến ngày: %s");

        String path = this.writeToFileOnServer(workbook, CONTRACT_PERFORMANCE_REPORT);
        return path;
    }

    private void createDateRow(XSSFRow row, int column, CellStyle style, Date from, Date to, SimpleDateFormat sdf, String content) {
        content = String.format(content, sdf.format(from), sdf.format(to));
        this.createExcelCell(row, column, style).setCellValue(content);
    }

    private void createContractPerformanceSumRow(XSSFRow row, CellStyle style) {
        this.createExcelCell(row, 1, style).setCellValue("Tổng");
        this.createExcelCell(row, 2, style).setCellValue("Toàn quốc");
    }

    private void createContractPerformanceSumRowBottom(XSSFRow row, CellStyle style) {
        this.createExcelCell(row, 1, style);
        this.createExcelCell(row, 2, style).setCellValue("Tổng");
    }

    private void createProvinceGroupRow(String provinceName, XSSFRow row, CellStyle style) {
        this.createExcelCell(row, 1, style).setCellValue("*");
        this.createExcelCell(row, 2, style).setCellValue(provinceName);
    }

    private void updateProvinceGroupRow(XSSFRow row, List<CellStyle> styles, long[] countConstruction, long[] sum, int countConsState) {
        long count = 0;
        for (int i = 0; i < countConstruction.length; i++) {
            count += countConstruction[i];
        }
        this.createExcelCell(row, 3, styles.get(5)).setCellValue(count);
        this.createExcelCell(row, 4, styles.get(5)).setCellValue(countConstruction[3]);
        this.createExcelCell(row, 5, styles.get(5)).setCellValue(countConstruction[2]);
        this.createExcelCell(row, 6, styles.get(5)).setCellValue(countConstruction[1]);
        this.createExcelCell(row, 7, styles.get(5)).setCellValue(countConstruction[0]);
        this.createExcelCell(row, 8, styles.get(5)).setCellValue(countConsState);
        this.createExcelCell(row, 9, styles.get(3)).setCellValue(sum[3]);
        this.createExcelCell(row, 10, styles.get(3)).setCellValue(sum[2]);
        this.createExcelCell(row, 11, styles.get(3)).setCellValue(sum[1]);
        this.createExcelCell(row, 12, styles.get(3)).setCellValue(sum[0]);
        this.createExcelCell(row, 14, styles.get(2));
    }

    private void createContractPerformanceRowData(SynStockDailyImportExportDTO dto, XSSFRow row, List<CellStyle> styles, int ordinal) {
        this.createExcelCell(row, 1, styles.get(2)).setCellValue(ordinal);
        this.createExcelCell(row, 2, styles.get(2)).setCellValue(dto.getContractCode());
        this.createExcelCell(row, 3, styles.get(6)).setCellValue(dto.getCountTotal());
        this.createExcelCell(row, 4, styles.get(6)).setCellValue(dto.getCountDone());
        this.createExcelCell(row, 5, styles.get(6)).setCellValue(dto.getCountConstructing());
        this.createExcelCell(row, 6, styles.get(6)).setCellValue(dto.getCountPending());
        this.createExcelCell(row, 7, styles.get(6)).setCellValue(dto.getCountCancel());
        this.createExcelCell(row, 8, styles.get(2)).setCellValue(dto.getCountTotal() == dto.getCountDone() ? "Thi công xong" : "Đang thi công");
        this.createExcelCell(row, 9, styles.get(4)).setCellValue(dto.getSumDone());
        this.createExcelCell(row, 10, styles.get(4)).setCellValue(dto.getSumConstructing());
        this.createExcelCell(row, 11, styles.get(4)).setCellValue(dto.getSumPending());
        this.createExcelCell(row, 12, styles.get(4)).setCellValue(dto.getSumCancel());
        this.createExcelCell(row, 14, styles.get(2));
    }

    public String exportGoodsDebtConfirmDetail(SynStockDailyImportExportRequest request) throws Exception {
        XSSFWorkbook workbook = this.createWorkbook(GOODS_DEBT_CONFIRM_DETAIL_REPORT);
        XSSFSheet sheet = workbook.getSheetAt(0);
        sheet.setDisplayGridlines(false);

        // prepare cell style
        List<CellStyle> styles = this.prepareCellStyle(workbook, sheet);

        // start from
        int rowNo = 8;
        XSSFRow row;
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/YYYY");
        for (SynStockDailyImportExportDTO dto : request.getExportData()) {
            row = sheet.createRow(rowNo);
            this.createGoodsDebtConfirmDetailExcelRowData(dto, row, styles, sdf);
            rowNo++;
        }

        // create row sum
        int[] colIndex = new int[] {19, 3, 9};
        this.createRowSumGoodsDebtConfirm(sheet, workbook, rowNo, colIndex, request);

        // create footer
//        this.createFooterGoodsDebtConfirmDetail(sheet, rowNo + 3);
        
        // create date row
        Font size14Italic = workbook.createFont();
        this.updateFontConfig(size14Italic, false, true, 14);

        CellStyle style = ExcelUtils.styleText(sheet);
        this.removeCellBorder(style);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setFont(size14Italic);
        row = sheet.getRow(2);
        this.createDateRow(row, 0, style, request.getDateFrom(), request.getDateTo(), sdf, "Số liệu chốt từ %s đến %s");

        String path = this.writeToFileOnServer(workbook, GOODS_DEBT_CONFIRM_DETAIL_REPORT);
        return path;
    }

    /**
     * colIndex: 0: colMax, 1: column total, 2: column value
     *
     */
    private void createRowSumGoodsDebtConfirm(XSSFSheet sheet, XSSFWorkbook workbook, int rowNo, int[] columnIndex, SynStockDailyImportExportRequest request) {
        XSSFRow row = sheet.createRow(rowNo);
        CellStyle centerStyle = ExcelUtils.styleText(sheet);

        // row sum number
        // style
        CellStyle boldTextStyle = ExcelUtils.styleBold(sheet);
        boldTextStyle.setAlignment(HorizontalAlignment.LEFT);
        this.addCellBorder(boldTextStyle);

        Font boldFont = workbook.createFont();
        this.updateFontConfig(boldFont, true, false, 11);
        CellStyle boldNumStyle = ExcelUtils.styleCurrency(sheet);
        boldNumStyle.setDataFormat(sheet.getWorkbook().createDataFormat().getFormat("#,###"));
        boldNumStyle.setFont(boldFont);
        this.addCellBorder(boldNumStyle);

        // cell
        for (int i = 0; i < columnIndex[0]; i++) {
            this.createExcelCell(row, i, centerStyle);
        }
        this.createExcelCell(row, columnIndex[1], boldTextStyle).setCellValue("Tổng cộng");
        this.createExcelCell(row, columnIndex[2], boldNumStyle).setCellValue(request.getSum());
        rowNo++;


        // row sum text
        row = sheet.createRow(rowNo);
        Font boldItalic12Font = workbook.createFont();
        this.updateFontConfig(boldItalic12Font, true, true, 12);
        CellStyle boldItalic12Style = ExcelUtils.styleBold(sheet);
        boldItalic12Style.setWrapText(false);
        boldItalic12Style.setFont(boldItalic12Font);
        this.createExcelCell(row, 0, boldItalic12Style).setCellValue("Bằng chữ:");
        sheet.addMergedRegion(new CellRangeAddress(rowNo, rowNo, 0, 1));

        Font size12Font = workbook.createFont();
        this.updateFontConfig(size12Font, 12);
        CellStyle size12Style = ExcelUtils.styleBold(sheet);
        size12Style.setAlignment(HorizontalAlignment.LEFT);
        size12Style.setWrapText(false);
        size12Style.setFont(size12Font);
        this.removeCellBorder(size12Style);
        this.createExcelCell(row, 2, size12Style).setCellValue(request.getSumText());
        sheet.addMergedRegion(new CellRangeAddress(rowNo, rowNo, 2, 9));
    }

    private void createFooterGoodsDebtConfirmDetail(XSSFSheet sheet, int rowNo) {
        XSSFRow row = sheet.createRow(rowNo);
        CellStyle styleHeader = ExcelUtils.styleHeader(sheet);
        this.removeCellBorder(styleHeader);

        this.createExcelCell(row, 0, styleHeader).setCellValue("ĐƠN VỊ NHẬN NỢ");
        sheet.addMergedRegion(new CellRangeAddress(rowNo, rowNo, 0, 4));

        this.createExcelCell(row, 17, styleHeader).setCellValue("ĐƠN VỊ BÁO NỢ");
        sheet.addMergedRegion(new CellRangeAddress(rowNo, rowNo, 17, 18));
    }

    private void createFooterGoodsDebtConfirmGeneral(XSSFSheet sheet, int rowNo) {
        XSSFRow row = sheet.createRow(rowNo);
        CellStyle styleHeader = ExcelUtils.styleHeader(sheet);
        this.removeCellBorder(styleHeader);

        this.createExcelCell(row, 0, styleHeader).setCellValue("ĐƠN VỊ NHẬN NỢ");
        sheet.addMergedRegion(new CellRangeAddress(rowNo, rowNo, 0, 4));

        this.createExcelCell(row, 13, styleHeader).setCellValue("ĐƠN VỊ BÁO NỢ");
        sheet.addMergedRegion(new CellRangeAddress(rowNo, rowNo, 13, 16));
    }

    private void createGoodsDebtConfirmDetailExcelRowData(SynStockDailyImportExportDTO dto, XSSFRow row, List<CellStyle> styles, SimpleDateFormat sdf) {
        this.createExcelCell(row, 0, styles.get(0)).setCellValue(row.getRowNum() - 7);
        this.createExcelCell(row, 1, styles.get(0)).setCellValue(dto.getProvinceCode());
        this.createExcelCell(row, 2, styles.get(0)).setCellValue(dto.getSysGroupCode());
        this.createExcelCell(row, 3, styles.get(1)).setCellValue(dto.getSynStockTransCode());
        String realIeTransDate = dto.getRealIeTransDate() != null ? sdf.format(dto.getRealIeTransDate()) : null;
        this.createExcelCell(row, 4, styles.get(3)).setCellValue(realIeTransDate);
        this.createExcelCell(row, 5, styles.get(1)).setCellValue(dto.getGoodsName());
        this.createExcelCell(row, 6, styles.get(1)).setCellValue(dto.getGoodsCode());
        this.createExcelCell(row, 7, styles.get(1)).setCellValue(dto.getAmountTotal());
        this.createExcelCell(row, 8, styles.get(1)).setCellValue(dto.getSerial());
        this.createExcelCell(row, 9, styles.get(2)).setCellValue(dto.getTotalMoney());
        this.createExcelCell(row, 10, styles.get(1)).setCellValue(dto.getConstructionCode());
        this.createExcelCell(row, 11, styles.get(1)).setCellValue(this.convertConstructionState(dto.getConstructionState()));
        this.createExcelCell(row, 12, styles.get(1)).setCellValue(dto.getCatStationCode());
        this.createExcelCell(row, 13, styles.get(1)).setCellValue(dto.getContractCode());
//        this.createExcelCell(row, 14, styles.get(1)).setCellValue(dto.getProvinceUserName());
//        this.createExcelCell(row, 15, styles.get(1)).setCellValue(dto.getSysUserName());
        this.createExcelCell(row, 17, styles.get(1)).setCellValue(dto.getProvinceUserName());
        this.createExcelCell(row, 18, styles.get(1)).setCellValue(dto.getSysUserName());
    }

    public String exportGoodsDebtConfirmGeneral(SynStockDailyImportExportRequest request) throws Exception {
        XSSFWorkbook workbook = this.createWorkbook(GOODS_DEBT_CONFIRM_GENERAL_REPORT);
        XSSFSheet sheet = workbook.getSheetAt(0);
        sheet.setDisplayGridlines(false);

        // prepare cell style
        List<CellStyle> styles = this.prepareCellStyle(workbook, sheet);

        // start from
        int rowNo = 8;
        XSSFRow row;
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/YYYY");
        for (SynStockDailyImportExportDTO dto : request.getExportData()) {
            row = sheet.createRow(rowNo);
            this.createGoodsDebtConfirmGeneralExcelRowData(dto, row, styles, sdf);
            rowNo++;
        }

        // create row sum
        int[] colIndex = new int[] {17, 3, 5};
        this.createRowSumGoodsDebtConfirm(sheet, workbook, rowNo, colIndex, request);

        // create footer
//        this.createFooterGoodsDebtConfirmGeneral(sheet, rowNo + 3);

        // create date row
        Font size14Italic = workbook.createFont();
        this.updateFontConfig(size14Italic, false, true, 14);

        CellStyle style = ExcelUtils.styleText(sheet);
        this.removeCellBorder(style);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setFont(size14Italic);
        row = sheet.getRow(2);
        this.createDateRow(row, 0, style, request.getDateFrom(), request.getDateTo(), sdf, "Số liệu chốt từ %s đến %s");

        String path = this.writeToFileOnServer(workbook, GOODS_DEBT_CONFIRM_GENERAL_REPORT);
        return path;
    }

    private void createGoodsDebtConfirmGeneralExcelRowData(SynStockDailyImportExportDTO dto, XSSFRow row, List<CellStyle> styles, SimpleDateFormat sdf) {
        this.createExcelCell(row, 0, styles.get(0)).setCellValue(row.getRowNum() - 7);
        this.createExcelCell(row, 1, styles.get(0)).setCellValue(dto.getProvinceCode());
        this.createExcelCell(row, 2, styles.get(0)).setCellValue(dto.getSysGroupCode());
        this.createExcelCell(row, 3, styles.get(1)).setCellValue(dto.getSynStockTransCode());
        String realIeTransDate = dto.getRealIeTransDate() != null ? sdf.format(dto.getRealIeTransDate()) : null;
        this.createExcelCell(row, 4, styles.get(3)).setCellValue(realIeTransDate);
        this.createExcelCell(row, 5, styles.get(2)).setCellValue(dto.getTotalMoney());
        this.createExcelCell(row, 6, styles.get(1)).setCellValue(dto.getConstructionCode());
        this.createExcelCell(row, 7, styles.get(1)).setCellValue(this.convertConstructionState(dto.getConstructionState()));
        this.createExcelCell(row, 8, styles.get(1)).setCellValue(dto.getCatStationCode());
        this.createExcelCell(row, 9, styles.get(1)).setCellValue(dto.getContractCode());
        this.createExcelCell(row, 13, styles.get(1)).setCellValue(dto.getProvinceUserName());
        this.createExcelCell(row, 14, styles.get(1)).setCellValue(dto.getSysUserName());
        this.createExcelCell(row, 16, styles.get(1));
    }

    private List<CellStyle> prepareCellStyle(XSSFWorkbook workbook, XSSFSheet sheet) {
        // prepare cell style
        Font size11Font = workbook.createFont();
        this.updateFontConfig(size11Font, 11);
        CellStyle centerStyle = ExcelUtils.styleText(sheet);
        centerStyle.setAlignment(HorizontalAlignment.CENTER);
        centerStyle.setFont(size11Font);

        CellStyle leftStyle = ExcelUtils.styleText(sheet);
        leftStyle.setAlignment(HorizontalAlignment.LEFT);
        leftStyle.setFont(size11Font);

        CellStyle numberStyle = ExcelUtils.styleCurrency(sheet);
        numberStyle.setDataFormat(sheet.getWorkbook().createDataFormat().getFormat("#,##0"));

        CellStyle dateStyle = ExcelUtils.styleDate(sheet);
        XSSFCreationHelper createHelper = workbook.getCreationHelper();
        dateStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));

        List<CellStyle> styles = new ArrayList<>();
        styles.add(centerStyle);
        styles.add(leftStyle);
        styles.add(numberStyle);
        styles.add(dateStyle);
        return styles;
    }

    private String convertConstructionState(Long state) {
        String constructionState = null;
        if (state != null) {
            switch (state.intValue()) {
                case 0:
                    constructionState = "Đã hủy";
                    break;
                case 1:
                    constructionState = "Chưa thi công";
                    break;
                case 2:
                    constructionState = "Đang thu công";
                    break;
                case 3:
                    constructionState = "Thi công xong";
                    break;
            }
        }
        return constructionState;
    }

    private List<CellStyle> prepareCellStylesContractPerformance(XSSFWorkbook workbook, XSSFSheet sheet) {
        Font size11FontBold = workbook.createFont();
        this.updateFontConfig(size11FontBold, true, false, 11);

        Font size9Font = workbook.createFont();
        this.updateFontConfig(size9Font, 9);

        Font size10FontBold = workbook.createFont();
        this.updateFontConfig(size10FontBold, true, false, 10);

        CellStyle styleLeftBold11 = ExcelUtils.styleText(sheet);
        styleLeftBold11.setAlignment(HorizontalAlignment.LEFT);
        styleLeftBold11.setFont(size11FontBold);

        CellStyle styleLeftBold10 = ExcelUtils.styleText(sheet);
        styleLeftBold10.setAlignment(HorizontalAlignment.LEFT);
        styleLeftBold10.setFont(size10FontBold);

        CellStyle styleLeft9 = ExcelUtils.styleText(sheet);
        styleLeft9.setAlignment(HorizontalAlignment.LEFT);
        styleLeft9.setFont(size9Font);

        CellStyle styleCurrencyBold = ExcelUtils.styleCurrency(sheet);
        styleCurrencyBold.setDataFormat(sheet.getWorkbook().createDataFormat().getFormat("#,##0"));
        styleCurrencyBold.setAlignment(HorizontalAlignment.CENTER);
        styleCurrencyBold.setFont(size10FontBold);

        CellStyle styleCurrency = ExcelUtils.styleCurrency(sheet);
        styleCurrency.setDataFormat(sheet.getWorkbook().createDataFormat().getFormat("#,##0"));
        styleCurrency.setFont(size9Font);

        CellStyle styleCenterNumberBold10 = ExcelUtils.styleNumber(sheet);
        styleCenterNumberBold10.setAlignment(HorizontalAlignment.CENTER);
        styleCenterNumberBold10.setFont(size10FontBold);

        CellStyle styleRightNumber9 = ExcelUtils.styleNumber(sheet);
        styleRightNumber9.setFont(size9Font);

        return Arrays.asList(styleLeftBold11, styleLeftBold10, styleLeft9,
                styleCurrencyBold, styleCurrency,
                styleCenterNumberBold10, styleRightNumber9);
    }

    public String exportDetailIERGoods(SynStockDailyImportExportDTO criteria) throws Exception {
        List<SynStockDailyRemainDTO> data = synStockDailyImportExportDAO.doSearchRpDetailIERByConstructionCode(criteria);
        if (data == null || data.isEmpty()) {
            return StringUtils.EMPTY;
        }
        XSSFWorkbook workbook = this.createWorkbook(IER_GOODS_BY_CONSTRUCTION);
        XSSFSheet sheet = workbook.getSheetAt(0);
//        sheet.setDisplayGridlines(false);

        // prepare cell style
        List<CellStyle> styles = this.prepareCellStylesIER(workbook, sheet);

        // start from
        int rowNo = 7;
        XSSFRow row;
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/YYYY");
        double[] sum = new double[] {0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
        for (SynStockDailyRemainDTO dto : data) {
            row = sheet.createRow(rowNo);
            this.createIERGoodsExcelRowData(dto, row, styles, sdf);

            sum[0] += dto.getNumberTonDauKy();
            sum[1] += dto.getTotalMoneyTonDauKy();
            sum[2] += dto.getNumberNhapTrongKy();
            sum[3] += dto.getTotalMoneyNhapTrongKy();
            sum[4] += dto.getNumberNghiemThuDoiSoat4A();
            sum[5] += dto.getTotalMoneyNghiemThuDoiSoat4A();
            sum[6] += dto.getNumberTraDenBu();
            sum[7] += dto.getTotalMoneyTraDenBu();
            sum[8] += dto.getNumberTonCuoiKy();
            sum[9] += dto.getTotalMoneyTonCuoiKy();

            rowNo++;
        }

        // create row sum
        row = sheet.createRow(rowNo);
        this.createRowSumIER(row, styles, sum);

        // create date row
        Font size11Bold = workbook.createFont();
        this.updateFontConfig(size11Bold, true, false, 11);

        CellStyle style = ExcelUtils.styleText(sheet);
        this.removeCellBorder(style);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setFont(size11Bold);
        row = sheet.getRow(2);
        this.createDateRow(row, 0, style, criteria.getDateFrom(), criteria.getDateTo(), sdf, "Từ ngày %s đến ngày %s");

        String path = this.writeToFileOnServer(workbook, IER_GOODS_BY_CONSTRUCTION);
        return path;
    }

    private List<CellStyle> prepareCellStylesIER(XSSFWorkbook workbook, XSSFSheet sheet) {
        // prepare cell style
        Font size8Font = workbook.createFont();
        this.updateFontConfig(size8Font, 8);

        CellStyle centerStyle = ExcelUtils.styleText(sheet);
        centerStyle.setAlignment(HorizontalAlignment.CENTER);
        centerStyle.setFont(size8Font);

        CellStyle leftStyle = ExcelUtils.styleText(sheet);
        leftStyle.setAlignment(HorizontalAlignment.LEFT);
        leftStyle.setFont(size8Font);

//        CellStyle numberStyle = ExcelUtils.styleCurrency(sheet);
//        numberStyle.setDataFormat(sheet.getWorkbook().createDataFormat().getFormat("#,##0.00"));
//        numberStyle.setFont(size8Font);
        CellStyle numberStyle = ExcelUtils.styleText(sheet);
        numberStyle.setDataFormat(sheet.getWorkbook().createDataFormat().getFormat("#,##0.00"));
        numberStyle.setAlignment(HorizontalAlignment.RIGHT);
        numberStyle.setFont(size8Font);

//        CellStyle dateStyle = ExcelUtils.styleDate(sheet);
//        XSSFCreationHelper createHelper = workbook.getCreationHelper();
//        dateStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));

        Font size8BoldFont = workbook.createFont();
        this.updateFontConfig(size8BoldFont, true, false, 8);
        CellStyle leftStyleBold = ExcelUtils.styleText(sheet);
        leftStyleBold.setAlignment(HorizontalAlignment.LEFT);
        leftStyleBold.setFont(size8BoldFont);

        CellStyle numberStyleBold = ExcelUtils.styleCurrency(sheet);
        numberStyleBold.setDataFormat(sheet.getWorkbook().createDataFormat().getFormat("#,##0.00"));
        numberStyleBold.setFont(size8BoldFont);

        return Arrays.asList(centerStyle, leftStyle, numberStyle, leftStyleBold, numberStyleBold);
    }

    private void createIERGoodsExcelRowData(SynStockDailyRemainDTO dto, XSSFRow row, List<CellStyle> styles, SimpleDateFormat sdf) {
        this.createExcelCell(row, 0, styles.get(0)).setCellValue(row.getRowNum() - 6);
        this.createExcelCell(row, 1, styles.get(1)).setCellValue(dto.getConstructionCode());
        String date = dto.getRealIeTransDate() != null ? sdf.format(dto.getRealIeTransDate()) : StringUtils.EMPTY;
        this.createExcelCell(row, 2, styles.get(1)).setCellValue(date);
        this.createExcelCell(row, 3, styles.get(1)).setCellValue(dto.getSynStockTransCode());
        this.createExcelCell(row, 4, styles.get(1)).setCellValue(dto.getGoodsName());
        this.createExcelCell(row, 5, styles.get(1)).setCellValue(dto.getGoodsCode());
        this.createExcelCell(row, 6, styles.get(1)).setCellValue(dto.getCatStationCode());
        this.createExcelCell(row, 7, styles.get(0)).setCellValue(dto.getGoodsUnitName());
        this.createExcelCell(row, 9, styles.get(2)).setCellValue(dto.getNumberTonDauKy());
        this.createExcelCell(row, 10, styles.get(2)).setCellValue(dto.getTotalMoneyTonDauKy());
        this.createExcelCell(row, 11, styles.get(2)).setCellValue(dto.getNumberNhapTrongKy());
        this.createExcelCell(row, 12, styles.get(2)).setCellValue(dto.getTotalMoneyNhapTrongKy());
        this.createExcelCell(row, 13, styles.get(2)).setCellValue(dto.getNumberNghiemThuDoiSoat4A());
        this.createExcelCell(row, 14, styles.get(2)).setCellValue(dto.getTotalMoneyNghiemThuDoiSoat4A());
        this.createExcelCell(row, 15, styles.get(2)).setCellValue(dto.getNumberTraDenBu());
        this.createExcelCell(row, 16, styles.get(2)).setCellValue(dto.getTotalMoneyTraDenBu());
        this.createExcelCell(row, 17, styles.get(2)).setCellValue(dto.getNumberTonCuoiKy());
        this.createExcelCell(row, 18, styles.get(2)).setCellValue(dto.getTotalMoneyTonCuoiKy());
        this.createExcelCell(row, 19, styles.get(1)).setCellValue(dto.getFromSynStockTransCode());
        this.createExcelCell(row, 20, styles.get(1));
    }

    private void createRowSumIER(XSSFRow row, List<CellStyle> styles, double sum[]) {
        this.createExcelCell(row, 0, styles.get(0));
        this.createExcelCell(row, 1, styles.get(0));
        this.createExcelCell(row, 2, styles.get(0));
        this.createExcelCell(row, 3, styles.get(0));
        this.createExcelCell(row, 4, styles.get(3)).setCellValue("Tổng cộng");
        this.createExcelCell(row, 5, styles.get(0));
        this.createExcelCell(row, 6, styles.get(0));
        this.createExcelCell(row, 7, styles.get(0));
        this.createExcelCell(row, 9, styles.get(4)).setCellValue(sum[0]);
        this.createExcelCell(row, 10, styles.get(4)).setCellValue(sum[1]);
        this.createExcelCell(row, 11, styles.get(4)).setCellValue(sum[2]);
        this.createExcelCell(row, 12, styles.get(4)).setCellValue(sum[3]);
        this.createExcelCell(row, 13, styles.get(4)).setCellValue(sum[4]);
        this.createExcelCell(row, 14, styles.get(4)).setCellValue(sum[5]);
        this.createExcelCell(row, 15, styles.get(4)).setCellValue(sum[6]);
        this.createExcelCell(row, 16, styles.get(4)).setCellValue(sum[7]);
        this.createExcelCell(row, 17, styles.get(4)).setCellValue(sum[8]);
        this.createExcelCell(row, 18, styles.get(4)).setCellValue(sum[9]);
        this.createExcelCell(row, 19, styles.get(0));
        this.createExcelCell(row, 20, styles.get(0));
    }

    //utils
    private XSSFCell createExcelCell(XSSFRow row, int column, CellStyle style) {
        XSSFCell cell = row.createCell(column);
        cell.setCellStyle(style);
        return cell;
    }

    private void addCellBorder(CellStyle style) {
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
    }

    private void removeCellBorder(CellStyle style) {
        style.setBorderTop(BorderStyle.NONE);
        style.setBorderLeft(BorderStyle.NONE);
        style.setBorderBottom(BorderStyle.NONE);
        style.setBorderRight(BorderStyle.NONE);
    }

    private void updateFontConfig(Font font, String name, boolean bold, boolean italic, int height) {
        font.setFontName(name);
        font.setBold(bold);
        font.setItalic(italic);
        font.setFontHeightInPoints((short) height);
    }

    private void updateFontConfig(Font font, boolean bold, boolean italic, int height) {
        this.updateFontConfig(font, "Times New Roman", bold, italic, height);
    }

    private void updateFontConfig(Font font, int height) {
        this.updateFontConfig(font, "Times New Roman", false, false, height);
    }

    private void updateFontConfig(Font font, boolean bold, boolean italic) {
        this.updateFontConfig(font, "Times New Roman", false, false, 11);
    }
}
