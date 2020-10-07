package jp.co.softbrain.esales.customers.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.web.rest.vm.request.DownloadCustomersRequest;

/**
 * DownLoadCustomersService
 */
@XRayEnabled
public interface DownLoadCustomersService {

    /**
     * Download customers in list
     *
     * @param customerIds - list id to download
     * @param orderBy - key and value to sort
     * @return - path file CSV
     */
    public String downloadCustomers(DownloadCustomersRequest request);

}
