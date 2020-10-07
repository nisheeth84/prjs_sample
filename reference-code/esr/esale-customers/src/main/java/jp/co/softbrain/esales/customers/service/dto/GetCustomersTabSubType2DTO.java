package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO of api getCustomersTab
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class GetCustomersTabSubType2DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -100495016838597571L;

    /**
     * customers
     */
    private List<GetCustomersTabSubType3DTO> customers;

    /**
     * fieldInfo
     */
    private FieldInfosTabDTO fieldInfo;

}
