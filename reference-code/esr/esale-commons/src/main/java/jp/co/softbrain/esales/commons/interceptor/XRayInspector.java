package jp.co.softbrain.esales.commons.interceptor;

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
    @Pointcut("@within(com.amazonaws.xray.spring.aop.XRayEnabled)")
    public void xrayEnabledClasses() {
        // do something
    }

    @Override
    @Pointcut("execution(public !void org.springframework.data.repository.Repository+.*(..))"
            + " || execution(* jp.co.softbrain.esales.commons.web.rest..*(..))"
            + " || execution(* jp.co.softbrain.esales.commons.service..*(..))"
            + " || execution(* jp.co.softbrain.esales.utils..*(..))")
    protected void springRepositories() {
     // do something
    }

}
