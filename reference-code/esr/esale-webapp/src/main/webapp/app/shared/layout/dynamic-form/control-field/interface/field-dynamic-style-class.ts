export interface IFieldDynamicStyleClass {
  textBox?: {
    search?: {
      input?: string;
      wrapInput?: string;
    };
    edit?: {
      input?: string;
    };
  };
  textArea?: {
    search?: {
      input?: string;
      wrapInput?: string;
    };
    edit?: {
      input?: string;
    };
  };
  checkBox?: {
    search?: {
      wrapCheckbox?: string;
      inputCheckbox?: string;
    };
    edit?: {
      wrapCheckbox?: string;
      inputCheckbox?: string;
    };
  };
  radioBox?: {
    search?: { wrapRadio?: string };
    edit?: { wrapRadio?: string };
  };
  singleSelectBox?: {
    search?: {
      wrapSelect?: string;
      inputSelect?: string;
    };
    edit?: {
      wrapSelect?: string;
      inputSelect?: string;
      dropdownSelect?: string;
    };
  };
  multiSelectBox?: {
    search?: {
      wrapSelect?: string;
      inputSelect?: string;
    };
    edit?: {
      wrapSelect?: string;
      inputSelect?: string;
      dropdownSelect?: string;
    };
  };
  numberBox?: {
    search?: {
      wrapBoxFrom?: string;
      wrapInputFrom?: string;
      inputFrom?: string;
      wrapBoxTo?: string;
      wrapInputTo?: string;
      inputTo?: string;
    };
    edit?: {
      wrapBox?: string;
      wrapInput?: string;
      input?: string;
    };
    editList?: {
      wrapBox?: string;
      wrapInput?: string;
      input?: string;
    };
  };
  dateBox?: {
    search?: {};
    edit?: {
      wrapInput?: string;
      input?: string;
    };
  };
  timeBox?: {
    search?: {};
    edit?: {
      wrapInput?: string;
      input?: string;
      inputList?: string;
    };
  };
  datetimeBox?: {
    search?: {};
    edit?: {
      wrapBox?: string;
      wrapDate?: string;
      inputDate?: string;
      wrapTime?: string;
      inputTime?: string;
    };
  };
  titleBox?: {
    edit?: {
      wrapBox?: string;
    };
  };
  detailViewBox?: {
    columnFirst?: string;
    columnSecond?: string;
  };
  addressBox?: {
    search?: {};
    edit?: {
      inputText?: string;
    };
  };
}

const getStyleElement = (fieldStyle: IFieldDynamicStyleClass, attributes: string) => {
  if (!fieldStyle || !attributes) {
    return '';
  }
  const properties = attributes.split('.');
  return properties.reduce((prev, curr) => prev && prev[curr], fieldStyle);
};
