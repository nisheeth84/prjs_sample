import React from 'react'
import _ from 'lodash';
import { urlify } from 'app/shared/util/string-utils';
import parser from 'react-html-parser';
import { ControlType } from 'app/config/constants'

export interface IFieldDetailViewTextAreaProps {
  text,
  mode?: any
}

const FieldDetailViewTextArea = (props: IFieldDetailViewTextAreaProps) => {
  const { text } = props;
  const renderComponet = () => {
    const arrText = _.isNil(text) ? [] : text.toString().split(/[\n\r]/g);
    if (_.isEqual(props.mode, ControlType.VIEW) && arrText.length > 5) {
      arrText.splice(4);
      arrText.push("...");
    }
    return (
      <>
        {arrText.map((txt, idx) => {
          return (
            <>
              {parser(urlify(txt))}{idx < arrText.length - 1 ? <br></br> : ''}
            </>
          )
        })}
      </>
    );
  }
  return renderComponet();
}

export default FieldDetailViewTextArea;