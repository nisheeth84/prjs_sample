-- services_info
UPDATE "services_info" SET "service_name" = '{"ja_jp": "スケジュール", "en_us": "Schedule", "zh_cn": "时间表"}' WHERE "service_id" = 2;
UPDATE "services_info" SET "service_name" = '{"ja_jp": "タイムライン", "en_us": "Timeline", "zh_cn": "时间线"}' WHERE "service_id" = 3;
UPDATE "services_info" SET "service_name" = '{"ja_jp": "名刺", "en_us": "Businesscard", "zh_cn": "名片"}' WHERE "service_id" = 4;
UPDATE "services_info" SET "service_name" = '{"ja_jp": "顧客", "en_us": "Customer", "zh_cn": "客户"}' WHERE "service_id" = 5;
UPDATE "services_info" SET "service_name" = '{"ja_jp": "活動", "en_us": "Activity", "zh_cn": "活动"}' WHERE "service_id" = 6;
UPDATE "services_info" SET "service_name" = '{"ja_jp": "社員", "en_us": "Employee", "zh_cn": "员工"}' WHERE "service_id" = 8;
UPDATE "services_info" SET "service_name" = '{"ja_jp": "分析", "en_us": "Analysis", "zh_cn": "分析"}' WHERE "service_id" = 10;
UPDATE "services_info" SET "service_name" = '{"ja_jp": "商品", "en_us": "Product", "zh_cn": "产品"}' WHERE "service_id" = 14;
UPDATE "services_info" SET "service_name" = '{"ja_jp": "タスク", "en_us": "Task", "zh_cn": "任务"}' WHERE "service_id" = 15;
UPDATE "services_info" SET "service_name" = '{"ja_jp": "取引商品管理", "en_us": "Trading Product", "zh_cn": "交易产品管理"}' WHERE "service_id" = 16;

