package com.viettel.aio.dao;

import com.viettel.aio.dto.AIOSynStockTransDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.MerEntitySimpleDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
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

//VietNT_20190320_create
@EnableTransactionManagement
@Transactional
@Repository("aioRpPersonalInventoryDAO")
public class AIORpPersonalInventoryDAO extends BaseFWDAOImpl<BaseFWModelImpl, Long> {

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<MerEntitySimpleDTO> doSearch(MerEntitySimpleDTO criteria) {
        String serialSelect = StringUtils.EMPTY;
        String serialGroup = StringUtils.EMPTY;
        String conditionKeySearch = StringUtils.EMPTY;
        String conditionGroup = StringUtils.EMPTY;
        if (criteria.getIsDetail() != 0) {
            serialSelect = ", m.serial serial ";
            serialGroup = ", m.serial ";
        }
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
        	conditionKeySearch = "and (upper(su.employee_code) like upper(:keySearch) " +
        			"or upper(m.goods_code) like upper(:keySearch) " +
        			"or upper(su.full_name) like upper(:keySearch) " +
        			"or upper(m.goods_name) like upper(:keySearch)) ";      	
        }
        if (null != criteria.getSysGroupId()) {
        	conditionGroup = "and sg.PATH like :sysGroupId ";
        }

        StringBuilder sql = new StringBuilder("SELECT ")
                .append("sg.GROUP_NAME_LEVEL2 sysGroupName, ")
                .append("sg.name cum, ")
                .append("su.employee_code || ' - ' || su.full_name userName, ")
                .append("m.goods_code goodsCode, ")
                .append("m.goods_name goodsName, ")
                .append("m.cat_unit_name catUnitName, ")
                .append("sum(m.amount) amount ")
                //VietNT_18/07/2019_start
                .append(", sum(m.amount * m.APPLY_PRICE) applyPrice ")
                //VietNT_end
                .append(serialSelect)
                .append("from mer_entity m ")
                .append("join cat_stock s on m.stock_id = s.cat_stock_id ")
                .append("join sys_user su on su.sys_user_id = s.sys_user_id ")
                .append("LEFT join sys_group sg on sg.SYS_GROUP_ID = su.SYS_GROUP_ID ")
                .append("where m.stock_id is not null ")
                .append("and m.status = 4 ")
                .append(conditionKeySearch)
                .append(conditionGroup)
                .append("group by ")
                .append("sg.GROUP_NAME_LEVEL2, sg.name, m.goods_code, m.goods_name, m.cat_unit_name, su.employee_code || ' - ' || su.full_name ")
                .append(serialGroup)
                .append("ORDER BY m.goods_name ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
        
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
        	query.setParameter("keySearch","%" + criteria.getKeySearch() + "%");      	
        	queryCount.setParameter("keySearch","%" + criteria.getKeySearch() + "%");      	
        }
        if (null != criteria.getSysGroupId()) {
        	query.setParameter("sysGroupId", "%" + criteria.getSysGroupId() + "%");
        	queryCount.setParameter("sysGroupId", "%" + criteria.getSysGroupId() + "%");
        }

