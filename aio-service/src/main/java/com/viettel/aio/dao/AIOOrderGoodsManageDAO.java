package com.viettel.aio.dao;

import com.viettel.aio.dto.AIOOrderBranchDetailDTO;
import com.viettel.aio.dto.AIOOrderRequestDTO;
import com.viettel.aio.dto.AIOOrderRequestDetailDTO;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.DepartmentDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
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

//VietNT_20190819_create
@EnableTransactionManagement
@Transactional
@Repository("aioOrderGoodsManageDAO")
public class AIOOrderGoodsManageDAO extends BaseFWDAOImpl<BaseFWModelImpl, Long> {

    public AIOOrderGoodsManageDAO() { }

    public AIOOrderGoodsManageDAO(Session session) {
        this.session = session;
    }

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOOrderRequestDTO> getListOrderGoods(AIOOrderRequestDTO criteria, Long sysUserId) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("rq.ORDER_REQUEST_ID orderRequestId, ")
                .append("rq.REQUEST_CODE requestCode, ")
                .append("rq.STATUS status, ")
//                .append("rq.STOCK_ID stockId, ")
                .append("rq.SYS_GROUP_ID sysGroupId, ")
                .append("rq.CREATED_DATE createdDate ")
//                .append("rq.CREATE_BY createBy, ")
//                .append("rq.CANCEL_BY cancelBy, ")
//                .append("rq.CANCEL_DESCRIPTION cancelDescription, ")
                .append(", sg.name sysGroupName ")
                .append("from AIO_ORDER_REQUEST rq " +
                        "left join sys_group sg on sg.sys_group_id = rq.SYS_GROUP_ID ")
                .append("where 1=1 ")
                .append("and rq.CREATE_BY = :sysUserId ");

//        if (criteria.getStatus() != null) {
//            sql.append("and rq.status = :status ");
//        }
//
//        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//            sql.append("and upper(rq.request_code) like upper(:keySearch) escape '&' ");
//        }
        sql.append("order by rq.ORDER_REQUEST_ID desc ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("sysUserId", sysUserId);

//        if (criteria.getStatus() != null) {
//            query.setParameter("status", criteria.getStatus());
//        }
//        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
//        }
        query.setResultTransformer(Transformers.aliasToBean(AIOOrderRequestDTO.class));
        query.addScalar("orderRequestId", new LongType());
        query.addScalar("requestCode", new StringType());
        query.addScalar("status", new LongType());
//        query.addScalar("stockId", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("createdDate", new DateType());
//        query.addScalar("createBy", new LongType());
//        query.addScalar("cancelBy", new LongType());
//        query.addScalar("cancelDescription", new StringType());
        query.addScalar("sysGroupName", new StringType());

        return query.list();
    }

    public List<AIOOrderRequestDetailDTO> getOrderDetail(Long id) {
        String sql = "SELECT " +
                "rd.ORDER_REQUEST_DETAIL_ID orderRequestDetailId, " +
                "rd.ORDER_REQUEST_ID orderRequestId, " +
                "rd.STATUS status, " +
                "rd.DESCRIPTION_COMPANY descriptionCompany, " +
                "rd.GOODS_ID goodsId, " +
                "rd.GOODS_CODE goodsCode, " +
                "rd.GOODS_NAME goodsName, " +
                "rd.TYPE type, " +
                "rd.MANUFACTURER_NAME manufacturerName, " +
                "rd.PRODUCING_COUNTRY_NAME producingCountryName, " +
                "rd.GOODS_UNIT_NAME goodsUnitName, " +
                "rd.GOODS_UNIT_ID goodsUnitId, " +
                "rd.SPECIFICATIONS specifications, " +
                "rd.DESCRIPTION description, " +
                "rd.AMOUNT amount, " +
                "rd.AMOUNT_APPROVED amountApproved, " +
                "rd.TOTAL_AMOUNT_APPROVED totalAmountApproved, " +
                "rd.IS_PROVINCE_BOUGHT isProvinceBought, " +
                "rd.UPDATE_USER updateUser, " +
                "rd.UPDATE_DATE updateDate, " +
                "rd.ORDER_DATE orderDate, " +
                "r.status statusOrder " +
                "FROM AIO_ORDER_REQUEST_DETAIL rd " +
                "left join AIO_ORDER_REQUEST r on r.ORDER_REQUEST_ID = rd.ORDER_REQUEST_ID " +
                "where rd.ORDER_REQUEST_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", id);
        query.setResultTransformer(Transformers.aliasToBean(AIOOrderRequestDetailDTO.class));
        query.addScalar("orderRequestDetailId", new LongType());
        query.addScalar("orderRequestId", new LongType());
        query.addScalar("status", new LongType());
        query.addScalar("descriptionCompany", new StringType());
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
        query.addScalar("amountApproved", new DoubleType());
        query.addScalar("totalAmountApproved", new LongType());
        query.addScalar("isProvinceBought", new LongType());
        query.addScalar("updateUser", new LongType());
        query.addScalar("updateDate", new DateType());
        query.addScalar("orderDate", new DateType());
        query.addScalar("statusOrder", new LongType());

