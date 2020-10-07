package com.base.service;

import org.springframework.security.core.Authentication;

public interface IAppAuthorizer {
        boolean authorize(Authentication authentication, String action, Object callerObj) throws Exception;
}
