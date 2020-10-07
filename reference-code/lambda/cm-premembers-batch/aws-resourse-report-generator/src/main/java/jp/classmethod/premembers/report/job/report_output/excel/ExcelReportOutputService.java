package jp.classmethod.premembers.report.job.report_output.excel;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

import com.amazonaws.services.dynamodbv2.model.ConditionalCheckFailedException;

import jp.classmethod.premembers.report.constant.ComConst;
import jp.classmethod.premembers.report.exception.PremembersApplicationException;
import jp.classmethod.premembers.report.repository.PMReports;
import jp.classmethod.premembers.report.repository.entity.PMReportsItem;
import jp.classmethod.premembers.report.util.DateUtil;

@Component
public class ExcelReportOutputService {

    @Autowired
    private ExcelReportOutputTask excelReportOutputTask;

    @Autowired
    private PMReports pmReports;

    @Qualifier("threadPool")
    @Autowired
    private ThreadPoolTaskExecutor threadPool;

    private final static String EXCL_001 = "EXCL-001";

    private final static String EXCL_002 = "EXCL-002";

    private final static String EXCL_998 = "EXCL_998";

    private final static String EXCL_999 = "EXCL_999";

    private final static Logger LOGGER = LoggerFactory.getLogger(ExcelReportOutputService.class);

    /**
     * @param reportId
     *            レポートID
     */
    public void execute(String reportId) {
        LOGGER.info("-- Excel形式レポート作成 処理開始 ----------------");

        PMReportsItem pmReportsItem = null;

        try {

            // レポートテーブル情報を取得する
            pmReportsItem = getPmReportsInfo(reportId, EXCL_001);

            // レポートテーブル情報のステータスチェック
            checkReportStatus(reportId, pmReportsItem);

            // Excelレポートステータスを「出力処理中」に更新
            updateExcelOutputStatusOutputProcessing(reportId, pmReportsItem);

            List<String> awsAccounts = pmReportsItem.getAwsAccounts();
            String schemaVersion = String.valueOf(pmReportsItem.getSchemaVersion());
            String reportName = pmReportsItem.getReportName();

            // Excelレポート作成処理
            String excelPath = excelReportOutputTask.execute(reportId, awsAccounts, reportName, schemaVersion);

            // レポートテーブル情報を取得する
            pmReportsItem = getPmReportsInfo(reportId, EXCL_998);

            // Excelレポートステータスを「出力済み」に更新
            updateReportStatusConversionComplete(reportId, pmReportsItem, excelPath);

        } catch (PremembersApplicationException e) {

            // レポートテーブル情報を取得する
            pmReportsItem = getPmReportsInfo(reportId, EXCL_999);

            // レポートのステータスを「情報収集完了」に更新
            updateReportStatusCollectComplete(reportId, pmReportsItem);

            // Excelレポートステータスを「エラー」に更新
            throw e;
        }
        LOGGER.info("-- Excel形式レポート作成 処理終了 ----------------");
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

        // レポート情報のExcelレポート出力ステータス取得
        int excelOutputStatus = pmReportsItem.getExcelOutputStatus();

        // Statusが「4」かつexcelOutputStatusが「0」、またはStatusが「4」かつexcelOutputStatusが「-1」以外の場合はエラー。
        if (!((ComConst.CONVERSION_COMPLETE == status && ComConst.WAITING == excelOutputStatus)
                || (ComConst.CONVERSION_COMPLETE == status && ComConst.ERROR == excelOutputStatus))) {
            // ログレベル： ERROR
            LOGGER.error("レポート情報作成ステータスが一致しません。: ReportID=" + reportId + ", ReportStatus=" + status
                    + ", ExcelOutputStatus=" + excelOutputStatus);
            throw new PremembersApplicationException(EXCL_001, "レポート情報作成ステータスが一致しません。: ReportID=" + reportId
                    + ", ReportStatus=" + status + ", ExcelOutputStatus=" + excelOutputStatus);
        }

        LOGGER.info("-- レポート情報のステータスチェック完了 ----------------");
    }

