/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.aio.dao;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import com.viettel.aio.bo.AIOMerEntityBO;
import com.viettel.aio.dto.AIOMerEntityDTO;
import com.viettel.coms.utils.ValidateUtils;
import com.viettel.service.base.dao.BaseFWDAOImpl;

import fr.opensagres.xdocreport.utils.StringUtils;

/**
 * @author HOANM1
 * @version 1.0
 * @since 2019-03-10
 */
@Repository("aioMerEntityDAO")
public class AIOMerEntityDAO extends BaseFWDAOImpl<AIOMerEntityBO, Long> {

    public AIOMerEntityDAO() {
        this.model = new AIOMerEntityBO();
    }

    public AIOMerEntityDAO(Session session) {
        this.session = session;
    }
    
    public List<AIOMerEntityDTO> reportInvestoryProvince(AIOMerEntityDTO obj){
    	StringBuilder sql = new StringBuilder("SELECT s.CODE sysGroupCode, " + 
    			"  s.NAME sysGroupName, " + 
    			"  (s.CODE ||'-' || s.NAME) text, " + 
    			"  m.GOODS_CODE goodsCode, " + 
    			"  m.GOODS_NAME goodsName, " + 
    			"  m.CAT_UNIT_NAME catUnitName, " + 
    			"  SUM(m.AMOUNT) amount, " +
    			"  m.IMPORT_DATE importDate " + 
    			"  FROM CAT_STOCK c " + 
    			"  LEFT JOIN MER_ENTITY m " + 
    			"  ON c.CAT_STOCK_ID = m.STOCK_ID " + 
    			"  LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP s " + 
    			"  ON c.SYS_GROUP_ID       = s.SYS_GROUP_ID " + 
    			"  WHERE c.TYPE            = 4 " + 
    			"  AND c.LEVEL_STOCK      IN (2,3,4) "+
    			"  and c.CAT_STOCK_ID not in  (26396,29099) " + 
    			"  AND ( m.STATUS          = 4 " + 
    			"  OR (m.MER_ENTITY_ID    IN " + 
    			"  (SELECT MER_ENTITY_ID " + 
    			"  FROM STOCK_TRANS_DETAIL_SERIAL " + 
    			"  WHERE STOCK_TRANS_ID IN " + 
    			"    (SELECT STOCK_TRANS_ID " + 
    			"    FROM STOCK_TRANS " + 
    			"    WHERE TYPE        = 2 " + 
    			"    AND BUSINESS_TYPE in (8,12) " + 
    			"    AND (CONFIRM      is null OR CONFIRM      in (0,2))" + 
    			"    AND STATUS        = 2 " + 
    			"    ) " + 
    			"  ))) "); 
    	if(StringUtils.isNotEmpty(obj.getKeySearch())) {
    		sql.append(" AND (upper(m.GOODS_CODE) like upper(:keySearch) ");
            sql.append(" OR upper(m.GOODS_NAME) like upper(:keySearch) escape '&') ");
    	}
    	if(StringUtils.isNotEmpty(obj.getSysGroupCode())) {
    		sql.append(" AND upper(s.CODE) like upper(:sysGroupCode) ");
    	}
    			sql.append("  GROUP BY s.CODE, " + 
    			"  s.NAME, " + 
    			"  m.GOODS_CODE, " + 
    			"  m.GOODS_NAME, " + 
    			"  m.CAT_UNIT_NAME, " + 
    			"  m.IMPORT_DATE " + 
    			"  ORDER BY s.CODE, " + 
    			"  s.NAME, " + 
    			"  m.GOODS_CODE, " + 
    			"  m.GOODS_NAME, " + 
    			"  m.CAT_UNIT_NAME, " + 
    			"  m.IMPORT_DATE ");
    	SQLQuery query = getSession().createSQLQuery(sql.toString());
    	SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
    	
    	query.addScalar("sysGroupCode", new StringType());
    	query.addScalar("sysGroupName", new StringType());
    	query.addScalar("goodsCode", new StringType());
    	query.addScalar("goodsName", new StringType());
    	query.addScalar("catUnitName", new StringType());
    	query.addScalar("amount", new DoubleType());
    	query.addScalar("text", new StringType());
    	query.addScalar("importDate", new DateType());
    	
    	query.setResultTransformer(Transformers.aliasToBean(AIOMerEntityDTO.class));
    	
    	if(StringUtils.isNotEmpty(obj.getKeySearch())) {
    		query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
    		queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
    	}
    	if(StringUtils.isNotEmpty(obj.getSysGroupCode())) {
    		query.setParameter("sysGroupCode", obj.getSysGroupCode());
    		queryCount.setParameter("sysGroupCode", obj.getSysGroupCode());
    	}
    	
    	if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        
        return query.list();
    }
    
