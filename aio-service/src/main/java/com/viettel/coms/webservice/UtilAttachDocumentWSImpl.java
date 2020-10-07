/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.webservice;

/**
 * @author hunglq9
 */

import com.viettel.coms.business.UtilAttachDocumentBusinessImpl;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.service.base.pojo.ConditionBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebService;
import java.util.Date;
import java.util.List;


@WebService(endpointInterface = "com.viettel.coms.webservice.UtilAttachDocumentWS")

public class UtilAttachDocumentWSImpl implements UtilAttachDocumentWS {

    @Autowired
    UtilAttachDocumentBusinessImpl utilAttachDocumentImpl;
    Logger logger = Logger.getLogger(UtilAttachDocumentWSImpl.class);

    @Override
    public long getTotal() throws Exception {
        try {
            return utilAttachDocumentImpl.count();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<UtilAttachDocumentDTO> getAll() throws Exception {
        try {
            return utilAttachDocumentImpl.getAll(); //To change body of generated methods, choose Tools | Templates.
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    public UtilAttachDocumentBusinessImpl getUtilAttachDocumentBusinessImpl() {
        return utilAttachDocumentImpl;

    }

    public void setUtilAttachDocumentBusinessImpl(UtilAttachDocumentBusinessImpl utilAttachDocumentImpl) {
        this.utilAttachDocumentImpl = utilAttachDocumentImpl;
    }

    @Override
    public UtilAttachDocumentDTO getOneById(Long costCenterId) throws Exception {
        try {
            return (UtilAttachDocumentDTO) this.utilAttachDocumentImpl.getOneById(costCenterId);

        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long save(UtilAttachDocumentDTO costCenterBO) throws Exception {
        try {
            return this.utilAttachDocumentImpl.save(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public void delete(UtilAttachDocumentDTO costCenterBO) throws Exception {
        try {
            this.utilAttachDocumentImpl.delete(costCenterBO);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<UtilAttachDocumentDTO> searchByHql(String hql, List<ConditionBean> conditionBeans)
            throws Exception {
        try {
            return this.utilAttachDocumentImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public List<UtilAttachDocumentDTO> searchByHql(String hql, List<ConditionBean> conditionBeans, int startIdx, int endIdx)
            throws Exception {
        try {
            return this.utilAttachDocumentImpl.searchByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long countByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.utilAttachDocumentImpl.countByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public int executeByHql(String hql, List<ConditionBean> conditionBeans) throws Exception {
        try {
            return this.utilAttachDocumentImpl.executeByHql(hql, conditionBeans);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Date getSysDate() throws Exception {
        try {
            return this.utilAttachDocumentImpl.getSysDate();
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

    @Override
    public Long getNextValSequence(String sequense) throws Exception {
        try {
            return this.utilAttachDocumentImpl.getNextValSequence(sequense);
        } catch (Exception ex) {
            logger.error(ex);
            throw ex;
        }
    }

}
