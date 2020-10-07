/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jp.co.softbrain.esales.customers.service.dto.CustomersInputDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Update customers request
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCustomersRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -820649078806832334L;

    /**
     * customers
     */
    private List<CustomersInputDTO> customers;

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
