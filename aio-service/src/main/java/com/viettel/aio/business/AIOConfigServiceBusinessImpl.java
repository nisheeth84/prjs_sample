package com.viettel.aio.business;

import com.viettel.aio.bo.AIOErrorBO;
import com.viettel.aio.dao.AIOConfigServiceDAO;
import com.viettel.aio.dao.AIOErrorDAO;
import com.viettel.aio.dao.AIOErrorDetailDAO;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOErrorDTO;
import com.viettel.aio.dto.AIORequestGetErrorDetailDTO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.ktts2.common.UFile;
import com.viettel.utils.ImageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Date;
import java.util.List;

@Service("aioConfigServiceBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOConfigServiceBusinessImpl implements AIOConfigServiceBusiness {

    @Autowired
    public AIOConfigServiceBusinessImpl(AIOConfigServiceDAO aioConfigServiceDAO) {
        this.aioConfigServiceDAO = aioConfigServiceDAO;
    }

    private AIOConfigServiceDAO aioConfigServiceDAO;

    @Override
    public List<AIOConfigServiceDTO> lstAIOConfigService() {
        return aioConfigServiceDAO.getAllAIOConfigService();
    }
}