        return query.list();
    }

    public List<AIOOrderRequestDetailDTO> getGoodsList() {
        String sql = "select " +
                "goods_id goodsId, " +
                "code goodsCode, " +
                "name goodsName, " +
                "unit_type goodsUnitId, " +
                "unit_type_name goodsUnitName, " +
                "MANUFACTURER_NAME manufacturerName, " +
                "PRODUCING_COUNTRY_NAME producingCountryName " +
//                "is_serial isSerial " +
                "from goods where is_aio = 1 and status = 1 ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOOrderRequestDetailDTO.class));
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("manufacturerName", new StringType());
        query.addScalar("producingCountryName", new StringType());
//        query.addScalar("isSerial", new StringType());

        return query.list();
    }

    public DepartmentDTO getSysGroupLv2(Long sysUserId) {
        String sql = "select " +
                "SYS_GROUP_ID sysGroupId, " +
                "CODE code, " +
                "NAME name " +
                "from SYS_GROUP where SYS_GROUP_ID = (select " +
                "TO_NUMBER((substr(sg.path, INSTR(sg.path, '/', 1, 2) + 1, INSTR(sg.path, '/', 1, 2 + 1) - (INSTR(sg.path, '/', 1, 2) + 1)))) sysGroupId " +
                "from sys_Group sg " +
                "where sg.sys_group_id = (select sys_group_id from sys_user where sys_user_id = :sysUserId)) ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.setParameter("sysUserId", sysUserId);
        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (DepartmentDTO) list.get(0);
        }
        return null;
    }

    // order request NV
    // approve denied
    public List<AIOOrderRequestDTO> doSearchOrderRequestNV(AIOOrderRequestDTO criteria, List<String> idList) {
        String joinDetail = StringUtils.EMPTY;
        String conditionGoodsCode = StringUtils.EMPTY;
        String queryExcel = StringUtils.EMPTY;
        if (StringUtils.isNotEmpty(criteria.getGoodsCode()) || criteria.getMessageColumn() > 0) {
            joinDetail = "left join aio_order_request_detail rd on rq.order_request_id = rd.ORDER_REQUEST_ID ";
            if (StringUtils.isNotEmpty(criteria.getGoodsCode())) {
                conditionGoodsCode = "and rd.goods_code = :goodsCode ";
            }
            if (criteria.getMessageColumn() > 0) {
                joinDetail += "left join sys_group sg3 on rq.SYS_GROUP_LEVEL_3 = sg3.SYS_GROUP_ID ";
                queryExcel = ", " +
                        "rd.GOODS_CODE goodsCode, " +
                        "rd.GOODS_NAME goodsName, " +
                        "rd.amount amount, " +
                        "rd.amount_approved amountApproved, " +
                        "sg3.code || '-' || sg3.name sysGroupNameLevel3 ";
            }
        }

        StringBuilder sql = new StringBuilder("select ")
                .append("rq.ORDER_REQUEST_ID orderRequestId, ")
                .append("rq.REQUEST_CODE requestCode, ")
                .append("rq.STATUS status, ")
//                .append("STOCK_ID stockId, ")
                .append("rq.SYS_GROUP_ID sysGroupId, ")
                .append("rq.CREATED_DATE createdDate, ")
                .append("rq.CREATE_BY createBy, ")
//                .append("CANCEL_BY cancelBy, ")
//                .append("CANCEL_DESCRIPTION cancelDescription ")

                .append("sg.code || '-' || sg.name sysGroupName, ")
                .append("to_char(rq.CREATED_DATE, 'HH24:MI') createdDateStr, ")
                .append("su.EMPLOYEE_CODE || '-' || su.full_name sysUserName ")
                .append(queryExcel)

                .append("FROM AIO_ORDER_REQUEST rq ")
                .append("left join sys_user su on rq.create_by = su.sys_user_id ")
                .append("left join sys_group sg on rq.SYS_GROUP_ID = sg.SYS_GROUP_ID ")
                .append(joinDetail)
                .append("where 1=1 ")
                .append(conditionGoodsCode)
//                .append("and rq.sys_group_id in (:idList) ")
                ;

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("AND upper(rq.REQUEST_CODE) like upper(:keySearch) escape '&' ");
        }
        if (criteria.getStatus() != null) {
            sql.append("AND rq.status = :status ");
        }
        if (criteria.getStartDate() != null) {
            sql.append("AND trunc(:dateFrom) <= trunc(rq.CREATED_DATE) ");
        }
        if (criteria.getEndDate() != null) {
            sql.append("AND trunc(:dateTo) >= trunc(rq.CREATED_DATE) ");
        }
        sql.append("order by rq.ORDER_REQUEST_ID desc ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
//        query.setParameterList("idList", idList);
//        queryCount.setParameterList("idList", idList);

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
            query.addScalar("sysGroupNameLevel3", new StringType());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOOrderRequestDTO.class));
        query.addScalar("orderRequestId", new LongType());
        query.addScalar("requestCode", new StringType());
        query.addScalar("status", new LongType());
