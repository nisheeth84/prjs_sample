package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * Response entity for API create-customer
 *
 * @author tongminhcuong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetDataSourceIdResponse implements Serializable {

    private static final long serialVersionUID = 9001651631230991914L;

    private List<Long> dataSourceIds;
}
