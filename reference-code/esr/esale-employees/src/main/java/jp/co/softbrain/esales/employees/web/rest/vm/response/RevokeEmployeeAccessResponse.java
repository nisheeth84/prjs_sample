package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The RevokeEmployeeAccessResponse class
 *
 * @author nguyenhaiduong
 */
@Data
@EqualsAndHashCode
public class RevokeEmployeeAccessResponse implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4161136078929560721L;

    /**
     * isSuccess
     */
    private Boolean isSuccess;
}
