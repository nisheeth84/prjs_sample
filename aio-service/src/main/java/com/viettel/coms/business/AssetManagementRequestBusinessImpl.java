package com.viettel.coms.business;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import com.viettel.coms.bo.AssetManagementRequestBO;
import com.viettel.coms.dao.AssetManageRequestEntityDAO;
import com.viettel.coms.dao.AssetManagementRequestDAO;
import com.viettel.coms.dao.ConstructionDAO;
import com.viettel.coms.dao.ConstructionMerchandiseDAO;
import com.viettel.coms.dao.MerEntityDAO;
import com.viettel.coms.dao.OrderGoodsDAO;
import com.viettel.coms.dao.OrderGoodsDetailDAO;
import com.viettel.coms.dao.OrdersDAO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dao.manufacturingVT_DAO;
import com.viettel.coms.dao.manufacturingDetailDAO;
import com.viettel.coms.dto.AssetManageRequestEntityDTO;
import com.viettel.coms.dto.AssetManageRequestEntityDetailDTO;
import com.viettel.coms.dto.AssetManagementRequestDTO;
import com.viettel.coms.dto.AssetManagementRequestDetailDTO;
import com.viettel.coms.dto.CatCommonDTO;
import com.viettel.coms.dto.ConstructionMerchandiseDTO;
import com.viettel.coms.dto.GoodsDetailEditDTO;
import com.viettel.coms.dto.GoodsPlanDetailDTO;
import com.viettel.coms.dto.MerEntitySimpleDTO;
import com.viettel.coms.dto.OrderGoodsDTO;
import com.viettel.coms.dto.OrderGoodsDetailDTO;
import com.viettel.coms.dto.OrdersDTO;
import com.viettel.coms.dto.StockTransGeneralDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.coms.dto.manufacturingVT_DTO;
import com.viettel.coms.utils.ExcelUtils;
import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;
import com.viettel.utils.ConvertData;
import com.viettel.wms.dto.StockTransDTO;

