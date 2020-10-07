package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOAreaBO;
import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

//VietNT_20190506_create
@EnableTransactionManagement
@Transactional
@Repository("aioAreaDAO")
public class AIOAreaDAO extends BaseFWDAOImpl<AIOAreaBO, Long> {

    public AIOAreaDAO() {
        this.model = new AIOAreaBO();
    }

    public AIOAreaDAO(Session session) {
        this.session = session;
    }


    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOAreaDTO> doSearch(AIOAreaDTO criteria) {
        String condition = StringUtils.EMPTY;
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            condition = "AND (upper(name) like upper(:keySearch) escape '&' "
                    + "or upper(AREA_NAME_LEVEL2) like upper(:keySearch) escape '&' "
                    + "or upper(AREA_NAME_LEVEL3) like upper(:keySearch) escape '&') ";
        } else if (criteria.getAreaId() != null) {
            condition = "AND aa.AREA_ID = :id ";
        } else {
            if (criteria.getAreaLevel() != null && criteria.getParentId() != null) {
                if (criteria.getAreaLevel().equals("2")) {
                    condition = "and to_number((substr(aa.path, INSTR(aa.path, '/', 1, 2) + 1, INSTR(aa.path, '/', 1, 3) - (INSTR(aa.path, '/', 1, 2) + 1)))) = :parentId ";
                } else if (criteria.getAreaLevel().equals("3")) {
                    condition = "and to_number((substr(aa.path, INSTR(aa.path, '/', 1, 3) + 1, INSTR(aa.path, '/', 1, 4) - (INSTR(aa.path, '/', 1, 3) + 1)))) = :parentId ";
                } else {
                    condition = "and aa.parent_id = :parentId ";
                }
            }
        }

        StringBuilder sql = new StringBuilder("SELECT ")
                .append("aa.AREA_ID areaId, ")
                .append("aa.CODE code, ")
                .append("aa.NAME name, ")
                .append("aa.PARENT_ID parentId, ")
                .append("aa.STATUS status, ")
//                .append("PATH path, ")
//                .append("EFFECT_DATE effectDate, ")
//                .append("END_DATE endDate, ")
                .append("aa.AREA_NAME_LEVEL1 areaNameLevel1, ")
                .append("aa.AREA_NAME_LEVEL2 areaNameLevel2, ")
                .append("aa.AREA_NAME_LEVEL3 areaNameLevel3, ")
                .append("aa.AREA_ORDER areaOrder, ")
                .append("aa.AREA_LEVEL areaLevel, ")
                .append("aa.SYS_USER_ID sysUserId, ")
                .append("aa.EMPLOYEE_CODE employeeCode, ")
                .append("aa.FULL_NAME fullName, ")
                //VietNT_12/08/2019_start
                .append("aa.sale_SYS_USER_ID saleSysUserId, ")
                .append("aa.sale_EMPLOYEE_CODE saleEmployeeCode, ")
                .append("aa.sale_FULL_NAME saleFullName, ")
                //VietNT_end
                .append("aa.PROVINCE_ID provinceId ")
                .append("FROM AIO_AREA aa ")
                .append("WHERE aa.STATUS = 1 and aa.AREA_LEVEL = 4 ")
                .append(condition);

        sql.append("ORDER BY aa.PARENT_ID, aa.AREA_ORDER ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        } else if (criteria.getAreaId() != null) {
            query.setParameter("id", criteria.getAreaId());
            queryCount.setParameter("id", criteria.getAreaId());
        } else {
            if (criteria.getParentId() != null && criteria.getAreaLevel() != null) {
                query.setParameter("parentId", criteria.getParentId());
                queryCount.setParameter("parentId", criteria.getParentId());
            }
        }
        query.setResultTransformer(Transformers.aliasToBean(AIOAreaDTO.class));

