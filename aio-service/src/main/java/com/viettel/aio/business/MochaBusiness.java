package com.viettel.aio.business;

import java.util.List;

public interface MochaBusiness {

    Long sendMochaSms(List<String> phoneNumbers, String content);

    Long sendMochaSms(String phoneNumber, String content);
}
