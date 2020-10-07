package jp.classmethod.premembers.report.job.report_output.json;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.model.AmazonS3Exception;

import jp.classmethod.premembers.report.job.common.AsyncTaskStatus;
import jp.classmethod.premembers.report.job.config.AWSConfig;
import jp.classmethod.premembers.report.job.config.JobConfig;
import jp.classmethod.premembers.report.util.AWSUtil;
import jp.classmethod.premembers.report.util.FileUtil;

@Component
public class JsonReportOutputGlobalTask {

    @Autowired
    private AWSConfig awsConfig;
    @Autowired
    private JobConfig jobConfig;
    @Autowired
    private AsyncTaskStatus status;

    private final static String REGION = "global";

    private final static Logger LOGGER = LoggerFactory.getLogger(JsonReportOutputService.class);

    /**
     * レポートファイル作成 global
     *
     * @param reportId
     *            レポートID
     * @param accountId
     *            AWSアカウント
     * @param schemaVersion
     *            レポート書式バージョン
     * @param reportName
     *            レポート名
     */
    @Async("threadPool")
    public void execute(String reportId, String accountId, String schemaVersion, String reportName) {

        try {
            // レポートファイル作成 global
            reportOutPut(reportId, accountId, schemaVersion, reportName);

        } catch (Exception e) {
            // エラーをセットする。
            status.setError();
            e.printStackTrace();
        }
    }

    /**
     * レポートファイル作成 global
     *
     * @param reportId
     *            レポートID
     * @param accountId
     *            アカウントID
     */
    private void reportOutPut(String reportId, String accountId, String schemaVersion, String reportName)
            throws Exception {

        // 出力用
        JSONObject rootJson = new JSONObject();

        rootJson.accumulate("account", accountId);
        rootJson.accumulate("region", REGION);
        rootJson.accumulate("schema_version", schemaVersion);
        rootJson.accumulate("report_name", reportName);

        // IAM情報の設定
        setIAmInfo(reportId, accountId, rootJson);
        // CloudTrail情報の設定
        setCloudTrailInfo(reportId, accountId, rootJson);

        // ローカルファイルパス
        String localFileDirectory = jobConfig.getTemporaryDirectory();
        String localFileName = reportId + "_" + accountId + "_global.json";
        String localFilePath = localFileDirectory + localFileName;

        // ローカルファイルを削除
        FileUtil.fileDelete(localFilePath);

        // ローカルファイルを出力
        FileUtil.outputFile(localFileDirectory, localFileName, rootJson.toString(4));

        // S3ファイル名
        String s3FilePath = reportId + "/report_json/" + accountId + "/" + reportId + "_" + accountId + "_global.json";

        try {
            // S3にアップロード
            AWSUtil.upload(awsConfig, s3FilePath, localFilePath);
        } catch (AmazonServiceException e) {
            // ログレベル： ERROR
            LOGGER.error("S3ファイルアップロードに失敗しました。: Bucket=" + awsConfig.getS3ReportBucket() + ", Key=" + s3FilePath);
            throw e;
        } catch (SdkClientException e) {
            // ログレベル： ERROR
            LOGGER.error("S3ファイルアップロードに失敗しました。: Bucket=" + awsConfig.getS3ReportBucket() + ", Key=" + s3FilePath);
            throw e;
        }

        // ローカルファイルを削除
        FileUtil.fileDelete(localFilePath);

    }

    /**
     * IAM情報の設定
     *
     * @param reportId
     *            レポートID
     * @param accountId
     *            アカウントID
     * @param rootJson
     *            出力用JSON
     */
    private void setIAmInfo(String reportId, String accountId, JSONObject rootJson) throws Exception {

        String iamFilepath = reportId + "/resource/" + accountId + "/global/IAM.json";

        try {
            String jsonStr = AWSUtil.readS3Object(awsConfig, iamFilepath);
            JSONObject jsonObject = new JSONObject(jsonStr);

            if (!jsonObject.isNull("IAM")) {

                JSONObject iam = jsonObject.getJSONObject("IAM");

                JSONObject iamJson = new JSONObject();

                if (!iam.isNull("iam_user")) {
                    // IAmUser情報の設定
                    setIAmUserInfo(iam, iamJson);
                }

                if (!iam.isNull("access_key")) {
                    // AccessKey情報の設定
                    setAccessKeyInfo(iam, iamJson);
                }

                if (!iam.isNull("group")) {
                    // Group情報の設定
                    setGroupInfo(iam, iamJson);
                }

                if (!iam.isNull("role")) {
                    // Role情報の設定
                    setRoleInfo(iam, iamJson);
                }

                rootJson.accumulate("IAM", iamJson);
            }

        } catch (AmazonS3Exception e) {
            // ログレベル： ERROR
            LOGGER.error("S3ファイルダウンロードに失敗しました。: Bucket=" + awsConfig.getS3ReportBucket() + ", Key=" + iamFilepath);

            throw e;
        }
    }

