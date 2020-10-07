package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetNotificationsRequest implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 4653159138858653336L;

    /**
     * limit
     */
    private Long limit;

    /**
     * textSearch
     */
    private String textSearch;

}
