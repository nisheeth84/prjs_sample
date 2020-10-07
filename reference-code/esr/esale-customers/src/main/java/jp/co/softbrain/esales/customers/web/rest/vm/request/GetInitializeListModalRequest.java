package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * GetInitializeListModalRequest
 */
@Data
public class GetInitializeListModalRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2899668432677421408L;

    private Long customerListId;
    private Boolean isAutoList;

}
