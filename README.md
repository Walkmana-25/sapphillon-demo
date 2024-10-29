# Sapphilon Demo

## How to run

### Requirements

- Docker
- Docker Compose
- Open AI API Key

### Steps

1. Clone the repository
2. Create a `.env` file or copy `example.env` to `.env` in the root directory with the following content:

    ```env
    OPENAI_API_KEY=<YOUR_OPEN_AI_API_KEY>
    OPENAI_BASE_URL=https://api.openai.com/v1/

    ```

3. Run the following command to start the application:

    ```bash
    docker-compose up
    ```

4. The application will be available at `http://localhost:8000`

## License

This project is licensed under the MPL License. See the LICENSE file for details.

## Acknowledgement

This project was generated from [FastAPI-Template](https://github.com/solufit/fastapi-template) by [solufit](https://solufit.net)
