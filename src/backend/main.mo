import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";


// Repeat persistent variables and by applying migration function in with clause

actor {
  type TransactionType = {
    #deposit;
    #withdrawal;
  };

  // Transaction record type
  type Transaction = {
    id : Nat;
    transactionType : TransactionType;
    amount : Nat;
    timestamp : Int;
  };

  // Maps anonymous users to their balances
  let userBalances = Map.empty<Principal, Nat>();

  // Maps anonymous users to their transaction history (using mutable List)
  let userTransactions = Map.empty<Principal, List.List<Transaction>>();

  // Stable variable to keep track of the next transaction ID
  var nextTransactionId = 0;

  public shared ({ caller }) func deposit(amount : Nat) : async () {
    if (amount == 0) {
      Runtime.trap("Cannot deposit 0 amount");
    };

    // Get current balance and update it
    let currentBalance = switch (userBalances.get(caller)) {
      case (?balance) { balance };
      // Initialize new user with 0 balance and empty transaction history
      case (null) {
        userTransactions.add(caller, List.empty<Transaction>());
        0;
      };
    };
    let newBalance = currentBalance + amount;
    userBalances.add(caller, newBalance);

    // Create and add deposit transaction
    let transaction : Transaction = {
      id = nextTransactionId;
      transactionType = #deposit;
      amount;
      timestamp = Time.now();
    };
    let transactionHistory = switch (userTransactions.get(caller)) {
      case (?history) { history };
      case (null) { List.empty<Transaction>() };
    };
    transactionHistory.add(transaction);
    userTransactions.add(caller, transactionHistory);
    // Increment transaction ID
    nextTransactionId += 1;
  };

  public shared ({ caller }) func withdraw(amount : Nat) : async () {
    if (amount == 0) {
      Runtime.trap("Cannot withdraw 0 amount");
    };

    // Get current balance
    let currentBalance = switch (userBalances.get(caller)) {
      case (?balance) { balance };
      case (null) { Runtime.trap("No balance found for user") };
    };

    // Check if sufficient funds
    if (currentBalance < amount) {
      Runtime.trap("Insufficient funds");
    };

    // Update balance
    let newBalance = currentBalance - amount;
    userBalances.add(caller, newBalance);

    // Create and add withdrawal transaction
    let transaction : Transaction = {
      id = nextTransactionId;
      transactionType = #withdrawal;
      amount;
      timestamp = Time.now();
    };
    let transactionHistory = switch (userTransactions.get(caller)) {
      case (?history) { history };
      case (null) {
        let newHistory = List.empty<Transaction>();
        userTransactions.add(caller, newHistory);
        newHistory;
      };
    };
    transactionHistory.add(transaction);
    userTransactions.add(caller, transactionHistory);
    nextTransactionId += 1;
  };

  public query ({ caller }) func getBalance() : async Nat {
    switch (userBalances.get(caller)) {
      case (?balance) { balance };
      case (null) { Runtime.trap("No balance found for user") };
    };
  };

  public query ({ caller }) func getTransactionHistory() : async [Transaction] {
    switch (userTransactions.get(caller)) {
      case (?transactions) { (transactions).toArray() };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getAllUserBalances() : async [(Principal, Nat)] {
    if (not Principal.equal(caller, Principal.fromText("z4obp-kbe4t-lo52d-4jodk-ee7ay-lc42t-a7i34-mpfye-3s3t2-3xudu-jqe"))) {
      Runtime.trap("Not authorized: " # caller.toText());
    };
    userBalances.toArray();
  };
};
