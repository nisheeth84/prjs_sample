import React, { Component } from "react";
import styles from "./style";
import Modal from "react-native-modal";
import {View} from 'react-native'
export default class BaseModal extends Component {
  renderHeaderTitle = () => {
    return (
      <View style={[styles.headerContainer, this.props.headerStyle]}>
        <Text ellipsizeMode={"tail"} numberOfLines={1} style={styles.textTitle}>{this.props.headerTitle}</Text>
      </View>
    );
  };

  render() {
    return (
      <View>
        <Modal
          isVisible={this.props.isVisible}
          onBackdropPress={this.props.onBackdropPress}
          // this.props.styleWrap flex end
          style={this.props.styleWrap}
        >
        {/*this.props.styleContent border radius*/}
          <View style={[styles.modalContainer, this.props.styleContent]}>
            {this.props.showHeader ? this.renderHeaderTitle() : null}
            <View style={[styles.modalContent, this.props.style]}>
              {this.props.children}
            </View>
          </View>
        </Modal>
      </View>
    );

  }

}