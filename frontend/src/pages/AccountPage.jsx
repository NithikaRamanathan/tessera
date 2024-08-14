import AccountBox from '../components/AccountBox';
import React, { useEffect, useState } from 'react';

import {
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  FormControl,
  FormHelperText,
  InputRightElement, Grid, GridItem,
  Center, HStack, Spacer, Text, Image, Flex, SimpleGrid
} from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";

const AccountPage = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:5000/users/account_info`, { credentials: 'include' })
      .then(response => response.json())
      .then(setUsers)
      .catch(error => console.error('Error fetching User:', error));
  }, []);

  return (
    <Box
      paddingTop='59px'
      paddingBottom='150px'
      bgGradient='linear(to-r, blue.100, gray.300, gray.400, gray.300, blue.100)'>
      <Grid
        h='100vh'

        alignItems='center'
        justifyContent='center'
        templateColumns='repeat(5,1fr)'
      >
        <GridItem colSpan={1} />
        <GridItem colSpan={3}>
          {users.map(user => (
            <AccountBox
              key={user.user_id}
              userId={user.user_id}
              firstName={user.first_name}
              lastName={user.last_name}
              email={user.email}
              avatarUrl={user.avatar_url}
              username={user.username}
            />

          ))}
        </GridItem>

      </Grid>
    </Box>
  );
};


export default AccountPage;