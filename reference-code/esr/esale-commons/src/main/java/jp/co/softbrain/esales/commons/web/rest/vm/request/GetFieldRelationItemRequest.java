package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetFieldRelationItemRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1445484986897876751L;

    /**
     * fieldBelong
     */
    private Long fieldBelong;

}