-- field_info
UPDATE "field_info" SET "field_label" = '{"en_us": "Type", "ja_jp": "種別", "zh_cn": "类型"}' WHERE "field_id" = 1;
UPDATE "field_info" SET "field_label" = '{"en_us": "Subject", "ja_jp": "件名", "zh_cn": "项目名称"}' WHERE "field_id" = 2;
UPDATE "field_info" SET "field_label" = '{"en_us": "Start date", "ja_jp": "開始日", "zh_cn": "开始日期"}' WHERE "field_id" = 3;
UPDATE "field_info" SET "field_label" = '{"en_us": "Completion Date (Estimated)", "ja_jp": "完了予定日", "zh_cn": "预计完成日期"}' WHERE "field_id" = 4;
UPDATE "field_info" SET "field_label" = '{"en_us": "Customer", "ja_jp": "顧客", "zh_cn": "客户"}' WHERE "field_id" = 5;
UPDATE "field_info" SET "field_label" = '{"en_us": "Related Customers", "ja_jp": "関連顧客", "zh_cn": "相关客户"}' WHERE "field_id" = 6;
UPDATE "field_info" SET "field_label" = '{"en_us": "Address", "ja_jp": "住所", "zh_cn": "地址"}' WHERE "field_id" = 7;
UPDATE "field_info" SET "field_label" = '{"en_us": "Outside participants", "ja_jp": "社外参加者", "zh_cn": "外部参加者"}' WHERE "field_id" = 8;
UPDATE "field_info" SET "field_label" = '{"en_us": "Participants", "ja_jp": "参加者", "zh_cn": "参加者"}' WHERE "field_id" = 9;
UPDATE "field_info" SET "field_label" = '{"en_us": "Collaborator", "ja_jp": "共有者", "zh_cn": "共享者"}' WHERE "field_id" = 10;
UPDATE "field_info" SET "field_label" = '{"en_us": "Meeting rooms and equipment", "ja_jp": "会議室・設備", "zh_cn": "会议室/设备"}' WHERE "field_id" = 11;
UPDATE "field_info" SET "field_label" = '{"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}' WHERE "field_id" = 12;
UPDATE "field_info" SET "field_label" = '{"en_us": "Attach file", "ja_jp": "添付ファイル", "zh_cn": "附件文件"}' WHERE "field_id" = 13;
UPDATE "field_info" SET "field_label" = '{"en_us": "Task", "ja_jp": "タスク", "zh_cn": "任务"}' WHERE "field_id" = 14;
UPDATE "field_info" SET "field_label" = '{"en_us": "Milestone", "ja_jp": "マイルストーン", "zh_cn": "里程碑"}' WHERE "field_id" = 15;
UPDATE "field_info" SET "field_label" = '{"en_us": "Privacy Setting", "ja_jp": "公開設定", "zh_cn": "公开设置"}' WHERE "field_id" = 16;
UPDATE "field_info" SET "field_label" = '{"en_us": "Modification Setting", "ja_jp": "編集・公開設定", "zh_cn": "编辑/公开设置"}' WHERE "field_id" = 17;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registration Date", "ja_jp": "登録日", "zh_cn": "注册日期"}' WHERE "field_id" = 18;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}' WHERE "field_id" = 19;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}' WHERE "field_id" = 20;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最终更新者"}' WHERE "field_id" = 21;
UPDATE "field_info" SET "field_label" = '{"en_us": "Businesscard Code", "ja_jp": "名刺コード", "zh_cn": "名片代码"}' WHERE "field_id" = 22;
UPDATE "field_info" SET "field_label" = '{"en_us": "Businesscard Image", "ja_jp": "名刺画像", "zh_cn": "名片图片"}' WHERE "field_id" = 23;
UPDATE "field_info" SET "field_label" = '{"en_us": "Customer Name", "ja_jp": "顧客名", "zh_cn": "客户姓名"}' WHERE "field_id" = 24;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last Name", "ja_jp": "名前（姓）", "zh_cn": "名称（姓）"}' WHERE "field_id" = 25;
UPDATE "field_info" SET "field_label" = '{"en_us": "First Name", "ja_jp": "名前（名）", "zh_cn": "名称（名）"}' WHERE "field_id" = 26;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last Name (Kana)", "ja_jp": "名前（かな）（姓）", "zh_cn": "名称（假名）（姓）"}' WHERE "field_id" = 27;
UPDATE "field_info" SET "field_label" = '{"en_us": "First Name (Kana)", "ja_jp": "名前（かな）（名）", "zh_cn": "名称（假名）（名）"}' WHERE "field_id" = 28;
UPDATE "field_info" SET "field_label" = '{"en_us": "Position", "ja_jp": "役職名", "zh_cn": "职务名称"}' WHERE "field_id" = 29;
UPDATE "field_info" SET "field_label" = '{"en_us": "Department Name", "ja_jp": "部署名", "zh_cn": "部门名称"}' WHERE "field_id" = 30;
UPDATE "field_info" SET "field_label" = '{"en_us": "Address", "ja_jp": "住所", "zh_cn": "地址"}' WHERE "field_id" = 32;
UPDATE "field_info" SET "field_label" = '{"en_us": "Email Address", "ja_jp": "メールアドレス", "zh_cn": "电子邮件地址"}' WHERE "field_id" = 35;
UPDATE "field_info" SET "field_label" = '{"en_us": "Phone number", "ja_jp": "電話番号", "zh_cn": "电话号码"}' WHERE "field_id" = 36;
UPDATE "field_info" SET "field_label" = '{"en_us": "Mobile Number", "ja_jp": "携帯番号", "zh_cn": "手机号码"}' WHERE "field_id" = 37;
UPDATE "field_info" SET "field_label" = '{"en_us": "Recipient", "ja_jp": "受取人", "zh_cn": "接收者"}' WHERE "field_id" = 39;
UPDATE "field_info" SET "field_label" = '{"en_us": "Received date", "ja_jp": "受取日", "zh_cn": "接收日期"}' WHERE "field_id" = 40;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last contacted date", "ja_jp": "最終接触日", "zh_cn": "最后接触日期"}' WHERE "field_id" = 41;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last contacted date", "ja_jp": "最終接触日", "zh_cn": "最后接触日期"}' WHERE "field_id" = 42;
UPDATE "field_info" SET "field_label" = '{"en_us": "Employment Status", "ja_jp": "在職フラグ", "zh_cn": "工作旗"}' WHERE "field_id" = 43;
UPDATE "field_info" SET "field_label" = '{"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}' WHERE "field_id" = 45;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registration Date", "ja_jp": "登録日", "zh_cn": "注册日期"}' WHERE "field_id" = 46;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}' WHERE "field_id" = 47;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}' WHERE "field_id" = 48;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最终更新者"}' WHERE "field_id" = 49;
UPDATE "field_info" SET "field_label" = '{"en_us": "Customer Code", "ja_jp": "顧客コード", "zh_cn": "客户代码"}' WHERE "field_id" = 50;
UPDATE "field_info" SET "field_label" = '{"en_us": "Parent Customer", "ja_jp": "親顧客", "zh_cn": "父客户"}' WHERE "field_id" = 51;
UPDATE "field_info" SET "field_label" = '{"en_us": "Customer Name", "ja_jp": "顧客名", "zh_cn": "客户姓名"}' WHERE "field_id" = 52;
UPDATE "field_info" SET "field_label" = '{"en_us": "Tel", "ja_jp": "電話番号", "zh_cn": "电话号码"}' WHERE "field_id" = 53;
UPDATE "field_info" SET "field_label" = '{"en_us": "Address", "ja_jp": "住所", "zh_cn": "地址"}' WHERE "field_id" = 54;
UPDATE "field_info" SET "field_label" = '{"en_us": "Industry", "ja_jp": "業種（大分類）", "zh_cn": "行业类型"}' WHERE "field_id" = 55;
UPDATE "field_info" SET "field_label" = '{"en_us": "", "ja_jp": "業種（小分類）", "zh_cn": ""}' WHERE "field_id" = 56;
UPDATE "field_info" SET "field_label" = '{"en_us": "URL", "ja_jp": "URL", "zh_cn": "URL"}' WHERE "field_id" = 57;
UPDATE "field_info" SET "field_label" = '{"en_us": "Person In Charge", "ja_jp": "担当", "zh_cn": "负责"}' WHERE "field_id" = 58;
UPDATE "field_info" SET "field_label" = '{"en_us": "Scenarios", "ja_jp": "シナリオ", "zh_cn": "场景"}' WHERE "field_id" = 61;
UPDATE "field_info" SET "field_label" = '{"en_us": "Next Schedule", "ja_jp": "次回スケジュール", "zh_cn": "下一个时间表"}' WHERE "field_id" = 62;
UPDATE "field_info" SET "field_label" = '{"en_us": "Next Action", "ja_jp": "ネクストアクション", "zh_cn": "下一步行动"}' WHERE "field_id" = 63;
UPDATE "field_info" SET "field_label" = '{"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}' WHERE "field_id" = 64;
UPDATE "field_info" SET "field_label" = '{"en_us": "Customer Logo", "ja_jp": "顧客ロゴ", "zh_cn": "客户标识"}' WHERE "field_id" = 65;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registration Date", "ja_jp": "登録日", "zh_cn": "注册日期"}' WHERE "field_id" = 66;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}' WHERE "field_id" = 67;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}' WHERE "field_id" = 68;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最终更新者"}' WHERE "field_id" = 69;
UPDATE "field_info" SET "field_label" = '{"en_us": "Customer Alias", "ja_jp": "顧客名(呼称)", "zh_cn": "客户姓名(别称)"}' WHERE "field_id" = 70;
UPDATE "field_info" SET "field_label" = '{"en_us": "Show child customers in search results", "ja_jp": "子顧客を検索結果に表示する", "zh_cn": "在搜索结果中显示子客户"}' WHERE "field_id" = 71;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last contacted date", "ja_jp": "最終接触日", "zh_cn": "最后接触日期"}' WHERE "field_id" = 72;
UPDATE "field_info" SET "field_label" = '{"en_us": "Contact Date", "ja_jp": "接触日", "zh_cn": "接触日期"}' WHERE "field_id" = 83;
UPDATE "field_info" SET "field_label" = '{"en_us": "Report Format", "ja_jp": "報告フォーマット", "zh_cn": "报告格式"}' WHERE "field_id" = 84;
UPDATE "field_info" SET "field_label" = '{"en_us": "Activity Duration", "ja_jp": "活動時間", "zh_cn": "活动时间"}' WHERE "field_id" = 85;
UPDATE "field_info" SET "field_label" = '{"en_us": "Reporter", "ja_jp": "報告者", "zh_cn": "报告者"}' WHERE "field_id" = 86;
UPDATE "field_info" SET "field_label" = '{"en_us": "Discussed Person", "ja_jp": "当日面談者", "zh_cn": "当日面谈者"}' WHERE "field_id" = 87;
UPDATE "field_info" SET "field_label" = '{"en_us": "Customer Name", "ja_jp": "顧客名", "zh_cn": "客户姓名"}' WHERE "field_id" = 88;
UPDATE "field_info" SET "field_label" = '{"en_us": "Related Customers", "ja_jp": "関係顧客", "zh_cn": "相关客户"}' WHERE "field_id" = 89;
UPDATE "field_info" SET "field_label" = '{"en_us": "Next Schedule", "ja_jp": "次回スケジュール", "zh_cn": "下一个时间表"}' WHERE "field_id" = 90;
UPDATE "field_info" SET "field_label" = '{"en_us": "Select Report", "ja_jp": "報告対象を選択", "zh_cn": "选择报告对象"}' WHERE "field_id" = 92;
UPDATE "field_info" SET "field_label" = '{"en_us": "Trading Product", "ja_jp": "取引商品", "zh_cn": "交易产品"}' WHERE "field_id" = 94;
UPDATE "field_info" SET "field_label" = '{"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}' WHERE "field_id" = 95;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registration Date", "ja_jp": "登録日", "zh_cn": "注册日期"}' WHERE "field_id" = 96;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}' WHERE "field_id" = 97;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}' WHERE "field_id" = 98;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最终更新者"}' WHERE "field_id" = 99;
UPDATE "field_info" SET "field_label" = '{"en_us": "Employee Icon", "ja_jp": "社員アイコン", "zh_cn": "员工图标"}' WHERE "field_id" = 100;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last Name", "ja_jp": "名前（姓）", "zh_cn": "名称（姓）"}' WHERE "field_id" = 101;
UPDATE "field_info" SET "field_label" = '{"en_us": "First Name", "ja_jp": "名前（名）", "zh_cn": "名称（名）"}' WHERE "field_id" = 102;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last Name (Kana)", "ja_jp": "名前（かな）（姓）", "zh_cn": "名称（假名）（姓）"}' WHERE "field_id" = 103;
UPDATE "field_info" SET "field_label" = '{"en_us": "First Name (Kana)", "ja_jp": "名前（かな）（名）", "zh_cn": "名称（假名）（名）"}' WHERE "field_id" = 104;
UPDATE "field_info" SET "field_label" = '{"en_us": "Department Name", "ja_jp": "部署名", "zh_cn": "部门名称"}' WHERE "field_id" = 105;
UPDATE "field_info" SET "field_label" = '{"en_us": "Position", "ja_jp": "役職名", "zh_cn": "职务名称"}' WHERE "field_id" = 106;
UPDATE "field_info" SET "field_label" = '{"en_us": "Email Address", "ja_jp": "メールアドレス", "zh_cn": "电子邮件地址"}' WHERE "field_id" = 107;
UPDATE "field_info" SET "field_label" = '{"en_us": "Tel", "ja_jp": "電話番号", "zh_cn": "电话号码"}' WHERE "field_id" = 108;
UPDATE "field_info" SET "field_label" = '{"en_us": "Mobile Number", "ja_jp": "携帯番号", "zh_cn": "手机号码"}' WHERE "field_id" = 109;
UPDATE "field_info" SET "field_label" = '{"en_us": "Manager", "ja_jp": "マネージャー", "zh_cn": "上级"}' WHERE "field_id" = 110;
UPDATE "field_info" SET "field_label" = '{"en_us": "Staff", "ja_jp": "部下", "zh_cn": "下属"}' WHERE "field_id" = 111;
UPDATE "field_info" SET "field_label" = '{"en_us": "Package", "ja_jp": "パッケージ", "zh_cn": "包"}' WHERE "field_id" = 113;
UPDATE "field_info" SET "field_label" = '{"en_us": "Language", "ja_jp": "言語", "zh_cn": "语言"}' WHERE "field_id" = 115;
UPDATE "field_info" SET "field_label" = '{"en_us": "Timezone", "ja_jp": "タイムゾーン", "zh_cn": "时区"}' WHERE "field_id" = 116;
UPDATE "field_info" SET "field_label" = '{"en_us": "Product Code", "ja_jp": "商品コード", "zh_cn": "产品代码"}' WHERE "field_id" = 117;
UPDATE "field_info" SET "field_label" = '{"en_us": "Product Image", "ja_jp": "商品画像", "zh_cn": "产品图像"}' WHERE "field_id" = 118;
UPDATE "field_info" SET "field_label" = '{"en_us": "Product Name", "ja_jp": "商品名", "zh_cn": "产品名称"}' WHERE "field_id" = 119;
UPDATE "field_info" SET "field_label" = '{"en_us": "Price", "ja_jp": "単価", "zh_cn": "单价"}' WHERE "field_id" = 120;
UPDATE "field_info" SET "field_label" = '{"en_us": "Category Name", "ja_jp": "カテゴリ名", "zh_cn": "类别名称"}' WHERE "field_id" = 121;
UPDATE "field_info" SET "field_label" = '{"en_us": "Product type", "ja_jp": "商品タイプ", "zh_cn": "产品类型"}' WHERE "field_id" = 122;
UPDATE "field_info" SET "field_label" = '{"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}' WHERE "field_id" = 123;
UPDATE "field_info" SET "field_label" = '{"en_us": "Usage Status", "ja_jp": "使用フラグ", "zh_cn": "使用旗"}' WHERE "field_id" = 124;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registration Date", "ja_jp": "登録日", "zh_cn": "注册日期"}' WHERE "field_id" = 125;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}' WHERE "field_id" = 126;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}' WHERE "field_id" = 127;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最终更新者"}' WHERE "field_id" = 128;
UPDATE "field_info" SET "field_label" = '{"en_us": "Product Cart", "ja_jp": "商品内訳", "zh_cn": "产品细目"}' WHERE "field_id" = 129;
UPDATE "field_info" SET "field_label" = '{"en_us": "Quantity", "ja_jp": "数量", "zh_cn": "数量"}' WHERE "field_id" = 130;
UPDATE "field_info" SET "field_label" = '{"en_us": "Amount", "ja_jp": "金額", "zh_cn": "金额"}' WHERE "field_id" = 131;
UPDATE "field_info" SET "field_label" = '{"en_us": "Task Name", "ja_jp": "タスク名", "zh_cn": "任务名称"}' WHERE "field_id" = 132;
UPDATE "field_info" SET "field_label" = '{"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}' WHERE "field_id" = 133;
UPDATE "field_info" SET "field_label" = '{"en_us": "Person In Charge", "ja_jp": "担当者", "zh_cn": "负责人"}' WHERE "field_id" = 134;
UPDATE "field_info" SET "field_label" = '{"en_us": "Start date", "ja_jp": "開始日", "zh_cn": "开始日期"}' WHERE "field_id" = 135;
UPDATE "field_info" SET "field_label" = '{"en_us": "Completion Date (Estimated)", "ja_jp": "完了予定日", "zh_cn": "预计完成日期"}' WHERE "field_id" = 136;
UPDATE "field_info" SET "field_label" = '{"en_us": "Customer Name", "ja_jp": "顧客名", "zh_cn": "客户姓名"}' WHERE "field_id" = 137;
UPDATE "field_info" SET "field_label" = '{"en_us": "Customer Name", "ja_jp": "顧客名", "zh_cn": "客户姓名"}' WHERE "field_id" = 138;
UPDATE "field_info" SET "field_label" = '{"en_us": "Privacy Setting", "ja_jp": "公開設定", "zh_cn": "公开设置"}' WHERE "field_id" = 139;
UPDATE "field_info" SET "field_label" = '{"en_us": "Trading Product", "ja_jp": "取引商品", "zh_cn": "交易产品"}' WHERE "field_id" = 140;
UPDATE "field_info" SET "field_label" = '{"en_us": "Milestone", "ja_jp": "マイルストーン", "zh_cn": "里程碑"}' WHERE "field_id" = 141;
UPDATE "field_info" SET "field_label" = '{"en_us": "Attach file", "ja_jp": "ファイル添付", "zh_cn": "附加文件"}' WHERE "field_id" = 142;
UPDATE "field_info" SET "field_label" = '{"en_us": "Status", "ja_jp": "ステータス", "zh_cn": "状态"}' WHERE "field_id" = 143;
UPDATE "field_info" SET "field_label" = '{"en_us": "Privacy Setting", "ja_jp": "公開設定", "zh_cn": "公开设置"}' WHERE "field_id" = 144;
UPDATE "field_info" SET "field_label" = '{"en_us": "Subtask", "ja_jp": "サブタスク", "zh_cn": "子任务"}' WHERE "field_id" = 145;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registration Date", "ja_jp": "登録日", "zh_cn": "注册日期"}' WHERE "field_id" = 146;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}' WHERE "field_id" = 147;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}' WHERE "field_id" = 148;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最终更新者"}' WHERE "field_id" = 149;
UPDATE "field_info" SET "field_label" = '{"en_us": "Subtask Name", "ja_jp": "サブタスク名", "zh_cn": "子任务名称"}' WHERE "field_id" = 150;
UPDATE "field_info" SET "field_label" = '{"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}' WHERE "field_id" = 151;
UPDATE "field_info" SET "field_label" = '{"en_us": "Person In Charge", "ja_jp": "担当者", "zh_cn": "负责人"}' WHERE "field_id" = 152;
UPDATE "field_info" SET "field_label" = '{"en_us": "Start date", "ja_jp": "開始日", "zh_cn": "开始日期"}' WHERE "field_id" = 153;
UPDATE "field_info" SET "field_label" = '{"en_us": "Completion Date (Estimated)", "ja_jp": "完了予定日", "zh_cn": "预计完成日期"}' WHERE "field_id" = 154;
UPDATE "field_info" SET "field_label" = '{"en_us": "Attach file", "ja_jp": "ファイル添付", "zh_cn": "附加文件"}' WHERE "field_id" = 155;
UPDATE "field_info" SET "field_label" = '{"en_us": "Status", "ja_jp": "ステータス", "zh_cn": "状态"}' WHERE "field_id" = 156;
UPDATE "field_info" SET "field_label" = '{"en_us": "Privacy Setting", "ja_jp": "公開設定", "zh_cn": "公开设置"}' WHERE "field_id" = 157;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registration Date", "ja_jp": "登録日", "zh_cn": "注册日期"}' WHERE "field_id" = 158;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}' WHERE "field_id" = 159;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}' WHERE "field_id" = 160;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最终更新者"}' WHERE "field_id" = 161;
UPDATE "field_info" SET "field_label" = '{"en_us": "Milestone Name", "ja_jp": "マイルストーン名", "zh_cn": "里程碑名称"}' WHERE "field_id" = 162;
UPDATE "field_info" SET "field_label" = '{"en_us": "Completion Date (Estimated)", "ja_jp": "完了予定日", "zh_cn": "预计完成日期"}' WHERE "field_id" = 163;
UPDATE "field_info" SET "field_label" = '{"en_us": "Completion Setting", "ja_jp": "完了設定", "zh_cn": "完成设置"}' WHERE "field_id" = 164;
UPDATE "field_info" SET "field_label" = '{"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}' WHERE "field_id" = 165;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registration Date", "ja_jp": "登録日", "zh_cn": "注册日期"}' WHERE "field_id" = 166;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}' WHERE "field_id" = 167;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}' WHERE "field_id" = 168;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最终更新者"}' WHERE "field_id" = 169;
UPDATE "field_info" SET "field_label" = '{"en_us": "Trading Product Code", "ja_jp": "取引商品コード", "zh_cn": "交易产品代码"}' WHERE "field_id" = 170;
UPDATE "field_info" SET "field_label" = '{"en_us": "Customer Name", "ja_jp": "顧客名", "zh_cn": "客户姓名"}' WHERE "field_id" = 171;
UPDATE "field_info" SET "field_label" = '{"en_us": "Product Name", "ja_jp": "商品名", "zh_cn": "产品名称"}' WHERE "field_id" = 172;
UPDATE "field_info" SET "field_label" = '{"en_us": "Quantity", "ja_jp": "数量", "zh_cn": "数量"}' WHERE "field_id" = 173;
UPDATE "field_info" SET "field_label" = '{"en_us": "Price", "ja_jp": "単価", "zh_cn": "单价"}' WHERE "field_id" = 174;
UPDATE "field_info" SET "field_label" = '{"en_us": "Amount", "ja_jp": "金額", "zh_cn": "金额"}' WHERE "field_id" = 175;
UPDATE "field_info" SET "field_label" = '{"en_us": "Progress", "ja_jp": "進捗状況", "zh_cn": "进度状态"}' WHERE "field_id" = 176;
UPDATE "field_info" SET "field_label" = '{"en_us": "Estimated order date", "ja_jp": "受注予定日", "zh_cn": "预定的订单日期"}' WHERE "field_id" = 177;
UPDATE "field_info" SET "field_label" = '{"en_us": "Completion Date (Estimated)", "ja_jp": "完了予定日", "zh_cn": "预计完成日期"}' WHERE "field_id" = 178;
UPDATE "field_info" SET "field_label" = '{"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}' WHERE "field_id" = 179;
UPDATE "field_info" SET "field_label" = '{"en_us": "Person In Charge", "ja_jp": "担当者", "zh_cn": "负责人"}' WHERE "field_id" = 180;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registration Date", "ja_jp": "登録日", "zh_cn": "注册日期"}' WHERE "field_id" = 181;
UPDATE "field_info" SET "field_label" = '{"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}' WHERE "field_id" = 182;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}' WHERE "field_id" = 183;
UPDATE "field_info" SET "field_label" = '{"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最终更新者"}' WHERE "field_id" = 184;
UPDATE "field_info" SET "field_label" = '{"en_us": "Customer Code", "ja_jp": "顧客コード", "zh_cn": "客户代码"}' WHERE "field_id" = 185;
UPDATE "field_info" SET "field_label" = '{"en_us": "Trading Product Code", "ja_jp": "取引商品コード", "zh_cn": "交易产品代码"}' WHERE "field_id" = 186;
UPDATE "field_info" SET "field_label" = '{"en_us": "Milestone Code", "ja_jp": "マイルストーンコード", "zh_cn": "里程碑代码"}' WHERE "field_id" = 187;
UPDATE "field_info" SET "field_label" = '{"en_us": "Task Code", "ja_jp": "タスクコード", "zh_cn": "任务代码"}' WHERE "field_id" = 188;
UPDATE "field_info" SET "field_label" = '{"en_us": "Milestone Code", "ja_jp": "マイルストーンコード", "zh_cn": "里程碑代码"}' WHERE "field_id" = 189;
UPDATE "field_info" SET "field_label" = '{"en_us": "Department Name", "ja_jp": "部署名", "zh_cn": "部门名称"}' WHERE "field_id" = 190;
UPDATE "field_info" SET "field_label" = '{"en_us": "Parent Department", "ja_jp": "親部署", "zh_cn": "父部门"}' WHERE "field_id" = 191;
UPDATE "field_info" SET "field_label" = '{"en_us": "Department Manager", "ja_jp": "部署管理者", "zh_cn": "部门管理员"}' WHERE "field_id" = 192;
UPDATE "field_info" SET "field_label" = '{"en_us": "Administrator Privilege", "ja_jp": "管理権限", "zh_cn": "管理员权限"}' WHERE "field_id" = 193;
UPDATE "field_info" SET "field_label" = '{"en_us": "Date&Time", "ja_jp": "日時", "zh_cn": "日期和时间"}' WHERE "field_id" = 196;
UPDATE "field_info" SET "field_label" = '{"en_us": "Employee ID", "ja_jp": "社員ID", "zh_cn": "员工ID"}' WHERE "field_id" = 197;
UPDATE "field_info" SET "field_label" = '{"en_us": "Employee Name", "ja_jp": "社員名", "zh_cn": "员工名称"}' WHERE "field_id" = 198;
UPDATE "field_info" SET "field_label" = '{"en_us": "IP Address", "ja_jp": "IPアドレス", "zh_cn": "IP地址"}' WHERE "field_id" = 199;
UPDATE "field_info" SET "field_label" = '{"en_us": "Event", "ja_jp": "イベント", "zh_cn": "事件"}' WHERE "field_id" = 200;
UPDATE "field_info" SET "field_label" = '{"en_us": "Results", "ja_jp": "結果", "zh_cn": "结果"}' WHERE "field_id" = 201;
UPDATE "field_info" SET "field_label" = '{"en_us": "Error Information", "ja_jp": "エラー情報", "zh_cn": "错误信息"}' WHERE "field_id" = 202;
UPDATE "field_info" SET "field_label" = '{"en_us": "ID", "ja_jp": "ID", "zh_cn": "ID"}' WHERE "field_id" = 203;
UPDATE "field_info" SET "field_label" = '{"en_us": "Additional Information", "ja_jp": "補足情報", "zh_cn": "附加信息"}' WHERE "field_id" = 204;
UPDATE "field_info" SET "field_label" = '{"en_us": "Scenarios", "ja_jp": "シナリオ", "zh_cn": "场景"}' WHERE "field_id" = 205;
UPDATE "field_info" SET "field_label" = '{"en_us": "Completion Status", "ja_jp": "継続／終了", "zh_cn": "继续/结束"}' WHERE "field_id" = 206;

