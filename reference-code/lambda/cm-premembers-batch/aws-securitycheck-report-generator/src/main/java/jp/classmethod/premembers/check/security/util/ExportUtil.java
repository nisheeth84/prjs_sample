package jp.classmethod.premembers.check.security.util;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jp.classmethod.premembers.check.security.config.JobConfig;
import jp.classmethod.premembers.check.security.constant.ComConst;
import jp.classmethod.premembers.check.security.exception.PremembersApplicationException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

public class ExportUtil {
    private final static Logger LOGGER = LoggerFactory.getLogger(ExportUtil.class);

    /**
     * Export report from jasper file to pdf and save to disk
     *
     * @author TuanDV
     * @param parameterValues
     *            Parameter values
     * @param jasperFileName
     *            Jasper report file name
     * @param ds
     *            Datasource to export
     * @param fileName
     *            path of file
     */
    public static void exportReportToPdfFile(JobConfig config, Map<String, Object> parameterValues,
            String jasperFileName, JRBeanCollectionDataSource ds, String fileName) {
        try {
            JasperPrint jasperPrint = JasperFillManager.fillReport(
                    config.getTemporaryDirectory() + ComConst.JASPER_PATH + jasperFileName, parameterValues, ds);
            JasperExportManager.exportReportToPdfFile(jasperPrint, fileName);
        } catch (Exception e) {
            LOGGER.error(PremembersUtil.getStackTrace(e));
            throw new PremembersApplicationException(ComConst.ERROR_CODE, "レポートファイルの作成に失敗しました。");
        }
    }
}