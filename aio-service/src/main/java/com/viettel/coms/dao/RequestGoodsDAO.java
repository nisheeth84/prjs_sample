package com.viettel.coms.dao;

import com.viettel.coms.bo.RequestGoodsBO;
import com.viettel.coms.dto.*;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.dto.BaseFWDTO;
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
import java.util.ArrayList;
import java.util.List;

//VietNT_20180104_created
@EnableTransactionManagement
@Transactional
@Repository("requestGoodsDAO")
public class RequestGoodsDAO extends BaseFWDAOImpl<RequestGoodsBO, Long> {

    public RequestGoodsDAO() {
        this.model = new RequestGoodsBO();
    }

    public RequestGoodsDAO(Session session) {
        this.session = session;
    }

    public List<RequestGoodsDTO> doSearch(RequestGoodsDTO criteria, List<String> sysGroupIdList) {
        StringBuilder sql = this.createDoSearchBaseQuery();
        sql.append(", a.assign_handover_id assignHandoverId ");
        sql.append(", a.is_design isDesign ");
        sql.append(", a.CAT_PROVINCE_CODE catProvinceCode ");
        sql.append(", a.CAT_STATION_CODE catStationCode ");
        sql.append("FROM REQUEST_GOODS rg ");
        sql.append("left join assign_handover a on a.construction_id = rg.construction_id ");

        //query by sysGroupId
        sql.append("WHERE 1=1 ");
        sql.append("AND rg.SYS_GROUP_ID in (:sysGroupId) ");

        //query by keySearch: Mã công trình/hợp đồng
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("AND (" +
                    "upper(rg.CONSTRUCTION_CODE) LIKE upper(:keySearch) " +
                    "OR upper(rg.CNT_CONTRACT_CODE) LIKE upper(:keySearch) escape '&') ");
        }

        //query by status
        if (null != criteria.getStatus()) {
            sql.append("AND rg.STATUS = :status ");
        }

        //query by createdDate
        if (null != criteria.getDateFrom()) {
            sql.append("AND TRUNC(rg.CREATED_DATE) >= :dateFrom ");
        }
        if (null != criteria.getDateTo()) {
            sql.append("AND TRUNC(rg.CREATED_DATE) <= :dateTo ");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        sql.append("ORDER BY request_goods_id desc ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery(sqlCount.toString());

        // set params
        query.setParameterList("sysGroupId", sysGroupIdList);
        queryCount.setParameterList("sysGroupId", sysGroupIdList);

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }
        if (null != criteria.getStatus()) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }
        if (null != criteria.getDateFrom()) {
            query.setParameter("dateFrom", criteria.getDateFrom());
            queryCount.setParameter("dateFrom", criteria.getDateFrom());
        }
        if (null != criteria.getDateTo()) {
            query.setParameter("dateTo", criteria.getDateTo());
            queryCount.setParameter("dateTo", criteria.getDateTo());
        }

        query.setResultTransformer(Transformers.aliasToBean(RequestGoodsDTO.class));
        this.addQueryScalarDoSearch(query);
        query.addScalar("assignHandoverId", new LongType());
        query.addScalar("isDesign", new LongType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("catStationCode", new StringType());

        this.setPageSize(criteria, query, queryCount);
        return query.list();
    }

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<ConstructionDetailDTO> searchConstruction(ConstructionDetailDTO obj, String sysGroupId) {
        StringBuilder sql = new StringBuilder("select t.construction_id constructionId, t.code code, t.name name, " +
                "a.assign_handover_id assignHandoverId, " +
                "a.is_design isDesign, " +
                "cp.cat_province_id catProvinceId, " +
                "cp.code catProvinceCode, " +
                "cs.cat_station_id catStationId, " +
                "cs.code catStationCode " +
                "FROM CONSTRUCTION t " +
                "LEFT JOIN CAT_STATION cs ON cs.cat_station_id = t.cat_station_id " +
                "LEFT JOIN CAT_STATION_HOUSE ch ON ch.cat_station_house_id = cs.cat_station_house_id " +
                "LEFT JOIN CAT_PROVINCE cp ON cp.cat_province_id = cs.cat_province_id " +
                "LEFT JOIN ASSIGN_HANDOVER a on a.construction_code = t.code " +
                "WHERE t.SYS_GROUP_ID = :sysGroupId ");

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append("and (upper(t.code) like upper(:keySearch) " +
                    "or upper(cs.code) like upper(:keySearch) " +
                    "or upper(ch.code) like upper(:keySearch) " +
                    "escape '&') ");
        }

