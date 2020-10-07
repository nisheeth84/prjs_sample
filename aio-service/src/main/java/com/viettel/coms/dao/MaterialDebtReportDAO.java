package com.viettel.coms.dao;

import java.math.BigDecimal;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.viettel.coms.bo.WorkItemBO;
import com.viettel.coms.dto.MaterialDebtReportDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

@Repository("materialDebtReportDAO")
public class MaterialDebtReportDAO extends BaseFWDAOImpl<WorkItemBO, Long>  {

	@Autowired
    private QuantityConstructionDAO quantityConstructionDAO;
	
	public MaterialDebtReportDAO() {
        this.model = new WorkItemBO();
    }

    public MaterialDebtReportDAO(Session session) {
        this.session = session;
    }
	
	public List<MaterialDebtReportDTO> doSearchQuantity(MaterialDebtReportDTO obj, List<String> groupIdList) {
       	StringBuilder sql = new StringBuilder("select a.SYS_GROUP_ID sysGroupId,"
       			+ "b.name sysGroupName, "
				+ "a.province_id provinceId,"
				+ "a.province_code provinceName,"
				+ "a.construction_code constructionCode,"
				+ "a.SYS_USER_ID sysUserId, "
				+ "c.employee_code||'-'||c.full_name sysUserName, "
				+ "case when a.type=1 then 'A cấp' else 'B cấp' end  sourceType, "
				+ "a.GOODS_CODE goodsCode,"
				+ "a.GOODS_NAME goodsName,"
				+ "case when a.goods_state=1 then 'Tốt' else 'Hỏng' end state,"
				+ "a.AMOUNT amount,"
				+ "a.GOODS_UNIT_NAME catUnitName,"
				+ "round(a.PRICE/1000000,2) totalMoney "
				+ "from syn_stock_total a, sys_group b,sys_user c "
				+ "where a.SYS_GROUP_ID=b.SYS_GROUP_ID "
				+ "and a.SYS_USER_ID = c.SYS_USER_ID " );
       	if(obj.getSysGroupId() != null)
       		sql.append( "and a.SYS_GROUP_ID= :sysGroupId ");
       	if(obj.getSysUserId() != null)
       		sql.append("and a.SYS_USER_ID= :sysUserId ");
       	if(obj.getProvinceId() != null)
       		sql.append("and a.province_id= :provinceId ");
       	if(obj.getConstructionCode() != null && obj.getConstructionCode().length()>0)
       		sql.append("and a.construction_code = :constructionCode ");
		sql.append("order by b.name,a.province_code");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());


    	if(obj.getSysGroupId() != null){
    		query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
    	}
       	if(obj.getSysUserId() != null){
       		query.setParameter("sysUserId", obj.getSysUserId());
            queryCount.setParameter("sysUserId", obj.getSysUserId());
       	}
       	if(obj.getProvinceId() != null){
       		query.setParameter("provinceId", obj.getProvinceId());
            queryCount.setParameter("provinceId", obj.getProvinceId());
       	}
       	if(obj.getConstructionCode() != null && obj.getConstructionCode().length()>0){
       		query.setParameter("constructionCode", obj.getConstructionCode());
            queryCount.setParameter("constructionCode", obj.getConstructionCode());
       	}
        

        query.addScalar("sysGroupName", new StringType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("provinceId", new LongType());
        query.addScalar("provinceName", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("totalMoney", new DoubleType());
        query.addScalar("sourceType", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("state", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("catUnitName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(MaterialDebtReportDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

//		hungnx 20180628 start
        List<MaterialDebtReportDTO> lst = query.list();
        return lst;
    }
}
