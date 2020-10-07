package com.viettel.asset.business;

import com.viettel.asset.bo.SysUser;
import com.viettel.asset.bo.VSysUser;
import com.viettel.asset.dao.SysUserDao;
import com.viettel.asset.dao.VSysUserDao;
import com.viettel.asset.dto.VSysUserDto;
import com.viettel.erp.dao.CatEmployeeDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = false, rollbackFor = Exception.class)
public class SysUserBusiness {

    @Autowired
    SysUserDao sysUserDao;
    @Autowired
    VSysUserDao vSysUserDao;

    @Autowired
    CatEmployeeDAO catEmployeeDAO;


    public SysUser find(Long id) {
        return sysUserDao.find(id);
    }

    public SysUser getByLoginName(String name) {
        List<SysUser> lst = sysUserDao.find(SysUser.Columns.LOGIN_NAME, name);
        return lst.get(0);
    }

    public VSysUser getVSysUserByLoginName(String name) {
        return vSysUserDao.getVSysUserByLoginName(name);
    }


    public VSysUserDto getVSysUserByLogiNameHcqt(String loginName) {
        VSysUser sysUser = vSysUserDao.getVSysUserByLoginName(loginName);
        VSysUserDto dto = new VSysUserDto(sysUser);
        if (dto.getUserId() != null) {
            VSysUser temp = vSysUserDao.getCatEmployeeInfoByUserId(sysUser.getUserId());
            if (temp != null && temp.getCatEmployeeId() != null) {
                dto.setCatEmployeeId(temp.getCatEmployeeId());
                dto.setFullName(temp.getFullName());
            }
        }
        return dto;
//		return vSysUserDao.getVSysUserByLogiNameHcqt(name);			

    }
}
