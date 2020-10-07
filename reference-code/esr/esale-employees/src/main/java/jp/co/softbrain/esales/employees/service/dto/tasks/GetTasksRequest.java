package jp.co.softbrain.esales.employees.service.dto.tasks;

import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 *
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class GetTasksRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2626664190002948167L;

    private List<Integer> statusTaskIds;
    private String searchLocal;
    private GetTasksInLocalNavigationsDTO localNavigationConditons;
    private List<SearchItem> searchConditions;
    private List<SearchItem> filterConditions;
    private List<OrderValue> orderBy;
    private Long limit;
    private Long offset;
    private Integer filterByUserLoginFlg;

}
