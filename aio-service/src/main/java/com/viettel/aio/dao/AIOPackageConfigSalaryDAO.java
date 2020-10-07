package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOPackageConfigSalaryBO;
import com.viettel.aio.dto.AIOPackageConfigSalaryDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

//VietNT_20191109_create
@EnableTransactionManagement
@Transactional
@Repository("aioPackageConfigSalaryDAO")
public class AIOPackageConfigSalaryDAO extends BaseFWDAOImpl<AIOPackageConfigSalaryBO, Long> {

    public AIOPackageConfigSalaryDAO() {
        this.model = new AIOPackageConfigSalaryBO();
    }

    public AIOPackageConfigSalaryDAO(Session session) {
        this.session = session;
    }

    public List<AIOPackageConfigSalaryDTO> getListPackageConfigSalaryByPackageId(Long packageId) {
        String sql = "select " +
                "PACKAGE_CONFIG_SALARY_ID packageConfigSalaryId, " +
//                "PACKAGE_ID packageId, " +
                "PACKAGE_DETAIL_ID packageDetailId, " +
                "TYPE type, " +
                "OBJECT_TYPE objectType, " +
                "MANAGER_CHANNELS managerChannels, " +
                "SALE sale, " +
                "PERFORMER performer, " +
                "STAFF_AIO staffAio, " +
                "MANAGER manager " +
                "from AIO_PACKAGE_CONFIG_SALARY " +
                "where package_id = :packageId ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOPackageConfigSalaryDTO.class));
        query.addScalar("packageConfigSalaryId", new LongType());
//        query.addScalar("packageId", new LongType());
        query.addScalar("packageDetailId", new LongType());
        query.addScalar("type", new LongType());
        query.addScalar("objectType", new LongType());
        query.addScalar("managerChannels", new DoubleType());
        query.addScalar("sale", new DoubleType());
        query.addScalar("performer", new DoubleType());
        query.addScalar("staffAio", new DoubleType());
        query.addScalar("manager", new DoubleType());
        query.setParameter("packageId", packageId);

        return query.list();
    }
}
