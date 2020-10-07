package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class output for API addCustomersToList
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode
public class AddCustomersToListOutSubType1DTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -5775141568693813288L;

    /**
     * customerListMemberIds
     */
    private List<AddCustomersToListOutSubType2DTO> customerListMemberIds = new ArrayList<>();
}
