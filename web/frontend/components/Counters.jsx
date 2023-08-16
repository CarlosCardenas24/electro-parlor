import {React, useState, useEffect} from "react";
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
    const [show, setShow] = useState(false)

    const fetch = useAuthenticatedFetch()

    useEffect(() => {
        if (loyaltyPoints) {
            setShow(true)
        }
      }, [])
    
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
                },
                body: JSON.stringify({qrCodeID, loyaltyPoints})
            })
            const data = await response.json()
            console.log(data)
        }
        fetchPost()
        setShow(true)
    }

    const onUpdate = () => {
        const fetchUpdate = async () => {
            const response = await fetch (`/api/loyaltypoints/${qrCodeID}?host=${window.__SHOPIFY_DEV_HOST}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({loyaltyPoints})
            })
            const data = await response.json()
            console.log(data)

            if (loyaltyPoints === 0) {
                onDelete()
            }
        }
        fetchUpdate()
    }

    const onDelete = () => {
        const fetchDelete = async () => {
            const response = await fetch (`/api/loyaltypoints/${qrCodeID}?host=${window.__SHOPIFY_DEV_HOST}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({loyaltyPoints})
            })
            const data = await response.json()
            console.log(data)
        }
        fetchDelete()
        setLoyaltyPoints(0)
        setShow(false)
    }

    return (
        <HorizontalGrid gap="4">
            <Text>
                Loyalty points: {loyaltyPoints}
            </Text>
            <ButtonGroup>
                <Button onClick={() => setLoyaltyPoints(loyaltyPoints + 1)}>+</Button>
                <Button onClick={subtractPoints}>-</Button>
                {!show ? 
                    <Button primary onClick={onSave}>Save</Button>
                :
                    <ButtonGroup>
                        <Button onClick={onUpdate}>update</Button>
                        <Button onClick={onDelete}>delete</Button>
                    </ButtonGroup>
                }
                
            </ButtonGroup>
        </HorizontalGrid>
    )
}

export default Counters