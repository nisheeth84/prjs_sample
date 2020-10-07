package com.viettel.aio.dao;

import com.viettel.aio.dto.AIOReportSalaryDTO;
import com.viettel.aio.dto.report.AIOReportDTO;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.utils.ValidateUtils;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.BigDecimalType;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

//VietNT_20190619_create
@EnableTransactionManagement
@Transactional
@Repository("aioReportDAO")
public class AIOReportDAO extends BaseFWDAOImpl<BaseFWModelImpl, Long> {

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    //VietNT_19/06/2019_start
    public List<AIOReportDTO> doSearchRpCostPrice(AIOReportDTO criteria) {
        String paramReportType = "";
        String groupByParamReportType = "";
        if ((criteria.getReportType() != 0)) {
            paramReportType = ", rd.SERIAL serial ";
            groupByParamReportType = ", rd.SERIAL ";
        }

        StringBuilder sql = new StringBuilder()
                .append("select ")
                .append("g.CODE sysGroupCode, ")
                .append("c.CONTRACT_CODE contractCode, ")
                .append("cd.PACKAGE_NAME packageName, ")
                .append("rd.GOODS_CODE goodsCode, rd.GOODS_NAME goodsName, ")
                .append("sum(rd.QUANTITY) quantity, ")
                .append("sum(rd.AMOUNT) / sum(rd.QUANTITY) costPrice, ")
                .append("sum(rd.AMOUNT) amount, ")
                .append("c.PERFORMER_CODE || '-' || c.PERFORMER_NAME performerText ")
                //VietNT_05/08/2019_start
                .append(", rd.stock_trans_code text ")
                .append(paramReportType)
                //VietNT_end
                .append("from AIO_CONTRACT c ")
                .append("LEFT join SYS_GROUP g on c.PERFORMER_GROUP_ID = g.SYS_GROUP_ID ")
                .append("LEFT join AIO_CONTRACT_DETAIL cd on c.CONTRACT_ID = cd.CONTRACT_ID ")
                .append("LEFT join AIO_ACCEPTANCE_RECORDS r on c.CONTRACT_ID = r.CONTRACT_ID ")
                .append("LEFT join AIO_ACCEPTANCE_RECORDS_DETAIL rd on r.ACCEPTANCE_RECORDS_ID = rd.ACCEPTANCE_RECORDS_ID ")
//                //VietNT_05/08/2019_start
//                .append("LEFT join stock_trans s on c.CONTRACT_CODE = s.CONTRACT_CODE ")
//                .append("LEFT join stock_trans_detail sd on s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID ")
//                //VietNT_end
                .append("where 1 = 1 ")
                //VietNT_05/08/2019_start
//                .append("and s.type = 2 and s.status = 2 and s.BUSINESS_TYPE = 11 and rd.GOODS_ID = sd.GOODS_ID ")
                //VietNT_end
                .append("and cd.CONTRACT_DETAIL_ID = r.CONTRACT_DETAIL_ID ")
                .append("and c.STATUS in (0,1,2,3) ")
                .append("and rd.QUANTITY > 0 ");

        if (criteria.getSysGroupId() != null) {
            sql.append("and g.SYS_GROUP_ID = :sysGroupId ");
        }
        if (StringUtils.isNotEmpty(criteria.getContractCode())) {
            sql.append("and c.CONTRACT_CODE = :contractCode ");
        }
        if (criteria.getPackageId() != null) {
            sql.append("and r.PACKAGE_ID = :packageId ");
        }
        if (criteria.getStartDate() != null) {
            sql.append("and trunc(r.END_DATE) >= trunc(:startDate) ");
        }
        if (criteria.getEndDate() != null) {
            sql.append("and trunc(r.END_DATE) <= trunc(:endDate) ");
        }

        sql.append("group by g.CODE, c.CONTRACT_CODE, cd.PACKAGE_NAME, rd.GOODS_CODE, rd.GOODS_NAME, " +
                "rd.GOODS_CODE, rd.GOODS_NAME, c.PERFORMER_CODE || '-' || c.PERFORMER_NAME, rd.stock_trans_code ");
        sql.append(groupByParamReportType);
        sql.append("ORDER BY g.CODE, c.CONTRACT_CODE, cd.PACKAGE_NAME, rd.GOODS_CODE, rd.GOODS_NAME ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (criteria.getStatuses() != null && !criteria.getStatuses().isEmpty()) {
            query.setParameter("statuses", criteria.getStatuses());
            queryCount.setParameter("statuses", criteria.getStatuses());
        }
        if (criteria.getQuantity() != null) {
            query.setParameter("quantity", criteria.getQuantity());
            queryCount.setParameter("quantity", criteria.getQuantity());
        }
        if (criteria.getSysGroupId() != null) {
            query.setParameter("sysGroupId", criteria.getSysGroupId());
            queryCount.setParameter("sysGroupId", criteria.getSysGroupId());
        }
        if (StringUtils.isNotEmpty(criteria.getContractCode())) {
            query.setParameter("contractCode", criteria.getContractCode());
            queryCount.setParameter("contractCode", criteria.getContractCode());
        }
        if (criteria.getPackageId() != null) {
            query.setParameter("packageId", criteria.getPackageId());
            queryCount.setParameter("packageId", criteria.getPackageId());
        }
        if (criteria.getStartDate() != null) {
            query.setParameter("startDate", criteria.getStartDate());
            queryCount.setParameter("startDate", criteria.getStartDate());
        }
        if (criteria.getEndDate() != null) {
            query.setParameter("endDate", criteria.getEndDate());
            queryCount.setParameter("endDate", criteria.getEndDate());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOReportDTO.class));
        query.addScalar("sysGroupCode", new StringType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("packageName", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("costPrice", new DoubleType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("performerText", new StringType());
        query.addScalar("text", new StringType());
        if (criteria.getReportType() != 0) {
            query.addScalar("serial", new StringType());
        }
        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }
    //VietNT_end

    //VietNT_27/06/2019_start
    public List<AIOReportDTO> doSearchRpStock(AIOReportDTO criteria) {
        String detailField = StringUtils.EMPTY;
        String detailGroup = StringUtils.EMPTY;
        if (criteria.getIsDetailRp() != null && criteria.getIsDetailRp() == 1) {
            detailField = "stock_name stockName, serial serial, ";
            detailGroup = ", stock_name, serial ";
        }
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("CODE code, ")
                .append("GOODS_CODE goodsCode, ")
                .append("GOODS_NAME goodsName, ")
                .append("AMOUNT_REAL amountReal, ")
                .append("COST_PRICE_IMPORT costPriceImport, ")
                .append("IMPORT_DATE importDate, ")
                .append("STOCK_TIME stockTime, ")
                //VietNT_11/07/2019_start
                .append("CNT_CONTRACT_CODE cntContractCode, ")
                //VietNT_end
                //VietNT_23/07/2019_start
                .append(detailField)
                //VietNT_end
                .append("sum(SUM_AMOUNT) sumAmount, ")
                .append("COST_PRICE_STOCK costPriceStock, ")
                .append("sum(SUM_COST_PRICE_STOCK) sumCostPriceStock ")
                .append("FROM AIO_STOCK_REPORT ")
                .append("WHERE 1=1 ");

        if (StringUtils.isNotEmpty(criteria.getCode())) {
            sql.append("and CODE = :code ");
        }
        if (StringUtils.isNotEmpty(criteria.getGoodsCode())) {
            sql.append("and GOODS_CODE = :goodsCode ");
        }

        sql.append("group by CODE, GOODS_CODE, AMOUNT_REAL, COST_PRICE_IMPORT, GOODS_NAME, " +
                "IMPORT_DATE, STOCK_TIME, COST_PRICE_STOCK, CNT_CONTRACT_CODE ").append(detailGroup);
        sql.append("ORDER BY CODE, GOODS_CODE , AMOUNT_REAL, COST_PRICE_IMPORT, GOODS_NAME, " +
                "IMPORT_DATE, STOCK_TIME, COST_PRICE_STOCK, CNT_CONTRACT_CODE ").append(detailGroup);

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (StringUtils.isNotEmpty(criteria.getCode())) {
            query.setParameter("code", criteria.getCode());
            queryCount.setParameter("code", criteria.getCode());
        }
        if (StringUtils.isNotEmpty(criteria.getGoodsCode())) {
            query.setParameter("goodsCode", criteria.getGoodsCode());
            queryCount.setParameter("goodsCode", criteria.getGoodsCode());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOReportDTO.class));
        query.addScalar("code", new StringType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("amountReal", new DoubleType());
        query.addScalar("costPriceImport", new DoubleType());
        query.addScalar("importDate", new DateType());
        query.addScalar("stockTime", new LongType());
        query.addScalar("sumAmount", new DoubleType());
        query.addScalar("costPriceStock", new DoubleType());
        query.addScalar("sumCostPriceStock", new DoubleType());
        query.addScalar("cntContractCode", new StringType());
        query.addScalar("goodsName", new StringType());
        if (criteria.getIsDetailRp() != null && criteria.getIsDetailRp() == 1) {
            query.addScalar("stockName", new StringType());
            query.addScalar("serial", new StringType());
        }

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }
    //VietNT_end

    //VietNT_13/07/2019_start
    public List<AIOReportDTO> doSearchRpSalary(AIOReportDTO criteria) {
        StringBuilder sql = new StringBuilder()
                .append("select ")
                .append("sg.AREA_CODE areaCode, ")
                .append("sg.PROVINCE_CODE provinceCode, ")
                .append("sg.GROUP_NAME_LEVEL3 groupNameLv3, ")
                .append("cp.SYS_USER_CODE sysUserCode, ")
                .append("cp.FULL_NAME sysUserName ")
                .append("from AIO_CONTRACT_PAYROLL cp ")
                .append("LEFT join SYS_USER s on cp.SYS_USER_CODE = s.EMPLOYEE_CODE ")
                .append("LEFT join SYS_GROUP sg on sg.SYS_GROUP_ID = s.SYS_GROUP_ID ")
                .append("LEFT join AIO_ACCEPTANCE_RECORDS r on cp.CONTRACT_DETAIL_ID = r.CONTRACT_DETAIL_ID ")
                .append("where 1=1 ");

        this.appendParamQuerySalary(criteria, sql);

        String groupBy = "group by sg.AREA_CODE, sg.PROVINCE_CODE, sg.GROUP_NAME_LEVEL3, cp.SYS_USER_CODE, cp.FULL_NAME ";
//                "cp.IS_PROVINCE_BOUGHT, cp.TYPE ";
        String orderBy = "ORDER BY sg.AREA_CODE, sg.PROVINCE_CODE, sg.GROUP_NAME_LEVEL3, cp.SYS_USER_CODE, cp.FULL_NAME ";
//                "cp.IS_PROVINCE_BOUGHT, cp.TYPE ";
        sql.append(groupBy);
        sql.append(orderBy);

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        this.setParamsForSalaryReport(criteria, query, queryCount);
        query.setResultTransformer(Transformers.aliasToBean(AIOReportDTO.class));
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("groupNameLv3", new StringType());
        query.addScalar("sysUserCode", new StringType());
        query.addScalar("sysUserName", new StringType());

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    private void appendParamQuerySalary(AIOReportDTO criteria, StringBuilder sql) {
        if (criteria.getStartDate() != null) {
            sql.append("and trunc(r.end_date) >= trunc(:startDate) ");
        }

        if (criteria.getEndDate() != null) {
            sql.append("and trunc(r.end_date) <= trunc(:endDate) ");
        }

        if (StringUtils.isNotEmpty(criteria.getAreaCode())) {
            sql.append("and sg.area_code = :areaCode ");
        }

        if (StringUtils.isNotEmpty(criteria.getProvinceCode())) {
            sql.append("and sg.PROVINCE_CODE = :provinceCode ");
        }
    }

    public List<AIOReportDTO> doSearchRpSalaryWithNumber(AIOReportDTO criteria, List<String> userCodes) {
        StringBuilder sql = new StringBuilder()
                .append("select ")
                .append("sg.AREA_CODE areaCode, ")
                .append("sg.PROVINCE_CODE provinceCode, ")
                .append("sg.GROUP_NAME_LEVEL3 groupNameLv3, ")
                .append("cp.SYS_USER_CODE sysUserCode, ")
                .append("cp.FULL_NAME sysUserName, ")
                .append("cp.IS_PROVINCE_BOUGHT isProvinceBought, ")
                .append("cp.TYPE type, ")
                .append("sum(cp.SALARY) salary ")
                .append("from AIO_CONTRACT_PAYROLL cp ")
                .append("LEFT join SYS_USER s on cp.SYS_USER_CODE = s.EMPLOYEE_CODE ")
                .append("LEFT join SYS_GROUP sg on sg.SYS_GROUP_ID = s.SYS_GROUP_ID ")
                .append("LEFT join AIO_ACCEPTANCE_RECORDS r on cp.CONTRACT_DETAIL_ID = r.CONTRACT_DETAIL_ID ")
                .append("where 1=1 ");
        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            sql.append("and cp.SYS_USER_CODE in :codes ");
        }

        this.appendParamQuerySalary(criteria, sql);

        String groupBy = "group by sg.AREA_CODE, sg.PROVINCE_CODE, sg.GROUP_NAME_LEVEL3, cp.SYS_USER_CODE, cp.FULL_NAME, " +
                "cp.IS_PROVINCE_BOUGHT, cp.TYPE ";
        String orderBy = "ORDER BY sg.AREA_CODE, sg.PROVINCE_CODE, sg.GROUP_NAME_LEVEL3, cp.SYS_USER_CODE, cp.FULL_NAME, " +
                "cp.IS_PROVINCE_BOUGHT, cp.TYPE ";
        sql.append(groupBy);
        sql.append(orderBy);

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setParameterList("codes", userCodes);
        }
        if (criteria.getStartDate() != null) {
            query.setParameter("startDate", criteria.getStartDate());
        }

        if (criteria.getEndDate() != null) {
            query.setParameter("endDate", criteria.getEndDate());
        }

        if (StringUtils.isNotEmpty(criteria.getAreaCode())) {
            query.setParameter("areaCode", criteria.getAreaCode());
        }

        if (StringUtils.isNotEmpty(criteria.getProvinceCode())) {
            query.setParameter("provinceCode", criteria.getProvinceCode());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOReportDTO.class));
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("groupNameLv3", new StringType());
        query.addScalar("sysUserCode", new StringType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("isProvinceBought", new LongType());
        query.addScalar("type", new LongType());
        query.addScalar("salary", new DoubleType());

        return query.list();
    }

    public List<AppParamDTO> getDropDownData() {
        StringBuilder sql = new StringBuilder()
                .append("select app_param_id id, code code, name name, PAR_TYPE parType, null text from app_param where par_type in ('AREA') ")
                .append("union all ")
                .append("select cat_province_id id, code code, area_code name, TRANSLATE ('PROVINCE' USING NCHAR_CS) parType, code || ' - ' || name text from cat_province ")
                .append("order by code ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));
        query.addScalar("id", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("parType", new StringType());
        query.addScalar("text", new StringType());
        return query.list();
    }

    public List<AIOReportDTO> doSearchRpSalaryDetail(AIOReportDTO criteria) {
        StringBuilder sql = new StringBuilder()
                .append("select ")
                .append("sg.AREA_CODE areaCode, ")
                .append("sg.AREA_ID areaId, ")
                .append("sg.PROVINCE_CODE provinceCode, ")
                .append("sg.PROVINCE_Id provinceId, ")
                .append("sg.GROUP_NAME_LEVEL3 groupNameLv3, ")
                .append("cp.SYS_USER_CODE sysUserCode, ")
                .append("cp.FULL_NAME sysUserName, ")
                .append("c.CONTRACT_CODE contractCode, ")
                .append("cd.QUANTITY quantity, ")
                .append("cd.PACKAGE_NAME packageName, ")
                .append("cd.contract_detail_id contractDetailId ")
//                .append("cp.IS_PROVINCE_BOUGHT isProvinceBought, ")
//                .append("cp.TYPE type, ")
//                .append("sum(cp.SALARY) salary ")
                .append("from AIO_CONTRACT_PAYROLL cp ")
                .append("LEFT join SYS_USER s on cp.SYS_USER_CODE = s.EMPLOYEE_CODE ")
                .append("LEFT join SYS_GROUP sg on sg.SYS_GROUP_ID = s.SYS_GROUP_ID ")
                .append("LEFT join AIO_ACCEPTANCE_RECORDS r on cp.CONTRACT_DETAIL_ID = r.CONTRACT_DETAIL_ID ")
                .append("LEFT join AIO_CONTRACT c on c.CONTRACT_ID =  cp.CONTRACT_ID ")
                .append("LEFT join AIO_CONTRACT_DETAIL cd on cd.CONTRACT_DETAIL_ID = cp.CONTRACT_DETAIL_ID ")
                .append("where 1=1 ");

        this.appendParamQuerySalary(criteria, sql);
        if (StringUtils.isNotEmpty(criteria.getContractCode())) {
            sql.append("and upper(c.contract_code) like upper(:contractCode) ");
        }

        String groupBy = "group by sg.AREA_CODE, sg.PROVINCE_CODE, sg.GROUP_NAME_LEVEL3, cp.SYS_USER_CODE, cp.FULL_NAME, sg.AREA_ID ,sg.PROVINCE_Id," +
                "c.CONTRACT_CODE, cd.QUANTITY, cd.PACKAGE_NAME, cd.contract_detail_id ";
        String orderBy = "ORDER BY  " +
                "c.CONTRACT_CODE";
        sql.append(groupBy);
        sql.append(orderBy);

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        this.setParamsForSalaryReport(criteria, query, queryCount);
        if (StringUtils.isNotEmpty(criteria.getContractCode())) {
            query.setParameter("contractCode", "%" + criteria.getContractCode() + "%");
            queryCount.setParameter("contractCode", "%" + criteria.getContractCode() + "%");
        }

        this.addScalarQueryRpDetail(query);

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    public List<AIOReportDTO> doSearchRpSalaryDetailWithNumber(AIOReportDTO criteria, Set<String> userCodes, Set<Long> detailIds) {
        StringBuilder sql = new StringBuilder()
                .append("select ")
                .append("sg.AREA_CODE areaCode, ")
                .append("sg.AREA_ID areaId, ")
                .append("sg.PROVINCE_CODE provinceCode, ")
                .append("sg.PROVINCE_ID provinceId, ")
                .append("sg.GROUP_NAME_LEVEL3 groupNameLv3, ")
                .append("cp.SYS_USER_CODE sysUserCode, ")
                .append("cp.FULL_NAME sysUserName, ")
                .append("c.CONTRACT_CODE contractCode, ")
                .append("cd.QUANTITY quantity, ")
                .append("cd.PACKAGE_NAME packageName, ")
                .append("cd.contract_detail_id contractDetailId, ")
                .append("cp.IS_PROVINCE_BOUGHT isProvinceBought, ")
                //VietNT_26/07/2019_start
//                .append("cd.AMOUNT/cd.QUANTITY unitPrice, ")
                .append("cd.AMOUNT amount, ")
                //VietNT_end
                .append("cp.TYPE type, ")
                .append("sum(cp.SALARY) salary ")
                .append("from AIO_CONTRACT_PAYROLL cp ")
                .append("LEFT join SYS_USER s on cp.SYS_USER_CODE = s.EMPLOYEE_CODE ")
                .append("LEFT join SYS_GROUP sg on sg.SYS_GROUP_ID = s.SYS_GROUP_ID ")
                .append("LEFT join AIO_ACCEPTANCE_RECORDS r on cp.CONTRACT_DETAIL_ID = r.CONTRACT_DETAIL_ID ")
                .append("LEFT join AIO_CONTRACT c on c.CONTRACT_ID =  cp.CONTRACT_ID ")
                .append("LEFT join AIO_CONTRACT_DETAIL cd on cd.CONTRACT_DETAIL_ID = cp.CONTRACT_DETAIL_ID ")
                .append("where 1=1 ");
        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            sql.append("and cp.SYS_USER_CODE in :codes ");
            sql.append("and cd.CONTRACT_DETAIL_ID in :detailIds ");
        }

        this.appendParamQuerySalary(criteria, sql);
        if (StringUtils.isNotEmpty(criteria.getContractCode())) {
            sql.append("and upper(c.contract_code) like upper(:contractCode) ");
        }

        String fields = "sg.AREA_CODE, sg.PROVINCE_CODE, sg.GROUP_NAME_LEVEL3, cp.SYS_USER_CODE, cp.FULL_NAME, sg.PROVINCE_ID,sg.AREA_ID ," +
                "c.CONTRACT_CODE, cd.QUANTITY, cd.PACKAGE_NAME, cd.contract_detail_id, cp.IS_PROVINCE_BOUGHT, cp.TYPE," +
                " cd.AMOUNT ";
        sql.append("GROUP BY ").append(fields);
        sql.append("ORDER BY c.CONTRACT_CODE ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setParameterList("codes", userCodes);
            query.setParameterList("detailIds", detailIds);
        }

        if (criteria.getStartDate() != null) {
            query.setParameter("startDate", criteria.getStartDate());
        }

        if (criteria.getEndDate() != null) {
            query.setParameter("endDate", criteria.getEndDate());
        }

        if (StringUtils.isNotEmpty(criteria.getAreaCode())) {
            query.setParameter("areaCode", criteria.getAreaCode());
        }

        if (StringUtils.isNotEmpty(criteria.getProvinceCode())) {
            query.setParameter("provinceCode", criteria.getProvinceCode());
        }
        if (StringUtils.isNotEmpty(criteria.getContractCode())) {
            query.setParameter("contractCode", "%" + criteria.getContractCode() + "%");
        }

        this.addScalarQueryRpDetail(query);
        query.addScalar("isProvinceBought", new LongType());
        query.addScalar("type", new LongType());
        query.addScalar("salary", new DoubleType());
//        query.addScalar("unitPrice", new DoubleType());
        query.addScalar("amount", new DoubleType());

        return query.list();
    }

    private void addScalarQueryRpDetail(SQLQuery query) {
        query.setResultTransformer(Transformers.aliasToBean(AIOReportDTO.class));
        query.addScalar("areaCode", new StringType());
        query.addScalar("areaId", new LongType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("provinceId", new LongType());
        query.addScalar("groupNameLv3", new StringType());
        query.addScalar("sysUserCode", new StringType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("packageName", new StringType());
        query.addScalar("contractDetailId", new LongType());
    }

    private void setParamsForSalaryReport(AIOReportDTO criteria, SQLQuery query, SQLQuery queryCount) {
        if (criteria.getStartDate() != null) {
            query.setParameter("startDate", criteria.getStartDate());
            queryCount.setParameter("startDate", criteria.getStartDate());
        }

        if (criteria.getEndDate() != null) {
            query.setParameter("endDate", criteria.getEndDate());
            queryCount.setParameter("endDate", criteria.getEndDate());
        }

        if (StringUtils.isNotEmpty(criteria.getAreaCode())) {
            query.setParameter("areaCode", criteria.getAreaCode());
            queryCount.setParameter("areaCode", criteria.getAreaCode());
        }

        if (StringUtils.isNotEmpty(criteria.getProvinceCode())) {
            query.setParameter("provinceCode", criteria.getProvinceCode());
            queryCount.setParameter("provinceCode", criteria.getProvinceCode());
        }
    }
    //VietNT_end

    public List<AIOReportDTO> getAutoCompleteSysGroupLevel(AIOReportDTO dto, List<String> groupIdList) {
        StringBuilder sql = new StringBuilder()
                .append("select ST.SYS_GROUP_ID sysGroupId, (ST.CODE || '-' || ST.NAME) sysGroupText, ST.NAME sysGroupName, ST.CODE sysGroupCode ")
                .append("from CTCT_CAT_OWNER.SYS_GROUP ST ")
                .append("where ST.STATUS=1 and ROWNUM <=10 and ST.SYS_GROUP_ID IN (:groupIdList) ");
        if (StringUtils.isNotEmpty(dto.getSysGroupName())) {
            sql.append("and (upper(ST.NAME) like upper(:sysGroupName) escape '&' or upper(ST.CODE) like upper(:sysGroupName) escape '&') ");
        }
        sql.append("order by ST.CODE");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (StringUtils.isNotEmpty(dto.getSysGroupName())) {
            query.setParameter("sysGroupName", "%" + ValidateUtils.validateKeySearch(dto.getSysGroupName()) + "%");
        }
        query.setParameterList("groupIdList", groupIdList);

        query.setResultTransformer(Transformers.aliasToBean(AIOReportDTO.class));
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupText", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("sysGroupCode", new StringType());

        return query.list();
    }

    public List<AIOReportDTO> doSearchCumulativeRevenueIndustryChart(Long performerGroupId, String startDate, String endDate) {
        StringBuilder sql = new StringBuilder()
                .append("select cs.INDUSTRY_NAME pointName, round(sum(r.AMOUNT)/1.1, 0) totalAmount ")
                .append("from AIO_CONFIG_SERVICE cs, AIO_CONTRACT c, AIO_ACCEPTANCE_RECORDS r, AIO_PACKAGE p, SYS_GROUP s ")
                .append("where cs.CODE = p.SERVICE_CODE and ")
                .append("r.PACKAGE_ID = p.AIO_PACKAGE_ID and ")
                .append("c.CONTRACT_ID = r.CONTRACT_ID and ")
                .append("c.PERFORMER_GROUP_ID = s.SYS_GROUP_ID and ")
                .append("c.STATUS = 3 ");
//                .append("and (c.is_internal IS NULL OR c.is_internal != 1) ");
        if (performerGroupId != null) {
            sql.append("and c.PERFORMER_GROUP_ID in(:performerGroupId) ");
        }
        if (StringUtils.isNotEmpty(startDate)) {
            sql.append("and trunc(r.END_DATE) >= to_date (:startDate,'dd/mm/yyyy') ");
        }
        if (StringUtils.isNotEmpty(endDate)) {
            sql.append("and trunc(r.END_DATE) <= to_date (:endDate,'dd/mm/yyyy') ");
        }
        sql.append("group by cs.INDUSTRY_NAME");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (performerGroupId != null) {
            query.setParameter("performerGroupId", performerGroupId);
        }
        if (StringUtils.isNotEmpty(startDate)) {
            query.setParameter("startDate", startDate);
        }
        if (StringUtils.isNotEmpty(endDate)) {
            query.setParameter("endDate", endDate);
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOReportDTO.class));
        query.addScalar("pointName", new StringType());
        query.addScalar("totalAmount", new LongType());

        return query.list();
    }

    public List<AIOReportDTO> doSearchDevelopmentChart(Long performerGroupId, String startDate, String endDate) {
        List<AIOReportDTO> list = new ArrayList<>();
        AIOReportDTO dto = new AIOReportDTO();
        boolean isConditionBefore = false;

        StringBuilder sql = new StringBuilder()
                .append("with tbl as(select ")
                .append("sum(case when c.type = 2 and c.status !=4 then 1 else 0 end) KH_TM, ")
                .append("sum(case when c.status = 3 and c.type = 2 and ")
                .append("((cp.END_DATE - cp.START_DATE)*24) <=24 then 1 else 0 end) thuchien_TM_1ngay, ")
                .append("sum(case when c.status = 3 and c.type = 2 and ")
                .append("((cp.END_DATE - cp.START_DATE)*24) <=48 then 1 else 0 end) thuchien_TM_2ngay, ")
                .append("sum(case when c.status = 3 and c.type = 2 and ")
                .append("((cp.END_DATE - cp.START_DATE)*24) <=72 then 1 else 0 end) thuchien_TM_3ngay, ")
                .append("sum(case when c.type = 1 and c.status !=4 then 1 else 0 end) KH_DV, ")
                .append("sum(case when c.status = 3 and c.type = 1 ")
                .append("and ((cp.END_DATE - cp.START_DATE)*24) <=24 then 1 else 0 end) thuchien_DV_1ngay, ")
                .append("sum(case when c.status = 3 and c.type = 1 ")
                .append("and ((cp.END_DATE - cp.START_DATE)*24) <=48 then 1 else 0 end) thuchien_DV_2ngay, ")
                .append("sum(case when c.status = 3 and c.type = 1 ")
                .append("and ((cp.END_DATE - cp.START_DATE)*24) <=72 then 1 else 0 end) thuchien_DV_3ngay ")
                .append("from AIO_CONTRACT c left join AIO_CONTRACT_PERFORM_DATE cp on c.CONTRACT_ID = cp.CONTRACT_ID ");
        if (performerGroupId != null || StringUtils.isNotEmpty(startDate) || StringUtils.isNotEmpty(endDate)) {
            sql.append("where ");
        }
        if (performerGroupId != null) {
            sql.append("c.PERFORMER_GROUP_ID in(:performerGroupId) ");
            isConditionBefore = true;
        }
        sql.append(isConditionBefore ? "and " : "");
        if (StringUtils.isNotEmpty(startDate)) {
            sql.append("trunc(c.CREATED_DATE) >= to_date (:startDate,'dd/mm/yyyy') ");
            isConditionBefore = true;
        }
        sql.append(isConditionBefore ? "and " : "");
        if (StringUtils.isNotEmpty(endDate)) {
            sql.append("trunc(c.CREATED_DATE) <= to_date (:endDate,'dd/mm/yyyy') ");
        }
        sql.append(") select 80 tradePlanDay1, round(decode(KH_TM,0,0,100*thuchien_TM_1ngay/KH_TM),2) tradeRealityDay1, ")
                .append("80 servicePlanDay1, round(decode(KH_DV,0,0,100*thuchien_DV_1ngay/KH_DV),2) serviceRealityDay1, ")
                .append("95 tradePlanDay2, round(decode(KH_TM,0,0,100*thuchien_TM_2ngay/KH_TM),2) tradeRealityDay2, ")
                .append("95 servicePlanDay2, round(decode(KH_DV,0,0,100*thuchien_DV_2ngay/KH_DV),2) serviceRealityDay2, ")
                .append("100 tradePlanDay3, round(decode(KH_TM,0,0,100*thuchien_TM_3ngay/KH_TM),2) tradeRealityDay3, ")
                .append("100 servicePlanDay3, round(decode(KH_DV,0,0,100*thuchien_DV_3ngay/KH_DV),2) serviceRealityDay3 ")
                .append("from tbl");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (performerGroupId != null) {
            query.setParameter("performerGroupId", performerGroupId);
        }
        if (StringUtils.isNotEmpty(startDate)) {
            query.setParameter("startDate", startDate);
        }
        if (StringUtils.isNotEmpty(endDate)) {
            query.setParameter("endDate", endDate);
        }

        query.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
        List<Map<String, BigDecimal>> result = query.list();

        if (result != null && !result.isEmpty()) {
            dto.setDeploymentMap(result.get(0));
            list.add(dto);
        }

        return list;
    }

    public List<AIOReportDTO> doSearchRevenueProportionChart(Long performerGroupId, String startDate, String endDate) {
        StringBuilder sql = new StringBuilder()
                .append("select cs.NAME pointName, round(sum(r.AMOUNT)/1.1, 0) totalAmount ")
                .append("from AIO_CONFIG_SERVICE cs, AIO_CONTRACT c, AIO_ACCEPTANCE_RECORDS r, AIO_PACKAGE p ")
                .append("where cs.CODe = p.SERVICE_CODE and ")
                .append("r.PACKAGE_ID = p.AIO_PACKAGE_ID and ")
                .append("c.CONTRACT_ID = r.CONTRACT_ID and ")
                .append("cs.TYPE = 1 and c.STATUS = 3 ");
//                .append("and (c.is_internal IS NULL OR c.is_internal != 1) ");
        if (performerGroupId != null) {
            sql.append("and c.PERFORMER_GROUP_ID in(:performerGroupId) ");
        }
        if (StringUtils.isNotEmpty(startDate)) {
            sql.append("and trunc(r.END_DATE) >= to_date (:startDate,'dd/mm/yyyy') ");
        }
        if (StringUtils.isNotEmpty(endDate)) {
            sql.append("and trunc(r.END_DATE) <= to_date (:endDate,'dd/mm/yyyy') ");
        }
        sql.append("group by cs.NAME");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (performerGroupId != null) {
            query.setParameter("performerGroupId", performerGroupId);
        }
        if (StringUtils.isNotEmpty(startDate)) {
            query.setParameter("startDate", startDate);
        }
        if (StringUtils.isNotEmpty(endDate)) {
            query.setParameter("endDate", endDate);
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOReportDTO.class));
        query.addScalar("pointName", new StringType());
        query.addScalar("totalAmount", new LongType());

        return query.list();
    }

    public List<AIOReportDTO> doSearchCustomerReuseChart(Long performerGroupId, String startDate, String endDate) {
        List<AIOReportDTO> list = new ArrayList<>();
        AIOReportDTO dto = new AIOReportDTO();

        StringBuilder sql = new StringBuilder()
                .append("with tbl as( select c.CUSTOMER_ID mkh, count(*) solan ")
                .append("from AIO_CONTRACT c LEFT join AIO_ACCEPTANCE_RECORDS a on c.CONTRACT_ID = a.CONTRACT_ID ")
                .append("where c.STATUS = 3 ");
        if (performerGroupId != null) {
            sql.append("and c.PERFORMER_GROUP_ID in(:performerGroupId) ");
        }
        if (StringUtils.isNotEmpty(startDate)) {
            sql.append("and trunc(a.END_DATE) >= to_date (:startDate,'dd/mm/yyyy') ");
        }
        if (StringUtils.isNotEmpty(endDate)) {
            sql.append("and trunc(a.END_DATE) <= to_date (:endDate,'dd/mm/yyyy') ");
        }
        sql.append("group by c.CUSTOMER_ID) ")
                .append("select count(mkh) TKH, ")
                .append("sum(case when solan = 1 then 1 else 0 end) amount1Time, ")
                .append("sum(case when solan = 2 then 1 else 0 end) amount2Tines, ")
                .append("sum(case when solan = 3 then 1 else 0 end) amount3Times, ")
                .append("sum(case when solan > 3 then 1 else 0 end) amountMore3Times ")
                .append("from tbl ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (performerGroupId != null) {
            query.setParameter("performerGroupId", performerGroupId);
        }
        if (StringUtils.isNotEmpty(startDate)) {
            query.setParameter("startDate", startDate);
        }
        if (StringUtils.isNotEmpty(endDate)) {
            query.setParameter("endDate", endDate);
        }

        query.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
        List<Map<String, BigDecimal>> result = query.list();

        if (result != null && !result.isEmpty()) {
            dto.setCustomerReuseMap(result.get(0));
            list.add(dto);
        }

        return list;
    }

    public List<AIOReportDTO> doSearchTopThreeCitiesChart(AIOReportDTO dto, String startDate, String endDate) {
//        StringBuilder sql = new StringBuilder()
//                .append("select mpd.SYS_GROUP_CODE pointName, sum(ar.AMOUNT) totalTh, sum(mpd.TARGETS_AMOUNT + mpd.TARGETS_AMOUNT_DV) totalKh, ")
//                .append("round((sum(ar.AMOUNT) / nvl(sum(mpd.TARGETS_AMOUNT + mpd.TARGETS_AMOUNT_DV),1))*100,2) goodCityAmount ")
//                .append("from AIO_MONTH_PLAN mp, AIO_MONTH_PLAN_DETAIL mpd, AIO_CONTRACT c, AIO_ACCEPTANCE_RECORDS ar ")
//                .append("where mp.AIO_MONTH_PLAN_ID = mpd.MONTH_PLAN_ID ")
//                .append("and mpd.SYS_GROUP_ID = c.PERFORMER_GROUP_ID ")
//                .append("and c.CONTRACT_ID = ar.CONTRACT_ID and mp.STATUS = 1 and c.STATUS = 3 ");
//        if (dto.getMonth() != null) {
//            sql.append("and mp.MONTH = :month ");
//        }
//        if (dto.getYear() != null) {
//            sql.append("and mp.YEAR = :year ");
//        }
//        if (StringUtils.isNotEmpty(startDate)) {
//            sql.append("and trunc(ar.END_DATE) >= to_date (:startDate,'dd/mm/yyyy') ");
//        }
//        if (StringUtils.isNotEmpty(endDate)) {
//            sql.append("and trunc(ar.END_DATE) <= to_date (:endDate,'dd/mm/yyyy') ");
//        }
//        sql.append("group by mpd.SYS_GROUP_CODE ")
//                .append("ORDER BY round((sum(ar.AMOUNT) / nvl(sum(mpd.TARGETS_AMOUNT + mpd.TARGETS_AMOUNT_DV),1))*100,2) desc");

        StringBuilder sql = new StringBuilder()
                .append("WITH ct AS( ")
                .append("SELECT ")
                .append("	mpd.SYS_GROUP_ID, ")
                .append("	mpd.SYS_GROUP_CODE, ")
                .append("	NVL(mpd.TARGETS_ME, 0) + NVL(mpd.TARGETS_SH, 0) + NVL(mpd.TARGETS_NLMT, 0) + NVL(mpd.TARGETS_ICT, 0) + NVL(mpd.TARGETS_MS, 0) kh ")
                .append("FROM ")
                .append("	AIO_MONTH_PLAN mp, ")
                .append("	AIO_MONTH_PLAN_DETAIL mpd ")
                .append("WHERE ")
                .append("	mp.AIO_MONTH_PLAN_ID = mpd.MONTH_PLAN_ID ")
                .append("	AND mp.STATUS = 1 ");
        if (dto.getMonth() != null) {
            sql.append("and mp.MONTH = :month ");
        }
        if (dto.getYear() != null) {
            sql.append("AND mp.YEAR = :year), ");
        }

        sql.append("th AS( ")
                .append("SELECT ")
                .append("	c.PERFORMER_GROUP_ID, ")
                .append("	NVL(ROUND(SUM(ar.AMOUNT)/ 1.1, 0), 0) amount ")
                .append("FROM ")
                .append("	AIO_CONTRACT c, ")
                .append("	AIO_ACCEPTANCE_RECORDS ar ")
                .append("WHERE ")
                .append("	c.CONTRACT_ID = ar.CONTRACT_ID ")
                .append("	AND c.STATUS = 3 ");
//                .append("	and (c.is_internal IS NULL OR c.is_internal != 1) ");

        if (StringUtils.isNotEmpty(startDate)) {
            sql.append("AND TRUNC(ar.END_DATE) >= TO_DATE (:startDate,'dd/mm/yyyy') ");
        }
        if (StringUtils.isNotEmpty(endDate)) {
            sql.append("AND TRUNC(ar.END_DATE) <= TO_DATE (:endDate,'dd/mm/yyyy') ");
        }

        sql.append("GROUP BY ")
                .append("	c.PERFORMER_GROUP_ID) ")
                .append("SELECT ")
                .append("	ct.SYS_GROUP_CODE pointName, ")
                .append("	th.amount totalTh, ")
                .append("	ct.kh totalKh, ")
                .append("	NVL(ROUND(DECODE( ct.kh, 0, 0, 100 * th.amount / ct.kh), 2), 0) goodCityAmount ")
                .append("FROM ")
                .append("	ct ")
                .append("LEFT JOIN th ON ")
                .append("	ct.SYS_GROUP_ID = th.PERFORMER_GROUP_ID ")
                .append("ORDER BY ")
                .append("	goodCityAmount DESC ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (dto.getMonth() != null) {
            query.setParameter("month", dto.getMonth());
        }
        if (dto.getYear() != null) {
            query.setParameter("year", dto.getYear());
        }
        if (StringUtils.isNotEmpty(startDate)) {
            query.setParameter("startDate", startDate);
        }
        if (StringUtils.isNotEmpty(endDate)) {
            query.setParameter("endDate", endDate);
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOReportDTO.class));
        query.addScalar("pointName", new StringType());
        query.addScalar("goodCityAmount", new BigDecimalType());
        query.addScalar("totalTh", new BigDecimalType());
        query.addScalar("totalKh", new BigDecimalType());

        return query.list();
    }

    public List<AIOReportDTO> doSearchRevenueExport(Long performerGroupId, String startDate, String endDate) {
        StringBuilder sql = new StringBuilder()
                .append("select s.CODE code, cs.INDUSTRY_NAME pointName, sum(r.AMOUNT) totalAmount ")
                .append("from AIO_CONFIG_SERVICE cs, AIO_CONTRACT c, AIO_ACCEPTANCE_RECORDS r, AIO_PACKAGE p, SYS_GROUP s ")
                .append("where cs.CODe = p.SERVICE_CODE and ")
                .append("r.PACKAGE_ID = p.AIO_PACKAGE_ID and ")
                .append("c.CONTRACT_ID = r.CONTRACT_ID and ")
                .append("c.PERFORMER_GROUP_ID = s.SYS_GROUP_ID and ")
                .append("c.STATUS = 3 ");
        if (performerGroupId != null) {
            sql.append("and c.PERFORMER_GROUP_ID in(:performerGroupId) ");
        }
        if (StringUtils.isNotEmpty(startDate)) {
            sql.append("and trunc(r.END_DATE) >= to_date (:startDate,'dd/mm/yyyy') ");
        }
        if (StringUtils.isNotEmpty(endDate)) {
            sql.append("and trunc(r.END_DATE) <= to_date (:endDate,'dd/mm/yyyy') ");
        }
        sql.append("group by s.CODE, cs.INDUSTRY_NAME");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (performerGroupId != null) {
            query.setParameter("performerGroupId", performerGroupId);
        }
        if (StringUtils.isNotEmpty(startDate)) {
            query.setParameter("startDate", startDate);
        }
        if (StringUtils.isNotEmpty(endDate)) {
            query.setParameter("endDate", endDate);
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOReportDTO.class));
        query.addScalar("code", new StringType());
        query.addScalar("pointName", new StringType());
        query.addScalar("totalAmount", new LongType());

        return query.list();
    }

    public List<AIOReportDTO> doSearchRevenueProportionExport(Long performerGroupId, String startDate, String endDate) {
        StringBuilder sql = new StringBuilder()
                .append("select s.CODE code, cs.NAME pointName, sum(r.AMOUNT) totalAmount ")
                .append("from AIO_CONFIG_SERVICE cs, AIO_CONTRACT c, AIO_ACCEPTANCE_RECORDS r, AIO_PACKAGE p, SYS_GROUP s ")
                .append("where cs.CODe = p.SERVICE_CODE and ")
                .append("r.PACKAGE_ID = p.AIO_PACKAGE_ID and ")
                .append("c.CONTRACT_ID = r.CONTRACT_ID and ")
                .append("c.PERFORMER_GROUP_ID =  s.SYS_GROUP_ID and ")
                .append("cs.TYPE = 1 and c.STATUS = 3 ");
        if (performerGroupId != null) {
            sql.append("and c.PERFORMER_GROUP_ID in(:performerGroupId) ");
        }
        if (StringUtils.isNotEmpty(startDate)) {
            sql.append("and trunc(r.END_DATE) >= to_date (:startDate,'dd/mm/yyyy') ");
        }
        if (StringUtils.isNotEmpty(endDate)) {
            sql.append("and trunc(r.END_DATE) <= to_date (:endDate,'dd/mm/yyyy') ");
        }
        sql.append("group by s.CODE, cs.NAME");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (performerGroupId != null) {
            query.setParameter("performerGroupId", performerGroupId);
        }
        if (StringUtils.isNotEmpty(startDate)) {
            query.setParameter("startDate", startDate);
        }
        if (StringUtils.isNotEmpty(endDate)) {
            query.setParameter("endDate", endDate);
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOReportDTO.class));
        query.addScalar("code", new StringType());
        query.addScalar("pointName", new StringType());
        query.addScalar("totalAmount", new LongType());

        return query.list();
    }

