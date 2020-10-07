package com.viettel.aio.business;

import com.viettel.aio.bo.PurchaseOrderBO;
import com.viettel.aio.dao.CatPartnerDAO;
import com.viettel.aio.dao.PurchaseOrderDAO;
import com.viettel.aio.dao.SysGroupDAO;
import com.viettel.aio.dao.SysUserDAO;
import com.viettel.aio.dto.PurchaseOrderDTO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;


@Service("purchaseOrderBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class PurchaseOrderBusinessImpl extends BaseFWBusinessImpl<PurchaseOrderDAO, PurchaseOrderDTO, PurchaseOrderBO> implements PurchaseOrderBusiness {
    static Logger LOGGER = LoggerFactory
            .getLogger(PurchaseOrderBusinessImpl.class);

    @Autowired
    private PurchaseOrderDAO purchaseOrderDAO;

    @Autowired
    private SysGroupDAO sysGroupDAO;

    @Autowired
    private SysUserDAO sysUserDAO;

    @Autowired
    private CatPartnerDAO catPartnerDAO;

    @Autowired
    private UtilAttachDocumentDAO utilAttachDocumentDAO;
    //cột cần bắt validate trong file excel
    int[] validateCol = {1, 2, 3, 5, 8};


    HashMap<Integer, String> colName = new HashMap();

    {
        colName.put(1, "Mã đơn hàng");
        colName.put(2, "Tên đơn hàng");
        colName.put(3, "Mã đối tác");
        colName.put(4, "Đại diện đối tác");
        colName.put(5, "Mã đơn vị ký");
        colName.put(6, "Đại diện đơn vị ký");
        colName.put(7, "Ngày ký");
        colName.put(8, "Giá trị đơn hàng");
        colName.put(9, "Nguồn kinh phí");
        colName.put(10, "Ghi chú");
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

    public PurchaseOrderBusinessImpl() {
        tModel = new PurchaseOrderBO();
        tDAO = purchaseOrderDAO;
    }

    @Override
    public PurchaseOrderDAO gettDAO() {
        return purchaseOrderDAO;
    }

//	@Override
//	public PurchaseOrderDTO findByCode(String value) {
//		return purchaseOrderDAO.findByCode(value);
//	}
//
//	@Override
//	public List<PurchaseOrderDTO> doSearch(PurchaseOrderDTO obj) {
//		List<PurchaseOrderDTO> results = purchaseOrderDAO.doSearch(obj);
//		for (PurchaseOrderDTO item : results) {
//			UtilAttachDocumentDTO criteria = new UtilAttachDocumentDTO();
//			criteria.setObjectId(item.getPurchaseOrderId());
//			criteria.setType(Constants.FILETYPE.PURCHASE_ORDER);
//			List<UtilAttachDocumentDTO> fileLst = utilAttachDocumentDAO
//					.doSearch(criteria);
//			item.setFileLst(fileLst);
//		}
//		return results;
//	}

    @Override
    public List<PurchaseOrderDTO> getForAutoComplete(PurchaseOrderDTO query) {
        return purchaseOrderDAO.getForAutoComplete(query);
    }

//	public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
//		return purchaseOrderDAO.delete(ids, tableName, tablePrimaryKey);
//	}
//
//
//
//	public PurchaseOrderDTO getById(Long id) {
//		return purchaseOrderDAO.getById(id);
//	}
//
//
//	@Override
//	public List<PurchaseOrderDTO> importPurchaseOrder(String fileInput) throws Exception{
//
//
//		List<PurchaseOrderDTO> workLst = Lists.newArrayList();
//		List<ExcelErrorDTO> errorList = new ArrayList<ExcelErrorDTO>();
//		try {
//			List<PurchaseOrderDTO> orderList = purchaseOrderDAO.getAllCode();
//			HashMap<String,String> orderSpace = new HashMap();
//			for(PurchaseOrderDTO order : orderList){
//				orderSpace.put(order.getCode(), order.getCode());
//			}
//
//			List<CatPartnerDTO> partnerList = catPartnerDAO.getAllCode();
//			HashMap<String,Long> partnerSpace = new HashMap();
//			for(CatPartnerDTO partner : partnerList){
//				partnerSpace.put(partner.getCode(), partner.getCatPartnerId());
//			}
//
//			List<SysUserDTO> signerList = sysUserDAO.getAll();
//			HashMap<String,SysUserDTO> signerSpace = new HashMap();
//			for(SysUserDTO signer : signerList){
//				signerSpace.put(signer.getEmployeeCode(), signer);
//			}
//
//			List<SysGroupDTO> groupList = sysGroupDAO.getAll();
//			HashMap<String,Long> groupSpace = new HashMap();
//			for(SysGroupDTO group : groupList){
//				groupSpace.put(group.getCode(), group.getSysGroupId());
//			}
//
//			File f = new File(fileInput);
//			XSSFWorkbook workbook = new XSSFWorkbook(f);
//			XSSFSheet sheet = workbook.getSheetAt(0);
//
//			DataFormatter formatter = new DataFormatter();
//			int count = 0;
//
//			for (Row row : sheet) {
//				count++;
//				if(count >= 3 && checkIfRowIsEmpty(row)) continue;
//				PurchaseOrderDTO obj = new PurchaseOrderDTO();
//
//				if (count >= 3) {
//					String orderCode = formatter.formatCellValue(row.getCell(1));
//					String orderName = formatter.formatCellValue(row.getCell(2));
//					String partnerCode = formatter.formatCellValue(row.getCell(3));
//					String partnerRepresent = formatter.formatCellValue(row.getCell(4));
//					String groupCode = formatter.formatCellValue(row.getCell(5));
//					String signerCode = formatter.formatCellValue(row.getCell(6));
//					String signDate = formatter.formatCellValue(row.getCell(7));
//					String price = formatter.formatCellValue(row.getCell(8));
//					String expense = formatter.formatCellValue(row.getCell(9));
//					String description = formatter.formatCellValue(row.getCell(10));
//					validateRequiredCell(row, errorList); // kiểm tra các ô bắt buộc nhập đã dc nhập chưa
//
//					//validate mã đơn hàng đã tồn tại chưa
//					if(validateString(orderCode))
//						if(!isExist(orderCode, orderSpace)){
//							obj.setCode(orderCode);
//						}
//						else{
//							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(1), colName.get(1)+ " đã tồn tại");
//							errorList.add(errorDTO);
//						}
//					if(validateString(orderName))
//						obj.setName(orderName);
//
//					//validate mã đối tác
//					if(validateString(partnerCode)){
//						Long partnerId = partnerSpace.get(partnerCode);
//						if(partnerId != null){
//							obj.setCatPartnerId(partnerId);
//						} else{
//							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(3), colName.get(3)+ " không tồn tại");
//							errorList.add(errorDTO);
//						}
//					}
//					//validate giá trị số
//					if(validateString(price)) {
//						if(price.length()<=15) {
//							try{
//								obj.setPrice(Double.parseDouble(price));
//							} catch(Exception e){
//								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1,colAlias.get(8) , colName.get(8)+ " không hợp lệ");
//								errorList.add(errorDTO);
//							}
//						}
//					}
//
//
//					if (validateString(expense))
//						obj.setExpense(expense);
//					 //end validate required cells
//
//					//validate các ô không bắt buộc nhập
//					if(validateString(partnerRepresent))
//						obj.setSignerPartner(partnerRepresent.trim());
//					//validate đơn vị ký
//					if(validateString(groupCode)){
//						Long group = groupSpace.get(groupCode);
//						if(group != null){
//							obj.setSysGroupId(group);
//						} else{
//							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(5), colName.get(5)+ " không tồn tại");
//							errorList.add(errorDTO);
//						}
//					}
//
//					//validate đại diện đơn vị ký
//					if(validateString(signerCode)){
//						SysUserDTO user = signerSpace.get(signerCode);
//						if(user != null){
//							obj.setSignerGroupId(user.getSysUserId());
//							obj.setSignerGroupName(user.getFullName());
//						} else{
//							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(6), colName.get(6)+ " không tồn tại");
//							errorList.add(errorDTO);
//						}
//					}
//					//validate ngày
//					if(validateString(signDate)) {
//						SimpleDateFormat fmt = new SimpleDateFormat(
//								"dd/MM/yyyy");
//						fmt.setLenient(false);
//						try {
//							Date date = fmt.parse(signDate);
//							@SuppressWarnings("deprecation")
//							int year = date.getYear()+1900;
//							if(year>=1900 && year<=2099)
//								obj.setSignDate(date);
//							else {
//								ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(7), colName.get(7)+ " không hợp lệ");
//								errorList.add(errorDTO);
//							}
//
//						} catch (ParseException e) {
//							ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(7), colName.get(7)+ " không hợp lệ");
//							errorList.add(errorDTO);
//							e.printStackTrace();
//						}
//					}
//
//					if(description.trim().length() <= 2000)
//						obj.setDescription(description.trim());
//					else {
//						ExcelErrorDTO errorDTO = createError(row.getRowNum() + 1, colAlias.get(10), colName.get(10)+ " có độ dài quá giới hạn");
//						errorList.add(errorDTO);
//					}
//
//					if(errorList.size() == 0){
//						workLst.add(obj);
//					}
//				}
//
//
//			}
//
//			if(errorList.size() > 0){
//				String filePathError = UEncrypt.encryptFileUploadPath(fileInput);
//				List<PurchaseOrderDTO> emptyArray = Lists.newArrayList();
//				workLst = emptyArray;
//				PurchaseOrderDTO errorContainer = new PurchaseOrderDTO();
//				errorContainer.setErrorList(errorList);
//				errorContainer.setMessageColumn(11); // cột dùng để in ra lỗi
//				errorContainer.setFilePathError(filePathError);
//				workLst.add(errorContainer);
//			}
//
//			workbook.close();
//			return workLst;
//
//		}  catch (Exception e) {
//			LOGGER.error(e.getMessage(), e);
//			ExcelErrorDTO errorDTO = createError(0, "", e.toString());
//			errorList.add(errorDTO);
//			String filePathError = null;
//			try {
//				filePathError = UEncrypt.encryptFileUploadPath(fileInput);
//			} catch(Exception ex) {
//				LOGGER.error(e.getMessage(), e);
//				errorDTO = createError(0, "", ex.toString());
//				errorList.add(errorDTO);
//			}
//			List<PurchaseOrderDTO> emptyArray = Lists.newArrayList();
//			workLst = emptyArray;
//			PurchaseOrderDTO errorContainer = new PurchaseOrderDTO();
//			errorContainer.setErrorList(errorList);
//			errorContainer.setMessageColumn(11); // cột dùng để in ra lỗi
//			errorContainer.setFilePathError(filePathError);
//			workLst.add(errorContainer);
//			return workLst;
//		}
//	}
//	/**
//	 * @overview return true if string is not null and not empty
//	 * @param str
//	 */
//	public boolean validateString(String str){
//		return (str != null && str.length()>0);
//	}
//
//	public Boolean isExist(String code, HashMap<String,String> orderSpace) {
//		String obj = orderSpace.get(code);
//		if (obj != null) {
//			return true;
//		} else {
//			return false;
//		}
//	}
//
//	@SuppressWarnings("deprecation")
//	private boolean checkIfRowIsEmpty(Row row) {
//	    if (row == null) {
//	        return true;
//	    }
//	    if (row.getLastCellNum() <= 0) {
//	        return true;
//	    }
//	    for (int cellNum = row.getFirstCellNum(); cellNum < row.getLastCellNum(); cellNum++) {
//	        Cell cell = row.getCell(cellNum);
//	        if (cell != null && cell.getCellType() != Cell.CELL_TYPE_BLANK && StringUtils.isNotBlank(cell.toString())) {
//	            return false;
//	        }
//	    }
//	    return true;
//	}
//
//	private ExcelErrorDTO createError(int row, String column, String detail){
//		ExcelErrorDTO err = new ExcelErrorDTO();
//		err.setColumnError(column);
//		err.setLineError(String.valueOf(row));
//		err.setDetailError(detail);
//		return err;
//	}
//
//	public boolean validateRequiredCell(Row row, List<ExcelErrorDTO> errorList){
//		DataFormatter formatter = new DataFormatter();
//		boolean result = true;
//		for(int colIndex : validateCol){
//			if(!validateString(formatter.formatCellValue(row.getCell(colIndex)))){
//
//				ExcelErrorDTO errorDTO = new ExcelErrorDTO();
//				errorDTO.setColumnError(colAlias.get(colIndex));
//				errorDTO.setLineError(String.valueOf(row.getRowNum() + 1));
//				errorDTO.setDetailError(colName.get(colIndex)+" chưa nhập");
//				errorList.add(errorDTO);
//				result = false;
//			}
//		}
//		return result;
//	}
}
