package com.viettel.coms.dao;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import com.viettel.coms.bo.RequestGoodsBO;
import com.viettel.coms.dto.ConstructionDTO;
import com.viettel.coms.dto.GoodsDTO;
import com.viettel.coms.dto.SynStockDailyRemainDTO;
import com.viettel.coms.utils.ValidateUtils;
import com.viettel.service.base.dao.BaseFWDAOImpl;

import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.SynStockDailyImportExportDTO;
//import com.viettel.wms.dto.GoodsDTO;
//import com.viettel.wms.utils.ValidateUtils;


//VietNT_20190129_created
@EnableTransactionManagement
@Transactional
@Repository("synStockDailyImportExportDAO")
public class SynStockDailyImportExportDAO extends BaseFWDAOImpl<RequestGoodsBO, Long> {

    public SynStockDailyImportExportDAO() {
        this.model = new RequestGoodsBO();
    }

    public SynStockDailyImportExportDAO(Session session) {
        this.session = session;
    }

    //Huypq-start
    //Báo cáo tổng hợp công nợ vật tư A cấp
	public List<SynStockDailyRemainDTO> doSearchDebt(SynStockDailyRemainDTO obj) {
    	//VietNT_20190301_start
		this.setDateFromIER(obj);
    	//VietNT_end

		String conditionGroupId = StringUtils.EMPTY;
		if (null != obj.getSysGroupId()) {
			conditionGroupId = "and sys_group_id = :sysGroupId ";
		}
		
		String from = "( " +
				"select distinct " +
				"sys_group_id, " +
				"sys_group_code, " +
				"sys_group_name, " +
				"ie_date ie_date " +
				"from syn_stock_daily_import_export " +

				"union all  " +

				"select distinct " +
				"sys_group_id, " +
				"sys_group_code, " +
				"sys_group_name, " +
				"remain_date ie_date " +
				"from syn_stock_daily_remain " +
				") ";

		StringBuilder sql = new StringBuilder("SELECT " +
				"ssdie.sys_group_id sysGroupId, ssdie.sys_group_code sysGroupCode, ssdie.sys_group_name sysGroupName " +
				", ssdie.sys_group_code || '-' || ssdie.sys_group_name text " +

				", NVL((SELECT SUM(synRemain.amount_total) " +
				"FROM SYN_STOCK_DAILY_REMAIN synRemain " +
				"WHERE synRemain.REMAIN_DATE =:dateFrom and ssdie.sys_group_id = synRemain.sys_group_id),0) numberTonDauKy " +

				", NVL((SELECT SUM(synRemain.TOTAL_MONEY) " +
				"FROM SYN_STOCK_DAILY_REMAIN synRemain " +
				"WHERE synRemain.REMAIN_DATE =:dateFrom and ssdie.sys_group_id = synRemain.sys_group_id),0) totalMoneyTonDauKy " +

				", NVL((SELECT SUM(synRemain.amount_total) " +
				"FROM SYN_STOCK_DAILY_REMAIN synRemain " +
				"WHERE synRemain.REMAIN_DATE=:dateTo and ssdie.sys_group_id = synRemain.sys_group_id),0) numberTonCuoiKy " +

				", NVL((SELECT SUM(synRemain.TOTAL_MONEY) " +
				"FROM SYN_STOCK_DAILY_REMAIN synRemain " +
				"WHERE synRemain.REMAIN_DATE=:dateTo and ssdie.sys_group_id = synRemain.sys_group_id),0) totalMoneyTonCuoiKy " +

				", NVL((SELECT SUM(synExport.amount_total) " +
				"FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
				"WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 1 and synExport.IS_CONFIRM = 2 and ssdie.sys_group_id = synExport.sys_group_id),0) numberNhapTrongKy " +

				", NVL((SELECT SUM(synExport.TOTAL_MONEY) " +
				"FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
				"WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 1 and synExport.IS_CONFIRM = 2 and ssdie.sys_group_id = synExport.sys_group_id),0) totalMoneyNhapTrongKy " +

				", NVL((SELECT SUM(synExport.amount_total) " +
				"FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
				"WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 2 and ssdie.sys_group_id = synExport.sys_group_id),0) numberNghiemThuDoiSoat4A " +

				", NVL((SELECT SUM(synExport.TOTAL_MONEY) " +
				"FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
				"WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 2 and ssdie.sys_group_id = synExport.sys_group_id),0) totalMoneyNghiemThuDoiSoat4A " +

				", NVL((SELECT SUM(synExport.amount_total) " +
				"FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
				"WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 3 and ssdie.sys_group_id = synExport.sys_group_id),0) numberTraDenBu " +

				", NVL((SELECT SUM(synExport.TOTAL_MONEY) " +
				"FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
				"WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 3 and ssdie.sys_group_id = synExport.sys_group_id),0) totalMoneyTraDenBu " +

				"from " + from + " ssdie " +
				"where 1 = 1 " +
				conditionGroupId +
				"and ssdie.ie_date >= :dateFrom and ssdie.ie_date <= :dateTo " +
				"group by ssdie.sys_group_id, ssdie.sys_group_code, ssdie.sys_group_name " +
				"order by ssdie.sys_group_code ");

		String sqlCount = "SELECT COUNT(*) FROM (" +
				"SELECT ssdie.sys_group_id sysGroupId, ssdie.sys_group_code sysGroupCode, ssdie.sys_group_name sysGroupName " +
				"from " + from + " ssdie " +
				"where 1 = 1 " +
				conditionGroupId +
				"and ssdie.ie_date >= :dateFrom and ssdie.ie_date <= :dateTo " +
				"group by ssdie.sys_group_id, ssdie.sys_group_code, ssdie.sys_group_name" +
				")";

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount);

		query.setParameter("dateFrom", obj.getDateFrom());
		queryCount.setParameter("dateFrom", obj.getDateFrom());
		query.setParameter("dateTo", obj.getDateTo());
		queryCount.setParameter("dateTo", obj.getDateTo());

		query.addScalar("sysGroupId", new LongType());
		query.addScalar("sysGroupCode", new StringType());
		query.addScalar("sysGroupName", new StringType());
		query.addScalar("text", new StringType());
		this.addScalarReportIER(query);
		query.setResultTransformer(Transformers.aliasToBean(SynStockDailyRemainDTO.class));

