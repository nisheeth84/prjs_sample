package jp.co.softbrain.esales.tenants.tenant.client.config;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;

import jp.co.softbrain.esales.tenants.config.ConstantsTenants;

/**
 * Hibernate needs to know which database to use i.e. which tenant to connect
 * to. This class provides a mechanism to provide the correct datasource at run
 * time.
 *
 */
public class CurrentTenantIdentifierResolverImpl implements CurrentTenantIdentifierResolver {

    @Override
    public String resolveCurrentTenantIdentifier() {
        return ConstantsTenants.SCHEMA_NAME;
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
}
