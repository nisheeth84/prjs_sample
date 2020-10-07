package com.viettel.coms.dao;

import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.bo.ObstructedBO;
import com.viettel.coms.dto.*;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * @author CuongNV2
 * @version 1.0
 * @since 2018-06-08
 */
@EnableTransactionManagement
@Transactional
@Repository("EntangleManageDAO")
public class EntangleManageDAO extends BaseFWDAOImpl<ObstructedBO, Long> {

    private static final String HET_VUONG = "0";
    private static final String VUONG_CHUA_XN = "1";
    private static final String VUONG_CO_XN = "2";

    @Autowired
    private UtilAttachDocumentDAO utilAttachDocumentDAO;

    /**
     * Get current time
     *
     * @return Current time
     * @throws ParseException
     */
    private String getCurrentTime() throws ParseException {
        Date now = new Date();
        String dateNow = now.toString();
        // Tue May 22 13:56:18 GMT+07:00 2018
        SimpleDateFormat dt = new SimpleDateFormat("EEE MMM d HH:mm:ss zzz yyyy");
        Date dateString = dt.parse(dateNow);
        SimpleDateFormat formater = new SimpleDateFormat("dd-MMMM-yy");
        return formater.format(dateString);
    }

    /**
     * countObstructedByState
     *
     * @param Long constructionId
     * @param Long state
     * @return int
     */
    private int countObstructedByState(Long constructionId, long state) {
        String sql = new String(
                "select count(CONSTRUCTION_ID) from obstructed where obstructed_state  = :state and CONSTRUCTION_ID = :constructionId");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("constructionId", constructionId);
        query.setParameter("state", state);
        return ((BigDecimal) query.uniqueResult()).intValue();
    }

    /**
     * Get Domain
     *
     * @param listGorvenor
     * @param listFeedBack
     * @return StringBuilder
     */
    private StringBuilder getListDomain(List<DomainDTO> listGorvenor, List<DomainDTO> listFeedBack) {

        // merge to one list
        listFeedBack.addAll(listGorvenor);

        // process String Domain
        StringBuilder domain = new StringBuilder();
        if (listFeedBack.size() > 0) {
            for (int i = 0; i < listFeedBack.size(); i++) {
                domain.append(listFeedBack.get(i).getDataId().toString());
                while (i != listFeedBack.size() - 1) {
                    domain.append(" , ");
                    break;
                }
            }
        } else {
            return new StringBuilder("");
        }
        return domain;
    }

    public EntangleManageDAO() {
        this.model = new ObstructedBO();
    }

    public EntangleManageDAO(Session session) {
        this.session = session;
    }

    /**
     * saveImagePaths
     *
     * @param lstConstructionImages
     * @param constructionTaskId
     * @param request
     *//*
     * public void saveImagePathsDao( List<ConstructionImageInfo>
     * lstConstructionImages, long constructionTaskId, SysUserRequest request) {
     *
     * if (lstConstructionImages == null) { return; }
     *
     * for (ConstructionImageInfo constructionImage : lstConstructionImages) {
     *
     * UtilAttachDocumentBO utilAttachDocumentBO = new UtilAttachDocumentBO();
     * utilAttachDocumentBO.setObjectId(constructionImage.getObstructedId());
     * utilAttachDocumentBO.setName(constructionImage.getImageName());
     * utilAttachDocumentBO.setType("43");
     * utilAttachDocumentBO.setDescription("file ảnh vướng");
     * utilAttachDocumentBO.setStatus("1");
     * utilAttachDocumentBO.setFilePath(constructionImage.getImagePath());
     * utilAttachDocumentBO.setCreatedDate(new Date());
     * utilAttachDocumentBO.setCreatedUserId(request.getSysUserId());
     * utilAttachDocumentBO.setCreatedUserName(request.getName());
     *
     * long ret = utilAttachDocumentDAO.saveObject(utilAttachDocumentBO);
     *
     * System.out.println("ret " + ret); } }
     */