		if (null != obj.getSysGroupId()) {
			query.setParameter("sysGroupId", obj.getSysGroupId());
			queryCount.setParameter("sysGroupId", obj.getSysGroupId());
		}
		this.setPageSize(obj, query, queryCount);
		return query.list();
	}

    public List<GoodsDTO> getForCompleteGoods(GoodsDTO obj){
    	StringBuilder sql = new StringBuilder("Select goods_id goodsId,"
    			+ " name name,"
    			+ " code code "
    			+ " from CTCT_CAT_OWNER.goods where 1=1 and status =1 ");
    	if ((StringUtils.isNotEmpty(obj.getName())) || (StringUtils.isNotEmpty(obj.getCode()))) {
			sql.append(
					" AND (upper(NAME) LIKE upper(:name) escape '&' OR upper(CODE) LIKE upper(:name) escape '&')");
		}
    	sql.append(" order by goods_id asc");
    	
    	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
    	
    	query.addScalar("goodsId", new LongType());
    	query.addScalar("name", new StringType());
    	query.addScalar("code", new StringType());
    	
    	query.setResultTransformer(Transformers.aliasToBean(GoodsDTO.class));
    	
    	if (StringUtils.isNotEmpty(obj.getName())) {
    		query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
    		queryCount.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
		}
    	
    	if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
    	
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		
    	return query.list();
    }
    
    public List<SynStockDailyRemainDTO> doSearchGoods(SynStockDailyRemainDTO obj){
    	StringBuilder sql = new StringBuilder("Select goods_id goodsId,"
    			+ " name goodsName,"
    			+ " code goodsCode "
    			+ " from CTCT_CAT_OWNER.goods where 1=1 and status =1 ");
    	if (StringUtils.isNotEmpty(obj.getGoodsName())) {
			sql.append(
					" AND (upper(NAME) LIKE upper(:name) escape '&' OR upper(CODE) LIKE upper(:name) escape '&')");
		}
    	sql.append(" order by goods_id asc");
    	
    	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
    	
    	query.addScalar("goodsId", new LongType());
    	query.addScalar("goodsName", new StringType());
    	query.addScalar("goodsCode", new StringType());
    	
    	query.setResultTransformer(Transformers.aliasToBean(SynStockDailyRemainDTO.class));
    	
    	if (StringUtils.isNotEmpty(obj.getGoodsName())) {
    		query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getGoodsName()) + "%");
    		queryCount.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getGoodsName()) + "%");
		}
    	
    	if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
    	
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		
    	return query.list();
    }
    
    //Báo cáo nhập xuất tồn vật tư A cấp
    public List<SynStockDailyRemainDTO> doSearchImportExportTonACap(SynStockDailyRemainDTO obj) {
		//VietNT_20190301_start
		this.setDateFromIER(obj);
		//VietNT_end

    	String conditionGroupId = StringUtils.EMPTY;
    	String conditionGoodsCode = StringUtils.EMPTY;
    	String groupByGroupId = StringUtils.EMPTY;
    	String subQuerySynRemainGroupId = StringUtils.EMPTY;
    	String subQuerySynExportGroupId = StringUtils.EMPTY;
    	if (obj.getSysGroupId() != null) {
    		conditionGroupId = "and ssdie.sys_group_id = :sysGroupId ";
    		groupByGroupId = ", ssdie.sys_group_id ";
			subQuerySynRemainGroupId = "and synRemain.sys_group_id = ssdie.sys_group_id ";
			subQuerySynExportGroupId = "and ssdie.sys_group_id = synExport.sys_group_id ";
		}
    	if (StringUtils.isNotEmpty(obj.getGoodsCode())) {
    		conditionGoodsCode = "and ssdie.goods_code = :goodsCode ";
		}
    	String from = "( " +
				"select distinct goods_code, goods_name, goods_unit_name, sys_group_id, sys_group_name, ie_date ie_date from syn_stock_daily_import_export " +
				"union all " +
				"select distinct goods_code, goods_name, goods_unit_name, sys_group_id, sys_group_name, remain_date ie_date from syn_stock_daily_remain " +
				") ";
		String sql = "SELECT " +
				"ssdie.goods_code goodsCode " +
				", ssdie.goods_name goodsName " +
				", ssdie.goods_unit_name goodsUnitName " +
				", ssdie.sys_group_name sysGroupName" +
				groupByGroupId +

				", NVL((SELECT SUM(synRemain.amount_total) " +
				"FROM SYN_STOCK_DAILY_REMAIN synRemain " +
				"WHERE synRemain.REMAIN_DATE =:dateFrom and ssdie.goods_code = synRemain.goods_code and ssdie.goods_unit_name = synRemain.goods_unit_name " +
				subQuerySynRemainGroupId +
				"), 0) numberTonDauKy " +

				", NVL((SELECT SUM(synRemain.TOTAL_MONEY) " +
				"FROM SYN_STOCK_DAILY_REMAIN synRemain " +
				"WHERE synRemain.REMAIN_DATE =:dateFrom and ssdie.goods_code = synRemain.goods_code and ssdie.goods_unit_name = synRemain.goods_unit_name " +
				subQuerySynRemainGroupId +
				"), 0) totalMoneyTonDauKy " +

				", NVL((SELECT SUM(synRemain.amount_total) " +
				"FROM SYN_STOCK_DAILY_REMAIN synRemain " +
				"WHERE synRemain.REMAIN_DATE=:dateTo and ssdie.goods_code = synRemain.goods_code and ssdie.goods_unit_name = synRemain.goods_unit_name " +
				subQuerySynRemainGroupId +
				"), 0) numberTonCuoiKy " +

				", NVL((SELECT SUM(synRemain.TOTAL_MONEY) " +
				"FROM SYN_STOCK_DAILY_REMAIN synRemain " +
				"WHERE synRemain.REMAIN_DATE=:dateTo and ssdie.goods_code = synRemain.goods_code and ssdie.goods_unit_name = synRemain.goods_unit_name " +
				subQuerySynRemainGroupId +
				"), 0) totalMoneyTonCuoiKy " +

				", NVL((SELECT SUM(synExport.amount_total) " +
				"FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
				"WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 1 and synExport.IS_CONFIRM = 2 and ssdie.goods_code = synExport.goods_code and ssdie.goods_unit_name = synExport.goods_unit_name " +
				subQuerySynExportGroupId +
				"), 0) numberNhapTrongKy " +

				", NVL((SELECT SUM(synExport.TOTAL_MONEY) " +
				"FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
				"WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 1 and synExport.IS_CONFIRM = 2 and ssdie.goods_code = synExport.goods_code and ssdie.goods_unit_name = synExport.goods_unit_name " +
				subQuerySynExportGroupId +
				"), 0) totalMoneyNhapTrongKy " +

				", NVL((SELECT SUM(synExport.amount_total) " +
				"FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
				"WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 2 and ssdie.goods_code = synExport.goods_code and ssdie.goods_unit_name = synExport.goods_unit_name " +
				subQuerySynExportGroupId +
				"), 0) numberNghiemThuDoiSoat4A " +

				", NVL((SELECT SUM(synExport.TOTAL_MONEY) " +
				"FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
				"WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 2 and ssdie.goods_code = synExport.goods_code and ssdie.goods_unit_name = synExport.goods_unit_name " +
				subQuerySynExportGroupId +
				"), 0) totalMoneyNghiemThuDoiSoat4A " +

				", NVL((SELECT SUM(synExport.amount_total) " +
				"FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
				"WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 3 and ssdie.goods_code = synExport.goods_code and ssdie.goods_unit_name = synExport.goods_unit_name " +
				subQuerySynExportGroupId +
				"), 0) numberTraDenBu " +

				", NVL((SELECT SUM(synExport.TOTAL_MONEY) " +
				"FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
				"WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 3 and ssdie.goods_code = synExport.goods_code and ssdie.goods_unit_name = synExport.goods_unit_name " +
				subQuerySynExportGroupId +
				"), 0) totalMoneyTraDenBu " +

				"from " + from + " ssdie " +
				"where 1=1 " +
				"and ssdie.ie_date >= :dateFrom and ssdie.ie_date <= :dateTo " +
				conditionGroupId +
				conditionGoodsCode +
				"GROUP BY ssdie.goods_code, ssdie.goods_name, ssdie.goods_unit_name, ssdie.sys_group_name " +
				groupByGroupId +
				"ORDER BY ssdie.goods_name ";

		String sqlCount = "SELECT COUNT(*) FROM (" +
				"SELECT " +
				"ssdie.goods_code goodsCode " +
				", ssdie.goods_name goodsName " +
				", ssdie.goods_unit_name goodsUnitName " +
				", ssdie.sys_group_name " +
				groupByGroupId +

				"from " + from + " ssdie " +
				"where 1=1 " +
				"and ssdie.ie_date >= :dateFrom and ssdie.ie_date <= :dateTo " +
				conditionGroupId +
				conditionGoodsCode +
				"GROUP BY ssdie.goods_code, ssdie.goods_name, ssdie.goods_unit_name, ssdie.sys_group_name " +
				groupByGroupId +
				")";

		SQLQuery query = getSession().createSQLQuery(sql);
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount);

		query.setParameter("dateFrom", obj.getDateFrom());
		queryCount.setParameter("dateFrom", obj.getDateFrom());
		query.setParameter("dateTo", obj.getDateTo());
		queryCount.setParameter("dateTo", obj.getDateTo());

		if (null != obj.getSysGroupId()) {
			query.setParameter("sysGroupId", obj.getSysGroupId());
			queryCount.setParameter("sysGroupId", obj.getSysGroupId());
		}
		if (null != obj.getGoodsId()) {
			query.setParameter("goodsCode", obj.getGoodsCode());
			queryCount.setParameter("goodsCode", obj.getGoodsCode());
		}

		query.setResultTransformer(Transformers.aliasToBean(SynStockDailyRemainDTO.class));
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("sysGroupName", new StringType());
		this.addScalarReportIER(query);
		this.setPageSize(obj, query, queryCount);
		return query.list();
    }

    //Biên bản đối chiếu vật tư xuất thi công
    public List<SynStockDailyRemainDTO> doSearchCompareReport(SynStockDailyRemainDTO obj) {
    	StringBuilder sql = new StringBuilder();
		sql.append("SELECT ");
		sql.append("ssdie.construction_code constructionCode, ");
		sql.append("ssdie.syn_stock_trans_code synStockTransCode, ");
		sql.append("ssdie.real_ie_trans_date realIeTransDate, ");
		sql.append("ssdie.goods_name goodsName, ");
		sql.append("ssdie.goods_code goodsCode, ");
		sql.append("ssdie.goods_unit_name goodsUnitName, ");
		sql.append("ssdie.cat_station_code catStationCode, ");

		sql.append("(select syn_stock_trans_code from syn_stock_daily_import_export a where a.stock_trans_type = 3 and ssdie.construction_code = a.construction_code and ssdie.syn_stock_trans_code=a.FROM_SYN_STOCK_TRANS_CODE and ssdie.goods_code=a.goods_code) ");
		sql.append("fromSynStockTransCode ");
		sql.append(", sum(ssdie.amount_total) numberXuatKho ");
		sql.append(", sum(ssdie.total_money) totalMoneyXuatKho ");

		sql.append(", nvl((select sum(a.amount_total) from syn_stock_daily_import_export a where a.stock_trans_type = 2 and ssdie.construction_code = a.construction_code and ssdie.syn_stock_trans_code=a.syn_stock_trans_code and ssdie.goods_code=a.goods_code),0) ");
		sql.append("numberThucTeThiCong ");

		sql.append(", nvl((select sum(a.total_money) from syn_stock_daily_import_export a where a.stock_trans_type = 2 and ssdie.construction_code = a.construction_code and ssdie.syn_stock_trans_code=a.syn_stock_trans_code and ssdie.goods_code=a.goods_code),0) ");
		sql.append("totalMoneyThucTeThiCong ");

		sql.append(", nvl((select sum(a.amount_total) from syn_stock_daily_import_export a where a.stock_trans_type = 3 and ssdie.construction_code = a.construction_code and ssdie.syn_stock_trans_code=a.FROM_SYN_STOCK_TRANS_CODE and ssdie.goods_code=a.goods_code),0) ");
		sql.append("numberThuHoi ");

		sql.append(", nvl((select sum(a.total_money) from syn_stock_daily_import_export a where a.stock_trans_type = 3 and ssdie.construction_code = a.construction_code and ssdie.syn_stock_trans_code=a.FROM_SYN_STOCK_TRANS_CODE and ssdie.goods_code=a.goods_code),0) ");
		sql.append("totalMoneyThuHoi ");

		sql.append("FROM syn_stock_daily_import_export ssdie ");
		sql.append("WHERE 1 = 1 ");
		sql.append("and ssdie.stock_trans_type = 1 and ssdie.is_confirm = 2 ");
		sql.append("AND ssdie.construction_code = :constructionCode ");
		sql.append("group by ");
		sql.append("ssdie.construction_code ");
		sql.append(", ssdie.syn_stock_trans_code ");
		sql.append(", ssdie.real_ie_trans_date ");
		sql.append(", ssdie.goods_name ");
		sql.append(", ssdie.goods_code ");
		sql.append(", ssdie.goods_unit_name ");
		sql.append(", ssdie.cat_station_code ");
		sql.append("ORDER BY ssdie.syn_stock_trans_code, ssdie.goods_name ");

		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append("SELECT ");
		sqlCount.append("ssdie.construction_code constructionCode, ");
		sqlCount.append("ssdie.syn_stock_trans_code synStockTransCode, ");
		sqlCount.append("ssdie.real_ie_trans_date realIeTransDate, ");
		sqlCount.append("ssdie.goods_name goodsName, ");
		sqlCount.append("ssdie.goods_code goodsCode, ");
		sqlCount.append("ssdie.goods_unit_name goodsUnitName, ");
		sqlCount.append("ssdie.cat_station_code catStationCode ");
		sqlCount.append("FROM syn_stock_daily_import_export ssdie ");
		sqlCount.append("WHERE 1 = 1 ");
		sqlCount.append("and ssdie.stock_trans_type = 1 and ssdie.is_confirm = 2 ");
		sqlCount.append("AND ssdie.construction_code = :constructionCode ");
		sqlCount.append("group by ");
		sqlCount.append("ssdie.construction_code ");
		sqlCount.append(", ssdie.syn_stock_trans_code ");
		sqlCount.append(", ssdie.real_ie_trans_date ");
		sqlCount.append(", ssdie.goods_name ");
		sqlCount.append(", ssdie.goods_code ");
		sqlCount.append(", ssdie.goods_unit_name ");
		sqlCount.append(", ssdie.cat_station_code ");
		sqlCount.append("ORDER BY ssdie.syn_stock_trans_code, ssdie.goods_name");
		sqlCount.append(")");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("realIeTransDate", new DateType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("synStockTransCode", new StringType());
		query.addScalar("fromSynStockTransCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("catStationCode", new StringType());
//		query.addScalar("price", new DoubleType());
		query.addScalar("numberXuatKho", new DoubleType());
		query.addScalar("totalMoneyXuatKho", new DoubleType());
		query.addScalar("numberThucTeThiCong", new DoubleType());
		query.addScalar("totalMoneyThucTeThiCong", new DoubleType());
		query.addScalar("numberThuHoi", new DoubleType());
		query.addScalar("totalMoneyThuHoi", new DoubleType());
		query.setResultTransformer(Transformers.aliasToBean(SynStockDailyRemainDTO.class));

		query.setParameter("constructionCode", obj.getConstructionCode());
		queryCount.setParameter("constructionCode", obj.getConstructionCode());

		this.setPageSize(obj, query, queryCount);
		return query.list();
    }
    //Auto suggest công trình
    public List<ConstructionDTO> getForCompleteConstruction(ConstructionDTO obj){
    	StringBuilder sql = new StringBuilder("select construction_id constructionId, code code, name name"
    			+ " from construction "
    			+ "where 1 = 1 ");
//    			+ "where status = 1");
    	if (StringUtils.isNotEmpty(obj.getName())) {
			sql.append(
					" AND (upper(NAME) LIKE upper(:name) OR upper(CODE) LIKE upper(:name) escape '&')");
		}
    	sql.append(" order by construction_id asc");
    	StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
    	
    	query.addScalar("constructionId", new LongType());
    	query.addScalar("code", new StringType());
    	query.addScalar("name", new StringType());
    	query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));
    	if (StringUtils.isNotEmpty(obj.getName())) {
    		query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
    		queryCount.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
		}
    	if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
    }
    //huypq-end

