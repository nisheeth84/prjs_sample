/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.OrderGoodsDetailBusinessImpl;
import com.viettel.coms.dto.OrderGoodsDetailDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.OrderGoodsDetailWS")

public class OrderGoodsDetailWSImpl implements OrderGoodsDetailWS {

    @Autowired
    OrderGoodsDetailBusinessImpl orderGoodsDetailImpl;
    Logger logger = Logger.getLogger(OrderGoodsDetailWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return orderGoodsDetailImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<OrderGoodsDetailDTO> getAll() throws Exception {
        try {
            return orderGoodsDetailImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public OrderGoodsDetailBusinessImpl getOrderGoodsDetailBusinessImpl() {
        return orderGoodsDetailImpl;

    }

    public void setOrderGoodsDetailBusinessImpl(OrderGoodsDetailBusinessImpl orderGoodsDetailImpl) {
        this.orderGoodsDetailImpl = orderGoodsDetailImpl;
    }

    @Override
    public OrderGoodsDetailDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (OrderGoodsDetailDTO) this.orderGoodsDetailImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(OrderGoodsDetailDTO costCenterBO) throws Exception {
        try {
            return this.orderGoodsDetailImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(OrderGoodsDetailDTO costCenterBO) throws Exception {
        try {
            this.orderGoodsDetailImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<OrderGoodsDetailDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.orderGoodsDetailImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<OrderGoodsDetailDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.orderGoodsDetailImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.orderGoodsDetailImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.orderGoodsDetailImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.orderGoodsDetailImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.orderGoodsDetailImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
