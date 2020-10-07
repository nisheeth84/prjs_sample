package jp.co.softbrain.esales.uaa.interceptor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.amazonaws.xray.AWSXRayRecorder;
import com.amazonaws.xray.AWSXRayRecorderBuilder;
import com.amazonaws.xray.entities.Entity;
import com.amazonaws.xray.entities.Segment;
import com.amazonaws.xray.entities.Subsegment;

import io.grpc.CallOptions;
import io.grpc.Channel;
import io.grpc.ClientCall;
import io.grpc.ClientInterceptor;
import io.grpc.ForwardingClientCall;
import io.grpc.ForwardingClientCallListener;
import io.grpc.Metadata;
import io.grpc.MethodDescriptor;
import jp.co.softbrain.esales.config.Keys;
import jp.co.softbrain.esales.uaa.security.SecurityUtils;
import jp.co.softbrain.esales.uaa.tenant.util.TenantContextHolder;

@Component
public class BackendInterceptor implements ClientInterceptor {

    @Value("${XRAY_ENABLED:false}")
    private String xRayEnabled;

    private final AWSXRayRecorder recorder = AWSXRayRecorderBuilder.defaultRecorder();

    @Override
    public <ReqT, RespT> ClientCall<ReqT, RespT> interceptCall(MethodDescriptor<ReqT, RespT> method,
            CallOptions callOptions, Channel next) {

        boolean useXRay = (xRayEnabled).equalsIgnoreCase("true");
        final Segment segment = recorder.getCurrentSegmentOptional().orElseGet(() -> {
            if (useXRay) {
                return recorder.beginSegment(method.getFullMethodName());
            }
            else {
                return null;
            }
        });
        final String segmentId = segment != null ? segment.getId() : "";
        final String traceId = segment != null ? segment.getTraceId().toString() : "";

        ClientCall<ReqT, RespT> call = next.newCall(method, callOptions);
        return new ForwardingClientCall.SimpleForwardingClientCall<ReqT, RespT>(call) {
            @Override
            public void start(Listener<RespT> responseListener, Metadata headers) {
                final Subsegment callSegment = useXRay ? recorder.beginSubsegment(method.getFullMethodName()) : null;
                final Entity context = useXRay ? recorder.getTraceEntity() : null;
                if (useXRay) {
                    headers.discardAll(Keys.PARENT_ID_HEADER);
                    headers.put(Keys.PARENT_ID_HEADER, segmentId);
                    headers.put(Keys.TRACE_ID_HEADER, traceId);
                }

                headers.put(Keys.TENANT_ID_KEY, TenantContextHolder.getTenant());
                SecurityUtils.getTokenValue().ifPresent(token -> 
                    headers.put(Keys.HEADER_ACCESS_TOKEN, token));

                delegate().start(
                        new ForwardingClientCallListener.SimpleForwardingClientCallListener<RespT>(responseListener) {
                            @Override
                            public void onClose(io.grpc.Status status, Metadata trailers) {
                                if (useXRay) {
                                    if (status.getCause() != null && callSegment != null) {
                                        callSegment.addException(status.getCause());
                                    }
                                    else if (!status.isOk() && callSegment != null) {
                                        callSegment.setError(true);
                                    }
                                    try {
                                        super.onClose(status, trailers);
                                    } finally {
                                        Entity originalContext = recorder.getTraceEntity();
                                        recorder.setTraceEntity(context);
                                        try {
                                            if (callSegment != null) {
                                                callSegment.close();
                                            }
                                        } finally {
                                            recorder.setTraceEntity(originalContext);
                                        }
                                    }
                                }
                                else {
                                    super.onClose(status, trailers);
                                }
                            }
                        }, headers);
            }
        };
    }
}
