package jp.classmethod.premembers.check.security.repository;

import org.springframework.stereotype.Component;

import jp.classmethod.premembers.check.security.repository.entity.PMAWSAccountCoops;

@Component
public class PMAWSAccountCoopsDao extends GenericRepositoryDao<PMAWSAccountCoops, String> {
    /**
     * Constructor
     */
    public PMAWSAccountCoopsDao() {
        super(PMAWSAccountCoops.class);
    }
}
