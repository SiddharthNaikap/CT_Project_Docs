class NegativeNumberException(BaseException):
    def __init__(self,msg):
        self.msg=msg

#Decorator for extra validation
def checkForPositive(fn):
    def impl(no):
        if no<1:
            raise NegativeNumberException("Number must be +ve")
        return fn(no)
    return impl

@checkForPositive
def SquareAndCube(no):
    #Some validation
    return (no**2,no**3)

def client1(no):
    r1,r2=SquareAndCube(no)
    print(r1,r2)

def client2(no):
    r1,r2=SquareAndCube(no)
    print(r1,r2)

try:
    client1(10)
    client2(-5)
except NegativeNumberException as ex:
    print(ex)
