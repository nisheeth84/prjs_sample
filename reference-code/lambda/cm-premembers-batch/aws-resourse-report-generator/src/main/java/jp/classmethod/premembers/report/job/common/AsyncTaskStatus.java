package jp.classmethod.premembers.report.job.common;

import org.springframework.stereotype.Component;

@Component
public class AsyncTaskStatus {

    private boolean error = false;

    public synchronized void setError() {
        this.error = true;
    }

    public boolean isError() {
        return this.error;
    }
}
