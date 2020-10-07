package com.viettel.coms.business;

import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.bo.ConstructionAcceptanceCertBO;
import com.viettel.coms.bo.UtilAttachDocumentBO;
import com.viettel.coms.dao.ConstructionAcceptanceCertDAO;
import com.viettel.coms.dao.ConstructionMerchandiseDAO;
import com.viettel.coms.dao.EntangleManageDAO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
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

@Service("constructionAcceptanceCertBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ConstructionAcceptanceCertBusinessImpl extends
        BaseFWBusinessImpl<ConstructionAcceptanceCertDAO, ConstructionAcceptanceCertDTO, ConstructionAcceptanceCertBO>
        implements ConstructionAcceptanceCertBusiness {

    @Autowired
    private ConstructionAcceptanceCertDAO constructionAcceptanceCertDAO;

    @Autowired
    private ConstructionMerchandiseDAO constructionMerchandiseDAO;

    @Autowired
    private UtilAttachDocumentDAO utilAttachDocumentDAO;
    @Autowired
    private EntangleManageDAO entangleManageDAO;

    public ConstructionAcceptanceCertBusinessImpl() {
        tModel = new ConstructionAcceptanceCertBO();
        tDAO = constructionAcceptanceCertDAO;
    }

    @Override
    public ConstructionAcceptanceCertDAO gettDAO() {
        return constructionAcceptanceCertDAO;
    }

    @Value("${folder_upload2}")
    private String folder2Upload;

    @Value("${input_image_sub_folder_upload}")
    private String input_image_sub_folder_upload;

    @Override
    public long count() {
        return constructionAcceptanceCertDAO.count("ConstructionAcceptanceCertBO", null);
    }

    //man hinh cong trinh nghiem thu
    public List<ConstructionAcceptanceCertDetailDTO> getValueToInitConstructionAcceptancePages(
            ConstructionAcceptanceDTORequest request) {
        // TODO Auto-generated method stub

        List<ConstructionAcceptanceCertDetailDTO> listdata = constructionAcceptanceCertDAO
                .getValueToInitConstructionAcceptancePages(request);
//		return constructionAcceptanceCertDAO.getValueToInitConstructionAcceptancePages(request);

        return listdata;

    }

    //man hinh hang muc nghiem thu
    public List<ConstructionAcceptanceCertDetailDTO> getValueToInitConstructionAcceptanceWorkItemsPages(
            ConstructionAcceptanceDTORequest request) {
        // TODO Auto-generated method stub

        List<ConstructionAcceptanceCertDetailDTO> listdata = constructionAcceptanceCertDAO
                .getValueToInitConstructionAcceptanceWorkItemsPages(request);
//		return constructionAcceptanceCertDAO.getValueToInitConstructionAcceptancePages(request);

        for (ConstructionAcceptanceCertDetailDTO listdataDetail : listdata) {
            boolean flag = constructionAcceptanceCertDAO.checkStatusAcceptance(listdataDetail.getWorkItemId(),
                    listdataDetail.getConstructionId());
            if (flag == true) {
                listdataDetail.setFlag(1l);
                listdataDetail.setStatusAcceptance("1");

            } else {
                listdataDetail.setFlag(0l);
                listdataDetail.setStatusAcceptance("0");
            }
//    		List<ConstructionImageInfo> listImage = constructionAcceptanceCertDAO.getListImageByConstructionId(listdataDetail.getWorkItemId());
//    		listdataDetail.setListImage(ToBase64(listImage));
        }

        return listdata;

    }

    /**
     * convertImageToBase64
     *
     * @param listImage
     * @return
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
                continue;
            }
        }

        return result;
    }

    // man hinh 2 nghiem thu VTA
    // VT ben A xem chi tiet
    public List<ConstructionAcceptanceCertDetailVTADTO> getValueToInitConstructionAcceptanceDetailVTAPages(
            ConstructionAcceptanceDTORequest request, Long temp) {
        // TODO Auto-generated method stub
        List<ConstructionAcceptanceCertDetailVTADTO> getlistVTA = constructionAcceptanceCertDAO
                .getValueToInitConstructionAcceptanceVTAPages(request, temp);
        for (ConstructionAcceptanceCertDetailVTADTO dto : getlistVTA) {

            dto.setQuantity(dto.getNumberXuat() - dto.getNumberThuhoi() - dto.getNumberNghiemThuKhac());

        }
        return getlistVTA;
    }

    // VTA them
    public List<ConstructionAcceptanceCertDetailVTADTO> getValueToInitConstructionAcceptanceDetailVTATPages(
            ConstructionAcceptanceDTORequest request, Long temp) throws Exception {
        // TODO Auto-generated method stub

        List<ConstructionAcceptanceCertDetailVTADTO> getlistVTAT = constructionAcceptanceCertDAO
                .getValueToInitConstructionAcceptanceVTAPages(request, temp);
        for (ConstructionAcceptanceCertDetailVTADTO dto : getlistVTAT) {

            dto.setQuantity(dto.getNumberXuat() - dto.getNumberThuhoi() - dto.getNumberNghiemthu()
                    - dto.getNumberNghiemThuKhac());
        }

        return getlistVTAT;

    }

    // TB ben A xem chi tiet
    public List<ConstructionAcceptanceCertDetailVTADTO> getValueToInitConstructionAcceptanceDetailTBAPages(
            ConstructionAcceptanceDTORequest request, Long temp) {
        // TODO Auto-generated method stub

        List<ConstructionAcceptanceCertDetailVTADTO> fa = constructionAcceptanceCertDAO
                .getValueToInitConstructionAcceptanceVTAPages(request, temp);
        for (ConstructionAcceptanceCertDetailVTADTO a : fa) {
            List<ConstructionAcceptanceCertItemTBDTO> TBB = constructionAcceptanceCertDAO
                    .getValueToInitConstructionAcceptanceVTADetailPages(request, temp, a.getGoodsId());
            List<ConstructionAcceptanceCertItemTBDTO> fa1 = new ArrayList<ConstructionAcceptanceCertItemTBDTO>();

            for (ConstructionAcceptanceCertItemTBDTO TBADetail : TBB) {

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
                        && TBADetail.getNumberNTKTB() != null) {
                    if (TBADetail.getNumberXTB().intValue() - TBADetail.getNumberTHTB().intValue()
                            - TBADetail.getNumberNTKTB().intValue() != 0) {
//						fa1.add(a);
                        fa1.add(TBADetail);

                    }
                }
            }
            a.setListTBADetail(fa1);
            long result = fa1.size();
            a.setTotalItemDetail(result);

        }

        return fa;
    }

    // TB ben A them
    public List<ConstructionAcceptanceCertDetailVTADTO> getValueToInitConstructionAcceptanceDetailTBATPages(
            ConstructionAcceptanceDTORequest request, Long temp) {
        // TODO Auto-generated method stub
//    	List<ConstructionAcceptanceCertDetailVTADTO> fa1 =  new ArrayList<ConstructionAcceptanceCertDetailVTADTO>();

        List<ConstructionAcceptanceCertDetailVTADTO> fa = constructionAcceptanceCertDAO
                .getValueToInitConstructionAcceptanceVTAPages(request, temp);
        for (ConstructionAcceptanceCertDetailVTADTO a : fa) {
            List<ConstructionAcceptanceCertItemTBDTO> TBB = constructionAcceptanceCertDAO
                    .getValueToInitConstructionAcceptanceVTADetailPages(request, temp, a.getGoodsId());
            List<ConstructionAcceptanceCertItemTBDTO> fa1 = new ArrayList<ConstructionAcceptanceCertItemTBDTO>();

            for (ConstructionAcceptanceCertItemTBDTO TBADetail : TBB) {

                if (TBADetail.getNumberXTB() == null) {
                    TBADetail.setNumberXTB(0d);
                }
                if (TBADetail.getNumberTHTB() == null) {
                    TBADetail.setNumberTHTB(0d);
                }
                if (TBADetail.getNumberNTKTB() == null) {
                    TBADetail.setNumberNTKTB(0d);
                }

                // for (ConstructionAcceptanceCertDetailVTADTO tbaDetail : VTADetail) {
                // result+=i;
                // i++;
                // }

                if (TBADetail.getNumberXTB() != null && TBADetail.getNumberTHTB() != null
                        && TBADetail.getNumberNTKTB() != null) {
                    if (TBADetail.getNumberXTB().intValue() - TBADetail.getNumberTHTB().intValue()
                            - TBADetail.getNumberNTKTB().intValue() != 0) {
                        fa1.add(TBADetail);

                    }
                }
            }
            a.setListTBADetail(fa1);
            long result = fa1.size();
            a.setTotalItemDetail(result);

        }
        return fa;
    }

    // VT B
    public List<ConstructionAcceptanceCertDetailVTBDTO> getValueToInitConstructionAcceptanceDetailVTBPages(
            ConstructionAcceptanceDTORequest request, Long temp) {
        // TODO Auto-generated method stub
        List<ConstructionAcceptanceCertDetailVTBDTO> getlistVTB = constructionAcceptanceCertDAO
                .getValueToInitConstructionAcceptanceVTBPages(request, temp);

        for (ConstructionAcceptanceCertDetailVTBDTO a : getlistVTB) {

            if (a.getNumberXuat() == null) {
                a.setNumberXuat(0d);
            }
            if (a.getNumberThuhoi() == null) {
                a.setNumberThuhoi(0d);
            }
            if (a.getNumberSuDung() == null) {
                a.setNumberSuDung(0d);
            }

            a.setQuantity(a.getNumberXuat() - a.getNumberThuhoi());

        }
        return getlistVTB;

        // return
        // constructionAcceptanceCertDAO.getValueToInitConstructionAcceptanceVTBPages(request,temp);

    }

    public List<ConstructionAcceptanceCertDetailVTBDTO> getValueToInitConstructionAcceptanceDetailVTBTPages(
            ConstructionAcceptanceDTORequest request, Long temp) {
        // TODO Auto-generated method stub
        List<ConstructionAcceptanceCertDetailVTBDTO> getlistVTB = constructionAcceptanceCertDAO
                .getValueToInitConstructionAcceptanceVTBPages(request, temp);

        for (ConstructionAcceptanceCertDetailVTBDTO a : getlistVTB) {
            if (a.getNumberXuat() == null) {
                a.setNumberXuat(0d);
            }
            if (a.getNumberThuhoi() == null) {
                a.setNumberThuhoi(0d);
            }
            if (a.getNumberSuDung() == null) {
                a.setNumberSuDung(0d);
            }

            a.setQuantity(a.getNumberXuat() - a.getNumberThuhoi());
            a.setNumberSuDung(a.getNumberXuat() - a.getNumberThuhoi());

        }
        return getlistVTB;

        // return
        // constructionAcceptanceCertDAO.getValueToInitConstructionAcceptanceVTBPages(request,temp);

    }

    // TB B xem chi tiet
    public List<ConstructionAcceptanceCertDetailVTBDTO> getValueToInitConstructionAcceptanceDetailTBBPages(
            ConstructionAcceptanceDTORequest request, Long temp) {
        // TODO Auto-generated method stub
        List<ConstructionAcceptanceCertDetailVTBDTO> fa = constructionAcceptanceCertDAO
                .getValueToInitConstructionAcceptanceVTBPages(request, temp);
        for (ConstructionAcceptanceCertDetailVTBDTO a : fa) {

            List<ConstructionAcceptanceCertItemTBDTO> getlistTBB = constructionAcceptanceCertDAO
                    .getValueToInitConstructionAcceptanceVTBDetailPages(request, temp, a.getGoodsId());
            List<ConstructionAcceptanceCertItemTBDTO> fa1 = new ArrayList<ConstructionAcceptanceCertItemTBDTO>();

            for (ConstructionAcceptanceCertItemTBDTO getlistTBBDetail : getlistTBB) {

                if (getlistTBBDetail.getNumberXTB() == null) {
                    getlistTBBDetail.setNumberXTB(0d);
                }
                if (getlistTBBDetail.getNumberTHTB() == null) {
                    getlistTBBDetail.setNumberTHTB(0d);
                }
                if (getlistTBBDetail.getNumberSDTB() == null) {
                    getlistTBBDetail.setNumberSDTB(0d);
                }

//				if(getlistTBBDetail.getNumberXTB()!=null && getlistTBBDetail.getNumberTHTB()!=null && getlistTBBDetail.getNumberSDTB()!=null ){
//					if(getlistTBBDetail.getNumberXTB().intValue()-getlistTBBDetail.getNumberTHTB().intValue()-getlistTBBDetail.getNumberSDTB().intValue()!=0){
//						
//						fa1.add(getlistTBBDetail);
//					}
//					
//					
//				}
                fa1.add(getlistTBBDetail);

            }
            a.setListTBBDetail(fa1);
            long result = fa1.size();
            a.setTotalItemDetail(result);

        }

        return fa;
        // return
        // constructionAcceptanceCertDAO.getValueToInitConstructionAcceptanceVTBPages(request,temp);

    }

    // TB B them moi
    public List<ConstructionAcceptanceCertDetailVTBDTO> getValueToInitConstructionAcceptanceDetailTBBTPages(
            ConstructionAcceptanceDTORequest request, Long temp) {
        // TODO Auto-generated method stub
        List<ConstructionAcceptanceCertDetailVTBDTO> fa1 = new ArrayList<ConstructionAcceptanceCertDetailVTBDTO>();

        List<ConstructionAcceptanceCertDetailVTBDTO> fa = constructionAcceptanceCertDAO
                .getValueToInitConstructionAcceptanceVTBPages(request, temp);
        for (ConstructionAcceptanceCertDetailVTBDTO a : fa) {

            List<ConstructionAcceptanceCertItemTBDTO> getlistVTBDetail = constructionAcceptanceCertDAO
                    .getValueToInitConstructionAcceptanceVTBDetailPages(request, temp, a.getGoodsId());

            if (a.getNumberXuat() == null) {
                a.setNumberXuat(0d);
            }
            if (a.getNumberThuhoi() == null) {
                a.setNumberThuhoi(0d);
            }
            if (a.getNumberSuDung() == null) {
                a.setNumberSuDung(0d);
            }
            a.setListTBBDetail(getlistVTBDetail);
            long result = getlistVTBDetail.size();
            a.setTotalItemDetail(result);

            if (a.getNumberXuat() != null && a.getNumberThuhoi() != null && a.getNumberSuDung() != null) {
                if (a.getNumberXuat().intValue() - a.getNumberThuhoi().intValue()
                        - a.getNumberSuDung().intValue() != 0) {

                    fa1.add(a);
                }

            }

        }

        return fa;
        // return
        // constructionAcceptanceCertDAO.getValueToInitConstructionAcceptanceVTBPages(request,temp);

    }

    public int updateConstructionMerchandise(ConstructionAcceptanceDTORequest request) throws Exception {
        // TODO Auto-generated method stub
        // VTA
        if (request.getListDSVTA() != null) {

            for (ConstructionAcceptanceCertDetailVTADTO dto : request.getListDSVTA()) {

                List<ConstructionAcceptanceCertDetailVTADTO> fa = constructionAcceptanceCertDAO.getListVatTuDetail(
                        request.getConstructionAcceptanceCertDetailDTO().getConstructionId(),
                        request.getConstructionAcceptanceCertDetailDTO().getWorkItemId(), dto.getGoodsId(),
                        request.getSysUserRequest().getSysUserId());
                double slcl = 0;
                double slsd = dto.getNumberNghiemthu().doubleValue();
                double soluongcl=0;

                for (ConstructionAcceptanceCertDetailVTADTO a : fa) {
                	slcl=a.getNumberXuat().doubleValue() - a.getNumberThuhoi().doubleValue() - a.getNumberNghiemthuDB().doubleValue()-a.getNumberNghiemThuKhac().doubleValue();
                    if (slcl < slsd) {
                        ConstructionMerchandiseDTO mer = new ConstructionMerchandiseDTO();
                        mer.setGoodsCode(dto.getGoodsCode());
                        mer.setRemainCount((double) 0);
                        mer.setQuantity((double) slcl);
                        mer.setType("1");
                        mer.setGoodsName(dto.getGoodsName());
                        mer.setMerEntityId(a.getMerEntityId());
                        mer.setConstructionId(request.getConstructionAcceptanceCertDetailDTO().getConstructionId());
                        mer.setWorkItemId(request.getConstructionAcceptanceCertDetailDTO().getWorkItemId());
                        mer.setGoodsUnitName(dto.getGoodsUnitName());
                        mer.setGoodsId(dto.getGoodsId());
                        mer.setGoodsIsSerial("0");

                        constructionMerchandiseDAO.saveObject(mer.toModel());
                        slsd = slsd - slcl;
                    } else if (slcl >= slsd && slsd !=0) {
                        ConstructionMerchandiseDTO mer = new ConstructionMerchandiseDTO();
                        mer.setGoodsCode(dto.getGoodsCode());
//                        mer.setRemainCount((double) slcl - slsd);
                        mer.setQuantity((double) slsd);
                        mer.setType("1");
                        mer.setGoodsName(dto.getGoodsName());
                        mer.setMerEntityId(a.getMerEntityId());
                        mer.setConstructionId(request.getConstructionAcceptanceCertDetailDTO().getConstructionId());
                        mer.setWorkItemId(request.getConstructionAcceptanceCertDetailDTO().getWorkItemId());

                        mer.setGoodsUnitName(dto.getGoodsUnitName());
                        mer.setGoodsId(dto.getGoodsId());
                        mer.setGoodsIsSerial("0");
                        constructionMerchandiseDAO.saveObject(mer.toModel());
                        slsd = 0;
                    }
                }

            }
        }

        // TBA
        // lưu thông tin thiết bị bên A
        if (request.getListDSTBA() != null) {
            for (ConstructionAcceptanceCertDetailVTADTO dto : request.getListDSTBA()) {

                if (dto.getListTBADetail() != null) {
                    for (ConstructionAcceptanceCertItemTBDTO ListTBDeital : dto.getListTBADetail()) {
                        if (ListTBDeital.getEmployTB() == null) {
                            ListTBDeital.setEmployTB(0l);
                        }
                        if (ListTBDeital.getEmployTB() == 1) {
                            String type = "1";
                            Double quantity = 1D;
                            Double remainCount = 0D;
                            ConstructionMerchandiseDTO tb = new ConstructionMerchandiseDTO();
                            tb.setGoodsCode(dto.getGoodsCode());
                            tb.setRemainCount(remainCount);
                            tb.setType(type);
                            tb.setQuantity(quantity);
                            tb.setGoodsName(dto.getGoodsName());
                            tb.setMerEntityId(ListTBDeital.getMerEntityId());
                            tb.setConstructionId(request.getConstructionAcceptanceCertDetailDTO().getConstructionId());
                            tb.setWorkItemId(request.getConstructionAcceptanceCertDetailDTO().getWorkItemId());
                            tb.setGoodsUnitName(dto.getGoodsUnitName());
                            tb.setGoodsId(dto.getGoodsId());
                            tb.setGoodsIsSerial(ListTBDeital.getGoodsIsSerialTB());
                            tb.setSerial(ListTBDeital.getSerial());

                            constructionMerchandiseDAO.saveObject(tb.toModel());
                        }
                    }

                }
            }
        }
        // update conmerchandise cua VTB
        if (request.getListDSVTB() != null) {
            for (ConstructionAcceptanceCertDetailVTBDTO dto : request.getListDSVTB()) {
                if (dto.getNumberSuDung() == null && dto.getNumberXuat() != null) {
                    dto.setNumberSuDung(0d);
                }
                List<ConstructionAcceptanceCertDetailVTBDTO> fa = constructionAcceptanceCertDAO.getListVatTuB(
                        dto.getConstructionId(), dto.getWorkItemId(), dto.getGoodsId(),
                        request.getSysUserRequest().getSysUserId());
                int slcl = 0;
                int slsd = dto.getNumberSuDung().intValue();
                for (ConstructionAcceptanceCertDetailVTBDTO a : fa) {
                    if (a.getNumberThuhoi() == null) {
                        slcl = a.getNumberXuat().intValue();
                    }
                    if (a.getNumberThuhoi() != null) {
                        slcl = a.getNumberXuat().intValue() - a.getNumberThuhoi().intValue();
                    }
                    if (slcl < slsd) {
                        ConstructionMerchandiseDTO mer = new ConstructionMerchandiseDTO();
                        mer.setGoodsCode(dto.getGoodsCode());
                        mer.setRemainCount((double) 0);
                        mer.setQuantity((double) slcl);
                        mer.setType("2");
                        mer.setGoodsName(dto.getGoodsName());
                        mer.setMerEntityId(a.getMerEntityId());
                        mer.setConstructionId(request.getConstructionAcceptanceCertDetailDTO().getConstructionId());
                        mer.setWorkItemId(request.getConstructionAcceptanceCertDetailDTO().getWorkItemId());

                        mer.setGoodsUnitName(dto.getGoodsUnitName());
                        mer.setGoodsId(dto.getGoodsId());
                        mer.setGoodsIsSerial("0");
                        constructionMerchandiseDAO.saveObject(mer.toModel());
                        slsd = slsd - slcl;
                    } else if (slcl >= slsd) {
                        ConstructionMerchandiseDTO mer = new ConstructionMerchandiseDTO();
                        mer.setGoodsCode(dto.getGoodsCode());
                        mer.setRemainCount((double) slcl - slsd);
                        mer.setQuantity((double) slsd);
                        mer.setType("2");
                        mer.setGoodsName(dto.getGoodsName());
                        mer.setMerEntityId(a.getMerEntityId());
                        mer.setConstructionId(request.getConstructionAcceptanceCertDetailDTO().getConstructionId());
                        mer.setWorkItemId(request.getConstructionAcceptanceCertDetailDTO().getWorkItemId());

                        mer.setGoodsUnitName(dto.getGoodsUnitName());
                        mer.setGoodsId(dto.getGoodsId());
                        mer.setGoodsIsSerial("0");
                        constructionMerchandiseDAO.saveObject(mer.toModel());
                        slsd = 0;
                    }
                }
            }

        }

        // TBB
        // lưu thông tin thiết bị bên B
        if (request.getListDSTBB() != null) {
            for (ConstructionAcceptanceCertDetailVTBDTO dto : request.getListDSTBB()) {

                if (dto.getListTBBDetail() != null) {
                    for (ConstructionAcceptanceCertItemTBDTO ListTBDeital : dto.getListTBBDetail()) {
                        if (ListTBDeital.getEmployTB() == null) {
                            ListTBDeital.setEmployTB(0l);
                        }
                        if (ListTBDeital.getEmployTB() == 1) {
                            String type = "2";
                            Double quantity = 1D;
                            Double remainCount = 0D;
                            ConstructionMerchandiseDTO tb = new ConstructionMerchandiseDTO();
                            tb.setGoodsCode(dto.getGoodsCode());
                            tb.setRemainCount(remainCount);
                            tb.setType(type);
                            tb.setQuantity(quantity);
                            tb.setGoodsName(dto.getGoodsName());
                            tb.setMerEntityId(ListTBDeital.getMerEntityId());
                            tb.setConstructionId(request.getConstructionAcceptanceCertDetailDTO().getConstructionId());
                            tb.setWorkItemId(request.getConstructionAcceptanceCertDetailDTO().getWorkItemId());
                            tb.setGoodsUnitName(dto.getGoodsUnitName());
                            tb.setGoodsId(dto.getGoodsId());
                            tb.setGoodsIsSerial("1");
                            tb.setSerial(ListTBDeital.getSerial());

                            constructionMerchandiseDAO.saveObject(tb.toModel());
                        }

                    }

                }
            }
        }

        if (request.getListImage() != null) {
            List<ConstructionImageInfo> lstConstructionImages = saveConstructionImages(request.getListImage(),
                    request.getConstructionAcceptanceCertDetailDTO().getWorkItemId());
//			constructionAcceptanceCertDAO.saveImagePathsDao(lstConstructionImages ,request.getConstructionAcceptanceCertDetailDTO().getWorkItemId(), request.getSysUserRequest());
            String userName = constructionAcceptanceCertDAO.getUserName(request.getSysUserRequest().getSysUserId());

            for (ConstructionImageInfo constructionImage : lstConstructionImages) {

                UtilAttachDocumentBO utilAttachDocumentBO = new UtilAttachDocumentBO();
                UtilAttachDocumentDTO util = new UtilAttachDocumentDTO();

                util.setObjectId(request.getConstructionAcceptanceCertDetailDTO().getWorkItemId());
                util.setName(constructionImage.getImageName());
                util.setType("45");
                util.setDescription("file ảnh nghiệm thu");
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
//      hoanm1_20190131_start
        constructionAcceptanceCertDAO.updateWorkItemNT(
              request.getConstructionAcceptanceCertDetailDTO().getWorkItemId());
      	Double acceptanceWorkItem = constructionAcceptanceCertDAO.avgAcceptanceWorkItem(request.getConstructionAcceptanceCertDetailDTO().getConstructionId());
		if (acceptanceWorkItem == 1.0) {
			constructionAcceptanceCertDAO.updateConstructionNT(request.getConstructionAcceptanceCertDetailDTO().getConstructionId());
		}
      
//      hoanm1_20190131_end

        // set trạng thái sau khi nghiệm thu
        // constructionDAO.updateStatusNT(obj.getConstructionId());
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

    public int deleteVTTBConstructionMerchandise(ConstructionAcceptanceDTORequest request) {
        // TODO Auto-generated method stub
        constructionAcceptanceCertDAO.updateStatusNT(
                request.getConstructionAcceptanceCertDetailDTO().getConstructionId(),
                request.getConstructionAcceptanceCertDetailDTO().getWorkItemId());
        constructionAcceptanceCertDAO
                .deleteImageAcceptance(request.getConstructionAcceptanceCertDetailDTO().getWorkItemId());
//        hoanm1_20190131_start
        constructionAcceptanceCertDAO.updateDeleteWorkItemNT(
                request.getConstructionAcceptanceCertDetailDTO().getWorkItemId());
        constructionAcceptanceCertDAO.updateDeleteConstructionNT(
                request.getConstructionAcceptanceCertDetailDTO().getConstructionId());
//        hoanm1_20190131_end
        return 1;
    }

    public long getValueToInitConstructionNoAcceptance(ConstructionAcceptanceDTORequest request) {
        // TODO Auto-generated method stub
        return constructionAcceptanceCertDAO.getValueToInitConstructionNoAcceptance(request);
    }

    public long getValueToInitConstructionAcceptance(ConstructionAcceptanceDTORequest request) {
        // TODO Auto-generated method stub
        long result = 0;
        long i = 0;
        List<ConstructionAcceptanceCertDetailDTO> listId = constructionAcceptanceCertDAO
                .getValueToInitConstructionAcceptance(request);
        for (ConstructionAcceptanceCertDetailDTO dto : listId) {

            List<ConstructionAcceptanceCertDetailDTO> listWorkItemId = constructionAcceptanceCertDAO
                    .getWorkitemIdConmerchandise();

            for (ConstructionAcceptanceCertDetailDTO dto1 : listWorkItemId) {
                if (dto.getWorkItemId().intValue() == dto1.getWorkItemId().intValue()) {
                    i++;
                } else
                    continue;
            }
        }
        return i;
//		return constructionAcceptanceCertDAO.getValueToInitConstructionAcceptance(request);
    }

    public List<ConstructionImageInfo> getListImageAcceptance(Long workItemId) {
        // TODO Auto-generated method stub
        List<ConstructionImageInfo> listImage = constructionAcceptanceCertDAO.getListImageByConstructionId(workItemId);
        return ToBase64(listImage);
    }

}