    public List<AIOMerEntityDTO> reportInvestoryDetail(AIOMerEntityDTO obj){
    	StringBuilder sql = new StringBuilder("SELECT s.CODE sysGroupCode, " + 
    			"  s.NAME sysGroupName, " + 
    			"  (s.CODE ||'-' || s.NAME) text, " + 
    			"  m.GOODS_CODE goodsCode, " + 
    			"  m.GOODS_NAME goodsName, " + 
    			"  m.CAT_UNIT_NAME catUnitName, " +
    			"  m.serial serial, " +
    			"  c.name stockName, " +
    			"  SUM(m.AMOUNT) amount, " +
    			"  m.IMPORT_DATE importDate " + 
    			"  FROM CAT_STOCK c " + 
    			"  LEFT JOIN MER_ENTITY m " + 
    			"  ON c.CAT_STOCK_ID = m.STOCK_ID " + 
    			"  LEFT JOIN CTCT_CAT_OWNER.SYS_GROUP s " + 
    			"  ON c.SYS_GROUP_ID       = s.SYS_GROUP_ID " + 
    			"  WHERE c.TYPE            = 4 " + 
    			"  AND c.LEVEL_STOCK      IN (1,2,3) " + 
    			"  AND ( m.STATUS          = 4 " + 
    			"  OR (m.MER_ENTITY_ID    IN " + 
    			"  (SELECT MER_ENTITY_ID " + 
    			"  FROM STOCK_TRANS_DETAIL_SERIAL " + 
    			"  WHERE STOCK_TRANS_ID IN " + 
    			"    (SELECT STOCK_TRANS_ID " + 
    			"    FROM STOCK_TRANS " + 
    			"    WHERE TYPE         = 2 " + 
    			"    AND BUSINESS_TYPE IN (8,12) " + 
    			"    AND CONFIRM       !=1 " + 
    			"    AND STATUS         = 2 " + 
    			"    ) " + 
    			"  )) " + 
    			"OR (m.MER_ENTITY_ID IN " + 
    			"  (SELECT MER_ENTITY_ID " + 
    			"  FROM STOCK_TRANS_DETAIL_SERIAL " + 
    			"  WHERE STOCK_TRANS_ID IN " + 
    			"    (SELECT STOCK_TRANS_ID " + 
    			"    FROM STOCK_TRANS " + 
    			"    WHERE TYPE              = 2 " + 
    			"    AND BUSINESS_TYPE       = 4 " + 
    			"    AND STATUS              = 2 " + 
    			"    AND STOCK_TRANS_ID NOT IN " + 
    			"      (SELECT FROM_STOCK_TRANS_ID FROM STOCK_TRANS " + 
    			"      ) " + 
    			"    ) " + 
    			"  ) )) "); 
    	if(StringUtils.isNotEmpty(obj.getKeySearch())) {
    		sql.append(" AND (upper(m.GOODS_CODE) like upper(:keySearch) ");
            sql.append(" OR upper(m.GOODS_NAME) like upper(:keySearch) escape '&') ");
    	}
    	if(StringUtils.isNotEmpty(obj.getSysGroupCode())) {
    		sql.append(" AND upper(s.CODE) like upper(:sysGroupCode) ");
    	}
    			sql.append("  GROUP BY s.CODE, " + 
    			"  s.NAME, " + 
    			"  m.GOODS_CODE, " + 
    			"  m.GOODS_NAME, " + 
    			"  m.CAT_UNIT_NAME, " + 
    			"  m.serial, " +
    			"  c.name, " +
    			"  m.IMPORT_DATE " + 
    			"  ORDER BY s.CODE, " + 
    			"  s.NAME, " + 
    			"  m.GOODS_CODE, " + 
    			"  m.GOODS_NAME, " + 
    			"  m.CAT_UNIT_NAME," +
    			"  m.serial, " +
    			"  c.name, " +
    			"  m.IMPORT_DATE ");
    	SQLQuery query = getSession().createSQLQuery(sql.toString());
    	SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
    	
    	query.addScalar("sysGroupCode", new StringType());
    	query.addScalar("sysGroupName", new StringType());
    	query.addScalar("goodsCode", new StringType());
    	query.addScalar("goodsName", new StringType());
    	query.addScalar("catUnitName", new StringType());
    	query.addScalar("amount", new DoubleType());
    	query.addScalar("text", new StringType());
    	query.addScalar("importDate", new DateType());
    	query.addScalar("serial", new StringType());
    	query.addScalar("stockName", new StringType());
    	
    	query.setResultTransformer(Transformers.aliasToBean(AIOMerEntityDTO.class));
    	
    	if(StringUtils.isNotEmpty(obj.getKeySearch())) {
    		query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
    		queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
    	}
    	if(StringUtils.isNotEmpty(obj.getSysGroupCode())) {
    		query.setParameter("sysGroupCode", obj.getSysGroupCode());
    		queryCount.setParameter("sysGroupCode", obj.getSysGroupCode());
    	}
    	
    	if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        
        return query.list();
    }
}
