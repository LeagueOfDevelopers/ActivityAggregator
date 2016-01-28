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
    }
}
