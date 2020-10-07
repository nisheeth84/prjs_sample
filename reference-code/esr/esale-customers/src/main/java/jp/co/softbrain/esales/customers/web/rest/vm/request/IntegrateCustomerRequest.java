/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Request for Api integrateCustomer
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class IntegrateCustomerRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1472003788935394803L;

    /**
     * data
     */
    private String data;

    /**
     * filesMap
     */
    private List<String> filesMap;

    /**
     * files
     */
    private List<MultipartFile> files;
}
