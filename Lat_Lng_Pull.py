
#%%
import pandas as pd
import requests
import logging
import time


#%%
# logger = logging.getLogger("root")
# logger.setLevel(logging.DEBUG)


#%%
# ch = logging.StreamHandler()
# ch.setLevel(logging.DEBUG)
# logger.addHandler(ch)


#%%
API_KEY = None


#%%
output_filename = './Data/Coord.csv'


#%%
input_filename = "./Data/RoughCBL.csv"


#%%
address_column_name = "Address"


#%%
RETURN_FULL_RESULTS = False


#%%
data = pd.read_csv(input_filename, encoding='utf8')


#%%
addresses = data[address_column_name].tolist()


#%%
def get_google_results(address, api_key=None, return_full_response=False):
    geocode_url = "https://maps.googleapis.com/maps/api/geocode/json?address={}".format(address)
    if api_key is not None:
        geocode_url = geocode_url + "&key={}".format(api_key)
        results = requests.get(geocode_url)
    # Results will be in JSON format - convert to dict using requests functionality
        results = results.json()
        if len(results['results']) == 0:
                output = {
            "formatted_address" : None,
            "latitude": None,
            "longitude": None,
            "accuracy": None,
            "google_place_id": None,
            "type": None,
            "postcode": None
        }
        else:    
            answer = results['results'][0]
            output = {
            "formatted_address" : answer.get('formatted_address'),
            "latitude": answer.get('geometry').get('location').get('lat'),
            "longitude": answer.get('geometry').get('location').get('lng'),
            "accuracy": answer.get('geometry').get('location_type'),
            "google_place_id": answer.get("place_id"),
            "type": ",".join(answer.get('types')),
            "postcode": ",".join([x['long_name'] for x in answer.get('address_components') 
                                  if 'postal_code' in x.get('types')])
        }
        
            output['input_string'] = address
            output['number_of_results'] = len(results['results'])
            output['status'] = results.get('status')
            if return_full_response is True:
                    output['response'] = results
    
    return output


#%%
addresses


#%%
results = []
# Go through each address in turn
for address in addresses:
    # While the address geocoding is not finished:
    geocoded = False
    while geocoded is not True:
        # Geocode the address with google
        try:
            geocode_result = get_google_results(address, API_KEY, return_full_response=RETURN_FULL_RESULTS)
            print(geocode_result)
            results.append(geocode_result)
        except Exception as e:
            print(e)
            print("Major error with {}".format(address))
            print("Skipping!")
            geocoded = True
            
        # If we're over the API limit, backoff for a while and try again later.
#         if geocode_result['status'] == 'OVER_QUERY_LIMIT':
#             logger.info("Hit Query Limit! Backing off for a bit.")
#             time.sleep(BACKOFF_TIME * 60) # sleep for 30 minutes
#             geocoded = False
#         else:
#             # If we're ok with API use, save the results
#             # Note that the results might be empty / non-ok - log this
#             if geocode_result['status'] != 'OK':
#                 logger.warning("Error geocoding {}: {}".format(address, geocode_result['status']))
#             logger.debug("Geocoded: {}: {}".format(address, geocode_result['status']))
#             results.append(geocode_result)           
        geocoded = True

    # Print status every 100 addresses
#     if len(results) % 100 == 0:
    print("Completed {} of {} address".format(len(results), len(addresses)))
            

# All done
print("Finished geocoding all addresses")
# Write the full results to csv using the pandas library.
pd.DataFrame(results).to_csv(output_filename, encoding='utf8')


#%%
results


#%%



