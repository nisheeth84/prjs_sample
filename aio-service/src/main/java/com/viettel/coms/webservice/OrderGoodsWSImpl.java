/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.OrderGoodsBusinessImpl;
import com.viettel.coms.dto.OrderGoodsDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.OrderGoodsWS")

public class OrderGoodsWSImpl implements OrderGoodsWS {

    @Autowired
    OrderGoodsBusinessImpl orderGoodsImpl;
    Logger logger = Logger.getLogger(OrderGoodsWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return orderGoodsImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<OrderGoodsDTO> getAll() throws Exception {
        try {
            return orderGoodsImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public OrderGoodsBusinessImpl getOrderGoodsBusinessImpl() {
        return orderGoodsImpl;

    }

    public void setOrderGoodsBusinessImpl(OrderGoodsBusinessImpl orderGoodsImpl) {
        this.orderGoodsImpl = orderGoodsImpl;
    }

    @Override
    public OrderGoodsDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (OrderGoodsDTO) this.orderGoodsImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(OrderGoodsDTO costCenterBO) throws Exception {
        try {
            return this.orderGoodsImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(OrderGoodsDTO costCenterBO) throws Exception {
        try {
            this.orderGoodsImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<OrderGoodsDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.orderGoodsImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<OrderGoodsDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.orderGoodsImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.orderGoodsImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.orderGoodsImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.orderGoodsImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.orderGoodsImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
