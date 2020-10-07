/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.TmpnForceMaintainBusinessImpl;
import com.viettel.coms.dto.TmpnForceMaintainDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.TmpnForceMaintainWS")

public class TmpnForceMaintainWSImpl implements TmpnForceMaintainWS {

    @Autowired
    TmpnForceMaintainBusinessImpl tmpnForceMaintainImpl;
    Logger logger = Logger.getLogger(TmpnForceMaintainWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return tmpnForceMaintainImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TmpnForceMaintainDTO> getAll() throws Exception {
        try {
            return tmpnForceMaintainImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public TmpnForceMaintainBusinessImpl getTmpnForceMaintainBusinessImpl() {
        return tmpnForceMaintainImpl;

    }

    public void setTmpnForceMaintainBusinessImpl(TmpnForceMaintainBusinessImpl tmpnForceMaintainImpl) {
        this.tmpnForceMaintainImpl = tmpnForceMaintainImpl;
    }

    @Override
    public TmpnForceMaintainDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (TmpnForceMaintainDTO) this.tmpnForceMaintainImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(TmpnForceMaintainDTO costCenterBO) throws Exception {
        try {
            return this.tmpnForceMaintainImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(TmpnForceMaintainDTO costCenterBO) throws Exception {
        try {
            this.tmpnForceMaintainImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TmpnForceMaintainDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.tmpnForceMaintainImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TmpnForceMaintainDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.tmpnForceMaintainImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.tmpnForceMaintainImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.tmpnForceMaintainImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.tmpnForceMaintainImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.tmpnForceMaintainImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
