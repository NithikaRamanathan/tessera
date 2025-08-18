import React, { useEffect, useState } from 'react';
import { SimpleGrid, Container} from '@chakra-ui/react';
import EventCard from '../components/EventCard';
import Filter from '../components/Filter';

function EventsPage() {
  const [events, setEvents] = useState([]);

  // Filtering
  const today = new Date();
  today.setDate(today.getDate());
  const [date, setDateFromChild] = useState("");
  const [name, setNameFromChild] = useState("");
  const[location, setLocationFromChild ] = useState("");
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  function handleDataFromChild(date, name, location) {
    setDateFromChild(date);
    setNameFromChild(name);
    setLocationFromChild(location);
  }
  
  console.log("Date before fetch:", date);
  console.log("Name before fetch:", name);
  console.log("Loc before fetch:", location);


  useEffect(() => {
    fetch(`${VITE_BACKEND_URL}/events?date=${date}&name=${name}&location=${location}`)
      .then(response => response.json())
      .then(setEvents)
      .catch(error => console.error('Error fetching events:', error));
  }, [date, name, location]);
  
  return (
    <Container maxW='container.lg' centerContent paddingTop = '4'>
      <Filter sendDataToParent={handleDataFromChild}/>
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