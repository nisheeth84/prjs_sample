package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOContractPayrollBO;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOContractPayrollDTO;
import com.viettel.aio.dto.AIOStaffDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

//VietNT_20190711_create
@EnableTransactionManagement
@Transactional
@Repository("aioContractPayrollDAO")
public class AIOContractPayrollDAO extends BaseFWDAOImpl<AIOContractPayrollBO, Long> {

    public AIOContractPayrollDAO() {
        this.model = new AIOContractPayrollBO();
    }

    public AIOContractPayrollDAO(Session session) {
        this.session = session;
    }


    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public AIOContractDTO getInfoPayroll(Long contractDetailId) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("c.performer_id performerId, ")
                .append("c.performer_code performerCode, ")
                .append("c.performer_name performerName, ")
                .append("c.performer_group_id performerGroupId, ")
                .append("c.SELLER_ID sellerId, ")
                .append("c.SELLER_NAME sellerName, ")
                .append("c.SELLER_CODE sellerCode, ")
                .append("c.SALES_TOGETHER salesTogether, ")
//                .append("dp.province_id , ")
                .append("d.package_name packageName, ")
                .append("d.quantity quantity, ")
                .append("d.is_province_bought isProvinceBought, ")
                .append("dp.DEPARTMENT_ASSIGNMENT departmentAssignment, ")
                .append("dp.PER_DEPARTMENT_ASSIGNMENT perDepartmentAssignment, ")
                .append("dp.TYPE type, ")
                .append("dp.SALES sales, ")
                .append("dp.PERFORMER performer, ")
                .append("dp.STAFF_AIO staffAio, ")
                .append("dp.MANAGER manager ")
                .append("from aio_contract c ")
                .append("left join aio_contract_detail d on c.contract_id = d.contract_id ")
                .append("left join aio_customer cus on cus.customer_id = c.customer_id ")
                .append("left join aio_area area on area.area_id = cus.aio_area_id ")
                .append("left join aio_package_detail_price dp on dp.package_detail_id = d.package_detail_id and dp.province_id = area.province_id ")
                .append("where ")
                .append("d.contract_detail_id = :id ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("id", contractDetailId);
        query.setResultTransformer(Transformers.aliasToBean(AIOContractDTO.class));

        query.addScalar("performerId", new LongType());
        query.addScalar("performerCode", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("performerGroupId", new LongType());
        query.addScalar("sellerId", new LongType());
        query.addScalar("sellerName", new StringType());
        query.addScalar("sellerCode", new StringType());
        query.addScalar("salesTogether", new StringType());
        query.addScalar("departmentAssignment", new DoubleType());
        query.addScalar("perDepartmentAssignment", new DoubleType());
        query.addScalar("type", new LongType());
        query.addScalar("sales", new DoubleType());
        query.addScalar("performer", new DoubleType());
        query.addScalar("staffAio", new DoubleType());
        query.addScalar("manager", new DoubleType());
        query.addScalar("packageName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("isProvinceBought", new LongType());

        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (AIOContractDTO) list.get(0);
        }
        return null;
    }

    public List<AIOStaffDTO> getStaffInfo(Long sysGroupId) {
        String sql = "select code, name, type from aio_staff where sys_group_id = :sysGroupId order by type ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOStaffDTO.class));
        query.setParameter("sysGroupId", sysGroupId);
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("type", new LongType());

        return query.list();
    }
}