        if (null != obj.getCatProvinceId()) {
            sql.append("AND cp.CAT_PROVINCE_ID = :catProvinceId ");
        }
        if (null != obj.getCatStationId()) {
            sql.append("AND cs.CAT_STATION_ID = :catStationId ");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("catStationId", new LongType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("assignHandoverId", new LongType());
        query.addScalar("isDesign", new LongType());

        // set param
        query.setParameter("sysGroupId", sysGroupId);
        queryCount.setParameter("sysGroupId", sysGroupId);

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }

        if (null != obj.getCatProvinceId()) {
            query.setParameter("catProvinceId", obj.getCatProvinceId());
            queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
        }

        if (null != obj.getCatStationId()) {
            query.setParameter("catStationId", obj.getCatStationId());
            queryCount.setParameter("catStationId", obj.getCatStationId());
        }

        this.setPageSize(obj, query, queryCount);
        return query.list();
    }

    private StringBuilder createDoSearchBaseQuery() {
        StringBuilder sql = new StringBuilder("SELECT " +
                "rg.REQUEST_GOODS_ID requestGoodsId, " +
                "rg.SYS_GROUP_ID sysGroupId, " +
                "rg.CAT_PROVINCE_ID catProvinceId, " +
                "rg.CONSTRUCTION_ID constructionId, " +
                "rg.CONSTRUCTION_CODE constructionCode, " +
                "rg.CNT_CONTRACT_ID cntContractId, " +
                "rg.CNT_CONTRACT_CODE cntContractCode, " +
                "rg.REQUEST_CONTENT requestContent, " +
                "rg.RECEIVE_DATE receiveDate, " +
                "rg.OBJECT_ID objectId, " +
                "rg.STATUS status, " +
                "rg.SEND_DATE sendDate, " +
                "rg.IS_ORDER isOrder, " +
                "rg.CREATED_DATE createdDate, " +
                "rg.CREATED_USER_ID createdUserId, " +
                "rg.UPDATE_DATE updateDate, " +
                "rg.UPDATE_USER_ID updateUserId ");
        return sql;
    }

