package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

@Data
public class GetIsExistEmployeeByKeyRequest implements Serializable {
	private static final long serialVersionUID = 6611870318055048065L;
	private String keyFieldName;
	private String fieldValue;
}
