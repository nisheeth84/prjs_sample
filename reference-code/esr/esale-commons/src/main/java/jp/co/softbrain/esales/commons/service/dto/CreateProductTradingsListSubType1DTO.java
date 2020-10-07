package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CreateProductTradingsListSubType1DTO of api createProductTradingsList
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class CreateProductTradingsListSubType1DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1323651312786260530L;

    private String productTradingListName;

    private Integer listType;

    private Integer listMode;

    private List<Long> ownerList;

    private List<Long> viewerList;

    private Integer isOverWrite;

    private Instant udpatedDate;

}
