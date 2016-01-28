using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agregator.Models.Abstracts
{
    public interface IAchievementRepository 
    {
        int GetAmountOfAchievementsById(int id);
        AchievementBase GetAchievementById(int id);
        void ConfirmAchievement(int id);
        void AddNewAchievement(string eventName, string eventType, string result, string eventLevel, int student_id, string isIndividual, string organizationFunctions, bool isConfirmed, string confirmationPerson, string confirmationImage, DateTime eventDate);
    }
}
