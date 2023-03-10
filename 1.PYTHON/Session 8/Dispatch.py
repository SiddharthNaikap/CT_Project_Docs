#Dispatch Decorator


from multipledispatch import dispatch

@dispatch(int)
def func(x):
    print("int func")
    return x*2

@dispatch(float)
def func(x):
    print("float func")
    return x/2



print(func(2))
print(func(2.0))
