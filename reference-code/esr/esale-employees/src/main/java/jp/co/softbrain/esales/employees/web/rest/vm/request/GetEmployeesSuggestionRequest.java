package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.GetEmployeesSuggestionSubInDTO;
import lombok.Data;

@Data
public class GetEmployeesSuggestionRequest implements Serializable {	
	private static final long serialVersionUID = -8336885210247068927L;
	private String keyWords;
	private String startTime;
	private String endTime;
	private Long searchType;
	private Long offSet;
	private Long limit;
	private List<GetEmployeesSuggestionSubInDTO> listItemChoice;
	private Long relationFieldI;
}
