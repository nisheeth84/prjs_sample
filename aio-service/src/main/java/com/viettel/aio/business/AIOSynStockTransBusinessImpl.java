package com.viettel.aio.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.dao.AIOMerEntityDAO;
import com.viettel.aio.dao.AIOStockGoodsTotalDAO;
import com.viettel.aio.dao.AIOStockTransDetailDAO;
import com.viettel.aio.dao.AIOStockTransDetailSerialDAO;
import com.viettel.aio.dao.AIOSynStockTransDAO;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOCountConstructionTaskDTO;
import com.viettel.aio.dto.AIOMerEntityDTO;
import com.viettel.aio.dto.AIORevenueDTO;
import com.viettel.aio.dto.AIOStockGoodsTotalDTO;
import com.viettel.aio.dto.AIOStockTransDetailSerialDTO;
import com.viettel.aio.dto.AIOStockTransRequest;
import com.viettel.aio.dto.AIOStockTransResponse;
import com.viettel.aio.dto.AIOSynStockTransDTO;
import com.viettel.aio.dto.AIOSynStockTransDetailDTO;
import com.viettel.aio.dto.AIOSysGroupDTO;
import com.viettel.aio.dto.AIOSysUserDTO;
import com.viettel.aio.dto.SysUserRequest;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.coms.bo.SynStockTransBO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.dto.StockDTO;
import com.viettel.wms.dto.StockTransDTO;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author HOANM1
 * @version 1.0
 * @since 2019-03-10
 */
