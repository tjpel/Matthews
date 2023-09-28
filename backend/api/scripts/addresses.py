import json
import sqlite3

from redfin import Redfin


def autocomplete_address(address_input, x=5):
    # Connect to SQLite database
    conn = sqlite3.connect("../addressdb_autocomplete.sqlite")
    cursor = conn.cursor()

    # Split the input into number and street
    parts = address_input.split(" ", 1)
    number_part = parts[0] if len(parts) > 0 else ""
    street_part = parts[1] if len(parts) > 1 else ""

    print(f"Number part: {number_part}")  # Debugging line
    print(f"Street part: {street_part}")  # Debugging line

    # Prepare the SQL query for autocomplete
    query = f"""
    SELECT id, zipcode, number, street, city, state
    FROM addresses
    WHERE LOWER(street) LIKE LOWER(?) AND LOWER(number) LIKE LOWER(?)
    LIMIT {x};
    """
    print(f"Executing query: {query}")  # Debugging line

    # Perform the query
    cursor.execute(query, (f"%{street_part}%", f"%{number_part}%"))
    results = cursor.fetchall()
    print(f"Query results: {results}")  # Debugging line

    # Close the connection
    conn.close()

    # Prepare the list of matching addresses
    matching_addresses = []
    for result in results:
        id, zipcode, number, street, city, state = result
        address_str = f"{number} {street}, {city}, {state} {zipcode}"
        matching_addresses.append(address_str.strip())

    return matching_addresses


def filter_california_addresses():
    # Connect to the existing SQLite database
    conn_source = sqlite3.connect("../addressdb_autocomplete.sqlite")
    cursor_source = conn_source.cursor()

    # Create a new SQLite database for California addresses
    conn_dest = sqlite3.connect("../addressdb_california.sqlite")
    cursor_dest = conn_dest.cursor()

    # Create the addresses table in the new database
    cursor_dest.execute(
        """
    CREATE TABLE IF NOT EXISTS addresses (
        id INTEGER PRIMARY KEY,
        zipcode TEXT,
        number TEXT,
        street TEXT,
        city TEXT,
        state TEXT
    );
    """
    )

    # Fetch all addresses from the existing database
    cursor_source.execute(
        "SELECT id, zipcode, number, street, city, state FROM addresses WHERE state = 'CA';"
    )
    ca_addresses = cursor_source.fetchall()

    # Insert California addresses into the new database
    cursor_dest.executemany(
        """
    INSERT INTO addresses (id, zipcode, number, street, city, state)
    VALUES (?, ?, ?, ?, ?, ?);
    """,
        ca_addresses,
    )

    # Commit changes and close connections
    conn_dest.commit()
    conn_source.close()
    conn_dest.close()


def fetch_addresses_from_db():
    conn = sqlite3.connect("../addressdb_california.sqlite")
    cursor = conn.cursor()
    cursor.execute("SELECT number, street, city, state, zipcode FROM addresses;")
    addresses = cursor.fetchall()
    conn.close()
    return addresses


def query_redfin_and_store(addresses, output_file):
    client = Redfin()

    # Initialize the output file as an empty list if it doesn't exist
    try:
        with open(output_file, "r") as f:
            existing_data = json.load(f)
    except FileNotFoundError:
        existing_data = []
        with open(output_file, "w") as f:
            json.dump(existing_data, f, indent=2)

    queried_addresses = set(entry["address"] for entry in existing_data)

    for address_tuple in addresses:
        number, street, city, state, zipcode = address_tuple
        full_address = f"{number} {street}, {city}, {state} {zipcode}"

        if full_address in queried_addresses:
            print(f"Skipping {full_address}, already queried.")
            continue

        try:
            response = client.search(full_address)
            url = response["payload"]["exactMatch"]["url"]
            initial_info = client.initial_info(url)

            property_id = initial_info["payload"]["propertyId"]
            mls_data = client.below_the_fold(property_id)

            listing_id = initial_info["payload"]["listingId"]
            avm_details = client.avm_details(property_id, listing_id)

            queried_address = {
                "address": full_address,
                "response": {
                    "initial_info": initial_info,
                    "mls_data": mls_data,
                    "avm_details": avm_details,
                },
            }

            # Append the new queried address to the existing data
            existing_data.append(queried_address)

            # Update the set of queried addresses
            queried_addresses.add(full_address)

            # Store the updated data
            with open(output_file, "w") as f:
                json.dump(existing_data, f, indent=2)

            print(f"Queried and stored data for {full_address}")

        except Exception as e:
            print(f"Failed to query {full_address}: {e}")


if __name__ == "__main__":
    addresses = fetch_addresses_from_db()
    output_file = "redfin_responses.json"
    query_redfin_and_store(addresses, output_file)

    # filter_california_addresses()
    # print("Filtered California addresses and saved to a new SQLite database.")

    # address_input = "5 huan ave"  # Replace with the address input for testing
    # x = 5  # Number of autocomplete suggestions
    # suggestions = autocomplete_address(address_input, x)
    # print("Autocomplete Suggestions:")
    # for i, suggestion in enumerate(suggestions, 1):
    #     print(f"{i}. {suggestion}")
