package jp.classmethod.premembers.report.job.awsresource_info_collection;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.apache.http.HttpStatus;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.cloudtrail.AWSCloudTrail;
import com.amazonaws.services.cloudtrail.AWSCloudTrailClientBuilder;
import com.amazonaws.services.cloudtrail.model.DescribeTrailsRequest;
import com.amazonaws.services.cloudtrail.model.DescribeTrailsResult;
import com.amazonaws.services.cloudtrail.model.GetTrailStatusRequest;
import com.amazonaws.services.cloudtrail.model.GetTrailStatusResult;
import com.amazonaws.services.cloudtrail.model.Trail;
import com.amazonaws.services.cloudwatch.AmazonCloudWatch;
import com.amazonaws.services.cloudwatch.AmazonCloudWatchClientBuilder;
import com.amazonaws.services.cloudwatch.model.Datapoint;
import com.amazonaws.services.cloudwatch.model.Dimension;
import com.amazonaws.services.cloudwatch.model.GetMetricStatisticsRequest;
import com.amazonaws.services.cloudwatch.model.GetMetricStatisticsResult;
import com.amazonaws.services.ec2.AmazonEC2;
import com.amazonaws.services.ec2.AmazonEC2ClientBuilder;
import com.amazonaws.services.ec2.model.DescribeImageAttributeRequest;
import com.amazonaws.services.ec2.model.DescribeImagesRequest;
import com.amazonaws.services.ec2.model.DescribeImagesResult;
import com.amazonaws.services.ec2.model.DescribeInstancesResult;
import com.amazonaws.services.ec2.model.DescribeReservedInstancesResult;
import com.amazonaws.services.ec2.model.DescribeSecurityGroupsResult;
import com.amazonaws.services.ec2.model.DescribeSnapshotAttributeRequest;
import com.amazonaws.services.ec2.model.DescribeSnapshotAttributeResult;
import com.amazonaws.services.ec2.model.DescribeSnapshotsRequest;
import com.amazonaws.services.ec2.model.DescribeSnapshotsResult;
import com.amazonaws.services.ec2.model.DescribeVolumesResult;
import com.amazonaws.services.ec2.model.Image;
import com.amazonaws.services.ec2.model.ImageAttribute;
import com.amazonaws.services.ec2.model.ImageAttributeName;
import com.amazonaws.services.ec2.model.Instance;
import com.amazonaws.services.ec2.model.InstanceStateName;
import com.amazonaws.services.ec2.model.Reservation;
import com.amazonaws.services.ec2.model.Snapshot;
import com.amazonaws.services.ec2.model.SnapshotAttributeName;
import com.amazonaws.services.identitymanagement.AmazonIdentityManagement;
import com.amazonaws.services.identitymanagement.AmazonIdentityManagementClientBuilder;
import com.amazonaws.services.identitymanagement.model.AccessKeyMetadata;
import com.amazonaws.services.identitymanagement.model.AttachedPolicy;
import com.amazonaws.services.identitymanagement.model.GetAccessKeyLastUsedRequest;
import com.amazonaws.services.identitymanagement.model.GetAccessKeyLastUsedResult;
import com.amazonaws.services.identitymanagement.model.GetGroupRequest;
import com.amazonaws.services.identitymanagement.model.GetGroupResult;
import com.amazonaws.services.identitymanagement.model.Group;
import com.amazonaws.services.identitymanagement.model.ListAccessKeysRequest;
import com.amazonaws.services.identitymanagement.model.ListAccessKeysResult;
import com.amazonaws.services.identitymanagement.model.ListAttachedGroupPoliciesRequest;
import com.amazonaws.services.identitymanagement.model.ListAttachedGroupPoliciesResult;
import com.amazonaws.services.identitymanagement.model.ListAttachedRolePoliciesRequest;
import com.amazonaws.services.identitymanagement.model.ListAttachedRolePoliciesResult;
import com.amazonaws.services.identitymanagement.model.ListGroupPoliciesRequest;
import com.amazonaws.services.identitymanagement.model.ListGroupPoliciesResult;
import com.amazonaws.services.identitymanagement.model.ListGroupsResult;
import com.amazonaws.services.identitymanagement.model.ListMFADevicesRequest;
import com.amazonaws.services.identitymanagement.model.ListRolePoliciesRequest;
import com.amazonaws.services.identitymanagement.model.ListRolePoliciesResult;
import com.amazonaws.services.identitymanagement.model.ListRolesResult;
import com.amazonaws.services.identitymanagement.model.MFADevice;
import com.amazonaws.services.identitymanagement.model.Role;
import com.amazonaws.services.identitymanagement.model.User;
import com.amazonaws.services.rds.AmazonRDS;
import com.amazonaws.services.rds.AmazonRDSClientBuilder;
import com.amazonaws.services.rds.model.DBInstance;
import com.amazonaws.services.rds.model.DescribeDBInstancesResult;
import com.amazonaws.services.rds.model.DescribeDBSnapshotsRequest;
import com.amazonaws.services.rds.model.DescribeDBSnapshotsResult;
import com.amazonaws.services.rds.model.DescribeReservedDBInstancesResult;
import com.amazonaws.services.rds.model.ListTagsForResourceRequest;
import com.amazonaws.services.rds.model.ListTagsForResourceResult;
import com.amazonaws.services.redshift.AmazonRedshift;
import com.amazonaws.services.redshift.AmazonRedshiftClientBuilder;
import com.amazonaws.services.redshift.model.Cluster;
import com.amazonaws.services.redshift.model.DescribeClusterSnapshotsRequest;
import com.amazonaws.services.redshift.model.DescribeClusterSnapshotsResult;
import com.amazonaws.services.redshift.model.DescribeClustersResult;
import com.amazonaws.services.redshift.model.DescribeLoggingStatusRequest;
import com.amazonaws.services.redshift.model.DescribeLoggingStatusResult;
import com.amazonaws.services.redshift.model.DescribeReservedNodesResult;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.AccessControlList;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.BucketPolicy;
import com.amazonaws.services.s3.model.GetBucketAclRequest;
import com.amazonaws.services.s3.model.GetBucketLocationRequest;
import com.amazonaws.services.s3.model.GetBucketPolicyRequest;
import com.amazonaws.services.s3.model.Grant;
import com.amazonaws.services.securitytoken.AWSSecurityTokenServiceAsyncClientBuilder;
import com.amazonaws.services.securitytoken.model.AssumeRoleRequest;
import com.amazonaws.services.securitytoken.model.AssumeRoleResult;
import com.amazonaws.services.securitytoken.model.Credentials;

import jp.classmethod.premembers.report.constant.MsgConst;
import jp.classmethod.premembers.report.exception.PremembersApplicationException;
import jp.classmethod.premembers.report.job.common.AsyncTaskStatus;
import jp.classmethod.premembers.report.job.config.AWSConfig;
import jp.classmethod.premembers.report.job.config.JobConfig;
import jp.classmethod.premembers.report.job.config.ReportConfig;
import jp.classmethod.premembers.report.json.raw.RootNameRaw;
import jp.classmethod.premembers.report.json.raw.ec2.EC2;
import jp.classmethod.premembers.report.json.raw.ec2.EC2ImageRaw;
import jp.classmethod.premembers.report.json.raw.ec2.EC2ImagesPermissions;
import jp.classmethod.premembers.report.json.raw.ec2.EC2RootName;
import jp.classmethod.premembers.report.json.raw.ec2.EC2SnapshotRaw;
import jp.classmethod.premembers.report.json.raw.ec2.EC2SnapshotsPermissions;
import jp.classmethod.premembers.report.json.raw.rds.RDSListTagsForResource;
import jp.classmethod.premembers.report.json.raw.redshift.RedshiftLoggingStatus;
import jp.classmethod.premembers.report.json.resource.RootNameResource;
import jp.classmethod.premembers.report.json.resource.rds.DBInstanceResource;
import jp.classmethod.premembers.report.json.resource.rds.RDSResource;
import jp.classmethod.premembers.report.json.resource.redshift.ClusterResource;
import jp.classmethod.premembers.report.json.resource.redshift.RedshiftResource;
import jp.classmethod.premembers.report.properties.MsgProps;
import jp.classmethod.premembers.report.repository.PMAWSAccountCoops;
import jp.classmethod.premembers.report.repository.entity.PMAWSAccountCoopsProjectIndexItem;
import jp.classmethod.premembers.report.util.AWSUtil;
import jp.classmethod.premembers.report.util.CommonUtil;
import jp.classmethod.premembers.report.util.DateUtil;
import jp.classmethod.premembers.report.util.FileUtil;

/**
 * @author tagomasayuki
 *
 */
@Component
public class AWSResourceInfoCollectionTask {

    @Autowired
    private ReportConfig reportConfig;

    @Autowired
    private JobConfig jobConfig;

    @Autowired
    private AWSConfig awsConfig;

    @Autowired
    PMAWSAccountCoops pmAWSAccountCoops;

    @Autowired
    private AsyncTaskStatus taskStatus;

    private final static Logger LOGGER = LoggerFactory.getLogger(AWSResourceInfoCollectionTask.class);

