package jp.co.softbrain.esales.employees.repository.impl;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import org.apache.commons.lang.StringUtils;
import org.hibernate.jpa.QueryHints;
import org.hibernate.query.NativeQuery;
import org.hibernate.transform.ResultTransformer;
import org.hibernate.transform.Transformers;
import org.hibernate.type.BooleanType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.InstantType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.hibernate.type.TimestampType;
import org.hibernate.type.Type;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.orm.jpa.JpaTransactionManager;

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
        log.info("Parameters: {}", parameters);
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
        log.info("Parameters: {}", parameters);
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

    /**
     * Execute a SELECT query that returns a result list
     *
     * @param sql                  a native SQL query string
     * @param className of the class mapping
     * @param parameters           parameters of query
     * @return the result list
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
    public <T> List<T> getList(String sql, Class<T> className, Map<String, Object> parameters) {
        log.info("SQL:  {}", sql);
        log.info("Parameters:  {}", parameters);
        EntityManager entityManager = null;
        try {
            entityManager = tenantTransactionManager.getEntityManagerFactory().createEntityManager();
            NativeQuery query = entityManager.createNativeQuery(sql).unwrap(NativeQuery.class);
            if (parameters != null) {
                query.setHint(QueryHints.HINT_READONLY, true);
                for (Map.Entry<String, Object> entry : parameters.entrySet()) {
                    query.setParameter(entry.getKey(), entry.getValue());
                }
            }
            try {
                setResultTransformer(query, className);
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                log.info("error", e);
            }
            return query.getResultList();
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
        }
    }

    /**
     * set result transformer alias to bean of Obj
     * @param query
     * @param obj
     * @throws SecurityException
     * @throws NoSuchMethodException
     * @throws InvocationTargetException
     * @throws IllegalArgumentException
     * @throws IllegalAccessException
     */
    @SuppressWarnings("rawtypes")
    public void setResultTransformer(NativeQuery query, Class obj) throws NoSuchMethodException,
            IllegalAccessException, InvocationTargetException {
        Field[] fileds = obj.getDeclaredFields();
        Map<String, String> mapFileds = new HashMap<>();
        for (Field filed : fileds) {
            mapFileds.put(filed.getName(), filed.getGenericType().toString());
        }
        List<String> aliasColumns = getReturnAliasColumns(query);
        for (String aliasColumn : aliasColumns) {
            String dataType = mapFileds.get(aliasColumn);
            if (dataType == null) {
                log.info("{} is not defined", aliasColumn);
            } else {
                Type hbmType = getHbmType(dataType);
                if (hbmType == null) {
                    log.info("{} is not supported", dataType);
                } else {
                    query.addScalar(aliasColumn, hbmType);
                }
            }
        }
        Method m = org.hibernate.query.Query.class.getDeclaredMethod("setResultTransformer", ResultTransformer.class);
        m.invoke(query, Transformers.aliasToBean(obj));
    }
    /**
     * convert java type to hibernate Type
     * @param dataType
     * @return
     */
    private Type getHbmType(String dataType) {
        Type hbmType = null;
        if ("class java.lang.Long".equals(dataType)) {
            hbmType = LongType.INSTANCE;
        } else if ("class java.lang.Integer".equals(dataType)) {
            hbmType = IntegerType.INSTANCE;
        } else if ("class java.lang.Double".equals(dataType)) {
            hbmType = DoubleType.INSTANCE;
        } else if ("class java.lang.String".equals(dataType)) {
            hbmType = StringType.INSTANCE;
        } else if ("class java.lang.Boolean".equals(dataType)) {
            hbmType = BooleanType.INSTANCE;
        } else if ("class java.util.Date".equals(dataType)) {
            hbmType = TimestampType.INSTANCE;
        } else if ("class java.time.Instant".equals(dataType)) {
            hbmType = InstantType.INSTANCE;
        }
        return hbmType;
    }
    /**
     * get return alias columns
     * @param query
     * @return alias columns List
     */
    @SuppressWarnings("rawtypes")
    private List<String> getReturnAliasColumns(NativeQuery query) {
        String sqlQuery = query.getQueryString();
        sqlQuery = sqlQuery.replace("\n", " ");
        sqlQuery = sqlQuery.replace("\t", " ");
        int numOfRightPythis = 0;
        int startPythis = -1;
        int endPythis = 0;
        boolean hasRightPythis = true;
        while (hasRightPythis) {
            char[] arrStr = sqlQuery.toCharArray();
            hasRightPythis = false;
            int idx = 0;
            for (char c : arrStr) {
                if (idx > startPythis) {
                    if ("(".equalsIgnoreCase(String.valueOf(c))) {
                        if (numOfRightPythis == 0) {
                            startPythis = idx;
                        }
                        numOfRightPythis++;
                    } else if (")".equalsIgnoreCase(String.valueOf(c)) && numOfRightPythis > 0) {
                        numOfRightPythis--;
                        if (numOfRightPythis == 0) {
                            endPythis = idx;
                            break;
                        }
                    }
                }
                idx++;
            }
            if (endPythis > 0) {
                sqlQuery = sqlQuery.substring(0, startPythis) + " # " + sqlQuery.substring(endPythis + 1);
                hasRightPythis = true;
                endPythis = 0;
            }
        }

        return aliasColumns(sqlQuery);
    }

    private List<String> aliasColumns(String sqlQuery) {
        List<String> aliasColumns = new ArrayList<>();
        String[] arrStr = sqlQuery.substring(0, sqlQuery.toUpperCase().indexOf(" FROM ")).split(",");
        for (String str : arrStr) {
            String[] temp = str.trim().split(" ");
            String alias = temp[temp.length - 1].trim();
            if (alias.contains(".")) {
                alias = alias.substring(alias.lastIndexOf('.') + 1).trim();
            }
            if (alias.contains(",")) {
                alias = alias.substring(alias.lastIndexOf(',') + 1).trim();
            }
            if (alias.contains("`")) {
                alias = alias.replace("`", "");
            }
            if (!aliasColumns.contains(alias)) {
                aliasColumns.add(alias);
            }
        }
        return aliasColumns;
    }
}