@Service("aiosynStockTransBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
@Transactional
public class AIOSynStockTransBusinessImpl extends BaseFWBusinessImpl<AIOSynStockTransDAO, AIOSynStockTransDTO, SynStockTransBO>
        implements AIOSynStockTransBusiness {

    private Logger logger = Logger.getLogger(AIOSynStockTransBusinessImpl.class);

    private static final String SYN_STOCK_TRAIN = "A";

    @Autowired
    public AIOSynStockTransBusinessImpl(AIOSynStockTransDAO synStockTransDAO, CommonServiceAio commonService, AIOStockTransDetailDAO aioStockTransDetailDAO, AIOStockTransDetailSerialDAO aioStockTransDetailSerialDAO, AIOStockGoodsTotalDAO aioStockGoodsTotalDAO, AIOMerEntityDAO aioMerEntityDAO) {
        this.synStockTransDAO = synStockTransDAO;
        this.commonService = commonService;
        this.aioStockTransDetailDAO = aioStockTransDetailDAO;
        this.aioStockTransDetailSerialDAO = aioStockTransDetailSerialDAO;
        this.aioStockGoodsTotalDAO = aioStockGoodsTotalDAO;
        this.aioMerEntityDAO = aioMerEntityDAO;
    }

    private AIOSynStockTransDAO synStockTransDAO;
    private CommonServiceAio commonService;
    private AIOStockTransDetailDAO aioStockTransDetailDAO;
    private AIOStockTransDetailSerialDAO aioStockTransDetailSerialDAO;
    private AIOStockGoodsTotalDAO aioStockGoodsTotalDAO;
    private AIOMerEntityDAO aioMerEntityDAO;

    public AIOSynStockTransBusinessImpl() {
        tModel = new SynStockTransBO();
        tDAO = synStockTransDAO;
    }

    @Override
    public AIOSynStockTransDAO gettDAO() {
        return synStockTransDAO;
    }

    @Override
    public long count() {
        return synStockTransDAO.count("SynStockTransBO", null);
    }

    private final int KHO_CA_NHAN = 1;
    private final int KHO_CA_NHAN_THUOC_CUM_DOI = 2;
    private final int KHO_CUM_DOI = 3;
    private final int KHO_CNKT = 4;

    /**
     * getCountContructionTask
     *
     * @param request
     * @return CountConstructionTaskDTO
     */
    public AIOCountConstructionTaskDTO getCountContructionTask(SysUserRequest request) {
        return synStockTransDAO.getCount(request);
    }

    /**
     * getListSysStockTransDTO
     *
     * @param request
     * @return List<SynStockTransDTO>
     */
    public List<AIOSynStockTransDTO> getListSysStockTransDTO(AIOStockTransRequest request) {
        return synStockTransDAO.getListSysStockTransDTO(request);
    }

    public List<AIOSynStockTransDTO> getListStockTransCreated(AIOStockTransRequest request) {
        return synStockTransDAO.getListStockTransCreated(request);
    }

    /**
     * getListSynStockTransDetail
     *
     * @param st
     * @return List<SynStockTransDetailDTO>
     */
    public List<AIOSynStockTransDetailDTO> getListSynStockTransDetail(AIOSynStockTransDTO st) {
        return synStockTransDAO.getListSysStockTransDetailDTO(st);
    }

    /**
     * getListMerEntityDto
     *
     * @param request
     * @return List<MerEntityDTO>
     */
    public List<AIOMerEntityDTO> getListMerEntityDto(AIOStockTransRequest request) {
        return synStockTransDAO.getListMerEntity(request);
    }

    public List<AIOMerEntityDTO> getListDetailSerialDTO(AIOStockTransRequest request) {
        return synStockTransDAO.getListDetailSerialDTO(request);
    }

    /**
     * updateStockTrans
     *
     * @param request
     * @return int result
     */
    public int updateStockTrans(AIOStockTransRequest request) {
        return synStockTransDAO.updateStockTrans(request);
    }

    /**
     * updateSynStockTrans
     *
     * @param request
     * @return int result
     */
    public int updateSynStockTrans(AIOStockTransRequest request) {
        return synStockTransDAO.updateSynStockTrans(request);
    }

    /**
     * getCongNo
     *
     * @param request
     * @return List<MerEntityDTO>
     */
    public List<AIOMerEntityDTO> getCongNo(SysUserRequest request) {
        return synStockTransDAO.getCongNo(request);
    }

    /**
     * count Materials
     *
     * @param request
     * @return CountConstructionTaskDTO
     */
    public AIOCountConstructionTaskDTO countMaterials(SysUserRequest request) {
        return synStockTransDAO.countMaterials(request);
    }

    /**
     * DeliveryMaterials
     *
     * @param request
     * @return int result
     * @throws ParseException
     */
    public void DeliveryMaterials(AIOStockTransRequest request, ResultInfo resultInfo) {
        boolean isInvestor = SYN_STOCK_TRAIN.equals(request.getSynStockTransDto().getStockType());
        int flag = request.getSysUserRequest().getFlag();
        Long userId = request.getSysUserRequest().getSysUserId();
        Long receiver = request.getSynStockTransDto().getReceiverId();
        Long lastShipperId = request.getSynStockTransDto().getLastShipperId();
        String confirm = request.getSynStockTransDto().getConfirm().trim();
        String state = request.getSynStockTransDto().getState().trim();
        String stockType = request.getSynStockTransDto().getStockType().trim();
//        AIOSynStockTransDetailDTO newestTransactionId = synStockTransDAO.getNewestTransactionId(request);
        //VietNT_10/08/2019_start
        String confirmDb = synStockTransDAO.getStockTransConfirm(request.getSynStockTransDto().getSynStockTransId());
        if (StringUtils.isNotEmpty(confirmDb) && !confirmDb.trim().equals("0")) {
            throw new BusinessException("Không thể thực hiện thao tác do PXK đã được Xác nhận/Từ chối!");
        }
        //VietNT_end

        if (flag == 1 && userId.compareTo(lastShipperId) == 0 && "0".equals(confirm)) {
//            StockTransDTO dto = synStockTransDAO.getStockTransStockAndBusinessType(request.getSynStockTransDto().getSynStockTransId());
//            if (dto == null) {
//                throw new BusinessException("Không tìm thấy Phiếu xuất kho!");
//            }
            StockDTO stockDTO = synStockTransDAO.getStockById(request.getSynStockTransDto().getStockReceiveId());
            if (stockDTO == null) {
                throw new BusinessException("Không tìm thấy kho nhận");
            }

            synStockTransDAO.updateStockTrans(request);
            this.insertBillImportToStock(request, stockDTO);
            resultInfo.setMessage("Xác nhận thành công");
        } else if (flag == 0 && userId.compareTo(lastShipperId) == 0 && "0".equals(confirm)) {
            //VietNT_05/07/2019_start
            StockTransDTO dto = synStockTransDAO.getStockTransStockAndBusinessType(request.getSynStockTransDto().getSynStockTransId());
            if (dto == null) {
                throw new BusinessException("Không tìm thấy Phiếu xuất kho!");
            }
            request.getSynStockTransDto().setBusinessType(dto.getBussinessType());
            int result = synStockTransDAO.updateStockTrans(request);
            if (result < 1) {
                throw new BusinessException("Cập nhật PXK thất bại!");
            }
            if (dto.getBussinessType().equals("12")) {
                StockDTO stockDTO = new StockDTO();
                stockDTO.setStockId(dto.getStockId());
                stockDTO.setCode(dto.getStockCode());
                stockDTO.setName(dto.getStockName());
                this.insertBillImportToStock(request, stockDTO);
            }
            //VietNT_end
            resultInfo.setMessage("Đã từ chối");
        }
    }

    //VietNT_20190116_start
    public DataListDTO doSearch(AIOSynStockTransDTO obj) {
        List<AIOSynStockTransDTO> dtos = synStockTransDAO.doSearch(obj);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(obj.getTotalRecord());
        dataListDTO.setSize(obj.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    /**
     * Forward SynStockTrans to group
     *
     * @param dto       dto.listToForward: list stockTrans data
     *                  dto.sysGroupId: sysGroupId forwarding to
     * @param sysUserId sysUserId execute forward
     * @throws Exception
     */
    public void doForwardGroup(AIOSynStockTransDTO dto, Long sysUserId) throws Exception {
        Long forwardToSysGroupId = dto.getSysGroupId();
        List<AIOSynStockTransDTO> listForward = dto.getListToForward();
        if (listForward == null || listForward.isEmpty()) {
            throw new BusinessException("Chưa chọn PXK");
        }

        Date today = new Date();
        for (AIOSynStockTransDTO stockTrans : listForward) {
            AIOSynStockTransDTO provinceChiefInfo = this.getProvinceChiefInfo(forwardToSysGroupId, stockTrans.getConstructionId());
            // add info to update
            provinceChiefInfo.setSynStockTransId(stockTrans.getSynStockTransId());
            provinceChiefInfo.setUpdatedBy(sysUserId);
            provinceChiefInfo.setUpdatedDate(today);
            int result = synStockTransDAO.updateForwardSynStockTrans(provinceChiefInfo);
            if (result < 1) {
                throw new BusinessException("Có lỗi xảy ra khi Chuyển đơn vị");
            }
            result = synStockTransDAO.updateConstructionForwardSynStockTrans(forwardToSysGroupId, stockTrans.getConstructionId());
            if (result < 1) {
                throw new BusinessException("Có lỗi xảy ra khi cập nhật dữ liệu Điều chuyển công trình");
            }
        }
    }

    private AIOSynStockTransDTO getProvinceChiefInfo(Long sysGroupId, Long constructionId) throws Exception {
        AIOSynStockTransDTO provinceChief;
        if (null != sysGroupId && null != constructionId) {
            provinceChief = synStockTransDAO.getProvinceChiefId(sysGroupId, constructionId);
            if (null == provinceChief
                    || provinceChief.getSysUserId() == null
                    || StringUtils.isEmpty(provinceChief.getSysUserName())) {
                throw new BusinessException("Không tìm thấy tỉnh trưởng! Thực hiện chọn lại đơn vị");
            }
        } else {
            throw new BusinessException("Không đủ thông tin để tìm kiếm tỉnh trưởng");
        }
        return provinceChief;
    }

    //VietNT_end
//    aio_20190315_start
    public List<AIOSynStockTransDTO> getListStock(SysUserRequest request) {
        return synStockTransDAO.getListStock(request);
    }

    public List<AIOSynStockTransDetailDTO> getListGood(SysUserRequest request) {
        return synStockTransDAO.getListGood(request);
    }

    /**
     * Get list goods in stock, send type
     *
     * @param request Gui len type & keyword tim kiem
     *                type 1: kho ca nhan
     *                type 2: Kho ca nhan thuoc cum doi
     *                type 3: Kho cum doi
     *                type 4: Kho CNKT
     * @return list goods in stock
     */
    public List<AIOSynStockTransDetailDTO> getListPersonWarehouse(AIOStockTransRequest request) {
        int type = request.getType();
        String keySearch = request.getKeySearch();
        Long sysUserId = request.getSysUserRequest().getSysUserId();
        if (request.getSysUserRequest() == null) {
            throw new BusinessException(AIOErrorType.NOT_AUTHORIZE.msg);
        }
        if (type < 1 || type > 4) {
            throw new BusinessException(AIOErrorType.NOT_VALID.msg);
        }
//        if (type != 1 && StringUtils.isEmpty(keySearch)) {
//            throw new BusinessException("Chưa nhập thông tin hàng hóa!");
//        }

        Long idGroupOrUser;
        String condition;
        Long idType2 = null;
        switch (type) {
            case KHO_CA_NHAN:
                idGroupOrUser = sysUserId;
                condition = "and m.stock_id in (select cat_stock_id catStockId from cat_stock where type = 4 and SYS_USER_ID = :id) ";
                break;
            case KHO_CA_NHAN_THUOC_CUM_DOI:
                idGroupOrUser = commonService.getSysGroupLevelByUserId(sysUserId, 3);
                condition = "and m.stock_id in " +
                        "(select cat_stock_id from cat_stock where cs.SYS_GROUP_LEVEL2_ID = :id ";
                if (request.getSynStockTransDto() != null) {
                    if (request.getSynStockTransDto().getSysGroupId() != null) {
                        idGroupOrUser = request.getSynStockTransDto().getSysGroupId();
                    }
                    if (request.getSynStockTransDto().getSysUserId() != null) {
                        idType2 = request.getSynStockTransDto().getSysUserId();
                        condition += "and cs.sys_user_id = :sysUserId ";
                    }
                }
                condition += "and cs.type = 4 and cs.level_stock = 4) ";
                break;
            case KHO_CUM_DOI:
                idGroupOrUser = commonService.getSysGroupLevelByUserId(sysUserId, 3);
                condition = "and m.stock_id in (select cat_stock_id from cat_stock " +
                        "where cs.SYS_GROUP_LEVEL2_ID = :id and cs.type = 4 and cs.level_stock = 3) ";
                break;
            case KHO_CNKT:
                idGroupOrUser = commonService.getSysGroupLevelByUserId(sysUserId, 2);
                condition = "and m.stock_id in (select cat_stock_id from cat_stock " +
                        "where cs.sys_group_id = :id and cs.type = 4 and cs.level_stock = 2) ";
                break;
            default:
                throw new BusinessException(AIOErrorType.NOT_VALID.msg);
        }

        return synStockTransDAO.getListPersonWarehouse(idGroupOrUser, keySearch, condition, idType2);
    }

    //VietNT_05/08/2019_start
    public AIOStockTransResponse getUserRevenue(AIOContractMobileRequest rq) {
        Date queryDate;
        if (rq.getAioContractDTO() != null && rq.getAioContractDTO().getStartDate() != null) {
            queryDate = rq.getAioContractDTO().getStartDate();
        } else {
            queryDate = new Date();
        }
        LocalDate now = LocalDate.now();
        LocalDate date = queryDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        if (now.minusMonths(12).isAfter(date) || now.isBefore(date)) {
            throw new BusinessException("Tháng không hợp lệ");
        }
        boolean getDailySalary = now.getMonthValue() == date.getMonthValue();

        AIORevenueDTO data = synStockTransDAO.countRevenue(rq.getSysUserRequest().getSysUserId(), queryDate);
        List<AIORevenueDTO> dataLst = synStockTransDAO.getListRevenue(rq.getSysUserRequest().getSysUserId(), queryDate);

        AIORevenueDTO salary = synStockTransDAO.getUserSalary(rq.getSysUserRequest().getSysUserId(), queryDate, getDailySalary);
        data.setSalaryDailyPerform(salary.getSalaryDailyPerform());
        data.setSalaryDailySale(salary.getSalaryDailySale());
        data.setSalaryMonthPerform(salary.getSalaryMonthPerform());
        data.setSalaryMonthSale(salary.getSalaryMonthSale());

        AIOStockTransResponse res = new AIOStockTransResponse();
        res.setRevenueDTO(data);
        res.setLstRevenueDTO(dataLst);

        return res;
    }

    //VietNT_end
    public void insertDeliveryBill(AIOStockTransRequest obj) {
//      return synStockTransDAO.insertDeliveryBill(dto);
        AIOSysUserDTO userInfo = synStockTransDAO.getUserInfo(obj.getSysUserRequest().getSysUserId());
        String userName = userInfo.getSysUserName();
        String sysGroupName = userInfo.getSysGroupName();
        AIOSynStockTransDTO stockTransDto = new AIOSynStockTransDTO();
        stockTransDto.setCode(obj.getSynStockTransDto().getCode());
        stockTransDto.setStockId(obj.getSynStockTransDto().getStockId());
        stockTransDto.setStockCode(obj.getSynStockTransDto().getStockCode());
        stockTransDto.setStockName(obj.getSynStockTransDto().getStockName());
        stockTransDto.setType("2");
        stockTransDto.setStatus("1");
        stockTransDto.setSignState("1");
        stockTransDto.setDescription(obj.getSynStockTransDto().getDescription());
        stockTransDto.setBussinessType("8");
        stockTransDto.setBusinessTypeName("Xuất kho nhân viên");
        stockTransDto.setApproved(0L);
        stockTransDto.setCreatedByName(userName);
        stockTransDto.setCreatedDeptId(obj.getSysUserRequest().getDepartmentId());
        stockTransDto.setCreatedDeptName(sysGroupName);
        AIOSynStockTransDTO stock = synStockTransDAO.getStockReceive(obj.getSynStockTransDto().getType(), obj.getSysUserRequest().getSysUserId());
        if (stock == null) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + " kho người nhận");
        }
        stockTransDto.setStockReceiveId(stock.getStockId());
        stockTransDto.setStockReceiveCode(stock.getStockCode());
        stockTransDto.setShipperId(obj.getSysUserRequest().getSysUserId());
        stockTransDto.setLastShipperId(obj.getSysUserRequest().getSysUserId());
        stockTransDto.setShipperName(userName);
        stockTransDto.setCreatedBy(obj.getSysUserRequest().getSysUserId());
        stockTransDto.setCreatedDate(new Date());
        stockTransDto.setDeptReceiveName(sysGroupName);
        stockTransDto.setDeptReceiveId(obj.getSysUserRequest().getDepartmentId());
        Long id = synStockTransDAO.saveObject(stockTransDto.toModel());
        commonService.validateIdCreated(id, AIOErrorType.SAVE_ERROR.msg + " PXK");

        if (obj.getLstStockTransDetail() != null && !obj.getLstStockTransDetail().isEmpty()) {
            Long idDetail;
            for (AIOSynStockTransDetailDTO dto : obj.getLstStockTransDetail()) {
                idDetail = synStockTransDAO.manualInsertStockTransDetail(id, dto.getGoodsId(), dto.getAmount());
                commonService.validateIdCreated(idDetail, AIOErrorType.SAVE_ERROR.msg + " chi tiết PXK");
            }
        } else {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + " chi tiết PXK");
        }
    }

//    aio_20190315_end
//    hoanm1_20190420_start
    public AIOSynStockTransDTO getStockExport(SysUserRequest request) {
        return synStockTransDAO.getStockExport(request);
    }

    public List<AIOSynStockTransDTO> getListUserStock(SysUserRequest request) {
        return synStockTransDAO.getListUserStock(request);
    }

    public List<AIOSynStockTransDetailDTO> getListVTTBExport(AIOStockTransRequest request) {
        return synStockTransDAO.getListVTTBExport(request);
    }

    public void insertDeliveryBillStaff(AIOStockTransRequest obj) {
        if (obj.getLstStockTransDetail() == null || obj.getLstStockTransDetail().isEmpty()) {
            throw new BusinessException(AIOErrorType.EMPTY_REQUEST.msg);
        }
        AIOSysUserDTO userInfo = synStockTransDAO.getUserInfo(obj.getSysUserRequest().getSysUserId());
        String userName = userInfo.getSysUserName();
        String sysGroupName = userInfo.getSysGroupName();
        AIOSynStockTransDTO stockReceive = synStockTransDAO.getStockReceive("4", obj.getSynStockTransDto().getSysUserIdReceive());
        if (stockReceive == null) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + " kho người nhận");
        }
        AIOSynStockTransDTO stockTransDto = new AIOSynStockTransDTO();
        stockTransDto.setCode(obj.getSynStockTransDto().getCode());
        stockTransDto.setStockId(obj.getSynStockTransDto().getStockId());
        stockTransDto.setStockCode(obj.getSynStockTransDto().getStockCode());
        stockTransDto.setStockName(obj.getSynStockTransDto().getStockName());
        stockTransDto.setType("2");
        stockTransDto.setStatus("2");
        stockTransDto.setSignState("3");
        stockTransDto.setDescription("Xuất kho giữa 2 nhân viên");
        stockTransDto.setBussinessType("12");
        stockTransDto.setBusinessTypeName("Xuất kho giữa 2 nhân viên");
        stockTransDto.setCreatedByName(userName);
        stockTransDto.setCreatedDeptId(obj.getSysUserRequest().getDepartmentId());
        stockTransDto.setCreatedDeptName(sysGroupName);
        stockTransDto.setStockReceiveId(stockReceive.getStockId());
        stockTransDto.setStockReceiveCode(stockReceive.getStockCode());
        stockTransDto.setShipperId(obj.getSynStockTransDto().getSysUserIdReceive());
        stockTransDto.setLastShipperId(obj.getSynStockTransDto().getSysUserIdReceive());
        stockTransDto.setShipperName(obj.getSynStockTransDto().getFullNameReceive());
        stockTransDto.setCreatedBy(obj.getSysUserRequest().getSysUserId());
        stockTransDto.setCreatedDate(new Date());
        stockTransDto.setDeptReceiveName(obj.getSynStockTransDto().getSysGroupNameReceive());
        stockTransDto.setDeptReceiveId(obj.getSynStockTransDto().getSysGroupIdReceive());

        stockTransDto.setRealIeTransDate(new Date());
        stockTransDto.setRealIeUserId(String.valueOf(obj.getSysUserRequest().getSysUserId()));
        stockTransDto.setRealIeUserName(userName);
        Long stockTransId = synStockTransDAO.saveObject(stockTransDto.toModel());
        commonService.validateIdCreated(stockTransId, AIOErrorType.SAVE_ERROR.msg + " PXK");

        Long idDetail;
        for (AIOSynStockTransDetailDTO dto : obj.getLstStockTransDetail()) {
            idDetail = synStockTransDAO.manualInsertStockTransDetail(stockTransId, dto.getGoodsId(), dto.getAmountReceive());
            commonService.validateIdCreated(idDetail, AIOErrorType.SAVE_ERROR.msg + " chi tiết PXK");

            List<String> serialList = dto.getLstSerial() != null ? dto.getLstSerial() : new ArrayList<>();
            Double totalPrice = (double) 0;
            if (serialList.size() > 0) {
                for (int i = 0; i < serialList.size(); i++) {
                    AIOMerEntityDTO mer = new AIOMerEntityDTO();
                    mer.setSerial(serialList.get(i));
                    mer.setStockId(obj.getSynStockTransDto().getStockId());
                    mer.setGoodsId(dto.getGoodsId());
                    mer.setState("1");
                    AIOMerEntityDTO merEntityDto = synStockTransDAO.findBySerial(mer);
                    if (merEntityDto != null) {
                        merEntityDto.setStatus("5");
                        if (merEntityDto.getExportDate() == null) {
                            merEntityDto.setExportDate(new Date());
                        }
                        merEntityDto.setUpdatedDate(new Date());
                        aioMerEntityDAO.update(merEntityDto.toModel());
                        AIOStockTransDetailSerialDTO detailSerial = synStockTransDAO.createFromMerEntity(merEntityDto, stockTransId, idDetail);
                        totalPrice = totalPrice + detailSerial.getQuantity() *
                                (detailSerial.getPrice() != null ? detailSerial.getPrice() : 0);
                        Long idDetailSerial = aioStockTransDetailSerialDAO.saveObject(detailSerial.toModel());
                    } else {
                        throw new BusinessException(AIOErrorType.GOODS_NOT_IN_STOCK.msg);
                    }
                }
            } else {
                List<AIOMerEntityDTO> availableGoods = synStockTransDAO.findByGoodsForExport(
                        dto.getGoodsId(), "1", obj.getSynStockTransDto().getStockId());
                if (availableGoods == null || availableGoods.size() == 0) {
                    throw new BusinessException(AIOErrorType.GOODS_NOT_IN_STOCK.msg);
                }
                AIOMerEntityDTO currentEntity = null;
                Double exportAmount = dto.getAmountReceive();
                Double amountSum = synStockTransDAO.findByGoodsForExportSum(dto.getGoodsId(), "1",
                        obj.getSynStockTransDto().getStockId());
                if (exportAmount - amountSum > 0) {
                    throw new BusinessException(AIOErrorType.INSUFFICIENT_GOODS_IN_STOCK.msg);
                }
                for (AIOMerEntityDTO goods : availableGoods) {
                    if (exportAmount - goods.getAmount() < 0) {
                        currentEntity = goods;
                        break;
                    }
                    exportAmount = (double) Math.round((exportAmount - goods.getAmount()) * 1000) / 1000;
                    goods.setStatus("5");
                    if (goods.getExportDate() == null) {
                        goods.setExportDate(new Date());
                    }
                    goods.setUpdatedDate(new Date());
                    aioMerEntityDAO.update(goods.toModel());

                    AIOStockTransDetailSerialDTO detailSerial =
                            synStockTransDAO.createFromMerEntity(goods, stockTransId, idDetail);
                    if (detailSerial.getPrice() == null) {
                        detailSerial.setPrice(0d);
                    }

                    totalPrice = totalPrice + detailSerial.getQuantity() * detailSerial.getPrice();
                    Long idDetailSerial = aioStockTransDetailSerialDAO.saveObject(detailSerial.toModel());
                }
                if (exportAmount > 0) {// tach ra 2 ban ghi mer entity
                    // luu lai thong tin ban ghi goc
                    Long currentId = currentEntity.getMerEntityId();
                    Long currentParrent_entity = currentEntity.getParentMerEntityId();
                    Double remainAmount = currentEntity.getAmount() - exportAmount;
                    Long currentOrderId = currentEntity.getOrderId();
                    Date currentExportDate = currentEntity.getExportDate();
                    // tach mer entity moi
                    AIOMerEntityDTO newEntity = currentEntity;
                    newEntity.setId(null);
                    newEntity.setMerEntityId(0l);
                    newEntity.setAmount(exportAmount);
                    newEntity.setParentMerEntityId(currentId);
                    newEntity.setStatus("5");
                    if (newEntity.getExportDate() == null) {
                        newEntity.setExportDate(new Date());
                    }
                    newEntity.setUpdatedDate(new Date());
                    Long idMerInsert = aioMerEntityDAO.saveObject(newEntity.toModel());
                    newEntity.setMerEntityId(idMerInsert);
                    AIOStockTransDetailSerialDTO detailSerial =
                            synStockTransDAO.createFromMerEntity(newEntity, stockTransId, idDetail);
                    Double price = detailSerial.getPrice() != null ? detailSerial.getPrice() : 0;
                    totalPrice = totalPrice + detailSerial.getQuantity() * price;
                    Long idDetailSerial = aioStockTransDetailSerialDAO.saveObject(detailSerial.toModel());

                    // update lai thong tin mer entity goc
                    currentEntity.setAmount(remainAmount);
                    currentEntity.setStatus("4");
                    currentEntity.setMerEntityId(currentId);
                    currentEntity.setParentMerEntityId(currentParrent_entity);
                    currentEntity.setOrderId(currentOrderId);
                    currentEntity.setExportDate(currentExportDate);
                    currentEntity.setUpdatedDate(new Date());
                    aioMerEntityDAO.update(currentEntity.toModel());
                }
            }
            synStockTransDAO.updateTotalPriceStockDetail(idDetail, totalPrice);

            // hoanm1_20190507_start
            AIOSynStockTransDTO stockTotal = synStockTransDAO.getStockGoodTotal(obj.getSynStockTransDto().getStockId(), dto.getGoodsId());
            if (stockTotal != null) {
                synStockTransDAO.updateStockGoodsTotal(stockTotal.getStockGoodsTotalId(),
                        stockTotal.getAmount() - dto.getAmountReceive(),
                        stockTotal.getAmountIssue() - dto.getAmountReceive());
            }
            // hoanm1_20190507_end
        }
    }
