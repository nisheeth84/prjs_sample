package jp.co.softbrain.esales.commons.service;

import java.util.List;
import java.util.Map;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * Service validate Interface for validate input data
 */
@XRayEnabled
public interface ValidateService {

    /**
     * validate input data
     *
     * @param input : data need for validate
     * @param formatDate : data need for validate date or date time
     * @return List Error after validate
     */
    List<Map<String, Object>> validate(String input);
}
