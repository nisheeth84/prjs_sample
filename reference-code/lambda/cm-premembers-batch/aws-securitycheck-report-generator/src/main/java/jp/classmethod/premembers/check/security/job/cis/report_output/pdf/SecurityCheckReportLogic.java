package jp.classmethod.premembers.check.security.job.cis.report_output.pdf;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jp.classmethod.premembers.check.security.config.AWSConfig;
import jp.classmethod.premembers.check.security.config.JobConfig;
import jp.classmethod.premembers.check.security.constant.CodeCheckItemConst;
import jp.classmethod.premembers.check.security.constant.ComConst;
import jp.classmethod.premembers.check.security.constant.DivConst;
import jp.classmethod.premembers.check.security.constant.DivConst.CorrectlyDivision;
import jp.classmethod.premembers.check.security.constant.SecurityCheckReportConst;
import jp.classmethod.premembers.check.security.constant.TimeZoneConst;
import jp.classmethod.premembers.check.security.exception.PremembersApplicationException;
import jp.classmethod.premembers.check.security.job.common.ItemCheck;
import jp.classmethod.premembers.check.security.job.common.PremembersCommonBeforeLogic;
import jp.classmethod.premembers.check.security.job.dto.AwsAccountsDto;
import jp.classmethod.premembers.check.security.job.dto.SecurityCheckItemDetailsDto;
import jp.classmethod.premembers.check.security.job.dto.SecurityCheckReportDto;
import jp.classmethod.premembers.check.security.job.dto.SecurityCheckReportResultDto;
import jp.classmethod.premembers.check.security.job.dto.SecurityCheckReportSummaryDto;
import jp.classmethod.premembers.check.security.job.dto.SecurityCheckSectionDto;
import jp.classmethod.premembers.check.security.job.dto.SecurityPDFDto;
import jp.classmethod.premembers.check.security.repository.PMCheckHistoryDao;
import jp.classmethod.premembers.check.security.repository.PMCheckResultItemsDao;
import jp.classmethod.premembers.check.security.repository.PMCheckResultsDao;
import jp.classmethod.premembers.check.security.repository.entity.PMCheckHistory;
import jp.classmethod.premembers.check.security.repository.entity.PMCheckResultItemsIndex;
import jp.classmethod.premembers.check.security.repository.entity.PMCheckResultsIndex;
import jp.classmethod.premembers.check.security.util.AWSUtil;
import jp.classmethod.premembers.check.security.util.CommonUtil;
import jp.classmethod.premembers.check.security.util.DateUtil;
import jp.classmethod.premembers.check.security.util.ExportUtil;
import jp.classmethod.premembers.check.security.util.FileUtil;
import jp.classmethod.premembers.check.security.util.PremembersUtil;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

/**
 * @author TuanDV
 */
@Component
public class SecurityCheckReportLogic {
    private static final String SECURITY_CHECK_REPORT = "SecurityCheckReport";

    @Autowired
    private JobConfig config;
    @Autowired
    private AWSConfig awsConfig;

    @Autowired
    private PMCheckHistoryDao pmCheckHistoryDao;
    @Autowired
    private PMCheckResultsDao pmCheckResultsDao;
    @Autowired
    private PMCheckResultItemsDao pmCheckResultItemsDao;
    @Autowired
    private PremembersCommonBeforeLogic premembersCommonBeforeLogic;

    private final static Logger LOGGER = LoggerFactory.getLogger(SecurityCheckReportLogic.class);

    // CIS Amazon Web Service Foundations Benchmark
    private String CIS_1_TITLE = "result.cis.title.iam";
    private String CIS_2_TITLE = "result.cis.title.logging";
    private String CIS_3_TITLE = "result.cis.title.monitoring";
    private String CIS_4_TITLE = "result.cis.title.networking";
    private String ASSESSMENT_TITLE = "assessment.title";
    private String EXCLUSION_TITLE = "exclusion.title";

