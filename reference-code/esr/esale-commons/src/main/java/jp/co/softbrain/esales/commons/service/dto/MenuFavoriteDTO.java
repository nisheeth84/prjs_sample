package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class MenuFavoriteDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = -2921011195044382876L;

    private Long serviceId;

    private Long employeeId;

    private String serviceName;

}
