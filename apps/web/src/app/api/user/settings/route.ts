import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@astra/db";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { settings: true },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Retorna as configs ou um objeto padrão se ainda não existir no DB
    return NextResponse.json(user.settings || {
      notifyDaily: true,
      notifyMarriageExpire: true,
      notifyMarriageEnded: true,
      notifyMarriageRenew: true,
      notifyLoveLetter: true,
      notifyLevelUp: true,
      notifyGiveawayEnd: true,
    });
  } catch (error) {
    console.error("[USER_SETTINGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ...body,
      },
      update: {
        ...body,
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("[USER_SETTINGS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
