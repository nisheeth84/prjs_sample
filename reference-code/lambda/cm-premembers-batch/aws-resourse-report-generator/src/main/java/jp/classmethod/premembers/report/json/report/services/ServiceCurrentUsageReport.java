package jp.classmethod.premembers.report.json.report.services;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ServiceCurrentUsageReport {
    @JsonProperty("EC2")
    private int ec2;
    @JsonProperty("RDS")
    private int rds;
    @JsonProperty("Redshift")
    private int redshift;
    @JsonProperty("TotalBucketSizeBytes")
    private double totalBucketSizeBytes;

    // Getter & Setter
    public int getEc2() {
        return ec2;
    }
    public void setEc2(int ec2) {
        this.ec2 = ec2;
    }
    public int getRds() {
        return rds;
    }
    public void setRds(int rds) {
        this.rds = rds;
    }
    public int getRedshift() {
        return redshift;
    }
    public void setRedshift(int redshift) {
        this.redshift = redshift;
    }
    public double getTotalBucketSizeBytes() {
        return totalBucketSizeBytes;
    }
    public void setTotalBucketSizeBytes(double totalBucketSizeBytes) {
        this.totalBucketSizeBytes = totalBucketSizeBytes;
    }
}
