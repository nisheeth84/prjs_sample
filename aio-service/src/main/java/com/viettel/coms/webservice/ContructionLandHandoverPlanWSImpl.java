/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.ContructionLandHandoverPlanBusinessImpl;
import com.viettel.coms.dto.ContructionLandHandoverPlanDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.ContructionLandHandoverPlanWS")

public class ContructionLandHandoverPlanWSImpl implements ContructionLandHandoverPlanWS {

    @Autowired
    ContructionLandHandoverPlanBusinessImpl contructionLandHandoverPlanImpl;
    Logger logger = Logger.getLogger(ContructionLandHandoverPlanWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return contructionLandHandoverPlanImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ContructionLandHandoverPlanDTO> getAll() throws Exception {
        try {
            return contructionLandHandoverPlanImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public ContructionLandHandoverPlanBusinessImpl getContructionLandHandoverPlanBusinessImpl() {
        return contructionLandHandoverPlanImpl;

    }

    public void setContructionLandHandoverPlanBusinessImpl(ContructionLandHandoverPlanBusinessImpl contructionLandHandoverPlanImpl) {
        this.contructionLandHandoverPlanImpl = contructionLandHandoverPlanImpl;
    }

    @Override
    public ContructionLandHandoverPlanDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (ContructionLandHandoverPlanDTO) this.contructionLandHandoverPlanImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(ContructionLandHandoverPlanDTO costCenterBO) throws Exception {
        try {
            return this.contructionLandHandoverPlanImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(ContructionLandHandoverPlanDTO costCenterBO) throws Exception {
        try {
            this.contructionLandHandoverPlanImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ContructionLandHandoverPlanDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.contructionLandHandoverPlanImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ContructionLandHandoverPlanDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.contructionLandHandoverPlanImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.contructionLandHandoverPlanImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.contructionLandHandoverPlanImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.contructionLandHandoverPlanImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.contructionLandHandoverPlanImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
