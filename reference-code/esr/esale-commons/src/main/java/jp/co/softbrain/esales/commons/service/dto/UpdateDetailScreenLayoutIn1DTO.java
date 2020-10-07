package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO of request param API updateDetailScreenLayout
 *
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class UpdateDetailScreenLayoutIn1DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4128969657556542817L;

    private Long fieldId;
    private Boolean userModifyFlg;
    private String fieldName;
    private Integer fieldType;
    private Integer fieldOrder;
    private Boolean required;
    private Boolean isDefault;
    private Boolean isDoubleColumn;
    private Boolean isAvailable;
    private Boolean isModify;
    private Boolean isMobileModify;
    private Integer imeType;
    private Integer searchType;
    private Integer searchOption;
    private String urlTarget;
    private String urlText;
    private String iframeHeight;
    private Boolean isLineNameDisplay;
    private String configValue;
    private Integer decimalPlace;
    private String labelJaJp;
    private String labelEnUs;
    private String labelZhCn;
    private String labelKoKr;
    private List<UpdateDetailScreenLayoutSubType1DTO> fieldItems = new ArrayList<>();
}
