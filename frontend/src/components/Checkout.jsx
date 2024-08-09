import React from 'react';
import { Grid, useToast, GridItem, Flex, Box, VStack, Spacer, Button, Image, Text, Stack, HStack, Container, Center } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import PaymentForm from './PaymentForm';

function Checkout({ isOpen, onClose, value, event_id, user_id }) {
    const toast = useToast();
    const navigate = useNavigate();
    const OverlayOne = () => (
        <ModalOverlay
          backdropFilter='blur(5px)'
        />
      )
      const overlay = <OverlayOne />
  

    const purchaseTicket = async () => {

        try {
            const response = await fetch(`http://localhost:5000/inventory/buy/${user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event_id
                }),
            });
            await response.json();

            toast({
                title: 'Purchase successful!',
                description: 'Your tickets have been booked. You will be rerouted to events page.',
                status: 'success',
                duration: 5000,
                isClosable: true
            });

            setTimeout(() => {
                navigate('/events')
            }, 5000);
        } catch (error) {
            console.error('Error purchasing: ', error);
            toast({
                title: 'Purchase failed',
                description: 'Error processing your purchase. Try again later.',
                status: 'succerroress',
                duration: 5000,
                isClosable: true
            })
        }

    };



    return (
        <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
            {overlay}
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Checkout</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    {/* <Text>Total Price: ${value}</Text> */}
                    <PaymentForm value={value}/>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={purchaseTicket}>
                        Purchase
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default Checkout;