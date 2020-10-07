package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOErrorBO;
import com.viettel.aio.dto.AIOErrorDTO;
import com.viettel.aio.dto.AIOErrorDetailDTO;
import com.viettel.aio.dto.ComsBaseFWDTO;
import com.viettel.cat.utils.ValidateUtils;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

//StephenTrung__12/2019_create
@EnableTransactionManagement
@Transactional
@Repository("aioErrorCommonDAO")
public class AIOErrorCommonDAO extends BaseFWDAOImpl<AIOErrorBO, Long> {

    public AIOErrorCommonDAO() {
        this.model = new AIOErrorBO();
    }

    public AIOErrorCommonDAO(Session session) {
        this.session = session;
    }

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    @SuppressWarnings("unchecked")
    public List<AIOErrorDTO> doSearch(AIOErrorDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append(" er.AIO_ERROR_ID aioErrorId, ")
                .append("er.GROUP_ERROR_NAME groupErrorName, ")
                .append("er.CONTENT_ERROR contentError, ")
//                .append("er.CREATE_USER createUser, ")
                .append("er.STATUS status, ")
                .append("er.CREATE_DATE createDate ")
                .append(", su.full_name sysUserName ")
                .append(", er.industry_code industryCode ")
                .append("FROM AIO_ERROR er ")
                .append("left join sys_user su on su.sys_user_id = er.CREATE_USER ")
                .append("WHERE 1=1 ");

        if (criteria.getGroupErrorId() != null) {
            sql.append(" AND er.GROUP_ERROR_ID =:groupErrorId ");
        }
        if (criteria.getStatus() != null) {
            sql.append(" AND er.STATUS =:status ");
        } else {
            sql.append(" AND er.STATUS != 0 ");
        }
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("AND (upper(er.CONTENT_ERROR) like upper(:keySearch) escape '&' "
                    + "or upper(er.CONTENT_ERROR) like upper(:keySearch) escape '&' )");
        }

        sql.append(" order by er.AIO_ERROR_ID desc ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (criteria.getGroupErrorId() != null) {
            query.setParameter("groupErrorId", criteria.getGroupErrorId());
            queryCount.setParameter("groupErrorId", criteria.getGroupErrorId());
        }
        if (criteria.getStatus() != null) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(criteria.getKeySearch()) + "%");
            queryCount.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(criteria.getKeySearch()) + "%");
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOErrorDTO.class));
        query.addScalar("aioErrorId", new LongType());
        query.addScalar("contentError", new StringType());
        query.addScalar("groupErrorName", new StringType());
//        query.addScalar("createUser", new LongType());
        query.addScalar("createDate", new DateType());
        query.addScalar("status", new LongType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("industryCode", new StringType());

        if (criteria.getAioErrorId() == null) {
            this.setPageSize(criteria, query, queryCount);
        }
        return query.list();
    }

    public List<AIOErrorDetailDTO> getListDetailByErrorId(Long id) {
        return this.getListDetailByErrorId(Collections.singletonList(id));
    }

    public List<AIOErrorDetailDTO> getListDetailByErrorId(List<Long> ids) {
        String sql = "SELECT " +
                "ed.AIO_ERROR_DETAIL_ID aioErrorDetailId, " +
                "ed.CONTENT_PERFORMER contentPerformer, " +
                "ed.ERROR_HANDLING_STEP errorHandlingStep, " +
                "doc.file_path imgPath, " +
                "doc.name imgName " +
                "FROM AIO_ERROR_DETAIL ed " +
                "LEFT JOIN UTIL_ATTACH_DOCUMENT doc ON doc.object_id = ed.AIO_ERROR_DETAIL_ID AND doc.TYPE='111' " +
                "where AIO_ERROR_ID in (:ids) ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOErrorDetailDTO.class));
        query.addScalar("aioErrorDetailId", new LongType());
        query.addScalar("contentPerformer", new StringType());
        query.addScalar("errorHandlingStep", new LongType());
        query.addScalar("imgPath", new StringType());
        query.addScalar("imgName", new StringType());
        query.setParameterList("ids", ids);

        return query.list();
    }

    public void deleteDetail(Long id) {
        StringBuilder sql = new StringBuilder("DELETE FROM AIO_ERROR_DETAIL where AIO_ERROR_ID=:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.executeUpdate();
    }

    public void approveErrorCommon(AIOErrorDTO obj) {
        StringBuilder sql = new StringBuilder("UPDATE AIO_ERROR SET STATUS = 1 WHERE AIO_ERROR_ID = :id ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obj.getAioErrorId());
        query.executeUpdate();
    }

    public int updateErrorCommon(AIOErrorDTO obj) {
        StringBuilder sql = new StringBuilder("UPDATE AIO_ERROR SET ");
        if (obj.getGroupErrorId() != null) {
            sql.append("GROUP_ERROR_ID = :groupErrorId ");
        }

        sql.append("WHERE AIO_ERROR_ID =:id ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obj.getAioErrorId());
        if (obj.getGroupErrorId() != null) {
            query.setParameter("groupErrorId", obj.getGroupErrorId());
        }
        return query.executeUpdate();
    }

    public void removeErrorCommon(AIOErrorDTO obj) {
        StringBuilder sql = new StringBuilder("UPDATE AIO_ERROR SET STATUS = 0 WHERE 1=1 ");
        if (obj.getAioErrorId() != null) {
            sql.append(" AND AIO_ERROR_ID =:id ");
        }
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        if (obj.getAioErrorId() != null) {
            query.setParameter("id", obj.getAioErrorId());
        }
        query.executeUpdate();
    }

    public int updateImage(UtilAttachDocumentDTO dto) {
        StringBuilder sql = new StringBuilder("UPDATE UTIL_ATTACH_DOCUMENT SET ");
        sql.append("FILE_PATH = :filePath ");
        sql.append("WHERE OBJECT_ID =:id ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("id", dto.getObjectId());
        query.setParameter("filePath", dto.getFilePath());
        return query.executeUpdate();
    }

    public int checkDuplicateContent(String content) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM AIO_ERROR ");
        if (content != null) {
            sql.append("WHERE UPPER(CONTENT_ERROR) = upper(:content) and status = 2 ");
        }

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        if (content != null) {
            query.setParameter("content", content.toUpperCase());
        }
        return ((BigDecimal) (query.uniqueResult())).intValue();
    }
}
