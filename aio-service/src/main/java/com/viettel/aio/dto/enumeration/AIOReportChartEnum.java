package com.viettel.aio.dto.enumeration;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by HaiND on 9/20/2019 11:06 PM.
 */
public enum AIOReportChartEnum {
    PROGRESS_DAY("progress_day"), // Biểu đồ tiến độ theo ngày
    CUMULATIVE_REVENUE("cumulative_revenue"), // Biểu đồ doanh thuy luỹ kế tháng
    CUMULATIVE_REVENUE_INDUSTRY("cumulative_revenue_industry"), // Biểu đồ doanh thu luỹ kế theo nhóm hàng
    DEPLOYMENT("deployment"), // Biểu đồ triển khai
    REVENUE_PROPORTION("revenue_proportion"), // Biểu đồ tỷ trọng doanh thu dịch vụ
    CUSTOMER_REUSE("customer_reuse"), // Biểu đồ khách hàng sử dụng dịch vụ lặp
    TOP_THREE_CITIES("top_three_cities"), // Biểu đồ 3 tỉnh tốt 3 tỉnh tồi doanh thu
    TOP_THREE_GROUPS("top_three_groups");// Biểu đồ 3 cụm tốt 3 cụm tồi doanh thu
    private String name;

    public String getName() {
        return name;
    }

    AIOReportChartEnum(String name) {
        this.name = name;
    }

    private static final Map<String, AIOReportChartEnum> lookup = new HashMap<>();

    static {
        for (AIOReportChartEnum e : AIOReportChartEnum.values()) {
            lookup.put(e.getName(), e);
        }
    }

    public static AIOReportChartEnum get(String name) {
        return lookup.get(name);
    }
}
