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
/* import Counters from '../components/Counters' */


function MyComponent() {

  const fetch = useAuthenticatedFetch()

  useEffect(() => {

    const fetchCodes = async () => {
      const method = 'GET'

      const response = await fetch('/api/qrcodes', {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
      })

      if(response.ok) {
        const data = await response.json()

        
      }
    }
  })

  return (
    <Page
      backAction={{content: 'Settings', url: '/#'}}
      title='QR Code Points'
    >
      <Layout>
        <Layout.Section>
          <LegacyCard title='Add loyalty points' sectioned>
            <Text variant="headingMd" as="p">
              Test Text
            </Text>
          </LegacyCard>

          <LegacyCard title='QR Codes' sectioned>
            <Text variant="headingMd" as="p">
              QR Test
            </Text>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  )

}

export default MyComponent