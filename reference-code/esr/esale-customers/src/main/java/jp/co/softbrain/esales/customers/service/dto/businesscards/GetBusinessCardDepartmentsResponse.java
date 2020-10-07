package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * response of GetBusinessCardDepartments API
 * 
 * @author ANTSOFT
 */
@Data
@EqualsAndHashCode
public class GetBusinessCardDepartmentsResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1542061636745315350L;

    /**
     * The businessCardCompanyId
     */
    private Long businessCardCompanyId;

    /**
     * The updatedDate
     */
    private Instant updatedDate;

    /**
     * The departments
     */
    private List<BusinessCardDepartmentSubType1DTO> departments;

}
