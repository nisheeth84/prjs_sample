package com.viettel.aio.business;

import com.viettel.aio.dao.AIORpHrNotSalesDAO;
import com.viettel.aio.dto.report.AIORpHrNotSalesDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import com.viettel.utils.DateTimeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Created by HaiND on 9/28/2019 2:25 AM.
 */
@Service("aioRpHrNotSalesBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIORpHrNotSalesBusinessImpl extends BaseFWBusinessImpl<AIORpHrNotSalesDAO, AIORpHrNotSalesDTO, BaseFWModelImpl> {

    private static final String TEXT_AREA_1 = "KV1";
    private static final String TEXT_AREA_2 = "KV2";
    private static final String TEXT_AREA_3 = "KV3";

    @Autowired
    private AIORpHrNotSalesDAO aioRpHrNotSalesDAO;

    public List<AIORpHrNotSalesDTO> doSearchArea(AIORpHrNotSalesDTO dto) {
        return aioRpHrNotSalesDAO.doSearchArea(dto);
    }

    public List<AIORpHrNotSalesDTO> doSearchGroup(AIORpHrNotSalesDTO dto) {
        return aioRpHrNotSalesDAO.doSearchGroup(dto);
    }

    public DataListDTO doSearch(AIORpHrNotSalesDTO dto) {
        Calendar cal = Calendar.getInstance();
        if (dto.getStartDate() == null) {
            cal.set(Calendar.DAY_OF_MONTH, 1);
            dto.setEndDate(cal.getTime());
        }
        if (dto.getEndDate() == null) {
            dto.setEndDate(new Date());
        }

        LocalDate localDate = dto.getEndDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        int month = localDate.getMonthValue();
        int year = localDate.getYear();

        List<AIORpHrNotSalesDTO> dtoList = aioRpHrNotSalesDAO.doSearch(dto, dto.getStartDate(), dto.getEndDate(), month, year);
        setTotal(dtoList);
        dtoList.forEach(e -> {
            e.setTradeFlg(e.getTradeFlg() == 1 ? e.getTradeFlg() : null);
            e.setServiceFlg(e.getServiceFlg() == 1 ? e.getServiceFlg() : null);
            e.setAllFlg(e.getTradeFlg() != null && e.getTradeFlg() == 1
                    && e.getServiceFlg() != null && e.getServiceFlg() == 1 ? 1 : null);
        });

        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtoList);
        dataListDTO.setTotal(dto.getTotalRecord());
        dataListDTO.setSize(dto.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    private void setTotal(List<AIORpHrNotSalesDTO> dtoList) {
        if (!dtoList.isEmpty()) {
            Long nationwideTradeTotal, area1TradeTotal, area2TradeTotal, area3TradeTotal;
            Long nationwideServiceTotal, area1ServiceTotal, area2ServiceTotal, area3ServiceTotal;
            Long nationwideAllTotal, area1AllTotal, area2AllTotal, area3AllTotal;

            // calculate total for trade
            nationwideTradeTotal = dtoList.stream().filter(dto -> dto.getTradeFlg() == 1)
                    .mapToLong(AIORpHrNotSalesDTO::getTradeFlg).summaryStatistics().getCount();
            area1TradeTotal = dtoList.stream().filter(dto -> dto.getTradeFlg() == 1 && TEXT_AREA_1.equals(dto.getAreaCode()))
                    .mapToLong(AIORpHrNotSalesDTO::getTradeFlg).summaryStatistics().getCount();
            area2TradeTotal = dtoList.stream().filter(dto -> dto.getTradeFlg() == 1 && TEXT_AREA_2.equals(dto.getAreaCode()))
                    .mapToLong(AIORpHrNotSalesDTO::getTradeFlg).summaryStatistics().getCount();
            area3TradeTotal = dtoList.stream().filter(dto -> dto.getTradeFlg() == 1 && TEXT_AREA_3.equals(dto.getAreaCode()))
                    .mapToLong(AIORpHrNotSalesDTO::getTradeFlg).summaryStatistics().getCount();

            // calculate total for service
            nationwideServiceTotal = dtoList.stream().filter(dto -> dto.getServiceFlg() == 1)
                    .mapToLong(AIORpHrNotSalesDTO::getServiceFlg).summaryStatistics().getCount();
            area1ServiceTotal = dtoList.stream().filter(dto -> dto.getServiceFlg() == 1 && TEXT_AREA_1.equals(dto.getAreaCode()))
                    .mapToLong(AIORpHrNotSalesDTO::getServiceFlg).summaryStatistics().getCount();
            area2ServiceTotal = dtoList.stream().filter(dto -> dto.getServiceFlg() == 1 && TEXT_AREA_2.equals(dto.getAreaCode()))
                    .mapToLong(AIORpHrNotSalesDTO::getServiceFlg).summaryStatistics().getCount();
            area3ServiceTotal = dtoList.stream().filter(dto -> dto.getServiceFlg() == 1 && TEXT_AREA_3.equals(dto.getAreaCode()))
                    .mapToLong(AIORpHrNotSalesDTO::getServiceFlg).summaryStatistics().getCount();

            // calculate total for all
            nationwideAllTotal = dtoList.stream().filter(dto -> dto.getTradeFlg() == 1 && dto.getServiceFlg() == 1)
                    .mapToLong(dto -> dto.getTradeFlg() + dto.getServiceFlg()).summaryStatistics().getCount();
            area1AllTotal = dtoList.stream().filter(dto ->
                        dto.getTradeFlg() == 1 && dto.getServiceFlg() == 1 && TEXT_AREA_1.equals(dto.getAreaCode()))
                    .mapToLong(dto -> dto.getTradeFlg() + dto.getServiceFlg()).summaryStatistics().getCount();
            area2AllTotal = dtoList.stream().filter(dto ->
                        dto.getTradeFlg() == 1 && dto.getServiceFlg() == 1 && TEXT_AREA_2.equals(dto.getAreaCode()))
                    .mapToLong(dto -> dto.getTradeFlg() + dto.getServiceFlg()).summaryStatistics().getCount();
            area3AllTotal = dtoList.stream().filter(dto ->
                        dto.getTradeFlg() == 1 && dto.getServiceFlg() == 1 && TEXT_AREA_3.equals(dto.getAreaCode()))
                    .mapToLong(dto -> dto.getTradeFlg() + dto.getServiceFlg()).summaryStatistics().getCount();

            // set total for trade
            AIORpHrNotSalesDTO dtoSetTotal = dtoList.get(0);
            dtoSetTotal.setNationwideTradeTotal(nationwideTradeTotal);
            dtoSetTotal.setArea1TradeTotal(area1TradeTotal);
            dtoSetTotal.setArea2TradeTotal(area2TradeTotal);
            dtoSetTotal.setArea3TradeTotal(area3TradeTotal);

            // set total for service
            dtoSetTotal.setNationwideServiceTotal(nationwideServiceTotal);
            dtoSetTotal.setArea1ServiceTotal(area1ServiceTotal);
            dtoSetTotal.setArea2ServiceTotal(area2ServiceTotal);
            dtoSetTotal.setArea3ServiceTotal(area3ServiceTotal);

            // set total for all
            dtoSetTotal.setNationwideAllTotal(nationwideAllTotal);
            dtoSetTotal.setArea1AllTotal(area1AllTotal);
            dtoSetTotal.setArea2AllTotal(area2AllTotal);
            dtoSetTotal.setArea3AllTotal(area3AllTotal);
        }
    }

    private String getSearchDate(boolean isStartDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DateTimeUtils.DATE_DD_MM_YYYY);
        LocalDate date = LocalDate.now();

        return isStartDate ? date.withDayOfMonth(1).format(formatter) : date.withDayOfMonth(date.lengthOfMonth()).format(formatter);
    }
}
