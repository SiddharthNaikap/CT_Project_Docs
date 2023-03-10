#comprehension is an expression which iterates colection
#to produce collection result

tupl=tuple(range(1,6))
print(tupl)

lst1 = [ {n,n*n} for n in tupl]
print(lst1)

tup2 =([n,n**3] for n in tupl)

for l in tup2:
    print(l,end="")

#################################
data = tuple(range(1,50))

result =[(a,b,c)  for a in data for b in data
         for c in data if a**2+b**2 ==c**2]
print("\n###############################\n",result)
