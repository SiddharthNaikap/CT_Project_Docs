l2 =[10,20,30]
l3 =["hi","hello"]

print(l2[0],l3[1])


##############
print("Loop through list")
for k in l3:
    print(k,end="**\n")
    
l2.append("ji")
print("After appending",l2)

l2.remove(20)
print("After removing",l2)

l3.sort()
print("After sorting",l3)

l3.sort(reverse=True)
print("After reverse sorting",l3)

print("Get index of 'hi': ", l3.index("hi"))

print("Updated list")
l3[0]="HI"
print(l3)
