curl -X POST http://localhost:3000/api/journal/add \
   -H 'Content-Type: application/json' \
   -d '{"id":"unique-id-for-this-journal", "entry":{"title":"first entry in journal"}}'
