package com.viettel.asset.dao;

import com.viettel.asset.bo.WareExpNote;
import org.springframework.stereotype.Repository;

@Repository("wareExpNoteDao")
public class WareExpNoteDao extends HibernateDao<WareExpNote, Long> {

}
