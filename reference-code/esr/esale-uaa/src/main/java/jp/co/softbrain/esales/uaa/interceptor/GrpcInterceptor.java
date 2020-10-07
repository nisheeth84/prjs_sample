package jp.co.softbrain.esales.uaa.interceptor;

import org.lognet.springboot.grpc.GRpcGlobalInterceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import com.amazonaws.xray.AWSXRay;
import com.amazonaws.xray.AWSXRayRecorder;
import com.amazonaws.xray.entities.Entity;
import com.amazonaws.xray.entities.Segment;
import com.amazonaws.xray.entities.TraceID;

import io.grpc.ForwardingServerCallListener;
import io.grpc.Metadata;
import io.grpc.ServerCall;
import io.grpc.ServerCallHandler;
import io.grpc.ServerInterceptor;
import jp.co.softbrain.esales.config.Keys;
import jp.co.softbrain.esales.uaa.security.AccessTokenContextHolder;
import jp.co.softbrain.esales.uaa.tenant.util.TenantContextHolder;

@GRpcGlobalInterceptor
public class GrpcInterceptor implements ServerInterceptor {
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Value("${spring.application.name}")
    private String appName;

    @Value("${XRAY_ENABLED:false}")
    private String xRayEnabled;

    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(ServerCall<ReqT, RespT> call, Metadata headers, ServerCallHandler<ReqT, RespT> next) {

        String tenantId = headers.get(Keys.TENANT_ID_KEY);
        logger.debug("tenantId from client: {}.", tenantId);
        TenantContextHolder.setTenantId(tenantId);
        AccessTokenContextHolder.setAccessToken(headers.get(Keys.HEADER_ACCESS_TOKEN));

        String traceId = headers.get(Keys.TRACE_ID_HEADER);
        String parentId = headers.get(Keys.PARENT_ID_HEADER);
        TraceID tId = new TraceID();
        if (traceId != null) {
            tId = TraceID.fromString(traceId);
        }

        AWSXRayRecorder recorder = AWSXRay.getGlobalRecorder();
        Segment segment = null;
        if ((xRayEnabled).equalsIgnoreCase("true")) {
            segment = recorder.beginSegment(appName, tId, parentId);
            headers.discardAll(Keys.PARENT_ID_HEADER);
            headers.discardAll(Keys.TRACE_ID_HEADER);
            headers.put(Keys.PARENT_ID_HEADER, segment.getId());
            headers.put(Keys.TRACE_ID_HEADER, tId.toString());
        }
        ServerCall.Listener<ReqT> listener = next.startCall(call, headers);

        return new ForwardingListener<>(listener, call, recorder, recorder.getTraceEntity(), segment);
    }

    public class ForwardingListener<T, R>
            extends ForwardingServerCallListener.SimpleForwardingServerCallListener<T> {

        private ServerCall<T, R> call;
        private AWSXRayRecorder recorder;
        private Entity entity;
        private Segment segment;

        public ForwardingListener(ServerCall.Listener<T> delegate,
                ServerCall<T, R> call,
                AWSXRayRecorder recorder,
                Entity entity,
                Segment segment
        ) {
            super(delegate);
            this.call = call;
            this.recorder = recorder;
            this.entity = entity;
            this.segment = segment;
        }

        @Override
        public void onCancel() {
            if (segment != null) {
                recorder.setTraceEntity(entity);
                if (call.isCancelled()) {
                    return;
                }
                segment.setFault(true);
                try {
                    super.onCancel();
                }
                finally {
                    segment.close();
                }
            }
            else {
                super.onCancel();
            }
        }

        @Override
        public void onComplete() {
            if (segment != null) {
                recorder.setTraceEntity(entity);
                try {
                    super.onComplete();
                }
                catch (Exception e) {
                    segment.setError(true);
                }
                finally {
                    segment.close();
                }
            }
            else {
                super.onComplete();
            }
        }
    }
}
