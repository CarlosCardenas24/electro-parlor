import {React, useState} from "react";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";
import { 
    ButtonGroup, 
    Button, 
    Text, 
    HorizontalGrid
} from "@shopify/polaris";
import { show } from "@shopify/app-bridge/actions/ContextualSaveBar";

function Counters() {
    return (
        <HorizontalGrid gap="4">
            <Text>
                Loyalty points: 0
            </Text>
            <ButtonGroup>
                <Button>+</Button>
                <Button>-</Button>
                <Button primary>Save</Button>
                <Button>update</Button>
                <Button>delete</Button>
            </ButtonGroup>
        </HorizontalGrid>
    )
}

export default Counters