package jp.classmethod.premembers.report.job.report_output.json;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

import com.amazonaws.regions.Regions;

import jp.classmethod.premembers.report.constant.ComConst;
import jp.classmethod.premembers.report.exception.PremembersApplicationException;
import jp.classmethod.premembers.report.job.common.AsyncTaskStatus;
import jp.classmethod.premembers.report.job.config.AWSConfig;
import jp.classmethod.premembers.report.repository.PMReports;
import jp.classmethod.premembers.report.repository.entity.PMReportsItem;
import jp.classmethod.premembers.report.util.AWSUtil;
import jp.classmethod.premembers.report.util.DateUtil;

@Component
public class JsonReportOutputService {

    @Autowired
    private AWSConfig awsConfig;
    @Autowired
    private JsonReportOutputGlobalTask jsonReportOutputGlobalTask;
    @Autowired
    private JsonReportOutputRegionTask jsonReportOutputRegionTask;
    @Autowired
    private AsyncTaskStatus taskStatus;
    @Autowired
    private PMReports pmReports;

    @Qualifier("threadPool")
    @Autowired
    private ThreadPoolTaskExecutor threadPool;

    private final static String JSON_001 = "JSON-001";

    private final static String JSON_002 = "JSON-002";

    private final static String JSON_003 = "JSON-003";

    private final static String JSON_998 = "JSON_998";

    private final static String JSON_999 = "JSON_999";

    private final static Logger LOGGER = LoggerFactory.getLogger(JsonReportOutputService.class);

    /**
     * 中間ファイル作成
     *
     * @param reportId
     *            レポートID
     * @throws Exception
     */
    public void execute(String reportId) throws Exception {
        LOGGER.info("-- JSON形式レポート作成 処理開始 ----------------");

        PMReportsItem pmReportsItem = null;

        try {

            // レポートテーブル情報を取得する
            pmReportsItem = getPmReportsInfo(reportId, JSON_001);

            // レポートテーブル情報のステータスチェック
            checkReportStatus(reportId, pmReportsItem);

            // レポートのステータスを「変換中」に更新
            updateReportStatusConversioning(reportId, pmReportsItem);

            // S3にアップロードされたファイルのクリーンアップ
            s3FileCleanUp(reportId);

            List<String> awsAccounts = pmReportsItem.getAwsAccounts();
            String schemaVersion = String.valueOf(pmReportsItem.getSchemaVersion());
            String reportName = pmReportsItem.getReportName();

            // 中間ファイル（JSON形式レポート）作成処理
            createReportfile(reportId, awsAccounts, schemaVersion, reportName);

            // レポートテーブル情報を取得する
            pmReportsItem = getPmReportsInfo(reportId, JSON_998);

            // レポートのステータスを「変換完了」に更新
            updateReportStatusConversionComplete(reportId, pmReportsItem);

        } catch (PremembersApplicationException e) {

            // レポートテーブル情報を取得する
            pmReportsItem = getPmReportsInfo(reportId, JSON_999);

            // レポートのステータスを「情報収集完了」に更新
            updateReportStatusCollectComplete(reportId, pmReportsItem, e.getCode());

            throw e;
        }
        LOGGER.info("-- JSON形式レポート作成 処理終了 ----------------");
    }

    /**
     * 中間ファイル（JSON形式レポート）作成処理
     *
     * @param reportId
     *            レポートID
     * @param awsAccounts
     *            AWSアカウント
     * @param schemaVersion
     *            レポート書式バージョン
     * @param reportName
     *            レポート名
     */
    private void createReportfile(String reportId, List<String> awsAccounts, String schemaVersion, String reportName)
            throws Exception {
        LOGGER.info("-- JSONレポート作成処理開始 ----------------");

        // レポートファイル作成 region
        // accountId,region毎にファイル作成
        for (String accountId : awsAccounts) {

            // レポートファイル作成 global
            // accountId毎にファイル作成
            jsonReportOutputGlobalTask.execute(reportId, accountId, schemaVersion, reportName);

            Regions[] regionsArray = AWSUtil.getEnableRegions();

            for (Regions regions : regionsArray) {
                jsonReportOutputRegionTask.execute(reportId, accountId, regions.getName(), schemaVersion, reportName);
            }
        }

        threadPool.shutdown();

        sleep10ms();

        if (taskStatus.isError()) {
            // ログレベル： ERROR
            LOGGER.error("中間ファイル（JSON形式レポート）の生成処理に失敗しました。");
            // エラーコード：JSON-003
            throw new PremembersApplicationException(JSON_003, "中間ファイル（JSON形式レポート）の生成処理に失敗しました。");
        }

        LOGGER.info("-- JSONレポート作成処理完了 ----------------");
    }

