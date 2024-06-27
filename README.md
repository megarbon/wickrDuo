# wickrDuo

wickrDuo is a simple chat application designed to facilitate communication with friends in a private environment using WebSockets. It is intended to be deployed on a server with SSL/TLS encryption. The application utilizes Docker for containerization, making it easy to set up and run in different environments. Styling is achieved using Tailwind CSS.

## Features

- Real-time messaging using WebSockets.
- Private chat rooms for secure communication.
- User authentication (not implemented yet).
- Deployment-ready using Docker containers.
- Designed with responsive and modern UI using Tailwind CSS.

## Prerequisites

To run wickrDuo locally or on a server, ensure you have the following installed:

- Docker
- Docker Compose

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/megarbon/wickrDuo.git
cd wickrDuo
```

### Build and Run with Docker Compose

```bash
docker-compose up --build
```

This command builds the Docker images defined in the `docker-compose.yml` file and starts the application containers (`nodeapp`, `redis`, and `nginx`).

### Accessing the Application

- Once the containers are up and running, access the application:
  - **HTTP:** Open a web browser and go to `http://localhost` or `http://your-server-ip`.
  - **HTTPS:** Open a web browser and go to `https://localhost` or `https://your-server-ip`.

### Stopping the Application

To stop the application and remove containers:

```bash
docker-compose down
```

## Configuration

### SSL Certificates

- Ensure you have SSL/TLS certificates (`wickrduo.crt` and `wickrduo.key`) placed in the `nginx/ssl/` directory. These certificates are necessary for HTTPS.

### Environment Variables

- The `REDIS_URL` environment variable in `docker-compose.yml` should point to your Redis instance.
- Adjust any other environment variables or configurations in `docker-compose.yml` or `nginx/nginx.conf` as per your requirements.

## Customization

- **Styling:** Customize the appearance using Tailwind CSS. Styles are defined in the HTML files or separate CSS files.
- **Functionality:** Extend functionality by modifying the Node.js application (`server.js`) or WebSocket logic (`public/js/main.js`).

## Contributing

Contributions are welcome! Feel free to fork the repository, create pull requests, or open issues for bugs, feature requests, or improvements.

