import { connectDB } from "./mongoose";
import { Rule } from "./models/Rule";
import { ITransaction } from "./models/Transaction";
import { Wallet } from "./models/Wallet";
import mongoose from "mongoose";

export async function processRulesForTransaction(transaction: ITransaction) {
  try {
    await connectDB();

    const rules = await Rule.find({
      userId: new mongoose.Types.ObjectId(transaction.userId),
      enabled: true,
    });

    if (rules.length === 0) return;

    const wallet = await Wallet.findOne({ userId: transaction.userId });
    if (!wallet) return;

    for (const rule of rules) {
      const triggerLower = rule.triggerText.toLowerCase();
      const merchantMatch = transaction.merchant
        ?.toLowerCase()
        .includes(triggerLower);
      const categoryMatch = transaction.category
        ?.toLowerCase()
        .includes(triggerLower);

      if (merchantMatch || categoryMatch) {
        rule.triggeredCount += 1;
        await rule.save();

        // Execute action
        const actionLower = rule.actionText.toLowerCase();
        if (actionLower.includes("save") && actionLower.includes("%")) {
          const match = rule.actionText.match(/(\d+)%/);
          const percentage = match ? parseInt(match[1], 10) : 10;
          const amount = transaction.amount * (percentage / 100);
          if (wallet.balance >= amount) {
            wallet.balance -= amount;
            await wallet.save();
          }
        }
      }
    }
  } catch (error) {
    console.error("Error processing rules:", error);
  }
}
