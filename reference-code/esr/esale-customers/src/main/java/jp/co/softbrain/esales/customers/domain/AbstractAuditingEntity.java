package jp.co.softbrain.esales.customers.domain;

import java.io.Serializable;
import java.time.Instant;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Base abstract class for entities which will hold definitions for created,
 * last modified by and created,
 * last modified by date.
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Data
@EqualsAndHashCode
public abstract class AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 6957172879983027097L;

    @CreatedDate
    @Column(name = "created_date", updatable = false)
    @JsonIgnore
    private Instant createdDate = Instant.now();

    // @CreatedBy
    @Column(name = "created_user", nullable = false, updatable = false)
    @JsonIgnore
    private Long createdUser;

    @LastModifiedDate
    @Column(name = "updated_date")
    @JsonIgnore
    private Instant updatedDate = Instant.now();

    // @LastModifiedBy
    @Column(name = "updated_user", nullable = false)
    @JsonIgnore
    private Long updatedUser;
}
