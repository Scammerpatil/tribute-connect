import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { name, desc } = await req.json();
    if (!name || !desc) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Write 3 different heartfelt tribute descriptions for a person named ${name}. Keep it short and meaningful. Take into account the following description: ${desc}. Each description should be unique and touching.`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    const options = text.split(/\n\d+\.\s/).filter((opt) => opt.trim());

    return NextResponse.json({ options });
  } catch (error) {
    console.error("Error generating description:", error);
    return NextResponse.json(
      { message: "Error generating description" },
      { status: 500 }
    );
  }
}
