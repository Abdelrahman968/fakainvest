import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Reward } from "@/lib/models/Reward";
import { Challenge } from "@/lib/models/Challenge";
import { Badge } from "@/lib/models/Badge";
import { LeaderboardEntry } from "@/lib/models/LeaderboardEntry";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.sub);
    const currentMonth = new Date().toISOString().slice(0, 7);

    let reward = await Reward.findOne({ userId }).lean();
    if (!reward) {
      reward = await Reward.create({
        userId,
        points: 0,
        level: 1,
        streakDays: 0,
        badges: [],
        completedChallenges: [],
      });
    }

    const challenges = await Challenge.find({ isActive: true })
      .sort({ rewardPoints: -1 })
      .lean();
    const badges = await Badge.find().lean();
    const leaderboard = await LeaderboardEntry.find({ month: currentMonth })
      .sort({ score: -1 })
      .limit(10)
      .lean();

    const userRank = await LeaderboardEntry.countDocuments({
      month: currentMonth,
      score: {
        $gt:
          leaderboard.find((l) => l.userId.toString() === userId.toString())
            ?.score || 0,
      },
    });

    return NextResponse.json({
      reward,
      challenges,
      badges,
      leaderboard: leaderboard.map((entry, index) => ({
        rank: index + 1,
        userId: entry.userId.toString(),
        name: entry.userName,
        avatar: entry.userAvatar,
        score: entry.score,
        isYou: entry.userId.toString() === userId.toString(),
      })),
      userRank: userRank + 1,
    });
  } catch (error) {
    console.error("Error fetching rewards data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, challengeId } = body;

    await connectDB();
    const userId = new mongoose.Types.ObjectId(session.sub);

    // Join Challenge
    if (type === "joinChallenge") {
      const challenge = await Challenge.findById(challengeId).lean();
      if (!challenge) {
        return NextResponse.json(
          { error: "Challenge not found" },
          { status: 404 },
        );
      }

      let reward = await Reward.findOne({ userId });
      if (!reward) {
        reward = await Reward.create({
          userId,
          points: 0,
          level: 1,
          streakDays: 0,
          badges: [],
          completedChallenges: [],
        });
      }

      if (reward.completedChallenges.includes(challengeId)) {
        return NextResponse.json(
          { error: "Challenge already completed" },
          { status: 400 },
        );
      }

      // Update reward
      const newPoints = reward.points + challenge.rewardPoints;
      const newLevel = Math.floor(newPoints / 1000) + 1;
      reward.points = newPoints;
      reward.level = newLevel;
      reward.completedChallenges.push(challengeId);
      await reward.save();

      // Update challenge participants count
      await Challenge.findByIdAndUpdate(challengeId, {
        $inc: { participants: 1 },
      });

      // Update leaderboard
      const currentMonth = new Date().toISOString().slice(0, 7);
      await LeaderboardEntry.findOneAndUpdate(
        { userId, month: currentMonth },
        {
          $inc: { score: challenge.rewardPoints },
          $set: { userName: session.sub?.toString() || "", userAvatar: "🦊" },
        },
        { upsert: true },
      );

      return NextResponse.json({ success: true, reward });
    }

    // Update Streak
    if (type === "updateStreak") {
      let reward = await Reward.findOne({ userId });
      if (!reward) {
        reward = await Reward.create({
          userId,
          points: 0,
          level: 1,
          streakDays: 1,
          badges: [],
          completedChallenges: [],
        });
      } else {
        reward.streakDays += 1;
        await reward.save();
      }
      return NextResponse.json({
        success: true,
        streakDays: reward.streakDays,
      });
    }

    return NextResponse.json(
      { error: "Invalid request type" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error in rewards API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
