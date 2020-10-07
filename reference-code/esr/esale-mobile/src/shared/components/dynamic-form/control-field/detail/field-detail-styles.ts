import { StyleSheet } from "react-native";
import { theme } from "../../../../../config/constants";
/**
 * Define text field styles in detail case
 */
export const FieldDetailTextStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  value: {
    color: "#666666",
  }
})

/**
 * Define email field styles in detail case
 */
export const FieldDetailLinkStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  link: {
    color: theme.colors.blue200,
  }
})

export const FieldDetailEmailStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  email: {
    color: theme.colors.blue200,
  }
})

export const FieldDetailTimeStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  textColorTime: {
    color: "#666666",
  },
})

export const FieldDetailTitleStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  container: {
    display: 'flex',
    flexDirection: 'row'
  },
  header: {
    backgroundColor: '#0F6DB5',
    paddingRight: 4,
    marginRight: 5
  }
})

export const FieldDetailTabStyles = StyleSheet.create({
  tabLabelContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 20
  },
  colorContainer: {
    backgroundColor: '#0F6DB5',
    paddingRight: 4,
    marginRight: 5
  },
  tabLabel: {
    color: '#333333',
    fontWeight: 'bold'
  },
  touchableContainer: {
    borderColor: '#E5E5E5',
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  infoContainer: {
    width: '95%',
    padding: 15
  },
  textLabel: {
    color: '#666666'
  },
  iconContainer: {
    alignContent: 'center',
    justifyContent: 'center'
  },
  inforComponent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  }

})
export const FieldDetailFileStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold',
  },
  content: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  fileName: {
    color: '#0F6DB5',
    fontWeight: 'bold',
  },
  thumbnail: {
    height: 50,
    width: 50,
    paddingRight: 10
  },
  thumbnailAnimated: {
    flex: 1
  },
  thumbnailView: {
    position: 'absolute'
  },
  closeIcon: {
    zIndex: 2,
    position: 'absolute',
    right: 10,
    top: 20
  }
})

export const FieldDetailRelationStyles = StyleSheet.create({
  textColorTime: {
    color: "#666666",
  },
  padding10: {
    padding: 10
  },
})

export const FieldDetailTextAreaStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  textDefault: {
    color: '#666666',
    lineHeight: 24,
  },
  link: {
    color: theme.colors.blue200,
  }
})

export const FieldDetailOrganizationStyles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  itemContainer: {
    flexDirection: 'row'
  },
  itemText: {
    color: '#0F6DB5'
  },
  textColor: {
    fontWeight: 'bold',
    color: '#333333'
  }
})

export const FieldDetailDateTimeStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  textColorDateTime: {
    color: '#666666',
  }
})

export const FieldDetailAddressStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  addressDetail: {
    color: "#666666",
  }
})

export const FieldDetailCalculationStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: "bold"
  },
  mumberValue: {
    color: '#666666',
    textAlign: 'right',
  }
})

export const FieldDetailNumericStyles = StyleSheet.create({
  viewValue: {
    display: 'flex',
    flexDirection: 'row',
  },
  right: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  value: {
    textAlign: 'right',
    color: '#666666'
  }
})

export const FieldDetailCheckboxStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  value: {
    color: "#666666",
  }
})

export const FieldDetailDateStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  value: {
    color: "#666666",
  }
})

export const FieldDetailPhoneNumberStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  value: {
    color: "#666666",
  }
})

export const FieldDetailPulldownMultiStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  value: {
    color: "#666666",
  }
})

export const FieldDetailPulldownSingleStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  value: {
    color: "#666666",
  }
})

export const FieldDetailRadioStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  value: {
    color: "#666666",
  }
})
