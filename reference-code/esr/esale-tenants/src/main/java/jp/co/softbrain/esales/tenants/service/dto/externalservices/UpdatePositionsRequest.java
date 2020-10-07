package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Request entity for API update-position
 *
 * @author tongminhcuong
 */
@Data
public class UpdatePositionsRequest implements Serializable {

    private static final long serialVersionUID = 1016495312914379014L;

    private List<UpdatePositionsDTO> positions;
}
