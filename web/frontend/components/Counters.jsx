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
    const [loyaltyPoints, setLoyaltyPoints] = useState(points)

    const fetch = useAuthenticatedFetch()
    
    // subract loyalty points -- don't allow below zero
    const subtractPoints = () => {
        if (loyaltyPoints > 0) {
            setLoyaltyPoints(loyaltyPoints - 1)
        }
    }

    const onSave = () => {
        const fetchPost = async () => {
            const response = await fetch (`/api/loyaltypoints?host=${window.__SHOPIFY_DEV_HOST}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({qrCodeID, loyaltyPoints})
            })
            const data = await response.json()
            console.log(data)
        }
        fetchPost()
    }

    return (
        <HorizontalGrid gap="4">
            <Text>
                Loyalty points: {loyaltyPoints}
            </Text>
            <ButtonGroup>
                <Button onClick={() => setLoyaltyPoints(loyaltyPoints + 1)}>+</Button>
                <Button onClick={subtractPoints}>-</Button>
                <Button primary onClick={onSave}>Save</Button>
                <Button>update</Button>
                <Button>delete</Button>
            </ButtonGroup>
        </HorizontalGrid>
    )
}

export default Counters