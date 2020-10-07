package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOSysGroupBO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@EnableTransactionManagement
@Transactional
@Repository("aioSysGroupDAO")
public class AIOSysGroupDAO extends BaseFWDAOImpl<AIOSysGroupBO, Long> {
    public AIOSysGroupBO findItemId(Long sysGroupId){
        return (AIOSysGroupBO)this.getSession().get(AIOSysGroupBO.class,sysGroupId);
    }


    public List<AIOSysGroupBO> getListSysGroup(Long sysGroupId){
        AIOSysGroupBO aioSysGroupBO=findItemId(sysGroupId);
        if(aioSysGroupBO!=null){
            Query query=this.getSession().createQuery("from AIOSysGroupBO where parentId=:parentId");
            query.setParameter("parentId",aioSysGroupBO.getParentId());
            return query.list();
        }

        return null;
    }

    public AIOSysGroupBO findItem(String name){
        Query query=this.getSession().createQuery("from AIOSysGroupBO where name=:name");
        query.setParameter("name",name);
        if (query.list()!=null&&!query.list().isEmpty()){
            return (AIOSysGroupBO)query.list().get(0);
        }

        return null;
    }

}
