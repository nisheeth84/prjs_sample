package com.viettel.aio.service;

import com.viettel.aio.request.RequestMsg;
import com.viettel.aio.response.ResponseMsg;

public interface AIOServiceBase {
    public ResponseMsg doAction(RequestMsg requestMsg) throws Exception;
}
