package jp.classmethod.premembers.check.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import jp.classmethod.premembers.check.security.config.JobConfig;
import jp.classmethod.premembers.check.security.job.cis.report_output.pdf.SecurityCheckReportLogic;
import jp.classmethod.premembers.check.security.job.common.ExitCode;
import jp.classmethod.premembers.check.security.util.PremembersUtil;

/**
 * @author tagomasayuki
 *
 */
@SpringBootApplication
public class Application {
    @Autowired
    private JobConfig config;
    @Autowired
    private SecurityCheckReportLogic securityCheckReportLogic;

    private final static Logger LOGGER = LoggerFactory.getLogger(Application.class);

    /**
     * プレメンバーズ・セキュリティチェック結果レポート作成バッチアプリケーション。
     *
     * @param args
     *            実行時引数。以下は必須項目。
     *            <ul>
     *            <li>チェック履歴ID。処理対象のチェック履歴情報のID。--checkHistoryId={checkHistoryId}</li>
     *            <li>ログID。このジョブの実行履歴情報のID。--logId={logId}</li>
     *            <li>レポートの出力言語。"ja"|"en"(default="ja") --lang={lang}</li>
     *            </ul>
     */
    public static void main(String[] args) {
        int exitCode = ExitCode.SUCCESS.getInt();
        try {
            try (ConfigurableApplicationContext ctx = SpringApplication.run(Application.class, args)) {
                LOGGER.info("** バッチアプリケーション起動 ***************");
                Application app = ctx.getBean(Application.class);
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
        String checkHistoryId = config.getCheckHistoryId();
        String logId = config.getLogId();
        String lang = config.getLang();

        LOGGER.info("== バッチアプリケーション処理開始 ================");
        LOGGER.info("  チェック履歴ID: " + checkHistoryId);
        LOGGER.info("  ログID: " + logId);
        LOGGER.info("  出力言語: " + lang);
        LOGGER.info("=================================================");

        // Do Export PDF
        securityCheckReportLogic.doCheckReport(checkHistoryId, logId, lang);

        LOGGER.info("== バッチアプリケーション処理終了 ================");
    }
}
