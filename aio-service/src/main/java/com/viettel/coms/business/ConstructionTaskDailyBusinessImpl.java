package com.viettel.coms.business;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.viettel.coms.bo.ConstructionTaskDailyBO;
import com.viettel.coms.dao.ConstructionTaskDailyDAO;
import com.viettel.coms.dto.ConstructionTaskDailyDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;
import com.viettel.coms.utils.PermissionUtils;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.Constant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

@Service("constructionTaskDailyBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ConstructionTaskDailyBusinessImpl
        extends BaseFWBusinessImpl<ConstructionTaskDailyDAO, ConstructionTaskDailyDTO, ConstructionTaskDailyBO>
        implements ConstructionTaskDailyBusiness {

    @Autowired
    private ConstructionTaskDailyDAO constructionTaskDailyDAO;

    public ConstructionTaskDailyBusinessImpl() {
        tModel = new ConstructionTaskDailyBO();
        tDAO = constructionTaskDailyDAO;
    }

    @Override
    public ConstructionTaskDailyDAO gettDAO() {
        return constructionTaskDailyDAO;
    }

    @Override
    public long count() {
        return constructionTaskDailyDAO.count("ConstructionTaskDailyBO", null);
    }
    /**Hoangnh start 15022019**/
    public Long updateConstructionTaskDaily(ConstructionTaskDailyDTO req){
    	Long id = 0L;
    	id = constructionTaskDailyDAO.updateObject(req.toModel());
    	return id;
    }
    
    public Long saveConstructionTaskDaily(ConstructionTaskDailyDTO req){
    	Long id = 0L;
    	id = constructionTaskDailyDAO.saveObject(req.toModel());
    	return id;
    }
    
    public DataListDTO doSearch(ConstructionTaskDailyDTO obj) {
    	List<ConstructionTaskDailyDTO> ls = constructionTaskDailyDAO.doSearch(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }
    /**Hoangnh end 15022019**/
}
