package jp.co.softbrain.esales.tenants.service.dto.settingenvironment;

import lombok.Value;

/**
 * Class that be contained information of schema
 *
 * @author tongminhcuong
 */
@Value
public class CreateSchemaResult {

    private String databaseUrl;

    private String schemaName;

    private boolean successfully;
}
