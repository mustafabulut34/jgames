FROM python:3.8-alpine

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app/backend

COPY requirements.txt /app/backend/

# Install psycopg2 package using Alpine package manager
RUN apk add --virtual .build-deps --no-cache postgresql-libs postgresql-dev gcc python3-dev musl-dev && \
    pip install --no-cache-dir -r requirements.txt && \
    apk --purge del .build-deps

COPY . /app/backend/

CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]
