package jp.co.softbrain.esales.employees.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.oauth2.CognitoProperties;
import jp.co.softbrain.esales.employees.config.oauth2.OAuth2JwtAccessTokenConverter;
import jp.co.softbrain.esales.employees.config.oauth2.UserOnlineState;
import jp.co.softbrain.esales.utils.UserAccessUtils;

@Configuration
@EnableResourceServer
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfiguration extends ResourceServerConfigurerAdapter {

    private final CognitoProperties cognitoProperties;

    public SecurityConfiguration(CognitoProperties cognitoProperties) {
        this.cognitoProperties = cognitoProperties;
    }
    
    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
            .csrf()
            .disable()
            .headers()
            .frameOptions()
            .disable()
        .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
            .authorizeRequests()
            .antMatchers("/api/**").authenticated()
            .antMatchers("/auth/**").permitAll()
            .antMatchers("/public/**").permitAll()
            .antMatchers("/management/health").authenticated()
            .antMatchers("/management/info").authenticated()
            .antMatchers("/management/prometheus").authenticated()
            .antMatchers("/management/**").hasAuthority(Constants.Roles.ROLE_ADMIN);
    }

    @Bean
    public TokenStore tokenStore(JwtAccessTokenConverter jwtAccessTokenConverter) {
        return new JwtTokenStore(jwtAccessTokenConverter);
    }

    @Bean
    public JwtAccessTokenConverter jwtAccessTokenConverter(UserOnlineState userOnlineState) {
        return new OAuth2JwtAccessTokenConverter(cognitoProperties, userOnlineState);
    }

    @Bean
    public UserOnlineState userOnlineState() {
        return new UserOnlineState();
    }

    @Bean
    public UserAccessUtils userAccessUtils(RedisTemplate redisTemplate) {
        return new UserAccessUtils(redisTemplate);
    }
}
