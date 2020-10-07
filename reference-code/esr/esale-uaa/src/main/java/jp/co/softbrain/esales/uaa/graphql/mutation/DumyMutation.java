package jp.co.softbrain.esales.uaa.graphql.mutation;

import org.springframework.stereotype.Component;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import com.coxautodev.graphql.tools.GraphQLMutationResolver;

/**
 * {@link DumyMutation} class process GraphQL Mutation
 * 
 * @author nguyenductruong
 */

@Component
@XRayEnabled
public class DumyMutation implements GraphQLMutationResolver{
    private static final String DUMY_DATA = "API dummy";
    
    /**
     * dumy
     */
    public String dumy() {
        return DUMY_DATA;
    }
}
