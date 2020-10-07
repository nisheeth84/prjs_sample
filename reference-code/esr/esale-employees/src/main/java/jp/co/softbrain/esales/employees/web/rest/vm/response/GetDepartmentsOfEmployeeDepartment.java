package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GetDepartmentsOfEmployeeDepartment implements Serializable {

    private static final long serialVersionUID = -8647507749834810723L;

    private Long departmentId;

    private String departmentName;

    private Long parentId;

    @Builder.Default
    private List<GetDepartmentsOfEmployeeDepartment> childDepartments = new ArrayList<>();
}
