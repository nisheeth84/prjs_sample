export const LOCAL_BUTTON_TYPES = {
  ICON: 1,
  IMAGE: 1
};

const ICON_CLASS = {
  MOVE_CATEGORY: 'icon-back-fooder',
  DELETE: 'icon-erase',
  IMPORT: 'icon-import',
  DATA_SET: 'ic-data-set'
};

export const CONTROL_TOP_ACTIONS = {
  CREATE_REPORT: 1,
  CREATE_DATA_SET: 2,
  MOVE_CATEGORY: 3,
  DELETE_CATEGORY: 4,
  EXPORT: 5,
  IMPORT: 6
};

export const controlTopConfig = {
  report: {
    btnAdd: {
      labelCode: 'analysis.top.button.addDataSet',
      action: CONTROL_TOP_ACTIONS.CREATE_DATA_SET // TODO: waiting list dataset
    },
    localButtons: [
      {
        alwayShow: true,
        labelCode: null,
        src: ICON_CLASS.DATA_SET, // TODO: waiting list dataset
        type: LOCAL_BUTTON_TYPES.ICON,
        action: CONTROL_TOP_ACTIONS.EXPORT
      },
      {
        alwayShow: false,
        labelCode: null,
        src: ICON_CLASS.MOVE_CATEGORY,
        type: LOCAL_BUTTON_TYPES.ICON,
        action: CONTROL_TOP_ACTIONS.MOVE_CATEGORY
      },
      {
        alwayShow: false,
        labelCode: '',
        src: ICON_CLASS.DELETE,
        type: LOCAL_BUTTON_TYPES.ICON,
        action: CONTROL_TOP_ACTIONS.DELETE_CATEGORY
      }
    ],
    help: {},
    settting: {}
  },
  dataSet: {
    btnAdd: {
      labelCode: ''
    },
    localButtons: [
      {
        alwayShow: true,
        labelCode: '',
        src: 'setting/ic-box-3color.svg',
        type: LOCAL_BUTTON_TYPES.IMAGE,
        action: CONTROL_TOP_ACTIONS.EXPORT
      },
      {
        alwayShow: false,
        labelCode: '',
        src: ICON_CLASS.MOVE_CATEGORY,
        type: LOCAL_BUTTON_TYPES.ICON,
        action: CONTROL_TOP_ACTIONS.MOVE_CATEGORY
      },
      {
        alwayShow: false,
        labelCode: '',
        src: ICON_CLASS.DELETE,
        type: LOCAL_BUTTON_TYPES.ICON,
        action: CONTROL_TOP_ACTIONS.DELETE_CATEGORY
      },
      {
        alwayShow: false,
        labelCode: '',
        src: ICON_CLASS.IMPORT,
        type: LOCAL_BUTTON_TYPES.ICON,
        action: CONTROL_TOP_ACTIONS.IMPORT
      }
    ],
    search: {
      isSearchDetail: false
    }
  }
};
