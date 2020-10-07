package com.viettel.coms.business;

import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.bo.ConstructionMerchandiseBO;
import com.viettel.coms.bo.UtilAttachDocumentBO;
import com.viettel.coms.dao.*;
import com.viettel.coms.dto.*;
import com.viettel.ktts2.common.UFile;
import com.viettel.service.base.business.BaseFWBusinessImpl;
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

@Service("constructionMerchandiseBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ConstructionMerchandiseBusinessImpl
        extends BaseFWBusinessImpl<ConstructionMerchandiseDAO, ConstructionMerchandiseDTO, ConstructionMerchandiseBO>
        implements ConstructionMerchandiseBusiness {

    @Autowired
    private ConstructionMerchandiseDAO constructionMerchandiseDAO;

    @Autowired
    private ConstructionAcceptanceCertDAO constructionAcceptanceCertDAO;

    @Autowired
    private UtilAttachDocumentDAO utilAttachDocumentDAO;
    @Autowired
    private EntangleManageDAO entangleManageDAO;
    @Autowired
    private ConstructionReturnDAO constructionReturnDAO;

    public ConstructionMerchandiseBusinessImpl() {
        tModel = new ConstructionMerchandiseBO();
        tDAO = constructionMerchandiseDAO;
    }

    @Override
    public ConstructionMerchandiseDAO gettDAO() {
        return constructionMerchandiseDAO;
    }

    @Value("${folder_upload2}")
    private String folder2Upload;

    @Value("${input_image_sub_folder_upload}")
    private String input_image_sub_folder_upload;

    @Override
    public long count() {
        return constructionMerchandiseDAO.count("ConstructionMerchandiseBO", null);
    }

    public List<ConstructionMerchandiseDetailDTO> getValueToInitConstructionMerchandisePages(
            ConstructionMerchandiseDTORequest request) {
        List<ConstructionMerchandiseDetailDTO> listData = constructionMerchandiseDAO
                .getValueToInitConstructionMerchandisePages(request);

        return listData;

    }

    public List<ConstructionMerchandiseDetailDTO> getValueToInitConstructionMerchandiseWorkItemsPages(
            ConstructionMerchandiseDTORequest request) {
        List<ConstructionMerchandiseDetailDTO> listData = constructionMerchandiseDAO
                .getValueToInitConstructionMerchandiseWorkItemsPages(request);

        for (ConstructionMerchandiseDetailDTO listDetail : listData) {
            if (listDetail.getCountWorkItemComplete() == 0) {
                // 0 chua hoan tra
                listDetail.setStatusComplete("0");
            } else
                // 1 da hoan tra
                listDetail.setStatusComplete("1");
        }
        return listData;

    }

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
                continue;
            }
        }

        return result;
    }

    public List<ConstructionMerchandiseDetailVTDTO> getValueToInitConstructionMerchandiseVT(
            ConstructionMerchandiseDTORequest request, long vt) {
        List<ConstructionMerchandiseDetailVTDTO> listVT = new ArrayList<ConstructionMerchandiseDetailVTDTO>();
        listVT = constructionMerchandiseDAO.getValueToInitConstructionMerchandiseVT(request, vt);
        for (ConstructionMerchandiseDetailVTDTO listVTDetail : listVT) {
            listVTDetail.setQuantity(listVTDetail.getNumberXuat() - listVTDetail.getNumberThuhoi()
                    - listVTDetail.getNumberNghiemthu() - listVTDetail.getNumberHoanTraKhac());
        }
        return listVT;
//    	return constructionMerchandiseDAO.getValueToInitConstructionMerchandiseVT(request,vt);

    }

    public List<ConstructionMerchandiseDetailVTDTO> getValueToInitConstructionMerchandiseTB(
            ConstructionMerchandiseDTORequest request, long tb) {

        List<ConstructionMerchandiseDetailVTDTO> listTB = constructionMerchandiseDAO
                .getValueToInitConstructionMerchandiseVT(request, tb);
        for (ConstructionMerchandiseDetailVTDTO a : listTB) {
            List<ConstructionMerchandiseItemTBDTO> TB = constructionMerchandiseDAO
                    .getValueToInitConstructionMerchandiseVTDetail(request, tb, a.getGoodsId());
            List<ConstructionMerchandiseItemTBDTO> fa1 = new ArrayList<ConstructionMerchandiseItemTBDTO>();

            for (ConstructionMerchandiseItemTBDTO TBADetail : TB) {

                if (TBADetail.getNumberXTB() == null) {
                    TBADetail.setNumberXTB(0d);
                }
                if (TBADetail.getNumberTHTB() == null) {
                    TBADetail.setNumberTHTB(0d);
                }
                if (TBADetail.getNumberNTKTB() == null) {
                    TBADetail.setNumberNTKTB(0d);
                }

                if (TBADetail.getNumberXTB() != null && TBADetail.getNumberTHTB() != null
                        && TBADetail.getNumberNTTB() != null && TBADetail.getNumberHTKTB() != null) {
                    if (TBADetail.getNumberXTB().intValue() - TBADetail.getNumberTHTB().intValue()
                            - TBADetail.getNumberNTTB().intValue() - TBADetail.getNumberHTKTB() != 0) {
//						fa1.add(a);
                        fa1.add(TBADetail);

                    }
                }
            }
            a.setListTBDetail(fa1);
            long result = fa1.size();
            a.setTotalItemDetail(result);

        }
        return listTB;

    }

    public List<ConstructionImageInfo> getListImageReturn(Long workItemId) {
        // TODO Auto-generated method stub
        List<ConstructionImageInfo> listImage = constructionMerchandiseDAO.getListImageByConstructionId(workItemId);
        return ToBase64(listImage);
    }

    public int updateConstructionReturn(ConstructionMerchandiseDTORequest request) {
        // TODO Auto-generated method stub

        // VTA
        if (request.getListDSVT() != null) {

            for (ConstructionMerchandiseDetailVTDTO dto : request.getListDSVT()) {

                List<ConstructionMerchandiseDetailVTDTO> fa = constructionMerchandiseDAO.getListVatTuDetail(
                        request.getConstructionMerchandiseDetailDTO().getConstructionId(),
                        request.getConstructionMerchandiseDetailDTO().getWorkItemId(), dto.getGoodsId(),
                        request.getSysUserRequest().getSysUserId());
                int slcl = 0;
                int slsd = dto.getNumberHoanTra().intValue();

                for (ConstructionMerchandiseDetailVTDTO a : fa) {
                    if (a.getNumberThuhoi() == null) {

                        slcl = a.getNumberXuat().intValue();
                    }
                    if (a.getNumberThuhoi() != null) {
                        slcl = a.getNumberXuat().intValue() - a.getNumberThuhoi().intValue();
                    }
                    if (slcl < slsd) {
//						constructionMerchandiseDAO.removeDSVTBB(a.getMerEntityId(),dto.getGoodsId());
                        ConstructionReturnDTO mer = new ConstructionReturnDTO();
                        mer.setGoodsCode(dto.getGoodsCode());
                        // mer.setRemainCount((double)0);
                        mer.setQuantity((double) slcl);
                        // mer.setType("1");
                        mer.setGoodsName(dto.getGoodsName());
                        mer.setMerEntityId(a.getMerEntityId());
                        mer.setConstructionId(request.getConstructionMerchandiseDetailDTO().getConstructionId());
                        mer.setWorkItemId(request.getConstructionMerchandiseDetailDTO().getWorkItemId());
                        mer.setGoodsUnitName(dto.getGoodsUnitName());
                        mer.setGoodsId(dto.getGoodsId());
                        // mer.setGoodsIsSerial("0");

                        constructionReturnDAO.saveObject(mer.toModel());
                        slsd = slsd - slcl;
                    } else if (slcl >= slsd) {
//						constructionMerchandiseDAO.removeDSVTBB(a.getMerEntityId(),dto.getGoodsId());
                        ConstructionReturnDTO mer = new ConstructionReturnDTO();
                        mer.setGoodsCode(dto.getGoodsCode());
                        // mer.setRemainCount((double) slcl-slsd);
                        mer.setQuantity((double) slsd);
                        // mer.setType("1");
                        mer.setGoodsName(dto.getGoodsName());
                        mer.setMerEntityId(a.getMerEntityId());
                        mer.setConstructionId(request.getConstructionMerchandiseDetailDTO().getConstructionId());
                        mer.setWorkItemId(request.getConstructionMerchandiseDetailDTO().getWorkItemId());

                        mer.setGoodsUnitName(dto.getGoodsUnitName());
                        mer.setGoodsId(dto.getGoodsId());
                        // mer.setGoodsIsSerial("0");
                        constructionReturnDAO.saveObject(mer.toModel());
                        slsd = 0;
                    }
                }

            }
        }

        // TBA
        // lưu thông tin thiết bị bên A
        // constructionMerchandiseDAO.DeleteTBA(obj.getConstructionId());
        if (request.getListDSTB() != null) {
            for (ConstructionMerchandiseDetailVTDTO dto : request.getListDSTB()) {

                if (dto.getListTBDetail() != null) {
                    for (ConstructionMerchandiseItemTBDTO ListTBDeital : dto.getListTBDetail()) {
                        if (ListTBDeital.getEmployTB() == null) {
                            ListTBDeital.setEmployTB(0l);
                        }
                        if (ListTBDeital.getEmployTB() == 1) {
                            String type = "1";
                            Double quantity = 1D;
                            Double remainCount = 0D;
                            ConstructionReturnDTO tb = new ConstructionReturnDTO();
                            tb.setGoodsCode(dto.getGoodsCode());
//							tb.setRemainCount(remainCount);
//							tb.setType(type);
                            tb.setQuantity(quantity);
                            tb.setGoodsName(dto.getGoodsName());
                            tb.setMerEntityId(ListTBDeital.getMerEntityId());
                            tb.setConstructionId(request.getConstructionMerchandiseDetailDTO().getConstructionId());
                            tb.setWorkItemId(request.getConstructionMerchandiseDetailDTO().getWorkItemId());
                            // tb.setConstructionMerchandiseId(dto.getConstructionMerchadiseId());
                            tb.setGoodsUnitName(dto.getGoodsUnitName());
                            tb.setGoodsId(dto.getGoodsId());
//							tb.setGoodsIsSerial(ListTBDeital.getGoodsIsSerialTB());
                            tb.setSerial(ListTBDeital.getSerial());

                            constructionReturnDAO.saveObject(tb.toModel());
                        }
                        // else{
                        // String type ="1";
                        // Double quantity = 0D;
                        // Double remainCount = 1D;
                        // ConstructionMerchandiseDTO tb = new ConstructionMerchandiseDTO();
                        // tb.setGoodsCode(dto.getGoodsCode());
                        // tb.setRemainCount(remainCount);
                        // tb.setType(type);
                        // tb.setQuantity(quantity);
                        // tb.setGoodsName(dto.getGoodsName());
                        // tb.setMerEntityId(dto.getMerEntityId());
                        // tb.setConstructionId(dto.getConstructionId());
                        //// tb.setConstructionMerchandiseId(dto.getConstructionMerchadiseId());
                        // tb.setGoodsUnitName(dto.getGoodsUnitName());
                        // tb.setGoodsId(dto.getGoodsId());
                        // tb.setGoodsIsSerial(dto.getGoodsIsSerial());
                        // tb.setSerial(dto.getSerial());
                        // constructionMerchandiseDAO.saveObject(tb.toModel());
                        // }
                    }

                }
            }
        }

        if (request.getListImage() != null) {
            List<ConstructionImageInfo> lstConstructionImages = saveConstructionImages(request.getListImage(),
                    request.getConstructionMerchandiseDetailDTO().getWorkItemId());
//			constructionAcceptanceCertDAO.saveImagePathsDao(lstConstructionImages ,request.getConstructionAcceptanceCertDetailDTO().getWorkItemId(), request.getSysUserRequest());
            String userName = constructionAcceptanceCertDAO.getUserName(request.getSysUserRequest().getSysUserId());

            for (ConstructionImageInfo constructionImage : lstConstructionImages) {

                UtilAttachDocumentBO utilAttachDocumentBO = new UtilAttachDocumentBO();
                UtilAttachDocumentDTO util = new UtilAttachDocumentDTO();

                util.setObjectId(request.getConstructionMerchandiseDetailDTO().getWorkItemId());
                util.setName(constructionImage.getImageName());
                util.setType("46");
                util.setDescription("file ảnh hoàn trả");
                util.setStatus("1");
                util.setFilePath(constructionImage.getImagePath());
                util.setCreatedDate(new Date());
                util.setLatitude(constructionImage.getLatitude());
                util.setLongtitude(constructionImage.getLongtitude());
                util.setCreatedUserId(request.getSysUserRequest().getSysUserId());

                util.setCreatedUserName(userName);

                utilAttachDocumentDAO.saveObject(util.toModel());

            }
        }
        return 1;
    }

    /**
     * update Images * 0 local, 1 sever, -1 delete in image
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

    public int deleteVTTBConstructionReturn(ConstructionMerchandiseDTORequest request) {
        // TODO Auto-generated method stub
        constructionMerchandiseDAO.deleteHTVTTB(request.getConstructionMerchandiseDetailDTO().getConstructionId(),
                request.getConstructionMerchandiseDetailDTO().getWorkItemId());
        constructionMerchandiseDAO.deleteImageReturn(request.getConstructionMerchandiseDetailDTO().getWorkItemId());
        return 1;
    }

    public long getValueToInitConstructionNoReturn(ConstructionMerchandiseDTORequest request) {
        // TODO Auto-generated method stub
        List<ConstructionMerchandiseDetailDTO> listData = constructionMerchandiseDAO.getListWorkItems(request);
        int numberConstructionNoReturn = 0;

        for (ConstructionMerchandiseDetailDTO listDataDeatil : listData) {
            if (listDataDeatil.getCountWorkItemComplete() == 0) {
                numberConstructionNoReturn++;
            }
        }
        return numberConstructionNoReturn;
    }

    public long getValueToInitConstructionReturn(ConstructionMerchandiseDTORequest request) {
        // TODO Auto-generated method stub
        List<ConstructionMerchandiseDetailDTO> listData = constructionMerchandiseDAO.getListWorkItems(request);
        int numberConstructionReturn = 0;

        for (ConstructionMerchandiseDetailDTO listDataDeatil : listData) {
            if (listDataDeatil.getCountWorkItemComplete() > 0) {
                numberConstructionReturn++;
            }
        }
        return numberConstructionReturn;
    }

}
