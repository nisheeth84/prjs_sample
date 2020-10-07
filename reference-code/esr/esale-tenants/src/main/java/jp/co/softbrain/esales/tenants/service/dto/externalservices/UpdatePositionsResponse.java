package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response entity for API create-department
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePositionsResponse implements Serializable {

    private static final long serialVersionUID = 7576201133268175661L;

    private List<Long> deletedPositions;

    private List<Long> insertedPositions;

    private List<Long> updatedPositions;
}
