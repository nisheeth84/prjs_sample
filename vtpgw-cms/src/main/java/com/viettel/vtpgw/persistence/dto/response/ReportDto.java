package com.viettel.vtpgw.persistence.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Getter
@Setter
public class ReportDto {

    private Integer id;

    private String appId;

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date executionTime;

    @NotNull(message = "Response time is required")
    private Integer responseTime;

    @NotEmpty(message = "Status code time is required")
    private Integer statusCode;

    @NotNull(message = "Request content time is required")
    private String requestContent;

    @NotNull(message = "Response content time is required")
    private String responseContent;

    @NotNull(message = "Service name time is required")
    private String serviceName;

    @NotNull(message = "Note url time is required")
    private String nodeUrl;
}
