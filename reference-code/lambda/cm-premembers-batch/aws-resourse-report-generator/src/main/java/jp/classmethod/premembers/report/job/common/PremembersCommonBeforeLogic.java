package jp.classmethod.premembers.report.job.common;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.services.batch.AWSBatch;
import com.amazonaws.services.batch.AWSBatchClientBuilder;
import com.amazonaws.services.batch.model.DescribeJobsRequest;
import com.amazonaws.services.batch.model.DescribeJobsResult;

import jp.classmethod.premembers.report.constant.ComConst;
import jp.classmethod.premembers.report.exception.PremembersApplicationException;
import jp.classmethod.premembers.report.job.config.AWSConfig;
import jp.classmethod.premembers.report.job.config.JobConfig;
import jp.classmethod.premembers.report.repository.PMReports;
import jp.classmethod.premembers.report.repository.entity.PMReportsItem;
import jp.classmethod.premembers.report.util.AWSUtil;
import jp.classmethod.premembers.report.util.DateUtil;
import jp.classmethod.premembers.report.util.FileUtil;
import jp.classmethod.premembers.report.util.PremembersUtil;

@Component
public class PremembersCommonBeforeLogic {
    @Autowired
    private PMReports pmReports;
    @Autowired
    private AWSConfig awsConfig;
    @Autowired
    private JobConfig jobConfig;

    @Value("${awsbatch.endpoint}")
    private String batchEndpoint;

    @Value("${awsbatch.region}")
    private String batchRegion;

    private static String ERR_CODE = "RPTJ-001";
    private final static Logger LOGGER = LoggerFactory.getLogger(PremembersCommonBeforeLogic.class);

    public void updateLogStreamName(String reportId, String logId) {
        // S3からレポートジョブ履歴ファイルを取得します。
        JSONObject jsonObject = null;
        String pathReportLog = String.format(AWSUtil.PATH_REPORT_LOG, reportId);
        try {
            String jsonStr = AWSUtil.readS3(awsConfig, awsConfig.getS3BatchLogBucket(),
                    pathReportLog + logId + ComConst.JSON_FILE_EXT);
            jsonObject = new JSONObject(jsonStr);
        } catch (Exception e) {
            LOGGER.error(MessageFormat.format("[{0}] 対象のレポートジョブ履歴ファイルが取得できませんでした。: ReportID={1}, LogID={2}", ERR_CODE,
                    reportId, logId));
            LOGGER.error(PremembersUtil.getStackTrace(e));
            return;
        }
        String logStreamName = null;
        String jobId = jsonObject.getString("JobID");
        try {
            logStreamName = getLogStreamName(jobId);
        } catch (PremembersApplicationException pae) {
            LOGGER.error(PremembersUtil.getStackTrace(pae));
            return;
        } catch (Exception e) {
            LOGGER.error(MessageFormat.format("[{0}] ジョブストリーム名取得に失敗しました: JobID={1}", ERR_CODE, jobId));
            LOGGER.error(PremembersUtil.getStackTrace(e));
            return;
        }

        // ログストリーム名を追記し、レポートジョブ履歴ファイルを更新します。
        List<String> lsLogStreamName = new ArrayList<String>();
        if (jsonObject.has("LogStreamName")) {
            JSONArray jArray = jsonObject.getJSONArray("LogStreamName");
            if (jArray != null) {
                for (int i = 0; i < jArray.length(); i++) {
                    lsLogStreamName.add(jArray.getString(i));
                }
            }
        }
        if (!lsLogStreamName.contains(logStreamName)) {
            lsLogStreamName.add(logStreamName);
            jsonObject.put("LogStreamName", new JSONArray(lsLogStreamName));
            jsonObject.put("UpdatedAt", DateUtil.getCurrentDateUTC());
        }

        // Upload file to S3
        try {
            String temporaryDirectory = jobConfig.getTemporaryDirectory();
            FileUtil.outputFile(temporaryDirectory + pathReportLog, logId + ComConst.JSON_FILE_EXT, jsonObject.toString(4));
            AWSUtil.uploadS3(awsConfig, awsConfig.getS3BatchLogBucket(), pathReportLog + logId + ComConst.JSON_FILE_EXT,
                    temporaryDirectory + pathReportLog + logId + ComConst.JSON_FILE_EXT);
        } catch (Exception e) {
            LOGGER.error(MessageFormat.format("チェックジョブ履歴ファイルのログストリーム名更新に失敗しました。:  ReportID={1}, LogID={2}", reportId,
                    logId));
            LOGGER.error(PremembersUtil.getStackTrace(e));
            return;
        }
        LOGGER.info("-- ログストリーム名取得処理終了 ----");
    }

    public String getLogStreamName(String jobId) {
        AWSBatch client;
        String logStreamName = null;

        client = AWSBatchClientBuilder.standard()
                .withEndpointConfiguration(new EndpointConfiguration(batchEndpoint, batchRegion)).build();

        DescribeJobsResult result = client.describeJobs(new DescribeJobsRequest().withJobs(jobId));

        if (result != null && result.getJobs().size() > 0) {
            logStreamName = result.getJobs().get(0).getContainer().getLogStreamName();
        } else {
            throw new PremembersApplicationException(ERR_CODE,
                    MessageFormat.format("[{0}] ジョブ情報取得に失敗しました: JobID={1}", ERR_CODE, jobId));
        }

        return logStreamName;
    }

    public void updateReportStatusError(String reportId) {
        PMReportsItem item;
        try {
            item = pmReports.read(reportId);
        } catch (Exception e) {
            LOGGER.error(MessageFormat.format("[{0}] レポート情報取得に失敗しました: ReportID={1}", ERR_CODE, reportId));
            LOGGER.error(PremembersUtil.getStackTrace(e));
            return;
        }
        if (item == null) {
            LOGGER.error(MessageFormat.format("[{0}] 対象のレポート情報がありません: ReportID={1}", ERR_CODE, reportId));
            return;
        }

        try {
            String originUpdatedAt = item.getUpdatedAt();
            item.setErrorCode(ERR_CODE);

            pmReports.update(item, originUpdatedAt);
        } catch (Exception e) {
            LOGGER.error(MessageFormat.format("[{0}] レポート情報のステータス更新に失敗しました: ReportID={1}", ERR_CODE, reportId));
            LOGGER.error(PremembersUtil.getStackTrace(e));
            return;
        }
    }
}
