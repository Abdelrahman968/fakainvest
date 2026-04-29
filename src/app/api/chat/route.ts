import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const cleanResponse = (text: string): string => {
  if (!text) return "";

  let cleaned = text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/[•▪▸▹►→]+\s*/g, "• ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/�/g, "")
    .replace(/\s+/g, " ")
    .trim();

  cleaned = cleaned.replace(/^["']|["']$/g, "");

  return cleaned;
};

const getUserDataPrompt = (context: any) => {
  if (!context) return "";

  return ` **بيانات المستخدم الحقيقية (استخدمها في ردك):**
- الاسم: ${context.name || "المستخدم"}
- الرصيد الحالي: ${context.balance || 0} جنيه
- وضع التقريب: ${context.roundUpMode || "Eco"}
- مستوى المستخدم: ${context.level || 1}
- عدد الرسائل المسموحة: ${context.messagesLimit || "غير محدود"}
- درجة الصحة المالية: ${context.healthScore || 0}/100

**مهم:** استخدم هذه البيانات الحقيقية في ردك، مش أرقام وهمية.`;
};

export async function POST(request: Request) {
  try {
    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages are required" },
        { status: 400 },
      );
    }

    const userLevel = context?.level || 1;
    const userMessagesCount = context?.messagesCount || 0;
    let messagesLimit = 999;

    if (userLevel === 1) messagesLimit = 3;
    else if (userLevel === 2) messagesLimit = 6;
    else if (userLevel === 3) messagesLimit = 10;
    else if (userLevel === 4) messagesLimit = 15;
    else if (userLevel === 5) messagesLimit = 20;
    else if (userLevel >= 6) messagesLimit = 999;

    if (userMessagesCount >= messagesLimit && messagesLimit !== 999) {
      return NextResponse.json({
        text: `**وصلت للحد الأقصى للرسائل في مستواك الحالي!**

مستواك الحالي: المستوى ${userLevel}
عدد الرسائل المسموحة: ${messagesLimit} رسالة

💡 **عشان تزيد عدد الرسائل المسموحة:**
- ارفع مستواك عن طريق التفاعل مع التطبيق
- استخدم خاصية RoundUp
- حقق أهدافك الادخارية
- كل مستوى جديد يزود عدد الرسائل المسموحة

مستواك الحالي ${userLevel} -> ${userLevel + 1} هيخليك توصل لـ ${userLevel === 1 ? 6 : userLevel === 2 ? 10 : userLevel === 3 ? 15 : userLevel === 4 ? 20 : "غير محدود"} رسالة

حالياً وصلت لـ ${userMessagesCount}/${messagesLimit} رسالة`,
        error: "limit_reached",
      });
    }

    const userDataPrompt = getUserDataPrompt(context);

    const systemPrompt = `أنت **فكا-بوت**، المساعد المالي الذكي لتطبيق **فكا انفيست**.

🎯 **هويتك:**
- أنت فكا-بوت المصمم خصيصاً للمستخدمين المصريين.
- هدفك مساعدة المصريين في بناء مستقبل مالي حلال (بدون فوائد).

🗣️ **اللغة والتنسيق المهم:**
- **دائماً** رد بـ **العامية المصرية**.
- **ممنوع** استخدام الأحرف الغريبة مثل .
- استخدم سطر جديد بين الفقرات.
- استخدم إيموجي واحد بس في نهاية الرد.
- المبلغ يكتب "X جنيه".

📋 **قوانين أساسية:**
- **حسب الشريعة:** كل الاستثمارات حلال. **ممنوع** ذكر الفوائد.
- **استخدم بيانات المستخدم الحقيقية** في ردك (الرصيد، المستوى، إلخ).
- خليك إيجابي وشجع المستخدم.

${userDataPrompt}

**تذكر: ردودك تكون نظيفة بدون علامات أو أحرف غريبة.**`;

    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-10).map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      })),
    ];

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 800,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return NextResponse.json(
        { text: "عذراً، في مشكلة حالياً. حاول تاني بعد شوية" },
        { status: 200 },
      );
    }

    const data = await response.json();
    let replyText = data.choices?.[0]?.message?.content || "";

    replyText = cleanResponse(replyText);

    return NextResponse.json({ text: replyText });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { text: "عذراً، في مشكلة في الاتصال. حاول تاني بعد شوية" },
      { status: 200 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
