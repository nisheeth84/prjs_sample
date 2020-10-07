package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import jp.co.softbrain.esales.tenants.domain.MPackages;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A DTO for {@link MPackages}
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PackagesDTO implements Serializable {

    private static final long serialVersionUID = 6694346070051010412L;

    private Long mPackageId;

    private String packageName;
}
