import React from 'react';
import { Grid, GridItem, Flex, Box, VStack, Spacer, Button, Image, Text, Stack, HStack, Container, Center } from '@chakra-ui/react';

function Checkout({selectedSeats, totalPrice, event_id, user_id}) {
    const handlePurchase = () => {
        console.log('Purchasing tickets:', selectedSeats);

    };

    return (
        <Flex>
            <Text>Event Id: {event_id}</Text>
            <Button onClick={handlePurchase}>Buy Tickets</Button>
        </Flex>
    )
}

export default Checkout;