@Service("assetManagementRequestBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AssetManagementRequestBusinessImpl
		extends BaseFWBusinessImpl<AssetManagementRequestDAO, AssetManagementRequestDTO, AssetManagementRequestBO>
		implements AssetManagementRequestBusiness {

	@Autowired
	private AssetManagementRequestDAO assetManagementRequestDAO;
	@Autowired
	private AssetManageRequestEntityDAO assetManageRequestEntityDAO;
	@Autowired
	private ConstructionDAO constructionDAO;
	@Autowired
	private OrdersDAO ordersDAO;
	@Autowired
	private OrderGoodsDAO orderGoodsDAO;
	@Autowired
	private OrderGoodsDetailDAO orderGoodsDetailDAO;
	@Autowired
	private MerEntityDAO merEntityDAO;
	@Autowired
	private UtilAttachDocumentDAO utilAttachDocumentDAO;
	@Autowired
	private MerEntityBusinessImpl merEntityBusinessImpl;
	@Autowired
	private ConstructionMerchandiseDAO constructionMerchandiseDAO;
//	hungtd_201811227_start
	@Autowired
	private manufacturingVT_DAO manufacturingVT_DAO;
	@Autowired
	private manufacturingDetailDAO manufacturingDetailDAO;
//	hungtd_20181227_end
	
	
	@Value("${folder_upload2}")
	private String folder2Upload;
	@Value("${default_sub_folder_upload}")
	private String defaultSubFolderUpload;

	public AssetManagementRequestBusinessImpl() {
		tModel = new AssetManagementRequestBO();
		tDAO = assetManagementRequestDAO;
	}

	@Override
	public AssetManagementRequestDAO gettDAO() {
		return assetManagementRequestDAO;
	}

	@Override
	public long count() {
		return assetManagementRequestDAO.count("AssetManagementRequestBO", null);
	}

	public DataListDTO doSearch(AssetManagementRequestDetailDTO obj, HttpServletRequest request) {
		List<AssetManagementRequestDetailDTO> ls = new ArrayList<AssetManagementRequestDetailDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty())
			ls = assetManagementRequestDAO.doSearch(obj, groupIdList);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
//	hungtd_20181225_start
	public DataListDTO doSearchVT(manufacturingVT_DTO obj, HttpServletRequest request) {
		List<manufacturingVT_DTO> ls = new ArrayList<manufacturingVT_DTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty())
			ls = assetManagementRequestDAO.doSearchVT(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
	public Long createLogin(manufacturingVT_DTO obj) {
		boolean check = check(obj.getCode());
		if(!check){
			throw new IllegalArgumentException("Thông đã tồn tại !");
		}
		
		return manufacturingVT_DAO.saveObject(obj.toModel());
	}
	public Long createLoginDetail(GoodsPlanDetailDTO obj) {
//		boolean check = check(obj.getCode());
//		if(!check){
//			throw new IllegalArgumentException("Thông đã tồn tại !");
//		}
		
		return manufacturingDetailDAO.saveObject(obj.toModel());
	}
	
	@SuppressWarnings("unused")
	public Boolean check(String code){
		manufacturingVT_DTO obj = assetManagementRequestDAO.findByCode(code);
 	   if(code == null){
 		   if(obj==null){
 			   return true;
 		   } else {
 			   return false;
 		   }
 	   } else {
 		   if(obj!=null && obj.getCode().equals(code)) {
 			   return false;
 		   } else {
 			   return true;
 		   }
 	   }
    }
	public Long updateVT(manufacturingVT_DTO obj) throws Exception{
	
		return manufacturingVT_DAO.updateObject(obj.toModel());
	}
//	hungtd_20181225_end

	public Long add(AssetManagementRequestDetailDTO obj, HttpServletRequest request) throws Exception {
		// them moi vao bang thu hoi
		long provinceId = assetManagementRequestDAO.getProvinceIdByCatStationId(obj.getConstructionId());
		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE, Constant.AdResourceKey.EQUIPMENT_RETURN,
				request)) {
			throw new IllegalArgumentException("Bạn không có quyền tạo mới yêu cầu thu hồi VTTB");
		}
		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.CREATE,
				Constant.AdResourceKey.EQUIPMENT_RETURN, provinceId, request)) {
			throw new IllegalArgumentException("Bạn không có quyền tạo yêu cầu thu hồi VTTB cho trạm/ tuyến này");
		}
		Long assetManagementRequestId = assetManagementRequestDAO.saveObject(obj.toModel());
		assetManagementRequestDAO.getSession().flush();

		// them moi vao bang order
		long year = (new Date()).getYear();
		long newYear = year % 100;
		Long sequenceOrders = assetManagementRequestDAO.getSequenceOrders();
		String sequenceOrderString = String.valueOf(sequenceOrders);
		String codeCatStock = assetManagementRequestDAO.getCodeCatStock(obj.getConstructionId());
		String codeSysGroup = assetManagementRequestDAO.getCodeSysGroup(obj.getRequestGroupId());

		int c = sequenceOrderString.length();
		if (c == 1) {
			sequenceOrderString = "00000" + sequenceOrderString;
		}
		if (c == 2) {
			sequenceOrderString = "0000" + sequenceOrderString;
		}
		if (c == 3) {
			sequenceOrderString = "000" + sequenceOrderString;
		}
		if (c == 4) {
			sequenceOrderString = "00" + sequenceOrderString;
		}
		if (c == 5) {
			sequenceOrderString = "0" + sequenceOrderString;
		}
		String codeOrders = "YCNK" + codeCatStock + "_" + codeSysGroup + "/" + newYear + "/" + sequenceOrderString;
		Long idCatStockId = assetManagementRequestDAO.getCatStockId(obj.getConstructionId());

		OrdersDTO order = new OrdersDTO();
		order.setCode(codeOrders);
		order.setStockId(idCatStockId);
		order.setType("1");
		order.setBussinessType("4");
		order.setStatus("1");
		order.setCreatedDate(new Date());
		order.setCreatedBy(obj.getUpdatedUserId());
		order.setCreatedByName(obj.getUpdateFullName());
		order.setCreatedDeptedId(obj.getUpdatedGroupId());
		order.setShipperId(String.valueOf(obj.getUpdatedUserId()));
		order.setShipperName(obj.getUpdateFullName());
		order.setAssetManagementRequestId(assetManagementRequestId);
		order.setConstructionCode(obj.getConstructionCode());
		order.setConstructionId(obj.getConstructionId());
		order.setSignState("1");
		order.setDeptReceiveId(obj.getRequestGroupId());
		order.setDeptReceiveName(obj.getRequestGroupName());
		order.setCreatedDeptedName(obj.getUpdateGroupName());
		order.setDescription(obj.getDescription());
		order.setStationId(obj.getStationId());
		order.setStationCode(obj.getStationCode());
		Long orderId = ordersDAO.saveObject(order.toModel());

		// Danh sách vật tư - Không serial
		if (obj.getAmrdDSVTDTOList().size() > 0) {

			// Gộp danh sách hàng hóa có cùng goodsId - Danh sách vật tư muốn thu hồi
			List<AssetManageRequestEntityDetailDTO> orderGoodsList = new ArrayList<>();
			boolean checkItem = false;
			for (int h = 0; h < obj.getAmrdDSVTDTOList().size(); h++) {
				if (h == 0) {
					orderGoodsList.add(obj.getAmrdDSVTDTOList().get(h));
				} else {
					for (int k = 0; k < orderGoodsList.size(); k++) {
						if (obj.getAmrdDSVTDTOList().get(h).getGoodsId().equals(orderGoodsList.get(k).getGoodsId())) {
							checkItem = false;
							if (orderGoodsList.get(k).getAmountPX() != null) {
								orderGoodsList.get(k).setAmountPX(orderGoodsList.get(k).getAmountPX() + obj.getAmrdDSVTDTOList().get(h).getAmountPX());
							}
							if (orderGoodsList.get(k).getAmountNT() != null) {
								orderGoodsList.get(k).setAmountNT(orderGoodsList.get(k).getAmountNT() + obj.getAmrdDSVTDTOList().get(h).getAmountNT());
							}
							if (orderGoodsList.get(k).getAmountDTH() != null) {
								orderGoodsList.get(k).setAmountDTH(orderGoodsList.get(k).getAmountDTH() + obj.getAmrdDSVTDTOList().get(h).getAmountDTH());
							}
							if (orderGoodsList.get(k).getAmountDYCTH() != null) {
								orderGoodsList.get(k).setAmountDYCTH(orderGoodsList.get(k).getAmountDYCTH() + obj.getAmrdDSVTDTOList().get(h).getAmountDYCTH());
							}
							if (orderGoodsList.get(k).getConsQuantity() != null) {
								orderGoodsList.get(k).setConsQuantity(orderGoodsList.get(k).getConsQuantity() + obj.getAmrdDSVTDTOList().get(h).getConsQuantity());
							}
							if (orderGoodsList.get(k).getAmountGoodsCode() != null) {
								orderGoodsList.get(k).setAmountGoodsCode(orderGoodsList.get(k).getAmountGoodsCode() + obj.getAmrdDSVTDTOList().get(h).getAmountGoodsCode());
							}
							if (orderGoodsList.get(k).getTotalPrice() != null) {
								orderGoodsList.get(k).setTotalPrice(orderGoodsList.get(k).getTotalPrice() + obj.getAmrdDSVTDTOList().get(h).getTotalPrice());
							}
							if (orderGoodsList.get(k).getaMountMerentity() != null) {
								orderGoodsList.get(k).setaMountMerentity(orderGoodsList.get(k).getaMountMerentity() + obj.getAmrdDSVTDTOList().get(h).getaMountMerentity());
							}
						} else {
							checkItem = true;
						}
					}

					if (checkItem == true) {
						orderGoodsList.add(obj.getAmrdDSVTDTOList().get(h));
					}
				}
			}

			for (AssetManageRequestEntityDetailDTO dto : orderGoodsList) {
				List<AssetManageRequestEntityDetailDTO> fa =null;
//				List<AssetManageRequestEntityDetailDTO> fa = assetManagementRequestDAO.getAmrdTHVTTBDTOListByParent(obj.getConstructionId(), assetManagementRequestId, dto.getGoodsId());
				fa = assetManagementRequestDAO.getAmrdTHVTTBDTO(obj.getConstructionId(), assetManagementRequestId, dto.getGoodsId());
				if(fa.size() == 0){
					fa = assetManagementRequestDAO.getDetailTHVTTBDTO(obj.getConstructionId(), assetManagementRequestId, dto.getGoodsId());
				}
				double slcl = 0;
				double slsd = dto.getConsQuantity().doubleValue();

				// Gộp danh sách hàng hóa có cùng goodsId có trong 1 công trình
				List<AssetManageRequestEntityDetailDTO> orderGoodsContrucstionList = new ArrayList<>();
				boolean checkItemConstruction = false;
				for (int h = 0; h < fa.size(); h++) {
					if (h == 0) {
						orderGoodsContrucstionList.add(fa.get(h));
					} else {
						for (int k = 0; k < orderGoodsContrucstionList.size(); k++) {
							if (fa.get(h).getGoodsId().equals(orderGoodsContrucstionList.get(k).getGoodsId())) {
								checkItemConstruction = false;
								if (orderGoodsContrucstionList.get(k).getAmountPX() != null) {
									orderGoodsContrucstionList.get(k).setAmountPX(orderGoodsContrucstionList.get(k).getAmountPX() + fa.get(h).getAmountPX());
//									orderGoodsContrucstionList.get(k).setAmountPX(dto.getAmountPX());
								}
								if (orderGoodsContrucstionList.get(k).getAmountNT() != null) {
									orderGoodsContrucstionList.get(k).setAmountNT(orderGoodsContrucstionList.get(k).getAmountNT() + fa.get(h).getAmountNT());
								}
								if (orderGoodsContrucstionList.get(k).getAmountDTH() != null) {
									orderGoodsContrucstionList.get(k).setAmountDTH(orderGoodsContrucstionList.get(k).getAmountDTH() + fa.get(h).getAmountDTH());
								}
								if (orderGoodsContrucstionList.get(k).getAmountDYCTH() != null) {//hoangnh cmt
//									orderGoodsContrucstionList.get(k).setAmountDYCTH(orderGoodsContrucstionList.get(k).getAmountDYCTH() + fa.get(h).getAmountDYCTH());
									orderGoodsContrucstionList.get(k).setAmountDYCTH(fa.get(h).getAmountDYCTH());
								}
								if (orderGoodsContrucstionList.get(k).getConsQuantity() != null) {
									orderGoodsContrucstionList.get(k).setConsQuantity(orderGoodsContrucstionList.get(k).getConsQuantity() + fa.get(h).getConsQuantity());
								}
							} else {
								checkItemConstruction = true;
							}
						}

						if (checkItemConstruction == true) {
							orderGoodsContrucstionList.add(fa.get(h));
						}
					}
				}

				for (AssetManageRequestEntityDetailDTO a : orderGoodsContrucstionList) {
					if ((dto.getGoodsId().equals(a.getGoodsId())) || (dto.getGoodsCode().equals(a.getGoodsCode())) ) {
						double amount2 = 0d;
						double totalPrice = 0d;
						double slth = 0;
						if (a.getAmountNT() == null && a.getAmountDTH() == null) {
							slth = (a.getAmountPX().doubleValue());
						} else if (a.getAmountNT() != null && a.getAmountDTH() == null) {
							slth = (a.getAmountPX().doubleValue() - a.getAmountNT().doubleValue());
						} else if (a.getAmountNT() == null && a.getAmountDTH() != null) {
							slth = (a.getAmountPX().doubleValue() - a.getAmountDTH().doubleValue());
						} else if (a.getAmountNT() != null && a.getAmountDTH() != null) {
							slth = (dto.getAmountPX().doubleValue() - a.getAmountNT().doubleValue() - a.getAmountDTH().doubleValue());
						}
//						if (a.getAmountDYCTH() == null) {
						slcl = slth;
//						}
//						if (a.getAmountDYCTH() != null) {
//							slcl = slth - a.getAmountDYCTH().doubleValue();
//						}
						if (slsd != -1) {
//							AssetManageRequestEntityDetailDTO getParentMerId = assetManagementRequestDAO.getParentMerId(dto.getGoodsId(),obj.getConstructionId());
							if (slcl <= slsd) { // Số lượng thu hồi = số lượng hiện có
								if (slcl > 0) {
									// Tạo mới bản ghi orderGoods
									OrderGoodsDTO orderGoods = new OrderGoodsDTO();
									orderGoods.setOrderId(orderId);
									orderGoods.setGoodsType(a.getGoodsType());
									orderGoods.setGoodsTypeName(a.getGoodsTypeName());
									orderGoods.setGoodsId(dto.getGoodsId());
									orderGoods.setGoodsCode(dto.getGoodsCode());
									orderGoods.setGoodsName(dto.getGoodsName());
									orderGoods.setGoodsState("1");
									orderGoods.setGoodsStateName("Bình thường");
									orderGoods.setGoodsUnitId(a.getUnitType());
									orderGoods.setGoodsUnitName(a.getGoodsUnitName());
									orderGoods.setAmount(0d);
									orderGoods.setTotalPrice(0d);
									orderGoods.setGoodsIsSerial("0");
									Long orderGoodId = orderGoodsDAO.saveObject(orderGoods.toModel());
									orderGoodsDAO.getSession().flush();
									List<AssetManageRequestEntityDetailDTO> fa2 = assetManagementRequestDAO.getAmrdTHVTTBDTOListByParent2(dto.getGoodsId(),obj.getConstructionId());
									for (AssetManageRequestEntityDetailDTO b : fa2) {
										if ((dto.getGoodsId().equals(b.getGoodsId())) || (dto.getGoodsCode().equals(b.getGoodsCode())) ) {
											Long merEntityId = b.getMerEntityId().longValue();
											MerEntitySimpleDTO merDTO = (MerEntitySimpleDTO) merEntityBusinessImpl.getOneById(b.getMerEntityId().longValue());
											amount2 = orderGoods.getAmount() + merDTO.getAmount();
											totalPrice = Double.valueOf(String.valueOf(Math.round(orderGoods.getTotalPrice() + merDTO.getAmount()*b.getPrice())));
											orderGoodsDAO.updateTotalPrice(orderGoodId, amount2, totalPrice);
											orderGoodsDAO.getSession().flush();
											orderGoods.setAmount(amount2);
											orderGoods.setTotalPrice(totalPrice);
											
											AssetManageRequestEntityDTO amre = new AssetManageRequestEntityDTO();
											amre.setQuantity(merDTO.getAmount());
											amre.setAssetManagementRequestId(assetManagementRequestId);
											amre.setGoodsName(dto.getGoodsName());
											/**Hoangnh add**/
											MerEntitySimpleDTO merDto = assetManagementRequestDAO.getLevelParentId(b.getMerEntityId().longValue());
											if(merDto.getLevelParentId() != null){
												String [] splitId = merDto.getLevelParentId().split("/");
												amre.setMerEntityId(Double.valueOf(splitId[0]));
											} else {
												amre.setMerEntityId(b.getMerEntityId());
											}
											amre.setParentMerEntityId(b.getMerEntityId());
											amre.setGoodsUnitName(dto.getGoodsUnitName());
											amre.setGoodsId(dto.getGoodsId());
											amre.setSerial(b.getSerial());
											amre.setGoodsCode(dto.getGoodsCode());
											amre.setGoodsIsSerial("0");
											assetManageRequestEntityDAO.saveObject(amre.toModel());
											
											// Cập nhật bản ghi merEntity
											b.setStockId(idCatStockId);
											assetManagementRequestDAO.updateGoodIsSeriaVTTB(b, orderId);
											// Tạo mới bản ghi orderGoodsDetail
											OrderGoodsDetailDTO orderGoodsDetail = new OrderGoodsDetailDTO();
											orderGoodsDetail.setOrderId(orderId);
											orderGoodsDetail.setOrderGoodsId(orderGoodId);
											orderGoodsDetail.setQuantity(merDTO.getAmount());
											orderGoodsDetail.setMerEntityId(merEntityId);
											orderGoodsDetail.setGoodsState("1");
											orderGoodsDetail.setSerial(b.getSerial());
											orderGoodsDetail.setPrice(b.getPrice());
											orderGoodsDetailDAO.saveObject(orderGoodsDetail.toModel());
										}
									}
									
									slsd = slsd - slcl;
								}
							} else { // Số lượng thu hồi < số lượng hiện có
								if (slcl - (slcl - slsd) > 0) {
									// Tạo mới bản ghi orderGoods
									OrderGoodsDTO orderGoods = new OrderGoodsDTO();
									orderGoods.setOrderId(orderId);
									orderGoods.setGoodsType(a.getGoodsType());
									orderGoods.setGoodsTypeName(a.getGoodsTypeName());
									orderGoods.setGoodsId(dto.getGoodsId());
									orderGoods.setGoodsCode(dto.getGoodsCode());
									orderGoods.setGoodsName(dto.getGoodsName());
									orderGoods.setGoodsState("1");
									orderGoods.setGoodsStateName("Bình thường");
									orderGoods.setGoodsUnitId(a.getUnitType());
									orderGoods.setGoodsUnitName(a.getGoodsUnitName());
									orderGoods.setAmount(0d);
									orderGoods.setTotalPrice(0d);
									orderGoods.setGoodsIsSerial("0");
									Long orderGoodId = orderGoodsDAO.saveObject(orderGoods.toModel());
									orderGoodsDAO.getSession().flush();
									List<AssetManageRequestEntityDetailDTO> fa2 =null;
									fa2 = assetManagementRequestDAO.getAmrdTHVTTBDTOListByParent2(dto.getGoodsId(),obj.getConstructionId());
									if(fa2.size() ==0){
										fa2 = assetManagementRequestDAO.getDetailDTOListByParent2(dto.getGoodsId(),obj.getConstructionId());
									}
									// Tạo mới, cập nhật bản ghi merEntity
									for (int l = 0; l < fa2.size(); l++) {
										if ((dto.getGoodsId().equals(fa2.get(l).getGoodsId())) || (dto.getGoodsCode().equals(fa2.get(l).getGoodsCode())) ) {
											MerEntitySimpleDTO merDTO = (MerEntitySimpleDTO) merEntityBusinessImpl.getOneById(fa2.get(l).getMerEntityId().longValue());
											if (merDTO.getAmount() <= slsd) { // Số lượng yêu cầu lớn hơn số lượng có trong merEntity
												amount2 = orderGoods.getAmount() + merDTO.getAmount();
												totalPrice = Double.valueOf(String.valueOf(Math.round(orderGoods.getTotalPrice() + merDTO.getAmount()*fa2.get(l).getPrice())));
												orderGoodsDAO.updateTotalPrice(orderGoodId, amount2, totalPrice);
												orderGoodsDAO.getSession().flush();
												orderGoods.setAmount(amount2);
												orderGoods.setTotalPrice(totalPrice);
												
												AssetManageRequestEntityDTO amre = new AssetManageRequestEntityDTO();
												amre.setQuantity(merDTO.getAmount());
												amre.setAssetManagementRequestId(assetManagementRequestId);
												amre.setGoodsName(dto.getGoodsName());
//												amre.setMerEntityId(fa2.get(l).getMerEntityId());//lay id ban ghi co parent_mer_d is null
//												if(fa2.get(l).getParentMerEntityId() != null){
//													amre.setMerEntityId(fa2.get(l).getParentMerEntityId());
//												} else {
//													amre.setMerEntityId(fa2.get(l).getMerEntityId());
//												}
												/**Hoangnh add**/
												MerEntitySimpleDTO merDto = assetManagementRequestDAO.getLevelParentId(fa2.get(l).getMerEntityId().longValue());
												if(merDto.getLevelParentId() != null){
													String [] splitId = merDto.getLevelParentId().split("/");
													amre.setMerEntityId(Double.valueOf(splitId[0]));
												} else {
													amre.setMerEntityId(fa2.get(l).getMerEntityId());
												}
												amre.setParentMerEntityId(fa2.get(l).getMerEntityId());
												
												/*amre.setParentMerEntityId(fa2.get(l).getMerEntityId());
												if(fa2.get(l).getParentMerEntityId() != null){
													AssetManageRequestEntityDetailDTO listMerId =  assetManagementRequestDAO.listMerId(fa2.get(l).getParentMerEntityId().longValue());
													if(listMerId.getParentMerEntityId() != null){
														if(listMerId.getParentMerEntityId2() != null){
															if(listMerId.getParentMerEntityId3()!= null){
																amre.setMerEntityId(Double.valueOf(listMerId.getParentMerEntityId3()));
															} else {
																amre.setMerEntityId(Double.valueOf(listMerId.getMerEntityId3()));
															}
														} else {
															amre.setMerEntityId(Double.valueOf(listMerId.getMerEntityId2()));
														}
													} else {
														amre.setMerEntityId(fa2.get(l).getParentMerEntityId());
													}
												} else {
													amre.setMerEntityId(fa2.get(l).getMerEntityId());
												}*/
												amre.setGoodsUnitName(dto.getGoodsUnitName());
												amre.setGoodsId(dto.getGoodsId());
												amre.setSerial(fa2.get(l).getSerial());
												amre.setGoodsCode(dto.getGoodsCode());
												amre.setGoodsIsSerial("0");
												assetManageRequestEntityDAO.saveObject(amre.toModel());
												
												AssetManageRequestEntityDetailDTO amred = new AssetManageRequestEntityDetailDTO();
												amred.setStockId(idCatStockId);
												assetManagementRequestDAO.updateStatusMerId(amred, orderId,fa2.get(l).getMerEntityId().longValue());
												// Tạo mới bản ghi orderGoodsDetail
												OrderGoodsDetailDTO orderGoodsDetail = new OrderGoodsDetailDTO();
												orderGoodsDetail.setOrderId(orderId);
												orderGoodsDetail.setOrderGoodsId(orderGoodId);
												orderGoodsDetail.setQuantity(merDTO.getAmount());
												orderGoodsDetail.setMerEntityId(merDTO.getMerEntityId());
												orderGoodsDetail.setGoodsState("1");
												orderGoodsDetail.setSerial(a.getSerial());
												orderGoodsDetail.setPrice(fa2.get(l).getPrice());
												orderGoodsDetailDAO.saveObject(orderGoodsDetail.toModel());
												slsd = slsd - merDTO.getAmount();
												if (slsd == 0) {
													break;
												}
											} else { // Số lượng yêu cầu nhỏ hơn số lượng có trong merEntity thì thực hiện tách 2 bản ghi
												amount2 = orderGoods.getAmount() + slsd;
												totalPrice = orderGoods.getTotalPrice() + slsd*fa2.get(l).getPrice();
												totalPrice = Double.valueOf(String.valueOf(Math.round(orderGoods.getTotalPrice() + slsd*fa2.get(l).getPrice())));
												orderGoodsDAO.updateTotalPrice(orderGoodId, amount2, totalPrice);
												orderGoodsDAO.getSession().flush();
												orderGoods.setAmount(amount2);
												orderGoods.setTotalPrice(totalPrice);
												
												AssetManageRequestEntityDTO amre = new AssetManageRequestEntityDTO();
												amre.setQuantity(slsd);
												amre.setAssetManagementRequestId(assetManagementRequestId);
												amre.setGoodsName(dto.getGoodsName());
//												amre.setMerEntityId(fa2.get(0).getMerEntityId());
//												if(fa2.get(l).getParentMerEntityId() != null){
//													amre.setMerEntityId(fa2.get(l).getParentMerEntityId());
//												} else {
//													amre.setMerEntityId(fa2.get(l).getMerEntityId());
//												}
												/**Hoangnh add**/
												MerEntitySimpleDTO merDto = assetManagementRequestDAO.getLevelParentId(fa2.get(l).getMerEntityId().longValue());
												if(merDto.getLevelParentId() != null){
													String [] splitId = merDto.getLevelParentId().split("/");
													amre.setMerEntityId(Double.valueOf(splitId[0]));
												} else {
													amre.setMerEntityId(fa2.get(l).getMerEntityId());
												}
												amre.setParentMerEntityId(fa2.get(l).getMerEntityId());
//												if(fa2.get(l).getParentMerEntityId() != null){
//													AssetManageRequestEntityDetailDTO listMerId =  assetManagementRequestDAO.listMerId(fa2.get(l).getParentMerEntityId().longValue());
//													if(listMerId.getParentMerEntityId() != null){
//														if(listMerId.getParentMerEntityId2() != null){
//															if(listMerId.getParentMerEntityId3()!= null){
//																amre.setMerEntityId(Double.valueOf(listMerId.getParentMerEntityId3()));
//															} else {
//																amre.setMerEntityId(Double.valueOf(listMerId.getMerEntityId3()));
//															}
//														} else {
//															amre.setMerEntityId(Double.valueOf(listMerId.getMerEntityId2()));
//														}
//													} else {
//														amre.setMerEntityId(fa2.get(l).getParentMerEntityId());
//													}
//												} else {
//													amre.setMerEntityId(fa2.get(l).getMerEntityId());
//												}
												amre.setGoodsUnitName(dto.getGoodsUnitName());
												amre.setGoodsId(dto.getGoodsId());
												amre.setSerial(fa2.get(l).getSerial());
												amre.setGoodsCode(dto.getGoodsCode());
												amre.setGoodsIsSerial("0");
												long amreId = assetManageRequestEntityDAO.saveObject(amre.toModel());
												assetManageRequestEntityDAO.getSession().flush();
												
												// Cập nhật bản ghi merEntity
												double amount = merDTO.getAmount() - slsd;
												assetManagementRequestDAO.updateMerentityVTTB(fa2.get(l).getMerEntityId().longValue(), amount);
												// Cập nhật bản ghi orderGoodsDetail
												orderGoodsDetailDAO.updateQuantityOrderGoodsDetail(fa2.get(l).getMerEntityId().longValue(), amount);
												// Tạo mới bản ghi merEntity
												MerEntitySimpleDTO merClone = new MerEntitySimpleDTO();
												merClone = merDTO;
												merClone.setAmount(slsd);
												merClone.setParentMerEntityId(fa2.get(l).getMerEntityId().longValue());
												merClone.setStatus("3");
												merClone.setOrderId(orderId);
												merClone.setUpdatedDate(new Date());
												merClone.setStockId(idCatStockId);
												merClone.setMerEntityId(null);
												if(merDto.getLevelParentId() != null){
													merClone.setLevelParentId(merDto.getLevelParentId() + "/" + String.valueOf(fa2.get(l).getMerEntityId().longValue()));
												} else {
													merClone.setLevelParentId(String.valueOf(fa2.get(l).getMerEntityId().longValue()));
												}
												Long merEntityId = merEntityBusinessImpl.save(merClone);
												// Tạo mới bản ghi orderGoodsDetail
												OrderGoodsDetailDTO orderGoodsDetail2 = new OrderGoodsDetailDTO();
												orderGoodsDetail2.setOrderId(orderId);
												orderGoodsDetail2.setOrderGoodsId(orderGoodId);
												orderGoodsDetail2.setQuantity(slsd);
												orderGoodsDetail2.setMerEntityId(merEntityId);
												orderGoodsDetail2.setGoodsState("1");
												orderGoodsDetail2.setSerial(merDTO.getSerial());
												orderGoodsDetail2.setPrice(fa2.get(l).getPrice());
												orderGoodsDetailDAO.saveObject(orderGoodsDetail2.toModel());
												// Cập nhật bản ghi assetManageRequestEntity
												assetManageRequestEntityDAO.updateMerentityById(fa2.get(l).getMerEntityId().longValue(), amreId);
												break;
											}
										}
									}
								}
							}
						}
						break;
					}
				}
			}

		}

		// Danh sách thiết bị - Có serial
		if (obj.getAmrdDSTBDTOList().size() > 0) {

			// Gộp danh sách hàng hóa có cùng goodsId
			List<AssetManageRequestEntityDetailDTO> orderGoodsList = new ArrayList<>();
			boolean checkItem = false;
			for (int h = 0; h < obj.getAmrdDSTBDTOList().size(); h++) {
				if (h == 0) {
					orderGoodsList.add(obj.getAmrdDSTBDTOList().get(h));
				} else {
					for (int k = 0; k < orderGoodsList.size(); k++) {
						if (obj.getAmrdDSTBDTOList().get(h).getGoodsId().equals(orderGoodsList.get(k).getGoodsId())) {
							checkItem = false;
							if (orderGoodsList.get(k).getAmountPX() != null) {
								orderGoodsList.get(k).setAmountPX(orderGoodsList.get(k).getAmountPX()
										+ obj.getAmrdDSTBDTOList().get(h).getAmountPX());
							}
							if (orderGoodsList.get(k).getAmountNT() != null) {
								orderGoodsList.get(k).setAmountNT(orderGoodsList.get(k).getAmountNT()
										+ obj.getAmrdDSTBDTOList().get(h).getAmountNT());
							}
							if (orderGoodsList.get(k).getAmountDTH() != null) {
								orderGoodsList.get(k).setAmountDTH(orderGoodsList.get(k).getAmountDTH()
										+ obj.getAmrdDSTBDTOList().get(h).getAmountDTH());
							}
							if (orderGoodsList.get(k).getAmountDYCTH() != null) {
								orderGoodsList.get(k).setAmountDYCTH(orderGoodsList.get(k).getAmountDYCTH()
										+ obj.getAmrdDSTBDTOList().get(h).getAmountDYCTH());
							}
							if (orderGoodsList.get(k).getConsQuantity() != null) {
								orderGoodsList.get(k).setConsQuantity(orderGoodsList.get(k).getConsQuantity()
										+ obj.getAmrdDSTBDTOList().get(h).getConsQuantity());
							}
							if (orderGoodsList.get(k).getAmountGoodsCode() != null) {
								orderGoodsList.get(k).setAmountGoodsCode(orderGoodsList.get(k).getAmountGoodsCode()
										+ obj.getAmrdDSTBDTOList().get(h).getAmountGoodsCode());
							}
							if (orderGoodsList.get(k).getTotalPrice() != null) {
								orderGoodsList.get(k).setTotalPrice(orderGoodsList.get(k).getTotalPrice()
										+ obj.getAmrdDSTBDTOList().get(h).getTotalPrice());
							}
							if (orderGoodsList.get(k).getaMountMerentity() != null) {
								orderGoodsList.get(k).setaMountMerentity(orderGoodsList.get(k).getaMountMerentity()
										+ obj.getAmrdDSTBDTOList().get(h).getaMountMerentity());
							}
						} else {
							checkItem = true;
						}
					}

					if (checkItem == true) {
						orderGoodsList.add(obj.getAmrdDSTBDTOList().get(h));
					}
				}
			}

			if (orderGoodsList.size() == obj.getAmrdDSTBDTOList().size()) { // Không có hàng hóa trùng
				for (AssetManageRequestEntityDetailDTO dto : obj.getAmrdDSTBDTOList()) {
					dto.setAssetManagementRequestId(assetManagementRequestId);
					dto.setQuantity(1d);
					dto.setMerEntityId((double) dto.getMerentityId());
					dto.setGoodsId(dto.getGoodsId());
					dto.setSerial(dto.getSerial());
					dto.setGoodsUnitName(dto.getGoodsUnitName());
					dto.setGoodsIsSerial("1");
					assetManageRequestEntityDAO.saveObject(dto.toModel());

					// Tạo mới bản ghi orderGoods
					OrderGoodsDTO orderGoods = new OrderGoodsDTO();
					orderGoods.setOrderId(orderId);
					orderGoods.setGoodsType(dto.getGoodsType());
					orderGoods.setGoodsTypeName(dto.getGoodsTypeName());
					orderGoods.setGoodsId(dto.getGoodsId());
					orderGoods.setGoodsCode(dto.getGoodsCode());
					orderGoods.setGoodsName(dto.getGoodsName());
					orderGoods.setGoodsState("1");
					orderGoods.setGoodsStateName("Bình thường");
					orderGoods.setGoodsUnitId(dto.getUnitType());
					orderGoods.setGoodsUnitName(dto.getGoodsUnitName());
					orderGoods.setAmount(1d);
					orderGoods.setTotalPrice(Double.valueOf(String.valueOf(Math.round(orderGoods.getAmount() * dto.getApplyPrice()))));
					orderGoods.setGoodsIsSerial("1");
					Long orderGoodId = orderGoodsDAO.saveObject(orderGoods.toModel());

					// Cập nhật bản ghi merEntity
					dto.setStockId(idCatStockId);
					assetManagementRequestDAO.updateGoodIsSeriaVTTB(dto, orderId);
					Long merEntityId = dto.getMerEntityId().longValue();

					// Tạo mới bản ghi orderGoodsDetail
					OrderGoodsDetailDTO orderGoodsDetail = new OrderGoodsDetailDTO();
					orderGoodsDetail.setOrderId(orderId);
					orderGoodsDetail.setOrderGoodsId(orderGoodId);
					orderGoodsDetail.setQuantity(1d);
					orderGoodsDetail.setMerEntityId(merEntityId);
					orderGoodsDetail.setGoodsState("1");
					orderGoodsDetail.setSerial(dto.getSerial());
					orderGoodsDetail.setPrice(dto.getApplyPrice());
					orderGoodsDetailDAO.saveObject(orderGoodsDetail.toModel());
				}
			} else { // Đã gộp hàng hóa trùng
				for (AssetManageRequestEntityDetailDTO dtoOg : orderGoodsList) {
					// Tạo mới bản ghi orderGoods
					OrderGoodsDTO orderGoods = new OrderGoodsDTO();
					orderGoods.setOrderId(orderId);
					orderGoods.setGoodsType(dtoOg.getGoodsType());
					orderGoods.setGoodsTypeName(dtoOg.getGoodsTypeName());
					orderGoods.setGoodsId(dtoOg.getGoodsId());
					orderGoods.setGoodsCode(dtoOg.getGoodsCode());
					orderGoods.setGoodsName(dtoOg.getGoodsName());
					orderGoods.setGoodsState("1");
					orderGoods.setGoodsStateName("Bình thường");
					orderGoods.setGoodsUnitId(dtoOg.getUnitType());
					orderGoods.setGoodsUnitName(dtoOg.getGoodsUnitName());
					orderGoods.setAmount(dtoOg.getAmountPX());
					orderGoods.setTotalPrice(Double.valueOf(String.valueOf(Math.round(orderGoods.getAmount() * dtoOg.getApplyPrice()))));
					orderGoods.setGoodsIsSerial("1");
					Long orderGoodId = orderGoodsDAO.saveObject(orderGoods.toModel());

					for (AssetManageRequestEntityDetailDTO dto : obj.getAmrdDSTBDTOList()) {
						dto.setAssetManagementRequestId(assetManagementRequestId);
						dto.setQuantity(1d);
						dto.setMerEntityId((double) dto.getMerentityId());
						dto.setGoodsId(dto.getGoodsId());
						dto.setSerial(dto.getSerial());
						dto.setGoodsUnitName(dto.getGoodsUnitName());
						dto.setGoodsIsSerial("1");
						assetManageRequestEntityDAO.saveObject(dto.toModel());

						// Cập nhật bản ghi merEntity
						dto.setStockId(idCatStockId);
						assetManagementRequestDAO.updateGoodIsSeriaVTTB(dto, orderId);
						Long merEntityId = dto.getMerEntityId().longValue();

						// Tạo mới bản ghi orderGoodsDetail
						OrderGoodsDetailDTO orderGoodsDetail = new OrderGoodsDetailDTO();
						orderGoodsDetail.setOrderId(orderId);
						orderGoodsDetail.setOrderGoodsId(orderGoodId);
						orderGoodsDetail.setQuantity(1d);
						orderGoodsDetail.setMerEntityId(merEntityId);
						orderGoodsDetail.setGoodsState("1");
						orderGoodsDetail.setSerial(dto.getSerial());
						orderGoodsDetail.setPrice(dto.getApplyPrice());
						orderGoodsDetailDAO.saveObject(orderGoodsDetail.toModel());
					}
				}
			}
		}

		// Danh sách file đính kèm
		if (obj.getListFileTHVTTB() != null) {
			for (UtilAttachDocumentDTO file : obj.getListFileTHVTTB()) {
				if (file.getUtilAttachDocumentId() == null) {
					file.setObjectId(assetManagementRequestId);
					file.setType("49");
					file.setCreatedDate(new Date());
					file.setCreatedUserId(obj.getUpdatedUserId());
					file.setDescription("file yeu cau THVT");
					file.setFilePath(UEncrypt.decryptFileUploadPath(file.getFilePath()));
					utilAttachDocumentDAO.saveObject(file.toModel());
				}
			}
		}
		return assetManagementRequestId;
	}

	public List<CatCommonDTO> getCatReason() {
		// TODO Auto-generated method stub
		return assetManagementRequestDAO.getCatReason();
	}

	public List<StockTransGeneralDTO> getStockTrans(Long id) {
		return assetManagementRequestDAO.getStockTrans(id);
	}

	public AssetManagementRequestDetailDTO getById(AssetManagementRequestDetailDTO obj) throws Exception {
		// TODO Auto-generated method stub
		AssetManagementRequestDetailDTO data = assetManagementRequestDAO.getById(obj.getAssetManagementRequestId());

		data.setListFileTHVTTB(utilAttachDocumentDAO.getByTypeAndObject(obj.getAssetManagementRequestId(), 49L));
//		data.setAmrdDSVTDTOList(assetManagementRequestDAO
//				.getAmrdTHVTTBDTOListByParent(obj.getConstructionId(),obj.getAssetManagementRequestId()));
//		data.setAmrdDSTBDTOList(assetManagementRequestDAO
//				.getAmrdDSTBDTOListByParent(obj.getConstructionId()));

		return data;
	}

	public List<AssetManageRequestEntityDetailDTO> getDSVT(AssetManagementRequestDetailDTO obj) {
		return assetManagementRequestDAO.getDetailDSVT(obj.getAssetManagementRequestId());

	}

	public List<AssetManageRequestEntityDetailDTO> getDSVTT(AssetManagementRequestDetailDTO obj) {
		List<AssetManageRequestEntityDetailDTO> listDSTHT = assetManagementRequestDAO
				.LAYTHEOGROUPT(obj.getConstructionId(), obj.getAssetManagementRequestId());
		for (AssetManageRequestEntityDetailDTO listDSTHTDetail : listDSTHT) {
			if (listDSTHTDetail.getConsQuantity() == null) {
				listDSTHTDetail.setConsQuantity(
						(listDSTHTDetail.getAmountPX() - listDSTHTDetail.getAmountNT() - listDSTHTDetail.getAmountDTH())
								- listDSTHTDetail.getAmountDYCTH());
			}
		}
		return listDSTHT;
	}

	public List<AssetManageRequestEntityDetailDTO> getDSTBT(AssetManagementRequestDetailDTO obj) {
		List<AssetManageRequestEntityDetailDTO> fa1 = new ArrayList<AssetManageRequestEntityDetailDTO>();
		List<AssetManageRequestEntityDetailDTO> fa = assetManagementRequestDAO.getAmrdDSTBDTOListByParentT(obj.getConstructionId(), obj.getAssetManagementRequestId());
		for (AssetManageRequestEntityDetailDTO a : fa) {
			if (a.getAmountDTH() == null) {
				a.setAmountDTH(0d);
			}
			if (a.getAmountNT() == null) {
				a.setAmountNT(0d);
			}
			if (a.getAmountPX() != null && a.getAmountDTH() != null && a.getAmountNT() != null) {
				if (a.getAmountPX().intValue() - a.getAmountDTH().intValue() - a.getAmountNT().intValue() != 0) {
					fa1.add(a);
				}
			}
		}
		return fa1;
	}

