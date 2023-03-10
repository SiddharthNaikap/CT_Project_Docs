lst =[100,200,300]
tupl=(10,20,30)

print("List ",lst,"\nTuple ",tupl)
#############

print("Tuple unpack")
n1,n2,n3=tupl
print(n1,n2,n3)

a=20;b=30
a,b=(b,a)

print(a,b)

########
print("Sort Tuple")
tup=(2,6,8,1,5,3)
print("Before Sort: ",tup)
ls = list(tup)

ls.sort()
print("After Sort using 'list': ",ls)

tup2=tuple(sorted(tup))
print("After Sort using 'sorted': ",tup2)

