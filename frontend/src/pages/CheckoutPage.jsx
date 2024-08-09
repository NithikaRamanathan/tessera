import React, { useEffect, useState } from 'react';
import { Text, Grid, GridItem, Button } from '@chakra-ui/react';


function CheckoutPage(user_id) {
    const [value, setValue] = useState();
    useEffect(() => {
        fetch(`http://localhost:5000/inventory/buy/${user_id}`, { credentials: 'include' })
            .then(response => response.json())
            .then(setValue)
            .catch(error => console.error('Error fetching events:', error));
    }, []);

    return (

        <Grid p='80px' bg='pink'>
            <Text>this is checkout page</Text>
            {value}

            <Button> Buy tickets</Button>

        </Grid>
    );
}

export default CheckoutPage;