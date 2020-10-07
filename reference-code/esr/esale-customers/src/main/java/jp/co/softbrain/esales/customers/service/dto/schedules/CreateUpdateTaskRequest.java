package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CreateUpdateTaskRequest
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class CreateUpdateTaskRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2132977588009211165L;

    private Long taskId;
    private String data;
    private transient List<MultipartFile> files;
    private List<String> filesMap;

}
