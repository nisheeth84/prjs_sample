import { StyleSheet } from "react-native";
import { theme } from "../../config/constants";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
        paddingHorizontal: "3%",
        paddingTop: 10
    },
    appbarCommonStyle: {
        backgroundColor: theme.colors.gray400,
    },
    safeContainer: { flex: 1 },
    titleHeader: { fontWeight: "bold", color: "#333333" },
    content: {
        width: "100%",
        alignItems: "center",
    },
    txtTitle: {
        color: "#333333",
        fontSize: 18,
        marginVertical: 15,
        fontWeight: "bold",
        letterSpacing: 1,
    },
    txtContent: {
        color: "#333333",
        fontSize: 14,
        letterSpacing: 1,
        lineHeight: 20,
    },
    txtContent2: {
        color: "#333333",
        fontSize: 14,
        letterSpacing: 1,
        lineHeight: 20,
        marginTop: 20,
    },
    video: {
        width: "100%",
        height: 200,
        backgroundColor: "#cdcdcd",
        marginVertical: 30
    },
    videoContainer: {
        flex: 1
    },
    solution: {
        width: "100%",
        height: 300,
        borderColor: "#E5E5E5",
        borderWidth: 1,
        alignItems: "center",
        borderTopColor: "#fff",
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        marginBottom: 30,
    },
    titleSolution: {
        width: "100%",
        height: 50,
        backgroundColor: "#D8F2E5",
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginTop: 0,
    },
    txtTitleSolution: { fontSize: 15, color: "#333333", fontWeight: "bold" },
    txtContentSolution: {
        fontSize: 12,
        letterSpacing: 1,
        lineHeight: 20,
        width: "92%",
        marginTop: 8,
    },
    imgSolution: { height: 140, marginTop: 15 },
    btnSolution: {
        width: "92%",
        height: 50,
        borderColor: "#E5E5E5",
        borderWidth: 1,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },
    txtBtnSolution: { color: "#333333", fontSize: 16, fontWeight: "bold" },
    img: {
        width: "100%",
        alignItems: "center"
    },
    imgLogo: {
        width: 150,
        height: 150 * 328 / 864
    },
});

export const stylesStart = StyleSheet.create({
    safe: { flex: 1 },
    appBar: { fontWeight: "bold", color: "#333333" },
    container: {
        width: "100%",
        alignItems: "center",
        height: "100%",
        paddingTop: "30%",
        backgroundColor: "#e9f0f7",
    },
    title: { color: "#0F6DB5", fontSize: 18, fontWeight: "bold" },
    content: {
        fontWeight: "400",
        fontSize: 14,
        lineHeight: 20,
        marginTop: 20,
        width: "70%",
        color: theme.colors.black,
        textAlign: 'center',
        marginBottom: 20
    },
    btn: {
        width: "70%",
        height: 40,
        backgroundColor: "#0F6DB5",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        marginTop: 20,
    },
    btnTxt: { color: "#fff", fontWeight: "bold" },
    checkBox: { marginTop: 20 },
    box: { backgroundColor: "white" }
});

export const stylesProceed = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: "3%",
        paddingTop: 10,
        backgroundColor: "#e9f0f7",
    },
    safe: { flex: 1 },
    appBar: { fontWeight: "bold", color: "#333333" },
    topContent: { width: "100%", alignItems: "center" },
    topContentTitle: { marginVertical: 10, fontSize: 18, fontWeight: "bold" },
    topContentTxt: {
        fontSize: 14,
        color: "#333333",
        marginVertical: 10,
        lineHeight: 20,
    },
    formRegister: {
        width: "95%",
        height: 250,
        backgroundColor: theme.colors.white,
        borderRadius: 10,
        alignItems: "center",
        paddingHorizontal: "10%",
        marginHorizontal: "2.5%",
    },
    titleNumber: {
        fontSize: 55,
        color: "#e9f0f7",
        fontWeight: "bold",
        marginVertical: 8,
    },
    titleRegister: { color: "#0F6DB5", fontSize: 18, fontWeight: "bold" },
    txtRegister: {
        fontWeight: "400",
        fontSize: 14,
        lineHeight: 20,
        marginTop: 12,
        color: theme.colors.black,
    },
    imgRegister: { width: "100%", height: 60, marginTop: 10 },
    experience: {
        width: "95%",
        height: 250,
        backgroundColor: theme.colors.white,
        borderRadius: 10,
        alignItems: "center",
        paddingHorizontal: "10%",
        marginTop: 20,
        marginHorizontal: "2.5%",
    },
    btnExperience: {
        width: "100%",
        height: 40,
        marginTop: 20,
    },
    btnExperienceTxt: { color: "#fff", fontWeight: "bold" },
    up: {
        width: "95%",
        height: 250,
        backgroundColor: theme.colors.white,
        borderRadius: 10,
        alignItems: "center",
        paddingHorizontal: "10%",
        marginVertical: 20,
        marginHorizontal: "2.5%",
    },
    txtUp: {
        color: "#0F6DB5",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
    },
});
