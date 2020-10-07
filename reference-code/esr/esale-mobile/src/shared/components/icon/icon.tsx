import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { iconMap } from './icon-map';

export interface IconProps {
  name?: string;
  uri?: string;
  style?: StyleProp<ImageStyle>;
  resizeMode?: ImageStyle["resizeMode"];
}

/**
 * Icon common component
 * @param name
 * @param style
 */
export const Icon: React.FunctionComponent<IconProps> = React.memo(
  ({ name, style, uri, resizeMode }) => {
    const iconUri = name ? iconMap.get(name) : { uri };
    if (!iconUri) {
      return null;
    }
    if (resizeMode) {
      return <Image style={style} source={iconUri} resizeMode={resizeMode} />;
    }
    return <Image style={style} source={iconUri} />;
  }
);
