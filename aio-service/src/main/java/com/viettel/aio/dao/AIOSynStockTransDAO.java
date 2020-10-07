/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.aio.dao;

import com.viettel.aio.bo.StockTransBO;
import com.viettel.aio.bo.StockTransDetailBO;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOCountConstructionTaskDTO;
import com.viettel.aio.dto.AIOMerEntityDTO;
import com.viettel.aio.dto.AIORevenueDTO;
import com.viettel.aio.dto.AIOStockGoodsTotalDTO;
import com.viettel.aio.dto.AIOStockTransDetailSerialDTO;
import com.viettel.aio.dto.AIOStockTransRequest;
import com.viettel.aio.dto.AIOSynStockTransDTO;
import com.viettel.aio.dto.AIOSynStockTransDetailDTO;
import com.viettel.aio.dto.AIOSysGroupDTO;
import com.viettel.aio.dto.AIOSysUserDTO;
import com.viettel.aio.dto.ComsBaseFWDTO;
import com.viettel.aio.dto.SysUserRequest;
import com.viettel.aio.webservice.AIOSynStockTransWsRsService;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.wms.dto.StockDTO;
import com.viettel.wms.dto.StockTransDTO;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


/**
 * @author HOANM1
 * @version 1.0
 * @since 2019-03-10
 */
@Repository("aiosynStockTransDAO")
@EnableTransactionManagement
@Transactional
public class AIOSynStockTransDAO extends BaseFWDAOImpl<StockTransBO, Long> {

    private Logger LOGGER = Logger.getLogger(AIOSynStockTransWsRsService.class);

    public AIOSynStockTransDAO() {
        this.model = new StockTransBO();
    }

    public AIOSynStockTransDAO(Session session) {
        this.session = session;
    }

    @Autowired
    private AIOStockTransDetailDAO aioStockTransDetailDAO;

    @Autowired
    private AIOStockTransDetailSerialDAO aioStockTransDetailSerialDAO;

    @Autowired
    private AIOMerEntityDAO aioMerEntityDAO;

    @Autowired
    private AIOStockGoodsTotalDAO aioStockGoodsTotalDAO;

    // hoanm1_20190422_end
    // Service Mobile STOCK_TRANS
    // DASHBOARD phieu xuat kho

    /**
     * GET Current TimeStamp
     *
     * @return String CurrentTime
     */
    public static String getCurrentTimeStamp() {
        SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");// dd/MM/yyyy
        Date now = new Date();
        String strDate = sdfDate.format(now);
        String res = strDate.substring(0, 4);
        Long year = Long.parseLong(res) - 1;
        StringBuilder str = new StringBuilder("01-01-").append(year.toString());
        return str.toString();
    }

    /**
     * GET Count
     *
     * @param StockTransRequest request
     * @return CountConstructionTaskDTO
     */
    public AIOCountConstructionTaskDTO getCount(SysUserRequest request) {

        StringBuilder sql1 = new StringBuilder("");
        sql1.append("WITH TBL AS(SELECT syn.ORDER_CODE,syn.CODE,syn.REAL_IE_TRANS_DATE,nvl(syn.CONFIRM,0)CONFIRM  ");
        sql1.append("FROM ");
        sql1.append("SYS_USER a,USER_ROLE b,SYS_ROLE  c,USER_ROLE_DATA d, DOMAIN_DATA  e, DOMAIN_TYPE g,CAT_STATION station, CONSTRUCTION cst, SYN_STOCK_TRANS syn  ");
        sql1.append("WHERE ");
        sql1.append("a.SYS_USER_ID=b.SYS_USER_ID ");
        sql1.append("AND b.SYS_ROLE_ID=c.SYS_ROLE_ID ");
        sql1.append("AND c.CODE='COMS_GOVERNOR' ");
        sql1.append("AND b.USER_ROLE_ID=d.USER_ROLE_ID ");
        sql1.append("AND d.DOMAIN_DATA_ID=e.DOMAIN_DATA_ID ");
        sql1.append("AND e.DOMAIN_TYPE_ID=g.DOMAIN_TYPE_ID ");
        sql1.append("AND g.code='KTTS_LIST_PROVINCE' ");
        sql1.append("AND e.data_id=station.cat_province_id ");
        sql1.append("AND station.cat_station_id=cst.cat_station_id ");
        sql1.append("AND syn.construction_code=cst.code ");
        sql1.append("AND syn.type=2  ");
        sql1.append("AND syn.REAL_IE_TRANS_DATE >= to_date('"
                + getCurrentTimeStamp() + "','dd/MM/yyyy') ");
        sql1.append("AND a.SYS_USER_ID= '" + request.getSysUserId() + "' ");

        sql1.append("UNION ALL ");

        sql1.append("SELECT ");
        sql1.append("a.ORDER_CODE,a.CODE,a.REAL_IE_TRANS_DATE,nvl(a.CONFIRM,0)CONFIRM ");
        sql1.append("FROM ");
        sql1.append("STOCK_TRANS a ");
        sql1.append("WHERE ");
        sql1.append("type      = 2 ");
        sql1.append("AND status= 2 and a.BUSINESS_TYPE =2 ");
        sql1.append("AND shipper_id= '" + request.getSysUserId() + "' ");
        sql1.append("AND a.REAL_IE_TRANS_DATE >= to_date('"
                + getCurrentTimeStamp() + "','dd/MM/yyyy')) ");
        sql1.append("SELECT ");
        sql1.append("SUM(CASE WHEN confirm = 0 THEN 1 END) chotiepnhan, ");
        sql1.append("SUM(CASE WHEN confirm = 1 THEN 1 END) datiepnhan, ");
        sql1.append("SUM(CASE WHEN confirm = 2 THEN 1 END) datuchoi ");
        sql1.append("FROM tbl ");

        SQLQuery query1 = getSession().createSQLQuery(sql1.toString());

        query1.addScalar("chotiepnhan", new LongType());
        query1.addScalar("datiepnhan", new LongType());
        query1.addScalar("datuchoi", new LongType());

        query1.setResultTransformer(Transformers
                .aliasToBean(AIOCountConstructionTaskDTO.class));

        return (AIOCountConstructionTaskDTO) query1.list().get(0);
    }

    /**
     * GET ListSysStockTrans DTO
     *
     * @param StockTransRequest request
     * @return List<SynStockTransDTO>
     */
    public List<AIOSynStockTransDTO> getListSysStockTransDTO(
            AIOStockTransRequest request) {

        StringBuilder sql = new StringBuilder("");
        //VietNT_10/08/2019_start
        sql.append("with t as (select TO_NUMBER(CODE) duration from app_param WHERE PAR_TYPE = 'CONFIRM_TIME') ");
        //VietNT_end
        sql.append("SELECT ");
        sql.append("a.ORDER_CODE orderCode, ");
        sql.append("to_char(a.CODE) code, ");
        sql.append("to_date(TO_CHAR(a.REAL_IE_TRANS_DATE,'dd/MM/yyyy'),'dd/MM/yyyy') realIeTransDate, ");
        sql.append("NVL(a.CONFIRM,0) confirm, ");
        sql.append("'B' stockType, ");
        sql.append("NVL(a.STATE,0) state, ");
        sql.append("cons.CONSTRUCTION_ID constructionId, ");
        sql.append("cons.CODE consCode, ");
        sql.append("a.STOCK_NAME synStockName, ");
        sql.append("a.CREATED_BY_NAME synCreatedByName, ");
        sql.append("a.CREATED_DATE synCreatedDate, ");
        sql.append("a.LAST_SHIPPER_ID lastShipperId, ");
        sql.append("a.RECEIVER_ID receiverId, ");
        sql.append("a.STOCK_TRANS_ID synStockTransId ");
        sql.append(",a.STOCK_RECEIVE_ID stockReceiveId,a.STOCK_RECEIVE_CODE stockReceiveCode, 1 typeConfirm ");
        //VietNT_10/08/2019_start
        sql.append(",(trunc((a.REAL_IE_TRANS_DATE + (1/24 * t.duration)) - sysdate, 0) * 24) hoursToExpired ");
        //VietNT_end
        sql.append("FROM ");
        sql.append("STOCK_TRANS a ");
        sql.append("LEFT JOIN CONSTRUCTION cons ");
        sql.append("ON cons.CONSTRUCTION_ID   = a.CONSTRUCTION_ID ");
        sql.append("left join t on 1=1 ");
        sql.append("WHERE ");
        sql.append("a.TYPE =2 and a.status=2 ");
        // hoanm1_20190508_start_bosung type=12
        sql.append("AND a.BUSINESS_TYPE in(8,12) ");
        // hoanm1_20190508_end
        sql.append("AND a.REAL_IE_TRANS_DATE >=  trunc(sysdate)-90 ");
        sql.append("AND a.LAST_SHIPPER_ID    = '"
                + request.getSysUserRequest().getSysUserId() + "' ");
        // VietNT_20/06/2019_start
        sql.append("order by STOCK_TRANS_id desc ");
        // VietNT_end
        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("orderCode", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("realIeTransDate", new DateType());
        query.addScalar("confirm", new StringType());
        query.addScalar("stockType", new StringType());
        query.addScalar("state", new StringType());

        query.addScalar("constructionId", new LongType());
        query.addScalar("consCode", new StringType());
        query.addScalar("synStockName", new StringType());
        query.addScalar("synCreatedByName", new StringType());
        query.addScalar("synCreatedDate", new DateType());
        query.addScalar("lastShipperId", new LongType());
        query.addScalar("receiverId", new LongType());
        query.addScalar("synStockTransId", new LongType());
        query.addScalar("stockReceiveId", new LongType());
        query.addScalar("stockReceiveCode", new StringType());
        query.addScalar("typeConfirm", new LongType());
        query.addScalar("hoursToExpired", new LongType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDTO.class));
        return query.list();
    }

    public List<AIOSynStockTransDTO> getListStockTransCreated(
            AIOStockTransRequest request) {

        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT ");
        sql.append("a.ORDER_CODE orderCode, ");
        sql.append("to_char(a.CODE) code, ");
        sql.append("to_date(TO_CHAR(a.REAL_IE_TRANS_DATE,'dd/MM/yyyy'),'dd/MM/yyyy') realIeTransDate, ");
        sql.append("NVL(a.CONFIRM,0) confirm, ");
        sql.append("'B' stockType, ");
        sql.append("NVL(a.STATE,0) state, ");
        sql.append("a.STOCK_NAME synStockName, ");
        sql.append("a.CREATED_BY_NAME synCreatedByName, ");
        sql.append("a.CREATED_DATE synCreatedDate, ");
        sql.append("a.LAST_SHIPPER_ID lastShipperId, ");
        sql.append("a.RECEIVER_ID receiverId, ");
        sql.append("a.STOCK_TRANS_ID synStockTransId ");
        sql.append(",a.STOCK_RECEIVE_ID stockReceiveId,a.STOCK_RECEIVE_CODE stockReceiveCode, 0 typeConfirm ");
        sql.append("FROM ");
        sql.append("STOCK_TRANS a ");
        sql.append(" WHERE a.BUSINESS_TYPE in(8,12) and a.CREATED_BY    = '"
                + request.getSysUserRequest().getSysUserId() + "' ");
        sql.append(" order by a.STOCK_TRANS_id desc");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("orderCode", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("realIeTransDate", new DateType());
        query.addScalar("confirm", new StringType());
        query.addScalar("stockType", new StringType());
        query.addScalar("state", new StringType());
        query.addScalar("synStockName", new StringType());
        query.addScalar("synCreatedByName", new StringType());
        query.addScalar("synCreatedDate", new DateType());
        query.addScalar("lastShipperId", new LongType());
        query.addScalar("receiverId", new LongType());
        query.addScalar("synStockTransId", new LongType());
        query.addScalar("stockReceiveId", new LongType());
        query.addScalar("stockReceiveCode", new StringType());
        query.addScalar("typeConfirm", new LongType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDTO.class));
        return query.list();
    }

