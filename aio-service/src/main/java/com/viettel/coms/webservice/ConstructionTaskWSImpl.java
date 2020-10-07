/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.ConstructionTaskBusinessImpl;
import com.viettel.coms.dto.ConstructionTaskDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.ConstructionTaskWS")

public class ConstructionTaskWSImpl implements ConstructionTaskWS {

    @Autowired
    ConstructionTaskBusinessImpl constructionTaskImpl;
    Logger logger = Logger.getLogger(ConstructionTaskWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return constructionTaskImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConstructionTaskDTO> getAll() throws Exception {
        try {
            return constructionTaskImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public ConstructionTaskBusinessImpl getConstructionTaskBusinessImpl() {
        return constructionTaskImpl;

    }

    public void setConstructionTaskBusinessImpl(ConstructionTaskBusinessImpl constructionTaskImpl) {
        this.constructionTaskImpl = constructionTaskImpl;
    }

    @Override
    public ConstructionTaskDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (ConstructionTaskDTO) this.constructionTaskImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(ConstructionTaskDTO costCenterBO) throws Exception {
        try {
            return this.constructionTaskImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(ConstructionTaskDTO costCenterBO) throws Exception {
        try {
            this.constructionTaskImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConstructionTaskDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.constructionTaskImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConstructionTaskDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.constructionTaskImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.constructionTaskImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.constructionTaskImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.constructionTaskImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.constructionTaskImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