//	public List<AssetManageRequestEntityDetailDTO> getDSTB(AssetManagementRequestDetailDTO obj) {
//		List<AssetManageRequestEntityDetailDTO> fa1 = new ArrayList<AssetManageRequestEntityDetailDTO>();
//		List<AssetManageRequestEntityDetailDTO> fa = assetManagementRequestDAO.getAmrdDSTBDTOListByParent(obj.getConstructionId(), obj.getAssetManagementRequestId());
//		for (AssetManageRequestEntityDetailDTO a : fa) {
//			if (a.getAmountDTH() == null) {
//				a.setAmountDTH(0d);
//			}
//			if (a.getAmountNT() == null) {
//				a.setAmountNT(0d);
//			}
//			if (a.getConsQuantity() == null) {
//				a.setConsQuantity(0d);
//			}
//			if (a.getAmountPX() != null && a.getAmountDTH() != null && a.getAmountNT() != null) {
//
//				if (a.getAmountPX().intValue() - a.getAmountDTH().intValue() - a.getAmountNT().intValue() != 0) {
//					fa1.add(a);
//				}
//			}
//		}
//		return fa1;
//	}
	
	public List<AssetManageRequestEntityDetailDTO> getDSTB(AssetManagementRequestDetailDTO obj) {
		return assetManagementRequestDAO.getDetailDSTB(obj.getAssetManagementRequestId());

	}

	public void removeTHVT(AssetManagementRequestDetailDTO obj, String userName) throws Exception {
		long constructionId = obj.getConstructionId();
		boolean flag = false;
		List<AssetManageRequestEntityDetailDTO> listMerentity = assetManagementRequestDAO.getListMerentityTask(obj.getAssetManagementRequestId());
		for (AssetManageRequestEntityDetailDTO dtoListMerentity : listMerentity) {
			StockTransDTO dto = assetManagementRequestDAO.getStockTransDetail(dtoListMerentity.getImportStockTransId());
			List<AssetManageRequestEntityDetailDTO> detailDto = assetManagementRequestDAO.getMerEntityIdOrigin(obj.getAssetManagementRequestId());
			for(int k=0 ; k < detailDto.size() ; k++){
				if(!detailDto.get(k).getMerEntityId2().toString().trim().equals(dtoListMerentity.getMerentityId().toString().trim())){
					assetManagementRequestDAO.updateStatusMerentity(dtoListMerentity.getMerentityId(), dto.getStockId(),obj.getConstructionId());
				} else {
					assetManagementRequestDAO.updateStatusMer(dtoListMerentity.getMerentityId(), dto.getStockId());
				}
			}
			
		}
		List<Long> listIdContructionMerchandise = assetManagementRequestDAO.getAllListId(obj);
		for (Long id : listIdContructionMerchandise) {
			if (id == constructionId) {
				flag = true;
			}
		}
		if (flag) {
			List<StockTransGeneralDTO> listDSVTBB = constructionDAO.getListVTBB(obj.getConstructionId());
			for (StockTransGeneralDTO dto : listDSVTBB) {
				if (dto.getNumberSuDung() == null && dto.getNumberXuat() != null) {
					dto.setNumberSuDung(0d);
				}
				List<StockTransGeneralDTO> fa = constructionMerchandiseDAO.getListVatTu1(obj.getConstructionId(), dto.getGoodsId(), obj.getAssetManagementRequestId());
				int slcl = 0;
				int slsd = dto.getNumberSuDung().intValue();
				dto.setNumberThuhoi(0d);
				for (StockTransGeneralDTO a : fa) {
					if (a.getNumberThuhoi() == null) {
						slcl = a.getNumberXuat().intValue();
					}
					if (a.getNumberThuhoi() != null) {
						slcl = a.getNumberXuat().intValue() - a.getNumberThuhoi().intValue();
					}
					if (slcl < slsd) {
						a.setRemainQuantity((double) slcl - slsd);
						assetManagementRequestDAO.updateConstructionMerchandise(a.getMerEntityId(), a.getGoodsId(), a.getRemainQuantity());
						slsd = slsd - slcl;
					} else if (slcl >= slsd) {
						a.setRemainQuantity((double) slcl - (slsd));
						assetManagementRequestDAO.updateConstructionMerchandise(a.getMerEntityId(), a.getGoodsId(), a.getRemainQuantity());
						slsd = 0;
					}
				}
			}
		}
		List<AssetManageRequestEntityDetailDTO> fa = assetManagementRequestDAO.getAmrdDSTBDTOListByParent(obj.getConstructionId(), obj.getAssetManagementRequestId());
		List<String> stringSerial = assetManagementRequestDAO.getConstructionMerchandise(obj);
		for (AssetManageRequestEntityDetailDTO a : fa) {
			if (a.getAmountDTH() == null) {
				a.setAmountDTH(0d);
			}
			if (a.getAmountNT() == null) {
				a.setAmountNT(0d);
			}
			if (a.getConsQuantity() == null) {
				a.setConsQuantity(0d);
			}
			if (a.getAmountPX() != null && a.getAmountDTH() != null && a.getAmountNT() != null) {
				boolean flag1 = false;
				if (a.getConsQuantity().intValue() == 1) {
					for (String serial : stringSerial) {
						if (a.getSerial() == serial) {
							flag1 = true;
						}
					}
					if (flag1 == false) {
						ConstructionMerchandiseDTO tb = new ConstructionMerchandiseDTO();
						String type = "2";
						Double quantity = 0D;
						Double remainCount = 1D;
						tb.setGoodsCode(a.getGoodsCode());
						tb.setRemainCount(remainCount);
						tb.setType(type);
						tb.setQuantity(quantity);
						tb.setGoodsName(a.getGoodsName());
						tb.setMerEntityId(a.getMerentityId());
						tb.setConstructionId(a.getConstructionId());
						tb.setGoodsUnitName(a.getGoodsUnitName());
						tb.setGoodsId(a.getGoodsId());
						tb.setGoodsIsSerial("1");
						tb.setSerial(a.getSerial());
						constructionMerchandiseDAO.saveObject(tb.toModel());
						flag1 = false;
					}
				}
			}
		}
		assetManagementRequestDAO.removeVTTB(obj.getAssetManagementRequestId());
		assetManagementRequestDAO.removeDSVT(obj.getAssetManagementRequestId());
		Long orderIsdOld = assetManagementRequestDAO.getOrdersId(obj.getAssetManagementRequestId());
		assetManagementRequestDAO.removeOrderGoodsDetail(orderIsdOld);
		assetManagementRequestDAO.removeOrderGoods(orderIsdOld);
		assetManagementRequestDAO.removeOrder(obj.getAssetManagementRequestId());
	}

	public Long updateHSHCItem(AssetManagementRequestDetailDTO obj, String userName) throws Exception {
		// TODO Auto-generated method stub
		// sua du lieu trong bang asset_management_request
		assetManagementRequestDAO.updateVTTBItem(obj);
		// bang thu hoi hang hoa asset-management-request-entity (DSVT)

		if (obj.getAmrdDSVTDTOList() != null || obj.getAmrdDSTBDTOList() != null) {
			assetManagementRequestDAO.removeDSVT(obj.getAssetManagementRequestId());

		}
		if (obj.getAmrdDSVTDTOList() != null) {
//			assetManagementRequestDAO.removeDSVT(obj.getAssetManagementRequestId());

			for (AssetManageRequestEntityDetailDTO dto : obj.getAmrdDSVTDTOList()) {
				List<AssetManageRequestEntityDetailDTO> fa = assetManagementRequestDAO.getAmrdTHVTTBDTOListByParent(
						obj.getConstructionId(), obj.getAssetManagementRequestId(), dto.getGoodsId());
				int slcl = 0;
				int slsd = dto.getConsQuantity().intValue();
				for (AssetManageRequestEntityDetailDTO a : fa) {
					int slth = 0;
					if (a.getAmountNT() == null && a.getAmountDTH() == null) {
						slth = (a.getAmountPX().intValue());
					} else if (a.getAmountNT() != null && a.getAmountDTH() == null) {
						slth = (a.getAmountPX().intValue() - a.getAmountNT().intValue());
					} else if (a.getAmountNT() == null && a.getAmountDTH() != null) {
						slth = (a.getAmountPX().intValue() - a.getAmountDTH().intValue());
					} else if (a.getAmountNT() != null && a.getAmountDTH() != null) {
						slth = (a.getAmountPX().intValue() - a.getAmountNT().intValue() - a.getAmountDTH().intValue());
					}

					if (a.getAmountDYCTH() == null) {
						slcl = slth;
					}
					if (a.getAmountDYCTH() != null) {
						slcl = slth - a.getAmountDYCTH().intValue();
					}
					if (slsd != -1) {

						if (slcl < slsd) {
							AssetManageRequestEntityDTO amre = new AssetManageRequestEntityDTO();

							amre.setQuantity((double) slcl);
							amre.setAssetManagementRequestId(obj.getAssetManagementRequestId());
							amre.setGoodsName(dto.getGoodsName());
							amre.setMerEntityId(a.getMerEntityId());
							amre.setGoodsUnitName(dto.getGoodsUnitName());
							amre.setGoodsId(dto.getGoodsId());
							amre.setSerial(a.getSerial());
							amre.setGoodsCode(dto.getGoodsCode());
							amre.setGoodsIsSerial("0");
							assetManageRequestEntityDAO.saveObject(amre.toModel());
							assetManageRequestEntityDAO.getSession().flush();
							slsd = slsd - slcl;

						} else if (slcl >= slsd) {
							AssetManageRequestEntityDTO amre = new AssetManageRequestEntityDTO();
							// assetManagementRequestDAO.removeDSVT(a.getMerEntityId(),obj.getAssetManagementRequestId());
							amre.setAssetManagementRequestId(obj.getAssetManagementRequestId());
							amre.setQuantity((double) slcl - (slcl - slsd));
							amre.setGoodsName(dto.getGoodsName());
							amre.setMerEntityId(a.getMerEntityId());
							amre.setGoodsUnitName(dto.getGoodsUnitName());
							amre.setGoodsId(dto.getGoodsId());
							amre.setSerial(a.getSerial());
							amre.setGoodsCode(dto.getGoodsCode());
							amre.setGoodsIsSerial("0");

							assetManageRequestEntityDAO.saveObject(amre.toModel());
							assetManageRequestEntityDAO.getSession().flush();
							slsd = -1;

						}
					}

				}

			}
		}

		// them DSTB vao bang Asset_management_request_entity

		if (obj.getAmrdDSTBDTOList() != null) {
//			assetManagementRequestDAO.removeDSTB(obj.getAssetManagementRequestId());

			for (AssetManageRequestEntityDetailDTO dto : obj.getAmrdDSTBDTOList()) {
				if (dto.getEmploy() == null) {
					dto.setEmploy(0l);
				}
				if (dto.getEmploy() == 1) {

					dto.setAssetManagementRequestId(obj.getAssetManagementRequestId());
					dto.setQuantity(1d);
					dto.setSerial(dto.getSerial());
					dto.setMerEntityId((double) dto.getMerentityId());
					dto.setGoodsId(dto.getGoodsId());
					dto.setGoodsUnitName(dto.getGoodsUnitName());

					dto.setGoodsIsSerial("1");
					assetManageRequestEntityDAO.saveObject(dto.toModel());
					assetManageRequestEntityDAO.getSession().flush();
				}
//				else 
//				{
////					assetManagementRequestDAO.removeDSTB(dto.getMerEntityId(),obj.getAssetManagementRequestId());
//
//					dto.setAssetManagementRequestId(obj.getAssetManagementRequestId());
//					dto.setQuantity(0d);
//					dto.setSerial(dto.getSerial());
//					dto.setMerEntityId((double)dto.getMerentityId());
//					dto.setGoodsId(dto.getGoodsId());
//					dto.setGoodsUnitName(dto.getGoodsUnitName());
//					
//					dto.setGoodsIsSerial("1");
//
//					assetManageRequestEntityDAO.saveObject(dto.toModel());
//					assetManageRequestEntityDAO.getSession().flush();
//				}

			}
		}

		// xoa bang order va them moi bang order theo du lieu moi
//		assetManagementRequestDAO.removeOrder(obj.getAssetManagementRequestId(),obj.getConstructionId());
//		Long orderIsdOld=assetManagementRequestDAO.getOrdersId(obj.getAssetManagementRequestId());
//
//		assetManagementRequestDAO.removeOrderGoodsDetail(orderIsdOld);
//		assetManagementRequestDAO.removeMerentity(orderIsdOld);
//		assetManagementRequestDAO.removeOrderGoods(orderIsdOld);
//
//		assetManagementRequestDAO.removeOrder(obj.getAssetManagementRequestId());

		// them moi vao bang order
		Long idCatStockId = assetManagementRequestDAO.getCatStockId(obj.getConstructionId());
		long year = (new Date()).getYear();
		long newYear = year % 100;
		Long sequenceOrders = assetManagementRequestDAO.getSequenceOrders();
		String sequenceOrderString = String.valueOf(sequenceOrders);
		String codeCatStock = assetManagementRequestDAO.getCodeCatStock(obj.getConstructionId());
		String codeSysGroup = assetManagementRequestDAO.getCodeSysGroup(obj.getRequestGroupId());

		int c = sequenceOrderString.length();
		if (c == 1) {
			sequenceOrderString = "00000" + sequenceOrderString;

		}
		if (c == 2) {
			sequenceOrderString = "0000" + sequenceOrderString;
		}
		if (c == 3) {
			sequenceOrderString = "000" + sequenceOrderString;
		}
		if (c == 4) {
			sequenceOrderString = "00" + sequenceOrderString;
		}
		if (c == 5) {
			sequenceOrderString = "0" + sequenceOrderString;
		}
		String codeOrders = "YCNK" + codeCatStock + "_" + codeSysGroup + "/" + newYear + "/" + sequenceOrderString;

		OrdersDTO order = new OrdersDTO();
//			order.setCode(obj.getCode());
		order.setCode(codeOrders);
		order.setStockId(idCatStockId);

		order.setType("1");
		order.setBussinessType("4");
		order.setStatus("1");
		order.setCreatedDate(new Date());
		order.setCreatedBy(obj.getUpdatedUserId());
		order.setCreatedByName(obj.getUpdateFullName());
		order.setCreatedDeptedId(obj.getUpdatedGroupId());
//			order.setCreatedDeptedName(obj.getUpdateGroupName());
		order.setShipmentId(obj.getUpdatedUserId());
		order.setShipperName(obj.getUpdateFullName());
		order.setAssetManagementRequestId(obj.getAssetManagementRequestId());
		order.setConstructionCode(obj.getConstructionCode());
		order.setSignState("1");

		order.setDeptReceiveId(obj.getRequestGroupId());
		order.setDeptReceiveName(obj.getRequestGroupName());

		order.setCreatedDeptedName(obj.getUpdateGroupName());
		order.setContractCode(obj.getCode());

		Long orderId = ordersDAO.saveObject(order.toModel());
		ordersDAO.getSession().flush();

		// xoa bang order-goods va them moi bang order gooods theo du lieu moi

		// them moi vao bang odergoods

		List<AssetManageRequestEntityDetailDTO> listEntity = assetManagementRequestDAO
				.getListEntityTask(obj.getAssetManagementRequestId());
		for (AssetManageRequestEntityDetailDTO dtoListEntity : listEntity) {
			OrderGoodsDTO orderGoods = new OrderGoodsDTO();
			orderGoods.setOrderId(orderId);
			orderGoods.setGoodsId(dtoListEntity.getGoodsId());
			orderGoods.setGoodsCode(dtoListEntity.getGoodsCode());
			orderGoods.setGoodsName(dtoListEntity.getGoodsName());
			orderGoods.setGoodsState("1");
			orderGoods.setGoodsStateName("Bình thường");
			orderGoods.setGoodsUnitName(dtoListEntity.getGoodsUnitName());
			orderGoods.setAmount(dtoListEntity.getAmountGoodsCode());
			orderGoods.setTotalPrice(dtoListEntity.getTotalPrice());

			orderGoods.setGoodsIsSerial(dtoListEntity.getGoodsIsSerial());

			Long orderGoodId = orderGoodsDAO.saveObject(orderGoods.toModel());
			orderGoodsDAO.getSession().flush();

		}
		// xoa du lieu mer_entity va them moi bang mer_entity theo du lieu moi
		// them moi vao bang merentity
		List<Long> idMerentity = assetManagementRequestDAO.getListIdMerentity();

		List<AssetManageRequestEntityDetailDTO> listMerentity = assetManagementRequestDAO
				.getListMerentityTask(obj.getAssetManagementRequestId());
		for (AssetManageRequestEntityDetailDTO dtoListMerentity : listMerentity) {
			for (Long id : idMerentity) {
				if (id != null && dtoListMerentity.getMerentityId() != null) {
					if (id.intValue() == dtoListMerentity.getMerentityId().intValue()) {
						MerEntitySimpleDTO bo = (MerEntitySimpleDTO) merEntityBusinessImpl.getOneById(id);
						bo.setAmount(dtoListMerentity.getQuantity());
						bo.setParentMerEntityId(dtoListMerentity.getMerentityId());
						bo.setStatus("3");
						bo.setOrderId(orderId);

//						bo.setOrderId(11111l);
						String merEntityId = merEntityDAO.save(bo.toModel());
						merEntityDAO.getSession().flush();

					}
				}
			}
		}
		List<AssetManageRequestEntityDetailDTO> listMerentityGoodIsSerial = assetManagementRequestDAO
				.getListMerentityGoodIsSeriaTask(obj.getAssetManagementRequestId());
		for (AssetManageRequestEntityDetailDTO dtoListMerentityGoodIsSerial : listMerentityGoodIsSerial) {
			for (Long id : idMerentity) {
				if (id != null && dtoListMerentityGoodIsSerial.getMerentityId() != null) {
					if (id.intValue() == dtoListMerentityGoodIsSerial.getMerentityId().intValue()) {
						dtoListMerentityGoodIsSerial.setStockId(idCatStockId);
						assetManagementRequestDAO.updateGoodIsSeriaVTTB(dtoListMerentityGoodIsSerial, orderId);
					}
				}
			}
		}

		// xoa du lieu bang order_goods_detail va them moi du lieu moi cap nhat

		// //them moi vao bang ordergoodsdetail theo merentity insert trong bang
		// asset-mangement-request-entity
		if (obj.getAmrdDSVTDTOList() != null) {
			for (AssetManageRequestEntityDetailDTO dto : obj.getAmrdDSVTDTOList()) {
				List<AssetManageRequestEntityDetailDTO> fa = assetManagementRequestDAO.getAmrdTHVTTBDTOListByParent(
						obj.getConstructionId(), obj.getAssetManagementRequestId(), dto.getGoodsId());
				double slcl = 0;
				double slsd = dto.getConsQuantity().intValue();
				for (AssetManageRequestEntityDetailDTO a : fa) {

//					int slth=(a.getAmountPX().intValue()-a.getAmountNT().intValue()-a.getAmountDTH().intValue());
					int slth = 0;
					if (a.getAmountNT() == null && a.getAmountDTH() == null) {
						slth = (a.getAmountPX().intValue());
					} else if (a.getAmountNT() != null && a.getAmountDTH() == null) {
						slth = (a.getAmountPX().intValue() - a.getAmountNT().intValue());
					} else if (a.getAmountNT() == null && a.getAmountDTH() != null) {
						slth = (a.getAmountPX().intValue() - a.getAmountDTH().intValue());
					} else if (a.getAmountNT() != null && a.getAmountDTH() != null) {
						slth = (a.getAmountPX().intValue() - a.getAmountNT().intValue() - a.getAmountDTH().intValue());
					}

					if (a.getAmountDYCTH() == null) {
						slcl = slth;
					}
					if (a.getAmountDYCTH() != null) {
						slcl = slth - a.getAmountDYCTH().intValue();
					}
					if (slsd != 0) {

						if (slcl < slsd) {
							AssetManageRequestEntityDTO amre = new AssetManageRequestEntityDTO();

							// them moi vao bang ordergoodsdetail
							Long merEntityId = assetManagementRequestDAO.getMerEntity(a.getMerEntityId(), orderId);
//							Double applyPrice=assetManagementRequestDAO.getMerApplyPrice(merEntityId);

							OrderGoodsDetailDTO orderGoodsDetail = new OrderGoodsDetailDTO();

							// assetManagementRequestDAO.removeOrderGoodsDetail(a.getMerEntityId(),orderId,dto.getGoodsId());

							orderGoodsDetail.setSerial(dto.getSerial());
//							orderGoodsDetail.setOrderGoodsDetailId(obj.getGoodIdEntity());
							orderGoodsDetail.setOrderId(orderId);
							orderGoodsDetail.setOrderGoodsId(dto.getGoodsId());
							// long quantityEntity=obj.getQuantityEntity().intValue();
							// orderGoodsDetail.setQuantity((long) 0);
							orderGoodsDetail.setQuantity(slcl);

//							orderGoodsDetail.setMerEntityId( Math.round(a.getMerEntityId()));
							orderGoodsDetail.setMerEntityId(merEntityId);
							orderGoodsDetail.setGoodsState("1");
							orderGoodsDetail.setSerial(a.getSerial());
//							orderGoodsDetail.setPrice(applyPrice);
							Long orderGoodsDetailId = orderGoodsDetailDAO.saveObject(orderGoodsDetail.toModel());
							slsd = slsd - slcl;

						} else if (slcl >= slsd) {

							// them moi vao bang ordergoodsdetail
							Long merEntityId = assetManagementRequestDAO.getMerEntity(a.getMerEntityId(), orderId);
//							Double applyPrice=assetManagementRequestDAO.getMerApplyPrice(merEntityId);

							OrderGoodsDetailDTO orderGoodsDetail = new OrderGoodsDetailDTO();
							// assetManagementRequestDAO.removeOrderGoodsDetail(a.getMerEntityId(),orderId,dto.getGoodsId());

							orderGoodsDetail.setSerial(dto.getSerial());

//							orderGoodsDetail.setOrderGoodsDetailId(obj.getGoodIdEntity());
							orderGoodsDetail.setOrderId(orderId);
							orderGoodsDetail.setOrderGoodsId(dto.getGoodsId());
							// long quantityEntity=obj.getQuantityEntity().intValue();
							orderGoodsDetail.setQuantity(slcl - (slcl - slsd));
//							orderGoodsDetail.setMerEntityId(Math.round( a.getMerEntityId()));
							orderGoodsDetail.setMerEntityId(merEntityId);
							orderGoodsDetail.setGoodsState("1");
							orderGoodsDetail.setSerial(a.getSerial());
//							orderGoodsDetail.setPrice(applyPrice);

							Long orderGoodsDetailId = orderGoodsDetailDAO.saveObject(orderGoodsDetail.toModel());
							slsd = 0;

						}
					}

				}
//				dto.setAssetManagementRequestId(assetManagementRequestId);
//				assetManageRequestEntityDAO.saveObject(dto.toModel());
//				assetManageRequestEntityDAO.getSession().flush();
			}
		}

		// Sua moi order_good_detail theo DSTB
		if (obj.getAmrdDSTBDTOList() != null) {

			for (AssetManageRequestEntityDetailDTO dto : obj.getAmrdDSTBDTOList()) {
				if (dto.getEmploy() == 1) {

					// them moi vao bang ordergoodsdetail
					Long merEntityId = assetManagementRequestDAO.getMerEntityVTTB(dto.getMerEntityId(), orderId);
					Double applyPrice = assetManagementRequestDAO.getMerApplyPrice(merEntityId);

					OrderGoodsDetailDTO orderGoodsDetail = new OrderGoodsDetailDTO();
					orderGoodsDetail.setSerial(dto.getSerial());
//					orderGoodsDetail.setOrderGoodsDetailId(obj.getGoodIdEntity());
					orderGoodsDetail.setOrderId(orderId);
					orderGoodsDetail.setOrderGoodsId(dto.getGoodsId());
//					long quantityEntity=obj.getQuantityEntity().intValue();
					orderGoodsDetail.setQuantity(1d);

//					orderGoodsDetail.setMerEntityId( Math.round(dto.getMerEntityId()));
					orderGoodsDetail.setMerEntityId(merEntityId);
					orderGoodsDetail.setGoodsState("1");
					orderGoodsDetail.setSerial(dto.getSerial());
					orderGoodsDetail.setPrice(applyPrice);
					Long orderGoodsDetailId = orderGoodsDetailDAO.saveObject(orderGoodsDetail.toModel());

				}
//				else{
//										
//					//them moi vao bang ordergoodsdetail
//					Double applyPrice=assetManagementRequestDAO.getMerApplyPrice(dto.getMerEntityId());
//					OrderGoodsDetailDTO  orderGoodsDetail =new OrderGoodsDetailDTO();
//					orderGoodsDetail.setSerial(dto.getSerial());
//					orderGoodsDetail.setOrderGoodsDetailId(obj.getGoodIdEntity());
//					orderGoodsDetail.setOrderId(orderId);
//					orderGoodsDetail.setOrderGoodsId(dto.getGoodsId());
////					long quantityEntity=obj.getQuantityEntity().intValue();
//					orderGoodsDetail.setQuantity(0l);
//
//					orderGoodsDetail.setMerEntityId( Math.round(dto.getMerEntityId()));
//					orderGoodsDetail.setGoodsState("1");
//					orderGoodsDetail.setSerial(dto.getSerial());
//					orderGoodsDetail.setPrice(applyPrice);
//					Long orderGoodsDetailId = orderGoodsDetailDAO.saveObject(orderGoodsDetail.toModel());
//				}

			}
		}

		// sua file dinh kiem
		List<Long> listId = utilAttachDocumentDAO.getIdByObjectAndType(obj.getAssetManagementRequestId(), 49L);
		List<Long> deleteId = new ArrayList<Long>(listId);
		if (obj.getListFileTHVTTB() != null) {
			for (UtilAttachDocumentDTO file : obj.getListFileTHVTTB()) {
				if (file.getUtilAttachDocumentId() == null) {
					file.setObjectId(obj.getAssetManagementRequestId());
					file.setType("49");
					file.setCreatedDate(new Date());
					file.setCreatedUserId(obj.getUpdatedUserId());
					file.setCreatedUserName(userName);
					file.setDescription("file yeu cau THVT");
					file.setFilePath(UEncrypt.decryptFileUploadPath(file.getFilePath()));
					utilAttachDocumentDAO.saveObject(file.toModel());
				}
			}
			for (Long id : listId) {
				for (UtilAttachDocumentDTO file : obj.getListFileTHVTTB()) {
					if (file.getUtilAttachDocumentId() != null) {
						if (id.longValue() == file.getUtilAttachDocumentId().longValue())
							deleteId.remove(id);
					}
				}
			}
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		} else {
			utilAttachDocumentDAO.deleteListUtils(deleteId);
		}
		return obj.getAssetManagementRequestId();
	}

	public Long getSequence() {
		// TODO Auto-generated method stub
		return assetManagementRequestDAO.getSequence();
	}

	public Long getSequenceOrders() {
		// TODO Auto-generated method stub
		return assetManagementRequestDAO.getSequenceOrders();
	}

	public String exportRetrievalTask(AssetManagementRequestDetailDTO obj) throws Exception {
		// WorkItemDetailDTO obj = new WorkItemDetailDTO();
		obj.setPage(null);
		obj.setPageSize(null);
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		String filePath = classloader.getResource("../" + "doc-template").getPath();
		InputStream file = new BufferedInputStream(new FileInputStream(filePath + "Export_QLYC_thuhoi_VTTB.xlsx"));
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
				udir.getAbsolutePath() + File.separator + "Export_QLYC_thuhoi_VTTB.xlsx");
		List<AssetManagementRequestDetailDTO> data = assetManagementRequestDAO.doSearch(obj, null);
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		XSSFSheet sheet = workbook.getSheetAt(0);
		if (data != null && !data.isEmpty()) {
			XSSFCellStyle style = ExcelUtils.styleText(sheet);
			XSSFCellStyle styleNumber = ExcelUtils.styleText(sheet);
			styleNumber.setAlignment(HorizontalAlignment.RIGHT);
			int i = 2;
			for (AssetManagementRequestDetailDTO dto : data) {
				Row row = sheet.createRow(i++);
				Cell cell = row.createCell(0, CellType.STRING);
				cell.setCellValue("" + (i - 2));
				cell.setCellStyle(styleNumber);
				cell = row.createCell(1, CellType.STRING);
				cell.setCellValue((dto.getCode() != null) ? dto.getCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(2, CellType.STRING);
				cell.setCellValue((dto.getCatStationCode() != null) ? dto.getCatStationCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(3, CellType.STRING);
				cell.setCellValue((dto.getConstructionCode() != null) ? dto.getConstructionCode() : "");
				cell.setCellStyle(style);
				cell = row.createCell(4, CellType.STRING);
				cell.setCellValue((dto.getRequestGroupName() != null) ? dto.getRequestGroupName() : "");
				cell.setCellStyle(style);

				cell = row.createCell(5, CellType.STRING);
				cell.setCellValue((dto.getReceiveGroupName() != null) ? dto.getReceiveGroupName() : "");
				cell.setCellStyle(style);
				cell = row.createCell(6, CellType.STRING);
				cell.setCellValue(getStatusForQLTHVT(dto.getStatus()));
				cell.setCellStyle(style);

				// thiếu quantity

			}
		}
		workbook.write(outFile);
		workbook.close();
		outFile.close();

		String path = UEncrypt
				.encryptFileUploadPath(uploadPathReturn + File.separator + "Export_QLYC_thuhoi_VTTB.xlsx");
		return path;
	}

	private String getStatusForQLTHVT(String status) {
		// TODO Auto-generated method stub
		if (status != null) {
			if ("1".equals(status)) {
				return "Đã tạo yêu cầu nhập kho ";
			} else if ("2".equals(status)) {
				return "Đã tạo phiếu nhập kho";
			} else if ("3".equals(status)) {
				return "Đã nhập kho";
			} else if ("4".equals(status)) {
				return "Đã hủy";
			}

		}
		return "";
	}

	public List<AssetManagementRequestDetailDTO> getLstConstruction(AssetManagementRequestDetailDTO obj) {
		List<AssetManagementRequestDetailDTO> lst = assetManagementRequestDAO.getLstConstruction(obj);
		return lst;
	}

	public Long checkPermissionsAdd(Long sysGroupId, HttpServletRequest request) {
		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE, Constant.AdResourceKey.EQUIPMENT_RETURN,
				request)) {
			throw new IllegalArgumentException("Bạn không có quyền tạo mới yêu cầu thu hồi VTTB");
		}
		try {
			return 0l;
		} catch (Exception e) {
			return 1l;
		}
	}

	public Long checkPermissionsRemove(AssetManagementRequestDetailDTO obj, Long sysGroupId,
			HttpServletRequest request) {

		if (!VpsPermissionChecker.hasPermission(Constant.OperationKey.CREATE, Constant.AdResourceKey.EQUIPMENT_RETURN,
				request)) {
			throw new IllegalArgumentException("Bạn không có quyền xóa yêu cầu thu hồi");
		}
		long provinceId = assetManagementRequestDAO.getProvinceIdByCatStationId(obj.getConstructionId());
		if (!VpsPermissionChecker.checkPermissionOnDomainData(Constant.OperationKey.CREATE,
				Constant.AdResourceKey.EQUIPMENT_RETURN, provinceId, request)) {
			throw new IllegalArgumentException("Bạn không có quyền xóa yêu cầu thu hồi VTTB cho trạm/ tuyến này");
		}
		try {
			return 0l;
		} catch (Exception e) {
			return 1l;
		}
	}
