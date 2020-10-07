package jp.classmethod.premembers.report.job.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
public class JobConfig {

    @Value("${jobCode}")
    private String jobCode;
    @Value("${reportId}")
    private String reportId;
    @Value("${logId}")
    private String logId;
    @Value("${temporary.directory}")
    private String temporaryDirectory;
    @Value("${report.excel.template.jajp.filepath.v.1.0}")
    private String reportExcelTemplateFilepathV1_0;
}
