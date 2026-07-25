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
        self.history_stack = []

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
        self.history_stack.append(msg)
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
        self.history_stack.append(msg)
        alert_service.success(f"Withdrawal Successful [{self.owner}]: {msg}")
        
        self._notify("withdrawal", msg)
        return True
    def statement(self):
        alert_service.info(f"[Standard Account] No: {self.account_number} | Owner: {self.owner} | Balance: {self.balance:.2f} ETB")
    def print_history(self):
      alert_service.info(
        f"--- Transaction History for {self.owner} ({self.account_number}) ---")
      if not self.history_stack:
        alert_service.info("No transaction history available.")
        return

      for item in reversed(self.history_stack):
        print(f"  ↳ {item}") 

    def undo_last(self):
        if not self.history_stack:
          alert_service.warning(
          f"Undo Failed [{self.owner}]: No transactions available to undo."
      )
          return False

    
        last_tx = self.history_stack.pop()

        try:
    
          amount_str = last_tx.split("ETB")[0].split()[-1]
          amount = float(amount_str)
        except (IndexError, ValueError):
            alert_service.error(
          f"Undo Failed [{self.owner}]: Could not parse amount from: '{last_tx}'"
      )
            return False

   
        if "Deposited" in last_tx:
         self.__balance -= amount
         msg = (
          f"Undid Deposit of {amount:.2f} ETB. Restored Balance:"
          f" {self.__balance:.2f} ETB."
      )
        elif "Withdrew" in last_tx:
         self.__balance += amount
         msg = (
          f"Undid Withdrawal of {amount:.2f} ETB. Restored Balance:"
          f" {self.__balance:.2f} ETB."
      )
        else:
          alert_service.warning(
          f"Undo Skipped [{self.owner}]: Cannot undo transaction type"
          f" '{last_tx}'."
      )
          return False

        alert_service.success(f"Undo Successful [{self.owner}]: {msg}")
        self._notify("undo", msg)
        return True

    def get_transaction_total_recursive(self, stack_copy=None):
      """Recursively calculates the net sum of all recorded transactions in history_stack."""
    
      if stack_copy is None:
        stack_copy = list(self.history_stack)

      
      if not stack_copy:
        return 0.0

      
      last_tx = stack_copy.pop()
      try:
        amount_str = last_tx.split("ETB")[0].split()[-1]
        amount = float(amount_str)
      except (IndexError, ValueError):
        amount = 0.0

      
      if "Withdrew" in last_tx:
        amount = -amount

      return amount + self.get_transaction_total_recursive(stack_copy)
    

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
            self.history_stack.append(msg)
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



class AccountRegistry:
    def __init__(self):
        self._accounts = {}  

    def add(self, account):
        """Adds/registers an account in the dictionary."""
        if not account:
            alert_service.error("Registry Error: Cannot add a None account.")
            return False

        if account.account_number in self._accounts:
            alert_service.warning(f"Registry Warning: Account number {account.account_number} is already registered.")
            return False

        self._accounts[account.account_number] = account
        alert_service.success(f"Added account {account.account_number} ({account.owner}) successfully.")
        return True

    def find(self, account_number):
        """O(1) lookup: Finds and returns an account by its account number."""
        acc_num = str(account_number).strip()
        account = self._accounts.get(acc_num) 
        if not account:
            alert_service.error(f"Registry Error: Account number '{acc_num}' not found.")
            return None
        return account

    def list_all(self):
        """Returns an ordered list of accounts sorted by account_number."""
        return [self._accounts[k] for k in sorted(self._accounts.keys())] 

    def get_leaderboard(self):
      """Returns all accounts sorted by balance in descending order."""
      return sorted(
          self._accounts.values(), key=lambda acc: acc.balance, reverse=True
      )

    def binary_search(self, target_account_number):
      """Performs Binary Search O(log n) on sorted account numbers."""
      # 1. Get list sorted by account_number
      sorted_accounts = self.list_all()
      target_str = str(target_account_number).strip()

      low = 0
      high = len(sorted_accounts) - 1

      while low <= high:
        mid = (low + high) // 2
        mid_acc_num = sorted_accounts[mid].account_number

        if mid_acc_num == target_str:
          return sorted_accounts[mid]
        elif mid_acc_num < target_str:
          low = mid + 1
        else:
          high = mid - 1

      alert_service.error(
          f"Binary Search Error: Account '{target_str}' not found."
      )
      return None

        


if __name__ == "__main__":
    registry = AccountRegistry()
    factory = AccountFactory()
    sms_alert = SMSAlert()

    acc1 = factory.create("standard", owner="Abdi", account_number="100023456", initial_balance=500.0)
    acc2 = factory.create("savings", owner="Sifan", account_number="200098765", initial_balance=1000.0, rate=0.07)
    acc3 = factory.create("current", owner="Abdi", account_number="300054321", initial_balance=200.0, overdraft_limit=500.0)

    for acc in [acc1, acc2, acc3]:
        if acc:
            acc.subscribe(sms_alert)
            registry.add(acc)



    sifan_acc = registry.find("200098765")
    if sifan_acc:
        sifan_acc.add_interest()

    abdi_current = registry.find("300054321")
    if abdi_current:
        abdi_current.withdraw(400.0)
        
    acc1 = registry.find("100023456")
    if acc1:
      acc1.deposit(300.0)
      acc1.withdraw(100.0)    


 
    print("\n--- Balance Leaderboard (Highest to Lowest) ---")
    for rank, account in enumerate(registry.get_leaderboard(), start=1):
        print(f"#{rank} {account.owner} ({account.account_number}): {account.balance:.2f} ETB")

    print("\n--- Binary Search Lookup ---")
    found_acc = registry.binary_search("200098765")
    if found_acc:
        alert_service.success(f"Binary Search Found: {found_acc.owner} | Balance: {found_acc.balance:.2f} ETB")

    print("\n--- Recursive Transaction Total ---")
    if abdi_current:
        net_total = abdi_current.get_transaction_total_recursive()
        alert_service.info(f"Net Transaction Total for {abdi_current.owner}: {net_total:.2f} ETB")

    if abdi_current:
        print("\n--- Transaction History ---")
        abdi_current.print_history()

        print("\n[Undoing Last Action]")
        abdi_current.undo_last()

        print("\n[Updated Statement]")
        abdi_current.statement()
