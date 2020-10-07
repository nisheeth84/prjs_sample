package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetDepartmentsOfEmployeeQueryResult implements Serializable {

    private static final long serialVersionUID = 3985216936820880699L;

    private Long departmentId;

    private String departmentName;

    private Long parentId;

    private Long currentId;
}
