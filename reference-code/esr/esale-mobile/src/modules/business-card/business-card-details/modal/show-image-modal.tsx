import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { CommonModalStyles, CommonStyles } from "../../../../shared/common-style";
import { appImages } from "../../../../config/constants";
import { Icon } from "../../../../shared/components/icon";
import { checkEmptyString } from "../../../../shared/util/app-utils";
import { BusinessCardDetailStyle } from "../business-card-detail-style";

export interface ModalProps {
  // on close
  onCloseModal: Function;
  //previous business card
  hasPrev: boolean;
  //next business card
  hasNext: boolean;
  // on click left button
  onClickLeft: Function;
  // on click right button
  onClickRight: Function;
  // image
  imagePath: string
}

/**	
 * Component show register modal
 * @param param0 
 */

export const ShowImageModal: React.FunctionComponent<ModalProps> = ({
  onCloseModal = () => { },
  onClickLeft = () => { },
  onClickRight = () => { },
  imagePath = "",
  hasPrev = false,
  hasNext = false
}) => {
  const [image, setImage] = useState(imagePath);
  useEffect(() => {
    setImage(imagePath);
  }, [imagePath]);

  return (
    <View style={CommonModalStyles.mainModalContainer}>
      <View style={CommonStyles.full}>
        <View style={[CommonStyles.rowInlineEnd]}>
          <TouchableOpacity
            onPress={() => {
              onCloseModal()
            }}>
            <Image
              style={[CommonModalStyles.iconClose]}
              resizeMode="contain"
              source={appImages.icCloseWhite} />
          </TouchableOpacity>
        </View>
        <View style={[CommonStyles.rowInlineSpaceBetween, CommonStyles.flex1]} >
          {
            hasPrev ? < TouchableOpacity
              style={CommonStyles.padding2}
              onPress={() => {
                onClickLeft();
              }}
            >
              <Icon name="back" />
            </TouchableOpacity>
              : <View style={CommonStyles.hideIcon} />
          }
          <Image
            style={[
              CommonStyles.flex1,
              BusinessCardDetailStyle.imagePreviewStyle,
            ]}
            resizeMode="contain"
            source={!checkEmptyString(image) ? { uri: image } : appImages.frame} />
          {
            hasNext ? <TouchableOpacity
              style={CommonStyles.padding2}
              onPress={() => {
                onClickRight();
              }}
            >
              <Icon name="next" />
            </TouchableOpacity>
              : <View style={CommonStyles.hideIcon} />
          }
        </View>
      </View>
    </View >
  );
};
