# balance=50
# if balance>5000:
#     print("premium")
# elif balance >=500:
#     print("standard") 
# else:
#     print("basic")






# balance=5
# while balance > 0:
#     for i in range(1,6):
#         print(i)
#     balance -=1
#     continue





# for i in range(1,21):
#     if i%2==0:
#         print(i)
    
# print("finished")    





# for i in range(1,21):
#     if i == 10:
#         break
#     elif i%2==0:
#         print(i)
# print("finished")




# for i in range (1,21):
#     if i==16:
#         continue
#     elif i%2==0:
#         print(i)
# print("finished")        





# for i in range(2,22,2):
#     print(i)





# def add_tax(price,rate=0.15):
#     return price + price*rate
# total = add_tax(100)

# print(total)





# tax_rate=0.15
# def total(price):
#     fee=50
#     return price+fee

# print(total(100))



# def apply_discount(price,percent=10):
#     return price * (1-percent/100)

# without_def=apply_discount(100)
# with_def=apply_discount(100,25)

# print(with_def)
# print(without_def)





# cities =["ambo","jimma","hawasa","adama","shaggar"]
# print(cities.pop())



# totals = []
# for price in [100,250,400]:
#     totals.append(price*1.15)
# print(totals)    




# nums= [1,2,2,3,4,4,4,4,5,6]
# unique=set(nums)

# print(unique)


#import math
#print (math.factorial(5))




# accs = {"owner":"Abdi" , "balance" : 1000}

# def deposit(acc,amount):
#     acc["balance"] += amount
#     return acc

# deposit(accs,500)

# print(accs)






# class Account:
#     def __init__(self,owner,balance):
#         self.owner=owner
#         self.balance=balance
#     def deposit(self,amount):
#         self.balance += amount
        
#     def statement(self):
#         print(f"{self.owner} {self.balance}")


# abdii = Account("abdi serbessa",5000)
# abdii.deposit(5000)
# abdii.statement()







# class Account:
#     def __init__(self,owner,balance):
#         self.owner=owner
#         self.balance=balance

#     def deposit(self,amount):
#         self.balance +=amount

#     def statement(self):
#         print(f"{self.owner} : {self.balance}" )


# Abdi = Account("abdii serbessa",10000)
# Abdi.deposit(1000)
# Abdi.statement()











# class  Account:
#     def __init__(self,balance):
#         self.balance = balance

#     def withdraw(self,amount):
#         if self.balance < amount:
#             print("insufficient fund")
#             return
#         self.balance -= amount

#     def statement(self):
#         print(f"{self.balance}")

# Abdi = Account(1000)

# Abdi.withdraw(2000)
# Abdi.statement()






# class account:
#     def __init__(self,owner, balance=0):
#         self.owner=owner
#         self.balance = balance
#     def deposit(self,amount):
#         self.balance += amount

# class SavingAccount(account):
#     def __init__(self, owner, balance=0,rate=0.05):
#         super().__init__(owner, balance)
#         self.rate = rate
#     def add_tax(self):
#         self.deposit(self.balance *self.rate)    

# Abdi = SavingAccount("abdi serbessa", 1000)
# Abdi.deposit(1000)
# print(f"{Abdi.balance}")


from abc import ABC, abstractmethod

class Vehicle(ABC):

    @abstractmethod
    def wheels(self):
        pass

class car(Vehicle):
      def wheels(self):
           return 4
      
class bike(Vehicle):
     def wheels(self):
          return 2
Car  =  car()
Bike = bike()

print(f"{Car.wheels()}")
print(f"{Bike.wheels()}")








