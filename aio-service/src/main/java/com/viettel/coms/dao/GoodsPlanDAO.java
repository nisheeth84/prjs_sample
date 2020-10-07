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
import org.springframework.stereotype.Repository;

import com.viettel.asset.dto.SysGroupDto;
import com.viettel.coms.bo.GoodsPlanBO;
import com.viettel.coms.dto.AssetManagementRequestDetailDTO;
import com.viettel.coms.dto.GoodsPlanDTO;
import com.viettel.coms.dto.GoodsPlanDetailDTO;
import com.viettel.coms.dto.RequestGoodsDTO;
import com.viettel.coms.dto.RequestGoodsDetailDTO;
import com.viettel.coms.dto.SignVofficeDTO;
import com.viettel.coms.utils.ValidateUtils;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

@Repository("goodsPlanDAO")
public class GoodsPlanDAO extends BaseFWDAOImpl<GoodsPlanBO, Long> {
	public GoodsPlanDAO() {
		this.model = new GoodsPlanBO();
	}

	public GoodsPlanDAO(Session session) {
		this.session = session;
	}
	
	@SuppressWarnings("unchecked")
	public List<GoodsPlanDetailDTO> doSearch(GoodsPlanDTO obj){
		StringBuilder sql = new StringBuilder("SELECT GD.GOODS_PLAN_DETAIL_ID goodsPlanDetailId,"
				+ "GD.GOODS_PLAN_ID goodsPlanId,"
				+ "GD.REQUEST_GOODS_ID requestGoodsId,"
				+ "GD.REQUEST_GOODS_DETAIL_ID requestGoodsDetailId,"
				+ "GD.CONSTRUCTION_ID constructionId,"
				+ "GD.CONSTRUCTION_CODE constructionCode,"
				+ "GD.CNT_CONTRACT_ID cntContractId,"
				+ "GD.CNT_CONTRACT_CODE cntContractCode,"
				+ "GD.GOODS_NAME goodsName,"
				+ "GD.CAT_UNIT_ID catUnitId,"
				+ "GD.CAT_UNIT_NAME catUnitName,"
				+ "GD.QUANTITY quantity,"
				+ "GD.EXPECTED_DATE expectedDate,"
				+ "GD.DESCRIPTION description,"
				+ "GD.REAL_IE_TRANS_DATE realIeTransDate "
				+ "FROM GOODS_PLAN_DETAIL GD WHERE GOODS_PLAN_ID=:goodsPlanId ");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		query.addScalar("goodsPlanDetailId", new LongType());
		query.addScalar("goodsPlanId", new LongType());
		query.addScalar("requestGoodsId", new LongType());
		query.addScalar("requestGoodsDetailId", new LongType());
		query.addScalar("constructionId", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("cntContractCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("catUnitId", new LongType());
		query.addScalar("catUnitName", new StringType());
		query.addScalar("quantity", new LongType());
		query.addScalar("expectedDate", new DateType());
		query.addScalar("description", new StringType());
		query.addScalar("realIeTransDate", new StringType());
		
		query.setResultTransformer(Transformers.aliasToBean(GoodsPlanDetailDTO.class));
		
		query.setParameter("goodsPlanId", obj.getGoodsPlanId());
		queryCount.setParameter("goodsPlanId", obj.getGoodsPlanId());
		if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

		return query.list();
	}
	
	@SuppressWarnings("unchecked")
	public List<RequestGoodsDTO> doSearchPopupGoodsPlan(GoodsPlanDTO obj){
		StringBuilder sql = new StringBuilder("SELECT DISTINCT RG.REQUEST_GOODS_ID requestGoodsId,"
				+ "RG.SYS_GROUP_ID sysGroupId,"
				+ "RG.CONSTRUCTION_ID constructionId,"
				+ "RG.CONSTRUCTION_CODE constructionCode,"
				+ "RG.CNT_CONTRACT_ID cntContractId,"
				+ "RG.CNT_CONTRACT_CODE cntContractCode,"
				+ "RG.CREATED_DATE createdDate,"
				+ "RG.DESCRIPTION description,"
				+ "SS.NAME sysGroupName "
				+ "FROM REQUEST_GOODS RG "
				+ "LEFT JOIN SYS_GROUP SS ON SS.SYS_GROUP_ID=RG.SYS_GROUP_ID "
				+ "LEFT JOIN REQUEST_GOODS_DETAIL RGD ON RG.REQUEST_GOODS_ID=RGD.REQUEST_GOODS_ID "
				+ "WHERE 1=1 "
				+ "AND RGD.REQUEST_GOODS_ID NOT IN (SELECT REQUEST_GOODS_ID FROM GOODS_PLAN_DETAIL) ");
		if(obj.getCntContractCode() != null){
			sql.append("AND RG.CNT_CONTRACT_CODE =:cntContractCode ");
		}
		if(obj.getConstructionId() != null){
			sql.append("AND RG.CONSTRUCTION_ID =:constructionId ");
		}
		if(obj.getSysGroupId() != null){
			sql.append("AND RG.SYS_GROUP_ID=:sysGroupId ");
		}
		if(obj.getCatProvinceId() != null){
			sql.append("AND RG.CAT_PROVINCE_ID=:catProvinceId ");
		}
		if(obj.getToStartDate() != null){
			sql.append("AND TRUNC(RG.CREATED_DATE) >=:startDate ");
		}
		if(obj.getToEndDate() != null){
			sql.append("AND TRUNC(RG.CREATED_DATE) <=:endDate ");
		}
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		
		query.addScalar("requestGoodsId", new LongType());
		query.addScalar("sysGroupId", new LongType());
		query.addScalar("constructionId", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("cntContractCode", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("description", new StringType());
		query.addScalar("sysGroupName", new StringType());
		query.setResultTransformer(Transformers.aliasToBean(RequestGoodsDTO.class));
		
		if(obj.getCntContractCode() != null){
			query.setParameter("cntContractCode", obj.getCntContractCode());
			queryCount.setParameter("cntContractCode", obj.getCntContractCode());
		}
		if(obj.getConstructionId() != null){
			query.setParameter("constructionId", obj.getConstructionId());
			queryCount.setParameter("constructionId", obj.getConstructionId());
		}
		if(obj.getSysGroupId() != null){
			query.setParameter("sysGroupId", obj.getSysGroupId());
			queryCount.setParameter("sysGroupId", obj.getSysGroupId());
		}
		if(obj.getCatProvinceId() != null){
			query.setParameter("catProvinceId", obj.getCatProvinceId());
			queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
		}
		if(obj.getToStartDate() != null){
			query.setParameter("startDate", obj.getToStartDate());
			queryCount.setParameter("startDate", obj.getToStartDate());
		}
		if(obj.getToEndDate() != null){
			query.setParameter("endDate", obj.getToEndDate());
			queryCount.setParameter("endDate", obj.getToEndDate());
		}
		if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		
		return query.list();
	}
	
	@SuppressWarnings("unchecked")
	public List<SysGroupDto> doSearchSysGroup(GoodsPlanDTO obj){
		StringBuilder sql = new StringBuilder("SELECT DISTINCT SYS_GROUP_ID sysGroupId,"
				+ "CODE sysGroupCode,"
				+ "NAME name FROM SYS_GROUP where 1=1 and ROWNUM < 11 ");
		if(StringUtils.isNotBlank(obj.getKeySearch())){
			sql.append("AND upper(CODE) like upper(:keySearch) OR upper(NAME) like upper(:keySearch) ");
		}
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("sysGroupId", new LongType());
		query.addScalar("sysGroupCode", new StringType());
		query.addScalar("name", new StringType());
		
		query.setResultTransformer(Transformers.aliasToBean(SysGroupDto.class));
		if(StringUtils.isNotBlank(obj.getKeySearch())){
			query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
		}
		return query.list();
	}
	
	@SuppressWarnings("unchecked")
	public List<RequestGoodsDetailDTO> doSearchReqGoodsDetail(GoodsPlanDTO obj){
		StringBuilder sql = new StringBuilder("SELECT RD.REQUEST_GOODS_DETAIL_ID requestGoodsDetailId, "
				+ "RD.REQUEST_GOODS_ID requestGoodsId,"
				+ "RD.GOODS_NAME goodsName,"
				+ "RD.QUANTITY quantity,"
				+ "RD.CAT_UNIT_ID catUnitId,"
				+ "RD.CAT_UNIT_NAME catUnitName,"
				+ "RD.SUGGEST_DATE suggestDate,"
//				+ "RD.DESCRIPTION description,"
				+ "RG.CONSTRUCTION_ID constructionId,"
				+ "RG.CONSTRUCTION_CODE constructionCode,"
				+ "RG.CNT_CONTRACT_ID cntContractId,"
				+ "RG.CNT_CONTRACT_CODE cntContractCode "
				+ "FROM REQUEST_GOODS_DETAIL RD LEFT JOIN REQUEST_GOODS RG ON RD.REQUEST_GOODS_ID = RG.REQUEST_GOODS_ID "
				+ "WHERE RD.REQUEST_GOODS_ID =:requestGoodsId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("requestGoodsId", obj.getRequestGoodsId());
		query.addScalar("requestGoodsDetailId", new LongType());
		query.addScalar("requestGoodsId", new LongType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("quantity", new DoubleType());
		query.addScalar("catUnitId", new LongType());
		query.addScalar("catUnitName", new StringType());
		query.addScalar("suggestDate", new DateType());
//		query.addScalar("description", new StringType());
		query.addScalar("constructionId", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("cntContractCode", new StringType());
		query.setResultTransformer(Transformers.aliasToBean(RequestGoodsDetailDTO.class));		
		return query.list();
	}
	
	public GoodsPlanDTO findByCode(String code){
		StringBuilder sql = new StringBuilder("SELECT GOODS_PLAN_ID goodsPlanId,CODE code FROM GOODS_PLAN WHERE CODE=:code AND ROWNUM < 2 ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("goodsPlanId", new LongType());
		query.addScalar("code", new StringType());

		query.setResultTransformer(Transformers.aliasToBean(GoodsPlanDTO.class));
		query.setParameter("code", code);
		return (GoodsPlanDTO) query.uniqueResult();
	}
	
	@SuppressWarnings("unchecked")
	public List<GoodsPlanDTO> doSearchAll(GoodsPlanDTO obj) {
		StringBuilder sql = new StringBuilder("SELECT T.GOODS_PLAN_ID goodsPlanId,"
				+ "T.CODE code,"
				+ "T.NAME name,"
				+ "T.CREATED_DATE createdDate,"
				+ "T.BASE_CONTENT baseContent,"
				+ "T.PERFORM_CONTENT performContent,"
				+ "T.STATUS status,"
				+ "T.SIGN_STATE signState,"
				+ "T.CREATED_USER_ID createdUserId "
				+ "FROM GOODS_PLAN T WHERE T.STATUS != 0 ");
		
		if (StringUtils.isNotEmpty(obj.getCode())) {
			sql.append(" AND (upper(T.CODE) LIKE upper(:code) OR upper(T.NAME) LIKE upper(:code) escape '&')");
		}
		if(obj.getSignVO() != null){
			if(obj.getSignVO().size() >0){
				sql.append(" AND T.SIGN_STATE IN (:signVO)");
			}
		}
		if(obj.getStartDate() != null){
			sql.append(" AND TRUNC(T.CREATED_DATE) >=:startDate ");
		}
		if(obj.getEndDate() != null){
			sql.append(" AND TRUNC(T.CREATED_DATE) <=:endDate ");
		}
		sql.append(" ORDER BY T.GOODS_PLAN_ID DESC ");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("goodsPlanId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("baseContent", new StringType());
		query.addScalar("performContent", new StringType());
		query.addScalar("status", new StringType());
		query.addScalar("signState", new StringType());
		query.addScalar("createdUserId", new LongType());

		query.setResultTransformer(Transformers.aliasToBean(GoodsPlanDTO.class));
		if (StringUtils.isNotEmpty(obj.getCode())) {
			query.setParameter("code", "%" + ValidateUtils.validateKeySearch(obj.getCode()) + "%");
			queryCount.setParameter("code", "%" + ValidateUtils.validateKeySearch(obj.getCode()) + "%");
		}
		if(obj.getSignVO() != null){
			if(obj.getSignVO().size() >0){
				query.setParameterList("signVO", obj.getSignVO());
				queryCount.setParameterList("signVO", obj.getSignVO());
			}
		}
		if(obj.getStartDate() != null){
			query.setParameter("startDate", obj.getStartDate());
			queryCount.setParameter("startDate", obj.getStartDate());
		}
		if(obj.getEndDate() != null){
			query.setParameter("endDate", obj.getEndDate());
			queryCount.setParameter("endDate", obj.getEndDate());
		}
		
		if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

		return query.list();
	}
	
	public Long remove(GoodsPlanDTO obj){
		StringBuilder sql = new StringBuilder("UPDATE GOODS_PLAN SET STATUS=0 WHERE GOODS_PLAN_ID=:goodsPlanId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("goodsPlanId", obj.getGoodsPlanId());
		return (long) query.executeUpdate();
	}
	
	public Long deleteGoodsPlanDetail(GoodsPlanDTO obj){
		StringBuilder sql = new StringBuilder("DELETE GOODS_PLAN_DETAIL WHERE GOODS_PLAN_ID=:goodsPlanId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("goodsPlanId", obj.getGoodsPlanId());
		return (long) query.executeUpdate();
	}
	
	@SuppressWarnings("unchecked")
	public List<SysUserDTO> filterSysUser(GoodsPlanDTO obj){
		StringBuilder sql = new StringBuilder("SELECT SU.SYS_USER_ID sysUserId,"
				+ "SU.FULL_NAME fullName,"
				+ "SU.EMPLOYEE_CODE employeeCode,"
				+ "SU.EMAIL email,"
				+ "SU.SYS_GROUP_ID sysGroupId "
				+ "FROM SYS_USER SU WHERE 1=1 AND SU.STATUS=1 AND ROWNUM < 11 ");
		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			sql.append(" AND (UPPER(SU.FULL_NAME) LIKE UPPER(:keySearch) ESCAPE '&' OR UPPER(SU.EMPLOYEE_CODE) LIKE UPPER(:keySearch) ESCAPE '&'  OR UPPER(SU.EMAIL) LIKE UPPER(:keySearch) ESCAPE '&')");
		}
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("sysUserId", new LongType());
		query.addScalar("fullName", new StringType());
		query.addScalar("employeeCode", new StringType());
		query.addScalar("email", new StringType());
		query.addScalar("sysGroupId", new LongType());
		
		if(StringUtils.isNotEmpty(obj.getKeySearch())){
			query.setParameter("keySearch", "%" + obj.getKeySearch() + "%" );
		}
		query.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
		return query.list();
		
	}
	
	public GoodsPlanDTO getByCode(String code){
		StringBuilder sql = new StringBuilder("SELECT GOODS_PLAN_ID goodsPlanId ,"
				+ "CREATED_USER_ID createdUserId FROM GOODS_PLAN WHERE CODE =:code ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("goodsPlanId", new LongType());
		query.addScalar("createdUserId", new LongType());
		query.setParameter("code", code);
		query.setResultTransformer(Transformers.aliasToBean(GoodsPlanDTO.class));
		return (GoodsPlanDTO) query.uniqueResult();
	}
	
	public SignVofficeDTO getInformationVO(String objectId){
		StringBuilder sql = new StringBuilder("SELECT SIGN_VOFFICE_ID signVofficeId,"
				+ "TRANS_CODE transCode FROM SIGN_VOFFICE WHERE OBJECT_ID=:objectId AND BUSS_TYPE_ID='50' AND ROWNUM < 2 ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("signVofficeId", new LongType());
		query.addScalar("transCode", new StringType());
		query.setParameter("objectId", objectId);
		query.setResultTransformer(Transformers.aliasToBean(SignVofficeDTO.class));
		return (SignVofficeDTO) query.uniqueResult();
	}
	
	public void removeSignVO(Long signVofficeId){
		StringBuilder sql = new StringBuilder("DELETE SIGN_VOFFICE WHERE SIGN_VOFFICE_ID=:signVofficeId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("signVofficeId", signVofficeId);
		query.executeUpdate();
	}
	
	public void removeSignDetailVO(Long signVofficeId){
		StringBuilder sql = new StringBuilder("DELETE SIGN_VOFFICE_DETAIL WHERE SIGN_VOFFICE_ID=:signVofficeId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("signVofficeId", signVofficeId);
		query.executeUpdate();
	}
	
}
