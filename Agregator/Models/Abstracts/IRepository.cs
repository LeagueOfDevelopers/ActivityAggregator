using Agregator.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Agregator.Models.Abstracts
{
    public interface IRepository
    {
        IEnumerable<ShortStudentInfo> GetStudentsShort();
        IEnumerable<string> GetStudentsIdByInstitute(string institute);
        IEnumerable<string> GetStudentsIdByGroup(string group);
        FullStudent GetStudentInfo(int id);
        List<int> GetStudentsIdByCategory(string category);
        int GetAmountOfAchievementsById(int id);
        AchievementBase GetAchievementById(int id);
        void ConfirmAchievement(int id);
        void AddNewStudent(string login, string password, string name, string secondName, string lastName, DateTime dt, string institute, string department, string group, string phone, string extra, string photo);

    }
}