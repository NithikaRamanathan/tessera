import React, { useEffect, useState } from 'react';
import { Grid, GridItem, Box, VStack, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Image, Text } from '@chakra-ui/react';
import {useColorMode, useColorModeValue} from "@chakra-ui/color-mode";

function EventIdCard({ id, time, name, date, location, imageUrl, description }) {
  const text = useColorModeValue('white', 'gray.700');
  const {colorMode, toggleColorMode } = useColorMode();
  const color = useColorModeValue('blue.500', 'blue.400');

  return (
    // <Grid
    //   templateAreas={`"header header"
    //                   "nav main"
    //                   "nav footer"`}
    //   gridTemplateRows={'40px 160fr 1fr'}
    //   gridTemplateColumns={'300px 1fr'}
    //   h='350px'
    //   gap='3'
    //   color='white'
    //   fontWeight='bold'
      
    // >
    //   <GridItem pl='3' bg={color} area={'header'} alignContent = 'center' color={text}>
    //     {name}
    //   </GridItem>
    //   <GridItem area={'nav'}>
    //     {imageUrl && (
    //         <Image src={imageUrl} alt={`Image for ${name}`} objectFit="cover" width="full" boxSize='300px'/>
    //       )}
    //   </GridItem>
    //   <GridItem pl='3' bg={color} area={'main'} color={text}>
    //     {description}
    //   </GridItem>
    //   <GridItem pl='3' bg={color} area={'footer'} color={text}>
    //     Footer
    //   </GridItem>
    // </Grid>
    <VStack display={{ md: 'flex' }} alignItems='baseline'>
      <HStack display={{ md: 'flex' }} bg='white' p ='3' width='100%'>

      <Box flexShrink={0}>
        {imageUrl && (
          <Image 
          borderRadius="lg"
          width={{ md: 80 }}
          src={imageUrl}
          alt={`Image for ${name}`}
          />
        )}
      </Box>
      
      <Box ml={{ md: 4 }} alignSelf={'start'}>
        <Text
          fontWeight='bold'
          textTransform='uppercase'
          fontSize='lg'
          letterSpacing='wide'
          color='blue.500'
        >
          {name}
        </Text>
        <Text
          mt={1}
          display='block'
          fontSize='md'
          lineHeight='normal'
          color='black'
        >
          Event Details
        </Text>
        <Text mt={2} color='gray.600'>
          {description}
        </Text>
      </Box>
      </HStack>
      
      <HStack>
        <Box>
          {/* {imageUrl && (
            <Image 
            width={{ md: 700 }}
            src='https://www.unitedcenter.com/assets/1/7/concert_floor_seating.jpg'
            alt={`Image for Seating Chart`}
            />
          )} */}
        </Box>
        <Box>
          {/* Put seating chart stuff here */}
        </Box>
      </HStack>
      
      
      
    </VStack>
  );
}

export default EventIdCard;