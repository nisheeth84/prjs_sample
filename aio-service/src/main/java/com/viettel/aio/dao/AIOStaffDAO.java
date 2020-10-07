package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOStaffBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

//VietNT_20190711_create
@EnableTransactionManagement
@Transactional
@Repository("aioStaffDAO")
public class AIOStaffDAO extends BaseFWDAOImpl<AIOStaffBO, Long> {

    public AIOStaffDAO() {
        this.model = new AIOStaffBO();
    }

    public AIOStaffDAO(Session session) {
        this.session = session;
    }


    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }
}
