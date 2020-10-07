package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetUrlQuicksightResponse
 *
 * @author nguyenhaiduong
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetUrlQuicksightResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 509072322837342362L;

    /**
     * urlQuickSight
     */
    private String urlQuickSight;

}
