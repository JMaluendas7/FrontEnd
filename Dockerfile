FROM node:latest

WORKDIR /app/frontend

COPY . /app/frontend

RUN npm install

EXPOSE 3000

CMD ["npm", "run dev"]
