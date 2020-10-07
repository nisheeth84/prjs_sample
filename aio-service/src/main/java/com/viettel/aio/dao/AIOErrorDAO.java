package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOErrorBO;
import com.viettel.aio.config.AIOAttachmentType;
import com.viettel.aio.dto.AIOCommonMistakeRequest;
import com.viettel.aio.dto.AIOErrorDTO;
import com.viettel.aio.dto.AIORequestGetErrorDetailDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@EnableTransactionManagement
@Transactional
@Repository("aioErrorDAO")
public class AIOErrorDAO extends BaseFWDAOImpl<AIOErrorBO, Long> {
    @Autowired
    CommonDAO commonDAO;

    public List<AIOErrorDTO> findErrorListByIdConfigService(AIOCommonMistakeRequest aioCommonMistakeRequest) {
        StringBuilder sql = new StringBuilder("Select ")
                .append("a.AIO_ERROR_ID aioErrorId, ")
                .append("a.CONTENT_ERROR contentError, ")
                .append("a.GROUP_ERROR_ID groupErrorId, ")
                .append("a.STATUS status, ")
                .append("a.GROUP_ERROR_NAME groupErrorName, ")
                .append("a.UPDATE_USER updateUser, ")
                .append("a.UPDATE_DATE updateDate, ")
                .append("a.CREATE_USER createUser, ")
                .append("a.CREATE_DATE createDate, ")
                .append("a.INDUSTRY_CODE industryCode ")
                .append(" from AIO_ERROR a")
                .append(" where 1=1 ")
                .append(" and a.STATUS not in (0) ");
        if (!"".contains(aioCommonMistakeRequest.getIndustryCode())) {
            sql.append(" and a.INDUSTRY_CODE = :code ");
        }
        if (aioCommonMistakeRequest.getIdConfigService() != null) {
            sql.append(" and a.group_Error_Id = :id ");
        }
        if (!"".contains(aioCommonMistakeRequest.getContentError())) {
            sql.append(" and a.content_Error = :contenErr ");
        }

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        if (!"".contains(aioCommonMistakeRequest.getIndustryCode())) {
            query.setParameter("code", aioCommonMistakeRequest.getIndustryCode(), new StringType());
        }
        if (aioCommonMistakeRequest.getIdConfigService() != null) {
            query.setParameter("id", aioCommonMistakeRequest.getIdConfigService(), new LongType());
        }
        if (!"".contains(aioCommonMistakeRequest.getContentError())) {
            query.setParameter("contenErr", aioCommonMistakeRequest.getContentError(), new StringType());
        }

        query.addScalar("aioErrorId", new LongType());
        query.addScalar("contentError", new StringType());
        query.addScalar("groupErrorId", new LongType());
        query.addScalar("status", new LongType());
        query.addScalar("groupErrorName", new StringType());
        query.addScalar("updateUser", new LongType());
        query.addScalar("updateDate", new DateType());
        query.addScalar("createUser", new LongType());
        query.addScalar("createDate", new DateType());
        query.addScalar("industryCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOErrorDTO.class));
        return query.list();
    }

    public List<AIORequestGetErrorDetailDTO> getItemAIOError(long id) {
        StringBuilder sql = new StringBuilder("Select a.aio_Error_ID aioErrorId, " +
                "a.content_Error contentError, " +
                "a.group_Error_Id groupErrorId, " +
                "a.status status, " +
                "a.group_Error_Name groupErrorName, ")
                .append("b.aio_Error_Detail_Id aioErrorDetailId, " +
                        "b.aio_Error_Id aioErrorId, " +
                        "b.content_Performer contentPerformer ")
                .append("from AIO_Error a ")
                .append("inner join AIO_Error_Detail b ")
                .append("on b.AIO_ERROR_ID = a.AIO_ERROR_ID ")
                .append("where a.aio_Error_Id =:id ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());

        query.addScalar("aioErrorId", new LongType());
        query.addScalar("aioErrorDetailId", new LongType());
        query.addScalar("contentError", new StringType());
        query.addScalar("groupErrorId", new LongType());
        query.addScalar("contentPerformer", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("groupErrorName", new StringType());
//        query.addScalar("name", new StringType());
//        query.addScalar("filePath", new StringType());
        query.addScalar("contentPerformer", new StringType());
        query.setParameter("id", id);
        query.setResultTransformer(Transformers.aliasToBean(AIORequestGetErrorDetailDTO.class));
        List<AIORequestGetErrorDetailDTO> aioRequestGetErrorDetailDTOList = query.list();

        for (AIORequestGetErrorDetailDTO i : aioRequestGetErrorDetailDTOList) {
            List<UtilAttachDocumentDTO> utilAttachDocumentDTOList = commonDAO.getListAttachmentByObjIDAndType(i.getAioErrorDetailId(), AIOAttachmentType.AIO_ERROR_ATTACHMENT.code);
            if (utilAttachDocumentDTOList != null) {
                i.setListImage(utilAttachDocumentDTOList);
            }
        }
        return aioRequestGetErrorDetailDTOList;
    }


    public Long updateStatusErrorList(AIOErrorDTO aioErrorDTO) {
        Date timeNow = new Date();
        aioErrorDTO.setUpdateDate(timeNow);
        return this.updateObject(aioErrorDTO.toModel());
    }

    public Long createAIOError(AIOErrorDTO aioErrorDTO) {
        Date timeNow = new Date();
        aioErrorDTO.setUpdateDate(timeNow);
        aioErrorDTO.setCreateDate(timeNow);
        return this.saveObject(aioErrorDTO.toModel());
    }
}
