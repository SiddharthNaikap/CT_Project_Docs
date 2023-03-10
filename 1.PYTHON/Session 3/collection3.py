s1={1,2,3,5,"hi"}
s2={"hi","g","ho","kk"}

s1.add(6)
s2.add("hi")

print(s1,s2)
############

print("Union:",s1.union(s2))
print("Inetersection:",s1.intersection(s2))
print("Difference:",s1.difference(s2))
s1.difference_update(s2)
print("Difference and Update:",s1)

print("Symmetric Difference:",s1.symmetric_difference(s2))
