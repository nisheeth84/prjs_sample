package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO of request param UpdateDetailScreenLayoutIn1DTO
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class UpdateDetailScreenLayoutSubType1DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;

    private Long itemId;
    private Boolean isAvailable;
    private Integer itemOrder;
    private Boolean isDefault;
    private String labelJaJp;
    private String labelEnUs;
    private String labelZhCn;
    private String labelKoKr;

}
