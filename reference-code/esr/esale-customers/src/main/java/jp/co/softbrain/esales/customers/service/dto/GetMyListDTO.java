package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetMyListDTO
 *
 * @author lequyphuc
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetMyListDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8316568510830754322L;

    /**
     * customerListId
     */
    private Long customerListId;

    /**
     * customerListName
     */
    private String customerListName;

    /**
     * isAutoList
     */
    private Boolean isAutoList;
}
