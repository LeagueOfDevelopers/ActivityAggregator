using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Agregator.Models.Entities
{
    public class ShortStudentInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string SecondName { get; set; }
        public string LastName { get; set; }
        public string Photo { get; set; }
    }
}