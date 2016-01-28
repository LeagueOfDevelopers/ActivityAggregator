using Agregator.Models.Abstracts;
using Agregator.Models.Entities;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Agregator.Models.Concrete
{
    public class MySqlStudentRepository : IStudentRepository
    {
        private static string Connect = Properties.Settings.Default.ConnectionString;
        private MySqlConnection _myConnection;

        public MySqlStudentRepository()
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