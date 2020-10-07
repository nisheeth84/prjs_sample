package com.viettel.coms.dao;

import com.viettel.coms.bo.RequestGoodsBO;
import com.viettel.coms.bo.RequestGoodsDetailBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.ConstructionDetailDTO;
import com.viettel.coms.dto.RequestGoodsDTO;
import com.viettel.coms.dto.RequestGoodsDetailDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

//VietNT_20180104_created
@EnableTransactionManagement
@Transactional
@Repository("requestGoodsDetailDAO")
public class RequestGoodsDetailDAO extends BaseFWDAOImpl<RequestGoodsDetailBO, Long> {

    public RequestGoodsDetailDAO() {
        this.model = new RequestGoodsDetailBO();
    }

    public RequestGoodsDetailDAO(Session session) {
        this.session = session;
    }
}
