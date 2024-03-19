# Eventshuffle backemd

service runs on https://eventshuffle-backend.onrender.com

## List all events
Endpoint: `/api/v1/event/list`

### Request
Method: `GET`

## Create an event
Endpoint: `/api/v1/event`

### Request
Method: `POST`

Body:

```
{
  "name": "Jake's secret party",
  "dates": [
    "2014-01-01",
    "2014-01-05",
    "2014-01-12"
  ]
}
```

## Show an event
Endpoint: `/api/v1/event/{id}`

### Request
Method: `GET`

Parameters: `id`, `long`

## Add votes to an event
Endpoint: `/api/v1/event/{id}/vote`

### Request
Method: `POST`

Parameters: `id`, `long`

Body:

```
{
  "name": "Dick",
  "votes": [
    "2014-01-01",
    "2014-01-05"
  ]
}
```

## Show the results of an event
Endpoint: `/api/v1/event/{id}/results`
Responds with dates that are **suitable for all participants**.

### Request
Method: `GET`

Parameters: `id`, `long`

# Local development
- npm install
- npm run dev
