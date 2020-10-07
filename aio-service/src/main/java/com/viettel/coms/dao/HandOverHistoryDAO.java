package com.viettel.coms.dao;

import com.viettel.coms.bo.StTransactionBO;
import com.viettel.coms.dto.HandOverHistoryDTORequest;
import com.viettel.coms.dto.StTransactionDTO;
import com.viettel.coms.dto.StTransactionDetailDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("HAND_OVER_HISTORY_DAO")
public class HandOverHistoryDAO extends BaseFWDAOImpl<StTransactionBO, Long> {
    public HandOverHistoryDAO() {
        this.model = new StTransactionBO();
    }

    public HandOverHistoryDAO(Session session) {
        this.session = session;
    }

    /**
     * getValueToInitHandOverHistoryPages
     *
     * @param request
     * @param temp
     * @return List<StTransactionDTO>
     */
    public List<StTransactionDTO> getValueToInitHandOverHistoryPages(HandOverHistoryDTORequest request, int temp) {

        StringBuilder sql = new StringBuilder(" SELECT distinct ");
        sql.append("  sTrans.STOCK_TRANS_ID stockTransId, ");
        sql.append("  sTrans.CODE stockTransCode, ");
        sql.append("  to_char(sTrans.CONSTRUCTION_CODE) stockTransconstructionCode, ");
        sql.append("  sTrans.STOCK_NAME stockTransName,  ");
        sql.append("  sTrans.CREATED_BY_NAME stockTransCreatedByName, ");

        sql.append("  sTrans.CREATED_DATE stockTransCreatedDate, ");
        sql.append("  stTrans.OLD_LAST_SHIPPER_ID oldLastShipperId,  ");
        sql.append("  stTrans.CONFIRM_DATE confirmDate, ");
        sql.append("  stTrans.CONFIRM confirm, ");
        sql.append("  stTrans.TYPE type");
        sql.append("  FROM ST_TRANSACTION stTrans ");
        sql.append(" LEFT JOIN STOCK_TRANS sTrans ");
        sql.append(" ON stTrans.STOCK_TRANS_ID = sTrans.STOCK_TRANS_ID  ");
        sql.append(" WHERE stTrans.TYPE = 0  ");

        if (temp == 0) {
            sql.append(" and stTrans.NEW_LAST_SHIPPER_ID =:userid ");
        } else if (temp == 1) {
            sql.append(" and stTrans.OLD_LAST_SHIPPER_ID =:userid ");
        }
        sql.append(" union all ");
        sql.append(" SELECT  distinct");
        sql.append("  synStock.SYN_STOCK_TRANS_ID synStockTransId, ");
        sql.append("  synStock.CODE synStockTransCode, ");
        sql.append("  to_char(synStock.CONSTRUCTION_CODE) synStockTransconstructionCode, ");
        sql.append("  synStock.STOCK_NAME synStockTransName,  ");
        sql.append("  synStock.CREATED_BY_NAME synStockTransCreatedByName, ");
        sql.append("  synStock.CREATED_DATE synStockTransCreatedDate, ");
        sql.append("  stTrans.OLD_LAST_SHIPPER_ID oldLastShipperId,  ");
        sql.append("  stTrans.CONFIRM_DATE confirmDate, ");
        sql.append("  stTrans.CONFIRM confirm, ");
        sql.append("  stTrans.TYPE type");
        sql.append(" FROM ST_TRANSACTION stTrans ");
        sql.append(" LEFT JOIN SYN_STOCK_TRANS synStock ");
        sql.append(" ON stTrans.STOCK_TRANS_ID = synStock.Syn_STOCK_TRANS_ID ");
        sql.append(" WHERE stTrans.TYPE = 1  ");

        if (temp == 0) {
            sql.append(" and stTrans.NEW_LAST_SHIPPER_ID =:userid ");
        } else if (temp == 1) {
            sql.append(" and stTrans.OLD_LAST_SHIPPER_ID =:userid ");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("userid", request.getSysUserRequest().getSysUserId());
        query.addScalar("oldLastShipperId", new LongType());
        query.addScalar("confirmDate", new StringType());
        query.addScalar("confirm", new StringType());
        query.addScalar("type", new StringType());
        query.addScalar("stockTransId", new LongType());
        query.addScalar("stockTransCode", new StringType());
        query.addScalar("stockTransConstructionCode", new StringType());
        query.addScalar("stockTransName", new StringType());
        query.addScalar("stockTransCreatedByName", new StringType());
        query.addScalar("stockTransCreatedDate", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(StTransactionDTO.class));

        return query.list();
    }

    /**
     * getValueToInitHandOverHistoryVTTB
     *
     * @param request
     * @return List<StTransactionDetailDTO>
     */
    public List<StTransactionDetailDTO> getValueToInitHandOverHistoryVTTB(HandOverHistoryDTORequest request) {

        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT distinct sDetail.STOCK_TRANS_DETAIL_ID stockTransDetailId, ");
        sql.append("TO_CHAR(sDetail.GOODS_NAME) goodName, ");
        sql.append("TO_CHAR(sDetail.GOODS_UNIT_NAME) goodUnitName, ");
        sql.append("   TO_CHAR(sDetail.GOODS_CODE) goodCode, ");
        sql.append("sDetail.AMOUNT_REAL amountReal, ");
        sql.append("stTrans.TYPE type ");
        sql.append("FROM ST_TRANSACTION stTrans ");
        sql.append("LEFT JOIN STOCK_TRANS stock ");
        sql.append("ON stTrans.STOCK_TRANS_ID = stock.STOCK_TRANS_ID ");
        sql.append("LEFT JOIN STOCK_TRANS_DETAIL sDetail ");
        sql.append("ON stock.STOCK_TRANS_ID = sDetail.STOCK_TRANS_ID ");
        sql.append("LEFT JOIN STOCK_TRANS_DETAIL_SERIAL sSerial ");
        sql.append("ON stock.STOCK_TRANS_ID           = sSerial.STOCK_TRANS_ID ");
        sql.append("AND sDetail.STOCK_TRANS_DETAIL_ID = sSerial.STOCK_TRANS_DETAIL_ID ");
        sql.append("WHERE stock.STOCK_TRANS_ID =:idStock ");
        sql.append("AND stTrans.TYPE           =:type ");
        sql.append("UNION ALL ");
        sql.append("SELECT distinct synDetail.SYN_STOCK_TRANS_DETAIL_ID stockTransDetailId, ");
        sql.append("TO_CHAR(synDetail.GOODS_NAME) goodName, ");
        sql.append("TO_CHAR(synDetail.GOODS_UNIT_NAME) goodUnitName, ");
        sql.append("     TO_CHAR(synDetail.GOODS_CODE) goodCode, ");
        sql.append("synDetail.AMOUNT_REAL amountReal, ");
        sql.append("stTrans.TYPE type ");
        sql.append("FROM ST_TRANSACTION stTrans ");
        sql.append("LEFT JOIN SYN_STOCK_TRANS synStock ");
        sql.append("ON stTrans.STOCK_TRANS_ID = synStock.Syn_STOCK_TRANS_ID ");
        sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL synDetail ");
        sql.append("ON synStock.SYN_STOCK_TRANS_ID = synDetail.SYN_STOCK_TRANS_ID ");
        sql.append("WHERE synStock.SYN_STOCK_TRANS_ID       =:idsynStock ");
        sql.append("AND stTrans.TYPE                        =:type  ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.setParameter("idStock", request.getStTransactionDTO().getStockTransId());
        query.setParameter("idsynStock", request.getStTransactionDTO().getStockTransId());
        query.setParameter("type", request.getStTransactionDTO().getType());
        query.addScalar("stockTransDetailId", new LongType());
        query.addScalar("goodName", new StringType());
        query.addScalar("goodUnitName", new StringType());
        query.addScalar("amountReal", new DoubleType());
        query.addScalar("type", new StringType());
        query.addScalar("goodCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(StTransactionDetailDTO.class));

        return query.list();
    }

    /**
     * getValueToInitHandOverHistoryVTTBDetail
     *
     * @param request
     * @return List<StTransactionDetailDTO>
     */
    public List<StTransactionDetailDTO> getValueToInitHandOverHistoryVTTBDetail(HandOverHistoryDTORequest request) {

        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT distinct sDetail.STOCK_TRANS_DETAIL_ID stockTransDetailId, ");
        sql.append("to_char(sDetail.GOODS_NAME) goodName, ");
        sql.append("to_char(sDetail.GOODS_UNIT_NAME) goodUnitName, ");
        sql.append("sDetail.AMOUNT_REAL amountReal, ");
        sql.append("stTrans.TYPE type, ");
        sql.append("to_char(mer.GOODS_NAME) detailGoodName, ");
        sql.append("to_char(mer.GOODS_CODE) detailGoodCode, ");
        sql.append("sSerial.QUANTITY detailQuantity , ");
        sql.append("mer.SERIAL detailSerial, ");
        sql.append("to_char(mer.CNT_CONTRACT_CODE) detailCntContractCode, ");
        sql.append("to_char(CAT_STOCK.NAME) detailStockName, ");
        sql.append("to_char(mer.PART_NUMBER) detailPartNumber, ");
        sql.append("to_char(mer.MANUFACTURER_NAME) detailMerManufacturer, ");
        sql.append("to_char(mer.PRODUCING_COUNTRY_NAME) detailProducingCountryName ");
        sql.append("FROM ST_TRANSACTION stTrans ");
        sql.append("LEFT JOIN STOCK_TRANS stock ");
        sql.append("ON stTrans.STOCK_TRANS_ID = stock.STOCK_TRANS_ID ");
        sql.append("LEFT JOIN STOCK_TRANS_DETAIL sDetail ");
        sql.append("ON stock.STOCK_TRANS_ID = sDetail.STOCK_TRANS_ID ");
        sql.append("LEFT JOIN STOCK_TRANS_DETAIL_SERIAL sSerial ");
        sql.append("ON stock.STOCK_TRANS_ID           = sSerial.STOCK_TRANS_ID ");
        sql.append("AND sDetail.STOCK_TRANS_DETAIL_ID = sSerial.STOCK_TRANS_DETAIL_ID ");
        sql.append("LEFT JOIN MER_ENTITY mer ");
        sql.append("ON sSerial.MER_ENTITY_ID         = mer.MER_ENTITY_ID ");
        sql.append("LEFT join CAT_STOCK on mer.STOCK_ID = CAT_STOCK.CAT_STOCK_ID ");
        sql.append("WHERE stock.STOCK_TRANS_ID       =:idStock ");
        sql.append("AND stTrans.TYPE                 =:type ");
        sql.append("AND stock.STOCK_TRANS_ID         =:idStock ");
        sql.append("AND sDetail.STOCK_TRANS_DETAIL_ID=:idDetail ");
        sql.append("UNION ALL ");
        sql.append("SELECT distinct synDetail.SYN_STOCK_TRANS_DETAIL_ID stockTransDetailId, ");
        sql.append("to_char(synDetail.GOODS_NAME) goodName, ");
        sql.append("to_char(synDetail.GOODS_UNIT_NAME) goodUnitName, ");
        sql.append("synDetail.AMOUNT_REAL amountReal, ");
        sql.append("stTrans.TYPE type, ");
        sql.append("to_char(sSerial.GOODS_NAME) detailGoodName, ");
        sql.append("to_char(sSerial.GOODS_CODE) detailGoodCode, ");
        sql.append("sSerial.AMOUNT detailQuantity, ");
        sql.append("sSerial.SERIAL detailSerial, ");
        sql.append("to_char(synStock.CONTRACT_CODE) detailCntContractCode, ");
        sql.append("to_char(synStock.STOCK_NAME) detailStockName, ");
        sql.append("to_char(sSerial.PART_NUMBER) detailPartNumber, ");
        sql.append("to_char(sSerial.CAT_MANUFACTURER_NAME) detailMerManufacturer, ");
        sql.append("to_char(sSerial.CAT_PRODUCING_COUNTRY_NAME) detailProducingCountryName ");
        sql.append("FROM ST_TRANSACTION stTrans ");
        sql.append("LEFT JOIN SYN_STOCK_TRANS synStock ");
        sql.append("ON stTrans.STOCK_TRANS_ID = synStock.Syn_STOCK_TRANS_ID ");
        sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL synDetail ");
        sql.append("ON synStock.SYN_STOCK_TRANS_ID = synDetail.SYN_STOCK_TRANS_ID ");
        sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL sSerial ");
        sql.append("ON synStock.SYN_STOCK_TRANS_ID          = sSerial.SYN_STOCK_TRANS_ID ");
        sql.append("AND synDetail.SYN_STOCK_TRANS_DETAIL_ID = sSerial.SYN_STOCK_TRANS_DETAIL_ID ");
        sql.append("WHERE synStock.SYN_STOCK_TRANS_ID       =:idsynStock ");
        sql.append("AND synStock.SYN_STOCK_TRANS_ID         =:idsynStock ");
        sql.append("AND stTrans.TYPE                        =:type ");
        sql.append("AND synDetail.SYN_STOCK_TRANS_DETAIL_ID =:idDetail ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("idStock", request.getStTransactionDTO().getStockTransId());
        query.setParameter("idsynStock", request.getStTransactionDTO().getStockTransId());
        query.setParameter("type", request.getStTransactionDTO().getType());
        query.setParameter("idDetail", request.getStTransactionDetailDTO().getStockTransDetailId());
        query.addScalar("stockTransDetailId", new LongType());
        query.addScalar("goodName", new StringType());
        query.addScalar("goodUnitName", new StringType());
        query.addScalar("amountReal", new DoubleType());
        query.addScalar("type", new StringType());
        query.addScalar("detailGoodName", new StringType());
        query.addScalar("detailGoodCode", new StringType());
        query.addScalar("detailQuantity", new DoubleType());
        query.addScalar("detailSerial", new StringType());
        query.addScalar("detailCntContractCode", new StringType());
        query.addScalar("detailStockName", new StringType());
        query.addScalar("detailPartNumber", new StringType());
        query.addScalar("detailMerManufacturer", new StringType());
        query.addScalar("detailProducingCountryName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(StTransactionDetailDTO.class));

        return query.list();
    }
}
