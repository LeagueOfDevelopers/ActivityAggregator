using Agregator.Models.Abstracts;
using Agregator.Models.Entities;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Agregator.Models.Concrete
{
    public class MySqlRepository : IRepository
    {
        private static string Connect = "Database=ActivityBase;Data Source=eu-cdbr-azure-west-d.cloudapp.net;User Id=b50deee0f91346;Password=e3fbafcf";
        private MySqlConnection _myConnection;

        public MySqlRepository()
        {
            _myConnection = new MySqlConnection(Connect);
        }

        public IEnumerable<ShortStudentInfo> GetStudentsShort()
        {
            string CommandText = "SELECT id,Name,SecondName,LastName,Photo FROM students";
            List<ShortStudentInfo> result = new List<ShortStudentInfo>();

            MySqlCommand myCommand = new MySqlCommand(CommandText, _myConnection);
            _myConnection.Open();

            MySqlDataReader MyDataReader;
            MyDataReader = myCommand.ExecuteReader();

            while (MyDataReader.Read())
            {
                result.Add(new ShortStudentInfo
                {
                    Id = MyDataReader.GetInt32(0),
                    Name = MyDataReader.GetString(1),
                    SecondName = MyDataReader.GetString(2),
                    LastName = MyDataReader.GetString(3),
                    Photo = MyDataReader.GetString(4)
                });

            }
            MyDataReader.Close();
            _myConnection.Close();
            return result;
        }

        public IEnumerable<string> GetStudentsIdByGroup(string group)
        {
            string CommandText = string.Format("SELECT id FROM students WHERE AcademicGroup='{0}'", group);
            List<string> result = new List<string>();

            MySqlCommand myCommand = new MySqlCommand(CommandText, _myConnection);
            _myConnection.Open();

            MySqlDataReader MyDataReader;
            MyDataReader = myCommand.ExecuteReader();

            while (MyDataReader.Read())
            {
                result.Add((MyDataReader.GetInt32(0).ToString()));
            }

            MyDataReader.Close();
            _myConnection.Close();
            return result;
        }

        public IEnumerable<string> GetStudentsIdByInstitute(string institute)
        {
            string CommandText = string.Format("SELECT id FROM students WHERE Institute='{0}'", institute);
            List<string> result = new List<string>();

            MySqlCommand myCommand = new MySqlCommand(CommandText, _myConnection);
            _myConnection.Open();

            MySqlDataReader MyDataReader;
            MyDataReader = myCommand.ExecuteReader();

            while (MyDataReader.Read())
            {
                result.Add((MyDataReader.GetInt32(0).ToString()));
            }

            MyDataReader.Close();
            _myConnection.Close();
            return result;
        }

        public FullStudent GetStudentInfo(int id)
        {
            string CommandText = string.Format("SELECT * FROM students WHERE id={0}", id);
            FullStudent student = null;

            MySqlCommand myCommand = new MySqlCommand(CommandText, _myConnection);
            _myConnection.Open();

            MySqlDataReader MyDataReader;
            MyDataReader = myCommand.ExecuteReader();

            while (MyDataReader.Read())
            {
                student = new FullStudent
                {
                    Id = MyDataReader.GetInt32(0),
                    Name = MyDataReader.GetString(1),
                    SecondName = MyDataReader.GetString(2),
                    LastName = MyDataReader.GetString(3),
                    DateOfBirthday = MyDataReader.GetString(4),
                    Institute = MyDataReader.GetString(5),
                    Department = MyDataReader.GetString(6),
                    AcademicGroup = MyDataReader.GetString(7),
                    PhoneNumber = MyDataReader.GetString(8),
                    ExtraInfo = MyDataReader.GetString(9),
                    Photo = MyDataReader.GetString(10)
                };

            }
            MyDataReader.Close();
            _myConnection.Close();
            return student;
        }

        public List<int> GetStudentsIdByCategory(string category)
        {
            string CommandText = string.Format("SELECT DISTINCT students.id FROM students,achievements WHERE achievements.Student_id = students.id and EventType = '{0}'", category);

            MySqlCommand myCommand = new MySqlCommand(CommandText, _myConnection);
            _myConnection.Open();

            MySqlDataReader MyDataReader;
            MyDataReader = myCommand.ExecuteReader();

            List<int> result = new List<int>();

            while (MyDataReader.Read())
            {
                result.Add(MyDataReader.GetInt32(0));
            }

            MyDataReader.Close();
            _myConnection.Close();
            return result;
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

        public void AddNewStudent(string login, string password, string name, string secondName, string lastName, DateTime dt, string institute, string department, string group, string phone, string extra, string photo)
        {
          
            string date = dt.ToString().Substring(0, 10);
            string CommandText = string.Format("INSERT INTO students(students.Name, SecondName, LastName, DateOfBirthday, Institute, Department, AcademicGroup, PhoneNumber, ExtraInfo, Photo, Login, students.Password) VALUES('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}'); ", name, secondName, lastName, date, institute, department, group, phone, extra, phone, login, password);
                                        
            MySqlCommand myCommand2 = new MySqlCommand(CommandText, _myConnection);
            _myConnection.Open();
            myCommand2.ExecuteNonQuery();
            _myConnection.Close();
        }



    }
}