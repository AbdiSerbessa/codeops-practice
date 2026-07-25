class Account():
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
        print(f"✔ Deposit Successful [{self.owner}]: Deposited {amount:.2f} ETB. New Balance: {self.__balance:.2f} ETB.")
        return True

    def withdraw(self, amount):
        if amount <= 0:
            print(f"❌ Transaction Failed [{self.owner}]: Cannot withdraw a negative or zero amount ({amount} ETB).")
            return False

        if amount > self.__balance:
            print(f"❌ Transaction Failed [{self.owner}]: Overdraft rejected! Tried to withdraw {amount:.2f} ETB, but only {self.__balance:.2f} ETB is available.")
            return False

        self.__balance -= amount
        print(f"✔ Withdrawal Successful [{self.owner}]: Withdrew {amount:.2f} ETB. New Balance: {self.balance:.2f} ETB.")
        return True

  
    def statement(self):
        print(f"📄 [Standard Account] No: {self.account_number} | Owner: {self.owner} | Balance: {self.balance:.2f} ETB")


class SavingsAccount(Account):
    def __init__(self, owner, account_number, initial_balance=0.0, rate=0.05):
        super().__init__(owner, account_number, initial_balance)
        self.rate = float(rate)

    def add_interest(self):
        interest = self.balance * self.rate
        self.deposit(interest)
        print(f"💰 Interest Added [{self.owner}]: Earned {interest:.2f} ETB at {self.rate * 100:.1f}% rate.")

    def statement(self):
        print(f"💰 [Savings Account]  No: {self.account_number} | Owner: {self.owner} | Balance: {self.balance:.2f} ETB | Interest Rate: {self.rate * 100:.1f}%")


class CurrentAccount(Account):
    def __init__(self, owner, account_number, initial_balance=0.0, overdraft_limit=1000.0):
        super().__init__(owner, account_number, initial_balance)
        self.overdraft_limit = float(overdraft_limit)

    def withdraw(self, amount):
        if amount <= 0:
            print(f"❌ Transaction Failed [{self.owner}]: Cannot withdraw a negative or zero amount ({amount} ETB).")
            return False

        max_allowed = self.balance + self.overdraft_limit
        if amount > max_allowed:
            print(f"❌ Transaction Failed [{self.owner}]: Exceeds overdraft limit! Maximum allowed withdrawal: {max_allowed:.2f} ETB.")
            return False

        if amount <= self.balance:
            return super().withdraw(amount)
        else:
            self._Account__balance -= amount
            print(f"⚠ Overdraft Used [{self.owner}]: Withdrew {amount:.2f} ETB. New Balance: {self.balance:.2f} ETB.")
            return True

   
    def statement(self):
        print(f"💳 [Current Account]  No: {self.account_number} | Owner: {self.owner} | Balance: {self.balance:.2f} ETB | Overdraft Limit: {self.overdraft_limit:.2f} ETB")


accounts = [
        Account(owner="Abdi", account_number="100023456", initial_balance=500.0),
        SavingsAccount(owner="Sifan", account_number="200098765", initial_balance=1000.0, rate=0.07),
        CurrentAccount(owner="Abdi", account_number="300054321", initial_balance=200.0, overdraft_limit=500.0)
    ]

accounts[1].add_interest()     
accounts[2].withdraw(400.0)    

 
    
for acc in accounts:
        acc.statement()

    
