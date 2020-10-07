/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.AssetManageRequestEntityBusinessImpl;
import com.viettel.coms.dto.AssetManageRequestEntityDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.AssetManageRequestEntityWS")

public class AssetManageRequestEntityWSImpl implements AssetManageRequestEntityWS {

    @Autowired
    AssetManageRequestEntityBusinessImpl assetManageRequestEntityImpl;
    Logger logger = Logger.getLogger(AssetManageRequestEntityWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return assetManageRequestEntityImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<AssetManageRequestEntityDTO> getAll() throws Exception {
        try {
            return assetManageRequestEntityImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public AssetManageRequestEntityBusinessImpl getAssetManageRequestEntityBusinessImpl() {
        return assetManageRequestEntityImpl;

    }

    public void setAssetManageRequestEntityBusinessImpl(AssetManageRequestEntityBusinessImpl assetManageRequestEntityImpl) {
        this.assetManageRequestEntityImpl = assetManageRequestEntityImpl;
    }

    @Override
    public AssetManageRequestEntityDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (AssetManageRequestEntityDTO) this.assetManageRequestEntityImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(AssetManageRequestEntityDTO costCenterBO) throws Exception {
        try {
            return this.assetManageRequestEntityImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(AssetManageRequestEntityDTO costCenterBO) throws Exception {
        try {
            this.assetManageRequestEntityImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<AssetManageRequestEntityDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.assetManageRequestEntityImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<AssetManageRequestEntityDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.assetManageRequestEntityImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.assetManageRequestEntityImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.assetManageRequestEntityImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.assetManageRequestEntityImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.assetManageRequestEntityImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
