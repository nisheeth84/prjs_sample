package jp.classmethod.premembers.report.json.raw.ec2;

import java.util.List;

import com.amazonaws.services.ec2.model.Instance;
import com.amazonaws.services.ec2.model.ReservedInstances;
import com.amazonaws.services.ec2.model.Volume;
import com.fasterxml.jackson.annotation.JsonProperty;

public class EC2 {
    private List<Instance> running;
    private List<Instance> stop;
    private List<EC2ImageRaw> ami;
    private List<Volume> ebs;
    private List<EC2SnapshotRaw> snapshot;
    private List<ReservedInstances> ri;

    // Getter & Setter
    @JsonProperty("Running")
    public List<Instance> getRunning() {
        return running;
    }
    public void setRunning(List<Instance> running) {
        this.running = running;
    }
    @JsonProperty("Stop")
    public List<Instance> getStop() {
        return stop;
    }
    public void setStop(List<Instance> stop) {
        this.stop = stop;
    }
    @JsonProperty("AMI")
    public List<EC2ImageRaw> getAmi() {
        return ami;
    }
    public void setAmi(List<EC2ImageRaw> ami) {
        this.ami = ami;
    }
    @JsonProperty("EBS")
    public List<Volume> getEbs() {
        return ebs;
    }
    public void setEbs(List<Volume> ebs) {
        this.ebs = ebs;
    }
    @JsonProperty("Snapshot")
    public List<EC2SnapshotRaw> getSnapshot() {
        return snapshot;
    }
    public void setSnapshot(List<EC2SnapshotRaw> snapshot) {
        this.snapshot = snapshot;
    }
    @JsonProperty("RI")
    public List<ReservedInstances> getRi() {
        return ri;
    }
    public void setRi(List<ReservedInstances> ri) {
        this.ri = ri;
    }
}
