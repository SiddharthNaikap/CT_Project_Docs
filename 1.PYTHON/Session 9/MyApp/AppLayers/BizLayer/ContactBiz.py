import AppLayers.DbLayer.ContactDb as dbl


class InvalidCityException(BaseException):
    def __init__(self,msg):
        self.message = msg
        
class ContactService:

    def Add(self,c):
        if c.City in ("mumbai","pune"):
            svc = dbl.ContactService()
            svc.Add(c)
        else:
            raise InvalidCityException("Invalid City")
