package com.viettel.coms.business;

import com.viettel.coms.bo.AssetManageRequestEntityBO;
import com.viettel.coms.dao.AssetManageRequestEntityDAO;
import com.viettel.coms.dto.AssetManageRequestEntityDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("assetManageRequestEntityBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AssetManageRequestEntityBusinessImpl
        extends BaseFWBusinessImpl<AssetManageRequestEntityDAO, AssetManageRequestEntityDTO, AssetManageRequestEntityBO>
        implements AssetManageRequestEntityBusiness {

    @Autowired
    private AssetManageRequestEntityDAO assetManageRequestEntityDAO;

    public AssetManageRequestEntityBusinessImpl() {
        tModel = new AssetManageRequestEntityBO();
        tDAO = assetManageRequestEntityDAO;
    }

    @Override
    public AssetManageRequestEntityDAO gettDAO() {
        return assetManageRequestEntityDAO;
    }

    @Override
    public long count() {
        return assetManageRequestEntityDAO.count("AssetManageRequestEntityBO", null);
    }

}
