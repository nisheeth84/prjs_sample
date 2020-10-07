package jp.co.softbrain.esales.commons.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.web.rest.vm.ImportInfoResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.request.ImportRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.ProcessImportRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.ProcessImportResponse;

@XRayEnabled
public interface ImportService {


    ImportInfoResponse processImport(ImportRequest importRequest);
    
    /**
     * process Import API
     * @param req
     * @return res
     */
    ProcessImportResponse processImport(ProcessImportRequest req);

    ImportInfoResponse stopSimulation();

}
