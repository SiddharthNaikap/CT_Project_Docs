#import searches in
#Install dir
#current dir

import MyModule as mm

print(mm.author)
mm.greet("Siddhu")
mm.Circle()

from MyModule import author,greet,Circle
print(author)
greet("Sam")
Circle()
