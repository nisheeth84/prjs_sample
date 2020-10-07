/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.YearPlanDetailBusinessImpl;
import com.viettel.coms.dto.YearPlanDetailDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.YearPlanDetailWS")

public class YearPlanDetailWSImpl implements YearPlanDetailWS {

    @Autowired
    YearPlanDetailBusinessImpl yearPlanDetailImpl;
    Logger logger = Logger.getLogger(YearPlanDetailWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return yearPlanDetailImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<YearPlanDetailDTO> getAll() throws Exception {
        try {
            return yearPlanDetailImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public YearPlanDetailBusinessImpl getYearPlanDetailBusinessImpl() {
        return yearPlanDetailImpl;

    }

    public void setYearPlanDetailBusinessImpl(YearPlanDetailBusinessImpl yearPlanDetailImpl) {
        this.yearPlanDetailImpl = yearPlanDetailImpl;
    }

    @Override
    public YearPlanDetailDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (YearPlanDetailDTO) this.yearPlanDetailImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(YearPlanDetailDTO costCenterBO) throws Exception {
        try {
            return this.yearPlanDetailImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(YearPlanDetailDTO costCenterBO) throws Exception {
        try {
            this.yearPlanDetailImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<YearPlanDetailDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.yearPlanDetailImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<YearPlanDetailDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.yearPlanDetailImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.yearPlanDetailImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.yearPlanDetailImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.yearPlanDetailImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.yearPlanDetailImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
