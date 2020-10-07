package jp.classmethod.premembers.report.job.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

@Component
@EnableAsync // 非同期処理有効化
public class AsyncConfig {
    @Value("${threadPool.max.size}")
    private int threadPoolMaxSize;
    @Value("${threadPool.queue.capacity}")
    private int threadPoolQueueCapacity;
    @Value("${threadPool.timeout.minutes}")
    private int threadPoolTimeoutMinutes;

    @Bean("threadPool")
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        return config(executor);
    }

    private ThreadPoolTaskExecutor config(ThreadPoolTaskExecutor executor) {
        executor.initialize();
        executor.setCorePoolSize(threadPoolMaxSize);
        executor.setMaxPoolSize(threadPoolMaxSize);
        executor.setQueueCapacity(threadPoolQueueCapacity);
        executor.setAwaitTerminationSeconds(60 * threadPoolTimeoutMinutes);
        executor.setWaitForTasksToCompleteOnShutdown(true);
        return executor;
    }
}
