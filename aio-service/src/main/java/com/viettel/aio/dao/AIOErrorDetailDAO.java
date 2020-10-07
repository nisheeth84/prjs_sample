package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOErrorDetailBO;
import com.viettel.aio.dto.AIOErrorDetailDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

@EnableTransactionManagement
@Transactional
@Repository("aioErrorDetailDAO")
public class AIOErrorDetailDAO extends BaseFWDAOImpl<AIOErrorDetailBO, Long>  {
    public Long createAIOErrorDetail(AIOErrorDetailDTO aioErrorDetailDTO)
    {
        return this.saveObject(aioErrorDetailDTO.toModel());
    }

    public Long updateAIOErrorDetail(AIOErrorDetailDTO aioErrorDetailDTO)
    {
        return this.updateObject(aioErrorDetailDTO.toModel());
    }
}
