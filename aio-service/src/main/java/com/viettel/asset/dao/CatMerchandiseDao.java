package com.viettel.asset.dao;

import com.viettel.asset.bo.CatMerchandise;
import org.springframework.stereotype.Repository;

@Repository("catMerchandiseDao")
public class CatMerchandiseDao extends HibernateDao<CatMerchandise, Long> {

}
