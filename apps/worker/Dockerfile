# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

COPY . .

RUN dotnet publish -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/runtime:8.0

WORKDIR /app

# Install required libraries
RUN apt-get update && apt-get install -y \
    libkrb5-3 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "worker.dll"]
