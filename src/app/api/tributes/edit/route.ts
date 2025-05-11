import Tribute from "@/model/Tribute.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { tribute } = await req.json();
  if (!tribute) {
    return NextResponse.json({ message: "No tribute found" }, { status: 400 });
  }
  try {
    const updatedTribute = await Tribute.findByIdAndUpdate(
      tribute._id,
      {
        name: tribute.name,
        description: tribute.description,
        dob: tribute.dob,
        dod: tribute.dod,
        image: tribute.image,
        user: tribute.user,
        supportingDocument: tribute.supportingDocument,
      },
      { new: true }
    );
    if (!updatedTribute) {
      return NextResponse.json(
        { message: "Failed to edit tribute" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Tribute edited successfully", tribute: updatedTribute },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to edit tribute" },
      { status: 500 }
    );
  }
}
