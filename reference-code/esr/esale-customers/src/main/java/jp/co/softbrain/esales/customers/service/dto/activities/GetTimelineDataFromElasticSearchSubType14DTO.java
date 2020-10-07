package jp.co.softbrain.esales.customers.service.dto.activities;
/**
 * A DTO for the GetDataSyncElasticSearch API.
 * 
 * @author kientt
 */
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
@Data
@EqualsAndHashCode
public class GetTimelineDataFromElasticSearchSubType14DTO implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 1591589984138L;
    private String                                   jaJp;
    private String                                   enUs;
    private String                                   zhCn;
}
