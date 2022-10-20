using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using WorldCitiesAPI.Data.DTO;
using WorldCitiesAPI.Data.Models;

namespace WorldCitiesAPI.Data.GpaphQL
{
    public class Mutation
    {
        [Serial]
        [Authorize(Roles = "RegisteredUser")]
        public async Task<City> AddCity(
            [Service] ApplicationDbContext context, CityDTO cityDTO)
        {
            var city = new City
            {
                Name = cityDTO.Name,
                Lat = cityDTO.Lat,
                Lon = cityDTO.Lon,
                CountryId = cityDTO.CountryId
            };
            context.Cities.Add(city);
            await context.SaveChangesAsync();
            return city;
        }

        [Serial]
        [Authorize(Roles = "RegisteredUser")]
        public async Task<City> UpdateCity(
            [Service] ApplicationDbContext context, CityDTO cityDTO)
        {
            var city = await context.Cities
                .Where(c => c.Id == cityDTO.Id)
                .FirstOrDefaultAsync();

            if (city == null)
            {
                throw new NotSupportedException();
            }

            city.Name = cityDTO.Name;
            city.Lat = cityDTO.Lat;
            city.Lon = cityDTO.Lon;
            city.CountryId = cityDTO.CountryId;
            context.Cities.Update(city);
            await context.SaveChangesAsync();
            return city;
        }

        [Serial]
        [Authorize(Roles = "Administrator")]
        public async Task DeleteCity(
            [Service] ApplicationDbContext context, int id)
        {
            var city = await context.Cities
                .FirstOrDefaultAsync(x => x.Id == id);
            if (city != null)
            {
                context.Cities.Remove(city);
                await context.SaveChangesAsync();
            }
        }

        [Serial]
        [Authorize(Roles = "RegisteredUser")]
        public async Task<Country> AddCountry(
            [Service] ApplicationDbContext context, CountryDTO countryDTO)
        {
            var country = new Country
            {
                Name = countryDTO.Name,
                ISO2 = countryDTO.ISO2,
                ISO3 = countryDTO.ISO3,
            };
            context.Countries.Add(country);
            await context.SaveChangesAsync();
            return country;
        }

        [Serial]
        [Authorize(Roles = "RegisteredUser")]
        public async Task<Country> UpdateCountry(
            [Service] ApplicationDbContext context, CountryDTO countryDTO)
        {
            var country = await context.Countries
                .FirstOrDefaultAsync(c => c.Id == countryDTO.Id);

            if (country == null)
            {
                throw new NotSupportedException();
            }

            country.Name = countryDTO.Name;
            country.ISO2 = countryDTO.ISO2;
            country.ISO3 = countryDTO.ISO3;
            context.Countries.Update(country);
            await context.SaveChangesAsync();
            return country;
        }

        [Serial]
        [Authorize(Roles = "Administrator")]
        public async Task DeleteCountry(
            [Service] ApplicationDbContext context, int id)
        {
            var country = await context.Countries
                .FirstOrDefaultAsync(x => x.Id == id);
            if (country != null)
            {
                context.Countries.Remove(country);
                await context.SaveChangesAsync();
            }
        }
    }
}