    /**
     * @param awsAccountId
     *            情報収集対象のAWSアカウントID
     * @param projectId
     *            情報収集対象のAWSアカウントと連携しているプロジェクトのID
     */
    @Async("threadPool")
    public void execute(String awsAccountId, String projectId, String reportId) {
        LOGGER.info("---- AWS利用状況情報収集 処理開始 ----------------");
        LOGGER.info("  AWS Account : " + awsAccountId);
        LOGGER.info("  Project ID : " + projectId);

        // AWSアカウント連携情報の取得
        PMAWSAccountCoopsProjectIndexItem item = null;
        try {
            List<PMAWSAccountCoopsProjectIndexItem> items = pmAWSAccountCoops
                    .queryProjectIndexFilterEffectiveEnable(projectId, awsAccountId);
            if (items != null && items.size() > 0) {
                item = items.get(0);
            }
        } catch (RuntimeException e) {
            e.printStackTrace();
            String msg = String.format("AWSアカウント連携情報取得に失敗しました。: AWSアカウントID=%s, ProjectID=%s", awsAccountId, projectId);
            LOGGER.error(msg);
            taskStatus.setError();
            throw new PremembersApplicationException("ERROR", msg, e);
        }
        if (item == null) {
            String msg = String.format("対象のAWSアカウント連携情報がありません。: AWSアカウントID=%s, ProjectID=%s", awsAccountId, projectId);
            LOGGER.error(msg);
            taskStatus.setError();
            throw new PremembersApplicationException("ERROR", msg);
        }
        String roleName = item.getRoleName();
        String externalId = item.getExternalID();
        // 一時認証を行う
        Credentials credentials = getCredentials(awsAccountId, roleName, externalId);

        // AWS利用状況情報収集を行います
        try {
            describeUser(reportId, awsAccountId, credentials);
            describeRole(reportId, awsAccountId, credentials);
            describeGroup(reportId, awsAccountId, credentials);
            describeS3Bucket(reportId, awsAccountId, credentials);
            Regions[] regions = AWSUtil.getEnableRegions();
            for (Regions region : regions) {
                describeSecurityGroups(reportId, awsAccountId, credentials, region);
                describeCloudTrail(reportId, awsAccountId, credentials, region);
                // 0-14 - 0-18, 0-40, 0-41
                describeEC2(reportId, awsAccountId, credentials, region);
                // 0-19 - 0-21
                describeRDS(reportId, awsAccountId, credentials, region);
                // 0-22 - 0-23 - 0-24
                describeRedshift(reportId, awsAccountId, credentials, region);
            }
        } catch (RuntimeException e) {
            taskStatus.setError();
            throw new PremembersApplicationException("ERROR", e);
        }
        // 一時中間ファイル作成を行います
        try {
            createIAMReport(reportId, awsAccountId);
        } catch (RuntimeException e) {
            String msg = MessageFormat.format(MsgProps.getString(MsgConst.ERR_CREATE_FILE), new Object[] {"IAM.json"});
            LOGGER.error(msg);
            taskStatus.setError();
            throw new PremembersApplicationException("ERROR", msg);
        }
        try {
            createS3Report(reportId, awsAccountId);
        } catch (RuntimeException e) {
            String msg = MessageFormat.format(MsgProps.getString(MsgConst.ERR_CREATE_FILE), new Object[] {"S3.json"});
            LOGGER.error(msg);
            taskStatus.setError();
            throw new PremembersApplicationException("ERROR", msg);
        }
        try {
            createVPCReport(reportId, awsAccountId);
        } catch (RuntimeException e) {
            String msg = MessageFormat.format(MsgProps.getString(MsgConst.ERR_CREATE_FILE), new Object[] {"VPC.json"});
            LOGGER.error(msg);
            taskStatus.setError();
            throw new PremembersApplicationException("ERROR", msg);
        }
        try {
            createCloudTrailReport(reportId, awsAccountId);
        } catch (RuntimeException e) {
            String msg = MessageFormat.format(MsgProps.getString(MsgConst.ERR_CREATE_FILE),
                    new Object[] { "CloudTrail.json" });
            LOGGER.error(msg);
            taskStatus.setError();
            throw new PremembersApplicationException("ERROR", msg);
        }
        try {
            Regions[] regions = AWSUtil.getEnableRegions();
            for (Regions region : regions) {
                // 1-04
                createEC2Report(reportId, awsAccountId, region);
                // 1-05
                createRDSReport(reportId, awsAccountId, region);
                // 1-06
                createRedshiftReport(reportId, awsAccountId, region);
            }
        } catch (RuntimeException e) {
            taskStatus.setError();
            throw new PremembersApplicationException("ERROR", e);
        }
        LOGGER.info("---- AWS利用状況情報収集 処理終了 ----------------");
    }

    /**
     * AssumeRoleを行い、一時認証情報を取得
     *
     * @param awsAccountId
     * @param roleName
     * @param externalId
     * @return
     */
    private Credentials getCredentials(String awsAccountId, String roleName, String externalId) {
        String roleArn = "arn:aws:iam::" + awsAccountId + ":role/" + roleName;
        AssumeRoleRequest assumeRoleRequest = new AssumeRoleRequest().withRoleArn(roleArn).withRoleSessionName("assume")
                .withExternalId(externalId);
        try {
            AssumeRoleResult assumeRoleResult = AWSSecurityTokenServiceAsyncClientBuilder.defaultClient()
                    .assumeRole(assumeRoleRequest);
            return assumeRoleResult.getCredentials();
        } catch (RuntimeException e) {
            e.printStackTrace();
            taskStatus.setError();
            String msg = String.format("クレデンシャルの取得に失敗しました。: Role=%s", roleArn);
            LOGGER.error(msg);
            throw new PremembersApplicationException("ERROR", msg, e);
        }
    }

