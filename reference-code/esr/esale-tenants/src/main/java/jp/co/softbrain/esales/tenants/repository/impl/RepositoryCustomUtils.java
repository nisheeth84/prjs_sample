package jp.co.softbrain.esales.tenants.repository.impl;

import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.jpa.QueryHints;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.orm.jpa.JpaTransactionManager;

/**
 * Class utility of Repository custom
 * @author phamhoainam
 */
public class RepositoryCustomUtils {
    private final Logger log = LoggerFactory.getLogger(this.getClass());
    @Autowired
    @Qualifier("tenantTransactionManager")
    private JpaTransactionManager tenantTransactionManager;

    /**
     * Execute a SELECT query that returns a result list
     *
     * @param sql a native SQL query string
     * @return the result list
     */
    public <T> List<T> getResultList(String sql) {
        return getResultList(sql, null, null);
    }

    /**
     * Execute a SELECT query that returns a result list
     *
     * @param sql a native SQL query string
     * @param parameters parameters of query
     * @return the result list
     */
    public <T> List<T> getResultList(String sql, Map<String, Object> parameters) {
        return getResultList(sql, null, parameters);
    }

    /**
     * Execute a SELECT query that returns a result list
     *
     * @param sql a native SQL query string
     * @param resultSetMappingName the name of the result set mapping
     * @return the result list
     */
    public <T> List<T> getResultList(String sql, String resultSetMappingName) {
        return getResultList(sql, resultSetMappingName, null);
    }

    /**
     * Execute a SELECT query that returns a result list
     *
     * @param sql a native SQL query string
     * @param resultSetMappingName the name of the result set mapping
     * @param parameters parameters of query
     * @return the result list
     */
    @SuppressWarnings("unchecked")
    public <T> List<T> getResultList(String sql, String resultSetMappingName, Map<String, Object> parameters) {
        log.info("SQL: {}", sql);
        String params = StringUtils.join(parameters);
        log.info("Parameters: {}", params);
        EntityManager entityManager = null;
        try {
            entityManager = tenantTransactionManager.getEntityManagerFactory().createEntityManager();
            Query query = createQuery(entityManager, sql, resultSetMappingName, parameters);
            return query.getResultList();
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
        }
    }

    /**
     * Execute a SELECT query that returns a single result
     *
     * @param sql a native SQL query string
     * @return the result
     */
    public <T> T getSingleResult(String sql) {
        return getSingleResult(sql, null, null);
    }

    /**
     * Execute a SELECT query that returns a single result
     *
     * @param sql a native SQL query string
     * @param parameters parameters of query
     * @return the result
     */
    public <T> T getSingleResult(String sql, Map<String, Object> parameters) {
        return getSingleResult(sql, null, parameters);
    }

    /**
     * Execute a SELECT query that returns a single result
     *
     * @param sql a native SQL query string
     * @param resultSetMappingName the name of the result set mapping
     * @return the result
     */
    public <T> T getSingleResult(String sql, String resultSetMappingName) {
        return getSingleResult(sql, resultSetMappingName, null);
    }

    /**
     * Execute a SELECT query that returns a single result
     *
     * @param sql a native SQL query string
     * @param resultSetMappingName the name of the result set mapping
     * @param parameters parameters of query
     * @return the result
     */
    @SuppressWarnings("unchecked")
    public <T> T getSingleResult(String sql, String resultSetMappingName, Map<String, Object> parameters) {
        log.info("SQL: {}", sql);
        String params = org.apache.commons.lang3.StringUtils.join(parameters);
        log.info("Parameters: {}", params);
        EntityManager entityManager = null;
        try {
            entityManager = tenantTransactionManager.getEntityManagerFactory().createEntityManager();
            Query query = createQuery(entityManager, sql, resultSetMappingName, parameters);
            return (T) query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
        }
    }

    /**
     * Create an instance of <code>Query</code> for executing
     *
     * @param sql a native SQL query string
     * @param resultSetMappingName the name of the result set mapping
     * @param parameters parameters of query
     * @return the new Query instance
     */
    private Query createQuery(EntityManager entityManager, String sql, String resultSetMappingName, Map<String, Object> parameters) {
        Query query = null;
        if (StringUtils.isEmpty(resultSetMappingName)) {
            query = entityManager.createNativeQuery(sql);
        } else {
            query = entityManager.createNativeQuery(sql, resultSetMappingName);
        }

        if (parameters == null) {
            return query;
        }
        query.setHint(QueryHints.HINT_READONLY, true);

        for (Map.Entry<String, Object> entry : parameters.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }
        return query;
    }
}
