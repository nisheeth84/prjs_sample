package com.viettel.coms.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DmpnOrderDetailDTO extends DmpnOrderDTO {

    /**
     *
     */
    private static final long serialVersionUID = -6551645706000717462L;
    private Long fwmodelId;
}
