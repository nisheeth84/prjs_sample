package jp.classmethod.premembers.report.job.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
public class ReportConfig {
    @Value("${report.schema.version.latest}")
    private String schemaVersionLatest;

}
