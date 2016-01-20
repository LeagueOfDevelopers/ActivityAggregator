using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Agregator.Models.Entities
{
    public class User
    {
        public string Login { get; set; }
        public string Password { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public string SecondName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirthday { get; set; }
        public string Institute { get; set; }
        public string Department { get; set; }
        public string AcademicGroup { get; set; }
        public string PhoneNumber { get; set; }
        public string ExtraInfo { get; set; }
        public string Photo { get; set; }
        
    }
}