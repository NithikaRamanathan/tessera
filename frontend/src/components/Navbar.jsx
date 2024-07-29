import React from 'react';
import { Box, Flex, Text, Button, Spacer, Icon, LightMode, DarkMode } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";


import ToggleColorMode from './ToggleColorMode';
import MenuDrop from './Menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@chakra-ui/react'


function Navbar() {
  const { Menu } = useColorMode()
  return (
    <Flex position='fixed' width='100vw' bg="blue.500" p="4" alignItems="center" zIndex={'sticky'}>
      <Box p="2">
        <Text fontSize="xl" fontWeight="bold" color='white' as={Link} to='/events'>Tessera Events </Text>
      </Box>

      {/* <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to='/events'>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to='#'>
            About
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Contact</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb> */}



      <Spacer />
      <Box>
        <ToggleColorMode />        
      </Box>
      <MenuDrop />

    </Flex>


  );
}

export default Navbar;