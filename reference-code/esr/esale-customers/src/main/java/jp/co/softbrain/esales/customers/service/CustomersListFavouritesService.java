package jp.co.softbrain.esales.customers.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * CustomersListFavouritesService
 *
 * @author lequyphuc
 */

@XRayEnabled
public interface CustomersListFavouritesService {

    /**
     * addToListFavourite : add customer to List favourite
     *
     * @pram customerListId : param get from request
     * @return customerListFavouriteId added
     */
    public Long addToListFavourite(Long customerListId);

    /**
     * @pram customerListId : customerListId get from request
     * @return Long customerListId deleteed
     */
    public Long removeFavouriteList(Long customerListId);
}
