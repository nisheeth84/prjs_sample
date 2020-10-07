package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response entity for API get-all-employee-id
 *
 * @author phamhoainam
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetAllEmployeeIdResponse implements Serializable {
    private static final long serialVersionUID = -5335468897331461230L;

    private List<Long> employeeIds;
}
