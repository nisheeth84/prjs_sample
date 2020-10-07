package jp.co.softbrain.esales.customers.service.dto.employees;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class GetGroupsRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 185739326503282139L;
    private List<Long> groupIds;
    private Boolean getEmployeesFlg;
}
