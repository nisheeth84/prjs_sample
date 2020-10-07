package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.UpdateDetailScreenLayoutIn1DTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateDetailScreenLayoutIn2DTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateDetailScreenLayoutIn3DTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO of request param API updateDetailScreenLayout
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class UpdateDetailScreenLayoutRequest implements Serializable {
    private static final long serialVersionUID = 8830486876260793891L;

    private Integer fieldBelong;
    private List<Long> deleteFields;
    private List<UpdateDetailScreenLayoutIn1DTO> fields;
    private List<Long> deleteTabs;
    private List<UpdateDetailScreenLayoutIn2DTO> tabs;
    private List<Long> deleteFieldsTab;
    private List<UpdateDetailScreenLayoutIn3DTO> fieldsTab;
}
