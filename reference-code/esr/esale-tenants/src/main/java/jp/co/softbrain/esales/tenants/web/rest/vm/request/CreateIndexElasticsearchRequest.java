package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * Request DTO for API createIndexElasticsearch
 *
 * @author tongminhcuong
 */
@Data
public class CreateIndexElasticsearchRequest implements Serializable {

    private static final long serialVersionUID = -4917816237938777734L;

    /**
     * The id of Contract
     */
    private String tenantName;

    /**
     * extensionBelong
     */
    private Long extensionBelong;
}
