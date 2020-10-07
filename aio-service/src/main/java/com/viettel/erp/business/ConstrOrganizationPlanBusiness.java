package com.viettel.erp.business;

import com.viettel.erp.dto.CatEmployeeDTO;
import com.viettel.erp.dto.ConstrOrganizationPlanDTO;

import java.util.List;

public interface ConstrOrganizationPlanBusiness {

    long count();

    List<ConstrOrganizationPlanDTO> getAllConstrOrganizationPlan(ConstrOrganizationPlanDTO dto);

    void deleteConstrOrganizationPlan(List<String> listConstrOrgPlanId);

    List<CatEmployeeDTO> getEmployee(String contructID);

    String autoGenCodeConstrOrganizationPlan();

    boolean checkStatusDatabase(String constrConstrOrganizationPlan);

    Long addConstrOrganizationPlan(ConstrOrganizationPlanDTO obj) throws Exception;

    List<ConstrOrganizationPlanDTO> getAllConstrOrganizationPlanChild(ConstrOrganizationPlanDTO dto);


}
