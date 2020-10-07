package jp.co.softbrain.esales.customers.interceptor;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;

import com.amazonaws.xray.spring.aop.AbstractXRayInterceptor;

/**
 * AWS X-Ray Inspector
 */
@Aspect
public class XRayInspector extends AbstractXRayInterceptor {

    public XRayInspector() {
        // Do nothing
    }

    @Override
    @Pointcut("@within(com.amazonaws.xray.spring.aop.XRayEnabled) && (bean(*GraphQLHttpServlet))")
    public void xrayEnabledClasses() {
        // Do nothing
    }

    @Override
    @Pointcut("execution(public !void org.springframework.data.repository.Repository+.*(..))"
            + " || execution(* jp.co.softbrain.esales.customers.graphql..*(..))"
            + " || execution(* jp.co.softbrain.esales.customers.service..*(..))"
            + " || execution(* jp.co.softbrain.esales.utils..*(..))")
    protected void springRepositories() {
        // Do nothing
    }

}