--tab_info
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Basic Information", "ja_jp": "基本情報", "zh_cn": "基本信息"}' WHERE "tab_info_id" = 1;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Activity History", "ja_jp": "活動履歴", "zh_cn": "活动历史"}' WHERE "tab_info_id" = 2;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Trading Product", "ja_jp": "取 引 商 品", "zh_cn": "交易产品"}' WHERE "tab_info_id" = 3;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Calendar", "ja_jp": "カレンダー", "zh_cn": "日历"}' WHERE "tab_info_id" = 4;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Email", "ja_jp": "メール", "zh_cn": "电子邮件"}' WHERE "tab_info_id" = 5;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Changed History", "ja_jp": "変更履歴", "zh_cn": "修订记录"}' WHERE "tab_info_id" = 6;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Basic Information", "ja_jp": "基本情報", "zh_cn": "基本信息"}' WHERE "tab_info_id" = 7;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Changed History", "ja_jp": "変更履歴", "zh_cn": "修订记录"}' WHERE "tab_info_id" = 9;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Basic Information", "ja_jp": "基本情報", "zh_cn": "基本信息"}' WHERE "tab_info_id" = 10;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Changed History", "ja_jp": "変更履歴", "zh_cn": "修订记录"}' WHERE "tab_info_id" = 11;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Basic Information", "ja_jp": "基本情報", "zh_cn": "基本信息"}' WHERE "tab_info_id" = 12;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Changed History", "ja_jp": "変更履歴", "zh_cn": "修订记录"}' WHERE "tab_info_id" = 13;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Basic Information", "ja_jp": "基本情報", "zh_cn": "基本信息"}' WHERE "tab_info_id" = 14;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Changed History", "ja_jp": "変更履歴", "zh_cn": "修订记录"}' WHERE "tab_info_id" = 15;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Basic Information", "ja_jp": "基本情報", "zh_cn": "基本信息"}' WHERE "tab_info_id" = 16;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Customer", "ja_jp": "顧客", "zh_cn": "客户"}' WHERE "tab_info_id" = 17;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Businesscard", "ja_jp": "名刺", "zh_cn": "名片"}' WHERE "tab_info_id" = 18;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Calendar", "ja_jp": "カレンダー", "zh_cn": "日历"}' WHERE "tab_info_id" = 19;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Task", "ja_jp": "タスク", "zh_cn": "任务"}' WHERE "tab_info_id" = 20;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Email", "ja_jp": "メール", "zh_cn": "电子邮件"}' WHERE "tab_info_id" = 21;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Trading Product", "ja_jp": "取引商品", "zh_cn": "交易产品"}' WHERE "tab_info_id" = 22;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Budget Control", "ja_jp": "予実", "zh_cn": "预算和结果"}' WHERE "tab_info_id" = 23;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Joined Group", "ja_jp": "参加中グループ", "zh_cn": "在参加的群组"}' WHERE "tab_info_id" = 24;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Changed History", "ja_jp": "変更履歴", "zh_cn": "修订记录"}' WHERE "tab_info_id" = 25;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Basic Information", "ja_jp": "基本情報", "zh_cn": "基本信息"}' WHERE "tab_info_id" = 26;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Network Map", "ja_jp": "人脈マップ", "zh_cn": "关系网络图"}' WHERE "tab_info_id" = 27;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Acitvity History", "ja_jp": "活動履歴", "zh_cn": "活动历史"}' WHERE "tab_info_id" = 28;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Trading Product", "ja_jp": "取引商品", "zh_cn": "交易产品"}' WHERE "tab_info_id" = 29;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Calendar", "ja_jp": "カレンダー", "zh_cn": "日历"}' WHERE "tab_info_id" = 30;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Task", "ja_jp": "タスク", "zh_cn": "任务"}' WHERE "tab_info_id" = 31;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Email", "ja_jp": "メール", "zh_cn": "电子邮件"}' WHERE "tab_info_id" = 32;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Changed History", "ja_jp": "変更履歴", "zh_cn": "修订记录"}' WHERE "tab_info_id" = 34;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Revenue", "ja_jp": "売上", "zh_cn": "营业额"}' WHERE "tab_info_id" = 36;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Basic Information", "ja_jp": "基本情報", "zh_cn": "基本信息"}' WHERE "tab_info_id" = 37;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Trading Product", "ja_jp": "取引商品", "zh_cn": "交易产品"}' WHERE "tab_info_id" = 38;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Changed History", "ja_jp": "変更履歴", "zh_cn": "修订记录"}' WHERE "tab_info_id" = 39;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Basic Information", "ja_jp": "基本情報", "zh_cn": "基本信息"}' WHERE "tab_info_id" = 40;
UPDATE "tab_info" SET "tab_label" = '{"en_us": "Changed History", "ja_jp": "変更履歴", "zh_cn": "修订记录"}' WHERE "tab_info_id" = 41;