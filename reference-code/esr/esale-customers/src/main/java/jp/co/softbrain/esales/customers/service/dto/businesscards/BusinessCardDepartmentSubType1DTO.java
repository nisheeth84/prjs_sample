package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for API getBusinessCardDepartments
 *
 * @author huandv
 */
@Data
@EqualsAndHashCode
public class BusinessCardDepartmentSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7252721234576834L;

    /**
     * The departmentId
     */
    private Long departmentId;

    /**
     * The departmentName
     */
    private String departmentName;

    /**
     * The parentId
     */
    private Long parentId;

    /**
     * The businessCardIds
     */
    private List<Long> businessCardIds = new ArrayList<>();

    /**
     * The updatedDate
     */
    private Instant updatedDate;
}
