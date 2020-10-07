package com.viettel.aio.dao;

import com.viettel.aio.bo.CntContractPaymentCstBO;
import com.viettel.aio.dto.CntContractPaymentCstDTO;
import com.viettel.aio.dto.CntContractPaymentDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Hungnx
 */
@Repository("CntContractPaymentCstDAO")
public class CntContractPaymentCstDAO extends BaseFWDAOImpl<CntContractPaymentCstBO, Long> {

    public CntContractPaymentCstDAO() {
        this.model = new CntContractPaymentCstBO();
    }

    public CntContractPaymentCstDAO(Session session) {
        this.session = session;
    }
    public List<CntContractPaymentCstDTO> doSearch(CntContractPaymentDTO cntContractPayment) {
    	StringBuilder stringBuilder = getSelectAllQuery();
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		query.addScalar("cntContractPaymentCstId", new LongType());
		query.addScalar("cntContractPaymentId", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("constructionId", new LongType());
		query.setParameter("paymentId", cntContractPayment.getCntContractPaymentId());
		query.setParameter("contractId", cntContractPayment.getCntContractId());
		query.setResultTransformer(Transformers.aliasToBean(CntContractPaymentCstDTO.class));
		return query.list();
	}

	private StringBuilder getSelectAllQuery() {
		StringBuilder stringBuilder = new StringBuilder("SELECT T.CNT_CONTRACT_PAYMENT_CST_ID cntContractPaymentCstId, T.CNT_CONTRACT_PAYMENT_ID cntContractPaymentId"
				+ ", T.CNT_CONTRACT_ID cntContractId, T.CONSTRUCTION_ID constructionId"
				+" FROM CNT_CONTRACT_PAYMENT_CST T where T.CNT_CONTRACT_PAYMENT_ID = :paymentId and T.CNT_CONTRACT_ID = :contractId");
		return stringBuilder;
	}
}
