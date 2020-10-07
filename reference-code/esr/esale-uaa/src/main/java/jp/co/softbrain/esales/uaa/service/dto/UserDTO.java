package jp.co.softbrain.esales.uaa.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A user.
 */
@Data
@EqualsAndHashCode
public class UserDTO implements Serializable {

    private static final long serialVersionUID = 6750173735431048024L;

    private String login;

    private String password;

    private String email;

    private String langKey = "ja";

    private String resetKey;

    private Instant resetDate = null;

    private Set<String> authorities = new HashSet<>();
}
