package com.viettel.coms.business;

import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.bo.UtilAttachDocumentBO;
import com.viettel.coms.dao.*;
import com.viettel.coms.dto.*;
import com.viettel.ktts2.common.UFile;
import com.viettel.utils.ImageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service("EntangleManageBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class EntangleManageBusiness {

    private static final String GOVERNOR_FEEDBACK = "GOVERNOR_FEEDBACK";
    private static final String PROCESS_FEEDBACK = "PROCESS FEEDBACK";
    @Autowired
    private ObstructedDAO obstructedDAO;
    @Autowired
    private EntangleManageDAO entangleManageDAO;
    @Value("${folder_upload2}")
    private String folder2Upload;
    @Value("${input_image_sub_folder_upload}")
    private String input_image_sub_folder_upload;
    @Autowired
    ConstructionTaskDAO construcitonTaskDao;
    @Autowired
    private UtilAttachDocumentDAO utilAttrachDocumentDao;
    @Autowired
    private ConstructionScheduleDAO constructionScheduleDAO;

    /**
     * convertImageToBase64
     *
     * @param List<ConstructionImageInfo> listImage
     * @return List<ConstructionImageInfo>
     */
    private List<ConstructionImageInfo> ToBase64(List<ConstructionImageInfo> listImage) {
        List<ConstructionImageInfo> result = new ArrayList<>();

        for (ConstructionImageInfo constructionImage : listImage) {
            try {
                String fullPath = folder2Upload + File.separator + constructionImage.getImagePath();
                String base64Image = ImageUtil.convertImageToBase64(fullPath);
                ConstructionImageInfo obj = new ConstructionImageInfo();
                obj.setImageName(constructionImage.getImageName());
                obj.setBase64String(base64Image);
                obj.setImagePath(fullPath);
                obj.setStatus('1');
                obj.setUtilAttachDocumentId(constructionImage.getUtilAttachDocumentId());
                result.add(obj);
            } catch (Exception e) {
                System.out.println(e.toString());
                continue;
            }
        }

        return result;
    }

    /**
     * upDateConstruction
     *
     * @param constructionId
     * @param state
     */
    private void upDateConstruction(Long constructionId, String state) {
        entangleManageDAO.updateCon(constructionId, state);
    }

    /**
     * saveImagePaths
     *
     * @param lstConstructionImages
     * @param constructionTaskId
     * @param request
     */
    public void saveImagePathsDao(List<ConstructionImageInfo> lstConstructionImages, long constructionTaskId,
                                  SysUserRequest request) {

        if (lstConstructionImages == null) {
            return;
        }

        for (ConstructionImageInfo constructionImage : lstConstructionImages) {

            UtilAttachDocumentBO utilAttachDocumentBO = new UtilAttachDocumentBO();
            utilAttachDocumentBO.setObjectId(constructionImage.getObstructedId());
            utilAttachDocumentBO.setName(constructionImage.getImageName());
            utilAttachDocumentBO.setType("43");
            utilAttachDocumentBO.setDescription("file ảnh vướng");
            utilAttachDocumentBO.setStatus("1");
            utilAttachDocumentBO.setFilePath(constructionImage.getImagePath());
            utilAttachDocumentBO.setCreatedDate(new Date());
            utilAttachDocumentBO.setCreatedUserId(request.getSysUserId());
            utilAttachDocumentBO.setCreatedUserName(request.getName());

            long ret = utilAttrachDocumentDao.saveObject(utilAttachDocumentBO);

            System.out.println("ret " + ret);
        }
    }

    /**
     * getEntangleManage
     *
     * @param EntangleManageDTORequest request
     * @return List<EntangleManageDTO>
     */
    public List<EntangleManageDTO> getEntangleManage(EntangleManageDTORequest request,
                                                     EntangleManageDTOResponse response) {
        SysUserRequest user = new SysUserRequest();
//		hoanm1_20180803_start
//		user.setSysGroupId(construcitonTaskDao.getSysGroupId(request.getSysUserRequest().getAuthenticationInfo().getUsername()));
//		user.setDepartmentId(Long.parseLong(construcitonTaskDao.getSysGroupId(request.getSysUserRequest().getAuthenticationInfo().getUsername())));
        user.setSysGroupId(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserRequest().getSysUserId()));
        user.setDepartmentId(
                Long.parseLong(construcitonTaskDao.getSysGroupIdUserId(request.getSysUserRequest().getSysUserId())));
//		hoanm1_20180803_end
        List<DomainDTO> listGorvenor = entangleManageDAO
                .getAdResourceByGovernor(request.getSysUserRequest().getSysUserId());
        if (listGorvenor.size() > 0) {
            SysUserRequest sysUser = new SysUserRequest();
            sysUser.setAuthorities(GOVERNOR_FEEDBACK);
            response.setSysUser(sysUser);
        }

        List<DomainDTO> listFeedBack = entangleManageDAO.getByAdResource(request.getSysUserRequest().getSysUserId(),
                PROCESS_FEEDBACK);
        if (listFeedBack.size() > 0) {
            SysUserRequest sysUser = new SysUserRequest();
            sysUser.setAuthorities(GOVERNOR_FEEDBACK);
            response.setSysUser(sysUser);
        }

        return entangleManageDAO.getEntangleManage(request, user.getSysGroupId(), listGorvenor, listFeedBack);
    }

    /**
     * UpdateEntangleManage 0 local, 1 sever, -1 delete in image
     *
     * @param request
     * @return
     * @throws Exception
     */
    public int UpdateEntangleManage(EntangleManageDTORequest request) throws Exception {
        if (request.getEntangleManageDTODetail().getListImage() != null) {
            List<ConstructionImageInfo> lstConstructionImages = saveConstructionImages(
                    request.getEntangleManageDTODetail().getListImage(),
                    request.getEntangleManageDTODetail().getObstructedId());
            saveImagePathsDao(lstConstructionImages, request.getEntangleManageDTODetail().getConstructionId(),
                    request.getSysUserRequest());
        }
        entangleManageDAO.updateEntagle(request.getEntangleManageDTODetail(), request.getSysUserRequest());
        upDateConstruction(request.getEntangleManageDTODetail().getConstructionId(),
                request.getEntangleManageDTODetail().getObstructedState());
//		hoanm1_20180820_start
        entangleManageDAO.updateVuongTask(request.getEntangleManageDTODetail());
//		hoanm1_20180820_end
//      hoanm1_20190122_start
        if(request.getEntangleManageDTODetail().getWorkItemId() == null){
        	List<DomainDTO> lstReceiveHandover = entangleManageDAO.getReceiveHandover(request.getEntangleManageDTODetail().getConstructionId());
        	if(lstReceiveHandover.size() >0){
        		entangleManageDAO.updateHandoverStation(request.getEntangleManageDTODetail().getConstructionId(),
      			lstReceiveHandover.get(0).getCatStationHouseId(),lstReceiveHandover.get(0).getCntContractId(),lstReceiveHandover.get(0).getReceivedGoodsDate());
        	}
        }
//      hoanm1_20190122_end
        return 1;
    }

    /**
     * update Images
     *
     * @param List<ConstructionImageInfo> lstConstructionImages
     * @param long                        id
     * @return List<ConstructionImageInfo>
     */
    public List<ConstructionImageInfo> saveConstructionImages(List<ConstructionImageInfo> lstConstructionImages,
                                                              long id) {
        List<ConstructionImageInfo> result = new ArrayList<>();
        for (ConstructionImageInfo constructionImage : lstConstructionImages) {
            if (constructionImage.getStatus() == 0) {
                ConstructionImageInfo obj = new ConstructionImageInfo();
                obj.setImageName(constructionImage.getImageName());
                obj.setLatitude(constructionImage.getLatitude());
                obj.setLongtitude(constructionImage.getLongtitude());
                obj.setObstructedId(id);
                InputStream inputStream = ImageUtil.convertBase64ToInputStream(constructionImage.getBase64String());
                try {
                    String imagePath = UFile.writeToFileServerATTT2(inputStream, constructionImage.getImageName(),
                            input_image_sub_folder_upload, folder2Upload);

                    obj.setImagePath(imagePath);
                } catch (Exception e) {
                    continue;
                }
                result.add(obj);
            } else {
                if (constructionImage.getStatus() == -1 && !"".equals(constructionImage.getImagePath())) {
                    Boolean checkId = entangleManageDAO.getCheckId(constructionImage.getUtilAttachDocumentId());
                    if (checkId) {
                        entangleManageDAO.updateUtilAttachDocumentById(constructionImage.getUtilAttachDocumentId());
                    }
                }
            }
        }

        return result;
    }

    /**
     * addEntangle
     *
     * @param EntangleManageDTORequest request
     * @return int
     */
    public int addEntangle(EntangleManageDTORequest request) {
        EntangleManageDTO enta = new EntangleManageDTO();
        long sysG = Integer.parseInt(request.getSysUserRequest().getSysGroupId());
        enta.setObstructedState(request.getEntangleManageDTODetail().getObstructedState());
        enta.setObstructedContent(request.getEntangleManageDTODetail().getObstructedContent());
        enta.setConstructionId(request.getEntangleManageDTODetail().getConstructionId());
        enta.setCreatedDate(new Date());
        enta.setCreatedUserId(request.getSysUserRequest().getSysUserId());
        enta.setCreatedGroupId(sysG);
        if ("1".equals(request.getEntangleManageDTODetail().getObstructedState())) {
            enta.setClosedDate(new Date());
        }
        long id = obstructedDAO.saveObject(enta.toModel());
        /* obstructedDAO.getSession().flush(); */
        upDateConstruction(request.getEntangleManageDTODetail().getConstructionId(),
                request.getEntangleManageDTODetail().getObstructedState());
        if (request.getEntangleManageDTODetail().getListImage() != null) {
            List<ConstructionImageInfo> lstConstructionImages = saveConstructionImages(
                    request.getEntangleManageDTODetail().getListImage(), id);
            saveImagePathsDao(lstConstructionImages, request.getEntangleManageDTODetail().getConstructionId(),
                    request.getSysUserRequest());
        }
        return 1;
    }

    /**
     * getNameAndAddressContruction
     *
     * @param SysUserRequest request
     * @return List<ConstructionStationWorkItemDTO>
     */
    public List<ConstructionStationWorkItemDTO> getNameAndAddressContruction(SysUserRequest request) {

        /*
         * List<DomainDTO> listGorvenor =
         * entangleManageDAO.getAdResourceByGovernor(request.getSysUserId());
         * List<DomainDTO> listFeedBack =
         * entangleManageDAO.getByAdResource(request.getSysUserId(), PROCESS_FEEDBACK);
         *
         * List<ConstructionStationWorkItemDTO> lst =
         * entangleManageDAO.getListConstructionByIdSysGroupId(request, listGorvenor,
         * listFeedBack);
         */
        List<ConstructionStationWorkItemDTO> lst = entangleManageDAO.getListConstructionByIdSysGroupId(request);
        return lst;
    }

    /**
     * getListImageEntagle
     *
     * @param Long constructionId
     * @return List<ConstructionImageInfo>
     */
    public List<ConstructionImageInfo> getListImageEntagle(Long constructionId) {
        List<ConstructionImageInfo> listImage = entangleManageDAO.getListImageByConstructionId(constructionId);
        return ToBase64(listImage);
    }
}
