package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOWoGoodsBO;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOSysUserDTO;
import com.viettel.aio.dto.AIOWoGoodsDTO;
import com.viettel.aio.dto.AIOWoGoodsDetailDTO;
import com.viettel.aio.dto.AppParamDTO;
import com.viettel.coms.dto.SysUserDetailCOMSDTO;
import com.viettel.coms.utils.ValidateUtils;
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

import java.math.BigDecimal;
import java.util.List;

/**
 * @author hailh10
 */
@Repository("aioWoGoodsDAO")
public class AIOWoGoodsDAO extends BaseFWDAOImpl<AIOWoGoodsBO, Long> {

    public AIOWoGoodsDAO() {
        this.model = new AIOWoGoodsBO();
    }

    public AIOWoGoodsDAO(Session session) {
        this.session = session;
    }

    public List<AIOWoGoodsDTO> doSearch(AIOWoGoodsDTO criteria, List<String> idList) {

        StringBuilder sql = new StringBuilder()
                .append(" SELECT ")
                .append(" T1.WO_GOODS_ID woGoodsId, ")
                .append(" T1.CODE code, ")
                .append(" T1.INDUSTRY_CODE industryCode, ")
                .append(" T1.INDUSTRY_NAME industryName, ")
                .append(" T1.CUSTOMER_NAME customerName, ")
                .append(" T1.CUSTOMER_ADDRESS customerAddress, ")
                .append(" T1.PHONE_NUMBER phoneNumber, ")
                .append(" T1.START_DATE startDate, ")
                .append(" T1.END_DATE endDate, ")
                .append(" T1.STATUS status, ")
                .append(" T1.PERFORMER_GROUP_CODE performerGroupCode, ")
                .append(" pu.employee_code || '-' || pu.full_name performerText, ")
                .append(" cu.employee_code || '-' || cu.full_name createdUserText ")
//                .append(" T1.INDUSTRY_ID industryId, ")
//                .append(" T1.CREATED_USER_NAME createdUserName, ")
//                .append(" T1.PERFORMER_ID performerId, ")
//                .append(" T1.CREATED_DATE createdDate, ")
//                .append(" T1.ACTUAL_END_DATE actualEndDate, ")
//                .append(" T1.PERFORMER_GROUP_ID performerGroupId, ")
//                .append(" T1.KPI kpi, ")
//                .append(" T1.FORM_GUARANTEE_ID formGuaranteeId, ")
                .append(" ,T1.CREATED_USER createdUser ")
                .append(" ,T1.FORM_GUARANTEE_NAME formGuaranteeName ")
                .append(" ,T1.REASON reason ")
                .append(" from AIO_WO_GOODS T1 " +
                        "left join sys_user cu on cu.sys_user_id = T1.CREATED_USER " +
                        "left join sys_user pu on pu.sys_user_id = T1.PERFORMER_ID ")
                .append(" where 1 = 1 ");
        if (idList.size() > 0) {
            sql.append(" and T1.PERFORMER_GROUP_ID in (:idList) ");
        }
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("AND (upper(T1.CODE) like upper(:keySearch) ");
            sql.append("OR upper(T1.INDUSTRY_CODE) like upper(:keySearch) ");
            sql.append("OR upper(T1.CUSTOMER_NAME) like upper(:keySearch) escape '&') ");
        }

