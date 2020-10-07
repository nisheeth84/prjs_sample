package jp.co.softbrain.esales.tenants.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO for data service response getDatabaseStorage API.
 *
 * @author nguyenvietloi
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetDatabaseStorageServiceDTO implements Serializable {

    private static final long serialVersionUID = -8377798910644324556L;

    private String microServiceName;

    private long usedStorage;
}
