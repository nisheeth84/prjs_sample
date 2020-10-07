/**
 * 
 */
package jp.co.softbrain.esales.uaa.service.dto.employees;

import java.io.Serializable;

import lombok.Data;

/**
 * Response for API get emp detail
 * 
 * @author phamminhphu
 */
@Data
public class GetEmpDetailResponse implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4071953827766555792L;

    private EmpDetailDTO empDetailDTO;
}
