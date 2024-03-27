#! /bin/bash

export FRONTEND_PORT=${FRONTEND_PORT:-3000}
export BACKEND_PORT=${BACKEND_PORT:-5001}
export API_BASE_URL="http://localhost:${BACKEND_PORT}/api"
export USERS_WEB_SOCKET_URL="http://localhost:${BACKEND_PORT}/users/web-socket"
export API_42_UID=${API_42_UID:-""}

npm run build

exec "$@"
