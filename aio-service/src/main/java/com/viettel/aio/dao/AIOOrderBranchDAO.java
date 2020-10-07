package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOOrderBranchBO;
import com.viettel.aio.dto.AIOOrderBranchDTO;
import com.viettel.aio.dto.AIOOrderBranchDetailDTO;
import com.viettel.aio.dto.AIOOrderCompanyDetailDTO;
import com.viettel.aio.dto.AIOOrderRequestDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.GoodsDTO;
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

//VietNT_20190824_create
@EnableTransactionManagement
@Transactional
@Repository("aioOrderBranchDAO")
public class AIOOrderBranchDAO extends BaseFWDAOImpl<AIOOrderBranchBO, Long> {

    public AIOOrderBranchDAO() {
        this.model = new AIOOrderBranchBO();
    }

    public AIOOrderBranchDAO(Session session) {
        this.session = session;
    }


    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOOrderBranchDTO> doSearchOrderBranch(AIOOrderBranchDTO criteria, List<String> idList) {
        String sql = "SELECT " +
                "aob.ORDER_BRANCH_ID orderBranchId, " +
                "aob.ORDER_BRANCH_CODE orderBranchCode, " +
                //Huypq-20190922-start
//                "aob.ORDER_REQUEST_ID orderRequestId, " +
                //Huy-end
                "aob.STATUS status, " +
                "aob.CREATED_DATE createdDate, " +
                "to_char(aob.CREATED_DATE, 'HH24:MI') createdDateStr, " +
                "aob.CREATED_ID createdId, " +
                "aob.SYS_GROUP_ID sysGroupId, " +
                "aob.SYS_GROUP_NAME sysGroupName, " +
                "su.full_name sysUserName, " +
                "su.employee_code sysUserCode," +
                "aob.SIGN_STATE signState, " +
                "aob.IS_PROVINCE_BOUGHT isProvinceBought " +
                "FROM AIO_ORDER_BRANCH aob " +
                "left join sys_user su on su.sys_user_id = aob.created_id " +
                "WHERE 1=1 "+
                "AND aob.SYS_GROUP_ID in (:idList) ";
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql += "AND upper(aob.ORDER_BRANCH_CODE) like upper(:keySearch) escape '&' ";
        }
        if (criteria.getStatus() != null) {
            sql += "AND aob.status = :status ";
        }
        if (criteria.getStartDate() != null) {
            sql += "AND trunc(:dateFrom) <= trunc(aob.CREATED_DATE) ";
        }
        if (criteria.getEndDate() != null) {
            sql += "AND trunc(:dateTo) >= trunc(aob.CREATED_DATE) ";
        }

        //Huypq-20190923-start
        if (criteria.getSignState() != null) {
            sql += "AND aob.sign_State = :signState ";
        }
        //huy-end
        
