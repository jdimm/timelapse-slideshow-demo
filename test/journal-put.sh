curl -X POST http://localhost:3000/api/journal/put \
   -H 'Content-Type: application/json' \
   -d '{"id":"unique-id-for-this-journal", "journal":[{"title":"the put api replaces the entire content of the journal"}]}'
