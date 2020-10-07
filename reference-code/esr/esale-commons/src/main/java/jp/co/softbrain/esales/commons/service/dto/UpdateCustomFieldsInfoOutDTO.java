package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO of request param API updateCustomFieldsInfo
 * 
 * @author vuvankien
 */
@Data
@EqualsAndHashCode
public class UpdateCustomFieldsInfoOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4128969657556542817L;

    private List<Long> fieldIds;

    private List<Long> tabInfoIds;

    private List<Long> fieldInfoTabIds;

}
