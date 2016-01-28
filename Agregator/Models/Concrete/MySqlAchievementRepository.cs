using Agregator.Models.Abstracts;
using Agregator.Models.Entities;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Agregator.Models.Concrete
{
    public class MySqlAchievementRepository : IAchievementRepository
    {
        private static string Connect = Properties.Settings.Default.ConnectionString;
        private MySqlConnection _myConnection;

        public MySqlAchievementRepository()
        {
            _myConnection = new MySqlConnection(Connect);
        }

        public int GetAmountOfAchievementsById(int id)
        {
            string CommandText = string.Format("SELECT Count(achievements.id) FROM achievements WHERE achievements.Student_id = '{0}'", id);
            int result = 0;

            MySqlCommand myCommand = new MySqlCommand(CommandText, _myConnection);
            _myConnection.Open();

            MySqlDataReader MyDataReader;
            MyDataReader = myCommand.ExecuteReader();

            while (MyDataReader.Read())
            {
                result += MyDataReader.GetInt32(0);

            }
            MyDataReader.Close();
            _myConnection.Close();
            return result;
        }

        public AchievementBase GetAchievementById(int id)
        {
            string CommandText = string.Format("SELECT * FROM achievements WHERE achievements.id = '{0}'", id);
            AchievementBase _achievement = null;

            MySqlCommand myCommand = new MySqlCommand(CommandText, _myConnection);
            _myConnection.Open();

            MySqlDataReader MyDataReader;
            MyDataReader = myCommand.ExecuteReader();

            while (MyDataReader.Read())
            {
                if (MyDataReader.GetString(2) == "Организация")
                    _achievement = new OrganizationAchievement
                    {
                        Id = MyDataReader.GetInt32(0),
                        EventName = MyDataReader.GetString(1),
                        EventType = MyDataReader.GetString(2),
                        EventLevel = MyDataReader.GetString(4),
                        OrganizationFunctions = MyDataReader.GetString(7),
                        IsConfirmed = MyDataReader.GetBoolean(8),
                        ConfirmationPerson = MyDataReader.GetString(9),
                        ConfirmationImage = MyDataReader.GetString(10),
                        EventDate = MyDataReader.GetDateTime(11),
                    };
                else
                    _achievement = new TypicalAchievement
                    {
                        Id = MyDataReader.GetInt32(0),
                        EventName = MyDataReader.GetString(1),
                        EventType = MyDataReader.GetString(2),
                        Result = MyDataReader.GetString(3),
                        EventLevel = MyDataReader.GetString(4),
                        IsIndividual = MyDataReader.GetString(6),
                        IsConfirmed = MyDataReader.GetBoolean(8),
                        ConfirmationPerson = MyDataReader.GetString(9),
                        ConfirmationImage = MyDataReader.GetString(10),
                        EventDate = MyDataReader.GetDateTime(11),
                    };


            }

            MyDataReader.Close();
            _myConnection.Close();
            return _achievement;

        }

        public void ConfirmAchievement(int id)
        {
            string CommandText = string.Format("UPDATE achievements SET IsConfirmed = 1 WHERE achievements.id = {0}", id);

            MySqlCommand myCommand = new MySqlCommand(CommandText, _myConnection);
            _myConnection.Open();
            myCommand.ExecuteNonQuery();
            _myConnection.Close();
        }

        public void AddNewAchievement(string eventName, string eventType, string result, string eventLevel, int student_id, string isIndividual, string organizationFunctions, bool isConfirmed, string confirmationPerson, string confirmationImage, DateTime eventDate)
        {
            string date = eventDate.ToString().Substring(0, 10);
            int isConfirmedToBit = 0;
            if (isConfirmed)
                isConfirmedToBit = 1;
            else isConfirmedToBit = 0;

            string CommandText = string.Format("INSERT INTO achievements(achievements.EventName, EventType, Result, EventLevel, Student_id, IsIndividual, OrganizationFunctions, IsConfirmed, ConfirmationPerson, ConfirmationImage, EventDate) VALUES('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}'); ", eventName, eventType, result, eventLevel, student_id, isIndividual, organizationFunctions, isConfirmedToBit, confirmationPerson, confirmationImage, date);

            MySqlCommand myCommand2 = new MySqlCommand(CommandText, _myConnection);
            _myConnection.Open();
            myCommand2.ExecuteNonQuery();
            _myConnection.Close();
        }
    }
}