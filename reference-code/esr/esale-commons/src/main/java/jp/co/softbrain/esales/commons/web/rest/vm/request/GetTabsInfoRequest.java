package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * response for API getTabsInfo
 * 
 * @author nguyentrunghieu
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetTabsInfoRequest implements Serializable {
    private static final long serialVersionUID = -7797044108855605460L;
    /**
     * tabBelong
     */
    private Integer tabBelong;
}
