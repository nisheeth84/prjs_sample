/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.TmpnFinanceBusinessImpl;
import com.viettel.coms.dto.TmpnFinanceDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.TmpnFinanceWS")

public class TmpnFinanceWSImpl implements TmpnFinanceWS {

    @Autowired
    TmpnFinanceBusinessImpl tmpnFinanceImpl;
    Logger logger = Logger.getLogger(TmpnFinanceWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return tmpnFinanceImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TmpnFinanceDTO> getAll() throws Exception {
        try {
            return tmpnFinanceImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public TmpnFinanceBusinessImpl getTmpnFinanceBusinessImpl() {
        return tmpnFinanceImpl;

    }

    public void setTmpnFinanceBusinessImpl(TmpnFinanceBusinessImpl tmpnFinanceImpl) {
        this.tmpnFinanceImpl = tmpnFinanceImpl;
    }

    @Override
    public TmpnFinanceDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (TmpnFinanceDTO) this.tmpnFinanceImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(TmpnFinanceDTO costCenterBO) throws Exception {
        try {
            return this.tmpnFinanceImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(TmpnFinanceDTO costCenterBO) throws Exception {
        try {
            this.tmpnFinanceImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TmpnFinanceDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.tmpnFinanceImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TmpnFinanceDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.tmpnFinanceImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.tmpnFinanceImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.tmpnFinanceImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.tmpnFinanceImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.tmpnFinanceImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
