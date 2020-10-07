package com.viettel.vtpgw.persistence.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(
        name = "vtpgw_service",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "serviceId", name = "UK_s_serviceId"),
                @UniqueConstraint(columnNames = "name", name = "UK_s_name")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class ServiceEntity extends BaseEntity {

    private String serviceId;
    private Long capacity;
    private Long connectTimeout;
    private String contact;
    private String description;
    private Long idleTimeout;
    private String module;
    private String name;
    private Long period;
    private String sandboxEndpoint;
    private Long standardDuration;
    private Integer reportInterval;
    private Integer status;
    private Long timeout;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JoinColumn(name = "serviceId", referencedColumnName = "id", foreignKey=@ForeignKey(name="FK_serviceId"), nullable = false)
    private List<NodeEntity> endpoints;

    public void setEndpoints(List<NodeEntity> list) {
        if (this.endpoints == null) {
            this.endpoints = list;
        } else {
            this.endpoints.retainAll(list);
            this.endpoints.addAll(list);
        }
    }

}
