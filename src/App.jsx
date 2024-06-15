import {PDFDownloadLink} from '@react-pdf/renderer'
/* import MyDocument from './reports/MyDocument' */
import Pilares from './reports/Pilares'

function App() {
  return (
    <>
      <h1>Hola mundo!</h1>
      <PDFDownloadLink document={<Pilares />} fileName='Kimetsu_Pilares.pdf'>
          {({loading})=>
            loading ? <button>Cargando...</button> : <button>Descargar</button>
          }
      </PDFDownloadLink>
    </>
  )
}

export default App
