package jp.co.softbrain.esales.employees.web.rest.vm;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response request auth check login state
 */
@Data
@EqualsAndHashCode
public class AuthCheckResponse implements Serializable {

    private static final long serialVersionUID = 1475378422049002335L;

    private Set<String> authorities = new HashSet<>();
    private Set<Integer> licenses = new HashSet<>();
    private String languageCode;
    private String formatDate;
    private String timezoneName;
    private String iconPath;
    private Boolean isAccessContract;
    private Boolean isEmployeeExisted;
}
