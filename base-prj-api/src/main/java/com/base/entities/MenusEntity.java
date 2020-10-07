package com.base.entities;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "menus", schema = "travelblogger", catalog = "")
public class MenusEntity {
    private Integer id;
    private String menuCode;
    private String menuAction;

    @Id
    @Column(name = "id")
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "menu_code")
    public String getMenuCode() {
        return menuCode;
    }

    public void setMenuCode(String menuCode) {
        this.menuCode = menuCode;
    }

    @Basic
    @Column(name = "menu_action")
    public String getMenuAction() {
        return menuAction;
    }

    public void setMenuAction(String menuAction) {
        this.menuAction = menuAction;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MenusEntity that = (MenusEntity) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(menuCode, that.menuCode) &&
                Objects.equals(menuAction, that.menuAction);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, menuCode, menuAction);
    }
}
