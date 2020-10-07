package com.viettel.coms.business;

import com.viettel.coms.bo.OrdersBO;
import com.viettel.coms.dao.OrdersDAO;
import com.viettel.coms.dto.OrdersDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("ordersBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class OrdersBusinessImpl extends BaseFWBusinessImpl<OrdersDAO, OrdersDTO, OrdersBO> implements OrdersBusiness {

    @Autowired
    private OrdersDAO ordersDAO;

    public OrdersBusinessImpl() {
        tModel = new OrdersBO();
        tDAO = ordersDAO;
    }

    @Override
    public OrdersDAO gettDAO() {
        return ordersDAO;
    }

    @Override
    public long count() {
        return ordersDAO.count("OrdersBO", null);
    }

}
