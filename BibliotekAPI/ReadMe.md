# Biblioteka API
## Technologie

- ASP.NET Core 8.0
- Entity Framework Core
- SQLite 
	dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 9.0.5  
	dotnet add package Microsoft.EntityFrameworkCore.Tools
	dotnet add package Microsoft.EntityFrameworkCore.Design --version 9.0.5
	opcjonalnie: dotnet tool install --global dotnet-ef

- Swagger

## Wymagania

- .NET 8.0 SDK

## Jak uruchomić

1. Pobierz kod:
git clone <adres-repozytorium>
cd BibliotekaAPI

2. Zainstaluj pakiety:
dotnet restore

3. Utwórz bazę danych:
dotnet ef migrations add InitialCreate
dotnet ef database update

4. Uruchom aplikację:
dotnet run

5. Otwórz przeglądarkę:
   - Swagger: `https://localhost:5000/swagger`
	- Bibioteka: http://localhost:5000/