    /**
     * レポート情報のExcelレポート出力ステータスを更新します。
     *
     * @param reportId
     *            レポートID
     * @param pmReportsItem
     *            レポートテーブル情報
     */
    public void updateExcelOutputStatusOutputProcessing(String reportId, PMReportsItem pmReportsItem) {

        LOGGER.info("-- レポート情報のExcelレポート出力ステータス更新開始(出力処理中) ----------------");

        try {

            pmReportsItem.setExcelOutputStatus(ComConst.PROCESSING);

            // 旧更新日時を退避
            String updatedAt = pmReportsItem.getUpdatedAt();
            // Excelレポート出力ステータスを「出力処理中」に更新
            pmReports.update(pmReportsItem, updatedAt);

            // レコード更新に失敗したら、ログを出力してエラー終了処理を実行します。
        } catch (ConditionalCheckFailedException e) {
            // ログレベル： ERROR
            LOGGER.error("レポート情報のステータス更新に失敗しました。: ReportID=" + reportId);
            // レポート情報にエラーコードを設定して更新
            throw new PremembersApplicationException(EXCL_002, "レポート情報のステータス更新に失敗しました。: ReportID=" + reportId, e);
        }

        LOGGER.info("-- レポート情報のExcelレポート出力ステータス更新完了(出力処理中) ----------------");
    }

    /**
     * レポートのExcelレポート出力ステータスを「出力済み」に更新します。
     *
     * @param reportId
     *            レポートID
     * @param pmReportsItem
     *            レポートテーブル情報
     * @param excelPath
     *            エクセルのパス
     */
    public void updateReportStatusConversionComplete(String reportId, PMReportsItem pmReportsItem, String excelPath) {

        LOGGER.info("-- レポート情報のExcelレポート出力ステータス更新開始(出力済み) ----------------");

        try {

            pmReportsItem.setExcelOutputStatus(ComConst.FINISH);
            pmReportsItem.setExcelPath(excelPath);

            // 更新日時を取得
            String newUpdatedAt = DateUtil.getCurrentDateUTC();
            // 旧更新日時を退避
            String updatedAt = pmReportsItem.getUpdatedAt();

            pmReportsItem.setExcelOutputTime(newUpdatedAt);
            // Excelレポート出力ステータスを「出力済み」に更新
            pmReports.update(pmReportsItem, updatedAt);
            // レコード更新に失敗したら、ログを出力してエラー終了処理を実行します。
        } catch (ConditionalCheckFailedException e) {
            // ログレベル： ERROR
            LOGGER.error("レポート情報のステータス更新に失敗しました。: ReportID=" + reportId);
            // レポート情報にエラーコードを設定して更新
            throw new PremembersApplicationException(EXCL_998, "レポート情報のステータス更新に失敗しました。: ReportID=" + reportId, e);
        }

        LOGGER.info("-- レポート情報のExcelレポート出力ステータス更新完了(出力済み) ----------------");
    }

    /**
     * レポートのExcelレポート出力ステータスを「エラー」に更新します。
     *
     * @param reportId
     *            レポートID
     * @param pmReportsItem
     *            レポートテーブル情報
     */
    public void updateReportStatusCollectComplete(String reportId, PMReportsItem pmReportsItem) {

        LOGGER.info("-- レポート情報のExcelレポート出力ステータス更新開始(エラー) ----------------");

        try {

            pmReportsItem.setExcelOutputStatus(ComConst.ERROR);

            // 旧更新日時を退避
            String updatedAt = pmReportsItem.getUpdatedAt();
            // Excelレポート出力ステータスを「エラー」に更新
            pmReports.update(pmReportsItem, updatedAt);

            // レコード更新に失敗したら、ログを出力してエラー終了処理を実行します。
        } catch (ConditionalCheckFailedException e) {
            // ログレベル： ERROR
            LOGGER.error("レポート情報のステータス更新に失敗しました。: ReportID=" + reportId);
            // レポート情報にエラーコードを設定して更新
            // エラーコード：EXCL-999
            throw new PremembersApplicationException(EXCL_999, "レポート情報のステータス更新に失敗しました。: ReportID=" + reportId, e);
        }

        LOGGER.info("-- レポート情報のExcelレポート出力ステータス更新完了(エラー) ----------------");
    }

}
