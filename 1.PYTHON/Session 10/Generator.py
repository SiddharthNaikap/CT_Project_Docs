def Gen1():
    yield 10
    yield 20

def Gen2(sno,eno):
    r = range(sno,eno+1)
    for i in r:
        yield i

ol = Gen2(10,30)

for n in ol:
    print(n)