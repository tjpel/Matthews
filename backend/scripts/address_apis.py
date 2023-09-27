import sys
import json
import os
from pathlib import Path

from redfin import Redfin

indent = " " * 2

address = sys.argv[1] if len(sys.argv) >= 2 else input("address: ")
output = Path(address)
if not output.exists():
    os.mkdir(output)
property_path = output.joinpath("listing.json")
avm_path = output.joinpath("avm.json")


client = Redfin()

response = client.search(address)
url = response["payload"]["exactMatch"]["url"]
initial_info = client.initial_info(url)

property_id = initial_info["payload"]["propertyId"]

mls_data = client.below_the_fold(property_id)

with open(property_path, "w") as file:
    json.dump(mls_data["payload"], file, indent=indent)
    print(f"property information -> '{property_path}'")

listing_id = initial_info["payload"]["listingId"]
avm_details = client.avm_details(property_id, listing_id)

with open(avm_path, "w") as file:
    json.dump(avm_details["payload"], file, indent=indent)
    print(f"automated valuation model details -> '{avm_path}'")