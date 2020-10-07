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
import com.amazonaws.services.ec2.model.Instance;
import com.amazonaws.services.ec2.model.ReservedInstances;
import com.amazonaws.services.ec2.model.Tag;
import com.amazonaws.services.ec2.model.Volume;
import com.amazonaws.services.rds.model.DBSnapshot;
import com.amazonaws.services.rds.model.ReservedDBInstance;
import com.amazonaws.services.redshift.model.ReservedNode;
import com.amazonaws.services.redshift.model.Snapshot;
import com.amazonaws.services.s3.model.AmazonS3Exception;

import jp.classmethod.premembers.report.constant.ComConst;
import jp.classmethod.premembers.report.job.common.AsyncTaskStatus;
import jp.classmethod.premembers.report.job.config.AWSConfig;
import jp.classmethod.premembers.report.job.config.JobConfig;
import jp.classmethod.premembers.report.json.raw.ec2.EC2;
import jp.classmethod.premembers.report.json.raw.ec2.EC2ImageRaw;
import jp.classmethod.premembers.report.json.raw.ec2.EC2RootName;
import jp.classmethod.premembers.report.json.raw.ec2.EC2SnapshotRaw;
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
import jp.classmethod.premembers.report.json.resource.RootNameResource;
import jp.classmethod.premembers.report.json.resource.rds.DBInstanceResource;
import jp.classmethod.premembers.report.json.resource.rds.RDSResource;
import jp.classmethod.premembers.report.json.resource.redshift.ClusterResource;
import jp.classmethod.premembers.report.json.resource.redshift.RedshiftResource;
import jp.classmethod.premembers.report.util.AWSUtil;
import jp.classmethod.premembers.report.util.CommonUtil;
import jp.classmethod.premembers.report.util.DateUtil;
import jp.classmethod.premembers.report.util.FileUtil;

@Component
public class JsonReportOutputRegionTask {

    @Autowired
    private AWSConfig awsConfig;
    @Autowired
    private JobConfig jobConfig;
    @Autowired
    private AsyncTaskStatus status;

    private final static Logger LOGGER = LoggerFactory.getLogger(JsonReportOutputService.class);

    private static final String TAG_KEY_NAME = "Name";

    /**
     * レポートファイル作成 region
     *
     * @param reportId
     *            レポートID
     * @param accountId
     *            AWSアカウント
     * @param region
     *            リージョン
     * @param schemaVersion
     *            レポート書式バージョン
     * @param reportName
     *            レポート名
     */
    @Async("threadPool")
    public void execute(String reportId, String accountId, String region, String schemaVersion, String reportName) {

        try {
            // レポートファイル作成 region
            reportOutPut(reportId, accountId, region, schemaVersion, reportName);

        } catch (Exception e) {
            // エラーをセットする。
            status.setError();
            e.printStackTrace();
        }
    }

    /**
     * レポートファイル作成 refion
     *
     * @param reportId
     *            レポートID
     * @param accountId
     *            アカウントID
     * @param region
     *            リージョン
     */
    private void reportOutPut(String reportId, String accountId, String region, String schemaVersion, String reportName)
            throws Exception {

        // 出力用
        JSONObject rootJson = new JSONObject();

        rootJson.accumulate("account", accountId);
        rootJson.accumulate("region", region);
        rootJson.accumulate("schema_version", schemaVersion);
        rootJson.accumulate("report_name", reportName);

        // VPC情報の設定
        setVpcInfo(reportId, accountId, region, rootJson);
        // S3情報の設定
        setS3Info(reportId, accountId, region, rootJson);
        // EC2
        setEC2Info(reportId, accountId, region, rootJson);
        // RDS
        setRDSInfo(reportId, accountId, region, rootJson);
        // Redshift
        setRedshiftInfo(reportId, accountId, region, rootJson);
        // Services
        setServiceCurrentUsageInfo(reportId, accountId, region, rootJson);

        // ローカルファイルパス
        String localFileDirectory = jobConfig.getTemporaryDirectory();
        String localFileName = reportId + "_" + accountId + "_" + region + ".json";
        String localFilePath = localFileDirectory + localFileName;

        // ローカルファイルを削除
        FileUtil.fileDelete(localFilePath);

        // ローカルファイルを出力
        FileUtil.outputFile(localFileDirectory, localFileName, rootJson.toString(4));

        // S3ファイルパス
        String s3FilePath = reportId + "/report_json/" + accountId + "/" + reportId + "_" + accountId + "_" + region
                + ".json";

        try {
            // S3にアップロード
            AWSUtil.upload(awsConfig, s3FilePath, localFilePath);
        } catch (AmazonServiceException e) {
            // ログレベル： ERROR
            LOGGER.error(
                    "S3ファイルアップロードに失敗しました。: Bucket={" + awsConfig.getS3ReportBucket() + "}, Key={" + s3FilePath + "}");
            throw e;
        } catch (SdkClientException e) {
            // ログレベル： ERROR
            LOGGER.error(
                    "S3ファイルアップロードに失敗しました。: Bucket={" + awsConfig.getS3ReportBucket() + "}, Key={" + s3FilePath + "}");
            throw e;
        }

        // ローカルファイルを削除
        FileUtil.fileDelete(localFilePath);
    }

