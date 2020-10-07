package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * CreateUserLoginRequest
 */
@Data
public class SendMailForUsersRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 871903913853155162L;

    private List<Long> employeeIds;

}
