/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.TmpnForceNewBtsBusinessImpl;
import com.viettel.coms.dto.TmpnForceNewBtsDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.TmpnForceNewBtsWS")

public class TmpnForceNewBtsWSImpl implements TmpnForceNewBtsWS {

    @Autowired
    TmpnForceNewBtsBusinessImpl tmpnForceNewBtsImpl;
    Logger logger = Logger.getLogger(TmpnForceNewBtsWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return tmpnForceNewBtsImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TmpnForceNewBtsDTO> getAll() throws Exception {
        try {
            return tmpnForceNewBtsImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public TmpnForceNewBtsBusinessImpl getTmpnForceNewBtsBusinessImpl() {
        return tmpnForceNewBtsImpl;

    }

    public void setTmpnForceNewBtsBusinessImpl(TmpnForceNewBtsBusinessImpl tmpnForceNewBtsImpl) {
        this.tmpnForceNewBtsImpl = tmpnForceNewBtsImpl;
    }

    @Override
    public TmpnForceNewBtsDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (TmpnForceNewBtsDTO) this.tmpnForceNewBtsImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(TmpnForceNewBtsDTO costCenterBO) throws Exception {
        try {
            return this.tmpnForceNewBtsImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(TmpnForceNewBtsDTO costCenterBO) throws Exception {
        try {
            this.tmpnForceNewBtsImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TmpnForceNewBtsDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.tmpnForceNewBtsImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TmpnForceNewBtsDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.tmpnForceNewBtsImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.tmpnForceNewBtsImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.tmpnForceNewBtsImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.tmpnForceNewBtsImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.tmpnForceNewBtsImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
