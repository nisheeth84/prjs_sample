package jp.co.softbrain.esales.employees.config;

import java.util.LinkedHashMap;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;

import jp.co.softbrain.esales.config.Constants;

@Configuration
public class RedisConfiguration {
    @Value("${redis.host}")
    private String redisHost;

    @Bean
    public LettuceConnectionFactory lettuceConnectionFactory() {
        String host = "localhost";
        int port = 6379;
        if (StringUtils.isNotEmpty(redisHost)) {
            String[] redis = redisHost.split(":");
            host = redis[0];
            port = Integer.parseInt(redis[1]);
        }
        return new LettuceConnectionFactory(new RedisStandaloneConfiguration(host, port));
    }

    @Bean
    @Primary
    public RedisTemplate<String, Object> redisTemplate(LettuceConnectionFactory lettuceConnectionFactory) {
        
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.opsForHash().putAll(Constants.REDIS_USER_ACCESS_KEY, new LinkedHashMap<>(64, 0.75f));
        template.setConnectionFactory(lettuceConnectionFactory);
        return template;
    }
}
