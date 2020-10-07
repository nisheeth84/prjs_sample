package jp.co.softbrain.esales.commons.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.SuggestionsChoice;

/**
 * Spring Data repository for the SuggestionsChoice entity.
 */
@Repository
@XRayEnabled
public interface SuggestionsChoiceRepository extends JpaRepository<SuggestionsChoice, Long>, SuggestionsChoiceRepositoryCustom {

}
