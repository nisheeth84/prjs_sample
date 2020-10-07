package jp.co.softbrain.esales.tenants.web.rest;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.amazonaws.services.ecs.model.AwsVpcConfiguration;
import com.amazonaws.services.ecs.model.KeyValuePair;
import com.google.common.collect.ImmutableMap;

import jp.co.softbrain.esales.tenants.config.AwsEcsConfigProperties;
import jp.co.softbrain.esales.utils.AwsRunTaskUtil;

/**
 * BatchController
 *
 * @author tongminhcuong
 */
@RestController
public class BatchController {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private AwsEcsConfigProperties awsEcsConfigProperties;

    /**
     * Call batch
     *
     * @param batchRequest request
     * @return message
     */
    @PostMapping(path = "/public/api/test-call-batch", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> callBatch(@RequestBody Map<String, String> batchRequest) {

        // 3.3 call batch delete Tenants
        List<KeyValuePair> environments = batchRequest.entrySet().stream()
                .map(e -> new KeyValuePair().withName(e.getKey()).withValue(e.getValue()))
                .collect(Collectors.toList());

        AwsVpcConfiguration vpcConfig = new AwsVpcConfiguration()
                .withSubnets(awsEcsConfigProperties.getVpcSubnet())
                .withSecurityGroups(awsEcsConfigProperties.getVpcSecurityGroup());

        boolean isSuccess = AwsRunTaskUtil.runAwsFargateTask(
                awsEcsConfigProperties.getCluster(),
                awsEcsConfigProperties.getBatchTaskName(),
                awsEcsConfigProperties.getBatchContainerName(),
                vpcConfig,
                "test call batch by api",
                environments);
        if (!isSuccess) {
            log.debug("API UpdateTenant: Active Batch DeleteTenants Failure!");
            throw new IllegalStateException("Call batch failed.");
        }

        return ResponseEntity.ok(ImmutableMap.of("message", "Success"));
    }
}
