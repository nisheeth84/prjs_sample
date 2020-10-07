package com.viettel.aio.dao;


import com.viettel.aio.dto.AppParamDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.aio.bo.AppParamBO;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("AIOappParamDAO")
public class AppParamDAO extends BaseFWDAOImpl<AppParamBO, Long> {

	public AppParamDAO() {
        this.model = new AppParamBO();
    }

    public AppParamDAO(Session session) {
        this.session = session;
    }
    
    public List<AppParamDTO> doSearch(AppParamDTO criteria) {
		StringBuilder stringBuilder = getSelectAllQuery();
		if (StringUtils.isNotEmpty(criteria.getParType())) {
			stringBuilder.append(" and  T1.par_type = :parType");
		}
		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			stringBuilder.append(" and ( upper(T1.code) like upper(:key) or upper(T1.name) like upper(:key))");
		}
		stringBuilder.append(" order by T1.par_order");
		SQLQuery query= getSession().createSQLQuery(stringBuilder.toString());
		query.addScalar("appParamId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));
		if (StringUtils.isNotEmpty(criteria.getParType())) {
			query.setParameter("parType", criteria.getParType());
		}
		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
			query.setParameter("key","%" + criteria.getKeySearch() + "%");
		}
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize().intValue());
		}
		
    	return query.list();
	}

	private StringBuilder getSelectAllQuery() {
		StringBuilder stringBuilder = new StringBuilder("select T1.app_param_id appParamId, T1.code, T1.name from app_param T1"
				+ " where 1=1 and T1.status=1");
		return stringBuilder;
	}
}
