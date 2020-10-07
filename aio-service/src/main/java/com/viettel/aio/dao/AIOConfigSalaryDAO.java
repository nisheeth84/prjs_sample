package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOConfigSalaryBO;
import com.viettel.aio.dto.AIOConfigSalaryDTO;
import com.viettel.aio.dto.ComsBaseFWDTO;
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

//VietNT_20191105_create
@EnableTransactionManagement
@Transactional
@Repository("aioConfigSalaryDAO")
public class AIOConfigSalaryDAO extends BaseFWDAOImpl<AIOConfigSalaryBO, Long> {

    public AIOConfigSalaryDAO() {
        this.model = new AIOConfigSalaryBO();
    }

    public AIOConfigSalaryDAO(Session session) {
        this.session = session;
    }


    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOConfigSalaryDTO> doSearch(AIOConfigSalaryDTO criteria) {
        String sql = "SELECT " +
                "CONFIG_SALARY_ID configSalaryId, " +
                "TYPE type, " +
                "OBJECT_TYPE objectType, " +
                "OBJECT_TYPE_NAME objectTypeName, " +
                "MANAGER_CHANNELS managerChannels, " +
                "SALE sale, " +
                "PERFORMER performer, " +
                "STAFF_AIO staffAio, " +
                "MANAGER manager, " +
                "STATUS status " +
//                "CREATED_USER createdUser, " +
//                "CREATED_DATE createdDate, " +
//                "UPDATED_USER updatedUser, " +
//                "UPDATED_DATE updatedDate " +
                "from aio_config_salary " +
                "where 1=1 ";
        if (criteria.getStatus() != null) {
            sql += "and status = :status ";
        }
        if (criteria.getObjectType() != null) {
            sql += "and object_type = :objectType ";
        }
        sql += "order by CONFIG_SALARY_ID desc ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql + ")");

        if (criteria.getStatus() != null) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }
        if (criteria.getObjectType() != null) {
            query.setParameter("objectType", criteria.getObjectType());
            queryCount.setParameter("objectType", criteria.getObjectType());
        }

        query.addScalar("configSalaryId", new LongType());
        query.addScalar("type", new LongType());
        query.addScalar("objectType", new LongType());
        query.addScalar("objectTypeName", new StringType());
        query.addScalar("managerChannels", new DoubleType());
        query.addScalar("sale", new DoubleType());
        query.addScalar("performer", new DoubleType());
        query.addScalar("staffAio", new DoubleType());
        query.addScalar("manager", new DoubleType());
        query.addScalar("status", new LongType());
//        query.addScalar("createdUser", new LongType());
//        query.addScalar("createdDate", new DateType());
//        query.addScalar("updatedUser", new LongType());
//        query.addScalar("updatedDate", new DateType());

        query.setResultTransformer(Transformers.aliasToBean(AIOConfigSalaryDTO.class));

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    public Long countByKey(List<String> keys) {
        String sql = "SELECT count(CONFIG_SALARY_ID) count " +
                "FROM AIO_CONFIG_SALARY " +
                "WHERE STATUS = 1 " +
                "AND TYPE|| '_' ||OBJECT_TYPE|| '_' ||MANAGER_CHANNELS|| '_' ||SALE|| '_' " +
                "||PERFORMER|| '_' ||STAFF_AIO|| '_' ||MANAGER " +
                "IN (:keys) ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("count", new LongType());
        query.setParameterList("keys", keys);

        return (Long) query.uniqueResult();
    }

    public int disableConfig(Long id, Long userId) {
        String sql = "update AIO_CONFIG_SALARY " +
                "set status = 0, " +
                "UPDATED_USER = :userId, " +
                "UPDATED_DATE = sysdate " +
                "where CONFIG_SALARY_ID = :id ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("userId", userId);
        query.setParameter("id", id);

        return query.executeUpdate();
    }

    public List<AIOConfigSalaryDTO> getListConfigSalary(AIOConfigSalaryDTO criteria) {
        String sql = "SELECT " +
                "CONFIG_SALARY_ID configSalaryId, " +
                "TYPE type, " +
                "OBJECT_TYPE objectType, " +
                "MANAGER_CHANNELS managerChannels, " +
                "SALE sale, " +
                "PERFORMER performer, " +
                "STAFF_AIO staffAio, " +
                "MANAGER manager " +
//                "STATUS status, " +
//                "CREATED_USER createdUser, " +
//                "CREATED_DATE createdDate, " +
//                "UPDATED_USER updatedUser, " +
//                "UPDATED_DATE updatedDate " +
                "from aio_config_salary " +
                "where 1=1 " +
                "and status = 1 ";
        if (criteria.getObjectType() != null) {
            sql += "and object_type = :objectType ";
        }
        sql += "order by CONFIG_SALARY_ID desc, MANAGER_CHANNELS, SALE, PERFORMER, STAFF_AIO, MANAGER ";

        SQLQuery query = this.getSession().createSQLQuery(sql);

        if (criteria.getObjectType() != null) {
            query.setParameter("objectType", criteria.getObjectType());
        }

        query.addScalar("configSalaryId", new LongType());
        query.addScalar("type", new LongType());
        query.addScalar("objectType", new LongType());
        query.addScalar("managerChannels", new DoubleType());
        query.addScalar("sale", new DoubleType());
        query.addScalar("performer", new DoubleType());
        query.addScalar("staffAio", new DoubleType());
        query.addScalar("manager", new DoubleType());
//        query.addScalar("status", new LongType());
//        query.addScalar("createdUser", new LongType());
//        query.addScalar("createdDate", new DateType());
//        query.addScalar("updatedUser", new LongType());
//        query.addScalar("updatedDate", new DateType());

        query.setResultTransformer(Transformers.aliasToBean(AIOConfigSalaryDTO.class));

        return query.list();
    }
}
