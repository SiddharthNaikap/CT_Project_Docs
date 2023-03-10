class Contact:

    def __init__(self,nm,ct,clno):
        self.name=nm
        self.city=ct
        self.cellno=clno


c1 = Contact("ajit","mumbai",67876676)
c2 = Contact("ajay","delhi",980980890)
c3 = Contact("ram","mumbai",7787887)
c4 = Contact("sam","hyd",7787887)
c5 = Contact("jay","delhi",9878979)


lst=[c1,c2,c3,c4,c5]

d1 = dict()

for c in lst:
    if not c.cellno in d1:
        clist =[]
        clist.append(c)
        d1.update({c.cellno:clist})

for k,v in d1.items():
    print("Contacts details",k, end=" ")
    for c in v:
        print(c.name,c.city)

print("\nCity wise contacts\n#####################")

d2=dict()

for ct in lst:
    if ct.city in d2:
        ctlist = d2[ct.city]
        ctlist.append(ct)
        d2.update({ct.city:ctlist})
    else:
        ctlist =[]
        ctlist.append(ct)
        d2.update({ct.city:ctlist})
        
for k,v in d2.items():
    print("\nContacts in",k)
    for c in v:
        print(c.name,end=" ")






        
