package com.viettel.aio.dao;

import com.viettel.aio.bo.CntContractAcceptanceCstBO;
import com.viettel.aio.dto.CntContractAcceptanceCstDTO;
import com.viettel.aio.dto.CntContractAcceptanceDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author hungnx
 */
@Repository("CntContractAcceptanceCstDAO")
public class CntContractAcceptanceCstDAO extends BaseFWDAOImpl<CntContractAcceptanceCstBO, Long> {

    public CntContractAcceptanceCstDAO() {
        this.model = new CntContractAcceptanceCstBO();
    }

    public CntContractAcceptanceCstDAO(Session session) {
        this.session = session;
    }
    public List<CntContractAcceptanceCstDTO> doSearch(CntContractAcceptanceDTO criteria) {
    	StringBuilder stringBuilder = getSelectAllQuery();
    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		query.addScalar("cntContractAcceptanceCstId", new LongType());
		query.addScalar("cntContractAcceptanceId", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("constructionId", new LongType());
		query.addScalar("shipmentGoodsId", new LongType());
		query.setParameter("acceptanceId", criteria.getCntContractAcceptanceId());
		query.setParameter("contractId", criteria.getCntContractId());
		query.setResultTransformer(Transformers.aliasToBean(CntContractAcceptanceCstDTO.class));
		return query.list();
	}

	private StringBuilder getSelectAllQuery() {
		StringBuilder stringBuilder = new StringBuilder("SELECT T.CNT_CONTRACT_ACCEPTANCE_CST_ID cntContractAcceptanceCstId, T.CNT_CONTRACT_ACCEPTANCE_ID cntContractAcceptanceId"
				+ ", T.CNT_CONTRACT_ID cntContractId, T.CONSTRUCTION_ID constructionId, T.SHIPMENT_GOODS_ID shipmentGoodsId"
				+" FROM CNT_CONTRACT_ACCEPTANCE_CST T where T.CNT_CONTRACT_ACCEPTANCE_ID = :acceptanceId and T.CNT_CONTRACT_ID = :contractId");
		return stringBuilder;
	}
}
