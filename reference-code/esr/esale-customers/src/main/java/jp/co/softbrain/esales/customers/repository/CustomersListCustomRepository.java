package jp.co.softbrain.esales.customers.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.service.dto.GetInformationOfListDTO;

/**
 * CustomersListRepository
 *
 * @author lequyphuc
 */
@XRayEnabled
@Repository
public interface CustomersListCustomRepository {

    /**
     * getImformationOfList
     *
     * @pram customerListId condition to get data
     * @return List<GetInformationOfListDTO> - list data
     */
    public List<GetInformationOfListDTO> getInformationOfList(Long customerListId);

}
