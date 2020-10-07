package jp.classmethod.premembers.report.json.report.ec2;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EC2Report {
    private List<EC2Instance> ec2Running;
    private List<EC2Instance> ec2Stop;
    private List<EC2AMI> ec2AMI;
    private List<EC2Ebs> ec2Ebs;
    private List<EC2Snapshot> ec2Snapshot;
    private List<EC2RI> ec2RI;

    // Getter & Setter
    @JsonProperty("running_ec2")
    public List<EC2Instance> getEc2Running() {
        return ec2Running;
    }
    public void setEc2Running(List<EC2Instance> ec2Running) {
        this.ec2Running = ec2Running;
    }
    @JsonProperty("not_running_ec2")
    public List<EC2Instance> getEc2Stop() {
        return ec2Stop;
    }
    public void setEc2Stop(List<EC2Instance> ec2Stop) {
        this.ec2Stop = ec2Stop;
    }
    @JsonProperty("ami")
    public List<EC2AMI> getEc2AMI() {
        return ec2AMI;
    }
    public void setEc2AMI(List<EC2AMI> ec2ami) {
        ec2AMI = ec2ami;
    }
    @JsonProperty("ebs")
    public List<EC2Ebs> getEc2Ebs() {
        return ec2Ebs;
    }
    public void setEc2Ebs(List<EC2Ebs> ec2Ebs) {
        this.ec2Ebs = ec2Ebs;
    }
    @JsonProperty("snapshot")
    public List<EC2Snapshot> getEc2Snapshot() {
        return ec2Snapshot;
    }
    public void setEc2Snapshot(List<EC2Snapshot> ec2Snapshot) {
        this.ec2Snapshot = ec2Snapshot;
    }
    @JsonProperty("ri")
    public List<EC2RI> getEc2RI() {
        return ec2RI;
    }
    public void setEc2RI(List<EC2RI> ec2ri) {
        ec2RI = ec2ri;
    }
}
