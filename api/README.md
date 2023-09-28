# Project Setup Guide

## Prerequisites

- **Python**: Required for running the project.
- **Poetry**: For Python dependency management. [Learn more](https://python-poetry.org/)
- **Postgres Database**: Can be local or port-forwarded container for development.
- **Google Cloud OAuth 2.0**: Set up credentials for the
  application. [Google Cloud Console](https://console.cloud.google.com/apis/dashboard)
    - Scopes `auth/userinfo.email` and `auth/userinfo.profile` must be enabled.

## Setup

### Environment File

1. Create a `.env` file, copied from `example.env`.
2. Place it in the `backend` directory if it conflicts with the top-level Next.js project.

### Google Cloud Credentials

- Set `GOOGLE_CLIENT_*` variables to the matching information from the Google Cloud Console.

### Postgres Database

- Ensure that `POSTGRES_*` variables point to the database you will be using.
- Use Supabase URL for this

### Backend Setup

From within the `backend` directory, execute the following commands:

1. Run `poetry install` to install dependencies.
2. Run `poetry shell` to enter the Python virtual environment.
3. Run `uvicorn app.main:app --reload` to start the development server.

## Troubleshooting

Please message the group chat if any issues are encountered during setup or development.
