package com.viettel.vtpgw.persistence.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.Objects;

@Entity
@Table(name = "vtpgw_nodes")
@Getter
@Setter
public class NodeEntity extends BaseEntity {

    private String url;
    private String checkUrl;
    private Integer status;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "serviceId", referencedColumnName = "serviceId", foreignKey=@ForeignKey(name="FK_serviceId"), nullable = false)
//    private ServiceEntity service;
}
