package com.viettel.coms.business;

import com.viettel.coms.bo.TmpnMaterialBO;
import com.viettel.coms.dao.TmpnMaterialDAO;
import com.viettel.coms.dto.TmpnMaterialDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("tmpnMaterialBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class TmpnMaterialBusinessImpl extends BaseFWBusinessImpl<TmpnMaterialDAO, TmpnMaterialDTO, TmpnMaterialBO>
        implements TmpnMaterialBusiness {

    @Autowired
    private TmpnMaterialDAO tmpnMaterialDAO;

    public TmpnMaterialBusinessImpl() {
        tModel = new TmpnMaterialBO();
        tDAO = tmpnMaterialDAO;
    }

    @Override
    public TmpnMaterialDAO gettDAO() {
        return tmpnMaterialDAO;
    }

    @Override
    public long count() {
        return tmpnMaterialDAO.count("TmpnMaterialBO", null);
    }

}