    /**
     * VPC情報の設定
     *
     * @param reportId
     * @param accountId
     * @param region
     * @param rootJson
     *            出力用JSON
     */
    private void setVpcInfo(String reportId, String accountId, String region, JSONObject rootJson) throws Exception {

        String vpcFilepath = reportId + "/resource/" + accountId + "/" + region + "/VPC.json";

        // VPC.jsonファイル読み込み
        try {
            String jsonStr = AWSUtil.readS3Object(awsConfig, vpcFilepath);
            JSONObject jsonObject = new JSONObject(jsonStr);

            if (!jsonObject.isNull("VPC")) {

                JSONObject vpc = jsonObject.getJSONObject("VPC");

                JSONObject vpcJson = new JSONObject();

                if (!vpc.isNull("security_group")) {

                    JSONArray securityGroups = vpc.getJSONArray("security_group");

                    List<JSONObject> securityGroupJsonArray = new ArrayList<JSONObject>();

                    for (Object tempSecurityGroups : securityGroups) {

                        JSONObject securityGroup = (JSONObject) tempSecurityGroups;

                        JSONObject securityGroupJson = new JSONObject();

                        if (!securityGroup.isNull("name")) {
                            securityGroupJson.accumulate("name", securityGroup.getString("name"));
                        }

                        if (!securityGroup.isNull("groupId")) {
                            securityGroupJson.accumulate("id", securityGroup.getString("groupId"));
                        }

                        if (!securityGroup.isNull("vpcId")) {
                            securityGroupJson.accumulate("vpc_id", securityGroup.getString("vpcId"));
                        }

                        if (!securityGroup.isNull("ipPermissions")) {
                            // IpPermissions情報の設定
                            setIpPermissionsInfo(securityGroup, securityGroupJson);
                        }

                        if (!securityGroup.isNull("ipPermissionsEgress")) {
                            // IpPermissionsEgress情報の設定
                            setIpPermissionsEgressInfo(securityGroup, securityGroupJson);
                        }

                        securityGroupJsonArray.add(securityGroupJson);
                    }
                    vpcJson.accumulate("security_group", securityGroupJsonArray);
                }

                rootJson.accumulate("VPC", vpcJson);
            }

        } catch (AmazonS3Exception e) {
            LOGGER.error(
                    "S3ファイルダウンロードに失敗しました。: Bucket={" + awsConfig.getS3ReportBucket() + "}, Key={" + vpcFilepath + "}");
            throw e;
        }
    }

