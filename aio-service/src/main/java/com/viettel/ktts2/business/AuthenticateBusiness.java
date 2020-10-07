package com.viettel.ktts2.business;

import com.viettel.ktts2.dao.AuthenticateDao;
import com.viettel.ktts2.dto.KttsSysUserDto;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;


@Service
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
@Transactional
public class AuthenticateBusiness extends BaseFWBusinessImpl {
    @Autowired
    AuthenticateDao authenticateDao;

    public KttsSysUserDto getKttsSysUserById(Long sysUserId) {
        return authenticateDao.getKttsSysUserById(sysUserId);
    }
}
