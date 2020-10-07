package com.viettel.wms.business;

import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.bo.KpiStorageTimeBO;
import com.viettel.wms.constant.Constants;
import com.viettel.wms.dao.KpiStorageTimeDAO;
import com.viettel.wms.dto.KpiStorageTimeDTO;
import com.viettel.wms.dto.StockDTO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.List;


@Service("kpiStorageTimeBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class KpiStorageTimeBusinessImpl extends BaseFWBusinessImpl<KpiStorageTimeDAO, KpiStorageTimeDTO, KpiStorageTimeBO> implements KpiStorageTimeBusiness {

    @Autowired
    private KpiStorageTimeDAO stockGoodsKpiDAO;

    @Autowired
    private StockBusinessImpl stockBusinessImpl;

    @Autowired
    private CommonBusiness commonBusiness;

    public KpiStorageTimeBusinessImpl() {
        tModel = new KpiStorageTimeBO();
        tDAO = stockGoodsKpiDAO;
    }

    @Override
    public KpiStorageTimeDAO gettDAO() {
        return stockGoodsKpiDAO;
    }

    @Override
    public long count() {
        return stockGoodsKpiDAO.count("KpiStorageTimeBO", null);
    }

    //Hàm xử lý logic tìm kiếm kpi theo thời gian
    public DataListDTO doSearchKpiTime(KpiStorageTimeDTO obj, HttpServletRequest request) throws Exception {
        String err = "";
        for (Long id : obj.getListStockId()) {
            StockDTO stockDTO = (StockDTO) stockBusinessImpl.getOneById(id);
            if (!VpsPermissionChecker.checkPermissionOnDomainData(Constants.OperationKey.REPORT, Constants.AdResourceKey.STOCK, id, request)) {
                err = StringUtils.isNotEmpty(err) ? (err + ";" + id) : ("Bạn không có quyền xem báo cáo tại kho " + id);
            }
        }

        if (StringUtils.isNotEmpty(err)) {
            throw new IllegalArgumentException(err);
        }

        if (obj.getListStockId().size() == 0) {
            List<Long> listId = commonBusiness.getListDomainData(Constants.OperationKey.REPORT, Constants.AdResourceKey.STOCK, request);
            obj.setListStockId(listId);
        }

        List<KpiStorageTimeDTO> ls = stockGoodsKpiDAO.doSearchKpiTime(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getTotalRecord());
        data.setStart(1);
        return data;
    }
    //End


}
