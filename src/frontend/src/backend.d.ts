import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Transaction {
    id: bigint;
    transactionType: TransactionType;
    timestamp: bigint;
    amount: bigint;
}
export enum TransactionType {
    deposit = "deposit",
    withdrawal = "withdrawal"
}
export interface backendInterface {
    deposit(amount: bigint): Promise<void>;
    getAllUserBalances(): Promise<Array<[Principal, bigint]>>;
    getBalance(): Promise<bigint>;
    getTransactionHistory(): Promise<Array<Transaction>>;
    withdraw(amount: bigint): Promise<void>;
}
