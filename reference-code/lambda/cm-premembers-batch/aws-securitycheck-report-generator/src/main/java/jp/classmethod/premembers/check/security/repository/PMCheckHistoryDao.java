package jp.classmethod.premembers.check.security.repository;

import org.springframework.stereotype.Component;

import jp.classmethod.premembers.check.security.repository.entity.PMCheckHistory;

@Component
public class PMCheckHistoryDao extends GenericRepositoryDao<PMCheckHistory, String> {
    /**
     * Constructor
     */
    public PMCheckHistoryDao() {
        super(PMCheckHistory.class);
    }
}
