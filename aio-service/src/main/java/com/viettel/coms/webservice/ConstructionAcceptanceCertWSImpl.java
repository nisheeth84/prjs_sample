/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.ConstructionAcceptanceCertBusinessImpl;
import com.viettel.coms.dto.ConstructionAcceptanceCertDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.ConstructionAcceptanceCertWS")

public class ConstructionAcceptanceCertWSImpl implements ConstructionAcceptanceCertWS {

    @Autowired
    ConstructionAcceptanceCertBusinessImpl constructionAcceptanceCertImpl;
    Logger logger = Logger.getLogger(ConstructionAcceptanceCertWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return constructionAcceptanceCertImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConstructionAcceptanceCertDTO> getAll() throws Exception {
        try {
            return constructionAcceptanceCertImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public ConstructionAcceptanceCertBusinessImpl getConstructionAcceptanceCertBusinessImpl() {
        return constructionAcceptanceCertImpl;

    }

    public void setConstructionAcceptanceCertBusinessImpl(ConstructionAcceptanceCertBusinessImpl constructionAcceptanceCertImpl) {
        this.constructionAcceptanceCertImpl = constructionAcceptanceCertImpl;
    }

    @Override
    public ConstructionAcceptanceCertDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (ConstructionAcceptanceCertDTO) this.constructionAcceptanceCertImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(ConstructionAcceptanceCertDTO costCenterBO) throws Exception {
        try {
            return this.constructionAcceptanceCertImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(ConstructionAcceptanceCertDTO costCenterBO) throws Exception {
        try {
            this.constructionAcceptanceCertImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConstructionAcceptanceCertDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.constructionAcceptanceCertImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConstructionAcceptanceCertDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.constructionAcceptanceCertImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.constructionAcceptanceCertImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.constructionAcceptanceCertImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.constructionAcceptanceCertImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.constructionAcceptanceCertImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
