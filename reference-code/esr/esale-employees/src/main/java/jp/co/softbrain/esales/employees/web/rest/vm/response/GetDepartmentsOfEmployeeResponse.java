package jp.co.softbrain.esales.employees.web.rest.vm.response;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
@Builder
public class GetDepartmentsOfEmployeeResponse implements Serializable {

    private static final long serialVersionUID = -1103308357453078350L;

    @Builder.Default
    private List<GetDepartmentsOfEmployeeDepartment> departments = new ArrayList<>();
}
