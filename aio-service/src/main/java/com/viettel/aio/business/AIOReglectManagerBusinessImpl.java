package com.viettel.aio.business;

import com.viettel.aio.bo.AIOReglectBO;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.dao.*;
import com.viettel.aio.dto.*;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service("aioReglectManagerBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOReglectManagerBusinessImpl extends BaseFWBusinessImpl<AIOReglectDAO, AIOReglectDTO, AIOReglectBO> implements AIOReglectManagerBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIOReglectManagerBusinessImpl.class);

    @Autowired
    public AIOReglectManagerBusinessImpl(AIOReglectDAO reglectDAO, AIOReglectDetailDAO aioReglectDetailDAO,
                                         AIOContractDAO contractDAO, CommonServiceAio commonService,
                                         AIOContractManagerBusinessImpl contractManagerBusiness) {
        this.reglectDAO = reglectDAO;
        this.aioReglectDetailDAO = aioReglectDetailDAO;
        this.contractDAO = contractDAO;
        this.commonService = commonService;
        this.contractManagerBusiness = contractManagerBusiness;
    }

    private AIOReglectDAO reglectDAO;
    private AIOReglectDetailDAO aioReglectDetailDAO;
    private AIOContractDAO contractDAO;
    private CommonServiceAio commonService;
    private AIOContractManagerBusinessImpl contractManagerBusiness;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Value("${input_sub_folder_upload}")
    private String inputSubFolderUpload;

    @Context
    HttpServletRequest request;

    public DataListDTO doSearch(AIOReglectDTO criteria) {
//    	List<String> groupIdList = ConvertData.convertStringToList(sysGroupIdStr, ",");
        List<AIOReglectDTO> dtos = reglectDAO.doSearch(criteria);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(criteria.getTotalRecord());
        dataListDTO.setSize(criteria.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public List<AIOReglectDetailDTO> getReglectDetail(Long id) {
        return reglectDAO.getReglectDetailByReglectId(id);
    }

    public List<AIOContractDTO> getListContractCustomer(Long idCustomer) {
        return reglectDAO.getListContractCustomer(idCustomer);
    }

    public void submitAdd(AIOReglectDTO dto, SysUserCOMSDTO user) {
        if (dto == null || user == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        if (dto.getIsNewCustomer() == 1) {
            if (dto.getCustomer() == null) {
                throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": Khách hàng mới");
            }

            dto.getCustomer().setType(1L);
            AIOCustomerDTO customerDTO = contractManagerBusiness.createNewCustomer(dto.getCustomer(), user.getSysUserId(), user.getSysGroupId());

            dto.setCustomerId(customerDTO.getCustomerId());
            dto.setCustomerCode(customerDTO.getCode());
            dto.setCustomerName(customerDTO.getName());
            dto.setCustomerAddress(customerDTO.getAddress());
            dto.setCustomerPhone(customerDTO.getPhone());
            dto.setAioAreaId(customerDTO.getAioAreaId());
        }

        AIOAreaDTO performer = reglectDAO.getDefaultPerformer(dto.getAioAreaId());
        if (performer == null) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + " người thực hiện");
        }
        // same area => same sysGrouplv2
        Long performerGroupLv2 = contractDAO.getUserSysGroupLevel2ByUserId(performer.getSysUserId());
        Long allowedTime = reglectDAO.getPerformerAllowedTime(dto.getType());
        Date today = new Date();

        dto.setStatus(1L);
        dto.setCreatedDate(today);
        dto.setCreatedUserId(user.getSysUserId());
        dto.setPerformerGroupId(performerGroupLv2);

        Long id = reglectDAO.saveObject(dto.toModel());
        commonService.validateIdCreated(id, AIOObjectType.REGLECT);

        AIOReglectDetailDTO detailDTO = new AIOReglectDetailDTO();
        detailDTO.setAioReglectId(id);
        detailDTO.setStartDate(today);
        detailDTO.setEndDate(new Date(dto.getSupportDate().getTime() + TimeUnit.HOURS.toMillis(allowedTime)));
        detailDTO.setApprovedExpertDate(dto.getSupportDate());
        detailDTO.setStatus(1L);

        Long idDetail;
        if (dto.getServiceType() == 1) {
            detailDTO.setServiceType(1L);
            detailDTO.setPerformerId(performer.getSysUserId());

            this.sendSms(dto, detailDTO.getPerformerId(), user.getSysUserId());
        } else if (dto.getServiceType() == 2) {
            detailDTO.setServiceType(2L);
            detailDTO.setPerformerId(performer.getSaleSysUserId());

            this.sendSms(dto, detailDTO.getPerformerId(), user.getSysUserId());
        } else {
            AIOReglectDetailDTO detailSaleDTO = new AIOReglectDetailDTO();
            BeanUtils.copyProperties(detailDTO, detailSaleDTO);
            detailDTO.setServiceType(1L);
            detailDTO.setPerformerId(performer.getSysUserId());
            this.sendSms(dto, detailDTO.getPerformerId(), user.getSysUserId());

            detailSaleDTO.setServiceType(2L);
            detailSaleDTO.setPerformerId(performer.getSaleSysUserId());
            idDetail = aioReglectDetailDAO.saveObject(detailSaleDTO.toModel());
            commonService.validateIdCreated(idDetail, AIOObjectType.REGLECT_DETAIL);
            this.sendSms(dto, detailSaleDTO.getPerformerId(), user.getSysUserId());
        }

        idDetail = aioReglectDetailDAO.saveObject(detailDTO.toModel());
        commonService.validateIdCreated(idDetail, AIOObjectType.REGLECT_DETAIL);
    }

    public void updatePerformer(AIOReglectDetailDTO dto, SysUserCOMSDTO user) {
        if (dto == null || user == null || dto.getAioReglectDetailId() == null || dto.getPerformerId() == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }

        Long status = reglectDAO.getStatusReglectDetail(dto.getAioReglectDetailId());
        if (status != null && status != 1) {
            throw new BusinessException("Sai trạng thái phản ánh");
        }

        int result = reglectDAO.updatePerformer(dto.getAioReglectDetailId(), dto.getPerformerId());
        commonService.validateIdCreated(result, AIOErrorType.SAVE_ERROR.msg + AIOObjectType.REGLECT_DETAIL.getName());

        result = reglectDAO.updateUpdateDate(dto.getAioReglectDetailId(), user.getSysUserId());
        commonService.validateIdCreated(result, AIOErrorType.SAVE_ERROR.msg + AIOObjectType.REGLECT.getName());
    }

	public AIOReglectDTO getListReglect(AIOContractMobileRequest rq) {
        if (rq.getSysUserRequest() == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        AIOReglectDTO criteria = rq.getReglectDTO() == null ? new AIOReglectDTO() : rq.getReglectDTO();
        List<AIOReglectDetailDTO> detailDtos = reglectDAO.getListReglect(criteria, rq.getSysUserRequest().getSysUserId());

        AIOReglectDTO res = new AIOReglectDTO();
        res.setReglectDetailDTOS(detailDtos);

        return res;
    }

    public AIOReglectDTO getListReason() {
        List<String> reason = reglectDAO.getListReason();

        AIOReglectDTO res = new AIOReglectDTO();
        res.setReasons(reason);

        return res;
    }

    public AIOReglectDTO putReglectOnHold(AIOContractMobileRequest rq) {
        AIOReglectDTO reglectDTO = rq.getReglectDTO();
        if (reglectDTO == null || reglectDTO.getDetailDTO() == null || rq.getSysUserRequest() == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        AIOReglectDetailDTO dto = reglectDTO.getDetailDTO();
        if (dto.getAioReglectDetailId() == null || reglectDTO.getAioReglectId() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": phản ánh");
        }
        if (dto.getExpertDate() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": ngày đề xuất tạm dừng");
        }

        Long status = reglectDAO.getDetailStatus(dto.getAioReglectDetailId());
        if (status == 4 || status == 3) {
            throw new BusinessException("Trạng thái phản ánh không hợp lệ");
        }

        int result = reglectDAO.updateExpectedDateDetail(dto);
        commonService.validateIdCreated(result, AIOErrorType.SAVE_ERROR.msg + ": ngày đề xuất tạm dừng ");

        Long statusMax = reglectDAO.getMaxStatusReglectDoing(reglectDTO.getAioReglectId());
        result = reglectDAO.updateUpdatedUserAndStatus(
                reglectDTO.getAioReglectId(),
                rq.getSysUserRequest().getSysUserId(),
                statusMax);
        commonService.validateIdCreated(result, AIOErrorType.SAVE_ERROR.msg + ": người cập nhật ");

        AIOReglectDTO res = new AIOReglectDTO();
        res.setStatus(3L);
        return res;
    }

    public AIOReglectDTO startReglect(AIOContractMobileRequest rq) {
        AIOReglectDTO reglectDTO = rq.getReglectDTO();
        if (reglectDTO == null || rq.getSysUserRequest() == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        AIOReglectDetailDTO dto = reglectDTO.getDetailDTO();
        if (dto.getAioReglectDetailId() == null || reglectDTO.getAioReglectId() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": phản ánh");
        }

        Long status = reglectDAO.getDetailStatus(dto.getAioReglectDetailId());
        if (status != 1) {
            throw new BusinessException("Trạng thái phản ánh không hợp lệ");
        }

        int result = reglectDAO.updateStartReglect(dto.getAioReglectDetailId());
        commonService.validateIdCreated(result, "Bắt đầu xử lí phản ánh thất bại!");

        Long statusMax = reglectDAO.getMaxStatusReglectDoing(reglectDTO.getAioReglectId());
        result = reglectDAO.updateUpdatedUserAndStatus(
                reglectDTO.getAioReglectId(),
                rq.getSysUserRequest().getSysUserId(),
                statusMax);
        commonService.validateIdCreated(result, "Cập nhật trạng thái phản ánh thất bại");

        AIOReglectDTO res = new AIOReglectDTO();
        res.setStatus(2L);
        return res;
    }

    public AIOReglectDTO endReglect(AIOContractMobileRequest rq) {
        AIOReglectDTO reglectDTO = rq.getReglectDTO();
        if (reglectDTO == null || rq.getSysUserRequest() == null) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        AIOReglectDetailDTO dto = reglectDTO.getDetailDTO();
        if (dto.getAioReglectDetailId() == null || reglectDTO.getAioReglectId() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": phản ánh");
        }
        if (StringUtils.isEmpty(dto.getReason()) || StringUtils.isEmpty(dto.getDescriptionStaff())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": nguyên nhân và diễn giải");
        }

        Long statusDetail = reglectDAO.getDetailStatus(dto.getAioReglectDetailId());
        if (statusDetail != 2) {
            throw new BusinessException("Trạng thái phản ánh không hợp lệ");
        }

        int result = reglectDAO.updateEndReglect(dto);
        commonService.validateIdCreated(result, "Kết thúc phản ánh thất bại!");

        List<Long> statuses = reglectDAO.getAllStatusReglectDetail(reglectDTO.getAioReglectId());
        Long statusReglect;
        if (statuses.size() == 1 && statuses.get(0) == 4) {
            // chỉ có 1 loại status = 4 -> kết thúc reglect
            statusReglect = 4L;
        } else {
            // mặc định có 1 bản ghi hoàn thành (status = 4) nên status reglect không thể là chưa thực hiện
            // => check status = 2 hoặc 3, lấy status max
            statusReglect = 2L;
            for (Long status : statuses) {
                if (status == 3L) {
                    statusReglect = status;
                }
            }
        }
        result = reglectDAO.updateUpdatedUserAndStatus(reglectDTO.getAioReglectId(), rq.getSysUserRequest().getSysUserId(), statusReglect);
        commonService.validateIdCreated(result, "Cập nhật trạng thái phản ánh thất bại");

        AIOReglectDTO res = new AIOReglectDTO();
        res.setStatus(4L);
        return res;
    }

    public List<AppParamDTO> getDataAddForm() {
        return reglectDAO.getDropDownData();
    }

    public List<AIOCustomerDTO> getListCustomer(AIOCustomerDTO criteria) {
        return reglectDAO.getListCustomer(criteria);
    }

    private void sendSms(AIOReglectDTO dto, Long performerId, Long sysUserId) {
        String subject = "Thông báo phản ánh, sự cố AIO";
        String content = "Bạn được giao xử lý sự cố, phản ánh cho khách hàng: \nTên: %s\nSĐT: %s\nĐịa chỉ: %s\n " +
                "Nội dung: %s, thời gian thực hiện từ %s đến %s";
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm dd/MM/yyyy");

        content = String.format(content,
                dto.getCustomerName(),
                dto.getCustomerPhone(),
                dto.getCustomerAddress(),
                dto.getReglectContent(),
                sdf.format(dto.getSupportDate()),
                sdf.format(new Date(dto.getSupportDate().getTime() + TimeUnit.HOURS.toMillis(48))));

        commonService.insertIntoSmsTable(subject, content, performerId, sysUserId, new Date());
    }
}
