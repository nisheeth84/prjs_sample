package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for result of API migrate data
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MigrateDataResult implements Serializable {

    private static final long serialVersionUID = -2065388802386159627L;

    private String item;

    private String errorMessage;
}
