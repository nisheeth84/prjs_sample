/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.TmpnMaterialBusinessImpl;
import com.viettel.coms.dto.TmpnMaterialDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.TmpnMaterialWS")

public class TmpnMaterialWSImpl implements TmpnMaterialWS {

    @Autowired
    TmpnMaterialBusinessImpl tmpnMaterialImpl;
    Logger logger = Logger.getLogger(TmpnMaterialWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return tmpnMaterialImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TmpnMaterialDTO> getAll() throws Exception {
        try {
            return tmpnMaterialImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public TmpnMaterialBusinessImpl getTmpnMaterialBusinessImpl() {
        return tmpnMaterialImpl;

    }

    public void setTmpnMaterialBusinessImpl(TmpnMaterialBusinessImpl tmpnMaterialImpl) {
        this.tmpnMaterialImpl = tmpnMaterialImpl;
    }

    @Override
    public TmpnMaterialDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (TmpnMaterialDTO) this.tmpnMaterialImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(TmpnMaterialDTO costCenterBO) throws Exception {
        try {
            return this.tmpnMaterialImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(TmpnMaterialDTO costCenterBO) throws Exception {
        try {
            this.tmpnMaterialImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TmpnMaterialDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.tmpnMaterialImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<TmpnMaterialDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.tmpnMaterialImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.tmpnMaterialImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.tmpnMaterialImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.tmpnMaterialImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.tmpnMaterialImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
