import {React, useState} from "react";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";
import { 
    ButtonGroup, 
    Button, 
    Text, 
    HorizontalGrid
} from "@shopify/polaris";
import { show } from "@shopify/app-bridge/actions/ContextualSaveBar";

function Counters({qrCodeID, points}) {
    const [loyaltyPoints, setLoyaltyPoints] = useState()
    const fetch = useAuthenticatedFetch()

    // get a successful request to the api
    const onSave = () => {
        const fetchPost = async () => {
            const method = 'POST'

            const response = await fetch(`/api/loyaltypoints?${window.__SHOPIFY_DEV_HOST}`, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            console.log(data)
        }
        fetchPost()
    }

    return (
        <HorizontalGrid gap="4">
            <Text>
                Loyalty points: 0
            </Text>
            <ButtonGroup>
                <Button>+</Button>
                <Button>-</Button>
                <Button primary onClick={onSave}>Save</Button>
                <Button>update</Button>
                <Button>delete</Button>
            </ButtonGroup>
        </HorizontalGrid>
    )
}

export default Counters