package jp.classmethod.premembers.report.util;

public class PremembersUtil {
    public static String getStackTrace(Throwable throwable) {
        StackTraceElement[] stacks = throwable.getStackTrace();
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("%s: %s", throwable.getClass().getName(), throwable.getMessage()));
        for (StackTraceElement e : stacks) {
            sb.append(String.format("\n\tat %s.%s(%s:%s)", e.getClassName(), e.getMethodName(), e.getFileName(),
                    e.getLineNumber()));
        }
        return sb.toString();
    }
}
