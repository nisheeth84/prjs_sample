/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.ConfigGroupProvinceBusinessImpl;
import com.viettel.coms.dto.ConfigGroupProvinceDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.ConfigGroupProvinceWS")

public class ConfigGroupProvinceWSImpl implements ConfigGroupProvinceWS {

    @Autowired
    ConfigGroupProvinceBusinessImpl configGroupProvinceImpl;
    Logger logger = Logger.getLogger(ConfigGroupProvinceWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return configGroupProvinceImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConfigGroupProvinceDTO> getAll() throws Exception {
        try {
            return configGroupProvinceImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public ConfigGroupProvinceBusinessImpl getConfigGroupProvinceBusinessImpl() {
        return configGroupProvinceImpl;

    }

    public void setConfigGroupProvinceBusinessImpl(ConfigGroupProvinceBusinessImpl configGroupProvinceImpl) {
        this.configGroupProvinceImpl = configGroupProvinceImpl;
    }

    @Override
    public ConfigGroupProvinceDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (ConfigGroupProvinceDTO) this.configGroupProvinceImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(ConfigGroupProvinceDTO costCenterBO) throws Exception {
        try {
            return this.configGroupProvinceImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(ConfigGroupProvinceDTO costCenterBO) throws Exception {
        try {
            this.configGroupProvinceImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConfigGroupProvinceDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.configGroupProvinceImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<ConfigGroupProvinceDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.configGroupProvinceImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.configGroupProvinceImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.configGroupProvinceImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.configGroupProvinceImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.configGroupProvinceImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
