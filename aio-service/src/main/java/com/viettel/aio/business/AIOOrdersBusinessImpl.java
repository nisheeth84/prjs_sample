package com.viettel.aio.business;

import com.viettel.aio.bo.AIOOrdersBO;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.dao.AIOContractDAO;
import com.viettel.aio.dao.AIOOrdersDAO;
import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.aio.dto.AIOBaseRequest;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOOrdersDTO;
import com.viettel.aio.dto.AIOProvinceDTO;
import com.viettel.aio.dto.SysUserRequest;
import com.viettel.cat.business.CatProvinceBusinessImpl;
import com.viettel.cat.dto.CatProvinceDTO;
import com.viettel.coms.business.SysUserCOMSBusinessImpl;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.ConvertData;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

@Service("aioOrdersBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOOrdersBusinessImpl extends BaseFWBusinessImpl<AIOOrdersDAO, AIOOrdersDTO, AIOOrdersBO> implements AIOOrdersBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(AIOOrdersBusinessImpl.class);

    @Autowired
    public AIOOrdersBusinessImpl(AIOOrdersDAO aioOrdersDAO, CommonServiceAio commonService,
                                 AIOContractDAO aioContractDAO, CatProvinceBusinessImpl catProvinceBusiness,
                                 SysUserCOMSBusinessImpl sysUserCOMSBusiness) {
        this.aioOrdersDAO = aioOrdersDAO;
        this.commonService = commonService;
        this.aioContractDAO = aioContractDAO;
        this.catProvinceBusiness = catProvinceBusiness;
        this.sysUserCOMSBusiness = sysUserCOMSBusiness;
    }

    private CatProvinceBusinessImpl catProvinceBusiness;
    private SysUserCOMSBusinessImpl sysUserCOMSBusiness;

    private AIOOrdersDAO aioOrdersDAO;
    private CommonServiceAio commonService;
    private AIOContractDAO aioContractDAO;

    private final String SEQ_NAME = "AIO_ORDERS_SEQ";
    private static final String SMS_SUBJECT = "Thông báo nhận công việc AIO";
    private static final String SMS_CONTENT = "Bạn được giao thực hiện yêu cầu khảo sát %s cho khách hàng %s, địa chỉ %s ";

    public DataListDTO doSearch(AIOOrdersDTO dto, String sysGroupIdStr) {
        List<String> groupIdList = ConvertData.convertStringToList(sysGroupIdStr, ",");
        List<AIOOrdersDTO> dtos = aioOrdersDAO.doSearch(dto, groupIdList);
        for (int i = 0; i < dtos.size(); i++) {
            if (StringUtils.isBlank(dtos.get(i).getPastDueApproved()) && StringUtils.isNotBlank(dtos.get(i).getPastDueContact())) {
                dtos.get(i).setPastDue(dtos.get(i).getPastDueContact());
            } else if (StringUtils.isNotBlank(dtos.get(i).getPastDueApproved()) && StringUtils.isBlank(dtos.get(i).getPastDueContact())) {
                dtos.get(i).setPastDue(dtos.get(i).getPastDueApproved());
            } else if (StringUtils.isNotBlank(dtos.get(i).getPastDueApproved()) && StringUtils.isNotBlank(dtos.get(i).getPastDueContact())) {
                dtos.get(i).setPastDue(dtos.get(i).getPastDueApproved() + "-" + dtos.get(i).getPastDueContact());
            } else {
                dtos.get(i).setPastDue("Chưa quá hạn");
            }
        }
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(dto.getTotalRecord());
        dataListDTO.setSize(dto.getPageSize());
        dataListDTO.setStart(1);

        return dataListDTO;
    }

    @Override
    @Transactional
    public Long add(AIOOrdersDTO obj) {
        Long id = 0L;
        id = aioOrdersDAO.saveObject(obj.toModel());
        return id;
    }

    @Override
    public List<AIOOrdersDTO> autoSearchCatProvice(String keySearch) {
        return aioOrdersDAO.autoSearchCatProvice(keySearch);
    }

    public List<AIOOrdersDTO> getDomainData(Long catProviceId, Long sysUserId) {
        return aioOrdersDAO.getDomainData(catProviceId, sysUserId);
    }

    @Override
    public DataListDTO popupSearchCatProvice(AIOOrdersDTO obj) {
        List<AIOOrdersDTO> ls = aioOrdersDAO.popupSearchCatProvice(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getTotalRecord());
        data.setStart(1);
        return data;
    }

    @Override
    public List<AIOOrdersDTO> autoSearchService() {
        return aioOrdersDAO.autoSearchService();
    }

    @Override
    public List<AIOOrdersDTO> autoSearchChanel() {
        return aioOrdersDAO.autoSearchChanel();
    }

    @Override
    public AIOOrdersDTO viewDetail(AIOOrdersDTO obj) {
        return aioOrdersDAO.viewDetail(obj);
    }

    @Override
    public Long confirmStatus(AIOOrdersDTO obj) {
        return aioOrdersDAO.confirmStatus(obj);
    }

    @Override
    public Long confirmList(AIOOrdersDTO obj) {
        Long id = 0L;
        if (obj.getListId() != null && obj.getListId().size() > 0) {
            for (Long aioOrdersId : obj.getListId()) {
                AIOOrdersDTO dto = new AIOOrdersDTO();
                dto.setStatus(2L);
                dto.setAioOrdersId(aioOrdersId);
                id = aioOrdersDAO.confirmStatus(dto);
            }
        }
        return id;
    }

    private String generateOrderCode() {
        Long id = commonService.getLatestSeqNumber(SEQ_NAME);
        if (id == null) {
            id = 1L;
        }
        String nextId = String.format((Locale) null, "%07d", id);

        return "YCKS/" + nextId;
    }

    // mobile
    // lay ds
    public List<AIOOrdersDTO> getListOrders(SysUserRequest sysUserRequest) {
        return aioOrdersDAO.getListOrder(sysUserRequest.getSysUserId());
    }

    // lay du lieu setup dropdown
    public List<AppParamDTO> getMetaData() {
        return aioOrdersDAO.getMetaData();
    }

    // duyet hoac tu choi yeu cau
    public void action(AIOBaseRequest<AIOOrdersDTO> rq) {
        this.validateRequest(rq);
        AIOOrdersDTO order = rq.getData();

        Long status = aioOrdersDAO.getStatusOrder(order.getAioOrdersId());
        if (status == null || status != 1) {
            throw new BusinessException(AIOErrorType.WRONG_STATUS.msg);
        }

        if (StringUtils.isEmpty(order.getDescription())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": Ghi chú");
        }

        if (order.getFlag() == 1) {
            // ok
            if (order.getQuantity() == null) {
                throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": Số lượng");
            }
            order.setStatus(2L);
        } else if (order.getFlag() == 2) {
            // not ok
            if (order.getReasonId() == null || StringUtils.isEmpty(order.getReasonName())) {
                throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + ": Nguyên nhân ");
            }
            order.setStatus(3L);
        } else {
            throw new BusinessException(AIOErrorType.NOT_VALID.msg);
        }
        Date now = new Date();
        order.setUpdatedDate(now);
        order.setUpdatedUser(rq.getSysUserRequest().getSysUserId());
        order.setUpdatedGroupId(commonService.getSysGroupLevelByUserId(rq.getSysUserRequest().getSysUserId(), 2));
        order.setApprovedDate(now);

        int result = aioOrdersDAO.updateApproveOrder(order);
        commonService.validateIdCreated(result, "Cập nhật YC thất bại!");
    }

    private void validateRequest(AIOBaseRequest<AIOOrdersDTO> rq) {
        if (rq.getSysUserRequest() == null || rq.getSysUserRequest().getSysUserId() == 0) {
            throw new BusinessException(AIOErrorType.USER_NOT_LOGGED_IN.msg);
        }
        if (rq.getData() == null || rq.getData().getAioOrdersId() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.ORDERS.getName());
        }
    }

    private void validateAddOrder(AIOOrdersDTO order) {
        if (order.getOrdersType() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " loại YC");
        }
        if (StringUtils.isEmpty(order.getCustomerName()) || StringUtils.isEmpty(order.getCustomerAddress())
                || StringUtils.isEmpty(order.getCustomerPhone())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " khách hàng");
        }
        if (order.getAreaId() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " địa chỉ");
        }
        if (order.getServiceId() == null || StringUtils.isEmpty(order.getServiceName()) || order.getServiceType() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " dịch vụ");
        }
        if (order.getQuantityTemp() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " số lượng tạm tính");
        }
        if (StringUtils.isEmpty(order.getContactChannel())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " kênh tiếp xúc");
        }
        if (StringUtils.isEmpty(order.getContentOrder())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " nội dung yêu cầu");
        }
    }

    // them moi ycks
    public void addNewOrder(AIOBaseRequest<AIOOrdersDTO> rq) {
        if (rq.getSysUserRequest() == null || rq.getSysUserRequest().getSysUserId() == 0) {
            throw new BusinessException(AIOErrorType.USER_NOT_LOGGED_IN.msg);
        }
        if (rq.getData() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.ORDERS.getName());
        }
        AIOOrdersDTO order = rq.getData();
        this.validateAddOrder(order);

        // find default performer
        SysUserCOMSDTO performer = aioContractDAO.getDefaultPerformer(order.getAreaId(), order.getServiceType());
        SimpleDateFormat sdf = new SimpleDateFormat("hh:mm dd/MM/yyyy");
        Date now = new Date();

        order.setOrderCode(this.generateOrderCode());
        order.setCreatedDate(now);
        order.setCreatedUser(rq.getSysUserRequest().getSysUserId());
        order.setCreatedGroupId(commonService.getSysGroupLevelByUserId(rq.getSysUserRequest().getSysUserId(), 2));
        order.setStatus(AIOOrdersDTO.STATUS_NEW);
        order.setPerformerId(performer.getSysUserId());
        order.setCallDate(sdf.format(now));
        order.setEndDate(new Date(System.currentTimeMillis() + TimeUnit.DAYS.toMillis(2)));

        Long result = aioOrdersDAO.saveObject(order.toModel());
        commonService.validateIdCreated(result, AIOObjectType.ORDERS);
    }

    // update ycks
    public void updateOrder(AIOBaseRequest<AIOOrdersDTO> rq) {
        this.validateRequest(rq);
        AIOOrdersDTO order = rq.getData();
        this.validateAddOrder(order);

        // validate status & createUserId
        AIOOrdersDTO info = aioOrdersDAO.getOrderInfo(rq.getData().getAioOrdersId());
        if (!info.getStatus().equals(AIOOrdersDTO.STATUS_NEW)) {
            throw new BusinessException(AIOErrorType.WRONG_STATUS.msg);
        }
        if (!info.getCreatedUser().equals(rq.getSysUserRequest().getSysUserId())) {
            throw new BusinessException(AIOErrorType.NOT_AUTHORIZE.msg);
        }

        order.setUpdatedDate(new Date());
        order.setUpdatedUser(info.getCreatedUser());
        order.setUpdatedGroupId(info.getCreatedGroupId());

        int result = aioOrdersDAO.updateOrderCreatedUser(order);
        commonService.validateIdCreated(result, AIOErrorType.SAVE_ERROR.msg + AIOObjectType.ORDERS.getName());
    }

    //tungmt92 start 12122019
    // them moi ycks
    public void createNewOrder(AIOBaseRequest<AIOOrdersDTO> rq, HttpServletRequest request) {
        Long loggedInUser = this.getSysUserId(request);
        rq.getData().setSysUserId(loggedInUser);

        if (rq.getData() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.ORDERS.getName());
        }
        AIOOrdersDTO order = rq.getData();
        CatProvinceDTO catProvinceDTO = catProvinceBusiness.getbyOnlyID(order.getCatProviceId());
        order.setCatProviceCode(catProvinceDTO.getCode());
        order.setCatProviceName(catProvinceDTO.getName());
        //this.validateAddOrder(order);
        AIOConfigServiceDTO getPerformer = aioOrdersDAO.getTypeAIOConf(order.getServiceId());
        // find default performer
        SysUserCOMSDTO performer = aioContractDAO.getDefaultPerformer(order.getAreaDistrictId(), getPerformer.getType());
        SimpleDateFormat sdf = new SimpleDateFormat("hh:mm dd/MM/yyyy");
        Date now = new Date();

        order.setAreaId(order.getAreaDistrictId());
        order.setOrderCode(this.generateOrderCode());
        order.setCallDate(StringUtils.isEmpty(rq.getData().getCallDate()) ? sdf.format(now) : rq.getData().getCallDate());
        order.setCreatedDate(now);
        order.setCreatedUser(loggedInUser);
        order.setStatus(AIOOrdersDTO.STATUS_NEW);
        order.setPerformerId(performer.getSysUserId());
        Long result = aioOrdersDAO.saveObject(order.toModel());
        commonService.validateIdCreated(result, AIOObjectType.ORDERS);

        this.sendSms(order, performer, loggedInUser);
    }

    private void sendSms(AIOOrdersDTO order, SysUserCOMSDTO performer, Long createdUserId) {
        String smsSubject = SMS_SUBJECT;
        String smsContent = "Bạn được giao thực hiện yêu cầu  khảo sát " + order.getOrderCode() +
                " cho khách hàng " + order.getCustomerName() + " địa chỉ " + order.getCustomerAddress();

        commonService.insertIntoSmsTable(smsSubject,
                String.format(smsContent, order.getOrderCode(), order.getCustomerName(), order.getCustomerAddress()),
                performer.getSysUserId(),
                createdUserId,
                new Date());
    }

    //update yckhs
    public Long updateAioOrders(AIOOrdersDTO aioOrdersDTO, HttpServletRequest request) {
        Date date = new Date();

        //aioOrdersDTO.setCreatedGroupId(commonService.getSysGroupLevelByUserId(objUser.getSysUserId(), 2));
        aioOrdersDTO.setUpdatedDate(date);
        aioOrdersDTO.setUpdatedUser(this.getSysUserId(request));
        return aioOrdersDAO.updateAioOrders(aioOrdersDTO);
    }

    public AIOOrdersDTO viewDetailAioOrders(AIOOrdersDTO obj, HttpServletRequest request) {
        obj.setSysUserId(this.getSysUserId(request));
        return aioOrdersDAO.getDetailAioOrder(obj);
    }

    public List<AIOProvinceDTO> getListProvince() {
        return aioOrdersDAO.getListProvince();
    }

    public List<AIOAreaDTO> getDataDistrict(Long idProvince) {
        return aioOrdersDAO.getDataDistrict(idProvince);
    }

    public List<AIOAreaDTO> getDataWard(Long idArea) {
        return aioOrdersDAO.getDataWard(idArea);
    }

    public DataListDTO doSearchOrders(AIOOrdersDTO dto) {
        if (StringUtils.isNotEmpty(dto.getText()) && dto.getText().length() >= 4) {
            SysUserCOMSDTO criteria = new SysUserCOMSDTO();
            criteria.setKeySearch(dto.getText());
            SysUserCOMSDTO user = commonService.getUserByCodeOrId(criteria);
            if (user != null) {
                dto.setCreatedUser(user.getSysUserId());
            } else {
                DataListDTO dataListDTO = new DataListDTO();
                dataListDTO.setData(new ArrayList());
                dataListDTO.setTotal(0);
                dataListDTO.setSize(dto.getPageSize());
                dataListDTO.setStart(1);
                return dataListDTO;
            }
        }

        List<AIOOrdersDTO> dtos = aioOrdersDAO.doSearchOrders(dto);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(dto.getTotalRecord());
        dataListDTO.setSize(dto.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    private Long getSysUserId(HttpServletRequest request) {
        KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
        return objUser.getVpsUserInfo().getSysUserId();
    }
    public AIOAreaDTO getAreaPathByAreaId(Long idArea){
        return aioOrdersDAO.getAreaPathByAreaId(idArea);
    }
    //tungmt92 end
}
