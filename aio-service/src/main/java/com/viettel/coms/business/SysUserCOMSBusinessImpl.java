package com.viettel.coms.business;

import com.viettel.aio.dao.AIOSysUserDAO;
import com.viettel.asset.dto.BaseWsRequest;
import com.viettel.coms.bo.SysUserCOMSBO;
import com.viettel.coms.dao.ConstructionScheduleDAO;
import com.viettel.coms.dao.SysUserCOMSDAO;
import com.viettel.coms.dto.DomainDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.coms.dto.SysUserRequest;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.List;

@Service("sysUserwmsBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class SysUserCOMSBusinessImpl extends BaseFWBusinessImpl<SysUserCOMSDAO, SysUserCOMSDTO, SysUserCOMSBO>
        implements SysUserCOMSBusiness {

    @Autowired
    private SysUserCOMSDAO sysUserQLKDAO;

    @Autowired
    private ConstructionScheduleDAO constructionScheduleDAO;

    public static final String MANAGE_PLAN = "MANAGE PLAN";

    public SysUserCOMSBusinessImpl() {
        tModel = new SysUserCOMSBO();
        tDAO = sysUserQLKDAO;
    }

    @Override
    public SysUserCOMSDAO gettDAO() {
        return sysUserQLKDAO;
    }

    @Override
    public long count() {
        return sysUserQLKDAO.count("SysUserwmsBO", null);
    }

    public List<SysUserCOMSDTO> getForAutoComplete(SysUserCOMSDTO obj) {
        return sysUserQLKDAO.getForAutoComplete(obj);
    }

    public List<SysUserCOMSDTO> getSuppervisorAutoComplete(SysUserCOMSDTO obj) {
        return sysUserQLKDAO.getSuppervisorAutoComplete(obj);
    }

    public List<SysUserCOMSDTO> getDirectorAutoComplete(SysUserCOMSDTO obj) {
        return sysUserQLKDAO.getDirectorAutoComplete(obj);
    }

    public DataListDTO doSearchUserInPopup(SysUserCOMSDTO obj) {
        List<SysUserCOMSDTO> ls = sysUserQLKDAO.doSearchUserInPopup(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

    public DataListDTO doSearchSuppervisorInPopup(SysUserCOMSDTO obj) {
        List<SysUserCOMSDTO> ls = sysUserQLKDAO.doSearchSuppervisorInPopup(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

    public DataListDTO doSearchDirectorInPopup(SysUserCOMSDTO obj) {
        List<SysUserCOMSDTO> ls = sysUserQLKDAO.doSearchDirectorInPopup(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

    public SysUserCOMSDTO getUserInfoByLoginName(String loginName) {
        return sysUserQLKDAO.getUserInfoByLoginName(loginName);
    }

    public Object getForAutoCompleteInSign(SysUserCOMSDTO obj) {
        // TODO Auto-generated method stub
        return sysUserQLKDAO.getForAutoCompleteInSign(obj);
    }

    public SysUserCOMSDTO getSysUserByEmployee(String employeeId) {
        return sysUserQLKDAO.getSysUserByEmployeeCode(employeeId);
    }

    public int RegisterLoginTime(SysUserCOMSDTO userDto) {
        try {
            return sysUserQLKDAO.RegisterLoginTime(userDto);
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return 0;
    }
//    hoanm1_20180916_start
    public int RegisterLoginWeb(SysUserCOMSDTO userDto) {
        try {
            return sysUserQLKDAO.RegisterLoginWeb(userDto);
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return 0;
    }
//    hoanm1_20180916_end
    // chinhpxn20180716_start
    @SuppressWarnings("unchecked")
    public List<SysUserCOMSDTO> usersFillter(List<String> sysGroupId) {
        return sysUserQLKDAO.usersFillter(sysGroupId);
    }
    // chinhpxn20180716_end

    // Service Mobile

    public List<SysUserCOMSDTO> getListUserByDepartment(SysUserRequest request) {
        if ("MANAGE PLAN".equals(request.getAuthorities())) {
            List<DomainDTO> isManage = constructionScheduleDAO.getByAdResource(request.getSysUserId(), MANAGE_PLAN);
            return sysUserQLKDAO.getListUserByManagePlan(request, isManage);
        } else
            return sysUserQLKDAO.getListUser(request);
    }

    public int LoginBusiness(BaseWsRequest request) {
        return sysUserQLKDAO.Login(request);
    }

    public List<SysUserCOMSDTO> getUserByUsernamePassword(BaseWsRequest request) {
        return sysUserQLKDAO.getUserByUsernamePassword(request);
    }

    //VietNT_16/09/2019_start
    public SysUserCOMSDTO getUserCTV(String username) {
        return sysUserQLKDAO.getUserCTV(username);
    }
    //VietNT_end
}
