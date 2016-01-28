using Agregator.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Agregator.Models.Abstracts
{
    public interface IStudentRepository
    {
        IEnumerable<ShortStudentInfo> GetStudentsShort();
        IEnumerable<string> GetStudentsIdByInstitute(string institute);
        List<int> GetStudentsIdByCategory(string category);
        IEnumerable<string> GetStudentsIdByGroup(string group);
        FullStudent GetStudentInfo(int id);
        void AddNewStudent(string login, string password, string name, string secondName, string lastName, DateTime dt, string institute, string department, string group, string phone, string extra, string photo);

    }
}