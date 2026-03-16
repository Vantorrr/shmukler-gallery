import { groq } from 'next-sanity'

export const ARTWORKS_QUERY = groq`*[_type == "artwork"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  mainImage,
  price,
  status,
  medium,
  "artist": artist->name,
  "artistSlug": artist->slug.current
}`

export const ARTWORK_BY_SLUG_QUERY = groq`*[_type == "artwork" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  mainImage,
  gallery,
  price,
  dimensions,
  medium,
  status,
  description,
  "artist": artist->name,
  "artistSlug": artist->slug.current
}`

export const ARTISTS_QUERY = groq`*[_type == "artist"] | order(name asc) {
  _id,
  name,
  slug,
  portrait
}`

export const ARTIST_BY_SLUG_QUERY = groq`*[_type == "artist" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  bio,
  portrait,
  "artworks": *[_type == "artwork" && references(^._id)] | order(_createdAt desc) {
    _id,
    title,
    slug,
    mainImage,
    price,
    status,
    "artist": ^.name
  }
}`

export const EXHIBITIONS_QUERY = groq`*[_type == "exhibition"] | order(startDate desc) {
  _id,
  title,
  slug,
  startDate,
  endDate,
  coverImage,
  location
}`

export const EVENTS_QUERY = groq`*[_type == "event"] | order(date asc) {
  _id,
  title,
  slug,
  date,
  time,
  format,
  price,
  description,
  location,
  category
}`

export const EXHIBITION_BY_SLUG_QUERY = groq`*[_type == "exhibition" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  startDate,
  endDate,
  coverImage,
  location,
  description,
  "artworks": featuredArtworks[]->{
    _id,
    title,
    slug,
    mainImage,
    price,
    status,
    "artist": artist->name
  }
}`
