package com.viettel.vtpgw.persistence.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(
        name = "vtpgw_permission",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"appId", "serviceId"}, name = "UK_p_appId-serviceId"),
                @UniqueConstraint(columnNames = "permissionId", name = "UK_p_permissionId"),
        }
)
@Getter
@Setter
@NoArgsConstructor
public class PermissionEntity extends BaseEntity {

    private String permissionId;
    private String ips;
    private String methods;
    private Long capacity;
    private Long period;
    private Integer noContent;
    private Integer sandBox;
    private Integer debug;
    private Long activated;
    private String appId;
    private String serviceId;

//
//    @OneToOne(optional = false, fetch = FetchType.LAZY)
//    @JoinColumn(
//            name = "serviceId",
//            referencedColumnName = "name",
//            nullable = false, unique = false,
//            foreignKey=@ForeignKey(name="FK_p_s_name")
//    )
//    private ServiceEntity service;
//
//    @OneToOne(optional = false, fetch = FetchType.LAZY)
//    @JoinColumn(
//            name = "appId",
//            referencedColumnName = "appId",
//            nullable = false, unique = false,
//            foreignKey=@ForeignKey(name="FK_p_a_appId")
//    )
//    private ApplicationEntity app;

}
