using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WorldCitiesAPI.Controllers;
using WorldCitiesAPI.Data;
using WorldCitiesAPI.Data.Models;

namespace WorldCitiesAPI.Tests
{
    public class CitiesController_Test
    {
        /// <summary>
        /// Test GetCity() method
        /// </summary>
        /// <returns></returns>
        [Fact]
        public async Task GetCity()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "WorldCities")
                .Options;
            var context = new ApplicationDbContext(options);
            context.Add(new City()
            {
                Id = 1,
                CountryId = 1,
                Lat = 1,
                Lon = 1,
                Name = "TestCity1"
            });
            await context.SaveChangesAsync();

            var controller = new CitiesController(context);
            City? city_existing = null;
            City? city_notExisting = null;

            city_existing = (await controller.GetCity(1)).Value;
            city_notExisting = (await controller.GetCity(2)).Value;

            Assert.NotNull(city_existing);
            Assert.Null(city_notExisting);
        }
    }
}
