package jp.co.softbrain.esales.tenants.tenant.util;

import com.amazonaws.util.StringUtils;

/**
 * Utility methods for S3 path
 *
 * @author tongminhcuong
 */
public class S3PathUtils {

    /**
     * Private constructor
     */
    private S3PathUtils() {

    }

    public static final int BUCKET_NAME_INDEX = 0;

    public static final int S3_KEY_INDEX = 1;

    /**
     * Extract s3 path to get bucket name and S3 key
     *
     * @param s3Path s3 path
     * @return bucket name and S3 key
     */
    public static String[] extractS3Path(String s3Path) {
        if (StringUtils.isNullOrEmpty(s3Path)) {
            return new String[0];
        }

        String bucketName = s3Path.split("/")[BUCKET_NAME_INDEX];
        String s3Key = s3Path.replaceFirst(bucketName + "/", "");

        return new String[] {
                bucketName,
                s3Key
        };
    }
}