    /**
     * IpPermissions情報の設定
     *
     * @param securityGroup
     *            読込用JSON
     * @param securityGroupJson
     *            出力用JSON
     */
    private void setIpPermissionsInfo(JSONObject securityGroup, JSONObject securityGroupJson) throws Exception {

        JSONArray ipPermissions = securityGroup.getJSONArray("ipPermissions");

        List<JSONObject> inboundJsonArray = new ArrayList<JSONObject>();

        for (Object tempIpPermissions : ipPermissions) {

            JSONObject ipPermission = (JSONObject) tempIpPermissions;

            JSONObject tempJson = new JSONObject();

            if (!ipPermission.isNull("ipProtocol")) {
                tempJson.accumulate("protocol", ipPermission.getString("ipProtocol"));
            }

            if (!ipPermission.isNull("fromPort")) {
                tempJson.accumulate("from_port", ipPermission.getInt("fromPort"));
            }

            if (!ipPermission.isNull("toPort")) {
                tempJson.accumulate("to_port", ipPermission.getInt("toPort"));
            }

            if (!ipPermission.isNull("ipv4Ranges")) {
                JSONArray ipRanges = ipPermission.getJSONArray("ipv4Ranges");

                for (Object tempIpRanges : ipRanges) {

                    JSONObject inboundJson = new JSONObject(tempJson.toString());

                    JSONObject ipRange = (JSONObject) tempIpRanges;

                    if (!ipRange.isNull("cidrIp")) {
                        inboundJson.accumulate("source", ipRange.getString("cidrIp"));
                    }

                    if (!ipRange.isNull("description")) {
                        inboundJson.accumulate("description", ipRange.getString("description"));
                    }

                    inboundJsonArray.add(inboundJson);
                }
            }

            if (!ipPermission.isNull("ipv6Ranges")) {
                JSONArray ipv6Ranges = ipPermission.getJSONArray("ipv6Ranges");

                for (Object tempIpv6Ranges : ipv6Ranges) {

                    JSONObject inboundJson = new JSONObject(tempJson.toString());

                    JSONObject ipv6Range = (JSONObject) tempIpv6Ranges;

                    if (!ipv6Range.isNull("cidrIpv6")) {
                        inboundJson.accumulate("source", ipv6Range.getString("cidrIpv6"));
                    }

                    if (!ipv6Range.isNull("description")) {
                        inboundJson.accumulate("description", ipv6Range.getString("description"));
                    }

                    inboundJsonArray.add(inboundJson);
                }
            }

            if (!ipPermission.isNull("prefixListIds")) {
                JSONArray prefixListIds = ipPermission.getJSONArray("prefixListIds");

                for (Object tempPrefixListIds : prefixListIds) {

                    JSONObject inboundJson = new JSONObject(tempJson.toString());

                    JSONObject prefixListId = (JSONObject) tempPrefixListIds;

                    if (!prefixListId.isNull("prefixListId")) {
                        inboundJson.accumulate("source", prefixListId.getString("prefixListId"));
                    }

                    if (!prefixListId.isNull("description")) {
                        inboundJson.accumulate("description", prefixListId.getString("description"));
                    }

                    inboundJsonArray.add(inboundJson);
                }
            }

            if (!ipPermission.isNull("userIdGroupPairs")) {
                JSONArray userIdGroupPairs = ipPermission.getJSONArray("userIdGroupPairs");

                for (Object tempUserIdGroupPairs : userIdGroupPairs) {

                    JSONObject inboundJson = new JSONObject(tempJson.toString());

                    JSONObject userIdGroupPair = (JSONObject) tempUserIdGroupPairs;

                    if (!userIdGroupPair.isNull("groupId")) {
                        inboundJson.accumulate("source", userIdGroupPair.getString("groupId"));
                    }

                    if (!userIdGroupPair.isNull("description")) {
                        inboundJson.accumulate("description", userIdGroupPair.getString("description"));
                    }

                    inboundJsonArray.add(inboundJson);
                }
            }
        }
        securityGroupJson.accumulate("inbound", inboundJsonArray);
    }

