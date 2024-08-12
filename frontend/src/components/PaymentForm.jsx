import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Button, FormControl, FormLabel, Text } from '@chakra-ui/react';

// Get publishable key from your dashboard
const stripePromise = loadStripe('pk_test_51PlYaqKXs5h2fewWaIz7S7n5kKuJkA5CXRVSyUhmyZhNFX6G5DGSWZwjlcwCfn5C4tD0ZAjB9GBL5wLo6JvGSd5900an5iRdzS');

const CheckoutForm = ({ totalAmount, user_id, event_id }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const response = await fetch('http://localhost:5000/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: totalAmount * 100 }), // Amount should be in the lowest denomination (For USD thats cents)
    });

    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Test User',
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        purchaseTicket()

        setTimeout(() => {
          navigate('/events')
        }, 5000);
      }
    }
  };

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
          duration: 1500,
          isClosable: true
      });

      setTimeout(() => {
          navigate('/events')
      }, 1500);
    } catch (error) {
      console.error('Error purchasing: ', error);
      toast({
          title: 'Purchase failed',
          description: 'Error processing your purchase. Try again later.',
          status: 'error',
          duration: 1500,
          isClosable: true
      })
    }

  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <FormControl mb={4}>
        <FormLabel>Total Amount</FormLabel>
        <Text fontSize="xl">${totalAmount}</Text>
      </FormControl>
      <FormControl>
        <FormLabel>Card Details</FormLabel>
        <CardElement />
      </FormControl>
      <Button mt={4} colorScheme="blue" type="submit" disabled={!stripe}>
        Pay
      </Button>
      {paymentSuccess && <Text mt={4} color="green.500">Payment Successful!</Text> }
      {error && <Text mt={4} color="red.500">{error}</Text>}
    </Box>
  );
};

const PaymentForm = ({ totalAmount, event_id, user_id }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm totalAmount={totalAmount} event_id={event_id} user_id={user_id} />
  </Elements>
);

export default PaymentForm;