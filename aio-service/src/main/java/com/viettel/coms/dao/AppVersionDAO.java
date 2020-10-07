package com.viettel.coms.dao;

import com.viettel.coms.dto.AppVersionBO;
import com.viettel.coms.dto.AppVersionWorkItemDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("appVersionDAO")
public class AppVersionDAO extends BaseFWDAOImpl<AppVersionBO, Long> {
    public List<AppVersionWorkItemDTO> getVersionItem() {
        StringBuilder sql = new StringBuilder(
                "SELECT NAME AS version, DESCRIPTION link " + "FROM APP_PARAM " + "WHERE PAR_TYPE='MOBILE_VERSION'");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("version", new StringType());
        query.addScalar("link", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AppVersionWorkItemDTO.class));
        return query.list();
    }
}
