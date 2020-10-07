package jp.classmethod.premembers.report.job.report_output.excel;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.ec2.model.CreateVolumePermission;
import com.amazonaws.services.ec2.model.GroupIdentifier;
import com.amazonaws.services.ec2.model.LaunchPermission;
import com.amazonaws.services.ec2.model.Tag;
import com.amazonaws.services.rds.model.VpcSecurityGroupMembership;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;

import jp.classmethod.premembers.report.constant.ComConst;
import jp.classmethod.premembers.report.constant.MsgConst;
import jp.classmethod.premembers.report.exception.PremembersApplicationException;
import jp.classmethod.premembers.report.job.config.AWSConfig;
import jp.classmethod.premembers.report.job.config.JobConfig;
import jp.classmethod.premembers.report.json.report.ec2.EC2AMI;
import jp.classmethod.premembers.report.json.report.ec2.EC2Ebs;
import jp.classmethod.premembers.report.json.report.ec2.EC2Instance;
import jp.classmethod.premembers.report.json.report.ec2.EC2RI;
import jp.classmethod.premembers.report.json.report.ec2.EC2Report;
import jp.classmethod.premembers.report.json.report.ec2.EC2Snapshot;
import jp.classmethod.premembers.report.json.report.rds.DBInstanceReport;
import jp.classmethod.premembers.report.json.report.rds.DBSnapshotReport;
import jp.classmethod.premembers.report.json.report.rds.RDSReport;
import jp.classmethod.premembers.report.json.report.rds.ReservedDBInstanceReport;
import jp.classmethod.premembers.report.json.report.redshift.RedshiftClustersReport;
import jp.classmethod.premembers.report.json.report.redshift.RedshiftRIReport;
import jp.classmethod.premembers.report.json.report.redshift.RedshiftReport;
import jp.classmethod.premembers.report.json.report.redshift.RedshiftSnapshotReport;
import jp.classmethod.premembers.report.json.report.services.ServiceCurrentUsageReport;
import jp.classmethod.premembers.report.properties.MsgProps;
import jp.classmethod.premembers.report.util.AWSUtil;
import jp.classmethod.premembers.report.util.CommonUtil;
import jp.classmethod.premembers.report.util.DateUtil;
import jp.classmethod.premembers.report.util.FileUtil;

@Component
public class ExcelReportOutputTask {

    @Autowired
    private AWSConfig awsConfig;

    @Autowired
    private JobConfig jobConfig;

    private final static String LOCAL_TEMPLATE_PATH = "_excelTemplate.xlsx";

    private final static Logger LOGGER = LoggerFactory.getLogger(ExcelReportOutputTask.class);

    private final static Double MAG = 1.4;

    private final static String LANG_CODE = MsgProps.getString(MsgConst.LANG_CODE);

    private final static String REPORT_VERSION = "ReportVersion:v";

    private final static String ALL = MsgProps.getString(MsgConst.ALL);

    private final static String EFFECT = MsgProps.getString(MsgConst.EFFECT);

    private final static String DISABLED = MsgProps.getString(MsgConst.DISABLED);

    private final static String SETTING = MsgProps.getString(MsgConst.SETTING);

    private final static String NO_SETTING = MsgProps.getString(MsgConst.NO_SETTING);

    private final static String ON = MsgProps.getString(MsgConst.ON);

    private final static String OFF = MsgProps.getString(MsgConst.OFF);

    private int rowNumServices = 11;
    private int rowNumEC2 = 18;
    private int rowNumRDS = 46;
    private int rowNumRedshift = 62;
    private int rowNumVPC = 76;
    private int rowNumS3 = 96;
    private int rowNumIAM = 111;
    private int rowNumCloudTrail = 138;

    /**
     * Excelレポートファイル作成
     *
     * @param reportId
     *            レポートID
     * @param awsAccounts
     *            AWSアカウント
     * @param reportName
     *            レポート名
     * @param schemaVersion
     *            レポート書式バージョン
     */
    public String execute(String reportId, List<String> awsAccounts, String reportName, String schemaVersion) {

        // S3ファイル名
        String s3FilePath = reportId + "/report/" + LANG_CODE + "/" + reportName + ".xlsx";

        // ローカルファイルパス
        String localFileDirectory = jobConfig.getTemporaryDirectory();

        // ローカルファイル名
        String localFileName = reportName + ".xlsx";

        // ローカルファイル名
        String localFilePath = localFileDirectory + localFileName;

        try {

            // S3からExcelレポートテンプレートファイルをダウンロードする
            excelTemplateDownload(reportId, schemaVersion);

            // S3から出力元となるソースファイルをダウンロードする。
            Map<String, Map<String, List<JSONObject>>> reportMap = reportJsonDownload(reportId, awsAccounts);

            // Excelレポートファイルを作成します。AWSアカウントごとに1シート作成する
            createReportFile(reportMap, reportId, reportName, schemaVersion, localFileDirectory, localFileName);

            // 作成したExcelレポートファイルを、S3の規定のパスにアップロードします。
            s3FileUpload(s3FilePath, localFilePath);

            // ローカルファイルを削除
            FileUtil.fileDelete(localFilePath);

            // テンプレートファイルを削除
            FileUtil.fileDelete(localFileDirectory + reportId + LOCAL_TEMPLATE_PATH);

        } catch (PremembersApplicationException e) {
            throw e;
        }

        return s3FilePath;
    }

