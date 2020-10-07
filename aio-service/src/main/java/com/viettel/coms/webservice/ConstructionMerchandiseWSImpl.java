/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.ConstructionMerchandiseBusinessImpl;
import com.viettel.coms.dto.ConstructionMerchandiseDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.ConstructionMerchandiseWS")

public class ConstructionMerchandiseWSImpl implements ConstructionMerchandiseWS {

    @Autowired
    ConstructionMerchandiseBusinessImpl constructionMerchandiseImpl;
    Logger logger = Logger.getLogger(ConstructionMerchandiseWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return constructionMerchandiseImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConstructionMerchandiseDTO> getAll() throws Exception {
        try {
            return constructionMerchandiseImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public ConstructionMerchandiseBusinessImpl getConstructionMerchandiseBusinessImpl() {
        return constructionMerchandiseImpl;

    }

    public void setConstructionMerchandiseBusinessImpl(ConstructionMerchandiseBusinessImpl constructionMerchandiseImpl) {
        this.constructionMerchandiseImpl = constructionMerchandiseImpl;
    }

    @Override
    public ConstructionMerchandiseDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (ConstructionMerchandiseDTO) this.constructionMerchandiseImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(ConstructionMerchandiseDTO costCenterBO) throws Exception {
        try {
            return this.constructionMerchandiseImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(ConstructionMerchandiseDTO costCenterBO) throws Exception {
        try {
            this.constructionMerchandiseImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConstructionMerchandiseDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.constructionMerchandiseImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConstructionMerchandiseDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.constructionMerchandiseImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.constructionMerchandiseImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.constructionMerchandiseImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.constructionMerchandiseImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.constructionMerchandiseImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
