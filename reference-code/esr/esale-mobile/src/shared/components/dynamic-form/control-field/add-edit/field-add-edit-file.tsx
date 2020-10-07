import _ from 'lodash';
import DocumentPicker from 'react-native-document-picker';
import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import {
  DefineFieldType,
  FileType,
  ModifyFlag,
  SelectFileMode
} from '../../../../../config/constants/enum';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldAddEditFileStyles } from './field-add-edit-styles';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { messages } from './field-add-edit-messages';
import { translate } from '../../../../../config/i18n';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Define value props of FieldAddEditFile component
type IFieldAddEditFileProps = IDynamicFieldProps;

/**
 * Component for select file
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditFile(props: IFieldAddEditFileProps) {
  const { fieldInfo, languageCode } = props;
  const [isSelected, setSelected] = useState(false);
  const [viewAll, setViewAll] = useState(true);
  const [selectedFile, setSelectedFile] = useState<any[]>([]);
  const [selectedFileView, setSelectedFileView] = useState<any[]>([]);
  const valueEdit = props.elementStatus?.fieldValue || TEXT_EMPTY;
  const dataIcon = require("../../../../../../assets/icons/data_icon.png");
  const docIcon = require("../../../../../../assets/icons/doc_icon.png");
  const jpgIcon = require("../../../../../../assets/icons/jpg_icon.png");
  const pdfIcon = require("../../../../../../assets/icons/pdf_icon.png");
  const xlsIcon = require("../../../../../../assets/icons/xls_icon.png");
  const deleteIcon = require("../../../../../../assets/icons/delete.png");
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const modeSelect = fieldInfo?.isDefault ? SelectFileMode.SINGLE : SelectFileMode.MULTI;

  /**
   * Set value of props updateStateElement
   */
  const initialize = () => {
    if (props.updateStateElement && !props.isDisabled) {
      const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
      if (props.elementStatus) {
        keyObject.itemId = props.elementStatus.key;
      }
      props.updateStateElement(keyObject, DefineFieldType.FILE, selectedFile);
    }
  };

  useEffect(() => {
    if (valueEdit) {
      const editFile = {
        uri: valueEdit.uri,
        type: valueEdit.type,
        name: valueEdit.name,
        size: valueEdit.size
      }
      const selectedArray = []
      selectedArray.push(editFile)
      setSelected(true)
      setSelectedFile(selectedArray)
      setSelectedFileView(selectedArray)
    }
  }, [])

  useEffect(() => {
    initialize()
  }, [selectedFile])

  /**
   * handle when select file
   */
  const handleSelectFile = async () => {
    let result
    if (SelectFileMode.SINGLE === modeSelect) {
      result = await DocumentPicker.pick({ type: [DocumentPicker.types.allFiles] });
      setSelectedFile([result])
      setSelectedFileView([result])
    } else if (SelectFileMode.MULTI === modeSelect) {
      result = await DocumentPicker.pickMultiple({ type: [DocumentPicker.types.allFiles] });
      const selectedArray = _.cloneDeep(selectedFile)
      for (const res of result) {
        const newSelectedFile = {
          uri: res.uri,
          type: res.type,
          name: res.name,
          size: res.size
        }
        if (!JSON.stringify(selectedArray).includes(JSON.stringify(newSelectedFile))) {
          selectedArray.push(newSelectedFile)
        }
      }
      setSelectedFile(selectedArray)
      if (selectedArray.length > 5) {
        setViewAll(false)
        setSelectedFileView(selectedArray.slice(0, 5))
      } else {
        setSelectedFileView(selectedArray)
      }
    }
    setSelected(true)
  }

  /**
   * handle when remove selected file
   */
  const handleRemoveFile = (file: any) => {
    const newSelectedFile = selectedFile.filter(item => item.uri !== file.uri)
    if (newSelectedFile.length == 0) {
      setSelected(false)
    }
    setSelectedFile(newSelectedFile)
    if (newSelectedFile.length > 5) {
      setViewAll(false)
      setSelectedFileView(newSelectedFile.slice(0, 5))
    } else {
      setViewAll(true);
      setSelectedFileView(newSelectedFile)
    }
  }

  /**
   * event click view all selection
   */
  const handleViewAll = () => {
    setViewAll(true)
    setSelectedFileView(selectedFile)
  }

  /**
   * Render the select file component in add-edit case
   */
  const renderComponent = () => {
    return (
      <View>
        <View style={FieldAddEditFileStyles.titleContainer}>
          <Text style={FieldAddEditFileStyles.title}>{title}</Text>
          {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
            <View style={FieldAddEditFileStyles.requiredContainer}>
              <Text style={FieldAddEditFileStyles.textRequired}>{translate(messages.common_119908_10_textRequired)}</Text>
            </View>
          )}
        </View>
        {
          !isSelected ?
            <TouchableOpacity style={FieldAddEditFileStyles.labelInput} disabled={fieldInfo.modifyFlag === ModifyFlag.READ_ONLY}
              onPress={() => handleSelectFile()}>
              <Text style={FieldAddEditFileStyles.textPlaceholder}>
                {translate(messages.common_119908_10_filePlaceholder)}
              </Text>
            </TouchableOpacity>
            :
            <View>
              {
                SelectFileMode.MULTI === modeSelect &&
                <View style={FieldAddEditFileStyles.selectedMultiContainer}>
                  <TouchableOpacity onPress={() => handleSelectFile()}>
                    <Text style={FieldAddEditFileStyles.labelSelectedFile}>
                      {title}{translate(messages.common_119908_10_labelMultiSelected)}
                    </Text>
                  </TouchableOpacity>
                </View>
              }
              {
                selectedFileView?.map((item) => {
                  const fileName = item.name ?? TEXT_EMPTY;
                  const fileType = fileName.substr(fileName.lastIndexOf(".") + 1)
                  let icon = FileType.DOC.includes(fileType) && docIcon
                    || FileType.JPG.includes(fileType) && jpgIcon
                    || FileType.PDF.includes(fileType) && pdfIcon
                    || FileType.XLS.includes(fileType) && xlsIcon
                    || dataIcon
                  return (
                    <View style={FieldAddEditFileStyles.textAreaSelectedContainer}>
                      <View style={FieldAddEditFileStyles.iconFile}>
                        <Image source={icon} />
                      </View>
                      <Text style={FieldAddEditFileStyles.fileName}>
                        {item.name}
                      </Text>
                      <View style={FieldAddEditFileStyles.iconDeleteContainer}>
                        <TouchableOpacity onPress={() => handleRemoveFile(item)}>
                          <Image source={deleteIcon} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                })
              }
              {
                SelectFileMode.MULTI === modeSelect && !viewAll &&
                <TouchableOpacity onPress={handleViewAll}>
                  <Text style={FieldAddEditFileStyles.buttonViewAll}>{`${translate(messages.common_119908_10_labelViewMoreFile1)}${(selectedFile.length - 5)}${translate(messages.common_119908_10_labelViewMoreFile2)}`}</Text>
                </TouchableOpacity>
              }
            </View>
        }
      </View >
    );
  }
  return renderComponent();
}
