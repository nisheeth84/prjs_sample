package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for ImportEmployees: Statistics of processed results
 * 
 * @author TranTheDuy
 */
@Data
@EqualsAndHashCode
public class ImportEmployeesSubType4DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -3313641184359633349L;

    /**
     * Number of records processed.
     */
    private int processedRecordCount = 0;

    /**
     * Total records.
     */
    private int totalRecords = 0;

    /**
     * Number of registered records.
     */
    private int registeredRecordCount = 0;

    /**
     * Number of registered records.
     */
    private int updatedRecordCount = 0;

    /**
     * Number of records with blank business key errors.<br/>
     * マ ッ チ ン グ キ ー が 空白 の た め.
     */
    private int matchingKeyBlankCount = 0;

    /**
     * New record number but not registered.<br/>
     * 新.<br/>
     * デ ー タ を 登録 し な い 設定 設定 た め
     */
    private int notRegistedNewCount = 0;

    /**
     * Number of duplicate records and not processed.<br/>
     * 複数 件 マ ッ チ ン グ し た た め
     */
    private int duplicatedCount = 0;

    /**
     * Number of old records but not updated.<br/>
     * 登録 済 み デ ー タ を 上書 き し な い 設定 の た め
     */
    private int notUpdatedOldCount = 0;

    /**
     * The number of records with invalid data errors.<br/>
     * デ ー タ が 不正 の た め
     */
    private int invalidDataCount = 0;
}
