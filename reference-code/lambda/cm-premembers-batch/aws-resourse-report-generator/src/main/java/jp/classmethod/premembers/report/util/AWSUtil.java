package jp.classmethod.premembers.report.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.ClientConfiguration;
import com.amazonaws.Protocol;
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.DeleteObjectsRequest;
import com.amazonaws.services.s3.model.DeleteObjectsRequest.KeyVersion;
import com.amazonaws.services.s3.model.DeleteObjectsResult;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ListObjectsRequest;
import com.amazonaws.services.s3.model.MultiObjectDeleteException;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;

import jp.classmethod.premembers.report.exception.PremembersApplicationException;
import jp.classmethod.premembers.report.job.config.AWSConfig;

public class AWSUtil {

    private final static Logger LOGGER = LoggerFactory.getLogger(AWSUtil.class);

    // {report_id}/raw/{account_id}/{region}/
    public static final String PATH_COLLECT_AWS_REGION = "%s/raw/%s/%s/";
    // {report_id}/resource/{account_id}/{region}/
    public static final String PATH_COLLECT_AWS_REGION_RESOURCE = "%s/resource/%s/%s/";
    // {report_id}/resource/{account_id}/{region}/
    public static final String PATH_REPORT_LOG = "report_batch/%s/";

    /**
     * GovCloud、および中国（北京・寧夏）リージョン以外のリージョンを返します。
     *
     * @return リージョンの配列
     */
    public static Regions[] getEnableRegions() {
        ArrayList<Regions> regionList = new ArrayList<Regions>(Arrays.asList(Regions.values()));
        regionList.remove(Regions.GovCloud);
        regionList.remove(Regions.CN_NORTH_1);
        regionList.remove(Regions.CN_NORTHWEST_1);
        return regionList.toArray(new Regions[0]);
    }

    /**
     * S3へファイルのアップロードを行います
     *
     * @param s3FileName
     * @param localFileName
     */
    public static void upload(AWSConfig awsConfig, String s3FileName, String localFileName) {
        uploadS3(awsConfig, awsConfig.getS3ReportBucket(), s3FileName, localFileName);
    }

    /**
     * S3へファイルのアップロードを行います
     *
     * @param s3FileName
     * @param localFileName
     */
    public static void uploadS3(AWSConfig awsConfig, String bucket, String s3FileName, String localFileName) {
        // S3クライアント生成
        AmazonS3 client = AWSUtil.buildS3Client(awsConfig.getS3Endpoint(), awsConfig.getS3Region());

        File file = new File(localFileName);
        try {
            client.putObject(bucket, s3FileName, file);
        } catch (RuntimeException e) {
            String msg = String.format("S3ファイルアップロードに失敗しました。：Bucket=%s, Key=%s", awsConfig.getS3ReportBucket(),
                    s3FileName);
            LOGGER.error(msg);
            throw new PremembersApplicationException("ERROR", msg);
        }
    }

    /**
     * S3オブジェクトの読込、文字列として返します。
     *
     * @param s3FileName
     * @param localFileName
     * @throws IOException
     */
    public static String readS3Object(AWSConfig awsConfig, String s3FileName) {
        return readS3(awsConfig, awsConfig.getS3ReportBucket(), s3FileName);
    }

    /**
     * S3オブジェクトの読込、文字列として返します。
     *
     * @param s3FileName
     * @param localFileName
     * @throws IOException
     */
    public static String readS3(AWSConfig awsConfig, String bucket, String s3FileName) {
        // S3クライアント生成
        AmazonS3 client = AWSUtil.buildS3Client(awsConfig.getS3Endpoint(), awsConfig.getS3Region());
        StringBuilder builder = new StringBuilder();
        String str;
        try (InputStream is = client.getObject(bucket, s3FileName).getObjectContent();
                InputStreamReader reader = new InputStreamReader(is, StandardCharsets.UTF_8);
                    BufferedReader br = new BufferedReader(reader);) {
            while ((str = br.readLine()) != null) {
                builder.append(str);
            }
        } catch (IOException e) {
            // TODO: handle exception
            e.printStackTrace();
        }
        return builder.toString();
    }

    /**
     * S3クライアント生成
     *
     * @param s3Endpoint
     * @param s3Region
     * @param s3Bucket
     */
    public static AmazonS3 buildS3Client(String s3Endpoint, String s3Region) {
        // クライアント設定
        ClientConfiguration clientConfig = new ClientConfiguration();
        clientConfig.setProtocol(Protocol.HTTPS); // プロトコル
        clientConfig.setConnectionTimeout(10000); // 接続タイムアウト(ms)

        // エンドポイント設定
        EndpointConfiguration endpointConfiguration = new EndpointConfiguration(s3Endpoint, s3Region);

        // クライアント生成
        AmazonS3 client = AmazonS3ClientBuilder.standard()
                .withCredentials(DefaultAWSCredentialsProviderChain.getInstance()).withClientConfiguration(clientConfig)
                .withEndpointConfiguration(endpointConfiguration).build();

        return client;

    }

