package com.viettel.coms.dao;

import com.viettel.coms.bo.CatStationBO;
import com.viettel.coms.dto.CatStationDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author hailh10
 */
@Repository("catStationDAO")
public class CatStationDAO extends BaseFWDAOImpl<CatStationBO, Long> {

    public CatStationDAO() {
        this.model = new CatStationBO();
    }

    public CatStationDAO(Session session) {
        this.session = session;
    }

    @SuppressWarnings("unchecked")
    public List<CatStationDTO> doSearch(CatStationDTO criteria) {
        StringBuilder stringBuilder = new StringBuilder("select totalRecord ");
        stringBuilder.append(",T1.TYPE type ");
        stringBuilder.append(",T1.IS_SYNONIM isSynonim ");
        stringBuilder.append(",T1.DESCRIPTION description ");
        stringBuilder.append(",T1.CR_NUMBER crNumber ");
        stringBuilder.append(",T1.LATITUDE latitude ");
        stringBuilder.append(",T1.LONGITUDE longitude ");
        stringBuilder.append(",T1.CAT_STATION_ID catStationId ");
        stringBuilder.append(",nvl(T1.NAME,'') name ");
        stringBuilder.append(",T1.CODE code ");
        stringBuilder.append(",T1.ADDRESS address ");
        stringBuilder.append(",T1.STATUS status ");
        stringBuilder.append(",T1.START_POINT_ID startPointId ");
        stringBuilder.append(",T1.END_POINT_ID endPointId ");
        stringBuilder.append(",T1.LINE_TYPE_ID lineTypeId ");
        stringBuilder.append(",T1.LINE_LENGTH lineLength ");
        stringBuilder.append(",T1.EMISSION_DATE emissionDate ");
        stringBuilder.append(",T1.SCOPE scope ");
        stringBuilder.append(",T1.SCOPE_NAME scopeName ");
        stringBuilder.append(",T1.START_POINT_TYPE startPointType ");
        stringBuilder.append(",T1.END_POINT_TYPE endPointType ");
        stringBuilder.append(",T1.PARENT_ID parentId ");
        stringBuilder.append(",T1.DISTANCE_ODD distanceOdd ");
        stringBuilder.append(",T1.AREA_LOCATION areaLocation ");
        stringBuilder.append(",T1.CREATED_DATE createdDate ");
        stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
        stringBuilder.append(",T1.CREATED_USER createdUser ");
        stringBuilder.append(",T1.UPDATED_USER updatedUser ");
        stringBuilder.append(",T1.CAT_STATION_TYPE_ID catStationTypeId ");
        stringBuilder.append(",T1.CAT_PROVINCE_ID catProvinceId ");
        stringBuilder.append(",T1.CAT_STATION_HOUSE_ID catStationHouseId ");

        stringBuilder.append("FROM CAT_STATION T1 ");
        stringBuilder.append("WHERE T1STATUS != 0 ");

        if (StringUtils.isNotEmpty(criteria.getType())) {
            stringBuilder.append(
                    "AND( UPPER(T1.Code) LIKE UPPER(:keySearch) or UPPER(T1.Name) LIKE UPPER(:keySearch)   ESCAPE '\\' )");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(stringBuilder.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("type", new StringType());
        query.addScalar("isSynonim", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("crNumber", new StringType());
        query.addScalar("latitude", new DoubleType());
        query.addScalar("longitude", new DoubleType());
        query.addScalar("catStationId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("address", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("startPointId", new LongType());
        query.addScalar("endPointId", new LongType());
        query.addScalar("lineTypeId", new LongType());
        query.addScalar("lineLength", new LongType());
        query.addScalar("emissionDate", new DateType());
        query.addScalar("scope", new LongType());
        query.addScalar("scopeName", new StringType());
        query.addScalar("startPointType", new StringType());
        query.addScalar("endPointType", new StringType());
        query.addScalar("parentId", new LongType());
        query.addScalar("distanceOdd", new LongType());
        query.addScalar("areaLocation", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("createdUser", new LongType());
        query.addScalar("updatedUser", new LongType());
        query.addScalar("catStationTypeId", new LongType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("catStationHouseId", new LongType());

        if (StringUtils.isNotEmpty(criteria.getType())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }

        query.setResultTransformer(Transformers.aliasToBean(CatStationDTO.class));

        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize().intValue());
            query.setMaxResults(criteria.getPageSize().intValue());
        }
        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public CatStationDTO findByValue(String value) {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append("T1.TYPE type ");
        stringBuilder.append(",T1.IS_SYNONIM isSynonim ");
        stringBuilder.append(",T1.DESCRIPTION description ");
        stringBuilder.append(",T1.CR_NUMBER crNumber ");
        stringBuilder.append(",T1.LATITUDE latitude ");
        stringBuilder.append(",T1.LONGITUDE longitude ");
        stringBuilder.append(",T1.CAT_STATION_ID catStationId ");
        stringBuilder.append(",T1.NAME name ");
        stringBuilder.append(",T1.CODE code ");
        stringBuilder.append(",T1.ADDRESS address ");
        stringBuilder.append(",T1.STATUS status ");
        stringBuilder.append(",T1.START_POINT_ID startPointId ");
        stringBuilder.append(",T1.END_POINT_ID endPointId ");
        stringBuilder.append(",T1.LINE_TYPE_ID lineTypeId ");
        stringBuilder.append(",T1.LINE_LENGTH lineLength ");
        stringBuilder.append(",T1.EMISSION_DATE emissionDate ");
        stringBuilder.append(",T1.SCOPE scope ");
        stringBuilder.append(",T1.SCOPE_NAME scopeName ");
        stringBuilder.append(",T1.START_POINT_TYPE startPointType ");
        stringBuilder.append(",T1.END_POINT_TYPE endPointType ");
        stringBuilder.append(",T1.PARENT_ID parentId ");
        stringBuilder.append(",T1.DISTANCE_ODD distanceOdd ");
        stringBuilder.append(",T1.AREA_LOCATION areaLocation ");
        stringBuilder.append(",T1.CREATED_DATE createdDate ");
        stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
        stringBuilder.append(",T1.CREATED_USER createdUser ");
        stringBuilder.append(",T1.UPDATED_USER updatedUser ");
        stringBuilder.append(",T1.CAT_STATION_TYPE_ID catStationTypeId ");
        stringBuilder.append(",T1.CAT_PROVINCE_ID catProvinceId ");
        stringBuilder.append(",T1.CAT_STATION_HOUSE_ID catStationHouseId ");

        stringBuilder.append("FROM CAT_STATION T1 ");
        stringBuilder.append("WHERE T1.IS_DELETED = 'N' AND upper(T1.VALUE) = upper(:value)");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("type", new StringType());
        query.addScalar("isSynonim", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("crNumber", new StringType());
        query.addScalar("latitude", new DoubleType());
        query.addScalar("longitude", new DoubleType());
        query.addScalar("catStationId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("address", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("startPointId", new LongType());
        query.addScalar("endPointId", new LongType());
        query.addScalar("lineTypeId", new LongType());
        query.addScalar("lineLength", new LongType());
        query.addScalar("emissionDate", new DateType());
        query.addScalar("scope", new LongType());
        query.addScalar("scopeName", new StringType());
        query.addScalar("startPointType", new StringType());
        query.addScalar("endPointType", new StringType());
        query.addScalar("parentId", new LongType());
        query.addScalar("distanceOdd", new LongType());
        query.addScalar("areaLocation", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("createdUser", new LongType());
        query.addScalar("updatedUser", new LongType());
        query.addScalar("catStationTypeId", new LongType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("catStationHouseId", new LongType());

        query.setParameter("value", value);
        query.setResultTransformer(Transformers.aliasToBean(CatStationDTO.class));

        return (CatStationDTO) query.uniqueResult();
    }

    public List<CatStationDTO> getForAutoComplete(CatStationDTO obj) {
        StringBuilder sql = new StringBuilder(
                "SELECT ct.CAT_STATION_ID catStationId, ct.NAME name, ct.CODE code, ct.ADDRESS address "
                        + " FROM CAT_STATION ct WHERE STATUS != 0");

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (upper(ct.NAME) LIKE upper(:keySearch) OR upper(ct.CODE) LIKE upper(:keySearch)) ");
        }

        //VietNT_20181207_start
        if (null != obj.getCatStationHouseId()) {
            sql.append(" AND ct.CAT_STATION_HOUSE_ID LIKE :catStationHouseId ");
        }
		 //VietNT_20190105_start
        if (null != obj.getCatProvinceId()) {
            sql.append("AND ct.CAT_PROVINCE_ID = :catProvinceId ");
        }
        //VietNT_end

        sql.append(" ORDER BY ct.CODE");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("catStationId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("address", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(CatStationDTO.class));

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }

        //VietNT_20181207_start
        if (null != obj.getCatStationHouseId()) {
            query.setParameter("catStationHouseId", obj.getCatStationHouseId());
            queryCount.setParameter("catStationHouseId", obj.getCatStationHouseId());
        }
		     //VietNT_20190105_start
        if (null != obj.getCatProvinceId()) {
            query.setParameter("catProvinceId", obj.getCatProvinceId());
            queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
        }
        //VietNT_end

        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    @SuppressWarnings("unchecked")
    public CatStationDTO getById(Long id) {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");

        stringBuilder.append("T1.CAT_STATION_ID catStationId ");
        stringBuilder.append(",T1.NAME name ");
        stringBuilder.append(",T1.CODE code ");

        stringBuilder.append("FROM CAT_STATION T1 ");
        stringBuilder.append("WHERE T1.CAT_STATION_ID = :catStationId ");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("catStationId", new LongType());

        query.setParameter("catStationId", id);
        query.setResultTransformer(Transformers.aliasToBean(CatStationDTO.class));

        return (CatStationDTO) query.uniqueResult();
    }

    //VietNT_20181206_start
    public List<CatStationDTO> getCatStationHouseForAutoComplete(CatStationDTO obj) {
        StringBuilder sql = new StringBuilder(
                "SELECT  ch.CAT_STATION_HOUSE_ID catStationHouseId, " +
                        "ch.CODE code, " +
                        "ch.ADDRESS address " +
                        "FROM CAT_STATION_HOUSE ch WHERE ch.STATUS != 0");

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND (" +
                    "upper(ch.ADDRESS) LIKE upper(:keySearch) " +
                    "OR upper(ch.CODE) LIKE upper(:keySearch) escape '&') ");
        }

        sql.append(" ORDER BY ch.CODE");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());


        query.addScalar("catStationHouseId", new LongType());
        query.addScalar("address", new StringType());
        query.addScalar("code", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(CatStationDTO.class));

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }

        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
        query.setMaxResults(obj.getPageSize());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }
    //VietNT_end

}
