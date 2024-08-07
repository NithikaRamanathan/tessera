from flask import Flask, jsonify, make_response, request # Importing the Flask library and some helper functions
from werkzeug.security import generate_password_hash
import sqlite3 # Library for talking to our database
from datetime import date # We'll be working with dates 
from werkzeug.security import generate_password_hash, check_password_hash # need to compare hashes of passwords
from datetime import timedelta


from flask_jwt_extended import (
    JWTManager, get_jwt, jwt_required, create_access_token,
    create_refresh_token,
    get_jwt_identity, set_access_cookies,
    set_refresh_cookies, unset_jwt_cookies
)

from flask_cors import CORS
app = Flask(__name__)  # Creating a new Flask app. This will help us create API endpoints hiding the complexity of writing network code!
CORS(app, supports_credentials=True)

app.config['JWT_TOKEN_LOCATION'] = ['cookies']

# app.config['JWT_COOKIE_CSRF_PROTECT'] = True

app.config['JWT_SECRET_KEY'] = 'super-secret'
jwt = JWTManager(app)


@app.route('/logout', methods=['POST'])
#@jwt_required()
def logout():
    resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return resp, 200


# This function returns a connection to the database which can be used to send SQL commands to the database
def get_db_connection():
  conn = sqlite3.connect('../database/tessera.db')
  conn.row_factory = sqlite3.Row
  return conn

# functions
@app.route('/events', methods=['GET'])
def get_events():
  conn = get_db_connection()
  cursor = conn.cursor()
  
  # Start with the base SQL query
  query = 'SELECT * FROM Events'
  params = []
  query_conditions = []
  
  # Check for the 'afterDate' filter
  after_date = request.args.get('afterDate')
  if after_date:
      query_conditions.append('date > ?')
      params.append(after_date)
  
  # Check for the 'location' filter
  location = request.args.get('location')
  if location:
      query_conditions.append('location = ?')
      params.append(location)

  # Add WHERE clause if conditions are present
  if query_conditions:
      query += ' WHERE ' + ' AND '.join(query_conditions)
  
  # Execute the query with the specified conditions
  cursor.execute(query, params)
  events = cursor.fetchall()
  
  # Convert the rows to dictionaries to make them serializable
  events_list = [dict(event) for event in events]
  
  conn.close()
  
  return jsonify(events_list)


@app.route('/events/update', methods=['PUT'])
def update_event():
    event_id = request.json.get('event_id')
    # new_description = request.json.get('description')
    new_date = request.json.get('date')
    
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('UPDATE Events SET date=? WHERE event_id=?', (new_date, event_id))
        
        return jsonify({'message': 'Changed date successfully'}), 401

        
    except sqlite3.Error as e:
        return jsonify({'error': 'Database error'}), 500 
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/users', methods=['GET'])
def get_users():
    conn = get_db_connection()  # Establish database connection
    cursor = conn.cursor()
    
    # SQL query to select all users
    cursor.execute('SELECT * FROM Users')
    users = cursor.fetchall()  # Fetch all users
    
    # Convert rows into a list of dicts to make them serializable
    users_list = [dict(user) for user in users]
    
    conn.close()  # Close the database connection
    
    return jsonify(users_list)  # Return the list of events as JSON


@app.route('/users/create', methods=['POST'])
def create_user():
    # Extract email, username, and password from the JSON payload
    email = request.json.get('email')
    username = request.json.get('username')
    password = request.json.get('password')
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')
    avatar_url = request.json.get('avatar_url')

    # Basic validation to ensure all fields are provided
    if not email or not username or not password or not first_name or not last_name:
        return jsonify({'error': 'All fields (first_name, last_name, email, username, and password) are required.'}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)
    
    print(hashed_password)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Attempt to insert the new user into the Users table
        cursor.execute('INSERT INTO Users (first_name, last_name, email, username, password_hash, avatar_url) VALUES (?, ?, ?, ?, ? ,?)',
                       (first_name, last_name, email, username, hashed_password, avatar_url))
        conn.commit()  # Commit the changes to the database

        # Retrieve the user_id of the newly created user to confirm creation
        cursor.execute('SELECT user_id FROM Users WHERE username = ?', (username,))
        new_user_id = cursor.fetchone()
        print(new_user_id)

        conn.close()

        return jsonify({'message': 'User created successfully', 'user_id': new_user_id['user_id']}), 201

    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username or email already exists.'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# what if user gives both uysername and email
