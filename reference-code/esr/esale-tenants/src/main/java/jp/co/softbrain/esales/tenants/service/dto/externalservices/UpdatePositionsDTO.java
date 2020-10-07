package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request entity for API update-position
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePositionsDTO implements Serializable {

    private static final long serialVersionUID = 2598744792791710473L;

    private Long positionId;

    private String positionName;

    private Integer positionOrder;

    private Boolean isAvailable;

    private Instant updatedDate;

    /**
     * Constructor
     *
     * @param positionName positionName
     * @param isAvailable isAvailable
     */
    public UpdatePositionsDTO(String positionName, boolean isAvailable) {
        this.positionName = positionName;
        this.isAvailable = isAvailable;
    }
}
