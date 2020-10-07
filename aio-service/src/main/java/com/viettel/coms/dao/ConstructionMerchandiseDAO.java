/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.bo.ConstructionMerchandiseBO;
import com.viettel.coms.dto.*;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("constructionMerchandiseDAO")
public class ConstructionMerchandiseDAO extends BaseFWDAOImpl<ConstructionMerchandiseBO, Long> {

    public ConstructionMerchandiseDAO() {
        this.model = new ConstructionMerchandiseBO();
    }

    public ConstructionMerchandiseDAO(Session session) {
        this.session = session;
    }

    public void removeByListId(Long constructionId) {
        StringBuilder sql = new StringBuilder(
                "DELETE FROM CONSTRUCTION_MERCHANDISE  where CONSTRUCTION_ID = :constructionId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", constructionId);
        query.executeUpdate();

    }

    public List<ConstructionMerchandiseDTO> getAllListMerchandise() {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT mer.QUANTITY quantity , ");
        sql.append(" mer.REMAIN_COUNT remainCount , ");
        sql.append(" mer.CONSTRUCTION_ID constructionId , ");
        sql.append(" mer.CONSTRUCTION_MERCHANDISE_ID constructionMerchandiseId, ");
        sql.append(" mer.GOODS_NAME goodsName, ");
        sql.append(" mer.GOODS_CODE goodsCode, ");
        sql.append(" mer.GOODS_UNIT_NAME goodsUnitName, ");
        sql.append(" mer.TYPE type, ");
        sql.append(" mer.GOODS_ID goodsId, ");
        sql.append(" mer.GOODS_IS_SERIAL goodsIsSerial, ");
        sql.append(" mer.SERIAL serial");
        sql.append(" FROM CONSTRUCTION_MERCHANDISE mer ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("remainCount", new DoubleType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionMerchandiseId", new LongType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("type", new StringType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsIsSerial", new StringType());
        query.addScalar("serial", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionMerchandiseDTO.class));
        return query.list();
    }

    public List<Long> getAllListId() {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT mer.GOODS_ID goodsId ");
        sql.append(" FROM CONSTRUCTION_MERCHANDISE mer ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("goodsId", new LongType());

//		query.setResultTransformer(Transformers
//				.aliasToBean(ConstructionMerchandiseDTO.class));
        return query.list();
    }

    public void removeTP(Long constructionId) {
        StringBuilder sql = new StringBuilder(
                "DELETE FROM CONSTRUCTION_MERCHANDISE  where CONSTRUCTION_ID = :constructionId AND TYPE = 3");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", constructionId);
        query.executeUpdate();
    }

    public List<ConstructionMerchandiseDTO> getListDSTP(Long id) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT a.GOODS_NAME goodsName , ");
        sql.append(" a.QUANTITY quantity , ");
        sql.append(" a.GOODS_UNIT_NAME goodsUnitName , ");
        sql.append(" a.SERIAL serial ");
        sql.append(" FROM CONSTRUCTION_MERCHANDISE a ");
        sql.append(" WHERE a.CONSTRUCTION_ID =:id ");
        sql.append(" AND type                =3 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("goodsName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("serial", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionMerchandiseDTO.class));
        return query.list();
    }

    public List<StockTransGeneralDTO> getListVatTu(Long id, Long goodsId) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT s.CONSTRUCTION_ID constructionId,m.MER_ENTITY_ID merEntityId,m.GOODS_CODE goodsCode, ");
        sql.append(
                "  m.GOODS_ID goodsId, m.GOODS_NAME goodsName,m.CAT_UNIT_NAME goodsUnitName, s.REAL_IE_TRANS_DATE realIeTransDate , ");
        sql.append("  SUM(ss.QUANTITY) numberXuat,SUM((SELECT SUM(ae.quantity) ");
        sql.append(" FROM ASSET_MANAGEMENT_REQUEST a INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ");
        sql.append(" ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID ");
        sql.append(" WHERE m.goods_code   =sd.GOODS_CODE AND a.CONSTRUCTION_ID  =s.CONSTRUCTION_ID  ");
        sql.append(" AND ae.MER_ENTITY_ID            =m.MER_ENTITY_ID AND a.STATUS IN(1,2,3) )) numberThuhoi, ");
        sql.append(" SUM((SELECT sum(cm.QUANTITY) FROM CONSTRUCTION_MERCHANDISE cm ");
        sql.append(" INNER JOIN MER_ENTITY m ON cm.MER_ENTITY_ID   =m.MER_ENTITY_ID ");
        sql.append(" WHERE cm.TYPE         =2  AND m.GOODS_CODE      = sd.GOODS_CODE ");
        sql.append(" AND s.CONSTRUCTION_ID = cm.CONSTRUCTION_ID )) numberSuDung ");
        sql.append(" FROM stock_trans s INNER JOIN STOCK_TRANS_DETAIL sd ");
        sql.append(" ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss ");
        sql.append(" ON ss.STOCK_TRANS_ID = s.STOCK_TRANS_ID AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID ");
        sql.append(" INNER JOIN MER_ENTITY m ON ss.MER_ENTITY_ID   =m.MER_ENTITY_ID ");
        sql.append(" AND s.CONFIRM   = 1 AND s.TYPE      = 2 AND s.STATUS      = 2 AND M.SERIAL    IS NULL ");
        sql.append(" AND s.CONSTRUCTION_ID =:id AND sd.GOODS_ID =:goodsId  ");
        sql.append(" GROUP BY (s.CONSTRUCTION_ID, m.MER_ENTITY_ID, M.GOODS_CODE, M.GOODS_ID, M.GOODS_NAME, ");
        sql.append(" M.CAT_UNIT_NAME,s.REAL_IE_TRANS_DATE ) order by  s.REAL_IE_TRANS_DATE ASC  ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.setParameter("goodsId", goodsId);
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("numberXuat", new DoubleType());
        query.addScalar("numberThuhoi", new DoubleType());
        query.addScalar("numberSuDung", new DoubleType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("merEntityId", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("realIeTransDate", new DateType());

        query.setResultTransformer(Transformers.aliasToBean(StockTransGeneralDTO.class));
        return query.list();
    }

    public List<StockTransGeneralDTO> getListVatTu1(Long id, Long goodsId, Long assetManagementRequestId) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT s.CONSTRUCTION_ID constructionId,m.MER_ENTITY_ID merEntityId,m.GOODS_CODE goodsCode, ");
        sql.append(
                "  m.GOODS_ID goodsId, m.GOODS_NAME goodsName,m.CAT_UNIT_NAME goodsUnitName, s.REAL_IE_TRANS_DATE realIeTransDate , ");
        sql.append("  SUM(ss.QUANTITY) numberXuat,SUM((SELECT SUM(ae.quantity) ");
        sql.append(" FROM ASSET_MANAGEMENT_REQUEST a INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ");
        sql.append(" ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID ");
        sql.append(" WHERE m.goods_code   =sd.GOODS_CODE AND a.CONSTRUCTION_ID  =s.CONSTRUCTION_ID  ");
        sql.append(
                " AND ae.MER_ENTITY_ID            =m.MER_ENTITY_ID AND a.STATUS IN(1,2,3) AND a.ASSET_MANAGEMENT_REQUEST_ID !=:assetManagementRequestId )) numberThuhoi, ");
        sql.append(" SUM((SELECT sum(cm.QUANTITY) FROM CONSTRUCTION_MERCHANDISE cm ");
        sql.append(" INNER JOIN MER_ENTITY m ON cm.MER_ENTITY_ID   =m.MER_ENTITY_ID ");
        sql.append(" WHERE cm.TYPE         =2  AND m.GOODS_CODE      = sd.GOODS_CODE ");
        sql.append(" AND s.CONSTRUCTION_ID = cm.CONSTRUCTION_ID )) numberSuDung ");
        sql.append(" FROM stock_trans s INNER JOIN STOCK_TRANS_DETAIL sd ");
        sql.append(" ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss ");
        sql.append(" ON ss.STOCK_TRANS_ID = s.STOCK_TRANS_ID AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID ");
        sql.append(" INNER JOIN MER_ENTITY m ON ss.MER_ENTITY_ID   =m.MER_ENTITY_ID ");
        sql.append(" AND s.CONFIRM   = 1 AND s.TYPE      = 2 AND s.STATUS      = 2 AND M.SERIAL    IS NULL ");
        sql.append(" AND s.CONSTRUCTION_ID =:id AND sd.GOODS_ID =:goodsId  ");
        sql.append(" GROUP BY (s.CONSTRUCTION_ID, m.MER_ENTITY_ID, M.GOODS_CODE, M.GOODS_ID, M.GOODS_NAME, ");
        sql.append(" M.CAT_UNIT_NAME,s.REAL_IE_TRANS_DATE ) order by  s.REAL_IE_TRANS_DATE ASC  ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.setParameter("assetManagementRequestId", assetManagementRequestId);
        query.setParameter("goodsId", goodsId);
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("numberXuat", new DoubleType());
        query.addScalar("numberThuhoi", new DoubleType());
        query.addScalar("numberSuDung", new DoubleType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("merEntityId", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("realIeTransDate", new DateType());

        query.setResultTransformer(Transformers.aliasToBean(StockTransGeneralDTO.class));
        return query.list();
    }

    public void removeDSVTBB(Long merEntityId, Long goodsId) {
        StringBuilder sql = new StringBuilder(
                "DELETE FROM CONSTRUCTION_MERCHANDISE a  where a.MER_ENTITY_ID =:merId and a.GOODS_ID =:id AND a.TYPE = 2 AND a.GOODS_IS_SERIAL=0 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("merId", merEntityId);
        query.setParameter("id", goodsId);
        query.executeUpdate();
    }

    public void deleteAllTBBB(Long constructionId) {
        StringBuilder sql = new StringBuilder(
                "DELETE FROM CONSTRUCTION_MERCHANDISE a WHERE a.CONSTRUCTION_ID =:id AND a.TYPE =2 AND a.GOODS_IS_SERIAL  =1");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", constructionId);
        query.executeUpdate();
    }

    public void DeleteVTA(Long constructionId) {
        StringBuilder sql = new StringBuilder(
                "DELETE FROM CONSTRUCTION_MERCHANDISE a WHERE a.CONSTRUCTION_ID =:id AND a.TYPE =1 AND a.GOODS_IS_SERIAL  =0");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", constructionId);
        query.executeUpdate();
    }

    public void DeleteTBA(Long constructionId) {
        StringBuilder sql = new StringBuilder(
                "DELETE FROM CONSTRUCTION_MERCHANDISE a WHERE a.CONSTRUCTION_ID =:id AND a.TYPE =1 AND a.GOODS_IS_SERIAL  =1");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", constructionId);
        query.executeUpdate();
    }

    public List<Long> getCatProvinCode(Long id) {
        StringBuilder sql = new StringBuilder();
        sql.append(" select a.SYS_USER_ID supperVisorId ");
        sql.append(" from SYS_USER a,USER_ROLE b,SYS_ROLE  c,USER_ROLE_DATA d, DOMAIN_DATA  e, DOMAIN_TYPE g  ");
        sql.append(" where a.SYS_USER_ID=b.SYS_USER_ID  ");
        sql.append(" and b.SYS_ROLE_ID=c.SYS_ROLE_ID  ");
        sql.append(" and c.CODE='COMS_GOVERNOR'  ");
        sql.append(" and b.USER_ROLE_ID=d.USER_ROLE_ID  ");
        sql.append(" and d.DOMAIN_DATA_ID=e.DOMAIN_DATA_ID  ");
        sql.append(" and e.DOMAIN_TYPE_ID=g.DOMAIN_TYPE_ID  ");
        sql.append(" and g.code='KTTS_LIST_PROVINCE'  ");
        sql.append(" and e.data_code=( ");
        sql.append(" SELECT catP.code FROM CONSTRUCTION con INNER JOIN CAT_STATION catS ");
        sql.append(" ON con.CAT_STATION_ID = catS.CAT_STATION_ID INNER JOIN CAT_PROVINCE catP  ");
        sql.append(" on catP.CAT_PROVINCE_ID = catS.CAT_PROVINCE_ID where con.CONSTRUCTION_ID =:id) ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("supperVisorId", new LongType());
        return query.list();
    }

    public void DeleteTTTC(Long constructionId) {
        StringBuilder sql = new StringBuilder("DELETE CONSTRUCTION_ACCEPTANCE_CERT a where a.CONSTRUCTION_ID=:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", constructionId);
        query.executeUpdate();
    }

    public String getListStatusAnObstructed(Long id) {
        StringBuilder sql = new StringBuilder();
        sql.append(" select con.STATUS status  from CONSTRUCTION con where con.CONSTRUCTION_ID =:id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("status", new StringType());
//		query.addScalar("obstructedState", new StringType());
//		query.setResultTransformer(Transformers
//				.aliasToBean(ConstructionDTO.class));
        List<String> list = query.list();
        if (list != null && !list.isEmpty())
            return list.get(0);
        return null;
//		return query.list();
    }

    public String getListStatusAnObstructed1(Long id) {
        StringBuilder sql = new StringBuilder();
        sql.append(
                " select con.OBSTRUCTED_STATE obstructedState from CONSTRUCTION con where con.CONSTRUCTION_ID =:id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
//		query.addScalar("status", new StringType());
        query.addScalar("obstructedState", new StringType());
//		query.setResultTransformer(Transformers
//				.aliasToBean(ConstructionDTO.class));
        List<String> list = query.list();
        if (list != null && !list.isEmpty())
            return list.get(0);
        return null;
//		return query.list();
    }

    public Long getNumberAcceptance(Long id) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT count(*) from  CONSTRUCTION_ACCEPTANCE_CERT a where a.CONSTRUCTION_ID =:id  ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
//		Long number = query.
        return ((BigDecimal) query.uniqueResult()).longValue();
    }

    public ConstructionAcceptanceCertDTO getListAcc(Long id) {
        StringBuilder sql = new StringBuilder();
        sql.append(
                " SELECT a.CREATED_DATE createdDate, a.CREATED_USER_ID createdUserId, a.CREATED_GROUP_ID createdGroupId ");
        sql.append(" from CONSTRUCTION_ACCEPTANCE_CERT a where a.CONSTRUCTION_ID =:id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdGroupId", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionAcceptanceCertDTO.class));
        List<ConstructionAcceptanceCertDTO> list1 = query.list();
        if (list1 != null && !list1.isEmpty())
            return list1.get(0);
        return null;
    }

    public void UpdateAcceptan(Long constructionId, SysUserCOMSDTO vpsUserInfo, Date now,
                               ConstructionAcceptanceCertDTO acceptanDto, ConstructionAcceptanceCertDTO certDTO) {
        StringBuilder sql = new StringBuilder("DELETE CONSTRUCTION_ACCEPTANCE_CERT a where a.CONSTRUCTION_ID=:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", constructionId);
        query.executeUpdate();

    }

    public List<ConstructionMerchandiseDetailDTO> getValueToInitConstructionMerchandisePages(
            ConstructionMerchandiseDTORequest request) {

        StringBuilder sql = new StringBuilder("  ");

        sql.append("SELECT DISTINCT con.CONSTRUCTION_ID constructionId, ");
        sql.append("con.STATUS constructionStatus,con.CODE constructionCode,con.IS_RETURN constructionIsReturn     ");
        sql.append("FROM CONSTRUCTION con ");
        sql.append("INNER JOIN WORK_ITEM wi ");
        sql.append("ON wi.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        sql.append("INNER JOIN CONSTRUCTION_MERCHANDISE conMer ");
        sql.append("ON conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        sql.append("AND wi.WORK_ITEM_ID       = conMer.WORK_ITEM_ID ");
        sql.append("LEFT JOIN CONSTRUCTION_RETURN re ");
        sql.append("ON con.CONSTRUCTION_ID = re.CONSTRUCTION_ID ");
        sql.append("AND wi.WORK_ITEM_ID    = re.WORK_ITEM_ID ");
        sql.append("WHERE wi.PERFORMER_ID  =:userid ");
        sql.append("GROUP BY con.CONSTRUCTION_ID, ");
        sql.append("con.STATUS, ");
        sql.append(" con.CODE,con.IS_RETURN ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("userid", request.getSysUserRequest().getSysUserId());

        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionStatus", new StringType());
        query.addScalar("constructionIsReturn", new StringType());
        query.addScalar("constructionCode", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionMerchandiseDetailDTO.class));
        return query.list();

    }

    public List<ConstructionMerchandiseDetailDTO> getValueToInitConstructionMerchandiseWorkItemsPages(
            ConstructionMerchandiseDTORequest request) {

        StringBuilder sql = new StringBuilder("  ");

        sql.append("SELECT DISTINCT con.CONSTRUCTION_ID constructionId,con.CODE constructionCode,  ");
        sql.append(
                "con.STATUS constructionStatus,conMer.WORK_ITEM_ID workItemId,wi.NAME workItemName, COUNT(re.WORK_ITEM_ID) countWorkItemComplete ");
        sql.append("FROM CONSTRUCTION con ");
        sql.append("INNER JOIN WORK_ITEM wi ");
        sql.append("ON wi.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        sql.append("INNER JOIN CONSTRUCTION_MERCHANDISE conMer ");
        sql.append("ON conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        sql.append("AND wi.WORK_ITEM_ID       = conMer.WORK_ITEM_ID ");
        sql.append("LEFT JOIN CONSTRUCTION_RETURN re ");
        sql.append("ON con.CONSTRUCTION_ID = re.CONSTRUCTION_ID ");
        sql.append("AND wi.WORK_ITEM_ID    = re.WORK_ITEM_ID ");
        sql.append("WHERE wi.PERFORMER_ID  =:userid ");
        sql.append("and con.CONSTRUCTION_ID=:constructionId ");
        sql.append("GROUP BY con.CONSTRUCTION_ID,con.CODE, ");
        sql.append("con.STATUS, ");
        sql.append(" conMer.WORK_ITEM_ID,wi.NAME ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("userid", request.getSysUserRequest().getSysUserId());
        query.setParameter("constructionId", request.getConstructionMerchandiseDetailDTO().getConstructionId());

        query.addScalar("constructionId", new LongType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("countWorkItemComplete", new LongType());
        query.addScalar("constructionStatus", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("workItemName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionMerchandiseDetailDTO.class));
        return query.list();

    }

    public List<ConstructionMerchandiseDetailDTO> getListWorkItems(ConstructionMerchandiseDTORequest request) {

        StringBuilder sql = new StringBuilder("  ");

        sql.append("SELECT DISTINCT ");
        sql.append(
                "conMer.WORK_ITEM_ID workItemId,wi.NAME workItemName, COUNT(re.WORK_ITEM_ID) countWorkItemComplete ");
        sql.append("FROM CONSTRUCTION con ");
        sql.append("INNER JOIN WORK_ITEM wi ");
        sql.append("ON wi.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        sql.append("INNER JOIN CONSTRUCTION_MERCHANDISE conMer ");
        sql.append("ON conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        sql.append("AND wi.WORK_ITEM_ID       = conMer.WORK_ITEM_ID ");
        sql.append("LEFT JOIN CONSTRUCTION_RETURN re ");
        sql.append("ON con.CONSTRUCTION_ID = re.CONSTRUCTION_ID ");
        sql.append("AND wi.WORK_ITEM_ID    = re.WORK_ITEM_ID ");
        sql.append("WHERE wi.PERFORMER_ID  =:userid ");
        sql.append("GROUP BY con.CONSTRUCTION_ID, ");
        sql.append("con.STATUS, ");
        sql.append(" conMer.WORK_ITEM_ID,wi.NAME ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("userid", request.getSysUserRequest().getSysUserId());

        query.addScalar("workItemId", new LongType());
        query.addScalar("countWorkItemComplete", new LongType());
        query.addScalar("workItemName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionMerchandiseDetailDTO.class));
        return query.list();

    }

    public List<ConstructionMerchandiseDetailVTDTO> getValueToInitConstructionMerchandiseVT(
            ConstructionMerchandiseDTORequest request, long temp) {

        StringBuilder sql = new StringBuilder("SELECT ");

        sql.append("synDetailSerial.GOODS_ID goodsId , ");
        sql.append("synDetailSerial.GOODS_UNIT_NAME goodsUnitName , ");
        sql.append("synDetailSerial.GOODS_CODE goodsCode , ");
        sql.append("synDetailSerial.GOODS_NAME goodsName,  ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(serial.amount) ");
        sql.append("FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
        sql.append("WHERE serial.SYN_STOCK_TRANS_DETAIL_SER_ID = synDetailSerial.SYN_STOCK_TRANS_DETAIL_SER_ID ");
        sql.append("AND syn.TYPE                               =2 ");
        sql.append(")),0) numberXuat, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(serial.amount) ");
        sql.append("FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
        sql.append("WHERE serial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
        sql.append("AND syn.TYPE                           =1 ");
        sql.append("AND syn.status                         =2 ");
        sql.append(")),0) numberThuhoi, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(conMer.quantity) ");
        sql.append("FROM  CONSTRUCTION_MERCHANDISE conMer ");
        sql.append("WHERE conMer.GOODS_ID         = synDetailSerial.GOODS_ID ");
        sql.append("AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        // sql.append("AND conMer.WORK_ITEM_ID = wi.WORK_ITEM_ID ");
        sql.append("AND conMer.TYPE            = 1 ");
        if (temp == 0) {
            sql.append("AND conMer.GOODS_IS_SERIAL = synDetail.GOODS_IS_SERIAL ");

        } else {
            sql.append("AND conMer.GOODS_IS_SERIAL = synDetail.GOODS_IS_SERIAL ");
            sql.append(" AND conMer.SERIAL            =synDetailSerial.SERIAL ");
            sql.append(" AND rownum                   =1 ");
        }
        sql.append(" AND conMer.MER_entity_id = synDetailSerial.MER_entity_id ");
        sql.append(")),0) numberNghiemthu, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(conMer.quantity) ");
        sql.append("FROM  CONSTRUCTION_MERCHANDISE conMer ");
        sql.append("WHERE conMer.GOODS_ID         = synDetailSerial.GOODS_ID ");
        sql.append("AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        sql.append("AND conMer.WORK_ITEM_ID    != wi.WORK_ITEM_ID ");
        sql.append("AND conMer.TYPE            = 1 ");
        if (temp == 0) {
            sql.append("AND conMer.GOODS_IS_SERIAL  = synDetail.GOODS_IS_SERIAL ");

        } else {
            sql.append("AND conMer.GOODS_IS_SERIAL = synDetail.GOODS_IS_SERIAL ");
            sql.append(" AND conMer.SERIAL            =synDetailSerial.SERIAL ");
            sql.append(" AND rownum                   =1 ");
        }
        sql.append(" AND conMer.MER_entity_id = synDetailSerial.MER_entity_id ");
        sql.append(")),0) numberNghiemThuKhac, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(conReturn.quantity) ");
        sql.append("FROM CONSTRUCTION_RETURN conReturn ");
        sql.append("WHERE conReturn.GOODS_ID      = synDetailSerial.GOODS_ID ");
        sql.append("AND conReturn.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        sql.append("AND conReturn.SERIAL is null ");
        sql.append("AND conReturn.WORK_ITEM_ID   = wi.WORK_ITEM_ID ");
        sql.append("AND conReturn.MER_entity_id = synDetailSerial.MER_entity_id ");
        sql.append(")),0) numberHoanTra, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(conReturn.quantity) ");
        sql.append("FROM CONSTRUCTION_RETURN conReturn ");
        sql.append("WHERE conReturn.GOODS_ID      = synDetailSerial.GOODS_ID ");
        sql.append("AND conReturn.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        sql.append("AND conReturn.SERIAL is null ");
        sql.append("AND conReturn.WORK_ITEM_ID   != wi.WORK_ITEM_ID ");
        sql.append("AND conReturn.MER_entity_id = synDetailSerial.MER_entity_id ");
        sql.append(")),0) numberHoanTraKhac ");
        sql.append("FROM SYN_STOCK_TRANS syn ");
        sql.append("INNER JOIN CONSTRUCTION con ");
        sql.append("ON con.code = syn.CONSTRUCTION_CODE ");
        sql.append("LEFT JOIN WORK_ITEM wi ");
        sql.append("ON con.CONSTRUCTION_ID = wi.CONSTRUCTION_ID ");
        sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL synDetail ");
        sql.append("ON syn.SYN_STOCK_TRANS_ID     = synDetail.SYN_STOCK_TRANS_ID ");
        if (temp == 0) {
            sql.append("AND synDetail.GOODS_IS_SERIAL = 0 ");

        } else {
            sql.append("AND synDetail.GOODS_IS_SERIAL = 1 ");

        }
        sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL synDetailSerial ");
        sql.append("ON synDetailSerial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
        sql.append("WHERE syn.SYN_TRANS_TYPE   =1 ");
        sql.append("AND syn.CONFIRM            =1 ");
        sql.append("AND con.CONSTRUCTION_ID    =:constructionId ");
        sql.append("AND wi.WORK_ITEM_ID        =:workItemId ");
        sql.append("AND wi.PERFORMER_ID        =:userid ");
        sql.append("AND synDetailSerial.amount >0 ");
        sql.append("GROUP BY con.CONSTRUCTION_ID, ");
        sql.append("con.CODE, ");
//		if(temp==1){
//			sql.append("synDetailSerial.MER_ENTITY_ID, ");
//		}
        sql.append("wi.WORK_ITEM_ID, ");
        sql.append("wi.NAME, ");
        sql.append("synDetailSerial.GOODS_ID, ");
        sql.append("synDetailSerial.GOODS_CODE, ");
        sql.append("synDetailSerial.GOODS_NAME, ");
        sql.append("synDetailSerial.GOODS_UNIT_NAME, ");
        // sql.append("synDetailSerial.SERIAL, ");
        sql.append("syn.REAL_IE_TRANS_DATE, ");
        sql.append("synDetail.GOODS_IS_SERIAL ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("workItemId", request.getConstructionMerchandiseDetailDTO().getWorkItemId());
        query.setParameter("constructionId", request.getConstructionMerchandiseDetailDTO().getConstructionId());
        query.setParameter("userid", request.getSysUserRequest().getSysUserId());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitName", new StringType());

        query.addScalar("numberXuat", new DoubleType());
        query.addScalar("numberThuhoi", new DoubleType());
        query.addScalar("numberNghiemthu", new DoubleType());
        query.addScalar("numberNghiemThuKhac", new DoubleType());
        query.addScalar("numberHoanTra", new DoubleType());
        query.addScalar("numberHoanTraKhac", new DoubleType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionMerchandiseDetailVTDTO.class));
        return query.list();

    }

    public List<ConstructionMerchandiseItemTBDTO> getValueToInitConstructionMerchandiseVTDetail(
            ConstructionMerchandiseDTORequest request, long temp, Long goodsId) {

        StringBuilder sql = new StringBuilder("");

        sql.append("SELECT con.CONSTRUCTION_ID constructionIdTB, ");
        sql.append("con.CODE constructionCode, ");
        if (temp == 1) {
            sql.append("synDetailSerial.MER_ENTITY_ID merEntityId, ");
        }
        sql.append("wi.WORK_ITEM_ID workItemIdTB, ");
        sql.append("wi.NAME workItemNameTB, ");
        sql.append("synDetailSerial.GOODS_ID goodsId , ");
        sql.append("synDetailSerial.GOODS_CODE goodsCode , ");
        sql.append("synDetailSerial.GOODS_NAME goodsName , ");
        sql.append("synDetailSerial.GOODS_UNIT_NAME goodsUnitNameTB, ");
        sql.append("synDetailSerial.SERIAL serial, ");
        sql.append("syn.REAL_IE_TRANS_DATE realIeTransDateTB, ");
        sql.append("synDetail.GOODS_IS_SERIAL goodsIsSerialTB, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(serial.amount) ");
        sql.append("FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
        sql.append("WHERE serial.SYN_STOCK_TRANS_DETAIL_SER_ID = synDetailSerial.SYN_STOCK_TRANS_DETAIL_SER_ID ");
        sql.append("AND syn.TYPE                               =2 ");
        sql.append(")),0) numberXTB, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(serial.amount) ");
        sql.append("FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
        sql.append("WHERE serial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
        sql.append("AND syn.TYPE                           =1 ");
        sql.append("AND syn.status                         =2 ");
        sql.append(")),0) numberTHTB, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(conMer.quantity) ");
        sql.append("FROM  CONSTRUCTION_MERCHANDISE conMer ");
        sql.append("WHERE conMer.GOODS_ID         = synDetailSerial.GOODS_ID ");
        sql.append("AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
//		sql.append("AND conMer.WORK_ITEM_ID    = wi.WORK_ITEM_ID ");
        sql.append("AND conMer.TYPE            = 1 ");
        if (temp == 0) {
            sql.append("AND conMer.GOODS_IS_SERIAL = synDetail.GOODS_IS_SERIAL ");

        } else {
            sql.append("AND conMer.GOODS_IS_SERIAL = synDetail.GOODS_IS_SERIAL ");
            sql.append(" AND conMer.SERIAL            =synDetailSerial.SERIAL ");
            sql.append(" AND rownum                   =1 ");
        }
        sql.append(" AND conMer.MER_entity_id = synDetailSerial.MER_entity_id ");
        sql.append(")),0) numberNTTB, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(conMer.quantity) ");
        sql.append("FROM  CONSTRUCTION_MERCHANDISE conMer ");
        sql.append("WHERE conMer.GOODS_ID         = synDetailSerial.GOODS_ID ");
        sql.append("AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        sql.append("AND conMer.WORK_ITEM_ID    != wi.WORK_ITEM_ID ");
        sql.append("AND conMer.TYPE            = 1 ");
        if (temp == 0) {
            sql.append("AND conMer.GOODS_IS_SERIAL  = synDetail.GOODS_IS_SERIAL ");

        } else {
            sql.append("AND conMer.GOODS_IS_SERIAL = synDetail.GOODS_IS_SERIAL ");
            sql.append(" AND conMer.SERIAL            =synDetailSerial.SERIAL ");
            sql.append(" AND rownum                   =1 ");
        }
        sql.append(" AND conMer.MER_entity_id = synDetailSerial.MER_entity_id ");
        sql.append(")),0) numberNTKTB, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(conReturn.quantity) ");
        sql.append("FROM CONSTRUCTION_RETURN conReturn ");
        sql.append("WHERE conReturn.GOODS_ID      = synDetailSerial.GOODS_ID ");
        sql.append("AND conReturn.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        if (temp == 0) {
            sql.append("AND conReturn.SERIAL is null ");

        } else {

            sql.append("AND conReturn.SERIAL is not null ");
        }
        sql.append("AND conReturn.WORK_ITEM_ID   = wi.WORK_ITEM_ID ");
        sql.append("AND conReturn.MER_entity_id = synDetailSerial.MER_entity_id ");
        sql.append(")),0) numberHTTB, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(conReturn.quantity) ");
        sql.append("FROM CONSTRUCTION_RETURN conReturn ");
        sql.append("WHERE conReturn.GOODS_ID      = synDetailSerial.GOODS_ID ");
        sql.append("AND conReturn.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        if (temp == 0) {
            sql.append("AND conReturn.SERIAL is null ");

        } else {

            sql.append("AND conReturn.SERIAL is not null ");
        }
        sql.append("AND conReturn.WORK_ITEM_ID   != wi.WORK_ITEM_ID ");
        sql.append("AND conReturn.MER_entity_id = synDetailSerial.MER_entity_id ");
        sql.append(")),0) numberHTKTB ");
        sql.append("FROM SYN_STOCK_TRANS syn ");
        sql.append("INNER JOIN CONSTRUCTION con ");
        sql.append("ON con.code = syn.CONSTRUCTION_CODE ");
        sql.append("LEFT JOIN WORK_ITEM wi ");
        sql.append("ON con.CONSTRUCTION_ID = wi.CONSTRUCTION_ID ");
        sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL synDetail ");
        sql.append("ON syn.SYN_STOCK_TRANS_ID     = synDetail.SYN_STOCK_TRANS_ID ");
        if (temp == 0) {
            sql.append("AND synDetail.GOODS_IS_SERIAL = 0 ");

        } else {
            sql.append("AND synDetail.GOODS_IS_SERIAL = 1 ");

        }
        sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL synDetailSerial ");
        sql.append("ON synDetailSerial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
        sql.append("WHERE syn.SYN_TRANS_TYPE   =1 ");
        sql.append("AND syn.CONFIRM            =1 ");
        sql.append("AND con.CONSTRUCTION_ID    =:constructionId ");
        sql.append("AND wi.WORK_ITEM_ID        =:workItemId ");
        sql.append("AND wi.PERFORMER_ID        =:userid ");
        sql.append("AND  synDetailSerial.GOODS_ID=:goodsId  ");
        sql.append("AND synDetailSerial.amount >0 ");
        sql.append("GROUP BY con.CONSTRUCTION_ID, ");
        sql.append("con.CODE, ");
        if (temp == 1) {
            sql.append("synDetailSerial.MER_ENTITY_ID, ");
        }
        sql.append("wi.WORK_ITEM_ID, ");
        sql.append("wi.NAME, ");
        sql.append("synDetailSerial.GOODS_ID, ");
        sql.append("synDetailSerial.GOODS_CODE, ");
        sql.append("synDetailSerial.GOODS_NAME, ");
        sql.append("synDetailSerial.GOODS_UNIT_NAME, ");
        sql.append("synDetailSerial.SERIAL, ");
        sql.append("syn.REAL_IE_TRANS_DATE, ");
        sql.append("synDetail.GOODS_IS_SERIAL ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("workItemId", request.getConstructionMerchandiseDetailDTO().getWorkItemId());
        query.setParameter("constructionId", request.getConstructionMerchandiseDetailDTO().getConstructionId());
        query.setParameter("userid", request.getSysUserRequest().getSysUserId());
        query.setParameter("goodsId", goodsId);
        query.addScalar("workItemIdTB", new LongType());
        query.addScalar("constructionIdTB", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("workItemNameTB", new StringType());
        if (temp == 1) {
            query.addScalar("merEntityId", new LongType());
        }
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitNameTB", new StringType());
        query.addScalar("serial", new StringType());
        query.addScalar("realIeTransDateTB", new StringType());
        query.addScalar("goodsIsSerialTB", new StringType());
        // query.addScalar("conMerquantity",new DoubleType());
        query.addScalar("numberXTB", new DoubleType());
        query.addScalar("numberTHTB", new DoubleType());
        query.addScalar("numberNTTB", new DoubleType());
        query.addScalar("numberNTKTB", new DoubleType());
        query.addScalar("numberHTTB", new DoubleType());
        query.addScalar("numberHTKTB", new DoubleType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionMerchandiseItemTBDTO.class));
        return query.list();

    }

    public List<ConstructionMerchandiseDetailVTDTO> getValueToInitConstructionMerchandiseTB(
            ConstructionMerchandiseDTORequest request, long temp) {

        StringBuilder sql = new StringBuilder(" SELECT ");

        sql.append(" DISTINCT cMer.CONSTRUCTION_ID constructionId, ");
        sql.append("cons.CODE constructionCode, ");
        sql.append("cons.IS_RETURN constructionIsReturn, ");
        sql.append("cMer.GOODS_NAME goodsName, ");
        sql.append("cMer.SERIAL serial,  ");
        sql.append("cMer.REMAIN_COUNT remainCount ");
        sql.append("FROM CONSTRUCTION cons ");
        sql.append("LEFT JOIN CONSTRUCTION_MERCHANDISE cMer ");
        sql.append("ON cons.CONSTRUCTION_ID = cMer.CONSTRUCTION_ID ");
        sql.append("left join CONSTRUCTION_TASK constask ");
        sql.append("on constask.CONSTRUCTION_ID= cons.CONSTRUCTION_ID ");
        sql.append("WHERE cMer.TYPE         =1 ");
        sql.append("AND cMer.REMAIN_COUNT   >0 ");
        sql.append("AND cMer.GOODS_IS_SERIAL=1 ");
        sql.append("and constask.PERFORMER_ID=:userid ");
        sql.append("and cMer.CONSTRUCTION_ID=:consid ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("userid", request.getSysUserRequest().getSysUserId());
        query.setParameter("consid", request.getConstructionMerchandiseDTO().getConstructionId());

        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("constructionIsReturn", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("serial", new StringType());

        query.addScalar("remainCount", new DoubleType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionMerchandiseDetailVTDTO.class));
        return query.list();

    }

    /**
     * Màn hình chi tiết hạng mục
     *
     * @param constructionId
     * @return List<ConstructionTaskDTO>
     * @author CuongNV2
     */
    public List<ConstructionImageInfo> getListImageByConstructionId(Long workItemId) {
        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT ");
        sql.append(
                "a.UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId, a.name imageName, a.file_path imagePath , 1 status ");
        sql.append("FROM ");
        sql.append("UTIL_ATTACH_DOCUMENT a ");
        sql.append("WHERE ");
        sql.append("a.object_id = :workItemId ");
        sql.append("AND a.TYPE = '46' ");
        sql.append("ORDER BY a.UTIL_ATTACH_DOCUMENT_ID DESC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("imageName", new StringType());
        query.addScalar("imagePath", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("utilAttachDocumentId", new LongType());
        query.setParameter("workItemId", workItemId);
        query.setResultTransformer(Transformers.aliasToBean(ConstructionImageInfo.class));
        return query.list();
    }

    public List<ConstructionMerchandiseDetailVTDTO> getListVatTuDetail(Long constructionId, Long workItemId,
                                                                       Long goodsId, long sysUserId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT con.CONSTRUCTION_ID constructionId, ");
        sql.append("wi.WORK_ITEM_ID workItemId, ");
        sql.append("con.CODE constructionCode, ");
        sql.append("wi.NAME workItemName, ");
        sql.append("synDetailSerial.GOODS_ID goodsId , ");
        sql.append("synDetailSerial.MER_ENTITY_ID merEntityId, ");
        sql.append("synDetailSerial.GOODS_CODE goodsCode , ");
        sql.append("synDetailSerial.GOODS_NAME goodsName, ");
        sql.append("synDetailSerial.GOODS_UNIT_NAME goodsUnitName, ");
        sql.append("syn.REAL_IE_TRANS_DATE realIeTransDate, ");
        sql.append("synDetail.GOODS_IS_SERIAL goodsIsSerial, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(serial.amount) ");
        sql.append("FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
        sql.append("WHERE serial.SYN_STOCK_TRANS_DETAIL_SER_ID = synDetailSerial.SYN_STOCK_TRANS_DETAIL_SER_ID ");
        sql.append("AND syn.TYPE                               =2 ");
        sql.append(")),0) numberXuat, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(serial.amount) ");
        sql.append("FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
        sql.append("WHERE serial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
        sql.append("AND syn.TYPE                           =1 ");
        sql.append("AND syn.status                         =2 ");
        sql.append(")),0) numberThuhoi, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(conMer.quantity) ");
        sql.append("FROM CONSTRUCTION_MERCHANDISE conMer ");
        sql.append("WHERE conMer.GOODS_ID      = synDetailSerial.GOODS_ID ");
        sql.append("AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        sql.append("AND conMer.WORK_ITEM_ID    = wi.WORK_ITEM_ID ");
        sql.append("AND conMer.TYPE            = 1 ");
        sql.append("AND conMer.GOODS_IS_SERIAL = synDetail.GOODS_IS_SERIAL ");
        sql.append("AND conMer.MER_entity_id   = synDetailSerial.MER_entity_id ");
        sql.append(")),0) numberNghiemthu, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(conMer.quantity) ");
        sql.append("FROM CONSTRUCTION_MERCHANDISE conMer ");
        sql.append("WHERE conMer.GOODS_ID      = synDetailSerial.GOODS_ID ");
        sql.append("AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        sql.append("AND conMer.WORK_ITEM_ID   != wi.WORK_ITEM_ID ");
        sql.append("AND conMer.TYPE            = 1 ");
        sql.append("AND conMer.GOODS_IS_SERIAL = synDetail.GOODS_IS_SERIAL ");
        sql.append("AND conMer.MER_entity_id   = synDetailSerial.MER_entity_id ");
        sql.append(")),0) numberNghiemThuKhac, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(conReturn.quantity) ");
        sql.append("FROM CONSTRUCTION_RETURN conReturn ");
        sql.append("WHERE conReturn.GOODS_ID      = synDetailSerial.GOODS_ID ");
        sql.append("AND conReturn.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        sql.append("AND conReturn.SERIAL is null ");
        sql.append("AND conReturn.WORK_ITEM_ID   = wi.WORK_ITEM_ID ");
        sql.append("AND conReturn.MER_entity_id = synDetailSerial.MER_entity_id ");
        sql.append(")),0) numberHoanTra, ");
        sql.append("NVL(SUM( ");
        sql.append("(SELECT SUM(conReturn.quantity) ");
        sql.append("FROM CONSTRUCTION_RETURN conReturn ");
        sql.append("WHERE conReturn.GOODS_ID      = synDetailSerial.GOODS_ID ");
        sql.append("AND conReturn.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
        sql.append("AND conReturn.SERIAL is null ");
        sql.append("AND conReturn.WORK_ITEM_ID   != wi.WORK_ITEM_ID ");
        sql.append("AND conReturn.MER_entity_id = synDetailSerial.MER_entity_id ");
        sql.append(")),0) numberHoanTraKhac ");
        sql.append("FROM SYN_STOCK_TRANS syn ");
        sql.append("INNER JOIN CONSTRUCTION con ");
        sql.append("ON con.code = syn.CONSTRUCTION_CODE ");
        sql.append("LEFT JOIN WORK_ITEM wi ");
        sql.append("ON con.CONSTRUCTION_ID = wi.CONSTRUCTION_ID ");
        sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL synDetail ");
        sql.append("ON syn.SYN_STOCK_TRANS_ID     = synDetail.SYN_STOCK_TRANS_ID ");
        sql.append("AND synDetail.GOODS_IS_SERIAL = 0 ");
        sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL synDetailSerial ");
        sql.append("ON synDetailSerial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
        sql.append("WHERE syn.SYN_TRANS_TYPE                     =1 ");
        sql.append("AND syn.CONFIRM                              =1 ");
        sql.append("AND con.CONSTRUCTION_ID                      =:constructionId ");
        sql.append("AND wi.WORK_ITEM_ID                          =:workItemId ");
        sql.append("AND wi.PERFORMER_ID                          =:userid ");
        sql.append("AND synDetailSerial.amount                   >0 ");
        sql.append("AND synDetailSerial.GOODS_ID=:goodsId ");
        sql.append("GROUP BY con.CONSTRUCTION_ID, ");
        sql.append("con.CODE, ");
        sql.append("wi.WORK_ITEM_ID, ");
        sql.append("wi.NAME, ");
        sql.append("synDetailSerial.GOODS_ID, ");
        sql.append("synDetailSerial.MER_ENTITY_ID, ");
        sql.append("synDetailSerial.GOODS_CODE, ");
        sql.append("synDetailSerial.GOODS_NAME, ");
        sql.append("synDetailSerial.GOODS_UNIT_NAME, ");
        sql.append("syn.REAL_IE_TRANS_DATE, ");
        sql.append("synDetail.GOODS_IS_SERIAL  ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("workItemId", workItemId);
        query.setParameter("constructionId", constructionId);
        query.setParameter("goodsId", goodsId);
        query.setParameter("userid", sysUserId);
        query.addScalar("constructionId", new LongType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("merEntityId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("realIeTransDate", new StringType());
        query.addScalar("goodsIsSerial", new StringType());
        query.addScalar("numberXuat", new DoubleType());
        query.addScalar("numberThuhoi", new DoubleType());
        query.addScalar("numberNghiemthu", new DoubleType());
        query.addScalar("numberNghiemThuKhac", new DoubleType());
        query.addScalar("numberHoanTra", new DoubleType());
        query.addScalar("numberHoanTraKhac", new DoubleType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionMerchandiseDetailVTDTO.class));

        return query.list();
    }

    public void deleteHTVTTB(Long constructionId, Long workItemId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(" ");
        sql.append(
                " DELETE CONSTRUCTION_RETURN cr where  cr.CONSTRUCTION_ID=:constructionId and cr.WORK_ITEM_ID =:workItemId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.setParameter("constructionId", constructionId);
        query.setParameter("workItemId", workItemId);
        query.executeUpdate();

    }

    public void deleteImageReturn(Long workItemId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(" ");
        sql.append(" delete UTIL_ATTACH_DOCUMENT uad where uad.OBJECT_ID=:workItemId and uad.TYPE='46' ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.setParameter("workItemId", workItemId);
        query.executeUpdate();

    }
}
