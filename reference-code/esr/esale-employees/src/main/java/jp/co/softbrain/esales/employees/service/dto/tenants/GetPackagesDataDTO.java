package jp.co.softbrain.esales.employees.service.dto.tenants;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 *  DTO for query getPackages API.
 *
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class GetPackagesDataDTO implements Serializable {

    private static final long serialVersionUID = 6694346070051010412L;

    private Long packageId;

    private String packageName;
}
