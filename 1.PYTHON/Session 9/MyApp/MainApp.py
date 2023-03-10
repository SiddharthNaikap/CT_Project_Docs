import AppLayers.EntLayer.Contact as ent
import AppLayers.BizLayer.ContactBiz as biz
import sys

def main(args):
    if args[0] == "add":
        try: 
            nm = input("Enter Name:")
            ct = input("Enter City:")

            c = ent.Contact(nm,ct)

            svcObj= biz.ContactService()
            svcObj.Add(c)
            print("Contact Details saved")
        except biz.InvalidCityException as ex:
            print(ex.message)
    else:
        print("Not yet Implemented")

main(sys.argv[1:])
