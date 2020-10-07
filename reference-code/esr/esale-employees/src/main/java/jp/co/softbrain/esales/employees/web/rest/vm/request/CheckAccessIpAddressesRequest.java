package jp.co.softbrain.esales.employees.web.rest.vm.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CheckAccessIpAddressesRequest implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 1463100959018936252L;

    /**
     * The ipAddress
     */
    private String ipAddress;
}
