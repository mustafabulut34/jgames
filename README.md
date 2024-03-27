## Django & React Project JGames

### Usage

1. Clone the project


2. Start Docker with the following command:

    ```bash
    make docker_up
    ```

3. Stop Docker with the following command:

    ```bash
    make docker_down
    ```

4. Create migrations in Django to make changes to the database:

    ```bash
    make docker_makemigrations
    ```

5. Apply migrations to the database:

    ```bash
    make docker_migrate
    ```

6. Create test users in Django (optional):

    ```bash
    make docker_create_users
    ```

### Makefile Commands

- `docker_up`: Starts Docker.
- `docker_down`: Stops Docker.
- `docker_makemigrations`: Creates Django migrations.
- `docker_migrate`: Applies Django migrations.
- `docker_create_users`: Creates test users in Django (optional).