//    hoanm1_20190420_end

    //VietNT_19/09/2019_start
    public List<AIOSysGroupDTO> getListGroup(AIOContractMobileRequest rq) {
        if (rq.getSysUserRequest() != null && rq.getSysUserRequest().getSysUserId() != 0) {
            Long groupLv2 = commonService.getSysGroupLevelByUserId(rq.getSysUserRequest().getSysUserId(), 2);
            return synStockTransDAO.getListGroup(groupLv2);
        }
        return new ArrayList<>();
    }

    public List<AIOSysUserDTO> getListUserInGroup(AIOContractMobileRequest rq) {
        if (rq.getSysUserRequest() != null) {
            boolean isLevel3 = false;
            Long id;
            if (rq.getSysUserRequest().getDepartmentId() == 0) {
                id = commonService.getSysGroupLevelByUserId(rq.getSysUserRequest().getSysUserId(), 2);
            } else {
                isLevel3 = true;
                id = rq.getSysUserRequest().getDepartmentId();
            }

            return synStockTransDAO.getListUserInGroup(id, isLevel3);
        } else {
            return new ArrayList<>();
        }
    }
    //VietNT_end

//    public Long returnInsertDeliveryBillStaff(AIOStockTransRequest request) {
//        try {
//            Long result = onInsertDeliveryBillStaff(request);
//            if (result == -1L) {
//                synStockTransDAO.getSession().clear();
//                return -1L;
//            }
//            if (result == -2L) {
//                synStockTransDAO.getSession().clear();
//                return -2L;
//            }
//            if (result == -3L) {
//                synStockTransDAO.getSession().clear();
//                return -3L;
//            }
//        } catch (Exception ex) {
//            synStockTransDAO.getSession().clear();
//            return 0L;
//        }
//        return 1L;
//    }

    private Long createStockTrans(AIOStockTransRequest obj, StockDTO stockDTO) {
        AIOSysUserDTO userInfo = synStockTransDAO.getUserInfo(obj.getSysUserRequest().getSysUserId());
        if (userInfo == null) {
            throw new BusinessException(AIOErrorType.NOT_AUTHORIZE.msg);
        }
        String userName = userInfo.getSysUserName();
        String sysGroupName = userInfo.getSysGroupName();

        AIOSynStockTransDTO stockTransDto = new AIOSynStockTransDTO();
        // stockTransDto.setCode(obj.getSynStockTransDto().getCode());
        Long sequence = synStockTransDAO.getSequenceStock();
        stockTransDto.setCode("PNK_" + stockDTO.getCode() + "/19/" + sequence);
        stockTransDto.setType("1");
        stockTransDto.setStockId(stockDTO.getStockId());
        stockTransDto.setStockCode(stockDTO.getCode());
        stockTransDto.setStockName(stockDTO.getName());
        stockTransDto.setStatus("2");
        stockTransDto.setSignState("3");
        stockTransDto.setFromStockTransId(obj.getSynStockTransDto().getSynStockTransId());
        stockTransDto.setDescription("Nhập kho nhân viên");
        stockTransDto.setCreatedByName(userName);
        stockTransDto.setCreatedDeptId(obj.getSysUserRequest().getDepartmentId());
        stockTransDto.setCreatedDeptName(sysGroupName);
        stockTransDto.setRealIeTransDate(new Date());
        stockTransDto.setRealIeUserId(String.valueOf(obj.getSysUserRequest().getSysUserId()));
        stockTransDto.setRealIeUserName(userName);
        stockTransDto.setShipperId(obj.getSysUserRequest().getSysUserId());
        stockTransDto.setShipperName(userName);
        stockTransDto.setCreatedBy(obj.getSysUserRequest().getSysUserId());
        stockTransDto.setCreatedDate(new Date());
        stockTransDto.setBusinessTypeName("Nhập kho nhân viên");
        stockTransDto.setDeptReceiveName(sysGroupName);
        stockTransDto.setDeptReceiveId(obj.getSysUserRequest().getDepartmentId());
        stockTransDto.setBussinessType("8");
        return synStockTransDAO.saveObject(stockTransDto.toModel());
    }

    private AIOSynStockTransDetailDTO toAIOSynStockTransDetailDTO(Long stockTransId, AIOSynStockTransDetailDTO dto) {
        AIOSynStockTransDetailDTO dtoDetail = new AIOSynStockTransDetailDTO();
        dtoDetail.setStockTransId(stockTransId);
        dtoDetail.setOrderId(dto.getOrderId());
        dtoDetail.setGoodsType(dto.getGoodsType());
        dtoDetail.setGoodsTypeName(dto.getGoodsTypeName());
        dtoDetail.setGoodsId(dto.getGoodsId());
        dtoDetail.setGoodsCode(dto.getGoodsCode());
        dtoDetail.setGoodsIsSerial(dto.getGoodsIsSerial());
        dtoDetail.setGoodsState(dto.getGoodsState());
        dtoDetail.setGoodsStateName(dto.getGoodsStateName());
        dtoDetail.setGoodsName(dto.getGoodsNameImport());
        dtoDetail.setGoodsUnitId(dto.getGoodsUnitId());
        dtoDetail.setGoodsUnitName(dto.getGoodsUnitName());
        dtoDetail.setAmountOrder(dto.getAmountOrder());
        dtoDetail.setAmountReal(dto.getAmountOrder());
        dtoDetail.setTotalPrice(dto.getTotalPrice());
        return dtoDetail;
    }

    private AIOStockGoodsTotalDTO toAioStockGoodsTotalDTO(StockDTO stockDTO, AIOSynStockTransDetailDTO detailDTO) {
        AIOStockGoodsTotalDTO dtoTotal = new AIOStockGoodsTotalDTO();
        dtoTotal.setStockId(stockDTO.getStockId());
        dtoTotal.setStockCode(stockDTO.getCode());
        dtoTotal.setGoodsId(detailDTO.getGoodsId());
        dtoTotal.setGoodsState(detailDTO.getGoodsState());
        dtoTotal.setGoodsStateName(detailDTO.getGoodsStateName());
        dtoTotal.setGoodsCode(detailDTO.getGoodsCode());
        dtoTotal.setGoodsName(detailDTO.getGoodsNameImport());
        dtoTotal.setStockName(stockDTO.getName());
        dtoTotal.setGoodsTypeName(detailDTO.getGoodsTypeName());
        dtoTotal.setGoodsType(Long.parseLong(detailDTO.getGoodsType()));
        dtoTotal.setGoodsIsSerial(detailDTO.getGoodsIsSerial());
        dtoTotal.setGoodsUnitId(detailDTO.getGoodsUnitId());
        dtoTotal.setGoodsUnitName(detailDTO.getGoodsUnitName());
        dtoTotal.setAmount(detailDTO.getAmountOrder());
        dtoTotal.setChangeDate(new Date());
        dtoTotal.setAmountIssue(detailDTO.getAmountOrder());
        return dtoTotal;
    }

    private void createStockTransDetails(Long stockTransId, List<AIOSynStockTransDetailDTO> stockTransDetailDTOS,
                                         StockDTO stockDTO) {
        logger.info("stockTransId: " + stockTransId);
        logger.info("stockTransDetailDTOS: " + this.toJson(stockTransDetailDTOS));
        logger.info("stockDTO: " + this.toJson(stockDTO));

        for (AIOSynStockTransDetailDTO detailDTO : stockTransDetailDTOS) {
            AIOSynStockTransDetailDTO dtoDetail = this.toAIOSynStockTransDetailDTO(stockTransId, detailDTO);
            logger.info("stockTransDetail info: " + this.toJson(dtoDetail));

            Long idDetail = aioStockTransDetailDAO.saveObject(dtoDetail.toModel());
            logger.info("result stockTransDetail: " + idDetail);
            commonService.validateIdCreated(idDetail, AIOErrorType.SAVE_ERROR.msg + ": chi tiết PXK");

            List<AIOStockTransDetailSerialDTO> getListDetailSerial = synStockTransDAO.getListDetailSerial(detailDTO.getSynStockTransDetailId());
            int resultUpdate;
            for (AIOStockTransDetailSerialDTO bo : getListDetailSerial) {
                bo.setStockTransId(stockTransId);
                bo.setStockTransDetailId(idDetail);
                Long idDetailSerial = aioStockTransDetailSerialDAO.saveObject(bo.toModel());
                commonService.validateIdCreated(idDetailSerial, AIOErrorType.SAVE_ERROR.msg + ": chi tiết PXK serial");

                // update merEntity
                resultUpdate = synStockTransDAO.updateMerStockId(bo.getMerEntityId(), stockDTO.getStockId());
                commonService.validateIdCreated(resultUpdate, AIOErrorType.ACTION_FAILED.msg + ": cập nhật mer");
            }

            // tinh lai apply_price
            resultUpdate = synStockTransDAO.recalculateApplyPrice(detailDTO.getGoodsId(), stockDTO.getStockId());
            commonService.validateIdCreated(resultUpdate, AIOErrorType.ACTION_FAILED.msg + ": cập nhật apply price");

            // check exit stock_goods_total
            AIOSynStockTransDTO stockTotal = synStockTransDAO.getStockGoodTotal(stockDTO.getStockId(), detailDTO.getGoodsId());
            if (stockTotal != null) {
                resultUpdate = synStockTransDAO.updateStockGoodsTotalAmount(
                        stockTotal.getStockGoodsTotalId(),
                        stockTotal.getAmount(),
                        stockTotal.getAmountIssue(),
                        detailDTO.getAmountOrder());
                commonService.validateIdCreated(resultUpdate, AIOErrorType.ACTION_FAILED.msg + ": cập nhật stockGoodsTotal");
            } else {
                AIOStockGoodsTotalDTO dtoTotal = this.toAioStockGoodsTotalDTO(stockDTO, detailDTO);
                Long idTotal = aioStockGoodsTotalDAO.saveObject(dtoTotal.toModel());
                commonService.validateIdCreated(idTotal, AIOErrorType.SAVE_ERROR.msg + ": hàng tồn kho");
            }
        }
    }

    private void insertBillImportToStock(AIOStockTransRequest obj, StockDTO stockDTO) {
        logger.info(" ===== INSERT BILL ===== ");
        logger.info("request: " + this.toJson(obj));

        Long stockTransId = this.createStockTrans(obj, stockDTO);
        commonService.validateIdCreated(stockTransId, AIOErrorType.SAVE_ERROR.msg + ": PXK");
        logger.info("result created stockTrans: " + stockTransId);

        if (obj.getLstStockTransDetail() != null && !obj.getLstStockTransDetail().isEmpty()) {
            this.createStockTransDetails(stockTransId, obj.getLstStockTransDetail(), stockDTO);
        } else {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + " pxk ");
        }
    }

    private <T> String toJson(T res) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        try {
            return mapper.writeValueAsString(res);
        } catch (Exception e) {
            return StringUtils.EMPTY;
        }
    }
}
