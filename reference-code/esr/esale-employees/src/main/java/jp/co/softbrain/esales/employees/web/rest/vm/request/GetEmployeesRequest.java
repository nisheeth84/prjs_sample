package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;

@Data
public class GetEmployeesRequest implements Serializable {
	private static final long serialVersionUID = 3401106064195997389L;
	
	private List<SearchItem> searchConditions;
	private List<SearchItem> filterConditions;
	private String localSearchKeyword;
	private Integer selectedTargetType;
	private Long selectedTargetId;
	private Boolean isUpdateListView;
	private List<OrderValue> orderBy;
	private Long offset;
	private Long limit;
}
