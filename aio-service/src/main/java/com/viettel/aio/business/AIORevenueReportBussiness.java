package com.viettel.aio.business;

import com.viettel.aio.dto.AIORevenueDailyDTO;
import com.viettel.aio.dto.AIORevenueReportDTO;
import com.viettel.aio.dto.AIORevenueReportSearchDTO;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Date;
import java.util.List;

public interface AIORevenueReportBussiness {
    List<AIORevenueReportDTO> revenueByArea(AIORevenueReportSearchDTO obj);

    List<AIORevenueReportDTO> revenueByGroup(AIORevenueReportSearchDTO obj);

    List<AIORevenueReportDTO> revenueByProvince(AIORevenueReportSearchDTO obj);

    List<AIORevenueReportDTO> revenueByStaff(AIORevenueReportSearchDTO obj);

    List<AIORevenueDailyDTO> revenueDaily(AIORevenueReportSearchDTO obj);

    List<AIORevenueReportSearchDTO> searchAreas(AIORevenueReportSearchDTO obj);

    String exportRevenue(AIORevenueReportSearchDTO obj) throws Exception;
}
