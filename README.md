# Trivial TODO List App: Docker Compose Example

This app uses a React frontend and a NodeJS backend with a MySQL (MariaDB) database to demonstrate how Docker Compose
can be used to provision and run an entire development environment.

## Install Docker Desktop

Follow the installation instructions for your operating system.

https://docs.docker.com/get-started/get-docker/

## Docker/Docker Compose CLI Reference

Read about the docker compose CLI commands, file format, and subcommands here:
https://docs.docker.com/reference/cli/docker/compose/

The reference for the docker CLI is also available here:
https://docs.docker.com/reference/cli/docker/

### React application with a NodeJS backend and a MySQL (MariaDB) database

Project structure:
```
.
├── backend
│   ├── Dockerfile
│   ...
├── db
│   └── password.txt
├── compose.yaml
├── frontend
│   ├── ...
│   └── Dockerfile
└── README.md
```

[_compose.yaml_](compose.yaml)

The compose file defines an application with three services `frontend`, `backend` and `db`.
When deploying the application, docker compose maps port 3000 of the frontend service container to port 3000 of the host as specified in the file.
Make sure port 3000 on the host is not already being in use.

> ℹ️ **_INFO_**  
> For compatibility purpose between `AMD64` and `ARM64` architecture, we use a MariaDB as database instead of MySQL.  
> You still can use the MySQL image by uncommenting the following line in the Compose file   
> `#image: mysql:8.0.27`

## Deploy with docker compose

You can use the `-d` flag to run in detached mode or exclude the flag to see all the output that gets logged by each container.
```
$ docker compose up -d
```

## Expected result

Listing containers must show multiple containers running.
```
$ docker ps
```

After the application starts, navigate to `http://localhost:3000` in your web browser.

The backend service container has port 80 mapped to 80 on the host.
```
$ curl localhost:80
```

Stop and remove the containers
```
$ docker compose down
```
