package jp.co.softbrain.esales.employees.service.dto.tenants;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for response from API getCompanyName
 * 
 * @author Lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompanyNameResponseDTO implements Serializable {

  /**
   * serialVersionUID
   */
  private static final long serialVersionUID = 8074941906093394828L;

  private String companyName;
}
