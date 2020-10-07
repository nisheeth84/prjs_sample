package com.viettel.coms.business;

import com.viettel.coms.dao.AppVersionDAO;
import com.viettel.coms.dto.AppVersionBO;
import com.viettel.coms.dto.AppVersionDTO;
import com.viettel.coms.dto.AppVersionWorkItemDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("appVersionBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AppVersionBusinessImpl extends BaseFWBusinessImpl<AppVersionDAO, AppVersionDTO, AppVersionBO>
        implements IssueBusiness {
    @Autowired
    AppVersionDAO appVersionDAO;

    public List<AppVersionWorkItemDTO> getAppVersion() {
        List<AppVersionWorkItemDTO> appVersionItem = appVersionDAO.getVersionItem();
        return appVersionItem;
    }

}
