/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.DmpnOrderBusinessImpl;
import com.viettel.coms.dto.DmpnOrderDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.DmpnOrderWS")

public class DmpnOrderWSImpl implements DmpnOrderWS {

    @Autowired
    DmpnOrderBusinessImpl dmpnOrderImpl;
    Logger logger = Logger.getLogger(DmpnOrderWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return dmpnOrderImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<DmpnOrderDTO> getAll() throws Exception {
        try {
            return dmpnOrderImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public DmpnOrderBusinessImpl getDmpnOrderBusinessImpl() {
        return dmpnOrderImpl;

    }

    public void setDmpnOrderBusinessImpl(DmpnOrderBusinessImpl dmpnOrderImpl) {
        this.dmpnOrderImpl = dmpnOrderImpl;
    }

    @Override
    public DmpnOrderDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (DmpnOrderDTO) this.dmpnOrderImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(DmpnOrderDTO costCenterBO) throws Exception {
        try {
            return this.dmpnOrderImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(DmpnOrderDTO costCenterBO) throws Exception {
        try {
            this.dmpnOrderImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<DmpnOrderDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.dmpnOrderImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<DmpnOrderDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.dmpnOrderImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.dmpnOrderImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.dmpnOrderImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.dmpnOrderImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.dmpnOrderImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
