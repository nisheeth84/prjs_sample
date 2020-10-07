package jp.classmethod.premembers.check.security.job.common;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jp.classmethod.premembers.check.security.config.AWSConfig;
import jp.classmethod.premembers.check.security.config.JobConfig;
import jp.classmethod.premembers.check.security.constant.ComConst;
import jp.classmethod.premembers.check.security.exception.PremembersApplicationException;
import jp.classmethod.premembers.check.security.util.AWSUtil;
import jp.classmethod.premembers.check.security.util.DateUtil;
import jp.classmethod.premembers.check.security.util.FileUtil;
import jp.classmethod.premembers.check.security.util.PremembersUtil;

@Component
public class PremembersCommonBeforeLogic {
    private final static Logger LOGGER = LoggerFactory.getLogger(PremembersCommonBeforeLogic.class);

    @Autowired
    private AWSConfig awsConfig;
    @Autowired
    private JobConfig jobConfig;

    /**
     * update log stream name
     *
     * @param checkHistoryId
     * @param logId
     */
    public void updateLogStreamName(String checkHistoryId, String logId) {
        // ログストリーム名取得処理の開始ログを出力します。
        LOGGER.info("-- ログストリーム名取得処理開始 ----");

        // S3からチェックジョブ履歴ファイルを取得します。
        JSONObject jsonObject = null;
        String pathCheckLog = String.format(ComConst.PATH_BATCH_CHECK_LOG, checkHistoryId);
        try {
            String jsonStr = AWSUtil.readS3(awsConfig, awsConfig.getS3BatchLogBucket(),
                    pathCheckLog + logId + ComConst.JSON_FILE_EXT);
            jsonObject = new JSONObject(jsonStr);
        } catch (Exception e) {
            LOGGER.error(PremembersUtil.getStackTrace(e));
            String msg = String.format("対象のチェックジョブ履歴ファイルの取得に失敗しました。: CheckHistoryID=%s, LogID=%s", checkHistoryId,
                    logId);
            throw new PremembersApplicationException(ComConst.ERROR_CODE, msg);
        }

        // ジョブ情報からログストリーム名を取得します。
        String logStreamName = null;
        String jobId = jsonObject.getString("JobID");
        try {
            logStreamName = AWSUtil.getLogStreamName(jobId, awsConfig.getBatchEndpoint(), awsConfig.getBatchRegion());
        } catch (Exception e) {
            LOGGER.error(PremembersUtil.getStackTrace(e));
            LOGGER.error(PremembersUtil.getStackTrace(e));
            throw new PremembersApplicationException(ComConst.ERROR_CODE, e.getMessage());
        }

        // ログストリーム名を追記し、チェックジョブ履歴ファイルを保存します。
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
            FileUtil.outputFile(temporaryDirectory + pathCheckLog, logId + ComConst.JSON_FILE_EXT,
                    jsonObject.toString(4));
            AWSUtil.uploadS3(awsConfig, awsConfig.getS3BatchLogBucket(), pathCheckLog + logId + ComConst.JSON_FILE_EXT,
                    temporaryDirectory + pathCheckLog + logId + ComConst.JSON_FILE_EXT);
        } catch (Exception e) {
            LOGGER.error(PremembersUtil.getStackTrace(e));
            LOGGER.error(MessageFormat.format("チェックジョブ履歴ファイルのログストリーム名更新に失敗しました。:  CheckHistoryID=%s, LogID=%s",
                    checkHistoryId, logId));
            throw new PremembersApplicationException(ComConst.ERROR_CODE, e.getMessage());
        }
        LOGGER.info("-- ログストリーム名取得処理終了 ----");
    }

}
