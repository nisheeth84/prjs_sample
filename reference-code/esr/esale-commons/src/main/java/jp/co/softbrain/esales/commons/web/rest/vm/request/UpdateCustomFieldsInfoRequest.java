package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.FieldInfoTabDTO;
import jp.co.softbrain.esales.commons.service.dto.TabsInfoDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateCustomFieldsInfoInDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * View model for API updateCustomFieldsInfo
 * 
 * @author nguyentrunghieu
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCustomFieldsInfoRequest implements Serializable {

    private static final long serialVersionUID = -6748749355562911363L;
    private Integer fieldBelong;
    private List<Long> deletedFields;
    private List<UpdateCustomFieldsInfoInDTO> fields;
    private List<TabsInfoDTO> tabs;
    private List<Long> deletedFieldsTab;
    private List<FieldInfoTabDTO> fieldsTab;
}
