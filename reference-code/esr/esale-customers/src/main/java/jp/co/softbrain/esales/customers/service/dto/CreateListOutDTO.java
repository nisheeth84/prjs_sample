/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class output for API createList
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class CreateListOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4677525761847329605L;

    /**
     * customerListMemberIds
     */
    private List<CreateListOutSubType1DTO> customerListMemberIds = new ArrayList<>();

}
