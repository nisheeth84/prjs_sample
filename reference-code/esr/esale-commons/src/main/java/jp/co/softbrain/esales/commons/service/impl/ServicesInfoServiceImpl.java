package jp.co.softbrain.esales.commons.service.impl;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.domain.ServicesInfo;
import jp.co.softbrain.esales.commons.repository.ServicesInfoRepository;
import jp.co.softbrain.esales.commons.service.ServicesInfoService;
import jp.co.softbrain.esales.commons.service.dto.ServicesInfoOutDTO;
import jp.co.softbrain.esales.commons.service.mapper.ServicesInfoOutMapper;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;

/**
 * ServicesInfoServiceImpl
 *
 * @author HaiCN
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class ServicesInfoServiceImpl implements ServicesInfoService {

    @Autowired
    private ServicesInfoRepository servicesInfoRepository;

    @Autowired
    private ServicesInfoOutMapper servicesInfoOutMapper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.ServicesInfoService#
     * getServicesInfo(java.lang.Integer)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<ServicesInfoOutDTO> getServicesInfo(Integer serviceType) {
        Set<Integer> licenses = jwtTokenUtil.getLicenses();
        List<ServicesInfo> services = null;
        if (serviceType == null) {
            services = servicesInfoRepository.getAllAvailableServicesInfo();
        } else {
            services = servicesInfoRepository.getServicesInfo(serviceType);
        }
        services = services.stream().filter(service -> licenses.contains(service.getServiceId()))
                .collect(Collectors.toList());
        return servicesInfoOutMapper.toDto(services);
    }

}
