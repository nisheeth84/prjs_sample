package jp.co.softbrain.esales.uaa.domain;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;

import java.io.Serializable;

/**
 * The Authority entity.
 */
@Entity
@Table(name = "authority")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Data
@EqualsAndHashCode
public class Authority implements Serializable {

    private static final long serialVersionUID = -3587876702192958526L;

    /**
     * The Authority authorityId
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "authority_sequence_generator")
    @SequenceGenerator(name = "authority_sequence_generator", allocationSize = 1)
    @Column(name = "authority_id")
    private Long authorityId;

    /**
     * The Authority Name
     */
    @Column(name = "name")
    private String name;
}
