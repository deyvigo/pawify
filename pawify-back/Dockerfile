FROM maven:3.9.9-eclipse-temurin-17-focal AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-alpine
ARG PORT=8080

ENV PORT=${PORT}

COPY --from=build /app/target/*.jar /app/app.jar

EXPOSE ${PORT}
CMD ["sh", "-c", "java -jar /app/app.jar --server.port=${PORT} --spring.profiles.active=prod"]