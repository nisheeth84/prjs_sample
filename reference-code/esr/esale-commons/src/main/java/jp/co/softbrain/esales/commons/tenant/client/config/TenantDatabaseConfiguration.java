package jp.co.softbrain.esales.commons.tenant.client.config;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.hibernate.MultiTenancyStrategy;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.LazyConnectionDataSourceProxy;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import jp.co.softbrain.esales.commons.config.ConstantsCommon;
import jp.co.softbrain.esales.commons.config.DbType;
import jp.co.softbrain.esales.commons.domain.AbstractAuditingEntity;
import jp.co.softbrain.esales.commons.service.ValidateService;
import jp.co.softbrain.esales.commons.tenant.util.TenantUtil;

/**
 * Configuration of the tenant database
 */
@Configuration
@EnableTransactionManagement
@ComponentScan(basePackages = { "jp.co.softbrain.esales.commons.repository", "jp.co.softbrain.esales.commons.domain" })
@EnableJpaRepositories(basePackages = { "jp.co.softbrain.esales.commons.repository",
        "jp.co.softbrain.esales.commons.service" }, entityManagerFactoryRef = "tenantEntityManagerFactory", transactionManagerRef = "tenantTransactionManager")
public class TenantDatabaseConfiguration {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    /**
     * Tenant database configuration properties like username, password, etc.
     */
    @Autowired
    private TenantDatabaseConfigProperties tenantDatabaseConfigProperties;

    @Autowired
    private Environment env;

    /**
     * create writeDataSource bean
     *
     * @return
     */
    @Bean
    public DataSource writeDataSource() {
        return TenantUtil.getTenantDataSource(tenantDatabaseConfigProperties, DbType.MASTER);
    }

    /**
     * create readDataSource bean
     *
     * @return
     */
    @Bean
    public DataSource readDataSource() {
        return TenantUtil.getTenantDataSource(tenantDatabaseConfigProperties, DbType.SLAVE);
    }

    /**
     * create routingDataSource bean
     *
     * @param writeDataSource
     * @param readDataSource
     * @return
     */
    @Bean
    public DataSource routingDataSource(
        @Qualifier("writeDataSource") DataSource writeDataSource,
        @Qualifier("readDataSource") DataSource readDataSource) {
        RoutingDataSource routingDataSource = new RoutingDataSource();

        Map<Object, Object> dataSourceMap = new HashMap<>();
        dataSourceMap.put(DbType.MASTER, writeDataSource);
        dataSourceMap.put(DbType.SLAVE, readDataSource);
        routingDataSource.setTargetDataSources(dataSourceMap);
        routingDataSource.setDefaultTargetDataSource(writeDataSource);

        return routingDataSource;
    }

    /**
     * create DataSource proxy Bean
     *
     * @param routingDataSource
     * @return
     */
    @Bean
    public DataSource dataSource(@Qualifier("routingDataSource") DataSource routingDataSource) {
        return new LazyConnectionDataSourceProxy(routingDataSource);
    }

    /**
     * Create JpaVendorAdapter bean for tenant
     *
     * @return
     */
    public JpaVendorAdapter jpaVendorAdapter() {
        return new HibernateJpaVendorAdapter();
    }

    /**
     * This transaction manager is appropriate for applications that use a single
     * JPA EntityManagerFactory for transactional data access. <br/>
     * <br/>
     * Note the <b>{@literal @}Qualifier</b> annotation to ensure that the
     * <tt>masterEntityManagerFactory</tt> is used for setting up the transaction
     * manager.
     *
     * @param tenantEntityManager
     * @return
     */
    @Bean(name = "tenantTransactionManager")
    public JpaTransactionManager transactionManager(
            @Qualifier("tenantEntityManagerFactory") EntityManagerFactory tenantEntityManager) {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(tenantEntityManager);
        return transactionManager;
    }

    /**
     * The multi tenant connection provider
     *
     * @return
     */
    @Bean(name = "multiTenantConnectionProvider")
    public MultiTenantConnectionProvider multiTenantConnectionProvider() {
        // Autowires the multi connection provider
        return new ServiceMultiTenantConnectionProvider();
    }

    /**
     * The current tenant identifier resolver
     *
     * @return
     */
    @Bean(name = "currentTenantIdentifierResolver")
    public CurrentTenantIdentifierResolver currentTenantIdentifierResolver() {
        return new CurrentTenantIdentifierResolverImpl();
    }

    /**
     * Creates the entity manager factory bean which is required to access the JPA
     * functionalities provided by the JPA persistence provider, i.e. Hibernate in
     * this case.
     *
     * @param connectionProvider
     * @param tenantResolver
     * @return
     */
    @Bean(name = "tenantEntityManagerFactory")
    @ConditionalOnBean(name = "multiTenantConnectionProvider")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            @Qualifier("multiTenantConnectionProvider") MultiTenantConnectionProvider connectionProvider,
            @Qualifier("currentTenantIdentifierResolver") CurrentTenantIdentifierResolver tenantResolver) {

        LocalContainerEntityManagerFactoryBean emfBean = new LocalContainerEntityManagerFactoryBean();

        // All tenant related entities, repositories and service classes must be scanned
        emfBean.setPackagesToScan(AbstractAuditingEntity.class.getPackage().getName(),
                "jp.co.softbrain.esales.commons.repository", ValidateService.class.getPackage().getName());

        emfBean.setJpaVendorAdapter(jpaVendorAdapter());

        emfBean.setPersistenceUnitName(
                ConstantsCommon.SERVICE_NAME + "-" + tenantDatabaseConfigProperties.getPoolName());
        log.debug("PersistenceUnitName [{}]", emfBean.getPersistenceUnitName());

        // for multi tenant
        Map<String, Object> properties = new HashMap<>();
        properties.put(org.hibernate.cfg.Environment.MULTI_TENANT, MultiTenancyStrategy.DATABASE);
        properties.put(org.hibernate.cfg.Environment.MULTI_TENANT_CONNECTION_PROVIDER, connectionProvider);
        properties.put(org.hibernate.cfg.Environment.MULTI_TENANT_IDENTIFIER_RESOLVER, tenantResolver);

        emfBean.setJpaPropertyMap(properties);

        // Set the hibernate properties
        emfBean.setJpaProperties(TenantUtil.hibernateProperties(env));

        log.info("tenantEntityManagerFactory set up successfully!");
        return emfBean;
    }
}
