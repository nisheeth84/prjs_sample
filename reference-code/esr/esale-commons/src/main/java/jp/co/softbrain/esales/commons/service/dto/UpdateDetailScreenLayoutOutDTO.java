package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO of request param API updateDetailScreenLayout
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class UpdateDetailScreenLayoutOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;
    private String code;
    private String message;
}
