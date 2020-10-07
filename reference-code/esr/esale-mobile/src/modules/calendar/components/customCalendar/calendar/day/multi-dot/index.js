import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import {shouldUpdate} from '../../../shouldUpdate';
import styleConstructor from './styleConstructor';

class Day extends React.Component {
  static displayName = 'IGNORE';
  
  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['disabled', 'today', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.style = styleConstructor(props.theme);

    this.onDayPress = this.onDayPress.bind(this);
    this.onDayLongPress = this.onDayLongPress.bind(this);
    const data = moment(this.props.date.dateString);
    this.isWeekend = data.weekday() == 6 || data.weekday() == 0;
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }

  onDayLongPress() {
    this.props.onLongPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, ['state', 'children', 'marking', 'onPress', 'onLongPress']);
  }

  renderDots(marking) {
    const baseDotStyle = [this.style.dot, this.style.visibleDot];
    if (marking.dots && Array.isArray(marking.dots) && marking.dots.length > 0) {
      // Filter out dots so that we we process only those items which have key and color property
      const validDots = marking.dots.filter(d => (d && d.color));
      if(validDots.length == 4){
        
        return validDots.map((dot, index) => {
          if(index < 2){
            return (
              <View key={dot.key ? dot.key : index} style={[baseDotStyle,
                {backgroundColor: marking.selected && dot.selectedDotColor ? dot.selectedDotColor : dot.color}]}/>
            );
          }else{
            if(index == 3){
              return ( <Text style={[{fontSize:8,marginTop: 2,
                marginLeft: 1},
                {color: "black" }]}>+</Text>)
            }else{
              return (<></>);
            }
            
          }
          
        });
      }else{
        return validDots.map((dot, index) => {
          return (
            <View key={dot.key ? dot.key : index} style={[baseDotStyle,
              {backgroundColor: marking.selected && dot.selectedDotColor ? dot.selectedDotColor : dot.color}]}/>
          );
        });
      }
     
    }
    return;
  }

  render() {
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];
    const marking = this.props.marking || {};
    const dot = this.renderDots(marking);
    const isDisabled = typeof marking.disabled !== 'undefined' ? marking.disabled : this.props.state === 'disabled';

    if (marking.selected) {
      containerStyle.push(this.style.selected);
      textStyle.push(this.style.selectedText);
      if (marking.selectedColor) {
        containerStyle.push({backgroundColor: marking.selectedColor});
      }
    } else if (isDisabled) {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      containerStyle.push(this.style.today);
      textStyle.push(this.style.todayText);
    }else{
      if(!marking.selected && (marking.isWeekend || this.isWeekend)){
        textStyle.push(this.style.weekend);
      }
    }
    
    
    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={containerStyle}
        onPress={this.onDayPress}
        onLongPress={this.onDayLongPress}
        disabled={marking.disableTouchEvent}
        accessibilityRole={isDisabled ? undefined : 'button'}
        accessibilityLabel={this.props.accessibilityLabel}
      >
        <Text allowFontScaling={false} style={textStyle}>{String(this.props.children)}</Text>
        <View style={{flexDirection: 'row'}}>{dot}</View>
      </TouchableOpacity>
    );
  }
}

export default Day;
