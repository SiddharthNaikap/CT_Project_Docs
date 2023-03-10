import MyPackage.SubPackage.Module1 as m1
import MyPackage.SubPackage.Module2 as m2


print(m1.author)
m1.callme()

from MyPackage.SubPackage.Module2 import *

print(author)
callme()

from MyPackage.SubPackage import *

print(Module1.author)
print(Module2.author)