    /**
     * IpPermissionsEgress情報の設定
     *
     * @param securityGroup
     *            読込用JSON
     * @param securityGroupJson
     *            出力用JSON
     */
    private void setIpPermissionsEgressInfo(JSONObject securityGroup, JSONObject securityGroupJson) throws Exception {

        JSONArray ipPermissionsEgress = securityGroup.getJSONArray("ipPermissionsEgress");

        List<JSONObject> outboundJsonArray = new ArrayList<JSONObject>();

        for (Object tempIpPermissionsEgress : ipPermissionsEgress) {

            JSONObject ipPermissionsEgres = (JSONObject) tempIpPermissionsEgress;

            JSONObject tempJson = new JSONObject();

            if (!ipPermissionsEgres.isNull("ipProtocol")) {
                tempJson.accumulate("protocol", ipPermissionsEgres.getString("ipProtocol"));
            }

            if (!ipPermissionsEgres.isNull("fromPort")) {
                tempJson.accumulate("from_port", ipPermissionsEgres.getInt("fromPort"));
            }

            if (!ipPermissionsEgres.isNull("toPort")) {
                tempJson.accumulate("to_port", ipPermissionsEgres.getInt("toPort"));
            }

            if (!ipPermissionsEgres.isNull("ipv4Ranges")) {
                JSONArray ipRanges = ipPermissionsEgres.getJSONArray("ipv4Ranges");

                for (Object tempIpRanges : ipRanges) {

                    JSONObject outboundJson = new JSONObject(tempJson.toString());

                    JSONObject ipRange = (JSONObject) tempIpRanges;

                    if (!ipRange.isNull("cidrIp")) {
                        outboundJson.accumulate("source", ipRange.getString("cidrIp"));
                    }

                    if (!ipRange.isNull("description")) {
                        outboundJson.accumulate("description", ipRange.getString("description"));
                    }

                    outboundJsonArray.add(outboundJson);
                }
            }

            if (!ipPermissionsEgres.isNull("ipv6Ranges")) {
                JSONArray ipv6Ranges = ipPermissionsEgres.getJSONArray("ipv6Ranges");

                for (Object tempIpv6Ranges : ipv6Ranges) {

                    JSONObject outboundJson = new JSONObject(tempJson.toString());

                    JSONObject ipv6Range = (JSONObject) tempIpv6Ranges;

                    if (!ipv6Range.isNull("cidrIpv6")) {
                        outboundJson.accumulate("source", ipv6Range.getString("cidrIpv6"));
                    }

                    if (!ipv6Range.isNull("description")) {
                        outboundJson.accumulate("description", ipv6Range.getString("description"));
                    }

                    outboundJsonArray.add(outboundJson);
                }
            }

            if (!ipPermissionsEgres.isNull("prefixListIds")) {
                JSONArray prefixListIds = ipPermissionsEgres.getJSONArray("prefixListIds");

                for (Object tempPrefixListIds : prefixListIds) {

                    JSONObject outboundJson = new JSONObject(tempJson.toString());

                    JSONObject prefixListId = (JSONObject) tempPrefixListIds;

                    if (!prefixListId.isNull("prefixListId")) {
                        outboundJson.accumulate("source", prefixListId.getString("prefixListId"));
                    }

                    if (!prefixListId.isNull("description")) {
                        outboundJson.accumulate("description", prefixListId.getString("description"));
                    }

                    outboundJsonArray.add(outboundJson);
                }
            }

            if (!ipPermissionsEgres.isNull("userIdGroupPairs")) {
                JSONArray userIdGroupPairs = ipPermissionsEgres.getJSONArray("userIdGroupPairs");

                for (Object tempUserIdGroupPairs : userIdGroupPairs) {

                    JSONObject outboundJson = new JSONObject(tempJson.toString());

                    JSONObject userIdGroupPair = (JSONObject) tempUserIdGroupPairs;

                    if (!userIdGroupPair.isNull("groupId")) {
                        outboundJson.accumulate("source", userIdGroupPair.getString("groupId"));
                    }

                    if (!userIdGroupPair.isNull("description")) {
                        outboundJson.accumulate("description", userIdGroupPair.getString("description"));
                    }

                    outboundJsonArray.add(outboundJson);
                }
            }
        }

        securityGroupJson.accumulate("outbound", outboundJsonArray);
    }