        query.setResultTransformer(Transformers.aliasToBean(MerEntitySimpleDTO.class));
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("cum", new StringType());
        query.addScalar("userName", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("catUnitName", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("applyPrice", new DoubleType());
        if (criteria.getIsDetail() != 0) {
        	query.addScalar("serial", new StringType());
        }

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    //VietNT_20190524_start
    public List<AIOSynStockTransDTO> doSearchGoodsTransferring(AIOSynStockTransDTO criteria) {
        String groupBy = "group by " +
                "cs.sys_group_id, cs.sys_group_name, st.stock_trans_id, st.stock_id, " +
                "st.stock_code, st.stock_name, st.REAL_IE_TRANS_DATE, st.confirm, " +
                "std.goods_id, std.goods_code, std.goods_name, sts.serial, " +
                "st.STOCK_RECEIVE_ID, st.STOCK_RECEIVE_CODE, a.name, st.code, st.BUSINESS_TYPE_NAME " +
                //VietNT_01/08/2019_start
                ",fst.code ";
                //VietNT_end
        StringBuilder sql = new StringBuilder()
                .append("WITH a AS (SELECT stk.name, stk.code FROM cat_stock stk where stk.status = 1) ")
                .append("select ")
                .append("cs.sys_group_id sysGroupId, ")
                .append("cs.sys_group_name sysGroupName, ")
                .append("st.stock_trans_id stockTransId, ")
                .append("st.BUSINESS_TYPE_NAME businessTypeName, ")
                .append("st.code code, ")
                .append("st.stock_id stockId, ")
                .append("st.stock_code stockCode, ")
                .append("st.stock_name stockName, ")
                .append("st.STOCK_RECEIVE_ID stockReceiveId, ")
                .append("st.STOCK_RECEIVE_CODE stockReceiveCode, ")
                .append("a.name stockReceiveName, ")
                .append("st.REAL_IE_TRANS_DATE realIeTransDate, ")
//                .append("st.confirm confirm, ")
                .append("(CASE WHEN ( st.confirm = 0 OR st.confirm IS NULL) THEN 'Chờ xác nhận' "
                        + "WHEN st.confirm = 1 THEN 'Đã xác nhận' "
                        + "WHEN st.confirm = 2 THEN 'Đã từ chối' ELSE '' END) confirm, ")
                .append("std.goods_id goodsId, ")
                .append("std.goods_code goodsCode, ")
                .append("std.goods_name goodsName, ")
                .append("sum(sts.quantity) quantity, ")
                .append("sts.serial serial ")
                //VietNT_01/08/2019_start
                .append(",fst.code text ")
                //VietNT_end

                .append("from stock_trans st ")
                .append("left join stock_trans_detail std on std.STOCK_TRANS_ID = st.STOCK_TRANS_ID ")
                .append("left join stock_trans_detail_serial sts on sts.STOCK_TRANS_DETAIL_ID = std.STOCK_TRANS_DETAIL_ID ")
                .append("left join cat_stock cs on cs.code = st.stock_code ")
                .append("left join a on st.STOCK_RECEIVE_CODE = a.code ")
                //VietNT_01/08/2019_start
                .append("left join stock_trans fst on fst.from_stock_trans_id = st.Stock_trans_id ")
                //VietNT_end

//                .append("where st.type = 2 and st.status = 2 and (st.confirm is null or st.confirm != 1) and st.business_type in (8,12) ");
                .append("where st.type = 2 and st.status = 2 and st.business_type in (8,12) ");

        if (0 == criteria.getTypeConfirm()) {
            sql.append("and (st.confirm = :typeConfirm or st.confirm is null) ");
        } else if (3L != criteria.getTypeConfirm() ) {
            sql.append("and st.confirm = :typeConfirm ");
        }
        if (null != criteria.getStockId()) {
            sql.append("and st.stock_id = :stockId ");
        }
        if (null != criteria.getStockReceiveId()) {
            sql.append("and st.STOCK_RECEIVE_ID = :stockReceiveId ");
        }
        if (null != criteria.getSysGroupId()) {
            sql.append("and cs.sys_group_id = :sysGroupId ");
        }
        if (null != criteria.getDateFrom()) {
            sql.append("AND TRUNC(st.real_ie_trans_date) >= :dateFrom ");
        }
        if (null != criteria.getDateTo()) {
            sql.append("AND TRUNC(st.real_ie_trans_date) <= :dateTo ");
        }

        sql.append(groupBy);
        sql.append("order by st.code ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (null != criteria.getStockId()) {
            sql.append("and st.stock_id = :stockId ");
            query.setParameter("stockId", criteria.getStockId());
            queryCount.setParameter("stockId", criteria.getStockId());
        }
        if (3L != criteria.getTypeConfirm()) {
            query.setParameter("typeConfirm", criteria.getTypeConfirm());
            queryCount.setParameter("typeConfirm", criteria.getTypeConfirm());
        }
        if (null != criteria.getStockReceiveId()) {
            query.setParameter("stockReceiveId", criteria.getStockReceiveId());
            queryCount.setParameter("stockReceiveId", criteria.getStockReceiveId());
        }
        if (criteria.getSysGroupId() != null) {
            query.setParameter("sysGroupId", criteria.getSysGroupId());
            queryCount.setParameter("sysGroupId", criteria.getSysGroupId());
        }
        if (null != criteria.getDateFrom()) {
            query.setParameter("dateFrom", criteria.getDateFrom());
            queryCount.setParameter("dateFrom", criteria.getDateFrom());
        }
        if (null != criteria.getDateTo()) {
            query.setParameter("dateTo", criteria.getDateTo());
            queryCount.setParameter("dateTo", criteria.getDateTo());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOSynStockTransDTO.class));

        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("stockTransId", new LongType());
        query.addScalar("businessTypeName", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("stockId", new LongType());
        query.addScalar("stockCode", new StringType());
        query.addScalar("stockName", new StringType());
        query.addScalar("stockReceiveId", new LongType());
        query.addScalar("stockReceiveCode", new StringType());
        query.addScalar("stockReceiveName", new StringType());
        query.addScalar("realIeTransDate", new DateType());
        query.addScalar("confirm", new StringType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("serial", new StringType());
        query.addScalar("text", new StringType());

        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize());
            query.setMaxResults(criteria.getPageSize());
        }

        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }
    //VietNT_end
}