//        query.addScalar("stockId", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createBy", new LongType());
//        query.addScalar("cancelBy", new LongType());
//        query.addScalar("cancelDescription", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("createdDateStr", new StringType());
        query.addScalar("sysUserName", new StringType());

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    public int updateApproveOrderRequestDetail(AIOOrderRequestDetailDTO detailDTO) {
        String sql = "update AIO_ORDER_REQUEST_DETAIL " +
                "set " +
                "STATUS = 1, " +
                "AMOUNT_APPROVED = :amountApproved, " +
                "TOTAL_AMOUNT_APPROVED = :totalAmountApproved, " +
                "IS_PROVINCE_BOUGHT = :isProvinceBought, " +
                "ORDER_DATE = :orderDate, " +
                "DESCRIPTION = :description, " +
                "UPDATE_USER = :updateUser, " +
                "UPDATE_DATE = sysdate " +
                "where ORDER_REQUEST_DETAIL_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("amountApproved", detailDTO.getAmountApproved());
        query.setParameter("totalAmountApproved", detailDTO.getTotalAmountApproved());
        query.setParameter("isProvinceBought", detailDTO.getIsProvinceBought());
        query.setParameter("orderDate", detailDTO.getOrderDate());
        query.setParameter("updateUser", detailDTO.getUpdateUser());
        query.setParameter("description", detailDTO.getDescription());
        query.setParameter("id", detailDTO.getOrderRequestDetailId());

        return query.executeUpdate();
    }

    public int updateStatusOrderRequest(Long id, Long status) {
        String sql = "update AIO_ORDER_REQUEST set " +
                "STATUS = " + status +
                "where ORDER_REQUEST_ID = " + id;

        SQLQuery query = this.getSession().createSQLQuery(sql);
        return query.executeUpdate();
    }

    public int updateDetailStatusEach(Long detailId, Long status, String cancelMsg) {
        String sql = "update AIO_ORDER_REQUEST_DETAIL set " +
                "CANCEL_DESCRIPTION_BRANCH = :cancelMsg, " +
                "STATUS = :status " +
                "where ORDER_REQUEST_DETAIL_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("cancelMsg", cancelMsg, new StringType());
        query.setParameter("status", status);
        query.setParameter("id", detailId);

        return query.executeUpdate();
    }

    public int updateCompanyDetailStatusEach(Long detailId, Long status, String cancelMsg) {
        String sql = "update AIO_ORDER_REQUEST_DETAIL set " +
                "CANCEL_DESCRIPTION_COMPANY = :cancelMsg, " +
                "STATUS = :status " +
                "where ORDER_REQUEST_DETAIL_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("cancelMsg", cancelMsg, new StringType());
        query.setParameter("status", status);
        query.setParameter("id", detailId);

        return query.executeUpdate();
    }

    public int updateDetailStatusByRequestId(List<Long> requestIds, Long status, String cancelMsg) {
        String sql = "update AIO_ORDER_REQUEST_DETAIL set " +
                "CANCEL_DESCRIPTION_BRANCH = :cancelMsg, " +
                "STATUS = :status " +
                "where ORDER_REQUEST_ID in (:ids) ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("cancelMsg", cancelMsg, new StringType());
        query.setParameter("status", status);
        query.setParameterList("ids", requestIds);

        return query.executeUpdate();
    }

    public int updateDetailStatusByDetailIds(List<Long> detailIds, Long status) {
        String sql = "update AIO_ORDER_REQUEST_DETAIL set " +
                "STATUS = :status " +
                "where ORDER_REQUEST_DETAIL_ID in (:ids) ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("status", status);
        query.setParameterList("ids", detailIds);

        return query.executeUpdate();
    }

    public int updateOrderRequestStatus(List<Long> ids, Long status, String cancelMsg) {
        String sql = "update AIO_ORDER_REQUEST set " +
                "CANCEL_DESCRIPTION = :cancelMsg, " +
                "STATUS = :status " +
                "where ORDER_REQUEST_ID in (:ids) ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("cancelMsg", cancelMsg, new StringType());
        query.setParameter("status", status);
        query.setParameterList("ids", ids);

        return query.executeUpdate();
    }

    public List<AIOOrderRequestDetailDTO> getUnitList() {
        String sql = "select cat_unit_id goodsUnitId, name goodsUnitName from cat_unit ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOOrderRequestDetailDTO.class));
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsUnitName", new StringType());

        return query.list();
    }

    public List<AppParamDTO> getListSupplier() {
        String sql = "select app_param_id appParamId, code, name " +
                "from app_param where par_type = 'SUPPLIER_TYPE' ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));
        query.addScalar("appParamId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());

        return query.list();
    }
}