    /**
     * GET List SysStockTrans DetailDTO
     *
     * @param AIOSynStockTransDTO st
     * @return List<SynStockTransDetailDTO>
     */
    public List<AIOSynStockTransDetailDTO> getListSysStockTransDetailDTO(
            AIOSynStockTransDTO st) {
        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT ");
        sql.append("STOCK_TRANS_DETAIL_id synStockTransDetailId, ");
        sql.append("a.STOCK_TRANS_ID synStockTransId, ");
        sql.append("a.GOODS_NAME||'('||a.GOODS_UNIT_NAME ||')'  goodsName, ");
        sql.append("a.AMOUNT_REAL amountReal ");
        // aio_20190322_start
        sql.append(",ORDER_ID orderId,GOODS_TYPE goodsType,GOODS_TYPE_NAME goodsTypeName, ");
        sql.append("GOODS_ID goodsId,GOODS_CODE goodsCode,GOODS_NAME goodsNameImport,");
        sql.append("GOODS_IS_SERIAL goodsIsSerial,GOODS_STATE goodsState,");
        sql.append("GOODS_STATE_NAME goodsStateName,GOODS_UNIT_NAME goodsUnitName,");
        sql.append("GOODS_UNIT_ID goodsUnitId,AMOUNT_REAL amountOrder,TOTAL_PRICE totalPrice ");

        sql.append("FROM ");
        sql.append("STOCK_TRANS_DETAIL a ");
        sql.append("WHERE ");
        sql.append("STOCK_TRANS_ID = '" + st.getSynStockTransId() + "' ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("synStockTransId", new LongType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("amountReal", new DoubleType());
        query.addScalar("synStockTransDetailId", new LongType());

        query.addScalar("orderId", new LongType());
        query.addScalar("goodsType", new StringType());
        query.addScalar("goodsTypeName", new StringType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsNameImport", new StringType());
        query.addScalar("goodsIsSerial", new StringType());
        query.addScalar("goodsState", new StringType());
        query.addScalar("goodsStateName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("amountOrder", new DoubleType());
        query.addScalar("totalPrice", new DoubleType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDetailDTO.class));
        // aio_20190322_end

        return query.list();
    }

    /**
     * GET List SysStockTrans DetailDTO
     *
     * @param AIOSynStockTransDTO st
     * @return List<SynStockTransDetailDTO>
     */
    public AIOSynStockTransDetailDTO getNewestTransactionId(
            AIOStockTransRequest request) {
        StringBuilder sql = new StringBuilder("");
        if (request.getSynStockTransDto().getStockType().equals("A")) {
            sql.append("SELECT ");
            sql.append("max(ST_TRANSACTION_ID) maxTransactionId ");
            sql.append("FROM ST_TRANSACTION  ");
            sql.append("WHERE ");
            sql.append("STOCK_TRANS_ID = '"
                    + request.getSynStockTransDto().getSynStockTransId() + "' ");
            sql.append("AND TYPE           = '1' ");
        } else {
            sql.append("SELECT ");
            sql.append("max(ST_TRANSACTION_ID) maxTransactionId ");
            sql.append("FROM ST_TRANSACTION  ");
            sql.append("WHERE ");
            sql.append("STOCK_TRANS_ID = '"
                    + request.getSynStockTransDto().getSynStockTransId() + "' ");
            sql.append("AND TYPE           = '0' ");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("maxTransactionId", new LongType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDetailDTO.class));

        return (AIOSynStockTransDetailDTO) query.list().get(0);
    }

    /**
     * GET List MerEntity
     *
     * @param StockTransRequest request
     * @return List<MerEntityDTO>
     */
    public List<AIOMerEntityDTO> getListMerEntity(AIOStockTransRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT ");
        sql.append("a.GOODS_NAME goodsName, ");
        sql.append("a.GOODS_CODE goodsCode, ");
        sql.append("b.QUANTITY||'('||c.GOODS_UNIT_NAME ||')' quantity, ");
        sql.append("a.SERIAL serial, ");
        sql.append("a.CNT_CONTRACT_CODE cntConstractCode, ");
        sql.append("(SELECT name FROM cat_stock WHERE cat_stock.CAT_STOCK_ID = a.STOCK_ID)stockName, ");
        sql.append("a.PART_NUMBER partNumber, ");
        sql.append("a.MANUFACTURER_NAME manufactureName, ");
        sql.append("a.PRODUCING_COUNTRY_NAME productionCountryName ");
        sql.append(",b.PRICE,b.CELL_CODE cellCode,b.MER_ENTITY_ID merEntityId,b.GOODS_STATE goodState,b.QUANTITY quantityImport,b.QUANTITY_ISSUE quantityIssue ");
        sql.append(",b.stock_trans_id synStockTransId,b.STOCK_TRANS_DETAIL_ID synStockTransDetailId,b.stock_trans_detail_serial_id synStockTransDetailSerialId  ");
        sql.append("FROM ");
        sql.append("MER_ENTITY a, STOCK_TRANS_DETAIL_SERIAL b, STOCK_TRANS_DETAIL c  ");
        sql.append("WHERE  ");
        sql.append("a.MER_ENTITY_ID=b.MER_ENTITY_ID ");
        sql.append("AND b.STOCK_TRANS_DETAIL_ID = c.STOCK_TRANS_DETAIL_ID ");
        sql.append("AND c.STOCK_TRANS_DETAIL_ID = '"
                + request.getSynStockTransDetailDto()
                .getSynStockTransDetailId() + "' ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("serial", new StringType());
        query.addScalar("cntConstractCode", new StringType());
        query.addScalar("stockName", new StringType());
        query.addScalar("partNumber", new LongType());
        query.addScalar("manufactureName", new StringType());
        query.addScalar("productionCountryName", new StringType());
        query.addScalar("quantity", new StringType());

        query.addScalar("price", new DoubleType());
        query.addScalar("cellCode", new StringType());
        query.addScalar("merEntityId", new LongType());
        query.addScalar("goodState", new StringType());
        query.addScalar("quantityImport", new DoubleType());
        query.addScalar("quantityIssue", new DoubleType());
        query.addScalar("synStockTransId", new LongType());
        query.addScalar("synStockTransDetailId", new LongType());
        query.addScalar("synStockTransDetailSerialId", new LongType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOMerEntityDTO.class));

        return query.list();
    }

    public List<AIOMerEntityDTO> getListDetailSerialDTO(
            AIOStockTransRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT ");
        sql.append("a.GOODS_NAME goodsName, ");
        sql.append("a.GOODS_CODE goodsCode, ");
        sql.append("b.QUANTITY||'('||c.GOODS_UNIT_NAME ||')' quantity, ");
        sql.append("a.SERIAL serial, ");
        sql.append("a.CNT_CONTRACT_CODE cntConstractCode, ");
        sql.append("(SELECT name FROM cat_stock WHERE cat_stock.CAT_STOCK_ID = a.STOCK_ID)stockName, ");
        sql.append("a.PART_NUMBER partNumber, ");
        sql.append("a.MANUFACTURER_NAME manufactureName, ");
        sql.append("a.PRODUCING_COUNTRY_NAME productionCountryName ");
        sql.append(",b.PRICE,b.CELL_CODE cellCode,b.MER_ENTITY_ID merEntityId,b.GOODS_STATE goodState,b.QUANTITY quantityImport,b.QUANTITY_ISSUE quantityIssue ");
        sql.append(",b.stock_trans_id synStockTransId,b.STOCK_TRANS_DETAIL_ID synStockTransDetailId,b.stock_trans_detail_serial_id synStockTransDetailSerialId  ");
        sql.append("FROM ");
        sql.append("MER_ENTITY a, STOCK_TRANS_DETAIL_SERIAL b, STOCK_TRANS_DETAIL c  ");
        sql.append("WHERE  ");
        sql.append("a.MER_ENTITY_ID=b.MER_ENTITY_ID ");
        sql.append("AND b.STOCK_TRANS_DETAIL_ID = c.STOCK_TRANS_DETAIL_ID ");
        sql.append("AND c.STOCK_TRANS_DETAIL_ID  in (:lstDetailId)");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameterList("lstDetailId", request
                .getSynStockTransDetailDto().getLstTransDetailId());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("serial", new StringType());
        query.addScalar("cntConstractCode", new StringType());
        query.addScalar("stockName", new StringType());
        query.addScalar("partNumber", new LongType());
        query.addScalar("manufactureName", new StringType());
        query.addScalar("productionCountryName", new StringType());
        query.addScalar("quantity", new StringType());

        query.addScalar("price", new DoubleType());
        query.addScalar("cellCode", new StringType());
        query.addScalar("merEntityId", new LongType());
        query.addScalar("goodState", new StringType());
        query.addScalar("quantityImport", new DoubleType());
        query.addScalar("quantityIssue", new DoubleType());
        query.addScalar("synStockTransId", new LongType());
        query.addScalar("synStockTransDetailId", new LongType());
        query.addScalar("synStockTransDetailSerialId", new LongType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOMerEntityDTO.class));

        return query.list();
    }

    /**
     * UPDATE DeliveryMaterials
     *
     * @param StockTransRequest request
     * @return int result
     * @throws ParseException
     */
    public int UpdateStocktrainConfirmByReceiver(AIOStockTransRequest request)
            throws ParseException {
        StringBuilder sql = new StringBuilder("");
        if (request.getSynStockTransDto().getStockType().equals("A")) {
            sql.append("UPDATE ");
            sql.append("SYN_STOCK_TRANS sst ");
            sql.append("SET ");
            sql.append("sst.STATE           = 1, ");
            sql.append("sst.LAST_SHIPPER_ID = '"
                    + request.getSysUserRequest().getSysUserId() + "', ");
            sql.append("sst.UPDATED_BY      = '"
                    + request.getSysUserRequest().getSysUserId() + "', ");
            sql.append("sst.RECEIVER_ID     = '"
                    + request.getSynStockTransDto().getReceiverId() + "', ");
            sql.append("sst.UPDATED_DATE    = '" + getCurrentTime() + "' ");
            sql.append("WHERE ");
            sql.append("sst.SYN_STOCK_TRANS_ID  = '"
                    + request.getSynStockTransDto().getSynStockTransId() + "' ");

        } else {

            sql.append("UPDATE ");
            sql.append("STOCK_TRANS sst ");
            sql.append("SET ");
            sql.append("sst.STATE           = 1, ");
            sql.append("sst.LAST_SHIPPER_ID = '"
                    + request.getSysUserRequest().getSysUserId() + "', ");
            sql.append("sst.UPDATED_BY      = '"
                    + request.getSysUserRequest().getSysUserId() + "', ");
            sql.append("sst.RECEIVER_ID     = '"
                    + request.getSynStockTransDto().getReceiverId() + "', ");
            sql.append("sst.UPDATED_DATE    = '" + getCurrentTime() + "' ");
            sql.append("WHERE ");
            sql.append("sst.STOCK_TRANS_ID  = '"
                    + request.getSynStockTransDto().getSynStockTransId() + "' ");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());

        return query.executeUpdate();
    }

    /**
     * UPDATE DeliveryMaterials
     *
     * @param StockTransRequest request
     * @return int result
     * @throws ParseException
     */
    public int UpdateStocktrainByReceiver(AIOStockTransRequest request)
            throws ParseException {
        StringBuilder sql = new StringBuilder("");
        if (request.getSynStockTransDto().getStockType().equals("A")) {
            sql.append("UPDATE ");
            sql.append("SYN_STOCK_TRANS sst ");
            sql.append("SET ");
            sql.append("sst.STATE               = 2, ");
            sql.append("sst.UPDATED_BY          = '"
                    + request.getSysUserRequest().getSysUserId() + "', ");
            sql.append("sst.CONFIRM_DESCRIPTION = '"
                    + request.getSynStockTransDto().getConfirmDescription()
                    + "', ");
            sql.append("sst.UPDATED_DATE        = '" + getCurrentTime() + "' ");
            sql.append("WHERE ");
            sql.append("sst.SYN_STOCK_TRANS_ID  = '"
                    + request.getSynStockTransDto().getSynStockTransId() + "' ");

        } else {

            sql.append("UPDATE ");
            sql.append("STOCK_TRANS sst ");
            sql.append("SET ");
            sql.append("sst.STATE               = 2, ");
            sql.append("sst.UPDATED_BY          = '"
                    + request.getSysUserRequest().getSysUserId() + "', ");
            sql.append("sst.CONFIRM_DESCRIPTION = '"
                    + request.getSynStockTransDto().getConfirmDescription()
                    + "', ");
            sql.append("sst.UPDATED_DATE        = '" + getCurrentTime() + "' ");
            sql.append("WHERE ");
            sql.append("sst.STOCK_TRANS_ID      = '"
                    + request.getSynStockTransDto().getSynStockTransId() + "' ");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());

        return query.executeUpdate();
    }

    /**
     * Update Receiver State
     *
     * @param StockTransRequest request
     * @return int result
     * @throws ParseException
     */
    public int UpdateStockTransState(AIOStockTransRequest request)
            throws ParseException {
        StringBuilder sql = new StringBuilder("");
        if (request.getSynStockTransDto().getStockType().equals("A")) {
            sql.append("UPDATE ");
            sql.append("SYN_STOCK_TRANS sst ");
            sql.append("SET ");
            sql.append("sst.STATE                   = 0, ");
            sql.append("sst.UPDATED_BY              = '"
                    + request.getSysUserRequest().getSysUserId() + "', ");
            sql.append("sst.RECEIVER_ID             = '"
                    + request.getSysUserReceiver().getSysUserId() + "', ");
            sql.append("sst.CONFIRM_DESCRIPTION     = '"
                    + request.getSynStockTransDto().getDescription() + "', ");
            sql.append("sst.UPDATED_DATE            = '" + getCurrentTime()
                    + "' ");
            sql.append("WHERE ");
            sql.append("sst.SYN_STOCK_TRANS_ID  = '"
                    + request.getSynStockTransDto().getSynStockTransId() + "' ");

        } else {

            sql.append("UPDATE ");
            sql.append("STOCK_TRANS st ");
            sql.append("SET ");
            sql.append("st.STATE                   = 0, ");
            sql.append("st.UPDATED_BY              = '"
                    + request.getSysUserRequest().getSysUserId() + "', ");
            sql.append("st.RECEIVER_ID             = '"
                    + request.getSysUserReceiver().getSysUserId() + "', ");
            sql.append("st.CONFIRM_DESCRIPTION     = '"
                    + request.getSynStockTransDto().getDescription() + "', ");
            sql.append("st.UPDATED_DATE            = '" + getCurrentTime()
                    + "' ");
            sql.append("WHERE ");
            sql.append("st.STOCK_TRANS_ID          = '"
                    + request.getSynStockTransDto().getSynStockTransId() + "' ");

        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());

        return query.executeUpdate();
    }

    /**
     * Save StTransaction
     *
     * @param StockTransRequest request
     * @return int result
     * @throws ParseException
     */
    public int SaveStTransaction(AIOStockTransRequest request)
            throws ParseException {

        boolean isInvestor = request.getSynStockTransDto().getStockType()
                .equals("A");
        String type;
        if (isInvestor) {
            type = "1";
        } else {
            type = "0";
        }

        StringBuilder sql = new StringBuilder("");
        sql.append("INSERT INTO ST_TRANSACTION ");
        sql.append("(ST_TRANSACTION_ID, DESCRIPTION, OLD_LAST_SHIPPER_ID, NEW_LAST_SHIPPER_ID ,STOCK_TRANS_ID, TYPE, CONFIRM, CREATED_DATE, CREATED_USER_ID) ");
        sql.append("VALUES ( ");
        sql.append("ST_TRANSACTION_seq.nextval, ");
        sql.append("'" + request.getSynStockTransDto().getDescription() + "', ");
        sql.append("'" + request.getSysUserRequest().getSysUserId() + "', ");
        sql.append("'" + request.getSysUserReceiver().getSysUserId() + "', ");
        sql.append("'" + request.getSynStockTransDto().getSynStockTransId()
                + "', ");
        sql.append("'" + type + "', ");
        sql.append("'0', ");
        sql.append("'" + getCurrentTime() + "', ");
        sql.append("'" + request.getSysUserRequest().getSysUserId() + "' ");
        sql.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());

        return query.executeUpdate();
    }

    /**
     * Update Stocktrain History
     *
     * @param StockTransRequest request, boolean isInvestor
     * @return int result
     * @throws ParseException
     */
    public int UpdateStocktrainHistory(AIOStockTransRequest request,
                                       boolean isInvestor) throws ParseException {
        StringBuilder sqlConfirmred = new StringBuilder("");
        sqlConfirmred.append("UPDATE ");
        sqlConfirmred.append("ST_TRANSACTION ");
        sqlConfirmred.append("SET ");
        sqlConfirmred.append("CONFIRM_DATE         = '" + getCurrentTime()
                + "', ");
        // sqlConfirmred.append("LAST_SHIPPER_ID = '" +
        // request.getSysUserRequest().getSysUserId() + "', ");
        sqlConfirmred.append("CONFIRM              = '1' ");
        sqlConfirmred.append("WHERE ");
        sqlConfirmred.append("STOCK_TRANS_ID  = :stockTransId ");

        SQLQuery queryConfirmred = getSession().createSQLQuery(
                sqlConfirmred.toString());
        queryConfirmred.setParameter("stockTransId", request
                .getSynStockTransDto().getSynStockTransId());

        return queryConfirmred.executeUpdate();
    }

    /**
     * Update Stocktrain History By Receiver
     *
     * @param StockTransRequest request, boolean isInvestor
     * @return int result
     * @throws ParseException
     */
    public int UpdateStocktrainConfirmByLastShipper(
            AIOStockTransRequest request, boolean isInvestor,
            AIOSynStockTransDetailDTO newestTransactionId)
            throws ParseException {
        StringBuilder sqlConfirmred = new StringBuilder("");
        sqlConfirmred.append("UPDATE ");
        sqlConfirmred.append("ST_TRANSACTION ");
        sqlConfirmred.append("SET ");
        sqlConfirmred.append("CONFIRM_DATE         = '" + getCurrentTime()
                + "', ");
        sqlConfirmred.append("CONFIRM              = '1' ");
        sqlConfirmred.append("WHERE ");
        if (newestTransactionId != null) {
            sqlConfirmred.append("ST_TRANSACTION_ID  = :stTransactionId ");
        } else {
            sqlConfirmred.append("STOCK_TRANS_ID  = :stockTransId ");
        }

        SQLQuery queryConfirmred = getSession().createSQLQuery(
                sqlConfirmred.toString());

        if (newestTransactionId != null) {
            queryConfirmred.setParameter("stTransactionId",
                    newestTransactionId.getMaxTransactionId());
        } else {
            queryConfirmred.setParameter("stockTransId", request
                    .getSynStockTransDto().getSynStockTransId());
        }

        return queryConfirmred.executeUpdate();
    }

    /**
     * Update Stocktrain History By Refused Confirm
     *
     * @param StockTransRequest request, boolean isInvestor
     * @return int result
     * @throws ParseException
     */
    public int UpdateStocktrainHistoryByRefusedByReceiver(
            AIOStockTransRequest request, boolean isInvestor,
            AIOSynStockTransDetailDTO newestTransactionId)
            throws ParseException {
        StringBuilder sqlRefusedConfirm = new StringBuilder("");
        sqlRefusedConfirm.append("UPDATE ");
        sqlRefusedConfirm.append("ST_TRANSACTION ");
        sqlRefusedConfirm.append("SET ");
        sqlRefusedConfirm.append("CONFIRM_DATE         = '" + getCurrentTime()
                + "', ");
        sqlRefusedConfirm.append("CONFIRM              = '2' ");
        sqlRefusedConfirm.append("WHERE ");

        if (newestTransactionId != null) {
            sqlRefusedConfirm.append("ST_TRANSACTION_ID  = :stTransactionId ");
        } else {
            sqlRefusedConfirm.append("STOCK_TRANS_ID  = :stockTransId ");
        }

        SQLQuery queryChapNhan = getSession().createSQLQuery(
                sqlRefusedConfirm.toString());

        if (newestTransactionId != null) {
            queryChapNhan.setParameter("stTransactionId",
                    newestTransactionId.getMaxTransactionId());
        } else {
            queryChapNhan.setParameter("stockTransId", request
                    .getSynStockTransDto().getSynStockTransId());
        }

        return queryChapNhan.executeUpdate();
    }

    /**
     * Update Stocktrain History Refused Confirm By Receiver
     *
     * @param StockTransRequest request, boolean isInvestor
     * @return int result
     * @throws ParseException
     */
    public int UpdateStocktrainHistoryRefusedByLastShipper(
            AIOStockTransRequest request, boolean isInvestor)
            throws ParseException {
        StringBuilder sqlRefusedConfirm = new StringBuilder("");
        sqlRefusedConfirm.append("UPDATE ");
        sqlRefusedConfirm.append("ST_TRANSACTION ");
        sqlRefusedConfirm.append("SET ");
        sqlRefusedConfirm.append("CONFIRM_DATE         = '" + getCurrentTime()
                + "', ");
        sqlRefusedConfirm.append("CONFIRM              = '2' ");
        sqlRefusedConfirm.append("WHERE ");
        sqlRefusedConfirm.append("STOCK_TRANS_ID  = :stockTransId ");

        SQLQuery queryChapNhan = getSession().createSQLQuery(
                sqlRefusedConfirm.toString());
        queryChapNhan.setParameter("stockTransId", request
                .getSynStockTransDto().getSynStockTransId());

        return queryChapNhan.executeUpdate();
    }

