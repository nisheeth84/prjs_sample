package jp.co.softbrain.esales.uaa.interceptor;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;

import com.amazonaws.xray.spring.aop.AbstractXRayInterceptor;

/**
 * AWS X-Ray Inspector
 */
@Aspect
public class XRayInspector extends AbstractXRayInterceptor {

    public XRayInspector() {
        // do something
    }

    @Override
    @Pointcut("@within(com.amazonaws.xray.spring.aop.XRayEnabled)"
            + " && (bean(*Resource) || bean(*GraphQLHttpServlet))")
    public void xrayEnabledClasses() {
        // do something
    }

    @Override
    @Pointcut("execution(public !void org.springframework.data.repository.Repository+.*(..))"
            + " || execution(* jp.co.softbrain.esales.uaa.graphql..*(..))"
            + " || execution(* jp.co.softbrain.esales.uaa.service..*(..))"
            + " || execution(* jp.co.softbrain.esales.utils..*(..))")
    protected void springRepositories() {
        // do something
    }

}
