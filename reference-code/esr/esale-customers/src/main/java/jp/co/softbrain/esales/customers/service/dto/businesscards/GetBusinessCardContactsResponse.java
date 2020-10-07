package jp.co.softbrain.esales.customers.service.dto.businesscards;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetBusinessCardContactsResponse
 * 
 * @author ngant
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetBusinessCardContactsResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8365182490325568974L;

    /**
     * contacts
     */
    private List<GetBusinessCardContactsOutDTO> contacts;

}
