import glob

class Contact:

    def __init__(self,contname,city,email):
        self.contactname=contname
        self.city=city
        self.emailid=email

    def ToCSVFormat(self,sep=":"):
        return self.contactname+sep+self.city+sep+self.emailid

def ContactReader(DataFile):
    fp=None
    try:
        fp=open(DataFile,"rt")
        line=fp.readline()

        while line:
            if line.strip() !="":
                data = line.split(",")
                c=Contact(data[0],data[1],data[2])
                yield c
                line = fp.readline()
    except BaseException as be:
        print(be)
    finally:
        fp.close()


def ContactReader2(DirPath):
    fp = None
    try:
        files = glob.glob(DirPath)
        for f in files:
            try:
                fp = open(f,"rt")
                line = fp.readline()
                while line:
                    if line.strip() !="":
                        data = line.split(",")
                        c = Contact(data[0],data[1],data[2])
                        yield c
                        line = fp.readline()
            except BaseException as be:
                print(be)
            finally:
                fp.close()
    except BaseException as be:
        print(be)

cr = ContactReader2("*.txt")

for c in cr:
    print(c.ToCSVFormat())