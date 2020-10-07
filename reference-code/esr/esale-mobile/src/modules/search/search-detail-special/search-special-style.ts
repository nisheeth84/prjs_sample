import { StyleSheet } from "react-native";

export const ProductTradingSpecialStyle = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        paddingRight: 5,
      },
      inputDays: {
        height: 40,
        textAlign: 'left',
        borderRadius: 12,
        borderColor: '#E5E5E5',
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        flex: 1,
        marginRight: 16,
      }
})