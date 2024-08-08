import React, { useEffect, useState } from 'react';
import TesseraSeatPicker from 'tessera-seat-picker';
import { Grid, GridItem, Box, Flex, Card, VStack, HStack } from '@chakra-ui/react';


function SeatPicker({ event_id, user_id }) {
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [rows, setRows] = useState([]);
    const[totalPrice, setTotalPrice] = useState(0);


    // fetch the tickets (seats) when the event_id changes
    useEffect(() => {
        fetch(`http://localhost:5000/inventory/tickets/event/${event_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setTickets(data) // update the use state with the fetched tickets
            }
            ).catch(error => console.error('Error fetching:', error));
    }, [event_id]); // dependency is event_id so this useeffect runs when the event_id changes

    // make the tickets (seats) data into the correct format when the tickets are fetched
    useEffect(() => {
        // using a reducer. first param is what is accumulating the value and second param is the initial value
        if (tickets.length > 0) {
            const result = tickets.reduce((acc, c) => {
                // rowsTest.sort((a,b) => a.row_name - b.row_name)
                const rId = c.row_name;
                const seat_info = {
                    id: c.row_name.concat(c.seat_number), // this is the unique id for the seat
                    number: c.seat_number, 
                    isReserved: (c.status == "AVAILABLE") ? false : true, 
                    tooltip: "$".concat(c.value),                
                }

                // accumulating the seats into rows
                if (!(c.row_name in acc)) {
                    acc[c.row_name] = [seat_info]
                }
                else {
                    acc[c.row_name].push(seat_info)
                }

                return acc;
                // return [...a, {rowName: c.row_name.charCodeAt()-64, seatNum: c.seat_number}];

            }, {}); // type object as the initial value 
            setRows(Object.values(result)) // update the state with the rows data ignoring the keys
            setLoading(false)
        }
    }, [tickets]); // dependency- runs when tickets chance

    // function to fetch seat price based on the row, number, and event_id
    const fetchSeatPrice = async (row, number, event_id) => {
        const response = await fetch(`http://localhost:5000/get_price?row=${row}&number=${number}&event_id=${event_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    };

    // id is seat id
    const addSeatCallback = async ({ row, number, id }, addCb) => {
        setLoading(true);

        try {
            const price = await fetchSeatPrice(row, number, event_id);
            // Your custom logic to reserve the seat goes here:
            fetch(`http://localhost:5000/inventory/reserve/${user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    row,
                    number,
                    event_id
                })
            });

            // notes: add button to checkout and reroute them
            // python timers to run code every x minutes
            // separate python script that unlocks all the seats when given the event_id

            // limitations when two people acces the same page at the same time
            // check if youre logged in and get user id from there. dont render anything in the event details page if you arent logged in

            // Assuming everything went well...
            setSelected((prevItems) => [...prevItems, id]);

            // update state
            setTotalPrice(prevValue => prevValue + price);
            const updateTooltipValue = 'Added to cart';

            // Important to call this function if the seat was successfully selected - it helps update the screen
            addCb(row, number, id, updateTooltipValue);
        } catch (error) {
            // Handle any errors here
            console.error('Error adding seat:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeSeatCallback = async ({ row, number, id }, removeCb) => {
        setLoading(true);
        const price = await fetchSeatPrice(row, number, event_id);

        try {
            // Your custom logic to remove the seat goes here...
            fetch(`http://localhost:5000/inventory/unreserve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    row,
                    number,
                    event_id
                })
            })

            setSelected((list) => list.filter((item) => item !== id));
            setTotalPrice(prevValue => prevValue - price); // update totalPrice state by subtracting
            removeCb(row, number);
        } catch (error) {
            // Handle any errors here
            console.error('Error removing seat:', error);
        } finally {
            setLoading(false);
        }
    };

    return (

<div>
        <TesseraSeatPicker
            addSeatCallback={addSeatCallback}
            removeSeatCallback={removeSeatCallback}
            rows={rows}
            maxReservableSeats={3}
            alpha
            visible
            loading={loading}
        />
        <div>Price: ${totalPrice}</div>

        </div>
    );
}


export default SeatPicker;