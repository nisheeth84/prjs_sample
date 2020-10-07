package com.viettel.coms.dao;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import com.viettel.coms.bo.UserConfigBO;
import com.viettel.coms.dto.UserConfigDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

@Repository("userConfigDAO")
public class UserConfigDAO extends BaseFWDAOImpl<UserConfigBO, Long>{
	public UserConfigDAO() {
		this.model = new UserConfigBO();
	}

	public UserConfigDAO(Session session) {
		this.session = session;
	}
	
	public UserConfigDTO findByUser(String value) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.USER_CONFIG_ID userConfigId ");
		stringBuilder.append(",T1.SYS_USER_ID sysUserId ");
		stringBuilder.append(",T1.VOFFICE_PASS vofficePass ");
		stringBuilder.append(",T1.VOFFICE_USER vofficeUser ");

		stringBuilder.append("FROM USER_CONFIG T1 ");
		stringBuilder.append("WHERE upper(T1.VOFFICE_USER) = upper(:value)");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("userConfigId", new LongType());
		query.addScalar("sysUserId", new LongType());
		query.addScalar("vofficePass", new StringType());
		query.addScalar("vofficeUser", new StringType());

		query.setParameter("value", value);
		query.setResultTransformer(Transformers.aliasToBean(UserConfigDTO.class));

		return (UserConfigDTO) query.uniqueResult();
	}
	
	public UserConfigDTO findBySysUserId(Long sysUserId) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.USER_CONFIG_ID userConfigId ");
		stringBuilder.append(",T1.SYS_USER_ID sysUserId ");
		stringBuilder.append(",T1.VOFFICE_PASS vofficePass ");
		stringBuilder.append(",T1.VOFFICE_USER vofficeUser ");

		stringBuilder.append("FROM USER_CONFIG T1 ");
		stringBuilder.append("WHERE SYS_USER_ID = :sysUserId and rownum = 1");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("userConfigId", new LongType());
		query.addScalar("sysUserId", new LongType());
		query.addScalar("vofficePass", new StringType());
		query.addScalar("vofficeUser", new StringType());

		query.setParameter("sysUserId", sysUserId);
		query.setResultTransformer(Transformers.aliasToBean(UserConfigDTO.class));

		return (UserConfigDTO) query.uniqueResult();
	}
	
	public UserConfigDTO getUserConfigId() {
		StringBuilder stringBuilder = new StringBuilder("select USER_CONFIG_SEQ.nextval userConfigId from dual ");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("userConfigId", new LongType());

		query.setResultTransformer(Transformers.aliasToBean(UserConfigDTO.class));

		return (UserConfigDTO) query.uniqueResult();
	}
	
	public UserConfigDTO getSysUser(String email) {
		StringBuilder stringBuilder = new StringBuilder("SELECT SS.SYS_USER_ID sysUserId FROM SYS_USER SS WHERE 1=1 ");
		if(email != null){
			stringBuilder.append("AND SS.EMAIL=:email ");
		}

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("sysUserId", new LongType());
		if(email != null){
			query.setParameter("email", email);
		}
		query.setResultTransformer(Transformers.aliasToBean(UserConfigDTO.class));

		return (UserConfigDTO) query.uniqueResult();
	}
}
