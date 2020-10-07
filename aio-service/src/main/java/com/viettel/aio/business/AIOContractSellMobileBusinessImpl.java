package com.viettel.aio.business;

import com.viettel.aio.bo.AIOContractBO;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.config.AIOSaleChannel;
import com.viettel.aio.dao.AIOContractDAO;
import com.viettel.aio.dao.AIOContractSellMobileDAO;
import com.viettel.aio.dao.AIOPackagePromotionDAO;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOPackagePromotionDTO;
import com.viettel.aio.dto.ConstructionImageInfo;
import com.viettel.aio.dto.SysUserRequest;
import com.viettel.ktts2.common.BusinessException;
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
import java.util.List;

/**
 * @author HOANM1
 * @version 1.0
 * @since 2019-03-10
 */
@Service("aioContractSellMobileBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOContractSellMobileBusinessImpl extends BaseFWBusinessImpl<AIOContractSellMobileDAO, AIOContractDTO, AIOContractBO>
        implements AIOSynStockTransBusiness {

    private static final String SYN_STOCK_TRAIN = "A";
    //VietNT_20190125_start
    private final String REJECT_NOTE_PERMISSION = "REJECT NOTE";

    @Autowired
    public AIOContractSellMobileBusinessImpl(AIOContractDAO contractDAO, AIOPackagePromotionDAO aioPackagePromotionDAO,
                                             AIOContractServiceMobileBusinessImpl aioContractServiceMobileBusiness,
                                             AIOContractSellMobileDAO aioContractDAO) {
        tModel = new AIOContractBO();
        tDAO = aioContractDAO;
        this.aioPackagePromotionDAO = aioPackagePromotionDAO;
        this.contractDAO = contractDAO;
        this.aioContractServiceMobileBusiness = aioContractServiceMobileBusiness;
        this.aioContractDAO = aioContractDAO;
    }

    private AIOContractDAO contractDAO;
    private AIOContractSellMobileDAO aioContractDAO;
    private AIOContractServiceMobileBusinessImpl aioContractServiceMobileBusiness;
    private AIOPackagePromotionDAO aioPackagePromotionDAO;

    @Value("${folder_upload2}")
    private String folder2Upload;

    @Value("${input_image_sub_folder_upload}")
    private String input_image_sub_folder_upload;


    @Override
    public AIOContractSellMobileDAO gettDAO() {
        return aioContractDAO;
    }

    @Override
    public long count() {
        return aioContractDAO.count("AIOContractBO", null);
    }

    ////    aio_20190315_start
    public AIOContractDTO countContractSell(SysUserRequest request) {
        return aioContractDAO.countContractSell(request);
    }

    public List<AIOContractDTO> getListContractSellTask(SysUserRequest request) {
        return aioContractDAO.getListContractSellTask(request);
    }

    public List<AIOContractDTO> getListContractSellTaskDetail(AIOContractMobileRequest request) {
        List<AIOContractDTO> contractInfos = aioContractDAO.getListContractSellTaskDetail(request);
        if (contractInfos == null || contractInfos.isEmpty()) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.CONTRACT.getName());
        }
        AIOContractDTO contractInfo = contractInfos.get(0);
        List<AIOPackagePromotionDTO> promos = aioPackagePromotionDAO.getListPromotions(contractInfo.getPackageDetailId());
        contractInfo.setPromotionDTOS(promos);
        return contractInfos;
    }

    //    public List<AIOContractDTO> getListPackageGoodSell(AIOContractMobileRequest request) {
