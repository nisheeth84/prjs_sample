package com.viettel.coms.business;

import com.viettel.coms.bo.OrderGoodsDetailBO;
import com.viettel.coms.dao.OrderGoodsDetailDAO;
import com.viettel.coms.dto.OrderGoodsDetailDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("orderGoodsDetailBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class OrderGoodsDetailBusinessImpl
        extends BaseFWBusinessImpl<OrderGoodsDetailDAO, OrderGoodsDetailDTO, OrderGoodsDetailBO>
        implements OrderGoodsDetailBusiness {

    @Autowired
    private OrderGoodsDetailDAO orderGoodsDetailDAO;

    public OrderGoodsDetailBusinessImpl() {
        tModel = new OrderGoodsDetailBO();
        tDAO = orderGoodsDetailDAO;
    }

    @Override
    public OrderGoodsDetailDAO gettDAO() {
        return orderGoodsDetailDAO;
    }

    @Override
    public long count() {
        return orderGoodsDetailDAO.count("OrderGoodsDetailBO", null);
    }

}
