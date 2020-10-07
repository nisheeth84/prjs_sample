package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request entity for API migrate-data
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MigrateDataRequest implements Serializable {

    private static final long serialVersionUID = -3262788437640861002L;

    private String microServiceName;
}
