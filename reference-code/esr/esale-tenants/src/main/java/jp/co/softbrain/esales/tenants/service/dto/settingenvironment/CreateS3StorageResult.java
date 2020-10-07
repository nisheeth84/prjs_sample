package jp.co.softbrain.esales.tenants.service.dto.settingenvironment;

import lombok.Value;

/**
 * Class that be contained information folder AmazonS3 after created
 *
 * @author tongminhcuong
 */
@Value
public class CreateS3StorageResult {

    private String rootKey;

    private boolean successfully;
}
