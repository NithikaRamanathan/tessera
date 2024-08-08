import React, { useEffect, useState } from 'react';
import { Grid, GridItem, Flex, Box, VStack, Spacer, Button, Image, Text, Stack, HStack, Container, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import SeatPicker from '../components/SeatPicker';
import { CalendarIcon, TimeIcon } from '@chakra-ui/icons';
import { MdOutlineShoppingCartCheckout } from "react-icons/md";


function EventIdCard({ id, time, name, date, location, imageUrl, description }) {
  const text = useColorModeValue('white', 'gray.700');
  const { colorMode, toggleColorMode } = useColorMode();
  const color = useColorModeValue('blue.500', 'blue.400');

  const [userId, setUserId] = useState("")

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
      <GridItem rowSpan={4} bg='gray' colSpan={11}>

        {/* current user id: {userId} */}
        <Box
          position="relative"
          // h={80}
          // bgImage="url('https://www.utep.edu/extendeduniversity/utepconnect/blog/june-2019/how-an-online-degree-can-prepare-you-for-remote-positions.jpg')"

          bgImage="url('https://wallpapers.com/images/hd/phineas-and-ferb-across-2d-1xf62nz0k0oyan1a.jpg')"
          bgSize="cover"
          bgPosition="center"
          bgRepeat="no-repeat"
          left={0}
          right={0}
          width="100vw"
          maxWidth="100%"
          h='100%'
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            bg="black"
            opacity={0.7}
          // bgBlendMode="multiply"
          />
          <Center
            position="relative"
            zIndex={1}
            textAlign="center"
            display="flex"
            justifyContent="center"
            minH={80}
          >
            <Text as="b" fontSize="4xl">
              {name}
            </Text>
          </Center>
        </Box>

      </GridItem>
      <GridItem bg='pink' rowSpan={4} colSpan={1} />

      <GridItem p='15px' alignContent='center' rowSpan={1} colSpan={9}>
        {/* <Flex>date, time, price range</Flex> */}
        <HStack>
          <Stack >
            <Text><CalendarIcon /> {date}</Text>
            <Text><TimeIcon /> {time}</Text>
          </Stack>
          <Text>lalala</Text>
        </HStack>


      </GridItem>
      <GridItem rowSpan={4} colSpan={1} bg='purple' />

      <GridItem p='10px' rowSpan={3} bg='red.300' colSpan={6}>
        <Flex>{description}</Flex>


        <SeatPicker

          event_id={id}
          user_id={userId}

        />
      </GridItem>
      <GridItem p='10px' rowSpan={3} bg='pink.200' colSpan={3}>
        <Flex>{location}</Flex>

        <Button rightIcon={<MdOutlineShoppingCartCheckout />} colorScheme='blue' variant='solid' as={Link} to={`/checkout`}>
          Checkout
        </Button>
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