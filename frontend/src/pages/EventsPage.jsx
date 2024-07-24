import React, { useEffect, useState } from 'react';
import { SimpleGrid, Container, Flex, Text, HStack, Stack, VStack, Button, Input, InputGroup, InputLeftElement} from '@chakra-ui/react';
import EventCard from '../components/EventCard';
import Filter from '../components/Filter';
import {ChevronDownIcon, Search2Icon} from '@chakra-ui/icons'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'

function EventsPage() {
  const [events, setEvents] = useState([]);

  // Filtering
  const today = new Date();
  today.setDate(today.getDate());

  const [afterDate, setDataFromChild] = useState("");
  function handleDataFromChild(afterDate) {
    setDataFromChild(afterDate);
  }

  

  useEffect(() => {
    fetch(`http://localhost:5000/events?afterDate=${afterDate}`)
      .then(response => response.json())
      .then(setEvents)
      .catch(error => console.error('Error fetching events:', error))
;
  }, [afterDate]);
  
  return (
    <Container maxW='container.lg' centerContent paddingTop = '4'>
      
        
      
      
      <Filter sendDataToParent={handleDataFromChild}/>

      {/* <Filter sendDataToParent={handleDataFromChild}/> */}

      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={10} py={5}>
        {events.map(event => (
          <EventCard
            key={event.event_id}
            id={event.event_id}
            name={event.name}
            date={event.date}
            location={event.location}
            imageUrl={event.image_url} 
            time={event.time}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}

export default EventsPage;