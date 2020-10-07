package com.viettel.cat.constant;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Constants {
    public static final int DOC_REPORT = 0;
    public static final int PDF_REPORT = 1;
    public static final int EXCEL_REPORT = 2;
    public static final int HTML_REPORT = 3;

    public static class OperationKey {
        public static String CREATE = "CREATE";
        public static String ESTIMATE = "ESTIMATE";
        public static String VALUE = "VALUE";
        public static String VIEW = "VIEW";
        public static String CONFIG = "CONFIG";
        public static String REPORT = "REPORT";
        public static String MAP = "MAP";
        public static String DELETE = "DELETE";
    }

    public static class AdResourceKey {
        public static String STOCK_TRANS = "IE_TRANSACTION";
        public static String CHANGE_ORDER = "CHANGE_ORDER";
        public static String SHIPMENT = "SHIPMENT";
        public static String STOCK = "STOCK";
        public static String CONTRACT = "CONTRACT";
        public static String REMOVE_CONTRACT_OS = "REMOVE_CONTRACT_OS";
    }

    public static final List<String> LISTREPORTNAME = Arrays.asList("baocaokndu", "BaocaoKPISoluong", "BaocaoKPIThoigian", "BaoCaoPhieuXuatKhoDangDiDuong", "baocaotonkho", "baocaoxuatnhap");

    public static final String DASH_BROAD = "DASH_BROAD";


    public static final List<String> LISTREPORTNAMESTOCKNULL = Arrays.asList("BaocaoKPISoluong", "BaocaoKPIThoigian", "BaoCaoPhieuXuatKhoDangDiDuong");

    public interface CONTRACT_STATUS {
        public static final Long DANGTHUCHIEN = 1L;
        public static final Long DANGHIEMTHU = 2L;
        public static final Long DATHANHTOAN = 3L;
        public static final Long DATHANHLY = 4L;
        public static final Long DAHUY = 0L;
    }

    //	hungnx 070618 start
    public interface FILETYPE {
        public static String CONSTRUCTION = "52";

        public static String CONTRACT_CONSTRUCTION_OUT = "61";
        // hoanm1_20180311_start
        public static String CONTRACT_CONSTRUCTION_IN = "67";
        // hoanm1_20180311_end
        public static String CONTRACT_OUT_ACCEPTANCE = "62";
        public static String CONTRACT_OUT_PAYMENT = "63";
        public static String CONTRACT_OUT_LIQUIDATE = "64";
        public static String CONTRACT_OUT_WARRANTY = "65";
        public static String CONTRACT_OUT_BREACH = "66";


        public static String CONTRACT_IN_ACCEPTANCE = "68";
        public static String CONTRACT_IN_PAYMENT = "69";
        public static String CONTRACT_IN_LIQUIDATE = "70";
        public static String CONTRACT_IN_WARRANTY = "71";
        public static String CONTRACT_IN_BREACH = "72";

        public static String CONTRACT_MATERIAL = "73";

        public static String CONTRACT_MATERIAL_ACCEPTANCE = "74";
        public static String CONTRACT_MATERIAL_PAYMENT = "75";
        public static String CONTRACT_MATERIAL_LIQUIDATE = "76";
        public static String CONTRACT_MATERIAL_BREACH = "77";

        //hdtm filetype bat dau tu 78
        public static String CONTRACT_CONSTRUCTION_TM_OUT = "78";

        public static String CONTRACT_CONSTRUCTION_TM_OUT_ACCEPTANCE = "79";
        public static String CONTRACT_CONSTRUCTION_TM_OUT_PAYMENT = "80";
        public static String CONTRACT_CONSTRUCTION_TM_OUT_LIQUIDATE = "81";
        public static String CONTRACT_CONSTRUCTION_TM_OUT_BREACH = "82";


        public static String CONTRACT_CONSTRUCTION_TM_IN = "83";

        public static String CONTRACT_CONSTRUCTION_TM_IN_ACCEPTANCE = "84";
        public static String CONTRACT_CONSTRUCTION_TM_IN_PAYMENT = "85";
        public static String CONTRACT_CONSTRUCTION_TM_IN_LIQUIDATE = "86";
        public static String CONTRACT_CONSTRUCTION_TM_IN_BREACH = "87";
        public static String CONTRACT_FRAME = "88";
        public static String CONTRACT_OUT_APPENDIX = "89";
        public static String PROJECT_CONTRACT = "90";
        public static String PURCHASE_ORDER = "91";
        //		hungtd_20181215_start
        public static String CONTRACT_SV = "92";
//		hungtd_20181215_end
    }

    public static final Map<String, String> FileDescription;

    static {
        FileDescription = new HashMap<String, String>();
        FileDescription.put(FILETYPE.CONSTRUCTION,
                "File đính kèm công trình");
    }
//	hungnx 070618 end

    public interface CONTRACT_TYPE {
        public static Long CONTRACT_CONSTRUCTION_OUT = 0l;
        public static Long CONTRACT_CONSTRUCTION_IN = 1l;
        public static Long CONTRACT_MATERIAL = 2l;
        public static Long CONTRACT_CONSTRUCTION_TM_OUT = 3l;
        public static Long CONTRACT_CONSTRUCTION_TM_IN = 4l;
        public static Long CONTRACT_FRAME = 5l;
        //		public static Long PURCHASE_ORDER = 5l;
        public static Long BIDDING_PACKAGE = 6l;
        public static Long WORK_ITEM_QUOTA = 7l;
        //		public static Long WORK_ITEM_QUOTA_MONEY = 8l;
        public static Long PROJECT_CONTRACT = 9l;
        public static Long PURCHASE_ORDER = 10l;
        public static Long CONSTRUCTION_INFORMATION = 11l;
        public static Long IMPLEMENTATION_PROGRESS=12l;
        public static Long CONTRACT_ACCEPTANCE=13l;
        public static Long CONTRACT_PAYMENT=14l;
        public static Long CONTRACT_LIQUIDATE=15l;
        public static Long CONTRACT_WARRANTY=16l;
        public static Long CONTRACT_BREACH=17l;
        public static Long CONTRACT_APPENDIX=18l;
        public static Long GOODS_INFORMATION=19l;
        public static Long CONTRACT_STORAGE=20l;
        public static Long RP_CONTRACT_PROGRESS=21l;
        public static Long RP_SUM_CONTRACT_OUT=22l;
        //		hungtd_20181215_start
        public static Long CONTRACT_SV = 23l;
//		hungtd_20181215_end
    }

    public interface FUNCTION_CODE {
        public static String INSERT_CONTRACT = "INSERT_CONTRACT";
        public static String UPDATE_CONTRACT = "UPDATE_CONTRACT";
        public static String DELETE_CONTRACT = "DELETE_CONTRACT";
        public static String DOSEARCH_CONTRACT = "DOSEARCH_CONTRACT";
        public static String MAP_CONTRACT = "MAP_CONTRACT";

        public static String INSERT_ORDER = "INSERT_ORDER";
        public static String UPDATE_ORDER = "UPDATE_ORDER";
        public static String DELETE_ORDER = "DELETE_ORDER";
        public static String IMPORT_ORDER = "IMPORT_ORDER";

        public static String INSERT_BIDDING_PACKAGE = "INSERT_BIDDING_PACKAGE";
        public static String UPDATE_BIDDING_PACKAGE = "UPDATE_BIDDING_PACKAGE";
        public static String DELETE_BIDDING_PACKAGE = "DELETE_BIDDING_PACKAGE";
        public static String IMPORT_BIDDING_PACKAGE = "IMPORT_BIDDING_PACKAGE";
        public static String DOSEARCH_BIDDING_PACKAGE = "DOSEARCH_BIDDING_PACKAGE";

        public static String INSERT_WORK_ITEM_QUOTA = "INSERT_WORK_ITEM_QUOTA";
        public static String UPDATE_WORK_ITEM_QUOTA = "UPDATE_WORK_ITEM_QUOTA";
        public static String DELETE_WORK_ITEM_QUOTA = "DELETE_WORK_ITEM_QUOTA";
        public static String IMPORT_WORK_ITEM_QUOTA = "IMPORT_WORK_ITEM_QUOTA";
        public static String DOSEARCH_WORK_ITEM_QUOTA = "DOSEARCH_WORK_ITEM_QUOTA";

        public static String INSERT_WORK_ITEM_QUOTA_MONEY = "INSERT_WORK_ITEM_QUOTA_MONEY";
        public static String UPDATE_WORK_ITEM_QUOTA_MONEY = "UPDATE_WORK_ITEM_QUOTA_MONEY";
        public static String DELETE_WORK_ITEM_QUOTA_MONEY = "DELETE_WORK_ITEM_QUOTA_MONEY";
        public static String IMPORT_WORK_ITEM_QUOTA_MONEY = "IMPORT_WORK_ITEM_QUOTA_MONEY";

        public static String INSERT_PROJECT_CONTRACT = "INSERT_PROJECT_CONTRACT";
        public static String UPDATE_PROJECT_CONTRACT = "UPDATE_PROJECT_CONTRACT";
        public static String DELETE_PROJECT_CONTRACT = "DELETE_PROJECT_CONTRACT";
        public static String DOSEARCH_PROJECT_CONTRACT = "DOSEARCH_PROJECT_CONTRACT";

        public static String INSERT_PURCHASE_ORDER = "INSERT_PURCHASE_ORDER";
        public static String UPDATE_PURCHASE_ORDER = "UPDATE_PURCHASE_ORDER";
        public static String DELETE_PURCHASE_ORDER = "DELETE_PURCHASE_ORDER";
        public static String DOSEARCH_PURCHASE_ORDER = "DOSEARCH_PURCHASE_ORDER";
        public static String IMPORT_PURCHASE_ORDER = "IMPORT_PURCHASE_ORDER";

        public static String INSERT_CONSTRUCTION_INFORMATION = "INSERT_CONSTRUCTION_INFORMATION";
        public static String UPDATE_CONSTRUCTION_INFORMATION = "UPDATE_CONSTRUCTION_INFORMATION";
        public static String DELETE_CONSTRUCTION_INFORMATION = "DELETE_CONSTRUCTION_INFORMATION";
        public static String DOSEARCH_CONSTRUCTION_INFORMATION = "DOSEARCH_CONSTRUCTION_INFORMATION";
        public static String IMPORT_CONSTRUCTION_INFORMATION = "IMPORT_CONSTRUCTION_INFORMATION";
//		public static String EXPORT_CONSTRUCTION_INFORMATION = "EXPORT_CONSTRUCTION_INFORMATION";

        public static String DOSEARCH_GOODS_INFORMATION = "DOSEARCH_GOODS_INFORMATION";

        public static String INSERT_CONTRACT_ACCEPTANCE = "INSERT_CONTRACT_ACCEPTANCE";
        public static String UPDATE_CONTRACT_ACCEPTANCE = "UPDATE_CONTRACT_ACCEPTANCE";
        public static String DELETE_CONTRACT_ACCEPTANCE = "DELETE_CONTRACT_ACCEPTANCE";
        public static String DOSEARCH_CONTRACT_ACCEPTANCE = "DOSEARCH_CONTRACT_ACCEPTANCE";

        public static String INSERT_CONTRACT_PAYMENT = "INSERT_CONTRACT_PAYMENT";
        public static String UPDATE_CONTRACT_PAYMENT = "UPDATE_CONTRACT_PAYMENT";
        public static String DELETE_CONTRACT_PAYMENT = "DELETE_CONTRACT_PAYMENT";
        public static String DOSEARCH_CONTRACT_PAYMENT = "DOSEARCH_CONTRACT_PAYMENT";

        public static String INSERT_CONTRACT_LIQUIDATE = "INSERT_CONTRACT_LIQUIDATE";
        public static String UPDATE_CONTRACT_LIQUIDATE = "UPDATE_CONTRACT_LIQUIDATE";
        public static String DELETE_CONTRACT_LIQUIDATE = "DELETE_CONTRACT_LIQUIDATE";
        public static String DOSEARCH_CONTRACT_LIQUIDATE = "DOSEARCH_CONTRACT_LIQUIDATE";

        public static String INSERT_CONTRACT_WARRANTY = "INSERT_CONTRACT_WARRANTY";
        public static String UPDATE_CONTRACT_WARRANTY = "UPDATE_CONTRACT_WARRANTY";
        public static String DELETE_CONTRACT_WARRANTY = "DELETE_CONTRACT_WARRANTY";
        public static String DOSEARCH_CONTRACT_WARRANTY = "DOSEARCH_CONTRACT_WARRANTY";

        public static String INSERT_CONTRACT_BREACH = "INSERT_CONTRACT_BREACH";
        public static String UPDATE_CONTRACT_BREACH = "UPDATE_CONTRACT_BREACH";
        public static String DELETE_CONTRACT_BREACH = "DELETE_CONTRACT_BREACH";
        public static String DOSEARCH_CONTRACT_BREACH = "DOSEARCH_CONTRACT_BREACH";

        public static String INSERT_CONTRACT_APPENDIX = "INSERT_CONTRACT_APPENDIX";
        public static String UPDATE_CONTRACT_APPENDIX = "UPDATE_CONTRACT_APPENDIX";
        public static String DELETE_CONTRACT_APPENDIX = "DELETE_CONTRACT_APPENDIX";
        public static String DOSEARCH_CONTRACT_APPENDIX = "DOSEARCH_CONTRACT_APPENDIX";

        public static String DOSEARCH_IMPLEMENTATION_PROGRESS = "DOSEARCH_IMPLEMENTATION_PROGRESS";

        public static String INSERT_CONTRACT_STORAGE = "INSERT_CONTRACT_STORAGE";
        public static String UPDATE_CONTRACT_STORAGE = "UPDATE_CONTRACT_STORAGE";
        public static String DELETE_CONTRACT_STORAGE = "DELETE_CONTRACT_STORAGE";
        public static String DOSEARCH_CONTRACT_STORAGE = "DOSEARCH_CONTRACT_STORAGE";
        public static String EXPORT_CONTRACT_STORAGE = "EXPORT_CONTRACT_STORAGE";

        public static String DOSEARCH_RP_CONTRACT_PROGRESS = "DOSEARCH_RP_CONTRACT_PROGRESS";
        public static String EXPORT_RP_CONTRACT_PROGRESS = "EXPORT_RP_CONTRACT_PROGRESS";

        public static String DOSEARCH_RP_SUM_CONTRACT_OUT = "DOSEARCH_RP_SUM_CONTRACT_OUT";
        public static String EXPORT_RP_SUM_CONTRACT_OUT = "EXPORT_RP_SUM_CONTRACT_OUT";
    }

    public static final Map<String, String> CONTRACT_TYPE_MAP;
    static {
        CONTRACT_TYPE_MAP = new HashMap<String, String>();
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.CONTRACT_CONSTRUCTION_OUT.toString(), "Hợp đồng xây lắp đầu ra");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.CONTRACT_CONSTRUCTION_IN.toString(), "Hợp đồng xây lắp đầu vào");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_OUT.toString(), "Hợp đồng thương mại đầu ra");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.CONTRACT_CONSTRUCTION_TM_IN.toString(), "Hợp đồng thương mại đầu vào");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.CONTRACT_MATERIAL.toString(), "Hợp đồng vật tư");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.CONTRACT_FRAME.toString(), "Hợp đồng khung");
//		CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.PURCHASE_ORDER.toString(), "Danh sách đơn hàng");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.BIDDING_PACKAGE.toString(), "Quản lý gói thầu");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.WORK_ITEM_QUOTA.toString(), "Quản lý định mức hạng mục");
//		CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.WORK_ITEM_QUOTA_MONEY.toString(), "Quản lý dòng tiền");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.PROJECT_CONTRACT.toString(), "Quản lý dự án");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.PURCHASE_ORDER.toString(), "Danh sách đơn hàng");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.CONSTRUCTION_INFORMATION.toString(), "Thông tin công trình");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.IMPLEMENTATION_PROGRESS.toString(), "Tiến độ thực hiện");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.CONTRACT_ACCEPTANCE.toString(), "Nghiệm thu hợp đồng");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.CONTRACT_PAYMENT.toString(), "Thanh toán hợp đồng");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.CONTRACT_LIQUIDATE.toString(), "Thanh lý hợp đồng");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.CONTRACT_WARRANTY.toString(), "Bảo hành hợp đồng");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.CONTRACT_BREACH.toString(), "Điều khoản phạt vi phạm HĐ");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.CONTRACT_APPENDIX.toString(), "Phụ lục hợp đồng");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.GOODS_INFORMATION.toString(), "Thông tin hàng hoá");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.CONTRACT_STORAGE.toString(), "Quản lý hồ sơ lưu trữ hợp đồng");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.RP_CONTRACT_PROGRESS.toString(), "Báo cáo tiến độ hợp đồng");
        CONTRACT_TYPE_MAP.put(CONTRACT_TYPE.RP_SUM_CONTRACT_OUT.toString(), "Báo cáo tổng hợp HDXL đầu ra");

    }

}

