package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOStaffPlanBO;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOStaffPlainDTO;
import com.viettel.aio.dto.AIOStaffPlanDTO;
import com.viettel.aio.dto.AIOStaffPlanDetailDTO;
import com.viettel.asset.bo.SysUser;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.DepartmentDTO;
import com.viettel.coms.utils.ValidateUtils;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import fr.opensagres.xdocreport.utils.StringUtils;
import org.hibernate.Query;
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

@EnableTransactionManagement
@Transactional
@Repository("aioStaffPlanDAO")
public class AIOStaffPlanDAO extends BaseFWDAOImpl<AIOStaffPlanBO, Long> {

    public AIOStaffPlanDAO() {
        this.model = new AIOStaffPlanBO();
    }

    public AIOStaffPlanDAO(Session session) {
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
    public List<AIOStaffPlainDTO> exportDetailToExcel(AIOStaffPlainDTO obj, List<String> idList) {
        StringBuilder sql = new StringBuilder("select mp.STAFF_PLAN_ID aioStaffPlanId, " +
                " mp.DESCRIPTION description, " +
                " mp.MONTH month, " +
                " mp.STATUS status, " +
                " mp.YEAR year, " +
                " mp.SYS_GROUP_NAME sysGroupName, " +
                " mpd.SYS_USER_CODE sysUserCode, " +
                " mpd.SYS_USER_NAME sysUserName, " +
                " mpd.TARGETS_AMOUNT_TM targetsAmountTM, " +
                " mpd.TARGETS_AMOUNT_DV targetsAmountDV, " +
                " mpd.TARGETS_ME targetsMe, " +
                " mpd.TARGETS_SH targetsSh, " +
                " mpd.TARGETS_NLMT targetsNlmt, " +
                " mpd.TARGETS_ICT targetsIct, " +
                " mpd.TARGETS_MS targetsMs, " +
                " sg.GROUP_NAME_LEVEL3 name " +
                " FROM AIO_STAFF_PLAN mp" +
                " Left Join AIO_STAFF_PLAN_DETAIL mpd " +
                " On mp.STAFF_PLAN_ID = mpd.AIO_STAFF_PLAN_ID " +
                " Left Join SYS_GROUP sg " +
                " On sg.SYS_GROUP_ID = mpd.SYS_GROUP_ID " +
                " WHERE 1=1 ");
        sql.append("and mp.SYS_GROUP_ID in (:idList) ");
        if (obj.getStatus() != null) {
            sql.append(" AND mp.STATUS=:status ");
        }
        if (obj.getMonth() != null) {
            sql.append(" AND mp.MONTH=:month ");
        }
        if (obj.getYear() != null) {
            sql.append(" AND mp.YEAR=:year ");
        }
        sql.append(" ORDER BY mp.STAFF_PLAN_ID DESC ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
        query.addScalar("aioStaffPlanId", new LongType());
        query.addScalar("description", new StringType());
        query.addScalar("month", new StringType());
        query.addScalar("year", new StringType());
        query.addScalar("status", new LongType());

        query.addScalar("sysUserCode", new StringType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("targetsAmountTM", new LongType());
        query.addScalar("targetsAmountDV", new LongType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("name", new StringType());

        query.addScalar("targetsMe", new LongType());
        query.addScalar("targetsSh", new LongType());
        query.addScalar("targetsNlmt", new LongType());
        query.addScalar("targetsIct", new LongType());
        query.addScalar("targetsMs", new LongType());
        query.addScalar("status", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(AIOStaffPlainDTO.class));
        if (obj.getStatus() != null) {
            query.setParameter("status", obj.getStatus());
            queryCount.setParameter("status", obj.getStatus());
        }
        if (obj.getMonth() != null) {
            query.setParameter("month", obj.getMonth());
            queryCount.setParameter("month", obj.getMonth());
        }
        if (obj.getYear() != null) {
            query.setParameter("year", obj.getYear());
            queryCount.setParameter("year", obj.getYear());
        }
        query.setParameterList("idList", idList);
        queryCount.setParameterList("idList", idList);
        this.setPageSize(obj, query, queryCount);
        return query.list();
    }


    public List<AIOStaffPlainDTO> doSearch(AIOStaffPlainDTO obj, List<String> idList) {
        StringBuilder sql = new StringBuilder("select mp.STAFF_PLAN_ID aioStaffPlanId, " +
                " mp.DESCRIPTION description, " +
                " mp.MONTH month, " +
                " mp.STATUS status, " +
                " mp.YEAR year " +
                " FROM AIO_STAFF_PLAN mp" +
                " WHERE 1=1 ");
        sql.append("and mp.SYS_GROUP_ID in (:idList) ");
        if (obj.getStatus() != null) {
            sql.append(" AND mp.STATUS=:status ");
        }
        if (obj.getMonth() != null) {
            sql.append(" AND mp.MONTH=:month ");
        }
        if (obj.getYear() != null) {
            sql.append(" AND mp.YEAR=:year ");
        }
        sql.append(" ORDER BY mp.STAFF_PLAN_ID DESC ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
        query.addScalar("aioStaffPlanId", new LongType());
        query.addScalar("description", new StringType());
        query.addScalar("month", new StringType());
        query.addScalar("year", new StringType());
        query.addScalar("status", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(AIOStaffPlainDTO.class));
        if (obj.getStatus() != null) {
            query.setParameter("status", obj.getStatus());
            queryCount.setParameter("status", obj.getStatus());
        }
        if (obj.getMonth() != null) {
            query.setParameter("month", obj.getMonth());
            queryCount.setParameter("month", obj.getMonth());
        }
        if (obj.getYear() != null) {
            query.setParameter("year", obj.getYear());
            queryCount.setParameter("year", obj.getYear());
        }
        query.setParameterList("idList", idList);
        queryCount.setParameterList("idList", idList);
        this.setPageSize(obj, query, queryCount);
        return query.list();
    }

    public AIOStaffPlanDTO findStaffPlan(long sysGroupId, String year, String month, long status, int pageSize, int page) {

        String queryWhere = "where sysGroupId=:sysGroupId and status=:status";
        if (StringUtils.isNotEmpty(month)) {
            queryWhere += " and month=:month";
        }
        if (StringUtils.isNotEmpty(year)) {
            queryWhere += " and year=:year";
        }
        Query query = this.getSession().createQuery("from AIOStaffPlanBO " + queryWhere);
        query.setParameter("sysGroupId", sysGroupId);
        query.setParameter("status", status);

        if (StringUtils.isNotEmpty(month)) {
            query.setParameter("month", month);
        }
        if (StringUtils.isNotEmpty(year)) {
            query.setParameter("year", year);
        }

        query.setFirstResult(page - 1);
        query.setMaxResults(pageSize);

        String queryWhereCount = "where SYS_GROUP_ID=:sysGroupId and status=:status";
        if (StringUtils.isNotEmpty(month)) {
            queryWhereCount += " and month=:month";
        }
        if (StringUtils.isNotEmpty(year)) {
            queryWhereCount += " and year=:year";
        }

        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM AIO_STAFF_PLAN " + queryWhereCount);
        queryCount.setParameter("sysGroupId", sysGroupId);
        queryCount.setParameter("status", status);

        if (StringUtils.isNotEmpty(month)) {
            queryCount.setParameter("month", month);
        }
        if (StringUtils.isNotEmpty(year)) {
            queryCount.setParameter("year", year);
        }

        AIOStaffPlanDTO aioStaffPlanDTO = new AIOStaffPlanDTO();

        aioStaffPlanDTO.setAioStaffPlanBOS(query.list());
        aioStaffPlanDTO.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).longValue());

        return aioStaffPlanDTO;
    }

    public AIOStaffPlainDTO checkDataMonthPlan(AIOStaffPlainDTO obj) {
        StringBuilder sql = new StringBuilder("select STAFF_PLAN_ID aioStaffPlanId"
                + " from AIO_STAFF_PLAN "
                + " where month=:month"
                + " and year=:year "
                + " and status = '1' ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("aioStaffPlanId", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(AIOStaffPlainDTO.class));
        query.setParameter("month", obj.getMonth());
        query.setParameter("year", obj.getYear());

        @SuppressWarnings("unchecked")
        List<AIOStaffPlainDTO> lst = query.list();
        if (lst.size() > 0) {
            return lst.get(0);
        }
        return null;
    }

    public List<AIOStaffPlanDetailDTO> checkDuplicateStaffPlan(AIOStaffPlainDTO obj) {
        String sql = "select " +
                "pd.STAFF_PLAN_DETAIL_ID aioStaffPlanDetailId, " +
                "pd.SYS_USER_CODE sysUserCode " +
                "from aio_staff_plan p " +
                "left join aio_staff_plan_detail pd on pd.AIO_STAFF_PLAN_ID = p.STAFF_PLAN_ID " +
                "where p.month = :month " +
                "and p.year = :year " +
                "and p.status = 1 " +
                "and pd.sys_user_code in (:codes) ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOStaffPlanDetailDTO.class));
        query.addScalar("aioStaffPlanDetailId", new LongType());
        query.addScalar("sysUserCode", new StringType());
        query.setParameter("month", obj.getMonth());
        query.setParameter("year", obj.getYear());
        query.setParameterList("codes", obj.getSysUserCodes());

        return query.list();
    }

    public DepartmentDTO getSysGroupLevelByUserId(Long sysUserId, int level) {
        String sql = "select SYS_GROUP_ID sysGroupId, name as name, code as code from sys_group where SYS_GROUP_ID = (select " +
                "TO_NUMBER((substr(sg.path, INSTR(sg.path, '/', 1, :lv) + 1, INSTR(sg.path, '/', 1, :lv + 1) - (INSTR(sg.path, '/', 1, :lv) + 1)))) " +
                "from sys_Group sg " +
                "where sg.sys_group_id = " +
                "(select sys_group_id from sys_user where sys_user_id = :sysUserId)) ";
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));

        query.addScalar("sysGroupId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());

        query.setParameter("sysUserId", sysUserId);
        query.setParameter("lv", level);

        List<DepartmentDTO> list = query.list();
        if (list != null || !list.isEmpty()) {
            return (DepartmentDTO) list.get(0);
        }
        return null;
    }

    public List<AIOStaffPlanDetailDTO> getDetailByMonthPlanId(AIOStaffPlainDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT ");
        sql.append("mpd.STAFF_PLAN_DETAIL_ID aioStaffPlanDetailId, ")
                .append("mpd.AIO_STAFF_PLAN_ID aioStaffPlanId, ")
                .append("mpd.SYS_USER_ID sysUserId, ")
                .append("mpd.SYS_USER_CODE sysUserCode, ")
                .append("mpd.SYS_USER_NAME sysUserName, ")
                .append("mpd.MONTH_PLAN_NAME monthPlanName, ")
                .append("mpd.MONTH_PLAN_TYPE monthPlanType, ")
                .append("mpd.TARGETS_AMOUNT targetsAmount ")
                .append("From AIO_STAFF_PLAN_DETAIL mpd ")
                .append("left join AIO_STAFF_PLAN mp on mp.STAFF_PLAN_ID = mpd.AIO_STAFF_PLAN_ID ")
                .append("where mpd.AIO_STAFF_PLAN_ID=:id and mp.status=1 ")
                .append("order by mpd.STAFF_PLAN_DETAIL_ID ASC ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
        query.addScalar("aioStaffPlanDetailId", new LongType());
        query.addScalar("aioStaffPlanId", new LongType());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("sysUserCode", new StringType());
        query.addScalar("targetsAmount", new LongType());
        query.addScalar("monthPlanName", new StringType());
        query.addScalar("monthPlanType", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOStaffPlanDetailDTO.class));
        query.setParameter("id", obj.getAioStaffPlanId());
        queryCount.setParameter("id", obj.getAioStaffPlanId());
        this.setPageSize(obj, query, queryCount);
        return query.list();
    }

    public List<AIOStaffPlanDetailDTO> getDetailByStaffPlanId(AIOStaffPlainDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT ");
        sql.append("mpd.STAFF_PLAN_DETAIL_ID aioStaffPlanDetailId, ")
                .append("mpd.AIO_STAFF_PLAN_ID aioStaffPlanId, ")
                .append("mpd.SYS_USER_ID sysUserId, ")
                .append("mpd.SYS_USER_CODE sysUserCode, ")
                .append("mpd.SYS_USER_NAME sysUserName, ")
                .append("sg.CODE sysGroupCode, ")
                .append("sg.NAME sysGroupName, ")
                .append("mpd.SYS_GROUP_ID sysGroupId, ")
                .append("mpd.TARGETS_AMOUNT_TM targetsAmountTM, ")
                .append("mpd.TARGETS_AMOUNT_DV targetsAmountDV, ")
                //tatph-start-25/12/2019
                .append("mpd.TARGETS_ME targetsMe, ")
                .append("mpd.TARGETS_SH targetsSh, ")
                .append("mpd.TARGETS_NLMT targetsNlmt, ")
                .append("mpd.TARGETS_ICT targetsIct, ")
                .append("mpd.TARGETS_MS targetsMs ")
                //tatph-end-25/12/2019
                .append("FROM AIO_STAFF_PLAN_DETAIL mpd ")
                .append("LEFT JOIN AIO_STAFF_PLAN mp on mp.STAFF_PLAN_ID = mpd.AIO_STAFF_PLAN_ID ")
                .append("LEFT JOIN SYS_GROUP sg ON sg.SYS_GROUP_ID = mpd.SYS_GROUP_ID ")

                .append("where mpd.AIO_STAFF_PLAN_ID=:id and mp.status=1 ")
                .append("order by mpd.STAFF_PLAN_DETAIL_ID ASC ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
        query.addScalar("aioStaffPlanDetailId", new LongType());
        query.addScalar("aioStaffPlanId", new LongType());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("sysUserCode", new StringType());
        query.addScalar("targetsAmountTM", new LongType());
        query.addScalar("targetsAmountDV", new LongType());
        query.addScalar("sysGroupCode", new StringType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupName", new StringType());
        //tatph-start-25/12/2019
        query.addScalar("targetsMe", new LongType());
        query.addScalar("targetsSh", new LongType());
        query.addScalar("targetsNlmt", new LongType());
        query.addScalar("targetsIct", new LongType());
        query.addScalar("targetsMs", new LongType());
        //tatph-end-25/12/2019
        query.setResultTransformer(Transformers.aliasToBean(AIOStaffPlanDetailDTO.class));
        query.setParameter("id", obj.getAioStaffPlanId());
        queryCount.setParameter("id", obj.getAioStaffPlanId());
        this.setPageSize(obj, query, queryCount);
        return query.list();
    }

    public List<AIOConfigServiceDTO> searchColumnsConfigService() {
        StringBuilder sql = new StringBuilder("SELECT ");
        sql.append("mpd.AIO_CONFIG_SERVICE_ID aioConfigServiceId, ")
                .append("mpd.CODE code, ")
                .append("mpd.NAME name, ")
                .append("mpd.TYPE type ")
                .append("From AIO_CONFIG_SERVICE mpd ")
                .append("where mpd.status !=0 ")
                .append("order by mpd.NAME ASC ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.addScalar("aioConfigServiceId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("type", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(AIOConfigServiceDTO.class));
        return query.list();
    }

    public AIOStaffPlainDTO getAioMonthPlanDTO(Long id) {
        StringBuilder sql = new StringBuilder("select MONTH month, YEAR year from AIO_STAFF_PLAN where STAFF_PLAN_ID=:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("month", new StringType());
        query.addScalar("year", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOStaffPlainDTO.class));
        query.setParameter("id", id);
        @SuppressWarnings("unchecked")
        List<AIOStaffPlainDTO> lst = query.list();
        if (lst.size() > 0) {
            return lst.get(0);
        }
        return null;
    }

    public int deleteStaffPlanDetail(Long id) {
        StringBuilder sql = new StringBuilder("DELETE FROM AIO_STAFF_PLAN_DETAIL where AIO_STAFF_PLAN_ID=:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        return query.executeUpdate();
    }

    public List<SysUser> getUserLevelTwo(AIOStaffPlainDTO dto) {
        StringBuilder sql = new StringBuilder("SELECT ");
        sql.append("mpd.EMPLOYEE_CODE employeeCode ")
                .append("From SYS_USER mpd ")
                .append("where SYS_GROUP_ID in (select SYS_GROUP_ID from SYS_GROUP where upper(PATH) like upper(:keySearch)");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.addScalar("aioConfigServiceId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("type", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(SysUser.class));

        return query.list();
    }

    public AIOStaffPlainDTO getSumTargetMonth(AIOStaffPlainDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT ");
        sql.append("sum(pd.TARGETS_AMOUNT) sumTargetAmount FROM AIO_MONTH_PLAN p, AIO_MONTH_PLAN_DETAIL pd ")
                .append("WHERE p.AIO_MONTH_PLAN_ID = pd.AIO_MONTH_PLAN_ID ")
                .append("and p.MONTH = :month ")
                .append("and p.YEAR = :year ")
                .append("and p.STATUS = 1 ")
                .append("and pd.SYS_GROUP_ID = :sysGroupId");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.addScalar("sumTargetAmount", new DoubleType());
        query.setResultTransformer(Transformers.aliasToBean(AIOStaffPlainDTO.class));
        query.setParameter("month", obj.getMonth());
        query.setParameter("year", obj.getYear());
        query.setParameter("sysGroupId", obj.getSysGroupId());
        List<AIOStaffPlainDTO> lst = query.list();
        if (lst.size() > 0) {
            return lst.get(0);
        }
        return null;
    }

    public boolean checkExistPlanOfMonth(String year, String month, String sysGroupId) {
        Query query = this.getSession().createQuery("from AIOStaffPlanBO where year=:year and month=:month and sysGroupId=:sysGroupId and status=1");
        query.setParameter("year", year);
        query.setParameter("month", month);
        query.setParameter("sysGroupId", sysGroupId);

        if (query.list() == null || query.list().isEmpty()) {
            return false;
        }

        return true;
    }

    public Long getSumTargetPlanOfMonth(String year, String month, Long sysGroupId) {
        StringBuilder sql = new StringBuilder("SELECT ");
        sql.append(" sum(nvl(pd.TARGETS_ME,0) + nvl(pd.TARGETS_SH,0) + nvl(pd.TARGETS_NLMT,0) + nvl(pd.TARGETS_ICT,0) + nvl(pd.TARGETS_MS,0)) as sumTargetAmount FROM AIO_MONTH_PLAN p, AIO_MONTH_PLAN_DETAIL pd ")
                .append("WHERE p.AIO_MONTH_PLAN_ID = pd.MONTH_PLAN_ID ")
                .append("and p.MONTH = :month ")
                .append("and p.YEAR = :year ")
                .append("and p.STATUS = 1 ")
                .append("and pd.SYS_GROUP_ID = :sysGroupId");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("month", month);
        query.setParameter("year", year);
        query.setParameter("sysGroupId", sysGroupId);
        List<Long> lst = query.list();

        if (lst != null && !lst.isEmpty()) {
            if (lst.get(0) != null) {
                return Long.parseLong(String.valueOf(lst.get(0)));
            }
        }

        return 0L;
    }

    public List<AIOStaffPlanDetailDTO> getAllSysGroup(Long sysGroupLevel2) {
        StringBuilder sql = new StringBuilder("SELECT sys_group_id sysGroupId," +
                " code sysGroupCode," +
                " name sysGroupName" +
                " FROM SYS_GROUP" +
                " WHERE PARENT_ID = :sysGroupLevel2 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupCode", new StringType());
        query.addScalar("sysGroupName", new StringType());

        query.setParameter("sysGroupLevel2", sysGroupLevel2);
        query.setResultTransformer(Transformers.aliasToBean(AIOStaffPlanDetailDTO.class));

        return query.list();
    }

    public List<AIOStaffPlanDetailDTO> getAllSysGroup(List<String> sysUserIdsPermission) {
        StringBuilder sql = new StringBuilder("SELECT sys_group_id sysGroupId," +
                " code sysGroupCode," +
                " name sysGroupName" +
                " FROM SYS_GROUP" +
                " WHERE PARENT_ID in (:sysUserIdsPermission) " +
                "order by PARENT_ID ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupCode", new StringType());
        query.addScalar("sysGroupName", new StringType());

        query.setParameterList("sysUserIdsPermission", sysUserIdsPermission);
        query.setResultTransformer(Transformers.aliasToBean(AIOStaffPlanDetailDTO.class));

        return query.list();
    }

    public List<AIOStaffPlanDetailDTO> getAllSysUser(Long sysGroupLevel2) {
        StringBuilder sql = new StringBuilder("SELECT SYS_USER_ID sysUserId, FULL_NAME sysUserName,LOGIN_NAME sysUserCode " +
                "FROM sys_user " +
                "WHERE SYS_GROUP_ID IN " +
                "  ( SELECT sys_group_id sysGroupId FROM SYS_GROUP WHERE PARENT_ID = :sysGroupLevel2 " +
                "  ) ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("sysUserCode", new StringType());
        query.setParameter("sysGroupLevel2", sysGroupLevel2);
        query.setResultTransformer(Transformers.aliasToBean(AIOStaffPlanDetailDTO.class));

        return query.list();
    }

    public List<AIOStaffPlanDetailDTO> getAllSysUser(List<String> sysUserIdsPermission) {
        StringBuilder sql = new StringBuilder(
                "SELECT " +
                "su.SYS_USER_ID sysUserId, " +
                "su.FULL_NAME sysUserName," +
                "su.LOGIN_NAME sysUserCode, " +
                "su.SYS_GROUP_ID sysGroupId " +
                ", ( SELECT code FROM SYS_GROUP WHERE SYS_GROUP_ID = su.SYS_GROUP_ID ) sysGroupCode " +
                "FROM sys_user su " +
                "WHERE SYS_GROUP_ID IN " +
                "  ( SELECT sys_group_id sysGroupId FROM SYS_GROUP WHERE PARENT_ID in (:sysUserIdsPermission) ) " +
                "order by SYS_GROUP_ID ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("sysUserCode", new StringType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupCode", new StringType());
        query.setParameterList("sysUserIdsPermission", sysUserIdsPermission);
        query.setResultTransformer(Transformers.aliasToBean(AIOStaffPlanDetailDTO.class));

        return query.list();
    }

    public List<AIOStaffPlanDetailDTO> getAllSysGroupByCode(AIOStaffPlanDetailDTO obj, Long sysGroupLevel2) {
        StringBuilder sql = new StringBuilder("select sys_group_id sysGroupId,code sysGroupCode,"
                + " name sysGroupName "
                + " from CTCT_CAT_OWNER.SYS_GROUP "
                + " where status=1 and GROUP_LEVEL in (3) AND PARENT_ID = :sysGroupLevel2");
        if (StringUtils.isNotEmpty(obj.getSysGroupCode())) {
            sql.append(" AND (upper(name) LIKE upper(:name) escape '&' OR upper(code) LIKE upper(:name) escape '&')");
        }
        sql.append(" order by sys_group_id asc ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupCode", new StringType());
        query.addScalar("sysGroupName", new StringType());

        query.setParameter("sysGroupLevel2", sysGroupLevel2);
        queryCount.setParameter("sysGroupLevel2", sysGroupLevel2);
        query.setResultTransformer(Transformers.aliasToBean(AIOStaffPlanDetailDTO.class));

        if (StringUtils.isNotEmpty(obj.getSysGroupCode())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getSysGroupCode()) + "%");
            queryCount.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getSysGroupCode()) + "%");
        }

        this.setPageSize(obj, query, queryCount);

        return query.list();
    }

    public List<AIOStaffPlanDetailDTO> getAllSysUserByName(AIOStaffPlanDetailDTO obj, Long sysGroupLevel2) {
        StringBuilder sql = new StringBuilder("SELECT su.SYS_USER_ID sysUserId, su.FULL_NAME sysUserName,su.LOGIN_NAME sysUserCode " +
                "FROM sys_user su inner join sys_group sg ON su.SYS_GROUP_ID = sg.SYS_GROUP_ID WHERE 1= 1  ");

        if (StringUtils.isNotEmpty(obj.getSysGroupCode())) {
            sql.append(" AND sg.CODE = :sysGroupCode ");
        }
        if (StringUtils.isNotEmpty(obj.getSysUserName())) {
            sql.append(" AND (upper(su.FULL_NAME) LIKE upper(:name) escape '&' OR upper(su.LOGIN_NAME) LIKE upper(:name) escape '&')");
        }
        sql.append(" order by su.sys_group_id asc ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        query.addScalar("sysUserId", new LongType());
        query.addScalar("sysUserCode", new StringType());
        query.addScalar("sysUserName", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AIOStaffPlanDetailDTO.class));

        if (StringUtils.isNotEmpty(obj.getSysGroupCode())) {
            query.setParameter("sysGroupCode", obj.getSysGroupCode());
            queryCount.setParameter("sysGroupCode", obj.getSysGroupCode());
        }


        if (StringUtils.isNotEmpty(obj.getSysUserName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getSysUserName()) + "%");
            queryCount.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getSysUserName()) + "%");
        }

        this.setPageSize(obj, query, queryCount);

        return query.list();
    }

    public int validateNewEdit(AIOStaffPlanDetailDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM SYS_USER su INNER JOIN SYS_GROUP sg ON su.SYS_GROUP_ID = sg.SYS_GROUP_ID " +
                "WHERE 1=1 ");
        if (StringUtils.isNotEmpty(obj.getSysUserId().toString())) {
            sql.append(" AND su.SYS_USER_ID  = :sysUserId ");
        }
        if (StringUtils.isNotEmpty(obj.getSysUserId().toString())) {
            sql.append(" AND sg.CODE = :sysGroupCode ");
        }
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        if (StringUtils.isNotEmpty(obj.getSysUserId().toString())) {
            query.setParameter("sysUserId", obj.getSysUserId());
        }
        if (StringUtils.isNotEmpty(obj.getSysUserId().toString())) {
            query.setParameter("sysGroupCode", obj.getSysGroupCode());
        }
        return ((BigDecimal) query.uniqueResult()).intValue();
    }

    public void removeStaffPlan(AIOStaffPlainDTO obj) {
        StringBuilder sql = new StringBuilder("UPDATE AIO_STAFF_PLAN SET STATUS = 0 WHERE 1=1 ");
        if (obj.getAioStaffPlanId() != null) {
            sql.append(" AND STAFF_PLAN_ID =:id ");
        }

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        if (obj.getAioStaffPlanId() != null) {
            query.setParameter("id", obj.getAioStaffPlanId());
        }

        query.executeUpdate();
    }

    public boolean checkSysUserByGroup(String sysUserCode, String sysGroupCode) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM SYS_USER su INNER JOIN SYS_GROUP sg ON su.SYS_GROUP_ID = sg.SYS_GROUP_ID " +
                "WHERE 1=1 ");
        if (StringUtils.isNotEmpty(sysUserCode)) {
            sql.append(" AND su.LOGIN_NAME  = :sysUserCode ");
        }
        if (StringUtils.isNotEmpty(sysGroupCode)) {
            sql.append(" AND sg.CODE = :sysGroupCode ");
        }
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        if (StringUtils.isNotEmpty(sysUserCode)) {
            query.setParameter("sysUserCode", sysUserCode);
        }
        if (StringUtils.isNotEmpty(sysGroupCode)) {
            query.setParameter("sysGroupCode", sysGroupCode);
        }
        int count = ((BigDecimal) query.uniqueResult()).intValue();
        if (count == 1) {
            return true;
        }
        return false;
    }

    public int updateStaffPlan(AIOStaffPlainDTO obj) {
        String sql = "update AIO_STAFF_PLAN " +
                "set UPDATE_USER = :sysUserId, " +
                "UPDATE_DATE = sysdate " +
                "where STAFF_PLAN_ID = :id ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", obj.getAioStaffPlanId());
        query.setParameter("sysUserId", obj.getUpdateUser());

        return query.executeUpdate();
    }

    public Long checkExistUpdate(Long staffPlanId, Long sysGroupLv2) {
        String sql = "select STAFF_PLAN_ID from aio_staff_plan " +
                "where STAFF_PLAN_ID = :staffPlanId and SYS_GROUP_ID = :sysGroupId " +
                "and status = 1 ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("staffPlanId", staffPlanId);
        query.setParameter("sysGroupId", sysGroupLv2);

        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (Long) list.get(0);
        }
        return null;
    }

    public boolean checkExistInsert(Long sysGroupLv2, String month, String year) {
        String sql = "select STAFF_PLAN_ID from aio_staff_plan " +
                "where SYS_GROUP_ID = :sysGroupId " +
                "and MONTH = :month " +
                "and YEAR = :year " +
                "and status = 1 ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("sysGroupId", sysGroupLv2);
        query.setParameter("month", month);
        query.setParameter("year", year);

        List list = query.list();
        return (list != null && !list.isEmpty());
    }

    public List<AIOStaffPlanDetailDTO> getMonthlyTargetsByStaffId(AIOStaffPlainDTO obj, String sysGroupIdStr) {
        StringBuilder sql = new StringBuilder("SELECT ");
        sql.append("mpd.TARGETS_ME targetsMe, ")
                .append("mpd.TARGETS_SH targetsSh, ")
                .append("mpd.TARGETS_NLMT targetsNlmt, ")
                .append("mpd.TARGETS_ICT targetsIct, ")
                .append("mpd.TARGETS_MS targetsMs ")
                .append("FROM AIO_MONTH_PLAN mp ")
                .append("LEFT JOIN AIO_MONTH_PLAN_DETAIL mpd on mp.AIO_MONTH_PLAN_ID = mpd.MONTH_PLAN_ID ")
                .append("LEFT JOIN SYS_GROUP sg ON sg.SYS_GROUP_ID = mpd.SYS_GROUP_ID ")

                .append("where sg.SYS_GROUP_ID =:sysGroupIdStr ")
                .append("And mp.MONTH =:month ")
                .append("And mp.YEAR =:year ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
        query.addScalar("targetsMe", new LongType());
        query.addScalar("targetsSh", new LongType());
        query.addScalar("targetsNlmt", new LongType());
        query.addScalar("targetsIct", new LongType());
        query.addScalar("targetsMs", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(AIOStaffPlanDetailDTO.class));
        query.setParameter("sysGroupIdStr", sysGroupIdStr);
        query.setParameter("month", obj.getMonth());
        query.setParameter("year", obj.getYear());

        queryCount.setParameter("sysGroupIdStr", sysGroupIdStr);
        queryCount.setParameter("month", obj.getMonth());
        queryCount.setParameter("year", obj.getYear());
        this.setPageSize(obj, query, queryCount);
        return query.list();
    }
}
