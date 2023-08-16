import { React, useEffect, useState } from 'react'
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch' 
import {
  Page,
  Layout,
  LegacyCard,
  Button,
  Text,
  DataTable
} from '@shopify/polaris'
import Counters from '../components/Counters'


function MyComponent() {
  const [Qrcodes, setQRcodes] = useState([])
  const [QrCodePoints, setQrCodePoints] = useState([])

  const fetch = useAuthenticatedFetch()

  useEffect(() => {

    const fetchCodes = async () => {
      const method = 'GET'

      const response = await fetch('/api/qrcodes', {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
      })

      /* const responsePoints = await fetch('/api/loyaltypoints', {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
        }) */

      const data = await response.json()
      //const points = await responsePoints.json()

      setQrCodePoints(data.qrCodeLoyaltyPoints)
      setQRcodes(data.qrCodes)
    }

    fetchCodes()
  }, [])

  return (
    <Page
      backAction={{content: 'Settings', url: '/#'}}
      title='QR Code Points'
    >
      <Layout>
        <Layout.Section>
          <LegacyCard title='Add loyalty points' sectioned>
            <Text variant="headingMd" as="p">
              Change the amount of points for each QR Code
            </Text>
          </LegacyCard>

          <LegacyCard title='QR Codes' sectioned>
            {
              Qrcodes.length === 0 ?
              <Text variant="headingMd" as="p">
              There are no QR codes
              </Text>
              :
              <DataTable
              columnContentTypes={['text', 'text']}
              headings={['QR Codes', 'Add/Remove Points']}
              rows={Qrcodes.map((qrCodes) => {
                console.log(QrCodePoints)
                let loyalPoints = QrCodePoints.find((pointsDB) => pointsDB.qrCodeID === qrCodes.id)
                
                if (loyalPoints) {
                  let {points} = loyalPoints

                  return [
                    qrCodes.title,
                    <Counters
                    points = {points}
                    qrCodeID={qrCodes.id}
                    />
                  ]
                }

                return [
                  qrCodes.title,
                  <Counters
                  points = {0}
                  qrCodeID={qrCodes.id}
                  />
                ]
                
              })} 
              />

            }
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  )

}

export default MyComponent