    /**
     * IAmUser情報の設定
     *
     * @param iam
     *            読込用JSON
     * @param iamJson
     *            出力用JSON
     */
    private void setIAmUserInfo(JSONObject iam, JSONObject iamJson) throws Exception {

        JSONArray iamUsers = iam.getJSONArray("iam_user");

        List<JSONObject> iamUserJsonArray = new ArrayList<JSONObject>();

        for (Object tempIamUser : iamUsers) {

            JSONObject iamUserJson = new JSONObject();

            JSONObject iamUser = (JSONObject) tempIamUser;

            if (!iamUser.isNull("UserName")) {
                iamUserJson.accumulate("user_name", iamUser.getString("UserName"));
            }

            boolean passExtFlag = false;

            if (!iamUser.isNull("PasswordLastUsed")) {
                JSONObject passwordLastUsed = iamUser.getJSONObject("PasswordLastUsed");

                if (!passwordLastUsed.isNull("$date")) {
                    iamUserJson.accumulate("password_last_used", passwordLastUsed.getLong("$date"));
                    passExtFlag = true;
                }
            }

            iamUserJson.accumulate("password", passExtFlag);

            if (!iamUser.isNull("access_key")) {
                JSONArray accessKeys = iamUser.getJSONArray("access_key");

                List<Boolean> statusList = new ArrayList<Boolean>();

                for (Object tempAccessKeys : accessKeys) {

                    JSONObject accessKey = (JSONObject) tempAccessKeys;

                    String status = "";

                    if (!accessKey.isNull("Status")) {
                        status = accessKey.getString("Status");
                    }

                    if ("Active".equals(status)) {
                        statusList.add(true);
                    } else {
                        statusList.add(false);
                    }
                }

                iamUserJson.accumulate("access_key", statusList);
            }

            boolean mfaExtFlag = false;

            if (!iamUser.isNull("mfa")) {
                JSONArray mfas = iamUser.getJSONArray("mfa");
                if (mfas != null && mfas.length() > 0) {
                    mfaExtFlag = true;
                }
            }

            iamUserJson.accumulate("mfa", mfaExtFlag);

            if (!iamUser.isNull("CreateDate")) {
                JSONObject createDate = iamUser.getJSONObject("CreateDate");

                if (!createDate.isNull("$date")) {
                    iamUserJson.accumulate("create_date", createDate.getLong("$date"));
                }
            }

            iamUserJsonArray.add(iamUserJson);
        }

        iamJson.accumulate("iam_user", iamUserJsonArray);
    }

    /**
     * AccessKey情報の設定
     *
     * @param iam
     *            読込用JSON
     * @param iamJson
     *            出力用JSON
     */
    private void setAccessKeyInfo(JSONObject iam, JSONObject iamJson) throws Exception {

        JSONArray accessKeys = iam.getJSONArray("access_key");

        List<JSONObject> accessKeyJsonArray = new ArrayList<JSONObject>();

        for (Object tempAccessKeys : accessKeys) {

            JSONObject accessKeyJson = new JSONObject();

            JSONObject accessKey = (JSONObject) tempAccessKeys;

            if (!accessKey.isNull("UserName")) {
                accessKeyJson.accumulate("user_name", accessKey.getString("UserName"));
            }

            if (!accessKey.isNull("AccessKeyId")) {
                accessKeyJson.accumulate("access_key_id", accessKey.getString("AccessKeyId"));
            }

            if (!accessKey.isNull("CreateDate")) {
                JSONObject createDate = accessKey.getJSONObject("CreateDate");

                if (!createDate.isNull("$date")) {
                    accessKeyJson.accumulate("create_date", createDate.getLong("$date"));
                }
            }

            if (!accessKey.isNull("last_used_date")) {

                JSONObject lastUsedDate = accessKey.getJSONObject("last_used_date");

                if (!lastUsedDate.isNull("$date")) {
                    accessKeyJson.accumulate("last_used_date", lastUsedDate.getLong("$date"));
                }

                // accessKeyJson.accumulate("last_used_date",
                // accessKey.getString("last_used_date"));
            }

            if (!accessKey.isNull("Status")) {
                accessKeyJson.accumulate("status", accessKey.getString("Status"));
            }

            accessKeyJsonArray.add(accessKeyJson);
        }

        iamJson.accumulate("access_key", accessKeyJsonArray);
    }

