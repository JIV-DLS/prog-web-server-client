touch .env
and put

DB_CONN_STRING="__YOUR__DB__CONNECTION__STRING"
DB_NAME="gasesDB"
GASES_COLLECTION_NAME="gases"

node install
npm run localStart
