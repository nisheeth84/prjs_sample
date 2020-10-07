package com.viettel.aio.business;

import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.CacheManager;
import com.viettel.aio.config.DomainDataCache;
import com.viettel.aio.dao.AIORevenueAndContractRemainDAO;
import com.viettel.aio.dto.AIOBaseRequest;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIORevenueAndRemainDTO;
import com.viettel.aio.dto.AIOSysGroupDTO;
import com.viettel.aio.dto.ComsBaseFWDTO;
import com.viettel.aio.dto.SysUserRequest;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import com.viettel.utils.Constant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

//VietNT_20191101_created
@Service("aioRevenueAndContractRemainBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIORevenueAndContractRemainBusinessImpl extends BaseFWBusinessImpl<AIORevenueAndContractRemainDAO, ComsBaseFWDTO, BaseFWModelImpl> {

    static Logger LOGGER = LoggerFactory.getLogger(AIORevenueAndContractRemainBusinessImpl.class);

    @Autowired
    public AIORevenueAndContractRemainBusinessImpl(AIORevenueAndContractRemainDAO aioRevenueAndContractRemainDao,
                                                   CommonServiceAio commonServiceAio) {
        this.aioRevenueAndContractRemainDao = aioRevenueAndContractRemainDao;
        this.commonServiceAio = commonServiceAio;
        this.cacheManager = new CacheManager();
    }

    private AIORevenueAndContractRemainDAO aioRevenueAndContractRemainDao;
    private CommonServiceAio commonServiceAio;
    private CacheManager cacheManager;

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;

    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    private static final int FLAG_GROUP = 1;
    private static final int FLAG_PROVINCE = 2;

    private static ConcurrentHashMap<Long, DomainDataCache<List<String>>> domainData;

    public List<String> checkPermission(SysUserRequest rq) {
        if (rq.getSysUserId() == 0) {
            throw new BusinessException(AIOErrorType.NOT_AUTHORIZE.msg);
        }
        return this.getDomainDataOfUserPermission(rq.getSysUserId());
    }

    public List<String> getDomainDataOfUserPermission(Long sysUserId) {
        if (domainData == null) {
            domainData = new ConcurrentHashMap<>();
        }
        List<String> domains = cacheManager.getDomainDataCache(sysUserId, domainData);
        if (domains == null) {
            domains = commonServiceAio.getDomainDataOfUserPermission(Constant.OperationKey.VIEW, Constant.AdResourceKey.PROVINCE, sysUserId);
            cacheManager.saveDomainDataCache(sysUserId, domains, domainData);
        }

        return domains;
    }

    public AIORevenueAndRemainDTO getContractDashboardInfo(AIOBaseRequest<AIORevenueAndRemainDTO> rq) {
        Long sysUserId = rq.getSysUserRequest().getSysUserId();
        AIORevenueAndRemainDTO criteria = rq.getData();
        this.validateRequest(rq.getSysUserRequest(), criteria);

        // check permission
        criteria.setFlag(this.getDomainDataOfUserPermission(sysUserId).isEmpty() ? FLAG_GROUP : criteria.getFlag());

        String subQuery;
        List<String> sysGroupIds;
        if (criteria.getFlag().equals(FLAG_GROUP)) {
            subQuery = "and PERFORMER_ID IN (SELECT sys_user_id FROM SYS_USER WHERE sys_group_id in (:sysGroupIds)) ";
            sysGroupIds = Collections.singletonList(criteria.getSysGroupId() != null
                    ? criteria.getSysGroupId().toString()
                    : String.valueOf(rq.getSysUserRequest().getDepartmentId()));
        } else if (criteria.getFlag().equals(FLAG_PROVINCE)) {
            subQuery = "AND PERFORMER_GROUP_ID IN (:sysGroupIds) ";
            sysGroupIds = this.getDomainDataOfUserPermission(sysUserId);
        } else {
            throw new BusinessException(AIOErrorType.NOT_VALID.msg);
        }

        AIORevenueAndRemainDTO res = new AIORevenueAndRemainDTO();
        if (criteria.getIsList() != null && criteria.getIsList() == 1) {
            List<AIORevenueAndRemainDTO> data = aioRevenueAndContractRemainDao.getListContract(subQuery, sysGroupIds);
            res.setList(data);
        } else {
            List<AIORevenueAndRemainDTO> data = aioRevenueAndContractRemainDao.getContractDashboardInfo(subQuery, sysGroupIds);
            if (data.size() == 2) {
                res.setContractRemain(data.get(0).getCount());
                res.setContractRemainExpired(data.get(1).getCount());
            } else if (data.size() == 1) {
                if (data.get(0).getFlag() == 1) {
                    res.setContractRemain(data.get(0).getCount());
                    res.setContractRemainExpired(0L);
                } else {
                    res.setContractRemain(0L);
                    res.setContractRemainExpired(data.get(0).getCount());
                }
            } else {
                res.setContractRemain(0L);
                res.setContractRemainExpired(0L);
            }
        }
        return res;
    }

    public AIORevenueAndRemainDTO getRevenueDashboardInfo(AIOBaseRequest<AIORevenueAndRemainDTO> rq) {
        Long sysUserId = rq.getSysUserRequest().getSysUserId();
        AIORevenueAndRemainDTO criteria = rq.getData();
        this.validateRequest(rq.getSysUserRequest(), criteria);

        // check permission
        criteria.setFlag(this.getDomainDataOfUserPermission(sysUserId).isEmpty() ? FLAG_GROUP : criteria.getFlag());

        String subQuery;
        List<String> sysGroupIds;
        String subQueryPlan;
        if (criteria.getFlag().equals(FLAG_GROUP)) {
            subQuery = "and PERFORMER_ID IN (SELECT sys_user_id FROM SYS_USER WHERE sys_group_id in (:sysGroupIds)) ";
            sysGroupIds = Collections.singletonList(criteria.getSysGroupId() != null
                    ? criteria.getSysGroupId().toString()
                    : String.valueOf(rq.getSysUserRequest().getDepartmentId()));
            subQueryPlan = "SELECT nvl(sum(md.TARGETS_AMOUNT_TM + md.TARGETS_AMOUNT_DV), 0) amount " +
                    "FROM AIO_STAFF_PLAN m " +
                    "LEFT JOIN AIO_STAFF_PLAN_DETAIL md ON md.AIO_STAFF_PLAN_ID = m.STAFF_PLAN_ID ";
        } else if (criteria.getFlag().equals(FLAG_PROVINCE)) {
            subQuery = "AND PERFORMER_GROUP_ID IN (:sysGroupIds) ";
            sysGroupIds = this.getDomainDataOfUserPermission(sysUserId);
            subQueryPlan = "SELECT nvl(sum(md.targets_amount + md.TARGETS_AMOUNT_DV), 0) amount " +
                    "FROM AIO_MONTH_PLAN m " +
                    "LEFT JOIN AIO_MONTH_PLAN_DETAIL md ON md.MONTH_PLAN_ID = m.AIO_MONTH_PLAN_ID ";
        } else {
            throw new BusinessException(AIOErrorType.NOT_VALID.msg);
        }

        AIORevenueAndRemainDTO res = new AIORevenueAndRemainDTO();
//        Calendar c = Calendar.getInstance();
//        String month = String.format("%02d", c.get(Calendar.MONTH) + 1);
//        String year = String.valueOf(c.get(Calendar.YEAR));

        //
        if (criteria.getIsList() != null && criteria.getIsList() == 1) {
            List<AIORevenueAndRemainDTO> data = aioRevenueAndContractRemainDao.getListRevenue(subQuery, sysGroupIds);
            res.setList(data);
        } else {
            Long amount = aioRevenueAndContractRemainDao.getRevenueDashboardInfo(subQuery, sysGroupIds);
            Long total = aioRevenueAndContractRemainDao.getRevenueTotalGraphInfo(subQueryPlan, sysGroupIds);
//            Long total = aioRevenueAndContractRemainDao.getRevenueTotalGraphInfo(subQueryPlan, sysGroupIds, "08", year);
            Long performed = aioRevenueAndContractRemainDao.getRevenuePerformGraphInfo(subQuery, sysGroupIds);
            double revDaily = new BigDecimal(amount.doubleValue() / 1000000).setScale(2, RoundingMode.HALF_UP).doubleValue();

            res.setRevenueTotalMonth(total);
            res.setRevenuePerformMonth(performed);
            res.setRevenueDaily(revDaily);
        }

        return res;
    }

    private void validateRequest(SysUserRequest sysUserRequest, AIORevenueAndRemainDTO criteria) {
        if (sysUserRequest == null || sysUserRequest.getSysUserId() == 0) {
            throw new BusinessException(AIOErrorType.USER_NOT_LOGGED_IN.msg);
        }
        if (criteria == null || criteria.getFlag() == null) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg);
        }
    }

    public List<AIOSysGroupDTO> getListGroup(Long id) {
        return aioRevenueAndContractRemainDao.getListGroup(id);
    }
}
