package com.viettel.asset.dao;

import com.viettel.asset.bo.CatWarehouse;
import org.springframework.stereotype.Repository;

@Repository("catWarehouseDao")
public class CatWarehouseDao extends HibernateDao<CatWarehouse, Long> {

}
