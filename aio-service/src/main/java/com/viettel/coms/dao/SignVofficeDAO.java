/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.coms.bo.SignVofficeBO;
import com.viettel.coms.dto.CommonDTO;
import com.viettel.coms.dto.SignVofficeDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.wms.dto.StockTransDTO;
import com.viettel.wms.dto.StockTransDetailDTO;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("signVofficeDAO")
public class SignVofficeDAO extends BaseFWDAOImpl<SignVofficeBO, Long> {

    public SignVofficeDAO() {
        this.model = new SignVofficeBO();
    }

    public SignVofficeDAO(Session session) {
        this.session = session;
    }

    public List<SignVofficeDTO> getDataSign(String sql, List<Long> listId, String type) {

        SQLQuery query = getSession().createSQLQuery(sql);

        query.addScalar("objectId", new LongType());
        query.addScalar("objectCode", new StringType());
        query.addScalar("signState", new StringType());
        query.addScalar("createdBy", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(SignVofficeDTO.class));

        query.setParameterList("listId", listId);

        return query.list();
    }

    public Long updateStatus(String signState, CommonDTO obj) {
        StringBuilder sql = new StringBuilder();
        if ("10".equals(obj.getType())) {
            sql.append("UPDATE YEAR_PLAN SET SIGN_STATE = :signState	WHERE YEAR_PLAN_ID =:id");
        } else if ("11".equals(obj.getType())) {
            sql.append("UPDATE TOTAL_MONTH_PLAN SET SIGN_STATE = :signState	WHERE TOTAL_MONTH_PLAN_ID =:id");
        } else if ("12".equals(obj.getType())) {
            sql.append("UPDATE DETAIL_MONTH_PLAN SET SIGN_STATE = :signState	WHERE DETAIL_MONTH_PLAN_ID =:id");
        } else if("50".equals(obj.getType())){
        	sql.append("UPDATE GOODS_PLAN SET SIGN_STATE = :signState	WHERE GOODS_PLAN_ID =:id");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obj.getObjectId());
        query.setParameter("signState", signState);
        return (long) query.executeUpdate();

    }