//VietNT_20190218_start
    public List<SynStockDailyImportExportDTO> doSearchGoodsDebtConfirmDetail(SynStockDailyImportExportDTO criteria) {
        StringBuilder sql = this.createDoSearchBaseQuery();
        sql.append("SUM(AMOUNT_TOTAL) amountTotal, ");
        sql.append("SUM(TOTAL_MONEY) totalMoney ");
        sql.append("FROM SYN_STOCK_DAILY_IMPORT_EXPORT daily ");

        this.addQueryCondition(sql, criteria);

        sql.append("group by " + 
        		"ie_date, " +
        		"stock_trans_type, " +
        		"sys_group_id, " +
        		"sys_group_code, " + 
        		"sys_group_name, " +
        		"province_id, " +
        		"province_code, " +
        		"cat_station_code, " +
        		"construction_code, " +
        		"construction_state, " + 
        		"contract_code, " +
        		"province_user_name, " +
        		"sys_user_name, " +
        		"syn_stock_trans_code, " +
        		"real_ie_trans_date, " + 
        		"goods_code, " +
        		"goods_name, " +
        		"serial, " +
        		"is_confirm ");
        sql.append("ORDER BY daily.real_ie_trans_date desc ");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery(sqlCount.toString());
        this.addQueryParams(query, queryCount, criteria);

        query.setResultTransformer(Transformers.aliasToBean(SynStockDailyImportExportDTO.class));
        this.addQueryScalarDoSearch(query);

        this.setPageSize(criteria, query, queryCount);
        return query.list();
    }

    @SuppressWarnings("Duplicates")
    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    private StringBuilder createDoSearchBaseQuery() {
        StringBuilder sql = new StringBuilder("SELECT " +
                "IE_DATE ieDate, " +
                "STOCK_TRANS_TYPE stockTransType, " +
                "SYS_GROUP_ID sysGroupId, " +
                "SYS_GROUP_CODE sysGroupCode, " +
				"SYS_GROUP_NAME sysGroupName, " +
                "PROVINCE_ID provinceId, " +
                "PROVINCE_CODE provinceCode, " +
                "CAT_STATION_CODE catStationCode, " +
                "CONSTRUCTION_CODE constructionCode, " +
                "CONSTRUCTION_STATE constructionState, " +
                "CONTRACT_CODE contractCode, " +
                "PROVINCE_USER_NAME provinceUserName, " +
                "SYS_USER_NAME sysUserName, " +
                "SYN_STOCK_TRANS_CODE synStockTransCode, " +
                "REAL_IE_TRANS_DATE realIeTransDate, " +
                "GOODS_CODE goodsCode, " +
                "GOODS_NAME goodsName, " +
                "SERIAL serial, " +
                "IS_CONFIRM isConfirm, ");

        return sql;
    }

    private void addQueryScalarDoSearch(SQLQuery query) {
        query.addScalar("ieDate", new DateType());
        query.addScalar("stockTransType", new StringType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupCode", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("provinceId", new LongType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("constructionState", new LongType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("provinceUserName", new StringType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("synStockTransCode", new StringType());
        query.addScalar("realIeTransDate", new DateType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("amountTotal", new DoubleType());
        query.addScalar("totalMoney", new DoubleType());
        query.addScalar("serial", new StringType());
        query.addScalar("isConfirm", new LongType());
    }

    private void addQueryCondition(StringBuilder sql, SynStockDailyImportExportDTO criteria) {
        sql.append("WHERE 1=1 " +
                "AND STOCK_TRANS_TYPE = 1 " +
                "AND IS_CONFIRM = 2 ");

        //query by keySearch: Mã công trình/mã trạm
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("AND (" +
                    "upper(daily.CONSTRUCTION_CODE) LIKE upper(:keySearch) " +
                    "OR upper(daily.CAT_STATION_CODE) LIKE upper(:keySearch) escape '&') ");
        }

        //query by provinceId
        if (null != criteria.getProvinceId()) {
            sql.append("AND daily.PROVINCE_ID = :provinceId ");
        }

        //query by sysGroupId
        if (null != criteria.getSysGroupId()) {
            sql.append("AND daily.SYS_GROUP_ID = :sysGroupId ");
        }

        //query by ieDate
        if (null != criteria.getDateFrom()) {
            sql.append("AND TRUNC(daily.real_ie_trans_date) >= :dateFrom ");
        }
        if (null != criteria.getDateTo()) {
            sql.append("AND TRUNC(daily.real_ie_trans_date) <= :dateTo ");
        }
    }

    private void addQueryParams(SQLQuery query, SQLQuery queryCount, SynStockDailyImportExportDTO criteria) {
        // set params
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }
        if (null != criteria.getProvinceId()) {
            query.setParameter("provinceId", criteria.getProvinceId());
            queryCount.setParameter("provinceId", criteria.getProvinceId());
        }
        if (null != criteria.getSysGroupId()) {
            query.setParameter("sysGroupId", criteria.getSysGroupId());
            queryCount.setParameter("sysGroupId", criteria.getSysGroupId());
        }
        if (null != criteria.getDateFrom()) {
            query.setParameter("dateFrom", criteria.getDateFrom());
            queryCount.setParameter("dateFrom", criteria.getDateFrom());
        }
        if (null != criteria.getDateTo()) {
            query.setParameter("dateTo", criteria.getDateTo());
            queryCount.setParameter("dateTo", criteria.getDateTo());
        }
    }

    public List<SynStockDailyImportExportDTO> doSearchGoodsDebtConfirmGeneral(SynStockDailyImportExportDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT " +
                "IE_DATE ieDate, " +
                "STOCK_TRANS_TYPE stockTransType, " +
                "SYS_GROUP_ID sysGroupId, " +
                "SYS_GROUP_CODE sysGroupCode, " +
                "SYS_GROUP_NAME sysGroupName, " +
                "PROVINCE_ID provinceId, " +
                "PROVINCE_CODE provinceCode, " +
                "CAT_STATION_CODE catStationCode, " +
                "CONSTRUCTION_CODE constructionCode, " +
                "CONSTRUCTION_STATE constructionState, " +
                "CONTRACT_CODE contractCode, " +
                "PROVINCE_USER_NAME provinceUserName, " +
                "SYS_USER_NAME sysUserName, " +
                "SYN_STOCK_TRANS_CODE synStockTransCode, " +
                "REAL_IE_TRANS_DATE realIeTransDate, " +
                "IS_CONFIRM isConfirm, " +
                "SUM(TOTAL_MONEY) totalMoney ");
        sql.append("from SYN_STOCK_DAILY_IMPORT_EXPORT daily ");
        this.addQueryCondition(sql, criteria);

        sql.append("group by " +
                "ie_date, " +
                "stock_trans_type, " +
                "sys_group_id, " +
                "sys_group_code, " +
				"SYS_GROUP_NAME, " +
                "province_id, " +
                "province_code, " +
                "cat_station_code, " +
                "construction_code, " +
                "construction_state, " +
                "contract_code, " +
                "province_user_name, " +
                "sys_user_name, " +
                "syn_stock_trans_code, " +
                "real_ie_trans_date, " +
                "is_confirm ");
        sql.append("ORDER BY daily.real_ie_trans_date desc ");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery(sqlCount.toString());
        this.addQueryParams(query, queryCount, criteria);

        query.setResultTransformer(Transformers.aliasToBean(SynStockDailyImportExportDTO.class));
        query.addScalar("ieDate", new DateType());
        query.addScalar("stockTransType", new StringType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupCode", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("provinceId", new LongType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("constructionState", new LongType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("provinceUserName", new StringType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("synStockTransCode", new StringType());
        query.addScalar("realIeTransDate", new DateType());
        query.addScalar("totalMoney", new DoubleType());
        query.addScalar("isConfirm", new LongType());

        this.setPageSize(criteria, query, queryCount);
        return query.list();
    }

    public List<SynStockDailyImportExportDTO> doSearchContractPerformance(SynStockDailyImportExportDTO criteria) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ");
        sql.append("REAL_IE_TRANS_DATE, ");
        sql.append("STOCK_TRANS_TYPE, ");
        sql.append("SYS_GROUP_ID, ");
        sql.append("SYS_GROUP_CODE, ");
        sql.append("PROVINCE_CODE, ");
        sql.append("PROVINCE_NAME, ");
        sql.append("CONSTRUCTION_CODE, ");
        sql.append("CONSTRUCTION_STATE, ");
        sql.append("CONTRACT_CODE, ");
        sql.append("TOTAL_MONEY, ");
        sql.append("IS_CONFIRM ");

        // query by cons state
        if (criteria.getConstructionState() != null) {
            sql.append(", (SELECT COUNT(DISTINCT construction_code) " +
                    "FROM syn_stock_daily_import_export " +
                    "WHERE construction_state = 3 " +
                    "and contract_code = s.contract_code ) completedNo ");
        }

        sql.append("FROM SYN_STOCK_DAILY_IMPORT_EXPORT s " +
                "WHERE 1=1 " +
                "AND CONSTRUCTION_STATE is not null " +
                "and STOCK_TRANS_TYPE = 1 " +
                "and IS_CONFIRM = 2 ");
        if (criteria.getSysGroupId() != null) {
            sql.append("and sys_group_id = :sysGroupId ");
        }
        if (StringUtils.isNotEmpty(criteria.getProvinceCode())) {
            sql.append("and upper(province_code) = (:provinceCode) ");
        }
        if (StringUtils.isNotEmpty(criteria.getContractCode())) {
            sql.append("and upper(contract_code) = upper(:contractCode) ");
        }
        if (criteria.getFilterSearch() == 1) {
            sql.append("and upper(sys_group_code) like upper('XC%') ");
        } else if (criteria.getFilterSearch() == 2) {
            sql.append("and upper(sys_group_code) not like upper('XC%') ");
        }

        //query by ieDate
        if (null != criteria.getDateFrom()) {
            sql.append("AND TRUNC(REAL_IE_TRANS_DATE) >= :dateFrom ");
        }
        if (null != criteria.getDateTo()) {
            sql.append("AND TRUNC(REAL_IE_TRANS_DATE) <= :dateTo ");
        }


        // query by cons state
        StringBuilder sqlGroup = new StringBuilder();
        if (criteria.getConstructionState() != null) {
        	sqlGroup.append("WITH stateByContract " +
                    "AS (SELECT " +
                    "contract_code, " +
                    "COUNT(DISTINCT construction_code) constructionNum " +
                    "FROM syn_stock_daily_import_export " +
                    "WHERE stock_trans_type = 1 AND is_confirm = 2 GROUP BY contract_code ) ");
        }
        sqlGroup.append("select " +
                "s1.province_name provinceName " +
                ", s1.contract_code contractCode " +
                ", s1.construction_state constructionState " +
                ", sum(s1.TOTAL_MONEY) totalMoney " +
                ", count(distinct s1.construction_code) countTotal " +
                "from (" + sql + ") s1 ");

        // query by cons state
        if (criteria.getConstructionState() != null) {
            String operator = criteria.getConstructionState() == 3 ? "=" : "!=";
            sqlGroup.append("join stateByContract s2 on s1.contract_code = s2.contract_code ");
            sqlGroup.append("where s1.completedNo ");
            sqlGroup.append(operator);
            sqlGroup.append(" s2.constructionNum ");
        }
        sqlGroup.append("group by s1.province_name, s1.contract_code, s1.construction_state ");

        String sqlCount = "SELECT COUNT (*) FROM " +
                "(SELECT " +
                "province_name, " +
                "contract_code " +
                "FROM (" + sql + ") s1 " +
                "GROUP BY province_name, contract_code) ";

        SQLQuery query = this.getSession().createSQLQuery(sqlGroup.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery(sqlCount);

        if (criteria.getSysGroupId() != null) {
            query.setParameter("sysGroupId", criteria.getSysGroupId());
            queryCount.setParameter("sysGroupId", criteria.getSysGroupId());
        }
        if (StringUtils.isNotEmpty(criteria.getProvinceCode())) {
            query.setParameter("provinceCode", criteria.getProvinceCode());
            queryCount.setParameter("provinceCode", criteria.getProvinceCode());
        }
        if (StringUtils.isNotEmpty(criteria.getContractCode())) {
            query.setParameter("contractCode", criteria.getContractCode());
            queryCount.setParameter("contractCode", criteria.getContractCode());
        }
        //query by ieDate
        if (null != criteria.getDateFrom()) {
            query.setParameter("dateFrom", criteria.getDateFrom());
            queryCount.setParameter("dateFrom", criteria.getDateFrom());
        }
        if (null != criteria.getDateTo()) {
            query.setParameter("dateTo", criteria.getDateTo());
            queryCount.setParameter("dateTo", criteria.getDateTo());
        }

        query.setResultTransformer(Transformers.aliasToBean(SynStockDailyImportExportDTO.class));
        query.addScalar("provinceName", new StringType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("constructionState", new LongType());
        query.addScalar("totalMoney", new DoubleType());
        query.addScalar("countTotal", new IntegerType());

        this.setPageSize(criteria, query, queryCount);
        return query.list();
    }

    public List<SynStockDailyRemainDTO> doSearchRpDetailIERByConstructionCode(SynStockDailyImportExportDTO criteria) {
		criteria.setDateFrom(new Date(criteria.getDateFrom().getTime() - 86400000));
        String conditionGroup = StringUtils.EMPTY;
        String conditionGoods = StringUtils.EMPTY;
        if (criteria.getSysGroupId() != null) {
            conditionGroup = "and sys_group_id = :sysGroupId ";
        }
        if (StringUtils.isNotEmpty(criteria.getGoodsCode())) {
            conditionGoods = "and goods_code = :goodsCode ";
        }
        
        String from = "( " +
        		"select distinct construction_code, real_ie_trans_date, sys_group_name, CAT_STATION_CODE, syn_stock_trans_code, goods_name, goods_code, goods_unit_name, from_syn_stock_trans_code, ie_date " +
        		"from syn_stock_daily_import_export " +
        		"union all " + 
        		"select distinct construction_code, real_ie_trans_date, sys_group_name, CAT_STATION_CODE, syn_stock_trans_code, goods_name, goods_code, goods_unit_name, null, remain_date " +
        		"from syn_stock_daily_remain " +
        		") ";

        String sql = "SELECT ssdie.construction_code constructionCode " +
                ", ssdie.real_ie_trans_date realIeTransDate " +
                ", ssdie.syn_stock_trans_code synStockTransCode " +
                ", ssdie.goods_name goodsName " +
                ", ssdie.goods_code goodsCode " +
				", ssdie.sys_group_name sysGroupName " +
				", ssdie.CAT_STATION_CODE catStationCode " +
                ", ssdie.goods_unit_name goodsUnitName " +
                ", ssdie.from_syn_stock_trans_code fromSynStockTransCode " +

                ", NVL((SELECT SUM(synRemain.amount_total) " +
                "FROM SYN_STOCK_DAILY_REMAIN synRemain " +
                "WHERE synRemain.REMAIN_DATE=:dateFrom " +
                conditionGroup +
                conditionGoods +
                "and synRemain.construction_code = ssdie.construction_code and synRemain.syn_stock_trans_code = ssdie.syn_stock_trans_code and synRemain.goods_code = ssdie.goods_code and synRemain.goods_unit_name = ssdie.goods_unit_name and synRemain.real_ie_trans_date = ssdie.real_ie_trans_date), 0) " +
                "numberTonDauKy " +

                ", NVL((SELECT SUM(synRemain.TOTAL_MONEY) " +
                "FROM SYN_STOCK_DAILY_REMAIN synRemain " +
                "WHERE synRemain.REMAIN_DATE=:dateFrom " +
                conditionGroup +
                conditionGoods +
                "and synRemain.construction_code = ssdie.construction_code and synRemain.syn_stock_trans_code = ssdie.syn_stock_trans_code and synRemain.goods_code = ssdie.goods_code and synRemain.goods_unit_name = ssdie.goods_unit_name and synRemain.real_ie_trans_date = ssdie.real_ie_trans_date), 0) " +
                "totalMoneyTonDauKy " +

                ", NVL((SELECT SUM(synExport.amount_total) " +
                "FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
                "WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 1 and synExport.IS_CONFIRM = 2 " +
                conditionGroup +
                conditionGoods +
                "and synExport.construction_code = ssdie.construction_code and synExport.syn_stock_trans_code = ssdie.syn_stock_trans_code and synExport.goods_code = ssdie.goods_code and synExport.goods_unit_name = ssdie.goods_unit_name and synExport.real_ie_trans_date = ssdie.real_ie_trans_date), 0) " +
                "numberNhapTrongKy " +

                ", NVL((SELECT SUM(synExport.TOTAL_MONEY) " +
                "FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
                "WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 1 and synExport.IS_CONFIRM = 2 " +
                conditionGroup +
                conditionGoods +
                "and synExport.construction_code = ssdie.construction_code and synExport.syn_stock_trans_code = ssdie.syn_stock_trans_code and synExport.goods_code = ssdie.goods_code and synExport.goods_unit_name = ssdie.goods_unit_name and synExport.real_ie_trans_date = ssdie.real_ie_trans_date), 0) " +
                "totalMoneyNhapTrongKy " +

                ", NVL((SELECT SUM(synExport.amount_total) " +
                "FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
                "WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 2 " +
                conditionGroup +
                conditionGoods +
                "and synExport.construction_code = ssdie.construction_code and synExport.syn_stock_trans_code = ssdie.syn_stock_trans_code and synExport.goods_name = ssdie.goods_name and synExport.goods_code = ssdie.goods_code and synExport.goods_unit_name = ssdie.goods_unit_name and synExport.real_ie_trans_date = ssdie.real_ie_trans_date), 0) " +
                "numberNghiemThuDoiSoat4A " +

                ", NVL((SELECT SUM(synExport.TOTAL_MONEY) " +
                "FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
                "WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 2 " +
                conditionGroup +
                conditionGoods +
                "and synExport.construction_code = ssdie.construction_code and synExport.syn_stock_trans_code = ssdie.syn_stock_trans_code and synExport.goods_name = ssdie.goods_name and synExport.goods_code = ssdie.goods_code and synExport.goods_unit_name = ssdie.goods_unit_name and synExport.real_ie_trans_date = ssdie.real_ie_trans_date), 0) " +
                "totalMoneyNghiemThuDoiSoat4A " +

                ", NVL((SELECT SUM(synExport.amount_total) " +
                "FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
                "WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 3 " +
                conditionGroup +
                conditionGoods +
                "and synExport.construction_code = ssdie.construction_code and synExport.syn_stock_trans_code = ssdie.syn_stock_trans_code and synExport.goods_name = ssdie.goods_name and synExport.goods_code = ssdie.goods_code and synExport.goods_unit_name = ssdie.goods_unit_name and synExport.real_ie_trans_date = ssdie.real_ie_trans_date), 0) " +
                "numberTraDenBu " +

                ", NVL((SELECT SUM(synExport.TOTAL_MONEY) " +
                "FROM SYN_STOCK_DAILY_IMPORT_EXPORT synExport " +
                "WHERE synExport.IE_DATE>=:dateFrom and synExport.IE_DATE<=:dateTo and synExport.STOCK_TRANS_TYPE = 3 " +
                conditionGroup +
                conditionGoods +
                "and synExport.construction_code = ssdie.construction_code and synExport.syn_stock_trans_code = ssdie.syn_stock_trans_code and synExport.goods_name = ssdie.goods_name and synExport.goods_code = ssdie.goods_code and synExport.goods_unit_name = ssdie.goods_unit_name and synExport.real_ie_trans_date = ssdie.real_ie_trans_date), 0) " +
                "totalMoneyTraDenBu " +

                ", NVL((SELECT SUM(synRemain.amount_total) " +
                "FROM SYN_STOCK_DAILY_REMAIN synRemain " +
                "WHERE synRemain.REMAIN_DATE=:dateTo " +
                conditionGroup +
                conditionGoods +
                "and synRemain.construction_code = ssdie.construction_code and synRemain.syn_stock_trans_code = ssdie.syn_stock_trans_code and synRemain.goods_code = ssdie.goods_code and synRemain.goods_unit_name = ssdie.goods_unit_name and synRemain.real_ie_trans_date = ssdie.real_ie_trans_date), 0) " +
                "numberTonCuoiKy " +

                ", NVL((SELECT SUM(synRemain.TOTAL_MONEY) " +
                "FROM SYN_STOCK_DAILY_REMAIN synRemain " +
                "WHERE synRemain.REMAIN_DATE=:dateTo " +
                conditionGroup +
                conditionGoods +
                "and synRemain.construction_code = ssdie.construction_code and synRemain.syn_stock_trans_code = ssdie.syn_stock_trans_code and synRemain.goods_code = ssdie.goods_code and synRemain.goods_unit_name = ssdie.goods_unit_name and synRemain.real_ie_trans_date = ssdie.real_ie_trans_date), 0) " +
                "totalMoneyTonCuoiKy " +

                "FROM " + from + " ssdie " +
                "WHERE 1 = 1 " +
                "and ssdie.IE_DATE>=:dateFrom and ssdie.IE_DATE<=:dateTo " +
                conditionGroup +
                conditionGoods +
                "group by ssdie.syn_stock_trans_code, " +
                "ssdie.construction_code, " +
                "ssdie.goods_code, " +
                "ssdie.goods_name, " +
                "ssdie.goods_unit_name, " +
                "ssdie.real_ie_trans_date, " +
                "ssdie.from_syn_stock_trans_code " +
				", ssdie.sys_group_name " +
				", ssdie.cat_station_code " +
                "ORDER BY ssdie.construction_code ";

        String sqlCount = "SELECT COUNT(1) FROM (SELECT ssdie.construction_code constructionCode " +
                ", ssdie.real_ie_trans_date realIeTransDate " +
                ", ssdie.syn_stock_trans_code synStockTransCode " +
                ", ssdie.goods_name goodsName " +
                ", ssdie.goods_code goodsCode " +
                ", ssdie.goods_unit_name goodsUnitName " +
                "FROM " + from + " ssdie " +
                "WHERE 1 = 1 " +
                "and ssdie.IE_DATE>=:dateFrom and ssdie.IE_DATE<=:dateTo " +
                conditionGroup +
                conditionGoods +
                "group by ssdie.syn_stock_trans_code, " +
                "ssdie.construction_code, " +
                "ssdie.goods_code, " +
                "ssdie.goods_name, " +
                "ssdie.goods_unit_name, " +
                "ssdie.real_ie_trans_date, ssdie.sys_group_name) ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        SQLQuery queryCount = this.getSession().createSQLQuery(sqlCount);
        query.setParameter("dateFrom", criteria.getDateFrom());
        queryCount.setParameter("dateFrom", criteria.getDateFrom());
        query.setParameter("dateTo", criteria.getDateTo());
        queryCount.setParameter("dateTo", criteria.getDateTo());

        if (criteria.getSysGroupId() != null) {
            query.setParameter("sysGroupId", criteria.getSysGroupId());
            queryCount.setParameter("sysGroupId", criteria.getSysGroupId());
        }

        if (StringUtils.isNotEmpty(criteria.getGoodsCode())) {
            query.setParameter("goodsCode", criteria.getGoodsCode());
            queryCount.setParameter("goodsCode", criteria.getGoodsCode());
        }

        query.setResultTransformer(Transformers.aliasToBean(SynStockDailyRemainDTO.class));
        query.addScalar("constructionCode", new StringType());
        query.addScalar("realIeTransDate", new DateType());
        query.addScalar("synStockTransCode", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("fromSynStockTransCode", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("catStationCode", new StringType());
        this.addScalarReportIER(query);

        this.setPageSize(criteria, query, queryCount);
        return query.list();
    }

    @SuppressWarnings("Duplicates")
    public List<GoodsDTO> getGoodsForAutoComplete(GoodsDTO obj) {
        String sql = "SELECT g.GOODS_ID goodsId, "
                + "g.NAME name, "
                + "g.CODE code, "
                + "g.GOODS_TYPE goodsType, "
                + "g.UNIT_TYPE goodsUnitId, "
                + "g.UNIT_TYPE_NAME unitTypeName "
                + "FROM GOODS g "
                + "WHERE 1=1 ";

        StringBuilder stringBuilder = new StringBuilder(sql);


        if (obj.getIsSize()) {
            stringBuilder.append(" AND ROWNUM <=10 ");
            if (StringUtils.isNotEmpty(obj.getName())) {
                stringBuilder.append(" AND (upper(g.NAME) LIKE upper(:name) escape '&' OR upper(g.CODE) LIKE upper(:name) escape '&')");
            }
        } else {
            if (StringUtils.isNotEmpty(obj.getName())) {
                stringBuilder.append(" AND upper(g.NAME) LIKE upper(:name) escape '&'");
            }
            if (StringUtils.isNotEmpty(obj.getCode())) {
                stringBuilder.append(" AND upper(g.CODE) LIKE upper(:value) escape '&'");
            }
        }

        stringBuilder.append(" ORDER BY g.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("goodsId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("goodsType", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("unitTypeName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(GoodsDTO.class));

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
        }
        if (StringUtils.isNotEmpty(obj.getCode())) {
            query.setParameter("value", "%" + ValidateUtils.validateKeySearch(obj.getCode()) + "%");
        }
        return query.list();
    }

	/**
	 * Add scalar cac truong sum dung trong bao cao nhap - xuat - ton (import - export - remain)
	 * @param query sql query
	 */
	private void addScalarReportIER(SQLQuery query) {
		query.addScalar("numberTonDauKy", new DoubleType());
		query.addScalar("totalMoneyTonDauKy", new DoubleType());
		query.addScalar("numberNhapTrongKy", new DoubleType());
		query.addScalar("totalMoneyNhapTrongKy", new DoubleType());
		query.addScalar("numberNghiemThuDoiSoat4A", new DoubleType());
		query.addScalar("totalMoneyNghiemThuDoiSoat4A", new DoubleType());
		query.addScalar("numberTraDenBu", new DoubleType());
		query.addScalar("totalMoneyTraDenBu", new DoubleType());
		query.addScalar("numberTonCuoiKy", new DoubleType());
		query.addScalar("totalMoneyTonCuoiKy", new DoubleType());
	}

	private void setDateFromIER(SynStockDailyRemainDTO dto) {
		dto.setDateFrom(new Date(dto.getDateFrom().getTime() - 86400000));
	}
//VietNT_end
}
