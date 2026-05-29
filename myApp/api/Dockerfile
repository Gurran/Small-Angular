FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["SmallAngularApi.csproj", "./"]
RUN dotnet restore "SmallAngularApi.csproj"

COPY . ./
RUN dotnet publish "SmallAngularApi.csproj" -c Release -o /app/publish /p:UseStaticWebAssets=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet", "SmallAngularApi.dll"]
