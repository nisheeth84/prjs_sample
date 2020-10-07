/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.aio.rest;

import com.viettel.aio.business.BiddingPackageBusinessImpl;
import com.viettel.aio.dto.BiddingPackageDTO;
import com.viettel.coms.business.KpiLogBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;


public class BiddingPackageRsServiceImpl implements BiddingPackageRsService {

    @Context
    HttpServletRequest request;
    @Autowired
    private UserRoleBusinessImpl userRoleBusinessImpl;
    //    protected final Logger log = Logger.getLogger(UserRsService.class);
    @Autowired
    BiddingPackageBusinessImpl biddingPackageBusinessImpl;

    @Autowired
    private KpiLogBusinessImpl kpiLogBusinessImpl;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${allow.file.ext}")
    private String allowFileExt;

//	@Override
//	public Response getByUserId(Long userId) {
//		// TODO Auto-generated method stub
//		return null;
//	}

    @Override
    public Response doSearch(BiddingPackageDTO obj) {

        // HuyPq-start
//			KpiLogDTO kpiLogDTO = new KpiLogDTO();
//			kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DOSEARCH_BIDDING_PACKAGE);
//			kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.BIDDING_PACKAGE.toString()));
//			KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
//			kpiLogDTO.setCreateUserId(objUser.getSysUserId());
//			kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
        // huy-end

        DataListDTO data = biddingPackageBusinessImpl.doSearch(obj);
        //huypq-start
//			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
//			kpiLogDTO.setTransactionCode(obj.getKeySearch());
//			kpiLogDTO.setStatus("1");
//			kpiLogBusinessImpl.save(kpiLogDTO);
        return Response.ok(data).build();
        //huy-end
    }

/*		@Override
		public Response remove(BiddingPackageDTO obj) {
			
		// HuyPq-start
		KpiLogDTO kpiLogDTO = new KpiLogDTO();
		kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.DELETE_BIDDING_PACKAGE);
		kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.BIDDING_PACKAGE.toString()));
		KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
		kpiLogDTO.setCreateUserId(objUser.getSysUserId());
		kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
		// huy-end
			
			//lấy thông tin chưa sysgroupid
//			UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");
			obj.setUpdatedUserId(objUser.getSysUserId());
			//sysgroup id
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
			obj.setUpdatedDate(new Date());
			obj.setStatus(0L);
			Long id = 0l;
			try {
				id = biddingPackageBusinessImpl.deleteAppParam(obj);
			} catch(Exception e) {
				kpiLogDTO.setReason(e.toString());
			}
			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
			kpiLogDTO.setTransactionCode(obj.getCode());
			if(id==0l){
				kpiLogDTO.setStatus("0");
				kpiLogBusinessImpl.save(kpiLogDTO);
				return Response.status(Response.Status.BAD_REQUEST).build();
				
			} else {
				kpiLogDTO.setStatus("1");
				kpiLogBusinessImpl.save(kpiLogDTO);
				return Response.ok().build();
			}
		}

		@Override
		public Response add(BiddingPackageDTO obj) throws Exception {
			
			KpiLogDTO kpiLogDTO = new KpiLogDTO();
			kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.INSERT_BIDDING_PACKAGE);
			kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.BIDDING_PACKAGE.toString()));
			KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
			kpiLogDTO.setCreateUserId(objUser.getSysUserId());
			kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
			Long ids = 0l;
			try {   
				obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
				obj.setCreatedUserId(objUser.getSysUserId());
				obj.setStatus(1L);
				obj.setCreatedDate(new Date());
				ids=biddingPackageBusinessImpl.createAppParam(obj);
			}catch(IllegalArgumentException e){
				kpiLogDTO.setReason(e.toString());
				return Response.ok().entity(Collections.singletonMap("error",e.getMessage())).build();
			}
			kpiLogDTO.setTransactionCode(obj.getCode());
			kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
			if (ids == 0l) {
				kpiLogDTO.setStatus("0");
				kpiLogBusinessImpl.save(kpiLogDTO);
				return Response.status(Response.Status.BAD_REQUEST).build();
			} else {
				kpiLogDTO.setStatus("1");
				kpiLogBusinessImpl.save(kpiLogDTO);
				return Response.ok(Response.Status.CREATED).build();
			}
			
		}

		@Override
		public Response update(BiddingPackageDTO obj) throws Exception {
			
			KpiLogDTO kpiLogDTO = new KpiLogDTO();
			kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.UPDATE_BIDDING_PACKAGE);
			kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.BIDDING_PACKAGE.toString()));
			KttsUserSession objUser = userRoleBusinessImpl.getUserSession(request);
			kpiLogDTO.setCreateUserId(objUser.getSysUserId());
			kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));

			obj.setUpdatedUserId(objUser.getSysUserId());
			obj.setUpdatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
			
			try {
				obj.setUpdatedUserId(objUser.getSysUserId());
//				obj.setParType(obj.getParType().toUpperCase());
				obj.setCode(obj.getCode().toUpperCase());
				obj.setUpdatedDate(new Date());
				Long ids = 0l;
				try {
					ids=biddingPackageBusinessImpl.updateAppParam(obj,objUser);
				}catch(Exception e) {
					kpiLogDTO.setReason(e.toString());
				}
				kpiLogDTO.setTransactionCode(obj.getCode());
				kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
				if (ids == 0l) {
					kpiLogDTO.setStatus("0");
					kpiLogBusinessImpl.save(kpiLogDTO);
					return Response.status(Response.Status.BAD_REQUEST).build();
				} else {
					kpiLogDTO.setStatus("1");
					kpiLogBusinessImpl.save(kpiLogDTO);
					return Response.ok(Response.Status.CREATED).build();
				}
			} catch (IllegalArgumentException e) {
				return Response.ok().entity(Collections.singletonMap("error",e.getMessage())).build();
			}
			
		}

		@Override
		public Response getAll() {
			
			DataListDTO data= (DataListDTO) biddingPackageBusinessImpl.getAllObject();
			return Response.ok(data).build();
		}

		@Override
		public Response importBiddingPackage(Attachment attachments,
				HttpServletRequest request) throws Exception {
			KttsUserSession objUser=userRoleBusinessImpl.getUserSession(request);
			String folderParam = UString.getSafeFileName(request.getParameter("folder"));
			String filePathReturn;
			String filePath;
			
			if (UString.isNullOrWhitespace(folderParam)) {
				folderParam = defaultSubFolderUpload;
			} else {
				if (!isFolderAllowFolderSave(folderParam)) {
					throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
				}
			}

			DataHandler dataHandler = attachments.getDataHandler();

			// get filename to be uploaded
			MultivaluedMap<String, String> multivaluedMap = attachments.getHeaders();
			String fileName = UFile.getFileName(multivaluedMap);

			if (!isExtendAllowSave(fileName)) {
				throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
			}
			// write & upload file to server
			try (InputStream inputStream = dataHandler.getInputStream();) {
				filePath = UFile.writeToFileTempServerATTT2(inputStream, fileName, folderParam, folderUpload);
				filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
			} catch (Exception ex) {
				throw new BusinessException("Loi khi save file", ex);
			}

			try {

				try {
					java.util.List<BiddingPackageDTO> result = biddingPackageBusinessImpl.importBiddingPackage(folderUpload + filePath);
					if(result != null && !result.isEmpty() && (result.get(0).getErrorList()==null || result.get(0).getErrorList().size() == 0)){
						
							for (BiddingPackageDTO obj : result) {
								KpiLogDTO kpiLogDTO = new KpiLogDTO();
								kpiLogDTO.setFunctionCode(Constants.FUNCTION_CODE.IMPORT_BIDDING_PACKAGE);
								kpiLogDTO.setDescription(Constants.CONTRACT_TYPE_MAP.get(Constants.CONTRACT_TYPE.BIDDING_PACKAGE.toString()));
								kpiLogDTO.setCreateUserId(objUser.getSysUserId());
								kpiLogDTO.setStartTime(new Timestamp(System.currentTimeMillis()));
								
								if(obj.getCode() != null){
									BiddingPackageDTO existing = (BiddingPackageDTO) biddingPackageBusinessImpl.getByCodeForImport(obj);
									if (existing != null) {
//										return Response.status(Response.Status.CONFLICT).build();
										kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
										kpiLogDTO.setTransactionCode(obj.getCode());
										kpiLogDTO.setReason("Ma goi thau da ton tai");
										kpiLogDTO.setStatus("0");
										kpiLogBusinessImpl.save(kpiLogDTO);
										continue;
									} 
									obj.setCreatedUserId(objUser.getSysUserId());
									obj.setStatus(1L);
									obj.setCreatedDate(new Timestamp(System.currentTimeMillis()));
									obj.setCreatedGroupId(objUser.getVpsUserInfo().getDepartmentId());
									biddingPackageBusinessImpl.createAppParam(obj);
									
									kpiLogDTO.setEndTime(new Timestamp(System.currentTimeMillis()));
									kpiLogDTO.setTransactionCode(obj.getCode());
									kpiLogDTO.setStatus("1");
									kpiLogBusinessImpl.save(kpiLogDTO);
								}
							}
						
						return Response.ok(result).build();
					}else if (result == null || result.isEmpty()) {
						return Response.ok().entity(Response.Status.NO_CONTENT).build(); }
					else{
						return Response.ok(result).build();
					}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
				}

			} catch (IllegalArgumentException e) {
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
			}
		}
		
		

		private boolean isFolderAllowFolderSave(String folderDir) {
			return UString.isFolderAllowFolderSave(folderDir, allowFolderDir);

		}
		
		private boolean isExtendAllowSave(String fileName) {
			return UString.isExtendAllowSave(fileName, allowFileExt);
		}*/

    @Override
    public Response getForAutoComplete(BiddingPackageDTO obj) {
        return Response.ok(biddingPackageBusinessImpl.getForAutoComplete(obj)).build();
    }
//
//		@Override
//		public Response getForComboBox(AppParamDTO obj) {
//			return Response.ok(biddingPackageBusinessImpl.getForComboBox(obj)).build();
//		}
//		@Override
//		public Response getForComboBox1(AppParamDTO obj) {
//			return Response.ok(biddingPackageBusinessImpl.getForComboBox1(obj)).build();
//		}
//		@Override
//		public Response getFileDrop() {
//			//Hieunn
//			//get list filedrop form APP_PARAM with PAR_TYPE = 'SHIPMENT_DOCUMENT_TYPE' and Status=1
//		return Response.ok(biddingPackageBusinessImpl.getFileDrop()).build();
//		}

}
