/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.YearPlanDetailPerMonthBusinessImpl;
import com.viettel.coms.dto.YearPlanDetailPerMonthDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.YearPlanDetailPerMonthWS")

public class YearPlanDetailPerMonthWSImpl implements YearPlanDetailPerMonthWS {

    @Autowired
    YearPlanDetailPerMonthBusinessImpl yearPlanDetailPerMonthImpl;
    Logger logger = Logger.getLogger(YearPlanDetailPerMonthWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return yearPlanDetailPerMonthImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<YearPlanDetailPerMonthDTO> getAll() throws Exception {
        try {
            return yearPlanDetailPerMonthImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public YearPlanDetailPerMonthBusinessImpl getYearPlanDetailPerMonthBusinessImpl() {
        return yearPlanDetailPerMonthImpl;

    }

    public void setYearPlanDetailPerMonthBusinessImpl(YearPlanDetailPerMonthBusinessImpl yearPlanDetailPerMonthImpl) {
        this.yearPlanDetailPerMonthImpl = yearPlanDetailPerMonthImpl;
    }

    @Override
    public YearPlanDetailPerMonthDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (YearPlanDetailPerMonthDTO) this.yearPlanDetailPerMonthImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(YearPlanDetailPerMonthDTO costCenterBO) throws Exception {
        try {
            return this.yearPlanDetailPerMonthImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(YearPlanDetailPerMonthDTO costCenterBO) throws Exception {
        try {
            this.yearPlanDetailPerMonthImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<YearPlanDetailPerMonthDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.yearPlanDetailPerMonthImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<YearPlanDetailPerMonthDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.yearPlanDetailPerMonthImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.yearPlanDetailPerMonthImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.yearPlanDetailPerMonthImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.yearPlanDetailPerMonthImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.yearPlanDetailPerMonthImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
