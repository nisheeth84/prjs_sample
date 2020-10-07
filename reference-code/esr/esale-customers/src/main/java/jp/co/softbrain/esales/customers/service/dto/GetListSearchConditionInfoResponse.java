/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Response for API getListSearchConditionInfo
 * 
 * @author nguyenhaiduong
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetListSearchConditionInfoResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1794651239300326086L;

    /**
     * groupId
     */
    private Long customerListId;

    /**
     * groupName
     */
    private String customerListName;

    /**
     * searchConditions
     */
    private List<CustomerListSearchConditionInfoDTO> customerListSearchConditionInfos;
}
