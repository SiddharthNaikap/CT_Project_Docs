import pyodbc

class ContactService:

    def Add(self,c):

        # connection = pyodbc.connect(
        #     'Driver={SQL Server};Server=.;Database=db1;integrated security = true;uid=ajitjog;pwd=Sql@12345'
        # )
        connection = pyodbc.connect('Driver={SQL Server};Server=sqlsrvaj.database.windows.net;Database=db1;uid=ajitjog;pwd=Sql@12345')
        print("Connected")
        cursor = connection.cursor()
        SQLCommand =("INSERT INTO contacts VALUES(?,?)")

        values =[c.Name,c.City]
        cursor.execute(SQLCommand,values)
        connection.commit()
        connection.close()


#with mongodb
# class ContactService2:
#     def Add(self, c):
#         client = pymongo.MongoClient('mongodb://localhost:27017')
#         print("Connected")
#         mydb = client["Contacts"]
#         print(client)
#         collection = mydb["Info"]


#         # Values = [c.Name, c.City]
#         # print(Values)
#         collection.insert_one({"Name": c.Name, "City": c.City})
