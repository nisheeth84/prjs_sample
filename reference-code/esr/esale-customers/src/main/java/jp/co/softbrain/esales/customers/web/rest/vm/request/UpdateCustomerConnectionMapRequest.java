package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import javax.servlet.http.Part;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateCustomerConnectionMapRequest implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -844530801701235513L;

    private String data;
    /**
     * parts
     */
    private List<Part> parts;

    /**
     * files
     */
    private List<MultipartFile> files;
    
    /**
     * filesMap
     */
    private List<String> filesMap;
}
