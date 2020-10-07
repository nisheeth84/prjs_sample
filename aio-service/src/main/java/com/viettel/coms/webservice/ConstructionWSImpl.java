/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.ConstructionBusinessImpl;
import com.viettel.coms.dto.ConstructionDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.ConstructionWS")

public class ConstructionWSImpl implements ConstructionWS {

    @Autowired
    ConstructionBusinessImpl constructionImpl;
    Logger logger = Logger.getLogger(ConstructionWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return constructionImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConstructionDTO> getAll() throws Exception {
        try {
            return constructionImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public ConstructionBusinessImpl getConstructionBusinessImpl() {
        return constructionImpl;

    }

    public void setConstructionBusinessImpl(ConstructionBusinessImpl constructionImpl) {
        this.constructionImpl = constructionImpl;
    }

    @Override
    public ConstructionDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (ConstructionDTO) this.constructionImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(ConstructionDTO costCenterBO) throws Exception {
        try {
            return this.constructionImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(ConstructionDTO costCenterBO) throws Exception {
        try {
            this.constructionImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConstructionDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.constructionImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConstructionDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.constructionImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.constructionImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.constructionImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.constructionImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.constructionImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
