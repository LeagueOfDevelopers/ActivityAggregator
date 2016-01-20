using Agregator.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using MySql.Data;
using MySql.Data.MySqlClient;
using Agregator.Models.Abstracts;
using Agregator.Models.Concrete;

namespace Agregator.Controllers
{
    public class StudentController : ApiController
    {
        IRepository _repository;

        public StudentController()
        {
            _repository = new MySqlRepository();      
        }
             

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public IEnumerable<ShortStudentInfo> GetAllStudentsShortInfo()
        {
            return _repository.GetStudentsShort();
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public IEnumerable<string> GetIdStudentsByGroup(string group)
        {
           return _repository.GetStudentsIdByGroup(group);
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public IEnumerable<string> GetIdStudentsByInstitute(string institute)
        {
            return _repository.GetStudentsIdByInstitute(institute);
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public FullStudent GetStudentById(int id)
        {
            return _repository.GetStudentInfo(id);
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public List<int> GetAllStudentsIdByCategory(string category)
        {
            return _repository.GetStudentsIdByCategory(category);
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        public void PostToRegister([FromBody]User student)
        {
            _repository.AddNewStudent(student.Login, student.Password, student.Name, student.SecondName, student.LastName, student.DateOfBirthday, student.Institute, student.Department, student.AcademicGroup, student.PhoneNumber, student.ExtraInfo, student.Photo);
        }
        

    }
}
