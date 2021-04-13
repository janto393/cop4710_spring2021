import geocoder, { Entry } from "node-geocoder"
import node_geocoder from "node-geocoder";

export interface Coordinates
{
	longitude?: number,
	latitude?: number
}

/**
 * Fetch the coordinates using a TomTom api and turn a street address to geolocation
 * coordinates to plot on a map
 */
async function getLattitudeAndLongitude(address: string, city: string, state: string, zip: string): Promise<Coordinates>
{
	let coordinates: Coordinates = {}

	if (process.env.TOMTOM_KEY === undefined)
	{
		console.warn("TOM TOM api key not set");
		return coordinates;
	}

	const options: geocoder.GenericOptions = {
		provider: "tomtom",
		apiKey: process.env.TOMTOM_KEY
	};

	const geocoder: geocoder.Geocoder = node_geocoder(options);

	let locations: Array<Entry> = await geocoder.geocode(address + " " + city + " " + state + " " + zip);

	// parse the data of the first match
	if (locations.length > 0)
	{
		if (locations[0].latitude !== undefined)
		{
			coordinates.latitude = locations[0].latitude;
		}

		if (locations[0].longitude !== undefined)
		{
			coordinates.longitude = locations[0].longitude;
		}
	}

	return coordinates;
}

export default getLattitudeAndLongitude;
