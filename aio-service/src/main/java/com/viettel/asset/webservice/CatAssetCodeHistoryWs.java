package com.viettel.asset.webservice;

import com.viettel.asset.dto.CatAssetCodeHistoryRequest;
import com.viettel.asset.dto.CatAssetCodeHistoryResponse;

import javax.jws.WebService;

@org.apache.cxf.feature.Features(features = "org.apache.cxf.feature.LoggingFeature")
@WebService(targetNamespace = "http://webservice.asset.viettel.com/")
public interface CatAssetCodeHistoryWs {

    CatAssetCodeHistoryResponse getCatAssetCodeHistory(CatAssetCodeHistoryRequest request);
}
