package com.viettel.coms.business;

import com.viettel.asset.dto.ResultInfo;
import com.viettel.coms.bo.SynStockTransBO;
import com.viettel.coms.dao.AssignHandoverDAO;
import com.viettel.coms.dao.SynStockTransDAO;
import com.viettel.coms.dto.*;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;

/**
 * @author CuongNV2
 * @version 1.0
 * @since 2018-06-15
 */
@Service("synStockTransBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class SynStockTransBusinessImpl extends BaseFWBusinessImpl<SynStockTransDAO, SynStockTransDTO, SynStockTransBO>
        implements SynStockTransBusiness {

    private static final String SYN_STOCK_TRAIN = "A";
    //VietNT_20190125_start
    private final String REJECT_NOTE_PERMISSION = "REJECT NOTE";

    @Autowired
    private AssignHandoverDAO assignHandoverDAO;
    //VietNT_end

    @Autowired
    private SynStockTransDAO synStockTransDAO;

    public SynStockTransBusinessImpl() {
        tModel = new SynStockTransBO();
        tDAO = synStockTransDAO;
    }

    @Override
    public SynStockTransDAO gettDAO() {
        return synStockTransDAO;
    }

    @Override
    public long count() {
        return synStockTransDAO.count("SynStockTransBO", null);
    }

    /**
     * getCountContructionTask
     *
     * @param request
     * @return CountConstructionTaskDTO
     */
    public CountConstructionTaskDTO getCountContructionTask(SysUserRequest request) {
        return synStockTransDAO.getCount(request);
    }

    /**
     * getListSysStockTransDTO
     *
     * @param request
     * @return List<SynStockTransDTO>
     */
    public List<SynStockTransDTO> getListSysStockTransDTO(StockTransRequest request) {
        return synStockTransDAO.getListSysStockTransDTO(request);
    }

    /**
     * getListSynStockTransDetail
     *
     * @param st
     * @return List<SynStockTransDetailDTO>
     */
    public List<SynStockTransDetailDTO> getListSynStockTransDetail(SynStockTransDTO st) {
        return synStockTransDAO.getListSysStockTransDetailDTO(st);
    }

    /**
     * getListMerEntityDto
     *
     * @param request
     * @return List<MerEntityDTO>
     */
    public List<MerEntityDTO> getListMerEntityDto(StockTransRequest request) {
        return synStockTransDAO.getListMerEntity(request);
    }

    /**
     * updateStockTrans
     *
     * @param request
     * @return int result
     */
    public int updateStockTrans(StockTransRequest request) {
        return synStockTransDAO.updateStockTrans(request);
    }

    /**
     * updateSynStockTrans
     *
     * @param request
     * @return int result
     */
    public int updateSynStockTrans(StockTransRequest request) {
        return synStockTransDAO.updateSynStockTrans(request);
    }

    /**
     * getCongNo
     *
     * @param request
     * @return List<MerEntityDTO>
     */
    public List<MerEntityDTO> getCongNo(SysUserRequest request) {
        return synStockTransDAO.getCongNo(request);
    }

    /**
     * count Materials
     *
     * @param request
     * @return CountConstructionTaskDTO
     */
    public CountConstructionTaskDTO countMaterials(SysUserRequest request) {
        return synStockTransDAO.countMaterials(request);
    }

    /**
     * DeliveryMaterials
     *
     * @param request
     * @return int result
     * @throws ParseException
     */
    public int DeliveryMaterials(StockTransRequest request, ResultInfo resultInfo) throws ParseException {
        boolean isInvestor = SYN_STOCK_TRAIN.equals(request.getSynStockTransDto().getStockType());
        int flag = request.getSysUserRequest().getFlag();
        Long userId = request.getSysUserRequest().getSysUserId();
        Long receiver = request.getSynStockTransDto().getReceiverId();
        Long lastShipperId = request.getSynStockTransDto().getLastShipperId();
        String confirm = request.getSynStockTransDto().getConfirm().trim();
        String state = request.getSynStockTransDto().getState().trim();
        String stockType = request.getSynStockTransDto().getStockType().trim();
        SynStockTransDetailDTO newestTransactionId = synStockTransDAO.getNewestTransactionId(request);

        if (flag == 1 && userId.compareTo(lastShipperId) == 0 && "0".equals(confirm) && receiver == null) {
            if ("A".equals(stockType)) {
                synStockTransDAO.updateSynStockTrans(request);
            } else {
                synStockTransDAO.updateStockTrans(request);
            }
            //VietNT_20190128_start
//            SynStockTransDTO dto = request.getSynStockTransDto();
            // check: shipperId = lastShipperId && type = 2 && businessType = 1
//            if (dto.getShipperId().compareTo(dto.getLastShipperId()) == 0
//                    && dto.getType().equals("2")
//                    && dto.getBussinessType().equals("1")) {
//                synStockTransDAO.updateConfirmDateFirstTime(dto.getStockTransId());
//            }
//            if (StringUtils.isNotEmpty(dto.getCode())) {
//                synStockTransDAO.updateSynStockDailyImportExport(dto.getCode());
//            }
            //VietNT_end
            resultInfo.setMessage("Xác nhận thành công");
            return 1;

        } else if (flag == 0 && userId.compareTo(lastShipperId) == 0 && "0".equals(confirm)) {
            if ("A".equals(stockType)) {
                synStockTransDAO.updateSynStockTrans(request);
                //VietNT_20190125_start
                if (userId.compareTo(lastShipperId) == 0 && receiver == null) {
                	SynStockTransDTO userInfo = synStockTransDAO.getUserTTKTProvince(lastShipperId, request.getSynStockTransDto().getConsCode());
                	if (userInfo != null && userInfo.getSysUserId() != null) {
                		synStockTransDAO.updateLastShipperSynStockTrans(userInfo.getSysUserId(), request.getSynStockTransDto().getSynStockTransId());
                	}
                }
                this.sendSmsReject(request.getSynStockTransDto(), userId);
    	        //VietNT_end
            } else {
                synStockTransDAO.updateStockTrans(request);
            }
           
            resultInfo.setMessage("Đã từ chối");
            return 1;

        } else {
            SysUserRequest sysUserReceiver = request.getSysUserReceiver();
            if ((sysUserReceiver != null && flag == 2 && lastShipperId.compareTo(userId) == 0 && receiver == null
                    && "1".equals(confirm.trim()))
                    || (sysUserReceiver != null && flag == 2 && receiver != null && "2".equals(state)
                    && lastShipperId.compareTo(userId) == 0)
                    || (sysUserReceiver != null && flag == 2 && lastShipperId.compareTo(receiver) == 0
                    && lastShipperId.compareTo(userId) == 0 && "1".equals(state))) {

                synStockTransDAO.UpdateStockTransState(request);
                synStockTransDAO.SaveStTransaction(request);
                resultInfo.setMessage("Thực hiện bàn giao thành công");
                return 1;

            } else if (flag == 0 && lastShipperId.compareTo(receiver) != 0 && userId.compareTo(receiver) == 0
                    && "0".equals(state)) {
                synStockTransDAO.UpdateStocktrainByReceiver(request);
                synStockTransDAO.UpdateStocktrainHistoryByRefusedByReceiver(request, isInvestor, newestTransactionId);
                resultInfo.setMessage("Đã từ chối");
                return 1;

            } else if (flag == 1 && lastShipperId.compareTo(receiver) != 0 && userId.compareTo(receiver) == 0
                    && "0".equals(state)) {
                synStockTransDAO.UpdateStocktrainConfirmByReceiver(request);
                synStockTransDAO.UpdateStocktrainConfirmByLastShipper(request, isInvestor, newestTransactionId);
                resultInfo.setMessage("Đã tiếp nhận");
                return 1;
            }
        }
        return 0;
    }
    //VietNT_20190125_start
    private void sendSmsReject(SynStockTransDTO dto, Long rejectUserId) {
    	if (dto == null || dto.getLastShipperId() == null || rejectUserId == null) {
    		return;
    	}

        List<SysUserDTO> users = synStockTransDAO.findUsersWithPermission(REJECT_NOTE_PERMISSION, null);
        if (users == null || users.isEmpty()) {
        	return;
        }

        SynStockTransDTO lastShipperInfo = synStockTransDAO.getRejectorInfo(dto.getLastShipperId());

        String subject = "Thông báo từ chối nhận phiếu xuất kho A cấp";
        String content = lastShipperInfo.getSysUserName() + " - " + lastShipperInfo.getCustomField() +
                " đã từ chối phiếu xuất kho \"" + dto.getCode() +
                "\" của công trình: \"" + dto.getConsCode() + "\".";
        Date today = new Date();

        for (SysUserDTO user : users) {
            assignHandoverDAO.insertIntoSendSmsEmailTable(user, subject, content, rejectUserId, today);
        }
    }
    //VietNT_end

    //VietNT_20190116_start
    public DataListDTO doSearch(SynStockTransDTO obj) {
        List<SynStockTransDTO> dtos = synStockTransDAO.doSearch(obj);
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
    public void doForwardGroup(SynStockTransDTO dto, Long sysUserId) throws Exception {
        Long forwardToSysGroupId = dto.getSysGroupId();
        List<SynStockTransDTO> listForward = dto.getListToForward();
        if (listForward == null || listForward.isEmpty()) {
            throw new BusinessException("Chưa chọn PXK");
        }

        Date today = new Date();
        for (SynStockTransDTO stockTrans : listForward) {
            SynStockTransDTO provinceChiefInfo = this.getProvinceChiefInfo(forwardToSysGroupId, stockTrans.getConstructionId());
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

    private SynStockTransDTO getProvinceChiefInfo(Long sysGroupId, Long constructionId) throws Exception {
        SynStockTransDTO provinceChief;
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
}
