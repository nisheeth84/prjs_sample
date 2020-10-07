package jp.co.softbrain.esales.employees.service.dto.tenants;

import java.io.Serializable;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for response from API Status Contract
 *
 * @author Lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class StatusContractDataDTO implements Serializable {

  /**
   * serialVersionUID
   */
  private static final long serialVersionUID = 8074941906093394828L;

  /**
   * トライアル、1：起動, 2：停止, 3：削除
   */
  private Integer contractStatus;

  private Date trialEndDate;

  private Integer creationStatus;
}
