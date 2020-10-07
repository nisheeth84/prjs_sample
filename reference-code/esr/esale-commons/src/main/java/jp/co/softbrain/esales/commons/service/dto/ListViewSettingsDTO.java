package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO mapping for the entity
 * {@link jp.co.softbrain.esales.commons.domain.ListViewSettings}
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ListViewSettingsDTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -7717990245529879214L;

    /**
     * listViewSettingId
     */
    private Long listViewSettingId;

    /**
     * fieldBelong
     */
    private Integer fieldBelong;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * selectedTargetType
     */
    private Integer selectedTargetType;

    /**
     * selectedTargetId
     */
    private Long selectedTargetId;

    /**
     * extraSettings
     */
    private String extraSettings;

    /**
     * orderBy
     */
    private String orderBy;
}
