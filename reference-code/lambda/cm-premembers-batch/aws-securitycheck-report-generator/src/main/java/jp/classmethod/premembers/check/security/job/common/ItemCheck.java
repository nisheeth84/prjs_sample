package jp.classmethod.premembers.check.security.job.common;

import java.util.HashMap;

import jp.classmethod.premembers.check.security.constant.CodeCheckItemConst;
import jp.classmethod.premembers.check.security.job.dto.SecurityCheckItemDetailsDto;

/**
 * @author HungGK
 */
public class ItemCheck {

    public static final HashMap<String, SecurityCheckItemDetailsDto> lsItemCheck = createItemCheckMap();

    private static HashMap<String, SecurityCheckItemDetailsDto> createItemCheckMap(){
        HashMap<String, SecurityCheckItemDetailsDto> lsItemCheck = new HashMap<String, SecurityCheckItemDetailsDto>();

        //CIS 1. Identity and Access Management
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_01, "1.1", "check_cis12_item_1_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_02, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_02, "1.2", "check_cis12_item_1_02", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_03, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_03, "1.3", "check_cis12_item_1_03", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_04, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_04, "1.4", "check_cis12_item_1_04", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_05, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_05, "1.5", "check_cis12_item_1_05", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_06, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_06, "1.6", "check_cis12_item_1_06", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_07, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_07, "1.7", "check_cis12_item_1_07", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_08, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_08, "1.8", "check_cis12_item_1_08", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_09, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_09, "1.9", "check_cis12_item_1_09", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_10, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_10, "1.10", "check_cis12_item_1_10", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_11, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_11, "1.11", "check_cis12_item_1_11", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_12, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_12, "1.12", "check_cis12_item_1_12", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_13, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_13, "1.13", "check_cis12_item_1_13", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_14, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_14, "1.14", "check_cis12_item_1_14", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_15, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_15, "1.15", "check_cis12_item_1_15", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_16, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_16, "1.16", "check_cis12_item_1_16", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_17, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_17, "1.17", "check_cis12_item_1_17", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_18, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_18, "1.18", "check_cis12_item_1_18", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_19, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_19, "1.19", "check_cis12_item_1_19", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_20, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_20, "1.20", "check_cis12_item_1_20", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_21, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_21, "1.21", "check_cis12_item_1_21", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_22, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_1_22, "1.22", "check_cis12_item_1_22", false));

        //CIS 2. Logging
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_01, "2.1", "check_cis12_item_2_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_02, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_02, "2.2", "check_cis12_item_2_02", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_03, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_03, "2.3", "check_cis12_item_2_03", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_04, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_04, "2.4", "check_cis12_item_2_04", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_05, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_05, "2.5", "check_cis12_item_2_05", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_06, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_06, "2.6", "check_cis12_item_2_06", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_07, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_07, "2.7", "check_cis12_item_2_07", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_08, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_08, "2.8", "check_cis12_item_2_08", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_09, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_2_09, "2.9", "check_cis12_item_2_09", false));

        //CIS 3. Monitoring
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_01, "3.1", "check_cis12_item_3_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_02, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_02, "3.2", "check_cis12_item_3_02",false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_03, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_03, "3.3", "check_cis12_item_3_03", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_04, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_04, "3.4", "check_cis12_item_3_04", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_05, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_05, "3.5", "check_cis12_item_3_05", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_06, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_06, "3.6", "check_cis12_item_3_06", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_07, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_07, "3.7", "check_cis12_item_3_07", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_08, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_08, "3.8", "check_cis12_item_3_08", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_09, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_09, "3.9", "check_cis12_item_3_09", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_10, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_10, "3.10", "check_cis12_item_3_10", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_11, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_11, "3.11", "check_cis12_item_3_11", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_12, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_12, "3.12", "check_cis12_item_3_12", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_13, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_13, "3.13", "check_cis12_item_3_13", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_14, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_3_14, "3.14", "check_cis12_item_3_14", false));

        //CIS 4. Networking
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_4_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_4_01, "4.1", "check_cis12_item_4_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_4_02, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_4_02, "4.2", "check_cis12_item_4_02", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_4_03, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_4_03, "4.3", "check_cis12_item_4_03", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_4_04, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_CIS12_ITEM_4_04, "4.4", "check_cis12_item_4_04", false));

        //ASC Security Checklist - General
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_01_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_01_01, "01", "check_asc_item_01_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_02_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_02_01, "02-01", "check_asc_item_02_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_02_02, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_02_02, "02-02", "check_asc_item_02_02", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_03_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_03_01, "03", "check_asc_item_03_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_04_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_04_01, "04", "check_asc_item_04_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_05_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_05_01, "05", "check_asc_item_05_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_06_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_06_01, "06", "check_asc_item_06_01", false));

        //ASC Security Checklist - EC2/VPC/EBS
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_07_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_07_01, "07", "check_asc_item_07_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_08_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_08_01, "08", "check_asc_item_08_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_09_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_09_01, "09", "check_asc_item_09_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_10_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_10_01, "10", "check_asc_item_10_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_11_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_11_01, "11", "check_asc_item_11_01", false));

        //ASC Security Checklist - S3
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_12_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_12_01, "12", "check_asc_item_12_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_13_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_13_01, "13", "check_asc_item_13_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_14_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_14_01, "14", "check_asc_item_14_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_15_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_15_01, "15", "check_asc_item_15_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_16_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_ASC_ITEM_16_01, "16", "check_asc_item_16_01", false));

        //IBP Security Checklist
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_01_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_01_01, "01", "check_ibp_item_01_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_02_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_02_01, "02", "check_ibp_item_02_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_03_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_03_01, "03", "check_ibp_item_03_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_04_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_04_01, "04", "check_ibp_item_04_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_05_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_05_01, "05", "check_ibp_item_05_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_06_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_06_01, "06", "check_ibp_item_06_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07, "07", "check_ibp_item_07", true));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_01, "07-01", "check_ibp_item_07_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_02, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_02, "07-02", "check_ibp_item_07_02", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_03, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_03, "07-03", "check_ibp_item_07_03", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_04, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_04, "07-04", "check_ibp_item_07_04", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_05, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_05, "07-05", "check_ibp_item_07_05", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_06, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_06, "07-06", "check_ibp_item_07_06", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_07, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_07, "07-07", "check_ibp_item_07_07", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_08, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_07_08, "07-08", "check_ibp_item_07_08", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_08_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_08_01, "08", "check_ibp_item_08_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_09_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_09_01, "09", "check_ibp_item_09_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_10_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_10_01, "10", "check_ibp_item_10_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_11_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_11_01, "11", "check_ibp_item_11_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_12_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_12_01, "12", "check_ibp_item_12_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_13_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_13_01, "13", "check_ibp_item_13_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14, "14", "check_ibp_item_14", true));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14_01, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14_01, "14-01", "check_ibp_item_14_01", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14_02, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14_02, "14-02", "check_ibp_item_14_02", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14_03, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14_03, "14-03", "check_ibp_item_14_03", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14_04, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14_04, "14-04", "check_ibp_item_14_04", false));
        lsItemCheck.put(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14_05, new SecurityCheckItemDetailsDto(CodeCheckItemConst.CODE_CHECK_IBP_ITEM_14_05, "14-05", "check_ibp_item_14_05", false));

        return lsItemCheck;
    }
}
