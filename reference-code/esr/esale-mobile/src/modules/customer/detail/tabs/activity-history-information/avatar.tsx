import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface Props {
    style?: object,
    imgPath?: any,
    userName?: string,
    type?: number
}

export const DefaultAvatar: React.FC<Props> = (props) => {
    const defaultStyle = { width: 40, height: 40};

    const validImagePath = (path: string) => {
        const testString = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;
        return testString.test(path);
      };

    const imagePath = props?.imgPath && validImagePath(props?.imgPath); 

    const  renderDefaultImage = () => {
        if(props?.type === 1) {
            return (
                    <View style={styles.defaultAvatarWrap5050}>
                        <Text>{props?.userName ? props?.userName.charAt(0) : ""}</Text>
                    </View>
            )
        } else {
            return (
                <View style={styles.defaultAvatarWrap2020}>
                    <Text>{props?.userName ? props?.userName.charAt(0) : ""}</Text>
                </View>
        ) 
        }
    };

    const renderImage = () => {   
        if(props?.type === 1){
            return (
                    <View style={[styles.defaultAvatarWrap5050,{backgroundColor:"transparent", overflow: "hidden"}]}>
                        <Image resizeMode="contain" source={{uri: props?.imgPath}} style={[defaultStyle, props?.style]}/>
                    </View>
            )
        } else {
            return (
                <View style={[styles.defaultAvatarWrap2020,{backgroundColor:"transparent", overflow: "hidden"}]}>
                    <Image resizeMode="contain" source={{uri: props?.imgPath}} style={[defaultStyle, props?.style]}/>
                </View>
        )
        }
    };

    return (imagePath ? renderImage() : renderDefaultImage()); 
}

const styles = StyleSheet.create({
    defaultAvatarWrap5050: {
        backgroundColor: "#4B8A08", 
        justifyContent: "center",
        width: 40, 
        height: 40,
        resizeMode: "contain", 
        alignItems: "center", 
        borderRadius: 50
    },
    defaultAvatarWrap2020: {
        backgroundColor: "#4B8A08", 
        justifyContent: "center",
        alignItems: "center",
        width: 24,
        height: 24,
        resizeMode: "contain",
        marginHorizontal: 5,
        borderRadius: 50,
    }
}) 