//        return aioContractDAO.getListPackageGoodSell(request);
//    }
//    public List<AIOContractDTO> getListPackageGoodAdd(AIOContractMobileRequest request) {
//        return aioContractDAO.getListPackageGoodAdd(request);
//    }
//    public List<AIOContractDTO> getListGoodPriceOther(AIOContractMobileRequest request) {
//        return aioContractDAO.getListGoodPriceOther(request);
//    }
    public Long startContract(AIOContractMobileRequest dto) {
        return aioContractDAO.startContract(dto);
    }

    public Long endContract(AIOContractMobileRequest dto) {
//		//VietNT_01/07/2019_start
//		if (contractDAO.checkContractStatus(dto.getAioContractDTO().getContractId(), 4L)) {
//			return -5L;
//		}
//		//VietNT_end
//    	//VietNT_26/06/2019_start
//		if (contractDAO.userHasContractUnpaid(dto.getSysUserRequest().getSysUserId(), dto.getAioContractDTO().getContractId())) {
//			return -3L;
//		}
//    	//VietNT_end
//		if (!contractDAO.isContractDetailCorrect(dto)) {
//			return -4L;
//		}
//    	//VietNT_end
        //VietNT_29/07/2019_start
        AIOContractDTO contractDTO = dto.getAioContractDTO();
        AIOContractDTO info = contractDAO.getContractInfoEndContract(contractDTO.getContractId(), contractDTO.getContractDetailId());
        aioContractServiceMobileBusiness.validateEndContract(contractDTO, info, dto.getSysUserRequest().getSysUserId());

        // set industry scale for validate
        dto.setIndustryScale(info.getIndustryScale());

        if (info.getSaleChannel().equals(AIOSaleChannel.VCC.code)) {
            aioContractServiceMobileBusiness.handlingPayTypeEndContract(info, contractDTO, dto.getSysUserRequest().getSysUserId());
        }
        //VietNT_end
        if (dto.getLstImage() != null) {
            List<AIOContractDTO> lstPakageImages = saveConstructionImages(dto.getLstImage());

            aioContractDAO.saveImagePathsDao(lstPakageImages,
                    dto.getAioContractDTO().getContractDetailId(), dto.getSysUserRequest());
        }
        return aioContractServiceMobileBusiness.finishContractByPayType(dto, info);
    }

    public Long updateLocationUser(AIOContractMobileRequest dto) {
        return aioContractDAO.updateLocationUser(dto);
    }

    public List<ConstructionImageInfo> getImagesByPackageDetailId(AIOContractMobileRequest request) {
        List<ConstructionImageInfo> listImageResponse = new ArrayList<>();
        List<ConstructionImageInfo> listImage = aioContractDAO.getImagesByPackageDetailId(request.getAioContractDTO().getContractDetailId());
        listImageResponse = getPackageDetailImages(listImage);
        return listImageResponse;
    }

    public List<ConstructionImageInfo> getPackageDetailImages(List<ConstructionImageInfo> lstImages) {
        List<ConstructionImageInfo> result = new ArrayList<>();
        for (ConstructionImageInfo packageImage : lstImages) {
            try {
                String fullPath = folder2Upload + File.separator + packageImage.getImagePath();
                String base64Image = ImageUtil.convertImageToBase64(fullPath);
                ConstructionImageInfo obj = new ConstructionImageInfo();
                obj.setImageName(packageImage.getImageName());
                obj.setBase64String(base64Image);
                obj.setImagePath(fullPath);
                obj.setStatus(1L);
                obj.setUtilAttachDocumentId(packageImage.getUtilAttachDocumentId());
                result.add(obj);
            } catch (Exception e) {
                continue;
            }
        }

        return result;
    }

    public List<AIOContractDTO> saveConstructionImages(List<AIOContractDTO> lstImages) {
        List<AIOContractDTO> result = new ArrayList<>();
        for (AIOContractDTO pakageDetailMage : lstImages) {
            if (pakageDetailMage.getStatus() == 0) {
                AIOContractDTO obj = new AIOContractDTO();
                obj.setImageName(pakageDetailMage.getImageName());
                obj.setLatitude(pakageDetailMage.getLatitude());
                obj.setLongtitude(pakageDetailMage.getLongtitude());
                InputStream inputStream = ImageUtil.convertBase64ToInputStream(pakageDetailMage.getBase64String());
                try {
                    String imagePath = UFile.writeToFileServerATTT2(inputStream, pakageDetailMage.getImageName(),
                            input_image_sub_folder_upload, folder2Upload);
                    obj.setImagePath(imagePath);
                } catch (Exception e) {
                    continue;
                }
                result.add(obj);
            }
            if (pakageDetailMage.getStatus() == -1 && pakageDetailMage.getImagePath() != "") {
                aioContractDAO.updateUtilAttachDocumentById(pakageDetailMage.getUtilAttachDocumentId());
            }
        }

        return result;
    }
//    aio_20190315_end
}
