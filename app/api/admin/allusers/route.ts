import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { data, error } = await supabase.from("users").select("*")

    if (error) throw error

    // Map through the data and remove the password field
    const sanitizedData = data.map((user) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return NextResponse.json({ users: sanitizedData })
  } catch (error) {
    return NextResponse.json({ error: "Error fetching users." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { data, error } = await supabase.from("users").select("*")

    if (error) throw error

    // Map through the data and remove the password field
    const sanitizedData = data.map((user) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return NextResponse.json({ users: sanitizedData })
  } catch (error) {
    return NextResponse.json({ error: "Error fetching users." }, { status: 500 })
  }
}

