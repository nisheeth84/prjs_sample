package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * Request for API initializeGroupModal
 * @author phamdongdong
 *
 */
@Data
public class GetInitializeGroupModalRequest implements Serializable{
    /**
     * 
     */
    private static final long serialVersionUID = 2230980195595566820L;
    private Long groupId;
    private Boolean isOwnerGroup;
    private Boolean isAutoGroup;
}
