curl -X POST http://localhost:3000/api/journal/update \
   -H 'Content-Type: application/json' \
   -d '{"id":"unique-id-for-this-journal", "index": 0, "entry":{"title":"replacing the first entry in journal"}}'
