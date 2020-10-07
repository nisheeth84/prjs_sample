package jp.co.softbrain.esales.tenants.repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.tenants.domain.PaymentsManagement;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data repository for the PaymentsManagement entity.
 *
 * @author nguyenvietloi
 */
@Repository
@XRayEnabled
public interface PaymentsManagementRepository extends JpaRepository<PaymentsManagement, Long> {

    /**
     * Get number of used to calculate weight.
     *
     * @param contractId id of contract
     * @param paymentType type of payment
     * @param yearMonth year-month payment
     * @return number of used.
     */
    @Query(value = "SELECT pm.used_number "
        + "         FROM   payments_management pm "
        + "         INNER JOIN tenants t "
        + "                 ON pm.tenant_id = t.tenant_id "
        + "         WHERE t.contract_id = :contractId "
        + "           AND pm.payment_type = :paymentType "
        + "           AND pm.year_month = :yearMonth ", nativeQuery = true)
    Integer getUsedNumber(@Param("contractId") String contractId,
                       @Param("paymentType") Integer paymentType,
                       @Param("yearMonth") String yearMonth);

    /**
     * Delete PaymentsManagement by conditions.
     *
     * @param tenantId id of tenant
     * @param paymentType type of payment
     * @param yearMonth year-month payment
     */
    void deleteByTenantIdAndPaymentTypeAndYearMonth(
            @Param("tenantId") Long tenantId,
            @Param("paymentType") Integer paymentType,
            @Param("yearMonth") String yearMonth);


    /**
     * Delete Payments Management by list tenant id
     * 
     * @param tenantIds list id of tenant
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = " DELETE FROM payments_management " + 
            " WHERE tenant_id IN (:tenantIds);", nativeQuery = true)
    void deletePaymentsManagementByTenantIds(@Param("tenantIds") List<Long> tenantIds);
}
