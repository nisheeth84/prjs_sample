package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CreateServiceFavoriteOutDTO
 *
 * @author TuanLv
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class CreateServiceFavoriteOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8706017871838756146L;

    /**
     * serviceId
     */
    private Long serviceId;

}