        query.addScalar("areaId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("parentId", new LongType());
        query.addScalar("status", new StringType());
//        query.addScalar("path", new StringType());
//        query.addScalar("effectDate", new DateType());
//        query.addScalar("endDate", new DateType());
        query.addScalar("areaNameLevel1", new StringType());
        query.addScalar("areaNameLevel2", new StringType());
        query.addScalar("areaNameLevel3", new StringType());
        query.addScalar("areaOrder", new StringType());
        query.addScalar("areaLevel", new StringType());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("provinceId", new LongType());
        query.addScalar("saleSysUserId", new LongType());
        query.addScalar("saleEmployeeCode", new StringType());
        query.addScalar("saleFullName", new StringType());

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    @SuppressWarnings("Duplicates")
    public List<AIOAreaDTO> doSearchTree(AIOAreaDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("aa.AREA_ID areaId, ")
                .append("aa.CODE code, ")
                .append("aa.NAME name, ")
                .append("aa.AREA_LEVEL areaLevel, ")
                .append("aa.PARENT_ID parentId ")
                .append("FROM AIO_AREA aa ")
                .append("WHERE aa.STATUS = 1 ");

        if (criteria.getAreaLevel() != null) {
            sql.append("AND aa.AREA_LEVEL = :level ");
        }

        if (criteria.getParentId() != null) {
            sql.append("AND aa.PARENT_ID = :parentId ");
        }

        sql.append("ORDER BY aa.PARENT_ID, aa.AREA_ORDER ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());

        if (criteria.getAreaLevel() != null) {
            query.setParameter("level", criteria.getAreaLevel());
        }

        if (criteria.getParentId() != null) {
            query.setParameter("parentId", criteria.getParentId());
        }
        query.setResultTransformer(Transformers.aliasToBean(AIOAreaDTO.class));

        query.addScalar("areaId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("areaLevel", new StringType());
        query.addScalar("parentId", new LongType());

        return query.list();
    }

    public int updatePerformer(AIOAreaDTO dto) {
        StringBuilder sql = new StringBuilder("UPDATE AIO_AREA SET ");
        if (dto.getTypePerformer() == 1) {
            sql.append("SYS_USER_ID = :id, ")
                    .append("EMPLOYEE_CODE = :code, ")
                    .append("FULL_NAME = :name ");
        } else {
            sql.append("SALE_SYS_USER_ID = :id, ")
                    .append("SALE_EMPLOYEE_CODE = :code, ")
                    .append("SALE_FULL_NAME = :name ");
        }
        sql.append("WHERE AREA_ID in (:idList) ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("id", dto.getSysUserId());
        query.setParameter("code", dto.getEmployeeCode());
        query.setParameter("name", dto.getFullName());
        query.setParameterList("idList", dto.getAreaIds());

        return query.executeUpdate();
    }

    public int updatePerformerBoth(AIOAreaDTO dto) {
        StringBuilder sql = new StringBuilder("UPDATE AIO_AREA SET ")
                .append("SYS_USER_ID = :id, ")
                .append("EMPLOYEE_CODE = :code, ")
                .append("FULL_NAME = :name, ")
                .append("SALE_SYS_USER_ID = :saleId, ")
                .append("SALE_EMPLOYEE_CODE = :saleCode, ")
                .append("SALE_FULL_NAME = :saleName ")
                .append("WHERE AREA_ID in (:idList) ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("id", dto.getSysUserId());
        query.setParameter("code", dto.getEmployeeCode());
        query.setParameter("name", dto.getFullName());
        query.setParameter("saleId", dto.getSaleSysUserId());
        query.setParameter("saleCode", dto.getSaleEmployeeCode());
        query.setParameter("saleName", dto.getSaleFullName());
        query.setParameterList("idList", dto.getAreaIds());

        return query.executeUpdate();
    }

//    public AIOAreaDTO getById(Long id) {
//        StringBuilder sql = new StringBuilder("SELECT ")
//                .append("AREA_ID areaId ")
//                .append("FROM AIO_AREA ")
//                .append("WHERE AREA_ID = :id ")
//                .append("and STATUS = 1 ")
//                .append("and AREA_LEVEL = 4 ");
//
//        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
//        query.setResultTransformer(Transformers.aliasToBean(AIOAreaDTO.class));
//        query.setParameter("id", id);
//
//        query.addScalar("areaId", new LongType());
//
//        List<AIOAreaDTO> list = query.list();
//        if (!list.isEmpty()) {
//            return list.get(0);
//        }
//        return null;
//    }

    public Long checkIdExist(Long id) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("AREA_ID areaId ")
                .append("FROM AIO_AREA ")
                .append("WHERE AREA_ID = :id ")
                .append("and STATUS = 1 ")
                .append("and AREA_LEVEL = 4 ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.addScalar("areaId", new LongType());

        return (Long) query.uniqueResult();
    }
}
