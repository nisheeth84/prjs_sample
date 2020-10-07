/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.TotalMonthPlanBusinessImpl;
import com.viettel.coms.dto.TotalMonthPlanDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.TotalMonthPlanWS")

public class TotalMonthPlanWSImpl implements TotalMonthPlanWS {

    @Autowired
    TotalMonthPlanBusinessImpl totalMonthPlanImpl;
    Logger logger = Logger.getLogger(TotalMonthPlanWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return totalMonthPlanImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TotalMonthPlanDTO> getAll() throws Exception {
        try {
            return totalMonthPlanImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public TotalMonthPlanBusinessImpl getTotalMonthPlanBusinessImpl() {
        return totalMonthPlanImpl;

    }

    public void setTotalMonthPlanBusinessImpl(TotalMonthPlanBusinessImpl totalMonthPlanImpl) {
        this.totalMonthPlanImpl = totalMonthPlanImpl;
    }

    @Override
    public TotalMonthPlanDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (TotalMonthPlanDTO) this.totalMonthPlanImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(TotalMonthPlanDTO costCenterBO) throws Exception {
        try {
            return this.totalMonthPlanImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(TotalMonthPlanDTO costCenterBO) throws Exception {
        try {
            this.totalMonthPlanImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TotalMonthPlanDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.totalMonthPlanImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TotalMonthPlanDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.totalMonthPlanImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.totalMonthPlanImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.totalMonthPlanImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.totalMonthPlanImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.totalMonthPlanImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
