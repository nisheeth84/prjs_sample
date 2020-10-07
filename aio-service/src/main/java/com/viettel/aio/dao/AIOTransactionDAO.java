package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOTransactionBO;
import com.viettel.aio.dto.AIOTransactionDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

//VietNT_20190607_create
@EnableTransactionManagement
@Transactional
@Repository("aioTransactionDAO")
public class AIOTransactionDAO extends BaseFWDAOImpl<AIOTransactionBO, Long> {

    public AIOTransactionDAO() {
        this.model = new AIOTransactionBO();
    }

    public AIOTransactionDAO(Session session) {
        this.session = session;
    }


    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOTransactionDTO> getTransaction(AIOTransactionDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("AIO_TRANSACTION_ID aioTransactionId, ")
                .append("SYS_USER_PHONE sysUserPhone, ")
                .append("PAY_PHONE payPhone, ")
                .append("PAY_PHONE_VT payPhoneVt, ")
                .append("ERROR_CODE errorCode, ")
                .append("VT_TRANSACTION_ID vtTransactionId, ")
                .append("TYPE type, ")
                .append("DAILY_AMOUNT_LIMIT dailyAmountLimit, ")
                .append("TRANS_AMOUNT_LIMIT transAmountLimit, ")
                .append("TOKEN token, ")
                .append("CREATED_DATE createdDate, ")
                .append("UPDATE_DATE updateDate, ")
                .append("MERCHANT_MSISDN merchantMsisdn, ")
                .append("CONTENT_PAY contentPay, ")
                .append("TRANS_AMOUNT transAmount, ")
                .append("CHECK_SUM checkSum, ")
                .append("CONTRACT_ID contractId, ")
                .append("CONTRACT_CODE contractCode, ")
                .append("AMOUNT_CONTRACT amountContract ")
                .append(", (select c.is_pay from aio_contract c where c.contract_id = t.CONTRACT_ID) isPay ")
                .append("FROM AIO_TRANSACTION t ")
                .append("WHERE 1=1 ");

        if (criteria.getAioTransactionId() != null) {
            sql.append("AND AIO_TRANSACTION_ID = :id ");
        }

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());

        if (criteria.getAioTransactionId() != null) {
            query.setParameter("id", criteria.getAioTransactionId());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOTransactionDTO.class));
        query.addScalar("aioTransactionId", new LongType());
        query.addScalar("sysUserPhone", new StringType());
        query.addScalar("payPhone", new StringType());
        query.addScalar("payPhoneVt", new StringType());
        query.addScalar("errorCode", new StringType());
        query.addScalar("vtTransactionId", new StringType());
        query.addScalar("type", new StringType());
        query.addScalar("dailyAmountLimit", new LongType());
        query.addScalar("transAmountLimit", new LongType());
        query.addScalar("token", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("updateDate", new DateType());
        query.addScalar("merchantMsisdn", new StringType());
        query.addScalar("contentPay", new StringType());
        query.addScalar("transAmount", new LongType());
        query.addScalar("checkSum", new StringType());
        query.addScalar("contractId", new LongType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("amountContract", new LongType());
        query.addScalar("isPay", new LongType());

        return query.list();
    }

    public AIOTransactionDTO getById(String idStr) {
        Long id = Long.parseLong(idStr);
        AIOTransactionDTO criteria = new AIOTransactionDTO(id);
        List<AIOTransactionDTO> list = this.getTransaction(criteria);
        if (list != null && !list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }
}