    private void sleep10ms() {
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            throw new PremembersApplicationException("999", e);
        }
    }

    /**
     * レポートテーブル情報を取得する
     *
     * @param reportId
     *            レポートID
     * @return PMReportsItem レポートテーブル情報
     */
    public PMReportsItem getPmReportsInfo(String reportId, String errorCode) {
        LOGGER.info("-- レポートテーブル情報取得開始 ----------------");

        PMReportsItem pmReportsItem = null;

        try {
            // レポートテーブルから、レポート情報を取得します。
            pmReportsItem = pmReports.read(reportId);

        } catch (RuntimeException e) {
            // ログレベル： ERROR
            LOGGER.error("レポート情報取得に失敗しました: ReportID=" + reportId);
            throw new PremembersApplicationException(errorCode, "レポート情報取得に失敗しました: ReportID=" + reportId);
        }

        // レポートテーブルからのレコード取得結果が0件だった場合
        if (pmReportsItem == null) {
            // ログレベル： ERROR
            LOGGER.error("対象のレポート情報がありません: ReportID=" + reportId);
            throw new PremembersApplicationException(errorCode, "対象のレポート情報がありません: ReportID=" + reportId);
        }

        LOGGER.info("-- レポートテーブル情報取得完了 ----------------");

        return pmReportsItem;
    }

    /**
     * レポート情報のステータスチェック
     *
     * @param reportId
     *            レポートID
     * @param pmReportsItem
     *            レポートテーブル情報
     */
    public void checkReportStatus(String reportId, PMReportsItem pmReportsItem) {
        LOGGER.info("-- レポート情報のステータスチェック開始 ----------------");

        // レポート情報のステータス取得
        int status = pmReportsItem.getReportStatus();

        // Statusが「2」以外の場合はエラー。
        if (ComConst.COLLECT_COMPLETE != status) {
            // ログレベル： ERROR
            LOGGER.error("レポート情報作成ステータスが一致しません。: ReportID=" + reportId + ", ReportStatus=" + status);
            // エラーコード：JSON-001
            throw new PremembersApplicationException(JSON_001,
                    "レポート情報作成ステータスが一致しません。: ReportID=" + reportId + ", ReportStatus=" + status);
        }

        LOGGER.info("-- レポート情報のステータスチェック完了 ----------------");
    }

    /**
     * レポート情報のステータスを更新します。
     *
     * @param reportId
     *            レポートID
     * @param pmReportsItem
     *            レポートテーブル情報
     */
    public void updateReportStatusConversioning(String reportId, PMReportsItem pmReportsItem) {

        LOGGER.info("-- レポート情報のステータス更新開始(変換中) ----------------");

        try {

            pmReportsItem.setReportStatus(ComConst.CONVERSIONING);

            // 旧更新日時を退避
            String updatedAt = pmReportsItem.getUpdatedAt();
            // レポートのステータスを「変換中」に更新
            pmReports.update(pmReportsItem, updatedAt);

            // レコード更新に失敗したら、ログを出力してエラー終了処理を実行します。
        } catch (RuntimeException e) {
            // ログレベル： ERROR
            LOGGER.error("レポート情報のステータス更新に失敗しました。: ReportID=" + reportId);
            // レポート情報にエラーコードを設定して更新
            throw new PremembersApplicationException(JSON_002, "レポート情報のステータス更新に失敗しました。: ReportID=" + reportId, e);
        }

        LOGGER.info("-- レポート情報のステータス更新完了(変換中) ----------------");
    }

    /**
     * レポートのステータスを「変換完了」に更新します。
     *
     * @param reportId
     *            レポートID
     * @param pmReportsItem
     *            レポートテーブル情報
     */
    public void updateReportStatusConversionComplete(String reportId, PMReportsItem pmReportsItem) {

        LOGGER.info("-- レポート情報のステータス更新開始(変換完了) ----------------");

        try {

            pmReportsItem.setReportStatus(ComConst.CONVERSION_COMPLETE);

            pmReportsItem.setErrorCode(null);

            // 更新日時を取得
            String newUpdatedAt = DateUtil.getCurrentDateUTC();
            // 旧更新日時を退避
            String updatedAt = pmReportsItem.getUpdatedAt();

            pmReportsItem.setJsonOutputTime(newUpdatedAt);
            // レポートのステータスを「変換完了」に更新
            pmReports.update(pmReportsItem, updatedAt);

            // レコード更新に失敗したら、ログを出力してエラー終了処理を実行します。
        } catch (RuntimeException e) {
            // ログレベル： ERROR
            LOGGER.error("レポート情報のステータス更新に失敗しました。: ReportID=" + reportId);
            // レポート情報にエラーコードを設定して更新
            throw new PremembersApplicationException(JSON_998, "レポート情報のステータス更新に失敗しました。: ReportID=" + reportId, e);
        }

        LOGGER.info("-- レポート情報のステータス更新完了(変換完了) ----------------");
    }

    /**
     * レポートのステータスを「情報収集完了」に更新します。
     *
     * @param reportId
     *            レポートID
     * @param pmReportsItem
     *            レポートテーブル情報
     * @param errCode
     *            エラーコード
     */
    public void updateReportStatusCollectComplete(String reportId, PMReportsItem pmReportsItem, String errCode) {

        LOGGER.info("-- レポート情報のステータス更新開始(情報収集完了) ----------------");

        try {

            pmReportsItem.setReportStatus(ComConst.COLLECT_COMPLETE);
            pmReportsItem.setErrorCode(errCode);

            // 旧更新日時を退避
            String updatedAt = pmReportsItem.getUpdatedAt();
            // レポートのステータスを「情報収集完了」に更新
            pmReports.update(pmReportsItem, updatedAt);

            // レコード更新に失敗したら、ログを出力してエラー終了処理を実行します。
        } catch (RuntimeException e) {

            // ログレベル： ERROR
            LOGGER.error("レポート情報のステータス更新に失敗しました。: ReportID=" + reportId);
            throw new PremembersApplicationException(JSON_999, "レポート情報のステータス更新に失敗しました。: ReportID=" + reportId, e);
        }

        LOGGER.info("-- レポート情報のステータス更新完了(情報収集完了) ----------------");
    }

    /**
     * S3にアップロードされたファイルのクリーンアップ
     * {report_id}/source/または{report_id}/report_json/に該当するファイルをS3から全て削除します。
     *
     * @param reportId
     *            レポートID
     */
    public void s3FileCleanUp(String reportId) {

        LOGGER.info("-- S3にアップロードされたファイルのクリーンアップ処理開始 ----------------");

        String sourcePath = reportId + "/source/";

        AWSUtil.s3FileCleanUp(awsConfig.getS3Endpoint(), awsConfig.getS3Region(), awsConfig.getS3ReportBucket(),
                sourcePath);

        // S3削除対象path
        String reportJsonPath = reportId + "/report_json/";

        AWSUtil.s3FileCleanUp(awsConfig.getS3Endpoint(), awsConfig.getS3Region(), awsConfig.getS3ReportBucket(),
                reportJsonPath);

        LOGGER.info("-- S3にアップロードされたファイルのクリーンアップ処理完了 ----------------");
    }

}