    /**
     * Update Stock Trans
     *
     * @param StockTransRequest request
     * @return int result
     */
    public int updateStockTrans(AIOStockTransRequest request) {
        if (request.getSysUserRequest().getFlag() == 1) {
            StringBuilder sqlChapNhan = new StringBuilder("");
            sqlChapNhan.append("UPDATE ");
            sqlChapNhan.append("STOCK_TRANS st ");
            sqlChapNhan.append("SET ");
            sqlChapNhan.append("st.CONFIRM         = 1, ");
            //VietNT_05/07/2019_start
//          sqlChapNhan.append("st.sign_state = 3, ");
            //VietNT_end
            sqlChapNhan.append("st.UPDATED_BY      = :sysUserId, ");
            sqlChapNhan.append("st.UPDATED_DATE    = :newDate, ");
            sqlChapNhan.append("st.LAST_SHIPPER_ID = :sysUserId ");
            sqlChapNhan.append("WHERE ");
            sqlChapNhan.append("st.STOCK_TRANS_ID  = :stockTransId ");
            SQLQuery queryChapNhan = getSession().createSQLQuery(
                    sqlChapNhan.toString());

            queryChapNhan.setParameter("sysUserId", request.getSysUserRequest()
                    .getSysUserId());
            queryChapNhan.setParameter("newDate", new Date());
            queryChapNhan.setParameter("stockTransId", request
                    .getSynStockTransDto().getSynStockTransId());

            return queryChapNhan.executeUpdate();
        }
        StringBuilder sqlTuChoi = new StringBuilder("");
        sqlTuChoi.append("UPDATE ");
        sqlTuChoi.append("STOCK_TRANS st ");
        sqlTuChoi.append("SET ");
        //VietNT_05/07/2019_start
        sqlTuChoi.append("st.CONFIRM             = 2, ");
        //VietNT_end
        sqlTuChoi.append("st.UPDATED_BY          = :sysUserId, ");
        sqlTuChoi.append("st.UPDATED_DATE        = :newDate, ");
        sqlTuChoi.append("st.CONFIRM_DESCRIPTION = :confirmDescription ");
        sqlTuChoi.append("WHERE ");
        sqlTuChoi.append("st.STOCK_TRANS_ID      = :stockTransId ");
        SQLQuery queryTuChoi = getSession()
                .createSQLQuery(sqlTuChoi.toString());

        queryTuChoi.setParameter("sysUserId", request.getSysUserRequest()
                .getSysUserId());
        queryTuChoi.setParameter("newDate", new Date());
        queryTuChoi.setParameter("stockTransId", request.getSynStockTransDto()
                .getSynStockTransId());
        queryTuChoi.setParameter("confirmDescription", request
                .getSynStockTransDto().getConfirmDescription());

        return queryTuChoi.executeUpdate();
    }

    /**
     * Update SynStockTrans
     *
     * @param StockTransRequest request
     * @return int result
     */
    public int updateSynStockTrans(AIOStockTransRequest request) {
        if (request.getSysUserRequest().getFlag() >= 1) {
            StringBuilder sqlChapNhan = new StringBuilder("");
            sqlChapNhan.append("UPDATE ");
            sqlChapNhan.append("SYN_STOCK_TRANS ");
            sqlChapNhan.append("SET ");
            sqlChapNhan.append("CONFIRM = 1, ");
            sqlChapNhan.append("UPDATED_BY         = :sysUserId, ");
            sqlChapNhan.append("UPDATED_DATE       = :newDate ");
            // sqlChapNhan.append("LAST_SHIPPER_ID = :sysUserId ");
            sqlChapNhan.append("WHERE ");
            sqlChapNhan.append("SYN_STOCK_TRANS_ID = :stockTransId ");

            SQLQuery queryChapNhan = getSession().createSQLQuery(
                    sqlChapNhan.toString());
            queryChapNhan.setParameter("sysUserId", request.getSysUserRequest()
                    .getSysUserId());
            queryChapNhan.setParameter("newDate", new Date());
            queryChapNhan.setParameter("stockTransId", request
                    .getSynStockTransDto().getSynStockTransId());

            return queryChapNhan.executeUpdate();
        }
        StringBuilder sqlTuChoi = new StringBuilder("");

        sqlTuChoi.append("UPDATE ");
        sqlTuChoi.append("SYN_STOCK_TRANS ");
        sqlTuChoi.append("SET ");
        sqlTuChoi.append("CONFIRM = 2, ");
        sqlTuChoi.append("UPDATED_BY          = :sysUserId, ");
        sqlTuChoi.append("UPDATED_DATE        = :newDate, ");
        sqlTuChoi.append("CONFIRM_DESCRIPTION = :confirmDescription ");
        sqlTuChoi.append("WHERE ");
        sqlTuChoi.append("SYN_STOCK_TRANS_ID  = :stockTransId ");
        SQLQuery queryTuChoi = getSession()
                .createSQLQuery(sqlTuChoi.toString());

        queryTuChoi.setParameter("sysUserId", request.getSysUserRequest()
                .getSysUserId());
        queryTuChoi.setParameter("newDate", new Date());
        queryTuChoi.setParameter("confirmDescription", request
                .getSynStockTransDto().getConfirmDescription());
        queryTuChoi.setParameter("stockTransId", request.getSynStockTransDto()
                .getSynStockTransId());

        return queryTuChoi.executeUpdate();

    }

    /**
     * get CongNo
     *
     * @param SysUserRequest request
     * @return List<MerEntityDTO>
     */
    public List<AIOMerEntityDTO> getCongNo(SysUserRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT CASE ");
        sql.append("WHEN type=1  ");
        sql.append("THEN 'A'  ");
        sql.append("ELSE 'B'  ");
        sql.append("END stockType, ");
        sql.append("a.CONSTRUCTION_CODE constructionCode, ");
        sql.append("a.GOODS_NAME||'('||a.GOODS_UNIT_NAME||')' goodsName, ");
        sql.append("a.SERIAL,nvl(a.AMOUNT,0) numbeRepository  ");
        sql.append("FROM ");
        sql.append("SYN_STOCK_TOTAL a ");
        sql.append("WHERE ");
        sql.append("a.SYS_USER_ID = :sysUserId ");
        sql.append("ORDER BY ");
        sql.append("a.CONSTRUCTION_CODE, ");
        sql.append("SERIAL desc, ");
        sql.append("a.GOODS_NAME||'('||a.GOODS_UNIT_NAME||')' ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("stockType", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("serial", new StringType());
        // query.addScalar("goodsIsSerial", new StringType());
        query.addScalar("numbeRepository", new LongType());
        query.setParameter("sysUserId", request.getSysUserId());
        // query.setParameter("createDate", getCurrentTimeStamp());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOMerEntityDTO.class));

        return query.list();
    }

    /**
     * get CongNo
     *
     * @param SysUserRequest request
     * @return List<MerEntityDTO>
     */
    public AIOCountConstructionTaskDTO countMaterials(SysUserRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append("WITH TBL AS ( ");
        sql.append("  SELECT  NVL(a.CONFIRM,0) CONFIRM ");
        sql.append("  FROM ");
        sql.append("    STOCK_TRANS a ");
        sql.append("    LEFT JOIN CONSTRUCTION cons ");
        sql.append("    ON cons.CONSTRUCTION_ID   = a.CONSTRUCTION_ID ");
        sql.append("    WHERE ");
        sql.append("    a.TYPE                    = 2 ");
        sql.append("    and a.BUSINESS_TYPE in(8,12) ");
        sql.append("    AND a.REAL_IE_TRANS_DATE >=  trunc(sysdate)-90 ");
        sql.append("    AND a.LAST_SHIPPER_ID    = '" + request.getSysUserId()
                + "' ");
        sql.append("  ) ");
        sql.append("SELECT  ");
        sql.append("  NVL(SUM(CASE WHEN confirm = 0 THEN 1 END),0) chotiepnhan, ");
        sql.append("  NVL(SUM(CASE WHEN confirm = 1 THEN 1 END),0) datiepnhan, ");
        sql.append("  NVL(SUM(CASE WHEN confirm = 2 THEN 1 END),0) datuchoi ");
        sql.append("FROM tbl ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("chotiepnhan", new LongType());
        query.addScalar("datiepnhan", new LongType());
        query.addScalar("datuchoi", new LongType());

        query.setResultTransformer(Transformers
                .aliasToBean(AIOCountConstructionTaskDTO.class));

        return (AIOCountConstructionTaskDTO) query.list().get(0);
    }

    /**
     * Get current time
     *
     * @return Current time
     * @throws ParseException
     */
    private String getCurrentTime() throws ParseException {
        Date now = new Date();
        String dateNow = now.toString();
        // Tue May 22 13:56:18 GMT+07:00 2018
        SimpleDateFormat dt = new SimpleDateFormat(
                "EEE MMM d HH:mm:ss zzz yyyy");
        Date dateString = dt.parse(dateNow);
        SimpleDateFormat formater = new SimpleDateFormat("dd-MMMM-yy");
        return formater.format(dateString);
    }

    // END SERVICE MOBILE STOCK_TRANS

    // VietNT_20190116_start

    /**
     * Get all records with businessType = 1, confirm = 2, type = 2
     *
     * @param criteria
     * @return
     */
    public List<AIOSynStockTransDTO> doSearch(AIOSynStockTransDTO criteria) {
        StringBuilder sql = this.createDoSearchBaseQuery();
        sql.append(", g.name sysGroupName ");
        sql.append(", cs.code customField ");
        sql.append(", NULL AS isSyn ");
        sql.append(", 1 AS synType ");
        sql.append("FROM SYN_STOCK_TRANS sst ");
        sql.append("LEFT JOIN CONSTRUCTION t on t.construction_id = sst.construction_id "
                + "LEFT JOIN SYS_GROUP g on g.SYS_GROUP_ID = t.SYS_GROUP_ID "
                + "LEFT JOIN CAT_STATION cs on cs.cat_station_id = t.cat_station_id "
                + "WHERE 1=1 ");
        sql.append("AND sst.BUSSINESS_TYPE in(1,2) ");
        // sql.append("AND sst.CONFIRM = 2 ");
        sql.append("AND sst.TYPE = '2' ");
        // VietNT_20190219_start
        if (StringUtils.isNotEmpty(criteria.getConfirm())) {
            sql.append("AND trim(sst.CONFIRM) = :confirm ");
        } else {
            sql.append("AND trim(sst.CONFIRM) IN (0, 2) ");
        }
        // VietNT_end

        // query by
        // orderCode
        if (StringUtils.isNotEmpty(criteria.getOrderCode())) {
            sql.append("AND upper(sst.ORDER_CODE) like upper(:orderCode) escape '&' ");
        }

        // code
        if (StringUtils.isNotEmpty(criteria.getCode())) {
            sql.append("AND upper(sst.CODE) like upper(:code) escape '&' ");
        }

        // constructionCode
        if (StringUtils.isNotEmpty(criteria.getConstructionCode())) {
            sql.append("AND upper(sst.CONSTRUCTION_CODE) like upper(:constructionCode) escape '&' ");
        }

        // sysGroupId
        if (null != criteria.getSysGroupId()) {
            sql.append("AND t.sys_group_id = :sysGroupId ");
        }

        // query by realIeTransDate
        if (null != criteria.getDateFrom()) {
            sql.append("AND TRUNC(sst.CREATED_DATE) >= :dateFrom ");
        }
        if (null != criteria.getDateTo()) {
            sql.append("AND TRUNC(sst.CREATED_DATE) <= :dateTo ");
        }

        sql.append("ORDER BY SYN_STOCK_TRANS_ID DESC ");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        // VietNT_20190219_start
        if (StringUtils.isNotEmpty(criteria.getConfirm())) {
            query.setParameter("confirm", criteria.getConfirm());
            queryCount.setParameter("confirm", criteria.getConfirm());
        }
        // VietNT_end

        if (StringUtils.isNotEmpty(criteria.getOrderCode())) {
            query.setParameter("orderCode", "%" + criteria.getOrderCode() + "%");
            queryCount.setParameter("orderCode", "%" + criteria.getOrderCode()
                    + "%");
        }

        // code
        if (StringUtils.isNotEmpty(criteria.getCode())) {
            query.setParameter("code", "%" + criteria.getCode() + "%");
            queryCount.setParameter("code", "%" + criteria.getCode() + "%");
        }

        // constructionCode
        if (StringUtils.isNotEmpty(criteria.getConstructionCode())) {
            query.setParameter("constructionCode",
                    "%" + criteria.getConstructionCode() + "%");
            queryCount.setParameter("constructionCode",
                    "%" + criteria.getConstructionCode() + "%");
        }

        // sysGroupId
        if (null != criteria.getSysGroupId()) {
            query.setParameter("sysGroupId", criteria.getSysGroupId());
            queryCount.setParameter("sysGroupId", criteria.getSysGroupId());
        }

        // query by realIeTransDate
        if (null != criteria.getDateFrom()) {
            query.setParameter("dateFrom", criteria.getDateFrom());
            queryCount.setParameter("dateFrom", criteria.getDateFrom());
        }
        if (null != criteria.getDateTo()) {
            query.setParameter("dateTo", criteria.getDateTo());
            queryCount.setParameter("dateTo", criteria.getDateTo());
        }

        query.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDTO.class));
        this.addQueryScalarDoSearch(query);
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("isSyn", new StringType());
        query.addScalar("synType", new LongType());
        query.addScalar("customField", new StringType());
        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    @SuppressWarnings("Duplicates")
    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query,
                                                      SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1)
                    * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    private StringBuilder createDoSearchBaseQuery() {
        StringBuilder sql = new StringBuilder("SELECT "
                + "sst.SYN_STOCK_TRANS_ID synStockTransId, "
                + "sst.ORDER_ID orderId, " + "sst.ORDER_CODE orderCode, "
                + "sst.CODE code, " + "sst.TYPE type, "
                + "sst.STOCK_ID stockId, " + "sst.STATUS status, "
                + "sst.SIGN_STATE signState, "
                + "sst.FROM_STOCK_TRANS_ID fromStockTransId, "
                + "sst.DESCRIPTION description, "
                + "sst.CREATED_BY_NAME createdByName, "
                + "sst.CREATED_DEPT_ID createdDeptId, "
                + "sst.CREATED_DEPT_NAME createdDeptName, "
                + "sst.UPDATED_BY updatedBy, "
                + "sst.UPDATED_DATE updatedDate, "
                + "sst.REAL_IE_TRANS_DATE realIeTransDate, "
                + "sst.REAL_IE_USER_ID realIeUserId, "
                + "sst.REAL_IE_USER_NAME realIeUserName, "
                + "sst.SHIPPER_ID shipperId, "
                + "sst.SHIPPER_NAME shipperName, "
                + "sst.CANCEL_DATE cancelDate, " + "sst.CANCEL_BY cancelBy, "
                + "sst.CANCEL_REASON_NAME cancelReasonName, "
                + "sst.CANCEL_DESCRIPTION cancelDescription, "
                + "sst.VOFFICE_TRANSACTION_CODE vofficeTransactionCode, "
                + "sst.SHIPMENT_CODE shipmentCode, "
                + "sst.CONTRACT_CODE contractCode, "
                + "sst.PROJECT_CODE projectCode, " + "sst.CUST_ID custId, "
                + "sst.CREATED_BY createdBy, "
                + "sst.CREATED_DATE createdDate, "
                + "sst.CANCEL_BY_NAME cancelByName, "
                + "sst.BUSSINESS_TYPE_NAME bussinessTypeName, "
                + "sst.IN_ROAL inRoal, "
                + "sst.DEPT_RECEIVE_NAME deptReceiveName, "
                + "sst.DEPT_RECEIVE_ID deptReceiveId, "
                + "sst.STOCK_RECEIVE_ID stockReceiveId, "
                + "sst.STOCK_RECEIVE_CODE stockReceiveCode, "
                + "sst.PARTNER_ID partnerId, "
                + "sst.SYN_TRANS_TYPE synTransType, "
                + "sst.STOCK_CODE stockCode, " + "sst.STOCK_NAME stockName, "
                + "sst.BUSSINESS_TYPE bussinessType, "
                + "sst.CONSTRUCTION_ID constructionId, "
                + "sst.CONFIRM confirm, "
                + "sst.CONSTRUCTION_CODE constructionCode, "
                + "sst.LAST_SHIPPER_ID lastShipperId, "
                + "sst.CONFIRM_DESCRIPTION confirmDescription, "
                + "sst.RECEIVER_ID receiverId, " + "sst.STATE state ");
        return sql;
    }