    /**
     * Group情報の設定
     *
     * @param iam
     *            読込用JSON
     * @param iamJson
     *            出力用JSON
     */
    private void setGroupInfo(JSONObject iam, JSONObject iamJson) throws Exception {

        JSONArray groups = iam.getJSONArray("group");

        List<JSONObject> groupJsonArray = new ArrayList<JSONObject>();

        for (Object tempGroups : groups) {

            JSONObject groupJson = new JSONObject();

            JSONObject group = (JSONObject) tempGroups;

            if (!group.isNull("GroupName")) {
                groupJson.accumulate("group_name", group.getString("GroupName"));
            }

            if (!group.isNull("user")) {
                JSONArray users = group.getJSONArray("user");

                List<String> userList = new ArrayList<String>();

                for (Object tempUsers : users) {
                    userList.add(String.valueOf(tempUsers));
                }

                groupJson.accumulate("user", userList);
            }

            if (!group.isNull("managed_policies")) {
                JSONArray managedPolicies = group.getJSONArray("managed_policies");

                List<String> managedPolicyList = new ArrayList<String>();

                for (Object tempManagedPolicies : managedPolicies) {
                    managedPolicyList.add(String.valueOf(tempManagedPolicies));
                }

                groupJson.accumulate("managed_policies", managedPolicyList);

            }

            if (!group.isNull("inline_policies")) {
                JSONArray inlinePolicies = group.getJSONArray("inline_policies");

                List<String> inlinePolicyList = new ArrayList<String>();

                for (Object tempInlinePolicies : inlinePolicies) {
                    inlinePolicyList.add(String.valueOf(tempInlinePolicies));
                }

                groupJson.accumulate("inline_policies", inlinePolicyList);
            }

            if (!group.isNull("CreateDate")) {
                JSONObject createDate = group.getJSONObject("CreateDate");

                if (!createDate.isNull("$date")) {
                    groupJson.accumulate("create_date", createDate.getLong("$date"));
                }
            }

            groupJsonArray.add(groupJson);
        }

        iamJson.accumulate("group", groupJsonArray);
    }

