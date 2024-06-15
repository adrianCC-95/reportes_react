import { StyleSheet, Image,View, Text, Page, Document } from '@react-pdf/renderer'
import LogoReact from '../assets/descarga.png'

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#fff",
        padding: "4px",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },

    parrafo: {
        fontSize: '11px',
        textAlign: 'justify'
    },

    section:{
        width: '80%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2',
        flexDirection: 'column'
    },

    logo:{
        width: '100px',
        height: '100px',
        objectFit: 'cover'
    }
});

export default function MyDocument() {
    return (
        <Document>
            <Page size={"A4"} style={styles.page}>
                <View style={styles.section}>
                    <Image src={LogoReact} style={styles.logo}/>
                <Text style={styles.parrafo}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, consequuntur.</Text>
                </View>
            </Page>
        </Document>
    )
}