        if (criteria.getStartDate() != null) {
            sql.append(" and trunc(T1.START_DATE) >= trunc(:startDate) ");
        }
        if (criteria.getEndDate() != null) {
            sql.append(" and trunc(T1.END_DATE) <= trunc(:endDate) ");
        }
        if (criteria.getPerformerGroupId() != null) {
            sql.append(" and T1.PERFORMER_GROUP_ID = :performerGroupId ");
        }
        if (criteria.getCreatedUser() != null) {
            sql.append(" and t1.CREATED_USER = :createdUser ");
        }
        if (criteria.getStatus() != null) {
            sql.append(" and T1.STATUS = :status ");
        }
        if (criteria.getIndustryId() != null) {
            sql.append(" and T1.INDUSTRY_ID = :industryId ");
        }
        SQLQuery query = this.getSession().createSQLQuery(sql.toString() + " order by T1.WO_GOODS_ID desc ");
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        query.setParameterList("idList", idList);
        queryCount.setParameterList("idList", idList);

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }
        if (criteria.getStartDate() != null) {
            query.setParameter("startDate", criteria.getStartDate());
            queryCount.setParameter("startDate", criteria.getStartDate());
        }
        if (criteria.getEndDate() != null) {
            query.setParameter("endDate", criteria.getEndDate());
            queryCount.setParameter("endDate", criteria.getEndDate());
        }
        if (criteria.getPerformerGroupId() != null) {
            query.setParameter("performerGroupId", criteria.getPerformerGroupId());
            queryCount.setParameter("performerGroupId", criteria.getPerformerGroupId());
        }
        if (criteria.getIndustryId() != null) {
            query.setParameter("industryId", criteria.getIndustryId());
            queryCount.setParameter("industryId", criteria.getIndustryId());
        }
        if (criteria.getStatus() != null) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }
        if (criteria.getCreatedUser() != null) {
            query.setParameter("createdUser", criteria.getCreatedUser());
            queryCount.setParameter("createdUser", criteria.getCreatedUser());
        }
        query.setResultTransformer(Transformers.aliasToBean(AIOWoGoodsDTO.class));
        query.addScalar("woGoodsId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("industryCode", new StringType());
        query.addScalar("industryName", new StringType());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("status", new LongType());
        query.addScalar("performerGroupCode", new StringType());
        query.addScalar("performerText", new StringType());
        query.addScalar("createdUserText", new StringType());
        query.addScalar("createdUser", new LongType());
        query.addScalar("formGuaranteeName", new StringType());
        query.addScalar("reason", new StringType());

//        query.addScalar("industryId", new LongType());
//        query.addScalar("createdUserName", new StringType());
//        query.addScalar("performerId", new LongType());
//        query.addScalar("createdDate", new DateType());
//        query.addScalar("actualEndDate", new DateType());
//        query.addScalar("performerGroupId", new LongType());
//        query.addScalar("kpi", new LongType());
//        query.addScalar("formGuaranteeId", new LongType());

//        query.addScalar("formGuaranteeName", new StringType());
//        query.addScalar("reason", new StringType());
//        query.addScalar("performerName", new StringType());
        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1)
                    * criteria.getPageSize());
            query.setMaxResults(criteria.getPageSize());
        }

        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public List<AIOWoGoodsDetailDTO> getWODetailById(AIOWoGoodsDTO criteria) {
        StringBuilder sql = new StringBuilder()
                .append(" SELECT ")
                .append(" T1.WO_GOODS_DETAIL_ID woGoodsDetailId, ")
                .append(" T1.WO_GOODS_ID woGoodsId, ")
                .append(" T1.GOODS_ID goodsId, ")
                .append(" T1.GOODS_CODE goodsCode, ")
                .append(" T1.GOODS_NAME goodsName, ")
                .append(" T1.QUANTITY quantity ")
                .append(" from AIO_WO_GOODS_DETAIL T1 ")
                .append(" where 1 = 1 and T1.WO_GOODS_ID = :id ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        query.setParameter("id", criteria.getWoGoodsId());
        queryCount.setParameter("id", criteria.getWoGoodsId());

        query.setResultTransformer(Transformers.aliasToBean(AIOWoGoodsDetailDTO.class));
        query.addScalar("woGoodsDetailId", new LongType());
        query.addScalar("woGoodsId", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("quantity", new DoubleType());


        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1)
                    * criteria.getPageSize());
            query.setMaxResults(criteria.getPageSize());
        }

        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public int updateWoGoods(AIOWoGoodsDTO obj) {
        StringBuilder sql = new StringBuilder("update AIO_WO_GOODS  set ")
                .append(" ACTUAL_END_DATE = sysdate , ")
                .append(" FORM_GUARANTEE_ID = :formGuaranteeId ,")
                .append(" FORM_GUARANTEE_NAME = :formGuaranteeName ,")
                .append(" STATUS = :status ,")
                .append(" PERFORMER_ID = :performerId ");
        if (StringUtils.isNotEmpty(obj.getReason())) {
            sql.append(" ,REASON = :reason ");
        }
        sql.append(" where WO_GOODS_ID = :woGoodsId ");


        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("woGoodsId", obj.getWoGoodsId());
        query.setParameter("performerId", obj.getPerformerId());
        query.setParameter("status", obj.getStatus());
        query.setParameter("formGuaranteeName", obj.getFormGuaranteeName());
        query.setParameter("formGuaranteeId", obj.getFormGuaranteeId());
        if (StringUtils.isNotEmpty(obj.getReason())) {
            query.setParameter("reason", obj.getReason());
        }
        return query.executeUpdate();
    }


    @SuppressWarnings("unchecked")
    public List<AIOConfigServiceDTO> getConfigService(AIOWoGoodsDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(
                " select distinct  INDUSTRY_ID industryId,   ")
                .append(" INDUSTRY_CODE industryCode ,")
                .append(" INDUSTRY_NAME industryName ")
                .append(" from AIO_CONFIG_SERVICE where 1 = 1  ");

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append("AND (upper(INDUSTRY_CODE) like upper(:keySearch) ");
            sql.append("OR upper(INDUSTRY_NAME) like upper(:keySearch) escape '&') ");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("industryId", new LongType());
        query.addScalar("industryCode", new StringType());
        query.addScalar("industryName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AIOConfigServiceDTO.class));
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
        }

        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<AppParamDTO> getAppParam() {
        StringBuilder sql = new StringBuilder();
        sql.append(" select app_param_id appParamId,name name ,code code ,TRANSLATE ('Form_guarantee_reject' USING NCHAR_CS) parType  from app_param where par_type = 'Form_guarantee_reject' ")
                .append(" union all ")
                .append(" select app_param_id appParamId,name name ,code code ,TRANSLATE ('Form_guarantee_agree' USING NCHAR_CS) parType from app_param where par_type = 'Form_guarantee_agree' and status != 0 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("parType", new StringType());
        query.addScalar("appParamId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));
        return query.list();
    }

    public List<SysUserDetailCOMSDTO> doSearchPerformer(AIOWoGoodsDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT  ");

        sql.append(" SU.SYS_USER_ID  sysUserId, ");
        sql.append(" SU.LOGIN_NAME AS loginName, ");
        sql.append(" SU.FULL_NAME AS fullName, ");
        sql.append(" SU.EMPLOYEE_CODE AS employeeCode, ");
        sql.append(" SU.EMAIL AS email, ");
        sql.append(" SU.PHONE_NUMBER AS phoneNumber "
                + " FROM SYS_USER SU where 1 = 1 ");
//                "inner join sys_group b on SU.SYS_GROUP_ID=b.SYS_GROUP_ID where 1 = 1 ");

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append("AND (upper(SU.LOGIN_NAME) like upper(:keySearch) ");
            sql.append("OR (upper(SU.EMAIL) like upper(:keySearch) ");
            sql.append("OR upper(SU.FULL_NAME) like upper(:keySearch) escape '&')) ");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(SysUserDetailCOMSDTO.class));
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
            queryCount.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
        }

        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public AIOConfigServiceDTO getIndustryByCode(String industryCode) {
        String sql = "select " +
                "INDUSTRY_ID industryId, " +
                "INDUSTRY_CODE industryCode, " +
                "INDUSTRY_NAME industryName, " +
                "TIME_PERFORM timePerform " +
                "from AIO_CONFIG_SERVICE " +
                "where INDUSTRY_CODE = :industryCode " +
                "group by INDUSTRY_ID, INDUSTRY_CODE, INDUSTRY_NAME, TIME_PERFORM ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOConfigServiceDTO.class));
        query.addScalar("industryId", new LongType());
        query.addScalar("industryCode", new StringType());
        query.addScalar("industryName", new StringType());
        query.addScalar("timePerform", new DoubleType());
        query.setParameter("industryCode", industryCode);

        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (AIOConfigServiceDTO) list.get(0);
        }
        return null;
    }

    public AIOSysUserDTO getPerformerWOGoods(Long contractPerformerGroupId) {
        String sql = "select " +
                "staff.SYS_USER_ID sysUserId, " +
                "su.PHONE_NUMBER phoneNumber, " +
                "(select code from sys_group where sys_group_id = :contractPerformerGroupId) sysGroupLv2Code  " +
                "from aio_staff staff " +
                "left join sys_user su on su.SYS_USER_ID = staff.SYS_USER_ID " +
                "where type = 1 " +
                "and staff.sys_group_id = :contractPerformerGroupId ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOSysUserDTO.class));
        query.addScalar("sysUserId", new LongType());
        query.addScalar("sysGroupLv2Code", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.setParameter("contractPerformerGroupId", contractPerformerGroupId);

        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (AIOSysUserDTO) list.get(0);
        }
        return null;
    }

    public AIOSysUserDTO getUserNameAndProvinceCode(Long sysUserId) {
        String sql = "select " +
                "su.full_name fullName, " +
                "su.employee_code employeeCode, " +
                "(select province_code from sys_group where sys_group_id = su.sys_group_id) text " +
                "from sys_user su " +
                "where sys_user_id = :sysUserId ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOSysUserDTO.class));
        query.addScalar("fullName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("text", new StringType());
        query.setParameter("sysUserId", sysUserId);
        return (AIOSysUserDTO) query.uniqueResult();
    }

    public String getSysUserPhone(Long userId) {
        String sql = "select phone_number from sys_user where sys_user_id = :userId ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("userId", userId);
        query.addScalar("phone_number", new StringType());
        return (String) query.uniqueResult();
    }
}
