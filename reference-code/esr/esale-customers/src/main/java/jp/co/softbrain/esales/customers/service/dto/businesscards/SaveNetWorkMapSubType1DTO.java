package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * the departments of {@link SaveNetWorkMapRequest}
 *
 * @author ANTSOFT
 */
@Data
@EqualsAndHashCode
public class SaveNetWorkMapSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4113103483223466253L;

    /**
     * departmentId
     */
    private Long departmentId;

    /**
     * departmentName
     */
    private String departmentName;

    /**
     * parentId
     */
    private Long parentId;

    /**
     * parentName
     */
    private String parentName;

    /**
     * The updatedDate
     */
    private Instant updatedDate;
}
