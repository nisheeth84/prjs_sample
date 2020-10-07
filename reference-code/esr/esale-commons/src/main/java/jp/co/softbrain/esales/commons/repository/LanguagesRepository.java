package jp.co.softbrain.esales.commons.repository;

import jp.co.softbrain.esales.commons.domain.Languages;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * Spring Data repository for the Language entity.
 */
@Repository
@XRayEnabled
public interface LanguagesRepository extends JpaRepository<Languages, Long> {

    /**
     * fill all entity Languages order by DisplayOder
     * 
     * @return the list entity Languages
     */
    List<Languages> findAllByOrderByDisplayOrderAsc();

}
