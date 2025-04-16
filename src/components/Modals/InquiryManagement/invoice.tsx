import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Font,
} from "@react-pdf/renderer"
import dayjs from "dayjs"
import montserratRegular from "@assets/fonts/Montserrat-Regular.ttf"
import montserratBold from "@assets/fonts/Montserrat-Bold.ttf"
import montserratSemiBold from "@assets/fonts/Montserrat-SemiBold.ttf"

Font.register({
    family: "Montserrat",
    fonts: [
        { src: montserratRegular, fontWeight: 400 },
        { src: montserratBold, fontWeight: 700 },
        { src: montserratSemiBold, fontWeight: 600 },
    ],
})

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#fff",
        padding: "20px 20px",
        // "@media max-width: 768": {
        //     padding: "40px 10px",
        // },

        width: "100%",
        fontFamily: "Montserrat",
        fontWeight: 700,
    },
    headerView: {
        flexDirection: "row",
        backgroundColor: "#EBEDF2",
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,
    },
    header: {
        fontSize: 24,
        marginBottom: 10,
        textAlign: "center",
        fontWeight: 700,
    },
    headerLabel: {
        color: "#1A1C21",
        fontSize: 12,
        fontWeight: 600,
    },
    headerValue: {
        color: "#5E6470",
        fontWeight: 600,
        fontSize: 12,
    },
    wrapper: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 10,
        width: "100%",
    },
    toWrapper: {
        backgroundColor: "#EBEDF2",
        borderRadius: 20,
        padding: 10,
    },
    label: { fontWeight: 600, fontSize: 10, color: "#1A1C21" },
    value: {
        fontWeight: 400,
        color: "#5E6470",
        fontSize: 10,
    },
    row: {
        flexDirection: "row",
        borderBottomColor: "#FFFFFF",
        borderBottomWidth: 2,
        paddingVertical: 10,
    },
    serviceLabel: {
        width: "50%",
        color: "#1A1C21",
        fontSize: 10,
        fontWeight: 600,
    },
    qtyLabel: {
        width: "15%",
        color: "#1A1C21",
        fontSize: 10,
        fontWeight: 600,
    },
    rateLabel: {
        width: "15%",
        color: "#1A1C21",
        fontSize: 10,
        fontWeight: 600,
    },
    lineLabel: {
        color: "#1A1C21",
        fontSize: 10,
        fontWeight: 600,
    },
    subTotal: {
        color: "#1A1C21",
        fontSize: 10,
        fontWeight: 600,
        width: "60%",
    },
    service: {
        width: "50%",
        color: "#5E6470",
        fontSize: 10,
    },
    qty: {
        width: "15%",
        color: "#5E6470",
        fontSize: 10,
    },
    rate: {
        width: "15%",
        color: "#5E6470",
        fontSize: 10,
    },
    line: {
        width: "15%",
        color: "#5E6470",
        fontSize: 10,
    },
})
export interface InvoicePDFProps {
    clientName: string
    clientEmail: string
    clientLocation: string
    clientPhoneNumber: string
    eventType: string
    eventDate: string
    fees: string
    billOption: string
    logisticInformation: string
    logisticsFee: string
    accountNumber: string
    accountName: string
    bankName: string
    additionalTC: string
    totalFee: string

