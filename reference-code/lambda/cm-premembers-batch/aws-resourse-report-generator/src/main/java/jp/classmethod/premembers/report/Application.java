/**
 *
 */
package jp.classmethod.premembers.report;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import jp.classmethod.premembers.report.constant.ComConst;
import jp.classmethod.premembers.report.job.awsresource_info_collection.AWSResourceInfoCollectionService;
import jp.classmethod.premembers.report.job.common.ExitCode;
import jp.classmethod.premembers.report.job.common.JobCode;
import jp.classmethod.premembers.report.job.common.PremembersCommonBeforeLogic;
import jp.classmethod.premembers.report.job.config.JobConfig;
import jp.classmethod.premembers.report.job.report_output.excel.ExcelReportOutputService;
import jp.classmethod.premembers.report.job.report_output.json.JsonReportOutputService;
import jp.classmethod.premembers.report.util.PremembersUtil;

/**
 * @author tagomasayuki
 *
 */
@SpringBootApplication
public class Application {
    @Autowired
    private JobConfig config;

    @Autowired
    private AWSResourceInfoCollectionService awsResourceInfoCollectionService;
    @Autowired
    private JsonReportOutputService jsonReportOutputService;
    @Autowired
    private ExcelReportOutputService excelReportOutputService;
    @Autowired
    private PremembersCommonBeforeLogic commonBeforeLogic;

    private final static Logger LOGGER = LoggerFactory.getLogger(Application.class);

    /**
     * プレメンバーズ・AWSリソース利用状況レポート作成バッチアプリケーション。
     *
     * @param args
     *            実行時引数。以下は必須項目。
     *            <ul>
     *            <li>ジョブコード。実行するジョブを示す。--jobCode={jobCode}</li>
     *            <li>レポートID。処理対象のレポート情報のID。--reportId={reportId}</li>
     *            <li>ログID。このジョブの実行履歴情報のID。--logId={logId}</li>
     *            </ul>
     */
    public static void main(String[] args) {
        int exitCode = ExitCode.SUCCESS.getInt();
        try {
            try (ConfigurableApplicationContext ctx = SpringApplication.run(Application.class, args)) {
                Application app = ctx.getBean(Application.class);
                LOGGER.info("** バッチアプリケーション起動 ***************");
                app.run();
            }
        } catch (Exception e) {
            exitCode = ExitCode.ERROR.getInt();
            LOGGER.error(PremembersUtil.getStackTrace(e));
        } finally {
            LOGGER.info("** バッチアプリケーション終了 ***************");
            System.exit(exitCode);
        }
    }

    private void run() throws Exception {
        String jobCode = config.getJobCode();
        String reportId = config.getReportId();
        LOGGER.info("== バッチアプリケーション処理開始 ================");
        LOGGER.info("  ジョブコード: " + jobCode);
        LOGGER.info("  レポートID: " + config.getReportId());
        LOGGER.info("  ログID: " + config.getLogId());
        LOGGER.info("=================================================");

        validateRequiredArguments();
        updateLogStreamName();

        if (JobCode.COLLECT_AWS_RESOURCE_INFO.getString().equals(jobCode)) {
            awsResourceInfoCollectionService.execute(reportId);

        } else if (JobCode.OUTPUT_REPORT_JSON.getString().equals(jobCode)) {
            jsonReportOutputService.execute(reportId);

        } else if (JobCode.OUTPUT_REPORT_EXCEL.getString().equals(jobCode)) {
            excelReportOutputService.execute(reportId);

        } else {
            commonBeforeLogic.updateReportStatusError(config.getReportId());
            throw new IllegalArgumentException("無効なジョブコードです:" + config.getJobCode());
        }
        LOGGER.info("== バッチアプリケーション処理終了 ================");
    }

    private void validateRequiredArguments() {
        if (ComConst.EMPTY.equals(config.getJobCode()) || ComConst.EMPTY.equals(config.getReportId())
                || ComConst.EMPTY.equals(config.getLogId())) {
            commonBeforeLogic.updateReportStatusError(config.getReportId());
            throw new IllegalArgumentException("引数不足です。ジョブコード（--jobCode）、レポートID（--reportId）、ログID（--logId）の3つは必須項目です。");
        }
    }

    private void updateLogStreamName() {
        commonBeforeLogic.updateLogStreamName(config.getReportId(), config.getLogId());
    }

}
