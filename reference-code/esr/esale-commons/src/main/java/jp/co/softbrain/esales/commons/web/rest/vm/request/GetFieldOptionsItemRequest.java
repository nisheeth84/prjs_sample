package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * request for getFieldOptionsItem
 * 
 * @author Trungnd
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetFieldOptionsItemRequest implements Serializable {
    
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7896999136619472562L;

    /**
     * fieldBelong
     */
    private Long fieldBelong;
}
