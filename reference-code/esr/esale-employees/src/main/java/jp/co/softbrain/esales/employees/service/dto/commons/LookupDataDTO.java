package jp.co.softbrain.esales.employees.service.dto.commons;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO use to customize response fields getting from field_info_tem entity
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class LookupDataDTO implements Serializable {

    /**
     * the serialVersionUID
     */
    private static final long serialVersionUID = -1664675448585007704L;

    
    /**
     * extensionBelong
     */
    @JsonAlias("field_belong")
    private Integer fieldBelong;

    /**
     * searchKey
     */
    @JsonAlias("search_key")
    private Long searchKey;

    /**
     * itemReflect
     */
    @JsonAlias("item_reflect")
    @JsonProperty("itemReflect")
    private List<ItemReflectDTO> itemReflect = new ArrayList<>();

}
