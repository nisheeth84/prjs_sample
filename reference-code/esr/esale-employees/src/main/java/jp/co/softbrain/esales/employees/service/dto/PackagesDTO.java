package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for the {@link jp.co.softbrain.esales.employees.domain.Departments}
 * entity.
 */
@Data
@EqualsAndHashCode
public class PackagesDTO implements Serializable {

    private static final long serialVersionUID = -6540220187056875974L;

    /**
     * The Options optionId
     */
    private Long packageId;

    /**
     * The Options OptionName
     */
    private String packageName;

    /**
     * The Options remainLicenses
     */
    private Long remainPackages;

    /**
     * Update Date
     */
    private Instant updatedDate;
}
