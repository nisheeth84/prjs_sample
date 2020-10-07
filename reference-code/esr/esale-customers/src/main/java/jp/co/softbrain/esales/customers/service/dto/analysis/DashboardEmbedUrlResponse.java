package jp.co.softbrain.esales.customers.service.dto.analysis;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "of")
public class DashboardEmbedUrlResponse {
    private String embedUrl;
}
