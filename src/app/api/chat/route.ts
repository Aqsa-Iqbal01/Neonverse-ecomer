import { NextResponse } from "next/server";
import { PRODUCT_CATALOG } from "@/lib/catalog";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const query = message.trim().toLowerCase();
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    let botReply = "";
    let matchedProducts: any[] = [];

    // Check for contact / owner intent
    const isContact = ["contact", "owner", "help", "support", "whatsapp", "call", "mushkil", "difficult"].some((w) =>
      query.includes(w)
    );

    if (isContact) {
      botReply = "Please contact the owner directly for assistance.";
    } else {
      // Use Gemini API directly with the pasted key
      if (apiKey) {
        try {
          const prompt = `You are a concise e-commerce chatbot for "Neonverse". 
          Catalog: ${JSON.stringify(PRODUCT_CATALOG.map(p => ({ name: p.name, category: p.category, price: p.price })))}
          User message: "${message}"

          Rules:
          1. Answer the user politely and naturally. 
          2. If they ask about products, state the exact full product names available in our store.
          3. If we don't have something, say it's not available.
          4. At the very end of your response, if relevant products are found, include [search: keyword].`;

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              botReply = text;
            }
          }
        } catch (e) {
          console.error("Gemini API error:", e);
        }
      }

      // Fallback if Gemini key is missing or failed
      if (!botReply) {
        const storeKeywords = ["laptop", "phone", "audio", "keyboard", "watch", "mouse", "monitor", "earbuds", "gaming", "speaker", "desk", "mic", "cam", "display", "headphone"];
        const foundKeyword = storeKeywords.find((kw) => query.includes(kw));

        if (foundKeyword || query.length > 2) {
          const searchKey = foundKeyword || query;
          matchedProducts = PRODUCT_CATALOG.filter(
            (p) =>
              p.name.toLowerCase().includes(searchKey) ||
              p.description.toLowerCase().includes(searchKey) ||
              p.category.toLowerCase().includes(searchKey)
          ).slice(0, 3);

          if (matchedProducts.length > 0) {
            const names = matchedProducts.map(p => `"${p.name}"`).join(", ");
            botReply = `Here are our available products: ${names}`;
          } else {
            botReply = "We do not have this item available.";
          }
        } else {
          botReply = "Hello! How can I help you with our store today?";
        }
      }

      // Extract search tag from Gemini reply to fetch product cards
      const matchTag = botReply.match(/\[search:\s*([^\]]+)\]/i);
      if (matchTag && matchTag[1]) {
        const searchTerm = matchTag[1].trim().toLowerCase();
        matchedProducts = PRODUCT_CATALOG.filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        ).slice(0, 3);
        botReply = botReply.replace(matchTag[0], "").trim();
      }

      if (matchedProducts.length === 0) {
        const words = query.split(/\s+/).filter(w => w.length > 2);
        for (const word of words) {
          const found = PRODUCT_CATALOG.filter(
            (p) =>
              p.name.toLowerCase().includes(word) ||
              p.category.toLowerCase().includes(word)
          );
          if (found.length > 0) {
            matchedProducts = found.slice(0, 3);
            break;
          }
        }
      }
    }

    return NextResponse.json({
      reply: botReply,
      products: matchedProducts,
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
