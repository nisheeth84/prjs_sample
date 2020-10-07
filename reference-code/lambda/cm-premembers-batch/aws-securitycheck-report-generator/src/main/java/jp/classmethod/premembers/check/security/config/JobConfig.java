package jp.classmethod.premembers.check.security.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
public class JobConfig {
    @Value("${checkHistoryId}")
    private String checkHistoryId;
    @Value("${logId}")
    private String logId;
    @Value("${lang}")
    private String lang;
    @Value("${temporary.directory}")
    private String temporaryDirectory;
}
