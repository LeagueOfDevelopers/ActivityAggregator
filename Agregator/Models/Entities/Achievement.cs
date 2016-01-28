using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Agregator.Models.Entities
{
    public class Achievement
    {
        
        public string EventName { get; set; }
        public string EventType { get; set; }
        public string Result { get; set; }
        public string EventLevel { get; set; }
        public int Student_id { get; set; }
        public string IsIndividual { get; set; }
        public string OrganizationFunctions { get; set; }
        public bool IsConfirmed { get; set; }
        public string ConfirmationPerson { get; set; }
        public string ConfirmationImage { get; set; }
        public DateTime EventDate { get; set; }
    }
}