    /**
     * S3からExcelレポートテンプレートファイルをダウンロードする
     *
     * @param reportId
     *            レポートID
     * @param schemaVersion
     *            レポート書式バージョン
     * @throws PremembersApplicationException
     */
    private void excelTemplateDownload(String reportId, String schemaVersion) throws PremembersApplicationException {

        // TODO
        String excelTemplatePath = jobConfig.getReportExcelTemplateFilepathV1_0();

        S3ObjectInputStream s3is = null;
        FileOutputStream fos = null;

        try {
            // ディレクトリを作成します
            createDirectory(jobConfig.getTemporaryDirectory());

            S3Object s3object = AWSUtil.getS3Object(awsConfig.getS3Endpoint(), awsConfig.getS3Region(),
                    awsConfig.getS3SettingBucket(), excelTemplatePath);
            s3is = s3object.getObjectContent();

            fos = new FileOutputStream(new File(jobConfig.getTemporaryDirectory() + reportId + LOCAL_TEMPLATE_PATH));
            byte[] read_buf = new byte[1024];
            int read_len = 0;
            while ((read_len = s3is.read(read_buf)) > 0) {
                fos.write(read_buf, 0, read_len);
            }

        } catch (AmazonServiceException e) {

            // ログレベル： ERROR
            LOGGER.error("EXCL-003", "S3ファイルダウンロードに失敗しました。: Bucket={" + awsConfig.getS3SettingBucket() + "}, Key={"
                    + excelTemplatePath + "}");

            throw new PremembersApplicationException("EXCL-003", "S3ファイルダウンロードに失敗しました。: Bucket={"
                    + awsConfig.getS3SettingBucket() + "}, Key={" + excelTemplatePath + "}", e);
        } catch (IOException e) {

            LOGGER.error("EXCL-003", "S3ファイルダウンロードに失敗しました。: Bucket={" + awsConfig.getS3SettingBucket() + "}, Key={"
                    + excelTemplatePath + "}");

            throw new PremembersApplicationException("EXCL-003", "S3ファイルダウンロードに失敗しました。: Bucket={"
                    + awsConfig.getS3SettingBucket() + "}, Key={" + excelTemplatePath + "}", e);
        } finally {

            if (s3is != null) {
                try {
                    s3is.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (fos != null) {
                try {
                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

    }

    /**
     * S3から出力元となるソースファイルをダウンロードする。
     *
     * @param reportId
     *            レポートID
     * @param awsAccounts
     *            AWSアカウント
     * @throws PremembersApplicationException
     */
    private Map<String, Map<String, List<JSONObject>>> reportJsonDownload(String reportId, List<String> awsAccounts)
            throws PremembersApplicationException {

        Map<String, Map<String, List<JSONObject>>> reportMap = new HashMap<String, Map<String, List<JSONObject>>>();

        Regions[] regionsArray = AWSUtil.getEnableRegions();

        for (String accountId : awsAccounts) {

            Map<String, List<JSONObject>> accountMap = new HashMap<String, List<JSONObject>>();

            String s3FilePathGlobal = reportId + "/report_json/" + accountId + "/" + reportId + "_" + accountId
                    + "_global.json";

            JSONObject jsonObjectGlobal = getReportJson(s3FilePathGlobal);

            accountMap.put("global", new ArrayList<JSONObject>());
            accountMap.get("global").add(jsonObjectGlobal);

            accountMap.put("region", new ArrayList<JSONObject>());

            for (Regions regions : regionsArray) {

                String s3FilePathRegion = reportId + "/report_json/" + accountId + "/" + reportId + "_" + accountId
                        + "_" + regions.getName() + ".json";

                JSONObject jsonObjectRegion = getReportJson(s3FilePathRegion);

                if (jsonObjectRegion == null) {
                    continue;
                }

                accountMap.get("region").add(jsonObjectRegion);
            }

            reportMap.put(accountId, accountMap);
        }

        return reportMap;
    }

    /**
     * レポートファイル作成 refion
     *
     * @param s3FilePath
     *            S3ファイルパス
     */
    private JSONObject getReportJson(String s3FilePath) throws PremembersApplicationException {

        JSONObject jsonObject = null;

        try {

            S3Object s3object = AWSUtil.getS3Object(awsConfig.getS3Endpoint(), awsConfig.getS3Region(),
                    awsConfig.getS3ReportBucket(), s3FilePath);

            String jsonStr = getContentsOfFile(s3object.getObjectContent());

            jsonObject = new JSONObject(jsonStr);

        } catch (AmazonS3Exception e) {

            LOGGER.error(
                    "S3ファイルダウンロードに失敗しました。: Bucket={" + awsConfig.getS3ReportBucket() + "}, Key={" + s3FilePath + "}");
            // ダウンロードに失敗したら、ログを出力してエラー終了処理を実行します。
            throw new PremembersApplicationException("EXCL-004",
                    "S3ファイルダウンロードに失敗しました。: Bucket={" + awsConfig.getS3SettingBucket() + "}, Key={" + s3FilePath + "}",
                    e);
        } catch (IOException e) {

            LOGGER.error(
                    "S3ファイルダウンロードに失敗しました。: Bucket={" + awsConfig.getS3ReportBucket() + "}, Key={" + s3FilePath + "}");
            // ダウンロードに失敗したら、ログを出力してエラー終了処理を実行します。
            throw new PremembersApplicationException("EXCL-004",
                    "S3ファイルダウンロードに失敗しました。: Bucket={" + awsConfig.getS3ReportBucket() + "}, Key={" + s3FilePath + "}",
                    e);
        }

        return jsonObject;

    }

    /**
     * レポートファイル作成 refion
     */
    private void createReportFile(Map<String, Map<String, List<JSONObject>>> reportMap, String reportId,
            String reportName, String schemaVersion, String localFileDirectory, String localFileName) {

        String localFilePath = localFileDirectory + localFileName;

        ByteArrayOutputStream os = null;
        FileOutputStream fos = null;

        try {

            String excelTemplatePath = reportId + LOCAL_TEMPLATE_PATH;

            Workbook workbook = createWorkbook(excelTemplatePath);

            Sheet sheet = workbook.getSheetAt(0);

            int sheetCount = 1;

            for (Entry<String, Map<String, List<JSONObject>>> entry : reportMap.entrySet()) {

                Sheet newSheet = workbook.createSheet();

                String accountId = entry.getKey();

                // シート名にaccountIdを設定
                workbook.setSheetName(sheetCount++, accountId);

                Map<String, List<JSONObject>> valueMap = entry.getValue();

                List<JSONObject> jsonObjectGlobalList = valueMap.get("global");
                List<JSONObject> jsonObjectRegionList = valueMap.get("region");

                //
                JSONObject jsonObjectGlobal = jsonObjectGlobalList.get(0);

                // 行カウント
                Integer rowCount = 0;

                // アカウント情報を設定
                rowCount = setAccountInfo(newSheet, sheet, accountId, reportName, schemaVersion, rowCount);
                // リージョン情報を設定
                rowCount = setRegionInfo(newSheet, sheet, jsonObjectRegionList, rowCount);
                // グローバル情報を設定
                rowCount = setGlobalInfo(newSheet, sheet, jsonObjectGlobal, rowCount);
            }

            workbook.removeSheetAt(0);

            os = new ByteArrayOutputStream();

            workbook.write(os);

            // ディレクトリを作成します
            createDirectory(localFileDirectory);

            File output = new File(localFilePath);

            output.delete();
            output.createNewFile();

            fos = new FileOutputStream(output);

            fos.write(os.toByteArray());

        } catch (FileNotFoundException e) {
            LOGGER.error("Excel形式レポートファイルの作成処理に失敗しました。File={" + localFilePath + "}");
            throw new PremembersApplicationException("EXCL-005",
                    "Excel形式レポートファイルの作成処理に失敗しました。File={" + localFilePath + "}", e);
        } catch (EncryptedDocumentException e) {
            LOGGER.error("Excel形式レポートファイルの作成処理に失敗しました。File={" + localFilePath + "}");
            throw new PremembersApplicationException("EXCL-005",
                    "Excel形式レポートファイルの作成処理に失敗しました。File={" + localFilePath + "}", e);
        } catch (InvalidFormatException e) {
            LOGGER.error("Excel形式レポートファイルの作成処理に失敗しました。File={" + localFilePath + "}");
            throw new PremembersApplicationException("EXCL-005",
                    "Excel形式レポートファイルの作成処理に失敗しました。File={" + localFilePath + "}", e);
        } catch (IOException e) {
            LOGGER.error("Excel形式レポートファイルの作成処理に失敗しました。File={" + localFilePath + "}");
            throw new PremembersApplicationException("EXCL-005",
                    "Excel形式レポートファイルの作成処理に失敗しました。File={" + localFilePath + "}", e);
        } catch (Exception e) {
            LOGGER.error("Excel形式レポートファイルの作成処理に失敗しました。File={" + localFilePath + "}");
            throw new PremembersApplicationException("EXCL-005",
                    "Excel形式レポートファイルの作成処理に失敗しました。File={" + localFilePath + "}", e);
        } finally {
            if (os != null) {
                try {
                    os.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (fos != null) {
                try {
                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * Workbookを取得
     *
     * @param excelTemplatePath
     * @throws PremembersApplicationException
     * @throws IOException
     * @throws InvalidFormatException
     * @throws EncryptedDocumentException
     */
    private Workbook createWorkbook(String excelTemplatePath)
            throws PremembersApplicationException, EncryptedDocumentException, InvalidFormatException, IOException {

        // ディレクトリを作成します
        createDirectory(jobConfig.getTemporaryDirectory());

        Workbook workbook = null;

        File file = new File(jobConfig.getTemporaryDirectory() + excelTemplatePath);
        InputStream fio = new FileInputStream(file);
        workbook = WorkbookFactory.create(fio);

        return workbook;

    }

    /**
     * アカウント情報の設定
     */
    public int setAccountInfo(Sheet newSheet, Sheet sheet, String accountId, String reportName, String schemaVersion,
            int rowCount) {
        Row row = null;
        Row rowNew = null;
        Cell cell = null;
        Cell cellNew = null;

        // excelの7行目までを出力する
        for (int i = 0; i <= 6; i++) {
            row = sheet.getRow(i);
            if (row != null) {
                rowNew = newSheet.createRow(rowCount++);
                // 行の縦幅を設定
                rowNew.setHeight(row.getHeight());

                for (int j = 0; j < row.getLastCellNum(); j++) {
                    cell = row.getCell(j);
                    if (cell != null) {
                        // 行の横幅を設定
                        newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                        cellNew = rowNew.createCell(j);

                        CellStyle style = cell.getCellStyle();
                        //
                        style.setWrapText(true);
                        // セルに書式を設定
                        cellNew.setCellStyle(style);

                        switch (i) {
                        case 0:
                            switch (j) {
                            case 1:
                                cellNew.setCellValue(reportName);
                                break;
                            default:
                                // セルに値を設定
                                setValue(cellNew, cell);
                            }

                            break;
                        case 1:

                            switch (j) {
                            case 1:
                                cellNew.setCellValue(DateUtil.getCurrentDateByFormat(DateUtil.PATTERN_YYYYMMDDTHHMMSS,
                                        MsgProps.getString(MsgConst.TIME_ZONE)));
                                break;
                            default:
                                // セルに値を設定
                                setValue(cellNew, cell);
                            }

                            break;
                        case 2:

                            switch (j) {
                            case 1:
                                cellNew.setCellValue(REPORT_VERSION + schemaVersion);
                                break;
                            default:
                                // セルに値を設定
                                setValue(cellNew, cell);
                            }

                            break;
                        case 5:

                            switch (j) {
                            case 2:
                                cellNew.setCellValue(accountId);
                                break;
                            default:
                                // セルに値を設定
                                setValue(cellNew, cell);
                            }

                            break;
                        default:
                            // セルに値を設定
                            setValue(cellNew, cell);
                        }
                    }
                }
            }
        }

        return rowCount;
    }

    /**
     * リージョン情報を設定
     */
    public int setRegionInfo(Sheet newSheet, Sheet sheet, List<JSONObject> jsonObjectRegionList, int rowCount) {

        // リージョン毎にブロックを作成する
        for (JSONObject jsonObjectRegion : jsonObjectRegionList) {

            Row row = null;
            Row rowNew = null;
            Cell cell = null;
            Cell cellNew = null;

            // リージョン情報のヘッダー部分を設定する
            for (int i = 7; i <= 10; i++) {
                row = sheet.getRow(i);
                if (row != null) {
                    rowNew = newSheet.createRow(rowCount++);
                    // 行の縦幅を設定
                    rowNew.setHeight(row.getHeight());

                    for (int j = 0; j < row.getLastCellNum(); j++) {
                        cell = row.getCell(j);
                        if (cell != null) {
                            // 行の横幅を設定
                            newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                            cellNew = rowNew.createCell(j);

                            CellStyle style = cell.getCellStyle();
                            //
                            style.setWrapText(true);
                            // セルに書式を設定
                            cellNew.setCellStyle(style);

                            switch (i) {
                            case 7:
                                switch (j) {
                                case 2:

                                    if (!jsonObjectRegion.isNull("region")) {
                                        cellNew.setCellValue(jsonObjectRegion.getString("region"));
                                    }

                                    break;
                                default:
                                    // セルに値を設定
                                    setValue(cellNew, cell);
                                }

                                break;
                            default:
                                // セルに値を設定
                                setValue(cellNew, cell);
                            }
                        }
                    }
                }
            }

            // Services情報
            if (jsonObjectRegion.has("ServiceCurrentUsage")) {
                JSONObject serviceCurrentUsage = jsonObjectRegion.getJSONObject("ServiceCurrentUsage");
                rowCount = setServiceCurrentUsage(newSheet, sheet, serviceCurrentUsage, rowCount);
            }

            // EC2情報
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 - 4);
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 - 3);
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 - 2);
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 - 1);
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2);
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 + 1);
            if (jsonObjectRegion.has("EC2")) {
                JSONObject ec2 = jsonObjectRegion.getJSONObject("EC2");
                rowCount = setRegionDataEc2(newSheet, sheet, ec2, rowCount);
            }

            // RDS情報
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRDS - 2);
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRDS - 1);
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRDS);
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRDS + 1);
            if (jsonObjectRegion.has("RDS")) {
                JSONObject rds = jsonObjectRegion.getJSONObject("RDS");
                rowCount = setRegionDataRDS(newSheet, sheet, rds, rowCount);
            }

            // Redshift情報
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRedshift - 2);
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRedshift - 1);
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRedshift);
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRedshift + 1);
            if (jsonObjectRegion.has("Redshift")) {
                JSONObject rds = jsonObjectRegion.getJSONObject("Redshift");
                rowCount = setRegionDataRedshift(newSheet, sheet, rds, rowCount);
            }

             // VPC情報
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumVPC - 2);
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumVPC - 1);
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumVPC);
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumVPC + 1);
            if (!jsonObjectRegion.isNull("VPC")) {

                JSONObject vpc = jsonObjectRegion.getJSONObject("VPC");
                // SecurityGroup情報を設定
                rowCount = setRegionVpcSecurityGroupInfo(newSheet, sheet, vpc, rowCount);
            }

            // 空白行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumS3 - 1);
            // S3開始行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumS3);
            // 空白行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumS3 + 1);
            // S3見出し
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumS3 + 2);

            // S3情報
            if (!jsonObjectRegion.isNull("S3")) {

                JSONArray s3s = jsonObjectRegion.getJSONArray("S3");
                // S3情報を設定
                rowCount = setRegionS3Info(newSheet, sheet, s3s, rowCount);
            }

            // 空白行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumS3 + 9);
            // 空白行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumS3 + 10);
            // 空白行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumS3 + 11);
            // 空白行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumS3 + 12);

        }

        // 現在の行を返す
        return rowCount;
    }

    /**
     * SecurityGroup情報を設定
     */
    public int setRegionVpcSecurityGroupInfo(Sheet newSheet, Sheet sheet, JSONObject vpc, int rowCount) {

        if (!vpc.isNull("security_group")) {
            JSONArray securityGroups = vpc.getJSONArray("security_group");

            Row row = null;
            Row rowNew = null;
            Cell cell = null;
            Cell cellNew = null;

            boolean firstFlg = true;

            for (Object tempSecurityGroups : securityGroups) {

                JSONObject securityGroup = (JSONObject) tempSecurityGroups;

                // 一件目はテンプレートが異なる
                if (firstFlg) {
                    // リージョン情報のヘッダー部分を設定する
                    rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumVPC + 2);
                    firstFlg = false;
                } else {
                    // リージョン情報のヘッダー部分を設定する
                    rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumVPC + 12);
                }

                row = null;
                rowNew = null;
                cell = null;
                cellNew = null;

                row = sheet.getRow(rowNumVPC + 3);
                if (row != null) {
                    rowNew = newSheet.createRow(rowCount++);
                    // 行の縦幅を設定
                    rowNew.setHeight(row.getHeight());

                    for (int j = 0; j < row.getLastCellNum(); j++) {
                        cell = row.getCell(j);
                        if (cell != null) {
                            // 行の横幅を設定
                            newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                            cellNew = rowNew.createCell(j);

                            CellStyle style = cell.getCellStyle();
                            //
                            style.setWrapText(true);
                            // セルに書式を設定
                            cellNew.setCellStyle(style);

                            switch (j) {
                            case 2:

                                if (!securityGroup.isNull("name")) {
                                    cellNew.setCellValue(securityGroup.getString("name"));
                                }

                                break;

                            case 3:

                                if (!securityGroup.isNull("id")) {
                                    cellNew.setCellValue(securityGroup.getString("id"));
                                }

                                break;

                            case 4:

                                if (!securityGroup.isNull("vpc_id")) {
                                    cellNew.setCellValue(securityGroup.getString("vpc_id"));
                                }

                                break;
                            default:
                                // セルに値を設定
                                setValue(cellNew, cell);
                            }
                        }
                    }
                }

                // インバウンド見出し
                rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumVPC + 4);

                // Inbound情報を設定
                rowCount = setRegionVpcSecurityGroupInboundInfo(newSheet, sheet, securityGroup, rowCount);

                // アウトバウンド見出し
                rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumVPC + 9);

                // Outbound情報を設定
                rowCount = setRegionVpcSecurityGroupOutboundInfo(newSheet, sheet, securityGroup, rowCount);

                // 空白行
                rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumVPC + 11);
            }
        }

        return rowCount;
    }

    /**
     * Inbound情報を設定
     */
    public int setRegionVpcSecurityGroupInboundInfo(Sheet newSheet, Sheet sheet, JSONObject securityGroup,
            int rowCount) {

        // インバウンド情報
        if (!securityGroup.isNull("inbound")) {
            JSONArray inbounds = securityGroup.getJSONArray("inbound");

            Row row = null;
            Row rowNew = null;
            Cell cell = null;
            Cell cellNew = null;

            for (Object tempInbounds : inbounds) {

                JSONObject inbound = (JSONObject) tempInbounds;

                row = null;
                rowNew = null;
                cell = null;
                cellNew = null;

                row = sheet.getRow(rowNumVPC + 6);
                if (row != null) {
                    rowNew = newSheet.createRow(rowCount++);
                    // 行の縦幅を設定
                    rowNew.setHeight(row.getHeight());

                    for (int j = 0; j < row.getLastCellNum(); j++) {
                        cell = row.getCell(j);
                        if (cell != null) {
                            // 行の横幅を設定
                            newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                            cellNew = rowNew.createCell(j);

                            CellStyle style = cell.getCellStyle();
                            //
                            style.setWrapText(true);
                            // セルに書式を設定
                            cellNew.setCellStyle(style);

                            switch (j) {
                            case 3:

                                if (!inbound.isNull("protocol")) {

                                    String protocol = inbound.getString("protocol");

                                    if ("-1".equals(protocol)) {
                                        cellNew.setCellValue(ALL);
                                    } else {
                                        cellNew.setCellValue(protocol);
                                    }
                                }

                                break;

                            case 4:

                                Integer fromPort = null;

                                if (!inbound.isNull("from_port")) {
                                    fromPort = inbound.getInt("from_port");
                                }

                                Integer toPort = null;

                                if (!inbound.isNull("to_port")) {
                                    toPort = inbound.getInt("to_port");
                                }

                                if (fromPort == null && toPort == null) {
                                    break;
                                } else if (fromPort != null && toPort != null) {

                                    if (fromPort.intValue() == toPort.intValue()) {
                                        cellNew.setCellValue(fromPort.toString());
                                    } else {
                                        cellNew.setCellValue(fromPort.toString() + ComConst.HYPHEN + toPort.toString());
                                    }
                                } else if (fromPort != null && toPort == null) {

                                    cellNew.setCellValue(fromPort.toString());

                                } else if (fromPort == null && toPort != null) {

                                    cellNew.setCellValue(toPort.toString());
                                }

                                break;

                            case 5:

                                if (!inbound.isNull("source")) {
                                    cellNew.setCellValue(inbound.getString("source"));
                                }

                                break;

                            case 6:

                                if (!inbound.isNull("description")) {
                                    cellNew.setCellValue(inbound.getString("description"));
                                }

                                break;
                            default:
                                // セルに値を設定
                                setValue(cellNew, cell);
                            }
                        }
                    }
                }
            }
        }
        return rowCount;
    }

    /**
     * Outbound情報を設定
     */
    public int setRegionVpcSecurityGroupOutboundInfo(Sheet newSheet, Sheet sheet, JSONObject securityGroup,
            int rowCount) {

        if (!securityGroup.isNull("outbound")) {
            JSONArray outbounds = securityGroup.getJSONArray("outbound");

            Row row = null;
            Row rowNew = null;
            Cell cell = null;
            Cell cellNew = null;

            for (Object tempOutbouns : outbounds) {

                JSONObject outbouns = (JSONObject) tempOutbouns;

                row = null;
                rowNew = null;
                cell = null;
                cellNew = null;

                row = sheet.getRow(rowNumVPC + 10);
                if (row != null) {
                    rowNew = newSheet.createRow(rowCount++);
                    // 行の縦幅を設定
                    rowNew.setHeight(row.getHeight());

                    for (int j = 0; j < row.getLastCellNum(); j++) {
                        cell = row.getCell(j);
                        if (cell != null) {
                            // 行の横幅を設定
                            newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                            cellNew = rowNew.createCell(j);

                            CellStyle style = cell.getCellStyle();
                            //
                            style.setWrapText(true);
                            // セルに書式を設定
                            cellNew.setCellStyle(style);

                            switch (j) {
                            case 3:

                                if (!outbouns.isNull("protocol")) {

                                    String protocol = outbouns.getString("protocol");

                                    if ("-1".equals(protocol)) {
                                        cellNew.setCellValue(ALL);
                                    } else {
                                        cellNew.setCellValue(protocol);
                                    }
                                }

                                break;

                            case 4:

                                Integer fromPort = null;

                                if (!outbouns.isNull("from_port")) {
                                    fromPort = outbouns.getInt("from_port");
                                }

                                Integer toPort = null;

                                if (!outbouns.isNull("to_port")) {
                                    toPort = outbouns.getInt("to_port");
                                }

                                if (fromPort == null && toPort == null) {
                                    break;
                                } else if (fromPort != null && toPort != null) {

                                    if (fromPort.intValue() == toPort.intValue()) {
                                        cellNew.setCellValue(fromPort.toString());
                                    } else {
                                        cellNew.setCellValue(fromPort.toString() + "-" + toPort.toString());
                                    }
                                } else if (fromPort != null && toPort == null) {

                                    cellNew.setCellValue(fromPort.toString());

                                } else if (fromPort == null && toPort != null) {

                                    cellNew.setCellValue(toPort.toString());
                                }

                                break;

                            case 5:

                                if (!outbouns.isNull("source")) {
                                    cellNew.setCellValue(outbouns.getString("source"));
                                }

                                break;

                            case 6:

                                if (!outbouns.isNull("description")) {
                                    cellNew.setCellValue(outbouns.getString("description"));
                                }

                                break;
                            default:
                                // セルに値を設定
                                setValue(cellNew, cell);
                            }
                        }
                    }
                }
            }
        }
        return rowCount;
    }

    /**
     * S3情報を設定
     */
    public int setRegionS3Info(Sheet newSheet, Sheet sheet, JSONArray s3s, int rowCount) {

        Row row = null;
        Row rowNew = null;
        Cell cell = null;
        Cell cellNew = null;

        for (Object tempS3s : s3s) {

            JSONObject s3 = (JSONObject) tempS3s;

            row = null;
            rowNew = null;
            cell = null;
            cellNew = null;

            row = sheet.getRow(rowNumS3 + 3);
            if (row != null) {
                rowNew = newSheet.createRow(rowCount++);
                // 行の縦幅を設定
                rowNew.setHeight(row.getHeight());

                for (int j = 0; j < row.getLastCellNum(); j++) {
                    cell = row.getCell(j);
                    if (cell != null) {
                        // 行の横幅を設定
                        newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                        cellNew = rowNew.createCell(j);

                        CellStyle style = cell.getCellStyle();
                        //
                        style.setWrapText(true);
                        // セルに書式を設定
                        cellNew.setCellStyle(style);

                        switch (j) {
                        case 2:

                            if (!s3.isNull("bucket_name")) {
                                cellNew.setCellValue(s3.getString("bucket_name"));
                            }

                            break;

                        case 3:

                            if (!s3.isNull("public_access")) {

                                if (s3.getBoolean("public_access")) {
                                    cellNew.setCellValue(EFFECT);
                                } else {
                                    cellNew.setCellValue(DISABLED);
                                }
                            }

                            break;

                        case 4:

                            if (!s3.isNull("bucket_policy")) {
                                if (s3.getBoolean("bucket_policy")) {
                                    cellNew.setCellValue(SETTING);
                                } else {
                                    cellNew.setCellValue(NO_SETTING);
                                }
                            }

                            break;

                        case 5:

                            if (!s3.isNull("bucket_acl")) {
                                if (s3.getBoolean("bucket_acl")) {
                                    cellNew.setCellValue(SETTING);
                                } else {
                                    cellNew.setCellValue(NO_SETTING);
                                }
                            }

                            break;
//                        case 6:
//                            cellNew.setCellValue(CommonUtil.formatFileSize(s3.getDouble("bucketSizeBytes")));
//                            break;
                        default:
                            // セルに値を設定
                            setValue(cellNew, cell);
                        }
                    }
                }
            }
        }
        return rowCount;
    }

    /**
     * グローバル情報を設定
     */
    public int setGlobalInfo(Sheet newSheet, Sheet sheet, JSONObject jsonObjectGlobal, int rowCount) {

        // グローバル行
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumIAM - 2);
        // 空白行
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumIAM - 1);
        // IAM行
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumIAM);
        // 空白行
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumIAM + 1);

        // IAM情報
        if (!jsonObjectGlobal.isNull("IAM")) {

            // ユーザー行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumIAM + 2);

            JSONObject iam = jsonObjectGlobal.getJSONObject("IAM");

            // IAM情報を設定
            rowCount = setGlobalIAmIAmUserInfo(newSheet, sheet, iam, rowCount);

            // 空白行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumIAM + 9);
            // 空白行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumIAM + 9);
            // アクセスキー行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumIAM + 10);

            // AccessKey情報を設定
            rowCount = setGlobalIAmAccessKeyInfo(newSheet, sheet, iam, rowCount);

            // 空白行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumIAM + 17);
            // 空白行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumIAM + 17);
            // グループ行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumIAM + 18);

            // Group情報を設定
            rowCount = setGlobalIAmGroupInfo(newSheet, sheet, iam, rowCount);

            // 空白行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumIAM + 21);
            // 空白行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumIAM + 21);
            // ロール行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumIAM + 23);

            // Role情報を設定
            rowCount = setGlobalIAmRoleInfo(newSheet, sheet, iam, rowCount);

            // 空白行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumIAM + 25);
            // 空白行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumIAM + 25);

        }

        // CloudTrail行
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumCloudTrail);
        // 空白行
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumCloudTrail + 1);

        // CloudTrail情報
        if (!jsonObjectGlobal.isNull("CloudTrail")) {

            // 証跡(Trail)行
            rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumCloudTrail + 2);

            JSONObject cloudTrail = jsonObjectGlobal.getJSONObject("CloudTrail");

            // Trail情報を設定
            rowCount = setGlobalCloudTrailTrailInfo(newSheet, sheet, cloudTrail, rowCount);
        }

        // 現在の行を返す
        return rowCount;
    }

    /**
     * IAM情報を設定
     */
    public int setGlobalIAmIAmUserInfo(Sheet newSheet, Sheet sheet, JSONObject iam, int rowCount) {

        if (!iam.isNull("iam_user")) {
            JSONArray iamUsers = iam.getJSONArray("iam_user");

            Row row = null;
            Row rowNew = null;
            Cell cell = null;
            Cell cellNew = null;

            for (Object tempIamUser : iamUsers) {

                JSONObject iamUser = (JSONObject) tempIamUser;

                row = null;
                rowNew = null;
                cell = null;
                cellNew = null;

                row = sheet.getRow(rowNumIAM + 3);
                if (row != null) {
                    rowNew = newSheet.createRow(rowCount++);
                    // 行の縦幅を設定
                    rowNew.setHeight(row.getHeight());

                    for (int j = 0; j < row.getLastCellNum(); j++) {
                        cell = row.getCell(j);
                        if (cell != null) {
                            // 行の横幅を設定
                            newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                            cellNew = rowNew.createCell(j);

                            CellStyle style = cell.getCellStyle();
                            //
                            style.setWrapText(true);
                            // セルに書式を設定
                            cellNew.setCellStyle(style);

                            switch (j) {
                            case 2:

                                if (!iamUser.isNull("user_name")) {
                                    cellNew.setCellValue(iamUser.getString("user_name"));
                                }

                                break;

                            case 3:

                                if (iamUser.getBoolean("password")) {
                                    cellNew.setCellValue(ON);
                                } else {
                                    cellNew.setCellValue(OFF);
                                }

                                break;

                            case 4:

                                if (!iamUser.isNull("access_key")) {

                                    JSONArray accessKeys = iamUser.getJSONArray("access_key");

                                    int trueCount = 0;
                                    int falseCount = 0;

                                    StringBuilder buf = new StringBuilder();

                                    for (Object tempAccessKeys : accessKeys) {

                                        Boolean accessKey = (Boolean) tempAccessKeys;

                                        if (accessKey) {
                                            trueCount++;
                                        } else {
                                            falseCount++;
                                        }
                                    }

                                    if (trueCount > 0) {

                                        buf.append(trueCount);
                                        buf.append(ComConst.SPACE);
                                        buf.append(EFFECT);
                                    }

                                    if (falseCount > 0) {

                                        if (buf.length() > 0) {
                                            buf.append(ComConst.COMMA).append(ComConst.SPACE);
                                        }

                                        buf.append(falseCount);
                                        buf.append(ComConst.SPACE);
                                        buf.append(DISABLED);
                                    }

                                    cellNew.setCellValue(buf.toString());
                                }

                                break;

                            case 5:

                                if (!iamUser.isNull("mfa")) {
                                    if (iamUser.getBoolean("mfa")) {
                                        cellNew.setCellValue(EFFECT);
                                    } else {
                                        cellNew.setCellValue(DISABLED);
                                    }
                                }

                                break;

                            case 6:

                                if (!iamUser.isNull("password_last_used")) {
                                    cellNew.setCellValue(
                                            DateUtil.dateFormat(String.valueOf(iamUser.getLong("password_last_used")),
                                                    DateUtil.PATTERN_YYYYMMDDTHHMMSS));
                                }

                                break;

                            case 7:

                                if (!iamUser.isNull("create_date")) {
                                    cellNew.setCellValue(DateUtil.dateFormat(String.valueOf(iamUser.getLong("create_date")),
                                            DateUtil.PATTERN_YYYYMMDDTHHMMSS));
                                }

                                break;

                            default:
                                // セルに値を設定
                                setValue(cellNew, cell);
                            }
                        }
                    }
                }
            }
        }

        return rowCount;
    }

    /**
     * AccessKey情報を設定
     */
    public int setGlobalIAmAccessKeyInfo(Sheet newSheet, Sheet sheet, JSONObject iam, int rowCount) {

        if (!iam.isNull("access_key")) {
            JSONArray accessKeys = iam.getJSONArray("access_key");

            Row row = null;
            Row rowNew = null;
            Cell cell = null;
            Cell cellNew = null;

            for (Object tempAccessKeys : accessKeys) {

                JSONObject accessKey = (JSONObject) tempAccessKeys;

                row = null;
                rowNew = null;
                cell = null;
                cellNew = null;

                row = sheet.getRow(rowNumIAM + 11);
                if (row != null) {
                    rowNew = newSheet.createRow(rowCount++);
                    // 行の縦幅を設定
                    rowNew.setHeight(row.getHeight());

                    for (int j = 0; j < row.getLastCellNum(); j++) {
                        cell = row.getCell(j);
                        if (cell != null) {
                            // 行の横幅を設定
                            newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                            cellNew = rowNew.createCell(j);

                            CellStyle style = cell.getCellStyle();
                            //
                            style.setWrapText(true);
                            // セルに書式を設定
                            cellNew.setCellStyle(style);

                            switch (j) {
                            case 2:

                                if (!accessKey.isNull("user_name")) {
                                    cellNew.setCellValue(accessKey.getString("user_name"));
                                }

                                break;

                            case 3:

                                if (!accessKey.isNull("access_key_id")) {
                                    cellNew.setCellValue(accessKey.getString("access_key_id"));
                                }

                                break;

                            case 4:

                                if (!accessKey.isNull("create_date")) {
                                    cellNew.setCellValue(
                                            DateUtil.dateFormat(String.valueOf(accessKey.getLong("create_date")),
                                                    DateUtil.PATTERN_YYYYMMDDTHHMMSS));
                                }

                                break;

                            case 5:

                                if (!accessKey.isNull("last_used_date")) {
                                    cellNew.setCellValue(
                                            DateUtil.dateFormat(String.valueOf(accessKey.getLong("last_used_date")),
                                                    DateUtil.PATTERN_YYYYMMDDTHHMMSS));
                                } else {
                                    cellNew.setCellValue(OFF);
                                }

                                break;

                            case 6:

                                if (!accessKey.isNull("status")) {
                                    cellNew.setCellValue(accessKey.getString("status"));
                                }

                                break;

                            default:
                                // セルに値を設定
                                setValue(cellNew, cell);
                            }
                        }
                    }
                }
            }
        }

        return rowCount;
    }

    /**
     * Group情報を設定
     */
    public int setGlobalIAmGroupInfo(Sheet newSheet, Sheet sheet, JSONObject iam, int rowCount) {

        if (!iam.isNull("group")) {
            JSONArray groups = iam.getJSONArray("group");

            Row row = null;
            Row rowNew = null;
            Cell cell = null;
            Cell cellNew = null;

            for (Object tempGroups : groups) {

                JSONObject group = (JSONObject) tempGroups;

                row = null;
                rowNew = null;
                cell = null;
                cellNew = null;

                row = sheet.getRow(rowNumIAM + 11);
                if (row != null) {
                    rowNew = newSheet.createRow(rowCount++);
                    // 行の縦幅を設定
                    rowNew.setHeight(row.getHeight());

                    short maxHeigth = row.getHeight();
                    short defaultHeigth = row.getHeight();

                    for (int j = 0; j < row.getLastCellNum(); j++) {
                        cell = row.getCell(j);
                        if (cell != null) {
                            // 行の横幅を設定
                            newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                            cellNew = rowNew.createCell(j);

                            CellStyle style = cell.getCellStyle();
                            style.setWrapText(true);
                            // セルに書式を設定
                            cellNew.setCellStyle(style);

                            switch (j) {
                            case 2:

                                if (!group.isNull("group_name")) {
                                    cellNew.setCellValue(group.getString("group_name"));
                                }

                                break;

                            case 3:

                                if (!group.isNull("user")) {

                                    int count = 0;

                                    JSONArray users = group.getJSONArray("user");

                                    StringBuilder buf = new StringBuilder();

                                    for (Object tempUser : users) {

                                        String user = (String) tempUser;

                                        buf.append(user);
                                        buf.append(ComConst.TEXT_BREAK_LINE);
                                        count++;
                                    }

                                    cellNew.setCellValue(buf.toString());

                                    short heigth = (short) (defaultHeigth * count * MAG);

                                    if (heigth > maxHeigth) {
                                        maxHeigth = heigth;
                                    }
                                }

                                break;

                            case 4:

                                if (!group.isNull("managed_policies")) {

                                    int count = 0;

                                    JSONArray managedPolicies = group.getJSONArray("managed_policies");

                                    StringBuilder buf = new StringBuilder();

                                    for (Object tempManagedPolicy : managedPolicies) {

                                        String managedPolicy = (String) tempManagedPolicy;

                                        buf.append(managedPolicy);
                                        buf.append(ComConst.TEXT_BREAK_LINE);
                                        count++;
                                    }

                                    if (count == 0) {
                                        cellNew.setCellValue(OFF);
                                    } else {
                                        cellNew.setCellValue(buf.toString());
                                    }

                                    short heigth = (short) (defaultHeigth * count * MAG);

                                    if (heigth > maxHeigth) {
                                        maxHeigth = heigth;
                                    }
                                }

                                break;

                            case 5:

                                if (!group.isNull("inline_policies")) {

                                    int count = 0;

                                    JSONArray inlinePolicys = group.getJSONArray("inline_policies");

                                    StringBuilder buf = new StringBuilder();

                                    for (Object tempInlinePolicys : inlinePolicys) {

                                        String inlinePolicy = (String) tempInlinePolicys;

                                        buf.append(inlinePolicy);
                                        buf.append(ComConst.TEXT_BREAK_LINE);
                                        count++;
                                    }

                                    if (count == 0) {
                                        cellNew.setCellValue(OFF);
                                    } else {
                                        cellNew.setCellValue(buf.toString());
                                    }

                                    short heigth = (short) (defaultHeigth * count * MAG);

                                    if (heigth > maxHeigth) {
                                        maxHeigth = heigth;
                                    }
                                }
                                break;

                            case 6:

                                if (!group.isNull("create_date")) {
                                    cellNew.setCellValue(DateUtil.dateFormat(String.valueOf(group.getLong("create_date")),
                                            DateUtil.PATTERN_YYYYMMDDTHHMMSS));
                                }

                                break;

                            default:
                                // セルに値を設定
                                setValue(cellNew, cell);
                            }
                        }
                    }

                    if (maxHeigth > defaultHeigth) {
                        rowNew.setHeight(maxHeigth);
                    }
                }
            }
        }

        return rowCount;
    }

    /**
     * Role情報を設定
     */
    public int setGlobalIAmRoleInfo(Sheet newSheet, Sheet sheet, JSONObject iam, int rowCount) {

        if (!iam.isNull("role")) {
            JSONArray roles = iam.getJSONArray("role");

            Row row = null;
            Row rowNew = null;
            Cell cell = null;
            Cell cellNew = null;

            for (Object tempRoles : roles) {

                JSONObject role = (JSONObject) tempRoles;

                row = null;
                rowNew = null;
                cell = null;
                cellNew = null;

                row = sheet.getRow(rowNumIAM + 11);
                if (row != null) {
                    rowNew = newSheet.createRow(rowCount++);
                    // 行の縦幅を設定
                    rowNew.setHeight(row.getHeight());

                    short maxHeigth = row.getHeight();
                    short defaultHeigth = row.getHeight();

                    for (int j = 0; j < row.getLastCellNum(); j++) {
                        cell = row.getCell(j);
                        if (cell != null) {
                            // 行の横幅を設定
                            newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                            cellNew = rowNew.createCell(j);

                            CellStyle style = cell.getCellStyle();
                            //
                            style.setWrapText(true);
                            // セルに書式を設定
                            cellNew.setCellStyle(style);

                            switch (j) {
                            case 2:

                                if (!role.isNull("role_name")) {
                                    cellNew.setCellValue(role.getString("role_name"));
                                }

                                break;

                            case 3:

                                if (!role.isNull("description")) {
                                    cellNew.setCellValue(role.getString("description"));
                                }

                                break;

                            case 4:

                                if (!role.isNull("managed_policies")) {

                                    int count = 0;

                                    JSONArray managedPolicies = role.getJSONArray("managed_policies");

                                    StringBuilder buf = new StringBuilder();

                                    for (Object tempManagedPolicy : managedPolicies) {

                                        String managedPolicy = (String) tempManagedPolicy;

                                        buf.append(managedPolicy);
                                        buf.append(ComConst.TEXT_BREAK_LINE);
                                        count++;
                                    }

                                    if (count == 0) {
                                        cellNew.setCellValue(OFF);
                                    } else {
                                        cellNew.setCellValue(buf.toString());
                                    }

                                    short heigth = (short) (defaultHeigth * count * MAG);

                                    if (heigth > maxHeigth) {
                                        maxHeigth = heigth;
                                    }
                                }

                                break;

                            case 5:

                                if (!role.isNull("inline_policies")) {

                                    int count = 0;

                                    JSONArray inlinePolicys = role.getJSONArray("inline_policies");

                                    StringBuilder buf = new StringBuilder();

                                    for (Object tempInlinePolicy : inlinePolicys) {

                                        String inlinePolicy = (String) tempInlinePolicy;

                                        buf.append(inlinePolicy);
                                        buf.append(ComConst.TEXT_BREAK_LINE);
                                        count++;
                                    }

                                    if (count == 0) {
                                        cellNew.setCellValue(OFF);
                                    } else {
                                        cellNew.setCellValue(buf.toString());
                                    }

                                    short heigth = (short) (defaultHeigth * count * MAG);

                                    if (heigth > maxHeigth) {
                                        maxHeigth = heigth;
                                    }
                                }
                                break;

                            case 6:

                                if (!role.isNull("principal_account_id")) {

                                    int count = 0;

                                    JSONArray principalAccountIds = role.getJSONArray("principal_account_id");

                                    StringBuilder buf = new StringBuilder();

                                    for (Object tempPrincipalAccountIds : principalAccountIds) {

                                        String principalAccountId = (String) tempPrincipalAccountIds;

                                        buf.append(principalAccountId);
                                        buf.append(ComConst.TEXT_BREAK_LINE);
                                        count++;
                                    }

                                    cellNew.setCellValue(buf.toString());

                                    short heigth = (short) (defaultHeigth * count * MAG);

                                    if (heigth > maxHeigth) {
                                        maxHeigth = heigth;
                                    }
                                }
                                break;

                            case 7:

                                if (!role.isNull("create_date")) {
                                    cellNew.setCellValue(DateUtil.dateFormat(String.valueOf(role.getLong("create_date")),
                                            DateUtil.PATTERN_YYYYMMDDTHHMMSS));
                                }

                                break;

                            default:
                                // セルに値を設定
                                setValue(cellNew, cell);
                            }
                        }
                    }

                    if (maxHeigth > defaultHeigth) {
                        rowNew.setHeight(maxHeigth);
                    }
                }
            }
        }

        return rowCount;
    }

    /**
     * Trail情報を設定
     */
    public int setGlobalCloudTrailTrailInfo(Sheet newSheet, Sheet sheet, JSONObject cloudTrail, int rowCount) {

        if (!cloudTrail.isNull("trail")) {
            JSONArray trails = cloudTrail.getJSONArray("trail");

            Row row = null;
            Row rowNew = null;
            Cell cell = null;
            Cell cellNew = null;

            for (Object tempTrails : trails) {

                JSONObject trail = (JSONObject) tempTrails;

                row = null;
                rowNew = null;
                cell = null;
                cellNew = null;

                row = sheet.getRow(rowNumCloudTrail + 3);
                if (row != null) {
                    rowNew = newSheet.createRow(rowCount++);
                    // 行の縦幅を設定
                    rowNew.setHeight(row.getHeight());

                    for (int j = 0; j < row.getLastCellNum(); j++) {
                        cell = row.getCell(j);
                        if (cell != null) {
                            // 行の横幅を設定
                            newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                            cellNew = rowNew.createCell(j);

                            CellStyle style = cell.getCellStyle();
                            //
                            style.setWrapText(true);
                            // セルに書式を設定
                            cellNew.setCellStyle(style);

                            switch (j) {
                            case 2:

                                if (!trail.isNull("name")) {
                                    StringBuilder sb = new StringBuilder();
                                    sb.append(trail.getString("name"));
                                    if (trail.has("IsMultiRegionTrail") && trail.getBoolean("IsMultiRegionTrail")) {
                                        sb.append(MsgProps.getString(MsgConst.BRACKETS_OPEN_JP));
                                        sb.append(MsgProps.getString(MsgConst.ALL_REGIONS));
                                        sb.append(MsgProps.getString(MsgConst.BRACKETS_CLOSE_JP));
                                    }
                                    cellNew.setCellValue(sb.toString());
                                }

                                break;

                            case 3:

                                if (!trail.isNull("region")) {
                                    cellNew.setCellValue(trail.getString("region"));
                                }

                                break;

                            case 4:

                                if (trail.getBoolean("is_logging")) {
                                    cellNew.setCellValue(EFFECT);
                                } else {
                                    cellNew.setCellValue(DISABLED);
                                }

                                break;

                            case 5:

                                if (!trail.isNull("s3_bucketName")) {
                                    cellNew.setCellValue(trail.getString("s3_bucketName"));
                                }

                                break;

                            default:
                                // セルに値を設定
                                setValue(cellNew, cell);
                            }
                        }
                    }
                }
            }
        }

        return rowCount;
    }

    /**
     * S3にファイルのアップロードを行う
     *
     * @param s3FilePath
     * @param localFilePath
     */
    public void s3FileUpload(String s3FilePath, String localFilePath) {

        try {
            // S3にアップロード
            AWSUtil.upload(awsConfig, s3FilePath, localFilePath);
        } catch (AmazonServiceException e) {
            LOGGER.error(
                    "S3ファイルアップロードに失敗しました。: Bucket={" + awsConfig.getS3SettingBucket() + "}, Key={" + s3FilePath + "}");
            throw new PremembersApplicationException("EXCL-006",
                    "S3ファイルアップロードに失敗しました。: Bucket={" + awsConfig.getS3SettingBucket() + "}, Key={" + s3FilePath + "}",
                    e);
        } catch (SdkClientException e) {
            LOGGER.error(
                    "S3ファイルアップロードに失敗しました。: Bucket={" + awsConfig.getS3SettingBucket() + "}, Key={" + s3FilePath + "}");
            throw new PremembersApplicationException("EXCL-006",
                    "S3ファイルアップロードに失敗しました。: Bucket={" + awsConfig.getS3SettingBucket() + "}, Key={" + s3FilePath + "}",
                    e);
        }

    }

    /**
     * デフォルトの行を追加 テンプレートをそのまま設定する場合
     *
     * @param newSheet
     *            新規シート
     * @param sheet
     *            テンプレートシート
     * @param newRowNum
     *            新規シートの行
     * @param rowNum
     *            テンプレートシートの行
     */
    public int setDefaultRow(Sheet newSheet, Sheet sheet, int newRowNum, int rowNum) {
        Row row = null;
        Row rowNew = null;
        Cell cell = null;
        Cell cellNew = null;

        row = sheet.getRow(rowNum);
        if (row != null) {
            rowNew = newSheet.createRow(newRowNum++);
            // 行の縦幅を設定
            rowNew.setHeight(row.getHeight());

            for (int j = 0; j < row.getLastCellNum(); j++) {
                cell = row.getCell(j);
                if (cell != null) {
                    // 行の横幅を設定
                    newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                    cellNew = rowNew.createCell(j);
                    // セルに書式を設定
                    cellNew.setCellStyle(cell.getCellStyle());
                    // セルに値を設定
                    setValue(cellNew, cell);
                }
            }
        }

        return newRowNum;
    }

    /**
     * セルに値を設定
     *
     * @param cellNew
     *            新規のセル
     * @param cell
     *            テンプレートシートのセル
     */
    public void setValue(Cell cellNew, Cell cell) {
        CellType cellType = cell.getCellTypeEnum();

        if (CellType.STRING.equals(cellType)) {
            cellNew.setCellValue(cell.getRichStringCellValue());
        } else if (CellType.NUMERIC.equals(cellType)) {
            if (org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) {
                cellNew.setCellValue(cell.getDateCellValue());
            } else {
                cellNew.setCellValue(cell.getNumericCellValue());
            }
        } else if (CellType.FORMULA.equals(cellType)) {
            cellNew.setCellFormula(cell.getCellFormula());
        } else if (CellType.BOOLEAN.equals(cellType)) {
            cellNew.setCellValue(cell.getBooleanCellValue());
        }
    }

    /**
     * ファイルの内容を文字列で取得
     *
     * @param input
     *            InputStream
     * @return String ファイルの内容
     */
    public String getContentsOfFile(InputStream input) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(input, StandardCharsets.UTF_8));

        StringBuilder buf = new StringBuilder();

        while (true) {
            String line = reader.readLine();
            if (line == null)
                break;
            buf.append(line);
        }

        return buf.toString();

    }

    /**
     * ディレクトリを作成します
     *
     * @param directoryName
     */
    public static void createDirectory(String directoryName) throws IOException {
        Path directory = Paths.get(directoryName);
        try {
            Files.createDirectories(directory);
        } catch (IOException e) {
            throw e;
        }
    }

    /**
     * EC2情報を設定
     */
    public int setRegionDataEc2(Sheet newSheet, Sheet sheet, JSONObject ec2, int rowCount) {
        EC2Report ec2Report = CommonUtil.mapperJson(ec2.toString(4), EC2Report.class);

        // 稼働EC2
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 + 2);
        rowCount = setDataEc2Instances(newSheet, sheet, rowCount, ec2Report.getEc2Running(), ComConst.EC2_RUNNING);
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 + 4);

        // 停止EC2
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 + 5);
        rowCount = setDataEc2Instances(newSheet, sheet, rowCount, ec2Report.getEc2Stop(), ComConst.EC2_STOPPED);
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 + 10);

        // AMI
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 + 11);
        rowCount = setDataEc2AMI(newSheet, sheet, rowCount, ec2Report.getEc2AMI());
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 + 15);

        // ボリューム
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 + 16);
        rowCount = setDataEc2Ebs(newSheet, sheet, rowCount, ec2Report.getEc2Ebs());
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 + 18);

        // スナップショット
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 + 19);
        rowCount = setDataEc2Snapshot(newSheet, sheet, rowCount, ec2Report.getEc2Snapshot());
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 + 22);

        // RI
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 + 23);
        rowCount = setDataEc2RI(newSheet, sheet, rowCount, ec2Report.getEc2RI());
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumEC2 + 26);

        return rowCount;
    }

    private int setDataEc2Instances(Sheet newSheet, Sheet sheet, int rowCount, List<EC2Instance> lsEC2Instance,
            String status) {
        Row row;
        Row rowNew;
        Cell cell;
        Cell cellNew;
        StringBuilder sb;
        for (EC2Instance ec2Instance : lsEC2Instance) {
            row = sheet.getRow(rowNumEC2 + 3);
            if (row != null) {
                rowNew = newSheet.createRow(rowCount++);
                // 行の縦幅を設定
                rowNew.setHeight(row.getHeight());

                for (int j = 0; j < row.getLastCellNum(); j++) {
                    cell = row.getCell(j);
                    if (cell != null) {
                        // 行の横幅を設定
                        newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                        cellNew = rowNew.createCell(j);
                        CellStyle style = cell.getCellStyle();
                        style.setWrapText(true);
                        cellNew.setCellStyle(style);
                        switch (j) {
                        case 2:
                            cellNew.setCellValue(ec2Instance.getName());
                            break;
                        case 3:
                            cellNew.setCellValue(ec2Instance.getInstanceId());
                            break;
                        case 4:
                            cellNew.setCellValue(ec2Instance.getInstanceType());
                            break;
                        case 5:
                            cellNew.setCellValue(status);
                            break;
                        case 6:
                            sb = new StringBuilder();
                            for (GroupIdentifier securityGroup : ec2Instance.getSecurityGroups()) {
                                if (!CommonUtil.isEmpty(securityGroup.getGroupName())) {
                                    sb.append(securityGroup.getGroupName()).append(ComConst.COMMA).append(ComConst.SPACE);
                                }
                            }
                            if (sb.length() > 0) {
                                sb.deleteCharAt(sb.length() - 2);
                            }
                            cellNew.setCellValue(sb.toString().trim());
                            break;
                        case 7:
                            cellNew.setCellValue(ec2Instance.getVpcId());
                            break;
                        case 8:
                            cellNew.setCellValue(ec2Instance.getKeyName());
                            break;
                        case 9:
                            cellNew.setCellValue(ec2Instance.getAvailabilityZone());
                            break;
                        case 10:
                            cellNew.setCellValue(
                                    DateUtil.toString(ec2Instance.getLaunchTime(), DateUtil.PATTERN_YYYYMMDDTHHMMSS));
                            break;
                        case 11:
                            sb = new StringBuilder();
                            for (Tag tag : ec2Instance.getTags()) {
                                sb.append(tag.getKey()).append(ComConst.EQUAL).append(tag.getValue())
                                        .append(ComConst.COMMA).append(ComConst.SPACE);
                            }
                            if (sb.length() > 0) {
                                sb.deleteCharAt(sb.length() - 2);
                            }
                            cellNew.setCellValue(sb.toString().trim());
                            break;
                        default:
                            // セルに値を設定
                            setValue(cellNew, cell);
                        }
                    }
                }
            }
        }
        return rowCount;
    }

    private int setDataEc2AMI(Sheet newSheet, Sheet sheet, int rowCount, List<EC2AMI> lsEC2AMI) {
        Row row;
        Row rowNew;
        Cell cell;
        Cell cellNew;
        StringBuilder sb;
        for (EC2AMI ec2AMI : lsEC2AMI) {
            row = sheet.getRow(rowNumEC2 + 12);
            if (row != null) {
                rowNew = newSheet.createRow(rowCount++);
                // 行の縦幅を設定
                rowNew.setHeight(row.getHeight());

                for (int j = 0; j < row.getLastCellNum(); j++) {
                    cell = row.getCell(j);
                    if (cell != null) {
                        // 行の横幅を設定
                        newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                        cellNew = rowNew.createCell(j);
                        CellStyle style = cell.getCellStyle();
                        style.setWrapText(true);
                        cellNew.setCellStyle(style);
                        switch (j) {
                        case 2:
                            cellNew.setCellValue(ec2AMI.getNameTag());
                            break;
                        case 3:
                            cellNew.setCellValue(ec2AMI.getName());
                            break;
                        case 4:
                            cellNew.setCellValue(ec2AMI.getImageId());
                            break;
                        case 5:
                            cellNew.setCellValue(ec2AMI.getPublicValue() ? MsgProps.getString(MsgConst.PUBLIC_LABEL)
                                    : MsgProps.getString(MsgConst.PRIVATE_LABEL));
                            break;
                        case 6:
                            sb = new StringBuilder();
                            for (LaunchPermission launchPermission : ec2AMI.getLaunchPermissions()) {
                                if (!CommonUtil.isEmpty(launchPermission.getUserId())) {
                                    sb.append(launchPermission.getUserId()).append(ComConst.COMMA).append(ComConst.SPACE);
                                }
                            }
                            if (sb.length() > 0) {
                                sb.deleteCharAt(sb.length() - 2);
                            }
                            cellNew.setCellValue(sb.toString().trim());
                            break;
                        case 7:
                            cellNew.setCellValue(ec2AMI.getImageLocation());
                            break;
                        case 8:
                            cellNew.setCellValue(DateUtil.toString(
                                    DateUtil.toDate(ec2AMI.getCreationDate(), DateUtil.PATTERN_YYYYMMDDTHHMMSSSSSZ),
                                    DateUtil.PATTERN_YYYYMMDDTHHMMSS));
                            break;
                        default:
                            // セルに値を設定
                            setValue(cellNew, cell);
                        }
                    }
                }
            }
        }
        return rowCount;
    }

    private int setDataEc2Ebs(Sheet newSheet, Sheet sheet, int rowCount, List<EC2Ebs> lsEC2Ebs) {
        Row row;
        Row rowNew;
        Cell cell;
        Cell cellNew;
        for (EC2Ebs ec2Ebs : lsEC2Ebs) {
            row = sheet.getRow(rowNumEC2 + 17);
            if (row != null) {
                rowNew = newSheet.createRow(rowCount++);
                // 行の縦幅を設定
                rowNew.setHeight(row.getHeight());

                for (int j = 0; j < row.getLastCellNum(); j++) {
                    cell = row.getCell(j);
                    if (cell != null) {
                        // 行の横幅を設定
                        newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                        cellNew = rowNew.createCell(j);
                        CellStyle style = cell.getCellStyle();
                        style.setWrapText(true);
                        cellNew.setCellStyle(style);
                        switch (j) {
                        case 2:
                            cellNew.setCellValue(ec2Ebs.getName());
                            break;
                        case 3:
                            cellNew.setCellValue(ec2Ebs.getVolumeId());
                            break;
                        case 4:
                            cellNew.setCellValue(ec2Ebs.getSize() + ComConst.SPACE + ComConst.GIBI_BYTE);
                            break;
                        case 5:
                            cellNew.setCellValue(DateUtil.toString(ec2Ebs.getCreateTime(), DateUtil.JAPANESE_FORMAT));
                            break;
                        case 6:
                            cellNew.setCellValue(ec2Ebs.getAvailabilityZone());
                            break;
                        default:
                            // セルに値を設定
                            setValue(cellNew, cell);
                        }
                    }
                }
            }
        }
        return rowCount;
    }

    private int setDataEc2Snapshot(Sheet newSheet, Sheet sheet, int rowCount, List<EC2Snapshot> lsEC2Snapshot) {
        Row row;
        Row rowNew;
        Cell cell;
        Cell cellNew;
        StringBuilder sb;
        for (EC2Snapshot ec2Snapshot : lsEC2Snapshot) {
            row = sheet.getRow(rowNumEC2 + 17);
            if (row != null) {
                rowNew = newSheet.createRow(rowCount++);
                // 行の縦幅を設定
                rowNew.setHeight(row.getHeight());

                for (int j = 0; j < row.getLastCellNum(); j++) {
                    cell = row.getCell(j);
                    if (cell != null) {
                        // 行の横幅を設定
                        newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                        cellNew = rowNew.createCell(j);
                        CellStyle style = cell.getCellStyle();
                        style.setWrapText(true);
                        cellNew.setCellStyle(style);
                        switch (j) {
                        case 2:
                            cellNew.setCellValue(ec2Snapshot.getName());
                            break;
                        case 3:
                            cellNew.setCellValue(ec2Snapshot.getSnapshotId());
                            break;
                        case 4:
                            cellNew.setCellValue(ec2Snapshot.getVolumeSize() + ComConst.SPACE + ComConst.GIBI_BYTE);
                            break;
                        case 5:
                            cellNew.setCellValue(ec2Snapshot.getDescription());
                            break;
                        case 6:
                            cellNew.setCellValue(
                                    DateUtil.toString(ec2Snapshot.getStartTime(), DateUtil.PATTERN_YYYYMMDDTHHMMSS));
                            break;
                        case 7:
                            cellNew.setCellValue(ec2Snapshot.getEncrypted() ? MsgProps.getString(MsgConst.PUBLIC_LABEL)
                                    : MsgProps.getString(MsgConst.PRIVATE_LABEL));
                            break;
                        case 8:
                            sb = new StringBuilder();
                            for (CreateVolumePermission createVolumePermission : ec2Snapshot.getCreateVolumePermissions()) {
                                if (!CommonUtil.isEmpty(createVolumePermission.getUserId())) {
                                    sb.append(createVolumePermission.getUserId()).append(ComConst.COMMA)
                                            .append(ComConst.SPACE);
                                }
                            }
                            if (sb.length() > 0) {
                                sb.deleteCharAt(sb.length() - 2);
                            }
                            cellNew.setCellValue(sb.toString().trim());
                            break;
                        default:
                            // セルに値を設定
                            setValue(cellNew, cell);
                        }
                    }
                }
            }
        }
        return rowCount;
    }

    private int setDataEc2RI(Sheet newSheet, Sheet sheet, int rowCount, List<EC2RI> lsEC2RI) {
        Row row;
        Row rowNew;
        Cell cell;
        Cell cellNew;
        for (EC2RI ec2RI : lsEC2RI) {
            row = sheet.getRow(rowNumEC2 + 17);
            if (row != null) {
                rowNew = newSheet.createRow(rowCount++);
                // 行の縦幅を設定
                rowNew.setHeight(row.getHeight());

                for (int j = 0; j < row.getLastCellNum(); j++) {
                    cell = row.getCell(j);
                    if (cell != null) {
                        // 行の横幅を設定
                        newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                        cellNew = rowNew.createCell(j);
                        CellStyle style = cell.getCellStyle();
                        style.setWrapText(true);
                        cellNew.setCellStyle(style);
                        switch (j) {
                        case 2:
                            cellNew.setCellValue(ec2RI.getReservedInstancesId());
                            break;
                        case 3:
                            cellNew.setCellValue(ec2RI.getInstanceType());
                            break;
                        case 4:
                            cellNew.setCellValue(ec2RI.getInstanceCount());
                            break;
                        case 5:
                            cellNew.setCellValue(DateUtil.toString(ec2RI.getStart(), DateUtil.PATTERN_YYYYMMDDTHHMMSS));
                            break;
                        case 6:
                            cellNew.setCellValue(DateUtil.toString(ec2RI.getEnd(), DateUtil.PATTERN_YYYYMMDDTHHMMSS));
                            break;
                        case 7:
                            cellNew.setCellValue(ec2RI.getState());
                            break;
                        case 8:
                            cellNew.setCellValue(ec2RI.getScope());
                            break;
                        case 9:
                            cellNew.setCellValue(ec2RI.getAvailabilityZone());
                            break;
                        case 10:
                            cellNew.setCellValue(ec2RI.getOfferingClass());
                            break;
                        case 11:
                            cellNew.setCellValue(ec2RI.getProductDescription());
                            break;
                        default:
                            // セルに値を設定
                            setValue(cellNew, cell);
                        }
                    }
                }
            }
        }
        return rowCount;
    }

    /**
     * RDS情報を設定
     */
    public int setRegionDataRDS(Sheet newSheet, Sheet sheet, JSONObject rds, int rowCount) {
        RDSReport rdsReport = CommonUtil.mapperJson(rds.toString(4), RDSReport.class);

        // DBインスタンス
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRDS + 2);
        rowCount = setDataRDSInstances(newSheet, sheet, rowCount, rdsReport.getLsDBInstanceReport());
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRDS + 5);

        // スナップショット（手動）
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRDS + 6);
        rowCount = setDataRDSSnapshot(newSheet, sheet, rowCount, rdsReport.getLsDBSnapshotReport());
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRDS + 10);


        // RI
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRDS + 11);
        rowCount = setDataRDSRI(newSheet, sheet, rowCount, rdsReport.getLsReservedDBInstanceReport());
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRDS + 14);

        return rowCount;
    }

    private int setDataRDSInstances(Sheet newSheet, Sheet sheet, int rowCount, List<DBInstanceReport> lsDBInstanceReport) {
        Row row;
        Row rowNew;
        Cell cell;
        Cell cellNew;
        StringBuilder sb;
        for (DBInstanceReport dbInstanceReport : lsDBInstanceReport) {
            row = sheet.getRow(rowNumRDS + 3);
            if (row != null) {
                rowNew = newSheet.createRow(rowCount++);
                // 行の縦幅を設定
                rowNew.setHeight(row.getHeight());

                for (int j = 0; j < row.getLastCellNum(); j++) {
                    cell = row.getCell(j);
                    if (cell != null) {
                        // 行の横幅を設定
                        newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                        cellNew = rowNew.createCell(j);
                        CellStyle style = cell.getCellStyle();
                        style.setWrapText(true);
                        cellNew.setCellStyle(style);
                        switch (j) {
                        case 2:
                            cellNew.setCellValue(dbInstanceReport.getdBInstanceIdentifier());
                            break;
                        case 3:
                            cellNew.setCellValue(dbInstanceReport.getVpcId());
                            break;
                        case 4:
                            cellNew.setCellValue(dbInstanceReport.getMultiAZ() ? MsgProps.getString(MsgConst.YES_EN)
                                    : MsgProps.getString(MsgConst.NO_EN));
                            break;
                        case 5:
                            cellNew.setCellValue(dbInstanceReport.getdBInstanceClass());
                            break;
                        case 6:
                            cellNew.setCellValue(dbInstanceReport.getdBInstanceStatus());
                            break;
                        case 7:
                            cellNew.setCellValue(dbInstanceReport.getAllocatedStorage() + ComConst.GIGA_BYTE);
                            break;
                        case 8:
                            sb = new StringBuilder();
                            for (VpcSecurityGroupMembership groupMembership : dbInstanceReport.getVpcSecurityGroups()) {
                                if (!CommonUtil.isEmpty(groupMembership.getVpcSecurityGroupId())) {
                                    sb.append(groupMembership.getVpcSecurityGroupId()).append(ComConst.COMMA).append(ComConst.SPACE);
                                }
                            }
                            if (sb.length() > 0) {
                                sb.deleteCharAt(sb.length() - 2);
                            }
                            cellNew.setCellValue(sb.toString().trim());
                            break;
                        case 9:
                            cellNew.setCellValue(dbInstanceReport.getEngine());
                            break;
                        case 10:
                            cellNew.setCellValue(dbInstanceReport.getAvailabilityZone());
                            break;
                        case 11:
                            cellNew.setCellValue(DateUtil.toString(dbInstanceReport.getInstanceCreateTime(),
                                    DateUtil.PATTERN_YYYYMMDDTHHMMSS));
                            break;
                        case 12:
                            cellNew.setCellValue(dbInstanceReport.getPubliclyAccessible()
                                    ? MsgProps.getString(MsgConst.YES_JP) : MsgProps.getString(MsgConst.NO_JP));
                            break;
                        case 13:
                            cellNew.setCellValue(dbInstanceReport.getStorageEncrypted()
                                    ? MsgProps.getString(MsgConst.YES_JP) : MsgProps.getString(MsgConst.NO_JP));
                            break;
                        case 14:
                            sb = new StringBuilder();
                            for (com.amazonaws.services.rds.model.Tag tag : dbInstanceReport.getTagList()) {
                                sb.append(tag.getKey()).append(ComConst.EQUAL).append(tag.getValue())
                                        .append(ComConst.COMMA).append(ComConst.SPACE);
                            }
                            if (sb.length() > 0) {
                                sb.deleteCharAt(sb.length() - 2);
                            }
                            cellNew.setCellValue(sb.toString().trim());
                            break;
                        default:
                            // セルに値を設定
                            setValue(cellNew, cell);
                        }
                    }
                }
            }
        }
        return rowCount;
    }

    private int setDataRDSSnapshot(Sheet newSheet, Sheet sheet, int rowCount, List<DBSnapshotReport> lsDBSnapshotReport) {
        Row row;
        Row rowNew;
        Cell cell;
        Cell cellNew;
        for (DBSnapshotReport dbSnapshotReport : lsDBSnapshotReport) {
            row = sheet.getRow(rowNumRDS + 7);
            if (row != null) {
                rowNew = newSheet.createRow(rowCount++);
                // 行の縦幅を設定
                rowNew.setHeight(row.getHeight());

                for (int j = 0; j < row.getLastCellNum(); j++) {
                    cell = row.getCell(j);
                    if (cell != null) {
                        // 行の横幅を設定
                        newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                        cellNew = rowNew.createCell(j);
                        CellStyle style = cell.getCellStyle();
                        style.setWrapText(true);
                        cellNew.setCellStyle(style);
                        switch (j) {
                        case 2:
                            cellNew.setCellValue(dbSnapshotReport.getdBSnapshotIdentifier());
                            break;
                        case 3:
                            cellNew.setCellValue(dbSnapshotReport.getdBInstanceIdentifier());
                            break;
                        case 4:
                            cellNew.setCellValue(DateUtil.toString(dbSnapshotReport.getSnapshotCreateTime(),
                                    DateUtil.PATTERN_YYYYMMDDTHHMMSS));
                            break;
                        default:
                            // セルに値を設定
                            setValue(cellNew, cell);
                        }
                    }
                }
            }
        }
        return rowCount;
    }

    private int setDataRDSRI(Sheet newSheet, Sheet sheet, int rowCount, List<ReservedDBInstanceReport> lsReservedDBInstanceReport) {
        Row row;
        Row rowNew;
        Cell cell;
        Cell cellNew;
        for (ReservedDBInstanceReport dbReservedDBInstanceReport : lsReservedDBInstanceReport) {
            row = sheet.getRow(rowNumRDS + 12);
            if (row != null) {
                rowNew = newSheet.createRow(rowCount++);
                // 行の縦幅を設定
                rowNew.setHeight(row.getHeight());

                for (int j = 0; j < row.getLastCellNum(); j++) {
                    cell = row.getCell(j);
                    if (cell != null) {
                        // 行の横幅を設定
                        newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                        cellNew = rowNew.createCell(j);
                        CellStyle style = cell.getCellStyle();
                        style.setWrapText(true);
                        cellNew.setCellStyle(style);
                        switch (j) {
                        case 2:
                            cellNew.setCellValue(dbReservedDBInstanceReport.getReservedDBInstanceId());
                            break;
                        case 3:
                            cellNew.setCellValue(dbReservedDBInstanceReport.getdBInstanceClass());
                            break;
                        case 4:
                            cellNew.setCellValue(dbReservedDBInstanceReport.getOfferingType());
                            break;
                        case 5:
                            cellNew.setCellValue(DateUtil.toString(dbReservedDBInstanceReport.getStartTime(),
                                    DateUtil.PATTERN_YYYYMMDDTHHMMSS));
                            break;
                        case 6:
                            cellNew.setCellValue(dbReservedDBInstanceReport.getRemainingDay());
                            break;
                        case 7:
                            cellNew.setCellValue(dbReservedDBInstanceReport.getState());
                            break;
                        case 8:
                            cellNew.setCellValue(dbReservedDBInstanceReport.getMultiAZ()
                                    ? MsgProps.getString(MsgConst.YES_EN) : MsgProps.getString(MsgConst.NO_EN));
                            break;
                        case 9:
                            cellNew.setCellValue(dbReservedDBInstanceReport.getdBInstanceCount());
                            break;
                        default:
                            // セルに値を設定
                            setValue(cellNew, cell);
                        }
                    }
                }
            }
        }
        return rowCount;
    }

    /**
     * Redshift情報を設定
     */
    public int setRegionDataRedshift(Sheet newSheet, Sheet sheet, JSONObject redshift, int rowCount) {
        RedshiftReport redshiftReport = CommonUtil.mapperJson(redshift.toString(4), RedshiftReport.class);

        // クラスター
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRedshift + 2);
        rowCount = setDataRedshiftClusters(newSheet, sheet, rowCount, redshiftReport.getLsClusters());
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRedshift + 4);

        // スナップショット（手動）
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRedshift + 5);
        rowCount = setDataRedshiftSnapshot(newSheet, sheet, rowCount, redshiftReport.getLsSnapshot());
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRedshift + 8);

        // リザーブドノード
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRedshift + 9);
        rowCount = setDataRedshiftRI(newSheet, sheet, rowCount, redshiftReport.getLsReservedNode());
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumRedshift + 12);

        return rowCount;
    }

    private int setDataRedshiftClusters(Sheet newSheet, Sheet sheet, int rowCount,
            List<RedshiftClustersReport> lsRedshiftClustersReport) {
        Row row;
        Row rowNew;
        Cell cell;
        Cell cellNew;
        for (RedshiftClustersReport clustersReport : lsRedshiftClustersReport) {
            row = sheet.getRow(rowNumRedshift + 3);
            if (row != null) {
                rowNew = newSheet.createRow(rowCount++);
                // 行の縦幅を設定
                rowNew.setHeight(row.getHeight());

                for (int j = 0; j < row.getLastCellNum(); j++) {
                    cell = row.getCell(j);
                    if (cell != null) {
                        // 行の横幅を設定
                        newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                        cellNew = rowNew.createCell(j);
                        CellStyle style = cell.getCellStyle();
                        style.setWrapText(true);
                        cellNew.setCellStyle(style);
                        switch (j) {
                        case 2:
                            cellNew.setCellValue(clustersReport.getClusterIdentifier());
                            break;
                        case 3:
                            cellNew.setCellValue(clustersReport.getNodeType());
                            break;
                        case 4:
                            cellNew.setCellValue(clustersReport.getNumberOfNodes());
                            break;
                        case 5:
                            cellNew.setCellValue(clustersReport.getVpcId());
                            break;
                        case 6:
                            cellNew.setCellValue(clustersReport.getAvailabilityZone());
                            break;
                        case 7:
                            cellNew.setCellValue(clustersReport.getPubliclyAccessible()
                                    ? MsgProps.getString(MsgConst.YES_JP) : MsgProps.getString(MsgConst.NO_JP));
                            break;
                        case 8:
                            cellNew.setCellValue(clustersReport.getEncrypted()
                                    ? MsgProps.getString(MsgConst.YES_JP) : MsgProps.getString(MsgConst.NO_JP));
                            break;
                        case 9:
                            cellNew.setCellValue(clustersReport.getLoggingEnabled()
                                    ? EFFECT : DISABLED);
                            break;
                        default:
                            // セルに値を設定
                            setValue(cellNew, cell);
                        }
                    }
                }
            }
        }
        return rowCount;
    }

    private int setDataRedshiftSnapshot(Sheet newSheet, Sheet sheet, int rowCount,
            List<RedshiftSnapshotReport> lsSnapshot) {
        Row row;
        Row rowNew;
        Cell cell;
        Cell cellNew;
        for (RedshiftSnapshotReport snapshotReport : lsSnapshot) {
            row = sheet.getRow(rowNumRedshift + 6);
            if (row != null) {
                rowNew = newSheet.createRow(rowCount++);
                // 行の縦幅を設定
                rowNew.setHeight(row.getHeight());

                for (int j = 0; j < row.getLastCellNum(); j++) {
                    cell = row.getCell(j);
                    if (cell != null) {
                        // 行の横幅を設定
                        newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                        cellNew = rowNew.createCell(j);
                        CellStyle style = cell.getCellStyle();
                        style.setWrapText(true);
                        cellNew.setCellStyle(style);
                        switch (j) {
                        case 2:
                            cellNew.setCellValue(snapshotReport.getSnapshotIdentifier());
                            break;
                        case 3:
                            cellNew.setCellValue(snapshotReport.getClusterIdentifier());
                            break;
                        case 4:
                            cellNew.setCellValue(DateUtil.toString(snapshotReport.getSnapshotCreateTime(),
                                    DateUtil.PATTERN_YYYYMMDDTHHMMSS));
                            break;
                        default:
                            // セルに値を設定
                            setValue(cellNew, cell);
                        }
                    }
                }
            }
        }
        return rowCount;
    }

    private int setDataRedshiftRI(Sheet newSheet, Sheet sheet, int rowCount, List<RedshiftRIReport> lsReservedNode) {
        Row row;
        Row rowNew;
        Cell cell;
        Cell cellNew;
        for (RedshiftRIReport riReport : lsReservedNode) {
            row = sheet.getRow(rowNumRedshift + 10);
            if (row != null) {
                rowNew = newSheet.createRow(rowCount++);
                // 行の縦幅を設定
                rowNew.setHeight(row.getHeight());

                for (int j = 0; j < row.getLastCellNum(); j++) {
                    cell = row.getCell(j);
                    if (cell != null) {
                        // 行の横幅を設定
                        newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                        cellNew = rowNew.createCell(j);
                        CellStyle style = cell.getCellStyle();
                        style.setWrapText(true);
                        cellNew.setCellStyle(style);
                        switch (j) {
                        case 2:
                            cellNew.setCellValue(riReport.getReservedNodeId());
                            break;
                        case 3:
                            cellNew.setCellValue(riReport.getNodeType());
                            break;
                        case 4:
                            cellNew.setCellValue(riReport.getOfferingType());
                            break;
                        case 5:
                            cellNew.setCellValue(DateUtil.toString(riReport.getStartTime(),
                                    DateUtil.PATTERN_YYYYMMDDTHHMMSS));
                            break;
                        case 6:
                            cellNew.setCellValue(riReport.getRemainingDay());
                            break;
                        case 7:
                            cellNew.setCellValue(riReport.getState());
                            break;
                        case 8:
                            cellNew.setCellValue(riReport.getNodeCount());
                            break;
                        default:
                            // セルに値を設定
                            setValue(cellNew, cell);
                        }
                    }
                }
            }
        }
        return rowCount;
    }

    /**
     * Services情報を設定
     */
    public int setServiceCurrentUsage(Sheet newSheet, Sheet sheet, JSONObject redshift, int rowCount) {
        ServiceCurrentUsageReport servicesReport = CommonUtil.mapperJson(redshift.toString(4), ServiceCurrentUsageReport.class);
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumServices);
        Row row = sheet.getRow(rowNumServices + 1);
        Row rowNew = newSheet.createRow(rowCount++);
        // 行の縦幅を設定
        rowNew.setHeight(row.getHeight());
        for (int j = 0; j < row.getLastCellNum(); j++) {
            Cell cell = row.getCell(j);
            if (cell != null) {
                // 行の横幅を設定
                newSheet.setColumnWidth(j, sheet.getColumnWidth(j));
                Cell cellNew = rowNew.createCell(j);
                CellStyle style = cell.getCellStyle();
                style.setWrapText(true);
                cellNew.setCellStyle(style);
                switch (j) {
                case 2:
                    cellNew.setCellValue(servicesReport.getEc2());
                    break;
                case 3:
                    cellNew.setCellValue(servicesReport.getRds());
                    break;
                case 4:
                    cellNew.setCellValue(servicesReport.getRedshift());
                    break;
//                case 5:
//                    cellNew.setCellValue(CommonUtil.formatFileSize(servicesReport.getTotalBucketSizeBytes()));
//                    break;
                default:
                    // セルに値を設定
                    setValue(cellNew, cell);
                }
            }
        }
        rowCount = setDefaultRow(newSheet, sheet, rowCount, rowNumServices + 2);
        return rowCount;
    }
}
