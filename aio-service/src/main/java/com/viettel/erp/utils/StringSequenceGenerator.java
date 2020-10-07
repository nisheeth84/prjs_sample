/**
 *
 */
package com.viettel.erp.utils;

import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.id.IdentifierGeneratorHelper.BigDecimalHolder;
import org.hibernate.id.IntegralDataTypeHolder;
import org.hibernate.id.SequenceGenerator;

import java.io.Serializable;

public class StringSequenceGenerator extends SequenceGenerator {
    @Override
    public Serializable generate(SessionImplementor session, Object obj) {
        return super.generate(session, obj).toString();
    }

    protected IntegralDataTypeHolder buildHolder() {
        return new BigDecimalHolder();
    }
}