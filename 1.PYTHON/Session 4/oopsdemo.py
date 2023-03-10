class InvalidSalException(BaseException):

    def __init__(self,msg):
        self.message = msg

class Emp:
    ##static variable
    ## __ ==> private otherwise public
    
    __ecount = 0

    def __cmp__(self,other):
        return cmp(self.EmpSal,other.EmpSal)
    
    ## Deconstructor
    def __del__(self):
        print("Emp ",self.EmpName,"is being destroyed.. memeory deallocation")
        
    ## Constructor
    def __init__(self,enm,esal=10000,ecity="WFH"):
        self.EmpName=enm
        self.EmpSal=esal
        self.EmpDa=self.EmpSal*0.25
        Emp.__ecount = Emp.__ecount +1
        self.EmpCity=ecity
        self.EmpNo = Emp.__ecount
        self.__secretCode =self.EmpName+":"+self.EmpName

    def __gt__(self,other):
        return self.EmpSal>other.EmpSal

    def __str__(self):
        return "Name: {} No: {} Sal : {} City :{}".format(self.EmpName,self.EmpNo,self.EmpSal,self.EmpCity)

    def __repr__(self):
         return "Name: {} No: {} Sal : {} City :{}\n".format(self.EmpName,self.EmpNo,self.EmpSal,self.EmpCity)

    ## Getter and Setter
    @property
    def EmpSal(self):
        return self.__empsal

    @EmpSal.setter
    def EmpSal(self,value):
        if(value>=10000):
            self.__empsal=value
        else:
            raise InvalidSalException("Salary should be min 10000")
    
    def Display(self):
        print("EmpNo: ",self.EmpNo, "Name: ",self.EmpName,
              "Salary: ",self.EmpSal,"DA : ",self.EmpDa)
        self.__AfterDisplay()
        
    def __AfterDisplay(self):
        print("###########################")

    @staticmethod
    def GetEmpCount():
        return Emp.__ecount

    @classmethod
    def GetEmpCountAgain(cls):
        return cls.__ecount

class OnsiteEmp(Emp):

    def __init__(self,enm,esal=10000,ecity="WFH",visaNo=''):
        Emp.__init__(self,enm,esal,ecity)
        self.visaNo=visaNo

    def Display(self):
        super().Display()
        print("visa No of Emp : {}".format(self.visaNo))

def EmpSort(e):
    return e.EmpName

def main():
    e1 = Emp("Sam",ecity="delhi")
    e2 = Emp("Ram",34500,"pune")

    e1.Display()
    e2.Display()


    try:
        e1.EmpSal= -1000
    except InvalidSalException as salex:
        print(salex.message)
    e1.Display()

    print("Employee Count: ",e2.GetEmpCount())
    print("Employee Count: ",Emp.GetEmpCount())
    print("Employee Count: ",Emp.GetEmpCountAgain())

    #del e1

    oel = OnsiteEmp("Mohan",55000,"Mumbai","GjhJ86622")
    oel.Display()
    print("Count",OnsiteEmp.GetEmpCount())

    print("Is e1>g2 ?", e1>e2)

    elist =[e1,e2,oel]

    elist.sort(key=EmpSort, reverse=True)
    print("List 1",elist)

    elist2 =[e2,oel,e1]
    elist2.sort(key = lambda e: e.EmpCity)
    print("List 2",elist2)

main()
