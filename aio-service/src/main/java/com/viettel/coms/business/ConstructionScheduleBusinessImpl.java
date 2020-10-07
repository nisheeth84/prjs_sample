package com.viettel.coms.business;

import com.viettel.coms.bo.ConstructionScheduleBO;
import com.viettel.coms.dao.ConstructionScheduleDAO;
import com.viettel.coms.dto.*;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("constructionScheduleBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ConstructionScheduleBusinessImpl
        extends BaseFWBusinessImpl<ConstructionScheduleDAO, ConstructionScheduleDTO, ConstructionScheduleBO>
        implements ConstructionScheduleBusiness {

    public static final String MANAGE_PLAN = "MANAGE PLAN";

    @Autowired
    private ConstructionScheduleDAO constructionScheduleDAO;

    /**
     * getOtherValue
     *
     * @param valueToInitContructionManagementItem
     * @param request
     * @param isManage
     * @return List<ConstructionScheduleItemDTO>
     */
    private List<ConstructionScheduleItemDTO> getOtherValue(
            List<ConstructionScheduleItemDTO> valueToInitContructionManagementItem,
            ConstructionScheduleDTORequest request, List<DomainDTO> isManage) {
        Long state;
        Long userId = request.getSysUserRequest().getSysUserId();

        for (ConstructionScheduleItemDTO ScheduleItem : valueToInitContructionManagementItem) {
            state = constructionScheduleDAO.getCompleteState(ScheduleItem, userId, isManage);
            ScheduleItem.setCompleteState(state);
        }
        return valueToInitContructionManagementItem;
    }

    /**
     * InitContructionManagement (công trình)
     *
     * @param request
     * @param tabNumb
     * @param response
     * @return List<ConstructionScheduleDTO>
     */
    public List<ConstructionScheduleDTO> getValueToInitContruction(ConstructionScheduleDTORequest request,
                                                                   String tabNumb, ConstructionScheduleDTOResponse response) {
        List<DomainDTO> isManage = constructionScheduleDAO.getByAdResource(request.getSysUserRequest().getSysUserId(),
                MANAGE_PLAN);
        if (isManage.size() > 0) {
            SysUserRequest sysUser = new SysUserRequest();
            sysUser.setAuthorities(MANAGE_PLAN);
            response.setSysUser(sysUser);
        }
        return constructionScheduleDAO.getValueToInitContruction(request, tabNumb, isManage);
    }

    /**
     * InitContructionManagement (hạng mục)
     *
     * @param request
     * @return
     */
    public List<ConstructionScheduleItemDTO> getValueToInitContructionManagementItem(
            ConstructionScheduleDTORequest request) {
        // check and get list domain by sysUserId
        List<DomainDTO> isManage = constructionScheduleDAO.getByAdResource(request.getSysUserRequest().getSysUserId(),
                MANAGE_PLAN);
//		return getOtherValue(constructionScheduleDAO.getValueToInitContructionManagementItem(request, isManage), request, isManage);
        return constructionScheduleDAO.getValueToInitContructionManagementItem(request, isManage);
    }

    /**
     * ConstructionScheduleWorkItem (công việc)
     *
     * @param request
     * @return
     */
    public List<ConstructionScheduleWorkItemDTO> getValueToInitConstructionScheduleWorkItemDTO(
            ConstructionScheduleDTORequest request) {
        // check and get list domain
        List<DomainDTO> isManage = constructionScheduleDAO.getByAdResource(request.getSysUserRequest().getSysUserId(),
                MANAGE_PLAN);
        return constructionScheduleDAO.getValueToInitConstructionScheduleWorkItemDTO(request, isManage);
    }

    /**
     * getUnCompletedTask
     *
     * @param request
     * @param constructionSchedule
     * @param typeNumb
     * @return
     */
    public Long getUnCompletedTask(ConstructionScheduleDTORequest request, ConstructionScheduleDTO constructionSchedule,
                                   String typeNumb) {
        // check and get list domain
        List<DomainDTO> isManage = constructionScheduleDAO.getByAdResource(request.getSysUserRequest().getSysUserId(),
                MANAGE_PLAN);
        return constructionScheduleDAO.getUnCompletedTask(request, constructionSchedule, typeNumb, isManage);
    }

    /**
     * getTotalTask
     *
     * @param request
     * @param constructionSchedule
     * @param typeNumb
     * @return
     */
    public Long getTotalTask(ConstructionScheduleDTORequest request, ConstructionScheduleDTO constructionSchedule,
                             String typeNumb) {
        // check and get list domain
        List<DomainDTO> isManage = constructionScheduleDAO.getByAdResource(request.getSysUserRequest().getSysUserId(),
                MANAGE_PLAN);
        return constructionScheduleDAO.getTotalTask(request, constructionSchedule, typeNumb, isManage);
    }

    /**
     * check and get list domain
     *
     * @param request
     * @param tabNumb
     * @return
     */
    public List<DomainDTO> getByAdResource(ConstructionScheduleDTORequest request, String tabNumb) {
        return constructionScheduleDAO.getByAdResource(request.getSysUserRequest().getSysUserId(), MANAGE_PLAN);
    }

    /**
     * handlingByOtherPerson
     *
     * @param request
     * @return
     */
    public int handlingByOtherPerson(ConstructionScheduleDTORequest request) {
        int result = 0;

        if (constructionScheduleDAO.handlingByOtherPerson(request) > 0) {
            result++;
        } else {
            return result;
        }

        if (constructionScheduleDAO.handlingByOtherPersonWorkItem(request) > 0) {
            result++;
        } else {
            return result;
        }

        return result;
    }

    //	chinhpxn20180720_start
    public int createSendSmsEmail(ConstructionScheduleItemDTO request, String sysGroupId, Long sysUserId,
                                  Long newPerformerId) {
        return constructionScheduleDAO.createSendSmsEmail(request, sysGroupId, sysUserId, newPerformerId);
    }

    public int createSendSmsEmailToConvert(ConstructionScheduleItemDTO request, String sysGroupId, Long sysUserId,
                                           Long oldPerformerId) {
        return constructionScheduleDAO.createSendSmsEmailToConvert(request, sysGroupId, sysUserId, oldPerformerId);
    }

    public int createSendSmsEmailToOperator(ConstructionScheduleItemDTO request, String sysGroupId, Long sysUserId,
                                            Long newPerformerId, Long oldPerformerId) {
        return constructionScheduleDAO.createSendSmsEmailToOperator(request, sysGroupId, sysUserId, newPerformerId,
                oldPerformerId);
    }

    //	chinhpxn20180720_end
//	hoanm1_20180824_start
    public List<ConstructionScheduleDTO> getValueToInitContructionTurning(ConstructionScheduleDTORequest request,
                                                                          String tabNumb, ConstructionScheduleDTOResponse response) {
        List<DomainDTO> isManage = constructionScheduleDAO.getByAdResource(request.getSysUserRequest().getSysUserId(),
                MANAGE_PLAN);
        if (isManage.size() > 0) {
            SysUserRequest sysUser = new SysUserRequest();
            sysUser.setAuthorities(MANAGE_PLAN);
            response.setSysUser(sysUser);
        }
        return constructionScheduleDAO.getValueToInitContructionTurning(request, tabNumb, isManage);
    }
//	hoanm1_20180824_end
//	hoanm1_20180829_start
    public List<ConstructionScheduleItemDTO> getChartWorkItem(ConstructionScheduleDTORequest request) {
        return constructionScheduleDAO.getChartWorkItem(request);
    }
//	hoanm1_20180829_start
}