    /**
     * Role情報の設定
     *
     * @param iam
     *            読込用JSON
     * @param iamJson
     *            出力用JSON
     */
    private void setRoleInfo(JSONObject iam, JSONObject iamJson) throws Exception {

        JSONArray roles = iam.getJSONArray("role");

        List<JSONObject> roleJsonArray = new ArrayList<JSONObject>();

        for (Object tempRole : roles) {

            JSONObject roleJson = new JSONObject();

            JSONObject role = (JSONObject) tempRole;

            JSONObject AssumeRolePolicyDocument = null;

            if (!role.isNull("RoleName")) {
                roleJson.accumulate("role_name", role.getString("RoleName"));
            }

            if (!role.isNull("Description")) {
                roleJson.accumulate("description", role.getString("Description"));
            }

            if (!role.isNull("managed_policies")) {
                JSONArray managedPolicies = role.getJSONArray("managed_policies");

                List<String> policyNameList = new ArrayList<String>();

                for (Object tempManagedPolicies : managedPolicies) {

                    JSONObject Policy = (JSONObject) tempManagedPolicies;

                    if (!Policy.isNull("policyName")) {
                        policyNameList.add(Policy.getString("policyName"));
                    }
                }

                Object[] policyNameArray = policyNameList.toArray();
                roleJson.accumulate("managed_policies", policyNameArray);
            }

            if (!role.isNull("inline_policies")) {
                JSONArray inlinePolicies = role.getJSONArray("inline_policies");

                List<String> inlinePolicyList = new ArrayList<String>();

                for (Object tempInlinePolicies : inlinePolicies) {
                    inlinePolicyList.add(String.valueOf(tempInlinePolicies));
                }

                roleJson.accumulate("inline_policies", inlinePolicyList);
            }

            if (!role.isNull("AssumeRolePolicyDocument")) {
                AssumeRolePolicyDocument = role.getJSONObject("AssumeRolePolicyDocument");

                if (!AssumeRolePolicyDocument.isNull("Statement")) {
                    JSONArray Statements = AssumeRolePolicyDocument.getJSONArray("Statement");

                    List<String> principalList = new ArrayList<String>();

                    for (Object tempStatement : Statements) {

                        JSONObject statement = (JSONObject) tempStatement;

                        JSONObject principal = null;

                        if (!statement.isNull("Principal")) {
                            principal = statement.getJSONObject("Principal");

                            if (!principal.isNull("AWS")) {

                                if (principal.get("AWS") != null) {

                                    if (principal.get("AWS") instanceof String) {
                                        principalList.add(principal.getString("AWS"));

                                    } else {

                                        JSONArray awss = principal.getJSONArray("AWS");

                                        for (Object aws : awss) {
                                            principalList.add((String) aws);
                                        }
                                    }
                                }

                                // principalList.add(principal.getString("AWS"));
                            }
                        }
                    }

                    roleJson.accumulate("principal_account_id", principalList);
                }
            }

            if (!role.isNull("CreateDate")) {
                JSONObject createDate = role.getJSONObject("CreateDate");

                if (!createDate.isNull("$date")) {
                    roleJson.accumulate("create_date", createDate.getLong("$date"));
                }
            }

            roleJsonArray.add(roleJson);
        }

        iamJson.accumulate("role", roleJsonArray);
    }

    /**
     * CloudTrail情報の設定
     *
     * @param reportId
     *            レポートID
     * @param accountId
     *            アカウントID
     * @param rootJson
     *            出力用JSON
     */
    private void setCloudTrailInfo(String reportId, String accountId, JSONObject rootJson) throws Exception {

        String cloudTrailFilepath = reportId + "/resource/" + accountId + "/global/CloudTrail.json";

        // CloudTrail.jsonファイル読み込み
        try {
            String jsonStr = AWSUtil.readS3Object(awsConfig, cloudTrailFilepath);
            JSONObject jsonObject = new JSONObject(jsonStr);

            if (!jsonObject.isNull("CloudTrail")) {

                JSONObject cloudTrail = jsonObject.getJSONObject("CloudTrail");

                JSONObject cloudTrailJson = new JSONObject();

                if (!cloudTrail.isNull("trail")) {

                    JSONArray trails = cloudTrail.getJSONArray("trail");

                    List<JSONObject> trailJsonArray = new ArrayList<JSONObject>();

                    for (Object temptrails : trails) {

                        JSONObject trailJson = new JSONObject();

                        JSONObject trail = (JSONObject) temptrails;

                        if (!trail.isNull("Name")) {
                            trailJson.accumulate("name", trail.getString("Name"));
                        }

                        if (!trail.isNull("HomeRegion")) {
                            trailJson.accumulate("region", trail.getString("HomeRegion"));
                        }

                        if (!trail.isNull("trail_status")) {
                            JSONObject trailStatus = trail.getJSONObject("trail_status");

                            if (!trailStatus.isNull("isLogging")) {
                                trailJson.accumulate("is_logging", trailStatus.getBoolean("isLogging"));
                            }
                        }

                        if (!trail.isNull("S3BucketName")) {
                            trailJson.accumulate("s3_bucketName", trail.getString("S3BucketName"));
                        }

                        if (trail.has("IsMultiRegionTrail")) {
                            trailJson.accumulate("IsMultiRegionTrail", trail.get("IsMultiRegionTrail"));
                        }

                        trailJsonArray.add(trailJson);
                    }

                    cloudTrailJson.accumulate("trail", trailJsonArray);
                }

                rootJson.accumulate("CloudTrail", cloudTrailJson);
            }

        } catch (AmazonS3Exception e) {
            LOGGER.error(
                    "S3ファイルダウンロードに失敗しました。: Bucket=" + awsConfig.getS3ReportBucket() + ", Key=" + cloudTrailFilepath);
            throw e;

        }

    }

}
