package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor

public class GetBusinessCardContactsOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1065041486942428391L;

    /**
     * businessCardId
     */
    private Long businessCardId;

    /**
     * firstName
     */
    private String firstName;

    /**
     * lastName
     */
    private String lastName;

    /**
     * receiveDate
     */
    private String receiveDate;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * employeeName
     */
    private String employeeName;

    /**
     * employeeSurname
     */
    private String employeeSurname;

    /**
     * receivedLastContactDate
     */
    private String receivedLastContactDate;

}