    // MANAGER
    fullName: string
    phoneNumber: string
    address: string
    email: string
}
const InvoicePDF = ({
    clientName,
    clientEmail,
    clientLocation,
    clientPhoneNumber,
    eventType,
    eventDate,
    fees,
    billOption,
    logisticInformation,
    logisticsFee,
    accountNumber,
    accountName,
    bankName,
    additionalTC,
    totalFee,
    fullName,
    phoneNumber,
    address,
    email,
}: InvoicePDFProps) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View
                    style={[
                        styles.headerView,
                        { justifyContent: "space-between" },
                    ]}
                >
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.headerLabel}>
                            {fullName} Invoice
                        </Text>
                        {/* <Text style={styles.headerValue}>#AB2324-01</Text> */}
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.headerLabel}>Date</Text>
                        <Text style={styles.headerValue}>
                            {" "}
                            {dayjs(new Date()).format("DD MMM, YYYY")}
                        </Text>
                    </View>
                </View>
                <View style={styles.wrapper}>
                    <View style={[styles.toWrapper, { width: "50%" }]}>
                        <Text style={[styles.label, { paddingBottom: 4 }]}>
                            To
                        </Text>{" "}
                        <Text style={[styles.label, { paddingBottom: 2 }]}>
                            {clientName}
                        </Text>{" "}
                        <Text style={[styles.value, { paddingBottom: 2 }]}>
                            {clientLocation}
                        </Text>
                        <Text style={[styles.value, { paddingBottom: 2 }]}>
                            {clientEmail}
                        </Text>
                        <Text style={[styles.value, { paddingBottom: 2 }]}>
                            {clientPhoneNumber}
                        </Text>
                    </View>
                    <View style={[styles.toWrapper, { width: "50%" }]}>
                        <Text style={[styles.label, { paddingBottom: 4 }]}>
                            From
                        </Text>{" "}
                        <Text style={[styles.label, { paddingBottom: 2 }]}>
                            {fullName}
                        </Text>{" "}
                        <Text style={styles.value}>{address}</Text>
                    </View>
                </View>
                <View style={styles.headerView}>
                    <Text
                        style={{
                            color: "#E9AF00",
                            fontWeight: 700,
                            fontSize: 14,
                        }}
                    >
                        {totalFee}
                    </Text>{" "}
                    <Text
                        style={{
                            color: "#5E6470",
                            fontWeight: 500,
                            fontSize: 14,
                        }}
                    >
                        {" "}
                        due on {dayjs(eventDate).format("DD MMM, YYYY")}
                    </Text>
                </View>
                <View style={[styles.toWrapper, { marginBottom: 10 }]}>
                    <View style={styles.row}>
                        <Text style={styles.serviceLabel}>Service</Text>
                        <Text style={styles.qtyLabel}>Qty</Text>
                        <Text style={styles.rateLabel}>Rate</Text>
                        <Text style={styles.lineLabel}>Line Total</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.service}>
                            {eventType} . {dayjs(eventDate).format("D/MM/YY")}
                        </Text>
                        <Text style={styles.qty}>{billOption}</Text>
                        <Text style={styles.rate}>{fees}</Text>
                        <Text style={styles.line}>{fees}</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.serviceLabel}>
                            <Text style={styles.serviceLabel}>Logistics</Text>
                            <Text style={styles.service}>
                                {logisticInformation}
                            </Text>
                        </View>

                        <Text style={styles.qty}>{billOption}</Text>
                        <Text style={styles.rate}>{logisticsFee}</Text>
                        <Text style={styles.line}>{logisticsFee}</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                        }}
                    >
                        <Text style={styles.service}></Text>
                        <View
                            style={{
                                flexDirection: "row",
                                borderBottomColor: "#FFFFFF",
                                borderBottomWidth: 2,
                                paddingVertical: 10,
                                width: "50%",
                            }}
                        >
                            <Text style={styles.subTotal}>Subtotal</Text>

                            <Text style={styles.line}>{totalFee}</Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                        }}
                    >
                        <Text style={styles.service}></Text>
                        <View
                            style={{
                                flexDirection: "row",
                                borderBottomColor: "#FFFFFF",
                                borderBottomWidth: 2,
                                paddingVertical: 10,
                                width: "50%",
                            }}
                        >
                            <Text style={styles.subTotal}>Tax(0%)</Text>

                            <Text style={styles.line}>₦0</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                        }}
                    >
                        <Text style={styles.service}></Text>
                        <View
                            style={{
                                flexDirection: "row",
                                borderBottomColor: "#FFFFFF",
                                borderBottomWidth: 2,
                                paddingVertical: 10,
                                width: "50%",
                            }}
                        >
                            <Text style={styles.subTotal}>Total</Text>

                            <Text style={styles.line}>{totalFee}</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",

                            paddingBottom: 100,
                        }}
                    >
                        <Text style={styles.service}></Text>
                        <View
                            style={{
                                flexDirection: "row",
                                width: "50%",
                                paddingVertical: 10,
                            }}
                        >
                            <Text style={styles.subTotal}>Amount due</Text>

                            <Text style={styles.lineLabel}>{totalFee}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.wrapper}>
                    <View
                        style={[
                            styles.toWrapper,
                            { width: "50%", justifyContent: "flex-end" },
                        ]}
                    >
                        <Text style={[styles.label, { paddingBottom: 5 }]}>
                            Thank you for the business!
                        </Text>
                        <Text style={styles.value}>{additionalTC}</Text>
                    </View>
                    <View style={[styles.toWrapper, { width: "50%" }]}>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <View>
                                <Text
                                    style={[styles.label, { paddingBottom: 5 }]}
                                >
                                    Bank details
                                </Text>
                                <Text
                                    style={[styles.label, { paddingBottom: 5 }]}
                                >
                                    Account Name
                                </Text>
                                <Text
                                    style={[styles.label, { paddingBottom: 5 }]}
                                >
                                    Account Number
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={[styles.value, { paddingBottom: 5 }]}
                                >
                                    {bankName}
                                </Text>
                                <Text
                                    style={[styles.value, { paddingBottom: 5 }]}
                                >
                                    {accountName}
                                </Text>
                                <Text
                                    style={[styles.value, { paddingBottom: 5 }]}
                                >
                                    {accountNumber}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View
                    style={[
                        styles.toWrapper,
                        {
                            flexDirection: "row",
                            justifyContent: "space-between",
                        },
                    ]}
                >
                    <Text style={styles.headerValue}>
                        {fullName} Professional Invoice
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text
                            style={[styles.headerValue, { paddingRight: 18 }]}
                        >
                            {phoneNumber}
                        </Text>
                        <Text style={styles.headerValue}>{email}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
}

export default InvoicePDF
