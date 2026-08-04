FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY pom.xml ./
COPY src ./src

RUN mvn -q -DskipTests package

EXPOSE 8080

CMD ["java", "-jar", "target/market-api-0.0.1-SNAPSHOT.jar"]
