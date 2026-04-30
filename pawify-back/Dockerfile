FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
ARG PORT=8080

ENV PORT=${PORT}

COPY --from=build /app/target/*.jar /app/app.jar

EXPOSE ${PORT}
CMD ["sh", "-c", "java -jar /app/app.jar --server.port=${PORT} --spring.profiles.active=prod"]