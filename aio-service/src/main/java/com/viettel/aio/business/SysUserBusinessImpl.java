package com.viettel.aio.business;

import com.viettel.aio.bo.SysUserBO;
import com.viettel.aio.dao.SysUserDAO;
import com.viettel.aio.dto.SysUserDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;


@Service("AIOsysUserBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class SysUserBusinessImpl extends BaseFWBusinessImpl<SysUserDAO, SysUserDTO, SysUserBO> implements SysUserBusiness {

    @Autowired
    private SysUserDAO sysUserDAO;
     
    public SysUserBusinessImpl() {
        tModel = new SysUserBO();
        tDAO = sysUserDAO;
    }

    @Override
    public SysUserDAO gettDAO() {
        return sysUserDAO;
    }
	
//	@Override
//	public SysUserDTO findByLoginName(String name) {
//		return sysUserDAO.findByLoginName(name);
//	}
//
//	@Override
//	public List<SysUserDTO> doSearch(SysUserDTO obj) {
//		return sysUserDAO.doSearch(obj);
//	}
	
	@Override
	public List<SysUserDTO> getForAutoComplete(SysUserDTO query) {
		return sysUserDAO.getForAutoComplete(query);
	}

//	public String delete(List<Long> ids, String tableName, String tablePrimaryKey) {
//		return sysUserDAO.delete(ids, tableName, tablePrimaryKey);
//	}
	
	
//	public SysUserDTO getById(Long id) {
//		return sysUserDAO.getById(id);
//	}
////  hoanm1_20180916_start
//  public int RegisterLoginWeb(SysUserDTO userDto) {
//      try {
//          return sysUserDAO.RegisterLoginWeb(userDto);
//      } catch (ParseException e) {
//          // TODO Auto-generated catch block
//          e.printStackTrace();
//      }
//      return 0;
//  }
//  hoanm1_20180916_end
}