    /**
     * ユーザ情報を取得し、S3にアップロードします。
     *
     * @param reportId
     * @param awsAccountId
     * @param credentials
     */
    private void describeUser(String reportId, String awsAccountId, Credentials credentials) {
        AWSCredentials session = new BasicSessionCredentials(credentials.getAccessKeyId(),
                credentials.getSecretAccessKey(), credentials.getSessionToken());
        AmazonIdentityManagement iam = AmazonIdentityManagementClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(session)).build();
        String temporaryDirectory = jobConfig.getTemporaryDirectory();
        // IAM_Usersの取得
        List<User> users = iam.listUsers().getUsers();
        JSONArray iamJson = new JSONArray(users);
        FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId, "IAM_Users.json", iamJson.toString(4));
        AWSUtil.upload(awsConfig, reportId + "/raw/" + awsAccountId + "/global/IAM_Users.json",
                temporaryDirectory + reportId + "/" + awsAccountId + "/IAM_Users.json");
        JSONArray mfaJson = new JSONArray();
        JSONArray accessKeyJson = new JSONArray();
        // ユーザーごとに処理を行う
        for (User user : users) {
            // MFAデバイスの取得
            ListMFADevicesRequest mfaRequest = new ListMFADevicesRequest(user.getUserName());
            List<MFADevice> mfaDevices = iam.listMFADevices(mfaRequest).getMFADevices();
            for (MFADevice device : mfaDevices) {
                JSONObject mfa = new JSONObject(device);
                mfaJson.put(mfa);
            }
            // アクセスキーの取得
            ListAccessKeysRequest accessKeyRequest = new ListAccessKeysRequest();
            accessKeyRequest.setUserName(user.getUserName());
            ListAccessKeysResult accessKeyResult = iam.listAccessKeys(accessKeyRequest);
            for (AccessKeyMetadata metadata : accessKeyResult.getAccessKeyMetadata()) {
                JSONObject accessKey = new JSONObject();
                accessKey.put("UserName", metadata.getUserName());
                accessKey.put("AccessKeyId", metadata.getAccessKeyId());
                accessKey.put("Status", metadata.getStatus());
                accessKey.put("CreateDate", metadata.getCreateDate());
                accessKeyJson.put(accessKey);
                GetAccessKeyLastUsedRequest accessKeyLastUsedRequest = new GetAccessKeyLastUsedRequest();
                accessKeyLastUsedRequest.setAccessKeyId(metadata.getAccessKeyId());
                GetAccessKeyLastUsedResult accessKeyLastUsedResult = iam.getAccessKeyLastUsed(accessKeyLastUsedRequest);
                JSONObject accessKeyLastUsedJSON = new JSONObject(accessKeyLastUsedResult);
                FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId,
                        "IAM_AccessKeyLastUse_" + metadata.getAccessKeyId() + ".json",
                        accessKeyLastUsedJSON.toString(4));
                AWSUtil.upload(awsConfig,
                        reportId + "/raw/" + awsAccountId + "/global/IAM_AccessKeyLastUse_" + metadata.getAccessKeyId()
                                + ".json",
                        temporaryDirectory + reportId + "/" + awsAccountId + "/IAM_AccessKeyLastUse_"
                                + metadata.getAccessKeyId() + ".json");
            }
        }
        FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId, "IAM_MFADevices.json", mfaJson.toString(4));
        AWSUtil.upload(awsConfig, reportId + "/raw/" + awsAccountId + "/global/IAM_MFADevices.json",
                temporaryDirectory + reportId + "/" + awsAccountId + "/IAM_MFADevices.json");
        FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId, "IAM_AccessKeys.json",
                accessKeyJson.toString(4));
        AWSUtil.upload(awsConfig, reportId + "/raw/" + awsAccountId + "/global/IAM_AccessKeys.json",
                temporaryDirectory + reportId + "/" + awsAccountId + "/IAM_AccessKeys.json");
    }

    /**
     * グループ情報を取得し、S3にアップロードします。
     *
     * @param reportId
     * @param awsAccountId
     * @param credentials
     */
    private void describeGroup(String reportId, String awsAccountId, Credentials credentials) {
        AWSCredentials session = new BasicSessionCredentials(credentials.getAccessKeyId(),
                credentials.getSecretAccessKey(), credentials.getSessionToken());
        AmazonIdentityManagement iam = AmazonIdentityManagementClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(session)).build();
        ListGroupsResult groupResult = iam.listGroups();
        String temporaryDirectory = jobConfig.getTemporaryDirectory();
        JSONObject groupsJSON = new JSONObject(groupResult);
        FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId, "IAM_Groups.json", groupsJSON.toString(4));
        AWSUtil.upload(awsConfig, reportId + "/raw/" + awsAccountId + "/global/IAM_Groups.json",
                temporaryDirectory + reportId + "/" + awsAccountId + "/IAM_Groups.json");
        JSONArray groupsInfoJson = new JSONArray();
        for (Group group : groupResult.getGroups()) {
            String groupName = group.getGroupName();
            GetGroupRequest groupRequest = new GetGroupRequest();
            groupRequest.withGroupName(groupName);
            GetGroupResult getGroupResult = iam.getGroup(groupRequest);
            JSONObject groupsInfo = new JSONObject(getGroupResult);
            groupsInfoJson.put(groupsInfo);
            ListAttachedGroupPoliciesRequest attachedGroupPoliciesRequest = new ListAttachedGroupPoliciesRequest();
            attachedGroupPoliciesRequest.withGroupName(groupName);
            ListAttachedGroupPoliciesResult attachedGroupPoliciesResult = iam
                    .listAttachedGroupPolicies(attachedGroupPoliciesRequest);
            JSONObject attachedGroupPoliciesJSON = new JSONObject(attachedGroupPoliciesResult);
            FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId,
                    "IAM_AttachedGroupPolicies_" + groupName + ".json", attachedGroupPoliciesJSON.toString(4));
            AWSUtil.upload(awsConfig,
                    reportId + "/raw/" + awsAccountId + "/global/IAM_AttachedGroupPolicies_" + groupName + ".json",
                    temporaryDirectory + reportId + "/" + awsAccountId + "/IAM_AttachedGroupPolicies_" + groupName
                            + ".json");
            JSONArray groupPoliceisJSON = new JSONArray();
            for (AttachedPolicy attachedPolicy : attachedGroupPoliciesResult.getAttachedPolicies()) {
                String policyName = attachedPolicy.getPolicyName();
                ListGroupPoliciesRequest groupPoliciesRequest = new ListGroupPoliciesRequest().withGroupName(policyName)
                        .withGroupName(groupName);
                ListGroupPoliciesResult groupPoliciesResult = iam.listGroupPolicies(groupPoliciesRequest);
                JSONObject groupPolicyJSON = new JSONObject(groupPoliciesResult);
                groupPoliceisJSON.put(groupPolicyJSON);
            }
            FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId,
                    "IAM_GroupPolicies_" + groupName + ".json", groupPoliceisJSON.toString(4));
            AWSUtil.upload(awsConfig,
                    reportId + "/raw/" + awsAccountId + "/global/IAM_GroupPolicies_" + groupName + ".json",
                    temporaryDirectory + reportId + "/" + awsAccountId + "/IAM_GroupPolicies_" + groupName + ".json");
        }
        FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId, "IAM_Groups_Info.json",
                groupsInfoJson.toString(4));
        AWSUtil.upload(awsConfig, reportId + "/raw/" + awsAccountId + "/global/IAM_Groups_Info.json",
                temporaryDirectory + reportId + "/" + awsAccountId + "/IAM_Groups_Info.json");
    }

    /**
     * ロール情報を取得し、S3にアップロードします。
     *
     * @param reportId
     * @param awsAccountId
     * @param credentials
     */
    private void describeRole(String reportId, String awsAccountId, Credentials credentials) {
        AWSCredentials session = new BasicSessionCredentials(credentials.getAccessKeyId(),
                credentials.getSecretAccessKey(), credentials.getSessionToken());
        AmazonIdentityManagement iam = AmazonIdentityManagementClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(session)).build();
        String temporaryDirectory = jobConfig.getTemporaryDirectory();
        // IAM_Rolesの取得
        ListRolesResult listRoleResult = iam.listRoles();
        JSONArray listRoleJSON = new JSONArray(listRoleResult.getRoles());
        FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId, "IAM_Roles.json", listRoleJSON.toString(4));
        AWSUtil.upload(awsConfig, reportId + "/raw/" + awsAccountId + "/global/IAM_Roles.json",
                temporaryDirectory + reportId + "/" + awsAccountId + "/IAM_Roles.json");
        for (Role role : listRoleResult.getRoles()) {
            // IAM_AttachedRolePoliciesの取得
            JSONArray IAMAttachedRolePoliciesJson = new JSONArray();
            ListAttachedRolePoliciesRequest listAttachedRolePoliciesRequest = new ListAttachedRolePoliciesRequest();
            listAttachedRolePoliciesRequest.setRoleName(role.getRoleName());
            ListAttachedRolePoliciesResult listAttachedRolePoliciesResult = iam
                    .listAttachedRolePolicies(listAttachedRolePoliciesRequest);
            for (AttachedPolicy attachedPolicy : listAttachedRolePoliciesResult.getAttachedPolicies()) {
                JSONObject attachedPolicyJson = new JSONObject(attachedPolicy);
                IAMAttachedRolePoliciesJson.put(attachedPolicyJson);
            }
            FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId,
                    "IAM_AttachedRolePolicies_" + role.getRoleName() + ".json",
                    IAMAttachedRolePoliciesJson.toString(4));
            AWSUtil.upload(awsConfig,
                    reportId + "/raw/" + awsAccountId + "/global/IAM_AttachedRolePolicies_" + role.getRoleName()
                            + ".json",
                    temporaryDirectory + reportId + "/" + awsAccountId + "/IAM_AttachedRolePolicies_"
                            + role.getRoleName() + ".json");
            // IAM_RolePoliciesの取得
            JSONArray IAMRolePoliciesJson = new JSONArray();
            ListRolePoliciesRequest listRolePoliciesRequest = new ListRolePoliciesRequest();
            listRolePoliciesRequest.setRoleName(role.getRoleName());
            ListRolePoliciesResult listRolePoliciesResult = iam.listRolePolicies(listRolePoliciesRequest);
            IAMAttachedRolePoliciesJson.put(listRolePoliciesResult.getPolicyNames());
            FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId,
                    "IAM_RolePolicies_" + role.getRoleName() + ".json", IAMRolePoliciesJson.toString(4));
            AWSUtil.upload(awsConfig,
                    reportId + "/raw/" + awsAccountId + "/global/IAM_RolePolicies_" + role.getRoleName() + ".json",
                    temporaryDirectory + reportId + "/" + awsAccountId + "/IAM_RolePolicies_" + role.getRoleName()
                            + ".json");
        }
    }

    /**
     * セキュリティグループを取得し、S3にアップロードします。
     *
     * @param reportId
     * @param awsAccountId
     * @param credentials
     * @param regions
     */
    private void describeSecurityGroups(String reportId, String awsAccountId, Credentials credentials,
            Regions regions) {
        AWSCredentials session = new BasicSessionCredentials(credentials.getAccessKeyId(),
                credentials.getSecretAccessKey(), credentials.getSessionToken());
        AmazonEC2 ec2 = AmazonEC2ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(session))
                .withRegion(regions).build();
        String temporaryDirectory = jobConfig.getTemporaryDirectory();
        DescribeSecurityGroupsResult result = ec2.describeSecurityGroups();
        JSONObject securityGroupJson = new JSONObject(result);
        FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId + regions.getName(),
                "VPC_SecurityGroups.json", securityGroupJson.toString(4));
        AWSUtil.upload(awsConfig,
                reportId + "/raw/" + awsAccountId + "/" + regions.getName() + "/VPC_SecurityGroups.json",
                temporaryDirectory + reportId + "/" + awsAccountId + regions.getName() + "/VPC_SecurityGroups.json");
    }

    /**
     * S3情報を取得し、S3にアップロードします。
     *
     * @param reportId
     * @param awsAccountId
     * @param credentials
     */
    private void describeS3Bucket(String reportId, String awsAccountId, Credentials credentials) {
        LOGGER.info("---- S3情報取得開始");
        AWSCredentials session = new BasicSessionCredentials(credentials.getAccessKeyId(),
                credentials.getSecretAccessKey(), credentials.getSessionToken());
        AmazonS3 s3 = AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(session))
                .withRegion(Regions.AP_NORTHEAST_1).build();
        String temporaryDirectory = jobConfig.getTemporaryDirectory();
        // バケットを取得
        List<Bucket> bucketList = s3.listBuckets();
        JSONArray s3BucketsJSON = new JSONArray();
        for (Bucket bucket : bucketList) {

            try {
                String bucketName = bucket.getName();
                LOGGER.info("------ バケット名=" + bucketName);
                JSONObject bucketJSON = new JSONObject();
                bucketJSON.put("Name", bucketName);
                bucketJSON.put("CreationDate", bucket.getCreationDate());
                bucketJSON.put("Owner", bucket.getOwner());
                // バケットロケーションを取得
                LOGGER.info("-------- バケットロケーション取得");
                GetBucketLocationRequest bucketLocationRequest = new GetBucketLocationRequest(bucketName);
                String bucketLocation = s3.getBucketLocation(bucketLocationRequest);
                if ("US".equals(bucketLocation)) {
                    bucketLocation = Regions.US_EAST_1.getName();
                }
                if ("EU".equals(bucketLocation)) {
                    bucketLocation = Regions.EU_WEST_1.getName();
                }
                bucketJSON.put("bucketSizeBytes", getBucketSizeBytes(session, bucket.getName(), bucketLocation));
                JSONObject locationJSON = new JSONObject().put("LocationConstraint", bucketLocation);
                FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId,
                        "S3_BucketLocation_" + bucketName + ".json", locationJSON.toString(4));
                AWSUtil.upload(awsConfig,
                        reportId + "/raw/" + awsAccountId + "/global/S3_BucketLocation_" + bucketName + ".json",
                        temporaryDirectory + reportId + "/" + awsAccountId + "/S3_BucketLocation_" + bucketName
                                + ".json");
                // バケットACLを取得
                LOGGER.info("-------- バケットACL取得：ロケーション=" + bucketLocation);
                AmazonS3 aclS3 = AmazonS3ClientBuilder.standard()
                        .withCredentials(new AWSStaticCredentialsProvider(session)).withRegion(bucketLocation).build();
                GetBucketAclRequest bucketAclRequest = new GetBucketAclRequest(bucketName);
                AccessControlList aclList = aclS3.getBucketAcl(bucketAclRequest);
                JSONObject aclJSON = new JSONObject();
                JSONObject ownerJSON = new JSONObject().put("DisplayName", aclList.getOwner().getDisplayName())
                        .put("ID", aclList.getOwner().getId());
                aclJSON.put("Owner", ownerJSON);
                JSONArray grantsJSON = new JSONArray();
                for (Grant grant : aclList.getGrantsAsList()) {
                    JSONObject grantJSON = new JSONObject();
                    grantJSON.put("Grantee",
                            new JSONObject().put("Type", grant.getGrantee().getTypeIdentifier())
                                    .put("ID", aclList.getOwner().getId())
                                    .put("DisplayName", aclList.getOwner().getDisplayName()));
                    grantJSON.put("Permissions", grant.getPermission());
                    grantsJSON.put(grantJSON);
                }
                aclJSON.put("Grants", grantsJSON);
                FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId,
                        "S3_BucketAcl_" + bucketName + ".json", aclJSON.toString(4));
                AWSUtil.upload(awsConfig,
                        reportId + "/raw/" + awsAccountId + "/global/S3_BucketAcl_" + bucketName + ".json",
                        temporaryDirectory + reportId + "/" + awsAccountId + "/S3_BucketAcl_" + bucketName + ".json");
                // バケットポリシーを取得
                LOGGER.info("-------- バケットポリシー取得");
                GetBucketPolicyRequest bucketPolicyRequest = new GetBucketPolicyRequest(bucketName);
                BucketPolicy bucketPolicy = aclS3.getBucketPolicy(bucketPolicyRequest);
                JSONObject bucketPolicyJSON = new JSONObject();
                if (!CommonUtil.isEmpty(bucketPolicy.getPolicyText())) {
                    bucketPolicyJSON = new JSONObject(bucketPolicy.getPolicyText());
                }
                FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId,
                        "S3_BucketPolicy_" + bucketName + ".json", bucketPolicyJSON.toString(4));
                AWSUtil.upload(awsConfig,
                        reportId + "/raw/" + awsAccountId + "/global/S3_BucketPolicy_" + bucketName + ".json",
                        temporaryDirectory + reportId + "/" + awsAccountId + "/S3_BucketPolicy_" + bucketName
                                + ".json");
                s3BucketsJSON.put(bucketJSON);
            } catch (AmazonS3Exception e) {
                if (HttpStatus.SC_FORBIDDEN == e.getStatusCode()) {
                    continue;
                }
                throw e;
            }
        }
        FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId, "S3_Buckets.json",
                s3BucketsJSON.toString(4));
        AWSUtil.upload(awsConfig, reportId + "/raw/" + awsAccountId + "/global/S3_Buckets.json",
                temporaryDirectory + reportId + "/" + awsAccountId + "/S3_Buckets.json");
    }

    private double getBucketSizeBytes(AWSCredentials session, String bucketName, String bucketLocation) {
        AmazonCloudWatch cloudWatch = AmazonCloudWatchClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(session)).withRegion(bucketLocation).build();
        Date currentDateUTC = DateUtil.convertDate(DateUtil.getCurrentDateUTC(), DateUtil.PATTERN_YYYYMMDDTHHMMSSSSS);
        Date endTime = new Date(currentDateUTC.getTime() - TimeUnit.HOURS.toMillis(1));
        Date startTime = new Date(endTime.getTime() - TimeUnit.DAYS.toMillis(1));
        List<Dimension> lsDimension = new ArrayList<Dimension>();
        lsDimension.add(new Dimension().withName("BucketName").withValue(bucketName));
        lsDimension.add(new Dimension().withName("StorageType").withValue("StandardStorage"));
        GetMetricStatisticsRequest metricStatisticsRequest = new GetMetricStatisticsRequest().withNamespace("AWS/S3")
                .withMetricName("BucketSizeBytes").withDimensions(lsDimension).withStatistics("Sum")
                .withStartTime(startTime).withEndTime(endTime).withPeriod(86400);
        GetMetricStatisticsResult getMetricStatisticsResult = cloudWatch.getMetricStatistics(metricStatisticsRequest);
        double bucketSizeBytes = 0;
        for (Datapoint datapoint : getMetricStatisticsResult.getDatapoints()) {
            bucketSizeBytes += datapoint.getSum();
        }
        return bucketSizeBytes;
    }

    /**
     * CloudTrail情報を取得し、S3にアップロードします。
     *
     * @param reportId
     * @param awsAccountId
     * @param credentials
     * @param regions
     */
    private void describeCloudTrail(String reportId, String awsAccountId, Credentials credentials, Regions regions) {
        AWSCredentials session = new BasicSessionCredentials(credentials.getAccessKeyId(),
                credentials.getSecretAccessKey(), credentials.getSessionToken());
        String temporaryDirectory = jobConfig.getTemporaryDirectory();
        AWSCloudTrail cloudTrail = AWSCloudTrailClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(session)).withRegion(regions).build();
        // CloudTrail_Trailsの取得
        DescribeTrailsResult trailsResult = cloudTrail.describeTrails(new DescribeTrailsRequest().withIncludeShadowTrails(false));
        JSONObject trailJSON = new JSONObject(trailsResult);
        FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId + "/" + regions.getName(),
                "CloudTrail_Trails.json", trailJSON.toString(4));
        AWSUtil.upload(awsConfig,
                reportId + "/raw/" + awsAccountId + "/" + regions.getName() + "/CloudTrail_Trails.json",
                temporaryDirectory + reportId + "/" + awsAccountId + "/" + regions.getName()
                        + "/CloudTrail_Trails.json");
        for (Trail trail : trailsResult.getTrailList()) {
            String trailName = trail.getName();
            GetTrailStatusRequest trailStatusRequest = new GetTrailStatusRequest();
            trailStatusRequest.setName(trailName);
            GetTrailStatusResult trailStatusResult = cloudTrail.getTrailStatus(trailStatusRequest);
            JSONObject trailStatusJSON = new JSONObject(trailStatusResult);
            FileUtil.outputFile(temporaryDirectory + reportId + "/" + awsAccountId + "/" + regions.getName(),
                    "CloudTrail_Status_" + trailName + ".json", trailStatusJSON.toString(4));
            AWSUtil.upload(awsConfig,
                    reportId + "/raw/" + awsAccountId + "/" + regions.getName() + "/CloudTrail_Status_" + trailName
                            + ".json",
                    temporaryDirectory + reportId + "/" + awsAccountId + "/" + regions.getName() + "/CloudTrail_Status_"
                            + trailName + ".json");
        }
    }

    /**
     * IAM.jsonを作成します。
     *
     * @param reportId
     * @param accountId
     */
    private void createIAMReport(String reportId, String accountId) {
        JSONObject reportJSON = new JSONObject();
        String temporaryDirectory = jobConfig.getTemporaryDirectory();
        reportJSON.put("schema_version", reportConfig.getSchemaVersionLatest());
        JSONObject iamJSON = new JSONObject();
        JSONArray users = new JSONArray(
                AWSUtil.readS3Object(awsConfig, reportId + "/raw/" + accountId + "/global/IAM_Users.json"));
        JSONArray accessKeys = new JSONArray(
                AWSUtil.readS3Object(awsConfig, reportId + "/raw/" + accountId + "/global/IAM_AccessKeys.json"));
        JSONArray mfas = new JSONArray(
                AWSUtil.readS3Object(awsConfig, reportId + "/raw/" + accountId + "/global/IAM_MFADevices.json"));
        JSONArray roles = new JSONArray(
                AWSUtil.readS3Object(awsConfig, reportId + "/raw/" + accountId + "/global/IAM_Roles.json"));
        JSONArray groups = new JSONArray(
                AWSUtil.readS3Object(awsConfig, reportId + "/raw/" + accountId + "/global/IAM_Groups_Info.json"));
        JSONArray userArray = new JSONArray();
        for (Object userObject : users) {
            JSONObject userJSON = (JSONObject) userObject;
            JSONObject iamuser = new JSONObject();
            iamuser.put("Arn", userJSON.get("arn"));
            String createDate = (String) userJSON.get("createDate");
            iamuser.put("CreateDate", new JSONObject().put("$date",
                    DateUtil.dateToUnixTime(createDate, "EEE MMM dd HH:mm:ss zzz yyyy", Locale.ENGLISH)));
            String passwordLastUsed;
            try {
                passwordLastUsed = (String) userJSON.get("passwordLastUsed");
            } catch (JSONException e) {
                passwordLastUsed = "";
            }
            iamuser.put("PasswordLastUsed", new JSONObject().put("$date",
                    DateUtil.dateToUnixTime(passwordLastUsed, "EEE MMM dd HH:mm:ss zzz yyyy", Locale.ENGLISH)));
            iamuser.put("Path", userJSON.get("path"));
            iamuser.put("UserId", userJSON.get("userId"));
            iamuser.put("UserName", userJSON.get("userName"));
            JSONArray accessKeyArray = new JSONArray();
            for (Object accessKeyObject : accessKeys) {
                JSONObject accessKeyJSON = (JSONObject) accessKeyObject;
                String accessKeyUser = (String) accessKeyJSON.get("UserName");
                if (accessKeyUser.equals(userJSON.get("userName"))) {
                    JSONObject accessKey = new JSONObject();
                    accessKey.put("UserName", accessKeyJSON.get("UserName"));
                    accessKey.put("AccessKeyId", accessKeyJSON.get("AccessKeyId"));
                    String accessKeyCreateDate = (String) accessKeyJSON.get("CreateDate");
                    accessKey.put("CreateDate", new JSONObject().put("$date",
                            DateUtil.dateToUnixTime(accessKeyCreateDate, "EEE MMM dd HH:mm:ss zzz yyyy", Locale.ENGLISH)));
                    accessKey.put("Status", accessKeyJSON.get("Status"));
                    accessKeyArray.put(accessKey);
                }
            }
            iamuser.put("access_key", accessKeyArray);
            JSONArray mfaArray = new JSONArray();
            for (Object mfaObject : mfas) {
                JSONObject mfaJSON = (JSONObject) mfaObject;
                String mfaUser = (String) mfaJSON.get("userName");
                if (mfaUser.equals(userJSON.get("userName"))) {
                    JSONObject mfa = new JSONObject();
                    mfa.put("UserName", mfaJSON.get("userName"));
                    mfa.put("SerialNumber", mfaJSON.get("serialNumber"));
                    String enableDate = (String) mfaJSON.get("enableDate");
                    mfa.put("EnableDate", new JSONObject().put("$date",
                            DateUtil.dateToUnixTime(enableDate, "EEE MMM dd HH:mm:ss zzz yyyy", Locale.ENGLISH)));
                    mfaArray.put(mfa);
                }
            }
            iamuser.put("mfa", mfaArray);
            userArray.put(iamuser);
        }
        iamJSON.put("iam_user", userArray);
        JSONArray accessKeyArray = new JSONArray();
        for (Object accessKeyObject : accessKeys) {
            JSONObject accessKeyJSON = (JSONObject) accessKeyObject;
            String accessKeyId = (String) accessKeyJSON.get("AccessKeyId");
            JSONObject accessKey = new JSONObject();
            accessKey.put("UserName", accessKeyJSON.get("UserName"));
            accessKey.put("AccessKeyId", accessKeyId);
            String createDate = accessKeyJSON.getString("CreateDate");
            accessKey.put("CreateDate", new JSONObject().put("$date",
                    DateUtil.dateToUnixTime(createDate, "EEE MMM dd HH:mm:ss zzz yyyy", Locale.ENGLISH)));
            JSONObject accessKeyLastUsedJSON = new JSONObject(AWSUtil.readS3Object(awsConfig,
                    reportId + "/raw/" + accountId + "/global/IAM_AccessKeyLastUse_" + accessKeyId + ".json"));
            JSONObject accessKeyLastUsed = (JSONObject) accessKeyLastUsedJSON.get("accessKeyLastUsed");
            String lastUsedDate;
            try {
                lastUsedDate = (String) accessKeyLastUsed.get("lastUsedDate");
            } catch (JSONException e) {
                lastUsedDate = "";
            }
            accessKey.put("last_used_date", new JSONObject().put("$date",
                    DateUtil.dateToUnixTime(lastUsedDate, "EEE MMM dd HH:mm:ss zzz yyyy", Locale.ENGLISH)));
            accessKey.put("Status", accessKeyJSON.get("Status"));
            accessKeyArray.put(accessKey);
        }
        iamJSON.put("access_key", accessKeyArray);

        JSONArray roleArray = new JSONArray();
        for (Object roleObject : roles) {
            JSONObject roleJSON = (JSONObject) roleObject;
            JSONObject role = new JSONObject();
            String roleName = (String) roleJSON.get("roleName");
            role.put("Arn", roleJSON.get("arn"));
            // assumeRolePolicyDocumentの文字置き換え
            String assumeRolePolicyDocument = (String) roleJSON.get("assumeRolePolicyDocument");
            assumeRolePolicyDocument = assumeRolePolicyDocument.replaceAll("%5B", "[");
            assumeRolePolicyDocument = assumeRolePolicyDocument.replaceAll("%5D", "]");
            assumeRolePolicyDocument = assumeRolePolicyDocument.replaceAll("%7B", "{");
            assumeRolePolicyDocument = assumeRolePolicyDocument.replaceAll("%7D", "}");
            assumeRolePolicyDocument = assumeRolePolicyDocument.replaceAll("%22", "\"");
            assumeRolePolicyDocument = assumeRolePolicyDocument.replaceAll("%3A", ":");
            assumeRolePolicyDocument = assumeRolePolicyDocument.replaceAll("%2C", ",");
            role.put("AssumeRolePolicyDocument", new JSONObject(assumeRolePolicyDocument));
            String createDate = (String) roleJSON.get("createDate");
            role.put("CreateDate", new JSONObject().put("$date",
                    DateUtil.dateToUnixTime(createDate, "EEE MMM dd HH:mm:ss zzz yyyy", Locale.ENGLISH)));
            String description;
            try {
                description = (String) roleJSON.get("description");
            } catch (JSONException e) {
                description = "";
            }
            role.put("Description", description);
            role.put("Path", roleJSON.get("path"));
            role.put("RoleId", roleJSON.get("roleId"));
            role.put("RoleName", roleName);
            JSONArray managedPolicies = new JSONArray(AWSUtil.readS3Object(awsConfig,
                    reportId + "/raw/" + accountId + "/global/IAM_AttachedRolePolicies_" + roleName + ".json"));
            role.put("managed_policies", managedPolicies);
            JSONArray inlinePolicies = new JSONArray(AWSUtil.readS3Object(awsConfig,
                    reportId + "/raw/" + accountId + "/global/IAM_RolePolicies_" + roleName + ".json"));
            role.put("inline_policies", inlinePolicies);
            roleArray.put(role);
        }
        iamJSON.put("role", roleArray);

        JSONArray groupArray = new JSONArray();
        for (Object groupObject : groups) {
            JSONObject groupJSON = ((JSONObject) groupObject).getJSONObject("group");
            JSONArray groupUSerJSON = ((JSONObject) groupObject).getJSONArray("users");
            JSONObject group = new JSONObject();
            String groupName = (String) groupJSON.get("groupName");
            group.put("Arn", groupJSON.get("arn"));
            String createDate = (String) groupJSON.get("createDate");
            group.put("CreateDate", new JSONObject().put("$date",
                    DateUtil.dateToUnixTime(createDate, "EEE MMM dd HH:mm:ss zzz yyyy", Locale.ENGLISH)));
            group.put("GroupId", groupJSON.get("groupId"));
            group.put("GroupName", groupName);
            group.put("Path", groupJSON.get("path"));
            JSONArray userNames = new JSONArray();
            for (Object userObject : groupUSerJSON) {
                JSONObject userJSON = (JSONObject) userObject;
                userNames.put(userJSON.get("userName"));
            }
            group.put("user", userNames);
            // managed_policies＆inline_policiesを作成する
            ArrayList<Object> attachedPolicyList = new ArrayList<>();
            JSONArray attachedPolicyArray = new JSONObject(AWSUtil.readS3Object(awsConfig,
                    reportId + "/raw/" + accountId + "/global/IAM_AttachedGroupPolicies_" + groupName + ".json"))
                            .getJSONArray("attachedPolicies");
            attachedPolicyArray
                    .forEach(attachedPolicy -> attachedPolicyList.add(((JSONObject) attachedPolicy).get("policyName")));
            group.put("managed_policies", attachedPolicyList);
            ArrayList<Object> groupPolicyList = new ArrayList<>();
            JSONArray groupPolicyArray = new JSONArray(AWSUtil.readS3Object(awsConfig,
                    reportId + "/raw/" + accountId + "/global/IAM_GroupPolicies_" + groupName + ".json"));
            for (Object groupPolicy : groupPolicyArray) {
                JSONObject groupPolicyJSON = (JSONObject) groupPolicy;
                JSONArray groupPolicyNames = (JSONArray) groupPolicyJSON.get("policyNames");
                groupPolicyNames.forEach(groupPolicyName -> groupPolicyList.add(groupPolicyName));
            }
            group.put("inline_policies", groupPolicyList.stream().distinct().collect(Collectors.toList()));
            groupArray.put(group);
        }
        iamJSON.put("group", groupArray);
        reportJSON.put("IAM", iamJSON);
        FileUtil.outputFile(temporaryDirectory + reportId + "/" + accountId, "/IAM.json", reportJSON.toString(4));
        AWSUtil.upload(awsConfig, reportId + "/resource/" + accountId + "/global/IAM.json",
                temporaryDirectory + reportId + "/" + accountId + "/IAM.json");
    }

    /**
     * VPC.jsonを作成します。
     *
     * @param reportId
     * @param accountId
     */
    private void createVPCReport(String reportId, String accountId) {
        JSONObject reportJSON = new JSONObject();
        String temporaryDirectory = jobConfig.getTemporaryDirectory();
        reportJSON.put("schema_version", reportConfig.getSchemaVersionLatest());
        Regions[] regions = AWSUtil.getEnableRegions();
        for (Regions region : regions) {
            JSONObject vpcJSON = new JSONObject();
            String vpc = AWSUtil.readS3Object(awsConfig,
                    reportId + "/raw/" + accountId + "/" + region.getName() + "/VPC_SecurityGroups.json");
            JSONArray securityGroupArray = (JSONArray) new JSONObject(vpc).get("securityGroups");
            JSONArray securityGroups = new JSONArray();
            for (Object securityGroupObject : securityGroupArray) {
                JSONObject securityGroupJSON = (JSONObject) securityGroupObject;
                JSONArray tags = (JSONArray) securityGroupJSON.get("tags");
                // tagからNameを取得
                String name = "";
                for (Object tagObject : tags) {
                    JSONObject tag = (JSONObject) tagObject;
                    if (!tag.isNull("key")) {
                        if ("Name".equals((String) tag.get("key"))) {
                            name = (String) tag.get("value");
                            break;
                        }
                    }
                }
                securityGroupJSON.put("name", name);
                securityGroups.put(securityGroupJSON);
            }
            vpcJSON.put("security_group", securityGroups);
            reportJSON.put("VPC", vpcJSON);
            FileUtil.outputFile(temporaryDirectory + reportId + "/" + accountId + "/" + region.getName(), "VPC.json",
                    reportJSON.toString(4));
            AWSUtil.upload(awsConfig, reportId + "/resource/" + accountId + "/" + region.getName() + "/VPC.json",
                    temporaryDirectory + reportId + "/" + accountId + "/" + region.getName() + "/VPC.json");
        }
    }

    /**
     * S3.jsonを作成します。
     *
     * @param reportId
     * @param accountId
     */
    private void createS3Report(String reportId, String accountId) {
        String temporaryDirectory = jobConfig.getTemporaryDirectory();
        JSONObject reportJSON = new JSONObject();
        reportJSON.put("schema_version", reportConfig.getSchemaVersionLatest());
        JSONArray bucketJSONArray = new JSONArray(
                AWSUtil.readS3Object(awsConfig, reportId + "/raw/" + accountId + "/global/S3_Buckets.json"));
        Map<Regions, JSONArray> bucketsJSONMap = new HashMap<>();
        Regions[] regions = AWSUtil.getEnableRegions();
        for (Regions region : regions) {
            JSONArray regionJSON = new JSONArray();
            bucketsJSONMap.put(region, regionJSON);
        }
        JSONArray bucketsJSON;
        for (Object bucket : bucketJSONArray) {
            JSONObject bucketJSON = (JSONObject) bucket;
            JSONObject reportBucketJSON = new JSONObject();
            String bucketName = (String) bucketJSON.get("Name");
            reportBucketJSON.put("Name", bucketName);
            reportBucketJSON.put("bucketSizeBytes", bucketJSON.getDouble("bucketSizeBytes"));
            String creationDate = (String) bucketJSON.get("CreationDate");
            reportBucketJSON.put("CreationDate", new JSONObject().put("$date",
                    DateUtil.dateToUnixTime(creationDate, "EEE MMM dd HH:mm:ss zzz yyyy", Locale.ENGLISH)));
            JSONObject aclJSON = new JSONObject(AWSUtil.readS3Object(awsConfig,
                    reportId + "/raw/" + accountId + "/global/S3_BucketAcl_" + bucketName + ".json"));
            reportBucketJSON.put("bucket_acl", aclJSON);
            JSONObject locationJSON = new JSONObject(AWSUtil.readS3Object(awsConfig,
                    reportId + "/raw/" + accountId + "/global/S3_BucketLocation_" + bucketName + ".json"));
            reportBucketJSON.put("bucket_location", locationJSON.get("LocationConstraint"));
            reportBucketJSON.put("bucket_policy", AWSUtil.readS3Object(awsConfig,
                    reportId + "/raw/" + accountId + "/global/S3_BucketPolicy_" + bucketName + ".json"));
            String region = (String) locationJSON.get("LocationConstraint");
            bucketsJSON = bucketsJSONMap.get(Regions.fromName(region));
            bucketsJSON.put(reportBucketJSON);
            bucketsJSONMap.put(Regions.fromName(region), bucketsJSON);
        }
        for (Map.Entry<Regions, JSONArray> e : bucketsJSONMap.entrySet()) {
            bucketsJSON = e.getValue();
            JSONObject s3JSON = new JSONObject();
            s3JSON.put("bucket", bucketsJSON);
            reportJSON.put("S3", s3JSON);
            FileUtil.outputFile(temporaryDirectory + reportId + "/" + accountId + "/" + e.getKey().getName(), "S3.json",
                    reportJSON.toString(4));
            AWSUtil.upload(awsConfig, reportId + "/resource/" + accountId + "/" + e.getKey().getName() + "/S3.json",
                    temporaryDirectory + reportId + "/" + accountId + "/" + e.getKey().getName() + "/S3.json");
        }
    }

    /**
     * CloudTrail.jsonを作成します。
     *
     * @param reportId
     * @param accountId
     */
    private void createCloudTrailReport(String reportId, String accountId) {
        String temporaryDirectory = jobConfig.getTemporaryDirectory();
        JSONObject reportJSON = new JSONObject();
        reportJSON.put("schema_version", reportConfig.getSchemaVersionLatest());
        JSONObject cloudTrailJSON = new JSONObject();
        JSONArray trailJSONArray = new JSONArray();
        Regions[] regions = AWSUtil.getEnableRegions();
        for (Regions region : regions) {
            JSONArray cloudTrails = new JSONObject(AWSUtil.readS3Object(awsConfig,
                    reportId + "/raw/" + accountId + "/" + region.getName() + "/CloudTrail_Trails.json"))
                            .getJSONArray("trailList");
            for (Object object : cloudTrails) {
                JSONObject objectJSON = (JSONObject) object;
                String trailName = objectJSON.getString("name");
                JSONObject trail = new JSONObject();
                trail.put("HasCustomEventSelectors", objectJSON.get("hasCustomEventSelectors"));
                trail.put("HomeRegion", objectJSON.get("homeRegion"));
                trail.put("IncludeGlobalServiceEvents", objectJSON.get("includeGlobalServiceEvents"));
                trail.put("IsMultiRegionTrail", objectJSON.get("isMultiRegionTrail"));
                trail.put("LogFileValidationEnabled", objectJSON.get("logFileValidationEnabled"));
                trail.put("Name", objectJSON.get("name"));
                trail.put("S3BucketName", objectJSON.get("s3BucketName"));
                trail.put("TrailARN", objectJSON.get("trailARN"));
                JSONObject trailStatus = new JSONObject(AWSUtil.readS3Object(awsConfig, reportId + "/raw/" + accountId
                        + "/" + region.getName() + "/CloudTrail_Status_" + trailName + ".json"));
                trail.put("trail_status", trailStatus);
                trailJSONArray.put(trail);
            }
        }
        cloudTrailJSON.put("trail", trailJSONArray);
        reportJSON.put("CloudTrail", cloudTrailJSON);
        FileUtil.outputFile(temporaryDirectory + reportId + "/" + accountId, "CloudTrail.json", reportJSON.toString(4));
        AWSUtil.upload(awsConfig, reportId + "/resource/" + accountId + "/global/CloudTrail.json",
                temporaryDirectory + reportId + "/" + accountId + "/CloudTrail.json");
    }

    /**
     * EC2情報を取得し、S3にアップロードします。
     *
     * @param reportId
     * @param awsAccountId
     * @param credentials
     * @param regions
     */
    private void describeEC2(String reportId, String awsAccountId, Credentials credentials, Regions regions) {
        AWSCredentials session = new BasicSessionCredentials(credentials.getAccessKeyId(),
                credentials.getSecretAccessKey(), credentials.getSessionToken());
        String temporaryDirectory = jobConfig.getTemporaryDirectory();
        AmazonEC2 ec2 = AmazonEC2ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(session))
                .withRegion(regions).build();

        String s3Path = String.format(AWSUtil.PATH_COLLECT_AWS_REGION, reportId, awsAccountId, regions.getName());
        // 0-14
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, ec2.describeInstances(), temporaryDirectory, s3Path,
                "EC2_Instances.json", true);
        // 0-15
        DescribeImagesRequest describeImagesRequest = new DescribeImagesRequest();
        describeImagesRequest.setOwners(Arrays.asList(awsAccountId));
        DescribeImagesResult describeImagesResult = ec2.describeImages(describeImagesRequest);
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, describeImagesResult, temporaryDirectory, s3Path,
                "EC2_Images.json", true);
        // 0-16
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, ec2.describeVolumes(), temporaryDirectory, s3Path,
                "EC2_Volumes.json", true);
        // 0-17
        DescribeSnapshotsRequest describeSnapshotsRequest = new DescribeSnapshotsRequest();
        describeSnapshotsRequest.setOwnerIds(Arrays.asList(awsAccountId));
        DescribeSnapshotsResult describeSnapshotsResult = ec2.describeSnapshots(describeSnapshotsRequest);
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, describeSnapshotsResult, temporaryDirectory, s3Path,
                "EC2_Snapshots.json", true);
        // 0-18
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, ec2.describeReservedInstances(), temporaryDirectory, s3Path,
                "EC2_RI.json", true);

        // 0-40
        List<ImageAttribute> lsDescribeImageAttributeRequest = new ArrayList<ImageAttribute>();
        for (Image image : describeImagesResult.getImages()) {
            DescribeImageAttributeRequest attributeRequest = new DescribeImageAttributeRequest(image.getImageId(),
                    ImageAttributeName.LaunchPermission);
            lsDescribeImageAttributeRequest.add(ec2.describeImageAttribute(attributeRequest).getImageAttribute());
        }
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, new EC2ImagesPermissions(lsDescribeImageAttributeRequest),
                temporaryDirectory, s3Path, "EC2_Images_launch_permission.json", true);

        // 0-41
        List<DescribeSnapshotAttributeResult> lsDescribeSnapshotAttributeResult = new ArrayList<DescribeSnapshotAttributeResult>();
        for (Snapshot snapshot : describeSnapshotsResult.getSnapshots()) {
            DescribeSnapshotAttributeRequest attributeRequest = new DescribeSnapshotAttributeRequest(
                    snapshot.getSnapshotId(), SnapshotAttributeName.CreateVolumePermission);
            DescribeSnapshotAttributeResult attributeResult = ec2.describeSnapshotAttribute(attributeRequest);
            attributeResult.setSdkHttpMetadata(null);
            attributeResult.setSdkResponseMetadata(null);
            lsDescribeSnapshotAttributeResult.add(attributeResult);
        }
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, new EC2SnapshotsPermissions(lsDescribeSnapshotAttributeResult),
                temporaryDirectory, s3Path, "EC2_Snapshots_create_volume_permissions.json", true);
    }

    /**
     * RDS情報を取得し、S3にアップロードします。
     *
     * @param reportId
     * @param awsAccountId
     * @param credentials
     * @param regions
     */
    private void describeRDS(String reportId, String awsAccountId, Credentials credentials, Regions regions) {
        AWSCredentials session = new BasicSessionCredentials(credentials.getAccessKeyId(),
                credentials.getSecretAccessKey(), credentials.getSessionToken());
        String temporaryDirectory = jobConfig.getTemporaryDirectory();
        AmazonRDS rds = AmazonRDSClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(session))
                .withRegion(regions).build();
        String s3Path = String.format(AWSUtil.PATH_COLLECT_AWS_REGION, reportId, awsAccountId, regions.getName());
        // 0-19
        DescribeDBInstancesResult dbInstancesResult = rds.describeDBInstances();
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, dbInstancesResult, temporaryDirectory, s3Path,
                "RDS_Instances.json", true);
        List<RDSListTagsForResource> lsListTagsForResources = new ArrayList<RDSListTagsForResource>();
        for (DBInstance dbInstance : dbInstancesResult.getDBInstances()) {
            ListTagsForResourceResult tagsForResourceResult = rds.listTagsForResource(
                    new ListTagsForResourceRequest().withResourceName(dbInstance.getDBInstanceArn()));
            lsListTagsForResources
                    .add(new RDSListTagsForResource(tagsForResourceResult.getTagList(), dbInstance.getDBInstanceArn()));
        }
        RootNameRaw rootNameRaw = new RootNameRaw();
        rootNameRaw.setLsRDSListTagsForResource(lsListTagsForResources);
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, rootNameRaw, temporaryDirectory, s3Path,
                "RDS_ListTagsForResource.json", true);

        // 0-20
        DescribeDBSnapshotsRequest snapshotsRequest = new DescribeDBSnapshotsRequest().withSnapshotType("manual");
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, rds.describeDBSnapshots(snapshotsRequest), temporaryDirectory,
                s3Path, "RDS_Snapshots.json", true);
        // 0-21
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, rds.describeReservedDBInstances(), temporaryDirectory, s3Path,
                "RDS_RI.json", true);
    }

    /**
     * Redshift情報を取得し、S3にアップロードします。
     *
     * @param reportId
     * @param awsAccountId
     * @param credentials
     * @param regions
     */
    private void describeRedshift(String reportId, String awsAccountId, Credentials credentials, Regions regions) {
        AWSCredentials session = new BasicSessionCredentials(credentials.getAccessKeyId(),
                credentials.getSecretAccessKey(), credentials.getSessionToken());
        String temporaryDirectory = jobConfig.getTemporaryDirectory();
        String s3Path = String.format(AWSUtil.PATH_COLLECT_AWS_REGION, reportId, awsAccountId, regions.getName());
        AmazonRedshift redshift = AmazonRedshiftClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(session)).withRegion(regions).build();
        // 0-22
        DescribeClustersResult describeClustersResult = redshift.describeClusters();
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, describeClustersResult, temporaryDirectory, s3Path,
                "Redshift_Clusters.json", true);
        DescribeLoggingStatusRequest loggingStatusRequest;
        List<RedshiftLoggingStatus> lsRedshiftLoggingStatus = new ArrayList<RedshiftLoggingStatus>();
        for (Cluster cluster : describeClustersResult.getClusters()) {
            loggingStatusRequest = new DescribeLoggingStatusRequest()
                    .withClusterIdentifier(cluster.getClusterIdentifier());
            DescribeLoggingStatusResult describeLoggingStatusResult = redshift
                    .describeLoggingStatus(loggingStatusRequest);
            lsRedshiftLoggingStatus.add(new RedshiftLoggingStatus(describeLoggingStatusResult.getLoggingEnabled(),
                    cluster.getClusterIdentifier()));
        }
        RootNameRaw rootNameRaw = new RootNameRaw();
        rootNameRaw.setLsRedshiftLoggingStatus(lsRedshiftLoggingStatus);
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, rootNameRaw, temporaryDirectory, s3Path,
                "Redshift_LoggingStatus.json", true);

        // 0-23
        DescribeClusterSnapshotsRequest snapshotsRequest = new DescribeClusterSnapshotsRequest()
                .withSnapshotType("manual");
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, redshift.describeClusterSnapshots(snapshotsRequest),
                temporaryDirectory, s3Path, "Redshift_Snapshots.json", true);
        // 0-24
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, redshift.describeReservedNodes(), temporaryDirectory, s3Path,
                "Redshift_RI.json", true);
    }

    /**
     * create EC2 report、S3にアップロードします。
     *
     * @param reportId
     * @param awsAccountId
     * @param credentials
     * @param regions
     */
    private void createEC2Report(String reportId, String awsAccountId, Regions region) {
        EC2 ec2 = new EC2();
        String pathRaw = String.format(AWSUtil.PATH_COLLECT_AWS_REGION, reportId, awsAccountId, region.getName());
        // EC2 Instances
        String ec2Instances = AWSUtil.readS3Object(awsConfig, pathRaw + "EC2_Instances.json");
        DescribeInstancesResult instancesResult = CommonUtil.mapperJson(ec2Instances, DescribeInstancesResult.class);
        List<Instance> lsInstancesRunning = new ArrayList<Instance>();
        List<Instance> lsInstancesStop = new ArrayList<Instance>();
        for (Reservation reservation : instancesResult.getReservations()) {
            for (Instance instance : reservation.getInstances()) {
                String stateTransitionReason = instance.getStateTransitionReason();
                if (!CommonUtil.isEmpty(stateTransitionReason)) {
                    String stateTransitionReasonTime = stateTransitionReason
                            .substring(stateTransitionReason.indexOf("(") + 1, stateTransitionReason.indexOf(")"));
                    instance.setStateTransitionReason(stateTransitionReasonTime);
                }
                if (InstanceStateName.Pending.toString().equals(instance.getState().getName())
                        || InstanceStateName.Running.toString().equals(instance.getState().getName())) {
                    lsInstancesRunning.add(instance);
                } else {
                    lsInstancesStop.add(instance);
                }
            }
        }
        ec2.setRunning(lsInstancesRunning);
        ec2.setStop(lsInstancesStop);

        // EC2 Images
        String ec2Images = AWSUtil.readS3Object(awsConfig, pathRaw + "EC2_Images.json");
        DescribeImagesResult imagesResult = CommonUtil.mapperJson(ec2Images, DescribeImagesResult.class);
        String jsonImagesPermission = AWSUtil.readS3Object(awsConfig, pathRaw + "EC2_Images_launch_permission.json");
        EC2ImagesPermissions ec2ImagesPermissions = CommonUtil.mapperJson(jsonImagesPermission, EC2ImagesPermissions.class);

        List<EC2ImageRaw> lsImage = new ArrayList<EC2ImageRaw>();
        for (Image image : imagesResult.getImages()) {
            if (awsAccountId.equals(image.getOwnerId())) {
                EC2ImageRaw ec2Image = new EC2ImageRaw();
                CommonUtil.copyProperties(image, ec2Image);
                for (ImageAttribute imageAttribute : ec2ImagesPermissions.getImageAttributes()) {
                    if (image.getImageId().equals(imageAttribute.getImageId())) {
                        ec2Image.setLaunchPermissions(imageAttribute.getLaunchPermissions());
                        break;
                    }
                }
                lsImage.add(ec2Image);
            }
        }
        ec2.setAmi(lsImage);

        // EC2 Volumes
        String ec2Volumes = AWSUtil.readS3Object(awsConfig, pathRaw + "EC2_Volumes.json");
        DescribeVolumesResult volumesResult = CommonUtil.mapperJson(ec2Volumes, DescribeVolumesResult.class);
        ec2.setEbs(volumesResult.getVolumes());

        // EC2 Snapshots
        String ec2Snapshots = AWSUtil.readS3Object(awsConfig, pathRaw + "EC2_Snapshots.json");
        DescribeSnapshotsResult snapshotsResult = CommonUtil.mapperJson(ec2Snapshots, DescribeSnapshotsResult.class);
        String jsonSnapshotsPermission = AWSUtil.readS3Object(awsConfig, pathRaw + "EC2_Snapshots_create_volume_permissions.json");
        EC2SnapshotsPermissions ec2SnapshotsPermissions = CommonUtil.mapperJson(jsonSnapshotsPermission, EC2SnapshotsPermissions.class);

        List<EC2SnapshotRaw> lsSnapshots = new ArrayList<EC2SnapshotRaw>();
        for (Snapshot snapshot : snapshotsResult.getSnapshots()) {
            if (awsAccountId.equals(snapshot.getOwnerId())) {
                EC2SnapshotRaw ec2Snapshot = new EC2SnapshotRaw();
                CommonUtil.copyProperties(snapshot, ec2Snapshot);
                for (DescribeSnapshotAttributeResult attributeResult : ec2SnapshotsPermissions.getImageAttributes()) {
                    if (snapshot.getSnapshotId().equals(attributeResult.getSnapshotId())) {
                        ec2Snapshot.setCreateVolumePermissions(attributeResult.getCreateVolumePermissions());
                        break;
                    }
                }
                lsSnapshots.add(ec2Snapshot);
            }
        }
        ec2.setSnapshot(lsSnapshots);

        // EC2 RI
        String ec2RI = AWSUtil.readS3Object(awsConfig, pathRaw + "EC2_RI.json");
        DescribeReservedInstancesResult reservedInstancesResult = CommonUtil.mapperJson(ec2RI, DescribeReservedInstancesResult.class);
        ec2.setRi(reservedInstancesResult.getReservedInstances());

        // Upload file to S3
        String s3Path = String.format(AWSUtil.PATH_COLLECT_AWS_REGION_RESOURCE, reportId, awsAccountId, region.getName());
        EC2RootName ec2RootName = new EC2RootName();
        ec2RootName.setEc2(ec2);
        ec2RootName.setSchemaVersion(reportConfig.getSchemaVersionLatest());
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, ec2RootName, jobConfig.getTemporaryDirectory(), s3Path,
                "EC2.json", false);
    }

    /**
     * create RDS report、S3にアップロードします。
     *
     * @param reportId
     * @param awsAccountId
     * @param credentials
     * @param regions
     */
    private void createRDSReport(String reportId, String awsAccountId, Regions region) {
        RDSResource rds = new RDSResource();
        String pathRaw = String.format(AWSUtil.PATH_COLLECT_AWS_REGION, reportId, awsAccountId, region.getName());

        // DBInstances
        String rdsInstances = AWSUtil.readS3Object(awsConfig, pathRaw + "RDS_Instances.json");
        DescribeDBInstancesResult dbInstancesResult = CommonUtil.mapperJson(rdsInstances,
                DescribeDBInstancesResult.class);
        String rdsListTags = AWSUtil.readS3Object(awsConfig, pathRaw + "RDS_ListTagsForResource.json");
        RootNameRaw rootNameRaw = CommonUtil.mapperJson(rdsListTags, RootNameRaw.class);

        List<DBInstanceResource> lsDBInstanceResource = new ArrayList<DBInstanceResource>();
        for (DBInstance dbInstance : dbInstancesResult.getDBInstances()) {
            DBInstanceResource dbInstanceResource = new DBInstanceResource();
            CommonUtil.copyProperties(dbInstance, dbInstanceResource);
            for (RDSListTagsForResource rdsListTagsForResource : rootNameRaw.getLsRDSListTagsForResource()) {
                if (dbInstance.getDBInstanceArn().equals(rdsListTagsForResource.getDbInstanceArn())) {
                    dbInstanceResource.setTagList(rdsListTagsForResource.getTagList());
                }
            }
            lsDBInstanceResource.add(dbInstanceResource);
        }
        rds.setLsDbInstances(lsDBInstanceResource);

        // RDS Snapshots
        String rdsSnapshots = AWSUtil.readS3Object(awsConfig, pathRaw + "RDS_Snapshots.json");
        DescribeDBSnapshotsResult dbSnapshotsResult = CommonUtil.mapperJson(rdsSnapshots,
                DescribeDBSnapshotsResult.class);
        rds.setLsDbSnapshots(dbSnapshotsResult.getDBSnapshots());

        // RDS RI
        String rdsRI = AWSUtil.readS3Object(awsConfig, pathRaw + "RDS_RI.json");
        DescribeReservedDBInstancesResult reservedDBInstancesResult = CommonUtil.mapperJson(rdsRI,
                DescribeReservedDBInstancesResult.class);
        rds.setLsReservedDBInstances(reservedDBInstancesResult.getReservedDBInstances());

        // Upload file to S3
        String s3Path = String.format(AWSUtil.PATH_COLLECT_AWS_REGION_RESOURCE, reportId, awsAccountId,
                region.getName());
        RootNameResource rootNameResource = new RootNameResource();
        rootNameResource.setRds(rds);
        rootNameResource.setSchemaVersion(reportConfig.getSchemaVersionLatest());
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, rootNameResource, jobConfig.getTemporaryDirectory(), s3Path,
                "RDS.json", false);
    }

    /**
     * create Redshift report、S3にアップロードします。
     *
     * @param reportId
     * @param awsAccountId
     * @param credentials
     * @param regions
     */
    private void createRedshiftReport(String reportId, String awsAccountId, Regions region) {
        RedshiftResource redshift = new RedshiftResource();
        String pathRaw = String.format(AWSUtil.PATH_COLLECT_AWS_REGION, reportId, awsAccountId, region.getName());

        // Redshift Clusters
        String redshiftClusters = AWSUtil.readS3Object(awsConfig, pathRaw + "Redshift_Clusters.json");
        DescribeClustersResult describeClustersResult = CommonUtil.mapperJson(redshiftClusters,
                DescribeClustersResult.class);
        String redshiftLoggingStatus = AWSUtil.readS3Object(awsConfig, pathRaw + "Redshift_LoggingStatus.json");
        RootNameRaw rootNameRaw = CommonUtil.mapperJson(redshiftLoggingStatus, RootNameRaw.class);

        List<ClusterResource> lsClusterResource = new ArrayList<ClusterResource>();
        for (Cluster cluster : describeClustersResult.getClusters()) {
            ClusterResource clusterResource = new ClusterResource();
            CommonUtil.copyProperties(cluster, clusterResource);
            for (RedshiftLoggingStatus loggingStatus : rootNameRaw.getLsRedshiftLoggingStatus()) {
                if (cluster.getClusterIdentifier().equals(loggingStatus.getClusterIdentifier())) {
                    clusterResource.setLoggingEnabled(loggingStatus.getLoggingEnabled());
                    break;
                }
            }
            lsClusterResource.add(clusterResource);
        }
        redshift.setLsClusterResource(lsClusterResource);

        // Redshift Snapshots
        String redshiftSnapshots = AWSUtil.readS3Object(awsConfig, pathRaw + "Redshift_Snapshots.json");
        DescribeClusterSnapshotsResult clusterSnapshotsResult = CommonUtil.mapperJson(redshiftSnapshots,
                DescribeClusterSnapshotsResult.class);
        redshift.setLsSnapshot(clusterSnapshotsResult.getSnapshots());

        // Redshift RI
        String redshiftRI = AWSUtil.readS3Object(awsConfig, pathRaw + "Redshift_RI.json");
        DescribeReservedNodesResult reservedNodesResult = CommonUtil.mapperJson(redshiftRI,
                DescribeReservedNodesResult.class);
        redshift.setLsReservedNode(reservedNodesResult.getReservedNodes());

        // Upload file to S3
        String s3Path = String.format(AWSUtil.PATH_COLLECT_AWS_REGION_RESOURCE, reportId, awsAccountId,
                region.getName());
        RootNameResource rootNameResource = new RootNameResource();
        rootNameResource.setRedshift(redshift);
        rootNameResource.setSchemaVersion(reportConfig.getSchemaVersionLatest());
        AWSUtil.uploadFileCollectAWSRegion(awsConfig, rootNameResource, jobConfig.getTemporaryDirectory(), s3Path,
                "Redshift.json", false);
    }
}
