def commonDecorator(fn):
    def impl(*args,**kwargs):
        print("Pre processing")
        ret = fn(*args,**kwargs)
        print("Post processing")
        return ret
    return impl


class SomeClass():
    @commonDecorator
    def someMethod(self,name,city):
        print(name,city)


sm = SomeClass()
sm.someMethod("Sam","Delhi")

###############################

# class as decorator with
# return statement
 
class SquareDecorator:
 
    def __init__(self, function):
        self.function = function
 
    def __call__(self, *args, **kwargs):
 
        # before function
        print("\nGiven number is:", *args)
        result = self.function(*args, **kwargs)
 
        # after function
        print("Done!")
        return result
 
# adding class decorator to the function
@SquareDecorator
def get_square(n):
    
    return n * n
 
print("Square of number is:", get_square(5))
