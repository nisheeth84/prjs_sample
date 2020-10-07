package jp.classmethod.premembers.check.security.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.ClientConfiguration;
import com.amazonaws.Protocol;
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.services.batch.AWSBatch;
import com.amazonaws.services.batch.AWSBatchClientBuilder;
import com.amazonaws.services.batch.model.DescribeJobsRequest;
import com.amazonaws.services.batch.model.DescribeJobsResult;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

import jp.classmethod.premembers.check.security.config.AWSConfig;
import jp.classmethod.premembers.check.security.constant.ComConst;
import jp.classmethod.premembers.check.security.exception.PremembersApplicationException;

public class AWSUtil {

    private final static Logger LOGGER = LoggerFactory.getLogger(AWSUtil.class);

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
        } catch (Exception e) {
            LOGGER.error(PremembersUtil.getStackTrace(e));
            throw new PremembersApplicationException("ERROR", e.getMessage());
        }
        return builder.toString();
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
            String msg = String.format("S3ファイルアップロードに失敗しました。：Bucket=%s, Key=%s", bucket, s3FileName);
            LOGGER.error(msg);
            throw new PremembersApplicationException("ERROR", msg);
        }
    }

    /**
     * get log stream name
     *
     * @param jobId
     * @return
     */
    public static String getLogStreamName(String jobId, String batchEndpoint, String batchRegion) {
        AWSBatch client = AWSBatchClientBuilder.standard()
                .withEndpointConfiguration(new EndpointConfiguration(batchEndpoint, batchRegion)).build();
        DescribeJobsResult result = client.describeJobs(new DescribeJobsRequest().withJobs(jobId));
        if (result != null && result.getJobs().size() > 0) {
            return result.getJobs().get(0).getContainer().getLogStreamName();
        }
        return ComConst.BLANK;
    }
}
