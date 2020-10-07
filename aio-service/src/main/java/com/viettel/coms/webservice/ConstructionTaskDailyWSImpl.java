/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.ConstructionTaskDailyBusinessImpl;
import com.viettel.coms.dto.ConstructionTaskDailyDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.ConstructionTaskDailyWS")

public class ConstructionTaskDailyWSImpl implements ConstructionTaskDailyWS {

    @Autowired
    ConstructionTaskDailyBusinessImpl constructionTaskDailyImpl;
    Logger logger = Logger.getLogger(ConstructionTaskDailyWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return constructionTaskDailyImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConstructionTaskDailyDTO> getAll() throws Exception {
        try {
            return constructionTaskDailyImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public ConstructionTaskDailyBusinessImpl getConstructionTaskDailyBusinessImpl() {
        return constructionTaskDailyImpl;

    }

    public void setConstructionTaskDailyBusinessImpl(ConstructionTaskDailyBusinessImpl constructionTaskDailyImpl) {
        this.constructionTaskDailyImpl = constructionTaskDailyImpl;
    }

    @Override
    public ConstructionTaskDailyDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (ConstructionTaskDailyDTO) this.constructionTaskDailyImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(ConstructionTaskDailyDTO costCenterBO) throws Exception {
        try {
            return this.constructionTaskDailyImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(ConstructionTaskDailyDTO costCenterBO) throws Exception {
        try {
            this.constructionTaskDailyImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConstructionTaskDailyDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.constructionTaskDailyImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConstructionTaskDailyDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.constructionTaskDailyImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.constructionTaskDailyImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.constructionTaskDailyImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.constructionTaskDailyImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.constructionTaskDailyImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
