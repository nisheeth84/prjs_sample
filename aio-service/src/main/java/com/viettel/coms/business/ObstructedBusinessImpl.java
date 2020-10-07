package com.viettel.coms.business;

import com.viettel.coms.bo.ObstructedBO;
import com.viettel.coms.dao.ObstructedDAO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.ObstructedDTO;
import com.viettel.coms.dto.ObstructedDetailDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("obstructedBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ObstructedBusinessImpl extends BaseFWBusinessImpl<ObstructedDAO, ObstructedDTO, ObstructedBO>
        implements ObstructedBusiness {

    @Autowired
    private ObstructedDAO obstructedDAO;
    @Autowired
    private UtilAttachDocumentDAO utilAttachDocumentDAO;

    public ObstructedBusinessImpl() {
        tModel = new ObstructedBO();
        tDAO = obstructedDAO;
    }

    @Override
    public ObstructedDAO gettDAO() {
        return obstructedDAO;
    }

    @Override
    public long count() {
        return obstructedDAO.count("ObstructedBO", null);
    }

    public ObstructedDetailDTO getAttachFileById(Long id) throws Exception {
        // TODO Auto-generated method stub
        ObstructedDetailDTO data = new ObstructedDetailDTO();
        data.setListFileVuong(utilAttachDocumentDAO.getByTypeAndObject(id, 43L));
        return data;
    }

}
