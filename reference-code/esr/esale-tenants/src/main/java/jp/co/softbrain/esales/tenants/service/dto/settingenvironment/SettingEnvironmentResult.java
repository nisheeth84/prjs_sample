package jp.co.softbrain.esales.tenants.service.dto.settingenvironment;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Class that be contained information after create environment
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SettingEnvironmentResult implements Serializable {

    private static final long serialVersionUID = 7066432555484419724L;

    private List<CreateSchemaResult> createSchemaResultList;

    private CreateS3StorageResult createS3StorageResult;

    private CreateElasticsearchIndexResult createElasticsearchIndexResult;

    private SettingQuickSightResult settingQuickSightResult;
}
