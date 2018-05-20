export type Address = {
  street: string,
  city: ?string,
  postcode: string,
  country: string,
  geoloc: {
    lat: string,
    lng: string,
  },
}

export const parseAddress = (x: Object): Address => {
  const street = x.locale_names[0]
  const administrative =
    x.administrative && x.administrative[0] !== street
      ? x.administrative[0]
      : null
  const city = x.city && x.city[0] !== street ? x.city[0] : administrative
  const country = x.country
  const postcode = x.postcode && x.postcode[0]

  const address = {
    country,
    postcode,
    city,
    street,
    geoloc: x._geoloc,
  }

  return address
}
