import React from "react";
import {View, Image} from "react-native";
import { images } from "../../../../../../../assets/icons";

export default function Loading() {
    return (
        <View style={{
            width: '100%',
            alignItems: 'center',
            backgroundColor: '#fff',
        }}>
            <Image
                style={{ width: 35, height: 35 }}
                source={images.loading}
            ></Image>
        </View>
    )
}

