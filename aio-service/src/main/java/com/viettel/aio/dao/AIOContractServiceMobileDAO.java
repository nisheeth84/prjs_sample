/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOContractBO;
import com.viettel.aio.bo.StockTransBO;
import com.viettel.aio.bo.StockTransDetailBO;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.dto.AIOAcceptanceRecordsDetailDTO;
import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOCustomerDTO;
import com.viettel.aio.dto.AIOMerEntityDTO;
import com.viettel.aio.dto.AIOPackageDetailDTO;
import com.viettel.aio.dto.AIOStockTransDetailSerialDTO;
import com.viettel.aio.dto.AIOSynStockTransDTO;
import com.viettel.aio.dto.AIOSynStockTransDetailDTO;
import com.viettel.aio.dto.ConstructionImageInfo;
import com.viettel.aio.dto.SysUserRequest;
import com.viettel.aio.webservice.AIOContractServiceWsRsService;
import com.viettel.asset.dto.SysGroupDto;
import com.viettel.cat.dto.CatProvinceDTO;
import com.viettel.coms.bo.UtilAttachDocumentBO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

/**
 * @author HOANM1
 * @version 1.0
 * @since 2019-03-10
 */
@Repository("aioContractServiceMobileDAO")
@EnableTransactionManagement
@Transactional
public class AIOContractServiceMobileDAO extends
        BaseFWDAOImpl<AIOContractBO, Long> {

    public AIOContractServiceMobileDAO() {
        this.model = new AIOContractBO();
    }

    public AIOContractServiceMobileDAO(Session session) {
        this.session = session;
    }

    @Autowired
    private UtilAttachDocumentDAO utilAttachDocumentDAO;

    @Autowired
    private AIOAcceptanceRecordsDetailDAO aioRecordDetailDAO;
    @Autowired
    private AIOSynStockTransDAO aiostockTransDAO;
    @Autowired
    private AIOStockTransDetailDAO aiostockTransDetailDAO;
    @Autowired
    private AIOStockTransDetailSerialDAO aiostockTransDetailSerialDAO;
    @Autowired
    private AIOMerEntityDAO aioMerEntityDAO;

    /**
     * get countContractService
     *
     * @param SysUserRequest request
     * @return List<MerEntityDTO>
     */
    public AIOContractDTO countContractService(SysUserRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append(" select nvl(sum(case when b.status=1 then 1 end),0) sumNonExcute,");
        sql.append(" nvl(sum(case when b.status=2 then 1 end),0) sumExcute ");
        sql.append(" from AIO_CONTRACT a,AIO_CONTRACT_DETAIL b where a.contract_id=b.contract_id ");
        sql.append(" and a.status !=4 and a.type=1 and b.status in(1,2) and performer_id = :sysUserId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("sysUserId", request.getSysUserId());
        query.addScalar("sumNonExcute", new LongType());
        query.addScalar("sumExcute", new LongType());

        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));

        return (AIOContractDTO) query.list().get(0);
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

    // aio_20190315_start
    public List<AIOContractDTO> getListContractServiceTask(
            SysUserRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append(" select a.contract_id contractId, b.WORK_NAME workName,b.START_DATE startDate,b.END_DATE endDate,a.CUSTOMER_PHONE customerPhone,b.PACKAGE_NAME packageName,b.STATUS status, ");
        sql.append(" a.is_money isMoney,b.PACKAGE_DETAIL_ID packageDetailId,b.CONTRACT_DETAIL_ID contractDetailId ");
        sql.append(", a.status statusContract ");
        sql.append("from AIO_CONTRACT a,AIO_CONTRACT_DETAIL b where a.contract_id=b.contract_id ");
        sql.append(" and a.status !=4 and a.type=1 and b.status in(1,2) and a.performer_id = :sysUserId order by b.START_DATE desc");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("sysUserId", request.getSysUserId());
        query.addScalar("contractId", new LongType());
        query.addScalar("workName", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("packageName", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("isMoney", new LongType());
        query.addScalar("packageDetailId", new LongType());
        // hoanm1_20190510_start
        query.addScalar("contractDetailId", new LongType());
        // hoanm1_20190510_end
        query.addScalar("statusContract", new LongType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));

        return query.list();
    }

    public List<AIOContractDTO> getListContractServiceTaskDetail(
            AIOContractMobileRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append(" SELECT DISTINCT a.customer_name customerName, "
                + "  a.CUSTOMER_PHONE customerPhone, "
                + "  a.CUSTOMER_ADDRESS customerAddress, "
                + "  a.CUSTOMER_TAX_CODE customerTaxCode, "
                +
                // VietNT_20/06/2019_start
                " a.status status, "
                + "(select count(*) from aio_contract_detail where CONTRACT_ID = c.contract_id) detailFinished, " +
                // VietNT_end
                "  a.DESCRIPTION description, "
                + "  a.IS_MONEY isMoney, "
                + "  a.SPECIES_NAME speciesName, "
                + "  b.ENGINE_CAPACITY_NAME engineCapacityName, "
                + "  a.AMOUNT_ELECTRIC amountElectric, "
                + "  b.GOODS_NAME goodsName, "
                + "  b.QUANTITY quantity, "
                + "  b.package_id packageId, "
                + "  b.package_detail_id packageDetailId, "
                //thangtv24 130719 start
                + "  b.is_bill isBill, "
                //thangtv24 130719 end
                + "  b.PACKAGE_NAME packageName, "
                + "  b.AMOUNT amountDetail, "
                + "  TO_CHAR(c.start_date,'dd/MM/yyyy hh24:mi:ss') startDateContract, "
                + "  TO_CHAR(c.end_date,'dd/MM/yyyy hh24:mi:ss') endDateContract, "
                + "  a.contract_id contractId, "
                + "  c.ACCEPTANCE_RECORDS_ID acceptanceRecordsId, "
                + "  a.CONTRACT_CODE contractCode, "
                + "  a.CUSTOMER_ID customerId, "
                + "  ROUND((b.quantity*d.PERCENT_DISCOUNT_STAFF/100 * (case when b.amount > 0 then e.PRICE else 0 end) ),2) discountStaff , "
                + "  d.QUANTITY_DISCOUNT quantityDiscount, "
                + "  d.AMOUNT_DISCOUNT amountDiscount, "
                + "  d.percent_discount percentDiscount, "
                + "  b.contract_detail_id contractDetailId, "
                +
                // hoanm1_20190510_start
                "  case when b.amount > 0 then e.PRICE else 0 end price "
                +
                // hoanm1_20190510_end
                //VietNT_27/07/2019_start
                ", b.SALE_CHANNEL saleChannel, " +
                "a.THU_HO thuHo, " +
                "a.APPROVED_PAY approvedPay, " +
                "a.PAY_TYPE payType " +
                //VietNT_end
                "FROM AIO_CONTRACT a "
                + "LEFT JOIN AIO_CONTRACT_DETAIL b "
                + "ON a.contract_id =b.contract_id "
                + "LEFT JOIN AIO_ACCEPTANCE_RECORDS c "
                + "ON b.contract_id =c.contract_id "
                + "AND b.package_id =c.package_id "
                +
                // hoanm1_20190510_start
                " AND b.PACKAGE_DETAIL_ID =c.PACKAGE_DETAIL_ID AND b.CONTRACT_DETAIL_ID =c.CONTRACT_DETAIL_ID "
                +
                // hoanm1_20190510_end
                "INNER JOIN AIO_PACKAGE_DETAIL d "
                + "ON b.PACKAGE_DETAIL_ID =d.AIO_PACKAGE_DETAIL_ID "
                + "LEFT JOIN AIO_PACKAGE_DETAIL_PRICE e "
                + "ON b.PACKAGE_DETAIL_ID  = e.PACKAGE_DETAIL_ID "
                + "where a.contract_id       = :contractId "
                + " AND b.PACKAGE_DETAIL_ID = :packageDetailId "
                +
                // hoanm1_20190510_start
                " and b.CONTRACT_DETAIL_id = :contractDetailId "
                +
                // hoanm1_20190510_end
                "and e.PROVINCE_ID in (select aa.PROVINCE_ID from AIO_CUSTOMER ac "
                + "LEFT JOIN AIO_AREA aa "
                + "ON aa.AREA_ID = ac.AIO_AREA_ID "
                + "left join AIO_CONTRACT acc on ac.CUSTOMER_ID = acc.CUSTOMER_ID "
                + "where acc.CONTRACT_ID = :contractId) ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("contractId", request.getAioContractDTO()
                .getContractId());
        // hoanm1_20190416_start
        query.setParameter("packageDetailId", request.getAioContractDTO()
                .getPackageDetailId());
        // hoanm1_20190416_end
        // hoanm1_20190510_start
        query.setParameter("contractDetailId", request.getAioContractDTO()
                .getContractDetailId());
        // hoanm1_20190510_end
        query.addScalar("customerName", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("customerTaxCode", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("isMoney", new LongType());
        query.addScalar("speciesName", new StringType());
        query.addScalar("engineCapacityName", new StringType());
        query.addScalar("amountElectric", new DoubleType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("packageId", new LongType());
        query.addScalar("packageDetailId", new LongType());
        query.addScalar("packageName", new StringType());
        query.addScalar("amountDetail", new DoubleType());
        query.addScalar("startDateContract", new StringType());
        query.addScalar("endDateContract", new StringType());
        query.addScalar("contractId", new LongType());
        query.addScalar("acceptanceRecordsId", new LongType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("customerId", new LongType());
        query.addScalar("discountStaff", new DoubleType());
        query.addScalar("price", new DoubleType());
        query.addScalar("quantityDiscount", new DoubleType());
        query.addScalar("amountDiscount", new DoubleType());
        query.addScalar("percentDiscount", new DoubleType());
        query.addScalar("contractDetailId", new LongType());
        // VietNT_20/06/2019_start
        query.addScalar("status", new LongType());
        // VietNT_end
        //thangtv24 130719 start
        query.addScalar("isBill", new LongType());
        //thangtv24 130719 end
        //VietNT_27/07/2019_start
        query.addScalar("saleChannel", new StringType());
        query.addScalar("thuHo", new DoubleType());
        query.addScalar("approvedPay", new LongType());
        query.addScalar("payType", new LongType());
        query.addScalar("detailFinished", new IntegerType());
        //VietNT_end
        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));

        return query.list();
    }

    // Huypq-end
    public List<AIOContractDTO> getListPackageGood(
            AIOContractMobileRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append(" select a.aio_package_goods_id aioPackageGoodsId,a.goods_name ||'('|| a.goods_unit_name ||')' goodsName,a.quantity *(select max(detail.QUANTITY) from AIO_CONTRACT_DETAIL detail where detail.PACKAGE_DETAIL_ID=a.aio_package_detail_id "
                + " and detail.CONTRACT_ID = :contractId) quantity, "
                // VietNT_21/06/2019_start
                + "a.type packageGoodsType, "
                // VietNT_end
                + " a.GOODS_ID goodsId,a.GOODS_CODE goodsCode,a.GOODS_UNIT_ID goodsUnitId,a.GOODS_UNIT_NAME goodsUnitName, 1 type,a.GOODS_IS_SERIAL goodsIsSerial,b.GOODS_TYPE goodType "
                + " from AIO_PACKAGE_GOODS a,goods b where a.goods_id=b.goods_id and a.aio_package_detail_id= :packageDetailId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("contractId", request.getAioContractDTO()
                .getContractId());
        query.setParameter("packageDetailId", request.getAioContractDTO()
                .getPackageDetailId());
        query.addScalar("aioPackageGoodsId", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("type", new LongType());
        query.addScalar("goodsIsSerial", new LongType());
        query.addScalar("goodType", new StringType());
        // VietNT_21/06/2019_start
        query.addScalar("packageGoodsType", new LongType());
        // VietNT_end
        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));
        return query.list();
    }

    public List<AIOContractDTO> getListPackageGoodAdd(
            AIOContractMobileRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append("  select a.goods_id goodsId,goods_name ||'('|| a.goods_unit_name ||')' goodsName, "
                + " a.GOODS_CODE goodsCode,a.GOODS_UNIT_ID goodsUnitId,a.GOODS_UNIT_NAME goodsUnitName, 1 type,a.GOODS_IS_SERIAL goodsIsSerial,b.GOODS_TYPE goodType,a.price "
                + " from AIO_PACKAGE_GOODS_ADD a,goods b where a.goods_id=b.goods_id and a.aio_package_detail_id= :packageDetailId ");
        sql.append("  and a.goods_id not in(select goods_id from AIO_PACKAGE_GOODS b where a.aio_package_detail_id=b.aio_package_detail_id)");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("packageDetailId", request.getAioContractDTO()
                .getPackageDetailId());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("type", new LongType());
        query.addScalar("goodsIsSerial", new LongType());
        query.addScalar("goodType", new StringType());
        query.addScalar("price", new DoubleType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));
        return query.list();
    }

    public List<AIOContractDTO> getListPackageGoodAddFull(
            AIOContractMobileRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append("  select a.goods_id goodsId,goods_name ||'('|| a.goods_unit_name ||')' goodsName, "
                + " a.GOODS_CODE goodsCode,a.GOODS_UNIT_ID goodsUnitId,a.GOODS_UNIT_NAME goodsUnitName, 1 type,a.GOODS_IS_SERIAL goodsIsSerial,b.GOODS_TYPE goodType,a.price "
                + " from AIO_PACKAGE_GOODS_ADD a,goods b where a.goods_id=b.goods_id and a.aio_package_detail_id= :packageDetailId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("packageDetailId", request.getAioContractDTO()
                .getPackageDetailId());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("type", new LongType());
        query.addScalar("goodsIsSerial", new LongType());
        query.addScalar("goodType", new StringType());
        query.addScalar("price", new DoubleType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));
        return query.list();
    }

    public List<AIOContractDTO> getListGoodPriceOther(
            AIOContractMobileRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append("  select a.goods_id goodsId,goods_name ||'('|| a.goods_unit_name ||')' goodsName, "
                + "  a.GOODS_CODE goodsCode,a.GOODS_UNIT_ID goodsUnitId,a.GOODS_UNIT_NAME goodsUnitName, 2 type,a.GOODS_IS_SERIAL goodsIsSerial,b.GOODS_TYPE goodType,a.price from AIO_GOODS_PRICE a ");
        sql.append(" ,goods b where a.status=1 and a.goods_id=b.goods_id and a.goods_id not in(select goods_id from AIO_PACKAGE_GOODS b where b.aio_package_detail_id = :packageDetailId )");
        sql.append("  and a.goods_id not in(select goods_id from AIO_PACKAGE_GOODS_ADD b where b.aio_package_detail_id = :packageDetailId )");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("packageDetailId", request.getAioContractDTO()
                .getPackageDetailId());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("type", new LongType());
        query.addScalar("goodsIsSerial", new LongType());
        query.addScalar("goodType", new StringType());
        query.addScalar("price", new DoubleType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));
        return query.list();
    }

    public List<AIOContractDTO> getListGoodPriceOtherFull(
            AIOContractMobileRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append("  select a.goods_id goodsId,goods_name ||'('|| a.goods_unit_name ||')' goodsName, "
                + "  a.GOODS_CODE goodsCode,a.GOODS_UNIT_ID goodsUnitId,a.GOODS_UNIT_NAME goodsUnitName, 2 type,a.GOODS_IS_SERIAL goodsIsSerial,b.GOODS_TYPE goodType,a.price from AIO_GOODS_PRICE a ");
        sql.append(" ,goods b where a.goods_id=b.goods_id and a.status=1 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("type", new LongType());
        query.addScalar("goodsIsSerial", new LongType());
        query.addScalar("goodType", new StringType());
        query.addScalar("price", new DoubleType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));
        return query.list();
    }

    public List<AIOContractDTO> getListGoodUsed(AIOContractMobileRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append("  select a.goods_id goodsId,goods_name goodsName, "
                + " a.GOODS_CODE goodsCode,a.GOODS_UNIT_ID goodsUnitId,a.GOODS_UNIT_NAME goodsUnitName,a.quantity,a.serial "
                + " from AIO_ACCEPTANCE_RECORDS_DETAIL a where a.ACCEPTANCE_RECORDS_ID = :acceptanceRecordId and type=1 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("acceptanceRecordId", request.getAioContractDTO()
                .getAcceptanceRecordsId());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("serial", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));
        return query.list();
    }

    public List<AIOContractDTO> getListGoodUsedAdd(
            AIOContractMobileRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append("  select a.goods_id goodsId,goods_name goodsName, "
                + " a.GOODS_CODE goodsCode,a.GOODS_UNIT_ID goodsUnitId,a.GOODS_UNIT_NAME goodsUnitName,a.quantity,a.serial "
                + " from AIO_ACCEPTANCE_RECORDS_DETAIL a where a.ACCEPTANCE_RECORDS_ID = :acceptanceRecordId and type=2 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("acceptanceRecordId", request.getAioContractDTO()
                .getAcceptanceRecordsId());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("serial", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));
        return query.list();
    }

    public Long updateLocationUser(AIOContractMobileRequest request) {
        try {
            List<Long> lstStatus = getStatusDetail(request.getSysUserRequest()
                    .getSysUserId());
            deleteLocationUser(request.getSysUserRequest().getSysUserId());
            insertLocationUser(request, lstStatus);
        } catch (Exception ex) {
            return 0L;
        }
        return 1L;
    }

    public List<Long> getStatusDetail(Long sysUserId) {
        String sql = new String(
                "select b.STATUS status from AIO_CONTRACT a,AIO_CONTRACT_DETAIL b where a.contract_id=b.contract_id and b.status=2 and a.PERFORMER_ID = :sysUserId");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("sysUserId", sysUserId);
        query.addScalar("status", new LongType());
        return query.list();
    }

    public void deleteLocationUser(Long sysUserId) {
        String sql = new String(
                "delete from AIO_LOCATION_USER a where a.SYS_USER_ID = :sysUserId");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("sysUserId", sysUserId);
        query.executeUpdate();
    }

    public void insertLocationUser(AIOContractMobileRequest request,
                                   List<Long> lstStatus) {
        String sql = new String(
                " insert into AIO_LOCATION_USER (LOCATION_USER_ID,CREATED_DATE,SYS_USER_ID,LAT,LNG,STATUS) values (AIO_LOCATION_USER_seq.nextval,sysdate, :sysUserId , :lat , :lng , :status)");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("sysUserId", request.getSysUserRequest()
                .getSysUserId());
        query.setParameter("lat", request.getAioContractDTO().getLat());
        query.setParameter("lng", request.getAioContractDTO().getLng());
        if (lstStatus.size() > 0) {
            query.setParameter("status", 2);
        } else {
            query.setParameter("status", 1);
        }
        query.executeUpdate();
    }

    public Long startContract(AIOContractMobileRequest request) {
        try {
            // String Contract = checkStatus(request.getSysUserRequest());
            // if (Contract.isEmpty() || Contract.equals("")) {
            updateStartContract(request);
            // } else {
            // this.getSession().clear();
            // return -3L;
            // }
        } catch (Exception ex) {
            this.getSession().clear();
            return 0L;
        }
        return 1L;
    }

    public void updateStartContract(AIOContractMobileRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append("update AIO_ACCEPTANCE_RECORDS set START_DATE=sysdate where contract_id = :contractId and PACKAGE_DETAIL_ID = :packageDetailId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("contractId", request.getAioContractDTO()
                .getContractId());
        query.setParameter("packageDetailId", request.getAioContractDTO()
                .getPackageDetailId());

        StringBuilder sqlContract = new StringBuilder("");
        sqlContract
                .append("update AIO_CONTRACT set status=2 where contract_id = :contractIdContract ");
        SQLQuery queryContract = getSession().createSQLQuery(
                sqlContract.toString());
        queryContract.setParameter("contractIdContract", request
                .getAioContractDTO().getContractId());

        StringBuilder sqlContractDetail = new StringBuilder("");
        sqlContractDetail
                .append("update AIO_CONTRACT_DETAIL set status=2 where contract_id = :contractIdConDetail and PACKAGE_DETAIL_ID = :packageDetailId  ");
        SQLQuery queryContractDetail = getSession().createSQLQuery(
                sqlContractDetail.toString());
        queryContractDetail.setParameter("contractIdConDetail", request
                .getAioContractDTO().getContractId());
        queryContractDetail.setParameter("packageDetailId", request
                .getAioContractDTO().getPackageDetailId());

        query.executeUpdate();
        queryContract.executeUpdate();
        queryContractDetail.executeUpdate();
    }

    public void updateContractHold(AIOContractDTO contractDTO) {
        String updateStatus = StringUtils.EMPTY;
        String updateReason = StringUtils.EMPTY;
        if (contractDTO.getSubAction() == 1) {
            updateReason = "REASON_OUTOFDATE = :reason ";
        }
        if (contractDTO.getStatus() != null) {
            updateStatus = "status = :status ";
        }
        String sql = "update AIO_CONTRACT " +
                "set " +
                updateStatus +
                updateReason +
                "where contract_id = :contractId ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("contractId", contractDTO.getContractId());
        if (contractDTO.getStatus() != null) {
            query.setParameter("status", contractDTO.getStatus());
        }
        if (contractDTO.getSubAction() == 1) {
            query.setParameter("reason", contractDTO.getReasonOutOfDate(), new StringType());
        }

        query.executeUpdate();
    }

    public Long endContract(AIOContractMobileRequest request) {
//		try {
        // updateEndContract(request);;
        Long result = insertBillExportSock(request);
        this.getSession().clear();
        return result;

//			if (result == -1L) {
//				this.getSession().clear();
//				return -1L;
//			}
//			if (result == -2L) {
//				this.getSession().clear();
//				return -2L;
//			}
//		} catch (Exception ex) {
//			ex.printStackTrace();
//			this.getSession().clear();
//			return 0L;
//		}
//		return 1L;
    }

    private Logger LOGGER = Logger
            .getLogger(AIOContractServiceWsRsService.class);

	/*
	@Transactional
	public void updateEndContract(AIOContractMobileRequest request, String stockTransCode) {
		if (request.getAioContractDTO().getCheckBill() == 1) {
			StringBuilder sqlContractDetail = new StringBuilder("");
			sqlContractDetail
					.append("update AIO_CONTRACT_DETAIL set IS_BILL=1,status=3,CUSTOMER_NAME = :customerNameBill,CUSTOMER_ADDRESS =:customerAddressBill,TAX_CODE =:taxCodeBill where contract_id = :contractId "
							+ " and PACKAGE_DETAIL_ID = :packageDetailId and CONTRACT_DETAIL_id = :contractDetailId ");
			SQLQuery queryContractDetail = getSession().createSQLQuery(
					sqlContractDetail.toString());
			queryContractDetail.setParameter("customerNameBill", request
					.getAioContractDTO().getCustomerNameBill());
			queryContractDetail.setParameter("customerAddressBill", request
					.getAioContractDTO().getCustomerAddressBill());
			// hoanm1_20190510_start
			queryContractDetail.setParameter("contractDetailId", request
					.getAioContractDTO().getContractDetailId());
			// hoanm1_20190510_end
			queryContractDetail.setParameter("taxCodeBill", request
					.getAioContractDTO().getTaxCodeBill());
			queryContractDetail.setParameter("contractId", request
					.getAioContractDTO().getContractId());
			queryContractDetail.setParameter("packageDetailId", request
					.getAioContractDTO().getPackageDetailId());
			queryContractDetail.executeUpdate();
		} else {
			StringBuilder sqlContractDetail = new StringBuilder("");
			sqlContractDetail
					.append("update AIO_CONTRACT_DETAIL set IS_BILL=0,status=3 where contract_id = :contractId and PACKAGE_DETAIL_ID = :packageDetailId and CONTRACT_DETAIL_id = :contractDetailId ");
			SQLQuery queryContractDetail = getSession().createSQLQuery(
					sqlContractDetail.toString());
			queryContractDetail.setParameter("contractId", request
					.getAioContractDTO().getContractId());
			queryContractDetail.setParameter("packageDetailId", request
					.getAioContractDTO().getPackageDetailId());
			// hoanm1_20190510_start
			queryContractDetail.setParameter("contractDetailId", request
					.getAioContractDTO().getContractDetailId());
			// hoanm1_20190510_end
			queryContractDetail.executeUpdate();
		}
		StringBuilder sqlRecord = new StringBuilder("");
		sqlRecord
				.append("update AIO_ACCEPTANCE_RECORDS set END_DATE=sysdate,AMOUNT =:amount,DISCOUNT_STAFF =:discountStaff "
						+
						// VietNT_20/06/2019_start
						", PERFORMER_TOGETHER = :performerTogether " +
						// VietNT_end
						"where contract_id = :contractId and PACKAGE_DETAIL_ID = :packageDetailId and CONTRACT_DETAIL_id = :contractDetailId");
		SQLQuery queryRecord = getSession()
				.createSQLQuery(sqlRecord.toString());
		queryRecord.setParameter("amount", request.getAioContractDTO()
				.getAmount());
		queryRecord.setParameter("discountStaff", request.getAioContractDTO()
				.getDiscountStaff());
		queryRecord.setParameter("contractId", request.getAioContractDTO()
				.getContractId());
		queryRecord.setParameter("packageDetailId", request.getAioContractDTO()
				.getPackageDetailId());
		// hoanm1_20190510_start
		queryRecord.setParameter("contractDetailId", request
				.getAioContractDTO().getContractDetailId());
		// hoanm1_20190510_end
		// VietNT_20/06/2019_start
		queryRecord.setParameter("performerTogether",
				request.getPerformTogether(), new StringType());
		// VietNT_end
		queryRecord.executeUpdate();

		Double statusContract = avgStatusContract(request.getAioContractDTO()
				.getContractId());
		StringBuilder sqlContract = new StringBuilder("");
		sqlContract
				.append("update AIO_CONTRACT set status =:status where contract_id = :contractId ");
		SQLQuery queryContract = getSession().createSQLQuery(
				sqlContract.toString());
		if (statusContract == 3.0) {
			queryContract.setParameter("status", 3);
		} else {
			queryContract.setParameter("status", 2);
		}
		queryContract.setParameter("contractId", request.getAioContractDTO()
				.getContractId());

		queryContract.executeUpdate();

		if (request.getLstAIOContractMobileDTO() != null) {
			for (AIOContractDTO obj : request.getLstAIOContractMobileDTO()) {
				List<String> lst = new ArrayList<String>();
				if (obj.getTypeSerial() == 1) {
					lst = obj.getLstSerial();
				} else {
					lst = obj.getLstSerialText();
				}
				AIOAcceptanceRecordsDetailDTO dto =
						this.toAcceptanceDetailDTO(request.getAioContractDTO().getAcceptanceRecordsId(), obj, stockTransCode);
				if (lst != null) {
					for (int i = 0; i < lst.size(); i++) {
						dto.setQuantity(1D);
						dto.setPrice(obj.getPriceRecordDetail());
						dto.setAmount(obj.getPriceRecordDetail());
						dto.setType(obj.getType());
						dto.setSerial(lst.get(i));
						Long idDetail = aioRecordDetailDAO.saveObject(dto.toModel());
						if (idDetail < 1) {
							throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + " ACCEPTANCE_RECORDS_DETAIL");
						}
					}
				} else {
					dto.setQuantity(obj.getQuantity());
					dto.setPrice(obj.getPriceRecordDetail() != null ? obj.getPriceRecordDetail() : 0);
					dto.setAmount(dto.getPrice() * dto.getQuantity());
					dto.setType(obj.getType());
					dto.setSerial(null);
					Long idDetail = aioRecordDetailDAO.saveObject(dto.toModel());
					if (idDetail < 1) {
						throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + " ACCEPTANCE_RECORDS_DETAIL");
					}
				}
			}
		}
		// hoanm1_20190413_start
		SysUserCOMSDTO userDto = getSysUserBySysUserId(request
				.getSysUserRequest().getSysUserId());
		insertLogUpdateCVDV(userDto, request);
		// hoanm1_20190413_end
	}
	 */

    //VietNT_06/08/2019_start
    void updateEndContract(AIOContractMobileRequest request, String stockTransCode) {
        int resultUpdate = this.updateContractDetail(request.getAioContractDTO());
        if (resultUpdate < 1) {
            throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + " CONTRACT_DETAIL");
        }

        resultUpdate = this.updateAcceptanceRecords(request.getAioContractDTO(), request.getPerformTogether());
        if (resultUpdate < 1) {
            throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + " ACCEPTANCE_RECORDS");
        }

        resultUpdate = this.updateStatusContract(request.getAioContractDTO());
        if (resultUpdate < 1) {
            throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + " CONTRACT");
        }

        if (request.getLstAIOContractMobileDTO() != null && !request.getLstAIOContractMobileDTO().isEmpty()) {
            this.createAcceptanceRecordsDetails(request.getLstAIOContractMobileDTO(),
                    request.getAioContractDTO().getAcceptanceRecordsId(),
                    stockTransCode);
        }
    }

    public int updateContractDetail(AIOContractDTO contractDTO) {
        Long isBill = 0L;
        String dataBill = StringUtils.EMPTY;
        if (contractDTO.getCheckBill() == 1) {
            isBill = 1L;
            dataBill = ", CUSTOMER_NAME = :customerNameBill, " +
                    "CUSTOMER_ADDRESS = :customerAddressBill, " +
                    "TAX_CODE = :taxCodeBill ";
        }

        String sql = "update AIO_CONTRACT_DETAIL set " +
                "IS_BILL = :isBill, " +
                "status = 3 " +
                dataBill +
                "where contract_id = :contractId " +
                " and PACKAGE_DETAIL_ID = :packageDetailId " +
                "and CONTRACT_DETAIL_id = :contractDetailId ";

        SQLQuery queryContractDetail = getSession().createSQLQuery(sql);
        queryContractDetail.setParameter("isBill", isBill);
        queryContractDetail.setParameter("contractId", contractDTO.getContractId());
        queryContractDetail.setParameter("packageDetailId", contractDTO.getPackageDetailId());
        queryContractDetail.setParameter("contractDetailId", contractDTO.getContractDetailId());
        if (contractDTO.getCheckBill() == 1) {
            queryContractDetail.setParameter("customerNameBill", contractDTO.getCustomerNameBill());
            queryContractDetail.setParameter("customerAddressBill", contractDTO.getCustomerAddressBill());
            queryContractDetail.setParameter("taxCodeBill", contractDTO.getTaxCodeBill());
        }

        return queryContractDetail.executeUpdate();
    }

    public int updateContractDetailBeforePay(AIOContractDTO contractDTO) {
        Long isBill = 0L;
        String dataBill = StringUtils.EMPTY;
        if (contractDTO.getCheckBill() == 1) {
            isBill = 1L;
            dataBill = ", CUSTOMER_NAME = :customerNameBill, " +
                    "CUSTOMER_ADDRESS = :customerAddressBill, " +
                    "TAX_CODE = :taxCodeBill ";
        }

        String sql = "update AIO_CONTRACT_DETAIL set " +
                "IS_BILL = :isBill " +
//				"status = 3 " +
                dataBill +
                "where contract_id = :contractId " +
                " and PACKAGE_DETAIL_ID = :packageDetailId " +
                "and CONTRACT_DETAIL_id = :contractDetailId ";

        SQLQuery queryContractDetail = getSession().createSQLQuery(sql);
        queryContractDetail.setParameter("isBill", isBill);
        queryContractDetail.setParameter("contractId", contractDTO.getContractId());
        queryContractDetail.setParameter("packageDetailId", contractDTO.getPackageDetailId());
        queryContractDetail.setParameter("contractDetailId", contractDTO.getContractDetailId());
        if (contractDTO.getCheckBill() == 1) {
            queryContractDetail.setParameter("customerNameBill", contractDTO.getCustomerNameBill());
            queryContractDetail.setParameter("customerAddressBill", contractDTO.getCustomerAddressBill());
            queryContractDetail.setParameter("taxCodeBill", contractDTO.getTaxCodeBill());
        }

        return queryContractDetail.executeUpdate();
    }

    public int updateAcceptanceRecords(AIOContractDTO contractDTO, String performTogether) {
        StringBuilder sqlRecord = new StringBuilder("");
        sqlRecord.append("update AIO_ACCEPTANCE_RECORDS set " +
                "END_DATE=sysdate, " +
                "AMOUNT =:amount, " +
                "DISCOUNT_STAFF =:discountStaff " +
                ", PERFORMER_TOGETHER = :performerTogether " +
                ", MONEY_PROMOTION = :moneyPromotion " +
                "where contract_id = :contractId " +
                "and PACKAGE_DETAIL_ID = :packageDetailId " +
                "and CONTRACT_DETAIL_id = :contractDetailId ");
        SQLQuery queryRecord = getSession().createSQLQuery(sqlRecord.toString());
        queryRecord.setParameter("amount", contractDTO.getAmount());
        queryRecord.setParameter("discountStaff", contractDTO.getDiscountStaff());
        queryRecord.setParameter("contractId", contractDTO.getContractId());
        queryRecord.setParameter("packageDetailId", contractDTO.getPackageDetailId());
        queryRecord.setParameter("contractDetailId", contractDTO.getContractDetailId());
        queryRecord.setParameter("performerTogether", performTogether, new StringType());
        queryRecord.setParameter("moneyPromotion", contractDTO.getMoneyPromotion(), new LongType());
        return queryRecord.executeUpdate();
    }

    public int updateStatusContract(AIOContractDTO contractDTO) {
        Double statusContract = this.avgStatusContract(contractDTO.getContractId());
        SQLQuery queryContract = getSession().createSQLQuery(
                "update AIO_CONTRACT set status = :status where contract_id = :contractId ");
        long status = statusContract == 3.0 ? 3L : 2L;
        queryContract.setParameter("status", status);
        queryContract.setParameter("contractId", contractDTO.getContractId());

        return queryContract.executeUpdate();
    }

    public int updateStatusContract(Long contractId) {
        Double statusContract = this.avgStatusContract(contractId);
        SQLQuery queryContract = getSession().createSQLQuery(
                "update AIO_CONTRACT set status = :status where contract_id = :contractId ");
        long status = statusContract == 3.0 ? 3L : 2L;
        queryContract.setParameter("status", status);
        queryContract.setParameter("contractId", contractId);

        return queryContract.executeUpdate();
    }

    public void createAcceptanceRecordsDetails(List<AIOContractDTO> listContract, Long acceptanceRecordsId, String stockTransCode) {
        for (AIOContractDTO obj : listContract) {
            List<String> lst = obj.getTypeSerial() == 1 ? obj.getLstSerial() : obj.getLstSerialText();
            AIOAcceptanceRecordsDetailDTO dto = this.toAcceptanceDetailDTO(acceptanceRecordsId, obj, stockTransCode);
            String key = String.valueOf(obj.getGoodsId());
            if (lst != null) {
                for (int i = 0; i < lst.size(); i++) {
                    dto.setQuantity(1D);
                    dto.setPrice(obj.getPriceRecordDetail());
                    dto.setAmount(obj.getPriceRecordDetail());
                    dto.setSerial(lst.get(i));
                    //VietNT_08/08/2019_start
                    AIOMerEntityDTO guaranteeHolder = mapGuarantee.get(key + "_" + lst.get(i));
                    if (guaranteeHolder != null) {
                        dto.setGuaranteeType(guaranteeHolder.getGuaranteeType());
                        dto.setGuaranteeTypeName(guaranteeHolder.getGuaranteeTypeName());
                        dto.setGuaranteeTime(guaranteeHolder.getGuaranteeTime());
                    }
                    //VietNT_end
                    Long idDetail = aioRecordDetailDAO.saveObject(dto.toModel());
                    if (idDetail < 1) {
                        throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + " ACCEPTANCE_RECORDS_DETAIL");
                    }
                }
            } else {
                dto.setQuantity(obj.getQuantity());
                dto.setPrice(obj.getPriceRecordDetail() != null ? obj.getPriceRecordDetail() : 0);
                dto.setAmount(dto.getPrice() * dto.getQuantity());
                dto.setSerial(null);

                //VietNT_08/08/2019_start
                AIOMerEntityDTO guaranteeHolder = mapGuarantee.get(key);
                if (guaranteeHolder != null) {
                    dto.setGuaranteeType(guaranteeHolder.getGuaranteeType());
                    dto.setGuaranteeTypeName(guaranteeHolder.getGuaranteeTypeName());
                    dto.setGuaranteeTime(guaranteeHolder.getGuaranteeTime());
                }
                //VietNT_end
                Long idDetail = aioRecordDetailDAO.saveObject(dto.toModel());
                if (idDetail < 1) {
                    throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + " ACCEPTANCE_RECORDS_DETAIL");
                }
            }
        }
    }

    private AIOAcceptanceRecordsDetailDTO toAcceptanceDetailDTO(Long acceptanceRecordsId, AIOContractDTO obj, String stockTransCode) {
        AIOAcceptanceRecordsDetailDTO dto = new AIOAcceptanceRecordsDetailDTO();
        dto.setAcceptanceRecordsId(acceptanceRecordsId);
        dto.setGoodsId(obj.getGoodsId());
        dto.setGoodsCode(obj.getGoodsCode());
        dto.setGoodsName(obj.getGoodsName());
        dto.setGoodsUnitId(obj.getGoodsUnitId());
        dto.setGoodsUnitName(obj.getGoodsUnitName());
//		dto.setQuantity(1D);
//		dto.setPrice(obj.getPriceRecordDetail());
//		dto.setAmount(obj.getPriceRecordDetail());

//		dto.setQuantity(obj.getQuantity());
//		dto.setPrice(obj.getPriceRecordDetail() != null ? obj.getPriceRecordDetail() : 0);
//		dto.setAmount(dto.getPrice() * dto.getQuantity());
        dto.setType(obj.getType());
        dto.setStockTransCode(stockTransCode);
        return dto;
    }
    //VietNT_end

    //VietNT_08/08/2019_start
    private HashMap<String, AIOMerEntityDTO> mapGuarantee = new HashMap<>();
    //VietNT_end

    public Long insertBillExportSock(AIOContractMobileRequest obj) {
        String createdStockTransCode = StringUtils.EMPTY;
        if (obj.getAioContractDTO().getCheckStock() == 1) {
            String userName = getUserName(obj.getSysUserRequest()
                    .getSysUserId());
            String GroupName = getGroupName(obj.getSysUserRequest()
                    .getDepartmentId());
            AIOContractDTO stock = getStock(obj.getSysUserRequest()
                    .getSysUserId());
            AIOSynStockTransDTO stockTransDto = new AIOSynStockTransDTO();
            Long sequence = getSequenceStock();
            stockTransDto.setCode("PXK_" + stock.getStockCode() + "/19/"
                    + sequence);
            stockTransDto.setType("2");
            stockTransDto.setStockId(stock.getStockId());
            stockTransDto.setStockCode(stock.getStockCode());
            stockTransDto.setStockName(stock.getStockName());
            stockTransDto.setStatus("2");
            stockTransDto.setSignState("3");
            stockTransDto.setDescription("Xuất kho bán hàng");
            stockTransDto.setCreatedByName(userName);
            stockTransDto.setCreatedDeptId(obj.getSysUserRequest()
                    .getDepartmentId());
            stockTransDto.setCreatedDeptName(GroupName);
            stockTransDto.setRealIeTransDate(new Date());
            stockTransDto.setRealIeUserId(String.valueOf(obj
                    .getSysUserRequest().getSysUserId()));
            stockTransDto.setRealIeUserName(userName);
            stockTransDto.setContractCode(obj.getAioContractDTO()
                    .getContractCode());
            stockTransDto.setCreatedBy(obj.getSysUserRequest().getSysUserId());
            stockTransDto.setCreatedDate(new Date());
            stockTransDto.setBusinessTypeName("Xuất bán cho khách hàng");
            stockTransDto.setDeptReceiveName(GroupName);
            stockTransDto.setDeptReceiveId(obj.getSysUserRequest()
                    .getDepartmentId());
            stockTransDto.setBussinessType("11");
            stockTransDto.setCustId(obj.getAioContractDTO().getCustomerId());
            StockTransBO boStock = stockTransDto.toModel();
            Long stockTransId = aiostockTransDAO.saveObject(boStock);
            //VietNT_06/08/2019_start
            createdStockTransCode = stockTransDto.getCode();
            //VietNT_end
            // hoanm1_20190504_comment_start
            // boStock.setStockTransId(stockTransId);
            // aiostockTransDAO.update(boStock);
            // hoanm1_20190504_comment_end
            if (obj.getLstAIOContractMobileDTO() != null) {
                for (AIOContractDTO bo : obj.getLstAIOContractMobileDTO()) {
                    if (bo.getQuantity() != 0) {
                        Double totalPrice = (double) 0;
                        AIOSynStockTransDetailDTO dto = new AIOSynStockTransDetailDTO();
                        dto.setStockTransId(stockTransId);
                        dto.setGoodsId(bo.getGoodsId());
                        dto.setGoodsCode(bo.getGoodsCode());
                        dto.setGoodsName(bo.getGoodsName());
                        dto.setGoodsIsSerial(bo.getGoodsIsSerial().toString());
                        dto.setGoodsUnitId(bo.getGoodsUnitId());
                        dto.setGoodsUnitName(bo.getGoodsUnitName());
                        dto.setAmountReal(bo.getQuantity());
                        dto.setAmountOrder(bo.getQuantity());
                        // hoanm1_20190517_start
                        dto.setGoodsState("1");
                        dto.setGoodsStateName("Bình thường");
                        dto.setGoodsType(bo.getGoodType());
                        AIOSynStockTransDetailDTO goodType = getGoodTypeName(bo
                                .getGoodsId());
                        dto.setGoodsTypeName(goodType.getGoodsTypeName());
                        // hoanm1_20190517_end
                        StockTransDetailBO boStockDetail = dto.toModel();
                        Long idDetail = aiostockTransDetailDAO.saveObject(boStockDetail);
                        LOGGER.error("Hoanm1 start: kết thúc CVDV có stock_trans_detail");
                        LOGGER.error(stockTransId + "_" + idDetail);
                        LOGGER.error("Hoanm1 end: kết thúc CVDV có stock_trans_detail");
                        // hoanm1_20190504_comment_start
                        // boStockDetail.setStockTransDetailId(idDetail);
                        // aiostockTransDetailDAO.update(boStockDetail);
                        // hoanm1_20190504_comment_end
                        List<String> lst = new ArrayList<String>();
                        if (bo.getTypeSerial() == 1) {
                            lst = bo.getLstSerial();
                        } else {
                            lst = bo.getLstSerialText();
                        }
                        // if(lst!=null) {
                        if (lst != null) {
                            for (int i = 0; i < lst.size(); i++) {
                                AIOMerEntityDTO mer = new AIOMerEntityDTO();
                                mer.setSerial(lst.get(i));
                                mer.setStockId(stock.getStockId());
                                mer.setGoodsId(bo.getGoodsId());
                                mer.setState("1");
                                AIOMerEntityDTO merEntityDto = findBySerial(mer);
                                if (merEntityDto != null) {
                                    //VietNT_08/08/2019_start
                                    // map serial to mer, to get guarantee
                                    String key = bo.getGoodsId() + "_" + lst.get(i);
                                    mapGuarantee.put(key, merEntityDto);
                                    //VietNT_end
                                    merEntityDto.setStatus("5");
                                    if (merEntityDto.getExportDate() == null) {
                                        merEntityDto.setExportDate(new Date());
                                    }
                                    // hoanm1_20190504_comment_start
                                    // String idMerUpdate = aioMerEntityDAO
                                    // .update(merEntityDto.toModel());
                                    // hoanm1_20190504_comment_end
                                    aioMerEntityDAO.update(merEntityDto
                                            .toModel());
                                    AIOStockTransDetailSerialDTO detailSerial = createFromMerEntity(
                                            merEntityDto, stockTransId,
                                            idDetail);
                                    totalPrice = totalPrice
                                            + detailSerial.getQuantity()
                                            * (detailSerial.getPrice() != null ? detailSerial
                                            .getPrice() : 0);
                                    Long idDetailSerial = aiostockTransDetailSerialDAO
                                            .saveObject(detailSerial.toModel());
                                } else {
//									return -1L;
                                    throw new BusinessException("Hàng hóa không tồn tại trong kho xuất của người dùng");
                                }
                            }
                        } else {

                            List<AIOMerEntityDTO> availabelGoods = findByGoodsForExport(
                                    bo.getGoodsId(), "1", stock.getStockId());
                            if (availabelGoods == null
                                    || availabelGoods.size() == 0) {
//								return -1L;
                                throw new BusinessException("Hàng hóa không tồn tại trong kho xuất của người dùng");
                            }

                            //VietNT_08/08/2019_start
                            // map serial to mer, to get guarantee
                            String key = bo.getGoodsId() + "";
                            mapGuarantee.put(key, availabelGoods.get(0));
                            //VietNT_end

                            AIOMerEntityDTO currentEntity = null;
                            Double exportAmount = bo.getQuantity();
                            Double amountSum = findByGoodsForExportSum(
                                    bo.getGoodsId(), "1", stock.getStockId());
                            if (exportAmount - amountSum > 0) {
//								return -2L;
                                throw new BusinessException("Số lượng hàng tồn kho không đủ");
                            }
                            StringBuilder lstMerEntityId = new StringBuilder("");
                            for (AIOMerEntityDTO goods : availabelGoods) {
                                if (exportAmount - goods.getAmount() < 0) {
                                    currentEntity = goods;
                                    break;
                                }
                                exportAmount = (double) Math
                                        .round((exportAmount - goods
                                                .getAmount()) * 1000) / 1000;
                                goods.setStatus("5");
                                if (goods.getExportDate() == null) {
                                    goods.setExportDate(new Date());
                                }
                                // hoanm1_20190504_comment_start
                                // String idMerUpdate = aioMerEntityDAO
                                // .update(goods.toModel());
                                // hoanm1_20190504_comment_end
                                aioMerEntityDAO.update(goods.toModel());

                                AIOStockTransDetailSerialDTO detailSerial = createFromMerEntity(
                                        goods, stockTransId, idDetail);
                                if (detailSerial.getPrice() == null) {
                                    detailSerial.setPrice(0d);
                                }
                                totalPrice = totalPrice
                                        + detailSerial.getQuantity()
                                        * detailSerial.getPrice();
                                Long idDetailSerial = aiostockTransDetailSerialDAO
                                        .saveObject(detailSerial.toModel());
                            }
                            if (exportAmount > 0) {
                                Long currentId = currentEntity.getMerEntityId();
                                Long currentParrent_entity = currentEntity
                                        .getParentMerEntityId();
                                Double remainAmount = currentEntity.getAmount()
                                        - exportAmount;
                                Long currentOrderId = currentEntity
                                        .getOrderId();
                                Date currentExportDate = currentEntity
                                        .getExportDate();
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
                                Long idMerInsert = aioMerEntityDAO
                                        .saveObject(newEntity.toModel());
                                // hoanm1_20190504_comment_start
                                // aioMerEntityDAO.update(newEntity.toModel());
                                // hoanm1_20190504_comment_end
                                newEntity.setMerEntityId(idMerInsert);
                                // luu stock trans detail serial
                                AIOStockTransDetailSerialDTO detailSerial = createFromMerEntity(
                                        newEntity, stockTransId, idDetail);
                                Double price = detailSerial.getPrice() != null ? detailSerial
                                        .getPrice() : 0;
                                totalPrice = totalPrice
                                        + detailSerial.getQuantity() * price;
                                Long idDetailSerial = aiostockTransDetailSerialDAO
                                        .saveObject(detailSerial.toModel());

                                // update lai thong tin mer entity goc
                                currentEntity.setAmount(remainAmount);
                                currentEntity.setStatus("4");
                                currentEntity.setMerEntityId(currentId);
                                currentEntity
                                        .setParentMerEntityId(currentParrent_entity);
                                currentEntity.setOrderId(currentOrderId);
                                currentEntity.setExportDate(currentExportDate);
                                // hoanm1_20190504_comment_start
                                // String idMerUpdate = aioMerEntityDAO
                                // .update(currentEntity.toModel());
                                // hoanm1_20190504_comment_end
                                aioMerEntityDAO.update(currentEntity.toModel());
                            }
                        }
                        // }
                        boStockDetail.setTotalPrice(totalPrice);
                        aiostockTransDetailDAO.update(boStockDetail);
                        // hoanm1_20190517_start
                        // Double totalPrice = (double) 0;
                        bo.setPriceRecordDetail((double) Math
                                .round((totalPrice / bo.getQuantity()) * 100) / 100);
                        // hoanm1_20190517_end
                        // hoanm1_20190508_start
                        AIOSynStockTransDTO stockTotal = getStockGoodTotal(
                                stock.getStockId(), bo.getGoodsId());
                        StringBuilder sql = new StringBuilder("");
                        if (stockTotal != null) {
                            sql.append("UPDATE stock_goods_total st set change_date=sysdate, st.amount= "
                                    + stockTotal.getAmount()
                                    + " - :amount,st.amount_issue =  "
                                    + stockTotal.getAmountIssue()
                                    + " - :amount"
                                    + " WHERE st.stock_goods_total_id  = :stockGoodsTotalId");
                            SQLQuery query = getSession().createSQLQuery(
                                    sql.toString());
                            query.setParameter("amount", bo.getQuantity());
                            query.setParameter("stockGoodsTotalId",
                                    stockTotal.getStockGoodsTotalId());
                            query.executeUpdate();
                        }
                        // hoanm1_20190508_end
                    }
                }
            } else {
                LOGGER.error("Hoanm1 start: kết thúc CVDV không có stock_trans_detail");
                LOGGER.error(stockTransId);
                LOGGER.error("Hoanm1 end: kết thúc CVDV không có stock_trans_detail");
            }
        }
        this.updateEndContract(obj, createdStockTransCode);
        // hoanm1_20190413_start
        SysUserCOMSDTO userDto = getSysUserBySysUserId(obj.getSysUserRequest().getSysUserId());
        insertLogUpdateCVDV(userDto, obj);
        // hoanm1_20190413_end
        return 1L;
    }

    // hoanm1_20190413_start
    public SysUserCOMSDTO getSysUserBySysUserId(Long sysUserId) {

        StringBuilder sql = new StringBuilder("SELECT "
                + "SU.SYS_USER_ID sysUserId " + ",SU.LOGIN_NAME loginName "
                + ",SU.FULL_NAME fullName " + ",SU.PASSWORD password "
                + ",SU.EMPLOYEE_CODE employeeCode " + ",SU.EMAIL email "
                + ",SU.PHONE_NUMBER phoneNumber " + ",SU.STATUS status "
                + ",SU.SYS_GROUP_ID departmentId " + ",SY.NAME sysGroupName "
                + " FROM SYS_USER SU " + "LEFT JOIN sys_group SY "
                + "ON SU.SYS_GROUP_ID = SY.SYS_GROUP_ID "
                + "WHERE SU.SYS_USER_ID = :sysUserId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("password", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("departmentId", new LongType());
        query.addScalar("sysGroupName", new StringType());

        query.setParameter("sysUserId", sysUserId);

        query.setResultTransformer(Transformers
                .aliasToBean(SysUserCOMSDTO.class));

        return (SysUserCOMSDTO) query.list().get(0);

    }

    public void insertLogUpdateCVDV(SysUserCOMSDTO userDto,
                                    AIOContractMobileRequest requestDTO) {
        StringBuilder sqlWorkItemTask = new StringBuilder(
                " INSERT INTO KPI_LOG_MOBILE_AIO (KPI_LOG_MOBILE_ID, SYSUSERID, LOGINNAME, PASSWORD,  EMAIL, FULLNAME, "
                        + " EMPLOYEECODE, PHONENUMBER, SYSGROUPNAME, SYSGROUPID, TIME_DATE,update_time,FUNCTION_CODE,DESCRIPTION, "
                        + " contractId,contractCode,packageDetailId,acceptanceRecordsId,customerId)"
                        + " VALUES (KPI_LOG_MOBILE_AIO_seq.nextval,:SYSUSERID,:LOGINNAME,:PASSWORD,:EMAIL,:FULLNAME,"
                        + " :EMPLOYEECODE,:PHONENUMBER,:SYSGROUPNAME,:SYSGROUPID,sysdate,trunc(sysdate),:functionCode,:description, "
                        + "  :contractId,:contractCode,:packageDetailId,:acceptanceRecordsId,:customerId) ");
        SQLQuery queryWorkItemTask = getSession().createSQLQuery(
                sqlWorkItemTask.toString());

        queryWorkItemTask.setParameter("SYSUSERID", userDto.getSysUserId());
        queryWorkItemTask.setParameter("LOGINNAME", userDto.getLoginName());
        queryWorkItemTask.setParameter("PASSWORD", userDto.getPassword());
        queryWorkItemTask.setParameter("EMAIL", userDto.getEmail());
        queryWorkItemTask.setParameter("FULLNAME", userDto.getFullName());
        queryWorkItemTask.setParameter("EMPLOYEECODE",
                userDto.getEmployeeCode());
        queryWorkItemTask.setParameter("PHONENUMBER", userDto.getPhoneNumber());
        queryWorkItemTask.setParameter("SYSGROUPNAME",
                userDto.getSysGroupName());
        queryWorkItemTask.setParameter("SYSGROUPID", userDto.getDepartmentId());
        queryWorkItemTask.setParameter("functionCode", "UPDATE CVDV");
        queryWorkItemTask.setParameter("description",
                "Kết thúc công việc dịch vụ");
        queryWorkItemTask.setParameter("contractId", requestDTO
                .getAioContractDTO().getContractId());
        queryWorkItemTask.setParameter("contractCode", requestDTO
                .getAioContractDTO().getContractCode());
        queryWorkItemTask.setParameter("packageDetailId", requestDTO
                .getAioContractDTO().getPackageDetailId());
        queryWorkItemTask.setParameter("acceptanceRecordsId", requestDTO
                .getAioContractDTO().getAcceptanceRecordsId());
        queryWorkItemTask.setParameter("customerId", requestDTO
                .getAioContractDTO().getCustomerId());
        queryWorkItemTask.executeUpdate();
    }

    // hoanm1_20190413_end
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
                        //VietNT_08/08/2019_start
                        + ",s.GUARANTEE_TYPE guaranteeType "
                        + ",s.GUARANTEE_TIME guaranteeTime "
                        + ",s.GUARANTEE_TYPE_NAME guaranteeTypeName "
                        //VietNT_end
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

        sql.append(" ORDER BY st.NAME");

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
        //VietNT_08/08/2019_start
        query.addScalar("guaranteeType", new LongType());
        query.addScalar("guaranteeTypeName", new StringType());
        query.addScalar("guaranteeTime", new LongType());
        //VietNT_end
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

    public Double avgStatusContract(Long contractId) {
        String sql = new String(
                "select round(nvl(avg(status),0),2)status from AIO_CONTRACT_DETAIL  a where a.CONTRACT_ID =:contractId");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("status", new DoubleType());
        query.setParameter("contractId", contractId);
        List<Double> lstDoub = query.list();
        if (lstDoub != null && lstDoub.size() > 0) {
            return lstDoub.get(0);
        }
        return 0D;
    }

    public List<ConstructionImageInfo> getImagesByPackageDetailId(
            Long packageDetailId) {
        String sql = new String(
                "select a.UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId, a.name imageName, a.file_path imagePath , 1 status from UTIL_ATTACH_DOCUMENT a "
                        + " where a.object_id = :packageDetailId AND a.TYPE = '97' and a.STATUS = 1 "
                        + " ORDER BY a.UTIL_ATTACH_DOCUMENT_ID DESC ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("imagePath", new StringType());
        query.addScalar("imageName", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("utilAttachDocumentId", new LongType());
        query.setParameter("packageDetailId", packageDetailId);
        query.setResultTransformer(Transformers
                .aliasToBean(ConstructionImageInfo.class));
        return query.list();
    }

    public void updateUtilAttachDocumentById(Long utilAttachDocumentId) {
        StringBuilder sql = new StringBuilder(" ");
        sql.append("DELETE FROM UTIL_ATTACH_DOCUMENT a  WHERE a.UTIL_ATTACH_DOCUMENT_ID =:id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", utilAttachDocumentId);
        query.executeUpdate();
    }

    public void saveImagePathsDao(List<AIOContractDTO> lstImages,
                                  long contractDetailId, SysUserRequest request) {

        if (lstImages == null) {
            return;
        }

        for (AIOContractDTO pakageDetailImage : lstImages) {

            UtilAttachDocumentBO utilAttachDocumentBO = new UtilAttachDocumentBO();
            utilAttachDocumentBO.setObjectId(contractDetailId);
            utilAttachDocumentBO.setName(pakageDetailImage.getImageName());
            utilAttachDocumentBO.setType("97");
            utilAttachDocumentBO
                    .setDescription("file ảnh thực hiện công việc dịch vụ aio");
            utilAttachDocumentBO.setStatus("1");
            utilAttachDocumentBO.setFilePath(pakageDetailImage.getImagePath());
            utilAttachDocumentBO.setCreatedDate(new Date());
            utilAttachDocumentBO.setCreatedUserId(request.getSysUserId());
            utilAttachDocumentBO.setCreatedUserName(request.getName());
            if (pakageDetailImage.getLongtitude() != null) {
                utilAttachDocumentBO.setLongtitude(pakageDetailImage
                        .getLongtitude());
            }
            if (pakageDetailImage.getLatitude() != null) {
                utilAttachDocumentBO.setLatitude(pakageDetailImage
                        .getLatitude());
            }
            long ret = utilAttachDocumentDAO.saveObject(utilAttachDocumentBO);
        }
    }

    public long getAcceptanceRecordId(Long packageDetailId) {
        String sql = new String(
                "select nvl(max(a.ACCEPTANCE_RECORDS_ID),0) acceptanceRecordsId from AIO_ACCEPTANCE_RECORDS a where a.PACKAGE_DETAIL_ID = :packageDetailId ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("packageDetailId", packageDetailId);
        query.addScalar("acceptanceRecordsId", new LongType());
        List<Long> lstStock = query.list();
        if (lstStock != null && lstStock.size() > 0) {
            return lstStock.get(0);
        }
        return -1;
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

        //VietNT_08/08/2019_start
        stringBuilder.append(", T1.GUARANTEE_TYPE guaranteeType ")
                .append(", T1.GUARANTEE_TIME guaranteeTime ")
                .append(", T1.GUARANTEE_TYPE_NAME guaranteeTypeName ");
        //VietNT_end

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
        //VietNT_08/08/2019_start
        query.addScalar("guaranteeType", new LongType());
        query.addScalar("guaranteeTypeName", new StringType());
        query.addScalar("guaranteeTime", new LongType());
        //VietNT_end

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

    public String checkStatus(SysUserRequest request) {
        StringBuilder sql = new StringBuilder("");
        sql.append(" select a.contract_id contractId from AIO_CONTRACT a,AIO_CONTRACT_DETAIL b where a.contract_id=b.contract_id ");
        sql.append(" and  b.status in(2) and a.performer_id = :sysUserId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("sysUserId", request.getSysUserId());
        query.addScalar("contractId", new StringType());
        List<String> lstContract = query.list();
        if (lstContract != null && lstContract.size() > 0) {
            return lstContract.get(0).toString();
        }
        return "";
    }

    public List<AIOContractDTO> getAppAIOVersion() {
        StringBuilder sql = new StringBuilder(
                "SELECT NAME AS version, DESCRIPTION link " + "FROM APP_PARAM "
                        + "WHERE PAR_TYPE='MOBILE_AIO_VERSION'");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("version", new StringType());
        query.addScalar("link", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));
        return query.list();
    }

    // aio_20190315_end
    // 20190508_hoanm1_start
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

    public AIOSynStockTransDTO getStockGoodTotal(Long StockId, Long goodId) {
        String sql = new String(
                "select a.stock_id stockId,a.stock_goods_total_id stockGoodsTotalId, a.amount,a.amount_issue amountIssue from stock_goods_total a where stock_id = :stockId and goods_id = :goodId ");
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

    // 20190508_hoanm1_end

    // Huypq-20190503-start
    // Lấy mã dịch vụ
    public List<AIOConfigServiceDTO> getCodeAioConfigService() {
        String sql = "SELECT " +
                "AIO_CONFIG_SERVICE_ID aioConfigServiceId, " +
                "CODE code, " +
                "NAME name, " +
                "TYPE type, " +
                "STATUS status " +
                ", industry_Code industryCode " +
                "FROM AIO_CONFIG_SERVICE";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("aioConfigServiceId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("type", new LongType());
        query.addScalar("status", new StringType());
        query.addScalar("industryCode", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOConfigServiceDTO.class));
        return query.list();
    }

    // Lấy chủng loại
    public List<AppParamDTO> getSpeciesAppParam() {
        StringBuilder sql = new StringBuilder(
                "select APP_PARAM_ID appParamId, " + "CODE code, "
                        + "NAME name, " + "PAR_TYPE parType, "
                        + "STATUS status " + "from CTCT_CAT_OWNER.APP_PARAM "
                        + "where PAR_TYPE='SPECIES'");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("appParamId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("parType", new StringType());
        query.addScalar("status", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));
        return query.list();
    }

    // Lấy khu vực
    public List<AppParamDTO> getAreaAppParam() {
        StringBuilder sql = new StringBuilder(
                "select APP_PARAM_ID appParamId, " + "CODE code, "
                        + "NAME name, " + "PAR_TYPE parType, "
                        + "STATUS status " + "from CTCT_CAT_OWNER.APP_PARAM "
                        + "where PAR_TYPE='AREA' order by APP_PARAM_ID asc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("appParamId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("parType", new StringType());
        query.addScalar("status", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));
        return query.list();
    }

    // Lấy list tỉnh theo mã kv
    public List<CatProvinceDTO> getListProvinceByAreaCode(String code) {
        StringBuilder sql = new StringBuilder(
                "SELECT CAT_PROVINCE_ID catProvinceId, " + "CODE code, "
                        + "NAME name, " + "STATUS status "
                        + "from CTCT_CAT_OWNER.CAT_PROVINCE "
                        + "where AREA_CODE=:code order by CAT_PROVINCE_ID asc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(CatProvinceDTO.class));
        query.setParameter("code", code);
        return query.list();
    }

    // Lấy tỉnh/thành phố
    public List<AIOAreaDTO> getDataProvinceCity() {
        StringBuilder sql = new StringBuilder("SELECT AREA_ID areaId, "
                + "code code, " + "name name, " + "PROVINCE_ID provinceId, "
                + "AREA_LEVEL areaLevel " + "FROM AIO_AREA "
                + "where AREA_LEVEL=2 order by AREA_ID asc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("areaId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("provinceId", new LongType());
        query.addScalar("areaLevel", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOAreaDTO.class));
        return query.list();
    }

    // Lấy quận/huyện
    public List<AIOAreaDTO> getDataDistrict(Long id) {
        StringBuilder sql = new StringBuilder("SELECT AREA_ID areaId, "
                + "code code, " + "name name, " + "PROVINCE_ID provinceId, "
                + "AREA_LEVEL areaLevel " + "FROM AIO_AREA "
                + "where AREA_LEVEL=3 and PARENT_ID=:id order by AREA_ID asc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("areaId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("provinceId", new LongType());
        query.addScalar("areaLevel", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOAreaDTO.class));
        query.setParameter("id", id);
        return query.list();
    }

    // Lấy xã/phường
    public List<AIOAreaDTO> getDataWard(Long id) {
        StringBuilder sql = new StringBuilder("SELECT AREA_ID areaId, "
                + "code code, " + "sys_user_id sysUserId, " + "name name, "
                + "PROVINCE_ID provinceId, " + "AREA_LEVEL areaLevel "
                + "FROM AIO_AREA "
                + "where AREA_LEVEL=4 and PARENT_ID=:id order by AREA_ID asc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("areaId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("provinceId", new LongType());
        query.addScalar("areaLevel", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOAreaDTO.class));
        query.setParameter("id", id);
        return query.list();
    }

    // Lấy dữ liệu gói
    public List<AIOPackageDetailDTO> getDataPackageDetail(AIOAreaDTO criteria) {
//	Long type, Long id,	String code, String saleChannel) { // Huypq-20190606-add
        StringBuilder sql = new StringBuilder(
                "select apd.AIO_PACKAGE_DETAIL_ID aioPackageDetailId, "
                        + "apd.AIO_PACKAGE_ID aioPackageId, "
                        + "apd.ENGINE_CAPACITY_ID engineCapacityId, "
                        + "apd.ENGINE_CAPACITY_NAME engineCapacityName, "
                        + "apd.QUANTITY_DISCOUNT quantityDiscount, "
                        + "apd.AMOUNT_DISCOUNT amountDiscount, "
                        + "apd.PERCENT_DISCOUNT percentDiscount, "
                        + "apd.GOODS_ID goodsId, "
                        + "apd.GOODS_NAME goodsName, "
                        + "apd.PERCENT_DISCOUNT_STAFF percentDiscountStaff, "
                        + "apdp.PRICE price, "
                        + "ap.NAME aioPackageName, "
                        + "ap.REPEAT_NUMBER repeatNumber, "
                        + "ap.REPEAT_INTERVAL repeatInterval, "
                        + "ap.TIME aioPackageTime "
                        + "from AIO_PACKAGE_DETAIL apd "
                        + "inner join AIO_PACKAGE ap "
                        + "on ap.AIO_PACKAGE_ID = apd.AIO_PACKAGE_ID "
                        + "left join AIO_PACKAGE_DETAIL_PRICE apdp "
                        + "on apd.AIO_PACKAGE_DETAIL_ID=apdp.PACKAGE_DETAIL_ID "
                        + "left join AIO_CONFIG_SERVICE acs on acs.CODE = ap.SERVICE_CODE "
//                        + " where acs.type=:type"
                        + " where 1=1 "
                        + " and apdp.PROVINCE_ID=:id "
                        + " and  ap.STATUS = 1 "); // Huypq-20190606-add
        sql.append("and (upper(acs.code) = upper(:code) " +
                "or ((upper(acs.industry_code) = upper(:industryCode)) and (acs.type = 1))) ");
        // VietNT_25/06/2019_start
        sql.append("and upper(ap.sale_channel) = upper(:saleChannel) ");
        // VietNT_end
        if (criteria.getIsInternal() != null) {
            sql.append("and ap.is_internal = 1 ");
        }
        sql.append(" order by AIO_PACKAGE_DETAIL_ID asc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("aioPackageDetailId", new LongType());
        query.addScalar("aioPackageId", new LongType());
        query.addScalar("engineCapacityId", new LongType());
        query.addScalar("engineCapacityName", new StringType());
        query.addScalar("quantityDiscount", new DoubleType());
        query.addScalar("amountDiscount", new DoubleType());
        query.addScalar("percentDiscount", new DoubleType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("percentDiscountStaff", new DoubleType());
        query.addScalar("price", new DoubleType());
        query.addScalar("aioPackageName", new StringType());
        query.addScalar("aioPackageTime", new LongType());
        query.addScalar("repeatNumber", new LongType());
        query.addScalar("repeatInterval", new LongType());

        query.setResultTransformer(Transformers
                .aliasToBean(AIOPackageDetailDTO.class));
//        query.setParameter("type", criteria.getType());
        query.setParameter("id", criteria.getProvinceId());
        query.setParameter("code", criteria.getConfigServiceCode()); // Huypq-20190606-add
        query.setParameter("industryCode", criteria.getIndustryCode());
        // VietNT_25/06/2019_start
        query.setParameter("saleChannel", criteria.getText(), new StringType());
        // VietNT_end

        return query.list();
    }

    // Lấy data khách hàng
    public List<AIOCustomerDTO> getDataCustomer(AIOCustomerDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT CUSTOMER_ID customerId, "
                + "CODE code, " + "NAME name, " + "PHONE phone, "
                + "TAX_CODE taxCode, " + "PASSPORT passport, "
                + "PURVEY_DATE purveyDate, " + "ADDRESS address, "
                + "EMAIL email, " + "TYPE type " + "FROM AIO_CUSTOMER "
                + "where 1=1 ");
        if (StringUtils.isNotEmpty(obj.getName())) {
            sql.append(" AND (upper(NAME) LIKE upper(:name) escape '&' OR upper(CODE) LIKE upper(:name) escape '&')");
        }

        if (StringUtils.isNotEmpty(obj.getTaxCode())) {
            sql.append(" AND TAX_CODE like :taxCode ");
        }

        if (StringUtils.isNotEmpty(obj.getPassport())) {
            sql.append(" AND PASSPORT like :passport ");
        }

        if (StringUtils.isNotEmpty(obj.getEmail())) {
            sql.append(" AND EMAIL like :email ");
        }

        if (StringUtils.isNotEmpty(obj.getAddress())) {
            sql.append(" AND (upper(ADDRESS) LIKE upper(:address) escape '&') ");
        }
        sql.append(" order by CUSTOMER_ID asc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("customerId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("phone", new StringType());
        query.addScalar("taxCode", new StringType());
        query.addScalar("passport", new StringType());
        query.addScalar("purveyDate", new DateType());
        query.addScalar("address", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("type", new LongType());

        query.setResultTransformer(Transformers
                .aliasToBean(AIOCustomerDTO.class));

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", obj.getName());
        }

        if (StringUtils.isNotEmpty(obj.getTaxCode())) {
            query.setParameter("taxCode", obj.getTaxCode());
        }

        if (StringUtils.isNotEmpty(obj.getPassport())) {
            query.setParameter("passport", obj.getPassport());
        }

        if (StringUtils.isNotEmpty(obj.getEmail())) {
            query.setParameter("email", obj.getEmail());
        }

        if (StringUtils.isNotEmpty(obj.getAddress())) {
            query.setParameter("address", obj.getAddress());
        }

        return query.list();
    }

    public AIOCustomerDTO checkCustomer(AIOCustomerDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT CUSTOMER_ID customerId, "
                + "CODE code, " + "NAME name, " + "PHONE phone, "
                + "TAX_CODE taxCode, " + "PASSPORT passport, "
                + "PURVEY_DATE purveyDate, " + "ADDRESS address, "
                + "EMAIL email, " + "TYPE type " + "FROM AIO_CUSTOMER "
                + "where 1=1 ");

        if (StringUtils.isNotEmpty(obj.getTaxCode())) {
            sql.append(" AND TAX_CODE = :taxCode ");
        }

        if (StringUtils.isNotEmpty(obj.getPassport())) {
            sql.append(" AND PASSPORT = :passport ");
        }

        if (StringUtils.isNotEmpty(obj.getPhone())) {
            sql.append(" AND PHONE = :phone ");
        }

        sql.append(" order by CUSTOMER_ID asc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("customerId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("phone", new StringType());
        query.addScalar("taxCode", new StringType());
        query.addScalar("passport", new StringType());
        query.addScalar("purveyDate", new DateType());
        query.addScalar("address", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("type", new LongType());

        query.setResultTransformer(Transformers
                .aliasToBean(AIOCustomerDTO.class));

        if (StringUtils.isNotEmpty(obj.getTaxCode())) {
            query.setParameter("taxCode", obj.getTaxCode());
        }

        if (StringUtils.isNotEmpty(obj.getPassport())) {
            query.setParameter("passport", obj.getPassport());
        }

        if (StringUtils.isNotEmpty(obj.getPhone())) {
            query.setParameter("phone", obj.getPhone());
        }

        @SuppressWarnings("unchecked")
        List<AIOCustomerDTO> lst = query.list();
        if (lst.size() > 0) {
            return lst.get(0);
        }
        return null;
    }

    // Lấy danh sách hợp đồng theo performer
    public List<AIOContractDTO> getContractOfPerformer(Long id) {
        StringBuilder sql = new StringBuilder("SELECT distinct c.CONTRACT_ID contractId, "
                + "  c.CONTRACT_CODE contractCode, "
                + "  c.CUSTOMER_ID customerId, "
                + "  c.CUSTOMER_CODE customerCode, "
                + "  c.CUSTOMER_NAME customerName, "
                + "  c.CUSTOMER_PHONE customerPhone, "
                + "  c.CREATED_DATE createdDate, "
                + "  c.CUSTOMER_ADDRESS customerAddress, "
                + "  c.CAT_PROVINCE_ID catProvinceId, "
                + "  c.CAT_PROVINCE_CODE catProvinceCode, "
                + "  c.AREA_ID areaId, " + "  c.AREA_NAME areaCode, "
                + "  c.SPECIES_ID speciesId, " + "  c.SPECIES_NAME speciesName,"
                + "  c.STATUS status, " + "  c.CONTRACT_AMOUNT contractAmount " +
                ", su.employee_code || '-' || su.full_name performerName " +
                ", su.PHONE_NUMBER performerPhone "
                + "  FROM AIO_CONTRACT c " +
                " left join sys_user su on su.sys_user_id = c.PERFORMER_ID "
                + "  WHERE c.status in (1,2" +
                // VietNT_20/06/2019_start
                ",0,3" +
                // VietNT_end
                ") " +
                "  and (c.CREATED_USER=:id) " +
                "order by c.CONTRACT_ID desc");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("contractId", new LongType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("customerId", new LongType());
        query.addScalar("customerCode", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("contractAmount", new DoubleType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("performerPhone", new StringType());

        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));

        query.setParameter("id", id);

        return query.list();
    }

    // Lấy chi tiết hợp đồng
    public List<AIOPackageDetailDTO> getListPackageDetail(AIOContractDTO obj) {
        StringBuilder sql = new StringBuilder(
                "SELECT "
                        + "  ap.name aioPackageName, "
                        + "  ad.CONTRACT_ID contractId,ad.CONTRACT_DETAIL_ID contractDetailId, "
                        + "  ad.QUANTITY quantity, "
                        + "  apd.QUANTITY_DISCOUNT quantityDiscount, "
                        + "  apd.AMOUNT_DISCOUNT amountDiscount, "
                        + "  apd.PERCENT_DISCOUNT percentDiscount, "
                        + "  apd.PERCENT_DISCOUNT_STAFF percentDiscountStaff, apd.AIO_PACKAGE_ID aioPackageId,"
                        + "  apd.AIO_PACKAGE_DETAIL_ID aioPackageDetailId,"
                        + "  apdp.PRICE price "
                        + "FROM AIO_CONTRACT_DETAIL ad "
                        + "LEFT JOIN AIO_PACKAGE ap "
                        + "ON ad.PACKAGE_ID=ap.AIO_PACKAGE_ID "
                        + "LEFT JOIN AIO_PACKAGE_DETAIL apd "
                        + "ON apd.AIO_PACKAGE_ID   =ap.AIO_PACKAGE_ID "
                        + "AND ad.PACKAGE_DETAIL_ID=apd.AIO_PACKAGE_DETAIL_ID "
                        + "left join AIO_PACKAGE_DETAIL_PRICE apdp "
                        + "on apd.AIO_PACKAGE_DETAIL_ID = apdp.PACKAGE_DETAIL_ID "
                        + "and apd.AIO_PACKAGE_ID = apdp.PACKAGE_ID "
                        + "WHERE ad.CONTRACT_ID    = :contractId "
                        + "and apdp.PROVINCE_ID= :provinceId "
                        + " and ad.AMOUNT!=0 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("aioPackageName", new StringType());
        query.addScalar("contractId", new LongType());
        query.addScalar("contractDetailId", new LongType());
        query.addScalar("quantity", new LongType());
        query.addScalar("quantityDiscount", new DoubleType());
        query.addScalar("amountDiscount", new DoubleType());
        query.addScalar("percentDiscount", new DoubleType());
        query.addScalar("percentDiscountStaff", new DoubleType());
        query.addScalar("aioPackageId", new LongType());
        query.addScalar("aioPackageDetailId", new LongType());
        query.addScalar("price", new DoubleType());

        query.setResultTransformer(Transformers
                .aliasToBean(AIOPackageDetailDTO.class));

        query.setParameter("contractId", obj.getContractId());
        query.setParameter("provinceId", obj.getCatProvinceId());

        return query.list();
    }

    // Update table khách hàng
    public int updateCustomer(AIOCustomerDTO obj) {
        StringBuilder sql = new StringBuilder(
                "update AIO_CUSTOMER set name=:name,");
        if (StringUtils.isNotEmpty(obj.getTaxCode())) {
            sql.append("TAX_CODE=:taxCode,");
        } else {
            sql.append("PASSPORT=:passport,");
        }
        sql.append("PHONE=:phone," + "ADDRESS=:address"
                + " where CUSTOMER_ID=:customerId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("name", obj.getName());
        query.setParameter("phone", obj.getPhone());
        query.setParameter("address", obj.getAddress());
        query.setParameter("customerId", obj.getCustomerId());
        if (StringUtils.isNotEmpty(obj.getTaxCode())) {
            query.setParameter("taxCode", obj.getTaxCode());
        } else {
            query.setParameter("passport", obj.getPassport());
        }
        return query.executeUpdate();
    }

    // Update Số lượng gói
    public void updateQuantityPackageDetail(Long quantity, Long id) {
        StringBuilder sql = new StringBuilder(
                "update AIO_CONTRACT_DETAIL set quantity=:quantity where CONTRACT_DETAIL_ID=:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("quantity", quantity);
        query.setParameter("id", id);
        query.executeUpdate();
    }

    // Update table aio contract
    public void updateAioContract(AIOContractDTO obj) {
        // Update contract
        StringBuilder sql = new StringBuilder("update AIO_CONTRACT set "
                + " IS_INVOICE=:invoice," + " UPDATED_DATE=sysdate,"
                + " UPDATED_USER=:sysUserId,"
                + " UPDATED_GROUP_ID=:sysGroupId,"
                + " CONTRACT_AMOUNT=:amount," + " CUSTOMER_ID=:customerId,"
                + " CUSTOMER_CODE=:customerCode,"
                + " CUSTOMER_NAME=:customerName,"
                + " CUSTOMER_PHONE=:customerPhone,"
                + " CUSTOMER_ADDRESS=:customerAddress ");
        if (StringUtils.isNotEmpty(obj.getCustomerTaxCode())) {
            sql.append(" ,CUSTOMER_TAX_CODE=:customerTaxCode ");
        }
        sql.append(" where CONTRACT_ID=:id");
        // Update acceptance record
        StringBuilder sql1 = new StringBuilder("update ACCEPTANCE_RECORDS set "
                + " CUSTOMER_ID=:customerId," + " CUSTOMER_CODE=:customerCode,"
                + " CUSTOMER_NAME=:customerName,"
                + " CUSTOMER_PHONE=:customerPhone,"
                + " CUSTOMER_ADDRESS=:customerAddress ");
        sql1.append(" where CONTRACT_ID=:id");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery query1 = getSession().createSQLQuery(sql1.toString());

        query.setParameter("customerId", obj.getCustomerId());
        query.setParameter("customerCode", obj.getCustomerCode());
        query.setParameter("customerName", obj.getCustomerName());
        query.setParameter("customerPhone", obj.getCustomerPhone());
        query.setParameter("customerAddress", obj.getCustomerAddress());
        query.setParameter("amount", obj.getAmount());
        query.setParameter("sysUserId", obj.getSysUserId());
        query.setParameter("sysGroupId", obj.getSysGroupId());
        query.setParameter("id", obj.getContractId());
        query.setParameter("invoice", obj.getIsInvoice());
        if (StringUtils.isNotEmpty(obj.getCustomerTaxCode())) {
            query.setParameter("customerTaxCode", obj.getCustomerTaxCode());
        }

        query1.setParameter("customerId", obj.getCustomerId());
        query1.setParameter("customerCode", obj.getCustomerCode());
        query1.setParameter("customerName", obj.getCustomerName());
        query1.setParameter("customerPhone", obj.getCustomerPhone());
        query1.setParameter("customerAddress", obj.getCustomerAddress());
        query1.setParameter("id", obj.getContractId());

        query.executeUpdate();
        query1.executeUpdate();
    }

    // Xoá gói trong contract Detail bị bỏ đi
    public void deleteContractDetail(Long id) {
        StringBuilder sql1 = new StringBuilder(
                "Delete from AIO_CONTRACT_DETAIL where CONTRACT_DETAIL_ID=:id");
        StringBuilder sql2 = new StringBuilder(
                "Delete from ACCEPTANCE_RECORDS where CONTRACT_DETAIL_ID=:id");

        SQLQuery query1 = getSession().createSQLQuery(sql1.toString());
        SQLQuery query2 = getSession().createSQLQuery(sql2.toString());

        query1.setParameter("id", id);
        query1.executeUpdate();

        query2.setParameter("id", id);
        query2.executeUpdate();
    }

    // Huypq-end

    // VietNT_17/06/2019_start
    public List<AIOContractDTO> getContractsUnpaid(Long sysUserId) {
        StringBuilder sql = new StringBuilder()
                .append("SELECT ")
                .append("c.CONTRACT_ID contractId, ")
                .append("c.CONTRACT_CODE contractCode, ")
                .append("(SELECT LISTAGG(PACKAGE_NAME, ', ' ) WITHIN GROUP (ORDER BY CONTRACT_DETAIL_ID) ")
                .append("FROM AIO_CONTRACT_DETAIL WHERE CONTRACT_ID = C.CONTRACT_ID ")
                .append("GROUP BY CONTRACT_ID) packageName, ")
                //VietNT_31/07/2019_start
//				.append("SUM(R.AMOUNT) contractAmount ")
                .append("(case when ")
                .append("(select sale_channel from aio_contract_detail where contract_id = c.contract_id and rownum = 1) = 'VTP' ")
                .append("then MIN(c.thu_ho) ")
                .append("else SUM(R.AMOUNT) end) contractAmount ")
                //VietNT_end
                // VietNT_01/07/2019_start
                .append(", MAX(R.END_DATE) endDate ")
                // VietNT_end
                .append("FROM ")
                .append("AIO_CONTRACT c ")
                .append("LEFT JOIN AIO_ACCEPTANCE_RECORDS R ON R.CONTRACT_ID = C.CONTRACT_ID ")
                .append("WHERE ").append("c.STATUS = 3 ")
                .append("AND IS_PAY is null ")
                .append("AND c.PERFORMER_ID = :sysUserId ")
                //VietNT_29/07/2019_start
                .append("AND pay_type = 1 ")
                //VietNT_end
                .append("GROUP BY c.CONTRACT_ID, c.CONTRACT_CODE ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());

        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));
        query.setParameter("sysUserId", sysUserId);
        query.addScalar("contractId", new LongType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("packageName", new StringType());
        query.addScalar("contractAmount", new DoubleType());
        // VietNT_01/07/2019_start
        query.addScalar("endDate", new DateType());
        // VietNT_end

        return query.list();
    }

    // VietNT_end

    // Thangtv24 110719-start
    public SysGroupDto getInfoSysGroup(Long sysUserId) {
        StringBuilder sql = new StringBuilder()
                .append("SELECT ")
                .append("a2.area_id areaId, ")
                .append("a2.area_code areaCode, ")
                .append("a2.province_id provinceId, ")
                .append("a2.province_code provinceCode ")
                .append("FROM ")
                .append("sys_user a1 ")
                .append("LEFT JOIN sys_group a2 ON a1.sys_group_id = a2.sys_group_id ")
                .append("WHERE ")
                .append("a1.sys_user_id = :sysUserId ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.addScalar("areaId", new LongType());
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("provinceId", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(SysGroupDto.class));
        query.setParameter("sysUserId", sysUserId);
        return (SysGroupDto) query.uniqueResult();
    }

    public List<String> getReasonOutOfDate() {
        String sql = "select name from app_param where par_type = 'LIST_CONTRACT_OUTOFDATE' order by app_param_id ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("name", new StringType());

        return query.list();
    }

    public int updateStockGoodsTotal(AIOSynStockTransDTO stockTotal, Double quantity) {
        String sql = "UPDATE stock_goods_total st set change_date=sysdate, st.amount = :stockAmount - :amount "
                + ", st.amount_issue = :stockAmountIssue - :amount "
                + " WHERE st.stock_goods_total_id  = :stockGoodsTotalId ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("stockAmount", stockTotal.getAmount());
        query.setParameter("amount", quantity);
        query.setParameter("stockAmountIssue", stockTotal.getAmountIssue());
        query.setParameter("stockGoodsTotalId", stockTotal.getStockGoodsTotalId());
        return query.executeUpdate();
    }

    public int sendSmsEndContract(String subject, String content, Long contractId) {
        String sql = "INSERT INTO SEND_SMS_EMAIL " +
                "(SEND_SMS_EMAIL_ID, SUBJECT, CONTENT, RECEIVE_PHONE_NUMBER, RECEIVE_EMAIL, CREATED_DATE, CREATED_USER_ID, status) " +
                "with a as(select email, phone_number phone from sys_user where sys_user_id = " +
                "(select seller_id from aio_contract where contract_id = :contractId) and rownum = 1) " +
                "select SEND_SMS_EMAIL_SEQ.nextval, :subject, :content, a.phone, a.email, sysdate, null, 0 from a ";
        SQLQuery query = super.getSession().createSQLQuery(sql);
        query.setParameter("subject", subject);
        query.setParameter("content", content);
        query.setParameter("contractId", contractId);

        return query.executeUpdate();
    }

    public List<AIOContractDTO> getUnfinishedContractDetail(Long contractId) {
        String sql = "SELECT " +
                "d.CONTRACT_ID contractId, " +
                "d.CONTRACT_DETAIL_ID contractDetailId, " +
                "d.PACKAGE_DETAIL_ID packageDetailId, " +
                "c.performer_id performerId " +
                "FROM aio_contract_detail d " +
                "left join aio_contract c on c.contract_id = d.contract_id " +
                "WHERE d.contract_id = :contractId " +
                "AND d.status != 3 ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOContractDTO.class));
        query.addScalar("contractId", new LongType());
        query.addScalar("contractDetailId", new LongType());
        query.addScalar("packageDetailId", new LongType());
        query.addScalar("performerId", new LongType());
        query.setParameter("contractId", contractId);

        return query.list();
    }
}
