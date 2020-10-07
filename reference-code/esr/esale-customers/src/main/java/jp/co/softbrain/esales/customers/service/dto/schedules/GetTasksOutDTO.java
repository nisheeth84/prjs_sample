package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.customers.service.dto.commons.FieldInfoPersonalsOutDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetTasksOutDTO
 * 
 * @author TranTheDuy
 */
@Data
@EqualsAndHashCode
public class GetTasksOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4362065204831876045L;

    /**
     * dataInfo
     */
    private GetTasksOutDataInfoDTO dataInfo;

    /**
     * fieldInfo
     */
    private List<FieldInfoPersonalsOutDTO> fieldInfo;
}
