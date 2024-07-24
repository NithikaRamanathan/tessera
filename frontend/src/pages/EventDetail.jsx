// import React from 'react';
import React, { useEffect, useState } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import EventIdCard from '../components/EventIdCard';


function EventDetail() {
  const { id } = useParams(); 
  const [events, setEvents] = useState([]);
 

  useEffect(() => {
    fetch(`http://localhost:5000/events/${id}`, {credentials:'include'})
      .then(response => response.json())
      .then(setEvents)
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  return (
    
    <Grid >
      
      {events.map(event => (
        <EventIdCard
          key={event.event_id}
          id={event.event_id}
          name={event.name}
          date={event.date}
          description={event.description}
          location={event.location}
          imageUrl={event.image_url} 
          time={event.time}
        />
      ))}
    </Grid>

    // <div>
    //   <h1>Event Detail Page</h1>
    //   <p>Showing details for event ID: {id}</p>
    //   <p>This is a placeholder page</p>
    // </div>
  );
}

export default EventDetail;