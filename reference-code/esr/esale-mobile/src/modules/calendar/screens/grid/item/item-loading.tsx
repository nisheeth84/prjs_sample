import React from "react";
import { View , ActivityIndicator} from "react-native"
/**
 * Render Loading Component
 */
export const LoadingComponent = React.memo(() => {
  return (
    <View style={{
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#fff',
    }}>
        <ActivityIndicator animating size="large"/>
    </View>
    )
})