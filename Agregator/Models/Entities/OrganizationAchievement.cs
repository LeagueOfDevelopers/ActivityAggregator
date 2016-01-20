using Agregator.Models.Abstracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Agregator.Models.Entities
{
    public class OrganizationAchievement : AchievementBase
    {
        public int Id { get; set; }
        public string EventName { get; set; }
        public string EventType { get; set; }
        public string EventLevel { get; set; }
        public string OrganizationFunctions { get; set; }
        public bool IsConfirmed { get; set; }
        public string ConfirmationPerson { get; set; }
        public string ConfirmationImage { get; set; }
        public DateTime EventDate { get; set; }
    }
}