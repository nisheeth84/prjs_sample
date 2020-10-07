package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;
import java.util.List;

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
public class GetTabsInfoResponse implements Serializable {

    private static final long serialVersionUID = -7614231552413357038L;

    private List<TabsInfoDTO> tabsInfo;
}
