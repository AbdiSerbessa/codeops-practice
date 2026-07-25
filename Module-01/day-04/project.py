class Account:
    def __init__(self, owner, account_number, initial_balance=0.0):
        self.owner = owner.strip().title()
        self.account_number = str(account_number).strip()
        if initial_balance < 0:
            print("Warning: Initial balance cannot be negative. Setting balance to 0.0 ETB.")
            self.__balance = 0.0
        else:
            self.__balance = float(initial_balance)

    
    @property
    def balance(self):
        return self.__balance

    def deposit(self, amount):
        if amount <= 0:
            print(f"❌ Transaction Failed [{self.owner}]: Cannot deposit a negative or zero amount ({amount} ETB).")
            return False
        
        self.__balance += amount
        print(f"✅ Deposit Successful [{self.owner}]: Deposited {amount:.2f} ETB. New Balance: {self.__balance:.2f} ETB.")
        return True

    def withdraw(self, amount):
        if amount <= 0:
            print(f"❌ Transaction Failed [{self.owner}]: Cannot withdraw a negative or zero amount ({amount} ETB).")
            return False
        
        if amount > self.__balance:
            print(f"❌ Transaction Failed [{self.owner}]: Overdraft rejected! Tried to withdraw {amount:.2f} ETB, but only {self.__balance:.2f} ETB is available.")
            return False
        
        self.__balance -= amount
        print(f"✅ Withdrawal Successful [{self.owner}]: Withdrew {amount:.2f} ETB. New Balance: {self.__balance:.2f} ETB.")
        return True



acct1 = Account(owner="Abdi", account_number="100023456", initial_balance=500.00)
acct2 = Account(owner="Sifan", account_number="100098765", initial_balance=1000.00)



acct1.deposit(250.50)      
acct1.withdraw(100.00)     
acct1.withdraw(800.00)     
acct1.deposit(-50.00)   


acct2.withdraw(300.00)   
acct2.withdraw(-20.00)     
acct2.deposit(500.00)      


print(f"Created account for {acct1.owner} (No. {acct1.account_number}) with {acct1.balance:.2f} ETB.")
print(f"Created account for {acct2.owner} (No. {acct2.account_number}) with {acct2.balance:.2f} ETB.")
