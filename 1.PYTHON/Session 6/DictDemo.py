#Dictionary

d1 ={"mumbai":120,"pune":307,"nashik":456}

#Traverse
for k in d1.keys():
    print(k,end=" ")
print("")

for v in d1.values():
    print(v,end=" ")
print("")

print(d1["pune"])

for k,v in d1.items():
    print(k,v,end=" ")
print("")

#update
d1.update({"delhi":670})
d1.update({"pune":309})

d1["mumbai"]=125
print(d1)

#No key exists
try:
    print(d1["udupi"])
except KeyError as k:
    print("Oops the key",k,"does not exist")

place ="kerala"
if place in d1:
    print(d1[place])
else:
    print("Key",place,"Does not exist")
