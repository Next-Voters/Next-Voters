import { SupportedRegionDetails } from "@/types/supported-regions"

export const supportedRegionDetails: SupportedRegionDetails[] = [
  {
    "code": "CA",
    "name": "Canada",
    "politicalParties": [
      "Liberal Party",
      "Conservative Party"
    ],
    "collectionName": "collection-ca",
    "type": "country"
  },
  {
    "code": "US",
    "name": "United States",
    "politicalParties": [
      "Democratic Party",
      "Republican Party"
    ],
    "collectionName": "collection-us",
    "type": "country"
  }
]

export default supportedRegionDetails;
