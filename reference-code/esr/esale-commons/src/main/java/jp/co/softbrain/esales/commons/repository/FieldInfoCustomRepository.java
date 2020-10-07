package jp.co.softbrain.esales.commons.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.FieldRelationItem1DTO;

/**
 * Spring Data repository for the FieldInfo entity.
 */
@Repository
@XRayEnabled
public interface FieldInfoCustomRepository {

    /**
     * get FieldRelation By FieldBelong
     * 
     * @param fieldBelong
     * @return
     */
    List<FieldRelationItem1DTO> getFieldRelationByFieldBelong(Integer fieldBelong);
}
