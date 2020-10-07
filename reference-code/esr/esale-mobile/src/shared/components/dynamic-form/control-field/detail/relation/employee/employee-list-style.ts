import { StyleSheet } from 'react-native';

export const EmployeeListItemStyles = StyleSheet.create({
  inforEmployee: {
    backgroundColor: "#FFFFFF",
    marginBottom: 2,
    paddingVertical: 15,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    marginHorizontal: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    borderRadius: 25
  },
  cellWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconArrowRight: {
    width: 30,
    height: 30,
    justifyContent: 'center',
  },
  title: {
    color: '#666666',
    fontWeight: '400',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  checkedIcon: {
    width: 20,
    height: 20,
  }
});

export const EmployeeListScreenStyles = StyleSheet.create({
  container: {
    flex: 1
  },
  inforBlock: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 17,
    paddingVertical: 21,
  },
  title: {
    fontSize: 19,
  },
  subTitle: {
    marginTop: 10,
    color: '#333333',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  date: {
    flexDirection: 'row',
    fontSize: 10,
  },
  iconBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listEmployee: {
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#00CCAF',
    paddingBottom: 4,
    borderRadius: 28,
    elevation: 4,
  },
  contentContainerStyle: { paddingBottom: 120 },
  contentContainerEditStyle: { paddingBottom: 180 },
  fabIcon: {
    fontSize: 40,
    color: 'white',
  },
  wrapBottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    elevation: 4,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  titleBottom: {
    color: "#0F6DB5",
  },
  bottomView: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  mainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  employeeContainer: {
    flexDirection: 'row'
  },
  link: {
    color: '#0F6DB5',
  },
  labelHeader: {
    color: '#333333',
    fontWeight:"bold"
  }
});
