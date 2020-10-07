package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Get Service Favorite Out DTO
 *
 * @author TuanLv
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetServiceFavoriteOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8716017871838756146L;

    /**
     * data
     */
    private List<DataOutDTO> data;

}
