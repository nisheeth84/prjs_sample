package jp.co.softbrain.esales.employees.interceptor;


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

    /** 
     * @see com.amazonaws.xray.spring.aop.AbstractXRayInterceptor#xrayEnabledClasses()
     */
    @Override
    @Pointcut("@within(com.amazonaws.xray.spring.aop.XRayEnabled)")
    public void xrayEnabledClasses() {
        // Do nothing
    }

    /** 
     * @see com.amazonaws.xray.spring.aop.AbstractXRayInterceptor#springRepositories()
     */
    @Override
    @Pointcut("execution(public !void org.springframework.data.repository.Repository+.*(..))"
            + " || execution(* jp.co.softbrain.esales.employees.web.rest..*(..))"
            + " || execution(* jp.co.softbrain.esales.employees.service..*(..))"
            + " || execution(* jp.co.softbrain.esales.utils..*(..))")
    protected void springRepositories() {
        // Do nothing
    }

}
