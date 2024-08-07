import React, { useEffect, useState } from 'react';
import { Grid, GridItem, Flex, Box, VStack, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Image, Text } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import SeatPicker from '../components/SeatPicker';


function EventIdCard({ id, time, name, date, location, imageUrl, description }) {
  const text = useColorModeValue('white', 'gray.700');
  const { colorMode, toggleColorMode } = useColorMode();
  const color = useColorModeValue('blue.500', 'blue.400');

  const [userId, setUserId] = useState("")

  //   fetch(`http://localhost:5000/users/account_info`, {
  //     method: 'GET',
  //     credentials: 'include',
  //     headers: {
  //         'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({

  // //                 row_name = request.json.get('row_name')
  // // seat_number = request.json.get('seat_number')
  // // event_id = request.json.get('event_id')
  //     })
  //     .then(setUser)
  // })
  useEffect(() => {
    fetch(`http://localhost:5000/users/current`, { credentials: 'include' })
      .then(response => response.json())
      .then(data => setUserId(data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);


  return (
    <Grid
      h='100vh'
      marginTop='78px'
      justifyContent='center'
      templateColumns='repeat(11,1fr)'
      templateRows='repeat(9, 1fr)'
    >
      <GridItem bg='gray' rowSpan={3} colSpan={11}>

     current user id: {userId}

     
      </GridItem>
      <GridItem bg='pink' rowSpan={4} colSpan={1} />

      <GridItem rowSpan={1} bg='blue.300' colSpan={9}>
        <Flex>date, time, price range</Flex>
      </GridItem>
      <GridItem rowSpan={4} colSpan={1} bg='purple' />

      <GridItem rowSpan={3} bg='red.300' colSpan={6}>
        <Flex>event description</Flex>


        <SeatPicker

          event_id={id}
          user_id={userId}

        />
      </GridItem>
      <GridItem rowSpan={3} bg='pink.200' colSpan={3}>
        <Flex>location</Flex>
        <Flex> button to buy ticket</Flex>
      </GridItem>




      <GridItem bg='gray' rowSpan={1} colSpan={11}></GridItem>

    </Grid>

    // <VStack marginTop='80px' display={{ md: 'flex' }} alignItems='baseline'>
    //   <HStack display={{ md: 'flex' }} bg='white' p='3' width='100%'>

    //     <Box flexShrink={0}>
    //       {imageUrl && (
    //         <Image
    //           borderRadius="lg"
    //           width={{ md: 80 }}
    //           src={imageUrl}
    //           alt={`Image for ${name}`}
    //         />
    //       )}
    //     </Box>

    //     <Box ml={{ md: 4 }} alignSelf={'start'}>
    //       <Text
    //         fontWeight='bold'
    //         textTransform='uppercase'
    //         fontSize='lg'
    //         letterSpacing='wide'
    //         color='blue.500'
    //       >
    //         {name}
    //       </Text>
    //       <Text
    //         mt={1}
    //         display='block'
    //         fontSize='md'
    //         lineHeight='normal'
    //         color='black'
    //       >
    //         Event Details
    //       </Text>
    //       <Text mt={2} color='gray.600'>
    //         {description}
    //       </Text>
    //     </Box>
    //   </HStack>

    //   <HStack>
    //     <Box>
    //       {/* {imageUrl && (
    //         <Image 
    //         width={{ md: 700 }}
    //         src='https://www.unitedcenter.com/assets/1/7/concert_floor_seating.jpg'
    //         alt={`Image for Seating Chart`}
    //         />
    //       )} */}
    //     </Box>
    //     <Box>
    //         <SeatPicker
    //           event_id = {id}
    //         />
    //     </Box>
    //   </HStack>



    // </VStack>
  );
}

export default EventIdCard;