package jp.co.softbrain.esales.employees.tenant.client.config;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import jp.co.softbrain.esales.employees.config.DbType;
public class RoutingDataSource extends AbstractRoutingDataSource{

    @Override
    protected Object determineCurrentLookupKey() {
        return TransactionSynchronizationManager.isCurrentTransactionReadOnly() ? DbType.SLAVE : DbType.MASTER;
    }
}