    /**
     * S3からファイルを取得を行います
     *
     * @param s3Endpoint
     * @param s3Region
     * @param s3Bucket
     * @param localFileName
     * @return S3Object
     */
    public static S3Object getS3Object(String s3Endpoint, String s3Region, String s3Bucket, String s3FileName) {

        // S3クライアント生成
        AmazonS3 client = AWSUtil.buildS3Client(s3Endpoint, s3Region);

        return client.getObject(new GetObjectRequest(s3Bucket, s3FileName));
    }

    /**
     * S3にアップロードされたファイルのクリーンアップ パスに指定されたディレクトリ配下のファイルをS3から全て削除します。
     *
     * @param s3Endpoint
     * @param s3Region
     * @param s3Bucket
     * @param path
     *            S3削除対象パス
     */
    public static void s3FileCleanUp(String s3Endpoint, String s3Region, String s3Bucket, String path) {

        // S3クライアント生成
        AmazonS3 client = AWSUtil.buildS3Client(s3Endpoint, s3Region);

        // path配下のファイルリスト
        List<String> s3FilePathList = new ArrayList<String>();

        // 削除対象ファイルリスト取得
        getS3FilePath(client, s3Bucket, path, s3FilePathList);

        // S3からファイルを削除する
        s3FileDelete(client, s3Bucket, s3FilePathList);

    }

    /**
     * S3削除対象ファイルリスト取得
     *
     * @param client
     *            AmazonS3
     * @param s3Bucket
     *            バケット
     * @param path
     *            検索対象ファイルパス
     * @param s3FilePathList
     *            検索結果ファイルパス格納リスト
     */
    public static void getS3FilePath(AmazonS3 client, String s3Bucket, String path, List<String> s3FilePathList) {

        ListObjectsRequest request = new ListObjectsRequest().withBucketName(s3Bucket).withPrefix(path)
                .withDelimiter("/");
        ObjectListing list = client.listObjects(request);

        // フォルダ一覧
        List<String> folders = list.getCommonPrefixes();

        for (String folder : folders) {
            getS3FilePath(client, s3Bucket, folder, s3FilePathList);
        }

        // オブジェクト一覧
        List<S3ObjectSummary> objects = list.getObjectSummaries();

        // keyを設定
        for (S3ObjectSummary object : objects) {
            s3FilePathList.add(object.getKey());
        }
    }

    /**
     * S3からファイルを削除する
     *
     * @param client
     *            AmazonS3
     * @param s3Bucket
     *            バケット
     * @param s3FilePathList
     *            削除対象ファイル名リスト
     */
    public static void s3FileDelete(AmazonS3 client, String s3Bucket, List<String> s3FilePathList) {

        if (s3FilePathList == null || s3FilePathList.size() == 0) {
            return;
        }

        DeleteObjectsRequest multiObjectDeleteRequest = new DeleteObjectsRequest(s3Bucket);

        List<KeyVersion> keys = new ArrayList<KeyVersion>();

        for (String s3FileName : s3FilePathList) {
            keys.add(new KeyVersion(s3FileName));
        }

        multiObjectDeleteRequest.setKeys(keys);

        try {
            DeleteObjectsResult delObjRes = client.deleteObjects(multiObjectDeleteRequest);
            System.out.format("Successfully deleted all the %s items.\n", delObjRes.getDeletedObjects().size());

        } catch (MultiObjectDeleteException e) {
            throw e;
        }
    }

    /**
     * upload file collect AWS region
     *
     * @author TuanDV
     * @param awsConfig
     * @param bean
     * @param temporaryDirectory
     * @param reportId
     * @param awsAccountId
     * @param regionName
     * @param fileName
     */
    public static void uploadFileCollectAWSRegion(AWSConfig awsConfig, Object bean, String temporaryDirectory,
            String s3Path, String fileName, boolean isConvertDate) {
        String localS3Path = temporaryDirectory + s3Path;
        JSONObject jsonObject = new JSONObject(CommonUtil.getJsonMapper(bean, isConvertDate));
        FileUtil.outputFile(localS3Path, fileName, jsonObject.toString(4));
        upload(awsConfig, s3Path + fileName, localS3Path + fileName);
    }
}
