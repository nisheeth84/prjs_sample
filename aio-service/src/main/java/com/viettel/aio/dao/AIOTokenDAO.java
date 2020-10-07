package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOTokenBO;
import com.viettel.aio.dto.AIOTokenDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

//VietNT_20190607_create
@EnableTransactionManagement
@Transactional
@Repository("aioTokenDAO")
public class AIOTokenDAO extends BaseFWDAOImpl<AIOTokenBO, Long> {

    public AIOTokenDAO() {
        this.model = new AIOTokenBO();
    }

    public AIOTokenDAO(Session session) {
        this.session = session;
    }


    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOTokenDTO> getUserToken(Long sysUserId, Long tokenId) {
        String token = sysUserId != null ? StringUtils.EMPTY : ", TOKEN token ";
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("AIO_TOKEN_ID aioTokenId, ")
                .append("SYS_USER_ID sysUserId, ")
                .append("SYS_USER_PHONE sysUserPhone, ")
                .append("PAY_PHONE payPhone ")
                .append(token)
                .append("FROM AIO_TOKEN ")
                .append("WHERE 1=1 ");
        if (sysUserId != null) {
            sql.append("AND SYS_USER_ID = :sysUserId ");
        }

        if (tokenId != null) {
            sql.append("AND AIO_TOKEN_ID = :tokenId ");
        }

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());

        if (sysUserId != null) {
            query.setParameter("sysUserId", sysUserId);
        }

        if (tokenId != null) {
            query.setParameter("tokenId", tokenId);
        }

        query.addScalar("aioTokenId", new LongType());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("sysUserPhone", new StringType());
        query.addScalar("payPhone", new StringType());
        query.addScalar("token", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AIOTokenDTO.class));

        return query.list();
    }

    public List<AIOTokenDTO> getByUserId(Long sysUserId) {
        return this.getUserToken(sysUserId, null);
    }

    public AIOTokenDTO getById(Long id) {
        List<AIOTokenDTO> list = this.getUserToken(null, id);
        if (list != null && !list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }
}