    /**
     * S3情報の設定
     *
     * @param reportId
     * @param accountId
     * @param region
     * @param rootJson
     *            出力用JSON
     */
    private void setS3Info(String reportId, String accountId, String region, JSONObject rootJson) throws Exception {

        String s3Filepath = reportId + "/resource/" + accountId + "/" + region + "/S3.json";

        // S3.jsonファイル読み込み
        try {
            String jsonStr = AWSUtil.readS3Object(awsConfig, s3Filepath);
            JSONObject jsonObject = new JSONObject(jsonStr);

            if (!jsonObject.isNull("S3")) {

                JSONObject s3 = jsonObject.getJSONObject("S3");

                if (!s3.isNull("bucket")) {

                    JSONArray buckets = s3.getJSONArray("bucket");

                    List<JSONObject> s3JsonArray = new ArrayList<JSONObject>();

                    for (Object tempBuckets : buckets) {

                        JSONObject bucket = (JSONObject) tempBuckets;

                        JSONObject s3Json = new JSONObject();

                        if (!bucket.isNull("Name")) {
                            s3Json.accumulate("bucket_name", bucket.getString("Name"));
                        }
                        s3Json.accumulate("bucketSizeBytes", bucket.getDouble("bucketSizeBytes"));

                        boolean bucketPolicyFlg = false;

                        if (!bucket.isNull("bucket_policy")) {
                            String bucketPolicy = replace(bucket.getString("bucket_policy"));

                            if (bucketPolicy != null && bucketPolicy != "") {
                                // S3のパブリックアクセス確認用
                                JSONObject checkJSONObject = new JSONObject(bucketPolicy);

                                if (!checkJSONObject.isNull("Statement")) {

                                    JSONArray Statements = checkJSONObject.getJSONArray("Statement");

                                    for (Object tempStatements : Statements) {

                                        JSONObject statement = (JSONObject) tempStatements;

                                        boolean effectFlg = false;

                                        if (!statement.isNull("Effect")) {

                                            String effect = statement.getString("Effect");

                                            if ("Allow".equals(effect)) {
                                                effectFlg = true;
                                            }
                                        }

                                        boolean principalFlg = false;

                                        if (!statement.isNull("Principal")) {

                                            if (statement.get("Principal") instanceof String) {
                                                String principal = (String) statement.get("Principal");

                                                if ("*".equals(principal)) {
                                                    principalFlg = true;
                                                }
                                            }
                                        }

                                        boolean sourceIpFlg = true;

                                        if (!statement.isNull("Condition")) {
                                            JSONObject condition = statement.getJSONObject("Condition");

                                            if (!condition.isNull("IpAddress")) {
                                                JSONObject ipAddress = condition.getJSONObject("IpAddress");

                                                if (!ipAddress.isNull("aws:SourceIp")) {
                                                    JSONArray sourceIps = ipAddress.getJSONArray("aws:SourceIp");
                                                    if (sourceIps != null && sourceIps.length() > 0) {
                                                        sourceIpFlg = false;
                                                    }
                                                }
                                            }
                                        }

                                        if (effectFlg && principalFlg && sourceIpFlg) {
                                            bucketPolicyFlg = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        s3Json.accumulate("bucket_policy", bucketPolicyFlg);

                        boolean bucketAclFlg = false;

                        if (!bucket.isNull("bucket_acl")) {
                            JSONObject bucketAcl = bucket.getJSONObject("bucket_acl");

                            if (!bucketAcl.isNull("Grants")) {

                                JSONArray grants = bucketAcl.getJSONArray("Grants");

                                for (Object tempGrants : grants) {

                                    JSONObject grant = (JSONObject) tempGrants;

                                    boolean uriFlg = false;

                                    if (!grant.isNull("Grantee")) {
                                        JSONObject grantee = grant.getJSONObject("Grantee");

                                        if (!grantee.isNull("URI")) {
                                            String uri = grantee.getString("URI");

                                            if ("http://acs.amazonaws.com/groups/global/AllUsers".equals(uri)) {
                                                uriFlg = true;
                                            }
                                        }
                                    }

                                    boolean permissionFlg = false;

                                    if (!grant.isNull("Permission")) {
                                        String permission = grant.getString("Permission");

                                        if ("READ".equals(permission) || "WRITE".equals(permission)
                                                || "READ_ACP".equals(permission) || "WRITE_ACP".equals(permission)
                                                || "FULL_CONTROL".equals(permission)) {

                                            permissionFlg = true;
                                        }
                                    }

                                    if (uriFlg && permissionFlg) {
                                        bucketAclFlg = true;
                                        break;
                                    }
                                }
                            }
                        }

                        s3Json.accumulate("bucket_acl", bucketAclFlg);

                        if (bucketPolicyFlg || bucketAclFlg) {
                            s3Json.accumulate("public_access", true);
                        } else {
                            s3Json.accumulate("public_access", false);
                        }

                        s3JsonArray.add(s3Json);
                    }

                    rootJson.accumulate("S3", s3JsonArray);
                }
            }

        } catch (AmazonS3Exception e) {
            LOGGER.error(
                    "S3ファイルダウンロードに失敗しました。: Bucket={" + awsConfig.getS3ReportBucket() + "}, Key={" + s3Filepath + "}");
            throw e;
        }
    }

    public String replace(String input) {

        if (input == null || input == "") {
            return "";
        }

        return input.replace("\\\"", "\"");

    }

    /**
     * S3情報の設定
     *
     * @param reportId
     * @param accountId
     * @param region
     * @param rootJson
     *            出力用JSON
     */
    private void setEC2Info(String reportId, String accountId, String region, JSONObject rootJson) throws Exception {
        String patchResource = String.format(AWSUtil.PATH_COLLECT_AWS_REGION_RESOURCE, reportId, accountId, region);
        try {
            // EC2 JSON
            EC2Report ec2Report = new EC2Report();
            String jsonEc2 = AWSUtil.readS3Object(awsConfig, patchResource + "EC2.json");
            EC2 ec2 = CommonUtil.mapperJson(jsonEc2, EC2RootName.class).getEc2();

            // Ec2 Running
            ec2Report.setEc2Running(getLsEc2Instance(ec2.getRunning()));

            // Ec2 Stop
            ec2Report.setEc2Stop(getLsEc2Instance(ec2.getStop()));

            // Ec2 AMI
            List<EC2AMI> lsEc2AMI = new ArrayList<EC2AMI>();
            for (EC2ImageRaw image : ec2.getAmi()) {
                EC2AMI ec2ami = new EC2AMI();
                CommonUtil.copyProperties(image, ec2ami);
                ec2ami.setPublicValue(image.getPublic());
                ec2ami.setNameTag(getNameTag(image.getTags()));
                lsEc2AMI.add(ec2ami);
            }
            ec2Report.setEc2AMI(lsEc2AMI);

            // Ec2 Volumes
            List<EC2Ebs> lsEC2Ebs = new ArrayList<EC2Ebs>();
            for (Volume volume : ec2.getEbs()) {
                EC2Ebs ec2Ebs = new EC2Ebs();
                CommonUtil.copyProperties(volume, ec2Ebs);
                ec2Ebs.setName(getNameTag(volume.getTags()));
                lsEC2Ebs.add(ec2Ebs);
            }
            ec2Report.setEc2Ebs(lsEC2Ebs);

            // Ec2 Snapshot
            List<EC2Snapshot> lsEc2Snapshot = new ArrayList<EC2Snapshot>();
            for (EC2SnapshotRaw snapshot : ec2.getSnapshot()) {
                EC2Snapshot ec2Snapshot = new EC2Snapshot();
                CommonUtil.copyProperties(snapshot, ec2Snapshot);
                ec2Snapshot.setName(getNameTag(snapshot.getTags()));
                lsEc2Snapshot.add(ec2Snapshot);
            }
            ec2Report.setEc2Snapshot(lsEc2Snapshot);

            // Ec2 RI
            List<EC2RI> lsEC2RI = new ArrayList<EC2RI>();
            for (ReservedInstances ri : ec2.getRi()) {
                EC2RI ec2RI = new EC2RI();
                CommonUtil.copyProperties(ri, ec2RI);
                lsEC2RI.add(ec2RI);
            }
            ec2Report.setEc2RI(lsEC2RI);

            JSONObject jsonEc2Object = new JSONObject(CommonUtil.getJsonMapper(ec2Report, false));
            rootJson.put("EC2", jsonEc2Object);

        } catch (AmazonS3Exception e) {
            LOGGER.error("S3ファイルダウンロードに失敗しました。: Bucket={" + awsConfig.getS3ReportBucket() + "}, Key={" + patchResource
                    + "}");
            throw e;
        }
    }

    private List<EC2Instance> getLsEc2Instance(List<Instance> lsInstance) {
        List<EC2Instance> lsEC2Instance = new ArrayList<EC2Instance>();
        for (Instance instance : lsInstance) {
            EC2Instance ec2Instance = new EC2Instance();
            CommonUtil.copyProperties(instance, ec2Instance);
            ec2Instance.setAvailabilityZone(instance.getPlacement().getAvailabilityZone());
            ec2Instance.setName(getNameTag(instance.getTags()));
            lsEC2Instance.add(ec2Instance);
        }
        return lsEC2Instance;
    }

    private String getNameTag(List<Tag> lsTag) {
        String nameTag = ComConst.BLANK;
        for (Tag tag : lsTag) {
            if (TAG_KEY_NAME.equals(tag.getKey())) {
                nameTag = tag.getValue();
                break;
            }
        }
        return nameTag;
    }

    /**
     * Set RDS Info
     *
     * @param reportId
     * @param accountId
     * @param region
     * @param rootJson
     *            出力用JSON
     */
    private void setRDSInfo(String reportId, String accountId, String region, JSONObject rootJson) throws Exception {
        String patchResource = String.format(AWSUtil.PATH_COLLECT_AWS_REGION_RESOURCE, reportId, accountId, region);
        try {
            // RDS JSON
            RDSReport rdsReport = new RDSReport();
            String jsonRDS = AWSUtil.readS3Object(awsConfig, patchResource + "RDS.json");
            RDSResource rds = CommonUtil.mapperJson(jsonRDS, RootNameResource.class).getRds();

            // RDS DBInstances
            List<DBInstanceReport> lsDBInstanceReport = new ArrayList<DBInstanceReport>();
            for (DBInstanceResource dbInstanceResource : rds.getLsDbInstances()) {
                DBInstanceReport dbInstanceReport = new DBInstanceReport();
                CommonUtil.copyProperties(dbInstanceResource, dbInstanceReport);
                if (dbInstanceResource.getDBSubnetGroup() != null) {
                    dbInstanceReport.setVpcId(dbInstanceResource.getDBSubnetGroup().getVpcId());
                }
                lsDBInstanceReport.add(dbInstanceReport);
            }
            rdsReport.setLsDBInstanceReport(lsDBInstanceReport);

            // RDS Snapshots
            List<DBSnapshotReport> lsDBSnapshotReport = new ArrayList<DBSnapshotReport>();
            for (DBSnapshot dbSnapshot : rds.getLsDbSnapshots()) {
                DBSnapshotReport dbSnapshotReport = new DBSnapshotReport();
                CommonUtil.copyProperties(dbSnapshot, dbSnapshotReport);
                lsDBSnapshotReport.add(dbSnapshotReport);
            }
            rdsReport.setLsDBSnapshotReport(lsDBSnapshotReport);

            // RDS RI
            List<ReservedDBInstanceReport> lsReservedDBInstanceReport = new ArrayList<ReservedDBInstanceReport>();
            for (ReservedDBInstance reservedDBInstance : rds.getLsReservedDBInstances()) {
                ReservedDBInstanceReport reservedDBInstanceReport = new ReservedDBInstanceReport();
                CommonUtil.copyProperties(reservedDBInstance, reservedDBInstanceReport);
                int remainingDay = DateUtil.getRemainingDay(reservedDBInstance.getStartTime(),
                        reservedDBInstance.getDuration());
                reservedDBInstanceReport.setRemainingDay(remainingDay);
                lsReservedDBInstanceReport.add(reservedDBInstanceReport);
            }
            rdsReport.setLsReservedDBInstanceReport(lsReservedDBInstanceReport);

            JSONObject jsonRDSObject = new JSONObject(CommonUtil.getJsonMapper(rdsReport, false));
            rootJson.put("RDS", jsonRDSObject);

        } catch (AmazonS3Exception e) {
            LOGGER.error("RDSファイルダウンロードに失敗しました。: Bucket={" + awsConfig.getS3ReportBucket() + "}, Key={" + patchResource
                    + "}");
            throw e;
        }
    }

    /**
     * Set Redshift Info
     *
     * @param reportId
     * @param accountId
     * @param region
     * @param rootJson 出力用JSON
     */
    private void setRedshiftInfo(String reportId, String accountId, String region, JSONObject rootJson)
            throws Exception {
        String patchResource = String.format(AWSUtil.PATH_COLLECT_AWS_REGION_RESOURCE, reportId, accountId, region);
        try {
            // Redshift JSON
            RedshiftReport redshiftReport = new RedshiftReport();
            String jsonRedshift = AWSUtil.readS3Object(awsConfig, patchResource + "Redshift.json");
            RedshiftResource redshift = CommonUtil.mapperJson(jsonRedshift, RootNameResource.class).getRedshift();

            // Redshift Clusters
            List<RedshiftClustersReport> lsRedshiftClustersReport = new ArrayList<RedshiftClustersReport>();
            for (ClusterResource clusterResource : redshift.getLsClusterResource()) {
                RedshiftClustersReport redshiftClustersReport = new RedshiftClustersReport();
                CommonUtil.copyProperties(clusterResource, redshiftClustersReport);
                lsRedshiftClustersReport.add(redshiftClustersReport);
            }
            redshiftReport.setLsClusters(lsRedshiftClustersReport);

            // Redshift Snapshots
            List<RedshiftSnapshotReport> lsRedshiftSnapshotReport = new ArrayList<RedshiftSnapshotReport>();
            for (Snapshot snapshot : redshift.getLsSnapshot()) {
                RedshiftSnapshotReport redshiftSnapshotReport = new RedshiftSnapshotReport();
                CommonUtil.copyProperties(snapshot, redshiftSnapshotReport);
                lsRedshiftSnapshotReport.add(redshiftSnapshotReport);
            }
            redshiftReport.setLsSnapshot(lsRedshiftSnapshotReport);

            // Redshift RI
            List<RedshiftRIReport> lsRedshiftRIReport = new ArrayList<RedshiftRIReport>();
            for (ReservedNode reservedNode : redshift.getLsReservedNode()) {
                RedshiftRIReport redshiftRIReport = new RedshiftRIReport();
                CommonUtil.copyProperties(reservedNode, redshiftRIReport);
                int remainingDay = 0;
                if (ComConst.ACTIVE.equals(reservedNode.getState())) {
                    remainingDay = DateUtil.getRemainingDay(reservedNode.getStartTime(), reservedNode.getDuration());
                }
                redshiftRIReport.setRemainingDay(remainingDay);
                lsRedshiftRIReport.add(redshiftRIReport);
            }
            redshiftReport.setLsReservedNode(lsRedshiftRIReport);

            JSONObject jsonRedshiftObject = new JSONObject(CommonUtil.getJsonMapper(redshiftReport, false));
            rootJson.put("Redshift", jsonRedshiftObject);
        } catch (AmazonS3Exception e) {
            LOGGER.error("Redshiftファイルダウンロードに失敗しました。: Bucket={" + awsConfig.getS3ReportBucket() + "}, Key={"
                    + patchResource + "}");
            throw e;
        }
    }

    /**
     * Set Services Info
     *
     * @param reportId
     * @param accountId
     * @param region
     * @param rootJson 出力用JSON
     */
    private void setServiceCurrentUsageInfo(String reportId, String accountId, String region, JSONObject rootJson)
            throws Exception {
        String patchResource = String.format(AWSUtil.PATH_COLLECT_AWS_REGION_RESOURCE, reportId, accountId, region);
        try {
            // Ec2
            String jsonEc2 = rootJson.getJSONObject("EC2").toString();
            EC2Report ec2Report = CommonUtil.mapperJson(jsonEc2, EC2Report.class);
            // RDS
            String jsonRDS = rootJson.getJSONObject("RDS").toString();
            RDSReport rdsReport = CommonUtil.mapperJson(jsonRDS, RDSReport.class);
            int countRDS = 0;
            for (DBInstanceReport dbInstanceReport : rdsReport.getLsDBInstanceReport()) {
                if (ComConst.AVAILABLE.equals(dbInstanceReport.getdBInstanceStatus())) {
                    countRDS++;
                }
            }
            // Redshift
            String jsonRedshift = rootJson.getJSONObject("Redshift").toString();
            RedshiftReport redshiftReport = CommonUtil.mapperJson(jsonRedshift, RedshiftReport.class);
            // S3バケットサイズ
            double totalBucketSizeBytes = 0;
            @SuppressWarnings("unchecked")
            List<JSONObject> lsS3JsonObjects = (List<JSONObject>) rootJson.get("S3");
            for (JSONObject jsonObject : lsS3JsonObjects) {
                totalBucketSizeBytes += jsonObject.getDouble("bucketSizeBytes");
            }

            ServiceCurrentUsageReport servicesReport = new ServiceCurrentUsageReport();
            servicesReport.setEc2(ec2Report.getEc2Running().size());
            servicesReport.setRds(countRDS);
            servicesReport.setRedshift(redshiftReport.getLsClusters().size());
            servicesReport.setTotalBucketSizeBytes(totalBucketSizeBytes);
            JSONObject jsonServiceCurrentUsage = new JSONObject(CommonUtil.getJsonMapper(servicesReport, false));
            rootJson.put("ServiceCurrentUsage", jsonServiceCurrentUsage);
        } catch (AmazonS3Exception e) {
            LOGGER.error("Servicesファイルダウンロードに失敗しました。: Bucket={" + awsConfig.getS3ReportBucket() + "}, Key={"
                    + patchResource + "}");
            throw e;
        }
    }
}