    /**
     * Màn hình chi tiết hạng mục
     *
     * @param request
     * @return List<ConstructionTaskDTO>
     * @author CuongNV2
     */
    public List<EntangleManageDTO> getEntangleManage(EntangleManageDTORequest request, String id,
                                                     List<DomainDTO> listGorvenor, List<DomainDTO> listFeedBack) {
        StringBuilder domain = getListDomain(listGorvenor, listFeedBack);

        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT ");
        sql.append("OB.OBSTRUCTED_ID obstructedId, ");
        sql.append("cons.CODE consCode, ");
        sql.append("cons.CONSTRUCTION_ID constructionId, ");
        sql.append("cons.NAME consName, ");
        sql.append("OB.OBSTRUCTED_STATE obstructedState, ");
        sql.append("OB.OBSTRUCTED_CONTENT obstructedContent ");
//		hoanm1_20180820_start
        sql.append(",ob.work_item_id workItemId, wi.name workItemName  ");
//		hoanm1_20180820_end
        sql.append("FROM OBSTRUCTED OB ");
        sql.append("LEFT JOIN CONSTRUCTION cons ");
        sql.append("ON OB.CONSTRUCTION_ID = cons.CONSTRUCTION_ID ");
        sql.append("LEFT JOIN CAT_STATION catStation ");
        sql.append("ON cons.CAT_STATION_ID   = catStation.CAT_STATION_ID ");
//		hoanm1_20180820_start
        sql.append("LEFT JOIN work_item wi on ob.work_item_id=wi.work_item_id ");
//		hoanm1_20180820_end
        sql.append("WHERE cons.STATUS       IN (2,3,4,5) ");
        sql.append("AND cons.IS_OBSTRUCTED   = 1 ");
//        hoanm1_20180905_start
        sql.append("AND OB.OBSTRUCTED_STATE IN (0,1,2) ");
//        hoanm1_20180905_end
        sql.append("AND (OB.CREATED_USER_ID  = '" + request.getSysUserRequest().getSysUserId() + "' ");
        if (domain.length() == 0) {
            sql.append("OR catStation.CAT_PROVINCE_ID IN (null)) ");
        } else {
            sql.append("OR catStation.CAT_PROVINCE_ID IN (" + domain + ")) ");
        }
        sql.append("order by OB.OBSTRUCTED_ID DESC ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("consCode", new StringType());
        query.addScalar("consName", new StringType());
        query.addScalar("obstructedState", new StringType());
        query.addScalar("obstructedContent", new StringType());
        query.addScalar("obstructedId", new LongType());
        query.addScalar("constructionId", new LongType());
//		hoanm1_20180820_start
        query.addScalar("workItemId", new LongType());
        query.addScalar("workItemName", new StringType());
//		hoanm1_20180820_end

        query.setResultTransformer(Transformers.aliasToBean(EntangleManageDTO.class));
        return query.list();
    }

    /**
     * Màn hình chi tiết hạng mục
     *
     * @param constructionId
     * @return List<ConstructionTaskDTO>
     * @author CuongNV2
     */
    public List<ConstructionImageInfo> getListImageByConstructionId(Long constructionId) {
        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT DISTINCT ");
        sql.append(
                "a.UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId, a.name imageName, a.file_path imagePath , 1 status ");
        sql.append("FROM ");
        sql.append("UTIL_ATTACH_DOCUMENT a ");
        sql.append("WHERE ");
        sql.append("a.object_id = :constructionTaskId ");
        sql.append("AND a.TYPE = '43' ");
        sql.append("ORDER BY a.UTIL_ATTACH_DOCUMENT_ID DESC ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("imageName", new StringType());
        query.addScalar("imagePath", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("utilAttachDocumentId", new LongType());
        query.setParameter("constructionTaskId", constructionId);
        query.setResultTransformer(Transformers.aliasToBean(ConstructionImageInfo.class));
        return query.list();
    }

    /**
     * DeleteEntagle
     *
     * @param Long obstructedId
     */
    public void DeleteEntagle(Long obstructedId) {
        StringBuilder sql = new StringBuilder(" ");
        sql.append(" delete OBSTRUCTED a where a.OBSTRUCTED_ID =:id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obstructedId);
        query.executeUpdate();
    }

    /**
     * GetListCreateEntagle
     *
     * @param Long obstructedId
     * @return List<EntangleManageDTO>
     */
    public List<EntangleManageDTO> GetListCreateEntagle(Long obstructedId) {
        StringBuilder sql = new StringBuilder(" ");
        sql.append(" SELECT a.CREATED_DATE createdDate , ");
        sql.append(" a.CREATED_GROUP_ID createdGroupId , ");
        sql.append(" a.CREATED_USER_ID createdUserId ");
        sql.append(" FROM OBSTRUCTED a ");
        sql.append(" WHERE a.OBSTRUCTED_ID=:id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obstructedId);
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("createdUserId", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(EntangleManageDTO.class));
        return query.list();
    }

    /**
     * updateEntagle
     *
     * @param EntangleManageDTO entangleManageDTODetail
     * @param SysUserRequest    sysUserRequest
     * @throws ParseException
     */
    public void updateEntagle(EntangleManageDTO entangleManageDTODetail, SysUserRequest sysUserRequest)
            throws ParseException {
        StringBuilder sql = new StringBuilder(" ");
        sql.append(" UPDATE OBSTRUCTED a ");
        sql.append(" SET a.OBSTRUCTED_STATE =:state , ");
        sql.append(" a.OBSTRUCTED_CONTENT   =:conten , ");
        sql.append(" a.UPDATED_USER_ID      =:idUser , ");
        sql.append(" a.UPDATED_GROUP_ID     = '" + sysUserRequest.getSysGroupId() + "', ");
        sql.append(" a.UPDATED_DATE         =:now ");
        if ("0".equals(entangleManageDTODetail.getObstructedState())) {
            sql.append(" ,a.CLOSED_DATE     =:now ");
        }
        sql.append(" where a.OBSTRUCTED_ID =:id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("state", entangleManageDTODetail.getObstructedState());
        query.setParameter("conten", entangleManageDTODetail.getObstructedContent());
        query.setParameter("idUser", sysUserRequest.getSysUserId());
        query.setParameter("now", getCurrentTime());
        query.setParameter("id", entangleManageDTODetail.getObstructedId());
        query.executeUpdate();
    }

    /**
     * updateCon
     *
     * @param Long   constructionId
     * @param String state
     */
//    hoanm1_20180830_start
    public void updateCon(Long constructionId, String state) {
//        int count2 = countObstructedByState(constructionId, 2L);
//        int count1 = countObstructedByState(constructionId, 1L);
    	if (StringUtils.isNotEmpty(state)) {
        StringBuilder sql = new StringBuilder("Update CONSTRUCTION  set ");
            if (HET_VUONG.equals(state)) {
                sql.append(" status = 3,COMPLETE_DATE  = null,COMPLETE_VALUE =null,obstructed_state = 0,is_obstructed  =1 ");
            } else {
                sql.append(
                        " status = 4,is_obstructed  =1,COMPLETE_DATE  = sysDate,COMPLETE_VALUE =(select sum(work.quantity) from work_item work left join construction cons on cons.construction_id = work.construction_id WHERE work.status =3 and work.CONSTRUCTION_ID = :constructionId) ");
                if (VUONG_CO_XN.equals(state)){
                    sql.append(", obstructed_state = 2 ");
                }else {
                	sql.append(", obstructed_state = 1 ");
                }
            }
        
        sql.append(" where CONSTRUCTION_ID = :constructionId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", constructionId);
        query.executeUpdate();
        getSession().flush();
    	}
        // thay doi thiet ke ngay 10/04/2018
//        if (count2 > 0) {
//            sql = new StringBuilder("Update CONSTRUCTION  set obstructed_state = 2,is_obstructed  =1 ");
//            sql.append(" where CONSTRUCTION_ID = :constructionId ");
//            query = getSession().createSQLQuery(sql.toString());
//            query.setParameter("constructionId", constructionId);
//            query.executeUpdate();
//
//        } else if (count1 > 0) {
//            sql = new StringBuilder("Update CONSTRUCTION  set obstructed_state = 1,is_obstructed  =1  ");
//            sql.append(" where CONSTRUCTION_ID = :constructionId ");
//            query = getSession().createSQLQuery(sql.toString());
//            query.setParameter("constructionId", constructionId);
//            query.executeUpdate();
//        } else {
//            sql = new StringBuilder(
//                    "Update CONSTRUCTION  set obstructed_state = 0, is_obstructed  =1, status = 3,COMPLETE_DATE = null,COMPLETE_VALUE = null");
//            sql.append(" where CONSTRUCTION_ID = :constructionId ");
//            query = getSession().createSQLQuery(sql.toString());
//            query.setParameter("constructionId", constructionId);
//            query.executeUpdate();
//        }
    }
//    hoanm1_20180830_end
    /**
     * updateVuongTask
     *
     * @param EntangleManageDTO entangleManageDTODetail
     * @param SysUserRequest    sysUserRequest
     * @throws ParseException
     */
//	hoanm1_20180820_start
    public void updateVuongTask(EntangleManageDTO obj) {
        String HET_VUONG = "0";
        // String VUONG_CHUA_XN = "1";
        // String VUONG_CO_XN = "2";
//
        if (obj.getObstructedState().equals(HET_VUONG)) {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append(
                    "UPDATE CONSTRUCTION_TASK SET STATUS=2 WHERE nvl(COMPLETE_PERCENT,0) !=0 AND CONSTRUCTION_TASK_ID IN( ");
            stringBuilder.append("SELECT CONSTRUCTION_TASK_ID FROM CONSTRUCTION_TASK A,DETAIL_MONTH_PLAN B WHERE ");
            stringBuilder
                    .append("A.DETAIL_MONTH_PLAN_ID=B.DETAIL_MONTH_PLAN_ID AND B.SIGN_STATE=3 AND B.STATUS=1 AND ");
            stringBuilder.append(
                    "LPAD(A.MONTH,2,0) = TO_CHAR(SYSDATE,'MM') AND A.YEAR = TO_CHAR(SYSDATE,'YYYY') AND A.TYPE=1 AND LEVEL_ID=4 AND A.STATUS !=4 ");
            stringBuilder.append("START WITH A.CONSTRUCTION_ID = :constructionId ");
            stringBuilder.append("CONNECT BY PRIOR A.CONSTRUCTION_TASK_ID = A.PARENT_ID) ");

            SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

            StringBuilder stringBuilder2 = new StringBuilder();
            stringBuilder2.append(
                    "UPDATE CONSTRUCTION_TASK SET STATUS=1 WHERE nvl(COMPLETE_PERCENT,0) =0 AND CONSTRUCTION_TASK_ID IN( ");
            stringBuilder2.append("SELECT CONSTRUCTION_TASK_ID FROM CONSTRUCTION_TASK A,DETAIL_MONTH_PLAN B WHERE ");
            stringBuilder2
                    .append("A.DETAIL_MONTH_PLAN_ID=B.DETAIL_MONTH_PLAN_ID AND B.SIGN_STATE=3 AND B.STATUS=1 AND ");
            stringBuilder2.append(
                    "LPAD(A.MONTH,2,0) = TO_CHAR(SYSDATE,'MM') AND A.YEAR = TO_CHAR(SYSDATE,'YYYY') AND A.TYPE=1 AND LEVEL_ID=4 AND A.STATUS !=4 ");
            stringBuilder2.append("START WITH A.CONSTRUCTION_ID = :constructionId ");
            stringBuilder2.append("CONNECT BY PRIOR A.CONSTRUCTION_TASK_ID=A.PARENT_ID) ");

            SQLQuery query2 = getSession().createSQLQuery(stringBuilder2.toString());
            
//            hoanm1_20180830_start
            StringBuilder workUnImplemented = new StringBuilder();
            workUnImplemented.append(" update work_item set status=1 where status !=3 and  CONSTRUCTION_ID in( ");
            workUnImplemented.append(" SELECT CONSTRUCTION_ID FROM CONSTRUCTION_TASK A,DETAIL_MONTH_PLAN B WHERE ");
            workUnImplemented.append(" A.DETAIL_MONTH_PLAN_ID=B.DETAIL_MONTH_PLAN_ID AND B.SIGN_STATE=3 AND B.STATUS=1 AND ");
            workUnImplemented.append(" LPAD(A.MONTH,2,0) = TO_CHAR(SYSDATE,'MM') AND A.YEAR = TO_CHAR(SYSDATE,'YYYY') AND A.TYPE=1 AND LEVEL_ID=2 ");
            workUnImplemented.append(" and nvl(A.COMPLETE_PERCENT,0) =0 and A.CONSTRUCTION_ID = :constructionId) ");
            SQLQuery queryWorkUnImplemented = getSession().createSQLQuery(workUnImplemented.toString());
            
            StringBuilder workImplemented = new StringBuilder();
            workImplemented.append(" update work_item set status=2 where status !=3 and CONSTRUCTION_ID in( ");
            workImplemented.append(" SELECT CONSTRUCTION_ID FROM CONSTRUCTION_TASK A,DETAIL_MONTH_PLAN B WHERE ");
            workImplemented.append(" A.DETAIL_MONTH_PLAN_ID=B.DETAIL_MONTH_PLAN_ID AND B.SIGN_STATE=3 AND B.STATUS=1 AND ");
            workImplemented.append(" LPAD(A.MONTH,2,0) = TO_CHAR(SYSDATE,'MM') AND A.YEAR = TO_CHAR(SYSDATE,'YYYY') AND A.TYPE=1 AND LEVEL_ID=2 ");
            workImplemented.append(" and nvl(A.COMPLETE_PERCENT,0) !=0 and A.CONSTRUCTION_ID = :constructionId) ");
            SQLQuery queryWorkImplemented = getSession().createSQLQuery(workImplemented.toString());
            queryWorkUnImplemented.setParameter("constructionId", obj.getConstructionId());
            queryWorkImplemented.setParameter("constructionId", obj.getConstructionId());
//            hoanm1_20180830_end
            
            query.setParameter("constructionId", obj.getConstructionId());
            query2.setParameter("constructionId", obj.getConstructionId());

            query.executeUpdate();
            query2.executeUpdate();
            queryWorkUnImplemented.executeUpdate();
            queryWorkImplemented.executeUpdate();
            getSession().flush();
        } else {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append("UPDATE CONSTRUCTION_TASK SET STATUS=3 WHERE CONSTRUCTION_TASK_ID IN( ");
            stringBuilder.append("SELECT CONSTRUCTION_TASK_ID FROM CONSTRUCTION_TASK A,DETAIL_MONTH_PLAN B WHERE ");
            stringBuilder
                    .append("A.DETAIL_MONTH_PLAN_ID=B.DETAIL_MONTH_PLAN_ID AND B.SIGN_STATE=3 AND B.STATUS=1 AND ");
            stringBuilder.append(
                    "LPAD(A.MONTH,2,0) = TO_CHAR(SYSDATE,'MM') AND A.YEAR = TO_CHAR(SYSDATE,'YYYY') AND A.TYPE=1 AND LEVEL_ID=4 AND A.STATUS !=4 ");
            stringBuilder.append("START WITH A.CONSTRUCTION_ID = :constructionId ");
            stringBuilder.append("CONNECT BY PRIOR A.CONSTRUCTION_TASK_ID=A.PARENT_ID) ");

            SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
            query.setParameter("constructionId", obj.getConstructionId());
            query.executeUpdate();
        }
    }
//	hoanm1_20180820_end

    /**
     * getListConstructionByIdSysGroupId
     *
     * @param SysUserRequest request
     * @return List<ConstructionStationWorkItemDTO>
     */
    public List<ConstructionStationWorkItemDTO> getListConstructionByIdSysGroupId(SysUserRequest request,
                                                                                  List<DomainDTO> listGorvenor, List<DomainDTO> listFeedBack) {

        StringBuilder domain = getListDomain(listGorvenor, listFeedBack);

        StringBuilder strSql = new StringBuilder("");
        strSql.append("SELECT DISTINCT ");
        strSql.append("ct.CONSTRUCTION_ID constructionId, ");
        strSql.append("ct.NAME name, ");
        strSql.append("ct.CODE constructionCode ");
        strSql.append("FROM ");
        strSql.append("CONSTRUCTION ct ");
        strSql.append("LEFT JOIN CAT_STATION ");
        strSql.append("ON ct.CAT_STATION_ID         = CAT_STATION.CAT_STATION_ID ");
        strSql.append("LEFT JOIN CONSTRUCTION_TASK cTask ");
        strSql.append("ON ct.CONSTRUCTION_ID        = cTask.CONSTRUCTION_ID ");
        strSql.append("AND cTask.LEVEL_ID = 4 ");
        strSql.append("WHERE ct.STATUS in (2,3,4,5) ");
        strSql.append("AND (cTask.PERFORMER_ID        = '" + request.getSysUserId() + "' ");
        strSql.append("OR CAT_STATION.CAT_PROVINCE_ID IN (" + domain + "))  ORDER BY ct.CODE ");

        SQLQuery query = getSession().createSQLQuery(strSql.toString());
        query.addScalar("name", new StringType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionStationWorkItemDTO.class));
        return query.list();
    }

    /**
     * getListConstructionByIdSysGroupId
     *
     * @param SysUserRequest request
     * @return List<ConstructionStationWorkItemDTO>
     */
    public List<ConstructionStationWorkItemDTO> getListConstructionByIdSysGroupId(SysUserRequest request) {
        StringBuilder strSql = new StringBuilder(
                " SELECT " + " ct.CONSTRUCTION_ID constructionId ,ct.NAME name , ct.CODE  constructionCode "
                        + " From CONSTRUCTION ct  "
                        + " WHERE ct.SYS_GROUP_ID = :sysGroupId AND ct.status in (2,3,4,5) ORDER BY ct.CODE ");
        SQLQuery query = getSession().createSQLQuery(strSql.toString());
        query.setParameter("sysGroupId", Long.parseLong(request.getSysGroupId()));
        query.addScalar("name", new StringType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionStationWorkItemDTO.class));
        return query.list();
    }

    /**
     * updateUtilAttachDocumentById
     *
     * @param Long utilAttachDocumentId
     */
    public void updateUtilAttachDocumentById(Long utilAttachDocumentId) {
        StringBuilder sql = new StringBuilder(" ");
        sql.append("DELETE FROM UTIL_ATTACH_DOCUMENT a  WHERE a.UTIL_ATTACH_DOCUMENT_ID =:id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", utilAttachDocumentId);
        query.executeUpdate();
    }

    /**
     * getCheckId
     *
     * @param long utilAttachDocumentId
     * @return Boolean
     */
    public Boolean getCheckId(long utilAttachDocumentId) {
        String sql = new String(
                "SELECT count(a.UTIL_ATTACH_DOCUMENT_ID) FROM UTIL_ATTACH_DOCUMENT a where a.UTIL_ATTACH_DOCUMENT_ID=:id");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("id", utilAttachDocumentId);
        long nu = ((BigDecimal) query.uniqueResult()).intValue();
        if (nu > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * checkGovernorOrFeedBack
     *
     * @param request
     * @return List<IssueWorkItemDTO>
     */
    public List<EntangleManageDTORequest> checkGovernorOrFeedBack(EntangleManageDTORequest request) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT c.code ");
        sql.append("FROM SYS_USER a, USER_ROLE b, SYS_ROLE c, USER_ROLE_DATA d, DOMAIN_DATA  e, DOMAIN_TYPE g ");
        sql.append("WHERE a.SYS_USER_ID=b.SYS_USER_ID ");
        sql.append("AND b.SYS_ROLE_ID=c.SYS_ROLE_ID ");
        sql.append("AND (c.CODE='COMS_GOVERNOR' OR c.code = 'PROCESS FEEDBACK') ");
        sql.append("AND b.USER_ROLE_ID=d.USER_ROLE_ID ");
        sql.append("AND d.DOMAIN_DATA_ID=e.DOMAIN_DATA_ID ");
        sql.append("AND e.DOMAIN_TYPE_ID=g.DOMAIN_TYPE_ID ");
        sql.append("AND g.code='KTTS_LIST_PROVINCE' ");
        sql.append("AND a.SYS_USER_ID = '" + request.getSysUserRequest().getSysUserId() + "' ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("code", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(EntangleManageDTORequest.class));
        return query.list();
    }

    /**
     * checkGovernor
     *
     * @param request
     * @return List<IssueWorkItemDTO>
     */
    public List<DomainDTO> getAdResourceByGovernor(Long sysUserId) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT e.data_code dataCode, e.DATA_ID dataId, ");
        sql.append("  op.code ");
        sql.append("  ||' ' ");
        sql.append("  ||ad.code adResource ");
        sql.append("FROM SYS_USER a, ");
        sql.append("  USER_ROLE b, ");
        sql.append("  SYS_ROLE c, ");
        sql.append("  USER_ROLE_DATA d, ");
        sql.append("  DOMAIN_DATA e, ");
        sql.append("  ROLE_PERMISSION role_per, ");
        sql.append("  permission pe, ");
        sql.append("  OPERATION op, ");
        sql.append("  AD_RESOURCE ad ");
        sql.append("WHERE a.SYS_USER_ID       =b.SYS_USER_ID ");
        sql.append("AND b.SYS_ROLE_ID         =c.SYS_ROLE_ID ");
        sql.append("AND b.USER_ROLE_ID        =d.USER_ROLE_ID ");
        sql.append("AND d.DOMAIN_DATA_ID      =e.DOMAIN_DATA_ID ");
        sql.append("AND c.SYS_ROLE_ID         =role_per.SYS_ROLE_ID ");
        sql.append("AND role_per.permission_id=pe.permission_id ");
        sql.append("AND pe.OPERATION_id       =op.OPERATION_id ");
        sql.append("AND pe.AD_RESOURCE_ID     =ad.AD_RESOURCE_ID ");
        sql.append("AND a.SYS_USER_ID         = '" + sysUserId + "' ");
        sql.append("AND upper(c.code) LIKE '%COMS_GOVERNOR%' ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("dataCode", new StringType());
        query.addScalar("dataId", new LongType());
        query.addScalar("adResource", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(DomainDTO.class));
        return query.list();
    }

    /**
     * Màn hình chi tiết hạng mục
     *
     * @param request
     * @return List<ConstructionTaskDTO>
     * @author CuongNV2
     */
    public List<DomainDTO> getByAdResource(long sysUserId, String adResource) {
        // long sysUserId = request.getSysUserRequest().getSysUserId();
        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT e.data_code dataCode, e.DATA_ID dataId, ");
        sql.append("  op.code ");
        sql.append("  ||' ' ");
        sql.append("  ||ad.code adResource ");
        sql.append("FROM SYS_USER a, ");
        sql.append("  USER_ROLE b, ");
        sql.append("  SYS_ROLE c, ");
        sql.append("  USER_ROLE_DATA d, ");
        sql.append("  DOMAIN_DATA e, ");
        sql.append("  ROLE_PERMISSION role_per, ");
        sql.append("  permission pe, ");
        sql.append("  OPERATION op, ");
        sql.append("  AD_RESOURCE ad ");
        sql.append("WHERE a.SYS_USER_ID       =b.SYS_USER_ID ");
        sql.append("AND b.SYS_ROLE_ID         =c.SYS_ROLE_ID ");
        sql.append("AND b.USER_ROLE_ID        =d.USER_ROLE_ID ");
        sql.append("AND d.DOMAIN_DATA_ID      =e.DOMAIN_DATA_ID ");
        sql.append("AND c.SYS_ROLE_ID         =role_per.SYS_ROLE_ID ");
        sql.append("AND role_per.permission_id=pe.permission_id ");
        sql.append("AND pe.OPERATION_id       =op.OPERATION_id ");
        sql.append("AND pe.AD_RESOURCE_ID     =ad.AD_RESOURCE_ID ");
        sql.append("AND a.SYS_USER_ID         = '" + sysUserId + "' ");
        sql.append("AND upper(op.code ");
        sql.append("  ||' ' ");
        sql.append("  ||ad.code) LIKE '%" + adResource + "%' ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("dataCode", new StringType());
        query.addScalar("dataId", new LongType());
        query.addScalar("adResource", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(DomainDTO.class));
        return query.list();
    }
//    hoanm1_20190122_start
    public List<DomainDTO> getReceiveHandover(Long constructionId) {
        StringBuilder sql = new StringBuilder("");
        sql.append(" select CAT_STATION_HOUSE_ID catStationHouseId,CNT_CONTRACT_ID cntContractId,Received_goods_date receivedGoodsDate from ASSIGN_HANDOVER where construction_id =:constructionId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("catStationHouseId", new StringType());
        query.addScalar("cntContractId", new StringType());
        query.addScalar("receivedGoodsDate", new StringType());
        query.setParameter("constructionId", constructionId);
        query.setResultTransformer(Transformers.aliasToBean(DomainDTO.class));
        return query.list();
    }
    
    public void updateHandoverStation(Long constructionId,String catStationHouseId,String cntContractId, String receivedGoodsDate) {
    	if(receivedGoodsDate == null){
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append("UPDATE Assign_Handover SET Received_date=sysdate,Received_status=2 WHERE construction_id =:constructionId ");
            SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
            query.setParameter("constructionId",constructionId);
            
            StringBuilder stringBuilderStation = new StringBuilder();
            stringBuilderStation.append("UPDATE Rp_station_complete SET Handover_date_build=sysdate WHERE CAT_STATION_HOUSE_ID =:catStationHouseId and CNT_CONTRACT_ID =:cntContractId ");
            SQLQuery queryStation = getSession().createSQLQuery(stringBuilderStation.toString());
            queryStation.setParameter("catStationHouseId", Long.parseLong(catStationHouseId));
            queryStation.setParameter("cntContractId", Long.parseLong(cntContractId));
            
            StringBuilder stringBuilderCst = new StringBuilder();
            stringBuilderCst.append("UPDATE construction SET Handover_date_build=sysdate WHERE construction_id =:constructionId ");
            SQLQuery queryCst = getSession().createSQLQuery(stringBuilderCst.toString());
            queryCst.setParameter("constructionId",constructionId);
            
            query.executeUpdate();
            queryStation.executeUpdate();
            queryCst.executeUpdate();
            getSession().flush();
    	}else{
    		StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append("UPDATE Assign_Handover SET Received_status=5 WHERE construction_id =:constructionId ");
            SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
            query.setParameter("constructionId",constructionId);
            query.executeUpdate();
            getSession().flush();
    	}
    }
//    hoanm1_20190122_end
}
