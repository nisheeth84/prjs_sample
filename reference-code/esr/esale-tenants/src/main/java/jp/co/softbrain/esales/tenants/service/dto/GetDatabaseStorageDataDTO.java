package jp.co.softbrain.esales.tenants.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for data response getDatabaseStorage API.
 *
 * @author nguyenvietloi
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetDatabaseStorageDataDTO implements Serializable {

    private static final long serialVersionUID = -8377798910644734556L;

    private Long totalStorage;

    private List<GetDatabaseStorageServiceDTO> services;
}
