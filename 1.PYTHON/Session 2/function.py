def greet(usr,msg="Good morning"):
    print(msg,usr)

greet("Good day","Sid")
greet(usr="Ram")

usr2="joe"
greet(usr2)

#############

def IsPrime(no):
    flag=True
    index=2
    while index < no/2:
        if(no%2==0):
            flag=False
            break
        index = index+1
    return flag


result=IsPrime(44)
if(result):
    print("Its a prime number")
else:
    print("Its not a prime number")

#############

def fact(no):
    res=1
    while no>=1:
        res = res*no
        no = no - 1
    return res

print(fact(5))

###########

def RecFact(no):
    if no == 1:
        return 1;
    else:
        return no * RecFact(no - 1)

print(RecFact(6))
##############

def SumAll(*nos):
    res=0
    for no in nos:
        res =res+ no
    return res

print("Sum All : ",SumAll(1,2,3,4,5))

############

def PrintArgs(**args):
    for k,v in args.items():
        print("Value for : ",k," arg is : ",v)

PrintArgs(n1=4,a="hello")
PrintArgs(n=2,v="hi",h="who",j=8,k="ok")





























              

