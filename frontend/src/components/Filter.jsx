import React from 'react';
import { Input, Button, ButtonGroup, Box, Text, Heading, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { useState } from "react";
import { Stack, HStack, VStack } from '@chakra-ui/react'
import { Flex, Spacer } from '@chakra-ui/react'
import { useColorModeValue } from "@chakra-ui/color-mode";
import { ChevronDownIcon, Search2Icon } from '@chakra-ui/icons'



function Filter({ sendDataToParent }) {
    const textColor = useColorModeValue('white', 'black')
    const barColor = useColorModeValue('blue.500', 'blue.200')
    const [data, setData] = useState("");
    function handleClick() {
        sendDataToParent(data);
    }

    return (
        // <Flex bg ='gray.200' rounded= 'md' border = 'solid' borderColor='gray.500' width='100%' minWidth='max-content' alignItems='start' >
        //     <Box p='2'>

        //         <Text>
        //             Location
        //         </Text>

        //     </Box>
        //     <Spacer borderRight='solid' borderColor='gray.500'/>
        //     <Box borderRight='solid' borderColor='gray.500'>
        //         <ButtonGroup>
        //             <Input placeholder='Select Date' rounded = '0' border='white' size='md' type='date' onChange={(e) => setData(e.target.value)}/>
        //             <Button paddingLeft='0' bg='gray.200' onClick={handleClick}>Filter</Button>
        //         </ButtonGroup>
        //     </Box>
        //     <Spacer />

        // </Flex>


        <Flex marginTop='80px' bg={barColor} color={textColor} rounded='md' border='solid'  width='100%' minWidth='max-content' alignItems='start' p='2px' >

            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                    <Search2Icon color={textColor} />
                </InputLeftElement>
                <Input rounded='0' borderColor='transparent' type='text' _placeholder={{color: textColor }} placeholder='Search by Venue' />
            </InputGroup>

            <Box borderLeft='solid' borderRight='solid' borderLeftColor={textColor} borderRightColor={textColor} >
                <ButtonGroup >
                    <Input rounded='0' border='none' size='md' type='date' onChange={(e) => setData(e.target.value)} />
                    <Button borderRadius='0' color={textColor}  bg={barColor}  onClick={handleClick}>Filter</Button>
                </ButtonGroup>
            </Box>


            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                    <Search2Icon color={textColor} />
                </InputLeftElement>
                <Input rounded='0' _placeholder={{color: textColor }} borderColor='transparent' type='text' placeholder='Search by Artist or Event' />
            </InputGroup>

        </Flex>




        // <div>
        // <Input placeholder='Select Date' size='md' type='date' onChange={(e) => setData(e.target.value)}/>
        // <Button onClick={handleClick}>Select</Button>
        // </div>
    );
}
export default Filter;