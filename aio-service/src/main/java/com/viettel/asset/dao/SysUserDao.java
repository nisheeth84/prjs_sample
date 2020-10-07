package com.viettel.asset.dao;

import com.viettel.asset.bo.SysUser;
import org.springframework.stereotype.Repository;

@Repository("sysUserDao")
public class SysUserDao extends HibernateDao<SysUser, Long> {

}
