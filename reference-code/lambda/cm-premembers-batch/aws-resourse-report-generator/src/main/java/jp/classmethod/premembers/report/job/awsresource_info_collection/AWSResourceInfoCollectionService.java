package jp.classmethod.premembers.report.job.awsresource_info_collection;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

import jp.classmethod.premembers.report.constant.ComConst;
import jp.classmethod.premembers.report.constant.MsgConst;
import jp.classmethod.premembers.report.exception.PremembersApplicationException;
import jp.classmethod.premembers.report.job.common.AsyncTaskStatus;
import jp.classmethod.premembers.report.job.config.AWSConfig;
import jp.classmethod.premembers.report.job.config.JobConfig;
import jp.classmethod.premembers.report.job.config.ReportConfig;
import jp.classmethod.premembers.report.properties.MsgProps;
import jp.classmethod.premembers.report.repository.PMReports;
import jp.classmethod.premembers.report.repository.entity.PMReportsItem;
import jp.classmethod.premembers.report.util.AWSUtil;
import jp.classmethod.premembers.report.util.FileUtil;

@Component
public class AWSResourceInfoCollectionService {
    @Autowired
    private PMReports pmReports;
    @Autowired
    private AWSResourceInfoCollectionTask task;
    @Autowired
    private AsyncTaskStatus taskStatus;

    @Autowired
    private AWSConfig awsConfig;

    @Autowired
    private ReportConfig reportConfig;

    @Autowired
    private JobConfig jobConfig;

    @Qualifier("threadPool")
    @Autowired
    private ThreadPoolTaskExecutor threadPool;

    private final static Logger LOGGER = LoggerFactory.getLogger(AWSResourceInfoCollectionService.class);

    /**
     * @param reportId
     *            レポートID
     */
    public void execute(String reportId) {
        LOGGER.info("-- AWS利用状況情報収集 処理開始 ----------------");
        try {
            PMReportsItem item = getReport(reportId, new String[]{"CLCT-001", reportId});
            // レポート情報のステータスチェック
            int status = item.getReportStatus();
            if (status != ComConst.STANDBY) {
                String msg = String.format("[%s]レポート情報作成ステータスが一致しません。: ReportID=%s, ReportStatus=%d", "CLCT-001",
                        reportId, status);
                LOGGER.warn(msg);
                throw new PremembersApplicationException("CLCT-001", msg);
            }
            // レポート情報のステータスを「情報収集中」に更新
            item.setReportStatus(ComConst.COLLECTING_INFO);
            item.setSchemaVersion(Double.parseDouble(reportConfig.getSchemaVersionLatest()));
            updateReport(item, new String[]{"CLCT-002", reportId});

            // S3から対象のファイルを削除
            AWSUtil.s3FileCleanUp(awsConfig.getS3Endpoint(), awsConfig.getS3Region(), awsConfig.getS3ReportBucket(),
                    reportId + "/");
            // 作業ディレクトリの削除を行います
            FileUtil.deleteDirectory(jobConfig.getTemporaryDirectory());
            // AWS利用状況情報収集処理を実行（AWSアカウントごとに並列処理）
            List<String> awsAccounts = item.getAwsAccounts();
            String projectId = item.getProjectId();
            for (String awsAccountId : awsAccounts) {
                task.execute(awsAccountId, projectId, reportId);
            }
            threadPool.shutdown();
            // 作業ディレクトリの削除を行います
            FileUtil.deleteDirectory(jobConfig.getTemporaryDirectory());

            if (taskStatus.isError()) {
                String msg = String.format("[%s]AWS利用状況情報の収集処理に失敗しました。", "CLCT-003");
                LOGGER.error(msg);
                throw new PremembersApplicationException("CLCT-003", msg);
            }
            // レポート情報のステータスを「情報収集完了」に更新
            item = getReport(reportId, new String[]{"CLCT-998", reportId});
            item.setReportStatus(ComConst.COLLECT_COMPLETE);
            updateReport(item, new String[]{"CLCT-002", reportId});
        } catch (PremembersApplicationException e) {
            PMReportsItem item = getReport(reportId, new String[]{"CLCT-999", reportId});
            item.setReportStatus(ComConst.STANDBY);
            item.setErrorCode(e.getCode());
            updateReport(item, new String[]{"CLCT-999", reportId});
            throw e;
        }
        LOGGER.info("-- AWS利用状況情報収集 処理終了 ----------------");
    }

    /**
     * getReport
     *
     * @author TuanDV
     * @param reportId
     * @param params
     * @return {@link PMReportsItem}
     */
    private PMReportsItem getReport(String reportId, String[] params) {
        PMReportsItem item = null;
        try {
            item = pmReports.read(reportId);
        } catch (RuntimeException e) {
            String msg = MsgProps.getString(MsgConst.ERR_CLCT_001, params);
            LOGGER.error(msg);
            throw new PremembersApplicationException(params[0], msg);
        }
        if (item == null) {
            String msg = MsgProps.getString(MsgConst.MSG_CLCT_001, params);
            LOGGER.warn(msg);
            throw new PremembersApplicationException(params[0], msg);
        }
        return item;
    }

    /**
     * updateReport
     *
     * @author TuanDV
     * @param reportId
     * @param params
     */
    private void updateReport(PMReportsItem item, String[] params) {
        String updatedAt = item.getUpdatedAt();
        try {
            pmReports.update(item, updatedAt);
        } catch (RuntimeException e) {
            String msg = MsgProps.getString(MsgConst.ERR_CLCT_002, params);
            LOGGER.error(msg);
            throw new PremembersApplicationException(params[0], msg);
        }
    }
}
