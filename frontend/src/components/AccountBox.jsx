import { useState } from "react";
import {
    Heading,
    Input,
    Button,
    InputGroup,
    Stack,
    InputLeftElement,
    chakra,
    Box, Link as ChakraLink,
    InputRightElement, Grid, GridItem,
    Center, VStack, HStack, Spacer, Text, Image, Flex, SimpleGrid, Wrap, WrapItem, Avatar
} from "@chakra-ui/react";
import { Link, useNavigate } from 'react-router-dom';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter, Divider } from '@chakra-ui/react'
import { FaUserAlt, FaLock } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { useColorModeValue } from "@chakra-ui/color-mode";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText, 
  } from '@chakra-ui/react'

// icons
const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';


const AccountBox = ({firstName, lastName, email, avatarUrl, username}) => {
    const [invalid, setInvalid] = useState(false);

    async function fetchLogout() {
        const response = await fetch(`http://localhost:5000/logout`, {
            method: 'POST',
            //credentials: 'include',  // Include cookies in the request
            
        })
            .then(response => {
                if (response.status === 200) {
                    navigate('/events')
                } else {
                    setInvalid(true);
                }
            })
            .catch(error => console.error(('Error fetching events:', error)), []);
    }

    return (
        <Card
            size='lg'
            height='100%'
            width='full'
            padding='20px'
        >
        <CardBody>
            <HStack > 
                <Wrap>
                <WrapItem>
                    <Avatar borderWidth='1px' borderColor='black' size='2xl' src={`${avatarUrl}`} />
                   
                </WrapItem>
                </Wrap>
                <Spacer />
                <VStack paddingStart = '20px' alignItems='left'>
                    <Heading> {firstName} {lastName}</Heading>
                    <Text>{email}</Text>
                    <Text width='100vw'>Change your profile picture</Text>

                </VStack>
            </HStack>
            
            <Divider paddingTop = '20px' paddingBottom = '10px'/>
             <Heading as='h2' size='md' paddingStart='5px' paddingTop = '15px'>Account</Heading>
            
            <TableContainer paddingTop = '15px'>
                <Table variant='striped' colorScheme='gray' size='lg'>
                    <Tbody>
                    <Tr>
                        <Td>Username</Td>
                        <Td>{username}</Td>
                    </Tr>
                    <Tr>
                        <Td>Email</Td>
                        <Td>{email}</Td>
                    </Tr>
                    <Tr>
                        <Td>Full Name</Td>
                        <Td>{firstName} {lastName}</Td>
                    </Tr>
                    <Tr>
                        <Td>Role</Td>
                        <Td>TBD</Td>
                    </Tr>
                    </Tbody>
                    
                </Table>
            </TableContainer>

            <Flex padding = '20px' justifyContent='right'>
                <Button
                    rightIcon={<FaSignOutAlt />}
                    colorScheme='blue'
                    variant='outline'
                    onClick={fetchLogout}
                >
                    Logout
                </Button>
            </Flex>
            

        </CardBody>
        </Card>

    )
}

export default AccountBox;