package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.tenants.domain.Tenants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A DTO for {@link Tenants} using ReceiveSettingRequest API
 *
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReceiveSettingResDTO implements Serializable {

    private static final long serialVersionUID = -1628422800386741745L;

    /**
     * 業務Name
     */
    private String industryTypeName;
    /**
     * 契約ＩＤ
     */
    private String contractTenantId;
    /**
     * 会社名
     */
    private String companyName;
    /**
     * 契約ステータス
     */
    private Integer contractStatus;
    /**
     * トライアル終了日
     */
    private String trialEndDate;
    /**
     * Eメール
     */
    private String email;

    /**
     * 言語コード
     */
    private String languageCode;
    /**
     * 部署名
     */
    private String departmentName;
    /**
     * 役職
     */
    private String positionName;
    /**
     * 名前（姓）
     */
    private String employeeSurname;
    /**
     * 名前（名）
     */
    private String employeeName;
    /**
     * 電話番号
     */
    private String telephoneNumber;
    /**
     * パスワード
     */
    private String password;
    /**
     * 決済月
     */
    private Integer accountClosingMonth;
    /**
     * Product name
     */
    private String productName;
    /**
     * 商品名
     */
    private String customerName;
    /**
     * 顧客名
     */
    private Integer calendarDay;
    /**
     * 業種大分類
     */
    private String businessMain;
    /**
     * 業種小分類
     */
    private String businessSub;

    /**
     * サービスマスタテーブル
     */
    private List<ReceiveSettingPackagesDTO> packages;
}
