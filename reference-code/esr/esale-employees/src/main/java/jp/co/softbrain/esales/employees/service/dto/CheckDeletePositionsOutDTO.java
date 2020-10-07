package jp.co.softbrain.esales.employees.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * The DTO for API check delete Positions
 *
 * @author QuangLV
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class CheckDeletePositionsOutDTO implements Serializable {

    /**
     * the serialVersionUID
     */
    private static final long serialVersionUID = -8767887140149017604L;

    /**
     * list position id
     */
    private List<Long> positionIds;
}
