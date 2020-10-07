package jp.co.softbrain.esales.commons.service.dto.activities;


import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class UpdateActivityFormatsRequest implements Serializable {
    
    private static final long serialVersionUID = 3526478859545460762L;
    private List<ActivitiesFormatDTO> activityFormats;
    private List<Long> deletedActivityFormats;
    private UpdateActivityFormatsSubType1DTO updateFieldIdUse;

}
