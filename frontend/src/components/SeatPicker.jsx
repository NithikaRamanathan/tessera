import React, { useEffect, useState } from 'react';
import TesseraSeatPicker from 'tessera-seat-picker';
import { Grid, GridItem, Box, Flex, Card, VStack, HStack } from '@chakra-ui/react';



// const rows = [
//     [
//         { id: 1, number: 1, tooltip: "$30" },
//         { id: 2, number: 2, tooltip: "$30" },
//         { id: 3, number: 3, isReserved: true, tooltip: "$30" },
//         null,
//         { id: 4, number: 4, tooltip: "$30" },
//         { id: 5, number: 5, tooltip: "$30" },
//         { id: 6, number: 6, tooltip: "$30" }
//     ],
//     [
//         { id: 7, number: 1, isReserved: true, tooltip: "$20" },
//         { id: 8, number: 2, isReserved: true, tooltip: "$20" },
//         { id: 9, number: 3, isReserved: true, tooltip: "$20" },
//         null,
//         { id: 10, number: 4, tooltip: "$20" },
//         { id: 11, number: 5, tooltip: "$20" },
//         { id: 12, number: 6, tooltip: "$20" }
//     ],
//     [
//         { id: 13, number: 1, isReserved: true, tooltip: "$20" },
//         { id: 14, number: 2, isReserved: true, tooltip: "$20" },
//         { id: 15, number: 3, isReserved: true, tooltip: "$20" },
//         null,
//         { id: 16, number: 4, tooltip: "$20" },
//         { id: 17, number: 5, tooltip: "$20" },
//         { id: 18, number: 6, tooltip: "$20" }
//     ]
// ];


function SeatPicker({ event_id, user_id }) {
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [rows, setRows] = useState([]);

    const obj = {}


    useEffect(() => {
        fetch(`http://localhost:5000/inventory/tickets/event/${event_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {

                setTickets(data)
            }
            ).catch(error => console.error('Error fetching:', error));
    }, [event_id]);

    useEffect(() => {
        // first param is what is accumulating the value
        // second param is the initial val

        if (tickets.length > 0) {
            const result = tickets.reduce((acc, c) => {
                // rowsTest.sort((a,b) => a.row_name - b.row_name)
                const rId = c.row_name;
                const seat_info = { id: c.row_name.concat(c.seat_number), number: c.seat_number, isReserved: (c.status == "AVAILABLE")? false : true, tooltip: "$".concat(c.value) }


                if (!(c.row_name in acc)) {
                    acc[c.row_name] = [seat_info]


                    // acc[c.row_name] = []
                    // acc[c.row_name].push(seat_info)
                }
                else {
                    acc[c.row_name].push(seat_info)
                }

                return acc;
                // return [...a, {rowName: c.row_name.charCodeAt()-64, seatNum: c.seat_number}];

            }, {}); // type object as the initial value 
            console.log(Object.values(result))
            setRows(Object.values(result))
            //rowsTest.push(Object.values(result))
            // console.log(rows)

            setLoading(false)
        }
    }, [tickets]);

    // if (tickets[i].row_name === 'A'){
    //     rowsTest.push([{id: tickets[i].row_name.concat(tickets[i].seat_number), number: tickets[i].seat_number}])
    //     console.log(rowsTest.length)
    //     if(rowsTest.length == 5) {
    //         console.log(rowsTest)
    //     }
    // }

    const addSeatCallback = async ({ row, number, id }, addCb) => {
        setLoading(true);



        try {
            // Your custom logic to reserve the seat goes here:

            // http://localhost:5000/inventory/reserve/<user_id>
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
            })
            
// add button to checkout and reroute them
            // python timers to run code every x minutes
            // separate python script that unlocks all the seats when given the event_id
            // how to run code every x minutes in python
            // wrtie an event to run every minute. get the time right now. and do a sql request to update
            // the columns where time is less than this minus 5

            // limitations when two people acces the same page at the same time
            // check if youre logged in and get user id from there. dont render anything in the event details page if you arent logged in


            // Assuming everything went well...
            setSelected((prevItems) => [...prevItems, id]);
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
            removeCb(row, number);
        } catch (error) {
            // Handle any errors here
            console.error('Error removing seat:', error);
        } finally {
            setLoading(false);
        }
    };

    return (

        
        <TesseraSeatPicker
            addSeatCallback={addSeatCallback}
            removeSeatCallback={removeSeatCallback}
            rows={rows}
            maxReservableSeats={3}
            alpha
            visible
            loading={loading}
        />
    );
}


export default SeatPicker;