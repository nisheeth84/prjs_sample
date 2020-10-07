package com.viettel.aio.dto.payment;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.io.Serializable;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOPaymentBaseResponse implements Serializable {

}
