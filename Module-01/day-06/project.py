# day06/bank.py
class AlertService:
    def success(self, message):
        print(f"✔ {message}")

    def error(self, message):
        print(f"❌ {message}")

    def warning(self, message):
        print(f"⚠ {message}")

    def info(self, message):
        print(f"ℹ {message}")
        
alert_service = AlertService()  

class SMSAlert:
    def update(self, account, event_type, message):
        print(f"📱 [SMS Alert -> {account.owner}]: [{event_type.upper()}] {message}")

class Account:
    def __init__(self, owner, account_number, initial_balance=0.0):
        self.owner = owner.strip().title()
        self.account_number = str(account_number).strip()
        self._subscribers = []
        if initial_balance < 0:
            alert_service.warning(f"Initial balance cannot be negative. Setting balance to 0.0 ETB for {self.owner}.")
            self.__balance = 0.0
        else:
            self.__balance = float(initial_balance)
    def subscribe(self, observer):
        if observer not in self._subscribers:
            self._subscribers.append(observer)

    def unsubscribe(self, observer):
        if observer in self._subscribers:
            self._subscribers.remove(observer)

    def _notify(self, event_type, message):
        for sub in self._subscribers:
            sub.update(self, event_type, message)


    @property
    def balance(self):
        return self.__balance

    def deposit(self, amount):
        if amount <= 0:
            alert_service.error(f"Transaction Failed [{self.owner}]: Cannot deposit a negative or zero amount ({amount} ETB).")
            return False

        self.__balance += amount
        msg = f"Deposited {amount:.2f} ETB. New Balance: {self.__balance:.2f} ETB."
        alert_service.success(f"Deposit Successful [{self.owner}]: {msg}")
        
        
        self._notify("deposit", msg)
        return True
    
    def withdraw(self, amount):
        if amount <= 0:
            alert_service.error(f"Transaction Failed [{self.owner}]: Cannot withdraw a negative or zero amount ({amount} ETB).")
            return False

        if amount > self.__balance:
            alert_service.error(f"Transaction Failed [{self.owner}]: Overdraft rejected! Tried to withdraw {amount:.2f} ETB, but only {self.__balance:.2f} ETB is available.")
            return False

        msg = f"Withdrew {amount:.2f} ETB. New Balance: {self.__balance:.2f} ETB."
        alert_service.success(f"Withdrawal Successful [{self.owner}]: {msg}")
        
        self._notify("withdrawal", msg)
        return True
    def statement(self):
        alert_service.info(f"[Standard Account] No: {self.account_number} | Owner: {self.owner} | Balance: {self.balance:.2f} ETB")


class SavingsAccount(Account):
    def __init__(self, owner, account_number, initial_balance=0.0, rate=0.05):
        super().__init__(owner, account_number, initial_balance)
        self.rate = float(rate)

    def add_interest(self):
        interest = self.balance * self.rate
        self.deposit(interest)
        alert_service.info(f"Interest Added [{self.owner}]: Earned {interest:.2f} ETB at {self.rate * 100:.1f}% rate.")

    def statement(self):
        alert_service.info(f"[Savings Account] No: {self.account_number} | Owner: {self.owner} | Balance: {self.balance:.2f} ETB | Interest Rate: {self.rate * 100:.1f}%")


class CurrentAccount(Account):
    def __init__(self, owner, account_number, initial_balance=0.0, overdraft_limit=1000.0):
        super().__init__(owner, account_number, initial_balance)
        self.overdraft_limit = float(overdraft_limit)

    def withdraw(self, amount):
        if amount <= 0:
            alert_service.error(f"Transaction Failed [{self.owner}]: Cannot withdraw a negative or zero amount ({amount} ETB).")
            return False

        max_allowed = self.balance + self.overdraft_limit
        if amount > max_allowed:
            alert_service.error(f"Transaction Failed [{self.owner}]: Exceeds overdraft limit! Maximum allowed withdrawal: {max_allowed:.2f} ETB.")
            return False

        if amount <= self.balance:
            return super().withdraw(amount)
        else:
            self._Account__balance -= amount
            msg = f"Withdrew {amount:.2f} ETB (Overdraft). New Balance: {self.balance:.2f} ETB."
            alert_service.warning(f"Overdraft Used [{self.owner}]: {msg}")

            self._notify("overdraft_withdrawal", msg)
            return True

    def statement(self):
        alert_service.info(f"[Current Account] No: {self.account_number} | Owner: {self.owner} | Balance: {self.balance:.2f} ETB | Overdraft Limit: {self.overdraft_limit:.2f} ETB")

class AccountFactory:
    def create(self, kind, owner, account_number, initial_balance=0.0, **kwargs):
        kind_clean = str(kind).strip().lower()

        if kind_clean in ["savings", "saving"]:
            rate = kwargs.get("rate", 0.05)
            return SavingsAccount(
                owner=owner, 
                account_number=account_number, 
                initial_balance=initial_balance, 
                rate=rate
            )

        elif kind_clean in ["current", "checking"]:
            overdraft_limit = kwargs.get("overdraft_limit", 1000.0)
            return CurrentAccount(
                owner=owner, 
                account_number=account_number, 
                initial_balance=initial_balance, 
                overdraft_limit=overdraft_limit
            )

        elif kind_clean in ["standard", "base", "account"]:
            return Account(
                owner=owner, 
                account_number=account_number, 
                initial_balance=initial_balance
            )

        else:
            alert_service.error(f"AccountFactory Error: Unknown account type '{kind}'.")
            return None
        
factory = AccountFactory()
sms_alert = SMSAlert()

if __name__ == "__main__":
  
    factory = AccountFactory()
    sms_alert = SMSAlert()

    accounts = [
        factory.create("standard", owner="Abdi", account_number="100023456", initial_balance=500.0),
        factory.create("savings", owner="Sifan", account_number="200098765", initial_balance=1000.0, rate=0.07),
        factory.create("current", owner="Abdi", account_number="300054321", initial_balance=200.0, overdraft_limit=500.0)
    ]

    for acc in accounts:
        if acc:
            acc.subscribe(sms_alert)

    
    accounts[1].add_interest()     
    accounts[2].withdraw(400.0)   


    for acc in accounts:
        if acc:
            acc.statement()

