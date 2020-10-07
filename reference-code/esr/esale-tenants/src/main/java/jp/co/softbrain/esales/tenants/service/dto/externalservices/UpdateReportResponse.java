package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response entity for API update-report
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateReportResponse implements Serializable {

    private static final long serialVersionUID = 335793219279520323L;

    private Long reportId;
}
