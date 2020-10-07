package com.viettel.aio.business;

import com.viettel.aio.dto.AIOCategoryProductDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.service.base.dto.DataListDTO;

import java.util.List;

public interface AIOCategoryProductBusiness {
    DataListDTO doSearch(AIOCategoryProductDTO criteria);

    Long saveCategoryProduct(AIOCategoryProductDTO obj, SysUserCOMSDTO sysUserDto);

    AIOCategoryProductDTO getCategoryProductById(Long id);

    void updateCategoryProduct(AIOCategoryProductDTO obj, SysUserCOMSDTO sysUserDto);

    List<AIOCategoryProductDTO> getAutoCompleteData(AIOCategoryProductDTO dto);

    void removeCategoryProduct(AIOCategoryProductDTO obj);

    int checkDuplicateCategoryProductName(String name);
}