    public List<SignVofficeDTO> getDetailSign(String sql, String type, Long id) {
        SQLQuery query = getSession().createSQLQuery("");

        query.addScalar("oderName", new StringType());
        query.addScalar("oder", new LongType());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("sysRoleId", new LongType());
        query.addScalar("sysRoleName", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("email", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(SignVofficeDTO.class));

        query.setParameter("bussinessType", type);
        query.setParameter("id", id);

        return query.list();
    }

    public SignVofficeDTO getByTransCode(String transCode) {
        StringBuilder sql = new StringBuilder("SELECT SIGN_VOFFICE_ID signVofficeId" + ",SYS_USER_ID sysUserId"
                + ",STOCK_ID stockId" + ",BUSS_TYPE_ID bussTypeId" + ",STATUS status" + ",OBJECT_ID objectId"
                + ",CREATED_DATE createdDate" + ",ERROR_CODE errorCode" + ",TRANS_CODE transCode "
                + " FROM SIGN_VOFFICE WHERE upper(TRANS_CODE)=upper(:transCode)");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("signVofficeId", new LongType());
        query.addScalar("objectId", new LongType());
        query.addScalar("bussTypeId", new StringType());
        query.addScalar("stockId", new LongType());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("status", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("errorCode", new StringType());
        query.addScalar("transCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(SignVofficeDTO.class));
        query.setParameter("transCode", transCode);
        return (SignVofficeDTO) query.uniqueResult();
    }

    public SignVofficeDTO getPassWordByUserId(Long userId) {
        StringBuilder sql = new StringBuilder(
                "SELECT VOFFICE_PASS vofficePass FROM CTCT_CAT_OWNER.USER_CONFIG WHERE SYS_USER_ID=:userId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("vofficePass", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(SignVofficeDTO.class));
        query.setParameter("userId", userId);
        return (SignVofficeDTO) query.uniqueResult();
    }

    public StockTransDTO getListFromOderChange(Long id) {
        StringBuilder sql = new StringBuilder("SELECT OGC.ORDER_CHANGE_GOODS_ID orderId," + "OGC.CODE orderCode,"
                + "OGC.STOCK_ID stockId," + "OGC.DESCRIPTION description," + "OGC.CREATED_BY createdBy,"
                + "OGC.CREATED_DEPT_ID createdDeptId," + "OGC.CREATED_DEPT_NAME createdDeptName,"
                + "SU.FULL_NAME createdByName" + " FROM ORDER_CHANGE_GOODS OGC"
                + " JOIN VPS_OWNER.SYS_USER SU ON SU.SYS_USER_ID=OGC.CREATED_BY"
                + " WHERE OGC.ORDER_CHANGE_GOODS_ID=:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("orderId", new LongType());
        query.addScalar("orderCode", new StringType());
        query.addScalar("stockId", new LongType());
        query.addScalar("description", new StringType());
        query.addScalar("createdBy", new LongType());
        query.addScalar("createdByName", new StringType());
        query.addScalar("createdDeptId", new LongType());
        query.addScalar("createdDeptName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(StockTransDTO.class));

        query.setParameter("id", id);

        return (StockTransDTO) query.uniqueResult();

    }

    public List<StockTransDetailDTO> getListGoodsFromOderChangeForEx(Long id) {
        StringBuilder sql = new StringBuilder("SELECT GOODS_TYPE goodsType," + "GOODS_TYPE_NAME goodsTypeName,"
                + "GOODS_ID goodsId," + "GOODS_CODE goodsCode," + "GOODS_NAME goodsName,"
                + "GOODS_IS_SERIAL goodsIsSerial," + "GOODS_STATE goodsState," + "GOODS_STATE_NAME goodsStateName,"
                + "GOODS_UNIT_NAME goodsUnitName," + "GOODS_UNIT_ID goodsUnitId," + "AMOUNT_CHANGE amount,"
                + "SERIAL serial" + " FROM ORDER_CHANGE_GOODS_DETAIL WHERE ORDER_CHANGE_GOODS_ID=:id"
                + " ORDER BY GOODS_ID");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("goodsType", new StringType());
        query.addScalar("goodsTypeName", new StringType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsIsSerial", new StringType());
        query.addScalar("goodsState", new StringType());
        query.addScalar("goodsStateName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("serial", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(StockTransDetailDTO.class));

        query.setParameter("id", id);

        return query.list();
    }

    public List<StockTransDetailDTO> getListGoodsFromOderChangeForIm(Long id) {
        StringBuilder sql = new StringBuilder("SELECT GOODS_TYPE goodsType," + "GOODS_TYPE_NAME goodsTypeName,"
                + "NEW_GOODS_ID goodsId," + "NEW_GOODS_CODE goodsCode," + "NEW_GOODS_NAME goodsName,"
                + "GOODS_IS_SERIAL goodsIsSerial," + "GOODS_STATE goodsState," + "GOODS_STATE_NAME goodsStateName,"
                + "GOODS_UNIT_NAME goodsUnitName," + "GOODS_UNIT_ID goodsUnitId," + "AMOUNT_CHANGE amount,"
                + "NEW_SERIAL serial" + " FROM ORDER_CHANGE_GOODS_DETAIL WHERE ORDER_CHANGE_GOODS_ID=:id"
                + " ORDER BY NEW_GOODS_ID");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("goodsType", new StringType());
        query.addScalar("goodsTypeName", new StringType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsIsSerial", new StringType());
        query.addScalar("goodsState", new StringType());
        query.addScalar("goodsStateName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("serial", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(StockTransDetailDTO.class));

        query.setParameter("id", id);

        return query.list();
    }

    public SignVofficeDTO getByObjIdAndType(Long objectId, String type) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("SELECT SIGN_VOFFICE_ID signVofficeId" + ",SYS_USER_ID sysUserId"
                + ",STOCK_ID stockId" + ",BUSS_TYPE_ID bussTypeId" + ",STATUS status" + ",OBJECT_ID objectId"
                + ",CREATED_DATE createdDate" + ",ERROR_CODE errorCode" + ",TRANS_CODE transCode "
                + " FROM SIGN_VOFFICE WHERE OBJECT_ID = :objectId and BUSS_TYPE_ID=:type and status = 1 ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("signVofficeId", new LongType());
        query.addScalar("objectId", new LongType());
        query.addScalar("bussTypeId", new StringType());
        query.addScalar("stockId", new LongType());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("status", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("errorCode", new StringType());
        query.addScalar("transCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(SignVofficeDTO.class));
        query.setParameter("objectId", objectId);
        query.setParameter("type", type);
        return (SignVofficeDTO) query.uniqueResult();
    }

    public Long getHinhThucVanBanFromAppParam() {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "Select code code from APP_PARAM where PAR_TYPE = 'VOFFICE_HINHTHUCVANBAN' and rownum =1 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("code", new StringType());
        String code = (String) query.uniqueResult();
        return StringUtils.isEmpty(code) ? 479L : Long.parseLong(code);
    }
    
}
