package com.viettel.vtpgw;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
@EntityScan(basePackages = "com.viettel.vtpgw.persistence.entity")
public class VtpgwApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(VtpgwApplication.class, args);
    }

}
