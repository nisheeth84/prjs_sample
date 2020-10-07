package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the {@link jp.co.softbrain.esales.employees.domain.Departments}
 * entity.
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class CountUsedLicensesSubType1DTO implements Serializable {

    private static final long serialVersionUID = -6540220187056875974L;

    /**
     * packageId
     */
    private Long packageId;

    /**
     * usedPackages
     */
    private Long usedPackages;
}