    public List<AIOReportSalaryDTO> doSearchAIORpSalary(AIOReportDTO criteria) {
        StringBuilder sql = new StringBuilder()
                .append("select ")
                .append("sg.REPORT_SARALY_ID reportSaralyId, ")
                .append("sg.AREA_CODE areaCode, ")
                .append("sg.PROVINCE_CODE provinceCode, ")
                .append("sg.NAME name, ")
                .append("sg.CONTRACT_CODE contractCode, ")
                .append("sg.PACKAGE_NAME packageName, ")
                .append("sg.QUANTITY quantity, ")
                .append("sg.PRICE price, ")
                .append("sg.AMOUNT amount, ")
                .append("sg.REVENUE revenue, ")
                .append("sg.IS_PROVINCE_BOUGHT isProvinceBought, ")
                .append("sg.BH bh, ")
                .append("sg.MA_BH maBh, ")
                .append("sg.TH th, ")
                .append("sg.MA_TH maTh, ")
                .append("sg.QLK qlk, ")
                .append("sg.MA_QLK maQlk, ")
                .append("sg.AIO aio, ")
                .append("sg.MA_AIO maAio, ")
                .append("sg.GD gd, ")
                .append("sg.MA_GD maGd, ")
                .append("sg.END_DATE endDate, ")
                .append("(select full_name from sys_user where login_name = sg.MA_BH) tenBh, ")
                .append("(select full_name from sys_user where login_name = sg.MA_TH) tenTh, ")
                .append("(select full_name from sys_user where login_name = sg.MA_QLK) tenQlk, ")
                .append("(select full_name from sys_user where login_name = sg.MA_AIO) tenAio, ")
                .append("(select full_name from sys_user where login_name = sg.MA_GD) tenGd ")
                .append("from AIO_REPORT_SARALY sg ")
                .append("where 1=1 ");

        if (StringUtils.isNotEmpty(criteria.getContractCode())) {
            sql.append("and upper(sg.contract_code) like upper(:contractCode) ");
        }
        if (criteria.getStartDate() != null) {
            sql.append("and trunc(sg.end_date) >= trunc(:startDate) ");
        }

        if (criteria.getEndDate() != null) {
            sql.append("and trunc(sg.end_date) <= trunc(:endDate) ");
        }

        if (StringUtils.isNotEmpty(criteria.getAreaCode())) {
            sql.append("and sg.area_code = :areaCode ");
        }

        if (StringUtils.isNotEmpty(criteria.getProvinceCode())) {
            sql.append("and sg.PROVINCE_CODE = :provinceCode ");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (criteria.getStartDate() != null) {
            query.setParameter("startDate", criteria.getStartDate());
            queryCount.setParameter("startDate", criteria.getStartDate());
        }

        if (criteria.getEndDate() != null) {
            query.setParameter("endDate", criteria.getEndDate());
            queryCount.setParameter("endDate", criteria.getEndDate());

        }

        if (StringUtils.isNotEmpty(criteria.getAreaCode())) {
            query.setParameter("areaCode", criteria.getAreaCode());
            queryCount.setParameter("areaCode", criteria.getAreaCode());
        }

        if (StringUtils.isNotEmpty(criteria.getProvinceCode())) {
            query.setParameter("provinceCode", criteria.getProvinceCode());
            queryCount.setParameter("provinceCode", criteria.getProvinceCode());
        }
        if (StringUtils.isNotEmpty(criteria.getContractCode())) {
            query.setParameter("contractCode", "%" + criteria.getContractCode() + "%");
            queryCount.setParameter("contractCode", "%" + criteria.getContractCode() + "%");
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOReportSalaryDTO.class));
        query.addScalar("reportSaralyId", new LongType());
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("packageName", new StringType());
        query.addScalar("quantity", new LongType());
        query.addScalar("price", new DoubleType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("revenue", new DoubleType());
        query.addScalar("isProvinceBought", new LongType());
        query.addScalar("bh", new DoubleType());
        query.addScalar("maBh", new StringType());
        query.addScalar("th", new DoubleType());
        query.addScalar("maTh", new StringType());
        query.addScalar("qlk", new DoubleType());
        query.addScalar("maQlk", new StringType());
        query.addScalar("aio", new DoubleType());
        query.addScalar("maAio", new StringType());
        query.addScalar("gd", new DoubleType());
        query.addScalar("maGd", new StringType());

        query.addScalar("tenBh", new StringType());
        query.addScalar("tenTh", new StringType());
        query.addScalar("tenQlk", new StringType());
        query.addScalar("tenAio", new StringType());
        query.addScalar("tenGd", new StringType());

        query.addScalar("endDate", new DateType());

        this.setPageSize(criteria, query, queryCount);
        return query.list();
    }

    //tatph - start - 17/12/2019
    public List<AIOReportDTO> exportReportSalary(AIOReportDTO criteria) {
        StringBuilder sql = new StringBuilder()
                .append(" with th as")
                .append(" (select s.AREA_CODE, " +
                        "s.PROVINCE_CODE, " +
                        "s.NAME, " +
                        "c.CONTRACT_CODE, " +
                        "cd.PACKAGE_NAME, " +
                        "nvl(cd.QUANTITY, 0) quantity, " +
                        "nvl(cd.AMOUNT, 0) amount, " +
                        "DECODE(cd.QUANTITY, 0, 0, NVL(cd.AMOUNT / cd.QUANTITY, 0)) price, " +
                        "cp.REVENUE, " +
                        "cp.IS_PROVINCE_BOUGHT, " +
                        "cp.SALARY, " +
                        "cp.SYS_USER_CODE ")
                .append(" from  AIO_CONTRACT_PAYROLL cp ")
                .append(" LEFT join SYS_USER su on cp.SYS_USER_CODE = su.EMPLOYEE_CODE ")
                .append(" LEFT join SYS_GROUP s on su.SYS_GROUP_ID = s.SYS_GROUP_ID ")
                .append(" LEFT join AIO_CONTRACT c on c.CONTRACT_ID =  cp.CONTRACT_ID ")
                .append(" LEFT join AIO_CONTRACT_DETAIL cd on cd.CONTRACT_DETAIL_ID = cp.CONTRACT_DETAIL_ID")
                .append(" LEFT join AIO_CONTRACT_PERFORM_DATE cpd on c.CONTRACT_ID = cpd.CONTRACT_ID ")
                .append(" where 1=1 ")
                .append(" and cp.TYPE = 2 ");
        if (criteria.getAreaCode() != null) {
            sql.append(" and s.AREA_CODE = :lstAreaCode ");
        }
        if (criteria.getProvinceCode() != null) {
            sql.append(" and s.PROVINCE_CODE = :lstProvinceCode ");
        }
        if (criteria.getContractCode() != null) {
            sql.append(" and c.CONTRACT_CODE = :lstContractCode ");
        }
//        if(dto != null) {
//        sql.append(" and cp.CONTRACT_DETAIL_ID = :contractDetailId ");
//        }
        if (criteria.getStartDate() != null) {
//            sql.append(" and trunc(cpd.END_DATE)>= to_date (:startDate,'dd/mm/yyyy')");
            sql.append(" and trunc(cpd.END_DATE)>= trunc(:startDate) ");
        }
        if (criteria.getEndDate() != null) {
//            sql.append(" and trunc(cpd.END_DATE)<= to_date (:endDate,'dd/mm/yyyy') ");
            sql.append(" and trunc(cpd.END_DATE)<= trunc(:endDate) ");
        }
        sql.append(" ), ")
                .append(" bh as (")
                .append(" select c.CONTRACT_CODE, cd.PACKAGE_NAME,cp.SALARY,cp.SYS_USER_CODE ")
                .append(" from  AIO_CONTRACT_PAYROLL cp ")
                .append(" LEFT join AIO_CONTRACT c on c.CONTRACT_ID =  cp.CONTRACT_ID ")
                .append(" LEFT join AIO_CONTRACT_DETAIL cd on cd.CONTRACT_DETAIL_ID = cp.CONTRACT_DETAIL_ID ")
                .append(" where 1=1 and cp.TYPE = 1 ")
                .append(" ),")
                .append(" aio as ( ")
                .append(" select c.CONTRACT_CODE, cd.PACKAGE_NAME,cp.SALARY,cp.SYS_USER_CODE ")
                .append(" from  AIO_CONTRACT_PAYROLL cp ")
                .append(" LEFT join AIO_CONTRACT c on c.CONTRACT_ID =  cp.CONTRACT_ID ")
                .append(" LEFT join AIO_CONTRACT_DETAIL cd on cd.CONTRACT_DETAIL_ID = cp.CONTRACT_DETAIL_ID ")
                .append(" where 1=1 and cp.TYPE = 3 ")
                .append(" ), ")
                .append(" gd as ( ")
                .append(" select c.CONTRACT_CODE, cd.PACKAGE_NAME,cp.SALARY,cp.SYS_USER_CODE ")
                .append(" from  AIO_CONTRACT_PAYROLL cp ")
                .append(" LEFT join AIO_CONTRACT c on c.CONTRACT_ID =  cp.CONTRACT_ID ")
                .append(" LEFT join AIO_CONTRACT_DETAIL cd on cd.CONTRACT_DETAIL_ID = cp.CONTRACT_DETAIL_ID ")
                .append(" where 1=1 and cp.TYPE = 4 ")
                .append(" ), ")
                .append(" qlk as ( ")
                .append(" select c.CONTRACT_CODE, cd.PACKAGE_NAME,cp.SALARY,cp.SYS_USER_CODE ")
                .append(" from  AIO_CONTRACT_PAYROLL cp ")
                .append(" LEFT join AIO_CONTRACT c on c.CONTRACT_ID =  cp.CONTRACT_ID ")
                .append(" LEFT join AIO_CONTRACT_DETAIL cd on cd.CONTRACT_DETAIL_ID = cp.CONTRACT_DETAIL_ID ")
                .append(" where 1=1 and cp.TYPE = 5 ")
                .append(" ) ")
                .append(" select " +
                        "th.AREA_CODE areaCode, " +
                        "th.PROVINCE_CODE provinceCode, " +
                        "th.NAME name, " +
                        "th.CONTRACT_CODE contractCode, " +
                        "th.PACKAGE_NAME packageName, " +
                        "th.quantity quantity, " +
                        "th.amount amount, " +
                        "th.price price, " +
                        "th.REVENUE revenue, " +
                        "th.IS_PROVINCE_BOUGHT isProvinceBought, " +
                        " bh.SALARY salaryBh, " +
                        "bh.SYS_USER_CODE sysUserCodeBh, " +
                        "th.SALARY salaryTh, " +
                        "th.SYS_USER_CODE sysUserCodeTh, " +
                        "qlk.SALARY salaryQl, " +
                        "qlk.SYS_USER_CODE sysUserCodeQl, " +
                        "aio.SALARY salaryAio, " +
                        "aio.SYS_USER_CODE sysUserCodeAio, " +
                        "gd.SALARY salaryGd, " +
                        "gd.SYS_USER_CODE sysUserCodeGd ")
                .append(" from th ")
                .append(" LEFT join bh on th.CONTRACT_CODE = bh.CONTRACT_CODE and th.PACKAGE_NAME = bh.PACKAGE_NAME ")
                .append(" LEFT join aio on th.CONTRACT_CODE = aio.CONTRACT_CODE and th.PACKAGE_NAME = aio.PACKAGE_NAME ")
                .append(" LEFT join gd on th.CONTRACT_CODE = gd.CONTRACT_CODE and th.PACKAGE_NAME = gd.PACKAGE_NAME ")
                .append(" LEFT join qlk on th.CONTRACT_CODE = qlk.CONTRACT_CODE and th.PACKAGE_NAME = qlk.PACKAGE_NAME ")
                .append(" ORDER BY th.AREA_CODE, th.PROVINCE_CODE,th.NAME, th.CONTRACT_CODE, th.PACKAGE_NAME ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
        query.setResultTransformer(Transformers.aliasToBean(AIOReportDTO.class));
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("packageName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("price", new DoubleType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("revenue", new DoubleType());
        query.addScalar("isProvinceBought", new LongType());

        query.addScalar("salaryBh", new DoubleType());
        query.addScalar("sysUserCodeBh", new StringType());

        query.addScalar("salaryTh", new DoubleType());
        query.addScalar("sysUserCodeTh", new StringType());

        query.addScalar("salaryQl", new DoubleType());
        query.addScalar("sysUserCodeQl", new StringType());

        query.addScalar("salaryAio", new DoubleType());
        query.addScalar("sysUserCodeAio", new StringType());

        query.addScalar("salaryGd", new DoubleType());
        query.addScalar("sysUserCodeGd", new StringType());

        if (criteria.getAreaCode() != null) {
            query.setParameter("lstAreaCode", criteria.getAreaCode());
            queryCount.setParameter("lstAreaCode", criteria.getAreaCode());
        }
        if (criteria.getProvinceCode() != null) {
            query.setParameter("lstProvinceCode", criteria.getProvinceCode());
            queryCount.setParameter("lstProvinceCode", criteria.getProvinceCode());
        }
        if (criteria.getContractCode() != null) {
            query.setParameter("lstContractCode", criteria.getContractCode());
            queryCount.setParameter("lstContractCode", criteria.getContractCode());
        }
//        if(dto != null) {
//        	query.setParameter("contractDetailId", dto);
//        }
//
        if (criteria.getStartDate() != null) {
            query.setParameter("startDate", criteria.getStartDate());
            queryCount.setParameter("startDate", criteria.getStartDate());
        }
        if (criteria.getEndDate() != null) {
            queryCount.setParameter("endDate", criteria.getEndDate());
            query.setParameter("endDate", criteria.getEndDate());
        }
        this.setPageSize(criteria, query, queryCount);
        return query.list();
    }

    public List<AIOReportDTO> doSearchTopThreeGroupChart(AIOReportDTO dto, String startDate, String endDate) {

        StringBuilder sql = new StringBuilder()
                .append(" with " +
                        "ct as( " +
                        "select spd.SYS_GROUP_ID, sg.name, sg.SHORTCUT_NAME, sum(nvl(spd.TARGETS_ME,0) + nvl(spd.TARGETS_SH,0) + nvl(spd.TARGETS_NLMT,0) + nvl(spd.TARGETS_ICT,0) + nvl(spd.TARGETS_MS,0))  kh " +
                        "from AIO_STAFF_PLAN sp, AIO_STAFF_PLAN_DETAIL spd, SYS_GROUP sg " +
                        "where " +
                        "sp.STAFF_PLAN_ID = spd.AIO_STAFF_PLAN_ID and " +
                        "spd.SYS_GROUP_ID = sg.SYS_GROUP_ID and " +
                        "sp.STATUS = 1 ");
        if (dto.getMonth() != null) {
            sql.append("and sp.MONTH = :month ");
        }
        if (dto.getYear() != null) {
            sql.append("and sp.YEAR = :year ");
        }
        if (dto.getSysGroupId() != null) {
            sql.append("and sp.SYS_GROUP_ID = :sysGroupId ");
        }
        sql.append("group by spd.SYS_GROUP_ID, sg.name,sg.SHORTCUT_NAME), " +
                "th as( " +
                "select su.SYS_GROUP_ID,  round(sum(ar.AMOUNT)/1.1,0) amount " +
                "from AIO_CONTRACT c, AIO_ACCEPTANCE_RECORDS ar, SYS_USER su " +
                "where " +
                "c.CONTRACT_ID = ar.CONTRACT_ID and " +
                "c.PERFORMER_ID = su.SYS_USER_ID and " +
                "c.STATUS = 3 ");
        if (startDate != null) {
            sql.append("and trunc(ar.END_DATE)>= to_date (:startDate,'dd/mm/yyyy') ");
        }
        if (endDate != null) {
            sql.append("and trunc(ar.END_DATE)<= to_date (:endDate,'dd/mm/yyyy') ");
        }
        sql.append("and (c.IS_INTERNAL is null or c.IS_INTERNAL!=1) ");
        if (dto.getPerformerGroupId() != null) {
            sql.append(" and c.PERFORMER_GROUP_ID = :performerGroupId ");
        }
        sql.append("group by su.SYS_GROUP_ID) " +
                "select " +
                "ct.SHORTCUT_NAME  pointName, " +
                "nvl(th.amount,0) totalTh, " +
                "ct.kh totalKh, " +
                "round(decode( ct.kh,0,0,100*nvl(th.amount,0)/ ct.kh),2) goodCityAmount " +
                "from " +
                "ct LEFT join th on ct.SYS_GROUP_ID = th.SYS_GROUP_ID " +
                "ORDER BY goodCityAmount desc");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (dto.getMonth() != null) {
            query.setParameter("month", dto.getMonth());
        }
        if (dto.getYear() != null) {
            query.setParameter("year", dto.getYear());
        }
        if (StringUtils.isNotEmpty(startDate)) {
            query.setParameter("startDate", startDate);
        }
        if (StringUtils.isNotEmpty(endDate)) {
            query.setParameter("endDate", endDate);
        }
        if (dto.getSysGroupId() != null) {
            query.setParameter("sysGroupId", dto.getSysGroupId());
        }
        if (dto.getPerformerGroupId() != null) {
            query.setParameter("performerGroupId", dto.getPerformerGroupId());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOReportDTO.class));
        query.addScalar("pointName", new StringType());
        query.addScalar("goodCityAmount", new BigDecimalType());
        query.addScalar("totalTh", new BigDecimalType());
        query.addScalar("totalKh", new BigDecimalType());

        return query.list();
    }
}