    private static final List<SecurityCheckItemDetailsDto> LIST_CHECK_CIS_1_DIVISION = CommonUtil.toUnmodifiableList(
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_02),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_03),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_04),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_05),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_06),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_07),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_08),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_09),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_10),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_11),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_12),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_13),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_14),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_15),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_16),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_17),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_18),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_19),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_20),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_21),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_22));

    private static final List<SecurityCheckItemDetailsDto> LIST_CHECK_CIS_2_DIVISION = CommonUtil.toUnmodifiableList(
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_02),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_03),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_04),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_05),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_06),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_07),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_08),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_09));

    private static final List<SecurityCheckItemDetailsDto> LIST_CHECK_CIS_3_DIVISION = CommonUtil.toUnmodifiableList(
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_02),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_03),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_04),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_05),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_06),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_07),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_08),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_09),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_10),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_11),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_12),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_13),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_14));

    private static final List<SecurityCheckItemDetailsDto> LIST_CHECK_CIS_4_DIVISION = CommonUtil.toUnmodifiableList(
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_4_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_4_02),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_4_03),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_4_04));

    private static final List<SecurityCheckItemDetailsDto> LIST_CHECK_CIS_ASSESSMENT_DIVISION = CommonUtil
            .toUnmodifiableList(ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_15),
                    ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_17),
                    ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_19),
                    ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_20),
                    ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_4_04));

    private static final List<SecurityCheckItemDetailsDto> LIST_CHECK_CIS = CommonUtil.toUnmodifiableList(
            LIST_CHECK_CIS_1_DIVISION, LIST_CHECK_CIS_2_DIVISION, LIST_CHECK_CIS_3_DIVISION, LIST_CHECK_CIS_4_DIVISION);

    // AWS Security Checklist
    private String ASC_GENERAL_TITLE = "result.asc.title.general";
    private String ASC_EC2_VPC_EBS_TITLE = "result.asc.title.asc_ec2_vpc_ebs";
    private String ASC_S3_TITLE = "result.asc.title.s3";

    private static final List<SecurityCheckItemDetailsDto> LIST_CHECK_ASC_GENERAL = CommonUtil.toUnmodifiableList(
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_01_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_02_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_02_02),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_03_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_04_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_05_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_06_01));

    private static final List<SecurityCheckItemDetailsDto> LIST_CHECK_ASC_EC2_VPC_EBS = CommonUtil.toUnmodifiableList(
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_07_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_08_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_09_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_10_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_11_01));

    private static final List<SecurityCheckItemDetailsDto> LIST_CHECK_ASC_S3 = CommonUtil.toUnmodifiableList(
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_12_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_13_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_14_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_15_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_16_01));

    private static final List<SecurityCheckItemDetailsDto> LIST_CHECK_ASC_ASSESSMENT_DIVISION = CommonUtil
            .toUnmodifiableList(ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_02_02),
                    ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_05_01),
                    ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_06_01),
                    ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_09_01),
                    ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_11_01),
                    ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_14_01),
                    ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_15_01));

    private static final List<SecurityCheckItemDetailsDto> LIST_CHECK_ASC = CommonUtil
            .toUnmodifiableList(LIST_CHECK_ASC_GENERAL, LIST_CHECK_ASC_EC2_VPC_EBS, LIST_CHECK_ASC_S3);

    // IBP Security Checklist
    private static final List<SecurityCheckItemDetailsDto> LIST_CHECK_IBP = CommonUtil.toUnmodifiableList(
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_01_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_02_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_03_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_04_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_05_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_06_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_02),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_03),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_04),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_05),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_06),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_07),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_08),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_08_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_09_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_10_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_11_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_12_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_13_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14_01),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14_02),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14_03),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14_04),
            ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14_05));

    private static final List<SecurityCheckItemDetailsDto> LIST_CHECK_IBP_ASSESSMENT_DIVISION = CommonUtil
            .toUnmodifiableList(ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_04_01),
                    ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_06_01),
                    ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_10_01),
                    ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_13_01),
                    ItemCheck.lsItemCheck.get(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14_03));

    /**
     * do check report
     *
     * @param checkHistoryId
     * @param logId
     */
    public void doCheckReport(String checkHistoryId, String logId, String lang) {
        String errorCode = ComConst.BLANK;
        try {
            validateRequiredArguments(checkHistoryId, lang);
            doCheckSecurity(checkHistoryId, logId, lang);
        } catch (PremembersApplicationException e) {
            LOGGER.error(PremembersUtil.getStackTrace(e));
            LOGGER.error(e.getMessage());
            errorCode = e.getCode();
            throw e;
        } finally {
            try {
                processingFinish(checkHistoryId, errorCode);
            } catch (PremembersApplicationException e) {
                LOGGER.error(PremembersUtil.getStackTrace(e));
                LOGGER.error(e.getMessage());
                throw e;
            }
        }
    }

    /**
     * do check security
     *
     * @param checkHistoryId
     * @param logId
     */
    private void doCheckSecurity(String checkHistoryId, String logId, String lang) {
        // ログストリーム名取得
        if (!ComConst.EMPTY.equals(logId)) {
            try {
                premembersCommonBeforeLogic.updateLogStreamName(checkHistoryId, logId);
            } catch (PremembersApplicationException e) {
                LOGGER.error(e.getMessage());
            }
        }

        // チェック履歴情報の取得とステータス更新
        LOGGER.info("-- チェック履歴情報取得処理開始 ---- ");
        PMCheckHistory historyItem = null;
        try {
            historyItem = pmCheckHistoryDao.read(checkHistoryId);
        } catch (Exception e) {
            LOGGER.error(PremembersUtil.getStackTrace(e));
            String msg = String.format("チェック履歴情報の取得に失敗しました。: CheckHistoryID=%s", checkHistoryId);
            throw new PremembersApplicationException("CRPT_SECURITY-002", msg);
        }
        if (historyItem == null) {
            String msg = String.format("チェック履歴情報の取得に失敗しました。: CheckHistoryID=%s", checkHistoryId);
            throw new PremembersApplicationException("CRPT_SECURITY-002", msg);
        }
        LOGGER.info("-- チェック履歴情報取得処理終了 ---- ");

        // チェック履歴情報の取得とステータス更新
        LOGGER.info("-- チェック履歴情報ステータスチェック開始 ---- ");
        if (historyItem.getCheckStatus() != ComConst.SUMMARY_COMPLETED) {
            String msg = String.format("チェック実行ステータスが一致しません。: CheckHistoryID=%s, CheckStatus=%s", checkHistoryId,
                    historyItem.getCheckStatus());
            throw new PremembersApplicationException("CRPT_SECURITY-003", msg);
        }

        // チェック履歴情報のステータスを更新します。
        try {
            historyItem.setCheckStatus(ComConst.REPORT_PROGRESS);
            pmCheckHistoryDao.update(historyItem, historyItem.getUpdatedAt());
        } catch (Exception e) {
            LOGGER.error(PremembersUtil.getStackTrace(e));
            String msg = String.format("チェック履歴情報のステータス更新に失敗しました。: CheckHistoryID=%s", checkHistoryId);
            throw new PremembersApplicationException("CRPT_SECURITY-004", msg);
        }
        LOGGER.info("-- チェック履歴情報ステータスチェック終了 ----");

        // チェック結果情報の取得
        LOGGER.info("-- チェック履歴情報取得処理開始 ----");
        List<PMCheckResultsIndex> lsCheckResults = null;
        try {
            lsCheckResults = pmCheckResultsDao.queryCheckHistoryIndex(checkHistoryId);
        } catch (Exception e) {
            LOGGER.error(PremembersUtil.getStackTrace(e));
            String msg = String.format("チェック結果情報の取得に失敗しました。: CheckHistoryID=%s", checkHistoryId);
            throw new PremembersApplicationException("CRPT_SECURITY-005", msg);
        }
        if (lsCheckResults == null || lsCheckResults.size() == 0) {
            String msg = String.format("チェック結果情報がありません。: CheckHistoryID=%s", checkHistoryId);
            throw new PremembersApplicationException("CRPT_SECURITY-005", msg);
        }

        ResourceBundle bundle = ResourceBundle.getBundle("language/SecurityCheckReport", new Locale(lang));
        String timeZone = bundle.getString(SecurityCheckReportConst.TIME_ZONE);

        SecurityCheckReportSummaryDto securityCheckReportSummaryDto = new SecurityCheckReportSummaryDto();
        Date executedDateTimeUTC = DateUtil.toDate(lsCheckResults.get(0).getExecutedDateTime(),
                DateUtil.PATTERN_YYYYMMDDTHHMMSSSSS, TimeZoneConst.UTC);
        String executedDateTime = DateUtil.toString(executedDateTimeUTC, DateUtil.PATTERN_YYYYMMDDTHHMMSS, timeZone)
                + ComConst.SPACE + bundle.getString(SecurityCheckReportConst.TIME_ZONE_LABEL);
        securityCheckReportSummaryDto.setExecuteDateTime(executedDateTime);
        securityCheckReportSummaryDto.setOrganizationName(lsCheckResults.get(0).getOrganizationName());
        securityCheckReportSummaryDto.setProjectName(lsCheckResults.get(0).getProjectName());
        List<SecurityCheckReportResultDto> lsCisSecurityCheckReportResultDto = new ArrayList<SecurityCheckReportResultDto>();
        List<SecurityCheckReportResultDto> lsAscSecurityCheckReportResultDto = new ArrayList<SecurityCheckReportResultDto>();
        List<SecurityCheckReportResultDto> lsIbpSecurityCheckReportResultDto = new ArrayList<SecurityCheckReportResultDto>();

        List<AwsAccountsDto> lsAwsAccountsDto = new ArrayList<AwsAccountsDto>();
        for (PMCheckResultsIndex checkResults : lsCheckResults) {
            List<SecurityCheckSectionDto> lsCisSecurityCheckSectionDto = new ArrayList<SecurityCheckSectionDto>();
            List<SecurityCheckSectionDto> lsAscSecurityCheckSectionDto = new ArrayList<SecurityCheckSectionDto>();
            List<SecurityCheckSectionDto> lsIbpSecurityCheckSectionDto = new ArrayList<SecurityCheckSectionDto>();

            // Get data AWS ACCOUNTS
            AwsAccountsDto awsAccountsDto = new AwsAccountsDto(
                    getAWSAccountName(checkResults.getAwsAccount(), checkResults.getAwsAccountName(), ComConst.NUM_8),
                    checkResults.getOkCount(), checkResults.getCriticalCount(), checkResults.getNgCount(),
                    checkResults.getManagedCount());
            lsAwsAccountsDto.add(awsAccountsDto);

            List<PMCheckResultItemsIndex> lsCheckResultItems = null;
            try {
                lsCheckResultItems = pmCheckResultItemsDao.queryCheckResultIndex(checkResults.getCheckResultID());
            } catch (Exception e) {
                LOGGER.error(PremembersUtil.getStackTrace(e));
                String msg = String.format("個別チェック結果情報の取得に失敗しました。: CheckHistoryID=%s", checkHistoryId);
                throw new PremembersApplicationException("CRPT_SECURITY-006", msg);
            }
            if (lsCheckResultItems == null || lsCheckResultItems.size() == 0) {
                String msg = String.format("個別チェック結果情報がありません。: CheckHistoryID=%s", checkHistoryId);
                throw new PremembersApplicationException("CRPT_SECURITY-006", msg);
            }

            // Get data check CIS
            // Add data CIS 1
            lsCisSecurityCheckSectionDto.add(getListSecurityCheckItemDetails(LIST_CHECK_CIS_1_DIVISION,
                    lsCheckResultItems, CIS_1_TITLE, executedDateTime, checkResults));

            // Add data CIS 2
            lsCisSecurityCheckSectionDto.add(getListSecurityCheckItemDetails(LIST_CHECK_CIS_2_DIVISION,
                    lsCheckResultItems, CIS_2_TITLE, executedDateTime, checkResults));

            // Add data CIS 3
            lsCisSecurityCheckSectionDto.add(getListSecurityCheckItemDetails(LIST_CHECK_CIS_3_DIVISION,
                    lsCheckResultItems, CIS_3_TITLE, executedDateTime, checkResults));

            // Add data CIS 4
            lsCisSecurityCheckSectionDto.add(getListSecurityCheckItemDetails(LIST_CHECK_CIS_4_DIVISION,
                    lsCheckResultItems, CIS_4_TITLE, executedDateTime, checkResults));

            // Add data CIS Assessment
            SecurityCheckSectionDto assessmentCisSecurityCheckSectionDto = getListSecurityCheckAssessmentDetails(
                    LIST_CHECK_CIS_ASSESSMENT_DIVISION, lsCheckResultItems, ASSESSMENT_TITLE, executedDateTime,
                    checkResults, timeZone);
            if (assessmentCisSecurityCheckSectionDto.getLsSecurityCheckItemDetailsDto().size() > 0) {
                lsCisSecurityCheckSectionDto.add(assessmentCisSecurityCheckSectionDto);
            }

            // Add data CIS Exclusion
            SecurityCheckSectionDto exclusionCisSecurityCheckSectionDto = getListSecurityCheckExclusionDetails(
                    LIST_CHECK_CIS, lsCheckResultItems, EXCLUSION_TITLE, executedDateTime, checkResults, timeZone);
            if (exclusionCisSecurityCheckSectionDto.getLsSecurityCheckItemDetailsDto().size() > 0) {
                lsCisSecurityCheckSectionDto.add(exclusionCisSecurityCheckSectionDto);
            }
            lsCisSecurityCheckReportResultDto.add(new SecurityCheckReportResultDto(lsCisSecurityCheckSectionDto));

            // Get data check ASC
            // Add data Security Checklist - General
            lsAscSecurityCheckSectionDto.add(getListSecurityCheckItemDetails(LIST_CHECK_ASC_GENERAL, lsCheckResultItems,
                    ASC_GENERAL_TITLE, executedDateTime, checkResults));

            // Add data Security Checklist - EC2/VPC/EBS
            lsAscSecurityCheckSectionDto.add(getListSecurityCheckItemDetails(LIST_CHECK_ASC_EC2_VPC_EBS,
                    lsCheckResultItems, ASC_EC2_VPC_EBS_TITLE, executedDateTime, checkResults));

            // Add data Security Checklist - S3
            lsAscSecurityCheckSectionDto.add(getListSecurityCheckItemDetails(LIST_CHECK_ASC_S3, lsCheckResultItems,
                    ASC_S3_TITLE, executedDateTime, checkResults));

            // Add data ASC Assessment
            SecurityCheckSectionDto assessmentAscSecurityCheckSectionDto = getListSecurityCheckAssessmentDetails(
                    LIST_CHECK_ASC_ASSESSMENT_DIVISION, lsCheckResultItems, ASSESSMENT_TITLE, executedDateTime,
                    checkResults, timeZone);
            if (assessmentAscSecurityCheckSectionDto.getLsSecurityCheckItemDetailsDto().size() > 0) {
                lsAscSecurityCheckSectionDto.add(assessmentAscSecurityCheckSectionDto);
            }

            // Add data ASC Exclusion
            SecurityCheckSectionDto exclusionAscSecurityCheckSectionDto = getListSecurityCheckExclusionDetails(
                    LIST_CHECK_ASC, lsCheckResultItems, EXCLUSION_TITLE, executedDateTime, checkResults, timeZone);
            if (exclusionAscSecurityCheckSectionDto.getLsSecurityCheckItemDetailsDto().size() > 0) {
                lsAscSecurityCheckSectionDto.add(exclusionAscSecurityCheckSectionDto);
            }
            lsAscSecurityCheckReportResultDto.add(new SecurityCheckReportResultDto(lsAscSecurityCheckSectionDto));

            // Get data check IBP
            lsIbpSecurityCheckSectionDto.add(getListSecurityCheckItemDetails(LIST_CHECK_IBP, lsCheckResultItems,
                    ComConst.BLANK, executedDateTime, checkResults));

            // Add data IBP Assessment
            SecurityCheckSectionDto assessmentIbpSecurityCheckSectionDto = getListSecurityCheckAssessmentDetails(
                    LIST_CHECK_IBP_ASSESSMENT_DIVISION, lsCheckResultItems, ASSESSMENT_TITLE, executedDateTime,
                    checkResults, timeZone);
            if (assessmentIbpSecurityCheckSectionDto.getLsSecurityCheckItemDetailsDto().size() > 0) {
                lsIbpSecurityCheckSectionDto.add(assessmentIbpSecurityCheckSectionDto);
            }

            // Add data IBP Exclusion
            SecurityCheckSectionDto exclusionIbpSecurityCheckSectionDto = getListSecurityCheckExclusionDetails(
                    LIST_CHECK_IBP, lsCheckResultItems, EXCLUSION_TITLE, executedDateTime, checkResults, timeZone);
            if (exclusionIbpSecurityCheckSectionDto.getLsSecurityCheckItemDetailsDto().size() > 0) {
                lsIbpSecurityCheckSectionDto.add(exclusionIbpSecurityCheckSectionDto);
            }
            lsIbpSecurityCheckReportResultDto.add(new SecurityCheckReportResultDto(lsIbpSecurityCheckSectionDto));

            LOGGER.info("-- チェック履歴情報取得処理終了 ----");
        }

        securityCheckReportSummaryDto.setLsAwsAccountsDto(lsAwsAccountsDto);
        SecurityCheckReportDto securityCheckReportDto = new SecurityCheckReportDto(
                Arrays.asList(securityCheckReportSummaryDto), lsCisSecurityCheckReportResultDto,
                lsAscSecurityCheckReportResultDto, lsIbpSecurityCheckReportResultDto,
                executedDateTime.substring(0, 10));

        try {
            // Create File Report - チェック結果レポートファイルの作成と保存
            Map<String, Object> parameterValues = new HashMap<String, Object>();
            parameterValues.put(JRParameter.REPORT_RESOURCE_BUNDLE, bundle);

            String jasperFileName = SECURITY_CHECK_REPORT + ComConst.JASPER_REPORT_FILE_EXT;
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(
                    Arrays.asList(new SecurityPDFDto(Arrays.asList(securityCheckReportDto))));

            String reportName = SECURITY_CHECK_REPORT + ComConst.PDF_REPORT_FILE_EXT;
            String localFilePath = config.getTemporaryDirectory() + reportName;
            ExportUtil.exportReportToPdfFile(config, parameterValues, jasperFileName, dataSource, localFilePath);

            // Update report to s3
            String s3FilePath = String.format(ComConst.PATH_FILE_REPORT, checkHistoryId) + reportName;
            AWSUtil.uploadS3(awsConfig, awsConfig.getS3CheckBucket(), s3FilePath, localFilePath);
            FileUtil.fileDelete(localFilePath);
        } catch (Exception e) {
            String msg = String.format("レポートファイルの作成に失敗しました。: CheckHistoryID=%s", checkHistoryId);
            throw new PremembersApplicationException("CRPT_SECURITY-007", msg);
        }
    }

    private SecurityCheckSectionDto getListSecurityCheckItemDetails(
            List<SecurityCheckItemDetailsDto> lsSecurityCheckItemDetailsDivision,
            List<PMCheckResultItemsIndex> lsCheckResultItems, String cisTitle, String executedDateTime,
            PMCheckResultsIndex checkResults) {
        List<SecurityCheckItemDetailsDto> lsSecurityCheckItemDetailsDto = new ArrayList<>();
        for (SecurityCheckItemDetailsDto checkDetailsDto : lsSecurityCheckItemDetailsDivision) {
            SecurityCheckItemDetailsDto securityCheckItemDetailsDto = new SecurityCheckItemDetailsDto();
            CommonUtil.copyProperties(checkDetailsDto, securityCheckItemDetailsDto);
            for (PMCheckResultItemsIndex checkResultItemsIndex : lsCheckResultItems) {
                if (securityCheckItemDetailsDto.getCheckCode().equals(checkResultItemsIndex.getCheckItemCode())) {
                    securityCheckItemDetailsDto.setExclusionFlag(checkResultItemsIndex.getExclusionFlag());
                    securityCheckItemDetailsDto.setCheckResult(checkResultItemsIndex.getCheckResult());

                    if (securityCheckItemDetailsDto.getExclusionFlag() == ComConst.IS_EXCLUSION) {
                        securityCheckItemDetailsDto.setCorrectly(SecurityCheckReportConst.EXCLUSION);
                    } else {
                        securityCheckItemDetailsDto.setCorrectly(DivConst.getName(CorrectlyDivision.class,
                                Integer.toString(checkResultItemsIndex.getCheckResult())));
                    }

                    break;
                }
            }
            lsSecurityCheckItemDetailsDto.add(securityCheckItemDetailsDto);
        }
        SecurityCheckSectionDto securityCheckSectionDto = new SecurityCheckSectionDto(executedDateTime,
                checkResults.getOrganizationName(), checkResults.getProjectName(),
                getAWSAccountName(checkResults.getAwsAccount(), checkResults.getAwsAccountName(), ComConst.NUM_30),
                cisTitle, lsSecurityCheckItemDetailsDto, false, false);
        return securityCheckSectionDto;
    }

    private SecurityCheckSectionDto getListSecurityCheckAssessmentDetails(
            List<SecurityCheckItemDetailsDto> lsSecurityCheckItemDetailsDivision,
            List<PMCheckResultItemsIndex> lsCheckResultItems, String cisTitle, String executedDateTime,
            PMCheckResultsIndex checkResults, String timeZone) {
        List<SecurityCheckItemDetailsDto> lsSecurityCheckItemDetailsDto = new ArrayList<>();
        for (SecurityCheckItemDetailsDto checkDetailsDto : lsSecurityCheckItemDetailsDivision) {
            for (PMCheckResultItemsIndex checkResultItemsIndex : lsCheckResultItems) {
                if (checkDetailsDto.getCheckCode().equals(checkResultItemsIndex.getCheckItemCode())
                        && checkResultItemsIndex.getAssessmentFlag() == ComConst.IS_ASSESSMENT) {
                    SecurityCheckItemDetailsDto securityCheckItemDetailsDto = new SecurityCheckItemDetailsDto();
                    CommonUtil.copyProperties(checkDetailsDto, securityCheckItemDetailsDto);
                    JSONObject jsonObject = null;
                    try {
                        String jsonStr = AWSUtil.readS3(awsConfig, awsConfig.getS3CheckBucket(),
                                checkResultItemsIndex.getResultJsonPath());
                        jsonObject = new JSONObject(jsonStr);
                    } catch (Exception e) {
                        String msg = String.format("個別チェック結果情報に紐づくチェック結果JSONファイルがありません。: CheckResultID=%s",
                                checkResultItemsIndex.getCheckHistoryID());
                        throw new PremembersApplicationException("CRPT_SECURITY-006", msg);
                    }

                    JSONObject assessmentResult = jsonObject.getJSONObject("AssessmentResult");
                    securityCheckItemDetailsDto.setComment(assessmentResult.isNull("AssessmentComment") ? ComConst.BLANK
                            : assessmentResult.getString("AssessmentComment"));
                    securityCheckItemDetailsDto.setMailAddress(assessmentResult.getString("MailAddress"));

                    Date createdAtUTC = DateUtil.toDate(assessmentResult.getString("CreatedAt"),
                            DateUtil.PATTERN_YYYYMMDDTHHMMSSSSS, TimeZoneConst.UTC);
                    String createdAt = DateUtil.toString(createdAtUTC, DateUtil.PATTERN_YYYYMMDD_SLASH, timeZone);
                    securityCheckItemDetailsDto.setCreatedAt(createdAt);
                    lsSecurityCheckItemDetailsDto.add(securityCheckItemDetailsDto);
                    break;
                }
            }
        }
        SecurityCheckSectionDto securityCheckSectionDto = new SecurityCheckSectionDto(executedDateTime,
                checkResults.getOrganizationName(), checkResults.getProjectName(),
                getAWSAccountName(checkResults.getAwsAccount(), checkResults.getAwsAccountName(), ComConst.NUM_30),
                cisTitle, lsSecurityCheckItemDetailsDto, true, false);
        return securityCheckSectionDto;
    }

    private SecurityCheckSectionDto getListSecurityCheckExclusionDetails(
            List<SecurityCheckItemDetailsDto> lsSecurityCheckItemDetailsDivision,
            List<PMCheckResultItemsIndex> lsCheckResultItems, String cisTitle, String executedDateTime,
            PMCheckResultsIndex checkResults, String timeZone) {
        List<SecurityCheckItemDetailsDto> lsSecurityCheckItemDetailsDto = new ArrayList<>();
        for (SecurityCheckItemDetailsDto checkDetailsDto : lsSecurityCheckItemDetailsDivision) {
            for (PMCheckResultItemsIndex checkResultItemsIndex : lsCheckResultItems) {
                if (checkDetailsDto.getCheckCode().equals(checkResultItemsIndex.getCheckItemCode())
                        && checkResultItemsIndex.getExclusionFlag() == ComConst.IS_EXCLUSION) {
                    SecurityCheckItemDetailsDto securityCheckItemDetailsDto = new SecurityCheckItemDetailsDto();
                    CommonUtil.copyProperties(checkDetailsDto, securityCheckItemDetailsDto);
                    JSONObject jsonObject = null;
                    try {
                        String jsonStr = AWSUtil.readS3(awsConfig, awsConfig.getS3CheckBucket(),
                                checkResultItemsIndex.getResultJsonPath());
                        jsonObject = new JSONObject(jsonStr);
                    } catch (Exception e) {
                        String msg = String.format("個別チェック結果情報に紐づくチェック結果JSONファイルがありません。: CheckResultID=%s",
                                checkResultItemsIndex.getCheckHistoryID());
                        throw new PremembersApplicationException("CRPT_SECURITY-006", msg);
                    }

                    JSONObject exclusionItem = jsonObject.getJSONObject("ExclusionItem");
                    securityCheckItemDetailsDto.setComment(exclusionItem.isNull("ExcluesionComment") ? ComConst.BLANK
                            : exclusionItem.getString("ExcluesionComment"));
                    securityCheckItemDetailsDto.setMailAddress(exclusionItem.getString("MailAddress"));

                    Date createdAtUTC = DateUtil.toDate(exclusionItem.getString("CreatedAt"),
                            DateUtil.PATTERN_YYYYMMDDTHHMMSSSSS, TimeZoneConst.UTC);
                    String createdAt = DateUtil.toString(createdAtUTC, DateUtil.PATTERN_YYYYMMDD_SLASH, timeZone);
                    securityCheckItemDetailsDto.setCreatedAt(createdAt);
                    lsSecurityCheckItemDetailsDto.add(securityCheckItemDetailsDto);
                    break;
                }
            }
        }
        SecurityCheckSectionDto securityCheckSectionDto = new SecurityCheckSectionDto(executedDateTime,
                checkResults.getOrganizationName(), checkResults.getProjectName(),
                getAWSAccountName(checkResults.getAwsAccount(), checkResults.getAwsAccountName(), ComConst.NUM_30),
                cisTitle, lsSecurityCheckItemDetailsDto, false, true);
        return securityCheckSectionDto;
    }

    /**
     * get AWSAccountName
     *
     * @param awsAccount
     * @param awsAccountName
     * @param pdfMaxChar
     * @return AWSAccountName format max char
     */
    private String getAWSAccountName(String awsAccount, String awsAccountName, int pdfMaxChar) {
        StringBuilder sb = new StringBuilder();
        sb.append(awsAccount);
        if (!CommonUtil.isEmpty(awsAccountName)) {
            sb.append(ComConst.SPACE).append(ComConst.VERTICAL_BAR).append(ComConst.SPACE);
            if (awsAccountName.length() > pdfMaxChar + 1) {
                sb.append(awsAccountName.substring(0, pdfMaxChar));
                sb.append(ComConst.ELLIPSES);
            } else {
                sb.append(awsAccountName);
            }
        }
        return sb.toString();
    }

    /**
     * バリデーションチェック
     */
    private void validateRequiredArguments(String checkHistoryId, String lang) {
        if (ComConst.EMPTY.equals(checkHistoryId)) {
            String msg = String.format("チェック履歴IDが指定されていません。");
            throw new PremembersApplicationException("CRPT_SECURITY-001", msg);
        }

        // Langの値を確認します。
        if (!ComConst.LIST_LANG.contains(lang)) {
            throw new PremembersApplicationException("CRPT_SECURITY-001", "出力言語指定が正しくありません。");
        }
    }

    /**
     * processing finish
     *
     * @param checkHistoryId
     * @param errorCode
     */
    private void processingFinish(String checkHistoryId, String errorCode) {
        PMCheckHistory historyItem = null;
        try {
            historyItem = pmCheckHistoryDao.read(checkHistoryId);
        } catch (Exception e) {
            LOGGER.error(PremembersUtil.getStackTrace(e));
            String msg = String.format("チェック履歴情報がありません。: CheckHistoryID=%s", checkHistoryId);
            throw new PremembersApplicationException(ComConst.ERROR_CODE, msg);
        }
        if (historyItem == null) {
            String msg = String.format("チェック履歴情報の取得に失敗しました。: CheckHistoryID=%s", checkHistoryId);
            throw new PremembersApplicationException(ComConst.ERROR_CODE, msg);
        }
        try {
            int checkStatus = ComConst.BLANK.equals(errorCode) ? ComConst.REPORT_COMPLETED : ComConst.SUMMARY_COMPLETED;
            historyItem.setCheckStatus(checkStatus);
            historyItem.setErrorCode(errorCode);
            if (ComConst.REPORT_COMPLETED.equals(checkStatus)) {
                String pathFileReport = String.format(ComConst.PATH_FILE_REPORT, checkHistoryId);
                String reportName = "SecurityCheckReport" + ComConst.PDF_REPORT_FILE_EXT;
                historyItem.setReportFilePath(pathFileReport + reportName);
            }
            pmCheckHistoryDao.update(historyItem, historyItem.getUpdatedAt());
        } catch (Exception e) {
            LOGGER.error(PremembersUtil.getStackTrace(e));
            String msg = String.format("チェック履歴情報のステータス更新に失敗しました。: CheckHistoryID=%s", checkHistoryId);
            throw new PremembersApplicationException(ComConst.ERROR_CODE, msg);
        }
    }
}