    private void addQueryScalarDoSearch(SQLQuery query) {
        query.addScalar("synStockTransId", new LongType());
        query.addScalar("orderId", new LongType());
        query.addScalar("orderCode", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("type", new StringType());
        query.addScalar("stockId", new LongType());
        query.addScalar("status", new StringType());
        query.addScalar("signState", new StringType());
        query.addScalar("fromStockTransId", new LongType());
        query.addScalar("description", new StringType());
        query.addScalar("createdByName", new StringType());
        query.addScalar("createdDeptId", new LongType());
        query.addScalar("createdDeptName", new StringType());
        query.addScalar("updatedBy", new LongType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("realIeTransDate", new DateType());
        query.addScalar("realIeUserId", new StringType());
        query.addScalar("realIeUserName", new StringType());
        query.addScalar("shipperId", new LongType());
        query.addScalar("shipperName", new StringType());
        query.addScalar("cancelDate", new DateType());
        query.addScalar("cancelBy", new LongType());
        query.addScalar("cancelReasonName", new StringType());
        query.addScalar("cancelDescription", new StringType());
        query.addScalar("vofficeTransactionCode", new StringType());
        query.addScalar("shipmentCode", new StringType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("projectCode", new StringType());
        query.addScalar("custId", new LongType());
        query.addScalar("createdBy", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("cancelByName", new StringType());
        query.addScalar("bussinessTypeName", new StringType());
        query.addScalar("inRoal", new StringType());
        query.addScalar("deptReceiveName", new StringType());
        query.addScalar("deptReceiveId", new LongType());
        query.addScalar("stockReceiveId", new LongType());
        query.addScalar("stockReceiveCode", new StringType());
        query.addScalar("partnerId", new LongType());
        query.addScalar("synTransType", new StringType());
        query.addScalar("stockCode", new StringType());
        query.addScalar("stockName", new StringType());
        query.addScalar("bussinessType", new StringType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("confirm", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("lastShipperId", new LongType());
        query.addScalar("confirmDescription", new StringType());
        query.addScalar("receiverId", new LongType());
        query.addScalar("state", new StringType());
    }

    // public int updateForwardSynStockTrans(Long synStockTransId, Long
    // provinceChiefId, String provinceChiefName, Date updateDate) {

    /**
     * Update field of SYN_STOCK_TRANS table for action forward to group:
     * shipper_id = provinceChiefId last_shipper_id = provinceChiefId
     * shipper_name = provinceChiefName update_by = logged in user update_date =
     * sysDate confirm = 0
     *
     * @param updateInfo update info
     * @return Number of aff
     */
    public int updateForwardSynStockTrans(AIOSynStockTransDTO updateInfo) {
        // Cập nhật syn_stock_trans.shipper_id,
        // syn_stock_trans.shipper_name,
        // syn_stock_trans.last_shipper_id
        // theo tỉnh trưởng của đơn vị được chọn và tỉnh của công trình.
        // Cập nhật syn_stock_trans.confirm = 0
        String sql = "UPDATE SYN_STOCK_TRANS sst " + "SET "
                + "sst.shipper_id = :shipperId, "
                + "sst.shipper_name = :shipperName, "
                + "sst.last_shipper_id = :shipperId, "
                + "sst.updated_by = :updateBy, "
                + "sst.updated_date = :updateDate, " + "sst.confirm = 0 " +

                "WHERE " + "sst.SYN_STOCK_TRANS_ID = :synStockTransId ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("synStockTransId", updateInfo.getSynStockTransId());
        query.setParameter("shipperId", updateInfo.getSysUserId());
        query.setParameter("shipperName", updateInfo.getSysUserName());
        query.setParameter("updateBy", updateInfo.getUpdatedBy());
        query.setParameter("updateDate", updateInfo.getUpdatedDate());
        return query.executeUpdate();
    }

    /**
     * Update field of CONSTRUCTION table for action forward to group
     * sys_group_id = sysGroupId
     *
     * @param sysGroupId     id of Group forward to
     * @param constructionId id of construction
     * @return Number of affected records
     */
    public int updateConstructionForwardSynStockTrans(Long sysGroupId,
                                                      Long constructionId) {
        StringBuilder sql = new StringBuilder("UPDATE CONSTRUCTION t " + "SET "
                + "t.sys_group_id = :sysGroupId " + "WHERE "
                + "t.construction_id = :constructionId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("sysGroupId", sysGroupId);
        query.setParameter("constructionId", constructionId);

        return query.executeUpdate();
    }

    public AIOSynStockTransDTO getProvinceChiefId(Long sysGroupId,
                                                  Long constructionId) {
        String sql = "select "
                + "cfu.sys_user_id sysUserId, "
                + "su.full_name sysUserName "
                + "from config_user_province cfu "
                + "left join sys_user su on cfu.sys_user_id = su.sys_user_id "
                + "where "
                + "cfu.sys_group_id = :sysGroupId "
                + "and cfu.cat_province_id = "
                + "(SELECT cs.cat_province_id "
                + "FROM construction t "
                + "LEFT JOIN cat_station cs ON cs.cat_station_id = t.cat_station_id "
                + "WHERE t.construction_id = :constructionId) ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDTO.class));
        query.setParameter("sysGroupId", sysGroupId);
        query.setParameter("constructionId", constructionId);
        query.addScalar("sysUserId", new LongType());
        query.addScalar("sysUserName", new StringType());

        return (AIOSynStockTransDTO) query.uniqueResult();
    }

    // VietNT_end
    // VietNT_20190125_start
    public List<SysUserDTO> findUsersWithPermission(String permission,
                                                    Long sysGroupId) {
        String sql = "SELECT " + "DISTINCT a.SYS_USER_ID " + ", a.EMAIL email "
                + ", a.PHONE_NUMBER phone " + "FROM " + "sys_user a, "
                + "user_role b, " + "sys_role c, " + "user_role_data d, "
                + "domain_data e, " + "role_permission role_per, "
                + "permission pe, " + "operation op, " + "ad_resource ad "
                + "WHERE " + "a.sys_user_id = b.sys_user_id "
                + "AND b.sys_role_id = c.sys_role_id "
                + "AND b.user_role_id = d.user_role_id "
                + "AND d.domain_data_id = e.domain_data_id "
                + "AND c.sys_role_id = role_per.sys_role_id "
                + "AND role_per.permission_id = pe.permission_id "
                + "AND pe.operation_id = op.operation_id "
                + "AND pe.ad_resource_id = ad.ad_resource_id "
                + "AND upper(op.code ||' ' ||ad.code) LIKE :permission ";
        if (null != sysGroupId) {
            sql += "AND e.data_id = :sysGroupId ";
        }

        SQLQuery query = super.getSession().createSQLQuery(sql);
        if (null != sysGroupId) {
            query.setParameter("sysGroupId", sysGroupId);
        }

        query.setParameter("permission", "%" + permission + "%");

        query.addScalar("email", new StringType());
        query.addScalar("phone", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));

        return query.list();
    }

    /**
     * Get sysUser's Name & group_name_level2
     *
     * @param sysUserId sysUserId
     * @return SynStockTransDTO.sysUserName = full_name
     * SynStockTransDTO.customField = group_name_level2
     */
    public AIOSynStockTransDTO getRejectorInfo(Long sysUserId) {
        String sql = "SELECT " + "sg.group_name_level2 customField, "
                + "su.full_name sysUserName "
                + "FROM SYS_USER su, sys_group sg " + "WHERE 1=1 "
                + " and su.sys_user_id = :sysUserId "
                + "AND su.sys_group_id = sg.sys_group_id ";

        SQLQuery query = super.getSession().createSQLQuery(sql);
        query.setParameter("sysUserId", sysUserId);
        query.addScalar("sysUserName", new StringType());
        query.addScalar("customField", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDTO.class));
        List<AIOSynStockTransDTO> list = query.list();
        if (list != null && !list.isEmpty()) {
            return list.get(0);
        } else {
            return null;
        }
    }

    /**
     * Cập nhât dữ liệu trong bảng SYN_STOCK_DAILY_IMPORT_EXPORT với is_confirm
     * = 2 (đã nhận), ie_date = sysdate với điều kiện STOCK_TRANS_TYPE = 1 query
     * by synStockTrans code
     */
    public int updateSynStockDailyImportExport(String code) {
        String sql = "UPDATE SYN_STOCK_DAILY_IMPORT_EXPORT " + "SET "
                + "IS_CONFIRM = 2 " + ", ie_date = :today " + "WHERE "
                + "STOCK_TRANS_TYPE = 1 " + "AND SYN_STOCK_TRANS_CODE = :code ";

        SQLQuery query = super.getSession().createSQLQuery(sql);
        query.setParameter("code", code);
        query.setParameter("today", new Date());
        return query.executeUpdate();
    }

    /**
     * update Confirm date = sysDate 1st time
     *
     * @param id synStockTransId
     * @return
     */
    public int updateConfirmDateFirstTime(Long id) {
        String sql = "UPDATE " + "SYN_STOCK_TRANS " + "SET "
                + "CONFIRM_DATE = :today " + "WHERE "
                + "SYN_STOCK_TRANS_ID = :stockTransId ";

        SQLQuery queryChapNhan = getSession().createSQLQuery(sql);
        queryChapNhan.setParameter("today", new Date());
        queryChapNhan.setParameter("stockTransId", id);

        return queryChapNhan.executeUpdate();
    }

    // VietNT_end
    // VietNT_20190219_start

    /**
     * Get user TTKT when CN reject
     *
     * @param sysUserId        User id tinh truong CN
     * @param constructionCode Ma cong trinh
     * @return User id tinh truong TTKT cung province
     */
    public AIOSynStockTransDTO getUserTTKTProvince(Long sysUserId,
                                                   String constructionCode) {
        String sql = "SELECT max(SYS_USER_ID) sysUserId FROM config_user_province WHERE cat_province_code IN "
                + "(SELECT pro.code "
                + "FROM construction cst, cat_station cat, cat_province pro "
                + "where "
                + "cst.CAT_STATION_ID = cat.CAT_STATION_ID "
                + "and cat.cat_province_id = pro.cat_province_id "
                + "and cst.code = :constructionCode ) "
                + "and SYS_USER_ID != :sysUserId  ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDTO.class));
        query.setParameter("constructionCode", constructionCode);
        query.setParameter("sysUserId", sysUserId);
        query.addScalar("sysUserId", new LongType());

        List<AIOSynStockTransDTO> list = query.list();
        if (list != null && !list.isEmpty()) {
            return list.get(0);
        } else {
            return null;
        }
    }

    /**
     * update lastShipperId = user tinh truong TTKT
     *
     * @param lastShipperId
     * @param synStockTransId
     * @return
     */
    public int updateLastShipperSynStockTrans(Long lastShipperId,
                                              Long synStockTransId) {
        String sql = "UPDATE syn_stock_trans " + "SET "
                + "LAST_SHIPPER_ID = :lastShipperId " + ", CONFIRM = 0 "
                + "WHERE syn_stock_trans_id = :synStockTransId ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("lastShipperId", lastShipperId);
        query.setParameter("synStockTransId", synStockTransId);

        return query.executeUpdate();
    }

    // VietNT_end
    // aio_20190315_start
    public List<AIOSynStockTransDTO> getListStock(SysUserRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append("select cat_stock_id stockId,code stockCode,name stockName,type,0 sequenceStockId from cat_stock cat where type in(4) and level_stock=2 ");
        sql.append(" and cat.sys_group_id in( select (case when s.group_level=4 then (select sys_group_id from sys_group b where ");
        sql.append(" b.sys_group_id= (select parent_id from sys_group c where c.sys_group_id=s.parent_id)) ");
        sql.append(" when s.group_level=3 then (select sys_group_id from sys_group b where b.sys_group_id=s.parent_id) ");
        sql.append(" else s.sys_group_id end) sys_group_id from sys_group s where s.sys_group_id= :sysGroupId ) ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("sysGroupId", request.getDepartmentId());
        query.addScalar("stockId", new LongType());
        query.addScalar("stockCode", new StringType());
        query.addScalar("stockName", new StringType());
        query.addScalar("type", new StringType());
        query.addScalar("sequenceStockId", new LongType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDTO.class));

        return query.list();
    }

    public List<AIOSynStockTransDetailDTO> getListGood(SysUserRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append("select cat.goods_id goodsId,cat.code goodsCode,cat.code||'-'||cat.name ||'('|| cat.unit_type_name ||')' goodsName,"
                + " GOODS_TYPE goodsType,name goodsNameImport,IS_SERIAL goodsIsSerial,cat.UNIT_TYPE goodsUnitId,cat.UNIT_TYPE_NAME goodsUnitName from goods cat where cat.status =1 and cat.IS_AIO=1 order by cat.name ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());

        query.addScalar("goodsType", new StringType());
        query.addScalar("goodsNameImport", new StringType());
        query.addScalar("goodsIsSerial", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsUnitName", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDetailDTO.class));

        return query.list();
    }

    /**
     * Get list personal warehouse
     *
     * @param id        can be sysGroupId or sysUserId
     * @param keySearch must have for type 2, 3, 4
     * @param condition condition for query
     * @return
     */
    public List<AIOSynStockTransDetailDTO> getListPersonWarehouse(Long id, String keySearch, String condition
                                                                  //VietNT_19/09/2019_start
            , Long sysUserId) {
        //VietNT_end
        String conditionGoods = StringUtils.EMPTY;
        if (StringUtils.isNotEmpty(keySearch)) {
            conditionGoods = "and (upper(m.goods_code) like upper(:keySearch) escape '&' " +
                    "or upper(m.GOODS_NAME) like upper(:keySearch) escape '&') ";
        }

        String sql = "select " +
                "m.GOODS_ID goodsId, " +
                "m.GOODS_CODE goodsCode, " +
                "m.GOODS_NAME goodsName, " +
//                "m.cat_unit_id goodsUnitId, " +
//                "m.cat_unit_name goodsUnitName, " +
//                "(CASE WHEN m.serial IS NULL THEN 0 ELSE 1 END) goodsIsSerial, " +
                "sum(m.amount) amount, " +
                "cs.code || '-' || cs.name text " +
                "from mer_entity m " +
                "left join cat_stock cs on cs.cat_stock_id = m.stock_id " +
                "where m.status = 4 " +
                condition +
                conditionGoods +
                "group by m.GOODS_ID,m.GOODS_CODE,m.GOODS_NAME, cs.code || '-' || cs.name ";
//                "m.cat_unit_id, m.cat_unit_name, (CASE WHEN m.serial IS NULL THEN 0 ELSE 1 END) ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("id", id);
        if (sysUserId != null) {
            query.setParameter("sysUserId", sysUserId);
        }
        if (StringUtils.isNotEmpty(keySearch)) {
            query.setParameter("keySearch", "%" + keySearch + "%");
        }
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
//        query.addScalar("goodsUnitId", new LongType());
//        query.addScalar("goodsUnitName", new StringType());
//        query.addScalar("goodsIsSerial", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("text", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOSynStockTransDetailDTO.class));
        return query.list();
    }

//    public Long insertDeliveryBill(AIOStockTransRequest obj) {
//        try {
//            String userName = getUserName(obj.getSysUserRequest().getSysUserId());
//            String GroupName = getGroupName(obj.getSysUserRequest().getDepartmentId());
//            AIOSynStockTransDTO stockTransDto = new AIOSynStockTransDTO();
//            stockTransDto.setCode(obj.getSynStockTransDto().getCode());
//            stockTransDto.setStockId(obj.getSynStockTransDto().getStockId());
//            stockTransDto.setStockCode(obj.getSynStockTransDto().getStockCode());
//            stockTransDto.setStockName(obj.getSynStockTransDto().getStockName());
//            stockTransDto.setType("2");
//            stockTransDto.setStatus("1");
//            stockTransDto.setSignState("1");
//            stockTransDto.setDescription(obj.getSynStockTransDto().getDescription());
//            stockTransDto.setBussinessType("8");
//            stockTransDto.setBusinessTypeName("Xuất kho nhân viên");
//            stockTransDto.setApproved(0L);
//            stockTransDto.setCreatedByName(userName);
//            stockTransDto.setCreatedDeptId(obj.getSysUserRequest().getDepartmentId());
//            stockTransDto.setCreatedDeptName(GroupName);
//            // stockTransDto.setRealIeTransDate(new Date());
//            AIOSynStockTransDTO stock = getStockReceive(obj.getSynStockTransDto().getType(), obj.getSysUserRequest().getSysUserId());
//            if (stock == null) {
//                return -1L;
//            }
//            stockTransDto.setStockReceiveId(stock.getStockId());
//            stockTransDto.setStockReceiveCode(stock.getStockCode());
//            stockTransDto.setShipperId(obj.getSysUserRequest().getSysUserId());
//            stockTransDto.setLastShipperId(obj.getSysUserRequest().getSysUserId());
//            stockTransDto.setShipperName(userName);
//            // stockTransDto.setRealIeUserId(String.valueOf(obj
//            // .getSysUserRequest().getSysUserId()));
//            // stockTransDto.setRealIeUserName(userName);
//            stockTransDto.setCreatedBy(obj.getSysUserRequest().getSysUserId());
//            stockTransDto.setCreatedDate(new Date());
//            stockTransDto.setDeptReceiveName(GroupName);
//            stockTransDto.setDeptReceiveId(obj.getSysUserRequest().getDepartmentId());
//            Long id = this.saveObject(stockTransDto.toModel());
//            if (obj.getLstStockTransDetail() != null) {
//                int resultUpdate;
//                for (AIOSynStockTransDetailDTO dto : obj.getLstStockTransDetail()) {
//                    resultUpdate = this.manualInsertStockTransDetail(id, dto.getGoodsId(), dto.getAmount());
//                }
//            }
//        } catch (Exception ex) {
//            ex.printStackTrace();
//            this.getSession().clear();
//            return 0L;
//        }
//        return 1L;
//    }

    public String getUserName(Long sysUserId) {
        String sql = new String(
                "select  a.FULL_NAME sysUserName from sys_user a where a.sys_user_id= :sysUserId ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("sysUserId", sysUserId);
        query.addScalar("sysUserName", new StringType());
        List<String> lstUser = query.list();
        if (lstUser != null && lstUser.size() > 0) {
            return lstUser.get(0).toString();
        }
        return "";
    }

    public String getGroupName(Long sysGroupId) {
        String sql = new String(
                "select name from sys_group where sys_group_id = :sysGroupId ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("sysGroupId", sysGroupId);
        query.addScalar("name", new StringType());
        List<String> lstGroupName = query.list();
        if (lstGroupName != null && lstGroupName.size() > 0) {
            return lstGroupName.get(0).toString();
        }
        return "";
    }

    public List<Long> getListStockReceiveId(Long sysUserId) {
        String sql = new String(
                "select cat_stock_id catStockId from cat_stock where type in (4) and SYS_USER_ID = :sysUserId ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("sysUserId", sysUserId);
        query.addScalar("catStockId", new LongType());
        return query.list();
    }

    /*
    public AIORevenueDTO countRevenue(SysUserRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append(" select sum(case when to_char(a.end_date,'MM/yyyy')=to_char(sysdate,'MM/yyyy') then (a.amount) else 0 end) revenueMonth,");
        sql.append(" sum(case when trunc(a.end_date)=trunc(sysdate) then (a.amount) else 0 end) revenueDay, ");
        sql.append(" sum(case when to_char(a.end_date,'MM/yyyy')=to_char(sysdate,'MM/yyyy') then (a.DISCOUNT_STAFF) else 0 end) discountMonth, ");
        sql.append(" sum(case when trunc(a.end_date)=trunc(sysdate) then (a.DISCOUNT_STAFF) else 0 end) discountDay ");
        sql.append(" from AIO_ACCEPTANCE_RECORDS a where to_char(a.end_date,'MM/yyyy')=to_char(sysdate,'MM/yyyy') and performer_id = :sysUserId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("revenueMonth", new DoubleType());
        query.addScalar("revenueDay", new DoubleType());
        query.addScalar("discountMonth", new DoubleType());
        query.addScalar("discountDay", new DoubleType());
        query.setParameter("sysUserId", request.getSysUserId());
        query.setResultTransformer(Transformers
                .aliasToBean(AIORevenueDTO.class));

        return (AIORevenueDTO) query.list().get(0);
    }

    //VietNT_05/08/2019_start
    public AIORevenueDTO getUserSalary(Long id) {
        String sql = "select " +
                "nvl(sum(case when trunc(a.end_date, 'DD') = trunc(sysdate, 'DD') and cp.type = 1 " +
                "then (cp.salary) else 0 end), 0) salaryDailyPerform, " +
                "nvl(sum(case when trunc(a.end_date, 'DD') = trunc(sysdate, 'DD') and cp.type = 2 " +
                "then (cp.salary) else 0 end), 0) salaryDailySale, " +
                "nvl(sum(case when cp.type = 1 then (cp.salary) else 0 end), 0) salaryMonthPerform, " +
                "nvl(sum(case when cp.type = 2 then (cp.salary) else 0 end), 0) salaryMonthSale " +
                "from aio_contract_payroll cp " +
                "left join AIO_ACCEPTANCE_RECORDS a on a.CONTRACT_DETAIL_ID = cp.CONTRACT_DETAIL_ID " +
                "where 1=1 " +
                "and cp.SYS_USER_CODE = (select employee_code from sys_user where sys_user_id = :id) " +
                "and trunc(a.end_date,'MM') = trunc(sysdate, 'MM') ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("salaryDailyPerform", new DoubleType());
        query.addScalar("salaryDailySale", new DoubleType());
        query.addScalar("salaryMonthPerform", new DoubleType());
        query.addScalar("salaryMonthSale", new DoubleType());
        query.setParameter("id", id);
        query.setResultTransformer(Transformers.aliasToBean(AIORevenueDTO.class));

        return (AIORevenueDTO) query.list().get(0);
    }
    //VietNT_end

    public List<AIORevenueDTO> getListRevenue(SysUserRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append(" select a.CUSTOMER_NAME customerName,a.CUSTOMER_PHONE customerPhone,a.AMOUNT amount ");
        sql.append(" from AIO_ACCEPTANCE_RECORDS a where to_char(a.end_date,'MM/yyyy')=to_char(sysdate,'MM/yyyy') and performer_id = :sysUserId order by end_date desc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("amount", new DoubleType());
        query.setParameter("sysUserId", request.getSysUserId());
        query.setResultTransformer(Transformers
                .aliasToBean(AIORevenueDTO.class));

        return query.list();
    }
    */
    public AIORevenueDTO countRevenue(Long userId, Date queryDate) {
        String sql = " select " +
                "sum(case when to_char(a.end_date,'MM/yyyy') = to_char(:queryDate,'MM/yyyy') then (a.amount) else 0 end) revenueMonth, " +
                "sum(case when trunc(a.end_date) = trunc(sysdate) then (a.amount) else 0 end) revenueDay, " +
                "sum(case when to_char(a.end_date,'MM/yyyy') = to_char(:queryDate,'MM/yyyy') then (a.DISCOUNT_STAFF) else 0 end) discountMonth, " +
                "sum(case when trunc(a.end_date) = trunc(sysdate) then (a.DISCOUNT_STAFF) else 0 end) discountDay " +
                "from AIO_ACCEPTANCE_RECORDS a " +
                "where to_char(a.end_date,'MM/yyyy') = to_char(:queryDate,'MM/yyyy') " +
                "and (a.performer_id = :sysUserId " +
                "or (select c.seller_id from aio_contract c where c.contract_id = a.contract_id) = :sysUserId)";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("revenueMonth", new DoubleType());
        query.addScalar("revenueDay", new DoubleType());
        query.addScalar("discountMonth", new DoubleType());
        query.addScalar("discountDay", new DoubleType());
        query.setParameter("sysUserId", userId);
        query.setParameter("queryDate", queryDate);
        query.setResultTransformer(Transformers
                .aliasToBean(AIORevenueDTO.class));

        return (AIORevenueDTO) query.list().get(0);
    }

    //VietNT_05/08/2019_start
    public AIORevenueDTO getUserSalary(Long id, Date queryDate, boolean getDailySalary) {
        String salaryDaily = "0 salaryDailySale, 0 salaryDailyPerform, ";
        if (getDailySalary) {
            salaryDaily = "nvl(sum(case when to_char(a.end_date, 'DD/MM/yyyy') = to_char(sysdate, 'DD/MM/yyyy') and cp.type = 1 " +
                    "then (cp.salary) else 0 end), 0) salaryDailySale, " +
                    "nvl(sum(case when to_char(a.end_date, 'DD/MM/yyyy') = to_char(sysdate, 'DD/MM/yyyy') and cp.type = 2 " +
                    "then (cp.salary) else 0 end), 0) salaryDailyPerform, ";
        }
        String sql = "select " +
                salaryDaily +
                "nvl(sum(case when cp.type = 1 then (cp.salary) else 0 end), 0) salaryMonthSale, " +
                "nvl(sum(case when cp.type = 2 then (cp.salary) else 0 end), 0) salaryMonthPerform " +
                "from aio_contract_payroll cp " +
                "left join AIO_ACCEPTANCE_RECORDS a on a.CONTRACT_DETAIL_ID = cp.CONTRACT_DETAIL_ID " +
                "where 1=1 " +
                "and cp.SYS_USER_CODE = (select employee_code from sys_user where sys_user_id = :id) " +
                "and to_char(a.end_date,'MM/yyyy') = to_char(:queryDate, 'MM/yyyy') ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("salaryDailyPerform", new DoubleType());
        query.addScalar("salaryDailySale", new DoubleType());
        query.addScalar("salaryMonthPerform", new DoubleType());
        query.addScalar("salaryMonthSale", new DoubleType());
        query.setParameter("id", id);
        query.setParameter("queryDate", queryDate);
        query.setResultTransformer(Transformers.aliasToBean(AIORevenueDTO.class));

        return (AIORevenueDTO) query.list().get(0);
    }
    //VietNT_end

    public List<AIORevenueDTO> getListRevenue(Long userId, Date queryDate) {
        StringBuilder sql = new StringBuilder("");
        sql.append(" select a.CUSTOMER_NAME customerName,a.CUSTOMER_PHONE customerPhone,a.AMOUNT amount ");
        sql.append(" from AIO_ACCEPTANCE_RECORDS a where to_char(a.end_date,'MM/yyyy')=to_char(:queryDate,'MM/yyyy') " +
                "and (performer_id = :sysUserId " +
                "or (select created_user from aio_contract where contract_id = a.contract_id) = :sysUserId) " +
                "order by end_date desc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("amount", new DoubleType());
        query.setParameter("sysUserId", userId);
        query.setParameter("queryDate", queryDate);
        query.setResultTransformer(Transformers
                .aliasToBean(AIORevenueDTO.class));

        return query.list();
    }

    public void insertBillImportSock(AIOStockTransRequest obj) {
        String userName = getUserName(obj.getSysUserRequest().getSysUserId());
        String GroupName = getGroupName(obj.getSysUserRequest()
                .getDepartmentId());
        AIOSynStockTransDTO stockTransDto = new AIOSynStockTransDTO();
        // stockTransDto.setCode(obj.getSynStockTransDto().getCode());
        Long sequence = getSequenceStock();
        stockTransDto.setCode("PNK_"
                + obj.getSynStockTransDto().getStockReceiveCode() + "/19/"
                + sequence);
        stockTransDto.setType("1");
        stockTransDto.setStockId(obj.getSynStockTransDto().getStockReceiveId());
        stockTransDto.setStockCode(obj.getSynStockTransDto()
                .getStockReceiveCode());
        // hoanm1_20190509_start
        AIOContractDTO stockName = getStockNameTotal(obj.getSynStockTransDto()
                .getStockReceiveId());
        if (stockName != null) {
            stockTransDto.setStockName(stockName.getStockName());
        }
        // hoanm1_20190509_end
        stockTransDto.setStatus("2");
        stockTransDto.setSignState("3");
        stockTransDto.setFromStockTransId(obj.getSynStockTransDto()
                .getSynStockTransId());
        stockTransDto.setDescription("Nhập kho nhân viên");
        stockTransDto.setCreatedByName(userName);
        stockTransDto.setCreatedDeptId(obj.getSysUserRequest()
                .getDepartmentId());
        stockTransDto.setCreatedDeptName(GroupName);
        stockTransDto.setRealIeTransDate(new Date());
        stockTransDto.setRealIeUserId(String.valueOf(obj.getSysUserRequest()
                .getSysUserId()));
        stockTransDto.setRealIeUserName(userName);
        stockTransDto.setShipperId(obj.getSysUserRequest().getSysUserId());
        stockTransDto.setShipperName(userName);
        stockTransDto.setCreatedBy(obj.getSysUserRequest().getSysUserId());
        stockTransDto.setCreatedDate(new Date());
        stockTransDto.setBusinessTypeName("Nhập kho nhân viên");
        stockTransDto.setDeptReceiveName(GroupName);
        stockTransDto.setDeptReceiveId(obj.getSysUserRequest()
                .getDepartmentId());
        stockTransDto.setBussinessType("8");
        Long id = this.saveObject(stockTransDto.toModel());
        //VietNT_18/07/2019_start
        if (id < 1) {
            throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + ": PXK");
        }
        //VietNT_end
        if (obj.getLstStockTransDetail() != null) {
            for (AIOSynStockTransDetailDTO dto : obj.getLstStockTransDetail()) {
                AIOSynStockTransDetailDTO dtoDetail = new AIOSynStockTransDetailDTO();
                dtoDetail.setStockTransId(id);
                dtoDetail.setOrderId(dto.getOrderId());
                dtoDetail.setGoodsType(dto.getGoodsType());
                dtoDetail.setGoodsTypeName(dto.getGoodsTypeName());
                dtoDetail.setGoodsId(dto.getGoodsId());
                dtoDetail.setGoodsCode(dto.getGoodsCode());
                dtoDetail.setGoodsIsSerial(dto.getGoodsIsSerial());
                dtoDetail.setGoodsState(dto.getGoodsState());
                dtoDetail.setGoodsStateName(dto.getGoodsStateName());
                dtoDetail.setGoodsName(dto.getGoodsNameImport());
                dtoDetail.setGoodsUnitId(dto.getGoodsUnitId());
                dtoDetail.setGoodsUnitName(dto.getGoodsUnitName());
                dtoDetail.setAmountOrder(dto.getAmountOrder());
                dtoDetail.setAmountReal(dto.getAmountOrder());
                dtoDetail.setTotalPrice(dto.getTotalPrice());
                Long idDetail = aioStockTransDetailDAO.saveObject(dtoDetail
                        .toModel());
                //VietNT_18/07/2019_start
                if (idDetail < 1) {
                    throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + ": chi tiết PXK");
                }
                //VietNT_end
                LOGGER.error("Hoanm1 start: xác nhận phiếu xuất có stock_trans_detail");
                LOGGER.error(id + "_" + idDetail);
                LOGGER.error("Hoanm1 end: xác nhận phiếu xuất có stock_trans_detail");
                List<AIOStockTransDetailSerialDTO> getListDetailSerial = getListDetailSerial(dto
                        .getSynStockTransDetailId());
                for (AIOStockTransDetailSerialDTO bo : getListDetailSerial) {
                    bo.setStockTransId(id);
                    bo.setStockTransDetailId(idDetail);
                    Long idDetailSerial = aioStockTransDetailSerialDAO
                            .saveObject(bo.toModel());
                    //VietNT_18/07/2019_start
                    if (idDetailSerial < 1) {
                        throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + ": chi tiết PXK serial");
                    }
                    //VietNT_end
                    // aioStockTransDetailSerialDAO.update(bo.toModel());
                    // this.getSession().flush();
                    // update merEntity
                    StringBuilder sql = new StringBuilder("");
                    sql.append("UPDATE MER_ENTITY st SET st.STATUS=4,st.STOCK_ID = :stockReceiveId WHERE st.MER_ENTITY_ID  = :merEntityId");
                    SQLQuery query = getSession()
                            .createSQLQuery(sql.toString());
                    query.setParameter("stockReceiveId", obj
                            .getSynStockTransDto().getStockReceiveId());
                    query.setParameter("merEntityId", bo.getMerEntityId());
                    query.executeUpdate();
                }
                // tinh lai apply_price
                StringBuilder sqlPrice = new StringBuilder("");
                sqlPrice.append("update MER_ENTITY a set a.apply_price=(select round((sum(amount*apply_price)/sum(amount)),2) from MER_ENTITY mer where mer.stock_id=a.stock_id "
                        + " and mer.GOODS_ID=a.GOODS_ID and mer.status=4 ) where a.stock_id = :stockReceiveId and a.GOODS_ID = :goodsId and a.status =4 ");
                SQLQuery queryPrice = getSession().createSQLQuery(
                        sqlPrice.toString());
                queryPrice.setParameter("stockReceiveId", obj
                        .getSynStockTransDto().getStockReceiveId());
                queryPrice.setParameter("goodsId", dto.getGoodsId());
                queryPrice.executeUpdate();

                // check exit stock_goods_total
                // hoanm1_20190424_start
                AIOSynStockTransDTO stockTotal = getStockGoodTotal(obj
                                .getSynStockTransDto().getStockReceiveId(),
                        dto.getGoodsId());
                StringBuilder sql = new StringBuilder("");
                if (stockTotal != null) {
                    sql.append("UPDATE stock_goods_total st SET change_date=sysdate, st.amount= :amount + "
                            + stockTotal.getAmount()
                            + ",st.amount_issue = :amount + "
                            + stockTotal.getAmountIssue()
                            + " WHERE st.stock_goods_total_id  = :stockGoodsTotalId");
                    SQLQuery query = getSession()
                            .createSQLQuery(sql.toString());
                    query.setParameter("amount", dto.getAmountOrder());
                    query.setParameter("stockGoodsTotalId",
                            stockTotal.getStockGoodsTotalId());
                    query.executeUpdate();
                } else {
                    AIOStockGoodsTotalDTO dtoTotal = new AIOStockGoodsTotalDTO();
                    dtoTotal.setStockId(obj.getSynStockTransDto()
                            .getStockReceiveId());
                    dtoTotal.setGoodsId(dto.getGoodsId());
                    dtoTotal.setGoodsState(dto.getGoodsState());
                    dtoTotal.setGoodsStateName(dto.getGoodsStateName());
                    dtoTotal.setGoodsCode(dto.getGoodsCode());
                    dtoTotal.setGoodsName(dto.getGoodsNameImport());
                    dtoTotal.setStockCode(obj.getSynStockTransDto()
                            .getStockReceiveCode());
                    // hoanm1_20190509_start
                    // AIOContractDTO stockName =
                    // getStockNameTotal(obj.getSynStockTransDto().getStockReceiveId());
                    if (stockName != null) {
                        dtoTotal.setStockName(stockName.getStockName());
                    }
                    dtoTotal.setGoodsTypeName(dto.getGoodsTypeName());
                    // hoanm1_20190509_end
                    dtoTotal.setGoodsType(Long.parseLong(dto.getGoodsType()));
                    dtoTotal.setGoodsIsSerial(dto.getGoodsIsSerial());
                    dtoTotal.setGoodsUnitId(dto.getGoodsUnitId());
                    dtoTotal.setGoodsUnitName(dto.getGoodsUnitName());
                    dtoTotal.setAmount(dto.getAmountOrder());
                    dtoTotal.setChangeDate(new Date());
                    dtoTotal.setAmountIssue(dto.getAmountOrder());
                    Long idTotal = aioStockGoodsTotalDAO.saveObject(dtoTotal
                            .toModel());
                    //VietNT_18/07/2019_start
                    if (idTotal < 1) {
                        throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + ": hàng tồn kho");
                    }
                    //VietNT_end
                }
                // hoanm1_20190424_end
            }
        } else {
            LOGGER.error("Hoanm1 start: xác nhận phiếu xuất không có stock_trans_detail");
            LOGGER.error(id);
            LOGGER.error("Hoanm1 end: xác nhận phiếu xuất không có stock_trans_detail");
        }
    }

    public AIOSynStockTransDTO getStockGoodTotal(Long StockId, Long goodId) {
        String sql = new String(
                "select a.stock_id stockId,a.stock_goods_total_id stockGoodsTotalId, a.amount,a.amount_issue amountIssue from stock_goods_total a where stock_id = :stockId and goods_id = :goodId and goods_state = 1 ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("stockId", StockId);
        query.setParameter("goodId", goodId);
        query.addScalar("stockGoodsTotalId", new LongType());
        query.addScalar("stockId", new LongType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("amountIssue", new DoubleType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDTO.class));
        return (AIOSynStockTransDTO) query.uniqueResult();
    }

    public long getSequenceStock() {
        String sql = new String(
                "select cat_stock_seq.nextval sequenceStockId from dual ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("sequenceStockId", new LongType());
        List<Long> lstSequence = query.list();
        if (lstSequence != null && lstSequence.size() > 0) {
            return lstSequence.get(0);
        }
        return -1;
    }

    public AIOSynStockTransDTO getStockReceive(String type, Long sysUserId) {
        String sql = new String(
                "select a.cat_stock_id stockId,a.code stockCode from cat_stock a where type = :type and SYS_USER_ID = :sysUserId ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("type", type);
        query.setParameter("sysUserId", sysUserId);
        query.addScalar("stockId", new LongType());
        query.addScalar("stockCode", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDTO.class));
        return (AIOSynStockTransDTO) query.uniqueResult();
    }

    public void updatePriceMer(Long stockReceiveId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("");
        sql.append("UPDATE MER_ENTITY st SET st.STATUS=4,st.STOCK_ID = :stockReceiveId WHERE st.MER_ENTITY_ID  = :merEntityId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", stockReceiveId);
        query.executeUpdate();

    }

    public List<AIOStockTransDetailSerialDTO> getListDetailSerial(
            Long stockTransDetailId) {
        StringBuilder sql = new StringBuilder("");
        sql.append(" select distinct a.serial serial,b.APPLY_PRICE price,a.CELL_CODE cellCode,a.MER_ENTITY_ID merEntityId,a.GOODS_STATE goodsState,a.QUANTITY quantity,a.QUANTITY_ISSUE quantityIssue ");
        sql.append(" from STOCK_TRANS_DETAIL_SERIAL a,MER_ENTITY b where a.MER_ENTITY_id=b.MER_ENTITY_id and a.STOCK_TRANS_DETAIL_ID = :stockTransDetailId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("serial", new StringType());
        query.addScalar("price", new DoubleType());
        query.addScalar("cellCode", new StringType());
        query.addScalar("merEntityId", new LongType());
        query.addScalar("goodsState", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("quantityIssue", new DoubleType());
        query.setParameter("stockTransDetailId", stockTransDetailId);
        query.setResultTransformer(Transformers
                .aliasToBean(AIOStockTransDetailSerialDTO.class));

        return query.list();
    }

    // aio_20190315_end
    // hoanm1_20190420_start
    public AIOSynStockTransDTO getStockExport(SysUserRequest request) {
        String sql = new String(
                "select a.cat_stock_id stockId,a.code stockCode,a.name stockName,cat_stock_seq.nextval sequenceStockId from cat_stock a where type = 4 and SYS_USER_ID = :sysUserId ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("sysUserId", request.getSysUserId());
        query.addScalar("stockId", new LongType());
        query.addScalar("stockCode", new StringType());
        query.addScalar("stockName", new StringType());
        query.addScalar("sequenceStockId", new LongType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDTO.class));
        List<AIOSynStockTransDTO> lstStock = query.list();
        if (lstStock != null && lstStock.size() > 0) {
            return lstStock.get(0);
        }
        return (AIOSynStockTransDTO) query.uniqueResult();
    }

    // thangtv24 - 120719 start
    public List<AIOSynStockTransDTO> getListUserStock(SysUserRequest request) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("sg.path path ")
                .append("FROM  sys_user su ")
                .append("LEFT JOIN sys_group sg ON su.sys_group_id = sg.sys_group_id ")
                .append("WHERE su.sys_user_id = :sysUserId");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("sysUserId", request.getSysUserId());
        query.addScalar("path", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDTO.class));
        // AIOSynStockTransDTO aioSynStockTransDTO = (AIOSynStockTransDTO)
        // query.uniqueResult();
        String path = ((AIOSynStockTransDTO) query.uniqueResult()).getPath();
        String[] parts = path.split("/", 4);
        String grouplv2 = parts[2];
        // String grouplv2 = "260657";

        // select list user name
        StringBuilder sql1 = new StringBuilder("SELECT ")
                .append("su.sys_user_id    sysUserIdReceive, ")
                .append("su.login_name || '-' || su.full_name sysUserNameReceive, ")
                .append("sg.name sysGroupNameReceive, ")
                .append("su.sys_group_id   sysGroupIdReceive, ")
                .append("su.login_name     loginNameReceive, ")
                .append("su.email          emailReceive, ")
                .append("su.full_name      fullNameReceive ")
                .append("FROM  sys_user su ")
                .append("INNER JOIN sys_group sg ON su.sys_group_id = sg.sys_group_id ")
                .append("AND sg.path like :grouplv2 ")
//              .append("AND su.sys_user_id != :sysUserId ")
                .append("AND su.status = 1 ");

        SQLQuery query1 = getSession().createSQLQuery(sql1.toString());
        query1.setParameter("grouplv2", "%" + grouplv2 + "%");
//      query1.setParameter("sysUserId", request.getSysUserId());

        query1.addScalar("sysUserIdReceive", new LongType());
        query1.addScalar("sysUserNameReceive", new StringType());
        query1.addScalar("sysGroupIdReceive", new LongType());
        query1.addScalar("sysGroupNameReceive", new StringType());
        query1.addScalar("loginNameReceive", new StringType());
        query1.addScalar("emailReceive", new StringType());
        query1.addScalar("fullNameReceive", new StringType());

        query1.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDTO.class));
        return query1.list();
    }

    // thangtv24 - 120719 end

    public String getSysGroupIdUserId(Long sysUserId) {
        String sql = new String(
                " select "
                        + " case when sys.group_level=4 then "
                        + " (select sys_group_id from sys_group a where a.sys_group_id= "
                        + " (select parent_id from sys_group a where a.sys_group_id=sys.parent_id)) "
                        + " when sys.group_level=3 then "
                        + " (select sys_group_id from sys_group a where a.sys_group_id=sys.parent_id) "
                        + " else sys_group_id  "
                        + " end sys_group_id "
                        + " from sys_group sys "
                        + "  where sys_group_id = (select sys_group_id from sys_user where sys_user_id= :sysUserId) ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("sysUserId", sysUserId);
        query.addScalar("sys_group_id", new StringType());

        List<String> lstLong = query.list();
        if (lstLong != null || lstLong.size() > 0) {
            return lstLong.get(0);
        }
        return "";
    }

    public List<AIOSynStockTransDetailDTO> getListVTTBExport(
            AIOStockTransRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append(" select cat.goods_id goodsId,cat.goods_code goodsCode,cat.goods_code||'-'||cat.goods_name ||'('|| cat.cat_unit_name ||')' goodsName,sum(amount)amount,"
                + " LISTAGG(cat.serial,',') WITHIN GROUP (ORDER BY cat.goods_name)  goodsIsSerial,cat.CAT_UNIT_ID goodsUnitId,cat.CAT_UNIT_NAME goodsUnitName,cat.goods_name goodsNameImport "
                + " from mer_entity cat where cat.status=4 and stock_id = :stockId "
                + " group by cat.goods_id ,cat.goods_code ,cat.goods_name,cat.cat_unit_name,cat.CAT_UNIT_ID "
                + " order by cat.goods_code ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("stockId", request.getSynStockTransDto()
                .getStockId());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsIsSerial", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("goodsNameImport", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDetailDTO.class));
        return query.list();
    }

    public Long insertDeliveryBillStaff(AIOStockTransRequest request) {
        try {
            Long result = onInsertDeliveryBillStaff(request);
            if (result == -1L) {
                this.getSession().clear();
                return -1L;
            }
            if (result == -2L) {
                this.getSession().clear();
                return -2L;
            }
            if (result == -3L) {
                this.getSession().clear();
                return -3L;
            }
        } catch (Exception ex) {
            this.getSession().clear();
            return 0L;
        }
        return 1L;
    }

    public Long onInsertDeliveryBillStaff(AIOStockTransRequest obj) {
        if (obj.getLstStockTransDetail() != null) {
            String userName = getUserName(obj.getSysUserRequest()
                    .getSysUserId());
            String GroupName = getGroupName(obj.getSysUserRequest()
                    .getDepartmentId());
            // AIOContractDTO stock =
            // getStock(obj.getSysUserRequest().getSysUserId());
            // if (stock == null) {
            // return -3L;
            // }
            AIOContractDTO stockReceive = getStock(obj.getSynStockTransDto()
                    .getSysUserIdReceive());
            if (stockReceive == null) {
                return -3L;
            }
            AIOSynStockTransDTO stockTransDto = new AIOSynStockTransDTO();
            stockTransDto.setCode(obj.getSynStockTransDto().getCode());
            stockTransDto.setType("2");
            // stockTransDto.setStockId(stock.getStockId());
            // stockTransDto.setStockCode(stock.getStockCode());
            // stockTransDto.setStockName(stock.getStockName());
            stockTransDto.setStockId(obj.getSynStockTransDto().getStockId());
            stockTransDto
                    .setStockCode(obj.getSynStockTransDto().getStockCode());
            stockTransDto
                    .setStockName(obj.getSynStockTransDto().getStockName());
            stockTransDto.setStatus("2");
            stockTransDto.setSignState("3");
            stockTransDto.setDescription("Xuất kho giữa 2 nhân viên");
            stockTransDto.setCreatedByName(userName);
            stockTransDto.setCreatedDeptId(obj.getSysUserRequest()
                    .getDepartmentId());
            stockTransDto.setCreatedDeptName(GroupName);
            stockTransDto.setRealIeTransDate(new Date());
            stockTransDto.setRealIeUserId(String.valueOf(obj
                    .getSysUserRequest().getSysUserId()));
            stockTransDto.setRealIeUserName(userName);
            stockTransDto.setShipperId(obj.getSynStockTransDto()
                    .getSysUserIdReceive());
            stockTransDto.setShipperName(obj.getSynStockTransDto()
                    .getFullNameReceive());
            stockTransDto.setCreatedBy(obj.getSysUserRequest().getSysUserId());
            stockTransDto.setCreatedDate(new Date());
            stockTransDto.setBusinessTypeName("Xuất kho giữa 2 nhân viên");
            stockTransDto.setDeptReceiveName(obj.getSynStockTransDto()
                    .getSysGroupNameReceive());
            stockTransDto.setDeptReceiveId(obj.getSynStockTransDto()
                    .getSysGroupIdReceive());
            stockTransDto.setStockReceiveId(stockReceive.getStockId());
            stockTransDto.setStockReceiveCode(stockReceive.getStockCode());
            stockTransDto.setBussinessType("12");
            stockTransDto.setLastShipperId(obj.getSynStockTransDto()
                    .getSysUserIdReceive());
            StockTransBO boStock = stockTransDto.toModel();
            Long stockTransId = this.saveObject(boStock);
            // boStock.setStockTransId(stockTransId);
            // this.update(boStock);
            for (AIOSynStockTransDetailDTO dto : obj.getLstStockTransDetail()) {
                List<String> lst = new ArrayList<String>();
                if (dto.getLstSerial() != null) {
                    lst = dto.getLstSerial();
                }
                Double totalPrice = (double) 0;
                AIOSynStockTransDetailDTO dtoDetail = new AIOSynStockTransDetailDTO();
                dtoDetail.setStockTransId(stockTransId);
                dtoDetail.setGoodsId(dto.getGoodsId());
                dtoDetail.setGoodsCode(dto.getGoodsCode());
                dtoDetail.setGoodsName(dto.getGoodsNameImport());
                if (lst.size() > 0) {
                    dtoDetail.setGoodsIsSerial("1");
                } else {
                    dtoDetail.setGoodsIsSerial("0");
                }
                dtoDetail.setGoodsUnitId(dto.getGoodsUnitId());
                dtoDetail.setGoodsUnitName(dto.getGoodsUnitName());
                dtoDetail.setAmountReal(dto.getAmountReceive());
                dtoDetail.setAmountOrder(dto.getAmountReceive());
                dtoDetail.setGoodsState("1");
                dtoDetail.setGoodsStateName("Bình thường");
                AIOSynStockTransDetailDTO goodType = getGoodTypeName(dto
                        .getGoodsId());
                dtoDetail.setGoodsType(goodType.getGoodsType());
                dtoDetail.setGoodsTypeName(goodType.getGoodsTypeName());
                StockTransDetailBO boStockDetail = dtoDetail.toModel();
                Long idDetail = aioStockTransDetailDAO
                        .saveObject(boStockDetail);
                // boStockDetail.setStockTransDetailId(idDetail);
                // aioStockTransDetailDAO.update(boStockDetail);
                if (lst.size() > 0) {
                    for (int i = 0; i < lst.size(); i++) {
                        AIOMerEntityDTO mer = new AIOMerEntityDTO();
                        mer.setSerial(lst.get(i));
                        // mer.setStockId(stock.getStockId());
                        mer.setStockId(obj.getSynStockTransDto().getStockId());
                        mer.setGoodsId(dto.getGoodsId());
                        mer.setState("1");
                        AIOMerEntityDTO merEntityDto = findBySerial(mer);
                        if (merEntityDto != null) {
                            merEntityDto.setStatus("5");
                            // merEntityDto.setOrderId(obj.getOrderId());
                            if (merEntityDto.getExportDate() == null) {
                                merEntityDto.setExportDate(new Date());
                            }
                            // hoanm1_20190509_start
                            merEntityDto.setUpdatedDate(new Date());
                            // hoanm1_20190509_end
                            aioMerEntityDAO.update(merEntityDto.toModel());
                            AIOStockTransDetailSerialDTO detailSerial = createFromMerEntity(
                                    merEntityDto, stockTransId, idDetail);
                            totalPrice = totalPrice
                                    + detailSerial.getQuantity()
                                    * (detailSerial.getPrice() != null ? detailSerial
                                    .getPrice() : 0);
                            Long idDetailSerial = aioStockTransDetailSerialDAO
                                    .saveObject(detailSerial.toModel());
                        } else {
                            return -1L;
                        }
                    }
                } else {
                    // List<AIOMerEntityDTO> availabelGoods =
                    // findByGoodsForExport(
                    // dto.getGoodsId(), "1", stock.getStockId());
                    List<AIOMerEntityDTO> availabelGoods = findByGoodsForExport(
                            dto.getGoodsId(), "1", obj.getSynStockTransDto()
                                    .getStockId());
                    if (availabelGoods == null || availabelGoods.size() == 0) {
                        return -1L;
                    }
                    AIOMerEntityDTO currentEntity = null;
                    Double exportAmount = dto.getAmountReceive();
                    // Double amountSum = findByGoodsForExportSum(
                    // dto.getGoodsId(), "1", stock.getStockId());
                    Double amountSum = findByGoodsForExportSum(
                            dto.getGoodsId(), "1", obj.getSynStockTransDto()
                                    .getStockId());
                    if (exportAmount - amountSum > 0) {
                        return -2L;
                    }
                    StringBuilder lstMerEntityId = new StringBuilder("");
                    for (AIOMerEntityDTO goods : availabelGoods) {
                        if (exportAmount - goods.getAmount() < 0) {
                            currentEntity = goods;
                            break;
                        }
                        exportAmount = (double) Math
                                .round((exportAmount - goods.getAmount()) * 1000) / 1000;
                        goods.setStatus("5");
                        if (goods.getExportDate() == null) {
                            goods.setExportDate(new Date());
                        }
                        // hoanm1_20190509_start
                        goods.setUpdatedDate(new Date());
                        // hoanm1_20190509_end
                        aioMerEntityDAO.update(goods.toModel());

                        AIOStockTransDetailSerialDTO detailSerial = createFromMerEntity(
                                goods, stockTransId, idDetail);
                        if (detailSerial.getPrice() == null) {
                            detailSerial.setPrice(0d);
                        }
                        totalPrice = totalPrice + detailSerial.getQuantity()
                                * detailSerial.getPrice();
                        Long idDetailSerial = aioStockTransDetailSerialDAO
                                .saveObject(detailSerial.toModel());
                    }
                    if (exportAmount > 0) {// tach ra 2 ban ghi mer entity
                        // luu lai thong tin ban ghi goc
                        Long currentId = currentEntity.getMerEntityId();
                        Long currentParrent_entity = currentEntity
                                .getParentMerEntityId();
                        Double remainAmount = currentEntity.getAmount()
                                - exportAmount;
                        Long currentOrderId = currentEntity.getOrderId();
                        Date currentExportDate = currentEntity.getExportDate();
                        // tach mer entity moi
                        AIOMerEntityDTO newEntity = currentEntity;
                        newEntity.setId(null);
                        newEntity.setMerEntityId(0l);
                        newEntity.setAmount(exportAmount);
                        newEntity.setParentMerEntityId(currentId);
                        // newEntity.setOrderId(obj.getOrderId());
                        newEntity.setStatus("5");
                        if (newEntity.getExportDate() == null) {
                            newEntity.setExportDate(new Date());
                        }
                        // hoanm1_20190509_start
                        newEntity.setUpdatedDate(new Date());
                        // hoanm1_20190509_end
                        Long idMerInsert = aioMerEntityDAO.saveObject(newEntity
                                .toModel());
                        // aioMerEntityDAO.update(newEntity.toModel());

                        newEntity.setMerEntityId(idMerInsert);
                        // luu stock trans detail serial
                        AIOStockTransDetailSerialDTO detailSerial = createFromMerEntity(
                                newEntity, stockTransId, idDetail);
                        Double price = detailSerial.getPrice() != null ? detailSerial
                                .getPrice() : 0;
                        totalPrice = totalPrice + detailSerial.getQuantity()
                                * price;
                        Long idDetailSerial = aioStockTransDetailSerialDAO
                                .saveObject(detailSerial.toModel());
                        // update lai thong tin mer entity goc
                        currentEntity.setAmount(remainAmount);
                        currentEntity.setStatus("4");
                        currentEntity.setMerEntityId(currentId);
                        currentEntity
                                .setParentMerEntityId(currentParrent_entity);
                        currentEntity.setOrderId(currentOrderId);
                        currentEntity.setExportDate(currentExportDate);
                        // hoanm1_20190509_start
                        currentEntity.setUpdatedDate(new Date());
                        // hoanm1_20190509_end
                        aioMerEntityDAO.update(currentEntity.toModel());
                    }
                }
                boStockDetail.setTotalPrice(totalPrice);
                aioStockTransDetailDAO.update(boStockDetail);

                // hoanm1_20190507_start
                AIOSynStockTransDTO stockTotal = getStockGoodTotal(obj
                        .getSynStockTransDto().getStockId(), dto.getGoodsId());
                StringBuilder sql = new StringBuilder("");
                if (stockTotal != null) {
                    sql.append("UPDATE stock_goods_total st set change_date=sysdate, st.amount= "
                            + stockTotal.getAmount()
                            + " - :amount,st.amount_issue =  "
                            + stockTotal.getAmountIssue()
                            + " - :amount"
                            + " WHERE st.stock_goods_total_id  = :stockGoodsTotalId");
                    SQLQuery query = getSession()
                            .createSQLQuery(sql.toString());
                    query.setParameter("amount", dto.getAmountReceive());
                    query.setParameter("stockGoodsTotalId",
                            stockTotal.getStockGoodsTotalId());
                    query.executeUpdate();
                }
                // hoanm1_20190507_end
            }
        }
        return 1L;
    }

    public AIOContractDTO getStock(Long sysUserId) {
        String sql = new String(
                "select a.cat_stock_id stockId,a.code stockCode,a.name stockName from cat_stock a where type=4 and a.sys_user_id = :sysUserId ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("sysUserId", sysUserId);
        query.addScalar("stockId", new LongType());
        query.addScalar("stockCode", new StringType());
        query.addScalar("stockName", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));
        return (AIOContractDTO) query.uniqueResult();
    }

    public AIOMerEntityDTO findBySerial(AIOMerEntityDTO obj) {
        StringBuilder sql = new StringBuilder(
                "SELECT s.STOCK_ID stockId,"
                        + "st.NAME stockName,"
                        + "s.GOODS_ID goodsId,"
                        + "s.CNT_CONTRACT_CODE cntContractCode, "
                        + "s.MER_ENTITY_ID merEntityId, "
                        + "s.MANUFACTURER_NAME manufacturerName "
                        + ",s.PRODUCING_COUNTRY_NAME producingCountryName "
                        + ",s.CAT_UNIT_ID catUnitId "
                        + ",s.CAT_UNIT_NAME catUnitName "
                        + ",s.PARENT_MER_ENTITY_ID parentMerEntityId "
                        + ",s.ORDER_ID orderId "
                        + ",s.MER_ENTITY_ID merEntityId "
                        + ",s.SERIAL serial "
                        + ",s.GOODS_ID goodsId "
                        + ",s.GOODS_CODE goodsCode "
                        + ",s.GOODS_NAME goodsName "
                        + ",s.STATE state "
                        + ",s.STATUS status "
                        + ",s.IMPORT_DATE importDate "
                        + ",s.AMOUNT amount "
                        + ",s.CAT_MANUFACTURER_ID catManufacturerId "
                        + ",s.CAT_PRODUCING_COUNTRY_ID catProducingCountryId "
                        + ",s.STOCK_ID stockId "
                        + ",s.CNT_CONTRACT_ID cntContractId "
                        + ",s.SYS_GROUP_ID sysGroupId "
                        + ",s.PROJECT_ID projectId "
                        + ",s.SHIPMENT_ID shipmentId "
                        + ",s.PART_NUMBER partNumber "
                        + ",s.UNIT_PRICE unitPrice "
                        + ",s.APPLY_PRICE applyPrice "
                        + ",s.UPDATED_DATE updatedDate "
                        + ",s.STOCK_CELL_ID stockCellId "
                        + ",s.STOCK_CELL_CODE stockCellCode "
                        + ",s.IMPORT_STOCK_TRANS_ID importStockTransId "
                        + ",s.EXPORT_DATE exportDate "
                        + "FROM MER_ENTITY s "
                        + "INNER JOIN CAT_STOCK st ON s.STOCK_ID = st.CAT_STOCK_ID "
                        + "left JOIN CNT_CONTRACT SC ON SC.CNT_CONTRACT_ID = s.CNT_CONTRACT_ID "
                        + "WHERE s.STATUS = '4' ");
        if (obj.getGoodsId() != null) {
            sql.append(" AND (s.GOODS_ID = :goodsId)");
        }
        if (obj.getStockId() != null) {
            sql.append(" AND (s.STOCK_ID = :stockId )");
        }
        if (obj.getState() != null) {
            sql.append(" AND (s.STATE = :state )");
        }
        if ((obj.getSerial() != null)) {
            sql.append(" AND upper(s.SERIAL) = upper(:serial)  ");
        }

        sql.append(" ORDER BY s.import_date,st.NAME");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("merEntityId", new LongType());
        query.addScalar("stockId", new LongType());
        query.addScalar("stockName", new StringType());
        query.addScalar("stockCellId", new LongType());
        query.addScalar("parentMerEntityId", new LongType());
        query.addScalar("stockCellCode", new StringType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("serial", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("cntContractId", new LongType());
        query.addScalar("state", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("cntContractCode", new StringType());
        query.addScalar("importDate", new DateType());
        query.addScalar("manufacturerName", new StringType());
        query.addScalar("producingCountryName", new StringType());
        query.addScalar("catUnitId", new LongType());
        query.addScalar("catUnitName", new StringType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("orderId", new LongType());
        query.addScalar("catManufacturerId", new LongType());

        query.addScalar("exportDate", new DateType());
        query.addScalar("importStockTransId", new LongType());

        query.addScalar("catProducingCountryId", new LongType());
        query.addScalar("cntContractId", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("projectId", new LongType());
        query.addScalar("shipmentId", new LongType());
        query.addScalar("partNumber", new StringType());
        query.addScalar("unitPrice", new DoubleType());
        query.addScalar("applyPrice", new DoubleType());
        if (obj.getGoodsId() != null) {
            query.setParameter("goodsId", obj.getGoodsId());
        }
        if (obj.getState() != null) {
            query.setParameter("state", obj.getState());
        }
        if (obj.getStockId() != null) {
            query.setParameter("stockId", obj.getStockId());
        }
        if ((obj.getSerial() != null)) {
            query.setParameter("serial", obj.getSerial());
        }
        query.setResultTransformer(Transformers
                .aliasToBean(AIOMerEntityDTO.class));
        return (AIOMerEntityDTO) query.uniqueResult();
        // return query.list();
    }

    public AIOStockTransDetailSerialDTO createFromMerEntity(
            AIOMerEntityDTO goods, Long stockTransId, Long stockTransDetailId) {
        AIOStockTransDetailSerialDTO detailSerial = new AIOStockTransDetailSerialDTO();
        detailSerial.setQuantityIssue(goods.getAmount().doubleValue());
        detailSerial.setQuantity(goods.getAmount().doubleValue());
        detailSerial.setPrice(goods.getApplyPrice());
        detailSerial.setUnitPrice(goods.getUnitPrice());
        detailSerial.setCellCode(goods.getStockCellCode());
        detailSerial.setStockTransId(stockTransId);
        detailSerial.setStockTransDetailId(stockTransDetailId);
        detailSerial.setMerEntityId(goods.getMerEntityId());
        detailSerial.setGoodsState(goods.getState());
        detailSerial.setSerial(goods.getSerial());
        return detailSerial;
    }

    public List<AIOMerEntityDTO> findByGoodsForExport(Long goodsId,
                                                      String goodsState, Long stockId) {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append("T1.UPDATED_DATE updatedDate ");
        stringBuilder.append(",T1.STOCK_CELL_ID stockCellId ");
        stringBuilder.append(",T1.STOCK_CELL_CODE stockCellCode ");
        stringBuilder
                .append(",T1.CAT_PRODUCING_COUNTRY_ID catProducingCountryId ");
        stringBuilder.append(",T1.PARENT_MER_ENTITY_ID parentMerEntityId ");
        stringBuilder.append(",T1.CAT_UNIT_NAME catUnitName ");
        stringBuilder.append(",T1.IMPORT_DATE importDate ");
        stringBuilder.append(",T1.MANUFACTURER_NAME manufacturerName ");
        stringBuilder
                .append(",T1.PRODUCING_COUNTRY_NAME producingCountryName ");
        stringBuilder.append(",T1.CAT_UNIT_ID catUnitId ");
        stringBuilder.append(",T1.ORDER_ID orderId ");
        stringBuilder.append(",T1.CNT_CONTRACT_CODE cntContractCode ");
        stringBuilder.append(",T1.MER_ENTITY_ID merEntityId ");
        stringBuilder.append(",T1.SERIAL serial ");
        stringBuilder.append(",T1.GOODS_ID goodsId ");
        stringBuilder.append(",T1.GOODS_CODE goodsCode ");
        stringBuilder.append(",T1.GOODS_NAME goodsName ");
        stringBuilder.append(",T1.STATE state ");
        stringBuilder.append(",T1.STATUS status ");
        stringBuilder.append(",T1.AMOUNT amount ");
        stringBuilder.append(",T1.CAT_MANUFACTURER_ID catManufacturerId ");
        stringBuilder.append(",T1.STOCK_ID stockId ");
        stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
        stringBuilder.append(",T1.SYS_GROUP_ID sysGroupId ");
        stringBuilder.append(",T1.PROJECT_ID projectId ");
        stringBuilder.append(",T1.SHIPMENT_ID shipmentId ");
        stringBuilder.append(",T1.PART_NUMBER partNumber ");
        stringBuilder.append(",T1.UNIT_PRICE unitPrice ");
        stringBuilder.append(",T1.APPLY_PRICE applyPrice ");

        stringBuilder.append(",T1.IMPORT_STOCK_TRANS_ID importStockTransId ");
        stringBuilder.append(",T1.EXPORT_DATE exportDate ");

        stringBuilder.append("FROM MER_ENTITY T1 ");
        stringBuilder
                .append("WHERE T1.STATUS = 4 AND T1.GOODS_ID = :value and T1.STATE = :goodsState and T1.STOCK_ID = :stockId ");
        stringBuilder.append("order by T1.IMPORT_DATE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("updatedDate", new DateType());
        query.addScalar("stockCellId", new LongType());
        query.addScalar("stockCellCode", new StringType());
        query.addScalar("catProducingCountryId", new LongType());
        query.addScalar("parentMerEntityId", new LongType());
        query.addScalar("catUnitName", new StringType());
        query.addScalar("importDate", new DateType());
        query.addScalar("manufacturerName", new StringType());
        query.addScalar("producingCountryName", new StringType());
        query.addScalar("catUnitId", new LongType());
        query.addScalar("orderId", new LongType());
        query.addScalar("cntContractCode", new StringType());
        query.addScalar("merEntityId", new LongType());
        query.addScalar("serial", new StringType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("state", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("catManufacturerId", new LongType());
        query.addScalar("stockId", new LongType());
        query.addScalar("cntContractId", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("projectId", new LongType());
        query.addScalar("shipmentId", new LongType());
        query.addScalar("partNumber", new StringType());
        query.addScalar("unitPrice", new DoubleType());
        query.addScalar("applyPrice", new DoubleType());
        query.addScalar("exportDate", new DateType());
        query.addScalar("importStockTransId", new LongType());

        query.setParameter("value", goodsId);
        query.setParameter("goodsState", goodsState);
        query.setParameter("stockId", stockId);
        query.setResultTransformer(Transformers
                .aliasToBean(AIOMerEntityDTO.class));

        return query.list();
    }

    public Double findByGoodsForExportSum(Long goodsId, String goodsState,
                                          Long stockId) {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append(" sum(T1.AMOUNT) amount ");
        stringBuilder.append("FROM MER_ENTITY T1 ");
        stringBuilder
                .append("WHERE T1.STATUS = 4 AND T1.GOODS_ID = :value and T1.STATE = :goodsState and T1.STOCK_ID = :stockId ");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("amount", new DoubleType());
        query.setParameter("value", goodsId);
        query.setParameter("goodsState", goodsState);
        query.setParameter("stockId", stockId);

        List<Double> lstDoub = query.list();
        if (lstDoub != null && lstDoub.size() > 0) {
            return lstDoub.get(0);
        }
        return 0D;
    }

    public AIOSynStockTransDetailDTO getGoodTypeName(Long goodsId) {
        String sql = new String(
                "select a.GOODS_TYPE goodsType,b.name goodsTypeName from goods a,app_param b where b.par_type='GOODS_TYPE' and a.goods_type=b.code and a.goods_id = :goodsId ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("goodsId", goodsId);
        query.addScalar("goodsType", new StringType());
        query.addScalar("goodsTypeName", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOSynStockTransDetailDTO.class));
        return (AIOSynStockTransDetailDTO) query.uniqueResult();
    }

    // hoanm1_20190420_end
    // hoanm1_20190509_start
    public AIOContractDTO getStockNameTotal(Long stockId) {
        String sql = new String(
                "select a.cat_stock_id stockId,a.code stockCode,a.name stockName from cat_stock a where cat_stock_id = :stockId ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("stockId", stockId);
        query.addScalar("stockId", new LongType());
        query.addScalar("stockCode", new StringType());
        query.addScalar("stockName", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));
        return (AIOContractDTO) query.uniqueResult();
    }

    // hoanm1_20190509_end
    // VietNT_05/07/2019_start
    public StockTransDTO getStockTransStockAndBusinessType(Long id) {
        String sql = "SELECT " +
                "stock_id stockId, " +
                "stock_code stockCode, " +
                "Stock_name stockName, " +
                "business_type bussinessType " +
                "from stock_trans WHERE STOCK_TRANS_ID = :id ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(StockTransDTO.class));
        query.addScalar("stockId", new LongType());
        query.addScalar("stockCode", new StringType());
        query.addScalar("stockName", new StringType());
        query.addScalar("bussinessType", new StringType());
        query.setParameter("id", id);
        return (StockTransDTO) query.uniqueResult();
    }

    public void insertBillImportToStock(AIOStockTransRequest obj, StockDTO stockDTO) {
        String userName = getUserName(obj.getSysUserRequest().getSysUserId());
        String GroupName = getGroupName(obj.getSysUserRequest()
                .getDepartmentId());
        AIOSynStockTransDTO stockTransDto = new AIOSynStockTransDTO();
        // stockTransDto.setCode(obj.getSynStockTransDto().getCode());
        Long sequence = getSequenceStock();
        stockTransDto.setCode("PNK_" + stockDTO.getCode() + "/19/" + sequence);
        stockTransDto.setType("1");
        stockTransDto.setStockId(stockDTO.getStockId());
        stockTransDto.setStockCode(stockDTO.getCode());
        stockTransDto.setStockName(stockDTO.getName());
        stockTransDto.setStatus("2");
        stockTransDto.setSignState("3");
        stockTransDto.setFromStockTransId(obj.getSynStockTransDto()
                .getSynStockTransId());
        stockTransDto.setDescription("Nhập kho nhân viên");
        stockTransDto.setCreatedByName(userName);
        stockTransDto.setCreatedDeptId(obj.getSysUserRequest()
                .getDepartmentId());
        stockTransDto.setCreatedDeptName(GroupName);
        stockTransDto.setRealIeTransDate(new Date());
        stockTransDto.setRealIeUserId(String.valueOf(obj.getSysUserRequest()
                .getSysUserId()));
        stockTransDto.setRealIeUserName(userName);
        stockTransDto.setShipperId(obj.getSysUserRequest().getSysUserId());
        stockTransDto.setShipperName(userName);
        stockTransDto.setCreatedBy(obj.getSysUserRequest().getSysUserId());
        stockTransDto.setCreatedDate(new Date());
        stockTransDto.setBusinessTypeName("Nhập kho nhân viên");
        stockTransDto.setDeptReceiveName(GroupName);
        stockTransDto.setDeptReceiveId(obj.getSysUserRequest()
                .getDepartmentId());
        stockTransDto.setBussinessType("8");
        Long id = this.saveObject(stockTransDto.toModel());
        //VietNT_18/07/2019_start
        if (id < 1) {
            throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + ": PXK");
        }
        //VietNT_end
        if (obj.getLstStockTransDetail() != null) {
            for (AIOSynStockTransDetailDTO dto : obj.getLstStockTransDetail()) {
                AIOSynStockTransDetailDTO dtoDetail = new AIOSynStockTransDetailDTO();
                dtoDetail.setStockTransId(id);
                dtoDetail.setOrderId(dto.getOrderId());
                dtoDetail.setGoodsType(dto.getGoodsType());
                dtoDetail.setGoodsTypeName(dto.getGoodsTypeName());
                dtoDetail.setGoodsId(dto.getGoodsId());
                dtoDetail.setGoodsCode(dto.getGoodsCode());
                dtoDetail.setGoodsIsSerial(dto.getGoodsIsSerial());
                dtoDetail.setGoodsState(dto.getGoodsState());
                dtoDetail.setGoodsStateName(dto.getGoodsStateName());
                dtoDetail.setGoodsName(dto.getGoodsNameImport());
                dtoDetail.setGoodsUnitId(dto.getGoodsUnitId());
                dtoDetail.setGoodsUnitName(dto.getGoodsUnitName());
                dtoDetail.setAmountOrder(dto.getAmountOrder());
                dtoDetail.setAmountReal(dto.getAmountOrder());
                dtoDetail.setTotalPrice(dto.getTotalPrice());
                Long idDetail = aioStockTransDetailDAO.saveObject(dtoDetail
                        .toModel());
                //VietNT_18/07/2019_start
                if (idDetail < 1) {
                    throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + ": chi tiết PXK");
                }
                //VietNT_end
                LOGGER.error("Hoanm1 start: xác nhận phiếu xuất có stock_trans_detail");
                LOGGER.error(id + "_" + idDetail);
                LOGGER.error("Hoanm1 end: xác nhận phiếu xuất có stock_trans_detail");
                List<AIOStockTransDetailSerialDTO> getListDetailSerial = getListDetailSerial(dto
                        .getSynStockTransDetailId());
                for (AIOStockTransDetailSerialDTO bo : getListDetailSerial) {
                    bo.setStockTransId(id);
                    bo.setStockTransDetailId(idDetail);
                    Long idDetailSerial = aioStockTransDetailSerialDAO
                            .saveObject(bo.toModel());
                    //VietNT_18/07/2019_start
                    if (idDetailSerial < 1) {
                        throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + ": chi tiết PXK serial");
                    }
                    //VietNT_end
                    // aioStockTransDetailSerialDAO.update(bo.toModel());
                    // this.getSession().flush();
                    // update merEntity
                    StringBuilder sql = new StringBuilder("");
                    sql.append("UPDATE MER_ENTITY st SET st.STATUS=4,st.STOCK_ID = :stockReceiveId WHERE st.MER_ENTITY_ID  = :merEntityId");
                    SQLQuery query = getSession()
                            .createSQLQuery(sql.toString());
                    query.setParameter("stockReceiveId", stockDTO.getStockId());
                    query.setParameter("merEntityId", bo.getMerEntityId());
                    query.executeUpdate();
                }
                // tinh lai apply_price
                StringBuilder sqlPrice = new StringBuilder("");
                sqlPrice.append("update MER_ENTITY a set a.apply_price=(select round((sum(amount*apply_price)/sum(amount)),2) from MER_ENTITY mer where mer.stock_id=a.stock_id "
                        + " and mer.GOODS_ID=a.GOODS_ID and mer.status=4 ) where a.stock_id = :stockReceiveId and a.GOODS_ID = :goodsId and a.status =4 ");
                SQLQuery queryPrice = getSession().createSQLQuery(
                        sqlPrice.toString());
                queryPrice.setParameter("stockReceiveId", stockDTO.getStockId());
                queryPrice.setParameter("goodsId", dto.getGoodsId());
                queryPrice.executeUpdate();

                // check exit stock_goods_total
                // hoanm1_20190424_start
                AIOSynStockTransDTO stockTotal = getStockGoodTotal(stockDTO.getStockId(), dto.getGoodsId());
                StringBuilder sql = new StringBuilder("");
                if (stockTotal != null) {
                    sql.append("UPDATE stock_goods_total st SET change_date=sysdate, st.amount= :amount + "
                            + stockTotal.getAmount()
                            + ",st.amount_issue = :amount + "
                            + stockTotal.getAmountIssue()
                            + " WHERE st.stock_goods_total_id  = :stockGoodsTotalId");
                    SQLQuery query = getSession()
                            .createSQLQuery(sql.toString());
                    query.setParameter("amount", dto.getAmountOrder());
                    query.setParameter("stockGoodsTotalId",
                            stockTotal.getStockGoodsTotalId());
                    query.executeUpdate();
                } else {
                    AIOStockGoodsTotalDTO dtoTotal = new AIOStockGoodsTotalDTO();
                    dtoTotal.setStockId(stockDTO.getStockId());
                    dtoTotal.setStockCode(stockDTO.getCode());
                    dtoTotal.setGoodsId(dto.getGoodsId());
                    dtoTotal.setGoodsState(dto.getGoodsState());
                    dtoTotal.setGoodsStateName(dto.getGoodsStateName());
                    dtoTotal.setGoodsCode(dto.getGoodsCode());
                    dtoTotal.setGoodsName(dto.getGoodsNameImport());
                    // hoanm1_20190509_start
                    // AIOContractDTO stockName =
                    // getStockNameTotal(obj.getSynStockTransDto().getStockReceiveId());
                    dtoTotal.setStockName(stockDTO.getName());
                    dtoTotal.setGoodsTypeName(dto.getGoodsTypeName());
                    // hoanm1_20190509_end
                    dtoTotal.setGoodsType(Long.parseLong(dto.getGoodsType()));
                    dtoTotal.setGoodsIsSerial(dto.getGoodsIsSerial());
                    dtoTotal.setGoodsUnitId(dto.getGoodsUnitId());
                    dtoTotal.setGoodsUnitName(dto.getGoodsUnitName());
                    dtoTotal.setAmount(dto.getAmountOrder());
                    dtoTotal.setChangeDate(new Date());
                    dtoTotal.setAmountIssue(dto.getAmountOrder());
                    Long idTotal = aioStockGoodsTotalDAO.saveObject(dtoTotal
                            .toModel());
                    //VietNT_18/07/2019_start
                    if (idTotal < 1) {
                        throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + ": hàng tồn kho");
                    }
                    //VietNT_end
                }
                // hoanm1_20190424_end
            }
        } else {
            LOGGER.error("Hoanm1 start: xác nhận phiếu xuất không có stock_trans_detail");
            LOGGER.error(id);
            LOGGER.error("Hoanm1 end: xác nhận phiếu xuất không có stock_trans_detail");
        }
    }

    // VietNT_end
    //VietNT_10/08/2019_start
    public String getStockTransConfirm(Long stockTransId) {
        String sql = "select confirm confirm from stock_trans where stock_trans_id = :id ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("id", stockTransId);
        query.addScalar("confirm", new StringType());

        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (String) list.get(0);
        }
        return null;
    }
    //VietNT_end

    //VietNT_19/09/2019_start
    public List<AIOSysGroupDTO> getListGroup(Long id) {
        String sql = "select " +
                "sys_group_id sysGroupId, " +
                "code code, " +
                "name name," +
                "code || '-' || name text " +
                "FROM SYS_GROUP " +
                "WHERE 1=1 and parent_id = :id and GROUP_LEVEL = 3 " +
                "order by sys_group_id desc ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("id", id);
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("text", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOSysGroupDTO.class));

        return query.list();
    }

    public List<AIOSysUserDTO> getListUserInGroup(Long id, boolean isLevel3) {
        String condition;
        if (isLevel3) {
            condition = "sys_group_id = :id ";
        } else {
            condition = "(SELECT to_number((substr(sg.path,instr(sg.path,'/',1,2) + 1,instr(sg.path,'/',1,3) - (instr(sg.path,'/',1,2) + 1)))) " +
                    "from sys_group sg where sg.sys_group_id = su.sys_group_id) = :id ";
        }
        String sql = "select " +
                "SYS_USER_ID sysUserId, " +
                "EMPLOYEE_CODE employeeCode, " +
                "FULL_NAME fullName," +
                "employee_code || '-' || full_name text " +
                "FROM SYS_USER su " +
                "WHERE 1=1 " +
                "and " +
                condition +
                "order by su.sys_user_id desc ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("id", id);
        query.addScalar("sysUserId", new LongType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("text", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOSysUserDTO.class));

        return query.list();
    }
    //VietNT_end

    public AIOSysUserDTO getUserInfo(Long sysUserId) {
        String sql = "select " +
                "a.FULL_NAME sysUserName " +
                ", (select name from sys_group where sys_group_id = a.sys_group_id) sysGroupName " +
                "from sys_user a " +
                "where a.sys_user_id= :sysUserId ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOSysUserDTO.class));
        query.setParameter("sysUserId", sysUserId);
        query.addScalar("sysUserName", new StringType());
        query.addScalar("sysGroupName", new StringType());
        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (AIOSysUserDTO) list.get(0);
        }
        return null;
    }

    public int updateMerStockId(Long merId, Long stockId) {
        StringBuilder sql = new StringBuilder("");
        sql.append("UPDATE MER_ENTITY st SET st.STATUS=4,st.STOCK_ID = :stockReceiveId WHERE st.MER_ENTITY_ID  = :merEntityId");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("stockReceiveId", stockId);
        query.setParameter("merEntityId", merId);
        return query.executeUpdate();
    }

    public int recalculateApplyPrice(Long goodsId, Long stockId) {
        String sql = "update MER_ENTITY a " +
                "set a.apply_price = (select " +
                "round((sum(amount*apply_price)/sum(amount)),2) from MER_ENTITY mer " +
                "where mer.stock_id=a.stock_id and mer.GOODS_ID=a.GOODS_ID and mer.status=4 ) " +
                "where a.stock_id = :stockReceiveId " +
                "and a.GOODS_ID = :goodsId " +
                "and a.status = 4 ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("stockReceiveId", stockId);
        query.setParameter("goodsId", goodsId);
        return query.executeUpdate();
    }

    public int updateStockGoodsTotalAmount(Long stockGoodsTotalId, Double stockAmount, Double stockAmountIssue,
                                           Double amountOrder) {
        String sql = "UPDATE stock_goods_total st " +
                "SET " +
                "change_date = sysdate, " +
                "st.amount = (:amount + :stockAmount) " +
                ", st.amount_issue = (:amount + :stockAmountIssue) " +
                " WHERE st.stock_goods_total_id  = :stockGoodsTotalId ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("amount", amountOrder);
        query.setParameter("stockAmount", stockAmount, new DoubleType());
        query.setParameter("stockAmountIssue", stockAmountIssue, new DoubleType());
        query.setParameter("stockGoodsTotalId", stockGoodsTotalId);

        return query.executeUpdate();
    }

    public Long manualInsertStockTransDetail(Long stockTransId, Long goodsId, Double amount) {
        String sqlSeq = "select STOCK_TRANS_DETAIL_SEQ.nextval id from dual ";
        SQLQuery query = this.getSession().createSQLQuery(sqlSeq);
        query.addScalar("id", new LongType());
        Long idDetail = (Long) query.uniqueResult();

        String sql = "INSERT INTO STOCK_TRANS_DETAIL " +
                "(STOCK_TRANS_DETAIL_ID, GOODS_TYPE, GOODS_TYPE_NAME, " +
                "GOODS_ID, GOODS_CODE, GOODS_NAME, " +
                "GOODS_IS_SERIAL, GOODS_STATE, GOODS_STATE_NAME, " +
                "GOODS_UNIT_NAME, GOODS_UNIT_ID, " +
                "AMOUNT_ORDER, AMOUNT_REAL, STOCK_TRANS_ID) " +

                "WITH a AS ( " +
                "SELECT g.GOODS_ID, g.CODE, g.NAME, g.UNIT_TYPE, g.UNIT_TYPE_NAME, g.IS_SERIAL, g.GOODS_TYPE, p.name GOODS_TYPE_NAME " +
                "FROM goods g " +
                "LEFT JOIN app_param p ON p.code = g.GOODS_TYPE AND p.par_type = 'GOODS_TYPE' " +
                "WHERE goods_id = :goodsId) " +

                "(SELECT " +
                ":idDetail, a.GOODS_TYPE, a.GOODS_TYPE_NAME, " +
                "a.GOODS_ID, a.CODE, a.NAME, " +
                "a.IS_SERIAL, 1, 'Bình thường', " +
                "a.UNIT_TYPE_NAME, a.UNIT_TYPE, " +
                ":amountOrder, :amountReal, :stockTransId FROM a) ";

        query = this.getSession().createSQLQuery(sql);
        query.setParameter("idDetail", idDetail);
        query.setParameter("goodsId", goodsId);
        query.setParameter("amountOrder", amount);
        query.setParameter("amountReal", amount);
        query.setParameter("stockTransId", stockTransId);

        int result = query.executeUpdate();
        if (result != 0) {
            return idDetail;
        }
        return 0L;
    }

    public StockDTO getStockById(Long stockId) {
        String sql = "select " +
                "a.cat_stock_id stockId, " +
                "a.code code, " +
                "a.name name " +
                "from cat_stock a " +
                "where cat_stock_id = :stockId ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("stockId", stockId);
        query.addScalar("stockId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(StockDTO.class));
        return (StockDTO) query.uniqueResult();
    }

    public void updateTotalPriceStockDetail(Long detailId, Double totalPrice) {
        String sql = "update Stock_trans_detail set TOTAL_PRICE = :totalPrice where Stock_trans_detail_id = :id ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("totalPrice", totalPrice);
        query.setParameter("id", detailId);
        query.executeUpdate();
    }

    public int updateStockGoodsTotal(Long stockGoodsTotalId, Double amount, Double amountIssue) {
        String sql = "UPDATE stock_goods_total st set change_date=sysdate, st.amount = :amount "
                + ", st.amount_issue = :amountIssue "
                + " WHERE st.stock_goods_total_id  = :stockGoodsTotalId ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("amount", amount);
        query.setParameter("amountIssue", amountIssue);
        query.setParameter("stockGoodsTotalId", stockGoodsTotalId);
        return query.executeUpdate();
    }
}
