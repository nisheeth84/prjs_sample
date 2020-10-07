package jp.co.softbrain.esales.uaa.graphql.query;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;

/**
 * {@link DumyQuery} class process GraphQL query
 *
 * @author Tuanlv
 * @see GraphQLQueryResolver
 */

@Component
@XRayEnabled
public class DumyQuery implements GraphQLQueryResolver {
    private final Logger log = LoggerFactory.getLogger(DumyQuery.class);

    /**
     * dumy
     */
    public String getDumy() {
        log.debug("API dumy");
        return "API dumy";
    }
}
