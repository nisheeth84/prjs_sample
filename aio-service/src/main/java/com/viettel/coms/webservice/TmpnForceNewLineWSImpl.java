/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.TmpnForceNewLineBusinessImpl;
import com.viettel.coms.dto.TmpnForceNewLineDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.TmpnForceNewLineWS")

public class TmpnForceNewLineWSImpl implements TmpnForceNewLineWS {

    @Autowired
    TmpnForceNewLineBusinessImpl tmpnForceNewLineImpl;
    Logger logger = Logger.getLogger(TmpnForceNewLineWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return tmpnForceNewLineImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TmpnForceNewLineDTO> getAll() throws Exception {
        try {
            return tmpnForceNewLineImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public TmpnForceNewLineBusinessImpl getTmpnForceNewLineBusinessImpl() {
        return tmpnForceNewLineImpl;

    }

    public void setTmpnForceNewLineBusinessImpl(TmpnForceNewLineBusinessImpl tmpnForceNewLineImpl) {
        this.tmpnForceNewLineImpl = tmpnForceNewLineImpl;
    }

    @Override
    public TmpnForceNewLineDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (TmpnForceNewLineDTO) this.tmpnForceNewLineImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(TmpnForceNewLineDTO costCenterBO) throws Exception {
        try {
            return this.tmpnForceNewLineImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(TmpnForceNewLineDTO costCenterBO) throws Exception {
        try {
            this.tmpnForceNewLineImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TmpnForceNewLineDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.tmpnForceNewLineImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TmpnForceNewLineDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.tmpnForceNewLineImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.tmpnForceNewLineImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.tmpnForceNewLineImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.tmpnForceNewLineImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.tmpnForceNewLineImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