//hungtd_20181225_start
	public void removeVT(manufacturingVT_DTO obj) {
	        // TODO Auto-generated method stub
			assetManagementRequestDAO.removeVT(obj.getGoodsPlanId());
		
	}
	public void openVT(manufacturingVT_DTO obj) {
        // TODO Auto-generated method stub
		assetManagementRequestDAO.openVT(obj.getGoodsPlanId());
	
}
	public void Registry(manufacturingVT_DTO obj) {
        // TODO Auto-generated method stub
		assetManagementRequestDAO.Registry(obj.getRequestgoodsId());
	
}
	public DataListDTO doSearchPopup(manufacturingVT_DTO obj, HttpServletRequest request) {
		List<manufacturingVT_DTO> ls = new ArrayList<manufacturingVT_DTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty())
			ls = assetManagementRequestDAO.doSearchPopup(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
	public DataListDTO doSearchdetail(Long requestgoodsId, HttpServletRequest request) {
		List<manufacturingVT_DTO> ls = new ArrayList<manufacturingVT_DTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty())
			ls = assetManagementRequestDAO.doSearchdetail(requestgoodsId);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
//		data.setTotal(obj.getTotalRecord());
//		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
	public DataListDTO Search(Long requestgoodsId, HttpServletRequest request) {
		List<GoodsDetailEditDTO> ls = new ArrayList<GoodsDetailEditDTO>();
		String groupId = VpsPermissionChecker.getDomainDataItemIds(Constant.OperationKey.VIEW,
				Constant.AdResourceKey.DATA, request);
		List<String> groupIdList = ConvertData.convertStringToList(groupId, ",");
		if (groupIdList != null && !groupIdList.isEmpty())
			ls = assetManagementRequestDAO.Search(requestgoodsId);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
//		data.setTotal(obj.getTotalRecord());
//		data.setSize(obj.getPageSize());
		data.setStart(1);
		return data;
	}
//	hungtd_20181225_end

}
