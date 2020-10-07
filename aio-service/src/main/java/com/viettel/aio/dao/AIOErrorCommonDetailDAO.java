package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOErrorDetailBO;
import com.viettel.aio.dto.AIOCategoryProductDTO;
import com.viettel.aio.dto.AIOCategoryProductPriceDTO;
import com.viettel.aio.dto.AIOErrorDetailDTO;
import com.viettel.aio.dto.ComsBaseFWDTO;
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

//StephenTrung__20191105_create
@EnableTransactionManagement
@Transactional
@Repository("aioErrorCommonDetailDAO")
public class AIOErrorCommonDetailDAO extends BaseFWDAOImpl<AIOErrorDetailBO, Long> {

    public AIOErrorCommonDetailDAO() {
        this.model = new AIOErrorDetailBO();
    }

    public AIOErrorCommonDetailDAO(Session session) {
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
    public List<AIOErrorDetailDTO> doSearch(AIOErrorDetailDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("er.ERROR_ID errorId, ")
                .append("er.CODE code, ")
                .append("er.NAME name, ")
                .append("er.CREATE_USER createUser, ")
//                .append("su.FULL_NAME createUserName, ")
//                .append("acp.CREATE_DATE createDate, ")
//                .append("acp.STATUS status ")
                .append("FROM AIO_ERROR er INNER JOIN SYS_USER su ON su.SYS_USER_ID = acp.CREATE_USER WHERE 1=1 ");
//        if (criteria.getStatus() != null) {
//            sql.append(" AND acp.STATUS =:status ");
//        }
//        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//            sql.append("AND (upper(acp.NAME) like upper(:keySearch) escape '&' "
//                    + "or upper(acp.CODE) like upper(:keySearch) escape '&' )");
//        }
//        if (criteria.getStartDate() != null) {
//            sql.append("AND trunc(:startDate) <= trunc(acp.CREATE_DATE) ");
//        }
//        if (criteria.getEndDate() != null) {
//            sql.append("AND trunc(:endDate) >= trunc(acp.CREATE_DATE) ");
//        }
        sql.append(" order by acp.CATEGORY_PRODUCT_ID desc ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

//        if (criteria.getStatus() != null) {
//            query.setParameter("status", criteria.getStatus());
//            queryCount.setParameter("status", criteria.getStatus());
//        }
//        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
//            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
//        }
//        if (criteria.getStartDate() != null) {
//            query.setParameter("startDate", criteria.getStartDate());
//            queryCount.setParameter("startDate", criteria.getStartDate());
//        }
//        if (criteria.getEndDate() != null) {
//            query.setParameter("endDate", criteria.getEndDate());
//            queryCount.setParameter("endDate", criteria.getEndDate());
//        }

        query.setResultTransformer(Transformers.aliasToBean(AIOCategoryProductDTO.class));
        query.addScalar("createUserName", new StringType());
        query.addScalar("categoryProductId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("createUser", new LongType());
        query.addScalar("createDate", new DateType());
        query.addScalar("status", new LongType());

//        if (criteria.getCategoryProductId() == null) {
//            this.setPageSize(criteria, query, queryCount);
//        }
        return query.list();
    }

    public List<AIOCategoryProductPriceDTO> getListDetailByErrorCommonId(Long id) {
        return this.getListDetailByErrorCommonId(Collections.singletonList(id));
    }

    public List<AIOCategoryProductPriceDTO> getListDetailByErrorCommonId(List<Long> ids) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("AIO_ERROR_DETAIL_ID errorDetailId, ")
                .append("AIO_ERROR_ID errorId, ")
//                .append("TYPE type, ")
//                .append("VALUE_TO valueTo, ")
//                .append("VALUE_FROM valueFrom ")
                .append("FROM AIO_ERROR_DETAIL ")
                .append("where AIO_ERROR_DETAIL_ID in (:ids) ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(AIOCategoryProductPriceDTO.class));
        query.addScalar("errorDetailId", new LongType());
        query.addScalar("errorId", new LongType());
//        query.addScalar("type", new LongType());
//        query.addScalar("valueTo", new LongType());
//        query.addScalar("valueFrom", new LongType());

        query.setParameterList("ids", ids);

        return query.list();
    }

    public void deleteErrorCommonDetail(Long id) {
        StringBuilder sql = new StringBuilder("DELETE FROM AIO_ERROR_DETAIL where AIO_ERROR_DETAIL_ID=:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.executeUpdate();
    }

    public List<AIOCategoryProductDTO> getAutoCompleteData(AIOCategoryProductDTO dto) {
        StringBuilder sql = new StringBuilder("SELECT CODE code,NAME name " +
                "FROM AIO_ERROR WHERE  1=1 ");

        if (StringUtils.isNotEmpty(dto.getKeySearch())) {
            sql.append("AND (upper(NAME) like upper(:keySearch) escape '&' "
                    + "or upper(CODE) like upper(:keySearch) escape '&') ");
        }
        sql.append(" order by AIO_ERROR_ID asc ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        if (StringUtils.isNotEmpty(dto.getKeySearch())) {
            query.setParameter("keySearch", "%" + dto.getKeySearch() + "%");
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOCategoryProductDTO.class));
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());

        return query.list();
    }

    public void removeCategoryProduct(AIOCategoryProductDTO obj) {
        StringBuilder sql = new StringBuilder("UPDATE AIO_CATEGORY_PRODUCT SET STATUS = 0 WHERE 1=1 ");
        if (obj.getCategoryProductId() != null) {
            sql.append(" AND CATEGORY_PRODUCT_ID =:id ");
        }
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        if (obj.getCategoryProductId() != null) {
            query.setParameter("id", obj.getCategoryProductId());
        }
        query.executeUpdate();
    }

    public int updateCategory(AIOCategoryProductDTO obj) {
        StringBuilder sql = new StringBuilder("UPDATE AIO_CATEGORY_PRODUCT SET ");
        if (obj.getName() != null) {
            sql.append("NAME = :name ");
        }
        sql.append("WHERE CATEGORY_PRODUCT_ID =:id ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obj.getCategoryProductId());
        if (obj.getName() != null) {
            query.setParameter("name", obj.getName());
        }
        return query.executeUpdate();
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

    public int checkDuplicateCategoryProductName(String name) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM AIO_CATEGORY_PRODUCT ");
        if (name != null) {
            sql.append("WHERE UPPER(NAME) like :name and status =1 ");
        }

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        if (name != null) {
            query.setParameter("name", name.toUpperCase());
        }
        return ((BigDecimal) (query.uniqueResult())).intValue();
    }
}