        sql += "order by aob.ORDER_BRANCH_ID desc ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql + ")");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }
        if (criteria.getStatus() != null) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }
        if (criteria.getStartDate() != null) {
            query.setParameter("dateFrom", criteria.getStartDate());
            queryCount.setParameter("dateFrom", criteria.getStartDate());
        }
        if (criteria.getEndDate() != null) {
            query.setParameter("dateTo", criteria.getEndDate());
            queryCount.setParameter("dateTo", criteria.getEndDate());
        }

        if (criteria.getSignState() != null) {
        	query.setParameter("signState", criteria.getSignState());
            queryCount.setParameter("signState", criteria.getSignState());
        }
        
        query.setParameterList("idList", idList);
        queryCount.setParameterList("idList", idList);
        
        query.setResultTransformer(Transformers.aliasToBean(AIOOrderBranchDTO.class));
        query.addScalar("orderBranchId", new LongType());
        query.addScalar("orderBranchCode", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdDateStr", new StringType());
        query.addScalar("createdId", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("sysUserCode", new StringType());
        query.addScalar("signState", new LongType());
        query.addScalar("isProvinceBought", new LongType());
//        query.addScalar("orderRequestId", new LongType());

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    public List<AIOOrderBranchDetailDTO> getRequestGoodsList(AIOOrderRequestDTO obj) {
        String sql = "select " +
                "aord.ORDER_REQUEST_DETAIL_ID orderRequestDetailId, " +
                "aord.ORDER_REQUEST_ID orderRequestId, " +
                "aord.GOODS_ID goodsId, " +
                "aord.GOODS_CODE goodsCode, " +
                "aord.GOODS_NAME goodsName, " +
                "aord.TYPE type, " +
                "aord.MANUFACTURER_NAME manufacturerName, " +
                "aord.PRODUCING_COUNTRY_NAME producingCountryName, " +
                "aord.GOODS_UNIT_NAME goodsUnitName, " +
                "aord.GOODS_UNIT_ID goodsUnitId, " +
                "aord.SPECIFICATIONS specifications, " +
                "aord.DESCRIPTION description, " +
                "aord.AMOUNT amount " +
                ", aor.REQUEST_CODE requestCode " +
                "from AIO_ORDER_REQUEST_DETAIL aord " +
                "left join AIO_ORDER_REQUEST aor on aor.ORDER_REQUEST_ID = aord.ORDER_REQUEST_ID " +
                "where aord.status = 1 and (aord.in_request is null or aord.in_request != 1) ";

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql += "and (upper(aord.GOODS_CODE) like upper(:keySearch) escape '&' " +
                    "or upper(aord.GOODs_NAME) like upper(:keySearch) escape '&') ";
        }

        SQLQuery query = this.getSession().createSQLQuery(sql);
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql + ")");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        query.setResultTransformer(Transformers.aliasToBean(AIOOrderBranchDetailDTO.class));
        query.addScalar("orderRequestDetailId", new LongType());
        query.addScalar("orderRequestId", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("type", new LongType());
        query.addScalar("manufacturerName", new StringType());
        query.addScalar("producingCountryName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("specifications", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("requestCode", new StringType());

        this.setPageSize(obj, query, queryCount);

        return query.list();
    }

    public List<Long> checkDetailsIsInRequest(List<Long> idList) {
        String sql = "select d.ORDER_REQUEST_DETAIL_ID orderRequestDetailId " +
                "from aio_order_request_detail d " +
                "where d.ORDER_REQUEST_DETAIL_ID in (:idList) " +
                "and d.in_request = 1 ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("orderRequestDetailId", new LongType());
        query.setParameterList("idList", idList);

        return query.list();
    }

    public List<AIOOrderBranchDetailDTO> getDetailOrderBranch(Long idOrderBranch) {
        String sql = "SELECT " +
                "ORDER_BRANCH_DETAIL_ID orderBranchDetailId, " +
                "TYPE type, " +
                "STATUS status, " +
                "GOODS_ID goodsId, " +
                "GOODS_CODE goodsCode, " +
                "GOODS_NAME goodsName, " +
                "MANUFACTURER_NAME manufacturerName, " +
                "PRODUCING_COUNTRY_NAME producingCountryName, " +
                "SPECIFICATIONS specifications, " +
                "SUPPLIER supplier, " +
                "DESCRIPTION description, " +
                "AMOUNT amount, " +
                "PRICE price, " +
                "TOTAL_PRICE totalPrice, " +
                "ORDER_DATE orderDate " +
                "FROM AIO_ORDER_BRANCH_DETAIL " +
                "where ORDER_BRANCH_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOOrderBranchDetailDTO.class));
        query.setParameter("id", idOrderBranch);
        query.addScalar("orderBranchDetailId", new LongType());
        query.addScalar("type", new LongType());
        query.addScalar("status", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("manufacturerName", new StringType());
        query.addScalar("producingCountryName", new StringType());
        query.addScalar("specifications", new StringType());
        query.addScalar("supplier", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("price", new LongType());
        query.addScalar("totalPrice", new LongType());
        query.addScalar("orderDate", new DateType());

        return query.list();
    }

    public int updateBranchOrderDate(AIOOrderBranchDetailDTO obj) {
        String sql = "update AIO_ORDER_BRANCH_DETAIL set order_date = :orderDate where ORDER_BRANCH_DETAIL_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("orderDate", obj.getOrderDate());
        query.setParameter("id", obj.getOrderBranchDetailId());

        return query.executeUpdate();
    }

    // order request branch
    public List<AIOOrderBranchDTO> doSearchOrderRequestBranch(AIOOrderBranchDTO criteria, List<String> idList) {
        String joinDetail = StringUtils.EMPTY;
        String conditionGoodsCode = StringUtils.EMPTY;
        String queryExcel = StringUtils.EMPTY;
        if (StringUtils.isNotEmpty(criteria.getGoodsCode()) || criteria.getMessageColumn() > 0) {
            joinDetail = "left join aio_order_branch_detail rd on aob.order_branch_id = rd.ORDER_BRANCH_ID ";
            if (StringUtils.isNotEmpty(criteria.getGoodsCode())) {
                conditionGoodsCode = "and rd.goods_code = :goodsCode ";
            }
            if (criteria.getMessageColumn() > 0) {
                queryExcel = ", " +
                        "rd.GOODS_CODE goodsCode, " +
                        "rd.GOODS_NAME goodsName, " +
                        "rd.amount amount, " +
                        "rd.amount_approved amountApproved ";
            }
        }
        String sql = "select " +
                "aob.ORDER_BRANCH_ID orderBranchId, " +
                "aob.ORDER_BRANCH_CODE orderBranchCode, " +
                "aob.SYS_GROUP_NAME sysGroupName, " +
                "to_char(aob.CREATED_DATE, 'HH24:MI') createdDateStr, " +
                "aob.CREATED_DATE createdDate, " +
                "aob.IS_PROVINCE_BOUGHT isProvinceBought, " +
                "aob.STATUS status, " +
                "su.employee_code || '-' || su.full_name sysUserName " +
                queryExcel +

                "FROM AIO_ORDER_BRANCH aob " +
                "left join sys_user su on su.sys_user_id = aob.CREATED_ID " +
                joinDetail +
                "where 1=1 " +
                "and aob.SIGN_STATE = 3 " +
                "and aob.IS_PROVINCE_BOUGHT = 2 " +
                conditionGoodsCode;
//                +
//                "and aob.SIGN_STATE = 2 ";

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql += "AND upper(aob.ORDER_BRANCH_CODE) like upper(:keySearch) escape '&' ";
        }
        if (criteria.getStatus() != null) {
            sql += "AND aob.status = :status ";
        }
        if (criteria.getStartDate() != null) {
            sql += "AND trunc(:dateFrom) <= trunc(aob.CREATED_DATE) ";
        }
        if (criteria.getEndDate() != null) {
            sql += "AND trunc(:dateTo) >= trunc(aob.CREATED_DATE) ";
        }
        sql += "order by aob.ORDER_BRANCH_ID desc ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql + ")");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }
        if (criteria.getStatus() != null) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }
        if (criteria.getStartDate() != null) {
            query.setParameter("dateFrom", criteria.getStartDate());
            queryCount.setParameter("dateFrom", criteria.getStartDate());
        }
        if (criteria.getEndDate() != null) {
            query.setParameter("dateTo", criteria.getEndDate());
            queryCount.setParameter("dateTo", criteria.getEndDate());
        }

        if (StringUtils.isNotEmpty(criteria.getGoodsCode())) {
            query.setParameter("goodsCode", criteria.getGoodsCode());
            queryCount.setParameter("goodsCode", criteria.getGoodsCode());
        }
        if (criteria.getMessageColumn() > 0) {
            query.addScalar("goodsCode", new StringType());
            query.addScalar("goodsName", new StringType());
            query.addScalar("amount", new DoubleType());
            query.addScalar("amountApproved", new DoubleType());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOOrderBranchDTO.class));
        query.addScalar("orderBranchId", new LongType());
        query.addScalar("orderBranchCode", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdDateStr", new StringType());
//        query.addScalar("createdId", new LongType());
//        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupName", new StringType());
//        query.addScalar("sysUserName", new StringType());
//        query.addScalar("sysUserCode", new StringType());
//        query.addScalar("signState", new LongType());
        query.addScalar("isProvinceBought", new LongType());
        query.addScalar("sysUserName", new StringType());

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    public List<AIOOrderBranchDetailDTO> getBranchDetails(Long id) {
        String sql = "select " +
                "aobd.ORDER_BRANCH_DETAIL_ID orderBranchDetailId, " +
                "aobd.ORDER_BRANCH_ID orderBranchId, " +
                "aobd.TYPE type, " +
                "aobd.STATUS status, " +
                "aobd.GOODS_ID goodsId, " +
                "aobd.GOODS_CODE goodsCode, " +
                "aobd.GOODS_NAME goodsName, " +
                "aobd.MANUFACTURER_NAME manufacturerName, " +
                "aobd.PRODUCING_COUNTRY_NAME producingCountryName, " +
                "aobd.GOODS_UNIT_NAME goodsUnitName, " +
                "aobd.GOODS_UNIT_ID goodsUnitId, " +
                "aobd.SPECIFICATIONS specifications, " +
                "aobd.SUPPLIER supplier, " +
                "aobd.DESCRIPTION description, " +
                "aobd.AMOUNT amount, " +
                "aobd.ORDER_DATE orderDate, " +
                "aobd.AMOUNT_APPROVED amountApproved, " +
                "aobd.TOTAL_AMOUNT totalAmount, " +
                "aobd.TOTAL_AMOUNT_APPROVED totalAmountApproved " +
//                "aobd.UPDATE_USER updateUser, " +
//                "aobd.UPDATE_DATE updateDate, " +
//                "aobd.UPDATE_DESCRIPTION updateDescription " +
                "FROM AIO_ORDER_BRANCH_DETAIL aobd " +
                "where aobd.ORDER_BRANCH_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", id);
        query.setResultTransformer(Transformers.aliasToBean(AIOOrderBranchDetailDTO.class));
        query.addScalar("orderBranchDetailId", new LongType());
        query.addScalar("orderBranchId", new LongType());
        query.addScalar("type", new LongType());
        query.addScalar("status", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("manufacturerName", new StringType());
        query.addScalar("producingCountryName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("specifications", new StringType());
        query.addScalar("supplier", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("orderDate", new DateType());
        query.addScalar("amountApproved", new DoubleType());
        query.addScalar("totalAmount", new LongType());
        query.addScalar("totalAmountApproved", new LongType());
//        query.addScalar("updateUser", new LongType());
//        query.addScalar("updateDate", new DateType());
//        query.addScalar("updateDescription", new StringType());

        return query.list();
    }

    public int updateStatusOrderBranch(List<Long> orderIds, Long status) {
        String sql = "update aio_order_branch set " +
                "STATUS = :status " +
                "where order_branch_id in (:orderIds) ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("status", status);
        query.setParameterList("orderIds", orderIds);

        return query.executeUpdate();
    }

    public int updateStatusOrderBranchDetailEach(Long detailId, Long status, String cancelMsg) {
        String sql = "update AIO_ORDER_BRANCH_DETAIL set " +
                "CANCEL_DESCRIPTION_COMPANY = :cancelMsg, " +
                "STATUS = :status " +
                "where ORDER_BRANCH_DETAIL_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("cancelMsg", cancelMsg, new StringType());
        query.setParameter("status", status);
        query.setParameter("id", detailId);

        return query.executeUpdate();
    }

    public int updateStatusOrderBranchDetail(List<Long> requestIds, Long status, String cancelMsg) {
        String sql = "update AIO_ORDER_BRANCH_DETAIL set " +
                "CANCEL_DESCRIPTION_COMPANY = :cancelMsg, " +
                "STATUS = :status " +
                "where ORDER_BRANCH_ID in (:ids) ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("cancelMsg", cancelMsg, new StringType());
        query.setParameter("status", status);
        query.setParameterList("ids", requestIds);

        return query.executeUpdate();
    }

    public List<Long> getOrderRequestIdFromDetails(List<Long> idDetails) {
        String sql = "select distinct order_request_id orderRequestId " +
                "from aio_order_request_detail " +
                "where ORDER_REQUEST_DETAIL_ID in (:idList) ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameterList("idList", idDetails);
        query.addScalar("orderRequestId", new LongType());

        return query.list();
    }

    public List<Long> getOrderRequestDetailIdFromBranch(List<Long> idsBranch) {
        String sql = "select order_request_detail_id orderRequestDetailId " +
                "from aio_order_branch_detail " +
                "where order_branch_id in (:idsBranch) ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameterList("idsBranch", idsBranch);
        query.addScalar("orderRequestDetailId", new LongType());

        return query.list();
    }

    public int updateOrderInRequest(List<Long> idList, String table) {
        String idField = table.substring(4) + "_ID";
        String sql = "update " + table + " set " +
                "in_request = 1 " +
                "where " + idField + " in (:idList) ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameterList("idList", idList);

        return query.executeUpdate();
    }
    
    //Huypq-20190922-start
    public List<AIOOrderBranchDetailDTO> getDataGoodsOrderBranch(GoodsDTO obj){
    	StringBuilder sql = new StringBuilder(" select GOODS_ID goodsId, " + 
    			" CODE goodsCode, " + 
    			" name goodsName, " + 
    			" MANUFACTURER_NAME manufacturerName, " +
    			" PRODUCING_COUNTRY_NAME producingCountryName, " +
    			" UNIT_TYPE goodsUnitId, " +
    			" UNIT_TYPE_NAME goodsUnitName, " +
    			" DESCRIPTION description " + 
    			" from goods " +
    			" where STATUS=1 " +
    			" and IS_AIO=1 ");
    	
    	if(StringUtils.isNotBlank(obj.getKeySearch())) {
    		sql.append(" AND (upper(CODE) like upper(:keySearch) escape '&' OR upper(NAME) like upper(:keySearch) escape '&' ) ");
    	}
    	
    	if(obj.getListGoodsCode()!=null && obj.getListGoodsCode().size()>0) {
    		sql.append(" AND CODE not in (:listGoodsCode) ");
    	}
    	
    	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        
    	query.addScalar("goodsId", new LongType());
    	query.addScalar("goodsCode", new StringType());
    	query.addScalar("goodsName", new StringType());
    	query.addScalar("manufacturerName", new StringType());
    	query.addScalar("description", new StringType());
    	query.addScalar("producingCountryName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("goodsUnitId", new LongType());
    	
    	query.setResultTransformer(Transformers.aliasToBean(AIOOrderBranchDetailDTO.class));
    	
    	if(StringUtils.isNotBlank(obj.getKeySearch())) {
    		query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        	queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
    	}
    	
    	if(obj.getListGoodsCode()!=null && obj.getListGoodsCode().size()>0) {
    		query.setParameterList("listGoodsCode", obj.getListGoodsCode());
    		queryCount.setParameterList("listGoodsCode", obj.getListGoodsCode());
    	}
    	
    	this.setPageSize(obj, query, queryCount);
    	
    	return query.list();
    }
    
    //Lấy mã yêu cầu phần chi nhánh
    public List<AIOOrderBranchDetailDTO> getDataRequestOrder(AIOOrderBranchDetailDTO obj){
    	StringBuilder sql = new StringBuilder(" SELECT DISTINCT aor.REQUEST_CODE requestCode, " + 
    			"aord.ORDER_REQUEST_DETAIL_ID orderRequestDetailId, " + 
    			"aord.ORDER_REQUEST_ID orderRequestId, " + 
    			"aord.GOODS_ID goodsId, " + 
    			"aord.GOODS_CODE goodsCode, " + 
    			"aord.GOODS_NAME goodsName, " + 
    			"aord.MANUFACTURER_NAME manufacturerName, " + 
    			"aord.PRODUCING_COUNTRY_NAME producingCountryName, " + 
    			"aord.GOODS_UNIT_NAME goodsUnitName, " + 
    			"aord.GOODS_UNIT_ID goodsUnitId, " + 
    			"aord.DESCRIPTION description, " + 
    			"aord.SPECIFICATIONS specifications, " + 
    			"aord.TYPE type, " + 
    			"aord.AMOUNT_APPROVED amount, " + 
    			"aord.TOTAL_AMOUNT_APPROVED totalAmount " + 
    			"FROM AIO_ORDER_REQUEST aor " + 
    			"LEFT JOIN AIO_ORDER_REQUEST_DETAIL aord " + 
    			"ON aor.ORDER_REQUEST_ID               = aord.ORDER_REQUEST_ID " + 
    			"WHERE aor.STATUS                      =1 " + 
    			"AND aord.IS_PROVINCE_BOUGHT           = :isBought " + 
    			"AND aord.ORDER_REQUEST_DETAIL_ID NOT IN " + 
    			"  (SELECT ORDER_REQUEST_detail_ID " + 
    			"   FROM AIO_ORDER_BRANCH_DETAIL_REQUEST " + //Huypq-20190923-edit
    			"   where ORDER_REQUEST_detail_ID is not null ) " +
                "   AND aord.AMOUNT_APPROVED > 0 " +
    			"   AND aord.GOODS_CODE is not null ");
    	
    	if(StringUtils.isNotBlank(obj.getKeySearch())) {
    		sql.append(" and (upper(aord.GOODS_CODE) like upper(:keySearch) escape '&' OR upper(aord.GOODS_NAME) like upper(:keySearch) escape '&' ) ");
    	}
    	
    	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        
        query.addScalar("requestCode", new StringType());
        query.addScalar("orderRequestDetailId", new LongType());
        query.addScalar("orderRequestId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("manufacturerName", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("specifications", new StringType());
        query.addScalar("type", new LongType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("producingCountryName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("totalAmount", new LongType());
        
        query.setResultTransformer(Transformers.aliasToBean(AIOOrderBranchDetailDTO.class));
        
        query.setParameter("isBought", obj.getIsProvinceBought());
    	queryCount.setParameter("isBought", obj.getIsProvinceBought());
        
        if(StringUtils.isNotBlank(obj.getKeySearch())) {
        	query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        	queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        
        this.setPageSize(obj, query, queryCount);
        
        return query.list();
    }
    
    public List<AIOOrderBranchDetailDTO> getDataBranchWhenEdit(Long id){
    	StringBuilder sql = new StringBuilder(" select abr.ORDER_REQUEST_ID orderRequestId, " + 
    			"abr.ORDER_REQUEST_DETAIL_ID orderRequestDetailId, " + 
    			"aor.REQUEST_CODE requestCode, " + 
    			"abr.ORDER_BRANCH_ID orderBranchId, " + 
    			"abr.ORDER_BRANCH_DETAIL_ID orderBranchDetailId, " + 
    			"abd.type type, " + 
    			"abd.STATUS status, " + 
//    			"aord.GOODS_ID goodsId, " + 
//    			"aord.GOODS_CODE goodsCode, " + 
//    			"aord.GOODS_NAME goodsName, " + 
//    			"aord.MANUFACTURER_NAME manufacturerName, " + 
//    			"aord.PRODUCING_COUNTRY_NAME producingCountryName, " + 
//    			"aord.GOODS_UNIT_ID goodsUnitId, " + 
//    			"aord.GOODS_UNIT_NAME goodsUnitName, " + 
				" gd.GOODS_ID goodsId," + 
				" gd.CODE goodsCode,  " + 
				" gd.NAME goodsName,  " + 
				" gd.MANUFACTURER_NAME manufacturerName,  " + 
				" gd.PRODUCING_COUNTRY_NAME producingCountryName,  " + 
				" gd.UNIT_TYPE goodsUnitId,  " + 
				" gd.UNIT_TYPE_NAME goodsUnitName,    "+
    			"aord.SPECIFICATIONS specifications, " + 
    			"abd.SUPPLIER supplier, " + 
    			"abr.AMOUNT amount, " + 
    			"abr.TOTAL_AMOUNT totalAmount, " + 
    			"aord.DESCRIPTION description " + 
    			"from  " + 
    			"AIO_ORDER_BRANCH_DETAIL_REQUEST abr " + 
    			"left join AIO_ORDER_BRANCH_DETAIL abd " + 
    			"on abr.ORDER_BRANCH_DETAIL_ID = abd.ORDER_BRANCH_DETAIL_ID " + 
    			"left join AIO_ORDER_REQUEST aor " + 
    			"on abr.ORDER_REQUEST_ID = aor.ORDER_REQUEST_ID " + 
    			"left join AIO_ORDER_REQUEST_DETAIL aord " + 
    			"on aord.ORDER_REQUEST_DETAIL_ID = abr.ORDER_REQUEST_DETAIL_ID " + 
    			" left join CTCT_CAT_OWNER.GOODS gd on gd.GOODS_ID = abr.GOODS_ID "+
    			"where abr.ORDER_BRANCH_ID = :orBranchId");
    	SQLQuery query = getSession().createSQLQuery(sql.toString());
    	query.addScalar("orderRequestId", new LongType());
    	query.addScalar("orderRequestDetailId", new LongType());
    	query.addScalar("requestCode", new StringType());
    	query.addScalar("orderBranchId", new LongType());
    	query.addScalar("orderBranchDetailId", new LongType());
    	query.addScalar("type", new LongType());
    	query.addScalar("status", new LongType());
    	query.addScalar("goodsId", new LongType());
    	query.addScalar("goodsCode", new StringType());
    	query.addScalar("goodsName", new StringType());
    	query.addScalar("manufacturerName", new StringType());
    	query.addScalar("producingCountryName", new StringType());
    	query.addScalar("goodsUnitId", new LongType());
    	query.addScalar("goodsUnitName", new StringType());
    	query.addScalar("specifications", new StringType());
    	query.addScalar("supplier", new StringType());
    	query.addScalar("amount", new DoubleType());
    	query.addScalar("totalAmount", new LongType());
    	query.addScalar("description", new StringType());
    	
    	query.setResultTransformer(Transformers.aliasToBean(AIOOrderBranchDetailDTO.class));
    	
    	query.setParameter("orBranchId", id);
    	
    	return query.list();
    }
    
    public void deleteOrderBranch(Long id) {
    	StringBuilder sql1 = new StringBuilder(" delete from AIO_ORDER_BRANCH_DETAIL where ORDER_BRANCH_ID=:id ");
    	StringBuilder sql2 = new StringBuilder(" delete from AIO_ORDER_BRANCH_DETAIL_REQUEST where ORDER_BRANCH_ID=:id ");
    
    	SQLQuery query1 = getSession().createSQLQuery(sql1.toString());
    	SQLQuery query2 = getSession().createSQLQuery(sql2.toString());
    	
    	query1.setParameter("id", id);
    	query2.setParameter("id", id);
    	
    	query1.executeUpdate();
    	query2.executeUpdate();
    }
    //Huy-end

    public int updateApproveOrderBranchDetail(AIOOrderBranchDetailDTO detailDTO) {
        String sql = "update AIO_ORDER_BRANCH_DETAIL " +
                "set " +
                "STATUS = 2, " +
                "AMOUNT_APPROVED = :amountApproved, " +
                "TOTAL_AMOUNT_APPROVED = :totalAmountApproved, " +
                "ORDER_DATE = :orderDate, " +
                "DESCRIPTION = :description, " +
                "UPDATE_USER = :updateUser, " +
                "UPDATE_DATE = sysdate " +
                "where ORDER_BRANCH_DETAIL_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("amountApproved", detailDTO.getAmountApproved());
        query.setParameter("totalAmountApproved", detailDTO.getTotalAmountApproved());
        query.setParameter("orderDate", detailDTO.getOrderDate());
        query.setParameter("updateUser", detailDTO.getUpdateUser());
        query.setParameter("description", detailDTO.getDescription());
        query.setParameter("id", detailDTO.getOrderBranchDetailId());

        return query.executeUpdate();
    }

    public int updateStatusOrderBranch(Long id, Long status) {
        String sql = "update AIO_ORDER_BRANCH set " +
                "STATUS = " + status +
                "where ORDER_BRANCH_ID = " + id;

        SQLQuery query = this.getSession().createSQLQuery(sql);
        return query.executeUpdate();
    }
    
    //Huypq-20190923-start Lấy mã yêu cầu phần công ty
    public List<AIOOrderBranchDetailDTO> getDataCompanyGoods(AIOOrderBranchDetailDTO obj){
    	StringBuilder sql = new StringBuilder(" SELECT DISTINCT aob.ORDER_BRANCH_CODE requestCode, aobd.ORDER_BRANCH_DETAIL_ID orderBranchDetailId, " + 
    			"  aobd.ORDER_BRANCH_ID orderBranchId, " + 
    			"  aobd.TYPE type, " + 
    			"  aobd.STATUS status, " + 
    			"  aobd.GOODS_ID goodsId, " + 
    			"  aobd.GOODS_CODE goodsCode, " + 
    			"  aobd.GOODS_NAME goodsName, " + 
    			"  aobd.MANUFACTURER_NAME manufacturerName, " + 
    			"  aobd.PRODUCING_COUNTRY_NAME producingCountryName, " + 
    			"  aobd.GOODS_UNIT_NAME goodsUnitName, " + 
    			"  aobd.GOODS_UNIT_ID goodsUnitId, " + 
    			"  aobd.SPECIFICATIONS specifications, " + 
    			"  aobd.DESCRIPTION description, " + 
    			"  aobd.AMOUNT amount, " + 
    			"  aobd.TOTAL_AMOUNT totalAmount " + 
    			"FROM AIO_ORDER_Branch_DETAIL aobd " + 
    			"LEFT JOIN AIO_ORDER_BRANCH aob " + 
    			"ON aobd.ORDER_BRANCH_ID              = aob.ORDER_BRANCH_ID " + 
    			"WHERE aob.STATUS                     =2 " + 
    			"AND aobd.ORDER_BRANCH_DETAIL_ID NOT IN " + 
    			"  (SELECT aocd.ORDER_BRANCH_DETAIL_ID FROM AIO_ORDER_COMPANY_DETAIL aocd " + 
    			"	left join AIO_ORDER_COMPANY aoc on aocd.ORDER_COMPANY_ID = aoc.ORDER_COMPANY_ID " + 
    			"	where aoc.STATUS=1 and aocd.ORDER_BRANCH_DETAIL_ID is not null " + 
    			"  ) ");
    	
    	if(StringUtils.isNotBlank(obj.getKeySearch())) {
    		sql.append(" and (upper(aocd.GOODS_CODE) like upper(:keySearch) escape '&' OR upper(aocd.GOODS_NAME) like upper(:keySearch) escape '&' ) ");
    	}
    	
    	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
    	query.addScalar("orderBranchDetailId", new LongType());
    	query.addScalar("orderBranchId", new LongType());
    	query.addScalar("type", new LongType());
    	query.addScalar("status", new LongType());
    	query.addScalar("goodsId", new LongType());
    	query.addScalar("goodsCode", new StringType());
    	query.addScalar("goodsName", new StringType());
    	query.addScalar("manufacturerName", new StringType());
    	query.addScalar("producingCountryName", new StringType());
    	query.addScalar("goodsUnitName", new StringType());
    	query.addScalar("goodsUnitId", new LongType());
    	query.addScalar("specifications", new StringType());
    	query.addScalar("description", new StringType());
    	query.addScalar("amount", new DoubleType());
    	query.addScalar("totalAmount", new LongType());
    	query.addScalar("requestCode", new StringType());
    	
    	query.setResultTransformer(Transformers.aliasToBean(AIOOrderBranchDetailDTO.class));
    	
    	if(StringUtils.isNotBlank(obj.getKeySearch())) {
        	query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        	queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        
        this.setPageSize(obj, query, queryCount);
        
        return query.list();
    	
    }
    
    public void deleteOrderCompany(Long id, Long userId) {
    	StringBuilder sql1 = new StringBuilder(" delete from AIO_ORDER_COMPANY_DETAIL where ORDER_COMPANY_ID=:id ");
    	StringBuilder sql2 = new StringBuilder(" UPDATE AIO_ORDER_COMPANY set update_date=sysdate,update_User=:user where ORDER_COMPANY_ID=:id ");
    
    	SQLQuery query1 = getSession().createSQLQuery(sql1.toString());
    	SQLQuery query2 = getSession().createSQLQuery(sql2.toString());
    	
    	query1.setParameter("id", id);
    	query2.setParameter("user", userId);
    	query2.setParameter("id", id);
    	
    	query1.executeUpdate();
    	query2.executeUpdate();
    }
    
    public List<AIOOrderCompanyDetailDTO> getDataCompanyWhenEdit(Long id){
    	StringBuilder sql = new StringBuilder(" SELECT ");
    	sql.append("ORDER_COMPANY_DETAIL_ID orderCompanyDetailId, ")
    	.append("ORDER_COMPANY_ID orderCompanyId, ")
    	.append("ORDER_BRANCH_ID orderBranchId, ")
    	.append("ORDER_BRANCH_DETAIL_ID orderBranchDetailId, ")
    	.append("TYPE type, ")
    	.append("IS_PROVINCE_BOUGHT isProvinceBought, ")
    	.append("STATUS status, ")
    	.append("GOODS_ID goodsId, ")
    	.append("GOODS_CODE goodsCode, ")
    	.append("GOODS_NAME goodsName, ")
    	.append("MANUFACTURER_NAME manufacturerName, ")
    	.append("PRODUCING_COUNTRY_NAME producingCountryName, ")
    	.append("GOODS_UNIT_NAME goodsUnitName, ")
    	.append("GOODS_UNIT_ID goodsUnitId, ")
    	.append("SPECIFICATIONS specifications, ")
    	.append("DESCRIPTION description, ")
    	.append("AMOUNT amount, ")
    	.append("AMOUNT_TOTAL totalAmount, ")
    	.append("ORDER_DATE orderDate from AIO_ORDER_COMPANY_DETAIL where ORDER_COMPANY_ID=:id ");
    	
    	SQLQuery query = getSession().createSQLQuery(sql.toString());
    	
    	query.addScalar("orderCompanyDetailId", new LongType());
    	query.addScalar("orderCompanyId", new LongType());
    	query.addScalar("orderBranchId", new LongType());
    	query.addScalar("orderBranchDetailId", new LongType());
    	query.addScalar("type", new LongType());
    	query.addScalar("isProvinceBought", new LongType());
    	query.addScalar("status", new LongType());
    	query.addScalar("goodsId", new LongType());
    	query.addScalar("goodsCode", new StringType());
    	query.addScalar("goodsName", new StringType());
    	query.addScalar("manufacturerName", new StringType());
    	query.addScalar("producingCountryName", new StringType());
    	query.addScalar("goodsUnitName", new StringType());
    	query.addScalar("goodsUnitId", new LongType());
    	query.addScalar("specifications", new StringType());
    	query.addScalar("description", new StringType());
    	query.addScalar("amount", new DoubleType());
    	query.addScalar("orderDate", new DateType());
    	query.addScalar("totalAmount", new LongType());
    	
    	query.setResultTransformer(Transformers.aliasToBean(AIOOrderCompanyDetailDTO.class));
    	
    	query.setParameter("id", id);
    	
    	return query.list();
    }
    //Huy-end
}
