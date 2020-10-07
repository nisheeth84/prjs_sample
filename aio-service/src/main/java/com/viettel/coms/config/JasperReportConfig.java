package com.viettel.coms.config;

import net.sf.jasperreports.engine.design.JRDesignStyle;

public class JasperReportConfig {
    private JasperReportConfig config;

    public JasperReportConfig getInstance() {
        config = new JasperReportConfig();
        return config;
    }

    public static JRDesignStyle getNormalStyle(String pathFont) {
        JRDesignStyle normalStyle = new JRDesignStyle();
        normalStyle.setName("times");
        normalStyle.setDefault(true);
        normalStyle.setFontName(pathFont + "TIMES.TTF");
        normalStyle.setPdfFontName(pathFont + "TIMES.TTF");
        normalStyle.setPdfEncoding("Identity-H");
        normalStyle.setPdfEmbedded(true);
        normalStyle.setMarkup("html");
        normalStyle.setBlankWhenNull(true);
        return normalStyle;
    }
}
