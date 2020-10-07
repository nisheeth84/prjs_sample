package com.viettel.coms.business;

import com.viettel.coms.bo.ConfigGroupProvinceBO;
import com.viettel.coms.dao.ConfigGroupProvinceDAO;
import com.viettel.coms.dto.ConfigGroupProvinceDTO;
import com.viettel.coms.dto.confingDto;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;

@Service("configGroupProvinceBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ConfigGroupProvinceBusinessImpl
        extends BaseFWBusinessImpl<ConfigGroupProvinceDAO, ConfigGroupProvinceDTO, ConfigGroupProvinceBO>
        implements ConfigGroupProvinceBusiness {
	
	@Context
	HttpServletRequest request;
	
    @Autowired
    private ConfigGroupProvinceDAO configGroupProvinceDAO;

    public ConfigGroupProvinceBusinessImpl() {
        tModel = new ConfigGroupProvinceBO();
        tDAO = configGroupProvinceDAO;
    }

    @Override
    public ConfigGroupProvinceDAO gettDAO() {
        return configGroupProvinceDAO;
    }

    @Override
    public long count() {
        return configGroupProvinceDAO.count("ConfigGroupProvinceBO", null);
    }

    public List<ConfigGroupProvinceDTO> getCatProvince() {
        // TODO Auto-generated method stub
        return configGroupProvinceDAO.getCatProvince();
    }

    public DataListDTO doSearchCatprovince(ConfigGroupProvinceDTO obj,HttpServletRequest request) {
        List<ConfigGroupProvinceDTO> ls = configGroupProvinceDAO.doSearchCatprovince(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

    public void saveCatProvince(confingDto obj) {
        List<ConfigGroupProvinceDTO> ls = obj.getWorkItemTypeList();
        configGroupProvinceDAO.DeleteCon(obj.getSysGroupId());
        for (ConfigGroupProvinceDTO dto : ls) {
            ConfigGroupProvinceDTO con = new ConfigGroupProvinceDTO();
            con.setSysGroupId(obj.getSysGroupId());
            con.setSysGroupName(obj.getSysGroupName());
            con.setCatProvinceCode(dto.getCatProvinceCode());
            con.setCatProvinceId(dto.getCatProvinceId());
            con.setCatProvinceName(dto.getCatProvinceName());
            configGroupProvinceDAO.saveObject(con.toModel());
        }
//		return null;
    }

    public Object removeCat(Long id) {
        // TODO Auto-generated method stub
        configGroupProvinceDAO.DeleteCon(id);
        return null;
    }

    public List<ConfigGroupProvinceDTO> getListCode(Long id) {
        List<ConfigGroupProvinceDTO> data = configGroupProvinceDAO.getListCode(id);
        return data;
    }

}
