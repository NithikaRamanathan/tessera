import React, { useEffect, useState } from 'react';
import { Grid, GridItem, Flex, Box, VStack, Spacer, Button, Image, Text, Stack, HStack, Container, Center, useDisclosure, Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import SeatPicker from '../components/SeatPicker';
import { CalendarIcon, TimeIcon } from '@chakra-ui/icons';
import { MdOutlineShoppingCartCheckout, MdLocationPin } from "react-icons/md";
import Checkout from './Checkout';


function EventIdCard({ id, time, name, date, location, imageUrl, description }) {
  const text = useColorModeValue('white', 'gray.700');
  const { colorMode, toggleColorMode } = useColorMode();
  const color = useColorModeValue('blue.500', 'blue.400');

  const [userId, setUserId] = useState("")
  const [value, setValue] = useState(0)


  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();



  const fetchSeatPrice = async (row, number, add) => {
    await fetch(`http://localhost:5000/get_price?row=${row}&number=${number}&event_id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(price => {
        if (add) {
          setValue(value + price)

        } else {
          setValue(value - price)
        }
      })
      .catch(error => console.error('Error fetching', error));

  };


  useEffect(() => {
    fetch(`http://localhost:5000/users/current`, { credentials: 'include' })
      .then(response => response.json())
      .then(data => setUserId(data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const handleCheckout = () => {
    onOpen();
  };



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
      <GridItem borderRight='solid'rowSpan={4} colSpan={1} />

      <GridItem p='15px' alignContent='center' borderBottom='solid' rowSpan={1} colSpan={9}>
        {/* <Flex>date, time, price range</Flex> */}
          <Stack >
            <Text><CalendarIcon /> {date}</Text>
            <Text><TimeIcon /> {time}</Text>
            <HStack><MdLocationPin /><Text>{location} </Text></HStack>
          </Stack>

      </GridItem>
      <GridItem rowSpan={4} colSpan={1} borderLeft='solid' />

      <GridItem p='10px' rowSpan={3} colSpan={6} bg='blue.700'>
        <Flex>{description}</Flex>

        <SeatPicker
          event_id={id}
          user_id={userId}
          callback_function={fetchSeatPrice}
        />

      </GridItem>
      <GridItem p='10px' rowSpan={3} colSpan={3} borderLeft='solid'>

        <Flex>Price: ${value}</Flex>

        {/* need to call buy endpoint*/}
        <Button
          rightIcon={<MdOutlineShoppingCartCheckout />}
          colorScheme='blue'
          variant='solid' onClick={handleCheckout} >
          Checkout
        </Button>

        <Checkout
          isOpen={isOpen}
          onClose={onClose}
          value={value}
          event_id={id}
          user_id={userId}
        />

      </GridItem>
      <GridItem bg='gray' rowSpan={1} colSpan={11}></GridItem>

    </Grid>
  );
}

export default EventIdCard;