@app.route('/login', methods=['POST'])
def login():

    username = request.json.get('username')
    password = request.json.get('password')
    email = request.json.get('email')

    # Basic validation to ensure all fields are provided
    if not username or not password:
        if not email or not password:
            return jsonify({'error': 'Username/Email and password are required.'}), 400
    # set the expiration of the token
    expires = timedelta(days=1)
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
    
        # finding password_hash for user
        if (username):
            cursor.execute('SELECT * FROM Users WHERE username = ?', (username,))
            user_info = cursor.fetchone()
            conn.close()
            
            print(user_info)
            # extracting the needed values
            if user_info == None:
                return jsonify({'message': 'Invalid username or email'}), 401 
            pass_hash = user_info['password_hash']
            user_id = user_info['user_id']
            
            subject = {
                "username": username,
                "email": user_info['email'],
                "user_id": user_id
            }
        else:
            cursor.execute('SELECT * FROM Users WHERE email = ?', (email,))            
            user_info = cursor.fetchone()
            conn.close()
            
            # extracting the needed values
            pass_hash = user_info['password_hash']
            
            subject = {
                "username": user_info['username'],
                "email": email
            }
        if pass_hash != None:
            #existing_pass_hash = pass_hash['password_hash']
            if check_password_hash(pass_hash, password):
                
                # Create the token we will be sending back to the user
                access_token = create_access_token(identity=subject , expires_delta=expires)
                resp = jsonify({'message': 'Logged in'})
                set_access_cookies(resp, access_token)
                return resp, 200
            else:
                return jsonify({'error': 'Invalid password'}), 401
        return jsonify({'message': 'Invalid username or email'}), 401
        
    except sqlite3.Error as e:
        return jsonify({'error': 'Database error'}), 500 
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/users/update/<user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    
    #old_username = request.json.get('old_username')
    new_username = request.json.get('new_username')
    #old_email = request.json.get('old_email')
    new_email = request.json.get('new_email')
    new_avatar_url = request.json.get('new_avatar_url')
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # changing username and email
        if new_username and new_email and not new_avatar_url:
            cursor.execute('UPDATE Users SET username=? WHERE user_id=?', (new_username, user_id,))
            cursor.execute('UPDATE Users SET email=? WHERE user_id=?', (new_email, user_id,))
            conn.commit() # Commit the changes to the database
            return jsonify({'message': 'Changed username and email successfully'}), 200

        # changing username, email, and avatar_url
        if new_username and new_email and new_avatar_url:
            cursor.execute('UPDATE Users SET username=? WHERE user_id=?', (new_username, user_id,))
            cursor.execute('UPDATE Users SET email=? WHERE user_id=?', (new_email, user_id,))
            cursor.execute('UPDATE Users SET avatar_url=? WHERE user_id=?', (new_avatar_url, user_id,))
            conn.commit() # Commit the changes to the database
            return jsonify({'message': 'Changed username and email successfully'}), 200

        # changing only username
        elif new_username and not new_email:
            cursor.execute('UPDATE Users SET username=? WHERE user_id=?', (new_username, user_id,))
            conn.commit()
            return jsonify({'message': 'Updated username successfully'}), 200

        # changing only email
        elif new_email and not new_username:
            cursor.execute('UPDATE Users SET email=? WHERE user_id=?', (new_email, user_id,))
            conn.commit()
            return jsonify({'message': 'Changed email successfully'}), 200
        
         # changing only avatar_url
        elif new_avatar_url and not new_username and not new_email:
            cursor.execute('UPDATE Users SET avatar_url=? WHERE user_id=?', (new_avatar_url, user_id,))
            conn.commit()
            return jsonify({'message': 'Changed avatar url successfully'}), 200
        else:
            return jsonify({'error': 'Fields are missing'}), 400
        
        
        # changing username and email
        # if old_username and new_username and old_email and new_email:
        #     cursor.execute('UPDATE Users SET username=? WHERE username=?', (new_username, old_username,))
        #     cursor.execute('UPDATE Users SET email=? WHERE email=?', (new_email, old_email,))
        #     conn.commit() # Commit the changes to the database
        #     return jsonify({'message': 'Changed username and email successfully'}), 401

        # # changing only username
        # elif old_username and new_username and not old_email and not new_email:
        #     cursor.execute('UPDATE Users SET username=? WHERE username=?', (new_username, old_username,))
        #     conn.commit()
        #     return jsonify({'message': 'Changed username successfully'}), 401

        # # changing only email
        # elif old_email and new_email and not old_username and not new_username:
        #     cursor.execute('UPDATE Users SET email=? WHERE email=?', (new_email, old_email,))
        #     conn.commit()
        #     return jsonify({'message': 'Changed email successfully'}), 401
        # else:
        #     return jsonify({'error': 'Fields are missing'}), 400
        
    except sqlite3.Error as e:
        return jsonify({'error': 'Database error'}), 500 
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# what if user doesn't even exist?
@app.route('/users/delete', methods=['DELETE'])
@jwt_required() # option for user to delete their account
def delete():
    # Extract email, username, and password from the JSON payload
    email = request.json.get('email')
    username = request.json.get('username')
    password = request.json.get('password')

    # Basic validation to ensure all fields are provided
    if not email or not username or not password:
        return jsonify({'error': 'All fields (email, username, and password) are required.'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM Users WHERE username=?', (username,))

        conn.commit()  # Commit the changes to the database

        conn.close()
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except sqlite3.Error as e:
        return jsonify({'error': 'Database error ' + str(e)}), 500 
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/events/create', methods=['POST'])
def create_event():

    # Extract name, description, date, time and location from the JSON payload
    name = request.json.get('name')
    description = request.json.get('description')
    date = request.json.get('date')
    time = request.json.get('time')
    location = request.json.get('location')
    image_url = request.json.get('image_url')

    # Basic validation to ensure all fields are provided
    if not name or not description or not date or not time or not location or not image_url:
        return jsonify({'error': 'All fields (name, description, date, time, and location) are required.'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Attempt to insert the new event into the Events table
        cursor.execute('INSERT INTO Events (name, description, date, time, location, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                       (name, description, date, time, location, image_url))
        
        conn.commit()  # Commit the changes to the database

        # Retrieve the event_id of the newly created event to confirm creation
        cursor.execute('SELECT event_id FROM Events WHERE name = ?', (name,))
        new_event_id = cursor.fetchone()

        conn.close()

        return jsonify({'message': 'Event created successfully', 'event_id': new_event_id['event_id']}), 201

    except sqlite3.IntegrityError:
        return jsonify({'error': 'Event already exists.'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/users/emails', methods=['GET'])
def get_emails():
    conn = get_db_connection()  # Establish database connection
    cursor = conn.cursor()
    
    # SQL query to select all emails
    cursor.execute('SELECT email FROM Users')
    emails = cursor.fetchall()  # Fetch all emails
    
    # Convert rows into a list of dicts to make them serializable
    emails_list = [dict(email) for email in emails]
    
    conn.close() # Close the database connection
    
    return jsonify(emails_list)  # Return the list of emails as JSON


@app.route('/users/change_password/<user_id>', methods=['PUT'])
# @jwt_required()
def update_password(user_id):

    # Extract username, current password, and new password from the JSON payload
    curr_password = request.json.get('curr_password')
    new_password = request.json.get('new_password')

    # Basic validation to ensure all fields are provided
    if not curr_password or not new_password:
        return jsonify({'error': 'All fields (current password and new password) are required.'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT password_hash FROM Users WHERE user_id = ?', (user_id,))
        pass_hash = cursor.fetchone()
        # print(pass_hash['password_hash'])

        if pass_hash == None:
            return jsonify({'error': 'User not found'}), 404
        
        existing_pass_hash = pass_hash['password_hash']
        if not check_password_hash(existing_pass_hash, curr_password):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        new_password_hash = generate_password_hash(new_password)
        cursor.execute('UPDATE Users SET password_hash=? WHERE user_id=?', (new_password_hash, user_id,))
        conn.commit()

        return jsonify({'message': 'Password updated successfully.'}), 200
    except sqlite3.Error as e:
        return jsonify({'error': 'Database error'}), 500 
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/users/forgot_password', methods=['PUT'])
def forgot_password():
    # Extract username, email, and new password from the JSON payload
    username = request.json.get('username')
    email = request.json.get('email')
    new_password = request.json.get('new_password')

    # Basic validation to ensure all fields are provided
    if not username or not email or not new_password:
        return jsonify({'error': 'All fields (username, email, and new password) are not there.'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT email FROM Users WHERE username = ?', (username,))
        user_data = cursor.fetchone()

        if user_data == None:
            return jsonify({'error': 'User not found'}), 404
        
        existing_email = user_data['email']
        if existing_email != email:
            return jsonify({'error': 'Emails do not match'}), 401
        
        new_password_hash = generate_password_hash(new_password)
        cursor.execute('UPDATE Users SET password_hash=? WHERE username=?', (new_password_hash, username,))
        conn.commit()
        return jsonify({'message': 'Password updated successfully.'})
    except sqlite3.Error as e:
        return jsonify({'error': 'Database error'}), 500 
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/tickets', methods=['POST'])
def award_ticket():
    # Extract user_id, event_id, and price
    user_id = request.json.get('user_id')
    event_id = request.json.get('event_id')
    purchase_date = request.json.get('purchase_date')
    price = request.json.get('price')
    number_of_tickets = (int)(request.json.get('number_of_tickets'))

    if not user_id or not event_id or not purchase_date or not price or not number_of_tickets:
        return jsonify({'error': 'All fields are required'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT user_id FROM Users WHERE user_id = ?', (user_id,))
        
        if cursor.fetchone() == None:
            return jsonify({'error': 'User not found.'}), 400
        
        for x in range(number_of_tickets):
            cursor.execute('INSERT INTO Tickets (event_id, user_id, purchase_date, price) VALUES (?, ?, ?, ?)',
                       (event_id, user_id, purchase_date, price,))
        
        conn.commit()
        
        if number_of_tickets > 1:
            return jsonify({'message': 'Tickets awarded successfully.'})
        else:
            return jsonify({'message': 'Ticket awarded successfully.'})
    except sqlite3.Error as e:
        return jsonify({'error': 'Database error'}), 500 
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# we're makign dynamic endpoints
# create the endpoint where the information is actually in the url
@app.route('/events/<event_id>', methods=['GET'])
@jwt_required()

def get_event_with_id(event_id):
    try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM Events WHERE event_id=?', (event_id,))
            details = cursor.fetchall()
            list = [dict(detail) for detail in details]
            conn.close()
            
            return jsonify(list)

    except sqlite3.Error as e:
        return jsonify({'error': 'Database error'}), 500 
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/users/account_info', methods=['GET'])
@jwt_required()
def account_info():
    jwt = get_jwt()
    user_id = jwt['sub']['user_id']
   
    
    try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM Users WHERE user_id=?', (user_id,))
            details = cursor.fetchall()
            list = [dict(detail) for detail in details]
            conn.close()
            
            return jsonify(list)

    except sqlite3.Error as e:
        return jsonify({'error': 'Database error'}), 500 
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/users/current', methods=['GET'])
@jwt_required()
def current_user():
    # conn = get_db_connection()  # Establish database connection
    # cursor = conn.cursor()
    jwt = get_jwt()
    user_id = jwt['sub']['user_id']
    return jsonify(user_id)
    
# populating prices table
@app.route('/inventory/prices', methods=['POST'])
def create_prices():
    pricecode = request.json.get('pricecode')
    value = request.json.get('value')
    event_id = request.json.get('event_id')
    
    if not pricecode or not event_id or not value:
        return jsonify({'error': 'All fields are required'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO Prices (pricecode, value, event_id) VALUES (?, ?, ?)', (pricecode, value, event_id))
        
        conn.commit()
        
        # Retrieve the price_id of the newly created user to confirm creation
        cursor.execute('SELECT price_id FROM Prices WHERE pricecode = ?', (pricecode))
        new_price_id = cursor.fetchone()
        print(new_price_id)
        
        return jsonify({'message': 'Pricecode created successfully', 'price_id': new_price_id['price_id']}), 200
        
        
    except sqlite3.Error as e:
        return jsonify({'error': 'Database error'}), 500 
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# populating tickets table
@app.route('/inventory/create', methods=['POST'])
def create_tickets():
    row_name = request.json.get('row_name')
    seat_number = request.json.get('seat_number')
    event_id = request.json.get('event_id')
    pricecode = request.json.get('pricecode')
    status = 'AVAILABLE'
    
    if not row_name or not seat_number or not event_id or not pricecode:
        return jsonify({'error': 'All fields are required'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO Tickets (row_name, seat_number, event_id, pricecode, status) VALUES (?, ?, ?, ?, ?)', (row_name, seat_number, event_id, pricecode, status,))
        conn.commit()
        # cursor.execute('SELECT row_name AND seat_number AND event_id FROM Tickets WHERE row_name = ? AND seat_number = ? AND event_id = ?', (row_name, seat_number, event_id,))
        # new_ticket = cursor.fetchone()
        return jsonify({'message': 'Ticket created successfully'}), 200
            
        
    except sqlite3.Error as e:
        return jsonify({'error': str(e)}), 500 
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/inventory/tickets', methods=['GET'])
def get_tickets():
    conn = get_db_connection()  # Establish database connection
    cursor = conn.cursor()
    
    # SQL query to select all users
    cursor.execute('SELECT row_name, seat_number, event_id, status, pricecode FROM Tickets')
    tickets = cursor.fetchall()  # Fetch all users
    
    # Convert rows into a list of dicts to make them serializable
    tickets_list = [dict(ticket) for ticket in tickets]
    
    conn.close()  # Close the database connection
    
    return jsonify(tickets_list)  # Return the list of events as JSON

@app.route('/inventory/tickets/event/<event_id>', methods=['GET'])
def get_tickets_for_event(event_id):
    conn = get_db_connection()  # Establish database connection
    cursor = conn.cursor()
    
    # SQL query to select all users
    # cursor.execute('SELECT row_name, seat_number, event_id, status, pricecode FROM Tickets WHERE event_id=?', (event_id))
    
    #
    cursor.execute('SELECT row_name, seat_number, status, value FROM Tickets JOIN Prices ON Tickets.pricecode = Prices.pricecode AND Tickets.event_id = Prices.event_id WHERE Tickets.event_id=?', (event_id))
    
    tickets = cursor.fetchall()  # Fetch all users
    
    # Convert rows into a list of dicts to make them serializable
    tickets_list = [dict(ticket) for ticket in tickets]
    
    conn.close()  # Close the database connection
    
    return jsonify(tickets_list)  # Return the list of events as JSON



@app.route('/inventory/tickets/<user_id>', methods=['GET'])
def get_tickets_for_user(user_id):
    conn = get_db_connection()  # Establish database connection
    cursor = conn.cursor()
    
    # SQL query to select all users
    cursor.execute('SELECT row_name, seat_number, event_id, status, pricecode FROM Tickets WHERE user_id=?', (user_id))
    tickets = cursor.fetchall()  # Fetch all users
    
    # Convert rows into a list of dicts to make them serializable
    tickets_list = [dict(ticket) for ticket in tickets]
    
    conn.close()  # Close the database connection
    
    return jsonify(tickets_list)  # Return the list of events as JSON

@app.route('/inventory/buy/<user_id>', methods=['PUT'])
def buy_ticket(user_id):
    row_name = request.json.get('row_name')
    seat_number = request.json.get('seat_number')
    event_id = request.json.get('event_id')
    purchase_date = date.today()
    status = 'SOLD'
    
    conn = get_db_connection()  # Establish database connection
    cursor = conn.cursor()
    
    cursor.execute('SELECT status FROM Tickets WHERE row_name=? AND seat_number=? AND event_id=?', (row_name, seat_number, event_id,))
    curr_status = cursor.fetchone()
    
    # and user id match
    if (str(curr_status) == 'RESERVED'):
        # SQL query to update the ticket
        cursor.execute('UPDATE Tickets SET user_id=?, status=?, purchase_date=? WHERE row_name=? AND seat_number=? AND event_id=?', (user_id, status, purchase_date, row_name, seat_number, event_id,))
        
    
    conn.commit()  
    conn.close()
    # Close the database connection
    
    return jsonify({'message': 'Ticket bought successfully.'})

@app.route('/inventory/reserve/<user_id>', methods=['PUT'])
def reserve_ticket(user_id):
    row_name = request.json.get('row')
    seat_number = request.json.get('number')
    event_id = request.json.get('event_id')
    status = ''
    
    conn = get_db_connection()  # Establish database connection
    cursor = conn.cursor()

    cursor.execute('SELECT status FROM Tickets WHERE row_name=? AND seat_number=? AND event_id=?', (row_name, seat_number, event_id,))
    temp_status = cursor.fetchone()
    
    if temp_status['status'] == 'AVAILABLE':
        status='RESERVED'
        # SQL query to update the ticket
        cursor.execute('UPDATE Tickets SET user_id=?, status=? WHERE row_name=? AND seat_number=? AND event_id=?', (user_id, status, row_name, seat_number, event_id,))
        conn.commit()  
        conn.close()
        return jsonify({'message': 'Ticket reserved successfully.'})
    else:
        return jsonify({'error': 'Ticket not available'}), 404 
    
# make an unreserve endpoint. make the user id empty

@app.route('/inventory/unreserve', methods=['PUT'])
def unreserve_ticket():
    row_name = request.json.get('row')
    seat_number = request.json.get('number')
    event_id = request.json.get('event_id')
    user_id = None
    status = ''
    
    conn = get_db_connection()  # Establish database connection
    cursor = conn.cursor()

    cursor.execute('SELECT status FROM Tickets WHERE row_name=? AND seat_number=? AND event_id=?', (row_name, seat_number, event_id,))
    temp_status = cursor.fetchone()
    
    if temp_status['status'] == 'RESERVED':
        status='AVAILABLE'
        # SQL query to update the ticket
        cursor.execute('UPDATE Tickets SET user_id=?, status=? WHERE row_name=? AND seat_number=? AND event_id=?', (user_id, status, row_name, seat_number, event_id,))
        conn.commit()  
        conn.close()
        return jsonify({'message': 'Ticket unreserved successfully.'})
    else:
        return jsonify({'error': 'Ticket not available'}), 404 
    
# THIS IS AT THE END
if __name__ == '__main__':
    app.run(debug=True)