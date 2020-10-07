package jp.co.softbrain.esales.tenants.web.rest.vm.response;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO response from API createIndexElasticsearch
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateElasticsearchIndexResponse implements Serializable {

    private static final long serialVersionUID = -8206657827718915155L;

    /**
     * The message after setting process
     */
    private String message;
}
