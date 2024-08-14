import React, { useEffect, useState } from 'react';
import {
  Grid, GridItem, Flex, Box, Heading, VStack, Spacer, Button, Image, Text, Stack, HStack, Container, Center, useDisclosure, Tabs, TabList, TabPanels, Tab, TabPanel, Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import SeatPicker from '../components/SeatPicker';
import { CalendarIcon, TimeIcon, AddIcon } from '@chakra-ui/icons';
import { MdOutlineShoppingCartCheckout, MdLocationPin } from "react-icons/md";
import Checkout from './Checkout';

function EventIdCard({ id, time, name, date, location, imageUrl, description }) {
  const text = useColorModeValue('white', 'gray.700');
  const { colorMode, toggleColorMode } = useColorMode();
  const color = useColorModeValue('blue.500', 'blue.400');

  const [userId, setUserId] = useState("")
  const [value, setValue] = useState(0)

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [priceRange, setPriceRange] = useState({min:0, max:0});

  const navigate = useNavigate();
  const fetchSeatPricesRange = async () => {
    try {
      const response = await fetch(`http://localhost:5000/get_seat_prices?event_id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const prices = await response.json();

      const minPrice = Math.min(...prices); // spread into correct format
        const maxPrice = Math.max(...prices);
        setPriceRange({min: minPrice, max: maxPrice});
      
    } catch (error) {
      console.error('Error fetching', error);
    }
  };

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
    fetchSeatPricesRange();
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
      marginTop='78px'
      justifyContent='center'
      templateColumns='repeat(11,1fr)'
      templateRows='repeat(10, 1fr)'
    >
      <GridItem rowSpan={10} bg='gray' colSpan={11}>

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
            <VStack paddingTop='20px'>
              <Text as="b" fontSize="4xl" color='gray.100'>
                {name}
              </Text>
              <Text as="b" fontSize="lg" color='gray.100'>
                {date}
              </Text>
            </VStack>
          </Center>
        </Box>

      </GridItem>

      {/* Left side margin */}
      <GridItem rowSpan={10} colSpan={1} />

      <GridItem p='15px' paddingTop='30px' paddingBottom='25px' alignContent='center' borderBottom='solid' borderColor='gray' rowSpan={1} colSpan={9}>
        <Stack>
          <HStack spacing='30px'>
            <Stack><Text><CalendarIcon color='blue.500' /> {date}</Text>
              <Text><TimeIcon color='blue.500' /> {time}</Text></Stack>
            <Stack>
              <HStack spacing='1px'><MdLocationPin style={{ color: '#2982B4' }} /><Text>{location} </Text></HStack>
              <Spacer />
              <Spacer />
              <Spacer />
              <Spacer />
            </Stack>
            <Stack paddingLeft='50px' spacing='0' paddingBottom='14px'>
              <Flex fontSize='xs'>Price</Flex>
              <Heading size='md' color='blue.500'>${priceRange.min}-${priceRange.max}</Heading>
            </Stack>


          </HStack>


        </Stack>

      </GridItem>

      {/* right side margin */}
      <GridItem rowSpan={10} colSpan={1} />


      <GridItem p='10px' rowSpan={10} colSpan={5}>
        <Heading paddingTop='5px' paddingBottom='7px' size='md'>Event Overview</Heading>
        <Flex paddingBottom='50px'>{description}



        </Flex>

        <Box borderRadius="md" width='70%' bg='black' >
          {imageUrl && (
            <Image opacity='75%' borderRadius="md" src={imageUrl} alt={`Image for ${name}`} objectFit="contain" width="full" />
          )}

        </Box>




      </GridItem>


      <GridItem p='10px' rowSpan={10} colSpan={4} borderLeft='solid' borderColor='gray'>
        <Heading paddingTop='5px' paddingLeft='7px' paddingBottom='7px' color='gray.100' bg='blue.500' size='md'>Tickets</Heading>
        <SeatPicker
          event_id={id}
          user_id={userId}
          callback_function={fetchSeatPrice}
        />

        <HStack paddingTop='20px'>
          <Text> Your total: ${value}</Text>
          <Spacer />
          <Button
            rightIcon={<MdOutlineShoppingCartCheckout />}
            colorScheme='blue'
            variant='solid' onClick={handleCheckout} >
            Checkout
          </Button>
        </HStack>



        <Checkout
          isOpen={isOpen}
          onClose={onClose}
          value={value}
          event_id={id}
          user_id={userId}
        />

        {/* <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton p='10px' bg='blue.500' color='gray.100' _hover={{bg: 'blue.400'}}>
                <Box as='span' flex='1' textAlign='left'>
                <Heading size='md'>Buy Tickets Now</Heading>
                </Box>

              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <SeatPicker
                event_id={id}
                user_id={userId}
                callback_function={fetchSeatPrice}
              />

              <Flex>Your total: ${value}</Flex>

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
            </AccordionPanel>
          </AccordionItem>


        </Accordion>
 */}



      </GridItem>

    </Grid>
  );
}

export default EventIdCard;