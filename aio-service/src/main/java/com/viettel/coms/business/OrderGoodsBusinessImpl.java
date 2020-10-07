package com.viettel.coms.business;

import com.viettel.coms.bo.OrderGoodsBO;
import com.viettel.coms.dao.OrderGoodsDAO;
import com.viettel.coms.dto.OrderGoodsDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("orderGoodsBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class OrderGoodsBusinessImpl extends BaseFWBusinessImpl<OrderGoodsDAO, OrderGoodsDTO, OrderGoodsBO>
        implements OrderGoodsBusiness {

    @Autowired
    private OrderGoodsDAO orderGoodsDAO;

    public OrderGoodsBusinessImpl() {
        tModel = new OrderGoodsBO();
        tDAO = orderGoodsDAO;
    }

    @Override
    public OrderGoodsDAO gettDAO() {
        return orderGoodsDAO;
    }

    @Override
    public long count() {
        return orderGoodsDAO.count("OrderGoodsBO", null);
    }

}
