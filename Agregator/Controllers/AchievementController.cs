using Agregator.Models.Abstracts;
using Agregator.Models.Concrete;
using Agregator.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Agregator.Controllers
{
    public class AchievementController : ApiController
    {
        IAchievementRepository _repository;

        public AchievementController()
        {
            _repository = new MySqlAchievementRepository();
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public int GetAmountOfAchievements(int Student_id)
        {
            return _repository.GetAmountOfAchievementsById(Student_id);
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public AchievementBase GetAchievement(int id)
        {
            return _repository.GetAchievementById(id);
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        public void PostToConfirm([FromBody]int id)
        {
            _repository.ConfirmAchievement(id);
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        public void PostToAddAchievement([FromBody]Achievement newAchievement)
        {
            _repository.AddNewAchievement(newAchievement.EventName, newAchievement.EventType, newAchievement.Result, newAchievement.EventLevel, newAchievement.Student_id, newAchievement.IsIndividual, newAchievement.OrganizationFunctions, newAchievement.IsConfirmed, newAchievement.ConfirmationPerson, newAchievement.ConfirmationImage, newAchievement.EventDate);
        }

    }
}
