package jp.co.softbrain.esales.commons.tenant.client.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import jp.co.softbrain.esales.commons.config.DbType;

public class RoutingDataSource extends AbstractRoutingDataSource{

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Override
    protected Object determineCurrentLookupKey() {
        Object dbType = TransactionSynchronizationManager.isCurrentTransactionReadOnly() ? DbType.SLAVE : DbType.MASTER;
        log.debug("RoutingDataSource>>>db look up key : {}", dbType);
        return dbType;
    }
}