    private void addQueryScalarDoSearch(SQLQuery query) {
        query.addScalar("requestGoodsId", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("cntContractId", new LongType());
        query.addScalar("cntContractCode", new StringType());
        query.addScalar("requestContent", new StringType());
        query.addScalar("receiveDate", new DateType());
        query.addScalar("objectId", new LongType());
        query.addScalar("status", new LongType());
        query.addScalar("sendDate", new DateType());
        query.addScalar("isOrder", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("updateDate", new DateType());
        query.addScalar("updateUserId", new LongType());
    }

    public List<RequestGoodsDetailDTO> doSearchDetail(RequestGoodsDetailDTO criteria) {
        if (null != criteria.getRequestGoodsId()) {
            return this.doSearchDetail(criteria.getRequestGoodsId());
        }
        return new ArrayList<>();
    }

    public List<RequestGoodsDetailDTO> doSearchDetail(Long requestGoodsId) {
        StringBuilder sql = this.createDoSearchDetailBaseQuery();
        sql.append("FROM REQUEST_GOODS_DETAIL WHERE 1=1 " +
                "AND REQUEST_GOODS_ID = :requestGoodsId ");

//        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
//        sqlCount.append(sql.toString());
//        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
//        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.setResultTransformer(Transformers.aliasToBean(RequestGoodsDetailDTO.class));
        query.setParameter("requestGoodsId", requestGoodsId);
//        queryCount.setParameter("requestGoodsId", requestGoodsId);
        this.addQueryScalarDoSearchDetail(query);

//        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    private StringBuilder createDoSearchDetailBaseQuery() {
        StringBuilder sql = new StringBuilder("SELECT " +
                "REQUEST_GOODS_DETAIL_ID requestGoodsDetailId, " +
                "REQUEST_GOODS_ID requestGoodsId, " +
                "GOODS_NAME goodsName, " +
                "SUGGEST_DATE suggestDate, " +
                "CAT_UNIT_ID catUnitId, " +
                "CAT_UNIT_NAME catUnitName, " +
                "QUANTITY quantity, " +
                "DESCRIPTION description ");
        return sql;
    }

    private void addQueryScalarDoSearchDetail(SQLQuery query) {
        query.addScalar("requestGoodsDetailId", new LongType());
        query.addScalar("requestGoodsId", new LongType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("suggestDate", new DateType());
        query.addScalar("catUnitId", new LongType());
        query.addScalar("catUnitName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("description", new StringType());
    }

    public List<RequestGoodsDetailDTO> getCatUnit() {
        String sql = "select cat_unit_id catUnitId" +
                ", code catUnitCode " +
                ", name catUnitName " +
                "from cat_unit where status=1 ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(RequestGoodsDetailDTO.class));
        query.addScalar("catUnitId", new LongType());
        query.addScalar("catUnitCode", new StringType());
        query.addScalar("catUnitName", new StringType());

        return query.list();
    }

    public AssignHandoverDTO getConstructionDetailInfo(Long constructionId) {
        String sql = "select " +
                "t.sys_group_id sysGroupId, " +
                "a.received_date receivedDate, " +
                "doc.util_attach_document_id assignHandoverId, " +
                "cnt.cnt_contract_id cntContractId, " +
                "cnt.code cntContractCode, " +
                "a.received_date receivedDate, " +
                "a.RECEIVED_GOODS_DATE receivedGoodsDate, " +
                "a.RECEIVED_OBSTRUCT_DATE receivedObstructDate " +
                "FROM CONSTRUCTION t " +
                "LEFT JOIN ASSIGN_HANDOVER a on a.construction_code = t.code " +
                "left join CNT_CONSTR_WORK_ITEM_TASK cc on cc.construction_id = t.construction_id " +
                "left join CNT_CONTRACT cnt on cnt.cnt_contract_id = cc.cnt_contract_id  " +
                "left join util_attach_document doc on doc.object_id = a.assign_handover_id and doc.type='57' " +
                "where t.construction_id = :constructionId " +
                "and cnt.cnt_contract_id is not null " +
                "and cnt.code is not null " +
                "order by t.construction_id ";

        SQLQuery query = getSession().createSQLQuery(sql);

        query.setResultTransformer(Transformers.aliasToBean(AssignHandoverDTO.class));
        query.setParameter("constructionId", constructionId);
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("receivedDate", new DateType());
        query.addScalar("receivedGoodsDate", new DateType());
        query.addScalar("receivedObstructDate", new DateType());
        query.addScalar("assignHandoverId", new LongType());
        query.addScalar("cntContractId", new LongType());
        query.addScalar("cntContractCode", new StringType());

        return this.getFirst(query);
    }

    public List<RequestGoodsDTO> findByIdList(List<Long> requestGoodsIds) {
        StringBuilder sql = this.createDoSearchBaseQuery();
        sql.append("FROM REQUEST_GOODS rg " +
                "WHERE request_goods_id IN (:ids)");

        SQLQuery query = super.getSession().createSQLQuery(sql.toString());
        query.setParameterList("ids", requestGoodsIds);
        query.setResultTransformer(Transformers.aliasToBean(RequestGoodsDTO.class));
        this.addQueryScalarDoSearch(query);

        return query.list();
    }

    public ConstructionDetailDTO findConstructionInfoByCodeForImport(String constructionCode, String sysGroupId) {
        String sql = "select " +
                "cp.cat_province_id catProvinceId, " +
                "t.construction_id constructionId, " +
                "cnt.cnt_contract_id cntContractId, " +
                "cnt.code cntContractCode, " +
                "a.received_date receivedDate, " +
                "doc.util_attach_document_id objectId " +

                "FROM CONSTRUCTION t " +
                "LEFT JOIN ASSIGN_HANDOVER a on a.construction_code = t.code " +
                "LEFT JOIN CAT_STATION cs ON cs.cat_station_id = t.cat_station_id " +
                "LEFT JOIN CAT_PROVINCE cp ON cp.cat_province_id = cs.cat_province_id " +
                "left join CNT_CONSTR_WORK_ITEM_TASK cc on cc.construction_id = t.construction_id " +
                "left join CNT_CONTRACT cnt on cnt.cnt_contract_id = cc.cnt_contract_id  " +
                "left join util_attach_document doc on doc.object_id = a.assign_handover_id and doc.type='57' " +
                "where upper(t.code) = upper(:constructionCode) " +
                "and t.sys_group_id = :sysGroupId ";


        SQLQuery query = super.getSession().createSQLQuery(sql);
        query.setParameter("constructionCode", constructionCode);
        query.setParameter("sysGroupId", sysGroupId);

        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("cntContractId", new LongType());
        query.addScalar("cntContractCode", new StringType());
        query.addScalar("receivedDate", new DateType());
        query.addScalar("objectId", new LongType());

        return this.getFirst(query);
    }

    private <T extends BaseFWDTO> T getFirst(SQLQuery query) {
        List<T> dtos = query.list();
        if (dtos != null && !dtos.isEmpty()) {
            return dtos.get(0);
        }
        return null;
    }

    public List<RequestGoodsDTO> findConstructionInSysGroup(String sysGroupId) {
        String sql = "SELECT code constructionCode from construction where sys_group_id = :sysGroupId";
        SQLQuery query = super.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(RequestGoodsDTO.class));
        query.addScalar("constructionCode", new StringType());
        query.setParameter("sysGroupId", sysGroupId);
        return query.list();
    }

    public ConstructionDetailDTO getSysGroupNameById(String sysGroupId) {
        String sql = "select name sysGroupName from sys_group where sys_group_id = :sysGroupId";

        SQLQuery query = super.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(ConstructionDetailDTO.class));
        query.addScalar("sysGroupName", new StringType());
        query.setParameter("sysGroupId", sysGroupId);

        return (ConstructionDetailDTO) query.uniqueResult();
    }
}
